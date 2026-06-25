import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  querySimulationV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("M3-SUCCESSION-STATE-MACHINE-001 minimal succession state machine", () => {
  test("ruler death vacates held offices, keeps jurisdiction policies, and creates a pending crisis", () => {
    let runtime = bootSuccessionRuntime();
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m3.succession.death.1", "system", runtime, 1, "dead")
    );

    const m3 = requireM3(runtime.world);
    expect(m3.characters.find((character) => character.characterId === 1)).toMatchObject({
      alive: false,
      incapacitated: false
    });
    expect(m3.offices.find((office) => office.officeId === 1)).toMatchObject({
      holderCharacterId: null,
      policyId: 101
    });
    expect(m3.policies.find((policy) => policy.policyId === 101)).toMatchObject({
      stance: "military",
      intensityBps: 6_000
    });
    expect(m3.enfeoffments).toEqual([]);
    expect(m3.policies.find((policy) => policy.policyId === 201)).toMatchObject({
      target: { kind: "district", districtId: 2 },
      stance: "conciliatory"
    });
    expect(m3.relationships).toEqual([
      { sourceCharacterId: 2, targetCharacterId: 3, affinityBps: 500 }
    ]);
    expect(m3.successionCrises).toHaveLength(1);
    expect(m3.successionCrises[0]).toMatchObject({
      id: 1,
      polityId: 1,
      status: "pending",
      trigger: { kind: "death", characterId: 1, officeId: 1 }
    });
    expect(m3.successionCrises[0]?.candidates.map((candidate) => candidate.characterId)).toEqual([
      2, 3
    ]);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("peaceful succession resolves through the same command path for player and AI", () => {
    let playerRuntime = bootSuccessionRuntime();
    let aiRuntime = bootSuccessionRuntime();

    playerRuntime = accepted(
      playerRuntime,
      recordCharacterStatusCommand("m3.succession.peace.death", "player", playerRuntime, 1, "dead")
    );
    aiRuntime = accepted(
      aiRuntime,
      recordCharacterStatusCommand("m3.succession.peace.death", "ai", aiRuntime, 1, "dead")
    );
    playerRuntime = accepted(
      playerRuntime,
      resolveSuccessionCommand("m3.succession.peace.resolve", "player", playerRuntime, 1)
    );
    aiRuntime = accepted(
      aiRuntime,
      resolveSuccessionCommand("m3.succession.peace.resolve", "ai", aiRuntime, 1)
    );

    expect(playerRuntime.world.meta.stateHash).toBe(aiRuntime.world.meta.stateHash);
    const m3 = requireM3(playerRuntime.world);
    expect(m3.offices.find((office) => office.officeId === 1)).toMatchObject({
      holderCharacterId: 2,
      policyId: 101
    });
    expect(m3.successionCrises[0]).toMatchObject({
      status: "resolved",
      outcome: {
        kind: "peaceful",
        successorCharacterId: 2,
        supportTotalBps: 9_200
      }
    });
    expect(successionQuery(playerRuntime).crises[0]?.candidates[0]).toMatchObject({
      characterId: 2,
      supportTotalBps: 9_200,
      supportSources: [
        { kind: "kinship", strengthBps: 2_500 },
        { kind: "designation", strengthBps: 3_000 },
        { kind: "court", strengthBps: 2_000 },
        { kind: "military", strengthBps: 1_700 }
      ]
    });
  });

  test("dead characters cannot command, receive new offices, or become new relationship endpoints", () => {
    let runtime = bootSuccessionRuntime();
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m3.succession.dead.blockers", "system", runtime, 1, "dead")
    );

    expect(
      submitCommandV1(
        runtime,
        appointOfficeCommand("m3.succession.dead.appoint", "player", runtime, 2, 1, "polity:1")
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "character-unavailable", path: "payload.characterId" }
    });
    expect(
      submitCommandV1(
        runtime,
        appointOfficeCommand("m3.succession.dead.command", "ai", runtime, 2, 2, "character:1")
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "authority-denied", path: "actor.id" }
    });
    expect(
      submitCommandV1(
        runtime,
        createRelationshipCommand("m3.succession.dead.relationship", "player", runtime, 2, 1)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "character-unavailable", path: "payload.targetCharacterId" }
    });
  });

  test("record-character-status rejects incapacitating an already-dead character", () => {
    let runtime = bootSuccessionRuntime();
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m3.succession.dead.once", "system", runtime, 1, "dead")
    );
    const stateHashBeforeInvalidCommand = runtime.world.meta.stateHash;

    const submitted = submitCommandV1(
      runtime,
      recordCharacterStatusCommand(
        "m3.succession.dead.incap",
        "system",
        runtime,
        1,
        "incapacitated"
      )
    );

    expect(submitted.result).toMatchObject({
      status: "rejected",
      error: { code: "succession-state-invalid", path: "payload.status" }
    });
    expect(submitted.runtime.world.meta.stateHash).toBe(stateHashBeforeInvalidCommand);
    expect(
      requireM3(submitted.runtime.world).characters.find((entry) => entry.characterId === 1)
    ).toMatchObject({
      alive: false,
      incapacitated: false
    });
    expect(validateWorldStateV0(submitted.runtime.world)).toEqual([]);
  });

  test("close support creates a deterministic disputed outcome without assigning a ruler", () => {
    let runtime = bootSuccessionRuntime({
      candidateProfiles: [
        disputedProfile(2, [
          { kind: "kinship", strengthBps: 2_500, sourceId: "kin.elder" },
          { kind: "court", strengthBps: 2_000, sourceId: "court.inner" }
        ]),
        disputedProfile(3, [
          { kind: "kinship", strengthBps: 2_500, sourceId: "kin.younger" },
          { kind: "military", strengthBps: 2_000, sourceId: "guard.field" }
        ])
      ]
    });
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m3.succession.disputed.death", "system", runtime, 1, "dead")
    );
    runtime = accepted(
      runtime,
      resolveSuccessionCommand("m3.succession.disputed.resolve", "system", runtime, 1)
    );

    const crisis = requireM3(runtime.world).successionCrises[0];
    expect(crisis).toMatchObject({
      status: "resolved",
      outcome: {
        kind: "disputed",
        leadingCharacterId: 2,
        rivalCharacterId: 3,
        supportMarginBps: 0
      }
    });
    expect(requireM3(runtime.world).offices.find((office) => office.officeId === 1)).toMatchObject({
      holderCharacterId: null
    });
  });

  test("property invariants canonicalize candidate profile order with stable tie-breakers", () => {
    fc.assert(
      fc.property(fc.boolean(), (reverseOrder) => {
        const profiles = [
          disputedProfile(2, [
            { kind: "kinship", strengthBps: 1_000, sourceId: "kin.a" },
            { kind: "court", strengthBps: 1_000, sourceId: "court.a" }
          ]),
          disputedProfile(3, [
            { kind: "kinship", strengthBps: 1_000, sourceId: "kin.b" },
            { kind: "court", strengthBps: 1_000, sourceId: "court.b" }
          ])
        ];
        const first = createSuccessionWorld({ candidateProfiles: profiles });
        const second = createSuccessionWorld({
          candidateProfiles: reverseOrder ? [...profiles].reverse() : profiles
        });

        expect(first.meta.stateHash).toBe(second.meta.stateHash);
        expect(validateWorldStateV0(first)).toEqual([]);
      }),
      { numRuns: 16, seed: 1531 }
    );
  });

  test("malformed M3 succession arrays return structured invalid-schema errors", () => {
    const missingProfiles = cloneWorldRecord(createSuccessionWorld());
    const missingProfilesM3 = requireRecordPath(missingProfiles, ["state", "m3"]);
    delete missingProfilesM3["successionCandidateProfiles"];

    expect(() => validateWorldStateV0(missingProfiles)).not.toThrow();
    expect(validateWorldStateV0(missingProfiles)).toContainEqual({
      code: "invalid-schema",
      path: "state.m3.successionCandidateProfiles",
      message: "state.m3.successionCandidateProfiles must be an array."
    });

    const missingCrises = cloneWorldRecord(createSuccessionWorld());
    const missingCrisesM3 = requireRecordPath(missingCrises, ["state", "m3"]);
    delete missingCrisesM3["successionCrises"];

    expect(() => validateWorldStateV0(missingCrises)).not.toThrow();
    expect(validateWorldStateV0(missingCrises)).toContainEqual({
      code: "invalid-schema",
      path: "state.m3.successionCrises",
      message: "state.m3.successionCrises must be an array."
    });
  });

  test("malformed M3 succession entries return stable invalid-schema paths", () => {
    const world = cloneWorldRecord(createSuccessionWorld());
    const m3 = requireRecordPath(world, ["state", "m3"]);
    const profiles = requireArrayField(m3, "successionCandidateProfiles");
    const profile = requireRecordAt(profiles, 0);
    const sources = requireArrayField(profile, "supportSources");
    const source = requireRecordAt(sources, 0);
    const crises = requireArrayField(m3, "successionCrises");

    delete source["kind"];
    profile["requiresRegency"] = "false";
    crises.push({
      id: 1,
      polityId: 1,
      trigger: { kind: "storm", characterId: 1, officeId: 1 },
      status: "resolved",
      startedDay: 0,
      resolvedDay: 0,
      candidates: [
        {
          characterId: 2,
          requiresRegency: false,
          supportSources: [{ kind: "kinship", strengthBps: 1_000, sourceId: "kin.test" }],
          supportTotalBps: 1_000
        }
      ],
      outcome: { kind: "peaceful", successorCharacterId: 2 },
      reasonCode: "validation"
    });

    expect(() => validateWorldStateV0(world)).not.toThrow();
    expect(validateWorldStateV0(world)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCandidateProfiles[0].requiresRegency"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCandidateProfiles[0].supportSources[0].kind"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCrises[0].trigger.kind"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCrises[0].outcome.supportTotalBps"
        })
      ])
    );
  });

  test("missing M3 character incapacitated returns a structured invalid-schema error", () => {
    const world = cloneWorldRecord(createSuccessionWorld());
    const characters = requireArrayField(requireRecordPath(world, ["state", "m3"]), "characters");
    const character = requireRecordAt(characters, 0);
    delete character["incapacitated"];

    expect(() => validateWorldStateV0(world)).not.toThrow();
    expect(validateWorldStateV0(world)).toContainEqual({
      code: "invalid-schema",
      path: "state.m3.characters[0].incapacitated",
      message: "state.m3.characters[0].incapacitated must be a boolean."
    });
  });

  test("validateWorldStateV0 rejects unavailable office and enfeoffment holders", () => {
    const deadHolderWorld = cloneWorldRecord(createSuccessionWorld());
    const deadHolderCharacters = requireArrayField(
      requireRecordPath(deadHolderWorld, ["state", "m3"]),
      "characters"
    );
    const deadHolder = requireRecordAt(deadHolderCharacters, 0);
    deadHolder["alive"] = false;
    deadHolder["incapacitated"] = true;

    expect(() => validateWorldStateV0(deadHolderWorld)).not.toThrow();
    expect(validateWorldStateV0(deadHolderWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.characters[0].incapacitated"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.offices[0].holderCharacterId"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.enfeoffments[0].holderCharacterId"
        })
      ])
    );

    const incapacitatedHolderWorld = cloneWorldRecord(createSuccessionWorld());
    const incapacitatedHolderCharacters = requireArrayField(
      requireRecordPath(incapacitatedHolderWorld, ["state", "m3"]),
      "characters"
    );
    requireRecordAt(incapacitatedHolderCharacters, 0)["incapacitated"] = true;

    expect(() => validateWorldStateV0(incapacitatedHolderWorld)).not.toThrow();
    expect(validateWorldStateV0(incapacitatedHolderWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.offices[0].holderCharacterId"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.enfeoffments[0].holderCharacterId"
        })
      ])
    );
  });
});

type SuccessionSupportFixture = {
  readonly kind:
    | "kinship"
    | "designation"
    | "court"
    | "military"
    | "provincial"
    | "suzerain"
    | "foreign";
  readonly strengthBps: number;
  readonly sourceId: string;
};

type SuccessionCandidateProfileFixture = {
  readonly polityId: number;
  readonly characterId: number;
  readonly requiresRegency: boolean;
  readonly supportSources: readonly SuccessionSupportFixture[];
};

function bootSuccessionRuntime(
  input: {
    readonly candidateProfiles?: readonly SuccessionCandidateProfileFixture[];
  } = {}
): SimulationRuntimeV1 {
  return {
    world: createSuccessionWorld(input),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createSuccessionWorld(
  input: {
    readonly candidateProfiles?: readonly SuccessionCandidateProfileFixture[];
  } = {}
): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.succession.polity_001" }),
      definePolity({ id: 2, displayNameKey: "content.m3.succession.polity_002" })
    ],
    persons: [
      definePerson({ id: 1, displayNameKey: "content.m3.succession.character_001" }),
      definePerson({ id: 2, displayNameKey: "content.m3.succession.character_002" }),
      definePerson({ id: 3, displayNameKey: "content.m3.succession.character_003" }),
      definePerson({ id: 4, displayNameKey: "content.m3.succession.character_004" })
    ],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.succession.district_001" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.succession.district_002" })
    ],
    settlements: [],
    routes: []
  };

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.succession.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: 2 },
        { polityId: 2, directSuzerainPolityId: null }
      ],
      characters: [
        character(1, true, false, 1, 8_000, 8_000),
        character(2, true, false, 1, 7_000, 7_000),
        character(3, true, false, 1, 6_000, 6_000),
        character(4, true, false, 2, 6_000, 6_000)
      ],
      relationships: [
        { sourceCharacterId: 1, targetCharacterId: 2, affinityBps: 2_000 },
        { sourceCharacterId: 2, targetCharacterId: 1, affinityBps: 2_000 },
        { sourceCharacterId: 2, targetCharacterId: 3, affinityBps: 500 }
      ],
      offices: [
        {
          officeId: 1,
          polityId: 1,
          jurisdiction: { kind: "polity", polityId: 1 },
          officeKind: "minister",
          primary: true,
          holderCharacterId: 1,
          policyId: 101,
          minimumCommandBps: 0,
          minimumAdministrationBps: 4_000
        },
        {
          officeId: 2,
          polityId: 1,
          jurisdiction: { kind: "district", districtId: 1 },
          officeKind: "governor",
          primary: false,
          holderCharacterId: null,
          policyId: 102,
          minimumCommandBps: 0,
          minimumAdministrationBps: 4_000
        }
      ],
      policies: [
        {
          policyId: 101,
          target: { kind: "office", officeId: 1 },
          stance: "military",
          intensityBps: 6_000
        },
        {
          policyId: 102,
          target: { kind: "office", officeId: 2 },
          stance: "balanced",
          intensityBps: 5_000
        },
        {
          policyId: 201,
          target: { kind: "district", districtId: 2 },
          stance: "conciliatory",
          intensityBps: 5_000
        }
      ],
      administrativeDistricts: [
        {
          polityId: 1,
          districtId: 1,
          controlMode: "direct",
          localComplexity: 50,
          communicationCost: 50,
          directness: 50,
          frontierPressure: 25,
          administrativeCapacity: 1_000
        },
        {
          polityId: 1,
          districtId: 2,
          controlMode: "vassal",
          localComplexity: 50,
          communicationCost: 75,
          directness: 75,
          frontierPressure: 50,
          administrativeCapacity: 1_000
        }
      ],
      enfeoffments: [
        {
          districtId: 2,
          holderCharacterId: 1,
          grantedByPolityId: 1,
          policyId: 201,
          grantedDay: 0,
          reasonCode: "validation"
        }
      ],
      successionCandidateProfiles: input.candidateProfiles ?? [
        {
          polityId: 1,
          characterId: 2,
          requiresRegency: false,
          supportSources: [
            { kind: "kinship", strengthBps: 2_500, sourceId: "kin.named-heir" },
            { kind: "designation", strengthBps: 3_000, sourceId: "designation.ruler" },
            { kind: "court", strengthBps: 2_000, sourceId: "court.inner" },
            { kind: "military", strengthBps: 1_700, sourceId: "guard.field" }
          ]
        },
        {
          polityId: 1,
          characterId: 3,
          requiresRegency: false,
          supportSources: [
            { kind: "kinship", strengthBps: 1_500, sourceId: "kin.branch" },
            { kind: "provincial", strengthBps: 1_500, sourceId: "province.lower" },
            { kind: "suzerain", strengthBps: 700, sourceId: "polity.2" },
            { kind: "foreign", strengthBps: 300, sourceId: "foreign.merchant" }
          ]
        }
      ]
    })
  });
}

function character(
  characterId: number,
  alive: boolean,
  incapacitated: boolean,
  polityId: number,
  commandBps: number,
  administrationBps: number
) {
  return {
    characterId,
    polityId,
    alive,
    incapacitated,
    currentDistrictId: 1,
    commandBps,
    administrationBps,
    diplomacyBps: 5_000
  };
}

function disputedProfile(
  characterId: number,
  supportSources: readonly SuccessionSupportFixture[]
): SuccessionCandidateProfileFixture {
  return {
    polityId: 1,
    characterId,
    requiresRegency: false,
    supportSources
  };
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  expect(submitted.result.status).toBe("accepted");
  return submitted.runtime;
}

function recordCharacterStatusCommand(
  commandId: string,
  actorKind: "ai" | "player" | "system",
  runtime: SimulationRuntimeV1,
  characterId: number,
  status: "dead" | "incapacitated",
  actorId = "polity:1"
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.record-character-status",
    commandId,
    actor: { kind: actorKind, id: actorKind === "system" ? "succession-system" : actorId },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      characterId,
      status,
      reasonCode: "validation"
    }
  };
}

function resolveSuccessionCommand(
  commandId: string,
  actorKind: "ai" | "player" | "system",
  runtime: SimulationRuntimeV1,
  successionId: number,
  actorId = "polity:1"
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.resolve-succession",
    commandId,
    actor: { kind: actorKind, id: actorKind === "system" ? "succession-system" : actorId },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      successionId,
      reasonCode: "validation"
    }
  };
}

function appointOfficeCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  officeId: number,
  characterId: number | null,
  actorId: string
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.appoint-office",
    commandId,
    actor: { kind: actorKind, id: actorId },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      officeId,
      characterId,
      reasonCode: "validation"
    }
  };
}

function createRelationshipCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  sourceCharacterId: number,
  targetCharacterId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.create-character-relationship",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      sourceCharacterId,
      targetCharacterId,
      affinityBps: 1_000,
      reasonCode: "validation"
    }
  };
}

function successionQuery(runtime: SimulationRuntimeV1): {
  readonly crises: readonly {
    readonly candidates: readonly {
      readonly characterId: number;
      readonly supportTotalBps: number;
      readonly supportSources: readonly SuccessionSupportFixture[];
    }[];
  }[];
} {
  const queried = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m3-succession-crises"
  });
  expect(queried.status).toBe("ok");
  if (queried.status !== "ok" || queried.result.kind !== "sim.list-m3-succession-crises") {
    throw new Error("Expected M3 succession query result.");
  }
  return queried.result;
}

function requireM3(world: WorldStateV0): NonNullable<WorldStateV0["state"]["m3"]> {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    throw new Error("Expected M3 state.");
  }
  return m3;
}

function cloneWorldRecord(world: WorldStateV0): Record<string, unknown> {
  const cloned: unknown = JSON.parse(JSON.stringify(world));
  if (!isRecord(cloned)) {
    throw new Error("Expected cloned world record.");
  }
  return cloned;
}

function requireRecordPath(
  root: Record<string, unknown>,
  path: readonly string[]
): Record<string, unknown> {
  let current: unknown = root;
  for (const segment of path) {
    if (!isRecord(current)) {
      throw new Error(`Expected record at ${path.join(".")}.`);
    }
    current = current[segment];
  }
  if (!isRecord(current)) {
    throw new Error(`Expected record at ${path.join(".")}.`);
  }
  return current;
}

function requireArrayField(record: Record<string, unknown>, key: string): unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`Expected array field ${key}.`);
  }
  return value;
}

function requireRecordAt(values: readonly unknown[], index: number): Record<string, unknown> {
  const value = values[index];
  if (!isRecord(value)) {
    throw new Error(`Expected record at index ${index}.`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

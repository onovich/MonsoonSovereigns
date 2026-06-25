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

describe("M3-APPOINTMENT-ENFEOFFMENT-001 appointments, policies, and reason scaffolds", () => {
  test("player and AI use the same appointment command path and primary offices are exclusive", () => {
    let playerRuntime = bootAppointmentRuntime();
    let aiRuntime = bootAppointmentRuntime();

    playerRuntime = accepted(
      playerRuntime,
      appointOfficeCommand("m3.appoint.player.1", "player", playerRuntime, 1, 1)
    );
    aiRuntime = accepted(aiRuntime, appointOfficeCommand("m3.appoint.ai.1", "ai", aiRuntime, 1, 1));
    expect(
      playerRuntime.world.state.m3?.offices.find((office) => office.officeId === 1)
    ).toMatchObject({
      holderCharacterId: 1
    });
    expect(aiRuntime.world.state.m3?.offices.find((office) => office.officeId === 1)).toMatchObject(
      {
        holderCharacterId: 1
      }
    );

    const rejected = submitCommandV1(
      playerRuntime,
      appointOfficeCommand("m3.appoint.primary-conflict", "player", playerRuntime, 2, 1)
    );
    expect(rejected.result).toMatchObject({
      status: "rejected",
      error: { code: "office-primary-conflict", path: "payload.characterId" }
    });
    expect(rejected.runtime.world.meta.stateHash).toBe(playerRuntime.world.meta.stateHash);
  });

  test("rejects dead, invalid, misplaced, ineligible, and unauthorized appointments", () => {
    const runtime = bootAppointmentRuntime();

    expect(
      submitCommandV1(runtime, appointOfficeCommand("m3.appoint.dead", "player", runtime, 1, 3))
        .result
    ).toMatchObject({
      status: "rejected",
      error: { code: "character-unavailable", path: "payload.characterId" }
    });
    expect(
      submitCommandV1(
        runtime,
        appointOfficeCommand("m3.appoint.invalid-character", "player", runtime, 1, 404)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "bad-id", path: "payload.characterId" }
    });
    expect(
      submitCommandV1(runtime, appointOfficeCommand("m3.appoint.location", "player", runtime, 3, 2))
        .result
    ).toMatchObject({
      status: "rejected",
      error: { code: "character-location-invalid", path: "payload.characterId" }
    });
    expect(
      submitCommandV1(runtime, appointOfficeCommand("m3.appoint.skill", "player", runtime, 1, 4))
        .result
    ).toMatchObject({
      status: "rejected",
      error: { code: "office-eligibility-failed", path: "payload.characterId" }
    });
    expect(
      submitCommandV1(
        runtime,
        appointOfficeCommand("m3.appoint.unauthorized", "player", runtime, 1, 1, "player:ui")
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "authority-denied", path: "actor.id" }
    });
  });

  test("office policies persist across holder changes while holder ability changes visible reasons", () => {
    let runtime = bootAppointmentRuntime();
    runtime = accepted(
      runtime,
      updateOfficePolicyCommand("m3.policy.office.1", "player", runtime, 101, "military", 7_000)
    );
    runtime = accepted(
      runtime,
      appointOfficeCommand("m3.appoint.office.1", "player", runtime, 1, 1)
    );

    const skilled = decisionScaffolds(runtime);
    expect(skilled.offices.find((office) => office.officeId === 1)).toMatchObject({
      holderCharacterId: 1,
      policyId: 101,
      executionPerformanceBps: 10_000,
      reasonCodes: [
        "appointment.holder.skill-strong",
        "appointment.relationship.supportive",
        "policy.office.military"
      ]
    });

    runtime = accepted(
      runtime,
      appointOfficeCommand("m3.appoint.office.2", "player", runtime, 1, 2)
    );
    const replaced = decisionScaffolds(runtime);
    expect(replaced.offices.find((office) => office.officeId === 1)).toMatchObject({
      holderCharacterId: 2,
      policyId: 101,
      executionPerformanceBps: 2_100,
      reasonCodes: [
        "appointment.holder.skill-weak",
        "appointment.relationship.strained",
        "policy.office.military"
      ]
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("enfeoffment updates jurisdiction policy and administrative mode through authority-checked command", () => {
    let runtime = bootAppointmentRuntime();
    runtime = accepted(
      runtime,
      enfeoffDistrictCommand("m3.enfeoff.1", "ai", runtime, 2, 2, 1, 201)
    );
    runtime = accepted(
      runtime,
      updateJurisdictionPolicyCommand(
        "m3.policy.jurisdiction.1",
        "ai",
        runtime,
        201,
        "conciliatory",
        6_000
      )
    );

    const m3 = runtime.world.state.m3;
    expect(m3?.enfeoffments).toEqual([
      expect.objectContaining({
        districtId: 2,
        holderCharacterId: 2,
        grantedByPolityId: 1,
        policyId: 201
      })
    ]);
    expect(m3?.administrativeDistricts.find((entry) => entry.districtId === 2)).toMatchObject({
      polityId: 1,
      districtId: 2,
      controlMode: "vassal"
    });
    expect(decisionScaffolds(runtime).enfeoffments).toEqual([
      expect.objectContaining({
        districtId: 2,
        holderCharacterId: 2,
        reasonCodes: ["enfeoffment.local-holder", "policy.jurisdiction.conciliatory"]
      })
    ]);
  });

  test("bulk appointments validate all items first and report stable per-item rejection reasons", () => {
    const runtime = bootAppointmentRuntime();
    const rejected = submitCommandV1(runtime, {
      schemaVersion: 1,
      kind: "sim.appoint-offices-bulk",
      commandId: "m3.appoint.bulk.reject",
      actor: { kind: "player", id: "polity:1" },
      expectedDay: runtime.world.meta.currentDay,
      expectedRevision: runtime.world.meta.revision,
      payload: {
        items: [
          { itemId: "z-dead", officeId: 1, characterId: 3, reasonCode: "validation" },
          { itemId: "a-missing", officeId: 404, characterId: 1, reasonCode: "validation" }
        ]
      }
    });

    expect(rejected.result).toMatchObject({
      status: "rejected",
      error: {
        code: "bulk-command-rejected",
        path: "payload.items",
        message:
          "sim.appoint-offices-bulk rejected items: a-missing=office-missing;z-dead=character-unavailable"
      }
    });
    expect(rejected.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
  });

  test("bulk appointments reject collective primary-office conflicts before mutation", () => {
    const runtime = bootAppointmentRuntime();
    const rejected = submitCommandV1(runtime, {
      schemaVersion: 1,
      kind: "sim.appoint-offices-bulk",
      commandId: "m3.appoint.bulk.primary-conflict",
      actor: { kind: "player", id: "polity:1" },
      expectedDay: runtime.world.meta.currentDay,
      expectedRevision: runtime.world.meta.revision,
      payload: {
        items: [
          { itemId: "z-primary", officeId: 2, characterId: 1, reasonCode: "validation" },
          { itemId: "a-primary", officeId: 1, characterId: 1, reasonCode: "validation" }
        ]
      }
    });

    expect(rejected.result).toMatchObject({
      status: "rejected",
      error: {
        code: "bulk-command-rejected",
        path: "payload.items",
        message:
          "sim.appoint-offices-bulk rejected items: a-primary=office-primary-conflict;z-primary=office-primary-conflict"
      }
    });
    expect(rejected.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
  });

  test("bulk appointments are deterministic across equivalent input orderings", () => {
    const first = accepted(
      bootAppointmentRuntime(),
      bulkAppointmentCommand("m3.appoint.bulk.first", bootAppointmentRuntime(), [
        { itemId: "b", officeId: 3, characterId: 1 },
        { itemId: "a", officeId: 1, characterId: 2 }
      ])
    );
    const second = accepted(
      bootAppointmentRuntime(),
      bulkAppointmentCommand("m3.appoint.bulk.first", bootAppointmentRuntime(), [
        { itemId: "a", officeId: 1, characterId: 2 },
        { itemId: "b", officeId: 3, characterId: 1 }
      ])
    );

    expect(first.world.meta.stateHash).toBe(second.world.meta.stateHash);
  });

  test("enfeoffment rejects unknown granting polity before invariant fallback", () => {
    const runtime = bootAppointmentRuntime();
    const rejected = submitCommandV1(
      runtime,
      enfeoffDistrictCommand("m3.enfeoff.unknown-grantor", "ai", runtime, 2, 2, 999, 201)
    );

    expect(rejected.result).toMatchObject({
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.grantedByPolityId"
      }
    });
    expect(rejected.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
  });

  test("property invariants keep appointment rejection reason codes stable", () => {
    fc.assert(
      fc.property(
        fc.record({
          officeId: fc.integer({ min: 1, max: 4 }),
          characterId: fc.integer({ min: 1, max: 5 })
        }),
        (input) => {
          const runtime = bootAppointmentRuntime();
          const first = submitCommandV1(
            runtime,
            appointOfficeCommand(
              "m3.appoint.property.first",
              "ai",
              runtime,
              input.officeId,
              input.characterId
            )
          );
          const second = submitCommandV1(
            runtime,
            appointOfficeCommand(
              "m3.appoint.property.second",
              "ai",
              runtime,
              input.officeId,
              input.characterId
            )
          );

          if (first.result.status === "rejected" || second.result.status === "rejected") {
            expect(first.result.status).toBe("rejected");
            expect(second.result.status).toBe("rejected");
            if (first.result.status === "rejected" && second.result.status === "rejected") {
              expect(first.result.error.code).toBe(second.result.error.code);
              expect(first.result.error.path).toBe(second.result.error.path);
            }
          }
        }
      ),
      { numRuns: 32, seed: 1531 }
    );
  });
});

function bootAppointmentRuntime(): SimulationRuntimeV1 {
  return {
    world: createAppointmentWorld(),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createAppointmentWorld(): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.validation.polity_001" }),
      definePolity({ id: 2, displayNameKey: "content.m3.validation.polity_002" })
    ],
    persons: [
      definePerson({ id: 1, displayNameKey: "content.m3.validation.character_001" }),
      definePerson({ id: 2, displayNameKey: "content.m3.validation.character_002" }),
      definePerson({ id: 3, displayNameKey: "content.m3.validation.character_003" }),
      definePerson({ id: 4, displayNameKey: "content.m3.validation.character_004" })
    ],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.validation.district_001" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.validation.district_002" })
    ],
    settlements: [],
    routes: []
  };

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.appointment.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: 1 }
      ],
      characters: [
        {
          characterId: 1,
          polityId: 1,
          alive: true,
          incapacitated: false,
          currentDistrictId: 1,
          commandBps: 8_000,
          administrationBps: 9_000,
          diplomacyBps: 6_000
        },
        {
          characterId: 2,
          polityId: 1,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 5_000,
          administrationBps: 4_000,
          diplomacyBps: 6_000
        },
        {
          characterId: 3,
          polityId: 1,
          alive: false,
          incapacitated: false,
          currentDistrictId: 1,
          commandBps: 9_000,
          administrationBps: 9_000,
          diplomacyBps: 9_000
        },
        {
          characterId: 4,
          polityId: 1,
          alive: true,
          incapacitated: false,
          currentDistrictId: 1,
          commandBps: 2_000,
          administrationBps: 2_000,
          diplomacyBps: 2_000
        }
      ],
      relationships: [
        { sourceCharacterId: 1, targetCharacterId: 2, affinityBps: 2_000 },
        { sourceCharacterId: 2, targetCharacterId: 1, affinityBps: -2_000 }
      ],
      offices: [
        {
          officeId: 1,
          polityId: 1,
          jurisdiction: { kind: "polity", polityId: 1 },
          officeKind: "minister",
          primary: true,
          holderCharacterId: null,
          policyId: 101,
          minimumCommandBps: 0,
          minimumAdministrationBps: 4_000
        },
        {
          officeId: 2,
          polityId: 1,
          jurisdiction: { kind: "polity", polityId: 1 },
          officeKind: "commander",
          primary: true,
          holderCharacterId: null,
          policyId: 102,
          minimumCommandBps: 4_000,
          minimumAdministrationBps: 0
        },
        {
          officeId: 3,
          polityId: 1,
          jurisdiction: { kind: "district", districtId: 1 },
          officeKind: "governor",
          primary: false,
          holderCharacterId: null,
          policyId: 103,
          minimumCommandBps: 0,
          minimumAdministrationBps: 4_000
        }
      ],
      policies: [
        {
          policyId: 101,
          target: { kind: "office", officeId: 1 },
          stance: "balanced",
          intensityBps: 5_000
        },
        {
          policyId: 102,
          target: { kind: "office", officeId: 2 },
          stance: "balanced",
          intensityBps: 5_000
        },
        {
          policyId: 103,
          target: { kind: "office", officeId: 3 },
          stance: "balanced",
          intensityBps: 5_000
        },
        {
          policyId: 201,
          target: { kind: "district", districtId: 2 },
          stance: "balanced",
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
          controlMode: "direct",
          localComplexity: 50,
          communicationCost: 75,
          directness: 75,
          frontierPressure: 50,
          administrativeCapacity: 1_000
        }
      ]
    })
  });
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  expect(submitted.result.status).toBe("accepted");
  return submitted.runtime;
}

function decisionScaffolds(runtime: SimulationRuntimeV1): {
  readonly offices: readonly {
    readonly officeId: number;
    readonly holderCharacterId: number | null;
    readonly policyId: number;
    readonly executionPerformanceBps: number;
    readonly reasonCodes: readonly string[];
  }[];
  readonly enfeoffments: readonly {
    readonly districtId: number;
    readonly holderCharacterId: number;
    readonly reasonCodes: readonly string[];
  }[];
} {
  const queried = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m3-decision-scaffolds"
  });
  expect(queried.status).toBe("ok");
  if (queried.status !== "ok" || queried.result.kind !== "sim.list-m3-decision-scaffolds") {
    throw new Error("Expected M3 decision scaffold query result.");
  }

  return queried.result;
}

function appointOfficeCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  officeId: number,
  characterId: number | null,
  actorId = "polity:1"
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

function bulkAppointmentCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  items: readonly {
    readonly itemId: string;
    readonly officeId: number;
    readonly characterId: number | null;
  }[]
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.appoint-offices-bulk",
    commandId,
    actor: { kind: "ai", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      items: items.map((item) => ({ ...item, reasonCode: "validation" }))
    }
  };
}

function updateOfficePolicyCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  policyId: number,
  stance: "balanced" | "conciliatory" | "extractive" | "military",
  intensityBps: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.update-office-policy",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      policyId,
      stance,
      intensityBps,
      reasonCode: "validation"
    }
  };
}

function updateJurisdictionPolicyCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  policyId: number,
  stance: "balanced" | "conciliatory" | "extractive" | "military",
  intensityBps: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.update-jurisdiction-policy",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      policyId,
      stance,
      intensityBps,
      reasonCode: "validation"
    }
  };
}

function enfeoffDistrictCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  districtId: number,
  holderCharacterId: number,
  grantedByPolityId: number,
  policyId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.enfeoff-district",
    commandId,
    actor: { kind: actorKind, id: `polity:${grantedByPolityId}` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      districtId,
      holderCharacterId,
      grantedByPolityId,
      policyId,
      reasonCode: "validation"
    }
  };
}

import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM6DiplomacyLegitimacyStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  hashWorldStateV0,
  loadSaveV1,
  parsePolityId,
  querySimulationV1,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";
import {
  createSaveEnvelopeV1,
  encodeSaveEnvelopeV1,
  saveWorldStateV0DtoToCandidate,
  type SaveWorldSnapshotV0Dto
} from "../packages/save-format/src/index";

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

  test("abdication-like scenario trigger keeps the former holder available and creates continuity", () => {
    let runtime = bootSuccessionRuntime();
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand(
        "m6.succession.abdication.trigger",
        "system",
        runtime,
        1,
        "abdicated"
      )
    );
    runtime = accepted(
      runtime,
      resolveSuccessionCommand("m6.succession.abdication.resolve", "system", runtime, 1)
    );

    const m3 = requireM3(runtime.world);
    expect(m3.characters.find((character) => character.characterId === 1)).toMatchObject({
      alive: true,
      incapacitated: false
    });
    expect(m3.relationships).toEqual([
      { sourceCharacterId: 1, targetCharacterId: 2, affinityBps: 2_000 },
      { sourceCharacterId: 2, targetCharacterId: 1, affinityBps: 2_000 },
      { sourceCharacterId: 2, targetCharacterId: 3, affinityBps: 500 }
    ]);
    expect(m3.successionCrises[0]).toMatchObject({
      trigger: { kind: "abdication", characterId: 1, officeId: 1 },
      outcome: { kind: "peaceful", successorCharacterId: 2, supportTotalBps: 9_200 }
    });
    expect(runtime.world.state.m6?.legitimacySources).toContainEqual(
      expect.objectContaining({
        polityId: parsePolityId(1),
        audience: "vassal-rulers",
        sourceKind: "succession-continuity",
        magnitudeBps: 700,
        sourceRef: "m3.succession.1",
        reasonCode: "legitimacy.source.succession-continuity"
      })
    );
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("regency resolution assigns the successor and records a lower succession legitimacy source", () => {
    let runtime = bootSuccessionRuntime({
      candidateProfiles: [
        {
          polityId: 1,
          characterId: 2,
          requiresRegency: true,
          supportSources: [
            { kind: "kinship", strengthBps: 4_000, sourceId: "kin.regency" },
            { kind: "designation", strengthBps: 3_000, sourceId: "designation.regency" }
          ]
        },
        disputedProfile(3, [{ kind: "court", strengthBps: 1_000, sourceId: "court.rival" }])
      ]
    });
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m6.succession.regency.death", "system", runtime, 1, "dead")
    );
    runtime = accepted(
      runtime,
      resolveSuccessionCommand("m6.succession.regency.resolve", "system", runtime, 1)
    );

    expect(requireM3(runtime.world).successionCrises[0]?.outcome).toMatchObject({
      kind: "regency",
      successorCharacterId: 2,
      regentCharacterId: 3,
      supportTotalBps: 7_000,
      reasonCode: "validation"
    });
    expect(runtime.world.state.m6?.legitimacyProfiles).toContainEqual(
      expect.objectContaining({
        polityId: parsePolityId(1),
        audience: "vassal-rulers",
        scoreBps: 300,
        pressureBps: 9_700
      })
    );
  });

  test("regency outcome rejects missing or unavailable regent references", () => {
    const world = cloneWorldRecord(createSuccessionWorld());
    const characters = requireArrayField(requireRecordPath(world, ["state", "m3"]), "characters");
    characters[2] = { ...characters[2], incapacitated: true };
    const m3 = requireRecordPath(world, ["state", "m3"]);
    const crises = requireArrayField(m3, "successionCrises");
    crises.push({
      id: 1,
      polityId: 1,
      trigger: { kind: "death", characterId: 1, officeId: 1 },
      status: "resolved",
      startedDay: 0,
      resolvedDay: 0,
      candidates: [
        {
          characterId: 2,
          requiresRegency: true,
          supportSources: [{ kind: "kinship", strengthBps: 7_000, sourceId: "kin.regency" }],
          supportTotalBps: 7_000
        }
      ],
      outcome: {
        kind: "regency",
        successorCharacterId: 2,
        regentCharacterId: 3,
        supportTotalBps: 7_000,
        reasonCode: "validation"
      },
      reasonCode: "validation"
    });
    restampWorldHash(world);

    expect(validateWorldStateV0(world)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCrises[0].outcome.regentCharacterId"
        })
      ])
    );

    let runtime = bootSuccessionRuntime({
      candidateProfiles: [
        {
          polityId: 1,
          characterId: 2,
          requiresRegency: true,
          supportSources: [
            { kind: "kinship", strengthBps: 4_000, sourceId: "kin.regency" },
            { kind: "designation", strengthBps: 3_000, sourceId: "designation.regency" }
          ]
        },
        disputedProfile(3, [{ kind: "court", strengthBps: 1_000, sourceId: "court.rival" }])
      ]
    });
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m6.succession.regent-save.death", "system", runtime, 1, "dead")
    );
    runtime = accepted(
      runtime,
      resolveSuccessionCommand("m6.succession.regent-save.resolve", "system", runtime, 1)
    );
    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const malformedRegent = loadSaveV1(
      bootSuccessionRuntime(),
      encodeSaveEnvelopeV1(
        createSaveEnvelopeV1({
          build: saved.envelope.header.build,
          scenarioId: saved.envelope.header.scenarioId,
          authoritativeSnapshot: restampSaveSnapshot(
            rewriteFirstSuccessionRegent(saved.envelope.body.authoritativeSnapshot, 999),
            saved.envelope.body.scheduler
          ),
          scheduler: saved.envelope.body.scheduler,
          rng: saved.envelope.body.rng,
          commandTail: saved.envelope.body.commandTail,
          eventTail: saved.envelope.body.eventTail
        })
      ),
      {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      }
    );

    expect(malformedRegent.status).toBe("rejected");
    if (malformedRegent.status !== "rejected") {
      throw new Error("Expected missing succession regent to reject.");
    }
    expect(malformedRegent.reasons).toContainEqual({
      code: "semantic-invariant",
      path: "state.m3.successionCrises[0].outcome.regentCharacterId",
      message: "M3 succession regent references missing character."
    });
  });

  test("disputed succession remains a recognized-order blocker with auditable reason codes", () => {
    let runtime = bootSuccessionRuntime({
      candidateProfiles: [
        disputedProfile(2, [{ kind: "kinship", strengthBps: 2_500, sourceId: "kin.elder" }]),
        disputedProfile(3, [{ kind: "kinship", strengthBps: 2_500, sourceId: "kin.younger" }])
      ]
    });
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m6.succession.disputed.death", "system", runtime, 1, "dead")
    );
    runtime = accepted(
      runtime,
      resolveSuccessionCommand("m6.succession.disputed.resolve", "system", runtime, 1)
    );

    const recognized = recognizedOrderDecision(runtime, 1);
    expect(recognized).toMatchObject({
      polityId: 1,
      pendingSuccessionCount: 1,
      canPursueVictory: false
    });
    expect(recognized.reasonCodes).toContain("m6.recognized-order.succession-disputed");
    expect(runtime.world.state.m6?.legitimacySources).toContainEqual(
      expect.objectContaining({
        magnitudeBps: -700,
        reasonCode: "legitimacy.source.succession-disputed"
      })
    );
  });

  test("one-candidate low-support succession rejects before commit instead of self-dispute", () => {
    let runtime = bootSuccessionRuntime({
      candidateProfiles: [
        disputedProfile(2, [{ kind: "kinship", strengthBps: 2_500, sourceId: "kin.only" }])
      ]
    });
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand(
        "m6.succession.one-candidate.death",
        "system",
        runtime,
        1,
        "dead"
      )
    );
    const stateHashBeforeResolve = runtime.world.meta.stateHash;

    const submitted = submitCommandV1(
      runtime,
      resolveSuccessionCommand("m6.succession.one-candidate.resolve", "system", runtime, 1)
    );

    expect(submitted.result).toMatchObject({
      status: "rejected",
      error: {
        code: "succession-state-invalid",
        path: "state.m3.successionCrises.candidates",
        message: "sim.resolve-succession requires a rival candidate for disputed succession."
      }
    });
    expect(submitted.runtime.world.meta.stateHash).toBe(stateHashBeforeResolve);
    expect(requireM3(submitted.runtime.world).successionCrises[0]).toMatchObject({
      status: "pending",
      outcome: null
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

  test("validateWorldStateV0 rejects cyclic succession claim references", () => {
    const world = cloneWorldRecord(createSuccessionWorld());
    const m3 = requireRecordPath(world, ["state", "m3"]);
    const crises = requireArrayField(m3, "successionCrises");
    crises.push({
      id: 1,
      polityId: 1,
      trigger: { kind: "death", characterId: 1, officeId: 1 },
      status: "resolved",
      startedDay: 0,
      resolvedDay: 0,
      candidates: [
        {
          characterId: 1,
          requiresRegency: false,
          supportSources: [{ kind: "kinship", strengthBps: 1_000, sourceId: "kin.self" }],
          supportTotalBps: 1_000
        },
        {
          characterId: 2,
          requiresRegency: true,
          supportSources: [{ kind: "court", strengthBps: 1_000, sourceId: "court.regency" }],
          supportTotalBps: 1_000
        }
      ],
      outcome: {
        kind: "regency",
        successorCharacterId: 2,
        regentCharacterId: 2,
        supportTotalBps: 1_000,
        reasonCode: "validation"
      },
      reasonCode: "validation"
    });

    expect(validateWorldStateV0(world)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCrises[0].candidates[0].characterId"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m3.successionCrises[0].outcome.regentCharacterId"
        })
      ])
    );
  });

  test("save round-trip preserves M6 succession completion and rejects malformed or future triggers", () => {
    let runtime = bootSuccessionRuntime();
    runtime = accepted(
      runtime,
      recordCharacterStatusCommand("m6.succession.save.death", "system", runtime, 1, "dead")
    );
    runtime = accepted(
      runtime,
      resolveSuccessionCommand("m6.succession.save.resolve", "system", runtime, 1)
    );

    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(bootSuccessionRuntime(), saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    if (loaded.status !== "loaded") {
      throw new Error(`Expected succession save to load: ${JSON.stringify(loaded.reasons)}`);
    }
    expect(loaded.status).toBe("loaded");
    expect(loaded.runtime.world.state.m3?.successionCrises).toEqual(
      runtime.world.state.m3?.successionCrises
    );
    expect(loaded.runtime.world.state.m6?.legitimacySources).toEqual(
      runtime.world.state.m6?.legitimacySources
    );

    const futureTrigger = loadSaveV1(
      bootSuccessionRuntime(),
      encodeSaveEnvelopeV1({
        ...saved.envelope,
        body: {
          ...saved.envelope.body,
          authoritativeSnapshot: rewriteFirstSuccessionTrigger(
            saved.envelope.body.authoritativeSnapshot,
            {
              kind: "future-ceremony",
              characterId: 1,
              officeId: 1
            }
          )
        }
      }),
      {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      }
    );
    expect(futureTrigger.status).toBe("rejected");
    if (futureTrigger.status !== "rejected") {
      throw new Error("Expected future succession trigger to reject.");
    }
    expect(futureTrigger.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m3.successionCrises[0].trigger.kind",
      message: "M3 succession trigger kind must be death, incapacity, or abdication."
    });

    const malformedCandidate = loadSaveV1(
      bootSuccessionRuntime(),
      encodeSaveEnvelopeV1({
        ...saved.envelope,
        body: {
          ...saved.envelope.body,
          authoritativeSnapshot: rewriteFirstSuccessionCandidate(
            saved.envelope.body.authoritativeSnapshot
          )
        }
      }),
      {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      }
    );
    expect(malformedCandidate.status).toBe("rejected");
    if (malformedCandidate.status !== "rejected") {
      throw new Error("Expected malformed succession candidate to reject.");
    }
    expect(malformedCandidate.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m3.successionCrises[0].candidates[0].supportTotalBps",
      message:
        "body.authoritativeSnapshot.state.m3.successionCrises[0].candidates[0].supportTotalBps must be a safe integer from 0 to 10000."
    });
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
    }),
    m6: createM6DiplomacyLegitimacyStateV0(definitions)
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
  status: "dead" | "incapacitated" | "abdicated",
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

function recognizedOrderDecision(runtime: SimulationRuntimeV1, polityId: number) {
  const query = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m6-recognized-order",
    payload: { queryId: `m6.succession.recognized.${polityId}`, polityId }
  });
  expect(query.status).toBe("ok");
  if (query.status !== "ok" || query.result.kind !== "sim.list-m6-recognized-order") {
    throw new Error("Expected recognized order query.");
  }
  const decision = query.result.decisions[0];
  if (decision === undefined) {
    throw new Error("Expected recognized order decision.");
  }
  return decision;
}

function rewriteFirstSuccessionTrigger(
  snapshot: SaveWorldSnapshotV0Dto,
  trigger: Record<string, unknown>
): SaveWorldSnapshotV0Dto {
  const m3 = snapshot.state.m3;
  if (m3 === undefined) {
    throw new Error("Expected saved M3 state.");
  }
  const firstCrisis = m3.successionCrises[0];
  if (firstCrisis === undefined) {
    throw new Error("Expected saved succession crisis.");
  }
  return {
    ...snapshot,
    state: {
      ...snapshot.state,
      m3: {
        ...m3,
        successionCrises: [{ ...firstCrisis, trigger }, ...m3.successionCrises.slice(1)]
      }
    }
  };
}

function rewriteFirstSuccessionCandidate(snapshot: SaveWorldSnapshotV0Dto): SaveWorldSnapshotV0Dto {
  const m3 = snapshot.state.m3;
  if (m3 === undefined) {
    throw new Error("Expected saved M3 state.");
  }
  const firstCrisis = m3.successionCrises[0];
  const firstCandidate = firstCrisis?.candidates[0];
  if (firstCrisis === undefined || firstCandidate === undefined) {
    throw new Error("Expected saved succession candidate.");
  }
  return {
    ...snapshot,
    state: {
      ...snapshot.state,
      m3: {
        ...m3,
        successionCrises: [
          {
            ...firstCrisis,
            candidates: [
              { ...firstCandidate, supportTotalBps: 10_001 },
              ...firstCrisis.candidates.slice(1)
            ]
          },
          ...m3.successionCrises.slice(1)
        ]
      }
    }
  };
}

function rewriteFirstSuccessionRegent(
  snapshot: SaveWorldSnapshotV0Dto,
  regentCharacterId: number
): SaveWorldSnapshotV0Dto {
  const m3 = snapshot.state.m3;
  if (m3 === undefined) {
    throw new Error("Expected saved M3 state.");
  }
  const firstCrisis = m3.successionCrises[0];
  if (firstCrisis === undefined || firstCrisis.outcome?.kind !== "regency") {
    throw new Error("Expected saved regency outcome.");
  }
  return {
    ...snapshot,
    state: {
      ...snapshot.state,
      m3: {
        ...m3,
        successionCrises: [
          {
            ...firstCrisis,
            outcome: { ...firstCrisis.outcome, regentCharacterId }
          },
          ...m3.successionCrises.slice(1)
        ]
      }
    }
  };
}

function restampWorldHash(world: Record<string, unknown>): void {
  const meta = requireRecordPath(world, ["meta"]);
  meta["stateHash"] = "";
  meta["stateHash"] = hashWorldStateV0(world as WorldStateV0);
}

function restampSaveSnapshot(
  snapshot: SaveWorldSnapshotV0Dto,
  scheduler: unknown
): SaveWorldSnapshotV0Dto {
  const candidate = saveWorldStateV0DtoToCandidate(snapshot, scheduler);
  if (!isRecord(candidate)) {
    throw new Error("Expected candidate world from save snapshot.");
  }
  const meta = requireRecordPath(candidate, ["meta"]);
  meta["stateHash"] = "";
  return {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      stateHash: hashWorldStateV0(candidate as WorldStateV0)
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

import { describe, expect, test } from "vitest";

import {
  parseM4CampaignAiDecisionTraceV1,
  parseGameCommandV1,
  parseGameQueryV1,
  parseSimulationMessageV1
} from "../packages/protocol/src/index";

describe("SIM-003 protocol command/query schemas", () => {
  test("rejects unknown worker message types with serializable errors", () => {
    expect(
      parseSimulationMessageV1({
        protocolVersion: 1,
        requestId: "req.unknown",
        type: "simulation.teleport",
        payload: {}
      })
    ).toEqual({
      ok: false,
      error: {
        code: "unknown-message-type",
        path: "type",
        message: "Simulation message type is not supported."
      }
    });
  });

  test("rejects malformed command payloads without throwing", () => {
    expect(() => parseGameCommandV1(null)).not.toThrow();
    expect(parseGameCommandV1(null)).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "$",
        message: "GameCommand v1 must be an object."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "debug.set-district-control",
        commandId: "cmd.bad",
        actor: { kind: "player", id: "player:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { districtId: 1, controllerPolityId: 0 }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.controllerPolityId",
        message: "controllerPolityId must be a positive safe integer or null."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.commit-labor",
        commandId: "cmd.bad-labor",
        actor: { kind: "ai", id: "ai:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          populationGroupId: 1,
          purpose: "mobilized",
          laborAmount: 0,
          durationDays: 30
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.laborAmount",
        message: "payload.laborAmount must be a positive safe integer."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.set-polity-suzerain",
        commandId: "cmd.bad-suzerain",
        actor: { kind: "ai", id: "ai:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          polityId: 1,
          directSuzerainPolityId: 0,
          reasonCode: "validation"
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.directSuzerainPolityId",
        message: "directSuzerainPolityId must be a positive safe integer or null."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-obligation",
        commandId: "cmd.bad-obligation",
        actor: { kind: "player", id: "player:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          debtorPolityId: 1,
          creditorPolityId: 2,
          obligationKind: "tribute",
          obligationCategory: "regular-tribute",
          obligationSource: { kind: "vassalage", sourceId: "validation-vassalage" },
          requirement: { kind: "amount", resourceKind: "cash", amount: 0 },
          due: { kind: "cadence", periodDays: 90, nextDueDay: 90 }
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.requirement.amount",
        message: "payload.requirement.amount must be a positive safe integer."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.record-obligation-fulfillment",
        commandId: "cmd.bad-fulfillment",
        actor: { kind: "player", id: "player:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          obligationId: 1,
          fulfillmentId: 1,
          actionKind: "fulfillment",
          dueDay: 90,
          fulfilledAmount: -1,
          reasonCode: "validation",
          executorCharacterId: null,
          officeId: null
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.fulfilledAmount",
        message: "payload.fulfilledAmount must be a nonnegative safe integer."
      }
    });
  });

  test("accepts M3 polity and obligation command schemas", () => {
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-obligation",
        commandId: "cmd.m3.valid",
        actor: { kind: "ai", id: "ai:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          debtorPolityId: 1,
          creditorPolityId: 2,
          obligationKind: "tribute",
          obligationCategory: "regular-tribute",
          obligationSource: { kind: "vassalage", sourceId: "validation-vassalage" },
          requirement: { kind: "condition", conditionKey: "validation-condition" },
          due: { kind: "trigger", triggerKey: "validation-trigger" }
        }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.create-obligation",
        commandId: "cmd.m3.valid",
        actor: { kind: "ai", id: "ai:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          debtorPolityId: 1,
          creditorPolityId: 2,
          obligationKind: "tribute",
          obligationCategory: "regular-tribute",
          obligationSource: { kind: "vassalage", sourceId: "validation-vassalage" },
          requirement: { kind: "condition", conditionKey: "validation-condition" },
          due: { kind: "trigger", triggerKey: "validation-trigger" }
        }
      }
    });
  });

  test("accepts M3 appointment, enfeoffment, policy, bulk command, and scaffold query schemas", () => {
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.appoint-office",
        commandId: "cmd.m3.appoint",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { officeId: 1, characterId: 2, reasonCode: "validation" }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.appoint-office",
        commandId: "cmd.m3.appoint",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { officeId: 1, characterId: 2, reasonCode: "validation" }
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.appoint-offices-bulk",
        commandId: "cmd.m3.bulk",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          items: [{ itemId: "a", officeId: 1, characterId: null, reasonCode: "validation" }]
        }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.appoint-offices-bulk",
        commandId: "cmd.m3.bulk",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          items: [{ itemId: "a", officeId: 1, characterId: null, reasonCode: "validation" }]
        }
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.enfeoff-district",
        commandId: "cmd.m3.enfeoff",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          districtId: 2,
          holderCharacterId: 4,
          grantedByPolityId: 1,
          policyId: 6,
          reasonCode: "validation"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.update-office-policy",
        commandId: "cmd.m3.policy.office",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { policyId: 1, stance: "military", intensityBps: 10_000, reasonCode: "validation" }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.update-jurisdiction-policy",
        commandId: "cmd.m3.policy.jurisdiction",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          policyId: 1,
          stance: "conciliatory",
          intensityBps: 0,
          reasonCode: "validation"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m3-decision-scaffolds"
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.list-m3-decision-scaffolds"
      }
    });
  });

  test("accepts M3 succession command and query schemas", () => {
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.record-character-status",
        commandId: "cmd.m3.succession.status",
        actor: { kind: "system", id: "succession-system" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { characterId: 1, status: "dead", reasonCode: "validation" }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.record-character-status",
        commandId: "cmd.m3.succession.status",
        actor: { kind: "system", id: "succession-system" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { characterId: 1, status: "dead", reasonCode: "validation" }
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.resolve-succession",
        commandId: "cmd.m3.succession.resolve",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: { successionId: 1, reasonCode: "validation" }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-character-relationship",
        commandId: "cmd.m3.succession.relationship",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          sourceCharacterId: 1,
          targetCharacterId: 2,
          affinityBps: -1_000,
          reasonCode: "validation"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m3-succession-crises"
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.list-m3-succession-crises"
      }
    });
  });

  test("accepts M3 postwar governance command and query schemas", () => {
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.apply-m3-postwar-governance",
        commandId: "cmd.m3.postwar.apply",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          settlementId: "m3.postwar.validation",
          victorPolityId: 1,
          localPolityId: 2,
          districtId: 3,
          method: "restore-vassal-ruler",
          localRulerCharacterId: 4,
          policyId: 5,
          reasonCode: "validation"
        }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.apply-m3-postwar-governance",
        commandId: "cmd.m3.postwar.apply",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          settlementId: "m3.postwar.validation",
          victorPolityId: 1,
          localPolityId: 2,
          districtId: 3,
          method: "restore-vassal-ruler",
          localRulerCharacterId: 4,
          policyId: 5,
          reasonCode: "validation"
        }
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.preview-m3-postwar-governance",
        payload: {
          queryId: "m3.postwar.preview",
          victorPolityId: 1,
          localPolityId: 2,
          districtId: 3,
          methods: ["direct-control", "restore-vassal-ruler", "tribute-only"],
          months: 24
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.compare-m3-postwar-governance-outcomes",
        payload: {
          queryId: "m3.postwar.outcomes",
          victorPolityId: 1,
          localPolityId: 2,
          districtId: 3,
          months: 24
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.preview-m3-postwar-governance",
        payload: {
          queryId: "m3.postwar.preview.bad",
          victorPolityId: 1,
          localPolityId: 2,
          districtId: 3,
          methods: ["war-annexation"],
          months: 24
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.methods[0]",
        message: "payload.methods[0] must be direct-control, restore-vassal-ruler, or tribute-only."
      }
    });
  });

  test("accepts M4 campaign objective command and planning query schemas", () => {
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-campaign-objective",
        commandId: "cmd.m4.campaign.create",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          campaignPlanId: 1,
          owner: { kind: "polity", polityId: 1 },
          target: { kind: "district", districtId: 2 },
          objectiveKind: "besiege",
          startWindow: { earliestDay: 12, latestDay: 30 },
          reasonCodes: ["campaign.reason.dry-season-range"]
        }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.create-campaign-objective",
        commandId: "cmd.m4.campaign.create",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          campaignPlanId: 1,
          owner: { kind: "polity", polityId: 1 },
          target: { kind: "district", districtId: 2 },
          objectiveKind: "besiege",
          startWindow: { earliestDay: 12, latestDay: 30 },
          reasonCodes: ["campaign.reason.dry-season-range"]
        }
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.update-campaign-objective",
        commandId: "cmd.m4.campaign.update",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          campaignPlanId: 1,
          target: { kind: "district", districtId: 3 },
          objectiveKind: "relieve",
          startWindow: { earliestDay: 14, latestDay: 40 },
          reasonCodes: ["campaign.reason.defender-pressure"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.cancel-campaign-objective",
        commandId: "cmd.m4.campaign.cancel",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          campaignPlanId: 1,
          reasonCode: "campaign.cancelled.monsoon-range"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-campaign-plans"
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.list-m4-campaign-plans"
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-faction-knowledge",
        payload: { queryId: "m4.knowledge.1", observerPolityId: 1 }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.list-m4-faction-knowledge",
        payload: { queryId: "m4.knowledge.1", observerPolityId: 1 }
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-muster-commitment",
        commandId: "cmd.m4.muster.create",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          commitmentId: 1,
          campaignPlanId: 1,
          source: { kind: "m3-obligation", obligationId: 7 },
          promisedTroops: 60,
          dueDay: 20,
          assemblyWindow: { earliestDay: 12, latestDay: 18 },
          reasonCodes: ["muster.reason.obligation-request"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.record-muster-response",
        commandId: "cmd.m4.muster.response",
        actor: { kind: "ai", id: "polity:2" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          commitmentId: 1,
          assembledTroops: 40,
          delayedTroops: 20,
          refusedTroops: 0,
          releasedTroops: 0,
          reasonCodes: ["muster.response.partial-assembly"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-muster-commitments",
        payload: { queryId: "m4.muster.1", campaignPlanId: 1 }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.reserve-campaign-grain-supply",
        commandId: "cmd.m4.grain.reserve",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          reservationId: 1,
          campaignPlanId: 1,
          requestedAmount: 120,
          expectedDailyConsumption: 10,
          reasonCodes: ["grain.reserve.planned-campaign"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.consume-campaign-grain-supply",
        commandId: "cmd.m4.grain.consume",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          reservationId: 1,
          consumedAmount: 60,
          lossAmount: 5,
          lossReasonCode: "grain.loss.spoilage",
          reasonCodes: ["grain.consume.march-forecast"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.release-campaign-grain-supply",
        commandId: "cmd.m4.grain.release",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          reservationId: 1,
          reasonCode: "grain.release.cancelled-plan"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.start-campaign-march",
        commandId: "cmd.m4.march.start",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          marchId: 701,
          campaignPlanId: 1,
          originDistrictId: 1,
          plannedDepartureDay: 10,
          grainPerTroopPerDay: 1,
          reasonCodes: ["march.order.accepted"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.preview-m4-grain-supply",
        payload: {
          queryId: "m4.grain.1",
          campaignPlanId: 1,
          plannedMarchDays: 12,
          grainPerTroopPerDay: 2
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.preview-m4-route-transport-capacity",
        payload: {
          queryId: "m4.route-capacity.1",
          campaignPlanId: 1
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-march-state",
        payload: {
          queryId: "m4.march.1",
          campaignPlanId: 1
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.resolve-m4-field-engagement",
        commandId: "cmd.m4.engagement.resolve",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          engagementId: 1,
          campaignPlanId: 1,
          marchId: 701,
          defenderPolityId: 2,
          defenderEstimatedTroops: 60,
          defenderFortification: 400,
          reasonCodes: ["engagement.reason.enemy-intercepted"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.apply-m4-siege-choice",
        commandId: "cmd.m4.siege.choice",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          siegeId: 1,
          campaignPlanId: 1,
          marchId: 701,
          choice: "invest-blockade",
          defenderPolityId: 2,
          fortification: 400,
          defenderEstimatedTroops: 60,
          defenderSupply: 300,
          reasonCodes: ["siege.choice.invest-blockade"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-siege-state",
        payload: {
          queryId: "m4.siege.1",
          campaignPlanId: 1
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.resolve-m4-campaign-withdrawal",
        commandId: "cmd.m4.withdrawal.resolve",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          withdrawalId: 1,
          campaignPlanId: 1,
          marchId: 701,
          siegeId: null,
          triggerReason: "supply",
          reasonCodes: ["withdrawal.reason.supply-collapse"]
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-withdrawal-state",
        payload: {
          queryId: "m4.withdrawal.1",
          campaignPlanId: 1
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m4-war-outcomes",
        payload: {
          queryId: "m4.outcomes.1",
          campaignPlanId: 1
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.resolve-m4-campaign-withdrawal",
        commandId: "cmd.m4.withdrawal.bad-trigger",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          withdrawalId: 1,
          campaignPlanId: 1,
          marchId: 701,
          siegeId: null,
          triggerReason: "peace-treaty",
          reasonCodes: ["withdrawal.reason.invalid"]
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.triggerReason",
        message:
          "payload.triggerReason must be ordered, supply, season, siege, loss, or objective-complete."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.apply-m4-siege-choice",
        commandId: "cmd.m4.siege.bad-choice",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          siegeId: 1,
          campaignPlanId: 1,
          marchId: 701,
          choice: "negotiate-peace",
          defenderPolityId: 2,
          fortification: 400,
          defenderEstimatedTroops: 60,
          defenderSupply: 300,
          reasonCodes: ["siege.choice.invalid"]
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.choice",
        message:
          "payload.choice must be invest-blockade, assault, continue, accept-surrender, lift-siege, or withdraw."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.consume-campaign-grain-supply",
        commandId: "cmd.m4.grain.bad-loss",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          reservationId: 1,
          consumedAmount: 60,
          lossAmount: 5,
          lossReasonCode: null,
          reasonCodes: ["grain.consume.march-forecast"]
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.lossReasonCode",
        message: "payload.lossReasonCode is required when lossAmount is positive."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-muster-commitment",
        commandId: "cmd.m4.muster.bad",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          commitmentId: 1,
          campaignPlanId: 1,
          source: { kind: "m3-obligation", obligationId: 7 },
          promisedTroops: -1,
          dueDay: 20,
          assemblyWindow: { earliestDay: 12, latestDay: 18 },
          reasonCodes: ["muster.reason.obligation-request"]
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.promisedTroops",
        message: "payload.promisedTroops must be a positive safe integer."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.create-campaign-objective",
        commandId: "cmd.m4.campaign.bad",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          campaignPlanId: 1,
          owner: { kind: "polity", polityId: 1 },
          target: { kind: "district", districtId: 2 },
          objectiveKind: "naval-invasion",
          startWindow: { earliestDay: 12, latestDay: 30 },
          reasonCodes: ["campaign.reason.dry-season-range"]
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.objectiveKind",
        message:
          "payload.objectiveKind must be prepare, march, besiege, relieve, withdraw, or postwar-result-candidate."
      }
    });
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.start-campaign-march",
        commandId: "cmd.m4.march.bad-grain",
        actor: { kind: "ai", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          marchId: 701,
          campaignPlanId: 1,
          originDistrictId: 1,
          plannedDepartureDay: 10,
          grainPerTroopPerDay: 0,
          reasonCodes: ["march.order.accepted"]
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.grainPerTroopPerDay",
        message: "payload.grainPerTroopPerDay must be a positive safe integer."
      }
    });
  });

  test("accepts M6 diplomacy and legitimacy command/query schemas", () => {
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.propose-diplomatic-agreement",
        commandId: "cmd.m6.propose",
        actor: { kind: "ai", id: "polity:2" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          agreementId: 1,
          relationId: 1,
          proposerPolityId: 2,
          targetPolityId: 1,
          agreementKind: "non-aggression",
          durationDays: 360,
          recognitionDirection: "target-recognizes-proposer",
          reasonCode: "diplomacy.offer.non-aggression"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.answer-diplomatic-agreement",
        commandId: "cmd.m6.answer",
        actor: { kind: "player", id: "polity:1" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          agreementId: 1,
          accepted: true,
          reasonCode: "diplomacy.answer.accepted"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.record-legitimacy-source",
        commandId: "cmd.m6.legitimacy",
        actor: { kind: "system", id: "m6-legitimacy" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          sourceId: 1,
          polityId: 2,
          audience: "vassal-rulers",
          sourceKind: "postwar-settlement",
          magnitudeBps: 1_200,
          sourceRef: "m6.postwar.validation",
          reasonCode: "legitimacy.postwar.settlement"
        }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m6-diplomacy",
        payload: { queryId: "m6.diplomacy", observerPolityId: 2 }
      }).ok
    ).toBe(true);
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m6-recognized-order",
        payload: { queryId: "m6.order", polityId: 2 }
      }).ok
    ).toBe(true);
    expect(
      parseGameCommandV1({
        schemaVersion: 1,
        kind: "sim.record-legitimacy-source",
        commandId: "cmd.m6.legitimacy.bad",
        actor: { kind: "system", id: "m6-legitimacy" },
        expectedDay: 10,
        expectedRevision: 4,
        payload: {
          sourceId: 1,
          polityId: 2,
          audience: "vassal-rulers",
          sourceKind: "divine-right",
          magnitudeBps: 1_200,
          sourceRef: "m6.postwar.validation",
          reasonCode: "legitimacy.postwar.settlement"
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.sourceKind",
        message: "payload.sourceKind must be a valid M6 legitimacy source kind."
      }
    });
  });

  test("rejects malformed query payloads without leaking nonserializable details", () => {
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.inspect-world-state"
      })
    ).toEqual({
      ok: false,
      error: {
        code: "unknown-query-kind",
        path: "kind",
        message: "GameQuery kind is not supported."
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 2,
        kind: "sim.get-state-hash"
      })
    ).toEqual({
      ok: false,
      error: {
        code: "unsupported-query-version",
        path: "schemaVersion",
        message: "GameQuery schemaVersion must be 1."
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m2-economy-summaries"
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.list-m2-economy-summaries"
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.list-m3-administrative-burden"
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.list-m3-administrative-burden"
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.preview-m2-transport-route",
        payload: {
          queryId: "route.preview.1",
          originDistrictId: 1,
          destinationDistrictId: 6,
          stockAmount: 40
        }
      })
    ).toEqual({
      ok: true,
      value: {
        schemaVersion: 1,
        kind: "sim.preview-m2-transport-route",
        payload: {
          queryId: "route.preview.1",
          originDistrictId: 1,
          destinationDistrictId: 6,
          stockAmount: 40
        }
      }
    });
    expect(
      parseGameQueryV1({
        schemaVersion: 1,
        kind: "sim.preview-m2-transport-route",
        payload: {
          queryId: "route.preview.bad",
          originDistrictId: 1,
          destinationDistrictId: 6,
          stockAmount: 0
        }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.stockAmount",
        message: "payload.stockAmount must be a positive safe integer."
      }
    });
  });

  test("accepts and rejects M4 campaign AI decision trace schema", () => {
    expect(
      parseM4CampaignAiDecisionTraceV1({
        schemaVersion: 1,
        actor: { kind: "ai", id: "polity:1" },
        observerPolityId: 1,
        day: 10,
        revision: 4,
        decisionKind: "wait",
        selectedCampaignPlanId: 10,
        selectedCandidateId: "wait:10",
        commandKind: null,
        commandId: null,
        primaryReasonCode: "m4.ai.wait.supply-shortfall",
        reasonCodes: ["m4.ai.wait.supply-shortfall"],
        candidates: [
          {
            candidateId: "wait:10",
            decisionKind: "wait",
            campaignPlanId: 10,
            commandKind: null,
            score: 5_000,
            reasonCodes: ["m4.ai.wait.supply-shortfall"]
          }
        ]
      }).ok
    ).toBe(true);
    expect(
      parseM4CampaignAiDecisionTraceV1({
        schemaVersion: 1,
        actor: { kind: "ai", id: "polity:1" },
        observerPolityId: 1,
        day: 10,
        revision: 4,
        decisionKind: "grand-strategy",
        selectedCampaignPlanId: 10,
        selectedCandidateId: "bad:10",
        commandKind: null,
        commandId: null,
        primaryReasonCode: "m4.ai.invalid",
        reasonCodes: ["m4.ai.invalid"],
        candidates: [
          {
            candidateId: "bad:10",
            decisionKind: "wait",
            campaignPlanId: 10,
            commandKind: "sim.inspect-world-state",
            score: 1,
            reasonCodes: ["m4.ai.invalid"]
          }
        ]
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "decisionKind",
        message:
          "decisionKind must be no-action, wait, create-objective, change-objective, cancel, start-march, reinforce, continue, or withdraw."
      }
    });
  });
});

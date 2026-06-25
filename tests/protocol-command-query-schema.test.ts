import { describe, expect, test } from "vitest";

import {
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
});

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
        payload: { obligationId: 1, fulfillmentId: 1, fulfilledAmount: 0 }
      })
    ).toEqual({
      ok: false,
      error: {
        code: "invalid-payload",
        path: "payload.fulfilledAmount",
        message: "payload.fulfilledAmount must be a positive safe integer."
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
          requirement: { kind: "condition", conditionKey: "validation-condition" },
          due: { kind: "trigger", triggerKey: "validation-trigger" }
        }
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

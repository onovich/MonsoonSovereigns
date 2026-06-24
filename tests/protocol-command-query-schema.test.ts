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
  });
});

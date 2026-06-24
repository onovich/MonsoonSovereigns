import { describe, expect, test } from "vitest";

import {
  bootSimulationV1,
  parseDistrictId,
  parsePolityId,
  previewCommandV1,
  querySimulationV1,
  submitCommandV1,
  validateWorldStateV0,
  type StateDeltaV1,
  type SimulationRuntimeV1
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("SIM-003 GameCommand and Query v1", () => {
  test("previews without mutating and submit re-validates at commit time", () => {
    const boot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
    expect(boot.status).toBe("booted");
    let runtime = boot.runtime;
    const command = advanceCommand("cmd.advance.1", runtime.world.meta.currentDay);
    const beforeHash = runtime.world.meta.stateHash;

    const preview = previewCommandV1(runtime, command);
    expect(preview.status).toBe("accepted");
    expect(runtime.world.meta.stateHash).toBe(beforeHash);

    const externallyAdvanced = submitCommandV1(runtime, advanceCommand("cmd.advance.other", 0));
    expect(externallyAdvanced.result.status).toBe("accepted");
    runtime = externallyAdvanced.runtime;

    const staleSubmit = submitCommandV1(runtime, command);
    expect(staleSubmit.result).toMatchObject({
      status: "rejected",
      error: { code: "stale-day", path: "expectedDay" }
    });
    expect(staleSubmit.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
  });

  test("accepts player and AI commands through the same validator and apply path", () => {
    let playerRuntime = bootedRuntime();
    let aiRuntime = bootedRuntime();

    const playerSubmit = submitCommandV1(
      playerRuntime,
      setDistrictControlCommand("cmd.control.player", "player", 0, 0, 1)
    );
    const aiSubmit = submitCommandV1(
      aiRuntime,
      setDistrictControlCommand("cmd.control.ai", "ai", 0, 0, 1)
    );
    playerRuntime = playerSubmit.runtime;
    aiRuntime = aiSubmit.runtime;

    expect(playerSubmit.result.status).toBe("accepted");
    expect(aiSubmit.result.status).toBe("accepted");
    expect(playerRuntime.world.meta.stateHash).toBe(aiRuntime.world.meta.stateHash);
    expect(playerSubmit.result).toMatchObject({
      events: [
        {
          kind: "sim.district-control-changed",
          districtId: 1,
          previousControllerPolityId: null,
          nextControllerPolityId: 1
        }
      ],
      deltas: [
        {
          kind: "state.district-control-updated",
          districtId: 1,
          control: { kind: "controlled", controllerPolityId: 1 }
        }
      ]
    });
  });

  test("rejects invalid, duplicate, stale-day, bad-ID, and boundary payload commands", () => {
    let runtime = bootedRuntime();
    const accepted = submitCommandV1(runtime, advanceCommand("cmd.advance.duplicate", 0));
    expect(accepted.result.status).toBe("accepted");
    runtime = accepted.runtime;

    expect(
      submitCommandV1(runtime, advanceCommand("cmd.advance.duplicate", 1)).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-command", path: "commandId" }
    });
    expect(submitCommandV1(runtime, advanceCommand("cmd.advance.stale", 0)).result).toMatchObject({
      status: "rejected",
      error: { code: "stale-day", path: "expectedDay" }
    });
    expect(
      submitCommandV1(
        runtime,
        setDistrictControlCommand("cmd.control.bad-district", "player", 1, 1, 999)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "bad-id", path: "payload.districtId" }
    });
    expect(submitCommandV1(runtime, { schemaVersion: 1 }).result).toMatchObject({
      status: "rejected",
      error: { code: "invalid-payload", path: "kind" }
    });
    expect(
      submitCommandV1(runtime, {
        ...advanceCommand("cmd.advance.boundary", 1),
        commandId: "bad id with spaces"
      })
    ).toMatchObject({
      result: {
        status: "rejected",
        error: { code: "invalid-payload", path: "commandId" }
      }
    });
  });

  test("verify hash command and read-model-safe queries do not expose mutable WorldState internals", () => {
    const runtime = bootedRuntime();
    const hashQuery = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.get-state-hash"
    });
    expect(hashQuery.status).toBe("ok");
    expect(hashQuery.result).toEqual({
      kind: "sim.get-state-hash",
      day: 0,
      revision: 0,
      stateHash: runtime.world.meta.stateHash
    });

    const verify = submitCommandV1(runtime, {
      schemaVersion: 1,
      kind: "sim.verify-state-hash",
      commandId: "cmd.verify.1",
      actor: { kind: "system", id: "canary" },
      expectedDay: 0,
      expectedRevision: 0,
      expectedHash: runtime.world.meta.stateHash
    });
    expect(verify.result.status).toBe("accepted");
    expect(verify.result).toMatchObject({
      events: [{ kind: "sim.state-hash-verified", stateHash: runtime.world.meta.stateHash }],
      deltas: [{ kind: "state.hash-observed", stateHash: runtime.world.meta.stateHash }]
    });

    const districts = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-district-summaries"
    });
    expect(districts.status).toBe("ok");
    expect(districts.result).toEqual({
      kind: "sim.list-district-summaries",
      day: 0,
      revision: 0,
      districts: [
        {
          districtId: parseDistrictId(1),
          displayNameKey: "district.m1_minimal_core.name",
          control: { kind: "uncontrolled" }
        },
        {
          districtId: parseDistrictId(2),
          displayNameKey: "district.m1_minimal_route_end.name",
          control: { kind: "uncontrolled" }
        }
      ]
    });
    expect(districts.result).not.toHaveProperty("definitions");
    expect(districts.result).not.toHaveProperty("state");
  });

  test("copies nested control DTOs across query and delta read-model boundaries", () => {
    let runtime = bootedRuntime();
    const submitted = submitCommandV1(
      runtime,
      setDistrictControlCommand("cmd.control.alias-isolation", "player", 0, 0, 1)
    );
    expect(submitted.result.status).toBe("accepted");
    runtime = submitted.runtime;
    const committedHash = runtime.world.meta.stateHash;

    if (submitted.result.status !== "accepted") {
      throw new Error("Expected district control command to be accepted.");
    }

    const controlDelta = findDistrictControlDelta(submitted.result.deltas);
    if (controlDelta.control.kind !== "controlled") {
      throw new Error("Expected district control delta to be controlled.");
    }

    const mutableDeltaControl = controlDelta.control as MutableControlledDistrictControl;
    mutableDeltaControl.controllerPolityId = 999;

    expect(runtime.world.state.districts[0]?.control).toEqual({
      kind: "controlled",
      controllerPolityId: parsePolityId(1)
    });
    expect(runtime.world.meta.stateHash).toBe(committedHash);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);

    const query = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-district-summaries"
    });
    expect(query.status).toBe("ok");
    if (query.status !== "ok" || query.result.kind !== "sim.list-district-summaries") {
      throw new Error("Expected district summaries query to succeed.");
    }

    const districtSummary = query.result.districts[0];
    if (districtSummary === undefined || districtSummary.control.kind !== "controlled") {
      throw new Error("Expected first district summary to be controlled.");
    }

    const mutableQueryControl = districtSummary.control as MutableControlledDistrictControl;
    mutableQueryControl.controllerPolityId = 998;

    expect(runtime.world.state.districts[0]?.control).toEqual({
      kind: "controlled",
      controllerPolityId: parsePolityId(1)
    });
    expect(runtime.world.meta.stateHash).toBe(committedHash);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });
});

type MutableControlledDistrictControl = {
  kind: "controlled";
  controllerPolityId: number;
};

function bootedRuntime(): SimulationRuntimeV1 {
  const boot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
  if (boot.status !== "booted") {
    throw new Error("Test boot failed.");
  }

  return boot.runtime;
}

function advanceCommand(commandId: string, expectedDay: number): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.advance-day",
    commandId,
    actor: { kind: "player", id: "player:1" },
    expectedDay,
    expectedRevision: expectedDay
  };
}

function setDistrictControlCommand(
  commandId: string,
  actorKind: "ai" | "player",
  expectedDay: number,
  expectedRevision: number,
  districtId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "debug.set-district-control",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:1` },
    expectedDay,
    expectedRevision,
    payload: {
      districtId: parseDistrictId(districtId),
      controllerPolityId: parsePolityId(1)
    }
  };
}

function findDistrictControlDelta(
  deltas: readonly StateDeltaV1[]
): Extract<StateDeltaV1, { readonly kind: "state.district-control-updated" }> {
  const delta = deltas.find((entry) => entry.kind === "state.district-control-updated");
  if (delta === undefined || delta.kind !== "state.district-control-updated") {
    throw new Error("Expected state.district-control-updated delta.");
  }

  return delta;
}

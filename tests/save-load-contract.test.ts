import { describe, expect, test } from "vitest";

import { createSaveEnvelopeV1, encodeSaveEnvelopeV1 } from "../packages/save-format/src/index";
import { createSaveLoadCanaryScriptV1 } from "../packages/protocol/src/index";
import {
  bootSimulationV1,
  loadSaveV1,
  requestSaveV1,
  runSaveLoadCanaryV1,
  submitCommandV1
} from "../packages/sim-core/src/index";

const { runSaveLoadCanaryInWorkerCompatibleAdapter } =
  await import("../apps/web/src/worker/hello-simulation-adapter.mjs");

describe("SIM-005 Node runner and Worker save/load contract", () => {
  test("request-save/load-save preserves hash and does not mutate current runtime on rejection", () => {
    const boot = bootSimulationV1({
      protocolVersion: 1,
      fixture: "m1.abstract-graph-30"
    });
    expect(boot.status).toBe("booted");
    if (boot.status !== "booted") {
      throw new Error("Expected M1 graph boot.");
    }

    const submitted = submitCommandV1(boot.runtime, {
      schemaVersion: 1,
      kind: "debug.set-district-control",
      commandId: "save.contract.control.1",
      actor: { kind: "player", id: "player:save-contract" },
      expectedDay: 0,
      expectedRevision: 0,
      payload: { districtId: 1, controllerPolityId: 1 }
    });
    expect(submitted.result.status).toBe("accepted");

    const saved = requestSaveV1(submitted.runtime, {
      appVersion: "0.0.0",
      source: "node-runner",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: "4a438525",
      expectedScenarioId: "m1.abstract-graph-30"
    });

    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected saved runtime to load.");
    }

    expect(loaded.runtime.world.meta.stateHash).toBe(submitted.runtime.world.meta.stateHash);
    expect(loaded.runtime.acceptedCommandIds).toEqual(submitted.runtime.acceptedCommandIds);

    const rejected = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: "00000000",
      expectedScenarioId: "m1.abstract-graph-30"
    });
    expect(rejected.status).toBe("rejected");
    if (rejected.status !== "rejected") {
      throw new Error("Expected mismatched content load to reject.");
    }
    expect(rejected.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
  });

  test("valid-checksum imported saves with unknown event-tail kinds reject without mutating", () => {
    const boot = bootMinimalRuntime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const bad = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: saved.envelope.body.authoritativeSnapshot,
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: [
        {
          sequence: 1,
          event: { kind: "sim.future-event", schemaVersion: 1 }
        }
      ]
    });

    const result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(result.status).toBe("rejected");
    if (result.status !== "rejected") {
      throw new Error("Expected unknown event tail to reject.");
    }
    expect(result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.eventTail[0].event.kind",
      message: "Saved DomainEvent kind is not supported."
    });
  });

  test("valid-checksum imported saves with malformed event-tail fields reject without throwing", () => {
    const boot = bootMinimalRuntime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const bad = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: saved.envelope.body.authoritativeSnapshot,
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: [
        {
          sequence: 1,
          event: {
            schemaVersion: 1,
            kind: "sim.state-hash-verified",
            commandId: 99,
            actor: { kind: "system", id: "save-contract" },
            day: 0,
            revision: 0,
            stateHash: saved.stateHash
          }
        }
      ]
    });

    expect(() =>
      loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      })
    ).not.toThrow();

    const result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(result.status).toBe("rejected");
    if (result.status !== "rejected") {
      throw new Error("Expected malformed event tail to reject.");
    }
    expect(result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.eventTail[0].event.commandId",
      message: "Saved event commandId must be a string."
    });
  });

  test("valid-checksum imported saves with unsupported event-tail schema versions reject without coercion", () => {
    const boot = bootMinimalRuntime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const bad = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: saved.envelope.body.authoritativeSnapshot,
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: [
        {
          sequence: 1,
          event: {
            schemaVersion: 999,
            kind: "sim.state-hash-verified",
            commandId: "bad.version",
            actor: { kind: "system", id: "save-contract" },
            day: 0,
            revision: 0,
            stateHash: saved.stateHash
          }
        }
      ]
    });

    const result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(result.status).toBe("rejected");
    if (result.status !== "rejected") {
      throw new Error("Expected unsupported event schemaVersion to reject.");
    }
    expect(result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.eventTail[0].event.schemaVersion",
      message: "Saved DomainEvent schemaVersion must be 1."
    });
  });

  test("same seed, initial state, command tail, and loaded snapshot produce identical Node and Worker hashes", () => {
    const script = createSaveLoadCanaryScriptV1();
    const nodeResult = runSaveLoadCanaryV1(script);
    const workerResult = runSaveLoadCanaryInWorkerCompatibleAdapter(script);

    expect(nodeResult.status).toBe("ok");
    expect(workerResult.status).toBe("ok");
    expect(workerResult.finalHash).toBe(nodeResult.finalHash);
    expect(workerResult.loadedHash).toBe(nodeResult.loadedHash);
    expect(workerResult.replayedHash).toBe(nodeResult.replayedHash);
  });
});

function bootMinimalRuntime(): Extract<ReturnType<typeof bootSimulationV1>, { status: "booted" }> {
  const boot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
  if (boot.status !== "booted") {
    throw new Error("Expected minimal boot.");
  }

  return boot;
}

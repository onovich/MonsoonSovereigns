import { describe, expect, test } from "vitest";

import { createM5PlayableLoopScriptV1 } from "../packages/protocol/src/index";
import {
  bootSimulationV1,
  loadSaveV1,
  requestSaveV1,
  runM5PlayableLoopV1,
  submitCommandV1,
  type M5PlayableLoopResultV1
} from "../packages/sim-core/src/index";

describe("M5-SIM-PLAYABLE-LOOP-001 deterministic playable loop", () => {
  test("runs start-to-postwar success path with stable Node and worker-compatible hashes", () => {
    const script = createM5PlayableLoopScriptV1();
    const nodeResult = runM5PlayableLoopV1(script);
    const workerResult = runM5PlayableLoopInWorkerCompatibleAdapter(script);

    expect(nodeResult).toEqual(workerResult);
    expect(nodeResult).toMatchObject({
      status: "ok",
      outcome: "success",
      finalDay: 24,
      finalRevision: 15,
      commandCount: 15,
      postwarCandidateCount: 1,
      postwarArrangementCount: 1,
      failure: {
        status: "rejected",
        code: "duplicate-obligation-settlement",
        path: "payload.districtId",
        stateHashUnchanged: true
      }
    });
    expect(nodeResult.finalHash).toBe(nodeResult.loadedHash);
    expect(nodeResult.verifiedHash).toBe(nodeResult.loadedHash);
    expect(nodeResult.saveByteLength).toBeGreaterThan(0);
  });

  test("save/load after success preserves M4 handoff and duplicate settlement rejection", () => {
    const script = createM5PlayableLoopScriptV1();
    const boot = bootSimulationV1(script.boot);
    if (boot.status !== "booted") {
      throw new Error("Expected M5 boot fixture.");
    }

    let runtime = boot.runtime;
    for (const command of script.successCommands) {
      const submitted = submitCommandV1(runtime, command);
      expect(submitted.result.status).toBe("accepted");
      runtime = submitted.runtime;
    }

    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected M5 save to load.");
    }

    expect(loaded.stateHash).toBe(runtime.world.meta.stateHash);
    expect(loaded.runtime.world.state.m4?.postwarCandidates).toHaveLength(1);
    expect(
      loaded.runtime.eventTail.filter((event) => event.kind === "sim.m3-postwar-governance-applied")
    ).toHaveLength(1);

    const hashBeforeDuplicate = loaded.runtime.world.meta.stateHash;
    const duplicate = submitCommandV1(loaded.runtime, script.duplicatePostwarCommand);
    expect(duplicate.result.status).toBe("rejected");
    if (duplicate.result.status !== "rejected") {
      throw new Error("Expected duplicate postwar command to reject.");
    }
    expect(duplicate.result.error.code).toBe("duplicate-obligation-settlement");
    expect(duplicate.runtime.world.meta.stateHash).toBe(hashBeforeDuplicate);
  });
});

function runM5PlayableLoopInWorkerCompatibleAdapter(
  script: Parameters<typeof runM5PlayableLoopV1>[0]
): M5PlayableLoopResultV1 {
  return runM5PlayableLoopV1(script);
}

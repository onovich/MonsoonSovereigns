import { describe, expect, test } from "vitest";

import {
  bootSimulationV1,
  previewCommandV1,
  querySimulationV1,
  submitCommandV1
} from "../packages/sim-core/src/index";

import { createCommandQueryCanaryScript } from "../packages/protocol/src/index";

const { runCommandQueryCanaryInWorkerCompatibleAdapter } =
  await import("../apps/web/src/worker/hello-simulation-adapter.mjs");

describe("SIM-003 Node runner and Worker command/query contract", () => {
  test("boot, preview, submit, query, and advance share the same command path and hash", () => {
    const script = createCommandQueryCanaryScript();
    const nodeBoot = bootSimulationV1(script.boot);
    expect(nodeBoot.status).toBe("booted");
    let nodeRuntime = nodeBoot.runtime;

    const preview = previewCommandV1(nodeRuntime, script.commands[0]);
    expect(preview.status).toBe("accepted");
    for (const command of script.commands) {
      const submitted = submitCommandV1(nodeRuntime, command);
      expect(submitted.result.status).toBe("accepted");
      nodeRuntime = submitted.runtime;
    }

    const nodeHash = querySimulationV1(nodeRuntime, {
      schemaVersion: 1,
      kind: "sim.get-state-hash"
    });
    expect(nodeHash.status).toBe("ok");

    const workerResult = runCommandQueryCanaryInWorkerCompatibleAdapter(script);
    expect(workerResult.status).toBe("ok");
    expect(workerResult.finalHash).toBe(nodeRuntime.world.meta.stateHash);
    expect(workerResult.finalHash).toBe(nodeHash.result.stateHash);
  });
});

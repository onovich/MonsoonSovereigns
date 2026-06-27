import { Worker } from "node:worker_threads";

import { describe, expect, test } from "vitest";

import {
  createM6AlphaStartToVictoryScriptV1,
  type M6AlphaTerminalOutcomeV1
} from "../packages/protocol/src/index";
import {
  bootSimulationV1,
  loadSaveV1,
  querySimulationV1,
  requestSaveV1,
  runM6AlphaStartToVictoryLoopV1,
  submitCommandV1,
  validateWorldStateV0,
  type M6AlphaStartToVictoryLoopResultV1,
  type SimulationRuntimeV1
} from "../packages/sim-core/src/index";

describe("M6-START-TO-VICTORY-SIM-LOOP-001 deterministic Alpha loop", () => {
  test("runs the accepted Alpha scenario from start to victory with Node/Worker hash parity", async () => {
    const script = createM6AlphaStartToVictoryScriptV1();
    const nodeResult = runM6AlphaStartToVictoryLoopV1(script);
    const workerResult = await runM6AlphaLoopInWorkerCompatibleAdapter(script);

    expect(nodeResult).toEqual(workerResult);
    expect(nodeResult).toMatchObject({
      status: "ok",
      terminalOutcome: "victory",
      terminalSchemaVersion: 1,
      finalDay: 25,
      finalRevision: 22,
      commandCount: 22,
      midRunLoadedHashMatches: true,
      malformedCommandRejected: true,
      malformedCommandStateHashUnchanged: true,
      noP0P1DataCorruption: true,
      evidence: {
        recognizedByCount: 1,
        legitimacyScoreBps: 1_150,
        postwarArrangementCount: 1,
        resolvedPolicyEventCount: 1,
        successionResolvedCount: 1,
        routeCount: 2,
        populationGroupCount: 3
      }
    });
    expect(nodeResult.finalHash).toBe(nodeResult.loadedHash);
    expect(nodeResult.verifiedHash).toBe(nodeResult.loadedHash);
    expect(nodeResult.saveByteLength).toBeGreaterThan(0);
  });

  test.each<M6AlphaTerminalOutcomeV1>(["continued-play", "defeat"])(
    "records deterministic %s terminal assessment through the same command path",
    (expectedOutcome) => {
      const script = createM6AlphaStartToVictoryScriptV1();
      const boot = bootSimulationV1(script.boot);
      expect(boot.status).toBe("booted");
      if (boot.status !== "booted") {
        throw new Error("Expected M6 Alpha boot fixture.");
      }

      const command =
        expectedOutcome === "continued-play"
          ? script.continuedPlayTerminalCommand
          : script.defeatTerminalCommand;
      const submitted = submitCommandV1(boot.runtime, command);
      expect(submitted.result.status).toBe("accepted");

      const terminal = queryTerminal(submitted.runtime, 1);
      expect(terminal.outcome).toBe(expectedOutcome);
      expect(terminal.schemaVersion).toBe(1);
      expect(validateWorldStateV0(submitted.runtime.world)).toEqual([]);
    }
  );

  test("save/load mid-run preserves Alpha evidence and rejects malformed terminal commands", () => {
    const script = createM6AlphaStartToVictoryScriptV1();
    const boot = bootSimulationV1(script.boot);
    expect(boot.status).toBe("booted");
    if (boot.status !== "booted") {
      throw new Error("Expected M6 Alpha boot fixture.");
    }

    let runtime = boot.runtime;
    for (const command of script.commandsBeforeMidRunSave) {
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
      throw new Error("Expected M6 Alpha mid-run save to load.");
    }
    expect(loaded.runtime.world.state.m6Alpha).toEqual(runtime.world.state.m6Alpha);

    const hashBeforeMalformed = loaded.runtime.world.meta.stateHash;
    const malformed = submitCommandV1(loaded.runtime, script.malformedTerminalCommand);
    expect(malformed.result.status).toBe("rejected");
    expect(malformed.runtime.world.meta.stateHash).toBe(hashBeforeMalformed);
  });
});

function queryTerminal(runtime: SimulationRuntimeV1, polityId: number) {
  const query = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.get-m6-alpha-terminal-state",
    payload: { queryId: `m6.alpha.terminal.${polityId}`, polityId }
  });
  expect(query.status).toBe("ok");
  if (query.status !== "ok" || query.result.kind !== "sim.get-m6-alpha-terminal-state") {
    throw new Error("Expected M6 Alpha terminal query.");
  }
  return query.result.terminalState;
}

function runM6AlphaLoopInWorkerCompatibleAdapter(
  script: Parameters<typeof runM6AlphaStartToVictoryLoopV1>[0]
): Promise<M6AlphaStartToVictoryLoopResultV1> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("../apps/sim-runner/src/m6-alpha-loop-worker.mjs", import.meta.url),
      { execArgv: ["--experimental-strip-types"] }
    );
    const finish = () => {
      worker.removeAllListeners();
      void worker.terminate();
    };

    worker.once("message", (message) => {
      finish();
      try {
        if (typeof message !== "string") {
          throw new Error("Expected M6 worker JSON string response.");
        }
        const response = JSON.parse(message) as unknown;
        if (!isRecord(response) || response["status"] !== "ok") {
          const errorMessage =
            isRecord(response) && typeof response["message"] === "string"
              ? response["message"]
              : "M6 worker returned an invalid response.";
          throw new Error(errorMessage);
        }
        resolve(response["result"] as M6AlphaStartToVictoryLoopResultV1);
      } catch (error) {
        reject(error);
      }
    });
    worker.once("error", (error) => {
      finish();
      reject(error);
    });
    worker.postMessage(JSON.stringify({ kind: "run-m6-alpha-loop-v1", script }));
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

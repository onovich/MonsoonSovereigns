import { Worker } from "node:worker_threads";

import { describe, expect, test } from "vitest";

import {
  createM6AlphaStartToVictoryScriptV1,
  type M6AlphaTerminalOutcomeV1
} from "../packages/protocol/src/index";
import {
  bootSimulationV1,
  createWorldStateV0,
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

  test("does not count unrelated polity postwar evidence toward evaluated polity victory", () => {
    const script = createM6AlphaStartToVictoryScriptV1();
    const boot = bootSimulationV1(script.boot);
    expect(boot.status).toBe("booted");
    if (boot.status !== "booted") {
      throw new Error("Expected M6 Alpha boot fixture.");
    }

    let runtime = boot.runtime;
    for (const command of [...script.commandsBeforeMidRunSave, ...script.commandsAfterMidRunSave]) {
      const submitted = submitCommandV1(runtime, command);
      expect(submitted.result.status).toBe("accepted");
      runtime = submitted.runtime;
    }

    const unrelatedPostwarRuntime = withOnlyUnrelatedPostwarCandidate(runtime);
    expect(validateWorldStateV0(unrelatedPostwarRuntime.world)).toEqual([]);

    const saved = requestSaveV1(unrelatedPostwarRuntime, {
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
      throw new Error("Expected unrelated-postwar regression save to load.");
    }
    expect(loaded.runtime.world.meta.stateHash).toBe(unrelatedPostwarRuntime.world.meta.stateHash);
    expect(loaded.runtime.world.state.m4?.postwarCandidates).toEqual(
      unrelatedPostwarRuntime.world.state.m4?.postwarCandidates
    );

    const submitted = submitCommandV1(loaded.runtime, script.victoryTerminalCommand);
    expect(submitted.result.status).toBe("accepted");
    const terminal = queryTerminal(submitted.runtime, 1);
    expect(terminal.outcome).toBe("continued-play");
    expect(terminal.evidence).toMatchObject({
      recognizedByCount: 1,
      legitimacyScoreBps: 1_150,
      postwarArrangementCount: 0,
      resolvedPolicyEventCount: 1,
      successionResolvedCount: 1,
      routeCount: 2,
      populationGroupCount: 3
    });

    const terminalSave = requestSaveV1(submitted.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const terminalLoad = loadSaveV1(boot.runtime, terminalSave.bytes, {
      expectedContentManifestHash: terminalSave.envelope.header.contentManifestHash,
      expectedScenarioId: terminalSave.envelope.header.scenarioId
    });
    expect(terminalLoad.status).toBe("loaded");
    if (terminalLoad.status !== "loaded") {
      throw new Error("Expected terminal regression save to load.");
    }
    expect(terminalLoad.runtime.world.meta.stateHash).toBe(submitted.runtime.world.meta.stateHash);
    expect(validateWorldStateV0(terminalLoad.runtime.world)).toEqual([]);
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

function withOnlyUnrelatedPostwarCandidate(runtime: SimulationRuntimeV1): SimulationRuntimeV1 {
  const m4 = runtime.world.state.m4;
  const m3 = runtime.world.state.m3;
  if (m4 === undefined || m3 === undefined || m4.postwarCandidates.length === 0) {
    throw new Error("Expected M6 Alpha runtime with M3/M4 postwar evidence.");
  }

  const originalCandidate = m4.postwarCandidates[0];
  if (originalCandidate === undefined) {
    throw new Error("Expected one M4 postwar candidate.");
  }
  const unrelatedCandidate = {
    ...originalCandidate,
    candidateId: "m4.unrelated-polity.candidate.1",
    victorPolityId: 2,
    localPolityId: 1,
    reasonCodes: [...originalCandidate.reasonCodes, "test.unrelated-postwar-candidate"]
  };
  const unrelatedWorld = createWorldStateV0({
    seed: runtime.world.meta.seed,
    contentManifestHash: runtime.world.meta.contentManifestHash,
    currentDay: runtime.world.meta.currentDay,
    revision: runtime.world.meta.revision,
    definitions: runtime.world.definitions,
    m2: runtime.world.state.m2,
    m3: {
      ...m3,
      obligations: m3.obligations.filter(
        (obligation) =>
          !(
            obligation.creditorPolityId === 1 &&
            obligation.obligationSource.sourceId.startsWith("m3.postwar.")
          )
      ),
      obligationAuditEvents: m3.obligationAuditEvents.filter(
        (event) => !event.reasonCodes.some((code) => code.startsWith("postwar."))
      )
    },
    m4: {
      ...m4,
      warOutcomes: m4.warOutcomes.map((outcome) =>
        outcome.outcomeId === originalCandidate.sourceWarOutcomeId
          ? {
              ...outcome,
              victorPolityId: 2,
              localPolityId: 1,
              postwarCandidate: unrelatedCandidate,
              reasonCodes: [...outcome.reasonCodes, "test.unrelated-postwar-candidate"]
            }
          : outcome
      ),
      postwarCandidates: [unrelatedCandidate]
    },
    m6: runtime.world.state.m6,
    m6PolicyEvents: runtime.world.state.m6PolicyEvents,
    m6Alpha: runtime.world.state.m6Alpha
  });
  return { ...runtime, world: unrelatedWorld };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

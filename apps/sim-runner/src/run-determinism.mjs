import { exit, stdout } from "node:process";
import { Worker } from "node:worker_threads";
import {
  createCommandQueryCanaryScript,
  createHelloThirtyDayRequest,
  createM4DeterminismReplayScriptV1,
  createM5PlayableLoopScriptV1,
  createSaveLoadCanaryScriptV1
} from "@monsoon/protocol";
import {
  runCommandQueryCanaryV1,
  runHelloSimulation,
  runM4DeterminismReplayV1,
  runM5PlayableLoopV1,
  runSaveLoadCanaryV1
} from "@monsoon/sim-core";

const {
  runCommandQueryCanaryInWorkerCompatibleAdapter,
  runHelloSimulationInWorkerCompatibleAdapter,
  runM4DeterminismReplayInWorkerCompatibleAdapter,
  runSaveLoadCanaryInWorkerCompatibleAdapter
} = await import("../../web/src/worker/hello-simulation-adapter.mjs");

const request = createHelloThirtyDayRequest();
const nodeResult = runHelloSimulation(request);
const workerResult = runHelloSimulationInWorkerCompatibleAdapter(request);

stdout.write(`Node hash: ${nodeResult.stateHash}\n`);
stdout.write(`Worker-compatible hash: ${workerResult.stateHash}\n`);

if (nodeResult.stateHash !== workerResult.stateHash) {
  stdout.write("Deterministic hello simulation hash mismatch.\n");
  exit(1);
}

if (nodeResult.daysSimulated !== 30 || workerResult.daysSimulated !== 30) {
  stdout.write("Deterministic hello simulation did not run exactly 30 days.\n");
  exit(1);
}

stdout.write("Deterministic hello simulation matched for 30 days.\n");

const commandQueryScript = createCommandQueryCanaryScript();
const nodeCommandResult = runCommandQueryCanaryV1(commandQueryScript);
const workerCommandResult = runCommandQueryCanaryInWorkerCompatibleAdapter(commandQueryScript);

stdout.write(`Node command/query hash: ${nodeCommandResult.finalHash}\n`);
stdout.write(`Worker-compatible command/query hash: ${workerCommandResult.finalHash}\n`);

if (nodeCommandResult.finalHash !== workerCommandResult.finalHash) {
  stdout.write("Deterministic command/query simulation hash mismatch.\n");
  exit(1);
}

if (nodeCommandResult.finalDay !== 2 || workerCommandResult.finalDay !== 2) {
  stdout.write("Deterministic command/query canary did not run exactly 2 days.\n");
  exit(1);
}

stdout.write("Deterministic command/query simulation matched.\n");

const saveLoadScript = createSaveLoadCanaryScriptV1();
const nodeSaveLoadResult = runSaveLoadCanaryV1(saveLoadScript);
const workerSaveLoadResult = runSaveLoadCanaryInWorkerCompatibleAdapter(saveLoadScript);

stdout.write(`Node save/load hash: ${nodeSaveLoadResult.finalHash}\n`);
stdout.write(`Worker-compatible save/load hash: ${workerSaveLoadResult.finalHash}\n`);
stdout.write(`Save/load byte length: ${nodeSaveLoadResult.saveByteLength}\n`);

if (
  nodeSaveLoadResult.finalHash !== workerSaveLoadResult.finalHash ||
  nodeSaveLoadResult.loadedHash !== workerSaveLoadResult.loadedHash ||
  nodeSaveLoadResult.replayedHash !== workerSaveLoadResult.replayedHash
) {
  stdout.write("Deterministic save/load simulation hash mismatch.\n");
  exit(1);
}

stdout.write("Deterministic save/load simulation matched.\n");

const m4ReplayScript = createM4DeterminismReplayScriptV1();
const nodeM4Result = runM4DeterminismReplayV1(m4ReplayScript);
const workerM4Result = runM4DeterminismReplayInWorkerCompatibleAdapter(m4ReplayScript);

stdout.write(`Node M4 hash: ${nodeM4Result.finalHash}\n`);
stdout.write(`Worker-compatible M4 hash: ${workerM4Result.finalHash}\n`);
stdout.write(`M4 engagement hash: ${nodeM4Result.engagementHash}\n`);
stdout.write(`M4 siege hash: ${nodeM4Result.siegeHash}\n`);
stdout.write(`M4 withdrawal hash: ${nodeM4Result.withdrawalHash}\n`);
stdout.write(`M4 postwar candidates: ${nodeM4Result.postwarCandidateCount}\n`);

if (
  nodeM4Result.finalHash !== workerM4Result.finalHash ||
  nodeM4Result.engagementHash !== workerM4Result.engagementHash ||
  nodeM4Result.siegeHash !== workerM4Result.siegeHash ||
  nodeM4Result.withdrawalHash !== workerM4Result.withdrawalHash ||
  nodeM4Result.postwarCandidateCount !== workerM4Result.postwarCandidateCount
) {
  stdout.write("Deterministic M4 replay hash mismatch.\n");
  exit(1);
}

if (nodeM4Result.postwarCandidateCount !== 1 || workerM4Result.postwarCandidateCount !== 1) {
  stdout.write("Deterministic M4 replay did not create exactly one postwar candidate.\n");
  exit(1);
}

stdout.write("Deterministic M4 replay simulation matched.\n");

const m5PlayableScript = createM5PlayableLoopScriptV1();
const nodeM5Result = runM5PlayableLoopV1(m5PlayableScript);
const workerM5Result = await runM5PlayableLoopInWorkerCompatibleAdapter(m5PlayableScript);

stdout.write(`Node M5 hash: ${nodeM5Result.finalHash}\n`);
stdout.write(`Worker-compatible M5 hash: ${workerM5Result.finalHash}\n`);
stdout.write(`M5 loaded hash: ${nodeM5Result.loadedHash}\n`);
stdout.write(`M5 postwar arrangements: ${nodeM5Result.postwarArrangementCount}\n`);

if (
  nodeM5Result.finalHash !== workerM5Result.finalHash ||
  nodeM5Result.loadedHash !== workerM5Result.loadedHash ||
  nodeM5Result.failure.code !== workerM5Result.failure.code ||
  nodeM5Result.failure.stateHashUnchanged !== workerM5Result.failure.stateHashUnchanged
) {
  stdout.write("Deterministic M5 playable loop hash mismatch.\n");
  exit(1);
}

if (
  nodeM5Result.outcome !== "success" ||
  nodeM5Result.postwarCandidateCount !== 1 ||
  nodeM5Result.postwarArrangementCount !== 1 ||
  nodeM5Result.failure.code !== "duplicate-obligation-settlement"
) {
  stdout.write("Deterministic M5 playable loop did not reach the accepted slice outcome.\n");
  exit(1);
}

stdout.write("Deterministic M5 playable loop simulation matched.\n");

function runM5PlayableLoopInWorkerCompatibleAdapter(script) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./m5-playable-loop-worker.mjs", import.meta.url), {
      execArgv: ["--experimental-strip-types"]
    });
    const finish = () => {
      worker.removeAllListeners();
      void worker.terminate();
    };

    worker.once("message", (message) => {
      finish();
      try {
        if (typeof message !== "string") {
          throw new Error("M5 worker response must be a JSON string.");
        }
        const response = JSON.parse(message);
        if (response?.status !== "ok") {
          throw new Error(response?.message ?? "M5 worker returned an error.");
        }
        resolve(response.result);
      } catch (error) {
        reject(error);
      }
    });
    worker.once("error", (error) => {
      finish();
      reject(error);
    });
    worker.postMessage(JSON.stringify({ kind: "run-m5-playable-loop-v1", script }));
  });
}

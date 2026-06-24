import { exit, stdout } from "node:process";
import {
  createCommandQueryCanaryScript,
  createHelloThirtyDayRequest,
  createSaveLoadCanaryScriptV1
} from "@monsoon/protocol";
import {
  runCommandQueryCanaryV1,
  runHelloSimulation,
  runSaveLoadCanaryV1
} from "@monsoon/sim-core";

const {
  runCommandQueryCanaryInWorkerCompatibleAdapter,
  runHelloSimulationInWorkerCompatibleAdapter,
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

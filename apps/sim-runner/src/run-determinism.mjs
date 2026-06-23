import { exit, stdout } from "node:process";
import { createHelloThirtyDayRequest } from "@monsoon/protocol";
import { runHelloSimulation } from "@monsoon/sim-core";

const { runHelloSimulationInWorkerCompatibleAdapter } = await import(
  "../../web/src/worker/hello-simulation-adapter.mjs"
);

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

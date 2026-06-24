import {
  runCommandQueryCanaryV1,
  runHelloSimulation,
  runSaveLoadCanaryV1
} from "../../../../packages/sim-core/src/index.ts";

/**
 * @typedef {import("../../../../packages/protocol/src/index.js").HelloSimulationRequestDto} HelloSimulationRequestDto
 * @typedef {import("../../../../packages/protocol/src/index.js").HelloSimulationResultDto} HelloSimulationResultDto
 * @typedef {import("../../../../packages/protocol/src/index.js").CommandQueryCanaryScriptV1} CommandQueryCanaryScriptV1
 * @typedef {import("../../../../packages/protocol/src/index.js").SaveLoadCanaryScriptV1} SaveLoadCanaryScriptV1
 */

/**
 * @param {HelloSimulationRequestDto} request
 * @returns {HelloSimulationResultDto}
 */
export function runHelloSimulationInWorkerCompatibleAdapter(request) {
  return runHelloSimulation(request);
}

/**
 * @param {CommandQueryCanaryScriptV1} script
 * @returns {import("../../../../packages/sim-core/src/index.ts").CommandQueryCanaryResultV1}
 */
export function runCommandQueryCanaryInWorkerCompatibleAdapter(script) {
  return runCommandQueryCanaryV1(script);
}

/**
 * @param {SaveLoadCanaryScriptV1} script
 * @returns {import("../../../../packages/sim-core/src/index.ts").SaveLoadCanaryResultV1}
 */
export function runSaveLoadCanaryInWorkerCompatibleAdapter(script) {
  return runSaveLoadCanaryV1(script);
}

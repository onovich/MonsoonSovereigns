const simCoreModuleUrl = new URL("../../../../packages/sim-core/src/index.ts", import.meta.url);
const { runCommandQueryCanaryV1, runHelloSimulation } = await import(simCoreModuleUrl.href);

/**
 * @typedef {import("../../../../packages/protocol/src/index.js").HelloSimulationRequestDto} HelloSimulationRequestDto
 * @typedef {import("../../../../packages/protocol/src/index.js").HelloSimulationResultDto} HelloSimulationResultDto
 * @typedef {import("../../../../packages/protocol/src/index.js").CommandQueryCanaryScriptV1} CommandQueryCanaryScriptV1
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

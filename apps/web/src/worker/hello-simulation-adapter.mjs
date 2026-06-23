const simCoreModuleUrl = new URL("../../../../packages/sim-core/src/index.ts", import.meta.url);
const { runHelloSimulation } = await import(simCoreModuleUrl.href);

/**
 * @typedef {import("../../../../packages/protocol/src/index.js").HelloSimulationRequestDto} HelloSimulationRequestDto
 * @typedef {import("../../../../packages/protocol/src/index.js").HelloSimulationResultDto} HelloSimulationResultDto
 */

/**
 * @param {HelloSimulationRequestDto} request
 * @returns {HelloSimulationResultDto}
 */
export function runHelloSimulationInWorkerCompatibleAdapter(request) {
  return runHelloSimulation(request);
}

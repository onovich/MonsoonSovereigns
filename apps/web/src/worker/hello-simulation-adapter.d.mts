import type {
  HelloSimulationRequestDto,
  HelloSimulationResultDto
} from "@monsoon/protocol";

export function runHelloSimulationInWorkerCompatibleAdapter(
  request: HelloSimulationRequestDto
): HelloSimulationResultDto;

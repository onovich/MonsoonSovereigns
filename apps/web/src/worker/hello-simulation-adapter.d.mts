import type {
  CommandQueryCanaryScriptV1,
  HelloSimulationRequestDto,
  HelloSimulationResultDto
} from "@monsoon/protocol";

export function runHelloSimulationInWorkerCompatibleAdapter(
  request: HelloSimulationRequestDto
): HelloSimulationResultDto;

export function runCommandQueryCanaryInWorkerCompatibleAdapter(
  script: CommandQueryCanaryScriptV1
): {
  readonly status: "ok";
  readonly finalHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
};

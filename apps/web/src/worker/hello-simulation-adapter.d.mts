import type {
  CommandQueryCanaryScriptV1,
  HelloSimulationRequestDto,
  HelloSimulationResultDto,
  SaveLoadCanaryScriptV1
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

export function runSaveLoadCanaryInWorkerCompatibleAdapter(script: SaveLoadCanaryScriptV1): {
  readonly status: "ok";
  readonly finalHash: string;
  readonly loadedHash: string;
  readonly replayedHash: string;
  readonly saveByteLength: number;
};

import type {
  CommandQueryCanaryScriptV1,
  HelloSimulationRequestDto,
  HelloSimulationResultDto,
  M4DeterminismReplayScriptV1,
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

export function runM4DeterminismReplayInWorkerCompatibleAdapter(
  script: M4DeterminismReplayScriptV1
): {
  readonly status: "ok";
  readonly finalHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
  readonly engagementHash: string;
  readonly siegeHash: string;
  readonly withdrawalHash: string;
  readonly postwarCandidateCount: number;
  readonly campaignPlanStatus: string;
  readonly campaignPlanStatusReasonCode: string | null;
};

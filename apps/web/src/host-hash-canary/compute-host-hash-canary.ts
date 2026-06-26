import {
  createCommandQueryCanaryScript,
  createHelloThirtyDayRequest,
  createM4DeterminismReplayScriptV1,
  createSaveLoadCanaryScriptV1
} from "@monsoon/protocol";
import {
  runCommandQueryCanaryInWorkerCompatibleAdapter,
  runHelloSimulationInWorkerCompatibleAdapter,
  runM4DeterminismReplayInWorkerCompatibleAdapter,
  runSaveLoadCanaryInWorkerCompatibleAdapter
} from "../worker/hello-simulation-adapter.mjs";

export interface HostHashCanaryHashes {
  readonly helloHash: string;
  readonly commandQueryHash: string;
  readonly saveLoadHash: string;
  readonly m4Hash: string;
  readonly m4EngagementHash: string;
  readonly m4SiegeHash: string;
  readonly m4WithdrawalHash: string;
  readonly saveByteLength: number;
}

export function computeM2HostHashCanaryHashes(): HostHashCanaryHashes {
  const helloResult = runHelloSimulationInWorkerCompatibleAdapter(createHelloThirtyDayRequest());
  const commandQueryResult = runCommandQueryCanaryInWorkerCompatibleAdapter(
    createCommandQueryCanaryScript()
  );
  const saveLoadResult = runSaveLoadCanaryInWorkerCompatibleAdapter(createSaveLoadCanaryScriptV1());
  const m4Result = runM4DeterminismReplayInWorkerCompatibleAdapter(
    createM4DeterminismReplayScriptV1()
  );

  return {
    helloHash: helloResult.stateHash,
    commandQueryHash: commandQueryResult.finalHash,
    saveLoadHash: saveLoadResult.finalHash,
    m4Hash: m4Result.finalHash,
    m4EngagementHash: m4Result.engagementHash,
    m4SiegeHash: m4Result.siegeHash,
    m4WithdrawalHash: m4Result.withdrawalHash,
    saveByteLength: saveLoadResult.saveByteLength
  };
}

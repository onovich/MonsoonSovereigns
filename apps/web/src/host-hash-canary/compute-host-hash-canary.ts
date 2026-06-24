import {
  createCommandQueryCanaryScript,
  createHelloThirtyDayRequest,
  createSaveLoadCanaryScriptV1
} from "@monsoon/protocol";
import {
  runCommandQueryCanaryInWorkerCompatibleAdapter,
  runHelloSimulationInWorkerCompatibleAdapter,
  runSaveLoadCanaryInWorkerCompatibleAdapter
} from "../worker/hello-simulation-adapter.mjs";

export interface HostHashCanaryHashes {
  readonly helloHash: string;
  readonly commandQueryHash: string;
  readonly saveLoadHash: string;
  readonly saveByteLength: number;
}

export function computeM2HostHashCanaryHashes(): HostHashCanaryHashes {
  const helloResult = runHelloSimulationInWorkerCompatibleAdapter(createHelloThirtyDayRequest());
  const commandQueryResult = runCommandQueryCanaryInWorkerCompatibleAdapter(
    createCommandQueryCanaryScript()
  );
  const saveLoadResult = runSaveLoadCanaryInWorkerCompatibleAdapter(createSaveLoadCanaryScriptV1());

  return {
    helloHash: helloResult.stateHash,
    commandQueryHash: commandQueryResult.finalHash,
    saveLoadHash: saveLoadResult.finalHash,
    saveByteLength: saveLoadResult.saveByteLength
  };
}

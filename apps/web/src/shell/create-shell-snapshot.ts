import {
  applyClientReadModelDelta,
  createInitialClientReadModelSnapshot,
  type ClientReadModelSnapshot
} from "@monsoon/client-core";
import { createHelloThirtyDayRequest } from "@monsoon/protocol";

import { runHelloSimulationInWorkerCompatibleAdapter } from "../worker/hello-simulation-adapter.mjs";

export function createBootstrappedShellSnapshot(): ClientReadModelSnapshot {
  const initialSnapshot = createInitialClientReadModelSnapshot();
  const result = runHelloSimulationInWorkerCompatibleAdapter(createHelloThirtyDayRequest());

  return applyClientReadModelDelta(initialSnapshot, {
    kind: "hello-result",
    result
  });
}

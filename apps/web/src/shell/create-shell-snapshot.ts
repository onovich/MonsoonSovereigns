import {
  applyClientReadModelDelta,
  createInitialClientReadModelSnapshot,
  createM2PrototypeClientReadModelSnapshot,
  type ClientReadModelSnapshot
} from "@monsoon/client-core";
import { createHelloThirtyDayRequest } from "@monsoon/protocol";

import { runHelloSimulationInWorkerCompatibleAdapter } from "../worker/hello-simulation-adapter.mjs";

export function createBootstrappedShellSnapshot(): ClientReadModelSnapshot {
  const initialSnapshot = createInitialClientReadModelSnapshot();
  const result = runHelloSimulationInWorkerCompatibleAdapter(createHelloThirtyDayRequest());
  const snapshotWithSimulation = applyClientReadModelDelta(initialSnapshot, {
    kind: "hello-result",
    result
  });

  return createM2PrototypeClientReadModelSnapshot(snapshotWithSimulation);
}

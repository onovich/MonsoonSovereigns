import {
  applyClientReadModelDelta,
  createInitialClientReadModelSnapshot,
  createSyntheticDistrictPressureFixture,
  withDistrictListReadModel,
  type ClientReadModelSnapshot
} from "@monsoon/client-core";
import { createHelloThirtyDayRequest } from "@monsoon/protocol";

import { runHelloSimulationInWorkerCompatibleAdapter } from "../worker/hello-simulation-adapter.mjs";

export function createBootstrappedShellSnapshot(): ClientReadModelSnapshot {
  const initialSnapshot = createInitialClientReadModelSnapshot();
  const result = runHelloSimulationInWorkerCompatibleAdapter(createHelloThirtyDayRequest());
  const districtList = createSyntheticDistrictPressureFixture();
  const snapshotWithDistricts = withDistrictListReadModel(initialSnapshot, districtList);

  return applyClientReadModelDelta(snapshotWithDistricts, {
    kind: "hello-result",
    result
  });
}

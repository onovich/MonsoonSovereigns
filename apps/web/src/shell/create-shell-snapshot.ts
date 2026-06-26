import {
  applyClientReadModelDelta,
  createInitialClientReadModelSnapshot,
  createM2PrototypeClientReadModelSnapshot,
  createSyntheticDistrictPressureFixture,
  type ClientReadModelSnapshot,
  withDistrictListReadModel
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

export function createWebClientShellSnapshot(search = ""): ClientReadModelSnapshot {
  const fixtureMode = readFixtureMode(search);
  const defaultSnapshot = createBootstrappedShellSnapshot();

  if (fixtureMode === "stress") {
    return createStressValidationShellSnapshot(defaultSnapshot);
  }

  return defaultSnapshot;
}

export function createStressValidationShellSnapshot(
  baseSnapshot: ClientReadModelSnapshot = createBootstrappedShellSnapshot()
): ClientReadModelSnapshot {
  return withDistrictListReadModel(baseSnapshot, createSyntheticDistrictPressureFixture());
}

function readFixtureMode(search: string): "default" | "stress" {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const rawFixture = params.get("fixture")?.trim().toLowerCase() ?? "";

  if (rawFixture === "stress" || rawFixture === "m4-stress") {
    return "stress";
  }

  return "default";
}

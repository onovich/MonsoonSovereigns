import {
  applyClientReadModelDelta,
  createInitialClientReadModelSnapshot,
  createM2PrototypeClientReadModelSnapshot,
  createM6AlphaEmptyReadModelFixture,
  createM6AlphaErrorReadModelFixture,
  createM6AlphaExtremeReadModelFixture,
  createSyntheticDistrictPressureFixture,
  type ClientReadModelSnapshot,
  withDistrictListReadModel,
  withM6AlphaReadModel
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
  if (fixtureMode === "m6-empty") {
    return withM6AlphaReadModel(
      defaultSnapshot,
      createM6AlphaEmptyReadModelFixture(defaultSnapshot)
    );
  }
  if (fixtureMode === "m6-error") {
    return withM6AlphaReadModel(
      defaultSnapshot,
      createM6AlphaErrorReadModelFixture(defaultSnapshot)
    );
  }
  if (fixtureMode === "m6-extreme") {
    return withM6AlphaReadModel(
      defaultSnapshot,
      createM6AlphaExtremeReadModelFixture(defaultSnapshot)
    );
  }

  return defaultSnapshot;
}

export function createStressValidationShellSnapshot(
  baseSnapshot: ClientReadModelSnapshot = createBootstrappedShellSnapshot()
): ClientReadModelSnapshot {
  return withDistrictListReadModel(baseSnapshot, createSyntheticDistrictPressureFixture());
}

function readFixtureMode(
  search: string
): "default" | "stress" | "m6-empty" | "m6-error" | "m6-extreme" {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const rawFixture = params.get("fixture")?.trim().toLowerCase() ?? "";

  if (rawFixture === "stress" || rawFixture === "m4-stress") {
    return "stress";
  }
  if (rawFixture === "m6-empty" || rawFixture === "alpha-empty") {
    return "m6-empty";
  }
  if (rawFixture === "m6-error" || rawFixture === "alpha-error") {
    return "m6-error";
  }
  if (rawFixture === "m6-extreme" || rawFixture === "alpha-extreme") {
    return "m6-extreme";
  }

  return "default";
}

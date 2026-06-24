import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import {
  createClientDistrictId,
  createInitialClientReadModelSnapshot,
  createM2PrototypeClientReadModelSnapshot,
  createSyntheticDistrictPressureFixture,
  type ClientMapMode,
  withDistrictListReadModel
} from "../packages/client-core/src/index";
import { ClientShellView } from "../packages/ui/src/index";

describe("M2 district client UI", () => {
  test("renders the district panel fields from the read-model slice", () => {
    const snapshot = withDistrictListReadModel(
      createInitialClientReadModelSnapshot(),
      createSyntheticDistrictPressureFixture()
    );
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain("M2 district panel");
    expect(markup).toContain("Population");
    expect(markup).toContain("Labor");
    expect(markup).toContain("Grain");
    expect(markup).toContain("Cash");
    expect(markup).toContain("Route");
    expect(markup).toContain("Synthetic UI pressure data");
  });

  test("server renders only the virtualized first window for the 4000-row fixture", () => {
    const snapshot = withDistrictListReadModel(
      createInitialClientReadModelSnapshot(),
      createSyntheticDistrictPressureFixture()
    );
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain('data-row-count="4000"');
    expect(markup).toContain('data-rendered-row-count="16"');
    expect(markup).toContain("Synthetic District 0001");
    expect(markup).not.toContain("Synthetic District 4000");
  });

  test("renders M2 map controls and fixture counts from read-model slices", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain('data-district-count="30"');
    expect(markup).toContain('data-settlement-count="10"');
    expect(markup).toContain('data-route-count="42"');
    expect(markup).toContain('aria-label="Seasonal map mode"');
    expect(markup).toContain('aria-label="Economy map mode"');
    expect(markup).toContain('aria-label="Routes map mode"');
    expect(markup).toContain("Prototype District 001");
  });
});

function createShell(snapshot: Parameters<typeof ClientShellView>[0]["snapshot"]) {
  const selectedEntity = { kind: "district" as const, districtId: createClientDistrictId(1) };
  const mapMode: ClientMapMode = "seasonal";
  return (
    <ClientShellView
      snapshot={snapshot}
      mapMode={mapMode}
      zoomLevel={1}
      selectedEntity={selectedEntity}
      onMapModeChange={() => undefined}
      onZoomLevelChange={() => undefined}
      onSelectedEntityChange={() => undefined}
      mapSurface={<div aria-label="M2 prototype map viewport" data-renderer-owner="map-renderer" />}
    />
  );
}

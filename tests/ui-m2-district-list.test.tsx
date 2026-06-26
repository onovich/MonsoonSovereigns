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

  test("renders M3 appointment workflow, bulk preview, rejection reasons, and outcome reasons", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain("M3 appointments");
    expect(markup).toContain('aria-label="M3 appointment workspace"');
    expect(markup).toContain('data-office-count="3"');
    expect(markup).toContain('data-character-count="4"');
    expect(markup).toContain('data-obligation-count="4"');
    expect(markup).toContain('data-bulk-eligible-count="2"');
    expect(markup).toContain('data-bulk-rejected-count="1"');
    expect(markup).toContain("Submit appointment");
    expect(markup).toContain("Submit bulk eligible appointments");
    expect(markup).toContain("character-unavailable");
    expect(markup).toContain("office-primary-conflict");
    expect(markup).toContain("Administrative impact preview");
    expect(markup).toContain("Vacancies, succession, obligations");
    expect(markup).toContain("Appointment and enfeoffment results");
    expect(markup).toContain("Visible reason summaries");
    expect(markup).not.toContain("WorldState");
  });

  test("renders M4 campaign planning, risk reasons, choices, AI trace, and war report", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain("M4 campaign planning");
    expect(markup).toContain('aria-label="M4 campaign planning workspace"');
    expect(markup).toContain('data-plan-count="2"');
    expect(markup).toContain('data-muster-readiness="partial"');
    expect(markup).toContain('data-war-report-count="2"');
    expect(markup).toContain("Submit plan");
    expect(markup).toContain("Start march");
    expect(markup).toContain("Cancel plan");
    expect(markup).toContain("Submit siege choice");
    expect(markup).toContain("Withdraw");
    expect(markup).toContain("route.season.monsoon-risk");
    expect(markup).toContain("withdrawal.reason.supply-collapse");
    expect(markup).toContain("m4.ai.withdraw.supply-collapse");
    expect(markup).toContain("War report");
    expect(markup).toContain("postwar.candidate.ready");
    expect(markup).toContain("restore-vassal-ruler");
    expect(markup).not.toContain("WorldState");
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
      onM3CommandSubmit={() => undefined}
      m3CommandStatus={null}
      onM4CommandSubmit={() => undefined}
      m4CommandStatus={null}
      mapSurface={<div aria-label="M2 prototype map viewport" data-renderer-owner="map-renderer" />}
    />
  );
}

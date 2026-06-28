import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import {
  createClientDistrictId,
  createInitialClientReadModelSnapshot,
  createM2PrototypeClientReadModelSnapshot,
  createM6AlphaEmptyReadModelFixture,
  createM6AlphaErrorReadModelFixture,
  createM6AlphaExtremeReadModelFixture,
  createM7GuidanceEmptyReadModelFixture,
  createM7GuidanceErrorReadModelFixture,
  createM7GuidanceExtremeReadModelFixture,
  createSyntheticDistrictPressureFixture,
  type ClientMapMode,
  withM6AlphaReadModel,
  withM7GuidanceReadModel,
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

  test("renders M5 playable flow, save load, AI risk, and postwar consequence surfaces", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain("M5 playable slice");
    expect(markup).toContain('aria-label="M5 playable slice workspace"');
    expect(markup).toContain('data-scenario-id="m5.composite.river-gate.v0"');
    expect(markup).toContain('data-phase="not-started"');
    expect(markup).toContain("Start M5 slice");
    expect(markup).toContain("Preview command");
    expect(markup).toContain("Confirm command");
    expect(markup).toContain("Save checkpoint");
    expect(markup).toContain("Load checkpoint");
    expect(markup).toContain("Manual node battle UI is unavailable in M5.");
    expect(markup).toContain("m4.ai.withdraw.supply-collapse");
    expect(markup).toContain("route.season.monsoon-risk");
    expect(markup).toContain("postwar.candidate.ready");
    expect(markup).not.toContain("WorldState");
  });

  test("renders M6 Alpha surfaces without placeholder major-system panels", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot));
    const m6Markup = markup.slice(markup.indexOf("M6 Alpha surfaces"));

    expect(markup).toContain("M6 Alpha surfaces");
    expect(markup).toContain('aria-label="M6 Alpha start to victory workspace"');
    expect(markup).toContain('data-scenario-id="m6.alpha.recognized-order.v0"');
    expect(markup).toContain('data-terminal-outcome="victory"');
    expect(markup).toContain("Start Alpha");
    expect(markup).toContain("Preview Alpha command");
    expect(markup).toContain("Confirm Alpha command");
    expect(markup).toContain('aria-describedby="m6-alpha-scenario-description"');
    expect(markup).toContain("Selected scenario: Recognized order path; primary-victory; day 0.");
    expect(markup).toContain('aria-describedby="m6-alpha-command-description"');
    expect(markup).toContain("protocol command DTOs only");
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('role="status"');
    expect(markup).toContain('data-status-kind="idle"');
    expect(markup).toContain("m6.command.no-alpha-command-submitted");
    expect(markup).toContain("Save Alpha checkpoint");
    expect(markup).toContain("Load Alpha checkpoint");
    expect(markup).toContain('aria-describedby="m6-alpha-save-description"');
    expect(markup).toContain("local client-session checkpoint");
    expect(markup).toContain("Diplomacy / legitimacy / succession");
    expect(markup).toContain("tribute-recognition");
    expect(markup).toContain("legitimacy.source.postwar-settlement");
    expect(markup).toContain("m6.alpha.succession.peaceful");
    expect(markup).toContain("Policies / events / encyclopedia");
    expect(markup).toContain("Harbor charter petition");
    expect(markup).toContain("Grant bounded harbor duties");
    expect(markup).toContain("Reject until obligations clear");
    expect(markup).toContain("Content tag COMPOSITE");
    expect(markup).toContain("encyclopedia.m6.policy_event.harbor");
    expect(markup).toContain("AI / adviser reasons");
    expect(markup).toContain("m6.adviser.recognized-order-ready");
    expect(markup).toContain("Map candidate");
    expect(markup).toContain("map.alpha.western-mainland-candidate");
    expect(markup).toContain("Victory / failure status");
    expect(markup).toContain("Manual node battle UI is not present in Alpha.");
    expect(m6Markup).not.toContain("placeholder");
    expect(markup).not.toContain("WorldState");
  });

  test("renders M6 Alpha empty, error, and extreme accessibility states", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const emptyMarkup = renderToStaticMarkup(
      createShell(
        withM6AlphaReadModel(baseSnapshot, createM6AlphaEmptyReadModelFixture(baseSnapshot))
      )
    );
    const errorMarkup = renderToStaticMarkup(
      createShell(
        withM6AlphaReadModel(baseSnapshot, createM6AlphaErrorReadModelFixture(baseSnapshot))
      )
    );
    const extremeMarkup = renderToStaticMarkup(
      createShell(
        withM6AlphaReadModel(baseSnapshot, createM6AlphaExtremeReadModelFixture(baseSnapshot))
      )
    );

    expect(emptyMarkup).toContain("Empty M6 Alpha read-model state");
    expect(emptyMarkup).toContain('data-command-count="0"');
    expect(emptyMarkup).toContain("No Alpha command selected");
    expect(emptyMarkup).toContain("m6.save.no-client-checkpoint");
    expect(errorMarkup).toContain('data-terminal-outcome="defeat"');
    expect(errorMarkup).toContain("m6.recognized-order.recognition-missing");
    expect(errorMarkup).toContain("Recover from a failed Alpha recognized-order attempt.");
    expect(extremeMarkup).toContain("Alpha pressure route 12");
    expect(extremeMarkup).toContain("Defer settlement review");
    expect(extremeMarkup).toContain('role="list"');
    expect(extremeMarkup).toContain('role="listitem"');
    expect(extremeMarkup).not.toContain("WorldState");
  });

  test("renders M7 tutorial hints encyclopedia surfaces from read-model content records", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot));
    const m7Markup = markup.slice(markup.indexOf("M7 tutorial / hints / encyclopedia"));

    expect(markup).toContain("M7 tutorial / hints / encyclopedia");
    expect(markup).toContain('aria-label="M7 tutorial hints encyclopedia workspace"');
    expect(markup).toContain('data-tutorial-step-count="7"');
    expect(markup).toContain('data-encyclopedia-entry-count="9"');
    expect(markup).toContain('data-not-content-lock-acceptance="true"');
    expect(markup).toContain('data-manual-node-battle-decision="DEFER_MANUAL_NODE_BATTLE"');
    expect(markup).toContain("M1: Command, query, and checkpoint authority");
    expect(markup).toContain("M7: Beta content review labels");
    expect(markup).toContain("Encyclopedia entries expose historical");
    expect(markup).toContain("INFERRED");
    expect(markup).toContain("HIGH");
    expect(markup).toContain("LANGUAGE_REVIEW_REQUIRED");
    expect(markup).toContain("RESEARCH REQUIRED");
    expect(markup).toContain("CULTURE_HUMAN_GATE_REQUIRED");
    expect(markup).toContain("Formal content lock acceptance remains outside this UI task.");
    expect(m7Markup).not.toContain("placeholder-only");
    expect(markup).not.toContain("WorldState");
    expect(markup).not.toContain("telemetry");
  });

  test("renders M7 empty, error, and extreme Storybook states", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const emptyMarkup = renderToStaticMarkup(
      createShell(
        withM7GuidanceReadModel(baseSnapshot, createM7GuidanceEmptyReadModelFixture(baseSnapshot))
      )
    );
    const errorMarkup = renderToStaticMarkup(
      createShell(
        withM7GuidanceReadModel(baseSnapshot, createM7GuidanceErrorReadModelFixture(baseSnapshot))
      )
    );
    const extremeMarkup = renderToStaticMarkup(
      createShell(
        withM7GuidanceReadModel(baseSnapshot, createM7GuidanceExtremeReadModelFixture(baseSnapshot))
      )
    );

    expect(emptyMarkup).toContain("No guidance projected");
    expect(emptyMarkup).toContain('data-tutorial-step-count="0"');
    expect(errorMarkup).toContain("review gates remain visible");
    expect(errorMarkup).toContain("scenario.beta.1581.succession-fracture");
    expect(extremeMarkup).toContain("Extreme review pass 12");
    expect(extremeMarkup).toContain('data-encyclopedia-entry-count="21"');
    expect(extremeMarkup).not.toContain("WorldState");
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
      onM5CommandSubmit={() => undefined}
      m5CommandStatus={null}
      onM6CommandSubmit={() => undefined}
      m6CommandStatus={null}
      mapSurface={<div aria-label="M2 prototype map viewport" data-renderer-owner="map-renderer" />}
    />
  );
}

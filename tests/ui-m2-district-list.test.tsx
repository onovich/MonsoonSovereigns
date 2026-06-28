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
import {
  CLIENT_ASSET_REPLACEMENT_SLOTS,
  CLIENT_DESIGN_TOKENS,
  CLIENT_SEMANTIC_STATES,
  ClientShellView,
  DesignTokenAssetSlotsView,
  createAssetSlotStressFixture,
  createClientI18n,
  hasOnlyNeutralPlaceholderAssets,
  isBareReasonCodeLike,
  listClientAssetReplacementSlots,
  parseClientLocalePreference,
  resolveClientLocale,
  type ClientI18n,
  type ClientLocalePreference
} from "../packages/ui/src/index";

describe("M2 district client UI", () => {
  test("renders the district panel fields from the read-model slice", () => {
    const snapshot = withDistrictListReadModel(
      createInitialClientReadModelSnapshot(),
      createSyntheticDistrictPressureFixture()
    );
    const markup = renderToStaticMarkup(createShell(snapshot));

    expect(markup).toContain("Selected district inspector");
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
    expect(markup).toContain("District 1");
    expect(markup).not.toContain("Synthetic District 4000");
  });

  test("renders M2 map controls and fixture counts from read-model slices", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(
      createShell(snapshot, "tutorial", createClientI18n("en-US"), "system", false)
    );

    expect(markup).toContain('data-district-count="30"');
    expect(markup).toContain('data-settlement-count="10"');
    expect(markup).toContain('data-route-count="42"');
    expect(markup).toContain('aria-label="Seasonal map mode"');
    expect(markup).toContain('aria-label="Economy map mode"');
    expect(markup).toContain('aria-label="Routes map mode"');
    expect(markup).not.toContain("Prototype District 001");
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
    expect(markup).toContain("Raw appointment reason codes");
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
    expect(markup).toContain("Monsoon route risk");
    expect(markup).toContain("Withdrawal from supply collapse");
    expect(markup).toContain("AI withdraws because supply collapsed");
    expect(markup).toContain("War report");
    expect(markup).toContain("Postwar candidate ready");
    expect(markup).toContain("Restore vassal ruler option");
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
    expect(markup).toContain("AI withdraws because supply collapsed");
    expect(markup).toContain("Monsoon route risk");
    expect(markup).toContain("Postwar candidate ready");
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
    expect(markup).toContain("No Alpha command submitted");
    expect(markup).toContain("Save Alpha checkpoint");
    expect(markup).toContain("Load Alpha checkpoint");
    expect(markup).toContain('aria-describedby="m6-alpha-save-description"');
    expect(markup).toContain("local client-session checkpoint");
    expect(markup).toContain("Diplomacy / legitimacy / succession");
    expect(markup).toContain("tribute-recognition");
    expect(markup).toContain("Legitimacy Source Postwar Settlement");
    expect(markup).toContain("M6 Alpha Succession Peaceful");
    expect(markup).toContain("Policies / events / encyclopedia");
    expect(markup).toContain("Harbor charter petition");
    expect(markup).toContain("Grant bounded harbor duties");
    expect(markup).toContain("Reject until obligations clear");
    expect(markup).toContain("Content tag COMPOSITE");
    expect(markup).toContain("encyclopedia.m6.policy_event.harbor");
    expect(markup).toContain("AI / adviser reasons");
    expect(markup).toContain("Adviser sees recognized order path ready");
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
    expect(emptyMarkup).toContain("No client checkpoint");
    expect(errorMarkup).toContain('data-terminal-outcome="defeat"');
    expect(errorMarkup).toContain("M6 Recognized Order Recognition Missing");
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

  test("renders M7 audio art localization coverage from static resource manifests", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const markup = renderToStaticMarkup(createShell(snapshot, "coverage"));

    expect(markup).toContain("Audio / art / localization coverage");
    expect(markup).toContain('aria-label="M7 audio art localization coverage"');
    expect(markup).toContain('data-locale-count="2"');
    expect(markup).toContain('data-asset-reference-count="8"');
    expect(markup).toContain('data-audio-reference-count="4"');
    expect(markup).toContain('data-art-reference-count="4"');
    expect(markup).toContain('data-localization-check-count="5"');
    expect(markup).toContain('data-viewport-smoke-count="4"');
    expect(markup).toContain('data-unresolved-risk-count="3"');
    expect(markup).toContain("m7.beta.audio-art-localization.coverage.v0");
    expect(markup).toContain("static-manifest-and-local-client-read-model-only");
    expect(markup).toContain("en-US / English");
    expect(markup).toContain("zh-Hans / Simplified Chinese");
    expect(markup).toContain("audio.ui.risk-warning");
    expect(markup).toContain("art.ui.review-state-badges");
    expect(markup).toContain("loc.content-record.keys");
    expect(markup).toContain("matched keys 36");
    expect(markup).toContain("viewport.1280x720");
    expect(markup).toContain("post1.audio.period-music");
    expect(markup).toContain("risk.culture-specific-assets-blocked");
    expect(markup).toContain("historical_researcher");
    expect(markup).toContain("Human Gate yes");
    expect(markup).not.toContain("WorldState");
    expect(markup).not.toContain("remote asset pipeline enabled");
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
    const emptyCoverageMarkup = renderToStaticMarkup(
      createShell(
        withM7GuidanceReadModel(baseSnapshot, createM7GuidanceEmptyReadModelFixture(baseSnapshot)),
        "coverage"
      )
    );
    const extremeCoverageMarkup = renderToStaticMarkup(
      createShell(
        withM7GuidanceReadModel(
          baseSnapshot,
          createM7GuidanceExtremeReadModelFixture(baseSnapshot)
        ),
        "coverage"
      )
    );

    expect(extremeMarkup).not.toContain("WorldState");
    expect(emptyCoverageMarkup).toContain('data-locale-count="0"');
    expect(extremeCoverageMarkup).toContain('data-asset-reference-count="8"');
  });

  test("canonicalizes supported en-* and zh-* locale families", () => {
    expect(parseClientLocalePreference("en")).toBe("en-US");
    expect(parseClientLocalePreference("en-GB")).toBe("en-US");
    expect(parseClientLocalePreference("zh-Hans")).toBe("zh-CN");
    expect(parseClientLocalePreference("zh-TW")).toBe("zh-CN");
    expect(parseClientLocalePreference("zh-HK")).toBe("zh-CN");
    expect(parseClientLocalePreference("zh-Hans-HK")).toBe("zh-CN");
    expect(parseClientLocalePreference("zh-CN")).toBe("zh-CN");
    expect(
      resolveClientLocale({
        preference: "system",
        systemLocales: ["en-GB", "zh-Hans"]
      })
    ).toBe("en-US");
    expect(
      resolveClientLocale({
        preference: "system",
        systemLocales: ["zh-Hans", "en-US"]
      })
    ).toBe("zh-CN");
    expect(
      resolveClientLocale({
        preference: "system",
        systemLocales: ["zh-TW"]
      })
    ).toBe("zh-CN");
    expect(
      resolveClientLocale({
        preference: "system",
        systemLocales: ["zh-HK"]
      })
    ).toBe("zh-CN");
    expect(
      resolveClientLocale({
        preference: "system",
        systemLocales: ["zh-Hans-HK"]
      })
    ).toBe("zh-CN");
    expect(
      resolveClientLocale({
        preference: "system",
        systemLocales: ["fr-FR"]
      })
    ).toBe("en-US");
  });

  test("renders localized language controls and reason display without mutating read models", () => {
    const snapshot = createM2PrototypeClientReadModelSnapshot();
    const beforeHash = snapshot.simulation.stateHash;
    const before = JSON.stringify(snapshot);
    const englishMarkup = renderToStaticMarkup(
      createShell(snapshot, "tutorial", createClientI18n("en-US"), "en-US")
    );
    const chineseMarkup = renderToStaticMarkup(
      createShell(snapshot, "tutorial", createClientI18n("zh-CN"), "zh-CN")
    );

    expect(englishMarkup).toContain("Language");
    expect(englishMarkup).toContain("Monsoon route risk");
    expect(englishMarkup).not.toContain('data-reason-code="route.season.monsoon-risk"');
    expect(englishMarkup).not.toContain(">route.season.monsoon-risk<");
    expect(chineseMarkup).toContain("语言");
    expect(chineseMarkup).toContain("季风路线风险");
    expect(chineseMarkup).toContain("季风诸王");
    expect(isBareReasonCodeLike("route.season.monsoon-risk")).toBe(true);
    expect(JSON.stringify(snapshot)).toBe(before);
    expect(snapshot.simulation.stateHash).toBe(beforeHash);
  });

  test("exposes M7 design tokens and neutral asset replacement slots", () => {
    const categories = new Set(CLIENT_ASSET_REPLACEMENT_SLOTS.map((slot) => slot.category));
    const markup = renderToStaticMarkup(<DesignTokenAssetSlotsView locale="en-US" />);

    expect(CLIENT_DESIGN_TOKENS.colors.semantic.danger).toBe("#a65b4b");
    expect(CLIENT_DESIGN_TOKENS.colors.mapLayer.routeReachable).toBe("#2f6f73");
    expect(CLIENT_SEMANTIC_STATES).toEqual([
      "enabled",
      "disabled",
      "warning",
      "success",
      "danger",
      "debug"
    ]);
    expect(hasOnlyNeutralPlaceholderAssets(CLIENT_ASSET_REPLACEMENT_SLOTS)).toBe(true);
    expect(categories).toEqual(
      new Set([
        "frame",
        "icon",
        "map-fill",
        "map-stroke",
        "route-style",
        "settlement-marker",
        "portrait",
        "alert",
        "settings-language",
        "tooltip"
      ])
    );
    expect(listClientAssetReplacementSlots("portrait")[0]?.reviewGates).toContain("culture-review");
    expect(markup).toContain("Design Tokens And Asset Slots");
    expect(markup).toContain('data-placeholder-policy="neutral-placeholders-only"');
    expect(markup).toContain('data-final-art-approved="false"');
    expect(markup).toContain('data-semantic-state="enabled"');
    expect(markup).toContain('data-semantic-state="disabled"');
    expect(markup).toContain('data-semantic-state="warning"');
    expect(markup).toContain('data-semantic-state="success"');
    expect(markup).toContain('data-semantic-state="danger"');
    expect(markup).toContain('data-slot-category="settings-language"');
    expect(markup).not.toContain("approved-final-art");
    expect(markup).not.toContain("WorldState");
  });

  test("renders M7 token stories for Chinese stress, debug, empty, error, and extreme states", () => {
    const chineseMarkup = renderToStaticMarkup(<DesignTokenAssetSlotsView locale="zh-CN" />);
    const debugMarkup = renderToStaticMarkup(
      <DesignTokenAssetSlotsView debugMode={true} locale="en-US" />
    );
    const emptyMarkup = renderToStaticMarkup(
      <DesignTokenAssetSlotsView evidenceState="empty" locale="en-US" />
    );
    const errorMarkup = renderToStaticMarkup(
      <DesignTokenAssetSlotsView evidenceState="error" locale="en-US" />
    );
    const extremeMarkup = renderToStaticMarkup(
      <DesignTokenAssetSlotsView
        assetSlots={createAssetSlotStressFixture()}
        evidenceState="extreme"
        locale="en-US"
      />
    );

    expect(chineseMarkup).toContain("设计 token 与资产替换槽");
    expect(chineseMarkup).toContain("在确认命令前");
    expect(debugMarkup).toContain('data-debug-mode="on"');
    expect(debugMarkup).toContain("raw slot ids and review gates");
    expect(emptyMarkup).toContain("No replacement slots are available.");
    expect(errorMarkup).toContain("Registry Error State");
    expect(extremeMarkup).toContain("localized expansion stress 11");
    expect(extremeMarkup).not.toContain("WorldState");
  });
});

function createShell(
  snapshot: Parameters<typeof ClientShellView>[0]["snapshot"],
  initialM7Surface: Parameters<typeof ClientShellView>[0]["initialM7Surface"] = "tutorial",
  i18n: ClientI18n = createClientI18n("en-US"),
  localePreference: ClientLocalePreference = "system",
  initialDebugMode = true
) {
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
      i18n={i18n}
      localePreference={localePreference}
      onLocalePreferenceChange={() => undefined}
      initialM7Surface={initialM7Surface}
      initialDebugMode={initialDebugMode}
      mapSurface={<div aria-label="Map region" data-renderer-owner="map-renderer" />}
    />
  );
}

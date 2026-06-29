import {
  createMemoryPixiMapNodeFactory,
  createMemoryPixiSceneLayer,
  createPixiMapScene,
  type PixiSceneLayer
} from "@monsoon/map-renderer";
import { createClientDistrictId } from "@monsoon/client-core";
import { ClientShellView, createClientI18n } from "@monsoon/ui";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  createBootstrappedShellSnapshot,
  createWebClientShellSnapshot
} from "./create-shell-snapshot";
import {
  CLIENT_LOCALE_STORAGE_KEY,
  persistLocalePreference,
  readBrowserSystemLocales,
  readStoredLocalePreference,
  resolveBrowserClientLocale,
  type LocaleStorageLike
} from "./i18n-platform";

describe("web client shell", () => {
  it("projects a simulation result into a disposable client read model", () => {
    const snapshot = createBootstrappedShellSnapshot();

    expect(snapshot.status).toBe("ready");
    expect(snapshot.simulation.daysSimulated).toBe(30);
    expect(snapshot.map.districts).toHaveLength(30);
    expect(snapshot.map.settlements).toHaveLength(10);
    expect(snapshot.districtList.rows).toHaveLength(30);
    expect(snapshot.m3Appointment.offices).toHaveLength(3);
    expect(snapshot.m3Appointment.bulkPreview.eligibleCount).toBe(2);
    expect(snapshot.m4Campaign.plans).toHaveLength(2);
    expect(snapshot.m4Campaign.muster.readiness).toBe("partial");
    expect(snapshot.m4Campaign.warReports).toHaveLength(2);
    expect(snapshot.m5Playable.scenarioId).toBe("m5.composite.river-gate.v0");
    expect(snapshot.m5Playable.steps.length).toBeGreaterThan(10);
    expect(snapshot.m5Playable.ai.primaryReasonCode).toBe("m4.ai.withdraw.supply-collapse");
    expect(snapshot.m5Playable.postwar.methods).toContain("restore-vassal-ruler");
    expect(snapshot.m6Alpha.scenarioId).toBe("m6.alpha.recognized-order.v0");
    expect(snapshot.m6Alpha.terminal.outcome).toBe("victory");
    expect(snapshot.m6Alpha.diplomacy.recognitionEdges).toHaveLength(1);
    expect(snapshot.districtList.provenance.kind).toBe("simulation-read-model");
    expect(snapshot.revision).toBe(snapshot.simulation.finalRevision);
    expect(JSON.stringify(snapshot)).not.toContain("WorldState");
  });

  it("switches to the 4000-row stress validation fixture when requested", () => {
    const snapshot = createWebClientShellSnapshot("?fixture=stress");

    expect(snapshot.districtList.provenance.kind).toBe("synthetic-pressure-fixture");
    expect(snapshot.districtList.rows).toHaveLength(4000);
    expect(snapshot.m4Campaign.plans).toHaveLength(2);
    expect(snapshot.m4Campaign.marches).toHaveLength(2);
    expect(snapshot.m4Campaign.sieges).toHaveLength(2);
    expect(snapshot.m4Campaign.withdrawals).toHaveLength(2);
    expect(snapshot.m4Campaign.warReports).toHaveLength(2);
    expect(snapshot.m4Campaign.warReports[0]?.postwarCandidate?.validM3Methods).toContain(
      "restore-vassal-ruler"
    );
    expect(snapshot.m4Campaign.warReports[1]?.postwarCandidate?.validM3Methods).toContain(
      "restore-vassal-ruler"
    );
    expect(snapshot.m5Playable.steps).toHaveLength(15);
    expect(snapshot.m5Playable.supply.expectedDaysOfSupply).toBe(11);
    expect(snapshot.m6Alpha.mapCandidate.districtCount).toBeGreaterThanOrEqual(4);
  });

  it("renders the M7 coverage tab inside the explicit debug overlay", () => {
    const snapshot = createWebClientShellSnapshot();
    const markup = renderToStaticMarkup(
      <ClientShellView
        snapshot={snapshot}
        mapMode="situation"
        zoomLevel={1}
        selectedEntity={{ kind: "district", districtId: createClientDistrictId(1) }}
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
        initialM7Surface="coverage"
        initialDebugMode
        mapSurface={<div aria-label="Map region" data-renderer-owner="map-renderer" />}
      />
    );

    expect(markup).toContain('data-debug-mode="on"');
    expect(markup).toContain('data-active-surface="coverage"');
    expect(markup).toContain('aria-label="M7 audio art localization coverage"');
    expect(markup).toContain("m7.beta.audio-art-localization.coverage.v0");
    expect(markup).toContain("risk.culture-specific-assets-blocked");
  });

  it("canonicalizes system fallback and persisted locale families without changing snapshots", () => {
    const writes = new Map<string, string>([[CLIENT_LOCALE_STORAGE_KEY, "zh-Hans"]]);
    const storage: LocaleStorageLike = {
      getItem: (key) => writes.get(key) ?? null,
      setItem: (key, value) => {
        writes.set(key, value);
      }
    };
    const snapshot = createWebClientShellSnapshot();
    const before = JSON.stringify(snapshot);

    expect(readStoredLocalePreference(storage)).toBe("zh-CN");
    expect(writes.get(CLIENT_LOCALE_STORAGE_KEY)).toBe("zh-CN");
    writes.set(CLIENT_LOCALE_STORAGE_KEY, "en-GB");
    expect(readStoredLocalePreference(storage)).toBe("en-US");
    expect(writes.get(CLIENT_LOCALE_STORAGE_KEY)).toBe("en-US");
    writes.set(CLIENT_LOCALE_STORAGE_KEY, "zh-TW");
    expect(readStoredLocalePreference(storage)).toBe("zh-CN");
    expect(writes.get(CLIENT_LOCALE_STORAGE_KEY)).toBe("zh-CN");
    expect(
      readBrowserSystemLocales({ languages: ["zh-Hans", "en-US"], language: "en-US" })
    ).toEqual(["zh-Hans", "en-US"]);
    expect(
      resolveBrowserClientLocale({
        preference: "system",
        browserLocales: ["en-GB", "zh-Hans"],
        desktopLocale: null
      })
    ).toBe("en-US");
    expect(
      resolveBrowserClientLocale({
        preference: "system",
        browserLocales: ["zh-HK"],
        desktopLocale: null
      })
    ).toBe("zh-CN");
    expect(
      resolveBrowserClientLocale({
        preference: "system",
        browserLocales: ["zh-Hans-HK"],
        desktopLocale: null
      })
    ).toBe("zh-CN");
    expect(
      resolveBrowserClientLocale({
        preference: "system",
        browserLocales: ["en-US"],
        desktopLocale: "zh-Hans"
      })
    ).toBe("zh-CN");
    expect(JSON.stringify(snapshot)).toBe(before);
  });

  it("falls back safely when locale storage getItem or setItem throws", () => {
    const getThrowingStorage: LocaleStorageLike = {
      getItem: () => {
        throw new Error("blocked getItem");
      },
      setItem: () => undefined
    };
    const setThrowingStorage: LocaleStorageLike = {
      getItem: () => "zh-HK",
      setItem: () => {
        throw new Error("blocked setItem");
      }
    };

    expect(readStoredLocalePreference(getThrowingStorage)).toBe("system");
    expect(readStoredLocalePreference(setThrowingStorage)).toBe("zh-CN");
    expect(() => persistLocalePreference(setThrowingStorage, "en-US")).not.toThrow();
  });

  it("renders the player shell without prototype diagnostics by default", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const markup = renderToStaticMarkup(
      <ClientShellView
        snapshot={snapshot}
        mapMode="situation"
        zoomLevel={1}
        selectedEntity={{ kind: "district", districtId: createClientDistrictId(1) }}
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
        mapSurface={<div aria-label="Map region" data-renderer-owner="map-renderer" />}
      />
    );

    expect(markup).toContain("Monsoon Sovereigns");
    expect(markup).toContain("Realm Map");
    expect(markup).toContain("No action has been previewed yet.");
    expect(markup).toContain("Decision Assistant");
    expect(markup).toContain("Current problem");
    expect(markup).toContain("Recommendation");
    expect(markup).toContain("Cost");
    expect(markup).toContain("Benefit");
    expect(markup).toContain("Risk");
    expect(markup).toContain("Next action");
    expect(markup).toContain("Decision Data");
    expect(markup).toContain(
      "Population, labor, stores, obligations, supply route, governance, and campaign planning details stay below the recommendation."
    );
    expect(markup.indexOf("Current problem")).toBeLessThan(markup.indexOf("Population"));
    expect(markup.indexOf("Recommendation")).toBeLessThan(markup.indexOf("Grain"));
    expect(markup).toContain('aria-label="Situation map mode"');
    expect(markup).toContain('aria-pressed="true">Situation</button>');
    expect(markup).toContain('aria-label="Map pan"');
    expect(markup).toContain('aria-label="Map hover details"');
    expect(markup).toContain("Route / supply");
    expect(markup).toContain("Obligation / tributary flow");
    expect(markup).toContain("Threat / risk");
    expect(markup).toContain("Blocked / capacity");
    expect(markup).toContain('data-map-presentation="soft-strategic-regions"');
    expect(markup).toContain('data-player-grid="hidden"');
    expect(markup).toContain("Recommended target: District 1");
    expect(markup).not.toContain("Prototype District 001");
    expect(markup).not.toContain(snapshot.simulation.stateHash);
    expect(markup).not.toContain("M2 prototype map ready");
    expect(markup).not.toContain("route.season.monsoon-risk");
    expect(markup).not.toContain("appointment.holder.skill-strong");
    expect(markup).not.toContain("m4.campaign.10.outcome");
    expect(markup).not.toContain("Raw district read-model values");
    expect(markup).not.toContain("raw district read-model values");
    expect(markup).not.toContain("Developer Overlay");
    expect(markup).not.toContain("Developer diagnostics");
    expect(markup).not.toContain("developer diagnostics");
    expect(markup).not.toContain("Guidance remains under review");
    expect(markup).not.toContain("blockers");
    expect(markup).not.toContain('aria-label="M3 appointment workspace"');
    expect(markup).toContain('data-renderer-owner="map-renderer"');
    expect(markup).toContain('data-district-count="30"');
    expect(markup).toContain('data-settlement-count="10"');
    expect(markup).toContain('data-row-count="30"');
    expect(markup).toContain("District 1");
    expect(markup).toContain("Monsoon route risk");
  });

  it("localizes player shell accessible names for Simplified Chinese", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const i18n = createClientI18n("zh-CN");
    const markup = renderToStaticMarkup(
      <ClientShellView
        snapshot={snapshot}
        mapMode="situation"
        zoomLevel={1}
        selectedEntity={{ kind: "district", districtId: createClientDistrictId(1) }}
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
        mapSurface={
          <div aria-label={i18n.t("shell.mapRegion.label")} data-renderer-owner="map-renderer" />
        }
      />
    );

    expect(markup).toContain('aria-label="虚拟化地区行"');
    expect(markup).toContain('aria-label="局势地图模式"');
    expect(markup).toContain("路线 / 补给");
    expect(markup).toContain("义务 / 朝贡流向");
    expect(markup).toContain(
      "人口、劳力、库存、义务、补给路线、治理与战役规划细节保留在建议之后。"
    );
    expect(markup).not.toContain("原始地区只读模型");
    expect(markup).toContain('aria-label="经济地图模式"');
    expect(markup).toContain('aria-label="按人口排序"');
    expect(markup).toContain('aria-label="按地区排序，当前升序"');
    expect(markup).toContain('aria-hidden="true"> 升序</span>');
    expect(markup).not.toContain('aria-label="Virtualized district rows"');
    expect(markup).not.toContain('aria-label="Situation map mode"');
    expect(markup).not.toContain('aria-label="Seasonal map mode"');
    expect(markup).not.toContain('aria-label="Sort by Population"');
    expect(markup).not.toContain('aria-hidden="true"> up</span>');
    expect(markup).not.toContain('aria-hidden="true"> down</span>');
  });

  it("explains the disabled obligation action for an unreachable district", () => {
    const snapshot = createWebClientShellSnapshot("?fixture=district-error");
    const markup = renderToStaticMarkup(
      <ClientShellView
        snapshot={snapshot}
        mapMode="situation"
        zoomLevel={1}
        selectedEntity={{ kind: "district", districtId: createClientDistrictId(1) }}
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
        mapSurface={<div aria-label="Map region" data-renderer-owner="map-renderer" />}
      />
    );

    expect(markup).toContain("District 1 cannot support a usable route.");
    expect(markup).toContain(
      "Review obligations is disabled here; select a reachable district from the map or route queue first."
    );
    expect(markup).toContain("Route is unavailable for this district.");
    expect(markup).toContain('<button type="button" disabled="">Review obligations</button>');
    expect(markup).not.toContain("Review obligations and route pressure before committing troops.");
  });

  it("renders legacy milestone workspaces only in developer overlay", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const markup = renderToStaticMarkup(
      <ClientShellView
        snapshot={snapshot}
        mapMode="seasonal"
        zoomLevel={1}
        selectedEntity={{ kind: "district", districtId: createClientDistrictId(1) }}
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
        initialDebugMode
        mapSurface={<div aria-label="Map region" data-renderer-owner="map-renderer" />}
      />
    );

    expect(markup).toContain("Developer Overlay");
    expect(markup).toContain("Hide developer overlay");
    expect(markup).toContain(snapshot.simulation.stateHash);
    expect(markup).toContain('aria-label="M3 appointment workspace"');
    expect(markup).toContain('data-bulk-eligible-count="2"');
    expect(markup).toContain('aria-label="M4 campaign planning workspace"');
    expect(markup).toContain('data-muster-readiness="partial"');
    expect(markup).toContain("AI withdraws because supply collapsed");
    expect(markup).toContain("Postwar candidate ready");
    expect(markup).toContain('aria-label="M5 playable slice workspace"');
    expect(markup).toContain("m5.composite.river-gate.v0");
    expect(markup).toContain("Manual node battle UI is unavailable in M5.");
    expect(markup).toContain('aria-label="M6 Alpha start to victory workspace"');
    expect(markup).toContain("m6.alpha.recognized-order.v0");
    expect(markup).toContain("Adviser sees recognized order path ready");
  });

  it("rebuilds the Pixi scene shell from the read model", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const stage = createMemoryPixiSceneLayer();
    const scene = createPixiMapScene(stage, createMemoryPixiMapNodeFactory());

    scene.rebuild(snapshot.map);
    const anchorLayer = getChildLayer(stage, 4);
    expect(stage.children.length).toBe(5);
    expect(anchorLayer.children.length).toBe(snapshot.map.anchors.length);

    scene.applyDelta({
      kind: "replace-read-model",
      snapshot: {
        ...snapshot.map,
        districts: snapshot.map.districts.slice(0, 2),
        settlements: snapshot.map.settlements.slice(0, 1),
        routes: snapshot.map.routes.slice(0, 1),
        anchors: snapshot.map.anchors.slice(0, 1)
      },
      viewport: {
        mode: "routes",
        zoomLevel: 1.8,
        selectedEntity: {
          kind: "district",
          districtId:
            snapshot.map.districts[0]?.districtId ?? snapshot.districtList.selectedDistrictId
        }
      }
    });
    expect(getChildLayer(stage, 0).children.length).toBe(2);
    expect(getChildLayer(stage, 2).children.length).toBe(1);
    expect(anchorLayer.children.length).toBe(1);

    scene.destroy();
  });
});

function getChildLayer(layer: PixiSceneLayer, index: number): PixiSceneLayer {
  const child = layer.children[index];
  if (!isPixiSceneLayer(child)) {
    throw new Error("Expected the Pixi scene shell to attach child layers.");
  }

  return child;
}

function isPixiSceneLayer(value: unknown): value is PixiSceneLayer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "children" in value && "addChild" in value && "removeChildren" in value;
}

import {
  createMemoryPixiMapNodeFactory,
  createMemoryPixiSceneLayer,
  createPixiMapScene,
  type PixiSceneLayer
} from "@monsoon/map-renderer";
import { createClientDistrictId } from "@monsoon/client-core";
import { ClientShellView } from "@monsoon/ui";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  createBootstrappedShellSnapshot,
  createWebClientShellSnapshot
} from "./create-shell-snapshot";
import {
  CLIENT_LOCALE_STORAGE_KEY,
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

  it("renders the M7 coverage tab from the initial search parameter", () => {
    const snapshot = createWebClientShellSnapshot();
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
        initialM7Surface="coverage"
        mapSurface={
          <div aria-label="M2 prototype map viewport" data-renderer-owner="map-renderer" />
        }
      />
    );

    expect(markup).toContain('data-active-surface="coverage"');
    expect(markup).toContain('aria-label="M7 audio art localization coverage"');
    expect(markup).toContain("m7.beta.audio-art-localization.coverage.v0");
    expect(markup).toContain("risk.culture-specific-assets-blocked");
  });

  it("persists zh-Hans locale aliases as zh-CN without changing shell snapshots", () => {
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
    expect(
      readBrowserSystemLocales({ languages: ["zh-Hans", "en-US"], language: "en-US" })
    ).toEqual(["zh-Hans", "en-US"]);
    expect(
      resolveBrowserClientLocale({
        preference: "system",
        browserLocales: ["en-US"],
        desktopLocale: "zh-Hans"
      })
    ).toBe("zh-CN");
    expect(JSON.stringify(snapshot)).toBe(before);
  });

  it("renders React from read model snapshots without authority-bearing state", () => {
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
        mapSurface={
          <div aria-label="M2 prototype map viewport" data-renderer-owner="map-renderer" />
        }
      />
    );

    expect(markup).toContain("Monsoon Sovereigns");
    expect(markup).toContain("Prototype District 001");
    expect(markup).toContain(snapshot.simulation.stateHash);
    expect(markup).toContain('data-renderer-owner="map-renderer"');
    expect(markup).toContain('data-district-count="30"');
    expect(markup).toContain('data-settlement-count="10"');
    expect(markup).toContain('data-row-count="30"');
    expect(markup).toContain('aria-label="M3 appointment workspace"');
    expect(markup).toContain('data-bulk-eligible-count="2"');
    expect(markup).toContain('aria-label="M4 campaign planning workspace"');
    expect(markup).toContain('data-muster-readiness="partial"');
    expect(markup).toContain("m4.ai.withdraw.supply-collapse");
    expect(markup).toContain("postwar.candidate.ready");
    expect(markup).toContain('aria-label="M5 playable slice workspace"');
    expect(markup).toContain("m5.composite.river-gate.v0");
    expect(markup).toContain("Manual node battle UI is unavailable in M5.");
    expect(markup).toContain('aria-label="M6 Alpha start to victory workspace"');
    expect(markup).toContain("m6.alpha.recognized-order.v0");
    expect(markup).toContain("m6.adviser.recognized-order-ready");
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

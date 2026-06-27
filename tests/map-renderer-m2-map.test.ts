import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { createM2PrototypeReadModelFixture } from "../packages/client-core/src/index";
import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import { parseM6AlphaMapCandidateSetSourceV0 } from "../packages/content-schema/src/index";
import {
  buildMapRenderPlan,
  createMemoryPixiMapNodeFactory,
  createMemoryPixiSceneLayer,
  createM6AlphaMapCandidateReadModelSnapshot,
  createPixiMapScene,
  type PixiSceneLayer
} from "../packages/map-renderer/src/index";

const m6AlphaMapCandidateFixtureUrl = new URL(
  "../content-source/m6-map-candidates/alpha-map-candidate-set.json",
  import.meta.url
);
const mapRendererSourceUrl = new URL("../packages/map-renderer/src/index.ts", import.meta.url);

describe("M2 map renderer read-model deltas", () => {
  test("builds seasonal, economy, and route plans from the M2 read model", () => {
    const fixture = createM2PrototypeReadModelFixture();

    const seasonal = buildMapRenderPlan(fixture.map, {
      mode: "seasonal",
      zoomLevel: 1,
      selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId }
    });
    const economy = buildMapRenderPlan(fixture.map, {
      mode: "economy",
      zoomLevel: 1.5,
      selectedEntity: null
    });
    const routes = buildMapRenderPlan(fixture.map, {
      mode: "routes",
      zoomLevel: 1.8,
      selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId }
    });

    expect(seasonal.districts).toHaveLength(30);
    expect(seasonal.settlements).toHaveLength(10);
    expect(seasonal.routes).toHaveLength(42);
    expect(seasonal.labels).toHaveLength(0);
    expect(economy.labels.length).toBeGreaterThanOrEqual(30);
    expect(routes.labels.length).toBeGreaterThanOrEqual(40);
    expect(seasonal.districts[0]?.fillColor).not.toBe(economy.districts[0]?.fillColor);
    expect(routes.routes.some((route) => route.widthInMapUnits === 4)).toBe(true);
  });

  test("rebuilds presentation cache from replace-read-model delta", () => {
    const fixture = createM2PrototypeReadModelFixture();
    const stage = createMemoryPixiSceneLayer();
    const scene = createPixiMapScene(stage, createMemoryPixiMapNodeFactory());

    scene.rebuild(fixture.map);
    expect(stage.children).toHaveLength(5);
    expect(getChildLayer(stage, 0).children).toHaveLength(30);
    expect(getChildLayer(stage, 1).children).toHaveLength(42);
    expect(getChildLayer(stage, 2).children).toHaveLength(10);

    scene.applyDelta({
      kind: "replace-read-model",
      snapshot: {
        ...fixture.map,
        districts: fixture.map.districts.slice(0, 3),
        routes: fixture.map.routes.slice(0, 2),
        settlements: fixture.map.settlements.slice(0, 1)
      },
      viewport: {
        mode: "routes",
        zoomLevel: 2,
        selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId }
      }
    });

    expect(getChildLayer(stage, 0).children).toHaveLength(3);
    expect(getChildLayer(stage, 1).children).toHaveLength(2);
    expect(getChildLayer(stage, 2).children).toHaveLength(1);
    expect(getChildLayer(stage, 3).children.length).toBeGreaterThan(0);

    scene.destroy();
    expect(stage.children).toHaveLength(0);
  });
});

describe("M6 alpha map candidate renderer read model", () => {
  test("projects compiled map candidates into map-renderer-compatible read models", async () => {
    const sourceText = await readFile(m6AlphaMapCandidateFixtureUrl, "utf8");
    const source = parseM6AlphaMapCandidateSetSourceV0(JSON.parse(sourceText) as unknown);
    const pack = compileContentPackV0OrThrow(source);
    if (pack.kind !== "runtime-m6-alpha-map-candidate-content-pack-v0") {
      throw new Error("Expected M6 alpha map candidate runtime pack.");
    }

    const snapshot = createM6AlphaMapCandidateReadModelSnapshot(pack, {
      candidateSourceId: "map.alpha.western-mainland-candidate",
      revision: 6
    });
    const plan = buildMapRenderPlan(snapshot, {
      mode: "seasonal",
      zoomLevel: 1.8,
      selectedEntity: null
    });

    expect(snapshot.revision).toBe(6);
    expect(snapshot.bounds).toEqual({ widthInMapUnits: 640, heightInMapUnits: 420 });
    expect(snapshot.districts).toHaveLength(4);
    expect(snapshot.settlements).toHaveLength(2);
    expect(snapshot.routes).toHaveLength(3);
    expect(snapshot.anchors.map((anchor) => anchor.id)).toEqual([
      "alpha-map-candidate",
      "alpha-map-source-label",
      "alpha-map-review-note"
    ]);
    expect(snapshot.districts.map((district) => district.seasonal.agriculturePhase)).toEqual([
      "coastal-interface",
      "water",
      "land",
      "land"
    ]);
    expect(plan.districts).toHaveLength(4);
    expect(plan.routes.map((route) => route.points.length)).toEqual([3, 3, 3]);
    expect(plan.labels.length).toBeGreaterThanOrEqual(4);
  });

  test("does not import sim-core authority into map-renderer", async () => {
    const sourceText = await readFile(mapRendererSourceUrl, "utf8");

    expect(sourceText).not.toContain("@monsoon/sim-core");
    expect(sourceText).not.toContain("../sim-core");
    expect(sourceText).not.toContain("WorldState");
  });
});

function getChildLayer(layer: PixiSceneLayer, index: number): PixiSceneLayer {
  const child = layer.children[index];
  if (!isPixiSceneLayer(child)) {
    throw new Error("Expected a Pixi scene layer.");
  }

  return child;
}

function isPixiSceneLayer(value: unknown): value is PixiSceneLayer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "children" in value && "addChild" in value && "removeChildren" in value;
}

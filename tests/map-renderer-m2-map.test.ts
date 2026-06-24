import { describe, expect, test } from "vitest";

import { createM2PrototypeReadModelFixture } from "../packages/client-core/src/index";
import {
  buildMapRenderPlan,
  createMemoryPixiMapNodeFactory,
  createMemoryPixiSceneLayer,
  createPixiMapScene,
  type PixiSceneLayer
} from "../packages/map-renderer/src/index";

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

import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import {
  createClientDistrictId,
  createM7TopologyReadModelFixture,
  createM2PrototypeReadModelFixture,
  projectM7TopologyClientReadModels
} from "../packages/client-core/src/index";
import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import { parseM6AlphaMapCandidateSetSourceV0 } from "../packages/content-schema/src/index";
import {
  MAP_RENDER_TOKENS,
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
  test("builds situation, seasonal, economy, and route plans from the M2 read model", () => {
    const fixture = createM2PrototypeReadModelFixture();

    const situation = buildMapRenderPlan(fixture.map, {
      mode: "situation",
      zoomLevel: 1,
      selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId }
    });
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

    expect(situation.mode).toBe("situation");
    expect(situation.districts).toHaveLength(30);
    expect(situation.settlements).toHaveLength(10);
    expect(situation.routes.length).toBeGreaterThan(0);
    expect(situation.routes.length).toBeLessThan(fixture.map.routes.length);
    expect(
      situation.routes.every((route) => route.isSelected || route.routeStatus !== "reachable")
    ).toBe(true);
    expect(situation.districts.every((district) => !isAxisAlignedRectangle(district.polygon))).toBe(
      true
    );
    expect(seasonal.districts).toHaveLength(30);
    expect(seasonal.settlements).toHaveLength(10);
    expect(seasonal.routes).toHaveLength(42);
    expect(seasonal.labels).toHaveLength(0);
    expect(economy.labels.length).toBeGreaterThanOrEqual(30);
    expect(routes.labels.length).toBeGreaterThanOrEqual(40);
    expect(seasonal.districts[0]?.fillColor).not.toBe(economy.districts[0]?.fillColor);
    expect(situation.districts[0]?.fillColor).not.toBe(seasonal.districts[0]?.fillColor);
    expect(routes.routes.some((route) => route.widthInMapUnits === 4)).toBe(true);
    expect(routes.routes).toHaveLength(fixture.map.routes.length);
  });

  test("uses centralized map render tokens for layer states", () => {
    const fixture = createM2PrototypeReadModelFixture();
    const plan = buildMapRenderPlan(fixture.map, {
      mode: "routes",
      zoomLevel: 1.8,
      selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId },
      hoveredEntity: { kind: "district", districtId: createClientDistrictId(2) },
      panOffset: { xInMapUnits: 24, yInMapUnits: -24 }
    });
    const selectedDistrict = plan.districts.find((district) => district.isSelected);
    const hoveredDistrict = plan.districts.find((district) => district.isHovered);
    const reachableDistrict = plan.districts.find(
      (district) => district.fillColor === MAP_RENDER_TOKENS.districts.routesMode.reachable
    );
    const reachableRoute = plan.routes.find(
      (route) => route.strokeColor === MAP_RENDER_TOKENS.routes.reachable
    );
    const selectedRoute = plan.routes.find((route) => route.isSelected);
    const blockedOrOverloadedRoute = plan.routes.find(
      (route) => route.presentationState === "blocked" || route.presentationState === "overloaded"
    );

    expect(MAP_RENDER_TOKENS.surface.canvasBackground).toBe("#f7f4ea");
    expect(selectedDistrict?.strokeColor).toBe(MAP_RENDER_TOKENS.districts.strokeSelected);
    expect(selectedDistrict?.presentationState).toBe("selected");
    expect(hoveredDistrict?.strokeColor).toBe(MAP_RENDER_TOKENS.districts.strokeHovered);
    expect(hoveredDistrict?.presentationState).toBe("hovered");
    expect(reachableDistrict).toBeDefined();
    expect(reachableDistrict?.routeStatus).toBe("reachable");
    expect(reachableRoute).toBeDefined();
    expect(selectedRoute?.widthInMapUnits).toBe(MAP_RENDER_TOKENS.routes.widthProminentInMapUnits);
    expect(selectedRoute?.presentationState).toBe("selected");
    expect(blockedOrOverloadedRoute).toBeDefined();
    expect(plan.panOffset).toEqual({ xInMapUnits: 24, yInMapUnits: -24 });
  });

  test("rebuilds presentation cache from replace-read-model delta", () => {
    const fixture = createM2PrototypeReadModelFixture();
    const stage = createMemoryPixiSceneLayer();
    const scene = createPixiMapScene(stage, createMemoryPixiMapNodeFactory());

    scene.rebuild(fixture.map);
    expect(stage.children).toHaveLength(5);
    expect(getChildLayer(stage, 0).children).toHaveLength(30);
    expect(getChildLayer(stage, 1).children).toHaveLength(0);
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

describe("M7 topology-backed map renderer anti-grid guarantees", () => {
  test("renders topology polygons and explicit route polylines without grid or centroid inference", () => {
    const fixture = createM7TopologyReadModelFixture();
    const situation = buildMapRenderPlan(fixture.map, {
      mode: "situation",
      zoomLevel: 1,
      selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId }
    });
    const routes = buildMapRenderPlan(fixture.map, {
      mode: "routes",
      zoomLevel: 1.6,
      selectedEntity: { kind: "district", districtId: fixture.districtList.selectedDistrictId }
    });

    expect(fixture.map.topology?.topologyHash).toBe("1ba53651");
    expect(fixture.map.districts).toHaveLength(14);
    expect(fixture.map.settlements).toHaveLength(0);
    expect(fixture.map.routes).toHaveLength(1);
    expect(fixture.map.anchors).toHaveLength(8);
    expect(fixture.map.topology?.routeEdges).toHaveLength(25);
    expect(
      fixture.map.districts.every((district) => !isAxisAlignedRectangle(district.polygon))
    ).toBe(true);
    expect(situation.anchors).toHaveLength(8);
    expect(situation.routes.map((route) => route.routeId)).toEqual([24]);
    expect(routes.routes).toHaveLength(1);
    expect(routes.routes.every((route) => route.points.length >= 2)).toBe(true);
  });

  test("keeps visual-neighbor-without-route and visually-distant-explicit-route reason codes", () => {
    const fixture = createM7TopologyReadModelFixture();
    const topology = fixture.map.topology;
    if (topology === undefined) {
      throw new Error("Expected topology read model.");
    }

    expect(topology.antiGridEvidence.visualNeighborWithoutRoute.edgeSequence).toEqual([]);
    expect(topology.antiGridEvidence.visualNeighborWithoutRoute.reasonCodes).toContain(
      "topology.path.no-known-route"
    );
    expect(topology.antiGridEvidence.visuallyDistantExplicitRoute.edgeSequence).toEqual([24]);
    expect(topology.antiGridEvidence.visuallyDistantExplicitRoute.reasonCodes).toContain(
      "topology.path.reachable"
    );
    expect(
      topology.pathPreviews.find(
        (preview) =>
          Number(preview.originDistrictId) === 2 &&
          Number(preview.destinationDistrictId) === 9 &&
          preview.status === "capacity-exceeded"
      )?.reasonCodes
    ).toContain("topology.path.capacity-exceeded");
  });

  test("does not let polygon perturbation change path preview edge sequence or AI reason code", () => {
    const fixture = createM7TopologyReadModelFixture();
    const originalTopology = fixture.map.topology;
    if (originalTopology === undefined) {
      throw new Error("Expected topology read model.");
    }

    const perturbedTopologyResult = {
      ...fixture.topologyResult,
      topology: {
        ...fixture.topologyResult.topology,
        districts: fixture.topologyResult.topology.districts.map((district, districtIndex) => ({
          ...district,
          polygon: district.polygon.map((point, pointIndex) => ({
            x: point.x + (pointIndex % 2 === 0 ? 3 + (districtIndex % 3) : -2),
            y: point.y + (pointIndex % 2 === 0 ? -2 : 3 + (districtIndex % 2))
          }))
        }))
      }
    };
    const perturbed = projectM7TopologyClientReadModels({
      revision: fixture.map.revision,
      topologyResult: perturbedTopologyResult,
      pathPreviewResults: fixture.pathPreviewResults
    });
    const perturbedTopology = perturbed.map.topology;
    if (perturbedTopology === undefined) {
      throw new Error("Expected perturbed topology read model.");
    }

    expect(perturbed.map.districts[0]?.polygon).not.toEqual(fixture.map.districts[0]?.polygon);
    expect(createPathPreviewSignature(perturbedTopology.pathPreviews)).toEqual(
      createPathPreviewSignature(originalTopology.pathPreviews)
    );
    expect(perturbed.map.routes.map((route) => route.routeId)).toEqual(
      fixture.map.routes.map((route) => route.routeId)
    );
    expect(perturbed.map.routes.map((route) => route.routeId)).toEqual([24]);
    expect(perturbedTopology.routeEdges).toHaveLength(originalTopology.routeEdges.length);
    expect(perturbedTopology.routeEdges).toHaveLength(25);
    expect(perturbedTopology.routeEdges.filter((edge) => edge.points.length >= 2)).toHaveLength(1);
    expect(
      perturbedTopology.routeEdges
        .filter((edge) => edge.points.length >= 2)
        .map((edge) => edge.routeId)
    ).toEqual([24]);
    expect(perturbedTopology.routeEdges.find((edge) => edge.routeId === 1)?.points).toEqual([]);
    expect(perturbedTopology.routeEdges.find((edge) => edge.routeId === 14)?.points).toEqual([]);
    expect(perturbedTopology.routeEdges.find((edge) => edge.routeId === 24)?.points).toHaveLength(
      2
    );
    expect(
      perturbedTopology.antiGridEvidence.geometryPerturbationInvariantPath.edgeSequence
    ).toEqual([3, 22, 19]);
    expect(
      perturbedTopology.antiGridEvidence.geometryPerturbationInvariantPath.reasonCodes
    ).toContain("topology.path.reachable");
  });

  test("exposes variable route degree, dead ends, chokepoints, modes, and blocked reasons", () => {
    const fixture = createM7TopologyReadModelFixture();
    const topology = fixture.map.topology;
    if (topology === undefined) {
      throw new Error("Expected topology read model.");
    }

    const routeDegrees = new Map<string, number>();
    for (const edge of topology.routeEdges) {
      const origin = Number(edge.originDistrictId).toString();
      const destination = Number(edge.destinationDistrictId).toString();
      routeDegrees.set(origin, (routeDegrees.get(origin) ?? 0) + 1);
      routeDegrees.set(destination, (routeDegrees.get(destination) ?? 0) + 1);
    }
    expect(new Set(routeDegrees.values()).size).toBeGreaterThan(1);
    expect(topology.antiGridEvidence.deadEndDistrictIds.map(Number)).toContain(14);
    expect(topology.antiGridEvidence.chokepointRouteIds).toEqual([24, 25]);
    expect(new Set(topology.routeEdges.map((edge) => edge.mode))).toEqual(
      new Set(["road", "river", "coast"])
    );
    expect(topology.routeEdges.find((edge) => edge.routeId === 25)?.reasonCodes).toContain(
      "topology.blocked.synthetic-pass-survey"
    );
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

function isAxisAlignedRectangle(
  polygon: readonly { readonly xInMapUnits: number; readonly yInMapUnits: number }[]
): boolean {
  if (polygon.length !== 4) {
    return false;
  }

  const uniqueX = new Set(polygon.map((point) => point.xInMapUnits));
  const uniqueY = new Set(polygon.map((point) => point.yInMapUnits));
  return uniqueX.size === 2 && uniqueY.size === 2;
}

function createPathPreviewSignature(
  previews: NonNullable<
    ReturnType<typeof createM7TopologyReadModelFixture>["map"]["topology"]
  >["pathPreviews"]
): readonly {
  readonly originDistrictId: number;
  readonly destinationDistrictId: number;
  readonly status: string;
  readonly edgeSequence: readonly number[];
  readonly reasonCodes: readonly string[];
}[] {
  return previews.map((preview) => ({
    originDistrictId: Number(preview.originDistrictId),
    destinationDistrictId: Number(preview.destinationDistrictId),
    status: preview.status,
    edgeSequence: preview.edgeSequence.map((edge) => edge.routeId),
    reasonCodes: preview.reasonCodes
  }));
}

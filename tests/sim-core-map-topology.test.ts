import { describe, expect, test } from "vitest";

import type { GameQueryV1 } from "../packages/protocol/src/index";
import {
  createMapTopologyDefinitionV1,
  createStrategicTerrainDefinitionV1,
  createWorldStateV0,
  defineDistrict,
  defineRoute,
  hashMapTopologyDefinitionV1,
  hashStrategicTerrainDefinitionV1,
  hashWorldStateV0,
  parseMapTopologyHash,
  parseStrategicTerrainHash,
  querySimulationV1,
  validateWorldStateV0,
  type MapTopologyDefinitionV1,
  type MapTopologyRouteAvailabilityV1,
  type SimulationRuntimeV1,
  type StrategicTerrainDefinitionV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

const CONTENT_HASH = "m7topo1";
const STRATEGIC_CONTENT_HASH = "a7b10001";
type TopologyGeometryVariant = "base" | "perturbed";
type TopologyFixtureDistrictId = 1 | 2 | 3 | 4 | 5 | 6;

interface TopologyFixturePoint {
  readonly x: number;
  readonly y: number;
}

interface TopologyFixtureGeometry {
  readonly anchor: TopologyFixturePoint;
  readonly polygon: readonly TopologyFixturePoint[];
}

const BASE_TOPOLOGY_GEOMETRY: Readonly<Record<TopologyFixtureDistrictId, TopologyFixtureGeometry>> =
  {
    1: {
      anchor: { x: 12, y: 18 },
      polygon: [
        { x: 5, y: 11 },
        { x: 18, y: 9 },
        { x: 24, y: 17 },
        { x: 16, y: 29 },
        { x: 7, y: 25 }
      ]
    },
    2: {
      anchor: { x: 53, y: 31 },
      polygon: [
        { x: 42, y: 21 },
        { x: 59, y: 18 },
        { x: 68, y: 33 },
        { x: 55, y: 44 },
        { x: 39, y: 38 }
      ]
    },
    3: {
      anchor: { x: 29, y: 67 },
      polygon: [
        { x: 17, y: 56 },
        { x: 34, y: 51 },
        { x: 44, y: 65 },
        { x: 32, y: 79 },
        { x: 19, y: 74 }
      ]
    },
    4: {
      anchor: { x: 82, y: 73 },
      polygon: [
        { x: 70, y: 60 },
        { x: 89, y: 58 },
        { x: 99, y: 75 },
        { x: 85, y: 90 },
        { x: 68, y: 84 }
      ]
    },
    5: {
      anchor: { x: 128, y: 24 },
      polygon: [
        { x: 116, y: 13 },
        { x: 134, y: 10 },
        { x: 146, y: 24 },
        { x: 136, y: 39 },
        { x: 119, y: 36 }
      ]
    },
    6: {
      anchor: { x: 23, y: 22 },
      polygon: [
        { x: 21, y: 15 },
        { x: 31, y: 17 },
        { x: 33, y: 27 },
        { x: 24, y: 34 },
        { x: 18, y: 27 }
      ]
    }
  };

describe("M7-MAP-TOPOLOGY-SCHEMA-001 authoritative topology schema", () => {
  test("computes a stable topology hash independent of input order", () => {
    const first = createTopologyWorld();
    const second = createTopologyWorld({
      reverseTopologyInputOrder: true
    });

    expect(first.definitions.topology?.topologyHash).toBe(
      second.definitions.topology?.topologyHash
    );
    expect(hashWorldStateV0(first)).toBe(hashWorldStateV0(second));
    expect(validateWorldStateV0(first)).toEqual([]);
  });

  test("returns deterministic topology read models and path tie-break evidence through queries", () => {
    const runtime = createTopologyRuntime();
    const hashBefore = runtime.world.meta.stateHash;

    const topology = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-map-topology",
      payload: { queryId: "m7.topology.list" }
    });

    expect(topology.status).toBe("ok");
    if (topology.status !== "ok" || topology.result.kind !== "sim.list-map-topology") {
      throw new Error("Expected topology read model query to succeed.");
    }
    expect(topology.result.topology.topologyHash).toBe(
      runtime.world.definitions.topology?.topologyHash
    );
    expect(topology.result.topology.districts).toHaveLength(6);
    expect(topology.result.topology.routeEdges.map((edge) => edge.routeId)).toEqual([
      10, 11, 20, 21, 40
    ]);

    const preview = previewTopologyPath(runtime, 1, 4, 40);

    expect(preview.status).toBe("ok");
    if (preview.status !== "ok" || preview.result.kind !== "sim.preview-map-topology-path") {
      throw new Error("Expected topology path preview to succeed.");
    }
    expect(preview.result.route.status).toBe("reachable");
    if (preview.result.route.status !== "reachable") {
      throw new Error("Expected reachable topology route.");
    }
    expect(preview.result.route.totalCost).toBe(10);
    expect(preview.result.route.edges.map((edge) => edge.routeId)).toEqual([10, 11]);
    expect(preview.result.route.tieBreakEvidence).toEqual({
      orderedBy: [
        "total-cost",
        "edge-count",
        "route-id-sequence",
        "endpoint-id-sequence",
        "district-id"
      ],
      candidateCount: 6,
      selectedRouteIds: [10, 11],
      selectedEndpointKeys: ["district.1>district.3", "district.3>district.4"]
    });
    expect(runtime.world.meta.stateHash).toBe(hashBefore);
  });

  test("exposes capacity, blocked, and no-known-route reason codes without grid fallback", () => {
    const runtime = createTopologyRuntime();
    const overCapacity = previewTopologyPath(runtime, 1, 4, 120);
    const blocked = previewTopologyPath(runtime, 1, 5, 40);
    const isolated = previewTopologyPath(runtime, 1, 6, 40);

    expect(overCapacity.status).toBe("ok");
    if (
      overCapacity.status !== "ok" ||
      overCapacity.result.kind !== "sim.preview-map-topology-path"
    ) {
      throw new Error("Expected capacity preview result.");
    }
    expect(overCapacity.result.route.status).toBe("capacity-exceeded");
    if (overCapacity.result.route.status !== "capacity-exceeded") {
      throw new Error("Expected capacity-exceeded topology route.");
    }
    expect(overCapacity.result.route.bottleneckCapacity).toBe(100);
    expect(overCapacity.result.route.reasonCodes).toEqual(["topology.path.capacity-exceeded"]);

    expect(blocked.status).toBe("ok");
    if (blocked.status !== "ok" || blocked.result.kind !== "sim.preview-map-topology-path") {
      throw new Error("Expected blocked preview result.");
    }
    expect(blocked.result.route.status).toBe("blocked");
    expect(blocked.result.route.reasonCodes).toEqual([
      "topology.path.blocked",
      "topology.blocked.monastery-pass"
    ]);

    expect(isolated.status).toBe("ok");
    if (isolated.status !== "ok" || isolated.result.kind !== "sim.preview-map-topology-path") {
      throw new Error("Expected isolated preview result.");
    }
    expect(isolated.result.route.status).toBe("no-known-route");
    expect(isolated.result.route.reasonCodes).toEqual(["topology.path.no-known-route"]);
  });

  test("does not infer reachability from visual adjacency or polygon geometry", () => {
    const runtime = createTopologyRuntime();
    const topology = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-map-topology",
      payload: { queryId: "m7.topology.anti-grid-list" }
    });

    expect(topology.status).toBe("ok");
    if (topology.status !== "ok" || topology.result.kind !== "sim.list-map-topology") {
      throw new Error("Expected topology read model query to succeed.");
    }

    const district1 = findTopologyDistrict(topology.result.topology.districts, 1);
    const district6 = findTopologyDistrict(topology.result.topology.districts, 6);
    expect(squaredDistance(district1.anchor, district6.anchor)).toBeLessThan(200);

    const visualNeighborWithoutRoute = previewTopologyPath(runtime, 1, 6, 40);
    expect(visualNeighborWithoutRoute.status).toBe("ok");
    if (
      visualNeighborWithoutRoute.status !== "ok" ||
      visualNeighborWithoutRoute.result.kind !== "sim.preview-map-topology-path"
    ) {
      throw new Error("Expected visual-neighbor preview result.");
    }
    expect(visualNeighborWithoutRoute.result.route.status).toBe("no-known-route");
    expect(visualNeighborWithoutRoute.result.route.reasonCodes).toEqual([
      "topology.path.no-known-route"
    ]);

    const district5 = findTopologyDistrict(topology.result.topology.districts, 5);
    expect(squaredDistance(district1.anchor, district5.anchor)).toBeGreaterThan(10_000);

    const distantBlockedRoute = previewTopologyPath(runtime, 1, 5, 40);
    expect(distantBlockedRoute.status).toBe("ok");
    if (
      distantBlockedRoute.status !== "ok" ||
      distantBlockedRoute.result.kind !== "sim.preview-map-topology-path"
    ) {
      throw new Error("Expected visually distant blocked route preview result.");
    }
    expect(distantBlockedRoute.result.route.status).toBe("blocked");
    expect(distantBlockedRoute.result.route.edges.map((edge) => edge.routeId)).toEqual([40]);

    const perturbedRuntime = createTopologyRuntime({ geometryVariant: "perturbed" });
    const baseRoute = previewTopologyPath(runtime, 1, 4, 40);
    const perturbedRoute = previewTopologyPath(perturbedRuntime, 1, 4, 40);
    expect(baseRoute.status).toBe("ok");
    expect(perturbedRoute.status).toBe("ok");
    if (
      baseRoute.status !== "ok" ||
      perturbedRoute.status !== "ok" ||
      baseRoute.result.kind !== "sim.preview-map-topology-path" ||
      perturbedRoute.result.kind !== "sim.preview-map-topology-path" ||
      baseRoute.result.route.status !== "reachable" ||
      perturbedRoute.result.route.status !== "reachable"
    ) {
      throw new Error("Expected reachable topology routes before and after geometry perturbation.");
    }

    expect(perturbedRoute.result.route.edges.map((edge) => edge.routeId)).toEqual(
      baseRoute.result.route.edges.map((edge) => edge.routeId)
    );
    expect(perturbedRoute.result.route.totalCost).toBe(baseRoute.result.route.totalCost);
  });

  test("rejects malformed topology definitions with path-specific invariant errors", () => {
    const definitions = createBaseDefinitions({
      topology: createMapTopologyDefinitionV1({
        contentManifestHash: CONTENT_HASH,
        districts: [topologyDistrictInput(1)],
        routeEdges: []
      })
    });
    const missingDistrictWorld = createWorldStateV0({
      seed: 1531,
      contentManifestHash: CONTENT_HASH,
      currentDay: 0,
      revision: 0,
      definitions
    });

    expect(validateWorldStateV0(missingDistrictWorld)).toContainEqual({
      code: "bad-reference",
      path: "definitions.topology.districts",
      message: "Map topology is missing polygon definition for DistrictId 2."
    });

    const valid = createTopologyWorld();
    const staleTopology = valid.definitions.topology;
    if (staleTopology === undefined) {
      throw new Error("Expected topology.");
    }
    const staleWorld = createWorldStateV0({
      seed: 1531,
      contentManifestHash: CONTENT_HASH,
      currentDay: 0,
      revision: 0,
      definitions: {
        ...valid.definitions,
        topology: {
          ...staleTopology,
          topologyHash: parseMapTopologyHash("00000000")
        }
      }
    });

    expect(validateWorldStateV0(staleWorld)).toContainEqual({
      code: "invalid-schema",
      path: "definitions.topology.topologyHash",
      message: `MapTopologyDefinition topologyHash 00000000 does not match canonical hash ${hashMapTopologyDefinitionV1(staleTopology)}.`
    });

    const mismatchedContentWorld = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "different",
      currentDay: 0,
      revision: 0,
      definitions: valid.definitions
    });

    expect(validateWorldStateV0(mismatchedContentWorld)).toContainEqual({
      code: "invalid-schema",
      path: "definitions.topology.contentManifestHash",
      message: "Map topology contentManifestHash must match WorldState meta.contentManifestHash."
    });
  });

  test("rejects topology queries when the authoritative topology definition is absent", () => {
    const runtime: SimulationRuntimeV1 = {
      world: createWorldStateV0({
        seed: 1531,
        contentManifestHash: "legacy",
        currentDay: 0,
        revision: 0,
        definitions: createBaseDefinitions()
      }),
      acceptedCommandIds: [],
      commandTail: [],
      eventTail: []
    };

    const topology = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-map-topology",
      payload: { queryId: "m7.topology.missing" }
    });
    const preview = previewTopologyPath(runtime, 1, 4, 40);

    expect(topology).toEqual({
      status: "rejected",
      error: {
        code: "topology-state-missing",
        path: "definitions.topology",
        message: "sim.list-map-topology requires an authoritative map topology definition."
      }
    });
    expect(preview).toEqual({
      status: "rejected",
      error: {
        code: "topology-state-missing",
        path: "definitions.topology",
        message: "sim.preview-map-topology-path requires an authoritative map topology definition."
      }
    });
  });
});

describe("M7-STRATEGIC-TERRAIN-SCHEMA-001 terrain-route-node authority", () => {
  test("computes a stable strategic terrain hash independent of input order", () => {
    const first = createStrategicTerrainWorld();
    const second = createStrategicTerrainWorld({ reverseStrategicTerrainInputOrder: true });

    expect(first.definitions.strategicTerrain?.strategicTerrainHash).toBe(
      second.definitions.strategicTerrain?.strategicTerrainHash
    );
    expect(hashWorldStateV0(first)).toBe(hashWorldStateV0(second));
    expect(validateWorldStateV0(first)).toEqual([]);
  });

  test("lists terrain-route-node authority and deterministic hit-test priority", () => {
    const runtime = createStrategicTerrainRuntime();
    const hashBefore = runtime.world.meta.stateHash;

    const listed = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-strategic-terrain",
      payload: { queryId: "m7.strategic-terrain.list" }
    });

    expect(listed.status).toBe("ok");
    if (listed.status !== "ok" || listed.result.kind !== "sim.list-strategic-terrain") {
      throw new Error("Expected strategic terrain read model query to succeed.");
    }
    expect(listed.result.terrain).toMatchObject({
      authority: "terrain-route-node-v1",
      governanceFootprintRole: "overlay-only",
      terrainPatches: expect.any(Array),
      barrierChannels: expect.any(Array),
      strategicNodes: expect.any(Array),
      routeCorridors: expect.any(Array),
      districtGovernanceFootprints: expect.any(Array)
    });
    expect(listed.result.terrain.authorityProhibitions).toEqual([
      "bounding-box-adjacency",
      "centroid-proximity",
      "hex-axial-or-cube",
      "hidden-grid",
      "hidden-lattice",
      "renderer-only-line-reachability",
      "sequential-id-reachability"
    ]);

    const blockerHit = hitStrategicTerrain(runtime, { x: 12, y: 12 });
    expect(blockerHit.status).toBe("ok");
    if (blockerHit.status !== "ok" || blockerHit.result.kind !== "sim.hit-test-strategic-terrain") {
      throw new Error("Expected strategic terrain blocker hit query.");
    }
    expect(blockerHit.result.hit.priorityIntent).toEqual([
      "route-blocker",
      "strategic-node",
      "route-corridor",
      "barrier-channel",
      "terrain-patch",
      "district-governance-footprint"
    ]);
    expect(blockerHit.result.hit.selected).toMatchObject({
      kind: "route-corridor",
      id: "corridor.blocked-pass",
      priority: 10
    });

    const nodeHit = hitStrategicTerrain(runtime, { x: 20, y: 10 });
    expect(nodeHit.status).toBe("ok");
    if (nodeHit.status !== "ok" || nodeHit.result.kind !== "sim.hit-test-strategic-terrain") {
      throw new Error("Expected strategic terrain node hit query.");
    }
    expect(nodeHit.result.hit.selected).toMatchObject({
      kind: "strategic-node",
      id: "node.bridge-town",
      priority: 20
    });

    const terrainHit = hitStrategicTerrain(runtime, { x: 2, y: 18 });
    expect(terrainHit.status).toBe("ok");
    if (terrainHit.status !== "ok" || terrainHit.result.kind !== "sim.hit-test-strategic-terrain") {
      throw new Error("Expected strategic terrain patch hit query.");
    }
    expect(terrainHit.result.hit.candidates.map((candidate) => candidate.kind)).toEqual([
      "terrain-patch",
      "district-governance-footprint"
    ]);
    expect(terrainHit.result.hit.selected).toMatchObject({
      kind: "terrain-patch",
      id: "patch.delta-lowland",
      priority: 50
    });
    expect(runtime.world.meta.stateHash).toBe(hashBefore);
  });

  test("previews path reasons, blockers, unknown state, capacity, and stable tie-breaks", () => {
    const runtime = createStrategicTerrainRuntime();

    const reachable = previewStrategicTerrainRoute(
      runtime,
      "node.river-port",
      "node.upland-fort",
      40
    );
    expect(reachable.status).toBe("ok");
    if (
      reachable.status !== "ok" ||
      reachable.result.kind !== "sim.preview-strategic-terrain-route" ||
      reachable.result.route.status !== "reachable"
    ) {
      throw new Error("Expected reachable strategic terrain route.");
    }
    expect(reachable.result.route.totalCost).toBe(10);
    expect(reachable.result.route.bottleneckCapacity).toBe(60);
    expect(reachable.result.route.bottleneckCorridorId).toBe("corridor.bridge-fort");
    expect(reachable.result.route.corridors.map((corridor) => corridor.corridorId)).toEqual([
      "corridor.bridge-road",
      "corridor.bridge-fort"
    ]);
    expect(reachable.result.route.tieBreakEvidence).toEqual({
      orderedBy: [
        "total-cost",
        "corridor-count",
        "corridor-id-sequence",
        "endpoint-node-id-sequence",
        "destination-node-id"
      ],
      candidateCount: 6,
      selectedCorridorIds: ["corridor.bridge-road", "corridor.bridge-fort"],
      selectedEndpointKeys: [
        "node.river-port>node.bridge-town",
        "node.bridge-town>node.upland-fort"
      ]
    });
    expect(reachable.result.route.routeExplanation).toMatchObject({
      estimatedTravelCost: 10,
      bottleneckCapacity: 60,
      terrainReasonCodes: ["strategic-terrain.terrain.patch.delta-lowland"],
      riskReasonCodes: ["strategic-terrain.risk.low"],
      governanceConsequenceCodes: [
        "strategic-terrain.governance-consequence.footprint.capital",
        "strategic-terrain.governance-consequence.footprint.upland"
      ]
    });
    expect(reachable.result.route.aiReasons.corridorIds).toEqual([
      "corridor.bridge-road",
      "corridor.bridge-fort"
    ]);

    const overCapacity = previewStrategicTerrainRoute(
      runtime,
      "node.river-port",
      "node.upland-fort",
      90
    );
    expect(overCapacity.status).toBe("ok");
    if (
      overCapacity.status !== "ok" ||
      overCapacity.result.kind !== "sim.preview-strategic-terrain-route"
    ) {
      throw new Error("Expected strategic terrain capacity route.");
    }
    expect(overCapacity.result.route.status).toBe("capacity-exceeded");
    expect(overCapacity.result.route.routeExplanation.capacityReasonCodes).toEqual([
      "strategic-terrain.capacity.exceeded"
    ]);

    const blocked = previewStrategicTerrainRoute(
      runtime,
      "node.river-port",
      "node.monsoon-pass",
      40
    );
    expect(blocked.status).toBe("ok");
    if (blocked.status !== "ok" || blocked.result.kind !== "sim.preview-strategic-terrain-route") {
      throw new Error("Expected strategic terrain blocked route.");
    }
    expect(blocked.result.route.status).toBe("blocked");
    expect(blocked.result.route.routeExplanation.blockerReasonCodes).toEqual([
      "strategic-terrain.blocker.pass-washed-out"
    ]);

    const unknown = previewStrategicTerrainRoute(
      runtime,
      "node.river-port",
      "node.unscouted-warehouse",
      40
    );
    expect(unknown.status).toBe("ok");
    if (unknown.status !== "ok" || unknown.result.kind !== "sim.preview-strategic-terrain-route") {
      throw new Error("Expected strategic terrain unknown route.");
    }
    expect(unknown.result.route.status).toBe("unknown");
    expect(unknown.result.route.routeExplanation.unknownReasonCodes).toEqual([
      "strategic-terrain.unknown.scout-required"
    ]);
  });

  test("does not infer reachability from governance adjacency, centroids, hidden ids, or visual lines", () => {
    const runtime = createStrategicTerrainRuntime();
    const nearGovernanceNode = previewStrategicTerrainRoute(
      runtime,
      "node.river-port",
      "node.governance-neighbor",
      10
    );

    expect(nearGovernanceNode.status).toBe("ok");
    if (
      nearGovernanceNode.status !== "ok" ||
      nearGovernanceNode.result.kind !== "sim.preview-strategic-terrain-route"
    ) {
      throw new Error("Expected strategic terrain no-known-route preview.");
    }
    expect(nearGovernanceNode.result.route.status).toBe("no-known-route");
    expect(nearGovernanceNode.result.route.corridors).toEqual([]);
    expect(nearGovernanceNode.result.route.reasonCodes).toEqual([
      "strategic-terrain.path.no-known-route"
    ]);

    const listed = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-strategic-terrain",
      payload: { queryId: "m7.strategic-terrain.negative-list" }
    });
    expect(listed.status).toBe("ok");
    if (listed.status !== "ok" || listed.result.kind !== "sim.list-strategic-terrain") {
      throw new Error("Expected strategic terrain list query.");
    }
    const origin = findStrategicNode(listed.result.terrain.strategicNodes, "node.river-port");
    const neighbor = findStrategicNode(
      listed.result.terrain.strategicNodes,
      "node.governance-neighbor"
    );
    expect(squaredDistance(origin.anchor, neighbor.anchor)).toBeLessThan(300);
    expect(
      listed.result.terrain.barrierChannels.some(
        (channel) => channel.channelId === "channel.renderer-only-looking-line"
      )
    ).toBe(true);

    expect(() =>
      createStrategicTerrainDefinitionV1({
        ...strategicTerrainInput(),
        strategicNodes: [
          {
            ...strategicTerrainNodeInput("node.river-port", 1, { x: 10, y: 10 }, "port"),
            nodeId: "row1"
          }
        ]
      })
    ).toThrow("hidden grid, lattice, hex, or sequential id");
    expect(() =>
      createStrategicTerrainDefinitionV1({
        ...strategicTerrainInput(),
        routeCorridors: [
          {
            ...strategicTerrainRouteCorridorInput(
              "corridor.bridge-road",
              "node.river-port",
              "node.bridge-town",
              5,
              100,
              { kind: "open" }
            ),
            corridorId: "hex1"
          }
        ]
      })
    ).toThrow("hidden grid, lattice, hex, or sequential id");
  });

  test("rejects stale strategic terrain hashes without falling back to topology or polygons", () => {
    const valid = createStrategicTerrainWorld();
    const strategicTerrain = valid.definitions.strategicTerrain;
    if (strategicTerrain === undefined) {
      throw new Error("Expected strategic terrain.");
    }

    const staleWorld = createWorldStateV0({
      seed: 1531,
      contentManifestHash: STRATEGIC_CONTENT_HASH,
      currentDay: 0,
      revision: 0,
      definitions: {
        ...valid.definitions,
        strategicTerrain: {
          ...strategicTerrain,
          strategicTerrainHash: parseStrategicTerrainHash("00000000")
        }
      }
    });

    expect(validateWorldStateV0(staleWorld)).toContainEqual({
      code: "invalid-schema",
      path: "definitions.strategicTerrain.strategicTerrainHash",
      message: `StrategicTerrainDefinition strategicTerrainHash 00000000 does not match canonical hash ${hashStrategicTerrainDefinitionV1(
        strategicTerrain
      )}.`
    });

    const missingRuntime: SimulationRuntimeV1 = {
      world: createWorldStateV0({
        seed: 1531,
        contentManifestHash: "legacy",
        currentDay: 0,
        revision: 0,
        definitions: createBaseDefinitions()
      }),
      acceptedCommandIds: [],
      commandTail: [],
      eventTail: []
    };

    expect(
      querySimulationV1(missingRuntime, {
        schemaVersion: 1,
        kind: "sim.list-strategic-terrain",
        payload: { queryId: "m7.strategic-terrain.missing" }
      })
    ).toEqual({
      status: "rejected",
      error: {
        code: "strategic-terrain-state-missing",
        path: "definitions.strategicTerrain",
        message:
          "sim.list-strategic-terrain requires an authoritative strategic terrain definition."
      }
    });
    expect(
      previewStrategicTerrainRoute(missingRuntime, "node.river-port", "node.upland-fort", 40)
    ).toEqual({
      status: "rejected",
      error: {
        code: "strategic-terrain-state-missing",
        path: "definitions.strategicTerrain",
        message:
          "sim.preview-strategic-terrain-route requires an authoritative strategic terrain definition."
      }
    });
  });
});

function createTopologyRuntime(
  input: { readonly geometryVariant?: TopologyGeometryVariant } = {}
): SimulationRuntimeV1 {
  return {
    world: createTopologyWorld(input),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createStrategicTerrainRuntime(): SimulationRuntimeV1 {
  return {
    world: createStrategicTerrainWorld(),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createStrategicTerrainWorld(
  input: { readonly reverseStrategicTerrainInputOrder?: boolean } = {}
): WorldStateV0 {
  const strategicTerrain = createStrategicTerrainDefinition(input);
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: STRATEGIC_CONTENT_HASH,
    currentDay: 0,
    revision: 0,
    definitions: createBaseDefinitions({ strategicTerrain })
  });
}

function createTopologyWorld(
  input: {
    readonly geometryVariant?: TopologyGeometryVariant;
    readonly reverseTopologyInputOrder?: boolean;
  } = {}
): WorldStateV0 {
  const topology = createTopologyDefinition(input);
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: CONTENT_HASH,
    currentDay: 0,
    revision: 0,
    definitions: createBaseDefinitions({ topology })
  });
}

function createBaseDefinitions(
  input: {
    readonly topology?: MapTopologyDefinitionV1;
    readonly strategicTerrain?: StrategicTerrainDefinitionV1;
  } = {}
): WorldDefinitionsV0 {
  return {
    polities: [],
    persons: [],
    districts: [1, 2, 3, 4, 5, 6].map((id) =>
      defineDistrict({ id, displayNameKey: `district.m7.topology.${id}` })
    ),
    settlements: [],
    routes: [
      defineRoute({ id: 10, fromDistrictId: 1, toDistrictId: 3, lengthInMapUnits: 5 }),
      defineRoute({ id: 11, fromDistrictId: 3, toDistrictId: 4, lengthInMapUnits: 5 }),
      defineRoute({ id: 20, fromDistrictId: 1, toDistrictId: 2, lengthInMapUnits: 5 }),
      defineRoute({ id: 21, fromDistrictId: 2, toDistrictId: 4, lengthInMapUnits: 5 }),
      defineRoute({ id: 40, fromDistrictId: 1, toDistrictId: 5, lengthInMapUnits: 3 })
    ],
    ...(input.topology === undefined ? {} : { topology: input.topology }),
    ...(input.strategicTerrain === undefined ? {} : { strategicTerrain: input.strategicTerrain })
  };
}

function createTopologyDefinition(input: {
  readonly geometryVariant?: TopologyGeometryVariant;
  readonly reverseTopologyInputOrder?: boolean;
}): MapTopologyDefinitionV1 {
  const districts = [1, 2, 3, 4, 5, 6].map((districtId) =>
    topologyDistrictInput(districtId, input.geometryVariant ?? "base")
  );
  const routeEdges = [
    topologyRouteEdgeInput(10, 1, 3, 5, { kind: "open" }),
    topologyRouteEdgeInput(11, 3, 4, 5, { kind: "open" }),
    topologyRouteEdgeInput(20, 1, 2, 5, { kind: "open" }),
    topologyRouteEdgeInput(21, 2, 4, 5, { kind: "open" }),
    topologyRouteEdgeInput(40, 1, 5, 3, {
      kind: "blocked",
      reasonCode: "topology.blocked.monastery-pass"
    })
  ];

  return createMapTopologyDefinitionV1({
    contentManifestHash: CONTENT_HASH,
    districts: input.reverseTopologyInputOrder === true ? [...districts].reverse() : districts,
    routeEdges: input.reverseTopologyInputOrder === true ? [...routeEdges].reverse() : routeEdges
  });
}

function createStrategicTerrainDefinition(input: {
  readonly reverseStrategicTerrainInputOrder?: boolean;
}): StrategicTerrainDefinitionV1 {
  const base = strategicTerrainInput();
  return createStrategicTerrainDefinitionV1({
    ...base,
    terrainPatches:
      input.reverseStrategicTerrainInputOrder === true
        ? [...base.terrainPatches].reverse()
        : base.terrainPatches,
    barrierChannels:
      input.reverseStrategicTerrainInputOrder === true
        ? [...base.barrierChannels].reverse()
        : base.barrierChannels,
    strategicNodes:
      input.reverseStrategicTerrainInputOrder === true
        ? [...base.strategicNodes].reverse()
        : base.strategicNodes,
    routeCorridors:
      input.reverseStrategicTerrainInputOrder === true
        ? [...base.routeCorridors].reverse()
        : base.routeCorridors,
    districtGovernanceFootprints:
      input.reverseStrategicTerrainInputOrder === true
        ? [...base.districtGovernanceFootprints].reverse()
        : base.districtGovernanceFootprints
  });
}

function strategicTerrainInput(): Parameters<typeof createStrategicTerrainDefinitionV1>[0] {
  return {
    contentManifestHash: STRATEGIC_CONTENT_HASH,
    terrainPatches: [
      {
        patchId: "patch.delta-lowland",
        sourceId: "m7.strategic.patch.delta-lowland",
        displayNameKey: "terrain.delta_lowland",
        terrainClass: "lowland",
        seasonSensitivity: "monsoon",
        historicity: "COMPOSITE",
        polygon: [
          { x: 0, y: 0 },
          { x: 45, y: 0 },
          { x: 45, y: 45 },
          { x: 0, y: 45 }
        ],
        explanationTags: ["terrain.lowland", "terrain.monsoon-sensitive"]
      },
      {
        patchId: "patch.upland-ridge",
        sourceId: "m7.strategic.patch.upland-ridge",
        displayNameKey: "terrain.upland_ridge",
        terrainClass: "upland",
        seasonSensitivity: "dry",
        historicity: "COMPOSITE",
        polygon: [
          { x: 45, y: 0 },
          { x: 80, y: 0 },
          { x: 80, y: 45 },
          { x: 45, y: 45 }
        ],
        explanationTags: ["terrain.upland"]
      }
    ],
    barrierChannels: [
      {
        channelId: "channel.ridge-line",
        sourceId: "m7.strategic.channel.ridge-line",
        displayNameKey: "barrier.ridge_line",
        channelKind: "ridge",
        traversalRule: "blocks-without-explicit-corridor",
        historicity: "COMPOSITE",
        points: [
          { x: 45, y: 0 },
          { x: 45, y: 45 }
        ],
        explanationTags: ["barrier.ridge"]
      },
      {
        channelId: "channel.renderer-only-looking-line",
        sourceId: "m7.strategic.channel.renderer-line",
        displayNameKey: "barrier.renderer_line",
        channelKind: "major-river",
        traversalRule: "channels-explicit-corridors",
        historicity: "COMPOSITE",
        points: [
          { x: 10, y: 10 },
          { x: 24, y: 16 }
        ],
        explanationTags: ["barrier.visual-line-no-reachability"]
      }
    ],
    strategicNodes: [
      strategicTerrainNodeInput("node.river-port", 1, { x: 10, y: 10 }, "port"),
      strategicTerrainNodeInput("node.bridge-town", 2, { x: 20, y: 10 }, "town"),
      strategicTerrainNodeInput("node.coastal-fork", 3, { x: 20, y: 20 }, "staging-area"),
      strategicTerrainNodeInput("node.upland-fort", 4, { x: 50, y: 10 }, "castle"),
      strategicTerrainNodeInput("node.monsoon-pass", 5, { x: 12, y: 12 }, "pass"),
      strategicTerrainNodeInput("node.unscouted-warehouse", 6, { x: 35, y: 35 }, "warehouse"),
      strategicTerrainNodeInput("node.governance-neighbor", 6, { x: 24, y: 16 }, "crossing")
    ],
    routeCorridors: [
      strategicTerrainRouteCorridorInput(
        "corridor.bridge-road",
        "node.river-port",
        "node.bridge-town",
        5,
        100,
        { kind: "open" }
      ),
      strategicTerrainRouteCorridorInput(
        "corridor.bridge-fort",
        "node.bridge-town",
        "node.upland-fort",
        5,
        60,
        { kind: "open" }
      ),
      strategicTerrainRouteCorridorInput(
        "corridor.coastal-fork",
        "node.river-port",
        "node.coastal-fork",
        5,
        100,
        { kind: "open" }
      ),
      strategicTerrainRouteCorridorInput(
        "corridor.fork-fort",
        "node.coastal-fork",
        "node.upland-fort",
        5,
        100,
        { kind: "open" }
      ),
      strategicTerrainRouteCorridorInput(
        "corridor.blocked-pass",
        "node.river-port",
        "node.monsoon-pass",
        3,
        40,
        { kind: "blocked", reasonCode: "strategic-terrain.blocker.pass-washed-out" }
      ),
      strategicTerrainRouteCorridorInput(
        "corridor.unknown-warehouse",
        "node.river-port",
        "node.unscouted-warehouse",
        4,
        50,
        { kind: "unknown", reasonCode: "strategic-terrain.unknown.scout-required" }
      )
    ],
    districtGovernanceFootprints: [
      {
        footprintId: "footprint.capital",
        sourceId: "m7.strategic.footprint.capital",
        displayNameKey: "governance.capital",
        districtId: 1,
        overlayOnly: true,
        polygon: [
          { x: 0, y: 0 },
          { x: 23, y: 0 },
          { x: 23, y: 24 },
          { x: 0, y: 24 }
        ],
        governanceTags: ["governance.control"],
        consequenceTags: ["governance.obligation"]
      },
      {
        footprintId: "footprint.upland",
        sourceId: "m7.strategic.footprint.upland",
        displayNameKey: "governance.upland",
        districtId: 4,
        overlayOnly: true,
        polygon: [
          { x: 23, y: 0 },
          { x: 60, y: 0 },
          { x: 60, y: 24 },
          { x: 23, y: 24 }
        ],
        governanceTags: ["governance.appointment"],
        consequenceTags: ["governance.postwar"]
      }
    ]
  };
}

function strategicTerrainNodeInput(
  nodeId: string,
  districtId: number,
  anchor: TopologyFixturePoint,
  nodeKind: "castle" | "crossing" | "pass" | "port" | "staging-area" | "town" | "warehouse"
): Parameters<typeof createStrategicTerrainDefinitionV1>[0]["strategicNodes"][number] {
  return {
    nodeId,
    sourceId: `m7.strategic.${nodeId}`,
    displayNameKey: `strategic.${nodeId}`,
    nodeKind,
    districtId,
    anchor,
    localCapacity: 100,
    knownState: nodeId === "node.unscouted-warehouse" ? "unknown" : "known",
    terrainPatchIds: [districtId === 4 ? "patch.upland-ridge" : "patch.delta-lowland"],
    barrierChannelIds: districtId === 4 ? ["channel.ridge-line"] : [],
    governanceFootprintIds: districtId === 4 ? ["footprint.upland"] : ["footprint.capital"],
    explanationTags: [`strategic.${nodeKind}`]
  };
}

function strategicTerrainRouteCorridorInput(
  corridorId: string,
  fromNodeId: string,
  toNodeId: string,
  baseTravelCost: number,
  baseCapacity: number,
  availability:
    | { readonly kind: "open" }
    | { readonly kind: "blocked" | "unknown"; readonly reasonCode: string }
): Parameters<typeof createStrategicTerrainDefinitionV1>[0]["routeCorridors"][number] {
  const from = strategicTerrainNodeAnchor(fromNodeId);
  const to = strategicTerrainNodeAnchor(toNodeId);
  return {
    corridorId,
    sourceId: `m7.strategic.${corridorId}`,
    displayNameKey: `strategic.${corridorId}`,
    fromNodeId,
    toNodeId,
    mode: corridorId.includes("blocked-pass") ? "pass" : "road",
    widthClass: baseCapacity >= 100 ? "wide" : "narrow",
    baseTravelCost,
    baseCapacity,
    riskClass: availability.kind === "open" ? "low" : "seasonal",
    terrainPatchIds: ["patch.delta-lowland"],
    barrierChannelIds: corridorId.includes("fort") ? ["channel.ridge-line"] : [],
    governanceFootprintIds: corridorId.includes("fort")
      ? ["footprint.capital", "footprint.upland"]
      : ["footprint.capital"],
    seasonality: strategicTerrainSeasonality(),
    availability,
    polyline: [from, to],
    explanationTags: [`strategic.${corridorId}.explanation`]
  };
}

function strategicTerrainNodeAnchor(nodeId: string): TopologyFixturePoint {
  switch (nodeId) {
    case "node.river-port":
      return { x: 10, y: 10 };
    case "node.bridge-town":
      return { x: 20, y: 10 };
    case "node.coastal-fork":
      return { x: 20, y: 20 };
    case "node.upland-fort":
      return { x: 50, y: 10 };
    case "node.monsoon-pass":
      return { x: 12, y: 12 };
    case "node.unscouted-warehouse":
      return { x: 35, y: 35 };
    case "node.governance-neighbor":
      return { x: 24, y: 16 };
  }

  throw new Error(`Unknown strategic terrain node ${nodeId}.`);
}

function strategicTerrainSeasonality(): readonly {
  readonly month: number;
  readonly seasonState: "dry" | "monsoon" | "transition" | "unknown";
  readonly travelCostMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
}[] {
  return Array.from({ length: 12 }, (_unused, index) => ({
    month: index + 1,
    seasonState: index + 1 >= 5 && index + 1 <= 9 ? "monsoon" : "dry",
    travelCostMultiplierBps: 10_000,
    capacityMultiplierBps: 10_000,
    riskBps: index + 1 >= 5 && index + 1 <= 9 ? 500 : 100,
    reasonCodes: [`strategic-terrain.season.month-${index + 1}`]
  }));
}

function topologyDistrictInput(
  districtId: number,
  geometryVariant: TopologyGeometryVariant
): {
  readonly districtId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly anchor: { readonly x: number; readonly y: number };
  readonly polygon: readonly { readonly x: number; readonly y: number }[];
  readonly metadata: {
    readonly historicity: "COMPOSITE";
    readonly terrainClass: "lowland";
    readonly riskClass: "low";
  };
} {
  const geometry = geometryForDistrict(districtId, geometryVariant);
  return {
    districtId,
    sourceId: `m7.synthetic.district.${districtId}`,
    displayNameKey: `district.m7.topology.${districtId}`,
    anchor: geometry.anchor,
    polygon: geometry.polygon,
    metadata: {
      historicity: "COMPOSITE",
      terrainClass: "lowland",
      riskClass: "low"
    }
  };
}

function geometryForDistrict(
  districtId: number,
  geometryVariant: TopologyGeometryVariant
): TopologyFixtureGeometry {
  const base = BASE_TOPOLOGY_GEOMETRY[toTopologyFixtureDistrictId(districtId)];
  if (geometryVariant === "base") {
    return base;
  }

  return {
    anchor: perturbPoint(base.anchor, districtId),
    polygon: base.polygon.map((point, index) => perturbPoint(point, districtId + index + 1))
  };
}

function toTopologyFixtureDistrictId(districtId: number): TopologyFixtureDistrictId {
  switch (districtId) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return districtId;
  }

  throw new Error(`Unexpected topology fixture DistrictId ${districtId}.`);
}

function perturbPoint(point: TopologyFixturePoint, salt: number): TopologyFixturePoint {
  const xOffset = salt % 2 === 0 ? 3 : -2;
  const yOffset = salt % 3 === 0 ? -3 : 2;
  return {
    x: point.x + xOffset,
    y: point.y + yOffset
  };
}

function topologyRouteEdgeInput(
  routeId: number,
  fromDistrictId: number,
  toDistrictId: number,
  baseTravelCost: number,
  availability: MapTopologyRouteAvailabilityV1
): {
  readonly routeId: number;
  readonly sourceId: string;
  readonly from: { readonly kind: "district"; readonly districtId: number };
  readonly to: { readonly kind: "district"; readonly districtId: number };
  readonly mode: "road";
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly seasonality: readonly {
    readonly month: number;
    readonly costMultiplierBps: number;
    readonly capacityMultiplierBps: number;
    readonly reasonCodes: readonly string[];
  }[];
  readonly availability: MapTopologyRouteAvailabilityV1;
  readonly metadata: {
    readonly historicity: "COMPOSITE";
    readonly terrainClass: "lowland";
    readonly riskClass: "low";
  };
} {
  return {
    routeId,
    sourceId: `m7.synthetic.route.${routeId}`,
    from: { kind: "district", districtId: fromDistrictId },
    to: { kind: "district", districtId: toDistrictId },
    mode: "road",
    baseTravelCost,
    baseCapacity: 100,
    seasonality: neutralSeasonality(),
    availability,
    metadata: {
      historicity: "COMPOSITE",
      terrainClass: "lowland",
      riskClass: "low"
    }
  };
}

function neutralSeasonality(): readonly {
  readonly month: number;
  readonly costMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly reasonCodes: readonly string[];
}[] {
  return Array.from({ length: 12 }, (_unused, index) => ({
    month: index + 1,
    costMultiplierBps: 10_000,
    capacityMultiplierBps: 10_000,
    reasonCodes: [`topology.season.${index + 1}`]
  }));
}

function previewTopologyPath(
  runtime: SimulationRuntimeV1,
  originDistrictId: number,
  destinationDistrictId: number,
  stockAmount: number
): ReturnType<typeof querySimulationV1> {
  const query: GameQueryV1 = {
    schemaVersion: 1,
    kind: "sim.preview-map-topology-path",
    payload: {
      queryId: `m7.topology.preview.${originDistrictId}.${destinationDistrictId}.${stockAmount}`,
      originDistrictId,
      destinationDistrictId,
      stockAmount
    }
  };

  return querySimulationV1(runtime, query);
}

function hitStrategicTerrain(
  runtime: SimulationRuntimeV1,
  point: TopologyFixturePoint
): ReturnType<typeof querySimulationV1> {
  return querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.hit-test-strategic-terrain",
    payload: {
      queryId: `m7.strategic-terrain.hit.${point.x}.${point.y}`,
      point
    }
  });
}

function previewStrategicTerrainRoute(
  runtime: SimulationRuntimeV1,
  originNodeId: string,
  destinationNodeId: string,
  stockAmount: number
): ReturnType<typeof querySimulationV1> {
  return querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.preview-strategic-terrain-route",
    payload: {
      queryId: `m7.strategic-terrain.preview.${originNodeId}.${destinationNodeId}.${stockAmount}`,
      originNodeId,
      destinationNodeId,
      stockAmount
    }
  });
}

function findTopologyDistrict<
  T extends { readonly anchor: TopologyFixturePoint; readonly districtId: number }
>(districts: readonly T[], districtId: number): T {
  const district = districts.find((candidate) => candidate.districtId === districtId);
  if (district === undefined) {
    throw new Error(`Missing topology read model DistrictId ${districtId}.`);
  }

  return district;
}

function findStrategicNode<
  T extends { readonly anchor: TopologyFixturePoint; readonly nodeId: string }
>(nodes: readonly T[], nodeId: string): T {
  const node = nodes.find((candidate) => candidate.nodeId === nodeId);
  if (node === undefined) {
    throw new Error(`Missing strategic node ${nodeId}.`);
  }

  return node;
}

function squaredDistance(left: TopologyFixturePoint, right: TopologyFixturePoint): number {
  const xDelta = left.x - right.x;
  const yDelta = left.y - right.y;
  return xDelta * xDelta + yDelta * yDelta;
}

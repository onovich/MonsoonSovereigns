import { describe, expect, test } from "vitest";

import type { GameQueryV1 } from "../packages/protocol/src/index";
import {
  createMapTopologyDefinitionV1,
  createWorldStateV0,
  defineDistrict,
  defineRoute,
  hashMapTopologyDefinitionV1,
  hashWorldStateV0,
  parseMapTopologyHash,
  querySimulationV1,
  validateWorldStateV0,
  type MapTopologyDefinitionV1,
  type MapTopologyRouteAvailabilityV1,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

const CONTENT_HASH = "m7topo1";

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

function createTopologyRuntime(): SimulationRuntimeV1 {
  return {
    world: createTopologyWorld(),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createTopologyWorld(
  input: { readonly reverseTopologyInputOrder?: boolean } = {}
): WorldStateV0 {
  const topology = createTopologyDefinition(input.reverseTopologyInputOrder === true);
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
    ...(input.topology === undefined ? {} : { topology: input.topology })
  };
}

function createTopologyDefinition(reverseInputOrder: boolean): MapTopologyDefinitionV1 {
  const districts = [1, 2, 3, 4, 5, 6].map(topologyDistrictInput);
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
    districts: reverseInputOrder ? [...districts].reverse() : districts,
    routeEdges: reverseInputOrder ? [...routeEdges].reverse() : routeEdges
  });
}

function topologyDistrictInput(districtId: number): {
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
  const x = districtId * 10;
  return {
    districtId,
    sourceId: `m7.synthetic.district.${districtId}`,
    displayNameKey: `district.m7.topology.${districtId}`,
    anchor: { x, y: 10 },
    polygon: [
      { x: x - 2, y: 8 },
      { x: x + 2, y: 8 },
      { x, y: 12 }
    ],
    metadata: {
      historicity: "COMPOSITE",
      terrainClass: "lowland",
      riskClass: "low"
    }
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

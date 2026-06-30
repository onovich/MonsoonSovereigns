import { getGameCalendarDate } from "./scheduler-v0.ts";
import {
  formatMapTopologyEndpoint,
  tryMapTopologyEndpointDistrictId,
  type DistrictId,
  type GameDay,
  type MapTopologyDefinitionV1,
  type MapTopologyDistrictDefinitionV1,
  type MapTopologyHash,
  type MapTopologyPointV1,
  type MapTopologyRouteAvailabilityV1,
  type MapTopologyRouteEdgeDefinitionV1,
  type MapTopologyRouteEdgeMetadataV1,
  type MapTopologyRouteEndpointV1,
  type MapTopologyRouteModeV1,
  type MapTopologyRouteNodeDefinitionV1,
  type MapTopologySeasonalModifierV1,
  type RouteId,
  type WorldStateV0
} from "./world-state-v0.ts";

export interface MapTopologyReadModelV1 {
  readonly schemaVersion: 1;
  readonly topologyHash: MapTopologyHash;
  readonly contentManifestHash: string;
  readonly districts: readonly MapTopologyDistrictReadModelV1[];
  readonly routeNodes: readonly MapTopologyRouteNodeReadModelV1[];
  readonly routeEdges: readonly MapTopologyRouteEdgeReadModelV1[];
}

export interface MapTopologyDistrictReadModelV1 {
  readonly districtId: DistrictId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly anchor: MapTopologyPointV1;
  readonly polygon: readonly MapTopologyPointV1[];
  readonly metadata: MapTopologyDistrictDefinitionV1["metadata"];
}

export interface MapTopologyRouteNodeReadModelV1 {
  readonly nodeId: string;
  readonly nodeKind: MapTopologyRouteNodeDefinitionV1["nodeKind"];
  readonly districtId: DistrictId;
  readonly displayNameKey: string;
  readonly anchor: MapTopologyPointV1;
}

export interface MapTopologyRouteEdgeReadModelV1 {
  readonly routeId: RouteId;
  readonly sourceId: string;
  readonly from: MapTopologyRouteEndpointV1;
  readonly to: MapTopologyRouteEndpointV1;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly mode: MapTopologyRouteModeV1;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly seasonality: readonly MapTopologySeasonalModifierV1[];
  readonly availability: MapTopologyRouteAvailabilityV1;
  readonly metadata: MapTopologyRouteEdgeMetadataV1;
}

export interface PreviewMapTopologyPathInputV1 {
  readonly originDistrictId: DistrictId;
  readonly destinationDistrictId: DistrictId;
  readonly stockAmount: number;
  readonly day: GameDay;
}

export type MapTopologyPathPreviewStatusV1 =
  | "blocked"
  | "capacity-exceeded"
  | "no-known-route"
  | "reachable";

export type MapTopologyPathPreviewV1 =
  | {
      readonly status: "blocked" | "no-known-route";
      readonly topologyHash: MapTopologyHash | null;
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly monthOfYear: number;
      readonly edges: readonly MapTopologyPathPreviewEdgeV1[];
      readonly reasonCodes: readonly string[];
      readonly tieBreakEvidence: MapTopologyTieBreakEvidenceV1;
    }
  | {
      readonly status: "capacity-exceeded" | "reachable";
      readonly topologyHash: MapTopologyHash;
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly monthOfYear: number;
      readonly totalCost: number;
      readonly bottleneckCapacity: number;
      readonly edges: readonly MapTopologyPathPreviewEdgeV1[];
      readonly reasonCodes: readonly string[];
      readonly tieBreakEvidence: MapTopologyTieBreakEvidenceV1;
    };

export interface MapTopologyPathPreviewEdgeV1 {
  readonly routeId: RouteId;
  readonly sourceId: string;
  readonly from: MapTopologyRouteEndpointV1;
  readonly to: MapTopologyRouteEndpointV1;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly mode: MapTopologyRouteModeV1;
  readonly baseTravelCost: number;
  readonly seasonalCost: number;
  readonly baseCapacity: number;
  readonly seasonalCapacity: number;
  readonly stockAmount: number;
  readonly remainingCapacityAfterStock: number;
  readonly availability: MapTopologyRouteAvailabilityV1;
  readonly metadata: MapTopologyRouteEdgeMetadataV1;
  readonly reasonCodes: readonly string[];
}

export interface MapTopologyTieBreakEvidenceV1 {
  readonly orderedBy: readonly [
    "total-cost",
    "edge-count",
    "route-id-sequence",
    "endpoint-id-sequence",
    "district-id"
  ];
  readonly candidateCount: number;
  readonly selectedRouteIds: readonly RouteId[];
  readonly selectedEndpointKeys: readonly string[];
}

interface DirectedMapTopologyEdgeV1 {
  readonly route: MapTopologyRouteEdgeDefinitionV1;
  readonly from: MapTopologyRouteEndpointV1;
  readonly to: MapTopologyRouteEndpointV1;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly seasonalCost: number;
  readonly seasonalCapacity: number;
  readonly seasonalReasonCodes: readonly string[];
}

interface MapTopologyPathLabelV1 {
  readonly districtId: DistrictId;
  readonly totalCost: number;
  readonly edges: readonly DirectedMapTopologyEdgeV1[];
}

interface MapTopologyPathSearchResultV1 {
  readonly label: MapTopologyPathLabelV1 | undefined;
  readonly candidateCount: number;
}

const TOPOLOGY_TIE_BREAK_ORDER: MapTopologyTieBreakEvidenceV1["orderedBy"] = [
  "total-cost",
  "edge-count",
  "route-id-sequence",
  "endpoint-id-sequence",
  "district-id"
];

export function listMapTopologyV1(world: WorldStateV0): MapTopologyReadModelV1 | undefined {
  const topology = world.definitions.topology;
  if (topology === undefined) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    topologyHash: topology.topologyHash,
    contentManifestHash: topology.contentManifestHash,
    districts: topology.districts.map(copyTopologyDistrictReadModel),
    routeNodes: topology.routeNodes.map(copyTopologyRouteNodeReadModel),
    routeEdges: topology.routeEdges.map((route) => copyTopologyRouteEdgeReadModel(world, route))
  };
}

export function previewMapTopologyPathV1(
  world: WorldStateV0,
  input: PreviewMapTopologyPathInputV1
): MapTopologyPathPreviewV1 {
  const topology = world.definitions.topology;
  const monthOfYear = getGameCalendarDate(input.day).monthOfYear;
  if (topology === undefined) {
    return {
      status: "no-known-route",
      topologyHash: null,
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      edges: [],
      reasonCodes: ["topology.missing"],
      tieBreakEvidence: createTieBreakEvidence(undefined, 0)
    };
  }

  if (input.originDistrictId === input.destinationDistrictId) {
    return {
      status: "reachable",
      topologyHash: topology.topologyHash,
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      totalCost: 0,
      bottleneckCapacity: Number.MAX_SAFE_INTEGER,
      edges: [],
      reasonCodes: ["topology.path.same-district"],
      tieBreakEvidence: createTieBreakEvidence(
        {
          districtId: input.originDistrictId,
          totalCost: 0,
          edges: []
        },
        0
      )
    };
  }

  const directedEdges = createDirectedMapTopologyEdges(world, topology, monthOfYear);
  const openPath = findMapTopologyPath({
    originDistrictId: input.originDistrictId,
    destinationDistrictId: input.destinationDistrictId,
    directedEdges: directedEdges.filter((edge) => edge.route.availability.kind === "open")
  });

  if (openPath.label !== undefined) {
    const bottleneckCapacity = openPath.label.edges.reduce(
      (capacity, edge) => (edge.seasonalCapacity < capacity ? edge.seasonalCapacity : capacity),
      Number.MAX_SAFE_INTEGER
    );
    const status = input.stockAmount <= bottleneckCapacity ? "reachable" : "capacity-exceeded";

    return {
      status,
      topologyHash: topology.topologyHash,
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      totalCost: openPath.label.totalCost,
      bottleneckCapacity,
      edges: openPath.label.edges.map((edge) =>
        copyTopologyPathPreviewEdge(edge, input.stockAmount)
      ),
      reasonCodes:
        status === "reachable" ? ["topology.path.reachable"] : ["topology.path.capacity-exceeded"],
      tieBreakEvidence: createTieBreakEvidence(openPath.label, openPath.candidateCount)
    };
  }

  const anyKnownPath = findMapTopologyPath({
    originDistrictId: input.originDistrictId,
    destinationDistrictId: input.destinationDistrictId,
    directedEdges
  });
  if (anyKnownPath.label === undefined) {
    return {
      status: "no-known-route",
      topologyHash: topology.topologyHash,
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      edges: [],
      reasonCodes: ["topology.path.no-known-route"],
      tieBreakEvidence: createTieBreakEvidence(undefined, anyKnownPath.candidateCount)
    };
  }

  const fallbackEdges = anyKnownPath.label.edges.map((edge) =>
    copyTopologyPathPreviewEdge(edge, input.stockAmount)
  );
  const blockedReasonCodes = collectUnavailablePathReasonCodes(fallbackEdges, "blocked");
  if (blockedReasonCodes.length > 0) {
    return {
      status: "blocked",
      topologyHash: topology.topologyHash,
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      edges: fallbackEdges,
      reasonCodes: ["topology.path.blocked", ...blockedReasonCodes],
      tieBreakEvidence: createTieBreakEvidence(anyKnownPath.label, anyKnownPath.candidateCount)
    };
  }

  return {
    status: "no-known-route",
    topologyHash: topology.topologyHash,
    originDistrictId: input.originDistrictId,
    destinationDistrictId: input.destinationDistrictId,
    stockAmount: input.stockAmount,
    monthOfYear,
    edges: fallbackEdges,
    reasonCodes: [
      "topology.path.no-known-open-route",
      ...collectUnavailablePathReasonCodes(fallbackEdges, "unknown")
    ],
    tieBreakEvidence: createTieBreakEvidence(anyKnownPath.label, anyKnownPath.candidateCount)
  };
}

function copyTopologyDistrictReadModel(
  district: MapTopologyDistrictDefinitionV1
): MapTopologyDistrictReadModelV1 {
  return {
    districtId: district.districtId,
    sourceId: district.sourceId,
    displayNameKey: district.displayNameKey,
    anchor: copyPoint(district.anchor),
    polygon: district.polygon.map(copyPoint),
    metadata: { ...district.metadata }
  };
}

function copyTopologyRouteNodeReadModel(
  node: MapTopologyRouteNodeDefinitionV1
): MapTopologyRouteNodeReadModelV1 {
  return {
    nodeId: node.nodeId,
    nodeKind: node.nodeKind,
    districtId: node.districtId,
    displayNameKey: node.displayNameKey,
    anchor: copyPoint(node.anchor)
  };
}

function copyTopologyRouteEdgeReadModel(
  world: WorldStateV0,
  route: MapTopologyRouteEdgeDefinitionV1
): MapTopologyRouteEdgeReadModelV1 {
  const topology = world.definitions.topology;
  if (topology === undefined) {
    throw new Error("Map topology read model requires definitions.topology.");
  }

  return {
    routeId: route.routeId,
    sourceId: route.sourceId,
    from: copyEndpoint(route.from),
    to: copyEndpoint(route.to),
    fromDistrictId: resolveEndpointDistrictId(world, topology, route.from),
    toDistrictId: resolveEndpointDistrictId(world, topology, route.to),
    mode: route.mode,
    baseTravelCost: route.baseTravelCost,
    baseCapacity: route.baseCapacity,
    seasonality: route.seasonality.map((season) => ({
      month: season.month,
      costMultiplierBps: season.costMultiplierBps,
      capacityMultiplierBps: season.capacityMultiplierBps,
      reasonCodes: [...season.reasonCodes]
    })),
    availability: copyAvailability(route.availability),
    metadata: { ...route.metadata }
  };
}

function createDirectedMapTopologyEdges(
  world: WorldStateV0,
  topology: MapTopologyDefinitionV1,
  monthOfYear: number
): readonly DirectedMapTopologyEdgeV1[] {
  const edges: DirectedMapTopologyEdgeV1[] = [];
  for (const route of topology.routeEdges) {
    const fromDistrictId = tryMapTopologyEndpointDistrictId(
      world.definitions,
      topology,
      route.from
    );
    const toDistrictId = tryMapTopologyEndpointDistrictId(world.definitions, topology, route.to);
    if (fromDistrictId === undefined || toDistrictId === undefined) {
      continue;
    }

    const seasonal = calculateTopologySeasonalValues(route, monthOfYear);
    edges.push({
      route,
      from: route.from,
      to: route.to,
      fromDistrictId,
      toDistrictId,
      seasonalCost: seasonal.cost,
      seasonalCapacity: seasonal.capacity,
      seasonalReasonCodes: seasonal.reasonCodes
    });
    edges.push({
      route,
      from: route.to,
      to: route.from,
      fromDistrictId: toDistrictId,
      toDistrictId: fromDistrictId,
      seasonalCost: seasonal.cost,
      seasonalCapacity: seasonal.capacity,
      seasonalReasonCodes: seasonal.reasonCodes
    });
  }

  return edges.sort(compareDirectedTopologyEdge);
}

function calculateTopologySeasonalValues(
  route: MapTopologyRouteEdgeDefinitionV1,
  monthOfYear: number
): { readonly cost: number; readonly capacity: number; readonly reasonCodes: readonly string[] } {
  const season =
    route.seasonality.find((entry) => entry.month === monthOfYear) ??
    neutralTopologySeason(monthOfYear);

  return {
    cost: ceilDivide(route.baseTravelCost * season.costMultiplierBps, 10_000),
    capacity: floorDivide(route.baseCapacity * season.capacityMultiplierBps, 10_000),
    reasonCodes: [...season.reasonCodes]
  };
}

function findMapTopologyPath(input: {
  readonly originDistrictId: DistrictId;
  readonly destinationDistrictId: DistrictId;
  readonly directedEdges: readonly DirectedMapTopologyEdgeV1[];
}): MapTopologyPathSearchResultV1 {
  const bestByDistrictId = new Map<number, MapTopologyPathLabelV1>();
  const unsettled: MapTopologyPathLabelV1[] = [
    {
      districtId: input.originDistrictId,
      totalCost: 0,
      edges: []
    }
  ];
  let candidateCount = 0;

  while (unsettled.length > 0) {
    unsettled.sort(compareTopologyPathLabel);
    const current = unsettled.shift();
    if (current === undefined) {
      return {
        label: undefined,
        candidateCount
      };
    }

    const knownBest = bestByDistrictId.get(current.districtId);
    if (knownBest !== undefined && compareTopologyPathLabel(knownBest, current) <= 0) {
      continue;
    }

    bestByDistrictId.set(current.districtId, current);
    if (current.districtId === input.destinationDistrictId) {
      return {
        label: current,
        candidateCount
      };
    }

    for (const edge of input.directedEdges) {
      if (edge.fromDistrictId !== current.districtId) {
        continue;
      }

      const candidate = {
        districtId: edge.toDistrictId,
        totalCost: current.totalCost + edge.seasonalCost,
        edges: [...current.edges, edge]
      };
      candidateCount += 1;
      const existing = bestByDistrictId.get(candidate.districtId);
      if (existing === undefined || compareTopologyPathLabel(candidate, existing) < 0) {
        unsettled.push(candidate);
      }
    }
  }

  return {
    label: undefined,
    candidateCount
  };
}

function copyTopologyPathPreviewEdge(
  edge: DirectedMapTopologyEdgeV1,
  stockAmount: number
): MapTopologyPathPreviewEdgeV1 {
  return {
    routeId: edge.route.routeId,
    sourceId: edge.route.sourceId,
    from: copyEndpoint(edge.from),
    to: copyEndpoint(edge.to),
    fromDistrictId: edge.fromDistrictId,
    toDistrictId: edge.toDistrictId,
    mode: edge.route.mode,
    baseTravelCost: edge.route.baseTravelCost,
    seasonalCost: edge.seasonalCost,
    baseCapacity: edge.route.baseCapacity,
    seasonalCapacity: edge.seasonalCapacity,
    stockAmount,
    remainingCapacityAfterStock:
      edge.seasonalCapacity >= stockAmount ? edge.seasonalCapacity - stockAmount : 0,
    availability: copyAvailability(edge.route.availability),
    metadata: { ...edge.route.metadata },
    reasonCodes: createEdgeReasonCodes(edge)
  };
}

function createEdgeReasonCodes(edge: DirectedMapTopologyEdgeV1): readonly string[] {
  const availability = edge.route.availability;
  const availabilityReasons =
    availability.kind === "open"
      ? ["topology.route.open"]
      : [`topology.route.${availability.kind}`, availability.reasonCode];
  return [
    `topology.route.mode.${edge.route.mode}`,
    `topology.terrain.${edge.route.metadata.terrainClass}`,
    `topology.risk.${edge.route.metadata.riskClass}`,
    ...availabilityReasons,
    ...edge.seasonalReasonCodes
  ];
}

function collectUnavailablePathReasonCodes(
  edges: readonly MapTopologyPathPreviewEdgeV1[],
  kind: "blocked" | "unknown"
): readonly string[] {
  const reasonCodes: string[] = [];
  for (const edge of edges) {
    if (edge.availability.kind === kind) {
      reasonCodes.push(edge.availability.reasonCode);
    }
  }

  return sortUniqueText(reasonCodes);
}

function createTieBreakEvidence(
  label: MapTopologyPathLabelV1 | undefined,
  candidateCount: number
): MapTopologyTieBreakEvidenceV1 {
  return {
    orderedBy: TOPOLOGY_TIE_BREAK_ORDER,
    candidateCount,
    selectedRouteIds: label?.edges.map((edge) => edge.route.routeId) ?? [],
    selectedEndpointKeys:
      label?.edges.map(
        (edge) => `${formatMapTopologyEndpoint(edge.from)}>${formatMapTopologyEndpoint(edge.to)}`
      ) ?? []
  };
}

function compareTopologyPathLabel(
  left: MapTopologyPathLabelV1,
  right: MapTopologyPathLabelV1
): number {
  return (
    left.totalCost - right.totalCost ||
    left.edges.length - right.edges.length ||
    compareTopologyRouteIdSequence(left.edges, right.edges) ||
    compareTopologyEndpointSequence(left.edges, right.edges) ||
    left.districtId - right.districtId
  );
}

function compareTopologyRouteIdSequence(
  left: readonly DirectedMapTopologyEdgeV1[],
  right: readonly DirectedMapTopologyEdgeV1[]
): number {
  const length = left.length < right.length ? left.length : right.length;
  for (let index = 0; index < length; index += 1) {
    const leftEdge = left[index];
    const rightEdge = right[index];
    if (leftEdge === undefined || rightEdge === undefined) {
      return left.length - right.length;
    }
    const routeDelta = leftEdge.route.routeId - rightEdge.route.routeId;
    if (routeDelta !== 0) {
      return routeDelta;
    }
  }

  return left.length - right.length;
}

function compareTopologyEndpointSequence(
  left: readonly DirectedMapTopologyEdgeV1[],
  right: readonly DirectedMapTopologyEdgeV1[]
): number {
  const length = left.length < right.length ? left.length : right.length;
  for (let index = 0; index < length; index += 1) {
    const leftEdge = left[index];
    const rightEdge = right[index];
    if (leftEdge === undefined || rightEdge === undefined) {
      return left.length - right.length;
    }
    const endpointDelta = compareText(
      `${formatMapTopologyEndpoint(leftEdge.from)}>${formatMapTopologyEndpoint(leftEdge.to)}`,
      `${formatMapTopologyEndpoint(rightEdge.from)}>${formatMapTopologyEndpoint(rightEdge.to)}`
    );
    if (endpointDelta !== 0) {
      return endpointDelta;
    }
  }

  return left.length - right.length;
}

function compareDirectedTopologyEdge(
  left: DirectedMapTopologyEdgeV1,
  right: DirectedMapTopologyEdgeV1
): number {
  return (
    left.fromDistrictId - right.fromDistrictId ||
    left.toDistrictId - right.toDistrictId ||
    left.route.routeId - right.route.routeId ||
    compareText(formatMapTopologyEndpoint(left.from), formatMapTopologyEndpoint(right.from)) ||
    compareText(formatMapTopologyEndpoint(left.to), formatMapTopologyEndpoint(right.to))
  );
}

function resolveEndpointDistrictId(
  world: WorldStateV0,
  topology: MapTopologyDefinitionV1,
  endpoint: MapTopologyRouteEndpointV1
): DistrictId {
  const districtId = tryMapTopologyEndpointDistrictId(world.definitions, topology, endpoint);
  if (districtId === undefined) {
    throw new Error(`Map topology endpoint ${formatMapTopologyEndpoint(endpoint)} is unresolved.`);
  }

  return districtId;
}

function neutralTopologySeason(monthOfYear: number): MapTopologySeasonalModifierV1 {
  return {
    month: monthOfYear,
    costMultiplierBps: 10_000,
    capacityMultiplierBps: 10_000,
    reasonCodes: ["topology.seasonality.neutral-fallback"]
  };
}

function copyEndpoint(endpoint: MapTopologyRouteEndpointV1): MapTopologyRouteEndpointV1 {
  switch (endpoint.kind) {
    case "district":
      return {
        kind: "district",
        districtId: endpoint.districtId
      };
    case "route-node":
      return {
        kind: "route-node",
        nodeId: endpoint.nodeId
      };
    case "settlement":
      return {
        kind: "settlement",
        settlementId: endpoint.settlementId
      };
  }
}

function copyAvailability(
  availability: MapTopologyRouteAvailabilityV1
): MapTopologyRouteAvailabilityV1 {
  switch (availability.kind) {
    case "open":
      return { kind: "open" };
    case "blocked":
      return {
        kind: "blocked",
        reasonCode: availability.reasonCode
      };
    case "unknown":
      return {
        kind: "unknown",
        reasonCode: availability.reasonCode
      };
  }
}

function copyPoint(point: MapTopologyPointV1): MapTopologyPointV1 {
  return {
    x: point.x,
    y: point.y
  };
}

function sortUniqueText(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareText);
}

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function ceilDivide(dividend: number, divisor: number): number {
  const adjusted = dividend + divisor - 1;
  return floorDivide(adjusted, divisor);
}

function floorDivide(dividend: number, divisor: number): number {
  return (dividend - (dividend % divisor)) / divisor;
}

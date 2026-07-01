import { getGameCalendarDate } from "./scheduler-v0.ts";
import {
  type BarrierChannelDefinitionV1,
  type BarrierChannelId,
  type DistrictGovernanceFootprintDefinitionV1,
  type DistrictGovernanceFootprintId,
  type GameDay,
  type RouteCorridorAvailabilityV1,
  type RouteCorridorDefinitionV1,
  type RouteCorridorId,
  type RouteCorridorSeasonalModifierV1,
  type StrategicNodeDefinitionV1,
  type StrategicNodeId,
  type StrategicTerrainAuthorityProhibitionV1,
  type StrategicTerrainDefinitionV1,
  type StrategicTerrainHash,
  type StrategicTerrainPointV1,
  type TerrainPatchDefinitionV1,
  type TerrainPatchId,
  type WorldStateV0
} from "./world-state-v0.ts";

export interface StrategicTerrainReadModelV1 {
  readonly schemaVersion: 1;
  readonly strategicTerrainHash: StrategicTerrainHash;
  readonly contentManifestHash: string;
  readonly authority: "terrain-route-node-v1";
  readonly governanceFootprintRole: "overlay-only";
  readonly authorityProhibitions: readonly StrategicTerrainAuthorityProhibitionV1[];
  readonly terrainPatches: readonly TerrainPatchReadModelV1[];
  readonly barrierChannels: readonly BarrierChannelReadModelV1[];
  readonly strategicNodes: readonly StrategicNodeReadModelV1[];
  readonly routeCorridors: readonly RouteCorridorReadModelV1[];
  readonly districtGovernanceFootprints: readonly DistrictGovernanceFootprintReadModelV1[];
}

export type TerrainPatchReadModelV1 = TerrainPatchDefinitionV1;
export type BarrierChannelReadModelV1 = BarrierChannelDefinitionV1;
export type StrategicNodeReadModelV1 = StrategicNodeDefinitionV1;
export type RouteCorridorReadModelV1 = RouteCorridorDefinitionV1;
export type DistrictGovernanceFootprintReadModelV1 = DistrictGovernanceFootprintDefinitionV1;

export interface HitTestStrategicTerrainInputV1 {
  readonly point: StrategicTerrainPointV1;
}

export type StrategicTerrainHitCandidateKindV1 =
  | "barrier-channel"
  | "district-governance-footprint"
  | "route-corridor"
  | "strategic-node"
  | "terrain-patch";

export interface StrategicTerrainHitCandidateV1 {
  readonly kind: StrategicTerrainHitCandidateKindV1;
  readonly id: string;
  readonly priority: number;
  readonly reasonCodes: readonly string[];
}

export interface StrategicTerrainHitTestV1 {
  readonly strategicTerrainHash: StrategicTerrainHash;
  readonly point: StrategicTerrainPointV1;
  readonly selected: StrategicTerrainHitCandidateV1 | null;
  readonly candidates: readonly StrategicTerrainHitCandidateV1[];
  readonly priorityIntent: readonly [
    "route-blocker",
    "strategic-node",
    "route-corridor",
    "barrier-channel",
    "terrain-patch",
    "district-governance-footprint"
  ];
  readonly reasonCodes: readonly string[];
}

export interface PreviewStrategicTerrainRouteInputV1 {
  readonly originNodeId: string;
  readonly destinationNodeId: string;
  readonly stockAmount: number;
  readonly day: GameDay;
}

export type StrategicTerrainRoutePreviewStatusV1 =
  | "blocked"
  | "capacity-exceeded"
  | "no-known-route"
  | "reachable"
  | "unknown";

export type StrategicTerrainRoutePreviewV1 =
  | {
      readonly status: "blocked" | "no-known-route" | "unknown";
      readonly strategicTerrainHash: StrategicTerrainHash | null;
      readonly originNodeId: string;
      readonly destinationNodeId: string;
      readonly stockAmount: number;
      readonly monthOfYear: number;
      readonly corridors: readonly StrategicTerrainRoutePreviewCorridorV1[];
      readonly routeExplanation: StrategicTerrainRouteExplanationV1;
      readonly aiReasons: StrategicTerrainAiRouteReasonV1;
      readonly reasonCodes: readonly string[];
      readonly tieBreakEvidence: StrategicTerrainTieBreakEvidenceV1;
    }
  | {
      readonly status: "capacity-exceeded" | "reachable";
      readonly strategicTerrainHash: StrategicTerrainHash;
      readonly originNodeId: string;
      readonly destinationNodeId: string;
      readonly stockAmount: number;
      readonly monthOfYear: number;
      readonly totalCost: number;
      readonly bottleneckCapacity: number;
      readonly bottleneckCorridorId: RouteCorridorId | null;
      readonly corridors: readonly StrategicTerrainRoutePreviewCorridorV1[];
      readonly routeExplanation: StrategicTerrainRouteExplanationV1;
      readonly aiReasons: StrategicTerrainAiRouteReasonV1;
      readonly reasonCodes: readonly string[];
      readonly tieBreakEvidence: StrategicTerrainTieBreakEvidenceV1;
    };

export interface StrategicTerrainRoutePreviewCorridorV1 {
  readonly corridorId: RouteCorridorId;
  readonly sourceId: string;
  readonly fromNodeId: StrategicNodeId;
  readonly toNodeId: StrategicNodeId;
  readonly mode: RouteCorridorDefinitionV1["mode"];
  readonly widthClass: RouteCorridorDefinitionV1["widthClass"];
  readonly baseTravelCost: number;
  readonly seasonalTravelCost: number;
  readonly baseCapacity: number;
  readonly seasonalCapacity: number;
  readonly stockAmount: number;
  readonly remainingCapacityAfterStock: number;
  readonly seasonState: RouteCorridorSeasonalModifierV1["seasonState"];
  readonly riskBps: number;
  readonly riskClass: RouteCorridorDefinitionV1["riskClass"];
  readonly availability: RouteCorridorAvailabilityV1;
  readonly terrainPatchIds: readonly TerrainPatchId[];
  readonly barrierChannelIds: readonly BarrierChannelId[];
  readonly governanceFootprintIds: readonly DistrictGovernanceFootprintId[];
  readonly reasonCodes: readonly string[];
}

export interface StrategicTerrainRouteExplanationV1 {
  readonly estimatedTravelCost: number | null;
  readonly bottleneckCapacity: number | null;
  readonly bottleneckCorridorId: RouteCorridorId | null;
  readonly terrainReasonCodes: readonly string[];
  readonly seasonReasonCodes: readonly string[];
  readonly riskReasonCodes: readonly string[];
  readonly blockerReasonCodes: readonly string[];
  readonly unknownReasonCodes: readonly string[];
  readonly capacityReasonCodes: readonly string[];
  readonly governanceConsequenceCodes: readonly string[];
}

export interface StrategicTerrainAiRouteReasonV1 {
  readonly reasonCodes: readonly string[];
  readonly corridorIds: readonly RouteCorridorId[];
  readonly blockerReasonCodes: readonly string[];
  readonly unknownReasonCodes: readonly string[];
  readonly governanceConsequenceCodes: readonly string[];
}

export interface StrategicTerrainTieBreakEvidenceV1 {
  readonly orderedBy: readonly [
    "total-cost",
    "corridor-count",
    "corridor-id-sequence",
    "endpoint-node-id-sequence",
    "destination-node-id"
  ];
  readonly candidateCount: number;
  readonly selectedCorridorIds: readonly RouteCorridorId[];
  readonly selectedEndpointKeys: readonly string[];
}

interface DirectedStrategicTerrainCorridorV1 {
  readonly corridor: RouteCorridorDefinitionV1;
  readonly fromNodeId: StrategicNodeId;
  readonly toNodeId: StrategicNodeId;
  readonly seasonalTravelCost: number;
  readonly seasonalCapacity: number;
  readonly seasonState: RouteCorridorSeasonalModifierV1["seasonState"];
  readonly riskBps: number;
  readonly seasonalReasonCodes: readonly string[];
}

interface StrategicTerrainPathLabelV1 {
  readonly nodeId: StrategicNodeId;
  readonly totalCost: number;
  readonly corridors: readonly DirectedStrategicTerrainCorridorV1[];
}

interface StrategicTerrainPathSearchResultV1 {
  readonly label: StrategicTerrainPathLabelV1 | undefined;
  readonly candidateCount: number;
}

const HIT_PRIORITY_INTENT: StrategicTerrainHitTestV1["priorityIntent"] = [
  "route-blocker",
  "strategic-node",
  "route-corridor",
  "barrier-channel",
  "terrain-patch",
  "district-governance-footprint"
];

const STRATEGIC_TERRAIN_TIE_BREAK_ORDER: StrategicTerrainTieBreakEvidenceV1["orderedBy"] = [
  "total-cost",
  "corridor-count",
  "corridor-id-sequence",
  "endpoint-node-id-sequence",
  "destination-node-id"
];

export function listStrategicTerrainV1(
  world: WorldStateV0
): StrategicTerrainReadModelV1 | undefined {
  const terrain = world.definitions.strategicTerrain;
  if (terrain === undefined) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    strategicTerrainHash: terrain.strategicTerrainHash,
    contentManifestHash: terrain.contentManifestHash,
    authority: terrain.authority,
    governanceFootprintRole: terrain.governanceFootprintRole,
    authorityProhibitions: [...terrain.authorityProhibitions],
    terrainPatches: terrain.terrainPatches.map(copyTerrainPatch),
    barrierChannels: terrain.barrierChannels.map(copyBarrierChannel),
    strategicNodes: terrain.strategicNodes.map(copyStrategicNode),
    routeCorridors: terrain.routeCorridors.map(copyRouteCorridor),
    districtGovernanceFootprints: terrain.districtGovernanceFootprints.map(
      copyDistrictGovernanceFootprint
    )
  };
}

export function hitTestStrategicTerrainV1(
  world: WorldStateV0,
  input: HitTestStrategicTerrainInputV1
): StrategicTerrainHitTestV1 | undefined {
  const terrain = world.definitions.strategicTerrain;
  if (terrain === undefined) {
    return undefined;
  }

  const candidates: StrategicTerrainHitCandidateV1[] = [];
  for (const corridor of terrain.routeCorridors) {
    if (pointTouchesPolyline(input.point, corridor.polyline)) {
      const isBlocker = corridor.availability.kind !== "open";
      candidates.push({
        kind: "route-corridor",
        id: corridor.corridorId,
        priority: isBlocker ? 10 : 30,
        reasonCodes: isBlocker
          ? ["strategic-terrain.hit.route-blocker", routeAvailabilityReason(corridor.availability)]
          : ["strategic-terrain.hit.route-corridor"]
      });
    }
  }
  for (const node of terrain.strategicNodes) {
    if (pointsEqual(input.point, node.anchor)) {
      candidates.push({
        kind: "strategic-node",
        id: node.nodeId,
        priority: 20,
        reasonCodes: [`strategic-terrain.hit.node.${node.nodeKind}`]
      });
    }
  }
  for (const channel of terrain.barrierChannels) {
    if (pointTouchesPolyline(input.point, channel.points)) {
      candidates.push({
        kind: "barrier-channel",
        id: channel.channelId,
        priority: 40,
        reasonCodes: [`strategic-terrain.hit.barrier.${channel.channelKind}`]
      });
    }
  }
  for (const patch of terrain.terrainPatches) {
    if (pointInPolygon(input.point, patch.polygon)) {
      candidates.push({
        kind: "terrain-patch",
        id: patch.patchId,
        priority: 50,
        reasonCodes: [`strategic-terrain.hit.terrain.${patch.terrainClass}`]
      });
    }
  }
  for (const footprint of terrain.districtGovernanceFootprints) {
    if (pointInPolygon(input.point, footprint.polygon)) {
      candidates.push({
        kind: "district-governance-footprint",
        id: footprint.footprintId,
        priority: 60,
        reasonCodes: ["strategic-terrain.hit.governance-overlay-only"]
      });
    }
  }

  const sortedCandidates = candidates.sort(compareHitCandidate);
  return {
    strategicTerrainHash: terrain.strategicTerrainHash,
    point: copyPoint(input.point),
    selected: sortedCandidates[0] ?? null,
    candidates: sortedCandidates,
    priorityIntent: HIT_PRIORITY_INTENT,
    reasonCodes:
      sortedCandidates.length === 0
        ? ["strategic-terrain.hit.none"]
        : ["strategic-terrain.hit.priority-deterministic"]
  };
}

export function previewStrategicTerrainRouteV1(
  world: WorldStateV0,
  input: PreviewStrategicTerrainRouteInputV1
): StrategicTerrainRoutePreviewV1 {
  const terrain = world.definitions.strategicTerrain;
  const monthOfYear = getGameCalendarDate(input.day).monthOfYear;
  if (terrain === undefined) {
    return {
      status: "no-known-route",
      strategicTerrainHash: null,
      originNodeId: input.originNodeId,
      destinationNodeId: input.destinationNodeId,
      stockAmount: input.stockAmount,
      monthOfYear,
      corridors: [],
      routeExplanation: emptyRouteExplanation(),
      aiReasons: emptyAiReasons(),
      reasonCodes: ["strategic-terrain.missing"],
      tieBreakEvidence: createTieBreakEvidence(undefined, 0)
    };
  }

  const originNodeId = input.originNodeId as StrategicNodeId;
  const destinationNodeId = input.destinationNodeId as StrategicNodeId;
  if (originNodeId === destinationNodeId) {
    const sameNodeExplanation = emptyRouteExplanation();
    return {
      status: "reachable",
      strategicTerrainHash: terrain.strategicTerrainHash,
      originNodeId: input.originNodeId,
      destinationNodeId: input.destinationNodeId,
      stockAmount: input.stockAmount,
      monthOfYear,
      totalCost: 0,
      bottleneckCapacity: Number.MAX_SAFE_INTEGER,
      bottleneckCorridorId: null,
      corridors: [],
      routeExplanation: {
        ...sameNodeExplanation,
        estimatedTravelCost: 0,
        bottleneckCapacity: Number.MAX_SAFE_INTEGER
      },
      aiReasons: {
        ...emptyAiReasons(),
        reasonCodes: ["strategic-terrain.path.same-node"]
      },
      reasonCodes: ["strategic-terrain.path.same-node"],
      tieBreakEvidence: createTieBreakEvidence(
        { nodeId: originNodeId, totalCost: 0, corridors: [] },
        0
      )
    };
  }

  const directedCorridors = createDirectedCorridors(terrain, monthOfYear);
  const openPath = findStrategicTerrainPath({
    originNodeId,
    destinationNodeId,
    directedCorridors: directedCorridors.filter(
      (corridor) => corridor.corridor.availability.kind === "open"
    )
  });

  if (openPath.label !== undefined) {
    const corridors = openPath.label.corridors.map((corridor) =>
      copyStrategicTerrainRoutePreviewCorridor(corridor, input.stockAmount)
    );
    const bottleneck = findBottleneck(openPath.label.corridors);
    const status = input.stockAmount <= bottleneck.capacity ? "reachable" : "capacity-exceeded";
    const reasonCodes =
      status === "reachable"
        ? ["strategic-terrain.path.reachable"]
        : ["strategic-terrain.path.capacity-exceeded"];
    const explanation = createRouteExplanation(
      openPath.label.totalCost,
      bottleneck.capacity,
      bottleneck.corridorId,
      corridors,
      status === "capacity-exceeded" ? ["strategic-terrain.capacity.exceeded"] : []
    );

    return {
      status,
      strategicTerrainHash: terrain.strategicTerrainHash,
      originNodeId: input.originNodeId,
      destinationNodeId: input.destinationNodeId,
      stockAmount: input.stockAmount,
      monthOfYear,
      totalCost: openPath.label.totalCost,
      bottleneckCapacity: bottleneck.capacity,
      bottleneckCorridorId: bottleneck.corridorId,
      corridors,
      routeExplanation: explanation,
      aiReasons: createAiReasons(reasonCodes, corridors, explanation),
      reasonCodes,
      tieBreakEvidence: createTieBreakEvidence(openPath.label, openPath.candidateCount)
    };
  }

  const anyPath = findStrategicTerrainPath({
    originNodeId,
    destinationNodeId,
    directedCorridors
  });
  if (anyPath.label === undefined) {
    const explanation = emptyRouteExplanation();
    return {
      status: "no-known-route",
      strategicTerrainHash: terrain.strategicTerrainHash,
      originNodeId: input.originNodeId,
      destinationNodeId: input.destinationNodeId,
      stockAmount: input.stockAmount,
      monthOfYear,
      corridors: [],
      routeExplanation: explanation,
      aiReasons: createAiReasons(["strategic-terrain.path.no-known-route"], [], explanation),
      reasonCodes: ["strategic-terrain.path.no-known-route"],
      tieBreakEvidence: createTieBreakEvidence(undefined, anyPath.candidateCount)
    };
  }

  const corridors = anyPath.label.corridors.map((corridor) =>
    copyStrategicTerrainRoutePreviewCorridor(corridor, input.stockAmount)
  );
  const blockedReasonCodes = collectAvailabilityReasonCodes(corridors, "blocked");
  const unknownReasonCodes = collectAvailabilityReasonCodes(corridors, "unknown");
  const status = blockedReasonCodes.length > 0 ? "blocked" : "unknown";
  const reasonCodes =
    status === "blocked"
      ? ["strategic-terrain.path.blocked", ...blockedReasonCodes]
      : ["strategic-terrain.path.unknown", ...unknownReasonCodes];
  const explanation = createRouteExplanation(
    anyPath.label.totalCost,
    findBottleneck(anyPath.label.corridors).capacity,
    findBottleneck(anyPath.label.corridors).corridorId,
    corridors,
    []
  );

  return {
    status,
    strategicTerrainHash: terrain.strategicTerrainHash,
    originNodeId: input.originNodeId,
    destinationNodeId: input.destinationNodeId,
    stockAmount: input.stockAmount,
    monthOfYear,
    corridors,
    routeExplanation: explanation,
    aiReasons: createAiReasons(reasonCodes, corridors, explanation),
    reasonCodes,
    tieBreakEvidence: createTieBreakEvidence(anyPath.label, anyPath.candidateCount)
  };
}

function createDirectedCorridors(
  terrain: StrategicTerrainDefinitionV1,
  monthOfYear: number
): readonly DirectedStrategicTerrainCorridorV1[] {
  const corridors: DirectedStrategicTerrainCorridorV1[] = [];
  for (const corridor of terrain.routeCorridors) {
    const seasonal = calculateCorridorSeasonalValues(corridor, monthOfYear);
    corridors.push({
      corridor,
      fromNodeId: corridor.fromNodeId,
      toNodeId: corridor.toNodeId,
      seasonalTravelCost: seasonal.travelCost,
      seasonalCapacity: seasonal.capacity,
      seasonState: seasonal.seasonState,
      riskBps: seasonal.riskBps,
      seasonalReasonCodes: seasonal.reasonCodes
    });
    corridors.push({
      corridor,
      fromNodeId: corridor.toNodeId,
      toNodeId: corridor.fromNodeId,
      seasonalTravelCost: seasonal.travelCost,
      seasonalCapacity: seasonal.capacity,
      seasonState: seasonal.seasonState,
      riskBps: seasonal.riskBps,
      seasonalReasonCodes: seasonal.reasonCodes
    });
  }

  return corridors.sort(compareDirectedCorridor);
}

function calculateCorridorSeasonalValues(
  corridor: RouteCorridorDefinitionV1,
  monthOfYear: number
): {
  readonly travelCost: number;
  readonly capacity: number;
  readonly seasonState: RouteCorridorSeasonalModifierV1["seasonState"];
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
} {
  const season =
    corridor.seasonality.find((entry) => entry.month === monthOfYear) ??
    neutralCorridorSeason(monthOfYear);

  return {
    travelCost: ceilDivide(corridor.baseTravelCost * season.travelCostMultiplierBps, 10_000),
    capacity: floorDivide(corridor.baseCapacity * season.capacityMultiplierBps, 10_000),
    seasonState: season.seasonState,
    riskBps: season.riskBps,
    reasonCodes: [...season.reasonCodes]
  };
}

function findStrategicTerrainPath(input: {
  readonly originNodeId: StrategicNodeId;
  readonly destinationNodeId: StrategicNodeId;
  readonly directedCorridors: readonly DirectedStrategicTerrainCorridorV1[];
}): StrategicTerrainPathSearchResultV1 {
  const bestByNodeId = new Map<string, StrategicTerrainPathLabelV1>();
  const unsettled: StrategicTerrainPathLabelV1[] = [
    {
      nodeId: input.originNodeId,
      totalCost: 0,
      corridors: []
    }
  ];
  let candidateCount = 0;

  while (unsettled.length > 0) {
    unsettled.sort(comparePathLabel);
    const current = unsettled.shift();
    if (current === undefined) {
      return { label: undefined, candidateCount };
    }

    const knownBest = bestByNodeId.get(current.nodeId);
    if (knownBest !== undefined && comparePathLabel(knownBest, current) <= 0) {
      continue;
    }

    bestByNodeId.set(current.nodeId, current);
    if (current.nodeId === input.destinationNodeId) {
      return { label: current, candidateCount };
    }

    for (const corridor of input.directedCorridors) {
      if (corridor.fromNodeId !== current.nodeId) {
        continue;
      }

      const candidate = {
        nodeId: corridor.toNodeId,
        totalCost: current.totalCost + corridor.seasonalTravelCost,
        corridors: [...current.corridors, corridor]
      };
      candidateCount += 1;
      const existing = bestByNodeId.get(candidate.nodeId);
      if (existing === undefined || comparePathLabel(candidate, existing) < 0) {
        unsettled.push(candidate);
      }
    }
  }

  return { label: undefined, candidateCount };
}

function copyStrategicTerrainRoutePreviewCorridor(
  corridor: DirectedStrategicTerrainCorridorV1,
  stockAmount: number
): StrategicTerrainRoutePreviewCorridorV1 {
  return {
    corridorId: corridor.corridor.corridorId,
    sourceId: corridor.corridor.sourceId,
    fromNodeId: corridor.fromNodeId,
    toNodeId: corridor.toNodeId,
    mode: corridor.corridor.mode,
    widthClass: corridor.corridor.widthClass,
    baseTravelCost: corridor.corridor.baseTravelCost,
    seasonalTravelCost: corridor.seasonalTravelCost,
    baseCapacity: corridor.corridor.baseCapacity,
    seasonalCapacity: corridor.seasonalCapacity,
    stockAmount,
    remainingCapacityAfterStock:
      corridor.seasonalCapacity >= stockAmount ? corridor.seasonalCapacity - stockAmount : 0,
    seasonState: corridor.seasonState,
    riskBps: corridor.riskBps,
    riskClass: corridor.corridor.riskClass,
    availability: copyAvailability(corridor.corridor.availability),
    terrainPatchIds: [...corridor.corridor.terrainPatchIds],
    barrierChannelIds: [...corridor.corridor.barrierChannelIds],
    governanceFootprintIds: [...corridor.corridor.governanceFootprintIds],
    reasonCodes: createCorridorReasonCodes(corridor)
  };
}

function createCorridorReasonCodes(
  corridor: DirectedStrategicTerrainCorridorV1
): readonly string[] {
  return [
    `strategic-terrain.corridor.mode.${corridor.corridor.mode}`,
    `strategic-terrain.corridor.width.${corridor.corridor.widthClass}`,
    `strategic-terrain.risk.${corridor.corridor.riskClass}`,
    `strategic-terrain.season.${corridor.seasonState}`,
    ...corridor.corridor.terrainPatchIds.map((patchId) => `strategic-terrain.terrain.${patchId}`),
    ...corridor.corridor.barrierChannelIds.map(
      (channelId) => `strategic-terrain.barrier.${channelId}`
    ),
    routeAvailabilityReason(corridor.corridor.availability),
    ...corridor.seasonalReasonCodes
  ];
}

function createRouteExplanation(
  estimatedTravelCost: number | null,
  bottleneckCapacity: number | null,
  bottleneckCorridorId: RouteCorridorId | null,
  corridors: readonly StrategicTerrainRoutePreviewCorridorV1[],
  capacityReasonCodes: readonly string[]
): StrategicTerrainRouteExplanationV1 {
  return {
    estimatedTravelCost,
    bottleneckCapacity,
    bottleneckCorridorId,
    terrainReasonCodes: sortUniqueText(
      corridors.flatMap((corridor) =>
        corridor.terrainPatchIds.map((patchId) => `strategic-terrain.terrain.${patchId}`)
      )
    ),
    seasonReasonCodes: sortUniqueText(
      corridors.flatMap((corridor) => [
        `strategic-terrain.season.${corridor.seasonState}`,
        ...corridor.reasonCodes.filter((reason) => reason.includes(".season."))
      ])
    ),
    riskReasonCodes: sortUniqueText(
      corridors.map((corridor) => `strategic-terrain.risk.${corridor.riskClass}`)
    ),
    blockerReasonCodes: collectAvailabilityReasonCodes(corridors, "blocked"),
    unknownReasonCodes: collectAvailabilityReasonCodes(corridors, "unknown"),
    capacityReasonCodes: sortUniqueText(capacityReasonCodes),
    governanceConsequenceCodes: sortUniqueText(
      corridors.flatMap((corridor) =>
        corridor.governanceFootprintIds.map(
          (footprintId) => `strategic-terrain.governance-consequence.${footprintId}`
        )
      )
    )
  };
}

function createAiReasons(
  reasonCodes: readonly string[],
  corridors: readonly StrategicTerrainRoutePreviewCorridorV1[],
  explanation: StrategicTerrainRouteExplanationV1
): StrategicTerrainAiRouteReasonV1 {
  return {
    reasonCodes: sortUniqueText([
      ...reasonCodes,
      ...corridors.flatMap((corridor) => corridor.reasonCodes)
    ]),
    corridorIds: corridors.map((corridor) => corridor.corridorId),
    blockerReasonCodes: explanation.blockerReasonCodes,
    unknownReasonCodes: explanation.unknownReasonCodes,
    governanceConsequenceCodes: explanation.governanceConsequenceCodes
  };
}

function emptyRouteExplanation(): StrategicTerrainRouteExplanationV1 {
  return {
    estimatedTravelCost: null,
    bottleneckCapacity: null,
    bottleneckCorridorId: null,
    terrainReasonCodes: [],
    seasonReasonCodes: [],
    riskReasonCodes: [],
    blockerReasonCodes: [],
    unknownReasonCodes: [],
    capacityReasonCodes: [],
    governanceConsequenceCodes: []
  };
}

function emptyAiReasons(): StrategicTerrainAiRouteReasonV1 {
  return {
    reasonCodes: [],
    corridorIds: [],
    blockerReasonCodes: [],
    unknownReasonCodes: [],
    governanceConsequenceCodes: []
  };
}

function findBottleneck(corridors: readonly DirectedStrategicTerrainCorridorV1[]): {
  readonly capacity: number;
  readonly corridorId: RouteCorridorId | null;
} {
  return corridors.reduce(
    (bottleneck, corridor) => {
      if (
        corridor.seasonalCapacity < bottleneck.capacity ||
        (corridor.seasonalCapacity === bottleneck.capacity &&
          (bottleneck.corridorId === null ||
            compareText(corridor.corridor.corridorId, bottleneck.corridorId) < 0))
      ) {
        return {
          capacity: corridor.seasonalCapacity,
          corridorId: corridor.corridor.corridorId
        };
      }
      return bottleneck;
    },
    { capacity: Number.MAX_SAFE_INTEGER, corridorId: null as RouteCorridorId | null }
  );
}

function collectAvailabilityReasonCodes(
  corridors: readonly StrategicTerrainRoutePreviewCorridorV1[],
  kind: "blocked" | "unknown"
): readonly string[] {
  const reasonCodes: string[] = [];
  for (const corridor of corridors) {
    if (corridor.availability.kind === kind) {
      reasonCodes.push(corridor.availability.reasonCode);
    }
  }
  return sortUniqueText(reasonCodes);
}

function createTieBreakEvidence(
  label: StrategicTerrainPathLabelV1 | undefined,
  candidateCount: number
): StrategicTerrainTieBreakEvidenceV1 {
  return {
    orderedBy: STRATEGIC_TERRAIN_TIE_BREAK_ORDER,
    candidateCount,
    selectedCorridorIds: label?.corridors.map((corridor) => corridor.corridor.corridorId) ?? [],
    selectedEndpointKeys:
      label?.corridors.map((corridor) => `${corridor.fromNodeId}>${corridor.toNodeId}`) ?? []
  };
}

function comparePathLabel(
  left: StrategicTerrainPathLabelV1,
  right: StrategicTerrainPathLabelV1
): number {
  return (
    left.totalCost - right.totalCost ||
    left.corridors.length - right.corridors.length ||
    compareCorridorIdSequence(left.corridors, right.corridors) ||
    compareEndpointSequence(left.corridors, right.corridors) ||
    compareText(left.nodeId, right.nodeId)
  );
}

function compareCorridorIdSequence(
  left: readonly DirectedStrategicTerrainCorridorV1[],
  right: readonly DirectedStrategicTerrainCorridorV1[]
): number {
  const length = left.length < right.length ? left.length : right.length;
  for (let index = 0; index < length; index += 1) {
    const leftCorridor = left[index];
    const rightCorridor = right[index];
    if (leftCorridor === undefined || rightCorridor === undefined) {
      return left.length - right.length;
    }
    const corridorDelta = compareText(
      leftCorridor.corridor.corridorId,
      rightCorridor.corridor.corridorId
    );
    if (corridorDelta !== 0) {
      return corridorDelta;
    }
  }

  return left.length - right.length;
}

function compareEndpointSequence(
  left: readonly DirectedStrategicTerrainCorridorV1[],
  right: readonly DirectedStrategicTerrainCorridorV1[]
): number {
  const length = left.length < right.length ? left.length : right.length;
  for (let index = 0; index < length; index += 1) {
    const leftCorridor = left[index];
    const rightCorridor = right[index];
    if (leftCorridor === undefined || rightCorridor === undefined) {
      return left.length - right.length;
    }
    const endpointDelta = compareText(
      `${leftCorridor.fromNodeId}>${leftCorridor.toNodeId}`,
      `${rightCorridor.fromNodeId}>${rightCorridor.toNodeId}`
    );
    if (endpointDelta !== 0) {
      return endpointDelta;
    }
  }

  return left.length - right.length;
}

function compareDirectedCorridor(
  left: DirectedStrategicTerrainCorridorV1,
  right: DirectedStrategicTerrainCorridorV1
): number {
  return (
    compareText(left.fromNodeId, right.fromNodeId) ||
    compareText(left.toNodeId, right.toNodeId) ||
    compareText(left.corridor.corridorId, right.corridor.corridorId)
  );
}

function compareHitCandidate(
  left: StrategicTerrainHitCandidateV1,
  right: StrategicTerrainHitCandidateV1
): number {
  return (
    left.priority - right.priority ||
    compareText(left.kind, right.kind) ||
    compareText(left.id, right.id)
  );
}

function neutralCorridorSeason(monthOfYear: number): RouteCorridorSeasonalModifierV1 {
  return {
    month: monthOfYear,
    seasonState: "unknown",
    travelCostMultiplierBps: 10_000,
    capacityMultiplierBps: 10_000,
    riskBps: 0,
    reasonCodes: ["strategic-terrain.season.neutral-fallback"]
  };
}

function routeAvailabilityReason(availability: RouteCorridorAvailabilityV1): string {
  switch (availability.kind) {
    case "open":
      return "strategic-terrain.corridor.open";
    case "blocked":
      return availability.reasonCode;
    case "unknown":
      return availability.reasonCode;
  }
}

function copyTerrainPatch(patch: TerrainPatchDefinitionV1): TerrainPatchDefinitionV1 {
  return {
    ...patch,
    polygon: patch.polygon.map(copyPoint),
    explanationTags: [...patch.explanationTags]
  };
}

function copyBarrierChannel(channel: BarrierChannelDefinitionV1): BarrierChannelDefinitionV1 {
  return {
    ...channel,
    points: channel.points.map(copyPoint),
    explanationTags: [...channel.explanationTags]
  };
}

function copyStrategicNode(node: StrategicNodeDefinitionV1): StrategicNodeDefinitionV1 {
  return {
    ...node,
    anchor: copyPoint(node.anchor),
    terrainPatchIds: [...node.terrainPatchIds],
    barrierChannelIds: [...node.barrierChannelIds],
    governanceFootprintIds: [...node.governanceFootprintIds],
    explanationTags: [...node.explanationTags]
  };
}

function copyRouteCorridor(corridor: RouteCorridorDefinitionV1): RouteCorridorDefinitionV1 {
  return {
    ...corridor,
    terrainPatchIds: [...corridor.terrainPatchIds],
    barrierChannelIds: [...corridor.barrierChannelIds],
    governanceFootprintIds: [...corridor.governanceFootprintIds],
    seasonality: corridor.seasonality.map((season) => ({
      ...season,
      reasonCodes: [...season.reasonCodes]
    })),
    availability: copyAvailability(corridor.availability),
    polyline: corridor.polyline.map(copyPoint),
    explanationTags: [...corridor.explanationTags]
  };
}

function copyDistrictGovernanceFootprint(
  footprint: DistrictGovernanceFootprintDefinitionV1
): DistrictGovernanceFootprintDefinitionV1 {
  return {
    ...footprint,
    polygon: footprint.polygon.map(copyPoint),
    governanceTags: [...footprint.governanceTags],
    consequenceTags: [...footprint.consequenceTags]
  };
}

function copyAvailability(availability: RouteCorridorAvailabilityV1): RouteCorridorAvailabilityV1 {
  switch (availability.kind) {
    case "open":
      return { kind: "open" };
    case "blocked":
      return { kind: "blocked", reasonCode: availability.reasonCode };
    case "unknown":
      return { kind: "unknown", reasonCode: availability.reasonCode };
  }
}

function pointTouchesPolyline(
  point: StrategicTerrainPointV1,
  polyline: readonly StrategicTerrainPointV1[]
): boolean {
  for (let index = 1; index < polyline.length; index += 1) {
    const previous = polyline[index - 1];
    const current = polyline[index];
    if (
      previous !== undefined &&
      current !== undefined &&
      pointOnSegment(point, previous, current)
    ) {
      return true;
    }
  }
  return false;
}

function pointInPolygon(
  point: StrategicTerrainPointV1,
  polygon: readonly StrategicTerrainPointV1[]
): boolean {
  if (polygon.length < 3) {
    return false;
  }

  let inside = false;
  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index, index += 1
  ) {
    const current = polygon[index];
    const previous = polygon[previousIndex];
    if (current === undefined || previous === undefined) {
      continue;
    }
    if (pointOnSegment(point, previous, current)) {
      return true;
    }
    const crossesY = current.y > point.y !== previous.y > point.y;
    if (!crossesY) {
      continue;
    }
    const intersectionX =
      ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;
    if (point.x < intersectionX) {
      inside = !inside;
    }
  }

  return inside;
}

function pointOnSegment(
  point: StrategicTerrainPointV1,
  start: StrategicTerrainPointV1,
  end: StrategicTerrainPointV1
): boolean {
  const cross = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y);
  if (cross !== 0) {
    return false;
  }
  return (
    point.x >= minimum(start.x, end.x) &&
    point.x <= maximum(start.x, end.x) &&
    point.y >= minimum(start.y, end.y) &&
    point.y <= maximum(start.y, end.y)
  );
}

function pointsEqual(left: StrategicTerrainPointV1, right: StrategicTerrainPointV1): boolean {
  return left.x === right.x && left.y === right.y;
}

function copyPoint(point: StrategicTerrainPointV1): StrategicTerrainPointV1 {
  return { x: point.x, y: point.y };
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

function minimum(left: number, right: number): number {
  return left < right ? left : right;
}

function maximum(left: number, right: number): number {
  return left > right ? left : right;
}

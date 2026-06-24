import { getGameCalendarDate } from "./scheduler-v0.ts";
import {
  parseDistrictId,
  type DistrictId,
  type GameDay,
  type M2RouteKindV0,
  type M2RouteTransportEdgeStateV0,
  type M2SeasonalMonthStateV0,
  type RouteId,
  type WorldStateV0
} from "./world-state-v0.ts";

export interface M2TransportRoutePreviewInputV0 {
  readonly originDistrictId: DistrictId;
  readonly destinationDistrictId: DistrictId;
  readonly stockAmount: number;
  readonly day: GameDay;
}

export type M2TransportRoutePreviewV0 =
  | {
      readonly status: "unreachable";
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly monthOfYear: number;
      readonly edges: readonly [];
    }
  | {
      readonly status: "capacity-exceeded" | "reachable";
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly monthOfYear: number;
      readonly totalCost: number;
      readonly bottleneckCapacity: number;
      readonly edges: readonly M2TransportRoutePreviewEdgeV0[];
    };

export interface M2TransportRoutePreviewEdgeV0 {
  readonly routeId: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly routeKind: M2RouteKindV0;
  readonly baseTravelCost: number;
  readonly seasonalCost: number;
  readonly baseCapacity: number;
  readonly seasonalCapacity: number;
  readonly stockAmount: number;
  readonly remainingCapacityAfterStock: number;
}

interface DirectedM2TransportEdgeV0 {
  readonly route: M2RouteTransportEdgeStateV0;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly seasonalCost: number;
  readonly seasonalCapacity: number;
}

interface RouteLabelV0 {
  readonly districtId: DistrictId;
  readonly totalCost: number;
  readonly edges: readonly DirectedM2TransportEdgeV0[];
}

export function previewM2TransportRouteV0(
  world: WorldStateV0,
  input: M2TransportRoutePreviewInputV0
): M2TransportRoutePreviewV0 {
  const monthOfYear = getGameCalendarDate(input.day).monthOfYear;
  const transport = world.state.m2?.transport;
  if (transport === undefined || input.originDistrictId === input.destinationDistrictId) {
    return {
      status: "unreachable",
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      edges: []
    };
  }

  const directedEdges = createDirectedEdges(world, monthOfYear);
  const best = findLowestCostPath({
    originDistrictId: input.originDistrictId,
    destinationDistrictId: input.destinationDistrictId,
    directedEdges
  });
  if (best === undefined) {
    return {
      status: "unreachable",
      originDistrictId: input.originDistrictId,
      destinationDistrictId: input.destinationDistrictId,
      stockAmount: input.stockAmount,
      monthOfYear,
      edges: []
    };
  }

  const bottleneckCapacity = best.edges.reduce(
    (capacity, edge) => (edge.seasonalCapacity < capacity ? edge.seasonalCapacity : capacity),
    Number.MAX_SAFE_INTEGER
  );
  const edges = best.edges.map((edge) => ({
    routeId: edge.route.routeId,
    fromDistrictId: edge.fromDistrictId,
    toDistrictId: edge.toDistrictId,
    routeKind: edge.route.routeKind,
    baseTravelCost: edge.route.baseTravelCost,
    seasonalCost: edge.seasonalCost,
    baseCapacity: edge.route.baseCapacity,
    seasonalCapacity: edge.seasonalCapacity,
    stockAmount: input.stockAmount,
    remainingCapacityAfterStock:
      edge.seasonalCapacity >= input.stockAmount ? edge.seasonalCapacity - input.stockAmount : 0
  }));

  return {
    status: input.stockAmount <= bottleneckCapacity ? "reachable" : "capacity-exceeded",
    originDistrictId: input.originDistrictId,
    destinationDistrictId: input.destinationDistrictId,
    stockAmount: input.stockAmount,
    monthOfYear,
    totalCost: best.totalCost,
    bottleneckCapacity,
    edges
  };
}

function createDirectedEdges(
  world: WorldStateV0,
  monthOfYear: number
): readonly DirectedM2TransportEdgeV0[] {
  const transport = world.state.m2?.transport;
  if (transport === undefined) {
    return [];
  }

  const curveIdByDistrictId = new Map<number, number>();
  for (const entry of transport.districtSeasonality) {
    curveIdByDistrictId.set(entry.districtId, entry.regionalCurveId);
  }

  const monthByCurveId = new Map<number, M2SeasonalMonthStateV0>();
  for (const curve of transport.regionalCurves) {
    const month = curve.monthlyValues[monthOfYear - 1];
    if (month !== undefined) {
      monthByCurveId.set(curve.id, month);
    }
  }

  const edges: DirectedM2TransportEdgeV0[] = [];
  for (const route of transport.routes) {
    const seasonal = calculateSeasonalRouteValues({
      route,
      fromMonth: monthByCurveId.get(curveIdByDistrictId.get(route.fromDistrictId) ?? 0),
      toMonth: monthByCurveId.get(curveIdByDistrictId.get(route.toDistrictId) ?? 0)
    });
    edges.push({
      route,
      fromDistrictId: route.fromDistrictId,
      toDistrictId: route.toDistrictId,
      seasonalCost: seasonal.cost,
      seasonalCapacity: seasonal.capacity
    });
    edges.push({
      route,
      fromDistrictId: route.toDistrictId,
      toDistrictId: route.fromDistrictId,
      seasonalCost: seasonal.cost,
      seasonalCapacity: seasonal.capacity
    });
  }

  return edges.sort(compareDirectedEdge);
}

function calculateSeasonalRouteValues(input: {
  readonly route: M2RouteTransportEdgeStateV0;
  readonly fromMonth: M2SeasonalMonthStateV0 | undefined;
  readonly toMonth: M2SeasonalMonthStateV0 | undefined;
}): { readonly cost: number; readonly capacity: number } {
  const fromMonth = input.fromMonth ?? neutralMonth();
  const toMonth = input.toMonth ?? neutralMonth();
  const roadTravelCostBps = averageRoundedDown(
    fromMonth.roadTravelCostBps,
    toMonth.roadTravelCostBps
  );
  const riverNavigabilityBps = averageRoundedDown(
    fromMonth.riverNavigabilityBps,
    toMonth.riverNavigabilityBps
  );
  const monsoonIntensityBps = averageRoundedDown(
    fromMonth.monsoonIntensityBps,
    toMonth.monsoonIntensityBps
  );

  switch (input.route.routeKind) {
    case "road":
      return {
        cost: ceilDivide(input.route.baseTravelCost * roadTravelCostBps, 10_000),
        capacity: floorDivide(
          input.route.baseCapacity * maximum(1, 20_000 - roadTravelCostBps),
          10_000
        )
      };
    case "river":
      return {
        cost: ceilDivide(input.route.baseTravelCost * 32_000, maximum(1, riverNavigabilityBps)),
        capacity: floorDivide(input.route.baseCapacity * riverNavigabilityBps, 10_000)
      };
    case "coast":
      return {
        cost: input.route.baseTravelCost * 10,
        capacity: floorDivide(
          input.route.baseCapacity * maximum(1, 12_000 - floorDivide(monsoonIntensityBps, 3)),
          10_000
        )
      };
  }
}

function findLowestCostPath(input: {
  readonly originDistrictId: DistrictId;
  readonly destinationDistrictId: DistrictId;
  readonly directedEdges: readonly DirectedM2TransportEdgeV0[];
}): RouteLabelV0 | undefined {
  const bestByDistrictId = new Map<number, RouteLabelV0>();
  const unsettled: RouteLabelV0[] = [
    {
      districtId: input.originDistrictId,
      totalCost: 0,
      edges: []
    }
  ];

  while (unsettled.length > 0) {
    unsettled.sort(compareRouteLabel);
    const current = unsettled.shift();
    if (current === undefined) {
      return undefined;
    }

    const knownBest = bestByDistrictId.get(current.districtId);
    if (knownBest !== undefined && compareRouteLabel(knownBest, current) <= 0) {
      continue;
    }

    bestByDistrictId.set(current.districtId, current);
    if (current.districtId === input.destinationDistrictId) {
      return current;
    }

    const usedRouteIds = new Set(current.edges.map((edge) => edge.route.routeId));
    for (const edge of input.directedEdges) {
      if (edge.fromDistrictId !== current.districtId || usedRouteIds.has(edge.route.routeId)) {
        continue;
      }

      const candidate = {
        districtId: edge.toDistrictId,
        totalCost: current.totalCost + edge.seasonalCost,
        edges: [...current.edges, edge]
      };
      const existing = bestByDistrictId.get(candidate.districtId);
      if (existing === undefined || compareRouteLabel(candidate, existing) < 0) {
        unsettled.push(candidate);
      }
    }
  }

  return undefined;
}

function compareRouteLabel(left: RouteLabelV0, right: RouteLabelV0): number {
  return (
    left.totalCost - right.totalCost ||
    left.edges.length - right.edges.length ||
    compareRouteIdSequence(left.edges, right.edges) ||
    left.districtId - right.districtId
  );
}

function compareRouteIdSequence(
  left: readonly DirectedM2TransportEdgeV0[],
  right: readonly DirectedM2TransportEdgeV0[]
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
    const directionDelta = leftEdge.fromDistrictId - rightEdge.fromDistrictId;
    if (directionDelta !== 0) {
      return directionDelta;
    }
  }

  return left.length - right.length;
}

function compareDirectedEdge(
  left: DirectedM2TransportEdgeV0,
  right: DirectedM2TransportEdgeV0
): number {
  return (
    left.fromDistrictId - right.fromDistrictId ||
    left.toDistrictId - right.toDistrictId ||
    left.route.routeId - right.route.routeId
  );
}

function neutralMonth(): M2SeasonalMonthStateV0 {
  return {
    month: 1,
    monsoonIntensityBps: 0,
    agricultureWorkBps: 10_000,
    riverNavigabilityBps: 10_000,
    roadTravelCostBps: 10_000
  };
}

function averageRoundedDown(left: number, right: number): number {
  return floorDivide(left + right, 2);
}

function ceilDivide(dividend: number, divisor: number): number {
  const adjusted = dividend + divisor - 1;
  return floorDivide(adjusted, divisor);
}

function floorDivide(dividend: number, divisor: number): number {
  return (dividend - (dividend % divisor)) / divisor;
}

function maximum(left: number, right: number): number {
  return left > right ? left : right;
}

export function parseM2TransportDistrictId(value: unknown): DistrictId {
  return parseDistrictId(value);
}

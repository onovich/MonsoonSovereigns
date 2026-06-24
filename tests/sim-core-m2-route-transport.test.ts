import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import { parseM2WorldFixtureSourceV0 } from "../packages/content-schema/src/index";
import { parseRuntimeM2WorldContentPackV0 } from "../packages/content-runtime/src/index";
import {
  advanceWorldByGameDays,
  bootSimulationV1,
  querySimulationV1,
  validateWorldStateV0,
  type SimulationRuntimeV1
} from "../packages/sim-core/src/index";

import type { GameQueryV1 } from "../packages/protocol/src/index";

const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);

describe("M2-ROUTE-TRANSPORT-001 route, transport, and seasonal route choice", () => {
  test("boots compiled M2 route transport state with explicit route costs and capacities", async () => {
    const runtime = await bootM2Runtime();
    const transport = runtime.world.state.m2?.transport;

    expect(transport).toBeDefined();
    if (transport === undefined) {
      throw new Error("Expected M2 transport state.");
    }

    expect(transport.routes).toHaveLength(42);
    expect(transport.regionalCurves).toHaveLength(4);
    expect(transport.districtSeasonality).toHaveLength(30);
    expect(transport.routes[0]).toMatchObject({
      routeId: 1,
      fromDistrictId: 1,
      toDistrictId: 2,
      routeKind: "road",
      baseTravelCost: 10,
      baseCapacity: 100
    });
    expect(transport.routes[30]).toMatchObject({
      routeId: 31,
      fromDistrictId: 1,
      toDistrictId: 6,
      routeKind: "river",
      baseTravelCost: 8,
      baseCapacity: 180
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("seasonal curves change a fixture route choice between road and river", async () => {
    const dryRuntime = await bootM2Runtime();
    const wetRuntime = {
      ...(await bootM2Runtime()),
      world: advanceWorldByGameDays((await bootM2Runtime()).world, 180)
    };

    const dryRoute = previewRoute(dryRuntime, "m2.route.dry", 1, 6, 40);
    const wetRoute = previewRoute(wetRuntime, "m2.route.wet", 1, 6, 40);

    expect(dryRoute.status).toBe("ok");
    expect(wetRoute.status).toBe("ok");
    if (
      dryRoute.status !== "ok" ||
      wetRoute.status !== "ok" ||
      dryRoute.result.kind !== "sim.preview-m2-transport-route" ||
      wetRoute.result.kind !== "sim.preview-m2-transport-route"
    ) {
      throw new Error("Expected M2 transport route previews to succeed.");
    }

    expect(dryRoute.result.monthOfYear).toBe(1);
    expect(wetRoute.result.monthOfYear).toBe(7);
    expect(dryRoute.result.route.status).toBe("reachable");
    expect(wetRoute.result.route.status).toBe("reachable");
    if (
      dryRoute.result.route.status !== "reachable" ||
      wetRoute.result.route.status !== "reachable"
    ) {
      throw new Error("Expected reachable M2 routes.");
    }

    expect(dryRoute.result.route.edges.map((edge) => edge.routeKind)).toEqual([
      "road",
      "road",
      "road",
      "road",
      "road"
    ]);
    expect(wetRoute.result.route.edges.map((edge) => edge.routeKind)).toEqual(["river"]);
    expect(wetRoute.result.route.totalCost).toBeLessThan(dryRoute.result.route.totalCost);
    expect(wetRoute.result.route.totalCost).toBeLessThan(70);
  });

  test("transport preview preserves capacity and duplicate-edge invariants without mutating state", async () => {
    const runtime = await bootM2Runtime();
    const hashBefore = runtime.world.meta.stateHash;

    const first = previewRoute(runtime, "m2.route.capacity.first", 1, 6, 40);
    const second = previewRoute(runtime, "m2.route.capacity.second", 1, 6, 40);

    expect(first.status).toBe("ok");
    expect(second.status).toBe("ok");
    if (
      first.status !== "ok" ||
      second.status !== "ok" ||
      first.result.kind !== "sim.preview-m2-transport-route" ||
      second.result.kind !== "sim.preview-m2-transport-route" ||
      first.result.route.status !== "reachable" ||
      second.result.route.status !== "reachable"
    ) {
      throw new Error("Expected reachable M2 route previews.");
    }

    expect(second.result.route).toEqual(first.result.route);
    expect(runtime.world.meta.stateHash).toBe(hashBefore);

    const usedRouteIds = first.result.route.edges.map((edge) => edge.routeId);
    expect(new Set(usedRouteIds).size).toBe(usedRouteIds.length);
    for (const edge of first.result.route.edges) {
      expect(edge.seasonalCapacity).toBeGreaterThanOrEqual(0);
      expect(edge.remainingCapacityAfterStock).toBeGreaterThanOrEqual(0);
      expect(edge.stockAmount).toBe(40);
    }
    expect(first.result.route.bottleneckCapacity).toBeGreaterThanOrEqual(40);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("transport preview rejects stock movement over the seasonal bottleneck without state mutation", async () => {
    const runtime = await bootM2Runtime();
    const hashBefore = runtime.world.meta.stateHash;
    const overCapacity = previewRoute(runtime, "m2.route.capacity.rejected", 1, 6, 1_000);

    expect(overCapacity.status).toBe("ok");
    if (
      overCapacity.status !== "ok" ||
      overCapacity.result.kind !== "sim.preview-m2-transport-route"
    ) {
      throw new Error("Expected M2 transport route preview result.");
    }

    expect(overCapacity.result.route.status).toBe("capacity-exceeded");
    expect(runtime.world.meta.stateHash).toBe(hashBefore);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });
});

async function bootM2Runtime(): Promise<SimulationRuntimeV1> {
  const sourceText = await readFile(m2FixtureUrl, "utf8");
  const source = parseM2WorldFixtureSourceV0(JSON.parse(sourceText) as unknown);
  const compiled = compileContentPackV0OrThrow(source);
  if (compiled.kind !== "runtime-m2-world-content-pack-v0") {
    throw new Error("Expected compiled M2 runtime world content pack.");
  }
  const runtimeContentPack = parseRuntimeM2WorldContentPackV0(structuredClone(compiled));
  const boot = bootSimulationV1({
    protocolVersion: 1,
    source: "runtime-content-pack",
    seed: 1531,
    runtimeContentPack
  });
  if (boot.status !== "booted") {
    throw new Error(`Expected M2 runtime boot, got ${boot.error.code}.`);
  }

  return boot.runtime;
}

function previewRoute(
  runtime: SimulationRuntimeV1,
  queryId: string,
  originDistrictId: number,
  destinationDistrictId: number,
  stockAmount: number
): ReturnType<typeof querySimulationV1> {
  const query: GameQueryV1 = {
    schemaVersion: 1,
    kind: "sim.preview-m2-transport-route",
    payload: {
      queryId,
      originDistrictId,
      destinationDistrictId,
      stockAmount
    }
  };

  return querySimulationV1(runtime, query);
}

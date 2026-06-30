import { readFile } from "node:fs/promises";

import fc from "fast-check";
import { describe, expect, test } from "vitest";

import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import { parseM2WorldFixtureSourceV0 } from "../packages/content-schema/src/index";
import { parseRuntimeM2WorldContentPackV0 } from "../packages/content-runtime/src/index";
import {
  advanceWorldByGameDays,
  bootSimulationV1,
  parsePopulationGroupId,
  querySimulationV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);
// Keep the full property workload; advancing 24 generated worlds can exceed Vitest's 5s default.
const M2_ECONOMY_PROPERTY_TIMEOUT_MS = 15_000;

describe("M2-ECON-POP-001 agriculture, population, labor, grain, and cash scaffolding", () => {
  test("boots the explicit 14 District/6 Settlement fixture with explicit M2 economy state", async () => {
    const runtime = await bootM2Runtime();
    const m2 = runtime.world.state.m2;

    expect(m2).toBeDefined();
    if (m2 === undefined) {
      throw new Error("Expected M2 state.");
    }

    expect(runtime.world.definitions.districts).toHaveLength(14);
    expect(runtime.world.definitions.settlements).toHaveLength(6);
    expect(runtime.world.definitions.topology?.districts).toHaveLength(14);
    expect(runtime.world.definitions.topology?.routeEdges).toHaveLength(25);
    expect(m2.schemaVersion).toBe(1);
    expect(m2.populationGroups).toHaveLength(14);
    expect(m2.agriculture.districts).toHaveLength(14);
    expect(m2.market.districts).toHaveLength(14);
    expect(m2.populationGroups[0]).toMatchObject({
      id: parsePopulationGroupId(1),
      districtId: 1,
      totalPeople: 1000,
      workingPeople: 500,
      dependentPeople: 500,
      availableLabor: 500,
      grainStock: 3000,
      cashStock: 1000,
      committedLabor: []
    });
    expect(m2.agriculture.districts[0]).toMatchObject({
      districtId: 1,
      phase: "fallow",
      accumulatedFarmLabor: 0,
      lastHarvestGrain: 0
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("accepts player and AI labor mobilization through the same command path", async () => {
    const playerRuntime = await bootM2Runtime();
    const aiRuntime = await bootM2Runtime();

    const player = submitCommandV1(
      playerRuntime,
      commitLaborCommand("m2.labor.player", "player", playerRuntime, 1, 40, 20)
    );
    const ai = submitCommandV1(
      aiRuntime,
      commitLaborCommand("m2.labor.ai", "ai", aiRuntime, 1, 40, 20)
    );

    expect(player.result.status).toBe("accepted");
    expect(ai.result.status).toBe("accepted");
    expect(player.runtime.world.meta.stateHash).toBe(ai.runtime.world.meta.stateHash);
    expect(player.result).toMatchObject({
      events: [
        {
          kind: "sim.labor-committed",
          populationGroupId: 1,
          laborAmount: 40,
          purpose: "mobilized"
        }
      ],
      deltas: [
        {
          kind: "state.m2-population-group-updated",
          populationGroupId: 1,
          availableLabor: 460
        }
      ]
    });
  });

  test("rejects labor commands with structured reason codes and does not mutate state", async () => {
    const runtime = await bootM2Runtime();
    const hashBefore = runtime.world.meta.stateHash;

    const result = submitCommandV1(
      runtime,
      commitLaborCommand("m2.labor.too-much", "player", runtime, 1, 10_000, 20)
    );

    expect(result.result).toMatchObject({
      status: "rejected",
      error: { code: "insufficient-labor", path: "payload.laborAmount" }
    });
    expect(result.runtime.world.meta.stateHash).toBe(hashBefore);
  });

  test("mobilizing labor during farm timing reduces the next harvest in the M2 fixture", async () => {
    const baselineRuntime = await bootM2Runtime();
    const mobilizedRuntime = await bootM2Runtime();

    const committed = submitCommandV1(
      mobilizedRuntime,
      commitLaborCommand("m2.labor.planting-mobilization", "player", mobilizedRuntime, 1, 200, 240)
    );
    expect(committed.result.status).toBe("accepted");

    const baselineWorld = advanceWorldByGameDays(baselineRuntime.world, 300);
    const mobilizedWorld = advanceWorldByGameDays(committed.runtime.world, 300);
    const baselineHarvest = baselineWorld.state.m2?.agriculture.districts.find(
      (entry) => entry.districtId === 1
    )?.lastHarvestGrain;
    const mobilizedHarvest = mobilizedWorld.state.m2?.agriculture.districts.find(
      (entry) => entry.districtId === 1
    )?.lastHarvestGrain;

    expect(baselineHarvest).toBeGreaterThan(0);
    expect(mobilizedHarvest).toBeGreaterThan(0);
    expect(mobilizedHarvest).toBeLessThan(baselineHarvest);
    expect(validateWorldStateV0(mobilizedWorld)).toEqual([]);
  });

  test(
    "property invariants preserve non-negative population, labor, grain, and cash",
    async () => {
      const runtime = await bootM2Runtime();

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 420 }),
          fc.integer({ min: 1, max: 14 }),
          fc.integer({ min: 1, max: 80 }),
          (days, groupId, laborAmount) => {
            const advancedWorld = advanceWorldByGameDays(runtime.world, days);
            const advancedRuntime = {
              ...runtime,
              world: advancedWorld,
              acceptedCommandIds: [],
              commandTail: [],
              eventTail: []
            };
            const submitted = submitCommandV1(
              advancedRuntime,
              commitLaborCommand(
                "m2.labor.property",
                "ai",
                advancedRuntime,
                groupId,
                laborAmount,
                30
              )
            );
            const nextWorld =
              submitted.result.status === "accepted" ? submitted.runtime.world : advancedWorld;
            const m2 = nextWorld.state.m2;
            expect(m2).toBeDefined();
            if (m2 === undefined) {
              throw new Error("Expected M2 state.");
            }

            for (const group of m2.populationGroups) {
              const committedLabor = group.committedLabor.reduce(
                (sum, entry) => sum + entry.laborAmount,
                0
              );
              expect(group.totalPeople).toBe(group.workingPeople + group.dependentPeople);
              expect(group.availableLabor + committedLabor).toBe(group.workingPeople);
              expect(group.availableLabor).toBeGreaterThanOrEqual(0);
              expect(group.grainStock).toBeGreaterThanOrEqual(0);
              expect(group.cashStock).toBeGreaterThanOrEqual(0);
            }

            for (const district of m2.market.districts) {
              expect(district.cashFlow.cumulativeMobilizationCost).toBeGreaterThanOrEqual(0);
              expect(district.grainFlow.lastHarvestDelta).toBeGreaterThanOrEqual(0);
            }

            expect(validateWorldStateV0(nextWorld)).toEqual([]);
          }
        ),
        { numRuns: 24, seed: 1531 }
      );
    },
    M2_ECONOMY_PROPERTY_TIMEOUT_MS
  );

  test("M2 economy query returns a read model instead of mutable authoritative state", async () => {
    const runtime = await bootM2Runtime();
    const query = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m2-economy-summaries"
    });

    expect(query.status).toBe("ok");
    if (query.status !== "ok" || query.result.kind !== "sim.list-m2-economy-summaries") {
      throw new Error("Expected M2 economy query to succeed.");
    }

    expect(query.result.districts).toHaveLength(14);
    expect(query.result.districts[0]).toMatchObject({
      districtId: 1,
      population: 1000,
      availableLabor: 500,
      grainStock: 3000,
      cashStock: 1000,
      agriculturePhase: "fallow"
    });
    expect(query.result).not.toHaveProperty("state");
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

function commitLaborCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  populationGroupId: number,
  laborAmount: number,
  durationDays: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.commit-labor",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m2` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      populationGroupId,
      purpose: "mobilized",
      laborAmount,
      durationDays
    }
  };
}

import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { compileContentPackV0, compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import {
  parseM1GraphFixtureSourceV0,
  parseM2WorldFixtureSourceV0,
  type M1GraphFixtureSourceV0
} from "../packages/content-schema/src/index";

const fixtureUrl = new URL("../content-source/m1-fixtures/abstract-graph-30.json", import.meta.url);
const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);

describe("SIM-006 Content Compiler v0", () => {
  test("compiles the valid synthetic 30-node fixture into stable runtime content", async () => {
    const source = await readFixture();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.schemaVersion).toBe(1);
    expect(pack.kind).toBe("runtime-content-pack-v0");
    expect(pack.fixtureId).toBe("m1.abstract-graph-30");
    expect(pack.manifest.fixtureKind).toBe("synthetic-kernel-graph");
    expect(pack.manifest.manifestHash).toMatch(/^[0-9a-f]{8}$/u);
    expect(pack.manifest.syntheticScope).toBe("deterministic-kernel-only");
    expect(pack.manifest.nodeCount).toBe(30);
    expect(pack.manifest.edgeCount).toBeGreaterThanOrEqual(60);
    expect(pack.nodes).toHaveLength(30);
    expect(pack.edges.length).toBeGreaterThanOrEqual(60);
    expect(pack.nodes[0]).toMatchObject({
      id: 1,
      sourceId: "node-001",
      displayNameKey: "content.m1.abstract.node_001"
    });
    expect(pack.nodes.at(-1)).toMatchObject({
      id: 30,
      sourceId: "node-030",
      displayNameKey: "content.m1.abstract.node_030"
    });
    expect(pack.edges[0]).toMatchObject({
      id: 1,
      sourceId: "edge-001",
      fromNodeId: 1,
      toNodeId: 2,
      direction: "bidirectional"
    });
  });

  test("fails bad references", async () => {
    const source = await readFixture();
    const badSource = {
      ...source,
      edges: source.edges.map((edge) =>
        edge.sourceId === "edge-001" ? { ...edge, to: "node-999" } : edge
      )
    };

    expect(compileContentPackV0(badSource).errors).toContainEqual(
      expect.objectContaining({ code: "bad-reference", path: "edges[0].to" })
    );
  });

  test("fails duplicate node and edge IDs", async () => {
    const source = await readFixture();
    const duplicateIds = {
      ...source,
      nodes: source.nodes.map((node, index) =>
        index === 1 ? { ...node, sourceId: "node-001" } : node
      ),
      edges: source.edges.map((edge, index) =>
        index === 1 ? { ...edge, sourceId: "edge-001" } : edge
      )
    };

    const result = compileContentPackV0(duplicateIds);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-id", path: "nodes[1].sourceId" }),
        expect.objectContaining({ code: "duplicate-id", path: "edges[1].sourceId" })
      ])
    );
  });

  test("fails duplicate routes using bidirectional edge semantics", async () => {
    const source = await readFixture();
    const duplicateRoutes = {
      ...source,
      edges: source.edges.map((edge, index) =>
        index === 1
          ? {
              ...edge,
              from: "node-002",
              to: "node-001",
              direction: "bidirectional" as const
            }
          : edge
      )
    };

    expect(compileContentPackV0(duplicateRoutes).errors).toContainEqual(
      expect.objectContaining({ code: "duplicate-route", path: "edges[1]" })
    );
  });

  test("fails unstable source ordering", async () => {
    const source = await readFixture();
    const unstableOrder = {
      ...source,
      nodes: [source.nodes[1], source.nodes[0], ...source.nodes.slice(2)]
    };

    expect(compileContentPackV0(unstableOrder).errors).toContainEqual(
      expect.objectContaining({ code: "unstable-order", path: "nodes[1].sourceId" })
    );
  });

  test("fails isolated unmarked nodes", async () => {
    const source = await readFixture();
    const isolatedUnmarked = {
      ...source,
      edges: source.edges.filter((edge) => edge.from !== "node-030" && edge.to !== "node-030")
    };

    expect(compileContentPackV0(isolatedUnmarked).errors).toContainEqual(
      expect.objectContaining({ code: "isolated-node", path: "nodes[29].isolation" })
    );
  });

  test("fails invalid source schema", () => {
    expect(compileContentPackV0({ schemaVersion: 1 }).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "kind" }),
        expect.objectContaining({ code: "invalid-schema", path: "nodes" }),
        expect.objectContaining({ code: "invalid-schema", path: "edges" })
      ])
    );
  });

  test("repeated compiles produce the same manifest hash and runtime order", async () => {
    const source = await readFixture();
    const first = compileContentPackV0OrThrow(source);
    const second = compileContentPackV0OrThrow(structuredClone(source));

    expect(second.manifest.manifestHash).toBe(first.manifest.manifestHash);
    expect(second.nodes.map((node) => node.sourceId)).toEqual(
      first.nodes.map((node) => node.sourceId)
    );
    expect(second.edges.map((edge) => edge.sourceId)).toEqual(
      first.edges.map((edge) => edge.sourceId)
    );
  });
});

async function readFixture(): Promise<M1GraphFixtureSourceV0> {
  const text = await readFile(fixtureUrl, "utf8");
  return parseM1GraphFixtureSourceV0(JSON.parse(text) as unknown);
}

describe("M2 Content Compiler v0", () => {
  test("compiles the M2 prototype world fixture with stable runtime definitions", async () => {
    const source = await readM2Fixture();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.kind).toBe("runtime-m2-world-content-pack-v0");
    if (pack.kind !== "runtime-m2-world-content-pack-v0") {
      throw new Error("Expected M2 world runtime pack.");
    }
    expect(pack.fixtureId).toBe("m2.prototype-world-30-districts");
    expect(pack.manifest.fixtureKind).toBe("prototype-world-fixture");
    expect(pack.manifest.syntheticScope).toBe("m2-prototype-only");
    expect(pack.manifest.historicity).toBe("FICTIONAL");
    expect(pack.manifest.districtCount).toBe(30);
    expect(pack.manifest.settlementCount).toBe(10);
    expect(pack.manifest.regionalSeasonalCurveCount).toBeGreaterThanOrEqual(4);
    expect(pack.districts).toHaveLength(30);
    expect(pack.settlements).toHaveLength(10);
    expect(pack.regionalSeasonalCurves.every((curve) => curve.monthlyValues.length === 12)).toBe(
      true
    );
    expect(pack.districts[0]).toMatchObject({
      id: 1,
      sourceId: "district-001",
      displayNameKey: "content.m2.prototype.district_001",
      regionalCurveId: 1,
      mapGeometryId: 1
    });
  });

  test("fails M2 district, settlement, route, curve, and map-geometry references at compile time", async () => {
    const source = await readM2Fixture();
    const badSource = {
      ...source,
      districts: source.districts.map((district, index) =>
        index === 0 ? { ...district, regionalCurveId: "curve-999" } : district
      ),
      settlements: source.settlements.map((settlement, index) =>
        index === 0 ? { ...settlement, districtId: "district-999" } : settlement
      ),
      routes: source.routes.map((route, index) =>
        index === 0 ? { ...route, toDistrictId: "district-999" } : route
      ),
      mapGeometries: source.mapGeometries.map((geometry, index) =>
        index === 0 ? { ...geometry, ownerId: "district-999" } : geometry
      )
    };

    const result = compileContentPackV0(badSource);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "bad-reference", path: "districts[0].regionalCurveId" }),
        expect.objectContaining({ code: "bad-reference", path: "settlements[0].districtId" }),
        expect.objectContaining({ code: "bad-reference", path: "routes[0].toDistrictId" }),
        expect.objectContaining({ code: "bad-reference", path: "mapGeometries[0].ownerId" })
      ])
    );
  });

  test("fails M2 seasonal curves that do not provide months 1 through 12 in order", async () => {
    const source = await readM2Fixture();
    const badSource = {
      ...source,
      regionalSeasonalCurves: source.regionalSeasonalCurves.map((curve, index) =>
        index === 0
          ? {
              ...curve,
              monthlyValues: curve.monthlyValues.map((value, valueIndex) =>
                valueIndex === 1 ? { ...value, month: 1 } : value
              )
            }
          : curve
      )
    };

    expect(compileContentPackV0(badSource).errors).toContainEqual(
      expect.objectContaining({
        code: "invalid-seasonal-curve",
        path: "regionalSeasonalCurves[0].monthlyValues[1].month"
      })
    );
  });

  test("repeated M2 compiles produce the same manifest hash and runtime order", async () => {
    const source = await readM2Fixture();
    const first = compileContentPackV0OrThrow(source);
    const second = compileContentPackV0OrThrow(structuredClone(source));

    expect(second.manifest.manifestHash).toBe(first.manifest.manifestHash);
    if (
      first.kind !== "runtime-m2-world-content-pack-v0" ||
      second.kind !== "runtime-m2-world-content-pack-v0"
    ) {
      throw new Error("Expected M2 world runtime packs.");
    }
    expect(second.districts.map((district) => district.sourceId)).toEqual(
      first.districts.map((district) => district.sourceId)
    );
    expect(second.settlements.map((settlement) => settlement.sourceId)).toEqual(
      first.settlements.map((settlement) => settlement.sourceId)
    );
    expect(second.regionalSeasonalCurves.map((curve) => curve.sourceId)).toEqual(
      first.regionalSeasonalCurves.map((curve) => curve.sourceId)
    );
  });
});

async function readM2Fixture() {
  const text = await readFile(m2FixtureUrl, "utf8");
  return parseM2WorldFixtureSourceV0(JSON.parse(text) as unknown);
}

import { describe, expect, test } from "vitest";

import {
  createRuntimeContentPackIndexV0,
  createRuntimeM2WorldContentPackIndexV0,
  parseRuntimeM2WorldContentPackV0,
  parseRuntimeContentPackV0
} from "../packages/content-runtime/src/index";

describe("SIM-006 runtime content pack", () => {
  test("parses runtime content without filesystem access or display-name lookup", () => {
    const pack = parseRuntimeContentPackV0({
      schemaVersion: 1,
      kind: "runtime-content-pack-v0",
      fixtureId: "m1.runtime-test",
      manifest: {
        schemaVersion: 1,
        fixtureId: "m1.runtime-test",
        fixtureKind: "synthetic-kernel-graph",
        syntheticScope: "deterministic-kernel-only",
        manifestHash: "1234abcd",
        nodeCount: 2,
        edgeCount: 1
      },
      nodes: [
        { id: 1, sourceId: "node-001", displayNameKey: "content.m1.abstract.node_001" },
        { id: 2, sourceId: "node-002", displayNameKey: "content.m1.abstract.node_002" }
      ],
      edges: [
        {
          id: 1,
          sourceId: "edge-001",
          fromNodeId: 1,
          toNodeId: 2,
          direction: "bidirectional",
          traversalCost: 10
        }
      ]
    });
    const index = createRuntimeContentPackIndexV0(pack);

    expect(index.getNode(1)?.sourceId).toBe("node-001");
    expect(index.getEdge(1)?.fromNodeId).toBe(1);
    expect(index).not.toHaveProperty("getNodeByDisplayName");
    expect(index).not.toHaveProperty("getNodeByDisplayNameKey");
  });

  test("rejects runtime packs with bad manifest counts or references", () => {
    expect(() =>
      parseRuntimeContentPackV0({
        schemaVersion: 1,
        kind: "runtime-content-pack-v0",
        fixtureId: "m1.runtime-test",
        manifest: {
          schemaVersion: 1,
          fixtureId: "m1.runtime-test",
          fixtureKind: "synthetic-kernel-graph",
          syntheticScope: "deterministic-kernel-only",
          manifestHash: "1234abcd",
          nodeCount: 1,
          edgeCount: 1
        },
        nodes: [
          { id: 1, sourceId: "node-001", displayNameKey: "content.m1.abstract.node_001" },
          { id: 2, sourceId: "node-002", displayNameKey: "content.m1.abstract.node_002" }
        ],
        edges: [
          {
            id: 1,
            sourceId: "edge-001",
            fromNodeId: 1,
            toNodeId: 999,
            direction: "bidirectional",
            traversalCost: 10
          }
        ]
      })
    ).toThrow("RuntimeContentPackV0");
  });
});

describe("M2 runtime world content pack", () => {
  test("parses runtime districts, settlements, curves, routes, and geometry without display-name lookup", () => {
    const pack = parseRuntimeM2WorldContentPackV0({
      schemaVersion: 1,
      kind: "runtime-m2-world-content-pack-v0",
      fixtureId: "m2.runtime-test",
      manifest: {
        schemaVersion: 1,
        fixtureId: "m2.runtime-test",
        fixtureKind: "prototype-world-fixture",
        syntheticScope: "m2-prototype-only",
        historicity: "FICTIONAL",
        manifestHash: "abcdef12",
        districtCount: 1,
        settlementCount: 1,
        regionalSeasonalCurveCount: 1,
        routeCount: 1,
        mapGeometryCount: 2
      },
      districts: [
        {
          id: 1,
          sourceId: "district-001",
          displayNameKey: "content.m2.prototype.district_001",
          regionalCurveId: 1,
          mapGeometryId: 1
        }
      ],
      settlements: [
        {
          id: 1,
          sourceId: "settlement-001",
          displayNameKey: "content.m2.prototype.settlement_001",
          districtId: 1,
          mapGeometryId: 2
        }
      ],
      regionalSeasonalCurves: [
        {
          id: 1,
          sourceId: "curve-001",
          displayNameKey: "content.m2.prototype.curve_001",
          monthlyValues: Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            monsoonIntensityBps: 1000,
            agricultureWorkBps: 9000,
            riverNavigabilityBps: 5000,
            roadTravelCostBps: 10000
          }))
        }
      ],
      routes: [
        {
          id: 1,
          sourceId: "route-001",
          fromDistrictId: 1,
          toDistrictId: 1,
          routeKind: "road",
          baseTravelCost: 10
        }
      ],
      mapGeometries: [
        {
          id: 1,
          sourceId: "geom-district-001",
          ownerKind: "district",
          ownerId: 1,
          geometryKind: "polygon",
          anchor: { x: 0, y: 0 },
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
          ]
        },
        {
          id: 2,
          sourceId: "geom-settlement-001",
          ownerKind: "settlement",
          ownerId: 1,
          geometryKind: "point",
          anchor: { x: 5, y: 5 },
          points: []
        }
      ]
    });
    const index = createRuntimeM2WorldContentPackIndexV0(pack);

    expect(index.getDistrict(1)?.sourceId).toBe("district-001");
    expect(index.getSettlement(1)?.districtId).toBe(1);
    expect(index.getRegionalSeasonalCurve(1)?.monthlyValues).toHaveLength(12);
    expect(index).not.toHaveProperty("getDistrictByDisplayName");
    expect(index).not.toHaveProperty("getSettlementByDisplayName");
  });
});

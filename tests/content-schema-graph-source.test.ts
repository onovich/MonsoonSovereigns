import { describe, expect, test } from "vitest";

import {
  parseM2WorldFixtureSourceV0,
  validateM2WorldFixtureSourceV0,
  parseM1GraphFixtureSourceV0,
  validateM1GraphFixtureSourceV0
} from "../packages/content-schema/src/index";

describe("SIM-006 source content schema", () => {
  test("parses a minimal explicitly synthetic graph source DTO", () => {
    const source = parseM1GraphFixtureSourceV0({
      schemaVersion: 1,
      kind: "m1.synthetic-abstract-graph",
      fixtureId: "m1.test",
      fixtureKind: "synthetic-kernel-graph",
      syntheticScope: "deterministic-kernel-only",
      nodes: [
        {
          sourceId: "node-001",
          displayNameKey: "content.m1.abstract.node_001",
          isolation: "connected"
        }
      ],
      edges: []
    });

    expect(source.nodes[0]?.sourceId).toBe("node-001");
  });

  test("returns path-specific invalid-schema errors instead of throwing during validation", () => {
    expect(validateM1GraphFixtureSourceV0({ schemaVersion: "1", nodes: {} })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "schemaVersion" }),
        expect.objectContaining({ code: "invalid-schema", path: "kind" }),
        expect.objectContaining({ code: "invalid-schema", path: "nodes" }),
        expect.objectContaining({ code: "invalid-schema", path: "edges" })
      ])
    );
  });
});

describe("M2 world fixture source schema", () => {
  test("parses explicit prototype world fixture fields without historical claims", () => {
    const source = parseM2WorldFixtureSourceV0({
      schemaVersion: 1,
      kind: "m2.prototype-world-fixture",
      fixtureId: "m2.test-world",
      fixtureKind: "prototype-world-fixture",
      syntheticScope: "m2-prototype-only",
      historicity: "FICTIONAL",
      provenance: {
        sourceCategory: "validation-only-fixture",
        confidence: "LOW",
        policyId: "M2-MAP-SOURCE-POLICY-001"
      },
      districts: [
        {
          sourceId: "district-001",
          displayNameKey: "content.m2.prototype.district_001",
          regionalCurveId: "curve-001",
          mapGeometryId: "geom-district-001"
        }
      ],
      settlements: [
        {
          sourceId: "settlement-001",
          displayNameKey: "content.m2.prototype.settlement_001",
          districtId: "district-001",
          mapGeometryId: "geom-settlement-001"
        }
      ],
      regionalSeasonalCurves: [
        {
          sourceId: "curve-001",
          displayNameKey: "content.m2.prototype.curve_001",
          monthlyValues: [
            {
              month: 1,
              monsoonIntensityBps: 1000,
              agricultureWorkBps: 9000,
              riverNavigabilityBps: 5000,
              roadTravelCostBps: 10000
            },
            {
              month: 2,
              monsoonIntensityBps: 1000,
              agricultureWorkBps: 9000,
              riverNavigabilityBps: 5000,
              roadTravelCostBps: 10000
            },
            {
              month: 3,
              monsoonIntensityBps: 2000,
              agricultureWorkBps: 8000,
              riverNavigabilityBps: 6000,
              roadTravelCostBps: 11000
            },
            {
              month: 4,
              monsoonIntensityBps: 3000,
              agricultureWorkBps: 7000,
              riverNavigabilityBps: 7000,
              roadTravelCostBps: 12000
            },
            {
              month: 5,
              monsoonIntensityBps: 5000,
              agricultureWorkBps: 6000,
              riverNavigabilityBps: 8000,
              roadTravelCostBps: 13000
            },
            {
              month: 6,
              monsoonIntensityBps: 7000,
              agricultureWorkBps: 5000,
              riverNavigabilityBps: 9000,
              roadTravelCostBps: 14000
            },
            {
              month: 7,
              monsoonIntensityBps: 9000,
              agricultureWorkBps: 4000,
              riverNavigabilityBps: 10000,
              roadTravelCostBps: 15000
            },
            {
              month: 8,
              monsoonIntensityBps: 9000,
              agricultureWorkBps: 4000,
              riverNavigabilityBps: 10000,
              roadTravelCostBps: 15000
            },
            {
              month: 9,
              monsoonIntensityBps: 7000,
              agricultureWorkBps: 5000,
              riverNavigabilityBps: 9000,
              roadTravelCostBps: 14000
            },
            {
              month: 10,
              monsoonIntensityBps: 5000,
              agricultureWorkBps: 6000,
              riverNavigabilityBps: 8000,
              roadTravelCostBps: 13000
            },
            {
              month: 11,
              monsoonIntensityBps: 3000,
              agricultureWorkBps: 7000,
              riverNavigabilityBps: 7000,
              roadTravelCostBps: 12000
            },
            {
              month: 12,
              monsoonIntensityBps: 2000,
              agricultureWorkBps: 8000,
              riverNavigabilityBps: 6000,
              roadTravelCostBps: 11000
            }
          ]
        }
      ],
      routes: [
        {
          sourceId: "route-001",
          fromDistrictId: "district-001",
          toDistrictId: "district-001",
          routeKind: "road",
          baseTravelCost: 10
        }
      ],
      mapGeometries: [
        {
          sourceId: "geom-district-001",
          ownerKind: "district",
          ownerId: "district-001",
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
          sourceId: "geom-settlement-001",
          ownerKind: "settlement",
          ownerId: "settlement-001",
          geometryKind: "point",
          anchor: { x: 5, y: 5 },
          points: []
        }
      ]
    });

    expect(source.historicity).toBe("FICTIONAL");
    expect(source.regionalSeasonalCurves[0]?.monthlyValues).toHaveLength(12);
  });

  test("requires M2 prototype provenance policy fields", () => {
    expect(
      validateM2WorldFixtureSourceV0({ schemaVersion: 1, kind: "m2.prototype-world-fixture" })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "historicity" }),
        expect.objectContaining({ code: "invalid-schema", path: "provenance" }),
        expect.objectContaining({ code: "invalid-schema", path: "districts" }),
        expect.objectContaining({ code: "invalid-schema", path: "regionalSeasonalCurves" })
      ])
    );
  });

  test("returns nested schema paths for invalid M2 provenance manifest entries", () => {
    expect(
      validateM2WorldFixtureSourceV0({
        schemaVersion: 1,
        kind: "m2.prototype-world-fixture",
        fixtureId: "m2.bad-provenance",
        fixtureKind: "prototype-world-fixture",
        syntheticScope: "m2-prototype-only",
        historicity: "FICTIONAL",
        provenance: {
          sourceCategory: "production-content",
          confidence: "HIGH",
          policyId: "missing-policy"
        },
        districts: [],
        settlements: [],
        regionalSeasonalCurves: [],
        routes: [],
        mapGeometries: []
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "provenance.sourceCategory" }),
        expect.objectContaining({ code: "invalid-schema", path: "provenance.confidence" }),
        expect.objectContaining({ code: "invalid-schema", path: "provenance.policyId" })
      ])
    );
  });
});

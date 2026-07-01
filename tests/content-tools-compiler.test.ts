import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { compileContentPackV0, compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import {
  parseM1GraphFixtureSourceV0,
  parseM6AlphaMapCandidateSetSourceV0,
  parseM6AlphaScenarioSetSourceV0,
  parseM7BetaScenarioPersonEventSetSourceV0,
  parseM3CharacterOfficeFixtureSourceV0,
  parseM2WorldFixtureSourceV0,
  type M1GraphFixtureSourceV0,
  type M6AlphaMapCandidateSetSourceV0,
  type M7BetaScenarioPersonEventSetSourceV0,
  type M6AlphaScenarioSetSourceV0,
  type M3CharacterOfficeFixtureSourceV0,
  type M2WorldFixtureSourceV0
} from "../packages/content-schema/src/index";

const fixtureUrl = new URL("../content-source/m1-fixtures/abstract-graph-30.json", import.meta.url);
const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);
const m2BadFixtureManifestUrl = new URL(
  "../content-source/m2-fixtures/validation-only-bad-fixtures.manifest.json",
  import.meta.url
);
const m3CharacterOfficeFixtureUrl = new URL(
  "../content-source/m3-fixtures/character-office-validation-64.json",
  import.meta.url
);
const m6AlphaScenarioFixtureUrl = new URL(
  "../content-source/m6-alpha-scenarios/alpha-scenario-set.json",
  import.meta.url
);
const m6AlphaMapCandidateFixtureUrl = new URL(
  "../content-source/m6-map-candidates/alpha-map-candidate-set.json",
  import.meta.url
);
const m7BetaScenarioFixtureUrl = new URL(
  "../content-source/m7-beta-scenarios/beta-scenario-person-event-set.json",
  import.meta.url
);

interface M2BadFixtureManifest {
  readonly schemaVersion: 1;
  readonly kind: "m2.validation-only-bad-fixture-manifest";
  readonly fixtureSetId: string;
  readonly syntheticScope: "m2-prototype-only";
  readonly historicity: "FICTIONAL";
  readonly provenance: {
    readonly sourceCategory: "validation-only-fixture";
    readonly confidence: "LOW";
    readonly policyId: "M2-MAP-SOURCE-POLICY-001";
  };
  readonly scopeNotes: readonly string[];
  readonly cases: readonly M2BadFixtureManifestCase[];
}

interface M2BadFixtureManifestCase {
  readonly caseId: string;
  readonly category: "bad-map" | "bad-reference";
  readonly sourceFixture: "prototype-world-30-districts.json";
  readonly mutation: string;
  readonly expectedErrorCodes: readonly string[];
  readonly expectedPaths: readonly string[];
}

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
  test("marks bad M2 fixture cases as validation-only fictional data", async () => {
    const manifest = await readM2BadFixtureManifest();

    expect(manifest.kind).toBe("m2.validation-only-bad-fixture-manifest");
    expect(manifest.historicity).toBe("FICTIONAL");
    expect(manifest.provenance).toEqual({
      sourceCategory: "validation-only-fixture",
      confidence: "LOW",
      policyId: "M2-MAP-SOURCE-POLICY-001"
    });
    expect(manifest.scopeNotes.join(" ")).toContain("Validation-only");
    expect(manifest.scopeNotes.join(" ")).toContain("Not production content");
    expect(manifest.cases.map((entry) => entry.caseId)).toEqual(
      expect.arrayContaining([
        "bad-map-malformed-geometry",
        "bad-map-invalid-district-anchor",
        "bad-map-invalid-settlement-anchor",
        "bad-map-disconnected-route-graph",
        "bad-references-cross-content"
      ])
    );
    expect(
      manifest.cases.every(
        (entry) =>
          entry.expectedErrorCodes.length > 0 &&
          entry.expectedPaths.length > 0 &&
          entry.sourceFixture === "prototype-world-30-districts.json"
      )
    ).toBe(true);
  });

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
    expect(pack.manifest.historicity).toBe("COMPOSITE");
    expect(pack.manifest.districtCount).toBe(14);
    expect(pack.manifest.settlementCount).toBe(6);
    expect(pack.manifest.routeCount).toBe(25);
    expect(pack.manifest.regionalSeasonalCurveCount).toBeGreaterThanOrEqual(4);
    expect(pack.districts).toHaveLength(14);
    expect(pack.settlements).toHaveLength(6);
    expect(pack.topology.adjacencyDerivation).toBe("explicit-route-graph-v1");
    expect(pack.topology.districts).toHaveLength(14);
    expect(pack.topology.routeEdges).toHaveLength(25);
    expect(pack.topology.explicitIsolations).toEqual([
      { districtId: 14, reasonCode: "topology.no-known-route.synthetic-outer-sound" }
    ]);
    expect(new Set(pack.topology.routeEdges.map((edge) => edge.mode))).toEqual(
      new Set(["road", "river", "coast"])
    );
    expect(pack.topology.routeEdges.some((edge) => edge.from.kind === "route-node")).toBe(true);
    expect(pack.topology.routeEdges.every((edge) => edge.seasonality.length === 12)).toBe(true);
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

  test("compiles the M7 strategic terrain fixture as COMPOSITE terrain-route-node content", async () => {
    const source = await readM2FixtureRecord();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.kind).toBe("runtime-m2-world-content-pack-v0");
    if (pack.kind !== "runtime-m2-world-content-pack-v0") {
      throw new Error("Expected M2 world runtime pack.");
    }
    expect(pack.strategicTerrain).toMatchObject({
      authority: "terrain-route-node-v1",
      governanceFootprintRole: "overlay-only",
      contentManifestHash: pack.manifest.manifestHash
    });
    if (pack.strategicTerrain === undefined) {
      throw new Error("Expected M7 strategic terrain fixture content.");
    }
    expect(pack.strategicTerrain.terrainPatches).toHaveLength(12);
    expect(pack.strategicTerrain.barrierChannels).toHaveLength(8);
    expect(pack.strategicTerrain.strategicNodes).toHaveLength(20);
    expect(pack.strategicTerrain.routeCorridors).toHaveLength(28);
    expect(pack.strategicTerrain.districtGovernanceFootprints).toHaveLength(14);
    expect(new Set(pack.strategicTerrain.terrainPatches.map((patch) => patch.historicity))).toEqual(
      new Set(["COMPOSITE"])
    );
    expect(new Set(pack.strategicTerrain.routeCorridors.map((corridor) => corridor.mode))).toEqual(
      new Set(["coast", "mixed", "pass", "river", "road"])
    );
    expect(
      pack.strategicTerrain.routeCorridors.some((corridor) => corridor.widthClass === "narrow")
    ).toBe(true);
    expect(
      pack.strategicTerrain.barrierChannels.some(
        (channel) => channel.traversalRule === "blocks-without-explicit-corridor"
      )
    ).toBe(true);
    expect(pack.strategicTerrain.strategicNodes.some((node) => node.nodeKind === "pass")).toBe(
      true
    );
    expect(pack.strategicTerrain.strategicNodes.some((node) => node.nodeKind === "crossing")).toBe(
      true
    );
    expect(
      pack.strategicTerrain.routeCorridors.every((corridor) => corridor.seasonality.length === 12)
    ).toBe(true);
    expect(
      pack.strategicTerrain.districtGovernanceFootprints.every(
        (footprint) => footprint.overlayOnly === true
      )
    ).toBe(true);
  });

  test("rejects malformed M7 strategic terrain fixture content", async () => {
    const source = await readM2FixtureRecord();

    const overclaim = mutateStrategicTerrain(source, (terrain) => {
      const patches = requireMutableRecordArray(terrain, "terrainPatches");
      patches[0] = { ...requireMutableRecord(patches[0]), historicity: "HISTORICAL" };
    });
    const barrierWithoutCrossing = mutateStrategicTerrain(source, (terrain) => {
      const nodes = requireMutableRecordArray(terrain, "strategicNodes");
      for (const node of nodes) {
        const barrierIds = node["barrierChannelIds"];
        if (Array.isArray(barrierIds)) {
          node["barrierChannelIds"] = barrierIds.filter(
            (barrierId) => barrierId !== "barrier.b-ridge-spine"
          );
        }
      }
    });
    const ordinaryCorridorBarrierShortcut = mutateStrategicTerrain(source, (terrain) => {
      const corridors = requireMutableRecordArray(terrain, "routeCorridors");
      corridors[1] = {
        ...requireMutableRecord(corridors[1]),
        barrierChannelIds: ["barrier.b-ridge-spine"]
      };
    });
    const governanceShortcut = mutateStrategicTerrain(source, (terrain) => {
      const corridors = requireMutableRecordArray(terrain, "routeCorridors");
      corridors[0] = { ...requireMutableRecord(corridors[0]), terrainPatchIds: [] };
    });
    const hiddenGridNode = mutateStrategicTerrain(source, (terrain) => {
      const nodes = requireMutableRecordArray(terrain, "strategicNodes");
      nodes[0] = { ...requireMutableRecord(nodes[0]), nodeId: "row1" };
    });
    const duplicatePatch = mutateStrategicTerrain(source, (terrain) => {
      const patches = requireMutableRecordArray(terrain, "terrainPatches");
      patches[1] = {
        ...requireMutableRecord(patches[1]),
        patchId: requireMutableRecord(patches[0])["patchId"]
      };
    });
    const missingEndpoint = mutateStrategicTerrain(source, (terrain) => {
      const corridors = requireMutableRecordArray(terrain, "routeCorridors");
      corridors[0] = { ...requireMutableRecord(corridors[0]), toNodeId: "node.missing" };
    });

    expect(compileContentPackV0(overclaim).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "historical-overclaim",
          path: "strategicTerrain.terrainPatches[0].historicity"
        })
      ])
    );
    expect(compileContentPackV0(barrierWithoutCrossing).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-route",
          path: "strategicTerrain.routeCorridors[14].barrierChannelIds[0]"
        })
      ])
    );
    expect(compileContentPackV0(ordinaryCorridorBarrierShortcut).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-route",
          path: "strategicTerrain.routeCorridors[1].barrierChannelIds[0]"
        })
      ])
    );
    expect(compileContentPackV0(governanceShortcut).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-route",
          path: "strategicTerrain.routeCorridors[0].terrainPatchIds"
        })
      ])
    );
    expect(compileContentPackV0(hiddenGridNode).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "lattice-adjacency",
          path: "strategicTerrain.strategicNodes[0].nodeId"
        })
      ])
    );
    expect(compileContentPackV0(duplicatePatch).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "duplicate-id",
          path: "strategicTerrain.terrainPatches[1].patchId"
        })
      ])
    );
    expect(compileContentPackV0(missingEndpoint).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "bad-reference",
          path: "strategicTerrain.routeCorridors[0].toNodeId"
        })
      ])
    );
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

  test("fails malformed M2 map geometry and invalid district or settlement anchors", async () => {
    const source = await readM2Fixture();
    const badSource = {
      ...source,
      mapGeometries: source.mapGeometries.map((geometry, index) => {
        if (index === 0) {
          return {
            ...geometry,
            anchor: { x: 999999, y: 999999 }
          };
        }

        if (index === 1) {
          return {
            ...geometry,
            points: geometry.points.slice(0, 2)
          };
        }

        if (index === 14) {
          return {
            ...geometry,
            anchor: { x: 999999, y: 999999 }
          };
        }

        return geometry;
      })
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-geometry", path: "mapGeometries[1].points" }),
        expect.objectContaining({ code: "invalid-geometry", path: "mapGeometries[0].anchor" }),
        expect.objectContaining({ code: "invalid-topology", path: "topology.routeNodes[1].anchor" })
      ])
    );
  });

  test("fails duplicate stable M2 IDs", async () => {
    const source = await readM2Fixture();
    const badSource = {
      ...source,
      districts: source.districts.map((district, index) =>
        index === 1 ? { ...district, sourceId: "district-001" } : district
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-id", path: "districts[1].sourceId" })
      ])
    );
  });

  test("fails malformed explicit M2 topology graph inputs", async () => {
    const source = await readM2Fixture();
    const missingEndpoint = {
      ...source,
      topology: {
        ...source.topology,
        routeEdges: source.topology.routeEdges.map((edge, index) =>
          index === 0 ? { ...edge, to: { kind: "district", districtId: "district-999" } } : edge
        )
      }
    };
    const duplicateTopologyIds = {
      ...source,
      topology: {
        ...source.topology,
        routeNodes: source.topology.routeNodes.map((node, index) =>
          index === 1
            ? { ...node, nodeId: source.topology.routeNodes[0]?.nodeId ?? node.nodeId }
            : node
        ),
        routeEdges: source.topology.routeEdges.map((edge, index) =>
          index === 1
            ? { ...edge, sourceId: source.topology.routeEdges[0]?.sourceId ?? edge.sourceId }
            : edge
        )
      }
    };
    const routeNodeOutsidePolygon = {
      ...source,
      topology: {
        ...source.topology,
        routeNodes: source.topology.routeNodes.map((node, index) =>
          index === 0 ? { ...node, anchor: { x: 999999, y: 999999 } } : node
        )
      }
    };
    const disconnectedWithoutReason = {
      ...source,
      topology: {
        ...source.topology,
        routeEdges: source.topology.routeEdges.map((edge) =>
          edge.routeId === "route-017" ||
          edge.routeId === "route-019" ||
          edge.routeId === "route-023"
            ? {
                ...edge,
                availability: {
                  kind: "blocked",
                  reasonCode: "topology.blocked.test-disconnect"
                }
              }
            : edge
        )
      }
    };

    expect(compileContentPackV0(missingEndpoint).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "bad-reference",
          path: "topology.routeEdges[0].to.districtId"
        })
      ])
    );
    expect(compileContentPackV0(duplicateTopologyIds).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-id", path: "topology.routeNodes[1].nodeId" }),
        expect.objectContaining({ code: "duplicate-id", path: "topology.routeEdges[1].sourceId" })
      ])
    );
    expect(compileContentPackV0(routeNodeOutsidePolygon).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-topology", path: "topology.routeNodes[0].anchor" })
      ])
    );
    expect(compileContentPackV0(disconnectedWithoutReason).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "isolated-district", path: "districts[12].sourceId" })
      ])
    );
  });

  test("rejects row/column/grid/hex/lattice-only M2 topology leakage", async () => {
    const source = await readM2Fixture();
    const gridGeometries = source.mapGeometries.map((geometry) => {
      if (geometry.ownerKind !== "district") {
        return geometry;
      }
      const ordinal = Number.parseInt(geometry.ownerId.slice("district-".length), 10) - 1;
      const anchor = { x: (ordinal % 7) * 100 + 10, y: Math.floor(ordinal / 7) * 100 + 10 };
      return {
        ...geometry,
        anchor,
        points: [
          { x: anchor.x - 10, y: anchor.y - 10 },
          { x: anchor.x + 10, y: anchor.y - 10 },
          { x: anchor.x + 10, y: anchor.y + 10 },
          { x: anchor.x - 10, y: anchor.y + 10 }
        ]
      };
    });
    const routeById = new Map(source.routes.map((route) => [route.sourceId, route]));
    const badSource = {
      ...source,
      mapGeometries: gridGeometries,
      topology: {
        ...source.topology,
        routeNodes: [],
        routeEdges: source.topology.routeEdges.map((edge) => {
          const route = routeById.get(edge.routeId);
          if (route === undefined) {
            return edge;
          }
          return {
            ...edge,
            from: { kind: "district", districtId: route.fromDistrictId },
            to: { kind: "district", districtId: route.toDistrictId }
          };
        })
      }
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "lattice-adjacency", path: "topology" })
      ])
    );
  });

  test("fails M2 localization key reference mismatches with paths", async () => {
    const source = await readM2Fixture();
    const badSource = {
      ...source,
      districts: source.districts.map((district, index) =>
        index === 0
          ? { ...district, displayNameKey: "content.m2.prototype.district_002" }
          : district
      ),
      settlements: source.settlements.map((settlement, index) =>
        index === 0
          ? { ...settlement, displayNameKey: "content.m2.prototype.settlement_002" }
          : settlement
      ),
      regionalSeasonalCurves: source.regionalSeasonalCurves.map((curve, index) =>
        index === 0 ? { ...curve, displayNameKey: "content.m2.prototype.curve_002" } : curve
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "bad-reference", path: "districts[0].displayNameKey" }),
        expect.objectContaining({ code: "bad-reference", path: "settlements[0].displayNameKey" }),
        expect.objectContaining({
          code: "bad-reference",
          path: "regionalSeasonalCurves[0].displayNameKey"
        })
      ])
    );
  });

  test("fails M2 validation manifest entry mismatches with nested schema paths", async () => {
    const source = await readM2Fixture();
    const badSource = {
      ...source,
      provenance: {
        ...source.provenance,
        policyId: "MISSING-POLICY"
      }
    };

    expect(compileContentPackV0(badSource).errors).toContainEqual(
      expect.objectContaining({ code: "invalid-schema", path: "provenance.policyId" })
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

async function readM2Fixture(): Promise<M2WorldFixtureSourceV0> {
  const text = await readFile(m2FixtureUrl, "utf8");
  return parseM2WorldFixtureSourceV0(JSON.parse(text) as unknown);
}

async function readM2FixtureRecord(): Promise<Record<string, unknown>> {
  const text = await readFile(m2FixtureUrl, "utf8");
  const parsed = JSON.parse(text) as unknown;
  if (!isRecord(parsed)) {
    throw new Error("Expected M2 fixture root record.");
  }
  return parsed;
}

async function readM2BadFixtureManifest(): Promise<M2BadFixtureManifest> {
  const text = await readFile(m2BadFixtureManifestUrl, "utf8");
  return parseM2BadFixtureManifest(JSON.parse(text) as unknown);
}

describe("M3 Character Office Content Compiler v0", () => {
  test("compiles the M3 validation character office fixture with sparse relationships", async () => {
    const source = await readM3CharacterOfficeFixture();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.kind).toBe("runtime-m3-character-office-content-pack-v0");
    if (pack.kind !== "runtime-m3-character-office-content-pack-v0") {
      throw new Error("Expected M3 character office runtime pack.");
    }
    expect(pack.manifest.characterCount).toBeGreaterThanOrEqual(50);
    expect(pack.manifest.characterCount).toBeLessThanOrEqual(80);
    expect(pack.manifest.relationshipCount).toBeGreaterThan(0);
    expect(pack.manifest.relationshipCount).toBeLessThan(
      pack.manifest.characterCount * (pack.manifest.characterCount - 1)
    );
    expect(pack.manifest.officeCount).toBeGreaterThanOrEqual(4);
    expect(pack.manifest.landedPowerCount).toBeGreaterThanOrEqual(4);
    expect(pack.manifest.officePolicyCount).toBe(pack.manifest.officeCount);
    expect(pack.manifest.enfeoffmentHookCount).toBeGreaterThanOrEqual(1);
    expect(pack.manifest.historicity).toBe("FICTIONAL");
    expect(
      pack.characters.every((character) => character.claimLabel === "FICTIONAL_VALIDATION")
    ).toBe(true);
    expect(pack.relationships.every((edge) => edge.claimLabel === "FICTIONAL_VALIDATION")).toBe(
      true
    );
    expect(pack.characters.map((character) => character.archetype)).toEqual(
      expect.arrayContaining(["administrator", "local-lord", "commander", "succession-competitor"])
    );
    expect(pack.officePolicies.every((policy) => policy.persistsAcrossHolderChange === true)).toBe(
      true
    );
    expect(pack.offices[0]).toMatchObject({
      id: 1,
      sourceId: "office-001",
      policyId: 1,
      landedPowerId: 1
    });
  });

  test("keeps office policy metadata when only the current holder changes", async () => {
    const source = await readM3CharacterOfficeFixture();
    const first = compileContentPackV0OrThrow(source);
    const changedHolder = {
      ...source,
      offices: source.offices.map((office, index) =>
        index === 0 ? { ...office, currentHolderCharacterId: "character-002" } : office
      )
    };
    const second = compileContentPackV0OrThrow(changedHolder);

    if (
      first.kind !== "runtime-m3-character-office-content-pack-v0" ||
      second.kind !== "runtime-m3-character-office-content-pack-v0"
    ) {
      throw new Error("Expected M3 character office runtime packs.");
    }
    expect(second.offices[0]?.currentHolderCharacterId).toBe(2);
    expect(second.offices[0]?.policyId).toBe(first.offices[0]?.policyId);
    expect(second.officePolicies).toEqual(first.officePolicies);
  });

  test("fails missing relationship references, ancestor cycles, and ineligible office holders", async () => {
    const source = await readM3CharacterOfficeFixture();
    const badSource = {
      ...source,
      relationships: source.relationships.map((relationship, index) =>
        index === 0
          ? { ...relationship, toCharacterId: "character-999" }
          : index === 2
            ? {
                ...relationship,
                fromCharacterId: "character-002",
                toCharacterId: "character-001",
                relationshipKind: "parent" as const
              }
            : relationship
      ),
      offices: source.offices.map((office, index) =>
        index === 0 ? { ...office, currentHolderCharacterId: "character-050" } : office
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "bad-reference", path: "relationships[0].toCharacterId" }),
        expect.objectContaining({ code: "invalid-relationship", path: "relationships" }),
        expect.objectContaining({
          code: "invalid-eligibility",
          path: "offices[0].currentHolderCharacterId"
        })
      ])
    );
  });

  test("repeated M3 character office compiles produce the same manifest hash and runtime order", async () => {
    const source = await readM3CharacterOfficeFixture();
    const first = compileContentPackV0OrThrow(source);
    const second = compileContentPackV0OrThrow(structuredClone(source));

    if (
      first.kind !== "runtime-m3-character-office-content-pack-v0" ||
      second.kind !== "runtime-m3-character-office-content-pack-v0"
    ) {
      throw new Error("Expected M3 character office runtime packs.");
    }
    expect(second.manifest.manifestHash).toBe(first.manifest.manifestHash);
    expect(second.characters.map((character) => character.sourceId)).toEqual(
      first.characters.map((character) => character.sourceId)
    );
    expect(second.relationships.map((relationship) => relationship.sourceId)).toEqual(
      first.relationships.map((relationship) => relationship.sourceId)
    );
    expect(second.offices.map((office) => office.sourceId)).toEqual(
      first.offices.map((office) => office.sourceId)
    );
  });
});

describe("M6 Alpha Scenario Content Compiler v0", () => {
  test("compiles the three Alpha scenario data sets with labels and deterministic references", async () => {
    const source = await readM6AlphaScenarioFixture();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.kind).toBe("runtime-m6-alpha-scenario-content-pack-v0");
    if (pack.kind !== "runtime-m6-alpha-scenario-content-pack-v0") {
      throw new Error("Expected M6 alpha scenario runtime pack.");
    }
    expect(pack.fixtureId).toBe("m6.alpha.scenario.set");
    expect(pack.manifest.scenarioCount).toBe(3);
    expect(pack.manifest.claimCount).toBeGreaterThanOrEqual(6);
    expect(pack.manifest.referenceTargetCount).toBe(8);
    expect(pack.manifest.manifestHash).toMatch(/^[0-9a-f]{8}$/u);
    expect(pack.scenarios.map((scenario) => scenario.scenarioKey)).toEqual([
      "alpha-1531-edge-polity",
      "alpha-1569-overextended-suzerainty",
      "alpha-1581-succession-fracture"
    ]);
    expect(new Set(pack.claims.map((claim) => claim.historicity))).toEqual(
      new Set(["HISTORICAL", "INFERRED", "COMPOSITE", "FICTIONAL"])
    );
    expect(
      pack.claims
        .filter((claim) => claim.historicity !== "FICTIONAL")
        .every((claim) => claim.sourceIds.length > 0 && claim.sourcePassages.length > 0)
    ).toBe(true);
    expect(
      pack.claims
        .filter((claim) => claim.historicity === "FICTIONAL")
        .every((claim) => claim.sourceIds.length === 0 && claim.sourcePassages.length === 0)
    ).toBe(true);
  });

  test("fails M6 bad references across claims, reference targets, and scenarios", async () => {
    const source = await readM6AlphaScenarioFixture();
    const badSource = {
      ...source,
      claims: source.claims.map((claim, index) =>
        index === 0 ? { ...claim, sourceIds: ["source.missing"] } : claim
      ),
      referenceTargets: {
        ...source.referenceTargets,
        diplomacy: source.referenceTargets.diplomacy.map((target, index) =>
          index === 0 ? { ...target, claimId: "HIST-M6-MISSING" } : target
        )
      },
      scenarios: source.scenarios.map((scenario, index) =>
        index === 0
          ? {
              ...scenario,
              materialClaimIds: ["HIST-M6-MISSING"],
              references: {
                ...scenario.references,
                legitimacy: ["legitimacy.alpha.missing"]
              }
            }
          : scenario
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "bad-reference", path: "claims[0].sourceIds[0]" }),
        expect.objectContaining({
          code: "bad-reference",
          path: "referenceTargets.diplomacy[0].claimId"
        }),
        expect.objectContaining({
          code: "bad-reference",
          path: "scenarios[0].materialClaimIds[0]"
        }),
        expect.objectContaining({
          code: "bad-reference",
          path: "scenarios[0].references.legitimacy[0]"
        })
      ])
    );
  });

  test("fails M6 missing labels and unsourced formal claims", async () => {
    const source = await readM6AlphaScenarioFixture();
    const badSource = {
      ...source,
      claims: source.claims.map((claim, index) =>
        index === 0 ? { ...claim, sourceIds: [], sourcePassages: [] } : claim
      ),
      scenarios: source.scenarios.map((scenario, index) =>
        index === 0 ? { ...scenario, materialClaimIds: [] } : scenario
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsourced-claim", path: "claims[0].sourceIds" }),
        expect.objectContaining({
          code: "missing-label",
          path: "scenarios[0].materialClaimIds"
        })
      ])
    );
  });

  test("fails M6 formal claims with empty source or passage entries", async () => {
    const source = await readM6AlphaScenarioFixture();
    const badSource = {
      ...source,
      claims: source.claims.map((claim, index) =>
        index === 0 ? { ...claim, sourceIds: [""], sourcePassages: [""] } : claim
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "claims[0].sourceIds" }),
        expect.objectContaining({ code: "invalid-schema", path: "claims[0].sourcePassages" })
      ])
    );
  });

  test("fails M6 unstable IDs and duplicate scenario keys", async () => {
    const source = await readM6AlphaScenarioFixture();
    const badSource = {
      ...source,
      scenarios: [
        {
          ...source.scenarios[1],
          scenarioKey: source.scenarios[0]?.scenarioKey ?? "alpha-1531-edge-polity"
        },
        source.scenarios[0],
        source.scenarios[2]
      ]
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unstable-order", path: "scenarios[1].sourceId" }),
        expect.objectContaining({
          code: "duplicate-scenario-key",
          path: "scenarios[1].scenarioKey"
        }),
        expect.objectContaining({
          code: "unstable-order",
          path: "scenarios[0].dependencyOrder"
        })
      ])
    );
  });

  test("repeated M6 compiles produce the same manifest hash and runtime order", async () => {
    const source = await readM6AlphaScenarioFixture();
    const first = compileContentPackV0OrThrow(source);
    const second = compileContentPackV0OrThrow(structuredClone(source));

    if (
      first.kind !== "runtime-m6-alpha-scenario-content-pack-v0" ||
      second.kind !== "runtime-m6-alpha-scenario-content-pack-v0"
    ) {
      throw new Error("Expected M6 alpha scenario runtime packs.");
    }
    expect(second.manifest.manifestHash).toBe(first.manifest.manifestHash);
    expect(second.scenarios.map((scenario) => scenario.sourceId)).toEqual(
      first.scenarios.map((scenario) => scenario.sourceId)
    );
    expect(second.claims.map((claim) => claim.claimId)).toEqual(
      first.claims.map((claim) => claim.claimId)
    );
  });

  test("M6 manifest hash changes when claim text or competing interpretations change", async () => {
    const source = await readM6AlphaScenarioFixture();
    const first = compileContentPackV0OrThrow(source);
    const changedClaimText = compileContentPackV0OrThrow({
      ...source,
      claims: source.claims.map((claim, index) =>
        index === 0 ? { ...claim, claim: `${claim.claim} R2 manifest text change.` } : claim
      )
    });
    const changedInterpretation = compileContentPackV0OrThrow({
      ...source,
      claims: source.claims.map((claim, index) =>
        index === 0
          ? {
              ...claim,
              competingInterpretations: [
                ...claim.competingInterpretations,
                "R2 manifest interpretation change."
              ]
            }
          : claim
      )
    });

    if (
      first.kind !== "runtime-m6-alpha-scenario-content-pack-v0" ||
      changedClaimText.kind !== "runtime-m6-alpha-scenario-content-pack-v0" ||
      changedInterpretation.kind !== "runtime-m6-alpha-scenario-content-pack-v0"
    ) {
      throw new Error("Expected M6 alpha scenario runtime packs.");
    }
    expect(changedClaimText.manifest.manifestHash).not.toBe(first.manifest.manifestHash);
    expect(changedInterpretation.manifest.manifestHash).not.toBe(first.manifest.manifestHash);
  });
});

describe("M6 Alpha Map Candidate Content Compiler v0", () => {
  test("compiles map candidates with deterministic order, classifications, and review notes", async () => {
    const source = await readM6AlphaMapCandidateFixture();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.kind).toBe("runtime-m6-alpha-map-candidate-content-pack-v0");
    if (pack.kind !== "runtime-m6-alpha-map-candidate-content-pack-v0") {
      throw new Error("Expected M6 alpha map candidate runtime pack.");
    }
    expect(pack.fixtureId).toBe("m6.alpha.map.candidate-set");
    expect(pack.manifest.candidateCount).toBe(1);
    expect(pack.manifest.districtCount).toBe(4);
    expect(pack.manifest.routeCount).toBe(3);
    expect(pack.manifest.manifestHash).toMatch(/^[0-9a-f]{8}$/u);
    expect(pack.candidates[0]?.sourceId).toBe("map.alpha.western-mainland-candidate");
    expect(pack.candidates[0]?.sourceLabel).toBe("COMPOSITE");
    expect(pack.candidates[0]?.reviewNotes.join(" ")).toContain("not simulation authority");
    expect(pack.candidates[0]?.districts.map((district) => district.sourceId)).toEqual([
      "district.alpha.coastal-interface",
      "district.alpha.delta-water",
      "district.alpha.irrawaddy-core",
      "district.alpha.sittaung-corridor"
    ]);
    expect(pack.candidates[0]?.routes.map((route) => route.waterClass)).toEqual([
      "water",
      "mixed",
      "land"
    ]);
  });

  test("fails map candidate bad district, settlement, and route references", async () => {
    const source = await readM6AlphaMapCandidateFixture();
    const candidate = requireFirstMapCandidate(source);
    const result = compileContentPackV0({
      ...source,
      candidates: [
        {
          ...candidate,
          settlements: candidate.settlements.map((settlement, index) =>
            index === 0
              ? { ...settlement, districtReferenceId: "district.alpha.missing" }
              : settlement
          ),
          routes: candidate.routes.map((route, index) =>
            index === 0 ? { ...route, toDistrictReferenceId: "district.alpha.missing" } : route
          )
        }
      ]
    });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "bad-reference",
          path: "candidates[0].settlements[0].districtReferenceId"
        }),
        expect.objectContaining({
          code: "bad-reference",
          path: "candidates[0].routes[0].toDistrictReferenceId"
        })
      ])
    );
  });

  test("fails route and water classification mismatches", async () => {
    const source = await readM6AlphaMapCandidateFixture();
    const candidate = requireFirstMapCandidate(source);
    const result = compileContentPackV0({
      ...source,
      candidates: [
        {
          ...candidate,
          routes: candidate.routes.map((route, index) =>
            index === 2 ? { ...route, waterClass: "water" as const } : route
          )
        }
      ]
    });

    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: "invalid-classification",
        path: "candidates[0].routes[2].waterClass"
      })
    );
  });

  test("repeated map candidate compiles produce the same manifest hash and render order", async () => {
    const source = await readM6AlphaMapCandidateFixture();
    const first = compileContentPackV0OrThrow(source);
    const second = compileContentPackV0OrThrow(structuredClone(source));

    if (
      first.kind !== "runtime-m6-alpha-map-candidate-content-pack-v0" ||
      second.kind !== "runtime-m6-alpha-map-candidate-content-pack-v0"
    ) {
      throw new Error("Expected M6 alpha map candidate runtime packs.");
    }
    expect(second.manifest.manifestHash).toBe(first.manifest.manifestHash);
    expect(second.candidates[0]?.districts.map((district) => district.renderOrder)).toEqual(
      first.candidates[0]?.districts.map((district) => district.renderOrder)
    );
    expect(second.candidates[0]?.routes.map((route) => route.routeReferenceId)).toEqual(
      first.candidates[0]?.routes.map((route) => route.routeReferenceId)
    );
  });
});

describe("M7 Beta Scenario/Person/Event Content Compiler v0", () => {
  test("compiles contracted Beta records with labels, owners, review states, and gaps", async () => {
    const source = await readM7BetaScenarioFixture();
    const pack = compileContentPackV0OrThrow(source);

    expect(pack.kind).toBe("runtime-m7-beta-scenario-person-event-content-pack-v0");
    if (pack.kind !== "runtime-m7-beta-scenario-person-event-content-pack-v0") {
      throw new Error("Expected M7 beta scenario/person/event runtime pack.");
    }
    expect(pack.fixtureId).toBe("m7.beta.scenario-person-event.set");
    expect(pack.notContentLockAcceptance).toBe(true);
    expect(pack.m6GateCarryForward).toBe("PASS_WITH_LIMITS");
    expect(pack.manualNodeBattleDecision).toBe("DEFER_MANUAL_NODE_BATTLE");
    expect(pack.manifest.scenarioCount).toBe(3);
    expect(pack.manifest.personCount).toBe(6);
    expect(pack.manifest.titleCount).toBe(3);
    expect(pack.manifest.eventCount).toBe(5);
    expect(pack.manifest.localizationCount).toBeGreaterThanOrEqual(30);
    expect(pack.manifest.manifestHash).toMatch(/^[0-9a-f]{8}$/u);
    expect(pack.scenarios.map((scenario) => scenario.scenarioKey)).toEqual([
      "beta-1531-edge-polity",
      "beta-1569-overextended-suzerainty",
      "beta-1581-succession-fracture"
    ]);
    expect(pack.persons.every((person) => person.owner === "historical_researcher")).toBe(true);
    expect(pack.titles.every((title) => title.reviewState === "LANGUAGE_REVIEW_REQUIRED")).toBe(
      true
    );
    expect(pack.knownGaps.join(" ")).toContain("RESEARCH REQUIRED");
    expect(pack.events.find((event) => event.eventId.includes("coercion"))).toMatchObject({
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED"
    });
  });

  test("fails M7 bad references across localization, persons, events, and scenarios", async () => {
    const source = await readM7BetaScenarioFixture();
    const badSource = {
      ...source,
      localization: source.localization.map((entry, index) =>
        index === 0 ? { ...entry, claimIds: ["HIST-M7-FILL-MISSING"] } : entry
      ),
      persons: source.persons.map((person, index) =>
        index === 0 ? { ...person, titleIds: ["title.beta.missing"] } : person
      ),
      events: source.events.map((event, index) =>
        index === 0 ? { ...event, personIds: ["person.beta.missing"] } : event
      ),
      scenarios: source.scenarios.map((scenario, index) =>
        index === 0 ? { ...scenario, eventIds: ["event.beta.missing"] } : scenario
      )
    };

    expect(compileContentPackV0(badSource).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "bad-reference", path: "localization[0].claimIds[0]" }),
        expect.objectContaining({ code: "bad-reference", path: "persons[0].titleIds[0]" }),
        expect.objectContaining({ code: "bad-reference", path: "events[0].personIds[0]" }),
        expect.objectContaining({ code: "bad-reference", path: "scenarios[0].eventIds[0]" })
      ])
    );
  });

  test("fails M7 coercion events without victim and long-term consequence records", async () => {
    const source = await readM7BetaScenarioFixture();
    const badSource = {
      ...source,
      events: source.events.map((event) =>
        event.eventId === "event.beta.coercion-cost-review"
          ? { ...event, violenceCostRecord: null }
          : event
      )
    };

    expect(compileContentPackV0(badSource).errors).toContainEqual(
      expect.objectContaining({
        code: "missing-label",
        path: "events[2].violenceCostRecord"
      })
    );
  });

  test("repeated M7 compiles produce the same manifest hash and runtime order", async () => {
    const source = await readM7BetaScenarioFixture();
    const first = compileContentPackV0OrThrow(source);
    const second = compileContentPackV0OrThrow(structuredClone(source));

    if (
      first.kind !== "runtime-m7-beta-scenario-person-event-content-pack-v0" ||
      second.kind !== "runtime-m7-beta-scenario-person-event-content-pack-v0"
    ) {
      throw new Error("Expected M7 beta scenario/person/event runtime packs.");
    }
    expect(second.manifest.manifestHash).toBe(first.manifest.manifestHash);
    expect(second.scenarios.map((scenario) => scenario.scenarioId)).toEqual(
      first.scenarios.map((scenario) => scenario.scenarioId)
    );
    expect(second.persons.map((person) => person.personId)).toEqual(
      first.persons.map((person) => person.personId)
    );
    expect(second.events.map((event) => event.eventId)).toEqual(
      first.events.map((event) => event.eventId)
    );
  });
});

async function readM3CharacterOfficeFixture(): Promise<M3CharacterOfficeFixtureSourceV0> {
  const text = await readFile(m3CharacterOfficeFixtureUrl, "utf8");
  return parseM3CharacterOfficeFixtureSourceV0(JSON.parse(text) as unknown);
}

async function readM6AlphaScenarioFixture(): Promise<M6AlphaScenarioSetSourceV0> {
  const text = await readFile(m6AlphaScenarioFixtureUrl, "utf8");
  return parseM6AlphaScenarioSetSourceV0(JSON.parse(text) as unknown);
}

async function readM6AlphaMapCandidateFixture(): Promise<M6AlphaMapCandidateSetSourceV0> {
  const text = await readFile(m6AlphaMapCandidateFixtureUrl, "utf8");
  return parseM6AlphaMapCandidateSetSourceV0(JSON.parse(text) as unknown);
}

async function readM7BetaScenarioFixture(): Promise<M7BetaScenarioPersonEventSetSourceV0> {
  const text = await readFile(m7BetaScenarioFixtureUrl, "utf8");
  return parseM7BetaScenarioPersonEventSetSourceV0(JSON.parse(text) as unknown);
}

function requireFirstMapCandidate(
  source: M6AlphaMapCandidateSetSourceV0
): M6AlphaMapCandidateSetSourceV0["candidates"][number] {
  const candidate = source.candidates[0];
  if (candidate === undefined) {
    throw new Error("Expected M6 alpha map candidate fixture to contain a candidate.");
  }
  return candidate;
}

function parseM2BadFixtureManifest(input: unknown): M2BadFixtureManifest {
  if (!isRecord(input)) {
    throw new Error("Bad fixture manifest must be an object.");
  }
  const provenance = input["provenance"];
  if (!isRecord(provenance)) {
    throw new Error("Bad fixture manifest provenance must be an object.");
  }
  const scopeNotes = input["scopeNotes"];
  const cases = input["cases"];
  if (
    input["schemaVersion"] !== 1 ||
    input["kind"] !== "m2.validation-only-bad-fixture-manifest" ||
    typeof input["fixtureSetId"] !== "string" ||
    input["syntheticScope"] !== "m2-prototype-only" ||
    input["historicity"] !== "FICTIONAL" ||
    provenance["sourceCategory"] !== "validation-only-fixture" ||
    provenance["confidence"] !== "LOW" ||
    provenance["policyId"] !== "M2-MAP-SOURCE-POLICY-001" ||
    !isStringArray(scopeNotes) ||
    !Array.isArray(cases) ||
    !cases.every(isM2BadFixtureManifestCase)
  ) {
    throw new Error("Bad fixture manifest shape mismatch.");
  }

  return input as M2BadFixtureManifest;
}

function isM2BadFixtureManifestCase(input: unknown): input is M2BadFixtureManifestCase {
  if (!isRecord(input)) {
    return false;
  }

  return (
    typeof input["caseId"] === "string" &&
    (input["category"] === "bad-map" || input["category"] === "bad-reference") &&
    input["sourceFixture"] === "prototype-world-30-districts.json" &&
    typeof input["mutation"] === "string" &&
    isStringArray(input["expectedErrorCodes"]) &&
    isStringArray(input["expectedPaths"])
  );
}

function isStringArray(input: unknown): input is readonly string[] {
  return Array.isArray(input) && input.every((entry) => typeof entry === "string");
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function mutateStrategicTerrain(
  source: Record<string, unknown>,
  mutate: (terrain: Record<string, unknown>) => void
): Record<string, unknown> {
  const clone = cloneAsMutableRecord(source);
  const terrain = requireMutableRecord(clone["strategicTerrain"]);
  mutate(terrain);
  return clone;
}

function cloneAsMutableRecord(input: unknown): Record<string, unknown> {
  const parsed = JSON.parse(JSON.stringify(input)) as unknown;
  return requireMutableRecord(parsed);
}

function requireMutableRecord(input: unknown): Record<string, unknown> {
  if (!isRecord(input)) {
    throw new Error("Expected mutable record.");
  }
  return input;
}

function requireMutableRecordArray(
  record: Record<string, unknown>,
  key: string
): Record<string, unknown>[] {
  const value = record[key];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(`Expected ${key} to be a mutable record array.`);
  }
  return value;
}

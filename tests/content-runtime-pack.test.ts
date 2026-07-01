import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import {
  createRuntimeContentPackIndexV0,
  createRuntimeM3CharacterOfficeContentPackIndexV0,
  createRuntimeM6AlphaMapCandidateContentPackIndexV0,
  createRuntimeM6AlphaScenarioContentPackIndexV0,
  createRuntimeM7BetaScenarioPersonEventContentPackIndexV0,
  createRuntimeM3PolityVassalageContentPackIndexV0,
  createRuntimeM2WorldContentPackIndexV0,
  parseRuntimeM3CharacterOfficeContentPackV0,
  parseRuntimeM6AlphaMapCandidateContentPackV0,
  parseRuntimeM6AlphaScenarioContentPackV0,
  parseRuntimeM7BetaScenarioPersonEventContentPackV0,
  parseRuntimeM3PolityVassalageContentPackV0,
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
      ],
      topology: {
        adjacencyDerivation: "explicit-route-graph-v1",
        explicitIsolations: [],
        districts: [
          {
            districtId: 1,
            sourceId: "district-001",
            displayNameKey: "content.m2.prototype.district_001",
            anchor: { x: 0, y: 0 },
            polygon: [
              { x: 0, y: 0 },
              { x: 10, y: 0 },
              { x: 10, y: 10 },
              { x: 0, y: 10 }
            ],
            metadata: { historicity: "COMPOSITE", terrainClass: "lowland", riskClass: "low" }
          }
        ],
        routeNodes: [],
        routeEdges: [
          {
            routeId: 1,
            sourceId: "topology-route-001",
            from: { kind: "district", districtId: 1 },
            to: { kind: "settlement", settlementId: 1 },
            mode: "road",
            baseTravelCost: 10,
            baseCapacity: 100,
            seasonality: Array.from({ length: 12 }, (_, index) => ({
              month: index + 1,
              costMultiplierBps: 10000,
              capacityMultiplierBps: 10000,
              reasonCodes: [`runtime.test.month.${index + 1}`]
            })),
            availability: { kind: "open" },
            metadata: { historicity: "COMPOSITE", terrainClass: "lowland", riskClass: "low" }
          }
        ]
      }
    });
    const index = createRuntimeM2WorldContentPackIndexV0(pack);

    expect(index.getDistrict(1)?.sourceId).toBe("district-001");
    expect(index.getSettlement(1)?.districtId).toBe(1);
    expect(index.getRegionalSeasonalCurve(1)?.monthlyValues).toHaveLength(12);
    expect(index).not.toHaveProperty("getDistrictByDisplayName");
    expect(index).not.toHaveProperty("getSettlementByDisplayName");
  });

  test("parses strategic terrain authority and rejects content hash or hidden-id fallback", () => {
    const input = makeRuntimeM2WorldPackWithStrategicTerrain();
    const pack = parseRuntimeM2WorldContentPackV0(input);

    expect(pack.strategicTerrain).toMatchObject({
      authority: "terrain-route-node-v1",
      governanceFootprintRole: "overlay-only",
      contentManifestHash: "ab12cd34"
    });
    expect(pack.strategicTerrain?.authorityProhibitions).toEqual([
      "bounding-box-adjacency",
      "centroid-proximity",
      "hidden-grid",
      "hidden-lattice",
      "hex-axial-or-cube",
      "renderer-only-line-reachability",
      "sequential-id-reachability"
    ]);

    expect(() =>
      parseRuntimeM2WorldContentPackV0({
        ...input,
        strategicTerrain: {
          ...input.strategicTerrain,
          contentManifestHash: "00000000"
        }
      })
    ).toThrow("Strategic terrain contentManifestHash must match manifest manifestHash");

    expect(() =>
      parseRuntimeM2WorldContentPackV0({
        ...input,
        strategicTerrain: {
          ...input.strategicTerrain,
          authorityProhibitions: input.strategicTerrain.authorityProhibitions.filter(
            (prohibition) => prohibition !== "hidden-grid"
          )
        }
      })
    ).toThrow("Strategic terrain authorityProhibitions must include hidden-grid");

    expect(() =>
      parseRuntimeM2WorldContentPackV0({
        ...input,
        strategicTerrain: {
          ...input.strategicTerrain,
          strategicNodes: [withRuntimeStrategicNodeId(input, "row1")]
        }
      })
    ).toThrow("hidden grid, lattice, hex, or sequential id");
  });
});

describe("M3 runtime polity vassalage content pack", () => {
  test("parses abstract polity records, controller references, and obligation schemas", () => {
    const pack = parseRuntimeM3PolityVassalageContentPackV0({
      schemaVersion: 1,
      kind: "runtime-m3-polity-vassalage-content-pack-v0",
      fixtureId: "m3.runtime-test",
      manifest: {
        schemaVersion: 1,
        fixtureId: "m3.runtime-test",
        fixtureKind: "polity-vassalage-fixture",
        syntheticScope: "m3-validation-only",
        historicity: "FICTIONAL",
        manifestHash: "0123abcd",
        polityCount: 2,
        districtCount: 1,
        obligationCount: 1
      },
      polities: [
        {
          id: 1,
          sourceId: "polity-001",
          displayNameKey: "content.m3.validation.polity_001",
          directSuzerainPolityId: null
        },
        {
          id: 2,
          sourceId: "polity-002",
          displayNameKey: "content.m3.validation.polity_002",
          directSuzerainPolityId: 1
        }
      ],
      districts: [
        {
          id: 1,
          sourceId: "district-001",
          displayNameKey: "content.m3.validation.district_001",
          controllerPolityId: 2
        }
      ],
      obligations: [
        {
          id: 1,
          sourceId: "obligation-001",
          debtorPolityId: 2,
          creditorPolityId: 1,
          obligationKind: "tribute",
          requirement: { kind: "amount", resourceKind: "cash", amount: 100 },
          due: { kind: "cadence", periodDays: 90, nextDueDay: 90 },
          status: "active",
          disputeReasonCode: null,
          breachReasonCode: null
        }
      ]
    });
    const index = createRuntimeM3PolityVassalageContentPackIndexV0(pack);

    expect(index.getPolity(2)?.directSuzerainPolityId).toBe(1);
    expect(index.getDistrict(1)?.controllerPolityId).toBe(2);
    expect(index.getObligation(1)?.creditorPolityId).toBe(1);
    expect(index).not.toHaveProperty("getPolityByDisplayName");
  });

  test("rejects duplicate fulfillment-unsafe or cyclic runtime polity packs", () => {
    expect(() =>
      parseRuntimeM3PolityVassalageContentPackV0({
        schemaVersion: 1,
        kind: "runtime-m3-polity-vassalage-content-pack-v0",
        fixtureId: "m3.runtime-test",
        manifest: {
          schemaVersion: 1,
          fixtureId: "m3.runtime-test",
          fixtureKind: "polity-vassalage-fixture",
          syntheticScope: "m3-validation-only",
          historicity: "FICTIONAL",
          manifestHash: "0123abcd",
          polityCount: 2,
          districtCount: 0,
          obligationCount: 0
        },
        polities: [
          {
            id: 1,
            sourceId: "polity-001",
            displayNameKey: "content.m3.validation.polity_001",
            directSuzerainPolityId: 2
          },
          {
            id: 2,
            sourceId: "polity-002",
            displayNameKey: "content.m3.validation.polity_002",
            directSuzerainPolityId: 1
          }
        ],
        districts: [],
        obligations: []
      })
    ).toThrow("RuntimeM3PolityVassalageContentPackV0");
  });
});

describe("M3 runtime character office content pack", () => {
  test("parses abstract characters, sparse relationships, offices, and persistent policies", () => {
    const pack = parseRuntimeM3CharacterOfficeContentPackV0({
      schemaVersion: 1,
      kind: "runtime-m3-character-office-content-pack-v0",
      fixtureId: "m3.runtime-character-office",
      manifest: {
        schemaVersion: 1,
        fixtureId: "m3.runtime-character-office",
        fixtureKind: "character-office-fixture",
        syntheticScope: "m3-validation-only",
        historicity: "FICTIONAL",
        manifestHash: "89abcdef",
        characterCount: 2,
        relationshipCount: 1,
        officeCount: 1,
        landedPowerCount: 1,
        officePolicyCount: 1,
        enfeoffmentHookCount: 1
      },
      characters: [
        {
          id: 1,
          sourceId: "character-001",
          displayNameKey: "content.m3.validation.character_001",
          claimLabel: "FICTIONAL_VALIDATION",
          primaryPolitySourceId: "polity-001",
          archetype: "administrator",
          aptitude: {
            administrationBps: 8400,
            commandBps: 3200,
            diplomacyBps: 6100,
            ambitionBps: 4200,
            legitimacyBps: 5200
          }
        },
        {
          id: 2,
          sourceId: "character-002",
          displayNameKey: "content.m3.validation.character_002",
          claimLabel: "FICTIONAL_VALIDATION",
          primaryPolitySourceId: "polity-001",
          archetype: "local-lord",
          aptitude: {
            administrationBps: 5200,
            commandBps: 6700,
            diplomacyBps: 4800,
            ambitionBps: 5800,
            legitimacyBps: 7900
          }
        }
      ],
      relationships: [
        {
          id: 1,
          sourceId: "relationship-001",
          fromCharacterId: 2,
          toCharacterId: 1,
          relationshipKind: "patron",
          intensityBps: 6200,
          claimLabel: "FICTIONAL_VALIDATION"
        }
      ],
      offices: [
        {
          id: 1,
          sourceId: "office-001",
          displayNameKey: "content.m3.validation.office_001",
          jurisdictionKind: "district",
          jurisdictionSourceId: "district-001",
          currentHolderCharacterId: 1,
          policyId: 1,
          landedPowerId: 1,
          appointmentEligibility: {
            minimumAdministrationBps: 7000,
            minimumCommandBps: 0,
            minimumLegitimacyBps: 3000,
            requiredArchetype: "administrator"
          }
        }
      ],
      landedPowers: [
        {
          id: 1,
          sourceId: "landed-power-001",
          districtSourceId: "district-001",
          extractionRightsBps: 4200,
          levyRightsBps: 2100,
          successionWeightBps: 1200
        }
      ],
      officePolicies: [
        {
          id: 1,
          sourceId: "office-policy-001",
          displayNameKey: "content.m3.validation.office_policy_001",
          appointmentMode: "appointed",
          taxAutonomyBps: 2500,
          militaryAutonomyBps: 1500,
          persistsAcrossHolderChange: true,
          enfeoffmentHookIds: [1]
        }
      ],
      enfeoffmentHooks: [
        {
          id: 1,
          sourceId: "enfeoffment-hook-001",
          trigger: "on-appointment",
          effectKey: "content.m3.validation.enfeoffment_hook_001"
        }
      ]
    });
    const index = createRuntimeM3CharacterOfficeContentPackIndexV0(pack);

    expect(index.getCharacter(1)?.archetype).toBe("administrator");
    expect(index.getRelationship(1)?.fromCharacterId).toBe(2);
    expect(index.getOffice(1)?.policyId).toBe(1);
    expect(index.getOfficePolicy(1)?.persistsAcrossHolderChange).toBe(true);
    expect(index).not.toHaveProperty("getCharacterByDisplayName");
  });

  test("rejects cyclic ancestor relationships and missing office policy references", () => {
    expect(() =>
      parseRuntimeM3CharacterOfficeContentPackV0({
        schemaVersion: 1,
        kind: "runtime-m3-character-office-content-pack-v0",
        fixtureId: "m3.runtime-character-office",
        manifest: {
          schemaVersion: 1,
          fixtureId: "m3.runtime-character-office",
          fixtureKind: "character-office-fixture",
          syntheticScope: "m3-validation-only",
          historicity: "FICTIONAL",
          manifestHash: "89abcdef",
          characterCount: 2,
          relationshipCount: 2,
          officeCount: 1,
          landedPowerCount: 0,
          officePolicyCount: 0,
          enfeoffmentHookCount: 0
        },
        characters: [
          {
            id: 1,
            sourceId: "character-001",
            displayNameKey: "content.m3.validation.character_001",
            claimLabel: "FICTIONAL_VALIDATION",
            primaryPolitySourceId: "polity-001",
            archetype: "administrator",
            aptitude: {
              administrationBps: 8400,
              commandBps: 3200,
              diplomacyBps: 6100,
              ambitionBps: 4200,
              legitimacyBps: 5200
            }
          },
          {
            id: 2,
            sourceId: "character-002",
            displayNameKey: "content.m3.validation.character_002",
            claimLabel: "FICTIONAL_VALIDATION",
            primaryPolitySourceId: "polity-001",
            archetype: "local-lord",
            aptitude: {
              administrationBps: 5200,
              commandBps: 6700,
              diplomacyBps: 4800,
              ambitionBps: 5800,
              legitimacyBps: 7900
            }
          }
        ],
        relationships: [
          {
            id: 1,
            sourceId: "relationship-001",
            fromCharacterId: 1,
            toCharacterId: 2,
            relationshipKind: "parent",
            intensityBps: 10000,
            claimLabel: "FICTIONAL_VALIDATION"
          },
          {
            id: 2,
            sourceId: "relationship-002",
            fromCharacterId: 2,
            toCharacterId: 1,
            relationshipKind: "parent",
            intensityBps: 10000,
            claimLabel: "FICTIONAL_VALIDATION"
          }
        ],
        offices: [
          {
            id: 1,
            sourceId: "office-001",
            displayNameKey: "content.m3.validation.office_001",
            jurisdictionKind: "district",
            jurisdictionSourceId: "district-001",
            currentHolderCharacterId: 1,
            policyId: 1,
            landedPowerId: null,
            appointmentEligibility: {
              minimumAdministrationBps: 7000,
              minimumCommandBps: 0,
              minimumLegitimacyBps: 3000,
              requiredArchetype: "administrator"
            }
          }
        ],
        landedPowers: [],
        officePolicies: [],
        enfeoffmentHooks: []
      })
    ).toThrow("RuntimeM3CharacterOfficeContentPackV0");
  });
});

describe("M6 runtime alpha scenario content pack", () => {
  test("parses scenario claim records and reference IDs without downstream system objects", () => {
    const pack = parseRuntimeM6AlphaScenarioContentPackV0({
      schemaVersion: 1,
      kind: "runtime-m6-alpha-scenario-content-pack-v0",
      fixtureId: "m6.runtime-alpha",
      manifest: {
        schemaVersion: 1,
        fixtureId: "m6.runtime-alpha",
        fixtureKind: "alpha-scenario-set",
        syntheticScope: "m6-alpha-validation",
        manifestHash: "abcdef12",
        sourceCount: 1,
        claimCount: 1,
        referenceTargetCount: 8,
        scenarioCount: 1
      },
      sources: [
        {
          sourceId: "source.docs.09",
          sourceType: "project-research-baseline",
          citationKey: "docs/09-world-history-culture.md",
          accessNote: "Section-level project source."
        }
      ],
      claims: [
        {
          claimId: "HIST-M6-RUNTIME",
          claim: "Runtime test claim.",
          historicity: "COMPOSITE",
          confidence: "MEDIUM",
          sourceIds: ["source.docs.09"],
          sourcePassages: ["section 11"],
          competingInterpretations: [],
          gameAbstraction: "Runtime reference validation only.",
          researchStatus: "SUMMARY_ONLY"
        }
      ],
      referenceTargets: makeRuntimeReferenceTargets(),
      scenarios: [
        {
          sourceId: "scenario.alpha.runtime",
          scenarioKey: "alpha-runtime",
          displayNameKey: "content.m6.alpha.scenario.runtime",
          startYear: 1531,
          dependencyOrder: 1,
          historicity: "COMPOSITE",
          materialClaimIds: ["HIST-M6-RUNTIME"],
          references: makeRuntimeReferenceSets()
        }
      ]
    });
    const index = createRuntimeM6AlphaScenarioContentPackIndexV0(pack);

    expect(index.getScenario("scenario.alpha.runtime")?.startYear).toBe(1531);
    expect(index.getClaim("HIST-M6-RUNTIME")?.researchStatus).toBe("SUMMARY_ONLY");
    expect(index.getSource("source.docs.09")?.sourceType).toBe("project-research-baseline");
    expect(index).not.toHaveProperty("getDiplomacySystem");
    expect(index).not.toHaveProperty("getVictoryEvaluator");
  });

  test("rejects runtime M6 packs with mismatched counts or unstable order", () => {
    expect(() =>
      parseRuntimeM6AlphaScenarioContentPackV0({
        schemaVersion: 1,
        kind: "runtime-m6-alpha-scenario-content-pack-v0",
        fixtureId: "m6.runtime-alpha",
        manifest: {
          schemaVersion: 1,
          fixtureId: "m6.runtime-alpha",
          fixtureKind: "alpha-scenario-set",
          syntheticScope: "m6-alpha-validation",
          manifestHash: "abcdef12",
          sourceCount: 1,
          claimCount: 2,
          referenceTargetCount: 8,
          scenarioCount: 1
        },
        sources: [
          {
            sourceId: "source.docs.09",
            sourceType: "project-research-baseline",
            citationKey: "docs/09-world-history-culture.md",
            accessNote: "Section-level project source."
          }
        ],
        claims: [
          {
            claimId: "HIST-M6-Z-RUNTIME",
            claim: "Runtime test claim.",
            historicity: "COMPOSITE",
            confidence: "MEDIUM",
            sourceIds: ["source.docs.09"],
            sourcePassages: ["section 11"],
            competingInterpretations: [],
            gameAbstraction: "Runtime reference validation only.",
            researchStatus: "SUMMARY_ONLY"
          },
          {
            claimId: "HIST-M6-A-RUNTIME",
            claim: "Runtime test claim.",
            historicity: "COMPOSITE",
            confidence: "MEDIUM",
            sourceIds: ["source.docs.09"],
            sourcePassages: ["section 11"],
            competingInterpretations: [],
            gameAbstraction: "Runtime reference validation only.",
            researchStatus: "SUMMARY_ONLY"
          }
        ],
        referenceTargets: makeRuntimeReferenceTargets(),
        scenarios: [
          {
            sourceId: "scenario.alpha.runtime",
            scenarioKey: "alpha-runtime",
            displayNameKey: "content.m6.alpha.scenario.runtime",
            startYear: 1531,
            dependencyOrder: 1,
            historicity: "COMPOSITE",
            materialClaimIds: ["HIST-M6-Z-RUNTIME"],
            references: makeRuntimeReferenceSets()
          }
        ]
      })
    ).toThrow("RuntimeM6AlphaScenarioContentPackV0");
  });
});

describe("M6 runtime alpha map candidate content pack", () => {
  test("parses map candidate payloads without exposing simulation authority", () => {
    const pack = parseRuntimeM6AlphaMapCandidateContentPackV0(makeRuntimeMapCandidatePack());
    const index = createRuntimeM6AlphaMapCandidateContentPackIndexV0(pack);

    expect(index.getCandidate("map.alpha.runtime")?.districts).toHaveLength(2);
    expect(index.getCandidate("map.alpha.runtime")?.routes[0]).toMatchObject({
      routeReferenceId: "route.alpha.runtime-river",
      waterClass: "mixed"
    });
    expect(index).not.toHaveProperty("getWorldState");
    expect(index).not.toHaveProperty("applyMapToSimulation");
  });

  test("rejects map candidate runtime packs with mismatched counts or bad references", () => {
    const pack = makeRuntimeMapCandidatePack();
    expect(() =>
      parseRuntimeM6AlphaMapCandidateContentPackV0({
        ...pack,
        manifest: {
          ...pack.manifest,
          routeCount: 2
        },
        candidates: [
          {
            ...pack.candidates[0],
            routes: [
              {
                ...pack.candidates[0]?.routes[0],
                toDistrictId: 99
              }
            ]
          }
        ]
      })
    ).toThrow("RuntimeM6AlphaMapCandidateContentPackV0");
  });
});

describe("M7 runtime beta scenario/person/event content pack", () => {
  test("parses review-labeled records and exposes only stable lookup indexes", () => {
    const pack = parseRuntimeM7BetaScenarioPersonEventContentPackV0(makeRuntimeM7BetaPack());
    const index = createRuntimeM7BetaScenarioPersonEventContentPackIndexV0(pack);

    expect(pack.notContentLockAcceptance).toBe(true);
    expect(pack.m6GateCarryForward).toBe("PASS_WITH_LIMITS");
    expect(pack.manualNodeBattleDecision).toBe("DEFER_MANUAL_NODE_BATTLE");
    expect(index.getScenario("scenario.beta.runtime")?.reviewState).toBe("RESEARCH REQUIRED");
    expect(index.getPerson("person.beta.runtime")?.label).toBe("COMPOSITE");
    expect(index.getEvent("event.beta.coercion-runtime")?.violenceCostRecord).toMatchObject({
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED"
    });
    expect(index.getClaim("HIST-M7-FILL-RUNTIME")?.researchStatus).toBe("SUMMARY_ONLY");
    expect(index).not.toHaveProperty("applyEvent");
    expect(index).not.toHaveProperty("getWorldState");
  });

  test("rejects runtime M7 packs with mismatched counts or unstable order", () => {
    const pack = makeRuntimeM7BetaPack();
    expect(() =>
      parseRuntimeM7BetaScenarioPersonEventContentPackV0({
        ...pack,
        manifest: {
          ...pack.manifest,
          personCount: 2
        },
        persons: [
          {
            ...pack.persons[0],
            personId: "person.beta.z-runtime"
          },
          {
            ...pack.persons[0],
            personId: "person.beta.a-runtime"
          }
        ]
      })
    ).toThrow("RuntimeM7BetaScenarioPersonEventContentPackV0");
  });

  test("rejects compiled M7 runtime events that try to enter LOCK_CANDIDATE", async () => {
    const pack = await readCompiledM7BetaScenarioRuntimePack();
    const badPack = cloneAsMutableRecord(pack);
    const events = requireMutableRecordArray(badPack, "events");
    events[2]["reviewState"] = "LOCK_CANDIDATE";

    expect(() => parseRuntimeM7BetaScenarioPersonEventContentPackV0(badPack)).toThrow(
      "LOCK_CANDIDATE"
    );
  });

  test("rejects compiled M7 high-risk runtime events without violence cost records", async () => {
    const pack = await readCompiledM7BetaScenarioRuntimePack();
    const badPack = cloneAsMutableRecord(pack);
    const events = requireMutableRecordArray(badPack, "events");
    events[2]["violenceCostRecord"] = null;

    expect(() => parseRuntimeM7BetaScenarioPersonEventContentPackV0(badPack)).toThrow(
      "violenceCostRecord"
    );
  });

  test("rejects compiled M7 high-risk runtime events with empty violence cost arrays", async () => {
    const pack = await readCompiledM7BetaScenarioRuntimePack();
    const badPack = cloneAsMutableRecord(pack);
    const events = requireMutableRecordArray(badPack, "events");
    const violenceCostRecord = requireMutableRecord(events[2]["violenceCostRecord"]);
    violenceCostRecord["victimGroups"] = [];

    expect(() => parseRuntimeM7BetaScenarioPersonEventContentPackV0(badPack)).toThrow(
      "victimGroups"
    );
  });
});

async function readCompiledM7BetaScenarioRuntimePack() {
  const fixtureUrl = new URL(
    "../content-source/m7-beta-scenarios/beta-scenario-person-event-set.json",
    import.meta.url
  );
  const source = JSON.parse(await readFile(fixtureUrl, "utf8")) as unknown;
  const pack = compileContentPackV0OrThrow(source);
  if (pack.kind !== "runtime-m7-beta-scenario-person-event-content-pack-v0") {
    throw new Error(`Expected compiled M7 beta runtime pack, got ${pack.kind}.`);
  }
  return pack;
}

function cloneAsMutableRecord(input: unknown): Record<string, unknown> {
  const parsed = JSON.parse(JSON.stringify(input)) as unknown;
  return requireMutableRecord(parsed);
}

function requireMutableRecord(input: unknown): Record<string, unknown> {
  if (!isMutableRecord(input)) {
    throw new Error("Expected mutable record.");
  }
  return input;
}

function requireMutableRecordArray(
  record: Record<string, unknown>,
  key: string
): Record<string, unknown>[] {
  const value = record[key];
  if (!Array.isArray(value) || !value.every(isMutableRecord)) {
    throw new Error(`Expected ${key} to be a mutable record array.`);
  }
  return value;
}

function isMutableRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function makeRuntimeReferenceTargets() {
  return {
    diplomacy: [makeRuntimeReferenceTarget("diplomacy.alpha.runtime")],
    legitimacy: [makeRuntimeReferenceTarget("legitimacy.alpha.runtime")],
    succession: [makeRuntimeReferenceTarget("succession.alpha.runtime")],
    mapCandidates: [makeRuntimeReferenceTarget("map.alpha.runtime")],
    policies: [makeRuntimeReferenceTarget("policy.alpha.runtime")],
    events: [makeRuntimeReferenceTarget("event.alpha.runtime")],
    encyclopediaEntries: [makeRuntimeReferenceTarget("encyclopedia.alpha.runtime")],
    startToVictoryFixtures: [makeRuntimeReferenceTarget("fixture.alpha.runtime")]
  };
}

function makeRuntimeM7BetaPack() {
  return {
    schemaVersion: 1,
    kind: "runtime-m7-beta-scenario-person-event-content-pack-v0",
    fixtureId: "m7.beta.runtime",
    notContentLockAcceptance: true,
    m6GateCarryForward: "PASS_WITH_LIMITS",
    manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE",
    manifest: {
      schemaVersion: 1,
      fixtureId: "m7.beta.runtime",
      fixtureKind: "beta-scenario-person-event-set",
      contentScope: "m7-beta-content-fill",
      manifestHash: "abcdef12",
      sourceCount: 1,
      claimCount: 1,
      localizationCount: 1,
      titleCount: 1,
      personCount: 1,
      eventCount: 1,
      scenarioCount: 1,
      knownGapCount: 1
    },
    sourceRecords: [
      {
        sourceId: "source.review.runtime",
        sourceClass: "REVIEW_BASELINE",
        citation: "runtime",
        accessStatus: "FULL_PROJECT_TEXT",
        pageOrSection: "section",
        formalUse: "REVIEW_BASELINE_ONLY"
      }
    ],
    claimRecords: [
      {
        claimId: "HIST-M7-FILL-RUNTIME",
        claim: "Runtime M7 claim.",
        label: "COMPOSITE",
        confidence: "MEDIUM",
        sourceIds: ["source.review.runtime"],
        sourcePassages: ["section"],
        sourceStatements: ["Runtime statement."],
        scholarlyInterpretations: ["Runtime interpretation."],
        researcherInference: "Runtime inference.",
        competingInterpretations: [],
        gameAbstraction: "Runtime validation only.",
        researchStatus: "SUMMARY_ONLY",
        humanGate: false
      }
    ],
    localization: [
      {
        key: "content.m7.beta.runtime.name",
        zhHans: "运行时",
        english: "Runtime",
        sourceNote: "Runtime note.",
        context: "Runtime context.",
        characterLimit: 24,
        sourceIds: ["source.review.runtime"],
        claimIds: ["HIST-M7-FILL-RUNTIME"],
        reviewState: "SCHEMA_VALIDATED",
        owner: "historical_researcher",
        deterministicOrder: 1
      }
    ],
    titles: [
      {
        titleId: "title.beta.runtime",
        localizationKey: "content.m7.beta.runtime.name",
        label: "RESEARCH REQUIRED",
        confidence: "LOW",
        sourceIds: ["source.review.runtime"],
        claimIds: ["HIST-M7-FILL-RUNTIME"],
        reviewState: "LANGUAGE_REVIEW_REQUIRED",
        owner: "historical_researcher",
        deterministicOrder: 1
      }
    ],
    persons: [
      {
        personId: "person.beta.runtime",
        displayNameKey: "content.m7.beta.runtime.name",
        titleIds: ["title.beta.runtime"],
        label: "COMPOSITE",
        confidence: "LOW",
        sourceIds: ["source.review.runtime"],
        claimIds: ["HIST-M7-FILL-RUNTIME"],
        reviewState: "LANGUAGE_REVIEW_REQUIRED",
        owner: "historical_researcher",
        scenarioIds: ["scenario.beta.runtime"],
        roleTag: "runtime",
        deterministicOrder: 1
      }
    ],
    events: [
      {
        eventId: "event.beta.coercion-runtime",
        localizationKey: "content.m7.beta.runtime.name",
        label: "RESEARCH REQUIRED",
        confidence: "LOW",
        sourceIds: ["source.review.runtime"],
        claimIds: ["HIST-M7-FILL-RUNTIME"],
        reviewState: "CULTURE_HUMAN_GATE_REQUIRED",
        owner: "historical_researcher",
        triggerKey: "runtime",
        scenarioIds: ["scenario.beta.runtime"],
        personIds: ["person.beta.runtime"],
        titleIds: ["title.beta.runtime"],
        choices: [
          {
            choiceId: "choice.beta.runtime",
            localizationKey: "content.m7.beta.runtime.name",
            aiReasonKey: "content.m7.beta.runtime.name",
            costSummaryKey: "content.m7.beta.runtime.name"
          }
        ],
        violenceCostRecord: {
          victimGroups: ["runtime victim group"],
          sourceRegions: ["runtime source region"],
          immediateCosts: ["runtime immediate cost"],
          longTermConsequences: ["runtime long-term consequence"],
          reviewState: "CULTURE_HUMAN_GATE_REQUIRED"
        },
        deterministicOrder: 1
      }
    ],
    scenarios: [
      {
        scenarioId: "scenario.beta.runtime",
        scenarioKey: "beta-runtime",
        displayNameKey: "content.m7.beta.runtime.name",
        startYear: 1531,
        label: "COMPOSITE",
        confidence: "LOW",
        sourceIds: ["source.review.runtime"],
        claimIds: ["HIST-M7-FILL-RUNTIME"],
        reviewState: "RESEARCH REQUIRED",
        owner: "historical_researcher",
        personIds: ["person.beta.runtime"],
        titleIds: ["title.beta.runtime"],
        eventIds: ["event.beta.coercion-runtime"],
        localizationKeys: ["content.m7.beta.runtime.name"],
        hooks: [
          {
            hookId: "hook.beta.runtime",
            hookKind: "start",
            localizationKey: "content.m7.beta.runtime.name",
            targetIds: ["person.beta.runtime"]
          }
        ],
        deterministicOrder: 1
      }
    ],
    knownGaps: ["RESEARCH REQUIRED runtime gap."]
  };
}

function makeRuntimeM2WorldPackWithStrategicTerrain() {
  return {
    schemaVersion: 1,
    kind: "runtime-m2-world-content-pack-v0",
    fixtureId: "m2.runtime-strategic-terrain",
    manifest: {
      schemaVersion: 1,
      fixtureId: "m2.runtime-strategic-terrain",
      fixtureKind: "prototype-world-fixture",
      syntheticScope: "m2-prototype-only",
      historicity: "FICTIONAL",
      manifestHash: "ab12cd34",
      districtCount: 2,
      settlementCount: 1,
      regionalSeasonalCurveCount: 1,
      routeCount: 1,
      mapGeometryCount: 3
    },
    districts: [
      {
        id: 1,
        sourceId: "district-001",
        displayNameKey: "content.m2.prototype.district_001",
        regionalCurveId: 1,
        mapGeometryId: 1
      },
      {
        id: 2,
        sourceId: "district-002",
        displayNameKey: "content.m2.prototype.district_002",
        regionalCurveId: 1,
        mapGeometryId: 2
      }
    ],
    settlements: [
      {
        id: 1,
        sourceId: "settlement-001",
        displayNameKey: "content.m2.prototype.settlement_001",
        districtId: 1,
        mapGeometryId: 3
      }
    ],
    regionalSeasonalCurves: [
      {
        id: 1,
        sourceId: "curve-001",
        displayNameKey: "content.m2.prototype.curve_001",
        monthlyValues: Array.from({ length: 12 }, (_unused, index) => ({
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
        toDistrictId: 2,
        routeKind: "road",
        baseTravelCost: 5
      }
    ],
    mapGeometries: [
      {
        id: 1,
        sourceId: "geom-district-001",
        ownerKind: "district",
        ownerId: 1,
        geometryKind: "polygon",
        anchor: { x: 10, y: 10 },
        points: [
          { x: 0, y: 0 },
          { x: 20, y: 0 },
          { x: 20, y: 20 },
          { x: 0, y: 20 }
        ]
      },
      {
        id: 2,
        sourceId: "geom-district-002",
        ownerKind: "district",
        ownerId: 2,
        geometryKind: "polygon",
        anchor: { x: 30, y: 10 },
        points: [
          { x: 20, y: 0 },
          { x: 40, y: 0 },
          { x: 40, y: 20 },
          { x: 20, y: 20 }
        ]
      },
      {
        id: 3,
        sourceId: "geom-settlement-001",
        ownerKind: "settlement",
        ownerId: 1,
        geometryKind: "point",
        anchor: { x: 10, y: 10 },
        points: []
      }
    ],
    topology: {
      adjacencyDerivation: "explicit-route-graph-v1",
      explicitIsolations: [],
      districts: [
        {
          districtId: 1,
          sourceId: "district-001",
          displayNameKey: "content.m2.prototype.district_001",
          anchor: { x: 10, y: 10 },
          polygon: [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
            { x: 20, y: 20 }
          ],
          metadata: { historicity: "COMPOSITE", terrainClass: "lowland", riskClass: "low" }
        },
        {
          districtId: 2,
          sourceId: "district-002",
          displayNameKey: "content.m2.prototype.district_002",
          anchor: { x: 30, y: 10 },
          polygon: [
            { x: 20, y: 0 },
            { x: 40, y: 0 },
            { x: 40, y: 20 }
          ],
          metadata: { historicity: "COMPOSITE", terrainClass: "upland", riskClass: "low" }
        }
      ],
      routeNodes: [],
      routeEdges: [
        {
          routeId: 1,
          sourceId: "topology-route-001",
          from: { kind: "district", districtId: 1 },
          to: { kind: "district", districtId: 2 },
          mode: "road",
          baseTravelCost: 5,
          baseCapacity: 100,
          seasonality: Array.from({ length: 12 }, (_unused, index) => ({
            month: index + 1,
            costMultiplierBps: 10000,
            capacityMultiplierBps: 10000,
            reasonCodes: [`runtime.test.month.${index + 1}`]
          })),
          availability: { kind: "open" },
          metadata: { historicity: "COMPOSITE", terrainClass: "lowland", riskClass: "low" }
        }
      ]
    },
    strategicTerrain: {
      schemaVersion: 1,
      hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1",
      contentManifestHash: "ab12cd34",
      authority: "terrain-route-node-v1",
      governanceFootprintRole: "overlay-only",
      authorityProhibitions: [
        "bounding-box-adjacency",
        "centroid-proximity",
        "hidden-grid",
        "hidden-lattice",
        "hex-axial-or-cube",
        "renderer-only-line-reachability",
        "sequential-id-reachability"
      ],
      terrainPatches: [
        {
          patchId: "patch.runtime-lowland",
          sourceId: "runtime.patch.lowland",
          displayNameKey: "content.m2.prototype.terrain.lowland",
          terrainClass: "lowland",
          seasonSensitivity: "monsoon",
          historicity: "COMPOSITE",
          polygon: [
            { x: 0, y: 0 },
            { x: 40, y: 0 },
            { x: 40, y: 20 }
          ],
          explanationTags: ["runtime.terrain.lowland"]
        }
      ],
      barrierChannels: [
        {
          channelId: "channel.runtime-ridge",
          sourceId: "runtime.channel.ridge",
          displayNameKey: "content.m2.prototype.channel.ridge",
          channelKind: "ridge",
          traversalRule: "blocks-without-explicit-corridor",
          historicity: "COMPOSITE",
          points: [
            { x: 20, y: 0 },
            { x: 20, y: 20 }
          ],
          explanationTags: ["runtime.channel.ridge"]
        }
      ],
      strategicNodes: [
        {
          nodeId: "node.runtime-port",
          sourceId: "runtime.node.port",
          displayNameKey: "content.m2.prototype.node.port",
          nodeKind: "port",
          districtId: 1,
          anchor: { x: 10, y: 10 },
          localCapacity: 100,
          knownState: "known",
          terrainPatchIds: ["patch.runtime-lowland"],
          barrierChannelIds: [],
          governanceFootprintIds: ["footprint.runtime-capital"],
          explanationTags: ["runtime.node.port"]
        },
        {
          nodeId: "node.runtime-fort",
          sourceId: "runtime.node.fort",
          displayNameKey: "content.m2.prototype.node.fort",
          nodeKind: "castle",
          districtId: 2,
          anchor: { x: 30, y: 10 },
          localCapacity: 80,
          knownState: "known",
          terrainPatchIds: ["patch.runtime-lowland"],
          barrierChannelIds: ["channel.runtime-ridge"],
          governanceFootprintIds: ["footprint.runtime-upland"],
          explanationTags: ["runtime.node.fort"]
        }
      ],
      routeCorridors: [
        {
          corridorId: "corridor.runtime-road",
          sourceId: "runtime.corridor.road",
          displayNameKey: "content.m2.prototype.corridor.road",
          fromNodeId: "node.runtime-port",
          toNodeId: "node.runtime-fort",
          mode: "road",
          widthClass: "standard",
          baseTravelCost: 5,
          baseCapacity: 100,
          riskClass: "low",
          terrainPatchIds: ["patch.runtime-lowland"],
          barrierChannelIds: ["channel.runtime-ridge"],
          governanceFootprintIds: ["footprint.runtime-capital", "footprint.runtime-upland"],
          seasonality: Array.from({ length: 12 }, (_unused, index) => ({
            month: index + 1,
            seasonState: "dry",
            travelCostMultiplierBps: 10000,
            capacityMultiplierBps: 10000,
            riskBps: 100,
            reasonCodes: [`runtime.strategic.month.${index + 1}`]
          })),
          availability: { kind: "open" },
          polyline: [
            { x: 10, y: 10 },
            { x: 30, y: 10 }
          ],
          explanationTags: ["runtime.corridor.road"]
        }
      ],
      districtGovernanceFootprints: [
        {
          footprintId: "footprint.runtime-capital",
          sourceId: "runtime.footprint.capital",
          displayNameKey: "content.m2.prototype.footprint.capital",
          districtId: 1,
          overlayOnly: true,
          polygon: [
            { x: 0, y: 0 },
            { x: 20, y: 0 },
            { x: 20, y: 20 }
          ],
          governanceTags: ["runtime.governance.control"],
          consequenceTags: ["runtime.governance.obligation"]
        },
        {
          footprintId: "footprint.runtime-upland",
          sourceId: "runtime.footprint.upland",
          displayNameKey: "content.m2.prototype.footprint.upland",
          districtId: 2,
          overlayOnly: true,
          polygon: [
            { x: 20, y: 0 },
            { x: 40, y: 0 },
            { x: 40, y: 20 }
          ],
          governanceTags: ["runtime.governance.appointment"],
          consequenceTags: ["runtime.governance.postwar"]
        }
      ]
    }
  };
}

function withRuntimeStrategicNodeId(
  input: ReturnType<typeof makeRuntimeM2WorldPackWithStrategicTerrain>,
  nodeId: string
): ReturnType<
  typeof makeRuntimeM2WorldPackWithStrategicTerrain
>["strategicTerrain"]["strategicNodes"][number] {
  const firstNode = input.strategicTerrain.strategicNodes[0];
  if (firstNode === undefined) {
    throw new Error("Expected runtime strategic terrain node.");
  }

  return {
    ...firstNode,
    nodeId
  };
}

function makeRuntimeReferenceTarget(sourceId: string) {
  return {
    sourceId,
    displayNameKey: "content.m6.alpha.reference.runtime",
    claimId: "HIST-M6-RUNTIME"
  };
}

function makeRuntimeReferenceSets() {
  return {
    diplomacy: ["diplomacy.alpha.runtime"],
    legitimacy: ["legitimacy.alpha.runtime"],
    succession: ["succession.alpha.runtime"],
    mapCandidates: ["map.alpha.runtime"],
    policies: ["policy.alpha.runtime"],
    events: ["event.alpha.runtime"],
    encyclopediaEntries: ["encyclopedia.alpha.runtime"],
    startToVictoryFixtures: ["fixture.alpha.runtime"]
  };
}

function makeRuntimeMapCandidatePack() {
  return {
    schemaVersion: 1,
    kind: "runtime-m6-alpha-map-candidate-content-pack-v0",
    fixtureId: "m6.alpha.map.runtime",
    manifest: {
      schemaVersion: 1,
      fixtureId: "m6.alpha.map.runtime",
      fixtureKind: "alpha-map-candidate-set",
      syntheticScope: "m6-alpha-map-candidate-validation",
      manifestHash: "1234abcd",
      candidateCount: 1,
      districtCount: 2,
      settlementCount: 1,
      routeCount: 1
    },
    candidates: [
      {
        id: 1,
        sourceId: "map.alpha.runtime",
        displayNameKey: "content.m6.alpha.map.runtime",
        historicity: "COMPOSITE",
        confidence: "LOW",
        sourceLabel: "COMPOSITE",
        reviewNotes: ["Alpha runtime map candidate review note."],
        bounds: { widthInMapUnits: 120, heightInMapUnits: 90 },
        districts: [
          {
            id: 1,
            sourceId: "district.alpha.land",
            districtReferenceId: "district.alpha.land",
            displayNameKey: "content.m6.alpha.map.district.land",
            landWaterClass: "land",
            renderOrder: 10,
            anchor: { x: 20, y: 20 },
            polygon: [
              { x: 0, y: 0 },
              { x: 40, y: 0 },
              { x: 40, y: 40 }
            ]
          },
          {
            id: 2,
            sourceId: "district.alpha.water",
            districtReferenceId: "district.alpha.water",
            displayNameKey: "content.m6.alpha.map.district.water",
            landWaterClass: "water",
            renderOrder: 20,
            anchor: { x: 80, y: 60 },
            polygon: [
              { x: 60, y: 40 },
              { x: 120, y: 40 },
              { x: 120, y: 90 }
            ]
          }
        ],
        settlements: [
          {
            id: 1,
            sourceId: "settlement.alpha.land",
            settlementReferenceId: "settlement.alpha.land",
            districtReferenceId: "district.alpha.land",
            districtId: 1,
            displayNameKey: "content.m6.alpha.map.settlement.land",
            renderOrder: 10,
            anchor: { x: 22, y: 20 }
          }
        ],
        routes: [
          {
            id: 1,
            sourceId: "route.alpha.runtime-river",
            routeReferenceId: "route.alpha.runtime-river",
            fromDistrictReferenceId: "district.alpha.land",
            toDistrictReferenceId: "district.alpha.water",
            fromDistrictId: 1,
            toDistrictId: 2,
            routeKind: "river",
            waterClass: "mixed",
            renderOrder: 10,
            points: [
              { x: 20, y: 20 },
              { x: 80, y: 60 }
            ]
          }
        ]
      }
    ]
  };
}

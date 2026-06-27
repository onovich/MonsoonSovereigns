import { describe, expect, test } from "vitest";

import {
  createRuntimeContentPackIndexV0,
  createRuntimeM3CharacterOfficeContentPackIndexV0,
  createRuntimeM6AlphaScenarioContentPackIndexV0,
  createRuntimeM3PolityVassalageContentPackIndexV0,
  createRuntimeM2WorldContentPackIndexV0,
  parseRuntimeM3CharacterOfficeContentPackV0,
  parseRuntimeM6AlphaScenarioContentPackV0,
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

import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import {
  parseM3PolityVassalageFixtureSourceV0,
  parseM6AlphaMapCandidateSetSourceV0,
  parseM6AlphaScenarioSetSourceV0,
  parseM3CharacterOfficeFixtureSourceV0,
  parseM2WorldFixtureSourceV0,
  validateM2WorldFixtureSourceV0,
  validateM3CharacterOfficeFixtureSourceV0,
  validateM6AlphaMapCandidateSetSourceV0,
  validateM6AlphaScenarioSetSourceV0,
  validateM3PolityVassalageFixtureSourceV0,
  parseM1GraphFixtureSourceV0,
  validateM1GraphFixtureSourceV0
} from "../packages/content-schema/src/index";

const m7HistoricalReviewBaselineUrl = new URL(
  "../content-source/m7-review-baseline/historical-cultural-language-review-baseline.json",
  import.meta.url
);

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

describe("M3 polity vassalage fixture source schema", () => {
  test("parses abstract validation polity, controller, and obligation records", () => {
    const source = parseM3PolityVassalageFixtureSourceV0({
      schemaVersion: 1,
      kind: "m3.polity-vassalage-fixture",
      fixtureId: "m3.validation-polity",
      fixtureKind: "polity-vassalage-fixture",
      syntheticScope: "m3-validation-only",
      historicity: "FICTIONAL",
      provenance: {
        sourceCategory: "validation-only-fixture",
        confidence: "LOW",
        policyId: "M3-HISTORICAL-CLAIM-PIPELINE-001"
      },
      polities: [
        {
          sourceId: "polity-001",
          displayNameKey: "content.m3.validation.polity_001",
          directSuzerainPolityId: null
        },
        {
          sourceId: "polity-002",
          displayNameKey: "content.m3.validation.polity_002",
          directSuzerainPolityId: "polity-001"
        }
      ],
      districts: [
        {
          sourceId: "district-001",
          displayNameKey: "content.m3.validation.district_001",
          controllerPolityId: "polity-002"
        }
      ],
      obligations: [
        {
          sourceId: "obligation-001",
          debtorPolityId: "polity-002",
          creditorPolityId: "polity-001",
          obligationKind: "tribute",
          requirement: { kind: "amount", resourceKind: "cash", amount: 100 },
          due: { kind: "cadence", periodDays: 90, nextDueDay: 90 },
          status: "active",
          disputeReasonCode: null,
          breachReasonCode: null
        }
      ]
    });

    expect(source.historicity).toBe("FICTIONAL");
    expect(source.polities[1]?.directSuzerainPolityId).toBe("polity-001");
    expect(source.obligations[0]?.requirement).toMatchObject({ kind: "amount", amount: 100 });
  });

  test("requires abstract M3 validation-only provenance", () => {
    expect(
      validateM3PolityVassalageFixtureSourceV0({
        schemaVersion: 1,
        kind: "m3.polity-vassalage-fixture",
        fixtureId: "m3.bad",
        fixtureKind: "polity-vassalage-fixture",
        syntheticScope: "m3-validation-only",
        historicity: "HISTORICAL",
        provenance: {
          sourceCategory: "production-content",
          confidence: "HIGH",
          policyId: "missing-policy"
        },
        polities: [],
        districts: [],
        obligations: []
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "historicity" }),
        expect.objectContaining({ code: "invalid-schema", path: "provenance.sourceCategory" }),
        expect.objectContaining({ code: "invalid-schema", path: "provenance.policyId" })
      ])
    );
  });
});

describe("M3 character office fixture source schema", () => {
  test("parses abstract validation characters, relationships, offices, and policies", () => {
    const source = parseM3CharacterOfficeFixtureSourceV0({
      schemaVersion: 1,
      kind: "m3.character-office-fixture",
      fixtureId: "m3.validation-character-office",
      fixtureKind: "character-office-fixture",
      syntheticScope: "m3-validation-only",
      historicity: "FICTIONAL",
      provenance: {
        sourceCategory: "validation-only-fixture",
        confidence: "LOW",
        policyId: "M3-HISTORICAL-CLAIM-PIPELINE-001"
      },
      characters: [
        {
          sourceId: "character-001",
          displayNameKey: "content.m3.validation.character_001",
          claimLabel: "FICTIONAL_VALIDATION",
          primaryPolityId: "polity-001",
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
          sourceId: "character-002",
          displayNameKey: "content.m3.validation.character_002",
          claimLabel: "FICTIONAL_VALIDATION",
          primaryPolityId: "polity-001",
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
          sourceId: "relationship-001",
          fromCharacterId: "character-002",
          toCharacterId: "character-001",
          relationshipKind: "patron",
          intensityBps: 6200,
          claimLabel: "FICTIONAL_VALIDATION"
        }
      ],
      offices: [
        {
          sourceId: "office-001",
          displayNameKey: "content.m3.validation.office_001",
          jurisdictionKind: "district",
          jurisdictionId: "district-001",
          currentHolderCharacterId: "character-001",
          policyId: "office-policy-001",
          landedPowerId: "landed-power-001",
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
          sourceId: "landed-power-001",
          districtId: "district-001",
          extractionRightsBps: 4200,
          levyRightsBps: 2100,
          successionWeightBps: 1200
        }
      ],
      officePolicies: [
        {
          sourceId: "office-policy-001",
          displayNameKey: "content.m3.validation.office_policy_001",
          appointmentMode: "appointed",
          taxAutonomyBps: 2500,
          militaryAutonomyBps: 1500,
          persistsAcrossHolderChange: true,
          enfeoffmentHookIds: ["enfeoffment-hook-001"]
        }
      ],
      enfeoffmentHooks: [
        {
          sourceId: "enfeoffment-hook-001",
          trigger: "on-appointment",
          effectKey: "content.m3.validation.enfeoffment_hook_001"
        }
      ]
    });

    expect(source.historicity).toBe("FICTIONAL");
    expect(source.characters[0]?.claimLabel).toBe("FICTIONAL_VALIDATION");
    expect(source.offices[0]?.appointmentEligibility.requiredArchetype).toBe("administrator");
    expect(source.officePolicies[0]?.persistsAcrossHolderChange).toBe(true);
  });

  test("requires abstract M3 validation-only character and office provenance", () => {
    expect(
      validateM3CharacterOfficeFixtureSourceV0({
        schemaVersion: 1,
        kind: "m3.character-office-fixture",
        fixtureId: "m3.bad-character-office",
        fixtureKind: "character-office-fixture",
        syntheticScope: "m3-validation-only",
        historicity: "HISTORICAL",
        provenance: {
          sourceCategory: "production-content",
          confidence: "HIGH",
          policyId: "missing-policy"
        },
        characters: [
          {
            sourceId: "character-001",
            displayNameKey: "content.m3.validation.character_001",
            claimLabel: "HISTORICAL",
            primaryPolityId: "polity-001",
            archetype: "administrator",
            aptitude: {
              administrationBps: 1000,
              commandBps: 1000,
              diplomacyBps: 1000,
              ambitionBps: 1000,
              legitimacyBps: 1000
            }
          }
        ],
        relationships: [],
        offices: [],
        landedPowers: [],
        officePolicies: [],
        enfeoffmentHooks: []
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "historicity" }),
        expect.objectContaining({ code: "invalid-schema", path: "provenance.sourceCategory" }),
        expect.objectContaining({ code: "invalid-schema", path: "characters[0].claimLabel" })
      ])
    );
  });
});

describe("M6 alpha scenario source schema", () => {
  test("parses source, claim, downstream-reference, and scenario records", () => {
    const source = parseM6AlphaScenarioSetSourceV0({
      schemaVersion: 1,
      kind: "m6.alpha-scenario-set",
      fixtureId: "m6.alpha.test",
      fixtureKind: "alpha-scenario-set",
      syntheticScope: "m6-alpha-validation",
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
          claimId: "HIST-M6-TEST-HISTORICAL",
          claim: "A test historical claim.",
          historicity: "HISTORICAL",
          confidence: "LOW",
          sourceIds: ["source.docs.09"],
          sourcePassages: ["section 11"],
          competingInterpretations: ["Pending page verification."],
          gameAbstraction: "Validation-only anchor.",
          researchStatus: "RESEARCH_REQUIRED"
        },
        {
          claimId: "HIST-M6-TEST-FICTIONAL",
          claim: "A test fictional claim.",
          historicity: "FICTIONAL",
          confidence: "HIGH",
          sourceIds: [],
          sourcePassages: [],
          competingInterpretations: [],
          gameAbstraction: "Validation-only IDs.",
          researchStatus: "PAGE_VERIFIED"
        }
      ],
      referenceTargets: makeReferenceTargets("HIST-M6-TEST-HISTORICAL"),
      scenarios: [
        {
          sourceId: "scenario.alpha.test",
          scenarioKey: "alpha-test",
          displayNameKey: "content.m6.alpha.scenario.test",
          startYear: 1531,
          dependencyOrder: 1,
          historicity: "COMPOSITE",
          materialClaimIds: ["HIST-M6-TEST-HISTORICAL", "HIST-M6-TEST-FICTIONAL"],
          references: makeReferenceSets()
        }
      ]
    });

    expect(source.claims.map((claim) => claim.historicity)).toEqual(["HISTORICAL", "FICTIONAL"]);
    expect(source.scenarios[0]?.references.diplomacy).toEqual(["diplomacy.alpha.test"]);
  });

  test("requires M6 labels, source arrays, and reference sets with path-specific errors", () => {
    expect(
      validateM6AlphaScenarioSetSourceV0({
        schemaVersion: 1,
        kind: "m6.alpha-scenario-set",
        fixtureId: "m6.alpha.bad",
        fixtureKind: "alpha-scenario-set",
        syntheticScope: "m6-alpha-validation",
        sources: [],
        claims: [
          {
            claimId: "bad-claim",
            claim: "",
            historicity: "FORMAL",
            confidence: "HIGH",
            sourceIds: "source.docs.09",
            sourcePassages: [],
            competingInterpretations: [],
            gameAbstraction: "",
            researchStatus: "UNKNOWN"
          }
        ],
        referenceTargets: {},
        scenarios: [
          {
            sourceId: "scenario.alpha.bad",
            scenarioKey: "Alpha Bad",
            displayNameKey: "content.m6.alpha.scenario.bad",
            startYear: 1520,
            dependencyOrder: 1,
            historicity: "COMPOSITE",
            materialClaimIds: [],
            references: {}
          }
        ]
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "claims[0].claimId" }),
        expect.objectContaining({ code: "invalid-schema", path: "claims[0].historicity" }),
        expect.objectContaining({ code: "invalid-schema", path: "claims[0].sourceIds" }),
        expect.objectContaining({ code: "invalid-schema", path: "scenarios[0].scenarioKey" }),
        expect.objectContaining({ code: "invalid-schema", path: "scenarios[0].startYear" }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "scenarios[0].references.diplomacy"
        })
      ])
    );
  });
});

describe("M6 alpha map candidate source schema", () => {
  test("parses candidate IDs, references, water classes, and review notes", () => {
    const source = parseM6AlphaMapCandidateSetSourceV0(makeMapCandidateSource());

    expect(source.candidates[0]?.sourceId).toBe("map.alpha.test-candidate");
    expect(source.candidates[0]?.districts.map((district) => district.landWaterClass)).toEqual([
      "land",
      "water"
    ]);
    expect(source.candidates[0]?.routes[0]?.waterClass).toBe("mixed");
    expect(source.candidates[0]?.reviewNotes[0]).toContain("Alpha");
  });

  test("returns path-specific errors for invalid map candidate classifications", () => {
    const source = makeMapCandidateSource();
    expect(
      validateM6AlphaMapCandidateSetSourceV0({
        ...source,
        candidates: [
          {
            ...source.candidates[0],
            districts: source.candidates[0]?.districts.map((district, index) =>
              index === 0 ? { ...district, landWaterClass: "forest" } : district
            ),
            routes: source.candidates[0]?.routes.map((route, index) =>
              index === 0 ? { ...route, waterClass: "deep-sea" } : route
            )
          }
        ]
      })
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "candidates[0].districts[0].landWaterClass"
        }),
        expect.objectContaining({
          code: "invalid-schema",
          path: "candidates[0].routes[0].waterClass"
        })
      ])
    );
  });
});

describe("M7 historical, cultural, and language review baseline", () => {
  test("records review scope without approving formal content lock", async () => {
    const baseline = await readM7HistoricalReviewBaseline();

    expect(baseline.kind).toBe("m7.historical-cultural-language-review-baseline");
    expect(baseline.taskId).toBe("M7-HISTORICAL-CULTURAL-LANGUAGE-REVIEW-001");
    expect(baseline.scope.notContentLockAcceptance).toBe(true);
    expect(baseline.scope.formalContentLockHumanGate).toBe("M7-CONTENT-LOCK-ACCEPTANCE-001");
    expect(baseline.scope.m6GateCarryForward).toBe("PASS_WITH_LIMITS");
    expect(baseline.scope.manualNodeBattleDecision).toBe("DEFER_MANUAL_NODE_BATTLE");
    expect(baseline.acceptedBetaRealWorldClaims).toHaveLength(0);
    expect(new Set(baseline.allowedLabels)).toEqual(
      new Set(["HISTORICAL", "INFERRED", "COMPOSITE", "FICTIONAL", "RESEARCH REQUIRED"])
    );
  });

  test("keeps every baseline claim tagged, sourced, and split by evidence layer", async () => {
    const baseline = await readM7HistoricalReviewBaseline();
    const sourceIds = new Set(baseline.sourceRecords.map((source) => source.sourceId));

    for (const claim of baseline.claimRecords) {
      expect(baseline.allowedLabels).toContain(claim.label);
      expect(claim.claimId).toMatch(/^HIST-M7-/u);
      expect(claim.sourceStatements.length).toBeGreaterThan(0);
      expect(claim.scholarlyInterpretations.length).toBeGreaterThan(0);
      expect(claim.researcherInference.length).toBeGreaterThan(0);
      expect(claim.gameAbstraction.length).toBeGreaterThan(0);
      expect(claim.sourcePassages.length).toBeGreaterThan(0);
      expect(claim.sourceIds.every((sourceId) => sourceIds.has(sourceId))).toBe(true);
    }

    expect(
      baseline.sourceRecords
        .filter((source) => source.formalUse === "CANDIDATE_SOURCE_ONLY")
        .every(
          (source) =>
            source.accessStatus === "BIBLIOGRAPHIC_METADATA_ONLY" &&
            source.pageOrSection === "RESEARCH REQUIRED"
        )
    ).toBe(true);
  });

  test("routes high-risk cultural material and violence-cost failures to Human Gate", async () => {
    const baseline = await readM7HistoricalReviewBaseline();
    const humanGateClaimIds = new Set(
      baseline.claimRecords.filter((claim) => claim.humanGate).map((claim) => claim.claimId)
    );

    expect(humanGateClaimIds).toEqual(
      new Set([
        "HIST-M7-BASELINE-002-NO-MODERN-IDENTITY-SHORTCUT",
        "HIST-M7-BASELINE-005-VIOLENCE-COSTS",
        "HIST-M7-BASELINE-007-SYMBOLS-ART-MUSIC",
        "HIST-M7-BASELINE-008-RELIGION-NOT-SIMPLE-CONFLICT"
      ])
    );
    expect(
      baseline.reviewGates.some(
        (gate) =>
          gate.gateId === "M7-HIST-GATE-VIOLENCE-COST" &&
          gate.minimumEvidence.includes("Victim group") &&
          gate.humanGateWhen.includes("cost-free optimal reward")
      )
    ).toBe(true);
    expect(baseline.biasReview.mustScanFor).toEqual(
      expect.arrayContaining([
        "modern national border projection",
        "modern ethnic essentialism",
        "victor chronicle causality treated as neutral fact",
        "colonial-era ethnic categories treated as timeless",
        "coercion framed as clean efficiency"
      ])
    );
  });
});

function makeReferenceTargets(claimId: string) {
  return {
    diplomacy: [makeReferenceTarget("diplomacy.alpha.test", claimId)],
    legitimacy: [makeReferenceTarget("legitimacy.alpha.test", claimId)],
    succession: [makeReferenceTarget("succession.alpha.test", claimId)],
    mapCandidates: [makeReferenceTarget("map.alpha.test", claimId)],
    policies: [makeReferenceTarget("policy.alpha.test", claimId)],
    events: [makeReferenceTarget("event.alpha.test", claimId)],
    encyclopediaEntries: [makeReferenceTarget("encyclopedia.alpha.test", claimId)],
    startToVictoryFixtures: [makeReferenceTarget("fixture.alpha.test", claimId)]
  };
}

function makeReferenceTarget(sourceId: string, claimId: string) {
  return {
    sourceId,
    displayNameKey: "content.m6.alpha.reference.test",
    claimId
  };
}

function makeReferenceSets() {
  return {
    diplomacy: ["diplomacy.alpha.test"],
    legitimacy: ["legitimacy.alpha.test"],
    succession: ["succession.alpha.test"],
    mapCandidates: ["map.alpha.test"],
    policies: ["policy.alpha.test"],
    events: ["event.alpha.test"],
    encyclopediaEntries: ["encyclopedia.alpha.test"],
    startToVictoryFixtures: ["fixture.alpha.test"]
  };
}

function makeMapCandidateSource() {
  return {
    schemaVersion: 1,
    kind: "m6.alpha-map-candidate-set",
    fixtureId: "m6.alpha.map.test",
    fixtureKind: "alpha-map-candidate-set",
    syntheticScope: "m6-alpha-map-candidate-validation",
    candidates: [
      {
        sourceId: "map.alpha.test-candidate",
        displayNameKey: "content.m6.alpha.map.test_candidate",
        historicity: "COMPOSITE",
        confidence: "LOW",
        sourceLabel: "COMPOSITE",
        reviewNotes: ["Alpha validation candidate; exact borders remain unlocked."],
        bounds: { widthInMapUnits: 100, heightInMapUnits: 100 },
        districts: [
          {
            sourceId: "district.alpha.land",
            districtReferenceId: "district.alpha.land",
            displayNameKey: "content.m6.alpha.map.district.land",
            landWaterClass: "land",
            renderOrder: 10,
            anchor: { x: 25, y: 25 },
            polygon: [
              { x: 0, y: 0 },
              { x: 50, y: 0 },
              { x: 50, y: 50 }
            ]
          },
          {
            sourceId: "district.alpha.water",
            districtReferenceId: "district.alpha.water",
            displayNameKey: "content.m6.alpha.map.district.water",
            landWaterClass: "water",
            renderOrder: 20,
            anchor: { x: 75, y: 75 },
            polygon: [
              { x: 50, y: 50 },
              { x: 100, y: 50 },
              { x: 100, y: 100 }
            ]
          }
        ],
        settlements: [
          {
            sourceId: "settlement.alpha.land-court",
            settlementReferenceId: "settlement.alpha.land-court",
            districtReferenceId: "district.alpha.land",
            displayNameKey: "content.m6.alpha.map.settlement.land_court",
            renderOrder: 10,
            anchor: { x: 25, y: 25 }
          }
        ],
        routes: [
          {
            sourceId: "route.alpha.river",
            routeReferenceId: "route.alpha.river",
            fromDistrictReferenceId: "district.alpha.land",
            toDistrictReferenceId: "district.alpha.water",
            routeKind: "river",
            waterClass: "mixed",
            renderOrder: 10,
            points: [
              { x: 25, y: 25 },
              { x: 75, y: 75 }
            ]
          }
        ]
      }
    ]
  };
}

async function readM7HistoricalReviewBaseline(): Promise<M7HistoricalReviewBaseline> {
  const text = await readFile(m7HistoricalReviewBaselineUrl, "utf8");
  const parsed = JSON.parse(text) as unknown;
  if (!isM7HistoricalReviewBaseline(parsed)) {
    throw new Error("M7 historical review baseline shape mismatch.");
  }
  return parsed;
}

type M7ClaimLabel = "HISTORICAL" | "INFERRED" | "COMPOSITE" | "FICTIONAL" | "RESEARCH REQUIRED";

interface M7HistoricalReviewBaseline {
  readonly schemaVersion: 1;
  readonly kind: "m7.historical-cultural-language-review-baseline";
  readonly taskId: "M7-HISTORICAL-CULTURAL-LANGUAGE-REVIEW-001";
  readonly scope: {
    readonly notContentLockAcceptance: true;
    readonly formalContentLockHumanGate: string;
    readonly m6GateCarryForward: "PASS_WITH_LIMITS";
    readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
  };
  readonly allowedLabels: readonly M7ClaimLabel[];
  readonly sourceRecords: readonly M7SourceRecord[];
  readonly claimRecords: readonly M7ClaimRecord[];
  readonly acceptedBetaRealWorldClaims: readonly string[];
  readonly reviewGates: readonly M7ReviewGate[];
  readonly biasReview: {
    readonly mustScanFor: readonly string[];
    readonly humanGateRequiredFor: readonly string[];
  };
}

interface M7SourceRecord {
  readonly sourceId: string;
  readonly accessStatus: string;
  readonly pageOrSection: string;
  readonly formalUse: string;
}

interface M7ClaimRecord {
  readonly claimId: string;
  readonly claim: string;
  readonly label: M7ClaimLabel;
  readonly confidence: string;
  readonly sourceIds: readonly string[];
  readonly sourcePassages: readonly string[];
  readonly sourceStatements: readonly string[];
  readonly scholarlyInterpretations: readonly string[];
  readonly researcherInference: string;
  readonly competingInterpretations: readonly string[];
  readonly contested: boolean;
  readonly gameAbstraction: string;
  readonly betaUse: string;
  readonly humanGate: boolean;
}

interface M7ReviewGate {
  readonly gateId: string;
  readonly minimumEvidence: string;
  readonly humanGateWhen: string;
}

function isM7HistoricalReviewBaseline(input: unknown): input is M7HistoricalReviewBaseline {
  if (!isRecord(input)) {
    return false;
  }

  const scope = input["scope"];
  const biasReview = input["biasReview"];

  return (
    input["schemaVersion"] === 1 &&
    input["kind"] === "m7.historical-cultural-language-review-baseline" &&
    input["taskId"] === "M7-HISTORICAL-CULTURAL-LANGUAGE-REVIEW-001" &&
    isRecord(scope) &&
    scope["notContentLockAcceptance"] === true &&
    scope["m6GateCarryForward"] === "PASS_WITH_LIMITS" &&
    scope["manualNodeBattleDecision"] === "DEFER_MANUAL_NODE_BATTLE" &&
    isStringArray(input["allowedLabels"]) &&
    input["allowedLabels"].every(isM7ClaimLabel) &&
    Array.isArray(input["sourceRecords"]) &&
    input["sourceRecords"].every(isM7SourceRecord) &&
    Array.isArray(input["claimRecords"]) &&
    input["claimRecords"].every(isM7ClaimRecord) &&
    isStringArray(input["acceptedBetaRealWorldClaims"]) &&
    Array.isArray(input["reviewGates"]) &&
    input["reviewGates"].every(isM7ReviewGate) &&
    isRecord(biasReview) &&
    isStringArray(biasReview["mustScanFor"]) &&
    isStringArray(biasReview["humanGateRequiredFor"])
  );
}

function isM7ClaimLabel(input: string): input is M7ClaimLabel {
  return (
    input === "HISTORICAL" ||
    input === "INFERRED" ||
    input === "COMPOSITE" ||
    input === "FICTIONAL" ||
    input === "RESEARCH REQUIRED"
  );
}

function isM7SourceRecord(input: unknown): input is M7SourceRecord {
  return (
    isRecord(input) &&
    typeof input["sourceId"] === "string" &&
    typeof input["accessStatus"] === "string" &&
    typeof input["pageOrSection"] === "string" &&
    typeof input["formalUse"] === "string"
  );
}

function isM7ClaimRecord(input: unknown): input is M7ClaimRecord {
  return (
    isRecord(input) &&
    typeof input["claimId"] === "string" &&
    typeof input["claim"] === "string" &&
    typeof input["label"] === "string" &&
    isM7ClaimLabel(input["label"]) &&
    typeof input["confidence"] === "string" &&
    isStringArray(input["sourceIds"]) &&
    isStringArray(input["sourcePassages"]) &&
    isStringArray(input["sourceStatements"]) &&
    isStringArray(input["scholarlyInterpretations"]) &&
    typeof input["researcherInference"] === "string" &&
    isStringArray(input["competingInterpretations"]) &&
    typeof input["contested"] === "boolean" &&
    typeof input["gameAbstraction"] === "string" &&
    typeof input["betaUse"] === "string" &&
    typeof input["humanGate"] === "boolean"
  );
}

function isM7ReviewGate(input: unknown): input is M7ReviewGate {
  return (
    isRecord(input) &&
    typeof input["gateId"] === "string" &&
    typeof input["minimumEvidence"] === "string" &&
    typeof input["humanGateWhen"] === "string"
  );
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isStringArray(input: unknown): input is readonly string[] {
  return Array.isArray(input) && input.every((entry) => typeof entry === "string");
}

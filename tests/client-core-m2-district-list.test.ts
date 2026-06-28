import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE } from "../packages/client-core/src/m7-beta-audio-art-localization-content";
import { M7_BETA_GUIDANCE_SOURCE } from "../packages/client-core/src/m7-beta-guidance-content";
import {
  SYNTHETIC_DISTRICT_PRESSURE_ROW_COUNT,
  calculateClientVirtualWindow,
  createClientDistrictId,
  createInitialClientReadModelSnapshot,
  createM3AppointmentCommand,
  createM3AppointmentReadModelFixture,
  createM3BulkAppointmentCommand,
  createM2PrototypeClientReadModelSnapshot,
  createM2PrototypeReadModelFixture,
  createM4CampaignPlanCommand,
  createM4CampaignReadModelFixture,
  createM4CancelCampaignCommand,
  createM4SiegeChoiceCommand,
  createM4StartMarchCommand,
  createM4WithdrawalCommand,
  createM5PlayableReadModelFixture,
  createM5SessionSave,
  createM6AlphaReadModelFixture,
  createM6SessionSave,
  createM7GuidanceEmptyReadModelFixture,
  createM7GuidanceErrorReadModelFixture,
  createM7GuidanceExtremeReadModelFixture,
  createM7GuidanceReadModelFixture,
  createSyntheticDistrictPressureFixture,
  findM3Office,
  findM4CampaignPlan,
  findClientDistrictRow,
  getM5CurrentStep,
  getM6CurrentStep,
  parseM5SessionSave,
  parseM6SessionSave,
  projectM2DistrictRowsFromProtocolReadModels,
  selectClientDistrictRows,
  withDistrictListReadModel,
  withM7GuidanceReadModel
} from "../packages/client-core/src/index";

const M7_ACCEPTED_SOURCE_PATH = new URL(
  "../content-source/m7-beta-scenarios/beta-scenario-person-event-set.json",
  import.meta.url
);
const M7_AUDIO_ART_LOCALIZATION_SOURCE_PATH = new URL(
  "../content-source/m7-audio-art-localization/beta-audio-art-localization-coverage.json",
  import.meta.url
);

describe("M2 district list client read model", () => {
  test("creates a 4000-row synthetic pressure fixture without WorldState authority", () => {
    const fixture = createSyntheticDistrictPressureFixture();

    expect(fixture.rows).toHaveLength(SYNTHETIC_DISTRICT_PRESSURE_ROW_COUNT);
    expect(fixture.provenance.kind).toBe("synthetic-pressure-fixture");
    expect(fixture.provenance.note).toContain("not formal historical district content");
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
    expect(fixture.rows[0]).toMatchObject({
      displayName: "Synthetic District 0001",
      population: 800,
      labor: {
        available: 180,
        committed: 0
      },
      grain: {
        stock: 1500,
        lastHarvest: 240
      },
      cash: {
        stock: 320,
        cumulativeMobilizationCost: 0
      }
    });
  });

  test("filters and sorts district rows with a stable district id tie-breaker", () => {
    const fixture = createSyntheticDistrictPressureFixture();
    const filteredRows = selectClientDistrictRows({
      rows: fixture.rows,
      filter: "planting",
      sortKey: "population",
      sortDirection: "descending"
    });

    expect(filteredRows.length).toBeGreaterThan(900);
    expect(filteredRows.every((row) => row.seasonal.agriculturePhase === "planting")).toBe(true);

    const first = filteredRows[0];
    const second = filteredRows[1];
    if (first === undefined || second === undefined) {
      throw new Error("Expected filtered district rows.");
    }

    expect(first.population).toBeGreaterThanOrEqual(second.population);
    expect(findClientDistrictRow(fixture.rows, first.districtId)).toBe(first);
  });

  test("filters district rows by route status without owning world state", () => {
    const fixture = createSyntheticDistrictPressureFixture();
    const filteredRows = selectClientDistrictRows({
      rows: fixture.rows,
      filter: "",
      routeStatusFilter: "unreachable",
      sortKey: "district",
      sortDirection: "ascending"
    });

    expect(filteredRows.length).toBeGreaterThan(0);
    expect(filteredRows.every((row) => row.route.status === "unreachable")).toBe(true);
    expect(JSON.stringify(filteredRows)).not.toContain("WorldState");
  });

  test("calculates a bounded virtual row window for list pressure rendering", () => {
    const fixture = createSyntheticDistrictPressureFixture();
    const window = calculateClientVirtualWindow({
      rowCount: fixture.rows.length,
      rowHeightPx: 44,
      viewportHeightPx: 352,
      scrollTopPx: 44 * 1_000,
      overscanRows: 8
    });

    expect(window.totalHeightPx).toBe(176_000);
    expect(window.startIndex).toBe(992);
    expect(window.endIndex).toBe(1_016);
    expect(window.visibleCount).toBe(24);
  });

  test("attaches the district list as a read-model slice instead of replacing the snapshot", () => {
    const snapshot = createInitialClientReadModelSnapshot();
    const fixture = createSyntheticDistrictPressureFixture(8);
    const withDistricts = withDistrictListReadModel(snapshot, fixture);

    expect(withDistricts.districtList.rows).toHaveLength(8);
    expect(withDistricts.map).toBe(snapshot.map);
    expect(
      findClientDistrictRow(withDistricts.districtList.rows, createClientDistrictId(1))
    ).not.toBeNull();
  });

  test("projects the M2 30 district and 10 settlement fixture from protocol read models", () => {
    const fixture = createM2PrototypeReadModelFixture();
    const projectedRows = projectM2DistrictRowsFromProtocolReadModels({
      economyResult: fixture.economyResult,
      routePreviewResults: fixture.routePreviewResults
    });

    expect(fixture.economyResult.kind).toBe("sim.list-m2-economy-summaries");
    expect(fixture.routePreviewResults[0]?.kind).toBe("sim.preview-m2-transport-route");
    expect(fixture.map.districts).toHaveLength(30);
    expect(fixture.map.settlements).toHaveLength(10);
    expect(fixture.map.routes).toHaveLength(42);
    expect(fixture.districtList.rows).toHaveLength(30);
    expect(projectedRows).toEqual(fixture.districtList.rows);
    expect(fixture.districtList.rows[0]).toMatchObject({
      displayName: "Prototype District 001",
      population: 1_000,
      labor: {
        available: 500,
        committed: 12
      },
      route: {
        destinationDistrictId: createClientDistrictId(6)
      }
    });
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
  });
});

describe("M3 appointment client read model", () => {
  test("projects M3 appointment, polity, obligation, succession, and reason slices without WorldState", () => {
    const fixture = createM3AppointmentReadModelFixture();

    expect(fixture.provenance.kind).toBe("protocol-query-projection");
    expect(fixture.characters).toHaveLength(4);
    expect(fixture.polities).toHaveLength(3);
    expect(fixture.offices).toHaveLength(3);
    expect(fixture.obligations.length).toBeGreaterThanOrEqual(3);
    expect(fixture.successionCrises).toHaveLength(1);
    expect(fixture.appointmentResults).toHaveLength(3);
    expect(fixture.enfeoffmentResults).toHaveLength(1);
    expect(
      fixture.reasonSummaries.some((summary) => summary.reasonCode === "character-unavailable")
    ).toBe(true);
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
  });

  test("keeps appointment eligibility and rejection reasons as read-model input", () => {
    const fixture = createM3AppointmentReadModelFixture();
    const firstOffice = fixture.offices[0];
    if (firstOffice === undefined) {
      throw new Error("Expected first M3 office.");
    }
    const office = findM3Office(fixture.offices, firstOffice.officeId);
    if (office === null) {
      throw new Error("Expected first M3 office.");
    }

    expect(office.policy.continuity).toBe("persists-across-holder-change");
    expect(office.reasonCodes).toContain("appointment.holder.skill-strong");
    expect(
      office.candidateEligibilities.some(
        (eligibility) =>
          eligibility.status === "rejected" &&
          eligibility.reasonCodes.includes("office-primary-conflict")
      )
    ).toBe(true);
  });

  test("builds appointment commands and bulk commands through protocol DTOs", () => {
    const fixture = createM3AppointmentReadModelFixture();
    const office = fixture.offices[1];
    if (office === undefined) {
      throw new Error("Expected a vacant M3 office.");
    }
    const eligible = office.candidateEligibilities.find(
      (eligibility) => eligibility.status === "eligible"
    );
    if (eligible === undefined) {
      throw new Error("Expected an eligible candidate.");
    }

    const appointmentCommand = createM3AppointmentCommand({
      snapshot: fixture,
      commandId: "test.m3.appointment",
      officeId: office.officeId,
      characterId: eligible.characterId
    });
    const bulkCommand = createM3BulkAppointmentCommand({
      snapshot: fixture,
      commandId: "test.m3.bulk"
    });

    expect(appointmentCommand.kind).toBe("sim.appoint-office");
    expect(appointmentCommand.payload).toMatchObject({
      officeId: Number(office.officeId),
      characterId: Number(eligible.characterId)
    });
    expect(bulkCommand.kind).toBe("sim.appoint-offices-bulk");
    expect(bulkCommand.payload.items).toHaveLength(fixture.bulkPreview.eligibleCount);
    expect(bulkCommand.payload.items.map((item) => item.itemId)).not.toContain(
      "office-1-unavailable"
    );
  });
});

describe("M4 campaign planning client read model", () => {
  test("projects campaign planning, supply, route, siege, AI, and war report slices without WorldState", () => {
    const fixture = createM4CampaignReadModelFixture();

    expect(fixture.provenance.kind).toBe("protocol-query-projection");
    expect(fixture.plans).toHaveLength(2);
    expect(fixture.marches).toHaveLength(2);
    expect(fixture.sieges).toHaveLength(2);
    expect(fixture.withdrawals).toHaveLength(2);
    expect(fixture.warReports).toHaveLength(2);
    expect(fixture.muster.readiness).toBe("partial");
    expect(fixture.muster.promisedTroops).toBe(120);
    expect(fixture.muster.assembledTroops).toBe(100);
    expect(fixture.grain.expectedDaysOfSupply).toBe(11);
    expect(fixture.route.reasonCodes).toContain("route.forecast.seasonal-risk");
    expect(fixture.route.sourceForecasts).toHaveLength(2);
    expect(fixture.marches[0]).toMatchObject({
      status: "marching",
      joinedTroops: 100
    });
    expect(fixture.marches[1]).toMatchObject({
      status: "marching",
      joinedTroops: 40
    });
    expect(fixture.sieges[0]).toMatchObject({
      status: "active",
      attackerCasualties: 4,
      defenderCasualties: 11
    });
    expect(fixture.sieges[1]).toMatchObject({
      status: "active",
      attackerCasualties: 6,
      defenderCasualties: 10
    });
    expect(fixture.withdrawals[0]).toMatchObject({
      triggerReason: "supply",
      casualties: 14
    });
    expect(fixture.withdrawals[1]).toMatchObject({
      triggerReason: "supply",
      casualties: 14
    });
    expect(fixture.aiReason.primaryReasonCode).toBe("m4.ai.withdraw.supply-collapse");
    expect(fixture.warReports[0]?.postwarCandidate?.validM3Methods).toContain(
      "restore-vassal-ruler"
    );
    expect(fixture.warReports[1]?.postwarCandidate?.validM3Methods).toContain(
      "restore-vassal-ruler"
    );
    expect(
      fixture.reasonSummaries.some((summary) => summary.reasonCode === "route.season.monsoon-risk")
    ).toBe(true);
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
  });

  test("builds M4 campaign command DTOs through protocol paths", () => {
    const fixture = createM4CampaignReadModelFixture();
    const selectedPlanId = fixture.selectedCampaignPlanId;
    const selectedSiege = fixture.sieges[0];
    if (selectedPlanId === null || selectedSiege === undefined) {
      throw new Error("Expected M4 selected plan and siege fixture rows.");
    }

    const planCommand = createM4CampaignPlanCommand({
      snapshot: fixture,
      commandId: "test.m4.plan"
    });
    const startMarchCommand = createM4StartMarchCommand({
      snapshot: fixture,
      commandId: "test.m4.start-march",
      campaignPlanId: selectedPlanId
    });
    const cancelCommand = createM4CancelCampaignCommand({
      snapshot: fixture,
      commandId: "test.m4.cancel",
      campaignPlanId: selectedPlanId
    });
    const siegeCommand = createM4SiegeChoiceCommand({
      snapshot: fixture,
      commandId: "test.m4.siege",
      siegeId: selectedSiege.siegeId,
      choice: "assault"
    });
    const withdrawalCommand = createM4WithdrawalCommand({
      snapshot: fixture,
      commandId: "test.m4.withdraw",
      campaignPlanId: selectedPlanId
    });

    expect(planCommand).toMatchObject({
      kind: "sim.create-campaign-objective",
      payload: {
        campaignPlanId: 12,
        objectiveKind: "besiege",
        reasonCodes: ["client.m4.plan.before-rainy-season", "campaign.reason.dry-season-range"]
      }
    });
    expect(startMarchCommand.kind).toBe("sim.start-campaign-march");
    expect(cancelCommand.kind).toBe("sim.cancel-campaign-objective");
    expect(siegeCommand).toMatchObject({
      kind: "sim.apply-m4-siege-choice",
      payload: {
        choice: "assault",
        siegeId: Number(selectedSiege.siegeId)
      }
    });
    expect(withdrawalCommand).toMatchObject({
      kind: "sim.resolve-m4-campaign-withdrawal",
      payload: {
        triggerReason: "ordered"
      }
    });
  });

  test("finds M4 campaign plans with stable branded ids", () => {
    const fixture = createM4CampaignReadModelFixture();
    const selectedPlanId = fixture.selectedCampaignPlanId;
    if (selectedPlanId === null) {
      throw new Error("Expected M4 selected plan.");
    }

    const plan = findM4CampaignPlan(fixture.plans, selectedPlanId);
    expect(plan?.targetLabel).toBe("Prototype District 003");
    expect(plan?.forecast.reasonCodes).toContain("campaign.forecast.start-range-open");
  });
});

describe("M5 playable client read model", () => {
  test("projects the accepted M5 protocol script without storing WorldState", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const fixture = createM5PlayableReadModelFixture(baseSnapshot);

    expect(fixture.scenarioId).toBe("m5.composite.river-gate.v0");
    expect(fixture.contentTag).toBe("COMPOSITE_FICTIONAL_PLACEHOLDER");
    expect(fixture.steps).toHaveLength(15);
    expect(fixture.steps[0]?.command.kind).toBe("sim.create-campaign-objective");
    expect(fixture.steps[fixture.steps.length - 1]?.command.commandId).toBe(
      "m5.slice.stabilize-day-2"
    );
    expect(fixture.failureStep.command.commandId).toBe("m5.slice.duplicate-postwar-governance");
    expect(fixture.ai.primaryReasonCode).toBe("m4.ai.withdraw.supply-collapse");
    expect(fixture.risk.routeReasonCodes).toContain("route.forecast.seasonal-risk");
    expect(fixture.season.reasonCodes).toContain("route.season.monsoon-risk");
    expect(fixture.postwar.methods).toContain("restore-vassal-ruler");
    expect(fixture.goal.outOfScope).toContain("Manual node battle UI is unavailable in M5.");
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
  });

  test("exposes current command preview and client session save/load evidence", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const fixture = createM5PlayableReadModelFixture(baseSnapshot);
    const currentStep = getM5CurrentStep(fixture, 0);
    if (currentStep === null) {
      throw new Error("Expected M5 current step.");
    }

    expect(currentStep.preview.commandKind).toBe("sim.create-campaign-objective");
    expect(currentStep.reasonCodes).toContain("campaign.reason.deterministic-replay");

    const save = createM5SessionSave({
      snapshot: fixture,
      phase: "running",
      currentStepIndex: 1,
      confirmedCommandIds: [currentStep.command.commandId]
    });
    const parsed = parseM5SessionSave(save);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      throw new Error("Expected M5 save parse success.");
    }
    expect(parsed.value.phase).toBe("running");
    expect(parsed.value.confirmedCommandIds).toEqual([currentStep.command.commandId]);
    expect(parsed.value.checkpointLabel).toContain("sim.create-muster-commitment");
  });

  test("rejects malformed M5 client session saves with reason codes", () => {
    expect(parseM5SessionSave("{")).toMatchObject({
      ok: false,
      reasonCode: "m5.save.invalid-json"
    });
    expect(parseM5SessionSave(JSON.stringify({ schemaVersion: 99 }))).toMatchObject({
      ok: false,
      reasonCode: "m5.save.unsupported-version"
    });
  });
});

describe("M6 Alpha client read model", () => {
  test("projects Alpha start-to-victory surfaces without storing WorldState", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const fixture = createM6AlphaReadModelFixture(baseSnapshot);

    expect(fixture.scenarioId).toBe("m6.alpha.recognized-order.v0");
    expect(fixture.contentTag).toBe("COMPOSITE_FICTIONAL_ALPHA");
    expect(fixture.scenarios).toHaveLength(3);
    expect(fixture.steps.length).toBeGreaterThan(20);
    expect(fixture.diplomacy.agreements[0]?.agreementKind).toBe("tribute-recognition");
    expect(fixture.diplomacy.recognitionEdges).toHaveLength(1);
    expect(fixture.legitimacy.scoreBps).toBeGreaterThanOrEqual(1_000);
    expect(fixture.succession.status).toBe("resolved");
    expect(fixture.policies.activeEvents).toHaveLength(1);
    expect(fixture.policies.resolvedEvents[0]?.encyclopediaRefs).toContain(
      "encyclopedia.m6.policy_event.harbor.accept"
    );
    expect(fixture.encyclopedia.entries.length).toBeGreaterThanOrEqual(3);
    expect(fixture.adviser.primaryReasonCode).toBe("m6.adviser.recognized-order-ready");
    expect(fixture.mapCandidate.candidateSourceId).toBe("map.alpha.western-mainland-candidate");
    expect(fixture.terminal.outcome).toBe("victory");
    expect(fixture.terminal.canPursueVictory).toBe(true);
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
  });

  test("exposes Alpha command preview and client checkpoint save/load evidence", () => {
    const fixture = createM6AlphaReadModelFixture(createM2PrototypeClientReadModelSnapshot());
    const diplomacyStep = fixture.steps.find((step) => step.stage === "diplomacy");
    if (diplomacyStep === undefined) {
      throw new Error("Expected an M6 diplomacy step.");
    }

    expect(diplomacyStep.command.kind).toBe("sim.propose-diplomatic-agreement");
    expect(diplomacyStep.reasonCodes).toContain("m6.alpha.diplomacy.recognized-order");
    expect(getM6CurrentStep(fixture, 0)?.command.kind).toBe("sim.create-campaign-objective");

    const save = createM6SessionSave({
      snapshot: fixture,
      phase: "running",
      currentStepIndex: 2,
      confirmedCommandIds: [fixture.steps[0]?.command.commandId ?? "missing"]
    });
    const parsed = parseM6SessionSave(save);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      throw new Error("Expected M6 save parse success.");
    }
    expect(parsed.value.phase).toBe("running");
    expect(parsed.value.terminalOutcome).toBe("victory");
    expect(parsed.value.checkpointLabel).toContain("m6.step");
  });

  test("rejects malformed M6 client session saves with reason codes", () => {
    expect(parseM6SessionSave("{")).toMatchObject({
      ok: false,
      reasonCode: "m6.save.invalid-json"
    });
    expect(parseM6SessionSave(JSON.stringify({ schemaVersion: 99 }))).toMatchObject({
      ok: false,
      reasonCode: "m6.save.unsupported-version"
    });
  });
});

describe("M7 tutorial hints encyclopedia client read model", () => {
  test("keeps the M7 audio art localization coverage fixture aligned with content source", () => {
    const acceptedCoverage: unknown = JSON.parse(
      readFileSync(M7_AUDIO_ART_LOCALIZATION_SOURCE_PATH, "utf8")
    );
    expect(acceptedCoverage).toEqual(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE);

    expect(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE.supportedLocales).toHaveLength(2);
    expect(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE.assetReferences).toHaveLength(8);
    expect(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE.localizationChecks).toHaveLength(5);
    expect(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE.viewportSmoke).toHaveLength(4);
    expect(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE.postOneGaps).toHaveLength(3);
    expect(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE.unresolvedRisks).toContainEqual(
      expect.objectContaining({
        riskId: "risk.culture-specific-assets-blocked",
        routeTo: "historical_researcher",
        humanGate: true
      })
    );
    expect(JSON.stringify(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE)).not.toContain(
      "https://"
    );
    expect(JSON.stringify(M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE)).not.toContain(
      "telemetry-enabled"
    );
  });

  test("keeps the generated M7 guidance fixture mechanically aligned with accepted content source", () => {
    const acceptedSource: unknown = JSON.parse(readFileSync(M7_ACCEPTED_SOURCE_PATH, "utf8"));
    expect(acceptedSource).toEqual(M7_BETA_GUIDANCE_SOURCE);

    expect(M7_BETA_GUIDANCE_SOURCE.scenarios).toHaveLength(3);
    expect(M7_BETA_GUIDANCE_SOURCE.persons).toHaveLength(6);
    expect(M7_BETA_GUIDANCE_SOURCE.titles).toHaveLength(3);
    expect(M7_BETA_GUIDANCE_SOURCE.events).toHaveLength(5);
    expect(M7_BETA_GUIDANCE_SOURCE.localization).toHaveLength(36);
    expect(M7_BETA_GUIDANCE_SOURCE.claimRecords).toHaveLength(6);
    expect(M7_BETA_GUIDANCE_SOURCE.knownGaps).toHaveLength(4);

    expect(
      M7_BETA_GUIDANCE_SOURCE.claimRecords.find(
        (claim) => claim.claimId === "HIST-M7-FILL-001-SCOPE"
      )
    ).toMatchObject({
      label: "INFERRED",
      confidence: "HIGH"
    });
    expect(
      M7_BETA_GUIDANCE_SOURCE.localization.find(
        (localization) => localization.key === "content.m7.beta.event.coercion_cost_review.name"
      )
    ).toMatchObject({
      english: "Forced movement and population-loss review",
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED"
    });
    expect(
      M7_BETA_GUIDANCE_SOURCE.localization.find(
        (localization) => localization.key === "content.m7.beta.person.court_broker_1531.name"
      )
    ).toMatchObject({
      english: "Composite court broker 1531",
      reviewState: "LANGUAGE_REVIEW_REQUIRED"
    });
  });

  test("projects Beta guidance from content runtime records and accepted read-model slices", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const fixture = createM7GuidanceReadModelFixture(baseSnapshot);

    expect(fixture.contentPack.notContentLockAcceptance).toBe(true);
    expect(fixture.contentPack.m6GateCarryForward).toBe("PASS_WITH_LIMITS");
    expect(fixture.contentPack.manualNodeBattleDecision).toBe("DEFER_MANUAL_NODE_BATTLE");
    expect(fixture.scenarios).toHaveLength(3);
    expect(fixture.contentPack.scenarioCount).toBe(3);
    expect(fixture.contentPack.personCount).toBe(6);
    expect(fixture.contentPack.eventCount).toBe(5);
    expect(fixture.contentPack.knownGapCount).toBe(4);
    expect(fixture.tutorial.steps.map((step) => step.milestone)).toEqual([
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7"
    ]);
    expect(fixture.hints.groups.length).toBeGreaterThanOrEqual(3);
    expect(fixture.encyclopedia.entries.map((entry) => entry.systemMilestone)).toEqual([
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M7",
      "M7"
    ]);
    expect(fixture.encyclopedia.entries).toContainEqual(
      expect.objectContaining({
        entryId: "encyclopedia.m7.review-labels",
        contentLabel: "INFERRED",
        confidence: "HIGH",
        reviewState: "SCHEMA_VALIDATED"
      })
    );
    expect(fixture.encyclopedia.entries).toContainEqual(
      expect.objectContaining({
        entryId: "encyclopedia.m7.culture-risk-costs",
        title: "Forced movement and population-loss review",
        reviewState: "CULTURE_HUMAN_GATE_REQUIRED"
      })
    );
    expect(JSON.stringify(fixture)).toContain("Composite court broker 1531");
    expect(JSON.stringify(fixture)).toContain("LANGUAGE_REVIEW_REQUIRED");
    expect(fixture.reviewSummary.humanGateClaimCount).toBe(2);
    expect(fixture.audioArtLocalization.manifest.localeCount).toBe(2);
    expect(fixture.audioArtLocalization.manifest.assetReferenceCount).toBe(8);
    expect(fixture.audioArtLocalization.manifest.audioReferenceCount).toBe(4);
    expect(fixture.audioArtLocalization.manifest.artReferenceCount).toBe(4);
    expect(fixture.audioArtLocalization.staticResourceBoundary.noPaidService).toBe(true);
    expect(fixture.audioArtLocalization.staticResourceBoundary.noRemotePipeline).toBe(true);
    expect(fixture.audioArtLocalization.staticResourceBoundary.noSecrets).toBe(true);
    expect(fixture.audioArtLocalization.staticResourceBoundary.noTelemetry).toBe(true);
    expect(fixture.audioArtLocalization.supportedLocales.map((locale) => locale.locale)).toEqual([
      "en-US",
      "zh-Hans"
    ]);
    expect(
      fixture.audioArtLocalization.localizationChecks.find(
        (check) => check.checkId === "loc.content-record.keys"
      )
    ).toMatchObject({
      requiredKeyPattern: "content.m7.beta.*",
      matchedKeyCount: 36,
      reviewState: "LANGUAGE_REVIEW_REQUIRED"
    });
    expect(fixture.audioArtLocalization.postOneGaps.map((gap) => gap.gapId)).toContain(
      "post1.audio.period-music"
    );
    expect(fixture.audioArtLocalization.unresolvedRisks.map((risk) => risk.routeTo)).toContain(
      "historical_researcher"
    );
    expect(JSON.stringify(fixture)).not.toContain("WorldState");
    expect(JSON.stringify(fixture)).not.toContain("telemetry");
  });

  test("supports empty, error, and extreme M7 guidance fixture states", () => {
    const baseSnapshot = createM2PrototypeClientReadModelSnapshot();
    const empty = createM7GuidanceEmptyReadModelFixture(baseSnapshot);
    const error = createM7GuidanceErrorReadModelFixture(baseSnapshot);
    const extreme = createM7GuidanceExtremeReadModelFixture(baseSnapshot);
    const withGuidance = withM7GuidanceReadModel(baseSnapshot, extreme);

    expect(empty.tutorial.steps).toHaveLength(0);
    expect(empty.encyclopedia.entries).toHaveLength(0);
    expect(error.selectedScenarioId).toBe("scenario.beta.1581.succession-fracture");
    expect(error.reviewSummary.blockedScopeNotes).toContain(
      "CULTURE_HUMAN_GATE_REQUIRED content is surfaced as risk context only."
    );
    expect(extreme.tutorial.steps.length).toBeGreaterThan(
      baseSnapshot.m7Guidance.tutorial.steps.length
    );
    expect(extreme.encyclopedia.entries.length).toBeGreaterThan(
      baseSnapshot.m7Guidance.encyclopedia.entries.length
    );
    expect(withGuidance.m7Guidance).toBe(extreme);
    expect(withGuidance.m6Alpha).toBe(baseSnapshot.m6Alpha);
  });
});

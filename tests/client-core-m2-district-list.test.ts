import { describe, expect, test } from "vitest";

import {
  SYNTHETIC_DISTRICT_PRESSURE_ROW_COUNT,
  calculateClientVirtualWindow,
  createClientDistrictId,
  createInitialClientReadModelSnapshot,
  createM3AppointmentCommand,
  createM3AppointmentReadModelFixture,
  createM3BulkAppointmentCommand,
  createM2PrototypeReadModelFixture,
  createM4CampaignPlanCommand,
  createM4CampaignReadModelFixture,
  createM4CancelCampaignCommand,
  createM4SiegeChoiceCommand,
  createM4StartMarchCommand,
  createM4WithdrawalCommand,
  createSyntheticDistrictPressureFixture,
  findM3Office,
  findM4CampaignPlan,
  findClientDistrictRow,
  projectM2DistrictRowsFromProtocolReadModels,
  selectClientDistrictRows,
  withDistrictListReadModel
} from "../packages/client-core/src/index";

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

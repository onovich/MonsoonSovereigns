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
  createSyntheticDistrictPressureFixture,
  findM3Office,
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

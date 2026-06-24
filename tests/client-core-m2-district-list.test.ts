import { describe, expect, test } from "vitest";

import {
  SYNTHETIC_DISTRICT_PRESSURE_ROW_COUNT,
  calculateClientVirtualWindow,
  createClientDistrictId,
  createInitialClientReadModelSnapshot,
  createSyntheticDistrictPressureFixture,
  findClientDistrictRow,
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
});

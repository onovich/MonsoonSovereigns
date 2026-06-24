import {
  HELLO_SIMULATION_PROTOCOL_VERSION,
  type HelloSimulationResultDto
} from "@monsoon/protocol";

export const CLIENT_READ_MODEL_PROTOCOL_VERSION = 1;

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type ClientReadModelRevision = Brand<number, "ClientReadModelRevision">;
export type ClientMapAnchorId = Brand<string, "ClientMapAnchorId">;
export type ClientDistrictId = Brand<number, "ClientDistrictId">;

export type ClientReadModelStatus = "booting" | "ready";

export interface ClientReadModelSnapshot {
  readonly protocolVersion: typeof CLIENT_READ_MODEL_PROTOCOL_VERSION;
  readonly revision: ClientReadModelRevision;
  readonly status: ClientReadModelStatus;
  readonly simulation: HelloSimulationSummaryReadModel;
  readonly map: ClientMapReadModelSnapshot;
  readonly panels: ClientPanelReadModelSnapshot;
  readonly districtList: ClientDistrictListReadModelSnapshot;
}

export interface HelloSimulationSummaryReadModel {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly daysSimulated: number;
  readonly finalRevision: number;
  readonly stateHash: string;
}

export interface ClientMapReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly bounds: ClientMapBoundsReadModel;
  readonly anchors: readonly ClientMapAnchorReadModel[];
}

export interface ClientMapBoundsReadModel {
  readonly widthInMapUnits: number;
  readonly heightInMapUnits: number;
}

export interface ClientMapAnchorReadModel {
  readonly id: ClientMapAnchorId;
  readonly label: string;
  readonly xInMapUnits: number;
  readonly yInMapUnits: number;
  readonly tone: ClientMapAnchorTone;
}

export type ClientMapAnchorTone = "primary" | "secondary" | "muted";

export interface ClientPanelReadModelSnapshot {
  readonly headline: string;
  readonly metrics: readonly ClientMetricReadModel[];
}

export interface ClientMetricReadModel {
  readonly label: string;
  readonly value: string;
}

export interface ClientDistrictListReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly provenance: ClientDistrictListProvenanceReadModel;
  readonly rows: readonly ClientDistrictRowReadModel[];
  readonly selectedDistrictId: ClientDistrictId;
}

export interface ClientDistrictListProvenanceReadModel {
  readonly kind: "synthetic-pressure-fixture" | "simulation-read-model";
  readonly note: string;
}

export interface ClientDistrictRowReadModel {
  readonly districtId: ClientDistrictId;
  readonly displayName: string;
  readonly seasonal: ClientDistrictSeasonalReadModel;
  readonly population: number;
  readonly labor: ClientDistrictLaborReadModel;
  readonly grain: ClientDistrictGrainReadModel;
  readonly cash: ClientDistrictCashReadModel;
  readonly route: ClientDistrictRouteSummaryReadModel;
}

export interface ClientDistrictSeasonalReadModel {
  readonly monthOfYear: number;
  readonly agriculturePhase: string;
  readonly label: string;
}

export interface ClientDistrictLaborReadModel {
  readonly available: number;
  readonly committed: number;
}

export interface ClientDistrictGrainReadModel {
  readonly stock: number;
  readonly lastHarvest: number;
}

export interface ClientDistrictCashReadModel {
  readonly stock: number;
  readonly cumulativeMobilizationCost: number;
}

export type ClientDistrictRouteStatus = "reachable" | "capacity-exceeded" | "unreachable";
export type ClientDistrictRouteKind = "road" | "river" | "coast";

export interface ClientDistrictRouteSummaryReadModel {
  readonly status: ClientDistrictRouteStatus;
  readonly destinationDistrictId: ClientDistrictId;
  readonly stockAmount: number;
  readonly totalCost: number | null;
  readonly bottleneckCapacity: number | null;
  readonly edgeCount: number;
  readonly routeKinds: readonly ClientDistrictRouteKind[];
}

export type ClientDistrictSortKey =
  | "cash"
  | "district"
  | "grain"
  | "labor"
  | "population"
  | "route";

export type ClientDistrictSortDirection = "ascending" | "descending";

export interface ClientDistrictRowSelectionInput {
  readonly rows: readonly ClientDistrictRowReadModel[];
  readonly filter: string;
  readonly sortKey: ClientDistrictSortKey;
  readonly sortDirection: ClientDistrictSortDirection;
}

export interface ClientVirtualWindowInput {
  readonly rowCount: number;
  readonly rowHeightPx: number;
  readonly viewportHeightPx: number;
  readonly scrollTopPx: number;
  readonly overscanRows: number;
}

export interface ClientVirtualWindowReadModel {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly offsetTopPx: number;
  readonly totalHeightPx: number;
  readonly visibleCount: number;
}

export const SYNTHETIC_DISTRICT_PRESSURE_ROW_COUNT = 4_000;

export type ClientReadModelDelta =
  | {
      readonly kind: "hello-result";
      readonly result: HelloSimulationResultDto;
    }
  | {
      readonly kind: "replace";
      readonly snapshot: ClientReadModelSnapshot;
    };

export function createInitialClientReadModelSnapshot(): ClientReadModelSnapshot {
  const revision = createClientReadModelRevision(0);

  return {
    protocolVersion: CLIENT_READ_MODEL_PROTOCOL_VERSION,
    revision,
    status: "booting",
    simulation: {
      protocolVersion: HELLO_SIMULATION_PROTOCOL_VERSION,
      daysSimulated: 0,
      finalRevision: 0,
      stateHash: "not-started"
    },
    map: {
      revision,
      bounds: {
        widthInMapUnits: 960,
        heightInMapUnits: 540
      },
      anchors: [
        {
          id: createClientMapAnchorId("monsoon-assembly"),
          label: "Assembly",
          xInMapUnits: 216,
          yInMapUnits: 278,
          tone: "primary"
        },
        {
          id: createClientMapAnchorId("river-watch"),
          label: "River Watch",
          xInMapUnits: 574,
          yInMapUnits: 194,
          tone: "secondary"
        }
      ]
    },
    panels: {
      headline: "Simulation shell booting",
      metrics: [
        {
          label: "Revision",
          value: "0"
        },
        {
          label: "State hash",
          value: "not-started"
        }
      ]
    },
    districtList: createEmptyDistrictListReadModel(revision)
  };
}

export function createSyntheticDistrictPressureFixture(
  rowCount = SYNTHETIC_DISTRICT_PRESSURE_ROW_COUNT
): ClientDistrictListReadModelSnapshot {
  if (!Number.isSafeInteger(rowCount) || rowCount < 1) {
    throw new Error(
      `Synthetic district pressure row count must be positive, received ${rowCount}.`
    );
  }

  const rows: ClientDistrictRowReadModel[] = [];
  for (let index = 0; index < rowCount; index += 1) {
    rows.push(createSyntheticDistrictPressureRow(index, rowCount));
  }

  const selected = rows[0];
  if (selected === undefined) {
    throw new Error("Synthetic district pressure fixture must contain a selected row.");
  }

  return {
    revision: createClientReadModelRevision(1),
    provenance: {
      kind: "synthetic-pressure-fixture",
      note: "Synthetic UI pressure data for list virtualization; not formal historical district content."
    },
    rows,
    selectedDistrictId: selected.districtId
  };
}

export function withDistrictListReadModel(
  snapshot: ClientReadModelSnapshot,
  districtList: ClientDistrictListReadModelSnapshot
): ClientReadModelSnapshot {
  return {
    ...snapshot,
    districtList
  };
}

export function applyClientReadModelDelta(
  snapshot: ClientReadModelSnapshot,
  delta: ClientReadModelDelta
): ClientReadModelSnapshot {
  switch (delta.kind) {
    case "hello-result":
      return {
        ...projectHelloSimulationResult(delta.result),
        districtList: snapshot.districtList
      };
    case "replace":
      return delta.snapshot;
  }
}

export function projectHelloSimulationResult(
  result: HelloSimulationResultDto
): ClientReadModelSnapshot {
  if (result.protocolVersion !== HELLO_SIMULATION_PROTOCOL_VERSION) {
    throw new Error(`Unsupported hello result protocol version ${result.protocolVersion}.`);
  }

  const revision = createClientReadModelRevision(result.finalRevision);

  return {
    protocolVersion: CLIENT_READ_MODEL_PROTOCOL_VERSION,
    revision,
    status: "ready",
    simulation: {
      protocolVersion: result.protocolVersion,
      daysSimulated: result.daysSimulated,
      finalRevision: result.finalRevision,
      stateHash: result.stateHash
    },
    map: {
      revision,
      bounds: {
        widthInMapUnits: 960,
        heightInMapUnits: 540
      },
      anchors: [
        {
          id: createClientMapAnchorId("monsoon-assembly"),
          label: "Assembly",
          xInMapUnits: 216,
          yInMapUnits: 278,
          tone: "primary"
        },
        {
          id: createClientMapAnchorId("river-watch"),
          label: "River Watch",
          xInMapUnits: 574,
          yInMapUnits: 194,
          tone: result.daysSimulated > 0 ? "secondary" : "muted"
        },
        {
          id: createClientMapAnchorId("revision-beacon"),
          label: `Revision ${result.finalRevision}`,
          xInMapUnits: 760,
          yInMapUnits: 346,
          tone: "muted"
        }
      ]
    },
    panels: {
      headline: "Simulation shell ready",
      metrics: [
        {
          label: "Days simulated",
          value: result.daysSimulated.toString()
        },
        {
          label: "Revision",
          value: result.finalRevision.toString()
        },
        {
          label: "State hash",
          value: result.stateHash
        }
      ]
    },
    districtList: createEmptyDistrictListReadModel(revision)
  };
}

export function selectClientDistrictRows(
  input: ClientDistrictRowSelectionInput
): readonly ClientDistrictRowReadModel[] {
  const normalizedFilter = input.filter.trim().toLowerCase();
  const filteredRows =
    normalizedFilter.length === 0
      ? input.rows
      : input.rows.filter((row) => rowMatchesFilter(row, normalizedFilter));

  const direction = input.sortDirection === "ascending" ? 1 : -1;
  return [...filteredRows].sort(
    (left, right) =>
      direction * compareDistrictRows(left, right, input.sortKey) ||
      Number(left.districtId) - Number(right.districtId)
  );
}

export function findClientDistrictRow(
  rows: readonly ClientDistrictRowReadModel[],
  districtId: ClientDistrictId
): ClientDistrictRowReadModel | null {
  return rows.find((row) => row.districtId === districtId) ?? null;
}

export function calculateClientVirtualWindow(
  input: ClientVirtualWindowInput
): ClientVirtualWindowReadModel {
  if (input.rowCount < 0 || !Number.isSafeInteger(input.rowCount)) {
    throw new Error(
      `Virtual row count must be a non-negative integer, received ${input.rowCount}.`
    );
  }
  if (input.rowHeightPx <= 0 || input.viewportHeightPx <= 0 || input.overscanRows < 0) {
    throw new Error(
      "Virtual window dimensions must be positive and overscan must be non-negative."
    );
  }

  const totalHeightPx = input.rowCount * input.rowHeightPx;
  const clampedScrollTopPx = Math.min(Math.max(input.scrollTopPx, 0), totalHeightPx);
  const firstVisibleIndex = Math.floor(clampedScrollTopPx / input.rowHeightPx);
  const visibleCapacity = Math.ceil(input.viewportHeightPx / input.rowHeightPx);
  const startIndex = Math.max(0, firstVisibleIndex - input.overscanRows);
  const endIndex = Math.min(
    input.rowCount,
    firstVisibleIndex + visibleCapacity + input.overscanRows
  );

  return {
    startIndex,
    endIndex,
    offsetTopPx: startIndex * input.rowHeightPx,
    totalHeightPx,
    visibleCount: Math.max(0, endIndex - startIndex)
  };
}

export function createClientReadModelRevision(value: number): ClientReadModelRevision {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(
      `Client read model revision must be a non-negative integer, received ${value}.`
    );
  }

  return value as ClientReadModelRevision;
}

export function createClientDistrictId(value: number): ClientDistrictId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client district id must be a positive integer, received ${value}.`);
  }

  return value as ClientDistrictId;
}

export function createClientMapAnchorId(value: string): ClientMapAnchorId {
  if (!/^[a-z][a-z0-9-]*$/u.test(value)) {
    throw new Error(`Client map anchor id must be kebab-case, received ${value}.`);
  }

  return value as ClientMapAnchorId;
}

function createEmptyDistrictListReadModel(
  revision: ClientReadModelRevision
): ClientDistrictListReadModelSnapshot {
  return {
    revision,
    provenance: {
      kind: "simulation-read-model",
      note: "No M2 district read-model slice has been projected yet."
    },
    rows: [],
    selectedDistrictId: createClientDistrictId(1)
  };
}

function createSyntheticDistrictPressureRow(
  index: number,
  rowCount: number
): ClientDistrictRowReadModel {
  const districtNumber = index + 1;
  const districtId = createClientDistrictId(districtNumber);
  const destinationDistrictId = createClientDistrictId((districtNumber % rowCount) + 1);
  const phase = pickByIndex(SYNTHETIC_AGRICULTURE_PHASES, index);
  const routeStatus = createSyntheticRouteStatus(index);

  return {
    districtId,
    displayName: `Synthetic District ${districtNumber.toString().padStart(4, "0")}`,
    seasonal: {
      monthOfYear: (index % 12) + 1,
      agriculturePhase: phase,
      label: `M${((index % 12) + 1).toString().padStart(2, "0")} ${phase}`
    },
    population: 800 + ((index * 37) % 2_900),
    labor: {
      available: 180 + ((index * 19) % 920),
      committed: (index * 11) % 260
    },
    grain: {
      stock: 1_500 + ((index * 71) % 8_600),
      lastHarvest: 240 + ((index * 43) % 1_700)
    },
    cash: {
      stock: 320 + ((index * 29) % 4_900),
      cumulativeMobilizationCost: (index * 17) % 1_200
    },
    route: {
      status: routeStatus,
      destinationDistrictId,
      stockAmount: 40 + (index % 9) * 10,
      totalCost: routeStatus === "unreachable" ? null : 12 + ((index * 5) % 96),
      bottleneckCapacity: routeStatus === "unreachable" ? null : 80 + ((index * 13) % 360),
      edgeCount: routeStatus === "unreachable" ? 0 : 1 + (index % 5),
      routeKinds: routeStatus === "unreachable" ? [] : [pickByIndex(SYNTHETIC_ROUTE_KINDS, index)]
    }
  };
}

function rowMatchesFilter(row: ClientDistrictRowReadModel, normalizedFilter: string): boolean {
  return (
    row.displayName.toLowerCase().includes(normalizedFilter) ||
    row.seasonal.agriculturePhase.toLowerCase().includes(normalizedFilter) ||
    row.route.status.includes(normalizedFilter)
  );
}

function compareDistrictRows(
  left: ClientDistrictRowReadModel,
  right: ClientDistrictRowReadModel,
  sortKey: ClientDistrictSortKey
): number {
  switch (sortKey) {
    case "cash":
      return left.cash.stock - right.cash.stock;
    case "district":
      return Number(left.districtId) - Number(right.districtId);
    case "grain":
      return left.grain.stock - right.grain.stock;
    case "labor":
      return left.labor.available - right.labor.available;
    case "population":
      return left.population - right.population;
    case "route":
      return routeSortValue(left.route) - routeSortValue(right.route);
  }
}

function routeSortValue(route: ClientDistrictRouteSummaryReadModel): number {
  if (route.totalCost !== null) {
    return route.totalCost;
  }

  return Number.MAX_SAFE_INTEGER;
}

function createSyntheticRouteStatus(index: number): ClientDistrictRouteStatus {
  if (index % 17 === 0) {
    return "unreachable";
  }
  if (index % 11 === 0) {
    return "capacity-exceeded";
  }

  return "reachable";
}

function pickByIndex<TValue>(values: readonly TValue[], index: number): TValue {
  const value = values[index % values.length];
  if (value === undefined) {
    throw new Error("Cannot pick from an empty synthetic fixture value set.");
  }

  return value;
}

const SYNTHETIC_AGRICULTURE_PHASES: readonly string[] = [
  "fallow",
  "planting",
  "growing",
  "harvest"
];

const SYNTHETIC_ROUTE_KINDS: readonly ClientDistrictRouteKind[] = ["road", "river", "coast"];

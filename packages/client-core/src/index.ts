import {
  HELLO_SIMULATION_PROTOCOL_VERSION,
  type HelloSimulationResultDto,
  type ListM2EconomySummariesResultV1,
  type M2TransportRouteKindV1,
  type PreviewM2TransportRouteResultV1
} from "@monsoon/protocol";

export const CLIENT_READ_MODEL_PROTOCOL_VERSION = 1;

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type ClientReadModelRevision = Brand<number, "ClientReadModelRevision">;
export type ClientMapAnchorId = Brand<string, "ClientMapAnchorId">;
export type ClientDistrictId = Brand<number, "ClientDistrictId">;
export type ClientSettlementId = Brand<number, "ClientSettlementId">;

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
  readonly districts: readonly ClientMapDistrictReadModel[];
  readonly settlements: readonly ClientMapSettlementReadModel[];
  readonly routes: readonly ClientMapRouteReadModel[];
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

export type ClientMapMode = "seasonal" | "economy" | "routes";

export type ClientMapEntitySelection =
  | {
      readonly kind: "district";
      readonly districtId: ClientDistrictId;
    }
  | {
      readonly kind: "settlement";
      readonly settlementId: ClientSettlementId;
      readonly districtId: ClientDistrictId;
    };

export interface ClientMapPointReadModel {
  readonly xInMapUnits: number;
  readonly yInMapUnits: number;
}

export interface ClientMapDistrictReadModel {
  readonly districtId: ClientDistrictId;
  readonly displayName: string;
  readonly anchor: ClientMapPointReadModel;
  readonly polygon: readonly ClientMapPointReadModel[];
  readonly seasonal: ClientDistrictSeasonalReadModel;
  readonly population: number;
  readonly availableLabor: number;
  readonly grainStock: number;
  readonly cashStock: number;
  readonly route: ClientDistrictRouteSummaryReadModel;
}

export interface ClientMapSettlementReadModel {
  readonly settlementId: ClientSettlementId;
  readonly districtId: ClientDistrictId;
  readonly displayName: string;
  readonly anchor: ClientMapPointReadModel;
}

export interface ClientMapRouteReadModel {
  readonly originDistrictId: ClientDistrictId;
  readonly destinationDistrictId: ClientDistrictId;
  readonly status: ClientDistrictRouteStatus;
  readonly stockAmount: number;
  readonly totalCost: number | null;
  readonly bottleneckCapacity: number | null;
  readonly routeKinds: readonly ClientDistrictRouteKind[];
  readonly points: readonly ClientMapPointReadModel[];
}

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
export const M2_PROTOTYPE_DISTRICT_COUNT = 30;
export const M2_PROTOTYPE_SETTLEMENT_COUNT = 10;

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
      ],
      districts: [],
      settlements: [],
      routes: []
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

export function createM2PrototypeClientReadModelSnapshot(
  baseSnapshot = createInitialClientReadModelSnapshot()
): ClientReadModelSnapshot {
  const fixture = createM2PrototypeReadModelFixture(baseSnapshot.revision);

  return {
    ...baseSnapshot,
    map: fixture.map,
    panels: {
      headline: "M2 prototype map ready",
      metrics: [
        {
          label: "Districts",
          value: fixture.map.districts.length.toString()
        },
        {
          label: "Settlements",
          value: fixture.map.settlements.length.toString()
        },
        {
          label: "Route previews",
          value: fixture.routePreviewResults.length.toString()
        },
        {
          label: "State hash",
          value: baseSnapshot.simulation.stateHash
        }
      ]
    },
    districtList: fixture.districtList
  };
}

export interface ClientM2PrototypeReadModelFixture {
  readonly map: ClientMapReadModelSnapshot;
  readonly districtList: ClientDistrictListReadModelSnapshot;
  readonly economyResult: ListM2EconomySummariesResultV1;
  readonly routePreviewResults: readonly PreviewM2TransportRouteResultV1[];
}

export function createM2PrototypeReadModelFixture(
  revision = createClientReadModelRevision(1)
): ClientM2PrototypeReadModelFixture {
  const economyResult = createM2PrototypeEconomyResult(Number(revision));
  const routePreviewResults = createM2PrototypeRoutePreviewResults(Number(revision));
  const rows = projectM2DistrictRowsFromProtocolReadModels({
    economyResult,
    routePreviewResults
  });
  const selected = rows[0];
  if (selected === undefined) {
    throw new Error("M2 prototype read model must contain at least one district row.");
  }

  const districtById = new Map<ClientDistrictId, ClientDistrictRowReadModel>(
    rows.map((row) => [row.districtId, row])
  );
  const districtFeatures = createM2PrototypeDistrictMapFeatures(districtById);
  const settlementFeatures = createM2PrototypeSettlementMapFeatures();
  const routeFeatures = createM2PrototypeRouteMapFeatures(routePreviewResults, districtFeatures);

  return {
    economyResult,
    routePreviewResults,
    map: {
      revision,
      bounds: {
        widthInMapUnits: 600,
        heightInMapUnits: 500
      },
      anchors: districtFeatures.map((district) => ({
        id: createClientMapAnchorId(`district-${formatThreeDigitId(Number(district.districtId))}`),
        label: district.displayName,
        xInMapUnits: district.anchor.xInMapUnits,
        yInMapUnits: district.anchor.yInMapUnits,
        tone: district.districtId === selected.districtId ? "primary" : "secondary"
      })),
      districts: districtFeatures,
      settlements: settlementFeatures,
      routes: routeFeatures
    },
    districtList: {
      revision,
      provenance: {
        kind: "simulation-read-model",
        note: "M2 prototype fixture projected from protocol read-model DTOs; not authoritative simulation state."
      },
      rows,
      selectedDistrictId: selected.districtId
    }
  };
}

export interface ProjectM2DistrictRowsInput {
  readonly economyResult: ListM2EconomySummariesResultV1;
  readonly routePreviewResults: readonly PreviewM2TransportRouteResultV1[];
}

export function projectM2DistrictRowsFromProtocolReadModels(
  input: ProjectM2DistrictRowsInput
): readonly ClientDistrictRowReadModel[] {
  const routeByOriginDistrictId = new Map<number, PreviewM2TransportRouteResultV1>();
  for (const preview of input.routePreviewResults) {
    routeByOriginDistrictId.set(preview.route.originDistrictId, preview);
  }

  return input.economyResult.districts.map((district) => {
    const districtId = createClientDistrictId(district.districtId);
    const preview = routeByOriginDistrictId.get(district.districtId);

    return {
      districtId,
      displayName: formatPrototypeDistrictDisplayName(district.districtId),
      seasonal: {
        monthOfYear: ((input.economyResult.day % 360) % 12) + 1,
        agriculturePhase: district.agriculturePhase,
        label: `${district.agriculturePhase} M${(((input.economyResult.day % 360) % 12) + 1)
          .toString()
          .padStart(2, "0")}`
      },
      population: district.population,
      labor: {
        available: district.availableLabor,
        committed: district.committedLabor
      },
      grain: {
        stock: district.grainStock,
        lastHarvest: district.lastHarvestGrain
      },
      cash: {
        stock: district.cashStock,
        cumulativeMobilizationCost: district.cumulativeMobilizationCost
      },
      route:
        preview === undefined
          ? createUnreachableRouteSummary(districtId)
          : routeSummaryFromPreview(preview)
    };
  });
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
      ],
      districts: [],
      settlements: [],
      routes: []
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

export function createClientSettlementId(value: number): ClientSettlementId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client settlement id must be a positive integer, received ${value}.`);
  }

  return value as ClientSettlementId;
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

function createM2PrototypeEconomyResult(revision: number): ListM2EconomySummariesResultV1 {
  const districts: M2EconomyDistrictProtocolRow[] = [];
  for (let districtNumber = 1; districtNumber <= M2_PROTOTYPE_DISTRICT_COUNT; districtNumber += 1) {
    const settlementCount = M2_PROTOTYPE_SETTLEMENT_DISTRICT_IDS.filter(
      (districtId) => districtId === districtNumber
    ).length;
    const phase = pickByIndex(SYNTHETIC_AGRICULTURE_PHASES, districtNumber - 1);

    districts.push({
      districtId: districtNumber,
      population: 1_000 + settlementCount * 250,
      availableLabor: 500 + settlementCount * 90,
      committedLabor: (districtNumber % 5) * 12,
      grainStock: 3_000 + settlementCount * 500 + (districtNumber - 1) * 37,
      cashStock: 1_000 + settlementCount * 180 + (districtNumber - 1) * 23,
      agriculturePhase: phase,
      lastHarvestGrain: phase === "harvest" ? 780 + districtNumber * 9 : 0,
      cumulativeMobilizationCost: (districtNumber % 6) * 45
    });
  }

  return {
    kind: "sim.list-m2-economy-summaries",
    day: 0,
    revision,
    districts
  };
}

function createM2PrototypeRoutePreviewResults(
  revision: number
): readonly PreviewM2TransportRouteResultV1[] {
  return M2_PROTOTYPE_ROUTE_PAIRS.map((pair, index) => {
    const routeKind = pickByIndex(M2_PROTOTYPE_ROUTE_KINDS, index);
    const stockAmount = 40 + (index % 3) * 20;
    const seasonalCapacity = 90 + (index % 5) * 45;
    const isCapacityExceeded = stockAmount > seasonalCapacity || index % 13 === 0;
    const status = isCapacityExceeded ? "capacity-exceeded" : "reachable";

    return {
      kind: "sim.preview-m2-transport-route",
      day: 0,
      revision,
      monthOfYear: 1,
      route: {
        status,
        originDistrictId: pair.originDistrictId,
        destinationDistrictId: pair.destinationDistrictId,
        stockAmount,
        totalCost: 8 + index * 2,
        bottleneckCapacity: seasonalCapacity,
        edges: [
          {
            routeId: index + 1,
            fromDistrictId: pair.originDistrictId,
            toDistrictId: pair.destinationDistrictId,
            routeKind,
            baseTravelCost: 8 + index,
            seasonalCost: 8 + index * 2,
            baseCapacity: 100 + (index % 4) * 40,
            seasonalCapacity,
            stockAmount,
            remainingCapacityAfterStock: Math.max(0, seasonalCapacity - stockAmount)
          }
        ]
      }
    };
  });
}

function createM2PrototypeDistrictMapFeatures(
  districtById: ReadonlyMap<ClientDistrictId, ClientDistrictRowReadModel>
): readonly ClientMapDistrictReadModel[] {
  const districts: ClientMapDistrictReadModel[] = [];
  for (let districtNumber = 1; districtNumber <= M2_PROTOTYPE_DISTRICT_COUNT; districtNumber += 1) {
    const districtId = createClientDistrictId(districtNumber);
    const row = districtById.get(districtId);
    if (row === undefined) {
      throw new Error(`Missing M2 district row ${districtNumber}.`);
    }

    const column = (districtNumber - 1) % M2_PROTOTYPE_GRID_COLUMNS;
    const rowIndex = Math.floor((districtNumber - 1) / M2_PROTOTYPE_GRID_COLUMNS);
    const x = column * M2_PROTOTYPE_CELL_SIZE;
    const y = rowIndex * M2_PROTOTYPE_CELL_SIZE;
    const polygon = [
      { xInMapUnits: x, yInMapUnits: y },
      { xInMapUnits: x + M2_PROTOTYPE_CELL_SIZE, yInMapUnits: y },
      {
        xInMapUnits: x + M2_PROTOTYPE_CELL_SIZE,
        yInMapUnits: y + M2_PROTOTYPE_CELL_SIZE
      },
      { xInMapUnits: x, yInMapUnits: y + M2_PROTOTYPE_CELL_SIZE }
    ];

    districts.push({
      districtId,
      displayName: row.displayName,
      anchor: {
        xInMapUnits: x + M2_PROTOTYPE_CELL_SIZE / 2,
        yInMapUnits: y + M2_PROTOTYPE_CELL_SIZE / 2
      },
      polygon,
      seasonal: row.seasonal,
      population: row.population,
      availableLabor: row.labor.available,
      grainStock: row.grain.stock,
      cashStock: row.cash.stock,
      route: row.route
    });
  }

  return districts;
}

function createM2PrototypeSettlementMapFeatures(): readonly ClientMapSettlementReadModel[] {
  return M2_PROTOTYPE_SETTLEMENT_DISTRICT_IDS.map((districtNumber, index) => {
    const districtId = createClientDistrictId(districtNumber);
    const column = (districtNumber - 1) % M2_PROTOTYPE_GRID_COLUMNS;
    const rowIndex = Math.floor((districtNumber - 1) / M2_PROTOTYPE_GRID_COLUMNS);

    return {
      settlementId: createClientSettlementId(index + 1),
      districtId,
      displayName: `Prototype Settlement ${formatThreeDigitId(index + 1)}`,
      anchor: {
        xInMapUnits: column * M2_PROTOTYPE_CELL_SIZE + 68,
        yInMapUnits: rowIndex * M2_PROTOTYPE_CELL_SIZE + 64
      }
    };
  });
}

function createM2PrototypeRouteMapFeatures(
  routePreviewResults: readonly PreviewM2TransportRouteResultV1[],
  districts: readonly ClientMapDistrictReadModel[]
): readonly ClientMapRouteReadModel[] {
  const anchorByDistrictId = new Map<ClientDistrictId, ClientMapPointReadModel>(
    districts.map((district) => [district.districtId, district.anchor])
  );

  return routePreviewResults.map((preview) => {
    const originDistrictId = createClientDistrictId(preview.route.originDistrictId);
    const destinationDistrictId = createClientDistrictId(preview.route.destinationDistrictId);
    const origin = anchorByDistrictId.get(originDistrictId);
    const destination = anchorByDistrictId.get(destinationDistrictId);
    if (origin === undefined || destination === undefined) {
      throw new Error("M2 route preview references a district outside the map read model.");
    }
    const routeSummary = routeSummaryFromPreview(preview);

    return {
      originDistrictId,
      destinationDistrictId,
      status: routeSummary.status,
      stockAmount: routeSummary.stockAmount,
      totalCost: routeSummary.totalCost,
      bottleneckCapacity: routeSummary.bottleneckCapacity,
      routeKinds: routeSummary.routeKinds,
      points: [origin, destination]
    };
  });
}

function routeSummaryFromPreview(
  preview: PreviewM2TransportRouteResultV1
): ClientDistrictRouteSummaryReadModel {
  const destinationDistrictId = createClientDistrictId(preview.route.destinationDistrictId);
  if (preview.route.status === "unreachable") {
    return {
      status: "unreachable",
      destinationDistrictId,
      stockAmount: preview.route.stockAmount,
      totalCost: null,
      bottleneckCapacity: null,
      edgeCount: 0,
      routeKinds: []
    };
  }

  return {
    status: preview.route.status,
    destinationDistrictId,
    stockAmount: preview.route.stockAmount,
    totalCost: preview.route.totalCost,
    bottleneckCapacity: preview.route.bottleneckCapacity,
    edgeCount: preview.route.edges.length,
    routeKinds: preview.route.edges.map((edge) => edge.routeKind)
  };
}

function createUnreachableRouteSummary(
  districtId: ClientDistrictId
): ClientDistrictRouteSummaryReadModel {
  return {
    status: "unreachable",
    destinationDistrictId: districtId,
    stockAmount: 0,
    totalCost: null,
    bottleneckCapacity: null,
    edgeCount: 0,
    routeKinds: []
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

function formatPrototypeDistrictDisplayName(districtNumber: number): string {
  return `Prototype District ${formatThreeDigitId(districtNumber)}`;
}

function formatThreeDigitId(value: number): string {
  return value.toString().padStart(3, "0");
}

type M2EconomyDistrictProtocolRow = ListM2EconomySummariesResultV1["districts"][number];

const SYNTHETIC_AGRICULTURE_PHASES: readonly string[] = [
  "fallow",
  "planting",
  "growing",
  "harvest"
];

const SYNTHETIC_ROUTE_KINDS: readonly ClientDistrictRouteKind[] = ["road", "river", "coast"];

const M2_PROTOTYPE_GRID_COLUMNS = 6;
const M2_PROTOTYPE_CELL_SIZE = 100;

const M2_PROTOTYPE_SETTLEMENT_DISTRICT_IDS: readonly number[] = [
  2, 5, 8, 11, 14, 17, 20, 23, 26, 29
];

const M2_PROTOTYPE_ROUTE_KINDS: readonly M2TransportRouteKindV1[] = ["road", "river", "coast"];

const M2_PROTOTYPE_ROUTE_PAIRS: readonly {
  readonly originDistrictId: number;
  readonly destinationDistrictId: number;
}[] = [
  ...createSequentialRoutePairs(1, 29),
  ...createStrideRoutePairs([1, 6, 11, 16, 21, 26]),
  ...createStrideRoutePairs([2, 8, 14, 20, 26]),
  ...createStrideRoutePairs([5, 10, 15, 20, 25])
];

function createSequentialRoutePairs(
  startDistrictId: number,
  count: number
): readonly { readonly originDistrictId: number; readonly destinationDistrictId: number }[] {
  const pairs: { readonly originDistrictId: number; readonly destinationDistrictId: number }[] = [];
  for (let index = 0; index < count; index += 1) {
    pairs.push({
      originDistrictId: startDistrictId + index,
      destinationDistrictId: startDistrictId + index + 1
    });
  }

  return pairs;
}

function createStrideRoutePairs(
  districtIds: readonly number[]
): readonly { readonly originDistrictId: number; readonly destinationDistrictId: number }[] {
  const pairs: { readonly originDistrictId: number; readonly destinationDistrictId: number }[] = [];
  for (let index = 0; index < districtIds.length - 1; index += 1) {
    const originDistrictId = districtIds[index];
    const destinationDistrictId = districtIds[index + 1];
    if (originDistrictId === undefined || destinationDistrictId === undefined) {
      throw new Error("Invalid M2 prototype route stride.");
    }
    pairs.push({ originDistrictId, destinationDistrictId });
  }

  return pairs;
}

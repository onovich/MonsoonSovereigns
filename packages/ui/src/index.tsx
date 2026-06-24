import {
  calculateClientVirtualWindow,
  findClientDistrictRow,
  selectClientDistrictRows,
  type ClientDistrictRowReadModel,
  type ClientDistrictSortDirection,
  type ClientDistrictSortKey,
  type ClientMapEntitySelection,
  type ClientMapMode,
  type ClientMapSettlementReadModel,
  type ClientReadModelSnapshot
} from "@monsoon/client-core";
import { useMemo, useState, type ChangeEvent, type ReactElement, type UIEvent } from "react";

export interface ClientShellViewProps {
  readonly snapshot: ClientReadModelSnapshot;
  readonly mapSurface: ReactElement;
  readonly mapMode: ClientMapMode;
  readonly zoomLevel: number;
  readonly selectedEntity: ClientMapEntitySelection | null;
  readonly onMapModeChange: (mode: ClientMapMode) => void;
  readonly onZoomLevelChange: (zoomLevel: number) => void;
  readonly onSelectedEntityChange: (selection: ClientMapEntitySelection) => void;
}

const DISTRICT_ROW_HEIGHT_PX = 44;
const DISTRICT_TABLE_VIEWPORT_HEIGHT_PX = 352;
const DISTRICT_TABLE_OVERSCAN_ROWS = 8;

export function ClientShellView({
  snapshot,
  mapSurface,
  mapMode,
  zoomLevel,
  selectedEntity,
  onMapModeChange,
  onZoomLevelChange,
  onSelectedEntityChange
}: ClientShellViewProps): ReactElement {
  const selectedDistrictId =
    selectedEntity?.kind === "settlement"
      ? selectedEntity.districtId
      : (selectedEntity?.districtId ?? snapshot.districtList.selectedDistrictId);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<ClientDistrictSortKey>("district");
  const [sortDirection, setSortDirection] = useState<ClientDistrictSortDirection>("ascending");
  const [scrollTopPx, setScrollTopPx] = useState(0);
  const [lastSelectionMs, setLastSelectionMs] = useState(0);

  const districtProjection = useMemo(() => {
    const startedAt = getHighResolutionTime();
    const rows = selectClientDistrictRows({
      rows: snapshot.districtList.rows,
      filter,
      sortKey,
      sortDirection
    });
    return {
      rows,
      derivationMs: getHighResolutionTime() - startedAt
    };
  }, [filter, snapshot.districtList.rows, sortDirection, sortKey]);

  const virtualWindow = calculateClientVirtualWindow({
    rowCount: districtProjection.rows.length,
    rowHeightPx: DISTRICT_ROW_HEIGHT_PX,
    viewportHeightPx: DISTRICT_TABLE_VIEWPORT_HEIGHT_PX,
    scrollTopPx,
    overscanRows: DISTRICT_TABLE_OVERSCAN_ROWS
  });

  const selectedDistrict =
    findClientDistrictRow(snapshot.districtList.rows, selectedDistrictId) ??
    districtProjection.rows[0] ??
    null;
  const selectedSettlement =
    selectedEntity?.kind === "settlement"
      ? (snapshot.map.settlements.find(
          (settlement) => settlement.settlementId === selectedEntity.settlementId
        ) ?? null)
      : null;
  const visibleRows = districtProjection.rows.slice(
    virtualWindow.startIndex,
    virtualWindow.endIndex
  );

  function handleFilterChange(event: ChangeEvent<HTMLInputElement>): void {
    setFilter(event.currentTarget.value);
    setScrollTopPx(0);
  }

  function handleScroll(event: UIEvent<HTMLDivElement>): void {
    setScrollTopPx(event.currentTarget.scrollTop);
  }

  function handleSort(nextSortKey: ClientDistrictSortKey): void {
    if (nextSortKey === sortKey) {
      setSortDirection(sortDirection === "ascending" ? "descending" : "ascending");
    } else {
      setSortKey(nextSortKey);
      setSortDirection("descending");
    }
    setScrollTopPx(0);
  }

  function handleSelect(row: ClientDistrictRowReadModel): void {
    const startedAt = getHighResolutionTime();
    onSelectedEntityChange({ kind: "district", districtId: row.districtId });
    setLastSelectionMs(getHighResolutionTime() - startedAt);
  }

  function handleZoomIn(): void {
    onZoomLevelChange(clampZoomLevel(zoomLevel + 0.25));
  }

  function handleZoomOut(): void {
    onZoomLevelChange(clampZoomLevel(zoomLevel - 0.25));
  }

  return (
    <main className="client-shell" aria-label="Monsoon Sovereigns client shell">
      <section className="client-shell__map" aria-label="Map read model projection">
        <div className="map-toolbar" aria-label="M2 map controls">
          <div className="map-mode" role="group" aria-label="Map mode">
            <MapModeButton
              label="Seasonal"
              mode="seasonal"
              activeMode={mapMode}
              onSelect={onMapModeChange}
            />
            <MapModeButton
              label="Economy"
              mode="economy"
              activeMode={mapMode}
              onSelect={onMapModeChange}
            />
            <MapModeButton
              label="Routes"
              mode="routes"
              activeMode={mapMode}
              onSelect={onMapModeChange}
            />
          </div>
          <div className="map-zoom" role="group" aria-label="Map zoom">
            <button type="button" aria-label="Zoom out" onClick={handleZoomOut}>
              -
            </button>
            <output aria-label="Map zoom level" data-zoom-level={zoomLevel.toFixed(2)}>
              {Math.round(zoomLevel * 100)}%
            </output>
            <button type="button" aria-label="Zoom in" onClick={handleZoomIn}>
              +
            </button>
          </div>
        </div>

        <div
          className="client-shell__map-surface"
          data-district-count={snapshot.map.districts.length}
          data-settlement-count={snapshot.map.settlements.length}
          data-route-count={snapshot.map.routes.length}
          data-map-mode={mapMode}
          data-zoom-level={zoomLevel.toFixed(2)}
          data-selected-district-id={selectedDistrict?.districtId ?? "none"}
          data-selected-entity-kind={selectedEntity?.kind ?? "none"}
        >
          <span className="client-shell__map-revision">Revision {snapshot.revision}</span>
          {mapSurface}
          <span className="client-shell__map-selection">
            {formatMapSelection(selectedDistrict, selectedSettlement)}
          </span>
        </div>
      </section>

      <section className="client-shell__operations" aria-label="M2 district operations">
        <header className="client-shell__header">
          <div>
            <h1>Monsoon Sovereigns</h1>
            <p>{snapshot.panels.headline}</p>
          </div>
          <dl className="client-shell__status">
            {snapshot.panels.metrics.map((metric) => (
              <div className="client-shell__metric" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="district-workspace">
          <section className="district-list" aria-label="M2 district list">
            <div className="district-list__toolbar">
              <label className="district-list__filter">
                <span>Filter</span>
                <input
                  aria-label="Filter districts"
                  value={filter}
                  onChange={handleFilterChange}
                  placeholder="District, phase, route"
                />
              </label>
              <output
                aria-label="District list performance"
                data-testid="district-list-performance"
                data-derivation-ms={districtProjection.derivationMs.toFixed(3)}
                data-selection-ms={lastSelectionMs.toFixed(3)}
              >
                {districtProjection.derivationMs.toFixed(2)} ms
              </output>
            </div>

            <div className="district-list__head">
              <SortButton
                label="District"
                sortKey="district"
                activeSortKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortButton
                label="Population"
                sortKey="population"
                activeSortKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortButton
                label="Labor"
                sortKey="labor"
                activeSortKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortButton
                label="Grain"
                sortKey="grain"
                activeSortKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortButton
                label="Cash"
                sortKey="cash"
                activeSortKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortButton
                label="Route"
                sortKey="route"
                activeSortKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </div>

            <div
              className="district-list__viewport"
              aria-label="Virtualized district rows"
              data-row-count={snapshot.districtList.rows.length}
              data-filtered-row-count={districtProjection.rows.length}
              data-rendered-row-count={visibleRows.length}
              onScroll={handleScroll}
            >
              <div
                className="district-list__spacer"
                style={{ height: `${virtualWindow.totalHeightPx}px` }}
              >
                <div
                  className="district-list__rows"
                  style={{ transform: `translateY(${virtualWindow.offsetTopPx}px)` }}
                >
                  {visibleRows.map((row) => (
                    <DistrictRowButton
                      key={row.districtId}
                      row={row}
                      isSelected={selectedDistrictId === row.districtId}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <DistrictPanel
            row={selectedDistrict}
            selectedSettlement={selectedSettlement}
            provenanceNote={snapshot.districtList.provenance.note}
          />
        </div>
      </section>
    </main>
  );
}

interface MapModeButtonProps {
  readonly label: string;
  readonly mode: ClientMapMode;
  readonly activeMode: ClientMapMode;
  readonly onSelect: (mode: ClientMapMode) => void;
}

function MapModeButton({ label, mode, activeMode, onSelect }: MapModeButtonProps): ReactElement {
  return (
    <button
      type="button"
      aria-label={`${label} map mode`}
      aria-pressed={activeMode === mode}
      onClick={() => onSelect(mode)}
    >
      {label}
    </button>
  );
}

interface SortButtonProps {
  readonly label: string;
  readonly sortKey: ClientDistrictSortKey;
  readonly activeSortKey: ClientDistrictSortKey;
  readonly direction: ClientDistrictSortDirection;
  readonly onSort: (sortKey: ClientDistrictSortKey) => void;
}

function SortButton({
  label,
  sortKey,
  activeSortKey,
  direction,
  onSort
}: SortButtonProps): ReactElement {
  const isActive = activeSortKey === sortKey;
  const suffix = isActive ? (direction === "ascending" ? " up" : " down") : "";

  return (
    <button
      className="district-list__sort"
      type="button"
      aria-label={`Sort by ${label}`}
      data-active={isActive}
      onClick={() => onSort(sortKey)}
    >
      {label}
      <span aria-hidden="true">{suffix}</span>
    </button>
  );
}

interface DistrictRowButtonProps {
  readonly row: ClientDistrictRowReadModel;
  readonly isSelected: boolean;
  readonly onSelect: (row: ClientDistrictRowReadModel) => void;
}

function DistrictRowButton({ row, isSelected, onSelect }: DistrictRowButtonProps): ReactElement {
  return (
    <button
      className="district-list__row"
      type="button"
      aria-label={`Select ${row.displayName}`}
      aria-pressed={isSelected}
      data-district-id={row.districtId}
      onClick={() => onSelect(row)}
      style={{ height: `${DISTRICT_ROW_HEIGHT_PX}px` }}
    >
      <span>{row.displayName}</span>
      <span>{formatInteger(row.population)}</span>
      <span>{formatInteger(row.labor.available)}</span>
      <span>{formatInteger(row.grain.stock)}</span>
      <span>{formatInteger(row.cash.stock)}</span>
      <span>{formatRouteCell(row)}</span>
    </button>
  );
}

interface DistrictPanelProps {
  readonly row: ClientDistrictRowReadModel | null;
  readonly selectedSettlement: ClientMapSettlementReadModel | null;
  readonly provenanceNote: string;
}

function DistrictPanel({
  row,
  selectedSettlement,
  provenanceNote
}: DistrictPanelProps): ReactElement {
  if (row === null) {
    return (
      <aside className="district-panel" aria-label="M2 district panel">
        <h2>M2 district panel</h2>
        <p>No district row is available.</p>
      </aside>
    );
  }

  return (
    <aside
      className="district-panel"
      aria-label="M2 district panel"
      data-selected-district-id={row.districtId}
    >
      <div className="district-panel__title">
        <h2>{row.displayName}</h2>
        <span>{row.seasonal.label}</span>
      </div>
      <dl className="district-panel__metrics">
        {selectedSettlement === null ? null : (
          <Metric label="Settlement" value={selectedSettlement.displayName} />
        )}
        <Metric label="Population" value={formatInteger(row.population)} />
        <Metric
          label="Labor"
          value={`${formatInteger(row.labor.available)} available / ${formatInteger(
            row.labor.committed
          )} committed`}
        />
        <Metric
          label="Grain"
          value={`${formatInteger(row.grain.stock)} stock / ${formatInteger(
            row.grain.lastHarvest
          )} harvest`}
        />
        <Metric
          label="Cash"
          value={`${formatInteger(row.cash.stock)} stock / ${formatInteger(
            row.cash.cumulativeMobilizationCost
          )} mobilized`}
        />
        <Metric label="Route" value={formatRouteSummary(row)} />
      </dl>
      <p className="district-panel__provenance">{provenanceNote}</p>
    </aside>
  );
}

interface MetricProps {
  readonly label: string;
  readonly value: string;
}

function Metric({ label, value }: MetricProps): ReactElement {
  return (
    <div className="district-panel__metric">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatRouteCell(row: ClientDistrictRowReadModel): string {
  if (row.route.totalCost === null) {
    return row.route.status;
  }

  return `${row.route.status} ${row.route.totalCost}`;
}

function formatRouteSummary(row: ClientDistrictRowReadModel): string {
  const routeKinds = row.route.routeKinds.length === 0 ? "none" : row.route.routeKinds.join("/");
  if (row.route.totalCost === null || row.route.bottleneckCapacity === null) {
    return `${row.route.status}; to district ${row.route.destinationDistrictId}; edges ${row.route.edgeCount}; ${routeKinds}`;
  }

  return `${row.route.status}; to district ${row.route.destinationDistrictId}; cost ${row.route.totalCost}; bottleneck ${row.route.bottleneckCapacity}; ${routeKinds}`;
}

function clampZoomLevel(value: number): number {
  return Math.min(2, Math.max(0.75, value));
}

function formatMapSelection(
  selectedDistrict: ClientDistrictRowReadModel | null,
  selectedSettlement: ClientMapSettlementReadModel | null
): string {
  if (selectedDistrict === null) {
    return "No district selected";
  }
  if (selectedSettlement !== null) {
    return `${selectedSettlement.displayName} / ${selectedDistrict.displayName}`;
  }

  return selectedDistrict.displayName;
}

function getHighResolutionTime(): number {
  const timer = globalThis.performance;
  if (timer === undefined) {
    return 0;
  }

  return timer.now();
}

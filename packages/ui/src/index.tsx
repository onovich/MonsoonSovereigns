import {
  calculateClientVirtualWindow,
  createM3AppointmentCommand,
  createM3BulkAppointmentCommand,
  findClientDistrictRow,
  findM3Character,
  findM3Office,
  selectClientDistrictRows,
  type ClientDistrictRowReadModel,
  type ClientDistrictSortDirection,
  type ClientDistrictSortKey,
  type ClientMapEntitySelection,
  type ClientMapMode,
  type ClientMapSettlementReadModel,
  type ClientM3AppointmentEligibilityReadModel,
  type ClientM3AppointmentReadModelSnapshot,
  type ClientM3BulkAppointmentPreviewItemReadModel,
  type ClientM3CharacterReadModel,
  type ClientM3OfficeReadModel,
  type ClientM3SubmittedCommand,
  type ClientOfficeId,
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
  readonly onM3CommandSubmit: (command: ClientM3SubmittedCommand) => void;
  readonly m3CommandStatus: string | null;
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
  onSelectedEntityChange,
  onM3CommandSubmit,
  m3CommandStatus
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
  const [selectedM3OfficeId, setSelectedM3OfficeId] = useState<ClientOfficeId | null>(
    snapshot.m3Appointment.offices[0]?.officeId ?? null
  );
  const [selectedM3CandidateKey, setSelectedM3CandidateKey] = useState("");
  const [showRejectedM3Candidates, setShowRejectedM3Candidates] = useState(true);
  const [m3SubmitSequence, setM3SubmitSequence] = useState(0);

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
  const selectedM3Office =
    selectedM3OfficeId === null
      ? (snapshot.m3Appointment.offices[0] ?? null)
      : (findM3Office(snapshot.m3Appointment.offices, selectedM3OfficeId) ??
        snapshot.m3Appointment.offices[0] ??
        null);
  const visibleM3CandidateEligibilities =
    selectedM3Office === null
      ? []
      : selectedM3Office.candidateEligibilities.filter(
          (eligibility) => showRejectedM3Candidates || eligibility.status === "eligible"
        );
  const firstEligibleM3Candidate =
    selectedM3Office?.candidateEligibilities.find(
      (eligibility) => eligibility.status === "eligible"
    ) ?? null;
  const selectedM3Eligibility =
    visibleM3CandidateEligibilities.find(
      (eligibility) => Number(eligibility.characterId).toString() === selectedM3CandidateKey
    ) ?? firstEligibleM3Candidate;

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

  function handleM3OfficeChange(event: ChangeEvent<HTMLSelectElement>): void {
    const officeId = Number(event.currentTarget.value);
    const office = snapshot.m3Appointment.offices.find(
      (candidateOffice) => Number(candidateOffice.officeId) === officeId
    );
    setSelectedM3OfficeId(office?.officeId ?? null);
    setSelectedM3CandidateKey("");
  }

  function handleM3CandidateChange(event: ChangeEvent<HTMLSelectElement>): void {
    setSelectedM3CandidateKey(event.currentTarget.value);
  }

  function handleM3RejectedToggle(event: ChangeEvent<HTMLInputElement>): void {
    setShowRejectedM3Candidates(event.currentTarget.checked);
  }

  function handleSubmitM3Appointment(): void {
    if (selectedM3Office === null || selectedM3Eligibility === null) {
      return;
    }
    const nextSequence = m3SubmitSequence + 1;
    setM3SubmitSequence(nextSequence);
    onM3CommandSubmit(
      createM3AppointmentCommand({
        snapshot: snapshot.m3Appointment,
        commandId: `client.m3.appointment.${snapshot.m3Appointment.revision}.${nextSequence}`,
        officeId: selectedM3Office.officeId,
        characterId: selectedM3Eligibility.characterId
      })
    );
  }

  function handleSubmitM3BulkAppointments(): void {
    const nextSequence = m3SubmitSequence + 1;
    setM3SubmitSequence(nextSequence);
    onM3CommandSubmit(
      createM3BulkAppointmentCommand({
        snapshot: snapshot.m3Appointment,
        commandId: `client.m3.bulk-appointment.${snapshot.m3Appointment.revision}.${nextSequence}`
      })
    );
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

        <M3AppointmentWorkspace
          snapshot={snapshot.m3Appointment}
          selectedOffice={selectedM3Office}
          candidateEligibilities={visibleM3CandidateEligibilities}
          selectedEligibility={selectedM3Eligibility}
          showRejectedCandidates={showRejectedM3Candidates}
          commandStatus={m3CommandStatus}
          onOfficeChange={handleM3OfficeChange}
          onCandidateChange={handleM3CandidateChange}
          onRejectedToggle={handleM3RejectedToggle}
          onSubmitAppointment={handleSubmitM3Appointment}
          onSubmitBulk={handleSubmitM3BulkAppointments}
        />
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

interface M3AppointmentWorkspaceProps {
  readonly snapshot: ClientM3AppointmentReadModelSnapshot;
  readonly selectedOffice: ClientM3OfficeReadModel | null;
  readonly candidateEligibilities: readonly ClientM3AppointmentEligibilityReadModel[];
  readonly selectedEligibility: ClientM3AppointmentEligibilityReadModel | null;
  readonly showRejectedCandidates: boolean;
  readonly commandStatus: string | null;
  readonly onOfficeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onCandidateChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onRejectedToggle: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly onSubmitAppointment: () => void;
  readonly onSubmitBulk: () => void;
}

function M3AppointmentWorkspace({
  snapshot,
  selectedOffice,
  candidateEligibilities,
  selectedEligibility,
  showRejectedCandidates,
  commandStatus,
  onOfficeChange,
  onCandidateChange,
  onRejectedToggle,
  onSubmitAppointment,
  onSubmitBulk
}: M3AppointmentWorkspaceProps): ReactElement {
  const selectedCharacter = findM3Character(
    snapshot.characters,
    selectedEligibility?.characterId ?? null
  );
  const canSubmitAppointment =
    selectedOffice !== null &&
    selectedEligibility !== null &&
    selectedEligibility.status === "eligible";

  return (
    <section
      className="m3-appointment"
      aria-label="M3 appointment workspace"
      data-office-count={snapshot.offices.length}
      data-character-count={snapshot.characters.length}
      data-obligation-count={snapshot.obligations.length}
      data-bulk-eligible-count={snapshot.bulkPreview.eligibleCount}
      data-bulk-rejected-count={snapshot.bulkPreview.rejectedCount}
    >
      <div className="m3-appointment__header">
        <div>
          <h2>M3 appointments</h2>
          <p>{snapshot.provenance.note}</p>
        </div>
        <dl className="m3-appointment__summary">
          <Metric label="Offices" value={snapshot.offices.length.toString()} />
          <Metric label="Candidates" value={snapshot.characters.length.toString()} />
          <Metric label="Bulk eligible" value={snapshot.bulkPreview.eligibleCount.toString()} />
          <Metric label="Rejected" value={snapshot.bulkPreview.rejectedCount.toString()} />
        </dl>
      </div>

      <div className="m3-appointment__grid">
        <section className="m3-appointment__panel" aria-label="Appointment command panel">
          <div className="m3-appointment__controls">
            <label>
              <span>Office</span>
              <select
                aria-label="Select M3 office"
                value={selectedOffice === null ? "" : Number(selectedOffice.officeId).toString()}
                onChange={onOfficeChange}
              >
                {snapshot.offices.map((office) => (
                  <option key={office.officeId} value={Number(office.officeId).toString()}>
                    {office.displayName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Candidate</span>
              <select
                aria-label="Select appointment candidate"
                value={
                  selectedEligibility === null
                    ? ""
                    : Number(selectedEligibility.characterId).toString()
                }
                onChange={onCandidateChange}
              >
                {candidateEligibilities.map((eligibility) => {
                  const character = findM3Character(snapshot.characters, eligibility.characterId);
                  return (
                    <option
                      key={`${eligibility.officeId}-${eligibility.characterId}`}
                      value={Number(eligibility.characterId).toString()}
                      disabled={eligibility.status === "rejected"}
                    >
                      {character?.displayName ?? `Character ${eligibility.characterId}`} /{" "}
                      {eligibility.status}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="m3-appointment__toggle">
              <input type="checkbox" checked={showRejectedCandidates} onChange={onRejectedToggle} />
              <span>Show rejected candidates</span>
            </label>
          </div>

          <OfficeDetail office={selectedOffice} selectedCharacter={selectedCharacter} />

          <div className="m3-appointment__actions">
            <button
              type="button"
              disabled={!canSubmitAppointment}
              onClick={onSubmitAppointment}
              data-command-kind="sim.appoint-office"
            >
              Submit appointment
            </button>
            <button
              type="button"
              disabled={snapshot.bulkPreview.eligibleCount === 0}
              onClick={onSubmitBulk}
              data-command-kind="sim.appoint-offices-bulk"
            >
              Submit bulk eligible appointments
            </button>
          </div>

          {commandStatus === null ? null : (
            <output className="m3-appointment__command-status" aria-label="M3 command status">
              {commandStatus}
            </output>
          )}
        </section>

        <section className="m3-appointment__panel" aria-label="Appointment validation reasons">
          <h3>Candidate reasons</h3>
          <div className="m3-appointment__reason-list">
            {candidateEligibilities.map((eligibility) => {
              const character = findM3Character(snapshot.characters, eligibility.characterId);
              return (
                <ReasonCard
                  key={`${eligibility.officeId}-${eligibility.characterId}`}
                  title={character?.displayName ?? `Character ${eligibility.characterId}`}
                  status={eligibility.status}
                  reasonCodes={eligibility.reasonCodes}
                />
              );
            })}
          </div>
        </section>

        <section className="m3-appointment__panel" aria-label="Bulk appointment preview">
          <h3>Bulk preview</h3>
          <div className="m3-appointment__bulk">
            {snapshot.bulkPreview.items.map((item) => (
              <BulkPreviewRow key={item.itemId} item={item} snapshot={snapshot} />
            ))}
          </div>
        </section>

        <section className="m3-appointment__panel" aria-label="Vacancy succession and obligations">
          <h3>Vacancies, succession, obligations</h3>
          <div className="m3-appointment__stack">
            {snapshot.successionCrises.map((crisis) => (
              <div className="m3-appointment__fact" key={crisis.successionId}>
                <strong>Succession {crisis.successionId}</strong>
                <span>
                  {crisis.status}; vacancies {crisis.vacancyOfficeIds.length}; candidates{" "}
                  {crisis.candidates.length}
                </span>
              </div>
            ))}
            {snapshot.obligations.map((obligation) => (
              <div className="m3-appointment__fact" key={obligation.obligationId}>
                <strong>{obligation.obligationKind}</strong>
                <span>
                  {obligation.amount} / {obligation.dueLabel} / {obligation.status}
                </span>
                <ReasonChips reasonCodes={obligation.reasonCodes} />
              </div>
            ))}
          </div>
        </section>

        <section className="m3-appointment__panel" aria-label="Appointment and enfeoffment results">
          <h3>Results</h3>
          <div className="m3-appointment__stack">
            {snapshot.appointmentResults.map((result) => (
              <div className="m3-appointment__fact" key={`office-${result.officeId}`}>
                <strong>Office {result.officeId}</strong>
                <span>{result.status}</span>
                <ReasonChips reasonCodes={result.reasonCodes} />
              </div>
            ))}
            {snapshot.enfeoffmentResults.map((result) => (
              <div className="m3-appointment__fact" key={`district-${result.districtId}`}>
                <strong>District {result.districtId}</strong>
                <span>granted to character {result.holderCharacterId}</span>
                <ReasonChips reasonCodes={result.reasonCodes} />
              </div>
            ))}
          </div>
        </section>

        <section className="m3-appointment__panel" aria-label="Visible reason summaries">
          <h3>Reason summary</h3>
          <div className="m3-appointment__reason-summary">
            {snapshot.reasonSummaries.slice(0, 10).map((summary) => (
              <div className="m3-appointment__fact" key={summary.reasonCode}>
                <strong>{summary.reasonCode}</strong>
                <span>
                  {summary.count} / {summary.sourceKinds.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

interface OfficeDetailProps {
  readonly office: ClientM3OfficeReadModel | null;
  readonly selectedCharacter: ClientM3CharacterReadModel | null;
}

function OfficeDetail({ office, selectedCharacter }: OfficeDetailProps): ReactElement {
  if (office === null) {
    return (
      <div className="m3-appointment__empty">
        <p>No M3 office read-model row is available.</p>
      </div>
    );
  }

  return (
    <div className="m3-appointment__detail" data-selected-office-id={office.officeId}>
      <h3>{office.displayName}</h3>
      <dl>
        <Metric label="Kind" value={office.officeKind} />
        <Metric label="Holder" value={formatNullableCharacter(office.holderCharacterId)} />
        <Metric
          label="Policy continuity"
          value={`${office.policy.stance}; ${office.policy.continuity}`}
        />
        <Metric label="Performance" value={formatBps(office.executionPerformanceBps)} />
        <Metric
          label="Selected candidate"
          value={selectedCharacter?.displayName ?? "No eligible candidate selected"}
        />
      </dl>
      {office.administrativePreview === null ? null : (
        <div className="m3-appointment__admin">
          <strong>Administrative impact preview</strong>
          <span>
            load {office.administrativePreview.administrativeLoad}; efficiency{" "}
            {formatBps(office.administrativePreview.efficiencyBps)}; readiness{" "}
            {formatBps(office.administrativePreview.readinessBps)}
          </span>
          <ReasonChips reasonCodes={office.administrativePreview.reasonCodes} />
        </div>
      )}
      <ReasonChips reasonCodes={[...office.reasonCodes, ...office.policy.reasonCodes]} />
    </div>
  );
}

interface ReasonCardProps {
  readonly title: string;
  readonly status: string;
  readonly reasonCodes: readonly string[];
}

function ReasonCard({ title, status, reasonCodes }: ReasonCardProps): ReactElement {
  return (
    <div className="m3-appointment__reason-card" data-status={status}>
      <strong>{title}</strong>
      <span>{status}</span>
      <ReasonChips reasonCodes={reasonCodes} />
    </div>
  );
}

interface BulkPreviewRowProps {
  readonly item: ClientM3BulkAppointmentPreviewItemReadModel;
  readonly snapshot: ClientM3AppointmentReadModelSnapshot;
}

function BulkPreviewRow({ item, snapshot }: BulkPreviewRowProps): ReactElement {
  const office = findM3Office(snapshot.offices, item.officeId);
  const character = findM3Character(snapshot.characters, item.characterId);
  return (
    <div className="m3-appointment__bulk-row" data-status={item.status}>
      <span>{office?.displayName ?? `Office ${item.officeId}`}</span>
      <span>{character?.displayName ?? "Vacate"}</span>
      <span>{item.status}</span>
      <ReasonChips reasonCodes={item.reasonCodes} />
    </div>
  );
}

interface ReasonChipsProps {
  readonly reasonCodes: readonly string[];
}

function ReasonChips({ reasonCodes }: ReasonChipsProps): ReactElement {
  return (
    <span className="m3-appointment__reasons">
      {reasonCodes.map((reasonCode) => (
        <span className="m3-appointment__reason" key={reasonCode}>
          {reasonCode}
        </span>
      ))}
    </span>
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

function formatBps(value: number): string {
  return `${Math.round(value / 100)}%`;
}

function formatNullableCharacter(characterId: number | null): string {
  return characterId === null ? "Vacant" : `Character ${characterId}`;
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

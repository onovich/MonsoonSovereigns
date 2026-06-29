import {
  calculateClientVirtualWindow,
  createM3AppointmentCommand,
  createM3BulkAppointmentCommand,
  createM4CampaignPlanCommand,
  createM4CancelCampaignCommand,
  createM4SiegeChoiceCommand,
  createM4StartMarchCommand,
  createM4WithdrawalCommand,
  createM5SessionSave,
  createM6SessionSave,
  findClientDistrictRow,
  findM3Character,
  findM3Office,
  findM4CampaignPlan,
  getM5CurrentStep,
  getM6CurrentStep,
  parseM5SessionSave,
  parseM6SessionSave,
  selectClientDistrictRows,
  type ClientCampaignPlanId,
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
  type ClientM3ObligationReadModel,
  type ClientM3SubmittedCommand,
  type ClientM4CampaignPlanReadModel,
  type ClientM4CampaignReadModelSnapshot,
  type ClientM4GrainSupplyReadModel,
  type ClientM4MarchReadModel,
  type ClientM4MusterReadModel,
  type ClientM4RouteForecastReadModel,
  type ClientM4SiegeChoice,
  type ClientM4SiegeReadModel,
  type ClientM4SubmittedCommand,
  type ClientM4WarReportReadModel,
  type ClientM4WithdrawalReadModel,
  type ClientM5PlayablePhase,
  type ClientM5PlayableReadModelSnapshot,
  type ClientM5PlayableStepReadModel,
  type ClientM5SubmittedCommand,
  type ClientM6AdviserReadModel,
  type ClientM6AlphaPhase,
  type ClientM6AlphaReadModelSnapshot,
  type ClientM6AlphaStepReadModel,
  type ClientM6DiplomacyReadModel,
  type ClientM6EncyclopediaReadModel,
  type ClientM6LegitimacyReadModel,
  type ClientM6MapCandidateReadModel,
  type ClientM6PolicyEventReadModel,
  type ClientM6ReasonSummaryReadModel,
  type ClientM6SubmittedCommand,
  type ClientM6SuccessionReadModel,
  type ClientM6TerminalReadModel,
  type ClientM7EncyclopediaEntryReadModel,
  type ClientM7AudioArtLocalizationCoverageReadModel,
  type ClientM7CoverageSurface,
  type ClientM7GuidanceReadModelSnapshot,
  type ClientM7HintGroupReadModel,
  type ClientM7ScenarioGuidanceReadModel,
  type ClientM7TutorialStepReadModel,
  type ClientOfficeId,
  type ClientReadModelSnapshot
} from "@monsoon/client-core";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactElement,
  type UIEvent
} from "react";

import {
  CLIENT_LOCALE_PREFERENCES,
  DEFAULT_CLIENT_I18N,
  type ClientI18n,
  type ClientLocalePreference
} from "./i18n";

export {
  CLIENT_ASSET_REPLACEMENT_SLOTS,
  CLIENT_ASSET_SLOT_PLACEHOLDER_NOTE,
  CLIENT_ASSET_SLOT_REVIEW_GATES,
  CLIENT_ASSET_SLOT_TOKEN_REFERENCE,
  createAssetSlotStressFixture,
  hasOnlyNeutralPlaceholderAssets,
  listClientAssetReplacementSlots,
  type ClientAssetReplacementSlot,
  type ClientAssetSlotCategory,
  type ClientAssetSlotReviewGate,
  type ClientAssetSlotRole,
  type ClientAssetSlotStatus
} from "./asset-slots";
export {
  CLIENT_DESIGN_TOKENS,
  CLIENT_SEMANTIC_STATES,
  type ClientDesignTokens,
  type ClientSemanticState
} from "./design-tokens";
export {
  DesignTokenAssetSlotsView,
  type DesignTokenAssetSlotsEvidenceState,
  type DesignTokenAssetSlotsViewProps
} from "./design-token-asset-slots-view";
export {
  CLIENT_LOCALE_PREFERENCES,
  CLIENT_RESOLVED_LOCALES,
  DEFAULT_CLIENT_I18N,
  ENGLISH_CANONICAL_LOCALE,
  SIMPLIFIED_CHINESE_CANONICAL_LOCALE,
  SUPPORTED_CLIENT_LOCALE_FAMILIES,
  createClientI18n,
  isBareReasonCodeLike,
  normalizeClientLocaleTag,
  parseClientLocalePreference,
  resolveClientLocale,
  type ClientI18n,
  type ClientLocalePreference,
  type ClientResolvedLocale,
  type UiMessageKey
} from "./i18n";

export interface ClientShellViewProps {
  readonly snapshot: ClientReadModelSnapshot;
  readonly mapSurface: ReactElement;
  readonly mapMode: ClientMapMode;
  readonly zoomLevel: number;
  readonly panOffset?: ClientMapPanOffset;
  readonly selectedEntity: ClientMapEntitySelection | null;
  readonly hoveredEntity?: ClientMapEntitySelection | null;
  readonly m6BatchBalanceArtifact?: M6BatchBalanceDashboardArtifact | null;
  readonly initialM7Surface?: ClientM7CoverageSurface;
  readonly initialDebugMode?: boolean;
  readonly i18n?: ClientI18n;
  readonly localePreference?: ClientLocalePreference;
  readonly onLocalePreferenceChange?: (preference: ClientLocalePreference) => void;
  readonly onMapModeChange: (mode: ClientMapMode) => void;
  readonly onZoomLevelChange: (zoomLevel: number) => void;
  readonly onPanOffsetChange?: (panOffset: ClientMapPanOffset) => void;
  readonly onSelectedEntityChange: (selection: ClientMapEntitySelection) => void;
  readonly onHoveredEntityChange?: (selection: ClientMapEntitySelection | null) => void;
  readonly onM3CommandSubmit: (command: ClientM3SubmittedCommand) => void;
  readonly m3CommandStatus: string | null;
  readonly onM4CommandSubmit: (command: ClientM4SubmittedCommand) => void;
  readonly m4CommandStatus: string | null;
  readonly onM5CommandSubmit: (command: ClientM5SubmittedCommand) => void;
  readonly m5CommandStatus: string | null;
  readonly onM6CommandSubmit: (command: ClientM6SubmittedCommand) => void;
  readonly m6CommandStatus: string | null;
}

export interface ClientMapPanOffset {
  readonly xInMapUnits: number;
  readonly yInMapUnits: number;
}

const DISTRICT_ROW_HEIGHT_PX = 44;
const DISTRICT_TABLE_VIEWPORT_HEIGHT_PX = 352;
const DISTRICT_TABLE_OVERSCAN_ROWS = 8;
const MAP_PAN_STEP_IN_MAP_UNITS = 24;
const MAP_PAN_LIMIT_IN_MAP_UNITS = 180;
const ZERO_MAP_PAN_OFFSET: ClientMapPanOffset = {
  xInMapUnits: 0,
  yInMapUnits: 0
};
const ClientI18nContext = createContext<ClientI18n>(DEFAULT_CLIENT_I18N);
type M3AppointmentFlowStage = "select-office" | "compare-candidates" | "preview" | "result";
type DistrictRouteStatusFilter = ClientDistrictRowReadModel["route"]["status"] | "all";

export function ClientShellView({
  snapshot,
  mapSurface,
  mapMode,
  zoomLevel,
  panOffset = ZERO_MAP_PAN_OFFSET,
  selectedEntity,
  hoveredEntity = null,
  m6BatchBalanceArtifact = null,
  initialM7Surface = "tutorial",
  initialDebugMode = false,
  i18n = DEFAULT_CLIENT_I18N,
  localePreference = "system",
  onLocalePreferenceChange,
  onMapModeChange,
  onZoomLevelChange,
  onPanOffsetChange,
  onSelectedEntityChange,
  onHoveredEntityChange,
  onM3CommandSubmit,
  m3CommandStatus,
  onM4CommandSubmit,
  m4CommandStatus,
  onM5CommandSubmit,
  m5CommandStatus,
  onM6CommandSubmit,
  m6CommandStatus
}: ClientShellViewProps): ReactElement {
  const selectedDistrictId =
    selectedEntity?.kind === "settlement"
      ? selectedEntity.districtId
      : (selectedEntity?.districtId ?? snapshot.districtList.selectedDistrictId);
  const [filter, setFilter] = useState("");
  const [routeStatusFilter, setRouteStatusFilter] = useState<DistrictRouteStatusFilter>("all");
  const [sortKey, setSortKey] = useState<ClientDistrictSortKey>("district");
  const [sortDirection, setSortDirection] = useState<ClientDistrictSortDirection>("ascending");
  const [isDistrictBrowserCollapsed, setDistrictBrowserCollapsed] = useState(false);
  const [scrollTopPx, setScrollTopPx] = useState(0);
  const [lastSelectionMs, setLastSelectionMs] = useState(0);
  const [selectedM3OfficeId, setSelectedM3OfficeId] = useState<ClientOfficeId | null>(
    snapshot.m3Appointment.offices[0]?.officeId ?? null
  );
  const [selectedM3CandidateKey, setSelectedM3CandidateKey] = useState("");
  const [showRejectedM3Candidates, setShowRejectedM3Candidates] = useState(true);
  const [m3SubmitSequence, setM3SubmitSequence] = useState(0);
  const [m3FlowStage, setM3FlowStage] = useState<M3AppointmentFlowStage>("select-office");
  const [selectedM4CampaignPlanId, setSelectedM4CampaignPlanId] =
    useState<ClientCampaignPlanId | null>(snapshot.m4Campaign.selectedCampaignPlanId);
  const [selectedM4SiegeChoice, setSelectedM4SiegeChoice] =
    useState<ClientM4SiegeChoice>("invest-blockade");
  const [m4SubmitSequence, setM4SubmitSequence] = useState(0);
  const [m5Phase, setM5Phase] = useState<ClientM5PlayablePhase>("not-started");
  const [m5CurrentStepIndex, setM5CurrentStepIndex] = useState(0);
  const [m5PreviewStepId, setM5PreviewStepId] = useState<string | null>(null);
  const [m5ConfirmedCommandIds, setM5ConfirmedCommandIds] = useState<readonly string[]>([]);
  const [m5SavedSession, setM5SavedSession] = useState("");
  const [m5SaveStatus, setM5SaveStatus] = useState<string | null>(null);
  const [selectedM6ScenarioId, setSelectedM6ScenarioId] = useState(
    snapshot.m6Alpha.selectedScenarioId
  );
  const [m6Phase, setM6Phase] = useState<ClientM6AlphaPhase>("scenario-selection");
  const [m6CurrentStepIndex, setM6CurrentStepIndex] = useState(0);
  const [m6PreviewStepId, setM6PreviewStepId] = useState<string | null>(null);
  const [m6ConfirmedCommandIds, setM6ConfirmedCommandIds] = useState<readonly string[]>([]);
  const [m6SavedSession, setM6SavedSession] = useState("");
  const [m6SaveStatus, setM6SaveStatus] = useState<string | null>(null);
  const [selectedM7ScenarioId, setSelectedM7ScenarioId] = useState(
    snapshot.m7Guidance.selectedScenarioId
  );
  const [m7Surface, setM7Surface] = useState<ClientM7CoverageSurface>(initialM7Surface);
  const [debugMode, setDebugMode] = useState(initialDebugMode);
  const [isGuidanceDismissed, setGuidanceDismissed] = useState(false);
  const [isGuidanceCollapsed, setGuidanceCollapsed] = useState(false);

  const districtProjection = useMemo(() => {
    const startedAt = getHighResolutionTime();
    const rows = selectClientDistrictRows({
      rows: snapshot.districtList.rows,
      filter,
      routeStatusFilter,
      sortKey,
      sortDirection
    });
    return {
      rows,
      derivationMs: getHighResolutionTime() - startedAt
    };
  }, [filter, routeStatusFilter, snapshot.districtList.rows, sortDirection, sortKey]);

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
  const hoveredDistrictId =
    hoveredEntity?.kind === "settlement"
      ? hoveredEntity.districtId
      : (hoveredEntity?.districtId ?? null);
  const hoveredDistrict =
    hoveredDistrictId === null
      ? null
      : findClientDistrictRow(snapshot.districtList.rows, hoveredDistrictId);
  const hoveredSettlement =
    hoveredEntity?.kind === "settlement"
      ? (snapshot.map.settlements.find(
          (settlement) => settlement.settlementId === hoveredEntity.settlementId
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
  const selectedM3OfficeEligibilities = selectedM3Office?.candidateEligibilities ?? [];
  const visibleM3CandidateEligibilities = selectedM3OfficeEligibilities.filter(
    (eligibility) => showRejectedM3Candidates || eligibility.status === "eligible"
  );
  const firstEligibleM3Candidate =
    selectedM3Office?.candidateEligibilities.find(
      (eligibility) => eligibility.status === "eligible"
    ) ?? null;
  const firstM3Candidate = selectedM3OfficeEligibilities[0] ?? null;
  const selectedM3Eligibility =
    selectedM3OfficeEligibilities.find(
      (eligibility) => Number(eligibility.characterId).toString() === selectedM3CandidateKey
    ) ??
    firstEligibleM3Candidate ??
    firstM3Candidate;
  const selectedM4Campaign =
    selectedM4CampaignPlanId === null
      ? (snapshot.m4Campaign.plans[0] ?? null)
      : (findM4CampaignPlan(snapshot.m4Campaign.plans, selectedM4CampaignPlanId) ??
        snapshot.m4Campaign.plans[0] ??
        null);
  const selectedM4Siege = snapshot.m4Campaign.sieges[0] ?? null;

  function handleFilterChange(event: ChangeEvent<HTMLInputElement>): void {
    setFilter(event.currentTarget.value);
    setScrollTopPx(0);
  }

  function handleRouteStatusFilterChange(event: ChangeEvent<HTMLSelectElement>): void {
    setRouteStatusFilter(parseDistrictRouteStatusFilter(event.currentTarget.value));
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
    setM3FlowStage("compare-candidates");
  }

  function handleM3CandidateChange(event: ChangeEvent<HTMLSelectElement>): void {
    handleM3CandidateKeyChange(event.currentTarget.value);
  }

  function handleM3CandidateKeyChange(characterKey: string): void {
    setSelectedM3CandidateKey(characterKey);
    setM3FlowStage("compare-candidates");
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

  function handleOpenM3AppointmentFlow(): void {
    setM3FlowStage(selectedM3Office === null ? "select-office" : "compare-candidates");
  }

  function handlePreviewM3Appointment(): void {
    setM3FlowStage("preview");
  }

  function handleConfirmM3Appointment(): void {
    handleSubmitM3Appointment();
    setM3FlowStage("result");
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

  function handleM4CampaignChange(event: ChangeEvent<HTMLSelectElement>): void {
    const campaignPlanId = Number(event.currentTarget.value);
    const campaign = snapshot.m4Campaign.plans.find(
      (plan) => Number(plan.campaignPlanId) === campaignPlanId
    );
    setSelectedM4CampaignPlanId(campaign?.campaignPlanId ?? null);
  }

  function handleM4SiegeChoiceChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextChoice = parseM4SiegeChoice(event.currentTarget.value);
    setSelectedM4SiegeChoice(nextChoice);
  }

  function nextM4CommandId(prefix: string): string {
    const nextSequence = m4SubmitSequence + 1;
    setM4SubmitSequence(nextSequence);
    return `${prefix}.${snapshot.m4Campaign.revision}.${nextSequence}`;
  }

  function handleSubmitM4Plan(): void {
    onM4CommandSubmit(
      createM4CampaignPlanCommand({
        snapshot: snapshot.m4Campaign,
        commandId: nextM4CommandId("client.m4.plan")
      })
    );
  }

  function handleSubmitM4StartMarch(): void {
    if (selectedM4Campaign === null) {
      return;
    }
    onM4CommandSubmit(
      createM4StartMarchCommand({
        snapshot: snapshot.m4Campaign,
        commandId: nextM4CommandId("client.m4.start-march"),
        campaignPlanId: selectedM4Campaign.campaignPlanId
      })
    );
  }

  function handleSubmitM4Cancel(): void {
    if (selectedM4Campaign === null) {
      return;
    }
    onM4CommandSubmit(
      createM4CancelCampaignCommand({
        snapshot: snapshot.m4Campaign,
        commandId: nextM4CommandId("client.m4.cancel"),
        campaignPlanId: selectedM4Campaign.campaignPlanId
      })
    );
  }

  function handleSubmitM4SiegeChoice(): void {
    if (selectedM4Siege === null) {
      return;
    }
    onM4CommandSubmit(
      createM4SiegeChoiceCommand({
        snapshot: snapshot.m4Campaign,
        commandId: nextM4CommandId("client.m4.siege"),
        siegeId: selectedM4Siege.siegeId,
        choice: selectedM4SiegeChoice
      })
    );
  }

  function handleSubmitM4Withdrawal(): void {
    if (selectedM4Campaign === null) {
      return;
    }
    onM4CommandSubmit(
      createM4WithdrawalCommand({
        snapshot: snapshot.m4Campaign,
        commandId: nextM4CommandId("client.m4.withdraw"),
        campaignPlanId: selectedM4Campaign.campaignPlanId
      })
    );
  }

  function handleStartM5Slice(): void {
    setM5Phase("running");
    setM5CurrentStepIndex(0);
    setM5PreviewStepId(null);
    setM5SaveStatus(null);
  }

  function handlePreviewM5Command(): void {
    const step = getM5CurrentStep(snapshot.m5Playable, m5CurrentStepIndex);
    if (step === null) {
      return;
    }
    setM5PreviewStepId(step.stepId);
  }

  function handleConfirmM5Command(): void {
    const step = getM5CurrentStep(snapshot.m5Playable, m5CurrentStepIndex);
    if (step === null || m5Phase !== "running") {
      return;
    }
    onM5CommandSubmit(step.command);
    const nextConfirmedCommandIds = [...m5ConfirmedCommandIds, step.command.commandId];
    const nextStepIndex = m5CurrentStepIndex + 1;
    setM5ConfirmedCommandIds(nextConfirmedCommandIds);
    setM5CurrentStepIndex(nextStepIndex);
    setM5PreviewStepId(null);
    if (nextStepIndex >= snapshot.m5Playable.steps.length) {
      setM5Phase("success");
    }
  }

  function handleCancelM5Slice(): void {
    setM5Phase("cancelled");
    setM5PreviewStepId(null);
  }

  function handlePreviewM5Failure(): void {
    setM5Phase("failure");
    setM5PreviewStepId(snapshot.m5Playable.failureStep.stepId);
  }

  function handleSaveM5Session(): void {
    const saveText = createM5SessionSave({
      snapshot: snapshot.m5Playable,
      phase: m5Phase,
      currentStepIndex: m5CurrentStepIndex,
      confirmedCommandIds: m5ConfirmedCommandIds
    });
    setM5SavedSession(saveText);
    setM5SaveStatus("m5.save.client-session-written");
  }

  function handleLoadM5Session(): void {
    const parsed = parseM5SessionSave(m5SavedSession);
    if (!parsed.ok) {
      setM5SaveStatus(parsed.reasonCode);
      return;
    }
    setM5Phase(parsed.value.phase);
    setM5CurrentStepIndex(parsed.value.currentStepIndex);
    setM5ConfirmedCommandIds(parsed.value.confirmedCommandIds);
    setM5PreviewStepId(null);
    setM5SaveStatus(`m5.load.client-session-restored:${parsed.value.checkpointLabel}`);
  }

  function handleM6ScenarioChange(event: ChangeEvent<HTMLSelectElement>): void {
    setSelectedM6ScenarioId(event.currentTarget.value);
    setM6Phase("scenario-selection");
    setM6CurrentStepIndex(0);
    setM6PreviewStepId(null);
    setM6ConfirmedCommandIds([]);
    setM6SaveStatus(null);
  }

  function handleStartM6Alpha(): void {
    setM6Phase("running");
    if (
      m6Phase === "scenario-selection" ||
      m6Phase === "victory" ||
      m6Phase === "failure" ||
      m6Phase === "continued-play"
    ) {
      setM6CurrentStepIndex(0);
      setM6ConfirmedCommandIds([]);
    }
    setM6PreviewStepId(null);
    setM6SaveStatus(null);
  }

  function handlePreviewM6Command(): void {
    const step = getM6CurrentStep(snapshot.m6Alpha, m6CurrentStepIndex);
    if (step === null) {
      return;
    }
    setM6PreviewStepId(step.stepId);
  }

  function handleConfirmM6Command(): void {
    const step = getM6CurrentStep(snapshot.m6Alpha, m6CurrentStepIndex);
    if (step === null || m6Phase !== "running") {
      return;
    }
    onM6CommandSubmit(step.command);
    const nextConfirmedCommandIds = [...m6ConfirmedCommandIds, step.command.commandId];
    const nextStepIndex = m6CurrentStepIndex + 1;
    setM6ConfirmedCommandIds(nextConfirmedCommandIds);
    setM6CurrentStepIndex(nextStepIndex);
    setM6PreviewStepId(null);
    if (nextStepIndex >= snapshot.m6Alpha.steps.length) {
      setM6Phase(
        snapshot.m6Alpha.terminal.outcome === "defeat"
          ? "failure"
          : snapshot.m6Alpha.terminal.outcome
      );
    }
  }

  function handleSaveM6Session(): void {
    const saveText = createM6SessionSave({
      snapshot: snapshot.m6Alpha,
      phase: m6Phase,
      currentStepIndex: m6CurrentStepIndex,
      confirmedCommandIds: m6ConfirmedCommandIds
    });
    setM6SavedSession(saveText);
    setM6SaveStatus("m6.save.client-session-written");
  }

  function handleLoadM6Session(): void {
    const parsed = parseM6SessionSave(m6SavedSession);
    if (!parsed.ok) {
      setM6SaveStatus(parsed.reasonCode);
      return;
    }
    setM6Phase(parsed.value.phase === "running" ? "checkpoint-loaded" : parsed.value.phase);
    setM6CurrentStepIndex(parsed.value.currentStepIndex);
    setM6ConfirmedCommandIds(parsed.value.confirmedCommandIds);
    setM6PreviewStepId(null);
    setM6SaveStatus(`m6.load.client-session-restored:${parsed.value.checkpointLabel}`);
  }

  function handlePreviewM6Failure(): void {
    setM6Phase("failure");
    setM6PreviewStepId(snapshot.m6Alpha.failureStep.stepId);
  }

  function handleM7ScenarioChange(event: ChangeEvent<HTMLSelectElement>): void {
    setSelectedM7ScenarioId(event.currentTarget.value);
  }

  function handleM7SurfaceSelect(surface: ClientM7CoverageSurface): void {
    setM7Surface(surface);
  }

  function handleZoomIn(): void {
    onZoomLevelChange(clampZoomLevel(zoomLevel + 0.25));
  }

  function handleZoomOut(): void {
    onZoomLevelChange(clampZoomLevel(zoomLevel - 0.25));
  }

  function handlePan(delta: ClientMapPanOffset): void {
    onPanOffsetChange?.({
      xInMapUnits: clampMapPanOffset(panOffset.xInMapUnits + delta.xInMapUnits),
      yInMapUnits: clampMapPanOffset(panOffset.yInMapUnits + delta.yInMapUnits)
    });
  }

  function handlePanReset(): void {
    onPanOffsetChange?.(ZERO_MAP_PAN_OFFSET);
  }

  function handleLocalePreferenceChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextPreference = CLIENT_LOCALE_PREFERENCES.find(
      (preference) => preference === event.currentTarget.value
    );
    if (nextPreference !== undefined) {
      onLocalePreferenceChange?.(nextPreference);
    }
  }

  return (
    <ClientI18nContext.Provider value={i18n}>
      <main
        className="client-shell client-shell--beta"
        aria-label={i18n.t("app.shellLabel")}
        data-debug-mode={debugMode ? "on" : "off"}
      >
        <header className="client-shell__topbar" aria-label={i18n.t("shell.topStatus.label")}>
          <div className="client-shell__brand">
            <h1>{i18n.t("app.title")}</h1>
            <p>{i18n.t("shell.objectives.defaultText")}</p>
          </div>
          <dl className="client-shell__status">
            <Metric
              label={i18n.t("shell.currentSeason.label")}
              value={i18n.t("shell.currentSeason.value")}
            />
            <Metric
              label={i18n.t("shell.currentDay.label")}
              value={i18n.t("shell.currentDay.value", {
                day: i18n.formatNumber(snapshot.m4Campaign.day)
              })}
            />
            <Metric
              label={i18n.t("shell.resources.label")}
              value={i18n.t("shell.resources.value", {
                grain: i18n.formatNumber(selectedDistrict?.grain.stock ?? 0),
                cash: i18n.formatNumber(selectedDistrict?.cash.stock ?? 0)
              })}
            />
            <Metric
              label={i18n.t("shell.muster.label")}
              value={i18n.t("shell.muster.value", {
                assembled: i18n.formatNumber(snapshot.m4Campaign.muster.assembledTroops),
                promised: i18n.formatNumber(snapshot.m4Campaign.muster.promisedTroops)
              })}
            />
          </dl>
          <section className="client-shell__settings" aria-label={i18n.t("shell.settings.label")}>
            <label className="client-shell__language">
              <span>{i18n.t("settings.language.label")}</span>
              <select
                aria-label={i18n.t("settings.language.label")}
                value={localePreference}
                onChange={handleLocalePreferenceChange}
              >
                <option value="system">{i18n.t("settings.language.system")}</option>
                <option value="en-US">{i18n.t("settings.language.enUS")}</option>
                <option value="zh-CN">{i18n.t("settings.language.zhCN")}</option>
              </select>
              <output aria-live="polite">
                {i18n.t("settings.language.active", { locale: i18n.locale })}
              </output>
            </label>
            <button
              className="client-shell__debug-toggle"
              type="button"
              aria-label={i18n.t("shell.debug.toggle")}
              aria-pressed={debugMode}
              onClick={() => setDebugMode(!debugMode)}
            >
              {debugMode ? i18n.t("shell.debug.hide") : i18n.t("shell.debug.show")}
            </button>
          </section>
        </header>

        <section className="client-shell__body">
          <section
            className="client-shell__map-region"
            aria-label={i18n.t("shell.mapRegion.label")}
          >
            <div className="client-shell__map-heading">
              <div>
                <h2>{i18n.t("shell.mapTitle")}</h2>
                <p>{i18n.t("shell.mapSummary")}</p>
              </div>
              <div className="map-toolbar" aria-label={i18n.t("map.controlsLabel")}>
                <div className="map-mode" role="group" aria-label={i18n.t("map.modeLabel")}>
                  <MapModeButton
                    label={i18n.t("map.mode.seasonal")}
                    mode="seasonal"
                    activeMode={mapMode}
                    onSelect={onMapModeChange}
                  />
                  <MapModeButton
                    label={i18n.t("map.mode.economy")}
                    mode="economy"
                    activeMode={mapMode}
                    onSelect={onMapModeChange}
                  />
                  <MapModeButton
                    label={i18n.t("map.mode.routes")}
                    mode="routes"
                    activeMode={mapMode}
                    onSelect={onMapModeChange}
                  />
                </div>
                <div className="map-zoom" role="group" aria-label={i18n.t("map.zoomLabel")}>
                  <button type="button" aria-label={i18n.t("map.zoomOut")} onClick={handleZoomOut}>
                    -
                  </button>
                  <output
                    aria-label={i18n.t("map.zoomLevel")}
                    data-zoom-level={zoomLevel.toFixed(2)}
                  >
                    {Math.round(zoomLevel * 100)}%
                  </output>
                  <button type="button" aria-label={i18n.t("map.zoomIn")} onClick={handleZoomIn}>
                    +
                  </button>
                </div>
                <div className="map-pan" role="group" aria-label={i18n.t("map.panLabel")}>
                  <button
                    type="button"
                    aria-label={i18n.t("map.panUp")}
                    onClick={() =>
                      handlePan({ xInMapUnits: 0, yInMapUnits: -MAP_PAN_STEP_IN_MAP_UNITS })
                    }
                  >
                    N
                  </button>
                  <button
                    type="button"
                    aria-label={i18n.t("map.panLeft")}
                    onClick={() =>
                      handlePan({ xInMapUnits: -MAP_PAN_STEP_IN_MAP_UNITS, yInMapUnits: 0 })
                    }
                  >
                    W
                  </button>
                  <button
                    type="button"
                    aria-label={i18n.t("map.panReset")}
                    onClick={handlePanReset}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    aria-label={i18n.t("map.panRight")}
                    onClick={() =>
                      handlePan({ xInMapUnits: MAP_PAN_STEP_IN_MAP_UNITS, yInMapUnits: 0 })
                    }
                  >
                    E
                  </button>
                  <button
                    type="button"
                    aria-label={i18n.t("map.panDown")}
                    onClick={() =>
                      handlePan({ xInMapUnits: 0, yInMapUnits: MAP_PAN_STEP_IN_MAP_UNITS })
                    }
                  >
                    S
                  </button>
                </div>
              </div>
            </div>

            <div
              className="client-shell__map-surface"
              data-district-count={snapshot.map.districts.length}
              data-settlement-count={snapshot.map.settlements.length}
              data-route-count={snapshot.map.routes.length}
              data-map-mode={mapMode}
              data-zoom-level={zoomLevel.toFixed(2)}
              data-pan-x={panOffset.xInMapUnits.toFixed(2)}
              data-pan-y={panOffset.yInMapUnits.toFixed(2)}
              data-selected-district-id={selectedDistrict?.districtId ?? "none"}
              data-selected-entity-kind={selectedEntity?.kind ?? "none"}
              data-hovered-district-id={hoveredDistrict?.districtId ?? "none"}
            >
              {mapSurface}
              <span className="client-shell__map-selection">
                {formatPlayerMapSelection(selectedDistrict, selectedSettlement, i18n)}
              </span>
              <output
                className="client-shell__map-tooltip"
                aria-label={i18n.t("shell.mapHover.label")}
                aria-live="polite"
              >
                {formatPlayerMapHover(hoveredDistrict, hoveredSettlement, i18n)}
              </output>
            </div>

            <div className="client-shell__map-legend" aria-label={i18n.t("shell.mapLegend.label")}>
              <MapLegendItem tone="selected" label={i18n.t("shell.mapLegend.selected")} />
              <MapLegendItem tone="reachable" label={i18n.t("shell.mapLegend.reachable")} />
              <MapLegendItem tone="blocked" label={i18n.t("shell.mapLegend.blocked")} />
              <MapLegendItem tone="overloaded" label={i18n.t("shell.mapLegend.overloaded")} />
              <MapLegendItem tone="settlement" label={i18n.t("shell.mapLegend.settlement")} />
            </div>
          </section>

          <aside className="client-shell__side" aria-label={i18n.t("shell.inspector.label")}>
            <DistrictPanel
              row={selectedDistrict}
              selectedSettlement={selectedSettlement}
              m3Appointment={snapshot.m3Appointment}
              m4Campaign={snapshot.m4Campaign}
              canPreviewAppointment={selectedM3Office !== null && selectedM3Eligibility !== null}
              canPreviewCampaign={selectedM4Campaign !== null}
              provenanceNote={debugMode ? snapshot.districtList.provenance.note : ""}
              onPreviewAppointment={handleOpenM3AppointmentFlow}
              onPreviewCampaign={handleSubmitM4Plan}
              onReviewObligations={handleSubmitM4StartMarch}
            />

            <section
              className="client-shell__objectives"
              aria-label={i18n.t("shell.objectives.label")}
            >
              <h2>{i18n.t("shell.objectives.title")}</h2>
              <PlayerGuidanceLite
                snapshot={snapshot}
                selectedDistrict={selectedDistrict}
                isDismissed={isGuidanceDismissed}
                isCollapsed={isGuidanceCollapsed}
                canPreviewAppointment={selectedM3Office !== null && selectedM3Eligibility !== null}
                canPreviewCampaign={selectedM4Campaign !== null}
                m3FlowStage={m3FlowStage}
                commandStatus={m3CommandStatus ?? m4CommandStatus ?? null}
                onDismiss={() => setGuidanceDismissed(true)}
                onRestore={() => setGuidanceDismissed(false)}
                onToggleCollapse={() => setGuidanceCollapsed(!isGuidanceCollapsed)}
              />
              <div className="client-shell__action-grid" aria-label={i18n.t("shell.actions.label")}>
                <button
                  type="button"
                  disabled={selectedM3Office === null || selectedM3Eligibility === null}
                  onClick={handleOpenM3AppointmentFlow}
                >
                  {i18n.t("shell.actions.previewAppointment")}
                </button>
                <button
                  type="button"
                  disabled={selectedM4Campaign === null}
                  onClick={handleSubmitM4Plan}
                >
                  {i18n.t("shell.actions.previewCampaign")}
                </button>
                <button type="button" onClick={handleSubmitM4StartMarch}>
                  {i18n.t("shell.actions.reviewObligations")}
                </button>
              </div>
              <CommandStatus
                m3CommandStatus={m3CommandStatus}
                m4CommandStatus={m4CommandStatus}
                m5CommandStatus={m5CommandStatus}
                m6CommandStatus={m6CommandStatus}
              />
            </section>

            <section
              className="client-shell__notices"
              aria-label={i18n.t("shell.notifications.label")}
            >
              <h2>{i18n.t("shell.notifications.label")}</h2>
              <ul>
                <li>{i18n.t("shell.notifications.obligation")}</li>
                <li>{i18n.t("shell.notifications.supply")}</li>
                <li>{i18n.t("shell.notifications.contentReview")}</li>
              </ul>
            </section>
          </aside>
        </section>

        <M3AppointmentFlow
          snapshot={snapshot.m3Appointment}
          selectedOffice={selectedM3Office}
          candidateEligibilities={selectedM3OfficeEligibilities}
          selectedEligibility={selectedM3Eligibility}
          flowStage={m3FlowStage}
          commandStatus={m3CommandStatus}
          onOfficeChange={handleM3OfficeChange}
          onCandidateChange={handleM3CandidateChange}
          onCandidateKeyChange={handleM3CandidateKeyChange}
          onPreview={handlePreviewM3Appointment}
          onConfirm={handleConfirmM3Appointment}
        />

        <section
          className="client-shell__route-queue"
          aria-label={i18n.t("shell.list.label")}
          data-folded={isDistrictBrowserCollapsed ? "true" : "false"}
          data-render-bound="virtualized"
        >
          <header className="district-list__header">
            <div>
              <h2>{i18n.t("shell.list.title")}</h2>
              <p>
                {i18n.t("shell.list.count", {
                  visible: i18n.formatNumber(districtProjection.rows.length),
                  total: i18n.formatNumber(snapshot.districtList.rows.length)
                })}
              </p>
            </div>
            <button
              type="button"
              aria-label={i18n.t("shell.list.toggle")}
              aria-expanded={!isDistrictBrowserCollapsed}
              onClick={() => setDistrictBrowserCollapsed(!isDistrictBrowserCollapsed)}
            >
              {isDistrictBrowserCollapsed ? i18n.t("shell.list.show") : i18n.t("shell.list.hide")}
            </button>
          </header>
          <div className="district-list__toolbar">
            <label className="district-list__filter">
              <span>{i18n.t("shell.list.filter")}</span>
              <input
                aria-label={i18n.t("shell.list.filter")}
                value={filter}
                onChange={handleFilterChange}
                placeholder={i18n.t("shell.list.placeholder")}
              />
            </label>
            <label className="district-list__filter">
              <span>{i18n.t("shell.list.routeFilter")}</span>
              <select
                aria-label={i18n.t("shell.list.routeFilter")}
                value={routeStatusFilter}
                onChange={handleRouteStatusFilterChange}
              >
                <option value="all">{i18n.t("shell.list.allRoutes")}</option>
                <option value="reachable">{i18n.t("shell.route.reachable")}</option>
                <option value="capacity-exceeded">{i18n.t("shell.route.capacityExceeded")}</option>
                <option value="unreachable">{i18n.t("shell.route.unreachable")}</option>
              </select>
            </label>
            <output
              aria-label={i18n.t("shell.list.performance")}
              data-testid="district-list-performance"
              data-derivation-ms={districtProjection.derivationMs.toFixed(3)}
              data-selection-ms={lastSelectionMs.toFixed(3)}
            >
              {districtProjection.derivationMs.toFixed(2)} ms
            </output>
          </div>

          {isDistrictBrowserCollapsed ? null : (
            <>
              <div className="district-list__head">
                <SortButton
                  label={i18n.t("shell.table.district")}
                  sortKey="district"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortButton
                  label={i18n.t("shell.table.population")}
                  sortKey="population"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortButton
                  label={i18n.t("shell.table.labor")}
                  sortKey="labor"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortButton
                  label={i18n.t("shell.table.grain")}
                  sortKey="grain"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortButton
                  label={i18n.t("shell.table.cash")}
                  sortKey="cash"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortButton
                  label={i18n.t("shell.table.route")}
                  sortKey="route"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
              </div>

              <div
                className="district-list__viewport"
                aria-label={i18n.t("shell.list.virtualRowsLabel")}
                data-row-count={snapshot.districtList.rows.length}
                data-filtered-row-count={districtProjection.rows.length}
                data-rendered-row-count={visibleRows.length}
                data-render-limit={virtualWindow.visibleCount}
                data-route-filter={routeStatusFilter}
                onScroll={handleScroll}
              >
                {districtProjection.rows.length === 0 ? (
                  <p className="district-list__empty">{i18n.t("shell.list.empty")}</p>
                ) : (
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
                          isHovered={hoveredDistrictId === row.districtId}
                          onSelect={handleSelect}
                          onHover={(hoveredRow) =>
                            onHoveredEntityChange?.(
                              hoveredRow === null
                                ? null
                                : { kind: "district", districtId: hoveredRow.districtId }
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {debugMode ? (
          <section className="client-shell__dev-overlay" aria-label={i18n.t("shell.debug.label")}>
            <header>
              <h2>{i18n.t("shell.debug.title")}</h2>
              <p>{i18n.t("shell.debug.description")}</p>
              <dl className="client-shell__debug-facts">
                <Metric
                  label={i18n.t("shell.debug.revision")}
                  value={snapshot.revision.toString()}
                />
                <Metric label={i18n.t("shell.debug.hash")} value={snapshot.simulation.stateHash} />
                <Metric
                  label={i18n.t("shell.debug.fixture")}
                  value={snapshot.districtList.provenance.kind}
                />
              </dl>
            </header>
            <section className="client-shell__operations" aria-label={i18n.t("shell.debug.label")}>
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

              <M4CampaignWorkspace
                snapshot={snapshot.m4Campaign}
                selectedCampaign={selectedM4Campaign}
                selectedSiege={selectedM4Siege}
                selectedSiegeChoice={selectedM4SiegeChoice}
                commandStatus={m4CommandStatus}
                onCampaignChange={handleM4CampaignChange}
                onSiegeChoiceChange={handleM4SiegeChoiceChange}
                onSubmitPlan={handleSubmitM4Plan}
                onSubmitStartMarch={handleSubmitM4StartMarch}
                onSubmitCancel={handleSubmitM4Cancel}
                onSubmitSiegeChoice={handleSubmitM4SiegeChoice}
                onSubmitWithdrawal={handleSubmitM4Withdrawal}
              />

              <M5PlayableWorkspace
                snapshot={snapshot.m5Playable}
                phase={m5Phase}
                currentStepIndex={m5CurrentStepIndex}
                previewStepId={m5PreviewStepId}
                confirmedCommandIds={m5ConfirmedCommandIds}
                savedSession={m5SavedSession}
                saveStatus={m5SaveStatus}
                commandStatus={m5CommandStatus}
                onStart={handleStartM5Slice}
                onPreview={handlePreviewM5Command}
                onConfirm={handleConfirmM5Command}
                onCancel={handleCancelM5Slice}
                onFailurePreview={handlePreviewM5Failure}
                onSave={handleSaveM5Session}
                onLoad={handleLoadM5Session}
              />

              <M6AlphaWorkspace
                snapshot={snapshot.m6Alpha}
                phase={m6Phase}
                selectedScenarioId={selectedM6ScenarioId}
                currentStepIndex={m6CurrentStepIndex}
                previewStepId={m6PreviewStepId}
                confirmedCommandIds={m6ConfirmedCommandIds}
                savedSession={m6SavedSession}
                saveStatus={m6SaveStatus}
                commandStatus={m6CommandStatus}
                onScenarioChange={handleM6ScenarioChange}
                onStart={handleStartM6Alpha}
                onPreview={handlePreviewM6Command}
                onConfirm={handleConfirmM6Command}
                onSave={handleSaveM6Session}
                onLoad={handleLoadM6Session}
                onFailurePreview={handlePreviewM6Failure}
              />
              <M7GuidanceWorkspace
                snapshot={snapshot.m7Guidance}
                selectedScenarioId={selectedM7ScenarioId}
                activeSurface={m7Surface}
                onScenarioChange={handleM7ScenarioChange}
                onSurfaceSelect={handleM7SurfaceSelect}
              />
              {m6BatchBalanceArtifact === null ? null : (
                <M6BatchBalanceDashboard artifact={m6BatchBalanceArtifact} />
              )}
            </section>
          </section>
        ) : (
          <p className="client-shell__debug-hidden">{i18n.t("shell.debug.hiddenNotice")}</p>
        )}
      </main>
    </ClientI18nContext.Provider>
  );
}

interface MapModeButtonProps {
  readonly label: string;
  readonly mode: ClientMapMode;
  readonly activeMode: ClientMapMode;
  readonly onSelect: (mode: ClientMapMode) => void;
}

function MapModeButton({ label, mode, activeMode, onSelect }: MapModeButtonProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  return (
    <button
      type="button"
      aria-label={i18n.t("map.modeButtonLabel", { label })}
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
  const i18n = useContext(ClientI18nContext);
  const isActive = activeSortKey === sortKey;
  const directionLabel = i18n.t(
    direction === "ascending"
      ? "shell.table.sortDirection.ascending"
      : "shell.table.sortDirection.descending"
  );
  const ariaLabel = isActive
    ? i18n.t("shell.table.sortButtonActiveLabel", { label, direction: directionLabel })
    : i18n.t("shell.table.sortButtonLabel", { label });
  const suffix = isActive ? ` ${directionLabel}` : "";

  return (
    <button
      className="district-list__sort"
      type="button"
      aria-label={ariaLabel}
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
  readonly isHovered: boolean;
  readonly onSelect: (row: ClientDistrictRowReadModel) => void;
  readonly onHover: (row: ClientDistrictRowReadModel | null) => void;
}

function DistrictRowButton({
  row,
  isSelected,
  isHovered,
  onSelect,
  onHover
}: DistrictRowButtonProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  return (
    <button
      className="district-list__row"
      type="button"
      aria-label={`${i18n.t("shell.objectives.reviewDistrict")} ${formatPlayerDistrictName(
        row,
        i18n
      )}`}
      aria-pressed={isSelected}
      data-district-id={row.districtId}
      data-hovered={isHovered ? "true" : "false"}
      onClick={() => onSelect(row)}
      onFocus={() => onHover(row)}
      onBlur={() => onHover(null)}
      onMouseEnter={() => onHover(row)}
      onMouseLeave={() => onHover(null)}
      style={{ height: `${DISTRICT_ROW_HEIGHT_PX}px` }}
    >
      <span>{formatPlayerDistrictName(row, i18n)}</span>
      <span>{formatInteger(row.population)}</span>
      <span>{formatInteger(row.labor.available)}</span>
      <span>{formatInteger(row.grain.stock)}</span>
      <span>{formatInteger(row.cash.stock)}</span>
      <span>{formatRouteStatusLabel(row.route.status, i18n)}</span>
    </button>
  );
}

interface MapLegendItemProps {
  readonly tone: "selected" | "reachable" | "blocked" | "overloaded" | "settlement";
  readonly label: string;
}

function MapLegendItem({ tone, label }: MapLegendItemProps): ReactElement {
  return (
    <span className="client-shell__map-legend-item" data-map-legend-tone={tone}>
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

interface DistrictPanelProps {
  readonly row: ClientDistrictRowReadModel | null;
  readonly selectedSettlement: ClientMapSettlementReadModel | null;
  readonly m3Appointment: ClientM3AppointmentReadModelSnapshot;
  readonly m4Campaign: ClientM4CampaignReadModelSnapshot;
  readonly canPreviewAppointment: boolean;
  readonly canPreviewCampaign: boolean;
  readonly provenanceNote: string;
  readonly onPreviewAppointment: () => void;
  readonly onPreviewCampaign: () => void;
  readonly onReviewObligations: () => void;
}

function DistrictPanel({
  row,
  selectedSettlement,
  m3Appointment,
  m4Campaign,
  canPreviewAppointment,
  canPreviewCampaign,
  provenanceNote,
  onPreviewAppointment,
  onPreviewCampaign,
  onReviewObligations
}: DistrictPanelProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  if (row === null) {
    return (
      <aside className="district-panel" aria-label={i18n.t("shell.inspector.label")}>
        <h2>{i18n.t("shell.inspector.emptyTitle")}</h2>
        <p>{i18n.t("shell.inspector.emptyText")}</p>
      </aside>
    );
  }

  return (
    <aside
      className="district-panel"
      aria-label={i18n.t("shell.inspector.label")}
      data-selected-district-id={row.districtId}
    >
      <div className="district-panel__title">
        <h2>{formatPlayerDistrictName(row, i18n)}</h2>
        <span>{formatSeasonLabel(row.seasonal.agriculturePhase, i18n)}</span>
      </div>
      <dl className="district-panel__metrics">
        {selectedSettlement === null ? null : (
          <Metric
            label={i18n.t("shell.inspector.settlement")}
            value={formatPlayerSettlementName(i18n)}
          />
        )}
        <Metric
          label={i18n.t("shell.inspector.population")}
          value={i18n.formatNumber(row.population)}
        />
        <Metric
          label={i18n.t("shell.inspector.labor")}
          value={i18n.t("shell.inspector.availableCommitted", {
            available: i18n.formatNumber(row.labor.available),
            committed: i18n.formatNumber(row.labor.committed)
          })}
        />
        <Metric
          label={i18n.t("shell.inspector.grain")}
          value={i18n.t("shell.inspector.stockHarvest", {
            stock: i18n.formatNumber(row.grain.stock),
            harvest: i18n.formatNumber(row.grain.lastHarvest)
          })}
        />
        <Metric
          label={i18n.t("shell.inspector.cash")}
          value={i18n.t("shell.inspector.stockMobilized", {
            stock: i18n.formatNumber(row.cash.stock),
            mobilized: i18n.formatNumber(row.cash.cumulativeMobilizationCost)
          })}
        />
        <Metric
          label={i18n.t("shell.inspector.route")}
          value={formatPlayerRouteSummary(row, i18n)}
        />
      </dl>
      <DistrictTraitList row={row} />
      <DistrictGovernanceState row={row} appointment={m3Appointment} />
      <DistrictEffectList row={row} appointment={m3Appointment} campaign={m4Campaign} />
      <DistrictActionList
        row={row}
        canPreviewAppointment={canPreviewAppointment}
        canPreviewCampaign={canPreviewCampaign}
        onPreviewAppointment={onPreviewAppointment}
        onPreviewCampaign={onPreviewCampaign}
        onReviewObligations={onReviewObligations}
      />
      {provenanceNote.length === 0 ? null : (
        <p className="district-panel__provenance">{provenanceNote}</p>
      )}
    </aside>
  );
}

function DistrictTraitList({ row }: { readonly row: ClientDistrictRowReadModel }): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const routeKinds =
    row.route.routeKinds.length === 0
      ? i18n.t("shell.inspector.routeBlockedTrait")
      : i18n.t("shell.inspector.routeTrait", {
          kinds: formatDistrictRouteKinds(row.route.routeKinds, i18n)
        });
  return (
    <section className="district-panel__section" aria-label={i18n.t("shell.inspector.traits")}>
      <h3>{i18n.t("shell.inspector.traits")}</h3>
      <div className="district-panel__chips" role="list">
        <span role="listitem">
          {i18n.t("shell.inspector.seasonTrait", {
            phase: formatSeasonLabel(row.seasonal.agriculturePhase, i18n)
          })}
        </span>
        <span role="listitem">{routeKinds}</span>
        <span role="listitem">{formatPlayerRouteSummary(row, i18n)}</span>
      </div>
    </section>
  );
}

function DistrictGovernanceState({
  row,
  appointment
}: {
  readonly row: ClientDistrictRowReadModel;
  readonly appointment: ClientM3AppointmentReadModelSnapshot;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const offices = appointment.offices.filter(
    (office) => office.administrativePreview?.districtId === row.districtId
  );
  const primaryOffice = offices[0] ?? null;
  const administrativePreview = primaryOffice?.administrativePreview ?? null;

  return (
    <section className="district-panel__section" aria-label={i18n.t("shell.inspector.governance")}>
      <h3>{i18n.t("shell.inspector.governance")}</h3>
      {administrativePreview === null ? (
        <p>{i18n.t("shell.inspector.governanceUnassigned")}</p>
      ) : (
        <div className="district-panel__fact">
          <strong>
            {i18n.t("shell.inspector.governancePreview", {
              mode: formatReasonStatus(administrativePreview.controlMode, i18n),
              load: i18n.formatNumber(administrativePreview.administrativeLoad),
              readiness: formatBps(administrativePreview.readinessBps)
            })}
          </strong>
          <ReasonChips reasonCodes={administrativePreview.reasonCodes} />
        </div>
      )}
      <h3>{i18n.t("shell.inspector.appointment")}</h3>
      {primaryOffice === null ? (
        <p>{i18n.t("shell.inspector.appointmentUnavailable")}</p>
      ) : (
        <div className="district-panel__fact">
          <strong>
            {primaryOffice.holderCharacterId === null
              ? i18n.t("shell.inspector.appointmentVacant", { office: primaryOffice.displayName })
              : i18n.t("shell.inspector.appointmentHeld", { office: primaryOffice.displayName })}
          </strong>
          <ReasonChips
            reasonCodes={[...primaryOffice.reasonCodes, ...primaryOffice.policy.reasonCodes]}
          />
        </div>
      )}
    </section>
  );
}

function DistrictEffectList({
  row,
  appointment,
  campaign
}: {
  readonly row: ClientDistrictRowReadModel;
  readonly appointment: ClientM3AppointmentReadModelSnapshot;
  readonly campaign: ClientM4CampaignReadModelSnapshot;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const relevantObligations = appointment.obligations.filter((obligation) =>
    obligation.obligationId.endsWith(`.${Number(row.districtId)}`)
  );
  const relevantPostwarOutcomes = campaign.warReports.filter(
    (report) => report.postwarCandidate?.districtId === row.districtId
  );
  const routeForecast = campaign.route.sourceForecasts.find(
    (forecast) =>
      forecast.originDistrictId === row.districtId ||
      forecast.destinationDistrictId === row.districtId
  );
  const hasEffects =
    relevantObligations.length > 0 ||
    relevantPostwarOutcomes.length > 0 ||
    routeForecast !== undefined;

  return (
    <section className="district-panel__section" aria-label={i18n.t("shell.inspector.effects")}>
      <h3>{i18n.t("shell.inspector.effects")}</h3>
      {hasEffects ? (
        <div className="district-panel__effect-list" role="list">
          {relevantObligations.map((obligation) => (
            <div className="district-panel__fact" key={obligation.obligationId} role="listitem">
              <strong>
                {i18n.t("shell.inspector.effectObligation", {
                  kind: formatDistrictObligationKind(obligation.obligationKind, i18n),
                  amount: i18n.formatNumber(obligation.amount),
                  due: formatDistrictObligationDueLabel(obligation.dueLabel, i18n)
                })}
              </strong>
              <ReasonChips reasonCodes={obligation.reasonCodes} />
            </div>
          ))}
          {relevantPostwarOutcomes.map((report) => (
            <div className="district-panel__fact" key={report.outcomeId} role="listitem">
              <strong>{i18n.t("shell.inspector.effectPostwar")}</strong>
              <ReasonChips
                reasonCodes={report.postwarCandidate?.reasonCodes ?? report.reasonCodes}
              />
            </div>
          ))}
          {routeForecast === undefined ? null : (
            <div className="district-panel__fact" role="listitem">
              <strong>
                {i18n.t("shell.inspector.effectRoute", {
                  summary: `${formatRouteStatusLabel(routeForecast.status, i18n)}; ${formatDistrictTravelDays(
                    routeForecast.travelDays,
                    i18n
                  )}`
                })}
              </strong>
              <ReasonChips
                reasonCodes={[
                  ...(routeForecast.overloadedReasonCode === null
                    ? []
                    : [routeForecast.overloadedReasonCode]),
                  ...routeForecast.seasonRiskReasonCodes
                ]}
              />
            </div>
          )}
        </div>
      ) : (
        <p>{i18n.t("shell.inspector.noEffects")}</p>
      )}
    </section>
  );
}

function DistrictActionList({
  row,
  canPreviewAppointment,
  canPreviewCampaign,
  onPreviewAppointment,
  onPreviewCampaign,
  onReviewObligations
}: {
  readonly row: ClientDistrictRowReadModel;
  readonly canPreviewAppointment: boolean;
  readonly canPreviewCampaign: boolean;
  readonly onPreviewAppointment: () => void;
  readonly onPreviewCampaign: () => void;
  readonly onReviewObligations: () => void;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const canUseRoute = row.route.status !== "unreachable";
  const unavailableReasons = [
    ...(canPreviewAppointment ? [] : [i18n.t("shell.inspector.reasonNoAppointment")]),
    ...(canPreviewCampaign ? [] : [i18n.t("shell.inspector.reasonNoCampaign")]),
    ...(canUseRoute ? [] : [i18n.t("shell.inspector.reasonRouteUnavailable")])
  ];
  return (
    <section className="district-panel__section" aria-label={i18n.t("shell.inspector.actions")}>
      <h3>{i18n.t("shell.inspector.actions")}</h3>
      <div className="district-panel__actions">
        <button type="button" disabled={!canPreviewAppointment} onClick={onPreviewAppointment}>
          {i18n.t("shell.inspector.actionAppointment")}
        </button>
        <button type="button" disabled={!canPreviewCampaign} onClick={onPreviewCampaign}>
          {i18n.t("shell.inspector.actionCampaign")}
        </button>
        <button type="button" disabled={!canUseRoute} onClick={onReviewObligations}>
          {i18n.t("shell.inspector.actionObligations")}
        </button>
      </div>
      {unavailableReasons.length === 0 ? null : (
        <div
          className="district-panel__unavailable"
          aria-label={i18n.t("shell.inspector.unavailableReasons")}
        >
          <strong>{i18n.t("shell.inspector.unavailableReasons")}</strong>
          <ul>
            {unavailableReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

interface PlayerGuidanceLiteProps {
  readonly snapshot: ClientReadModelSnapshot;
  readonly selectedDistrict: ClientDistrictRowReadModel | null;
  readonly isDismissed: boolean;
  readonly isCollapsed: boolean;
  readonly canPreviewAppointment: boolean;
  readonly canPreviewCampaign: boolean;
  readonly m3FlowStage: M3AppointmentFlowStage;
  readonly commandStatus: string | null;
  readonly onDismiss: () => void;
  readonly onRestore: () => void;
  readonly onToggleCollapse: () => void;
}

type PlayerGuidanceStepState = "pending" | "active" | "done";

interface PlayerGuidanceLiteStep {
  readonly key: string;
  readonly title: string;
  readonly body: string;
  readonly state: PlayerGuidanceStepState;
}

function PlayerGuidanceLite({
  snapshot,
  selectedDistrict,
  isDismissed,
  isCollapsed,
  canPreviewAppointment,
  canPreviewCampaign,
  m3FlowStage,
  commandStatus,
  onDismiss,
  onRestore,
  onToggleCollapse
}: PlayerGuidanceLiteProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const guidanceState = getGuidanceReadModelState(snapshot);
  const selectedDistrictName =
    selectedDistrict === null ? "" : formatPlayerDistrictName(selectedDistrict, i18n);
  const hasGuidanceEvidence =
    snapshot.m7Guidance.tutorial.steps.length > 0 &&
    snapshot.m7Guidance.hints.groups.length > 0 &&
    snapshot.m7Guidance.encyclopedia.entries.length > 0;
  const hasOpenedGovernancePreview = m3FlowStage !== "select-office";
  const hasObservedResult = commandStatus !== null || m3FlowStage === "result";
  const canOpenAction = canPreviewAppointment || canPreviewCampaign;
  const steps: readonly PlayerGuidanceLiteStep[] = [
    {
      key: "first-objective",
      title: i18n.t("shell.guidanceLite.firstObjective.title"),
      body: i18n.t("shell.guidanceLite.firstObjective.text"),
      state: guidanceState === "normal" ? "done" : "active"
    },
    {
      key: "select-district",
      title: i18n.t("shell.guidanceLite.selectDistrict.title"),
      body:
        selectedDistrict === null
          ? i18n.t("shell.guidanceLite.selectDistrict.pending")
          : i18n.t("shell.guidanceLite.selectDistrict.done", { district: selectedDistrictName }),
      state: selectedDistrict === null ? "active" : "done"
    },
    {
      key: "inspect-district",
      title: i18n.t("shell.guidanceLite.inspectDistrict.title"),
      body:
        selectedDistrict === null
          ? i18n.t("shell.guidanceLite.inspectDistrict.pending")
          : i18n.t("shell.guidanceLite.inspectDistrict.done"),
      state: selectedDistrict === null ? "pending" : "done"
    },
    {
      key: "governance-action",
      title: i18n.t("shell.guidanceLite.action.title"),
      body:
        m3FlowStage === "result"
          ? i18n.t("shell.guidanceLite.action.done")
          : hasOpenedGovernancePreview
            ? i18n.t("shell.guidanceLite.action.active")
            : i18n.t("shell.guidanceLite.action.pending"),
      state:
        m3FlowStage === "result"
          ? "done"
          : hasOpenedGovernancePreview || canOpenAction
            ? "active"
            : "pending"
    },
    {
      key: "observe-result",
      title: i18n.t("shell.guidanceLite.observe.title"),
      body:
        commandStatus === null
          ? i18n.t("shell.guidanceLite.observe.pending")
          : i18n.t("shell.guidanceLite.observe.done", { status: commandStatus }),
      state: hasObservedResult ? "done" : "pending"
    },
    {
      key: "next-step-feedback",
      title: i18n.t("shell.guidanceLite.next.title"),
      body: hasObservedResult
        ? i18n.t("shell.guidanceLite.next.done")
        : i18n.t("shell.guidanceLite.next.pending"),
      state: hasObservedResult ? "active" : "pending"
    }
  ];

  if (isDismissed) {
    return (
      <div className="player-guidance-lite" data-guidance-state="dismissed">
        <p>{i18n.t("shell.guidanceLite.dismissed")}</p>
        <button type="button" onClick={onRestore}>
          {i18n.t("shell.guidanceLite.restore")}
        </button>
      </div>
    );
  }

  return (
    <section
      className="player-guidance-lite"
      aria-label={i18n.t("shell.guidanceLite.label")}
      data-guidance-state={guidanceState}
      data-guidance-collapsed={isCollapsed ? "true" : "false"}
      data-guidance-evidence={hasGuidanceEvidence ? "available" : "missing"}
    >
      <header className="player-guidance-lite__header">
        <div>
          <strong>{i18n.t("shell.guidanceLite.title")}</strong>
          <span>{formatGuidanceSourceText(guidanceState, i18n)}</span>
        </div>
        <div className="player-guidance-lite__controls">
          <button
            type="button"
            aria-expanded={!isCollapsed}
            aria-label={
              isCollapsed
                ? i18n.t("shell.guidanceLite.expand")
                : i18n.t("shell.guidanceLite.collapse")
            }
            onClick={onToggleCollapse}
          >
            {isCollapsed
              ? i18n.t("shell.guidanceLite.expand")
              : i18n.t("shell.guidanceLite.collapse")}
          </button>
          <button
            type="button"
            aria-label={i18n.t("shell.guidanceLite.dismiss")}
            onClick={onDismiss}
          >
            {i18n.t("shell.guidanceLite.dismiss")}
          </button>
        </div>
      </header>
      {isCollapsed ? null : (
        <>
          <ol
            className="player-guidance-lite__steps"
            aria-label={i18n.t("shell.guidanceLite.stepsLabel")}
          >
            {steps.map((step) => (
              <li key={step.key} data-step-state={step.state}>
                <span>{formatGuidanceStepState(step.state, i18n)}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="player-guidance-lite__costs">{i18n.t("shell.guidanceLite.costsVisible")}</p>
        </>
      )}
    </section>
  );
}

function getGuidanceReadModelState(
  snapshot: ClientReadModelSnapshot
): "empty" | "error" | "normal" {
  if (snapshot.m7Guidance.scenarios.length === 0) {
    return "empty";
  }
  if (snapshot.m7Guidance.reviewSummary.blockedScopeNotes.length > 0) {
    return "error";
  }
  return "normal";
}

function formatGuidanceSourceText(state: "empty" | "error" | "normal", i18n: ClientI18n): string {
  switch (state) {
    case "empty":
      return i18n.t("shell.guidanceLite.sourceEmpty");
    case "error":
      return i18n.t("shell.guidanceLite.sourceError");
    case "normal":
      return i18n.t("shell.guidanceLite.sourceReady");
  }
}

function formatGuidanceStepState(state: PlayerGuidanceStepState, i18n: ClientI18n): string {
  switch (state) {
    case "active":
      return i18n.t("shell.guidanceLite.state.active");
    case "done":
      return i18n.t("shell.guidanceLite.state.done");
    case "pending":
      return i18n.t("shell.guidanceLite.state.pending");
  }
}

function CommandStatus({
  m3CommandStatus,
  m4CommandStatus,
  m5CommandStatus,
  m6CommandStatus
}: {
  readonly m3CommandStatus: string | null;
  readonly m4CommandStatus: string | null;
  readonly m5CommandStatus: string | null;
  readonly m6CommandStatus: string | null;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const status = m4CommandStatus ?? m3CommandStatus ?? m6CommandStatus ?? m5CommandStatus ?? null;
  return (
    <p className="client-shell__command-status" role="status" aria-live="polite">
      {status ?? i18n.t("shell.debug.hiddenNotice")}
    </p>
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

interface M3AppointmentFlowProps {
  readonly snapshot: ClientM3AppointmentReadModelSnapshot;
  readonly selectedOffice: ClientM3OfficeReadModel | null;
  readonly candidateEligibilities: readonly ClientM3AppointmentEligibilityReadModel[];
  readonly selectedEligibility: ClientM3AppointmentEligibilityReadModel | null;
  readonly flowStage: M3AppointmentFlowStage;
  readonly commandStatus: string | null;
  readonly onOfficeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onCandidateChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onCandidateKeyChange: (characterKey: string) => void;
  readonly onPreview: () => void;
  readonly onConfirm: () => void;
}

function M3AppointmentFlow({
  snapshot,
  selectedOffice,
  candidateEligibilities,
  selectedEligibility,
  flowStage,
  commandStatus,
  onOfficeChange,
  onCandidateChange,
  onCandidateKeyChange,
  onPreview,
  onConfirm
}: M3AppointmentFlowProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const selectedCharacter = findM3Character(
    snapshot.characters,
    selectedEligibility?.characterId ?? null
  );
  const canPreview = selectedOffice !== null && selectedEligibility !== null;
  const canConfirm =
    selectedOffice !== null &&
    selectedEligibility !== null &&
    selectedEligibility.status === "eligible" &&
    (flowStage === "preview" || flowStage === "result");

  if (snapshot.offices.length === 0) {
    return (
      <section
        className="m3-flow"
        aria-label={i18n.t("appointment.flow.label")}
        data-flow-state="empty"
      >
        <header className="m3-flow__header">
          <div>
            <h2>{i18n.t("appointment.flow.title")}</h2>
            <p>{i18n.t("appointment.flow.empty")}</p>
          </div>
        </header>
      </section>
    );
  }

  return (
    <section
      className="m3-flow"
      aria-label={i18n.t("appointment.flow.label")}
      data-flow-stage={flowStage}
      data-office-count={snapshot.offices.length}
      data-candidate-count={candidateEligibilities.length}
      data-selected-candidate-status={selectedEligibility?.status ?? "none"}
      data-debug-raw-reasons="hidden"
    >
      <header className="m3-flow__header">
        <div>
          <h2>{i18n.t("appointment.flow.title")}</h2>
          <p>{i18n.t("appointment.flow.subtitle")}</p>
        </div>
        <ol className="m3-flow__steps" aria-label={i18n.t("appointment.flow.stepsLabel")}>
          <li data-active={flowStage === "select-office"}>{i18n.t("appointment.step.office")}</li>
          <li data-active={flowStage === "compare-candidates"}>
            {i18n.t("appointment.step.compare")}
          </li>
          <li data-active={flowStage === "preview"}>{i18n.t("appointment.step.preview")}</li>
          <li data-active={flowStage === "result"}>{i18n.t("appointment.step.result")}</li>
        </ol>
      </header>

      <div className="m3-flow__grid">
        <section className="m3-flow__panel" aria-label={i18n.t("appointment.office.label")}>
          <h3>{i18n.t("appointment.office.title")}</h3>
          <label className="m3-flow__field">
            <span>{i18n.t("appointment.office.select")}</span>
            <select
              aria-label={i18n.t("appointment.office.select")}
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
          <OfficePlayerDetail office={selectedOffice} selectedCharacter={selectedCharacter} />
        </section>

        <section className="m3-flow__panel" aria-label={i18n.t("appointment.candidate.label")}>
          <h3>{i18n.t("appointment.candidate.title")}</h3>
          <label className="m3-flow__field">
            <span>{i18n.t("appointment.candidate.select")}</span>
            <select
              aria-label={i18n.t("appointment.candidate.select")}
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
                  >
                    {i18n.t("appointment.candidate.option", {
                      name: character?.displayName ?? i18n.t("appointment.character.unknown"),
                      status: formatM3EligibilityStatus(eligibility.status, i18n)
                    })}
                  </option>
                );
              })}
            </select>
          </label>
          <div className="m3-flow__candidate-list" role="list">
            {candidateEligibilities.map((eligibility) => {
              const character = findM3Character(snapshot.characters, eligibility.characterId);
              const isSelected =
                selectedEligibility?.characterId === eligibility.characterId &&
                selectedEligibility.officeId === eligibility.officeId;
              return (
                <button
                  className="m3-flow__candidate-card"
                  data-status={eligibility.status}
                  data-selected={isSelected}
                  key={`${eligibility.officeId}-${eligibility.characterId}`}
                  onClick={() => onCandidateKeyChange(Number(eligibility.characterId).toString())}
                  type="button"
                >
                  <strong>
                    {character?.displayName ?? i18n.t("appointment.character.unknown")}
                  </strong>
                  <span>{character?.roleLabel ?? i18n.t("appointment.character.roleUnknown")}</span>
                  <span>{formatM3EligibilityStatus(eligibility.status, i18n)}</span>
                  <ReasonChips reasonCodes={eligibility.reasonCodes} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="m3-flow__panel" aria-label={i18n.t("appointment.preview.label")}>
          <h3>{i18n.t("appointment.preview.title")}</h3>
          <AppointmentImpactPreview
            office={selectedOffice}
            selectedEligibility={selectedEligibility}
          />
          <div className="m3-flow__actions">
            <button type="button" disabled={!canPreview} onClick={onPreview}>
              {i18n.t("appointment.action.preview")}
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={onConfirm}
              data-command-kind="sim.appoint-office"
            >
              {i18n.t("appointment.action.confirm")}
            </button>
          </div>
          <AppointmentResultFeedback
            commandStatus={commandStatus}
            flowStage={flowStage}
            selectedEligibility={selectedEligibility}
          />
        </section>
      </div>

      <details className="m3-flow__bulk">
        <summary>{i18n.t("appointment.bulk.summary")}</summary>
        <p>{i18n.t("appointment.bulk.description")}</p>
        <div className="m3-flow__bulk-list" role="list">
          {snapshot.bulkPreview.items.map((item) => (
            <BulkPreviewRow key={item.itemId} item={item} snapshot={snapshot} />
          ))}
        </div>
      </details>
    </section>
  );
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
                <ReasonCodeText reasonCode={summary.reasonCode} />
                <span>
                  {summary.count} / {summary.sourceKinds.join(", ")}
                </span>
              </div>
            ))}
          </div>
          <RawReasonCodeList
            label="Raw appointment reason codes"
            reasonCodes={snapshot.reasonSummaries.map((summary) => summary.reasonCode)}
          />
        </section>
      </div>
    </section>
  );
}

interface M4CampaignWorkspaceProps {
  readonly snapshot: ClientM4CampaignReadModelSnapshot;
  readonly selectedCampaign: ClientM4CampaignPlanReadModel | null;
  readonly selectedSiege: ClientM4SiegeReadModel | null;
  readonly selectedSiegeChoice: ClientM4SiegeChoice;
  readonly commandStatus: string | null;
  readonly onCampaignChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onSiegeChoiceChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onSubmitPlan: () => void;
  readonly onSubmitStartMarch: () => void;
  readonly onSubmitCancel: () => void;
  readonly onSubmitSiegeChoice: () => void;
  readonly onSubmitWithdrawal: () => void;
}

function M4CampaignWorkspace({
  snapshot,
  selectedCampaign,
  selectedSiege,
  selectedSiegeChoice,
  commandStatus,
  onCampaignChange,
  onSiegeChoiceChange,
  onSubmitPlan,
  onSubmitStartMarch,
  onSubmitCancel,
  onSubmitSiegeChoice,
  onSubmitWithdrawal
}: M4CampaignWorkspaceProps): ReactElement {
  return (
    <section
      className="m4-campaign"
      aria-label="M4 campaign planning workspace"
      data-plan-count={snapshot.plans.length}
      data-muster-readiness={snapshot.muster.readiness}
      data-grain-days={snapshot.grain.expectedDaysOfSupply}
      data-route-risk-count={snapshot.route.reasonCodes.length}
      data-war-report-count={snapshot.warReports.length}
    >
      <div className="m4-campaign__header">
        <div>
          <h2>M4 campaign planning</h2>
          <p>{snapshot.provenance.note}</p>
        </div>
        <dl className="m4-campaign__summary">
          <Metric label="Window" value={formatM4Window(snapshot.planningDraft.startWindow)} />
          <Metric label="Muster" value={snapshot.muster.readiness} />
          <Metric label="Supply days" value={snapshot.grain.expectedDaysOfSupply.toString()} />
          <Metric label="War reports" value={snapshot.warReports.length.toString()} />
        </dl>
      </div>

      <div className="m4-campaign__grid">
        <section className="m4-campaign__panel" aria-label="Campaign command panel">
          <div className="m4-campaign__controls">
            <label>
              <span>Campaign</span>
              <select
                aria-label="Select M4 campaign plan"
                value={
                  selectedCampaign === null
                    ? ""
                    : Number(selectedCampaign.campaignPlanId).toString()
                }
                onChange={onCampaignChange}
              >
                {snapshot.plans.map((plan) => (
                  <option key={plan.campaignPlanId} value={Number(plan.campaignPlanId).toString()}>
                    {plan.targetLabel} / {plan.status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Siege choice</span>
              <select
                aria-label="Select M4 siege choice"
                value={selectedSiegeChoice}
                onChange={onSiegeChoiceChange}
              >
                {M4_SIEGE_CHOICES.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="m4-campaign__detail">
            <h3>{selectedCampaign?.targetLabel ?? snapshot.planningDraft.targetLabel}</h3>
            <dl>
              <Metric
                label="Owner"
                value={selectedCampaign?.ownerLabel ?? snapshot.planningDraft.ownerLabel}
              />
              <Metric
                label="Objective"
                value={selectedCampaign?.objectiveKind ?? snapshot.planningDraft.objectiveKind}
              />
              <Metric label="Forecast" value={selectedCampaign?.forecast.status ?? "draft"} />
              <Metric
                label="Start range"
                value={
                  selectedCampaign === null
                    ? formatM4Window(snapshot.planningDraft.startWindow)
                    : formatM4Window({
                        earliestDay: selectedCampaign.forecast.earliestStartDay,
                        latestDay: selectedCampaign.forecast.latestStartDay
                      })
                }
              />
            </dl>
            <ReasonChips
              reasonCodes={
                selectedCampaign === null
                  ? snapshot.planningDraft.reasonCodes
                  : [
                      selectedCampaign.statusReasonCode,
                      ...selectedCampaign.reasonCodes,
                      ...selectedCampaign.forecast.reasonCodes
                    ]
              }
            />
          </div>

          <div className="m4-campaign__actions">
            <button
              type="button"
              onClick={onSubmitPlan}
              data-command-kind="sim.create-campaign-objective"
            >
              Submit plan
            </button>
            <button
              type="button"
              disabled={selectedCampaign === null}
              onClick={onSubmitStartMarch}
              data-command-kind="sim.start-campaign-march"
            >
              Start march
            </button>
            <button
              type="button"
              disabled={selectedCampaign === null}
              onClick={onSubmitCancel}
              data-command-kind="sim.cancel-campaign-objective"
            >
              Cancel plan
            </button>
            <button
              type="button"
              disabled={selectedSiege === null}
              onClick={onSubmitSiegeChoice}
              data-command-kind="sim.apply-m4-siege-choice"
            >
              Submit siege choice
            </button>
            <button
              type="button"
              disabled={selectedCampaign === null}
              onClick={onSubmitWithdrawal}
              data-command-kind="sim.resolve-m4-campaign-withdrawal"
            >
              Withdraw
            </button>
          </div>

          {commandStatus === null ? null : (
            <output className="m4-campaign__command-status" aria-label="M4 command status">
              {commandStatus}
            </output>
          )}
        </section>

        <M4MusterPanel muster={snapshot.muster} />
        <M4SupplyRoutePanel grain={snapshot.grain} route={snapshot.route} />
        <M4MarchSiegePanel
          marches={snapshot.marches}
          sieges={snapshot.sieges}
          withdrawals={snapshot.withdrawals}
        />
        <M4AiPanel snapshot={snapshot} />
        <M4WarReportPanel reports={snapshot.warReports} />
      </div>
    </section>
  );
}

function M4MusterPanel({ muster }: { readonly muster: ClientM4MusterReadModel }): ReactElement {
  return (
    <section className="m4-campaign__panel" aria-label="M4 muster readiness">
      <h3>Muster readiness</h3>
      <dl className="m4-campaign__metrics">
        <Metric label="Promised" value={formatInteger(muster.promisedTroops)} />
        <Metric label="Assembled" value={formatInteger(muster.assembledTroops)} />
        <Metric label="Delayed" value={formatInteger(muster.delayedTroops)} />
        <Metric label="Refused" value={formatInteger(muster.refusedTroops)} />
      </dl>
      <div className="m4-campaign__stack">
        {muster.commitments.map((commitment) => (
          <div className="m4-campaign__fact" key={commitment.commitmentId}>
            <strong>Commitment {commitment.commitmentId}</strong>
            <span>
              {commitment.status}; {commitment.assembledTroops}/{commitment.promisedTroops} troops;
              day {commitment.plannedAssemblyDay}
            </span>
            <ReasonChips reasonCodes={[commitment.statusReasonCode, ...commitment.reasonCodes]} />
          </div>
        ))}
      </div>
    </section>
  );
}

function M4SupplyRoutePanel({
  grain,
  route
}: {
  readonly grain: ClientM4GrainSupplyReadModel;
  readonly route: ClientM4RouteForecastReadModel;
}): ReactElement {
  return (
    <section className="m4-campaign__panel" aria-label="M4 supply and route forecast">
      <h3>Supply and route forecast</h3>
      <dl className="m4-campaign__metrics">
        <Metric label="Required" value={formatInteger(grain.grainRequired)} />
        <Metric label="Reserved" value={formatInteger(grain.grainReserved)} />
        <Metric label="Available" value={formatInteger(grain.grainAvailableToReserve)} />
        <Metric label="Bottleneck" value={formatInteger(route.bottleneckCapacity)} />
      </dl>
      <ReasonChips reasonCodes={[...grain.reasonCodes, ...route.reasonCodes]} />
      <div className="m4-campaign__stack">
        {route.sourceForecasts.map((forecast) => (
          <div className="m4-campaign__fact" key={forecast.reservationId}>
            <strong>Route reservation {forecast.reservationId}</strong>
            <span>
              {forecast.status}; {forecast.travelDays} days; arrival {forecast.earliestArrivalDay}-
              {forecast.latestArrivalDay}
            </span>
            <ReasonChips
              reasonCodes={[
                ...(forecast.overloadedReasonCode === null ? [] : [forecast.overloadedReasonCode]),
                ...forecast.seasonRiskReasonCodes
              ]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function M4MarchSiegePanel({
  marches,
  sieges,
  withdrawals
}: {
  readonly marches: readonly ClientM4MarchReadModel[];
  readonly sieges: readonly ClientM4SiegeReadModel[];
  readonly withdrawals: readonly ClientM4WithdrawalReadModel[];
}): ReactElement {
  return (
    <section className="m4-campaign__panel" aria-label="M4 march siege withdrawal state">
      <h3>March, siege, withdrawal</h3>
      <div className="m4-campaign__stack">
        {marches.map((march) => (
          <div className="m4-campaign__fact" key={march.marchId}>
            <strong>March {march.marchId}</strong>
            <span>
              {march.status}; troops {march.activeTroops}; supply {march.supply.status}; arrival{" "}
              {march.predictedArrivalWindow.earliestDay}-{march.predictedArrivalWindow.latestDay}
            </span>
            <ReasonChips reasonCodes={[march.statusReasonCode, ...march.reasonCodes]} />
          </div>
        ))}
        {sieges.map((siege) => (
          <div className="m4-campaign__fact" key={siege.siegeId}>
            <strong>Siege {siege.siegeId}</strong>
            <span>
              {siege.status}; progress {siege.siegeProgress}; losses {siege.attackerCasualties}/
              {siege.defenderCasualties}; supply loss {siege.supplyLoss}
            </span>
            <ReasonChips
              reasonCodes={[
                siege.statusReasonCode,
                ...siege.reasonCodes,
                ...siege.surrenderReasonCodes
              ]}
            />
          </div>
        ))}
        {withdrawals.map((withdrawal) => (
          <div className="m4-campaign__fact" key={withdrawal.withdrawalId}>
            <strong>Withdrawal {withdrawal.withdrawalId}</strong>
            <span>
              {withdrawal.kind}; {withdrawal.triggerReason}; extracted {withdrawal.troopsExtracted}/
              {withdrawal.troopsBefore}; casualties {withdrawal.casualties}
            </span>
            <ReasonChips reasonCodes={withdrawal.reasonCodes} />
          </div>
        ))}
      </div>
    </section>
  );
}

function M4AiPanel({
  snapshot
}: {
  readonly snapshot: ClientM4CampaignReadModelSnapshot;
}): ReactElement {
  return (
    <section className="m4-campaign__panel" aria-label="M4 AI reasons">
      <h3>AI reasons</h3>
      <div className="m4-campaign__fact">
        <strong>{snapshot.aiReason.decisionKind}</strong>
        <span>{snapshot.aiReason.commandKind ?? "no command"}</span>
        <ReasonChips
          reasonCodes={[snapshot.aiReason.primaryReasonCode, ...snapshot.aiReason.reasonCodes]}
        />
      </div>
      <div className="m4-campaign__stack">
        {snapshot.aiReason.candidates.map((candidate) => (
          <div className="m4-campaign__fact" key={candidate.candidateId}>
            <strong>{candidate.candidateId}</strong>
            <span>
              {candidate.decisionKind}; score {candidate.score}
            </span>
            <ReasonChips reasonCodes={candidate.reasonCodes} />
          </div>
        ))}
      </div>
      <div className="m4-campaign__reason-summary">
        {snapshot.reasonSummaries.slice(0, 8).map((summary) => (
          <div className="m4-campaign__fact" key={summary.reasonCode}>
            <ReasonCodeText reasonCode={summary.reasonCode} />
            <span>
              {summary.count} / {summary.sourceKinds.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function M4WarReportPanel({
  reports
}: {
  readonly reports: readonly ClientM4WarReportReadModel[];
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  return (
    <section className="m4-campaign__panel" aria-label="M4 war report">
      <h3>War report</h3>
      <div className="m4-campaign__stack">
        {reports.map((report) => (
          <div className="m4-campaign__fact" key={report.outcomeId}>
            <strong>Outcome {report.outcomeId}</strong>
            <span>
              losses {report.attackerCasualties}/{report.defenderCasualties}; supply loss{" "}
              {report.supplyLoss}; day {report.resolvedDay}
            </span>
            {report.postwarCandidate === null ? null : (
              <span>
                Handoff {report.postwarCandidate.candidateId}; methods{" "}
                {report.postwarCandidate.validM3Methods
                  .map((method) => i18n.formatReasonCode(method))
                  .join(", ")}
              </span>
            )}
            <ReasonChips
              reasonCodes={[...report.reasonCodes, ...(report.postwarCandidate?.reasonCodes ?? [])]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

interface M5PlayableWorkspaceProps {
  readonly snapshot: ClientM5PlayableReadModelSnapshot;
  readonly phase: ClientM5PlayablePhase;
  readonly currentStepIndex: number;
  readonly previewStepId: string | null;
  readonly confirmedCommandIds: readonly string[];
  readonly savedSession: string;
  readonly saveStatus: string | null;
  readonly commandStatus: string | null;
  readonly onStart: () => void;
  readonly onPreview: () => void;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly onFailurePreview: () => void;
  readonly onSave: () => void;
  readonly onLoad: () => void;
}

function M5PlayableWorkspace({
  snapshot,
  phase,
  currentStepIndex,
  previewStepId,
  confirmedCommandIds,
  savedSession,
  saveStatus,
  commandStatus,
  onStart,
  onPreview,
  onConfirm,
  onCancel,
  onFailurePreview,
  onSave,
  onLoad
}: M5PlayableWorkspaceProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const currentStep = getM5CurrentStep(snapshot, currentStepIndex);
  const previewStep =
    previewStepId === snapshot.failureStep.stepId
      ? snapshot.failureStep
      : (snapshot.steps.find((step) => step.stepId === previewStepId) ?? currentStep);
  const isConfirmDisabled = phase !== "running" || currentStep === null;

  return (
    <section
      className="m5-playable"
      aria-label="M5 playable slice workspace"
      data-scenario-id={snapshot.scenarioId}
      data-phase={phase}
      data-command-count={snapshot.steps.length}
      data-current-step-index={currentStepIndex}
      data-confirmed-count={confirmedCommandIds.length}
      data-save-present={savedSession.length > 0 ? "true" : "false"}
    >
      <div className="m5-playable__header">
        <div>
          <h2>M5 playable slice</h2>
          <p>{snapshot.provenance.note}</p>
        </div>
        <dl className="m5-playable__summary">
          <Metric label="Phase" value={phase} />
          <Metric label="Scenario" value={snapshot.scenarioId} />
          <Metric label="Hash" value={snapshot.replay.currentHash} />
          <Metric label="Commands" value={snapshot.replay.commandCount.toString()} />
        </dl>
      </div>

      <div className="m5-playable__grid">
        <section className="m5-playable__panel" aria-label="M5 goal and commands">
          <h3>Goal</h3>
          <p>{snapshot.goal.primaryGoal}</p>
          <div className="m5-playable__actions">
            <button type="button" onClick={onStart}>
              Start M5 slice
            </button>
            <button type="button" onClick={onPreview} disabled={currentStep === null}>
              Preview command
            </button>
            <button type="button" onClick={onConfirm} disabled={isConfirmDisabled}>
              Confirm command
            </button>
            <button type="button" onClick={onCancel} disabled={phase !== "running"}>
              Cancel slice
            </button>
            <button type="button" onClick={onFailurePreview}>
              Preview failure
            </button>
          </div>
          {commandStatus === null ? null : (
            <output className="m5-playable__status" aria-label="M5 command status">
              {commandStatus}
            </output>
          )}
          <M5StepPreview step={previewStep} />
        </section>

        <section className="m5-playable__panel" aria-label="M5 save load flow">
          <h3>Save / load</h3>
          <div className="m5-playable__actions">
            <button type="button" onClick={onSave}>
              Save checkpoint
            </button>
            <button type="button" onClick={onLoad} disabled={savedSession.length === 0}>
              Load checkpoint
            </button>
          </div>
          <output
            className="m5-playable__status"
            aria-label="M5 save status"
            data-save-length={savedSession.length}
            data-status-reason={saveStatus ?? "m5.save.no-client-checkpoint"}
          >
            {formatReasonStatus(saveStatus ?? "m5.save.no-client-checkpoint", i18n)}
          </output>
          <code className="m5-playable__save-preview">
            {savedSession.length === 0 ? "no client checkpoint" : savedSession}
          </code>
        </section>

        <M5EvidencePanel snapshot={snapshot} />
        <M5RiskPanel snapshot={snapshot} />
        <M5PostwarPanel snapshot={snapshot} />
        <M5ReasonSummaryPanel snapshot={snapshot} />
      </div>
    </section>
  );
}

function M5StepPreview({
  step
}: {
  readonly step: ClientM5PlayableStepReadModel | null;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  if (step === null) {
    return (
      <div className="m5-playable__fact" aria-label="M5 command preview">
        <strong>No command selected</strong>
        <span>Start the slice to inspect the first accepted protocol command.</span>
      </div>
    );
  }

  return (
    <div
      className="m5-playable__fact"
      aria-label="M5 command preview"
      data-command-kind={step.command.kind}
      data-step-stage={step.stage}
    >
      <strong>{step.label}</strong>
      <span>
        {step.preview.commandKind};{" "}
        <span data-command-id={step.preview.commandId}>
          {i18n.formatReasonCode(step.preview.commandId)}
        </span>
        ; {step.actorLabel}
      </span>
      <span>{step.result.summary}</span>
      <ReasonChips reasonCodes={step.reasonCodes} />
    </div>
  );
}

function M5EvidencePanel({
  snapshot
}: {
  readonly snapshot: ClientM5PlayableReadModelSnapshot;
}): ReactElement {
  return (
    <section className="m5-playable__panel" aria-label="M5 replay evidence">
      <h3>Replay evidence</h3>
      <dl className="m5-playable__metrics">
        <Metric label="Boot" value={snapshot.replay.bootFixture} />
        <Metric label="Start hash" value={snapshot.replay.startHash} />
        <Metric label="Checkpoint" value={snapshot.replay.checkpointLabel} />
        <Metric label="Day" value={snapshot.day.toString()} />
      </dl>
      <div className="m5-playable__stack">
        {snapshot.goal.successConditions.map((condition) => (
          <div className="m5-playable__fact" key={condition}>
            <strong>Success</strong>
            <span>{condition}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function M5RiskPanel({
  snapshot
}: {
  readonly snapshot: ClientM5PlayableReadModelSnapshot;
}): ReactElement {
  return (
    <section className="m5-playable__panel" aria-label="M5 AI risk supply season">
      <h3>AI / risk / supply / season</h3>
      <div className="m5-playable__fact">
        <strong>{snapshot.ai.decisionKind}</strong>
        <span>{snapshot.ai.commandKind ?? "no command"}</span>
        <ReasonChips reasonCodes={[snapshot.ai.primaryReasonCode, ...snapshot.ai.reasonCodes]} />
      </div>
      <dl className="m5-playable__metrics">
        <Metric label="Risk" value={snapshot.risk.campaignRiskLabel} />
        <Metric label="Supply days" value={snapshot.supply.expectedDaysOfSupply.toString()} />
        <Metric label="Reserved" value={formatInteger(snapshot.supply.grainReserved)} />
        <Metric label="Season" value={snapshot.season.windowLabel} />
      </dl>
      <ReasonChips
        reasonCodes={[
          ...snapshot.risk.routeReasonCodes,
          ...snapshot.supply.reasonCodes,
          ...snapshot.season.reasonCodes,
          ...snapshot.risk.withdrawalReasonCodes
        ]}
      />
    </section>
  );
}

function M5PostwarPanel({
  snapshot
}: {
  readonly snapshot: ClientM5PlayableReadModelSnapshot;
}): ReactElement {
  return (
    <section className="m5-playable__panel" aria-label="M5 postwar consequences">
      <h3>Postwar consequences</h3>
      <dl className="m5-playable__metrics">
        <Metric label="Candidates" value={snapshot.postwar.candidateCount.toString()} />
        <Metric label="Methods" value={snapshot.postwar.methods.join(", ")} />
      </dl>
      <ReasonChips reasonCodes={snapshot.postwar.consequenceReasonCodes} />
      <div className="m5-playable__stack">
        {snapshot.goal.failureConditions.map((condition) => (
          <div className="m5-playable__fact" key={condition}>
            <strong>Failure</strong>
            <span>{condition}</span>
          </div>
        ))}
        {snapshot.goal.outOfScope.map((item) => (
          <div className="m5-playable__fact" key={item}>
            <strong>Out of scope</strong>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function M5ReasonSummaryPanel({
  snapshot
}: {
  readonly snapshot: ClientM5PlayableReadModelSnapshot;
}): ReactElement {
  return (
    <section className="m5-playable__panel" aria-label="M5 reason summaries">
      <h3>Reason summaries</h3>
      <div className="m5-playable__stack">
        {snapshot.reasonSummaries.slice(0, 10).map((summary) => (
          <div className="m5-playable__fact" key={summary.reasonCode}>
            <ReasonCodeText reasonCode={summary.reasonCode} />
            <span>
              {summary.count} / {summary.sourceKinds.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

interface M6AlphaWorkspaceProps {
  readonly snapshot: ClientM6AlphaReadModelSnapshot;
  readonly phase: ClientM6AlphaPhase;
  readonly selectedScenarioId: string;
  readonly currentStepIndex: number;
  readonly previewStepId: string | null;
  readonly confirmedCommandIds: readonly string[];
  readonly savedSession: string;
  readonly saveStatus: string | null;
  readonly commandStatus: string | null;
  readonly onScenarioChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onStart: () => void;
  readonly onPreview: () => void;
  readonly onConfirm: () => void;
  readonly onSave: () => void;
  readonly onLoad: () => void;
  readonly onFailurePreview: () => void;
}

function M6AlphaWorkspace({
  snapshot,
  phase,
  selectedScenarioId,
  currentStepIndex,
  previewStepId,
  confirmedCommandIds,
  savedSession,
  saveStatus,
  commandStatus,
  onScenarioChange,
  onStart,
  onPreview,
  onConfirm,
  onSave,
  onLoad,
  onFailurePreview
}: M6AlphaWorkspaceProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const currentStep = getM6CurrentStep(snapshot, currentStepIndex);
  const previewStep =
    previewStepId === snapshot.failureStep.stepId
      ? snapshot.failureStep
      : (snapshot.steps.find((step) => step.stepId === previewStepId) ?? currentStep);
  const isConfirmDisabled = phase !== "running" || currentStep === null;
  const emptyCommandReason = "m6.command.no-alpha-command-submitted";
  const commandLiveStatus = commandStatus ?? i18n.formatReasonCode(emptyCommandReason);
  const commandStatusKind = commandStatus === null ? "idle" : "submitted";
  const saveLiveStatus = saveStatus ?? "m6.save.no-client-checkpoint";
  const saveStatusKind =
    saveStatus === null ? "empty" : saveStatus.startsWith("m6.load.") ? "restored" : "written";
  const currentCommandLabel = currentStep?.label ?? "No Alpha command available";
  const currentScenario = snapshot.scenarios.find(
    (scenario) => scenario.scenarioId === selectedScenarioId
  );
  const scenarioHelpText =
    currentScenario === undefined
      ? "No Alpha scenario is available in this read-model state."
      : `${currentScenario.label}; ${currentScenario.scenarioKind}; day ${currentScenario.startDay}.`;

  return (
    <section
      className="m6-alpha"
      aria-label="M6 Alpha start to victory workspace"
      aria-describedby="m6-alpha-accessibility-status"
      data-scenario-id={snapshot.scenarioId}
      data-selected-scenario-id={selectedScenarioId}
      data-phase={phase}
      data-command-count={snapshot.steps.length}
      data-current-step-index={currentStepIndex}
      data-confirmed-count={confirmedCommandIds.length}
      data-terminal-outcome={snapshot.terminal.outcome}
      data-can-pursue-victory={snapshot.terminal.canPursueVictory ? "true" : "false"}
      data-save-present={savedSession.length > 0 ? "true" : "false"}
    >
      <span id="m6-alpha-accessibility-status" className="sr-only">
        M6 Alpha phase {phase}. Current command: {currentCommandLabel}. Confirmed commands:{" "}
        {confirmedCommandIds.length}. Save status: {saveLiveStatus}.
      </span>
      <span id="m6-alpha-scenario-description" className="sr-only">
        Selected scenario: {scenarioHelpText}
      </span>
      <span id="m6-alpha-command-description" className="sr-only">
        Command preview and confirmation submit protocol command DTOs only; the client does not
        mutate authoritative world state.
      </span>
      <span id="m6-alpha-save-description" className="sr-only">
        Alpha checkpoint is a local client-session checkpoint used for this core-flow smoke.
      </span>
      <div className="m6-alpha__header">
        <div>
          <h2>M6 Alpha surfaces</h2>
          <p>{snapshot.provenance.note}</p>
        </div>
        <dl className="m6-alpha__summary">
          <Metric label="Phase" value={phase} />
          <Metric label="Scenario" value={snapshot.scenarioId} />
          <Metric label="Terminal" value={snapshot.terminal.outcome} />
          <Metric label="Commands" value={snapshot.replay.commandCount.toString()} />
        </dl>
      </div>

      <div className="m6-alpha__grid">
        <section className="m6-alpha__panel" aria-label="M6 scenario and command flow">
          <h3>Scenario and commands</h3>
          <p>{snapshot.goal.primaryGoal}</p>
          <label className="m6-alpha__field">
            <span>Scenario</span>
            <select
              aria-label="Select M6 Alpha scenario"
              aria-describedby="m6-alpha-scenario-description"
              value={selectedScenarioId}
              onChange={onScenarioChange}
            >
              {snapshot.scenarios.map((scenario) => (
                <option key={scenario.scenarioId} value={scenario.scenarioId}>
                  {scenario.label}
                </option>
              ))}
            </select>
          </label>
          <div className="m6-alpha__actions">
            <button
              type="button"
              aria-describedby="m6-alpha-command-description"
              onClick={onStart}
              disabled={snapshot.steps.length === 0}
            >
              Start Alpha
            </button>
            <button
              type="button"
              aria-describedby="m6-alpha-command-description"
              onClick={onPreview}
              disabled={currentStep === null}
            >
              Preview Alpha command
            </button>
            <button
              type="button"
              aria-describedby="m6-alpha-command-description"
              onClick={onConfirm}
              disabled={isConfirmDisabled}
            >
              Confirm Alpha command
            </button>
            <button
              type="button"
              aria-describedby="m6-alpha-command-description"
              onClick={onFailurePreview}
            >
              Preview Alpha failure
            </button>
          </div>
          <output
            className="m6-alpha__status"
            aria-atomic="true"
            aria-describedby="m6-alpha-command-description"
            aria-label="M6 command status"
            aria-live="polite"
            data-status-kind={commandStatusKind}
            data-status-reason={commandStatus === null ? emptyCommandReason : undefined}
            role="status"
          >
            {commandLiveStatus}
          </output>
          <M6StepPreview step={previewStep} />
        </section>

        <section className="m6-alpha__panel" aria-label="M6 save load checkpoint state">
          <h3>Save / load checkpoint</h3>
          <div className="m6-alpha__actions">
            <button type="button" aria-describedby="m6-alpha-save-description" onClick={onSave}>
              Save Alpha checkpoint
            </button>
            <button
              type="button"
              aria-describedby="m6-alpha-save-description"
              onClick={onLoad}
              disabled={savedSession.length === 0}
            >
              Load Alpha checkpoint
            </button>
          </div>
          <output
            className="m6-alpha__status"
            aria-label="M6 save status"
            aria-describedby="m6-alpha-save-description"
            aria-live="polite"
            aria-atomic="true"
            data-save-length={savedSession.length}
            data-status-kind={saveStatusKind}
            data-status-reason={saveLiveStatus}
            role="status"
          >
            {formatReasonStatus(saveLiveStatus, i18n)}
          </output>
          <code className="m6-alpha__save-preview">
            {savedSession.length === 0 ? "no Alpha client checkpoint" : savedSession}
          </code>
        </section>

        <M6DiplomacyLegitimacyPanel
          diplomacy={snapshot.diplomacy}
          legitimacy={snapshot.legitimacy}
          succession={snapshot.succession}
        />
        <M6PolicyEventPanel policies={snapshot.policies} encyclopedia={snapshot.encyclopedia} />
        <M6AdviserPanel adviser={snapshot.adviser} />
        <M6MapCandidatePanel mapCandidate={snapshot.mapCandidate} />
        <M6TerminalPanel
          terminal={snapshot.terminal}
          goal={snapshot.goal}
          replay={snapshot.replay}
        />
        <M6ReasonSummaryPanel summaries={snapshot.reasonSummaries} />
      </div>
    </section>
  );
}

interface M7GuidanceWorkspaceProps {
  readonly snapshot: ClientM7GuidanceReadModelSnapshot;
  readonly selectedScenarioId: string;
  readonly activeSurface: ClientM7CoverageSurface;
  readonly onScenarioChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly onSurfaceSelect: (surface: ClientM7CoverageSurface) => void;
}

function M7GuidanceWorkspace({
  snapshot,
  selectedScenarioId,
  activeSurface,
  onScenarioChange,
  onSurfaceSelect
}: M7GuidanceWorkspaceProps): ReactElement {
  const selectedScenario =
    snapshot.scenarios.find((scenario) => scenario.scenarioId === selectedScenarioId) ??
    snapshot.scenarios[0] ??
    null;
  const selectedScenarioHelp =
    selectedScenario === null
      ? "No M7 Beta scenario guidance is available."
      : `${selectedScenario.label}; ${selectedScenario.contentLabel}; ${selectedScenario.reviewState}; ${selectedScenario.startYear}.`;
  const selectedEntry =
    snapshot.encyclopedia.entries.find(
      (entry) => entry.entryId === snapshot.encyclopedia.selectedEntryId
    ) ??
    snapshot.encyclopedia.entries[0] ??
    null;

  return (
    <section
      className="m7-guidance"
      aria-label="M7 tutorial hints encyclopedia workspace"
      aria-describedby="m7-guidance-accessibility-status"
      data-selected-scenario-id={selectedScenarioId}
      data-active-surface={activeSurface}
      data-tutorial-step-count={snapshot.tutorial.steps.length}
      data-hint-group-count={snapshot.hints.groups.length}
      data-encyclopedia-entry-count={snapshot.encyclopedia.entries.length}
      data-not-content-lock-acceptance={
        snapshot.contentPack.notContentLockAcceptance ? "true" : "false"
      }
      data-manual-node-battle-decision={snapshot.contentPack.manualNodeBattleDecision}
    >
      <span id="m7-guidance-accessibility-status" className="sr-only">
        M7 guidance surface {activeSurface}. Selected scenario: {selectedScenarioHelp}. Entries:{" "}
        {snapshot.encyclopedia.entries.length}.
      </span>
      <span id="m7-guidance-scenario-description" className="sr-only">
        Selected M7 scenario: {selectedScenarioHelp}
      </span>
      <div className="m7-guidance__header">
        <div>
          <h2>M7 tutorial / hints / encyclopedia</h2>
          <p>{snapshot.provenance.note}</p>
        </div>
        <dl className="m7-guidance__summary">
          <Metric label="Scenarios" value={snapshot.contentPack.scenarioCount.toString()} />
          <Metric label="Events" value={snapshot.contentPack.eventCount.toString()} />
          <Metric label="Known gaps" value={snapshot.contentPack.knownGapCount.toString()} />
          <Metric label="Hash" value={snapshot.contentPack.manifestHash} />
        </dl>
      </div>

      <div className="m7-guidance__controls">
        <label className="m7-guidance__field">
          <span>Scenario</span>
          <select
            aria-label="Select M7 Beta scenario"
            aria-describedby="m7-guidance-scenario-description"
            value={selectedScenarioId}
            onChange={onScenarioChange}
            disabled={snapshot.scenarios.length === 0}
          >
            {snapshot.scenarios.length === 0 ? (
              <option value="scenario.beta.none">No scenario guidance</option>
            ) : (
              snapshot.scenarios.map((scenario) => (
                <option key={scenario.scenarioId} value={scenario.scenarioId}>
                  {scenario.label}
                </option>
              ))
            )}
          </select>
        </label>
        <div className="m7-guidance__tabs" role="tablist" aria-label="M7 guidance surfaces">
          <M7SurfaceTab
            label="Tutorial"
            surface="tutorial"
            activeSurface={activeSurface}
            onSelect={onSurfaceSelect}
          />
          <M7SurfaceTab
            label="Hints"
            surface="hints"
            activeSurface={activeSurface}
            onSelect={onSurfaceSelect}
          />
          <M7SurfaceTab
            label="Encyclopedia"
            surface="encyclopedia"
            activeSurface={activeSurface}
            onSelect={onSurfaceSelect}
          />
          <M7SurfaceTab
            label="Coverage"
            surface="coverage"
            activeSurface={activeSurface}
            onSelect={onSurfaceSelect}
          />
        </div>
      </div>

      <div className="m7-guidance__grid">
        {selectedScenario === null ? (
          <M7EmptyPanel />
        ) : (
          <M7ScenarioPanel scenario={selectedScenario} selectedEntry={selectedEntry} />
        )}
        <M7ReviewPanel snapshot={snapshot} />
        {activeSurface === "tutorial" ? <M7TutorialPanel steps={snapshot.tutorial.steps} /> : null}
        {activeSurface === "hints" ? <M7HintsPanel groups={snapshot.hints.groups} /> : null}
        {activeSurface === "encyclopedia" ? (
          <M7EncyclopediaPanel entries={snapshot.encyclopedia.entries} />
        ) : null}
        {activeSurface === "coverage" ? (
          <M7AudioArtLocalizationCoveragePanel coverage={snapshot.audioArtLocalization} />
        ) : null}
      </div>
    </section>
  );
}

function M7SurfaceTab({
  label,
  surface,
  activeSurface,
  onSelect
}: {
  readonly label: string;
  readonly surface: ClientM7CoverageSurface;
  readonly activeSurface: ClientM7CoverageSurface;
  readonly onSelect: (surface: ClientM7CoverageSurface) => void;
}): ReactElement {
  function handleClick(): void {
    onSelect(surface);
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={activeSurface === surface}
      aria-controls={`m7-${surface}-panel`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

function M7EmptyPanel(): ReactElement {
  return (
    <section className="m7-guidance__panel" aria-label="M7 empty guidance state">
      <h3>No guidance projected</h3>
      <div className="m7-guidance__fact">
        <strong>m7.guidance.empty</strong>
        <span>No tutorial, hint, or encyclopedia read-model slice is available.</span>
      </div>
    </section>
  );
}

function M7ScenarioPanel({
  scenario,
  selectedEntry
}: {
  readonly scenario: ClientM7ScenarioGuidanceReadModel;
  readonly selectedEntry: ClientM7EncyclopediaEntryReadModel | null;
}): ReactElement {
  return (
    <section className="m7-guidance__panel" aria-label="M7 selected scenario guidance">
      <h3>Selected scenario</h3>
      <dl className="m7-guidance__metrics">
        <Metric label="Start year" value={scenario.startYear.toString()} />
        <Metric label="Label" value={scenario.contentLabel} />
        <Metric label="Confidence" value={scenario.confidence} />
        <Metric label="Review" value={scenario.reviewState} />
      </dl>
      <div className="m7-guidance__fact">
        <strong>{scenario.label}</strong>
        <span>{scenario.tutorialHookText}</span>
        <span>{scenario.encyclopediaHookText}</span>
        <ReasonChips reasonCodes={scenario.linkedClaimIds} />
      </div>
      {selectedEntry === null ? null : (
        <div className="m7-guidance__fact" data-entry-id={selectedEntry.entryId}>
          <strong>{selectedEntry.title}</strong>
          <span>
            {selectedEntry.contentLabel}; {selectedEntry.confidence}; {selectedEntry.reviewState}
          </span>
          <span>{selectedEntry.summary}</span>
        </div>
      )}
    </section>
  );
}

function M7ReviewPanel({
  snapshot
}: {
  readonly snapshot: ClientM7GuidanceReadModelSnapshot;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  return (
    <section className="m7-guidance__panel" aria-label="M7 review summary and blockers">
      <h3>Review summary</h3>
      <dl className="m7-guidance__metrics">
        <Metric label="M6 gate" value={snapshot.contentPack.m6GateCarryForward} />
        <Metric
          label="Manual battle"
          value={i18n.formatReasonCode(snapshot.contentPack.manualNodeBattleDecision)}
        />
        <Metric label="Human gates" value={snapshot.reviewSummary.humanGateClaimCount.toString()} />
        <Metric label="Content lock" value="not accepted" />
      </dl>
      <div className="m7-guidance__stack" role="list">
        {snapshot.reviewSummary.reviewStateCounts.map((entry) => (
          <div className="m7-guidance__fact" key={entry.reviewState} role="listitem">
            <strong data-review-state={entry.reviewState}>
              {i18n.formatReasonCode(entry.reviewState)}
            </strong>
            <span>{entry.count} records</span>
          </div>
        ))}
        {snapshot.reviewSummary.blockedScopeNotes.map((note) => (
          <div className="m7-guidance__fact" key={note} role="listitem">
            <strong>Scope boundary</strong>
            <span>{note}</span>
          </div>
        ))}
        {snapshot.reviewSummary.knownGaps.map((gap) => (
          <div className="m7-guidance__fact" key={gap} role="listitem">
            <strong>Known gap</strong>
            <span>{gap}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function M7TutorialPanel({
  steps
}: {
  readonly steps: readonly ClientM7TutorialStepReadModel[];
}): ReactElement {
  return (
    <section
      className="m7-guidance__panel m7-guidance__panel--wide"
      aria-label="M7 tutorial steps"
      data-step-count={steps.length}
      id="m7-tutorial-panel"
      role="tabpanel"
    >
      <h3>Beta tutorial</h3>
      {steps.length === 0 ? (
        <div className="m7-guidance__fact">
          <strong>No tutorial steps</strong>
          <span>M7 tutorial read-model is empty.</span>
        </div>
      ) : (
        <div className="m7-guidance__list" role="list">
          {steps.map((step) => (
            <article
              className="m7-guidance__fact"
              key={step.stepId}
              role="listitem"
              data-milestone={step.milestone}
              data-review-state={step.reviewState}
            >
              <strong>
                {step.milestone}: {step.title}
              </strong>
              <span>{step.summary}</span>
              <span>
                {step.querySurface}; {step.commandKind ?? "query-only"}
              </span>
              <span>
                {step.contentLabel}; {step.reviewState}
              </span>
              <ReasonChips reasonCodes={[...step.reasonCodes, ...step.encyclopediaRefs]} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function M7HintsPanel({
  groups
}: {
  readonly groups: readonly ClientM7HintGroupReadModel[];
}): ReactElement {
  return (
    <section
      className="m7-guidance__panel m7-guidance__panel--wide"
      aria-label="M7 contextual hints"
      data-group-count={groups.length}
      id="m7-hints-panel"
      role="tabpanel"
    >
      <h3>Contextual hints</h3>
      {groups.length === 0 ? (
        <div className="m7-guidance__fact">
          <strong>No contextual hints</strong>
          <span>M7 hint read-model is empty.</span>
        </div>
      ) : (
        <div className="m7-guidance__list" role="list">
          {groups.map((group) => (
            <article className="m7-guidance__fact" key={group.groupId} role="listitem">
              <strong>{group.title}</strong>
              <span>{group.surface}</span>
              <div className="m7-guidance__stack" role="list">
                {group.hints.map((hint) => (
                  <div className="m7-guidance__subfact" key={hint.hintId} role="listitem">
                    <strong>{hint.hintId}</strong>
                    <span>{hint.text}</span>
                    <span>
                      {hint.commandPreviewKind ?? "query-only"}; {hint.contentLabel};{" "}
                      {hint.reviewState}
                    </span>
                    <ReasonChips
                      reasonCodes={[...hint.triggerReasonCodes, ...hint.linkedEntryIds]}
                    />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function M7EncyclopediaPanel({
  entries
}: {
  readonly entries: readonly ClientM7EncyclopediaEntryReadModel[];
}): ReactElement {
  return (
    <section
      className="m7-guidance__panel m7-guidance__panel--wide"
      aria-label="M7 encyclopedia entries"
      data-entry-count={entries.length}
      id="m7-encyclopedia-panel"
      role="tabpanel"
    >
      <h3>Encyclopedia</h3>
      {entries.length === 0 ? (
        <div className="m7-guidance__fact">
          <strong>No encyclopedia entries</strong>
          <span>M7 encyclopedia read-model is empty.</span>
        </div>
      ) : (
        <div className="m7-guidance__list" role="list">
          {entries.map((entry) => (
            <article
              className="m7-guidance__fact"
              key={entry.entryId}
              role="listitem"
              data-entry-id={entry.entryId}
              data-system-milestone={entry.systemMilestone}
              data-review-state={entry.reviewState}
            >
              <strong>
                {entry.systemMilestone}: {entry.title}
              </strong>
              <span>
                {entry.contentLabel}; {entry.confidence}; {entry.reviewState}
              </span>
              <span>{entry.summary}</span>
              <span>Records {entry.contentRecordRefs.join(", ")}</span>
              <ReasonChips
                reasonCodes={[...entry.claimIds, ...entry.sourceIds, ...entry.linkedReasonCodes]}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function M7AudioArtLocalizationCoveragePanel({
  coverage
}: {
  readonly coverage: ClientM7AudioArtLocalizationCoverageReadModel;
}): ReactElement {
  return (
    <section
      className="m7-guidance__panel m7-guidance__panel--wide"
      aria-label="M7 audio art localization coverage"
      data-locale-count={coverage.manifest.localeCount}
      data-asset-reference-count={coverage.manifest.assetReferenceCount}
      data-audio-reference-count={coverage.manifest.audioReferenceCount}
      data-art-reference-count={coverage.manifest.artReferenceCount}
      data-localization-check-count={coverage.manifest.localizationCheckCount}
      data-viewport-smoke-count={coverage.manifest.viewportSmokeCount}
      data-unresolved-risk-count={coverage.manifest.unresolvedRiskCount}
      id="m7-coverage-panel"
      role="tabpanel"
    >
      <h3>Audio / art / localization coverage</h3>
      <dl className="m7-guidance__metrics">
        <Metric label="Locales" value={coverage.manifest.localeCount.toString()} />
        <Metric label="Assets" value={coverage.manifest.assetReferenceCount.toString()} />
        <Metric label="Checks" value={coverage.manifest.localizationCheckCount.toString()} />
        <Metric label="Risks" value={coverage.manifest.unresolvedRiskCount.toString()} />
      </dl>

      <div className="m7-guidance__fact" data-manifest-id={coverage.manifest.manifestId}>
        <strong>{coverage.manifest.manifestId}</strong>
        <span>{coverage.manifest.sourceManifestPath}</span>
        <span>
          Static resources only; no paid service, remote pipeline, secrets, telemetry, CDN/release
          commitment, or new production dependency.
        </span>
        <span>{coverage.staticResourceBoundary.resourceMode}</span>
      </div>

      <div className="m7-guidance__stack" role="list" aria-label="M7 supported locale matrix">
        {coverage.supportedLocales.map((locale) => (
          <div className="m7-guidance__fact" key={locale.locale} role="listitem">
            <strong>
              {locale.locale} / {locale.displayName}
            </strong>
            <span>
              {locale.status}; {locale.reviewState}; stable keys {locale.stableKeyCount}
            </span>
            <span>
              UI {formatBoolean(locale.uiChromeCovered)}; tutorial{" "}
              {formatBoolean(locale.tutorialCovered)}; hints {formatBoolean(locale.hintsCovered)};
              encyclopedia {formatBoolean(locale.encyclopediaCovered)}; content records{" "}
              {formatBoolean(locale.contentRecordCovered)}
            </span>
            <span>{locale.note}</span>
          </div>
        ))}
      </div>

      <div className="m7-guidance__stack" role="list" aria-label="M7 asset reference manifest">
        {coverage.assetReferences.map((asset) => (
          <div
            className="m7-guidance__fact"
            key={asset.assetId}
            role="listitem"
            data-asset-kind={asset.kind}
            data-review-state={asset.reviewState}
          >
            <strong>
              {asset.assetId} / {asset.kind}
            </strong>
            <span>
              {asset.surface}; {asset.status}; {asset.staticResourceRef}
            </span>
            <span>
              risk {asset.cultureRisk}; route {asset.routeTo}
            </span>
            <span>{asset.note}</span>
            <ReasonChips reasonCodes={[...asset.claimIds, ...asset.sourceIds]} />
          </div>
        ))}
      </div>

      <div className="m7-guidance__stack" role="list" aria-label="M7 localization checks">
        {coverage.localizationChecks.map((check) => (
          <div className="m7-guidance__fact" key={check.checkId} role="listitem">
            <strong>{check.checkId}</strong>
            <span>
              {check.surface}; {check.requiredKeyPattern}; locales {check.requiredLocaleCount};
              matched keys {check.matchedKeyCount}
            </span>
            <span>
              {check.status}; {check.reviewState}
            </span>
            <span>{check.note}</span>
          </div>
        ))}
      </div>

      <div className="m7-guidance__stack" role="list" aria-label="M7 viewport smoke coverage">
        {coverage.viewportSmoke.map((smoke) => (
          <div className="m7-guidance__fact" key={smoke.smokeId} role="listitem">
            <strong>{smoke.smokeId}</strong>
            <span>
              {smoke.width}x{smoke.height}; text {smoke.textScalePercent}%; dpr{" "}
              {smoke.deviceScaleFactor}; {smoke.status}
            </span>
            <span>{smoke.note}</span>
          </div>
        ))}
      </div>

      <div className="m7-guidance__stack" role="list" aria-label="M7 post-1.0 gaps and risks">
        {coverage.postOneGaps.map((gap) => (
          <div className="m7-guidance__fact" key={gap.gapId} role="listitem">
            <strong>{gap.gapId}</strong>
            <span>
              {gap.status}; route {gap.routeTo}
            </span>
            <span>{gap.note}</span>
          </div>
        ))}
        {coverage.unresolvedRisks.map((risk) => (
          <div className="m7-guidance__fact" key={risk.riskId} role="listitem">
            <strong>{risk.riskId}</strong>
            <span>
              {risk.severity}; route {risk.routeTo}; Human Gate {formatBoolean(risk.humanGate)}
            </span>
            <span>{risk.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export interface M6BatchBalanceDashboardArtifact {
  readonly schemaVersion: 1;
  readonly kind: "m6.batch-balance-artifact.v1";
  readonly artifactHash: string;
  readonly generatedAt: "deterministic-local-run";
  readonly generator: string;
  readonly runs: readonly M6BatchBalanceDashboardRun[];
  readonly aggregate: {
    readonly scenarioCount: number;
    readonly seedCount: number;
    readonly runCount: number;
    readonly victoryCount: number;
    readonly continuedPlayCount: number;
    readonly defeatCount: number;
    readonly commandRejectedCount: number;
    readonly noRescueCompletionCount: number;
    readonly averageEconomyPressureScore: number;
    readonly averageWarPostwarLossScore: number;
    readonly p0p1CandidateCount: number;
    readonly tuningRiskCount: number;
  };
  readonly p0p1Candidates: readonly string[];
  readonly tuningRisks: readonly string[];
}

export interface M6BatchBalanceDashboardRun {
  readonly runId: string;
  readonly scenarioId: string;
  readonly label: string;
  readonly seed: number;
  readonly plan: string;
  readonly terminalOutcome: "victory" | "continued-play" | "defeat" | "command-rejected";
  readonly finalHash: string;
  readonly loadedHash: string | null;
  readonly saveByteLength: number;
  readonly commandCount: number;
  readonly rejectedCommandId: string | null;
  readonly rejectionCode: string | null;
  readonly evidence: {
    readonly recognizedByCount: number;
    readonly legitimacyScoreBps: number;
    readonly postwarArrangementCount: number;
    readonly resolvedPolicyEventCount: number;
    readonly successionResolvedCount: number;
  };
  readonly metrics: {
    readonly victoryPath: 0 | 1;
    readonly aiCollapse: 0 | 1;
    readonly successionCrisis: 0 | 1;
    readonly diplomacyRecognitions: number;
    readonly economyPressureScore: number;
    readonly warPostwarLossScore: number;
    readonly noRescueCompletion: boolean;
  };
  readonly tuningRisks: readonly string[];
  readonly p0p1Candidates: readonly string[];
}

export function M6BatchBalanceDashboard({
  artifact
}: {
  readonly artifact: M6BatchBalanceDashboardArtifact;
}): ReactElement {
  const p0p1Label =
    artifact.p0p1Candidates.length === 0 ? "none" : artifact.p0p1Candidates.join(", ");
  const tuningRiskPreview =
    artifact.tuningRisks.length === 0 ? ["none"] : artifact.tuningRisks.slice(0, 8);

  return (
    <section
      className="m6-balance"
      aria-label="M6 balance dashboard"
      data-schema-version={artifact.schemaVersion}
      data-run-count={artifact.aggregate.runCount}
      data-scenario-count={artifact.aggregate.scenarioCount}
      data-seed-count={artifact.aggregate.seedCount}
      data-artifact-hash={artifact.artifactHash}
    >
      <div className="m6-balance__header">
        <div>
          <h2>M6 balance dashboard</h2>
          <p>
            {artifact.kind}; {artifact.generatedAt}; {artifact.generator}
          </p>
        </div>
        <dl className="m6-balance__summary">
          <Metric label="Runs" value={artifact.aggregate.runCount.toString()} />
          <Metric label="Scenarios" value={artifact.aggregate.scenarioCount.toString()} />
          <Metric label="Seeds" value={artifact.aggregate.seedCount.toString()} />
          <Metric label="Hash" value={artifact.artifactHash} />
        </dl>
      </div>

      <div className="m6-balance__grid">
        <section className="m6-balance__panel" aria-label="M6 balance aggregate trends">
          <h3>Aggregate trends</h3>
          <dl className="m6-balance__metrics">
            <Metric label="Victory" value={artifact.aggregate.victoryCount.toString()} />
            <Metric label="Continued" value={artifact.aggregate.continuedPlayCount.toString()} />
            <Metric label="Defeat" value={artifact.aggregate.defeatCount.toString()} />
            <Metric label="Rejected" value={artifact.aggregate.commandRejectedCount.toString()} />
            <Metric
              label="No rescue"
              value={artifact.aggregate.noRescueCompletionCount.toString()}
            />
            <Metric
              label="Economy"
              value={artifact.aggregate.averageEconomyPressureScore.toString()}
            />
            <Metric
              label="War/postwar"
              value={artifact.aggregate.averageWarPostwarLossScore.toString()}
            />
            <Metric label="P0/P1" value={artifact.aggregate.p0p1CandidateCount.toString()} />
          </dl>
        </section>

        <section className="m6-balance__panel" aria-label="M6 balance risk candidates">
          <h3>P0/P1 candidates and tuning risks</h3>
          <div className="m6-balance__fact">
            <strong>P0/P1 candidates</strong>
            <span>{p0p1Label}</span>
          </div>
          <div className="m6-balance__stack" role="list">
            {tuningRiskPreview.map((risk) => (
              <div className="m6-balance__fact" key={risk} role="listitem">
                <strong>{risk}</strong>
                <span>Evidence only; no automatic tuning is applied.</span>
              </div>
            ))}
          </div>
        </section>

        <section className="m6-balance__panel" aria-label="M6 batch run evidence">
          <h3>Run evidence</h3>
          <div className="m6-balance__stack" role="list">
            {artifact.runs.slice(0, 8).map((run) => (
              <div
                className="m6-balance__fact"
                key={run.runId}
                role="listitem"
                data-run-id={run.runId}
                data-terminal-outcome={run.terminalOutcome}
                data-economy-pressure={run.metrics.economyPressureScore}
                data-war-postwar-loss={run.metrics.warPostwarLossScore}
              >
                <strong>{run.label}</strong>
                <span>
                  seed {run.seed}; {run.terminalOutcome}; commands {run.commandCount}; hash{" "}
                  {run.finalHash}
                </span>
                <span>
                  recognition {run.evidence.recognizedByCount}; succession{" "}
                  {run.evidence.successionResolvedCount}; postwar{" "}
                  {run.evidence.postwarArrangementCount}
                </span>
                {run.rejectionCode === null ? null : (
                  <span>
                    rejected {run.rejectedCommandId ?? "unknown"}; {run.rejectionCode}
                  </span>
                )}
                <ReasonChips
                  reasonCodes={[...run.tuningRisks, ...run.p0p1Candidates, `plan:${run.plan}`]}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function M6StepPreview({
  step
}: {
  readonly step: ClientM6AlphaStepReadModel | null;
}): ReactElement {
  if (step === null) {
    return (
      <div
        className="m6-alpha__fact"
        aria-label="M6 command preview"
        data-result-status="unavailable"
        data-step-stage="none"
      >
        <strong>No Alpha command selected</strong>
        <span>Select a scenario and start the Alpha flow.</span>
      </div>
    );
  }

  return (
    <div
      className="m6-alpha__fact"
      aria-label="M6 command preview"
      data-command-kind={step.command.kind}
      data-result-status={step.result.status}
      data-step-stage={step.stage}
    >
      <strong>{step.label}</strong>
      <span>
        Stage {step.stage}; result {step.result.status}
      </span>
      <span>
        {step.preview.commandKind}; {step.preview.commandId}; {step.actorLabel}
      </span>
      <span>{step.result.summary}</span>
      <ReasonChips reasonCodes={[...step.reasonCodes, ...step.encyclopediaRefs]} />
    </div>
  );
}

function M6DiplomacyLegitimacyPanel({
  diplomacy,
  legitimacy,
  succession
}: {
  readonly diplomacy: ClientM6DiplomacyReadModel;
  readonly legitimacy: ClientM6LegitimacyReadModel;
  readonly succession: ClientM6SuccessionReadModel;
}): ReactElement {
  return (
    <section className="m6-alpha__panel" aria-label="M6 diplomacy legitimacy succession surfaces">
      <h3>Diplomacy / legitimacy / succession</h3>
      <dl className="m6-alpha__metrics">
        <Metric label="Relations" value={diplomacy.relations.length.toString()} />
        <Metric label="Recognition" value={diplomacy.recognitionEdges.length.toString()} />
        <Metric label="Legitimacy" value={formatBps(legitimacy.scoreBps)} />
        <Metric label="Succession" value={succession.status} />
      </dl>
      <div className="m6-alpha__stack" role="list">
        {diplomacy.agreements.map((agreement) => (
          <div className="m6-alpha__fact" key={agreement.agreementId} role="listitem">
            <strong>{agreement.agreementKind}</strong>
            <span>
              {agreement.status}; relation {agreement.relationId}; {agreement.recognitionDirection}
            </span>
            <ReasonChips reasonCodes={agreement.reasonCodes} />
          </div>
        ))}
        {legitimacy.sources.map((source) => (
          <div className="m6-alpha__fact" key={source.sourceId} role="listitem">
            <strong>{source.sourceKind}</strong>
            <span>
              {formatBps(source.magnitudeBps)}; {source.sourceRef}
            </span>
            <ReasonChips reasonCodes={[source.reasonCode]} />
          </div>
        ))}
        <div className="m6-alpha__fact" role="listitem">
          <strong>Succession continuity</strong>
          <span>
            crises {succession.crisisCount}; resolved {succession.resolvedCount}; candidates{" "}
            {succession.candidateCount}
          </span>
          <ReasonChips reasonCodes={succession.continuityReasonCodes} />
        </div>
      </div>
    </section>
  );
}

function M6PolicyEventPanel({
  policies,
  encyclopedia
}: {
  readonly policies: ClientM6PolicyEventReadModel;
  readonly encyclopedia: ClientM6EncyclopediaReadModel;
}): ReactElement {
  return (
    <section className="m6-alpha__panel" aria-label="M6 policy event encyclopedia surfaces">
      <h3>Policies / events / encyclopedia</h3>
      <div className="m6-alpha__stack" role="list">
        {policies.activeEvents.map((event) => (
          <div className="m6-alpha__fact" key={event.eventInstanceId} role="listitem">
            <strong>{event.title}</strong>
            <span>{event.options.length} options</span>
            <ul className="m6-alpha__option-list" aria-label={`${event.title} choices`}>
              {event.options.map((option) => (
                <li key={option.optionId}>
                  <strong>{option.label}</strong>
                  <span>Option {option.optionId}</span>
                  <ReasonChips
                    reasonCodes={[...option.reasonCodes, ...option.consequenceReasonCodes]}
                  />
                </li>
              ))}
            </ul>
            <ReasonChips
              reasonCodes={[
                ...event.causeReasonCodes,
                ...event.options.flatMap((option) => [
                  ...option.reasonCodes,
                  ...option.consequenceReasonCodes
                ]),
                ...event.encyclopediaRefs
              ]}
            />
          </div>
        ))}
        {policies.resolvedEvents.map((event) => (
          <div className="m6-alpha__fact" key={`resolved:${event.eventInstanceId}`} role="listitem">
            <strong>Resolved policy event {event.eventInstanceId}</strong>
            <span>
              selected option {event.selectedOptionId}; resolved day {event.resolvedDay}
            </span>
            <ReasonChips reasonCodes={[...event.reasonCodes, ...event.encyclopediaRefs]} />
          </div>
        ))}
        {policies.modifiers.map((modifier) => (
          <div className="m6-alpha__fact" key={modifier.modifierId} role="listitem">
            <strong>Policy {modifier.policyId}</strong>
            <span>
              {formatBps(modifier.magnitudeBps)} day {modifier.startDay}-{modifier.endDay}
            </span>
            <ReasonChips reasonCodes={[modifier.reasonCode]} />
          </div>
        ))}
        {encyclopedia.entries.map((entry) => (
          <div
            className="m6-alpha__fact"
            key={entry.entryId}
            data-entry-id={entry.entryId}
            data-content-tag={entry.contentTag}
            role="listitem"
          >
            <strong>{entry.title}</strong>
            <span>Content tag {entry.contentTag}</span>
            <span>{entry.summary}</span>
            <ReasonChips reasonCodes={entry.linkedReasonCodes} />
          </div>
        ))}
      </div>
    </section>
  );
}

function M6AdviserPanel({ adviser }: { readonly adviser: ClientM6AdviserReadModel }): ReactElement {
  return (
    <section className="m6-alpha__panel" aria-label="M6 AI adviser reasons">
      <h3>AI / adviser reasons</h3>
      <div className="m6-alpha__fact">
        <ReasonCodeText reasonCode={adviser.primaryReasonCode} />
        <span>{adviser.commandKind ?? "no command"}</span>
        <ReasonChips reasonCodes={adviser.reasonCodes} />
      </div>
      <div className="m6-alpha__stack" role="list">
        {adviser.candidates.map((candidate) => (
          <div className="m6-alpha__fact" key={candidate.candidateId} role="listitem">
            <strong>{candidate.candidateId}</strong>
            <span>
              {candidate.decisionKind}; score {candidate.score};{" "}
              {candidate.commandKind ?? "no command"}
            </span>
            <ReasonChips reasonCodes={candidate.reasonCodes} />
          </div>
        ))}
      </div>
    </section>
  );
}

function M6MapCandidatePanel({
  mapCandidate
}: {
  readonly mapCandidate: ClientM6MapCandidateReadModel;
}): ReactElement {
  return (
    <section className="m6-alpha__panel" aria-label="M6 map candidate display">
      <h3>Map candidate</h3>
      <dl className="m6-alpha__metrics">
        <Metric label="Districts" value={mapCandidate.districtCount.toString()} />
        <Metric label="Settlements" value={mapCandidate.settlementCount.toString()} />
        <Metric label="Routes" value={mapCandidate.routeCount.toString()} />
        <Metric label="Source" value={mapCandidate.sourceLabel} />
      </dl>
      <div className="m6-alpha__fact" data-map-candidate-id={mapCandidate.candidateSourceId}>
        <strong>{mapCandidate.displayName}</strong>
        <span>{mapCandidate.candidateSourceId}</span>
        <span>Selected districts {mapCandidate.selectedDistrictIds.join(", ")}</span>
        <ReasonChips reasonCodes={mapCandidate.reasonCodes} />
      </div>
    </section>
  );
}

function M6TerminalPanel({
  terminal,
  goal,
  replay
}: {
  readonly terminal: ClientM6TerminalReadModel;
  readonly goal: ClientM6AlphaReadModelSnapshot["goal"];
  readonly replay: ClientM6AlphaReadModelSnapshot["replay"];
}): ReactElement {
  return (
    <section className="m6-alpha__panel" aria-label="M6 victory failure status">
      <h3>Victory / failure status</h3>
      <dl className="m6-alpha__metrics">
        <Metric label="Outcome" value={terminal.outcome} />
        <Metric label="Recognized by" value={terminal.evidence.recognizedByCount.toString()} />
        <Metric label="Legitimacy" value={formatBps(terminal.evidence.legitimacyScoreBps)} />
        <Metric label="Checkpoint" value={replay.midRunCheckpointLabel} />
      </dl>
      <ReasonChips reasonCodes={terminal.reasonCodes} />
      <div className="m6-alpha__stack" role="list">
        {goal.victoryRequirements.map((condition) => (
          <div className="m6-alpha__fact" key={condition} role="listitem">
            <strong>Victory</strong>
            <span>{condition}</span>
          </div>
        ))}
        {goal.failureConditions.map((condition) => (
          <div className="m6-alpha__fact" key={condition} role="listitem">
            <strong>Failure</strong>
            <span>{condition}</span>
          </div>
        ))}
        {goal.excludedSurfaces.map((item) => (
          <div className="m6-alpha__fact" key={item} role="listitem">
            <strong>Excluded</strong>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function M6ReasonSummaryPanel({
  summaries
}: {
  readonly summaries: readonly ClientM6ReasonSummaryReadModel[];
}): ReactElement {
  return (
    <section className="m6-alpha__panel" aria-label="M6 reason summaries">
      <h3>Reason summaries</h3>
      <div className="m6-alpha__stack" role="list">
        {summaries.slice(0, 14).map((summary) => (
          <div className="m6-alpha__fact" key={summary.reasonCode} role="listitem">
            <ReasonCodeText reasonCode={summary.reasonCode} />
            <span>
              {summary.count} / {summary.sourceKinds.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

interface OfficeDetailProps {
  readonly office: ClientM3OfficeReadModel | null;
  readonly selectedCharacter: ClientM3CharacterReadModel | null;
}

function OfficePlayerDetail({ office, selectedCharacter }: OfficeDetailProps): ReactElement {
  const i18n = useContext(ClientI18nContext);
  if (office === null) {
    return (
      <div className="m3-flow__empty">
        <p>{i18n.t("appointment.office.empty")}</p>
      </div>
    );
  }

  return (
    <div className="m3-flow__fact">
      <strong>{office.displayName}</strong>
      <dl className="m3-flow__metrics">
        <Metric
          label={i18n.t("appointment.office.kind")}
          value={formatM3OfficeKind(office.officeKind, i18n)}
        />
        <Metric
          label={i18n.t("appointment.office.holder")}
          value={formatNullableCharacterPlayer(office.holderCharacterId, i18n)}
        />
        <Metric
          label={i18n.t("appointment.office.policy")}
          value={i18n.t("appointment.office.policyValue", {
            stance: formatReasonStatus(office.policy.stance, i18n),
            continuity: i18n.t("appointment.policy.continuity")
          })}
        />
        <Metric
          label={i18n.t("appointment.office.performance")}
          value={formatBps(office.executionPerformanceBps)}
        />
        <Metric
          label={i18n.t("appointment.office.selectedCandidate")}
          value={selectedCharacter?.displayName ?? i18n.t("appointment.candidate.none")}
        />
      </dl>
      <ReasonChips reasonCodes={[...office.reasonCodes, ...office.policy.reasonCodes]} />
    </div>
  );
}

function AppointmentImpactPreview({
  office,
  selectedEligibility
}: {
  readonly office: ClientM3OfficeReadModel | null;
  readonly selectedEligibility: ClientM3AppointmentEligibilityReadModel | null;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  if (office === null || selectedEligibility === null) {
    return (
      <div className="m3-flow__empty">
        <p>{i18n.t("appointment.preview.empty")}</p>
      </div>
    );
  }

  return (
    <div className="m3-flow__fact" data-status={selectedEligibility.status}>
      <strong>
        {selectedEligibility.status === "eligible"
          ? i18n.t("appointment.preview.eligibleTitle")
          : i18n.t("appointment.preview.rejectedTitle")}
      </strong>
      <span>{formatM3EligibilityStatus(selectedEligibility.status, i18n)}</span>
      {office.administrativePreview === null ? (
        <span>{i18n.t("appointment.preview.noAdministrativePreview")}</span>
      ) : (
        <dl className="m3-flow__metrics">
          <Metric
            label={i18n.t("appointment.preview.load")}
            value={i18n.formatNumber(office.administrativePreview.administrativeLoad)}
          />
          <Metric
            label={i18n.t("appointment.preview.efficiency")}
            value={formatBps(office.administrativePreview.efficiencyBps)}
          />
          <Metric
            label={i18n.t("appointment.preview.reliability")}
            value={formatBps(office.administrativePreview.obligationReliabilityBps)}
          />
          <Metric
            label={i18n.t("appointment.preview.readiness")}
            value={formatBps(office.administrativePreview.readinessBps)}
          />
        </dl>
      )}
      <ReasonChips
        reasonCodes={[
          ...selectedEligibility.reasonCodes,
          ...(office.administrativePreview?.reasonCodes ?? [])
        ]}
      />
    </div>
  );
}

function AppointmentResultFeedback({
  commandStatus,
  flowStage,
  selectedEligibility
}: {
  readonly commandStatus: string | null;
  readonly flowStage: M3AppointmentFlowStage;
  readonly selectedEligibility: ClientM3AppointmentEligibilityReadModel | null;
}): ReactElement {
  const i18n = useContext(ClientI18nContext);
  const status =
    commandStatus ??
    (selectedEligibility?.status === "rejected"
      ? i18n.t("appointment.result.rejected")
      : i18n.t("appointment.result.waiting"));
  return (
    <output
      className="m3-flow__result"
      aria-label={i18n.t("appointment.result.label")}
      data-result-stage={flowStage}
      role="status"
    >
      <strong>
        {flowStage === "result"
          ? i18n.t("appointment.result.submitted")
          : i18n.t("appointment.result.pending")}
      </strong>
      <span>{status}</span>
      <span>{i18n.t("appointment.result.commandParity")}</span>
    </output>
  );
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
  const i18n = useContext(ClientI18nContext);
  return (
    <span className="m3-appointment__reasons" role="list" aria-label={i18n.t("reason.listLabel")}>
      {reasonCodes.map((reasonCode, index) => (
        <span className="m3-appointment__reason" key={`${reasonCode}:${index}`} role="listitem">
          {i18n.formatReasonCode(reasonCode)}
        </span>
      ))}
    </span>
  );
}

function ReasonCodeText({ reasonCode }: { readonly reasonCode: string }): ReactElement {
  const i18n = useContext(ClientI18nContext);
  return <strong>{i18n.formatReasonCode(reasonCode)}</strong>;
}

function RawReasonCodeList({
  label,
  reasonCodes
}: {
  readonly label: string;
  readonly reasonCodes: readonly string[];
}): ReactElement {
  return (
    <details className="m3-appointment__raw-reasons">
      <summary>{label}</summary>
      <code>{reasonCodes.join("\n")}</code>
    </details>
  );
}

function formatReasonStatus(status: string, i18n: ClientI18n): string {
  const separatorIndex = status.indexOf(":");
  if (separatorIndex < 0) {
    return i18n.formatReasonCode(status);
  }
  const reasonCode = status.slice(0, separatorIndex);
  const detail = status.slice(separatorIndex + 1);
  return `${i18n.formatReasonCode(reasonCode)}: ${detail}`;
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

function formatBoolean(value: boolean): string {
  return value ? "yes" : "no";
}

function formatM3EligibilityStatus(
  status: ClientM3AppointmentEligibilityReadModel["status"],
  i18n: ClientI18n
): string {
  switch (status) {
    case "eligible":
      return i18n.t("appointment.status.eligible");
    case "rejected":
      return i18n.t("appointment.status.rejected");
  }
}

function formatM3OfficeKind(kind: ClientM3OfficeReadModel["officeKind"], i18n: ClientI18n): string {
  switch (kind) {
    case "minister":
      return i18n.t("appointment.office.kind.minister");
    case "governor":
      return i18n.t("appointment.office.kind.governor");
    case "commander":
      return i18n.t("appointment.office.kind.commander");
  }
}

function formatNullableCharacter(characterId: number | null): string {
  return characterId === null ? "Vacant" : `Character ${characterId}`;
}

function formatNullableCharacterPlayer(characterId: number | null, i18n: ClientI18n): string {
  if (characterId === null) {
    return i18n.t("appointment.office.vacant");
  }
  return i18n.t("appointment.office.held");
}

function formatM4Window(window: {
  readonly earliestDay: number;
  readonly latestDay: number;
}): string {
  return `day ${window.earliestDay}-${window.latestDay}`;
}

function parseM4SiegeChoice(value: string): ClientM4SiegeChoice {
  switch (value) {
    case "invest-blockade":
    case "assault":
    case "continue":
    case "accept-surrender":
    case "lift-siege":
    case "withdraw":
      return value;
    default:
      throw new Error(`Unsupported M4 siege choice ${value}.`);
  }
}

function parseDistrictRouteStatusFilter(value: string): DistrictRouteStatusFilter {
  switch (value) {
    case "all":
    case "reachable":
    case "capacity-exceeded":
    case "unreachable":
      return value;
    default:
      return "all";
  }
}

function formatPlayerDistrictName(row: ClientDistrictRowReadModel, i18n: ClientI18n): string {
  return i18n.t("shell.district.name", {
    number: i18n.formatNumber(Number(row.districtId))
  });
}

function formatPlayerSettlementName(i18n: ClientI18n): string {
  return i18n.t("shell.settlement.name");
}

function formatSeasonLabel(phase: string, i18n: ClientI18n): string {
  switch (phase) {
    case "fallow":
      return i18n.t("shell.season.fallow");
    case "planting":
      return i18n.t("shell.season.planting");
    case "growing":
      return i18n.t("shell.season.growing");
    case "harvest":
      return i18n.t("shell.season.harvest");
    default:
      return phase;
  }
}

function formatRouteStatusLabel(
  status: ClientDistrictRowReadModel["route"]["status"],
  i18n: ClientI18n
): string {
  switch (status) {
    case "reachable":
      return i18n.t("shell.route.reachable");
    case "capacity-exceeded":
      return i18n.t("shell.route.capacityExceeded");
    case "unreachable":
      return i18n.t("shell.route.unreachable");
  }
}

function formatDistrictRouteKind(
  kind: ClientDistrictRowReadModel["route"]["routeKinds"][number],
  i18n: ClientI18n
): string {
  switch (kind) {
    case "road":
      return i18n.t("shell.routeKind.road");
    case "river":
      return i18n.t("shell.routeKind.river");
    case "coast":
      return i18n.t("shell.routeKind.coast");
  }
}

function formatDistrictRouteKinds(
  kinds: readonly ClientDistrictRowReadModel["route"]["routeKinds"][number][],
  i18n: ClientI18n
): string {
  return kinds.map((kind) => formatDistrictRouteKind(kind, i18n)).join("/");
}

function formatDistrictObligationKind(
  kind: ClientM3ObligationReadModel["obligationKind"],
  i18n: ClientI18n
): string {
  switch (kind) {
    case "tribute":
      return i18n.t("shell.obligationKind.tribute");
    case "troop":
      return i18n.t("shell.obligationKind.troop");
    case "garrison":
      return i18n.t("shell.obligationKind.garrison");
  }
}

function formatDistrictObligationDueLabel(dueLabel: string, i18n: ClientI18n): string {
  if (dueLabel === "continuous") {
    return i18n.t("shell.inspector.dueContinuous");
  }
  if (dueLabel === "war trigger") {
    return i18n.t("shell.inspector.dueWarTrigger");
  }
  const dayCadence = /^([0-9]+) day cadence$/u.exec(dueLabel);
  if (dayCadence !== null) {
    return i18n.t("shell.inspector.dueDayCadence", {
      days: i18n.formatNumber(Number(dayCadence[1]))
    });
  }
  return i18n.formatReasonCode(dueLabel);
}

function formatDistrictTravelDays(days: number, i18n: ClientI18n): string {
  return i18n.t("shell.inspector.travelDays", { days: i18n.formatNumber(days) });
}

function formatPlayerRouteSummary(row: ClientDistrictRowReadModel, i18n: ClientI18n): string {
  const status = formatRouteStatusLabel(row.route.status, i18n);
  if (row.route.totalCost === null || row.route.bottleneckCapacity === null) {
    return i18n.t("shell.route.summaryUnreachable", { status });
  }
  return i18n.t("shell.route.summaryReachable", {
    status,
    kinds: formatDistrictRouteKinds(row.route.routeKinds, i18n),
    cost: i18n.formatNumber(row.route.totalCost),
    capacity: i18n.formatNumber(row.route.bottleneckCapacity)
  });
}

function clampZoomLevel(value: number): number {
  return Math.min(2, Math.max(0.75, value));
}

function clampMapPanOffset(value: number): number {
  return Math.min(MAP_PAN_LIMIT_IN_MAP_UNITS, Math.max(-MAP_PAN_LIMIT_IN_MAP_UNITS, value));
}

function formatPlayerMapSelection(
  selectedDistrict: ClientDistrictRowReadModel | null,
  selectedSettlement: ClientMapSettlementReadModel | null,
  i18n: ClientI18n
): string {
  if (selectedDistrict === null) {
    return i18n.t("map.selection.empty");
  }
  if (selectedSettlement !== null) {
    return `${formatPlayerSettlementName(i18n)} / ${formatPlayerDistrictName(
      selectedDistrict,
      i18n
    )}`;
  }
  return formatPlayerDistrictName(selectedDistrict, i18n);
}

function formatPlayerMapHover(
  hoveredDistrict: ClientDistrictRowReadModel | null,
  hoveredSettlement: ClientMapSettlementReadModel | null,
  i18n: ClientI18n
): string {
  if (hoveredDistrict === null) {
    return i18n.t("shell.mapHover.empty");
  }
  if (hoveredSettlement !== null) {
    return i18n.t("shell.mapHover.settlement", {
      settlement: formatPlayerSettlementName(i18n),
      district: formatPlayerDistrictName(hoveredDistrict, i18n)
    });
  }
  return i18n.t("shell.mapHover.district", {
    district: formatPlayerDistrictName(hoveredDistrict, i18n),
    route: formatPlayerRouteSummary(hoveredDistrict, i18n)
  });
}

function getHighResolutionTime(): number {
  const timer = globalThis.performance;
  if (timer === undefined) {
    return 0;
  }

  return timer.now();
}

const M4_SIEGE_CHOICES: readonly ClientM4SiegeChoice[] = [
  "invest-blockade",
  "assault",
  "continue",
  "accept-surrender",
  "lift-siege",
  "withdraw"
];

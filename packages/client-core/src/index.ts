import {
  GAME_COMMAND_SCHEMA_VERSION,
  HELLO_SIMULATION_PROTOCOL_VERSION,
  createM6AlphaStartToVictoryScriptV1,
  createM5PlayableLoopScriptV1,
  type ApplyM4SiegeChoiceCommandV1,
  type AuthoritativeGameCommandV1,
  type BulkAppointOfficesCommandV1,
  type CancelCampaignObjectiveCommandV1,
  type CreateCampaignObjectiveCommandV1,
  type GameCommandV1,
  type HelloSimulationResultDto,
  type ListM2EconomySummariesResultV1,
  type ListM3AdministrativeBurdenResultV1,
  type ListM3DecisionScaffoldsResultV1,
  type ListM3SuccessionCrisesResultV1,
  type M2TransportRouteKindV1,
  type M3PostwarGovernanceMethodV1,
  type M4CampaignAiDecisionTraceV1,
  type M4CampaignObjectiveKindV1,
  type M4CampaignOwnerV1,
  type M4CampaignTargetV1,
  type M4SiegeChoiceV1,
  type M4WithdrawalTriggerV1,
  type M6AlphaTerminalOutcomeV1,
  type M5PlayableLoopScriptV1,
  type M6AlphaStartToVictoryScriptV1,
  type PreviewM2TransportRouteResultV1,
  type PreviewM3PostwarGovernanceResultV1,
  type ResolveM4CampaignWithdrawalCommandV1,
  type StartCampaignMarchCommandV1
} from "@monsoon/protocol";

import { M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE } from "./m7-beta-audio-art-localization-content";
import { M7_BETA_GUIDANCE_SOURCE } from "./m7-beta-guidance-content";

export const CLIENT_READ_MODEL_PROTOCOL_VERSION = 1;

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type ClientReadModelRevision = Brand<number, "ClientReadModelRevision">;
export type ClientMapAnchorId = Brand<string, "ClientMapAnchorId">;
export type ClientDistrictId = Brand<number, "ClientDistrictId">;
export type ClientSettlementId = Brand<number, "ClientSettlementId">;
export type ClientCharacterId = Brand<number, "ClientCharacterId">;
export type ClientOfficeId = Brand<number, "ClientOfficeId">;
export type ClientPolicyId = Brand<number, "ClientPolicyId">;
export type ClientPolityId = Brand<number, "ClientPolityId">;
export type ClientCampaignPlanId = Brand<number, "ClientCampaignPlanId">;
export type ClientCampaignMarchId = Brand<number, "ClientCampaignMarchId">;
export type ClientSiegeId = Brand<number, "ClientSiegeId">;
export type ClientWithdrawalId = Brand<number, "ClientWithdrawalId">;
export type ClientWarOutcomeId = Brand<number, "ClientWarOutcomeId">;

export type ClientReadModelStatus = "booting" | "ready";

export interface ClientReadModelSnapshot {
  readonly protocolVersion: typeof CLIENT_READ_MODEL_PROTOCOL_VERSION;
  readonly revision: ClientReadModelRevision;
  readonly status: ClientReadModelStatus;
  readonly simulation: HelloSimulationSummaryReadModel;
  readonly map: ClientMapReadModelSnapshot;
  readonly panels: ClientPanelReadModelSnapshot;
  readonly districtList: ClientDistrictListReadModelSnapshot;
  readonly m3Appointment: ClientM3AppointmentReadModelSnapshot;
  readonly m4Campaign: ClientM4CampaignReadModelSnapshot;
  readonly m5Playable: ClientM5PlayableReadModelSnapshot;
  readonly m6Alpha: ClientM6AlphaReadModelSnapshot;
  readonly m7Guidance: ClientM7GuidanceReadModelSnapshot;
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

export type ClientMapMode = "situation" | "seasonal" | "economy" | "routes";

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

export interface ClientM3AppointmentReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly day: number;
  readonly commandActor: ClientM3CommandActorReadModel;
  readonly provenance: ClientM3AppointmentProvenanceReadModel;
  readonly characters: readonly ClientM3CharacterReadModel[];
  readonly polities: readonly ClientM3PolityReadModel[];
  readonly offices: readonly ClientM3OfficeReadModel[];
  readonly obligations: readonly ClientM3ObligationReadModel[];
  readonly successionCrises: readonly ClientM3SuccessionCrisisReadModel[];
  readonly appointmentResults: readonly ClientM3AppointmentResultReadModel[];
  readonly enfeoffmentResults: readonly ClientM3EnfeoffmentResultReadModel[];
  readonly bulkPreview: ClientM3BulkAppointmentPreviewReadModel;
  readonly reasonSummaries: readonly ClientM3ReasonSummaryReadModel[];
}

export interface ClientM3CommandActorReadModel {
  readonly kind: "player";
  readonly id: string;
}

export interface ClientM3AppointmentProvenanceReadModel {
  readonly kind: "protocol-query-projection";
  readonly note: string;
}

export interface ClientM3CharacterReadModel {
  readonly characterId: ClientCharacterId;
  readonly displayName: string;
  readonly polityId: ClientPolityId;
  readonly availability: "available" | "unavailable";
  readonly roleLabel: string;
  readonly behaviorReasonCodes: readonly string[];
}

export interface ClientM3PolityReadModel {
  readonly polityId: ClientPolityId;
  readonly displayName: string;
  readonly relationKind: "court" | "vassal" | "tributary";
  readonly suzerainPolityId: ClientPolityId | null;
  readonly reasonCodes: readonly string[];
}

export interface ClientM3OfficeReadModel {
  readonly officeId: ClientOfficeId;
  readonly displayName: string;
  readonly officeKind: "minister" | "governor" | "commander";
  readonly holderCharacterId: ClientCharacterId | null;
  readonly policy: ClientM3OfficePolicyReadModel;
  readonly executionPerformanceBps: number;
  readonly administrativePreview: ClientM3AdministrativePreviewReadModel | null;
  readonly candidateEligibilities: readonly ClientM3AppointmentEligibilityReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM3OfficePolicyReadModel {
  readonly policyId: ClientPolicyId;
  readonly stance: string;
  readonly continuity: "persists-across-holder-change";
  readonly reasonCodes: readonly string[];
}

export interface ClientM3AdministrativePreviewReadModel {
  readonly districtId: ClientDistrictId;
  readonly controlMode: string;
  readonly administrativeLoad: number;
  readonly overload: number;
  readonly efficiencyBps: number;
  readonly obligationReliabilityBps: number;
  readonly readinessBps: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM3AppointmentEligibilityReadModel {
  readonly officeId: ClientOfficeId;
  readonly characterId: ClientCharacterId;
  readonly status: "eligible" | "rejected";
  readonly reasonCodes: readonly string[];
}

export interface ClientM3ObligationReadModel {
  readonly obligationId: string;
  readonly debtorPolityId: ClientPolityId;
  readonly creditorPolityId: ClientPolityId;
  readonly obligationKind: "tribute" | "troop" | "garrison";
  readonly amount: number;
  readonly dueLabel: string;
  readonly status: "preview" | "pending" | "breached";
  readonly reasonCodes: readonly string[];
}

export interface ClientM3SuccessionCrisisReadModel {
  readonly successionId: number;
  readonly polityId: ClientPolityId;
  readonly status: "pending" | "resolved";
  readonly vacancyOfficeIds: readonly ClientOfficeId[];
  readonly candidates: readonly ClientM3SuccessionCandidateReadModel[];
}

export interface ClientM3SuccessionCandidateReadModel {
  readonly characterId: ClientCharacterId;
  readonly requiresRegency: boolean;
  readonly supportTotalBps: number;
  readonly supportReasonCodes: readonly string[];
}

export interface ClientM3AppointmentResultReadModel {
  readonly officeId: ClientOfficeId;
  readonly holderCharacterId: ClientCharacterId | null;
  readonly status: "vacant" | "appointed";
  readonly reasonCodes: readonly string[];
}

export interface ClientM3EnfeoffmentResultReadModel {
  readonly districtId: ClientDistrictId;
  readonly holderCharacterId: ClientCharacterId;
  readonly status: "granted";
  readonly reasonCodes: readonly string[];
}

export interface ClientM3BulkAppointmentPreviewReadModel {
  readonly commandKind: BulkAppointOfficesCommandV1["kind"];
  readonly applyMode: "apply-eligible-only";
  readonly eligibleCount: number;
  readonly rejectedCount: number;
  readonly items: readonly ClientM3BulkAppointmentPreviewItemReadModel[];
}

export interface ClientM3BulkAppointmentPreviewItemReadModel {
  readonly itemId: string;
  readonly officeId: ClientOfficeId;
  readonly characterId: ClientCharacterId | null;
  readonly status: "eligible" | "rejected";
  readonly reasonCodes: readonly string[];
}

export interface ClientM3ReasonSummaryReadModel {
  readonly reasonCode: string;
  readonly count: number;
  readonly sourceKinds: readonly ClientM3ReasonSourceKind[];
}

export type ClientM3ReasonSourceKind =
  | "appointment"
  | "behavior"
  | "bulk"
  | "enfeoffment"
  | "obligation"
  | "policy"
  | "succession";

export interface ClientM3AppointmentProjectionInput {
  readonly decisionScaffolds: ListM3DecisionScaffoldsResultV1;
  readonly administrativeBurden: ListM3AdministrativeBurdenResultV1;
  readonly successionCrises: ListM3SuccessionCrisesResultV1;
  readonly postwarGovernancePreview: PreviewM3PostwarGovernanceResultV1;
  readonly catalog: ClientM3AppointmentCatalogInput;
}

export interface ClientM3AppointmentCatalogInput {
  readonly commandActor: ClientM3CommandActorReadModel;
  readonly characters: readonly ClientM3CharacterCatalogRow[];
  readonly polities: readonly ClientM3PolityCatalogRow[];
  readonly offices: readonly ClientM3OfficeCatalogRow[];
  readonly eligibility: readonly ClientM3AppointmentEligibilityCatalogRow[];
  readonly bulkItems: readonly ClientM3BulkAppointmentCatalogRow[];
}

export interface ClientM3CharacterCatalogRow {
  readonly characterId: number;
  readonly displayName: string;
  readonly polityId: number;
  readonly availability: ClientM3CharacterReadModel["availability"];
  readonly roleLabel: string;
  readonly behaviorReasonCodes: readonly string[];
}

export interface ClientM3PolityCatalogRow {
  readonly polityId: number;
  readonly displayName: string;
  readonly relationKind: ClientM3PolityReadModel["relationKind"];
  readonly suzerainPolityId: number | null;
  readonly reasonCodes: readonly string[];
}

export interface ClientM3OfficeCatalogRow {
  readonly officeId: number;
  readonly displayName: string;
  readonly officeKind: ClientM3OfficeReadModel["officeKind"];
  readonly administrativeDistrictId: number | null;
  readonly policyStance: string;
  readonly policyReasonCodes: readonly string[];
}

export interface ClientM3AppointmentEligibilityCatalogRow {
  readonly officeId: number;
  readonly characterId: number;
  readonly status: ClientM3AppointmentEligibilityReadModel["status"];
  readonly reasonCodes: readonly string[];
}

export interface ClientM3BulkAppointmentCatalogRow {
  readonly itemId: string;
  readonly officeId: number;
  readonly characterId: number | null;
  readonly status: ClientM3BulkAppointmentPreviewItemReadModel["status"];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4CampaignReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly day: number;
  readonly commandActor: ClientM3CommandActorReadModel;
  readonly provenance: ClientM4CampaignProvenanceReadModel;
  readonly selectedCampaignPlanId: ClientCampaignPlanId | null;
  readonly commandDefaults: ClientM4CampaignCommandDefaultsReadModel;
  readonly planningDraft: ClientM4CampaignPlanningDraftReadModel;
  readonly plans: readonly ClientM4CampaignPlanReadModel[];
  readonly muster: ClientM4MusterReadModel;
  readonly grain: ClientM4GrainSupplyReadModel;
  readonly route: ClientM4RouteForecastReadModel;
  readonly marches: readonly ClientM4MarchReadModel[];
  readonly sieges: readonly ClientM4SiegeReadModel[];
  readonly withdrawals: readonly ClientM4WithdrawalReadModel[];
  readonly aiReason: ClientM4AiReasonReadModel;
  readonly warReports: readonly ClientM4WarReportReadModel[];
  readonly reasonSummaries: readonly ClientM4ReasonSummaryReadModel[];
}

export interface ClientM4CampaignProvenanceReadModel {
  readonly kind: "protocol-query-projection";
  readonly note: string;
}

export interface ClientM4CampaignCommandDefaultsReadModel {
  readonly nextCampaignPlanId: ClientCampaignPlanId;
  readonly nextMarchId: ClientCampaignMarchId;
  readonly nextWithdrawalId: ClientWithdrawalId;
  readonly originDistrictId: ClientDistrictId;
  readonly grainPerTroopPerDay: number;
  readonly withdrawalTrigger: M4WithdrawalTriggerV1;
}

export interface ClientM4CampaignPlanningDraftReadModel {
  readonly owner: M4CampaignOwnerV1;
  readonly ownerLabel: string;
  readonly target: M4CampaignTargetV1;
  readonly targetLabel: string;
  readonly objectiveKind: M4CampaignObjectiveKindV1;
  readonly startWindow: ClientM4StartWindowReadModel;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4StartWindowReadModel {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface ClientM4CampaignPlanReadModel {
  readonly campaignPlanId: ClientCampaignPlanId;
  readonly owner: M4CampaignOwnerV1;
  readonly ownerLabel: string;
  readonly target: M4CampaignTargetV1;
  readonly targetLabel: string;
  readonly objectiveKind: M4CampaignObjectiveKindV1;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly forecast: ClientM4CampaignForecastReadModel;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4CampaignForecastReadModel {
  readonly status: "ready" | "blocked" | "cancelled" | "completed";
  readonly earliestStartDay: number;
  readonly latestStartDay: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4MusterReadModel {
  readonly readiness: "ready" | "partial" | "blocked" | "empty";
  readonly promisedTroops: number;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
  readonly releasedTroops: number;
  readonly commitments: readonly ClientM4MusterCommitmentReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4MusterCommitmentReadModel {
  readonly commitmentId: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly promisedTroops: number;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
  readonly dueDay: number;
  readonly plannedAssemblyDay: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4GrainSupplyReadModel {
  readonly plannedTroops: number;
  readonly plannedMarchDays: number;
  readonly plannedStartDay: number;
  readonly grainRequired: number;
  readonly grainReserved: number;
  readonly grainAvailableToReserve: number;
  readonly expectedDaysOfSupply: number;
  readonly reservations: readonly ClientM4GrainReservationReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4GrainReservationReadModel {
  readonly reservationId: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly reservedAmount: number;
  readonly carriedAmount: number;
  readonly consumedAmount: number;
  readonly shortageAmount: number;
  readonly lossAmount: number;
  readonly lossReasonCode: string | null;
  readonly expectedDaysOfSupply: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4RouteForecastReadModel {
  readonly targetDistrictId: ClientDistrictId;
  readonly plannedTroops: number;
  readonly carriedSupplyAvailable: number;
  readonly carriedSupplyLimit: number;
  readonly bottleneckCapacity: number;
  readonly sourceForecasts: readonly ClientM4RouteSourceForecastReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4RouteSourceForecastReadModel {
  readonly reservationId: number;
  readonly originDistrictId: ClientDistrictId;
  readonly destinationDistrictId: ClientDistrictId;
  readonly status: "capacity-exceeded" | "reachable" | "unreachable";
  readonly carriedSupplyAmount: number;
  readonly carriedSupplyLimit: number;
  readonly bottleneckCapacity: number;
  readonly travelDays: number;
  readonly earliestArrivalDay: number;
  readonly latestArrivalDay: number;
  readonly overloadedReasonCode: string | null;
  readonly seasonRiskReasonCodes: readonly string[];
}

export interface ClientM4MarchReadModel {
  readonly marchId: ClientCampaignMarchId;
  readonly campaignPlanId: ClientCampaignPlanId;
  readonly originDistrictId: ClientDistrictId;
  readonly targetDistrictId: ClientDistrictId;
  readonly currentDistrictId: ClientDistrictId;
  readonly activeTroops: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly supply: ClientM4MarchSupplyReadModel;
  readonly predictedArrivalWindow: ClientM4ArrivalWindowReadModel;
  readonly actualArrivalDay: number | null;
  readonly joinedTroops: number;
  readonly failedCommitmentIds: readonly number[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4MarchSupplyReadModel {
  readonly status: string;
  readonly carriedGrain: number;
  readonly consumedGrain: number;
  readonly shortageGrain: number;
  readonly delayedDays: number;
}

export interface ClientM4ArrivalWindowReadModel {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface ClientM4SiegeReadModel {
  readonly siegeId: ClientSiegeId;
  readonly campaignPlanId: ClientCampaignPlanId;
  readonly marchId: ClientCampaignMarchId;
  readonly targetDistrictId: ClientDistrictId;
  readonly attackerPolityId: ClientPolityId;
  readonly defenderPolityId: ClientPolityId;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly fortification: number;
  readonly defenderEstimatedTroops: number;
  readonly defenderSupply: number;
  readonly siegeProgress: number;
  readonly daysInvested: number;
  readonly attackerTroops: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly surrenderEligible: boolean;
  readonly surrenderReasonCodes: readonly string[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4WithdrawalReadModel {
  readonly withdrawalId: ClientWithdrawalId;
  readonly campaignPlanId: ClientCampaignPlanId;
  readonly marchId: ClientCampaignMarchId | null;
  readonly siegeId: ClientSiegeId | null;
  readonly kind: string;
  readonly triggerReason: M4WithdrawalTriggerV1;
  readonly troopsBefore: number;
  readonly troopsExtracted: number;
  readonly casualties: number;
  readonly supplyLoss: number;
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export interface ClientM4AiReasonReadModel {
  readonly decisionKind: string;
  readonly selectedCampaignPlanId: ClientCampaignPlanId | null;
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly primaryReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly candidates: readonly ClientM4AiCandidateReadModel[];
}

export interface ClientM4AiCandidateReadModel {
  readonly candidateId: string;
  readonly decisionKind: string;
  readonly campaignPlanId: ClientCampaignPlanId | null;
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly score: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4WarReportReadModel {
  readonly outcomeId: ClientWarOutcomeId;
  readonly campaignPlanId: ClientCampaignPlanId;
  readonly victorPolityId: ClientPolityId;
  readonly localPolityId: ClientPolityId;
  readonly targetDistrictId: ClientDistrictId;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly withdrawalId: ClientWithdrawalId | null;
  readonly siegeId: ClientSiegeId | null;
  readonly postwarCandidate: ClientM4PostwarCandidateReadModel | null;
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export interface ClientM4PostwarCandidateReadModel {
  readonly candidateId: string;
  readonly sourceWarOutcomeId: ClientWarOutcomeId;
  readonly settlementId: string;
  readonly victorPolityId: ClientPolityId;
  readonly localPolityId: ClientPolityId;
  readonly districtId: ClientDistrictId;
  readonly validM3Methods: readonly M3PostwarGovernanceMethodV1[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4ReasonSummaryReadModel {
  readonly reasonCode: string;
  readonly count: number;
  readonly sourceKinds: readonly ClientM4ReasonSourceKind[];
}

export type ClientM4ReasonSourceKind =
  | "ai"
  | "campaign"
  | "grain"
  | "march"
  | "muster"
  | "route"
  | "siege"
  | "war-report"
  | "withdrawal";

export interface ClientM4CampaignProjectionInput {
  readonly campaignPlans: ClientM4CampaignPlansProtocolResult;
  readonly muster: ClientM4MusterProtocolResult;
  readonly grain: ClientM4GrainSupplyProtocolResult;
  readonly route: ClientM4RouteForecastProtocolResult;
  readonly march: ClientM4MarchProtocolResult;
  readonly siege: ClientM4SiegeProtocolResult;
  readonly withdrawal: ClientM4WithdrawalProtocolResult;
  readonly warOutcomes: ClientM4WarOutcomesProtocolResult;
  readonly aiTrace: M4CampaignAiDecisionTraceV1;
  readonly catalog: ClientM4CampaignCatalogInput;
}

export interface ClientM4CampaignCatalogInput {
  readonly commandActor: ClientM3CommandActorReadModel;
  readonly commandDefaults: {
    readonly nextCampaignPlanId: number;
    readonly nextMarchId: number;
    readonly nextWithdrawalId: number;
    readonly originDistrictId: number;
    readonly grainPerTroopPerDay: number;
    readonly withdrawalTrigger: M4WithdrawalTriggerV1;
  };
  readonly planningDraft: {
    readonly owner: M4CampaignOwnerV1;
    readonly target: M4CampaignTargetV1;
    readonly objectiveKind: M4CampaignObjectiveKindV1;
    readonly startWindow: ClientM4StartWindowReadModel;
    readonly reasonCodes: readonly string[];
  };
  readonly polityLabels: readonly { readonly polityId: number; readonly displayName: string }[];
  readonly districtLabels: readonly { readonly districtId: number; readonly displayName: string }[];
  readonly characterLabels: readonly {
    readonly characterId: number;
    readonly displayName: string;
  }[];
}

export interface ClientM4CampaignPlansProtocolResult {
  readonly kind: "sim.list-m4-campaign-plans";
  readonly day: number;
  readonly revision: number;
  readonly plans: readonly ClientM4CampaignPlanProtocolRow[];
}

export interface ClientM4CampaignPlanProtocolRow {
  readonly campaignPlanId: number;
  readonly owner: M4CampaignOwnerV1;
  readonly target: M4CampaignTargetV1;
  readonly objectiveKind: M4CampaignObjectiveKindV1;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly forecast: ClientM4CampaignForecastReadModel;
}

export interface ClientM4MusterProtocolResult {
  readonly kind: "sim.list-m4-muster-commitments";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly commitments: readonly ClientM4MusterProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4MusterProtocolRow {
  readonly commitmentId: number;
  readonly campaignPlanId: number;
  readonly promisedTroops: number;
  readonly dueDay: number;
  readonly plannedAssemblyDay: number;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
  readonly releasedTroops: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4GrainSupplyProtocolResult {
  readonly kind: "sim.preview-m4-grain-supply";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly plannedTroops: number;
  readonly plannedMarchDays: number;
  readonly plannedStartDay: number;
  readonly grainRequired: number;
  readonly grainReserved: number;
  readonly grainAvailableToReserve: number;
  readonly expectedDaysOfSupply: number;
  readonly reservations: readonly ClientM4GrainReservationProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4GrainReservationProtocolRow {
  readonly reservationId: number;
  readonly campaignPlanId: number;
  readonly reservedAmount: number;
  readonly carriedAmount: number;
  readonly consumedAmount: number;
  readonly shortageAmount: number;
  readonly lossAmount: number;
  readonly lossReasonCode: string | null;
  readonly expectedDaysOfSupply: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM4RouteForecastProtocolResult {
  readonly kind: "sim.preview-m4-route-transport-capacity";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly targetDistrictId: number;
  readonly plannedTroops: number;
  readonly carriedSupplyAvailable: number;
  readonly carriedSupplyLimit: number;
  readonly bottleneckCapacity: number;
  readonly sourceForecasts: readonly ClientM4RouteSourceForecastProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4RouteSourceForecastProtocolRow {
  readonly reservationId: number;
  readonly originDistrictId: number;
  readonly destinationDistrictId: number;
  readonly status: "capacity-exceeded" | "reachable" | "unreachable";
  readonly carriedSupplyAmount: number;
  readonly carriedSupplyLimit: number;
  readonly bottleneckCapacity: number;
  readonly travelWindow: {
    readonly earliestArrivalDay: number;
    readonly latestArrivalDay: number;
    readonly travelDays: number;
  };
  readonly overloadedReasonCode: string | null;
  readonly seasonRiskReasonCodes: readonly string[];
}

export interface ClientM4MarchProtocolResult {
  readonly kind: "sim.list-m4-march-state";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly marches: readonly ClientM4MarchProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4MarchProtocolRow {
  readonly marchId: number;
  readonly campaignPlanId: number;
  readonly originDistrictId: number;
  readonly targetDistrictId: number;
  readonly currentDistrictId: number;
  readonly activeTroops: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly supply: ClientM4MarchSupplyReadModel;
  readonly predictedArrivalWindow: ClientM4ArrivalWindowReadModel;
  readonly actualArrivalDay: number | null;
  readonly joinedCommitmentTroops: readonly {
    readonly commitmentId: number;
    readonly joinedTroops: number;
  }[];
  readonly failedCommitmentIds: readonly number[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4SiegeProtocolResult {
  readonly kind: "sim.list-m4-siege-state";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly sieges: readonly ClientM4SiegeProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4SiegeProtocolRow {
  readonly siegeId: number;
  readonly campaignPlanId: number;
  readonly marchId: number;
  readonly targetDistrictId: number;
  readonly attackerPolityId: number;
  readonly defenderPolityId: number;
  readonly status: string;
  readonly statusReasonCode: string;
  readonly fortification: number;
  readonly defenderEstimatedTroops: number;
  readonly defenderSupply: number;
  readonly siegeProgress: number;
  readonly daysInvested: number;
  readonly attackerTroops: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly surrenderEligible: boolean;
  readonly surrenderReasonCodes: readonly string[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4WithdrawalProtocolResult {
  readonly kind: "sim.list-m4-withdrawal-state";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly withdrawals: readonly ClientM4WithdrawalProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4WithdrawalProtocolRow {
  readonly withdrawalId: number;
  readonly campaignPlanId: number;
  readonly marchId: number | null;
  readonly siegeId: number | null;
  readonly kind: string;
  readonly triggerReason: M4WithdrawalTriggerV1;
  readonly troopsBefore: number;
  readonly troopsExtracted: number;
  readonly casualties: number;
  readonly supplyLoss: number;
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export interface ClientM4WarOutcomesProtocolResult {
  readonly kind: "sim.list-m4-war-outcomes";
  readonly day: number;
  readonly revision: number;
  readonly campaignPlanId: number;
  readonly outcomes: readonly ClientM4WarOutcomeProtocolRow[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM4WarOutcomeProtocolRow {
  readonly outcomeId: number;
  readonly campaignPlanId: number;
  readonly victorPolityId: number;
  readonly localPolityId: number;
  readonly targetDistrictId: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly withdrawalId: number | null;
  readonly siegeId: number | null;
  readonly postwarCandidate: ClientM4PostwarCandidateProtocolRow | null;
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export interface ClientM4PostwarCandidateProtocolRow {
  readonly candidateId: string;
  readonly sourceWarOutcomeId: number;
  readonly settlementId: string;
  readonly victorPolityId: number;
  readonly localPolityId: number;
  readonly districtId: number;
  readonly validM3Methods: readonly M3PostwarGovernanceMethodV1[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM3CommandContextInput {
  readonly snapshot: ClientM3AppointmentReadModelSnapshot;
  readonly commandId: string;
}

export type ClientM3SubmittedCommand = GameCommandV1;
export type ClientM4SubmittedCommand = GameCommandV1;
export type ClientM4SiegeChoice = M4SiegeChoiceV1;
export type ClientM5SubmittedCommand = GameCommandV1;

export type ClientM5PlayablePhase = "not-started" | "running" | "success" | "failure" | "cancelled";

export type ClientM5PlayableStepStage =
  | "appointment"
  | "obligation"
  | "logistics"
  | "campaign"
  | "battle-siege"
  | "postwar"
  | "stabilization"
  | "failure";

export interface ClientM5PlayableReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly scenarioId: "m5.composite.river-gate.v0";
  readonly contentTag: "COMPOSITE_FICTIONAL_PLACEHOLDER";
  readonly day: number;
  readonly stateHash: string;
  readonly commandActor: ClientM3CommandActorReadModel;
  readonly provenance: ClientM5PlayableProvenanceReadModel;
  readonly goal: ClientM5GoalReadModel;
  readonly replay: ClientM5ReplayEvidenceReadModel;
  readonly session: ClientM5SessionReadModel;
  readonly steps: readonly ClientM5PlayableStepReadModel[];
  readonly failureStep: ClientM5PlayableStepReadModel;
  readonly ai: ClientM5AiReadModel;
  readonly risk: ClientM5RiskReadModel;
  readonly supply: ClientM5SupplyReadModel;
  readonly season: ClientM5SeasonReadModel;
  readonly postwar: ClientM5PostwarReadModel;
  readonly reasonSummaries: readonly ClientM5ReasonSummaryReadModel[];
}

export interface ClientM5PlayableProvenanceReadModel {
  readonly kind: "m5-protocol-script-projection";
  readonly note: string;
}

export interface ClientM5GoalReadModel {
  readonly primaryGoal: string;
  readonly successConditions: readonly string[];
  readonly failureConditions: readonly string[];
  readonly outOfScope: readonly string[];
}

export interface ClientM5ReplayEvidenceReadModel {
  readonly bootFixture: M5PlayableLoopScriptV1["boot"]["fixture"];
  readonly startHash: string;
  readonly currentHash: string;
  readonly commandCount: number;
  readonly checkpointLabel: string;
}

export interface ClientM5SessionReadModel {
  readonly phase: ClientM5PlayablePhase;
  readonly currentStepIndex: number;
  readonly confirmedCommandIds: readonly string[];
}

export interface ClientM5PlayableStepReadModel {
  readonly stepId: string;
  readonly stage: ClientM5PlayableStepStage;
  readonly label: string;
  readonly command: GameCommandV1;
  readonly actorLabel: string;
  readonly preview: ClientM5CommandPreviewReadModel;
  readonly result: ClientM5CommandResultReadModel;
  readonly reasonCodes: readonly string[];
}

export interface ClientM5CommandPreviewReadModel {
  readonly commandKind: GameCommandV1["kind"];
  readonly commandId: string;
  readonly summary: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM5CommandResultReadModel {
  readonly status: "pending" | "confirmed" | "rejected";
  readonly summary: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM5AiReadModel {
  readonly decisionKind: ClientM4AiReasonReadModel["decisionKind"];
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly primaryReasonCode: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM5RiskReadModel {
  readonly campaignRiskLabel: string;
  readonly routeReasonCodes: readonly string[];
  readonly withdrawalReasonCodes: readonly string[];
}

export interface ClientM5SupplyReadModel {
  readonly expectedDaysOfSupply: number;
  readonly grainReserved: number;
  readonly grainRequired: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM5SeasonReadModel {
  readonly windowLabel: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM5PostwarReadModel {
  readonly candidateCount: number;
  readonly methods: readonly M3PostwarGovernanceMethodV1[];
  readonly consequenceReasonCodes: readonly string[];
}

export interface ClientM5ReasonSummaryReadModel {
  readonly reasonCode: string;
  readonly count: number;
  readonly sourceKinds: readonly ClientM5ReasonSourceKind[];
}

export type ClientM5ReasonSourceKind =
  | "ai"
  | "campaign"
  | "failure"
  | "postwar"
  | "season"
  | "supply";

export type ClientM6SubmittedCommand = AuthoritativeGameCommandV1;

export type ClientM6AlphaPhase =
  | "scenario-selection"
  | "running"
  | "victory"
  | "failure"
  | "continued-play"
  | "checkpoint-loaded";

export type ClientM6AlphaStepStage =
  | "scenario"
  | "appointment"
  | "obligation"
  | "logistics"
  | "campaign"
  | "battle-siege"
  | "postwar"
  | "succession"
  | "diplomacy"
  | "legitimacy"
  | "policy-event"
  | "terminal"
  | "stabilization"
  | "failure";

export interface ClientM6AlphaReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly scenarioId: "m6.alpha.recognized-order.v0";
  readonly contentTag: "COMPOSITE_FICTIONAL_ALPHA";
  readonly day: number;
  readonly stateHash: string;
  readonly commandActor: ClientM3CommandActorReadModel;
  readonly provenance: ClientM6AlphaProvenanceReadModel;
  readonly scenarios: readonly ClientM6ScenarioReadModel[];
  readonly selectedScenarioId: string;
  readonly goal: ClientM6GoalReadModel;
  readonly replay: ClientM6ReplayEvidenceReadModel;
  readonly session: ClientM6SessionReadModel;
  readonly steps: readonly ClientM6AlphaStepReadModel[];
  readonly failureStep: ClientM6AlphaStepReadModel;
  readonly diplomacy: ClientM6DiplomacyReadModel;
  readonly legitimacy: ClientM6LegitimacyReadModel;
  readonly succession: ClientM6SuccessionReadModel;
  readonly policies: ClientM6PolicyEventReadModel;
  readonly encyclopedia: ClientM6EncyclopediaReadModel;
  readonly adviser: ClientM6AdviserReadModel;
  readonly mapCandidate: ClientM6MapCandidateReadModel;
  readonly terminal: ClientM6TerminalReadModel;
  readonly reasonSummaries: readonly ClientM6ReasonSummaryReadModel[];
}

export interface ClientM6AlphaProvenanceReadModel {
  readonly kind: "m6-protocol-script-and-query-projection";
  readonly note: string;
}

export interface ClientM6ScenarioReadModel {
  readonly scenarioId: string;
  readonly label: string;
  readonly scenarioKind: "primary-victory" | "pressure-variant" | "recovery-or-failure";
  readonly startDay: number;
  readonly seed: number;
  readonly startHash: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM6GoalReadModel {
  readonly primaryGoal: string;
  readonly victoryRequirements: readonly string[];
  readonly failureConditions: readonly string[];
  readonly excludedSurfaces: readonly string[];
}

export interface ClientM6ReplayEvidenceReadModel {
  readonly bootFixture: M6AlphaStartToVictoryScriptV1["boot"]["fixture"];
  readonly startHash: string;
  readonly currentHash: string;
  readonly commandCount: number;
  readonly midRunCheckpointLabel: string;
  readonly terminalCheckpointLabel: string;
}

export interface ClientM6SessionReadModel {
  readonly phase: ClientM6AlphaPhase;
  readonly currentStepIndex: number;
  readonly confirmedCommandIds: readonly string[];
}

export interface ClientM6AlphaStepReadModel {
  readonly stepId: string;
  readonly stage: ClientM6AlphaStepStage;
  readonly label: string;
  readonly command: AuthoritativeGameCommandV1;
  readonly actorLabel: string;
  readonly preview: ClientM6CommandPreviewReadModel;
  readonly result: ClientM6CommandResultReadModel;
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface ClientM6CommandPreviewReadModel {
  readonly commandKind: AuthoritativeGameCommandV1["kind"];
  readonly commandId: string;
  readonly summary: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM6CommandResultReadModel {
  readonly status: "pending" | "confirmed" | "rejected";
  readonly summary: string;
  readonly reasonCodes: readonly string[];
}

export interface ClientM6DiplomacyReadModel {
  readonly day: number;
  readonly observerPolityId: ClientPolityId;
  readonly relations: readonly ClientM6DiplomaticRelationReadModel[];
  readonly agreements: readonly ClientM6DiplomaticAgreementReadModel[];
  readonly recognitionEdges: readonly ClientM6RecognitionEdgeReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM6DiplomaticRelationReadModel {
  readonly relationId: number;
  readonly polityAId: ClientPolityId;
  readonly polityBId: ClientPolityId;
  readonly trustBps: number;
  readonly affinityBps: number;
  readonly fearBps: number;
  readonly threatBps: number;
  readonly interestAlignmentBps: number;
  readonly historicalDebt: number;
  readonly borderConflictBps: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM6DiplomaticAgreementReadModel {
  readonly agreementId: number;
  readonly relationId: number;
  readonly proposerPolityId: ClientPolityId;
  readonly targetPolityId: ClientPolityId;
  readonly agreementKind: "non-aggression" | "military-access" | "tribute-recognition";
  readonly status: "offered" | "accepted" | "rejected" | "expired";
  readonly startDay: number;
  readonly endDay: number;
  readonly recognitionDirection:
    | "none"
    | "proposer-recognizes-target"
    | "target-recognizes-proposer";
  readonly reasonCodes: readonly string[];
}

export interface ClientM6RecognitionEdgeReadModel {
  readonly fromPolityId: ClientPolityId;
  readonly toPolityId: ClientPolityId;
  readonly agreementId: number;
  readonly reasonCode: string;
}

export interface ClientM6LegitimacyReadModel {
  readonly polityId: ClientPolityId;
  readonly audience: string;
  readonly scoreBps: number;
  readonly pressureBps: number;
  readonly sources: readonly ClientM6LegitimacySourceReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM6LegitimacySourceReadModel {
  readonly sourceId: number;
  readonly sourceKind:
    | "diplomatic-recognition"
    | "obligation-fulfilled"
    | "obligation-breached"
    | "succession-continuity"
    | "postwar-settlement"
    | "campaign-consequence";
  readonly magnitudeBps: number;
  readonly sourceRef: string;
  readonly reasonCode: string;
}

export interface ClientM6SuccessionReadModel {
  readonly status: "pending" | "resolved";
  readonly crisisCount: number;
  readonly resolvedCount: number;
  readonly candidateCount: number;
  readonly continuityReasonCodes: readonly string[];
}

export interface ClientM6PolicyEventReadModel {
  readonly activeEvents: readonly ClientM6PolicyEventActiveReadModel[];
  readonly resolvedEvents: readonly ClientM6PolicyEventResolvedReadModel[];
  readonly modifiers: readonly ClientM6PolicyModifierReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM6PolicyEventActiveReadModel {
  readonly eventInstanceId: number;
  readonly title: string;
  readonly causeReasonCodes: readonly string[];
  readonly options: readonly ClientM6PolicyEventOptionReadModel[];
  readonly encyclopediaRefs: readonly string[];
}

export interface ClientM6PolicyEventOptionReadModel {
  readonly optionId: number;
  readonly label: string;
  readonly reasonCodes: readonly string[];
  readonly consequenceReasonCodes: readonly string[];
}

export interface ClientM6PolicyEventResolvedReadModel {
  readonly eventInstanceId: number;
  readonly selectedOptionId: number;
  readonly resolvedDay: number;
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface ClientM6PolicyModifierReadModel {
  readonly modifierId: number;
  readonly policyId: number;
  readonly magnitudeBps: number;
  readonly startDay: number;
  readonly endDay: number;
  readonly reasonCode: string;
}

export interface ClientM6EncyclopediaReadModel {
  readonly entries: readonly ClientM6EncyclopediaEntryReadModel[];
  readonly selectedEntryId: string;
}

export interface ClientM6EncyclopediaEntryReadModel {
  readonly entryId: string;
  readonly title: string;
  readonly contentTag: "FICTIONAL" | "COMPOSITE" | "INFERRED" | "HISTORICAL";
  readonly summary: string;
  readonly linkedReasonCodes: readonly string[];
}

export interface ClientM6AdviserReadModel {
  readonly decisionKind: ClientM4AiReasonReadModel["decisionKind"] | "diplomacy" | "policy";
  readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly primaryReasonCode: string;
  readonly candidates: readonly ClientM6AdviserCandidateReadModel[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM6AdviserCandidateReadModel {
  readonly candidateId: string;
  readonly decisionKind: string;
  readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly score: number;
  readonly reasonCodes: readonly string[];
}

export interface ClientM6MapCandidateReadModel {
  readonly candidateSourceId: string;
  readonly displayName: string;
  readonly sourceLabel: "FICTIONAL" | "COMPOSITE" | "INFERRED" | "HISTORICAL";
  readonly districtCount: number;
  readonly settlementCount: number;
  readonly routeCount: number;
  readonly selectedDistrictIds: readonly ClientDistrictId[];
  readonly reasonCodes: readonly string[];
}

export interface ClientM6TerminalReadModel {
  readonly outcome: M6AlphaTerminalOutcomeV1;
  readonly evaluatedDay: number;
  readonly evaluatedRevision: number;
  readonly maxDay: number;
  readonly canPursueVictory: boolean;
  readonly evidence: ClientM6TerminalEvidenceReadModel;
  readonly reasonCodes: readonly string[];
}

export interface ClientM6TerminalEvidenceReadModel {
  readonly recognizedByCount: number;
  readonly legitimacyScoreBps: number;
  readonly postwarArrangementCount: number;
  readonly resolvedPolicyEventCount: number;
  readonly successionResolvedCount: number;
  readonly routeCount: number;
  readonly populationGroupCount: number;
}

export interface ClientM6ReasonSummaryReadModel {
  readonly reasonCode: string;
  readonly count: number;
  readonly sourceKinds: readonly ClientM6ReasonSourceKind[];
}

export type ClientM6ReasonSourceKind =
  | "adviser"
  | "diplomacy"
  | "encyclopedia"
  | "legitimacy"
  | "map"
  | "policy-event"
  | "step"
  | "succession"
  | "terminal";

export type ClientM7ContentLabel =
  | "HISTORICAL"
  | "INFERRED"
  | "COMPOSITE"
  | "FICTIONAL"
  | "RESEARCH REQUIRED";
export type ClientM7ContentConfidence = "HIGH" | "MEDIUM" | "LOW" | "DISPUTED";
export type ClientM7ReviewState =
  | "DRAFT_CONTENT"
  | "RESEARCH REQUIRED"
  | "SOURCE_RECORDED"
  | "HISTORICAL_REVIEW_READY"
  | "HISTORICAL_ACCEPTED"
  | "CULTURE_RISK_REQUEST_CHANGES"
  | "CULTURE_HUMAN_GATE_REQUIRED"
  | "LANGUAGE_REVIEW_REQUIRED"
  | "SCHEMA_VALIDATED"
  | "QA_REVIEW_READY"
  | "LOCK_CANDIDATE";
export type ClientM7GuidanceSurface = "tutorial" | "hints" | "encyclopedia";
export type ClientM7CoverageSurface = ClientM7GuidanceSurface | "coverage";
export type ClientM7CoverageStatus = "BETA_COVERED" | "REVIEW_BLOCKED" | "POST_1_0_NONBLOCKING";
export type ClientM7AssetReferenceKind = "audio" | "art";

interface ClientM7RuntimeAudioArtLocalizationCoverageSource {
  readonly schemaVersion: 1;
  readonly kind: "m7.beta-audio-art-localization-coverage";
  readonly taskId: "M7-AUDIO-ART-LOCALIZATION-COMPLETE-001";
  readonly manifestId: string;
  readonly contentScope: "m7-beta-content-lock-prep";
  readonly notContentLockAcceptance: true;
  readonly m6GateCarryForward: "PASS_WITH_LIMITS";
  readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
  readonly staticResourceBoundary: ClientM7StaticResourceBoundaryReadModel;
  readonly supportedLocales: readonly ClientM7RuntimeLocaleCoverageRecord[];
  readonly assetReferences: readonly ClientM7RuntimeAssetReferenceRecord[];
  readonly localizationChecks: readonly ClientM7RuntimeLocalizationCheckRecord[];
  readonly viewportSmoke: readonly ClientM7RuntimeViewportSmokeRecord[];
  readonly postOneGaps: readonly ClientM7RuntimePostOneGapRecord[];
  readonly unresolvedRisks: readonly ClientM7RuntimeUnresolvedRiskRecord[];
}

interface ClientM7RuntimeLocaleCoverageRecord {
  readonly locale: string;
  readonly displayName: string;
  readonly status: ClientM7CoverageStatus;
  readonly uiChromeCovered: boolean;
  readonly tutorialCovered: boolean;
  readonly hintsCovered: boolean;
  readonly encyclopediaCovered: boolean;
  readonly contentRecordCovered: boolean;
  readonly reviewState: ClientM7ReviewState;
  readonly note: string;
}

interface ClientM7RuntimeAssetReferenceRecord {
  readonly assetId: string;
  readonly kind: ClientM7AssetReferenceKind;
  readonly surface: string;
  readonly status: ClientM7CoverageStatus;
  readonly staticResourceRef: string;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly cultureRisk: string;
  readonly routeTo: string;
  readonly note: string;
}

interface ClientM7RuntimeLocalizationCheckRecord {
  readonly checkId: string;
  readonly surface: string;
  readonly requiredKeyPattern: string;
  readonly requiredLocaleCount: number;
  readonly status: ClientM7CoverageStatus;
  readonly reviewState: ClientM7ReviewState;
  readonly note: string;
}

interface ClientM7RuntimeViewportSmokeRecord {
  readonly smokeId: string;
  readonly width: number;
  readonly height: number;
  readonly textScalePercent: number;
  readonly deviceScaleFactor: number;
  readonly status: ClientM7CoverageStatus;
  readonly note: string;
}

interface ClientM7RuntimePostOneGapRecord {
  readonly gapId: string;
  readonly status: "POST_1_0_NONBLOCKING";
  readonly routeTo: string;
  readonly note: string;
}

interface ClientM7RuntimeUnresolvedRiskRecord {
  readonly riskId: string;
  readonly severity: "major-cultural-risk" | "review-required" | "scope-boundary";
  readonly routeTo: string;
  readonly humanGate: boolean;
  readonly note: string;
}

interface ClientM7RuntimeSourceRecord {
  readonly sourceId: string;
  readonly sourceClass:
    | "PROJECT_BASELINE"
    | "PROJECT_POLICY"
    | "PROJECT_BIBLIOGRAPHY"
    | "REVIEW_BASELINE"
    | "ACADEMIC_CANDIDATE";
  readonly citation: string;
  readonly accessStatus: string;
  readonly pageOrSection: string;
  readonly formalUse: string;
}

interface ClientM7RuntimeClaimRecord {
  readonly claimId: string;
  readonly claim: string;
  readonly label: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly sourceIds: readonly string[];
  readonly sourcePassages: readonly string[];
  readonly sourceStatements: readonly string[];
  readonly scholarlyInterpretations: readonly string[];
  readonly researcherInference: string;
  readonly competingInterpretations: readonly string[];
  readonly gameAbstraction: string;
  readonly researchStatus: "PAGE_VERIFIED" | "SUMMARY_ONLY" | "RESEARCH_REQUIRED";
  readonly humanGate: boolean;
}

interface ClientM7RuntimeLocalizationRecord {
  readonly key: string;
  readonly zhHans: string;
  readonly english: string;
  readonly sourceNote: string;
  readonly context: string;
  readonly characterLimit: number;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly owner: string;
  readonly deterministicOrder: number;
}

interface ClientM7RuntimeTitleRecord {
  readonly titleId: string;
  readonly localizationKey: string;
  readonly label: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly owner: string;
  readonly deterministicOrder: number;
}

interface ClientM7RuntimePersonRecord {
  readonly personId: string;
  readonly displayNameKey: string;
  readonly titleIds: readonly string[];
  readonly label: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly owner: string;
  readonly scenarioIds: readonly string[];
  readonly roleTag: string;
  readonly deterministicOrder: number;
}

interface ClientM7RuntimeViolenceCostRecord {
  readonly victimGroups: readonly string[];
  readonly sourceRegions: readonly string[];
  readonly immediateCosts: readonly string[];
  readonly longTermConsequences: readonly string[];
  readonly reviewState: ClientM7ReviewState;
}

interface ClientM7RuntimeEventChoiceRecord {
  readonly choiceId: string;
  readonly localizationKey: string;
  readonly aiReasonKey: string;
  readonly costSummaryKey: string;
}

interface ClientM7RuntimeEventRecord {
  readonly eventId: string;
  readonly localizationKey: string;
  readonly label: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly owner: string;
  readonly triggerKey: string;
  readonly scenarioIds: readonly string[];
  readonly personIds: readonly string[];
  readonly titleIds: readonly string[];
  readonly choices: readonly ClientM7RuntimeEventChoiceRecord[];
  readonly violenceCostRecord: ClientM7RuntimeViolenceCostRecord | null;
  readonly deterministicOrder: number;
}

interface ClientM7RuntimeScenarioHookRecord {
  readonly hookId: string;
  readonly hookKind: "start" | "victory" | "failure" | "tutorial" | "encyclopedia";
  readonly localizationKey: string;
  readonly targetIds: readonly string[];
}

interface ClientM7RuntimeScenarioRecord {
  readonly scenarioId: string;
  readonly scenarioKey: string;
  readonly displayNameKey: string;
  readonly startYear: number;
  readonly label: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly owner: string;
  readonly personIds: readonly string[];
  readonly titleIds: readonly string[];
  readonly eventIds: readonly string[];
  readonly localizationKeys: readonly string[];
  readonly hooks: readonly ClientM7RuntimeScenarioHookRecord[];
  readonly deterministicOrder: number;
}

interface ClientM7RuntimeContentPack {
  readonly schemaVersion: 1;
  readonly kind: "m7.beta-scenario-person-event-set";
  readonly fixtureId: string;
  readonly fixtureKind: "beta-scenario-person-event-set";
  readonly contentScope: "m7-beta-content-fill";
  readonly notContentLockAcceptance: true;
  readonly m6GateCarryForward: "PASS_WITH_LIMITS";
  readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
  readonly sourceRecords: readonly ClientM7RuntimeSourceRecord[];
  readonly claimRecords: readonly ClientM7RuntimeClaimRecord[];
  readonly localization: readonly ClientM7RuntimeLocalizationRecord[];
  readonly titles: readonly ClientM7RuntimeTitleRecord[];
  readonly persons: readonly ClientM7RuntimePersonRecord[];
  readonly events: readonly ClientM7RuntimeEventRecord[];
  readonly scenarios: readonly ClientM7RuntimeScenarioRecord[];
  readonly knownGaps: readonly string[];
}

interface ClientM7RuntimeContentPackIndex {
  getClaim(claimId: string): ClientM7RuntimeClaimRecord | undefined;
  getLocalization(key: string): ClientM7RuntimeLocalizationRecord | undefined;
}

export interface ClientM7GuidanceReadModelSnapshot {
  readonly revision: ClientReadModelRevision;
  readonly selectedScenarioId: string;
  readonly provenance: ClientM7GuidanceProvenanceReadModel;
  readonly contentPack: ClientM7ContentPackSummaryReadModel;
  readonly scenarios: readonly ClientM7ScenarioGuidanceReadModel[];
  readonly tutorial: ClientM7TutorialReadModel;
  readonly hints: ClientM7HintReadModel;
  readonly encyclopedia: ClientM7EncyclopediaReadModel;
  readonly audioArtLocalization: ClientM7AudioArtLocalizationCoverageReadModel;
  readonly reviewSummary: ClientM7ReviewSummaryReadModel;
}

export interface ClientM7GuidanceProvenanceReadModel {
  readonly kind: "m7-beta-content-records-and-client-read-model";
  readonly note: string;
}

export interface ClientM7ContentPackSummaryReadModel {
  readonly fixtureId: string;
  readonly manifestHash: string;
  readonly scenarioCount: number;
  readonly personCount: number;
  readonly eventCount: number;
  readonly knownGapCount: number;
  readonly notContentLockAcceptance: true;
  readonly m6GateCarryForward: "PASS_WITH_LIMITS";
  readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
}

export interface ClientM7ScenarioGuidanceReadModel {
  readonly scenarioId: string;
  readonly label: string;
  readonly startYear: number;
  readonly contentLabel: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly reviewState: ClientM7ReviewState;
  readonly hookIds: readonly string[];
  readonly tutorialHookText: string;
  readonly encyclopediaHookText: string;
  readonly linkedClaimIds: readonly string[];
}

export interface ClientM7TutorialReadModel {
  readonly steps: readonly ClientM7TutorialStepReadModel[];
}

export interface ClientM7TutorialStepReadModel {
  readonly stepId: string;
  readonly milestone: "M1" | "M2" | "M3" | "M4" | "M5" | "M6" | "M7";
  readonly title: string;
  readonly summary: string;
  readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly querySurface: string;
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly contentLabel: ClientM7ContentLabel;
}

export interface ClientM7HintReadModel {
  readonly groups: readonly ClientM7HintGroupReadModel[];
}

export interface ClientM7HintGroupReadModel {
  readonly groupId: string;
  readonly title: string;
  readonly surface: string;
  readonly hints: readonly ClientM7ContextualHintReadModel[];
}

export interface ClientM7ContextualHintReadModel {
  readonly hintId: string;
  readonly text: string;
  readonly triggerReasonCodes: readonly string[];
  readonly commandPreviewKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly linkedEntryIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly contentLabel: ClientM7ContentLabel;
}

export interface ClientM7EncyclopediaReadModel {
  readonly selectedEntryId: string;
  readonly entries: readonly ClientM7EncyclopediaEntryReadModel[];
}

export interface ClientM7EncyclopediaEntryReadModel {
  readonly entryId: string;
  readonly title: string;
  readonly systemMilestone: "M1" | "M2" | "M3" | "M4" | "M5" | "M6" | "M7";
  readonly contentLabel: ClientM7ContentLabel;
  readonly confidence: ClientM7ContentConfidence;
  readonly reviewState: ClientM7ReviewState;
  readonly summary: string;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly linkedReasonCodes: readonly string[];
  readonly contentRecordRefs: readonly string[];
}

export interface ClientM7ReviewSummaryReadModel {
  readonly reviewStateCounts: readonly ClientM7ReviewStateCountReadModel[];
  readonly humanGateClaimCount: number;
  readonly knownGaps: readonly string[];
  readonly blockedScopeNotes: readonly string[];
}

export interface ClientM7ReviewStateCountReadModel {
  readonly reviewState: ClientM7ReviewState;
  readonly count: number;
}

export interface ClientM7AudioArtLocalizationCoverageReadModel {
  readonly manifest: ClientM7AudioArtLocalizationManifestReadModel;
  readonly staticResourceBoundary: ClientM7StaticResourceBoundaryReadModel;
  readonly supportedLocales: readonly ClientM7LocaleCoverageReadModel[];
  readonly assetReferences: readonly ClientM7AssetReferenceReadModel[];
  readonly localizationChecks: readonly ClientM7LocalizationCoverageCheckReadModel[];
  readonly viewportSmoke: readonly ClientM7ViewportSmokeReadModel[];
  readonly postOneGaps: readonly ClientM7PostOneGapReadModel[];
  readonly unresolvedRisks: readonly ClientM7UnresolvedRiskReadModel[];
}

export interface ClientM7AudioArtLocalizationManifestReadModel {
  readonly taskId: "M7-AUDIO-ART-LOCALIZATION-COMPLETE-001";
  readonly manifestId: string;
  readonly sourceManifestPath: string;
  readonly localeCount: number;
  readonly assetReferenceCount: number;
  readonly audioReferenceCount: number;
  readonly artReferenceCount: number;
  readonly localizationCheckCount: number;
  readonly viewportSmokeCount: number;
  readonly postOneGapCount: number;
  readonly unresolvedRiskCount: number;
  readonly notContentLockAcceptance: true;
  readonly m6GateCarryForward: "PASS_WITH_LIMITS";
  readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
}

export interface ClientM7StaticResourceBoundaryReadModel {
  readonly noPaidService: true;
  readonly noRemotePipeline: true;
  readonly noSecrets: true;
  readonly noTelemetry: true;
  readonly noCdnOrReleaseCommitment: true;
  readonly noNewProductionDependency: true;
  readonly resourceMode: string;
}

export interface ClientM7LocaleCoverageReadModel {
  readonly locale: string;
  readonly displayName: string;
  readonly status: ClientM7CoverageStatus;
  readonly uiChromeCovered: boolean;
  readonly tutorialCovered: boolean;
  readonly hintsCovered: boolean;
  readonly encyclopediaCovered: boolean;
  readonly contentRecordCovered: boolean;
  readonly reviewState: ClientM7ReviewState;
  readonly stableKeyCount: number;
  readonly note: string;
}

export interface ClientM7AssetReferenceReadModel {
  readonly assetId: string;
  readonly kind: ClientM7AssetReferenceKind;
  readonly surface: string;
  readonly status: ClientM7CoverageStatus;
  readonly staticResourceRef: string;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: ClientM7ReviewState;
  readonly cultureRisk: string;
  readonly routeTo: string;
  readonly note: string;
}

export interface ClientM7LocalizationCoverageCheckReadModel {
  readonly checkId: string;
  readonly surface: string;
  readonly requiredKeyPattern: string;
  readonly requiredLocaleCount: number;
  readonly status: ClientM7CoverageStatus;
  readonly reviewState: ClientM7ReviewState;
  readonly matchedKeyCount: number;
  readonly note: string;
}

export interface ClientM7ViewportSmokeReadModel {
  readonly smokeId: string;
  readonly width: number;
  readonly height: number;
  readonly textScalePercent: number;
  readonly deviceScaleFactor: number;
  readonly status: ClientM7CoverageStatus;
  readonly note: string;
}

export interface ClientM7PostOneGapReadModel {
  readonly gapId: string;
  readonly status: "POST_1_0_NONBLOCKING";
  readonly routeTo: string;
  readonly note: string;
}

export interface ClientM7UnresolvedRiskReadModel {
  readonly riskId: string;
  readonly severity: "major-cultural-risk" | "review-required" | "scope-boundary";
  readonly routeTo: string;
  readonly humanGate: boolean;
  readonly note: string;
}

export interface ClientM6SessionSaveV1 {
  readonly schemaVersion: 1;
  readonly scenarioId: ClientM6AlphaReadModelSnapshot["scenarioId"];
  readonly phase: ClientM6AlphaPhase;
  readonly currentStepIndex: number;
  readonly confirmedCommandIds: readonly string[];
  readonly checkpointLabel: string;
  readonly stateHash: string;
  readonly terminalOutcome: M6AlphaTerminalOutcomeV1;
}

export type ClientM6SessionSaveParseResult =
  | { readonly ok: true; readonly value: ClientM6SessionSaveV1 }
  | { readonly ok: false; readonly reasonCode: string; readonly message: string };

export interface ClientM5SessionSaveV1 {
  readonly schemaVersion: 1;
  readonly scenarioId: ClientM5PlayableReadModelSnapshot["scenarioId"];
  readonly phase: ClientM5PlayablePhase;
  readonly currentStepIndex: number;
  readonly confirmedCommandIds: readonly string[];
  readonly checkpointLabel: string;
  readonly stateHash: string;
}

export type ClientM5SessionSaveParseResult =
  | { readonly ok: true; readonly value: ClientM5SessionSaveV1 }
  | { readonly ok: false; readonly reasonCode: string; readonly message: string };

export interface ClientM4CommandContextInput {
  readonly snapshot: ClientM4CampaignReadModelSnapshot;
  readonly commandId: string;
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
  readonly routeStatusFilter?: ClientDistrictRouteStatus | "all";
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
    districtList: createEmptyDistrictListReadModel(revision),
    m3Appointment: createEmptyM3AppointmentReadModel(revision),
    m4Campaign: createEmptyM4CampaignReadModel(revision),
    m5Playable: createEmptyM5PlayableReadModel(revision),
    m6Alpha: createEmptyM6AlphaReadModel(revision),
    m7Guidance: createEmptyM7GuidanceReadModel(revision)
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
  const m4Campaign = createM4CampaignReadModelFixture(baseSnapshot.revision);
  const snapshotWithM4 = {
    ...baseSnapshot,
    m4Campaign
  };
  const m3Appointment = createM3AppointmentReadModelFixture(baseSnapshot.revision);
  const m5Playable = createM5PlayableReadModelFixture(snapshotWithM4);
  const snapshotWithM5 = {
    ...snapshotWithM4,
    m3Appointment,
    m5Playable
  };
  const m6Alpha = createM6AlphaReadModelFixture(snapshotWithM5);
  const snapshotWithM6 = {
    ...snapshotWithM5,
    map: fixture.map,
    districtList: fixture.districtList,
    m6Alpha
  };

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
    districtList: fixture.districtList,
    m3Appointment,
    m4Campaign,
    m5Playable,
    m6Alpha,
    m7Guidance: createM7GuidanceReadModelFixture(snapshotWithM6)
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
        districtList: snapshot.districtList,
        m3Appointment: snapshot.m3Appointment,
        m4Campaign: snapshot.m4Campaign,
        m5Playable: snapshot.m5Playable,
        m6Alpha: snapshot.m6Alpha,
        m7Guidance: snapshot.m7Guidance
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
    districtList: createEmptyDistrictListReadModel(revision),
    m3Appointment: createEmptyM3AppointmentReadModel(revision),
    m4Campaign: createEmptyM4CampaignReadModel(revision),
    m5Playable: createEmptyM5PlayableReadModel(revision),
    m6Alpha: createEmptyM6AlphaReadModel(revision),
    m7Guidance: createEmptyM7GuidanceReadModel(revision)
  };
}

export function createM3AppointmentReadModelFixture(
  revision = createClientReadModelRevision(1)
): ClientM3AppointmentReadModelSnapshot {
  return projectM3AppointmentReadModelFromProtocolReadModels(
    createM3AppointmentProtocolProjectionFixture(Number(revision))
  );
}

export function createM3AppointmentProtocolProjectionFixture(
  revision: number
): ClientM3AppointmentProjectionInput {
  return {
    decisionScaffolds: {
      kind: "sim.list-m3-decision-scaffolds",
      day: 120,
      revision,
      offices: [
        {
          officeId: 1,
          holderCharacterId: 1,
          policyId: 101,
          executionPerformanceBps: 8_800,
          reasonCodes: [
            "appointment.holder.skill-strong",
            "appointment.relationship.supportive",
            "policy.office.balanced"
          ]
        },
        {
          officeId: 2,
          holderCharacterId: null,
          policyId: 102,
          executionPerformanceBps: 0,
          reasonCodes: ["appointment.office.vacant", "succession.pending-office-vacancy"]
        },
        {
          officeId: 3,
          holderCharacterId: 2,
          policyId: 103,
          executionPerformanceBps: 6_200,
          reasonCodes: [
            "appointment.holder.skill-adequate",
            "appointment.relationship.strained",
            "policy.office.military"
          ]
        }
      ],
      policies: [
        {
          policyId: 101,
          targetKind: "office",
          reasonCodes: ["policy.office.balanced", "policy.continuity.preserved"]
        },
        {
          policyId: 102,
          targetKind: "office",
          reasonCodes: ["policy.office.conciliatory", "policy.continuity.preserved"]
        },
        {
          policyId: 103,
          targetKind: "office",
          reasonCodes: ["policy.office.military", "policy.continuity.preserved"]
        },
        {
          policyId: 201,
          targetKind: "district",
          reasonCodes: ["policy.jurisdiction.conciliatory"]
        }
      ],
      enfeoffments: [
        {
          districtId: 2,
          holderCharacterId: 2,
          reasonCodes: ["enfeoffment.local-holder", "policy.jurisdiction.conciliatory"]
        }
      ]
    },
    administrativeBurden: {
      kind: "sim.list-m3-administrative-burden",
      day: 120,
      revision,
      districts: [
        {
          polityId: 1,
          districtId: 1,
          controlMode: "direct",
          localComplexity: 50,
          communicationCost: 50,
          directness: 50,
          frontierPressure: 25,
          administrativeCapacity: 1_000,
          administrativeLoad: 175,
          overload: 0,
          efficiencyBps: 8_250,
          realizableIncomeBps: 8_100,
          obligationReliabilityBps: 7_600,
          delayRiskBps: 1_200,
          readinessBps: 7_900
        },
        {
          polityId: 1,
          districtId: 2,
          controlMode: "vassal",
          localComplexity: 50,
          communicationCost: 75,
          directness: 75,
          frontierPressure: 50,
          administrativeCapacity: 1_000,
          administrativeLoad: 250,
          overload: 0,
          efficiencyBps: 7_500,
          realizableIncomeBps: 6_900,
          obligationReliabilityBps: 6_600,
          delayRiskBps: 2_100,
          readinessBps: 6_800
        }
      ]
    },
    successionCrises: {
      kind: "sim.list-m3-succession-crises",
      day: 120,
      revision,
      crises: [
        {
          successionId: 1,
          polityId: 2,
          status: "pending",
          candidates: [
            {
              characterId: 2,
              requiresRegency: false,
              supportTotalBps: 6_400,
              supportSources: [
                { kind: "court", strengthBps: 3_100, sourceId: "support.court" },
                { kind: "provincial", strengthBps: 3_300, sourceId: "support.province" }
              ]
            },
            {
              characterId: 4,
              requiresRegency: true,
              supportTotalBps: 3_700,
              supportSources: [
                { kind: "kinship", strengthBps: 2_600, sourceId: "support.kinship" },
                { kind: "foreign", strengthBps: 1_100, sourceId: "support.foreign" }
              ]
            }
          ]
        }
      ]
    },
    postwarGovernancePreview: {
      kind: "sim.preview-m3-postwar-governance",
      day: 120,
      revision,
      months: 4,
      arrangements: [
        createPostwarPreviewArrangement("restore-vassal-ruler", 2, 1, 2, 201, [
          "postwar.vassal-continuity",
          "obligation.tribute.regular",
          "obligation.troop.commitment-limited"
        ]),
        createPostwarPreviewArrangement("direct-control", 1, 1, 2, 201, [
          "postwar.direct-control.admin-load",
          "obligation.garrison.required"
        ])
      ]
    },
    catalog: createM3AppointmentCatalogFixture()
  };
}

export function projectM3AppointmentReadModelFromProtocolReadModels(
  input: ClientM3AppointmentProjectionInput
): ClientM3AppointmentReadModelSnapshot {
  const revision = createClientReadModelRevision(input.decisionScaffolds.revision);
  const officeById = new Map(
    input.decisionScaffolds.offices.map((office) => [office.officeId, office])
  );
  const policyReasonsById = new Map(
    input.decisionScaffolds.policies.map((policy) => [policy.policyId, policy.reasonCodes])
  );
  const adminByDistrictId = new Map(
    input.administrativeBurden.districts.map((district) => [district.districtId, district])
  );

  const characters = input.catalog.characters.map((character) => ({
    characterId: createClientCharacterId(character.characterId),
    displayName: character.displayName,
    polityId: createClientPolityId(character.polityId),
    availability: character.availability,
    roleLabel: character.roleLabel,
    behaviorReasonCodes: character.behaviorReasonCodes
  }));
  const polities = input.catalog.polities.map((polity) => ({
    polityId: createClientPolityId(polity.polityId),
    displayName: polity.displayName,
    relationKind: polity.relationKind,
    suzerainPolityId:
      polity.suzerainPolityId === null ? null : createClientPolityId(polity.suzerainPolityId),
    reasonCodes: polity.reasonCodes
  }));
  const offices = input.catalog.offices.map((officeCatalog) => {
    const scaffold = officeById.get(officeCatalog.officeId);
    if (scaffold === undefined) {
      throw new Error(`Missing M3 decision scaffold for office ${officeCatalog.officeId}.`);
    }
    const policyReasonCodes = policyReasonsById.get(scaffold.policyId) ?? [];

    return {
      officeId: createClientOfficeId(officeCatalog.officeId),
      displayName: officeCatalog.displayName,
      officeKind: officeCatalog.officeKind,
      holderCharacterId:
        scaffold.holderCharacterId === null
          ? null
          : createClientCharacterId(scaffold.holderCharacterId),
      policy: {
        policyId: createClientPolicyId(scaffold.policyId),
        stance: officeCatalog.policyStance,
        continuity: "persists-across-holder-change" as const,
        reasonCodes: [...policyReasonCodes, ...officeCatalog.policyReasonCodes]
      },
      executionPerformanceBps: scaffold.executionPerformanceBps,
      administrativePreview:
        officeCatalog.administrativeDistrictId === null
          ? null
          : projectM3AdministrativePreview(
              adminByDistrictId.get(officeCatalog.administrativeDistrictId)
            ),
      candidateEligibilities: input.catalog.eligibility
        .filter((eligibility) => eligibility.officeId === officeCatalog.officeId)
        .map(projectM3Eligibility),
      reasonCodes: scaffold.reasonCodes
    };
  });
  const appointmentResults = input.decisionScaffolds.offices.map((office) => ({
    officeId: createClientOfficeId(office.officeId),
    holderCharacterId:
      office.holderCharacterId === null ? null : createClientCharacterId(office.holderCharacterId),
    status: office.holderCharacterId === null ? ("vacant" as const) : ("appointed" as const),
    reasonCodes: office.reasonCodes
  }));
  const enfeoffmentResults = input.decisionScaffolds.enfeoffments.map((enfeoffment) => ({
    districtId: createClientDistrictId(enfeoffment.districtId),
    holderCharacterId: createClientCharacterId(enfeoffment.holderCharacterId),
    status: "granted" as const,
    reasonCodes: enfeoffment.reasonCodes
  }));
  const obligations = projectM3ObligationsFromPostwarPreview(input.postwarGovernancePreview);
  const successionCrises = input.successionCrises.crises.map((crisis) => ({
    successionId: crisis.successionId,
    polityId: createClientPolityId(crisis.polityId),
    status: crisis.status,
    vacancyOfficeIds: offices
      .filter((office) => office.holderCharacterId === null)
      .map((office) => office.officeId),
    candidates: crisis.candidates.map((candidate) => ({
      characterId: createClientCharacterId(candidate.characterId),
      requiresRegency: candidate.requiresRegency,
      supportTotalBps: candidate.supportTotalBps,
      supportReasonCodes: candidate.supportSources.map((source) => `succession.${source.kind}`)
    }))
  }));
  const bulkPreview = projectM3BulkPreview(input.catalog.bulkItems);

  return {
    revision,
    day: input.decisionScaffolds.day,
    commandActor: input.catalog.commandActor,
    provenance: {
      kind: "protocol-query-projection",
      note: "M3 appointment workspace projected from protocol query/read-model DTOs; candidate eligibility and reason codes are inputs from the command/query boundary, not UI formulas."
    },
    characters,
    polities,
    offices,
    obligations,
    successionCrises,
    appointmentResults,
    enfeoffmentResults,
    bulkPreview,
    reasonSummaries: summarizeM3ReasonCodes({
      characters,
      polities,
      offices,
      obligations,
      successionCrises,
      appointmentResults,
      enfeoffmentResults,
      bulkPreview
    })
  };
}

export function createM3AppointmentCommand(
  input: ClientM3CommandContextInput & {
    readonly officeId: ClientOfficeId;
    readonly characterId: ClientCharacterId | null;
  }
): GameCommandV1 {
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.appoint-office",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      officeId: Number(input.officeId),
      characterId: input.characterId === null ? null : Number(input.characterId),
      reasonCode: "client.m3.appointment.submit"
    }
  };
}

export function createM3BulkAppointmentCommand(
  input: ClientM3CommandContextInput
): BulkAppointOfficesCommandV1 {
  const eligibleItems = input.snapshot.bulkPreview.items.filter(
    (item) => item.status === "eligible"
  );
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.appoint-offices-bulk",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      items: eligibleItems.map((item) => ({
        itemId: item.itemId,
        officeId: Number(item.officeId),
        characterId: item.characterId === null ? null : Number(item.characterId),
        reasonCode: "client.m3.bulk-appointment.apply-eligible"
      }))
    }
  };
}

export function createM4CampaignReadModelFixture(
  revision = createClientReadModelRevision(1)
): ClientM4CampaignReadModelSnapshot {
  return projectM4CampaignReadModelFromProtocolReadModels(
    createM4CampaignProtocolProjectionFixture(Number(revision))
  );
}

export function createM4CampaignProtocolProjectionFixture(
  revision: number
): ClientM4CampaignProjectionInput {
  const day = 150;
  const campaignPlanId = 10;
  const secondaryCampaignPlanId = 11;
  const marchId = 701;
  const secondaryMarchId = 702;
  const siegeId = 801;
  const secondarySiegeId = 802;
  const withdrawalId = 901;
  const secondaryWithdrawalId = 902;
  const outcomeId = 1001;
  const secondaryOutcomeId = 1002;
  return {
    campaignPlans: {
      kind: "sim.list-m4-campaign-plans",
      day,
      revision,
      plans: [
        {
          campaignPlanId,
          owner: { kind: "polity", polityId: 1 },
          target: { kind: "district", districtId: 3 },
          objectiveKind: "besiege",
          status: "active",
          statusReasonCode: "campaign.objective.march-started",
          reasonCodes: ["campaign.reason.dry-season-range", "campaign.reason.target-fortified"],
          forecast: {
            status: "ready",
            earliestStartDay: 150,
            latestStartDay: 178,
            reasonCodes: ["campaign.forecast.start-range-open"]
          }
        },
        {
          campaignPlanId: secondaryCampaignPlanId,
          owner: { kind: "polity", polityId: 1 },
          target: { kind: "district", districtId: 2 },
          objectiveKind: "relieve",
          status: "active",
          statusReasonCode: "campaign.objective.march-started",
          reasonCodes: ["campaign.reason.defender-pressure"],
          forecast: {
            status: "ready",
            earliestStartDay: 151,
            latestStartDay: 184,
            reasonCodes: ["campaign.forecast.start-range-open"]
          }
        }
      ]
    },
    muster: {
      kind: "sim.list-m4-muster-commitments",
      day,
      revision,
      campaignPlanId,
      commitments: [
        {
          commitmentId: 101,
          campaignPlanId,
          promisedTroops: 80,
          dueDay: 146,
          plannedAssemblyDay: 148,
          assembledTroops: 60,
          delayedTroops: 20,
          refusedTroops: 0,
          releasedTroops: 0,
          status: "partial",
          statusReasonCode: "muster.response.partial-assembly",
          reasonCodes: ["muster.reason.obligation-request", "muster.response.partial-assembly"]
        },
        {
          commitmentId: 102,
          campaignPlanId,
          promisedTroops: 40,
          dueDay: 149,
          plannedAssemblyDay: 149,
          assembledTroops: 40,
          delayedTroops: 0,
          refusedTroops: 0,
          releasedTroops: 0,
          status: "assembled",
          statusReasonCode: "muster.response.assembled",
          reasonCodes: ["muster.reason.local-garrison", "muster.response.assembled"]
        }
      ],
      reasonCodes: ["muster.query.filtered-by-campaign"]
    },
    grain: {
      kind: "sim.preview-m4-grain-supply",
      day,
      revision,
      campaignPlanId,
      plannedTroops: 100,
      plannedMarchDays: 16,
      plannedStartDay: 150,
      grainRequired: 1_600,
      grainReserved: 1_120,
      grainAvailableToReserve: 2_300,
      expectedDaysOfSupply: 11,
      reservations: [
        {
          reservationId: 501,
          campaignPlanId,
          reservedAmount: 1_200,
          carriedAmount: 1_120,
          consumedAmount: 220,
          shortageAmount: 0,
          lossAmount: 80,
          lossReasonCode: "grain.loss.river-spoilage",
          expectedDaysOfSupply: 11,
          status: "carried",
          statusReasonCode: "grain.reserve.planned-campaign",
          reasonCodes: ["grain.reserve.planned-campaign", "grain.loss.river-spoilage"]
        },
        {
          reservationId: 502,
          campaignPlanId: secondaryCampaignPlanId,
          reservedAmount: 900,
          carriedAmount: 820,
          consumedAmount: 160,
          shortageAmount: 0,
          lossAmount: 80,
          lossReasonCode: "grain.loss.river-spoilage",
          expectedDaysOfSupply: 9,
          status: "carried",
          statusReasonCode: "grain.reserve.planned-campaign",
          reasonCodes: ["grain.reserve.planned-campaign", "grain.loss.river-spoilage"]
        }
      ],
      reasonCodes: ["grain.forecast.short-of-full-window", "grain.forecast.reserve-available"]
    },
    route: {
      kind: "sim.preview-m4-route-transport-capacity",
      day,
      revision,
      campaignPlanId,
      targetDistrictId: 3,
      plannedTroops: 100,
      carriedSupplyAvailable: 1_120,
      carriedSupplyLimit: 900,
      bottleneckCapacity: 900,
      sourceForecasts: [
        {
          reservationId: 501,
          originDistrictId: 1,
          destinationDistrictId: 3,
          status: "capacity-exceeded",
          carriedSupplyAmount: 1_120,
          carriedSupplyLimit: 900,
          bottleneckCapacity: 900,
          travelWindow: {
            earliestArrivalDay: 162,
            latestArrivalDay: 190,
            travelDays: 12
          },
          overloadedReasonCode: "route.capacity.carried-supply-over-bottleneck",
          seasonRiskReasonCodes: ["route.season.monsoon-risk", "route.season.river-navigation-risk"]
        },
        {
          reservationId: 502,
          originDistrictId: 1,
          destinationDistrictId: 2,
          status: "capacity-exceeded",
          carriedSupplyAmount: 820,
          carriedSupplyLimit: 700,
          bottleneckCapacity: 700,
          travelWindow: {
            earliestArrivalDay: 160,
            latestArrivalDay: 188,
            travelDays: 10
          },
          overloadedReasonCode: "route.capacity.carried-supply-over-bottleneck",
          seasonRiskReasonCodes: ["route.season.monsoon-risk", "route.season.river-navigation-risk"]
        }
      ],
      reasonCodes: ["route.forecast.carried-supply-over-bottleneck", "route.forecast.seasonal-risk"]
    },
    march: {
      kind: "sim.list-m4-march-state",
      day,
      revision,
      campaignPlanId,
      marches: [
        {
          marchId,
          campaignPlanId,
          originDistrictId: 1,
          targetDistrictId: 3,
          currentDistrictId: 2,
          activeTroops: 96,
          status: "marching",
          statusReasonCode: "march.status.en-route",
          supply: {
            status: "strained",
            carriedGrain: 900,
            consumedGrain: 220,
            shortageGrain: 0,
            delayedDays: 2
          },
          predictedArrivalWindow: {
            earliestDay: 162,
            latestDay: 190
          },
          actualArrivalDay: null,
          joinedCommitmentTroops: [
            { commitmentId: 101, joinedTroops: 60 },
            { commitmentId: 102, joinedTroops: 40 }
          ],
          failedCommitmentIds: [],
          reasonCodes: ["march.supply.strained", "reinforcement.timing.partial-late"]
        },
        {
          marchId: secondaryMarchId,
          campaignPlanId: secondaryCampaignPlanId,
          originDistrictId: 1,
          targetDistrictId: 2,
          currentDistrictId: 2,
          activeTroops: 68,
          status: "marching",
          statusReasonCode: "march.status.en-route",
          supply: {
            status: "strained",
            carriedGrain: 700,
            consumedGrain: 160,
            shortageGrain: 0,
            delayedDays: 1
          },
          predictedArrivalWindow: {
            earliestDay: 160,
            latestDay: 188
          },
          actualArrivalDay: null,
          joinedCommitmentTroops: [{ commitmentId: 102, joinedTroops: 40 }],
          failedCommitmentIds: [],
          reasonCodes: ["march.supply.strained", "reinforcement.timing.partial-late"]
        }
      ],
      reasonCodes: ["march.query.filtered-by-campaign"]
    },
    siege: {
      kind: "sim.list-m4-siege-state",
      day,
      revision,
      campaignPlanId,
      sieges: [
        {
          siegeId,
          campaignPlanId,
          marchId,
          targetDistrictId: 3,
          attackerPolityId: 1,
          defenderPolityId: 2,
          status: "active",
          statusReasonCode: "siege.status.invested",
          fortification: 420,
          defenderEstimatedTroops: 58,
          defenderSupply: 260,
          siegeProgress: 65,
          daysInvested: 9,
          attackerTroops: 92,
          attackerCasualties: 4,
          defenderCasualties: 11,
          supplyLoss: 90,
          surrenderEligible: false,
          surrenderReasonCodes: ["siege.surrender.not-yet"],
          reasonCodes: ["siege.choice.invest-blockade", "siege.progress.blockade"]
        },
        {
          siegeId: secondarySiegeId,
          campaignPlanId: secondaryCampaignPlanId,
          marchId: secondaryMarchId,
          targetDistrictId: 2,
          attackerPolityId: 1,
          defenderPolityId: 2,
          status: "active",
          statusReasonCode: "siege.status.invested",
          fortification: 360,
          defenderEstimatedTroops: 64,
          defenderSupply: 230,
          siegeProgress: 52,
          daysInvested: 7,
          attackerTroops: 66,
          attackerCasualties: 6,
          defenderCasualties: 10,
          supplyLoss: 72,
          surrenderEligible: false,
          surrenderReasonCodes: ["siege.surrender.not-yet"],
          reasonCodes: ["siege.choice.invest-blockade", "siege.progress.blockade"]
        }
      ],
      reasonCodes: ["siege.query.filtered-by-campaign"]
    },
    withdrawal: {
      kind: "sim.list-m4-withdrawal-state",
      day,
      revision,
      campaignPlanId,
      withdrawals: [
        {
          withdrawalId,
          campaignPlanId,
          marchId,
          siegeId,
          kind: "forced-retreat",
          triggerReason: "supply",
          troopsBefore: 92,
          troopsExtracted: 78,
          casualties: 14,
          supplyLoss: 260,
          reasonCodes: ["withdrawal.reason.supply-collapse", "withdrawal.cost.failed-baggage"],
          resolvedDay: 194
        },
        {
          withdrawalId: secondaryWithdrawalId,
          campaignPlanId: secondaryCampaignPlanId,
          marchId: secondaryMarchId,
          siegeId: secondarySiegeId,
          kind: "forced-retreat",
          triggerReason: "supply",
          troopsBefore: 66,
          troopsExtracted: 52,
          casualties: 14,
          supplyLoss: 180,
          reasonCodes: ["withdrawal.reason.supply-collapse", "withdrawal.cost.failed-baggage"],
          resolvedDay: 195
        }
      ],
      reasonCodes: ["withdrawal.query.filtered-by-campaign"]
    },
    warOutcomes: {
      kind: "sim.list-m4-war-outcomes",
      day,
      revision,
      campaignPlanId,
      outcomes: [
        {
          outcomeId,
          campaignPlanId,
          victorPolityId: 1,
          localPolityId: 2,
          targetDistrictId: 3,
          attackerCasualties: 18,
          defenderCasualties: 31,
          supplyLoss: 350,
          withdrawalId,
          siegeId,
          postwarCandidate: {
            candidateId: "m4.campaign.10.outcome.1",
            sourceWarOutcomeId: outcomeId,
            settlementId: "m4.campaign.10.settlement",
            victorPolityId: 1,
            localPolityId: 2,
            districtId: 3,
            validM3Methods: ["direct-control", "restore-vassal-ruler"],
            reasonCodes: ["postwar.candidate.from-war-outcome", "postwar.methods.m3-compatible"]
          },
          reasonCodes: [
            "war-outcome.siege-pressure",
            "war-outcome.withdrawal-supply",
            "postwar.candidate.ready"
          ],
          resolvedDay: 196
        },
        {
          outcomeId: secondaryOutcomeId,
          campaignPlanId: secondaryCampaignPlanId,
          victorPolityId: 1,
          localPolityId: 2,
          targetDistrictId: 2,
          attackerCasualties: 16,
          defenderCasualties: 28,
          supplyLoss: 310,
          withdrawalId: secondaryWithdrawalId,
          siegeId: secondarySiegeId,
          postwarCandidate: {
            candidateId: "m4.campaign.11.outcome.1",
            sourceWarOutcomeId: secondaryOutcomeId,
            settlementId: "m4.campaign.11.settlement",
            victorPolityId: 1,
            localPolityId: 2,
            districtId: 2,
            validM3Methods: ["direct-control", "restore-vassal-ruler"],
            reasonCodes: ["postwar.candidate.from-war-outcome", "postwar.methods.m3-compatible"]
          },
          reasonCodes: [
            "war-outcome.siege-pressure",
            "war-outcome.withdrawal-supply",
            "postwar.candidate.ready"
          ],
          resolvedDay: 197
        }
      ],
      reasonCodes: ["war-outcome.query.filtered-by-campaign"]
    },
    aiTrace: {
      schemaVersion: 1,
      actor: { kind: "ai", id: "polity:2" },
      observerPolityId: 2,
      day,
      revision,
      decisionKind: "withdraw",
      selectedCampaignPlanId: campaignPlanId,
      selectedCandidateId: "ai.withdraw.supply",
      commandKind: "sim.resolve-m4-campaign-withdrawal",
      commandId: "ai.m4.withdraw.1",
      primaryReasonCode: "m4.ai.withdraw.supply-collapse",
      reasonCodes: ["m4.ai.withdraw.supply-collapse", "m4.ai.wait.monsoon-risk"],
      candidates: [
        {
          candidateId: "ai.withdraw.supply",
          decisionKind: "withdraw",
          campaignPlanId,
          commandKind: "sim.resolve-m4-campaign-withdrawal",
          score: 92,
          reasonCodes: ["m4.ai.withdraw.supply-collapse"]
        },
        {
          candidateId: "ai.continue.siege",
          decisionKind: "continue",
          campaignPlanId,
          commandKind: "sim.apply-m4-siege-choice",
          score: 61,
          reasonCodes: ["m4.ai.continue.siege-pressure", "route.forecast.seasonal-risk"]
        }
      ]
    },
    catalog: createM4CampaignCatalogFixture()
  };
}

export function projectM4CampaignReadModelFromProtocolReadModels(
  input: ClientM4CampaignProjectionInput
): ClientM4CampaignReadModelSnapshot {
  const revision = createClientReadModelRevision(input.campaignPlans.revision);
  const plans = input.campaignPlans.plans.map((plan) => ({
    campaignPlanId: createClientCampaignPlanId(plan.campaignPlanId),
    owner: plan.owner,
    ownerLabel: formatM4OwnerLabel(plan.owner, input.catalog),
    target: plan.target,
    targetLabel: formatM4TargetLabel(plan.target, input.catalog),
    objectiveKind: plan.objectiveKind,
    status: plan.status,
    statusReasonCode: plan.statusReasonCode,
    forecast: plan.forecast,
    reasonCodes: plan.reasonCodes
  }));
  const selectedCampaignPlanId = plans[0]?.campaignPlanId ?? null;
  const muster = projectM4Muster(input.muster);
  const grain = projectM4Grain(input.grain);
  const route = projectM4Route(input.route);
  const marches = input.march.marches.map(projectM4March);
  const sieges = input.siege.sieges.map(projectM4Siege);
  const withdrawals = input.withdrawal.withdrawals.map(projectM4Withdrawal);
  const aiReason = projectM4AiReason(input.aiTrace);
  const warReports = input.warOutcomes.outcomes.map(projectM4WarReport);

  return {
    revision,
    day: input.campaignPlans.day,
    commandActor: input.catalog.commandActor,
    provenance: {
      kind: "protocol-query-projection",
      note: "M4 campaign workspace projected from protocol command/query read models; supply, route, siege, withdrawal, AI, and postwar reason codes are provided by simulation boundaries, not recalculated in UI."
    },
    selectedCampaignPlanId,
    commandDefaults: {
      nextCampaignPlanId: createClientCampaignPlanId(
        input.catalog.commandDefaults.nextCampaignPlanId
      ),
      nextMarchId: createClientCampaignMarchId(input.catalog.commandDefaults.nextMarchId),
      nextWithdrawalId: createClientWithdrawalId(input.catalog.commandDefaults.nextWithdrawalId),
      originDistrictId: createClientDistrictId(input.catalog.commandDefaults.originDistrictId),
      grainPerTroopPerDay: input.catalog.commandDefaults.grainPerTroopPerDay,
      withdrawalTrigger: input.catalog.commandDefaults.withdrawalTrigger
    },
    planningDraft: {
      owner: input.catalog.planningDraft.owner,
      ownerLabel: formatM4OwnerLabel(input.catalog.planningDraft.owner, input.catalog),
      target: input.catalog.planningDraft.target,
      targetLabel: formatM4TargetLabel(input.catalog.planningDraft.target, input.catalog),
      objectiveKind: input.catalog.planningDraft.objectiveKind,
      startWindow: input.catalog.planningDraft.startWindow,
      reasonCodes: input.catalog.planningDraft.reasonCodes
    },
    plans,
    muster,
    grain,
    route,
    marches,
    sieges,
    withdrawals,
    aiReason,
    warReports,
    reasonSummaries: summarizeM4ReasonCodes({
      plans,
      muster,
      grain,
      route,
      marches,
      sieges,
      withdrawals,
      aiReason,
      warReports
    })
  };
}

export function createM4CampaignPlanCommand(
  input: ClientM4CommandContextInput
): CreateCampaignObjectiveCommandV1 {
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.create-campaign-objective",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      campaignPlanId: Number(input.snapshot.commandDefaults.nextCampaignPlanId),
      owner: input.snapshot.planningDraft.owner,
      target: input.snapshot.planningDraft.target,
      objectiveKind: input.snapshot.planningDraft.objectiveKind,
      startWindow: input.snapshot.planningDraft.startWindow,
      reasonCodes: input.snapshot.planningDraft.reasonCodes
    }
  };
}

export function createM4CancelCampaignCommand(
  input: ClientM4CommandContextInput & { readonly campaignPlanId: ClientCampaignPlanId }
): CancelCampaignObjectiveCommandV1 {
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.cancel-campaign-objective",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      campaignPlanId: Number(input.campaignPlanId),
      reasonCode: "client.m4.cancel-before-rainy-season"
    }
  };
}

export function createM4StartMarchCommand(
  input: ClientM4CommandContextInput & { readonly campaignPlanId: ClientCampaignPlanId }
): StartCampaignMarchCommandV1 {
  const plan = findM4CampaignPlan(input.snapshot.plans, input.campaignPlanId);
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.start-campaign-march",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      marchId: Number(input.snapshot.commandDefaults.nextMarchId),
      campaignPlanId: Number(input.campaignPlanId),
      originDistrictId: Number(input.snapshot.commandDefaults.originDistrictId),
      plannedDepartureDay: plan?.forecast.earliestStartDay ?? input.snapshot.day,
      grainPerTroopPerDay: input.snapshot.commandDefaults.grainPerTroopPerDay,
      reasonCodes: ["client.m4.start-march.from-planner"]
    }
  };
}

export function createM4SiegeChoiceCommand(
  input: ClientM4CommandContextInput & {
    readonly siegeId: ClientSiegeId;
    readonly choice: M4SiegeChoiceV1;
  }
): ApplyM4SiegeChoiceCommandV1 {
  const siege = findM4Siege(input.snapshot.sieges, input.siegeId);
  if (siege === null) {
    throw new Error(`Missing M4 siege ${Number(input.siegeId)} for choice command.`);
  }
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.apply-m4-siege-choice",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      siegeId: Number(siege.siegeId),
      campaignPlanId: Number(siege.campaignPlanId),
      marchId: Number(siege.marchId),
      choice: input.choice,
      defenderPolityId: Number(siege.defenderPolityId),
      fortification: siege.fortification,
      defenderEstimatedTroops: siege.defenderEstimatedTroops,
      defenderSupply: siege.defenderSupply,
      reasonCodes: [`client.m4.siege-choice.${input.choice}`]
    }
  };
}

export function createM4WithdrawalCommand(
  input: ClientM4CommandContextInput & { readonly campaignPlanId: ClientCampaignPlanId }
): ResolveM4CampaignWithdrawalCommandV1 {
  const march = input.snapshot.marches.find(
    (candidate) => candidate.campaignPlanId === input.campaignPlanId
  );
  const siege = input.snapshot.sieges.find(
    (candidate) => candidate.campaignPlanId === input.campaignPlanId
  );
  return {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.resolve-m4-campaign-withdrawal",
    commandId: input.commandId,
    actor: input.snapshot.commandActor,
    expectedDay: input.snapshot.day,
    expectedRevision: Number(input.snapshot.revision),
    payload: {
      withdrawalId: Number(input.snapshot.commandDefaults.nextWithdrawalId),
      campaignPlanId: Number(input.campaignPlanId),
      marchId: march === undefined ? null : Number(march.marchId),
      siegeId: siege === undefined ? null : Number(siege.siegeId),
      triggerReason: input.snapshot.commandDefaults.withdrawalTrigger,
      reasonCodes: ["client.m4.withdraw.from-planner"]
    }
  };
}

export function findM4CampaignPlan(
  plans: readonly ClientM4CampaignPlanReadModel[],
  campaignPlanId: ClientCampaignPlanId
): ClientM4CampaignPlanReadModel | null {
  return plans.find((plan) => plan.campaignPlanId === campaignPlanId) ?? null;
}

export function findM4Siege(
  sieges: readonly ClientM4SiegeReadModel[],
  siegeId: ClientSiegeId
): ClientM4SiegeReadModel | null {
  return sieges.find((siege) => siege.siegeId === siegeId) ?? null;
}

export function createM5PlayableReadModelFixture(
  baseSnapshot: Pick<ClientReadModelSnapshot, "m4Campaign" | "revision" | "simulation">
): ClientM5PlayableReadModelSnapshot {
  const script = createM5PlayableLoopScriptV1();
  const steps = script.successCommands.map((command, index) =>
    createM5PlayableStep(command, index, "pending")
  );
  const firstStep = steps[0];
  const m4 = baseSnapshot.m4Campaign;
  const postwarMethods = collectM5PostwarMethods(m4.warReports);
  const postwarReasonCodes = m4.warReports.flatMap((report) => [
    ...report.reasonCodes,
    ...(report.postwarCandidate?.reasonCodes ?? [])
  ]);
  const seasonReasonCodes = m4.route.sourceForecasts.flatMap(
    (forecast) => forecast.seasonRiskReasonCodes
  );
  const withdrawalReasonCodes = m4.withdrawals.flatMap((withdrawal) => withdrawal.reasonCodes);

  return {
    revision: baseSnapshot.revision,
    scenarioId: "m5.composite.river-gate.v0",
    contentTag: "COMPOSITE_FICTIONAL_PLACEHOLDER",
    day: m4.day,
    stateHash: baseSnapshot.simulation.stateHash,
    commandActor: { kind: "player", id: "polity:1" },
    provenance: {
      kind: "m5-protocol-script-projection",
      note: "M5 playable client slice projected from accepted protocol command script and M3/M4 read models; UI owns only session progress and read-model slices."
    },
    goal: {
      primaryGoal:
        "Secure recognition over the contested target, settle postwar terms, and keep the arrangement stable through the visible checkpoint.",
      successConditions: [
        "Campaign produces a postwar or vassal arrangement for the contested target.",
        "The arrangement has explicit method, source-ledger, and stabilization evidence.",
        "Replay evidence preserves command sequence identity and visible state hash."
      ],
      failureConditions: [
        "Supply, season, siege, or withdrawal leaves no valid arrangement.",
        "Duplicate postwar settlement is rejected by protocol reason codes.",
        "A Human Gate such as manual node battle is required and not approved."
      ],
      outOfScope: [
        "Manual node battle UI is unavailable in M5.",
        "Telemetry, accounts, server, multiplayer, and release/commercial surfaces are absent."
      ]
    },
    replay: {
      bootFixture: script.boot.fixture,
      startHash: baseSnapshot.simulation.stateHash,
      currentHash: baseSnapshot.simulation.stateHash,
      commandCount: script.successCommands.length,
      checkpointLabel: firstStep?.stepId ?? "m5.no-command"
    },
    session: {
      phase: "not-started",
      currentStepIndex: 0,
      confirmedCommandIds: []
    },
    steps,
    failureStep: createM5PlayableStep(script.duplicatePostwarCommand, steps.length, "rejected"),
    ai: {
      decisionKind: m4.aiReason.decisionKind,
      commandKind: m4.aiReason.commandKind,
      primaryReasonCode: m4.aiReason.primaryReasonCode,
      reasonCodes: m4.aiReason.reasonCodes
    },
    risk: {
      campaignRiskLabel: m4.route.reasonCodes.includes("route.forecast.seasonal-risk")
        ? "seasonal route risk visible"
        : "campaign risk visible",
      routeReasonCodes: m4.route.reasonCodes,
      withdrawalReasonCodes
    },
    supply: {
      expectedDaysOfSupply: m4.grain.expectedDaysOfSupply,
      grainReserved: m4.grain.grainReserved,
      grainRequired: m4.grain.grainRequired,
      reasonCodes: m4.grain.reasonCodes
    },
    season: {
      windowLabel: formatM5Window(m4.planningDraft.startWindow),
      reasonCodes: seasonReasonCodes
    },
    postwar: {
      candidateCount: m4.warReports.filter((report) => report.postwarCandidate !== null).length,
      methods: postwarMethods,
      consequenceReasonCodes: postwarReasonCodes
    },
    reasonSummaries: summarizeM5ReasonCodes({
      steps,
      failureStep: createM5PlayableStep(script.duplicatePostwarCommand, steps.length, "rejected"),
      aiReasonCodes: [m4.aiReason.primaryReasonCode, ...m4.aiReason.reasonCodes],
      routeReasonCodes: m4.route.reasonCodes,
      supplyReasonCodes: m4.grain.reasonCodes,
      seasonReasonCodes,
      withdrawalReasonCodes,
      postwarReasonCodes
    })
  };
}

export function createM5SessionSave(input: {
  readonly snapshot: ClientM5PlayableReadModelSnapshot;
  readonly phase: ClientM5PlayablePhase;
  readonly currentStepIndex: number;
  readonly confirmedCommandIds: readonly string[];
}): string {
  const save: ClientM5SessionSaveV1 = {
    schemaVersion: 1,
    scenarioId: input.snapshot.scenarioId,
    phase: input.phase,
    currentStepIndex: input.currentStepIndex,
    confirmedCommandIds: input.confirmedCommandIds,
    checkpointLabel:
      input.snapshot.steps[input.currentStepIndex]?.stepId ?? input.snapshot.replay.checkpointLabel,
    stateHash: input.snapshot.replay.currentHash
  };

  return JSON.stringify(save);
}

export function parseM5SessionSave(input: string): ClientM5SessionSaveParseResult {
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    return {
      ok: false,
      reasonCode: "m5.save.invalid-json",
      message: "M5 client session save must be valid JSON."
    };
  }

  if (!isRecord(value)) {
    return {
      ok: false,
      reasonCode: "m5.save.invalid-shape",
      message: "M5 client session save must be an object."
    };
  }
  if (value["schemaVersion"] !== 1 || value["scenarioId"] !== "m5.composite.river-gate.v0") {
    return {
      ok: false,
      reasonCode: "m5.save.unsupported-version",
      message: "M5 client session save has an unsupported schema or scenario."
    };
  }

  const phase = parseM5PlayablePhase(value["phase"]);
  const currentStepIndex = value["currentStepIndex"];
  const confirmedCommandIds = value["confirmedCommandIds"];
  const checkpointLabel = value["checkpointLabel"];
  const stateHash = value["stateHash"];
  if (
    phase === null ||
    typeof currentStepIndex !== "number" ||
    !Number.isSafeInteger(currentStepIndex) ||
    currentStepIndex < 0 ||
    !Array.isArray(confirmedCommandIds) ||
    !confirmedCommandIds.every((entry) => typeof entry === "string") ||
    typeof checkpointLabel !== "string" ||
    typeof stateHash !== "string"
  ) {
    return {
      ok: false,
      reasonCode: "m5.save.invalid-fields",
      message: "M5 client session save fields are invalid."
    };
  }

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      scenarioId: "m5.composite.river-gate.v0",
      phase,
      currentStepIndex,
      confirmedCommandIds: confirmedCommandIds.filter((entry) => typeof entry === "string"),
      checkpointLabel,
      stateHash
    }
  };
}

export function createM6AlphaReadModelFixture(
  baseSnapshot: Pick<
    ClientReadModelSnapshot,
    | "districtList"
    | "m3Appointment"
    | "m4Campaign"
    | "m5Playable"
    | "map"
    | "revision"
    | "simulation"
  >
): ClientM6AlphaReadModelSnapshot {
  const script = createM6AlphaStartToVictoryScriptV1();
  const commands = [
    ...script.commandsBeforeMidRunSave,
    ...script.commandsAfterMidRunSave,
    script.victoryTerminalCommand
  ];
  const steps = commands.map((command, index) => createM6AlphaStep(command, index, "pending"));
  const firstPolicyStep = steps.find((step) => step.stage === "policy-event");
  const firstDiplomacyStep = steps.find((step) => step.stage === "diplomacy");
  const firstTerminalStep = steps.find((step) => step.stage === "terminal");
  const m4 = baseSnapshot.m4Campaign;
  const m3 = baseSnapshot.m3Appointment;
  const terminalEvidence: ClientM6TerminalEvidenceReadModel = {
    recognizedByCount: 1,
    legitimacyScoreBps: 1_150,
    postwarArrangementCount: m4.warReports.filter((report) => report.postwarCandidate !== null)
      .length,
    resolvedPolicyEventCount: 1,
    successionResolvedCount: m3.successionCrises.filter((crisis) => crisis.status === "resolved")
      .length,
    routeCount: Math.max(2, baseSnapshot.map.routes.length),
    populationGroupCount: Math.max(3, baseSnapshot.districtList.rows.length)
  };
  const diplomacy = createM6DiplomacyFixture(script);
  const legitimacy = createM6LegitimacyFixture();
  const succession = createM6SuccessionFixture(m3);
  const policies = createM6PolicyEventFixture(firstPolicyStep);
  const encyclopedia = createM6EncyclopediaFixture();
  const adviser = createM6AdviserFixture(m4, firstDiplomacyStep);
  const mapCandidate = createM6MapCandidateFixture(baseSnapshot);
  const terminal: ClientM6TerminalReadModel = {
    outcome: "victory",
    evaluatedDay: 25,
    evaluatedRevision: 22,
    maxDay: 60,
    canPursueVictory: true,
    evidence: terminalEvidence,
    reasonCodes: [
      "m6.alpha.terminal.assess",
      "m6.recognized-order.diplomatic-recognition",
      "m6.recognized-order.legitimacy-sufficient",
      "m6.recognized-order.postwar-evidence-present"
    ]
  };

  return {
    revision: baseSnapshot.revision,
    scenarioId: "m6.alpha.recognized-order.v0",
    contentTag: "COMPOSITE_FICTIONAL_ALPHA",
    day: 25,
    stateHash: baseSnapshot.simulation.stateHash,
    commandActor: { kind: "player", id: "polity:1" },
    provenance: {
      kind: "m6-protocol-script-and-query-projection",
      note: "M6 Alpha client slice projected from protocol command/query DTOs, M3-M5 read models, and map candidate read models; the client owns only session progress."
    },
    scenarios: createM6ScenarioFixtures(baseSnapshot.simulation.stateHash),
    selectedScenarioId: "m6.alpha.recognized-order.v0",
    goal: {
      primaryGoal:
        "Start an Alpha scenario, secure a recognized order, resolve succession pressure, answer one policy event, and evaluate victory through the protocol terminal command.",
      victoryRequirements: [
        "Diplomacy creates recognition rather than only changing map control.",
        "Legitimacy has source-coded support from succession or postwar evidence.",
        "Postwar or vassal governance terms remain visible through the stabilization checkpoint.",
        "Policy/event and encyclopedia references are selected through command/query surfaces."
      ],
      failureConditions: [
        "Recognition is missing or legitimacy remains insufficient.",
        "Succession is unresolved when the terminal command is evaluated.",
        "Policy/event choice removes the legal route to recognized settlement.",
        "Save/load checkpoint or deterministic command sequence evidence is missing."
      ],
      excludedSurfaces: [
        "Manual node battle UI is not present in Alpha.",
        "Telemetry, accounts, server, multiplayer, desktop file bridge, and arbitrary-code mod UI are absent."
      ]
    },
    replay: {
      bootFixture: script.boot.fixture,
      startHash: baseSnapshot.simulation.stateHash,
      currentHash: baseSnapshot.simulation.stateHash,
      commandCount: steps.length,
      midRunCheckpointLabel:
        steps[script.commandsBeforeMidRunSave.length]?.stepId ?? "m6.alpha.mid-run-checkpoint",
      terminalCheckpointLabel: firstTerminalStep?.stepId ?? "m6.alpha.terminal"
    },
    session: {
      phase: "scenario-selection",
      currentStepIndex: 0,
      confirmedCommandIds: []
    },
    steps,
    failureStep: createM6AlphaStep(script.defeatTerminalCommand, steps.length, "rejected"),
    diplomacy,
    legitimacy,
    succession,
    policies,
    encyclopedia,
    adviser,
    mapCandidate,
    terminal,
    reasonSummaries: summarizeM6ReasonCodes({
      steps,
      failureStep: createM6AlphaStep(script.defeatTerminalCommand, steps.length, "rejected"),
      diplomacyReasonCodes: [
        ...diplomacy.reasonCodes,
        ...diplomacy.relations.flatMap((relation) => relation.reasonCodes),
        ...diplomacy.agreements.flatMap((agreement) => agreement.reasonCodes),
        ...diplomacy.recognitionEdges.map((edge) => edge.reasonCode)
      ],
      legitimacyReasonCodes: [
        ...legitimacy.reasonCodes,
        ...legitimacy.sources.map((source) => source.reasonCode)
      ],
      successionReasonCodes: succession.continuityReasonCodes,
      policyReasonCodes: [
        ...policies.reasonCodes,
        ...policies.activeEvents.flatMap((event) => [
          ...event.causeReasonCodes,
          ...event.options.flatMap((option) => [
            ...option.reasonCodes,
            ...option.consequenceReasonCodes
          ])
        ]),
        ...policies.resolvedEvents.flatMap((event) => event.reasonCodes),
        ...policies.modifiers.map((modifier) => modifier.reasonCode)
      ],
      encyclopediaReasonCodes: encyclopedia.entries.flatMap((entry) => entry.linkedReasonCodes),
      adviserReasonCodes: [
        adviser.primaryReasonCode,
        ...adviser.reasonCodes,
        ...adviser.candidates.flatMap((candidate) => candidate.reasonCodes)
      ],
      mapReasonCodes: mapCandidate.reasonCodes,
      terminalReasonCodes: terminal.reasonCodes
    })
  };
}

export function createM6AlphaEmptyReadModelFixture(
  baseSnapshot: ClientReadModelSnapshot
): ClientM6AlphaReadModelSnapshot {
  return {
    ...createEmptyM6AlphaReadModel(baseSnapshot.revision),
    stateHash: baseSnapshot.simulation.stateHash,
    replay: {
      bootFixture: "m6.alpha-start-to-victory-001",
      startHash: baseSnapshot.simulation.stateHash,
      currentHash: baseSnapshot.simulation.stateHash,
      commandCount: 0,
      midRunCheckpointLabel: "m6.alpha.empty",
      terminalCheckpointLabel: "m6.alpha.empty"
    },
    provenance: {
      kind: "m6-protocol-script-and-query-projection",
      note: "Empty M6 Alpha read-model state for Storybook and UI regression coverage."
    }
  };
}

export function createM6AlphaErrorReadModelFixture(
  baseSnapshot: ClientReadModelSnapshot
): ClientM6AlphaReadModelSnapshot {
  const fixture = createM6AlphaReadModelFixture(baseSnapshot);
  return {
    ...fixture,
    session: {
      ...fixture.session,
      phase: "failure"
    },
    terminal: {
      ...fixture.terminal,
      outcome: "defeat",
      canPursueVictory: false,
      evidence: {
        ...fixture.terminal.evidence,
        recognizedByCount: 0,
        legitimacyScoreBps: 250,
        postwarArrangementCount: 0
      },
      reasonCodes: [
        "m6.alpha.terminal.assess",
        "m6.recognized-order.recognition-missing",
        "m6.recognized-order.legitimacy-insufficient"
      ]
    },
    goal: {
      ...fixture.goal,
      primaryGoal: "Recover from a failed Alpha recognized-order attempt."
    }
  };
}

export function createM6AlphaExtremeReadModelFixture(
  baseSnapshot: ClientReadModelSnapshot
): ClientM6AlphaReadModelSnapshot {
  const fixture = createM6AlphaReadModelFixture(baseSnapshot);
  const extraScenarios: ClientM6ScenarioReadModel[] = [];
  for (let index = 0; index < 12; index += 1) {
    extraScenarios.push({
      scenarioId: `m6.alpha.pressure.${index + 1}`,
      label: `Alpha pressure route ${index + 1}`,
      scenarioKind: index % 2 === 0 ? "pressure-variant" : "recovery-or-failure",
      startDay: index * 15,
      seed: 1531 + index,
      startHash: fixture.replay.startHash,
      reasonCodes: ["m6.scenario.pressure", `m6.scenario.seed.${1531 + index}`]
    });
  }

  return {
    ...fixture,
    scenarios: [...fixture.scenarios, ...extraScenarios],
    policies: {
      ...fixture.policies,
      activeEvents: [
        ...fixture.policies.activeEvents,
        ...extraScenarios.slice(0, 4).map((scenario, index) => ({
          eventInstanceId: index + 10,
          title: scenario.label,
          causeReasonCodes: ["policy.event.cause.alpha-pressure"],
          options: [
            {
              optionId: index + 10,
              label: "Defer settlement review",
              reasonCodes: ["policy.event.option.defer"],
              consequenceReasonCodes: ["policy.event.consequence.obligation-risk"]
            }
          ],
          encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor"]
        }))
      ]
    }
  };
}

export function withM6AlphaReadModel(
  snapshot: ClientReadModelSnapshot,
  m6Alpha: ClientM6AlphaReadModelSnapshot
): ClientReadModelSnapshot {
  return {
    ...snapshot,
    m6Alpha
  };
}

export function withM7GuidanceReadModel(
  snapshot: ClientReadModelSnapshot,
  m7Guidance: ClientM7GuidanceReadModelSnapshot
): ClientReadModelSnapshot {
  return {
    ...snapshot,
    m7Guidance
  };
}

export function createM7GuidanceReadModelFixture(
  baseSnapshot: Pick<
    ClientReadModelSnapshot,
    "revision" | "districtList" | "m3Appointment" | "m4Campaign" | "m5Playable" | "m6Alpha"
  >
): ClientM7GuidanceReadModelSnapshot {
  const pack: ClientM7RuntimeContentPack = M7_BETA_GUIDANCE_SOURCE;
  assertM7GuidanceSourceCounts(pack);
  const index = createClientM7RuntimeContentPackIndex(pack);
  const localizationByKey = new Map(pack.localization.map((entry) => [entry.key, entry.english]));
  const scenarios = pack.scenarios.map((scenario) =>
    createM7ScenarioGuidance({ scenario, localizationByKey })
  );
  const selectedScenario = scenarios[0];
  if (selectedScenario === undefined) {
    throw new Error("M7 guidance content pack must contain at least one scenario.");
  }

  const encyclopedia = createM7EncyclopediaReadModel(baseSnapshot, pack, index);
  const tutorial = createM7TutorialReadModel(baseSnapshot, selectedScenario, encyclopedia);
  const hints = createM7HintReadModel(baseSnapshot, selectedScenario, encyclopedia);
  const audioArtLocalization = createM7AudioArtLocalizationCoverageReadModel(pack);

  return {
    revision: baseSnapshot.revision,
    selectedScenarioId: selectedScenario.scenarioId,
    provenance: {
      kind: "m7-beta-content-records-and-client-read-model",
      note: "M7 Beta guidance is projected from accepted client read-model slices plus content-record-shaped M7 review records; the client does not own simulation rules or formal content-lock acceptance."
    },
    contentPack: {
      fixtureId: pack.fixtureId,
      manifestHash: pack.fixtureId,
      scenarioCount: pack.scenarios.length,
      personCount: pack.persons.length,
      eventCount: pack.events.length,
      knownGapCount: pack.knownGaps.length,
      notContentLockAcceptance: pack.notContentLockAcceptance,
      m6GateCarryForward: pack.m6GateCarryForward,
      manualNodeBattleDecision: pack.manualNodeBattleDecision
    },
    scenarios,
    tutorial,
    hints,
    encyclopedia,
    audioArtLocalization,
    reviewSummary: createM7ReviewSummary(pack)
  };
}

export function createM7GuidanceEmptyReadModelFixture(
  baseSnapshot: Pick<ClientReadModelSnapshot, "revision">
): ClientM7GuidanceReadModelSnapshot {
  return createEmptyM7GuidanceReadModel(baseSnapshot.revision);
}

export function createM7GuidanceErrorReadModelFixture(
  baseSnapshot: Pick<
    ClientReadModelSnapshot,
    "revision" | "districtList" | "m3Appointment" | "m4Campaign" | "m5Playable" | "m6Alpha"
  >
): ClientM7GuidanceReadModelSnapshot {
  const fixture = createM7GuidanceReadModelFixture(baseSnapshot);
  return {
    ...fixture,
    selectedScenarioId: "scenario.beta.1581.succession-fracture",
    provenance: {
      ...fixture.provenance,
      note: `${fixture.provenance.note} Error fixture: review gates remain visible and block any formal content-lock claim.`
    },
    reviewSummary: {
      ...fixture.reviewSummary,
      blockedScopeNotes: [
        ...fixture.reviewSummary.blockedScopeNotes,
        "CULTURE_HUMAN_GATE_REQUIRED content is surfaced as risk context only."
      ]
    }
  };
}

export function createM7GuidanceExtremeReadModelFixture(
  baseSnapshot: Pick<
    ClientReadModelSnapshot,
    "revision" | "districtList" | "m3Appointment" | "m4Campaign" | "m5Playable" | "m6Alpha"
  >
): ClientM7GuidanceReadModelSnapshot {
  const fixture = createM7GuidanceReadModelFixture(baseSnapshot);
  const extraTutorialSteps: ClientM7TutorialStepReadModel[] = [];
  const extraEntries: ClientM7EncyclopediaEntryReadModel[] = [];
  for (let index = 0; index < 12; index += 1) {
    const suffix = (index + 1).toString().padStart(2, "0");
    extraTutorialSteps.push({
      stepId: `m7.tutorial.extreme.${suffix}`,
      milestone: index % 2 === 0 ? "M4" : "M6",
      title: `Extreme review pass ${suffix}`,
      summary:
        "Stress guidance repeats accepted command previews, reason chips, and review-state badges without creating new rules.",
      commandKind: index % 2 === 0 ? "sim.start-campaign-march" : "sim.evaluate-m6-alpha-outcome",
      querySurface: "client.m7.guidance.extreme",
      reasonCodes: ["m7.guidance.extreme", `m7.guidance.extreme.${suffix}`],
      encyclopediaRefs: ["encyclopedia.m7.review-labels"],
      reviewState: "SCHEMA_VALIDATED",
      contentLabel: "COMPOSITE"
    });
    extraEntries.push({
      entryId: `encyclopedia.m7.extreme.${suffix}`,
      title: `Extreme encyclopedia review ${suffix}`,
      systemMilestone: index % 2 === 0 ? "M4" : "M7",
      contentLabel: "COMPOSITE",
      confidence: "LOW",
      reviewState: "SCHEMA_VALIDATED",
      summary:
        "Stress entry for narrow and high-DPI layout checks; evidence stays in the read-model surface.",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-001-SCOPE"],
      linkedReasonCodes: ["m7.guidance.extreme"],
      contentRecordRefs: ["content.m7.beta.hook.encyclopedia.review_labels"]
    });
  }

  return {
    ...fixture,
    tutorial: {
      steps: [...fixture.tutorial.steps, ...extraTutorialSteps]
    },
    encyclopedia: {
      ...fixture.encyclopedia,
      entries: [...fixture.encyclopedia.entries, ...extraEntries]
    }
  };
}

export function createM6SessionSave(input: {
  readonly snapshot: ClientM6AlphaReadModelSnapshot;
  readonly phase: ClientM6AlphaPhase;
  readonly currentStepIndex: number;
  readonly confirmedCommandIds: readonly string[];
}): string {
  const save: ClientM6SessionSaveV1 = {
    schemaVersion: 1,
    scenarioId: input.snapshot.scenarioId,
    phase: input.phase,
    currentStepIndex: input.currentStepIndex,
    confirmedCommandIds: input.confirmedCommandIds,
    checkpointLabel:
      input.snapshot.steps[input.currentStepIndex]?.stepId ??
      input.snapshot.replay.terminalCheckpointLabel,
    stateHash: input.snapshot.replay.currentHash,
    terminalOutcome: input.snapshot.terminal.outcome
  };

  return JSON.stringify(save);
}

export function parseM6SessionSave(input: string): ClientM6SessionSaveParseResult {
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    return {
      ok: false,
      reasonCode: "m6.save.invalid-json",
      message: "M6 client session save must be valid JSON."
    };
  }

  if (!isRecord(value)) {
    return {
      ok: false,
      reasonCode: "m6.save.invalid-shape",
      message: "M6 client session save must be an object."
    };
  }
  if (value["schemaVersion"] !== 1 || value["scenarioId"] !== "m6.alpha.recognized-order.v0") {
    return {
      ok: false,
      reasonCode: "m6.save.unsupported-version",
      message: "M6 client session save has an unsupported schema or scenario."
    };
  }

  const phase = parseM6AlphaPhase(value["phase"]);
  const currentStepIndex = value["currentStepIndex"];
  const confirmedCommandIds = value["confirmedCommandIds"];
  const checkpointLabel = value["checkpointLabel"];
  const stateHash = value["stateHash"];
  const terminalOutcome = parseM6TerminalOutcome(value["terminalOutcome"]);
  if (
    phase === null ||
    typeof currentStepIndex !== "number" ||
    !Number.isSafeInteger(currentStepIndex) ||
    currentStepIndex < 0 ||
    !Array.isArray(confirmedCommandIds) ||
    !confirmedCommandIds.every((entry) => typeof entry === "string") ||
    typeof checkpointLabel !== "string" ||
    typeof stateHash !== "string" ||
    terminalOutcome === null
  ) {
    return {
      ok: false,
      reasonCode: "m6.save.invalid-fields",
      message: "M6 client session save fields are invalid."
    };
  }

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      scenarioId: "m6.alpha.recognized-order.v0",
      phase,
      currentStepIndex,
      confirmedCommandIds: confirmedCommandIds.filter((entry) => typeof entry === "string"),
      checkpointLabel,
      stateHash,
      terminalOutcome
    }
  };
}

export function getM6CurrentStep(
  snapshot: ClientM6AlphaReadModelSnapshot,
  currentStepIndex: number
): ClientM6AlphaStepReadModel | null {
  return snapshot.steps[currentStepIndex] ?? null;
}

export function getM5CurrentStep(
  snapshot: ClientM5PlayableReadModelSnapshot,
  currentStepIndex: number
): ClientM5PlayableStepReadModel | null {
  return snapshot.steps[currentStepIndex] ?? null;
}

export function findM3Office(
  offices: readonly ClientM3OfficeReadModel[],
  officeId: ClientOfficeId
): ClientM3OfficeReadModel | null {
  return offices.find((office) => office.officeId === officeId) ?? null;
}

export function findM3Character(
  characters: readonly ClientM3CharacterReadModel[],
  characterId: ClientCharacterId | null
): ClientM3CharacterReadModel | null {
  if (characterId === null) {
    return null;
  }

  return characters.find((character) => character.characterId === characterId) ?? null;
}

function createEmptyM6AlphaReadModel(
  revision: ClientReadModelRevision
): ClientM6AlphaReadModelSnapshot {
  const emptyCommand: AuthoritativeGameCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.evaluate-m6-alpha-outcome",
    commandId: "m6.empty.terminal",
    actor: { kind: "player", id: "polity:1" },
    expectedDay: 0,
    expectedRevision: Number(revision),
    payload: {
      terminalStateId: 1,
      polityId: 1,
      maxDay: 0,
      reasonCode: "m6.alpha.not-started"
    }
  };
  const failureStep = createM6AlphaStep(emptyCommand, 0, "rejected");

  return {
    revision,
    scenarioId: "m6.alpha.recognized-order.v0",
    contentTag: "COMPOSITE_FICTIONAL_ALPHA",
    day: 0,
    stateHash: "not-started",
    commandActor: { kind: "player", id: "polity:1" },
    provenance: {
      kind: "m6-protocol-script-and-query-projection",
      note: "No M6 Alpha read-model slice has been projected yet."
    },
    scenarios: [],
    selectedScenarioId: "m6.alpha.recognized-order.v0",
    goal: {
      primaryGoal: "Select an Alpha scenario.",
      victoryRequirements: [],
      failureConditions: [],
      excludedSurfaces: [
        "Manual node battle UI is not present in Alpha.",
        "Telemetry, accounts, server, multiplayer, and arbitrary-code mod UI are absent."
      ]
    },
    replay: {
      bootFixture: "m6.alpha-start-to-victory-001",
      startHash: "not-started",
      currentHash: "not-started",
      commandCount: 0,
      midRunCheckpointLabel: "m6.not-started",
      terminalCheckpointLabel: "m6.not-started"
    },
    session: {
      phase: "scenario-selection",
      currentStepIndex: 0,
      confirmedCommandIds: []
    },
    steps: [],
    failureStep,
    diplomacy: {
      day: 0,
      observerPolityId: createClientPolityId(1),
      relations: [],
      agreements: [],
      recognitionEdges: [],
      reasonCodes: ["m6.diplomacy.not-started"]
    },
    legitimacy: {
      polityId: createClientPolityId(1),
      audience: "vassal-rulers",
      scoreBps: 0,
      pressureBps: 0,
      sources: [],
      reasonCodes: ["m6.legitimacy.not-started"]
    },
    succession: {
      status: "pending",
      crisisCount: 0,
      resolvedCount: 0,
      candidateCount: 0,
      continuityReasonCodes: ["m6.succession.not-started"]
    },
    policies: {
      activeEvents: [],
      resolvedEvents: [],
      modifiers: [],
      reasonCodes: ["m6.policy.not-started"]
    },
    encyclopedia: {
      entries: [],
      selectedEntryId: "encyclopedia.m6.none"
    },
    adviser: {
      decisionKind: "no-action",
      commandKind: null,
      primaryReasonCode: "m6.adviser.not-started",
      candidates: [],
      reasonCodes: []
    },
    mapCandidate: {
      candidateSourceId: "map.alpha.none",
      displayName: "No Alpha map candidate selected",
      sourceLabel: "FICTIONAL",
      districtCount: 0,
      settlementCount: 0,
      routeCount: 0,
      selectedDistrictIds: [],
      reasonCodes: ["m6.map.not-started"]
    },
    terminal: {
      outcome: "continued-play",
      evaluatedDay: 0,
      evaluatedRevision: Number(revision),
      maxDay: 0,
      canPursueVictory: false,
      evidence: {
        recognizedByCount: 0,
        legitimacyScoreBps: 0,
        postwarArrangementCount: 0,
        resolvedPolicyEventCount: 0,
        successionResolvedCount: 0,
        routeCount: 0,
        populationGroupCount: 0
      },
      reasonCodes: ["m6.alpha.not-started"]
    },
    reasonSummaries: []
  };
}

function createEmptyM7GuidanceReadModel(
  revision: ClientReadModelRevision
): ClientM7GuidanceReadModelSnapshot {
  return {
    revision,
    selectedScenarioId: "scenario.beta.none",
    provenance: {
      kind: "m7-beta-content-records-and-client-read-model",
      note: "No M7 Beta guidance read-model slice has been projected yet."
    },
    contentPack: {
      fixtureId: "m7.beta.guidance.empty",
      manifestHash: "00000000",
      scenarioCount: 0,
      personCount: 0,
      eventCount: 0,
      knownGapCount: 0,
      notContentLockAcceptance: true,
      m6GateCarryForward: "PASS_WITH_LIMITS",
      manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE"
    },
    scenarios: [],
    tutorial: {
      steps: []
    },
    hints: {
      groups: []
    },
    encyclopedia: {
      selectedEntryId: "encyclopedia.m7.none",
      entries: []
    },
    audioArtLocalization: createEmptyM7AudioArtLocalizationCoverageReadModel(),
    reviewSummary: {
      reviewStateCounts: [],
      humanGateClaimCount: 0,
      knownGaps: [],
      blockedScopeNotes: [
        "Manual node battle remains DEFER_MANUAL_NODE_BATTLE.",
        "Formal content lock acceptance is not part of this read-model."
      ]
    }
  };
}

function createM7ScenarioGuidance(input: {
  readonly scenario: ClientM7RuntimeScenarioRecord;
  readonly localizationByKey: ReadonlyMap<string, string>;
}): ClientM7ScenarioGuidanceReadModel {
  const tutorialHook = input.scenario.hooks.find((hook) => hook.hookKind === "tutorial");
  const encyclopediaHook = input.scenario.hooks.find((hook) => hook.hookKind === "encyclopedia");
  return {
    scenarioId: input.scenario.scenarioId,
    label: readM7LocalizedText(input.localizationByKey, input.scenario.displayNameKey),
    startYear: input.scenario.startYear,
    contentLabel: input.scenario.label,
    confidence: input.scenario.confidence,
    reviewState: input.scenario.reviewState,
    hookIds: input.scenario.hooks.map((hook) => hook.hookId),
    tutorialHookText:
      tutorialHook === undefined
        ? "No tutorial hook is available for this scenario."
        : readM7LocalizedText(input.localizationByKey, tutorialHook.localizationKey),
    encyclopediaHookText:
      encyclopediaHook === undefined
        ? "No encyclopedia hook is available for this scenario."
        : readM7LocalizedText(input.localizationByKey, encyclopediaHook.localizationKey),
    linkedClaimIds: input.scenario.claimIds
  };
}

function createM7TutorialReadModel(
  baseSnapshot: Pick<
    ClientReadModelSnapshot,
    "districtList" | "m3Appointment" | "m4Campaign" | "m5Playable" | "m6Alpha"
  >,
  selectedScenario: ClientM7ScenarioGuidanceReadModel,
  encyclopedia: ClientM7EncyclopediaReadModel
): ClientM7TutorialReadModel {
  const firstM5Step = baseSnapshot.m5Playable.steps[0] ?? null;
  const firstM6Step = baseSnapshot.m6Alpha.steps[0] ?? null;
  const firstM4Plan = baseSnapshot.m4Campaign.plans[0] ?? null;
  const firstM3Reason = baseSnapshot.m3Appointment.reasonSummaries[0]?.reasonCode;
  const routeReason = baseSnapshot.m4Campaign.route.reasonCodes[0] ?? "route.forecast.none";
  const m7EntryIds = encyclopedia.entries.map((entry) => entry.entryId);

  return {
    steps: [
      {
        stepId: "m7.tutorial.m1.command-query-save",
        milestone: "M1",
        title: "Command, query, and checkpoint authority",
        summary: `Read the current state hash ${baseSnapshot.m6Alpha.replay.currentHash}; tutorial progress is client-only and commands still go through DTO previews.`,
        commandKind: "sim.verify-state-hash",
        querySurface: "simulation.stateHash",
        reasonCodes: ["m1.determinism.state-hash", "client.session.checkpoint-only"],
        encyclopediaRefs: ["encyclopedia.m7.m1-authority"],
        reviewState: "SCHEMA_VALIDATED",
        contentLabel: "FICTIONAL"
      },
      {
        stepId: "m7.tutorial.m2.map-economy-routes",
        milestone: "M2",
        title: "Map, economy, and route pressure",
        summary: `Inspect ${baseSnapshot.districtList.rows.length} district rows and route forecasts before reading campaign hints.`,
        commandKind: null,
        querySurface: "districtList.rows + map.routes",
        reasonCodes: [routeReason, "m2.routes.read-model-visible"],
        encyclopediaRefs: ["encyclopedia.m7.m2-map-economy-routes"],
        reviewState: "SCHEMA_VALIDATED",
        contentLabel: "FICTIONAL"
      },
      {
        stepId: "m7.tutorial.m3-offices-obligations",
        milestone: "M3",
        title: "Offices, obligations, and succession",
        summary: `Use appointment previews and visible rejection reasons; first visible reason is ${firstM3Reason ?? "none"}.`,
        commandKind: "sim.appoint-office",
        querySurface: "m3Appointment.reasonSummaries",
        reasonCodes: [firstM3Reason ?? "m3.appointment.no-reason", "succession.designation"],
        encyclopediaRefs: ["encyclopedia.m7.m3-governance"],
        reviewState: "SCHEMA_VALIDATED",
        contentLabel: "FICTIONAL"
      },
      {
        stepId: "m7.tutorial.m4-campaign-postwar",
        milestone: "M4",
        title: "Campaign logistics, siege, and postwar handoff",
        summary: `Preview ${firstM4Plan?.targetLabel ?? "campaign target"} with AI and withdrawal reasons before confirming campaign commands.`,
        commandKind: "sim.create-campaign-objective",
        querySurface: "m4Campaign.plans + m4Campaign.aiReason",
        reasonCodes: [
          baseSnapshot.m4Campaign.aiReason.primaryReasonCode,
          "postwar.candidate.ready"
        ],
        encyclopediaRefs: ["encyclopedia.m7.m4-campaign-loop"],
        reviewState: "SCHEMA_VALIDATED",
        contentLabel: "FICTIONAL"
      },
      {
        stepId: "m7.tutorial.m5-playable-loop",
        milestone: "M5",
        title: "Playable slice flow",
        summary: `Run the accepted M5 sequence through preview and confirm; the first command is ${firstM5Step?.preview.commandKind ?? "unavailable"}.`,
        commandKind: firstM5Step?.command.kind ?? null,
        querySurface: "m5Playable.steps",
        reasonCodes: firstM5Step?.reasonCodes ?? ["m5.slice.no-step"],
        encyclopediaRefs: ["encyclopedia.m7.m5-playable-loop"],
        reviewState: "SCHEMA_VALIDATED",
        contentLabel: "COMPOSITE"
      },
      {
        stepId: "m7.tutorial.m6-alpha-victory",
        milestone: "M6",
        title: "Alpha recognized-order surfaces",
        summary: `Follow diplomacy, legitimacy, succession, policy, adviser, and terminal panels; first Alpha command is ${firstM6Step?.preview.commandKind ?? "unavailable"}.`,
        commandKind: firstM6Step?.command.kind ?? null,
        querySurface: "m6Alpha.steps + m6Alpha.reasonSummaries",
        reasonCodes: [
          baseSnapshot.m6Alpha.adviser.primaryReasonCode,
          ...baseSnapshot.m6Alpha.terminal.reasonCodes.slice(0, 2)
        ],
        encyclopediaRefs: ["encyclopedia.m7.m6-alpha-surfaces"],
        reviewState: "SCHEMA_VALIDATED",
        contentLabel: "COMPOSITE"
      },
      {
        stepId: "m7.tutorial.m7-content-review",
        milestone: "M7",
        title: "Beta content review labels",
        summary: `${selectedScenario.tutorialHookText} Selected scenario ${selectedScenario.label} carries ${selectedScenario.reviewState}.`,
        commandKind: null,
        querySurface: "m7Guidance.scenarios + contentPack.reviewState",
        reasonCodes: ["m7.guidance.review-state-visible", "m7.content-lock.not-accepted"],
        encyclopediaRefs: m7EntryIds.slice(0, 3),
        reviewState: selectedScenario.reviewState,
        contentLabel: selectedScenario.contentLabel
      }
    ]
  };
}

function createM7HintReadModel(
  baseSnapshot: Pick<
    ClientReadModelSnapshot,
    "m3Appointment" | "m4Campaign" | "m5Playable" | "m6Alpha"
  >,
  selectedScenario: ClientM7ScenarioGuidanceReadModel,
  encyclopedia: ClientM7EncyclopediaReadModel
): ClientM7HintReadModel {
  const firstRejected = baseSnapshot.m3Appointment.reasonSummaries.find((summary) =>
    summary.sourceKinds.includes("bulk")
  );
  const firstM5Step = baseSnapshot.m5Playable.steps[0] ?? null;
  const firstM6PolicyEntry = baseSnapshot.m6Alpha.encyclopedia.entries.find((entry) =>
    entry.entryId.includes("policy_event")
  );
  return {
    groups: [
      {
        groupId: "m7.hints.map-and-economy",
        title: "Map and economy context",
        surface: "M2 district operations",
        hints: [
          {
            hintId: "m7.hint.route-risk",
            text: "Route hints mirror forecast reason chips and never recalculate seasonal capacity in the UI.",
            triggerReasonCodes: baseSnapshot.m4Campaign.route.reasonCodes,
            commandPreviewKind: null,
            linkedEntryIds: ["encyclopedia.m7.m2-map-economy-routes"],
            reviewState: "SCHEMA_VALIDATED",
            contentLabel: "FICTIONAL"
          }
        ]
      },
      {
        groupId: "m7.hints.commands",
        title: "Command preview context",
        surface: "M3-M6 command panels",
        hints: [
          {
            hintId: "m7.hint.rejection-reasons",
            text: "Rejected candidates and blocked commands are explained by reason codes from preview/query data.",
            triggerReasonCodes: [firstRejected?.reasonCode ?? "office-eligibility-failed"],
            commandPreviewKind: "sim.appoint-office",
            linkedEntryIds: ["encyclopedia.m7.m3-governance"],
            reviewState: "SCHEMA_VALIDATED",
            contentLabel: "FICTIONAL"
          },
          {
            hintId: "m7.hint.playable-preview",
            text: "Playable-flow hints follow the current command preview and client checkpoint status.",
            triggerReasonCodes: firstM5Step?.reasonCodes ?? ["m5.slice.no-step"],
            commandPreviewKind: firstM5Step?.command.kind ?? null,
            linkedEntryIds: ["encyclopedia.m7.m5-playable-loop"],
            reviewState: "SCHEMA_VALIDATED",
            contentLabel: "COMPOSITE"
          },
          {
            hintId: "m7.hint.alpha-policy",
            text: `Policy and event hints link to encyclopedia refs such as ${firstM6PolicyEntry?.entryId ?? "none"}.`,
            triggerReasonCodes: firstM6PolicyEntry?.linkedReasonCodes ?? ["m6.policy.no-entry"],
            commandPreviewKind: "sim.choose-policy-event-option",
            linkedEntryIds: ["encyclopedia.m7.m6-alpha-surfaces"],
            reviewState: "SCHEMA_VALIDATED",
            contentLabel: "COMPOSITE"
          }
        ]
      },
      {
        groupId: "m7.hints.content-review",
        title: "Content review context",
        surface: "M7 tutorial and encyclopedia",
        hints: [
          {
            hintId: "m7.hint.review-gaps",
            text: selectedScenario.tutorialHookText,
            triggerReasonCodes: ["m7.guidance.review-state-visible"],
            commandPreviewKind: null,
            linkedEntryIds: encyclopedia.entries
              .filter((entry) => entry.systemMilestone === "M7")
              .map((entry) => entry.entryId),
            reviewState: selectedScenario.reviewState,
            contentLabel: selectedScenario.contentLabel
          }
        ]
      }
    ]
  };
}

function createM7EncyclopediaReadModel(
  baseSnapshot: Pick<ClientReadModelSnapshot, "m4Campaign" | "m5Playable" | "m6Alpha">,
  pack: ClientM7RuntimeContentPack,
  index: ClientM7RuntimeContentPackIndex
): ClientM7EncyclopediaReadModel {
  const firstScenario = pack.scenarios[0];
  if (firstScenario === undefined) {
    throw new Error("M7 guidance content pack must contain a scenario entry.");
  }
  const reviewClaim = index.getClaim("HIST-M7-FILL-001-SCOPE");
  const scenarioClaim = index.getClaim("HIST-M7-FILL-002-SCENARIO-ANCHORS");
  const noBuffClaim = index.getClaim("HIST-M7-FILL-006-NO-CULTURE-BUFF");
  const highRiskEvent = pack.events.find((event) => event.violenceCostRecord !== null);
  const highRiskEventTitle =
    highRiskEvent === undefined
      ? "M7 culture risk and violence costs"
      : readM7IndexedEnglish(index, highRiskEvent.localizationKey);
  const languageReviewPerson = pack.persons.find(
    (person) => person.reviewState === "LANGUAGE_REVIEW_REQUIRED"
  );
  const languageReviewPersonName =
    languageReviewPerson === undefined
      ? "no accepted person localization"
      : readM7IndexedEnglish(index, languageReviewPerson.displayNameKey);
  const languageReviewNote =
    languageReviewPerson === undefined
      ? "Accepted person language review records are unavailable."
      : `Accepted person display ${languageReviewPersonName} remains ${languageReviewPerson.reviewState}.`;

  return {
    selectedEntryId: "encyclopedia.m7.review-labels",
    entries: [
      {
        entryId: "encyclopedia.m7.m1-authority",
        title: "M1 command/query/save authority",
        systemMilestone: "M1",
        contentLabel: "FICTIONAL",
        confidence: "HIGH",
        reviewState: "SCHEMA_VALIDATED",
        summary:
          "Tutorial state is a client session aid; authoritative world changes remain command/query/save evidence.",
        sourceIds: ["source.project.docs.10"],
        claimIds: ["HIST-M7-FILL-001-SCOPE"],
        linkedReasonCodes: ["m1.determinism.state-hash", "client.session.checkpoint-only"],
        contentRecordRefs: ["simulation.stateHash"]
      },
      {
        entryId: "encyclopedia.m7.m2-map-economy-routes",
        title: "M2 map economy route read models",
        systemMilestone: "M2",
        contentLabel: "FICTIONAL",
        confidence: "HIGH",
        reviewState: "SCHEMA_VALIDATED",
        summary:
          "District operations, route previews, and map labels are projections for scanning and selection.",
        sourceIds: ["source.project.docs.10"],
        claimIds: ["HIST-M7-FILL-001-SCOPE"],
        linkedReasonCodes: baseSnapshot.m4Campaign.route.reasonCodes,
        contentRecordRefs: ["districtList.rows", "map.routes"]
      },
      {
        entryId: "encyclopedia.m7.m3-governance",
        title: "M3 offices obligations succession",
        systemMilestone: "M3",
        contentLabel: "FICTIONAL",
        confidence: "HIGH",
        reviewState: "SCHEMA_VALIDATED",
        summary:
          "Appointments, obligation status, succession pressure, and postwar method names surface accepted read-model reasons.",
        sourceIds: ["source.project.docs.10"],
        claimIds: ["HIST-M7-FILL-001-SCOPE"],
        linkedReasonCodes: ["succession.designation", "postwar.candidate.ready"],
        contentRecordRefs: ["m3Appointment.reasonSummaries"]
      },
      {
        entryId: "encyclopedia.m7.m4-campaign-loop",
        title: "M4 campaign logistics and war outcome loop",
        systemMilestone: "M4",
        contentLabel: "FICTIONAL",
        confidence: "HIGH",
        reviewState: "SCHEMA_VALIDATED",
        summary:
          "Campaign, march, siege, withdrawal, AI, and postwar handoff panels expose command previews and reason-coded reports.",
        sourceIds: ["source.project.docs.10"],
        claimIds: ["HIST-M7-FILL-001-SCOPE"],
        linkedReasonCodes: [
          baseSnapshot.m4Campaign.aiReason.primaryReasonCode,
          "withdrawal.reason.supply-collapse"
        ],
        contentRecordRefs: ["m4Campaign.aiReason", "m4Campaign.warReports"]
      },
      {
        entryId: "encyclopedia.m7.m5-playable-loop",
        title: "M5 playable slice checkpoints",
        systemMilestone: "M5",
        contentLabel: "COMPOSITE",
        confidence: "MEDIUM",
        reviewState: "SCHEMA_VALIDATED",
        summary:
          "The playable flow provides preview, confirm, save, load, success, and failure surfaces without manual node battle.",
        sourceIds: ["source.project.docs.10"],
        claimIds: ["HIST-M7-FILL-001-SCOPE"],
        linkedReasonCodes: ["m5.slice.command-preview", "m5.save.client-session-written"],
        contentRecordRefs: ["m5Playable.steps", "m5Playable.failureStep"]
      },
      {
        entryId: "encyclopedia.m7.m6-alpha-surfaces",
        title: "M6 Alpha recognized-order surfaces",
        systemMilestone: "M6",
        contentLabel: "COMPOSITE",
        confidence: "MEDIUM",
        reviewState: "SCHEMA_VALIDATED",
        summary:
          "Diplomacy, legitimacy, succession, policy events, adviser reasons, map candidates, and terminal outcome remain visible.",
        sourceIds: ["source.project.docs.10"],
        claimIds: ["HIST-M7-FILL-001-SCOPE"],
        linkedReasonCodes: [
          baseSnapshot.m6Alpha.adviser.primaryReasonCode,
          ...baseSnapshot.m6Alpha.terminal.reasonCodes.slice(0, 2)
        ],
        contentRecordRefs: ["m6Alpha.reasonSummaries", "m6Alpha.encyclopedia.entries"]
      },
      {
        entryId: "encyclopedia.m7.review-labels",
        title: "M7 Beta review labels",
        systemMilestone: "M7",
        contentLabel: reviewClaim?.label ?? firstScenario.label,
        confidence: reviewClaim?.confidence ?? firstScenario.confidence,
        reviewState: "SCHEMA_VALIDATED",
        summary:
          reviewClaim?.gameAbstraction ??
          "Beta guidance shows review labels and does not grant formal content-lock acceptance.",
        sourceIds: firstScenario.sourceIds,
        claimIds: firstScenario.claimIds,
        linkedReasonCodes: ["m7.guidance.review-state-visible", "m7.content-lock.not-accepted"],
        contentRecordRefs: ["content.m7.beta.hook.encyclopedia.review_labels"]
      },
      {
        entryId: "encyclopedia.m7.scenario-anchors",
        title: "M7 scenario anchors",
        systemMilestone: "M7",
        contentLabel: scenarioClaim?.label ?? "COMPOSITE",
        confidence: scenarioClaim?.confidence ?? "LOW",
        reviewState: firstScenario.reviewState,
        summary: `${scenarioClaim?.gameAbstraction ?? "Composite scenario anchors remain reviewable and may be changed by later research."} ${languageReviewNote}`,
        sourceIds: firstScenario.sourceIds,
        claimIds: firstScenario.claimIds,
        linkedReasonCodes: ["m7.scenario.anchor.review-required"],
        contentRecordRefs: pack.scenarios.map((scenario) => scenario.scenarioId)
      },
      {
        entryId: "encyclopedia.m7.culture-risk-costs",
        title: highRiskEventTitle,
        systemMilestone: "M7",
        contentLabel: noBuffClaim?.label ?? "INFERRED",
        confidence: noBuffClaim?.confidence ?? "MEDIUM",
        reviewState: highRiskEvent?.reviewState ?? "SCHEMA_VALIDATED",
        summary:
          "High-risk event terms keep visible review states and cost records; they are not converted into bonuses.",
        sourceIds: highRiskEvent?.sourceIds ?? ["source.review.m7.baseline"],
        claimIds: highRiskEvent?.claimIds ?? ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
        linkedReasonCodes: ["m7.culture-risk.cost-visible", "m7.no-culture-buff"],
        contentRecordRefs:
          highRiskEvent === undefined
            ? ["content.m7.beta.event.none"]
            : [highRiskEvent.eventId, highRiskEvent.triggerKey]
      }
    ]
  };
}

function createM7AudioArtLocalizationCoverageReadModel(
  guidancePack: ClientM7RuntimeContentPack
): ClientM7AudioArtLocalizationCoverageReadModel {
  const source: ClientM7RuntimeAudioArtLocalizationCoverageSource =
    M7_BETA_AUDIO_ART_LOCALIZATION_COVERAGE_SOURCE;
  assertM7AudioArtLocalizationCoverageSource(source);
  const guidanceLocalizationKeyCount = guidancePack.localization.length;
  const staticUiKeyCount = M7_UI_CHROME_LOCALIZATION_KEYS.length;

  return {
    manifest: {
      taskId: source.taskId,
      manifestId: source.manifestId,
      sourceManifestPath:
        "content-source/m7-audio-art-localization/beta-audio-art-localization-coverage.json",
      localeCount: source.supportedLocales.length,
      assetReferenceCount: source.assetReferences.length,
      audioReferenceCount: source.assetReferences.filter((asset) => asset.kind === "audio").length,
      artReferenceCount: source.assetReferences.filter((asset) => asset.kind === "art").length,
      localizationCheckCount: source.localizationChecks.length,
      viewportSmokeCount: source.viewportSmoke.length,
      postOneGapCount: source.postOneGaps.length,
      unresolvedRiskCount: source.unresolvedRisks.length,
      notContentLockAcceptance: source.notContentLockAcceptance,
      m6GateCarryForward: source.m6GateCarryForward,
      manualNodeBattleDecision: source.manualNodeBattleDecision
    },
    staticResourceBoundary: source.staticResourceBoundary,
    supportedLocales: source.supportedLocales.map((locale) => ({
      ...locale,
      stableKeyCount: staticUiKeyCount + guidanceLocalizationKeyCount
    })),
    assetReferences: source.assetReferences.map((asset) => ({ ...asset })),
    localizationChecks: source.localizationChecks.map((check) => ({
      ...check,
      matchedKeyCount: countM7CoverageMatchedKeys({
        check,
        guidanceLocalizationKeyCount,
        staticUiKeyCount
      })
    })),
    viewportSmoke: source.viewportSmoke.map((smoke) => ({ ...smoke })),
    postOneGaps: source.postOneGaps.map((gap) => ({ ...gap })),
    unresolvedRisks: source.unresolvedRisks.map((risk) => ({ ...risk }))
  };
}

function createEmptyM7AudioArtLocalizationCoverageReadModel(): ClientM7AudioArtLocalizationCoverageReadModel {
  return {
    manifest: {
      taskId: "M7-AUDIO-ART-LOCALIZATION-COMPLETE-001",
      manifestId: "m7.beta.audio-art-localization.empty",
      sourceManifestPath:
        "content-source/m7-audio-art-localization/beta-audio-art-localization-coverage.json",
      localeCount: 0,
      assetReferenceCount: 0,
      audioReferenceCount: 0,
      artReferenceCount: 0,
      localizationCheckCount: 0,
      viewportSmokeCount: 0,
      postOneGapCount: 0,
      unresolvedRiskCount: 0,
      notContentLockAcceptance: true,
      m6GateCarryForward: "PASS_WITH_LIMITS",
      manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE"
    },
    staticResourceBoundary: {
      noPaidService: true,
      noRemotePipeline: true,
      noSecrets: true,
      noTelemetry: true,
      noCdnOrReleaseCommitment: true,
      noNewProductionDependency: true,
      resourceMode: "empty-static-coverage-fixture"
    },
    supportedLocales: [],
    assetReferences: [],
    localizationChecks: [],
    viewportSmoke: [],
    postOneGaps: [],
    unresolvedRisks: []
  };
}

function countM7CoverageMatchedKeys(input: {
  readonly check: ClientM7RuntimeLocalizationCheckRecord;
  readonly guidanceLocalizationKeyCount: number;
  readonly staticUiKeyCount: number;
}): number {
  switch (input.check.requiredKeyPattern) {
    case "ui.m7.*":
      return input.staticUiKeyCount;
    case "content.m7.beta.*":
      return input.guidanceLocalizationKeyCount;
    case "tutorial.m7.*":
      return 7;
    case "hint.m7.*":
      return 5;
    case "encyclopedia.m7.*":
      return 9;
    default:
      return 0;
  }
}

function assertM7AudioArtLocalizationCoverageSource(
  source: ClientM7RuntimeAudioArtLocalizationCoverageSource
): void {
  const expectedCounts = [
    { label: "supportedLocaleCount", actual: source.supportedLocales.length, expected: 2 },
    { label: "assetReferenceCount", actual: source.assetReferences.length, expected: 8 },
    { label: "localizationCheckCount", actual: source.localizationChecks.length, expected: 5 },
    { label: "viewportSmokeCount", actual: source.viewportSmoke.length, expected: 4 },
    { label: "postOneGapCount", actual: source.postOneGaps.length, expected: 3 },
    { label: "unresolvedRiskCount", actual: source.unresolvedRisks.length, expected: 3 }
  ];

  for (const count of expectedCounts) {
    if (count.actual !== count.expected) {
      throw new Error(
        `M7 audio/art/localization coverage ${count.label} mismatch: expected ${count.expected}, received ${count.actual}.`
      );
    }
  }
  for (const asset of source.assetReferences) {
    if (!asset.staticResourceRef.startsWith("static://m7/")) {
      throw new Error(`M7 asset reference must stay static, received ${asset.staticResourceRef}.`);
    }
    assertM7StableId(asset.assetId, "asset reference id");
  }
  for (const check of source.localizationChecks) {
    assertM7StableId(check.checkId, "localization check id");
  }
  for (const gap of source.postOneGaps) {
    assertM7StableId(gap.gapId, "post-1.0 gap id");
  }
  for (const risk of source.unresolvedRisks) {
    assertM7StableId(risk.riskId, "unresolved risk id");
  }
}

function assertM7StableId(value: string, label: string): void {
  if (!/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u.test(value)) {
    throw new Error(`M7 ${label} must be a stable lowercase id, received ${value}.`);
  }
}

function createM7ReviewSummary(pack: ClientM7RuntimeContentPack): ClientM7ReviewSummaryReadModel {
  const counts = new Map<ClientM7ReviewState, number>();
  const add = (reviewState: ClientM7ReviewState): void => {
    counts.set(reviewState, (counts.get(reviewState) ?? 0) + 1);
  };
  for (const localization of pack.localization) {
    add(localization.reviewState);
  }
  for (const title of pack.titles) {
    add(title.reviewState);
  }
  for (const person of pack.persons) {
    add(person.reviewState);
  }
  for (const event of pack.events) {
    add(event.reviewState);
  }
  for (const scenario of pack.scenarios) {
    add(scenario.reviewState);
  }

  return {
    reviewStateCounts: [...counts.entries()]
      .map(([reviewState, count]) => ({ reviewState, count }))
      .sort((left, right) => left.reviewState.localeCompare(right.reviewState)),
    humanGateClaimCount: pack.claimRecords.filter((claim) => claim.humanGate).length,
    knownGaps: pack.knownGaps,
    blockedScopeNotes: [
      "M6_GATE remains PASS_WITH_LIMITS.",
      "Manual node battle remains DEFER_MANUAL_NODE_BATTLE.",
      "Formal content lock acceptance remains outside this UI task."
    ]
  };
}

function readM7LocalizedText(localizationByKey: ReadonlyMap<string, string>, key: string): string {
  const text = localizationByKey.get(key);
  if (text === undefined) {
    throw new Error(`Missing M7 localization key ${key}.`);
  }
  return text;
}

function readM7IndexedEnglish(index: ClientM7RuntimeContentPackIndex, key: string): string {
  const localization = index.getLocalization(key);
  if (localization === undefined) {
    throw new Error(`Missing M7 localization key ${key}.`);
  }
  return localization.english;
}

function createClientM7RuntimeContentPackIndex(
  pack: ClientM7RuntimeContentPack
): ClientM7RuntimeContentPackIndex {
  const claimById = new Map(pack.claimRecords.map((claim) => [claim.claimId, claim]));
  const localizationByKey = new Map(
    pack.localization.map((localization) => [localization.key, localization])
  );
  return {
    getClaim(claimId: string): ClientM7RuntimeClaimRecord | undefined {
      return claimById.get(claimId);
    },
    getLocalization(key: string): ClientM7RuntimeLocalizationRecord | undefined {
      return localizationByKey.get(key);
    }
  };
}

function assertM7GuidanceSourceCounts(pack: ClientM7RuntimeContentPack): void {
  const expectedCounts = [
    { label: "scenarioCount", actual: pack.scenarios.length, expected: 3 },
    { label: "personCount", actual: pack.persons.length, expected: 6 },
    { label: "titleCount", actual: pack.titles.length, expected: 3 },
    { label: "eventCount", actual: pack.events.length, expected: 5 },
    { label: "localizationCount", actual: pack.localization.length, expected: 36 },
    { label: "claimCount", actual: pack.claimRecords.length, expected: 6 },
    { label: "knownGapCount", actual: pack.knownGaps.length, expected: 4 }
  ];

  for (const count of expectedCounts) {
    if (count.actual !== count.expected) {
      throw new Error(
        `M7 accepted guidance source ${count.label} mismatch: expected ${count.expected}, received ${count.actual}.`
      );
    }
  }
}

function createM6ScenarioFixtures(startHash: string): readonly ClientM6ScenarioReadModel[] {
  return [
    {
      scenarioId: "m6.alpha.recognized-order.v0",
      label: "Recognized order path",
      scenarioKind: "primary-victory",
      startDay: 0,
      seed: 1531,
      startHash,
      reasonCodes: ["m6.scenario.primary-victory", "m6.scenario.composite-fictional"]
    },
    {
      scenarioId: "m6.alpha.pressure-monsoon.v0",
      label: "Monsoon pressure variant",
      scenarioKind: "pressure-variant",
      startDay: 30,
      seed: 1532,
      startHash,
      reasonCodes: ["m6.scenario.pressure", "route.season.monsoon-risk"]
    },
    {
      scenarioId: "m6.alpha.recovery-failure.v0",
      label: "Recovery or failure route",
      scenarioKind: "recovery-or-failure",
      startDay: 45,
      seed: 1533,
      startHash,
      reasonCodes: ["m6.scenario.failure-recovery", "m6.recognized-order.recognition-missing"]
    }
  ];
}

function createM6DiplomacyFixture(
  script: M6AlphaStartToVictoryScriptV1
): ClientM6DiplomacyReadModel {
  const propose = script.commandsAfterMidRunSave.find(
    (command) => command.kind === "sim.propose-diplomatic-agreement"
  );
  const answer = script.commandsAfterMidRunSave.find(
    (command) => command.kind === "sim.answer-diplomatic-agreement"
  );
  const relationId =
    propose?.kind === "sim.propose-diplomatic-agreement" ? propose.payload.relationId : 1;
  const agreementId =
    propose?.kind === "sim.propose-diplomatic-agreement" ? propose.payload.agreementId : 1;
  const proposerPolityId =
    propose?.kind === "sim.propose-diplomatic-agreement"
      ? createClientPolityId(propose.payload.proposerPolityId)
      : createClientPolityId(1);
  const targetPolityId =
    propose?.kind === "sim.propose-diplomatic-agreement"
      ? createClientPolityId(propose.payload.targetPolityId)
      : createClientPolityId(2);
  const agreementKind =
    propose?.kind === "sim.propose-diplomatic-agreement"
      ? propose.payload.agreementKind
      : "tribute-recognition";
  const recognitionDirection =
    propose?.kind === "sim.propose-diplomatic-agreement"
      ? propose.payload.recognitionDirection
      : "target-recognizes-proposer";
  const reasonCodes = [
    propose?.kind === "sim.propose-diplomatic-agreement"
      ? propose.payload.reasonCode
      : "m6.alpha.diplomacy.recognized-order",
    answer?.kind === "sim.answer-diplomatic-agreement"
      ? answer.payload.reasonCode
      : "m6.alpha.diplomacy.accepted"
  ];

  return {
    day: 24,
    observerPolityId: createClientPolityId(1),
    relations: [
      {
        relationId,
        polityAId: proposerPolityId,
        polityBId: targetPolityId,
        trustBps: 6_400,
        affinityBps: 5_200,
        fearBps: 2_300,
        threatBps: 1_900,
        interestAlignmentBps: 7_100,
        historicalDebt: 0,
        borderConflictBps: 1_200,
        reasonCodes: ["diplomacy.offer.non-aggression", "m6.diplomacy.query.observer-visible"]
      }
    ],
    agreements: [
      {
        agreementId,
        relationId,
        proposerPolityId,
        targetPolityId,
        agreementKind,
        status: "accepted",
        startDay: 24,
        endDay: 744,
        recognitionDirection,
        reasonCodes
      }
    ],
    recognitionEdges: [
      {
        fromPolityId: targetPolityId,
        toPolityId: proposerPolityId,
        agreementId,
        reasonCode: "diplomacy.recognition.accepted"
      }
    ],
    reasonCodes: ["m6.diplomacy.query.observer-visible", ...reasonCodes]
  };
}

function createM6LegitimacyFixture(): ClientM6LegitimacyReadModel {
  return {
    polityId: createClientPolityId(1),
    audience: "vassal-rulers",
    scoreBps: 1_150,
    pressureBps: 8_850,
    sources: [
      {
        sourceId: 1,
        sourceKind: "succession-continuity",
        magnitudeBps: 700,
        sourceRef: "m3.succession.1",
        reasonCode: "legitimacy.source.succession-continuity"
      },
      {
        sourceId: 2,
        sourceKind: "postwar-settlement",
        magnitudeBps: 450,
        sourceRef: "m4.postwar.m6-alpha",
        reasonCode: "legitimacy.source.postwar-settlement"
      }
    ],
    reasonCodes: [
      "m6.recognized-order.legitimacy-sufficient",
      "legitimacy.source.succession-continuity",
      "legitimacy.source.postwar-settlement"
    ]
  };
}

function createM6SuccessionFixture(
  m3: ClientM3AppointmentReadModelSnapshot
): ClientM6SuccessionReadModel {
  const candidateCount = m3.successionCrises.reduce(
    (total, crisis) => total + crisis.candidates.length,
    0
  );
  return {
    status: "resolved",
    crisisCount: Math.max(1, m3.successionCrises.length),
    resolvedCount: Math.max(
      1,
      m3.successionCrises.filter((crisis) => crisis.status === "resolved").length
    ),
    candidateCount: Math.max(2, candidateCount),
    continuityReasonCodes: [
      "m6.alpha.succession.peaceful",
      "m6.recognized-order.succession-clear",
      "succession.designation"
    ]
  };
}

function createM6PolicyEventFixture(
  policyStep: ClientM6AlphaStepReadModel | undefined
): ClientM6PolicyEventReadModel {
  const reasonCodes = policyStep?.reasonCodes ?? ["m6.alpha.policy.harbor-charter"];
  return {
    activeEvents: [
      {
        eventInstanceId: 1,
        title: "Harbor charter petition",
        causeReasonCodes: ["policy.event.cause.day-one"],
        options: [
          {
            optionId: 1,
            label: "Grant bounded harbor duties",
            reasonCodes: ["policy.event.choice.accept", "policy.event.option.accept"],
            consequenceReasonCodes: ["policy.event.consequence.harbor-duty"]
          },
          {
            optionId: 2,
            label: "Reject until obligations clear",
            reasonCodes: ["policy.event.choice.reject", "policy.event.option.reject"],
            consequenceReasonCodes: ["policy.event.consequence.local-friction"]
          }
        ],
        encyclopediaRefs: [
          "encyclopedia.m6.policy_event.harbor",
          "encyclopedia.m6.policy_event.harbor.accept"
        ]
      }
    ],
    resolvedEvents: [
      {
        eventInstanceId: 1,
        selectedOptionId: 1,
        resolvedDay: 25,
        reasonCodes: [
          "policy.event.command.choose",
          "policy.event.consequence.harbor-duty",
          ...reasonCodes
        ],
        encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor.accept"]
      }
    ],
    modifiers: [
      {
        modifierId: 1,
        policyId: 1,
        magnitudeBps: 250,
        startDay: 25,
        endDay: 55,
        reasonCode: "policy.event.consequence.harbor-duty"
      }
    ],
    reasonCodes: ["policy.event.definition.harbor", ...reasonCodes]
  };
}

function createM6EncyclopediaFixture(): ClientM6EncyclopediaReadModel {
  return {
    selectedEntryId: "encyclopedia.m6.policy_event.harbor",
    entries: [
      {
        entryId: "encyclopedia.m6.policy_event.harbor",
        title: "Harbor charter pressure",
        contentTag: "COMPOSITE",
        summary:
          "Alpha encyclopedia entry linking a policy event to obligations, routes, and recognized settlement evidence.",
        linkedReasonCodes: ["policy.event.definition.harbor", "route.season.monsoon-risk"]
      },
      {
        entryId: "encyclopedia.m6.recognized_order",
        title: "Recognized order",
        contentTag: "FICTIONAL",
        summary:
          "Victory requires recognition, legitimacy, succession continuity, terms, and checkpoint evidence.",
        linkedReasonCodes: [
          "m6.recognized-order.diplomatic-recognition",
          "m6.recognized-order.legitimacy-sufficient"
        ]
      },
      {
        entryId: "encyclopedia.m6.map_candidate",
        title: "Alpha map candidate",
        contentTag: "COMPOSITE",
        summary:
          "Candidate map geometry remains reviewable source data and is not authoritative simulation state.",
        linkedReasonCodes: ["m6.map.candidate.reviewable", "m6.map.candidate.rendered"]
      }
    ]
  };
}

function createM6AdviserFixture(
  m4: ClientM4CampaignReadModelSnapshot,
  diplomacyStep: ClientM6AlphaStepReadModel | undefined
): ClientM6AdviserReadModel {
  return {
    decisionKind: "diplomacy",
    commandKind: diplomacyStep?.command.kind ?? m4.aiReason.commandKind,
    primaryReasonCode: "m6.adviser.recognized-order-ready",
    candidates: [
      {
        candidateId: "m6.adviser.propose-recognition",
        decisionKind: "diplomacy",
        commandKind: diplomacyStep?.command.kind ?? "sim.propose-diplomatic-agreement",
        score: 82,
        reasonCodes: [
          "m6.ai.diplomacy.recognition-needed",
          "m6.recognized-order.legitimacy-sufficient"
        ]
      },
      {
        candidateId: "m6.adviser.wait-for-succession",
        decisionKind: "wait",
        commandKind: null,
        score: 41,
        reasonCodes: ["m6.recognized-order.succession-clear", "m4.ai.wait.no-safe-march"]
      },
      {
        candidateId: "m6.adviser.policy-harbor-charter",
        decisionKind: "policy",
        commandKind: "sim.choose-policy-event-option",
        score: 63,
        reasonCodes: ["m6.alpha.policy.harbor-charter", "policy.event.consequence.harbor-duty"]
      }
    ],
    reasonCodes: [m4.aiReason.primaryReasonCode, "m6.adviser.no-hidden-rescue"]
  };
}

function createM6MapCandidateFixture(
  baseSnapshot: Pick<ClientReadModelSnapshot, "map">
): ClientM6MapCandidateReadModel {
  return {
    candidateSourceId: "map.alpha.western-mainland-candidate",
    displayName: "Western mainland Alpha candidate",
    sourceLabel: "FICTIONAL",
    districtCount: Math.max(4, baseSnapshot.map.districts.length),
    settlementCount: Math.max(2, baseSnapshot.map.settlements.length),
    routeCount: Math.max(3, baseSnapshot.map.routes.length),
    selectedDistrictIds: baseSnapshot.map.districts
      .slice(0, 4)
      .map((district) => district.districtId),
    reasonCodes: ["m6.map.candidate.reviewable", "m6.map.candidate.rendered"]
  };
}

function createM6AlphaStep(
  command: AuthoritativeGameCommandV1,
  index: number,
  resultStatus: ClientM6CommandResultReadModel["status"]
): ClientM6AlphaStepReadModel {
  const reasonCodes = extractM6CommandReasonCodes(command);
  const stage = classifyM6CommandStage(command);
  const label = formatM6CommandLabel(command);
  return {
    stepId: `m6.step.${(index + 1).toString().padStart(2, "0")}.${command.kind}`,
    stage,
    label,
    command,
    actorLabel: `${command.actor.kind}:${command.actor.id}`,
    preview: {
      commandKind: command.kind,
      commandId: command.commandId,
      summary: `Preview ${label}`,
      reasonCodes
    },
    result: {
      status: resultStatus,
      summary:
        resultStatus === "rejected"
          ? "Rejected by the authoritative command path and shown as Alpha failure evidence."
          : `Result will be reported by the authoritative simulation after ${command.kind}.`,
      reasonCodes
    },
    reasonCodes,
    encyclopediaRefs: encyclopediaRefsForM6Step(stage)
  };
}

function extractM6CommandReasonCodes(command: AuthoritativeGameCommandV1): readonly string[] {
  switch (command.kind) {
    case "sim.propose-diplomatic-agreement":
    case "sim.answer-diplomatic-agreement":
    case "sim.record-legitimacy-source":
    case "sim.choose-policy-event-option":
    case "sim.evaluate-m6-alpha-outcome":
      return [command.payload.reasonCode];
    case "sim.advance-day":
    case "debug.set-district-control":
    case "sim.verify-state-hash":
      return [];
    case "sim.commit-labor":
      return ["m6.labor.mobilized-households"];
    case "sim.set-polity-suzerain":
    case "sim.record-obligation-fulfillment":
    case "sim.appoint-office":
    case "sim.update-office-policy":
    case "sim.update-jurisdiction-policy":
    case "sim.record-character-status":
    case "sim.resolve-succession":
    case "sim.apply-m3-postwar-governance":
    case "sim.cancel-campaign-objective":
    case "sim.release-campaign-grain-supply":
      return [command.payload.reasonCode];
    case "sim.create-obligation":
      return ["m6.obligation.source-ledger-visible"];
    case "sim.appoint-offices-bulk":
      return command.payload.items.flatMap((item) => [item.reasonCode]);
    case "sim.enfeoff-district":
    case "sim.create-character-relationship":
      return [command.payload.reasonCode];
    case "sim.create-campaign-objective":
    case "sim.update-campaign-objective":
    case "sim.create-muster-commitment":
    case "sim.record-muster-response":
    case "sim.reserve-campaign-grain-supply":
    case "sim.consume-campaign-grain-supply":
    case "sim.start-campaign-march":
    case "sim.resolve-m4-field-engagement":
    case "sim.apply-m4-siege-choice":
    case "sim.resolve-m4-campaign-withdrawal":
      return command.payload.reasonCodes;
  }
}

function classifyM6CommandStage(command: AuthoritativeGameCommandV1): ClientM6AlphaStepStage {
  switch (command.kind) {
    case "sim.resolve-succession":
      return "succession";
    case "sim.propose-diplomatic-agreement":
    case "sim.answer-diplomatic-agreement":
      return "diplomacy";
    case "sim.record-legitimacy-source":
      return "legitimacy";
    case "sim.choose-policy-event-option":
      return "policy-event";
    case "sim.evaluate-m6-alpha-outcome":
      return command.commandId.includes("defeat") || command.commandId.includes("malformed")
        ? "failure"
        : "terminal";
    case "sim.appoint-office":
    case "sim.appoint-offices-bulk":
    case "sim.update-office-policy":
    case "sim.update-jurisdiction-policy":
    case "sim.enfeoff-district":
    case "sim.record-character-status":
    case "sim.create-character-relationship":
      return "appointment";
    case "sim.set-polity-suzerain":
    case "sim.create-obligation":
    case "sim.record-obligation-fulfillment":
      return "obligation";
    case "sim.commit-labor":
    case "sim.reserve-campaign-grain-supply":
    case "sim.consume-campaign-grain-supply":
    case "sim.release-campaign-grain-supply":
      return "logistics";
    case "sim.create-campaign-objective":
    case "sim.update-campaign-objective":
    case "sim.cancel-campaign-objective":
    case "sim.create-muster-commitment":
    case "sim.record-muster-response":
    case "sim.start-campaign-march":
      return "campaign";
    case "sim.resolve-m4-field-engagement":
    case "sim.apply-m4-siege-choice":
    case "sim.resolve-m4-campaign-withdrawal":
      return "battle-siege";
    case "sim.apply-m3-postwar-governance":
      return command.commandId.includes("duplicate") ? "failure" : "postwar";
    case "sim.advance-day":
    case "sim.verify-state-hash":
    case "debug.set-district-control":
      return "stabilization";
  }
}

function formatM6CommandLabel(command: AuthoritativeGameCommandV1): string {
  switch (command.kind) {
    case "sim.propose-diplomatic-agreement":
      return "Propose recognized-order diplomacy";
    case "sim.answer-diplomatic-agreement":
      return "Answer recognition agreement";
    case "sim.record-legitimacy-source":
      return "Record legitimacy source";
    case "sim.choose-policy-event-option":
      return "Choose policy event option";
    case "sim.evaluate-m6-alpha-outcome":
      return "Evaluate Alpha terminal status";
    default:
      return formatM5CommandLabel(command);
  }
}

function encyclopediaRefsForM6Step(stage: ClientM6AlphaStepStage): readonly string[] {
  switch (stage) {
    case "diplomacy":
    case "legitimacy":
    case "terminal":
      return ["encyclopedia.m6.recognized_order"];
    case "policy-event":
      return ["encyclopedia.m6.policy_event.harbor"];
    case "scenario":
      return ["encyclopedia.m6.map_candidate"];
    default:
      return [];
  }
}

function summarizeM6ReasonCodes(input: {
  readonly steps: readonly ClientM6AlphaStepReadModel[];
  readonly failureStep: ClientM6AlphaStepReadModel;
  readonly diplomacyReasonCodes: readonly string[];
  readonly legitimacyReasonCodes: readonly string[];
  readonly successionReasonCodes: readonly string[];
  readonly policyReasonCodes: readonly string[];
  readonly encyclopediaReasonCodes: readonly string[];
  readonly adviserReasonCodes: readonly string[];
  readonly mapReasonCodes: readonly string[];
  readonly terminalReasonCodes: readonly string[];
}): readonly ClientM6ReasonSummaryReadModel[] {
  const accumulator = new Map<
    string,
    { count: number; sourceKinds: Set<ClientM6ReasonSourceKind> }
  >();
  const add = (reasonCodes: readonly string[], sourceKind: ClientM6ReasonSourceKind): void => {
    for (const reasonCode of reasonCodes) {
      const existing = accumulator.get(reasonCode);
      if (existing === undefined) {
        accumulator.set(reasonCode, { count: 1, sourceKinds: new Set([sourceKind]) });
      } else {
        existing.count += 1;
        existing.sourceKinds.add(sourceKind);
      }
    }
  };

  for (const step of input.steps) {
    add(step.reasonCodes, "step");
    add(step.encyclopediaRefs, "encyclopedia");
  }
  add(input.failureStep.reasonCodes, "terminal");
  add(input.diplomacyReasonCodes, "diplomacy");
  add(input.legitimacyReasonCodes, "legitimacy");
  add(input.successionReasonCodes, "succession");
  add(input.policyReasonCodes, "policy-event");
  add(input.encyclopediaReasonCodes, "encyclopedia");
  add(input.adviserReasonCodes, "adviser");
  add(input.mapReasonCodes, "map");
  add(input.terminalReasonCodes, "terminal");

  return [...accumulator.entries()]
    .map(([reasonCode, summary]) => ({
      reasonCode,
      count: summary.count,
      sourceKinds: [...summary.sourceKinds].sort()
    }))
    .sort(
      (left, right) => right.count - left.count || left.reasonCode.localeCompare(right.reasonCode)
    );
}

function parseM6AlphaPhase(value: unknown): ClientM6AlphaPhase | null {
  switch (value) {
    case "scenario-selection":
    case "running":
    case "victory":
    case "failure":
    case "continued-play":
    case "checkpoint-loaded":
      return value;
    default:
      return null;
  }
}

function parseM6TerminalOutcome(value: unknown): M6AlphaTerminalOutcomeV1 | null {
  switch (value) {
    case "victory":
    case "defeat":
    case "continued-play":
      return value;
    default:
      return null;
  }
}

function createEmptyM5PlayableReadModel(
  revision: ClientReadModelRevision
): ClientM5PlayableReadModelSnapshot {
  const emptyCommand: GameCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.advance-day",
    commandId: "m5.empty.advance",
    actor: { kind: "system", id: "scheduler" },
    expectedDay: 0,
    expectedRevision: Number(revision)
  };
  const failureStep = createM5PlayableStep(emptyCommand, 0, "rejected");

  return {
    revision,
    scenarioId: "m5.composite.river-gate.v0",
    contentTag: "COMPOSITE_FICTIONAL_PLACEHOLDER",
    day: 0,
    stateHash: "not-started",
    commandActor: { kind: "player", id: "polity:1" },
    provenance: {
      kind: "m5-protocol-script-projection",
      note: "No M5 playable client read-model slice has been projected yet."
    },
    goal: {
      primaryGoal: "Start the accepted M5 playable slice.",
      successConditions: [],
      failureConditions: [],
      outOfScope: ["Manual node battle UI is unavailable in M5."]
    },
    replay: {
      bootFixture: "m4.determinism-replay-001",
      startHash: "not-started",
      currentHash: "not-started",
      commandCount: 0,
      checkpointLabel: "m5.not-started"
    },
    session: {
      phase: "not-started",
      currentStepIndex: 0,
      confirmedCommandIds: []
    },
    steps: [],
    failureStep,
    ai: {
      decisionKind: "no-action",
      commandKind: null,
      primaryReasonCode: "m5.ai.not-started",
      reasonCodes: []
    },
    risk: {
      campaignRiskLabel: "not-started",
      routeReasonCodes: [],
      withdrawalReasonCodes: []
    },
    supply: {
      expectedDaysOfSupply: 0,
      grainReserved: 0,
      grainRequired: 0,
      reasonCodes: []
    },
    season: {
      windowLabel: "not-started",
      reasonCodes: []
    },
    postwar: {
      candidateCount: 0,
      methods: [],
      consequenceReasonCodes: []
    },
    reasonSummaries: []
  };
}

function createM5PlayableStep(
  command: GameCommandV1,
  index: number,
  resultStatus: ClientM5CommandResultReadModel["status"]
): ClientM5PlayableStepReadModel {
  const reasonCodes = extractCommandReasonCodes(command);
  const label = formatM5CommandLabel(command);
  return {
    stepId: `m5.step.${(index + 1).toString().padStart(2, "0")}.${command.kind}`,
    stage: classifyM5CommandStage(command),
    label,
    command,
    actorLabel: `${command.actor.kind}:${command.actor.id}`,
    preview: {
      commandKind: command.kind,
      commandId: command.commandId,
      summary: `Preview ${label}`,
      reasonCodes
    },
    result: {
      status: resultStatus,
      summary:
        resultStatus === "rejected"
          ? "Rejected by accepted protocol path; shown as the M5 failure/cancel evidence."
          : `Result will be reported by the authoritative simulation after ${command.kind}.`,
      reasonCodes
    },
    reasonCodes
  };
}

function extractCommandReasonCodes(command: GameCommandV1): readonly string[] {
  switch (command.kind) {
    case "sim.advance-day":
    case "debug.set-district-control":
    case "sim.verify-state-hash":
      return [];
    case "sim.commit-labor":
      return ["m5.labor.mobilized-households"];
    case "sim.set-polity-suzerain":
    case "sim.record-obligation-fulfillment":
    case "sim.appoint-office":
    case "sim.update-office-policy":
    case "sim.update-jurisdiction-policy":
    case "sim.record-character-status":
    case "sim.resolve-succession":
    case "sim.apply-m3-postwar-governance":
    case "sim.cancel-campaign-objective":
    case "sim.release-campaign-grain-supply":
      return [command.payload.reasonCode];
    case "sim.create-obligation":
      return ["m5.obligation.source-ledger-visible"];
    case "sim.appoint-offices-bulk":
      return command.payload.items.flatMap((item) => [item.reasonCode]);
    case "sim.enfeoff-district":
      return [command.payload.reasonCode];
    case "sim.create-character-relationship":
      return [command.payload.reasonCode];
    case "sim.create-campaign-objective":
    case "sim.update-campaign-objective":
    case "sim.create-muster-commitment":
    case "sim.record-muster-response":
    case "sim.reserve-campaign-grain-supply":
    case "sim.consume-campaign-grain-supply":
    case "sim.start-campaign-march":
    case "sim.resolve-m4-field-engagement":
    case "sim.apply-m4-siege-choice":
    case "sim.resolve-m4-campaign-withdrawal":
      return command.payload.reasonCodes;
  }
}

function classifyM5CommandStage(command: GameCommandV1): ClientM5PlayableStepStage {
  switch (command.kind) {
    case "sim.appoint-office":
    case "sim.appoint-offices-bulk":
    case "sim.update-office-policy":
    case "sim.update-jurisdiction-policy":
    case "sim.enfeoff-district":
    case "sim.record-character-status":
    case "sim.resolve-succession":
    case "sim.create-character-relationship":
      return "appointment";
    case "sim.set-polity-suzerain":
    case "sim.create-obligation":
    case "sim.record-obligation-fulfillment":
      return "obligation";
    case "sim.commit-labor":
    case "sim.reserve-campaign-grain-supply":
    case "sim.consume-campaign-grain-supply":
    case "sim.release-campaign-grain-supply":
      return "logistics";
    case "sim.create-campaign-objective":
    case "sim.update-campaign-objective":
    case "sim.cancel-campaign-objective":
    case "sim.create-muster-commitment":
    case "sim.record-muster-response":
    case "sim.start-campaign-march":
      return "campaign";
    case "sim.resolve-m4-field-engagement":
    case "sim.apply-m4-siege-choice":
    case "sim.resolve-m4-campaign-withdrawal":
      return "battle-siege";
    case "sim.apply-m3-postwar-governance":
      return command.commandId.includes("duplicate") ? "failure" : "postwar";
    case "sim.advance-day":
    case "sim.verify-state-hash":
    case "debug.set-district-control":
      return "stabilization";
  }
}

function formatM5CommandLabel(command: GameCommandV1): string {
  switch (command.kind) {
    case "sim.create-campaign-objective":
      return "Choose campaign objective and window";
    case "sim.create-muster-commitment":
      return "Request obligation-backed muster";
    case "sim.record-muster-response":
      return "Record vassal muster response";
    case "sim.reserve-campaign-grain-supply":
      return "Reserve campaign grain supply";
    case "sim.start-campaign-march":
      return "Start accepted campaign march";
    case "sim.resolve-m4-field-engagement":
      return "Resolve automatic field engagement";
    case "sim.apply-m4-siege-choice":
      return "Apply deterministic siege choice";
    case "sim.resolve-m4-campaign-withdrawal":
      return "Resolve campaign withdrawal and postwar handoff";
    case "sim.apply-m3-postwar-governance":
      return "Select postwar arrangement";
    case "sim.advance-day":
      return "Advance stabilization day";
    default:
      return command.kind;
  }
}

function collectM5PostwarMethods(
  reports: readonly ClientM4WarReportReadModel[]
): readonly M3PostwarGovernanceMethodV1[] {
  const methods = new Set<M3PostwarGovernanceMethodV1>();
  for (const report of reports) {
    for (const method of report.postwarCandidate?.validM3Methods ?? []) {
      methods.add(method);
    }
  }
  return [...methods].sort();
}

function summarizeM5ReasonCodes(input: {
  readonly steps: readonly ClientM5PlayableStepReadModel[];
  readonly failureStep: ClientM5PlayableStepReadModel;
  readonly aiReasonCodes: readonly string[];
  readonly routeReasonCodes: readonly string[];
  readonly supplyReasonCodes: readonly string[];
  readonly seasonReasonCodes: readonly string[];
  readonly withdrawalReasonCodes: readonly string[];
  readonly postwarReasonCodes: readonly string[];
}): readonly ClientM5ReasonSummaryReadModel[] {
  const accumulator = new Map<
    string,
    { count: number; sourceKinds: Set<ClientM5ReasonSourceKind> }
  >();
  const add = (reasonCodes: readonly string[], sourceKind: ClientM5ReasonSourceKind): void => {
    for (const reasonCode of reasonCodes) {
      const existing = accumulator.get(reasonCode);
      if (existing === undefined) {
        accumulator.set(reasonCode, { count: 1, sourceKinds: new Set([sourceKind]) });
      } else {
        existing.count += 1;
        existing.sourceKinds.add(sourceKind);
      }
    }
  };

  for (const step of input.steps) {
    add(step.reasonCodes, step.stage === "postwar" ? "postwar" : "campaign");
  }
  add(input.failureStep.reasonCodes, "failure");
  add(input.aiReasonCodes, "ai");
  add(input.routeReasonCodes, "campaign");
  add(input.supplyReasonCodes, "supply");
  add(input.seasonReasonCodes, "season");
  add(input.withdrawalReasonCodes, "campaign");
  add(input.postwarReasonCodes, "postwar");

  return [...accumulator.entries()]
    .map(([reasonCode, summary]) => ({
      reasonCode,
      count: summary.count,
      sourceKinds: [...summary.sourceKinds].sort()
    }))
    .sort(
      (left, right) => right.count - left.count || left.reasonCode.localeCompare(right.reasonCode)
    );
}

function parseM5PlayablePhase(value: unknown): ClientM5PlayablePhase | null {
  switch (value) {
    case "not-started":
    case "running":
    case "success":
    case "failure":
    case "cancelled":
      return value;
    default:
      return null;
  }
}

function formatM5Window(window: {
  readonly earliestDay: number;
  readonly latestDay: number;
}): string {
  return `day ${window.earliestDay}-${window.latestDay}`;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createEmptyM4CampaignReadModel(
  revision: ClientReadModelRevision
): ClientM4CampaignReadModelSnapshot {
  const emptyPlanId = createClientCampaignPlanId(1);
  return {
    revision,
    day: 0,
    commandActor: { kind: "player", id: "polity:1" },
    provenance: {
      kind: "protocol-query-projection",
      note: "No M4 campaign read-model slice has been projected yet."
    },
    selectedCampaignPlanId: null,
    commandDefaults: {
      nextCampaignPlanId: emptyPlanId,
      nextMarchId: createClientCampaignMarchId(1),
      nextWithdrawalId: createClientWithdrawalId(1),
      originDistrictId: createClientDistrictId(1),
      grainPerTroopPerDay: 1,
      withdrawalTrigger: "ordered"
    },
    planningDraft: {
      owner: { kind: "polity", polityId: 1 },
      ownerLabel: "Polity 1",
      target: { kind: "district", districtId: 1 },
      targetLabel: "District 1",
      objectiveKind: "prepare",
      startWindow: { earliestDay: 0, latestDay: 0 },
      reasonCodes: []
    },
    plans: [],
    muster: {
      readiness: "empty",
      promisedTroops: 0,
      assembledTroops: 0,
      delayedTroops: 0,
      refusedTroops: 0,
      releasedTroops: 0,
      commitments: [],
      reasonCodes: []
    },
    grain: {
      plannedTroops: 0,
      plannedMarchDays: 0,
      plannedStartDay: 0,
      grainRequired: 0,
      grainReserved: 0,
      grainAvailableToReserve: 0,
      expectedDaysOfSupply: 0,
      reservations: [],
      reasonCodes: []
    },
    route: {
      targetDistrictId: createClientDistrictId(1),
      plannedTroops: 0,
      carriedSupplyAvailable: 0,
      carriedSupplyLimit: 0,
      bottleneckCapacity: 0,
      sourceForecasts: [],
      reasonCodes: []
    },
    marches: [],
    sieges: [],
    withdrawals: [],
    aiReason: {
      decisionKind: "no-action",
      selectedCampaignPlanId: null,
      commandKind: null,
      primaryReasonCode: "m4.ai.no-trace",
      reasonCodes: ["m4.ai.no-trace"],
      candidates: []
    },
    warReports: [],
    reasonSummaries: []
  };
}

function projectM4Muster(input: ClientM4MusterProtocolResult): ClientM4MusterReadModel {
  const commitments = input.commitments.map((commitment) => ({
    commitmentId: commitment.commitmentId,
    status: commitment.status,
    statusReasonCode: commitment.statusReasonCode,
    promisedTroops: commitment.promisedTroops,
    assembledTroops: commitment.assembledTroops,
    delayedTroops: commitment.delayedTroops,
    refusedTroops: commitment.refusedTroops,
    releasedTroops: commitment.releasedTroops,
    dueDay: commitment.dueDay,
    plannedAssemblyDay: commitment.plannedAssemblyDay,
    reasonCodes: commitment.reasonCodes
  }));
  const promisedTroops = commitments.reduce(
    (sum, commitment) => sum + commitment.promisedTroops,
    0
  );
  const assembledTroops = commitments.reduce(
    (sum, commitment) => sum + commitment.assembledTroops,
    0
  );
  const delayedTroops = commitments.reduce((sum, commitment) => sum + commitment.delayedTroops, 0);
  const refusedTroops = commitments.reduce((sum, commitment) => sum + commitment.refusedTroops, 0);
  const releasedTroops = commitments.reduce(
    (sum, commitment) => sum + commitment.releasedTroops,
    0
  );

  return {
    readiness: determineM4MusterReadiness({
      promisedTroops,
      assembledTroops,
      delayedTroops,
      refusedTroops
    }),
    promisedTroops,
    assembledTroops,
    delayedTroops,
    refusedTroops,
    releasedTroops,
    commitments,
    reasonCodes: input.reasonCodes
  };
}

function determineM4MusterReadiness(input: {
  readonly promisedTroops: number;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
}): ClientM4MusterReadModel["readiness"] {
  if (input.promisedTroops === 0) {
    return "empty";
  }
  if (input.refusedTroops > 0) {
    return "blocked";
  }
  if (input.delayedTroops > 0 || input.assembledTroops < input.promisedTroops) {
    return "partial";
  }
  return "ready";
}

function projectM4Grain(input: ClientM4GrainSupplyProtocolResult): ClientM4GrainSupplyReadModel {
  return {
    plannedTroops: input.plannedTroops,
    plannedMarchDays: input.plannedMarchDays,
    plannedStartDay: input.plannedStartDay,
    grainRequired: input.grainRequired,
    grainReserved: input.grainReserved,
    grainAvailableToReserve: input.grainAvailableToReserve,
    expectedDaysOfSupply: input.expectedDaysOfSupply,
    reservations: input.reservations.map((reservation) => ({
      reservationId: reservation.reservationId,
      status: reservation.status,
      statusReasonCode: reservation.statusReasonCode,
      reservedAmount: reservation.reservedAmount,
      carriedAmount: reservation.carriedAmount,
      consumedAmount: reservation.consumedAmount,
      shortageAmount: reservation.shortageAmount,
      lossAmount: reservation.lossAmount,
      lossReasonCode: reservation.lossReasonCode,
      expectedDaysOfSupply: reservation.expectedDaysOfSupply,
      reasonCodes: reservation.reasonCodes
    })),
    reasonCodes: input.reasonCodes
  };
}

function projectM4Route(
  input: ClientM4RouteForecastProtocolResult
): ClientM4RouteForecastReadModel {
  return {
    targetDistrictId: createClientDistrictId(input.targetDistrictId),
    plannedTroops: input.plannedTroops,
    carriedSupplyAvailable: input.carriedSupplyAvailable,
    carriedSupplyLimit: input.carriedSupplyLimit,
    bottleneckCapacity: input.bottleneckCapacity,
    sourceForecasts: input.sourceForecasts.map((forecast) => ({
      reservationId: forecast.reservationId,
      originDistrictId: createClientDistrictId(forecast.originDistrictId),
      destinationDistrictId: createClientDistrictId(forecast.destinationDistrictId),
      status: forecast.status,
      carriedSupplyAmount: forecast.carriedSupplyAmount,
      carriedSupplyLimit: forecast.carriedSupplyLimit,
      bottleneckCapacity: forecast.bottleneckCapacity,
      travelDays: forecast.travelWindow.travelDays,
      earliestArrivalDay: forecast.travelWindow.earliestArrivalDay,
      latestArrivalDay: forecast.travelWindow.latestArrivalDay,
      overloadedReasonCode: forecast.overloadedReasonCode,
      seasonRiskReasonCodes: forecast.seasonRiskReasonCodes
    })),
    reasonCodes: input.reasonCodes
  };
}

function projectM4March(march: ClientM4MarchProtocolRow): ClientM4MarchReadModel {
  return {
    marchId: createClientCampaignMarchId(march.marchId),
    campaignPlanId: createClientCampaignPlanId(march.campaignPlanId),
    originDistrictId: createClientDistrictId(march.originDistrictId),
    targetDistrictId: createClientDistrictId(march.targetDistrictId),
    currentDistrictId: createClientDistrictId(march.currentDistrictId),
    activeTroops: march.activeTroops,
    status: march.status,
    statusReasonCode: march.statusReasonCode,
    supply: march.supply,
    predictedArrivalWindow: march.predictedArrivalWindow,
    actualArrivalDay: march.actualArrivalDay,
    joinedTroops: march.joinedCommitmentTroops.reduce(
      (sum, joined) => sum + joined.joinedTroops,
      0
    ),
    failedCommitmentIds: march.failedCommitmentIds,
    reasonCodes: march.reasonCodes
  };
}

function projectM4Siege(siege: ClientM4SiegeProtocolRow): ClientM4SiegeReadModel {
  return {
    siegeId: createClientSiegeId(siege.siegeId),
    campaignPlanId: createClientCampaignPlanId(siege.campaignPlanId),
    marchId: createClientCampaignMarchId(siege.marchId),
    targetDistrictId: createClientDistrictId(siege.targetDistrictId),
    attackerPolityId: createClientPolityId(siege.attackerPolityId),
    defenderPolityId: createClientPolityId(siege.defenderPolityId),
    status: siege.status,
    statusReasonCode: siege.statusReasonCode,
    fortification: siege.fortification,
    defenderEstimatedTroops: siege.defenderEstimatedTroops,
    defenderSupply: siege.defenderSupply,
    siegeProgress: siege.siegeProgress,
    daysInvested: siege.daysInvested,
    attackerTroops: siege.attackerTroops,
    attackerCasualties: siege.attackerCasualties,
    defenderCasualties: siege.defenderCasualties,
    supplyLoss: siege.supplyLoss,
    surrenderEligible: siege.surrenderEligible,
    surrenderReasonCodes: siege.surrenderReasonCodes,
    reasonCodes: siege.reasonCodes
  };
}

function projectM4Withdrawal(
  withdrawal: ClientM4WithdrawalProtocolRow
): ClientM4WithdrawalReadModel {
  return {
    withdrawalId: createClientWithdrawalId(withdrawal.withdrawalId),
    campaignPlanId: createClientCampaignPlanId(withdrawal.campaignPlanId),
    marchId: withdrawal.marchId === null ? null : createClientCampaignMarchId(withdrawal.marchId),
    siegeId: withdrawal.siegeId === null ? null : createClientSiegeId(withdrawal.siegeId),
    kind: withdrawal.kind,
    triggerReason: withdrawal.triggerReason,
    troopsBefore: withdrawal.troopsBefore,
    troopsExtracted: withdrawal.troopsExtracted,
    casualties: withdrawal.casualties,
    supplyLoss: withdrawal.supplyLoss,
    reasonCodes: withdrawal.reasonCodes,
    resolvedDay: withdrawal.resolvedDay
  };
}

function projectM4AiReason(trace: M4CampaignAiDecisionTraceV1): ClientM4AiReasonReadModel {
  return {
    decisionKind: trace.decisionKind,
    selectedCampaignPlanId:
      trace.selectedCampaignPlanId === null
        ? null
        : createClientCampaignPlanId(trace.selectedCampaignPlanId),
    commandKind: trace.commandKind,
    primaryReasonCode: trace.primaryReasonCode,
    reasonCodes: trace.reasonCodes,
    candidates: trace.candidates.map((candidate) => ({
      candidateId: candidate.candidateId,
      decisionKind: candidate.decisionKind,
      campaignPlanId:
        candidate.campaignPlanId === null
          ? null
          : createClientCampaignPlanId(candidate.campaignPlanId),
      commandKind: candidate.commandKind,
      score: candidate.score,
      reasonCodes: candidate.reasonCodes
    }))
  };
}

function projectM4WarReport(outcome: ClientM4WarOutcomeProtocolRow): ClientM4WarReportReadModel {
  return {
    outcomeId: createClientWarOutcomeId(outcome.outcomeId),
    campaignPlanId: createClientCampaignPlanId(outcome.campaignPlanId),
    victorPolityId: createClientPolityId(outcome.victorPolityId),
    localPolityId: createClientPolityId(outcome.localPolityId),
    targetDistrictId: createClientDistrictId(outcome.targetDistrictId),
    attackerCasualties: outcome.attackerCasualties,
    defenderCasualties: outcome.defenderCasualties,
    supplyLoss: outcome.supplyLoss,
    withdrawalId:
      outcome.withdrawalId === null ? null : createClientWithdrawalId(outcome.withdrawalId),
    siegeId: outcome.siegeId === null ? null : createClientSiegeId(outcome.siegeId),
    postwarCandidate:
      outcome.postwarCandidate === null
        ? null
        : {
            candidateId: outcome.postwarCandidate.candidateId,
            sourceWarOutcomeId: createClientWarOutcomeId(
              outcome.postwarCandidate.sourceWarOutcomeId
            ),
            settlementId: outcome.postwarCandidate.settlementId,
            victorPolityId: createClientPolityId(outcome.postwarCandidate.victorPolityId),
            localPolityId: createClientPolityId(outcome.postwarCandidate.localPolityId),
            districtId: createClientDistrictId(outcome.postwarCandidate.districtId),
            validM3Methods: outcome.postwarCandidate.validM3Methods,
            reasonCodes: outcome.postwarCandidate.reasonCodes
          },
    reasonCodes: outcome.reasonCodes,
    resolvedDay: outcome.resolvedDay
  };
}

interface M4ReasonSummarySourceInput {
  readonly plans: readonly ClientM4CampaignPlanReadModel[];
  readonly muster: ClientM4MusterReadModel;
  readonly grain: ClientM4GrainSupplyReadModel;
  readonly route: ClientM4RouteForecastReadModel;
  readonly marches: readonly ClientM4MarchReadModel[];
  readonly sieges: readonly ClientM4SiegeReadModel[];
  readonly withdrawals: readonly ClientM4WithdrawalReadModel[];
  readonly aiReason: ClientM4AiReasonReadModel;
  readonly warReports: readonly ClientM4WarReportReadModel[];
}

function summarizeM4ReasonCodes(
  input: M4ReasonSummarySourceInput
): readonly ClientM4ReasonSummaryReadModel[] {
  const accumulator = new Map<
    string,
    { count: number; sourceKinds: Set<ClientM4ReasonSourceKind> }
  >();
  const add = (reasonCodes: readonly string[], sourceKind: ClientM4ReasonSourceKind): void => {
    for (const reasonCode of reasonCodes) {
      const existing = accumulator.get(reasonCode);
      if (existing === undefined) {
        accumulator.set(reasonCode, { count: 1, sourceKinds: new Set([sourceKind]) });
      } else {
        existing.count += 1;
        existing.sourceKinds.add(sourceKind);
      }
    }
  };

  for (const plan of input.plans) {
    add(plan.reasonCodes, "campaign");
    add(plan.forecast.reasonCodes, "campaign");
    add([plan.statusReasonCode], "campaign");
  }
  add(input.muster.reasonCodes, "muster");
  for (const commitment of input.muster.commitments) {
    add(commitment.reasonCodes, "muster");
    add([commitment.statusReasonCode], "muster");
  }
  add(input.grain.reasonCodes, "grain");
  for (const reservation of input.grain.reservations) {
    add(reservation.reasonCodes, "grain");
    add([reservation.statusReasonCode], "grain");
    if (reservation.lossReasonCode !== null) {
      add([reservation.lossReasonCode], "grain");
    }
  }
  add(input.route.reasonCodes, "route");
  for (const forecast of input.route.sourceForecasts) {
    add(forecast.seasonRiskReasonCodes, "route");
    if (forecast.overloadedReasonCode !== null) {
      add([forecast.overloadedReasonCode], "route");
    }
  }
  for (const march of input.marches) {
    add(march.reasonCodes, "march");
    add([march.statusReasonCode, `march.supply.${march.supply.status}`], "march");
  }
  for (const siege of input.sieges) {
    add(siege.reasonCodes, "siege");
    add(siege.surrenderReasonCodes, "siege");
    add([siege.statusReasonCode], "siege");
  }
  for (const withdrawal of input.withdrawals) {
    add(withdrawal.reasonCodes, "withdrawal");
    add([`withdrawal.trigger.${withdrawal.triggerReason}`], "withdrawal");
  }
  add(input.aiReason.reasonCodes, "ai");
  add([input.aiReason.primaryReasonCode], "ai");
  for (const candidate of input.aiReason.candidates) {
    add(candidate.reasonCodes, "ai");
  }
  for (const report of input.warReports) {
    add(report.reasonCodes, "war-report");
    if (report.postwarCandidate !== null) {
      add(report.postwarCandidate.reasonCodes, "war-report");
    }
  }

  return [...accumulator.entries()]
    .map(([reasonCode, summary]) => ({
      reasonCode,
      count: summary.count,
      sourceKinds: [...summary.sourceKinds].sort()
    }))
    .sort(
      (left, right) => right.count - left.count || left.reasonCode.localeCompare(right.reasonCode)
    );
}

function createM4CampaignCatalogFixture(): ClientM4CampaignCatalogInput {
  return {
    commandActor: { kind: "player", id: "polity:1" },
    commandDefaults: {
      nextCampaignPlanId: 12,
      nextMarchId: 703,
      nextWithdrawalId: 903,
      originDistrictId: 1,
      grainPerTroopPerDay: 1,
      withdrawalTrigger: "ordered"
    },
    planningDraft: {
      owner: { kind: "polity", polityId: 1 },
      target: { kind: "district", districtId: 3 },
      objectiveKind: "besiege",
      startWindow: { earliestDay: 150, latestDay: 178 },
      reasonCodes: ["client.m4.plan.before-rainy-season", "campaign.reason.dry-season-range"]
    },
    polityLabels: [
      { polityId: 1, displayName: "Validation Court" },
      { polityId: 2, displayName: "Validation Local Ruler" }
    ],
    districtLabels: [
      { districtId: 1, displayName: "Prototype District 001" },
      { districtId: 2, displayName: "Prototype District 002" },
      { districtId: 3, displayName: "Prototype District 003" }
    ],
    characterLabels: [{ characterId: 1, displayName: "Validation Commander" }]
  };
}

function formatM4OwnerLabel(
  owner: M4CampaignOwnerV1,
  catalog: ClientM4CampaignCatalogInput
): string {
  if (owner.kind === "polity") {
    return (
      catalog.polityLabels.find((polity) => polity.polityId === owner.polityId)?.displayName ??
      `Polity ${owner.polityId}`
    );
  }
  return (
    catalog.characterLabels.find((character) => character.characterId === owner.characterId)
      ?.displayName ?? `Character ${owner.characterId}`
  );
}

function formatM4TargetLabel(
  target: M4CampaignTargetV1,
  catalog: ClientM4CampaignCatalogInput
): string {
  if (target.kind === "district") {
    return (
      catalog.districtLabels.find((district) => district.districtId === target.districtId)
        ?.displayName ?? `District ${target.districtId}`
    );
  }
  return (
    catalog.polityLabels.find((polity) => polity.polityId === target.polityId)?.displayName ??
    `Polity ${target.polityId}`
  );
}

function createEmptyM3AppointmentReadModel(
  revision: ClientReadModelRevision
): ClientM3AppointmentReadModelSnapshot {
  return {
    revision,
    day: 0,
    commandActor: { kind: "player", id: "polity:1" },
    provenance: {
      kind: "protocol-query-projection",
      note: "No M3 appointment read-model slice has been projected yet."
    },
    characters: [],
    polities: [],
    offices: [],
    obligations: [],
    successionCrises: [],
    appointmentResults: [],
    enfeoffmentResults: [],
    bulkPreview: {
      commandKind: "sim.appoint-offices-bulk",
      applyMode: "apply-eligible-only",
      eligibleCount: 0,
      rejectedCount: 0,
      items: []
    },
    reasonSummaries: []
  };
}

function createM3AppointmentCatalogFixture(): ClientM3AppointmentCatalogInput {
  return {
    commandActor: { kind: "player", id: "polity:1" },
    characters: [
      {
        characterId: 1,
        displayName: "Validation Regent",
        polityId: 1,
        availability: "available",
        roleLabel: "court administrator",
        behaviorReasonCodes: ["behavior.cautious", "behavior.court-aligned"]
      },
      {
        characterId: 2,
        displayName: "Validation Provincial Heir",
        polityId: 2,
        availability: "available",
        roleLabel: "local claimant",
        behaviorReasonCodes: ["behavior.local-power-base", "behavior.relationship.strained"]
      },
      {
        characterId: 3,
        displayName: "Validation Commander",
        polityId: 1,
        availability: "available",
        roleLabel: "campaign officer",
        behaviorReasonCodes: ["behavior.military-priority", "behavior.risk-tolerant"]
      },
      {
        characterId: 4,
        displayName: "Validation Unavailable Kin",
        polityId: 2,
        availability: "unavailable",
        roleLabel: "succession claimant",
        behaviorReasonCodes: ["behavior.regency-required", "character-unavailable"]
      }
    ],
    polities: [
      {
        polityId: 1,
        displayName: "Validation Court",
        relationKind: "court",
        suzerainPolityId: null,
        reasonCodes: ["polity.player-court"]
      },
      {
        polityId: 2,
        displayName: "Validation Vassal Court",
        relationKind: "vassal",
        suzerainPolityId: 1,
        reasonCodes: ["vassal.restored-ruler", "obligation.tribute.regular"]
      },
      {
        polityId: 3,
        displayName: "Validation Tributary Port",
        relationKind: "tributary",
        suzerainPolityId: 1,
        reasonCodes: ["tribute-only.low-control", "obligation.troop.commitment-limited"]
      }
    ],
    offices: [
      {
        officeId: 1,
        displayName: "Court Stewardship",
        officeKind: "minister",
        administrativeDistrictId: 1,
        policyStance: "balanced",
        policyReasonCodes: ["policy.continuity.preserved"]
      },
      {
        officeId: 2,
        displayName: "Vacant River Governorship",
        officeKind: "governor",
        administrativeDistrictId: 2,
        policyStance: "conciliatory",
        policyReasonCodes: ["policy.continuity.preserved"]
      },
      {
        officeId: 3,
        displayName: "Frontier Muster Office",
        officeKind: "commander",
        administrativeDistrictId: 2,
        policyStance: "military",
        policyReasonCodes: ["policy.continuity.preserved"]
      }
    ],
    eligibility: [
      {
        officeId: 1,
        characterId: 1,
        status: "eligible",
        reasonCodes: ["appointment.holder.skill-strong", "appointment.relationship.supportive"]
      },
      {
        officeId: 1,
        characterId: 2,
        status: "rejected",
        reasonCodes: ["office-primary-conflict", "appointment.relationship.strained"]
      },
      {
        officeId: 1,
        characterId: 4,
        status: "rejected",
        reasonCodes: ["character-unavailable"]
      },
      {
        officeId: 2,
        characterId: 2,
        status: "eligible",
        reasonCodes: ["appointment.local-claimant", "succession.support.provincial"]
      },
      {
        officeId: 2,
        characterId: 3,
        status: "rejected",
        reasonCodes: ["office-eligibility-failed"]
      },
      {
        officeId: 3,
        characterId: 3,
        status: "eligible",
        reasonCodes: ["appointment.command-fit", "behavior.military-priority"]
      }
    ],
    bulkItems: [
      {
        itemId: "office-2-local-claimant",
        officeId: 2,
        characterId: 2,
        status: "eligible",
        reasonCodes: ["appointment.local-claimant", "succession.support.provincial"]
      },
      {
        itemId: "office-3-commander",
        officeId: 3,
        characterId: 3,
        status: "eligible",
        reasonCodes: ["appointment.command-fit", "behavior.military-priority"]
      },
      {
        itemId: "office-1-unavailable",
        officeId: 1,
        characterId: 4,
        status: "rejected",
        reasonCodes: ["character-unavailable"]
      }
    ]
  };
}

function createPostwarPreviewArrangement(
  method: M3PostwarGovernanceMethodV1,
  districtId: number,
  victorPolityId: number,
  localPolityId: number,
  policyId: number,
  reasonCodes: readonly string[]
): PreviewM3PostwarGovernanceResultV1["arrangements"][number] {
  const hasDirectGarrison = method === "direct-control";
  return {
    method,
    districtId,
    victorPolityId,
    localPolityId,
    administrativeBurden: {
      polityId: victorPolityId,
      districtId,
      controlMode: method === "direct-control" ? "direct" : "vassal",
      localComplexity: 50,
      communicationCost: method === "direct-control" ? 75 : 55,
      directness: method === "direct-control" ? 100 : 45,
      frontierPressure: 50,
      administrativeCapacity: 1_000,
      administrativeLoad: method === "direct-control" ? 330 : 210,
      overload: 0,
      efficiencyBps: method === "direct-control" ? 6_900 : 7_700,
      realizableIncomeBps: method === "direct-control" ? 8_400 : 6_200,
      obligationReliabilityBps: method === "direct-control" ? 7_200 : 6_600,
      delayRiskBps: method === "direct-control" ? 2_500 : 1_900,
      readinessBps: method === "direct-control" ? 7_900 : 6_800
    },
    obligationShape: {
      periodDays: 360,
      tributeCash: method === "direct-control" ? 0 : 120,
      troopHeadcount: method === "direct-control" ? 30 : 80,
      hasDirectGarrison
    },
    expectedIncomeCash: method === "direct-control" ? 220 : 80,
    expectedTributeCash: method === "direct-control" ? 0 : 120,
    localAcceptanceBps: method === "direct-control" ? 4_100 : 6_800,
    reliabilityBps: method === "direct-control" ? 7_200 : 6_600,
    militaryReadinessBps: method === "direct-control" ? 7_900 : 6_800,
    militaryContributionTroops: method === "direct-control" ? 30 : 80,
    riskBps: method === "direct-control" ? 4_900 : 3_200,
    reasonCodes: [...reasonCodes, `policy.${policyId}`]
  };
}

function projectM3AdministrativePreview(
  district: ListM3AdministrativeBurdenResultV1["districts"][number] | undefined
): ClientM3AdministrativePreviewReadModel {
  if (district === undefined) {
    throw new Error("Missing M3 administrative burden row for appointment preview.");
  }

  return {
    districtId: createClientDistrictId(district.districtId),
    controlMode: district.controlMode,
    administrativeLoad: district.administrativeLoad,
    overload: district.overload,
    efficiencyBps: district.efficiencyBps,
    obligationReliabilityBps: district.obligationReliabilityBps,
    readinessBps: district.readinessBps,
    reasonCodes: [
      `admin.control.${district.controlMode}`,
      district.overload > 0 ? "admin.overloaded" : "admin.within-capacity"
    ]
  };
}

function projectM3Eligibility(
  eligibility: ClientM3AppointmentEligibilityCatalogRow
): ClientM3AppointmentEligibilityReadModel {
  return {
    officeId: createClientOfficeId(eligibility.officeId),
    characterId: createClientCharacterId(eligibility.characterId),
    status: eligibility.status,
    reasonCodes: eligibility.reasonCodes
  };
}

function projectM3ObligationsFromPostwarPreview(
  preview: PreviewM3PostwarGovernanceResultV1
): readonly ClientM3ObligationReadModel[] {
  const obligations: ClientM3ObligationReadModel[] = [];
  for (const arrangement of preview.arrangements) {
    if (arrangement.obligationShape.tributeCash > 0) {
      obligations.push({
        obligationId: `${arrangement.method}.tribute.${arrangement.districtId}`,
        debtorPolityId: createClientPolityId(arrangement.localPolityId),
        creditorPolityId: createClientPolityId(arrangement.victorPolityId),
        obligationKind: "tribute",
        amount: arrangement.obligationShape.tributeCash,
        dueLabel: `${arrangement.obligationShape.periodDays} day cadence`,
        status: "preview",
        reasonCodes: arrangement.reasonCodes.filter((reasonCode) =>
          reasonCode.startsWith("obligation.")
        )
      });
    }
    if (arrangement.obligationShape.troopHeadcount > 0) {
      obligations.push({
        obligationId: `${arrangement.method}.troops.${arrangement.districtId}`,
        debtorPolityId: createClientPolityId(arrangement.localPolityId),
        creditorPolityId: createClientPolityId(arrangement.victorPolityId),
        obligationKind: "troop",
        amount: arrangement.obligationShape.troopHeadcount,
        dueLabel: "war trigger",
        status: "preview",
        reasonCodes: arrangement.reasonCodes.filter((reasonCode) =>
          reasonCode.startsWith("obligation.")
        )
      });
    }
    if (arrangement.obligationShape.hasDirectGarrison) {
      obligations.push({
        obligationId: `${arrangement.method}.garrison.${arrangement.districtId}`,
        debtorPolityId: createClientPolityId(arrangement.victorPolityId),
        creditorPolityId: createClientPolityId(arrangement.victorPolityId),
        obligationKind: "garrison",
        amount: arrangement.militaryContributionTroops,
        dueLabel: "continuous",
        status: "preview",
        reasonCodes: arrangement.reasonCodes.filter((reasonCode) =>
          reasonCode.startsWith("obligation.")
        )
      });
    }
  }

  return obligations;
}

function projectM3BulkPreview(
  items: readonly ClientM3BulkAppointmentCatalogRow[]
): ClientM3BulkAppointmentPreviewReadModel {
  const projected = items.map((item) => ({
    itemId: item.itemId,
    officeId: createClientOfficeId(item.officeId),
    characterId: item.characterId === null ? null : createClientCharacterId(item.characterId),
    status: item.status,
    reasonCodes: item.reasonCodes
  }));

  return {
    commandKind: "sim.appoint-offices-bulk",
    applyMode: "apply-eligible-only",
    eligibleCount: projected.filter((item) => item.status === "eligible").length,
    rejectedCount: projected.filter((item) => item.status === "rejected").length,
    items: projected
  };
}

interface M3ReasonSummarySourceInput {
  readonly characters: readonly ClientM3CharacterReadModel[];
  readonly polities: readonly ClientM3PolityReadModel[];
  readonly offices: readonly ClientM3OfficeReadModel[];
  readonly obligations: readonly ClientM3ObligationReadModel[];
  readonly successionCrises: readonly ClientM3SuccessionCrisisReadModel[];
  readonly appointmentResults: readonly ClientM3AppointmentResultReadModel[];
  readonly enfeoffmentResults: readonly ClientM3EnfeoffmentResultReadModel[];
  readonly bulkPreview: ClientM3BulkAppointmentPreviewReadModel;
}

function summarizeM3ReasonCodes(
  input: M3ReasonSummarySourceInput
): readonly ClientM3ReasonSummaryReadModel[] {
  const accumulator = new Map<
    string,
    { count: number; sourceKinds: Set<ClientM3ReasonSourceKind> }
  >();
  const add = (reasonCodes: readonly string[], sourceKind: ClientM3ReasonSourceKind): void => {
    for (const reasonCode of reasonCodes) {
      const existing = accumulator.get(reasonCode);
      if (existing === undefined) {
        accumulator.set(reasonCode, { count: 1, sourceKinds: new Set([sourceKind]) });
      } else {
        existing.count += 1;
        existing.sourceKinds.add(sourceKind);
      }
    }
  };

  for (const character of input.characters) {
    add(character.behaviorReasonCodes, "behavior");
  }
  for (const polity of input.polities) {
    add(polity.reasonCodes, "obligation");
  }
  for (const office of input.offices) {
    add(office.reasonCodes, "appointment");
    add(office.policy.reasonCodes, "policy");
    for (const eligibility of office.candidateEligibilities) {
      add(eligibility.reasonCodes, eligibility.status === "eligible" ? "appointment" : "bulk");
    }
    if (office.administrativePreview !== null) {
      add(office.administrativePreview.reasonCodes, "appointment");
    }
  }
  for (const obligation of input.obligations) {
    add(obligation.reasonCodes, "obligation");
  }
  for (const crisis of input.successionCrises) {
    for (const candidate of crisis.candidates) {
      add(candidate.supportReasonCodes, "succession");
    }
  }
  for (const result of input.appointmentResults) {
    add(result.reasonCodes, "appointment");
  }
  for (const result of input.enfeoffmentResults) {
    add(result.reasonCodes, "enfeoffment");
  }
  for (const item of input.bulkPreview.items) {
    add(item.reasonCodes, "bulk");
  }

  return [...accumulator.entries()]
    .map(([reasonCode, summary]) => ({
      reasonCode,
      count: summary.count,
      sourceKinds: [...summary.sourceKinds].sort()
    }))
    .sort(
      (left, right) => right.count - left.count || left.reasonCode.localeCompare(right.reasonCode)
    );
}

export function selectClientDistrictRows(
  input: ClientDistrictRowSelectionInput
): readonly ClientDistrictRowReadModel[] {
  const normalizedFilter = input.filter.trim().toLowerCase();
  const routeStatusFilter = input.routeStatusFilter ?? "all";
  const filteredRows = input.rows.filter((row) => {
    if (routeStatusFilter !== "all" && row.route.status !== routeStatusFilter) {
      return false;
    }
    return normalizedFilter.length === 0 || rowMatchesFilter(row, normalizedFilter);
  });

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

export function createClientCharacterId(value: number): ClientCharacterId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client character id must be a positive integer, received ${value}.`);
  }

  return value as ClientCharacterId;
}

export function createClientOfficeId(value: number): ClientOfficeId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client office id must be a positive integer, received ${value}.`);
  }

  return value as ClientOfficeId;
}

export function createClientPolicyId(value: number): ClientPolicyId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client policy id must be a positive integer, received ${value}.`);
  }

  return value as ClientPolicyId;
}

export function createClientPolityId(value: number): ClientPolityId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client polity id must be a positive integer, received ${value}.`);
  }

  return value as ClientPolityId;
}

export function createClientCampaignPlanId(value: number): ClientCampaignPlanId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client campaign plan id must be a positive integer, received ${value}.`);
  }

  return value as ClientCampaignPlanId;
}

export function createClientCampaignMarchId(value: number): ClientCampaignMarchId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client campaign march id must be a positive integer, received ${value}.`);
  }

  return value as ClientCampaignMarchId;
}

export function createClientSiegeId(value: number): ClientSiegeId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client siege id must be a positive integer, received ${value}.`);
  }

  return value as ClientSiegeId;
}

export function createClientWithdrawalId(value: number): ClientWithdrawalId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client withdrawal id must be a positive integer, received ${value}.`);
  }

  return value as ClientWithdrawalId;
}

export function createClientWarOutcomeId(value: number): ClientWarOutcomeId {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Client war outcome id must be a positive integer, received ${value}.`);
  }

  return value as ClientWarOutcomeId;
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
    const anchor = createM2PrototypeSoftRegionAnchor(x, y, districtNumber);
    const polygon = createM2PrototypeSoftRegionPolygon(x, y, districtNumber);

    districts.push({
      districtId,
      displayName: row.displayName,
      anchor,
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
    const anchor = createM2PrototypeSoftRegionAnchor(
      column * M2_PROTOTYPE_CELL_SIZE,
      rowIndex * M2_PROTOTYPE_CELL_SIZE,
      districtNumber
    );

    return {
      settlementId: createClientSettlementId(index + 1),
      districtId,
      displayName: `Prototype Settlement ${formatThreeDigitId(index + 1)}`,
      anchor: {
        xInMapUnits: anchor.xInMapUnits + 10,
        yInMapUnits: anchor.yInMapUnits + 18
      }
    };
  });
}

function createM2PrototypeSoftRegionAnchor(
  x: number,
  y: number,
  districtNumber: number
): ClientMapPointReadModel {
  return {
    xInMapUnits: x + M2_PROTOTYPE_CELL_SIZE / 2 + deterministicRegionOffset(districtNumber, 7, 12),
    yInMapUnits: y + M2_PROTOTYPE_CELL_SIZE / 2 + deterministicRegionOffset(districtNumber, 11, 10)
  };
}

function createM2PrototypeSoftRegionPolygon(
  x: number,
  y: number,
  districtNumber: number
): readonly ClientMapPointReadModel[] {
  const size = M2_PROTOTYPE_CELL_SIZE;
  const point = (baseX: number, baseY: number, salt: number): ClientMapPointReadModel => ({
    xInMapUnits: x + baseX + deterministicRegionOffset(districtNumber, salt, 5),
    yInMapUnits: y + baseY + deterministicRegionOffset(districtNumber, salt + 17, 5)
  });

  return [
    point(size * 0.1, size * 0.18, 1),
    point(size * 0.42, size * 0.06, 2),
    point(size * 0.84, size * 0.12, 3),
    point(size * 0.95, size * 0.47, 4),
    point(size * 0.86, size * 0.86, 5),
    point(size * 0.52, size * 0.96, 6),
    point(size * 0.14, size * 0.84, 7),
    point(size * 0.04, size * 0.5, 8)
  ];
}

function deterministicRegionOffset(
  districtNumber: number,
  salt: number,
  amplitude: number
): number {
  const value = (districtNumber * 37 + salt * 53) % (amplitude * 2 + 1);
  return value - amplitude;
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

const M7_UI_CHROME_LOCALIZATION_KEYS: readonly string[] = [
  "ui.m7.guidance.heading",
  "ui.m7.guidance.scenario",
  "ui.m7.guidance.tutorial",
  "ui.m7.guidance.hints",
  "ui.m7.guidance.encyclopedia",
  "ui.m7.guidance.coverage",
  "ui.m7.coverage.heading",
  "ui.m7.coverage.locale_matrix",
  "ui.m7.coverage.asset_manifest",
  "ui.m7.coverage.localization_checks",
  "ui.m7.coverage.viewport_smoke",
  "ui.m7.coverage.unresolved_risks"
];

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

export const HELLO_SIMULATION_PROTOCOL_VERSION = 1;

export type HelloCommandKind = "hello.adjust-signal";

export type HelloCommandTone = "calm" | "watchful" | "bright";

export interface HelloSimulationCommandDto {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly kind: HelloCommandKind;
  readonly day: number;
  readonly actorId: "hello-observer";
  readonly signalDelta: number;
  readonly tone: HelloCommandTone;
}

export interface HelloSimulationRequestDto {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly seed: "monsoon-sovereigns-foundation-003";
  readonly commands: readonly HelloSimulationCommandDto[];
}

export interface HelloSimulationResultDto {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly daysSimulated: number;
  readonly finalRevision: number;
  readonly stateHash: string;
}

export const DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION = 1;
export const DETERMINISTIC_RNG_STATE_SCHEMA_VERSION = 1;
export const DETERMINISTIC_RNG_ALGORITHM = "sfc32-fnv1a32-domain-v1";

export interface DeterministicRngDomainKeyDtoV1 {
  readonly schemaVersion: typeof DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION;
  readonly system: string;
  readonly day: number;
  readonly entity: string;
  readonly purpose: string;
  readonly substream: string;
}

export interface DeterministicRngStateDtoV1 {
  readonly schemaVersion: typeof DETERMINISTIC_RNG_STATE_SCHEMA_VERSION;
  readonly algorithm: typeof DETERMINISTIC_RNG_ALGORITHM;
  readonly seed: string;
  readonly domain: DeterministicRngDomainKeyDtoV1;
  readonly drawIndex: number;
  readonly state: readonly [number, number, number, number];
}

export const GAME_COMMAND_SCHEMA_VERSION = 1;
export const GAME_QUERY_SCHEMA_VERSION = 1;
export const SIMULATION_MESSAGE_PROTOCOL_VERSION = 1;

export type CommandActorKindV1 = "ai" | "player" | "system";
export type M3ObligationCategoryV1 =
  | "regular-tribute"
  | "extraordinary-levy"
  | "troop-obligation"
  | "defensive-garrison"
  | "specific-war-aid";
export type M3ObligationSettlementActionV1 =
  | "fulfillment"
  | "partial-fulfillment"
  | "deferral"
  | "refusal"
  | "remission"
  | "pursuit-recovery"
  | "default-breach";
export type M3PostwarGovernanceMethodV1 =
  | "direct-control"
  | "restore-vassal-ruler"
  | "tribute-only";
export type M4CampaignObjectiveKindV1 =
  | "prepare"
  | "march"
  | "besiege"
  | "relieve"
  | "withdraw"
  | "postwar-result-candidate";
export type M4SiegeChoiceV1 =
  | "invest-blockade"
  | "assault"
  | "continue"
  | "accept-surrender"
  | "lift-siege"
  | "withdraw";
export type M4WithdrawalTriggerV1 =
  | "ordered"
  | "supply"
  | "season"
  | "siege"
  | "loss"
  | "objective-complete";
export const M4_CAMPAIGN_AI_TRACE_SCHEMA_VERSION = 1;
export type M4CampaignAiDecisionKindV1 =
  | "no-action"
  | "wait"
  | "create-objective"
  | "change-objective"
  | "cancel"
  | "start-march"
  | "reinforce"
  | "continue"
  | "withdraw";

export interface M4CampaignAiCandidateTraceV1 {
  readonly candidateId: string;
  readonly decisionKind: M4CampaignAiDecisionKindV1;
  readonly campaignPlanId: number | null;
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly score: number;
  readonly reasonCodes: readonly string[];
}

export interface M4CampaignAiDecisionTraceV1 {
  readonly schemaVersion: typeof M4_CAMPAIGN_AI_TRACE_SCHEMA_VERSION;
  readonly actor: CommandActorV1;
  readonly observerPolityId: number;
  readonly day: number;
  readonly revision: number;
  readonly decisionKind: M4CampaignAiDecisionKindV1;
  readonly selectedCampaignPlanId: number | null;
  readonly selectedCandidateId: string | null;
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly commandId: string | null;
  readonly primaryReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly candidates: readonly M4CampaignAiCandidateTraceV1[];
}

export interface CommandActorV1 {
  readonly kind: CommandActorKindV1;
  readonly id: string;
}

export interface AdvanceDayCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.advance-day";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
}

export interface DebugSetDistrictControlCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "debug.set-district-control";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly districtId: number;
    readonly controllerPolityId: number | null;
  };
}

export interface VerifyStateHashCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.verify-state-hash";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly expectedHash: string;
}

export interface CommitLaborCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.commit-labor";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly populationGroupId: number;
    readonly purpose: "mobilized";
    readonly laborAmount: number;
    readonly durationDays: number;
  };
}

export interface SetPolitySuzerainCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.set-polity-suzerain";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly polityId: number;
    readonly directSuzerainPolityId: number | null;
    readonly reasonCode: string;
  };
}

export interface CreateObligationCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.create-obligation";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly debtorPolityId: number;
    readonly creditorPolityId: number;
    readonly obligationKind: "tribute" | "troop";
    readonly obligationCategory: M3ObligationCategoryV1;
    readonly obligationSource: {
      readonly kind: "vassalage";
      readonly sourceId: string;
    };
    readonly requirement:
      | {
          readonly kind: "amount";
          readonly resourceKind: "cash" | "grain" | "troops";
          readonly amount: number;
        }
      | {
          readonly kind: "condition";
          readonly conditionKey: string;
        };
    readonly due:
      | {
          readonly kind: "cadence";
          readonly periodDays: number;
          readonly nextDueDay: number;
        }
      | {
          readonly kind: "trigger";
          readonly triggerKey: string;
        };
  };
}

export interface RecordObligationFulfillmentCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.record-obligation-fulfillment";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly obligationId: number;
    readonly fulfillmentId: number;
    readonly actionKind: M3ObligationSettlementActionV1;
    readonly dueDay: number;
    readonly fulfilledAmount: number;
    readonly reasonCode: string;
    readonly executorCharacterId: number | null;
    readonly officeId: number | null;
  };
}

export interface AppointOfficeCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.appoint-office";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly officeId: number;
    readonly characterId: number | null;
    readonly reasonCode: string;
  };
}

export interface BulkAppointOfficesCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.appoint-offices-bulk";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly items: readonly {
      readonly itemId: string;
      readonly officeId: number;
      readonly characterId: number | null;
      readonly reasonCode: string;
    }[];
  };
}

export type M3PolicyStanceV1 = "balanced" | "conciliatory" | "extractive" | "military";

export interface UpdateOfficePolicyCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.update-office-policy";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly policyId: number;
    readonly stance: M3PolicyStanceV1;
    readonly intensityBps: number;
    readonly reasonCode: string;
  };
}

export interface UpdateJurisdictionPolicyCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.update-jurisdiction-policy";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly policyId: number;
    readonly stance: M3PolicyStanceV1;
    readonly intensityBps: number;
    readonly reasonCode: string;
  };
}

export interface EnfeoffDistrictCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.enfeoff-district";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly districtId: number;
    readonly holderCharacterId: number;
    readonly grantedByPolityId: number;
    readonly policyId: number;
    readonly reasonCode: string;
  };
}

export interface RecordCharacterStatusCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.record-character-status";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly characterId: number;
    readonly status: "dead" | "incapacitated";
    readonly reasonCode: string;
  };
}

export interface ResolveSuccessionCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.resolve-succession";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly successionId: number;
    readonly reasonCode: string;
  };
}

export interface CreateCharacterRelationshipCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.create-character-relationship";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly sourceCharacterId: number;
    readonly targetCharacterId: number;
    readonly affinityBps: number;
    readonly reasonCode: string;
  };
}

export interface ApplyM3PostwarGovernanceCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.apply-m3-postwar-governance";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly settlementId: string;
    readonly victorPolityId: number;
    readonly localPolityId: number;
    readonly districtId: number;
    readonly method: M3PostwarGovernanceMethodV1;
    readonly localRulerCharacterId: number | null;
    readonly policyId: number | null;
    readonly reasonCode: string;
  };
}

export type M4CampaignOwnerV1 =
  | { readonly kind: "commander"; readonly characterId: number }
  | { readonly kind: "polity"; readonly polityId: number };
export type M4CampaignTargetV1 =
  | { readonly kind: "district"; readonly districtId: number }
  | { readonly kind: "polity"; readonly polityId: number };

export interface M4CampaignStartWindowV1 {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface CreateCampaignObjectiveCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.create-campaign-objective";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly campaignPlanId: number;
    readonly owner: M4CampaignOwnerV1;
    readonly target: M4CampaignTargetV1;
    readonly objectiveKind: M4CampaignObjectiveKindV1;
    readonly startWindow: M4CampaignStartWindowV1;
    readonly reasonCodes: readonly string[];
  };
}

export interface UpdateCampaignObjectiveCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.update-campaign-objective";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly campaignPlanId: number;
    readonly target: M4CampaignTargetV1;
    readonly objectiveKind: M4CampaignObjectiveKindV1;
    readonly startWindow: M4CampaignStartWindowV1;
    readonly reasonCodes: readonly string[];
  };
}

export interface CancelCampaignObjectiveCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.cancel-campaign-objective";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly campaignPlanId: number;
    readonly reasonCode: string;
  };
}

export type M4MusterCommitmentSourceV1 = {
  readonly kind: "m3-obligation";
  readonly obligationId: number;
};

export interface M4MusterAssemblyWindowV1 {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface CreateMusterCommitmentCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.create-muster-commitment";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly commitmentId: number;
    readonly campaignPlanId: number;
    readonly source: M4MusterCommitmentSourceV1;
    readonly promisedTroops: number;
    readonly dueDay: number;
    readonly assemblyWindow: M4MusterAssemblyWindowV1;
    readonly reasonCodes: readonly string[];
  };
}

export interface RecordMusterResponseCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.record-muster-response";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly commitmentId: number;
    readonly assembledTroops: number;
    readonly delayedTroops: number;
    readonly refusedTroops: number;
    readonly releasedTroops: number;
    readonly reasonCodes: readonly string[];
  };
}

export interface ReserveCampaignGrainSupplyCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.reserve-campaign-grain-supply";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly reservationId: number;
    readonly campaignPlanId: number;
    readonly requestedAmount: number;
    readonly expectedDailyConsumption: number;
    readonly reasonCodes: readonly string[];
  };
}

export interface ConsumeCampaignGrainSupplyCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.consume-campaign-grain-supply";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly reservationId: number;
    readonly consumedAmount: number;
    readonly lossAmount: number;
    readonly lossReasonCode: string | null;
    readonly reasonCodes: readonly string[];
  };
}

export interface ReleaseCampaignGrainSupplyCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.release-campaign-grain-supply";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly reservationId: number;
    readonly reasonCode: string;
  };
}

export interface StartCampaignMarchCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.start-campaign-march";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly marchId: number;
    readonly campaignPlanId: number;
    readonly originDistrictId: number;
    readonly plannedDepartureDay: number;
    readonly grainPerTroopPerDay: number;
    readonly reasonCodes: readonly string[];
  };
}

export interface ResolveM4FieldEngagementCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.resolve-m4-field-engagement";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly engagementId: number;
    readonly campaignPlanId: number;
    readonly marchId: number;
    readonly defenderPolityId: number;
    readonly defenderEstimatedTroops: number;
    readonly defenderFortification: number;
    readonly reasonCodes: readonly string[];
  };
}

export interface ApplyM4SiegeChoiceCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.apply-m4-siege-choice";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly siegeId: number;
    readonly campaignPlanId: number;
    readonly marchId: number;
    readonly choice: M4SiegeChoiceV1;
    readonly defenderPolityId: number;
    readonly fortification: number;
    readonly defenderEstimatedTroops: number;
    readonly defenderSupply: number;
    readonly reasonCodes: readonly string[];
  };
}

export interface ResolveM4CampaignWithdrawalCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.resolve-m4-campaign-withdrawal";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly withdrawalId: number;
    readonly campaignPlanId: number;
    readonly marchId: number | null;
    readonly siegeId: number | null;
    readonly triggerReason: M4WithdrawalTriggerV1;
    readonly reasonCodes: readonly string[];
  };
}

export type GameCommandV1 =
  | AdvanceDayCommandV1
  | DebugSetDistrictControlCommandV1
  | CommitLaborCommandV1
  | SetPolitySuzerainCommandV1
  | CreateObligationCommandV1
  | RecordObligationFulfillmentCommandV1
  | AppointOfficeCommandV1
  | BulkAppointOfficesCommandV1
  | UpdateOfficePolicyCommandV1
  | UpdateJurisdictionPolicyCommandV1
  | EnfeoffDistrictCommandV1
  | RecordCharacterStatusCommandV1
  | ResolveSuccessionCommandV1
  | CreateCharacterRelationshipCommandV1
  | ApplyM3PostwarGovernanceCommandV1
  | CreateCampaignObjectiveCommandV1
  | UpdateCampaignObjectiveCommandV1
  | CancelCampaignObjectiveCommandV1
  | CreateMusterCommitmentCommandV1
  | RecordMusterResponseCommandV1
  | ReserveCampaignGrainSupplyCommandV1
  | ConsumeCampaignGrainSupplyCommandV1
  | ReleaseCampaignGrainSupplyCommandV1
  | StartCampaignMarchCommandV1
  | ResolveM4FieldEngagementCommandV1
  | ApplyM4SiegeChoiceCommandV1
  | ResolveM4CampaignWithdrawalCommandV1
  | VerifyStateHashCommandV1;

const GAME_COMMAND_KINDS: readonly GameCommandV1["kind"][] = [
  "sim.advance-day",
  "debug.set-district-control",
  "sim.commit-labor",
  "sim.set-polity-suzerain",
  "sim.create-obligation",
  "sim.record-obligation-fulfillment",
  "sim.appoint-office",
  "sim.appoint-offices-bulk",
  "sim.update-office-policy",
  "sim.update-jurisdiction-policy",
  "sim.enfeoff-district",
  "sim.record-character-status",
  "sim.resolve-succession",
  "sim.create-character-relationship",
  "sim.apply-m3-postwar-governance",
  "sim.create-campaign-objective",
  "sim.update-campaign-objective",
  "sim.cancel-campaign-objective",
  "sim.create-muster-commitment",
  "sim.record-muster-response",
  "sim.reserve-campaign-grain-supply",
  "sim.consume-campaign-grain-supply",
  "sim.release-campaign-grain-supply",
  "sim.start-campaign-march",
  "sim.resolve-m4-field-engagement",
  "sim.apply-m4-siege-choice",
  "sim.resolve-m4-campaign-withdrawal",
  "sim.verify-state-hash"
];

export interface GetStateHashQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.get-state-hash";
}

export interface GetCalendarQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.get-calendar";
}

export interface ListDistrictSummariesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-district-summaries";
}

export interface ListM2EconomySummariesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m2-economy-summaries";
}

export interface ListM3AdministrativeBurdenQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m3-administrative-burden";
}

export interface ListM3DecisionScaffoldsQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m3-decision-scaffolds";
}

export interface ListM3SuccessionCrisesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m3-succession-crises";
}

export interface PreviewM2TransportRouteQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.preview-m2-transport-route";
  readonly payload: {
    readonly queryId: string;
    readonly originDistrictId: number;
    readonly destinationDistrictId: number;
    readonly stockAmount: number;
  };
}

export interface PreviewM3PostwarGovernanceQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.preview-m3-postwar-governance";
  readonly payload: {
    readonly queryId: string;
    readonly victorPolityId: number;
    readonly localPolityId: number;
    readonly districtId: number;
    readonly methods: readonly M3PostwarGovernanceMethodV1[];
    readonly months: number;
  };
}

export interface CompareM3PostwarGovernanceOutcomesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.compare-m3-postwar-governance-outcomes";
  readonly payload: {
    readonly queryId: string;
    readonly victorPolityId: number;
    readonly localPolityId: number;
    readonly districtId: number;
    readonly months: number;
  };
}

export interface ListM4CampaignPlansQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-campaign-plans";
}

export interface ListM4FactionKnowledgeQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-faction-knowledge";
  readonly payload: {
    readonly queryId: string;
    readonly observerPolityId: number;
  };
}

export interface ListM4MusterCommitmentsQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-muster-commitments";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
  };
}

export interface PreviewM4GrainSupplyQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.preview-m4-grain-supply";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
    readonly plannedMarchDays: number;
    readonly grainPerTroopPerDay: number;
  };
}

export interface PreviewM4RouteTransportCapacityQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.preview-m4-route-transport-capacity";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
  };
}

export interface ListM4MarchStateQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-march-state";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
  };
}

export interface ListM4SiegeStateQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-siege-state";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
  };
}

export interface ListM4WithdrawalStateQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-withdrawal-state";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
  };
}

export interface ListM4WarOutcomesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m4-war-outcomes";
  readonly payload: {
    readonly queryId: string;
    readonly campaignPlanId: number;
  };
}

export type GameQueryV1 =
  | GetStateHashQueryV1
  | GetCalendarQueryV1
  | ListDistrictSummariesQueryV1
  | ListM2EconomySummariesQueryV1
  | ListM3AdministrativeBurdenQueryV1
  | ListM3DecisionScaffoldsQueryV1
  | ListM3SuccessionCrisesQueryV1
  | PreviewM2TransportRouteQueryV1
  | PreviewM3PostwarGovernanceQueryV1
  | CompareM3PostwarGovernanceOutcomesQueryV1
  | ListM4CampaignPlansQueryV1
  | ListM4FactionKnowledgeQueryV1
  | ListM4MusterCommitmentsQueryV1
  | PreviewM4GrainSupplyQueryV1
  | PreviewM4RouteTransportCapacityQueryV1
  | ListM4MarchStateQueryV1
  | ListM4SiegeStateQueryV1
  | ListM4WithdrawalStateQueryV1
  | ListM4WarOutcomesQueryV1;

export type DistrictControlKindV1 = "controlled" | "uncontrolled";

export interface DistrictControlReadModelV1 {
  readonly kind: DistrictControlKindV1;
  readonly controllerPolityId?: number;
}

export interface DistrictSummaryReadModelV1 {
  readonly districtId: number;
  readonly displayNameKey: string;
  readonly control: DistrictControlReadModelV1;
}

export interface ListDistrictSummariesResultV1 {
  readonly kind: "sim.list-district-summaries";
  readonly day: number;
  readonly revision: number;
  readonly districts: readonly DistrictSummaryReadModelV1[];
}

export interface M2EconomyDistrictSummaryReadModelV1 {
  readonly districtId: number;
  readonly population: number;
  readonly availableLabor: number;
  readonly committedLabor: number;
  readonly grainStock: number;
  readonly cashStock: number;
  readonly agriculturePhase: string;
  readonly lastHarvestGrain: number;
  readonly cumulativeMobilizationCost: number;
}

export interface ListM2EconomySummariesResultV1 {
  readonly kind: "sim.list-m2-economy-summaries";
  readonly day: number;
  readonly revision: number;
  readonly districts: readonly M2EconomyDistrictSummaryReadModelV1[];
}

export type M3AdministrativeControlModeV1 = "direct" | "vassal" | "tribute-only";

export interface M3AdministrativeBurdenDistrictReadModelV1 {
  readonly polityId: number;
  readonly districtId: number;
  readonly controlMode: M3AdministrativeControlModeV1;
  readonly localComplexity: number;
  readonly communicationCost: number;
  readonly directness: number;
  readonly frontierPressure: number;
  readonly administrativeCapacity: number;
  readonly administrativeLoad: number;
  readonly overload: number;
  readonly efficiencyBps: number;
  readonly realizableIncomeBps: number;
  readonly obligationReliabilityBps: number;
  readonly delayRiskBps: number;
  readonly readinessBps: number;
}

export interface ListM3AdministrativeBurdenResultV1 {
  readonly kind: "sim.list-m3-administrative-burden";
  readonly day: number;
  readonly revision: number;
  readonly districts: readonly M3AdministrativeBurdenDistrictReadModelV1[];
}

export interface M3DecisionOfficeScaffoldReadModelV1 {
  readonly officeId: number;
  readonly holderCharacterId: number | null;
  readonly policyId: number;
  readonly executionPerformanceBps: number;
  readonly reasonCodes: readonly string[];
}

export interface M3DecisionPolicyScaffoldReadModelV1 {
  readonly policyId: number;
  readonly targetKind: "district" | "office" | "polity";
  readonly reasonCodes: readonly string[];
}

export interface M3DecisionEnfeoffmentScaffoldReadModelV1 {
  readonly districtId: number;
  readonly holderCharacterId: number;
  readonly reasonCodes: readonly string[];
}

export interface ListM3DecisionScaffoldsResultV1 {
  readonly kind: "sim.list-m3-decision-scaffolds";
  readonly day: number;
  readonly revision: number;
  readonly offices: readonly M3DecisionOfficeScaffoldReadModelV1[];
  readonly policies: readonly M3DecisionPolicyScaffoldReadModelV1[];
  readonly enfeoffments: readonly M3DecisionEnfeoffmentScaffoldReadModelV1[];
}

export type M3SuccessionSupportKindV1 =
  | "kinship"
  | "designation"
  | "court"
  | "military"
  | "provincial"
  | "suzerain"
  | "foreign";

export interface M3SuccessionSupportSourceReadModelV1 {
  readonly kind: M3SuccessionSupportKindV1;
  readonly strengthBps: number;
  readonly sourceId: string;
}

export interface M3SuccessionCandidateReadModelV1 {
  readonly characterId: number;
  readonly requiresRegency: boolean;
  readonly supportTotalBps: number;
  readonly supportSources: readonly M3SuccessionSupportSourceReadModelV1[];
}

export interface M3SuccessionCrisisReadModelV1 {
  readonly successionId: number;
  readonly polityId: number;
  readonly status: "pending" | "resolved";
  readonly candidates: readonly M3SuccessionCandidateReadModelV1[];
}

export interface ListM3SuccessionCrisesResultV1 {
  readonly kind: "sim.list-m3-succession-crises";
  readonly day: number;
  readonly revision: number;
  readonly crises: readonly M3SuccessionCrisisReadModelV1[];
}

export type M2TransportRouteKindV1 = "road" | "river" | "coast";

export type M2TransportRoutePreviewReadModelV1 =
  | {
      readonly status: "unreachable";
      readonly originDistrictId: number;
      readonly destinationDistrictId: number;
      readonly stockAmount: number;
      readonly edges: readonly [];
    }
  | {
      readonly status: "capacity-exceeded" | "reachable";
      readonly originDistrictId: number;
      readonly destinationDistrictId: number;
      readonly stockAmount: number;
      readonly totalCost: number;
      readonly bottleneckCapacity: number;
      readonly edges: readonly M2TransportRoutePreviewEdgeReadModelV1[];
    };

export interface M2TransportRoutePreviewEdgeReadModelV1 {
  readonly routeId: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly routeKind: M2TransportRouteKindV1;
  readonly baseTravelCost: number;
  readonly seasonalCost: number;
  readonly baseCapacity: number;
  readonly seasonalCapacity: number;
  readonly stockAmount: number;
  readonly remainingCapacityAfterStock: number;
}

export interface PreviewM2TransportRouteResultV1 {
  readonly kind: "sim.preview-m2-transport-route";
  readonly day: number;
  readonly revision: number;
  readonly monthOfYear: number;
  readonly route: M2TransportRoutePreviewReadModelV1;
}

export interface M3PostwarGovernanceObligationShapeReadModelV1 {
  readonly periodDays: number;
  readonly tributeCash: number;
  readonly troopHeadcount: number;
  readonly hasDirectGarrison: boolean;
}

export interface M3PostwarGovernancePreviewReadModelV1 {
  readonly method: M3PostwarGovernanceMethodV1;
  readonly districtId: number;
  readonly victorPolityId: number;
  readonly localPolityId: number;
  readonly administrativeBurden: M3AdministrativeBurdenDistrictReadModelV1;
  readonly obligationShape: M3PostwarGovernanceObligationShapeReadModelV1;
  readonly expectedIncomeCash: number;
  readonly expectedTributeCash: number;
  readonly localAcceptanceBps: number;
  readonly reliabilityBps: number;
  readonly militaryReadinessBps: number;
  readonly militaryContributionTroops: number;
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
}

export interface PreviewM3PostwarGovernanceResultV1 {
  readonly kind: "sim.preview-m3-postwar-governance";
  readonly day: number;
  readonly revision: number;
  readonly months: number;
  readonly arrangements: readonly M3PostwarGovernancePreviewReadModelV1[];
}

export interface M3PostwarGovernanceOutcomeReadModelV1 {
  readonly months: number;
  readonly method: M3PostwarGovernanceMethodV1;
  readonly totalExpectedIncomeCash: number;
  readonly totalExpectedTributeCash: number;
  readonly averageAdministrativeLoad: number;
  readonly averageReliabilityBps: number;
  readonly totalMilitaryContributionTroops: number;
  readonly averageRiskBps: number;
  readonly reasonCodes: readonly string[];
}

export interface CompareM3PostwarGovernanceOutcomesResultV1 {
  readonly kind: "sim.compare-m3-postwar-governance-outcomes";
  readonly day: number;
  readonly revision: number;
  readonly months: number;
  readonly outcomes: readonly M3PostwarGovernanceOutcomeReadModelV1[];
}

export type SimulationFixtureIdV1 = "m1.abstract-graph-30" | "minimal-m1";

export interface FixtureBootSimulationInputV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly fixture: SimulationFixtureIdV1;
}

export interface RuntimeContentPackBootSimulationInputV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly source: "runtime-content-pack";
  readonly seed: number;
  readonly runtimeContentPack: Record<string, unknown>;
}

export type BootSimulationInputV1 =
  | FixtureBootSimulationInputV1
  | RuntimeContentPackBootSimulationInputV1;

export interface CommandQueryCanaryScriptV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly boot: BootSimulationInputV1;
  readonly commands: readonly GameCommandV1[];
}

export interface SaveLoadCanaryScriptV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly boot: BootSimulationInputV1;
  readonly commands: readonly GameCommandV1[];
  readonly expectedContentManifestHash: string;
  readonly expectedScenarioId: SimulationFixtureIdV1;
}

export type ProtocolErrorCodeV1 =
  | "invalid-payload"
  | "unknown-command-kind"
  | "unknown-message-type"
  | "unknown-query-kind"
  | "unsupported-command-version"
  | "unsupported-message-version"
  | "unsupported-query-version";

export interface SerializableProtocolErrorV1 {
  readonly code: ProtocolErrorCodeV1;
  readonly path: string;
  readonly message: string;
}

export type ProtocolParseResult<TValue> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: SerializableProtocolErrorV1 };

export type SimulationMessageV1 =
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.boot";
      readonly payload: BootSimulationInputV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.preview-command";
      readonly payload: GameCommandV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.submit-command";
      readonly payload: GameCommandV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.query";
      readonly payload: GameQueryV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.request-save";
      readonly payload: Record<string, never>;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.load-save";
      readonly payload: {
        readonly bytes: Uint8Array;
      };
    };

const COMMAND_ID_PATTERN = /^[A-Za-z0-9._:-]{1,96}$/u;
const ACTOR_ID_PATTERN = /^[A-Za-z0-9._:-]{1,96}$/u;
const HASH_PATTERN = /^[0-9a-f]{8}$/u;
const COMMAND_ACTOR_KINDS: readonly CommandActorKindV1[] = ["ai", "player", "system"];

const HELLO_TONES: readonly HelloCommandTone[] = ["calm", "watchful", "bright"];

export function createHelloThirtyDayRequest(): HelloSimulationRequestDto {
  const commands: HelloSimulationCommandDto[] = [];

  for (let day = 1; day <= 30; day += 1) {
    const toneIndex = (day + 1) % HELLO_TONES.length;
    const tone = HELLO_TONES[toneIndex];
    if (tone === undefined) {
      throw new Error(`Missing deterministic hello tone for day ${day}.`);
    }

    commands.push({
      protocolVersion: HELLO_SIMULATION_PROTOCOL_VERSION,
      kind: "hello.adjust-signal",
      day,
      actorId: "hello-observer",
      signalDelta: ((day * 17) % 9) - 4,
      tone
    });
  }

  return {
    protocolVersion: HELLO_SIMULATION_PROTOCOL_VERSION,
    seed: "monsoon-sovereigns-foundation-003",
    commands
  };
}

export function createCommandQueryCanaryScript(): CommandQueryCanaryScriptV1 {
  return {
    protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
    boot: {
      protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
      fixture: "minimal-m1"
    },
    commands: [
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "debug.set-district-control",
        commandId: "canary.control.1",
        actor: { kind: "player", id: "player:canary" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          districtId: 1,
          controllerPolityId: 1
        }
      },
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.advance-day",
        commandId: "canary.advance.1",
        actor: { kind: "ai", id: "ai:canary" },
        expectedDay: 0,
        expectedRevision: 1
      },
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.advance-day",
        commandId: "canary.advance.2",
        actor: { kind: "system", id: "scheduler" },
        expectedDay: 1,
        expectedRevision: 2
      }
    ]
  };
}

export function createSaveLoadCanaryScriptV1(): SaveLoadCanaryScriptV1 {
  return {
    protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
    boot: {
      protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
      fixture: "m1.abstract-graph-30"
    },
    expectedContentManifestHash: "4a438525",
    expectedScenarioId: "m1.abstract-graph-30",
    commands: [
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "debug.set-district-control",
        commandId: "save.canary.control.1",
        actor: { kind: "player", id: "player:save-canary" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          districtId: 1,
          controllerPolityId: 1
        }
      },
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.advance-day",
        commandId: "save.canary.advance.1",
        actor: { kind: "ai", id: "ai:save-canary" },
        expectedDay: 0,
        expectedRevision: 1
      }
    ]
  };
}

export function parseGameCommandV1(input: unknown): ProtocolParseResult<GameCommandV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "GameCommand v1 must be an object.");
  }

  if (input["schemaVersion"] !== GAME_COMMAND_SCHEMA_VERSION) {
    return protocolError(
      "unsupported-command-version",
      "schemaVersion",
      "GameCommand schemaVersion must be 1."
    );
  }

  const kind = input["kind"];
  if (typeof kind !== "string") {
    return protocolError("invalid-payload", "kind", "GameCommand kind must be a string.");
  }

  const base = parseCommandBase(input);
  if (!base.ok) {
    return base;
  }

  switch (kind) {
    case "sim.advance-day":
      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value
        }
      };
    case "debug.set-district-control": {
      const payload = parseSetDistrictControlPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.commit-labor": {
      const payload = parseCommitLaborPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.set-polity-suzerain": {
      const payload = parseSetPolitySuzerainPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.create-obligation": {
      const payload = parseCreateObligationPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.record-obligation-fulfillment": {
      const payload = parseRecordObligationFulfillmentPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.appoint-office": {
      const payload = parseAppointOfficePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.appoint-offices-bulk": {
      const payload = parseBulkAppointOfficesPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.update-office-policy": {
      const payload = parseUpdatePolicyPayload<UpdateOfficePolicyCommandV1["payload"]>(
        input["payload"],
        "sim.update-office-policy"
      );
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.update-jurisdiction-policy": {
      const payload = parseUpdatePolicyPayload<UpdateJurisdictionPolicyCommandV1["payload"]>(
        input["payload"],
        "sim.update-jurisdiction-policy"
      );
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.enfeoff-district": {
      const payload = parseEnfeoffDistrictPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.record-character-status": {
      const payload = parseRecordCharacterStatusPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.resolve-succession": {
      const payload = parseResolveSuccessionPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.create-character-relationship": {
      const payload = parseCreateCharacterRelationshipPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.apply-m3-postwar-governance": {
      const payload = parseApplyM3PostwarGovernancePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.create-campaign-objective": {
      const payload = parseCreateCampaignObjectivePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.update-campaign-objective": {
      const payload = parseUpdateCampaignObjectivePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.cancel-campaign-objective": {
      const payload = parseCancelCampaignObjectivePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.create-muster-commitment": {
      const payload = parseCreateMusterCommitmentPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.record-muster-response": {
      const payload = parseRecordMusterResponsePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.reserve-campaign-grain-supply": {
      const payload = parseReserveCampaignGrainSupplyPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.consume-campaign-grain-supply": {
      const payload = parseConsumeCampaignGrainSupplyPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.release-campaign-grain-supply": {
      const payload = parseReleaseCampaignGrainSupplyPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.start-campaign-march": {
      const payload = parseStartCampaignMarchPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.resolve-m4-field-engagement": {
      const payload = parseResolveM4FieldEngagementPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.apply-m4-siege-choice": {
      const payload = parseApplyM4SiegeChoicePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.resolve-m4-campaign-withdrawal": {
      const payload = parseResolveM4CampaignWithdrawalPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.verify-state-hash": {
      const expectedHash = input["expectedHash"];
      if (typeof expectedHash !== "string" || !HASH_PATTERN.test(expectedHash)) {
        return protocolError(
          "invalid-payload",
          "expectedHash",
          "expectedHash must be an 8-character lowercase hexadecimal hash."
        );
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          expectedHash
        }
      };
    }
    default:
      return protocolError("unknown-command-kind", "kind", "GameCommand kind is not supported.");
  }
}

export function parseM4CampaignAiDecisionTraceV1(
  input: unknown
): ProtocolParseResult<M4CampaignAiDecisionTraceV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "M4 campaign AI trace must be an object.");
  }
  if (input["schemaVersion"] !== M4_CAMPAIGN_AI_TRACE_SCHEMA_VERSION) {
    return protocolError(
      "invalid-payload",
      "schemaVersion",
      "M4 campaign AI trace schemaVersion must be 1."
    );
  }
  const actor = parseCommandActor(input["actor"]);
  if (!actor.ok) {
    return actor;
  }
  const observerPolityId = parsePositiveSafeInteger(input["observerPolityId"], "observerPolityId");
  if (!observerPolityId.ok) {
    return observerPolityId;
  }
  const day = parseNonnegativeSafeInteger(input["day"], "day");
  if (!day.ok) {
    return day;
  }
  const revision = parseNonnegativeSafeInteger(input["revision"], "revision");
  if (!revision.ok) {
    return revision;
  }
  const decisionKind = parseM4CampaignAiDecisionKind(input["decisionKind"], "decisionKind");
  if (!decisionKind.ok) {
    return decisionKind;
  }
  const selectedCampaignPlanId = parseNullablePositiveSafeInteger(
    input["selectedCampaignPlanId"],
    "selectedCampaignPlanId"
  );
  if (!selectedCampaignPlanId.ok) {
    return selectedCampaignPlanId;
  }
  const selectedCandidateId = parseNullableProtocolString(
    input["selectedCandidateId"],
    "selectedCandidateId"
  );
  if (!selectedCandidateId.ok) {
    return selectedCandidateId;
  }
  const commandKind = parseNullableGameCommandKind(input["commandKind"], "commandKind");
  if (!commandKind.ok) {
    return commandKind;
  }
  const commandId = parseNullableCommandId(input["commandId"], "commandId");
  if (!commandId.ok) {
    return commandId;
  }
  const primaryReasonCode = parseNonEmptyProtocolString(
    input["primaryReasonCode"],
    "primaryReasonCode"
  );
  if (!primaryReasonCode.ok) {
    return primaryReasonCode;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }
  const candidates = parseM4CampaignAiCandidateTraceArray(input["candidates"]);
  if (!candidates.ok) {
    return candidates;
  }

  return {
    ok: true,
    value: {
      schemaVersion: M4_CAMPAIGN_AI_TRACE_SCHEMA_VERSION,
      actor: actor.value,
      observerPolityId: observerPolityId.value,
      day: day.value,
      revision: revision.value,
      decisionKind: decisionKind.value,
      selectedCampaignPlanId: selectedCampaignPlanId.value,
      selectedCandidateId: selectedCandidateId.value,
      commandKind: commandKind.value,
      commandId: commandId.value,
      primaryReasonCode: primaryReasonCode.value,
      reasonCodes: reasonCodes.value,
      candidates: candidates.value
    }
  };
}

export function parseGameQueryV1(input: unknown): ProtocolParseResult<GameQueryV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "GameQuery v1 must be an object.");
  }

  if (input["schemaVersion"] !== GAME_QUERY_SCHEMA_VERSION) {
    return protocolError(
      "unsupported-query-version",
      "schemaVersion",
      "GameQuery schemaVersion must be 1."
    );
  }

  const kind = input["kind"];
  switch (kind) {
    case "sim.get-state-hash":
    case "sim.get-calendar":
    case "sim.list-district-summaries":
    case "sim.list-m2-economy-summaries":
    case "sim.list-m3-administrative-burden":
    case "sim.list-m3-decision-scaffolds":
    case "sim.list-m3-succession-crises":
    case "sim.list-m4-campaign-plans":
      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind
        }
      };
    case "sim.preview-m2-transport-route": {
      const payload = parsePreviewM2TransportRoutePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.preview-m3-postwar-governance": {
      const payload = parsePreviewM3PostwarGovernancePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.compare-m3-postwar-governance-outcomes": {
      const payload = parseCompareM3PostwarGovernanceOutcomesPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.list-m4-faction-knowledge": {
      const payload = parseListM4FactionKnowledgePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.list-m4-muster-commitments": {
      const payload = parseListM4MusterCommitmentsPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.preview-m4-grain-supply": {
      const payload = parsePreviewM4GrainSupplyPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.preview-m4-route-transport-capacity": {
      const payload = parsePreviewM4RouteTransportCapacityPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.list-m4-march-state": {
      const payload = parseListM4MarchStatePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.list-m4-siege-state": {
      const payload = parseListM4SiegeStatePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.list-m4-withdrawal-state": {
      const payload = parseListM4WithdrawalStatePayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    case "sim.list-m4-war-outcomes": {
      const payload = parseListM4WarOutcomesPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind,
          payload: payload.value
        }
      };
    }
    default:
      if (typeof kind !== "string") {
        return protocolError("invalid-payload", "kind", "GameQuery kind must be a string.");
      }

      return protocolError("unknown-query-kind", "kind", "GameQuery kind is not supported.");
  }
}

export function parseSimulationMessageV1(input: unknown): ProtocolParseResult<SimulationMessageV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "Simulation message must be an object.");
  }

  if (input["protocolVersion"] !== SIMULATION_MESSAGE_PROTOCOL_VERSION) {
    return protocolError(
      "unsupported-message-version",
      "protocolVersion",
      "Simulation message protocolVersion must be 1."
    );
  }

  const requestId = input["requestId"];
  if (typeof requestId !== "string" || !COMMAND_ID_PATTERN.test(requestId)) {
    return protocolError(
      "invalid-payload",
      "requestId",
      "Simulation message requestId must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  const type = input["type"];
  switch (type) {
    case "simulation.boot": {
      const boot = parseBootSimulationInputV1(input["payload"]);
      if (!boot.ok) {
        return boot;
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: boot.value
        }
      };
    }
    case "simulation.preview-command":
    case "simulation.submit-command": {
      const command = parseGameCommandV1(input["payload"]);
      if (!command.ok) {
        return command;
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: command.value
        }
      };
    }
    case "simulation.query": {
      const query = parseGameQueryV1(input["payload"]);
      if (!query.ok) {
        return query;
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: query.value
        }
      };
    }
    case "simulation.request-save":
      if (!isRecord(input["payload"])) {
        return protocolError(
          "invalid-payload",
          "payload",
          "request-save payload must be an object."
        );
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: {}
        }
      };
    case "simulation.load-save": {
      const payload = input["payload"];
      if (!isRecord(payload) || !(payload["bytes"] instanceof Uint8Array)) {
        return protocolError(
          "invalid-payload",
          "payload.bytes",
          "load-save payload bytes must be a Uint8Array."
        );
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: {
            bytes: payload["bytes"]
          }
        }
      };
    }
    default:
      if (typeof type !== "string") {
        return protocolError(
          "invalid-payload",
          "type",
          "Simulation message type must be a string."
        );
      }

      return protocolError(
        "unknown-message-type",
        "type",
        "Simulation message type is not supported."
      );
  }
}

export function parseBootSimulationInputV1(
  input: unknown
): ProtocolParseResult<BootSimulationInputV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "BootSimulationInput v1 must be an object.");
  }

  if (input["protocolVersion"] !== SIMULATION_MESSAGE_PROTOCOL_VERSION) {
    return protocolError(
      "unsupported-message-version",
      "protocolVersion",
      "BootSimulationInput protocolVersion must be 1."
    );
  }

  const hasFixtureMode = input["fixture"] !== undefined;
  const hasRuntimeContentPackMode =
    input["source"] !== undefined ||
    input["seed"] !== undefined ||
    input["runtimeContentPack"] !== undefined;

  if (hasFixtureMode && hasRuntimeContentPackMode) {
    return protocolError(
      "invalid-payload",
      "$",
      "BootSimulationInput must specify either fixture or runtime-content-pack source, not both."
    );
  }

  if (input["fixture"] === "minimal-m1" || input["fixture"] === "m1.abstract-graph-30") {
    return {
      ok: true,
      value: {
        protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
        fixture: input["fixture"]
      }
    };
  }

  if (input["source"] === "runtime-content-pack") {
    const seed = parseNonnegativeSafeInteger(input["seed"], "seed");
    if (!seed.ok) {
      return seed;
    }

    const runtimeContentPack = input["runtimeContentPack"];
    if (!isRecord(runtimeContentPack)) {
      return protocolError(
        "invalid-payload",
        "runtimeContentPack",
        "BootSimulationInput runtimeContentPack must be an object."
      );
    }

    return {
      ok: true,
      value: {
        protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
        source: "runtime-content-pack",
        seed: seed.value,
        runtimeContentPack
      }
    };
  }

  if (input["source"] !== undefined) {
    return protocolError(
      "invalid-payload",
      "source",
      "BootSimulationInput source must be runtime-content-pack."
    );
  }

  return protocolError(
    "invalid-payload",
    "fixture",
    "BootSimulationInput fixture must be minimal-m1 or m1.abstract-graph-30."
  );
}

interface ParsedCommandBase {
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
}

function parseCommandBase(input: Record<string, unknown>): ProtocolParseResult<ParsedCommandBase> {
  const commandId = input["commandId"];
  if (typeof commandId !== "string" || !COMMAND_ID_PATTERN.test(commandId)) {
    return protocolError(
      "invalid-payload",
      "commandId",
      "commandId must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  const actor = parseCommandActor(input["actor"]);
  if (!actor.ok) {
    return actor;
  }

  const expectedDay = parseNonnegativeSafeInteger(input["expectedDay"], "expectedDay");
  if (!expectedDay.ok) {
    return expectedDay;
  }

  const expectedRevision = parseNonnegativeSafeInteger(
    input["expectedRevision"],
    "expectedRevision"
  );
  if (!expectedRevision.ok) {
    return expectedRevision;
  }

  return {
    ok: true,
    value: {
      commandId,
      actor: actor.value,
      expectedDay: expectedDay.value,
      expectedRevision: expectedRevision.value
    }
  };
}

function parseCommandActor(input: unknown): ProtocolParseResult<CommandActorV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "actor", "Command actor must be an object.");
  }

  const kind = input["kind"];
  if (!COMMAND_ACTOR_KINDS.includes(kind as CommandActorKindV1)) {
    return protocolError("invalid-payload", "actor.kind", "Command actor kind is invalid.");
  }

  const id = input["id"];
  if (typeof id !== "string" || !ACTOR_ID_PATTERN.test(id)) {
    return protocolError(
      "invalid-payload",
      "actor.id",
      "Command actor id must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  return {
    ok: true,
    value: {
      kind: kind as CommandActorKindV1,
      id
    }
  };
}

function parseSetDistrictControlPayload(
  input: unknown
): ProtocolParseResult<DebugSetDistrictControlCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "debug.set-district-control payload must be an object."
    );
  }

  const districtId = parsePositiveSafeInteger(input["districtId"], "payload.districtId");
  if (!districtId.ok) {
    return districtId;
  }

  const controllerPolityId = input["controllerPolityId"];
  if (controllerPolityId !== null && !isPositiveSafeInteger(controllerPolityId)) {
    return protocolError(
      "invalid-payload",
      "payload.controllerPolityId",
      "controllerPolityId must be a positive safe integer or null."
    );
  }

  return {
    ok: true,
    value: {
      districtId: districtId.value,
      controllerPolityId
    }
  };
}

function parseCommitLaborPayload(
  input: unknown
): ProtocolParseResult<CommitLaborCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.commit-labor payload must be an object."
    );
  }

  const populationGroupId = parsePositiveSafeInteger(
    input["populationGroupId"],
    "payload.populationGroupId"
  );
  if (!populationGroupId.ok) {
    return populationGroupId;
  }

  if (input["purpose"] !== "mobilized") {
    return protocolError("invalid-payload", "payload.purpose", "purpose must be mobilized.");
  }

  const laborAmount = parsePositiveSafeInteger(input["laborAmount"], "payload.laborAmount");
  if (!laborAmount.ok) {
    return laborAmount;
  }

  const durationDays = parsePositiveSafeInteger(input["durationDays"], "payload.durationDays");
  if (!durationDays.ok) {
    return durationDays;
  }

  return {
    ok: true,
    value: {
      populationGroupId: populationGroupId.value,
      purpose: "mobilized",
      laborAmount: laborAmount.value,
      durationDays: durationDays.value
    }
  };
}

function parseSetPolitySuzerainPayload(
  input: unknown
): ProtocolParseResult<SetPolitySuzerainCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.set-polity-suzerain payload must be an object."
    );
  }

  const polityId = parsePositiveSafeInteger(input["polityId"], "payload.polityId");
  if (!polityId.ok) {
    return polityId;
  }

  const directSuzerainPolityId = input["directSuzerainPolityId"];
  if (directSuzerainPolityId !== null && !isPositiveSafeInteger(directSuzerainPolityId)) {
    return protocolError(
      "invalid-payload",
      "payload.directSuzerainPolityId",
      "directSuzerainPolityId must be a positive safe integer or null."
    );
  }

  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      polityId: polityId.value,
      directSuzerainPolityId,
      reasonCode: reasonCode.value
    }
  };
}

function parseCreateObligationPayload(
  input: unknown
): ProtocolParseResult<CreateObligationCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.create-obligation payload must be an object."
    );
  }

  const debtorPolityId = parsePositiveSafeInteger(
    input["debtorPolityId"],
    "payload.debtorPolityId"
  );
  if (!debtorPolityId.ok) {
    return debtorPolityId;
  }
  const creditorPolityId = parsePositiveSafeInteger(
    input["creditorPolityId"],
    "payload.creditorPolityId"
  );
  if (!creditorPolityId.ok) {
    return creditorPolityId;
  }
  const obligationKind = input["obligationKind"];
  if (obligationKind !== "tribute" && obligationKind !== "troop") {
    return protocolError(
      "invalid-payload",
      "payload.obligationKind",
      "obligationKind must be tribute or troop."
    );
  }
  const obligationCategory = parseM3ObligationCategory(
    input["obligationCategory"],
    "payload.obligationCategory"
  );
  if (!obligationCategory.ok) {
    return obligationCategory;
  }
  const obligationSource = parseM3ObligationSource(input["obligationSource"]);
  if (!obligationSource.ok) {
    return obligationSource;
  }

  const requirement = parseObligationRequirement(input["requirement"]);
  if (!requirement.ok) {
    return requirement;
  }
  const due = parseObligationDue(input["due"]);
  if (!due.ok) {
    return due;
  }

  return {
    ok: true,
    value: {
      debtorPolityId: debtorPolityId.value,
      creditorPolityId: creditorPolityId.value,
      obligationKind,
      obligationCategory: obligationCategory.value,
      obligationSource: obligationSource.value,
      requirement: requirement.value,
      due: due.value
    }
  };
}

function parseRecordObligationFulfillmentPayload(
  input: unknown
): ProtocolParseResult<RecordObligationFulfillmentCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.record-obligation-fulfillment payload must be an object."
    );
  }

  const obligationId = parsePositiveSafeInteger(input["obligationId"], "payload.obligationId");
  if (!obligationId.ok) {
    return obligationId;
  }
  const fulfillmentId = parsePositiveSafeInteger(input["fulfillmentId"], "payload.fulfillmentId");
  if (!fulfillmentId.ok) {
    return fulfillmentId;
  }
  const actionKind = parseM3ObligationSettlementAction(input["actionKind"], "payload.actionKind");
  if (!actionKind.ok) {
    return actionKind;
  }
  const dueDay = parseNonnegativeSafeInteger(input["dueDay"], "payload.dueDay");
  if (!dueDay.ok) {
    return dueDay;
  }
  const fulfilledAmount = parseNonnegativeSafeInteger(
    input["fulfilledAmount"],
    "payload.fulfilledAmount"
  );
  if (!fulfilledAmount.ok) {
    return fulfilledAmount;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }
  const executorCharacterId = parseNullablePositiveSafeInteger(
    input["executorCharacterId"],
    "payload.executorCharacterId"
  );
  if (!executorCharacterId.ok) {
    return executorCharacterId;
  }
  const officeId = parseNullablePositiveSafeInteger(input["officeId"], "payload.officeId");
  if (!officeId.ok) {
    return officeId;
  }

  return {
    ok: true,
    value: {
      obligationId: obligationId.value,
      fulfillmentId: fulfillmentId.value,
      actionKind: actionKind.value,
      dueDay: dueDay.value,
      fulfilledAmount: fulfilledAmount.value,
      reasonCode: reasonCode.value,
      executorCharacterId: executorCharacterId.value,
      officeId: officeId.value
    }
  };
}

function parseAppointOfficePayload(
  input: unknown
): ProtocolParseResult<AppointOfficeCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.appoint-office payload must be an object."
    );
  }

  const officeId = parsePositiveSafeInteger(input["officeId"], "payload.officeId");
  if (!officeId.ok) {
    return officeId;
  }
  const characterId = parseNullablePositiveSafeInteger(input["characterId"], "payload.characterId");
  if (!characterId.ok) {
    return characterId;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      officeId: officeId.value,
      characterId: characterId.value,
      reasonCode: reasonCode.value
    }
  };
}

function parseBulkAppointOfficesPayload(
  input: unknown
): ProtocolParseResult<BulkAppointOfficesCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.appoint-offices-bulk payload must be an object."
    );
  }

  const items = input["items"];
  if (!Array.isArray(items) || items.length === 0) {
    return protocolError(
      "invalid-payload",
      "payload.items",
      "payload.items must be a non-empty array."
    );
  }

  const parsedItems: BulkAppointOfficesCommandV1["payload"]["items"][number][] = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!isRecord(item)) {
      return protocolError("invalid-payload", `payload.items[${index}]`, "item must be an object.");
    }
    const itemId = parseNonEmptyProtocolString(item["itemId"], `payload.items[${index}].itemId`);
    if (!itemId.ok) {
      return itemId;
    }
    const officeId = parsePositiveSafeInteger(item["officeId"], `payload.items[${index}].officeId`);
    if (!officeId.ok) {
      return officeId;
    }
    const characterId = parseNullablePositiveSafeInteger(
      item["characterId"],
      `payload.items[${index}].characterId`
    );
    if (!characterId.ok) {
      return characterId;
    }
    const reasonCode = parseNonEmptyProtocolString(
      item["reasonCode"],
      `payload.items[${index}].reasonCode`
    );
    if (!reasonCode.ok) {
      return reasonCode;
    }
    parsedItems.push({
      itemId: itemId.value,
      officeId: officeId.value,
      characterId: characterId.value,
      reasonCode: reasonCode.value
    });
  }

  return {
    ok: true,
    value: {
      items: parsedItems
    }
  };
}

function parseUpdatePolicyPayload<TPayload extends UpdateOfficePolicyCommandV1["payload"]>(
  input: unknown,
  commandKind: string
): ProtocolParseResult<TPayload> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "payload", `${commandKind} payload must be an object.`);
  }

  const policyId = parsePositiveSafeInteger(input["policyId"], "payload.policyId");
  if (!policyId.ok) {
    return policyId;
  }
  const stance = parseM3PolicyStance(input["stance"], "payload.stance");
  if (!stance.ok) {
    return stance;
  }
  const intensityBps = parseBps(input["intensityBps"], "payload.intensityBps");
  if (!intensityBps.ok) {
    return intensityBps;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      policyId: policyId.value,
      stance: stance.value,
      intensityBps: intensityBps.value,
      reasonCode: reasonCode.value
    } as TPayload
  };
}

function parseEnfeoffDistrictPayload(
  input: unknown
): ProtocolParseResult<EnfeoffDistrictCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.enfeoff-district payload must be an object."
    );
  }

  const districtId = parsePositiveSafeInteger(input["districtId"], "payload.districtId");
  if (!districtId.ok) {
    return districtId;
  }
  const holderCharacterId = parsePositiveSafeInteger(
    input["holderCharacterId"],
    "payload.holderCharacterId"
  );
  if (!holderCharacterId.ok) {
    return holderCharacterId;
  }
  const grantedByPolityId = parsePositiveSafeInteger(
    input["grantedByPolityId"],
    "payload.grantedByPolityId"
  );
  if (!grantedByPolityId.ok) {
    return grantedByPolityId;
  }
  const policyId = parsePositiveSafeInteger(input["policyId"], "payload.policyId");
  if (!policyId.ok) {
    return policyId;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      districtId: districtId.value,
      holderCharacterId: holderCharacterId.value,
      grantedByPolityId: grantedByPolityId.value,
      policyId: policyId.value,
      reasonCode: reasonCode.value
    }
  };
}

function parseRecordCharacterStatusPayload(
  input: unknown
): ProtocolParseResult<RecordCharacterStatusCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.record-character-status payload must be an object."
    );
  }

  const characterId = parsePositiveSafeInteger(input["characterId"], "payload.characterId");
  if (!characterId.ok) {
    return characterId;
  }
  const status = input["status"];
  if (status !== "dead" && status !== "incapacitated") {
    return protocolError(
      "invalid-payload",
      "payload.status",
      "status must be dead or incapacitated."
    );
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      characterId: characterId.value,
      status,
      reasonCode: reasonCode.value
    }
  };
}

function parseResolveSuccessionPayload(
  input: unknown
): ProtocolParseResult<ResolveSuccessionCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.resolve-succession payload must be an object."
    );
  }

  const successionId = parsePositiveSafeInteger(input["successionId"], "payload.successionId");
  if (!successionId.ok) {
    return successionId;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      successionId: successionId.value,
      reasonCode: reasonCode.value
    }
  };
}

function parseCreateCharacterRelationshipPayload(
  input: unknown
): ProtocolParseResult<CreateCharacterRelationshipCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.create-character-relationship payload must be an object."
    );
  }

  const sourceCharacterId = parsePositiveSafeInteger(
    input["sourceCharacterId"],
    "payload.sourceCharacterId"
  );
  if (!sourceCharacterId.ok) {
    return sourceCharacterId;
  }
  const targetCharacterId = parsePositiveSafeInteger(
    input["targetCharacterId"],
    "payload.targetCharacterId"
  );
  if (!targetCharacterId.ok) {
    return targetCharacterId;
  }
  const affinityBps = parseSignedBps(input["affinityBps"], "payload.affinityBps");
  if (!affinityBps.ok) {
    return affinityBps;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      sourceCharacterId: sourceCharacterId.value,
      targetCharacterId: targetCharacterId.value,
      affinityBps: affinityBps.value,
      reasonCode: reasonCode.value
    }
  };
}

function parseApplyM3PostwarGovernancePayload(
  input: unknown
): ProtocolParseResult<ApplyM3PostwarGovernanceCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.apply-m3-postwar-governance payload must be an object."
    );
  }

  const settlementId = parseNonEmptyProtocolString(input["settlementId"], "payload.settlementId");
  if (!settlementId.ok) {
    return settlementId;
  }
  const victorPolityId = parsePositiveSafeInteger(
    input["victorPolityId"],
    "payload.victorPolityId"
  );
  if (!victorPolityId.ok) {
    return victorPolityId;
  }
  const localPolityId = parsePositiveSafeInteger(input["localPolityId"], "payload.localPolityId");
  if (!localPolityId.ok) {
    return localPolityId;
  }
  const districtId = parsePositiveSafeInteger(input["districtId"], "payload.districtId");
  if (!districtId.ok) {
    return districtId;
  }
  const method = parseM3PostwarGovernanceMethod(input["method"], "payload.method");
  if (!method.ok) {
    return method;
  }
  const localRulerCharacterId = parseNullablePositiveSafeInteger(
    input["localRulerCharacterId"],
    "payload.localRulerCharacterId"
  );
  if (!localRulerCharacterId.ok) {
    return localRulerCharacterId;
  }
  const policyId = parseNullablePositiveSafeInteger(input["policyId"], "payload.policyId");
  if (!policyId.ok) {
    return policyId;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      settlementId: settlementId.value,
      victorPolityId: victorPolityId.value,
      localPolityId: localPolityId.value,
      districtId: districtId.value,
      method: method.value,
      localRulerCharacterId: localRulerCharacterId.value,
      policyId: policyId.value,
      reasonCode: reasonCode.value
    }
  };
}

function parseCreateCampaignObjectivePayload(
  input: unknown
): ProtocolParseResult<CreateCampaignObjectiveCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.create-campaign-objective payload must be an object."
    );
  }
  const base = parseCampaignObjectivePayloadBase(input, "sim.create-campaign-objective");
  if (!base.ok) {
    return base;
  }
  const owner = parseM4CampaignOwner(input["owner"], "payload.owner");
  if (!owner.ok) {
    return owner;
  }

  return {
    ok: true,
    value: {
      ...base.value,
      owner: owner.value
    }
  };
}

function parseUpdateCampaignObjectivePayload(
  input: unknown
): ProtocolParseResult<UpdateCampaignObjectiveCommandV1["payload"]> {
  return parseCampaignObjectivePayloadBase(input, "sim.update-campaign-objective");
}

function parseCampaignObjectivePayloadBase(
  input: unknown,
  commandKind: string
): ProtocolParseResult<UpdateCampaignObjectiveCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "payload", `${commandKind} payload must be an object.`);
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const target = parseM4CampaignTarget(input["target"], "payload.target");
  if (!target.ok) {
    return target;
  }
  const objectiveKind = parseM4CampaignObjectiveKind(
    input["objectiveKind"],
    "payload.objectiveKind"
  );
  if (!objectiveKind.ok) {
    return objectiveKind;
  }
  const startWindow = parseM4CampaignStartWindow(input["startWindow"], "payload.startWindow");
  if (!startWindow.ok) {
    return startWindow;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      campaignPlanId: campaignPlanId.value,
      target: target.value,
      objectiveKind: objectiveKind.value,
      startWindow: startWindow.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseCancelCampaignObjectivePayload(
  input: unknown
): ProtocolParseResult<CancelCampaignObjectiveCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.cancel-campaign-objective payload must be an object."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const reasonCode = parseNonEmptyProtocolString(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }

  return {
    ok: true,
    value: {
      campaignPlanId: campaignPlanId.value,
      reasonCode: reasonCode.value
    }
  };
}

function parseCreateMusterCommitmentPayload(
  input: unknown
): ProtocolParseResult<CreateMusterCommitmentCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.create-muster-commitment payload must be an object."
    );
  }
  const commitmentId = parsePositiveSafeInteger(input["commitmentId"], "payload.commitmentId");
  if (!commitmentId.ok) {
    return commitmentId;
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const source = parseM4MusterCommitmentSource(input["source"], "payload.source");
  if (!source.ok) {
    return source;
  }
  const promisedTroops = parsePositiveSafeInteger(
    input["promisedTroops"],
    "payload.promisedTroops"
  );
  if (!promisedTroops.ok) {
    return promisedTroops;
  }
  const dueDay = parseNonnegativeSafeInteger(input["dueDay"], "payload.dueDay");
  if (!dueDay.ok) {
    return dueDay;
  }
  const assemblyWindow = parseM4MusterAssemblyWindow(
    input["assemblyWindow"],
    "payload.assemblyWindow"
  );
  if (!assemblyWindow.ok) {
    return assemblyWindow;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      commitmentId: commitmentId.value,
      campaignPlanId: campaignPlanId.value,
      source: source.value,
      promisedTroops: promisedTroops.value,
      dueDay: dueDay.value,
      assemblyWindow: assemblyWindow.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseRecordMusterResponsePayload(
  input: unknown
): ProtocolParseResult<RecordMusterResponseCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.record-muster-response payload must be an object."
    );
  }
  const commitmentId = parsePositiveSafeInteger(input["commitmentId"], "payload.commitmentId");
  if (!commitmentId.ok) {
    return commitmentId;
  }
  const assembledTroops = parseNonnegativeSafeInteger(
    input["assembledTroops"],
    "payload.assembledTroops"
  );
  if (!assembledTroops.ok) {
    return assembledTroops;
  }
  const delayedTroops = parseNonnegativeSafeInteger(
    input["delayedTroops"],
    "payload.delayedTroops"
  );
  if (!delayedTroops.ok) {
    return delayedTroops;
  }
  const refusedTroops = parseNonnegativeSafeInteger(
    input["refusedTroops"],
    "payload.refusedTroops"
  );
  if (!refusedTroops.ok) {
    return refusedTroops;
  }
  const releasedTroops = parseNonnegativeSafeInteger(
    input["releasedTroops"],
    "payload.releasedTroops"
  );
  if (!releasedTroops.ok) {
    return releasedTroops;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      commitmentId: commitmentId.value,
      assembledTroops: assembledTroops.value,
      delayedTroops: delayedTroops.value,
      refusedTroops: refusedTroops.value,
      releasedTroops: releasedTroops.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseReserveCampaignGrainSupplyPayload(
  input: unknown
): ProtocolParseResult<ReserveCampaignGrainSupplyCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.reserve-campaign-grain-supply payload must be an object."
    );
  }
  const reservationId = parsePositiveSafeInteger(input["reservationId"], "payload.reservationId");
  if (!reservationId.ok) {
    return reservationId;
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const requestedAmount = parsePositiveSafeInteger(
    input["requestedAmount"],
    "payload.requestedAmount"
  );
  if (!requestedAmount.ok) {
    return requestedAmount;
  }
  const expectedDailyConsumption = parsePositiveSafeInteger(
    input["expectedDailyConsumption"],
    "payload.expectedDailyConsumption"
  );
  if (!expectedDailyConsumption.ok) {
    return expectedDailyConsumption;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      reservationId: reservationId.value,
      campaignPlanId: campaignPlanId.value,
      requestedAmount: requestedAmount.value,
      expectedDailyConsumption: expectedDailyConsumption.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseConsumeCampaignGrainSupplyPayload(
  input: unknown
): ProtocolParseResult<ConsumeCampaignGrainSupplyCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.consume-campaign-grain-supply payload must be an object."
    );
  }
  const reservationId = parsePositiveSafeInteger(input["reservationId"], "payload.reservationId");
  if (!reservationId.ok) {
    return reservationId;
  }
  const consumedAmount = parseNonnegativeSafeInteger(
    input["consumedAmount"],
    "payload.consumedAmount"
  );
  if (!consumedAmount.ok) {
    return consumedAmount;
  }
  const lossAmount = parseNonnegativeSafeInteger(input["lossAmount"], "payload.lossAmount");
  if (!lossAmount.ok) {
    return lossAmount;
  }
  const lossReasonCode =
    input["lossReasonCode"] === null
      ? { ok: true as const, value: null }
      : parseReasonCode(input["lossReasonCode"], "payload.lossReasonCode");
  if (!lossReasonCode.ok) {
    return lossReasonCode;
  }
  if (lossAmount.value > 0 && lossReasonCode.value === null) {
    return protocolError(
      "invalid-payload",
      "payload.lossReasonCode",
      "payload.lossReasonCode is required when lossAmount is positive."
    );
  }
  if (lossAmount.value === 0 && lossReasonCode.value !== null) {
    return protocolError(
      "invalid-payload",
      "payload.lossReasonCode",
      "payload.lossReasonCode must be null when lossAmount is zero."
    );
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }
  if (consumedAmount.value === 0 && lossAmount.value === 0) {
    return protocolError(
      "invalid-payload",
      "payload.consumedAmount",
      "grain supply consumption must consume or lose a positive amount."
    );
  }

  return {
    ok: true,
    value: {
      reservationId: reservationId.value,
      consumedAmount: consumedAmount.value,
      lossAmount: lossAmount.value,
      lossReasonCode: lossReasonCode.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseReleaseCampaignGrainSupplyPayload(
  input: unknown
): ProtocolParseResult<ReleaseCampaignGrainSupplyCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.release-campaign-grain-supply payload must be an object."
    );
  }
  const reservationId = parsePositiveSafeInteger(input["reservationId"], "payload.reservationId");
  if (!reservationId.ok) {
    return reservationId;
  }
  const reasonCode = parseReasonCode(input["reasonCode"], "payload.reasonCode");
  if (!reasonCode.ok) {
    return reasonCode;
  }
  return { ok: true, value: { reservationId: reservationId.value, reasonCode: reasonCode.value } };
}

function parseM4MusterCommitmentSource(
  input: unknown,
  path: string
): ProtocolParseResult<M4MusterCommitmentSourceV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", path, `${path} must be an object.`);
  }
  if (input["kind"] !== "m3-obligation") {
    return protocolError("invalid-payload", `${path}.kind`, `${path}.kind must be m3-obligation.`);
  }
  const obligationId = parsePositiveSafeInteger(input["obligationId"], `${path}.obligationId`);
  if (!obligationId.ok) {
    return obligationId;
  }
  return { ok: true, value: { kind: "m3-obligation", obligationId: obligationId.value } };
}

function parseM4MusterAssemblyWindow(
  input: unknown,
  path: string
): ProtocolParseResult<M4MusterAssemblyWindowV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", path, `${path} must be an object.`);
  }
  const earliestDay = parseNonnegativeSafeInteger(input["earliestDay"], `${path}.earliestDay`);
  if (!earliestDay.ok) {
    return earliestDay;
  }
  const latestDay = parseNonnegativeSafeInteger(input["latestDay"], `${path}.latestDay`);
  if (!latestDay.ok) {
    return latestDay;
  }
  return {
    ok: true,
    value: {
      earliestDay: earliestDay.value,
      latestDay: latestDay.value
    }
  };
}

function parseM4CampaignOwner(
  input: unknown,
  path: string
): ProtocolParseResult<M4CampaignOwnerV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", path, `${path} must be an object.`);
  }
  if (input["kind"] === "commander") {
    const characterId = parsePositiveSafeInteger(input["characterId"], `${path}.characterId`);
    if (!characterId.ok) {
      return characterId;
    }
    return { ok: true, value: { kind: "commander", characterId: characterId.value } };
  }
  if (input["kind"] === "polity") {
    const polityId = parsePositiveSafeInteger(input["polityId"], `${path}.polityId`);
    if (!polityId.ok) {
      return polityId;
    }
    return { ok: true, value: { kind: "polity", polityId: polityId.value } };
  }
  return protocolError(
    "invalid-payload",
    `${path}.kind`,
    `${path}.kind must be commander or polity.`
  );
}

function parseM4CampaignTarget(
  input: unknown,
  path: string
): ProtocolParseResult<M4CampaignTargetV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", path, `${path} must be an object.`);
  }
  if (input["kind"] === "district") {
    const districtId = parsePositiveSafeInteger(input["districtId"], `${path}.districtId`);
    if (!districtId.ok) {
      return districtId;
    }
    return { ok: true, value: { kind: "district", districtId: districtId.value } };
  }
  if (input["kind"] === "polity") {
    const polityId = parsePositiveSafeInteger(input["polityId"], `${path}.polityId`);
    if (!polityId.ok) {
      return polityId;
    }
    return { ok: true, value: { kind: "polity", polityId: polityId.value } };
  }
  return protocolError(
    "invalid-payload",
    `${path}.kind`,
    `${path}.kind must be district or polity.`
  );
}

function parseM4CampaignObjectiveKind(
  value: unknown,
  path: string
): ProtocolParseResult<M4CampaignObjectiveKindV1> {
  if (
    value === "prepare" ||
    value === "march" ||
    value === "besiege" ||
    value === "relieve" ||
    value === "withdraw" ||
    value === "postwar-result-candidate"
  ) {
    return { ok: true, value };
  }

  return protocolError(
    "invalid-payload",
    path,
    `${path} must be prepare, march, besiege, relieve, withdraw, or postwar-result-candidate.`
  );
}

function parseM4CampaignStartWindow(
  input: unknown,
  path: string
): ProtocolParseResult<M4CampaignStartWindowV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", path, `${path} must be an object.`);
  }
  const earliestDay = parseNonnegativeSafeInteger(input["earliestDay"], `${path}.earliestDay`);
  if (!earliestDay.ok) {
    return earliestDay;
  }
  const latestDay = parseNonnegativeSafeInteger(input["latestDay"], `${path}.latestDay`);
  if (!latestDay.ok) {
    return latestDay;
  }
  return {
    ok: true,
    value: {
      earliestDay: earliestDay.value,
      latestDay: latestDay.value
    }
  };
}

function parseReasonCodes(input: unknown, path: string): ProtocolParseResult<readonly string[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return protocolError("invalid-payload", path, `${path} must be a non-empty array.`);
  }
  const reasonCodes: string[] = [];
  for (let index = 0; index < input.length; index += 1) {
    const reasonCode = parseNonEmptyProtocolString(input[index], `${path}[${index}]`);
    if (!reasonCode.ok) {
      return reasonCode;
    }
    reasonCodes.push(reasonCode.value);
  }
  return { ok: true, value: reasonCodes };
}

function parseReasonCode(input: unknown, path: string): ProtocolParseResult<string> {
  return parseNonEmptyProtocolString(input, path);
}

function parseM4CampaignAiCandidateTraceArray(
  input: unknown
): ProtocolParseResult<readonly M4CampaignAiCandidateTraceV1[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return protocolError("invalid-payload", "candidates", "candidates must be a non-empty array.");
  }
  if (input.length > 16) {
    return protocolError(
      "invalid-payload",
      "candidates",
      "candidates must contain at most 16 entries."
    );
  }
  const candidates: M4CampaignAiCandidateTraceV1[] = [];
  for (let index = 0; index < input.length; index += 1) {
    const parsed = parseM4CampaignAiCandidateTrace(input[index], `candidates[${index}]`);
    if (!parsed.ok) {
      return parsed;
    }
    candidates.push(parsed.value);
  }
  return { ok: true, value: candidates };
}

function parseM4CampaignAiCandidateTrace(
  input: unknown,
  path: string
): ProtocolParseResult<M4CampaignAiCandidateTraceV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", path, `${path} must be an object.`);
  }
  const candidateId = parseNonEmptyProtocolString(input["candidateId"], `${path}.candidateId`);
  if (!candidateId.ok) {
    return candidateId;
  }
  const decisionKind = parseM4CampaignAiDecisionKind(input["decisionKind"], `${path}.decisionKind`);
  if (!decisionKind.ok) {
    return decisionKind;
  }
  const campaignPlanId = parseNullablePositiveSafeInteger(
    input["campaignPlanId"],
    `${path}.campaignPlanId`
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const commandKind = parseNullableGameCommandKind(input["commandKind"], `${path}.commandKind`);
  if (!commandKind.ok) {
    return commandKind;
  }
  const score = parseNonnegativeSafeInteger(input["score"], `${path}.score`);
  if (!score.ok) {
    return score;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], `${path}.reasonCodes`);
  if (!reasonCodes.ok) {
    return reasonCodes;
  }
  return {
    ok: true,
    value: {
      candidateId: candidateId.value,
      decisionKind: decisionKind.value,
      campaignPlanId: campaignPlanId.value,
      commandKind: commandKind.value,
      score: score.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseM4CampaignAiDecisionKind(
  input: unknown,
  path: string
): ProtocolParseResult<M4CampaignAiDecisionKindV1> {
  if (
    input === "no-action" ||
    input === "wait" ||
    input === "create-objective" ||
    input === "change-objective" ||
    input === "cancel" ||
    input === "start-march" ||
    input === "reinforce" ||
    input === "continue" ||
    input === "withdraw"
  ) {
    return { ok: true, value: input };
  }
  return protocolError(
    "invalid-payload",
    path,
    `${path} must be no-action, wait, create-objective, change-objective, cancel, start-march, reinforce, continue, or withdraw.`
  );
}

function parseNullableGameCommandKind(
  input: unknown,
  path: string
): ProtocolParseResult<GameCommandV1["kind"] | null> {
  if (input === null) {
    return { ok: true, value: null };
  }
  if (GAME_COMMAND_KINDS.includes(input as GameCommandV1["kind"])) {
    return { ok: true, value: input as GameCommandV1["kind"] };
  }
  return protocolError(
    "invalid-payload",
    path,
    `${path} must be a supported GameCommand kind or null.`
  );
}

function parseNullableCommandId(input: unknown, path: string): ProtocolParseResult<string | null> {
  if (input === null) {
    return { ok: true, value: null };
  }
  if (typeof input === "string" && COMMAND_ID_PATTERN.test(input)) {
    return { ok: true, value: input };
  }
  return protocolError("invalid-payload", path, `${path} must be a command id or null.`);
}

function parseNullableProtocolString(
  input: unknown,
  path: string
): ProtocolParseResult<string | null> {
  if (input === null) {
    return { ok: true, value: null };
  }
  return parseNonEmptyProtocolString(input, path);
}

function parseM3ObligationCategory(
  value: unknown,
  path: string
): ProtocolParseResult<M3ObligationCategoryV1> {
  if (
    value === "regular-tribute" ||
    value === "extraordinary-levy" ||
    value === "troop-obligation" ||
    value === "defensive-garrison" ||
    value === "specific-war-aid"
  ) {
    return { ok: true, value };
  }

  return protocolError(
    "invalid-payload",
    path,
    "obligationCategory must be regular-tribute, extraordinary-levy, troop-obligation, defensive-garrison, or specific-war-aid."
  );
}

function parseM3PostwarGovernanceMethod(
  value: unknown,
  path: string
): ProtocolParseResult<M3PostwarGovernanceMethodV1> {
  if (value === "direct-control" || value === "restore-vassal-ruler" || value === "tribute-only") {
    return { ok: true, value };
  }

  return protocolError(
    "invalid-payload",
    path,
    `${path} must be direct-control, restore-vassal-ruler, or tribute-only.`
  );
}

function parseM3ObligationSettlementAction(
  value: unknown,
  path: string
): ProtocolParseResult<M3ObligationSettlementActionV1> {
  if (
    value === "fulfillment" ||
    value === "partial-fulfillment" ||
    value === "deferral" ||
    value === "refusal" ||
    value === "remission" ||
    value === "pursuit-recovery" ||
    value === "default-breach"
  ) {
    return { ok: true, value };
  }

  return protocolError(
    "invalid-payload",
    path,
    "actionKind must be fulfillment, partial-fulfillment, deferral, refusal, remission, pursuit-recovery, or default-breach."
  );
}

function parseM3ObligationSource(
  input: unknown
): ProtocolParseResult<CreateObligationCommandV1["payload"]["obligationSource"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload.obligationSource",
      "obligationSource must be an object."
    );
  }
  if (input["kind"] !== "vassalage") {
    return protocolError(
      "invalid-payload",
      "payload.obligationSource.kind",
      "obligationSource.kind must be vassalage."
    );
  }
  const sourceId = parseNonEmptyProtocolString(
    input["sourceId"],
    "payload.obligationSource.sourceId"
  );
  if (!sourceId.ok) {
    return sourceId;
  }

  return { ok: true, value: { kind: "vassalage", sourceId: sourceId.value } };
}

function parseObligationRequirement(
  input: unknown
): ProtocolParseResult<CreateObligationCommandV1["payload"]["requirement"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload.requirement",
      "requirement must be an object."
    );
  }
  if (input["kind"] === "amount") {
    const resourceKind = input["resourceKind"];
    if (resourceKind !== "cash" && resourceKind !== "grain" && resourceKind !== "troops") {
      return protocolError(
        "invalid-payload",
        "payload.requirement.resourceKind",
        "resourceKind must be cash, grain, or troops."
      );
    }
    const amount = parsePositiveSafeInteger(input["amount"], "payload.requirement.amount");
    if (!amount.ok) {
      return amount;
    }
    return { ok: true, value: { kind: "amount", resourceKind, amount: amount.value } };
  }
  if (input["kind"] === "condition") {
    const conditionKey = parseNonEmptyProtocolString(
      input["conditionKey"],
      "payload.requirement.conditionKey"
    );
    if (!conditionKey.ok) {
      return conditionKey;
    }
    return { ok: true, value: { kind: "condition", conditionKey: conditionKey.value } };
  }
  return protocolError(
    "invalid-payload",
    "payload.requirement.kind",
    "requirement kind must be amount or condition."
  );
}

function parseObligationDue(
  input: unknown
): ProtocolParseResult<CreateObligationCommandV1["payload"]["due"]> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "payload.due", "due must be an object.");
  }
  if (input["kind"] === "cadence") {
    const periodDays = parsePositiveSafeInteger(input["periodDays"], "payload.due.periodDays");
    if (!periodDays.ok) {
      return periodDays;
    }
    const nextDueDay = parseNonnegativeSafeInteger(input["nextDueDay"], "payload.due.nextDueDay");
    if (!nextDueDay.ok) {
      return nextDueDay;
    }
    return {
      ok: true,
      value: { kind: "cadence", periodDays: periodDays.value, nextDueDay: nextDueDay.value }
    };
  }
  if (input["kind"] === "trigger") {
    const triggerKey = parseNonEmptyProtocolString(input["triggerKey"], "payload.due.triggerKey");
    if (!triggerKey.ok) {
      return triggerKey;
    }
    return { ok: true, value: { kind: "trigger", triggerKey: triggerKey.value } };
  }
  return protocolError(
    "invalid-payload",
    "payload.due.kind",
    "due kind must be cadence or trigger."
  );
}

function parsePreviewM2TransportRoutePayload(
  input: unknown
): ProtocolParseResult<PreviewM2TransportRouteQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.preview-m2-transport-route payload must be an object."
    );
  }

  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  const originDistrictId = parsePositiveSafeInteger(
    input["originDistrictId"],
    "payload.originDistrictId"
  );
  if (!originDistrictId.ok) {
    return originDistrictId;
  }

  const destinationDistrictId = parsePositiveSafeInteger(
    input["destinationDistrictId"],
    "payload.destinationDistrictId"
  );
  if (!destinationDistrictId.ok) {
    return destinationDistrictId;
  }

  const stockAmount = parsePositiveSafeInteger(input["stockAmount"], "payload.stockAmount");
  if (!stockAmount.ok) {
    return stockAmount;
  }

  return {
    ok: true,
    value: {
      queryId,
      originDistrictId: originDistrictId.value,
      destinationDistrictId: destinationDistrictId.value,
      stockAmount: stockAmount.value
    }
  };
}

function parsePreviewM3PostwarGovernancePayload(
  input: unknown
): ProtocolParseResult<PreviewM3PostwarGovernanceQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.preview-m3-postwar-governance payload must be an object."
    );
  }

  const base = parseM3PostwarGovernanceQueryBase(input, "sim.preview-m3-postwar-governance");
  if (!base.ok) {
    return base;
  }

  const methods = input["methods"];
  if (!Array.isArray(methods) || methods.length === 0) {
    return protocolError(
      "invalid-payload",
      "payload.methods",
      "payload.methods must be a non-empty array."
    );
  }

  const parsedMethods: M3PostwarGovernanceMethodV1[] = [];
  for (let index = 0; index < methods.length; index += 1) {
    const method = parseM3PostwarGovernanceMethod(methods[index], `payload.methods[${index}]`);
    if (!method.ok) {
      return method;
    }
    parsedMethods.push(method.value);
  }

  return {
    ok: true,
    value: {
      ...base.value,
      methods: parsedMethods
    }
  };
}

function parseCompareM3PostwarGovernanceOutcomesPayload(
  input: unknown
): ProtocolParseResult<CompareM3PostwarGovernanceOutcomesQueryV1["payload"]> {
  return parseM3PostwarGovernanceQueryBase(input, "sim.compare-m3-postwar-governance-outcomes");
}

function parseListM4FactionKnowledgePayload(
  input: unknown
): ProtocolParseResult<ListM4FactionKnowledgeQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.list-m4-faction-knowledge payload must be an object."
    );
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const observerPolityId = parsePositiveSafeInteger(
    input["observerPolityId"],
    "payload.observerPolityId"
  );
  if (!observerPolityId.ok) {
    return observerPolityId;
  }

  return {
    ok: true,
    value: {
      queryId,
      observerPolityId: observerPolityId.value
    }
  };
}

function parseListM4MusterCommitmentsPayload(
  input: unknown
): ProtocolParseResult<ListM4MusterCommitmentsQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.list-m4-muster-commitments payload must be an object."
    );
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }

  return {
    ok: true,
    value: {
      queryId,
      campaignPlanId: campaignPlanId.value
    }
  };
}

function parsePreviewM4GrainSupplyPayload(
  input: unknown
): ProtocolParseResult<PreviewM4GrainSupplyQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.preview-m4-grain-supply payload must be an object."
    );
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const plannedMarchDays = parsePositiveSafeInteger(
    input["plannedMarchDays"],
    "payload.plannedMarchDays"
  );
  if (!plannedMarchDays.ok) {
    return plannedMarchDays;
  }
  const grainPerTroopPerDay = parsePositiveSafeInteger(
    input["grainPerTroopPerDay"],
    "payload.grainPerTroopPerDay"
  );
  if (!grainPerTroopPerDay.ok) {
    return grainPerTroopPerDay;
  }

  return {
    ok: true,
    value: {
      queryId,
      campaignPlanId: campaignPlanId.value,
      plannedMarchDays: plannedMarchDays.value,
      grainPerTroopPerDay: grainPerTroopPerDay.value
    }
  };
}

function parsePreviewM4RouteTransportCapacityPayload(
  input: unknown
): ProtocolParseResult<PreviewM4RouteTransportCapacityQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.preview-m4-route-transport-capacity payload must be an object."
    );
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }

  return {
    ok: true,
    value: {
      queryId,
      campaignPlanId: campaignPlanId.value
    }
  };
}

function parseListM4MarchStatePayload(
  input: unknown
): ProtocolParseResult<ListM4MarchStateQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.list-m4-march-state payload must be an object."
    );
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }

  return {
    ok: true,
    value: {
      queryId,
      campaignPlanId: campaignPlanId.value
    }
  };
}

function parseListM4SiegeStatePayload(
  input: unknown
): ProtocolParseResult<ListM4SiegeStateQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.list-m4-siege-state payload must be an object."
    );
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }

  return {
    ok: true,
    value: {
      queryId,
      campaignPlanId: campaignPlanId.value
    }
  };
}

function parseListM4WithdrawalStatePayload(
  input: unknown
): ProtocolParseResult<ListM4WithdrawalStateQueryV1["payload"]> {
  return parseM4CampaignScopedQueryPayload(input, "sim.list-m4-withdrawal-state");
}

function parseListM4WarOutcomesPayload(
  input: unknown
): ProtocolParseResult<ListM4WarOutcomesQueryV1["payload"]> {
  return parseM4CampaignScopedQueryPayload(input, "sim.list-m4-war-outcomes");
}

function parseM4CampaignScopedQueryPayload(
  input: unknown,
  kind: string
): ProtocolParseResult<{ readonly queryId: string; readonly campaignPlanId: number }> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "payload", `${kind} payload must be an object.`);
  }
  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  return { ok: true, value: { queryId, campaignPlanId: campaignPlanId.value } };
}

function parseStartCampaignMarchPayload(
  input: unknown
): ProtocolParseResult<StartCampaignMarchCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.start-campaign-march payload must be an object."
    );
  }
  const marchId = parsePositiveSafeInteger(input["marchId"], "payload.marchId");
  if (!marchId.ok) {
    return marchId;
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const originDistrictId = parsePositiveSafeInteger(
    input["originDistrictId"],
    "payload.originDistrictId"
  );
  if (!originDistrictId.ok) {
    return originDistrictId;
  }
  const plannedDepartureDay = parseNonnegativeSafeInteger(
    input["plannedDepartureDay"],
    "payload.plannedDepartureDay"
  );
  if (!plannedDepartureDay.ok) {
    return plannedDepartureDay;
  }
  const grainPerTroopPerDay = parsePositiveSafeInteger(
    input["grainPerTroopPerDay"],
    "payload.grainPerTroopPerDay"
  );
  if (!grainPerTroopPerDay.ok) {
    return grainPerTroopPerDay;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      marchId: marchId.value,
      campaignPlanId: campaignPlanId.value,
      originDistrictId: originDistrictId.value,
      plannedDepartureDay: plannedDepartureDay.value,
      grainPerTroopPerDay: grainPerTroopPerDay.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseResolveM4FieldEngagementPayload(
  input: unknown
): ProtocolParseResult<ResolveM4FieldEngagementCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.resolve-m4-field-engagement payload must be an object."
    );
  }
  const engagementId = parsePositiveSafeInteger(input["engagementId"], "payload.engagementId");
  if (!engagementId.ok) {
    return engagementId;
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const marchId = parsePositiveSafeInteger(input["marchId"], "payload.marchId");
  if (!marchId.ok) {
    return marchId;
  }
  const defenderPolityId = parsePositiveSafeInteger(
    input["defenderPolityId"],
    "payload.defenderPolityId"
  );
  if (!defenderPolityId.ok) {
    return defenderPolityId;
  }
  const defenderEstimatedTroops = parseNonnegativeSafeInteger(
    input["defenderEstimatedTroops"],
    "payload.defenderEstimatedTroops"
  );
  if (!defenderEstimatedTroops.ok) {
    return defenderEstimatedTroops;
  }
  const defenderFortification = parseNonnegativeSafeInteger(
    input["defenderFortification"],
    "payload.defenderFortification"
  );
  if (!defenderFortification.ok) {
    return defenderFortification;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      engagementId: engagementId.value,
      campaignPlanId: campaignPlanId.value,
      marchId: marchId.value,
      defenderPolityId: defenderPolityId.value,
      defenderEstimatedTroops: defenderEstimatedTroops.value,
      defenderFortification: defenderFortification.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseApplyM4SiegeChoicePayload(
  input: unknown
): ProtocolParseResult<ApplyM4SiegeChoiceCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.apply-m4-siege-choice payload must be an object."
    );
  }
  const siegeId = parsePositiveSafeInteger(input["siegeId"], "payload.siegeId");
  if (!siegeId.ok) {
    return siegeId;
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const marchId = parsePositiveSafeInteger(input["marchId"], "payload.marchId");
  if (!marchId.ok) {
    return marchId;
  }
  const choice = parseM4SiegeChoice(input["choice"], "payload.choice");
  if (!choice.ok) {
    return choice;
  }
  const defenderPolityId = parsePositiveSafeInteger(
    input["defenderPolityId"],
    "payload.defenderPolityId"
  );
  if (!defenderPolityId.ok) {
    return defenderPolityId;
  }
  const fortification = parseNonnegativeSafeInteger(
    input["fortification"],
    "payload.fortification"
  );
  if (!fortification.ok) {
    return fortification;
  }
  const defenderEstimatedTroops = parseNonnegativeSafeInteger(
    input["defenderEstimatedTroops"],
    "payload.defenderEstimatedTroops"
  );
  if (!defenderEstimatedTroops.ok) {
    return defenderEstimatedTroops;
  }
  const defenderSupply = parseNonnegativeSafeInteger(
    input["defenderSupply"],
    "payload.defenderSupply"
  );
  if (!defenderSupply.ok) {
    return defenderSupply;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }

  return {
    ok: true,
    value: {
      siegeId: siegeId.value,
      campaignPlanId: campaignPlanId.value,
      marchId: marchId.value,
      choice: choice.value,
      defenderPolityId: defenderPolityId.value,
      fortification: fortification.value,
      defenderEstimatedTroops: defenderEstimatedTroops.value,
      defenderSupply: defenderSupply.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseResolveM4CampaignWithdrawalPayload(
  input: unknown
): ProtocolParseResult<ResolveM4CampaignWithdrawalCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.resolve-m4-campaign-withdrawal payload must be an object."
    );
  }
  const withdrawalId = parsePositiveSafeInteger(input["withdrawalId"], "payload.withdrawalId");
  if (!withdrawalId.ok) {
    return withdrawalId;
  }
  const campaignPlanId = parsePositiveSafeInteger(
    input["campaignPlanId"],
    "payload.campaignPlanId"
  );
  if (!campaignPlanId.ok) {
    return campaignPlanId;
  }
  const marchId = parseNullablePositiveSafeInteger(input["marchId"], "payload.marchId");
  if (!marchId.ok) {
    return marchId;
  }
  const siegeId = parseNullablePositiveSafeInteger(input["siegeId"], "payload.siegeId");
  if (!siegeId.ok) {
    return siegeId;
  }
  const triggerReason = parseM4WithdrawalTrigger(input["triggerReason"], "payload.triggerReason");
  if (!triggerReason.ok) {
    return triggerReason;
  }
  const reasonCodes = parseReasonCodes(input["reasonCodes"], "payload.reasonCodes");
  if (!reasonCodes.ok) {
    return reasonCodes;
  }
  return {
    ok: true,
    value: {
      withdrawalId: withdrawalId.value,
      campaignPlanId: campaignPlanId.value,
      marchId: marchId.value,
      siegeId: siegeId.value,
      triggerReason: triggerReason.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseM4WithdrawalTrigger(
  value: unknown,
  path: string
): ProtocolParseResult<M4WithdrawalTriggerV1> {
  if (
    value === "ordered" ||
    value === "supply" ||
    value === "season" ||
    value === "siege" ||
    value === "loss" ||
    value === "objective-complete"
  ) {
    return { ok: true, value };
  }
  return protocolError(
    "invalid-payload",
    path,
    `${path} must be ordered, supply, season, siege, loss, or objective-complete.`
  );
}

function parseM4SiegeChoice(value: unknown, path: string): ProtocolParseResult<M4SiegeChoiceV1> {
  if (
    value === "invest-blockade" ||
    value === "assault" ||
    value === "continue" ||
    value === "accept-surrender" ||
    value === "lift-siege" ||
    value === "withdraw"
  ) {
    return { ok: true, value };
  }

  return protocolError(
    "invalid-payload",
    path,
    `${path} must be invest-blockade, assault, continue, accept-surrender, lift-siege, or withdraw.`
  );
}

function parseM3PostwarGovernanceQueryBase(
  input: unknown,
  commandKind: string
): ProtocolParseResult<CompareM3PostwarGovernanceOutcomesQueryV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "payload", `${commandKind} payload must be an object.`);
  }

  const queryId = input["queryId"];
  if (typeof queryId !== "string" || !COMMAND_ID_PATTERN.test(queryId)) {
    return protocolError(
      "invalid-payload",
      "payload.queryId",
      "queryId must match [A-Za-z0-9._:-]{1,96}."
    );
  }
  const victorPolityId = parsePositiveSafeInteger(
    input["victorPolityId"],
    "payload.victorPolityId"
  );
  if (!victorPolityId.ok) {
    return victorPolityId;
  }
  const localPolityId = parsePositiveSafeInteger(input["localPolityId"], "payload.localPolityId");
  if (!localPolityId.ok) {
    return localPolityId;
  }
  const districtId = parsePositiveSafeInteger(input["districtId"], "payload.districtId");
  if (!districtId.ok) {
    return districtId;
  }
  const months = parsePositiveSafeInteger(input["months"], "payload.months");
  if (!months.ok) {
    return months;
  }
  if (months.value > 240) {
    return protocolError("invalid-payload", "payload.months", "payload.months must be <= 240.");
  }

  return {
    ok: true,
    value: {
      queryId,
      victorPolityId: victorPolityId.value,
      localPolityId: localPolityId.value,
      districtId: districtId.value,
      months: months.value
    }
  };
}

function parsePositiveSafeInteger(value: unknown, path: string): ProtocolParseResult<number> {
  if (isPositiveSafeInteger(value)) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be a positive safe integer.`);
}

function parseNullablePositiveSafeInteger(
  value: unknown,
  path: string
): ProtocolParseResult<number | null> {
  if (value === null) {
    return { ok: true, value };
  }
  return parsePositiveSafeInteger(value, path);
}

function parseNonnegativeSafeInteger(value: unknown, path: string): ProtocolParseResult<number> {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be a nonnegative safe integer.`);
}

function parseBps(value: unknown, path: string): ProtocolParseResult<number> {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 10_000) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be an integer from 0 to 10000.`);
}

function parseSignedBps(value: unknown, path: string): ProtocolParseResult<number> {
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= -10_000 &&
    value <= 10_000
  ) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be an integer from -10000 to 10000.`);
}

function parseM3PolicyStance(value: unknown, path: string): ProtocolParseResult<M3PolicyStanceV1> {
  if (
    value === "balanced" ||
    value === "conciliatory" ||
    value === "extractive" ||
    value === "military"
  ) {
    return { ok: true, value };
  }

  return protocolError(
    "invalid-payload",
    path,
    `${path} must be balanced, conciliatory, extractive, or military.`
  );
}

function parseNonEmptyProtocolString(value: unknown, path: string): ProtocolParseResult<string> {
  if (typeof value === "string" && value.length > 0) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be a non-empty string.`);
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function protocolError<TValue>(
  code: ProtocolErrorCodeV1,
  path: string,
  message: string
): ProtocolParseResult<TValue> {
  return {
    ok: false,
    error: {
      code,
      path,
      message
    }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

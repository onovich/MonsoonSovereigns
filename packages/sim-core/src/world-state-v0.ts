export type Brand<TValue, TBrand extends string> = TValue & { readonly __brand: TBrand };

export type PersonId = Brand<number, "PersonId">;
export type PolityId = Brand<number, "PolityId">;
export type DistrictId = Brand<number, "DistrictId">;
export type SettlementId = Brand<number, "SettlementId">;
export type RouteId = Brand<number, "RouteId">;
export type RegionalSeasonalCurveId = Brand<number, "RegionalSeasonalCurveId">;
export type PopulationGroupId = Brand<number, "PopulationGroupId">;
export type M3ObligationId = Brand<number, "M3ObligationId">;
export type M3ObligationAuditEventId = Brand<number, "M3ObligationAuditEventId">;
export type M3FulfillmentId = Brand<number, "M3FulfillmentId">;
export type M3OfficeId = Brand<number, "M3OfficeId">;
export type M3PolicyId = Brand<number, "M3PolicyId">;
export type M3AppointmentAuditEventId = Brand<number, "M3AppointmentAuditEventId">;
export type M3SuccessionId = Brand<number, "M3SuccessionId">;
export type CampaignPlanId = Brand<number, "CampaignPlanId">;
export type CampaignMarchId = Brand<number, "CampaignMarchId">;
export type FactionKnowledgeSnapshotId = Brand<number, "FactionKnowledgeSnapshotId">;
export type MobilizedForceCommitmentId = Brand<number, "MobilizedForceCommitmentId">;
export type GrainSupplyReservationId = Brand<number, "GrainSupplyReservationId">;
export type GameDay = Brand<number, "GameDay">;
export type WorldRevision = Brand<number, "WorldRevision">;
export type SimulationSeed = Brand<number, "SimulationSeed">;
export type ContentManifestHash = Brand<string, "ContentManifestHash">;

export const WORLD_STATE_V0_SCHEMA_VERSION = 0;
export const GAME_DAY_SCHEDULER_VERSION = 1;
export const DETERMINISTIC_SYSTEM_ORDER_VERSION = 1;

export interface PolityDefinition {
  readonly id: PolityId;
  readonly displayNameKey: string;
}

export interface PersonDefinition {
  readonly id: PersonId;
  readonly displayNameKey: string;
}

export interface DistrictDefinition {
  readonly id: DistrictId;
  readonly displayNameKey: string;
}

export interface SettlementDefinition {
  readonly id: SettlementId;
  readonly displayNameKey: string;
  readonly districtId: DistrictId;
}

export interface RouteDefinition {
  readonly id: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly lengthInMapUnits: number;
}

export interface WorldDefinitionsV0 {
  readonly polities: readonly PolityDefinition[];
  readonly persons: readonly PersonDefinition[];
  readonly districts: readonly DistrictDefinition[];
  readonly settlements: readonly SettlementDefinition[];
  readonly routes: readonly RouteDefinition[];
}

export interface PolityState {
  readonly definitionId: PolityId;
}

export interface PersonState {
  readonly definitionId: PersonId;
  readonly currentDistrictId: DistrictId | undefined;
}

export type DistrictControlState =
  | { readonly kind: "controlled"; readonly controllerPolityId: PolityId }
  | { readonly kind: "uncontrolled" };

export interface DistrictState {
  readonly definitionId: DistrictId;
  readonly control: DistrictControlState;
}

export interface SettlementState {
  readonly definitionId: SettlementId;
  readonly currentDistrictId: DistrictId;
}

export interface RouteState {
  readonly definitionId: RouteId;
}

export type M2AgriculturePhaseV0 = "fallow" | "planting" | "growing" | "harvest";
export type M2LaborCommitmentPurposeV0 = "mobilized";
export type M2RouteKindV0 = "coast" | "river" | "road";

export interface M2LaborCommitmentStateV0 {
  readonly purpose: M2LaborCommitmentPurposeV0;
  readonly laborAmount: number;
  readonly startDay: GameDay;
  readonly releaseDay: GameDay;
}

export interface M2PopulationGroupStateV0 {
  readonly id: PopulationGroupId;
  readonly districtId: DistrictId;
  readonly totalPeople: number;
  readonly workingPeople: number;
  readonly dependentPeople: number;
  readonly availableLabor: number;
  readonly committedLabor: readonly M2LaborCommitmentStateV0[];
  readonly grainStock: number;
  readonly cashStock: number;
}

export interface M2DistrictAgricultureStateV0 {
  readonly districtId: DistrictId;
  readonly phase: M2AgriculturePhaseV0;
  readonly daysInPhase: number;
  readonly accumulatedFarmLabor: number;
  readonly expectedHarvestGrain: number;
  readonly lastHarvestGrain: number;
}

export interface M2DistrictMarketStateV0 {
  readonly districtId: DistrictId;
  readonly grainPriceCashPerHundred: number;
  readonly cashFlow: {
    readonly cumulativeMobilizationCost: number;
    readonly lastDailyCashDelta: number;
  };
  readonly grainFlow: {
    readonly lastHarvestDelta: number;
  };
}

export interface M2SeasonalMonthStateV0 {
  readonly month: number;
  readonly monsoonIntensityBps: number;
  readonly agricultureWorkBps: number;
  readonly riverNavigabilityBps: number;
  readonly roadTravelCostBps: number;
}

export interface M2RegionalSeasonalCurveStateV0 {
  readonly id: RegionalSeasonalCurveId;
  readonly monthlyValues: readonly M2SeasonalMonthStateV0[];
}

export interface M2DistrictSeasonalityStateV0 {
  readonly districtId: DistrictId;
  readonly regionalCurveId: RegionalSeasonalCurveId;
}

export interface M2RouteTransportEdgeStateV0 {
  readonly routeId: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly routeKind: M2RouteKindV0;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
}

export interface M2TransportStateV0 {
  readonly schemaVersion: 1;
  readonly routes: readonly M2RouteTransportEdgeStateV0[];
  readonly districtSeasonality: readonly M2DistrictSeasonalityStateV0[];
  readonly regionalCurves: readonly M2RegionalSeasonalCurveStateV0[];
}

export interface M2EconomyPopulationStateV0 {
  readonly schemaVersion: 1;
  readonly populationGroups: readonly M2PopulationGroupStateV0[];
  readonly agriculture: {
    readonly districts: readonly M2DistrictAgricultureStateV0[];
  };
  readonly market: {
    readonly districts: readonly M2DistrictMarketStateV0[];
  };
  readonly transport: M2TransportStateV0;
}

export type M3ObligationKindV0 = "tribute" | "troop";
export type M3ObligationResourceKindV0 = "cash" | "grain" | "troops";
export type M3ObligationStatusV0 = "active" | "disputed" | "breached";
export type M3ObligationAuditEventKindV0 = "created" | "settled" | "status-changed";
export type M3ObligationCategoryV0 =
  | "regular-tribute"
  | "extraordinary-levy"
  | "troop-obligation"
  | "defensive-garrison"
  | "specific-war-aid";
export type M3ObligationSettlementActionV0 =
  | "fulfillment"
  | "partial-fulfillment"
  | "deferral"
  | "refusal"
  | "remission"
  | "pursuit-recovery"
  | "default-breach";
export type M3TroopResponseStateV0 =
  | "none"
  | "committed"
  | "deferred"
  | "refused"
  | "remitted"
  | "recovery-pursued"
  | "breached";
export type M3AdministrativeControlModeV0 = "direct" | "vassal" | "tribute-only";
export type M3OfficeKindV0 = "commander" | "governor" | "minister";
export type M3OfficeJurisdictionV0 =
  | { readonly kind: "polity"; readonly polityId: PolityId }
  | { readonly kind: "district"; readonly districtId: DistrictId };
export type M3PolicyStanceV0 = "balanced" | "conciliatory" | "extractive" | "military";
export type M3PolicyTargetV0 =
  | { readonly kind: "office"; readonly officeId: M3OfficeId }
  | { readonly kind: "polity"; readonly polityId: PolityId }
  | { readonly kind: "district"; readonly districtId: DistrictId };
export type M3AppointmentAuditEventKindV0 =
  | "appointment"
  | "bulk-appointment"
  | "enfeoffment"
  | "policy-updated";
export type M3SuccessionSupportKindV0 =
  | "kinship"
  | "designation"
  | "court"
  | "military"
  | "provincial"
  | "suzerain"
  | "foreign";
export type M3SuccessionTriggerV0 =
  | {
      readonly kind: "death";
      readonly characterId: PersonId;
      readonly officeId: M3OfficeId | null;
    }
  | {
      readonly kind: "incapacity";
      readonly characterId: PersonId;
      readonly officeId: M3OfficeId | null;
    };
export type M3SuccessionOutcomeV0 =
  | {
      readonly kind: "peaceful";
      readonly successorCharacterId: PersonId;
      readonly supportTotalBps: number;
    }
  | {
      readonly kind: "regency";
      readonly successorCharacterId: PersonId;
      readonly regentCharacterId: PersonId;
      readonly supportTotalBps: number;
      readonly reasonCode: string;
    }
  | {
      readonly kind: "disputed";
      readonly leadingCharacterId: PersonId;
      readonly rivalCharacterId: PersonId;
      readonly supportMarginBps: number;
      readonly reasonCode: string;
    };

export interface M3PolityRecordStateV0 {
  readonly polityId: PolityId;
  readonly directSuzerainPolityId: PolityId | null;
}

export type M3ObligationRequirementV0 =
  | {
      readonly kind: "amount";
      readonly resourceKind: M3ObligationResourceKindV0;
      readonly amount: number;
    }
  | {
      readonly kind: "condition";
      readonly conditionKey: string;
    };

export type M3ObligationDueV0 =
  | {
      readonly kind: "cadence";
      readonly periodDays: number;
      readonly nextDueDay: GameDay;
    }
  | {
      readonly kind: "trigger";
      readonly triggerKey: string;
    };

export interface M3ObligationSourceStateV0 {
  readonly kind: "vassalage";
  readonly sourceId: string;
  readonly debtorPolityId: PolityId;
  readonly creditorPolityId: PolityId;
}

export interface M3ObligationAccountingStateV0 {
  readonly nominalAmount: number;
  readonly dueAmount: number;
  readonly deliveredAmount: number;
  readonly arrearsAmount: number;
  readonly defaultedAmount: number;
  readonly remittedAmount: number;
  readonly dueDay: GameDay;
  readonly cycle: number;
  readonly troopResponseState: M3TroopResponseStateV0;
}

export interface M3ObligationStateV0 {
  readonly id: M3ObligationId;
  readonly debtorPolityId: PolityId;
  readonly creditorPolityId: PolityId;
  readonly obligationKind: M3ObligationKindV0;
  readonly obligationCategory: M3ObligationCategoryV0;
  readonly obligationSource: M3ObligationSourceStateV0;
  readonly requirement: M3ObligationRequirementV0;
  readonly due: M3ObligationDueV0;
  readonly accounting: M3ObligationAccountingStateV0;
  readonly status: M3ObligationStatusV0;
  readonly disputeReasonCode: string | null;
  readonly breachReasonCode: string | null;
  readonly createdAuditEventId: M3ObligationAuditEventId;
  readonly latestAuditEventId: M3ObligationAuditEventId;
}

export interface M3ObligationAuditEventStateV0 {
  readonly id: M3ObligationAuditEventId;
  readonly obligationId: M3ObligationId;
  readonly eventKind: M3ObligationAuditEventKindV0;
  readonly eventDay: GameDay;
  readonly eventRevision: WorldRevision;
  readonly commandId: string;
  readonly actor: {
    readonly kind: "ai" | "player" | "system";
    readonly id: string;
  };
  readonly actionKind: M3ObligationSettlementActionV0 | null;
  readonly dueDay: GameDay | null;
  readonly fulfillmentId: M3FulfillmentId | null;
  readonly fulfilledAmount: number | null;
  readonly statusAfter: M3ObligationStatusV0;
  readonly reasonCode: string | null;
  readonly reasonCodes: readonly string[];
  readonly reliabilityBps: number;
}

export type M3FulfillmentSourceMovementStateV0 =
  | {
      readonly kind: "m2-population-group";
      readonly populationGroupId: PopulationGroupId;
      readonly districtId: DistrictId;
      readonly resourceKind: "cash" | "grain";
      readonly amount: number;
    }
  | {
      readonly kind: "m3-troop-commitment-placeholder";
      readonly debtorPolityId: PolityId;
      readonly headcount: number;
    };

export interface M3FulfillmentClaimStateV0 {
  readonly fulfillmentId: M3FulfillmentId;
  readonly obligationId: M3ObligationId;
  readonly auditEventId: M3ObligationAuditEventId;
  readonly actionKind: M3ObligationSettlementActionV0;
  readonly dueDay: GameDay;
  readonly fulfilledAmount: number;
  readonly deliveredAmount: number;
  readonly arrearsAmount: number;
  readonly defaultedAmount: number;
  readonly reasonCode: string;
  readonly sourceMovements: readonly M3FulfillmentSourceMovementStateV0[];
}

export interface M3AdministrativeDistrictStateV0 {
  readonly polityId: PolityId;
  readonly districtId: DistrictId;
  readonly controlMode: M3AdministrativeControlModeV0;
  readonly localComplexity: number;
  readonly communicationCost: number;
  readonly directness: number;
  readonly frontierPressure: number;
  readonly administrativeCapacity: number;
}

export interface M3CharacterStateV0 {
  readonly characterId: PersonId;
  readonly polityId: PolityId;
  readonly alive: boolean;
  readonly incapacitated: boolean;
  readonly currentDistrictId: DistrictId;
  readonly commandBps: number;
  readonly administrationBps: number;
  readonly diplomacyBps: number;
}

export interface M3CharacterRelationshipStateV0 {
  readonly sourceCharacterId: PersonId;
  readonly targetCharacterId: PersonId;
  readonly affinityBps: number;
}

export interface M3OfficeStateV0 {
  readonly officeId: M3OfficeId;
  readonly polityId: PolityId;
  readonly jurisdiction: M3OfficeJurisdictionV0;
  readonly officeKind: M3OfficeKindV0;
  readonly primary: boolean;
  readonly holderCharacterId: PersonId | null;
  readonly policyId: M3PolicyId;
  readonly minimumCommandBps: number;
  readonly minimumAdministrationBps: number;
}

export interface M3PolicyStateV0 {
  readonly policyId: M3PolicyId;
  readonly target: M3PolicyTargetV0;
  readonly stance: M3PolicyStanceV0;
  readonly intensityBps: number;
}

export interface M3EnfeoffmentStateV0 {
  readonly districtId: DistrictId;
  readonly holderCharacterId: PersonId;
  readonly grantedByPolityId: PolityId;
  readonly policyId: M3PolicyId;
  readonly grantedDay: GameDay;
  readonly reasonCode: string;
}

export interface M3AppointmentAuditEventStateV0 {
  readonly id: M3AppointmentAuditEventId;
  readonly eventKind: M3AppointmentAuditEventKindV0;
  readonly eventDay: GameDay;
  readonly eventRevision: WorldRevision;
  readonly commandId: string;
  readonly actor: {
    readonly kind: "ai" | "player" | "system";
    readonly id: string;
  };
  readonly officeId: M3OfficeId | null;
  readonly characterId: PersonId | null;
  readonly policyId: M3PolicyId | null;
  readonly districtId: DistrictId | null;
  readonly reasonCode: string;
}

export interface M3SuccessionSupportSourceStateV0 {
  readonly kind: M3SuccessionSupportKindV0;
  readonly strengthBps: number;
  readonly sourceId: string;
}

export interface M3SuccessionCandidateProfileStateV0 {
  readonly polityId: PolityId;
  readonly characterId: PersonId;
  readonly requiresRegency: boolean;
  readonly supportSources: readonly M3SuccessionSupportSourceStateV0[];
}

export interface M3SuccessionCandidateStateV0 {
  readonly characterId: PersonId;
  readonly requiresRegency: boolean;
  readonly supportSources: readonly M3SuccessionSupportSourceStateV0[];
  readonly supportTotalBps: number;
}

export interface M3SuccessionCrisisStateV0 {
  readonly id: M3SuccessionId;
  readonly polityId: PolityId;
  readonly trigger: M3SuccessionTriggerV0;
  readonly status: "pending" | "resolved";
  readonly startedDay: GameDay;
  readonly resolvedDay: GameDay | null;
  readonly candidates: readonly M3SuccessionCandidateStateV0[];
  readonly outcome: M3SuccessionOutcomeV0 | null;
  readonly reasonCode: string;
}

export interface M3PolityVassalageStateV0 {
  readonly schemaVersion: 1;
  readonly polities: readonly M3PolityRecordStateV0[];
  readonly obligations: readonly M3ObligationStateV0[];
  readonly obligationAuditEvents: readonly M3ObligationAuditEventStateV0[];
  readonly fulfillmentClaims: readonly M3FulfillmentClaimStateV0[];
  readonly administrativeDistricts: readonly M3AdministrativeDistrictStateV0[];
  readonly characters: readonly M3CharacterStateV0[];
  readonly relationships: readonly M3CharacterRelationshipStateV0[];
  readonly offices: readonly M3OfficeStateV0[];
  readonly policies: readonly M3PolicyStateV0[];
  readonly enfeoffments: readonly M3EnfeoffmentStateV0[];
  readonly appointmentAuditEvents: readonly M3AppointmentAuditEventStateV0[];
  readonly successionCandidateProfiles: readonly M3SuccessionCandidateProfileStateV0[];
  readonly successionCrises: readonly M3SuccessionCrisisStateV0[];
}

export type M4CampaignObjectiveKindV0 =
  | "prepare"
  | "march"
  | "besiege"
  | "relieve"
  | "withdraw"
  | "postwar-result-candidate";
export type M4CampaignPlanStatusV0 = "planned" | "active" | "cancelled" | "completed";
export type M4CampaignOwnerV0 =
  | { readonly kind: "commander"; readonly characterId: PersonId }
  | { readonly kind: "polity"; readonly polityId: PolityId };
export type M4CampaignTargetV0 =
  | { readonly kind: "district"; readonly districtId: DistrictId }
  | { readonly kind: "polity"; readonly polityId: PolityId };

export interface M4CampaignStartWindowV0 {
  readonly earliestDay: GameDay;
  readonly latestDay: GameDay;
}

export interface M4CampaignPlanStateV0 {
  readonly id: CampaignPlanId;
  readonly owner: M4CampaignOwnerV0;
  readonly target: M4CampaignTargetV0;
  readonly objectiveKind: M4CampaignObjectiveKindV0;
  readonly startWindow: M4CampaignStartWindowV0;
  readonly status: M4CampaignPlanStatusV0;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly createdDay: GameDay;
  readonly updatedDay: GameDay;
}

export type M4MusterCommitmentStatusV0 =
  | "promised"
  | "assembled"
  | "delayed"
  | "refused"
  | "released";

export interface M4MusterAssemblyWindowV0 {
  readonly earliestDay: GameDay;
  readonly latestDay: GameDay;
}

export type M4MusterCommitmentSourceV0 = {
  readonly kind: "m3-obligation";
  readonly obligationId: M3ObligationId;
  readonly debtorPolityId: PolityId;
  readonly creditorPolityId: PolityId;
};

export type M4MusterLocalCostHookV0 =
  | {
      readonly kind: "economic-labor-reservation";
      readonly districtId: DistrictId;
      readonly laborAmount: number;
      readonly reasonCode: string;
    }
  | {
      readonly kind: "loyalty-pressure";
      readonly polityId: PolityId;
      readonly pressureBps: number;
      readonly reasonCode: string;
    };

export interface M4MobilizedForceCommitmentStateV0 {
  readonly id: MobilizedForceCommitmentId;
  readonly campaignPlanId: CampaignPlanId;
  readonly source: M4MusterCommitmentSourceV0;
  readonly promisedTroops: number;
  readonly dueDay: GameDay;
  readonly assemblyWindow: M4MusterAssemblyWindowV0;
  readonly plannedAssemblyDay: GameDay;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
  readonly releasedTroops: number;
  readonly status: M4MusterCommitmentStatusV0;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly localCostHooks: readonly M4MusterLocalCostHookV0[];
}

export type M4GrainSupplySourceV0 = {
  readonly kind: "m2-population-group";
  readonly populationGroupId: PopulationGroupId;
  readonly districtId: DistrictId;
};

export type M4GrainSupplyReservationStatusV0 =
  | "reserved"
  | "partially-consumed"
  | "shortage"
  | "consumed"
  | "released";

export interface M4GrainSupplyReservationStateV0 {
  readonly reservationId: GrainSupplyReservationId;
  readonly campaignPlanId: CampaignPlanId;
  readonly source: M4GrainSupplySourceV0;
  readonly reservedAmount: number;
  readonly carriedAmount: number;
  readonly consumedAmount: number;
  readonly shortageAmount: number;
  readonly lossAmount: number;
  readonly lossReasonCode: string | null;
  readonly expectedDailyConsumption: number;
  readonly expectedDaysOfSupply: number;
  readonly status: M4GrainSupplyReservationStatusV0;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
}

export type M4CampaignMarchStatusV0 =
  | "planned"
  | "marching"
  | "paused"
  | "delayed"
  | "cancelled"
  | "arrived";
export type M4CampaignMarchSupplyStatusV0 =
  | "well-supplied"
  | "strained"
  | "hungry"
  | "out-of-supply";

export interface M4CampaignMarchRouteSegmentStateV0 {
  readonly routeId: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly travelDays: number;
  readonly capacity: number;
  readonly seasonRiskReasonCodes: readonly string[];
}

export interface M4CampaignMarchSupplyStateV0 {
  readonly status: M4CampaignMarchSupplyStatusV0;
  readonly carriedGrain: number;
  readonly consumedGrain: number;
  readonly shortageGrain: number;
  readonly delayedDays: number;
}

export interface M4CampaignArrivalWindowV0 {
  readonly earliestDay: GameDay;
  readonly latestDay: GameDay;
}

export interface M4CampaignMarchJoinedCommitmentTroopsStateV0 {
  readonly commitmentId: MobilizedForceCommitmentId;
  readonly joinedTroops: number;
}

export interface M4CampaignMarchStateV0 {
  readonly marchId: CampaignMarchId;
  readonly campaignPlanId: CampaignPlanId;
  readonly originDistrictId: DistrictId;
  readonly targetDistrictId: DistrictId;
  readonly currentDistrictId: DistrictId;
  readonly routeSegments: readonly M4CampaignMarchRouteSegmentStateV0[];
  readonly currentSegmentIndex: number;
  readonly progressOnSegmentDays: number;
  readonly activeTroops: number;
  readonly grainPerTroopPerDay: number;
  readonly supply: M4CampaignMarchSupplyStateV0;
  readonly status: M4CampaignMarchStatusV0;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly startedDay: GameDay;
  readonly updatedDay: GameDay;
  readonly predictedArrivalWindow: M4CampaignArrivalWindowV0;
  readonly actualArrivalDay: GameDay | null;
  readonly joinedCommitmentIds: readonly MobilizedForceCommitmentId[];
  readonly joinedCommitmentTroops: readonly M4CampaignMarchJoinedCommitmentTroopsStateV0[];
  readonly failedCommitmentIds: readonly MobilizedForceCommitmentId[];
}

export type M4FactionKnowledgeSourceKindV0 = "scout" | "merchant" | "envoy" | "report";

export interface M4FactionKnowledgeSourceV0 {
  readonly kind: M4FactionKnowledgeSourceKindV0;
  readonly sourceId: string;
  readonly reliabilityBps: number;
}

export interface M4KnownObjectiveEstimateV0 {
  readonly campaignPlanId: CampaignPlanId;
  readonly target: M4CampaignTargetV0;
  readonly objectiveKind: M4CampaignObjectiveKindV0;
  readonly confidenceBps: number;
  readonly reasonCodes: readonly string[];
}

export interface M4RouteEstimateV0 {
  readonly routeId: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly travelCostEstimate: number;
  readonly capacityEstimate: number;
  readonly confidenceBps: number;
}

export interface M4SupplyEstimateV0 {
  readonly districtId: DistrictId;
  readonly supplyMin: number;
  readonly supplyMax: number;
  readonly confidenceBps: number;
}

export interface M4DefenderEstimateV0 {
  readonly target: M4CampaignTargetV0;
  readonly defenderMin: number;
  readonly defenderMax: number;
  readonly confidenceBps: number;
}

export interface M4FactionKnowledgeSnapshotStateV0 {
  readonly snapshotId: FactionKnowledgeSnapshotId;
  readonly observerPolityId: PolityId;
  readonly subjectPolityId: PolityId;
  readonly knowledgeVersion: number;
  readonly recordedDay: GameDay;
  readonly source: M4FactionKnowledgeSourceV0;
  readonly knownObjectives: readonly M4KnownObjectiveEstimateV0[];
  readonly routeEstimates: readonly M4RouteEstimateV0[];
  readonly supplyEstimates: readonly M4SupplyEstimateV0[];
  readonly defenderEstimates: readonly M4DefenderEstimateV0[];
}

export interface M4CampaignStateV0 {
  readonly schemaVersion: 1;
  readonly campaignPlans: readonly M4CampaignPlanStateV0[];
  readonly factionKnowledgeSnapshots: readonly M4FactionKnowledgeSnapshotStateV0[];
  readonly mobilizedForceCommitments: readonly M4MobilizedForceCommitmentStateV0[];
  readonly grainSupplyReservations: readonly M4GrainSupplyReservationStateV0[];
  readonly marches: readonly M4CampaignMarchStateV0[];
}

export interface M3AdministrativeBurdenProfileInputV0 {
  readonly polityId: unknown;
  readonly districtId: unknown;
  readonly controlMode: unknown;
  readonly localComplexity: unknown;
  readonly communicationCost: unknown;
  readonly directness: unknown;
  readonly frontierPressure: unknown;
  readonly administrativeCapacity: unknown;
}

export interface M3AdministrativeBurdenProfileV0 {
  readonly polityId: PolityId;
  readonly districtId: DistrictId;
  readonly controlMode: M3AdministrativeControlModeV0;
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

export interface WorldRuntimeStateV0 {
  readonly polities: readonly PolityState[];
  readonly persons: readonly PersonState[];
  readonly districts: readonly DistrictState[];
  readonly settlements: readonly SettlementState[];
  readonly routes: readonly RouteState[];
  readonly m2?: M2EconomyPopulationStateV0;
  readonly m3?: M3PolityVassalageStateV0;
  readonly m4?: M4CampaignStateV0;
}

export interface SchedulerStateV0 {
  readonly schedulerVersion: typeof GAME_DAY_SCHEDULER_VERSION;
  readonly systemOrderVersion: typeof DETERMINISTIC_SYSTEM_ORDER_VERSION;
  readonly fixedStepDurationInDays: 1;
  readonly lastCompletedDay: GameDay;
  readonly pendingCommandCount: number;
}

export interface WorldMetaV0 {
  readonly schemaVersion: typeof WORLD_STATE_V0_SCHEMA_VERSION;
  readonly seed: SimulationSeed;
  readonly contentManifestHash: ContentManifestHash;
  readonly currentDay: GameDay;
  readonly revision: WorldRevision;
  readonly hashAlgorithm: "fnv1a32-canonical-world-state-v0";
  readonly stateHash: string;
}

export interface WorldStateV0 {
  readonly meta: WorldMetaV0;
  readonly definitions: WorldDefinitionsV0;
  readonly state: WorldRuntimeStateV0;
  readonly scheduler: SchedulerStateV0;
}

interface WorldStateV0Candidate {
  readonly meta: unknown;
  readonly definitions: WorldDefinitionsV0;
  readonly state: WorldRuntimeStateV0;
  readonly scheduler: unknown;
}

export type InvariantCode =
  | "bad-reference"
  | "duplicate-definition-id"
  | "duplicate-runtime-state-row"
  | "hash-mismatch"
  | "invalid-day"
  | "invalid-revision"
  | "invalid-schema"
  | "missing-definition"
  | "missing-runtime-state-row";

export interface WorldInvariantError {
  readonly code: InvariantCode;
  readonly path: string;
  readonly message: string;
}

export interface DefinePolityInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
}

export interface DefinePersonInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
}

export interface DefineDistrictInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
}

export interface DefineSettlementInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
  readonly districtId: unknown;
}

export interface DefineRouteInput {
  readonly id: unknown;
  readonly fromDistrictId: unknown;
  readonly toDistrictId: unknown;
  readonly lengthInMapUnits: unknown;
}

export interface CreateM2TransportStateV0Input {
  readonly routes: readonly {
    readonly routeId: unknown;
    readonly fromDistrictId: unknown;
    readonly toDistrictId: unknown;
    readonly routeKind: unknown;
    readonly baseTravelCost: unknown;
    readonly baseCapacity: unknown;
  }[];
  readonly districtSeasonality: readonly {
    readonly districtId: unknown;
    readonly regionalCurveId: unknown;
  }[];
  readonly regionalCurves: readonly {
    readonly id: unknown;
    readonly monthlyValues: readonly {
      readonly month: unknown;
      readonly monsoonIntensityBps: unknown;
      readonly agricultureWorkBps: unknown;
      readonly riverNavigabilityBps: unknown;
      readonly roadTravelCostBps: unknown;
    }[];
  }[];
}

export interface CreateWorldStateV0Input {
  readonly seed: unknown;
  readonly contentManifestHash: unknown;
  readonly currentDay: unknown;
  readonly revision: unknown;
  readonly definitions: WorldDefinitionsV0;
  readonly m2?: M2EconomyPopulationStateV0;
  readonly m3?: M3PolityVassalageStateV0;
  readonly m4?: M4CampaignStateV0;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function parsePersonId(value: unknown): PersonId {
  return parsePositiveInteger(value, "PersonId") as PersonId;
}

export function parsePolityId(value: unknown): PolityId {
  return parsePositiveInteger(value, "PolityId") as PolityId;
}

export function parseDistrictId(value: unknown): DistrictId {
  return parsePositiveInteger(value, "DistrictId") as DistrictId;
}

export function parseSettlementId(value: unknown): SettlementId {
  return parsePositiveInteger(value, "SettlementId") as SettlementId;
}

export function parseRouteId(value: unknown): RouteId {
  return parsePositiveInteger(value, "RouteId") as RouteId;
}

export function parseRegionalSeasonalCurveId(value: unknown): RegionalSeasonalCurveId {
  return parsePositiveInteger(value, "RegionalSeasonalCurveId") as RegionalSeasonalCurveId;
}

export function parsePopulationGroupId(value: unknown): PopulationGroupId {
  return parsePositiveInteger(value, "PopulationGroupId") as PopulationGroupId;
}

export function parseM3ObligationId(value: unknown): M3ObligationId {
  return parsePositiveInteger(value, "M3ObligationId") as M3ObligationId;
}

export function parseM3ObligationAuditEventId(value: unknown): M3ObligationAuditEventId {
  return parsePositiveInteger(value, "M3ObligationAuditEventId") as M3ObligationAuditEventId;
}

export function parseM3FulfillmentId(value: unknown): M3FulfillmentId {
  return parsePositiveInteger(value, "M3FulfillmentId") as M3FulfillmentId;
}

export function parseM3OfficeId(value: unknown): M3OfficeId {
  return parsePositiveInteger(value, "M3OfficeId") as M3OfficeId;
}

export function parseM3PolicyId(value: unknown): M3PolicyId {
  return parsePositiveInteger(value, "M3PolicyId") as M3PolicyId;
}

export function parseM3AppointmentAuditEventId(value: unknown): M3AppointmentAuditEventId {
  return parsePositiveInteger(value, "M3AppointmentAuditEventId") as M3AppointmentAuditEventId;
}

export function parseM3SuccessionId(value: unknown): M3SuccessionId {
  return parsePositiveInteger(value, "M3SuccessionId") as M3SuccessionId;
}

export function parseCampaignPlanId(value: unknown): CampaignPlanId {
  return parsePositiveInteger(value, "CampaignPlanId") as CampaignPlanId;
}

export function parseCampaignMarchId(value: unknown): CampaignMarchId {
  return parsePositiveInteger(value, "CampaignMarchId") as CampaignMarchId;
}

export function parseFactionKnowledgeSnapshotId(value: unknown): FactionKnowledgeSnapshotId {
  return parsePositiveInteger(value, "FactionKnowledgeSnapshotId") as FactionKnowledgeSnapshotId;
}

export function parseMobilizedForceCommitmentId(value: unknown): MobilizedForceCommitmentId {
  return parsePositiveInteger(value, "MobilizedForceCommitmentId") as MobilizedForceCommitmentId;
}

export function parseGrainSupplyReservationId(value: unknown): GrainSupplyReservationId {
  return parsePositiveInteger(value, "GrainSupplyReservationId") as GrainSupplyReservationId;
}

export function parseGameDay(value: unknown): GameDay {
  return parseNonnegativeInteger(value, "GameDay") as GameDay;
}

export function parseWorldRevision(value: unknown): WorldRevision {
  return parseNonnegativeInteger(value, "WorldRevision") as WorldRevision;
}

export function parseSimulationSeed(value: unknown): SimulationSeed {
  return parseNonnegativeInteger(value, "SimulationSeed") as SimulationSeed;
}

export function parseContentManifestHash(value: unknown): ContentManifestHash {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("ContentManifestHash must be a non-empty string.");
  }

  return value as ContentManifestHash;
}

export function definePolity(input: DefinePolityInput): PolityDefinition {
  return {
    id: parsePolityId(input.id),
    displayNameKey: parseDisplayNameKey(input.displayNameKey, "PolityDefinition.displayNameKey")
  };
}

export function definePerson(input: DefinePersonInput): PersonDefinition {
  return {
    id: parsePersonId(input.id),
    displayNameKey: parseDisplayNameKey(input.displayNameKey, "PersonDefinition.displayNameKey")
  };
}

export function defineDistrict(input: DefineDistrictInput): DistrictDefinition {
  return {
    id: parseDistrictId(input.id),
    displayNameKey: parseDisplayNameKey(input.displayNameKey, "DistrictDefinition.displayNameKey")
  };
}

export function defineSettlement(input: DefineSettlementInput): SettlementDefinition {
  return {
    id: parseSettlementId(input.id),
    displayNameKey: parseDisplayNameKey(
      input.displayNameKey,
      "SettlementDefinition.displayNameKey"
    ),
    districtId: parseDistrictId(input.districtId)
  };
}

export function defineRoute(input: DefineRouteInput): RouteDefinition {
  return {
    id: parseRouteId(input.id),
    fromDistrictId: parseDistrictId(input.fromDistrictId),
    toDistrictId: parseDistrictId(input.toDistrictId),
    lengthInMapUnits: parsePositiveInteger(input.lengthInMapUnits, "Route lengthInMapUnits")
  };
}

export function createM2EconomyPopulationStateV0(
  definitions: WorldDefinitionsV0,
  transportInput?: CreateM2TransportStateV0Input
): M2EconomyPopulationStateV0 {
  const settlementCountByDistrictId = new Map<number, number>();
  for (const settlement of definitions.settlements) {
    settlementCountByDistrictId.set(
      settlement.districtId,
      (settlementCountByDistrictId.get(settlement.districtId) ?? 0) + 1
    );
  }

  return {
    schemaVersion: 1,
    populationGroups: sortByNumericId(definitions.districts).map((district) => {
      const settlementCount = settlementCountByDistrictId.get(district.id) ?? 0;
      const totalPeople = 1_000 + settlementCount * 250;
      const workingPeople = Math.floor(totalPeople / 2);
      return {
        id: parsePopulationGroupId(district.id),
        districtId: district.id,
        totalPeople,
        workingPeople,
        dependentPeople: totalPeople - workingPeople,
        availableLabor: workingPeople,
        committedLabor: [],
        grainStock: totalPeople * 3,
        cashStock: totalPeople
      };
    }),
    agriculture: {
      districts: sortByNumericId(definitions.districts).map((district) => ({
        districtId: district.id,
        phase: "fallow",
        daysInPhase: 0,
        accumulatedFarmLabor: 0,
        expectedHarvestGrain: 0,
        lastHarvestGrain: 0
      }))
    },
    market: {
      districts: sortByNumericId(definitions.districts).map((district) => ({
        districtId: district.id,
        grainPriceCashPerHundred: 100,
        cashFlow: {
          cumulativeMobilizationCost: 0,
          lastDailyCashDelta: 0
        },
        grainFlow: {
          lastHarvestDelta: 0
        }
      }))
    },
    transport: createM2RouteTransportStateV0(definitions, transportInput)
  };
}

export function createM2RouteTransportStateV0(
  definitions: WorldDefinitionsV0,
  input?: CreateM2TransportStateV0Input
): M2TransportStateV0 {
  if (input !== undefined) {
    return canonicalizeM2TransportState({
      schemaVersion: 1,
      routes: input.routes.map((route) => ({
        routeId: parseRouteId(route.routeId),
        fromDistrictId: parseDistrictId(route.fromDistrictId),
        toDistrictId: parseDistrictId(route.toDistrictId),
        routeKind: parseM2RouteKind(route.routeKind),
        baseTravelCost: parsePositiveInteger(route.baseTravelCost, "M2 baseTravelCost"),
        baseCapacity: parsePositiveInteger(route.baseCapacity, "M2 baseCapacity")
      })),
      districtSeasonality: input.districtSeasonality.map((entry) => ({
        districtId: parseDistrictId(entry.districtId),
        regionalCurveId: parseRegionalSeasonalCurveId(entry.regionalCurveId)
      })),
      regionalCurves: input.regionalCurves.map((curve) => ({
        id: parseRegionalSeasonalCurveId(curve.id),
        monthlyValues: curve.monthlyValues.map((month) => ({
          month: parseIntegerInRange(month.month, "M2 seasonal month", 1, 12),
          monsoonIntensityBps: parseIntegerInRange(
            month.monsoonIntensityBps,
            "M2 monsoonIntensityBps",
            0,
            10_000
          ),
          agricultureWorkBps: parseIntegerInRange(
            month.agricultureWorkBps,
            "M2 agricultureWorkBps",
            0,
            10_000
          ),
          riverNavigabilityBps: parseIntegerInRange(
            month.riverNavigabilityBps,
            "M2 riverNavigabilityBps",
            0,
            10_000
          ),
          roadTravelCostBps: parseIntegerInRange(
            month.roadTravelCostBps,
            "M2 roadTravelCostBps",
            1,
            30_000
          )
        }))
      }))
    });
  }

  const neutralCurveId = parseRegionalSeasonalCurveId(1);
  const neutralMonths = Array.from({ length: 12 }, (_unused, index) => ({
    month: index + 1,
    monsoonIntensityBps: 0,
    agricultureWorkBps: 10_000,
    riverNavigabilityBps: 10_000,
    roadTravelCostBps: 10_000
  }));

  return canonicalizeM2TransportState({
    schemaVersion: 1,
    routes: definitions.routes.map((route) => ({
      routeId: route.id,
      fromDistrictId: route.fromDistrictId,
      toDistrictId: route.toDistrictId,
      routeKind: "road",
      baseTravelCost: route.lengthInMapUnits,
      baseCapacity: 100
    })),
    districtSeasonality: definitions.districts.map((district) => ({
      districtId: district.id,
      regionalCurveId: neutralCurveId
    })),
    regionalCurves:
      definitions.districts.length === 0
        ? []
        : [
            {
              id: neutralCurveId,
              monthlyValues: neutralMonths
            }
          ]
  });
}

export function createWorldStateV0(input: CreateWorldStateV0Input): WorldStateV0 {
  const definitions = canonicalizeDefinitions(input.definitions);
  const state = createRuntimeState(definitions, input.m2, input.m3, input.m4);
  const stateWithoutHash: WorldStateV0 = {
    meta: {
      schemaVersion: WORLD_STATE_V0_SCHEMA_VERSION,
      seed: parseSimulationSeed(input.seed),
      contentManifestHash: parseContentManifestHash(input.contentManifestHash),
      currentDay: parseGameDay(input.currentDay),
      revision: parseWorldRevision(input.revision),
      hashAlgorithm: "fnv1a32-canonical-world-state-v0" as const,
      stateHash: ""
    },
    definitions,
    state,
    scheduler: {
      schedulerVersion: GAME_DAY_SCHEDULER_VERSION,
      systemOrderVersion: DETERMINISTIC_SYSTEM_ORDER_VERSION,
      fixedStepDurationInDays: 1,
      lastCompletedDay: parseGameDay(input.currentDay),
      pendingCommandCount: 0
    }
  };
  const stateHash = hashWorldStateV0(stateWithoutHash);

  return {
    ...stateWithoutHash,
    meta: {
      ...stateWithoutHash.meta,
      stateHash
    }
  };
}

export function hashWorldStateV0(world: WorldStateV0): string {
  return hashWorldStateV0Candidate(world);
}

export function canonicalWorldStateV0Text(world: WorldStateV0): string {
  return canonicalWorldStateV0CandidateText(world);
}

function hashWorldStateV0Candidate(world: WorldStateV0Candidate): string {
  return toFixedHexHash(hashText(canonicalWorldStateV0CandidateText(world)));
}

function canonicalWorldStateV0CandidateText(world: WorldStateV0Candidate): string {
  return [
    "world-state-v0",
    `schemaVersion=${formatUnknown(getRecordPath(world, ["meta", "schemaVersion"]))}`,
    `seed=${formatUnknown(getRecordPath(world, ["meta", "seed"]))}`,
    `contentManifestHash=${formatUnknown(getRecordPath(world, ["meta", "contentManifestHash"]))}`,
    `currentDay=${formatUnknown(getRecordPath(world, ["meta", "currentDay"]))}`,
    `revision=${formatUnknown(getRecordPath(world, ["meta", "revision"]))}`,
    `hashAlgorithm=${formatUnknown(getRecordPath(world, ["meta", "hashAlgorithm"]))}`,
    `definitions.polities=${formatPolityDefinitions(world.definitions.polities)}`,
    `definitions.persons=${formatPersonDefinitions(world.definitions.persons)}`,
    `definitions.districts=${formatDistrictDefinitions(world.definitions.districts)}`,
    `definitions.settlements=${formatSettlementDefinitions(world.definitions.settlements)}`,
    `definitions.routes=${formatRouteDefinitions(world.definitions.routes)}`,
    `state.polities=${formatPolityStates(world.state.polities)}`,
    `state.persons=${formatPersonStates(world.state.persons)}`,
    `state.districts=${formatDistrictStates(world.state.districts)}`,
    `state.settlements=${formatSettlementStates(world.state.settlements)}`,
    `state.routes=${formatRouteStates(world.state.routes)}`,
    ...formatM2CanonicalLines(world.state.m2),
    ...formatM3CanonicalLines(world.state.m3),
    ...formatM4CanonicalLines(world.state.m4),
    `scheduler.schedulerVersion=${formatUnknown(
      getRecordPath(world, ["scheduler", "schedulerVersion"])
    )}`,
    `scheduler.systemOrderVersion=${formatUnknown(
      getRecordPath(world, ["scheduler", "systemOrderVersion"])
    )}`,
    `scheduler.fixedStepDurationInDays=${formatUnknown(
      getRecordPath(world, ["scheduler", "fixedStepDurationInDays"])
    )}`,
    `scheduler.lastCompletedDay=${formatUnknown(
      getRecordPath(world, ["scheduler", "lastCompletedDay"])
    )}`,
    `scheduler.pendingCommandCount=${formatUnknown(
      getRecordPath(world, ["scheduler", "pendingCommandCount"])
    )}`
  ].join("\n");
}

export function validateWorldStateV0(input: unknown): readonly WorldInvariantError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "WorldState v0 must be an object with meta, definitions, state, and scheduler."
      }
    ];
  }

  const errors: WorldInvariantError[] = [];
  const world = validateWorldShape(input, errors);
  if (world === undefined) {
    return errors;
  }

  validateMeta(world, errors);
  validateScheduler(world, errors);
  validateDefinitionEntryShapes(world.definitions, errors);
  validateRuntimeEntryShapes(world.state, errors);
  validateM2EntryShapes(getRecordPath(world, ["state", "m2"]), errors);
  validateM3EntryShapes(getRecordPath(world, ["state", "m3"]), errors);
  validateM4EntryShapes(getRecordPath(world, ["state", "m4"]), errors);
  if (errors.some((error) => error.code === "invalid-schema")) {
    return errors;
  }

  validateDefinitions(world.definitions, errors);
  validateDefinitionReferences(world.definitions, errors);
  validateRuntimeState(world, errors);
  validateM2RuntimeState(world, errors);
  validateM3RuntimeState(world, errors);
  validateM4RuntimeState(world, errors);
  validateRuntimeTableCoverage(world, errors);
  validateStateHash(world, errors);
  return errors;
}

function validateWorldShape(
  input: Record<string, unknown>,
  errors: WorldInvariantError[]
): WorldStateV0Candidate | undefined {
  const meta = input["meta"];
  const definitions = input["definitions"];
  const state = input["state"];
  const scheduler = input["scheduler"];
  let isValid = true;

  if (!isRecord(meta)) {
    errors.push({
      code: "invalid-schema",
      path: "meta",
      message: "WorldState meta must be an object."
    });
    isValid = false;
  }

  if (!isRecord(definitions)) {
    errors.push({
      code: "invalid-schema",
      path: "definitions",
      message: "WorldState definitions must be an object."
    });
    isValid = false;
  } else {
    isValid =
      validateArrayField(definitions, "polities", "definitions.polities", errors) && isValid;
    isValid = validateArrayField(definitions, "persons", "definitions.persons", errors) && isValid;
    isValid =
      validateArrayField(definitions, "districts", "definitions.districts", errors) && isValid;
    isValid =
      validateArrayField(definitions, "settlements", "definitions.settlements", errors) && isValid;
    isValid = validateArrayField(definitions, "routes", "definitions.routes", errors) && isValid;
  }

  if (!isRecord(state)) {
    errors.push({
      code: "invalid-schema",
      path: "state",
      message: "WorldState state must be an object."
    });
    isValid = false;
  } else {
    isValid = validateArrayField(state, "polities", "state.polities", errors) && isValid;
    isValid = validateArrayField(state, "persons", "state.persons", errors) && isValid;
    isValid = validateArrayField(state, "districts", "state.districts", errors) && isValid;
    isValid = validateArrayField(state, "settlements", "state.settlements", errors) && isValid;
    isValid = validateArrayField(state, "routes", "state.routes", errors) && isValid;
  }

  if (!isRecord(scheduler)) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler",
      message: "WorldState scheduler must be an object."
    });
    isValid = false;
  }

  if (!isValid || !isRecord(meta) || !isDefinitionsLike(definitions) || !isStateLike(state)) {
    return undefined;
  }

  return {
    meta,
    definitions,
    state,
    scheduler
  };
}

function validateArrayField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): boolean {
  if (Array.isArray(record[key])) {
    return true;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be an array.`
  });
  return false;
}

function validateDefinitionEntryShapes(
  definitions: WorldDefinitionsV0,
  errors: WorldInvariantError[]
): void {
  validateSimpleDefinitionEntries(
    definitions.polities,
    "definitions.polities",
    "PolityDefinition",
    "PolityId",
    errors
  );
  validateSimpleDefinitionEntries(
    definitions.persons,
    "definitions.persons",
    "PersonDefinition",
    "PersonId",
    errors
  );
  validateSimpleDefinitionEntries(
    definitions.districts,
    "definitions.districts",
    "DistrictDefinition",
    "DistrictId",
    errors
  );

  definitions.settlements.forEach((entry, index) => {
    const path = `definitions.settlements[${index}]`;
    if (!validateRecordEntry(entry, path, "SettlementDefinition", errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "id", `${path}.id`, "SettlementId", errors);
    validateDisplayNameKeyField(entry, `${path}.displayNameKey`, "SettlementDefinition", errors);
    validatePositiveIntegerField(entry, "districtId", `${path}.districtId`, "DistrictId", errors);
  });

  definitions.routes.forEach((entry, index) => {
    const path = `definitions.routes[${index}]`;
    if (!validateRecordEntry(entry, path, "RouteDefinition", errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "id", `${path}.id`, "RouteId", errors);
    validatePositiveIntegerField(
      entry,
      "fromDistrictId",
      `${path}.fromDistrictId`,
      "DistrictId",
      errors
    );
    validatePositiveIntegerField(
      entry,
      "toDistrictId",
      `${path}.toDistrictId`,
      "DistrictId",
      errors
    );
    validatePositiveIntegerField(
      entry,
      "lengthInMapUnits",
      `${path}.lengthInMapUnits`,
      "Route lengthInMapUnits",
      errors
    );
  });
}

function validateSimpleDefinitionEntries(
  entries: readonly unknown[],
  path: string,
  entryLabel: string,
  idLabel: string,
  errors: WorldInvariantError[]
): void {
  entries.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!validateRecordEntry(entry, entryPath, entryLabel, errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "id", `${entryPath}.id`, idLabel, errors);
    validateDisplayNameKeyField(entry, `${entryPath}.displayNameKey`, entryLabel, errors);
  });
}

function validateRuntimeEntryShapes(
  state: WorldRuntimeStateV0,
  errors: WorldInvariantError[]
): void {
  validateSimpleRuntimeEntries(state.polities, "state.polities", "PolityState", "PolityId", errors);
  validateSimpleRuntimeEntries(state.routes, "state.routes", "RouteState", "RouteId", errors);

  state.persons.forEach((entry, index) => {
    const path = `state.persons[${index}]`;
    if (!validateRecordEntry(entry, path, "PersonState", errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "definitionId", `${path}.definitionId`, "PersonId", errors);
    const currentDistrictId = entry["currentDistrictId"];
    if (currentDistrictId !== undefined) {
      validatePositiveIntegerValue(
        currentDistrictId,
        `${path}.currentDistrictId`,
        "DistrictId",
        errors
      );
    }
  });

  state.districts.forEach((entry, index) => {
    const path = `state.districts[${index}]`;
    if (!validateRecordEntry(entry, path, "DistrictState", errors)) {
      return;
    }

    validatePositiveIntegerField(
      entry,
      "definitionId",
      `${path}.definitionId`,
      "DistrictId",
      errors
    );
    const control = entry["control"];
    if (!isRecord(control)) {
      errors.push({
        code: "invalid-schema",
        path: `${path}.control`,
        message: "DistrictState control must be an object."
      });
      return;
    }

    const controlKind = control["kind"];
    if (controlKind === "uncontrolled") {
      return;
    }

    if (controlKind !== "controlled") {
      errors.push({
        code: "invalid-schema",
        path: `${path}.control.kind`,
        message: "DistrictState control kind must be controlled or uncontrolled."
      });
      return;
    }

    validatePositiveIntegerField(
      control,
      "controllerPolityId",
      `${path}.control.controllerPolityId`,
      "PolityId",
      errors
    );
  });

  state.settlements.forEach((entry, index) => {
    const path = `state.settlements[${index}]`;
    if (!validateRecordEntry(entry, path, "SettlementState", errors)) {
      return;
    }

    validatePositiveIntegerField(
      entry,
      "definitionId",
      `${path}.definitionId`,
      "SettlementId",
      errors
    );
    validatePositiveIntegerField(
      entry,
      "currentDistrictId",
      `${path}.currentDistrictId`,
      "DistrictId",
      errors
    );
  });
}

function validateM2EntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (input === undefined) {
    return;
  }

  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2",
      message: "M2 economy population state must be an object."
    });
    return;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.schemaVersion",
      message: "M2 economy population schemaVersion must be 1."
    });
  }

  const populationGroups = input["populationGroups"];
  if (!Array.isArray(populationGroups)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.populationGroups",
      message: "M2 populationGroups must be an array."
    });
  } else {
    populationGroups.forEach((entry, index) =>
      validateM2PopulationGroupEntry(entry, `state.m2.populationGroups[${index}]`, errors)
    );
  }

  const agriculture = input["agriculture"];
  if (!isRecord(agriculture)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.agriculture",
      message: "M2 agriculture must be an object."
    });
  } else if (!Array.isArray(agriculture["districts"])) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.agriculture.districts",
      message: "M2 agriculture districts must be an array."
    });
  } else {
    agriculture["districts"].forEach((entry, index) =>
      validateM2AgricultureDistrictEntry(entry, `state.m2.agriculture.districts[${index}]`, errors)
    );
  }

  const market = input["market"];
  if (!isRecord(market)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.market",
      message: "M2 market must be an object."
    });
  } else if (!Array.isArray(market["districts"])) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.market.districts",
      message: "M2 market districts must be an array."
    });
  } else {
    market["districts"].forEach((entry, index) =>
      validateM2MarketDistrictEntry(entry, `state.m2.market.districts[${index}]`, errors)
    );
  }

  validateM2TransportEntryShapes(input["transport"], errors);
}

function validateM2TransportEntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.transport",
      message: "M2 transport must be an object."
    });
    return;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.transport.schemaVersion",
      message: "M2 transport schemaVersion must be 1."
    });
  }

  const routes = input["routes"];
  if (!Array.isArray(routes)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.transport.routes",
      message: "M2 transport routes must be an array."
    });
  } else {
    routes.forEach((entry, index) =>
      validateM2TransportRouteEntry(entry, `state.m2.transport.routes[${index}]`, errors)
    );
  }

  const districtSeasonality = input["districtSeasonality"];
  if (!Array.isArray(districtSeasonality)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.transport.districtSeasonality",
      message: "M2 transport districtSeasonality must be an array."
    });
  } else {
    districtSeasonality.forEach((entry, index) =>
      validateM2DistrictSeasonalityEntry(
        entry,
        `state.m2.transport.districtSeasonality[${index}]`,
        errors
      )
    );
  }

  const regionalCurves = input["regionalCurves"];
  if (!Array.isArray(regionalCurves)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m2.transport.regionalCurves",
      message: "M2 transport regionalCurves must be an array."
    });
  } else {
    regionalCurves.forEach((entry, index) =>
      validateM2RegionalSeasonalCurveEntry(
        entry,
        `state.m2.transport.regionalCurves[${index}]`,
        errors
      )
    );
  }
}

function validateM3EntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (input === undefined) {
    return;
  }

  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m3",
      message: "M3 polity vassalage state must be an object."
    });
    return;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m3.schemaVersion",
      message: "M3 polity vassalage schemaVersion must be 1."
    });
  }

  validateArrayField(input, "polities", "state.m3.polities", errors);
  validateArrayField(input, "obligations", "state.m3.obligations", errors);
  validateArrayField(input, "obligationAuditEvents", "state.m3.obligationAuditEvents", errors);
  validateArrayField(input, "fulfillmentClaims", "state.m3.fulfillmentClaims", errors);
  validateArrayField(input, "administrativeDistricts", "state.m3.administrativeDistricts", errors);
  validateArrayField(input, "characters", "state.m3.characters", errors);
  validateArrayField(input, "relationships", "state.m3.relationships", errors);
  validateArrayField(input, "offices", "state.m3.offices", errors);
  validateArrayField(input, "policies", "state.m3.policies", errors);
  validateArrayField(input, "enfeoffments", "state.m3.enfeoffments", errors);
  validateArrayField(input, "appointmentAuditEvents", "state.m3.appointmentAuditEvents", errors);
  validateArrayField(
    input,
    "successionCandidateProfiles",
    "state.m3.successionCandidateProfiles",
    errors
  );
  validateArrayField(input, "successionCrises", "state.m3.successionCrises", errors);

  const polities = input["polities"];
  if (Array.isArray(polities)) {
    polities.forEach((entry, index) =>
      validateM3PolityEntry(entry, `state.m3.polities[${index}]`, errors)
    );
  }

  const obligations = input["obligations"];
  if (Array.isArray(obligations)) {
    obligations.forEach((entry, index) =>
      validateM3ObligationEntry(entry, `state.m3.obligations[${index}]`, errors)
    );
  }

  const auditEvents = input["obligationAuditEvents"];
  if (Array.isArray(auditEvents)) {
    auditEvents.forEach((entry, index) =>
      validateM3AuditEventEntry(entry, `state.m3.obligationAuditEvents[${index}]`, errors)
    );
  }

  const fulfillmentClaims = input["fulfillmentClaims"];
  if (Array.isArray(fulfillmentClaims)) {
    fulfillmentClaims.forEach((entry, index) =>
      validateM3FulfillmentClaimEntry(entry, `state.m3.fulfillmentClaims[${index}]`, errors)
    );
  }

  const administrativeDistricts = input["administrativeDistricts"];
  if (Array.isArray(administrativeDistricts)) {
    administrativeDistricts.forEach((entry, index) =>
      validateM3AdministrativeDistrictEntry(
        entry,
        `state.m3.administrativeDistricts[${index}]`,
        errors
      )
    );
  }

  const characters = input["characters"];
  if (Array.isArray(characters)) {
    characters.forEach((entry, index) =>
      validateM3CharacterEntry(entry, `state.m3.characters[${index}]`, errors)
    );
  }

  const relationships = input["relationships"];
  if (Array.isArray(relationships)) {
    relationships.forEach((entry, index) =>
      validateM3RelationshipEntry(entry, `state.m3.relationships[${index}]`, errors)
    );
  }

  const offices = input["offices"];
  if (Array.isArray(offices)) {
    offices.forEach((entry, index) =>
      validateM3OfficeEntry(entry, `state.m3.offices[${index}]`, errors)
    );
  }

  const policies = input["policies"];
  if (Array.isArray(policies)) {
    policies.forEach((entry, index) =>
      validateM3PolicyEntry(entry, `state.m3.policies[${index}]`, errors)
    );
  }

  const enfeoffments = input["enfeoffments"];
  if (Array.isArray(enfeoffments)) {
    enfeoffments.forEach((entry, index) =>
      validateM3EnfeoffmentEntry(entry, `state.m3.enfeoffments[${index}]`, errors)
    );
  }

  const appointmentAuditEvents = input["appointmentAuditEvents"];
  if (Array.isArray(appointmentAuditEvents)) {
    appointmentAuditEvents.forEach((entry, index) =>
      validateM3AppointmentAuditEventEntry(
        entry,
        `state.m3.appointmentAuditEvents[${index}]`,
        errors
      )
    );
  }

  const successionCandidateProfiles = input["successionCandidateProfiles"];
  if (Array.isArray(successionCandidateProfiles)) {
    successionCandidateProfiles.forEach((entry, index) =>
      validateM3SuccessionCandidateProfileEntry(
        entry,
        `state.m3.successionCandidateProfiles[${index}]`,
        errors
      )
    );
  }

  const successionCrises = input["successionCrises"];
  if (Array.isArray(successionCrises)) {
    successionCrises.forEach((entry, index) =>
      validateM3SuccessionCrisisEntry(entry, `state.m3.successionCrises[${index}]`, errors)
    );
  }
}

function validateM4EntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (input === undefined) {
    return;
  }
  if (!isRecord(input) || input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m4",
      message: "M4 campaign state must be an object with schemaVersion 1."
    });
    return;
  }

  const campaignPlans = input["campaignPlans"];
  const factionKnowledgeSnapshots = input["factionKnowledgeSnapshots"];
  const mobilizedForceCommitments = input["mobilizedForceCommitments"];
  const grainSupplyReservations = input["grainSupplyReservations"];
  const marches = input["marches"];
  if (!Array.isArray(campaignPlans)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m4.campaignPlans",
      message: "state.m4.campaignPlans must be an array."
    });
  } else {
    campaignPlans.forEach((entry, index) =>
      validateM4CampaignPlanEntry(entry, `state.m4.campaignPlans[${index}]`, errors)
    );
  }
  if (!Array.isArray(factionKnowledgeSnapshots)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m4.factionKnowledgeSnapshots",
      message: "state.m4.factionKnowledgeSnapshots must be an array."
    });
  } else {
    factionKnowledgeSnapshots.forEach((entry, index) =>
      validateM4FactionKnowledgeSnapshotEntry(
        entry,
        `state.m4.factionKnowledgeSnapshots[${index}]`,
        errors
      )
    );
  }
  if (!Array.isArray(mobilizedForceCommitments)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m4.mobilizedForceCommitments",
      message: "state.m4.mobilizedForceCommitments must be an array."
    });
  } else {
    mobilizedForceCommitments.forEach((entry, index) =>
      validateM4MobilizedForceCommitmentEntry(
        entry,
        `state.m4.mobilizedForceCommitments[${index}]`,
        errors
      )
    );
  }
  if (!Array.isArray(grainSupplyReservations)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m4.grainSupplyReservations",
      message: "state.m4.grainSupplyReservations must be an array."
    });
  } else {
    grainSupplyReservations.forEach((entry, index) =>
      validateM4GrainSupplyReservationEntry(
        entry,
        `state.m4.grainSupplyReservations[${index}]`,
        errors
      )
    );
  }
  if (marches !== undefined) {
    validateM4Array(marches, "state.m4.marches", errors, validateM4CampaignMarchEntry);
  }
}

function validateM4CampaignPlanEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignPlanState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, "CampaignPlanId", errors);
  validateM4CampaignOwnerEntry(input["owner"], `${path}.owner`, errors);
  validateM4CampaignTargetEntry(input["target"], `${path}.target`, errors);
  validateM4ObjectiveKindValue(input["objectiveKind"], `${path}.objectiveKind`, errors);
  validateM4StartWindowEntry(input["startWindow"], `${path}.startWindow`, errors);
  validateM4CampaignStatusValue(input["status"], `${path}.status`, errors);
  validateNonEmptyStringField(input, "statusReasonCode", `${path}.statusReasonCode`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateNonnegativeIntegerField(input, "createdDay", `${path}.createdDay`, errors);
  validateNonnegativeIntegerField(input, "updatedDay", `${path}.updatedDay`, errors);
}

function validateM4FactionKnowledgeSnapshotEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4FactionKnowledgeSnapshotState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "snapshotId",
    `${path}.snapshotId`,
    "FactionKnowledgeSnapshotId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "observerPolityId",
    `${path}.observerPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "subjectPolityId",
    `${path}.subjectPolityId`,
    "PolityId",
    errors
  );
  validateNonnegativeIntegerField(input, "knowledgeVersion", `${path}.knowledgeVersion`, errors);
  validateNonnegativeIntegerField(input, "recordedDay", `${path}.recordedDay`, errors);
  validateM4FactionKnowledgeSourceEntry(input["source"], `${path}.source`, errors);
  validateM4Array(
    input["knownObjectives"],
    `${path}.knownObjectives`,
    errors,
    validateM4KnownObjectiveEntry
  );
  validateM4Array(
    input["routeEstimates"],
    `${path}.routeEstimates`,
    errors,
    validateM4RouteEstimateEntry
  );
  validateM4Array(
    input["supplyEstimates"],
    `${path}.supplyEstimates`,
    errors,
    validateM4SupplyEstimateEntry
  );
  validateM4Array(
    input["defenderEstimates"],
    `${path}.defenderEstimates`,
    errors,
    validateM4DefenderEstimateEntry
  );
}

function validateM4MobilizedForceCommitmentEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4MobilizedForceCommitmentState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, "MobilizedForceCommitmentId", errors);
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validateM4MusterCommitmentSourceEntry(input["source"], `${path}.source`, errors);
  validatePositiveIntegerField(input, "promisedTroops", `${path}.promisedTroops`, "Troops", errors);
  validateNonnegativeIntegerField(input, "dueDay", `${path}.dueDay`, errors);
  validateM4MusterAssemblyWindowEntry(input["assemblyWindow"], `${path}.assemblyWindow`, errors);
  validateNonnegativeIntegerField(
    input,
    "plannedAssemblyDay",
    `${path}.plannedAssemblyDay`,
    errors
  );
  validateNonnegativeIntegerField(input, "assembledTroops", `${path}.assembledTroops`, errors);
  validateNonnegativeIntegerField(input, "delayedTroops", `${path}.delayedTroops`, errors);
  validateNonnegativeIntegerField(input, "refusedTroops", `${path}.refusedTroops`, errors);
  validateNonnegativeIntegerField(input, "releasedTroops", `${path}.releasedTroops`, errors);
  validateM4MusterCommitmentStatusValue(input["status"], `${path}.status`, errors);
  validateNonEmptyStringField(input, "statusReasonCode", `${path}.statusReasonCode`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateM4Array(
    input["localCostHooks"],
    `${path}.localCostHooks`,
    errors,
    validateM4CostHookEntry
  );
}

function validateM4Array(
  input: unknown,
  path: string,
  errors: WorldInvariantError[],
  validateEntry: (entry: unknown, path: string, errors: WorldInvariantError[]) => void
): void {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return;
  }
  input.forEach((entry, index) => validateEntry(entry, `${path}[${index}]`, errors));
}

function validateM4GrainSupplyReservationEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4GrainSupplyReservationState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "reservationId",
    `${path}.reservationId`,
    "GrainSupplyReservationId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validateM4GrainSupplySourceEntry(input["source"], `${path}.source`, errors);
  validateNonnegativeIntegerField(input, "reservedAmount", `${path}.reservedAmount`, errors);
  validateNonnegativeIntegerField(input, "carriedAmount", `${path}.carriedAmount`, errors);
  validateNonnegativeIntegerField(input, "consumedAmount", `${path}.consumedAmount`, errors);
  validateNonnegativeIntegerField(input, "shortageAmount", `${path}.shortageAmount`, errors);
  validateNonnegativeIntegerField(input, "lossAmount", `${path}.lossAmount`, errors);
  if (input["lossReasonCode"] !== null) {
    validateNonEmptyStringField(input, "lossReasonCode", `${path}.lossReasonCode`, errors);
  }
  validatePositiveIntegerField(
    input,
    "expectedDailyConsumption",
    `${path}.expectedDailyConsumption`,
    "M4 expectedDailyConsumption",
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "expectedDaysOfSupply",
    `${path}.expectedDaysOfSupply`,
    errors
  );
  validateM4GrainSupplyReservationStatusValue(input["status"], `${path}.status`, errors);
  validateNonEmptyStringField(input, "statusReasonCode", `${path}.statusReasonCode`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM4GrainSupplySourceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4GrainSupplySource", errors)) {
    return;
  }
  validateStringUnionField(input, "kind", `${path}.kind`, ["m2-population-group"], errors);
  validatePositiveIntegerField(
    input,
    "populationGroupId",
    `${path}.populationGroupId`,
    "PopulationGroupId",
    errors
  );
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
}

function validateM4CampaignMarchEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignMarchState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "marchId", `${path}.marchId`, "CampaignMarchId", errors);
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "originDistrictId",
    `${path}.originDistrictId`,
    "DistrictId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "targetDistrictId",
    `${path}.targetDistrictId`,
    "DistrictId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "currentDistrictId",
    `${path}.currentDistrictId`,
    "DistrictId",
    errors
  );
  validateM4Array(
    input["routeSegments"],
    `${path}.routeSegments`,
    errors,
    validateM4MarchRouteSegmentEntry
  );
  validateNonnegativeIntegerField(
    input,
    "currentSegmentIndex",
    `${path}.currentSegmentIndex`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "progressOnSegmentDays",
    `${path}.progressOnSegmentDays`,
    errors
  );
  validateNonnegativeIntegerField(input, "activeTroops", `${path}.activeTroops`, errors);
  validatePositiveIntegerField(
    input,
    "grainPerTroopPerDay",
    `${path}.grainPerTroopPerDay`,
    "M4 grainPerTroopPerDay",
    errors
  );
  validateM4MarchSupplyEntry(input["supply"], `${path}.supply`, errors);
  validateM4CampaignMarchStatusValue(input["status"], `${path}.status`, errors);
  validateNonEmptyStringField(input, "statusReasonCode", `${path}.statusReasonCode`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateNonnegativeIntegerField(input, "startedDay", `${path}.startedDay`, errors);
  validateNonnegativeIntegerField(input, "updatedDay", `${path}.updatedDay`, errors);
  validateM4ArrivalWindowEntry(
    input["predictedArrivalWindow"],
    `${path}.predictedArrivalWindow`,
    errors
  );
  if (input["actualArrivalDay"] !== null) {
    validateNonnegativeIntegerField(input, "actualArrivalDay", `${path}.actualArrivalDay`, errors);
  }
  validatePositiveIntegerArrayField(
    input["joinedCommitmentIds"],
    `${path}.joinedCommitmentIds`,
    errors
  );
  validatePositiveIntegerArrayField(
    input["failedCommitmentIds"],
    `${path}.failedCommitmentIds`,
    errors
  );
  validateM4Array(
    input["joinedCommitmentTroops"],
    `${path}.joinedCommitmentTroops`,
    errors,
    validateM4MarchJoinedCommitmentTroopsEntry
  );
  validateUniqueNumberArrayField(
    input["joinedCommitmentIds"],
    `${path}.joinedCommitmentIds`,
    "M4 campaign march joinedCommitmentIds must not contain duplicates.",
    errors
  );
  validateUniqueNumberArrayField(
    input["failedCommitmentIds"],
    `${path}.failedCommitmentIds`,
    "M4 campaign march failedCommitmentIds must not contain duplicates.",
    errors
  );
}

function validateM4MarchJoinedCommitmentTroopsEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignMarchJoinedCommitmentTroopsState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "commitmentId",
    `${path}.commitmentId`,
    "MobilizedForceCommitmentId",
    errors
  );
  validateNonnegativeIntegerField(input, "joinedTroops", `${path}.joinedTroops`, errors);
}

function validateM4MarchRouteSegmentEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignMarchRouteSegmentState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "routeId", `${path}.routeId`, "RouteId", errors);
  validatePositiveIntegerField(
    input,
    "fromDistrictId",
    `${path}.fromDistrictId`,
    "DistrictId",
    errors
  );
  validatePositiveIntegerField(input, "toDistrictId", `${path}.toDistrictId`, "DistrictId", errors);
  validatePositiveIntegerField(input, "travelDays", `${path}.travelDays`, "M4 travelDays", errors);
  validateNonnegativeIntegerField(input, "capacity", `${path}.capacity`, errors);
  validateStringArrayField(input["seasonRiskReasonCodes"], `${path}.seasonRiskReasonCodes`, errors);
}

function validateM4MarchSupplyEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignMarchSupplyState", errors)) {
    return;
  }
  validateM4CampaignMarchSupplyStatusValue(input["status"], `${path}.status`, errors);
  validateNonnegativeIntegerField(input, "carriedGrain", `${path}.carriedGrain`, errors);
  validateNonnegativeIntegerField(input, "consumedGrain", `${path}.consumedGrain`, errors);
  validateNonnegativeIntegerField(input, "shortageGrain", `${path}.shortageGrain`, errors);
  validateNonnegativeIntegerField(input, "delayedDays", `${path}.delayedDays`, errors);
}

function validateM4ArrivalWindowEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignArrivalWindow", errors)) {
    return;
  }
  validateNonnegativeIntegerField(input, "earliestDay", `${path}.earliestDay`, errors);
  validateNonnegativeIntegerField(input, "latestDay", `${path}.latestDay`, errors);
}

function validateM4MusterCommitmentSourceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4MusterCommitmentSource", errors)) {
    return;
  }
  validateStringUnionField(input, "kind", `${path}.kind`, ["m3-obligation"], errors);
  validatePositiveIntegerField(
    input,
    "obligationId",
    `${path}.obligationId`,
    "M3ObligationId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "debtorPolityId",
    `${path}.debtorPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "creditorPolityId",
    `${path}.creditorPolityId`,
    "PolityId",
    errors
  );
}

function validateM4MusterAssemblyWindowEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4MusterAssemblyWindow", errors)) {
    return;
  }
  validateNonnegativeIntegerField(input, "earliestDay", `${path}.earliestDay`, errors);
  validateNonnegativeIntegerField(input, "latestDay", `${path}.latestDay`, errors);
}

function validateM4MusterCommitmentStatusValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    input === "promised" ||
    input === "assembled" ||
    input === "delayed" ||
    input === "refused" ||
    input === "released"
  ) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 muster commitment status is invalid."
  });
}

function validateM4GrainSupplyReservationStatusValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    input === "reserved" ||
    input === "partially-consumed" ||
    input === "shortage" ||
    input === "consumed" ||
    input === "released"
  ) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 grain supply reservation status is invalid."
  });
}

function validateM4CampaignMarchStatusValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    input === "planned" ||
    input === "marching" ||
    input === "paused" ||
    input === "delayed" ||
    input === "cancelled" ||
    input === "arrived"
  ) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 campaign march status is invalid."
  });
}

function validateM4CampaignMarchSupplyStatusValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    input === "well-supplied" ||
    input === "strained" ||
    input === "hungry" ||
    input === "out-of-supply"
  ) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 campaign march supply status is invalid."
  });
}

function validateM4CostHookEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4MusterLocalCostHook", errors)) {
    return;
  }
  if (input["kind"] === "economic-labor-reservation") {
    validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
    validateNonnegativeIntegerField(input, "laborAmount", `${path}.laborAmount`, errors);
    validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
    return;
  }
  if (input["kind"] === "loyalty-pressure") {
    validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
    validateIntegerFieldInRange(input, "pressureBps", `${path}.pressureBps`, 0, 10_000, errors);
    validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message:
      "M4 muster local cost hook kind must be economic-labor-reservation or loyalty-pressure."
  });
}

function validateM4KnownObjectiveEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4KnownObjectiveEstimate", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validateM4CampaignTargetEntry(input["target"], `${path}.target`, errors);
  validateM4ObjectiveKindValue(input["objectiveKind"], `${path}.objectiveKind`, errors);
  validateIntegerFieldInRange(input, "confidenceBps", `${path}.confidenceBps`, 0, 10_000, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM4RouteEstimateEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4RouteEstimate", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "routeId", `${path}.routeId`, "RouteId", errors);
  validatePositiveIntegerField(
    input,
    "fromDistrictId",
    `${path}.fromDistrictId`,
    "DistrictId",
    errors
  );
  validatePositiveIntegerField(input, "toDistrictId", `${path}.toDistrictId`, "DistrictId", errors);
  validatePositiveIntegerField(
    input,
    "travelCostEstimate",
    `${path}.travelCostEstimate`,
    "M4 travelCostEstimate",
    errors
  );
  validateNonnegativeIntegerField(input, "capacityEstimate", `${path}.capacityEstimate`, errors);
  validateIntegerFieldInRange(input, "confidenceBps", `${path}.confidenceBps`, 0, 10_000, errors);
}

function validateM4SupplyEstimateEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4SupplyEstimate", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateNonnegativeIntegerField(input, "supplyMin", `${path}.supplyMin`, errors);
  validateNonnegativeIntegerField(input, "supplyMax", `${path}.supplyMax`, errors);
  validateIntegerFieldInRange(input, "confidenceBps", `${path}.confidenceBps`, 0, 10_000, errors);
}

function validateM4DefenderEstimateEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4DefenderEstimate", errors)) {
    return;
  }
  validateM4CampaignTargetEntry(input["target"], `${path}.target`, errors);
  validateNonnegativeIntegerField(input, "defenderMin", `${path}.defenderMin`, errors);
  validateNonnegativeIntegerField(input, "defenderMax", `${path}.defenderMax`, errors);
  validateIntegerFieldInRange(input, "confidenceBps", `${path}.confidenceBps`, 0, 10_000, errors);
}

function validateM4CampaignOwnerEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignOwner", errors)) {
    return;
  }
  if (input["kind"] === "commander") {
    validatePositiveIntegerField(input, "characterId", `${path}.characterId`, "PersonId", errors);
    return;
  }
  if (input["kind"] === "polity") {
    validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
    return;
  }
  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message: "M4 campaign owner kind must be commander or polity."
  });
}

function validateM4CampaignTargetEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignTarget", errors)) {
    return;
  }
  if (input["kind"] === "district") {
    validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
    return;
  }
  if (input["kind"] === "polity") {
    validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
    return;
  }
  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message: "M4 campaign target kind must be district or polity."
  });
}

function validateM4StartWindowEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignStartWindow", errors)) {
    return;
  }
  validateNonnegativeIntegerField(input, "earliestDay", `${path}.earliestDay`, errors);
  validateNonnegativeIntegerField(input, "latestDay", `${path}.latestDay`, errors);
}

function validateM4FactionKnowledgeSourceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4FactionKnowledgeSource", errors)) {
    return;
  }
  const kind = input["kind"];
  if (kind !== "scout" && kind !== "merchant" && kind !== "envoy" && kind !== "report") {
    errors.push({
      code: "invalid-schema",
      path: `${path}.kind`,
      message: "M4 knowledge source kind must be scout, merchant, envoy, or report."
    });
  }
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateIntegerFieldInRange(input, "reliabilityBps", `${path}.reliabilityBps`, 0, 10_000, errors);
}

function validateM4ObjectiveKindValue(
  value: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    value === "prepare" ||
    value === "march" ||
    value === "besiege" ||
    value === "relieve" ||
    value === "withdraw" ||
    value === "postwar-result-candidate"
  ) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 objectiveKind is invalid."
  });
}

function validateM4CampaignStatusValue(
  value: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (value === "planned" || value === "active" || value === "cancelled" || value === "completed") {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 campaign status is invalid."
  });
}

function validateM3PolityEntry(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!validateRecordEntry(input, path, "M3PolityRecordState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  const suzerainId = input["directSuzerainPolityId"];
  if (suzerainId !== null) {
    validatePositiveIntegerValue(suzerainId, `${path}.directSuzerainPolityId`, "PolityId", errors);
  }
}

function validateM3ObligationEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3ObligationState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, "M3ObligationId", errors);
  validatePositiveIntegerField(
    input,
    "debtorPolityId",
    `${path}.debtorPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "creditorPolityId",
    `${path}.creditorPolityId`,
    "PolityId",
    errors
  );
  validateStringUnionField(
    input,
    "obligationKind",
    `${path}.obligationKind`,
    ["tribute", "troop"],
    errors
  );
  validateStringUnionField(
    input,
    "obligationCategory",
    `${path}.obligationCategory`,
    [
      "regular-tribute",
      "extraordinary-levy",
      "troop-obligation",
      "defensive-garrison",
      "specific-war-aid"
    ],
    errors
  );
  validateM3ObligationSourceEntry(input["obligationSource"], `${path}.obligationSource`, errors);
  validateM3RequirementEntry(input["requirement"], `${path}.requirement`, errors);
  validateM3DueEntry(input["due"], `${path}.due`, errors);
  validateM3ObligationAccountingEntry(input["accounting"], `${path}.accounting`, errors);
  validateStringUnionField(
    input,
    "status",
    `${path}.status`,
    ["active", "disputed", "breached"],
    errors
  );
  validateNullableStringField(input, "disputeReasonCode", `${path}.disputeReasonCode`, errors);
  validateNullableStringField(input, "breachReasonCode", `${path}.breachReasonCode`, errors);
  validatePositiveIntegerField(
    input,
    "createdAuditEventId",
    `${path}.createdAuditEventId`,
    "M3ObligationAuditEventId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "latestAuditEventId",
    `${path}.latestAuditEventId`,
    "M3ObligationAuditEventId",
    errors
  );
}

function validateM3ObligationSourceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 obligationSource must be an object."
    });
    return;
  }
  validateStringUnionField(input, "kind", `${path}.kind`, ["vassalage"], errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validatePositiveIntegerField(
    input,
    "debtorPolityId",
    `${path}.debtorPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "creditorPolityId",
    `${path}.creditorPolityId`,
    "PolityId",
    errors
  );
}

function validateM3ObligationAccountingEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 obligation accounting must be an object."
    });
    return;
  }
  validateNonnegativeIntegerField(input, "nominalAmount", `${path}.nominalAmount`, errors);
  validateNonnegativeIntegerField(input, "dueAmount", `${path}.dueAmount`, errors);
  validateNonnegativeIntegerField(input, "deliveredAmount", `${path}.deliveredAmount`, errors);
  validateNonnegativeIntegerField(input, "arrearsAmount", `${path}.arrearsAmount`, errors);
  validateNonnegativeIntegerField(input, "defaultedAmount", `${path}.defaultedAmount`, errors);
  validateNonnegativeIntegerField(input, "remittedAmount", `${path}.remittedAmount`, errors);
  validateNonnegativeIntegerField(input, "dueDay", `${path}.dueDay`, errors);
  validatePositiveIntegerField(input, "cycle", `${path}.cycle`, "M3 obligation cycle", errors);
  validateStringUnionField(
    input,
    "troopResponseState",
    `${path}.troopResponseState`,
    ["none", "committed", "deferred", "refused", "remitted", "recovery-pursued", "breached"],
    errors
  );
}

function validateM3RequirementEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 requirement must be an object." });
    return;
  }
  if (input["kind"] === "amount") {
    validateStringUnionField(
      input,
      "resourceKind",
      `${path}.resourceKind`,
      ["cash", "grain", "troops"],
      errors
    );
    validatePositiveIntegerField(input, "amount", `${path}.amount`, "M3 amount", errors);
    return;
  }
  if (input["kind"] === "condition") {
    validateNonEmptyStringField(input, "conditionKey", `${path}.conditionKey`, errors);
    return;
  }
  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message: "M3 requirement kind must be amount or condition."
  });
}

function validateM3DueEntry(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 due must be an object." });
    return;
  }
  if (input["kind"] === "cadence") {
    validatePositiveIntegerField(
      input,
      "periodDays",
      `${path}.periodDays`,
      "M3 periodDays",
      errors
    );
    validateNonnegativeIntegerField(input, "nextDueDay", `${path}.nextDueDay`, errors);
    return;
  }
  if (input["kind"] === "trigger") {
    validateNonEmptyStringField(input, "triggerKey", `${path}.triggerKey`, errors);
    return;
  }
  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message: "M3 due kind must be cadence or trigger."
  });
}

function validateM3AuditEventEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3ObligationAuditEventState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, "M3ObligationAuditEventId", errors);
  validatePositiveIntegerField(
    input,
    "obligationId",
    `${path}.obligationId`,
    "M3ObligationId",
    errors
  );
  validateStringUnionField(
    input,
    "eventKind",
    `${path}.eventKind`,
    ["created", "settled", "status-changed"],
    errors
  );
  validateNonnegativeIntegerField(input, "eventDay", `${path}.eventDay`, errors);
  validateNonnegativeIntegerField(input, "eventRevision", `${path}.eventRevision`, errors);
  validateNonEmptyStringField(input, "commandId", `${path}.commandId`, errors);
  if (!isRecord(input["actor"])) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.actor`,
      message: "M3 audit actor must be an object."
    });
  } else {
    validateStringUnionField(
      input["actor"],
      "kind",
      `${path}.actor.kind`,
      ["ai", "player", "system"],
      errors
    );
    validateNonEmptyStringField(input["actor"], "id", `${path}.actor.id`, errors);
  }
  const fulfillmentId = input["fulfillmentId"];
  if (fulfillmentId !== null) {
    validatePositiveIntegerValue(fulfillmentId, `${path}.fulfillmentId`, "M3FulfillmentId", errors);
  }
  const actionKind = input["actionKind"];
  if (actionKind !== null) {
    validateM3SettlementActionValue(actionKind, `${path}.actionKind`, errors);
  }
  const fulfilledAmount = input["fulfilledAmount"];
  if (fulfilledAmount !== null) {
    validateNonnegativeIntegerValue(
      fulfilledAmount,
      `${path}.fulfilledAmount`,
      "M3 fulfilledAmount",
      errors
    );
  }
  const dueDay = input["dueDay"];
  if (dueDay !== null) {
    validateNonnegativeIntegerValue(dueDay, `${path}.dueDay`, "M3 dueDay", errors);
  }
  validateStringUnionField(
    input,
    "statusAfter",
    `${path}.statusAfter`,
    ["active", "disputed", "breached"],
    errors
  );
  validateNullableStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateIntegerFieldInRange(input, "reliabilityBps", `${path}.reliabilityBps`, 0, 10_000, errors);
}

function validateM3FulfillmentClaimEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3FulfillmentClaimState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "fulfillmentId",
    `${path}.fulfillmentId`,
    "M3FulfillmentId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "obligationId",
    `${path}.obligationId`,
    "M3ObligationId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "auditEventId",
    `${path}.auditEventId`,
    "M3ObligationAuditEventId",
    errors
  );
  validateM3SettlementActionValue(input["actionKind"], `${path}.actionKind`, errors);
  validateNonnegativeIntegerField(input, "fulfilledAmount", `${path}.fulfilledAmount`, errors);
  validateNonnegativeIntegerField(input, "deliveredAmount", `${path}.deliveredAmount`, errors);
  validateNonnegativeIntegerField(input, "arrearsAmount", `${path}.arrearsAmount`, errors);
  validateNonnegativeIntegerField(input, "defaultedAmount", `${path}.defaultedAmount`, errors);
  validateNonnegativeIntegerField(input, "dueDay", `${path}.dueDay`, errors);
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  validateM3FulfillmentSourceMovementsEntry(
    input["sourceMovements"],
    `${path}.sourceMovements`,
    errors
  );
}

function validateM3SettlementActionValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    input === "fulfillment" ||
    input === "partial-fulfillment" ||
    input === "deferral" ||
    input === "refusal" ||
    input === "remission" ||
    input === "pursuit-recovery" ||
    input === "default-breach"
  ) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message:
      "M3 settlement action must be fulfillment, partial-fulfillment, deferral, refusal, remission, pursuit-recovery, or default-breach."
  });
}

function validateStringArrayField(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return;
  }
  input.forEach((value, index) => {
    if (typeof value !== "string" || value.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `${path}[${index}]`,
        message: `${path}[${index}] must be a non-empty string.`
      });
    }
  });
}

function validatePositiveIntegerArrayField(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return;
  }
  input.forEach((value, index) => {
    if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
      errors.push({
        code: "invalid-schema",
        path: `${path}[${index}]`,
        message: `${path}[${index}] must be a positive safe integer.`
      });
    }
  });
}

function validateUniqueNumberArray(
  input: readonly number[],
  path: string,
  message: string,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<number>();
  for (const value of input) {
    if (seen.has(value)) {
      errors.push({
        code: "invalid-schema",
        path,
        message
      });
      return;
    }
    seen.add(value);
  }
}

function validateUniqueNumberArrayField(
  input: unknown,
  path: string,
  message: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input)) {
    return;
  }
  const values = input.filter((value): value is number => typeof value === "number");
  validateUniqueNumberArray(values, path, message, errors);
}

function validateM3FulfillmentSourceMovementsEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return;
  }
  input.forEach((movement, index) => {
    const movementPath = `${path}[${index}]`;
    if (!isRecord(movement)) {
      errors.push({
        code: "invalid-schema",
        path: movementPath,
        message: "M3 fulfillment source movement must be an object."
      });
      return;
    }
    if (movement["kind"] === "m2-population-group") {
      validatePositiveIntegerField(
        movement,
        "populationGroupId",
        `${movementPath}.populationGroupId`,
        "PopulationGroupId",
        errors
      );
      validatePositiveIntegerField(
        movement,
        "districtId",
        `${movementPath}.districtId`,
        "DistrictId",
        errors
      );
      validateStringUnionField(
        movement,
        "resourceKind",
        `${movementPath}.resourceKind`,
        ["cash", "grain"],
        errors
      );
      validatePositiveIntegerField(
        movement,
        "amount",
        `${movementPath}.amount`,
        "M3 amount",
        errors
      );
      return;
    }
    if (movement["kind"] === "m3-troop-commitment-placeholder") {
      validatePositiveIntegerField(
        movement,
        "debtorPolityId",
        `${movementPath}.debtorPolityId`,
        "PolityId",
        errors
      );
      validatePositiveIntegerField(
        movement,
        "headcount",
        `${movementPath}.headcount`,
        "M3 troop headcount",
        errors
      );
      return;
    }
    errors.push({
      code: "invalid-schema",
      path: `${movementPath}.kind`,
      message: "M3 fulfillment source movement kind is not supported."
    });
  });
}

function validateM3AdministrativeDistrictEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3AdministrativeDistrictState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateStringUnionField(
    input,
    "controlMode",
    `${path}.controlMode`,
    M3_ADMINISTRATIVE_CONTROL_MODES,
    errors
  );
  validateNonnegativeIntegerField(input, "localComplexity", `${path}.localComplexity`, errors);
  validateNonnegativeIntegerField(input, "communicationCost", `${path}.communicationCost`, errors);
  validateNonnegativeIntegerField(input, "directness", `${path}.directness`, errors);
  validateNonnegativeIntegerField(input, "frontierPressure", `${path}.frontierPressure`, errors);
  validatePositiveIntegerField(
    input,
    "administrativeCapacity",
    `${path}.administrativeCapacity`,
    "M3 administrativeCapacity",
    errors
  );
}

function validateM3CharacterEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3CharacterState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "characterId", `${path}.characterId`, "PersonId", errors);
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateBooleanField(input, "alive", `${path}.alive`, errors);
  validateBooleanField(input, "incapacitated", `${path}.incapacitated`, errors);
  validatePositiveIntegerField(
    input,
    "currentDistrictId",
    `${path}.currentDistrictId`,
    "DistrictId",
    errors
  );
  validateIntegerFieldInRange(input, "commandBps", `${path}.commandBps`, 0, 10_000, errors);
  validateIntegerFieldInRange(
    input,
    "administrationBps",
    `${path}.administrationBps`,
    0,
    10_000,
    errors
  );
  validateIntegerFieldInRange(input, "diplomacyBps", `${path}.diplomacyBps`, 0, 10_000, errors);
}

function validateM3RelationshipEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3CharacterRelationshipState", errors)) {
    return;
  }

  validatePositiveIntegerField(
    input,
    "sourceCharacterId",
    `${path}.sourceCharacterId`,
    "PersonId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "targetCharacterId",
    `${path}.targetCharacterId`,
    "PersonId",
    errors
  );
  validateIntegerFieldInRange(input, "affinityBps", `${path}.affinityBps`, -10_000, 10_000, errors);
}

function validateM3OfficeEntry(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!validateRecordEntry(input, path, "M3OfficeState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "officeId", `${path}.officeId`, "M3OfficeId", errors);
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateM3OfficeJurisdictionEntry(input["jurisdiction"], `${path}.jurisdiction`, errors);
  validateStringUnionField(input, "officeKind", `${path}.officeKind`, M3_OFFICE_KINDS, errors);
  validateBooleanField(input, "primary", `${path}.primary`, errors);
  validateNullablePositiveIntegerField(
    input,
    "holderCharacterId",
    `${path}.holderCharacterId`,
    "PersonId",
    errors
  );
  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, "M3PolicyId", errors);
  validateIntegerFieldInRange(
    input,
    "minimumCommandBps",
    `${path}.minimumCommandBps`,
    0,
    10_000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "minimumAdministrationBps",
    `${path}.minimumAdministrationBps`,
    0,
    10_000,
    errors
  );
}

function validateM3OfficeJurisdictionEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 office jurisdiction must be an object."
    });
    return;
  }

  validateStringUnionField(input, "kind", `${path}.kind`, ["polity", "district"], errors);
  if (input["kind"] === "polity") {
    validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  }
  if (input["kind"] === "district") {
    validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  }
}

function validateM3PolicyEntry(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!validateRecordEntry(input, path, "M3PolicyState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, "M3PolicyId", errors);
  validateM3PolicyTargetEntry(input["target"], `${path}.target`, errors);
  validateStringUnionField(input, "stance", `${path}.stance`, M3_POLICY_STANCES, errors);
  validateIntegerFieldInRange(input, "intensityBps", `${path}.intensityBps`, 0, 10_000, errors);
}

function validateM3PolicyTargetEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 policy target must be an object."
    });
    return;
  }

  validateStringUnionField(input, "kind", `${path}.kind`, ["office", "polity", "district"], errors);
  if (input["kind"] === "office") {
    validatePositiveIntegerField(input, "officeId", `${path}.officeId`, "M3OfficeId", errors);
  }
  if (input["kind"] === "polity") {
    validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  }
  if (input["kind"] === "district") {
    validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  }
}

function validateM3EnfeoffmentEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3EnfeoffmentState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validatePositiveIntegerField(
    input,
    "holderCharacterId",
    `${path}.holderCharacterId`,
    "PersonId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "grantedByPolityId",
    `${path}.grantedByPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, "M3PolicyId", errors);
  validateNonnegativeIntegerField(input, "grantedDay", `${path}.grantedDay`, errors);
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM3AppointmentAuditEventEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3AppointmentAuditEventState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, "M3AppointmentAuditEventId", errors);
  validateStringUnionField(
    input,
    "eventKind",
    `${path}.eventKind`,
    M3_APPOINTMENT_AUDIT_EVENT_KINDS,
    errors
  );
  validateNonnegativeIntegerField(input, "eventDay", `${path}.eventDay`, errors);
  validateNonnegativeIntegerField(input, "eventRevision", `${path}.eventRevision`, errors);
  validateNonEmptyStringField(input, "commandId", `${path}.commandId`, errors);
  validateM3ActorEntry(input["actor"], `${path}.actor`, errors);
  validateNullablePositiveIntegerField(input, "officeId", `${path}.officeId`, "M3OfficeId", errors);
  validateNullablePositiveIntegerField(
    input,
    "characterId",
    `${path}.characterId`,
    "PersonId",
    errors
  );
  validateNullablePositiveIntegerField(input, "policyId", `${path}.policyId`, "M3PolicyId", errors);
  validateNullablePositiveIntegerField(
    input,
    "districtId",
    `${path}.districtId`,
    "DistrictId",
    errors
  );
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM3SuccessionCandidateProfileEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3SuccessionCandidateProfileState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validatePositiveIntegerField(input, "characterId", `${path}.characterId`, "PersonId", errors);
  validateBooleanField(input, "requiresRegency", `${path}.requiresRegency`, errors);
  validateM3SuccessionSupportSourceArray(input["supportSources"], `${path}.supportSources`, errors);
}

function validateM3SuccessionCrisisEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3SuccessionCrisisState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, "M3SuccessionId", errors);
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateM3SuccessionTriggerEntry(input["trigger"], `${path}.trigger`, errors);
  validateStringUnionField(input, "status", `${path}.status`, ["pending", "resolved"], errors);
  validateNonnegativeIntegerField(input, "startedDay", `${path}.startedDay`, errors);
  validateNullableNonnegativeIntegerField(input, "resolvedDay", `${path}.resolvedDay`, errors);

  const candidates = input["candidates"];
  if (!Array.isArray(candidates)) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.candidates`,
      message: `${path}.candidates must be an array.`
    });
  } else {
    candidates.forEach((candidate, index) =>
      validateM3SuccessionCandidateEntry(candidate, `${path}.candidates[${index}]`, errors)
    );
  }

  validateM3SuccessionOutcomeEntry(input["outcome"], `${path}.outcome`, errors);
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM3SuccessionCandidateEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3SuccessionCandidateState", errors)) {
    return;
  }

  validatePositiveIntegerField(input, "characterId", `${path}.characterId`, "PersonId", errors);
  validateBooleanField(input, "requiresRegency", `${path}.requiresRegency`, errors);
  validateM3SuccessionSupportSourceArray(input["supportSources"], `${path}.supportSources`, errors);
  validateIntegerFieldInRange(
    input,
    "supportTotalBps",
    `${path}.supportTotalBps`,
    0,
    10_000,
    errors
  );
}

function validateM3SuccessionSupportSourceArray(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: `${path} must be an array.`
    });
    return;
  }

  input.forEach((source, index) =>
    validateM3SuccessionSupportSourceEntry(source, `${path}[${index}]`, errors)
  );
}

function validateM3SuccessionSupportSourceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M3SuccessionSupportSourceState", errors)) {
    return;
  }

  validateStringUnionField(input, "kind", `${path}.kind`, M3_SUCCESSION_SUPPORT_KINDS, errors);
  validateIntegerFieldInRange(input, "strengthBps", `${path}.strengthBps`, 0, 10_000, errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
}

function validateM3SuccessionTriggerEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 succession trigger must be an object."
    });
    return;
  }

  validateStringUnionField(input, "kind", `${path}.kind`, ["death", "incapacity"], errors);
  validatePositiveIntegerField(input, "characterId", `${path}.characterId`, "PersonId", errors);
  validateNullablePositiveIntegerField(input, "officeId", `${path}.officeId`, "M3OfficeId", errors);
}

function validateM3SuccessionOutcomeEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (input === null) {
    return;
  }
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 succession outcome must be null or an object."
    });
    return;
  }

  validateStringUnionField(
    input,
    "kind",
    `${path}.kind`,
    ["peaceful", "regency", "disputed"],
    errors
  );
  if (input["kind"] === "peaceful") {
    validatePositiveIntegerField(
      input,
      "successorCharacterId",
      `${path}.successorCharacterId`,
      "PersonId",
      errors
    );
    validateIntegerFieldInRange(
      input,
      "supportTotalBps",
      `${path}.supportTotalBps`,
      0,
      10_000,
      errors
    );
  }
  if (input["kind"] === "regency") {
    validatePositiveIntegerField(
      input,
      "successorCharacterId",
      `${path}.successorCharacterId`,
      "PersonId",
      errors
    );
    validatePositiveIntegerField(
      input,
      "regentCharacterId",
      `${path}.regentCharacterId`,
      "PersonId",
      errors
    );
    validateIntegerFieldInRange(
      input,
      "supportTotalBps",
      `${path}.supportTotalBps`,
      0,
      10_000,
      errors
    );
    validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  }
  if (input["kind"] === "disputed") {
    validatePositiveIntegerField(
      input,
      "leadingCharacterId",
      `${path}.leadingCharacterId`,
      "PersonId",
      errors
    );
    validatePositiveIntegerField(
      input,
      "rivalCharacterId",
      `${path}.rivalCharacterId`,
      "PersonId",
      errors
    );
    validateIntegerFieldInRange(
      input,
      "supportMarginBps",
      `${path}.supportMarginBps`,
      0,
      10_000,
      errors
    );
    validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  }
}

function validateM3ActorEntry(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 audit actor must be an object."
    });
    return;
  }

  validateStringUnionField(input, "kind", `${path}.kind`, ["ai", "player", "system"], errors);
  validateNonEmptyStringField(input, "id", `${path}.id`, errors);
}

function validateM2PopulationGroupEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2PopulationGroupState", errors)) {
    return;
  }

  validatePositiveIntegerField(entry, "id", `${path}.id`, "PopulationGroupId", errors);
  validatePositiveIntegerField(entry, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateNonnegativeIntegerField(entry, "totalPeople", `${path}.totalPeople`, errors);
  validateNonnegativeIntegerField(entry, "workingPeople", `${path}.workingPeople`, errors);
  validateNonnegativeIntegerField(entry, "dependentPeople", `${path}.dependentPeople`, errors);
  validateNonnegativeIntegerField(entry, "availableLabor", `${path}.availableLabor`, errors);
  validateNonnegativeIntegerField(entry, "grainStock", `${path}.grainStock`, errors);
  validateNonnegativeIntegerField(entry, "cashStock", `${path}.cashStock`, errors);

  const committedLabor = entry["committedLabor"];
  if (!Array.isArray(committedLabor)) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.committedLabor`,
      message: "M2 committedLabor must be an array."
    });
    return;
  }

  committedLabor.forEach((commitment, index) =>
    validateM2LaborCommitmentEntry(commitment, `${path}.committedLabor[${index}]`, errors)
  );
}

function validateM2LaborCommitmentEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2LaborCommitmentState", errors)) {
    return;
  }

  if (entry["purpose"] !== "mobilized") {
    errors.push({
      code: "invalid-schema",
      path: `${path}.purpose`,
      message: "M2 labor commitment purpose must be mobilized."
    });
  }
  validatePositiveIntegerField(entry, "laborAmount", `${path}.laborAmount`, "Labor", errors);
  validateNonnegativeIntegerField(entry, "startDay", `${path}.startDay`, errors);
  validateNonnegativeIntegerField(entry, "releaseDay", `${path}.releaseDay`, errors);
}

function validateM2AgricultureDistrictEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2DistrictAgricultureState", errors)) {
    return;
  }

  validatePositiveIntegerField(entry, "districtId", `${path}.districtId`, "DistrictId", errors);
  const phase = entry["phase"];
  if (phase !== "fallow" && phase !== "planting" && phase !== "growing" && phase !== "harvest") {
    errors.push({
      code: "invalid-schema",
      path: `${path}.phase`,
      message: "M2 agriculture phase must be fallow, planting, growing, or harvest."
    });
  }
  validateNonnegativeIntegerField(entry, "daysInPhase", `${path}.daysInPhase`, errors);
  validateNonnegativeIntegerField(
    entry,
    "accumulatedFarmLabor",
    `${path}.accumulatedFarmLabor`,
    errors
  );
  validateNonnegativeIntegerField(
    entry,
    "expectedHarvestGrain",
    `${path}.expectedHarvestGrain`,
    errors
  );
  validateNonnegativeIntegerField(entry, "lastHarvestGrain", `${path}.lastHarvestGrain`, errors);
}

function validateM2MarketDistrictEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2DistrictMarketState", errors)) {
    return;
  }

  validatePositiveIntegerField(entry, "districtId", `${path}.districtId`, "DistrictId", errors);
  validatePositiveIntegerField(
    entry,
    "grainPriceCashPerHundred",
    `${path}.grainPriceCashPerHundred`,
    "Grain price",
    errors
  );
  const cashFlow = entry["cashFlow"];
  if (!isRecord(cashFlow)) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.cashFlow`,
      message: "M2 market cashFlow must be an object."
    });
  } else {
    validateNonnegativeIntegerField(
      cashFlow,
      "cumulativeMobilizationCost",
      `${path}.cashFlow.cumulativeMobilizationCost`,
      errors
    );
    validateNonnegativeIntegerField(
      cashFlow,
      "lastDailyCashDelta",
      `${path}.cashFlow.lastDailyCashDelta`,
      errors
    );
  }

  const grainFlow = entry["grainFlow"];
  if (!isRecord(grainFlow)) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.grainFlow`,
      message: "M2 market grainFlow must be an object."
    });
  } else {
    validateNonnegativeIntegerField(
      grainFlow,
      "lastHarvestDelta",
      `${path}.grainFlow.lastHarvestDelta`,
      errors
    );
  }
}

function validateM2TransportRouteEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2RouteTransportEdgeState", errors)) {
    return;
  }

  validatePositiveIntegerField(entry, "routeId", `${path}.routeId`, "RouteId", errors);
  validatePositiveIntegerField(
    entry,
    "fromDistrictId",
    `${path}.fromDistrictId`,
    "DistrictId",
    errors
  );
  validatePositiveIntegerField(entry, "toDistrictId", `${path}.toDistrictId`, "DistrictId", errors);
  const routeKind = entry["routeKind"];
  if (routeKind !== "coast" && routeKind !== "river" && routeKind !== "road") {
    errors.push({
      code: "invalid-schema",
      path: `${path}.routeKind`,
      message: "M2 routeKind must be coast, river, or road."
    });
  }
  validatePositiveIntegerField(
    entry,
    "baseTravelCost",
    `${path}.baseTravelCost`,
    "Base travel cost",
    errors
  );
  validatePositiveIntegerField(entry, "baseCapacity", `${path}.baseCapacity`, "Capacity", errors);
}

function validateM2DistrictSeasonalityEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2DistrictSeasonalityState", errors)) {
    return;
  }

  validatePositiveIntegerField(entry, "districtId", `${path}.districtId`, "DistrictId", errors);
  validatePositiveIntegerField(
    entry,
    "regionalCurveId",
    `${path}.regionalCurveId`,
    "RegionalSeasonalCurveId",
    errors
  );
}

function validateM2RegionalSeasonalCurveEntry(
  entry: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2RegionalSeasonalCurveState", errors)) {
    return;
  }

  validatePositiveIntegerField(entry, "id", `${path}.id`, "RegionalSeasonalCurveId", errors);
  const monthlyValues = entry["monthlyValues"];
  if (!Array.isArray(monthlyValues) || monthlyValues.length !== 12) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.monthlyValues`,
      message: "M2 regional seasonal curve monthlyValues must contain 12 months."
    });
    return;
  }

  monthlyValues.forEach((month, index) =>
    validateM2SeasonalMonthEntry(month, `${path}.monthlyValues[${index}]`, index + 1, errors)
  );
}

function validateM2SeasonalMonthEntry(
  entry: unknown,
  path: string,
  expectedMonth: number,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(entry, path, "M2SeasonalMonthState", errors)) {
    return;
  }

  if (entry["month"] !== expectedMonth) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.month`,
      message: "M2 seasonal month entries must be ordered from month 1 through month 12."
    });
  }
  validateIntegerFieldInRange(
    entry,
    "monsoonIntensityBps",
    `${path}.monsoonIntensityBps`,
    0,
    10_000,
    errors
  );
  validateIntegerFieldInRange(
    entry,
    "agricultureWorkBps",
    `${path}.agricultureWorkBps`,
    0,
    10_000,
    errors
  );
  validateIntegerFieldInRange(
    entry,
    "riverNavigabilityBps",
    `${path}.riverNavigabilityBps`,
    0,
    10_000,
    errors
  );
  validateIntegerFieldInRange(
    entry,
    "roadTravelCostBps",
    `${path}.roadTravelCostBps`,
    1,
    30_000,
    errors
  );
}

function validateSimpleRuntimeEntries(
  entries: readonly unknown[],
  path: string,
  entryLabel: string,
  idLabel: string,
  errors: WorldInvariantError[]
): void {
  entries.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!validateRecordEntry(entry, entryPath, entryLabel, errors)) {
      return;
    }

    validatePositiveIntegerField(
      entry,
      "definitionId",
      `${entryPath}.definitionId`,
      idLabel,
      errors
    );
  });
}

function validateRecordEntry(
  entry: unknown,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): entry is Record<string, unknown> {
  if (isRecord(entry)) {
    return true;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} entry must be an object.`
  });
  return false;
}

function validateDisplayNameKeyField(
  entry: Record<string, unknown>,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  const value = entry["displayNameKey"];
  if (typeof value === "string" && value.length > 0) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} displayNameKey must be a non-empty string.`
  });
}

function validatePositiveIntegerField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  validatePositiveIntegerValue(entry[key], path, label, errors);
}

function validateNonEmptyStringField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (typeof value === "string" && value.length > 0) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a non-empty string.`
  });
}

function validateNullableStringField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (value === null || (typeof value === "string" && value.length > 0)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be null or a non-empty string.`
  });
}

function validateBooleanField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (typeof entry[key] === "boolean") {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a boolean.`
  });
}

function validateNullablePositiveIntegerField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (value === null) {
    return;
  }
  validatePositiveIntegerValue(value, path, label, errors);
}

function validateNullableNonnegativeIntegerField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (value === null || isNonnegativeInteger(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be null or a nonnegative safe integer.`
  });
}

function validateStringUnionField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (typeof value === "string" && allowedValues.includes(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be one of ${allowedValues.join(", ")}.`
  });
}

function validateNonnegativeIntegerField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (isNonnegativeInteger(entry[key])) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a nonnegative safe integer.`
  });
}

function validateIntegerFieldInRange(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  ) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a safe integer from ${minimum} to ${maximum}.`
  });
}

function validatePositiveIntegerValue(
  value: unknown,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  if (isPositiveInteger(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} ${formatUnknown(value)} must be a positive safe integer.`
  });
}

function validateNonnegativeIntegerValue(
  value: unknown,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  if (isNonnegativeInteger(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} ${formatUnknown(value)} must be a nonnegative safe integer.`
  });
}

function createRuntimeState(
  definitions: WorldDefinitionsV0,
  m2: M2EconomyPopulationStateV0 | undefined,
  m3: M3PolityVassalageStateV0 | undefined,
  m4: M4CampaignStateV0 | undefined
): WorldRuntimeStateV0 {
  const state: WorldRuntimeStateV0 = {
    polities: sortByNumericId(definitions.polities).map((definition) => ({
      definitionId: definition.id
    })),
    persons: sortByNumericId(definitions.persons).map((definition) => ({
      definitionId: definition.id,
      currentDistrictId: undefined
    })),
    districts: sortByNumericId(definitions.districts).map((definition) => ({
      definitionId: definition.id,
      control: { kind: "uncontrolled" }
    })),
    settlements: sortByNumericId(definitions.settlements).map((definition) => ({
      definitionId: definition.id,
      currentDistrictId: definition.districtId
    })),
    routes: sortByNumericId(definitions.routes).map((definition) => ({
      definitionId: definition.id
    }))
  };

  if (m2 === undefined && m3 === undefined && m4 === undefined) {
    return state;
  }

  let nextState: WorldRuntimeStateV0 = { ...state };
  if (m2 !== undefined) {
    nextState = { ...nextState, m2: canonicalizeM2EconomyPopulationState(m2) };
  }

  if (m3 !== undefined) {
    nextState = { ...nextState, m3: canonicalizeM3PolityVassalageState(m3) };
  }

  if (m4 !== undefined) {
    nextState = { ...nextState, m4: canonicalizeM4CampaignStateV0(m4) };
  }

  return nextState;
}

function canonicalizeDefinitions(definitions: WorldDefinitionsV0): WorldDefinitionsV0 {
  return {
    polities: sortByNumericId(definitions.polities),
    persons: sortByNumericId(definitions.persons),
    districts: sortByNumericId(definitions.districts),
    settlements: sortByNumericId(definitions.settlements),
    routes: sortByNumericId(definitions.routes)
  };
}

export function canonicalizeM2EconomyPopulationState(
  m2: M2EconomyPopulationStateV0
): M2EconomyPopulationStateV0 {
  return {
    schemaVersion: 1,
    populationGroups: sortM2PopulationGroups(m2.populationGroups).map((group) => ({
      ...group,
      committedLabor: sortM2LaborCommitments(group.committedLabor)
    })),
    agriculture: {
      districts: sortM2AgricultureDistricts(m2.agriculture.districts)
    },
    market: {
      districts: sortM2MarketDistricts(m2.market.districts)
    },
    transport: canonicalizeM2TransportState(m2.transport)
  };
}

export function canonicalizeM2TransportState(transport: M2TransportStateV0): M2TransportStateV0 {
  return {
    schemaVersion: 1,
    routes: sortM2TransportRoutes(transport.routes),
    districtSeasonality: sortM2DistrictSeasonality(transport.districtSeasonality),
    regionalCurves: sortM2RegionalSeasonalCurves(transport.regionalCurves).map((curve) => ({
      id: curve.id,
      monthlyValues: sortM2SeasonalMonths(curve.monthlyValues)
    }))
  };
}

export function createM3PolityVassalageStateV0(
  definitions: WorldDefinitionsV0,
  input?: Partial<M3PolityVassalageStateV0>
): M3PolityVassalageStateV0 {
  return canonicalizeM3PolityVassalageState({
    schemaVersion: 1,
    polities:
      input?.polities ??
      definitions.polities.map((polity) => ({
        polityId: polity.id,
        directSuzerainPolityId: null
      })),
    obligations: input?.obligations ?? [],
    obligationAuditEvents: input?.obligationAuditEvents ?? [],
    fulfillmentClaims: input?.fulfillmentClaims ?? [],
    administrativeDistricts: input?.administrativeDistricts ?? [],
    characters: input?.characters ?? [],
    relationships: input?.relationships ?? [],
    offices: input?.offices ?? [],
    policies: input?.policies ?? [],
    enfeoffments: input?.enfeoffments ?? [],
    appointmentAuditEvents: input?.appointmentAuditEvents ?? [],
    successionCandidateProfiles: input?.successionCandidateProfiles ?? [],
    successionCrises: input?.successionCrises ?? []
  });
}

export function createM4CampaignStateV0(
  _definitions: WorldDefinitionsV0,
  input?: Partial<M4CampaignStateV0>
): M4CampaignStateV0 {
  return canonicalizeM4CampaignStateV0({
    schemaVersion: 1,
    campaignPlans: input?.campaignPlans ?? [],
    factionKnowledgeSnapshots: input?.factionKnowledgeSnapshots ?? [],
    mobilizedForceCommitments: input?.mobilizedForceCommitments ?? [],
    grainSupplyReservations: input?.grainSupplyReservations ?? [],
    marches: input?.marches ?? []
  });
}

export function canonicalizeM4CampaignStateV0(m4: M4CampaignStateV0): M4CampaignStateV0 {
  return {
    schemaVersion: 1,
    campaignPlans: sortM4CampaignPlans(m4.campaignPlans).map((plan) => ({
      id: parseCampaignPlanId(plan.id),
      owner: copyM4CampaignOwner(plan.owner),
      target: copyM4CampaignTarget(plan.target),
      objectiveKind: parseM4CampaignObjectiveKind(plan.objectiveKind),
      startWindow: {
        earliestDay: parseGameDay(plan.startWindow.earliestDay),
        latestDay: parseGameDay(plan.startWindow.latestDay)
      },
      status: parseM4CampaignPlanStatus(plan.status),
      statusReasonCode: parseDisplayNameKey(plan.statusReasonCode, "M4 statusReasonCode"),
      reasonCodes: sortText(plan.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 reasonCode")
      ),
      createdDay: parseGameDay(plan.createdDay),
      updatedDay: parseGameDay(plan.updatedDay)
    })),
    factionKnowledgeSnapshots: sortM4FactionKnowledgeSnapshots(m4.factionKnowledgeSnapshots).map(
      (snapshot) => ({
        snapshotId: parseFactionKnowledgeSnapshotId(snapshot.snapshotId),
        observerPolityId: parsePolityId(snapshot.observerPolityId),
        subjectPolityId: parsePolityId(snapshot.subjectPolityId),
        knowledgeVersion: parseNonnegativeInteger(snapshot.knowledgeVersion, "M4 knowledgeVersion"),
        recordedDay: parseGameDay(snapshot.recordedDay),
        source: {
          kind: parseM4FactionKnowledgeSourceKind(snapshot.source.kind),
          sourceId: parseDisplayNameKey(snapshot.source.sourceId, "M4 sourceId"),
          reliabilityBps: parseBps(snapshot.source.reliabilityBps, "M4 reliabilityBps")
        },
        knownObjectives: sortM4KnownObjectives(snapshot.knownObjectives).map((objective) => ({
          campaignPlanId: parseCampaignPlanId(objective.campaignPlanId),
          target: copyM4CampaignTarget(objective.target),
          objectiveKind: parseM4CampaignObjectiveKind(objective.objectiveKind),
          confidenceBps: parseBps(objective.confidenceBps, "M4 objective confidenceBps"),
          reasonCodes: sortText(objective.reasonCodes).map((code) =>
            parseDisplayNameKey(code, "M4 known objective reasonCode")
          )
        })),
        routeEstimates: sortM4RouteEstimates(snapshot.routeEstimates).map((estimate) => ({
          routeId: parseRouteId(estimate.routeId),
          fromDistrictId: parseDistrictId(estimate.fromDistrictId),
          toDistrictId: parseDistrictId(estimate.toDistrictId),
          travelCostEstimate: parsePositiveInteger(
            estimate.travelCostEstimate,
            "M4 travelCostEstimate"
          ),
          capacityEstimate: parseNonnegativeInteger(
            estimate.capacityEstimate,
            "M4 capacityEstimate"
          ),
          confidenceBps: parseBps(estimate.confidenceBps, "M4 route confidenceBps")
        })),
        supplyEstimates: sortM4SupplyEstimates(snapshot.supplyEstimates).map((estimate) => ({
          districtId: parseDistrictId(estimate.districtId),
          supplyMin: parseNonnegativeInteger(estimate.supplyMin, "M4 supplyMin"),
          supplyMax: parseNonnegativeInteger(estimate.supplyMax, "M4 supplyMax"),
          confidenceBps: parseBps(estimate.confidenceBps, "M4 supply confidenceBps")
        })),
        defenderEstimates: sortM4DefenderEstimates(snapshot.defenderEstimates).map((estimate) => ({
          target: copyM4CampaignTarget(estimate.target),
          defenderMin: parseNonnegativeInteger(estimate.defenderMin, "M4 defenderMin"),
          defenderMax: parseNonnegativeInteger(estimate.defenderMax, "M4 defenderMax"),
          confidenceBps: parseBps(estimate.confidenceBps, "M4 defender confidenceBps")
        }))
      })
    ),
    mobilizedForceCommitments: sortM4MobilizedForceCommitments(
      m4.mobilizedForceCommitments ?? []
    ).map((commitment) => ({
      id: parseMobilizedForceCommitmentId(commitment.id),
      campaignPlanId: parseCampaignPlanId(commitment.campaignPlanId),
      source: copyM4MusterCommitmentSource(commitment.source),
      promisedTroops: parsePositiveInteger(commitment.promisedTroops, "M4 promisedTroops"),
      dueDay: parseGameDay(commitment.dueDay),
      assemblyWindow: {
        earliestDay: parseGameDay(commitment.assemblyWindow.earliestDay),
        latestDay: parseGameDay(commitment.assemblyWindow.latestDay)
      },
      plannedAssemblyDay: parseGameDay(commitment.plannedAssemblyDay),
      assembledTroops: parseNonnegativeInteger(commitment.assembledTroops, "M4 assembledTroops"),
      delayedTroops: parseNonnegativeInteger(commitment.delayedTroops, "M4 delayedTroops"),
      refusedTroops: parseNonnegativeInteger(commitment.refusedTroops, "M4 refusedTroops"),
      releasedTroops: parseNonnegativeInteger(commitment.releasedTroops, "M4 releasedTroops"),
      status: parseM4MusterCommitmentStatus(commitment.status),
      statusReasonCode: parseDisplayNameKey(
        commitment.statusReasonCode,
        "M4 muster statusReasonCode"
      ),
      reasonCodes: sortText(commitment.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 muster reasonCode")
      ),
      localCostHooks: sortM4MusterLocalCostHooks(commitment.localCostHooks).map(
        copyM4MusterLocalCostHook
      )
    })),
    grainSupplyReservations: sortM4GrainSupplyReservations(m4.grainSupplyReservations ?? []).map(
      (reservation) => ({
        reservationId: parseGrainSupplyReservationId(reservation.reservationId),
        campaignPlanId: parseCampaignPlanId(reservation.campaignPlanId),
        source: copyM4GrainSupplySource(reservation.source),
        reservedAmount: parseNonnegativeInteger(reservation.reservedAmount, "M4 reservedAmount"),
        carriedAmount: parseNonnegativeInteger(reservation.carriedAmount, "M4 carriedAmount"),
        consumedAmount: parseNonnegativeInteger(reservation.consumedAmount, "M4 consumedAmount"),
        shortageAmount: parseNonnegativeInteger(reservation.shortageAmount, "M4 shortageAmount"),
        lossAmount: parseNonnegativeInteger(reservation.lossAmount, "M4 lossAmount"),
        lossReasonCode:
          reservation.lossReasonCode === null
            ? null
            : parseDisplayNameKey(reservation.lossReasonCode, "M4 lossReasonCode"),
        expectedDailyConsumption: parsePositiveInteger(
          reservation.expectedDailyConsumption,
          "M4 expectedDailyConsumption"
        ),
        expectedDaysOfSupply: parseNonnegativeInteger(
          reservation.expectedDaysOfSupply,
          "M4 expectedDaysOfSupply"
        ),
        status: parseM4GrainSupplyReservationStatus(reservation.status),
        statusReasonCode: parseDisplayNameKey(
          reservation.statusReasonCode,
          "M4 grain statusReasonCode"
        ),
        reasonCodes: sortText(reservation.reasonCodes).map((code) =>
          parseDisplayNameKey(code, "M4 grain reasonCode")
        )
      })
    ),
    marches: sortM4CampaignMarches(m4.marches ?? []).map((march) => ({
      marchId: parseCampaignMarchId(march.marchId),
      campaignPlanId: parseCampaignPlanId(march.campaignPlanId),
      originDistrictId: parseDistrictId(march.originDistrictId),
      targetDistrictId: parseDistrictId(march.targetDistrictId),
      currentDistrictId: parseDistrictId(march.currentDistrictId),
      routeSegments: march.routeSegments.map((segment) => ({
        routeId: parseRouteId(segment.routeId),
        fromDistrictId: parseDistrictId(segment.fromDistrictId),
        toDistrictId: parseDistrictId(segment.toDistrictId),
        travelDays: parsePositiveInteger(segment.travelDays, "M4 march travelDays"),
        capacity: parseNonnegativeInteger(segment.capacity, "M4 march capacity"),
        seasonRiskReasonCodes: sortText(segment.seasonRiskReasonCodes).map((code) =>
          parseDisplayNameKey(code, "M4 march season risk reasonCode")
        )
      })),
      currentSegmentIndex: parseNonnegativeInteger(
        march.currentSegmentIndex,
        "M4 currentSegmentIndex"
      ),
      progressOnSegmentDays: parseNonnegativeInteger(
        march.progressOnSegmentDays,
        "M4 progressOnSegmentDays"
      ),
      activeTroops: parseNonnegativeInteger(march.activeTroops, "M4 activeTroops"),
      grainPerTroopPerDay: parsePositiveInteger(
        march.grainPerTroopPerDay,
        "M4 grainPerTroopPerDay"
      ),
      supply: {
        status: parseM4CampaignMarchSupplyStatus(march.supply.status),
        carriedGrain: parseNonnegativeInteger(march.supply.carriedGrain, "M4 carriedGrain"),
        consumedGrain: parseNonnegativeInteger(march.supply.consumedGrain, "M4 consumedGrain"),
        shortageGrain: parseNonnegativeInteger(march.supply.shortageGrain, "M4 shortageGrain"),
        delayedDays: parseNonnegativeInteger(march.supply.delayedDays, "M4 delayedDays")
      },
      status: parseM4CampaignMarchStatus(march.status),
      statusReasonCode: parseDisplayNameKey(march.statusReasonCode, "M4 march statusReasonCode"),
      reasonCodes: sortText(march.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 march reasonCode")
      ),
      startedDay: parseGameDay(march.startedDay),
      updatedDay: parseGameDay(march.updatedDay),
      predictedArrivalWindow: {
        earliestDay: parseGameDay(march.predictedArrivalWindow.earliestDay),
        latestDay: parseGameDay(march.predictedArrivalWindow.latestDay)
      },
      actualArrivalDay:
        march.actualArrivalDay === null ? null : parseGameDay(march.actualArrivalDay),
      joinedCommitmentIds: sortNumericIds(march.joinedCommitmentIds).map(
        parseMobilizedForceCommitmentId
      ),
      joinedCommitmentTroops: canonicalizeM4CampaignMarchJoinedCommitmentTroops(m4, march),
      failedCommitmentIds: sortNumericIds(march.failedCommitmentIds).map(
        parseMobilizedForceCommitmentId
      )
    }))
  };
}

export function canonicalizeM3PolityVassalageState(
  m3: M3PolityVassalageStateV0
): M3PolityVassalageStateV0 {
  return {
    schemaVersion: 1,
    polities: sortM3PolityRecords(m3.polities).map((polity) => ({
      polityId: parsePolityId(polity.polityId),
      directSuzerainPolityId:
        polity.directSuzerainPolityId === null ? null : parsePolityId(polity.directSuzerainPolityId)
    })),
    obligations: sortM3Obligations(m3.obligations).map((obligation) => ({
      ...obligation,
      id: parseM3ObligationId(obligation.id),
      debtorPolityId: parsePolityId(obligation.debtorPolityId),
      creditorPolityId: parsePolityId(obligation.creditorPolityId),
      obligationSource: {
        kind: "vassalage",
        sourceId: obligation.obligationSource.sourceId,
        debtorPolityId: parsePolityId(obligation.obligationSource.debtorPolityId),
        creditorPolityId: parsePolityId(obligation.obligationSource.creditorPolityId)
      },
      requirement: copyM3Requirement(obligation.requirement),
      due: copyM3Due(obligation.due),
      accounting: {
        ...obligation.accounting,
        dueDay: parseGameDay(obligation.accounting.dueDay)
      },
      createdAuditEventId: parseM3ObligationAuditEventId(obligation.createdAuditEventId),
      latestAuditEventId: parseM3ObligationAuditEventId(obligation.latestAuditEventId)
    })),
    obligationAuditEvents: orderedM3ObligationAuditEventsV0(m3).map((event) => ({
      ...event,
      id: parseM3ObligationAuditEventId(event.id),
      obligationId: parseM3ObligationId(event.obligationId),
      eventDay: parseGameDay(event.eventDay),
      eventRevision: parseWorldRevision(event.eventRevision),
      actor: { ...event.actor },
      dueDay: event.dueDay === null ? null : parseGameDay(event.dueDay),
      fulfillmentId: event.fulfillmentId === null ? null : parseM3FulfillmentId(event.fulfillmentId)
    })),
    fulfillmentClaims: sortM3FulfillmentClaims(m3.fulfillmentClaims).map((claim) => ({
      fulfillmentId: parseM3FulfillmentId(claim.fulfillmentId),
      obligationId: parseM3ObligationId(claim.obligationId),
      auditEventId: parseM3ObligationAuditEventId(claim.auditEventId),
      actionKind: claim.actionKind,
      dueDay: parseGameDay(claim.dueDay),
      fulfilledAmount: claim.fulfilledAmount,
      deliveredAmount: claim.deliveredAmount,
      arrearsAmount: claim.arrearsAmount,
      defaultedAmount: claim.defaultedAmount,
      reasonCode: claim.reasonCode,
      sourceMovements: sortM3FulfillmentSourceMovements(claim.sourceMovements).map(
        copyM3FulfillmentSourceMovement
      )
    })),
    administrativeDistricts: sortM3AdministrativeDistricts(m3.administrativeDistricts).map(
      (entry) => ({
        polityId: parsePolityId(entry.polityId),
        districtId: parseDistrictId(entry.districtId),
        controlMode: parseM3AdministrativeControlMode(entry.controlMode),
        localComplexity: parseNonnegativeInteger(entry.localComplexity, "M3 localComplexity"),
        communicationCost: parseNonnegativeInteger(entry.communicationCost, "M3 communicationCost"),
        directness: parseNonnegativeInteger(entry.directness, "M3 directness"),
        frontierPressure: parseNonnegativeInteger(entry.frontierPressure, "M3 frontierPressure"),
        administrativeCapacity: parsePositiveInteger(
          entry.administrativeCapacity,
          "M3 administrativeCapacity"
        )
      })
    ),
    characters: sortM3Characters(m3.characters).map((entry) => ({
      characterId: parsePersonId(entry.characterId),
      polityId: parsePolityId(entry.polityId),
      alive: parseBoolean(entry.alive, "M3 character alive"),
      incapacitated: parseBoolean(entry.incapacitated, "M3 character incapacitated"),
      currentDistrictId: parseDistrictId(entry.currentDistrictId),
      commandBps: parseBps(entry.commandBps, "M3 commandBps"),
      administrationBps: parseBps(entry.administrationBps, "M3 administrationBps"),
      diplomacyBps: parseBps(entry.diplomacyBps, "M3 diplomacyBps")
    })),
    relationships: sortM3Relationships(m3.relationships).map((entry) => ({
      sourceCharacterId: parsePersonId(entry.sourceCharacterId),
      targetCharacterId: parsePersonId(entry.targetCharacterId),
      affinityBps: parseSignedBps(entry.affinityBps, "M3 affinityBps")
    })),
    offices: sortM3Offices(m3.offices).map((entry) => ({
      officeId: parseM3OfficeId(entry.officeId),
      polityId: parsePolityId(entry.polityId),
      jurisdiction: copyM3OfficeJurisdiction(entry.jurisdiction),
      officeKind: parseM3OfficeKind(entry.officeKind),
      primary: parseBoolean(entry.primary, "M3 office primary"),
      holderCharacterId:
        entry.holderCharacterId === null ? null : parsePersonId(entry.holderCharacterId),
      policyId: parseM3PolicyId(entry.policyId),
      minimumCommandBps: parseBps(entry.minimumCommandBps, "M3 minimumCommandBps"),
      minimumAdministrationBps: parseBps(
        entry.minimumAdministrationBps,
        "M3 minimumAdministrationBps"
      )
    })),
    policies: sortM3Policies(m3.policies).map((entry) => ({
      policyId: parseM3PolicyId(entry.policyId),
      target: copyM3PolicyTarget(entry.target),
      stance: parseM3PolicyStance(entry.stance),
      intensityBps: parseBps(entry.intensityBps, "M3 intensityBps")
    })),
    enfeoffments: sortM3Enfeoffments(m3.enfeoffments).map((entry) => ({
      districtId: parseDistrictId(entry.districtId),
      holderCharacterId: parsePersonId(entry.holderCharacterId),
      grantedByPolityId: parsePolityId(entry.grantedByPolityId),
      policyId: parseM3PolicyId(entry.policyId),
      grantedDay: parseGameDay(entry.grantedDay),
      reasonCode: parseDisplayNameKey(entry.reasonCode, "M3 enfeoffment reasonCode")
    })),
    appointmentAuditEvents: orderedM3AppointmentAuditEventsV0(m3).map((entry) => ({
      id: parseM3AppointmentAuditEventId(entry.id),
      eventKind: parseM3AppointmentAuditEventKind(entry.eventKind),
      eventDay: parseGameDay(entry.eventDay),
      eventRevision: parseWorldRevision(entry.eventRevision),
      commandId: parseDisplayNameKey(entry.commandId, "M3 appointment audit commandId"),
      actor: { ...entry.actor },
      officeId: entry.officeId === null ? null : parseM3OfficeId(entry.officeId),
      characterId: entry.characterId === null ? null : parsePersonId(entry.characterId),
      policyId: entry.policyId === null ? null : parseM3PolicyId(entry.policyId),
      districtId: entry.districtId === null ? null : parseDistrictId(entry.districtId),
      reasonCode: parseDisplayNameKey(entry.reasonCode, "M3 appointment audit reasonCode")
    })),
    successionCandidateProfiles: sortM3SuccessionCandidateProfiles(
      m3.successionCandidateProfiles
    ).map((entry) => ({
      polityId: parsePolityId(entry.polityId),
      characterId: parsePersonId(entry.characterId),
      requiresRegency: parseBoolean(entry.requiresRegency, "M3 succession requiresRegency"),
      supportSources: sortM3SuccessionSupportSources(entry.supportSources).map((source) => ({
        kind: parseM3SuccessionSupportKind(source.kind),
        strengthBps: parseBps(source.strengthBps, "M3 succession support strengthBps"),
        sourceId: parseDisplayNameKey(source.sourceId, "M3 succession support sourceId")
      }))
    })),
    successionCrises: sortM3SuccessionCrises(m3.successionCrises).map((entry) => ({
      id: parseM3SuccessionId(entry.id),
      polityId: parsePolityId(entry.polityId),
      trigger: copyM3SuccessionTrigger(entry.trigger),
      status: parseM3SuccessionStatus(entry.status),
      startedDay: parseGameDay(entry.startedDay),
      resolvedDay: entry.resolvedDay === null ? null : parseGameDay(entry.resolvedDay),
      candidates: sortM3SuccessionCandidates(entry.candidates).map((candidate) => ({
        characterId: parsePersonId(candidate.characterId),
        requiresRegency: parseBoolean(candidate.requiresRegency, "M3 succession requiresRegency"),
        supportSources: sortM3SuccessionSupportSources(candidate.supportSources).map((source) => ({
          kind: parseM3SuccessionSupportKind(source.kind),
          strengthBps: parseBps(source.strengthBps, "M3 succession support strengthBps"),
          sourceId: parseDisplayNameKey(source.sourceId, "M3 succession support sourceId")
        })),
        supportTotalBps: parseBps(candidate.supportTotalBps, "M3 succession supportTotalBps")
      })),
      outcome: entry.outcome === null ? null : copyM3SuccessionOutcome(entry.outcome),
      reasonCode: parseDisplayNameKey(entry.reasonCode, "M3 succession reasonCode")
    }))
  };
}

export function computeM3AdministrativeBurdenProfileV0(
  input: M3AdministrativeBurdenProfileInputV0
): M3AdministrativeBurdenProfileV0 {
  const polityId = parsePolityId(input.polityId);
  const districtId = parseDistrictId(input.districtId);
  const controlMode = parseM3AdministrativeControlMode(input.controlMode);
  const localComplexity = parseNonnegativeInteger(input.localComplexity, "M3 localComplexity");
  const communicationCost = parseNonnegativeInteger(
    input.communicationCost,
    "M3 communicationCost"
  );
  const directness = parseNonnegativeInteger(input.directness, "M3 directness");
  const frontierPressure = parseNonnegativeInteger(input.frontierPressure, "M3 frontierPressure");
  const administrativeCapacity = parsePositiveInteger(
    input.administrativeCapacity,
    "M3 administrativeCapacity"
  );
  const administrativeLoad =
    m3AdministrativeModeBaseLoad(controlMode) +
    localComplexity +
    communicationCost +
    frontierPressure +
    m3DirectnessLoad(controlMode, directness);
  const overload =
    administrativeLoad > administrativeCapacity ? administrativeLoad - administrativeCapacity : 0;
  const efficiencyBps = clampInteger(10_000 - overload * 10, 2_500, 10_000);
  const delayRiskBps = clampInteger(
    overload * 8 + frontierPressure * 4 + communicationCost * 2,
    0,
    10_000
  );
  const realizableIncomeBps = multiplyBps(
    m3AdministrativeModeIncomeBps(controlMode),
    efficiencyBps
  );
  const obligationReliabilityBps = clampInteger(
    multiplyBps(m3AdministrativeModeReliabilityBps(controlMode), efficiencyBps) -
      communicationCost * 2,
    0,
    10_000
  );
  const readinessBps = clampInteger(
    multiplyBps(m3AdministrativeModeReadinessBps(controlMode), efficiencyBps) - delayRiskBps,
    0,
    10_000
  );

  return {
    polityId,
    districtId,
    controlMode,
    localComplexity,
    communicationCost,
    directness,
    frontierPressure,
    administrativeCapacity,
    administrativeLoad,
    overload,
    efficiencyBps,
    realizableIncomeBps,
    obligationReliabilityBps,
    delayRiskBps,
    readinessBps
  };
}

export function orderedM3ObligationAuditEventsV0(
  m3: M3PolityVassalageStateV0 | undefined
): readonly M3ObligationAuditEventStateV0[] {
  if (m3 === undefined) {
    return [];
  }

  return [...m3.obligationAuditEvents].sort(
    (left, right) =>
      left.eventDay - right.eventDay ||
      left.eventRevision - right.eventRevision ||
      left.obligationId - right.obligationId ||
      left.id - right.id
  );
}

export function orderedM3AppointmentAuditEventsV0(
  m3: M3PolityVassalageStateV0 | undefined
): readonly M3AppointmentAuditEventStateV0[] {
  if (m3 === undefined) {
    return [];
  }

  return [...m3.appointmentAuditEvents].sort(
    (left, right) =>
      left.eventDay - right.eventDay ||
      left.eventRevision - right.eventRevision ||
      left.id - right.id
  );
}

function parseDisplayNameKey(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }

  return value;
}

function parseBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean.`);
  }

  return value;
}

function parseBps(value: unknown, label: string): number {
  return parseIntegerInRange(value, label, 0, 10_000);
}

function parseSignedBps(value: unknown, label: string): number {
  return parseIntegerInRange(value, label, -10_000, 10_000);
}

function parsePositiveInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer.`);
  }

  return value;
}

function parseIntegerInRange(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number
): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(`${label} must be a safe integer from ${minimum} to ${maximum}.`);
  }

  return value;
}

function parseNonnegativeInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a nonnegative safe integer.`);
  }

  return value;
}

function parseM2RouteKind(value: unknown): M2RouteKindV0 {
  if (value === "coast" || value === "river" || value === "road") {
    return value;
  }

  throw new Error("M2 routeKind must be coast, river, or road.");
}

const M3_ADMINISTRATIVE_CONTROL_MODES: readonly M3AdministrativeControlModeV0[] = [
  "direct",
  "vassal",
  "tribute-only"
];
const M3_OFFICE_KINDS: readonly M3OfficeKindV0[] = ["commander", "governor", "minister"];
const M3_POLICY_STANCES: readonly M3PolicyStanceV0[] = [
  "balanced",
  "conciliatory",
  "extractive",
  "military"
];
const M3_APPOINTMENT_AUDIT_EVENT_KINDS: readonly M3AppointmentAuditEventKindV0[] = [
  "appointment",
  "bulk-appointment",
  "enfeoffment",
  "policy-updated"
];
const M3_SUCCESSION_SUPPORT_KINDS: readonly M3SuccessionSupportKindV0[] = [
  "kinship",
  "designation",
  "court",
  "military",
  "provincial",
  "suzerain",
  "foreign"
];

function parseM3AdministrativeControlMode(value: unknown): M3AdministrativeControlModeV0 {
  if (value === "direct" || value === "vassal" || value === "tribute-only") {
    return value;
  }

  throw new Error("M3 administrative controlMode must be direct, vassal, or tribute-only.");
}

function parseM3OfficeKind(value: unknown): M3OfficeKindV0 {
  if (value === "commander" || value === "governor" || value === "minister") {
    return value;
  }

  throw new Error("M3 officeKind must be commander, governor, or minister.");
}

function parseM3PolicyStance(value: unknown): M3PolicyStanceV0 {
  if (
    value === "balanced" ||
    value === "conciliatory" ||
    value === "extractive" ||
    value === "military"
  ) {
    return value;
  }

  throw new Error("M3 policy stance must be balanced, conciliatory, extractive, or military.");
}

function parseM3AppointmentAuditEventKind(value: unknown): M3AppointmentAuditEventKindV0 {
  if (
    value === "appointment" ||
    value === "bulk-appointment" ||
    value === "enfeoffment" ||
    value === "policy-updated"
  ) {
    return value;
  }

  throw new Error("M3 appointment audit eventKind is invalid.");
}

function parseM3SuccessionSupportKind(value: unknown): M3SuccessionSupportKindV0 {
  if (
    value === "kinship" ||
    value === "designation" ||
    value === "court" ||
    value === "military" ||
    value === "provincial" ||
    value === "suzerain" ||
    value === "foreign"
  ) {
    return value;
  }

  throw new Error("M3 succession support kind is invalid.");
}

function parseM3SuccessionStatus(value: unknown): "pending" | "resolved" {
  if (value === "pending" || value === "resolved") {
    return value;
  }

  throw new Error("M3 succession status must be pending or resolved.");
}

function copyM3OfficeJurisdiction(jurisdiction: M3OfficeJurisdictionV0): M3OfficeJurisdictionV0 {
  switch (jurisdiction.kind) {
    case "polity":
      return {
        kind: "polity",
        polityId: parsePolityId(jurisdiction.polityId)
      };
    case "district":
      return {
        kind: "district",
        districtId: parseDistrictId(jurisdiction.districtId)
      };
  }
}

function copyM3SuccessionTrigger(trigger: M3SuccessionTriggerV0): M3SuccessionTriggerV0 {
  switch (trigger.kind) {
    case "death":
      return {
        kind: "death",
        characterId: parsePersonId(trigger.characterId),
        officeId: trigger.officeId === null ? null : parseM3OfficeId(trigger.officeId)
      };
    case "incapacity":
      return {
        kind: "incapacity",
        characterId: parsePersonId(trigger.characterId),
        officeId: trigger.officeId === null ? null : parseM3OfficeId(trigger.officeId)
      };
  }
}

function copyM3SuccessionOutcome(outcome: M3SuccessionOutcomeV0): M3SuccessionOutcomeV0 {
  switch (outcome.kind) {
    case "peaceful":
      return {
        kind: "peaceful",
        successorCharacterId: parsePersonId(outcome.successorCharacterId),
        supportTotalBps: parseBps(outcome.supportTotalBps, "M3 succession supportTotalBps")
      };
    case "regency":
      return {
        kind: "regency",
        successorCharacterId: parsePersonId(outcome.successorCharacterId),
        regentCharacterId: parsePersonId(outcome.regentCharacterId),
        supportTotalBps: parseBps(outcome.supportTotalBps, "M3 succession supportTotalBps"),
        reasonCode: parseDisplayNameKey(outcome.reasonCode, "M3 succession outcome reasonCode")
      };
    case "disputed":
      return {
        kind: "disputed",
        leadingCharacterId: parsePersonId(outcome.leadingCharacterId),
        rivalCharacterId: parsePersonId(outcome.rivalCharacterId),
        supportMarginBps: parseBps(outcome.supportMarginBps, "M3 succession supportMarginBps"),
        reasonCode: parseDisplayNameKey(outcome.reasonCode, "M3 succession outcome reasonCode")
      };
  }
}

function copyM3PolicyTarget(target: M3PolicyTargetV0): M3PolicyTargetV0 {
  switch (target.kind) {
    case "office":
      return {
        kind: "office",
        officeId: parseM3OfficeId(target.officeId)
      };
    case "polity":
      return {
        kind: "polity",
        polityId: parsePolityId(target.polityId)
      };
    case "district":
      return {
        kind: "district",
        districtId: parseDistrictId(target.districtId)
      };
  }
}

function copyM3Requirement(requirement: M3ObligationRequirementV0): M3ObligationRequirementV0 {
  switch (requirement.kind) {
    case "amount":
      return {
        kind: "amount",
        resourceKind: requirement.resourceKind,
        amount: parsePositiveInteger(requirement.amount, "M3 amount")
      };
    case "condition":
      return {
        kind: "condition",
        conditionKey: parseDisplayNameKey(requirement.conditionKey, "M3 conditionKey")
      };
  }
}

function copyM3Due(due: M3ObligationDueV0): M3ObligationDueV0 {
  switch (due.kind) {
    case "cadence":
      return {
        kind: "cadence",
        periodDays: parsePositiveInteger(due.periodDays, "M3 periodDays"),
        nextDueDay: parseGameDay(due.nextDueDay)
      };
    case "trigger":
      return {
        kind: "trigger",
        triggerKey: parseDisplayNameKey(due.triggerKey, "M3 triggerKey")
      };
  }
}

export function copyM4CampaignOwner(owner: M4CampaignOwnerV0): M4CampaignOwnerV0 {
  switch (owner.kind) {
    case "commander":
      return { kind: "commander", characterId: parsePersonId(owner.characterId) };
    case "polity":
      return { kind: "polity", polityId: parsePolityId(owner.polityId) };
  }
}

export function copyM4CampaignTarget(target: M4CampaignTargetV0): M4CampaignTargetV0 {
  switch (target.kind) {
    case "district":
      return { kind: "district", districtId: parseDistrictId(target.districtId) };
    case "polity":
      return { kind: "polity", polityId: parsePolityId(target.polityId) };
  }
}

export function copyM4MusterCommitmentSource(
  source: M4MusterCommitmentSourceV0
): M4MusterCommitmentSourceV0 {
  switch (source.kind) {
    case "m3-obligation":
      return {
        kind: "m3-obligation",
        obligationId: parseM3ObligationId(source.obligationId),
        debtorPolityId: parsePolityId(source.debtorPolityId),
        creditorPolityId: parsePolityId(source.creditorPolityId)
      };
  }
}

export function copyM4MusterLocalCostHook(hook: M4MusterLocalCostHookV0): M4MusterLocalCostHookV0 {
  switch (hook.kind) {
    case "economic-labor-reservation":
      return {
        kind: "economic-labor-reservation",
        districtId: parseDistrictId(hook.districtId),
        laborAmount: parseNonnegativeInteger(hook.laborAmount, "M4 laborAmount"),
        reasonCode: parseDisplayNameKey(hook.reasonCode, "M4 economic cost hook reasonCode")
      };
    case "loyalty-pressure":
      return {
        kind: "loyalty-pressure",
        polityId: parsePolityId(hook.polityId),
        pressureBps: parseBps(hook.pressureBps, "M4 loyalty pressureBps"),
        reasonCode: parseDisplayNameKey(hook.reasonCode, "M4 loyalty cost hook reasonCode")
      };
  }
}

export function copyM4GrainSupplySource(source: M4GrainSupplySourceV0): M4GrainSupplySourceV0 {
  switch (source.kind) {
    case "m2-population-group":
      return {
        kind: "m2-population-group",
        populationGroupId: parsePopulationGroupId(source.populationGroupId),
        districtId: parseDistrictId(source.districtId)
      };
  }
}

export function parseM4CampaignObjectiveKind(value: unknown): M4CampaignObjectiveKindV0 {
  if (
    value === "prepare" ||
    value === "march" ||
    value === "besiege" ||
    value === "relieve" ||
    value === "withdraw" ||
    value === "postwar-result-candidate"
  ) {
    return value;
  }

  throw new Error("M4 campaign objective kind is invalid.");
}

export function parseM4CampaignPlanStatus(value: unknown): M4CampaignPlanStatusV0 {
  if (value === "planned" || value === "active" || value === "cancelled" || value === "completed") {
    return value;
  }

  throw new Error("M4 campaign plan status is invalid.");
}

export function parseM4MusterCommitmentStatus(value: unknown): M4MusterCommitmentStatusV0 {
  if (
    value === "promised" ||
    value === "assembled" ||
    value === "delayed" ||
    value === "refused" ||
    value === "released"
  ) {
    return value;
  }

  throw new Error("M4 muster commitment status is invalid.");
}

export function parseM4GrainSupplyReservationStatus(
  value: unknown
): M4GrainSupplyReservationStatusV0 {
  if (
    value === "reserved" ||
    value === "partially-consumed" ||
    value === "shortage" ||
    value === "consumed" ||
    value === "released"
  ) {
    return value;
  }

  throw new Error("M4 grain supply reservation status is invalid.");
}

export function parseM4CampaignMarchStatus(value: unknown): M4CampaignMarchStatusV0 {
  if (
    value === "planned" ||
    value === "marching" ||
    value === "paused" ||
    value === "delayed" ||
    value === "cancelled" ||
    value === "arrived"
  ) {
    return value;
  }

  throw new Error("M4 campaign march status is invalid.");
}

export function parseM4CampaignMarchSupplyStatus(value: unknown): M4CampaignMarchSupplyStatusV0 {
  if (
    value === "well-supplied" ||
    value === "strained" ||
    value === "hungry" ||
    value === "out-of-supply"
  ) {
    return value;
  }

  throw new Error("M4 campaign march supply status is invalid.");
}

export function parseM4FactionKnowledgeSourceKind(value: unknown): M4FactionKnowledgeSourceKindV0 {
  if (value === "scout" || value === "merchant" || value === "envoy" || value === "report") {
    return value;
  }

  throw new Error("M4 faction knowledge source kind is invalid.");
}

function isPositiveInteger(value: unknown): boolean {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonnegativeInteger(value: unknown): boolean {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function sortByNumericId<TValue extends { readonly id: number }>(
  values: readonly TValue[]
): readonly TValue[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value.id - right.value.id || left.index - right.index)
    .map((entry) => entry.value);
}

function sortByDefinitionId<TValue extends { readonly definitionId: number }>(
  values: readonly TValue[]
): readonly TValue[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) =>
        left.value.definitionId - right.value.definitionId || left.index - right.index
    )
    .map((entry) => entry.value);
}

function sortM2PopulationGroups(
  values: readonly M2PopulationGroupStateV0[]
): readonly M2PopulationGroupStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value.id - right.value.id || left.index - right.index)
    .map((entry) => entry.value);
}

function sortM2AgricultureDistricts(
  values: readonly M2DistrictAgricultureStateV0[]
): readonly M2DistrictAgricultureStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) => left.value.districtId - right.value.districtId || left.index - right.index
    )
    .map((entry) => entry.value);
}

function sortM2MarketDistricts(
  values: readonly M2DistrictMarketStateV0[]
): readonly M2DistrictMarketStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) => left.value.districtId - right.value.districtId || left.index - right.index
    )
    .map((entry) => entry.value);
}

function sortM3PolityRecords(
  values: readonly M3PolityRecordStateV0[]
): readonly M3PolityRecordStateV0[] {
  return [...values].sort((left, right) => left.polityId - right.polityId);
}

function sortM3Obligations(values: readonly M3ObligationStateV0[]): readonly M3ObligationStateV0[] {
  return [...values].sort((left, right) => left.id - right.id);
}

function sortM3FulfillmentClaims(
  values: readonly M3FulfillmentClaimStateV0[]
): readonly M3FulfillmentClaimStateV0[] {
  return [...values].sort((left, right) => left.fulfillmentId - right.fulfillmentId);
}

function sortM3FulfillmentSourceMovements(
  values: readonly M3FulfillmentSourceMovementStateV0[]
): readonly M3FulfillmentSourceMovementStateV0[] {
  return [...values].sort((left, right) => {
    if (left.kind !== right.kind) {
      return compareText(left.kind, right.kind);
    }
    if (left.kind === "m2-population-group" && right.kind === "m2-population-group") {
      return (
        left.populationGroupId - right.populationGroupId ||
        left.districtId - right.districtId ||
        compareText(left.resourceKind, right.resourceKind) ||
        left.amount - right.amount
      );
    }
    if (
      left.kind === "m3-troop-commitment-placeholder" &&
      right.kind === "m3-troop-commitment-placeholder"
    ) {
      return left.debtorPolityId - right.debtorPolityId || left.headcount - right.headcount;
    }
    return 0;
  });
}

function copyM3FulfillmentSourceMovement(
  movement: M3FulfillmentSourceMovementStateV0
): M3FulfillmentSourceMovementStateV0 {
  switch (movement.kind) {
    case "m2-population-group":
      return {
        kind: "m2-population-group",
        populationGroupId: parsePopulationGroupId(movement.populationGroupId),
        districtId: parseDistrictId(movement.districtId),
        resourceKind: movement.resourceKind,
        amount: movement.amount
      };
    case "m3-troop-commitment-placeholder":
      return {
        kind: "m3-troop-commitment-placeholder",
        debtorPolityId: parsePolityId(movement.debtorPolityId),
        headcount: movement.headcount
      };
  }
}

function sortM3AdministrativeDistricts(
  values: readonly M3AdministrativeDistrictStateV0[]
): readonly M3AdministrativeDistrictStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.polityId - right.polityId ||
      left.districtId - right.districtId ||
      compareText(left.controlMode, right.controlMode)
  );
}

function sortM3Characters(values: readonly M3CharacterStateV0[]): readonly M3CharacterStateV0[] {
  return [...values].sort((left, right) => left.characterId - right.characterId);
}

function sortM3Relationships(
  values: readonly M3CharacterRelationshipStateV0[]
): readonly M3CharacterRelationshipStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.sourceCharacterId - right.sourceCharacterId ||
      left.targetCharacterId - right.targetCharacterId
  );
}

function sortM3Offices(values: readonly M3OfficeStateV0[]): readonly M3OfficeStateV0[] {
  return [...values].sort((left, right) => left.officeId - right.officeId);
}

function sortM3Policies(values: readonly M3PolicyStateV0[]): readonly M3PolicyStateV0[] {
  return [...values].sort((left, right) => left.policyId - right.policyId);
}

function sortM3Enfeoffments(
  values: readonly M3EnfeoffmentStateV0[]
): readonly M3EnfeoffmentStateV0[] {
  return [...values].sort((left, right) => left.districtId - right.districtId);
}

function sortM3SuccessionCandidateProfiles(
  values: readonly M3SuccessionCandidateProfileStateV0[]
): readonly M3SuccessionCandidateProfileStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.polityId - right.polityId ||
      left.characterId - right.characterId ||
      (left.requiresRegency === right.requiresRegency ? 0 : left.requiresRegency ? 1 : -1)
  );
}

function sortM3SuccessionSupportSources(
  values: readonly M3SuccessionSupportSourceStateV0[]
): readonly M3SuccessionSupportSourceStateV0[] {
  return [...values].sort(
    (left, right) =>
      m3SuccessionSupportKindRank(left.kind) - m3SuccessionSupportKindRank(right.kind) ||
      compareText(left.sourceId, right.sourceId) ||
      left.strengthBps - right.strengthBps
  );
}

function m3SuccessionSupportKindRank(kind: M3SuccessionSupportKindV0): number {
  switch (kind) {
    case "kinship":
      return 1;
    case "designation":
      return 2;
    case "court":
      return 3;
    case "military":
      return 4;
    case "provincial":
      return 5;
    case "suzerain":
      return 6;
    case "foreign":
      return 7;
  }
}

function sortM3SuccessionCrises(
  values: readonly M3SuccessionCrisisStateV0[]
): readonly M3SuccessionCrisisStateV0[] {
  return [...values].sort((left, right) => left.id - right.id);
}

function sortM3SuccessionCandidates(
  values: readonly M3SuccessionCandidateStateV0[]
): readonly M3SuccessionCandidateStateV0[] {
  return [...values].sort(
    (left, right) =>
      right.supportTotalBps - left.supportTotalBps || left.characterId - right.characterId
  );
}

function sortM4CampaignPlans(
  values: readonly M4CampaignPlanStateV0[]
): readonly M4CampaignPlanStateV0[] {
  return [...values].sort((left, right) => left.id - right.id);
}

function sortM4FactionKnowledgeSnapshots(
  values: readonly M4FactionKnowledgeSnapshotStateV0[]
): readonly M4FactionKnowledgeSnapshotStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.observerPolityId - right.observerPolityId ||
      left.subjectPolityId - right.subjectPolityId ||
      left.knowledgeVersion - right.knowledgeVersion ||
      left.snapshotId - right.snapshotId
  );
}

function sortM4MobilizedForceCommitments(
  values: readonly M4MobilizedForceCommitmentStateV0[]
): readonly M4MobilizedForceCommitmentStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.dueDay - right.dueDay ||
      compareM4MusterCommitmentSource(left.source, right.source) ||
      left.promisedTroops - right.promisedTroops ||
      left.assembledTroops - right.assembledTroops ||
      left.delayedTroops - right.delayedTroops ||
      left.refusedTroops - right.refusedTroops ||
      left.releasedTroops - right.releasedTroops ||
      compareText(left.status, right.status) ||
      compareSortedTextList(left.reasonCodes, right.reasonCodes) ||
      left.id - right.id
  );
}

function sortM4GrainSupplyReservations(
  values: readonly M4GrainSupplyReservationStateV0[]
): readonly M4GrainSupplyReservationStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.reservationId - right.reservationId ||
      compareM4GrainSupplySource(left.source, right.source) ||
      left.reservedAmount - right.reservedAmount ||
      left.carriedAmount - right.carriedAmount ||
      left.consumedAmount - right.consumedAmount ||
      left.shortageAmount - right.shortageAmount ||
      left.lossAmount - right.lossAmount ||
      compareOptionalText(left.lossReasonCode, right.lossReasonCode) ||
      left.expectedDailyConsumption - right.expectedDailyConsumption ||
      left.expectedDaysOfSupply - right.expectedDaysOfSupply ||
      compareText(left.status, right.status) ||
      compareText(left.statusReasonCode, right.statusReasonCode) ||
      compareSortedTextList(left.reasonCodes, right.reasonCodes)
  );
}

function sortM4CampaignMarches(
  values: readonly M4CampaignMarchStateV0[]
): readonly M4CampaignMarchStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.startedDay - right.startedDay ||
      left.marchId - right.marchId
  );
}

function canonicalizeM4CampaignMarchJoinedCommitmentTroops(
  m4: M4CampaignStateV0,
  march: M4CampaignMarchStateV0
): readonly M4CampaignMarchJoinedCommitmentTroopsStateV0[] {
  const joinedTroops =
    march.joinedCommitmentTroops ??
    march.joinedCommitmentIds.map((commitmentId) => {
      const commitment = m4.mobilizedForceCommitments.find((entry) => entry.id === commitmentId);
      return {
        commitmentId,
        joinedTroops:
          commitment === undefined
            ? 0
            : parseNonnegativeInteger(
                commitment.assembledTroops - commitment.releasedTroops,
                "M4 joinedTroops"
              )
      };
    });
  return [...joinedTroops]
    .sort((left, right) => left.commitmentId - right.commitmentId)
    .map((entry) => ({
      commitmentId: parseMobilizedForceCommitmentId(entry.commitmentId),
      joinedTroops: parseNonnegativeInteger(entry.joinedTroops, "M4 joinedTroops")
    }));
}

function sortNumericIds<TValue extends number>(values: readonly TValue[]): readonly TValue[] {
  return [...values].sort((left, right) => left - right);
}

function compareM4GrainSupplySource(
  left: M4GrainSupplySourceV0,
  right: M4GrainSupplySourceV0
): number {
  return (
    compareText(left.kind, right.kind) ||
    left.districtId - right.districtId ||
    left.populationGroupId - right.populationGroupId
  );
}

function compareM4MusterCommitmentSource(
  left: M4MusterCommitmentSourceV0,
  right: M4MusterCommitmentSourceV0
): number {
  return (
    compareText(left.kind, right.kind) ||
    left.obligationId - right.obligationId ||
    left.debtorPolityId - right.debtorPolityId ||
    left.creditorPolityId - right.creditorPolityId
  );
}

function sortM4MusterLocalCostHooks(
  values: readonly M4MusterLocalCostHookV0[]
): readonly M4MusterLocalCostHookV0[] {
  return [...values].sort((left, right) => compareM4MusterLocalCostHook(left, right));
}

function compareM4MusterLocalCostHook(
  left: M4MusterLocalCostHookV0,
  right: M4MusterLocalCostHookV0
): number {
  if (left.kind !== right.kind) {
    return compareText(left.kind, right.kind);
  }
  if (left.kind === "economic-labor-reservation" && right.kind === "economic-labor-reservation") {
    return (
      left.districtId - right.districtId ||
      left.laborAmount - right.laborAmount ||
      compareText(left.reasonCode, right.reasonCode)
    );
  }
  if (left.kind === "loyalty-pressure" && right.kind === "loyalty-pressure") {
    return (
      left.polityId - right.polityId ||
      left.pressureBps - right.pressureBps ||
      compareText(left.reasonCode, right.reasonCode)
    );
  }
  return 0;
}

function sortM4KnownObjectives(
  values: readonly M4KnownObjectiveEstimateV0[]
): readonly M4KnownObjectiveEstimateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      compareM4CampaignTarget(left.target, right.target) ||
      compareText(left.objectiveKind, right.objectiveKind) ||
      left.confidenceBps - right.confidenceBps ||
      compareSortedTextList(left.reasonCodes, right.reasonCodes)
  );
}

function sortM4RouteEstimates(values: readonly M4RouteEstimateV0[]): readonly M4RouteEstimateV0[] {
  return [...values].sort(
    (left, right) =>
      left.routeId - right.routeId ||
      left.fromDistrictId - right.fromDistrictId ||
      left.toDistrictId - right.toDistrictId ||
      left.travelCostEstimate - right.travelCostEstimate ||
      left.capacityEstimate - right.capacityEstimate ||
      left.confidenceBps - right.confidenceBps
  );
}

function sortM4SupplyEstimates(
  values: readonly M4SupplyEstimateV0[]
): readonly M4SupplyEstimateV0[] {
  return [...values].sort(
    (left, right) =>
      left.districtId - right.districtId ||
      left.supplyMin - right.supplyMin ||
      left.supplyMax - right.supplyMax ||
      left.confidenceBps - right.confidenceBps
  );
}

function sortM4DefenderEstimates(
  values: readonly M4DefenderEstimateV0[]
): readonly M4DefenderEstimateV0[] {
  return [...values].sort(
    (left, right) =>
      compareM4CampaignTarget(left.target, right.target) ||
      left.defenderMin - right.defenderMin ||
      left.defenderMax - right.defenderMax ||
      left.confidenceBps - right.confidenceBps
  );
}

function compareSortedTextList(left: readonly string[], right: readonly string[]): number {
  const sortedLeft = sortText(left);
  const sortedRight = sortText(right);
  const lengthCompare = sortedLeft.length - sortedRight.length;
  if (lengthCompare !== 0) {
    return lengthCompare;
  }

  for (let index = 0; index < sortedLeft.length; index += 1) {
    const valueCompare = compareText(sortedLeft[index] ?? "", sortedRight[index] ?? "");
    if (valueCompare !== 0) {
      return valueCompare;
    }
  }

  return 0;
}

function compareOptionalText(left: string | null, right: string | null): number {
  if (left === null && right === null) {
    return 0;
  }
  if (left === null) {
    return -1;
  }
  if (right === null) {
    return 1;
  }
  return compareText(left, right);
}

function compareM4CampaignTarget(left: M4CampaignTargetV0, right: M4CampaignTargetV0): number {
  return (
    m4TargetKindRank(left.kind) - m4TargetKindRank(right.kind) ||
    m4TargetId(left) - m4TargetId(right)
  );
}

function m4TargetKindRank(kind: M4CampaignTargetV0["kind"]): number {
  switch (kind) {
    case "district":
      return 1;
    case "polity":
      return 2;
  }
}

function m4TargetId(target: M4CampaignTargetV0): number {
  switch (target.kind) {
    case "district":
      return target.districtId;
    case "polity":
      return target.polityId;
  }
}

function sortText(values: readonly string[]): readonly string[] {
  return [...values].sort(compareText);
}

function m3AdministrativeModeBaseLoad(mode: M3AdministrativeControlModeV0): number {
  switch (mode) {
    case "direct":
      return 320;
    case "vassal":
      return 190;
    case "tribute-only":
      return 110;
  }
}

function m3DirectnessLoad(mode: M3AdministrativeControlModeV0, directness: number): number {
  switch (mode) {
    case "direct":
      return directness;
    case "vassal":
      return divideRoundingDown(directness, 2);
    case "tribute-only":
      return divideRoundingDown(directness, 4);
  }
}

function m3AdministrativeModeIncomeBps(mode: M3AdministrativeControlModeV0): number {
  switch (mode) {
    case "direct":
      return 10_000;
    case "vassal":
      return 7_000;
    case "tribute-only":
      return 4_500;
  }
}

function m3AdministrativeModeReliabilityBps(mode: M3AdministrativeControlModeV0): number {
  switch (mode) {
    case "direct":
      return 8_500;
    case "vassal":
      return 7_500;
    case "tribute-only":
      return 6_000;
  }
}

function m3AdministrativeModeReadinessBps(mode: M3AdministrativeControlModeV0): number {
  switch (mode) {
    case "direct":
      return 8_000;
    case "vassal":
      return 6_500;
    case "tribute-only":
      return 4_500;
  }
}

function multiplyBps(value: number, bps: number): number {
  return divideRoundingDown(value * bps, 10_000);
}

function divideRoundingDown(value: number, divisor: number): number {
  return (value - (value % divisor)) / divisor;
}

function clampInteger(value: number, minimum: number, maximum: number): number {
  if (value < minimum) {
    return minimum;
  }
  if (value > maximum) {
    return maximum;
  }
  return value;
}

function sortM2LaborCommitments(
  values: readonly M2LaborCommitmentStateV0[]
): readonly M2LaborCommitmentStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) =>
        left.value.releaseDay - right.value.releaseDay ||
        left.value.startDay - right.value.startDay ||
        compareText(left.value.purpose, right.value.purpose) ||
        left.index - right.index
    )
    .map((entry) => entry.value);
}

function sortM2TransportRoutes(
  values: readonly M2RouteTransportEdgeStateV0[]
): readonly M2RouteTransportEdgeStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value.routeId - right.value.routeId || left.index - right.index)
    .map((entry) => entry.value);
}

function sortM2DistrictSeasonality(
  values: readonly M2DistrictSeasonalityStateV0[]
): readonly M2DistrictSeasonalityStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) => left.value.districtId - right.value.districtId || left.index - right.index
    )
    .map((entry) => entry.value);
}

function sortM2RegionalSeasonalCurves(
  values: readonly M2RegionalSeasonalCurveStateV0[]
): readonly M2RegionalSeasonalCurveStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value.id - right.value.id || left.index - right.index)
    .map((entry) => entry.value);
}

function sortM2SeasonalMonths(
  values: readonly M2SeasonalMonthStateV0[]
): readonly M2SeasonalMonthStateV0[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value.month - right.value.month || left.index - right.index)
    .map((entry) => entry.value);
}

function formatPolityDefinitions(values: readonly PolityDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}`)
    .join(",");
}

function formatPersonDefinitions(values: readonly PersonDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}`)
    .join(",");
}

function formatDistrictDefinitions(values: readonly DistrictDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}`)
    .join(",");
}

function formatSettlementDefinitions(values: readonly SettlementDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}:${value.districtId}`)
    .join(",");
}

function formatRouteDefinitions(values: readonly RouteDefinition[]): string {
  return sortByNumericId(values)
    .map(
      (value) =>
        `${value.id}:${value.fromDistrictId}:${value.toDistrictId}:${value.lengthInMapUnits}`
    )
    .join(",");
}

function formatPolityStates(values: readonly PolityState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}`)
    .join(",");
}

function formatPersonStates(values: readonly PersonState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}:${formatOptionalNumber(value.currentDistrictId)}`)
    .join(",");
}

function formatDistrictStates(values: readonly DistrictState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}:${formatDistrictControl(value.control)}`)
    .join(",");
}

function formatSettlementStates(values: readonly SettlementState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}:${value.currentDistrictId}`)
    .join(",");
}

function formatRouteStates(values: readonly RouteState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}`)
    .join(",");
}

function formatM2CanonicalLines(m2: M2EconomyPopulationStateV0 | undefined): readonly string[] {
  if (m2 === undefined) {
    return [];
  }

  return [
    `state.m2.schemaVersion=${m2.schemaVersion}`,
    `state.m2.populationGroups=${formatM2PopulationGroups(m2.populationGroups)}`,
    `state.m2.agriculture.districts=${formatM2AgricultureDistricts(m2.agriculture.districts)}`,
    `state.m2.market.districts=${formatM2MarketDistricts(m2.market.districts)}`,
    `state.m2.transport.routes=${formatM2TransportRoutes(m2.transport.routes)}`,
    `state.m2.transport.districtSeasonality=${formatM2DistrictSeasonality(
      m2.transport.districtSeasonality
    )}`,
    `state.m2.transport.regionalCurves=${formatM2RegionalSeasonalCurves(
      m2.transport.regionalCurves
    )}`
  ];
}

function formatM3CanonicalLines(m3: M3PolityVassalageStateV0 | undefined): readonly string[] {
  if (m3 === undefined) {
    return [];
  }

  return [
    `state.m3.schemaVersion=${m3.schemaVersion}`,
    `state.m3.polities=${formatM3PolityRecords(m3.polities)}`,
    `state.m3.obligations=${formatM3Obligations(m3.obligations)}`,
    `state.m3.obligationAuditEvents=${formatM3AuditEvents(m3)}`,
    `state.m3.fulfillmentClaims=${formatM3FulfillmentClaims(m3.fulfillmentClaims)}`,
    `state.m3.administrativeDistricts=${formatM3AdministrativeDistricts(
      m3.administrativeDistricts
    )}`,
    `state.m3.characters=${formatM3Characters(m3.characters)}`,
    `state.m3.relationships=${formatM3Relationships(m3.relationships)}`,
    `state.m3.offices=${formatM3Offices(m3.offices)}`,
    `state.m3.policies=${formatM3Policies(m3.policies)}`,
    `state.m3.enfeoffments=${formatM3Enfeoffments(m3.enfeoffments)}`,
    `state.m3.appointmentAuditEvents=${formatM3AppointmentAuditEvents(m3)}`,
    `state.m3.successionCandidateProfiles=${formatM3SuccessionCandidateProfiles(
      m3.successionCandidateProfiles
    )}`,
    `state.m3.successionCrises=${formatM3SuccessionCrises(m3.successionCrises)}`
  ];
}

function formatM4CanonicalLines(m4: M4CampaignStateV0 | undefined): readonly string[] {
  if (m4 === undefined) {
    return [];
  }

  return [
    `state.m4.schemaVersion=${m4.schemaVersion}`,
    `state.m4.campaignPlans=${formatM4CampaignPlans(m4.campaignPlans)}`,
    `state.m4.factionKnowledgeSnapshots=${formatM4FactionKnowledgeSnapshots(
      m4.factionKnowledgeSnapshots
    )}`,
    `state.m4.mobilizedForceCommitments=${formatM4MobilizedForceCommitments(
      m4.mobilizedForceCommitments
    )}`,
    `state.m4.grainSupplyReservations=${formatM4GrainSupplyReservations(
      m4.grainSupplyReservations
    )}`,
    `state.m4.marches=${formatM4CampaignMarches(m4.marches ?? [])}`
  ];
}

function formatM4CampaignPlans(values: readonly M4CampaignPlanStateV0[]): string {
  return sortM4CampaignPlans(values)
    .map((value) =>
      [
        value.id,
        formatM4CampaignOwner(value.owner),
        formatM4CampaignTarget(value.target),
        value.objectiveKind,
        `${value.startWindow.earliestDay}/${value.startWindow.latestDay}`,
        value.status,
        value.statusReasonCode,
        sortText(value.reasonCodes).join("/"),
        value.createdDay,
        value.updatedDay
      ].join(":")
    )
    .join(",");
}

function formatM4FactionKnowledgeSnapshots(
  values: readonly M4FactionKnowledgeSnapshotStateV0[]
): string {
  return sortM4FactionKnowledgeSnapshots(values)
    .map((value) =>
      [
        value.snapshotId,
        value.observerPolityId,
        value.subjectPolityId,
        value.knowledgeVersion,
        value.recordedDay,
        `${value.source.kind}/${value.source.sourceId}/${value.source.reliabilityBps}`,
        sortM4KnownObjectives(value.knownObjectives).map(formatM4KnownObjective).join("/"),
        sortM4RouteEstimates(value.routeEstimates).map(formatM4RouteEstimate).join("/"),
        sortM4SupplyEstimates(value.supplyEstimates).map(formatM4SupplyEstimate).join("/"),
        sortM4DefenderEstimates(value.defenderEstimates).map(formatM4DefenderEstimate).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM4MobilizedForceCommitments(
  values: readonly M4MobilizedForceCommitmentStateV0[]
): string {
  return sortM4MobilizedForceCommitments(values)
    .map((value) =>
      [
        value.id,
        value.campaignPlanId,
        formatM4MusterCommitmentSource(value.source),
        value.promisedTroops,
        value.dueDay,
        `${value.assemblyWindow.earliestDay}/${value.assemblyWindow.latestDay}`,
        value.plannedAssemblyDay,
        value.assembledTroops,
        value.delayedTroops,
        value.refusedTroops,
        value.releasedTroops,
        value.status,
        value.statusReasonCode,
        sortText(value.reasonCodes).join("/"),
        sortM4MusterLocalCostHooks(value.localCostHooks).map(formatM4MusterLocalCostHook).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM4GrainSupplyReservations(
  values: readonly M4GrainSupplyReservationStateV0[]
): string {
  return sortM4GrainSupplyReservations(values)
    .map((value) =>
      [
        value.reservationId,
        value.campaignPlanId,
        formatM4GrainSupplySource(value.source),
        value.reservedAmount,
        value.carriedAmount,
        value.consumedAmount,
        value.shortageAmount,
        value.lossAmount,
        value.lossReasonCode ?? "none",
        value.expectedDailyConsumption,
        value.expectedDaysOfSupply,
        value.status,
        value.statusReasonCode,
        sortText(value.reasonCodes).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM4CampaignMarches(values: readonly M4CampaignMarchStateV0[]): string {
  return sortM4CampaignMarches(values)
    .map((value) =>
      [
        value.marchId,
        value.campaignPlanId,
        value.originDistrictId,
        value.targetDistrictId,
        value.currentDistrictId,
        value.routeSegments.map(formatM4CampaignMarchRouteSegment).join("/"),
        value.currentSegmentIndex,
        value.progressOnSegmentDays,
        value.activeTroops,
        value.grainPerTroopPerDay,
        formatM4CampaignMarchSupply(value.supply),
        value.status,
        value.statusReasonCode,
        sortText(value.reasonCodes).join("/"),
        value.startedDay,
        value.updatedDay,
        `${value.predictedArrivalWindow.earliestDay}/${value.predictedArrivalWindow.latestDay}`,
        formatNullableNumber(value.actualArrivalDay),
        sortNumericIds(value.joinedCommitmentIds).join("/"),
        sortM4CampaignMarchJoinedCommitmentTroops(value.joinedCommitmentTroops).join("/"),
        sortNumericIds(value.failedCommitmentIds).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM4CampaignMarchRouteSegment(value: M4CampaignMarchRouteSegmentStateV0): string {
  return [
    value.routeId,
    value.fromDistrictId,
    value.toDistrictId,
    value.travelDays,
    value.capacity,
    sortText(value.seasonRiskReasonCodes).join(".")
  ].join(".");
}

function formatM4CampaignMarchSupply(value: M4CampaignMarchSupplyStateV0): string {
  return [
    value.status,
    value.carriedGrain,
    value.consumedGrain,
    value.shortageGrain,
    value.delayedDays
  ].join(".");
}

function sortM4CampaignMarchJoinedCommitmentTroops(
  values: readonly M4CampaignMarchJoinedCommitmentTroopsStateV0[]
): readonly string[] {
  return [...values]
    .sort((left, right) => left.commitmentId - right.commitmentId)
    .map((value) => `${value.commitmentId}.${value.joinedTroops}`);
}

function formatM4MusterCommitmentSource(source: M4MusterCommitmentSourceV0): string {
  switch (source.kind) {
    case "m3-obligation":
      return [
        source.kind,
        source.obligationId,
        source.debtorPolityId,
        source.creditorPolityId
      ].join(".");
  }
}

function formatM4GrainSupplySource(source: M4GrainSupplySourceV0): string {
  switch (source.kind) {
    case "m2-population-group":
      return [source.kind, source.districtId, source.populationGroupId].join(".");
  }
}

function formatM4MusterLocalCostHook(hook: M4MusterLocalCostHookV0): string {
  switch (hook.kind) {
    case "economic-labor-reservation":
      return [hook.kind, hook.districtId, hook.laborAmount, hook.reasonCode].join(".");
    case "loyalty-pressure":
      return [hook.kind, hook.polityId, hook.pressureBps, hook.reasonCode].join(".");
  }
}

function formatM4KnownObjective(value: M4KnownObjectiveEstimateV0): string {
  return [
    value.campaignPlanId,
    formatM4CampaignTarget(value.target),
    value.objectiveKind,
    value.confidenceBps,
    sortText(value.reasonCodes).join(".")
  ].join(".");
}

function formatM4RouteEstimate(value: M4RouteEstimateV0): string {
  return [
    value.routeId,
    value.fromDistrictId,
    value.toDistrictId,
    value.travelCostEstimate,
    value.capacityEstimate,
    value.confidenceBps
  ].join(".");
}

function formatM4SupplyEstimate(value: M4SupplyEstimateV0): string {
  return [value.districtId, value.supplyMin, value.supplyMax, value.confidenceBps].join(".");
}

function formatM4DefenderEstimate(value: M4DefenderEstimateV0): string {
  return [
    formatM4CampaignTarget(value.target),
    value.defenderMin,
    value.defenderMax,
    value.confidenceBps
  ].join(".");
}

function formatM4CampaignOwner(owner: M4CampaignOwnerV0): string {
  switch (owner.kind) {
    case "commander":
      return `commander.${owner.characterId}`;
    case "polity":
      return `polity.${owner.polityId}`;
  }
}

function formatM4CampaignTarget(target: M4CampaignTargetV0): string {
  switch (target.kind) {
    case "district":
      return `district.${target.districtId}`;
    case "polity":
      return `polity.${target.polityId}`;
  }
}

function formatM3PolityRecords(values: readonly M3PolityRecordStateV0[]): string {
  return sortM3PolityRecords(values)
    .map((value) => `${value.polityId}:${formatNullableNumber(value.directSuzerainPolityId)}`)
    .join(",");
}

function formatM3Obligations(values: readonly M3ObligationStateV0[]): string {
  return sortM3Obligations(values)
    .map((value) =>
      [
        value.id,
        value.debtorPolityId,
        value.creditorPolityId,
        value.obligationKind,
        value.obligationCategory,
        `${value.obligationSource.kind}:${value.obligationSource.sourceId}:${value.obligationSource.debtorPolityId}:${value.obligationSource.creditorPolityId}`,
        formatM3Requirement(value.requirement),
        formatM3Due(value.due),
        [
          value.accounting.nominalAmount,
          value.accounting.dueAmount,
          value.accounting.deliveredAmount,
          value.accounting.arrearsAmount,
          value.accounting.defaultedAmount,
          value.accounting.remittedAmount,
          value.accounting.dueDay,
          value.accounting.cycle,
          value.accounting.troopResponseState
        ].join("/"),
        value.status,
        formatNullableString(value.disputeReasonCode),
        formatNullableString(value.breachReasonCode),
        value.createdAuditEventId,
        value.latestAuditEventId
      ].join(":")
    )
    .join(",");
}

function formatM3Requirement(requirement: M3ObligationRequirementV0): string {
  switch (requirement.kind) {
    case "amount":
      return `amount:${requirement.resourceKind}:${requirement.amount}`;
    case "condition":
      return `condition:${requirement.conditionKey}`;
  }
}

function formatM3Due(due: M3ObligationDueV0): string {
  switch (due.kind) {
    case "cadence":
      return `cadence:${due.periodDays}:${due.nextDueDay}`;
    case "trigger":
      return `trigger:${due.triggerKey}`;
  }
}

function formatM3AuditEvents(m3: M3PolityVassalageStateV0): string {
  return orderedM3ObligationAuditEventsV0(m3)
    .map((value) =>
      [
        value.id,
        value.obligationId,
        value.eventKind,
        value.eventDay,
        value.eventRevision,
        value.commandId,
        `${value.actor.kind}:${value.actor.id}`,
        formatNullableString(value.actionKind),
        formatNullableNumber(value.dueDay),
        formatNullableNumber(value.fulfillmentId),
        formatNullableNumber(value.fulfilledAmount),
        value.statusAfter,
        formatNullableString(value.reasonCode),
        value.reasonCodes.join("/"),
        value.reliabilityBps
      ].join(":")
    )
    .join(",");
}

function formatM3FulfillmentClaims(values: readonly M3FulfillmentClaimStateV0[]): string {
  return sortM3FulfillmentClaims(values)
    .map((value) =>
      [
        value.fulfillmentId,
        value.obligationId,
        value.auditEventId,
        value.actionKind,
        value.dueDay,
        value.fulfilledAmount,
        value.deliveredAmount,
        value.arrearsAmount,
        value.defaultedAmount,
        value.reasonCode,
        sortM3FulfillmentSourceMovements(value.sourceMovements)
          .map(formatM3FulfillmentSourceMovement)
          .join("/")
      ].join(":")
    )
    .join(",");
}

function formatM3FulfillmentSourceMovement(movement: M3FulfillmentSourceMovementStateV0): string {
  switch (movement.kind) {
    case "m2-population-group":
      return [
        movement.kind,
        movement.populationGroupId,
        movement.districtId,
        movement.resourceKind,
        movement.amount
      ].join(".");
    case "m3-troop-commitment-placeholder":
      return [movement.kind, movement.debtorPolityId, movement.headcount].join(".");
  }
}

function formatM3AdministrativeDistricts(
  values: readonly M3AdministrativeDistrictStateV0[]
): string {
  return sortM3AdministrativeDistricts(values)
    .map((value) =>
      [
        value.polityId,
        value.districtId,
        value.controlMode,
        value.localComplexity,
        value.communicationCost,
        value.directness,
        value.frontierPressure,
        value.administrativeCapacity
      ].join(":")
    )
    .join(",");
}

function formatM3Characters(values: readonly M3CharacterStateV0[]): string {
  return sortM3Characters(values)
    .map((value) =>
      [
        value.characterId,
        value.polityId,
        value.alive ? "1" : "0",
        value.incapacitated ? "1" : "0",
        value.currentDistrictId,
        value.commandBps,
        value.administrationBps,
        value.diplomacyBps
      ].join(":")
    )
    .join(",");
}

function formatM3Relationships(values: readonly M3CharacterRelationshipStateV0[]): string {
  return sortM3Relationships(values)
    .map((value) => `${value.sourceCharacterId}:${value.targetCharacterId}:${value.affinityBps}`)
    .join(",");
}

function formatM3Offices(values: readonly M3OfficeStateV0[]): string {
  return sortM3Offices(values)
    .map((value) =>
      [
        value.officeId,
        value.polityId,
        formatM3OfficeJurisdiction(value.jurisdiction),
        value.officeKind,
        value.primary ? "1" : "0",
        formatNullableNumber(value.holderCharacterId),
        value.policyId,
        value.minimumCommandBps,
        value.minimumAdministrationBps
      ].join(":")
    )
    .join(",");
}

function formatM3OfficeJurisdiction(jurisdiction: M3OfficeJurisdictionV0): string {
  switch (jurisdiction.kind) {
    case "polity":
      return `polity:${jurisdiction.polityId}`;
    case "district":
      return `district:${jurisdiction.districtId}`;
  }
}

function formatM3Policies(values: readonly M3PolicyStateV0[]): string {
  return sortM3Policies(values)
    .map(
      (value) =>
        `${value.policyId}:${formatM3PolicyTarget(value.target)}:${value.stance}:${value.intensityBps}`
    )
    .join(",");
}

function formatM3PolicyTarget(target: M3PolicyTargetV0): string {
  switch (target.kind) {
    case "office":
      return `office:${target.officeId}`;
    case "polity":
      return `polity:${target.polityId}`;
    case "district":
      return `district:${target.districtId}`;
  }
}

function formatM3Enfeoffments(values: readonly M3EnfeoffmentStateV0[]): string {
  return sortM3Enfeoffments(values)
    .map(
      (value) =>
        `${value.districtId}:${value.holderCharacterId}:${value.grantedByPolityId}:${value.policyId}:${value.grantedDay}:${value.reasonCode}`
    )
    .join(",");
}

function formatM3AppointmentAuditEvents(m3: M3PolityVassalageStateV0): string {
  return orderedM3AppointmentAuditEventsV0(m3)
    .map((value) =>
      [
        value.id,
        value.eventKind,
        value.eventDay,
        value.eventRevision,
        value.commandId,
        `${value.actor.kind}:${value.actor.id}`,
        formatNullableNumber(value.officeId),
        formatNullableNumber(value.characterId),
        formatNullableNumber(value.policyId),
        formatNullableNumber(value.districtId),
        value.reasonCode
      ].join(":")
    )
    .join(",");
}

function formatM3SuccessionCandidateProfiles(
  values: readonly M3SuccessionCandidateProfileStateV0[]
): string {
  return sortM3SuccessionCandidateProfiles(values)
    .map((value) =>
      [
        value.polityId,
        value.characterId,
        value.requiresRegency ? "1" : "0",
        formatM3SuccessionSupportSources(value.supportSources)
      ].join(":")
    )
    .join(",");
}

function formatM3SuccessionCrises(values: readonly M3SuccessionCrisisStateV0[]): string {
  return sortM3SuccessionCrises(values)
    .map((value) =>
      [
        value.id,
        value.polityId,
        formatM3SuccessionTrigger(value.trigger),
        value.status,
        value.startedDay,
        formatNullableNumber(value.resolvedDay),
        formatM3SuccessionCandidates(value.candidates),
        value.outcome === null ? "null" : formatM3SuccessionOutcome(value.outcome),
        value.reasonCode
      ].join(":")
    )
    .join(",");
}

function formatM3SuccessionTrigger(trigger: M3SuccessionTriggerV0): string {
  switch (trigger.kind) {
    case "death":
      return `death:${trigger.characterId}:${formatNullableNumber(trigger.officeId)}`;
    case "incapacity":
      return `incapacity:${trigger.characterId}:${formatNullableNumber(trigger.officeId)}`;
  }
}

function formatM3SuccessionCandidates(values: readonly M3SuccessionCandidateStateV0[]): string {
  return sortM3SuccessionCandidates(values)
    .map(
      (value) =>
        `${value.characterId}:${value.requiresRegency ? "1" : "0"}:${value.supportTotalBps}:${formatM3SuccessionSupportSources(value.supportSources)}`
    )
    .join("|");
}

function formatM3SuccessionSupportSources(
  values: readonly M3SuccessionSupportSourceStateV0[]
): string {
  return sortM3SuccessionSupportSources(values)
    .map((value) => `${value.kind}:${value.sourceId}:${value.strengthBps}`)
    .join("+");
}

function formatM3SuccessionOutcome(outcome: M3SuccessionOutcomeV0): string {
  switch (outcome.kind) {
    case "peaceful":
      return `peaceful:${outcome.successorCharacterId}:${outcome.supportTotalBps}`;
    case "regency":
      return `regency:${outcome.successorCharacterId}:${outcome.regentCharacterId}:${outcome.supportTotalBps}:${outcome.reasonCode}`;
    case "disputed":
      return `disputed:${outcome.leadingCharacterId}:${outcome.rivalCharacterId}:${outcome.supportMarginBps}:${outcome.reasonCode}`;
  }
}

function formatM2PopulationGroups(values: readonly M2PopulationGroupStateV0[]): string {
  return sortM2PopulationGroups(values)
    .map((value) =>
      [
        value.id,
        value.districtId,
        value.totalPeople,
        value.workingPeople,
        value.dependentPeople,
        value.availableLabor,
        formatM2LaborCommitments(value.committedLabor),
        value.grainStock,
        value.cashStock
      ].join(":")
    )
    .join(",");
}

function formatM2LaborCommitments(values: readonly M2LaborCommitmentStateV0[]): string {
  return sortM2LaborCommitments(values)
    .map((value) => `${value.purpose}:${value.laborAmount}:${value.startDay}:${value.releaseDay}`)
    .join("+");
}

function formatM2AgricultureDistricts(values: readonly M2DistrictAgricultureStateV0[]): string {
  return sortM2AgricultureDistricts(values)
    .map((value) =>
      [
        value.districtId,
        value.phase,
        value.daysInPhase,
        value.accumulatedFarmLabor,
        value.expectedHarvestGrain,
        value.lastHarvestGrain
      ].join(":")
    )
    .join(",");
}

function formatM2MarketDistricts(values: readonly M2DistrictMarketStateV0[]): string {
  return sortM2MarketDistricts(values)
    .map((value) =>
      [
        value.districtId,
        value.grainPriceCashPerHundred,
        value.cashFlow.cumulativeMobilizationCost,
        value.cashFlow.lastDailyCashDelta,
        value.grainFlow.lastHarvestDelta
      ].join(":")
    )
    .join(",");
}

function formatM2TransportRoutes(values: readonly M2RouteTransportEdgeStateV0[]): string {
  return sortM2TransportRoutes(values)
    .map((value) =>
      [
        value.routeId,
        value.fromDistrictId,
        value.toDistrictId,
        value.routeKind,
        value.baseTravelCost,
        value.baseCapacity
      ].join(":")
    )
    .join(",");
}

function formatM2DistrictSeasonality(values: readonly M2DistrictSeasonalityStateV0[]): string {
  return sortM2DistrictSeasonality(values)
    .map((value) => `${value.districtId}:${value.regionalCurveId}`)
    .join(",");
}

function formatM2RegionalSeasonalCurves(values: readonly M2RegionalSeasonalCurveStateV0[]): string {
  return sortM2RegionalSeasonalCurves(values)
    .map((value) => `${value.id}:${formatM2SeasonalMonths(value.monthlyValues)}`)
    .join(",");
}

function formatM2SeasonalMonths(values: readonly M2SeasonalMonthStateV0[]): string {
  return sortM2SeasonalMonths(values)
    .map((value) =>
      [
        value.month,
        value.monsoonIntensityBps,
        value.agricultureWorkBps,
        value.riverNavigabilityBps,
        value.roadTravelCostBps
      ].join(":")
    )
    .join("+");
}

function formatDistrictControl(control: DistrictControlState): string {
  switch (control.kind) {
    case "controlled":
      return `controlled:${control.controllerPolityId}`;
    case "uncontrolled":
      return "uncontrolled";
  }
}

function formatOptionalNumber(value: number | undefined): string {
  return value === undefined ? "none" : `${value}`;
}

function formatNullableNumber(value: number | null): string {
  return value === null ? "null" : `${value}`;
}

function formatNullableString(value: string | null): string {
  return value === null ? "null" : value;
}

function formatUnknown(value: unknown): string {
  switch (typeof value) {
    case "number":
    case "boolean":
    case "string":
      return `${value}`;
    case "undefined":
      return "undefined";
    case "object":
      return value === null ? "null" : "[object]";
    case "bigint":
    case "function":
    case "symbol":
      return `[${typeof value}]`;
  }
}

function hashText(text: string): number {
  let hash = INITIAL_HASH_OFFSET;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, HASH_PRIME) >>> 0;
  }

  return hash;
}

function toFixedHexHash(hash: number): string {
  return hash.toString(16).padStart(8, "0");
}

function validateScheduler(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  if (getRecordPath(world, ["scheduler", "schedulerVersion"]) !== GAME_DAY_SCHEDULER_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler.schedulerVersion",
      message: `Scheduler schedulerVersion must be ${GAME_DAY_SCHEDULER_VERSION}.`
    });
  }

  if (
    getRecordPath(world, ["scheduler", "systemOrderVersion"]) !== DETERMINISTIC_SYSTEM_ORDER_VERSION
  ) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler.systemOrderVersion",
      message: `Scheduler systemOrderVersion must be ${DETERMINISTIC_SYSTEM_ORDER_VERSION}.`
    });
  }

  if (getRecordPath(world, ["scheduler", "fixedStepDurationInDays"]) !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler.fixedStepDurationInDays",
      message: "Scheduler fixedStepDurationInDays must be 1."
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["scheduler", "lastCompletedDay"]))) {
    errors.push({
      code: "invalid-day",
      path: "scheduler.lastCompletedDay",
      message: "Scheduler lastCompletedDay must be a nonnegative safe integer."
    });
  }

  if (
    isNonnegativeInteger(getRecordPath(world, ["scheduler", "lastCompletedDay"])) &&
    isNonnegativeInteger(getRecordPath(world, ["meta", "currentDay"])) &&
    getRecordPath(world, ["scheduler", "lastCompletedDay"]) !==
      getRecordPath(world, ["meta", "currentDay"])
  ) {
    errors.push({
      code: "invalid-day",
      path: "scheduler.lastCompletedDay",
      message: "Scheduler lastCompletedDay must equal WorldState meta.currentDay."
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["scheduler", "pendingCommandCount"]))) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler.pendingCommandCount",
      message: "Scheduler pendingCommandCount must be a nonnegative safe integer."
    });
  }
}

function validateMeta(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  if (getRecordPath(world, ["meta", "schemaVersion"]) !== WORLD_STATE_V0_SCHEMA_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "meta.schemaVersion",
      message: `WorldState schemaVersion must be ${WORLD_STATE_V0_SCHEMA_VERSION}.`
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["meta", "seed"]))) {
    errors.push({
      code: "invalid-schema",
      path: "meta.seed",
      message: "WorldState seed must be a nonnegative safe integer."
    });
  }

  const contentManifestHash = getRecordPath(world, ["meta", "contentManifestHash"]);
  if (typeof contentManifestHash !== "string" || contentManifestHash.length === 0) {
    errors.push({
      code: "invalid-schema",
      path: "meta.contentManifestHash",
      message: "WorldState contentManifestHash must be a non-empty string."
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["meta", "currentDay"]))) {
    errors.push({
      code: "invalid-day",
      path: "meta.currentDay",
      message: "WorldState currentDay must be a nonnegative safe integer."
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["meta", "revision"]))) {
    errors.push({
      code: "invalid-revision",
      path: "meta.revision",
      message: "WorldState revision must be a nonnegative safe integer."
    });
  }

  if (getRecordPath(world, ["meta", "hashAlgorithm"]) !== "fnv1a32-canonical-world-state-v0") {
    errors.push({
      code: "invalid-schema",
      path: "meta.hashAlgorithm",
      message: "WorldState hashAlgorithm must be fnv1a32-canonical-world-state-v0."
    });
  }

  if (typeof getRecordPath(world, ["meta", "stateHash"]) !== "string") {
    errors.push({
      code: "invalid-schema",
      path: "meta.stateHash",
      message: "WorldState stateHash must be a string."
    });
  }
}

function validateDefinitions(definitions: WorldDefinitionsV0, errors: WorldInvariantError[]): void {
  validateDuplicateIds(definitions.polities, "PolityId", "definitions.polities", errors);
  validateDuplicateIds(definitions.persons, "PersonId", "definitions.persons", errors);
  validateDuplicateIds(definitions.districts, "DistrictId", "definitions.districts", errors);
  validateDuplicateIds(definitions.settlements, "SettlementId", "definitions.settlements", errors);
  validateDuplicateIds(definitions.routes, "RouteId", "definitions.routes", errors);
}

function validateDuplicateIds(
  values: readonly { readonly id: number }[],
  label: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<number>();

  for (const value of values) {
    if (!isPositiveInteger(value.id)) {
      errors.push({
        code: "invalid-schema",
        path,
        message: `${label} ${formatUnknown(value.id)} must be a positive safe integer.`
      });
      continue;
    }

    if (seen.has(value.id)) {
      errors.push({
        code: "duplicate-definition-id",
        path,
        message: `Duplicate ${label} ${value.id}.`
      });
      continue;
    }

    seen.add(value.id);
  }
}

function validateDefinitionReferences(
  definitions: WorldDefinitionsV0,
  errors: WorldInvariantError[]
): void {
  const districtIds = idsOf(definitions.districts);

  definitions.settlements.forEach((settlement, index) => {
    if (!districtIds.has(settlement.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.settlements[${index}].districtId`,
        message: `Settlement ${settlement.id} references missing DistrictId ${settlement.districtId}.`
      });
    }
  });

  definitions.routes.forEach((route, index) => {
    if (!districtIds.has(route.fromDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.routes[${index}].fromDistrictId`,
        message: `Route ${route.id} references missing from DistrictId ${route.fromDistrictId}.`
      });
    }

    if (!districtIds.has(route.toDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.routes[${index}].toDistrictId`,
        message: `Route ${route.id} references missing to DistrictId ${route.toDistrictId}.`
      });
    }
  });
}

function validateRuntimeState(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const polityIds = idsOf(world.definitions.polities);
  const personIds = idsOf(world.definitions.persons);
  const districtIds = idsOf(world.definitions.districts);
  const settlementIds = idsOf(world.definitions.settlements);
  const routeIds = idsOf(world.definitions.routes);

  world.state.polities.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      polityIds,
      `state.polities[${index}].definitionId`,
      "PolityId",
      errors
    );
  });

  world.state.persons.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      personIds,
      `state.persons[${index}].definitionId`,
      "PersonId",
      errors
    );

    if (state.currentDistrictId !== undefined && !districtIds.has(state.currentDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.persons[${index}].currentDistrictId`,
        message: `PersonState ${state.definitionId} references missing DistrictId ${state.currentDistrictId}.`
      });
    }
  });

  world.state.districts.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      districtIds,
      `state.districts[${index}].definitionId`,
      "DistrictId",
      errors
    );

    if (state.control.kind === "controlled" && !polityIds.has(state.control.controllerPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.districts[${index}].control.controllerPolityId`,
        message: `DistrictState ${state.definitionId} references missing PolityId ${state.control.controllerPolityId}.`
      });
    }
  });

  world.state.settlements.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      settlementIds,
      `state.settlements[${index}].definitionId`,
      "SettlementId",
      errors
    );

    if (!districtIds.has(state.currentDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.settlements[${index}].currentDistrictId`,
        message: `SettlementState ${state.definitionId} references missing DistrictId ${state.currentDistrictId}.`
      });
    }
  });

  world.state.routes.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      routeIds,
      `state.routes[${index}].definitionId`,
      "RouteId",
      errors
    );
  });
}

function validateM2RuntimeState(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const m2 = getRecordPath(world, ["state", "m2"]);
  if (!isM2StateLike(m2)) {
    return;
  }

  const districtIds = idsOf(world.definitions.districts);
  validateM2DistrictCoverage({
    definitionIds: districtIds,
    runtimeIds: m2.populationGroups.map((group) => group.districtId),
    statePath: "state.m2.populationGroups",
    stateLabel: "M2PopulationGroupState",
    errors
  });
  validateM2DistrictCoverage({
    definitionIds: districtIds,
    runtimeIds: m2.agriculture.districts.map((district) => district.districtId),
    statePath: "state.m2.agriculture.districts",
    stateLabel: "M2DistrictAgricultureState",
    errors
  });
  validateM2DistrictCoverage({
    definitionIds: districtIds,
    runtimeIds: m2.market.districts.map((district) => district.districtId),
    statePath: "state.m2.market.districts",
    stateLabel: "M2DistrictMarketState",
    errors
  });
  validateM2DistrictCoverage({
    definitionIds: districtIds,
    runtimeIds: m2.transport.districtSeasonality.map((entry) => entry.districtId),
    statePath: "state.m2.transport.districtSeasonality",
    stateLabel: "M2DistrictSeasonalityState",
    errors
  });

  const populationGroupIds = new Set<number>();
  m2.populationGroups.forEach((group, index) => {
    if (populationGroupIds.has(group.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m2.populationGroups",
        message: `Duplicate M2PopulationGroupState row for PopulationGroupId ${group.id}.`
      });
    }
    populationGroupIds.add(group.id);

    if (!districtIds.has(group.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m2.populationGroups[${index}].districtId`,
        message: `M2PopulationGroupState ${group.id} references missing DistrictId ${group.districtId}.`
      });
    }

    const committedLabor = group.committedLabor.reduce(
      (sum, commitment) => sum + commitment.laborAmount,
      0
    );
    if (group.totalPeople !== group.workingPeople + group.dependentPeople) {
      errors.push({
        code: "invalid-schema",
        path: `state.m2.populationGroups[${index}].totalPeople`,
        message: "M2 population totalPeople must equal workingPeople plus dependentPeople."
      });
    }
    if (group.availableLabor + committedLabor !== group.workingPeople) {
      errors.push({
        code: "invalid-schema",
        path: `state.m2.populationGroups[${index}].availableLabor`,
        message: "M2 availableLabor plus committed labor must equal workingPeople."
      });
    }

    group.committedLabor.forEach((commitment, commitmentIndex) => {
      if (commitment.releaseDay <= commitment.startDay) {
        errors.push({
          code: "invalid-day",
          path: `state.m2.populationGroups[${index}].committedLabor[${commitmentIndex}].releaseDay`,
          message: "M2 labor commitment releaseDay must be greater than startDay."
        });
      }
    });
  });

  const routeIds = new Set<number>();
  const routeDefinitionById = new Map<number, RouteDefinition>();
  for (const route of world.definitions.routes) {
    routeDefinitionById.set(route.id, route);
  }
  m2.transport.routes.forEach((route, index) => {
    if (routeIds.has(route.routeId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m2.transport.routes",
        message: `Duplicate M2RouteTransportEdgeState row for RouteId ${route.routeId}.`
      });
    }
    routeIds.add(route.routeId);

    const definition = routeDefinitionById.get(route.routeId);
    if (definition === undefined) {
      errors.push({
        code: "bad-reference",
        path: `state.m2.transport.routes[${index}].routeId`,
        message: `M2RouteTransportEdgeState references missing RouteId ${route.routeId}.`
      });
    } else {
      if (route.fromDistrictId !== definition.fromDistrictId) {
        errors.push({
          code: "bad-reference",
          path: `state.m2.transport.routes[${index}].fromDistrictId`,
          message: "M2 route transport fromDistrictId must match RouteDefinition."
        });
      }
      if (route.toDistrictId !== definition.toDistrictId) {
        errors.push({
          code: "bad-reference",
          path: `state.m2.transport.routes[${index}].toDistrictId`,
          message: "M2 route transport toDistrictId must match RouteDefinition."
        });
      }
    }

    if (!districtIds.has(route.fromDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m2.transport.routes[${index}].fromDistrictId`,
        message: `M2RouteTransportEdgeState references missing from DistrictId ${route.fromDistrictId}.`
      });
    }
    if (!districtIds.has(route.toDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m2.transport.routes[${index}].toDistrictId`,
        message: `M2RouteTransportEdgeState references missing to DistrictId ${route.toDistrictId}.`
      });
    }
  });

  for (const definitionId of routeDefinitionById.keys()) {
    if (!routeIds.has(definitionId)) {
      errors.push({
        code: "missing-runtime-state-row",
        path: "state.m2.transport.routes",
        message: `Missing M2RouteTransportEdgeState row for RouteId ${definitionId}.`
      });
    }
  }

  const curveIds = new Set<number>();
  m2.transport.regionalCurves.forEach((curve) => {
    if (curveIds.has(curve.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m2.transport.regionalCurves",
        message: `Duplicate M2RegionalSeasonalCurveState row for RegionalSeasonalCurveId ${curve.id}.`
      });
    }
    curveIds.add(curve.id);
  });
  m2.transport.districtSeasonality.forEach((entry, index) => {
    if (!curveIds.has(entry.regionalCurveId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m2.transport.districtSeasonality[${index}].regionalCurveId`,
        message: `M2DistrictSeasonalityState references missing RegionalSeasonalCurveId ${entry.regionalCurveId}.`
      });
    }
  });
}

function validateM3RuntimeState(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const m3 = getRecordPath(world, ["state", "m3"]);
  if (!isM3StateLike(m3)) {
    return;
  }

  const polityIds = idsOf(world.definitions.polities);
  validateM3PolityCoverage(m3, polityIds, errors);
  validateM3SuzerainAcyclicity(m3, errors);
  validateM3ObligationSemantics(m3, polityIds, errors);
  validateM3AuditSemantics(m3, errors);
  validateM3FulfillmentSemantics(m3, errors);
  validateM3AdministrativeSemantics(m3, polityIds, idsOf(world.definitions.districts), errors);
  validateM3AppointmentSemantics(
    m3,
    idsOf(world.definitions.persons),
    polityIds,
    idsOf(world.definitions.districts),
    errors
  );
}

function validateM3PolityCoverage(
  m3: M3PolityVassalageStateV0,
  polityIds: ReadonlySet<number>,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<number>();
  m3.polities.forEach((polity, index) => {
    if (seen.has(polity.polityId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.polities",
        message: `Duplicate M3PolityRecordState row for PolityId ${polity.polityId}.`
      });
    }
    seen.add(polity.polityId);
    if (!polityIds.has(polity.polityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.polities[${index}].polityId`,
        message: `M3 polity record references missing PolityId ${polity.polityId}.`
      });
    }
    if (polity.directSuzerainPolityId !== null && !polityIds.has(polity.directSuzerainPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.polities[${index}].directSuzerainPolityId`,
        message: `M3 polity record references missing suzerain PolityId ${polity.directSuzerainPolityId}.`
      });
    }
    if (polity.directSuzerainPolityId === polity.polityId) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.polities[${index}].directSuzerainPolityId`,
        message: "M3 polity direct suzerain must not reference itself."
      });
    }
  });

  for (const polityId of polityIds) {
    if (!seen.has(polityId)) {
      errors.push({
        code: "missing-runtime-state-row",
        path: "state.m3.polities",
        message: `Missing M3PolityRecordState row for PolityId ${polityId}.`
      });
    }
  }
}

function validateM3SuzerainAcyclicity(
  m3: M3PolityVassalageStateV0,
  errors: WorldInvariantError[]
): void {
  const suzerainByPolityId = new Map<number, number>();
  for (const polity of m3.polities) {
    if (polity.directSuzerainPolityId !== null) {
      suzerainByPolityId.set(polity.polityId, polity.directSuzerainPolityId);
    }
  }

  for (const polity of sortM3PolityRecords(m3.polities)) {
    const visited = new Set<number>();
    let current: number | undefined = polity.polityId;
    while (current !== undefined) {
      if (visited.has(current)) {
        errors.push({
          code: "bad-reference",
          path: "state.m3.polities",
          message: `M3 suzerain chain contains a cycle at PolityId ${current}.`
        });
        return;
      }
      visited.add(current);
      current = suzerainByPolityId.get(current);
    }
  }
}

function validateM3ObligationSemantics(
  m3: M3PolityVassalageStateV0,
  polityIds: ReadonlySet<number>,
  errors: WorldInvariantError[]
): void {
  const obligationIds = new Set<number>();
  m3.obligations.forEach((obligation, index) => {
    if (obligationIds.has(obligation.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.obligations",
        message: `Duplicate M3ObligationState row for M3ObligationId ${obligation.id}.`
      });
    }
    obligationIds.add(obligation.id);
    if (!polityIds.has(obligation.debtorPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligations[${index}].debtorPolityId`,
        message: `M3 obligation references missing debtor PolityId ${obligation.debtorPolityId}.`
      });
    }
    if (!polityIds.has(obligation.creditorPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligations[${index}].creditorPolityId`,
        message: `M3 obligation references missing creditor PolityId ${obligation.creditorPolityId}.`
      });
    }
    if (obligation.debtorPolityId === obligation.creditorPolityId) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligations[${index}].creditorPolityId`,
        message: "M3 obligation creditor and debtor must be different polities."
      });
    }
    if (!isRecord(obligation.obligationSource)) {
      return;
    }
    if (
      obligation.obligationSource.debtorPolityId !== obligation.debtorPolityId ||
      obligation.obligationSource.creditorPolityId !== obligation.creditorPolityId
    ) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligations[${index}].obligationSource`,
        message: "M3 obligation source must match debtor and creditor polities."
      });
    }
    if (isRecord(obligation.accounting)) {
      validateNonnegativeM3Accounting(obligation, index, errors);
    }
    if (obligation.status === "disputed" && obligation.disputeReasonCode === null) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.obligations[${index}].disputeReasonCode`,
        message: "M3 disputed obligation must include a disputeReasonCode."
      });
    }
    if (obligation.status === "breached" && obligation.breachReasonCode === null) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.obligations[${index}].breachReasonCode`,
        message: "M3 breached obligation must include a breachReasonCode."
      });
    }
  });
}

function validateM3AuditSemantics(
  m3: M3PolityVassalageStateV0,
  errors: WorldInvariantError[]
): void {
  const obligationIds = new Set(m3.obligations.map((obligation) => obligation.id));
  const auditIds = new Set<number>();
  m3.obligationAuditEvents.forEach((event, index) => {
    if (auditIds.has(event.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.obligationAuditEvents",
        message: `Duplicate M3ObligationAuditEventState row for M3ObligationAuditEventId ${event.id}.`
      });
    }
    auditIds.add(event.id);
    if (!obligationIds.has(event.obligationId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligationAuditEvents[${index}].obligationId`,
        message: `M3 audit event references missing M3ObligationId ${event.obligationId}.`
      });
    }
    if (event.reliabilityBps < 0 || event.reliabilityBps > 10_000) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.obligationAuditEvents[${index}].reliabilityBps`,
        message: "M3 audit event reliabilityBps must be from 0 to 10000."
      });
    }
  });

  m3.obligations.forEach((obligation, index) => {
    if (!auditIds.has(obligation.createdAuditEventId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligations[${index}].createdAuditEventId`,
        message: `M3 obligation references missing created audit event ${obligation.createdAuditEventId}.`
      });
    }
    if (!auditIds.has(obligation.latestAuditEventId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.obligations[${index}].latestAuditEventId`,
        message: `M3 obligation references missing latest audit event ${obligation.latestAuditEventId}.`
      });
    }
  });
}

function validateM3FulfillmentSemantics(
  m3: M3PolityVassalageStateV0,
  errors: WorldInvariantError[]
): void {
  const obligationIds = new Set(m3.obligations.map((obligation) => obligation.id));
  const auditIds = new Set(m3.obligationAuditEvents.map((event) => event.id));
  const fulfillmentIds = new Set<number>();
  m3.fulfillmentClaims.forEach((claim, index) => {
    if (fulfillmentIds.has(claim.fulfillmentId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.fulfillmentClaims",
        message: `Duplicate M3FulfillmentClaimState row for M3FulfillmentId ${claim.fulfillmentId}.`
      });
    }
    fulfillmentIds.add(claim.fulfillmentId);
    if (!obligationIds.has(claim.obligationId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.fulfillmentClaims[${index}].obligationId`,
        message: `M3 fulfillment claim references missing M3ObligationId ${claim.obligationId}.`
      });
    }
    if (!auditIds.has(claim.auditEventId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.fulfillmentClaims[${index}].auditEventId`,
        message: `M3 fulfillment claim references missing M3ObligationAuditEventId ${claim.auditEventId}.`
      });
    }
    if (
      claim.fulfilledAmount < 0 ||
      claim.deliveredAmount < 0 ||
      claim.arrearsAmount < 0 ||
      claim.defaultedAmount < 0
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.fulfillmentClaims[${index}]`,
        message: "M3 fulfillment claim accounting amounts must be nonnegative."
      });
    }
  });
}

function validateNonnegativeM3Accounting(
  obligation: M3ObligationStateV0,
  index: number,
  errors: WorldInvariantError[]
): void {
  const accounting = obligation.accounting;
  if (
    accounting.nominalAmount < 0 ||
    accounting.dueAmount < 0 ||
    accounting.deliveredAmount < 0 ||
    accounting.arrearsAmount < 0 ||
    accounting.defaultedAmount < 0 ||
    accounting.remittedAmount < 0 ||
    accounting.cycle < 1
  ) {
    errors.push({
      code: "invalid-schema",
      path: `state.m3.obligations[${index}].accounting`,
      message: "M3 obligation accounting amounts must be nonnegative and cycle must be positive."
    });
  }
}

function validateM3AdministrativeSemantics(
  m3: M3PolityVassalageStateV0,
  polityIds: ReadonlySet<number>,
  districtIds: ReadonlySet<number>,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<string>();
  m3.administrativeDistricts.forEach((entry, index) => {
    const key = `${entry.polityId}:${entry.districtId}:${entry.controlMode}`;
    if (seen.has(key)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.administrativeDistricts",
        message:
          "Duplicate M3AdministrativeDistrictState row for polity, district, and control mode."
      });
    }
    seen.add(key);
    if (!polityIds.has(entry.polityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.administrativeDistricts[${index}].polityId`,
        message: `M3 administrative district references missing PolityId ${entry.polityId}.`
      });
    }
    if (!districtIds.has(entry.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.administrativeDistricts[${index}].districtId`,
        message: `M3 administrative district references missing DistrictId ${entry.districtId}.`
      });
    }
  });
}

function validateM3AppointmentSemantics(
  m3: M3PolityVassalageStateV0,
  personIds: ReadonlySet<number>,
  polityIds: ReadonlySet<number>,
  districtIds: ReadonlySet<number>,
  errors: WorldInvariantError[]
): void {
  const characterIds = new Set<number>();
  const availableCharacterIds = new Set<number>();
  m3.characters.forEach((character, index) => {
    if (characterIds.has(character.characterId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.characters",
        message: `Duplicate M3CharacterState row for PersonId ${character.characterId}.`
      });
    }
    characterIds.add(character.characterId);
    if (!personIds.has(character.characterId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.characters[${index}].characterId`,
        message: `M3 character references missing PersonId ${character.characterId}.`
      });
    }
    if (!polityIds.has(character.polityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.characters[${index}].polityId`,
        message: `M3 character references missing PolityId ${character.polityId}.`
      });
    }
    if (!districtIds.has(character.currentDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.characters[${index}].currentDistrictId`,
        message: `M3 character references missing DistrictId ${character.currentDistrictId}.`
      });
    }
    if (!character.alive && character.incapacitated) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.characters[${index}].incapacitated`,
        message: "Dead M3 character cannot be incapacitated."
      });
    }
    if (character.alive && !character.incapacitated) {
      availableCharacterIds.add(character.characterId);
    }
  });

  m3.relationships.forEach((relationship, index) => {
    if (!characterIds.has(relationship.sourceCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.relationships[${index}].sourceCharacterId`,
        message: "M3 relationship references missing source character."
      });
    }
    if (!characterIds.has(relationship.targetCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.relationships[${index}].targetCharacterId`,
        message: "M3 relationship references missing target character."
      });
    }
  });

  const officeIds = new Set<number>();
  const primaryHolderIds = new Set<number>();
  m3.offices.forEach((office, index) => {
    if (officeIds.has(office.officeId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.offices",
        message: `Duplicate M3OfficeState row for M3OfficeId ${office.officeId}.`
      });
    }
    officeIds.add(office.officeId);
    if (!polityIds.has(office.polityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.offices[${index}].polityId`,
        message: `M3 office references missing PolityId ${office.polityId}.`
      });
    }
    validateM3OfficeJurisdictionReferences(
      office.jurisdiction,
      polityIds,
      districtIds,
      index,
      errors
    );
    if (office.holderCharacterId !== null && !characterIds.has(office.holderCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.offices[${index}].holderCharacterId`,
        message: "M3 office holder references missing character."
      });
    }
    if (
      office.holderCharacterId !== null &&
      characterIds.has(office.holderCharacterId) &&
      !availableCharacterIds.has(office.holderCharacterId)
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.offices[${index}].holderCharacterId`,
        message: "M3 office holder must be alive and not incapacitated."
      });
    }
    if (office.primary && office.holderCharacterId !== null) {
      if (primaryHolderIds.has(office.holderCharacterId)) {
        errors.push({
          code: "duplicate-runtime-state-row",
          path: "state.m3.offices",
          message: "M3 primary office holder appears in more than one primary office."
        });
      }
      primaryHolderIds.add(office.holderCharacterId);
    }
  });

  const policyIds = new Set<number>();
  m3.policies.forEach((policy, index) => {
    if (policyIds.has(policy.policyId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.policies",
        message: `Duplicate M3PolicyState row for M3PolicyId ${policy.policyId}.`
      });
    }
    policyIds.add(policy.policyId);
    validateM3PolicyTargetReferences(
      policy.target,
      officeIds,
      polityIds,
      districtIds,
      index,
      errors
    );
  });

  m3.offices.forEach((office, index) => {
    if (!policyIds.has(office.policyId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.offices[${index}].policyId`,
        message: `M3 office references missing M3PolicyId ${office.policyId}.`
      });
    }
  });

  const enfeoffedDistrictIds = new Set<number>();
  m3.enfeoffments.forEach((enfeoffment, index) => {
    if (enfeoffedDistrictIds.has(enfeoffment.districtId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.enfeoffments",
        message: "Duplicate M3EnfeoffmentState row for DistrictId."
      });
    }
    enfeoffedDistrictIds.add(enfeoffment.districtId);
    if (!districtIds.has(enfeoffment.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.enfeoffments[${index}].districtId`,
        message: `M3 enfeoffment references missing DistrictId ${enfeoffment.districtId}.`
      });
    }
    if (!characterIds.has(enfeoffment.holderCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.enfeoffments[${index}].holderCharacterId`,
        message: "M3 enfeoffment references missing holder character."
      });
    }
    if (
      characterIds.has(enfeoffment.holderCharacterId) &&
      !availableCharacterIds.has(enfeoffment.holderCharacterId)
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.enfeoffments[${index}].holderCharacterId`,
        message: "M3 enfeoffment holder must be alive and not incapacitated."
      });
    }
    if (!polityIds.has(enfeoffment.grantedByPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.enfeoffments[${index}].grantedByPolityId`,
        message: "M3 enfeoffment references missing granting polity."
      });
    }
    if (!policyIds.has(enfeoffment.policyId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.enfeoffments[${index}].policyId`,
        message: "M3 enfeoffment references missing jurisdiction policy."
      });
    }
  });

  m3.successionCandidateProfiles.forEach((profile, index) => {
    if (!polityIds.has(profile.polityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.successionCandidateProfiles[${index}].polityId`,
        message: "M3 succession candidate profile references missing polity."
      });
    }
    if (!characterIds.has(profile.characterId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.successionCandidateProfiles[${index}].characterId`,
        message: "M3 succession candidate profile references missing character."
      });
    }
  });

  const successionIds = new Set<number>();
  m3.successionCrises.forEach((crisis, index) => {
    if (successionIds.has(crisis.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m3.successionCrises",
        message: `Duplicate M3SuccessionCrisisState row for M3SuccessionId ${crisis.id}.`
      });
    }
    successionIds.add(crisis.id);
    if (!polityIds.has(crisis.polityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m3.successionCrises[${index}].polityId`,
        message: "M3 succession crisis references missing polity."
      });
    }
    validateM3SuccessionTriggerReferences(crisis.trigger, characterIds, officeIds, index, errors);
    crisis.candidates.forEach((candidate, candidateIndex) => {
      if (!characterIds.has(candidate.characterId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.successionCrises[${index}].candidates[${candidateIndex}].characterId`,
          message: "M3 succession candidate references missing character."
        });
      }
    });
    if (crisis.status === "pending" && crisis.outcome !== null) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.successionCrises[${index}].outcome`,
        message: "M3 pending succession crisis must not have an outcome."
      });
    }
    if (crisis.status === "resolved" && crisis.outcome === null) {
      errors.push({
        code: "invalid-schema",
        path: `state.m3.successionCrises[${index}].outcome`,
        message: "M3 resolved succession crisis must include an outcome."
      });
    }
  });
}

function validateM3SuccessionTriggerReferences(
  trigger: M3SuccessionTriggerV0,
  characterIds: ReadonlySet<number>,
  officeIds: ReadonlySet<number>,
  crisisIndex: number,
  errors: WorldInvariantError[]
): void {
  if (!characterIds.has(trigger.characterId)) {
    errors.push({
      code: "bad-reference",
      path: `state.m3.successionCrises[${crisisIndex}].trigger.characterId`,
      message: "M3 succession trigger references missing character."
    });
  }
  if (trigger.officeId !== null && !officeIds.has(trigger.officeId)) {
    errors.push({
      code: "bad-reference",
      path: `state.m3.successionCrises[${crisisIndex}].trigger.officeId`,
      message: "M3 succession trigger references missing office."
    });
  }
}

function validateM3OfficeJurisdictionReferences(
  jurisdiction: M3OfficeJurisdictionV0,
  polityIds: ReadonlySet<number>,
  districtIds: ReadonlySet<number>,
  officeIndex: number,
  errors: WorldInvariantError[]
): void {
  switch (jurisdiction.kind) {
    case "polity":
      if (!polityIds.has(jurisdiction.polityId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.offices[${officeIndex}].jurisdiction.polityId`,
          message: "M3 office jurisdiction references missing PolityId."
        });
      }
      return;
    case "district":
      if (!districtIds.has(jurisdiction.districtId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.offices[${officeIndex}].jurisdiction.districtId`,
          message: "M3 office jurisdiction references missing DistrictId."
        });
      }
      return;
  }
}

function validateM3PolicyTargetReferences(
  target: M3PolicyTargetV0,
  officeIds: ReadonlySet<number>,
  polityIds: ReadonlySet<number>,
  districtIds: ReadonlySet<number>,
  policyIndex: number,
  errors: WorldInvariantError[]
): void {
  switch (target.kind) {
    case "office":
      if (!officeIds.has(target.officeId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.policies[${policyIndex}].target.officeId`,
          message: "M3 policy target references missing office."
        });
      }
      return;
    case "polity":
      if (!polityIds.has(target.polityId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.policies[${policyIndex}].target.polityId`,
          message: "M3 policy target references missing PolityId."
        });
      }
      return;
    case "district":
      if (!districtIds.has(target.districtId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.policies[${policyIndex}].target.districtId`,
          message: "M3 policy target references missing DistrictId."
        });
      }
      return;
  }
}

function validateM4RuntimeState(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return;
  }
  if (!isM4StateLike(m4)) {
    return;
  }

  const planIds = new Set<number>();
  const polityIds = idsOf(world.definitions.polities);
  const personIds = idsOf(world.definitions.persons);
  const districtIds = idsOf(world.definitions.districts);
  const routeIds = idsOf(world.definitions.routes);
  const populationGroupById = new Map<number, M2PopulationGroupStateV0>();
  world.state.m2?.populationGroups.forEach((group) => {
    populationGroupById.set(group.id, group);
  });
  const m3ObligationById = new Map<number, M3ObligationStateV0>();
  world.state.m3?.obligations.forEach((obligation) => {
    m3ObligationById.set(obligation.id, obligation);
  });

  m4.campaignPlans.forEach((plan, index) => {
    if (planIds.has(plan.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.campaignPlans",
        message: `Duplicate M4 campaign plan row for CampaignPlanId ${plan.id}.`
      });
    }
    planIds.add(plan.id);
    validateM4OwnerReference(
      plan.owner,
      polityIds,
      personIds,
      `state.m4.campaignPlans[${index}].owner`,
      errors
    );
    validateM4TargetReference(
      plan.target,
      polityIds,
      districtIds,
      `state.m4.campaignPlans[${index}].target`,
      errors
    );
    if (plan.startWindow.earliestDay > plan.startWindow.latestDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.campaignPlans[${index}].startWindow`,
        message: "M4 campaign startWindow earliestDay must be <= latestDay."
      });
    }
    if (plan.updatedDay < plan.createdDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.campaignPlans[${index}].updatedDay`,
        message: "M4 campaign updatedDay must be >= createdDay."
      });
    }
  });

  const commitmentIds = new Set<number>();
  m4.mobilizedForceCommitments.forEach((commitment, index) => {
    if (commitmentIds.has(commitment.id)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.mobilizedForceCommitments",
        message: `Duplicate M4 mobilized force commitment row for MobilizedForceCommitmentId ${commitment.id}.`
      });
    }
    commitmentIds.add(commitment.id);
    if (!planIds.has(commitment.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.mobilizedForceCommitments[${index}].campaignPlanId`,
        message: "M4 muster commitment references missing CampaignPlanId."
      });
    }
    validateM4MusterCommitmentSourceReference(
      commitment.source,
      m3ObligationById,
      `state.m4.mobilizedForceCommitments[${index}].source`,
      errors
    );
    if (commitment.assemblyWindow.earliestDay > commitment.assemblyWindow.latestDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.mobilizedForceCommitments[${index}].assemblyWindow`,
        message: "M4 muster assemblyWindow earliestDay must be <= latestDay."
      });
    }
    if (
      commitment.plannedAssemblyDay < commitment.assemblyWindow.earliestDay ||
      commitment.plannedAssemblyDay > commitment.assemblyWindow.latestDay
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.mobilizedForceCommitments[${index}].plannedAssemblyDay`,
        message: "M4 plannedAssemblyDay must be inside assemblyWindow."
      });
    }
    if (commitment.dueDay < commitment.assemblyWindow.earliestDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.mobilizedForceCommitments[${index}].dueDay`,
        message: "M4 muster dueDay must be >= assemblyWindow earliestDay."
      });
    }
    validateM4MusterCommitmentQuantities(commitment, index, errors);
    commitment.localCostHooks.forEach((hook, hookIndex) => {
      validateM4MusterCostHookReference(
        hook,
        polityIds,
        districtIds,
        `state.m4.mobilizedForceCommitments[${index}].localCostHooks[${hookIndex}]`,
        errors
      );
    });
  });

  const supplySourceKeys = new Set<string>();
  const supplyCampaignByReservationId = new Map<number, number>();
  m4.grainSupplyReservations.forEach((reservation, index) => {
    const key = `${reservation.reservationId}:${formatM4GrainSupplySource(reservation.source)}`;
    if (supplySourceKeys.has(key)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.grainSupplyReservations",
        message: `Duplicate M4 grain supply source row for GrainSupplyReservationId ${reservation.reservationId}.`
      });
    }
    supplySourceKeys.add(key);
    const existingCampaignPlanId = supplyCampaignByReservationId.get(reservation.reservationId);
    if (
      existingCampaignPlanId !== undefined &&
      existingCampaignPlanId !== reservation.campaignPlanId
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.grainSupplyReservations[${index}].reservationId`,
        message: "M4 grain supply reservationId must belong to exactly one CampaignPlanId."
      });
    }
    supplyCampaignByReservationId.set(reservation.reservationId, reservation.campaignPlanId);
    if (!planIds.has(reservation.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.grainSupplyReservations[${index}].campaignPlanId`,
        message: "M4 grain supply reservation references missing CampaignPlanId."
      });
    }
    validateM4GrainSupplySourceReference(
      reservation.source,
      populationGroupById,
      `state.m4.grainSupplyReservations[${index}].source`,
      errors
    );
    validateM4GrainSupplyReservationQuantities(reservation, index, errors);
  });

  const marchIds = new Set<number>();
  (m4.marches ?? []).forEach((march, index) => {
    if (marchIds.has(march.marchId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.marches",
        message: `Duplicate M4 campaign march row for CampaignMarchId ${march.marchId}.`
      });
    }
    marchIds.add(march.marchId);
    if (!planIds.has(march.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.marches[${index}].campaignPlanId`,
        message: "M4 campaign march references missing CampaignPlanId."
      });
    }
    if (!districtIds.has(march.originDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.marches[${index}].originDistrictId`,
        message: "M4 campaign march references missing origin DistrictId."
      });
    }
    if (!districtIds.has(march.targetDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.marches[${index}].targetDistrictId`,
        message: "M4 campaign march references missing target DistrictId."
      });
    }
    if (!districtIds.has(march.currentDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.marches[${index}].currentDistrictId`,
        message: "M4 campaign march references missing current DistrictId."
      });
    }
    if (march.currentSegmentIndex > march.routeSegments.length) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.marches[${index}].currentSegmentIndex`,
        message: "M4 campaign march currentSegmentIndex exceeds route segment count."
      });
    }
    if (march.predictedArrivalWindow.earliestDay > march.predictedArrivalWindow.latestDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.marches[${index}].predictedArrivalWindow`,
        message: "M4 campaign march predicted arrival earliestDay must be <= latestDay."
      });
    }
    validateUniqueNumberArray(
      march.joinedCommitmentIds,
      `state.m4.marches[${index}].joinedCommitmentIds`,
      "M4 campaign march joinedCommitmentIds must not contain duplicates.",
      errors
    );
    validateUniqueNumberArray(
      march.failedCommitmentIds,
      `state.m4.marches[${index}].failedCommitmentIds`,
      "M4 campaign march failedCommitmentIds must not contain duplicates.",
      errors
    );
    validateUniqueNumberArray(
      march.joinedCommitmentTroops.map((entry) => entry.commitmentId),
      `state.m4.marches[${index}].joinedCommitmentTroops`,
      "M4 campaign march joinedCommitmentTroops must not contain duplicate commitmentIds.",
      errors
    );
    const joinedTroopCommitmentIds = new Set(
      march.joinedCommitmentTroops.map((entry) => entry.commitmentId)
    );
    march.joinedCommitmentIds.forEach((commitmentId, commitmentIndex) => {
      if (!commitmentIds.has(commitmentId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].joinedCommitmentIds[${commitmentIndex}]`,
          message: "M4 campaign march joined commitment references missing commitment."
        });
      }
      if (!joinedTroopCommitmentIds.has(commitmentId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].joinedCommitmentIds[${commitmentIndex}]`,
          message: "M4 campaign march joined commitment is missing joinedTroops quantity."
        });
      }
    });
    march.joinedCommitmentTroops.forEach((joined, joinedIndex) => {
      const commitment = m4.mobilizedForceCommitments.find(
        (entry) => entry.id === joined.commitmentId
      );
      if (commitment === undefined) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].joinedCommitmentTroops[${joinedIndex}].commitmentId`,
          message: "M4 campaign march joinedTroops references missing commitment."
        });
        return;
      }
      if (!march.joinedCommitmentIds.includes(joined.commitmentId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].joinedCommitmentTroops[${joinedIndex}].commitmentId`,
          message: "M4 campaign march joinedTroops commitment is missing joinedCommitmentIds entry."
        });
      }
      if (joined.joinedTroops > commitment.assembledTroops - commitment.releasedTroops) {
        errors.push({
          code: "invalid-schema",
          path: `state.m4.marches[${index}].joinedCommitmentTroops[${joinedIndex}].joinedTroops`,
          message: "M4 campaign march joinedTroops exceeds assembled unreleased commitment troops."
        });
      }
    });
    march.failedCommitmentIds.forEach((commitmentId, commitmentIndex) => {
      if (!commitmentIds.has(commitmentId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].failedCommitmentIds[${commitmentIndex}]`,
          message: "M4 campaign march failed commitment references missing commitment."
        });
      }
    });
    march.routeSegments.forEach((segment, segmentIndex) => {
      if (!routeIds.has(segment.routeId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].routeSegments[${segmentIndex}].routeId`,
          message: "M4 campaign march route segment references missing RouteId."
        });
      }
      if (!districtIds.has(segment.fromDistrictId) || !districtIds.has(segment.toDistrictId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.marches[${index}].routeSegments[${segmentIndex}]`,
          message: "M4 campaign march route segment references missing endpoint DistrictId."
        });
      }
    });
  });

  const snapshotIds = new Set<number>();
  m4.factionKnowledgeSnapshots.forEach((snapshot, snapshotIndex) => {
    if (snapshotIds.has(snapshot.snapshotId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.factionKnowledgeSnapshots",
        message: `Duplicate M4 knowledge snapshot row for FactionKnowledgeSnapshotId ${snapshot.snapshotId}.`
      });
    }
    snapshotIds.add(snapshot.snapshotId);
    if (!polityIds.has(snapshot.observerPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].observerPolityId`,
        message: "M4 knowledge snapshot references missing observer polity."
      });
    }
    if (!polityIds.has(snapshot.subjectPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].subjectPolityId`,
        message: "M4 knowledge snapshot references missing subject polity."
      });
    }
    snapshot.knownObjectives.forEach((objective, objectiveIndex) => {
      validateM4TargetReference(
        objective.target,
        polityIds,
        districtIds,
        `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].knownObjectives[${objectiveIndex}].target`,
        errors
      );
    });
    snapshot.routeEstimates.forEach((estimate, estimateIndex) => {
      if (!routeIds.has(estimate.routeId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].routeEstimates[${estimateIndex}].routeId`,
          message: "M4 route estimate references missing RouteId."
        });
      }
      if (!districtIds.has(estimate.fromDistrictId) || !districtIds.has(estimate.toDistrictId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].routeEstimates[${estimateIndex}]`,
          message: "M4 route estimate references missing endpoint DistrictId."
        });
      }
    });
    snapshot.supplyEstimates.forEach((estimate, estimateIndex) => {
      if (!districtIds.has(estimate.districtId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].supplyEstimates[${estimateIndex}].districtId`,
          message: "M4 supply estimate references missing DistrictId."
        });
      }
      if (estimate.supplyMin > estimate.supplyMax) {
        errors.push({
          code: "invalid-schema",
          path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].supplyEstimates[${estimateIndex}]`,
          message: "M4 supply estimate supplyMin must be <= supplyMax."
        });
      }
    });
    snapshot.defenderEstimates.forEach((estimate, estimateIndex) => {
      validateM4TargetReference(
        estimate.target,
        polityIds,
        districtIds,
        `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].defenderEstimates[${estimateIndex}].target`,
        errors
      );
      if (estimate.defenderMin > estimate.defenderMax) {
        errors.push({
          code: "invalid-schema",
          path: `state.m4.factionKnowledgeSnapshots[${snapshotIndex}].defenderEstimates[${estimateIndex}]`,
          message: "M4 defender estimate defenderMin must be <= defenderMax."
        });
      }
    });
  });
}

function validateM4OwnerReference(
  owner: M4CampaignOwnerV0,
  polityIds: ReadonlySet<number>,
  personIds: ReadonlySet<number>,
  path: string,
  errors: WorldInvariantError[]
): void {
  switch (owner.kind) {
    case "commander":
      if (!personIds.has(owner.characterId)) {
        errors.push({
          code: "bad-reference",
          path: `${path}.characterId`,
          message: "M4 campaign owner references missing commander PersonId."
        });
      }
      return;
    case "polity":
      if (!polityIds.has(owner.polityId)) {
        errors.push({
          code: "bad-reference",
          path: `${path}.polityId`,
          message: "M4 campaign owner references missing PolityId."
        });
      }
      return;
  }
}

function validateM4TargetReference(
  target: M4CampaignTargetV0,
  polityIds: ReadonlySet<number>,
  districtIds: ReadonlySet<number>,
  path: string,
  errors: WorldInvariantError[]
): void {
  switch (target.kind) {
    case "district":
      if (!districtIds.has(target.districtId)) {
        errors.push({
          code: "bad-reference",
          path: `${path}.districtId`,
          message: "M4 campaign target references missing DistrictId."
        });
      }
      return;
    case "polity":
      if (!polityIds.has(target.polityId)) {
        errors.push({
          code: "bad-reference",
          path: `${path}.polityId`,
          message: "M4 campaign target references missing PolityId."
        });
      }
      return;
  }
}

function validateM4MusterCommitmentSourceReference(
  source: M4MusterCommitmentSourceV0,
  m3ObligationById: ReadonlyMap<number, M3ObligationStateV0>,
  path: string,
  errors: WorldInvariantError[]
): void {
  switch (source.kind) {
    case "m3-obligation": {
      const obligation = m3ObligationById.get(source.obligationId);
      if (obligation === undefined) {
        errors.push({
          code: "bad-reference",
          path: `${path}.obligationId`,
          message: "M4 muster commitment references missing M3 troop obligation."
        });
        return;
      }
      if (obligation.obligationKind !== "troop") {
        errors.push({
          code: "invalid-schema",
          path: `${path}.obligationId`,
          message: "M4 muster commitment source obligation must be a troop obligation."
        });
      }
      if (
        obligation.debtorPolityId !== source.debtorPolityId ||
        obligation.creditorPolityId !== source.creditorPolityId
      ) {
        errors.push({
          code: "invalid-schema",
          path,
          message: "M4 muster commitment source polities must match source obligation."
        });
      }
      return;
    }
  }
}

function validateM4MusterCommitmentQuantities(
  commitment: M4MobilizedForceCommitmentStateV0,
  index: number,
  errors: WorldInvariantError[]
): void {
  if (
    commitment.assembledTroops + commitment.delayedTroops + commitment.refusedTroops >
    commitment.promisedTroops
  ) {
    errors.push({
      code: "invalid-schema",
      path: `state.m4.mobilizedForceCommitments[${index}]`,
      message: "M4 muster response quantities must not exceed promisedTroops."
    });
  }
  if (commitment.releasedTroops > commitment.assembledTroops) {
    errors.push({
      code: "invalid-schema",
      path: `state.m4.mobilizedForceCommitments[${index}].releasedTroops`,
      message: "M4 releasedTroops must not exceed assembledTroops."
    });
  }
}

function validateM4GrainSupplySourceReference(
  source: M4GrainSupplySourceV0,
  populationGroupById: ReadonlyMap<number, M2PopulationGroupStateV0>,
  path: string,
  errors: WorldInvariantError[]
): void {
  switch (source.kind) {
    case "m2-population-group": {
      const group = populationGroupById.get(source.populationGroupId);
      if (group === undefined) {
        errors.push({
          code: "bad-reference",
          path: `${path}.populationGroupId`,
          message: "M4 grain supply source references missing M2 population group."
        });
        return;
      }
      if (group.districtId !== source.districtId) {
        errors.push({
          code: "invalid-schema",
          path,
          message: "M4 grain supply source district must match M2 population group district."
        });
      }
      return;
    }
  }
}

function validateM4GrainSupplyReservationQuantities(
  reservation: M4GrainSupplyReservationStateV0,
  index: number,
  errors: WorldInvariantError[]
): void {
  if (
    reservation.carriedAmount + reservation.consumedAmount + reservation.lossAmount >
    reservation.reservedAmount
  ) {
    errors.push({
      code: "invalid-schema",
      path: `state.m4.grainSupplyReservations[${index}]`,
      message: "M4 grain supply carried, consumed, and loss amounts must not exceed reservedAmount."
    });
  }
  if (reservation.lossAmount > 0 && reservation.lossReasonCode === null) {
    errors.push({
      code: "invalid-schema",
      path: `state.m4.grainSupplyReservations[${index}].lossReasonCode`,
      message: "M4 grain supply lossReasonCode is required when lossAmount is positive."
    });
  }
  if (reservation.lossAmount === 0 && reservation.lossReasonCode !== null) {
    errors.push({
      code: "invalid-schema",
      path: `state.m4.grainSupplyReservations[${index}].lossReasonCode`,
      message: "M4 grain supply lossReasonCode must be null when lossAmount is zero."
    });
  }
  if (reservation.status === "released" && reservation.carriedAmount !== 0) {
    errors.push({
      code: "invalid-schema",
      path: `state.m4.grainSupplyReservations[${index}].carriedAmount`,
      message: "M4 released grain supply must not retain carriedAmount."
    });
  }
}

function validateM4MusterCostHookReference(
  hook: M4MusterLocalCostHookV0,
  polityIds: ReadonlySet<number>,
  districtIds: ReadonlySet<number>,
  path: string,
  errors: WorldInvariantError[]
): void {
  switch (hook.kind) {
    case "economic-labor-reservation":
      if (!districtIds.has(hook.districtId)) {
        errors.push({
          code: "bad-reference",
          path: `${path}.districtId`,
          message: "M4 economic muster cost hook references missing DistrictId."
        });
      }
      return;
    case "loyalty-pressure":
      if (!polityIds.has(hook.polityId)) {
        errors.push({
          code: "bad-reference",
          path: `${path}.polityId`,
          message: "M4 loyalty muster cost hook references missing PolityId."
        });
      }
      return;
  }
}

interface M2DistrictCoverageInput {
  readonly definitionIds: ReadonlySet<number>;
  readonly runtimeIds: readonly number[];
  readonly statePath: string;
  readonly stateLabel: string;
  readonly errors: WorldInvariantError[];
}

function validateM2DistrictCoverage(input: M2DistrictCoverageInput): void {
  const seen = new Set<number>();
  for (const runtimeId of input.runtimeIds) {
    if (seen.has(runtimeId)) {
      input.errors.push({
        code: "duplicate-runtime-state-row",
        path: input.statePath,
        message: `Duplicate ${input.stateLabel} row for DistrictId ${runtimeId}.`
      });
      continue;
    }
    seen.add(runtimeId);
  }

  for (const definitionId of input.definitionIds) {
    if (!seen.has(definitionId)) {
      input.errors.push({
        code: "missing-runtime-state-row",
        path: input.statePath,
        message: `Missing ${input.stateLabel} row for DistrictId ${definitionId}.`
      });
    }
  }
}

function validateRuntimeTableCoverage(
  world: WorldStateV0Candidate,
  errors: WorldInvariantError[]
): void {
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.polities),
    runtimeIds: world.state.polities.map((state) => state.definitionId),
    statePath: "state.polities",
    stateLabel: "PolityState",
    idLabel: "PolityId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.persons),
    runtimeIds: world.state.persons.map((state) => state.definitionId),
    statePath: "state.persons",
    stateLabel: "PersonState",
    idLabel: "PersonId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.districts),
    runtimeIds: world.state.districts.map((state) => state.definitionId),
    statePath: "state.districts",
    stateLabel: "DistrictState",
    idLabel: "DistrictId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.settlements),
    runtimeIds: world.state.settlements.map((state) => state.definitionId),
    statePath: "state.settlements",
    stateLabel: "SettlementState",
    idLabel: "SettlementId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.routes),
    runtimeIds: world.state.routes.map((state) => state.definitionId),
    statePath: "state.routes",
    stateLabel: "RouteState",
    idLabel: "RouteId",
    errors
  });
}

interface RuntimeTableCoverageInput {
  readonly definitionIds: ReadonlySet<number>;
  readonly runtimeIds: readonly number[];
  readonly statePath: string;
  readonly stateLabel: string;
  readonly idLabel: string;
  readonly errors: WorldInvariantError[];
}

function validateRuntimeTableExactCoverage(input: RuntimeTableCoverageInput): void {
  const seen = new Set<number>();

  for (const runtimeId of input.runtimeIds) {
    if (seen.has(runtimeId)) {
      input.errors.push({
        code: "duplicate-runtime-state-row",
        path: input.statePath,
        message: `Duplicate ${input.stateLabel} row for ${input.idLabel} ${runtimeId}.`
      });
      continue;
    }

    seen.add(runtimeId);
  }

  for (const definitionId of input.definitionIds) {
    if (!seen.has(definitionId)) {
      input.errors.push({
        code: "missing-runtime-state-row",
        path: input.statePath,
        message: `Missing ${input.stateLabel} row for ${input.idLabel} ${definitionId}.`
      });
    }
  }
}

function validateRuntimeDefinitionReference(
  id: number,
  definitions: ReadonlySet<number>,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  if (!definitions.has(id)) {
    errors.push({
      code: "missing-definition",
      path,
      message: `Runtime state references missing ${label} ${id}.`
    });
  }
}

function validateStateHash(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const actualHash = hashWorldStateV0Candidate(world);
  const storedHash = getRecordPath(world, ["meta", "stateHash"]);
  if (storedHash !== actualHash) {
    errors.push({
      code: "hash-mismatch",
      path: "meta.stateHash",
      message: `Stored state hash ${formatUnknown(storedHash)} does not match canonical hash ${actualHash}.`
    });
  }
}

function idsOf(values: readonly { readonly id: number }[]): ReadonlySet<number> {
  return new Set(values.map((value) => value.id));
}

function isDefinitionsLike(value: unknown): value is WorldDefinitionsV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value["polities"]) &&
    Array.isArray(value["persons"]) &&
    Array.isArray(value["districts"]) &&
    Array.isArray(value["settlements"]) &&
    Array.isArray(value["routes"])
  );
}

function isStateLike(value: unknown): value is WorldRuntimeStateV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value["polities"]) &&
    Array.isArray(value["persons"]) &&
    Array.isArray(value["districts"]) &&
    Array.isArray(value["settlements"]) &&
    Array.isArray(value["routes"])
  );
}

function isM2StateLike(value: unknown): value is M2EconomyPopulationStateV0 {
  if (!isRecord(value)) {
    return false;
  }

  const agriculture = value["agriculture"];
  const market = value["market"];
  const transport = value["transport"];
  return (
    value["schemaVersion"] === 1 &&
    Array.isArray(value["populationGroups"]) &&
    isRecord(agriculture) &&
    Array.isArray(agriculture["districts"]) &&
    isRecord(market) &&
    Array.isArray(market["districts"]) &&
    isRecord(transport) &&
    Array.isArray(transport["routes"]) &&
    Array.isArray(transport["districtSeasonality"]) &&
    Array.isArray(transport["regionalCurves"])
  );
}

function isM3StateLike(value: unknown): value is M3PolityVassalageStateV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value["schemaVersion"] === 1 &&
    Array.isArray(value["polities"]) &&
    Array.isArray(value["obligations"]) &&
    Array.isArray(value["obligationAuditEvents"]) &&
    Array.isArray(value["fulfillmentClaims"]) &&
    Array.isArray(value["administrativeDistricts"]) &&
    Array.isArray(value["characters"]) &&
    Array.isArray(value["relationships"]) &&
    Array.isArray(value["offices"]) &&
    Array.isArray(value["policies"]) &&
    Array.isArray(value["enfeoffments"]) &&
    Array.isArray(value["appointmentAuditEvents"]) &&
    Array.isArray(value["successionCandidateProfiles"]) &&
    Array.isArray(value["successionCrises"])
  );
}

function isM4StateLike(value: unknown): value is M4CampaignStateV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value["schemaVersion"] === 1 &&
    Array.isArray(value["campaignPlans"]) &&
    Array.isArray(value["factionKnowledgeSnapshots"]) &&
    Array.isArray(value["mobilizedForceCommitments"]) &&
    Array.isArray(value["grainSupplyReservations"])
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function getRecordPath(value: unknown, path: readonly string[]): unknown {
  let current = value;

  for (const segment of path) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

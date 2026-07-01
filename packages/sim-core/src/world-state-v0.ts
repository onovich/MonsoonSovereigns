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
export type FieldEngagementId = Brand<number, "FieldEngagementId">;
export type SiegeId = Brand<number, "SiegeId">;
export type FactionKnowledgeSnapshotId = Brand<number, "FactionKnowledgeSnapshotId">;
export type MobilizedForceCommitmentId = Brand<number, "MobilizedForceCommitmentId">;
export type GrainSupplyReservationId = Brand<number, "GrainSupplyReservationId">;
export type M6DiplomaticRelationId = Brand<number, "M6DiplomaticRelationId">;
export type M6DiplomaticAgreementId = Brand<number, "M6DiplomaticAgreementId">;
export type M6LegitimacySourceId = Brand<number, "M6LegitimacySourceId">;
export type M6PolicyDefinitionId = Brand<number, "M6PolicyDefinitionId">;
export type M6PolicyEventDefinitionId = Brand<number, "M6PolicyEventDefinitionId">;
export type M6PolicyEventInstanceId = Brand<number, "M6PolicyEventInstanceId">;
export type M6PolicyModifierId = Brand<number, "M6PolicyModifierId">;
export type M6AlphaTerminalStateId = Brand<number, "M6AlphaTerminalStateId">;
export type GameDay = Brand<number, "GameDay">;
export type WorldRevision = Brand<number, "WorldRevision">;
export type SimulationSeed = Brand<number, "SimulationSeed">;
export type ContentManifestHash = Brand<string, "ContentManifestHash">;
export type MapTopologyHash = Brand<string, "MapTopologyHash">;
export type StrategicTerrainHash = Brand<string, "StrategicTerrainHash">;
export type TerrainPatchId = Brand<string, "TerrainPatchId">;
export type BarrierChannelId = Brand<string, "BarrierChannelId">;
export type StrategicNodeId = Brand<string, "StrategicNodeId">;
export type RouteCorridorId = Brand<string, "RouteCorridorId">;
export type DistrictGovernanceFootprintId = Brand<string, "DistrictGovernanceFootprintId">;

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

export type MapTopologyRouteModeV1 = "coast" | "river" | "road";
export type MapTopologyTerrainClassV1 =
  | "coastal"
  | "lowland"
  | "pass"
  | "riverine"
  | "upland"
  | "urban"
  | "unknown";
export type MapTopologyRiskClassV1 = "contested" | "hazardous" | "low" | "seasonal" | "unknown";
export type MapTopologyHistoricityTagV1 = "COMPOSITE" | "FICTIONAL" | "HISTORICAL" | "INFERRED";
export type MapTopologyRouteNodeKindV1 = "pass" | "port" | "special" | "warehouse";

export interface MapTopologyPointV1 {
  readonly x: number;
  readonly y: number;
}

export interface MapTopologyDistrictMetadataV1 {
  readonly historicity: MapTopologyHistoricityTagV1;
  readonly terrainClass: MapTopologyTerrainClassV1;
  readonly riskClass: MapTopologyRiskClassV1;
}

export interface MapTopologyDistrictDefinitionV1 {
  readonly districtId: DistrictId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly anchor: MapTopologyPointV1;
  readonly polygon: readonly MapTopologyPointV1[];
  readonly metadata: MapTopologyDistrictMetadataV1;
}

export interface MapTopologyRouteNodeDefinitionV1 {
  readonly nodeId: string;
  readonly nodeKind: MapTopologyRouteNodeKindV1;
  readonly districtId: DistrictId;
  readonly displayNameKey: string;
  readonly anchor: MapTopologyPointV1;
}

export type MapTopologyRouteEndpointV1 =
  | { readonly kind: "district"; readonly districtId: DistrictId }
  | { readonly kind: "route-node"; readonly nodeId: string }
  | { readonly kind: "settlement"; readonly settlementId: SettlementId };

export interface MapTopologySeasonalModifierV1 {
  readonly month: number;
  readonly costMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly reasonCodes: readonly string[];
}

export type MapTopologyRouteAvailabilityV1 =
  | { readonly kind: "blocked"; readonly reasonCode: string }
  | { readonly kind: "open" }
  | { readonly kind: "unknown"; readonly reasonCode: string };

export interface MapTopologyRouteEdgeMetadataV1 {
  readonly historicity: MapTopologyHistoricityTagV1;
  readonly terrainClass: MapTopologyTerrainClassV1;
  readonly riskClass: MapTopologyRiskClassV1;
}

export interface MapTopologyRouteEdgeDefinitionV1 {
  readonly routeId: RouteId;
  readonly sourceId: string;
  readonly from: MapTopologyRouteEndpointV1;
  readonly to: MapTopologyRouteEndpointV1;
  readonly mode: MapTopologyRouteModeV1;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly seasonality: readonly MapTopologySeasonalModifierV1[];
  readonly availability: MapTopologyRouteAvailabilityV1;
  readonly metadata: MapTopologyRouteEdgeMetadataV1;
}

export interface MapTopologyDefinitionV1 {
  readonly schemaVersion: 1;
  readonly hashAlgorithm: "fnv1a32-canonical-map-topology-v1";
  readonly topologyHash: MapTopologyHash;
  readonly contentManifestHash: ContentManifestHash;
  readonly districts: readonly MapTopologyDistrictDefinitionV1[];
  readonly routeNodes: readonly MapTopologyRouteNodeDefinitionV1[];
  readonly routeEdges: readonly MapTopologyRouteEdgeDefinitionV1[];
}

export type StrategicTerrainHistoricityTagV1 =
  | "COMPOSITE"
  | "FICTIONAL"
  | "HISTORICAL"
  | "INFERRED";
export type StrategicTerrainClassV1 =
  | "coastal"
  | "lowland"
  | "pass"
  | "ridge"
  | "river-basin"
  | "riverine"
  | "upland"
  | "urban"
  | "wetland"
  | "unknown";
export type StrategicTerrainRiskClassV1 =
  | "contested"
  | "hazardous"
  | "low"
  | "seasonal"
  | "unknown";
export type StrategicTerrainSeasonStateV1 = "dry" | "monsoon" | "transition" | "unknown";
export type BarrierChannelKindV1 = "coast" | "major-river" | "ridge" | "strait" | "wetland";
export type StrategicNodeKindV1 =
  | "castle"
  | "crossing"
  | "objective"
  | "pass"
  | "port"
  | "staging-area"
  | "town"
  | "warehouse";
export type StrategicNodeKnownStateV1 = "known" | "rumored" | "unknown";
export type RouteCorridorModeV1 = "coast" | "mixed" | "pass" | "river" | "road";
export type RouteCorridorWidthClassV1 = "narrow" | "standard" | "wide";
export type RouteCorridorAvailabilityV1 =
  | { readonly kind: "blocked"; readonly reasonCode: string }
  | { readonly kind: "open" }
  | { readonly kind: "unknown"; readonly reasonCode: string };
export type StrategicTerrainAuthorityProhibitionV1 =
  | "bounding-box-adjacency"
  | "centroid-proximity"
  | "hidden-grid"
  | "hidden-lattice"
  | "hex-axial-or-cube"
  | "renderer-only-line-reachability"
  | "sequential-id-reachability";

export interface StrategicTerrainPointV1 {
  readonly x: number;
  readonly y: number;
}

export interface TerrainPatchDefinitionV1 {
  readonly patchId: TerrainPatchId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly terrainClass: StrategicTerrainClassV1;
  readonly seasonSensitivity: StrategicTerrainSeasonStateV1;
  readonly historicity: StrategicTerrainHistoricityTagV1;
  readonly polygon: readonly StrategicTerrainPointV1[];
  readonly explanationTags: readonly string[];
}

export interface BarrierChannelDefinitionV1 {
  readonly channelId: BarrierChannelId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly channelKind: BarrierChannelKindV1;
  readonly traversalRule: "blocks-without-explicit-corridor" | "channels-explicit-corridors";
  readonly historicity: StrategicTerrainHistoricityTagV1;
  readonly points: readonly StrategicTerrainPointV1[];
  readonly explanationTags: readonly string[];
}

export interface StrategicNodeDefinitionV1 {
  readonly nodeId: StrategicNodeId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly nodeKind: StrategicNodeKindV1;
  readonly districtId: DistrictId;
  readonly anchor: StrategicTerrainPointV1;
  readonly localCapacity: number;
  readonly knownState: StrategicNodeKnownStateV1;
  readonly terrainPatchIds: readonly TerrainPatchId[];
  readonly barrierChannelIds: readonly BarrierChannelId[];
  readonly governanceFootprintIds: readonly DistrictGovernanceFootprintId[];
  readonly explanationTags: readonly string[];
}

export interface RouteCorridorSeasonalModifierV1 {
  readonly month: number;
  readonly seasonState: StrategicTerrainSeasonStateV1;
  readonly travelCostMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
}

export interface RouteCorridorDefinitionV1 {
  readonly corridorId: RouteCorridorId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly fromNodeId: StrategicNodeId;
  readonly toNodeId: StrategicNodeId;
  readonly mode: RouteCorridorModeV1;
  readonly widthClass: RouteCorridorWidthClassV1;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly riskClass: StrategicTerrainRiskClassV1;
  readonly terrainPatchIds: readonly TerrainPatchId[];
  readonly barrierChannelIds: readonly BarrierChannelId[];
  readonly governanceFootprintIds: readonly DistrictGovernanceFootprintId[];
  readonly seasonality: readonly RouteCorridorSeasonalModifierV1[];
  readonly availability: RouteCorridorAvailabilityV1;
  readonly polyline: readonly StrategicTerrainPointV1[];
  readonly explanationTags: readonly string[];
}

export interface DistrictGovernanceFootprintDefinitionV1 {
  readonly footprintId: DistrictGovernanceFootprintId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly districtId: DistrictId;
  readonly overlayOnly: true;
  readonly polygon: readonly StrategicTerrainPointV1[];
  readonly governanceTags: readonly string[];
  readonly consequenceTags: readonly string[];
}

export interface StrategicTerrainDefinitionV1 {
  readonly schemaVersion: 1;
  readonly hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1";
  readonly strategicTerrainHash: StrategicTerrainHash;
  readonly contentManifestHash: ContentManifestHash;
  readonly authority: "terrain-route-node-v1";
  readonly governanceFootprintRole: "overlay-only";
  readonly authorityProhibitions: readonly StrategicTerrainAuthorityProhibitionV1[];
  readonly terrainPatches: readonly TerrainPatchDefinitionV1[];
  readonly barrierChannels: readonly BarrierChannelDefinitionV1[];
  readonly strategicNodes: readonly StrategicNodeDefinitionV1[];
  readonly routeCorridors: readonly RouteCorridorDefinitionV1[];
  readonly districtGovernanceFootprints: readonly DistrictGovernanceFootprintDefinitionV1[];
}

export interface WorldDefinitionsV0 {
  readonly polities: readonly PolityDefinition[];
  readonly persons: readonly PersonDefinition[];
  readonly districts: readonly DistrictDefinition[];
  readonly settlements: readonly SettlementDefinition[];
  readonly routes: readonly RouteDefinition[];
  readonly topology?: MapTopologyDefinitionV1;
  readonly strategicTerrain?: StrategicTerrainDefinitionV1;
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
    }
  | {
      readonly kind: "abdication";
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

export type M4FieldEngagementOutcomeV0 = "attacker-victory" | "defender-holds";

export interface M4CampaignHookStateV0 {
  readonly polityId: PolityId;
  readonly amount: number;
  readonly reasonCode: string;
}

export interface M4FieldEngagementStateV0 {
  readonly engagementId: FieldEngagementId;
  readonly campaignPlanId: CampaignPlanId;
  readonly marchId: CampaignMarchId;
  readonly attackerPolityId: PolityId;
  readonly defenderPolityId: PolityId;
  readonly target: M4CampaignTargetV0;
  readonly attackerTroopsBefore: number;
  readonly attackerTroopsAfter: number;
  readonly defenderEstimatedTroopsBefore: number;
  readonly defenderEstimatedTroopsAfter: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly defenderFortification: number;
  readonly outcome: M4FieldEngagementOutcomeV0;
  readonly reasonCodes: readonly string[];
  readonly creditHooks: readonly M4CampaignHookStateV0[];
  readonly reputationHooks: readonly M4CampaignHookStateV0[];
  readonly resolvedDay: GameDay;
}

export type M4SiegeChoiceV0 =
  | "invest-blockade"
  | "assault"
  | "continue"
  | "accept-surrender"
  | "lift-siege"
  | "withdraw";
export type M4SiegeStatusV0 =
  | "blockading"
  | "surrender-ready"
  | "surrendered"
  | "lifted"
  | "withdrawn";

export interface M4SiegeStateV0 {
  readonly siegeId: SiegeId;
  readonly campaignPlanId: CampaignPlanId;
  readonly marchId: CampaignMarchId;
  readonly targetDistrictId: DistrictId;
  readonly attackerPolityId: PolityId;
  readonly defenderPolityId: PolityId;
  readonly status: M4SiegeStatusV0;
  readonly statusReasonCode: string;
  readonly fortification: number;
  readonly defenderEstimatedTroops: number;
  readonly defenderSupply: number;
  readonly siegeProgress: number;
  readonly daysInvested: number;
  readonly blockadeDays: number;
  readonly assaultCount: number;
  readonly attackerTroops: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly surrenderEligible: boolean;
  readonly surrenderReasonCodes: readonly string[];
  readonly reasonCodes: readonly string[];
  readonly creditHooks: readonly M4CampaignHookStateV0[];
  readonly reputationHooks: readonly M4CampaignHookStateV0[];
  readonly startedDay: GameDay;
  readonly updatedDay: GameDay;
}

export type M4WithdrawalKindV0 =
  | "orderly-withdrawal"
  | "forced-retreat"
  | "cancelled-before-departure"
  | "failed-extraction";
export type M4WithdrawalTriggerV0 =
  | "ordered"
  | "supply"
  | "season"
  | "siege"
  | "loss"
  | "objective-complete";

export interface M4WithdrawalStateV0 {
  readonly withdrawalId: number;
  readonly campaignPlanId: CampaignPlanId;
  readonly marchId: CampaignMarchId | null;
  readonly siegeId: SiegeId | null;
  readonly kind: M4WithdrawalKindV0;
  readonly triggerReason: M4WithdrawalTriggerV0;
  readonly troopsBefore: number;
  readonly troopsExtracted: number;
  readonly casualties: number;
  readonly supplyLoss: number;
  readonly creditHooks: readonly M4CampaignHookStateV0[];
  readonly reputationHooks: readonly M4CampaignHookStateV0[];
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: GameDay;
}

export interface M4PostwarCandidateStateV0 {
  readonly candidateId: string;
  readonly sourceWarOutcomeId: number;
  readonly settlementId: string;
  readonly victorPolityId: PolityId;
  readonly localPolityId: PolityId;
  readonly districtId: DistrictId;
  readonly validM3Methods: readonly ("direct-control" | "restore-vassal-ruler" | "tribute-only")[];
  readonly reasonCodes: readonly string[];
}

export interface M4WarOutcomeStateV0 {
  readonly outcomeId: number;
  readonly campaignPlanId: CampaignPlanId;
  readonly victorPolityId: PolityId;
  readonly localPolityId: PolityId;
  readonly targetDistrictId: DistrictId;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly withdrawalId: number | null;
  readonly siegeId: SiegeId | null;
  readonly postwarCandidate: M4PostwarCandidateStateV0 | null;
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: GameDay;
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
  readonly fieldEngagements: readonly M4FieldEngagementStateV0[];
  readonly sieges: readonly M4SiegeStateV0[];
  readonly withdrawals: readonly M4WithdrawalStateV0[];
  readonly warOutcomes: readonly M4WarOutcomeStateV0[];
  readonly postwarCandidates: readonly M4PostwarCandidateStateV0[];
}

export type M6DiplomaticAgreementKindV0 =
  | "non-aggression"
  | "military-access"
  | "tribute-recognition";
export type M6DiplomaticAgreementStatusV0 = "proposed" | "active" | "rejected";
export type M6DiplomaticRecognitionDirectionV0 =
  | "none"
  | "proposer-recognizes-target"
  | "target-recognizes-proposer";
export type M6LegitimacyAudienceV0 =
  | "court"
  | "local-lords"
  | "military-retinue"
  | "merchants"
  | "ritual-network"
  | "vassal-rulers"
  | "foreign-courts";
export type M6LegitimacySourceKindV0 =
  | "diplomatic-recognition"
  | "obligation-fulfilled"
  | "obligation-breached"
  | "succession-continuity"
  | "postwar-settlement"
  | "campaign-consequence";

export interface M6DiplomaticRelationStateV0 {
  readonly relationId: M6DiplomaticRelationId;
  readonly polityAId: PolityId;
  readonly polityBId: PolityId;
  readonly trustBps: number;
  readonly affinityBps: number;
  readonly fearBps: number;
  readonly threatBps: number;
  readonly interestAlignmentBps: number;
  readonly historicalDebt: number;
  readonly borderConflictBps: number;
  readonly updatedDay: GameDay;
  readonly reasonCodes: readonly string[];
}

export interface M6DiplomaticAgreementStateV0 {
  readonly agreementId: M6DiplomaticAgreementId;
  readonly relationId: M6DiplomaticRelationId;
  readonly proposerPolityId: PolityId;
  readonly targetPolityId: PolityId;
  readonly agreementKind: M6DiplomaticAgreementKindV0;
  readonly status: M6DiplomaticAgreementStatusV0;
  readonly startDay: GameDay;
  readonly endDay: GameDay;
  readonly recognitionDirection: M6DiplomaticRecognitionDirectionV0;
  readonly reasonCodes: readonly string[];
}

export interface M6RecognitionEdgeStateV0 {
  readonly fromPolityId: PolityId;
  readonly toPolityId: PolityId;
  readonly agreementId: M6DiplomaticAgreementId;
  readonly reasonCode: string;
}

export interface M6LegitimacySourceStateV0 {
  readonly sourceId: M6LegitimacySourceId;
  readonly polityId: PolityId;
  readonly audience: M6LegitimacyAudienceV0;
  readonly sourceKind: M6LegitimacySourceKindV0;
  readonly magnitudeBps: number;
  readonly sourceRef: string;
  readonly reasonCode: string;
  readonly createdDay: GameDay;
}

export interface M6LegitimacyProfileStateV0 {
  readonly polityId: PolityId;
  readonly audience: M6LegitimacyAudienceV0;
  readonly scoreBps: number;
  readonly pressureBps: number;
  readonly sourceIds: readonly M6LegitimacySourceId[];
  readonly reasonCodes: readonly string[];
}

export interface M6DiplomacyLegitimacyStateV0 {
  readonly schemaVersion: 1;
  readonly relations: readonly M6DiplomaticRelationStateV0[];
  readonly agreements: readonly M6DiplomaticAgreementStateV0[];
  readonly recognitionEdges: readonly M6RecognitionEdgeStateV0[];
  readonly legitimacySources: readonly M6LegitimacySourceStateV0[];
  readonly legitimacyProfiles: readonly M6LegitimacyProfileStateV0[];
}

export interface M6PolicyDefinitionStateV0 {
  readonly policyId: M6PolicyDefinitionId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface M6PolicyEventCauseStateV0 {
  readonly kind: "day-at-least";
  readonly day: GameDay;
  readonly reasonCodes: readonly string[];
}

export interface M6PolicyEventConsequenceStateV0 {
  readonly kind: "policy-modifier";
  readonly policyId: M6PolicyDefinitionId;
  readonly magnitudeBps: number;
  readonly durationDays: number;
  readonly reasonCode: string;
}

export interface M6PolicyEventOptionStateV0 {
  readonly optionId: number;
  readonly displayNameKey: string;
  readonly consequences: readonly M6PolicyEventConsequenceStateV0[];
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface M6PolicyEventDefinitionStateV0 {
  readonly eventDefinitionId: M6PolicyEventDefinitionId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly cause: M6PolicyEventCauseStateV0;
  readonly options: readonly M6PolicyEventOptionStateV0[];
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface M6PolicyEventDefinitionsStateV0 {
  readonly policies: readonly M6PolicyDefinitionStateV0[];
  readonly events: readonly M6PolicyEventDefinitionStateV0[];
}

export interface M6PolicyEventActiveStateV0 {
  readonly eventInstanceId: M6PolicyEventInstanceId;
  readonly eventDefinitionId: M6PolicyEventDefinitionId;
  readonly activatedDay: GameDay;
  readonly causeReasonCodes: readonly string[];
}

export interface M6PolicyEventResolvedStateV0 {
  readonly eventInstanceId: M6PolicyEventInstanceId;
  readonly eventDefinitionId: M6PolicyEventDefinitionId;
  readonly selectedOptionId: number;
  readonly resolvedDay: GameDay;
  readonly reasonCodes: readonly string[];
}

export interface M6PolicyModifierStateV0 {
  readonly modifierId: M6PolicyModifierId;
  readonly policyId: M6PolicyDefinitionId;
  readonly eventInstanceId: M6PolicyEventInstanceId;
  readonly magnitudeBps: number;
  readonly startDay: GameDay;
  readonly endDay: GameDay;
  readonly reasonCode: string;
}

export interface M6PolicyEventRuntimeStateV0 {
  readonly schemaVersion: 1;
  readonly definitions: M6PolicyEventDefinitionsStateV0;
  readonly activeEvents: readonly M6PolicyEventActiveStateV0[];
  readonly resolvedEvents: readonly M6PolicyEventResolvedStateV0[];
  readonly policyModifiers: readonly M6PolicyModifierStateV0[];
  readonly nextEventInstanceId: number;
  readonly nextModifierId: number;
}

export type M6AlphaTerminalOutcomeV0 = "victory" | "defeat" | "continued-play";

export interface M6AlphaTerminalEvidenceStateV0 {
  readonly recognizedByCount: number;
  readonly legitimacyScoreBps: number;
  readonly postwarArrangementCount: number;
  readonly resolvedPolicyEventCount: number;
  readonly successionResolvedCount: number;
  readonly routeCount: number;
  readonly populationGroupCount: number;
}

export interface M6AlphaTerminalStateV0 {
  readonly terminalStateId: M6AlphaTerminalStateId;
  readonly polityId: PolityId;
  readonly outcome: M6AlphaTerminalOutcomeV0;
  readonly evaluatedDay: GameDay;
  readonly evaluatedRevision: WorldRevision;
  readonly maxDay: GameDay;
  readonly evidence: M6AlphaTerminalEvidenceStateV0;
  readonly reasonCodes: readonly string[];
}

export interface M6AlphaRuntimeStateV0 {
  readonly schemaVersion: 1;
  readonly terminalStates: readonly M6AlphaTerminalStateV0[];
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
  readonly m6?: M6DiplomacyLegitimacyStateV0;
  readonly m6PolicyEvents?: M6PolicyEventRuntimeStateV0;
  readonly m6Alpha?: M6AlphaRuntimeStateV0;
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

export interface CreateMapTopologyDefinitionV1Input {
  readonly contentManifestHash: unknown;
  readonly districts: readonly {
    readonly districtId: unknown;
    readonly sourceId: unknown;
    readonly displayNameKey: unknown;
    readonly anchor: unknown;
    readonly polygon: readonly unknown[];
    readonly metadata: unknown;
  }[];
  readonly routeNodes?: readonly {
    readonly nodeId: unknown;
    readonly nodeKind: unknown;
    readonly districtId: unknown;
    readonly displayNameKey: unknown;
    readonly anchor: unknown;
  }[];
  readonly routeEdges: readonly {
    readonly routeId: unknown;
    readonly sourceId: unknown;
    readonly from: unknown;
    readonly to: unknown;
    readonly mode: unknown;
    readonly baseTravelCost: unknown;
    readonly baseCapacity: unknown;
    readonly seasonality: readonly unknown[];
    readonly availability: unknown;
    readonly metadata: unknown;
  }[];
}

export interface CreateStrategicTerrainDefinitionV1Input {
  readonly contentManifestHash: unknown;
  readonly terrainPatches: readonly {
    readonly patchId: unknown;
    readonly sourceId: unknown;
    readonly displayNameKey: unknown;
    readonly terrainClass: unknown;
    readonly seasonSensitivity: unknown;
    readonly historicity: unknown;
    readonly polygon: readonly unknown[];
    readonly explanationTags: readonly unknown[];
  }[];
  readonly barrierChannels: readonly {
    readonly channelId: unknown;
    readonly sourceId: unknown;
    readonly displayNameKey: unknown;
    readonly channelKind: unknown;
    readonly traversalRule: unknown;
    readonly historicity: unknown;
    readonly points: readonly unknown[];
    readonly explanationTags: readonly unknown[];
  }[];
  readonly strategicNodes: readonly {
    readonly nodeId: unknown;
    readonly sourceId: unknown;
    readonly displayNameKey: unknown;
    readonly nodeKind: unknown;
    readonly districtId: unknown;
    readonly anchor: unknown;
    readonly localCapacity: unknown;
    readonly knownState: unknown;
    readonly terrainPatchIds: readonly unknown[];
    readonly barrierChannelIds: readonly unknown[];
    readonly governanceFootprintIds: readonly unknown[];
    readonly explanationTags: readonly unknown[];
  }[];
  readonly routeCorridors: readonly {
    readonly corridorId: unknown;
    readonly sourceId: unknown;
    readonly displayNameKey: unknown;
    readonly fromNodeId: unknown;
    readonly toNodeId: unknown;
    readonly mode: unknown;
    readonly widthClass: unknown;
    readonly baseTravelCost: unknown;
    readonly baseCapacity: unknown;
    readonly riskClass: unknown;
    readonly terrainPatchIds: readonly unknown[];
    readonly barrierChannelIds: readonly unknown[];
    readonly governanceFootprintIds: readonly unknown[];
    readonly seasonality: readonly unknown[];
    readonly availability: unknown;
    readonly polyline: readonly unknown[];
    readonly explanationTags: readonly unknown[];
  }[];
  readonly districtGovernanceFootprints: readonly {
    readonly footprintId: unknown;
    readonly sourceId: unknown;
    readonly displayNameKey: unknown;
    readonly districtId: unknown;
    readonly overlayOnly: unknown;
    readonly polygon: readonly unknown[];
    readonly governanceTags: readonly unknown[];
    readonly consequenceTags: readonly unknown[];
  }[];
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
  readonly m6?: M6DiplomacyLegitimacyStateV0;
  readonly m6PolicyEvents?: M6PolicyEventRuntimeStateV0;
  readonly m6Alpha?: M6AlphaRuntimeStateV0;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;
export const STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS: readonly StrategicTerrainAuthorityProhibitionV1[] =
  [
    "bounding-box-adjacency",
    "centroid-proximity",
    "hidden-grid",
    "hidden-lattice",
    "hex-axial-or-cube",
    "renderer-only-line-reachability",
    "sequential-id-reachability"
  ];

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

export function parseFieldEngagementId(value: unknown): FieldEngagementId {
  return parsePositiveInteger(value, "FieldEngagementId") as FieldEngagementId;
}

export function parseSiegeId(value: unknown): SiegeId {
  return parsePositiveInteger(value, "SiegeId") as SiegeId;
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

export function parseM6DiplomaticRelationId(value: unknown): M6DiplomaticRelationId {
  return parsePositiveInteger(value, "M6DiplomaticRelationId") as M6DiplomaticRelationId;
}

export function parseM6DiplomaticAgreementId(value: unknown): M6DiplomaticAgreementId {
  return parsePositiveInteger(value, "M6DiplomaticAgreementId") as M6DiplomaticAgreementId;
}

export function parseM6LegitimacySourceId(value: unknown): M6LegitimacySourceId {
  return parsePositiveInteger(value, "M6LegitimacySourceId") as M6LegitimacySourceId;
}

export function parseM6PolicyDefinitionId(value: unknown): M6PolicyDefinitionId {
  return parsePositiveInteger(value, "M6PolicyDefinitionId") as M6PolicyDefinitionId;
}

export function parseM6PolicyEventDefinitionId(value: unknown): M6PolicyEventDefinitionId {
  return parsePositiveInteger(value, "M6PolicyEventDefinitionId") as M6PolicyEventDefinitionId;
}

export function parseM6PolicyEventInstanceId(value: unknown): M6PolicyEventInstanceId {
  return parsePositiveInteger(value, "M6PolicyEventInstanceId") as M6PolicyEventInstanceId;
}

export function parseM6PolicyModifierId(value: unknown): M6PolicyModifierId {
  return parsePositiveInteger(value, "M6PolicyModifierId") as M6PolicyModifierId;
}

export function parseM6AlphaTerminalStateId(value: unknown): M6AlphaTerminalStateId {
  return parsePositiveInteger(value, "M6AlphaTerminalStateId") as M6AlphaTerminalStateId;
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

export function parseMapTopologyHash(value: unknown): MapTopologyHash {
  if (typeof value !== "string" || !/^[0-9a-f]{8}$/u.test(value)) {
    throw new Error("MapTopologyHash must be an 8-character lowercase hex string.");
  }

  return value as MapTopologyHash;
}

export function parseStrategicTerrainHash(value: unknown): StrategicTerrainHash {
  if (typeof value !== "string" || !/^[0-9a-f]{8}$/u.test(value)) {
    throw new Error("StrategicTerrainHash must be an 8-character lowercase hex string.");
  }

  return value as StrategicTerrainHash;
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

export function createMapTopologyDefinitionV1(
  input: CreateMapTopologyDefinitionV1Input
): MapTopologyDefinitionV1 {
  const topologyWithoutHash = canonicalizeMapTopologyDefinitionV1({
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-map-topology-v1",
    topologyHash: parseMapTopologyHash("00000000"),
    contentManifestHash: parseContentManifestHash(input.contentManifestHash),
    districts: input.districts.map((district) => ({
      districtId: parseDistrictId(district.districtId),
      sourceId: parseNonEmptyString(district.sourceId, "MapTopology district sourceId"),
      displayNameKey: parseDisplayNameKey(
        district.displayNameKey,
        "MapTopology district displayNameKey"
      ),
      anchor: parseMapTopologyPoint(district.anchor, "MapTopology district anchor"),
      polygon: district.polygon.map((point) =>
        parseMapTopologyPoint(point, "MapTopology district polygon point")
      ),
      metadata: parseMapTopologyDistrictMetadata(district.metadata)
    })),
    routeNodes: (input.routeNodes ?? []).map((node) => ({
      nodeId: parseMapTopologyNodeId(node.nodeId, "MapTopology route node nodeId"),
      nodeKind: parseMapTopologyRouteNodeKind(node.nodeKind),
      districtId: parseDistrictId(node.districtId),
      displayNameKey: parseDisplayNameKey(
        node.displayNameKey,
        "MapTopology route node displayNameKey"
      ),
      anchor: parseMapTopologyPoint(node.anchor, "MapTopology route node anchor")
    })),
    routeEdges: input.routeEdges.map((edge) => ({
      routeId: parseRouteId(edge.routeId),
      sourceId: parseNonEmptyString(edge.sourceId, "MapTopology route edge sourceId"),
      from: parseMapTopologyRouteEndpoint(edge.from),
      to: parseMapTopologyRouteEndpoint(edge.to),
      mode: parseMapTopologyRouteMode(edge.mode),
      baseTravelCost: parsePositiveInteger(edge.baseTravelCost, "MapTopology baseTravelCost"),
      baseCapacity: parsePositiveInteger(edge.baseCapacity, "MapTopology baseCapacity"),
      seasonality: edge.seasonality.map(parseMapTopologySeasonalModifier),
      availability: parseMapTopologyRouteAvailability(edge.availability),
      metadata: parseMapTopologyRouteEdgeMetadata(edge.metadata)
    }))
  });

  return {
    ...topologyWithoutHash,
    topologyHash: hashMapTopologyDefinitionV1(topologyWithoutHash)
  };
}

export function createStrategicTerrainDefinitionV1(
  input: CreateStrategicTerrainDefinitionV1Input
): StrategicTerrainDefinitionV1 {
  const terrainWithoutHash = canonicalizeStrategicTerrainDefinitionV1({
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1",
    strategicTerrainHash: parseStrategicTerrainHash("00000000"),
    contentManifestHash: parseContentManifestHash(input.contentManifestHash),
    authority: "terrain-route-node-v1",
    governanceFootprintRole: "overlay-only",
    authorityProhibitions: STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS,
    terrainPatches: input.terrainPatches.map((patch) => ({
      patchId: parseTerrainPatchId(patch.patchId),
      sourceId: parseNonEmptyString(patch.sourceId, "TerrainPatch sourceId"),
      displayNameKey: parseDisplayNameKey(patch.displayNameKey, "TerrainPatch displayNameKey"),
      terrainClass: parseStrategicTerrainClass(patch.terrainClass),
      seasonSensitivity: parseStrategicTerrainSeasonState(patch.seasonSensitivity),
      historicity: parseStrategicTerrainHistoricityTag(patch.historicity),
      polygon: patch.polygon.map((point) =>
        parseStrategicTerrainPoint(point, "TerrainPatch polygon point")
      ),
      explanationTags: parseStrategicTerrainTextArray(
        patch.explanationTags,
        "TerrainPatch explanationTags"
      )
    })),
    barrierChannels: input.barrierChannels.map((channel) => ({
      channelId: parseBarrierChannelId(channel.channelId),
      sourceId: parseNonEmptyString(channel.sourceId, "BarrierChannel sourceId"),
      displayNameKey: parseDisplayNameKey(channel.displayNameKey, "BarrierChannel displayNameKey"),
      channelKind: parseBarrierChannelKind(channel.channelKind),
      traversalRule: parseBarrierChannelTraversalRule(channel.traversalRule),
      historicity: parseStrategicTerrainHistoricityTag(channel.historicity),
      points: channel.points.map((point) =>
        parseStrategicTerrainPoint(point, "BarrierChannel point")
      ),
      explanationTags: parseStrategicTerrainTextArray(
        channel.explanationTags,
        "BarrierChannel explanationTags"
      )
    })),
    strategicNodes: input.strategicNodes.map((node) => ({
      nodeId: parseStrategicNodeId(node.nodeId),
      sourceId: parseNonEmptyString(node.sourceId, "StrategicNode sourceId"),
      displayNameKey: parseDisplayNameKey(node.displayNameKey, "StrategicNode displayNameKey"),
      nodeKind: parseStrategicNodeKind(node.nodeKind),
      districtId: parseDistrictId(node.districtId),
      anchor: parseStrategicTerrainPoint(node.anchor, "StrategicNode anchor"),
      localCapacity: parsePositiveInteger(node.localCapacity, "StrategicNode localCapacity"),
      knownState: parseStrategicNodeKnownState(node.knownState),
      terrainPatchIds: node.terrainPatchIds.map(parseTerrainPatchId),
      barrierChannelIds: node.barrierChannelIds.map(parseBarrierChannelId),
      governanceFootprintIds: node.governanceFootprintIds.map(parseDistrictGovernanceFootprintId),
      explanationTags: parseStrategicTerrainTextArray(
        node.explanationTags,
        "StrategicNode explanationTags"
      )
    })),
    routeCorridors: input.routeCorridors.map((corridor) => ({
      corridorId: parseRouteCorridorId(corridor.corridorId),
      sourceId: parseNonEmptyString(corridor.sourceId, "RouteCorridor sourceId"),
      displayNameKey: parseDisplayNameKey(corridor.displayNameKey, "RouteCorridor displayNameKey"),
      fromNodeId: parseStrategicNodeId(corridor.fromNodeId),
      toNodeId: parseStrategicNodeId(corridor.toNodeId),
      mode: parseRouteCorridorMode(corridor.mode),
      widthClass: parseRouteCorridorWidthClass(corridor.widthClass),
      baseTravelCost: parsePositiveInteger(corridor.baseTravelCost, "RouteCorridor baseTravelCost"),
      baseCapacity: parsePositiveInteger(corridor.baseCapacity, "RouteCorridor baseCapacity"),
      riskClass: parseStrategicTerrainRiskClass(corridor.riskClass),
      terrainPatchIds: corridor.terrainPatchIds.map(parseTerrainPatchId),
      barrierChannelIds: corridor.barrierChannelIds.map(parseBarrierChannelId),
      governanceFootprintIds: corridor.governanceFootprintIds.map(
        parseDistrictGovernanceFootprintId
      ),
      seasonality: corridor.seasonality.map(parseRouteCorridorSeasonalModifier),
      availability: parseRouteCorridorAvailability(corridor.availability),
      polyline: corridor.polyline.map((point) =>
        parseStrategicTerrainPoint(point, "RouteCorridor polyline point")
      ),
      explanationTags: parseStrategicTerrainTextArray(
        corridor.explanationTags,
        "RouteCorridor explanationTags"
      )
    })),
    districtGovernanceFootprints: input.districtGovernanceFootprints.map((footprint) => ({
      footprintId: parseDistrictGovernanceFootprintId(footprint.footprintId),
      sourceId: parseNonEmptyString(footprint.sourceId, "DistrictGovernanceFootprint sourceId"),
      displayNameKey: parseDisplayNameKey(
        footprint.displayNameKey,
        "DistrictGovernanceFootprint displayNameKey"
      ),
      districtId: parseDistrictId(footprint.districtId),
      overlayOnly: parseGovernanceOverlayOnly(footprint.overlayOnly),
      polygon: footprint.polygon.map((point) =>
        parseStrategicTerrainPoint(point, "DistrictGovernanceFootprint polygon point")
      ),
      governanceTags: parseStrategicTerrainTextArray(
        footprint.governanceTags,
        "DistrictGovernanceFootprint governanceTags"
      ),
      consequenceTags: parseStrategicTerrainTextArray(
        footprint.consequenceTags,
        "DistrictGovernanceFootprint consequenceTags"
      )
    }))
  });

  return {
    ...terrainWithoutHash,
    strategicTerrainHash: hashStrategicTerrainDefinitionV1(terrainWithoutHash)
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

  if (definitions.topology !== undefined) {
    return canonicalizeM2TransportState({
      schemaVersion: 1,
      routes: definitions.topology.routeEdges.map((route) => {
        const fromDistrictId = mapTopologyEndpointDistrictId(definitions, route.from);
        const toDistrictId = mapTopologyEndpointDistrictId(definitions, route.to);

        return {
          routeId: route.routeId,
          fromDistrictId,
          toDistrictId,
          routeKind: route.mode,
          baseTravelCost: route.baseTravelCost,
          baseCapacity: route.baseCapacity
        };
      }),
      districtSeasonality: definitions.districts.map((district) => ({
        districtId: district.id,
        regionalCurveId: parseRegionalSeasonalCurveId(1)
      })),
      regionalCurves:
        definitions.districts.length === 0
          ? []
          : [
              {
                id: parseRegionalSeasonalCurveId(1),
                monthlyValues: Array.from({ length: 12 }, (_unused, index) => ({
                  month: index + 1,
                  monsoonIntensityBps: 0,
                  agricultureWorkBps: 10_000,
                  riverNavigabilityBps: 10_000,
                  roadTravelCostBps: 10_000
                }))
              }
            ]
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
  const state = createRuntimeState(
    definitions,
    input.m2,
    input.m3,
    input.m4,
    input.m6,
    input.m6PolicyEvents,
    input.m6Alpha
  );
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
    ...formatMapTopologyCanonicalLines(world.definitions.topology),
    ...formatStrategicTerrainCanonicalLines(world.definitions.strategicTerrain),
    `state.polities=${formatPolityStates(world.state.polities)}`,
    `state.persons=${formatPersonStates(world.state.persons)}`,
    `state.districts=${formatDistrictStates(world.state.districts)}`,
    `state.settlements=${formatSettlementStates(world.state.settlements)}`,
    `state.routes=${formatRouteStates(world.state.routes)}`,
    ...formatM2CanonicalLines(world.state.m2),
    ...formatM3CanonicalLines(world.state.m3),
    ...formatM4CanonicalLines(world.state.m4),
    ...formatM6CanonicalLines(world.state.m6),
    ...formatM6PolicyEventCanonicalLines(world.state.m6PolicyEvents),
    ...formatM6AlphaCanonicalLines(world.state.m6Alpha),
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
  validateM6EntryShapes(getRecordPath(world, ["state", "m6"]), errors);
  validateM6PolicyEventEntryShapes(getRecordPath(world, ["state", "m6PolicyEvents"]), errors);
  validateM6AlphaEntryShapes(getRecordPath(world, ["state", "m6Alpha"]), errors);
  if (errors.some((error) => error.code === "invalid-schema")) {
    return errors;
  }

  validateDefinitions(world.definitions, errors);
  validateDefinitionReferences(world.definitions, errors);
  validateRuntimeState(world, errors);
  validateM2RuntimeState(world, errors);
  validateM3RuntimeState(world, errors);
  validateM4RuntimeState(world, errors);
  validateM6RuntimeState(world, errors);
  validateM6PolicyEventRuntimeState(world, errors);
  validateM6AlphaRuntimeState(world, errors);
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

  if (definitions.topology !== undefined) {
    validateMapTopologyEntryShapes(definitions.topology, errors);
  }
  if (definitions.strategicTerrain !== undefined) {
    validateStrategicTerrainEntryShapes(definitions.strategicTerrain, errors);
  }
}

const MAP_TOPOLOGY_ROUTE_MODES: readonly MapTopologyRouteModeV1[] = ["coast", "river", "road"];
const MAP_TOPOLOGY_TERRAIN_CLASSES: readonly MapTopologyTerrainClassV1[] = [
  "coastal",
  "lowland",
  "pass",
  "riverine",
  "upland",
  "urban",
  "unknown"
];
const MAP_TOPOLOGY_RISK_CLASSES: readonly MapTopologyRiskClassV1[] = [
  "contested",
  "hazardous",
  "low",
  "seasonal",
  "unknown"
];
const MAP_TOPOLOGY_HISTORICITY_TAGS: readonly MapTopologyHistoricityTagV1[] = [
  "COMPOSITE",
  "FICTIONAL",
  "HISTORICAL",
  "INFERRED"
];
const MAP_TOPOLOGY_ROUTE_NODE_KINDS: readonly MapTopologyRouteNodeKindV1[] = [
  "pass",
  "port",
  "special",
  "warehouse"
];
const STRATEGIC_TERRAIN_CLASSES: readonly StrategicTerrainClassV1[] = [
  "coastal",
  "lowland",
  "pass",
  "ridge",
  "river-basin",
  "riverine",
  "upland",
  "urban",
  "wetland",
  "unknown"
];
const STRATEGIC_TERRAIN_RISK_CLASSES: readonly StrategicTerrainRiskClassV1[] = [
  "contested",
  "hazardous",
  "low",
  "seasonal",
  "unknown"
];
const STRATEGIC_TERRAIN_HISTORICITY_TAGS: readonly StrategicTerrainHistoricityTagV1[] = [
  "COMPOSITE",
  "FICTIONAL",
  "HISTORICAL",
  "INFERRED"
];
const STRATEGIC_TERRAIN_SEASON_STATES: readonly StrategicTerrainSeasonStateV1[] = [
  "dry",
  "monsoon",
  "transition",
  "unknown"
];
const BARRIER_CHANNEL_KINDS: readonly BarrierChannelKindV1[] = [
  "coast",
  "major-river",
  "ridge",
  "strait",
  "wetland"
];
const STRATEGIC_NODE_KINDS: readonly StrategicNodeKindV1[] = [
  "castle",
  "crossing",
  "objective",
  "pass",
  "port",
  "staging-area",
  "town",
  "warehouse"
];
const STRATEGIC_NODE_KNOWN_STATES: readonly StrategicNodeKnownStateV1[] = [
  "known",
  "rumored",
  "unknown"
];
const ROUTE_CORRIDOR_MODES: readonly RouteCorridorModeV1[] = [
  "coast",
  "mixed",
  "pass",
  "river",
  "road"
];
const ROUTE_CORRIDOR_WIDTH_CLASSES: readonly RouteCorridorWidthClassV1[] = [
  "narrow",
  "standard",
  "wide"
];

function validateMapTopologyEntryShapes(topology: unknown, errors: WorldInvariantError[]): void {
  if (!validateRecordEntry(topology, "definitions.topology", "MapTopologyDefinitionV1", errors)) {
    return;
  }

  if (topology["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "definitions.topology.schemaVersion",
      message: "MapTopologyDefinition schemaVersion must be 1."
    });
  }
  if (topology["hashAlgorithm"] !== "fnv1a32-canonical-map-topology-v1") {
    errors.push({
      code: "invalid-schema",
      path: "definitions.topology.hashAlgorithm",
      message: "MapTopologyDefinition hashAlgorithm must be fnv1a32-canonical-map-topology-v1."
    });
  }
  validateMapTopologyHashField(
    topology,
    "topologyHash",
    "definitions.topology.topologyHash",
    errors
  );
  validateNonEmptyStringField(
    topology,
    "contentManifestHash",
    "definitions.topology.contentManifestHash",
    errors
  );
  validateMapTopologyArray(
    topology["districts"],
    "definitions.topology.districts",
    errors,
    (entry, path) => validateMapTopologyDistrictEntry(entry, path, errors)
  );
  validateMapTopologyArray(
    topology["routeNodes"],
    "definitions.topology.routeNodes",
    errors,
    (entry, path) => validateMapTopologyRouteNodeEntry(entry, path, errors)
  );
  validateMapTopologyArray(
    topology["routeEdges"],
    "definitions.topology.routeEdges",
    errors,
    (entry, path) => validateMapTopologyRouteEdgeEntry(entry, path, errors)
  );
}

function validateMapTopologyArray(
  input: unknown,
  path: string,
  errors: WorldInvariantError[],
  validateEntry: (entry: unknown, path: string) => void
): void {
  if (!Array.isArray(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: `${path} must be an array.`
    });
    return;
  }
  input.forEach((entry, index) => validateEntry(entry, `${path}[${index}]`));
}

function validateMapTopologyDistrictEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyDistrictDefinition", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateDisplayNameKeyField(
    input,
    `${path}.displayNameKey`,
    "MapTopologyDistrictDefinition",
    errors
  );
  validateMapTopologyPointEntry(input["anchor"], `${path}.anchor`, errors);
  validateMapTopologyArray(input["polygon"], `${path}.polygon`, errors, (entry, entryPath) =>
    validateMapTopologyPointEntry(entry, entryPath, errors)
  );
  validateMapTopologyDistrictMetadataEntry(input["metadata"], `${path}.metadata`, errors);
}

function validateMapTopologyRouteNodeEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyRouteNodeDefinition", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "nodeId", `${path}.nodeId`, errors);
  validateStringUnionField(
    input,
    "nodeKind",
    `${path}.nodeKind`,
    MAP_TOPOLOGY_ROUTE_NODE_KINDS,
    errors
  );
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateDisplayNameKeyField(
    input,
    `${path}.displayNameKey`,
    "MapTopologyRouteNodeDefinition",
    errors
  );
  validateMapTopologyPointEntry(input["anchor"], `${path}.anchor`, errors);
}

function validateMapTopologyRouteEdgeEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyRouteEdgeDefinition", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "routeId", `${path}.routeId`, "RouteId", errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateMapTopologyRouteEndpointEntry(input["from"], `${path}.from`, errors);
  validateMapTopologyRouteEndpointEntry(input["to"], `${path}.to`, errors);
  validateStringUnionField(input, "mode", `${path}.mode`, MAP_TOPOLOGY_ROUTE_MODES, errors);
  validatePositiveIntegerField(
    input,
    "baseTravelCost",
    `${path}.baseTravelCost`,
    "baseTravelCost",
    errors
  );
  validatePositiveIntegerField(
    input,
    "baseCapacity",
    `${path}.baseCapacity`,
    "baseCapacity",
    errors
  );
  validateMapTopologyArray(
    input["seasonality"],
    `${path}.seasonality`,
    errors,
    (entry, entryPath) => validateMapTopologySeasonalModifierEntry(entry, entryPath, errors)
  );
  validateMapTopologyRouteAvailabilityEntry(input["availability"], `${path}.availability`, errors);
  validateMapTopologyRouteEdgeMetadataEntry(input["metadata"], `${path}.metadata`, errors);
}

function validateMapTopologyPointEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyPoint", errors)) {
    return;
  }
  validateSafeIntegerField(input, "x", `${path}.x`, errors);
  validateSafeIntegerField(input, "y", `${path}.y`, errors);
}

function validateMapTopologyDistrictMetadataEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyDistrictMetadata", errors)) {
    return;
  }
  validateStringUnionField(
    input,
    "historicity",
    `${path}.historicity`,
    MAP_TOPOLOGY_HISTORICITY_TAGS,
    errors
  );
  validateStringUnionField(
    input,
    "terrainClass",
    `${path}.terrainClass`,
    MAP_TOPOLOGY_TERRAIN_CLASSES,
    errors
  );
  validateStringUnionField(
    input,
    "riskClass",
    `${path}.riskClass`,
    MAP_TOPOLOGY_RISK_CLASSES,
    errors
  );
}

function validateMapTopologyRouteEdgeMetadataEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyRouteEdgeMetadata", errors)) {
    return;
  }
  validateStringUnionField(
    input,
    "historicity",
    `${path}.historicity`,
    MAP_TOPOLOGY_HISTORICITY_TAGS,
    errors
  );
  validateStringUnionField(
    input,
    "terrainClass",
    `${path}.terrainClass`,
    MAP_TOPOLOGY_TERRAIN_CLASSES,
    errors
  );
  validateStringUnionField(
    input,
    "riskClass",
    `${path}.riskClass`,
    MAP_TOPOLOGY_RISK_CLASSES,
    errors
  );
}

function validateMapTopologyRouteEndpointEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyRouteEndpoint", errors)) {
    return;
  }
  validateStringUnionField(
    input,
    "kind",
    `${path}.kind`,
    ["district", "route-node", "settlement"],
    errors
  );
  if (input["kind"] === "district") {
    validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  }
  if (input["kind"] === "route-node") {
    validateNonEmptyStringField(input, "nodeId", `${path}.nodeId`, errors);
  }
  if (input["kind"] === "settlement") {
    validatePositiveIntegerField(
      input,
      "settlementId",
      `${path}.settlementId`,
      "SettlementId",
      errors
    );
  }
}

function validateMapTopologySeasonalModifierEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologySeasonalModifier", errors)) {
    return;
  }
  validateIntegerFieldInRange(input, "month", `${path}.month`, 1, 12, errors);
  validateIntegerFieldInRange(
    input,
    "costMultiplierBps",
    `${path}.costMultiplierBps`,
    1,
    30_000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "capacityMultiplierBps",
    `${path}.capacityMultiplierBps`,
    0,
    30_000,
    errors
  );
  validateStringArray(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateMapTopologyRouteAvailabilityEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "MapTopologyRouteAvailability", errors)) {
    return;
  }
  validateStringUnionField(input, "kind", `${path}.kind`, ["blocked", "open", "unknown"], errors);
  if (input["kind"] === "blocked" || input["kind"] === "unknown") {
    validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  }
}

function validateStrategicTerrainEntryShapes(
  terrain: unknown,
  errors: WorldInvariantError[]
): void {
  if (
    !validateRecordEntry(
      terrain,
      "definitions.strategicTerrain",
      "StrategicTerrainDefinitionV1",
      errors
    )
  ) {
    return;
  }

  if (terrain["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "definitions.strategicTerrain.schemaVersion",
      message: "StrategicTerrainDefinition schemaVersion must be 1."
    });
  }
  if (terrain["hashAlgorithm"] !== "fnv1a32-canonical-strategic-terrain-v1") {
    errors.push({
      code: "invalid-schema",
      path: "definitions.strategicTerrain.hashAlgorithm",
      message:
        "StrategicTerrainDefinition hashAlgorithm must be fnv1a32-canonical-strategic-terrain-v1."
    });
  }
  validateMapTopologyHashField(
    terrain,
    "strategicTerrainHash",
    "definitions.strategicTerrain.strategicTerrainHash",
    errors
  );
  validateNonEmptyStringField(
    terrain,
    "contentManifestHash",
    "definitions.strategicTerrain.contentManifestHash",
    errors
  );
  validateStringUnionField(
    terrain,
    "authority",
    "definitions.strategicTerrain.authority",
    ["terrain-route-node-v1"],
    errors
  );
  validateStringUnionField(
    terrain,
    "governanceFootprintRole",
    "definitions.strategicTerrain.governanceFootprintRole",
    ["overlay-only"],
    errors
  );
  validateStrategicTerrainAuthorityProhibitions(
    terrain["authorityProhibitions"],
    "definitions.strategicTerrain.authorityProhibitions",
    errors
  );
  validateMapTopologyArray(
    terrain["terrainPatches"],
    "definitions.strategicTerrain.terrainPatches",
    errors,
    (entry, path) => validateTerrainPatchEntry(entry, path, errors)
  );
  validateMapTopologyArray(
    terrain["barrierChannels"],
    "definitions.strategicTerrain.barrierChannels",
    errors,
    (entry, path) => validateBarrierChannelEntry(entry, path, errors)
  );
  validateMapTopologyArray(
    terrain["strategicNodes"],
    "definitions.strategicTerrain.strategicNodes",
    errors,
    (entry, path) => validateStrategicNodeEntry(entry, path, errors)
  );
  validateMapTopologyArray(
    terrain["routeCorridors"],
    "definitions.strategicTerrain.routeCorridors",
    errors,
    (entry, path) => validateRouteCorridorEntry(entry, path, errors)
  );
  validateMapTopologyArray(
    terrain["districtGovernanceFootprints"],
    "definitions.strategicTerrain.districtGovernanceFootprints",
    errors,
    (entry, path) => validateDistrictGovernanceFootprintEntry(entry, path, errors)
  );
}

function validateTerrainPatchEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "TerrainPatch", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "patchId", `${path}.patchId`, errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateDisplayNameKeyField(input, `${path}.displayNameKey`, "TerrainPatch", errors);
  validateStringUnionField(
    input,
    "terrainClass",
    `${path}.terrainClass`,
    STRATEGIC_TERRAIN_CLASSES,
    errors
  );
  validateStringUnionField(
    input,
    "seasonSensitivity",
    `${path}.seasonSensitivity`,
    STRATEGIC_TERRAIN_SEASON_STATES,
    errors
  );
  validateStringUnionField(
    input,
    "historicity",
    `${path}.historicity`,
    STRATEGIC_TERRAIN_HISTORICITY_TAGS,
    errors
  );
  validateMapTopologyArray(input["polygon"], `${path}.polygon`, errors, (entry, entryPath) =>
    validateStrategicTerrainPointEntry(entry, entryPath, errors)
  );
  validateStringArray(input["explanationTags"], `${path}.explanationTags`, errors);
}

function validateBarrierChannelEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "BarrierChannel", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "channelId", `${path}.channelId`, errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateDisplayNameKeyField(input, `${path}.displayNameKey`, "BarrierChannel", errors);
  validateStringUnionField(
    input,
    "channelKind",
    `${path}.channelKind`,
    BARRIER_CHANNEL_KINDS,
    errors
  );
  validateStringUnionField(
    input,
    "traversalRule",
    `${path}.traversalRule`,
    ["blocks-without-explicit-corridor", "channels-explicit-corridors"],
    errors
  );
  validateStringUnionField(
    input,
    "historicity",
    `${path}.historicity`,
    STRATEGIC_TERRAIN_HISTORICITY_TAGS,
    errors
  );
  validateMapTopologyArray(input["points"], `${path}.points`, errors, (entry, entryPath) =>
    validateStrategicTerrainPointEntry(entry, entryPath, errors)
  );
  validateStringArray(input["explanationTags"], `${path}.explanationTags`, errors);
}

function validateStrategicNodeEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "StrategicNode", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "nodeId", `${path}.nodeId`, errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateDisplayNameKeyField(input, `${path}.displayNameKey`, "StrategicNode", errors);
  validateStringUnionField(input, "nodeKind", `${path}.nodeKind`, STRATEGIC_NODE_KINDS, errors);
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateStrategicTerrainPointEntry(input["anchor"], `${path}.anchor`, errors);
  validatePositiveIntegerField(
    input,
    "localCapacity",
    `${path}.localCapacity`,
    "localCapacity",
    errors
  );
  validateStringUnionField(
    input,
    "knownState",
    `${path}.knownState`,
    STRATEGIC_NODE_KNOWN_STATES,
    errors
  );
  validateStringArray(input["terrainPatchIds"], `${path}.terrainPatchIds`, errors);
  validateStringArray(input["barrierChannelIds"], `${path}.barrierChannelIds`, errors);
  validateStringArray(input["governanceFootprintIds"], `${path}.governanceFootprintIds`, errors);
  validateStringArray(input["explanationTags"], `${path}.explanationTags`, errors);
}

function validateRouteCorridorEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "RouteCorridor", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "corridorId", `${path}.corridorId`, errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateDisplayNameKeyField(input, `${path}.displayNameKey`, "RouteCorridor", errors);
  validateNonEmptyStringField(input, "fromNodeId", `${path}.fromNodeId`, errors);
  validateNonEmptyStringField(input, "toNodeId", `${path}.toNodeId`, errors);
  validateStringUnionField(input, "mode", `${path}.mode`, ROUTE_CORRIDOR_MODES, errors);
  validateStringUnionField(
    input,
    "widthClass",
    `${path}.widthClass`,
    ROUTE_CORRIDOR_WIDTH_CLASSES,
    errors
  );
  validatePositiveIntegerField(
    input,
    "baseTravelCost",
    `${path}.baseTravelCost`,
    "baseTravelCost",
    errors
  );
  validatePositiveIntegerField(
    input,
    "baseCapacity",
    `${path}.baseCapacity`,
    "baseCapacity",
    errors
  );
  validateStringUnionField(
    input,
    "riskClass",
    `${path}.riskClass`,
    STRATEGIC_TERRAIN_RISK_CLASSES,
    errors
  );
  validateStringArray(input["terrainPatchIds"], `${path}.terrainPatchIds`, errors);
  validateStringArray(input["barrierChannelIds"], `${path}.barrierChannelIds`, errors);
  validateStringArray(input["governanceFootprintIds"], `${path}.governanceFootprintIds`, errors);
  validateMapTopologyArray(
    input["seasonality"],
    `${path}.seasonality`,
    errors,
    (entry, entryPath) => validateRouteCorridorSeasonalModifierEntry(entry, entryPath, errors)
  );
  validateRouteCorridorAvailabilityEntry(input["availability"], `${path}.availability`, errors);
  validateMapTopologyArray(input["polyline"], `${path}.polyline`, errors, (entry, entryPath) =>
    validateStrategicTerrainPointEntry(entry, entryPath, errors)
  );
  validateStringArray(input["explanationTags"], `${path}.explanationTags`, errors);
}

function validateRouteCorridorSeasonalModifierEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "RouteCorridorSeasonalModifier", errors)) {
    return;
  }
  validateIntegerFieldInRange(input, "month", `${path}.month`, 1, 12, errors);
  validateStringUnionField(
    input,
    "seasonState",
    `${path}.seasonState`,
    STRATEGIC_TERRAIN_SEASON_STATES,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "travelCostMultiplierBps",
    `${path}.travelCostMultiplierBps`,
    1,
    30_000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "capacityMultiplierBps",
    `${path}.capacityMultiplierBps`,
    0,
    30_000,
    errors
  );
  validateIntegerFieldInRange(input, "riskBps", `${path}.riskBps`, 0, 10_000, errors);
  validateStringArray(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateRouteCorridorAvailabilityEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "RouteCorridorAvailability", errors)) {
    return;
  }
  validateStringUnionField(input, "kind", `${path}.kind`, ["blocked", "open", "unknown"], errors);
  if (input["kind"] === "blocked" || input["kind"] === "unknown") {
    validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  }
}

function validateDistrictGovernanceFootprintEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "DistrictGovernanceFootprint", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "footprintId", `${path}.footprintId`, errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateDisplayNameKeyField(
    input,
    `${path}.displayNameKey`,
    "DistrictGovernanceFootprint",
    errors
  );
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateBooleanField(input, "overlayOnly", `${path}.overlayOnly`, errors);
  validateMapTopologyArray(input["polygon"], `${path}.polygon`, errors, (entry, entryPath) =>
    validateStrategicTerrainPointEntry(entry, entryPath, errors)
  );
  validateStringArray(input["governanceTags"], `${path}.governanceTags`, errors);
  validateStringArray(input["consequenceTags"], `${path}.consequenceTags`, errors);
}

function validateStrategicTerrainPointEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "StrategicTerrainPoint", errors)) {
    return;
  }
  validateSafeIntegerField(input, "x", `${path}.x`, errors);
  validateSafeIntegerField(input, "y", `${path}.y`, errors);
}

function validateStrategicTerrainAuthorityProhibitions(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return;
  }
  const actual = sortText(input.filter((value): value is string => typeof value === "string"));
  const expected = sortText(STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS);
  if (actual.length !== input.length || actual.join("|") !== expected.join("|")) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Strategic terrain authorityProhibitions must record the fixed ADR-011 bans."
    });
  }
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
  const fieldEngagements = input["fieldEngagements"];
  const sieges = input["sieges"];
  const withdrawals = input["withdrawals"];
  const warOutcomes = input["warOutcomes"];
  const postwarCandidates = input["postwarCandidates"];
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
  if (fieldEngagements !== undefined) {
    validateM4Array(
      fieldEngagements,
      "state.m4.fieldEngagements",
      errors,
      validateM4FieldEngagementEntry
    );
  }
  if (sieges !== undefined) {
    validateM4Array(sieges, "state.m4.sieges", errors, validateM4SiegeEntry);
  }
  if (withdrawals !== undefined) {
    validateM4Array(withdrawals, "state.m4.withdrawals", errors, validateM4WithdrawalEntry);
  }
  if (warOutcomes !== undefined) {
    validateM4Array(warOutcomes, "state.m4.warOutcomes", errors, validateM4WarOutcomeEntry);
  }
  if (postwarCandidates !== undefined) {
    validateM4Array(
      postwarCandidates,
      "state.m4.postwarCandidates",
      errors,
      validateM4PostwarCandidateEntry
    );
  }
}

function validateM6EntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (input === undefined) {
    return;
  }
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6",
      message: "M6 diplomacy legitimacy state must be an object."
    });
    return;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6.schemaVersion",
      message: "M6 diplomacy legitimacy schemaVersion must be 1."
    });
  }
  validateM6Array(
    input["relations"],
    "state.m6.relations",
    "M6 relations",
    errors,
    validateM6RelationEntry
  );
  validateM6Array(
    input["agreements"],
    "state.m6.agreements",
    "M6 agreements",
    errors,
    validateM6AgreementEntry
  );
  validateM6Array(
    input["recognitionEdges"],
    "state.m6.recognitionEdges",
    "M6 recognitionEdges",
    errors,
    validateM6RecognitionEdgeEntry
  );
  validateM6Array(
    input["legitimacySources"],
    "state.m6.legitimacySources",
    "M6 legitimacySources",
    errors,
    validateM6LegitimacySourceEntry
  );
  validateM6Array(
    input["legitimacyProfiles"],
    "state.m6.legitimacyProfiles",
    "M6 legitimacyProfiles",
    errors,
    validateM6LegitimacyProfileEntry
  );
}

function validateM6PolicyEventEntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (input === undefined) {
    return;
  }
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6PolicyEvents",
      message: "M6 policy/event runtime state must be an object."
    });
    return;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6PolicyEvents.schemaVersion",
      message: "M6 policy/event runtime schemaVersion must be 1."
    });
  }
  const definitions = input["definitions"];
  if (!isRecord(definitions)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6PolicyEvents.definitions",
      message: "M6 policy/event definitions must be an object."
    });
  } else {
    validateM6Array(
      definitions["policies"],
      "state.m6PolicyEvents.definitions.policies",
      "M6 policy definitions",
      errors,
      validateM6PolicyDefinitionEntry
    );
    validateM6Array(
      definitions["events"],
      "state.m6PolicyEvents.definitions.events",
      "M6 event definitions",
      errors,
      validateM6PolicyEventDefinitionEntry
    );
  }
  validateM6Array(
    input["activeEvents"],
    "state.m6PolicyEvents.activeEvents",
    "M6 active policy events",
    errors,
    validateM6PolicyEventActiveEntry
  );
  validateM6Array(
    input["resolvedEvents"],
    "state.m6PolicyEvents.resolvedEvents",
    "M6 resolved policy events",
    errors,
    validateM6PolicyEventResolvedEntry
  );
  validateM6Array(
    input["policyModifiers"],
    "state.m6PolicyEvents.policyModifiers",
    "M6 policy modifiers",
    errors,
    validateM6PolicyModifierEntry
  );
  validatePositiveIntegerField(
    input,
    "nextEventInstanceId",
    "state.m6PolicyEvents.nextEventInstanceId",
    "M6PolicyEventInstanceId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "nextModifierId",
    "state.m6PolicyEvents.nextModifierId",
    "M6PolicyModifierId",
    errors
  );
}

function validateM6AlphaEntryShapes(input: unknown, errors: WorldInvariantError[]): void {
  if (input === undefined) {
    return;
  }
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6Alpha",
      message: "M6 Alpha runtime state must be an object."
    });
    return;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push({
      code: "invalid-schema",
      path: "state.m6Alpha.schemaVersion",
      message: "M6 Alpha schemaVersion must be 1."
    });
  }
  validateM6Array(
    input["terminalStates"],
    "state.m6Alpha.terminalStates",
    "M6 Alpha terminalStates",
    errors,
    validateM6AlphaTerminalStateEntry
  );
}

function validateM6AlphaTerminalStateEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6AlphaTerminalState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "terminalStateId",
    `${path}.terminalStateId`,
    "M6AlphaTerminalStateId",
    errors
  );
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateStringUnionField(
    input,
    "outcome",
    `${path}.outcome`,
    ["victory", "defeat", "continued-play"],
    errors
  );
  validateNonnegativeIntegerField(input, "evaluatedDay", `${path}.evaluatedDay`, errors);
  validateNonnegativeIntegerField(input, "evaluatedRevision", `${path}.evaluatedRevision`, errors);
  validateNonnegativeIntegerField(input, "maxDay", `${path}.maxDay`, errors);
  validateM6AlphaTerminalEvidenceEntry(input["evidence"], `${path}.evidence`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM6AlphaTerminalEvidenceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6AlphaTerminalEvidence", errors)) {
    return;
  }
  validateNonnegativeIntegerField(input, "recognizedByCount", `${path}.recognizedByCount`, errors);
  validateIntegerFieldInRange(
    input,
    "legitimacyScoreBps",
    `${path}.legitimacyScoreBps`,
    0,
    10_000,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "postwarArrangementCount",
    `${path}.postwarArrangementCount`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "resolvedPolicyEventCount",
    `${path}.resolvedPolicyEventCount`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "successionResolvedCount",
    `${path}.successionResolvedCount`,
    errors
  );
  validateNonnegativeIntegerField(input, "routeCount", `${path}.routeCount`, errors);
  validateNonnegativeIntegerField(
    input,
    "populationGroupCount",
    `${path}.populationGroupCount`,
    errors
  );
}

function validateM6PolicyDefinitionEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyDefinitionState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, "M6PolicyId", errors);
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyStringField(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateStringArrayField(input["encyclopediaRefs"], `${path}.encyclopediaRefs`, errors);
}

function validateM6PolicyEventDefinitionEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyEventDefinitionState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "eventDefinitionId",
    `${path}.eventDefinitionId`,
    "M6PolicyEventDefinitionId",
    errors
  );
  validateNonEmptyStringField(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyStringField(input, "displayNameKey", `${path}.displayNameKey`, errors);
  const cause = input["cause"];
  if (!isRecord(cause)) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.cause`,
      message: "Cause must be object."
    });
  } else {
    validateStringUnionField(cause, "kind", `${path}.cause.kind`, ["day-at-least"], errors);
    validateNonnegativeIntegerField(cause, "day", `${path}.cause.day`, errors);
    validateStringArrayField(cause["reasonCodes"], `${path}.cause.reasonCodes`, errors);
  }
  validateM6Array(
    input["options"],
    `${path}.options`,
    "M6 event options",
    errors,
    validateM6PolicyEventOptionEntry
  );
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateStringArrayField(input["encyclopediaRefs"], `${path}.encyclopediaRefs`, errors);
}

function validateM6PolicyEventOptionEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyEventOptionState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "optionId", `${path}.optionId`, "M6OptionId", errors);
  validateNonEmptyStringField(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateM6Array(
    input["consequences"],
    `${path}.consequences`,
    "M6 event consequences",
    errors,
    validateM6PolicyEventConsequenceEntry
  );
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateStringArrayField(input["encyclopediaRefs"], `${path}.encyclopediaRefs`, errors);
}

function validateM6PolicyEventConsequenceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyEventConsequenceState", errors)) {
    return;
  }
  validateStringUnionField(input, "kind", `${path}.kind`, ["policy-modifier"], errors);
  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, "M6PolicyId", errors);
  validateIntegerFieldInRange(
    input,
    "magnitudeBps",
    `${path}.magnitudeBps`,
    -10_000,
    10_000,
    errors
  );
  validatePositiveIntegerField(
    input,
    "durationDays",
    `${path}.durationDays`,
    "durationDays",
    errors
  );
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM6PolicyEventActiveEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyEventActiveState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "eventInstanceId",
    `${path}.eventInstanceId`,
    "M6PolicyEventInstanceId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "eventDefinitionId",
    `${path}.eventDefinitionId`,
    "M6PolicyEventDefinitionId",
    errors
  );
  validateNonnegativeIntegerField(input, "activatedDay", `${path}.activatedDay`, errors);
  validateStringArrayField(input["causeReasonCodes"], `${path}.causeReasonCodes`, errors);
}

function validateM6PolicyEventResolvedEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyEventResolvedState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "eventInstanceId",
    `${path}.eventInstanceId`,
    "M6PolicyEventInstanceId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "eventDefinitionId",
    `${path}.eventDefinitionId`,
    "M6PolicyEventDefinitionId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "selectedOptionId",
    `${path}.selectedOptionId`,
    "M6OptionId",
    errors
  );
  validateNonnegativeIntegerField(input, "resolvedDay", `${path}.resolvedDay`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM6PolicyModifierEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6PolicyModifierState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "modifierId",
    `${path}.modifierId`,
    "M6PolicyModifierId",
    errors
  );
  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, "M6PolicyId", errors);
  validatePositiveIntegerField(
    input,
    "eventInstanceId",
    `${path}.eventInstanceId`,
    "M6PolicyEventInstanceId",
    errors
  );
  validateIntegerFieldInRange(
    input,
    "magnitudeBps",
    `${path}.magnitudeBps`,
    -10_000,
    10_000,
    errors
  );
  validateNonnegativeIntegerField(input, "startDay", `${path}.startDay`, errors);
  validateNonnegativeIntegerField(input, "endDay", `${path}.endDay`, errors);
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM6Array(
  input: unknown,
  path: string,
  label: string,
  errors: WorldInvariantError[],
  validateEntry: (entry: unknown, path: string, errors: WorldInvariantError[]) => void
): void {
  if (!Array.isArray(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: `${label} must be an array.`
    });
    return;
  }
  input.forEach((entry, index) => validateEntry(entry, `${path}[${index}]`, errors));
}

function validateM6RelationEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6DiplomaticRelationState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "relationId", `${path}.relationId`, "M6RelationId", errors);
  validatePositiveIntegerField(input, "polityAId", `${path}.polityAId`, "PolityId", errors);
  validatePositiveIntegerField(input, "polityBId", `${path}.polityBId`, "PolityId", errors);
  validateIntegerFieldInRange(input, "trustBps", `${path}.trustBps`, 0, 10_000, errors);
  validateIntegerFieldInRange(input, "affinityBps", `${path}.affinityBps`, 0, 10_000, errors);
  validateIntegerFieldInRange(input, "fearBps", `${path}.fearBps`, 0, 10_000, errors);
  validateIntegerFieldInRange(input, "threatBps", `${path}.threatBps`, 0, 10_000, errors);
  validateIntegerFieldInRange(
    input,
    "interestAlignmentBps",
    `${path}.interestAlignmentBps`,
    0,
    10_000,
    errors
  );
  validateNonnegativeIntegerField(input, "historicalDebt", `${path}.historicalDebt`, errors);
  validateIntegerFieldInRange(
    input,
    "borderConflictBps",
    `${path}.borderConflictBps`,
    0,
    10_000,
    errors
  );
  validateNonnegativeIntegerField(input, "updatedDay", `${path}.updatedDay`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM6AgreementEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6DiplomaticAgreementState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "agreementId",
    `${path}.agreementId`,
    "M6AgreementId",
    errors
  );
  validatePositiveIntegerField(input, "relationId", `${path}.relationId`, "M6RelationId", errors);
  validatePositiveIntegerField(
    input,
    "proposerPolityId",
    `${path}.proposerPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "targetPolityId",
    `${path}.targetPolityId`,
    "PolityId",
    errors
  );
  validateStringUnionField(
    input,
    "agreementKind",
    `${path}.agreementKind`,
    ["non-aggression", "military-access", "tribute-recognition"],
    errors
  );
  validateStringUnionField(
    input,
    "status",
    `${path}.status`,
    ["proposed", "active", "rejected"],
    errors
  );
  validateNonnegativeIntegerField(input, "startDay", `${path}.startDay`, errors);
  validateNonnegativeIntegerField(input, "endDay", `${path}.endDay`, errors);
  validateStringUnionField(
    input,
    "recognitionDirection",
    `${path}.recognitionDirection`,
    ["none", "proposer-recognizes-target", "target-recognizes-proposer"],
    errors
  );
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM6RecognitionEdgeEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6RecognitionEdgeState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "fromPolityId", `${path}.fromPolityId`, "PolityId", errors);
  validatePositiveIntegerField(input, "toPolityId", `${path}.toPolityId`, "PolityId", errors);
  validatePositiveIntegerField(
    input,
    "agreementId",
    `${path}.agreementId`,
    "M6AgreementId",
    errors
  );
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM6LegitimacySourceEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6LegitimacySourceState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "sourceId",
    `${path}.sourceId`,
    "M6LegitimacySourceId",
    errors
  );
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateStringUnionField(
    input,
    "audience",
    `${path}.audience`,
    [
      "court",
      "local-lords",
      "military-retinue",
      "merchants",
      "ritual-network",
      "vassal-rulers",
      "foreign-courts"
    ],
    errors
  );
  validateStringUnionField(
    input,
    "sourceKind",
    `${path}.sourceKind`,
    [
      "diplomatic-recognition",
      "obligation-fulfilled",
      "obligation-breached",
      "succession-continuity",
      "postwar-settlement",
      "campaign-consequence"
    ],
    errors
  );
  validateIntegerFieldInRange(
    input,
    "magnitudeBps",
    `${path}.magnitudeBps`,
    -10_000,
    10_000,
    errors
  );
  validateNonEmptyStringField(input, "sourceRef", `${path}.sourceRef`, errors);
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
  validateNonnegativeIntegerField(input, "createdDay", `${path}.createdDay`, errors);
}

function validateM6LegitimacyProfileEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M6LegitimacyProfileState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateStringUnionField(
    input,
    "audience",
    `${path}.audience`,
    [
      "court",
      "local-lords",
      "military-retinue",
      "merchants",
      "ritual-network",
      "vassal-rulers",
      "foreign-courts"
    ],
    errors
  );
  validateIntegerFieldInRange(input, "scoreBps", `${path}.scoreBps`, 0, 10_000, errors);
  validateIntegerFieldInRange(input, "pressureBps", `${path}.pressureBps`, 0, 10_000, errors);
  validatePositiveIntegerArrayField(input["sourceIds"], `${path}.sourceIds`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
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

function validateM4FieldEngagementEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4FieldEngagementState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "engagementId",
    `${path}.engagementId`,
    "FieldEngagementId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validatePositiveIntegerField(input, "marchId", `${path}.marchId`, "CampaignMarchId", errors);
  validatePositiveIntegerField(
    input,
    "attackerPolityId",
    `${path}.attackerPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "defenderPolityId",
    `${path}.defenderPolityId`,
    "PolityId",
    errors
  );
  validateM4CampaignTargetEntry(input["target"], `${path}.target`, errors);
  validateNonnegativeIntegerField(
    input,
    "attackerTroopsBefore",
    `${path}.attackerTroopsBefore`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "attackerTroopsAfter",
    `${path}.attackerTroopsAfter`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "defenderEstimatedTroopsBefore",
    `${path}.defenderEstimatedTroopsBefore`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "defenderEstimatedTroopsAfter",
    `${path}.defenderEstimatedTroopsAfter`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "attackerCasualties",
    `${path}.attackerCasualties`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "defenderCasualties",
    `${path}.defenderCasualties`,
    errors
  );
  validateNonnegativeIntegerField(input, "supplyLoss", `${path}.supplyLoss`, errors);
  validateNonnegativeIntegerField(
    input,
    "defenderFortification",
    `${path}.defenderFortification`,
    errors
  );
  validateM4FieldEngagementOutcomeValue(input["outcome"], `${path}.outcome`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateM4Array(input["creditHooks"], `${path}.creditHooks`, errors, validateM4CampaignHookEntry);
  validateM4Array(
    input["reputationHooks"],
    `${path}.reputationHooks`,
    errors,
    validateM4CampaignHookEntry
  );
  validateNonnegativeIntegerField(input, "resolvedDay", `${path}.resolvedDay`, errors);
}

function validateM4SiegeEntry(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!validateRecordEntry(input, path, "M4SiegeState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "siegeId", `${path}.siegeId`, "SiegeId", errors);
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validatePositiveIntegerField(input, "marchId", `${path}.marchId`, "CampaignMarchId", errors);
  validatePositiveIntegerField(
    input,
    "targetDistrictId",
    `${path}.targetDistrictId`,
    "DistrictId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "attackerPolityId",
    `${path}.attackerPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "defenderPolityId",
    `${path}.defenderPolityId`,
    "PolityId",
    errors
  );
  validateM4SiegeStatusValue(input["status"], `${path}.status`, errors);
  validateNonEmptyStringField(input, "statusReasonCode", `${path}.statusReasonCode`, errors);
  validateNonnegativeIntegerField(input, "fortification", `${path}.fortification`, errors);
  validateNonnegativeIntegerField(
    input,
    "defenderEstimatedTroops",
    `${path}.defenderEstimatedTroops`,
    errors
  );
  validateNonnegativeIntegerField(input, "defenderSupply", `${path}.defenderSupply`, errors);
  validateNonnegativeIntegerField(input, "siegeProgress", `${path}.siegeProgress`, errors);
  validateNonnegativeIntegerField(input, "daysInvested", `${path}.daysInvested`, errors);
  validateNonnegativeIntegerField(input, "blockadeDays", `${path}.blockadeDays`, errors);
  validateNonnegativeIntegerField(input, "assaultCount", `${path}.assaultCount`, errors);
  validateNonnegativeIntegerField(input, "attackerTroops", `${path}.attackerTroops`, errors);
  validateNonnegativeIntegerField(
    input,
    "attackerCasualties",
    `${path}.attackerCasualties`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "defenderCasualties",
    `${path}.defenderCasualties`,
    errors
  );
  validateNonnegativeIntegerField(input, "supplyLoss", `${path}.supplyLoss`, errors);
  validateBooleanField(input, "surrenderEligible", `${path}.surrenderEligible`, errors);
  validateStringArrayField(input["surrenderReasonCodes"], `${path}.surrenderReasonCodes`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateM4Array(input["creditHooks"], `${path}.creditHooks`, errors, validateM4CampaignHookEntry);
  validateM4Array(
    input["reputationHooks"],
    `${path}.reputationHooks`,
    errors,
    validateM4CampaignHookEntry
  );
  validateNonnegativeIntegerField(input, "startedDay", `${path}.startedDay`, errors);
  validateNonnegativeIntegerField(input, "updatedDay", `${path}.updatedDay`, errors);
}

function validateM4CampaignHookEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4CampaignHookState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "polityId", `${path}.polityId`, "PolityId", errors);
  validateNonnegativeIntegerField(input, "amount", `${path}.amount`, errors);
  validateNonEmptyStringField(input, "reasonCode", `${path}.reasonCode`, errors);
}

function validateM4WithdrawalEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4WithdrawalState", errors)) {
    return;
  }
  validatePositiveIntegerField(
    input,
    "withdrawalId",
    `${path}.withdrawalId`,
    "WithdrawalId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validateNullablePositiveIntegerField(
    input,
    "marchId",
    `${path}.marchId`,
    "CampaignMarchId",
    errors
  );
  validateNullablePositiveIntegerField(input, "siegeId", `${path}.siegeId`, "SiegeId", errors);
  validateStringUnionField(
    input,
    "kind",
    `${path}.kind`,
    ["orderly-withdrawal", "forced-retreat", "cancelled-before-departure", "failed-extraction"],
    errors
  );
  validateStringUnionField(
    input,
    "triggerReason",
    `${path}.triggerReason`,
    ["ordered", "supply", "season", "siege", "loss", "objective-complete"],
    errors
  );
  validateNonnegativeIntegerField(input, "troopsBefore", `${path}.troopsBefore`, errors);
  validateNonnegativeIntegerField(input, "troopsExtracted", `${path}.troopsExtracted`, errors);
  validateNonnegativeIntegerField(input, "casualties", `${path}.casualties`, errors);
  validateNonnegativeIntegerField(input, "supplyLoss", `${path}.supplyLoss`, errors);
  validateM4Array(input["creditHooks"], `${path}.creditHooks`, errors, validateM4CampaignHookEntry);
  validateM4Array(
    input["reputationHooks"],
    `${path}.reputationHooks`,
    errors,
    validateM4CampaignHookEntry
  );
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateNonnegativeIntegerField(input, "resolvedDay", `${path}.resolvedDay`, errors);
}

function validateM4WarOutcomeEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4WarOutcomeState", errors)) {
    return;
  }
  validatePositiveIntegerField(input, "outcomeId", `${path}.outcomeId`, "WarOutcomeId", errors);
  validatePositiveIntegerField(
    input,
    "campaignPlanId",
    `${path}.campaignPlanId`,
    "CampaignPlanId",
    errors
  );
  validatePositiveIntegerField(
    input,
    "victorPolityId",
    `${path}.victorPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(input, "localPolityId", `${path}.localPolityId`, "PolityId", errors);
  validatePositiveIntegerField(
    input,
    "targetDistrictId",
    `${path}.targetDistrictId`,
    "DistrictId",
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "attackerCasualties",
    `${path}.attackerCasualties`,
    errors
  );
  validateNonnegativeIntegerField(
    input,
    "defenderCasualties",
    `${path}.defenderCasualties`,
    errors
  );
  validateNonnegativeIntegerField(input, "supplyLoss", `${path}.supplyLoss`, errors);
  validateNullablePositiveIntegerField(
    input,
    "withdrawalId",
    `${path}.withdrawalId`,
    "WithdrawalId",
    errors
  );
  validateNullablePositiveIntegerField(input, "siegeId", `${path}.siegeId`, "SiegeId", errors);
  if (input["postwarCandidate"] !== null) {
    validateM4PostwarCandidateEntry(input["postwarCandidate"], `${path}.postwarCandidate`, errors);
  }
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
  validateNonnegativeIntegerField(input, "resolvedDay", `${path}.resolvedDay`, errors);
}

function validateM4PostwarCandidateEntry(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!validateRecordEntry(input, path, "M4PostwarCandidateState", errors)) {
    return;
  }
  validateNonEmptyStringField(input, "candidateId", `${path}.candidateId`, errors);
  validatePositiveIntegerField(
    input,
    "sourceWarOutcomeId",
    `${path}.sourceWarOutcomeId`,
    "WarOutcomeId",
    errors
  );
  validateNonEmptyStringField(input, "settlementId", `${path}.settlementId`, errors);
  validatePositiveIntegerField(
    input,
    "victorPolityId",
    `${path}.victorPolityId`,
    "PolityId",
    errors
  );
  validatePositiveIntegerField(input, "localPolityId", `${path}.localPolityId`, "PolityId", errors);
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, "DistrictId", errors);
  validateM4PostwarMethods(input["validM3Methods"], `${path}.validM3Methods`, errors);
  validateStringArrayField(input["reasonCodes"], `${path}.reasonCodes`, errors);
}

function validateM4PostwarMethods(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!Array.isArray(input) || input.length === 0) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be a non-empty array.` });
    return;
  }
  input.forEach((method, index) =>
    validateStringUnionValue(
      method,
      `${path}[${index}]`,
      ["direct-control", "restore-vassal-ruler", "tribute-only"],
      errors
    )
  );
}

function validateStringUnionValue(
  value: unknown,
  path: string,
  allowedValues: readonly string[],
  errors: WorldInvariantError[]
): void {
  if (typeof value === "string" && allowedValues.includes(value)) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be one of ${allowedValues.join(", ")}.`
  });
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

function validateM4FieldEngagementOutcomeValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (input === "attacker-victory" || input === "defender-holds") {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 field engagement outcome is invalid."
  });
}

function validateM4SiegeStatusValue(
  input: unknown,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (
    input === "blockading" ||
    input === "surrender-ready" ||
    input === "surrendered" ||
    input === "lifted" ||
    input === "withdrawn"
  ) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: "M4 siege status is invalid."
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

  validateStringUnionField(
    input,
    "kind",
    `${path}.kind`,
    ["death", "incapacity", "abdication"],
    errors
  );
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

function validateMapTopologyHashField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (typeof value === "string" && /^[0-9a-f]{8}$/u.test(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be an 8-character lowercase hex string.`
  });
}

function validateSafeIntegerField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const value = entry[key];
  if (typeof value === "number" && Number.isSafeInteger(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a safe integer.`
  });
}

function validateStringArray(input: unknown, path: string, errors: WorldInvariantError[]): void {
  if (!Array.isArray(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: `${path} must be an array.`
    });
    return;
  }

  input.forEach((value, index) => {
    if (typeof value === "string" && value.length > 0) {
      return;
    }

    errors.push({
      code: "invalid-schema",
      path: `${path}[${index}]`,
      message: `${path}[${index}] must be a non-empty string.`
    });
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
  m4: M4CampaignStateV0 | undefined,
  m6: M6DiplomacyLegitimacyStateV0 | undefined,
  m6PolicyEvents: M6PolicyEventRuntimeStateV0 | undefined,
  m6Alpha: M6AlphaRuntimeStateV0 | undefined
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

  if (
    m2 === undefined &&
    m3 === undefined &&
    m4 === undefined &&
    m6 === undefined &&
    m6PolicyEvents === undefined &&
    m6Alpha === undefined
  ) {
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

  if (m6 !== undefined) {
    nextState = { ...nextState, m6: canonicalizeM6DiplomacyLegitimacyStateV0(m6) };
  }

  if (m6PolicyEvents !== undefined) {
    nextState = {
      ...nextState,
      m6PolicyEvents: canonicalizeM6PolicyEventRuntimeStateV0(m6PolicyEvents)
    };
  }

  if (m6Alpha !== undefined) {
    nextState = { ...nextState, m6Alpha: canonicalizeM6AlphaRuntimeStateV0(m6Alpha) };
  }

  return nextState;
}

function canonicalizeDefinitions(definitions: WorldDefinitionsV0): WorldDefinitionsV0 {
  return {
    polities: sortByNumericId(definitions.polities),
    persons: sortByNumericId(definitions.persons),
    districts: sortByNumericId(definitions.districts),
    settlements: sortByNumericId(definitions.settlements),
    routes: sortByNumericId(definitions.routes),
    ...(definitions.topology === undefined
      ? {}
      : { topology: canonicalizeMapTopologyDefinitionV1(definitions.topology) }),
    ...(definitions.strategicTerrain === undefined
      ? {}
      : {
          strategicTerrain: canonicalizeStrategicTerrainDefinitionV1(definitions.strategicTerrain)
        })
  };
}

export function canonicalizeMapTopologyDefinitionV1(
  topology: MapTopologyDefinitionV1
): MapTopologyDefinitionV1 {
  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-map-topology-v1",
    topologyHash: topology.topologyHash,
    contentManifestHash: topology.contentManifestHash,
    districts: sortMapTopologyDistrictDefinitions(topology.districts).map((district) => ({
      districtId: district.districtId,
      sourceId: district.sourceId,
      displayNameKey: district.displayNameKey,
      anchor: copyMapTopologyPoint(district.anchor),
      polygon: district.polygon.map(copyMapTopologyPoint),
      metadata: {
        historicity: district.metadata.historicity,
        terrainClass: district.metadata.terrainClass,
        riskClass: district.metadata.riskClass
      }
    })),
    routeNodes: sortMapTopologyRouteNodeDefinitions(topology.routeNodes).map((node) => ({
      nodeId: node.nodeId,
      nodeKind: node.nodeKind,
      districtId: node.districtId,
      displayNameKey: node.displayNameKey,
      anchor: copyMapTopologyPoint(node.anchor)
    })),
    routeEdges: sortMapTopologyRouteEdgeDefinitions(topology.routeEdges).map((edge) => ({
      routeId: edge.routeId,
      sourceId: edge.sourceId,
      from: copyMapTopologyRouteEndpoint(edge.from),
      to: copyMapTopologyRouteEndpoint(edge.to),
      mode: edge.mode,
      baseTravelCost: edge.baseTravelCost,
      baseCapacity: edge.baseCapacity,
      seasonality: sortMapTopologySeasonalModifiers(edge.seasonality).map((season) => ({
        month: season.month,
        costMultiplierBps: season.costMultiplierBps,
        capacityMultiplierBps: season.capacityMultiplierBps,
        reasonCodes: sortText(season.reasonCodes)
      })),
      availability: copyMapTopologyRouteAvailability(edge.availability),
      metadata: {
        historicity: edge.metadata.historicity,
        terrainClass: edge.metadata.terrainClass,
        riskClass: edge.metadata.riskClass
      }
    }))
  };
}

export function hashMapTopologyDefinitionV1(topology: MapTopologyDefinitionV1): MapTopologyHash {
  const canonicalTopology = canonicalizeMapTopologyDefinitionV1(topology);
  return parseMapTopologyHash(
    toFixedHexHash(hashText(formatMapTopologyDefinitionForHash(canonicalTopology)))
  );
}

export function canonicalizeStrategicTerrainDefinitionV1(
  terrain: StrategicTerrainDefinitionV1
): StrategicTerrainDefinitionV1 {
  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1",
    strategicTerrainHash: terrain.strategicTerrainHash,
    contentManifestHash: terrain.contentManifestHash,
    authority: "terrain-route-node-v1",
    governanceFootprintRole: "overlay-only",
    authorityProhibitions: sortStrategicTerrainAuthorityProhibitions(terrain.authorityProhibitions),
    terrainPatches: sortTerrainPatches(terrain.terrainPatches).map((patch) => ({
      patchId: patch.patchId,
      sourceId: patch.sourceId,
      displayNameKey: patch.displayNameKey,
      terrainClass: patch.terrainClass,
      seasonSensitivity: patch.seasonSensitivity,
      historicity: patch.historicity,
      polygon: patch.polygon.map(copyStrategicTerrainPoint),
      explanationTags: sortText(patch.explanationTags)
    })),
    barrierChannels: sortBarrierChannels(terrain.barrierChannels).map((channel) => ({
      channelId: channel.channelId,
      sourceId: channel.sourceId,
      displayNameKey: channel.displayNameKey,
      channelKind: channel.channelKind,
      traversalRule: channel.traversalRule,
      historicity: channel.historicity,
      points: channel.points.map(copyStrategicTerrainPoint),
      explanationTags: sortText(channel.explanationTags)
    })),
    strategicNodes: sortStrategicNodes(terrain.strategicNodes).map((node) => ({
      nodeId: node.nodeId,
      sourceId: node.sourceId,
      displayNameKey: node.displayNameKey,
      nodeKind: node.nodeKind,
      districtId: node.districtId,
      anchor: copyStrategicTerrainPoint(node.anchor),
      localCapacity: node.localCapacity,
      knownState: node.knownState,
      terrainPatchIds: sortText(node.terrainPatchIds),
      barrierChannelIds: sortText(node.barrierChannelIds),
      governanceFootprintIds: sortText(node.governanceFootprintIds),
      explanationTags: sortText(node.explanationTags)
    })),
    routeCorridors: sortRouteCorridors(terrain.routeCorridors).map((corridor) => ({
      corridorId: corridor.corridorId,
      sourceId: corridor.sourceId,
      displayNameKey: corridor.displayNameKey,
      fromNodeId: corridor.fromNodeId,
      toNodeId: corridor.toNodeId,
      mode: corridor.mode,
      widthClass: corridor.widthClass,
      baseTravelCost: corridor.baseTravelCost,
      baseCapacity: corridor.baseCapacity,
      riskClass: corridor.riskClass,
      terrainPatchIds: sortText(corridor.terrainPatchIds),
      barrierChannelIds: sortText(corridor.barrierChannelIds),
      governanceFootprintIds: sortText(corridor.governanceFootprintIds),
      seasonality: sortRouteCorridorSeasonalModifiers(corridor.seasonality).map((season) => ({
        month: season.month,
        seasonState: season.seasonState,
        travelCostMultiplierBps: season.travelCostMultiplierBps,
        capacityMultiplierBps: season.capacityMultiplierBps,
        riskBps: season.riskBps,
        reasonCodes: sortText(season.reasonCodes)
      })),
      availability: copyRouteCorridorAvailability(corridor.availability),
      polyline: corridor.polyline.map(copyStrategicTerrainPoint),
      explanationTags: sortText(corridor.explanationTags)
    })),
    districtGovernanceFootprints: sortDistrictGovernanceFootprints(
      terrain.districtGovernanceFootprints
    ).map((footprint) => ({
      footprintId: footprint.footprintId,
      sourceId: footprint.sourceId,
      displayNameKey: footprint.displayNameKey,
      districtId: footprint.districtId,
      overlayOnly: true,
      polygon: footprint.polygon.map(copyStrategicTerrainPoint),
      governanceTags: sortText(footprint.governanceTags),
      consequenceTags: sortText(footprint.consequenceTags)
    }))
  };
}

export function hashStrategicTerrainDefinitionV1(
  terrain: StrategicTerrainDefinitionV1
): StrategicTerrainHash {
  const canonicalTerrain = canonicalizeStrategicTerrainDefinitionV1(terrain);
  return parseStrategicTerrainHash(
    toFixedHexHash(hashText(formatStrategicTerrainDefinitionForHash(canonicalTerrain)))
  );
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
    marches: input?.marches ?? [],
    fieldEngagements: input?.fieldEngagements ?? [],
    sieges: input?.sieges ?? [],
    withdrawals: input?.withdrawals ?? [],
    warOutcomes: input?.warOutcomes ?? [],
    postwarCandidates: input?.postwarCandidates ?? []
  });
}

export function createM6DiplomacyLegitimacyStateV0(
  _definitions: WorldDefinitionsV0,
  input?: Partial<M6DiplomacyLegitimacyStateV0>
): M6DiplomacyLegitimacyStateV0 {
  return canonicalizeM6DiplomacyLegitimacyStateV0({
    schemaVersion: 1,
    relations: input?.relations ?? [],
    agreements: input?.agreements ?? [],
    recognitionEdges: input?.recognitionEdges ?? [],
    legitimacySources: input?.legitimacySources ?? [],
    legitimacyProfiles: input?.legitimacyProfiles ?? []
  });
}

export function canonicalizeM6DiplomacyLegitimacyStateV0(
  m6: M6DiplomacyLegitimacyStateV0
): M6DiplomacyLegitimacyStateV0 {
  return {
    schemaVersion: 1,
    relations: sortM6Relations(m6.relations).map((relation) => ({
      relationId: parseM6DiplomaticRelationId(relation.relationId),
      polityAId: parsePolityId(relation.polityAId),
      polityBId: parsePolityId(relation.polityBId),
      trustBps: parseBps(relation.trustBps, "M6 trustBps"),
      affinityBps: parseBps(relation.affinityBps, "M6 affinityBps"),
      fearBps: parseBps(relation.fearBps, "M6 fearBps"),
      threatBps: parseBps(relation.threatBps, "M6 threatBps"),
      interestAlignmentBps: parseBps(relation.interestAlignmentBps, "M6 interestAlignmentBps"),
      historicalDebt: parseNonnegativeInteger(relation.historicalDebt, "M6 historicalDebt"),
      borderConflictBps: parseBps(relation.borderConflictBps, "M6 borderConflictBps"),
      updatedDay: parseGameDay(relation.updatedDay),
      reasonCodes: sortText(relation.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M6 relation reasonCode")
      )
    })),
    agreements: sortM6Agreements(m6.agreements).map((agreement) => ({
      agreementId: parseM6DiplomaticAgreementId(agreement.agreementId),
      relationId: parseM6DiplomaticRelationId(agreement.relationId),
      proposerPolityId: parsePolityId(agreement.proposerPolityId),
      targetPolityId: parsePolityId(agreement.targetPolityId),
      agreementKind: parseM6DiplomaticAgreementKind(agreement.agreementKind),
      status: parseM6DiplomaticAgreementStatus(agreement.status),
      startDay: parseGameDay(agreement.startDay),
      endDay: parseGameDay(agreement.endDay),
      recognitionDirection: parseM6DiplomaticRecognitionDirection(agreement.recognitionDirection),
      reasonCodes: sortText(agreement.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M6 agreement reasonCode")
      )
    })),
    recognitionEdges: sortM6RecognitionEdges(m6.recognitionEdges).map((edge) => ({
      fromPolityId: parsePolityId(edge.fromPolityId),
      toPolityId: parsePolityId(edge.toPolityId),
      agreementId: parseM6DiplomaticAgreementId(edge.agreementId),
      reasonCode: parseDisplayNameKey(edge.reasonCode, "M6 recognition reasonCode")
    })),
    legitimacySources: sortM6LegitimacySources(m6.legitimacySources).map((source) => ({
      sourceId: parseM6LegitimacySourceId(source.sourceId),
      polityId: parsePolityId(source.polityId),
      audience: parseM6LegitimacyAudience(source.audience),
      sourceKind: parseM6LegitimacySourceKind(source.sourceKind),
      magnitudeBps: parseSignedBps(source.magnitudeBps, "M6 magnitudeBps"),
      sourceRef: parseDisplayNameKey(source.sourceRef, "M6 sourceRef"),
      reasonCode: parseDisplayNameKey(source.reasonCode, "M6 source reasonCode"),
      createdDay: parseGameDay(source.createdDay)
    })),
    legitimacyProfiles: sortM6LegitimacyProfiles(m6.legitimacyProfiles).map((profile) => ({
      polityId: parsePolityId(profile.polityId),
      audience: parseM6LegitimacyAudience(profile.audience),
      scoreBps: parseBps(profile.scoreBps, "M6 scoreBps"),
      pressureBps: parseBps(profile.pressureBps, "M6 pressureBps"),
      sourceIds: sortNumericIds(profile.sourceIds).map(parseM6LegitimacySourceId),
      reasonCodes: sortText(profile.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M6 profile reasonCode")
      )
    }))
  };
}

export function createM6PolicyEventRuntimeStateV0(
  input: Pick<M6PolicyEventRuntimeStateV0, "definitions"> &
    Partial<Omit<M6PolicyEventRuntimeStateV0, "definitions" | "schemaVersion">>
): M6PolicyEventRuntimeStateV0 {
  return canonicalizeM6PolicyEventRuntimeStateV0({
    schemaVersion: 1,
    definitions: input.definitions,
    activeEvents: input.activeEvents ?? [],
    resolvedEvents: input.resolvedEvents ?? [],
    policyModifiers: input.policyModifiers ?? [],
    nextEventInstanceId: input.nextEventInstanceId ?? 1,
    nextModifierId: input.nextModifierId ?? 1
  });
}

export function canonicalizeM6PolicyEventRuntimeStateV0(
  runtime: M6PolicyEventRuntimeStateV0
): M6PolicyEventRuntimeStateV0 {
  return {
    schemaVersion: 1,
    definitions: {
      policies: sortM6PolicyDefinitions(runtime.definitions.policies).map((policy) => ({
        policyId: parseM6PolicyDefinitionId(policy.policyId),
        sourceId: parseDisplayNameKey(policy.sourceId, "M6 policy sourceId"),
        displayNameKey: parseDisplayNameKey(policy.displayNameKey, "M6 policy displayNameKey"),
        reasonCodes: sortText(policy.reasonCodes).map((code) =>
          parseDisplayNameKey(code, "M6 policy reasonCode")
        ),
        encyclopediaRefs: sortText(policy.encyclopediaRefs).map((ref) =>
          parseDisplayNameKey(ref, "M6 policy encyclopediaRef")
        )
      })),
      events: sortM6PolicyEventDefinitions(runtime.definitions.events).map((event) => ({
        eventDefinitionId: parseM6PolicyEventDefinitionId(event.eventDefinitionId),
        sourceId: parseDisplayNameKey(event.sourceId, "M6 event sourceId"),
        displayNameKey: parseDisplayNameKey(event.displayNameKey, "M6 event displayNameKey"),
        cause: {
          kind: "day-at-least",
          day: parseGameDay(event.cause.day),
          reasonCodes: sortText(event.cause.reasonCodes).map((code) =>
            parseDisplayNameKey(code, "M6 event cause reasonCode")
          )
        },
        options: sortM6PolicyEventOptions(event.options).map((option) => ({
          optionId: parsePositiveInteger(option.optionId, "M6 optionId"),
          displayNameKey: parseDisplayNameKey(option.displayNameKey, "M6 option displayNameKey"),
          consequences: option.consequences.map((consequence) => ({
            kind: "policy-modifier",
            policyId: parseM6PolicyDefinitionId(consequence.policyId),
            magnitudeBps: parseSignedBps(consequence.magnitudeBps, "M6 consequence magnitudeBps"),
            durationDays: parsePositiveInteger(
              consequence.durationDays,
              "M6 consequence durationDays"
            ),
            reasonCode: parseDisplayNameKey(consequence.reasonCode, "M6 consequence reasonCode")
          })),
          reasonCodes: sortText(option.reasonCodes).map((code) =>
            parseDisplayNameKey(code, "M6 option reasonCode")
          ),
          encyclopediaRefs: sortText(option.encyclopediaRefs).map((ref) =>
            parseDisplayNameKey(ref, "M6 option encyclopediaRef")
          )
        })),
        reasonCodes: sortText(event.reasonCodes).map((code) =>
          parseDisplayNameKey(code, "M6 event reasonCode")
        ),
        encyclopediaRefs: sortText(event.encyclopediaRefs).map((ref) =>
          parseDisplayNameKey(ref, "M6 event encyclopediaRef")
        )
      }))
    },
    activeEvents: sortM6PolicyEventActive(runtime.activeEvents).map((event) => ({
      eventInstanceId: parseM6PolicyEventInstanceId(event.eventInstanceId),
      eventDefinitionId: parseM6PolicyEventDefinitionId(event.eventDefinitionId),
      activatedDay: parseGameDay(event.activatedDay),
      causeReasonCodes: sortText(event.causeReasonCodes).map((code) =>
        parseDisplayNameKey(code, "M6 active event reasonCode")
      )
    })),
    resolvedEvents: sortM6PolicyEventResolved(runtime.resolvedEvents).map((event) => ({
      eventInstanceId: parseM6PolicyEventInstanceId(event.eventInstanceId),
      eventDefinitionId: parseM6PolicyEventDefinitionId(event.eventDefinitionId),
      selectedOptionId: parsePositiveInteger(event.selectedOptionId, "M6 selectedOptionId"),
      resolvedDay: parseGameDay(event.resolvedDay),
      reasonCodes: sortText(event.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M6 resolved event reasonCode")
      )
    })),
    policyModifiers: sortM6PolicyModifiers(runtime.policyModifiers).map((modifier) => ({
      modifierId: parseM6PolicyModifierId(modifier.modifierId),
      policyId: parseM6PolicyDefinitionId(modifier.policyId),
      eventInstanceId: parseM6PolicyEventInstanceId(modifier.eventInstanceId),
      magnitudeBps: parseSignedBps(modifier.magnitudeBps, "M6 policy modifier magnitudeBps"),
      startDay: parseGameDay(modifier.startDay),
      endDay: parseGameDay(modifier.endDay),
      reasonCode: parseDisplayNameKey(modifier.reasonCode, "M6 policy modifier reasonCode")
    })),
    nextEventInstanceId: parsePositiveInteger(
      runtime.nextEventInstanceId,
      "M6 nextEventInstanceId"
    ),
    nextModifierId: parsePositiveInteger(runtime.nextModifierId, "M6 nextModifierId")
  };
}

export function createM6AlphaRuntimeStateV0(
  input?: Partial<M6AlphaRuntimeStateV0>
): M6AlphaRuntimeStateV0 {
  return canonicalizeM6AlphaRuntimeStateV0({
    schemaVersion: 1,
    terminalStates: input?.terminalStates ?? []
  });
}

export function canonicalizeM6AlphaRuntimeStateV0(
  runtime: M6AlphaRuntimeStateV0
): M6AlphaRuntimeStateV0 {
  return {
    schemaVersion: 1,
    terminalStates: sortM6AlphaTerminalStates(runtime.terminalStates).map((terminal) => ({
      terminalStateId: parseM6AlphaTerminalStateId(terminal.terminalStateId),
      polityId: parsePolityId(terminal.polityId),
      outcome: parseM6AlphaTerminalOutcome(terminal.outcome),
      evaluatedDay: parseGameDay(terminal.evaluatedDay),
      evaluatedRevision: parseWorldRevision(terminal.evaluatedRevision),
      maxDay: parseGameDay(terminal.maxDay),
      evidence: {
        recognizedByCount: parseNonnegativeInteger(
          terminal.evidence.recognizedByCount,
          "M6 Alpha recognizedByCount"
        ),
        legitimacyScoreBps: parseBps(
          terminal.evidence.legitimacyScoreBps,
          "M6 Alpha legitimacyScoreBps"
        ),
        postwarArrangementCount: parseNonnegativeInteger(
          terminal.evidence.postwarArrangementCount,
          "M6 Alpha postwarArrangementCount"
        ),
        resolvedPolicyEventCount: parseNonnegativeInteger(
          terminal.evidence.resolvedPolicyEventCount,
          "M6 Alpha resolvedPolicyEventCount"
        ),
        successionResolvedCount: parseNonnegativeInteger(
          terminal.evidence.successionResolvedCount,
          "M6 Alpha successionResolvedCount"
        ),
        routeCount: parseNonnegativeInteger(terminal.evidence.routeCount, "M6 Alpha routeCount"),
        populationGroupCount: parseNonnegativeInteger(
          terminal.evidence.populationGroupCount,
          "M6 Alpha populationGroupCount"
        )
      },
      reasonCodes: sortText(terminal.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M6 Alpha terminal reasonCode")
      )
    }))
  };
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
    })),
    fieldEngagements: sortM4FieldEngagements(m4.fieldEngagements ?? []).map((engagement) => ({
      engagementId: parseFieldEngagementId(engagement.engagementId),
      campaignPlanId: parseCampaignPlanId(engagement.campaignPlanId),
      marchId: parseCampaignMarchId(engagement.marchId),
      attackerPolityId: parsePolityId(engagement.attackerPolityId),
      defenderPolityId: parsePolityId(engagement.defenderPolityId),
      target: copyM4CampaignTarget(engagement.target),
      attackerTroopsBefore: parseNonnegativeInteger(
        engagement.attackerTroopsBefore,
        "M4 engagement attackerTroopsBefore"
      ),
      attackerTroopsAfter: parseNonnegativeInteger(
        engagement.attackerTroopsAfter,
        "M4 engagement attackerTroopsAfter"
      ),
      defenderEstimatedTroopsBefore: parseNonnegativeInteger(
        engagement.defenderEstimatedTroopsBefore,
        "M4 engagement defenderEstimatedTroopsBefore"
      ),
      defenderEstimatedTroopsAfter: parseNonnegativeInteger(
        engagement.defenderEstimatedTroopsAfter,
        "M4 engagement defenderEstimatedTroopsAfter"
      ),
      attackerCasualties: parseNonnegativeInteger(
        engagement.attackerCasualties,
        "M4 engagement attackerCasualties"
      ),
      defenderCasualties: parseNonnegativeInteger(
        engagement.defenderCasualties,
        "M4 engagement defenderCasualties"
      ),
      supplyLoss: parseNonnegativeInteger(engagement.supplyLoss, "M4 engagement supplyLoss"),
      defenderFortification: parseNonnegativeInteger(
        engagement.defenderFortification,
        "M4 engagement defenderFortification"
      ),
      outcome: parseM4FieldEngagementOutcome(engagement.outcome),
      reasonCodes: sortText(engagement.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 engagement reasonCode")
      ),
      creditHooks: sortM4CampaignHooks(engagement.creditHooks).map(copyM4CampaignHook),
      reputationHooks: sortM4CampaignHooks(engagement.reputationHooks).map(copyM4CampaignHook),
      resolvedDay: parseGameDay(engagement.resolvedDay)
    })),
    sieges: sortM4Sieges(m4.sieges ?? []).map((siege) => ({
      siegeId: parseSiegeId(siege.siegeId),
      campaignPlanId: parseCampaignPlanId(siege.campaignPlanId),
      marchId: parseCampaignMarchId(siege.marchId),
      targetDistrictId: parseDistrictId(siege.targetDistrictId),
      attackerPolityId: parsePolityId(siege.attackerPolityId),
      defenderPolityId: parsePolityId(siege.defenderPolityId),
      status: parseM4SiegeStatus(siege.status),
      statusReasonCode: parseDisplayNameKey(siege.statusReasonCode, "M4 siege statusReasonCode"),
      fortification: parseNonnegativeInteger(siege.fortification, "M4 siege fortification"),
      defenderEstimatedTroops: parseNonnegativeInteger(
        siege.defenderEstimatedTroops,
        "M4 siege defenderEstimatedTroops"
      ),
      defenderSupply: parseNonnegativeInteger(siege.defenderSupply, "M4 siege defenderSupply"),
      siegeProgress: parseNonnegativeInteger(siege.siegeProgress, "M4 siegeProgress"),
      daysInvested: parseNonnegativeInteger(siege.daysInvested, "M4 siege daysInvested"),
      blockadeDays: parseNonnegativeInteger(siege.blockadeDays, "M4 siege blockadeDays"),
      assaultCount: parseNonnegativeInteger(siege.assaultCount, "M4 siege assaultCount"),
      attackerTroops: parseNonnegativeInteger(siege.attackerTroops, "M4 siege attackerTroops"),
      attackerCasualties: parseNonnegativeInteger(
        siege.attackerCasualties,
        "M4 siege attackerCasualties"
      ),
      defenderCasualties: parseNonnegativeInteger(
        siege.defenderCasualties,
        "M4 siege defenderCasualties"
      ),
      supplyLoss: parseNonnegativeInteger(siege.supplyLoss, "M4 siege supplyLoss"),
      surrenderEligible: parseBoolean(siege.surrenderEligible, "M4 siege surrenderEligible"),
      surrenderReasonCodes: sortText(siege.surrenderReasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 siege surrenderReasonCode")
      ),
      reasonCodes: sortText(siege.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 siege reasonCode")
      ),
      creditHooks: sortM4CampaignHooks(siege.creditHooks).map(copyM4CampaignHook),
      reputationHooks: sortM4CampaignHooks(siege.reputationHooks).map(copyM4CampaignHook),
      startedDay: parseGameDay(siege.startedDay),
      updatedDay: parseGameDay(siege.updatedDay)
    })),
    withdrawals: sortM4Withdrawals(m4.withdrawals ?? []).map((withdrawal) => ({
      withdrawalId: parsePositiveInteger(withdrawal.withdrawalId, "M4 withdrawalId"),
      campaignPlanId: parseCampaignPlanId(withdrawal.campaignPlanId),
      marchId: withdrawal.marchId === null ? null : parseCampaignMarchId(withdrawal.marchId),
      siegeId: withdrawal.siegeId === null ? null : parseSiegeId(withdrawal.siegeId),
      kind: parseM4WithdrawalKind(withdrawal.kind),
      triggerReason: parseM4WithdrawalTrigger(withdrawal.triggerReason),
      troopsBefore: parseNonnegativeInteger(withdrawal.troopsBefore, "M4 withdrawal troopsBefore"),
      troopsExtracted: parseNonnegativeInteger(
        withdrawal.troopsExtracted,
        "M4 withdrawal troopsExtracted"
      ),
      casualties: parseNonnegativeInteger(withdrawal.casualties, "M4 withdrawal casualties"),
      supplyLoss: parseNonnegativeInteger(withdrawal.supplyLoss, "M4 withdrawal supplyLoss"),
      creditHooks: sortM4CampaignHooks(withdrawal.creditHooks).map(copyM4CampaignHook),
      reputationHooks: sortM4CampaignHooks(withdrawal.reputationHooks).map(copyM4CampaignHook),
      reasonCodes: sortText(withdrawal.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 withdrawal reasonCode")
      ),
      resolvedDay: parseGameDay(withdrawal.resolvedDay)
    })),
    warOutcomes: sortM4WarOutcomes(m4.warOutcomes ?? []).map((outcome) => ({
      outcomeId: parsePositiveInteger(outcome.outcomeId, "M4 war outcomeId"),
      campaignPlanId: parseCampaignPlanId(outcome.campaignPlanId),
      victorPolityId: parsePolityId(outcome.victorPolityId),
      localPolityId: parsePolityId(outcome.localPolityId),
      targetDistrictId: parseDistrictId(outcome.targetDistrictId),
      attackerCasualties: parseNonnegativeInteger(
        outcome.attackerCasualties,
        "M4 war outcome attackerCasualties"
      ),
      defenderCasualties: parseNonnegativeInteger(
        outcome.defenderCasualties,
        "M4 war outcome defenderCasualties"
      ),
      supplyLoss: parseNonnegativeInteger(outcome.supplyLoss, "M4 war outcome supplyLoss"),
      withdrawalId:
        outcome.withdrawalId === null
          ? null
          : parsePositiveInteger(outcome.withdrawalId, "M4 war outcome withdrawalId"),
      siegeId: outcome.siegeId === null ? null : parseSiegeId(outcome.siegeId),
      postwarCandidate:
        outcome.postwarCandidate === null
          ? null
          : canonicalizeM4PostwarCandidate(outcome.postwarCandidate),
      reasonCodes: sortText(outcome.reasonCodes).map((code) =>
        parseDisplayNameKey(code, "M4 war outcome reasonCode")
      ),
      resolvedDay: parseGameDay(outcome.resolvedDay)
    })),
    postwarCandidates: sortM4PostwarCandidates(m4.postwarCandidates ?? []).map(
      canonicalizeM4PostwarCandidate
    )
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

function parseNonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function parseMapTopologyPoint(value: unknown, label: string): MapTopologyPointV1 {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return {
    x: parseIntegerInRange(
      value["x"],
      `${label}.x`,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    ),
    y: parseIntegerInRange(
      value["y"],
      `${label}.y`,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER
    )
  };
}

function parseMapTopologyDistrictMetadata(value: unknown): MapTopologyDistrictMetadataV1 {
  if (!isRecord(value)) {
    throw new Error("MapTopology district metadata must be an object.");
  }

  return {
    historicity: parseMapTopologyHistoricityTag(value["historicity"]),
    terrainClass: parseMapTopologyTerrainClass(value["terrainClass"]),
    riskClass: parseMapTopologyRiskClass(value["riskClass"])
  };
}

function parseMapTopologyRouteEdgeMetadata(value: unknown): MapTopologyRouteEdgeMetadataV1 {
  if (!isRecord(value)) {
    throw new Error("MapTopology route edge metadata must be an object.");
  }

  return {
    historicity: parseMapTopologyHistoricityTag(value["historicity"]),
    terrainClass: parseMapTopologyTerrainClass(value["terrainClass"]),
    riskClass: parseMapTopologyRiskClass(value["riskClass"])
  };
}

function parseMapTopologyNodeId(value: unknown, label: string): string {
  return parseNonEmptyString(value, label);
}

function parseMapTopologyRouteNodeKind(value: unknown): MapTopologyRouteNodeKindV1 {
  if (value === "pass" || value === "port" || value === "special" || value === "warehouse") {
    return value;
  }

  throw new Error("MapTopology route node kind is invalid.");
}

function parseMapTopologyRouteMode(value: unknown): MapTopologyRouteModeV1 {
  if (value === "coast" || value === "river" || value === "road") {
    return value;
  }

  throw new Error("MapTopology route mode must be coast, river, or road.");
}

function parseMapTopologyTerrainClass(value: unknown): MapTopologyTerrainClassV1 {
  if (
    value === "coastal" ||
    value === "lowland" ||
    value === "pass" ||
    value === "riverine" ||
    value === "upland" ||
    value === "urban" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("MapTopology terrainClass is invalid.");
}

function parseMapTopologyRiskClass(value: unknown): MapTopologyRiskClassV1 {
  if (
    value === "contested" ||
    value === "hazardous" ||
    value === "low" ||
    value === "seasonal" ||
    value === "unknown"
  ) {
    return value;
  }

  throw new Error("MapTopology riskClass is invalid.");
}

function parseMapTopologyHistoricityTag(value: unknown): MapTopologyHistoricityTagV1 {
  if (
    value === "COMPOSITE" ||
    value === "FICTIONAL" ||
    value === "HISTORICAL" ||
    value === "INFERRED"
  ) {
    return value;
  }

  throw new Error("MapTopology historicity tag is invalid.");
}

function parseMapTopologyRouteEndpoint(value: unknown): MapTopologyRouteEndpointV1 {
  if (!isRecord(value)) {
    throw new Error("MapTopology route endpoint must be an object.");
  }

  const kind = value["kind"];
  if (kind === "district") {
    return {
      kind,
      districtId: parseDistrictId(value["districtId"])
    };
  }
  if (kind === "route-node") {
    return {
      kind,
      nodeId: parseMapTopologyNodeId(value["nodeId"], "MapTopology route endpoint nodeId")
    };
  }
  if (kind === "settlement") {
    return {
      kind,
      settlementId: parseSettlementId(value["settlementId"])
    };
  }

  throw new Error("MapTopology route endpoint kind is invalid.");
}

function parseMapTopologySeasonalModifier(value: unknown): MapTopologySeasonalModifierV1 {
  if (!isRecord(value)) {
    throw new Error("MapTopology seasonal modifier must be an object.");
  }

  const reasonCodes = value["reasonCodes"];
  if (!Array.isArray(reasonCodes)) {
    throw new Error("MapTopology seasonal modifier reasonCodes must be an array.");
  }

  return {
    month: parseIntegerInRange(value["month"], "MapTopology seasonal modifier month", 1, 12),
    costMultiplierBps: parseIntegerInRange(
      value["costMultiplierBps"],
      "MapTopology seasonal modifier costMultiplierBps",
      1,
      30_000
    ),
    capacityMultiplierBps: parseIntegerInRange(
      value["capacityMultiplierBps"],
      "MapTopology seasonal modifier capacityMultiplierBps",
      0,
      30_000
    ),
    reasonCodes: reasonCodes.map((reasonCode) =>
      parseNonEmptyString(reasonCode, "MapTopology seasonal modifier reasonCode")
    )
  };
}

function parseMapTopologyRouteAvailability(value: unknown): MapTopologyRouteAvailabilityV1 {
  if (!isRecord(value)) {
    throw new Error("MapTopology route availability must be an object.");
  }

  if (value["kind"] === "open") {
    return { kind: "open" };
  }
  if (value["kind"] === "blocked") {
    return {
      kind: "blocked",
      reasonCode: parseNonEmptyString(value["reasonCode"], "MapTopology blocked route reasonCode")
    };
  }
  if (value["kind"] === "unknown") {
    return {
      kind: "unknown",
      reasonCode: parseNonEmptyString(value["reasonCode"], "MapTopology unknown route reasonCode")
    };
  }

  throw new Error("MapTopology route availability kind is invalid.");
}

function parseTerrainPatchId(value: unknown): TerrainPatchId {
  return parseStrategicTerrainId(value, "TerrainPatchId") as TerrainPatchId;
}

function parseBarrierChannelId(value: unknown): BarrierChannelId {
  return parseStrategicTerrainId(value, "BarrierChannelId") as BarrierChannelId;
}

function parseStrategicNodeId(value: unknown): StrategicNodeId {
  return parseStrategicTerrainId(value, "StrategicNodeId") as StrategicNodeId;
}

function parseRouteCorridorId(value: unknown): RouteCorridorId {
  return parseStrategicTerrainId(value, "RouteCorridorId") as RouteCorridorId;
}

function parseDistrictGovernanceFootprintId(value: unknown): DistrictGovernanceFootprintId {
  return parseStrategicTerrainId(
    value,
    "DistrictGovernanceFootprintId"
  ) as DistrictGovernanceFootprintId;
}

function parseStrategicTerrainId(value: unknown, label: string): string {
  if (typeof value !== "string" || !/^[A-Za-z][A-Za-z0-9._:-]{0,95}$/u.test(value)) {
    throw new Error(`${label} must be a stable non-empty string id.`);
  }
  if (/^(?:\d+|row[-.:]?\d+|col[-.:]?\d+|hex[-.:]?\d+|cell[-.:]?\d+)$/iu.test(value)) {
    throw new Error(`${label} must not be a hidden grid, lattice, hex, or sequential id.`);
  }

  return value;
}

function parseStrategicTerrainClass(value: unknown): StrategicTerrainClassV1 {
  if (STRATEGIC_TERRAIN_CLASSES.includes(value as StrategicTerrainClassV1)) {
    return value as StrategicTerrainClassV1;
  }
  throw new Error("Strategic terrain terrainClass is invalid.");
}

function parseStrategicTerrainRiskClass(value: unknown): StrategicTerrainRiskClassV1 {
  if (STRATEGIC_TERRAIN_RISK_CLASSES.includes(value as StrategicTerrainRiskClassV1)) {
    return value as StrategicTerrainRiskClassV1;
  }
  throw new Error("Strategic terrain riskClass is invalid.");
}

function parseStrategicTerrainHistoricityTag(value: unknown): StrategicTerrainHistoricityTagV1 {
  if (STRATEGIC_TERRAIN_HISTORICITY_TAGS.includes(value as StrategicTerrainHistoricityTagV1)) {
    return value as StrategicTerrainHistoricityTagV1;
  }
  throw new Error("Strategic terrain historicity tag is invalid.");
}

function parseStrategicTerrainSeasonState(value: unknown): StrategicTerrainSeasonStateV1 {
  if (STRATEGIC_TERRAIN_SEASON_STATES.includes(value as StrategicTerrainSeasonStateV1)) {
    return value as StrategicTerrainSeasonStateV1;
  }
  throw new Error("Strategic terrain season state is invalid.");
}

function parseBarrierChannelKind(value: unknown): BarrierChannelKindV1 {
  if (BARRIER_CHANNEL_KINDS.includes(value as BarrierChannelKindV1)) {
    return value as BarrierChannelKindV1;
  }
  throw new Error("BarrierChannel channelKind is invalid.");
}

function parseBarrierChannelTraversalRule(
  value: unknown
): BarrierChannelDefinitionV1["traversalRule"] {
  if (value === "blocks-without-explicit-corridor" || value === "channels-explicit-corridors") {
    return value;
  }
  throw new Error("BarrierChannel traversalRule is invalid.");
}

function parseStrategicNodeKind(value: unknown): StrategicNodeKindV1 {
  if (STRATEGIC_NODE_KINDS.includes(value as StrategicNodeKindV1)) {
    return value as StrategicNodeKindV1;
  }
  throw new Error("StrategicNode nodeKind is invalid.");
}

function parseStrategicNodeKnownState(value: unknown): StrategicNodeKnownStateV1 {
  if (STRATEGIC_NODE_KNOWN_STATES.includes(value as StrategicNodeKnownStateV1)) {
    return value as StrategicNodeKnownStateV1;
  }
  throw new Error("StrategicNode knownState is invalid.");
}

function parseRouteCorridorMode(value: unknown): RouteCorridorModeV1 {
  if (ROUTE_CORRIDOR_MODES.includes(value as RouteCorridorModeV1)) {
    return value as RouteCorridorModeV1;
  }
  throw new Error("RouteCorridor mode is invalid.");
}

function parseRouteCorridorWidthClass(value: unknown): RouteCorridorWidthClassV1 {
  if (ROUTE_CORRIDOR_WIDTH_CLASSES.includes(value as RouteCorridorWidthClassV1)) {
    return value as RouteCorridorWidthClassV1;
  }
  throw new Error("RouteCorridor widthClass is invalid.");
}

function parseRouteCorridorSeasonalModifier(value: unknown): RouteCorridorSeasonalModifierV1 {
  if (!isRecord(value)) {
    throw new Error("RouteCorridor seasonal modifier must be an object.");
  }
  if (!Array.isArray(value["reasonCodes"])) {
    throw new Error("RouteCorridor seasonal modifier reasonCodes must be an array.");
  }

  return {
    month: parseIntegerInRange(value["month"], "RouteCorridor seasonal modifier month", 1, 12),
    seasonState: parseStrategicTerrainSeasonState(value["seasonState"]),
    travelCostMultiplierBps: parseIntegerInRange(
      value["travelCostMultiplierBps"],
      "RouteCorridor seasonal modifier travelCostMultiplierBps",
      1,
      30_000
    ),
    capacityMultiplierBps: parseIntegerInRange(
      value["capacityMultiplierBps"],
      "RouteCorridor seasonal modifier capacityMultiplierBps",
      0,
      30_000
    ),
    riskBps: parseIntegerInRange(
      value["riskBps"],
      "RouteCorridor seasonal modifier riskBps",
      0,
      10_000
    ),
    reasonCodes: value["reasonCodes"].map((reasonCode) =>
      parseNonEmptyString(reasonCode, "RouteCorridor seasonal modifier reasonCode")
    )
  };
}

function parseRouteCorridorAvailability(value: unknown): RouteCorridorAvailabilityV1 {
  if (!isRecord(value)) {
    throw new Error("RouteCorridor availability must be an object.");
  }
  if (value["kind"] === "open") {
    return { kind: "open" };
  }
  if (value["kind"] === "blocked") {
    return {
      kind: "blocked",
      reasonCode: parseNonEmptyString(value["reasonCode"], "RouteCorridor blocked reasonCode")
    };
  }
  if (value["kind"] === "unknown") {
    return {
      kind: "unknown",
      reasonCode: parseNonEmptyString(value["reasonCode"], "RouteCorridor unknown reasonCode")
    };
  }

  throw new Error("RouteCorridor availability kind is invalid.");
}

function parseStrategicTerrainPoint(value: unknown, label: string): StrategicTerrainPointV1 {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return {
    x: parseIntegerInRange(value["x"], `${label}.x`, -1_000_000, 1_000_000),
    y: parseIntegerInRange(value["y"], `${label}.y`, -1_000_000, 1_000_000)
  };
}

function parseStrategicTerrainTextArray(
  values: readonly unknown[],
  label: string
): readonly string[] {
  return values.map((value) => parseNonEmptyString(value, label));
}

function parseGovernanceOverlayOnly(value: unknown): true {
  if (value !== true) {
    throw new Error("DistrictGovernanceFootprint overlayOnly must be true.");
  }
  return true;
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
    case "abdication":
      return {
        kind: "abdication",
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

export function copyM4CampaignHook(hook: M4CampaignHookStateV0): M4CampaignHookStateV0 {
  return {
    polityId: parsePolityId(hook.polityId),
    amount: parseNonnegativeInteger(hook.amount, "M4 campaign hook amount"),
    reasonCode: parseDisplayNameKey(hook.reasonCode, "M4 campaign hook reasonCode")
  };
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

export function parseM4FieldEngagementOutcome(value: unknown): M4FieldEngagementOutcomeV0 {
  if (value === "attacker-victory" || value === "defender-holds") {
    return value;
  }

  throw new Error("M4 field engagement outcome is invalid.");
}

export function parseM4SiegeChoice(value: unknown): M4SiegeChoiceV0 {
  if (
    value === "invest-blockade" ||
    value === "assault" ||
    value === "continue" ||
    value === "accept-surrender" ||
    value === "lift-siege" ||
    value === "withdraw"
  ) {
    return value;
  }

  throw new Error("M4 siege choice is invalid.");
}

export function parseM4SiegeStatus(value: unknown): M4SiegeStatusV0 {
  if (
    value === "blockading" ||
    value === "surrender-ready" ||
    value === "surrendered" ||
    value === "lifted" ||
    value === "withdrawn"
  ) {
    return value;
  }

  throw new Error("M4 siege status is invalid.");
}

export function parseM4WithdrawalKind(value: unknown): M4WithdrawalKindV0 {
  if (
    value === "orderly-withdrawal" ||
    value === "forced-retreat" ||
    value === "cancelled-before-departure" ||
    value === "failed-extraction"
  ) {
    return value;
  }
  throw new Error("M4 withdrawal kind is invalid.");
}

export function parseM4WithdrawalTrigger(value: unknown): M4WithdrawalTriggerV0 {
  if (
    value === "ordered" ||
    value === "supply" ||
    value === "season" ||
    value === "siege" ||
    value === "loss" ||
    value === "objective-complete"
  ) {
    return value;
  }
  throw new Error("M4 withdrawal trigger is invalid.");
}

function parseM4PostwarMethod(
  value: unknown
): "direct-control" | "restore-vassal-ruler" | "tribute-only" {
  if (value === "direct-control" || value === "restore-vassal-ruler" || value === "tribute-only") {
    return value;
  }
  throw new Error("M4 postwar method is invalid.");
}

function parseM6DiplomaticAgreementKind(value: unknown): M6DiplomaticAgreementKindV0 {
  if (
    value === "non-aggression" ||
    value === "military-access" ||
    value === "tribute-recognition"
  ) {
    return value;
  }
  throw new Error("M6 diplomatic agreement kind is invalid.");
}

function parseM6DiplomaticAgreementStatus(value: unknown): M6DiplomaticAgreementStatusV0 {
  if (value === "proposed" || value === "active" || value === "rejected") {
    return value;
  }
  throw new Error("M6 diplomatic agreement status is invalid.");
}

function parseM6DiplomaticRecognitionDirection(value: unknown): M6DiplomaticRecognitionDirectionV0 {
  if (
    value === "none" ||
    value === "proposer-recognizes-target" ||
    value === "target-recognizes-proposer"
  ) {
    return value;
  }
  throw new Error("M6 diplomatic recognition direction is invalid.");
}

function parseM6LegitimacyAudience(value: unknown): M6LegitimacyAudienceV0 {
  if (
    value === "court" ||
    value === "local-lords" ||
    value === "military-retinue" ||
    value === "merchants" ||
    value === "ritual-network" ||
    value === "vassal-rulers" ||
    value === "foreign-courts"
  ) {
    return value;
  }
  throw new Error("M6 legitimacy audience is invalid.");
}

function parseM6LegitimacySourceKind(value: unknown): M6LegitimacySourceKindV0 {
  if (
    value === "diplomatic-recognition" ||
    value === "obligation-fulfilled" ||
    value === "obligation-breached" ||
    value === "succession-continuity" ||
    value === "postwar-settlement" ||
    value === "campaign-consequence"
  ) {
    return value;
  }
  throw new Error("M6 legitimacy source kind is invalid.");
}

export function parseM6AlphaTerminalOutcome(value: unknown): M6AlphaTerminalOutcomeV0 {
  if (value === "victory" || value === "defeat" || value === "continued-play") {
    return value;
  }
  throw new Error("M6 Alpha terminal outcome is invalid.");
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

function sortMapTopologyDistrictDefinitions(
  values: readonly MapTopologyDistrictDefinitionV1[]
): readonly MapTopologyDistrictDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      left.districtId - right.districtId ||
      compareText(left.sourceId, right.sourceId) ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortMapTopologyRouteNodeDefinitions(
  values: readonly MapTopologyRouteNodeDefinitionV1[]
): readonly MapTopologyRouteNodeDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      compareText(left.nodeId, right.nodeId) ||
      left.districtId - right.districtId ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortMapTopologyRouteEdgeDefinitions(
  values: readonly MapTopologyRouteEdgeDefinitionV1[]
): readonly MapTopologyRouteEdgeDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      left.routeId - right.routeId ||
      compareText(left.sourceId, right.sourceId) ||
      compareText(formatMapTopologyEndpoint(left.from), formatMapTopologyEndpoint(right.from)) ||
      compareText(formatMapTopologyEndpoint(left.to), formatMapTopologyEndpoint(right.to))
  );
}

function sortMapTopologySeasonalModifiers(
  values: readonly MapTopologySeasonalModifierV1[]
): readonly MapTopologySeasonalModifierV1[] {
  return [...values].sort((left, right) => left.month - right.month);
}

function copyMapTopologyPoint(point: MapTopologyPointV1): MapTopologyPointV1 {
  return {
    x: point.x,
    y: point.y
  };
}

function copyMapTopologyRouteEndpoint(
  endpoint: MapTopologyRouteEndpointV1
): MapTopologyRouteEndpointV1 {
  switch (endpoint.kind) {
    case "district":
      return {
        kind: "district",
        districtId: endpoint.districtId
      };
    case "route-node":
      return {
        kind: "route-node",
        nodeId: endpoint.nodeId
      };
    case "settlement":
      return {
        kind: "settlement",
        settlementId: endpoint.settlementId
      };
  }
}

function copyMapTopologyRouteAvailability(
  availability: MapTopologyRouteAvailabilityV1
): MapTopologyRouteAvailabilityV1 {
  switch (availability.kind) {
    case "open":
      return { kind: "open" };
    case "blocked":
      return {
        kind: "blocked",
        reasonCode: availability.reasonCode
      };
    case "unknown":
      return {
        kind: "unknown",
        reasonCode: availability.reasonCode
      };
  }
}

function sortStrategicTerrainAuthorityProhibitions(
  values: readonly StrategicTerrainAuthorityProhibitionV1[]
): readonly StrategicTerrainAuthorityProhibitionV1[] {
  return [...values].sort(compareText);
}

function sortTerrainPatches(
  values: readonly TerrainPatchDefinitionV1[]
): readonly TerrainPatchDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      compareText(left.patchId, right.patchId) ||
      compareText(left.sourceId, right.sourceId) ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortBarrierChannels(
  values: readonly BarrierChannelDefinitionV1[]
): readonly BarrierChannelDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      compareText(left.channelId, right.channelId) ||
      compareText(left.sourceId, right.sourceId) ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortStrategicNodes(
  values: readonly StrategicNodeDefinitionV1[]
): readonly StrategicNodeDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      compareText(left.nodeId, right.nodeId) ||
      left.districtId - right.districtId ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortRouteCorridors(
  values: readonly RouteCorridorDefinitionV1[]
): readonly RouteCorridorDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      compareText(left.corridorId, right.corridorId) ||
      compareText(left.fromNodeId, right.fromNodeId) ||
      compareText(left.toNodeId, right.toNodeId) ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortDistrictGovernanceFootprints(
  values: readonly DistrictGovernanceFootprintDefinitionV1[]
): readonly DistrictGovernanceFootprintDefinitionV1[] {
  return [...values].sort(
    (left, right) =>
      compareText(left.footprintId, right.footprintId) ||
      left.districtId - right.districtId ||
      compareText(left.displayNameKey, right.displayNameKey)
  );
}

function sortRouteCorridorSeasonalModifiers(
  values: readonly RouteCorridorSeasonalModifierV1[]
): readonly RouteCorridorSeasonalModifierV1[] {
  return [...values].sort((left, right) => left.month - right.month);
}

function copyStrategicTerrainPoint(point: StrategicTerrainPointV1): StrategicTerrainPointV1 {
  return {
    x: point.x,
    y: point.y
  };
}

function copyRouteCorridorAvailability(
  availability: RouteCorridorAvailabilityV1
): RouteCorridorAvailabilityV1 {
  switch (availability.kind) {
    case "open":
      return { kind: "open" };
    case "blocked":
      return {
        kind: "blocked",
        reasonCode: availability.reasonCode
      };
    case "unknown":
      return {
        kind: "unknown",
        reasonCode: availability.reasonCode
      };
  }
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

function sortM4FieldEngagements(
  values: readonly M4FieldEngagementStateV0[]
): readonly M4FieldEngagementStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.resolvedDay - right.resolvedDay ||
      left.engagementId - right.engagementId
  );
}

function sortM4Sieges(values: readonly M4SiegeStateV0[]): readonly M4SiegeStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.startedDay - right.startedDay ||
      left.siegeId - right.siegeId
  );
}

function sortM4Withdrawals(values: readonly M4WithdrawalStateV0[]): readonly M4WithdrawalStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.resolvedDay - right.resolvedDay ||
      left.withdrawalId - right.withdrawalId
  );
}

function sortM4WarOutcomes(values: readonly M4WarOutcomeStateV0[]): readonly M4WarOutcomeStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.campaignPlanId - right.campaignPlanId ||
      left.resolvedDay - right.resolvedDay ||
      left.outcomeId - right.outcomeId
  );
}

function sortM4PostwarCandidates(
  values: readonly M4PostwarCandidateStateV0[]
): readonly M4PostwarCandidateStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.sourceWarOutcomeId - right.sourceWarOutcomeId ||
      compareText(left.candidateId, right.candidateId)
  );
}

function sortM6Relations(
  values: readonly M6DiplomaticRelationStateV0[]
): readonly M6DiplomaticRelationStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.polityAId - right.polityAId ||
      left.polityBId - right.polityBId ||
      left.relationId - right.relationId
  );
}

function sortM6Agreements(
  values: readonly M6DiplomaticAgreementStateV0[]
): readonly M6DiplomaticAgreementStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.relationId - right.relationId ||
      left.startDay - right.startDay ||
      left.agreementId - right.agreementId
  );
}

function sortM6RecognitionEdges(
  values: readonly M6RecognitionEdgeStateV0[]
): readonly M6RecognitionEdgeStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.fromPolityId - right.fromPolityId ||
      left.toPolityId - right.toPolityId ||
      left.agreementId - right.agreementId
  );
}

function sortM6LegitimacySources(
  values: readonly M6LegitimacySourceStateV0[]
): readonly M6LegitimacySourceStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.polityId - right.polityId ||
      compareText(left.audience, right.audience) ||
      left.createdDay - right.createdDay ||
      left.sourceId - right.sourceId
  );
}

function sortM6LegitimacyProfiles(
  values: readonly M6LegitimacyProfileStateV0[]
): readonly M6LegitimacyProfileStateV0[] {
  return [...values].sort(
    (left, right) => left.polityId - right.polityId || compareText(left.audience, right.audience)
  );
}

function sortM6PolicyDefinitions(
  values: readonly M6PolicyDefinitionStateV0[]
): readonly M6PolicyDefinitionStateV0[] {
  return [...values].sort((left, right) => left.policyId - right.policyId);
}

function sortM6PolicyEventDefinitions(
  values: readonly M6PolicyEventDefinitionStateV0[]
): readonly M6PolicyEventDefinitionStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.cause.day - right.cause.day || left.eventDefinitionId - right.eventDefinitionId
  );
}

function sortM6PolicyEventOptions(
  values: readonly M6PolicyEventOptionStateV0[]
): readonly M6PolicyEventOptionStateV0[] {
  return [...values].sort((left, right) => left.optionId - right.optionId);
}

function sortM6PolicyEventActive(
  values: readonly M6PolicyEventActiveStateV0[]
): readonly M6PolicyEventActiveStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.activatedDay - right.activatedDay ||
      left.eventDefinitionId - right.eventDefinitionId ||
      left.eventInstanceId - right.eventInstanceId
  );
}

function sortM6PolicyEventResolved(
  values: readonly M6PolicyEventResolvedStateV0[]
): readonly M6PolicyEventResolvedStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.resolvedDay - right.resolvedDay ||
      left.eventDefinitionId - right.eventDefinitionId ||
      left.eventInstanceId - right.eventInstanceId
  );
}

function sortM6PolicyModifiers(
  values: readonly M6PolicyModifierStateV0[]
): readonly M6PolicyModifierStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.policyId - right.policyId ||
      left.startDay - right.startDay ||
      left.eventInstanceId - right.eventInstanceId ||
      left.modifierId - right.modifierId
  );
}

function sortM6AlphaTerminalStates(
  values: readonly M6AlphaTerminalStateV0[]
): readonly M6AlphaTerminalStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.terminalStateId - right.terminalStateId ||
      left.polityId - right.polityId ||
      left.evaluatedDay - right.evaluatedDay
  );
}

function canonicalizeM4PostwarCandidate(
  candidate: M4PostwarCandidateStateV0
): M4PostwarCandidateStateV0 {
  return {
    candidateId: parseDisplayNameKey(candidate.candidateId, "M4 postwar candidateId"),
    sourceWarOutcomeId: parsePositiveInteger(
      candidate.sourceWarOutcomeId,
      "M4 postwar sourceWarOutcomeId"
    ),
    settlementId: parseDisplayNameKey(candidate.settlementId, "M4 postwar settlementId"),
    victorPolityId: parsePolityId(candidate.victorPolityId),
    localPolityId: parsePolityId(candidate.localPolityId),
    districtId: parseDistrictId(candidate.districtId),
    validM3Methods: sortText(candidate.validM3Methods).map(parseM4PostwarMethod),
    reasonCodes: sortText(candidate.reasonCodes).map((code) =>
      parseDisplayNameKey(code, "M4 postwar reasonCode")
    )
  };
}

function sortM4CampaignHooks(
  values: readonly M4CampaignHookStateV0[]
): readonly M4CampaignHookStateV0[] {
  return [...values].sort(
    (left, right) =>
      left.polityId - right.polityId ||
      left.amount - right.amount ||
      compareText(left.reasonCode, right.reasonCode)
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

function sortText<TValue extends string>(values: readonly TValue[]): readonly TValue[] {
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
    `state.m4.marches=${formatM4CampaignMarches(m4.marches ?? [])}`,
    `state.m4.fieldEngagements=${formatM4FieldEngagements(m4.fieldEngagements ?? [])}`,
    `state.m4.sieges=${formatM4Sieges(m4.sieges ?? [])}`,
    `state.m4.withdrawals=${formatM4Withdrawals(m4.withdrawals ?? [])}`,
    `state.m4.warOutcomes=${formatM4WarOutcomes(m4.warOutcomes ?? [])}`,
    `state.m4.postwarCandidates=${formatM4PostwarCandidates(m4.postwarCandidates ?? [])}`
  ];
}

function formatM6CanonicalLines(m6: M6DiplomacyLegitimacyStateV0 | undefined): readonly string[] {
  if (m6 === undefined) {
    return [];
  }

  return [
    `state.m6.schemaVersion=${m6.schemaVersion}`,
    `state.m6.relations=${formatM6Relations(m6.relations)}`,
    `state.m6.agreements=${formatM6Agreements(m6.agreements)}`,
    `state.m6.recognitionEdges=${formatM6RecognitionEdges(m6.recognitionEdges)}`,
    `state.m6.legitimacySources=${formatM6LegitimacySources(m6.legitimacySources)}`,
    `state.m6.legitimacyProfiles=${formatM6LegitimacyProfiles(m6.legitimacyProfiles)}`
  ];
}

function formatM6PolicyEventCanonicalLines(
  runtime: M6PolicyEventRuntimeStateV0 | undefined
): readonly string[] {
  if (runtime === undefined) {
    return [];
  }

  return [
    `state.m6PolicyEvents.schemaVersion=${runtime.schemaVersion}`,
    `state.m6PolicyEvents.definitions.policies=${formatM6PolicyDefinitions(
      runtime.definitions.policies
    )}`,
    `state.m6PolicyEvents.definitions.events=${formatM6PolicyEventDefinitions(
      runtime.definitions.events
    )}`,
    `state.m6PolicyEvents.activeEvents=${formatM6PolicyEventActive(runtime.activeEvents)}`,
    `state.m6PolicyEvents.resolvedEvents=${formatM6PolicyEventResolved(runtime.resolvedEvents)}`,
    `state.m6PolicyEvents.policyModifiers=${formatM6PolicyModifiers(runtime.policyModifiers)}`,
    `state.m6PolicyEvents.nextEventInstanceId=${runtime.nextEventInstanceId}`,
    `state.m6PolicyEvents.nextModifierId=${runtime.nextModifierId}`
  ];
}

function formatM6AlphaCanonicalLines(
  runtime: M6AlphaRuntimeStateV0 | undefined
): readonly string[] {
  if (runtime === undefined) {
    return [];
  }

  return [
    `state.m6Alpha.schemaVersion=${runtime.schemaVersion}`,
    `state.m6Alpha.terminalStates=${formatM6AlphaTerminalStates(runtime.terminalStates)}`
  ];
}

function formatM6Relations(values: readonly M6DiplomaticRelationStateV0[]): string {
  return sortM6Relations(values)
    .map((value) =>
      [
        value.relationId,
        value.polityAId,
        value.polityBId,
        value.trustBps,
        value.affinityBps,
        value.fearBps,
        value.threatBps,
        value.interestAlignmentBps,
        value.historicalDebt,
        value.borderConflictBps,
        value.updatedDay,
        sortText(value.reasonCodes).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6Agreements(values: readonly M6DiplomaticAgreementStateV0[]): string {
  return sortM6Agreements(values)
    .map((value) =>
      [
        value.agreementId,
        value.relationId,
        value.proposerPolityId,
        value.targetPolityId,
        value.agreementKind,
        value.status,
        value.startDay,
        value.endDay,
        value.recognitionDirection,
        sortText(value.reasonCodes).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6RecognitionEdges(values: readonly M6RecognitionEdgeStateV0[]): string {
  return sortM6RecognitionEdges(values)
    .map((value) =>
      [value.fromPolityId, value.toPolityId, value.agreementId, value.reasonCode].join(":")
    )
    .join(",");
}

function formatM6LegitimacySources(values: readonly M6LegitimacySourceStateV0[]): string {
  return sortM6LegitimacySources(values)
    .map((value) =>
      [
        value.sourceId,
        value.polityId,
        value.audience,
        value.sourceKind,
        value.magnitudeBps,
        value.sourceRef,
        value.reasonCode,
        value.createdDay
      ].join(":")
    )
    .join(",");
}

function formatM6LegitimacyProfiles(values: readonly M6LegitimacyProfileStateV0[]): string {
  return sortM6LegitimacyProfiles(values)
    .map((value) =>
      [
        value.polityId,
        value.audience,
        value.scoreBps,
        value.pressureBps,
        sortNumericIds(value.sourceIds).join("/"),
        sortText(value.reasonCodes).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6PolicyDefinitions(values: readonly M6PolicyDefinitionStateV0[]): string {
  return sortM6PolicyDefinitions(values)
    .map((value) =>
      [
        value.policyId,
        value.sourceId,
        value.displayNameKey,
        sortText(value.reasonCodes).join("/"),
        sortText(value.encyclopediaRefs).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6PolicyEventDefinitions(values: readonly M6PolicyEventDefinitionStateV0[]): string {
  return sortM6PolicyEventDefinitions(values)
    .map((value) =>
      [
        value.eventDefinitionId,
        value.sourceId,
        value.displayNameKey,
        value.cause.kind,
        value.cause.day,
        sortText(value.cause.reasonCodes).join("/"),
        formatM6PolicyEventOptions(value.options),
        sortText(value.reasonCodes).join("/"),
        sortText(value.encyclopediaRefs).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6PolicyEventOptions(values: readonly M6PolicyEventOptionStateV0[]): string {
  return sortM6PolicyEventOptions(values)
    .map((value) =>
      [
        value.optionId,
        value.displayNameKey,
        value.consequences
          .map((consequence) =>
            [
              consequence.kind,
              consequence.policyId,
              consequence.magnitudeBps,
              consequence.durationDays,
              consequence.reasonCode
            ].join("/")
          )
          .join("+"),
        sortText(value.reasonCodes).join("/"),
        sortText(value.encyclopediaRefs).join("/")
      ].join("#")
    )
    .join("|");
}

function formatM6PolicyEventActive(values: readonly M6PolicyEventActiveStateV0[]): string {
  return sortM6PolicyEventActive(values)
    .map((value) =>
      [
        value.eventInstanceId,
        value.eventDefinitionId,
        value.activatedDay,
        sortText(value.causeReasonCodes).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6PolicyEventResolved(values: readonly M6PolicyEventResolvedStateV0[]): string {
  return sortM6PolicyEventResolved(values)
    .map((value) =>
      [
        value.eventInstanceId,
        value.eventDefinitionId,
        value.selectedOptionId,
        value.resolvedDay,
        sortText(value.reasonCodes).join("/")
      ].join(":")
    )
    .join(",");
}

function formatM6PolicyModifiers(values: readonly M6PolicyModifierStateV0[]): string {
  return sortM6PolicyModifiers(values)
    .map((value) =>
      [
        value.modifierId,
        value.policyId,
        value.eventInstanceId,
        value.magnitudeBps,
        value.startDay,
        value.endDay,
        value.reasonCode
      ].join(":")
    )
    .join(",");
}

function formatM6AlphaTerminalStates(values: readonly M6AlphaTerminalStateV0[]): string {
  return sortM6AlphaTerminalStates(values)
    .map((value) =>
      [
        value.terminalStateId,
        value.polityId,
        value.outcome,
        value.evaluatedDay,
        value.evaluatedRevision,
        value.maxDay,
        value.evidence.recognizedByCount,
        value.evidence.legitimacyScoreBps,
        value.evidence.postwarArrangementCount,
        value.evidence.resolvedPolicyEventCount,
        value.evidence.successionResolvedCount,
        value.evidence.routeCount,
        value.evidence.populationGroupCount,
        sortText(value.reasonCodes).join("/")
      ].join(":")
    )
    .join(",");
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

function formatM4FieldEngagements(values: readonly M4FieldEngagementStateV0[]): string {
  return sortM4FieldEngagements(values)
    .map((value) =>
      [
        value.engagementId,
        value.campaignPlanId,
        value.marchId,
        value.attackerPolityId,
        value.defenderPolityId,
        formatM4CampaignTarget(value.target),
        value.attackerTroopsBefore,
        value.attackerTroopsAfter,
        value.defenderEstimatedTroopsBefore,
        value.defenderEstimatedTroopsAfter,
        value.attackerCasualties,
        value.defenderCasualties,
        value.supplyLoss,
        value.defenderFortification,
        value.outcome,
        sortText(value.reasonCodes).join("/"),
        sortM4CampaignHooks(value.creditHooks).map(formatM4CampaignHook).join("/"),
        sortM4CampaignHooks(value.reputationHooks).map(formatM4CampaignHook).join("/"),
        value.resolvedDay
      ].join(":")
    )
    .join(",");
}

function formatM4Sieges(values: readonly M4SiegeStateV0[]): string {
  return sortM4Sieges(values)
    .map((value) =>
      [
        value.siegeId,
        value.campaignPlanId,
        value.marchId,
        value.targetDistrictId,
        value.attackerPolityId,
        value.defenderPolityId,
        value.status,
        value.statusReasonCode,
        value.fortification,
        value.defenderEstimatedTroops,
        value.defenderSupply,
        value.siegeProgress,
        value.daysInvested,
        value.blockadeDays,
        value.assaultCount,
        value.attackerTroops,
        value.attackerCasualties,
        value.defenderCasualties,
        value.supplyLoss,
        value.surrenderEligible ? "yes" : "no",
        sortText(value.surrenderReasonCodes).join("/"),
        sortText(value.reasonCodes).join("/"),
        sortM4CampaignHooks(value.creditHooks).map(formatM4CampaignHook).join("/"),
        sortM4CampaignHooks(value.reputationHooks).map(formatM4CampaignHook).join("/"),
        value.startedDay,
        value.updatedDay
      ].join(":")
    )
    .join(",");
}

function formatM4Withdrawals(values: readonly M4WithdrawalStateV0[]): string {
  return sortM4Withdrawals(values)
    .map((value) =>
      [
        value.withdrawalId,
        value.campaignPlanId,
        formatNullableNumber(value.marchId),
        formatNullableNumber(value.siegeId),
        value.kind,
        value.triggerReason,
        value.troopsBefore,
        value.troopsExtracted,
        value.casualties,
        value.supplyLoss,
        sortM4CampaignHooks(value.creditHooks).map(formatM4CampaignHook).join("/"),
        sortM4CampaignHooks(value.reputationHooks).map(formatM4CampaignHook).join("/"),
        sortText(value.reasonCodes).join("/"),
        value.resolvedDay
      ].join(":")
    )
    .join(",");
}

function formatM4WarOutcomes(values: readonly M4WarOutcomeStateV0[]): string {
  return sortM4WarOutcomes(values)
    .map((value) =>
      [
        value.outcomeId,
        value.campaignPlanId,
        value.victorPolityId,
        value.localPolityId,
        value.targetDistrictId,
        value.attackerCasualties,
        value.defenderCasualties,
        value.supplyLoss,
        formatNullableNumber(value.withdrawalId),
        formatNullableNumber(value.siegeId),
        value.postwarCandidate === null ? "none" : formatM4PostwarCandidate(value.postwarCandidate),
        sortText(value.reasonCodes).join("/"),
        value.resolvedDay
      ].join(":")
    )
    .join(",");
}

function formatM4PostwarCandidates(values: readonly M4PostwarCandidateStateV0[]): string {
  return sortM4PostwarCandidates(values).map(formatM4PostwarCandidate).join(",");
}

function formatM4PostwarCandidate(value: M4PostwarCandidateStateV0): string {
  return [
    value.candidateId,
    value.sourceWarOutcomeId,
    value.settlementId,
    value.victorPolityId,
    value.localPolityId,
    value.districtId,
    sortText(value.validM3Methods).join("/"),
    sortText(value.reasonCodes).join("/")
  ].join(".");
}

function formatM4CampaignHook(value: M4CampaignHookStateV0): string {
  return [value.polityId, value.amount, value.reasonCode].join(".");
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
    case "abdication":
      return `abdication:${trigger.characterId}:${formatNullableNumber(trigger.officeId)}`;
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

function formatMapTopologyDefinition(topology: MapTopologyDefinitionV1 | undefined): string {
  if (topology === undefined) {
    return "none";
  }

  const canonicalTopology = canonicalizeMapTopologyDefinitionV1(topology);
  return `hash=${canonicalTopology.topologyHash};${formatMapTopologyDefinitionForHash(
    canonicalTopology
  )}`;
}

function formatMapTopologyCanonicalLines(
  topology: MapTopologyDefinitionV1 | undefined
): readonly string[] {
  if (topology === undefined) {
    return [];
  }

  return [`definitions.topology=${formatMapTopologyDefinition(topology)}`];
}

function formatMapTopologyDefinitionForHash(topology: MapTopologyDefinitionV1): string {
  const canonicalTopology = canonicalizeMapTopologyDefinitionV1(topology);
  return [
    "map-topology-v1",
    `schemaVersion=${canonicalTopology.schemaVersion}`,
    `hashAlgorithm=${canonicalTopology.hashAlgorithm}`,
    `contentManifestHash=${canonicalTopology.contentManifestHash}`,
    `districts=${canonicalTopology.districts.map(formatMapTopologyDistrict).join(",")}`,
    `routeNodes=${canonicalTopology.routeNodes.map(formatMapTopologyRouteNode).join(",")}`,
    `routeEdges=${canonicalTopology.routeEdges.map(formatMapTopologyRouteEdge).join(",")}`
  ].join("|");
}

function formatMapTopologyDistrict(district: MapTopologyDistrictDefinitionV1): string {
  return [
    district.districtId,
    district.sourceId,
    district.displayNameKey,
    formatMapTopologyPoint(district.anchor),
    district.polygon.map(formatMapTopologyPoint).join("+"),
    formatMapTopologyMetadata(district.metadata)
  ].join(":");
}

function formatMapTopologyRouteNode(node: MapTopologyRouteNodeDefinitionV1): string {
  return [
    node.nodeId,
    node.nodeKind,
    node.districtId,
    node.displayNameKey,
    formatMapTopologyPoint(node.anchor)
  ].join(":");
}

function formatMapTopologyRouteEdge(edge: MapTopologyRouteEdgeDefinitionV1): string {
  return [
    edge.routeId,
    edge.sourceId,
    formatMapTopologyEndpoint(edge.from),
    formatMapTopologyEndpoint(edge.to),
    edge.mode,
    edge.baseTravelCost,
    edge.baseCapacity,
    edge.seasonality.map(formatMapTopologySeasonalModifier).join("+"),
    formatMapTopologyAvailability(edge.availability),
    formatMapTopologyMetadata(edge.metadata)
  ].join(":");
}

function formatMapTopologyPoint(point: MapTopologyPointV1): string {
  return `${point.x}.${point.y}`;
}

function formatMapTopologyMetadata(
  metadata: MapTopologyDistrictMetadataV1 | MapTopologyRouteEdgeMetadataV1
): string {
  return `${metadata.historicity}.${metadata.terrainClass}.${metadata.riskClass}`;
}

function formatMapTopologySeasonalModifier(season: MapTopologySeasonalModifierV1): string {
  return [
    season.month,
    season.costMultiplierBps,
    season.capacityMultiplierBps,
    sortText(season.reasonCodes).join("/")
  ].join(".");
}

function formatMapTopologyAvailability(availability: MapTopologyRouteAvailabilityV1): string {
  switch (availability.kind) {
    case "open":
      return "open";
    case "blocked":
      return `blocked.${availability.reasonCode}`;
    case "unknown":
      return `unknown.${availability.reasonCode}`;
  }
}

export function formatMapTopologyEndpoint(endpoint: MapTopologyRouteEndpointV1): string {
  switch (endpoint.kind) {
    case "district":
      return `district.${endpoint.districtId}`;
    case "route-node":
      return `route-node.${endpoint.nodeId}`;
    case "settlement":
      return `settlement.${endpoint.settlementId}`;
  }
}

function formatStrategicTerrainDefinition(
  terrain: StrategicTerrainDefinitionV1 | undefined
): string {
  if (terrain === undefined) {
    return "none";
  }

  const canonicalTerrain = canonicalizeStrategicTerrainDefinitionV1(terrain);
  return `hash=${canonicalTerrain.strategicTerrainHash};${formatStrategicTerrainDefinitionForHash(
    canonicalTerrain
  )}`;
}

function formatStrategicTerrainCanonicalLines(
  terrain: StrategicTerrainDefinitionV1 | undefined
): readonly string[] {
  if (terrain === undefined) {
    return [];
  }

  return [`definitions.strategicTerrain=${formatStrategicTerrainDefinition(terrain)}`];
}

function formatStrategicTerrainDefinitionForHash(terrain: StrategicTerrainDefinitionV1): string {
  const canonicalTerrain = canonicalizeStrategicTerrainDefinitionV1(terrain);
  return [
    "strategic-terrain-v1",
    `schemaVersion=${canonicalTerrain.schemaVersion}`,
    `hashAlgorithm=${canonicalTerrain.hashAlgorithm}`,
    `contentManifestHash=${canonicalTerrain.contentManifestHash}`,
    `authority=${canonicalTerrain.authority}`,
    `governanceFootprintRole=${canonicalTerrain.governanceFootprintRole}`,
    `authorityProhibitions=${canonicalTerrain.authorityProhibitions.join("+")}`,
    `terrainPatches=${canonicalTerrain.terrainPatches.map(formatStrategicTerrainPatch).join(",")}`,
    `barrierChannels=${canonicalTerrain.barrierChannels
      .map(formatStrategicTerrainBarrierChannel)
      .join(",")}`,
    `strategicNodes=${canonicalTerrain.strategicNodes.map(formatStrategicTerrainNode).join(",")}`,
    `routeCorridors=${canonicalTerrain.routeCorridors
      .map(formatStrategicTerrainRouteCorridor)
      .join(",")}`,
    `districtGovernanceFootprints=${canonicalTerrain.districtGovernanceFootprints
      .map(formatStrategicTerrainGovernanceFootprint)
      .join(",")}`
  ].join("|");
}

function formatStrategicTerrainPatch(patch: TerrainPatchDefinitionV1): string {
  return [
    patch.patchId,
    patch.sourceId,
    patch.displayNameKey,
    patch.terrainClass,
    patch.seasonSensitivity,
    patch.historicity,
    patch.polygon.map(formatStrategicTerrainPoint).join("+"),
    patch.explanationTags.join("+")
  ].join(":");
}

function formatStrategicTerrainBarrierChannel(channel: BarrierChannelDefinitionV1): string {
  return [
    channel.channelId,
    channel.sourceId,
    channel.displayNameKey,
    channel.channelKind,
    channel.traversalRule,
    channel.historicity,
    channel.points.map(formatStrategicTerrainPoint).join("+"),
    channel.explanationTags.join("+")
  ].join(":");
}

function formatStrategicTerrainNode(node: StrategicNodeDefinitionV1): string {
  return [
    node.nodeId,
    node.sourceId,
    node.displayNameKey,
    node.nodeKind,
    node.districtId,
    formatStrategicTerrainPoint(node.anchor),
    node.localCapacity,
    node.knownState,
    node.terrainPatchIds.join("+"),
    node.barrierChannelIds.join("+"),
    node.governanceFootprintIds.join("+"),
    node.explanationTags.join("+")
  ].join(":");
}

function formatStrategicTerrainRouteCorridor(corridor: RouteCorridorDefinitionV1): string {
  return [
    corridor.corridorId,
    corridor.sourceId,
    corridor.displayNameKey,
    corridor.fromNodeId,
    corridor.toNodeId,
    corridor.mode,
    corridor.widthClass,
    corridor.baseTravelCost,
    corridor.baseCapacity,
    corridor.riskClass,
    corridor.terrainPatchIds.join("+"),
    corridor.barrierChannelIds.join("+"),
    corridor.governanceFootprintIds.join("+"),
    corridor.seasonality.map(formatRouteCorridorSeasonalModifier).join("+"),
    formatRouteCorridorAvailability(corridor.availability),
    corridor.polyline.map(formatStrategicTerrainPoint).join("+"),
    corridor.explanationTags.join("+")
  ].join(":");
}

function formatRouteCorridorSeasonalModifier(season: RouteCorridorSeasonalModifierV1): string {
  return [
    season.month,
    season.seasonState,
    season.travelCostMultiplierBps,
    season.capacityMultiplierBps,
    season.riskBps,
    season.reasonCodes.join("/")
  ].join(".");
}

function formatRouteCorridorAvailability(availability: RouteCorridorAvailabilityV1): string {
  switch (availability.kind) {
    case "open":
      return "open";
    case "blocked":
      return `blocked.${availability.reasonCode}`;
    case "unknown":
      return `unknown.${availability.reasonCode}`;
  }
}

function formatStrategicTerrainGovernanceFootprint(
  footprint: DistrictGovernanceFootprintDefinitionV1
): string {
  return [
    footprint.footprintId,
    footprint.sourceId,
    footprint.displayNameKey,
    footprint.districtId,
    footprint.overlayOnly ? "overlay-only" : "authority-error",
    footprint.polygon.map(formatStrategicTerrainPoint).join("+"),
    footprint.governanceTags.join("+"),
    footprint.consequenceTags.join("+")
  ].join(":");
}

function formatStrategicTerrainPoint(point: StrategicTerrainPointV1): string {
  return `${point.x}.${point.y}`;
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

  const topologyContentManifestHash = getRecordPath(world, [
    "definitions",
    "topology",
    "contentManifestHash"
  ]);
  if (
    typeof contentManifestHash === "string" &&
    topologyContentManifestHash !== undefined &&
    topologyContentManifestHash !== contentManifestHash
  ) {
    errors.push({
      code: "invalid-schema",
      path: "definitions.topology.contentManifestHash",
      message: "Map topology contentManifestHash must match WorldState meta.contentManifestHash."
    });
  }

  const strategicTerrainContentManifestHash = getRecordPath(world, [
    "definitions",
    "strategicTerrain",
    "contentManifestHash"
  ]);
  if (
    typeof contentManifestHash === "string" &&
    strategicTerrainContentManifestHash !== undefined &&
    strategicTerrainContentManifestHash !== contentManifestHash
  ) {
    errors.push({
      code: "invalid-schema",
      path: "definitions.strategicTerrain.contentManifestHash",
      message:
        "Strategic terrain contentManifestHash must match WorldState meta.contentManifestHash."
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
  if (definitions.topology !== undefined) {
    validateMapTopologyDefinitions(definitions.topology, errors);
  }
  if (definitions.strategicTerrain !== undefined) {
    validateStrategicTerrainDefinitions(definitions.strategicTerrain, errors);
  }
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

  if (definitions.topology !== undefined) {
    validateMapTopologyReferences(definitions, definitions.topology, errors);
  }
  if (definitions.strategicTerrain !== undefined) {
    validateStrategicTerrainReferences(definitions, definitions.strategicTerrain, errors);
  }
}

function validateMapTopologyDefinitions(
  topology: MapTopologyDefinitionV1,
  errors: WorldInvariantError[]
): void {
  validateMapTopologyDuplicateNumbers(
    topology.districts.map((district) => district.districtId),
    "DistrictId",
    "definitions.topology.districts",
    errors
  );
  validateMapTopologyDuplicateStrings(
    topology.districts.map((district) => district.sourceId),
    "district sourceId",
    "definitions.topology.districts",
    errors
  );
  validateMapTopologyDuplicateStrings(
    topology.routeNodes.map((node) => node.nodeId),
    "route nodeId",
    "definitions.topology.routeNodes",
    errors
  );
  validateMapTopologyDuplicateNumbers(
    topology.routeEdges.map((edge) => edge.routeId),
    "RouteId",
    "definitions.topology.routeEdges",
    errors
  );
  validateMapTopologyDuplicateStrings(
    topology.routeEdges.map((edge) => edge.sourceId),
    "route sourceId",
    "definitions.topology.routeEdges",
    errors
  );

  const expectedHash = hashMapTopologyDefinitionV1(topology);
  if (topology.topologyHash !== expectedHash) {
    errors.push({
      code: "invalid-schema",
      path: "definitions.topology.topologyHash",
      message: `MapTopologyDefinition topologyHash ${topology.topologyHash} does not match canonical hash ${expectedHash}.`
    });
  }

  topology.districts.forEach((district, index) => {
    if (district.polygon.length < 3) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.topology.districts[${index}].polygon`,
        message: "Map topology district polygon must contain at least 3 anchors."
      });
    }
  });

  topology.routeEdges.forEach((edge, index) => {
    validateMapTopologySeasonality(edge.seasonality, index, errors);
    if (formatMapTopologyEndpoint(edge.from) === formatMapTopologyEndpoint(edge.to)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.routeEdges[${index}].to`,
        message: "Map topology route edge endpoints must be different."
      });
    }
  });
}

function validateMapTopologyDuplicateNumbers(
  values: readonly number[],
  label: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<number>();
  for (const value of values) {
    if (seen.has(value)) {
      errors.push({
        code: "duplicate-definition-id",
        path,
        message: `Duplicate map topology ${label} ${value}.`
      });
      continue;
    }
    seen.add(value);
  }
}

function validateMapTopologyDuplicateStrings(
  values: readonly string[],
  label: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      errors.push({
        code: "duplicate-definition-id",
        path,
        message: `Duplicate map topology ${label} ${value}.`
      });
      continue;
    }
    seen.add(value);
  }
}

function validateMapTopologySeasonality(
  seasonality: readonly MapTopologySeasonalModifierV1[],
  routeIndex: number,
  errors: WorldInvariantError[]
): void {
  if (seasonality.length !== 12) {
    errors.push({
      code: "invalid-schema",
      path: `definitions.topology.routeEdges[${routeIndex}].seasonality`,
      message: "Map topology route edge seasonality must contain exactly 12 months."
    });
  }

  const months = new Set<number>();
  seasonality.forEach((season, seasonIndex) => {
    if (months.has(season.month)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: `definitions.topology.routeEdges[${routeIndex}].seasonality[${seasonIndex}].month`,
        message: `Duplicate map topology seasonal month ${season.month}.`
      });
    }
    months.add(season.month);
  });

  for (let month = 1; month <= 12; month += 1) {
    if (!months.has(month)) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.topology.routeEdges[${routeIndex}].seasonality`,
        message: `Map topology route edge seasonality is missing month ${month}.`
      });
    }
  }
}

function validateMapTopologyReferences(
  definitions: WorldDefinitionsV0,
  topology: MapTopologyDefinitionV1,
  errors: WorldInvariantError[]
): void {
  const districtIds = idsOf(definitions.districts);
  const settlementIds = idsOf(definitions.settlements);
  const routeById = new Map<number, RouteDefinition>();
  definitions.routes.forEach((route) => {
    routeById.set(route.id, route);
  });

  topology.districts.forEach((district, index) => {
    const matchingDistrict = definitions.districts.find(
      (entry) => entry.id === district.districtId
    );
    if (matchingDistrict === undefined) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.districts[${index}].districtId`,
        message: `Map topology district references missing DistrictId ${district.districtId}.`
      });
      return;
    }
    if (matchingDistrict.displayNameKey !== district.displayNameKey) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.districts[${index}].displayNameKey`,
        message: "Map topology district displayNameKey must match DistrictDefinition."
      });
    }
  });

  const topologyDistrictIds = new Set(topology.districts.map((district) => district.districtId));
  definitions.districts.forEach((district) => {
    if (!topologyDistrictIds.has(district.id)) {
      errors.push({
        code: "bad-reference",
        path: "definitions.topology.districts",
        message: `Map topology is missing polygon definition for DistrictId ${district.id}.`
      });
    }
  });

  topology.routeNodes.forEach((node, index) => {
    if (!districtIds.has(node.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.routeNodes[${index}].districtId`,
        message: `Map topology route node references missing DistrictId ${node.districtId}.`
      });
    }
  });

  topology.routeEdges.forEach((edge, index) => {
    const routeDefinition = routeById.get(edge.routeId);
    if (routeDefinition === undefined) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.routeEdges[${index}].routeId`,
        message: `Map topology route edge references missing RouteId ${edge.routeId}.`
      });
    }

    validateMapTopologyEndpointReference(
      definitions,
      topology,
      edge.from,
      `definitions.topology.routeEdges[${index}].from`,
      errors
    );
    validateMapTopologyEndpointReference(
      definitions,
      topology,
      edge.to,
      `definitions.topology.routeEdges[${index}].to`,
      errors
    );

    const fromDistrictId = tryMapTopologyEndpointDistrictId(definitions, topology, edge.from);
    const toDistrictId = tryMapTopologyEndpointDistrictId(definitions, topology, edge.to);
    if (fromDistrictId !== undefined && toDistrictId !== undefined) {
      if (fromDistrictId === toDistrictId) {
        errors.push({
          code: "bad-reference",
          path: `definitions.topology.routeEdges[${index}].to`,
          message: "Map topology route edge must connect two different districts."
        });
      }
      if (routeDefinition !== undefined) {
        if (routeDefinition.fromDistrictId !== fromDistrictId) {
          errors.push({
            code: "bad-reference",
            path: `definitions.topology.routeEdges[${index}].from`,
            message: "Map topology route edge from endpoint must match RouteDefinition."
          });
        }
        if (routeDefinition.toDistrictId !== toDistrictId) {
          errors.push({
            code: "bad-reference",
            path: `definitions.topology.routeEdges[${index}].to`,
            message: "Map topology route edge to endpoint must match RouteDefinition."
          });
        }
        if (routeDefinition.lengthInMapUnits !== edge.baseTravelCost) {
          errors.push({
            code: "invalid-schema",
            path: `definitions.topology.routeEdges[${index}].baseTravelCost`,
            message: "Map topology route edge baseTravelCost must match RouteDefinition length."
          });
        }
      }
    }

    if (edge.from.kind === "settlement" && !settlementIds.has(edge.from.settlementId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.routeEdges[${index}].from.settlementId`,
        message: `Map topology route edge references missing SettlementId ${edge.from.settlementId}.`
      });
    }
    if (edge.to.kind === "settlement" && !settlementIds.has(edge.to.settlementId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.topology.routeEdges[${index}].to.settlementId`,
        message: `Map topology route edge references missing SettlementId ${edge.to.settlementId}.`
      });
    }
  });
}

function validateStrategicTerrainDefinitions(
  terrain: StrategicTerrainDefinitionV1,
  errors: WorldInvariantError[]
): void {
  validateMapTopologyDuplicateStrings(
    terrain.terrainPatches.map((patch) => patch.patchId),
    "terrain patchId",
    "definitions.strategicTerrain.terrainPatches",
    errors
  );
  validateMapTopologyDuplicateStrings(
    terrain.terrainPatches.map((patch) => patch.sourceId),
    "terrain patch sourceId",
    "definitions.strategicTerrain.terrainPatches",
    errors
  );
  validateMapTopologyDuplicateStrings(
    terrain.barrierChannels.map((channel) => channel.channelId),
    "barrier channelId",
    "definitions.strategicTerrain.barrierChannels",
    errors
  );
  validateMapTopologyDuplicateStrings(
    terrain.strategicNodes.map((node) => node.nodeId),
    "strategic nodeId",
    "definitions.strategicTerrain.strategicNodes",
    errors
  );
  validateMapTopologyDuplicateStrings(
    terrain.routeCorridors.map((corridor) => corridor.corridorId),
    "route corridorId",
    "definitions.strategicTerrain.routeCorridors",
    errors
  );
  validateMapTopologyDuplicateStrings(
    terrain.districtGovernanceFootprints.map((footprint) => footprint.footprintId),
    "district governance footprintId",
    "definitions.strategicTerrain.districtGovernanceFootprints",
    errors
  );

  if (terrain.governanceFootprintRole !== "overlay-only") {
    errors.push({
      code: "invalid-schema",
      path: "definitions.strategicTerrain.governanceFootprintRole",
      message: "Strategic terrain governance footprints must be overlay-only."
    });
  }

  const expectedHash = hashStrategicTerrainDefinitionV1(terrain);
  if (terrain.strategicTerrainHash !== expectedHash) {
    errors.push({
      code: "invalid-schema",
      path: "definitions.strategicTerrain.strategicTerrainHash",
      message: `StrategicTerrainDefinition strategicTerrainHash ${terrain.strategicTerrainHash} does not match canonical hash ${expectedHash}.`
    });
  }

  terrain.terrainPatches.forEach((patch, index) => {
    if (patch.polygon.length < 3) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.strategicTerrain.terrainPatches[${index}].polygon`,
        message: "Strategic terrain patch polygon must contain at least 3 points."
      });
    }
  });

  terrain.barrierChannels.forEach((channel, index) => {
    if (channel.points.length < 2) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.strategicTerrain.barrierChannels[${index}].points`,
        message: "Strategic terrain barrier/channel must contain at least 2 points."
      });
    }
  });

  terrain.routeCorridors.forEach((corridor, index) => {
    validateRouteCorridorSeasonality(corridor.seasonality, index, errors);
    if (corridor.fromNodeId === corridor.toNodeId) {
      errors.push({
        code: "bad-reference",
        path: `definitions.strategicTerrain.routeCorridors[${index}].toNodeId`,
        message: "Strategic terrain route corridor endpoints must be different."
      });
    }
    if (corridor.polyline.length < 2) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.strategicTerrain.routeCorridors[${index}].polyline`,
        message: "Strategic terrain route corridor polyline must contain at least 2 points."
      });
    }
  });

  terrain.districtGovernanceFootprints.forEach((footprint, index) => {
    if (footprint.overlayOnly !== true) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.strategicTerrain.districtGovernanceFootprints[${index}].overlayOnly`,
        message: "District governance footprint must remain overlayOnly."
      });
    }
    if (footprint.polygon.length < 3) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.strategicTerrain.districtGovernanceFootprints[${index}].polygon`,
        message: "District governance footprint polygon must contain at least 3 points."
      });
    }
  });
}

function validateRouteCorridorSeasonality(
  seasonality: readonly RouteCorridorSeasonalModifierV1[],
  corridorIndex: number,
  errors: WorldInvariantError[]
): void {
  if (seasonality.length !== 12) {
    errors.push({
      code: "invalid-schema",
      path: `definitions.strategicTerrain.routeCorridors[${corridorIndex}].seasonality`,
      message: "Strategic terrain route corridor seasonality must contain exactly 12 months."
    });
  }

  const months = new Set<number>();
  seasonality.forEach((season, seasonIndex) => {
    if (months.has(season.month)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: `definitions.strategicTerrain.routeCorridors[${corridorIndex}].seasonality[${seasonIndex}].month`,
        message: `Duplicate strategic terrain seasonal month ${season.month}.`
      });
    }
    months.add(season.month);
  });

  for (let month = 1; month <= 12; month += 1) {
    if (!months.has(month)) {
      errors.push({
        code: "invalid-schema",
        path: `definitions.strategicTerrain.routeCorridors[${corridorIndex}].seasonality`,
        message: `Strategic terrain route corridor seasonality is missing month ${month}.`
      });
    }
  }
}

function validateStrategicTerrainReferences(
  definitions: WorldDefinitionsV0,
  terrain: StrategicTerrainDefinitionV1,
  errors: WorldInvariantError[]
): void {
  const districtIds = idsOf(definitions.districts);
  const patchIds = new Set<string>(terrain.terrainPatches.map((patch) => patch.patchId));
  const channelIds = new Set<string>(terrain.barrierChannels.map((channel) => channel.channelId));
  const nodeIds = new Set<string>(terrain.strategicNodes.map((node) => node.nodeId));
  const footprintIds = new Set<string>(
    terrain.districtGovernanceFootprints.map((footprint) => footprint.footprintId)
  );

  terrain.strategicNodes.forEach((node, index) => {
    if (!districtIds.has(node.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.strategicTerrain.strategicNodes[${index}].districtId`,
        message: `Strategic terrain node references missing DistrictId ${node.districtId}.`
      });
    }
    validateStrategicTerrainIdReferences(
      node.terrainPatchIds,
      patchIds,
      `definitions.strategicTerrain.strategicNodes[${index}].terrainPatchIds`,
      "TerrainPatch",
      errors
    );
    validateStrategicTerrainIdReferences(
      node.barrierChannelIds,
      channelIds,
      `definitions.strategicTerrain.strategicNodes[${index}].barrierChannelIds`,
      "BarrierChannel",
      errors
    );
    validateStrategicTerrainIdReferences(
      node.governanceFootprintIds,
      footprintIds,
      `definitions.strategicTerrain.strategicNodes[${index}].governanceFootprintIds`,
      "DistrictGovernanceFootprint",
      errors
    );
  });

  terrain.routeCorridors.forEach((corridor, index) => {
    if (!nodeIds.has(corridor.fromNodeId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.strategicTerrain.routeCorridors[${index}].fromNodeId`,
        message: `Strategic terrain corridor references missing from StrategicNode ${corridor.fromNodeId}.`
      });
    }
    if (!nodeIds.has(corridor.toNodeId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.strategicTerrain.routeCorridors[${index}].toNodeId`,
        message: `Strategic terrain corridor references missing to StrategicNode ${corridor.toNodeId}.`
      });
    }
    validateStrategicTerrainIdReferences(
      corridor.terrainPatchIds,
      patchIds,
      `definitions.strategicTerrain.routeCorridors[${index}].terrainPatchIds`,
      "TerrainPatch",
      errors
    );
    validateStrategicTerrainIdReferences(
      corridor.barrierChannelIds,
      channelIds,
      `definitions.strategicTerrain.routeCorridors[${index}].barrierChannelIds`,
      "BarrierChannel",
      errors
    );
    validateStrategicTerrainIdReferences(
      corridor.governanceFootprintIds,
      footprintIds,
      `definitions.strategicTerrain.routeCorridors[${index}].governanceFootprintIds`,
      "DistrictGovernanceFootprint",
      errors
    );
  });

  terrain.districtGovernanceFootprints.forEach((footprint, index) => {
    if (!districtIds.has(footprint.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.strategicTerrain.districtGovernanceFootprints[${index}].districtId`,
        message: `District governance footprint references missing DistrictId ${footprint.districtId}.`
      });
    }
  });
}

function validateStrategicTerrainIdReferences(
  values: readonly string[],
  allowed: ReadonlySet<string>,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  values.forEach((value, index) => {
    if (!allowed.has(value)) {
      errors.push({
        code: "bad-reference",
        path: `${path}[${index}]`,
        message: `Strategic terrain reference ${value} does not match a ${label}.`
      });
    }
  });
}

function validateMapTopologyEndpointReference(
  definitions: WorldDefinitionsV0,
  topology: MapTopologyDefinitionV1,
  endpoint: MapTopologyRouteEndpointV1,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (tryMapTopologyEndpointDistrictId(definitions, topology, endpoint) !== undefined) {
    return;
  }

  errors.push({
    code: "bad-reference",
    path,
    message: `Map topology endpoint ${formatMapTopologyEndpoint(endpoint)} cannot be resolved to a district.`
  });
}

export function mapTopologyEndpointDistrictId(
  definitions: WorldDefinitionsV0,
  endpoint: MapTopologyRouteEndpointV1
): DistrictId {
  const topology = definitions.topology;
  if (topology === undefined) {
    throw new Error("Map topology endpoint cannot be resolved without definitions.topology.");
  }

  const districtId = tryMapTopologyEndpointDistrictId(definitions, topology, endpoint);
  if (districtId === undefined) {
    throw new Error(`Map topology endpoint ${formatMapTopologyEndpoint(endpoint)} is unresolved.`);
  }

  return parseDistrictId(districtId);
}

export function tryMapTopologyEndpointDistrictId(
  definitions: WorldDefinitionsV0,
  topology: MapTopologyDefinitionV1,
  endpoint: MapTopologyRouteEndpointV1
): DistrictId | undefined {
  switch (endpoint.kind) {
    case "district":
      if (definitions.districts.some((district) => district.id === endpoint.districtId)) {
        return endpoint.districtId;
      }
      return undefined;
    case "route-node": {
      const node = topology.routeNodes.find((entry) => entry.nodeId === endpoint.nodeId);
      if (
        node !== undefined &&
        definitions.districts.some((district) => district.id === node.districtId)
      ) {
        return node.districtId;
      }
      return undefined;
    }
    case "settlement": {
      const settlement = definitions.settlements.find(
        (entry) => entry.id === endpoint.settlementId
      );
      if (
        settlement !== undefined &&
        definitions.districts.some((district) => district.id === settlement.districtId)
      ) {
        return settlement.districtId;
      }
      return undefined;
    }
  }
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
  const topologyRouteById = new Map<number, MapTopologyRouteEdgeDefinitionV1>();
  world.definitions.topology?.routeEdges.forEach((route) => {
    topologyRouteById.set(route.routeId, route);
  });
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

    const topologyRoute = topologyRouteById.get(route.routeId);
    if (topologyRoute !== undefined) {
      const topology = world.definitions.topology;
      const topologyFromDistrictId =
        topology === undefined
          ? undefined
          : tryMapTopologyEndpointDistrictId(world.definitions, topology, topologyRoute.from);
      const topologyToDistrictId =
        topology === undefined
          ? undefined
          : tryMapTopologyEndpointDistrictId(world.definitions, topology, topologyRoute.to);
      if (topologyFromDistrictId !== undefined && route.fromDistrictId !== topologyFromDistrictId) {
        errors.push({
          code: "bad-reference",
          path: `state.m2.transport.routes[${index}].fromDistrictId`,
          message: "M2 route transport fromDistrictId must match topology route endpoint."
        });
      }
      if (topologyToDistrictId !== undefined && route.toDistrictId !== topologyToDistrictId) {
        errors.push({
          code: "bad-reference",
          path: `state.m2.transport.routes[${index}].toDistrictId`,
          message: "M2 route transport toDistrictId must match topology route endpoint."
        });
      }
      if (route.routeKind !== topologyRoute.mode) {
        errors.push({
          code: "invalid-schema",
          path: `state.m2.transport.routes[${index}].routeKind`,
          message: "M2 route transport routeKind must match topology route mode."
        });
      }
      if (route.baseTravelCost !== topologyRoute.baseTravelCost) {
        errors.push({
          code: "invalid-schema",
          path: `state.m2.transport.routes[${index}].baseTravelCost`,
          message: "M2 route transport baseTravelCost must match topology route cost."
        });
      }
      if (route.baseCapacity !== topologyRoute.baseCapacity) {
        errors.push({
          code: "invalid-schema",
          path: `state.m2.transport.routes[${index}].baseCapacity`,
          message: "M2 route transport baseCapacity must match topology route capacity."
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
    const candidateIds = new Set<number>();
    crisis.candidates.forEach((candidate, candidateIndex) => {
      if (candidateIds.has(candidate.characterId)) {
        errors.push({
          code: "duplicate-runtime-state-row",
          path: `state.m3.successionCrises[${index}].candidates`,
          message: "M3 succession crisis contains a duplicate candidate."
        });
      }
      candidateIds.add(candidate.characterId);
      if (!characterIds.has(candidate.characterId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m3.successionCrises[${index}].candidates[${candidateIndex}].characterId`,
          message: "M3 succession candidate references missing character."
        });
      }
      if (candidate.characterId === crisis.trigger.characterId) {
        errors.push({
          code: "invalid-schema",
          path: `state.m3.successionCrises[${index}].candidates[${candidateIndex}].characterId`,
          message: "M3 succession trigger character must not be a candidate in the same crisis."
        });
      }
    });
    validateM3SuccessionOutcomeReferences(
      crisis,
      candidateIds,
      characterIds,
      availableCharacterIds,
      index,
      errors
    );
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

function validateM3SuccessionOutcomeReferences(
  crisis: M3SuccessionCrisisStateV0,
  candidateIds: ReadonlySet<number>,
  characterIds: ReadonlySet<number>,
  availableCharacterIds: ReadonlySet<number>,
  crisisIndex: number,
  errors: WorldInvariantError[]
): void {
  if (crisis.outcome === null) {
    return;
  }
  switch (crisis.outcome.kind) {
    case "peaceful":
      validateM3SuccessionOutcomeCandidateReference(
        candidateIds,
        crisis.outcome.successorCharacterId,
        `state.m3.successionCrises[${crisisIndex}].outcome.successorCharacterId`,
        errors
      );
      return;
    case "regency":
      validateM3SuccessionOutcomeCandidateReference(
        candidateIds,
        crisis.outcome.successorCharacterId,
        `state.m3.successionCrises[${crisisIndex}].outcome.successorCharacterId`,
        errors
      );
      if (crisis.outcome.regentCharacterId === crisis.outcome.successorCharacterId) {
        errors.push({
          code: "invalid-schema",
          path: `state.m3.successionCrises[${crisisIndex}].outcome.regentCharacterId`,
          message: "M3 succession regent must differ from the successor."
        });
      }
      validateM3SuccessionRegentReference(
        characterIds,
        availableCharacterIds,
        crisis.outcome.regentCharacterId,
        `state.m3.successionCrises[${crisisIndex}].outcome.regentCharacterId`,
        errors
      );
      return;
    case "disputed":
      validateM3SuccessionOutcomeCandidateReference(
        candidateIds,
        crisis.outcome.leadingCharacterId,
        `state.m3.successionCrises[${crisisIndex}].outcome.leadingCharacterId`,
        errors
      );
      validateM3SuccessionOutcomeCandidateReference(
        candidateIds,
        crisis.outcome.rivalCharacterId,
        `state.m3.successionCrises[${crisisIndex}].outcome.rivalCharacterId`,
        errors
      );
      if (crisis.outcome.leadingCharacterId === crisis.outcome.rivalCharacterId) {
        errors.push({
          code: "invalid-schema",
          path: `state.m3.successionCrises[${crisisIndex}].outcome.rivalCharacterId`,
          message: "M3 disputed succession rival must differ from the leading claimant."
        });
      }
      return;
  }
}

function validateM3SuccessionRegentReference(
  characterIds: ReadonlySet<number>,
  availableCharacterIds: ReadonlySet<number>,
  characterId: number,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (!characterIds.has(characterId)) {
    errors.push({
      code: "bad-reference",
      path,
      message: "M3 succession regent references missing character."
    });
    return;
  }
  if (!availableCharacterIds.has(characterId)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 succession regent must be alive and not incapacitated."
    });
  }
}

function validateM3SuccessionOutcomeCandidateReference(
  candidateIds: ReadonlySet<number>,
  characterId: number,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (candidateIds.has(characterId)) {
    return;
  }
  errors.push({
    code: "bad-reference",
    path,
    message: "M3 succession outcome references a character outside the crisis candidates."
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

  const fieldEngagementIds = new Set<number>();
  (m4.fieldEngagements ?? []).forEach((engagement, index) => {
    if (fieldEngagementIds.has(engagement.engagementId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.fieldEngagements",
        message: `Duplicate M4 field engagement row for FieldEngagementId ${engagement.engagementId}.`
      });
    }
    fieldEngagementIds.add(engagement.engagementId);
    if (!planIds.has(engagement.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.fieldEngagements[${index}].campaignPlanId`,
        message: "M4 field engagement references missing CampaignPlanId."
      });
    }
    if (!marchIds.has(engagement.marchId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.fieldEngagements[${index}].marchId`,
        message: "M4 field engagement references missing CampaignMarchId."
      });
    }
    if (
      !polityIds.has(engagement.attackerPolityId) ||
      !polityIds.has(engagement.defenderPolityId)
    ) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.fieldEngagements[${index}]`,
        message: "M4 field engagement references missing polity."
      });
    }
    validateM4TargetReference(
      engagement.target,
      polityIds,
      districtIds,
      `state.m4.fieldEngagements[${index}].target`,
      errors
    );
    if (
      engagement.attackerTroopsBefore - engagement.attackerCasualties !==
      engagement.attackerTroopsAfter
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.fieldEngagements[${index}].attackerCasualties`,
        message: "M4 field engagement attacker casualties must equal before minus after troops."
      });
    }
    if (
      engagement.defenderEstimatedTroopsBefore - engagement.defenderCasualties !==
      engagement.defenderEstimatedTroopsAfter
    ) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.fieldEngagements[${index}].defenderCasualties`,
        message: "M4 field engagement defender casualties must equal before minus after estimate."
      });
    }
  });

  const siegeIds = new Set<number>();
  (m4.sieges ?? []).forEach((siege, index) => {
    if (siegeIds.has(siege.siegeId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.sieges",
        message: `Duplicate M4 siege row for SiegeId ${siege.siegeId}.`
      });
    }
    siegeIds.add(siege.siegeId);
    if (!planIds.has(siege.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.sieges[${index}].campaignPlanId`,
        message: "M4 siege references missing CampaignPlanId."
      });
    }
    if (!marchIds.has(siege.marchId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.sieges[${index}].marchId`,
        message: "M4 siege references missing CampaignMarchId."
      });
    }
    if (!districtIds.has(siege.targetDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.sieges[${index}].targetDistrictId`,
        message: "M4 siege references missing target DistrictId."
      });
    }
    if (!polityIds.has(siege.attackerPolityId) || !polityIds.has(siege.defenderPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.sieges[${index}]`,
        message: "M4 siege references missing polity."
      });
    }
    if (siege.updatedDay < siege.startedDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.sieges[${index}].updatedDay`,
        message: "M4 siege updatedDay must be >= startedDay."
      });
    }
    if (!siege.surrenderEligible && siege.status === "surrender-ready") {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.sieges[${index}].surrenderEligible`,
        message: "M4 surrender-ready siege must be surrenderEligible."
      });
    }
  });

  const withdrawalIds = new Set<number>();
  (m4.withdrawals ?? []).forEach((withdrawal, index) => {
    if (withdrawalIds.has(withdrawal.withdrawalId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.withdrawals",
        message: `Duplicate M4 withdrawal row for WithdrawalId ${withdrawal.withdrawalId}.`
      });
    }
    withdrawalIds.add(withdrawal.withdrawalId);
    if (!planIds.has(withdrawal.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.withdrawals[${index}].campaignPlanId`,
        message: "M4 withdrawal references missing CampaignPlanId."
      });
    }
    if (withdrawal.marchId !== null && !marchIds.has(withdrawal.marchId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.withdrawals[${index}].marchId`,
        message: "M4 withdrawal references missing CampaignMarchId."
      });
    }
    if (withdrawal.siegeId !== null && !siegeIds.has(withdrawal.siegeId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.withdrawals[${index}].siegeId`,
        message: "M4 withdrawal references missing SiegeId."
      });
    }
    if (withdrawal.troopsExtracted + withdrawal.casualties !== withdrawal.troopsBefore) {
      errors.push({
        code: "invalid-schema",
        path: `state.m4.withdrawals[${index}].casualties`,
        message: "M4 withdrawal casualties plus extracted troops must equal troopsBefore."
      });
    }
  });

  const outcomeIds = new Set<number>();
  const postwarCandidateIds = new Set<string>();
  const postwarDistrictKeys = new Set<string>();
  (m4.warOutcomes ?? []).forEach((outcome, index) => {
    if (outcomeIds.has(outcome.outcomeId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.warOutcomes",
        message: `Duplicate M4 war outcome row for WarOutcomeId ${outcome.outcomeId}.`
      });
    }
    outcomeIds.add(outcome.outcomeId);
    if (!planIds.has(outcome.campaignPlanId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.warOutcomes[${index}].campaignPlanId`,
        message: "M4 war outcome references missing CampaignPlanId."
      });
    }
    if (!polityIds.has(outcome.victorPolityId) || !polityIds.has(outcome.localPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.warOutcomes[${index}]`,
        message: "M4 war outcome references missing polity."
      });
    }
    if (!districtIds.has(outcome.targetDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.warOutcomes[${index}].targetDistrictId`,
        message: "M4 war outcome references missing DistrictId."
      });
    }
    if (outcome.withdrawalId !== null && !withdrawalIds.has(outcome.withdrawalId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.warOutcomes[${index}].withdrawalId`,
        message: "M4 war outcome references missing WithdrawalId."
      });
    }
    if (outcome.siegeId !== null && !siegeIds.has(outcome.siegeId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.warOutcomes[${index}].siegeId`,
        message: "M4 war outcome references missing SiegeId."
      });
    }
  });
  (m4.postwarCandidates ?? []).forEach((candidate, index) => {
    if (postwarCandidateIds.has(candidate.candidateId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.postwarCandidates",
        message: `Duplicate M4 postwar candidate ${candidate.candidateId}.`
      });
    }
    postwarCandidateIds.add(candidate.candidateId);
    const districtKey = `${candidate.victorPolityId}:${candidate.localPolityId}:${candidate.districtId}`;
    if (postwarDistrictKeys.has(districtKey)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m4.postwarCandidates",
        message: "Duplicate M4 postwar candidate for victor/local/district reference."
      });
    }
    postwarDistrictKeys.add(districtKey);
    if (!outcomeIds.has(candidate.sourceWarOutcomeId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.postwarCandidates[${index}].sourceWarOutcomeId`,
        message: "M4 postwar candidate references missing WarOutcomeId."
      });
    }
    if (!polityIds.has(candidate.victorPolityId) || !polityIds.has(candidate.localPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.postwarCandidates[${index}]`,
        message: "M4 postwar candidate references missing polity."
      });
    }
    if (!districtIds.has(candidate.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m4.postwarCandidates[${index}].districtId`,
        message: "M4 postwar candidate references missing DistrictId."
      });
    }
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

function validateM6RuntimeState(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const m6 = world.state.m6;
  if (m6 === undefined) {
    return;
  }
  if (!isM6StateLike(m6)) {
    return;
  }

  const polityIds = idsOf(world.definitions.polities);
  const relationIds = new Set<number>();
  m6.relations.forEach((relation, index) => {
    if (relationIds.has(relation.relationId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6.relations",
        message: `Duplicate M6 diplomatic relation row for M6DiplomaticRelationId ${relation.relationId}.`
      });
    }
    relationIds.add(relation.relationId);
    if (relation.polityAId === relation.polityBId) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6.relations[${index}].polityBId`,
        message: "M6 diplomatic relation endpoints must be different polities."
      });
    }
    validatePolityReference(
      polityIds,
      relation.polityAId,
      `state.m6.relations[${index}].polityAId`,
      errors
    );
    validatePolityReference(
      polityIds,
      relation.polityBId,
      `state.m6.relations[${index}].polityBId`,
      errors
    );
  });

  const agreementIds = new Set<number>();
  m6.agreements.forEach((agreement, index) => {
    if (agreementIds.has(agreement.agreementId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6.agreements",
        message: `Duplicate M6 diplomatic agreement row for M6DiplomaticAgreementId ${agreement.agreementId}.`
      });
    }
    agreementIds.add(agreement.agreementId);
    if (!relationIds.has(agreement.relationId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m6.agreements[${index}].relationId`,
        message: "M6 diplomatic agreement references missing relation."
      });
    }
    validatePolityReference(
      polityIds,
      agreement.proposerPolityId,
      `state.m6.agreements[${index}].proposerPolityId`,
      errors
    );
    validatePolityReference(
      polityIds,
      agreement.targetPolityId,
      `state.m6.agreements[${index}].targetPolityId`,
      errors
    );
    if (agreement.proposerPolityId === agreement.targetPolityId) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6.agreements[${index}].targetPolityId`,
        message: "M6 diplomatic agreement endpoints must be different polities."
      });
    }
    if (agreement.endDay < agreement.startDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6.agreements[${index}].endDay`,
        message: "M6 diplomatic agreement endDay must be >= startDay."
      });
    }
  });

  m6.recognitionEdges.forEach((edge, index) => {
    validatePolityReference(
      polityIds,
      edge.fromPolityId,
      `state.m6.recognitionEdges[${index}].fromPolityId`,
      errors
    );
    validatePolityReference(
      polityIds,
      edge.toPolityId,
      `state.m6.recognitionEdges[${index}].toPolityId`,
      errors
    );
    if (!agreementIds.has(edge.agreementId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m6.recognitionEdges[${index}].agreementId`,
        message: "M6 recognition edge references missing agreement."
      });
    }
  });
  validateM6RecognitionAcyclicity(m6.recognitionEdges, errors);

  const sourceIds = new Set<number>();
  m6.legitimacySources.forEach((source, index) => {
    if (sourceIds.has(source.sourceId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6.legitimacySources",
        message: `Duplicate M6 legitimacy source row for M6LegitimacySourceId ${source.sourceId}.`
      });
    }
    sourceIds.add(source.sourceId);
    validatePolityReference(
      polityIds,
      source.polityId,
      `state.m6.legitimacySources[${index}].polityId`,
      errors
    );
  });

  const profileKeys = new Set<string>();
  m6.legitimacyProfiles.forEach((profile, index) => {
    const key = `${profile.polityId}:${profile.audience}`;
    if (profileKeys.has(key)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6.legitimacyProfiles",
        message: "Duplicate M6 legitimacy profile row for polity and audience."
      });
    }
    profileKeys.add(key);
    validatePolityReference(
      polityIds,
      profile.polityId,
      `state.m6.legitimacyProfiles[${index}].polityId`,
      errors
    );
    profile.sourceIds.forEach((sourceId, sourceIndex) => {
      if (!sourceIds.has(sourceId)) {
        errors.push({
          code: "bad-reference",
          path: `state.m6.legitimacyProfiles[${index}].sourceIds[${sourceIndex}]`,
          message: "M6 legitimacy profile references missing source."
        });
      }
    });
  });
}

function validateM6PolicyEventRuntimeState(
  world: WorldStateV0Candidate,
  errors: WorldInvariantError[]
): void {
  const runtime = world.state.m6PolicyEvents;
  if (runtime === undefined || !isM6PolicyEventRuntimeLike(runtime)) {
    return;
  }

  const policyIds = new Set<number>();
  runtime.definitions.policies.forEach((policy, index) => {
    if (policyIds.has(policy.policyId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6PolicyEvents.definitions.policies",
        message: `Duplicate M6 policy definition row for M6PolicyDefinitionId ${policy.policyId}.`
      });
    }
    policyIds.add(policy.policyId);
    if (policy.reasonCodes.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.definitions.policies[${index}].reasonCodes`,
        message: "M6 policy definition requires at least one reason code."
      });
    }
    if (policy.encyclopediaRefs.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.definitions.policies[${index}].encyclopediaRefs`,
        message: "M6 policy definition requires at least one encyclopedia reference."
      });
    }
  });

  const eventDefinitionIds = new Set<number>();
  runtime.definitions.events.forEach((event, eventIndex) => {
    if (eventDefinitionIds.has(event.eventDefinitionId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6PolicyEvents.definitions.events",
        message: `Duplicate M6 event definition row for M6PolicyEventDefinitionId ${event.eventDefinitionId}.`
      });
    }
    eventDefinitionIds.add(event.eventDefinitionId);
    if (event.options.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.definitions.events[${eventIndex}].options`,
        message: "M6 event definition requires at least one option."
      });
    }
    if (event.reasonCodes.length === 0 || event.cause.reasonCodes.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.definitions.events[${eventIndex}].reasonCodes`,
        message: "M6 event definition and cause require reason codes."
      });
    }
    if (event.encyclopediaRefs.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.definitions.events[${eventIndex}].encyclopediaRefs`,
        message: "M6 event definition requires at least one encyclopedia reference."
      });
    }
    const optionIds = new Set<number>();
    event.options.forEach((option, optionIndex) => {
      if (optionIds.has(option.optionId)) {
        errors.push({
          code: "duplicate-runtime-state-row",
          path: `state.m6PolicyEvents.definitions.events[${eventIndex}].options`,
          message: `Duplicate M6 event option row for optionId ${option.optionId}.`
        });
      }
      optionIds.add(option.optionId);
      if (option.reasonCodes.length === 0 || option.encyclopediaRefs.length === 0) {
        errors.push({
          code: "invalid-schema",
          path: `state.m6PolicyEvents.definitions.events[${eventIndex}].options[${optionIndex}]`,
          message: "M6 event option requires reason codes and encyclopedia references."
        });
      }
      option.consequences.forEach((consequence, consequenceIndex) => {
        if (!policyIds.has(consequence.policyId)) {
          errors.push({
            code: "bad-reference",
            path: `state.m6PolicyEvents.definitions.events[${eventIndex}].options[${optionIndex}].consequences[${consequenceIndex}].policyId`,
            message: "M6 event consequence references missing policy definition."
          });
        }
      });
    });
  });

  const activeInstanceIds = new Set<number>();
  runtime.activeEvents.forEach((event, index) => {
    if (activeInstanceIds.has(event.eventInstanceId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6PolicyEvents.activeEvents",
        message: `Duplicate active M6 event instance ${event.eventInstanceId}.`
      });
    }
    activeInstanceIds.add(event.eventInstanceId);
    if (!eventDefinitionIds.has(event.eventDefinitionId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m6PolicyEvents.activeEvents[${index}].eventDefinitionId`,
        message: "M6 active event references missing event definition."
      });
    }
  });

  const resolvedInstanceIds = new Set<number>();
  runtime.resolvedEvents.forEach((event, index) => {
    if (resolvedInstanceIds.has(event.eventInstanceId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6PolicyEvents.resolvedEvents",
        message: `Duplicate resolved M6 event instance ${event.eventInstanceId}.`
      });
    }
    resolvedInstanceIds.add(event.eventInstanceId);
    if (!eventDefinitionIds.has(event.eventDefinitionId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m6PolicyEvents.resolvedEvents[${index}].eventDefinitionId`,
        message: "M6 resolved event references missing event definition."
      });
    }
    if (activeInstanceIds.has(event.eventInstanceId)) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.resolvedEvents[${index}].eventInstanceId`,
        message: "M6 event instance cannot be both active and resolved."
      });
    }
  });

  const modifierIds = new Set<number>();
  runtime.policyModifiers.forEach((modifier, index) => {
    if (modifierIds.has(modifier.modifierId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6PolicyEvents.policyModifiers",
        message: `Duplicate M6 policy modifier ${modifier.modifierId}.`
      });
    }
    modifierIds.add(modifier.modifierId);
    if (!policyIds.has(modifier.policyId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m6PolicyEvents.policyModifiers[${index}].policyId`,
        message: "M6 policy modifier references missing policy definition."
      });
    }
    if (!resolvedInstanceIds.has(modifier.eventInstanceId)) {
      errors.push({
        code: "bad-reference",
        path: `state.m6PolicyEvents.policyModifiers[${index}].eventInstanceId`,
        message: "M6 policy modifier references missing resolved event."
      });
    }
    if (modifier.endDay < modifier.startDay) {
      errors.push({
        code: "invalid-schema",
        path: `state.m6PolicyEvents.policyModifiers[${index}].endDay`,
        message: "M6 policy modifier endDay must be >= startDay."
      });
    }
  });
}

function validatePolityReference(
  polityIds: ReadonlySet<number>,
  polityId: number,
  path: string,
  errors: WorldInvariantError[]
): void {
  if (polityIds.has(polityId)) {
    return;
  }
  errors.push({
    code: "bad-reference",
    path,
    message: `M6 state references missing PolityId ${polityId}.`
  });
}

function validateM6RecognitionAcyclicity(
  edges: readonly M6RecognitionEdgeStateV0[],
  errors: WorldInvariantError[]
): void {
  const nodes = sortNumericIds([
    ...new Set(edges.flatMap((edge) => [edge.fromPolityId, edge.toPolityId]))
  ]);
  for (const node of nodes) {
    if (hasM6RecognitionPath(edges, node, node, new Set<number>())) {
      errors.push({
        code: "invalid-schema",
        path: "state.m6.recognitionEdges",
        message: "M6 recognition graph must be acyclic."
      });
      return;
    }
  }
}

function validateM6AlphaRuntimeState(
  world: WorldStateV0Candidate,
  errors: WorldInvariantError[]
): void {
  const runtime = world.state.m6Alpha;
  if (runtime === undefined || !isM6AlphaRuntimeLike(runtime)) {
    return;
  }

  const polityIds = idsOf(world.definitions.polities);
  const terminalIds = new Set<number>();
  runtime.terminalStates.forEach((terminal, index) => {
    if (terminalIds.has(terminal.terminalStateId)) {
      errors.push({
        code: "duplicate-runtime-state-row",
        path: "state.m6Alpha.terminalStates",
        message: `Duplicate M6 Alpha terminal state row for M6AlphaTerminalStateId ${terminal.terminalStateId}.`
      });
    }
    terminalIds.add(terminal.terminalStateId);
    validatePolityReference(
      polityIds,
      terminal.polityId,
      `state.m6Alpha.terminalStates[${index}].polityId`,
      errors
    );
  });
}

function hasM6RecognitionPath(
  edges: readonly M6RecognitionEdgeStateV0[],
  startPolityId: number,
  targetPolityId: number,
  visitedPolityIds: Set<number>
): boolean {
  if (visitedPolityIds.has(startPolityId)) {
    return false;
  }
  visitedPolityIds.add(startPolityId);
  const outgoing = edges
    .filter((edge) => edge.fromPolityId === startPolityId)
    .sort(
      (left, right) => left.toPolityId - right.toPolityId || left.agreementId - right.agreementId
    );
  for (const edge of outgoing) {
    if (edge.toPolityId === targetPolityId) {
      return true;
    }
    if (hasM6RecognitionPath(edges, edge.toPolityId, targetPolityId, visitedPolityIds)) {
      return true;
    }
  }
  return false;
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

function isM6StateLike(value: unknown): value is M6DiplomacyLegitimacyStateV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value["schemaVersion"] === 1 &&
    Array.isArray(value["relations"]) &&
    Array.isArray(value["agreements"]) &&
    Array.isArray(value["recognitionEdges"]) &&
    Array.isArray(value["legitimacySources"]) &&
    Array.isArray(value["legitimacyProfiles"])
  );
}

function isM6PolicyEventRuntimeLike(value: unknown): value is M6PolicyEventRuntimeStateV0 {
  if (!isRecord(value)) {
    return false;
  }
  const definitions = value["definitions"];
  return (
    value["schemaVersion"] === 1 &&
    isRecord(definitions) &&
    Array.isArray(definitions["policies"]) &&
    Array.isArray(definitions["events"]) &&
    Array.isArray(value["activeEvents"]) &&
    Array.isArray(value["resolvedEvents"]) &&
    Array.isArray(value["policyModifiers"]) &&
    isPositiveInteger(value["nextEventInstanceId"]) &&
    isPositiveInteger(value["nextModifierId"])
  );
}

function isM6AlphaRuntimeLike(value: unknown): value is M6AlphaRuntimeStateV0 {
  if (!isRecord(value)) {
    return false;
  }
  return value["schemaVersion"] === 1 && Array.isArray(value["terminalStates"]);
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

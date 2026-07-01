import { parseGameCommandV1, type AuthoritativeGameCommandV1 } from "@monsoon/protocol";

type GameCommandV1 = AuthoritativeGameCommandV1;

export const SAVE_ENVELOPE_V1_MAGIC = "MONSOON_SOVEREIGNS_SAVE";
export const SAVE_ENVELOPE_V1_SCHEMA_VERSION = 1;
export const SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM = "fnv1a32-save-body-v1";
export const SAVE_ENVELOPE_V1_HASH_ALGORITHM = "fnv1a32-canonical-world-state-v0";

const DEFAULT_MAX_SAVE_BYTES = 1_048_576;
const DEFAULT_MAX_JSON_DEPTH = 32;
const MAX_TAIL_COUNT = 32;
const FNV1A32_OFFSET = 2_166_136_261;
const FNV1A32_PRIME = 16_777_619;

export interface SaveBuildMetadataV1 {
  readonly appVersion: string;
  readonly source: "node-runner" | "test" | "worker";
  readonly codecVersion: "save-envelope-v1";
}

export interface SaveHeaderV1 {
  readonly magic: typeof SAVE_ENVELOPE_V1_MAGIC;
  readonly schemaVersion: typeof SAVE_ENVELOPE_V1_SCHEMA_VERSION;
  readonly build: SaveBuildMetadataV1;
  readonly contentManifestHash: string;
  readonly scenarioId: string;
  readonly seed: number;
  readonly currentDay: number;
  readonly checksumAlgorithm: typeof SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM;
  readonly checksum: string;
}

export interface SaveWorldMetaV0Dto {
  readonly schemaVersion: 0;
  readonly seed: number;
  readonly contentManifestHash: string;
  readonly currentDay: number;
  readonly revision: number;
  readonly hashAlgorithm: typeof SAVE_ENVELOPE_V1_HASH_ALGORITHM;
  readonly stateHash: string;
}

export interface SaveSimpleDefinitionDto {
  readonly id: number;
  readonly displayNameKey: string;
}

export interface SaveSettlementDefinitionDto extends SaveSimpleDefinitionDto {
  readonly districtId: number;
}

export interface SaveRouteDefinitionDto {
  readonly id: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly lengthInMapUnits: number;
}

export type SaveMapTopologyRouteModeV1Dto = "coast" | "river" | "road";
export type SaveMapTopologyTerrainClassV1Dto =
  | "coastal"
  | "lowland"
  | "pass"
  | "riverine"
  | "upland"
  | "urban"
  | "unknown";
export type SaveMapTopologyRiskClassV1Dto =
  | "contested"
  | "hazardous"
  | "low"
  | "seasonal"
  | "unknown";
export type SaveMapTopologyHistoricityTagV1Dto =
  | "COMPOSITE"
  | "FICTIONAL"
  | "HISTORICAL"
  | "INFERRED";
export type SaveMapTopologyRouteNodeKindV1Dto = "pass" | "port" | "special" | "warehouse";

export interface SaveMapTopologyPointV1Dto {
  readonly x: number;
  readonly y: number;
}

export interface SaveMapTopologyMetadataV1Dto {
  readonly historicity: SaveMapTopologyHistoricityTagV1Dto;
  readonly terrainClass: SaveMapTopologyTerrainClassV1Dto;
  readonly riskClass: SaveMapTopologyRiskClassV1Dto;
}

export interface SaveMapTopologyDistrictDefinitionV1Dto {
  readonly districtId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly anchor: SaveMapTopologyPointV1Dto;
  readonly polygon: readonly SaveMapTopologyPointV1Dto[];
  readonly metadata: SaveMapTopologyMetadataV1Dto;
}

export interface SaveMapTopologyRouteNodeDefinitionV1Dto {
  readonly nodeId: string;
  readonly nodeKind: SaveMapTopologyRouteNodeKindV1Dto;
  readonly districtId: number;
  readonly displayNameKey: string;
  readonly anchor: SaveMapTopologyPointV1Dto;
}

export type SaveMapTopologyRouteEndpointV1Dto =
  | { readonly kind: "district"; readonly districtId: number }
  | { readonly kind: "route-node"; readonly nodeId: string }
  | { readonly kind: "settlement"; readonly settlementId: number };

export interface SaveMapTopologySeasonalModifierV1Dto {
  readonly month: number;
  readonly costMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly reasonCodes: readonly string[];
}

export type SaveMapTopologyRouteAvailabilityV1Dto =
  | { readonly kind: "blocked"; readonly reasonCode: string }
  | { readonly kind: "open" }
  | { readonly kind: "unknown"; readonly reasonCode: string };

export interface SaveMapTopologyRouteEdgeDefinitionV1Dto {
  readonly routeId: number;
  readonly sourceId: string;
  readonly from: SaveMapTopologyRouteEndpointV1Dto;
  readonly to: SaveMapTopologyRouteEndpointV1Dto;
  readonly mode: SaveMapTopologyRouteModeV1Dto;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly seasonality: readonly SaveMapTopologySeasonalModifierV1Dto[];
  readonly availability: SaveMapTopologyRouteAvailabilityV1Dto;
  readonly metadata: SaveMapTopologyMetadataV1Dto;
}

export interface SaveMapTopologyDefinitionV1Dto {
  readonly schemaVersion: 1;
  readonly hashAlgorithm: "fnv1a32-canonical-map-topology-v1";
  readonly topologyHash: string;
  readonly contentManifestHash: string;
  readonly districts: readonly SaveMapTopologyDistrictDefinitionV1Dto[];
  readonly routeNodes: readonly SaveMapTopologyRouteNodeDefinitionV1Dto[];
  readonly routeEdges: readonly SaveMapTopologyRouteEdgeDefinitionV1Dto[];
}

export type SaveStrategicTerrainHistoricityTagV1Dto =
  | "COMPOSITE"
  | "FICTIONAL"
  | "HISTORICAL"
  | "INFERRED";
export type SaveStrategicTerrainClassV1Dto =
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
export type SaveStrategicTerrainRiskClassV1Dto =
  | "contested"
  | "hazardous"
  | "low"
  | "seasonal"
  | "unknown";
export type SaveStrategicTerrainSeasonStateV1Dto = "dry" | "monsoon" | "transition" | "unknown";
export type SaveBarrierChannelKindV1Dto = "coast" | "major-river" | "ridge" | "strait" | "wetland";
export type SaveStrategicNodeKindV1Dto =
  | "castle"
  | "crossing"
  | "objective"
  | "pass"
  | "port"
  | "staging-area"
  | "town"
  | "warehouse";
export type SaveStrategicNodeKnownStateV1Dto = "known" | "rumored" | "unknown";
export type SaveRouteCorridorModeV1Dto = "coast" | "mixed" | "pass" | "river" | "road";
export type SaveRouteCorridorWidthClassV1Dto = "narrow" | "standard" | "wide";
export type SaveStrategicTerrainAuthorityProhibitionV1Dto =
  | "bounding-box-adjacency"
  | "centroid-proximity"
  | "hidden-grid"
  | "hidden-lattice"
  | "hex-axial-or-cube"
  | "renderer-only-line-reachability"
  | "sequential-id-reachability";

export interface SaveStrategicTerrainPointV1Dto {
  readonly x: number;
  readonly y: number;
}

export interface SaveTerrainPatchDefinitionV1Dto {
  readonly patchId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly terrainClass: SaveStrategicTerrainClassV1Dto;
  readonly seasonSensitivity: SaveStrategicTerrainSeasonStateV1Dto;
  readonly historicity: SaveStrategicTerrainHistoricityTagV1Dto;
  readonly polygon: readonly SaveStrategicTerrainPointV1Dto[];
  readonly explanationTags: readonly string[];
}

export interface SaveBarrierChannelDefinitionV1Dto {
  readonly channelId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly channelKind: SaveBarrierChannelKindV1Dto;
  readonly traversalRule: "blocks-without-explicit-corridor" | "channels-explicit-corridors";
  readonly historicity: SaveStrategicTerrainHistoricityTagV1Dto;
  readonly points: readonly SaveStrategicTerrainPointV1Dto[];
  readonly explanationTags: readonly string[];
}

export interface SaveStrategicNodeDefinitionV1Dto {
  readonly nodeId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly nodeKind: SaveStrategicNodeKindV1Dto;
  readonly districtId: number;
  readonly anchor: SaveStrategicTerrainPointV1Dto;
  readonly localCapacity: number;
  readonly knownState: SaveStrategicNodeKnownStateV1Dto;
  readonly terrainPatchIds: readonly string[];
  readonly barrierChannelIds: readonly string[];
  readonly governanceFootprintIds: readonly string[];
  readonly explanationTags: readonly string[];
}

export interface SaveRouteCorridorSeasonalModifierV1Dto {
  readonly month: number;
  readonly seasonState: SaveStrategicTerrainSeasonStateV1Dto;
  readonly travelCostMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
}

export type SaveRouteCorridorAvailabilityV1Dto =
  | { readonly kind: "blocked"; readonly reasonCode: string }
  | { readonly kind: "open" }
  | { readonly kind: "unknown"; readonly reasonCode: string };

export interface SaveRouteCorridorDefinitionV1Dto {
  readonly corridorId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly mode: SaveRouteCorridorModeV1Dto;
  readonly widthClass: SaveRouteCorridorWidthClassV1Dto;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly riskClass: SaveStrategicTerrainRiskClassV1Dto;
  readonly terrainPatchIds: readonly string[];
  readonly barrierChannelIds: readonly string[];
  readonly governanceFootprintIds: readonly string[];
  readonly seasonality: readonly SaveRouteCorridorSeasonalModifierV1Dto[];
  readonly availability: SaveRouteCorridorAvailabilityV1Dto;
  readonly polyline: readonly SaveStrategicTerrainPointV1Dto[];
  readonly explanationTags: readonly string[];
}

export interface SaveDistrictGovernanceFootprintDefinitionV1Dto {
  readonly footprintId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly districtId: number;
  readonly overlayOnly: true;
  readonly polygon: readonly SaveStrategicTerrainPointV1Dto[];
  readonly governanceTags: readonly string[];
  readonly consequenceTags: readonly string[];
}

export interface SaveStrategicTerrainDefinitionV1Dto {
  readonly schemaVersion: 1;
  readonly hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1";
  readonly strategicTerrainHash: string;
  readonly contentManifestHash: string;
  readonly authority: "terrain-route-node-v1";
  readonly governanceFootprintRole: "overlay-only";
  readonly authorityProhibitions: readonly SaveStrategicTerrainAuthorityProhibitionV1Dto[];
  readonly terrainPatches: readonly SaveTerrainPatchDefinitionV1Dto[];
  readonly barrierChannels: readonly SaveBarrierChannelDefinitionV1Dto[];
  readonly strategicNodes: readonly SaveStrategicNodeDefinitionV1Dto[];
  readonly routeCorridors: readonly SaveRouteCorridorDefinitionV1Dto[];
  readonly districtGovernanceFootprints: readonly SaveDistrictGovernanceFootprintDefinitionV1Dto[];
}

export interface SaveWorldDefinitionsV0Dto {
  readonly polities: readonly SaveSimpleDefinitionDto[];
  readonly persons: readonly SaveSimpleDefinitionDto[];
  readonly districts: readonly SaveSimpleDefinitionDto[];
  readonly settlements: readonly SaveSettlementDefinitionDto[];
  readonly routes: readonly SaveRouteDefinitionDto[];
  readonly topology?: SaveMapTopologyDefinitionV1Dto;
  readonly strategicTerrain?: SaveStrategicTerrainDefinitionV1Dto;
}

export interface SaveSimpleRuntimeStateDto {
  readonly definitionId: number;
}

export interface SavePersonStateDto extends SaveSimpleRuntimeStateDto {
  readonly currentDistrictId: number | null;
}

export type SaveDistrictControlDto =
  | { readonly kind: "controlled"; readonly controllerPolityId: number }
  | { readonly kind: "uncontrolled" };

export interface SaveDistrictStateDto extends SaveSimpleRuntimeStateDto {
  readonly control: SaveDistrictControlDto;
}

export interface SaveSettlementStateDto extends SaveSimpleRuntimeStateDto {
  readonly currentDistrictId: number;
}

export type SaveM2AgriculturePhaseDto = "fallow" | "planting" | "growing" | "harvest";
export type SaveM2LaborCommitmentPurposeDto = "mobilized";
export type SaveM2RouteKindDto = "coast" | "river" | "road";

export interface SaveM2LaborCommitmentStateDto {
  readonly purpose: SaveM2LaborCommitmentPurposeDto;
  readonly laborAmount: number;
  readonly startDay: number;
  readonly releaseDay: number;
}

export interface SaveM2PopulationGroupStateDto {
  readonly id: number;
  readonly districtId: number;
  readonly totalPeople: number;
  readonly workingPeople: number;
  readonly dependentPeople: number;
  readonly availableLabor: number;
  readonly grainStock: number;
  readonly cashStock: number;
  readonly committedLabor: readonly SaveM2LaborCommitmentStateDto[];
}

export interface SaveM2DistrictAgricultureStateDto {
  readonly districtId: number;
  readonly phase: SaveM2AgriculturePhaseDto;
  readonly daysInPhase: number;
  readonly accumulatedFarmLabor: number;
  readonly expectedHarvestGrain: number;
  readonly lastHarvestGrain: number;
}

export interface SaveM2DistrictMarketStateDto {
  readonly districtId: number;
  readonly grainPriceCashPerHundred: number;
  readonly cashFlow: {
    readonly cumulativeMobilizationCost: number;
    readonly lastDailyCashDelta: number;
  };
  readonly grainFlow: {
    readonly lastHarvestDelta: number;
  };
}

export interface SaveM2SeasonalMonthStateDto {
  readonly month: number;
  readonly monsoonIntensityBps: number;
  readonly agricultureWorkBps: number;
  readonly riverNavigabilityBps: number;
  readonly roadTravelCostBps: number;
}

export interface SaveM2RegionalSeasonalCurveStateDto {
  readonly id: number;
  readonly monthlyValues: readonly SaveM2SeasonalMonthStateDto[];
}

export interface SaveM2DistrictSeasonalityStateDto {
  readonly districtId: number;
  readonly regionalCurveId: number;
}

export interface SaveM2RouteTransportEdgeStateDto {
  readonly routeId: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly routeKind: SaveM2RouteKindDto;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
}

export interface SaveM2TransportStateDto {
  readonly schemaVersion: 1;
  readonly routes: readonly SaveM2RouteTransportEdgeStateDto[];
  readonly districtSeasonality: readonly SaveM2DistrictSeasonalityStateDto[];
  readonly regionalCurves: readonly SaveM2RegionalSeasonalCurveStateDto[];
}

export interface SaveM2EconomyPopulationStateDto {
  readonly schemaVersion: 1;
  readonly populationGroups: readonly SaveM2PopulationGroupStateDto[];
  readonly agriculture: {
    readonly districts: readonly SaveM2DistrictAgricultureStateDto[];
  };
  readonly market: {
    readonly districts: readonly SaveM2DistrictMarketStateDto[];
  };
  readonly transport: SaveM2TransportStateDto;
}

export type SaveM3ObligationKindDto = "tribute" | "troop";
export type SaveM3ObligationResourceKindDto = "cash" | "grain" | "troops";
export type SaveM3ObligationStatusDto = "active" | "disputed" | "breached";
export type SaveM3ObligationAuditEventKindDto = "created" | "settled" | "status-changed";
export type SaveM3ObligationCategoryDto =
  | "regular-tribute"
  | "extraordinary-levy"
  | "troop-obligation"
  | "defensive-garrison"
  | "specific-war-aid";
export type SaveM3ObligationSettlementActionDto =
  | "fulfillment"
  | "partial-fulfillment"
  | "deferral"
  | "refusal"
  | "remission"
  | "pursuit-recovery"
  | "default-breach";
export type SaveM3TroopResponseStateDto =
  | "none"
  | "committed"
  | "deferred"
  | "refused"
  | "remitted"
  | "recovery-pursued"
  | "breached";
export type SaveM3AdministrativeControlModeDto = "direct" | "vassal" | "tribute-only";
export type SaveM3OfficeKindDto = "commander" | "governor" | "minister";
export type SaveM3OfficeJurisdictionDto =
  | { readonly kind: "polity"; readonly polityId: number }
  | { readonly kind: "district"; readonly districtId: number };
export type SaveM3PolicyStanceDto = "balanced" | "conciliatory" | "extractive" | "military";
export type SaveM3PolicyTargetDto =
  | { readonly kind: "office"; readonly officeId: number }
  | { readonly kind: "polity"; readonly polityId: number }
  | { readonly kind: "district"; readonly districtId: number };
export type SaveM3AppointmentAuditEventKindDto =
  | "appointment"
  | "bulk-appointment"
  | "enfeoffment"
  | "policy-updated";
export type SaveM3SuccessionSupportKindDto =
  | "kinship"
  | "designation"
  | "court"
  | "military"
  | "provincial"
  | "suzerain"
  | "foreign";
export type SaveM3SuccessionTriggerDto =
  | {
      readonly kind: "death";
      readonly characterId: number;
      readonly officeId: number | null;
    }
  | {
      readonly kind: "incapacity";
      readonly characterId: number;
      readonly officeId: number | null;
    }
  | {
      readonly kind: "abdication";
      readonly characterId: number;
      readonly officeId: number | null;
    };
export type SaveM3SuccessionOutcomeDto =
  | {
      readonly kind: "peaceful";
      readonly successorCharacterId: number;
      readonly supportTotalBps: number;
    }
  | {
      readonly kind: "regency";
      readonly successorCharacterId: number;
      readonly regentCharacterId: number;
      readonly supportTotalBps: number;
      readonly reasonCode: string;
    }
  | {
      readonly kind: "disputed";
      readonly leadingCharacterId: number;
      readonly rivalCharacterId: number;
      readonly supportMarginBps: number;
      readonly reasonCode: string;
    };

export interface SaveM3PolityRecordStateDto {
  readonly polityId: number;
  readonly directSuzerainPolityId: number | null;
}

export type SaveM3ObligationRequirementDto =
  | {
      readonly kind: "amount";
      readonly resourceKind: SaveM3ObligationResourceKindDto;
      readonly amount: number;
    }
  | {
      readonly kind: "condition";
      readonly conditionKey: string;
    };

export type SaveM3ObligationDueDto =
  | {
      readonly kind: "cadence";
      readonly periodDays: number;
      readonly nextDueDay: number;
    }
  | {
      readonly kind: "trigger";
      readonly triggerKey: string;
    };

export interface SaveM3ObligationSourceStateDto {
  readonly kind: "vassalage";
  readonly sourceId: string;
  readonly debtorPolityId: number;
  readonly creditorPolityId: number;
}

export interface SaveM3ObligationAccountingStateDto {
  readonly nominalAmount: number;
  readonly dueAmount: number;
  readonly deliveredAmount: number;
  readonly arrearsAmount: number;
  readonly defaultedAmount: number;
  readonly remittedAmount: number;
  readonly dueDay: number;
  readonly cycle: number;
  readonly troopResponseState: SaveM3TroopResponseStateDto;
}

export interface SaveM3ObligationStateDto {
  readonly id: number;
  readonly debtorPolityId: number;
  readonly creditorPolityId: number;
  readonly obligationKind: SaveM3ObligationKindDto;
  readonly obligationCategory: SaveM3ObligationCategoryDto;
  readonly obligationSource: SaveM3ObligationSourceStateDto;
  readonly requirement: SaveM3ObligationRequirementDto;
  readonly due: SaveM3ObligationDueDto;
  readonly accounting: SaveM3ObligationAccountingStateDto;
  readonly status: SaveM3ObligationStatusDto;
  readonly disputeReasonCode: string | null;
  readonly breachReasonCode: string | null;
  readonly createdAuditEventId: number;
  readonly latestAuditEventId: number;
}

export interface SaveM3ObligationAuditEventStateDto {
  readonly id: number;
  readonly obligationId: number;
  readonly eventKind: SaveM3ObligationAuditEventKindDto;
  readonly eventDay: number;
  readonly eventRevision: number;
  readonly commandId: string;
  readonly actor: {
    readonly kind: "ai" | "player" | "system";
    readonly id: string;
  };
  readonly actionKind: SaveM3ObligationSettlementActionDto | null;
  readonly dueDay: number | null;
  readonly fulfillmentId: number | null;
  readonly fulfilledAmount: number | null;
  readonly statusAfter: SaveM3ObligationStatusDto;
  readonly reasonCode: string | null;
  readonly reasonCodes: readonly string[];
  readonly reliabilityBps: number;
}

export type SaveM3FulfillmentSourceMovementStateDto =
  | {
      readonly kind: "m2-population-group";
      readonly populationGroupId: number;
      readonly districtId: number;
      readonly resourceKind: "cash" | "grain";
      readonly amount: number;
    }
  | {
      readonly kind: "m3-troop-commitment-placeholder";
      readonly debtorPolityId: number;
      readonly headcount: number;
    };

export interface SaveM3FulfillmentClaimStateDto {
  readonly fulfillmentId: number;
  readonly obligationId: number;
  readonly auditEventId: number;
  readonly actionKind: SaveM3ObligationSettlementActionDto;
  readonly dueDay: number;
  readonly fulfilledAmount: number;
  readonly deliveredAmount: number;
  readonly arrearsAmount: number;
  readonly defaultedAmount: number;
  readonly reasonCode: string;
  readonly sourceMovements: readonly SaveM3FulfillmentSourceMovementStateDto[];
}

export interface SaveM3AdministrativeDistrictStateDto {
  readonly polityId: number;
  readonly districtId: number;
  readonly controlMode: SaveM3AdministrativeControlModeDto;
  readonly localComplexity: number;
  readonly communicationCost: number;
  readonly directness: number;
  readonly frontierPressure: number;
  readonly administrativeCapacity: number;
}

export interface SaveM3CharacterStateDto {
  readonly characterId: number;
  readonly polityId: number;
  readonly alive: boolean;
  readonly incapacitated: boolean;
  readonly currentDistrictId: number;
  readonly commandBps: number;
  readonly administrationBps: number;
  readonly diplomacyBps: number;
}

export interface SaveM3CharacterRelationshipStateDto {
  readonly sourceCharacterId: number;
  readonly targetCharacterId: number;
  readonly affinityBps: number;
}

export interface SaveM3OfficeStateDto {
  readonly officeId: number;
  readonly polityId: number;
  readonly jurisdiction: SaveM3OfficeJurisdictionDto;
  readonly officeKind: SaveM3OfficeKindDto;
  readonly primary: boolean;
  readonly holderCharacterId: number | null;
  readonly policyId: number;
  readonly minimumCommandBps: number;
  readonly minimumAdministrationBps: number;
}

export interface SaveM3PolicyStateDto {
  readonly policyId: number;
  readonly target: SaveM3PolicyTargetDto;
  readonly stance: SaveM3PolicyStanceDto;
  readonly intensityBps: number;
}

export interface SaveM3EnfeoffmentStateDto {
  readonly districtId: number;
  readonly holderCharacterId: number;
  readonly grantedByPolityId: number;
  readonly policyId: number;
  readonly grantedDay: number;
  readonly reasonCode: string;
}

export interface SaveM3AppointmentAuditEventStateDto {
  readonly id: number;
  readonly eventKind: SaveM3AppointmentAuditEventKindDto;
  readonly eventDay: number;
  readonly eventRevision: number;
  readonly commandId: string;
  readonly actor: {
    readonly kind: "ai" | "player" | "system";
    readonly id: string;
  };
  readonly officeId: number | null;
  readonly characterId: number | null;
  readonly policyId: number | null;
  readonly districtId: number | null;
  readonly reasonCode: string;
}

export interface SaveM3SuccessionSupportSourceStateDto {
  readonly kind: SaveM3SuccessionSupportKindDto;
  readonly strengthBps: number;
  readonly sourceId: string;
}

export interface SaveM3SuccessionCandidateProfileStateDto {
  readonly polityId: number;
  readonly characterId: number;
  readonly requiresRegency: boolean;
  readonly supportSources: readonly SaveM3SuccessionSupportSourceStateDto[];
}

export interface SaveM3SuccessionCandidateStateDto {
  readonly characterId: number;
  readonly requiresRegency: boolean;
  readonly supportSources: readonly SaveM3SuccessionSupportSourceStateDto[];
  readonly supportTotalBps: number;
}

export interface SaveM3SuccessionCrisisStateDto {
  readonly id: number;
  readonly polityId: number;
  readonly trigger: SaveM3SuccessionTriggerDto;
  readonly status: "pending" | "resolved";
  readonly startedDay: number;
  readonly resolvedDay: number | null;
  readonly candidates: readonly SaveM3SuccessionCandidateStateDto[];
  readonly outcome: SaveM3SuccessionOutcomeDto | null;
  readonly reasonCode: string;
}

export interface SaveM3PolityVassalageStateDto {
  readonly schemaVersion: 1;
  readonly polities: readonly SaveM3PolityRecordStateDto[];
  readonly obligations: readonly SaveM3ObligationStateDto[];
  readonly obligationAuditEvents: readonly SaveM3ObligationAuditEventStateDto[];
  readonly fulfillmentClaims: readonly SaveM3FulfillmentClaimStateDto[];
  readonly administrativeDistricts: readonly SaveM3AdministrativeDistrictStateDto[];
  readonly characters: readonly SaveM3CharacterStateDto[];
  readonly relationships: readonly SaveM3CharacterRelationshipStateDto[];
  readonly offices: readonly SaveM3OfficeStateDto[];
  readonly policies: readonly SaveM3PolicyStateDto[];
  readonly enfeoffments: readonly SaveM3EnfeoffmentStateDto[];
  readonly appointmentAuditEvents: readonly SaveM3AppointmentAuditEventStateDto[];
  readonly successionCandidateProfiles: readonly SaveM3SuccessionCandidateProfileStateDto[];
  readonly successionCrises: readonly SaveM3SuccessionCrisisStateDto[];
}

export interface SaveM4CampaignStateDto {
  readonly schemaVersion: 1;
  readonly campaignPlans: readonly SaveM4CampaignPlanStateDto[];
  readonly factionKnowledgeSnapshots: readonly SaveM4FactionKnowledgeSnapshotStateDto[];
  readonly mobilizedForceCommitments: readonly SaveM4MobilizedForceCommitmentStateDto[];
  readonly grainSupplyReservations: readonly SaveM4GrainSupplyReservationStateDto[];
  readonly marches: readonly SaveM4CampaignMarchStateDto[];
  readonly fieldEngagements: readonly SaveM4FieldEngagementStateDto[];
  readonly sieges: readonly SaveM4SiegeStateDto[];
  readonly withdrawals: readonly SaveM4WithdrawalStateDto[];
  readonly warOutcomes: readonly SaveM4WarOutcomeStateDto[];
  readonly postwarCandidates: readonly SaveM4PostwarCandidateStateDto[];
}

export type SaveM6DiplomaticAgreementKindDto =
  | "non-aggression"
  | "military-access"
  | "tribute-recognition";
export type SaveM6DiplomaticAgreementStatusDto = "proposed" | "active" | "rejected";
export type SaveM6DiplomaticRecognitionDirectionDto =
  | "none"
  | "proposer-recognizes-target"
  | "target-recognizes-proposer";
export type SaveM6LegitimacyAudienceDto =
  | "court"
  | "local-lords"
  | "military-retinue"
  | "merchants"
  | "ritual-network"
  | "vassal-rulers"
  | "foreign-courts";
export type SaveM6LegitimacySourceKindDto =
  | "diplomatic-recognition"
  | "obligation-fulfilled"
  | "obligation-breached"
  | "succession-continuity"
  | "postwar-settlement"
  | "campaign-consequence";

export interface SaveM6DiplomaticRelationStateDto {
  readonly relationId: number;
  readonly polityAId: number;
  readonly polityBId: number;
  readonly trustBps: number;
  readonly affinityBps: number;
  readonly fearBps: number;
  readonly threatBps: number;
  readonly interestAlignmentBps: number;
  readonly historicalDebt: number;
  readonly borderConflictBps: number;
  readonly updatedDay: number;
  readonly reasonCodes: readonly string[];
}

export interface SaveM6DiplomaticAgreementStateDto {
  readonly agreementId: number;
  readonly relationId: number;
  readonly proposerPolityId: number;
  readonly targetPolityId: number;
  readonly agreementKind: SaveM6DiplomaticAgreementKindDto;
  readonly status: SaveM6DiplomaticAgreementStatusDto;
  readonly startDay: number;
  readonly endDay: number;
  readonly recognitionDirection: SaveM6DiplomaticRecognitionDirectionDto;
  readonly reasonCodes: readonly string[];
}

export interface SaveM6RecognitionEdgeStateDto {
  readonly fromPolityId: number;
  readonly toPolityId: number;
  readonly agreementId: number;
  readonly reasonCode: string;
}

export interface SaveM6LegitimacySourceStateDto {
  readonly sourceId: number;
  readonly polityId: number;
  readonly audience: SaveM6LegitimacyAudienceDto;
  readonly sourceKind: SaveM6LegitimacySourceKindDto;
  readonly magnitudeBps: number;
  readonly sourceRef: string;
  readonly reasonCode: string;
  readonly createdDay: number;
}

export interface SaveM6LegitimacyProfileStateDto {
  readonly polityId: number;
  readonly audience: SaveM6LegitimacyAudienceDto;
  readonly scoreBps: number;
  readonly pressureBps: number;
  readonly sourceIds: readonly number[];
  readonly reasonCodes: readonly string[];
}

export interface SaveM6DiplomacyLegitimacyStateDto {
  readonly schemaVersion: 1;
  readonly relations: readonly SaveM6DiplomaticRelationStateDto[];
  readonly agreements: readonly SaveM6DiplomaticAgreementStateDto[];
  readonly recognitionEdges: readonly SaveM6RecognitionEdgeStateDto[];
  readonly legitimacySources: readonly SaveM6LegitimacySourceStateDto[];
  readonly legitimacyProfiles: readonly SaveM6LegitimacyProfileStateDto[];
}

export interface SaveM6PolicyDefinitionStateDto {
  readonly policyId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface SaveM6PolicyEventCauseStateDto {
  readonly kind: "day-at-least";
  readonly day: number;
  readonly reasonCodes: readonly string[];
}

export interface SaveM6PolicyEventConsequenceStateDto {
  readonly kind: "policy-modifier";
  readonly policyId: number;
  readonly magnitudeBps: number;
  readonly durationDays: number;
  readonly reasonCode: string;
}

export interface SaveM6PolicyEventOptionStateDto {
  readonly optionId: number;
  readonly displayNameKey: string;
  readonly consequences: readonly SaveM6PolicyEventConsequenceStateDto[];
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface SaveM6PolicyEventDefinitionStateDto {
  readonly eventDefinitionId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly cause: SaveM6PolicyEventCauseStateDto;
  readonly options: readonly SaveM6PolicyEventOptionStateDto[];
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface SaveM6PolicyEventRuntimeStateDto {
  readonly schemaVersion: 1;
  readonly definitions: {
    readonly policies: readonly SaveM6PolicyDefinitionStateDto[];
    readonly events: readonly SaveM6PolicyEventDefinitionStateDto[];
  };
  readonly activeEvents: readonly {
    readonly eventInstanceId: number;
    readonly eventDefinitionId: number;
    readonly activatedDay: number;
    readonly causeReasonCodes: readonly string[];
  }[];
  readonly resolvedEvents: readonly {
    readonly eventInstanceId: number;
    readonly eventDefinitionId: number;
    readonly selectedOptionId: number;
    readonly resolvedDay: number;
    readonly reasonCodes: readonly string[];
  }[];
  readonly policyModifiers: readonly {
    readonly modifierId: number;
    readonly policyId: number;
    readonly eventInstanceId: number;
    readonly magnitudeBps: number;
    readonly startDay: number;
    readonly endDay: number;
    readonly reasonCode: string;
  }[];
  readonly nextEventInstanceId: number;
  readonly nextModifierId: number;
}

export type SaveM6AlphaTerminalOutcomeDto = "victory" | "defeat" | "continued-play";

export interface SaveM6AlphaTerminalEvidenceStateDto {
  readonly recognizedByCount: number;
  readonly legitimacyScoreBps: number;
  readonly postwarArrangementCount: number;
  readonly resolvedPolicyEventCount: number;
  readonly successionResolvedCount: number;
  readonly routeCount: number;
  readonly populationGroupCount: number;
}

export interface SaveM6AlphaTerminalStateDto {
  readonly terminalStateId: number;
  readonly polityId: number;
  readonly outcome: SaveM6AlphaTerminalOutcomeDto;
  readonly evaluatedDay: number;
  readonly evaluatedRevision: number;
  readonly maxDay: number;
  readonly evidence: SaveM6AlphaTerminalEvidenceStateDto;
  readonly reasonCodes: readonly string[];
}

export interface SaveM6AlphaRuntimeStateDto {
  readonly schemaVersion: 1;
  readonly terminalStates: readonly SaveM6AlphaTerminalStateDto[];
}

export type SaveM4CampaignObjectiveKindDto =
  | "prepare"
  | "march"
  | "besiege"
  | "relieve"
  | "withdraw"
  | "postwar-result-candidate";
export type SaveM4CampaignPlanStatusDto = "planned" | "active" | "cancelled" | "completed";
export type SaveM4CampaignOwnerDto =
  | { readonly kind: "commander"; readonly characterId: number }
  | { readonly kind: "polity"; readonly polityId: number };
export type SaveM4CampaignTargetDto =
  | { readonly kind: "district"; readonly districtId: number }
  | { readonly kind: "polity"; readonly polityId: number };

export interface SaveM4CampaignStartWindowDto {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface SaveM4CampaignPlanStateDto {
  readonly id: number;
  readonly owner: SaveM4CampaignOwnerDto;
  readonly target: SaveM4CampaignTargetDto;
  readonly objectiveKind: SaveM4CampaignObjectiveKindDto;
  readonly startWindow: SaveM4CampaignStartWindowDto;
  readonly status: SaveM4CampaignPlanStatusDto;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly createdDay: number;
  readonly updatedDay: number;
}

export type SaveM4MusterCommitmentStatusDto =
  | "promised"
  | "assembled"
  | "delayed"
  | "refused"
  | "released";

export interface SaveM4MusterAssemblyWindowDto {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface SaveM4MusterCommitmentSourceDto {
  readonly kind: "m3-obligation";
  readonly obligationId: number;
  readonly debtorPolityId: number;
  readonly creditorPolityId: number;
}

export type SaveM4MusterLocalCostHookDto =
  | {
      readonly kind: "economic-labor-reservation";
      readonly districtId: number;
      readonly laborAmount: number;
      readonly reasonCode: string;
    }
  | {
      readonly kind: "loyalty-pressure";
      readonly polityId: number;
      readonly pressureBps: number;
      readonly reasonCode: string;
    };

export interface SaveM4MobilizedForceCommitmentStateDto {
  readonly id: number;
  readonly campaignPlanId: number;
  readonly source: SaveM4MusterCommitmentSourceDto;
  readonly promisedTroops: number;
  readonly dueDay: number;
  readonly assemblyWindow: SaveM4MusterAssemblyWindowDto;
  readonly plannedAssemblyDay: number;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
  readonly releasedTroops: number;
  readonly status: SaveM4MusterCommitmentStatusDto;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly localCostHooks: readonly SaveM4MusterLocalCostHookDto[];
}

export interface SaveM4GrainSupplySourceDto {
  readonly kind: "m2-population-group";
  readonly populationGroupId: number;
  readonly districtId: number;
}

export type SaveM4GrainSupplyReservationStatusDto =
  | "reserved"
  | "partially-consumed"
  | "shortage"
  | "consumed"
  | "released";

export interface SaveM4GrainSupplyReservationStateDto {
  readonly reservationId: number;
  readonly campaignPlanId: number;
  readonly source: SaveM4GrainSupplySourceDto;
  readonly reservedAmount: number;
  readonly carriedAmount: number;
  readonly consumedAmount: number;
  readonly shortageAmount: number;
  readonly lossAmount: number;
  readonly lossReasonCode: string | null;
  readonly expectedDailyConsumption: number;
  readonly expectedDaysOfSupply: number;
  readonly status: SaveM4GrainSupplyReservationStatusDto;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
}

export type SaveM4CampaignMarchStatusDto =
  | "planned"
  | "marching"
  | "paused"
  | "delayed"
  | "cancelled"
  | "arrived";
export type SaveM4CampaignMarchSupplyStatusDto =
  | "well-supplied"
  | "strained"
  | "hungry"
  | "out-of-supply";

export interface SaveM4CampaignMarchRouteSegmentStateDto {
  readonly routeId: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly travelDays: number;
  readonly capacity: number;
  readonly seasonRiskReasonCodes: readonly string[];
}

export interface SaveM4CampaignMarchSupplyStateDto {
  readonly status: SaveM4CampaignMarchSupplyStatusDto;
  readonly carriedGrain: number;
  readonly consumedGrain: number;
  readonly shortageGrain: number;
  readonly delayedDays: number;
}

export interface SaveM4CampaignMarchJoinedCommitmentTroopsStateDto {
  readonly commitmentId: number;
  readonly joinedTroops: number;
}

export interface SaveM4CampaignMarchStateDto {
  readonly marchId: number;
  readonly campaignPlanId: number;
  readonly originDistrictId: number;
  readonly targetDistrictId: number;
  readonly currentDistrictId: number;
  readonly routeSegments: readonly SaveM4CampaignMarchRouteSegmentStateDto[];
  readonly currentSegmentIndex: number;
  readonly progressOnSegmentDays: number;
  readonly activeTroops: number;
  readonly grainPerTroopPerDay: number;
  readonly supply: SaveM4CampaignMarchSupplyStateDto;
  readonly status: SaveM4CampaignMarchStatusDto;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly startedDay: number;
  readonly updatedDay: number;
  readonly predictedArrivalWindow: SaveM4CampaignStartWindowDto;
  readonly actualArrivalDay: number | null;
  readonly joinedCommitmentIds: readonly number[];
  readonly joinedCommitmentTroops: readonly SaveM4CampaignMarchJoinedCommitmentTroopsStateDto[];
  readonly failedCommitmentIds: readonly number[];
}

export type SaveM4FieldEngagementOutcomeDto = "attacker-victory" | "defender-holds";

export interface SaveM4CampaignHookStateDto {
  readonly polityId: number;
  readonly amount: number;
  readonly reasonCode: string;
}

export interface SaveM4FieldEngagementStateDto {
  readonly engagementId: number;
  readonly campaignPlanId: number;
  readonly marchId: number;
  readonly attackerPolityId: number;
  readonly defenderPolityId: number;
  readonly target: SaveM4CampaignTargetDto;
  readonly attackerTroopsBefore: number;
  readonly attackerTroopsAfter: number;
  readonly defenderEstimatedTroopsBefore: number;
  readonly defenderEstimatedTroopsAfter: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly defenderFortification: number;
  readonly outcome: SaveM4FieldEngagementOutcomeDto;
  readonly reasonCodes: readonly string[];
  readonly creditHooks: readonly SaveM4CampaignHookStateDto[];
  readonly reputationHooks: readonly SaveM4CampaignHookStateDto[];
  readonly resolvedDay: number;
}

export type SaveM4SiegeChoiceDto =
  | "invest-blockade"
  | "assault"
  | "continue"
  | "accept-surrender"
  | "lift-siege"
  | "withdraw";
export type SaveM4SiegeStatusDto =
  | "blockading"
  | "surrender-ready"
  | "surrendered"
  | "lifted"
  | "withdrawn";

export interface SaveM4SiegeStateDto {
  readonly siegeId: number;
  readonly campaignPlanId: number;
  readonly marchId: number;
  readonly targetDistrictId: number;
  readonly attackerPolityId: number;
  readonly defenderPolityId: number;
  readonly status: SaveM4SiegeStatusDto;
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
  readonly creditHooks: readonly SaveM4CampaignHookStateDto[];
  readonly reputationHooks: readonly SaveM4CampaignHookStateDto[];
  readonly startedDay: number;
  readonly updatedDay: number;
}

export type SaveM4WithdrawalKindDto =
  | "orderly-withdrawal"
  | "forced-retreat"
  | "cancelled-before-departure"
  | "failed-extraction";
export type SaveM4WithdrawalTriggerDto =
  | "ordered"
  | "supply"
  | "season"
  | "siege"
  | "loss"
  | "objective-complete";

export interface SaveM4WithdrawalStateDto {
  readonly withdrawalId: number;
  readonly campaignPlanId: number;
  readonly marchId: number | null;
  readonly siegeId: number | null;
  readonly kind: SaveM4WithdrawalKindDto;
  readonly triggerReason: SaveM4WithdrawalTriggerDto;
  readonly troopsBefore: number;
  readonly troopsExtracted: number;
  readonly casualties: number;
  readonly supplyLoss: number;
  readonly creditHooks: readonly SaveM4CampaignHookStateDto[];
  readonly reputationHooks: readonly SaveM4CampaignHookStateDto[];
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export type SaveM4PostwarMethodDto = "direct-control" | "restore-vassal-ruler" | "tribute-only";

export interface SaveM4PostwarCandidateStateDto {
  readonly candidateId: string;
  readonly sourceWarOutcomeId: number;
  readonly settlementId: string;
  readonly victorPolityId: number;
  readonly localPolityId: number;
  readonly districtId: number;
  readonly validM3Methods: readonly SaveM4PostwarMethodDto[];
  readonly reasonCodes: readonly string[];
}

export interface SaveM4WarOutcomeStateDto {
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
  readonly postwarCandidate: SaveM4PostwarCandidateStateDto | null;
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export type SaveM4FactionKnowledgeSourceKindDto = "scout" | "merchant" | "envoy" | "report";

export interface SaveM4FactionKnowledgeSourceDto {
  readonly kind: SaveM4FactionKnowledgeSourceKindDto;
  readonly sourceId: string;
  readonly reliabilityBps: number;
}

export interface SaveM4KnownObjectiveEstimateDto {
  readonly campaignPlanId: number;
  readonly target: SaveM4CampaignTargetDto;
  readonly objectiveKind: SaveM4CampaignObjectiveKindDto;
  readonly confidenceBps: number;
  readonly reasonCodes: readonly string[];
}

export interface SaveM4RouteEstimateDto {
  readonly routeId: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly travelCostEstimate: number;
  readonly capacityEstimate: number;
  readonly confidenceBps: number;
}

export interface SaveM4SupplyEstimateDto {
  readonly districtId: number;
  readonly supplyMin: number;
  readonly supplyMax: number;
  readonly confidenceBps: number;
}

export interface SaveM4DefenderEstimateDto {
  readonly target: SaveM4CampaignTargetDto;
  readonly defenderMin: number;
  readonly defenderMax: number;
  readonly confidenceBps: number;
}

export interface SaveM4FactionKnowledgeSnapshotStateDto {
  readonly snapshotId: number;
  readonly observerPolityId: number;
  readonly subjectPolityId: number;
  readonly knowledgeVersion: number;
  readonly recordedDay: number;
  readonly source: SaveM4FactionKnowledgeSourceDto;
  readonly knownObjectives: readonly SaveM4KnownObjectiveEstimateDto[];
  readonly routeEstimates: readonly SaveM4RouteEstimateDto[];
  readonly supplyEstimates: readonly SaveM4SupplyEstimateDto[];
  readonly defenderEstimates: readonly SaveM4DefenderEstimateDto[];
}

export interface SaveWorldRuntimeStateV0Dto {
  readonly polities: readonly SaveSimpleRuntimeStateDto[];
  readonly persons: readonly SavePersonStateDto[];
  readonly districts: readonly SaveDistrictStateDto[];
  readonly settlements: readonly SaveSettlementStateDto[];
  readonly routes: readonly SaveSimpleRuntimeStateDto[];
  readonly m2?: SaveM2EconomyPopulationStateDto;
  readonly m3?: SaveM3PolityVassalageStateDto;
  readonly m4?: SaveM4CampaignStateDto;
  readonly m6?: SaveM6DiplomacyLegitimacyStateDto;
  readonly m6PolicyEvents?: SaveM6PolicyEventRuntimeStateDto;
  readonly m6Alpha?: SaveM6AlphaRuntimeStateDto;
}

export interface SaveWorldSnapshotV0Dto {
  readonly schemaVersion: 0;
  readonly meta: SaveWorldMetaV0Dto;
  readonly definitions: SaveWorldDefinitionsV0Dto;
  readonly state: SaveWorldRuntimeStateV0Dto;
}

export interface SaveSchedulerV1Dto {
  readonly schedulerVersion: 1;
  readonly systemOrderVersion: 1;
  readonly fixedStepDurationInDays: 1;
  readonly lastCompletedDay: number;
  readonly pendingCommandCount: number;
}

export interface SaveRngCompatibilityV1Dto {
  readonly schemaVersion: 1;
  readonly algorithm: "sfc32-fnv1a32-domain-v1";
  readonly savedStreams: readonly unknown[];
}

export interface SaveCommandTailEntryV1 {
  readonly sequence: number;
  readonly command: GameCommandV1;
}

export interface SaveEventTailEntryV1 {
  readonly sequence: number;
  readonly event: Record<string, unknown>;
}

export interface SaveBodyV1 {
  readonly authoritativeSnapshot: SaveWorldSnapshotV0Dto;
  readonly scheduler: SaveSchedulerV1Dto;
  readonly rng: SaveRngCompatibilityV1Dto;
  readonly commandTail: readonly SaveCommandTailEntryV1[];
  readonly eventTail: readonly SaveEventTailEntryV1[];
}

export interface SaveEnvelopeV1 {
  readonly magic: typeof SAVE_ENVELOPE_V1_MAGIC;
  readonly schemaVersion: typeof SAVE_ENVELOPE_V1_SCHEMA_VERSION;
  readonly header: SaveHeaderV1;
  readonly body: SaveBodyV1;
}

export interface CreateSaveEnvelopeV1Input {
  readonly build: SaveBuildMetadataV1;
  readonly scenarioId: string;
  readonly authoritativeSnapshot: SaveWorldSnapshotV0Dto;
  readonly scheduler: SaveSchedulerV1Dto;
  readonly rng: SaveRngCompatibilityV1Dto;
  readonly commandTail: readonly SaveCommandTailEntryV1[];
  readonly eventTail: readonly SaveEventTailEntryV1[];
}

export type SaveLoadRejectionCodeV1 =
  | "checksum-mismatch"
  | "content-manifest-mismatch"
  | "depth-limit"
  | "invalid-magic"
  | "invalid-schema"
  | "malformed-json"
  | "semantic-invariant"
  | "size-limit"
  | "unsupported-schema-version";

export interface SaveLoadRejectionReasonV1 {
  readonly code: SaveLoadRejectionCodeV1;
  readonly path: string;
  readonly message: string;
}

export interface SaveSemanticIssueV1 {
  readonly path: string;
  readonly message: string;
}

export interface DecodeSaveEnvelopeV1Options {
  readonly expectedContentManifestHash?: string;
  readonly expectedScenarioId?: string;
  readonly maxBytes?: number;
  readonly maxDepth?: number;
  readonly validateWorldSnapshot?: (worldCandidate: unknown) => readonly SaveSemanticIssueV1[];
}

export type DecodeSaveEnvelopeV1Result =
  | {
      readonly status: "loaded";
      readonly envelope: SaveEnvelopeV1;
      readonly worldCandidate: unknown;
    }
  | {
      readonly status: "rejected";
      readonly reasons: readonly SaveLoadRejectionReasonV1[];
    };

export const M7_SAVE_MIGRATION_BOUNDARY_SCHEMA_VERSION = 1;

export type M7SaveMigrationMilestoneV1 = "M1" | "M2" | "M3" | "M4" | "M5" | "M6" | "M7";
export type M7SaveMigrationDecisionStateV1 = "accepted-save" | "beta-content-lock-candidate";
export type M7SaveMigrationModeV1 = "human-gate-required" | "local-compatible-load-only";
export type M7SaveMigrationHumanGateCapabilityV1 =
  | "account-backed-persistence"
  | "cloud-provider-integration"
  | "cloud-save-enablement"
  | "frozen-platform-decision"
  | "frozen-save-format-decision"
  | "implicit-rpc"
  | "irreversible-migration"
  | "network-sync"
  | "object-graph-serialization"
  | "paid-service"
  | "remote-collection"
  | "secrets"
  | "server-persistence"
  | "telemetry";
export type M7SaveMigrationRequestModeV1 =
  | "local-compatible-load-only"
  | M7SaveMigrationHumanGateCapabilityV1;

export interface M7SaveMigrationManifestBoundaryEntryV1 {
  readonly milestone: M7SaveMigrationMilestoneV1;
  readonly decisionState: M7SaveMigrationDecisionStateV1;
  readonly contentManifestHash: string;
  readonly scenarioId: string;
  readonly stateHash?: string;
  readonly envelopeSchemaVersion: typeof SAVE_ENVELOPE_V1_SCHEMA_VERSION;
  readonly snapshotSchemaVersion: 0;
  readonly migrationMode: M7SaveMigrationModeV1;
}

export interface M7CloudSaveCandidateBoundaryV1 {
  readonly decisionState: "candidate-boundary-only";
  readonly implementedCapabilities: readonly M7SaveMigrationHumanGateCapabilityV1[];
  readonly requiredReviewRoute: "security_reviewer";
}

export interface M7SaveMigrationCompatibilityBoundaryV1 {
  readonly schemaVersion: typeof M7_SAVE_MIGRATION_BOUNDARY_SCHEMA_VERSION;
  readonly envelopeMagic: typeof SAVE_ENVELOPE_V1_MAGIC;
  readonly envelopeSchemaVersion: typeof SAVE_ENVELOPE_V1_SCHEMA_VERSION;
  readonly snapshotSchemaVersion: 0;
  readonly migrationMode: "local-compatible-load-only";
  readonly acceptedSaveManifests: readonly M7SaveMigrationManifestBoundaryEntryV1[];
  readonly candidateContentManifests: readonly M7SaveMigrationManifestBoundaryEntryV1[];
  readonly cloudSave: M7CloudSaveCandidateBoundaryV1;
  readonly humanGateCapabilities: readonly M7SaveMigrationHumanGateCapabilityV1[];
}

export type M7SaveMigrationBoundaryIssueCodeV1 =
  | "cloud-save-implementation-present"
  | "human-gate-missing"
  | "invalid-boundary"
  | "missing-milestone";

export interface M7SaveMigrationBoundaryIssueV1 {
  readonly code: M7SaveMigrationBoundaryIssueCodeV1;
  readonly path: string;
  readonly message: string;
}

export type M7SaveMigrationBoundaryValidationResultV1 =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly issues: readonly M7SaveMigrationBoundaryIssueV1[];
    };

export type M7SaveContentManifestBoundaryResultV1 =
  | {
      readonly status: "accepted-save";
      readonly entry: M7SaveMigrationManifestBoundaryEntryV1;
    }
  | {
      readonly status: "beta-content-lock-candidate";
      readonly entry: M7SaveMigrationManifestBoundaryEntryV1;
      readonly humanGateRequired: true;
      readonly routeTo: "security_reviewer";
    }
  | {
      readonly status: "not-accepted";
      readonly reason: SaveLoadRejectionReasonV1;
    };

export type M7SaveMigrationHumanGateReasonCodeV1 =
  | M7SaveMigrationHumanGateCapabilityV1
  | "invalid-boundary"
  | "m7-beta-content-lock-candidate";

export interface M7SaveMigrationHumanGateReasonV1 {
  readonly code: M7SaveMigrationHumanGateReasonCodeV1;
  readonly path: string;
  readonly message: string;
  readonly humanGateRequired: true;
  readonly routeTo: "security_reviewer";
}

export interface ValidateM7SaveMigrationCandidateV1Input {
  readonly boundary: M7SaveMigrationCompatibilityBoundaryV1;
  readonly bytes: Uint8Array;
  readonly requestedMode: M7SaveMigrationRequestModeV1;
  readonly expectedContentManifestHash?: string;
  readonly expectedScenarioId?: string;
  readonly maxBytes?: number;
  readonly maxDepth?: number;
  readonly validateWorldSnapshot?: (worldCandidate: unknown) => readonly SaveSemanticIssueV1[];
}

export type ValidateM7SaveMigrationCandidateV1Result =
  | {
      readonly status: "compatible";
      readonly envelope: SaveEnvelopeV1;
      readonly matchingEntry: M7SaveMigrationManifestBoundaryEntryV1;
      readonly worldCandidate: unknown;
    }
  | {
      readonly status: "human-gate-required";
      readonly reasons: readonly M7SaveMigrationHumanGateReasonV1[];
    }
  | {
      readonly status: "rejected";
      readonly reasons: readonly SaveLoadRejectionReasonV1[];
    };

const M7_SAVE_MIGRATION_REQUIRED_ACCEPTED_MILESTONES: readonly M7SaveMigrationMilestoneV1[] = [
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "M6"
];

const M7_SAVE_MIGRATION_CANDIDATE_MILESTONES: readonly M7SaveMigrationMilestoneV1[] = ["M7"];

const M7_SAVE_MIGRATION_REQUIRED_HUMAN_GATE_CAPABILITIES: readonly M7SaveMigrationHumanGateCapabilityV1[] =
  [
    "account-backed-persistence",
    "cloud-provider-integration",
    "cloud-save-enablement",
    "frozen-platform-decision",
    "frozen-save-format-decision",
    "implicit-rpc",
    "irreversible-migration",
    "network-sync",
    "object-graph-serialization",
    "paid-service",
    "remote-collection",
    "secrets",
    "server-persistence",
    "telemetry"
  ];

export interface WorldStateV0ForSave {
  readonly meta: SaveWorldMetaV0Dto;
  readonly definitions: SaveWorldDefinitionsV0Dto;
  readonly state: {
    readonly polities: readonly SaveSimpleRuntimeStateDto[];
    readonly persons: readonly {
      readonly definitionId: number;
      readonly currentDistrictId: number | undefined;
    }[];
    readonly districts: readonly SaveDistrictStateDto[];
    readonly settlements: readonly SaveSettlementStateDto[];
    readonly routes: readonly SaveSimpleRuntimeStateDto[];
    readonly m2?: SaveM2EconomyPopulationStateDto;
    readonly m3?: SaveM3PolityVassalageStateDto;
    readonly m4?: SaveM4CampaignStateDto;
    readonly m6?: SaveM6DiplomacyLegitimacyStateDto;
    readonly m6PolicyEvents?: SaveM6PolicyEventRuntimeStateDto;
    readonly m6Alpha?: SaveM6AlphaRuntimeStateDto;
  };
}

export function createSaveEnvelopeV1(input: CreateSaveEnvelopeV1Input): SaveEnvelopeV1 {
  const body = copySaveBody({
    authoritativeSnapshot: input.authoritativeSnapshot,
    scheduler: input.scheduler,
    rng: input.rng,
    commandTail: input.commandTail,
    eventTail: input.eventTail
  });
  const checksum = checksumSaveBodyV1(body);

  return {
    magic: SAVE_ENVELOPE_V1_MAGIC,
    schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
    header: {
      magic: SAVE_ENVELOPE_V1_MAGIC,
      schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
      build: {
        appVersion: input.build.appVersion,
        source: input.build.source,
        codecVersion: input.build.codecVersion
      },
      contentManifestHash: body.authoritativeSnapshot.meta.contentManifestHash,
      scenarioId: input.scenarioId,
      seed: body.authoritativeSnapshot.meta.seed,
      currentDay: body.authoritativeSnapshot.meta.currentDay,
      checksumAlgorithm: SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM,
      checksum
    },
    body
  };
}

export function encodeSaveEnvelopeV1(envelope: SaveEnvelopeV1): Uint8Array {
  return encodeUtf8(canonicalJson(envelope));
}

export function decodeSaveEnvelopeV1(
  bytes: Uint8Array,
  options: DecodeSaveEnvelopeV1Options = {}
): DecodeSaveEnvelopeV1Result {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_SAVE_BYTES;
  if (!isNonnegativeSafeInteger(maxBytes) || maxBytes <= 0) {
    return rejected("invalid-schema", "maxBytes", "maxBytes must be a positive safe integer.");
  }

  if (bytes.byteLength > maxBytes) {
    return rejected(
      "size-limit",
      "$",
      `Save payload is ${bytes.byteLength} bytes, exceeding limit ${maxBytes}.`
    );
  }

  const parsed = parseJsonBytes(bytes);
  if (!parsed.ok) {
    return rejected(parsed.reason.code, parsed.reason.path, parsed.reason.message);
  }

  const maxDepth = options.maxDepth ?? DEFAULT_MAX_JSON_DEPTH;
  const depthError = validateDepth(parsed.value, maxDepth);
  if (depthError !== null) {
    return { status: "rejected", reasons: [depthError] };
  }

  const envelopeResult = parseSaveEnvelopeV1(parsed.value);
  if (!envelopeResult.ok) {
    return { status: "rejected", reasons: envelopeResult.reasons };
  }

  const envelope = envelopeResult.value;
  const expectedChecksum = checksumSaveBodyV1(envelope.body);
  if (envelope.header.checksum !== expectedChecksum) {
    return rejected(
      "checksum-mismatch",
      "header.checksum",
      `Save checksum ${envelope.header.checksum} does not match canonical body checksum ${expectedChecksum}.`
    );
  }

  if (
    options.expectedContentManifestHash !== undefined &&
    envelope.header.contentManifestHash !== options.expectedContentManifestHash
  ) {
    return rejected(
      "content-manifest-mismatch",
      "header.contentManifestHash",
      `Save content manifest ${envelope.header.contentManifestHash} does not match expected ${options.expectedContentManifestHash}.`
    );
  }

  if (
    options.expectedScenarioId !== undefined &&
    envelope.header.scenarioId !== options.expectedScenarioId
  ) {
    return rejected(
      "invalid-schema",
      "header.scenarioId",
      `Save scenario ${envelope.header.scenarioId} does not match expected ${options.expectedScenarioId}.`
    );
  }

  const worldCandidate = saveWorldStateV0DtoToCandidate(
    envelope.body.authoritativeSnapshot,
    envelope.body.scheduler
  );
  const semanticIssues = options.validateWorldSnapshot?.(worldCandidate) ?? [];
  if (semanticIssues.length > 0) {
    return {
      status: "rejected",
      reasons: semanticIssues.map((issue) => ({
        code: "semantic-invariant",
        path: issue.path,
        message: issue.message
      }))
    };
  }

  return {
    status: "loaded",
    envelope,
    worldCandidate
  };
}

export function validateM7SaveMigrationBoundaryV1(
  boundary: M7SaveMigrationCompatibilityBoundaryV1
): M7SaveMigrationBoundaryValidationResultV1 {
  const issues: M7SaveMigrationBoundaryIssueV1[] = [];

  if (boundary.schemaVersion !== M7_SAVE_MIGRATION_BOUNDARY_SCHEMA_VERSION) {
    issues.push(
      boundaryIssue(
        "invalid-boundary",
        "schemaVersion",
        "M7 save migration boundary schemaVersion must be 1."
      )
    );
  }
  if (boundary.envelopeMagic !== SAVE_ENVELOPE_V1_MAGIC) {
    issues.push(
      boundaryIssue("invalid-boundary", "envelopeMagic", "Save envelope magic must remain v1.")
    );
  }
  if (boundary.envelopeSchemaVersion !== SAVE_ENVELOPE_V1_SCHEMA_VERSION) {
    issues.push(
      boundaryIssue(
        "invalid-boundary",
        "envelopeSchemaVersion",
        "Save envelope schemaVersion must remain 1."
      )
    );
  }
  if (boundary.snapshotSchemaVersion !== 0) {
    issues.push(
      boundaryIssue(
        "invalid-boundary",
        "snapshotSchemaVersion",
        "Save world snapshot schemaVersion must remain 0."
      )
    );
  }
  if (boundary.migrationMode !== "local-compatible-load-only") {
    issues.push(
      boundaryIssue(
        "invalid-boundary",
        "migrationMode",
        "M7 migration validation may only approve local-compatible-load-only."
      )
    );
  }

  for (const milestone of M7_SAVE_MIGRATION_REQUIRED_ACCEPTED_MILESTONES) {
    if (
      !boundary.acceptedSaveManifests.some(
        (entry) => entry.milestone === milestone && entry.decisionState === "accepted-save"
      )
    ) {
      issues.push(
        boundaryIssue(
          "missing-milestone",
          "acceptedSaveManifests",
          `M7 save migration boundary must include an accepted ${milestone} save manifest.`
        )
      );
    }
  }

  if (
    !boundary.candidateContentManifests.some(
      (entry) => entry.milestone === "M7" && entry.decisionState === "beta-content-lock-candidate"
    )
  ) {
    issues.push(
      boundaryIssue(
        "missing-milestone",
        "candidateContentManifests",
        "M7 save migration boundary must include the Beta content-lock candidate manifest."
      )
    );
  }

  validateM7BoundaryEntries(
    boundary.acceptedSaveManifests,
    "acceptedSaveManifests",
    "accepted-save",
    "local-compatible-load-only",
    M7_SAVE_MIGRATION_REQUIRED_ACCEPTED_MILESTONES,
    issues
  );
  validateM7BoundaryEntries(
    boundary.candidateContentManifests,
    "candidateContentManifests",
    "beta-content-lock-candidate",
    "human-gate-required",
    M7_SAVE_MIGRATION_CANDIDATE_MILESTONES,
    issues
  );

  if (boundary.cloudSave.decisionState !== "candidate-boundary-only") {
    issues.push(
      boundaryIssue(
        "invalid-boundary",
        "cloudSave.decisionState",
        "Cloud save must remain candidate-boundary-only in M7."
      )
    );
  }
  if (boundary.cloudSave.requiredReviewRoute !== "security_reviewer") {
    issues.push(
      boundaryIssue(
        "invalid-boundary",
        "cloudSave.requiredReviewRoute",
        "Cloud save candidate decisions must route to security_reviewer."
      )
    );
  }
  if (boundary.cloudSave.implementedCapabilities.length > 0) {
    issues.push(
      boundaryIssue(
        "cloud-save-implementation-present",
        "cloudSave.implementedCapabilities",
        "Cloud save boundary must not implement account, network, server, telemetry, secret, paid service, or provider capabilities."
      )
    );
  }

  for (const capability of M7_SAVE_MIGRATION_REQUIRED_HUMAN_GATE_CAPABILITIES) {
    if (!boundary.humanGateCapabilities.includes(capability)) {
      issues.push(
        boundaryIssue(
          "human-gate-missing",
          "humanGateCapabilities",
          `M7 save migration boundary must route ${capability} to Human Gate and security review.`
        )
      );
    }
  }

  return issues.length === 0 ? { ok: true } : { ok: false, issues };
}

export function classifyM7SaveContentManifestBoundaryV1(
  input: {
    readonly contentManifestHash: string;
    readonly scenarioId: string;
    readonly stateHash?: string;
  },
  boundary: M7SaveMigrationCompatibilityBoundaryV1
): M7SaveContentManifestBoundaryResultV1 {
  const accepted = findM7SaveMigrationBoundaryEntry(
    boundary.acceptedSaveManifests,
    input.contentManifestHash,
    input.scenarioId,
    input.stateHash,
    M7_SAVE_MIGRATION_REQUIRED_ACCEPTED_MILESTONES
  );
  if (accepted !== undefined) {
    return { status: "accepted-save", entry: accepted };
  }

  const candidate = findM7SaveMigrationBoundaryEntry(
    boundary.candidateContentManifests,
    input.contentManifestHash,
    input.scenarioId,
    input.stateHash,
    M7_SAVE_MIGRATION_CANDIDATE_MILESTONES
  );
  if (candidate !== undefined) {
    return {
      status: "beta-content-lock-candidate",
      entry: candidate,
      humanGateRequired: true,
      routeTo: "security_reviewer"
    };
  }

  return {
    status: "not-accepted",
    reason: reason(
      "content-manifest-mismatch",
      "header.contentManifestHash",
      `Save content manifest ${input.contentManifestHash} is not accepted by the M7 migration boundary.`
    )
  };
}

export function validateM7SaveMigrationCandidateV1(
  input: ValidateM7SaveMigrationCandidateV1Input
): ValidateM7SaveMigrationCandidateV1Result {
  const boundaryValidation = validateM7SaveMigrationBoundaryV1(input.boundary);
  if (!boundaryValidation.ok) {
    return {
      status: "human-gate-required",
      reasons: boundaryValidation.issues.map((issue) => ({
        code: "invalid-boundary",
        path: issue.path,
        message: issue.message,
        humanGateRequired: true,
        routeTo: "security_reviewer"
      }))
    };
  }

  if (input.requestedMode !== "local-compatible-load-only") {
    return {
      status: "human-gate-required",
      reasons: [
        {
          code: input.requestedMode,
          path: "requestedMode",
          message: `${input.requestedMode} requires Human Gate and security review before implementation.`,
          humanGateRequired: true,
          routeTo: "security_reviewer"
        }
      ]
    };
  }

  const decoded = decodeSaveEnvelopeV1(input.bytes, m7DecodeOptions(input));
  if (decoded.status === "rejected") {
    return decoded;
  }

  const manifestBoundary = classifyM7SaveContentManifestBoundaryV1(
    {
      contentManifestHash: decoded.envelope.header.contentManifestHash,
      scenarioId: decoded.envelope.header.scenarioId,
      stateHash: decoded.envelope.body.authoritativeSnapshot.meta.stateHash
    },
    input.boundary
  );

  switch (manifestBoundary.status) {
    case "accepted-save":
      return {
        status: "compatible",
        envelope: decoded.envelope,
        matchingEntry: manifestBoundary.entry,
        worldCandidate: decoded.worldCandidate
      };
    case "beta-content-lock-candidate":
      return {
        status: "human-gate-required",
        reasons: [
          {
            code: "m7-beta-content-lock-candidate",
            path: "candidateContentManifests",
            message:
              "M7 Beta content-lock candidate manifests are recognized for review but cannot enable automatic migration before Human Gate.",
            humanGateRequired: true,
            routeTo: "security_reviewer"
          }
        ]
      };
    case "not-accepted":
      return { status: "rejected", reasons: [manifestBoundary.reason] };
  }
}

export function worldStateV0ToSaveDto(world: WorldStateV0ForSave): SaveWorldSnapshotV0Dto {
  const stateWithoutM2 = {
    polities: world.state.polities.map(copySimpleRuntimeState),
    persons: world.state.persons.map((person) => ({
      definitionId: person.definitionId,
      currentDistrictId: person.currentDistrictId ?? null
    })),
    districts: world.state.districts.map((district) => ({
      definitionId: district.definitionId,
      control: copyDistrictControl(district.control)
    })),
    settlements: world.state.settlements.map((settlement) => ({
      definitionId: settlement.definitionId,
      currentDistrictId: settlement.currentDistrictId
    })),
    routes: world.state.routes.map(copySimpleRuntimeState)
  };
  const state = copyOptionalRuntimeSlices(
    stateWithoutM2,
    world.state.m2,
    world.state.m3,
    world.state.m4,
    world.state.m6,
    world.state.m6PolicyEvents,
    world.state.m6Alpha
  );

  return {
    schemaVersion: 0,
    meta: {
      schemaVersion: 0,
      seed: world.meta.seed,
      contentManifestHash: world.meta.contentManifestHash,
      currentDay: world.meta.currentDay,
      revision: world.meta.revision,
      hashAlgorithm: SAVE_ENVELOPE_V1_HASH_ALGORITHM,
      stateHash: world.meta.stateHash
    },
    definitions: {
      polities: world.definitions.polities.map(copySimpleDefinition),
      persons: world.definitions.persons.map(copySimpleDefinition),
      districts: world.definitions.districts.map(copySimpleDefinition),
      settlements: world.definitions.settlements.map((settlement) => ({
        id: settlement.id,
        displayNameKey: settlement.displayNameKey,
        districtId: settlement.districtId
      })),
      routes: world.definitions.routes.map((route) => ({
        id: route.id,
        fromDistrictId: route.fromDistrictId,
        toDistrictId: route.toDistrictId,
        lengthInMapUnits: route.lengthInMapUnits
      })),
      ...(world.definitions.topology === undefined
        ? {}
        : { topology: copyMapTopologyDefinition(world.definitions.topology) }),
      ...(world.definitions.strategicTerrain === undefined
        ? {}
        : { strategicTerrain: copyStrategicTerrainDefinition(world.definitions.strategicTerrain) })
    },
    state
  };
}

export function saveWorldStateV0DtoToCandidate(snapshot: unknown, scheduler?: unknown): unknown {
  if (!isRecord(snapshot)) {
    return snapshot;
  }

  const parsedSnapshot = parseSaveWorldSnapshotV0Dto(snapshot);
  if (!parsedSnapshot.ok) {
    return snapshot;
  }

  const parsedScheduler = scheduler === undefined ? undefined : parseSaveSchedulerV1Dto(scheduler);
  const candidateScheduler =
    parsedScheduler !== undefined && parsedScheduler.ok
      ? parsedScheduler.value
      : {
          schedulerVersion: 1,
          systemOrderVersion: 1,
          fixedStepDurationInDays: 1,
          lastCompletedDay: parsedSnapshot.value.meta.currentDay,
          pendingCommandCount: 0
        };

  const stateWithoutM2 = {
    ...parsedSnapshot.value.state,
    persons: parsedSnapshot.value.state.persons.map((person) => ({
      definitionId: person.definitionId,
      currentDistrictId: person.currentDistrictId === null ? undefined : person.currentDistrictId
    }))
  };
  const state = copyOptionalCandidateRuntimeSlices(
    stateWithoutM2,
    parsedSnapshot.value.state.m2,
    parsedSnapshot.value.state.m3,
    parsedSnapshot.value.state.m4,
    parsedSnapshot.value.state.m6,
    parsedSnapshot.value.state.m6PolicyEvents,
    parsedSnapshot.value.state.m6Alpha
  );

  return {
    meta: parsedSnapshot.value.meta,
    definitions: parsedSnapshot.value.definitions,
    state,
    scheduler: candidateScheduler
  };
}

function parseSaveEnvelopeV1(
  input: unknown
):
  | { readonly ok: true; readonly value: SaveEnvelopeV1 }
  | { readonly ok: false; readonly reasons: readonly SaveLoadRejectionReasonV1[] } {
  if (!isRecord(input)) {
    return {
      ok: false,
      reasons: [reason("invalid-schema", "$", "Save envelope must be an object.")]
    };
  }

  if (input["magic"] !== SAVE_ENVELOPE_V1_MAGIC) {
    return {
      ok: false,
      reasons: [reason("invalid-magic", "magic", "Save envelope magic is not supported.")]
    };
  }

  if (input["schemaVersion"] !== SAVE_ENVELOPE_V1_SCHEMA_VERSION) {
    return {
      ok: false,
      reasons: [
        reason(
          "unsupported-schema-version",
          "schemaVersion",
          "Save envelope schemaVersion must be 1."
        )
      ]
    };
  }

  const errors: SaveLoadRejectionReasonV1[] = [];
  const header = parseSaveHeaderV1(input["header"], errors);
  const body = parseSaveBodyV1(input["body"], errors);
  if (header === undefined || body === undefined || errors.length > 0) {
    return { ok: false, reasons: errors };
  }

  validateHeaderBodyConsistency(header, body, errors);
  if (errors.length > 0) {
    return { ok: false, reasons: errors };
  }

  return {
    ok: true,
    value: {
      magic: SAVE_ENVELOPE_V1_MAGIC,
      schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
      header,
      body
    }
  };
}

function parseSaveHeaderV1(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveHeaderV1 | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "header", "Save header must be an object."));
    return undefined;
  }

  if (input["magic"] !== SAVE_ENVELOPE_V1_MAGIC) {
    errors.push(reason("invalid-magic", "header.magic", "Save header magic is not supported."));
  }
  if (input["schemaVersion"] !== SAVE_ENVELOPE_V1_SCHEMA_VERSION) {
    errors.push(
      reason(
        "unsupported-schema-version",
        "header.schemaVersion",
        "Save header schemaVersion must be 1."
      )
    );
  }
  if (input["checksumAlgorithm"] !== SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM) {
    errors.push(
      reason(
        "invalid-schema",
        "header.checksumAlgorithm",
        `Save checksumAlgorithm must be ${SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM}.`
      )
    );
  }

  const build = parseBuildMetadata(input["build"], errors);
  const contentManifestHash = readNonEmptyString(
    input,
    "contentManifestHash",
    "header.contentManifestHash",
    errors
  );
  const scenarioId = readNonEmptyString(input, "scenarioId", "header.scenarioId", errors);
  const seed = readNonnegativeSafeInteger(input, "seed", "header.seed", errors);
  const currentDay = readNonnegativeSafeInteger(input, "currentDay", "header.currentDay", errors);
  const checksum = readChecksum(input, "checksum", "header.checksum", errors);

  if (
    build === undefined ||
    contentManifestHash === undefined ||
    scenarioId === undefined ||
    seed === undefined ||
    currentDay === undefined ||
    checksum === undefined
  ) {
    return undefined;
  }

  return {
    magic: SAVE_ENVELOPE_V1_MAGIC,
    schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
    build,
    contentManifestHash,
    scenarioId,
    seed,
    currentDay,
    checksumAlgorithm: SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM,
    checksum
  };
}

function parseBuildMetadata(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveBuildMetadataV1 | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "header.build", "Save build metadata must be an object."));
    return undefined;
  }

  const appVersion = readNonEmptyString(input, "appVersion", "header.build.appVersion", errors);
  const source = input["source"];
  if (source !== "node-runner" && source !== "test" && source !== "worker") {
    errors.push(reason("invalid-schema", "header.build.source", "Save build source is invalid."));
  }
  if (input["codecVersion"] !== "save-envelope-v1") {
    errors.push(
      reason(
        "invalid-schema",
        "header.build.codecVersion",
        "Save codecVersion must be save-envelope-v1."
      )
    );
  }

  if (
    appVersion === undefined ||
    (source !== "node-runner" && source !== "test" && source !== "worker")
  ) {
    return undefined;
  }

  return {
    appVersion,
    source,
    codecVersion: "save-envelope-v1"
  };
}

function parseSaveBodyV1(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveBodyV1 | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "body", "Save body must be an object."));
    return undefined;
  }

  const snapshot = parseSaveWorldSnapshotV0Dto(input["authoritativeSnapshot"], errors);
  const scheduler = parseSaveSchedulerV1Dto(input["scheduler"], errors);
  const rng = parseSaveRngCompatibilityV1Dto(input["rng"], errors);
  const commandTail = parseCommandTail(input["commandTail"], errors);
  const eventTail = parseEventTail(input["eventTail"], errors);

  if (
    !snapshot.ok ||
    !scheduler.ok ||
    !rng.ok ||
    commandTail === undefined ||
    eventTail === undefined
  ) {
    return undefined;
  }

  return {
    authoritativeSnapshot: snapshot.value,
    scheduler: scheduler.value,
    rng: rng.value,
    commandTail,
    eventTail
  };
}

function parseSaveWorldSnapshotV0Dto(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[] = []
): { readonly ok: true; readonly value: SaveWorldSnapshotV0Dto } | { readonly ok: false } {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", "body.authoritativeSnapshot", "Save snapshot must be an object.")
    );
    return { ok: false };
  }

  if (input["schemaVersion"] !== 0) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.schemaVersion",
        "Save snapshot schemaVersion must be 0."
      )
    );
  }

  const meta = parseWorldMeta(input["meta"], errors);
  const definitions = parseWorldDefinitions(input["definitions"], errors);
  const state = parseWorldRuntimeState(input["state"], errors);
  if (meta === undefined || definitions === undefined || state === undefined) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      schemaVersion: 0,
      meta,
      definitions,
      state
    }
  };
}

function parseWorldMeta(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveWorldMetaV0Dto | undefined {
  if (!isRecord(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.meta",
        "Save snapshot meta must be an object."
      )
    );
    return undefined;
  }

  if (input["schemaVersion"] !== 0) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.meta.schemaVersion",
        "World meta schemaVersion must be 0."
      )
    );
  }
  if (input["hashAlgorithm"] !== SAVE_ENVELOPE_V1_HASH_ALGORITHM) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.meta.hashAlgorithm",
        `World meta hashAlgorithm must be ${SAVE_ENVELOPE_V1_HASH_ALGORITHM}.`
      )
    );
  }

  const seed = readNonnegativeSafeInteger(
    input,
    "seed",
    "body.authoritativeSnapshot.meta.seed",
    errors
  );
  const contentManifestHash = readNonEmptyString(
    input,
    "contentManifestHash",
    "body.authoritativeSnapshot.meta.contentManifestHash",
    errors
  );
  const currentDay = readNonnegativeSafeInteger(
    input,
    "currentDay",
    "body.authoritativeSnapshot.meta.currentDay",
    errors
  );
  const revision = readNonnegativeSafeInteger(
    input,
    "revision",
    "body.authoritativeSnapshot.meta.revision",
    errors
  );
  const stateHash = readChecksum(
    input,
    "stateHash",
    "body.authoritativeSnapshot.meta.stateHash",
    errors
  );
  if (
    seed === undefined ||
    contentManifestHash === undefined ||
    currentDay === undefined ||
    revision === undefined ||
    stateHash === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 0,
    seed,
    contentManifestHash,
    currentDay,
    revision,
    hashAlgorithm: SAVE_ENVELOPE_V1_HASH_ALGORITHM,
    stateHash
  };
}

function parseWorldDefinitions(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveWorldDefinitionsV0Dto | undefined {
  if (!isRecord(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.definitions",
        "Save definitions must be an object."
      )
    );
    return undefined;
  }

  const polities = parseSimpleDefinitions(input["polities"], "polities", errors);
  const persons = parseSimpleDefinitions(input["persons"], "persons", errors);
  const districts = parseSimpleDefinitions(input["districts"], "districts", errors);
  const settlements = parseSettlements(input["settlements"], errors);
  const routes = parseRoutes(input["routes"], errors);
  const topology =
    input["topology"] === undefined
      ? undefined
      : parseMapTopologyDefinition(
          input["topology"],
          "body.authoritativeSnapshot.definitions.topology",
          errors
        );
  const strategicTerrain =
    input["strategicTerrain"] === undefined
      ? undefined
      : parseStrategicTerrainDefinition(
          input["strategicTerrain"],
          "body.authoritativeSnapshot.definitions.strategicTerrain",
          errors
        );

  if (
    polities === undefined ||
    persons === undefined ||
    districts === undefined ||
    settlements === undefined ||
    routes === undefined ||
    (input["topology"] !== undefined && topology === undefined) ||
    (input["strategicTerrain"] !== undefined && strategicTerrain === undefined)
  ) {
    return undefined;
  }

  return {
    polities,
    persons,
    districts,
    settlements,
    routes,
    ...(topology === undefined ? {} : { topology }),
    ...(strategicTerrain === undefined ? {} : { strategicTerrain })
  };
}

function parseWorldRuntimeState(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveWorldRuntimeStateV0Dto | undefined {
  if (!isRecord(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state",
        "Save runtime state must be an object."
      )
    );
    return undefined;
  }

  const polities = parseSimpleRuntimeStates(input["polities"], "polities", errors);
  const persons = parsePersonStates(input["persons"], errors);
  const districts = parseDistrictStates(input["districts"], errors);
  const settlements = parseSettlementStates(input["settlements"], errors);
  const routes = parseSimpleRuntimeStates(input["routes"], "routes", errors);
  const m2 =
    input["m2"] === undefined
      ? undefined
      : parseM2EconomyPopulationState(input["m2"], "body.authoritativeSnapshot.state.m2", errors);
  const m3 =
    input["m3"] === undefined
      ? undefined
      : parseM3PolityVassalageState(input["m3"], "body.authoritativeSnapshot.state.m3", errors);
  const m4 =
    input["m4"] === undefined
      ? undefined
      : parseM4CampaignState(input["m4"], "body.authoritativeSnapshot.state.m4", errors);
  const m6 =
    input["m6"] === undefined
      ? undefined
      : parseM6DiplomacyLegitimacyState(input["m6"], "body.authoritativeSnapshot.state.m6", errors);
  const m6PolicyEvents =
    input["m6PolicyEvents"] === undefined
      ? undefined
      : parseM6PolicyEventRuntimeState(
          input["m6PolicyEvents"],
          "body.authoritativeSnapshot.state.m6PolicyEvents",
          errors
        );
  const m6Alpha =
    input["m6Alpha"] === undefined
      ? undefined
      : parseM6AlphaRuntimeState(
          input["m6Alpha"],
          "body.authoritativeSnapshot.state.m6Alpha",
          errors
        );
  if (
    polities === undefined ||
    persons === undefined ||
    districts === undefined ||
    settlements === undefined ||
    routes === undefined ||
    (input["m2"] !== undefined && m2 === undefined) ||
    (input["m3"] !== undefined && m3 === undefined) ||
    (input["m4"] !== undefined && m4 === undefined) ||
    (input["m6"] !== undefined && m6 === undefined) ||
    (input["m6PolicyEvents"] !== undefined && m6PolicyEvents === undefined) ||
    (input["m6Alpha"] !== undefined && m6Alpha === undefined)
  ) {
    return undefined;
  }

  const state = { polities, persons, districts, settlements, routes };
  return copyOptionalRuntimeSlices(state, m2, m3, m4, m6, m6PolicyEvents, m6Alpha);
}

function parseSaveSchedulerV1Dto(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[] = []
): { readonly ok: true; readonly value: SaveSchedulerV1Dto } | { readonly ok: false } {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "body.scheduler", "Save scheduler must be an object."));
    return { ok: false };
  }
  if (input["schedulerVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", "body.scheduler.schedulerVersion", "schedulerVersion must be 1.")
    );
  }
  if (input["systemOrderVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", "body.scheduler.systemOrderVersion", "systemOrderVersion must be 1.")
    );
  }
  if (input["fixedStepDurationInDays"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        "body.scheduler.fixedStepDurationInDays",
        "fixedStepDurationInDays must be 1."
      )
    );
  }
  const lastCompletedDay = readNonnegativeSafeInteger(
    input,
    "lastCompletedDay",
    "body.scheduler.lastCompletedDay",
    errors
  );
  const pendingCommandCount = readNonnegativeSafeInteger(
    input,
    "pendingCommandCount",
    "body.scheduler.pendingCommandCount",
    errors
  );
  if (lastCompletedDay === undefined || pendingCommandCount === undefined) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      schedulerVersion: 1,
      systemOrderVersion: 1,
      fixedStepDurationInDays: 1,
      lastCompletedDay,
      pendingCommandCount
    }
  };
}

function parseSaveRngCompatibilityV1Dto(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): { readonly ok: true; readonly value: SaveRngCompatibilityV1Dto } | { readonly ok: false } {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", "body.rng", "Save rng compatibility data must be an object.")
    );
    return { ok: false };
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(reason("invalid-schema", "body.rng.schemaVersion", "rng schemaVersion must be 1."));
  }
  if (input["algorithm"] !== "sfc32-fnv1a32-domain-v1") {
    errors.push(
      reason(
        "invalid-schema",
        "body.rng.algorithm",
        "rng algorithm must be sfc32-fnv1a32-domain-v1."
      )
    );
  }
  const savedStreams = input["savedStreams"];
  if (!Array.isArray(savedStreams)) {
    errors.push(
      reason("invalid-schema", "body.rng.savedStreams", "rng savedStreams must be an array.")
    );
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      algorithm: "sfc32-fnv1a32-domain-v1",
      savedStreams: savedStreams.map((stream) => stream)
    }
  };
}

function parseSimpleDefinitions(
  input: unknown,
  name: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSimpleDefinitionDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        `body.authoritativeSnapshot.definitions.${name}`,
        `${name} definitions must be an array.`
      )
    );
    return undefined;
  }

  return input.map((entry, index) =>
    parseSimpleDefinition(entry, `body.authoritativeSnapshot.definitions.${name}[${index}]`, errors)
  );
}

function parseSimpleDefinition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveSimpleDefinitionDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Definition entry must be an object."));
    return { id: 0, displayNameKey: "" };
  }
  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? ""
  };
}

function parseSettlements(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSettlementDefinitionDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.definitions.settlements",
        "settlement definitions must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.definitions.settlements[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Settlement definition must be an object."));
      return { id: 0, displayNameKey: "", districtId: 0 };
    }
    return {
      id: readPositiveSafeInteger(entry, "id", `${path}.id`, errors) ?? 0,
      displayNameKey:
        readNonEmptyString(entry, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
      districtId: readPositiveSafeInteger(entry, "districtId", `${path}.districtId`, errors) ?? 0
    };
  });
}

function parseRoutes(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveRouteDefinitionDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.definitions.routes",
        "route definitions must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.definitions.routes[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Route definition must be an object."));
      return { id: 0, fromDistrictId: 0, toDistrictId: 0, lengthInMapUnits: 0 };
    }
    return {
      id: readPositiveSafeInteger(entry, "id", `${path}.id`, errors) ?? 0,
      fromDistrictId:
        readPositiveSafeInteger(entry, "fromDistrictId", `${path}.fromDistrictId`, errors) ?? 0,
      toDistrictId:
        readPositiveSafeInteger(entry, "toDistrictId", `${path}.toDistrictId`, errors) ?? 0,
      lengthInMapUnits:
        readPositiveSafeInteger(entry, "lengthInMapUnits", `${path}.lengthInMapUnits`, errors) ?? 0
    };
  });
}

function parseMapTopologyDefinition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyDefinitionV1Dto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology definition must be an object."));
    return undefined;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(reason("invalid-schema", `${path}.schemaVersion`, "schemaVersion must be 1."));
  }
  if (input["hashAlgorithm"] !== "fnv1a32-canonical-map-topology-v1") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.hashAlgorithm`,
        "hashAlgorithm must be fnv1a32-canonical-map-topology-v1."
      )
    );
  }

  const topologyHash = readChecksum(input, "topologyHash", `${path}.topologyHash`, errors);
  const contentManifestHash = readNonEmptyString(
    input,
    "contentManifestHash",
    `${path}.contentManifestHash`,
    errors
  );
  const districts = parseMapTopologyArray(
    input["districts"],
    `${path}.districts`,
    "Map topology districts",
    errors,
    parseMapTopologyDistrict
  );
  const routeNodes = parseMapTopologyArray(
    input["routeNodes"],
    `${path}.routeNodes`,
    "Map topology routeNodes",
    errors,
    parseMapTopologyRouteNode
  );
  const routeEdges = parseMapTopologyArray(
    input["routeEdges"],
    `${path}.routeEdges`,
    "Map topology routeEdges",
    errors,
    parseMapTopologyRouteEdge
  );

  if (
    topologyHash === undefined ||
    contentManifestHash === undefined ||
    districts === undefined ||
    routeNodes === undefined ||
    routeEdges === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-map-topology-v1",
    topologyHash,
    contentManifestHash,
    districts,
    routeNodes,
    routeEdges
  };
}

function parseMapTopologyArray<TValue>(
  input: unknown,
  path: string,
  label: string,
  errors: SaveLoadRejectionReasonV1[],
  parseEntry: (entry: unknown, entryPath: string, errors: SaveLoadRejectionReasonV1[]) => TValue
): readonly TValue[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${label} must be an array.`));
    return undefined;
  }

  return input.map((entry, index) => parseEntry(entry, `${path}[${index}]`, errors));
}

function parseMapTopologyDistrict(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyDistrictDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology district must be an object."));
    return {
      districtId: 0,
      sourceId: "",
      displayNameKey: "",
      anchor: { x: 0, y: 0 },
      polygon: [],
      metadata: fallbackMapTopologyMetadata()
    };
  }

  const polygon = parseMapTopologyArray(
    input["polygon"],
    `${path}.polygon`,
    "Map topology district polygon",
    errors,
    parseMapTopologyPoint
  );
  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    anchor: parseMapTopologyPoint(input["anchor"], `${path}.anchor`, errors),
    polygon: polygon ?? [],
    metadata: parseMapTopologyMetadata(input["metadata"], `${path}.metadata`, errors)
  };
}

function parseMapTopologyRouteNode(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRouteNodeDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology route node must be an object."));
    return {
      nodeId: "",
      nodeKind: "special",
      districtId: 0,
      displayNameKey: "",
      anchor: { x: 0, y: 0 }
    };
  }

  return {
    nodeId: readNonEmptyString(input, "nodeId", `${path}.nodeId`, errors) ?? "",
    nodeKind: parseMapTopologyRouteNodeKind(input["nodeKind"], `${path}.nodeKind`, errors),
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    anchor: parseMapTopologyPoint(input["anchor"], `${path}.anchor`, errors)
  };
}

function parseMapTopologyRouteEdge(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRouteEdgeDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology route edge must be an object."));
    return {
      routeId: 0,
      sourceId: "",
      from: { kind: "district", districtId: 0 },
      to: { kind: "district", districtId: 0 },
      mode: "road",
      baseTravelCost: 0,
      baseCapacity: 0,
      seasonality: [],
      availability: { kind: "open" },
      metadata: fallbackMapTopologyMetadata()
    };
  }

  const seasonality = parseMapTopologyArray(
    input["seasonality"],
    `${path}.seasonality`,
    "Map topology route edge seasonality",
    errors,
    parseMapTopologySeasonalModifier
  );
  return {
    routeId: readPositiveSafeInteger(input, "routeId", `${path}.routeId`, errors) ?? 0,
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    from: parseMapTopologyRouteEndpoint(input["from"], `${path}.from`, errors),
    to: parseMapTopologyRouteEndpoint(input["to"], `${path}.to`, errors),
    mode: parseMapTopologyRouteMode(input["mode"], `${path}.mode`, errors),
    baseTravelCost:
      readPositiveSafeInteger(input, "baseTravelCost", `${path}.baseTravelCost`, errors) ?? 0,
    baseCapacity:
      readPositiveSafeInteger(input, "baseCapacity", `${path}.baseCapacity`, errors) ?? 0,
    seasonality: seasonality ?? [],
    availability: parseMapTopologyRouteAvailability(
      input["availability"],
      `${path}.availability`,
      errors
    ),
    metadata: parseMapTopologyMetadata(input["metadata"], `${path}.metadata`, errors)
  };
}

function parseMapTopologyPoint(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyPointV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology point must be an object."));
    return { x: 0, y: 0 };
  }

  return {
    x:
      readIntegerInRange(
        input,
        "x",
        `${path}.x`,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        errors
      ) ?? 0,
    y:
      readIntegerInRange(
        input,
        "y",
        `${path}.y`,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        errors
      ) ?? 0
  };
}

function parseMapTopologyMetadata(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyMetadataV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology metadata must be an object."));
    return fallbackMapTopologyMetadata();
  }

  return {
    historicity: parseMapTopologyHistoricityTag(
      input["historicity"],
      `${path}.historicity`,
      errors
    ),
    terrainClass: parseMapTopologyTerrainClass(
      input["terrainClass"],
      `${path}.terrainClass`,
      errors
    ),
    riskClass: parseMapTopologyRiskClass(input["riskClass"], `${path}.riskClass`, errors)
  };
}

function parseMapTopologyRouteEndpoint(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRouteEndpointV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Map topology route endpoint must be an object."));
    return { kind: "district", districtId: 0 };
  }

  if (input["kind"] === "district") {
    return {
      kind: "district",
      districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0
    };
  }
  if (input["kind"] === "route-node") {
    return {
      kind: "route-node",
      nodeId: readNonEmptyString(input, "nodeId", `${path}.nodeId`, errors) ?? ""
    };
  }
  if (input["kind"] === "settlement") {
    return {
      kind: "settlement",
      settlementId:
        readPositiveSafeInteger(input, "settlementId", `${path}.settlementId`, errors) ?? 0
    };
  }

  errors.push(
    reason(
      "invalid-schema",
      `${path}.kind`,
      "Map topology route endpoint kind must be district, route-node, or settlement."
    )
  );
  return { kind: "district", districtId: 0 };
}

function parseMapTopologySeasonalModifier(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologySeasonalModifierV1Dto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "Map topology seasonal modifier must be an object.")
    );
    return {
      month: 1,
      costMultiplierBps: 10_000,
      capacityMultiplierBps: 10_000,
      reasonCodes: []
    };
  }
  const reasonCodes = parseStringArray(input["reasonCodes"], `${path}.reasonCodes`, errors);
  return {
    month: readIntegerInRange(input, "month", `${path}.month`, 1, 12, errors) ?? 1,
    costMultiplierBps:
      readIntegerInRange(
        input,
        "costMultiplierBps",
        `${path}.costMultiplierBps`,
        1,
        30_000,
        errors
      ) ?? 10_000,
    capacityMultiplierBps:
      readIntegerInRange(
        input,
        "capacityMultiplierBps",
        `${path}.capacityMultiplierBps`,
        0,
        30_000,
        errors
      ) ?? 10_000,
    reasonCodes: reasonCodes ?? []
  };
}

function parseMapTopologyRouteAvailability(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRouteAvailabilityV1Dto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "Map topology route availability must be an object.")
    );
    return { kind: "open" };
  }
  if (input["kind"] === "open") {
    return { kind: "open" };
  }
  if (input["kind"] === "blocked") {
    return {
      kind: "blocked",
      reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  if (input["kind"] === "unknown") {
    return {
      kind: "unknown",
      reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }

  errors.push(
    reason(
      "invalid-schema",
      `${path}.kind`,
      "Map topology route availability kind must be open, blocked, or unknown."
    )
  );
  return { kind: "open" };
}

function parseStrategicTerrainDefinition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainDefinitionV1Dto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Strategic terrain definition must be an object."));
    return undefined;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(reason("invalid-schema", `${path}.schemaVersion`, "schemaVersion must be 1."));
  }
  if (input["hashAlgorithm"] !== "fnv1a32-canonical-strategic-terrain-v1") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.hashAlgorithm`,
        "hashAlgorithm must be fnv1a32-canonical-strategic-terrain-v1."
      )
    );
  }
  if (input["authority"] !== "terrain-route-node-v1") {
    errors.push(
      reason("invalid-schema", `${path}.authority`, "authority must be terrain-route-node-v1.")
    );
  }
  if (input["governanceFootprintRole"] !== "overlay-only") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.governanceFootprintRole`,
        "governanceFootprintRole must be overlay-only."
      )
    );
  }

  const strategicTerrainHash = readChecksum(
    input,
    "strategicTerrainHash",
    `${path}.strategicTerrainHash`,
    errors
  );
  const contentManifestHash = readNonEmptyString(
    input,
    "contentManifestHash",
    `${path}.contentManifestHash`,
    errors
  );
  const authorityProhibitions = parseStrategicTerrainArray(
    input["authorityProhibitions"],
    `${path}.authorityProhibitions`,
    "Strategic terrain authorityProhibitions",
    errors,
    parseStrategicTerrainAuthorityProhibition
  );
  const terrainPatches = parseStrategicTerrainArray(
    input["terrainPatches"],
    `${path}.terrainPatches`,
    "Strategic terrain terrainPatches",
    errors,
    parseTerrainPatch
  );
  const barrierChannels = parseStrategicTerrainArray(
    input["barrierChannels"],
    `${path}.barrierChannels`,
    "Strategic terrain barrierChannels",
    errors,
    parseBarrierChannel
  );
  const strategicNodes = parseStrategicTerrainArray(
    input["strategicNodes"],
    `${path}.strategicNodes`,
    "Strategic terrain strategicNodes",
    errors,
    parseStrategicNode
  );
  const routeCorridors = parseStrategicTerrainArray(
    input["routeCorridors"],
    `${path}.routeCorridors`,
    "Strategic terrain routeCorridors",
    errors,
    parseRouteCorridor
  );
  const districtGovernanceFootprints = parseStrategicTerrainArray(
    input["districtGovernanceFootprints"],
    `${path}.districtGovernanceFootprints`,
    "Strategic terrain districtGovernanceFootprints",
    errors,
    parseDistrictGovernanceFootprint
  );

  if (
    strategicTerrainHash === undefined ||
    contentManifestHash === undefined ||
    authorityProhibitions === undefined ||
    terrainPatches === undefined ||
    barrierChannels === undefined ||
    strategicNodes === undefined ||
    routeCorridors === undefined ||
    districtGovernanceFootprints === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1",
    strategicTerrainHash,
    contentManifestHash,
    authority: "terrain-route-node-v1",
    governanceFootprintRole: "overlay-only",
    authorityProhibitions,
    terrainPatches,
    barrierChannels,
    strategicNodes,
    routeCorridors,
    districtGovernanceFootprints
  };
}

function parseStrategicTerrainArray<TValue>(
  input: unknown,
  path: string,
  label: string,
  errors: SaveLoadRejectionReasonV1[],
  parseEntry: (entry: unknown, entryPath: string, errors: SaveLoadRejectionReasonV1[]) => TValue
): readonly TValue[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${label} must be an array.`));
    return undefined;
  }

  return input.map((entry, index) => parseEntry(entry, `${path}[${index}]`, errors));
}

function parseTerrainPatch(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveTerrainPatchDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Terrain patch must be an object."));
    return terrainPatchFallback();
  }
  return {
    patchId: readNonEmptyString(input, "patchId", `${path}.patchId`, errors) ?? "",
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    terrainClass: parseStrategicTerrainClass(input["terrainClass"], `${path}.terrainClass`, errors),
    seasonSensitivity: parseStrategicTerrainSeasonState(
      input["seasonSensitivity"],
      `${path}.seasonSensitivity`,
      errors
    ),
    historicity: parseStrategicTerrainHistoricity(
      input["historicity"],
      `${path}.historicity`,
      errors
    ),
    polygon:
      parseStrategicTerrainArray(
        input["polygon"],
        `${path}.polygon`,
        "Terrain patch polygon",
        errors,
        parseStrategicTerrainPoint
      ) ?? [],
    explanationTags: parseStrategicTerrainStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseBarrierChannel(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveBarrierChannelDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Barrier channel must be an object."));
    return barrierChannelFallback();
  }
  return {
    channelId: readNonEmptyString(input, "channelId", `${path}.channelId`, errors) ?? "",
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    channelKind: parseBarrierChannelKind(input["channelKind"], `${path}.channelKind`, errors),
    traversalRule: parseBarrierTraversalRule(
      input["traversalRule"],
      `${path}.traversalRule`,
      errors
    ),
    historicity: parseStrategicTerrainHistoricity(
      input["historicity"],
      `${path}.historicity`,
      errors
    ),
    points:
      parseStrategicTerrainArray(
        input["points"],
        `${path}.points`,
        "Barrier channel points",
        errors,
        parseStrategicTerrainPoint
      ) ?? [],
    explanationTags: parseStrategicTerrainStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseStrategicNode(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicNodeDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Strategic node must be an object."));
    return strategicNodeFallback();
  }
  return {
    nodeId: readNonEmptyString(input, "nodeId", `${path}.nodeId`, errors) ?? "",
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    nodeKind: parseStrategicNodeKind(input["nodeKind"], `${path}.nodeKind`, errors),
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    anchor: parseStrategicTerrainPoint(input["anchor"], `${path}.anchor`, errors),
    localCapacity:
      readPositiveSafeInteger(input, "localCapacity", `${path}.localCapacity`, errors) ?? 0,
    knownState: parseStrategicNodeKnownState(input["knownState"], `${path}.knownState`, errors),
    terrainPatchIds: parseStrategicTerrainStringArray(
      input["terrainPatchIds"],
      `${path}.terrainPatchIds`,
      errors
    ),
    barrierChannelIds: parseStrategicTerrainStringArray(
      input["barrierChannelIds"],
      `${path}.barrierChannelIds`,
      errors
    ),
    governanceFootprintIds: parseStrategicTerrainStringArray(
      input["governanceFootprintIds"],
      `${path}.governanceFootprintIds`,
      errors
    ),
    explanationTags: parseStrategicTerrainStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseRouteCorridor(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveRouteCorridorDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Route corridor must be an object."));
    return routeCorridorFallback();
  }
  return {
    corridorId: readNonEmptyString(input, "corridorId", `${path}.corridorId`, errors) ?? "",
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    fromNodeId: readNonEmptyString(input, "fromNodeId", `${path}.fromNodeId`, errors) ?? "",
    toNodeId: readNonEmptyString(input, "toNodeId", `${path}.toNodeId`, errors) ?? "",
    mode: parseRouteCorridorMode(input["mode"], `${path}.mode`, errors),
    widthClass: parseRouteCorridorWidthClass(input["widthClass"], `${path}.widthClass`, errors),
    baseTravelCost:
      readPositiveSafeInteger(input, "baseTravelCost", `${path}.baseTravelCost`, errors) ?? 0,
    baseCapacity:
      readPositiveSafeInteger(input, "baseCapacity", `${path}.baseCapacity`, errors) ?? 0,
    riskClass: parseStrategicTerrainRiskClass(input["riskClass"], `${path}.riskClass`, errors),
    terrainPatchIds: parseStrategicTerrainStringArray(
      input["terrainPatchIds"],
      `${path}.terrainPatchIds`,
      errors
    ),
    barrierChannelIds: parseStrategicTerrainStringArray(
      input["barrierChannelIds"],
      `${path}.barrierChannelIds`,
      errors
    ),
    governanceFootprintIds: parseStrategicTerrainStringArray(
      input["governanceFootprintIds"],
      `${path}.governanceFootprintIds`,
      errors
    ),
    seasonality:
      parseStrategicTerrainArray(
        input["seasonality"],
        `${path}.seasonality`,
        "Route corridor seasonality",
        errors,
        parseRouteCorridorSeasonality
      ) ?? [],
    availability: parseRouteCorridorAvailability(
      input["availability"],
      `${path}.availability`,
      errors
    ),
    polyline:
      parseStrategicTerrainArray(
        input["polyline"],
        `${path}.polyline`,
        "Route corridor polyline",
        errors,
        parseStrategicTerrainPoint
      ) ?? [],
    explanationTags: parseStrategicTerrainStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseDistrictGovernanceFootprint(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveDistrictGovernanceFootprintDefinitionV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "District governance footprint must be an object."));
    return districtGovernanceFootprintFallback();
  }
  if (input["overlayOnly"] !== true) {
    errors.push(reason("invalid-schema", `${path}.overlayOnly`, "overlayOnly must be true."));
  }
  return {
    footprintId: readNonEmptyString(input, "footprintId", `${path}.footprintId`, errors) ?? "",
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    overlayOnly: true,
    polygon:
      parseStrategicTerrainArray(
        input["polygon"],
        `${path}.polygon`,
        "District governance footprint polygon",
        errors,
        parseStrategicTerrainPoint
      ) ?? [],
    governanceTags: parseStrategicTerrainStringArray(
      input["governanceTags"],
      `${path}.governanceTags`,
      errors
    ),
    consequenceTags: parseStrategicTerrainStringArray(
      input["consequenceTags"],
      `${path}.consequenceTags`,
      errors
    )
  };
}

function parseStrategicTerrainPoint(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainPointV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Strategic terrain point must be an object."));
    return { x: 0, y: 0 };
  }
  return {
    x:
      readIntegerInRange(
        input,
        "x",
        `${path}.x`,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        errors
      ) ?? 0,
    y:
      readIntegerInRange(
        input,
        "y",
        `${path}.y`,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        errors
      ) ?? 0
  };
}

function parseRouteCorridorSeasonality(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveRouteCorridorSeasonalModifierV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Route corridor seasonality must be an object."));
    return {
      month: 1,
      seasonState: "unknown",
      travelCostMultiplierBps: 10_000,
      capacityMultiplierBps: 10_000,
      riskBps: 0,
      reasonCodes: []
    };
  }
  return {
    month: readIntegerInRange(input, "month", `${path}.month`, 1, 12, errors) ?? 1,
    seasonState: parseStrategicTerrainSeasonState(
      input["seasonState"],
      `${path}.seasonState`,
      errors
    ),
    travelCostMultiplierBps:
      readIntegerInRange(
        input,
        "travelCostMultiplierBps",
        `${path}.travelCostMultiplierBps`,
        1,
        30_000,
        errors
      ) ?? 10_000,
    capacityMultiplierBps:
      readIntegerInRange(
        input,
        "capacityMultiplierBps",
        `${path}.capacityMultiplierBps`,
        0,
        30_000,
        errors
      ) ?? 10_000,
    riskBps: readIntegerInRange(input, "riskBps", `${path}.riskBps`, 0, 10_000, errors) ?? 0,
    reasonCodes: parseStrategicTerrainStringArray(
      input["reasonCodes"],
      `${path}.reasonCodes`,
      errors
    )
  };
}

function parseStrategicTerrainStringArray(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly string[] {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${path} must be an array.`));
    return [];
  }
  return input.map((entry, index) => {
    if (typeof entry === "string" && entry.length > 0) {
      return entry;
    }
    errors.push(
      reason("invalid-schema", `${path}[${index}]`, `${path}[${index}] must be a non-empty string.`)
    );
    return "";
  });
}

function parseStrategicTerrainAuthorityProhibition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainAuthorityProhibitionV1Dto {
  if (
    input === "bounding-box-adjacency" ||
    input === "centroid-proximity" ||
    input === "hidden-grid" ||
    input === "hidden-lattice" ||
    input === "hex-axial-or-cube" ||
    input === "renderer-only-line-reachability" ||
    input === "sequential-id-reachability"
  ) {
    return input;
  }
  errors.push(
    reason("invalid-schema", path, "Strategic terrain authority prohibition is invalid.")
  );
  return "hidden-grid";
}

function parseStrategicTerrainClass(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainClassV1Dto {
  if (
    input === "coastal" ||
    input === "lowland" ||
    input === "pass" ||
    input === "ridge" ||
    input === "river-basin" ||
    input === "riverine" ||
    input === "upland" ||
    input === "urban" ||
    input === "wetland" ||
    input === "unknown"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic terrain class is invalid."));
  return "unknown";
}

function parseStrategicTerrainRiskClass(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainRiskClassV1Dto {
  if (
    input === "contested" ||
    input === "hazardous" ||
    input === "low" ||
    input === "seasonal" ||
    input === "unknown"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic terrain risk class is invalid."));
  return "unknown";
}

function parseStrategicTerrainSeasonState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainSeasonStateV1Dto {
  if (input === "dry" || input === "monsoon" || input === "transition" || input === "unknown") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic terrain season state is invalid."));
  return "unknown";
}

function parseStrategicTerrainHistoricity(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicTerrainHistoricityTagV1Dto {
  if (
    input === "COMPOSITE" ||
    input === "FICTIONAL" ||
    input === "HISTORICAL" ||
    input === "INFERRED"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic terrain historicity is invalid."));
  return "FICTIONAL";
}

function parseBarrierChannelKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveBarrierChannelKindV1Dto {
  if (
    input === "coast" ||
    input === "major-river" ||
    input === "ridge" ||
    input === "strait" ||
    input === "wetland"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic terrain barrier channel kind is invalid."));
  return "major-river";
}

function parseBarrierTraversalRule(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): "blocks-without-explicit-corridor" | "channels-explicit-corridors" {
  if (input === "blocks-without-explicit-corridor" || input === "channels-explicit-corridors") {
    return input;
  }
  errors.push(
    reason("invalid-schema", path, "Strategic terrain barrier traversalRule is invalid.")
  );
  return "blocks-without-explicit-corridor";
}

function parseStrategicNodeKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicNodeKindV1Dto {
  if (
    input === "castle" ||
    input === "crossing" ||
    input === "objective" ||
    input === "pass" ||
    input === "port" ||
    input === "staging-area" ||
    input === "town" ||
    input === "warehouse"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic node kind is invalid."));
  return "objective";
}

function parseStrategicNodeKnownState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveStrategicNodeKnownStateV1Dto {
  if (input === "known" || input === "rumored" || input === "unknown") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic node known state is invalid."));
  return "unknown";
}

function parseRouteCorridorMode(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveRouteCorridorModeV1Dto {
  if (
    input === "coast" ||
    input === "mixed" ||
    input === "pass" ||
    input === "river" ||
    input === "road"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "Strategic terrain route corridor mode is invalid."));
  return "road";
}

function parseRouteCorridorWidthClass(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveRouteCorridorWidthClassV1Dto {
  if (input === "narrow" || input === "standard" || input === "wide") {
    return input;
  }
  errors.push(
    reason("invalid-schema", path, "Strategic terrain route corridor widthClass is invalid.")
  );
  return "standard";
}

function parseRouteCorridorAvailability(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveRouteCorridorAvailabilityV1Dto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Route corridor availability must be an object."));
    return { kind: "open" };
  }
  if (input["kind"] === "open") {
    return { kind: "open" };
  }
  if (input["kind"] === "blocked") {
    return {
      kind: "blocked",
      reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  if (input["kind"] === "unknown") {
    return {
      kind: "unknown",
      reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  errors.push(
    reason(
      "invalid-schema",
      `${path}.kind`,
      "Route corridor availability kind must be open, blocked, or unknown."
    )
  );
  return { kind: "open" };
}

function terrainPatchFallback(): SaveTerrainPatchDefinitionV1Dto {
  return {
    patchId: "",
    sourceId: "",
    displayNameKey: "",
    terrainClass: "unknown",
    seasonSensitivity: "unknown",
    historicity: "FICTIONAL",
    polygon: [],
    explanationTags: []
  };
}

function barrierChannelFallback(): SaveBarrierChannelDefinitionV1Dto {
  return {
    channelId: "",
    sourceId: "",
    displayNameKey: "",
    channelKind: "major-river",
    traversalRule: "blocks-without-explicit-corridor",
    historicity: "FICTIONAL",
    points: [],
    explanationTags: []
  };
}

function strategicNodeFallback(): SaveStrategicNodeDefinitionV1Dto {
  return {
    nodeId: "",
    sourceId: "",
    displayNameKey: "",
    nodeKind: "objective",
    districtId: 0,
    anchor: { x: 0, y: 0 },
    localCapacity: 0,
    knownState: "unknown",
    terrainPatchIds: [],
    barrierChannelIds: [],
    governanceFootprintIds: [],
    explanationTags: []
  };
}

function routeCorridorFallback(): SaveRouteCorridorDefinitionV1Dto {
  return {
    corridorId: "",
    sourceId: "",
    displayNameKey: "",
    fromNodeId: "",
    toNodeId: "",
    mode: "road",
    widthClass: "standard",
    baseTravelCost: 0,
    baseCapacity: 0,
    riskClass: "unknown",
    terrainPatchIds: [],
    barrierChannelIds: [],
    governanceFootprintIds: [],
    seasonality: [],
    availability: { kind: "open" },
    polyline: [],
    explanationTags: []
  };
}

function districtGovernanceFootprintFallback(): SaveDistrictGovernanceFootprintDefinitionV1Dto {
  return {
    footprintId: "",
    sourceId: "",
    displayNameKey: "",
    districtId: 0,
    overlayOnly: true,
    polygon: [],
    governanceTags: [],
    consequenceTags: []
  };
}

function parseSimpleRuntimeStates(
  input: unknown,
  name: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSimpleRuntimeStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        `body.authoritativeSnapshot.state.${name}`,
        `${name} runtime states must be an array.`
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.${name}[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Runtime state entry must be an object."));
      return { definitionId: 0 };
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0
    };
  });
}

function parsePersonStates(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SavePersonStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state.persons",
        "person states must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.persons[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Person state must be an object."));
      return { definitionId: 0, currentDistrictId: null };
    }
    const currentDistrictId = entry["currentDistrictId"];
    if (currentDistrictId !== null && !isPositiveSafeInteger(currentDistrictId)) {
      errors.push(
        reason(
          "invalid-schema",
          `${path}.currentDistrictId`,
          "currentDistrictId must be a positive safe integer or null."
        )
      );
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0,
      currentDistrictId:
        currentDistrictId === null || isPositiveSafeInteger(currentDistrictId)
          ? currentDistrictId
          : null
    };
  });
}

function parseDistrictStates(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveDistrictStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state.districts",
        "district states must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.districts[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "District state must be an object."));
      return { definitionId: 0, control: { kind: "uncontrolled" } };
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0,
      control: parseDistrictControl(entry["control"], `${path}.control`, errors)
    };
  });
}

function parseDistrictControl(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveDistrictControlDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "District control must be an object."));
    return { kind: "uncontrolled" };
  }
  if (input["kind"] === "uncontrolled") {
    return { kind: "uncontrolled" };
  }
  if (input["kind"] !== "controlled") {
    errors.push(reason("invalid-schema", `${path}.kind`, "District control kind is invalid."));
    return { kind: "uncontrolled" };
  }
  return {
    kind: "controlled",
    controllerPolityId:
      readPositiveSafeInteger(input, "controllerPolityId", `${path}.controllerPolityId`, errors) ??
      0
  };
}

function parseSettlementStates(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSettlementStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state.settlements",
        "settlement states must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.settlements[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Settlement state must be an object."));
      return { definitionId: 0, currentDistrictId: 0 };
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0,
      currentDistrictId:
        readPositiveSafeInteger(entry, "currentDistrictId", `${path}.currentDistrictId`, errors) ??
        0
    };
  });
}

function parseM2EconomyPopulationState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2EconomyPopulationStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 economy population state must be an object."));
    return undefined;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.schemaVersion`,
        "M2 economy population schemaVersion must be 1."
      )
    );
  }

  const populationGroups = parseM2PopulationGroups(input["populationGroups"], path, errors);
  const agriculture = parseM2Agriculture(input["agriculture"], path, errors);
  const market = parseM2Market(input["market"], path, errors);
  const transport = parseM2Transport(input["transport"], `${path}.transport`, errors);

  if (
    populationGroups === undefined ||
    agriculture === undefined ||
    market === undefined ||
    transport === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    populationGroups,
    agriculture,
    market,
    transport
  };
}

function parseM3PolityVassalageState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3PolityVassalageStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 polity vassalage state must be an object."));
    return undefined;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.schemaVersion`,
        "M3 polity vassalage schemaVersion must be 1."
      )
    );
  }

  const polities = parseM3Array(
    input["polities"],
    `${path}.polities`,
    "M3 polities",
    errors,
    parseM3PolityRecord
  );
  const obligations = parseM3Array(
    input["obligations"],
    `${path}.obligations`,
    "M3 obligations",
    errors,
    parseM3Obligation
  );
  const obligationAuditEvents = parseM3Array(
    input["obligationAuditEvents"],
    `${path}.obligationAuditEvents`,
    "M3 obligationAuditEvents",
    errors,
    parseM3ObligationAuditEvent
  );
  const fulfillmentClaims = parseM3Array(
    input["fulfillmentClaims"],
    `${path}.fulfillmentClaims`,
    "M3 fulfillmentClaims",
    errors,
    parseM3FulfillmentClaim
  );
  const administrativeDistricts = parseM3Array(
    input["administrativeDistricts"],
    `${path}.administrativeDistricts`,
    "M3 administrativeDistricts",
    errors,
    parseM3AdministrativeDistrict
  );
  const characters = parseM3Array(
    input["characters"],
    `${path}.characters`,
    "M3 characters",
    errors,
    parseM3Character
  );
  const relationships = parseM3Array(
    input["relationships"],
    `${path}.relationships`,
    "M3 relationships",
    errors,
    parseM3Relationship
  );
  const offices = parseM3Array(
    input["offices"],
    `${path}.offices`,
    "M3 offices",
    errors,
    parseM3Office
  );
  const policies = parseM3Array(
    input["policies"],
    `${path}.policies`,
    "M3 policies",
    errors,
    parseM3Policy
  );
  const enfeoffments = parseM3Array(
    input["enfeoffments"],
    `${path}.enfeoffments`,
    "M3 enfeoffments",
    errors,
    parseM3Enfeoffment
  );
  const appointmentAuditEvents = parseM3Array(
    input["appointmentAuditEvents"],
    `${path}.appointmentAuditEvents`,
    "M3 appointmentAuditEvents",
    errors,
    parseM3AppointmentAuditEvent
  );
  const successionCandidateProfiles = parseM3Array(
    input["successionCandidateProfiles"],
    `${path}.successionCandidateProfiles`,
    "M3 successionCandidateProfiles",
    errors,
    parseM3SuccessionCandidateProfile
  );
  const successionCrises = parseM3Array(
    input["successionCrises"],
    `${path}.successionCrises`,
    "M3 successionCrises",
    errors,
    parseM3SuccessionCrisis
  );

  if (
    polities === undefined ||
    obligations === undefined ||
    obligationAuditEvents === undefined ||
    fulfillmentClaims === undefined ||
    administrativeDistricts === undefined ||
    characters === undefined ||
    relationships === undefined ||
    offices === undefined ||
    policies === undefined ||
    enfeoffments === undefined ||
    appointmentAuditEvents === undefined ||
    successionCandidateProfiles === undefined ||
    successionCrises === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    polities,
    obligations,
    obligationAuditEvents,
    fulfillmentClaims,
    administrativeDistricts,
    characters,
    relationships,
    offices,
    policies,
    enfeoffments,
    appointmentAuditEvents,
    successionCandidateProfiles,
    successionCrises
  };
}

function parseM4CampaignState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M4 campaign state must be an object."));
    return undefined;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", `${path}.schemaVersion`, "M4 campaign schemaVersion must be 1.")
    );
  }

  const campaignPlans = parseM4Array(
    input["campaignPlans"],
    `${path}.campaignPlans`,
    "M4 campaignPlans",
    errors,
    parseM4CampaignPlan
  );
  const factionKnowledgeSnapshots = parseM4Array(
    input["factionKnowledgeSnapshots"],
    `${path}.factionKnowledgeSnapshots`,
    "M4 factionKnowledgeSnapshots",
    errors,
    parseM4FactionKnowledgeSnapshot
  );
  const mobilizedForceCommitments = parseM4Array(
    input["mobilizedForceCommitments"],
    `${path}.mobilizedForceCommitments`,
    "M4 mobilizedForceCommitments",
    errors,
    parseM4MobilizedForceCommitment
  );
  const grainSupplyReservations = parseM4Array(
    input["grainSupplyReservations"],
    `${path}.grainSupplyReservations`,
    "M4 grainSupplyReservations",
    errors,
    parseM4GrainSupplyReservation
  );
  const marches = parseM4Array(
    input["marches"],
    `${path}.marches`,
    "M4 marches",
    errors,
    parseM4CampaignMarch
  );
  const fieldEngagements = parseM4Array(
    input["fieldEngagements"],
    `${path}.fieldEngagements`,
    "M4 fieldEngagements",
    errors,
    parseM4FieldEngagement
  );
  const sieges = parseM4Array(input["sieges"], `${path}.sieges`, "M4 sieges", errors, parseM4Siege);
  const withdrawals = parseM4Array(
    input["withdrawals"],
    `${path}.withdrawals`,
    "M4 withdrawals",
    errors,
    parseM4Withdrawal
  );
  const warOutcomes = parseM4Array(
    input["warOutcomes"],
    `${path}.warOutcomes`,
    "M4 warOutcomes",
    errors,
    parseM4WarOutcome
  );
  const postwarCandidates = parseM4Array(
    input["postwarCandidates"],
    `${path}.postwarCandidates`,
    "M4 postwarCandidates",
    errors,
    parseM4PostwarCandidate
  );

  if (
    campaignPlans === undefined ||
    factionKnowledgeSnapshots === undefined ||
    mobilizedForceCommitments === undefined ||
    grainSupplyReservations === undefined ||
    marches === undefined ||
    fieldEngagements === undefined ||
    sieges === undefined ||
    withdrawals === undefined ||
    warOutcomes === undefined ||
    postwarCandidates === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    campaignPlans,
    factionKnowledgeSnapshots,
    mobilizedForceCommitments,
    grainSupplyReservations,
    marches,
    fieldEngagements,
    sieges,
    withdrawals,
    warOutcomes,
    postwarCandidates
  };
}

function parseM6DiplomacyLegitimacyState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6DiplomacyLegitimacyStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M6 diplomacy legitimacy state must be an object."));
    return undefined;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.schemaVersion`,
        "M6 diplomacy legitimacy schemaVersion must be 1."
      )
    );
  }
  const relations = parseM6Array(
    input["relations"],
    `${path}.relations`,
    "M6 relations",
    errors,
    parseM6Relation
  );
  const agreements = parseM6Array(
    input["agreements"],
    `${path}.agreements`,
    "M6 agreements",
    errors,
    parseM6Agreement
  );
  const recognitionEdges = parseM6Array(
    input["recognitionEdges"],
    `${path}.recognitionEdges`,
    "M6 recognitionEdges",
    errors,
    parseM6RecognitionEdge
  );
  const legitimacySources = parseM6Array(
    input["legitimacySources"],
    `${path}.legitimacySources`,
    "M6 legitimacySources",
    errors,
    parseM6LegitimacySource
  );
  const legitimacyProfiles = parseM6Array(
    input["legitimacyProfiles"],
    `${path}.legitimacyProfiles`,
    "M6 legitimacyProfiles",
    errors,
    parseM6LegitimacyProfile
  );
  if (
    relations === undefined ||
    agreements === undefined ||
    recognitionEdges === undefined ||
    legitimacySources === undefined ||
    legitimacyProfiles === undefined
  ) {
    return undefined;
  }
  return {
    schemaVersion: 1,
    relations,
    agreements,
    recognitionEdges,
    legitimacySources,
    legitimacyProfiles
  };
}

function parseM6Array<TEntry>(
  input: unknown,
  path: string,
  label: string,
  errors: SaveLoadRejectionReasonV1[],
  parseEntry: (entry: unknown, path: string, errors: SaveLoadRejectionReasonV1[]) => TEntry
): readonly TEntry[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${label} must be an array.`));
    return undefined;
  }
  return input.map((entry, index) => parseEntry(entry, `${path}[${index}]`, errors));
}

function readM6Record(
  input: unknown,
  path: string,
  label: string,
  errors: SaveLoadRejectionReasonV1[]
): Record<string, unknown> {
  if (isRecord(input)) {
    return input;
  }

  errors.push(reason("invalid-schema", path, `${label} must be an object.`));
  return {};
}

function parseM6Relation(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6DiplomaticRelationStateDto {
  const record = readM6Record(input, path, "M6 relation", errors);
  return {
    relationId: readPositiveSafeInteger(record, "relationId", `${path}.relationId`, errors) ?? 0,
    polityAId: readPositiveSafeInteger(record, "polityAId", `${path}.polityAId`, errors) ?? 0,
    polityBId: readPositiveSafeInteger(record, "polityBId", `${path}.polityBId`, errors) ?? 0,
    trustBps: readBps(record, "trustBps", `${path}.trustBps`, errors),
    affinityBps: readBps(record, "affinityBps", `${path}.affinityBps`, errors),
    fearBps: readBps(record, "fearBps", `${path}.fearBps`, errors),
    threatBps: readBps(record, "threatBps", `${path}.threatBps`, errors),
    interestAlignmentBps: readBps(
      record,
      "interestAlignmentBps",
      `${path}.interestAlignmentBps`,
      errors
    ),
    historicalDebt:
      readNonnegativeSafeInteger(record, "historicalDebt", `${path}.historicalDebt`, errors) ?? 0,
    borderConflictBps: readBps(record, "borderConflictBps", `${path}.borderConflictBps`, errors),
    updatedDay: readNonnegativeSafeInteger(record, "updatedDay", `${path}.updatedDay`, errors) ?? 0,
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseM6Agreement(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6DiplomaticAgreementStateDto {
  const record = readM6Record(input, path, "M6 agreement", errors);
  return {
    agreementId: readPositiveSafeInteger(record, "agreementId", `${path}.agreementId`, errors) ?? 0,
    relationId: readPositiveSafeInteger(record, "relationId", `${path}.relationId`, errors) ?? 0,
    proposerPolityId:
      readPositiveSafeInteger(record, "proposerPolityId", `${path}.proposerPolityId`, errors) ?? 0,
    targetPolityId:
      readPositiveSafeInteger(record, "targetPolityId", `${path}.targetPolityId`, errors) ?? 0,
    agreementKind: parseM6AgreementKind(record["agreementKind"], `${path}.agreementKind`, errors),
    status: parseM6AgreementStatus(record["status"], `${path}.status`, errors),
    startDay: readNonnegativeSafeInteger(record, "startDay", `${path}.startDay`, errors) ?? 0,
    endDay: readNonnegativeSafeInteger(record, "endDay", `${path}.endDay`, errors) ?? 0,
    recognitionDirection: parseM6RecognitionDirection(
      record["recognitionDirection"],
      `${path}.recognitionDirection`,
      errors
    ),
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseM6RecognitionEdge(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6RecognitionEdgeStateDto {
  const record = readM6Record(input, path, "M6 recognition edge", errors);
  return {
    fromPolityId:
      readPositiveSafeInteger(record, "fromPolityId", `${path}.fromPolityId`, errors) ?? 0,
    toPolityId: readPositiveSafeInteger(record, "toPolityId", `${path}.toPolityId`, errors) ?? 0,
    agreementId: readPositiveSafeInteger(record, "agreementId", `${path}.agreementId`, errors) ?? 0,
    reasonCode: readString(record, "reasonCode", `${path}.reasonCode`, errors)
  };
}

function parseM6LegitimacySource(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6LegitimacySourceStateDto {
  const record = readM6Record(input, path, "M6 legitimacy source", errors);
  return {
    sourceId: readPositiveSafeInteger(record, "sourceId", `${path}.sourceId`, errors) ?? 0,
    polityId: readPositiveSafeInteger(record, "polityId", `${path}.polityId`, errors) ?? 0,
    audience: parseM6Audience(record["audience"], `${path}.audience`, errors),
    sourceKind: parseM6SourceKind(record["sourceKind"], `${path}.sourceKind`, errors),
    magnitudeBps:
      readIntegerInRange(record, "magnitudeBps", `${path}.magnitudeBps`, -10_000, 10_000, errors) ??
      0,
    sourceRef: readString(record, "sourceRef", `${path}.sourceRef`, errors),
    reasonCode: readString(record, "reasonCode", `${path}.reasonCode`, errors),
    createdDay: readNonnegativeSafeInteger(record, "createdDay", `${path}.createdDay`, errors) ?? 0
  };
}

function parseM6LegitimacyProfile(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6LegitimacyProfileStateDto {
  const record = readM6Record(input, path, "M6 legitimacy profile", errors);
  return {
    polityId: readPositiveSafeInteger(record, "polityId", `${path}.polityId`, errors) ?? 0,
    audience: parseM6Audience(record["audience"], `${path}.audience`, errors),
    scoreBps: readBps(record, "scoreBps", `${path}.scoreBps`, errors),
    pressureBps: readBps(record, "pressureBps", `${path}.pressureBps`, errors),
    sourceIds: parsePositiveIntegerArray(record["sourceIds"], `${path}.sourceIds`, errors) ?? [],
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseM6PolicyEventRuntimeState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventRuntimeStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M6 policy/event runtime state must be an object."));
    return undefined;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.schemaVersion`,
        "M6 policy/event runtime schemaVersion must be 1."
      )
    );
  }
  const definitions = input["definitions"];
  if (!isRecord(definitions)) {
    errors.push(reason("invalid-schema", `${path}.definitions`, "M6 definitions must be object."));
    return undefined;
  }
  const policies = parseM6Array(
    definitions["policies"],
    `${path}.definitions.policies`,
    "M6 policy definitions",
    errors,
    parseM6PolicyDefinition
  );
  const events = parseM6Array(
    definitions["events"],
    `${path}.definitions.events`,
    "M6 event definitions",
    errors,
    parseM6PolicyEventDefinition
  );
  const activeEvents = parseM6Array(
    input["activeEvents"],
    `${path}.activeEvents`,
    "M6 active events",
    errors,
    parseM6PolicyEventActive
  );
  const resolvedEvents = parseM6Array(
    input["resolvedEvents"],
    `${path}.resolvedEvents`,
    "M6 resolved events",
    errors,
    parseM6PolicyEventResolved
  );
  const policyModifiers = parseM6Array(
    input["policyModifiers"],
    `${path}.policyModifiers`,
    "M6 policy modifiers",
    errors,
    parseM6PolicyModifier
  );
  const nextEventInstanceId =
    readPositiveSafeInteger(input, "nextEventInstanceId", `${path}.nextEventInstanceId`, errors) ??
    0;
  const nextModifierId =
    readPositiveSafeInteger(input, "nextModifierId", `${path}.nextModifierId`, errors) ?? 0;
  if (
    policies === undefined ||
    events === undefined ||
    activeEvents === undefined ||
    resolvedEvents === undefined ||
    policyModifiers === undefined
  ) {
    return undefined;
  }
  return {
    schemaVersion: 1,
    definitions: { policies, events },
    activeEvents,
    resolvedEvents,
    policyModifiers,
    nextEventInstanceId,
    nextModifierId
  };
}

function parseM6PolicyDefinition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyDefinitionStateDto {
  const record = readM6Record(input, path, "M6 policy definition", errors);
  return {
    policyId: readPositiveSafeInteger(record, "policyId", `${path}.policyId`, errors) ?? 0,
    sourceId: readString(record, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readString(record, "displayNameKey", `${path}.displayNameKey`, errors),
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors),
    encyclopediaRefs: parseStringArray(
      record["encyclopediaRefs"],
      `${path}.encyclopediaRefs`,
      errors
    )
  };
}

function parseM6PolicyEventDefinition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventDefinitionStateDto {
  const record = readM6Record(input, path, "M6 event definition", errors);
  return {
    eventDefinitionId:
      readPositiveSafeInteger(record, "eventDefinitionId", `${path}.eventDefinitionId`, errors) ??
      0,
    sourceId: readString(record, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readString(record, "displayNameKey", `${path}.displayNameKey`, errors),
    cause: parseM6PolicyEventCause(record["cause"], `${path}.cause`, errors),
    options:
      parseM6Array(
        record["options"],
        `${path}.options`,
        "M6 event options",
        errors,
        parseM6PolicyEventOption
      ) ?? [],
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors),
    encyclopediaRefs: parseStringArray(
      record["encyclopediaRefs"],
      `${path}.encyclopediaRefs`,
      errors
    )
  };
}

function parseM6PolicyEventCause(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventCauseStateDto {
  const record = readM6Record(input, path, "M6 event cause", errors);
  if (record["kind"] !== "day-at-least") {
    errors.push(reason("invalid-schema", `${path}.kind`, "M6 event cause kind is invalid."));
  }
  return {
    kind: "day-at-least",
    day: readNonnegativeSafeInteger(record, "day", `${path}.day`, errors) ?? 0,
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseM6PolicyEventOption(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventOptionStateDto {
  const record = readM6Record(input, path, "M6 event option", errors);
  return {
    optionId: readPositiveSafeInteger(record, "optionId", `${path}.optionId`, errors) ?? 0,
    displayNameKey: readString(record, "displayNameKey", `${path}.displayNameKey`, errors),
    consequences:
      parseM6Array(
        record["consequences"],
        `${path}.consequences`,
        "M6 event consequences",
        errors,
        parseM6PolicyEventConsequence
      ) ?? [],
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors),
    encyclopediaRefs: parseStringArray(
      record["encyclopediaRefs"],
      `${path}.encyclopediaRefs`,
      errors
    )
  };
}

function parseM6PolicyEventConsequence(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventConsequenceStateDto {
  const record = readM6Record(input, path, "M6 event consequence", errors);
  if (record["kind"] !== "policy-modifier") {
    errors.push(reason("invalid-schema", `${path}.kind`, "M6 consequence kind is invalid."));
  }
  return {
    kind: "policy-modifier",
    policyId: readPositiveSafeInteger(record, "policyId", `${path}.policyId`, errors) ?? 0,
    magnitudeBps:
      readIntegerInRange(record, "magnitudeBps", `${path}.magnitudeBps`, -10_000, 10_000, errors) ??
      0,
    durationDays:
      readPositiveSafeInteger(record, "durationDays", `${path}.durationDays`, errors) ?? 0,
    reasonCode: readString(record, "reasonCode", `${path}.reasonCode`, errors)
  };
}

function parseM6PolicyEventActive(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventRuntimeStateDto["activeEvents"][number] {
  const record = readM6Record(input, path, "M6 active event", errors);
  return {
    eventInstanceId:
      readPositiveSafeInteger(record, "eventInstanceId", `${path}.eventInstanceId`, errors) ?? 0,
    eventDefinitionId:
      readPositiveSafeInteger(record, "eventDefinitionId", `${path}.eventDefinitionId`, errors) ??
      0,
    activatedDay:
      readNonnegativeSafeInteger(record, "activatedDay", `${path}.activatedDay`, errors) ?? 0,
    causeReasonCodes: parseStringArray(
      record["causeReasonCodes"],
      `${path}.causeReasonCodes`,
      errors
    )
  };
}

function parseM6PolicyEventResolved(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventRuntimeStateDto["resolvedEvents"][number] {
  const record = readM6Record(input, path, "M6 resolved event", errors);
  return {
    eventInstanceId:
      readPositiveSafeInteger(record, "eventInstanceId", `${path}.eventInstanceId`, errors) ?? 0,
    eventDefinitionId:
      readPositiveSafeInteger(record, "eventDefinitionId", `${path}.eventDefinitionId`, errors) ??
      0,
    selectedOptionId:
      readPositiveSafeInteger(record, "selectedOptionId", `${path}.selectedOptionId`, errors) ?? 0,
    resolvedDay:
      readNonnegativeSafeInteger(record, "resolvedDay", `${path}.resolvedDay`, errors) ?? 0,
    reasonCodes: parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseM6PolicyModifier(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6PolicyEventRuntimeStateDto["policyModifiers"][number] {
  const record = readM6Record(input, path, "M6 policy modifier", errors);
  return {
    modifierId: readPositiveSafeInteger(record, "modifierId", `${path}.modifierId`, errors) ?? 0,
    policyId: readPositiveSafeInteger(record, "policyId", `${path}.policyId`, errors) ?? 0,
    eventInstanceId:
      readPositiveSafeInteger(record, "eventInstanceId", `${path}.eventInstanceId`, errors) ?? 0,
    magnitudeBps:
      readIntegerInRange(record, "magnitudeBps", `${path}.magnitudeBps`, -10_000, 10_000, errors) ??
      0,
    startDay: readNonnegativeSafeInteger(record, "startDay", `${path}.startDay`, errors) ?? 0,
    endDay: readNonnegativeSafeInteger(record, "endDay", `${path}.endDay`, errors) ?? 0,
    reasonCode: readString(record, "reasonCode", `${path}.reasonCode`, errors)
  };
}

function parseM4Array<TEntry>(
  input: unknown,
  path: string,
  label: string,
  errors: SaveLoadRejectionReasonV1[],
  parseEntry: (
    entry: unknown,
    path: string,
    errors: SaveLoadRejectionReasonV1[]
  ) => TEntry | undefined
): readonly TEntry[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${label} must be an array.`));
    return undefined;
  }

  const entries: TEntry[] = [];
  input.forEach((entry, index) => {
    const parsed = parseEntry(entry, `${path}[${index}]`, errors);
    if (parsed !== undefined) {
      entries.push(parsed);
    }
  });
  return entries;
}

function readM4Record(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): Record<string, unknown> | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M4 save entry must be an object."));
    return undefined;
  }

  return input;
}

function parseM4CampaignPlan(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignPlanStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const owner = parseM4CampaignOwner(record["owner"], `${path}.owner`, errors);
  const target = parseM4CampaignTarget(record["target"], `${path}.target`, errors);
  const startWindow = parseM4StartWindow(record["startWindow"], `${path}.startWindow`, errors);
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  if (owner === undefined || target === undefined || startWindow === undefined) {
    return undefined;
  }

  return {
    id: readPositiveSafeInteger(record, "id", `${path}.id`, errors) ?? 0,
    owner,
    target,
    objectiveKind: parseM4CampaignObjectiveKind(
      record["objectiveKind"],
      `${path}.objectiveKind`,
      errors
    ),
    startWindow,
    status: parseM4CampaignPlanStatus(record["status"], `${path}.status`, errors),
    statusReasonCode:
      readNonEmptyString(record, "statusReasonCode", `${path}.statusReasonCode`, errors) ?? "",
    reasonCodes,
    createdDay: readNonnegativeSafeInteger(record, "createdDay", `${path}.createdDay`, errors) ?? 0,
    updatedDay: readNonnegativeSafeInteger(record, "updatedDay", `${path}.updatedDay`, errors) ?? 0
  };
}

function parseM4FactionKnowledgeSnapshot(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4FactionKnowledgeSnapshotStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const source = parseM4FactionKnowledgeSource(record["source"], `${path}.source`, errors);
  const knownObjectives = parseM4Array(
    record["knownObjectives"],
    `${path}.knownObjectives`,
    "M4 knownObjectives",
    errors,
    parseM4KnownObjectiveEstimate
  );
  const routeEstimates = parseM4Array(
    record["routeEstimates"],
    `${path}.routeEstimates`,
    "M4 routeEstimates",
    errors,
    parseM4RouteEstimate
  );
  const supplyEstimates = parseM4Array(
    record["supplyEstimates"],
    `${path}.supplyEstimates`,
    "M4 supplyEstimates",
    errors,
    parseM4SupplyEstimate
  );
  const defenderEstimates = parseM4Array(
    record["defenderEstimates"],
    `${path}.defenderEstimates`,
    "M4 defenderEstimates",
    errors,
    parseM4DefenderEstimate
  );
  if (
    source === undefined ||
    knownObjectives === undefined ||
    routeEstimates === undefined ||
    supplyEstimates === undefined ||
    defenderEstimates === undefined
  ) {
    return undefined;
  }

  return {
    snapshotId: readPositiveSafeInteger(record, "snapshotId", `${path}.snapshotId`, errors) ?? 0,
    observerPolityId:
      readPositiveSafeInteger(record, "observerPolityId", `${path}.observerPolityId`, errors) ?? 0,
    subjectPolityId:
      readPositiveSafeInteger(record, "subjectPolityId", `${path}.subjectPolityId`, errors) ?? 0,
    knowledgeVersion:
      readNonnegativeSafeInteger(record, "knowledgeVersion", `${path}.knowledgeVersion`, errors) ??
      0,
    recordedDay:
      readNonnegativeSafeInteger(record, "recordedDay", `${path}.recordedDay`, errors) ?? 0,
    source,
    knownObjectives,
    routeEstimates,
    supplyEstimates,
    defenderEstimates
  };
}

function parseM4MobilizedForceCommitment(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4MobilizedForceCommitmentStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const source = parseM4MusterCommitmentSource(record["source"], `${path}.source`, errors);
  const assemblyWindow = parseM4StartWindow(
    record["assemblyWindow"],
    `${path}.assemblyWindow`,
    errors
  );
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  const localCostHooks = parseM4Array(
    record["localCostHooks"],
    `${path}.localCostHooks`,
    "M4 localCostHooks",
    errors,
    parseM4MusterLocalCostHook
  );
  if (source === undefined || assemblyWindow === undefined || localCostHooks === undefined) {
    return undefined;
  }

  return {
    id: readPositiveSafeInteger(record, "id", `${path}.id`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    source,
    promisedTroops:
      readPositiveSafeInteger(record, "promisedTroops", `${path}.promisedTroops`, errors) ?? 0,
    dueDay: readNonnegativeSafeInteger(record, "dueDay", `${path}.dueDay`, errors) ?? 0,
    assemblyWindow,
    plannedAssemblyDay:
      readNonnegativeSafeInteger(
        record,
        "plannedAssemblyDay",
        `${path}.plannedAssemblyDay`,
        errors
      ) ?? 0,
    assembledTroops:
      readNonnegativeSafeInteger(record, "assembledTroops", `${path}.assembledTroops`, errors) ?? 0,
    delayedTroops:
      readNonnegativeSafeInteger(record, "delayedTroops", `${path}.delayedTroops`, errors) ?? 0,
    refusedTroops:
      readNonnegativeSafeInteger(record, "refusedTroops", `${path}.refusedTroops`, errors) ?? 0,
    releasedTroops:
      readNonnegativeSafeInteger(record, "releasedTroops", `${path}.releasedTroops`, errors) ?? 0,
    status: parseM4MusterCommitmentStatus(record["status"], `${path}.status`, errors),
    statusReasonCode:
      readNonEmptyString(record, "statusReasonCode", `${path}.statusReasonCode`, errors) ?? "",
    reasonCodes,
    localCostHooks
  };
}

function parseM4GrainSupplyReservation(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4GrainSupplyReservationStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const source = parseM4GrainSupplySource(record["source"], `${path}.source`, errors);
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  if (source === undefined) {
    return undefined;
  }

  return {
    reservationId:
      readPositiveSafeInteger(record, "reservationId", `${path}.reservationId`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    source,
    reservedAmount:
      readNonnegativeSafeInteger(record, "reservedAmount", `${path}.reservedAmount`, errors) ?? 0,
    carriedAmount:
      readNonnegativeSafeInteger(record, "carriedAmount", `${path}.carriedAmount`, errors) ?? 0,
    consumedAmount:
      readNonnegativeSafeInteger(record, "consumedAmount", `${path}.consumedAmount`, errors) ?? 0,
    shortageAmount:
      readNonnegativeSafeInteger(record, "shortageAmount", `${path}.shortageAmount`, errors) ?? 0,
    lossAmount: readNonnegativeSafeInteger(record, "lossAmount", `${path}.lossAmount`, errors) ?? 0,
    lossReasonCode: readNullableString(record, "lossReasonCode", `${path}.lossReasonCode`, errors),
    expectedDailyConsumption:
      readPositiveSafeInteger(
        record,
        "expectedDailyConsumption",
        `${path}.expectedDailyConsumption`,
        errors
      ) ?? 0,
    expectedDaysOfSupply:
      readNonnegativeSafeInteger(
        record,
        "expectedDaysOfSupply",
        `${path}.expectedDaysOfSupply`,
        errors
      ) ?? 0,
    status: parseM4GrainSupplyReservationStatus(record["status"], `${path}.status`, errors),
    statusReasonCode:
      readNonEmptyString(record, "statusReasonCode", `${path}.statusReasonCode`, errors) ?? "",
    reasonCodes
  };
}

function parseM4CampaignMarch(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignMarchStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const routeSegments = parseM4Array(
    record["routeSegments"],
    `${path}.routeSegments`,
    "M4 routeSegments",
    errors,
    parseM4MarchRouteSegment
  );
  const supply = parseM4MarchSupply(record["supply"], `${path}.supply`, errors);
  const predictedArrivalWindow = parseM4StartWindow(
    record["predictedArrivalWindow"],
    `${path}.predictedArrivalWindow`,
    errors
  );
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  const joinedCommitmentIds = parsePositiveIntegerArray(
    record["joinedCommitmentIds"],
    `${path}.joinedCommitmentIds`,
    errors
  );
  const joinedCommitmentTroops = parseM4Array(
    record["joinedCommitmentTroops"],
    `${path}.joinedCommitmentTroops`,
    "M4 joinedCommitmentTroops",
    errors,
    parseM4JoinedCommitmentTroops
  );
  const failedCommitmentIds = parsePositiveIntegerArray(
    record["failedCommitmentIds"],
    `${path}.failedCommitmentIds`,
    errors
  );
  if (
    routeSegments === undefined ||
    supply === undefined ||
    predictedArrivalWindow === undefined ||
    joinedCommitmentIds === undefined ||
    joinedCommitmentTroops === undefined ||
    failedCommitmentIds === undefined
  ) {
    return undefined;
  }

  return {
    marchId: readPositiveSafeInteger(record, "marchId", `${path}.marchId`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    originDistrictId:
      readPositiveSafeInteger(record, "originDistrictId", `${path}.originDistrictId`, errors) ?? 0,
    targetDistrictId:
      readPositiveSafeInteger(record, "targetDistrictId", `${path}.targetDistrictId`, errors) ?? 0,
    currentDistrictId:
      readPositiveSafeInteger(record, "currentDistrictId", `${path}.currentDistrictId`, errors) ??
      0,
    routeSegments,
    currentSegmentIndex:
      readNonnegativeSafeInteger(
        record,
        "currentSegmentIndex",
        `${path}.currentSegmentIndex`,
        errors
      ) ?? 0,
    progressOnSegmentDays:
      readNonnegativeSafeInteger(
        record,
        "progressOnSegmentDays",
        `${path}.progressOnSegmentDays`,
        errors
      ) ?? 0,
    activeTroops:
      readNonnegativeSafeInteger(record, "activeTroops", `${path}.activeTroops`, errors) ?? 0,
    grainPerTroopPerDay:
      readPositiveSafeInteger(
        record,
        "grainPerTroopPerDay",
        `${path}.grainPerTroopPerDay`,
        errors
      ) ?? 0,
    supply,
    status: parseM4CampaignMarchStatus(record["status"], `${path}.status`, errors),
    statusReasonCode:
      readNonEmptyString(record, "statusReasonCode", `${path}.statusReasonCode`, errors) ?? "",
    reasonCodes,
    startedDay: readNonnegativeSafeInteger(record, "startedDay", `${path}.startedDay`, errors) ?? 0,
    updatedDay: readNonnegativeSafeInteger(record, "updatedDay", `${path}.updatedDay`, errors) ?? 0,
    predictedArrivalWindow,
    actualArrivalDay: readNullableNonnegativeSafeInteger(
      record,
      "actualArrivalDay",
      `${path}.actualArrivalDay`,
      errors
    ),
    joinedCommitmentIds,
    joinedCommitmentTroops,
    failedCommitmentIds
  };
}

function parseM4FieldEngagement(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4FieldEngagementStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const target = parseM4CampaignTarget(record["target"], `${path}.target`, errors);
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  const creditHooks = parseM4Array(
    record["creditHooks"],
    `${path}.creditHooks`,
    "M4 creditHooks",
    errors,
    parseM4CampaignHook
  );
  const reputationHooks = parseM4Array(
    record["reputationHooks"],
    `${path}.reputationHooks`,
    "M4 reputationHooks",
    errors,
    parseM4CampaignHook
  );
  if (target === undefined || creditHooks === undefined || reputationHooks === undefined) {
    return undefined;
  }

  return {
    engagementId:
      readPositiveSafeInteger(record, "engagementId", `${path}.engagementId`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    marchId: readPositiveSafeInteger(record, "marchId", `${path}.marchId`, errors) ?? 0,
    attackerPolityId:
      readPositiveSafeInteger(record, "attackerPolityId", `${path}.attackerPolityId`, errors) ?? 0,
    defenderPolityId:
      readPositiveSafeInteger(record, "defenderPolityId", `${path}.defenderPolityId`, errors) ?? 0,
    target,
    attackerTroopsBefore:
      readNonnegativeSafeInteger(
        record,
        "attackerTroopsBefore",
        `${path}.attackerTroopsBefore`,
        errors
      ) ?? 0,
    attackerTroopsAfter:
      readNonnegativeSafeInteger(
        record,
        "attackerTroopsAfter",
        `${path}.attackerTroopsAfter`,
        errors
      ) ?? 0,
    defenderEstimatedTroopsBefore:
      readNonnegativeSafeInteger(
        record,
        "defenderEstimatedTroopsBefore",
        `${path}.defenderEstimatedTroopsBefore`,
        errors
      ) ?? 0,
    defenderEstimatedTroopsAfter:
      readNonnegativeSafeInteger(
        record,
        "defenderEstimatedTroopsAfter",
        `${path}.defenderEstimatedTroopsAfter`,
        errors
      ) ?? 0,
    attackerCasualties:
      readNonnegativeSafeInteger(
        record,
        "attackerCasualties",
        `${path}.attackerCasualties`,
        errors
      ) ?? 0,
    defenderCasualties:
      readNonnegativeSafeInteger(
        record,
        "defenderCasualties",
        `${path}.defenderCasualties`,
        errors
      ) ?? 0,
    supplyLoss: readNonnegativeSafeInteger(record, "supplyLoss", `${path}.supplyLoss`, errors) ?? 0,
    defenderFortification:
      readNonnegativeSafeInteger(
        record,
        "defenderFortification",
        `${path}.defenderFortification`,
        errors
      ) ?? 0,
    outcome: parseM4FieldEngagementOutcome(record["outcome"], `${path}.outcome`, errors),
    reasonCodes,
    creditHooks,
    reputationHooks,
    resolvedDay:
      readNonnegativeSafeInteger(record, "resolvedDay", `${path}.resolvedDay`, errors) ?? 0
  };
}

function parseM4Siege(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4SiegeStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const surrenderReasonCodes = parseStringArray(
    record["surrenderReasonCodes"],
    `${path}.surrenderReasonCodes`,
    errors
  );
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  const creditHooks = parseM4Array(
    record["creditHooks"],
    `${path}.creditHooks`,
    "M4 creditHooks",
    errors,
    parseM4CampaignHook
  );
  const reputationHooks = parseM4Array(
    record["reputationHooks"],
    `${path}.reputationHooks`,
    "M4 reputationHooks",
    errors,
    parseM4CampaignHook
  );
  if (creditHooks === undefined || reputationHooks === undefined) {
    return undefined;
  }

  return {
    siegeId: readPositiveSafeInteger(record, "siegeId", `${path}.siegeId`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    marchId: readPositiveSafeInteger(record, "marchId", `${path}.marchId`, errors) ?? 0,
    targetDistrictId:
      readPositiveSafeInteger(record, "targetDistrictId", `${path}.targetDistrictId`, errors) ?? 0,
    attackerPolityId:
      readPositiveSafeInteger(record, "attackerPolityId", `${path}.attackerPolityId`, errors) ?? 0,
    defenderPolityId:
      readPositiveSafeInteger(record, "defenderPolityId", `${path}.defenderPolityId`, errors) ?? 0,
    status: parseM4SiegeStatus(record["status"], `${path}.status`, errors),
    statusReasonCode:
      readNonEmptyString(record, "statusReasonCode", `${path}.statusReasonCode`, errors) ?? "",
    fortification:
      readNonnegativeSafeInteger(record, "fortification", `${path}.fortification`, errors) ?? 0,
    defenderEstimatedTroops:
      readNonnegativeSafeInteger(
        record,
        "defenderEstimatedTroops",
        `${path}.defenderEstimatedTroops`,
        errors
      ) ?? 0,
    defenderSupply:
      readNonnegativeSafeInteger(record, "defenderSupply", `${path}.defenderSupply`, errors) ?? 0,
    siegeProgress:
      readNonnegativeSafeInteger(record, "siegeProgress", `${path}.siegeProgress`, errors) ?? 0,
    daysInvested:
      readNonnegativeSafeInteger(record, "daysInvested", `${path}.daysInvested`, errors) ?? 0,
    blockadeDays:
      readNonnegativeSafeInteger(record, "blockadeDays", `${path}.blockadeDays`, errors) ?? 0,
    assaultCount:
      readNonnegativeSafeInteger(record, "assaultCount", `${path}.assaultCount`, errors) ?? 0,
    attackerTroops:
      readNonnegativeSafeInteger(record, "attackerTroops", `${path}.attackerTroops`, errors) ?? 0,
    attackerCasualties:
      readNonnegativeSafeInteger(
        record,
        "attackerCasualties",
        `${path}.attackerCasualties`,
        errors
      ) ?? 0,
    defenderCasualties:
      readNonnegativeSafeInteger(
        record,
        "defenderCasualties",
        `${path}.defenderCasualties`,
        errors
      ) ?? 0,
    supplyLoss: readNonnegativeSafeInteger(record, "supplyLoss", `${path}.supplyLoss`, errors) ?? 0,
    surrenderEligible: readBoolean(
      record,
      "surrenderEligible",
      `${path}.surrenderEligible`,
      errors
    ),
    surrenderReasonCodes,
    reasonCodes,
    creditHooks,
    reputationHooks,
    startedDay: readNonnegativeSafeInteger(record, "startedDay", `${path}.startedDay`, errors) ?? 0,
    updatedDay: readNonnegativeSafeInteger(record, "updatedDay", `${path}.updatedDay`, errors) ?? 0
  };
}

function parseM4Withdrawal(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4WithdrawalStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const creditHooks = parseM4Array(
    record["creditHooks"],
    `${path}.creditHooks`,
    "M4 creditHooks",
    errors,
    parseM4CampaignHook
  );
  const reputationHooks = parseM4Array(
    record["reputationHooks"],
    `${path}.reputationHooks`,
    "M4 reputationHooks",
    errors,
    parseM4CampaignHook
  );
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  if (creditHooks === undefined || reputationHooks === undefined) {
    return undefined;
  }

  return {
    withdrawalId:
      readPositiveSafeInteger(record, "withdrawalId", `${path}.withdrawalId`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    marchId: readNullablePositiveSafeInteger(record, "marchId", `${path}.marchId`, errors),
    siegeId: readNullablePositiveSafeInteger(record, "siegeId", `${path}.siegeId`, errors),
    kind: parseM4WithdrawalKind(record["kind"], `${path}.kind`, errors),
    triggerReason: parseM4WithdrawalTrigger(
      record["triggerReason"],
      `${path}.triggerReason`,
      errors
    ),
    troopsBefore:
      readNonnegativeSafeInteger(record, "troopsBefore", `${path}.troopsBefore`, errors) ?? 0,
    troopsExtracted:
      readNonnegativeSafeInteger(record, "troopsExtracted", `${path}.troopsExtracted`, errors) ?? 0,
    casualties: readNonnegativeSafeInteger(record, "casualties", `${path}.casualties`, errors) ?? 0,
    supplyLoss: readNonnegativeSafeInteger(record, "supplyLoss", `${path}.supplyLoss`, errors) ?? 0,
    creditHooks,
    reputationHooks,
    reasonCodes,
    resolvedDay:
      readNonnegativeSafeInteger(record, "resolvedDay", `${path}.resolvedDay`, errors) ?? 0
  };
}

function parseM4WarOutcome(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4WarOutcomeStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const postwarCandidate =
    record["postwarCandidate"] === null
      ? null
      : parseM4PostwarCandidate(record["postwarCandidate"], `${path}.postwarCandidate`, errors);
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  if (postwarCandidate === undefined) {
    return undefined;
  }

  return {
    outcomeId: readPositiveSafeInteger(record, "outcomeId", `${path}.outcomeId`, errors) ?? 0,
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    victorPolityId:
      readPositiveSafeInteger(record, "victorPolityId", `${path}.victorPolityId`, errors) ?? 0,
    localPolityId:
      readPositiveSafeInteger(record, "localPolityId", `${path}.localPolityId`, errors) ?? 0,
    targetDistrictId:
      readPositiveSafeInteger(record, "targetDistrictId", `${path}.targetDistrictId`, errors) ?? 0,
    attackerCasualties:
      readNonnegativeSafeInteger(
        record,
        "attackerCasualties",
        `${path}.attackerCasualties`,
        errors
      ) ?? 0,
    defenderCasualties:
      readNonnegativeSafeInteger(
        record,
        "defenderCasualties",
        `${path}.defenderCasualties`,
        errors
      ) ?? 0,
    supplyLoss: readNonnegativeSafeInteger(record, "supplyLoss", `${path}.supplyLoss`, errors) ?? 0,
    withdrawalId: readNullablePositiveSafeInteger(
      record,
      "withdrawalId",
      `${path}.withdrawalId`,
      errors
    ),
    siegeId: readNullablePositiveSafeInteger(record, "siegeId", `${path}.siegeId`, errors),
    postwarCandidate,
    reasonCodes,
    resolvedDay:
      readNonnegativeSafeInteger(record, "resolvedDay", `${path}.resolvedDay`, errors) ?? 0
  };
}

function parseM4PostwarCandidate(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4PostwarCandidateStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const validM3Methods = parseM4PostwarMethodArray(
    record["validM3Methods"],
    `${path}.validM3Methods`,
    errors
  );
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  if (validM3Methods === undefined) {
    return undefined;
  }

  return {
    candidateId: readNonEmptyString(record, "candidateId", `${path}.candidateId`, errors) ?? "",
    sourceWarOutcomeId:
      readPositiveSafeInteger(record, "sourceWarOutcomeId", `${path}.sourceWarOutcomeId`, errors) ??
      0,
    settlementId: readNonEmptyString(record, "settlementId", `${path}.settlementId`, errors) ?? "",
    victorPolityId:
      readPositiveSafeInteger(record, "victorPolityId", `${path}.victorPolityId`, errors) ?? 0,
    localPolityId:
      readPositiveSafeInteger(record, "localPolityId", `${path}.localPolityId`, errors) ?? 0,
    districtId: readPositiveSafeInteger(record, "districtId", `${path}.districtId`, errors) ?? 0,
    validM3Methods,
    reasonCodes
  };
}

function parseM4CampaignOwner(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignOwnerDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const kind = record["kind"];
  if (kind === "commander") {
    return {
      kind,
      characterId:
        readPositiveSafeInteger(record, "characterId", `${path}.characterId`, errors) ?? 0
    };
  }
  if (kind === "polity") {
    return {
      kind,
      polityId: readPositiveSafeInteger(record, "polityId", `${path}.polityId`, errors) ?? 0
    };
  }
  errors.push(reason("invalid-schema", `${path}.kind`, "M4 campaign owner kind is invalid."));
  return undefined;
}

function parseM4CampaignTarget(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignTargetDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const kind = record["kind"];
  if (kind === "district") {
    return {
      kind,
      districtId: readPositiveSafeInteger(record, "districtId", `${path}.districtId`, errors) ?? 0
    };
  }
  if (kind === "polity") {
    return {
      kind,
      polityId: readPositiveSafeInteger(record, "polityId", `${path}.polityId`, errors) ?? 0
    };
  }
  errors.push(reason("invalid-schema", `${path}.kind`, "M4 campaign target kind is invalid."));
  return undefined;
}

function parseM4StartWindow(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignStartWindowDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    earliestDay:
      readNonnegativeSafeInteger(record, "earliestDay", `${path}.earliestDay`, errors) ?? 0,
    latestDay: readNonnegativeSafeInteger(record, "latestDay", `${path}.latestDay`, errors) ?? 0
  };
}

function parseM4FactionKnowledgeSource(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4FactionKnowledgeSourceDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    kind: parseM4FactionKnowledgeSourceKind(record["kind"], `${path}.kind`, errors),
    sourceId: readNonEmptyString(record, "sourceId", `${path}.sourceId`, errors) ?? "",
    reliabilityBps:
      readNonnegativeSafeInteger(record, "reliabilityBps", `${path}.reliabilityBps`, errors) ?? 0
  };
}

function parseM4KnownObjectiveEstimate(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4KnownObjectiveEstimateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const target = parseM4CampaignTarget(record["target"], `${path}.target`, errors);
  const reasonCodes = parseStringArray(record["reasonCodes"], `${path}.reasonCodes`, errors);
  if (target === undefined) {
    return undefined;
  }
  return {
    campaignPlanId:
      readPositiveSafeInteger(record, "campaignPlanId", `${path}.campaignPlanId`, errors) ?? 0,
    target,
    objectiveKind: parseM4CampaignObjectiveKind(
      record["objectiveKind"],
      `${path}.objectiveKind`,
      errors
    ),
    confidenceBps:
      readNonnegativeSafeInteger(record, "confidenceBps", `${path}.confidenceBps`, errors) ?? 0,
    reasonCodes
  };
}

function parseM4RouteEstimate(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4RouteEstimateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    routeId: readPositiveSafeInteger(record, "routeId", `${path}.routeId`, errors) ?? 0,
    fromDistrictId:
      readPositiveSafeInteger(record, "fromDistrictId", `${path}.fromDistrictId`, errors) ?? 0,
    toDistrictId:
      readPositiveSafeInteger(record, "toDistrictId", `${path}.toDistrictId`, errors) ?? 0,
    travelCostEstimate:
      readPositiveSafeInteger(record, "travelCostEstimate", `${path}.travelCostEstimate`, errors) ??
      0,
    capacityEstimate:
      readNonnegativeSafeInteger(record, "capacityEstimate", `${path}.capacityEstimate`, errors) ??
      0,
    confidenceBps:
      readNonnegativeSafeInteger(record, "confidenceBps", `${path}.confidenceBps`, errors) ?? 0
  };
}

function parseM4SupplyEstimate(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4SupplyEstimateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    districtId: readPositiveSafeInteger(record, "districtId", `${path}.districtId`, errors) ?? 0,
    supplyMin: readNonnegativeSafeInteger(record, "supplyMin", `${path}.supplyMin`, errors) ?? 0,
    supplyMax: readNonnegativeSafeInteger(record, "supplyMax", `${path}.supplyMax`, errors) ?? 0,
    confidenceBps:
      readNonnegativeSafeInteger(record, "confidenceBps", `${path}.confidenceBps`, errors) ?? 0
  };
}

function parseM4DefenderEstimate(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4DefenderEstimateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const target = parseM4CampaignTarget(record["target"], `${path}.target`, errors);
  if (target === undefined) {
    return undefined;
  }
  return {
    target,
    defenderMin:
      readNonnegativeSafeInteger(record, "defenderMin", `${path}.defenderMin`, errors) ?? 0,
    defenderMax:
      readNonnegativeSafeInteger(record, "defenderMax", `${path}.defenderMax`, errors) ?? 0,
    confidenceBps:
      readNonnegativeSafeInteger(record, "confidenceBps", `${path}.confidenceBps`, errors) ?? 0
  };
}

function parseM4MusterCommitmentSource(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4MusterCommitmentSourceDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  if (record["kind"] !== "m3-obligation") {
    errors.push(reason("invalid-schema", `${path}.kind`, "M4 muster source kind is invalid."));
  }
  return {
    kind: "m3-obligation",
    obligationId:
      readPositiveSafeInteger(record, "obligationId", `${path}.obligationId`, errors) ?? 0,
    debtorPolityId:
      readPositiveSafeInteger(record, "debtorPolityId", `${path}.debtorPolityId`, errors) ?? 0,
    creditorPolityId:
      readPositiveSafeInteger(record, "creditorPolityId", `${path}.creditorPolityId`, errors) ?? 0
  };
}

function parseM4MusterLocalCostHook(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4MusterLocalCostHookDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  const kind = record["kind"];
  if (kind === "economic-labor-reservation") {
    return {
      kind,
      districtId: readPositiveSafeInteger(record, "districtId", `${path}.districtId`, errors) ?? 0,
      laborAmount:
        readNonnegativeSafeInteger(record, "laborAmount", `${path}.laborAmount`, errors) ?? 0,
      reasonCode: readNonEmptyString(record, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  if (kind === "loyalty-pressure") {
    return {
      kind,
      polityId: readPositiveSafeInteger(record, "polityId", `${path}.polityId`, errors) ?? 0,
      pressureBps:
        readNonnegativeSafeInteger(record, "pressureBps", `${path}.pressureBps`, errors) ?? 0,
      reasonCode: readNonEmptyString(record, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  errors.push(reason("invalid-schema", `${path}.kind`, "M4 local cost hook kind is invalid."));
  return undefined;
}

function parseM4GrainSupplySource(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4GrainSupplySourceDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  if (record["kind"] !== "m2-population-group") {
    errors.push(reason("invalid-schema", `${path}.kind`, "M4 grain source kind is invalid."));
  }
  return {
    kind: "m2-population-group",
    populationGroupId:
      readPositiveSafeInteger(record, "populationGroupId", `${path}.populationGroupId`, errors) ??
      0,
    districtId: readPositiveSafeInteger(record, "districtId", `${path}.districtId`, errors) ?? 0
  };
}

function parseM4MarchRouteSegment(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignMarchRouteSegmentStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    routeId: readPositiveSafeInteger(record, "routeId", `${path}.routeId`, errors) ?? 0,
    fromDistrictId:
      readPositiveSafeInteger(record, "fromDistrictId", `${path}.fromDistrictId`, errors) ?? 0,
    toDistrictId:
      readPositiveSafeInteger(record, "toDistrictId", `${path}.toDistrictId`, errors) ?? 0,
    travelDays: readPositiveSafeInteger(record, "travelDays", `${path}.travelDays`, errors) ?? 0,
    capacity: readNonnegativeSafeInteger(record, "capacity", `${path}.capacity`, errors) ?? 0,
    seasonRiskReasonCodes: parseStringArray(
      record["seasonRiskReasonCodes"],
      `${path}.seasonRiskReasonCodes`,
      errors
    )
  };
}

function parseM4MarchSupply(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignMarchSupplyStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    status: parseM4CampaignMarchSupplyStatus(record["status"], `${path}.status`, errors),
    carriedGrain:
      readNonnegativeSafeInteger(record, "carriedGrain", `${path}.carriedGrain`, errors) ?? 0,
    consumedGrain:
      readNonnegativeSafeInteger(record, "consumedGrain", `${path}.consumedGrain`, errors) ?? 0,
    shortageGrain:
      readNonnegativeSafeInteger(record, "shortageGrain", `${path}.shortageGrain`, errors) ?? 0,
    delayedDays:
      readNonnegativeSafeInteger(record, "delayedDays", `${path}.delayedDays`, errors) ?? 0
  };
}

function parseM4JoinedCommitmentTroops(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignMarchJoinedCommitmentTroopsStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    commitmentId:
      readPositiveSafeInteger(record, "commitmentId", `${path}.commitmentId`, errors) ?? 0,
    joinedTroops:
      readNonnegativeSafeInteger(record, "joinedTroops", `${path}.joinedTroops`, errors) ?? 0
  };
}

function parseM4CampaignHook(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignHookStateDto | undefined {
  const record = readM4Record(input, path, errors);
  if (record === undefined) {
    return undefined;
  }
  return {
    polityId: readPositiveSafeInteger(record, "polityId", `${path}.polityId`, errors) ?? 0,
    amount: readNonnegativeSafeInteger(record, "amount", `${path}.amount`, errors) ?? 0,
    reasonCode: readNonEmptyString(record, "reasonCode", `${path}.reasonCode`, errors) ?? ""
  };
}

function parsePositiveIntegerArray(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly number[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${path} must be an array.`));
    return undefined;
  }
  return input.map((entry, index) => {
    if (isPositiveSafeInteger(entry)) {
      return entry;
    }
    errors.push(
      reason(
        "invalid-schema",
        `${path}[${index}]`,
        `${path}[${index}] must be a positive safe integer.`
      )
    );
    return 0;
  });
}

function parseM4PostwarMethodArray(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveM4PostwarMethodDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${path} must be an array.`));
    return undefined;
  }
  return input.map((entry, index) => parseM4PostwarMethod(entry, `${path}[${index}]`, errors));
}

function parseM6AgreementKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6DiplomaticAgreementKindDto {
  if (
    input === "non-aggression" ||
    input === "military-access" ||
    input === "tribute-recognition"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M6 agreementKind is invalid."));
  return "non-aggression";
}

function parseM6AgreementStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6DiplomaticAgreementStatusDto {
  if (input === "proposed" || input === "active" || input === "rejected") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M6 agreement status is invalid."));
  return "proposed";
}

function parseM6RecognitionDirection(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6DiplomaticRecognitionDirectionDto {
  if (
    input === "none" ||
    input === "proposer-recognizes-target" ||
    input === "target-recognizes-proposer"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M6 recognitionDirection is invalid."));
  return "none";
}

function parseM6Audience(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6LegitimacyAudienceDto {
  if (
    input === "court" ||
    input === "local-lords" ||
    input === "military-retinue" ||
    input === "merchants" ||
    input === "ritual-network" ||
    input === "vassal-rulers" ||
    input === "foreign-courts"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M6 legitimacy audience is invalid."));
  return "court";
}

function parseM6SourceKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6LegitimacySourceKindDto {
  if (
    input === "diplomatic-recognition" ||
    input === "obligation-fulfilled" ||
    input === "obligation-breached" ||
    input === "succession-continuity" ||
    input === "postwar-settlement" ||
    input === "campaign-consequence"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M6 legitimacy sourceKind is invalid."));
  return "diplomatic-recognition";
}

function parseM4CampaignObjectiveKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignObjectiveKindDto {
  if (
    input === "prepare" ||
    input === "march" ||
    input === "besiege" ||
    input === "relieve" ||
    input === "withdraw" ||
    input === "postwar-result-candidate"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 campaign objectiveKind is invalid."));
  return "prepare";
}

function parseM4CampaignPlanStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignPlanStatusDto {
  if (input === "planned" || input === "active" || input === "cancelled" || input === "completed") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 campaign status is invalid."));
  return "planned";
}

function parseM4MusterCommitmentStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4MusterCommitmentStatusDto {
  if (
    input === "promised" ||
    input === "assembled" ||
    input === "delayed" ||
    input === "refused" ||
    input === "released"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 muster commitment status is invalid."));
  return "promised";
}

function parseM4GrainSupplyReservationStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4GrainSupplyReservationStatusDto {
  if (
    input === "reserved" ||
    input === "partially-consumed" ||
    input === "shortage" ||
    input === "consumed" ||
    input === "released"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 grain reservation status is invalid."));
  return "reserved";
}

function parseM4CampaignMarchStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignMarchStatusDto {
  if (
    input === "planned" ||
    input === "marching" ||
    input === "paused" ||
    input === "delayed" ||
    input === "cancelled" ||
    input === "arrived"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 march status is invalid."));
  return "planned";
}

function parseM4CampaignMarchSupplyStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4CampaignMarchSupplyStatusDto {
  if (
    input === "well-supplied" ||
    input === "strained" ||
    input === "hungry" ||
    input === "out-of-supply"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 march supply status is invalid."));
  return "well-supplied";
}

function parseM4FieldEngagementOutcome(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4FieldEngagementOutcomeDto {
  if (input === "attacker-victory" || input === "defender-holds") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 field engagement outcome is invalid."));
  return "defender-holds";
}

function parseM4SiegeStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4SiegeStatusDto {
  if (
    input === "blockading" ||
    input === "surrender-ready" ||
    input === "surrendered" ||
    input === "lifted" ||
    input === "withdrawn"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 siege status is invalid."));
  return "blockading";
}

function parseM4WithdrawalKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4WithdrawalKindDto {
  if (
    input === "orderly-withdrawal" ||
    input === "forced-retreat" ||
    input === "cancelled-before-departure" ||
    input === "failed-extraction"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 withdrawal kind is invalid."));
  return "orderly-withdrawal";
}

function parseM4WithdrawalTrigger(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4WithdrawalTriggerDto {
  if (
    input === "ordered" ||
    input === "supply" ||
    input === "season" ||
    input === "siege" ||
    input === "loss" ||
    input === "objective-complete"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 withdrawal trigger is invalid."));
  return "ordered";
}

function parseM4PostwarMethod(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4PostwarMethodDto {
  if (input === "direct-control" || input === "restore-vassal-ruler" || input === "tribute-only") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 postwar method is invalid."));
  return "tribute-only";
}

function parseM4FactionKnowledgeSourceKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM4FactionKnowledgeSourceKindDto {
  if (input === "scout" || input === "merchant" || input === "envoy" || input === "report") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M4 knowledge source kind is invalid."));
  return "report";
}

function parseM3Array<TEntry>(
  input: unknown,
  path: string,
  label: string,
  errors: SaveLoadRejectionReasonV1[],
  parseEntry: (entry: unknown, path: string, errors: SaveLoadRejectionReasonV1[]) => TEntry
): readonly TEntry[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${label} must be an array.`));
    return undefined;
  }

  return input.map((entry, index) => parseEntry(entry, `${path}[${index}]`, errors));
}

function parseM3PolityRecord(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3PolityRecordStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 polity record must be an object."));
    return { polityId: 0, directSuzerainPolityId: null };
  }

  return {
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    directSuzerainPolityId: readNullablePositiveSafeInteger(
      input,
      "directSuzerainPolityId",
      `${path}.directSuzerainPolityId`,
      errors
    )
  };
}

function parseM3Obligation(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 obligation must be an object."));
    return fallbackM3Obligation();
  }

  const obligationSource = parseM3ObligationSource(
    input["obligationSource"],
    `${path}.obligationSource`,
    errors
  );
  const requirement = parseM3Requirement(input["requirement"], `${path}.requirement`, errors);
  const due = parseM3Due(input["due"], `${path}.due`, errors);
  const accounting = parseM3ObligationAccounting(input["accounting"], `${path}.accounting`, errors);

  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    debtorPolityId:
      readPositiveSafeInteger(input, "debtorPolityId", `${path}.debtorPolityId`, errors) ?? 0,
    creditorPolityId:
      readPositiveSafeInteger(input, "creditorPolityId", `${path}.creditorPolityId`, errors) ?? 0,
    obligationKind: parseM3ObligationKind(
      input["obligationKind"],
      `${path}.obligationKind`,
      errors
    ),
    obligationCategory: parseM3ObligationCategory(
      input["obligationCategory"],
      `${path}.obligationCategory`,
      errors
    ),
    obligationSource,
    requirement,
    due,
    accounting,
    status: parseM3ObligationStatus(input["status"], `${path}.status`, errors),
    disputeReasonCode: readNullableString(
      input,
      "disputeReasonCode",
      `${path}.disputeReasonCode`,
      errors
    ),
    breachReasonCode: readNullableString(
      input,
      "breachReasonCode",
      `${path}.breachReasonCode`,
      errors
    ),
    createdAuditEventId:
      readPositiveSafeInteger(
        input,
        "createdAuditEventId",
        `${path}.createdAuditEventId`,
        errors
      ) ?? 0,
    latestAuditEventId:
      readPositiveSafeInteger(input, "latestAuditEventId", `${path}.latestAuditEventId`, errors) ??
      0
  };
}

function parseM3ObligationSource(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationSourceStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 obligationSource must be an object."));
    return { kind: "vassalage", sourceId: "", debtorPolityId: 0, creditorPolityId: 0 };
  }
  if (input["kind"] !== "vassalage") {
    errors.push(
      reason("invalid-schema", `${path}.kind`, "M3 obligationSource kind must be vassalage.")
    );
  }

  return {
    kind: "vassalage",
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? "",
    debtorPolityId:
      readPositiveSafeInteger(input, "debtorPolityId", `${path}.debtorPolityId`, errors) ?? 0,
    creditorPolityId:
      readPositiveSafeInteger(input, "creditorPolityId", `${path}.creditorPolityId`, errors) ?? 0
  };
}

function parseM3Requirement(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationRequirementDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 obligation requirement must be an object."));
    return { kind: "amount", resourceKind: "cash", amount: 0 };
  }
  if (input["kind"] === "condition") {
    return {
      kind: "condition",
      conditionKey: readNonEmptyString(input, "conditionKey", `${path}.conditionKey`, errors) ?? ""
    };
  }
  if (input["kind"] !== "amount") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.kind`,
        "M3 obligation requirement kind must be amount or condition."
      )
    );
  }
  return {
    kind: "amount",
    resourceKind: parseM3ObligationResourceKind(
      input["resourceKind"],
      `${path}.resourceKind`,
      errors
    ),
    amount: readPositiveSafeInteger(input, "amount", `${path}.amount`, errors) ?? 0
  };
}

function parseM3Due(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationDueDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 obligation due must be an object."));
    return { kind: "cadence", periodDays: 0, nextDueDay: 0 };
  }
  if (input["kind"] === "trigger") {
    return {
      kind: "trigger",
      triggerKey: readNonEmptyString(input, "triggerKey", `${path}.triggerKey`, errors) ?? ""
    };
  }
  if (input["kind"] !== "cadence") {
    errors.push(
      reason("invalid-schema", `${path}.kind`, "M3 obligation due kind must be cadence or trigger.")
    );
  }
  return {
    kind: "cadence",
    periodDays: readPositiveSafeInteger(input, "periodDays", `${path}.periodDays`, errors) ?? 0,
    nextDueDay: readNonnegativeSafeInteger(input, "nextDueDay", `${path}.nextDueDay`, errors) ?? 0
  };
}

function parseM3ObligationAccounting(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationAccountingStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 obligation accounting must be an object."));
    return fallbackM3ObligationAccounting();
  }
  return {
    nominalAmount:
      readNonnegativeSafeInteger(input, "nominalAmount", `${path}.nominalAmount`, errors) ?? 0,
    dueAmount: readNonnegativeSafeInteger(input, "dueAmount", `${path}.dueAmount`, errors) ?? 0,
    deliveredAmount:
      readNonnegativeSafeInteger(input, "deliveredAmount", `${path}.deliveredAmount`, errors) ?? 0,
    arrearsAmount:
      readNonnegativeSafeInteger(input, "arrearsAmount", `${path}.arrearsAmount`, errors) ?? 0,
    defaultedAmount:
      readNonnegativeSafeInteger(input, "defaultedAmount", `${path}.defaultedAmount`, errors) ?? 0,
    remittedAmount:
      readNonnegativeSafeInteger(input, "remittedAmount", `${path}.remittedAmount`, errors) ?? 0,
    dueDay: readNonnegativeSafeInteger(input, "dueDay", `${path}.dueDay`, errors) ?? 0,
    cycle: readPositiveSafeInteger(input, "cycle", `${path}.cycle`, errors) ?? 0,
    troopResponseState: parseM3TroopResponseState(
      input["troopResponseState"],
      `${path}.troopResponseState`,
      errors
    )
  };
}

function parseM3ObligationAuditEvent(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationAuditEventStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 obligation audit event must be an object."));
    return fallbackM3ObligationAuditEvent();
  }
  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    obligationId:
      readPositiveSafeInteger(input, "obligationId", `${path}.obligationId`, errors) ?? 0,
    eventKind: parseM3ObligationAuditEventKind(input["eventKind"], `${path}.eventKind`, errors),
    eventDay: readNonnegativeSafeInteger(input, "eventDay", `${path}.eventDay`, errors) ?? 0,
    eventRevision:
      readNonnegativeSafeInteger(input, "eventRevision", `${path}.eventRevision`, errors) ?? 0,
    commandId: readNonEmptyString(input, "commandId", `${path}.commandId`, errors) ?? "",
    actor: parseM3Actor(input["actor"], `${path}.actor`, errors),
    actionKind: parseNullableM3SettlementAction(input["actionKind"], `${path}.actionKind`, errors),
    dueDay: readNullableNonnegativeSafeInteger(input, "dueDay", `${path}.dueDay`, errors),
    fulfillmentId: readNullablePositiveSafeInteger(
      input,
      "fulfillmentId",
      `${path}.fulfillmentId`,
      errors
    ),
    fulfilledAmount: readNullableNonnegativeSafeInteger(
      input,
      "fulfilledAmount",
      `${path}.fulfilledAmount`,
      errors
    ),
    statusAfter: parseM3ObligationStatus(input["statusAfter"], `${path}.statusAfter`, errors),
    reasonCode: readNullableString(input, "reasonCode", `${path}.reasonCode`, errors),
    reasonCodes: parseStringArray(input["reasonCodes"], `${path}.reasonCodes`, errors),
    reliabilityBps:
      readIntegerInRange(input, "reliabilityBps", `${path}.reliabilityBps`, 0, 10_000, errors) ?? 0
  };
}

function parseM3FulfillmentClaim(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3FulfillmentClaimStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 fulfillment claim must be an object."));
    return fallbackM3FulfillmentClaim();
  }
  const sourceMovements = parseM3Array(
    input["sourceMovements"],
    `${path}.sourceMovements`,
    "M3 fulfillment sourceMovements",
    errors,
    parseM3FulfillmentSourceMovement
  );
  return {
    fulfillmentId:
      readPositiveSafeInteger(input, "fulfillmentId", `${path}.fulfillmentId`, errors) ?? 0,
    obligationId:
      readPositiveSafeInteger(input, "obligationId", `${path}.obligationId`, errors) ?? 0,
    auditEventId:
      readPositiveSafeInteger(input, "auditEventId", `${path}.auditEventId`, errors) ?? 0,
    actionKind: parseM3SettlementAction(input["actionKind"], `${path}.actionKind`, errors),
    dueDay: readNonnegativeSafeInteger(input, "dueDay", `${path}.dueDay`, errors) ?? 0,
    fulfilledAmount:
      readNonnegativeSafeInteger(input, "fulfilledAmount", `${path}.fulfilledAmount`, errors) ?? 0,
    deliveredAmount:
      readNonnegativeSafeInteger(input, "deliveredAmount", `${path}.deliveredAmount`, errors) ?? 0,
    arrearsAmount:
      readNonnegativeSafeInteger(input, "arrearsAmount", `${path}.arrearsAmount`, errors) ?? 0,
    defaultedAmount:
      readNonnegativeSafeInteger(input, "defaultedAmount", `${path}.defaultedAmount`, errors) ?? 0,
    reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? "",
    sourceMovements: sourceMovements ?? []
  };
}

function parseM3FulfillmentSourceMovement(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3FulfillmentSourceMovementStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M3 fulfillment source movement must be an object.")
    );
    return {
      kind: "m2-population-group",
      populationGroupId: 0,
      districtId: 0,
      resourceKind: "cash",
      amount: 0
    };
  }
  if (input["kind"] === "m3-troop-commitment-placeholder") {
    return {
      kind: "m3-troop-commitment-placeholder",
      debtorPolityId:
        readPositiveSafeInteger(input, "debtorPolityId", `${path}.debtorPolityId`, errors) ?? 0,
      headcount: readNonnegativeSafeInteger(input, "headcount", `${path}.headcount`, errors) ?? 0
    };
  }
  if (input["kind"] !== "m2-population-group") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.kind`,
        "M3 fulfillment source movement kind must be m2-population-group or m3-troop-commitment-placeholder."
      )
    );
  }
  return {
    kind: "m2-population-group",
    populationGroupId:
      readPositiveSafeInteger(input, "populationGroupId", `${path}.populationGroupId`, errors) ?? 0,
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    resourceKind: parseM3CashOrGrain(input["resourceKind"], `${path}.resourceKind`, errors),
    amount: readNonnegativeSafeInteger(input, "amount", `${path}.amount`, errors) ?? 0
  };
}

function parseM3AdministrativeDistrict(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3AdministrativeDistrictStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 administrative district must be an object."));
    return fallbackM3AdministrativeDistrict();
  }
  return {
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    controlMode: parseM3AdministrativeControlMode(
      input["controlMode"],
      `${path}.controlMode`,
      errors
    ),
    localComplexity:
      readNonnegativeSafeInteger(input, "localComplexity", `${path}.localComplexity`, errors) ?? 0,
    communicationCost:
      readNonnegativeSafeInteger(input, "communicationCost", `${path}.communicationCost`, errors) ??
      0,
    directness: readNonnegativeSafeInteger(input, "directness", `${path}.directness`, errors) ?? 0,
    frontierPressure:
      readNonnegativeSafeInteger(input, "frontierPressure", `${path}.frontierPressure`, errors) ??
      0,
    administrativeCapacity:
      readPositiveSafeInteger(
        input,
        "administrativeCapacity",
        `${path}.administrativeCapacity`,
        errors
      ) ?? 0
  };
}

function parseM3Character(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3CharacterStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 character must be an object."));
    return fallbackM3Character();
  }
  return {
    characterId: readPositiveSafeInteger(input, "characterId", `${path}.characterId`, errors) ?? 0,
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    alive: readBoolean(input, "alive", `${path}.alive`, errors),
    incapacitated: readBoolean(input, "incapacitated", `${path}.incapacitated`, errors),
    currentDistrictId:
      readPositiveSafeInteger(input, "currentDistrictId", `${path}.currentDistrictId`, errors) ?? 0,
    commandBps:
      readIntegerInRange(input, "commandBps", `${path}.commandBps`, 0, 10_000, errors) ?? 0,
    administrationBps:
      readIntegerInRange(
        input,
        "administrationBps",
        `${path}.administrationBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    diplomacyBps:
      readIntegerInRange(input, "diplomacyBps", `${path}.diplomacyBps`, 0, 10_000, errors) ?? 0
  };
}

function parseM3Relationship(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3CharacterRelationshipStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 relationship must be an object."));
    return { sourceCharacterId: 0, targetCharacterId: 0, affinityBps: 0 };
  }
  return {
    sourceCharacterId:
      readPositiveSafeInteger(input, "sourceCharacterId", `${path}.sourceCharacterId`, errors) ?? 0,
    targetCharacterId:
      readPositiveSafeInteger(input, "targetCharacterId", `${path}.targetCharacterId`, errors) ?? 0,
    affinityBps:
      readIntegerInRange(input, "affinityBps", `${path}.affinityBps`, -10_000, 10_000, errors) ?? 0
  };
}

function parseM3Office(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3OfficeStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 office must be an object."));
    return fallbackM3Office();
  }
  return {
    officeId: readPositiveSafeInteger(input, "officeId", `${path}.officeId`, errors) ?? 0,
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    jurisdiction: parseM3OfficeJurisdiction(input["jurisdiction"], `${path}.jurisdiction`, errors),
    officeKind: parseM3OfficeKind(input["officeKind"], `${path}.officeKind`, errors),
    primary: readBoolean(input, "primary", `${path}.primary`, errors),
    holderCharacterId: readNullablePositiveSafeInteger(
      input,
      "holderCharacterId",
      `${path}.holderCharacterId`,
      errors
    ),
    policyId: readPositiveSafeInteger(input, "policyId", `${path}.policyId`, errors) ?? 0,
    minimumCommandBps:
      readIntegerInRange(
        input,
        "minimumCommandBps",
        `${path}.minimumCommandBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    minimumAdministrationBps:
      readIntegerInRange(
        input,
        "minimumAdministrationBps",
        `${path}.minimumAdministrationBps`,
        0,
        10_000,
        errors
      ) ?? 0
  };
}

function parseM3Policy(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3PolicyStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 policy must be an object."));
    return fallbackM3Policy();
  }
  return {
    policyId: readPositiveSafeInteger(input, "policyId", `${path}.policyId`, errors) ?? 0,
    target: parseM3PolicyTarget(input["target"], `${path}.target`, errors),
    stance: parseM3PolicyStance(input["stance"], `${path}.stance`, errors),
    intensityBps:
      readIntegerInRange(input, "intensityBps", `${path}.intensityBps`, 0, 10_000, errors) ?? 0
  };
}

function parseM3Enfeoffment(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3EnfeoffmentStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 enfeoffment must be an object."));
    return {
      districtId: 0,
      holderCharacterId: 0,
      grantedByPolityId: 0,
      policyId: 0,
      grantedDay: 0,
      reasonCode: ""
    };
  }
  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    holderCharacterId:
      readPositiveSafeInteger(input, "holderCharacterId", `${path}.holderCharacterId`, errors) ?? 0,
    grantedByPolityId:
      readPositiveSafeInteger(input, "grantedByPolityId", `${path}.grantedByPolityId`, errors) ?? 0,
    policyId: readPositiveSafeInteger(input, "policyId", `${path}.policyId`, errors) ?? 0,
    grantedDay: readNonnegativeSafeInteger(input, "grantedDay", `${path}.grantedDay`, errors) ?? 0,
    reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
  };
}

function parseM3AppointmentAuditEvent(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3AppointmentAuditEventStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 appointment audit event must be an object."));
    return fallbackM3AppointmentAuditEvent();
  }
  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    eventKind: parseM3AppointmentAuditEventKind(input["eventKind"], `${path}.eventKind`, errors),
    eventDay: readNonnegativeSafeInteger(input, "eventDay", `${path}.eventDay`, errors) ?? 0,
    eventRevision:
      readNonnegativeSafeInteger(input, "eventRevision", `${path}.eventRevision`, errors) ?? 0,
    commandId: readNonEmptyString(input, "commandId", `${path}.commandId`, errors) ?? "",
    actor: parseM3Actor(input["actor"], `${path}.actor`, errors),
    officeId: readNullablePositiveSafeInteger(input, "officeId", `${path}.officeId`, errors),
    characterId: readNullablePositiveSafeInteger(
      input,
      "characterId",
      `${path}.characterId`,
      errors
    ),
    policyId: readNullablePositiveSafeInteger(input, "policyId", `${path}.policyId`, errors),
    districtId: readNullablePositiveSafeInteger(input, "districtId", `${path}.districtId`, errors),
    reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
  };
}

function parseM3SuccessionCandidateProfile(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionCandidateProfileStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M3 succession candidate profile must be an object.")
    );
    return { polityId: 0, characterId: 0, requiresRegency: false, supportSources: [] };
  }
  const supportSources = parseM3Array(
    input["supportSources"],
    `${path}.supportSources`,
    "M3 succession supportSources",
    errors,
    parseM3SuccessionSupportSource
  );
  return {
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    characterId: readPositiveSafeInteger(input, "characterId", `${path}.characterId`, errors) ?? 0,
    requiresRegency: readBoolean(input, "requiresRegency", `${path}.requiresRegency`, errors),
    supportSources: supportSources ?? []
  };
}

function parseM3SuccessionCrisis(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionCrisisStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 succession crisis must be an object."));
    return fallbackM3SuccessionCrisis();
  }
  const candidates = parseM3Array(
    input["candidates"],
    `${path}.candidates`,
    "M3 succession candidates",
    errors,
    parseM3SuccessionCandidate
  );
  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    trigger: parseM3SuccessionTrigger(input["trigger"], `${path}.trigger`, errors),
    status: parseM3SuccessionStatus(input["status"], `${path}.status`, errors),
    startedDay: readNonnegativeSafeInteger(input, "startedDay", `${path}.startedDay`, errors) ?? 0,
    resolvedDay: readNullableNonnegativeSafeInteger(
      input,
      "resolvedDay",
      `${path}.resolvedDay`,
      errors
    ),
    candidates: candidates ?? [],
    outcome: parseNullableM3SuccessionOutcome(input["outcome"], `${path}.outcome`, errors),
    reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
  };
}

function parseM3OfficeJurisdiction(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3OfficeJurisdictionDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 office jurisdiction must be an object."));
    return { kind: "polity", polityId: 0 };
  }
  if (input["kind"] === "district") {
    return {
      kind: "district",
      districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0
    };
  }
  if (input["kind"] !== "polity") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.kind`,
        "M3 office jurisdiction kind must be polity or district."
      )
    );
  }
  return {
    kind: "polity",
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0
  };
}

function parseM3PolicyTarget(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3PolicyTargetDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 policy target must be an object."));
    return { kind: "polity", polityId: 0 };
  }
  if (input["kind"] === "office") {
    return {
      kind: "office",
      officeId: readPositiveSafeInteger(input, "officeId", `${path}.officeId`, errors) ?? 0
    };
  }
  if (input["kind"] === "district") {
    return {
      kind: "district",
      districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0
    };
  }
  if (input["kind"] !== "polity") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.kind`,
        "M3 policy target kind must be office, polity, or district."
      )
    );
  }
  return {
    kind: "polity",
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0
  };
}

function parseM3SuccessionSupportSource(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionSupportSourceStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 succession support source must be an object."));
    return { kind: "kinship", strengthBps: 0, sourceId: "" };
  }
  return {
    kind: parseM3SuccessionSupportKind(input["kind"], `${path}.kind`, errors),
    strengthBps:
      readIntegerInRange(input, "strengthBps", `${path}.strengthBps`, 0, 10_000, errors) ?? 0,
    sourceId: readNonEmptyString(input, "sourceId", `${path}.sourceId`, errors) ?? ""
  };
}

function parseM3SuccessionCandidate(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionCandidateStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 succession candidate must be an object."));
    return { characterId: 0, requiresRegency: false, supportSources: [], supportTotalBps: 0 };
  }
  const supportSources = parseM3Array(
    input["supportSources"],
    `${path}.supportSources`,
    "M3 succession supportSources",
    errors,
    parseM3SuccessionSupportSource
  );
  return {
    characterId: readPositiveSafeInteger(input, "characterId", `${path}.characterId`, errors) ?? 0,
    requiresRegency: readBoolean(input, "requiresRegency", `${path}.requiresRegency`, errors),
    supportSources: supportSources ?? [],
    supportTotalBps:
      readIntegerInRange(input, "supportTotalBps", `${path}.supportTotalBps`, 0, 10_000, errors) ??
      0
  };
}

function parseM3SuccessionTrigger(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionTriggerDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 succession trigger must be an object."));
    return { kind: "death", characterId: 0, officeId: null };
  }
  if (input["kind"] === "incapacity") {
    return {
      kind: "incapacity",
      characterId:
        readPositiveSafeInteger(input, "characterId", `${path}.characterId`, errors) ?? 0,
      officeId: readNullablePositiveSafeInteger(input, "officeId", `${path}.officeId`, errors)
    };
  }
  if (input["kind"] === "abdication") {
    return {
      kind: "abdication",
      characterId:
        readPositiveSafeInteger(input, "characterId", `${path}.characterId`, errors) ?? 0,
      officeId: readNullablePositiveSafeInteger(input, "officeId", `${path}.officeId`, errors)
    };
  }
  if (input["kind"] !== "death") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.kind`,
        "M3 succession trigger kind must be death, incapacity, or abdication."
      )
    );
  }
  return {
    kind: "death",
    characterId: readPositiveSafeInteger(input, "characterId", `${path}.characterId`, errors) ?? 0,
    officeId: readNullablePositiveSafeInteger(input, "officeId", `${path}.officeId`, errors)
  };
}

function parseNullableM3SuccessionOutcome(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionOutcomeDto | null {
  if (input === null) {
    return null;
  }
  return parseM3SuccessionOutcome(input, path, errors);
}

function parseM3SuccessionOutcome(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionOutcomeDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 succession outcome must be an object or null."));
    return { kind: "peaceful", successorCharacterId: 0, supportTotalBps: 0 };
  }
  if (input["kind"] === "regency") {
    return {
      kind: "regency",
      successorCharacterId:
        readPositiveSafeInteger(
          input,
          "successorCharacterId",
          `${path}.successorCharacterId`,
          errors
        ) ?? 0,
      regentCharacterId:
        readPositiveSafeInteger(input, "regentCharacterId", `${path}.regentCharacterId`, errors) ??
        0,
      supportTotalBps:
        readIntegerInRange(
          input,
          "supportTotalBps",
          `${path}.supportTotalBps`,
          0,
          10_000,
          errors
        ) ?? 0,
      reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  if (input["kind"] === "disputed") {
    return {
      kind: "disputed",
      leadingCharacterId:
        readPositiveSafeInteger(
          input,
          "leadingCharacterId",
          `${path}.leadingCharacterId`,
          errors
        ) ?? 0,
      rivalCharacterId:
        readPositiveSafeInteger(input, "rivalCharacterId", `${path}.rivalCharacterId`, errors) ?? 0,
      supportMarginBps:
        readIntegerInRange(
          input,
          "supportMarginBps",
          `${path}.supportMarginBps`,
          0,
          10_000,
          errors
        ) ?? 0,
      reasonCode: readNonEmptyString(input, "reasonCode", `${path}.reasonCode`, errors) ?? ""
    };
  }
  if (input["kind"] !== "peaceful") {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.kind`,
        "M3 succession outcome kind must be peaceful, regency, or disputed."
      )
    );
  }
  return {
    kind: "peaceful",
    successorCharacterId:
      readPositiveSafeInteger(
        input,
        "successorCharacterId",
        `${path}.successorCharacterId`,
        errors
      ) ?? 0,
    supportTotalBps:
      readIntegerInRange(input, "supportTotalBps", `${path}.supportTotalBps`, 0, 10_000, errors) ??
      0
  };
}

function parseM3Actor(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): { readonly kind: "ai" | "player" | "system"; readonly id: string } {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M3 actor must be an object."));
    return { kind: "system", id: "" };
  }
  const kind = input["kind"];
  if (kind !== "ai" && kind !== "player" && kind !== "system") {
    errors.push(
      reason("invalid-schema", `${path}.kind`, "M3 actor kind must be ai, player, or system.")
    );
  }
  return {
    kind: kind === "ai" || kind === "player" || kind === "system" ? kind : "system",
    id: readNonEmptyString(input, "id", `${path}.id`, errors) ?? ""
  };
}

function parseStringArray(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly string[] {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", path, `${path} must be an array.`));
    return [];
  }
  return input.map((entry, index) => {
    if (typeof entry === "string" && entry.length > 0) {
      return entry;
    }
    errors.push(
      reason("invalid-schema", `${path}[${index}]`, `${path}[${index}] must be a non-empty string.`)
    );
    return "";
  });
}

function parseM3ObligationKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationKindDto {
  if (input === "tribute" || input === "troop") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 obligationKind must be tribute or troop."));
  return "tribute";
}

function parseM3ObligationResourceKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationResourceKindDto {
  if (input === "cash" || input === "grain" || input === "troops") {
    return input;
  }
  errors.push(
    reason("invalid-schema", path, "M3 obligation resourceKind must be cash, grain, or troops.")
  );
  return "cash";
}

function parseM3CashOrGrain(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): "cash" | "grain" {
  if (input === "cash" || input === "grain") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 source resourceKind must be cash or grain."));
  return "cash";
}

function parseM3ObligationStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationStatusDto {
  if (input === "active" || input === "disputed" || input === "breached") {
    return input;
  }
  errors.push(
    reason("invalid-schema", path, "M3 obligation status must be active, disputed, or breached.")
  );
  return "active";
}

function parseM3ObligationAuditEventKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationAuditEventKindDto {
  if (input === "created" || input === "settled" || input === "status-changed") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 obligation audit eventKind is invalid."));
  return "created";
}

function parseM3ObligationCategory(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationCategoryDto {
  if (
    input === "regular-tribute" ||
    input === "extraordinary-levy" ||
    input === "troop-obligation" ||
    input === "defensive-garrison" ||
    input === "specific-war-aid"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 obligationCategory is invalid."));
  return "regular-tribute";
}

function parseM3SettlementAction(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationSettlementActionDto {
  if (
    input === "fulfillment" ||
    input === "partial-fulfillment" ||
    input === "deferral" ||
    input === "refusal" ||
    input === "remission" ||
    input === "pursuit-recovery" ||
    input === "default-breach"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 obligation settlement actionKind is invalid."));
  return "fulfillment";
}

function parseNullableM3SettlementAction(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3ObligationSettlementActionDto | null {
  if (input === null) {
    return null;
  }
  return parseM3SettlementAction(input, path, errors);
}

function parseM3TroopResponseState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3TroopResponseStateDto {
  if (
    input === "none" ||
    input === "committed" ||
    input === "deferred" ||
    input === "refused" ||
    input === "remitted" ||
    input === "recovery-pursued" ||
    input === "breached"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 troopResponseState is invalid."));
  return "none";
}

function parseM3AdministrativeControlMode(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3AdministrativeControlModeDto {
  if (input === "direct" || input === "vassal" || input === "tribute-only") {
    return input;
  }
  errors.push(
    reason(
      "invalid-schema",
      path,
      "M3 administrative controlMode must be direct, vassal, or tribute-only."
    )
  );
  return "direct";
}

function parseM3OfficeKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3OfficeKindDto {
  if (input === "commander" || input === "governor" || input === "minister") {
    return input;
  }
  errors.push(
    reason("invalid-schema", path, "M3 officeKind must be commander, governor, or minister.")
  );
  return "governor";
}

function parseM3PolicyStance(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3PolicyStanceDto {
  if (
    input === "balanced" ||
    input === "conciliatory" ||
    input === "extractive" ||
    input === "military"
  ) {
    return input;
  }
  errors.push(
    reason(
      "invalid-schema",
      path,
      "M3 policy stance must be balanced, conciliatory, extractive, or military."
    )
  );
  return "balanced";
}

function parseM3AppointmentAuditEventKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3AppointmentAuditEventKindDto {
  if (
    input === "appointment" ||
    input === "bulk-appointment" ||
    input === "enfeoffment" ||
    input === "policy-updated"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 appointment audit eventKind is invalid."));
  return "appointment";
}

function parseM3SuccessionSupportKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM3SuccessionSupportKindDto {
  if (
    input === "kinship" ||
    input === "designation" ||
    input === "court" ||
    input === "military" ||
    input === "provincial" ||
    input === "suzerain" ||
    input === "foreign"
  ) {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 succession support kind is invalid."));
  return "kinship";
}

function parseM3SuccessionStatus(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): "pending" | "resolved" {
  if (input === "pending" || input === "resolved") {
    return input;
  }
  errors.push(reason("invalid-schema", path, "M3 succession status must be pending or resolved."));
  return "pending";
}

function parseM2PopulationGroups(
  input: unknown,
  basePath: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveM2PopulationGroupStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        `${basePath}.populationGroups`,
        "M2 populationGroups must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) =>
    parseM2PopulationGroup(entry, `${basePath}.populationGroups[${index}]`, errors)
  );
}

function parseM2PopulationGroup(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2PopulationGroupStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2PopulationGroupState entry must be an object."));
    return fallbackM2PopulationGroup();
  }

  const committedLabor = input["committedLabor"];
  const parsedCommittedLabor = Array.isArray(committedLabor)
    ? committedLabor.map((entry, index) =>
        parseM2LaborCommitment(entry, `${path}.committedLabor[${index}]`, errors)
      )
    : undefined;
  if (parsedCommittedLabor === undefined) {
    errors.push(
      reason("invalid-schema", `${path}.committedLabor`, "M2 committedLabor must be an array.")
    );
  }

  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    totalPeople:
      readNonnegativeSafeInteger(input, "totalPeople", `${path}.totalPeople`, errors) ?? 0,
    workingPeople:
      readNonnegativeSafeInteger(input, "workingPeople", `${path}.workingPeople`, errors) ?? 0,
    dependentPeople:
      readNonnegativeSafeInteger(input, "dependentPeople", `${path}.dependentPeople`, errors) ?? 0,
    availableLabor:
      readNonnegativeSafeInteger(input, "availableLabor", `${path}.availableLabor`, errors) ?? 0,
    grainStock: readNonnegativeSafeInteger(input, "grainStock", `${path}.grainStock`, errors) ?? 0,
    cashStock: readNonnegativeSafeInteger(input, "cashStock", `${path}.cashStock`, errors) ?? 0,
    committedLabor: parsedCommittedLabor ?? []
  };
}

function parseM2LaborCommitment(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2LaborCommitmentStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2LaborCommitmentState entry must be an object."));
    return { purpose: "mobilized", laborAmount: 0, startDay: 0, releaseDay: 0 };
  }

  if (input["purpose"] !== "mobilized") {
    errors.push(
      reason("invalid-schema", `${path}.purpose`, "M2 labor commitment purpose must be mobilized.")
    );
  }

  return {
    purpose: "mobilized",
    laborAmount: readPositiveSafeInteger(input, "laborAmount", `${path}.laborAmount`, errors) ?? 0,
    startDay: readNonnegativeSafeInteger(input, "startDay", `${path}.startDay`, errors) ?? 0,
    releaseDay: readNonnegativeSafeInteger(input, "releaseDay", `${path}.releaseDay`, errors) ?? 0
  };
}

function parseM2Agriculture(
  input: unknown,
  basePath: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2EconomyPopulationStateDto["agriculture"] | undefined {
  const path = `${basePath}.agriculture`;
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 agriculture must be an object."));
    return undefined;
  }

  const districts = input["districts"];
  if (!Array.isArray(districts)) {
    errors.push(
      reason("invalid-schema", `${path}.districts`, "M2 agriculture districts must be an array.")
    );
    return undefined;
  }

  return {
    districts: districts.map((entry, index) =>
      parseM2AgricultureDistrict(entry, `${path}.districts[${index}]`, errors)
    )
  };
}

function parseM2AgricultureDistrict(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictAgricultureStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2DistrictAgricultureState entry must be an object.")
    );
    return {
      districtId: 0,
      phase: "fallow",
      daysInPhase: 0,
      accumulatedFarmLabor: 0,
      expectedHarvestGrain: 0,
      lastHarvestGrain: 0
    };
  }

  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    phase: parseM2AgriculturePhase(input["phase"], `${path}.phase`, errors),
    daysInPhase:
      readNonnegativeSafeInteger(input, "daysInPhase", `${path}.daysInPhase`, errors) ?? 0,
    accumulatedFarmLabor:
      readNonnegativeSafeInteger(
        input,
        "accumulatedFarmLabor",
        `${path}.accumulatedFarmLabor`,
        errors
      ) ?? 0,
    expectedHarvestGrain:
      readNonnegativeSafeInteger(
        input,
        "expectedHarvestGrain",
        `${path}.expectedHarvestGrain`,
        errors
      ) ?? 0,
    lastHarvestGrain:
      readNonnegativeSafeInteger(input, "lastHarvestGrain", `${path}.lastHarvestGrain`, errors) ?? 0
  };
}

function parseM2Market(
  input: unknown,
  basePath: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2EconomyPopulationStateDto["market"] | undefined {
  const path = `${basePath}.market`;
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 market must be an object."));
    return undefined;
  }

  const districts = input["districts"];
  if (!Array.isArray(districts)) {
    errors.push(
      reason("invalid-schema", `${path}.districts`, "M2 market districts must be an array.")
    );
    return undefined;
  }

  return {
    districts: districts.map((entry, index) =>
      parseM2MarketDistrict(entry, `${path}.districts[${index}]`, errors)
    )
  };
}

function parseM2MarketDistrict(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictMarketStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2DistrictMarketState entry must be an object."));
    return fallbackM2MarketDistrict();
  }

  const cashFlow = parseM2MarketCashFlow(input["cashFlow"], `${path}.cashFlow`, errors);
  const grainFlow = parseM2MarketGrainFlow(input["grainFlow"], `${path}.grainFlow`, errors);

  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    grainPriceCashPerHundred:
      readPositiveSafeInteger(
        input,
        "grainPriceCashPerHundred",
        `${path}.grainPriceCashPerHundred`,
        errors
      ) ?? 0,
    cashFlow: cashFlow ?? { cumulativeMobilizationCost: 0, lastDailyCashDelta: 0 },
    grainFlow: grainFlow ?? { lastHarvestDelta: 0 }
  };
}

function parseM2MarketCashFlow(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictMarketStateDto["cashFlow"] | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 market cashFlow must be an object."));
    return undefined;
  }

  return {
    cumulativeMobilizationCost:
      readNonnegativeSafeInteger(
        input,
        "cumulativeMobilizationCost",
        `${path}.cumulativeMobilizationCost`,
        errors
      ) ?? 0,
    lastDailyCashDelta:
      readNonnegativeSafeInteger(
        input,
        "lastDailyCashDelta",
        `${path}.lastDailyCashDelta`,
        errors
      ) ?? 0
  };
}

function parseM2MarketGrainFlow(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictMarketStateDto["grainFlow"] | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 market grainFlow must be an object."));
    return undefined;
  }

  return {
    lastHarvestDelta:
      readNonnegativeSafeInteger(input, "lastHarvestDelta", `${path}.lastHarvestDelta`, errors) ?? 0
  };
}

function parseM2Transport(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2TransportStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 transport must be an object."));
    return undefined;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", `${path}.schemaVersion`, "M2 transport schemaVersion must be 1.")
    );
  }

  const routes = input["routes"];
  const districtSeasonality = input["districtSeasonality"];
  const regionalCurves = input["regionalCurves"];
  if (!Array.isArray(routes)) {
    errors.push(
      reason("invalid-schema", `${path}.routes`, "M2 transport routes must be an array.")
    );
  }
  if (!Array.isArray(districtSeasonality)) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.districtSeasonality`,
        "M2 transport districtSeasonality must be an array."
      )
    );
  }
  if (!Array.isArray(regionalCurves)) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.regionalCurves`,
        "M2 transport regionalCurves must be an array."
      )
    );
  }
  if (
    !Array.isArray(routes) ||
    !Array.isArray(districtSeasonality) ||
    !Array.isArray(regionalCurves)
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    routes: routes.map((entry, index) =>
      parseM2TransportRoute(entry, `${path}.routes[${index}]`, errors)
    ),
    districtSeasonality: districtSeasonality.map((entry, index) =>
      parseM2DistrictSeasonality(entry, `${path}.districtSeasonality[${index}]`, errors)
    ),
    regionalCurves: regionalCurves.map((entry, index) =>
      parseM2RegionalSeasonalCurve(entry, `${path}.regionalCurves[${index}]`, errors)
    )
  };
}

function parseM2TransportRoute(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2RouteTransportEdgeStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2RouteTransportEdgeState entry must be an object.")
    );
    return {
      routeId: 0,
      fromDistrictId: 0,
      toDistrictId: 0,
      routeKind: "road",
      baseTravelCost: 0,
      baseCapacity: 0
    };
  }

  return {
    routeId: readPositiveSafeInteger(input, "routeId", `${path}.routeId`, errors) ?? 0,
    fromDistrictId:
      readPositiveSafeInteger(input, "fromDistrictId", `${path}.fromDistrictId`, errors) ?? 0,
    toDistrictId:
      readPositiveSafeInteger(input, "toDistrictId", `${path}.toDistrictId`, errors) ?? 0,
    routeKind: parseM2RouteKind(input["routeKind"], `${path}.routeKind`, errors),
    baseTravelCost:
      readPositiveSafeInteger(input, "baseTravelCost", `${path}.baseTravelCost`, errors) ?? 0,
    baseCapacity:
      readPositiveSafeInteger(input, "baseCapacity", `${path}.baseCapacity`, errors) ?? 0
  };
}

function parseM2DistrictSeasonality(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictSeasonalityStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2DistrictSeasonalityState entry must be an object.")
    );
    return { districtId: 0, regionalCurveId: 0 };
  }

  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    regionalCurveId:
      readPositiveSafeInteger(input, "regionalCurveId", `${path}.regionalCurveId`, errors) ?? 0
  };
}

function parseM2RegionalSeasonalCurve(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2RegionalSeasonalCurveStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2RegionalSeasonalCurveState entry must be an object.")
    );
    return { id: 0, monthlyValues: [] };
  }

  const monthlyValues = input["monthlyValues"];
  if (!Array.isArray(monthlyValues) || monthlyValues.length !== 12) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.monthlyValues`,
        "M2 regional seasonal curve monthlyValues must contain 12 months."
      )
    );
    return {
      id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
      monthlyValues: []
    };
  }

  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    monthlyValues: monthlyValues.map((entry, index) =>
      parseM2SeasonalMonth(entry, `${path}.monthlyValues[${index}]`, index + 1, errors)
    )
  };
}

function parseM2SeasonalMonth(
  input: unknown,
  path: string,
  expectedMonth: number,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2SeasonalMonthStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2SeasonalMonthState entry must be an object."));
    return {
      month: expectedMonth,
      monsoonIntensityBps: 0,
      agricultureWorkBps: 0,
      riverNavigabilityBps: 0,
      roadTravelCostBps: 1
    };
  }

  if (input["month"] !== expectedMonth) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.month`,
        "M2 seasonal month entries must be ordered from month 1 through month 12."
      )
    );
  }

  return {
    month: readIntegerInRange(input, "month", `${path}.month`, 1, 12, errors) ?? expectedMonth,
    monsoonIntensityBps:
      readIntegerInRange(
        input,
        "monsoonIntensityBps",
        `${path}.monsoonIntensityBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    agricultureWorkBps:
      readIntegerInRange(
        input,
        "agricultureWorkBps",
        `${path}.agricultureWorkBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    riverNavigabilityBps:
      readIntegerInRange(
        input,
        "riverNavigabilityBps",
        `${path}.riverNavigabilityBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    roadTravelCostBps:
      readIntegerInRange(
        input,
        "roadTravelCostBps",
        `${path}.roadTravelCostBps`,
        1,
        30_000,
        errors
      ) ?? 1
  };
}

function parseCommandTail(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveCommandTailEntryV1[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", "body.commandTail", "commandTail must be an array."));
    return undefined;
  }
  if (input.length > MAX_TAIL_COUNT) {
    errors.push(
      reason("invalid-schema", "body.commandTail", "commandTail exceeds the v1 short-tail limit.")
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.commandTail[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "commandTail entry must be an object."));
      return { sequence: 0, command: fallbackAdvanceCommand() };
    }
    const sequence = readPositiveSafeInteger(entry, "sequence", `${path}.sequence`, errors) ?? 0;
    const command = parseGameCommandV1(entry["command"]);
    if (!command.ok) {
      errors.push(
        reason("invalid-schema", `${path}.command.${command.error.path}`, command.error.message)
      );
      return { sequence, command: fallbackAdvanceCommand() };
    }
    return {
      sequence,
      command: command.value
    };
  });
}

function parseEventTail(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveEventTailEntryV1[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", "body.eventTail", "eventTail must be an array."));
    return undefined;
  }
  if (input.length > MAX_TAIL_COUNT) {
    errors.push(
      reason("invalid-schema", "body.eventTail", "eventTail exceeds the v1 short-tail limit.")
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.eventTail[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "eventTail entry must be an object."));
      return { sequence: 0, event: {} };
    }
    const event = entry["event"];
    if (!isRecord(event)) {
      errors.push(reason("invalid-schema", `${path}.event`, "eventTail event must be an object."));
      return { sequence: 0, event: {} };
    }
    return {
      sequence: readPositiveSafeInteger(entry, "sequence", `${path}.sequence`, errors) ?? 0,
      event: copyRecord(event)
    };
  });
}

function validateHeaderBodyConsistency(
  header: SaveHeaderV1,
  body: SaveBodyV1,
  errors: SaveLoadRejectionReasonV1[]
): void {
  if (header.contentManifestHash !== body.authoritativeSnapshot.meta.contentManifestHash) {
    errors.push(
      reason(
        "invalid-schema",
        "header.contentManifestHash",
        "Save header contentManifestHash must match authoritative snapshot meta."
      )
    );
  }
  if (header.seed !== body.authoritativeSnapshot.meta.seed) {
    errors.push(
      reason(
        "invalid-schema",
        "header.seed",
        "Save header seed must match authoritative snapshot meta."
      )
    );
  }
  if (header.currentDay !== body.authoritativeSnapshot.meta.currentDay) {
    errors.push(
      reason(
        "invalid-schema",
        "header.currentDay",
        "Save header currentDay must match authoritative snapshot meta."
      )
    );
  }
  if (body.scheduler.lastCompletedDay !== body.authoritativeSnapshot.meta.currentDay) {
    errors.push(
      reason(
        "invalid-schema",
        "body.scheduler.lastCompletedDay",
        "Save scheduler lastCompletedDay must match authoritative snapshot currentDay."
      )
    );
  }
}

function checksumSaveBodyV1(body: SaveBodyV1): string {
  return fixedHex(hashText(canonicalJson(body)));
}

function copySaveBody(body: SaveBodyV1): SaveBodyV1 {
  const stateWithoutM2 = {
    polities: body.authoritativeSnapshot.state.polities.map(copySimpleRuntimeState),
    persons: body.authoritativeSnapshot.state.persons.map((person) => ({
      definitionId: person.definitionId,
      currentDistrictId: person.currentDistrictId
    })),
    districts: body.authoritativeSnapshot.state.districts.map((district) => ({
      definitionId: district.definitionId,
      control: copyDistrictControl(district.control)
    })),
    settlements: body.authoritativeSnapshot.state.settlements.map((settlement) => ({
      definitionId: settlement.definitionId,
      currentDistrictId: settlement.currentDistrictId
    })),
    routes: body.authoritativeSnapshot.state.routes.map(copySimpleRuntimeState)
  };
  const state = copyOptionalRuntimeSlices(
    stateWithoutM2,
    body.authoritativeSnapshot.state.m2,
    body.authoritativeSnapshot.state.m3,
    body.authoritativeSnapshot.state.m4,
    body.authoritativeSnapshot.state.m6,
    body.authoritativeSnapshot.state.m6PolicyEvents,
    body.authoritativeSnapshot.state.m6Alpha
  );

  return {
    authoritativeSnapshot: {
      schemaVersion: 0,
      meta: { ...body.authoritativeSnapshot.meta },
      definitions: {
        polities: body.authoritativeSnapshot.definitions.polities.map(copySimpleDefinition),
        persons: body.authoritativeSnapshot.definitions.persons.map(copySimpleDefinition),
        districts: body.authoritativeSnapshot.definitions.districts.map(copySimpleDefinition),
        settlements: body.authoritativeSnapshot.definitions.settlements.map((settlement) => ({
          id: settlement.id,
          displayNameKey: settlement.displayNameKey,
          districtId: settlement.districtId
        })),
        routes: body.authoritativeSnapshot.definitions.routes.map((route) => ({
          id: route.id,
          fromDistrictId: route.fromDistrictId,
          toDistrictId: route.toDistrictId,
          lengthInMapUnits: route.lengthInMapUnits
        })),
        ...(body.authoritativeSnapshot.definitions.topology === undefined
          ? {}
          : {
              topology: copyMapTopologyDefinition(body.authoritativeSnapshot.definitions.topology)
            }),
        ...(body.authoritativeSnapshot.definitions.strategicTerrain === undefined
          ? {}
          : {
              strategicTerrain: copyStrategicTerrainDefinition(
                body.authoritativeSnapshot.definitions.strategicTerrain
              )
            })
      },
      state
    },
    scheduler: { ...body.scheduler },
    rng: {
      schemaVersion: 1,
      algorithm: body.rng.algorithm,
      savedStreams: body.rng.savedStreams.map((stream) => stream)
    },
    commandTail: body.commandTail.map((entry) => ({
      sequence: entry.sequence,
      command: entry.command
    })),
    eventTail: body.eventTail.map((entry) => ({
      sequence: entry.sequence,
      event: copyRecord(entry.event)
    }))
  };
}

function copySimpleDefinition(definition: SaveSimpleDefinitionDto): SaveSimpleDefinitionDto {
  return {
    id: definition.id,
    displayNameKey: definition.displayNameKey
  };
}

function copyMapTopologyDefinition(
  topology: SaveMapTopologyDefinitionV1Dto
): SaveMapTopologyDefinitionV1Dto {
  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-map-topology-v1",
    topologyHash: topology.topologyHash,
    contentManifestHash: topology.contentManifestHash,
    districts: topology.districts.map((district) => ({
      districtId: district.districtId,
      sourceId: district.sourceId,
      displayNameKey: district.displayNameKey,
      anchor: copyMapTopologyPoint(district.anchor),
      polygon: district.polygon.map(copyMapTopologyPoint),
      metadata: copyMapTopologyMetadata(district.metadata)
    })),
    routeNodes: topology.routeNodes.map((node) => ({
      nodeId: node.nodeId,
      nodeKind: node.nodeKind,
      districtId: node.districtId,
      displayNameKey: node.displayNameKey,
      anchor: copyMapTopologyPoint(node.anchor)
    })),
    routeEdges: topology.routeEdges.map((edge) => ({
      routeId: edge.routeId,
      sourceId: edge.sourceId,
      from: copyMapTopologyRouteEndpoint(edge.from),
      to: copyMapTopologyRouteEndpoint(edge.to),
      mode: edge.mode,
      baseTravelCost: edge.baseTravelCost,
      baseCapacity: edge.baseCapacity,
      seasonality: edge.seasonality.map((season) => ({
        month: season.month,
        costMultiplierBps: season.costMultiplierBps,
        capacityMultiplierBps: season.capacityMultiplierBps,
        reasonCodes: season.reasonCodes.map((reasonCode) => reasonCode)
      })),
      availability: copyMapTopologyRouteAvailability(edge.availability),
      metadata: copyMapTopologyMetadata(edge.metadata)
    }))
  };
}

function copyMapTopologyPoint(point: SaveMapTopologyPointV1Dto): SaveMapTopologyPointV1Dto {
  return {
    x: point.x,
    y: point.y
  };
}

function copyMapTopologyMetadata(
  metadata: SaveMapTopologyMetadataV1Dto
): SaveMapTopologyMetadataV1Dto {
  return {
    historicity: metadata.historicity,
    terrainClass: metadata.terrainClass,
    riskClass: metadata.riskClass
  };
}

function copyMapTopologyRouteEndpoint(
  endpoint: SaveMapTopologyRouteEndpointV1Dto
): SaveMapTopologyRouteEndpointV1Dto {
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
  availability: SaveMapTopologyRouteAvailabilityV1Dto
): SaveMapTopologyRouteAvailabilityV1Dto {
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

function copyStrategicTerrainDefinition(
  terrain: SaveStrategicTerrainDefinitionV1Dto
): SaveStrategicTerrainDefinitionV1Dto {
  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1",
    strategicTerrainHash: terrain.strategicTerrainHash,
    contentManifestHash: terrain.contentManifestHash,
    authority: "terrain-route-node-v1",
    governanceFootprintRole: "overlay-only",
    authorityProhibitions: terrain.authorityProhibitions.map((prohibition) => prohibition),
    terrainPatches: terrain.terrainPatches.map((patch) => ({
      patchId: patch.patchId,
      sourceId: patch.sourceId,
      displayNameKey: patch.displayNameKey,
      terrainClass: patch.terrainClass,
      seasonSensitivity: patch.seasonSensitivity,
      historicity: patch.historicity,
      polygon: patch.polygon.map(copyStrategicTerrainPoint),
      explanationTags: patch.explanationTags.map((tag) => tag)
    })),
    barrierChannels: terrain.barrierChannels.map((channel) => ({
      channelId: channel.channelId,
      sourceId: channel.sourceId,
      displayNameKey: channel.displayNameKey,
      channelKind: channel.channelKind,
      traversalRule: channel.traversalRule,
      historicity: channel.historicity,
      points: channel.points.map(copyStrategicTerrainPoint),
      explanationTags: channel.explanationTags.map((tag) => tag)
    })),
    strategicNodes: terrain.strategicNodes.map((node) => ({
      nodeId: node.nodeId,
      sourceId: node.sourceId,
      displayNameKey: node.displayNameKey,
      nodeKind: node.nodeKind,
      districtId: node.districtId,
      anchor: copyStrategicTerrainPoint(node.anchor),
      localCapacity: node.localCapacity,
      knownState: node.knownState,
      terrainPatchIds: node.terrainPatchIds.map((id) => id),
      barrierChannelIds: node.barrierChannelIds.map((id) => id),
      governanceFootprintIds: node.governanceFootprintIds.map((id) => id),
      explanationTags: node.explanationTags.map((tag) => tag)
    })),
    routeCorridors: terrain.routeCorridors.map((corridor) => ({
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
      terrainPatchIds: corridor.terrainPatchIds.map((id) => id),
      barrierChannelIds: corridor.barrierChannelIds.map((id) => id),
      governanceFootprintIds: corridor.governanceFootprintIds.map((id) => id),
      seasonality: corridor.seasonality.map((season) => ({
        month: season.month,
        seasonState: season.seasonState,
        travelCostMultiplierBps: season.travelCostMultiplierBps,
        capacityMultiplierBps: season.capacityMultiplierBps,
        riskBps: season.riskBps,
        reasonCodes: season.reasonCodes.map((reasonCode) => reasonCode)
      })),
      availability: copyStrategicTerrainRouteAvailability(corridor.availability),
      polyline: corridor.polyline.map(copyStrategicTerrainPoint),
      explanationTags: corridor.explanationTags.map((tag) => tag)
    })),
    districtGovernanceFootprints: terrain.districtGovernanceFootprints.map((footprint) => ({
      footprintId: footprint.footprintId,
      sourceId: footprint.sourceId,
      displayNameKey: footprint.displayNameKey,
      districtId: footprint.districtId,
      overlayOnly: true,
      polygon: footprint.polygon.map(copyStrategicTerrainPoint),
      governanceTags: footprint.governanceTags.map((tag) => tag),
      consequenceTags: footprint.consequenceTags.map((tag) => tag)
    }))
  };
}

function copyStrategicTerrainPoint(
  point: SaveStrategicTerrainPointV1Dto
): SaveStrategicTerrainPointV1Dto {
  return {
    x: point.x,
    y: point.y
  };
}

function copyStrategicTerrainRouteAvailability(
  availability: SaveRouteCorridorAvailabilityV1Dto
): SaveRouteCorridorAvailabilityV1Dto {
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

function parseM6AlphaRuntimeState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6AlphaRuntimeStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M6 Alpha runtime state must be an object."));
    return undefined;
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", `${path}.schemaVersion`, "M6 Alpha schemaVersion must be 1.")
    );
    return undefined;
  }
  const terminalStates = parseM6Array(
    input["terminalStates"],
    `${path}.terminalStates`,
    "M6 Alpha terminalStates",
    errors,
    parseM6AlphaTerminalState
  );
  if (terminalStates === undefined) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    terminalStates
  };
}

function parseM6AlphaTerminalState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6AlphaTerminalStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M6 Alpha terminal state must be an object."));
    return fallbackM6AlphaTerminalState();
  }
  const evidence = parseM6AlphaTerminalEvidence(input["evidence"], `${path}.evidence`, errors);
  return {
    terminalStateId:
      readPositiveSafeInteger(input, "terminalStateId", `${path}.terminalStateId`, errors) ?? 0,
    polityId: readPositiveSafeInteger(input, "polityId", `${path}.polityId`, errors) ?? 0,
    outcome: parseM6AlphaTerminalOutcome(input["outcome"], `${path}.outcome`, errors),
    evaluatedDay:
      readNonnegativeSafeInteger(input, "evaluatedDay", `${path}.evaluatedDay`, errors) ?? 0,
    evaluatedRevision:
      readNonnegativeSafeInteger(input, "evaluatedRevision", `${path}.evaluatedRevision`, errors) ??
      0,
    maxDay: readNonnegativeSafeInteger(input, "maxDay", `${path}.maxDay`, errors) ?? 0,
    evidence,
    reasonCodes: parseStringArray(input["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseM6AlphaTerminalEvidence(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6AlphaTerminalEvidenceStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M6 Alpha terminal evidence must be an object."));
    return fallbackM6AlphaTerminalEvidence();
  }
  return {
    recognizedByCount:
      readNonnegativeSafeInteger(input, "recognizedByCount", `${path}.recognizedByCount`, errors) ??
      0,
    legitimacyScoreBps: readBps(input, "legitimacyScoreBps", `${path}.legitimacyScoreBps`, errors),
    postwarArrangementCount:
      readNonnegativeSafeInteger(
        input,
        "postwarArrangementCount",
        `${path}.postwarArrangementCount`,
        errors
      ) ?? 0,
    resolvedPolicyEventCount:
      readNonnegativeSafeInteger(
        input,
        "resolvedPolicyEventCount",
        `${path}.resolvedPolicyEventCount`,
        errors
      ) ?? 0,
    successionResolvedCount:
      readNonnegativeSafeInteger(
        input,
        "successionResolvedCount",
        `${path}.successionResolvedCount`,
        errors
      ) ?? 0,
    routeCount: readNonnegativeSafeInteger(input, "routeCount", `${path}.routeCount`, errors) ?? 0,
    populationGroupCount:
      readNonnegativeSafeInteger(
        input,
        "populationGroupCount",
        `${path}.populationGroupCount`,
        errors
      ) ?? 0
  };
}

function parseM6AlphaTerminalOutcome(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM6AlphaTerminalOutcomeDto {
  if (input === "victory" || input === "defeat" || input === "continued-play") {
    return input;
  }
  errors.push(
    reason(
      "invalid-schema",
      path,
      "M6 Alpha terminal outcome must be victory, defeat, or continued-play."
    )
  );
  return "continued-play";
}

function fallbackM6AlphaTerminalState(): SaveM6AlphaTerminalStateDto {
  return {
    terminalStateId: 0,
    polityId: 0,
    outcome: "continued-play",
    evaluatedDay: 0,
    evaluatedRevision: 0,
    maxDay: 0,
    evidence: fallbackM6AlphaTerminalEvidence(),
    reasonCodes: []
  };
}

function fallbackM6AlphaTerminalEvidence(): SaveM6AlphaTerminalEvidenceStateDto {
  return {
    recognizedByCount: 0,
    legitimacyScoreBps: 0,
    postwarArrangementCount: 0,
    resolvedPolicyEventCount: 0,
    successionResolvedCount: 0,
    routeCount: 0,
    populationGroupCount: 0
  };
}

function copySimpleRuntimeState(state: SaveSimpleRuntimeStateDto): SaveSimpleRuntimeStateDto {
  return {
    definitionId: state.definitionId
  };
}

function copyDistrictControl(control: SaveDistrictControlDto): SaveDistrictControlDto {
  switch (control.kind) {
    case "controlled":
      return {
        kind: "controlled",
        controllerPolityId: control.controllerPolityId
      };
    case "uncontrolled":
      return {
        kind: "uncontrolled"
      };
  }
}

function copyOptionalRuntimeSlices(
  base: Omit<SaveWorldRuntimeStateV0Dto, "m2" | "m3" | "m4" | "m6" | "m6PolicyEvents" | "m6Alpha">,
  m2: SaveM2EconomyPopulationStateDto | undefined,
  m3: SaveM3PolityVassalageStateDto | undefined,
  m4: SaveM4CampaignStateDto | undefined,
  m6: SaveM6DiplomacyLegitimacyStateDto | undefined,
  m6PolicyEvents: SaveM6PolicyEventRuntimeStateDto | undefined,
  m6Alpha: SaveM6AlphaRuntimeStateDto | undefined
): SaveWorldRuntimeStateV0Dto {
  return {
    ...base,
    ...(m2 === undefined ? {} : { m2: copyM2EconomyPopulationState(m2) }),
    ...(m3 === undefined ? {} : { m3: copyM3PolityVassalageState(m3) }),
    ...(m4 === undefined ? {} : { m4: copyM4CampaignState(m4) }),
    ...(m6 === undefined ? {} : { m6: copyM6DiplomacyLegitimacyState(m6) }),
    ...(m6PolicyEvents === undefined
      ? {}
      : { m6PolicyEvents: copyM6PolicyEventRuntimeState(m6PolicyEvents) }),
    ...(m6Alpha === undefined ? {} : { m6Alpha: copyM6AlphaRuntimeState(m6Alpha) })
  };
}

function copyOptionalCandidateRuntimeSlices(
  base: Omit<
    WorldStateV0ForSave["state"],
    "m2" | "m3" | "m4" | "m6" | "m6PolicyEvents" | "m6Alpha"
  >,
  m2: SaveM2EconomyPopulationStateDto | undefined,
  m3: SaveM3PolityVassalageStateDto | undefined,
  m4: SaveM4CampaignStateDto | undefined,
  m6: SaveM6DiplomacyLegitimacyStateDto | undefined,
  m6PolicyEvents: SaveM6PolicyEventRuntimeStateDto | undefined,
  m6Alpha: SaveM6AlphaRuntimeStateDto | undefined
): WorldStateV0ForSave["state"] {
  return {
    ...base,
    ...(m2 === undefined ? {} : { m2: copyM2EconomyPopulationState(m2) }),
    ...(m3 === undefined ? {} : { m3: copyM3PolityVassalageState(m3) }),
    ...(m4 === undefined ? {} : { m4: copyM4CampaignState(m4) }),
    ...(m6 === undefined ? {} : { m6: copyM6DiplomacyLegitimacyState(m6) }),
    ...(m6PolicyEvents === undefined
      ? {}
      : { m6PolicyEvents: copyM6PolicyEventRuntimeState(m6PolicyEvents) }),
    ...(m6Alpha === undefined ? {} : { m6Alpha: copyM6AlphaRuntimeState(m6Alpha) })
  };
}

function copyM6AlphaRuntimeState(runtime: SaveM6AlphaRuntimeStateDto): SaveM6AlphaRuntimeStateDto {
  return {
    schemaVersion: 1,
    terminalStates: runtime.terminalStates.map((terminal) => ({
      terminalStateId: terminal.terminalStateId,
      polityId: terminal.polityId,
      outcome: terminal.outcome,
      evaluatedDay: terminal.evaluatedDay,
      evaluatedRevision: terminal.evaluatedRevision,
      maxDay: terminal.maxDay,
      evidence: { ...terminal.evidence },
      reasonCodes: [...terminal.reasonCodes]
    }))
  };
}

function copyM6PolicyEventRuntimeState(
  runtime: SaveM6PolicyEventRuntimeStateDto
): SaveM6PolicyEventRuntimeStateDto {
  return {
    schemaVersion: 1,
    definitions: {
      policies: runtime.definitions.policies.map((policy) => ({
        policyId: policy.policyId,
        sourceId: policy.sourceId,
        displayNameKey: policy.displayNameKey,
        reasonCodes: [...policy.reasonCodes],
        encyclopediaRefs: [...policy.encyclopediaRefs]
      })),
      events: runtime.definitions.events.map((event) => ({
        eventDefinitionId: event.eventDefinitionId,
        sourceId: event.sourceId,
        displayNameKey: event.displayNameKey,
        cause: {
          kind: "day-at-least",
          day: event.cause.day,
          reasonCodes: [...event.cause.reasonCodes]
        },
        options: event.options.map((option) => ({
          optionId: option.optionId,
          displayNameKey: option.displayNameKey,
          consequences: option.consequences.map((consequence) => ({ ...consequence })),
          reasonCodes: [...option.reasonCodes],
          encyclopediaRefs: [...option.encyclopediaRefs]
        })),
        reasonCodes: [...event.reasonCodes],
        encyclopediaRefs: [...event.encyclopediaRefs]
      }))
    },
    activeEvents: runtime.activeEvents.map((event) => ({
      eventInstanceId: event.eventInstanceId,
      eventDefinitionId: event.eventDefinitionId,
      activatedDay: event.activatedDay,
      causeReasonCodes: [...event.causeReasonCodes]
    })),
    resolvedEvents: runtime.resolvedEvents.map((event) => ({
      eventInstanceId: event.eventInstanceId,
      eventDefinitionId: event.eventDefinitionId,
      selectedOptionId: event.selectedOptionId,
      resolvedDay: event.resolvedDay,
      reasonCodes: [...event.reasonCodes]
    })),
    policyModifiers: runtime.policyModifiers.map((modifier) => ({ ...modifier })),
    nextEventInstanceId: runtime.nextEventInstanceId,
    nextModifierId: runtime.nextModifierId
  };
}

function copyM6DiplomacyLegitimacyState(
  m6: SaveM6DiplomacyLegitimacyStateDto
): SaveM6DiplomacyLegitimacyStateDto {
  return {
    schemaVersion: 1,
    relations: m6.relations.map((relation) => ({
      relationId: relation.relationId,
      polityAId: relation.polityAId,
      polityBId: relation.polityBId,
      trustBps: relation.trustBps,
      affinityBps: relation.affinityBps,
      fearBps: relation.fearBps,
      threatBps: relation.threatBps,
      interestAlignmentBps: relation.interestAlignmentBps,
      historicalDebt: relation.historicalDebt,
      borderConflictBps: relation.borderConflictBps,
      updatedDay: relation.updatedDay,
      reasonCodes: [...relation.reasonCodes]
    })),
    agreements: m6.agreements.map((agreement) => ({
      agreementId: agreement.agreementId,
      relationId: agreement.relationId,
      proposerPolityId: agreement.proposerPolityId,
      targetPolityId: agreement.targetPolityId,
      agreementKind: agreement.agreementKind,
      status: agreement.status,
      startDay: agreement.startDay,
      endDay: agreement.endDay,
      recognitionDirection: agreement.recognitionDirection,
      reasonCodes: [...agreement.reasonCodes]
    })),
    recognitionEdges: m6.recognitionEdges.map((edge) => ({
      fromPolityId: edge.fromPolityId,
      toPolityId: edge.toPolityId,
      agreementId: edge.agreementId,
      reasonCode: edge.reasonCode
    })),
    legitimacySources: m6.legitimacySources.map((source) => ({
      sourceId: source.sourceId,
      polityId: source.polityId,
      audience: source.audience,
      sourceKind: source.sourceKind,
      magnitudeBps: source.magnitudeBps,
      sourceRef: source.sourceRef,
      reasonCode: source.reasonCode,
      createdDay: source.createdDay
    })),
    legitimacyProfiles: m6.legitimacyProfiles.map((profile) => ({
      polityId: profile.polityId,
      audience: profile.audience,
      scoreBps: profile.scoreBps,
      pressureBps: profile.pressureBps,
      sourceIds: [...profile.sourceIds],
      reasonCodes: [...profile.reasonCodes]
    }))
  };
}

function copyM4CampaignState(m4: SaveM4CampaignStateDto): SaveM4CampaignStateDto {
  return {
    schemaVersion: 1,
    campaignPlans: m4.campaignPlans.map(copyM4CampaignPlan),
    factionKnowledgeSnapshots: m4.factionKnowledgeSnapshots.map(copyM4FactionKnowledgeSnapshot),
    mobilizedForceCommitments: m4.mobilizedForceCommitments.map(copyM4MobilizedForceCommitment),
    grainSupplyReservations: m4.grainSupplyReservations.map(copyM4GrainSupplyReservation),
    marches: m4.marches.map(copyM4CampaignMarch),
    fieldEngagements: m4.fieldEngagements.map(copyM4FieldEngagement),
    sieges: m4.sieges.map(copyM4Siege),
    withdrawals: m4.withdrawals.map(copyM4Withdrawal),
    warOutcomes: m4.warOutcomes.map(copyM4WarOutcome),
    postwarCandidates: m4.postwarCandidates.map(copyM4PostwarCandidate)
  };
}

function copyM4CampaignPlan(plan: SaveM4CampaignPlanStateDto): SaveM4CampaignPlanStateDto {
  return {
    id: plan.id,
    owner: copyM4CampaignOwner(plan.owner),
    target: copyM4CampaignTarget(plan.target),
    objectiveKind: plan.objectiveKind,
    startWindow: copyM4StartWindow(plan.startWindow),
    status: plan.status,
    statusReasonCode: plan.statusReasonCode,
    reasonCodes: [...plan.reasonCodes],
    createdDay: plan.createdDay,
    updatedDay: plan.updatedDay
  };
}

function copyM4CampaignOwner(owner: SaveM4CampaignOwnerDto): SaveM4CampaignOwnerDto {
  switch (owner.kind) {
    case "commander":
      return { kind: "commander", characterId: owner.characterId };
    case "polity":
      return { kind: "polity", polityId: owner.polityId };
  }
}

function copyM4CampaignTarget(target: SaveM4CampaignTargetDto): SaveM4CampaignTargetDto {
  switch (target.kind) {
    case "district":
      return { kind: "district", districtId: target.districtId };
    case "polity":
      return { kind: "polity", polityId: target.polityId };
  }
}

function copyM4StartWindow(window: SaveM4CampaignStartWindowDto): SaveM4CampaignStartWindowDto {
  return {
    earliestDay: window.earliestDay,
    latestDay: window.latestDay
  };
}

function copyM4FactionKnowledgeSnapshot(
  snapshot: SaveM4FactionKnowledgeSnapshotStateDto
): SaveM4FactionKnowledgeSnapshotStateDto {
  return {
    snapshotId: snapshot.snapshotId,
    observerPolityId: snapshot.observerPolityId,
    subjectPolityId: snapshot.subjectPolityId,
    knowledgeVersion: snapshot.knowledgeVersion,
    recordedDay: snapshot.recordedDay,
    source: {
      kind: snapshot.source.kind,
      sourceId: snapshot.source.sourceId,
      reliabilityBps: snapshot.source.reliabilityBps
    },
    knownObjectives: snapshot.knownObjectives.map((objective) => ({
      campaignPlanId: objective.campaignPlanId,
      target: copyM4CampaignTarget(objective.target),
      objectiveKind: objective.objectiveKind,
      confidenceBps: objective.confidenceBps,
      reasonCodes: [...objective.reasonCodes]
    })),
    routeEstimates: snapshot.routeEstimates.map((estimate) => ({
      routeId: estimate.routeId,
      fromDistrictId: estimate.fromDistrictId,
      toDistrictId: estimate.toDistrictId,
      travelCostEstimate: estimate.travelCostEstimate,
      capacityEstimate: estimate.capacityEstimate,
      confidenceBps: estimate.confidenceBps
    })),
    supplyEstimates: snapshot.supplyEstimates.map((estimate) => ({
      districtId: estimate.districtId,
      supplyMin: estimate.supplyMin,
      supplyMax: estimate.supplyMax,
      confidenceBps: estimate.confidenceBps
    })),
    defenderEstimates: snapshot.defenderEstimates.map((estimate) => ({
      target: copyM4CampaignTarget(estimate.target),
      defenderMin: estimate.defenderMin,
      defenderMax: estimate.defenderMax,
      confidenceBps: estimate.confidenceBps
    }))
  };
}

function copyM4MobilizedForceCommitment(
  commitment: SaveM4MobilizedForceCommitmentStateDto
): SaveM4MobilizedForceCommitmentStateDto {
  return {
    id: commitment.id,
    campaignPlanId: commitment.campaignPlanId,
    source: { ...commitment.source },
    promisedTroops: commitment.promisedTroops,
    dueDay: commitment.dueDay,
    assemblyWindow: copyM4StartWindow(commitment.assemblyWindow),
    plannedAssemblyDay: commitment.plannedAssemblyDay,
    assembledTroops: commitment.assembledTroops,
    delayedTroops: commitment.delayedTroops,
    refusedTroops: commitment.refusedTroops,
    releasedTroops: commitment.releasedTroops,
    status: commitment.status,
    statusReasonCode: commitment.statusReasonCode,
    reasonCodes: [...commitment.reasonCodes],
    localCostHooks: commitment.localCostHooks.map(copyM4MusterLocalCostHook)
  };
}

function copyM4MusterLocalCostHook(
  hook: SaveM4MusterLocalCostHookDto
): SaveM4MusterLocalCostHookDto {
  switch (hook.kind) {
    case "economic-labor-reservation":
      return {
        kind: hook.kind,
        districtId: hook.districtId,
        laborAmount: hook.laborAmount,
        reasonCode: hook.reasonCode
      };
    case "loyalty-pressure":
      return {
        kind: hook.kind,
        polityId: hook.polityId,
        pressureBps: hook.pressureBps,
        reasonCode: hook.reasonCode
      };
  }
}

function copyM4GrainSupplyReservation(
  reservation: SaveM4GrainSupplyReservationStateDto
): SaveM4GrainSupplyReservationStateDto {
  return {
    reservationId: reservation.reservationId,
    campaignPlanId: reservation.campaignPlanId,
    source: { ...reservation.source },
    reservedAmount: reservation.reservedAmount,
    carriedAmount: reservation.carriedAmount,
    consumedAmount: reservation.consumedAmount,
    shortageAmount: reservation.shortageAmount,
    lossAmount: reservation.lossAmount,
    lossReasonCode: reservation.lossReasonCode,
    expectedDailyConsumption: reservation.expectedDailyConsumption,
    expectedDaysOfSupply: reservation.expectedDaysOfSupply,
    status: reservation.status,
    statusReasonCode: reservation.statusReasonCode,
    reasonCodes: [...reservation.reasonCodes]
  };
}

function copyM4CampaignMarch(march: SaveM4CampaignMarchStateDto): SaveM4CampaignMarchStateDto {
  return {
    marchId: march.marchId,
    campaignPlanId: march.campaignPlanId,
    originDistrictId: march.originDistrictId,
    targetDistrictId: march.targetDistrictId,
    currentDistrictId: march.currentDistrictId,
    routeSegments: march.routeSegments.map((segment) => ({
      routeId: segment.routeId,
      fromDistrictId: segment.fromDistrictId,
      toDistrictId: segment.toDistrictId,
      travelDays: segment.travelDays,
      capacity: segment.capacity,
      seasonRiskReasonCodes: [...segment.seasonRiskReasonCodes]
    })),
    currentSegmentIndex: march.currentSegmentIndex,
    progressOnSegmentDays: march.progressOnSegmentDays,
    activeTroops: march.activeTroops,
    grainPerTroopPerDay: march.grainPerTroopPerDay,
    supply: { ...march.supply },
    status: march.status,
    statusReasonCode: march.statusReasonCode,
    reasonCodes: [...march.reasonCodes],
    startedDay: march.startedDay,
    updatedDay: march.updatedDay,
    predictedArrivalWindow: copyM4StartWindow(march.predictedArrivalWindow),
    actualArrivalDay: march.actualArrivalDay,
    joinedCommitmentIds: [...march.joinedCommitmentIds],
    joinedCommitmentTroops: march.joinedCommitmentTroops.map((entry) => ({
      commitmentId: entry.commitmentId,
      joinedTroops: entry.joinedTroops
    })),
    failedCommitmentIds: [...march.failedCommitmentIds]
  };
}

function copyM4FieldEngagement(
  engagement: SaveM4FieldEngagementStateDto
): SaveM4FieldEngagementStateDto {
  return {
    engagementId: engagement.engagementId,
    campaignPlanId: engagement.campaignPlanId,
    marchId: engagement.marchId,
    attackerPolityId: engagement.attackerPolityId,
    defenderPolityId: engagement.defenderPolityId,
    target: copyM4CampaignTarget(engagement.target),
    attackerTroopsBefore: engagement.attackerTroopsBefore,
    attackerTroopsAfter: engagement.attackerTroopsAfter,
    defenderEstimatedTroopsBefore: engagement.defenderEstimatedTroopsBefore,
    defenderEstimatedTroopsAfter: engagement.defenderEstimatedTroopsAfter,
    attackerCasualties: engagement.attackerCasualties,
    defenderCasualties: engagement.defenderCasualties,
    supplyLoss: engagement.supplyLoss,
    defenderFortification: engagement.defenderFortification,
    outcome: engagement.outcome,
    reasonCodes: [...engagement.reasonCodes],
    creditHooks: engagement.creditHooks.map(copyM4CampaignHook),
    reputationHooks: engagement.reputationHooks.map(copyM4CampaignHook),
    resolvedDay: engagement.resolvedDay
  };
}

function copyM4CampaignHook(hook: SaveM4CampaignHookStateDto): SaveM4CampaignHookStateDto {
  return {
    polityId: hook.polityId,
    amount: hook.amount,
    reasonCode: hook.reasonCode
  };
}

function copyM4Siege(siege: SaveM4SiegeStateDto): SaveM4SiegeStateDto {
  return {
    siegeId: siege.siegeId,
    campaignPlanId: siege.campaignPlanId,
    marchId: siege.marchId,
    targetDistrictId: siege.targetDistrictId,
    attackerPolityId: siege.attackerPolityId,
    defenderPolityId: siege.defenderPolityId,
    status: siege.status,
    statusReasonCode: siege.statusReasonCode,
    fortification: siege.fortification,
    defenderEstimatedTroops: siege.defenderEstimatedTroops,
    defenderSupply: siege.defenderSupply,
    siegeProgress: siege.siegeProgress,
    daysInvested: siege.daysInvested,
    blockadeDays: siege.blockadeDays,
    assaultCount: siege.assaultCount,
    attackerTroops: siege.attackerTroops,
    attackerCasualties: siege.attackerCasualties,
    defenderCasualties: siege.defenderCasualties,
    supplyLoss: siege.supplyLoss,
    surrenderEligible: siege.surrenderEligible,
    surrenderReasonCodes: [...siege.surrenderReasonCodes],
    reasonCodes: [...siege.reasonCodes],
    creditHooks: siege.creditHooks.map(copyM4CampaignHook),
    reputationHooks: siege.reputationHooks.map(copyM4CampaignHook),
    startedDay: siege.startedDay,
    updatedDay: siege.updatedDay
  };
}

function copyM4Withdrawal(withdrawal: SaveM4WithdrawalStateDto): SaveM4WithdrawalStateDto {
  return {
    withdrawalId: withdrawal.withdrawalId,
    campaignPlanId: withdrawal.campaignPlanId,
    marchId: withdrawal.marchId,
    siegeId: withdrawal.siegeId,
    kind: withdrawal.kind,
    triggerReason: withdrawal.triggerReason,
    troopsBefore: withdrawal.troopsBefore,
    troopsExtracted: withdrawal.troopsExtracted,
    casualties: withdrawal.casualties,
    supplyLoss: withdrawal.supplyLoss,
    creditHooks: withdrawal.creditHooks.map(copyM4CampaignHook),
    reputationHooks: withdrawal.reputationHooks.map(copyM4CampaignHook),
    reasonCodes: [...withdrawal.reasonCodes],
    resolvedDay: withdrawal.resolvedDay
  };
}

function copyM4WarOutcome(outcome: SaveM4WarOutcomeStateDto): SaveM4WarOutcomeStateDto {
  return {
    outcomeId: outcome.outcomeId,
    campaignPlanId: outcome.campaignPlanId,
    victorPolityId: outcome.victorPolityId,
    localPolityId: outcome.localPolityId,
    targetDistrictId: outcome.targetDistrictId,
    attackerCasualties: outcome.attackerCasualties,
    defenderCasualties: outcome.defenderCasualties,
    supplyLoss: outcome.supplyLoss,
    withdrawalId: outcome.withdrawalId,
    siegeId: outcome.siegeId,
    postwarCandidate:
      outcome.postwarCandidate === null ? null : copyM4PostwarCandidate(outcome.postwarCandidate),
    reasonCodes: [...outcome.reasonCodes],
    resolvedDay: outcome.resolvedDay
  };
}

function copyM4PostwarCandidate(
  candidate: SaveM4PostwarCandidateStateDto
): SaveM4PostwarCandidateStateDto {
  return {
    candidateId: candidate.candidateId,
    sourceWarOutcomeId: candidate.sourceWarOutcomeId,
    settlementId: candidate.settlementId,
    victorPolityId: candidate.victorPolityId,
    localPolityId: candidate.localPolityId,
    districtId: candidate.districtId,
    validM3Methods: [...candidate.validM3Methods],
    reasonCodes: [...candidate.reasonCodes]
  };
}

function copyM2EconomyPopulationState(
  m2: SaveM2EconomyPopulationStateDto
): SaveM2EconomyPopulationStateDto {
  return {
    schemaVersion: 1,
    populationGroups: m2.populationGroups.map((group) => ({
      id: group.id,
      districtId: group.districtId,
      totalPeople: group.totalPeople,
      workingPeople: group.workingPeople,
      dependentPeople: group.dependentPeople,
      availableLabor: group.availableLabor,
      grainStock: group.grainStock,
      cashStock: group.cashStock,
      committedLabor: group.committedLabor.map((commitment) => ({
        purpose: commitment.purpose,
        laborAmount: commitment.laborAmount,
        startDay: commitment.startDay,
        releaseDay: commitment.releaseDay
      }))
    })),
    agriculture: {
      districts: m2.agriculture.districts.map((district) => ({
        districtId: district.districtId,
        phase: district.phase,
        daysInPhase: district.daysInPhase,
        accumulatedFarmLabor: district.accumulatedFarmLabor,
        expectedHarvestGrain: district.expectedHarvestGrain,
        lastHarvestGrain: district.lastHarvestGrain
      }))
    },
    market: {
      districts: m2.market.districts.map((district) => ({
        districtId: district.districtId,
        grainPriceCashPerHundred: district.grainPriceCashPerHundred,
        cashFlow: {
          cumulativeMobilizationCost: district.cashFlow.cumulativeMobilizationCost,
          lastDailyCashDelta: district.cashFlow.lastDailyCashDelta
        },
        grainFlow: {
          lastHarvestDelta: district.grainFlow.lastHarvestDelta
        }
      }))
    },
    transport: {
      schemaVersion: 1,
      routes: m2.transport.routes.map((route) => ({
        routeId: route.routeId,
        fromDistrictId: route.fromDistrictId,
        toDistrictId: route.toDistrictId,
        routeKind: route.routeKind,
        baseTravelCost: route.baseTravelCost,
        baseCapacity: route.baseCapacity
      })),
      districtSeasonality: m2.transport.districtSeasonality.map((entry) => ({
        districtId: entry.districtId,
        regionalCurveId: entry.regionalCurveId
      })),
      regionalCurves: m2.transport.regionalCurves.map((curve) => ({
        id: curve.id,
        monthlyValues: curve.monthlyValues.map((month) => ({
          month: month.month,
          monsoonIntensityBps: month.monsoonIntensityBps,
          agricultureWorkBps: month.agricultureWorkBps,
          riverNavigabilityBps: month.riverNavigabilityBps,
          roadTravelCostBps: month.roadTravelCostBps
        }))
      }))
    }
  };
}

function copyM3PolityVassalageState(
  m3: SaveM3PolityVassalageStateDto
): SaveM3PolityVassalageStateDto {
  return {
    schemaVersion: 1,
    polities: m3.polities.map((entry) => ({
      polityId: entry.polityId,
      directSuzerainPolityId: entry.directSuzerainPolityId
    })),
    obligations: m3.obligations.map((entry) => ({
      id: entry.id,
      debtorPolityId: entry.debtorPolityId,
      creditorPolityId: entry.creditorPolityId,
      obligationKind: entry.obligationKind,
      obligationCategory: entry.obligationCategory,
      obligationSource: {
        kind: "vassalage",
        sourceId: entry.obligationSource.sourceId,
        debtorPolityId: entry.obligationSource.debtorPolityId,
        creditorPolityId: entry.obligationSource.creditorPolityId
      },
      requirement: copyM3Requirement(entry.requirement),
      due: copyM3Due(entry.due),
      accounting: { ...entry.accounting },
      status: entry.status,
      disputeReasonCode: entry.disputeReasonCode,
      breachReasonCode: entry.breachReasonCode,
      createdAuditEventId: entry.createdAuditEventId,
      latestAuditEventId: entry.latestAuditEventId
    })),
    obligationAuditEvents: m3.obligationAuditEvents.map((entry) => ({
      id: entry.id,
      obligationId: entry.obligationId,
      eventKind: entry.eventKind,
      eventDay: entry.eventDay,
      eventRevision: entry.eventRevision,
      commandId: entry.commandId,
      actor: { ...entry.actor },
      actionKind: entry.actionKind,
      dueDay: entry.dueDay,
      fulfillmentId: entry.fulfillmentId,
      fulfilledAmount: entry.fulfilledAmount,
      statusAfter: entry.statusAfter,
      reasonCode: entry.reasonCode,
      reasonCodes: entry.reasonCodes.map((reasonCode) => reasonCode),
      reliabilityBps: entry.reliabilityBps
    })),
    fulfillmentClaims: m3.fulfillmentClaims.map((entry) => ({
      fulfillmentId: entry.fulfillmentId,
      obligationId: entry.obligationId,
      auditEventId: entry.auditEventId,
      actionKind: entry.actionKind,
      dueDay: entry.dueDay,
      fulfilledAmount: entry.fulfilledAmount,
      deliveredAmount: entry.deliveredAmount,
      arrearsAmount: entry.arrearsAmount,
      defaultedAmount: entry.defaultedAmount,
      reasonCode: entry.reasonCode,
      sourceMovements: entry.sourceMovements.map(copyM3FulfillmentSourceMovement)
    })),
    administrativeDistricts: m3.administrativeDistricts.map((entry) => ({ ...entry })),
    characters: m3.characters.map((entry) => ({ ...entry })),
    relationships: m3.relationships.map((entry) => ({ ...entry })),
    offices: m3.offices.map((entry) => ({
      ...entry,
      jurisdiction: copyM3OfficeJurisdiction(entry.jurisdiction)
    })),
    policies: m3.policies.map((entry) => ({
      ...entry,
      target: copyM3PolicyTarget(entry.target)
    })),
    enfeoffments: m3.enfeoffments.map((entry) => ({ ...entry })),
    appointmentAuditEvents: m3.appointmentAuditEvents.map((entry) => ({
      ...entry,
      actor: { ...entry.actor }
    })),
    successionCandidateProfiles: m3.successionCandidateProfiles.map((entry) => ({
      polityId: entry.polityId,
      characterId: entry.characterId,
      requiresRegency: entry.requiresRegency,
      supportSources: entry.supportSources.map((source) => ({ ...source }))
    })),
    successionCrises: m3.successionCrises.map((entry) => ({
      id: entry.id,
      polityId: entry.polityId,
      trigger: copyM3SuccessionTrigger(entry.trigger),
      status: entry.status,
      startedDay: entry.startedDay,
      resolvedDay: entry.resolvedDay,
      candidates: entry.candidates.map((candidate) => ({
        characterId: candidate.characterId,
        requiresRegency: candidate.requiresRegency,
        supportSources: candidate.supportSources.map((source) => ({ ...source })),
        supportTotalBps: candidate.supportTotalBps
      })),
      outcome: entry.outcome === null ? null : copyM3SuccessionOutcome(entry.outcome),
      reasonCode: entry.reasonCode
    }))
  };
}

function copyM3Requirement(
  requirement: SaveM3ObligationRequirementDto
): SaveM3ObligationRequirementDto {
  switch (requirement.kind) {
    case "amount":
      return {
        kind: "amount",
        resourceKind: requirement.resourceKind,
        amount: requirement.amount
      };
    case "condition":
      return {
        kind: "condition",
        conditionKey: requirement.conditionKey
      };
  }
}

function copyM3Due(due: SaveM3ObligationDueDto): SaveM3ObligationDueDto {
  switch (due.kind) {
    case "cadence":
      return {
        kind: "cadence",
        periodDays: due.periodDays,
        nextDueDay: due.nextDueDay
      };
    case "trigger":
      return {
        kind: "trigger",
        triggerKey: due.triggerKey
      };
  }
}

function copyM3FulfillmentSourceMovement(
  movement: SaveM3FulfillmentSourceMovementStateDto
): SaveM3FulfillmentSourceMovementStateDto {
  switch (movement.kind) {
    case "m2-population-group":
      return { ...movement };
    case "m3-troop-commitment-placeholder":
      return { ...movement };
  }
}

function copyM3OfficeJurisdiction(
  jurisdiction: SaveM3OfficeJurisdictionDto
): SaveM3OfficeJurisdictionDto {
  switch (jurisdiction.kind) {
    case "polity":
      return { kind: "polity", polityId: jurisdiction.polityId };
    case "district":
      return { kind: "district", districtId: jurisdiction.districtId };
  }
}

function copyM3PolicyTarget(target: SaveM3PolicyTargetDto): SaveM3PolicyTargetDto {
  switch (target.kind) {
    case "office":
      return { kind: "office", officeId: target.officeId };
    case "polity":
      return { kind: "polity", polityId: target.polityId };
    case "district":
      return { kind: "district", districtId: target.districtId };
  }
}

function copyM3SuccessionTrigger(trigger: SaveM3SuccessionTriggerDto): SaveM3SuccessionTriggerDto {
  switch (trigger.kind) {
    case "death":
      return { kind: "death", characterId: trigger.characterId, officeId: trigger.officeId };
    case "incapacity":
      return { kind: "incapacity", characterId: trigger.characterId, officeId: trigger.officeId };
    case "abdication":
      return { kind: "abdication", characterId: trigger.characterId, officeId: trigger.officeId };
  }
}

function copyM3SuccessionOutcome(outcome: SaveM3SuccessionOutcomeDto): SaveM3SuccessionOutcomeDto {
  switch (outcome.kind) {
    case "peaceful":
      return {
        kind: "peaceful",
        successorCharacterId: outcome.successorCharacterId,
        supportTotalBps: outcome.supportTotalBps
      };
    case "regency":
      return { ...outcome };
    case "disputed":
      return { ...outcome };
  }
}

function fallbackM3Obligation(): SaveM3ObligationStateDto {
  return {
    id: 0,
    debtorPolityId: 0,
    creditorPolityId: 0,
    obligationKind: "tribute",
    obligationCategory: "regular-tribute",
    obligationSource: { kind: "vassalage", sourceId: "", debtorPolityId: 0, creditorPolityId: 0 },
    requirement: { kind: "amount", resourceKind: "cash", amount: 0 },
    due: { kind: "cadence", periodDays: 0, nextDueDay: 0 },
    accounting: fallbackM3ObligationAccounting(),
    status: "active",
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: 0,
    latestAuditEventId: 0
  };
}

function fallbackM3ObligationAccounting(): SaveM3ObligationAccountingStateDto {
  return {
    nominalAmount: 0,
    dueAmount: 0,
    deliveredAmount: 0,
    arrearsAmount: 0,
    defaultedAmount: 0,
    remittedAmount: 0,
    dueDay: 0,
    cycle: 0,
    troopResponseState: "none"
  };
}

function fallbackM3ObligationAuditEvent(): SaveM3ObligationAuditEventStateDto {
  return {
    id: 0,
    obligationId: 0,
    eventKind: "created",
    eventDay: 0,
    eventRevision: 0,
    commandId: "",
    actor: { kind: "system", id: "" },
    actionKind: null,
    dueDay: null,
    fulfillmentId: null,
    fulfilledAmount: null,
    statusAfter: "active",
    reasonCode: null,
    reasonCodes: [],
    reliabilityBps: 0
  };
}

function fallbackM3FulfillmentClaim(): SaveM3FulfillmentClaimStateDto {
  return {
    fulfillmentId: 0,
    obligationId: 0,
    auditEventId: 0,
    actionKind: "fulfillment",
    dueDay: 0,
    fulfilledAmount: 0,
    deliveredAmount: 0,
    arrearsAmount: 0,
    defaultedAmount: 0,
    reasonCode: "",
    sourceMovements: []
  };
}

function fallbackM3AdministrativeDistrict(): SaveM3AdministrativeDistrictStateDto {
  return {
    polityId: 0,
    districtId: 0,
    controlMode: "direct",
    localComplexity: 0,
    communicationCost: 0,
    directness: 0,
    frontierPressure: 0,
    administrativeCapacity: 0
  };
}

function fallbackM3Character(): SaveM3CharacterStateDto {
  return {
    characterId: 0,
    polityId: 0,
    alive: false,
    incapacitated: false,
    currentDistrictId: 0,
    commandBps: 0,
    administrationBps: 0,
    diplomacyBps: 0
  };
}

function fallbackM3Office(): SaveM3OfficeStateDto {
  return {
    officeId: 0,
    polityId: 0,
    jurisdiction: { kind: "polity", polityId: 0 },
    officeKind: "governor",
    primary: false,
    holderCharacterId: null,
    policyId: 0,
    minimumCommandBps: 0,
    minimumAdministrationBps: 0
  };
}

function fallbackM3Policy(): SaveM3PolicyStateDto {
  return {
    policyId: 0,
    target: { kind: "polity", polityId: 0 },
    stance: "balanced",
    intensityBps: 0
  };
}

function fallbackM3AppointmentAuditEvent(): SaveM3AppointmentAuditEventStateDto {
  return {
    id: 0,
    eventKind: "appointment",
    eventDay: 0,
    eventRevision: 0,
    commandId: "",
    actor: { kind: "system", id: "" },
    officeId: null,
    characterId: null,
    policyId: null,
    districtId: null,
    reasonCode: ""
  };
}

function fallbackM3SuccessionCrisis(): SaveM3SuccessionCrisisStateDto {
  return {
    id: 0,
    polityId: 0,
    trigger: { kind: "death", characterId: 0, officeId: null },
    status: "pending",
    startedDay: 0,
    resolvedDay: null,
    candidates: [],
    outcome: null,
    reasonCode: ""
  };
}

function fallbackM2PopulationGroup(): SaveM2PopulationGroupStateDto {
  return {
    id: 0,
    districtId: 0,
    totalPeople: 0,
    workingPeople: 0,
    dependentPeople: 0,
    availableLabor: 0,
    grainStock: 0,
    cashStock: 0,
    committedLabor: []
  };
}

function fallbackM2MarketDistrict(): SaveM2DistrictMarketStateDto {
  return {
    districtId: 0,
    grainPriceCashPerHundred: 0,
    cashFlow: { cumulativeMobilizationCost: 0, lastDailyCashDelta: 0 },
    grainFlow: { lastHarvestDelta: 0 }
  };
}

function fallbackMapTopologyMetadata(): SaveMapTopologyMetadataV1Dto {
  return {
    historicity: "COMPOSITE",
    terrainClass: "unknown",
    riskClass: "unknown"
  };
}

function parseM2AgriculturePhase(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2AgriculturePhaseDto {
  if (input === "fallow" || input === "planting" || input === "growing" || input === "harvest") {
    return input;
  }

  errors.push(
    reason(
      "invalid-schema",
      path,
      "M2 agriculture phase must be fallow, planting, growing, or harvest."
    )
  );
  return "fallow";
}

function parseM2RouteKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2RouteKindDto {
  if (input === "coast" || input === "river" || input === "road") {
    return input;
  }

  errors.push(reason("invalid-schema", path, "M2 routeKind must be coast, river, or road."));
  return "road";
}

function parseMapTopologyRouteNodeKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRouteNodeKindV1Dto {
  if (input === "pass" || input === "port" || input === "special" || input === "warehouse") {
    return input;
  }

  errors.push(
    reason(
      "invalid-schema",
      path,
      "Map topology route node kind must be pass, port, special, or warehouse."
    )
  );
  return "special";
}

function parseMapTopologyRouteMode(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRouteModeV1Dto {
  if (input === "coast" || input === "river" || input === "road") {
    return input;
  }

  errors.push(
    reason("invalid-schema", path, "Map topology route mode must be coast, river, or road.")
  );
  return "road";
}

function parseMapTopologyHistoricityTag(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyHistoricityTagV1Dto {
  if (
    input === "COMPOSITE" ||
    input === "FICTIONAL" ||
    input === "HISTORICAL" ||
    input === "INFERRED"
  ) {
    return input;
  }

  errors.push(
    reason(
      "invalid-schema",
      path,
      "Map topology historicity must be COMPOSITE, FICTIONAL, HISTORICAL, or INFERRED."
    )
  );
  return "COMPOSITE";
}

function parseMapTopologyTerrainClass(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyTerrainClassV1Dto {
  if (
    input === "coastal" ||
    input === "lowland" ||
    input === "pass" ||
    input === "riverine" ||
    input === "upland" ||
    input === "urban" ||
    input === "unknown"
  ) {
    return input;
  }

  errors.push(reason("invalid-schema", path, "Map topology terrainClass is invalid."));
  return "unknown";
}

function parseMapTopologyRiskClass(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveMapTopologyRiskClassV1Dto {
  if (
    input === "contested" ||
    input === "hazardous" ||
    input === "low" ||
    input === "seasonal" ||
    input === "unknown"
  ) {
    return input;
  }

  errors.push(reason("invalid-schema", path, "Map topology riskClass is invalid."));
  return "unknown";
}

function readNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): string | undefined {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a non-empty string.`));
  return undefined;
}

function readNullableString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): string | null {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a non-empty string or null.`));
  return null;
}

function readString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): string {
  return readNonEmptyString(record, key, path, errors) ?? "";
}

function readBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): boolean {
  const value = record[key];
  if (typeof value === "boolean") {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a boolean.`));
  return false;
}

function readChecksum(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): string | undefined {
  const value = record[key];
  if (typeof value === "string" && /^[0-9a-f]{8}$/u.test(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be an 8-character lowercase hex hash.`));
  return undefined;
}

function readPositiveSafeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (isPositiveSafeInteger(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a positive safe integer.`));
  return undefined;
}

function readBps(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number {
  return readIntegerInRange(record, key, path, 0, 10_000, errors) ?? 0;
}

function readNullablePositiveSafeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number | null {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (isPositiveSafeInteger(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a positive safe integer or null.`));
  return null;
}

function readNonnegativeSafeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (isNonnegativeSafeInteger(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a nonnegative safe integer.`));
  return undefined;
}

function readNullableNonnegativeSafeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number | null {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (isNonnegativeSafeInteger(value)) {
    return value;
  }
  errors.push(
    reason("invalid-schema", path, `${path} must be a nonnegative safe integer or null.`)
  );
  return null;
}

function readIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  ) {
    return value;
  }

  errors.push(
    reason("invalid-schema", path, `${path} must be a safe integer from ${minimum} to ${maximum}.`)
  );
  return undefined;
}

function parseJsonBytes(
  bytes: Uint8Array
):
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false; readonly reason: SaveLoadRejectionReasonV1 } {
  const decoded = decodeUtf8(bytes);
  if (!decoded.ok) {
    return {
      ok: false,
      reason: reason("malformed-json", "$", decoded.message)
    };
  }

  const text = decoded.text;
  try {
    return {
      ok: true,
      value: JSON.parse(text) as unknown
    };
  } catch {
    return {
      ok: false,
      reason: reason("malformed-json", "$", "Save payload must be valid JSON.")
    };
  }
}

function validateDepth(input: unknown, maxDepth: number): SaveLoadRejectionReasonV1 | null {
  if (!isNonnegativeSafeInteger(maxDepth) || maxDepth <= 0) {
    return reason("invalid-schema", "maxDepth", "maxDepth must be a positive safe integer.");
  }
  if (measureDepth(input, 0, maxDepth) > maxDepth) {
    return reason("depth-limit", "$", `Save JSON depth exceeds limit ${maxDepth}.`);
  }
  return null;
}

function measureDepth(input: unknown, currentDepth: number, maxDepth: number): number {
  if (currentDepth > maxDepth || typeof input !== "object" || input === null) {
    return currentDepth;
  }
  if (Array.isArray(input)) {
    return input.reduce(
      (depth, value) => Math.max(depth, measureDepth(value, currentDepth + 1, maxDepth)),
      currentDepth
    );
  }
  return Object.values(input).reduce(
    (depth, value) => Math.max(depth, measureDepth(value, currentDepth + 1, maxDepth)),
    currentDepth
  );
}

function canonicalJson(input: unknown): string {
  if (input === null) {
    return "null";
  }
  switch (typeof input) {
    case "boolean":
      return input ? "true" : "false";
    case "number":
      if (!Number.isFinite(input)) {
        throw new Error("Canonical JSON cannot encode non-finite numbers.");
      }
      return `${input}`;
    case "string":
      return JSON.stringify(input);
    case "object": {
      if (Array.isArray(input)) {
        return `[${input.map((value) => canonicalJson(value)).join(",")}]`;
      }
      const record = input as Record<string, unknown>;
      return `{${Object.keys(record)
        .sort(compareText)
        .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
        .join(",")}}`;
    }
    case "bigint":
    case "function":
    case "symbol":
    case "undefined":
      throw new Error(`Canonical JSON cannot encode ${typeof input}.`);
  }

  throw new Error("Canonical JSON received an unhandled value.");
}

function encodeUtf8(text: string): Uint8Array {
  const bytes: number[] = [];

  for (const character of text) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }

  return Uint8Array.from(bytes);
}

function decodeUtf8(
  bytes: Uint8Array
): { readonly ok: true; readonly text: string } | { readonly ok: false; readonly message: string } {
  const codePoints: number[] = [];
  let index = 0;

  while (index < bytes.length) {
    const first = bytes[index];
    if (first === undefined) {
      return { ok: false, message: "Save payload contains invalid UTF-8." };
    }

    if (first <= 0x7f) {
      codePoints.push(first);
      index += 1;
      continue;
    }

    if (first >= 0xc2 && first <= 0xdf) {
      const second = readContinuation(bytes, index + 1);
      if (second === undefined) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      codePoints.push(((first & 0x1f) << 6) | second);
      index += 2;
      continue;
    }

    if (first >= 0xe0 && first <= 0xef) {
      const second = readContinuation(bytes, index + 1);
      const third = readContinuation(bytes, index + 2);
      if (second === undefined || third === undefined) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      const codePoint = ((first & 0x0f) << 12) | (second << 6) | third;
      if (codePoint < 0x800 || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      codePoints.push(codePoint);
      index += 3;
      continue;
    }

    if (first >= 0xf0 && first <= 0xf4) {
      const second = readContinuation(bytes, index + 1);
      const third = readContinuation(bytes, index + 2);
      const fourth = readContinuation(bytes, index + 3);
      if (second === undefined || third === undefined || fourth === undefined) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      const codePoint = ((first & 0x07) << 18) | (second << 12) | (third << 6) | fourth;
      if (codePoint < 0x10000 || codePoint > 0x10ffff) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      codePoints.push(codePoint);
      index += 4;
      continue;
    }

    return { ok: false, message: "Save payload contains invalid UTF-8." };
  }

  return {
    ok: true,
    text: String.fromCodePoint(...codePoints)
  };
}

function readContinuation(bytes: Uint8Array, index: number): number | undefined {
  const value = bytes[index];
  if (value === undefined || value < 0x80 || value > 0xbf) {
    return undefined;
  }

  return value & 0x3f;
}

function hashText(text: string): number {
  let hash = FNV1A32_OFFSET;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, FNV1A32_PRIME) >>> 0;
  }

  return hash;
}

function fixedHex(value: number): string {
  return value.toString(16).padStart(8, "0");
}

function fallbackAdvanceCommand(): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.advance-day",
    commandId: "invalid.placeholder",
    actor: { kind: "system", id: "invalid" },
    expectedDay: 0,
    expectedRevision: 0
  };
}

function validateM7BoundaryEntries(
  entries: readonly M7SaveMigrationManifestBoundaryEntryV1[],
  path: string,
  expectedDecisionState: M7SaveMigrationDecisionStateV1,
  expectedMigrationMode: M7SaveMigrationModeV1,
  allowedMilestones: readonly M7SaveMigrationMilestoneV1[],
  issues: M7SaveMigrationBoundaryIssueV1[]
): void {
  entries.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!allowedMilestones.includes(entry.milestone)) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.milestone`,
          `${entryPath}.milestone must be one of ${allowedMilestones.join(", ")}.`
        )
      );
    }
    if (entry.decisionState !== expectedDecisionState) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.decisionState`,
          `${entryPath}.decisionState must be ${expectedDecisionState}.`
        )
      );
    }
    if (entry.envelopeSchemaVersion !== SAVE_ENVELOPE_V1_SCHEMA_VERSION) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.envelopeSchemaVersion`,
          `${entryPath}.envelopeSchemaVersion must be 1.`
        )
      );
    }
    if (entry.snapshotSchemaVersion !== 0) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.snapshotSchemaVersion`,
          `${entryPath}.snapshotSchemaVersion must be 0.`
        )
      );
    }
    if (entry.contentManifestHash.length === 0) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.contentManifestHash`,
          `${entryPath}.contentManifestHash must be non-empty.`
        )
      );
    }
    if (entry.scenarioId.length === 0) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.scenarioId`,
          `${entryPath}.scenarioId must be non-empty.`
        )
      );
    }
    if (entry.stateHash !== undefined && !/^[0-9a-f]{8}$/u.test(entry.stateHash)) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.stateHash`,
          `${entryPath}.stateHash must be an 8-character lowercase hex hash when present.`
        )
      );
    }
    if (entry.migrationMode !== expectedMigrationMode) {
      issues.push(
        boundaryIssue(
          "invalid-boundary",
          `${entryPath}.migrationMode`,
          `${entryPath}.migrationMode must be ${expectedMigrationMode}.`
        )
      );
    }
  });
}

function findM7SaveMigrationBoundaryEntry(
  entries: readonly M7SaveMigrationManifestBoundaryEntryV1[],
  contentManifestHash: string,
  scenarioId: string,
  stateHash: string | undefined,
  allowedMilestones: readonly M7SaveMigrationMilestoneV1[]
): M7SaveMigrationManifestBoundaryEntryV1 | undefined {
  return entries.find(
    (entry) =>
      allowedMilestones.includes(entry.milestone) &&
      entry.contentManifestHash === contentManifestHash &&
      entry.scenarioId === scenarioId &&
      (entry.stateHash === undefined || entry.stateHash === stateHash)
  );
}

function m7DecodeOptions(
  input: ValidateM7SaveMigrationCandidateV1Input
): DecodeSaveEnvelopeV1Options {
  let options: DecodeSaveEnvelopeV1Options = {};
  if (input.expectedContentManifestHash !== undefined) {
    options = {
      ...options,
      expectedContentManifestHash: input.expectedContentManifestHash
    };
  }
  if (input.expectedScenarioId !== undefined) {
    options = {
      ...options,
      expectedScenarioId: input.expectedScenarioId
    };
  }
  if (input.maxBytes !== undefined) {
    options = { ...options, maxBytes: input.maxBytes };
  }
  if (input.maxDepth !== undefined) {
    options = { ...options, maxDepth: input.maxDepth };
  }
  if (input.validateWorldSnapshot !== undefined) {
    options = {
      ...options,
      validateWorldSnapshot: input.validateWorldSnapshot
    };
  }
  return options;
}

function boundaryIssue(
  code: M7SaveMigrationBoundaryIssueCodeV1,
  path: string,
  message: string
): M7SaveMigrationBoundaryIssueV1 {
  return { code, path, message };
}

function reason(
  code: SaveLoadRejectionCodeV1,
  path: string,
  message: string
): SaveLoadRejectionReasonV1 {
  return { code, path, message };
}

function rejected(
  code: SaveLoadRejectionCodeV1,
  path: string,
  message: string
): DecodeSaveEnvelopeV1Result {
  return {
    status: "rejected",
    reasons: [reason(code, path, message)]
  };
}

function copyRecord(record: Record<string, unknown>): Record<string, unknown> {
  return copyJsonRecord(record);
}

function copyJsonRecord(record: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort(compareText)) {
    result[key] = copyJsonValue(record[key]);
  }
  return result;
}

function copyJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(copyJsonValue);
  }
  if (isRecord(value)) {
    return copyJsonRecord(value);
  }
  return value;
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

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonnegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

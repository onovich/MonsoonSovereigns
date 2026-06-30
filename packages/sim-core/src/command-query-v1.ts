import {
  SIMULATION_MESSAGE_PROTOCOL_VERSION,
  parseBootSimulationInputV1,
  parseGameCommandV1,
  parseGameQueryV1,
  type AuthoritativeGameCommandV1,
  type BootSimulationInputV1,
  type CommandActorV1,
  type GameQueryV1,
  type M3PostwarGovernanceMethodV1,
  type M4DeterminismReplayScriptV1,
  type M5PlayableLoopScriptV1,
  type M6AlphaStartToVictoryScriptV1,
  type SaveLoadCanaryScriptV1,
  type ProtocolErrorCodeV1,
  type SerializableProtocolErrorV1
} from "@monsoon/protocol";
import {
  createSaveEnvelopeV1,
  decodeSaveEnvelopeV1,
  encodeSaveEnvelopeV1,
  saveWorldStateV0DtoToCandidate,
  worldStateV0ToSaveDto,
  type DecodeSaveEnvelopeV1Options,
  type SaveBuildMetadataV1,
  type SaveEnvelopeV1,
  type SaveLoadRejectionReasonV1,
  type SaveSemanticIssueV1
} from "@monsoon/save-format";

import { advanceWorldByGameDay, getGameCalendarDate } from "./scheduler-v0.ts";
import { bootWorldStateFromRuntimeContentPackV1 } from "./boot-content-runtime-v1.ts";
import { previewM2TransportRouteV0 } from "./m2-route-transport-v0.ts";
import {
  listMapTopologyV1,
  previewMapTopologyPathV1,
  type MapTopologyPathPreviewV1,
  type MapTopologyReadModelV1
} from "./map-topology-v1.ts";
import { createM4DeterminismReplayWorldStateV0 } from "./m4-determinism-replay-v1.ts";
import {
  M1_ABSTRACT_GRAPH_30_CONTENT_MANIFEST_HASH,
  M1_ABSTRACT_GRAPH_30_SCENARIO_ID,
  createAbstractGraph30WorldStateV0,
  createMinimalM1WorldStateV0
} from "./minimal-m1-fixture.ts";
import {
  hashWorldStateV0,
  parseContentManifestHash,
  parseDistrictId,
  parseGameDay,
  parseCampaignMarchId,
  parseFieldEngagementId,
  parseM3AppointmentAuditEventId,
  parseM3FulfillmentId,
  parseM3OfficeId,
  parseM3ObligationAuditEventId,
  parseM3ObligationId,
  parseM3PolicyId,
  parseM3SuccessionId,
  parseM6DiplomaticAgreementId,
  parseM6DiplomaticRelationId,
  parseM6LegitimacySourceId,
  parseM6AlphaTerminalStateId,
  parseM6PolicyDefinitionId,
  parseM6PolicyEventDefinitionId,
  parseM6PolicyEventInstanceId,
  parseM6PolicyModifierId,
  parsePersonId,
  parsePopulationGroupId,
  parsePolityId,
  parseCampaignPlanId,
  parseGrainSupplyReservationId,
  parseMobilizedForceCommitmentId,
  parseSiegeId,
  parseWorldRevision,
  validateWorldStateV0,
  canonicalizeM2EconomyPopulationState,
  canonicalizeM3PolityVassalageState,
  canonicalizeM4CampaignStateV0,
  canonicalizeM6AlphaRuntimeStateV0,
  canonicalizeM6PolicyEventRuntimeStateV0,
  copyM4CampaignOwner,
  copyM4CampaignTarget,
  copyM4GrainSupplySource,
  copyM4MusterCommitmentSource,
  copyM4MusterLocalCostHook,
  createM4CampaignStateV0,
  createM6AlphaRuntimeStateV0,
  createM6DiplomacyLegitimacyStateV0,
  createM6PolicyEventRuntimeStateV0,
  computeM3AdministrativeBurdenProfileV0,
  type DistrictControlState,
  type CampaignPlanId,
  type DistrictId,
  type M3AdministrativeControlModeV0,
  type M3AdministrativeDistrictStateV0,
  type M3AdministrativeBurdenProfileV0,
  type M3AppointmentAuditEventKindV0,
  type M3AppointmentAuditEventId,
  type M3AppointmentAuditEventStateV0,
  type M3CharacterStateV0,
  type M3EnfeoffmentStateV0,
  type M3FulfillmentSourceMovementStateV0,
  type M3OfficeId,
  type M3OfficeStateV0,
  type M3ObligationAuditEventStateV0,
  type M3ObligationDueV0,
  type M3ObligationRequirementV0,
  type M3ObligationStateV0,
  type M3ObligationStatusV0,
  type M3PolicyStanceV0,
  type M3PolicyId,
  type M3PolicyStateV0,
  type M3PolicyTargetV0,
  type M3PolityRecordStateV0,
  type M3PolityVassalageStateV0,
  type M3SuccessionCandidateStateV0,
  type M3SuccessionCrisisStateV0,
  type M3SuccessionOutcomeV0,
  type M3SuccessionSupportSourceStateV0,
  type M4CampaignOwnerV0,
  type M4CampaignMarchRouteSegmentStateV0,
  type M4CampaignMarchStateV0,
  type M4CampaignMarchSupplyStatusV0,
  type M4CampaignMarchStatusV0,
  type M4CampaignPlanStateV0,
  type M4CampaignStateV0,
  type M4CampaignTargetV0,
  type M4FieldEngagementOutcomeV0,
  type M4FieldEngagementStateV0,
  type M4FactionKnowledgeSnapshotStateV0,
  type M4GrainSupplyReservationStateV0,
  type M4GrainSupplyReservationStatusV0,
  type M4KnownObjectiveEstimateV0,
  type M4MobilizedForceCommitmentStateV0,
  type M4MusterCommitmentStatusV0,
  type M4SiegeChoiceV0,
  type M4SiegeStateV0,
  type M4SiegeStatusV0,
  type M4PostwarCandidateStateV0,
  type M4WarOutcomeStateV0,
  type M4WithdrawalKindV0,
  type M4WithdrawalStateV0,
  type M4WithdrawalTriggerV0,
  type M6DiplomaticAgreementStateV0,
  type M6DiplomacyLegitimacyStateV0,
  type M6DiplomaticRelationStateV0,
  type M6LegitimacyAudienceV0,
  type M6LegitimacyProfileStateV0,
  type M6LegitimacySourceStateV0,
  type M6AlphaTerminalOutcomeV0,
  type M6AlphaTerminalStateV0,
  type M6PolicyEventRuntimeStateV0,
  type M6RecognitionEdgeStateV0,
  type M2EconomyPopulationStateV0,
  type GameDay,
  type M2LaborCommitmentPurposeV0,
  type M2RouteKindV0,
  type M2SeasonalMonthStateV0,
  type M2PopulationGroupStateV0,
  type PersonId,
  type PopulationGroupId,
  type PolityId,
  type RouteId,
  type WorldRevision,
  type WorldStateV0
} from "./world-state-v0.ts";

type GameCommandV1 = AuthoritativeGameCommandV1;

export type DomainErrorCodeV1 =
  | "acyclicity-violation"
  | "bad-id"
  | "authority-denied"
  | "bulk-command-rejected"
  | "campaign-objective-invalid"
  | "character-location-invalid"
  | "character-unavailable"
  | "diplomacy-cycle"
  | "diplomacy-state-invalid"
  | "duplicate-command"
  | "duplicate-fulfillment"
  | "engagement-state-invalid"
  | "grain-supply-invalid"
  | "hash-mismatch"
  | "alpha-terminal-state-invalid"
  | "insufficient-labor"
  | "invalid-content-pack"
  | "invalid-payload"
  | "invariant-violation"
  | "illegal-vassalage"
  | "m2-state-missing"
  | "m3-state-missing"
  | "march-state-invalid"
  | "muster-commitment-invalid"
  | "obligation-actor-invalid"
  | "obligation-due-period-invalid"
  | "obligation-resource-insufficient"
  | "obligation-settlement-invalid"
  | "obligation-state-invalid"
  | "office-eligibility-failed"
  | "office-primary-conflict"
  | "policy-event-state-invalid"
  | "succession-state-invalid"
  | "duplicate-obligation-settlement"
  | "stale-day"
  | "stale-revision"
  | "siege-state-invalid"
  | "topology-state-missing"
  | "unknown-command-kind"
  | "unknown-query-kind"
  | "unsupported-command-version"
  | "unsupported-query-version"
  | "withdrawal-state-invalid";

export interface DomainErrorV1 {
  readonly code: DomainErrorCodeV1;
  readonly path: string;
  readonly message: string;
}

export interface SimulationRuntimeV1 {
  readonly world: WorldStateV0;
  readonly acceptedCommandIds: readonly string[];
  readonly commandTail: readonly GameCommandV1[];
  readonly eventTail: readonly DomainEventV1[];
}

export type DomainEventV1 =
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.day-advanced";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly fromDay: number;
      readonly toDay: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.district-control-changed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly districtId: DistrictId;
      readonly previousControllerPolityId: PolityId | null;
      readonly nextControllerPolityId: PolityId | null;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.state-hash-verified";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly day: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.labor-committed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly populationGroupId: PopulationGroupId;
      readonly purpose: M2LaborCommitmentPurposeV0;
      readonly laborAmount: number;
      readonly releaseDay: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.polity-suzerain-changed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly polityId: PolityId;
      readonly previousSuzerainPolityId: PolityId | null;
      readonly nextSuzerainPolityId: PolityId | null;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.obligation-created";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly obligationId: number;
      readonly debtorPolityId: PolityId;
      readonly creditorPolityId: PolityId;
      readonly auditEventId: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.obligation-settled";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly obligationId: number;
      readonly fulfillmentId: number;
      readonly actionKind: Extract<
        GameCommandV1,
        { readonly kind: "sim.record-obligation-fulfillment" }
      >["payload"]["actionKind"];
      readonly dueDay: number;
      readonly resourceKind: "cash" | "grain" | "troops" | "condition";
      readonly fulfilledAmount: number;
      readonly statusAfter: M3ObligationStatusV0;
      readonly reasonCode: string;
      readonly auditEventId: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m3-appointment-audited";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly auditEventId: number;
      readonly eventKind: M3AppointmentAuditEventKindV0;
      readonly officeId: number | null;
      readonly characterId: number | null;
      readonly policyId: number | null;
      readonly districtId: number | null;
      readonly reasonCode: string;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m3-succession-updated";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly successionId: number;
      readonly polityId: PolityId;
      readonly status: "pending" | "resolved";
      readonly outcomeKind: "disputed" | "peaceful" | "regency" | null;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m3-postwar-governance-applied";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly settlementId: string;
      readonly method: M3PostwarGovernanceMethodV1;
      readonly victorPolityId: PolityId;
      readonly localPolityId: PolityId;
      readonly districtId: DistrictId;
      readonly obligationIds: readonly number[];
      readonly administrativeLoad: number;
      readonly reasonCodes: readonly string[];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.grain-supply-reserved";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly reservationId: number;
      readonly campaignPlanId: number;
      readonly reservedAmount: number;
      readonly sourceCount: number;
      readonly expectedDailyConsumption: number;
      readonly expectedDaysOfSupply: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.grain-supply-consumed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly reservationId: number;
      readonly campaignPlanId: number;
      readonly consumedAmount: number;
      readonly lossAmount: number;
      readonly shortageAmount: number;
      readonly carriedAmountAfter: number;
      readonly lossReasonCode: string | null;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.grain-supply-released";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly reservationId: number;
      readonly campaignPlanId: number;
      readonly releasedAmount: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m4-field-engagement-resolved";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly engagementId: number;
      readonly campaignPlanId: number;
      readonly marchId: number;
      readonly attackerPolityId: PolityId;
      readonly defenderPolityId: PolityId;
      readonly outcome: M4FieldEngagementOutcomeV0;
      readonly attackerCasualties: number;
      readonly defenderCasualties: number;
      readonly supplyLoss: number;
      readonly campaignStatusBefore: M4CampaignPlanStateV0["status"];
      readonly campaignStatusAfter: M4CampaignPlanStateV0["status"];
      readonly reasonCodes: readonly string[];
      readonly creditHooks: M4FieldEngagementStateV0["creditHooks"];
      readonly reputationHooks: M4FieldEngagementStateV0["reputationHooks"];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m4-siege-choice-applied";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly siegeId: number;
      readonly campaignPlanId: number;
      readonly marchId: number;
      readonly choice: M4SiegeChoiceV0;
      readonly statusBefore: M4SiegeStatusV0 | null;
      readonly statusAfter: M4SiegeStatusV0;
      readonly attackerCasualties: number;
      readonly defenderCasualties: number;
      readonly supplyLoss: number;
      readonly campaignStatusBefore: M4CampaignPlanStateV0["status"];
      readonly campaignStatusAfter: M4CampaignPlanStateV0["status"];
      readonly surrenderEligible: boolean;
      readonly reasonCodes: readonly string[];
      readonly creditHooks: M4SiegeStateV0["creditHooks"];
      readonly reputationHooks: M4SiegeStateV0["reputationHooks"];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m6-diplomatic-agreement-proposed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly relationId: number;
      readonly agreementId: number;
      readonly proposerPolityId: PolityId;
      readonly targetPolityId: PolityId;
      readonly agreementKind: M6DiplomaticAgreementStateV0["agreementKind"];
      readonly reasonCodes: readonly string[];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m6-diplomatic-agreement-answered";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly agreementId: number;
      readonly statusAfter: M6DiplomaticAgreementStateV0["status"];
      readonly recognitionCreated: boolean;
      readonly reasonCodes: readonly string[];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m6-legitimacy-source-recorded";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly sourceId: number;
      readonly polityId: PolityId;
      readonly audience: M6LegitimacyAudienceV0;
      readonly magnitudeBps: number;
      readonly scoreAfterBps: number;
      readonly reasonCodes: readonly string[];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m6-policy-event-option-chosen";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly eventInstanceId: number;
      readonly eventDefinitionId: number;
      readonly selectedOptionId: number;
      readonly causeReasonCodes: readonly string[];
      readonly optionReasonCodes: readonly string[];
      readonly consequenceReasonCodes: readonly string[];
      readonly encyclopediaRefs: readonly string[];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.m6-alpha-terminal-state-recorded";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly terminalStateId: number;
      readonly polityId: PolityId;
      readonly outcome: M6AlphaTerminalOutcomeV0;
      readonly reasonCodes: readonly string[];
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    };

export type StateDeltaV1 =
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.day-changed";
      readonly day: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.district-control-updated";
      readonly districtId: DistrictId;
      readonly control: DistrictControlState;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.hash-observed";
      readonly day: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m2-population-group-updated";
      readonly populationGroupId: PopulationGroupId;
      readonly availableLabor: number;
      readonly committedLabor: number;
      readonly grainStock: number;
      readonly cashStock: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-polity-updated";
      readonly polityId: PolityId;
      readonly directSuzerainPolityId: PolityId | null;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-obligation-updated";
      readonly obligationId: number;
      readonly status: M3ObligationStatusV0;
      readonly latestAuditEventId: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-office-updated";
      readonly officeId: number;
      readonly holderCharacterId: number | null;
      readonly policyId: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-policy-updated";
      readonly policyId: number;
      readonly stance: M3PolicyStanceV0;
      readonly intensityBps: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-enfeoffment-updated";
      readonly districtId: number;
      readonly holderCharacterId: number;
      readonly policyId: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-succession-updated";
      readonly successionId: number;
      readonly polityId: PolityId;
      readonly status: "pending" | "resolved";
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m6-diplomacy-updated";
      readonly relationId: number;
      readonly agreementId: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m6-legitimacy-updated";
      readonly polityId: PolityId;
      readonly audience: M6LegitimacyAudienceV0;
      readonly scoreBps: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m6-alpha-terminal-updated";
      readonly terminalStateId: number;
      readonly polityId: PolityId;
      readonly outcome: M6AlphaTerminalOutcomeV0;
      readonly revision: number;
      readonly stateHash: string;
    };

export type CommandPreviewV1 =
  | {
      readonly status: "accepted";
      readonly commandId: string;
      readonly wouldChangeState: boolean;
      readonly events: readonly DomainEventV1[];
      readonly deltas: readonly StateDeltaV1[];
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly commandId: string | null;
      readonly error: DomainErrorV1;
      readonly stateHash: string;
    };

export type CommandResultV1 =
  | {
      readonly status: "accepted";
      readonly commandId: string;
      readonly revisionBefore: WorldRevision;
      readonly revisionAfter: WorldRevision;
      readonly events: readonly DomainEventV1[];
      readonly deltas: readonly StateDeltaV1[];
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly commandId: string | null;
      readonly error: DomainErrorV1;
      readonly stateHash: string;
    };

export interface SubmitCommandOutputV1 {
  readonly runtime: SimulationRuntimeV1;
  readonly result: CommandResultV1;
}

export interface RequestSaveOutputV1 {
  readonly bytes: Uint8Array;
  readonly envelope: SaveEnvelopeV1;
  readonly stateHash: string;
  readonly byteLength: number;
}

export type LoadSaveOutputV1 =
  | {
      readonly status: "loaded";
      readonly runtime: SimulationRuntimeV1;
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly runtime: SimulationRuntimeV1;
      readonly reasons: readonly SaveLoadRejectionReasonV1[];
    };

export type BootSimulationResultV1 =
  | {
      readonly status: "booted";
      readonly runtime: SimulationRuntimeV1;
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly error: DomainErrorV1;
    };

export type QueryResultV1 =
  | {
      readonly status: "ok";
      readonly result:
        | {
            readonly kind: "sim.get-state-hash";
            readonly day: number;
            readonly revision: number;
            readonly stateHash: string;
          }
        | {
            readonly kind: "sim.get-calendar";
            readonly day: number;
            readonly revision: number;
          }
        | {
            readonly kind: "sim.list-district-summaries";
            readonly day: number;
            readonly revision: number;
            readonly districts: readonly DistrictSummaryReadModelV1[];
          }
        | {
            readonly kind: "sim.list-map-topology";
            readonly day: number;
            readonly revision: number;
            readonly topology: MapTopologyReadModelV1;
          }
        | {
            readonly kind: "sim.list-m2-economy-summaries";
            readonly day: number;
            readonly revision: number;
            readonly districts: readonly M2EconomyDistrictSummaryReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m3-administrative-burden";
            readonly day: number;
            readonly revision: number;
            readonly districts: readonly M3AdministrativeBurdenDistrictReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m3-decision-scaffolds";
            readonly day: number;
            readonly revision: number;
            readonly offices: readonly M3DecisionOfficeScaffoldReadModelV1[];
            readonly policies: readonly M3DecisionPolicyScaffoldReadModelV1[];
            readonly enfeoffments: readonly M3DecisionEnfeoffmentScaffoldReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m3-succession-crises";
            readonly day: number;
            readonly revision: number;
            readonly crises: readonly M3SuccessionCrisisReadModelV1[];
          }
        | {
            readonly kind: "sim.preview-m2-transport-route";
            readonly day: number;
            readonly revision: number;
            readonly monthOfYear: number;
            readonly route: M2TransportRoutePreviewReadModelV1;
          }
        | {
            readonly kind: "sim.preview-map-topology-path";
            readonly day: number;
            readonly revision: number;
            readonly monthOfYear: number;
            readonly route: MapTopologyPathPreviewV1;
          }
        | {
            readonly kind: "sim.preview-m3-postwar-governance";
            readonly day: number;
            readonly revision: number;
            readonly months: number;
            readonly arrangements: readonly M3PostwarGovernancePreviewReadModelV1[];
          }
        | {
            readonly kind: "sim.compare-m3-postwar-governance-outcomes";
            readonly day: number;
            readonly revision: number;
            readonly months: number;
            readonly outcomes: readonly M3PostwarGovernanceOutcomeReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m4-campaign-plans";
            readonly day: number;
            readonly revision: number;
            readonly plans: readonly M4CampaignPlanReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m4-faction-knowledge";
            readonly day: number;
            readonly revision: number;
            readonly observerPolityId: number;
            readonly snapshots: readonly M4FactionKnowledgeSnapshotReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m4-muster-commitments";
            readonly day: number;
            readonly revision: number;
            readonly campaignPlanId: number;
            readonly commitments: readonly M4MusterCommitmentReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
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
            readonly sourceForecasts: readonly M4GrainSupplySourceForecastReadModelV1[];
            readonly reservations: readonly M4GrainSupplyReservationReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.preview-m4-route-transport-capacity";
            readonly day: number;
            readonly revision: number;
            readonly campaignPlanId: number;
            readonly targetDistrictId: DistrictId;
            readonly plannedTroops: number;
            readonly carriedSupplyAvailable: number;
            readonly carriedSupplyLimit: number;
            readonly bottleneckCapacity: number;
            readonly sourceForecasts: readonly M4RouteTransportSourceForecastReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.list-m4-march-state";
            readonly day: number;
            readonly revision: number;
            readonly campaignPlanId: number;
            readonly marches: readonly M4CampaignMarchReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.list-m4-siege-state";
            readonly day: number;
            readonly revision: number;
            readonly campaignPlanId: number;
            readonly sieges: readonly M4SiegeReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.list-m4-withdrawal-state";
            readonly day: number;
            readonly revision: number;
            readonly campaignPlanId: number;
            readonly withdrawals: readonly M4WithdrawalReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.list-m4-war-outcomes";
            readonly day: number;
            readonly revision: number;
            readonly campaignPlanId: number;
            readonly outcomes: readonly M4WarOutcomeReadModelV1[];
            readonly postwarCandidates: readonly M4PostwarCandidateReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.list-m6-diplomacy";
            readonly day: number;
            readonly revision: number;
            readonly observerPolityId: number;
            readonly relations: readonly M6DiplomaticRelationReadModelV1[];
            readonly agreements: readonly M6DiplomaticAgreementReadModelV1[];
            readonly recognitionEdges: readonly M6RecognitionEdgeReadModelV1[];
            readonly reasonCodes: readonly string[];
          }
        | {
            readonly kind: "sim.list-m6-recognized-order";
            readonly day: number;
            readonly revision: number;
            readonly polityId: number;
            readonly decisions: readonly M6RecognizedOrderReadModelV1[];
          }
        | {
            readonly kind: "sim.get-m6-alpha-terminal-state";
            readonly day: number;
            readonly revision: number;
            readonly polityId: number;
            readonly terminalState: M6AlphaTerminalReadModelV1;
          };
    }
  | {
      readonly status: "rejected";
      readonly error: DomainErrorV1;
    };

export interface DistrictSummaryReadModelV1 {
  readonly districtId: DistrictId;
  readonly displayNameKey: string;
  readonly control: DistrictControlState;
}

export interface M2EconomyDistrictSummaryReadModelV1 {
  readonly districtId: DistrictId;
  readonly population: number;
  readonly availableLabor: number;
  readonly committedLabor: number;
  readonly grainStock: number;
  readonly cashStock: number;
  readonly agriculturePhase: string;
  readonly lastHarvestGrain: number;
  readonly cumulativeMobilizationCost: number;
}

export type M3AdministrativeBurdenDistrictReadModelV1 = M3AdministrativeBurdenProfileV0;

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

export interface M3SuccessionSupportSourceReadModelV1 {
  readonly kind:
    | "kinship"
    | "designation"
    | "court"
    | "military"
    | "provincial"
    | "suzerain"
    | "foreign";
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

export interface M6DiplomaticRelationReadModelV1 {
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
  readonly reasonCodes: readonly string[];
}

export interface M6DiplomaticAgreementReadModelV1 {
  readonly agreementId: number;
  readonly relationId: number;
  readonly proposerPolityId: number;
  readonly targetPolityId: number;
  readonly agreementKind: M6DiplomaticAgreementStateV0["agreementKind"];
  readonly status: M6DiplomaticAgreementStateV0["status"];
  readonly startDay: number;
  readonly endDay: number;
  readonly recognitionDirection: M6DiplomaticAgreementStateV0["recognitionDirection"];
  readonly reasonCodes: readonly string[];
}

export interface M6RecognitionEdgeReadModelV1 {
  readonly fromPolityId: number;
  readonly toPolityId: number;
  readonly agreementId: number;
  readonly reasonCode: string;
}

export interface M6RecognizedOrderReadModelV1 {
  readonly polityId: number;
  readonly recognizedByCount: number;
  readonly legitimacyScoreBps: number;
  readonly activeObligationCount: number;
  readonly pendingSuccessionCount: number;
  readonly postwarCandidateCount: number;
  readonly canPursueVictory: boolean;
  readonly reasonCodes: readonly string[];
}

export interface M6AlphaTerminalEvidenceReadModelV1 {
  readonly recognizedByCount: number;
  readonly legitimacyScoreBps: number;
  readonly postwarArrangementCount: number;
  readonly resolvedPolicyEventCount: number;
  readonly successionResolvedCount: number;
  readonly routeCount: number;
  readonly populationGroupCount: number;
}

export interface M6AlphaTerminalReadModelV1 {
  readonly schemaVersion: 1;
  readonly terminalStateId: number;
  readonly polityId: number;
  readonly outcome: M6AlphaTerminalOutcomeV0;
  readonly evaluatedDay: number;
  readonly evaluatedRevision: number;
  readonly maxDay: number;
  readonly evidence: M6AlphaTerminalEvidenceReadModelV1;
  readonly reasonCodes: readonly string[];
}

export type M2TransportRoutePreviewReadModelV1 =
  | {
      readonly status: "unreachable";
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly edges: readonly [];
    }
  | {
      readonly status: "capacity-exceeded" | "reachable";
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly totalCost: number;
      readonly bottleneckCapacity: number;
      readonly edges: readonly M2TransportRoutePreviewEdgeReadModelV1[];
    };

export interface M2TransportRoutePreviewEdgeReadModelV1 {
  readonly routeId: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly routeKind: M2RouteKindV0;
  readonly baseTravelCost: number;
  readonly seasonalCost: number;
  readonly baseCapacity: number;
  readonly seasonalCapacity: number;
  readonly stockAmount: number;
  readonly remainingCapacityAfterStock: number;
}

export interface M3PostwarGovernanceObligationShapeReadModelV1 {
  readonly periodDays: number;
  readonly tributeCash: number;
  readonly troopHeadcount: number;
  readonly hasDirectGarrison: boolean;
}

export interface M3PostwarGovernancePreviewReadModelV1 {
  readonly method: M3PostwarGovernanceMethodV1;
  readonly districtId: DistrictId;
  readonly victorPolityId: PolityId;
  readonly localPolityId: PolityId;
  readonly administrativeBurden: M3AdministrativeBurdenProfileV0;
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

export interface M4CampaignForecastReadModelV1 {
  readonly status: "ready" | "blocked" | "cancelled" | "completed";
  readonly earliestStartDay: number;
  readonly latestStartDay: number;
  readonly reasonCodes: readonly string[];
}

export interface M4CampaignPlanReadModelV1 {
  readonly campaignPlanId: number;
  readonly owner: M4CampaignOwnerV0;
  readonly target: M4CampaignTargetV0;
  readonly objectiveKind: M4CampaignPlanStateV0["objectiveKind"];
  readonly status: M4CampaignPlanStateV0["status"];
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly forecast: M4CampaignForecastReadModelV1;
}

export interface M4FactionKnowledgeSnapshotReadModelV1 {
  readonly snapshotId: number;
  readonly observerPolityId: number;
  readonly subjectPolityId: number;
  readonly knowledgeVersion: number;
  readonly recordedDay: number;
  readonly source: M4FactionKnowledgeSnapshotStateV0["source"];
  readonly knownObjectives: readonly M4KnownObjectiveEstimateV0[];
  readonly routeEstimates: M4FactionKnowledgeSnapshotStateV0["routeEstimates"];
  readonly supplyEstimates: M4FactionKnowledgeSnapshotStateV0["supplyEstimates"];
  readonly defenderEstimates: M4FactionKnowledgeSnapshotStateV0["defenderEstimates"];
  readonly reasonCodes: readonly string[];
}

export interface M4MusterCommitmentReadModelV1 {
  readonly commitmentId: number;
  readonly campaignPlanId: number;
  readonly source: M4MobilizedForceCommitmentStateV0["source"];
  readonly promisedTroops: number;
  readonly dueDay: number;
  readonly assemblyWindow: M4MobilizedForceCommitmentStateV0["assemblyWindow"];
  readonly plannedAssemblyDay: number;
  readonly assembledTroops: number;
  readonly delayedTroops: number;
  readonly refusedTroops: number;
  readonly releasedTroops: number;
  readonly status: M4MusterCommitmentStatusV0;
  readonly statusReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly localCostHooks: M4MobilizedForceCommitmentStateV0["localCostHooks"];
}

export interface M4GrainSupplySourceForecastReadModelV1 {
  readonly source: M4GrainSupplyReservationStateV0["source"];
  readonly availableAmount: number;
}

export interface M4GrainSupplyReservationReadModelV1 {
  readonly reservationId: number;
  readonly campaignPlanId: number;
  readonly source: M4GrainSupplyReservationStateV0["source"];
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

export interface M4RouteTransportTravelWindowReadModelV1 {
  readonly earliestDepartureDay: GameDay;
  readonly latestDepartureDay: GameDay;
  readonly earliestArrivalDay: number;
  readonly latestArrivalDay: number;
  readonly travelDays: number;
}

export interface M4RouteTransportSourceForecastReadModelV1 {
  readonly reservationId: number;
  readonly source: M4GrainSupplyReservationStateV0["source"];
  readonly originDistrictId: DistrictId;
  readonly destinationDistrictId: DistrictId;
  readonly status: "capacity-exceeded" | "reachable" | "unreachable";
  readonly carriedSupplyAmount: number;
  readonly carriedSupplyLimit: number;
  readonly bottleneckCapacity: number;
  readonly travelWindow: M4RouteTransportTravelWindowReadModelV1;
  readonly routeSegments: readonly M2TransportRoutePreviewEdgeReadModelV1[];
  readonly overloadedReasonCode: string | null;
  readonly seasonRiskReasonCodes: readonly string[];
}

export interface M4CampaignMarchSupplyReadModelV1 {
  readonly status: M4CampaignMarchSupplyStatusV0;
  readonly carriedGrain: number;
  readonly consumedGrain: number;
  readonly shortageGrain: number;
  readonly delayedDays: number;
}

export interface M4CampaignArrivalWindowReadModelV1 {
  readonly earliestDay: number;
  readonly latestDay: number;
}

export interface M4CampaignMarchJoinedCommitmentTroopsReadModelV1 {
  readonly commitmentId: number;
  readonly joinedTroops: number;
}

export interface M4CampaignMarchReadModelV1 {
  readonly marchId: number;
  readonly campaignPlanId: number;
  readonly originDistrictId: DistrictId;
  readonly targetDistrictId: DistrictId;
  readonly currentDistrictId: DistrictId;
  readonly currentSegmentIndex: number;
  readonly progressOnSegmentDays: number;
  readonly activeTroops: number;
  readonly grainPerTroopPerDay: number;
  readonly supply: M4CampaignMarchSupplyReadModelV1;
  readonly status: M4CampaignMarchStatusV0;
  readonly statusReasonCode: string;
  readonly predictedArrivalWindow: M4CampaignArrivalWindowReadModelV1;
  readonly actualArrivalDay: number | null;
  readonly joinedCommitmentIds: readonly number[];
  readonly joinedCommitmentTroops: readonly M4CampaignMarchJoinedCommitmentTroopsReadModelV1[];
  readonly failedCommitmentIds: readonly number[];
  readonly reasonCodes: readonly string[];
}

export interface M4CampaignHookReadModelV1 {
  readonly polityId: number;
  readonly amount: number;
  readonly reasonCode: string;
}

export interface M4SiegeReadModelV1 {
  readonly siegeId: number;
  readonly campaignPlanId: number;
  readonly marchId: number;
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
  readonly creditHooks: readonly M4CampaignHookReadModelV1[];
  readonly reputationHooks: readonly M4CampaignHookReadModelV1[];
  readonly startedDay: number;
  readonly updatedDay: number;
}

export interface M4WithdrawalReadModelV1 {
  readonly withdrawalId: number;
  readonly campaignPlanId: number;
  readonly marchId: number | null;
  readonly siegeId: number | null;
  readonly kind: M4WithdrawalKindV0;
  readonly triggerReason: M4WithdrawalTriggerV0;
  readonly troopsBefore: number;
  readonly troopsExtracted: number;
  readonly casualties: number;
  readonly supplyLoss: number;
  readonly creditHooks: readonly M4CampaignHookReadModelV1[];
  readonly reputationHooks: readonly M4CampaignHookReadModelV1[];
  readonly reasonCodes: readonly string[];
  readonly resolvedDay: number;
}

export type M4PostwarCandidateReadModelV1 = M4PostwarCandidateStateV0;
export type M4WarOutcomeReadModelV1 = M4WarOutcomeStateV0;

interface CommandEvaluationV1 {
  readonly command: GameCommandV1;
  readonly nextWorld: WorldStateV0;
  readonly events: readonly DomainEventV1[];
  readonly deltas: readonly StateDeltaV1[];
  readonly wouldChangeState: boolean;
}

export interface CommandQueryCanaryResultV1 {
  readonly status: "ok";
  readonly finalHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
}

export interface SaveLoadCanaryResultV1 {
  readonly status: "ok";
  readonly finalHash: string;
  readonly loadedHash: string;
  readonly replayedHash: string;
  readonly saveByteLength: number;
}

export interface M4DeterminismReplayResultV1 {
  readonly status: "ok";
  readonly finalHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
  readonly engagementHash: string;
  readonly siegeHash: string;
  readonly withdrawalHash: string;
  readonly postwarCandidateCount: number;
  readonly campaignPlanStatus: M4CampaignPlanStateV0["status"];
  readonly campaignPlanStatusReasonCode: string | null;
}

export interface M5PlayableLoopResultV1 {
  readonly status: "ok";
  readonly outcome: "success";
  readonly finalHash: string;
  readonly loadedHash: string;
  readonly verifiedHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
  readonly saveByteLength: number;
  readonly commandCount: number;
  readonly postwarCandidateCount: number;
  readonly postwarArrangementCount: number;
  readonly failure: {
    readonly status: "rejected";
    readonly code: DomainErrorCodeV1;
    readonly path: string;
    readonly stateHashUnchanged: boolean;
  };
}

export interface M6AlphaStartToVictoryLoopResultV1 {
  readonly status: "ok";
  readonly terminalOutcome: M6AlphaTerminalOutcomeV0;
  readonly terminalSchemaVersion: 1;
  readonly finalHash: string;
  readonly loadedHash: string;
  readonly verifiedHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
  readonly saveByteLength: number;
  readonly commandCount: number;
  readonly midRunLoadedHashMatches: boolean;
  readonly malformedCommandRejected: boolean;
  readonly malformedCommandStateHashUnchanged: boolean;
  readonly noP0P1DataCorruption: boolean;
  readonly evidence: M6AlphaTerminalEvidenceReadModelV1;
}

export function bootSimulationV1(input: unknown): BootSimulationResultV1 {
  const parsed = parseBootSimulationInputV1(input);
  if (!parsed.ok) {
    return { status: "rejected", error: fromProtocolError(parsed.error) };
  }

  return bootParsedSimulationV1(parsed.value);
}

export function previewCommandV1(runtime: SimulationRuntimeV1, input: unknown): CommandPreviewV1 {
  const evaluated = validateAndEvaluateCommand(runtime, input);
  if (!evaluated.ok) {
    return {
      status: "rejected",
      commandId: readCommandId(input),
      error: evaluated.error,
      stateHash: runtime.world.meta.stateHash
    };
  }

  return {
    status: "accepted",
    commandId: evaluated.value.command.commandId,
    wouldChangeState: evaluated.value.wouldChangeState,
    events: evaluated.value.events,
    deltas: evaluated.value.deltas,
    stateHash: evaluated.value.nextWorld.meta.stateHash
  };
}

export function submitCommandV1(
  runtime: SimulationRuntimeV1,
  input: unknown
): SubmitCommandOutputV1 {
  const evaluated = validateAndEvaluateCommand(runtime, input);
  if (!evaluated.ok) {
    return {
      runtime,
      result: {
        status: "rejected",
        commandId: readCommandId(input),
        error: evaluated.error,
        stateHash: runtime.world.meta.stateHash
      }
    };
  }

  const nextRuntime: SimulationRuntimeV1 = {
    world: evaluated.value.nextWorld,
    acceptedCommandIds: appendAcceptedCommandId(
      runtime.acceptedCommandIds,
      evaluated.value.command.commandId
    ),
    commandTail: appendTail(runtime.commandTail, evaluated.value.command),
    eventTail: appendTail(runtime.eventTail, ...evaluated.value.events)
  };

  return {
    runtime: nextRuntime,
    result: {
      status: "accepted",
      commandId: evaluated.value.command.commandId,
      revisionBefore: runtime.world.meta.revision,
      revisionAfter: nextRuntime.world.meta.revision,
      events: evaluated.value.events,
      deltas: evaluated.value.deltas,
      stateHash: nextRuntime.world.meta.stateHash
    }
  };
}

export function querySimulationV1(runtime: SimulationRuntimeV1, input: unknown): QueryResultV1 {
  const parsed = parseGameQueryV1(input);
  if (!parsed.ok) {
    return { status: "rejected", error: fromProtocolError(parsed.error) };
  }

  return executeQuery(runtime, parsed.value);
}

export function runCommandQueryCanaryV1(input: unknown): CommandQueryCanaryResultV1 {
  if (!isRecord(input)) {
    throw new Error("Command/query canary script must be an object.");
  }

  const boot = bootSimulationV1(input["boot"]);
  if (boot.status !== "booted") {
    throw new Error(`Command/query canary boot rejected: ${boot.error.code}.`);
  }

  const commands = input["commands"];
  if (!Array.isArray(commands)) {
    throw new Error("Command/query canary commands must be an array.");
  }

  let runtime = boot.runtime;
  for (const command of commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`Command/query canary command rejected: ${submitted.result.error.code}.`);
    }

    runtime = submitted.runtime;
  }

  return {
    status: "ok",
    finalHash: runtime.world.meta.stateHash,
    finalDay: runtime.world.meta.currentDay,
    finalRevision: runtime.world.meta.revision
  };
}

export function requestSaveV1(
  runtime: SimulationRuntimeV1,
  build: SaveBuildMetadataV1
): RequestSaveOutputV1 {
  const envelope = createSaveEnvelopeV1({
    build,
    scenarioId: scenarioIdForRuntime(runtime),
    authoritativeSnapshot: worldStateV0ToSaveDto(runtime.world),
    scheduler: runtime.world.scheduler,
    rng: {
      schemaVersion: 1,
      algorithm: "sfc32-fnv1a32-domain-v1",
      savedStreams: []
    },
    commandTail: runtime.commandTail.map((command, index) => ({
      sequence: index + 1,
      command
    })),
    eventTail: runtime.eventTail.map((event, index) => ({
      sequence: index + 1,
      event: domainEventToRecord(event)
    }))
  });
  const bytes = encodeSaveEnvelopeV1(envelope);

  return {
    bytes,
    envelope,
    stateHash: runtime.world.meta.stateHash,
    byteLength: bytes.byteLength
  };
}

export function loadSaveV1(
  runtime: SimulationRuntimeV1,
  bytes: Uint8Array,
  options: Pick<
    DecodeSaveEnvelopeV1Options,
    "expectedContentManifestHash" | "expectedScenarioId" | "maxBytes" | "maxDepth"
  > = {}
): LoadSaveOutputV1 {
  const decoded = decodeSaveEnvelopeV1(bytes, {
    ...options,
    validateWorldSnapshot: (candidate) => {
      const topologyIssue = validateSaveTopologyCompatibility(runtime.world, candidate);
      if (topologyIssue !== null) {
        return [topologyIssue];
      }
      if (runtime.world.state.m2 !== undefined && !hasM2RuntimeState(candidate)) {
        return [
          {
            path: "state.m2",
            message: "Save snapshot is missing required M2 runtime state for this runtime."
          }
        ];
      }
      if (runtime.world.state.m3 !== undefined && !hasM3RuntimeState(candidate)) {
        return [
          {
            path: "state.m3",
            message: "Save snapshot is missing required M3 runtime state for this runtime."
          }
        ];
      }
      if (runtime.world.state.m4 !== undefined && !hasM4RuntimeState(candidate)) {
        return [
          {
            path: "state.m4",
            message: "Save snapshot is missing required M4 runtime state for this runtime."
          }
        ];
      }
      if (runtime.world.state.m6 !== undefined && !hasM6RuntimeState(candidate)) {
        return [
          {
            path: "state.m6",
            message: "Save snapshot is missing required M6 runtime state for this runtime."
          }
        ];
      }
      if (
        runtime.world.state.m6PolicyEvents !== undefined &&
        !hasM6PolicyEventRuntimeState(candidate)
      ) {
        return [
          {
            path: "state.m6PolicyEvents",
            message:
              "Save snapshot is missing required M6 policy/event runtime state for this runtime."
          }
        ];
      }
      if (runtime.world.state.m6Alpha !== undefined && !hasM6AlphaRuntimeState(candidate)) {
        return [
          {
            path: "state.m6Alpha",
            message: "Save snapshot is missing required M6 Alpha runtime state for this runtime."
          }
        ];
      }

      return validateWorldStateV0(candidate);
    }
  });
  if (decoded.status === "rejected") {
    return {
      status: "rejected",
      runtime,
      reasons: decoded.reasons
    };
  }

  const candidate = saveWorldStateV0DtoToCandidate(
    decoded.envelope.body.authoritativeSnapshot,
    decoded.envelope.body.scheduler
  );
  const invariantErrors = validateWorldStateV0(candidate);
  if (invariantErrors.length > 0) {
    return {
      status: "rejected",
      runtime,
      reasons: invariantErrors.map((error) => ({
        code: "semantic-invariant",
        path: error.path,
        message: error.message
      }))
    };
  }

  const loadedWorld = candidate as WorldStateV0;
  const eventTail = parseSavedEventTail(decoded.envelope.body.eventTail);
  if (!eventTail.ok) {
    return {
      status: "rejected",
      runtime,
      reasons: eventTail.reasons
    };
  }

  const loadedRuntime: SimulationRuntimeV1 = {
    world: loadedWorld,
    acceptedCommandIds: decoded.envelope.body.commandTail.map((entry) => entry.command.commandId),
    commandTail: decoded.envelope.body.commandTail.map((entry) => entry.command),
    eventTail: eventTail.value
  };

  return {
    status: "loaded",
    runtime: loadedRuntime,
    stateHash: loadedWorld.meta.stateHash
  };
}

export function runSaveLoadCanaryV1(input: SaveLoadCanaryScriptV1): SaveLoadCanaryResultV1 {
  const boot = bootSimulationV1(input.boot);
  if (boot.status !== "booted") {
    throw new Error(`Save/load canary boot rejected: ${boot.error.code}.`);
  }

  let runtime = boot.runtime;
  for (const command of input.commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`Save/load canary command rejected: ${submitted.result.error.code}.`);
    }
    runtime = submitted.runtime;
  }

  const saved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const loaded = loadSaveV1(boot.runtime, saved.bytes, {
    expectedContentManifestHash: input.expectedContentManifestHash,
    expectedScenarioId: input.expectedScenarioId
  });
  if (loaded.status !== "loaded") {
    throw new Error(`Save/load canary load rejected: ${loaded.reasons[0]?.code ?? "unknown"}.`);
  }

  const verify = submitCommandV1(loaded.runtime, {
    schemaVersion: 1,
    kind: "sim.verify-state-hash",
    commandId: "save.canary.verify.loaded",
    actor: { kind: "system", id: "save-canary" },
    expectedDay: loaded.runtime.world.meta.currentDay,
    expectedRevision: loaded.runtime.world.meta.revision,
    expectedHash: loaded.runtime.world.meta.stateHash
  });
  if (verify.result.status !== "accepted") {
    throw new Error(`Save/load canary verify rejected: ${verify.result.error.code}.`);
  }

  return {
    status: "ok",
    finalHash: runtime.world.meta.stateHash,
    loadedHash: loaded.runtime.world.meta.stateHash,
    replayedHash: verify.runtime.world.meta.stateHash,
    saveByteLength: saved.byteLength
  };
}

export function runM4DeterminismReplayV1(
  input: M4DeterminismReplayScriptV1
): M4DeterminismReplayResultV1 {
  const boot = bootSimulationV1(input.boot);
  if (boot.status !== "booted") {
    throw new Error(`M4 determinism replay boot rejected: ${boot.error.code}.`);
  }

  let runtime = boot.runtime;
  let engagementHash = runtime.world.meta.stateHash;
  let siegeHash = runtime.world.meta.stateHash;
  let withdrawalHash = runtime.world.meta.stateHash;

  for (const command of input.commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`M4 determinism replay command rejected: ${submitted.result.error.code}.`);
    }

    runtime = submitted.runtime;
    if (command.kind === "sim.resolve-m4-field-engagement") {
      engagementHash = runtime.world.meta.stateHash;
    } else if (
      command.kind === "sim.apply-m4-siege-choice" &&
      command.payload.choice === "accept-surrender"
    ) {
      siegeHash = runtime.world.meta.stateHash;
    } else if (command.kind === "sim.resolve-m4-campaign-withdrawal") {
      withdrawalHash = runtime.world.meta.stateHash;
    }
  }

  const campaignPlan = runtime.world.state.m4?.campaignPlans.find((plan) => plan.id === 10);
  if (campaignPlan === undefined) {
    throw new Error("M4 determinism replay did not create the campaign plan.");
  }

  const m4 = runtime.world.state.m4;
  if (m4 === undefined || m4.postwarCandidates.length === 0) {
    throw new Error("M4 determinism replay did not create a postwar candidate.");
  }

  return {
    status: "ok",
    finalHash: runtime.world.meta.stateHash,
    finalDay: runtime.world.meta.currentDay,
    finalRevision: runtime.world.meta.revision,
    engagementHash,
    siegeHash,
    withdrawalHash,
    postwarCandidateCount: m4.postwarCandidates.length,
    campaignPlanStatus: campaignPlan.status,
    campaignPlanStatusReasonCode: campaignPlan.statusReasonCode
  };
}

export function runM5PlayableLoopV1(input: M5PlayableLoopScriptV1): M5PlayableLoopResultV1 {
  const boot = bootSimulationV1(input.boot);
  if (boot.status !== "booted") {
    throw new Error(`M5 playable loop boot rejected: ${boot.error.code}.`);
  }

  let runtime = boot.runtime;
  for (const command of input.successCommands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`M5 playable loop command rejected: ${submitted.result.error.code}.`);
    }

    runtime = submitted.runtime;
  }

  const saved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const loaded = loadSaveV1(boot.runtime, saved.bytes, {
    expectedContentManifestHash: runtime.world.meta.contentManifestHash,
    expectedScenarioId: scenarioIdForRuntime(runtime)
  });
  if (loaded.status !== "loaded") {
    throw new Error(`M5 playable loop load rejected: ${loaded.reasons[0]?.code ?? "unknown"}.`);
  }

  const hashBeforeFailure = loaded.runtime.world.meta.stateHash;
  const duplicate = submitCommandV1(loaded.runtime, input.duplicatePostwarCommand);
  if (duplicate.result.status !== "rejected") {
    throw new Error("M5 playable loop duplicate postwar command was not rejected.");
  }

  const verify = submitCommandV1(loaded.runtime, {
    schemaVersion: 1,
    kind: "sim.verify-state-hash",
    commandId: "m5.slice.verify-loaded-hash",
    actor: { kind: "system", id: "m5-playable-loop" },
    expectedDay: loaded.runtime.world.meta.currentDay,
    expectedRevision: loaded.runtime.world.meta.revision,
    expectedHash: loaded.runtime.world.meta.stateHash
  });
  if (verify.result.status !== "accepted") {
    throw new Error(`M5 playable loop verify rejected: ${verify.result.error.code}.`);
  }

  return {
    status: "ok",
    outcome: "success",
    finalHash: runtime.world.meta.stateHash,
    loadedHash: loaded.runtime.world.meta.stateHash,
    verifiedHash: verify.runtime.world.meta.stateHash,
    finalDay: runtime.world.meta.currentDay,
    finalRevision: runtime.world.meta.revision,
    saveByteLength: saved.byteLength,
    commandCount: input.successCommands.length,
    postwarCandidateCount: runtime.world.state.m4?.postwarCandidates.length ?? 0,
    postwarArrangementCount: runtime.eventTail.filter(
      (event) => event.kind === "sim.m3-postwar-governance-applied"
    ).length,
    failure: {
      status: "rejected",
      code: duplicate.result.error.code,
      path: duplicate.result.error.path,
      stateHashUnchanged: duplicate.runtime.world.meta.stateHash === hashBeforeFailure
    }
  };
}

export function runM6AlphaStartToVictoryLoopV1(
  input: M6AlphaStartToVictoryScriptV1
): M6AlphaStartToVictoryLoopResultV1 {
  const boot = bootSimulationV1(input.boot);
  if (boot.status !== "booted") {
    throw new Error(`M6 Alpha loop boot rejected: ${boot.error.code}.`);
  }

  let runtime = boot.runtime;
  for (const command of input.commandsBeforeMidRunSave) {
    runtime = submitRequiredM6AlphaCommand(runtime, command, "before mid-run save");
  }

  const midRunSaved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const midRunLoaded = loadSaveV1(boot.runtime, midRunSaved.bytes, {
    expectedContentManifestHash: runtime.world.meta.contentManifestHash,
    expectedScenarioId: scenarioIdForRuntime(runtime)
  });
  if (midRunLoaded.status !== "loaded") {
    throw new Error(
      `M6 Alpha mid-run load rejected: ${midRunLoaded.reasons[0]?.code ?? "unknown"}.`
    );
  }
  const midRunLoadedHashMatches =
    midRunLoaded.runtime.world.meta.stateHash === runtime.world.meta.stateHash;
  runtime = midRunLoaded.runtime;

  const malformedHashBefore = runtime.world.meta.stateHash;
  const malformed = submitCommandV1(runtime, input.malformedTerminalCommand);

  for (const command of input.commandsAfterMidRunSave) {
    runtime = submitRequiredM6AlphaCommand(runtime, command, "after mid-run save");
  }
  runtime = submitRequiredM6AlphaCommand(runtime, input.victoryTerminalCommand, "terminal");

  const finalSaved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const finalLoaded = loadSaveV1(boot.runtime, finalSaved.bytes, {
    expectedContentManifestHash: runtime.world.meta.contentManifestHash,
    expectedScenarioId: scenarioIdForRuntime(runtime)
  });
  if (finalLoaded.status !== "loaded") {
    throw new Error(`M6 Alpha final load rejected: ${finalLoaded.reasons[0]?.code ?? "unknown"}.`);
  }
  const terminal = latestM6AlphaTerminalState(finalLoaded.runtime, 1);
  const verify = submitCommandV1(finalLoaded.runtime, {
    schemaVersion: 1,
    kind: "sim.verify-state-hash",
    commandId: "m6.alpha.verify-loaded-hash",
    actor: { kind: "system", id: "m6-alpha-loop" },
    expectedDay: finalLoaded.runtime.world.meta.currentDay,
    expectedRevision: finalLoaded.runtime.world.meta.revision,
    expectedHash: finalLoaded.runtime.world.meta.stateHash
  });
  if (verify.result.status !== "accepted") {
    throw new Error(`M6 Alpha verify rejected: ${verify.result.error.code}.`);
  }

  return {
    status: "ok",
    terminalOutcome: terminal.outcome,
    terminalSchemaVersion: terminal.schemaVersion,
    finalHash: runtime.world.meta.stateHash,
    loadedHash: finalLoaded.runtime.world.meta.stateHash,
    verifiedHash: verify.runtime.world.meta.stateHash,
    finalDay: runtime.world.meta.currentDay,
    finalRevision: runtime.world.meta.revision,
    saveByteLength: finalSaved.byteLength,
    commandCount: input.commandsBeforeMidRunSave.length + input.commandsAfterMidRunSave.length + 1,
    midRunLoadedHashMatches,
    malformedCommandRejected: malformed.result.status === "rejected",
    malformedCommandStateHashUnchanged:
      malformed.runtime.world.meta.stateHash === malformedHashBefore,
    noP0P1DataCorruption:
      terminal.outcome === "victory" &&
      validateWorldStateV0(finalLoaded.runtime.world).length === 0,
    evidence: terminal.evidence
  };
}

function submitRequiredM6AlphaCommand(
  runtime: SimulationRuntimeV1,
  command: GameCommandV1,
  phase: string
): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  if (submitted.result.status !== "accepted") {
    throw new Error(
      `M6 Alpha loop command rejected during ${phase}: ${submitted.result.error.code}.`
    );
  }
  return submitted.runtime;
}

function latestM6AlphaTerminalState(
  runtime: SimulationRuntimeV1,
  polityId: number
): M6AlphaTerminalReadModelV1 {
  const query = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.get-m6-alpha-terminal-state",
    payload: { queryId: "m6.alpha.result", polityId }
  });
  if (query.status !== "ok" || query.result.kind !== "sim.get-m6-alpha-terminal-state") {
    throw new Error("M6 Alpha terminal query failed.");
  }
  return query.result.terminalState;
}

function bootParsedSimulationV1(input: BootSimulationInputV1): BootSimulationResultV1 {
  if (input.protocolVersion !== SIMULATION_MESSAGE_PROTOCOL_VERSION) {
    return {
      status: "rejected",
      error: {
        code: "invalid-payload",
        path: "protocolVersion",
        message: "Unsupported simulation protocol version."
      }
    };
  }

  const worldResult =
    "source" in input
      ? bootWorldStateFromRuntimeContentPackV1({
          seed: input.seed,
          runtimeContentPack: input.runtimeContentPack
        })
      : {
          status: "booted" as const,
          world:
            input.fixture === "m1.abstract-graph-30"
              ? createAbstractGraph30WorldStateV0()
              : input.fixture === "minimal-m1"
                ? createMinimalM1WorldStateV0()
                : input.fixture === "m4.determinism-replay-001"
                  ? createM4DeterminismReplayWorldStateV0()
                  : createM6AlphaStartToVictoryWorldStateV0()
        };

  if (worldResult.status === "rejected") {
    return {
      status: "rejected",
      error: worldResult.error
    };
  }

  const world = worldResult.world;
  return {
    status: "booted",
    runtime: {
      world,
      acceptedCommandIds: [],
      commandTail: [],
      eventTail: []
    },
    stateHash: world.meta.stateHash
  };
}

function createM6AlphaStartToVictoryWorldStateV0(): WorldStateV0 {
  const world = createM4DeterminismReplayWorldStateV0();
  if (world.state.m3 === undefined) {
    throw new Error("M6 Alpha fixture requires M3 state.");
  }
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...world.state.m3,
    characters: [
      ...world.state.m3.characters,
      {
        characterId: parsePersonId(1),
        polityId: parsePolityId(1),
        alive: true,
        incapacitated: false,
        currentDistrictId: parseDistrictId(1),
        commandBps: 7_000,
        administrationBps: 6_000,
        diplomacyBps: 6_000
      },
      {
        characterId: parsePersonId(2),
        polityId: parsePolityId(1),
        alive: true,
        incapacitated: false,
        currentDistrictId: parseDistrictId(1),
        commandBps: 7_000,
        administrationBps: 6_000,
        diplomacyBps: 6_000
      }
    ],
    offices: [
      ...world.state.m3.offices,
      {
        officeId: parseM3OfficeId(1),
        polityId: parsePolityId(1),
        jurisdiction: { kind: "polity", polityId: parsePolityId(1) },
        officeKind: "minister",
        primary: true,
        holderCharacterId: parsePersonId(1),
        policyId: parseM3PolicyId(1),
        minimumCommandBps: 0,
        minimumAdministrationBps: 0
      }
    ],
    policies: [
      ...world.state.m3.policies,
      {
        policyId: parseM3PolicyId(1),
        target: { kind: "polity", polityId: parsePolityId(1) },
        stance: "balanced",
        intensityBps: 5_000
      }
    ],
    successionCandidateProfiles: [
      ...world.state.m3.successionCandidateProfiles,
      {
        polityId: parsePolityId(1),
        characterId: parsePersonId(2),
        requiresRegency: false,
        supportSources: [
          {
            kind: "court",
            strengthBps: 7_000,
            sourceId: "m6.alpha.succession.court"
          },
          {
            kind: "military",
            strengthBps: 1_500,
            sourceId: "m6.alpha.succession.military"
          }
        ]
      }
    ],
    successionCrises: [
      ...world.state.m3.successionCrises,
      {
        id: parseM3SuccessionId(1),
        polityId: parsePolityId(1),
        trigger: {
          kind: "abdication",
          characterId: parsePersonId(1),
          officeId: parseM3OfficeId(1)
        },
        status: "pending",
        startedDay: world.meta.currentDay,
        resolvedDay: null,
        candidates: [
          {
            characterId: parsePersonId(2),
            requiresRegency: false,
            supportSources: [
              {
                kind: "court",
                strengthBps: 7_000,
                sourceId: "m6.alpha.succession.court"
              },
              {
                kind: "military",
                strengthBps: 1_500,
                sourceId: "m6.alpha.succession.military"
              }
            ],
            supportTotalBps: 8_500
          }
        ],
        outcome: null,
        reasonCode: "m6.alpha.succession.pending"
      }
    ]
  });
  const nextWorldWithoutHash: WorldStateV0 = {
    ...world,
    definitions: {
      ...world.definitions,
      persons: [
        ...world.definitions.persons,
        { id: parsePersonId(2), displayNameKey: "person.m6.alpha.successor" }
      ].sort((left, right) => left.id - right.id)
    },
    meta: {
      ...world.meta,
      contentManifestHash: parseContentManifestHash("m6-alpha-start-to-victory-fixture"),
      stateHash: ""
    },
    state: {
      ...world.state,
      persons: [
        ...world.state.persons,
        { definitionId: parsePersonId(2), currentDistrictId: parseDistrictId(1) }
      ].sort((left, right) => left.definitionId - right.definitionId),
      m3: nextM3,
      m6: createM6DiplomacyLegitimacyStateV0(world.definitions),
      m6PolicyEvents: createM6PolicyEventRuntimeStateV0({
        definitions: {
          policies: [
            {
              policyId: parseM6PolicyDefinitionId(1),
              sourceId: "m6.alpha.policy.harbor-duty",
              displayNameKey: "content.m6.alpha.policy.harbor_duty",
              reasonCodes: ["m6.alpha.policy.harbor-duty"],
              encyclopediaRefs: ["encyclopedia.m6.alpha.harbor_duty"]
            }
          ],
          events: [
            {
              eventDefinitionId: parseM6PolicyEventDefinitionId(1),
              sourceId: "m6.alpha.policy.harbor-charter",
              displayNameKey: "content.m6.alpha.policy.harbor_charter",
              cause: {
                kind: "day-at-least",
                day: parseGameDay(25),
                reasonCodes: ["m6.alpha.policy.cause.day-25"]
              },
              options: [
                {
                  optionId: 1,
                  displayNameKey: "content.m6.alpha.policy.harbor_charter.accept",
                  consequences: [
                    {
                      kind: "policy-modifier",
                      policyId: parseM6PolicyDefinitionId(1),
                      magnitudeBps: 250,
                      durationDays: 30,
                      reasonCode: "m6.alpha.policy.consequence.harbor-duty"
                    }
                  ],
                  reasonCodes: ["m6.alpha.policy.option.accept"],
                  encyclopediaRefs: ["encyclopedia.m6.alpha.harbor_charter.accept"]
                }
              ],
              reasonCodes: ["m6.alpha.policy.event.harbor-charter"],
              encyclopediaRefs: ["encyclopedia.m6.alpha.harbor_charter"]
            }
          ]
        }
      }),
      m6Alpha: createM6AlphaRuntimeStateV0()
    }
  };
  return {
    ...nextWorldWithoutHash,
    meta: { ...nextWorldWithoutHash.meta, stateHash: hashWorldStateV0(nextWorldWithoutHash) }
  };
}

type EvaluationResult =
  | { readonly ok: true; readonly value: CommandEvaluationV1 }
  | { readonly ok: false; readonly error: DomainErrorV1 };

function validateAndEvaluateCommand(
  runtime: SimulationRuntimeV1,
  input: unknown
): EvaluationResult {
  const parsed = parseGameCommandV1(input);
  if (!parsed.ok) {
    return { ok: false, error: fromProtocolError(parsed.error) };
  }

  const command = parsed.value;
  const staleError = validateCommandContext(runtime, command);
  if (staleError !== null) {
    return { ok: false, error: staleError };
  }

  switch (command.kind) {
    case "sim.advance-day":
      return { ok: true, value: evaluateAdvanceDay(runtime.world, command) };
    case "debug.set-district-control":
      return evaluateSetDistrictControl(runtime.world, command);
    case "sim.commit-labor":
      return evaluateCommitLabor(runtime.world, command);
    case "sim.set-polity-suzerain":
      return evaluateSetPolitySuzerain(runtime.world, command);
    case "sim.create-obligation":
      return evaluateCreateObligation(runtime.world, command);
    case "sim.record-obligation-fulfillment":
      return evaluateRecordObligationFulfillment(runtime.world, command);
    case "sim.appoint-office":
      return evaluateAppointOffice(runtime.world, command);
    case "sim.appoint-offices-bulk":
      return evaluateBulkAppointOffices(runtime.world, command);
    case "sim.update-office-policy":
      return evaluateUpdateOfficePolicy(runtime.world, command);
    case "sim.update-jurisdiction-policy":
      return evaluateUpdateJurisdictionPolicy(runtime.world, command);
    case "sim.enfeoff-district":
      return evaluateEnfeoffDistrict(runtime.world, command);
    case "sim.record-character-status":
      return evaluateRecordCharacterStatus(runtime.world, command);
    case "sim.resolve-succession":
      return evaluateResolveSuccession(runtime.world, command);
    case "sim.create-character-relationship":
      return evaluateCreateCharacterRelationship(runtime.world, command);
    case "sim.apply-m3-postwar-governance":
      return evaluateApplyM3PostwarGovernance(runtime.world, command);
    case "sim.propose-diplomatic-agreement":
      return evaluateProposeDiplomaticAgreement(runtime.world, command);
    case "sim.answer-diplomatic-agreement":
      return evaluateAnswerDiplomaticAgreement(runtime.world, command);
    case "sim.record-legitimacy-source":
      return evaluateRecordLegitimacySource(runtime.world, command);
    case "sim.choose-policy-event-option":
      return evaluateChoosePolicyEventOption(runtime.world, command);
    case "sim.evaluate-m6-alpha-outcome":
      return evaluateM6AlphaOutcome(runtime.world, command);
    case "sim.create-campaign-objective":
      return evaluateCreateCampaignObjective(runtime.world, command);
    case "sim.update-campaign-objective":
      return evaluateUpdateCampaignObjective(runtime.world, command);
    case "sim.cancel-campaign-objective":
      return evaluateCancelCampaignObjective(runtime.world, command);
    case "sim.create-muster-commitment":
      return evaluateCreateMusterCommitment(runtime.world, command);
    case "sim.record-muster-response":
      return evaluateRecordMusterResponse(runtime.world, command);
    case "sim.reserve-campaign-grain-supply":
      return evaluateReserveCampaignGrainSupply(runtime.world, command);
    case "sim.consume-campaign-grain-supply":
      return evaluateConsumeCampaignGrainSupply(runtime.world, command);
    case "sim.release-campaign-grain-supply":
      return evaluateReleaseCampaignGrainSupply(runtime.world, command);
    case "sim.start-campaign-march":
      return evaluateStartCampaignMarch(runtime.world, command);
    case "sim.resolve-m4-field-engagement":
      return evaluateResolveM4FieldEngagement(runtime.world, command);
    case "sim.apply-m4-siege-choice":
      return evaluateApplyM4SiegeChoice(runtime.world, command);
    case "sim.resolve-m4-campaign-withdrawal":
      return evaluateResolveM4CampaignWithdrawal(runtime.world, command);
    case "sim.verify-state-hash":
      return evaluateVerifyStateHash(runtime.world, command);
  }
}

function validateCommandContext(
  runtime: SimulationRuntimeV1,
  command: GameCommandV1
): DomainErrorV1 | null {
  if (runtime.acceptedCommandIds.includes(command.commandId)) {
    return {
      code: "duplicate-command",
      path: "commandId",
      message: "GameCommand commandId has already been accepted by this simulation runtime."
    };
  }

  if (command.expectedDay !== runtime.world.meta.currentDay) {
    return {
      code: "stale-day",
      path: "expectedDay",
      message: "GameCommand expectedDay does not match the committed WorldState day."
    };
  }

  if (command.expectedRevision !== runtime.world.meta.revision) {
    return {
      code: "stale-revision",
      path: "expectedRevision",
      message: "GameCommand expectedRevision does not match the committed WorldState revision."
    };
  }

  return null;
}

function evaluateAdvanceDay(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.advance-day" }>
): CommandEvaluationV1 {
  const advancedWorld = advanceWorldByGameDay(world);
  const nextM4 = advanceM4DailyMarches(advancedWorld);
  const nextWorld =
    nextM4 === null
      ? advancedWorld
      : restampAdvancedWorldState(advancedWorld, { ...advancedWorld.state, m4: nextM4 });
  return {
    command,
    nextWorld,
    wouldChangeState: true,
    events: [
      {
        schemaVersion: 1,
        kind: "sim.day-advanced",
        commandId: command.commandId,
        actor: command.actor,
        fromDay: world.meta.currentDay,
        toDay: nextWorld.meta.currentDay,
        revisionBefore: world.meta.revision,
        revisionAfter: nextWorld.meta.revision
      }
    ],
    deltas: [
      {
        schemaVersion: 1,
        kind: "state.day-changed",
        day: nextWorld.meta.currentDay,
        revision: nextWorld.meta.revision,
        stateHash: nextWorld.meta.stateHash
      }
    ]
  };
}

function restampAdvancedWorldState(
  world: WorldStateV0,
  state: WorldStateV0["state"]
): WorldStateV0 {
  const withoutHash: WorldStateV0 = {
    ...world,
    state,
    meta: {
      ...world.meta,
      stateHash: ""
    }
  };
  return {
    ...withoutHash,
    meta: {
      ...withoutHash.meta,
      stateHash: hashWorldStateV0(withoutHash)
    }
  };
}

function evaluateSetDistrictControl(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "debug.set-district-control" }>
): EvaluationResult {
  const districtId = parseDistrictId(command.payload.districtId);
  const nextControllerPolityId =
    command.payload.controllerPolityId === null
      ? null
      : parsePolityId(command.payload.controllerPolityId);

  const district = world.state.districts.find((entry) => entry.definitionId === districtId);
  if (district === undefined) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.districtId",
        message: "debug.set-district-control references a missing DistrictId."
      }
    };
  }

  if (
    nextControllerPolityId !== null &&
    !world.state.polities.some((entry) => entry.definitionId === nextControllerPolityId)
  ) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.controllerPolityId",
        message: "debug.set-district-control references a missing PolityId."
      }
    };
  }

  const previousControllerPolityId =
    district.control.kind === "controlled" ? district.control.controllerPolityId : null;
  const nextControl: DistrictControlState =
    nextControllerPolityId === null
      ? { kind: "uncontrolled" }
      : { kind: "controlled", controllerPolityId: nextControllerPolityId };
  const nextWorldControl = copyDistrictControlState(nextControl);
  const nextState = {
    ...world.state,
    districts: world.state.districts.map((entry) =>
      entry.definitionId === districtId
        ? {
            definitionId: entry.definitionId,
            control: nextWorldControl
          }
        : entry
    )
  };
  const nextWorld = commitRuntimeState(world, nextState);
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: previousControllerPolityId !== nextControllerPolityId,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.district-control-changed",
          commandId: command.commandId,
          actor: command.actor,
          districtId,
          previousControllerPolityId,
          nextControllerPolityId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.district-control-updated",
          districtId,
          control: copyDistrictControlState(nextWorldControl),
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateCommitLabor(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.commit-labor" }>
): EvaluationResult {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return {
      ok: false,
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.commit-labor requires an M2 economy population state."
      }
    };
  }

  const populationGroupId = parsePopulationGroupId(command.payload.populationGroupId);
  const group = m2.populationGroups.find((entry) => entry.id === populationGroupId);
  if (group === undefined) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.populationGroupId",
        message: "sim.commit-labor references a missing PopulationGroupId."
      }
    };
  }

  if (command.payload.laborAmount > group.availableLabor) {
    return {
      ok: false,
      error: {
        code: "insufficient-labor",
        path: "payload.laborAmount",
        message: "sim.commit-labor laborAmount exceeds availableLabor."
      }
    };
  }

  const releaseDay = parseGameDay(world.meta.currentDay + command.payload.durationDays);
  const nextGroup = commitLaborToPopulationGroup({
    group,
    purpose: command.payload.purpose,
    laborAmount: command.payload.laborAmount,
    startDay: world.meta.currentDay,
    releaseDay
  });
  const nextMarket = m2.market.districts.map((district) =>
    district.districtId === nextGroup.districtId
      ? {
          ...district,
          cashFlow: {
            cumulativeMobilizationCost:
              district.cashFlow.cumulativeMobilizationCost +
              command.payload.laborAmount * command.payload.durationDays,
            lastDailyCashDelta: 0
          }
        }
      : district
  );
  const nextM2 = canonicalizeM2EconomyPopulationState({
    ...m2,
    populationGroups: m2.populationGroups.map((entry) =>
      entry.id === populationGroupId ? nextGroup : entry
    ),
    market: {
      districts: nextMarket
    }
  });
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    m2: nextM2
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  const committedLabor = nextGroup.committedLabor.reduce(
    (sum, commitment) => sum + commitment.laborAmount,
    0
  );

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.labor-committed",
          commandId: command.commandId,
          actor: command.actor,
          populationGroupId,
          purpose: command.payload.purpose,
          laborAmount: command.payload.laborAmount,
          releaseDay,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m2-population-group-updated",
          populationGroupId,
          availableLabor: nextGroup.availableLabor,
          committedLabor,
          grainStock: nextGroup.grainStock,
          cashStock: nextGroup.cashStock,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function commitLaborToPopulationGroup(input: {
  readonly group: M2PopulationGroupStateV0;
  readonly purpose: M2LaborCommitmentPurposeV0;
  readonly laborAmount: number;
  readonly startDay: number;
  readonly releaseDay: number;
}): M2PopulationGroupStateV0 {
  const committedLabor = [
    ...input.group.committedLabor,
    {
      purpose: input.purpose,
      laborAmount: input.laborAmount,
      startDay: parseGameDay(input.startDay),
      releaseDay: parseGameDay(input.releaseDay)
    }
  ];
  const committedLaborAmount = committedLabor.reduce(
    (sum, commitment) => sum + commitment.laborAmount,
    0
  );

  return {
    ...input.group,
    availableLabor: input.group.workingPeople - committedLaborAmount,
    committedLabor
  };
}

function evaluateSetPolitySuzerain(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.set-polity-suzerain" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.set-polity-suzerain");
  }

  const polityId = parsePolityId(command.payload.polityId);
  const nextSuzerainPolityId =
    command.payload.directSuzerainPolityId === null
      ? null
      : parsePolityId(command.payload.directSuzerainPolityId);
  const existing = m3.polities.find((entry) => entry.polityId === polityId);
  if (existing === undefined) {
    return badIdError("payload.polityId", "sim.set-polity-suzerain references a missing PolityId.");
  }
  if (
    nextSuzerainPolityId !== null &&
    !m3.polities.some((entry) => entry.polityId === nextSuzerainPolityId)
  ) {
    return badIdError(
      "payload.directSuzerainPolityId",
      "sim.set-polity-suzerain references a missing suzerain PolityId."
    );
  }
  if (
    nextSuzerainPolityId !== null &&
    wouldCreateSuzerainCycle(m3.polities, polityId, nextSuzerainPolityId)
  ) {
    return {
      ok: false,
      error: {
        code: "acyclicity-violation",
        path: "payload.directSuzerainPolityId",
        message: "sim.set-polity-suzerain would create a suzerain cycle."
      }
    };
  }

  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    polities: m3.polities.map((entry) =>
      entry.polityId === polityId
        ? { polityId, directSuzerainPolityId: nextSuzerainPolityId }
        : entry
    )
  });
  const nextWorld = commitRuntimeState(world, { ...world.state, m3: nextM3 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: existing.directSuzerainPolityId !== nextSuzerainPolityId,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.polity-suzerain-changed",
          commandId: command.commandId,
          actor: command.actor,
          polityId,
          previousSuzerainPolityId: existing.directSuzerainPolityId,
          nextSuzerainPolityId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m3-polity-updated",
          polityId,
          directSuzerainPolityId: nextSuzerainPolityId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateCreateObligation(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.create-obligation" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.create-obligation");
  }

  const debtorPolityId = parsePolityId(command.payload.debtorPolityId);
  const creditorPolityId = parsePolityId(command.payload.creditorPolityId);
  if (!m3.polities.some((entry) => entry.polityId === debtorPolityId)) {
    return badIdError(
      "payload.debtorPolityId",
      "sim.create-obligation references a missing debtor PolityId."
    );
  }
  if (!m3.polities.some((entry) => entry.polityId === creditorPolityId)) {
    return badIdError(
      "payload.creditorPolityId",
      "sim.create-obligation references a missing creditor PolityId."
    );
  }
  if (debtorPolityId === creditorPolityId) {
    return badIdError(
      "payload.creditorPolityId",
      "sim.create-obligation debtor and creditor must be different polities."
    );
  }
  const debtor = m3.polities.find((entry) => entry.polityId === debtorPolityId);
  if (debtor?.directSuzerainPolityId !== creditorPolityId) {
    return {
      ok: false,
      error: {
        code: "illegal-vassalage",
        path: "payload.creditorPolityId",
        message: "sim.create-obligation requires debtor to be a direct vassal of creditor."
      }
    };
  }

  const obligationId = parseM3ObligationId(nextNumericId(m3.obligations));
  const auditEventId = parseM3ObligationAuditEventId(nextNumericId(m3.obligationAuditEvents));
  const accounting = createInitialObligationAccounting(
    command.payload.requirement,
    command.payload.due
  );
  const obligation: M3ObligationStateV0 = {
    id: obligationId,
    debtorPolityId,
    creditorPolityId,
    obligationKind: command.payload.obligationKind,
    obligationCategory: command.payload.obligationCategory,
    obligationSource: {
      kind: "vassalage",
      sourceId: command.payload.obligationSource.sourceId,
      debtorPolityId,
      creditorPolityId
    },
    requirement: copyCommandRequirement(command.payload.requirement),
    due: copyCommandDue(command.payload.due),
    accounting,
    status: "active",
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: auditEventId,
    latestAuditEventId: auditEventId
  };
  const auditEvent = createM3AuditEvent({
    id: auditEventId,
    obligationId,
    eventKind: "created",
    world,
    commandId: command.commandId,
    actor: command.actor,
    fulfillmentId: null,
    fulfilledAmount: null,
    actionKind: null,
    dueDay: null,
    statusAfter: "active",
    reasonCode: null,
    reasonCodes: ["obligation.created", `obligation.kind.${command.payload.obligationCategory}`],
    reliabilityBps: 10_000
  });
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    obligations: [...m3.obligations, obligation],
    obligationAuditEvents: [...m3.obligationAuditEvents, auditEvent]
  });
  const nextWorld = commitRuntimeState(world, { ...world.state, m3: nextM3 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.obligation-created",
          commandId: command.commandId,
          actor: command.actor,
          obligationId,
          debtorPolityId,
          creditorPolityId,
          auditEventId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m3-obligation-updated",
          obligationId,
          status: "active",
          latestAuditEventId: auditEventId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateRecordObligationFulfillment(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.record-obligation-fulfillment");
  }

  const obligationId = parseM3ObligationId(command.payload.obligationId);
  const fulfillmentId = parseM3FulfillmentId(command.payload.fulfillmentId);
  const obligation = m3.obligations.find((entry) => entry.id === obligationId);
  if (obligation === undefined) {
    return badIdError(
      "payload.obligationId",
      "sim.record-obligation-fulfillment references a missing M3ObligationId."
    );
  }
  if (m3.fulfillmentClaims.some((entry) => entry.fulfillmentId === fulfillmentId)) {
    return {
      ok: false,
      error: {
        code: "duplicate-fulfillment",
        path: "payload.fulfillmentId",
        message: "sim.record-obligation-fulfillment fulfillmentId was already counted."
      }
    };
  }
  const actorError = validateObligationSettlementActor(obligation, command);
  if (actorError !== null) {
    return { ok: false, error: actorError };
  }
  const dueError = validateObligationDuePeriod(obligation, command.payload.dueDay);
  if (dueError !== null) {
    return { ok: false, error: dueError };
  }
  if (hasTerminalSettlementForDueDay(m3, obligationId, command.payload.dueDay)) {
    return {
      ok: false,
      error: {
        code: "duplicate-obligation-settlement",
        path: "payload.dueDay",
        message: "sim.record-obligation-fulfillment due period was already terminally settled."
      }
    };
  }
  const settlementRuleError = validateObligationSettlementRules(obligation, command);
  if (settlementRuleError !== null) {
    return { ok: false, error: settlementRuleError };
  }
  const resourcePlan = planObligationResourceMovement(world, obligation, command);
  if (!resourcePlan.ok) {
    return { ok: false, error: resourcePlan.error };
  }
  const settlement = applyObligationSettlementAccounting(obligation, command);

  const auditEventId = parseM3ObligationAuditEventId(nextNumericId(m3.obligationAuditEvents));
  const explanation = explainObligationSettlement(world, m3, obligation, command);
  const auditEvent = createM3AuditEvent({
    id: auditEventId,
    obligationId,
    eventKind: "settled",
    world,
    commandId: command.commandId,
    actor: command.actor,
    fulfillmentId,
    fulfilledAmount: command.payload.fulfilledAmount,
    actionKind: command.payload.actionKind,
    dueDay: command.payload.dueDay,
    statusAfter: settlement.status,
    reasonCode: command.payload.reasonCode,
    reasonCodes: explanation.reasonCodes,
    reliabilityBps: explanation.reliabilityBps
  });
  const nextM2 =
    world.state.m2 === undefined
      ? undefined
      : applyObligationResourceMovement(world.state.m2, resourcePlan.movements);
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    obligations: m3.obligations.map((entry) =>
      entry.id === obligationId
        ? {
            ...entry,
            due: settlement.due,
            accounting: settlement.accounting,
            status: settlement.status,
            disputeReasonCode: settlement.disputeReasonCode,
            breachReasonCode: settlement.breachReasonCode,
            latestAuditEventId: auditEventId
          }
        : entry
    ),
    obligationAuditEvents: [...m3.obligationAuditEvents, auditEvent],
    fulfillmentClaims: [
      ...m3.fulfillmentClaims,
      {
        fulfillmentId,
        obligationId,
        auditEventId,
        actionKind: command.payload.actionKind,
        dueDay: parseGameDay(command.payload.dueDay),
        fulfilledAmount: command.payload.fulfilledAmount,
        deliveredAmount: settlement.accounting.deliveredAmount,
        arrearsAmount: settlement.accounting.arrearsAmount,
        defaultedAmount: settlement.accounting.defaultedAmount,
        reasonCode: command.payload.reasonCode,
        sourceMovements: resourcePlan.movements
      }
    ]
  });
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    ...(nextM2 === undefined ? {} : { m2: nextM2 }),
    m3: nextM3
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.obligation-settled",
          commandId: command.commandId,
          actor: command.actor,
          obligationId,
          fulfillmentId,
          actionKind: command.payload.actionKind,
          dueDay: command.payload.dueDay,
          resourceKind:
            obligation.requirement.kind === "amount"
              ? obligation.requirement.resourceKind
              : "condition",
          fulfilledAmount: command.payload.fulfilledAmount,
          statusAfter: settlement.status,
          reasonCode: command.payload.reasonCode,
          auditEventId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m3-obligation-updated",
          obligationId,
          status: settlement.status,
          latestAuditEventId: auditEventId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateAppointOffice(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.appoint-office" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.appoint-office");
  }

  const officeId = parseM3OfficeId(command.payload.officeId);
  const characterId =
    command.payload.characterId === null ? null : parsePersonId(command.payload.characterId);
  const validation = validateM3AppointmentItem({
    m3,
    actor: command.actor,
    officeId,
    characterId,
    currentOfficeId: null
  });
  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const nextM3 = applyM3AppointmentItems({
    m3,
    world,
    commandId: command.commandId,
    actor: command.actor,
    eventKind: "appointment",
    reasonCode: command.payload.reasonCode,
    items: [{ officeId, characterId }]
  });
  return commitM3AppointmentWorld({
    world,
    command,
    nextM3,
    events: [
      createM3AppointmentDomainEvent({
        command,
        world,
        nextM3,
        eventKind: "appointment",
        officeId,
        characterId,
        policyId: validation.office.policyId,
        districtId: null,
        reasonCode: command.payload.reasonCode
      })
    ],
    deltas: [
      {
        schemaVersion: 1,
        kind: "state.m3-office-updated",
        officeId,
        holderCharacterId: characterId,
        policyId: validation.office.policyId,
        revision: world.meta.revision + 1,
        stateHash: ""
      }
    ]
  });
}

function evaluateBulkAppointOffices(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.appoint-offices-bulk" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.appoint-offices-bulk");
  }

  const orderedItems = [...command.payload.items].sort((left, right) =>
    compareText(left.itemId, right.itemId)
  );
  const seenOfficeIds = new Set<number>();
  const rejections: { readonly itemId: string; readonly reasonCode: string }[] = [];
  const validItems: {
    readonly itemId: string;
    readonly officeId: M3OfficeId;
    readonly characterId: PersonId | null;
  }[] = [];

  for (const item of orderedItems) {
    const officeId = parseM3OfficeId(item.officeId);
    const characterId = item.characterId === null ? null : parsePersonId(item.characterId);
    if (seenOfficeIds.has(officeId)) {
      rejections.push({ itemId: item.itemId, reasonCode: "duplicate-office-in-bulk" });
      continue;
    }
    seenOfficeIds.add(officeId);

    const validation = validateM3AppointmentItem({
      m3,
      actor: command.actor,
      officeId,
      characterId,
      currentOfficeId: officeId
    });
    if (validation.ok) {
      validItems.push({ itemId: item.itemId, officeId, characterId });
    } else {
      rejections.push({ itemId: item.itemId, reasonCode: validation.error.message });
    }
  }

  rejections.push(...collectM3BulkPrimaryConflictRejections(m3, validItems));

  if (rejections.length > 0) {
    return {
      ok: false,
      error: {
        code: "bulk-command-rejected",
        path: "payload.items",
        message: `sim.appoint-offices-bulk rejected items: ${rejections
          .sort((left, right) => compareText(left.itemId, right.itemId))
          .map((item) => `${item.itemId}=${item.reasonCode}`)
          .join(";")}`
      }
    };
  }

  const nextM3 = applyM3AppointmentItems({
    m3,
    world,
    commandId: command.commandId,
    actor: command.actor,
    eventKind: "bulk-appointment",
    reasonCode: "bulk-appointment",
    items: validItems
  });
  const events = validItems.map((item) =>
    createM3AppointmentDomainEvent({
      command,
      world,
      nextM3,
      eventKind: "bulk-appointment",
      officeId: item.officeId,
      characterId: item.characterId,
      policyId: findM3Office(nextM3, item.officeId)?.policyId ?? null,
      districtId: null,
      reasonCode: "bulk-appointment"
    })
  );
  const deltas = validItems.map((item) => {
    const office = findM3Office(nextM3, item.officeId);
    return {
      schemaVersion: 1 as const,
      kind: "state.m3-office-updated" as const,
      officeId: item.officeId,
      holderCharacterId: item.characterId,
      policyId: office === undefined ? parseM3PolicyId(1) : office.policyId,
      revision: world.meta.revision + 1,
      stateHash: ""
    };
  });

  return commitM3AppointmentWorld({ world, command, nextM3, events, deltas });
}

function evaluateUpdateOfficePolicy(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.update-office-policy" }>
): EvaluationResult {
  return evaluateUpdatePolicy(world, command, "office");
}

function evaluateUpdateJurisdictionPolicy(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.update-jurisdiction-policy" }>
): EvaluationResult {
  return evaluateUpdatePolicy(world, command, "jurisdiction");
}

function evaluateUpdatePolicy(
  world: WorldStateV0,
  command: Extract<
    GameCommandV1,
    { readonly kind: "sim.update-office-policy" | "sim.update-jurisdiction-policy" }
  >,
  expectedTarget: "jurisdiction" | "office"
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError(command.kind);
  }

  const policyId = parseM3PolicyId(command.payload.policyId);
  const policy = m3.policies.find((entry) => entry.policyId === policyId);
  if (policy === undefined) {
    return badIdError("payload.policyId", `${command.kind} references a missing M3PolicyId.`);
  }
  if (expectedTarget === "office" && policy.target.kind !== "office") {
    return badIdError("payload.policyId", "sim.update-office-policy requires an office policy.");
  }
  if (expectedTarget === "jurisdiction" && policy.target.kind === "office") {
    return badIdError(
      "payload.policyId",
      "sim.update-jurisdiction-policy requires a jurisdiction policy."
    );
  }
  const authorityPolityId = polityForPolicyTarget(m3, policy.target);
  if (
    authorityPolityId === null ||
    !actorHasPolityAuthority(m3, command.actor, authorityPolityId)
  ) {
    return authorityDeniedError();
  }

  const nextPolicy: M3PolicyStateV0 = {
    ...policy,
    stance: command.payload.stance,
    intensityBps: command.payload.intensityBps
  };
  const auditEventId = parseM3AppointmentAuditEventId(nextNumericId(m3.appointmentAuditEvents));
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    policies: m3.policies.map((entry) => (entry.policyId === policyId ? nextPolicy : entry)),
    appointmentAuditEvents: [
      ...m3.appointmentAuditEvents,
      createM3AppointmentAuditEvent({
        id: auditEventId,
        eventKind: "policy-updated",
        world,
        commandId: command.commandId,
        actor: command.actor,
        officeId: policy.target.kind === "office" ? policy.target.officeId : null,
        characterId: null,
        policyId,
        districtId: policy.target.kind === "district" ? policy.target.districtId : null,
        reasonCode: command.payload.reasonCode
      })
    ]
  });

  return commitM3AppointmentWorld({
    world,
    command,
    nextM3,
    events: [
      createM3AppointmentDomainEvent({
        command,
        world,
        nextM3,
        eventKind: "policy-updated",
        officeId: policy.target.kind === "office" ? policy.target.officeId : null,
        characterId: null,
        policyId,
        districtId: policy.target.kind === "district" ? policy.target.districtId : null,
        reasonCode: command.payload.reasonCode
      })
    ],
    deltas: [
      {
        schemaVersion: 1,
        kind: "state.m3-policy-updated",
        policyId,
        stance: command.payload.stance,
        intensityBps: command.payload.intensityBps,
        revision: world.meta.revision + 1,
        stateHash: ""
      }
    ]
  });
}

function evaluateEnfeoffDistrict(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.enfeoff-district" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.enfeoff-district");
  }

  const districtId = parseDistrictId(command.payload.districtId);
  const holderCharacterId = parsePersonId(command.payload.holderCharacterId);
  const grantedByPolityId = parsePolityId(command.payload.grantedByPolityId);
  const policyId = parseM3PolicyId(command.payload.policyId);
  if (!world.definitions.districts.some((entry) => entry.id === districtId)) {
    return badIdError(
      "payload.districtId",
      "sim.enfeoff-district references a missing DistrictId."
    );
  }
  if (!m3.polities.some((entry) => entry.polityId === grantedByPolityId)) {
    return badIdError(
      "payload.grantedByPolityId",
      "sim.enfeoff-district references a missing granting PolityId."
    );
  }
  const holder = findM3Character(m3, holderCharacterId);
  if (holder === undefined) {
    return badIdError(
      "payload.holderCharacterId",
      "sim.enfeoff-district references a missing holder character."
    );
  }
  const availability = validateM3CharacterAvailability(holder, districtId);
  if (availability !== null) {
    return { ok: false, error: availability };
  }
  const policy = m3.policies.find((entry) => entry.policyId === policyId);
  if (
    policy === undefined ||
    policy.target.kind !== "district" ||
    policy.target.districtId !== districtId
  ) {
    return badIdError(
      "payload.policyId",
      "sim.enfeoff-district requires a policy attached to the target district."
    );
  }
  if (!actorHasPolityAuthority(m3, command.actor, grantedByPolityId)) {
    return authorityDeniedError();
  }

  const enfeoffment: M3EnfeoffmentStateV0 = {
    districtId,
    holderCharacterId,
    grantedByPolityId,
    policyId,
    grantedDay: world.meta.currentDay,
    reasonCode: command.payload.reasonCode
  };
  const auditEventId = parseM3AppointmentAuditEventId(nextNumericId(m3.appointmentAuditEvents));
  const nextAdministrativeDistricts = [
    ...m3.administrativeDistricts.filter((entry) => entry.districtId !== districtId),
    {
      polityId: grantedByPolityId,
      districtId,
      controlMode: "vassal" as const,
      localComplexity: 50,
      communicationCost: 75,
      directness: 50,
      frontierPressure: 50,
      administrativeCapacity: 1_000
    }
  ];
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    enfeoffments: [
      ...m3.enfeoffments.filter((entry) => entry.districtId !== districtId),
      enfeoffment
    ],
    administrativeDistricts: nextAdministrativeDistricts,
    appointmentAuditEvents: [
      ...m3.appointmentAuditEvents,
      createM3AppointmentAuditEvent({
        id: auditEventId,
        eventKind: "enfeoffment",
        world,
        commandId: command.commandId,
        actor: command.actor,
        officeId: null,
        characterId: holderCharacterId,
        policyId,
        districtId,
        reasonCode: command.payload.reasonCode
      })
    ]
  });

  return commitM3AppointmentWorld({
    world,
    command,
    nextM3,
    events: [
      createM3AppointmentDomainEvent({
        command,
        world,
        nextM3,
        eventKind: "enfeoffment",
        officeId: null,
        characterId: holderCharacterId,
        policyId,
        districtId,
        reasonCode: command.payload.reasonCode
      })
    ],
    deltas: [
      {
        schemaVersion: 1,
        kind: "state.m3-enfeoffment-updated",
        districtId,
        holderCharacterId,
        policyId,
        revision: world.meta.revision + 1,
        stateHash: ""
      }
    ]
  });
}

function evaluateRecordCharacterStatus(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-character-status" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.record-character-status");
  }

  const characterId = parsePersonId(command.payload.characterId);
  const character = findM3Character(m3, characterId);
  if (character === undefined) {
    return badIdError(
      "payload.characterId",
      "sim.record-character-status references a missing character."
    );
  }
  if (!actorHasPolityAuthority(m3, command.actor, character.polityId)) {
    return authorityDeniedError();
  }
  if (!character.alive && command.payload.status === "incapacitated") {
    return {
      ok: false,
      error: {
        code: "succession-state-invalid",
        path: "payload.status",
        message: "sim.record-character-status cannot incapacitate a dead character."
      }
    };
  }
  if (!character.alive && command.payload.status === "abdicated") {
    return {
      ok: false,
      error: {
        code: "succession-state-invalid",
        path: "payload.status",
        message: "sim.record-character-status cannot abdicate a dead character."
      }
    };
  }

  const triggerOffice = findM3SuccessionTriggerOffice(m3, characterId);
  const nextCharacter: M3CharacterStateV0 =
    command.payload.status === "dead"
      ? { ...character, alive: false, incapacitated: false }
      : command.payload.status === "incapacitated"
        ? { ...character, incapacitated: true }
        : character;
  const candidates =
    triggerOffice === null ? [] : formM3SuccessionCandidates(m3, character.polityId, characterId);
  const triggerKind = recordCharacterStatusToSuccessionTriggerKind(command.payload.status);
  const crisis =
    triggerOffice === null
      ? null
      : createM3SuccessionCrisis({
          m3,
          world,
          polityId: character.polityId,
          characterId,
          officeId: triggerOffice.officeId,
          triggerKind,
          candidates,
          reasonCode: command.payload.reasonCode
        });
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    characters: m3.characters.map((entry) =>
      entry.characterId === characterId ? nextCharacter : entry
    ),
    relationships:
      command.payload.status === "abdicated"
        ? m3.relationships
        : m3.relationships.filter(
            (entry) =>
              entry.sourceCharacterId !== characterId && entry.targetCharacterId !== characterId
          ),
    offices: m3.offices.map((office) =>
      shouldVacateOfficeForCharacterStatus(
        command.payload.status,
        office,
        characterId,
        triggerOffice
      )
        ? { ...office, holderCharacterId: null }
        : office
    ),
    enfeoffments:
      command.payload.status === "abdicated"
        ? m3.enfeoffments
        : m3.enfeoffments.filter((entry) => entry.holderCharacterId !== characterId),
    successionCrises: crisis === null ? m3.successionCrises : [...m3.successionCrises, crisis]
  });

  const events =
    crisis === null
      ? []
      : [
          createM3SuccessionDomainEvent({
            command,
            world,
            crisis,
            outcomeKind: null
          })
        ];
  const deltas =
    crisis === null
      ? []
      : [
          {
            schemaVersion: 1 as const,
            kind: "state.m3-succession-updated" as const,
            successionId: crisis.id,
            polityId: crisis.polityId,
            status: crisis.status,
            revision: world.meta.revision + 1,
            stateHash: ""
          }
        ];

  return commitM3AppointmentWorld({ world, command, nextM3, events, deltas });
}

function recordCharacterStatusToSuccessionTriggerKind(
  status: Extract<
    GameCommandV1,
    { readonly kind: "sim.record-character-status" }
  >["payload"]["status"]
): "death" | "incapacity" | "abdication" {
  switch (status) {
    case "dead":
      return "death";
    case "incapacitated":
      return "incapacity";
    case "abdicated":
      return "abdication";
  }
}

function shouldVacateOfficeForCharacterStatus(
  status: Extract<
    GameCommandV1,
    { readonly kind: "sim.record-character-status" }
  >["payload"]["status"],
  office: M3OfficeStateV0,
  characterId: PersonId,
  triggerOffice: M3OfficeStateV0 | null
): boolean {
  if (office.holderCharacterId !== characterId) {
    return false;
  }
  if (status !== "abdicated") {
    return true;
  }
  return triggerOffice !== null && office.officeId === triggerOffice.officeId;
}

function evaluateResolveSuccession(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.resolve-succession" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.resolve-succession");
  }

  const successionId = parseM3SuccessionId(command.payload.successionId);
  const crisis = m3.successionCrises.find((entry) => entry.id === successionId);
  if (crisis === undefined) {
    return badIdError(
      "payload.successionId",
      "sim.resolve-succession references a missing crisis."
    );
  }
  if (crisis.status !== "pending") {
    return {
      ok: false,
      error: {
        code: "succession-state-invalid",
        path: "payload.successionId",
        message: "sim.resolve-succession requires a pending crisis."
      }
    };
  }
  if (!actorHasPolityAuthority(m3, command.actor, crisis.polityId)) {
    return authorityDeniedError();
  }
  if (crisis.candidates.length === 0) {
    return {
      ok: false,
      error: {
        code: "succession-state-invalid",
        path: "state.m3.successionCrises.candidates",
        message: "sim.resolve-succession requires at least one candidate."
      }
    };
  }

  const outcomeResult = resolveM3SuccessionOutcome(m3, crisis, command.payload.reasonCode);
  if (!outcomeResult.ok) {
    return { ok: false, error: outcomeResult.error };
  }
  const outcome = outcomeResult.outcome;
  const nextCrisis: M3SuccessionCrisisStateV0 = {
    ...crisis,
    status: "resolved",
    resolvedDay: world.meta.currentDay,
    outcome,
    reasonCode: command.payload.reasonCode
  };
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    offices: applyM3SuccessionOutcomeToOffices(m3, crisis, outcome),
    successionCrises: m3.successionCrises.map((entry) =>
      entry.id === successionId ? nextCrisis : entry
    )
  });
  const legitimacyResult = appendM6SuccessionLegitimacySource(
    ensureM6State(world),
    world,
    crisis.polityId,
    nextCrisis
  );

  return commitM3AppointmentWorld({
    world,
    command,
    nextM3,
    nextM6: legitimacyResult.nextM6,
    events: [
      createM3SuccessionDomainEvent({
        command,
        world,
        crisis: nextCrisis,
        outcomeKind: outcome.kind
      }),
      {
        schemaVersion: 1,
        kind: "sim.m6-legitimacy-source-recorded",
        commandId: command.commandId,
        actor: { kind: "system", id: "m3.succession" },
        sourceId: legitimacyResult.source.sourceId,
        polityId: crisis.polityId,
        audience: legitimacyResult.source.audience,
        magnitudeBps: legitimacyResult.source.magnitudeBps,
        scoreAfterBps: legitimacyResult.profile.scoreBps,
        reasonCodes: [legitimacyResult.source.reasonCode],
        revisionBefore: world.meta.revision,
        revisionAfter: world.meta.revision + 1
      }
    ],
    deltas: [
      {
        schemaVersion: 1,
        kind: "state.m3-succession-updated",
        successionId,
        polityId: crisis.polityId,
        status: "resolved",
        revision: world.meta.revision + 1,
        stateHash: ""
      },
      {
        schemaVersion: 1,
        kind: "state.m6-legitimacy-updated",
        polityId: crisis.polityId,
        audience: legitimacyResult.source.audience,
        scoreBps: legitimacyResult.profile.scoreBps,
        revision: world.meta.revision + 1,
        stateHash: ""
      }
    ]
  });
}

function evaluateCreateCharacterRelationship(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.create-character-relationship" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.create-character-relationship");
  }

  const sourceCharacterId = parsePersonId(command.payload.sourceCharacterId);
  const targetCharacterId = parsePersonId(command.payload.targetCharacterId);
  const source = findM3Character(m3, sourceCharacterId);
  const target = findM3Character(m3, targetCharacterId);
  if (source === undefined) {
    return badIdError(
      "payload.sourceCharacterId",
      "sim.create-character-relationship references a missing source character."
    );
  }
  if (target === undefined) {
    return badIdError(
      "payload.targetCharacterId",
      "sim.create-character-relationship references a missing target character."
    );
  }
  const sourceAvailability = validateM3CharacterAvailabilityAtPath(
    source,
    null,
    "payload.sourceCharacterId"
  );
  if (sourceAvailability !== null) {
    return { ok: false, error: sourceAvailability };
  }
  const targetAvailability = validateM3CharacterAvailabilityAtPath(
    target,
    null,
    "payload.targetCharacterId"
  );
  if (targetAvailability !== null) {
    return { ok: false, error: targetAvailability };
  }
  if (!actorHasPolityAuthority(m3, command.actor, source.polityId)) {
    return authorityDeniedError();
  }

  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    relationships: [
      ...m3.relationships.filter(
        (entry) =>
          entry.sourceCharacterId !== sourceCharacterId ||
          entry.targetCharacterId !== targetCharacterId
      ),
      {
        sourceCharacterId,
        targetCharacterId,
        affinityBps: command.payload.affinityBps
      }
    ]
  });

  return commitM3AppointmentWorld({
    world,
    command,
    nextM3,
    events: [],
    deltas: []
  });
}

type PostwarGovernanceEvaluationInput = {
  readonly world: WorldStateV0;
  readonly m3: M3PolityVassalageStateV0;
  readonly victorPolityId: PolityId;
  readonly localPolityId: PolityId;
  readonly districtId: DistrictId;
  readonly method: M3PostwarGovernanceMethodV1;
};

function evaluateApplyM3PostwarGovernance(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.apply-m3-postwar-governance" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.apply-m3-postwar-governance");
  }

  const victorPolityId = parsePolityId(command.payload.victorPolityId);
  const localPolityId = parsePolityId(command.payload.localPolityId);
  const districtId = parseDistrictId(command.payload.districtId);
  const validation = validatePostwarGovernanceRequest({
    world,
    m3,
    victorPolityId,
    localPolityId,
    districtId,
    method: command.payload.method
  });
  if (validation !== null) {
    return { ok: false, error: validation };
  }
  if (!actorHasPolityAuthority(m3, command.actor, victorPolityId)) {
    return authorityDeniedError();
  }
  const restoreValidation = validateRestoreVassalPayload(m3, command, localPolityId, districtId);
  if (restoreValidation !== null) {
    return { ok: false, error: restoreValidation };
  }
  if (hasExistingPostwarGovernanceArrangement(world, m3, districtId)) {
    return {
      ok: false,
      error: {
        code: "duplicate-obligation-settlement",
        path: "payload.districtId",
        message: "sim.apply-m3-postwar-governance district already has a postwar arrangement."
      }
    };
  }
  if (
    command.payload.method !== "direct-control" &&
    wouldCreateSuzerainCycle(m3.polities, localPolityId, victorPolityId)
  ) {
    return {
      ok: false,
      error: {
        code: "acyclicity-violation",
        path: "payload.victorPolityId",
        message: "sim.apply-m3-postwar-governance would create a suzerain cycle."
      }
    };
  }
  const preview = computeM3PostwarGovernancePreview({
    world,
    m3,
    victorPolityId,
    localPolityId,
    districtId,
    method: command.payload.method,
    months: 24
  });
  const nextDistrictControl =
    command.payload.method === "direct-control"
      ? { kind: "controlled" as const, controllerPolityId: victorPolityId }
      : { kind: "controlled" as const, controllerPolityId: localPolityId };
  const districts = world.state.districts.map((district) =>
    district.definitionId === districtId
      ? { definitionId: district.definitionId, control: nextDistrictControl }
      : district
  );
  const polities = m3.polities.map((polity) =>
    polity.polityId === localPolityId && command.payload.method !== "direct-control"
      ? { polityId: localPolityId, directSuzerainPolityId: victorPolityId }
      : polity
  );
  const nextAdministrativeDistrict = administrativeDistrictFromPostwarPreview(preview);
  const administrativeDistricts = [
    ...m3.administrativeDistricts.filter((entry) => entry.districtId !== districtId),
    nextAdministrativeDistrict
  ];
  const obligationBuild = buildPostwarObligations({
    world,
    m3,
    command,
    preview,
    victorPolityId,
    localPolityId
  });
  const enfeoffments =
    command.payload.method === "restore-vassal-ruler" &&
    command.payload.localRulerCharacterId !== null &&
    command.payload.policyId !== null
      ? [
          ...m3.enfeoffments.filter((entry) => entry.districtId !== districtId),
          {
            districtId,
            holderCharacterId: parsePersonId(command.payload.localRulerCharacterId),
            grantedByPolityId: victorPolityId,
            policyId: parseM3PolicyId(command.payload.policyId),
            grantedDay: world.meta.currentDay,
            reasonCode: command.payload.reasonCode
          }
        ]
      : m3.enfeoffments.filter((entry) => entry.districtId !== districtId);

  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    polities,
    administrativeDistricts,
    obligations: [...m3.obligations, ...obligationBuild.obligations],
    obligationAuditEvents: [...m3.obligationAuditEvents, ...obligationBuild.auditEvents],
    enfeoffments
  });
  const nextWorld = commitRuntimeState(world, { ...world.state, districts, m3: nextM3 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.m3-postwar-governance-applied",
          commandId: command.commandId,
          actor: command.actor,
          settlementId: command.payload.settlementId,
          method: command.payload.method,
          victorPolityId,
          localPolityId,
          districtId,
          obligationIds: obligationBuild.obligations.map((obligation) => obligation.id),
          administrativeLoad: preview.administrativeBurden.administrativeLoad,
          reasonCodes: preview.reasonCodes,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: []
    }
  };
}

function evaluateProposeDiplomaticAgreement(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.propose-diplomatic-agreement" }>
): EvaluationResult {
  const proposerPolityId = parsePolityId(command.payload.proposerPolityId);
  const targetPolityId = parsePolityId(command.payload.targetPolityId);
  const relationId = parseM6DiplomaticRelationId(command.payload.relationId);
  const agreementId = parseM6DiplomaticAgreementId(command.payload.agreementId);
  const m6 = ensureM6State(world);
  const polityError = validateM6CommandPolities(world, proposerPolityId, targetPolityId);
  if (polityError !== null) {
    return { ok: false, error: polityError };
  }
  const authorityError = validateM6PolityActorAuthority(
    world,
    command.actor,
    proposerPolityId,
    "sim.propose-diplomatic-agreement"
  );
  if (authorityError !== null) {
    return { ok: false, error: authorityError };
  }
  if (m6.agreements.some((agreement) => agreement.agreementId === agreementId)) {
    return {
      ok: false,
      error: {
        code: "diplomacy-state-invalid",
        path: "payload.agreementId",
        message: "sim.propose-diplomatic-agreement agreementId already exists."
      }
    };
  }

  const relation = findM6Relation(m6, proposerPolityId, targetPolityId);
  const nextRelation =
    relation ?? createM6Relation(command, relationId, proposerPolityId, targetPolityId);
  const agreement: M6DiplomaticAgreementStateV0 = {
    agreementId,
    relationId: nextRelation.relationId,
    proposerPolityId,
    targetPolityId,
    agreementKind: command.payload.agreementKind,
    status: "proposed",
    startDay: parseGameDay(world.meta.currentDay),
    endDay: parseGameDay(world.meta.currentDay + command.payload.durationDays),
    recognitionDirection: command.payload.recognitionDirection,
    reasonCodes: [command.payload.reasonCode]
  };
  const nextM6: M6DiplomacyLegitimacyStateV0 = {
    ...m6,
    relations:
      relation === undefined
        ? [...m6.relations, nextRelation]
        : m6.relations.map((entry) =>
            entry.relationId === relation.relationId
              ? { ...entry, updatedDay: parseGameDay(world.meta.currentDay) }
              : entry
          ),
    agreements: [...m6.agreements, agreement]
  };
  const nextWorld = commitRuntimeState(world, { ...world.state, m6: nextM6 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }
  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.m6-diplomatic-agreement-proposed",
          commandId: command.commandId,
          actor: command.actor,
          relationId,
          agreementId,
          proposerPolityId,
          targetPolityId,
          agreementKind: agreement.agreementKind,
          reasonCodes: agreement.reasonCodes,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m6-diplomacy-updated",
          relationId,
          agreementId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateAnswerDiplomaticAgreement(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.answer-diplomatic-agreement" }>
): EvaluationResult {
  const m6 = world.state.m6;
  if (m6 === undefined) {
    return m6MissingError("sim.answer-diplomatic-agreement");
  }
  const agreementId = parseM6DiplomaticAgreementId(command.payload.agreementId);
  const agreement = m6.agreements.find((entry) => entry.agreementId === agreementId);
  if (agreement === undefined) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.agreementId",
        message: "sim.answer-diplomatic-agreement references a missing agreement."
      }
    };
  }
  const authorityError = validateM6PolityActorAuthority(
    world,
    command.actor,
    agreement.targetPolityId,
    "sim.answer-diplomatic-agreement"
  );
  if (authorityError !== null) {
    return { ok: false, error: authorityError };
  }
  if (agreement.status !== "proposed") {
    return {
      ok: false,
      error: {
        code: "diplomacy-state-invalid",
        path: "payload.agreementId",
        message: "sim.answer-diplomatic-agreement requires a proposed agreement."
      }
    };
  }
  const nextStatus: M6DiplomaticAgreementStateV0["status"] = command.payload.accepted
    ? "active"
    : "rejected";
  const recognition = command.payload.accepted ? recognitionEdgeFromAgreement(agreement) : null;
  if (recognition !== null && wouldCreateM6RecognitionCycle(m6.recognitionEdges, recognition)) {
    return {
      ok: false,
      error: {
        code: "diplomacy-cycle",
        path: "payload.agreementId",
        message: "sim.answer-diplomatic-agreement would create a recognition cycle."
      }
    };
  }
  const nextM6: M6DiplomacyLegitimacyStateV0 = {
    ...m6,
    agreements: m6.agreements.map((entry) =>
      entry.agreementId === agreementId
        ? {
            ...entry,
            status: nextStatus,
            reasonCodes: sortedUniqueText([...entry.reasonCodes, command.payload.reasonCode])
          }
        : entry
    ),
    recognitionEdges:
      recognition === null ? m6.recognitionEdges : [...m6.recognitionEdges, recognition]
  };
  const nextWorld = commitRuntimeState(world, { ...world.state, m6: nextM6 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }
  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.m6-diplomatic-agreement-answered",
          commandId: command.commandId,
          actor: command.actor,
          agreementId,
          statusAfter: nextStatus,
          recognitionCreated: recognition !== null,
          reasonCodes: [command.payload.reasonCode],
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m6-diplomacy-updated",
          relationId: agreement.relationId,
          agreementId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateRecordLegitimacySource(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-legitimacy-source" }>
): EvaluationResult {
  const m6 = ensureM6State(world);
  const sourceId = parseM6LegitimacySourceId(command.payload.sourceId);
  const polityId = parsePolityId(command.payload.polityId);
  const authorityError = validateM6LegitimacyActorAuthority(command.actor);
  if (authorityError !== null) {
    return { ok: false, error: authorityError };
  }
  if (!world.definitions.polities.some((polity) => polity.id === polityId)) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.polityId",
        message: "sim.record-legitimacy-source references a missing PolityId."
      }
    };
  }
  if (m6.legitimacySources.some((source) => source.sourceId === sourceId)) {
    return {
      ok: false,
      error: {
        code: "diplomacy-state-invalid",
        path: "payload.sourceId",
        message: "sim.record-legitimacy-source sourceId already exists."
      }
    };
  }
  const source: M6LegitimacySourceStateV0 = {
    sourceId,
    polityId,
    audience: command.payload.audience,
    sourceKind: command.payload.sourceKind,
    magnitudeBps: command.payload.magnitudeBps,
    sourceRef: command.payload.sourceRef,
    reasonCode: command.payload.reasonCode,
    createdDay: parseGameDay(world.meta.currentDay)
  };
  const profile = recalculateM6LegitimacyProfile(
    [...m6.legitimacySources, source],
    polityId,
    source.audience
  );
  const nextM6: M6DiplomacyLegitimacyStateV0 = {
    ...m6,
    legitimacySources: [...m6.legitimacySources, source],
    legitimacyProfiles: [
      ...m6.legitimacyProfiles.filter(
        (entry) => !(entry.polityId === polityId && entry.audience === source.audience)
      ),
      profile
    ]
  };
  const nextWorld = commitRuntimeState(world, { ...world.state, m6: nextM6 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }
  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.m6-legitimacy-source-recorded",
          commandId: command.commandId,
          actor: command.actor,
          sourceId,
          polityId,
          audience: source.audience,
          magnitudeBps: source.magnitudeBps,
          scoreAfterBps: profile.scoreBps,
          reasonCodes: [source.reasonCode],
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m6-legitimacy-updated",
          polityId,
          audience: source.audience,
          scoreBps: profile.scoreBps,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function appendM6SuccessionLegitimacySource(
  m6: M6DiplomacyLegitimacyStateV0,
  world: WorldStateV0,
  polityId: PolityId,
  crisis: M3SuccessionCrisisStateV0
): {
  readonly nextM6: M6DiplomacyLegitimacyStateV0;
  readonly source: M6LegitimacySourceStateV0;
  readonly profile: M6LegitimacyProfileStateV0;
} {
  const source: M6LegitimacySourceStateV0 = {
    sourceId: parseM6LegitimacySourceId(nextM6LegitimacySourceId(m6.legitimacySources)),
    polityId,
    audience: "vassal-rulers",
    sourceKind: "succession-continuity",
    magnitudeBps: m6SuccessionLegitimacyMagnitudeBps(crisis),
    sourceRef: `m3.succession.${crisis.id}`,
    reasonCode: m6SuccessionLegitimacyReasonCode(crisis),
    createdDay: parseGameDay(world.meta.currentDay)
  };
  const profile = recalculateM6LegitimacyProfile(
    [...m6.legitimacySources, source],
    polityId,
    source.audience
  );
  return {
    nextM6: {
      ...m6,
      legitimacySources: [...m6.legitimacySources, source],
      legitimacyProfiles: [
        ...m6.legitimacyProfiles.filter(
          (entry) => !(entry.polityId === polityId && entry.audience === source.audience)
        ),
        profile
      ]
    },
    source,
    profile
  };
}

function nextM6LegitimacySourceId(values: readonly M6LegitimacySourceStateV0[]): number {
  const maxId = values.reduce((max, value) => Math.max(max, value.sourceId), 0);
  return maxId + 1;
}

function m6SuccessionLegitimacyMagnitudeBps(crisis: M3SuccessionCrisisStateV0): number {
  switch (crisis.outcome?.kind) {
    case "peaceful":
      return 700;
    case "regency":
      return 300;
    case "disputed":
      return -700;
    case undefined:
      return 0;
  }
}

function m6SuccessionLegitimacyReasonCode(crisis: M3SuccessionCrisisStateV0): string {
  switch (crisis.outcome?.kind) {
    case "peaceful":
      return "legitimacy.source.succession-continuity";
    case "regency":
      return "legitimacy.source.succession-regency";
    case "disputed":
      return "legitimacy.source.succession-disputed";
    case undefined:
      return "legitimacy.source.succession-unresolved";
  }
}

function ensureM6State(world: WorldStateV0): M6DiplomacyLegitimacyStateV0 {
  return (
    world.state.m6 ?? {
      schemaVersion: 1,
      relations: [],
      agreements: [],
      recognitionEdges: [],
      legitimacySources: [],
      legitimacyProfiles: []
    }
  );
}

function m6MissingError(commandKind: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "diplomacy-state-invalid",
      path: "state.m6",
      message: `${commandKind} requires an M6 diplomacy legitimacy state.`
    }
  };
}

function validateM6CommandPolities(
  world: WorldStateV0,
  proposerPolityId: PolityId,
  targetPolityId: PolityId
): DomainErrorV1 | null {
  if (!world.definitions.polities.some((polity) => polity.id === proposerPolityId)) {
    return {
      code: "bad-id",
      path: "payload.proposerPolityId",
      message: "M6 diplomacy command references a missing proposer PolityId."
    };
  }
  if (!world.definitions.polities.some((polity) => polity.id === targetPolityId)) {
    return {
      code: "bad-id",
      path: "payload.targetPolityId",
      message: "M6 diplomacy command references a missing target PolityId."
    };
  }
  if (proposerPolityId === targetPolityId) {
    return {
      code: "diplomacy-state-invalid",
      path: "payload.targetPolityId",
      message: "M6 diplomacy command requires different polities."
    };
  }
  return null;
}

function findM6Relation(
  m6: M6DiplomacyLegitimacyStateV0,
  leftPolityId: PolityId,
  rightPolityId: PolityId
): M6DiplomaticRelationStateV0 | undefined {
  const low = Math.min(leftPolityId, rightPolityId);
  const high = Math.max(leftPolityId, rightPolityId);
  return m6.relations.find((relation) => relation.polityAId === low && relation.polityBId === high);
}

function createM6Relation(
  command: Extract<GameCommandV1, { readonly kind: "sim.propose-diplomatic-agreement" }>,
  relationId: ReturnType<typeof parseM6DiplomaticRelationId>,
  proposerPolityId: PolityId,
  targetPolityId: PolityId
): M6DiplomaticRelationStateV0 {
  return {
    relationId,
    polityAId: parsePolityId(Math.min(proposerPolityId, targetPolityId)),
    polityBId: parsePolityId(Math.max(proposerPolityId, targetPolityId)),
    trustBps: 5_000,
    affinityBps: 5_000,
    fearBps: 0,
    threatBps: 0,
    interestAlignmentBps: 5_000,
    historicalDebt: 0,
    borderConflictBps: 0,
    updatedDay: parseGameDay(command.expectedDay),
    reasonCodes: [command.payload.reasonCode]
  };
}

function recognitionEdgeFromAgreement(
  agreement: M6DiplomaticAgreementStateV0
): M6RecognitionEdgeStateV0 | null {
  switch (agreement.recognitionDirection) {
    case "none":
      return null;
    case "proposer-recognizes-target":
      return {
        fromPolityId: agreement.proposerPolityId,
        toPolityId: agreement.targetPolityId,
        agreementId: agreement.agreementId,
        reasonCode: "diplomacy.recognition.accepted"
      };
    case "target-recognizes-proposer":
      return {
        fromPolityId: agreement.targetPolityId,
        toPolityId: agreement.proposerPolityId,
        agreementId: agreement.agreementId,
        reasonCode: "diplomacy.recognition.accepted"
      };
  }
}

function wouldCreateM6RecognitionCycle(
  edges: readonly M6RecognitionEdgeStateV0[],
  nextEdge: M6RecognitionEdgeStateV0
): boolean {
  return hasM6RecognitionPath([...edges, nextEdge], nextEdge.toPolityId, nextEdge.fromPolityId);
}

function hasM6RecognitionPath(
  edges: readonly M6RecognitionEdgeStateV0[],
  startPolityId: number,
  targetPolityId: number
): boolean {
  const visited = new Set<number>();
  const pending = [startPolityId];
  while (pending.length > 0) {
    const current = pending.shift();
    if (current === undefined || visited.has(current)) {
      continue;
    }
    if (current === targetPolityId) {
      return true;
    }
    visited.add(current);
    const next = edges
      .filter((edge) => edge.fromPolityId === current)
      .sort(
        (left, right) => left.toPolityId - right.toPolityId || left.agreementId - right.agreementId
      )
      .map((edge) => edge.toPolityId);
    pending.push(...next);
  }
  return false;
}

function recalculateM6LegitimacyProfile(
  sources: readonly M6LegitimacySourceStateV0[],
  polityId: PolityId,
  audience: M6LegitimacyAudienceV0
): M6LegitimacyProfileStateV0 {
  const scopedSources = sources
    .filter((source) => source.polityId === polityId && source.audience === audience)
    .sort((left, right) => left.createdDay - right.createdDay || left.sourceId - right.sourceId);
  const rawScore = scopedSources.reduce((total, source) => total + source.magnitudeBps, 0);
  const scoreBps = clampM6Bps(rawScore);
  return {
    polityId,
    audience,
    scoreBps,
    pressureBps: clampM6Bps(10_000 - scoreBps),
    sourceIds: scopedSources.map((source) => source.sourceId),
    reasonCodes: sortedUniqueText(scopedSources.map((source) => source.reasonCode))
  };
}

function clampM6Bps(value: number): number {
  if (value < 0) {
    return 0;
  }
  if (value > 10_000) {
    return 10_000;
  }
  return value;
}

function sortedUniqueText(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareText);
}

function evaluateChoosePolicyEventOption(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.choose-policy-event-option" }>
): EvaluationResult {
  const runtime = world.state.m6PolicyEvents;
  if (runtime === undefined) {
    return policyEventError("state.m6PolicyEvents", "M6 policy/event runtime state is missing.");
  }
  if (command.actor.kind === "system") {
    return {
      ok: false,
      error: {
        code: "authority-denied",
        path: "actor.kind",
        message: "sim.choose-policy-event-option requires player or AI command authority."
      }
    };
  }

  const eventInstanceId = parseM6PolicyEventInstanceId(command.payload.eventInstanceId);
  const activeEvent = runtime.activeEvents.find(
    (event) => event.eventInstanceId === eventInstanceId
  );
  if (activeEvent === undefined) {
    return policyEventError(
      "payload.eventInstanceId",
      "sim.choose-policy-event-option references a missing active event."
    );
  }
  const definition = runtime.definitions.events.find(
    (event) => event.eventDefinitionId === activeEvent.eventDefinitionId
  );
  if (definition === undefined) {
    return policyEventError(
      "state.m6PolicyEvents.definitions.events",
      "Active policy event references a missing definition."
    );
  }
  const option = definition.options.find((entry) => entry.optionId === command.payload.optionId);
  if (option === undefined) {
    return policyEventError(
      "payload.optionId",
      "sim.choose-policy-event-option references an option not offered by the active event."
    );
  }

  let nextModifierId = runtime.nextModifierId;
  const modifiers: M6PolicyEventRuntimeStateV0["policyModifiers"][number][] =
    option.consequences.map((consequence) => {
      const modifier = {
        modifierId: parseM6PolicyModifierId(nextModifierId),
        policyId: consequence.policyId,
        eventInstanceId,
        magnitudeBps: consequence.magnitudeBps,
        startDay: world.meta.currentDay,
        endDay: parseGameDay(world.meta.currentDay + consequence.durationDays),
        reasonCode: consequence.reasonCode
      };
      nextModifierId += 1;
      return modifier;
    });
  const resolvedEvent: M6PolicyEventRuntimeStateV0["resolvedEvents"][number] = {
    eventInstanceId,
    eventDefinitionId: activeEvent.eventDefinitionId,
    selectedOptionId: command.payload.optionId,
    resolvedDay: world.meta.currentDay,
    reasonCodes: sortedUniqueText([
      command.payload.reasonCode,
      ...definition.reasonCodes,
      ...option.reasonCodes,
      ...option.consequences.map((consequence) => consequence.reasonCode)
    ])
  };
  const nextRuntime = canonicalizeM6PolicyEventRuntimeStateV0({
    ...runtime,
    activeEvents: runtime.activeEvents.filter((event) => event.eventInstanceId !== eventInstanceId),
    resolvedEvents: [...runtime.resolvedEvents, resolvedEvent],
    policyModifiers: [...runtime.policyModifiers, ...modifiers],
    nextModifierId
  });
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    m6PolicyEvents: nextRuntime
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  const event: DomainEventV1 = {
    schemaVersion: 1,
    kind: "sim.m6-policy-event-option-chosen",
    commandId: command.commandId,
    actor: command.actor,
    eventInstanceId,
    eventDefinitionId: activeEvent.eventDefinitionId,
    selectedOptionId: command.payload.optionId,
    causeReasonCodes: activeEvent.causeReasonCodes,
    optionReasonCodes: option.reasonCodes,
    consequenceReasonCodes: option.consequences.map((consequence) => consequence.reasonCode),
    encyclopediaRefs: sortedUniqueText([
      ...definition.encyclopediaRefs,
      ...option.encyclopediaRefs
    ]),
    revisionBefore: world.meta.revision,
    revisionAfter: nextWorld.meta.revision
  };

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      events: [event],
      deltas: [],
      wouldChangeState: true
    }
  };
}

function policyEventError(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "policy-event-state-invalid",
      path,
      message
    }
  };
}

function evaluateM6AlphaOutcome(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.evaluate-m6-alpha-outcome" }>
): EvaluationResult {
  const polityId = parsePolityId(command.payload.polityId);
  if (!world.definitions.polities.some((polity) => polity.id === polityId)) {
    return badIdError(
      "payload.polityId",
      "sim.evaluate-m6-alpha-outcome references a missing polity."
    );
  }
  if (!actorCanEvaluateM6AlphaOutcome(command.actor, polityId)) {
    return authorityDeniedError();
  }
  const terminalStateId = parseM6AlphaTerminalStateId(command.payload.terminalStateId);
  const runtime = world.state.m6Alpha ?? createM6AlphaRuntimeStateV0();
  if (runtime.terminalStates.some((terminal) => terminal.terminalStateId === terminalStateId)) {
    return {
      ok: false,
      error: {
        code: "alpha-terminal-state-invalid",
        path: "payload.terminalStateId",
        message: "sim.evaluate-m6-alpha-outcome terminalStateId has already been recorded."
      }
    };
  }

  const terminalState = buildM6AlphaTerminalState(world, command, terminalStateId, polityId);
  const nextRuntime = canonicalizeM6AlphaRuntimeStateV0({
    ...runtime,
    terminalStates: [...runtime.terminalStates, terminalState]
  });
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    m6Alpha: nextRuntime
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.m6-alpha-terminal-state-recorded",
          commandId: command.commandId,
          actor: command.actor,
          terminalStateId,
          polityId,
          outcome: terminalState.outcome,
          reasonCodes: terminalState.reasonCodes,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m6-alpha-terminal-updated",
          terminalStateId,
          polityId,
          outcome: terminalState.outcome,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ],
      wouldChangeState: true
    }
  };
}

function actorCanEvaluateM6AlphaOutcome(actor: CommandActorV1, polityId: PolityId): boolean {
  if (actor.kind === "system") {
    return true;
  }
  return actor.id === `polity:${polityId}`;
}

function buildM6AlphaTerminalState(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.evaluate-m6-alpha-outcome" }>,
  terminalStateId: M6AlphaTerminalStateV0["terminalStateId"],
  polityId: PolityId
): M6AlphaTerminalStateV0 {
  const evidence = buildM6AlphaTerminalEvidence(world, polityId);
  const maxDay = parseGameDay(command.payload.maxDay);
  const hasVictoryEvidence =
    evidence.recognizedByCount > 0 &&
    evidence.legitimacyScoreBps >= 1_000 &&
    evidence.postwarArrangementCount > 0 &&
    evidence.resolvedPolicyEventCount > 0 &&
    evidence.successionResolvedCount > 0 &&
    evidence.routeCount > 0 &&
    evidence.populationGroupCount > 0;
  const outcome: M6AlphaTerminalOutcomeV0 = hasVictoryEvidence
    ? "victory"
    : world.meta.currentDay > maxDay
      ? "defeat"
      : "continued-play";
  return {
    terminalStateId,
    polityId,
    outcome,
    evaluatedDay: world.meta.currentDay,
    evaluatedRevision: world.meta.revision,
    maxDay,
    evidence,
    reasonCodes: sortedUniqueText([
      command.payload.reasonCode,
      `m6.alpha.outcome.${outcome}`,
      ...m6AlphaEvidenceReasonCodes(evidence)
    ])
  };
}

function buildM6AlphaTerminalEvidence(
  world: WorldStateV0,
  polityId: PolityId
): M6AlphaTerminalStateV0["evidence"] {
  const recognized = buildM6RecognizedOrderReadModel(
    { world, acceptedCommandIds: [], commandTail: [], eventTail: [] },
    polityId
  );
  return {
    recognizedByCount: recognized.recognizedByCount,
    legitimacyScoreBps: recognized.legitimacyScoreBps,
    postwarArrangementCount: countM6AlphaPostwarArrangementEvidence(world, polityId),
    resolvedPolicyEventCount: world.state.m6PolicyEvents?.resolvedEvents.length ?? 0,
    successionResolvedCount:
      world.state.m3?.successionCrises.filter(
        (crisis) => crisis.polityId === polityId && crisis.status === "resolved"
      ).length ?? 0,
    routeCount: world.definitions.routes.length,
    populationGroupCount: world.state.m2?.populationGroups.length ?? 0
  };
}

function countM6AlphaPostwarArrangementEvidence(world: WorldStateV0, polityId: PolityId): number {
  const settlementIds: string[] = [];
  for (const candidate of world.state.m4?.postwarCandidates ?? []) {
    if (candidate.victorPolityId === polityId) {
      settlementIds.push(candidate.settlementId);
    }
  }
  for (const obligation of world.state.m3?.obligations ?? []) {
    if (obligation.creditorPolityId !== polityId) {
      continue;
    }
    const settlementId = m3PostwarSettlementIdFromSourceId(obligation.obligationSource.sourceId);
    if (settlementId !== null) {
      settlementIds.push(settlementId);
    }
  }
  return sortedUniqueText(settlementIds).length;
}

function m3PostwarSettlementIdFromSourceId(sourceId: string): string | null {
  const directMarker = ".direct-control.";
  const directMarkerIndex = sourceId.indexOf(directMarker);
  if (sourceId.startsWith("m3.postwar.district.") && directMarkerIndex >= 0) {
    const settlementId = sourceId.slice(directMarkerIndex + directMarker.length);
    return settlementId.length > 0 ? settlementId : null;
  }
  const prefix = "m3.postwar.";
  if (!sourceId.startsWith(prefix)) {
    return null;
  }
  const suffixes = [".tribute", ".troops"];
  const remainder = sourceId.slice(prefix.length);
  for (const suffix of suffixes) {
    if (remainder.endsWith(suffix)) {
      const settlementId = remainder.slice(0, -suffix.length);
      return settlementId.length > 0 ? settlementId : null;
    }
  }
  return remainder.length > 0 ? remainder : null;
}

function m6AlphaEvidenceReasonCodes(
  evidence: M6AlphaTerminalStateV0["evidence"]
): readonly string[] {
  const reasonCodes: string[] = [];
  if (evidence.recognizedByCount > 0) {
    reasonCodes.push("m6.alpha.evidence.recognition");
  }
  if (evidence.legitimacyScoreBps >= 1_000) {
    reasonCodes.push("m6.alpha.evidence.legitimacy");
  }
  if (evidence.postwarArrangementCount > 0) {
    reasonCodes.push("m6.alpha.evidence.postwar");
  }
  if (evidence.resolvedPolicyEventCount > 0) {
    reasonCodes.push("m6.alpha.evidence.policy-event");
  }
  if (evidence.successionResolvedCount > 0) {
    reasonCodes.push("m6.alpha.evidence.succession");
  }
  if (evidence.routeCount > 0) {
    reasonCodes.push("m6.alpha.evidence.routes");
  }
  if (evidence.populationGroupCount > 0) {
    reasonCodes.push("m6.alpha.evidence.economy");
  }
  return reasonCodes;
}

function evaluateCreateCampaignObjective(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.create-campaign-objective" }>
): EvaluationResult {
  const m4 = world.state.m4 ?? createM4CampaignStateV0(world.definitions);
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  if (m4.campaignPlans.some((plan) => plan.id === campaignPlanId)) {
    return rejectCampaignObjective("payload.campaignPlanId", "CampaignPlanId already exists.");
  }

  const validationError = validateCampaignObjectivePayload(world, {
    target: command.payload.target,
    owner: command.payload.owner,
    startWindow: command.payload.startWindow
  });
  if (validationError !== null) {
    return validationError;
  }

  const plan: M4CampaignPlanStateV0 = {
    id: campaignPlanId,
    owner: commandOwnerToM4(command.payload.owner),
    target: commandTargetToM4(command.payload.target),
    objectiveKind: command.payload.objectiveKind,
    startWindow: {
      earliestDay: parseGameDay(command.payload.startWindow.earliestDay),
      latestDay: parseGameDay(command.payload.startWindow.latestDay)
    },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: [...command.payload.reasonCodes].sort(compareText),
    createdDay: world.meta.currentDay,
    updatedDay: world.meta.currentDay
  };

  return acceptM4CampaignState(world, command, {
    ...m4,
    campaignPlans: [...m4.campaignPlans, plan]
  });
}

function evaluateUpdateCampaignObjective(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.update-campaign-objective" }>
): EvaluationResult {
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectCampaignObjective("state.m4", "M4 campaign state is missing.");
  }
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  const existing = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (existing === undefined) {
    return rejectCampaignObjective("payload.campaignPlanId", "CampaignPlanId does not exist.");
  }
  if (existing.status === "cancelled" || existing.status === "completed") {
    return rejectCampaignObjective("payload.campaignPlanId", "CampaignPlan is no longer editable.");
  }

  const validationError = validateCampaignObjectivePayload(world, {
    target: command.payload.target,
    startWindow: command.payload.startWindow
  });
  if (validationError !== null) {
    return validationError;
  }

  const updatedPlan: M4CampaignPlanStateV0 = {
    ...existing,
    target: commandTargetToM4(command.payload.target),
    objectiveKind: command.payload.objectiveKind,
    startWindow: {
      earliestDay: parseGameDay(command.payload.startWindow.earliestDay),
      latestDay: parseGameDay(command.payload.startWindow.latestDay)
    },
    statusReasonCode: "campaign.objective.updated",
    reasonCodes: [...command.payload.reasonCodes].sort(compareText),
    updatedDay: world.meta.currentDay
  };

  return acceptM4CampaignState(world, command, {
    ...m4,
    campaignPlans: m4.campaignPlans.map((plan) => (plan.id === campaignPlanId ? updatedPlan : plan))
  });
}

function evaluateCancelCampaignObjective(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.cancel-campaign-objective" }>
): EvaluationResult {
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectCampaignObjective("state.m4", "M4 campaign state is missing.");
  }
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  const existing = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (existing === undefined) {
    return rejectCampaignObjective("payload.campaignPlanId", "CampaignPlanId does not exist.");
  }
  if (existing.status === "completed") {
    return rejectCampaignObjective(
      "payload.campaignPlanId",
      "Completed CampaignPlan cannot be cancelled."
    );
  }

  const updatedPlan: M4CampaignPlanStateV0 = {
    ...existing,
    status: "cancelled",
    statusReasonCode: command.payload.reasonCode,
    reasonCodes: [...existing.reasonCodes, command.payload.reasonCode].sort(compareText),
    updatedDay: world.meta.currentDay
  };

  return acceptM4CampaignState(world, command, {
    ...m4,
    campaignPlans: m4.campaignPlans.map((plan) => (plan.id === campaignPlanId ? updatedPlan : plan))
  });
}

function evaluateCreateMusterCommitment(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.create-muster-commitment" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.create-muster-commitment");
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectMusterCommitment("state.m4", "M4 campaign state is missing.");
  }

  const commitmentId = parseMobilizedForceCommitmentId(command.payload.commitmentId);
  if (m4.mobilizedForceCommitments.some((entry) => entry.id === commitmentId)) {
    return rejectMusterCommitment("payload.commitmentId", "MobilizedForceCommitmentId exists.");
  }
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return badIdError("payload.campaignPlanId", "Muster commitment references missing campaign.");
  }
  if (campaignPlan.status === "cancelled" || campaignPlan.status === "completed") {
    return rejectMusterCommitment("payload.campaignPlanId", "CampaignPlan cannot accept muster.");
  }

  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null) {
    return rejectMusterCommitment(
      "payload.campaignPlanId",
      "Campaign owner polity is unavailable."
    );
  }
  if (!actorHasPolityAuthority(m3, command.actor, ownerPolityId)) {
    return authorityDeniedError();
  }

  const obligation = m3.obligations.find(
    (entry) => entry.id === command.payload.source.obligationId
  );
  if (obligation === undefined) {
    return badIdError(
      "payload.source.obligationId",
      "Muster commitment references missing M3ObligationId."
    );
  }
  const sourceError = validateMusterSourceObligation(
    world,
    m4,
    campaignPlan,
    obligation,
    command.payload.promisedTroops,
    command.payload.dueDay
  );
  if (sourceError !== null) {
    return { ok: false, error: sourceError };
  }
  const windowError = validateMusterAssemblyWindow(
    command.payload.assemblyWindow,
    command.payload.dueDay
  );
  if (windowError !== null) {
    return { ok: false, error: windowError };
  }

  const plannedAssemblyDay = deterministicMusterAssemblyDay(command.payload.assemblyWindow);
  const localCostHooks = musterLocalCostHooks(m3, obligation, command.payload.promisedTroops);
  const commitment: M4MobilizedForceCommitmentStateV0 = {
    id: commitmentId,
    campaignPlanId,
    source: {
      kind: "m3-obligation",
      obligationId: obligation.id,
      debtorPolityId: obligation.debtorPolityId,
      creditorPolityId: obligation.creditorPolityId
    },
    promisedTroops: command.payload.promisedTroops,
    dueDay: parseGameDay(command.payload.dueDay),
    assemblyWindow: {
      earliestDay: parseGameDay(command.payload.assemblyWindow.earliestDay),
      latestDay: parseGameDay(command.payload.assemblyWindow.latestDay)
    },
    plannedAssemblyDay,
    assembledTroops: 0,
    delayedTroops: 0,
    refusedTroops: 0,
    releasedTroops: 0,
    status: "promised",
    statusReasonCode: "muster.commitment.promised",
    reasonCodes: [
      ...command.payload.reasonCodes,
      ...localCostHooks.map((hook) => hook.reasonCode)
    ].sort(compareText),
    localCostHooks
  };

  return acceptM4CampaignState(world, command, {
    ...m4,
    mobilizedForceCommitments: [...m4.mobilizedForceCommitments, commitment]
  });
}

function evaluateRecordMusterResponse(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-muster-response" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.record-muster-response");
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectMusterCommitment("state.m4", "M4 campaign state is missing.");
  }

  const commitmentId = parseMobilizedForceCommitmentId(command.payload.commitmentId);
  const commitment = m4.mobilizedForceCommitments.find((entry) => entry.id === commitmentId);
  if (commitment === undefined) {
    return badIdError(
      "payload.commitmentId",
      "sim.record-muster-response references missing commitment."
    );
  }
  if (commitment.status === "released" || commitment.status === "refused") {
    return rejectMusterCommitment(
      "payload.commitmentId",
      "Muster commitment is already terminally settled."
    );
  }

  const responseError = validateMusterResponsePayload(commitment, command);
  if (responseError !== null) {
    return { ok: false, error: responseError };
  }
  const isReleaseAdvance = command.payload.releasedTroops > commitment.releasedTroops;
  const actingPolityId = isReleaseAdvance
    ? commitment.source.creditorPolityId
    : commitment.source.debtorPolityId;
  if (!actorHasPolityAuthority(m3, command.actor, actingPolityId)) {
    return authorityDeniedError();
  }

  const nextStatus = deriveMusterCommitmentStatus(command.payload, commitment.promisedTroops);
  const updatedCommitment: M4MobilizedForceCommitmentStateV0 = {
    ...commitment,
    assembledTroops: command.payload.assembledTroops,
    delayedTroops: command.payload.delayedTroops,
    refusedTroops: command.payload.refusedTroops,
    releasedTroops: command.payload.releasedTroops,
    status: nextStatus,
    statusReasonCode: command.payload.reasonCodes[0] ?? commitment.statusReasonCode,
    reasonCodes: [...commitment.reasonCodes, ...command.payload.reasonCodes].sort(compareText)
  };

  return acceptM4CampaignState(world, command, {
    ...m4,
    mobilizedForceCommitments: m4.mobilizedForceCommitments.map((entry) =>
      entry.id === commitmentId ? updatedCommitment : entry
    )
  });
}

function acceptM4CampaignState(
  world: WorldStateV0,
  command: GameCommandV1,
  m4: M4CampaignStateV0,
  buildEvents: (nextWorld: WorldStateV0) => readonly DomainEventV1[] = () => [],
  buildDeltas: (nextWorld: WorldStateV0) => readonly StateDeltaV1[] = () => []
): EvaluationResult {
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    m4: canonicalizeM4CampaignStateV0(m4)
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      events: buildEvents(nextWorld),
      deltas: buildDeltas(nextWorld),
      wouldChangeState: nextWorld.meta.stateHash !== world.meta.stateHash
    }
  };
}

function acceptM4CampaignAndM2State(
  world: WorldStateV0,
  command: GameCommandV1,
  m2: M2EconomyPopulationStateV0,
  m4: M4CampaignStateV0,
  buildEvents: (nextWorld: WorldStateV0) => readonly DomainEventV1[] = () => [],
  buildDeltas: (nextWorld: WorldStateV0) => readonly StateDeltaV1[] = () => []
): EvaluationResult {
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    m2,
    m4: canonicalizeM4CampaignStateV0(m4)
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      events: buildEvents(nextWorld),
      deltas: buildDeltas(nextWorld),
      wouldChangeState: nextWorld.meta.stateHash !== world.meta.stateHash
    }
  };
}

function m2PopulationGroupDelta(
  nextWorld: WorldStateV0,
  group: M2PopulationGroupStateV0
): Extract<StateDeltaV1, { readonly kind: "state.m2-population-group-updated" }> {
  const committedLabor = group.committedLabor.reduce(
    (sum, commitment) => sum + commitment.laborAmount,
    0
  );
  return {
    schemaVersion: 1,
    kind: "state.m2-population-group-updated",
    populationGroupId: group.id,
    availableLabor: group.availableLabor,
    committedLabor,
    grainStock: group.grainStock,
    cashStock: group.cashStock,
    revision: nextWorld.meta.revision,
    stateHash: nextWorld.meta.stateHash
  };
}

function allocateM4GrainSupplySources(input: {
  readonly world: WorldStateV0;
  readonly m2: M2EconomyPopulationStateV0;
  readonly ownerPolityId: PolityId;
  readonly requestedAmount: number;
}): {
  readonly allocatedAmount: number;
  readonly allocations: readonly {
    readonly group: M2PopulationGroupStateV0;
    readonly amount: number;
  }[];
} {
  let remainingAmount = input.requestedAmount;
  const allocations: { readonly group: M2PopulationGroupStateV0; readonly amount: number }[] = [];
  const candidates = input.m2.populationGroups
    .filter((group) => {
      const district = input.world.state.districts.find(
        (entry) => entry.definitionId === group.districtId
      );
      return (
        group.grainStock > 0 &&
        district?.control.kind === "controlled" &&
        district.control.controllerPolityId === input.ownerPolityId
      );
    })
    .sort(
      (left, right) =>
        left.districtId - right.districtId ||
        left.id - right.id ||
        left.grainStock - right.grainStock
    );

  for (const group of candidates) {
    if (remainingAmount === 0) {
      break;
    }
    const amount = group.grainStock < remainingAmount ? group.grainStock : remainingAmount;
    allocations.push({ group, amount });
    remainingAmount -= amount;
  }

  return {
    allocatedAmount: input.requestedAmount - remainingAmount,
    allocations
  };
}

function createM4GrainSupplyReservation(input: {
  readonly reservationId: ReturnType<typeof parseGrainSupplyReservationId>;
  readonly campaignPlanId: ReturnType<typeof parseCampaignPlanId>;
  readonly group: M2PopulationGroupStateV0;
  readonly amount: number;
  readonly expectedDailyConsumption: number;
  readonly reasonCodes: readonly string[];
}): M4GrainSupplyReservationStateV0 {
  return {
    reservationId: input.reservationId,
    campaignPlanId: input.campaignPlanId,
    source: {
      kind: "m2-population-group",
      populationGroupId: input.group.id,
      districtId: input.group.districtId
    },
    reservedAmount: input.amount,
    carriedAmount: input.amount,
    consumedAmount: 0,
    shortageAmount: 0,
    lossAmount: 0,
    lossReasonCode: null,
    expectedDailyConsumption: input.expectedDailyConsumption,
    expectedDaysOfSupply: floorDivide(input.amount, input.expectedDailyConsumption),
    status: "reserved",
    statusReasonCode: "grain.supply.reserved",
    reasonCodes: [...input.reasonCodes, "grain.supply.reserved"].sort(compareText)
  };
}

function applyM4GrainConsumption(input: {
  readonly reservations: readonly M4GrainSupplyReservationStateV0[];
  readonly consumedAmount: number;
  readonly lossAmount: number;
  readonly lossReasonCode: string | null;
  readonly reasonCodes: readonly string[];
}): { readonly reservations: readonly M4GrainSupplyReservationStateV0[] } {
  let remainingConsumption = input.consumedAmount;
  let remainingLoss = input.lossAmount;
  const sortedReservations = [...input.reservations].sort(
    compareM4GrainSupplyReservationForConsumption
  );
  const consumedReservations = sortedReservations.map((reservation) => {
    const consumedFromReservation =
      reservation.carriedAmount < remainingConsumption
        ? reservation.carriedAmount
        : remainingConsumption;
    remainingConsumption -= consumedFromReservation;
    const carriedAfterConsumption = reservation.carriedAmount - consumedFromReservation;
    const lossFromReservation =
      carriedAfterConsumption < remainingLoss ? carriedAfterConsumption : remainingLoss;
    remainingLoss -= lossFromReservation;
    const carriedAmount = carriedAfterConsumption - lossFromReservation;
    const consumedAmount = reservation.consumedAmount + consumedFromReservation;
    const lossAmount = reservation.lossAmount + lossFromReservation;
    return {
      ...reservation,
      carriedAmount,
      consumedAmount,
      shortageAmount: reservation.shortageAmount,
      lossAmount,
      lossReasonCode: lossAmount > 0 ? input.lossReasonCode : null,
      expectedDaysOfSupply: floorDivide(carriedAmount, reservation.expectedDailyConsumption),
      status: deriveM4GrainSupplyStatus({
        carriedAmount,
        consumedAmount,
        shortageAmount: reservation.shortageAmount,
        lossAmount
      }),
      statusReasonCode: input.reasonCodes[0] ?? reservation.statusReasonCode,
      reasonCodes: [
        ...reservation.reasonCodes,
        ...input.reasonCodes,
        ...(lossFromReservation > 0 && input.lossReasonCode !== null ? [input.lossReasonCode] : [])
      ].sort(compareText)
    };
  });
  const lastReservation = consumedReservations[consumedReservations.length - 1];
  const shortageRemainder = remainingConsumption + remainingLoss;
  if (shortageRemainder === 0 || lastReservation === undefined) {
    return { reservations: consumedReservations };
  }

  return {
    reservations: consumedReservations.map((reservation) =>
      reservation.reservationId === lastReservation.reservationId &&
      reservation.source.populationGroupId === lastReservation.source.populationGroupId
        ? {
            ...reservation,
            shortageAmount: reservation.shortageAmount + shortageRemainder,
            status: "shortage",
            statusReasonCode: "grain.supply.shortage",
            reasonCodes: [...reservation.reasonCodes, "grain.supply.shortage"].sort(compareText)
          }
        : reservation
    )
  };
}

function compareM4GrainSupplyReservationForConsumption(
  left: M4GrainSupplyReservationStateV0,
  right: M4GrainSupplyReservationStateV0
): number {
  return (
    left.campaignPlanId - right.campaignPlanId ||
    left.reservationId - right.reservationId ||
    left.source.districtId - right.source.districtId ||
    left.source.populationGroupId - right.source.populationGroupId
  );
}

function sumM4GrainReservationField(
  reservations: readonly M4GrainSupplyReservationStateV0[],
  field: "carriedAmount" | "consumedAmount" | "lossAmount" | "shortageAmount"
): number {
  return reservations.reduce((sum, reservation) => sum + reservation[field], 0);
}

function m4GrainReservationCampaignPlanId(
  reservations: readonly M4GrainSupplyReservationStateV0[]
): ReturnType<typeof parseCampaignPlanId> | null {
  const first = reservations[0];
  if (first === undefined) {
    return null;
  }
  return reservations.every((reservation) => reservation.campaignPlanId === first.campaignPlanId)
    ? first.campaignPlanId
    : null;
}

function deriveM4GrainSupplyStatus(input: {
  readonly carriedAmount: number;
  readonly consumedAmount: number;
  readonly shortageAmount: number;
  readonly lossAmount: number;
}): M4GrainSupplyReservationStatusV0 {
  if (input.shortageAmount > 0) {
    return "shortage";
  }
  if (input.carriedAmount === 0 && (input.consumedAmount > 0 || input.lossAmount > 0)) {
    return "consumed";
  }
  if (input.consumedAmount > 0 || input.lossAmount > 0) {
    return "partially-consumed";
  }
  return "reserved";
}

function plannedM4MusterTroops(m4: M4CampaignStateV0, campaignPlanId: number): number {
  return m4.mobilizedForceCommitments
    .filter((commitment) => commitment.campaignPlanId === campaignPlanId)
    .reduce((sum, commitment) => {
      const unavailableTroops = commitment.refusedTroops + commitment.releasedTroops;
      const availableTroops =
        commitment.promisedTroops > unavailableTroops
          ? commitment.promisedTroops - unavailableTroops
          : 0;
      return sum + availableTroops;
    }, 0);
}

function m4ControlledGrainSources(
  world: WorldStateV0,
  m2: M2EconomyPopulationStateV0,
  ownerPolityId: PolityId
): readonly { readonly group: M2PopulationGroupStateV0 }[] {
  return m2.populationGroups
    .filter((group) => {
      const district = world.state.districts.find(
        (entry) => entry.definitionId === group.districtId
      );
      return (
        group.grainStock > 0 &&
        district?.control.kind === "controlled" &&
        district.control.controllerPolityId === ownerPolityId
      );
    })
    .sort((left, right) => left.districtId - right.districtId || left.id - right.id)
    .map((group) => ({ group }));
}

function m4GrainForecastReasonCodes(input: {
  readonly world: WorldStateV0;
  readonly plan: M4CampaignPlanStateV0;
  readonly plannedTroops: number;
  readonly grainRequired: number;
  readonly grainReserved: number;
  readonly grainAvailableToReserve: number;
}): readonly string[] {
  const reasonCodes: string[] = [];
  if (input.plannedTroops === 0) {
    reasonCodes.push("grain.forecast.no-planned-muster");
  }
  if (input.grainReserved >= input.grainRequired && input.grainRequired > 0) {
    reasonCodes.push("grain.forecast.reserved-sufficient");
  }
  if (input.grainReserved < input.grainRequired) {
    reasonCodes.push("grain.forecast.insufficient-reserved-grain");
  }
  if (input.grainReserved + input.grainAvailableToReserve < input.grainRequired) {
    reasonCodes.push("grain.forecast.insufficient-controlled-stockpile");
  }
  if (hasM4SeasonalGrainRisk(input.world, input.plan)) {
    reasonCodes.push("grain.forecast.seasonal-risk");
  }
  return reasonCodes.sort(compareM4GrainForecastReasonCode);
}

function hasM4SeasonalGrainRisk(world: WorldStateV0, plan: M4CampaignPlanStateV0): boolean {
  const m2 = world.state.m2;
  if (m2 === undefined || plan.target.kind !== "district") {
    return false;
  }
  const targetDistrictId = plan.target.districtId;
  const seasonality = m2.transport.districtSeasonality.find(
    (entry) => entry.districtId === targetDistrictId
  );
  const curve = m2.transport.regionalCurves.find(
    (entry) => entry.id === seasonality?.regionalCurveId
  );
  const month =
    curve?.monthlyValues[getGameCalendarDate(plan.startWindow.earliestDay).monthOfYear - 1];
  return (month?.monsoonIntensityBps ?? 0) >= 7_000;
}

function compareM4GrainForecastReasonCode(left: string, right: string): number {
  return (
    m4GrainForecastReasonRank(left) - m4GrainForecastReasonRank(right) || compareText(left, right)
  );
}

function m4GrainForecastReasonRank(reasonCode: string): number {
  switch (reasonCode) {
    case "grain.forecast.no-planned-muster":
      return 1;
    case "grain.forecast.insufficient-reserved-grain":
      return 2;
    case "grain.forecast.insufficient-controlled-stockpile":
      return 3;
    case "grain.forecast.seasonal-risk":
      return 4;
    case "grain.forecast.reserved-sufficient":
      return 5;
    default:
      return 99;
  }
}

function multiplySafe(first: number, second: number, third: number): number | null {
  if (first !== 0 && second > Math.floor(Number.MAX_SAFE_INTEGER / first)) {
    return null;
  }
  const partial = first * second;
  if (partial !== 0 && third > Math.floor(Number.MAX_SAFE_INTEGER / partial)) {
    return null;
  }
  return partial * third;
}

function floorDivide(numerator: number, denominator: number): number {
  return Math.floor(numerator / denominator);
}

function rejectGrainSupply(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "grain-supply-invalid",
      path,
      message
    }
  };
}

function validateCampaignObjectivePayload(
  world: WorldStateV0,
  input: {
    readonly owner?: Extract<
      GameCommandV1,
      { readonly kind: "sim.create-campaign-objective" }
    >["payload"]["owner"];
    readonly target: Extract<
      GameCommandV1,
      { readonly kind: "sim.create-campaign-objective" }
    >["payload"]["target"];
    readonly startWindow: { readonly earliestDay: number; readonly latestDay: number };
  }
): EvaluationResult | null {
  if (input.startWindow.earliestDay > input.startWindow.latestDay) {
    return rejectCampaignObjective(
      "payload.startWindow",
      "startWindow earliestDay must be <= latestDay."
    );
  }
  if (input.owner !== undefined) {
    const ownerError = validateCampaignOwnerReference(world, input.owner);
    if (ownerError !== null) {
      return ownerError;
    }
  }
  return validateCampaignTargetReference(world, input.target);
}

function validateCampaignOwnerReference(
  world: WorldStateV0,
  owner: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-campaign-objective" }
  >["payload"]["owner"]
): EvaluationResult | null {
  switch (owner.kind) {
    case "commander":
      return world.definitions.persons.some((person) => person.id === owner.characterId)
        ? null
        : rejectCampaignObjective(
            "payload.owner.characterId",
            "Campaign owner commander is missing."
          );
    case "polity":
      return world.definitions.polities.some((polity) => polity.id === owner.polityId)
        ? null
        : rejectCampaignObjective("payload.owner.polityId", "Campaign owner polity is missing.");
  }
}

function validateCampaignTargetReference(
  world: WorldStateV0,
  target: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-campaign-objective" }
  >["payload"]["target"]
): EvaluationResult | null {
  switch (target.kind) {
    case "district":
      return world.definitions.districts.some((district) => district.id === target.districtId)
        ? null
        : rejectCampaignObjective(
            "payload.target.districtId",
            "Campaign target district is missing."
          );
    case "polity":
      return world.definitions.polities.some((polity) => polity.id === target.polityId)
        ? null
        : rejectCampaignObjective("payload.target.polityId", "Campaign target polity is missing.");
  }
}

function commandOwnerToM4(
  owner: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-campaign-objective" }
  >["payload"]["owner"]
): M4CampaignOwnerV0 {
  switch (owner.kind) {
    case "commander":
      return { kind: "commander", characterId: parsePersonId(owner.characterId) };
    case "polity":
      return { kind: "polity", polityId: parsePolityId(owner.polityId) };
  }
}

function commandTargetToM4(
  target: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-campaign-objective" }
  >["payload"]["target"]
): M4CampaignTargetV0 {
  switch (target.kind) {
    case "district":
      return { kind: "district", districtId: parseDistrictId(target.districtId) };
    case "polity":
      return { kind: "polity", polityId: parsePolityId(target.polityId) };
  }
}

function rejectCampaignObjective(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "campaign-objective-invalid",
      path,
      message
    }
  };
}

function campaignOwnerPolityId(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  owner: M4CampaignOwnerV0
): PolityId | null {
  switch (owner.kind) {
    case "polity":
      return owner.polityId;
    case "commander": {
      const character = findM3Character(m3, owner.characterId);
      return character?.polityId ?? null;
    }
  }
}

function validateMusterSourceObligation(
  world: WorldStateV0,
  m4: M4CampaignStateV0,
  campaignPlan: M4CampaignPlanStateV0,
  obligation: M3ObligationStateV0,
  promisedTroops: number,
  dueDay: number
): DomainErrorV1 | null {
  const ownerPolityId = campaignOwnerPolityIdForValidation(world, campaignPlan.owner);
  if (ownerPolityId === null || obligation.creditorPolityId !== ownerPolityId) {
    return musterCommitmentDomainError(
      "payload.source.obligationId",
      "Muster source obligation creditor must match the campaign owner polity."
    );
  }
  if (
    m4.mobilizedForceCommitments.some(
      (commitment) =>
        commitment.source.kind === "m3-obligation" &&
        commitment.source.obligationId === obligation.id &&
        commitment.dueDay === dueDay
    )
  ) {
    return musterCommitmentDomainError(
      "payload.source.obligationId",
      "Muster source obligation already has a commitment for this due day."
    );
  }
  if (
    obligation.obligationKind !== "troop" ||
    obligation.requirement.kind !== "amount" ||
    obligation.requirement.resourceKind !== "troops"
  ) {
    return musterCommitmentDomainError(
      "payload.source.obligationId",
      "Muster source must be an amount-based M3 troop obligation."
    );
  }
  if (obligation.status !== "active") {
    return musterCommitmentDomainError(
      "payload.source.obligationId",
      "Muster source obligation must be active."
    );
  }
  if (dueDay !== obligation.accounting.dueDay) {
    return musterCommitmentDomainError(
      "payload.dueDay",
      "Muster dueDay must match the source obligation due period."
    );
  }
  if (world.meta.currentDay > dueDay) {
    return musterCommitmentDomainError("payload.dueDay", "Muster source obligation is expired.");
  }
  if (promisedTroops > obligation.accounting.dueAmount - obligation.accounting.deliveredAmount) {
    return musterCommitmentDomainError(
      "payload.promisedTroops",
      "Muster promisedTroops exceeds source obligation remaining due troops."
    );
  }
  return null;
}

function campaignOwnerPolityIdForValidation(
  world: WorldStateV0,
  owner: M4CampaignOwnerV0
): PolityId | null {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return owner.kind === "polity" ? owner.polityId : null;
  }
  return campaignOwnerPolityId(m3, owner);
}

function validateMusterAssemblyWindow(
  assemblyWindow: { readonly earliestDay: number; readonly latestDay: number },
  dueDay: number
): DomainErrorV1 | null {
  if (assemblyWindow.earliestDay > assemblyWindow.latestDay) {
    return musterCommitmentDomainError(
      "payload.assemblyWindow",
      "Muster assemblyWindow earliestDay must be <= latestDay."
    );
  }
  if (assemblyWindow.latestDay > dueDay) {
    return musterCommitmentDomainError(
      "payload.assemblyWindow",
      "Muster assemblyWindow must close no later than dueDay."
    );
  }
  return null;
}

function deterministicMusterAssemblyDay(input: {
  readonly earliestDay: number;
  readonly latestDay: number;
}): ReturnType<typeof parseGameDay> {
  return parseGameDay(input.earliestDay + Math.floor((input.latestDay - input.earliestDay) / 2));
}

function musterLocalCostHooks(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  obligation: M3ObligationStateV0,
  promisedTroops: number
): M4MobilizedForceCommitmentStateV0["localCostHooks"] {
  const debtorDistrict = [...m3.administrativeDistricts]
    .filter((district) => district.polityId === obligation.debtorPolityId)
    .sort((left, right) => left.districtId - right.districtId)[0];
  const economicHooks =
    debtorDistrict === undefined
      ? []
      : [
          {
            kind: "economic-labor-reservation" as const,
            districtId: debtorDistrict.districtId,
            laborAmount: promisedTroops,
            reasonCode: "muster.cost.economic-labor-reservation"
          }
        ];
  return [
    ...economicHooks,
    {
      kind: "loyalty-pressure",
      polityId: obligation.debtorPolityId,
      pressureBps: clampBps(promisedTroops * 10),
      reasonCode: "muster.cost.loyalty-pressure"
    }
  ];
}

function validateMusterResponsePayload(
  commitment: M4MobilizedForceCommitmentStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-muster-response" }>
): DomainErrorV1 | null {
  if (command.payload.assembledTroops > commitment.promisedTroops) {
    return musterCommitmentDomainError(
      "payload.assembledTroops",
      "Muster assembledTroops must not exceed promisedTroops."
    );
  }
  if (
    command.payload.assembledTroops +
      command.payload.delayedTroops +
      command.payload.refusedTroops >
    commitment.promisedTroops
  ) {
    return musterCommitmentDomainError(
      "payload.assembledTroops",
      "Muster response totals must not exceed promisedTroops."
    );
  }
  if (command.payload.releasedTroops > command.payload.assembledTroops) {
    return musterCommitmentDomainError(
      "payload.releasedTroops",
      "Muster releasedTroops must not exceed assembledTroops."
    );
  }
  if (
    command.payload.assembledTroops < commitment.assembledTroops ||
    command.payload.refusedTroops < commitment.refusedTroops ||
    command.payload.releasedTroops < commitment.releasedTroops
  ) {
    return musterCommitmentDomainError(
      "payload.commitmentId",
      "Muster response quantities cannot decrease."
    );
  }
  const assembledTroopIncrease = command.payload.assembledTroops - commitment.assembledTroops;
  const delayedTroopDecrease = commitment.delayedTroops - command.payload.delayedTroops;
  if (delayedTroopDecrease > 0 && delayedTroopDecrease !== assembledTroopIncrease) {
    return musterCommitmentDomainError(
      "payload.delayedTroops",
      "Muster delayedTroops can only decrease when the same count becomes assembled."
    );
  }
  if (
    command.payload.assembledTroops === commitment.assembledTroops &&
    command.payload.delayedTroops === commitment.delayedTroops &&
    command.payload.refusedTroops === commitment.refusedTroops &&
    command.payload.releasedTroops === commitment.releasedTroops
  ) {
    return musterCommitmentDomainError(
      "payload.commitmentId",
      "Muster response must advance at least one commitment quantity."
    );
  }
  const hasDebtorResponseAdvance =
    command.payload.assembledTroops > commitment.assembledTroops ||
    command.payload.delayedTroops > commitment.delayedTroops ||
    command.payload.refusedTroops > commitment.refusedTroops;
  const hasCreditorReleaseAdvance = command.payload.releasedTroops > commitment.releasedTroops;
  if (hasDebtorResponseAdvance && hasCreditorReleaseAdvance) {
    return musterCommitmentDomainError(
      "payload.commitmentId",
      "Muster response quantities and release quantities must advance in separate commands."
    );
  }
  return null;
}

function deriveMusterCommitmentStatus(
  payload: Extract<GameCommandV1, { readonly kind: "sim.record-muster-response" }>["payload"],
  promisedTroops: number
): M4MusterCommitmentStatusV0 {
  if (payload.releasedTroops > 0 && payload.releasedTroops === payload.assembledTroops) {
    return "released";
  }
  if (payload.refusedTroops > 0 && payload.assembledTroops === 0 && payload.delayedTroops === 0) {
    return "refused";
  }
  if (payload.delayedTroops > 0 || payload.refusedTroops > 0) {
    return "delayed";
  }
  if (payload.assembledTroops === promisedTroops) {
    return "assembled";
  }
  return "promised";
}

function rejectMusterCommitment(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: musterCommitmentDomainError(path, message)
  };
}

function musterCommitmentDomainError(path: string, message: string): DomainErrorV1 {
  return {
    code: "muster-commitment-invalid",
    path,
    message
  };
}

function evaluateReserveCampaignGrainSupply(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.reserve-campaign-grain-supply" }>
): EvaluationResult {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return {
      ok: false,
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.reserve-campaign-grain-supply requires an M2 economy state."
      }
    };
  }
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.reserve-campaign-grain-supply");
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectGrainSupply("state.m4", "M4 campaign state is missing.");
  }

  const reservationId = parseGrainSupplyReservationId(command.payload.reservationId);
  if (m4.grainSupplyReservations.some((entry) => entry.reservationId === reservationId)) {
    return rejectGrainSupply("payload.reservationId", "GrainSupplyReservationId already exists.");
  }
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return badIdError("payload.campaignPlanId", "Grain supply references missing campaign.");
  }
  if (campaignPlan.status === "cancelled" || campaignPlan.status === "completed") {
    return rejectGrainSupply("payload.campaignPlanId", "CampaignPlan cannot reserve grain.");
  }
  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null) {
    return rejectGrainSupply("payload.campaignPlanId", "Campaign owner polity is unavailable.");
  }
  if (!actorHasPolityAuthority(m3, command.actor, ownerPolityId)) {
    return authorityDeniedError();
  }

  const allocations = allocateM4GrainSupplySources({
    world,
    m2,
    ownerPolityId,
    requestedAmount: command.payload.requestedAmount
  });
  if (allocations.allocatedAmount < command.payload.requestedAmount) {
    return rejectGrainSupply(
      "payload.requestedAmount",
      "Controlled M2 grain stockpiles cannot satisfy requestedAmount."
    );
  }

  const nextM2 = canonicalizeM2EconomyPopulationState({
    ...m2,
    populationGroups: m2.populationGroups.map((group) => {
      const allocation = allocations.allocations.find((entry) => entry.group.id === group.id);
      if (allocation === undefined) {
        return group;
      }
      return {
        ...group,
        grainStock: group.grainStock - allocation.amount
      };
    })
  });
  const reservations = allocations.allocations.map((allocation) =>
    createM4GrainSupplyReservation({
      reservationId,
      campaignPlanId,
      group: allocation.group,
      amount: allocation.amount,
      expectedDailyConsumption: command.payload.expectedDailyConsumption,
      reasonCodes: command.payload.reasonCodes
    })
  );

  return acceptM4CampaignAndM2State(
    world,
    command,
    nextM2,
    {
      ...m4,
      grainSupplyReservations: [...m4.grainSupplyReservations, ...reservations]
    },
    (nextWorld) => [
      {
        schemaVersion: 1,
        kind: "sim.grain-supply-reserved",
        commandId: command.commandId,
        actor: command.actor,
        reservationId,
        campaignPlanId,
        reservedAmount: command.payload.requestedAmount,
        sourceCount: reservations.length,
        expectedDailyConsumption: command.payload.expectedDailyConsumption,
        expectedDaysOfSupply: floorDivide(
          command.payload.requestedAmount,
          command.payload.expectedDailyConsumption
        ),
        revisionBefore: world.meta.revision,
        revisionAfter: nextWorld.meta.revision
      }
    ],
    (nextWorld) =>
      allocations.allocations
        .map((allocation) =>
          nextWorld.state.m2?.populationGroups.find((group) => group.id === allocation.group.id)
        )
        .filter((group): group is M2PopulationGroupStateV0 => group !== undefined)
        .map((group) => m2PopulationGroupDelta(nextWorld, group))
  );
}

function evaluateConsumeCampaignGrainSupply(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.consume-campaign-grain-supply" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.consume-campaign-grain-supply");
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectGrainSupply("state.m4", "M4 campaign state is missing.");
  }
  const reservationId = parseGrainSupplyReservationId(command.payload.reservationId);
  const reservations = m4.grainSupplyReservations.filter(
    (entry) => entry.reservationId === reservationId
  );
  if (reservations.length === 0) {
    return badIdError(
      "payload.reservationId",
      "sim.consume-campaign-grain-supply references missing reservation."
    );
  }
  if (reservations.every((entry) => entry.status === "released" || entry.status === "consumed")) {
    return rejectGrainSupply("payload.reservationId", "Grain supply reservation is terminal.");
  }
  const campaignPlanId = m4GrainReservationCampaignPlanId(reservations);
  if (campaignPlanId === null) {
    return rejectGrainSupply(
      "payload.reservationId",
      "GrainSupplyReservationId spans multiple campaign plans."
    );
  }
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return rejectGrainSupply("payload.reservationId", "Grain reservation campaign is missing.");
  }
  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null || !actorHasPolityAuthority(m3, command.actor, ownerPolityId)) {
    return authorityDeniedError();
  }

  const consumed = applyM4GrainConsumption({
    reservations,
    consumedAmount: command.payload.consumedAmount,
    lossAmount: command.payload.lossAmount,
    lossReasonCode: command.payload.lossReasonCode,
    reasonCodes: command.payload.reasonCodes
  });
  const consumedBefore = sumM4GrainReservationField(reservations, "consumedAmount");
  const lossBefore = sumM4GrainReservationField(reservations, "lossAmount");
  const shortageBefore = sumM4GrainReservationField(reservations, "shortageAmount");
  const carriedAfter = sumM4GrainReservationField(consumed.reservations, "carriedAmount");
  const consumedDelta =
    sumM4GrainReservationField(consumed.reservations, "consumedAmount") - consumedBefore;
  const lossDelta = sumM4GrainReservationField(consumed.reservations, "lossAmount") - lossBefore;
  const shortageDelta =
    sumM4GrainReservationField(consumed.reservations, "shortageAmount") - shortageBefore;
  const nextReservations = m4.grainSupplyReservations.map((entry) => {
    const updated = consumed.reservations.find(
      (reservation) =>
        reservation.reservationId === entry.reservationId &&
        reservation.source.kind === entry.source.kind &&
        reservation.source.populationGroupId === entry.source.populationGroupId
    );
    return updated ?? entry;
  });

  return acceptM4CampaignState(
    world,
    command,
    {
      ...m4,
      grainSupplyReservations: nextReservations
    },
    (nextWorld) => [
      {
        schemaVersion: 1,
        kind: "sim.grain-supply-consumed",
        commandId: command.commandId,
        actor: command.actor,
        reservationId,
        campaignPlanId: campaignPlan.id,
        consumedAmount: consumedDelta,
        lossAmount: lossDelta,
        shortageAmount: shortageDelta,
        carriedAmountAfter: carriedAfter,
        lossReasonCode: command.payload.lossReasonCode,
        revisionBefore: world.meta.revision,
        revisionAfter: nextWorld.meta.revision
      }
    ]
  );
}

function evaluateReleaseCampaignGrainSupply(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.release-campaign-grain-supply" }>
): EvaluationResult {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return {
      ok: false,
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.release-campaign-grain-supply requires an M2 economy state."
      }
    };
  }
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.release-campaign-grain-supply");
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectGrainSupply("state.m4", "M4 campaign state is missing.");
  }
  const reservationId = parseGrainSupplyReservationId(command.payload.reservationId);
  const reservations = m4.grainSupplyReservations.filter(
    (entry) => entry.reservationId === reservationId
  );
  if (reservations.length === 0) {
    return badIdError(
      "payload.reservationId",
      "sim.release-campaign-grain-supply references missing reservation."
    );
  }
  if (reservations.every((entry) => entry.carriedAmount === 0)) {
    return rejectGrainSupply(
      "payload.reservationId",
      "Grain supply reservation has no carried grain."
    );
  }
  const campaignPlanId = m4GrainReservationCampaignPlanId(reservations);
  if (campaignPlanId === null) {
    return rejectGrainSupply(
      "payload.reservationId",
      "GrainSupplyReservationId spans multiple campaign plans."
    );
  }
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return rejectGrainSupply("payload.reservationId", "Grain reservation campaign is missing.");
  }
  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null || !actorHasPolityAuthority(m3, command.actor, ownerPolityId)) {
    return authorityDeniedError();
  }

  const releaseByPopulationGroupId = new Map<number, number>();
  const releasedAmount = reservations.reduce(
    (sum, reservation) => sum + reservation.carriedAmount,
    0
  );
  for (const reservation of reservations) {
    if (reservation.source.kind === "m2-population-group" && reservation.carriedAmount > 0) {
      releaseByPopulationGroupId.set(
        reservation.source.populationGroupId,
        (releaseByPopulationGroupId.get(reservation.source.populationGroupId) ?? 0) +
          reservation.carriedAmount
      );
    }
  }
  const nextM2 = canonicalizeM2EconomyPopulationState({
    ...m2,
    populationGroups: m2.populationGroups.map((group) => ({
      ...group,
      grainStock: group.grainStock + (releaseByPopulationGroupId.get(group.id) ?? 0)
    }))
  });
  const nextReservations = m4.grainSupplyReservations.map((entry) =>
    entry.reservationId === reservationId
      ? {
          ...entry,
          carriedAmount: 0,
          expectedDaysOfSupply: 0,
          status: "released" as const,
          statusReasonCode: command.payload.reasonCode,
          reasonCodes: [...entry.reasonCodes, command.payload.reasonCode].sort(compareText)
        }
      : entry
  );

  return acceptM4CampaignAndM2State(
    world,
    command,
    nextM2,
    {
      ...m4,
      grainSupplyReservations: nextReservations
    },
    (nextWorld) => [
      {
        schemaVersion: 1,
        kind: "sim.grain-supply-released",
        commandId: command.commandId,
        actor: command.actor,
        reservationId,
        campaignPlanId: campaignPlan.id,
        releasedAmount,
        revisionBefore: world.meta.revision,
        revisionAfter: nextWorld.meta.revision
      }
    ],
    (nextWorld) =>
      [...releaseByPopulationGroupId.keys()]
        .sort((left, right) => left - right)
        .map((populationGroupId) =>
          nextWorld.state.m2?.populationGroups.find((group) => group.id === populationGroupId)
        )
        .filter((group): group is M2PopulationGroupStateV0 => group !== undefined)
        .map((group) => m2PopulationGroupDelta(nextWorld, group))
  );
}

function evaluateStartCampaignMarch(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.start-campaign-march" }>
): EvaluationResult {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return {
      ok: false,
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.start-campaign-march requires an M2 transport state."
      }
    };
  }
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.start-campaign-march");
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectMarchState("state.m4", "M4 campaign state is missing.");
  }

  const marchId = parseCampaignMarchId(command.payload.marchId);
  if (m4.marches.some((march) => march.marchId === marchId)) {
    return rejectMarchState("payload.marchId", "CampaignMarchId already exists.");
  }
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return badIdError(
      "payload.campaignPlanId",
      "sim.start-campaign-march references missing campaign."
    );
  }
  if (campaignPlan.status === "cancelled" || campaignPlan.status === "completed") {
    return rejectMarchState("payload.campaignPlanId", "CampaignPlan cannot start a march.");
  }
  if (campaignPlan.target.kind !== "district") {
    return rejectMarchState(
      "payload.campaignPlanId",
      "M4 deterministic march execution requires a district target."
    );
  }
  if (
    m4.marches.some(
      (march) =>
        march.campaignPlanId === campaignPlanId &&
        march.status !== "arrived" &&
        march.status !== "cancelled"
    )
  ) {
    return rejectMarchState("payload.campaignPlanId", "CampaignPlan already has an active march.");
  }

  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null || !actorHasPolityAuthority(m3, command.actor, ownerPolityId)) {
    return authorityDeniedError();
  }
  const originDistrictId = parseDistrictId(command.payload.originDistrictId);
  if (!world.definitions.districts.some((district) => district.id === originDistrictId)) {
    return badIdError(
      "payload.originDistrictId",
      "sim.start-campaign-march references missing origin district."
    );
  }
  const plannedDepartureDay = parseGameDay(command.payload.plannedDepartureDay);
  if (
    plannedDepartureDay < campaignPlan.startWindow.earliestDay ||
    plannedDepartureDay > campaignPlan.startWindow.latestDay ||
    plannedDepartureDay < world.meta.currentDay
  ) {
    return rejectMarchState(
      "payload.plannedDepartureDay",
      "plannedDepartureDay must be within the campaign start range and not before current day."
    );
  }

  const carriedGrain = m4.grainSupplyReservations
    .filter(
      (reservation) =>
        reservation.campaignPlanId === campaignPlanId &&
        reservation.carriedAmount > 0 &&
        reservation.status !== "released" &&
        reservation.status !== "consumed"
    )
    .reduce((sum, reservation) => sum + reservation.carriedAmount, 0);
  if (carriedGrain <= 0) {
    return rejectMarchState(
      "payload.campaignPlanId",
      "Campaign march requires reserved carried grain."
    );
  }

  const routePreview = previewM2TransportRouteV0(world, {
    originDistrictId,
    destinationDistrictId: campaignPlan.target.districtId,
    stockAmount: carriedGrain,
    day: plannedDepartureDay
  });
  if (routePreview.status === "unreachable" || routePreview.edges.length === 0) {
    return rejectMarchState(
      "payload.originDistrictId",
      "Accepted campaign target is unreachable from origin district."
    );
  }

  const joinedCommitmentIds = initialM4MarchJoinedCommitmentIds({
    m4,
    campaignPlanId,
    plannedDepartureDay
  });
  const joinedCommitmentTroops = m4MarchJoinedCommitmentTroopsFromIds(m4, joinedCommitmentIds);
  const failedCommitmentIds = initialM4MarchFailedCommitmentIds({ m4, campaignPlanId });
  const activeTroops = joinedCommitmentTroops.reduce((sum, joined) => sum + joined.joinedTroops, 0);
  if (activeTroops <= 0) {
    return rejectMarchState(
      "payload.campaignPlanId",
      "Campaign march requires at least one assembled troop commitment."
    );
  }

  const routeSegments = routePreview.edges.map((edge) => ({
    routeId: edge.routeId,
    fromDistrictId: edge.fromDistrictId,
    toDistrictId: edge.toDistrictId,
    travelDays: edge.seasonalCost,
    capacity: edge.seasonalCapacity,
    seasonRiskReasonCodes: m4RouteSeasonRiskReasonCodes(world, routePreview.monthOfYear, [edge])
  }));
  const status: M4CampaignMarchStatusV0 =
    plannedDepartureDay <= world.meta.currentDay ? "marching" : "planned";
  const reasonCodes = uniqueSortedText(
    [
      ...command.payload.reasonCodes,
      "march.started",
      ...routeSegments.flatMap((segment) => segment.seasonRiskReasonCodes)
    ],
    compareText
  );
  const march: M4CampaignMarchStateV0 = {
    marchId,
    campaignPlanId,
    originDistrictId,
    targetDistrictId: campaignPlan.target.districtId,
    currentDistrictId: originDistrictId,
    routeSegments,
    currentSegmentIndex: 0,
    progressOnSegmentDays: 0,
    activeTroops,
    grainPerTroopPerDay: command.payload.grainPerTroopPerDay,
    supply: {
      status: "well-supplied",
      carriedGrain,
      consumedGrain: 0,
      shortageGrain: 0,
      delayedDays: 0
    },
    status,
    statusReasonCode: status === "marching" ? "march.started" : "march.planned",
    reasonCodes,
    startedDay: plannedDepartureDay,
    updatedDay: world.meta.currentDay,
    predictedArrivalWindow: {
      earliestDay: parseGameDay(plannedDepartureDay + routePreview.totalCost),
      latestDay: parseGameDay(plannedDepartureDay + routePreview.totalCost)
    },
    actualArrivalDay: null,
    joinedCommitmentIds,
    joinedCommitmentTroops,
    failedCommitmentIds
  };

  return acceptM4CampaignState(world, command, {
    ...m4,
    campaignPlans: m4.campaignPlans.map((plan) =>
      plan.id === campaignPlanId
        ? {
            ...plan,
            status: "active",
            statusReasonCode: "campaign.objective.march-started",
            updatedDay: world.meta.currentDay,
            reasonCodes: uniqueSortedText(
              [...plan.reasonCodes, "campaign.objective.march-started"],
              compareText
            )
          }
        : plan
    ),
    grainSupplyReservations: m4.grainSupplyReservations.map((reservation) =>
      reservation.campaignPlanId === campaignPlanId && reservation.carriedAmount > 0
        ? {
            ...reservation,
            carriedAmount: 0,
            expectedDaysOfSupply: 0,
            status: "consumed" as const,
            statusReasonCode: "grain.supply.assigned-to-march",
            reasonCodes: uniqueSortedText(
              [...reservation.reasonCodes, "grain.supply.assigned-to-march"],
              compareText
            )
          }
        : reservation
    ),
    marches: [...m4.marches, march]
  });
}

function advanceM4DailyMarches(world: WorldStateV0): M4CampaignStateV0 | null {
  const m4 = world.state.m4;
  if (m4 === undefined || m4.marches.length === 0) {
    return null;
  }

  let changed = false;
  const marches = [...m4.marches].sort(compareM4MarchForDailyExecution).map((march) => {
    const advanced = advanceM4DailyMarch(world, m4, march);
    changed = changed || advanced !== march;
    return advanced;
  });
  if (!changed) {
    return null;
  }
  return canonicalizeM4CampaignStateV0({ ...m4, marches });
}

function advanceM4DailyMarch(
  world: WorldStateV0,
  m4: M4CampaignStateV0,
  march: M4CampaignMarchStateV0
): M4CampaignMarchStateV0 {
  if (march.status === "arrived" || march.status === "cancelled") {
    return march;
  }
  if (world.meta.currentDay < march.startedDay) {
    return march;
  }

  let activeTroops = march.activeTroops;
  const joinedCommitmentIds = [...march.joinedCommitmentIds];
  const joinedTroopsByCommitmentId = new Map<number, number>(
    march.joinedCommitmentTroops.map((joined) => [joined.commitmentId, joined.joinedTroops])
  );
  const failedCommitmentIds = [...march.failedCommitmentIds];
  const reasonCodes = [...march.reasonCodes];
  let joinedReinforcementThisDay = false;
  for (const commitment of m4.mobilizedForceCommitments
    .filter((entry) => entry.campaignPlanId === march.campaignPlanId)
    .sort(compareM4MusterCommitmentForMarchJoin)) {
    if (failedCommitmentIds.includes(commitment.id)) {
      continue;
    }
    const alreadyJoinedTroops = joinedTroopsByCommitmentId.get(commitment.id) ?? 0;
    if (
      (alreadyJoinedTroops === 0 && commitment.status === "refused") ||
      (alreadyJoinedTroops === 0 &&
        world.meta.currentDay > commitment.dueDay &&
        commitment.assembledTroops === 0)
    ) {
      failedCommitmentIds.push(commitment.id);
      reasonCodes.push("march.reinforcement.failed-to-arrive");
      continue;
    }
    const availableTroops = commitment.assembledTroops - commitment.releasedTroops;
    if (
      availableTroops > alreadyJoinedTroops &&
      world.meta.currentDay >= commitment.plannedAssemblyDay
    ) {
      const joinedTroopDelta = availableTroops - alreadyJoinedTroops;
      if (!joinedCommitmentIds.includes(commitment.id)) {
        joinedCommitmentIds.push(commitment.id);
      }
      joinedTroopsByCommitmentId.set(commitment.id, availableTroops);
      activeTroops += joinedTroopDelta;
      joinedReinforcementThisDay = true;
      reasonCodes.push(
        world.meta.currentDay > commitment.plannedAssemblyDay
          ? "march.reinforcement.late-arrival"
          : "march.reinforcement.joined"
      );
    }
  }

  const currentSegment = march.routeSegments[march.currentSegmentIndex];
  if (currentSegment === undefined) {
    return {
      ...march,
      activeTroops,
      joinedCommitmentIds: sortNumericIds(joinedCommitmentIds),
      joinedCommitmentTroops: sortM4MarchJoinedCommitmentTroops(joinedTroopsByCommitmentId),
      failedCommitmentIds: sortNumericIds(failedCommitmentIds),
      status: "arrived",
      statusReasonCode: "march.arrived",
      actualArrivalDay: march.actualArrivalDay ?? world.meta.currentDay,
      updatedDay: world.meta.currentDay,
      reasonCodes: uniqueSortedText([...reasonCodes, "march.arrived"], compareText)
    };
  }

  if (currentSegment.seasonRiskReasonCodes.includes("route.season.monsoon-risk")) {
    return {
      ...march,
      activeTroops,
      joinedCommitmentIds: sortNumericIds(joinedCommitmentIds),
      joinedCommitmentTroops: sortM4MarchJoinedCommitmentTroops(joinedTroopsByCommitmentId),
      failedCommitmentIds: sortNumericIds(failedCommitmentIds),
      status: "paused",
      statusReasonCode: "march.paused.rainy-season",
      updatedDay: world.meta.currentDay,
      reasonCodes: uniqueSortedText([...reasonCodes, "march.paused.rainy-season"], compareText)
    };
  }
  if (joinedReinforcementThisDay && world.meta.currentDay > march.startedDay) {
    return {
      ...march,
      activeTroops,
      joinedCommitmentIds: sortNumericIds(joinedCommitmentIds),
      joinedCommitmentTroops: sortM4MarchJoinedCommitmentTroops(joinedTroopsByCommitmentId),
      failedCommitmentIds: sortNumericIds(failedCommitmentIds),
      status: "delayed",
      statusReasonCode: "march.delayed.reinforcement-synchronization",
      updatedDay: world.meta.currentDay,
      reasonCodes: uniqueSortedText(
        [...reasonCodes, "march.delayed.reinforcement-synchronization"],
        compareText
      )
    };
  }

  const dailyNeed = multiplySafe(activeTroops, march.grainPerTroopPerDay, 1);
  if (dailyNeed === null) {
    return {
      ...march,
      activeTroops,
      joinedCommitmentIds: sortNumericIds(joinedCommitmentIds),
      joinedCommitmentTroops: sortM4MarchJoinedCommitmentTroops(joinedTroopsByCommitmentId),
      failedCommitmentIds: sortNumericIds(failedCommitmentIds),
      status: "delayed",
      statusReasonCode: "march.delayed.supply-shortage",
      updatedDay: world.meta.currentDay,
      reasonCodes: uniqueSortedText([...reasonCodes, "march.supply.out-of-supply"], compareText)
    };
  }
  const deliverableGrain = minimumInteger(
    march.supply.carriedGrain,
    dailyNeed,
    currentSegment.capacity
  );
  const shortageGrain = dailyNeed - deliverableGrain;
  const nextSupplyStatus = deriveM4MarchSupplyStatus(
    deliverableGrain,
    dailyNeed,
    currentSegment.capacity
  );
  const baseSupply = {
    status: nextSupplyStatus,
    carriedGrain: march.supply.carriedGrain - deliverableGrain,
    consumedGrain: march.supply.consumedGrain + deliverableGrain,
    shortageGrain: march.supply.shortageGrain + shortageGrain,
    delayedDays: shortageGrain > 0 ? march.supply.delayedDays + 1 : march.supply.delayedDays
  };
  if (shortageGrain > 0) {
    return {
      ...march,
      activeTroops,
      supply: baseSupply,
      joinedCommitmentIds: sortNumericIds(joinedCommitmentIds),
      joinedCommitmentTroops: sortM4MarchJoinedCommitmentTroops(joinedTroopsByCommitmentId),
      failedCommitmentIds: sortNumericIds(failedCommitmentIds),
      status: "delayed",
      statusReasonCode: "march.delayed.supply-shortage",
      updatedDay: world.meta.currentDay,
      reasonCodes: uniqueSortedText(
        [...reasonCodes, "march.delayed.supply-shortage", `march.supply.${nextSupplyStatus}`],
        compareText
      )
    };
  }

  const progressed = progressM4MarchSegment(march, currentSegment, world.meta.currentDay);
  return {
    ...march,
    ...progressed,
    activeTroops,
    supply: baseSupply,
    statusReasonCode: progressed.status === "arrived" ? "march.arrived" : "march.advanced",
    updatedDay: world.meta.currentDay,
    joinedCommitmentIds: sortNumericIds(joinedCommitmentIds),
    joinedCommitmentTroops: sortM4MarchJoinedCommitmentTroops(joinedTroopsByCommitmentId),
    failedCommitmentIds: sortNumericIds(failedCommitmentIds),
    reasonCodes: uniqueSortedText(
      [
        ...reasonCodes,
        progressed.status === "arrived" ? "march.arrived" : "march.advanced",
        `march.supply.${nextSupplyStatus}`
      ],
      compareText
    )
  };
}

function progressM4MarchSegment(
  march: M4CampaignMarchStateV0,
  segment: M4CampaignMarchRouteSegmentStateV0,
  currentDay: GameDay
): Pick<
  M4CampaignMarchStateV0,
  | "status"
  | "currentDistrictId"
  | "currentSegmentIndex"
  | "progressOnSegmentDays"
  | "actualArrivalDay"
> {
  const nextProgress = march.progressOnSegmentDays + 1;
  if (nextProgress < segment.travelDays) {
    return {
      status: "marching",
      currentDistrictId: march.currentDistrictId,
      currentSegmentIndex: march.currentSegmentIndex,
      progressOnSegmentDays: nextProgress,
      actualArrivalDay: march.actualArrivalDay
    };
  }
  const nextSegmentIndex = march.currentSegmentIndex + 1;
  if (nextSegmentIndex >= march.routeSegments.length) {
    return {
      status: "arrived",
      currentDistrictId: segment.toDistrictId,
      currentSegmentIndex: nextSegmentIndex,
      progressOnSegmentDays: 0,
      actualArrivalDay: currentDay
    };
  }
  return {
    status: "marching",
    currentDistrictId: segment.toDistrictId,
    currentSegmentIndex: nextSegmentIndex,
    progressOnSegmentDays: 0,
    actualArrivalDay: march.actualArrivalDay
  };
}

function deriveM4MarchSupplyStatus(
  delivered: number,
  dailyNeed: number,
  capacity: number
): M4CampaignMarchSupplyStatusV0 {
  if (dailyNeed === 0 || delivered >= dailyNeed) {
    return "well-supplied";
  }
  if (delivered > 0 && delivered >= capacity) {
    return "strained";
  }
  if (delivered > 0) {
    return "hungry";
  }
  return "out-of-supply";
}

function initialM4MarchJoinedCommitmentIds(input: {
  readonly m4: M4CampaignStateV0;
  readonly campaignPlanId: number;
  readonly plannedDepartureDay: GameDay;
}): readonly M4MobilizedForceCommitmentStateV0["id"][] {
  return input.m4.mobilizedForceCommitments
    .filter(
      (commitment) =>
        commitment.campaignPlanId === input.campaignPlanId &&
        commitment.assembledTroops > commitment.releasedTroops &&
        commitment.plannedAssemblyDay <= input.plannedDepartureDay
    )
    .sort(compareM4MusterCommitmentForMarchJoin)
    .map((commitment) => commitment.id);
}

function m4MarchJoinedCommitmentTroopsFromIds(
  m4: M4CampaignStateV0,
  commitmentIds: readonly M4MobilizedForceCommitmentStateV0["id"][]
): M4CampaignMarchStateV0["joinedCommitmentTroops"] {
  return commitmentIds
    .map((commitmentId) => {
      const commitment = m4.mobilizedForceCommitments.find((entry) => entry.id === commitmentId);
      return {
        commitmentId,
        joinedTroops:
          commitment === undefined ? 0 : commitment.assembledTroops - commitment.releasedTroops
      };
    })
    .filter((joined) => joined.joinedTroops > 0);
}

function initialM4MarchFailedCommitmentIds(input: {
  readonly m4: M4CampaignStateV0;
  readonly campaignPlanId: number;
}): readonly M4MobilizedForceCommitmentStateV0["id"][] {
  return input.m4.mobilizedForceCommitments
    .filter(
      (commitment) =>
        commitment.campaignPlanId === input.campaignPlanId && commitment.status === "refused"
    )
    .sort(compareM4MusterCommitmentForMarchJoin)
    .map((commitment) => commitment.id);
}

function rejectMarchState(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "march-state-invalid",
      path,
      message
    }
  };
}

function compareM4MarchForDailyExecution(
  left: M4CampaignMarchStateV0,
  right: M4CampaignMarchStateV0
): number {
  return (
    left.campaignPlanId - right.campaignPlanId ||
    left.startedDay - right.startedDay ||
    left.marchId - right.marchId
  );
}

function compareM4MusterCommitmentForMarchJoin(
  left: M4MobilizedForceCommitmentStateV0,
  right: M4MobilizedForceCommitmentStateV0
): number {
  return (
    left.plannedAssemblyDay - right.plannedAssemblyDay ||
    left.dueDay - right.dueDay ||
    left.id - right.id
  );
}

function minimumInteger(first: number, second: number, third: number): number {
  return Math.min(first, second, third);
}

function sortNumericIds<TValue extends number>(values: readonly TValue[]): readonly TValue[] {
  return [...values].sort((left, right) => left - right);
}

function sortM4MarchJoinedCommitmentTroops(
  joinedTroopsByCommitmentId: ReadonlyMap<number, number>
): M4CampaignMarchStateV0["joinedCommitmentTroops"] {
  return [...joinedTroopsByCommitmentId.entries()]
    .filter((entry) => entry[1] > 0)
    .sort((left, right) => left[0] - right[0])
    .map(([commitmentId, joinedTroops]) => ({
      commitmentId: parseMobilizedForceCommitmentId(commitmentId),
      joinedTroops
    }));
}

function evaluateResolveM4FieldEngagement(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.resolve-m4-field-engagement" }>
): EvaluationResult {
  const context = validateM4CombatCommandContext(world, {
    command,
    campaignPlanId: command.payload.campaignPlanId,
    marchId: command.payload.marchId,
    errorCode: "engagement-state-invalid"
  });
  if (!context.ok) {
    return { ok: false, error: context.error };
  }
  const { m4, campaignPlan, march, ownerPolityId } = context.value;
  const engagementId = parseFieldEngagementId(command.payload.engagementId);
  if (m4.fieldEngagements.some((engagement) => engagement.engagementId === engagementId)) {
    return rejectEngagementState("payload.engagementId", "FieldEngagementId already exists.");
  }
  if (
    campaignPlan.target.kind !== "district" ||
    march.currentDistrictId !== march.targetDistrictId
  ) {
    return rejectEngagementState(
      "payload.marchId",
      "Field engagement requires an arrived district-target march."
    );
  }
  const defenderPolityId = parsePolityId(command.payload.defenderPolityId);
  if (!world.definitions.polities.some((polity) => polity.id === defenderPolityId)) {
    return badIdError("payload.defenderPolityId", "Field engagement defender polity is missing.");
  }
  if (defenderPolityId === ownerPolityId) {
    return rejectEngagementState("payload.defenderPolityId", "Field engagement needs opposition.");
  }

  const outcome = resolveM4FieldEngagementOutcome({
    engagementId,
    march,
    defenderPolityId,
    defenderEstimatedTroops: command.payload.defenderEstimatedTroops,
    defenderFortification: command.payload.defenderFortification,
    reasonCodes: command.payload.reasonCodes
  });
  const updatedMarch = applyM4CombatLossesToMarch(march, {
    activeTroops: outcome.attackerTroopsAfter,
    supplyLoss: outcome.supplyLoss,
    reasonCodes: outcome.reasonCodes
  });
  const campaignStatusBefore = campaignPlan.status;
  const campaignStatusAfter: M4CampaignPlanStateV0["status"] =
    outcome.outcome === "attacker-victory" ? "active" : "cancelled";
  const engagement: M4FieldEngagementStateV0 = {
    engagementId,
    campaignPlanId: campaignPlan.id,
    marchId: march.marchId,
    attackerPolityId: ownerPolityId,
    defenderPolityId,
    target: copyM4CampaignTarget(campaignPlan.target),
    attackerTroopsBefore: march.activeTroops,
    attackerTroopsAfter: outcome.attackerTroopsAfter,
    defenderEstimatedTroopsBefore: command.payload.defenderEstimatedTroops,
    defenderEstimatedTroopsAfter: outcome.defenderEstimatedTroopsAfter,
    attackerCasualties: outcome.attackerCasualties,
    defenderCasualties: outcome.defenderCasualties,
    supplyLoss: outcome.supplyLoss,
    defenderFortification: command.payload.defenderFortification,
    outcome: outcome.outcome,
    reasonCodes: outcome.reasonCodes,
    creditHooks: m4CombatCreditHooks(ownerPolityId, outcome.outcome, outcome.defenderCasualties),
    reputationHooks: m4CombatReputationHooks(
      ownerPolityId,
      outcome.outcome,
      outcome.attackerCasualties
    ),
    resolvedDay: world.meta.currentDay
  };
  const nextM4 = {
    ...m4,
    campaignPlans: m4.campaignPlans.map((plan) =>
      plan.id === campaignPlan.id
        ? {
            ...plan,
            status: campaignStatusAfter,
            statusReasonCode:
              outcome.outcome === "attacker-victory"
                ? "campaign.objective.field-engagement-won"
                : "campaign.objective.field-engagement-lost",
            reasonCodes: uniqueSortedText(
              [...plan.reasonCodes, ...outcome.reasonCodes],
              compareText
            ),
            updatedDay: world.meta.currentDay
          }
        : plan
    ),
    marches: m4.marches.map((entry) => (entry.marchId === march.marchId ? updatedMarch : entry)),
    fieldEngagements: [...m4.fieldEngagements, engagement]
  };

  return acceptM4CampaignState(world, command, nextM4, (nextWorld) => [
    {
      schemaVersion: 1,
      kind: "sim.m4-field-engagement-resolved",
      commandId: command.commandId,
      actor: command.actor,
      engagementId,
      campaignPlanId: campaignPlan.id,
      marchId: march.marchId,
      attackerPolityId: ownerPolityId,
      defenderPolityId,
      outcome: outcome.outcome,
      attackerCasualties: outcome.attackerCasualties,
      defenderCasualties: outcome.defenderCasualties,
      supplyLoss: outcome.supplyLoss,
      campaignStatusBefore,
      campaignStatusAfter,
      reasonCodes: outcome.reasonCodes,
      creditHooks: engagement.creditHooks,
      reputationHooks: engagement.reputationHooks,
      revisionBefore: world.meta.revision,
      revisionAfter: nextWorld.meta.revision
    }
  ]);
}

function evaluateApplyM4SiegeChoice(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.apply-m4-siege-choice" }>
): EvaluationResult {
  const context = validateM4CombatCommandContext(world, {
    command,
    campaignPlanId: command.payload.campaignPlanId,
    marchId: command.payload.marchId,
    errorCode: "siege-state-invalid"
  });
  if (!context.ok) {
    return { ok: false, error: context.error };
  }
  const { m4, campaignPlan, march, ownerPolityId } = context.value;
  if (
    campaignPlan.target.kind !== "district" ||
    march.currentDistrictId !== march.targetDistrictId
  ) {
    return rejectSiegeState("payload.marchId", "Siege choice requires an arrived district march.");
  }
  const siegeId = parseSiegeId(command.payload.siegeId);
  const existing = m4.sieges.find((siege) => siege.siegeId === siegeId);
  if (command.payload.choice === "invest-blockade" && existing !== undefined) {
    return rejectSiegeState("payload.siegeId", "SiegeId already exists.");
  }
  if (command.payload.choice !== "invest-blockade" && existing === undefined) {
    return rejectSiegeState("payload.siegeId", "Siege choice references missing siege.");
  }
  const defenderPolityId = parsePolityId(command.payload.defenderPolityId);
  if (!world.definitions.polities.some((polity) => polity.id === defenderPolityId)) {
    return badIdError("payload.defenderPolityId", "Siege defender polity is missing.");
  }
  if (defenderPolityId === ownerPolityId) {
    return rejectSiegeState("payload.defenderPolityId", "Siege requires an opposing defender.");
  }
  if (existing !== undefined && isTerminalM4SiegeStatus(existing.status)) {
    return rejectSiegeState("payload.siegeId", "Siege is already terminal.");
  }

  const statusBefore = existing?.status ?? null;
  const campaignStatusBefore = campaignPlan.status;
  const resolved = applyM4SiegeChoice({
    world,
    command,
    siege: existing,
    campaignPlan,
    march,
    ownerPolityId,
    defenderPolityId
  });
  if (!resolved.ok) {
    return { ok: false, error: resolved.error };
  }
  const nextSiege = resolved.value.siege;
  const nextM4 = {
    ...m4,
    campaignPlans: m4.campaignPlans.map((plan) =>
      plan.id === campaignPlan.id ? resolved.value.campaignPlan : plan
    ),
    marches: m4.marches.map((entry) =>
      entry.marchId === march.marchId ? resolved.value.march : entry
    ),
    sieges:
      existing === undefined
        ? [...m4.sieges, nextSiege]
        : m4.sieges.map((siege) => (siege.siegeId === siegeId ? nextSiege : siege))
  };

  return acceptM4CampaignState(world, command, nextM4, (nextWorld) => [
    {
      schemaVersion: 1,
      kind: "sim.m4-siege-choice-applied",
      commandId: command.commandId,
      actor: command.actor,
      siegeId,
      campaignPlanId: campaignPlan.id,
      marchId: march.marchId,
      choice: command.payload.choice,
      statusBefore,
      statusAfter: nextSiege.status,
      attackerCasualties: resolved.value.attackerCasualtyDelta,
      defenderCasualties: resolved.value.defenderCasualtyDelta,
      supplyLoss: resolved.value.supplyLossDelta,
      campaignStatusBefore,
      campaignStatusAfter: resolved.value.campaignPlan.status,
      surrenderEligible: nextSiege.surrenderEligible,
      reasonCodes: resolved.value.reasonCodes,
      creditHooks: nextSiege.creditHooks,
      reputationHooks: nextSiege.reputationHooks,
      revisionBefore: world.meta.revision,
      revisionAfter: nextWorld.meta.revision
    }
  ]);
}

type M4CombatContextResult =
  | {
      readonly ok: true;
      readonly value: {
        readonly m4: M4CampaignStateV0;
        readonly m3: NonNullable<WorldStateV0["state"]["m3"]>;
        readonly campaignPlan: M4CampaignPlanStateV0;
        readonly march: M4CampaignMarchStateV0;
        readonly ownerPolityId: PolityId;
      };
    }
  | { readonly ok: false; readonly error: DomainErrorV1 };

function validateM4CombatCommandContext(
  inputWorld: WorldStateV0,
  input: {
    readonly command: GameCommandV1;
    readonly campaignPlanId: number;
    readonly marchId: number;
    readonly errorCode: "engagement-state-invalid" | "siege-state-invalid";
  }
): M4CombatContextResult {
  const m3 = inputWorld.state.m3;
  if (m3 === undefined) {
    return { ok: false, error: m3MissingDomainError(input.command.kind) };
  }
  const m4 = inputWorld.state.m4;
  if (m4 === undefined) {
    return {
      ok: false,
      error: { code: input.errorCode, path: "state.m4", message: "M4 campaign state is missing." }
    };
  }
  const campaignPlanId = parseCampaignPlanId(input.campaignPlanId);
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return { ok: false, error: badIdDomainError("payload.campaignPlanId", "Campaign missing.") };
  }
  if (campaignPlan.status === "cancelled" || campaignPlan.status === "completed") {
    return {
      ok: false,
      error: {
        code: input.errorCode,
        path: "payload.campaignPlanId",
        message: "CampaignPlan cannot accept combat commands."
      }
    };
  }
  const marchId = parseCampaignMarchId(input.marchId);
  const march = m4.marches.find(
    (entry) => entry.marchId === marchId && entry.campaignPlanId === campaignPlanId
  );
  if (march === undefined) {
    return { ok: false, error: badIdDomainError("payload.marchId", "Campaign march missing.") };
  }
  if (march.status !== "arrived" || march.activeTroops === 0) {
    return {
      ok: false,
      error: {
        code: input.errorCode,
        path: "payload.marchId",
        message: "Combat commands require an arrived march with active troops."
      }
    };
  }
  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null || !actorHasPolityAuthority(m3, input.command.actor, ownerPolityId)) {
    return { ok: false, error: authorityDeniedDomainError() };
  }
  return { ok: true, value: { m4, m3, campaignPlan, march, ownerPolityId } };
}

function resolveM4FieldEngagementOutcome(input: {
  readonly engagementId: number;
  readonly march: M4CampaignMarchStateV0;
  readonly defenderPolityId: PolityId;
  readonly defenderEstimatedTroops: number;
  readonly defenderFortification: number;
  readonly reasonCodes: readonly string[];
}): {
  readonly outcome: M4FieldEngagementOutcomeV0;
  readonly attackerTroopsAfter: number;
  readonly defenderEstimatedTroopsAfter: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly reasonCodes: readonly string[];
} {
  const supplyBps = m4MarchSupplyPowerBps(input.march.supply.status);
  const attackerPower = input.march.activeTroops * supplyBps;
  const defenderPower = input.defenderEstimatedTroops * 10_000 + input.defenderFortification * 100;
  const tieBreakerFavoursAttacker =
    attackerPower === defenderPower && input.engagementId <= input.defenderPolityId;
  const isAttackerVictory = attackerPower > defenderPower || tieBreakerFavoursAttacker;
  const attackerCasualties = minimumTwo(
    input.march.activeTroops,
    isAttackerVictory
      ? floorDivide(input.defenderEstimatedTroops, 4) +
          floorDivide(input.defenderFortification, 200) +
          1
      : floorDivide(input.defenderEstimatedTroops, 2) +
          floorDivide(input.defenderFortification, 100) +
          1
  );
  const defenderCasualties = minimumTwo(
    input.defenderEstimatedTroops,
    isAttackerVictory
      ? floorDivide(input.march.activeTroops, 3) + 1
      : floorDivide(input.march.activeTroops, 5)
  );
  const supplyLoss = minimumTwo(
    input.march.supply.carriedGrain,
    floorDivide(input.march.activeTroops * input.march.grainPerTroopPerDay, 2)
  );
  const reasonCodes = [
    ...input.reasonCodes,
    isAttackerVictory ? "engagement.outcome.attacker-victory" : "engagement.outcome.defender-holds",
    attackerPower >= defenderPower
      ? "engagement.reason.force-superiority"
      : "engagement.reason.defender-force-estimate",
    input.defenderFortification > 0
      ? "engagement.reason.defender-fortification"
      : "engagement.reason.open-field",
    input.march.supply.status === "well-supplied"
      ? "engagement.reason.supply-ready"
      : "engagement.reason.supply-strained",
    ...(tieBreakerFavoursAttacker ? ["engagement.reason.stable-id-tie-breaker"] : [])
  ];
  return {
    outcome: isAttackerVictory ? "attacker-victory" : "defender-holds",
    attackerTroopsAfter: input.march.activeTroops - attackerCasualties,
    defenderEstimatedTroopsAfter: input.defenderEstimatedTroops - defenderCasualties,
    attackerCasualties,
    defenderCasualties,
    supplyLoss,
    reasonCodes: uniqueSortedText(reasonCodes, compareText)
  };
}

type ApplyM4SiegeChoiceResult =
  | {
      readonly ok: true;
      readonly value: {
        readonly siege: M4SiegeStateV0;
        readonly campaignPlan: M4CampaignPlanStateV0;
        readonly march: M4CampaignMarchStateV0;
        readonly attackerCasualtyDelta: number;
        readonly defenderCasualtyDelta: number;
        readonly supplyLossDelta: number;
        readonly reasonCodes: readonly string[];
      };
    }
  | { readonly ok: false; readonly error: DomainErrorV1 };

function applyM4SiegeChoice(input: {
  readonly world: WorldStateV0;
  readonly command: Extract<GameCommandV1, { readonly kind: "sim.apply-m4-siege-choice" }>;
  readonly siege: M4SiegeStateV0 | undefined;
  readonly campaignPlan: M4CampaignPlanStateV0;
  readonly march: M4CampaignMarchStateV0;
  readonly ownerPolityId: PolityId;
  readonly defenderPolityId: PolityId;
}): ApplyM4SiegeChoiceResult {
  switch (input.command.payload.choice) {
    case "invest-blockade":
      return investM4Siege(input);
    case "continue":
      return continueM4Siege(input);
    case "assault":
      return assaultM4Siege(input);
    case "accept-surrender":
      return acceptM4SiegeSurrender(input);
    case "lift-siege":
      return closeM4Siege(input, "lifted", "siege.lifted", "active");
    case "withdraw":
      return closeM4Siege(input, "withdrawn", "siege.withdrawn", "cancelled");
  }
}

function investM4Siege(input: Parameters<typeof applyM4SiegeChoice>[0]): ApplyM4SiegeChoiceResult {
  const siege: M4SiegeStateV0 = {
    siegeId: parseSiegeId(input.command.payload.siegeId),
    campaignPlanId: input.campaignPlan.id,
    marchId: input.march.marchId,
    targetDistrictId: input.march.targetDistrictId,
    attackerPolityId: input.ownerPolityId,
    defenderPolityId: input.defenderPolityId,
    status: "blockading",
    statusReasonCode: "siege.invested.blockade",
    fortification: input.command.payload.fortification,
    defenderEstimatedTroops: input.command.payload.defenderEstimatedTroops,
    defenderSupply: input.command.payload.defenderSupply,
    siegeProgress: 0,
    daysInvested: 0,
    blockadeDays: 0,
    assaultCount: 0,
    attackerTroops: input.march.activeTroops,
    attackerCasualties: 0,
    defenderCasualties: 0,
    supplyLoss: 0,
    surrenderEligible: false,
    surrenderReasonCodes: [],
    reasonCodes: uniqueSortedText(
      [...input.command.payload.reasonCodes, "siege.invested.blockade"],
      compareText
    ),
    creditHooks: [],
    reputationHooks: [],
    startedDay: input.world.meta.currentDay,
    updatedDay: input.world.meta.currentDay
  };
  return {
    ok: true,
    value: {
      siege,
      campaignPlan: updateM4CampaignForSiege(
        input.campaignPlan,
        input.world.meta.currentDay,
        "active",
        "campaign.objective.siege-invested",
        siege.reasonCodes
      ),
      march: input.march,
      attackerCasualtyDelta: 0,
      defenderCasualtyDelta: 0,
      supplyLossDelta: 0,
      reasonCodes: siege.reasonCodes
    }
  };
}

function continueM4Siege(
  input: Parameters<typeof applyM4SiegeChoice>[0]
): ApplyM4SiegeChoiceResult {
  if (input.siege === undefined) {
    return { ok: false, error: rejectSiegeStateError("payload.siegeId", "Siege is missing.") };
  }
  const dailyNeed = input.siege.attackerTroops * input.march.grainPerTroopPerDay;
  const supplyLoss = minimumTwo(input.march.supply.carriedGrain, dailyNeed);
  const shortage = dailyNeed - supplyLoss;
  const attackerCasualties =
    shortage === 0
      ? 0
      : minimumTwo(
          input.siege.attackerTroops,
          floorDivide(shortage, input.march.grainPerTroopPerDay) + 1
        );
  const defenderSupplyLoss = minimumTwo(
    input.siege.defenderSupply,
    floorDivide(input.siege.attackerTroops, 3) + 1
  );
  const progressDelta = Math.max(
    0,
    floorDivide(input.siege.attackerTroops, 20) +
      (input.siege.blockadeDays + 1) * 5 -
      floorDivide(input.siege.fortification, 100)
  );
  const defenderSupply = input.siege.defenderSupply - defenderSupplyLoss;
  const siegeProgress = input.siege.siegeProgress + progressDelta;
  const daysInvested = input.siege.daysInvested + 1;
  const surrenderReasonCodes = m4SurrenderReasonCodes({
    defenderSupply,
    attackerTroops: input.siege.attackerTroops - attackerCasualties,
    defenderEstimatedTroops: input.siege.defenderEstimatedTroops,
    siegeProgress,
    fortification: input.siege.fortification,
    daysInvested
  });
  const surrenderEligible = surrenderReasonCodes.length > 0;
  const supplyCollapse = input.siege.attackerTroops - attackerCasualties === 0;
  const status: M4SiegeStatusV0 = supplyCollapse
    ? "withdrawn"
    : surrenderEligible
      ? "surrender-ready"
      : "blockading";
  const reasonCodes = uniqueSortedText(
    [
      ...input.siege.reasonCodes,
      ...input.command.payload.reasonCodes,
      shortage > 0 ? "siege.continue.supply-shortage" : "siege.continue.blockade-maintained",
      supplyCollapse ? "siege.failure.supply-collapse" : "siege.progress.updated",
      ...surrenderReasonCodes
    ],
    compareText
  );
  const siege = {
    ...input.siege,
    status,
    statusReasonCode: supplyCollapse
      ? "siege.failure.supply-collapse"
      : surrenderEligible
        ? "siege.surrender.conditions-met"
        : "siege.continue.blockade-maintained",
    defenderSupply,
    siegeProgress,
    daysInvested,
    blockadeDays: input.siege.blockadeDays + 1,
    attackerTroops: input.siege.attackerTroops - attackerCasualties,
    attackerCasualties: input.siege.attackerCasualties + attackerCasualties,
    supplyLoss: input.siege.supplyLoss + supplyLoss,
    surrenderEligible,
    surrenderReasonCodes,
    reasonCodes,
    reputationHooks: [
      ...input.siege.reputationHooks,
      ...m4SupplyReputationHooks(input.ownerPolityId, shortage)
    ],
    updatedDay: input.world.meta.currentDay
  };
  return {
    ok: true,
    value: {
      siege,
      campaignPlan: updateM4CampaignForSiege(
        input.campaignPlan,
        input.world.meta.currentDay,
        supplyCollapse ? "cancelled" : "active",
        supplyCollapse
          ? "campaign.objective.siege-supply-failed"
          : "campaign.objective.siege-continues",
        reasonCodes
      ),
      march: applyM4CombatLossesToMarch(input.march, {
        activeTroops: siege.attackerTroops,
        supplyLoss,
        reasonCodes
      }),
      attackerCasualtyDelta: attackerCasualties,
      defenderCasualtyDelta: 0,
      supplyLossDelta: supplyLoss,
      reasonCodes
    }
  };
}

function assaultM4Siege(input: Parameters<typeof applyM4SiegeChoice>[0]): ApplyM4SiegeChoiceResult {
  if (input.siege === undefined) {
    return { ok: false, error: rejectSiegeStateError("payload.siegeId", "Siege is missing.") };
  }
  const attackerPower = input.siege.attackerTroops * 10_000;
  const defenderPower =
    input.siege.defenderEstimatedTroops * 10_000 + input.siege.fortification * 100;
  const tieBreakerFavoursAttacker =
    attackerPower === defenderPower && input.siege.siegeId <= input.siege.defenderPolityId;
  const breached = attackerPower > defenderPower || tieBreakerFavoursAttacker;
  const attackerCasualties = minimumTwo(
    input.siege.attackerTroops,
    breached
      ? floorDivide(input.siege.defenderEstimatedTroops, 3) +
          floorDivide(input.siege.fortification, 150) +
          1
      : floorDivide(input.siege.defenderEstimatedTroops, 2) +
          floorDivide(input.siege.fortification, 80) +
          1
  );
  const defenderCasualties = minimumTwo(
    input.siege.defenderEstimatedTroops,
    breached
      ? floorDivide(input.siege.attackerTroops, 2) + 1
      : floorDivide(input.siege.attackerTroops, 4)
  );
  const supplyLoss = minimumTwo(
    input.march.supply.carriedGrain,
    input.siege.attackerTroops * input.march.grainPerTroopPerDay
  );
  const surrenderReasonCodes = breached ? ["siege.surrender.assault-breach"] : [];
  const reasonCodes = uniqueSortedText(
    [
      ...input.siege.reasonCodes,
      ...input.command.payload.reasonCodes,
      breached ? "siege.assault.breach" : "siege.assault.repulsed",
      ...surrenderReasonCodes
    ],
    compareText
  );
  const status: M4SiegeStatusV0 = breached ? "surrender-ready" : "blockading";
  const siege: M4SiegeStateV0 = {
    ...input.siege,
    status,
    statusReasonCode: breached ? "siege.surrender.assault-breach" : "siege.assault.repulsed",
    defenderEstimatedTroops: input.siege.defenderEstimatedTroops - defenderCasualties,
    siegeProgress: breached
      ? input.siege.fortification
      : input.siege.siegeProgress + floorDivide(input.siege.fortification, 4),
    assaultCount: input.siege.assaultCount + 1,
    attackerTroops: input.siege.attackerTroops - attackerCasualties,
    attackerCasualties: input.siege.attackerCasualties + attackerCasualties,
    defenderCasualties: input.siege.defenderCasualties + defenderCasualties,
    supplyLoss: input.siege.supplyLoss + supplyLoss,
    surrenderEligible: breached,
    surrenderReasonCodes,
    reasonCodes,
    creditHooks: [
      ...input.siege.creditHooks,
      ...m4SiegeCreditHooks(input.ownerPolityId, breached, defenderCasualties)
    ],
    reputationHooks: [
      ...input.siege.reputationHooks,
      ...m4CombatReputationHooks(
        input.ownerPolityId,
        breached ? "attacker-victory" : "defender-holds",
        attackerCasualties
      )
    ],
    updatedDay: input.world.meta.currentDay
  };
  return {
    ok: true,
    value: {
      siege,
      campaignPlan: updateM4CampaignForSiege(
        input.campaignPlan,
        input.world.meta.currentDay,
        "active",
        breached
          ? "campaign.objective.siege-breached"
          : "campaign.objective.siege-assault-repulsed",
        reasonCodes
      ),
      march: applyM4CombatLossesToMarch(input.march, {
        activeTroops: siege.attackerTroops,
        supplyLoss,
        reasonCodes
      }),
      attackerCasualtyDelta: attackerCasualties,
      defenderCasualtyDelta: defenderCasualties,
      supplyLossDelta: supplyLoss,
      reasonCodes
    }
  };
}

function acceptM4SiegeSurrender(
  input: Parameters<typeof applyM4SiegeChoice>[0]
): ApplyM4SiegeChoiceResult {
  if (input.siege === undefined || !input.siege.surrenderEligible) {
    return {
      ok: false,
      error: rejectSiegeStateError(
        "payload.siegeId",
        "Surrender cannot be accepted until explicit surrender conditions are met."
      )
    };
  }
  const reasonCodes = uniqueSortedText(
    [...input.siege.reasonCodes, ...input.command.payload.reasonCodes, "siege.surrender.accepted"],
    compareText
  );
  const siege = {
    ...input.siege,
    status: "surrendered" as const,
    statusReasonCode: "siege.surrender.accepted",
    reasonCodes,
    creditHooks: [...input.siege.creditHooks, ...m4SiegeCreditHooks(input.ownerPolityId, true, 0)],
    updatedDay: input.world.meta.currentDay
  };
  return {
    ok: true,
    value: {
      siege,
      campaignPlan: updateM4CampaignForSiege(
        input.campaignPlan,
        input.world.meta.currentDay,
        "completed",
        "campaign.objective.siege-surrendered",
        reasonCodes
      ),
      march: input.march,
      attackerCasualtyDelta: 0,
      defenderCasualtyDelta: 0,
      supplyLossDelta: 0,
      reasonCodes
    }
  };
}

function closeM4Siege(
  input: Parameters<typeof applyM4SiegeChoice>[0],
  status: "lifted" | "withdrawn",
  reasonCode: string,
  campaignStatus: M4CampaignPlanStateV0["status"]
): ApplyM4SiegeChoiceResult {
  if (input.siege === undefined) {
    return { ok: false, error: rejectSiegeStateError("payload.siegeId", "Siege is missing.") };
  }
  const reasonCodes = uniqueSortedText(
    [...input.siege.reasonCodes, ...input.command.payload.reasonCodes, reasonCode],
    compareText
  );
  const siege = {
    ...input.siege,
    status,
    statusReasonCode: reasonCode,
    reasonCodes,
    updatedDay: input.world.meta.currentDay
  };
  return {
    ok: true,
    value: {
      siege,
      campaignPlan: updateM4CampaignForSiege(
        input.campaignPlan,
        input.world.meta.currentDay,
        campaignStatus,
        status === "withdrawn"
          ? "campaign.objective.siege-withdrawn"
          : "campaign.objective.siege-lifted",
        reasonCodes
      ),
      march:
        status === "withdrawn"
          ? { ...input.march, status: "cancelled" as const, statusReasonCode: reasonCode }
          : input.march,
      attackerCasualtyDelta: 0,
      defenderCasualtyDelta: 0,
      supplyLossDelta: 0,
      reasonCodes
    }
  };
}

function updateM4CampaignForSiege(
  campaignPlan: M4CampaignPlanStateV0,
  day: GameDay,
  status: M4CampaignPlanStateV0["status"],
  statusReasonCode: string,
  reasonCodes: readonly string[]
): M4CampaignPlanStateV0 {
  return {
    ...campaignPlan,
    objectiveKind: status === "cancelled" ? "withdraw" : campaignPlan.objectiveKind,
    status,
    statusReasonCode,
    reasonCodes: uniqueSortedText(
      [...campaignPlan.reasonCodes, ...reasonCodes, statusReasonCode],
      compareText
    ),
    updatedDay: day
  };
}

function applyM4CombatLossesToMarch(
  march: M4CampaignMarchStateV0,
  input: {
    readonly activeTroops: number;
    readonly supplyLoss: number;
    readonly reasonCodes: readonly string[];
  }
): M4CampaignMarchStateV0 {
  return {
    ...march,
    activeTroops: input.activeTroops,
    supply: {
      ...march.supply,
      carriedGrain: march.supply.carriedGrain - input.supplyLoss,
      shortageGrain: march.supply.shortageGrain
    },
    reasonCodes: uniqueSortedText([...march.reasonCodes, ...input.reasonCodes], compareText)
  };
}

function m4SurrenderReasonCodes(input: {
  readonly defenderSupply: number;
  readonly attackerTroops: number;
  readonly defenderEstimatedTroops: number;
  readonly siegeProgress: number;
  readonly fortification: number;
  readonly daysInvested: number;
}): readonly string[] {
  const reasonCodes: string[] = [];
  if (input.defenderSupply === 0) {
    reasonCodes.push("siege.surrender.defender-supply-exhausted");
  }
  if (input.attackerTroops >= input.defenderEstimatedTroops * 2 && input.daysInvested >= 2) {
    reasonCodes.push("siege.surrender.force-ratio-pressure");
  }
  if (input.siegeProgress >= input.fortification && input.fortification > 0) {
    reasonCodes.push("siege.surrender.fortification-breached");
  }
  if (input.daysInvested >= 3 && input.defenderSupply <= input.defenderEstimatedTroops) {
    reasonCodes.push("siege.surrender.time-pressure");
  }
  return uniqueSortedText(reasonCodes, compareText);
}

function m4MarchSupplyPowerBps(status: M4CampaignMarchSupplyStatusV0): number {
  switch (status) {
    case "well-supplied":
      return 10_000;
    case "strained":
      return 7_500;
    case "hungry":
      return 5_000;
    case "out-of-supply":
      return 2_500;
  }
}

function m4CombatCreditHooks(
  polityId: PolityId,
  outcome: M4FieldEngagementOutcomeV0,
  defenderCasualties: number
): M4FieldEngagementStateV0["creditHooks"] {
  return outcome === "attacker-victory"
    ? [{ polityId, amount: defenderCasualties + 1, reasonCode: "campaign.credit.engagement-win" }]
    : [];
}

function m4SiegeCreditHooks(
  polityId: PolityId,
  succeeded: boolean,
  defenderCasualties: number
): M4SiegeStateV0["creditHooks"] {
  return succeeded
    ? [{ polityId, amount: defenderCasualties + 1, reasonCode: "campaign.credit.siege-success" }]
    : [];
}

function m4CombatReputationHooks(
  polityId: PolityId,
  outcome: M4FieldEngagementOutcomeV0,
  attackerCasualties: number
): M4FieldEngagementStateV0["reputationHooks"] {
  return attackerCasualties === 0
    ? []
    : [
        {
          polityId,
          amount: attackerCasualties,
          reasonCode:
            outcome === "attacker-victory"
              ? "campaign.reputation.costly-victory"
              : "campaign.reputation.defeat-losses"
        }
      ];
}

function m4SupplyReputationHooks(
  polityId: PolityId,
  shortage: number
): M4SiegeStateV0["reputationHooks"] {
  return shortage === 0
    ? []
    : [{ polityId, amount: shortage, reasonCode: "campaign.reputation.siege-supply-failure" }];
}

function isTerminalM4SiegeStatus(status: M4SiegeStatusV0): boolean {
  return status === "surrendered" || status === "lifted" || status === "withdrawn";
}

function compareM4SiegeForChoiceResolution(left: M4SiegeStateV0, right: M4SiegeStateV0): number {
  return (
    left.campaignPlanId - right.campaignPlanId ||
    left.startedDay - right.startedDay ||
    left.siegeId - right.siegeId
  );
}

function minimumTwo(first: number, second: number): number {
  return Math.min(first, second);
}

function rejectEngagementState(path: string, message: string): EvaluationResult {
  return { ok: false, error: { code: "engagement-state-invalid", path, message } };
}

function rejectSiegeState(path: string, message: string): EvaluationResult {
  return { ok: false, error: rejectSiegeStateError(path, message) };
}

function rejectSiegeStateError(path: string, message: string): DomainErrorV1 {
  return { code: "siege-state-invalid", path, message };
}

function evaluateResolveM4CampaignWithdrawal(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.resolve-m4-campaign-withdrawal" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return { ok: false, error: m3MissingDomainError(command.kind) };
  }
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return rejectWithdrawalState("state.m4", "M4 campaign state is missing.");
  }
  const campaignPlanId = parseCampaignPlanId(command.payload.campaignPlanId);
  const campaignPlan = m4.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (campaignPlan === undefined) {
    return badIdError("payload.campaignPlanId", "Withdrawal references missing CampaignPlanId.");
  }
  if (
    campaignPlan.status === "completed" &&
    command.payload.triggerReason !== "objective-complete"
  ) {
    return rejectWithdrawalState("payload.campaignPlanId", "Completed campaign cannot withdraw.");
  }
  if (
    command.payload.triggerReason === "objective-complete" &&
    campaignPlan.status !== "completed"
  ) {
    return rejectWithdrawalState(
      "payload.campaignPlanId",
      "Objective-complete withdrawal requires a completed campaign result."
    );
  }
  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null || !actorHasPolityAuthority(m3, command.actor, ownerPolityId)) {
    return authorityDeniedError();
  }
  const withdrawalId = command.payload.withdrawalId;
  if (m4.withdrawals.some((withdrawal) => withdrawal.withdrawalId === withdrawalId)) {
    return rejectWithdrawalState("payload.withdrawalId", "WithdrawalId already exists.");
  }
  const marchId =
    command.payload.marchId === null ? null : parseCampaignMarchId(command.payload.marchId);
  const march =
    marchId === null
      ? null
      : (m4.marches.find(
          (entry) => entry.marchId === marchId && entry.campaignPlanId === campaignPlanId
        ) ?? null);
  if (marchId !== null && march === null) {
    return badIdError("payload.marchId", "Withdrawal references missing CampaignMarchId.");
  }
  const siegeId = command.payload.siegeId === null ? null : parseSiegeId(command.payload.siegeId);
  const siege =
    siegeId === null
      ? null
      : (m4.sieges.find(
          (entry) => entry.siegeId === siegeId && entry.campaignPlanId === campaignPlanId
        ) ?? null);
  if (siegeId !== null && siege === null) {
    return badIdError("payload.siegeId", "Withdrawal references missing SiegeId.");
  }
  if (command.payload.triggerReason === "objective-complete") {
    const completedResult = validateObjectiveCompleteHandoffResult({
      campaignPlan,
      march,
      siege
    });
    if (!completedResult.ok) {
      return { ok: false, error: completedResult.error };
    }
  }
  if (
    command.payload.triggerReason === "objective-complete" &&
    m4.postwarCandidates.some(
      (candidate) =>
        candidate.settlementId === `m4.campaign.${campaignPlanId}.outcome.1` ||
        candidate.districtId === targetDistrictIdForCampaign(campaignPlan)
    )
  ) {
    return rejectWithdrawalState(
      "payload.campaignPlanId",
      "Campaign already created a postwar candidate."
    );
  }

  const troopsBefore =
    march === null ? plannedM4MusterTroops(m4, campaignPlanId) : march.activeTroops;
  const casualtyCount = withdrawalCasualties(command.payload.triggerReason, troopsBefore);
  const troopsExtracted = troopsBefore - casualtyCount;
  const kind = withdrawalKind(command.payload.triggerReason, march, troopsExtracted);
  const supplyLoss =
    march === null || kind === "orderly-withdrawal" || kind === "cancelled-before-departure"
      ? 0
      : march.supply.carriedGrain;
  if (
    march !== null &&
    kind === "orderly-withdrawal" &&
    campaignGrainSourceLedgerCapacity(m4, campaignPlanId) < march.supply.carriedGrain
  ) {
    return rejectWithdrawalState(
      "payload.marchId",
      "Orderly withdrawal requires auditable grain source ledger capacity."
    );
  }
  const reasonCodes = uniqueSortedText(
    [
      ...command.payload.reasonCodes,
      `withdrawal.trigger.${command.payload.triggerReason}`,
      withdrawalStatusReason(kind),
      ...(casualtyCount > 0 ? ["withdrawal.cost.human-losses"] : [])
    ],
    compareText
  );
  const withdrawal: M4WithdrawalStateV0 = {
    withdrawalId,
    campaignPlanId,
    marchId,
    siegeId,
    kind,
    triggerReason: command.payload.triggerReason,
    troopsBefore,
    troopsExtracted,
    casualties: casualtyCount,
    supplyLoss,
    creditHooks: withdrawalCreditHooks(ownerPolityId, command.payload.triggerReason),
    reputationHooks: withdrawalReputationHooks(ownerPolityId, casualtyCount, supplyLoss),
    reasonCodes,
    resolvedDay: world.meta.currentDay
  };
  const nextM2 = applyWithdrawalSupplyToM2(world.state.m2, march, m4, campaignPlanId, kind);
  const nextMarches = m4.marches.map((entry) =>
    march !== null && entry.marchId === march.marchId
      ? {
          ...entry,
          activeTroops: troopsExtracted,
          status: "cancelled" as const,
          statusReasonCode: withdrawalStatusReason(kind),
          supply: {
            ...entry.supply,
            carriedGrain: kind === "forced-retreat" || kind === "failed-extraction" ? 0 : 0
          },
          reasonCodes: uniqueSortedText([...entry.reasonCodes, ...reasonCodes], compareText),
          updatedDay: world.meta.currentDay
        }
      : entry
  );
  const releasedReservationIds = march === null ? campaignReservationIds(m4, campaignPlanId) : [];
  const nextReservations = m4.grainSupplyReservations.map((reservation) =>
    releasedReservationIds.includes(reservation.reservationId)
      ? {
          ...reservation,
          carriedAmount: 0,
          expectedDaysOfSupply: 0,
          status: "released" as const,
          statusReasonCode: "withdrawal.cancelled-before-departure",
          reasonCodes: uniqueSortedText(
            [...reservation.reasonCodes, "withdrawal.cancelled-before-departure"],
            compareText
          )
        }
      : reservation
  );
  const warOutcome = createWarOutcomeIfNeeded({
    world,
    m4,
    campaignPlan,
    withdrawal,
    siege,
    ownerPolityId,
    triggerReason: command.payload.triggerReason,
    reasonCodes
  });
  if (!warOutcome.ok) {
    return { ok: false, error: warOutcome.error };
  }
  const nextM4: M4CampaignStateV0 = {
    ...m4,
    campaignPlans: m4.campaignPlans.map((plan) =>
      plan.id === campaignPlanId
        ? {
            ...plan,
            objectiveKind:
              command.payload.triggerReason === "objective-complete"
                ? plan.objectiveKind
                : "withdraw",
            status:
              command.payload.triggerReason === "objective-complete" ? "completed" : "cancelled",
            statusReasonCode:
              command.payload.triggerReason === "objective-complete"
                ? "campaign.objective.postwar-candidate-created"
                : "campaign.objective.withdrawn",
            reasonCodes: uniqueSortedText([...plan.reasonCodes, ...reasonCodes], compareText),
            updatedDay: world.meta.currentDay
          }
        : plan
    ),
    grainSupplyReservations: nextReservations,
    marches: nextMarches,
    withdrawals: [...m4.withdrawals, withdrawal],
    warOutcomes:
      warOutcome.value === null ? m4.warOutcomes : [...m4.warOutcomes, warOutcome.value.outcome],
    postwarCandidates:
      warOutcome.value === null
        ? m4.postwarCandidates
        : [...m4.postwarCandidates, warOutcome.value.candidate]
  };
  const accept =
    nextM2 === null
      ? acceptM4CampaignState(world, command, nextM4)
      : acceptM4CampaignAndM2State(world, command, nextM2, nextM4);
  return accept;
}

function rejectWithdrawalState(path: string, message: string): EvaluationResult {
  return { ok: false, error: { code: "withdrawal-state-invalid", path, message } };
}

function withdrawalKind(
  trigger: M4WithdrawalTriggerV0,
  march: M4CampaignMarchStateV0 | null,
  troopsExtracted: number
): M4WithdrawalKindV0 {
  if (march === null) {
    return "cancelled-before-departure";
  }
  if (trigger === "supply" || trigger === "loss") {
    return troopsExtracted === 0 ? "failed-extraction" : "forced-retreat";
  }
  return "orderly-withdrawal";
}

function withdrawalCasualties(trigger: M4WithdrawalTriggerV0, troopsBefore: number): number {
  if (trigger !== "supply" && trigger !== "loss") {
    return 0;
  }
  return minimumTwo(troopsBefore, floorDivide(troopsBefore, 4) + 1);
}

function withdrawalStatusReason(kind: M4WithdrawalKindV0): string {
  switch (kind) {
    case "orderly-withdrawal":
      return "withdrawal.orderly";
    case "forced-retreat":
      return "withdrawal.forced-retreat";
    case "cancelled-before-departure":
      return "withdrawal.cancelled-before-departure";
    case "failed-extraction":
      return "withdrawal.failed-extraction";
  }
}

function validateObjectiveCompleteHandoffResult(input: {
  readonly campaignPlan: M4CampaignPlanStateV0;
  readonly march: M4CampaignMarchStateV0 | null;
  readonly siege: M4SiegeStateV0 | null;
}): { readonly ok: true } | { readonly ok: false; readonly error: DomainErrorV1 } {
  if (input.campaignPlan.status !== "completed") {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.campaignPlanId",
        message: "Objective-complete withdrawal requires a completed campaign result."
      }
    };
  }
  if (input.siege === null) {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.siegeId",
        message: "Objective-complete withdrawal requires a completed siege result reference."
      }
    };
  }
  if (input.siege.status !== "surrendered") {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.siegeId",
        message: "Objective-complete withdrawal requires a surrendered siege result."
      }
    };
  }
  if (input.march === null) {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.marchId",
        message: "Objective-complete withdrawal requires an explicit march result reference."
      }
    };
  }
  if (
    input.campaignPlan.target.kind !== "district" ||
    input.siege.targetDistrictId !== input.campaignPlan.target.districtId
  ) {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.siegeId",
        message: "Objective-complete siege result must match the campaign target."
      }
    };
  }
  if (input.siege.marchId !== input.march.marchId) {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.marchId",
        message: "Objective-complete march must match the completed siege result."
      }
    };
  }
  return { ok: true };
}

function withdrawalCreditHooks(
  polityId: PolityId,
  trigger: M4WithdrawalTriggerV0
): M4WithdrawalStateV0["creditHooks"] {
  return trigger === "objective-complete"
    ? [{ polityId, amount: 1, reasonCode: "campaign.credit.objective-complete" }]
    : [];
}

function withdrawalReputationHooks(
  polityId: PolityId,
  casualties: number,
  supplyLoss: number
): M4WithdrawalStateV0["reputationHooks"] {
  const hooks: M4WithdrawalStateV0["reputationHooks"][number][] = [];
  if (casualties > 0) {
    hooks.push({
      polityId,
      amount: casualties,
      reasonCode: "campaign.reputation.withdrawal-losses"
    });
  }
  if (supplyLoss > 0) {
    hooks.push({
      polityId,
      amount: supplyLoss,
      reasonCode: "campaign.reputation.supply-abandoned"
    });
  }
  return hooks;
}

function applyWithdrawalSupplyToM2(
  m2: M2EconomyPopulationStateV0 | undefined,
  march: M4CampaignMarchStateV0 | null,
  m4: M4CampaignStateV0,
  campaignPlanId: CampaignPlanId,
  kind: M4WithdrawalKindV0
): M2EconomyPopulationStateV0 | null {
  if (m2 === undefined) {
    return null;
  }
  const returnByPopulationGroupId = new Map<number, number>();
  if (march === null) {
    for (const reservation of m4.grainSupplyReservations) {
      if (reservation.campaignPlanId === campaignPlanId && reservation.carriedAmount > 0) {
        addM4ReturnedGrain(
          returnByPopulationGroupId,
          reservation.source.populationGroupId,
          reservation.carriedAmount
        );
      }
    }
  } else if (kind === "orderly-withdrawal" && march.supply.carriedGrain > 0) {
    for (const [populationGroupId, amount] of campaignGrainSourceReturnLedger(
      m4,
      campaignPlanId,
      march.supply.carriedGrain
    )) {
      addM4ReturnedGrain(returnByPopulationGroupId, populationGroupId, amount);
    }
  }
  if (returnByPopulationGroupId.size === 0) {
    return null;
  }
  return canonicalizeM2EconomyPopulationState({
    ...m2,
    populationGroups: m2.populationGroups.map((group) => ({
      ...group,
      grainStock: group.grainStock + (returnByPopulationGroupId.get(group.id) ?? 0)
    }))
  });
}

function addM4ReturnedGrain(
  returnByPopulationGroupId: Map<number, number>,
  populationGroupId: number,
  amount: number
): void {
  returnByPopulationGroupId.set(
    populationGroupId,
    (returnByPopulationGroupId.get(populationGroupId) ?? 0) + amount
  );
}

function campaignGrainSourceLedgerCapacity(
  m4: M4CampaignStateV0,
  campaignPlanId: CampaignPlanId
): number {
  return m4.grainSupplyReservations
    .filter((reservation) => reservation.campaignPlanId === campaignPlanId)
    .reduce(
      (sum, reservation) => sum + Math.max(0, reservation.reservedAmount - reservation.lossAmount),
      0
    );
}

function campaignGrainSourceReturnLedger(
  m4: M4CampaignStateV0,
  campaignPlanId: CampaignPlanId,
  carriedGrain: number
): readonly (readonly [number, number])[] {
  let remaining = carriedGrain;
  const returns: (readonly [number, number])[] = [];
  for (const reservation of m4.grainSupplyReservations
    .filter((entry) => entry.campaignPlanId === campaignPlanId)
    .sort(compareM4GrainReservationForReturnLedger)) {
    if (remaining <= 0) {
      break;
    }
    const auditableAmount = Math.max(0, reservation.reservedAmount - reservation.lossAmount);
    const returnedAmount = minimumTwo(remaining, auditableAmount);
    if (returnedAmount > 0) {
      returns.push([reservation.source.populationGroupId, returnedAmount]);
      remaining -= returnedAmount;
    }
  }
  return returns;
}

function compareM4GrainReservationForReturnLedger(
  left: M4GrainSupplyReservationStateV0,
  right: M4GrainSupplyReservationStateV0
): number {
  return (
    left.reservationId - right.reservationId ||
    compareText(left.source.kind, right.source.kind) ||
    left.source.districtId - right.source.districtId ||
    left.source.populationGroupId - right.source.populationGroupId ||
    left.reservedAmount - right.reservedAmount ||
    left.carriedAmount - right.carriedAmount ||
    left.consumedAmount - right.consumedAmount ||
    left.shortageAmount - right.shortageAmount ||
    left.lossAmount - right.lossAmount ||
    compareNullableText(left.lossReasonCode, right.lossReasonCode) ||
    left.expectedDailyConsumption - right.expectedDailyConsumption ||
    left.expectedDaysOfSupply - right.expectedDaysOfSupply ||
    compareText(left.status, right.status) ||
    compareText(left.statusReasonCode, right.statusReasonCode)
  );
}

function compareNullableText(left: string | null, right: string | null): number {
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

function campaignReservationIds(
  m4: M4CampaignStateV0,
  campaignPlanId: CampaignPlanId
): readonly number[] {
  return m4.grainSupplyReservations
    .filter((reservation) => reservation.campaignPlanId === campaignPlanId)
    .map((reservation) => reservation.reservationId);
}

function targetDistrictIdForCampaign(plan: M4CampaignPlanStateV0): DistrictId | null {
  return plan.target.kind === "district" ? plan.target.districtId : null;
}

function createWarOutcomeIfNeeded(input: {
  readonly world: WorldStateV0;
  readonly m4: M4CampaignStateV0;
  readonly campaignPlan: M4CampaignPlanStateV0;
  readonly withdrawal: M4WithdrawalStateV0;
  readonly siege: M4SiegeStateV0 | null;
  readonly ownerPolityId: PolityId;
  readonly triggerReason: M4WithdrawalTriggerV0;
  readonly reasonCodes: readonly string[];
}):
  | {
      readonly ok: true;
      readonly value: {
        readonly outcome: M4WarOutcomeStateV0;
        readonly candidate: M4PostwarCandidateStateV0;
      } | null;
    }
  | { readonly ok: false; readonly error: DomainErrorV1 } {
  if (input.triggerReason !== "objective-complete") {
    return { ok: true, value: null };
  }
  const targetDistrictId = targetDistrictIdForCampaign(input.campaignPlan);
  if (targetDistrictId === null) {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.campaignPlanId",
        message: "Postwar handoff requires a district campaign target."
      }
    };
  }
  if (input.siege === null || input.siege.status !== "surrendered") {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.siegeId",
        message: "Postwar handoff requires a surrendered siege result."
      }
    };
  }
  const localPolityId =
    input.siege?.defenderPolityId ?? localPolityForDistrict(input.world, targetDistrictId);
  if (localPolityId === null || localPolityId === input.ownerPolityId) {
    return {
      ok: false,
      error: {
        code: "withdrawal-state-invalid",
        path: "payload.campaignPlanId",
        message: "Postwar handoff requires a distinct local polity."
      }
    };
  }
  const outcomeId =
    input.m4.warOutcomes.reduce(
      (maximum, outcome) => (outcome.outcomeId > maximum ? outcome.outcomeId : maximum),
      0
    ) + 1;
  const candidate: M4PostwarCandidateStateV0 = {
    candidateId: `m4.campaign.${input.campaignPlan.id}.candidate.${outcomeId}`,
    sourceWarOutcomeId: outcomeId,
    settlementId: `m4.campaign.${input.campaignPlan.id}.outcome.${outcomeId}`,
    victorPolityId: input.ownerPolityId,
    localPolityId,
    districtId: targetDistrictId,
    validM3Methods: ["direct-control", "restore-vassal-ruler", "tribute-only"],
    reasonCodes: uniqueSortedText(
      [...input.reasonCodes, "postwar.candidate.m3-governance-boundary"],
      compareText
    )
  };
  return {
    ok: true,
    value: {
      candidate,
      outcome: {
        outcomeId,
        campaignPlanId: input.campaignPlan.id,
        victorPolityId: input.ownerPolityId,
        localPolityId,
        targetDistrictId,
        attackerCasualties: input.siege?.attackerCasualties ?? input.withdrawal.casualties,
        defenderCasualties: input.siege?.defenderCasualties ?? 0,
        supplyLoss: (input.siege?.supplyLoss ?? 0) + input.withdrawal.supplyLoss,
        withdrawalId: input.withdrawal.withdrawalId,
        siegeId: input.siege?.siegeId ?? input.withdrawal.siegeId,
        postwarCandidate: candidate,
        reasonCodes: candidate.reasonCodes,
        resolvedDay: input.world.meta.currentDay
      }
    }
  };
}

function localPolityForDistrict(world: WorldStateV0, districtId: DistrictId): PolityId | null {
  const district = world.state.districts.find((entry) => entry.definitionId === districtId);
  return district?.control.kind === "controlled" ? district.control.controllerPolityId : null;
}

function evaluateVerifyStateHash(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.verify-state-hash" }>
): EvaluationResult {
  if (command.expectedHash !== world.meta.stateHash) {
    return {
      ok: false,
      error: {
        code: "hash-mismatch",
        path: "expectedHash",
        message: "sim.verify-state-hash expectedHash does not match committed WorldState hash."
      }
    };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld: world,
      wouldChangeState: false,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.state-hash-verified",
          commandId: command.commandId,
          actor: command.actor,
          day: world.meta.currentDay,
          revision: world.meta.revision,
          stateHash: world.meta.stateHash
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.hash-observed",
          day: world.meta.currentDay,
          revision: world.meta.revision,
          stateHash: world.meta.stateHash
        }
      ]
    }
  };
}

type AppointmentValidationResult =
  | { readonly ok: true; readonly office: M3OfficeStateV0 }
  | { readonly ok: false; readonly error: DomainErrorV1 };

function validateM3AppointmentItem(input: {
  readonly m3: NonNullable<WorldStateV0["state"]["m3"]>;
  readonly actor: CommandActorV1;
  readonly officeId: number;
  readonly characterId: PersonId | null;
  readonly currentOfficeId: number | null;
}): AppointmentValidationResult {
  const office = findM3Office(input.m3, input.officeId);
  if (office === undefined) {
    return {
      ok: false,
      error: { code: "bad-id", path: "payload.officeId", message: "office-missing" }
    };
  }
  if (!actorHasPolityAuthority(input.m3, input.actor, office.polityId)) {
    return { ok: false, error: authorityDeniedDomainError() };
  }
  if (input.characterId === null) {
    return { ok: true, office };
  }

  const character = findM3Character(input.m3, input.characterId);
  if (character === undefined) {
    return {
      ok: false,
      error: { code: "bad-id", path: "payload.characterId", message: "character-missing" }
    };
  }
  const availability = validateM3CharacterAvailability(
    character,
    office.jurisdiction.kind === "district" ? office.jurisdiction.districtId : null
  );
  if (availability !== null) {
    return { ok: false, error: availability };
  }
  if (
    character.polityId !== office.polityId ||
    character.commandBps < office.minimumCommandBps ||
    character.administrationBps < office.minimumAdministrationBps
  ) {
    return {
      ok: false,
      error: {
        code: "office-eligibility-failed",
        path: "payload.characterId",
        message: "office-eligibility-failed"
      }
    };
  }
  const conflictingPrimaryOffice = input.m3.offices.find(
    (entry) =>
      entry.primary &&
      entry.officeId !== office.officeId &&
      entry.officeId !== input.currentOfficeId &&
      entry.holderCharacterId === input.characterId
  );
  if (office.primary && conflictingPrimaryOffice !== undefined) {
    return {
      ok: false,
      error: {
        code: "office-primary-conflict",
        path: "payload.characterId",
        message: "office-primary-conflict"
      }
    };
  }

  return { ok: true, office };
}

function validateM3CharacterAvailability(
  character: M3CharacterStateV0,
  requiredDistrictId: number | null
): DomainErrorV1 | null {
  return validateM3CharacterAvailabilityAtPath(
    character,
    requiredDistrictId,
    "payload.characterId"
  );
}

function validateM3CharacterAvailabilityAtPath(
  character: M3CharacterStateV0,
  requiredDistrictId: number | null,
  path: string
): DomainErrorV1 | null {
  if (!character.alive) {
    return {
      code: "character-unavailable",
      path,
      message: "character-unavailable"
    };
  }
  if (character.incapacitated) {
    return {
      code: "character-unavailable",
      path,
      message: "character-unavailable"
    };
  }
  if (requiredDistrictId !== null && character.currentDistrictId !== requiredDistrictId) {
    return {
      code: "character-location-invalid",
      path,
      message: "character-location-invalid"
    };
  }

  return null;
}

function collectM3BulkPrimaryConflictRejections(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  items: readonly {
    readonly itemId: string;
    readonly officeId: M3OfficeId;
    readonly characterId: PersonId | null;
  }[]
): readonly { readonly itemId: string; readonly reasonCode: string }[] {
  const holderByPrimaryOfficeId = new Map<number, PersonId | null>();
  for (const office of m3.offices) {
    if (office.primary) {
      holderByPrimaryOfficeId.set(office.officeId, office.holderCharacterId);
    }
  }

  for (const item of items) {
    const office = findM3Office(m3, item.officeId);
    if (office?.primary === true) {
      holderByPrimaryOfficeId.set(item.officeId, item.characterId);
    }
  }

  const primaryOfficeIdsByHolderId = new Map<number, number[]>();
  for (const [officeId, holderId] of holderByPrimaryOfficeId) {
    if (holderId === null) {
      continue;
    }
    const officeIds = primaryOfficeIdsByHolderId.get(holderId) ?? [];
    officeIds.push(officeId);
    primaryOfficeIdsByHolderId.set(holderId, officeIds);
  }

  const conflictedPrimaryOfficeIds = new Set<number>();
  for (const officeIds of primaryOfficeIdsByHolderId.values()) {
    if (officeIds.length > 1) {
      for (const officeId of officeIds) {
        conflictedPrimaryOfficeIds.add(officeId);
      }
    }
  }

  return items
    .filter((item) => conflictedPrimaryOfficeIds.has(item.officeId))
    .map((item) => ({ itemId: item.itemId, reasonCode: "office-primary-conflict" }));
}

function applyM3AppointmentItems(input: {
  readonly m3: NonNullable<WorldStateV0["state"]["m3"]>;
  readonly world: WorldStateV0;
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly eventKind: M3AppointmentAuditEventKindV0;
  readonly reasonCode: string;
  readonly items: readonly {
    readonly officeId: M3OfficeId;
    readonly characterId: PersonId | null;
  }[];
}): NonNullable<WorldStateV0["state"]["m3"]> {
  let nextAuditId = nextNumericId(input.m3.appointmentAuditEvents);
  const audits: M3AppointmentAuditEventStateV0[] = [];
  const holderByOfficeId = new Map<number, PersonId | null>();
  for (const item of input.items) {
    holderByOfficeId.set(item.officeId, item.characterId);
  }

  const offices = input.m3.offices.map((office) => {
    const nextHolder = holderByOfficeId.get(office.officeId);
    if (nextHolder === undefined) {
      return office;
    }
    audits.push(
      createM3AppointmentAuditEvent({
        id: parseM3AppointmentAuditEventId(nextAuditId),
        eventKind: input.eventKind,
        world: input.world,
        commandId: input.commandId,
        actor: input.actor,
        officeId: office.officeId,
        characterId: nextHolder,
        policyId: office.policyId,
        districtId: null,
        reasonCode: input.reasonCode
      })
    );
    nextAuditId += 1;
    return { ...office, holderCharacterId: nextHolder };
  });

  return canonicalizeM3PolityVassalageState({
    ...input.m3,
    offices,
    appointmentAuditEvents: [...input.m3.appointmentAuditEvents, ...audits]
  });
}

function commitM3AppointmentWorld(input: {
  readonly world: WorldStateV0;
  readonly command: GameCommandV1;
  readonly nextM3: NonNullable<WorldStateV0["state"]["m3"]>;
  readonly nextM6?: M6DiplomacyLegitimacyStateV0;
  readonly events: readonly DomainEventV1[];
  readonly deltas: readonly StateDeltaV1[];
}): EvaluationResult {
  const nextWorld = commitRuntimeState(input.world, {
    ...input.world.state,
    m3: input.nextM3,
    ...(input.nextM6 === undefined ? {} : { m6: input.nextM6 })
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command: input.command,
      nextWorld,
      wouldChangeState: true,
      events: input.events.map((event) => ({ ...event, revisionAfter: nextWorld.meta.revision })),
      deltas: input.deltas.map((delta) => stampM3Delta(delta, nextWorld))
    }
  };
}

function stampM3Delta(delta: StateDeltaV1, nextWorld: WorldStateV0): StateDeltaV1 {
  switch (delta.kind) {
    case "state.m3-office-updated":
      return { ...delta, revision: nextWorld.meta.revision, stateHash: nextWorld.meta.stateHash };
    case "state.m3-policy-updated":
      return { ...delta, revision: nextWorld.meta.revision, stateHash: nextWorld.meta.stateHash };
    case "state.m3-enfeoffment-updated":
      return { ...delta, revision: nextWorld.meta.revision, stateHash: nextWorld.meta.stateHash };
    case "state.m3-succession-updated":
      return { ...delta, revision: nextWorld.meta.revision, stateHash: nextWorld.meta.stateHash };
    case "state.m6-legitimacy-updated":
      return { ...delta, revision: nextWorld.meta.revision, stateHash: nextWorld.meta.stateHash };
    default:
      return delta;
  }
}

function createM3AppointmentAuditEvent(input: {
  readonly id: M3AppointmentAuditEventId;
  readonly eventKind: M3AppointmentAuditEventKindV0;
  readonly world: WorldStateV0;
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly officeId: M3OfficeId | null;
  readonly characterId: PersonId | null;
  readonly policyId: M3PolicyId | null;
  readonly districtId: DistrictId | null;
  readonly reasonCode: string;
}): M3AppointmentAuditEventStateV0 {
  return {
    id: input.id,
    eventKind: input.eventKind,
    eventDay: input.world.meta.currentDay,
    eventRevision: input.world.meta.revision,
    commandId: input.commandId,
    actor: input.actor,
    officeId: input.officeId,
    characterId: input.characterId,
    policyId: input.policyId,
    districtId: input.districtId,
    reasonCode: input.reasonCode
  };
}

function createM3AppointmentDomainEvent(input: {
  readonly command: GameCommandV1;
  readonly world: WorldStateV0;
  readonly nextM3: NonNullable<WorldStateV0["state"]["m3"]>;
  readonly eventKind: M3AppointmentAuditEventKindV0;
  readonly officeId: M3OfficeId | null;
  readonly characterId: PersonId | null;
  readonly policyId: M3PolicyId | null;
  readonly districtId: DistrictId | null;
  readonly reasonCode: string;
}): DomainEventV1 {
  const auditEvent = input.nextM3.appointmentAuditEvents
    .filter((entry) => entry.commandId === input.command.commandId)
    .find(
      (entry) =>
        entry.eventKind === input.eventKind &&
        entry.officeId === input.officeId &&
        entry.characterId === input.characterId &&
        entry.policyId === input.policyId &&
        entry.districtId === input.districtId
    );
  return {
    schemaVersion: 1,
    kind: "sim.m3-appointment-audited",
    commandId: input.command.commandId,
    actor: input.command.actor,
    auditEventId: auditEvent?.id ?? 0,
    eventKind: input.eventKind,
    officeId: input.officeId,
    characterId: input.characterId,
    policyId: input.policyId,
    districtId: input.districtId,
    reasonCode: input.reasonCode,
    revisionBefore: input.world.meta.revision,
    revisionAfter: input.world.meta.revision + 1
  };
}

function findM3Office(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  officeId: number
): M3OfficeStateV0 | undefined {
  return m3.offices.find((entry) => entry.officeId === officeId);
}

function findM3Character(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  characterId: number
): M3CharacterStateV0 | undefined {
  return m3.characters.find((entry) => entry.characterId === characterId);
}

function findM3SuccessionTriggerOffice(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  characterId: PersonId
): M3OfficeStateV0 | null {
  const office = [...m3.offices]
    .filter(
      (entry) =>
        entry.holderCharacterId === characterId &&
        entry.primary &&
        entry.jurisdiction.kind === "polity"
    )
    .sort((left, right) => left.officeId - right.officeId)[0];
  return office ?? null;
}

function formM3SuccessionCandidates(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  polityId: PolityId,
  unavailableCharacterId: PersonId
): readonly M3SuccessionCandidateStateV0[] {
  const candidates: M3SuccessionCandidateStateV0[] = [];
  const profiles = m3.successionCandidateProfiles
    .filter(
      (profile) => profile.polityId === polityId && profile.characterId !== unavailableCharacterId
    )
    .sort((left, right) => left.characterId - right.characterId);

  for (const profile of profiles) {
    const character = findM3Character(m3, profile.characterId);
    if (character === undefined || !character.alive || character.incapacitated) {
      continue;
    }
    const supportSources = sortSuccessionSupportSources(profile.supportSources).map((source) => ({
      ...source
    }));
    candidates.push({
      characterId: profile.characterId,
      requiresRegency: profile.requiresRegency,
      supportSources,
      supportTotalBps: sumSuccessionSupportBps(supportSources)
    });
  }

  return candidates.sort(compareSuccessionCandidates);
}

function createM3SuccessionCrisis(input: {
  readonly m3: NonNullable<WorldStateV0["state"]["m3"]>;
  readonly world: WorldStateV0;
  readonly polityId: PolityId;
  readonly characterId: PersonId;
  readonly officeId: M3OfficeId;
  readonly triggerKind: "death" | "incapacity" | "abdication";
  readonly candidates: readonly M3SuccessionCandidateStateV0[];
  readonly reasonCode: string;
}): M3SuccessionCrisisStateV0 {
  return {
    id: parseM3SuccessionId(nextNumericId(input.m3.successionCrises)),
    polityId: input.polityId,
    trigger: {
      kind: input.triggerKind,
      characterId: input.characterId,
      officeId: input.officeId
    },
    status: "pending",
    startedDay: input.world.meta.currentDay,
    resolvedDay: null,
    candidates: input.candidates,
    outcome: null,
    reasonCode: input.reasonCode
  };
}

function resolveM3SuccessionOutcome(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  crisis: M3SuccessionCrisisStateV0,
  reasonCode: string
):
  | { readonly ok: true; readonly outcome: M3SuccessionOutcomeV0 }
  | { readonly ok: false; readonly error: DomainErrorV1 } {
  const ordered = [...crisis.candidates].sort(compareSuccessionCandidates);
  const leading = ordered[0];
  if (leading === undefined) {
    throw new Error("resolveM3SuccessionOutcome requires at least one candidate.");
  }
  const rival = ordered[1];
  const margin =
    rival === undefined ? leading.supportTotalBps : leading.supportTotalBps - rival.supportTotalBps;
  if (leading.requiresRegency) {
    const regent = findM3RegentCandidate(m3, crisis.polityId, leading.characterId);
    if (regent !== null) {
      return {
        ok: true,
        outcome: {
          kind: "regency",
          successorCharacterId: leading.characterId,
          regentCharacterId: regent.characterId,
          supportTotalBps: leading.supportTotalBps,
          reasonCode
        }
      };
    }
  }
  if (leading.supportTotalBps >= 6_000 && margin >= 1_500) {
    return {
      ok: true,
      outcome: {
        kind: "peaceful",
        successorCharacterId: leading.characterId,
        supportTotalBps: leading.supportTotalBps
      }
    };
  }
  if (rival === undefined) {
    return {
      ok: false,
      error: {
        code: "succession-state-invalid",
        path: "state.m3.successionCrises.candidates",
        message: "sim.resolve-succession requires a rival candidate for disputed succession."
      }
    };
  }
  return {
    ok: true,
    outcome: {
      kind: "disputed",
      leadingCharacterId: leading.characterId,
      rivalCharacterId: rival.characterId,
      supportMarginBps: margin,
      reasonCode
    }
  };
}

function applyM3SuccessionOutcomeToOffices(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  crisis: M3SuccessionCrisisStateV0,
  outcome: M3SuccessionOutcomeV0
): readonly M3OfficeStateV0[] {
  const officeId = crisis.trigger.officeId;
  if (officeId === null || outcome.kind === "disputed") {
    return m3.offices;
  }
  const successorCharacterId = outcome.successorCharacterId;
  return m3.offices.map((office) => {
    if (office.primary && office.holderCharacterId === successorCharacterId) {
      return { ...office, holderCharacterId: null };
    }
    if (office.officeId === officeId) {
      return { ...office, holderCharacterId: successorCharacterId };
    }
    return office;
  });
}

function findM3RegentCandidate(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  polityId: PolityId,
  successorCharacterId: PersonId
): M3CharacterStateV0 | null {
  const regent = [...m3.characters]
    .filter(
      (character) =>
        character.polityId === polityId &&
        character.characterId !== successorCharacterId &&
        character.alive &&
        !character.incapacitated
    )
    .sort(
      (left, right) =>
        right.administrationBps - left.administrationBps || left.characterId - right.characterId
    )[0];
  return regent ?? null;
}

function createM3SuccessionDomainEvent(input: {
  readonly command: GameCommandV1;
  readonly world: WorldStateV0;
  readonly crisis: M3SuccessionCrisisStateV0;
  readonly outcomeKind: "disputed" | "peaceful" | "regency" | null;
}): DomainEventV1 {
  return {
    schemaVersion: 1,
    kind: "sim.m3-succession-updated",
    commandId: input.command.commandId,
    actor: input.command.actor,
    successionId: input.crisis.id,
    polityId: input.crisis.polityId,
    status: input.crisis.status,
    outcomeKind: input.outcomeKind,
    revisionBefore: input.world.meta.revision,
    revisionAfter: input.world.meta.revision + 1
  };
}

function compareSuccessionCandidates(
  left: M3SuccessionCandidateStateV0,
  right: M3SuccessionCandidateStateV0
): number {
  return right.supportTotalBps - left.supportTotalBps || left.characterId - right.characterId;
}

function sortSuccessionSupportSources(
  values: readonly M3SuccessionSupportSourceStateV0[]
): readonly M3SuccessionSupportSourceStateV0[] {
  return [...values].sort(
    (left, right) =>
      successionSupportKindRank(left.kind) - successionSupportKindRank(right.kind) ||
      compareText(left.sourceId, right.sourceId) ||
      left.strengthBps - right.strengthBps
  );
}

function successionSupportKindRank(kind: M3SuccessionSupportSourceStateV0["kind"]): number {
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

function sumSuccessionSupportBps(
  supportSources: readonly M3SuccessionSupportSourceStateV0[]
): number {
  const total = supportSources.reduce((sum, source) => sum + source.strengthBps, 0);
  return clampBps(total);
}

function polityForPolicyTarget(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  target: M3PolicyTargetV0
): PolityId | null {
  switch (target.kind) {
    case "polity":
      return target.polityId;
    case "district": {
      const row = m3.administrativeDistricts.find(
        (entry) => entry.districtId === target.districtId
      );
      return row?.polityId ?? null;
    }
    case "office": {
      const office = findM3Office(m3, target.officeId);
      return office?.polityId ?? null;
    }
  }
}

function actorHasPolityAuthority(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  actor: CommandActorV1,
  polityId: PolityId
): boolean {
  if (actor.kind === "system") {
    return true;
  }
  if (
    actor.id === `polity:${polityId}` &&
    m3.polities.some((entry) => entry.polityId === polityId)
  ) {
    return true;
  }
  const officeId = parseActorOfficeId(actor.id);
  if (officeId !== null) {
    const office = findM3Office(m3, officeId);
    if (office === undefined || office.polityId !== polityId || office.holderCharacterId === null) {
      return false;
    }
    const holder = findM3Character(m3, office.holderCharacterId);
    return holder !== undefined && holder.alive && !holder.incapacitated;
  }
  const characterId = parseActorCharacterId(actor.id);
  if (characterId === null) {
    return false;
  }
  const character = findM3Character(m3, characterId);
  return (
    character !== undefined &&
    character.polityId === polityId &&
    character.alive &&
    !character.incapacitated
  );
}

function validateM6PolityActorAuthority(
  world: WorldStateV0,
  actor: CommandActorV1,
  polityId: PolityId,
  commandKind: string
): DomainErrorV1 | null {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingDomainError(commandKind);
  }
  return actorHasPolityAuthority(m3, actor, polityId) ? null : authorityDeniedDomainError();
}

function validateM6LegitimacyActorAuthority(actor: CommandActorV1): DomainErrorV1 | null {
  if (
    actor.kind === "system" &&
    (actor.id === "m6-legitimacy" ||
      actor.id === "m3.succession" ||
      actor.id === "m4.postwar" ||
      actor.id === "m6.validation")
  ) {
    return null;
  }

  return {
    code: "authority-denied",
    path: "actor.id",
    message: "sim.record-legitimacy-source requires an M6 domain-authorized system actor."
  };
}

function parseActorOfficeId(actorId: string): M3OfficeId | null {
  if (!actorId.startsWith("office:")) {
    return null;
  }
  const raw = Number(actorId.slice("office:".length));
  if (!Number.isSafeInteger(raw) || raw <= 0) {
    return null;
  }
  return parseM3OfficeId(raw);
}

function parseActorCharacterId(actorId: string): PersonId | null {
  if (!actorId.startsWith("character:")) {
    return null;
  }
  const raw = Number(actorId.slice("character:".length));
  if (!Number.isSafeInteger(raw) || raw <= 0) {
    return null;
  }
  return parsePersonId(raw);
}

function authorityDeniedError(): EvaluationResult {
  return {
    ok: false,
    error: authorityDeniedDomainError()
  };
}

function authorityDeniedDomainError(): DomainErrorV1 {
  return {
    code: "authority-denied",
    path: "actor.id",
    message: "Command actor lacks polity or office authority."
  };
}

function m3MissingError(commandKind: string): EvaluationResult {
  return {
    ok: false,
    error: m3MissingDomainError(commandKind)
  };
}

function m3MissingDomainError(commandKind: string): DomainErrorV1 {
  return {
    code: "m3-state-missing",
    path: "state.m3",
    message: `${commandKind} requires an M3 polity vassalage state.`
  };
}

function badIdError(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: badIdDomainError(path, message)
  };
}

function badIdDomainError(path: string, message: string): DomainErrorV1 {
  return {
    code: "bad-id",
    path,
    message
  };
}

function wouldCreateSuzerainCycle(
  polities: readonly M3PolityRecordStateV0[],
  polityId: PolityId,
  nextSuzerainPolityId: PolityId
): boolean {
  const suzerainByPolityId = new Map<number, number>();
  for (const polity of polities) {
    if (polity.polityId === polityId) {
      suzerainByPolityId.set(polityId, nextSuzerainPolityId);
    } else if (polity.directSuzerainPolityId !== null) {
      suzerainByPolityId.set(polity.polityId, polity.directSuzerainPolityId);
    }
  }

  const visited = new Set<number>();
  let current: number | undefined = polityId;
  while (current !== undefined) {
    if (visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = suzerainByPolityId.get(current);
  }

  return false;
}

function nextNumericId(values: readonly { readonly id: number }[]): number {
  let maximumId = 0;
  for (const value of values) {
    if (value.id > maximumId) {
      maximumId = value.id;
    }
  }
  return maximumId + 1;
}

function copyCommandRequirement(
  requirement: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-obligation" }
  >["payload"]["requirement"]
): M3ObligationRequirementV0 {
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

function copyCommandDue(
  due: Extract<GameCommandV1, { readonly kind: "sim.create-obligation" }>["payload"]["due"]
): M3ObligationDueV0 {
  switch (due.kind) {
    case "cadence":
      return {
        kind: "cadence",
        periodDays: due.periodDays,
        nextDueDay: parseGameDay(due.nextDueDay)
      };
    case "trigger":
      return {
        kind: "trigger",
        triggerKey: due.triggerKey
      };
  }
}

function createInitialObligationAccounting(
  requirement: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-obligation" }
  >["payload"]["requirement"],
  due: Extract<GameCommandV1, { readonly kind: "sim.create-obligation" }>["payload"]["due"]
): M3ObligationStateV0["accounting"] {
  const nominalAmount = requirement.kind === "amount" ? requirement.amount : 0;
  return {
    nominalAmount,
    dueAmount: nominalAmount,
    deliveredAmount: 0,
    arrearsAmount: nominalAmount,
    defaultedAmount: 0,
    remittedAmount: 0,
    dueDay: parseGameDay(due.kind === "cadence" ? due.nextDueDay : 0),
    cycle: 1,
    troopResponseState: "none"
  };
}

function validateObligationDuePeriod(
  obligation: M3ObligationStateV0,
  dueDay: number
): DomainErrorV1 | null {
  if (obligation.due.kind !== "cadence") {
    return {
      code: "obligation-due-period-invalid",
      path: "payload.dueDay",
      message: "sim.record-obligation-fulfillment currently supports cadence obligations only."
    };
  }
  if (dueDay !== obligation.accounting.dueDay) {
    return {
      code: "obligation-due-period-invalid",
      path: "payload.dueDay",
      message:
        "sim.record-obligation-fulfillment dueDay does not match current obligation due period."
    };
  }
  return null;
}

function validateObligationSettlementActor(
  obligation: M3ObligationStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): DomainErrorV1 | null {
  if (command.actor.kind === "system") {
    return null;
  }
  const expectedPolityId =
    command.payload.actionKind === "remission" ||
    command.payload.actionKind === "pursuit-recovery" ||
    command.payload.actionKind === "default-breach"
      ? obligation.creditorPolityId
      : obligation.debtorPolityId;
  if (command.actor.id !== `polity:${expectedPolityId}`) {
    return {
      code: "obligation-actor-invalid",
      path: "actor.id",
      message: "sim.record-obligation-fulfillment actor must match the acting obligation polity."
    };
  }
  return null;
}

function hasTerminalSettlementForDueDay(
  m3: M3PolityVassalageStateV0,
  obligationId: number,
  dueDay: number
): boolean {
  return m3.fulfillmentClaims.some(
    (claim) =>
      claim.obligationId === obligationId &&
      claim.dueDay === dueDay &&
      isTerminalObligationSettlementAction(claim.actionKind)
  );
}

function isTerminalObligationSettlementAction(
  actionKind: Extract<
    GameCommandV1,
    { readonly kind: "sim.record-obligation-fulfillment" }
  >["payload"]["actionKind"]
): boolean {
  return (
    actionKind === "fulfillment" || actionKind === "remission" || actionKind === "default-breach"
  );
}

function validateObligationSettlementRules(
  obligation: M3ObligationStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): DomainErrorV1 | null {
  const remainingAmount = obligation.accounting.dueAmount - obligation.accounting.deliveredAmount;
  switch (command.payload.actionKind) {
    case "fulfillment":
      if (
        command.payload.fulfilledAmount <= 0 ||
        command.payload.fulfilledAmount !== remainingAmount
      ) {
        return obligationSettlementInvalid(
          "payload.fulfilledAmount",
          "sim.record-obligation-fulfillment fulfillment must exactly satisfy the remaining due amount."
        );
      }
      return null;
    case "partial-fulfillment":
      if (
        command.payload.fulfilledAmount <= 0 ||
        command.payload.fulfilledAmount >= remainingAmount
      ) {
        return obligationSettlementInvalid(
          "payload.fulfilledAmount",
          "sim.record-obligation-fulfillment partial-fulfillment must be positive and leave arrears for the due period."
        );
      }
      return null;
    case "deferral":
      if (obligation.accounting.deliveredAmount !== 0) {
        return obligationSettlementInvalid(
          "payload.actionKind",
          "sim.record-obligation-fulfillment deferral is only valid before current due-period delivery begins."
        );
      }
      if (command.payload.fulfilledAmount !== 0) {
        return obligationSettlementInvalid(
          "payload.fulfilledAmount",
          "sim.record-obligation-fulfillment non-resource settlement actions must use fulfilledAmount 0."
        );
      }
      return null;
    case "refusal":
    case "remission":
    case "pursuit-recovery":
    case "default-breach":
      if (command.payload.fulfilledAmount !== 0) {
        return obligationSettlementInvalid(
          "payload.fulfilledAmount",
          "sim.record-obligation-fulfillment non-resource settlement actions must use fulfilledAmount 0."
        );
      }
      return null;
  }
}

function obligationSettlementInvalid(path: string, message: string): DomainErrorV1 {
  return {
    code: "obligation-settlement-invalid",
    path,
    message
  };
}

type ObligationResourcePlan =
  | { readonly ok: true; readonly movements: readonly M3FulfillmentSourceMovementStateV0[] }
  | { readonly ok: false; readonly error: DomainErrorV1 };

function planObligationResourceMovement(
  world: WorldStateV0,
  obligation: M3ObligationStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): ObligationResourcePlan {
  if (
    command.payload.actionKind !== "fulfillment" &&
    command.payload.actionKind !== "partial-fulfillment"
  ) {
    return { ok: true, movements: [] };
  }
  if (command.payload.fulfilledAmount === 0) {
    return { ok: true, movements: [] };
  }
  if (obligation.requirement.kind !== "amount") {
    return { ok: true, movements: [] };
  }
  if (obligation.requirement.resourceKind === "troops") {
    return {
      ok: true,
      movements: [
        {
          kind: "m3-troop-commitment-placeholder",
          debtorPolityId: obligation.debtorPolityId,
          headcount: command.payload.fulfilledAmount
        }
      ]
    };
  }
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return {
      ok: false,
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.record-obligation-fulfillment requires M2 resources for tribute settlement."
      }
    };
  }

  const sourceDistrictIds = sourceDistrictIdsForPolity(world, obligation.debtorPolityId);
  const movements: M3FulfillmentSourceMovementStateV0[] = [];
  let remainingAmount = command.payload.fulfilledAmount;
  for (const group of m2.populationGroups) {
    if (!sourceDistrictIds.has(group.districtId)) {
      continue;
    }
    const availableAmount =
      obligation.requirement.resourceKind === "cash" ? group.cashStock : group.grainStock;
    const movedAmount = Math.min(remainingAmount, availableAmount);
    if (movedAmount > 0) {
      movements.push({
        kind: "m2-population-group",
        populationGroupId: group.id,
        districtId: group.districtId,
        resourceKind: obligation.requirement.resourceKind,
        amount: movedAmount
      });
      remainingAmount -= movedAmount;
    }
    if (remainingAmount === 0) {
      return { ok: true, movements };
    }
  }

  return {
    ok: false,
    error: {
      code: "obligation-resource-insufficient",
      path: "payload.fulfilledAmount",
      message:
        "sim.record-obligation-fulfillment cannot draw the requested amount from debtor sources."
    }
  };
}

function sourceDistrictIdsForPolity(world: WorldStateV0, polityId: PolityId): ReadonlySet<number> {
  const districtIds = new Set<number>();
  for (const district of world.state.districts) {
    if (
      district.control.kind === "controlled" &&
      district.control.controllerPolityId === polityId
    ) {
      districtIds.add(district.definitionId);
    }
  }
  const m3 = world.state.m3;
  if (m3 !== undefined) {
    for (const district of m3.administrativeDistricts) {
      if (district.polityId === polityId) {
        districtIds.add(district.districtId);
      }
    }
  }
  return districtIds;
}

function applyObligationResourceMovement(
  m2: M2EconomyPopulationStateV0,
  movements: readonly M3FulfillmentSourceMovementStateV0[]
): M2EconomyPopulationStateV0 {
  if (movements.length === 0) {
    return m2;
  }
  return canonicalizeM2EconomyPopulationState({
    ...m2,
    populationGroups: m2.populationGroups.map((group) => {
      const groupMovements = movements.filter(
        (movement) =>
          movement.kind === "m2-population-group" && movement.populationGroupId === group.id
      );
      if (groupMovements.length === 0) {
        return group;
      }
      let cashDelta = 0;
      let grainDelta = 0;
      for (const movement of groupMovements) {
        if (movement.kind === "m2-population-group") {
          if (movement.resourceKind === "cash") {
            cashDelta += movement.amount;
          } else {
            grainDelta += movement.amount;
          }
        }
      }
      return {
        ...group,
        cashStock: group.cashStock - cashDelta,
        grainStock: group.grainStock - grainDelta
      };
    })
  });
}

function applyObligationSettlementAccounting(
  obligation: M3ObligationStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): {
  readonly due: M3ObligationDueV0;
  readonly accounting: M3ObligationStateV0["accounting"];
  readonly status: M3ObligationStatusV0;
  readonly disputeReasonCode: string | null;
  readonly breachReasonCode: string | null;
} {
  const deliveredAmount = Math.min(
    obligation.accounting.dueAmount,
    obligation.accounting.deliveredAmount + command.payload.fulfilledAmount
  );
  const arrearsAfterDelivery = Math.max(obligation.accounting.dueAmount - deliveredAmount, 0);
  const defaultedAmount =
    command.payload.actionKind === "default-breach"
      ? obligation.accounting.defaultedAmount + arrearsAfterDelivery
      : obligation.accounting.defaultedAmount;
  const remittedAmount =
    command.payload.actionKind === "remission"
      ? obligation.accounting.remittedAmount + arrearsAfterDelivery
      : obligation.accounting.remittedAmount;
  const arrearsAmount = command.payload.actionKind === "remission" ? 0 : arrearsAfterDelivery;
  const status = nextObligationStatus(obligation.status, command.payload.actionKind);
  const nextDue = nextObligationDue(obligation.due, command.payload.actionKind);
  const nextAccounting =
    command.payload.actionKind === "deferral" && nextDue.kind === "cadence"
      ? {
          ...obligation.accounting,
          deliveredAmount: 0,
          arrearsAmount: obligation.accounting.dueAmount,
          dueDay: nextDue.nextDueDay,
          cycle: obligation.accounting.cycle + 1,
          troopResponseState: nextTroopResponseState(
            obligation.accounting.troopResponseState,
            obligation.obligationKind,
            command.payload.actionKind,
            deliveredAmount
          )
        }
      : {
          ...obligation.accounting,
          deliveredAmount,
          arrearsAmount,
          defaultedAmount,
          remittedAmount,
          troopResponseState: nextTroopResponseState(
            obligation.accounting.troopResponseState,
            obligation.obligationKind,
            command.payload.actionKind,
            deliveredAmount
          )
        };
  return {
    due: nextDue,
    accounting: nextAccounting,
    status,
    disputeReasonCode:
      command.payload.actionKind === "refusal"
        ? command.payload.reasonCode
        : obligation.disputeReasonCode,
    breachReasonCode:
      command.payload.actionKind === "default-breach"
        ? command.payload.reasonCode
        : obligation.breachReasonCode
  };
}

function nextObligationDue(
  due: M3ObligationDueV0,
  actionKind: Extract<
    GameCommandV1,
    { readonly kind: "sim.record-obligation-fulfillment" }
  >["payload"]["actionKind"]
): M3ObligationDueV0 {
  if (due.kind !== "cadence") {
    return due;
  }
  if (actionKind === "deferral") {
    return { ...due, nextDueDay: parseGameDay(due.nextDueDay + due.periodDays) };
  }
  return due;
}

function nextObligationStatus(
  currentStatus: M3ObligationStatusV0,
  actionKind: Extract<
    GameCommandV1,
    { readonly kind: "sim.record-obligation-fulfillment" }
  >["payload"]["actionKind"]
): M3ObligationStatusV0 {
  switch (actionKind) {
    case "refusal":
      return "disputed";
    case "default-breach":
      return "breached";
    case "fulfillment":
    case "partial-fulfillment":
    case "deferral":
    case "remission":
    case "pursuit-recovery":
      return currentStatus;
  }
}

function nextTroopResponseState(
  currentState: M3ObligationStateV0["accounting"]["troopResponseState"],
  obligationKind: M3ObligationStateV0["obligationKind"],
  actionKind: Extract<
    GameCommandV1,
    { readonly kind: "sim.record-obligation-fulfillment" }
  >["payload"]["actionKind"],
  deliveredAmount: number
): M3ObligationStateV0["accounting"]["troopResponseState"] {
  if (obligationKind !== "troop") {
    return currentState;
  }
  switch (actionKind) {
    case "fulfillment":
    case "partial-fulfillment":
      return deliveredAmount > 0 ? "committed" : currentState;
    case "deferral":
      return "deferred";
    case "refusal":
      return "refused";
    case "remission":
      return "remitted";
    case "pursuit-recovery":
      return "recovery-pursued";
    case "default-breach":
      return "breached";
  }
}

function explainObligationSettlement(
  world: WorldStateV0,
  m3: M3PolityVassalageStateV0,
  obligation: M3ObligationStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): { readonly reasonCodes: readonly string[]; readonly reliabilityBps: number } {
  const reliabilityBps = computeObligationReliabilityBps(m3, obligation.debtorPolityId);
  return {
    reliabilityBps,
    reasonCodes: [
      `obligation.action.${command.payload.actionKind}`,
      `obligation.kind.${obligation.obligationCategory}`,
      reliabilityBps >= 7_000
        ? "obligation.reliability.admin-stable"
        : "obligation.reliability.admin-strained",
      executorReasonCode(world, command.payload.executorCharacterId)
    ]
  };
}

function computeObligationReliabilityBps(m3: M3PolityVassalageStateV0, polityId: PolityId): number {
  const profiles = m3.administrativeDistricts
    .filter((entry) => entry.polityId === polityId)
    .map((entry) => computeM3AdministrativeBurdenProfileV0(entry));
  if (profiles.length === 0) {
    return 5_000;
  }
  const total = profiles.reduce((sum, profile) => sum + profile.obligationReliabilityBps, 0);
  return Math.floor(total / profiles.length);
}

function executorReasonCode(world: WorldStateV0, executorCharacterId: number | null): string {
  if (executorCharacterId === null) {
    return "obligation.executor.none";
  }
  const character = world.state.m3?.characters.find(
    (entry) => entry.characterId === executorCharacterId
  );
  if (character === undefined || !character.alive || character.incapacitated) {
    return "obligation.executor.unavailable";
  }
  const skill = Math.max(character.administrationBps, character.commandBps, character.diplomacyBps);
  return skill >= 7_000
    ? "obligation.executor.character-strong"
    : "obligation.executor.character-weak";
}

function createM3AuditEvent(input: {
  readonly id: number;
  readonly obligationId: number;
  readonly eventKind: M3ObligationAuditEventStateV0["eventKind"];
  readonly world: WorldStateV0;
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly actionKind: M3ObligationAuditEventStateV0["actionKind"];
  readonly dueDay: number | null;
  readonly fulfillmentId: number | null;
  readonly fulfilledAmount: number | null;
  readonly statusAfter: M3ObligationStatusV0;
  readonly reasonCode: string | null;
  readonly reasonCodes: readonly string[];
  readonly reliabilityBps: number;
}): M3ObligationAuditEventStateV0 {
  return {
    id: parseM3ObligationAuditEventId(input.id),
    obligationId: parseM3ObligationId(input.obligationId),
    eventKind: input.eventKind,
    eventDay: input.world.meta.currentDay,
    eventRevision: input.world.meta.revision,
    commandId: input.commandId,
    actor: {
      kind: input.actor.kind,
      id: input.actor.id
    },
    actionKind: input.actionKind,
    dueDay: input.dueDay === null ? null : parseGameDay(input.dueDay),
    fulfillmentId: input.fulfillmentId === null ? null : parseM3FulfillmentId(input.fulfillmentId),
    fulfilledAmount: input.fulfilledAmount,
    statusAfter: input.statusAfter,
    reasonCode: input.reasonCode,
    reasonCodes: [...input.reasonCodes],
    reliabilityBps: input.reliabilityBps
  };
}

function executeQuery(runtime: SimulationRuntimeV1, query: GameQueryV1): QueryResultV1 {
  switch (query.kind) {
    case "sim.get-state-hash":
      return {
        status: "ok",
        result: {
          kind: query.kind,
          day: runtime.world.meta.currentDay,
          revision: runtime.world.meta.revision,
          stateHash: runtime.world.meta.stateHash
        }
      };
    case "sim.get-calendar":
      return {
        status: "ok",
        result: {
          kind: query.kind,
          day: runtime.world.meta.currentDay,
          revision: runtime.world.meta.revision
        }
      };
    case "sim.list-district-summaries":
      return {
        status: "ok",
        result: {
          kind: query.kind,
          day: runtime.world.meta.currentDay,
          revision: runtime.world.meta.revision,
          districts: runtime.world.definitions.districts.map((definition) => {
            const state = runtime.world.state.districts.find(
              (entry) => entry.definitionId === definition.id
            );
            return {
              districtId: definition.id,
              displayNameKey: definition.displayNameKey,
              control:
                state === undefined
                  ? copyDistrictControlState({ kind: "uncontrolled" })
                  : copyDistrictControlState(state.control)
            };
          })
        }
      };
    case "sim.list-map-topology":
      return executeListMapTopologyQuery(runtime);
    case "sim.list-m2-economy-summaries":
      return executeM2EconomySummariesQuery(runtime);
    case "sim.list-m3-administrative-burden":
      return executeM3AdministrativeBurdenQuery(runtime);
    case "sim.list-m3-decision-scaffolds":
      return executeM3DecisionScaffoldsQuery(runtime);
    case "sim.list-m3-succession-crises":
      return executeM3SuccessionCrisesQuery(runtime);
    case "sim.preview-m2-transport-route":
      return executeM2TransportRoutePreviewQuery(runtime, query);
    case "sim.preview-map-topology-path":
      return executeMapTopologyPathPreviewQuery(runtime, query);
    case "sim.preview-m3-postwar-governance":
      return executeM3PostwarGovernancePreviewQuery(runtime, query);
    case "sim.compare-m3-postwar-governance-outcomes":
      return executeM3PostwarGovernanceOutcomesQuery(runtime, query);
    case "sim.list-m4-campaign-plans":
      return executeM4CampaignPlansQuery(runtime);
    case "sim.list-m4-faction-knowledge":
      return executeM4FactionKnowledgeQuery(runtime, query);
    case "sim.list-m4-muster-commitments":
      return executeM4MusterCommitmentsQuery(runtime, query);
    case "sim.preview-m4-grain-supply":
      return executeM4GrainSupplyPreviewQuery(runtime, query);
    case "sim.preview-m4-route-transport-capacity":
      return executeM4RouteTransportCapacityPreviewQuery(runtime, query);
    case "sim.list-m4-march-state":
      return executeM4MarchStateQuery(runtime, query);
    case "sim.list-m4-siege-state":
      return executeM4SiegeStateQuery(runtime, query);
    case "sim.list-m4-withdrawal-state":
      return executeM4WithdrawalStateQuery(runtime, query);
    case "sim.list-m4-war-outcomes":
      return executeM4WarOutcomesQuery(runtime, query);
    case "sim.list-m6-diplomacy":
      return executeM6DiplomacyQuery(runtime, query);
    case "sim.list-m6-recognized-order":
      return executeM6RecognizedOrderQuery(runtime, query);
    case "sim.get-m6-alpha-terminal-state":
      return executeM6AlphaTerminalStateQuery(runtime, query);
  }
}

function executeM4CampaignPlansQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const m4 = runtime.world.state.m4;
  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-campaign-plans",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      plans:
        m4?.campaignPlans.map((plan) => ({
          campaignPlanId: plan.id,
          owner: copyM4CampaignOwner(plan.owner),
          target: copyM4CampaignTarget(plan.target),
          objectiveKind: plan.objectiveKind,
          status: plan.status,
          statusReasonCode: plan.statusReasonCode,
          reasonCodes: [...plan.reasonCodes],
          forecast: forecastM4CampaignPlan(runtime.world, plan)
        })) ?? []
    }
  };
}

function executeM4FactionKnowledgeQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m4-faction-knowledge" }>
): QueryResultV1 {
  const observerPolityId = parsePolityId(query.payload.observerPolityId);
  if (!runtime.world.definitions.polities.some((polity) => polity.id === observerPolityId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.observerPolityId",
        message: "sim.list-m4-faction-knowledge references a missing observer PolityId."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-faction-knowledge",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      observerPolityId,
      snapshots:
        runtime.world.state.m4?.factionKnowledgeSnapshots
          .filter((snapshot) => snapshot.observerPolityId === observerPolityId)
          .map(copyM4KnowledgeSnapshotReadModel) ?? []
    }
  };
}

function forecastM4CampaignPlan(
  world: WorldStateV0,
  plan: M4CampaignPlanStateV0
): M4CampaignForecastReadModelV1 {
  if (plan.status === "cancelled") {
    return {
      status: "cancelled",
      earliestStartDay: plan.startWindow.earliestDay,
      latestStartDay: plan.startWindow.latestDay,
      reasonCodes: [plan.statusReasonCode]
    };
  }
  if (plan.status === "completed") {
    return {
      status: "completed",
      earliestStartDay: plan.startWindow.earliestDay,
      latestStartDay: plan.startWindow.latestDay,
      reasonCodes: [plan.statusReasonCode]
    };
  }
  if (world.meta.currentDay > plan.startWindow.latestDay) {
    return {
      status: "blocked",
      earliestStartDay: plan.startWindow.earliestDay,
      latestStartDay: plan.startWindow.latestDay,
      reasonCodes: ["campaign.forecast.start-range-expired", plan.statusReasonCode]
    };
  }

  return {
    status: "ready",
    earliestStartDay: plan.startWindow.earliestDay,
    latestStartDay: plan.startWindow.latestDay,
    reasonCodes: ["campaign.forecast.start-range-open"]
  };
}

function copyM4KnowledgeSnapshotReadModel(
  snapshot: M4FactionKnowledgeSnapshotStateV0
): M4FactionKnowledgeSnapshotReadModelV1 {
  return {
    snapshotId: snapshot.snapshotId,
    observerPolityId: snapshot.observerPolityId,
    subjectPolityId: snapshot.subjectPolityId,
    knowledgeVersion: snapshot.knowledgeVersion,
    recordedDay: snapshot.recordedDay,
    source: { ...snapshot.source },
    knownObjectives: snapshot.knownObjectives.map((objective) => ({
      campaignPlanId: objective.campaignPlanId,
      target: copyM4CampaignTarget(objective.target),
      objectiveKind: objective.objectiveKind,
      confidenceBps: objective.confidenceBps,
      reasonCodes: [...objective.reasonCodes]
    })),
    routeEstimates: snapshot.routeEstimates.map((estimate) => ({ ...estimate })),
    supplyEstimates: snapshot.supplyEstimates.map((estimate) => ({ ...estimate })),
    defenderEstimates: snapshot.defenderEstimates.map((estimate) => ({
      target: copyM4CampaignTarget(estimate.target),
      defenderMin: estimate.defenderMin,
      defenderMax: estimate.defenderMax,
      confidenceBps: estimate.confidenceBps
    })),
    reasonCodes: ["faction-knowledge.snapshot.visible"]
  };
}

function executeM4MusterCommitmentsQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m4-muster-commitments" }>
): QueryResultV1 {
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const m4 = runtime.world.state.m4;
  if (m4 === undefined || !m4.campaignPlans.some((plan) => plan.id === campaignPlanId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.list-m4-muster-commitments references a missing CampaignPlanId."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-muster-commitments",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      commitments: m4.mobilizedForceCommitments
        .filter((commitment) => commitment.campaignPlanId === campaignPlanId)
        .map(copyM4MusterCommitmentReadModel),
      reasonCodes: ["muster.query.filtered-by-campaign"]
    }
  };
}

function copyM4MusterCommitmentReadModel(
  commitment: M4MobilizedForceCommitmentStateV0
): M4MusterCommitmentReadModelV1 {
  return {
    commitmentId: commitment.id,
    campaignPlanId: commitment.campaignPlanId,
    source: copyM4MusterCommitmentSource(commitment.source),
    promisedTroops: commitment.promisedTroops,
    dueDay: commitment.dueDay,
    assemblyWindow: {
      earliestDay: commitment.assemblyWindow.earliestDay,
      latestDay: commitment.assemblyWindow.latestDay
    },
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

function executeM4GrainSupplyPreviewQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.preview-m4-grain-supply" }>
): QueryResultV1 {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.preview-m4-grain-supply requires an M2 economy state."
      }
    };
  }
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    return {
      status: "rejected",
      error: m3MissingDomainError("sim.preview-m4-grain-supply")
    };
  }
  const m4 = runtime.world.state.m4;
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const campaignPlan = m4?.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (m4 === undefined || campaignPlan === undefined) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.preview-m4-grain-supply references a missing CampaignPlanId."
      }
    };
  }
  const ownerPolityId = campaignOwnerPolityId(m3, campaignPlan.owner);
  if (ownerPolityId === null) {
    return {
      status: "rejected",
      error: {
        code: "grain-supply-invalid",
        path: "payload.campaignPlanId",
        message: "Campaign owner polity is unavailable."
      }
    };
  }
  const plannedTroops = plannedM4MusterTroops(m4, campaignPlanId);
  const required = multiplySafe(
    plannedTroops,
    query.payload.plannedMarchDays,
    query.payload.grainPerTroopPerDay
  );
  const dailyNeed = multiplySafe(plannedTroops, query.payload.grainPerTroopPerDay, 1);
  if (required === null || dailyNeed === null) {
    return {
      status: "rejected",
      error: {
        code: "grain-supply-invalid",
        path: "payload.plannedMarchDays",
        message: "M4 grain forecast quantity exceeds Number.MAX_SAFE_INTEGER."
      }
    };
  }

  const reservations = m4.grainSupplyReservations
    .filter((reservation) => reservation.campaignPlanId === campaignPlanId)
    .map(copyM4GrainSupplyReservationReadModel);
  const grainReserved = reservations.reduce(
    (sum, reservation) => sum + reservation.carriedAmount,
    0
  );
  const sourceForecasts = m4ControlledGrainSources(runtime.world, m2, ownerPolityId).map(
    (source) => ({
      source: {
        kind: "m2-population-group" as const,
        populationGroupId: source.group.id,
        districtId: source.group.districtId
      },
      availableAmount: source.group.grainStock
    })
  );
  const grainAvailableToReserve = sourceForecasts.reduce(
    (sum, source) => sum + source.availableAmount,
    0
  );
  const reasonCodes = m4GrainForecastReasonCodes({
    world: runtime.world,
    plan: campaignPlan,
    plannedTroops,
    grainRequired: required,
    grainReserved,
    grainAvailableToReserve
  });

  return {
    status: "ok",
    result: {
      kind: "sim.preview-m4-grain-supply",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      plannedTroops,
      plannedMarchDays: query.payload.plannedMarchDays,
      plannedStartDay: campaignPlan.startWindow.earliestDay,
      grainRequired: required,
      grainReserved,
      grainAvailableToReserve,
      expectedDaysOfSupply: dailyNeed === 0 ? 0 : floorDivide(grainReserved, dailyNeed),
      sourceForecasts,
      reservations,
      reasonCodes
    }
  };
}

function executeM4RouteTransportCapacityPreviewQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.preview-m4-route-transport-capacity" }>
): QueryResultV1 {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.preview-m4-route-transport-capacity requires an M2 transport state."
      }
    };
  }
  const m4 = runtime.world.state.m4;
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const campaignPlan = m4?.campaignPlans.find((plan) => plan.id === campaignPlanId);
  if (m4 === undefined || campaignPlan === undefined) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.preview-m4-route-transport-capacity references a missing CampaignPlanId."
      }
    };
  }
  if (campaignPlan.target.kind !== "district") {
    return {
      status: "rejected",
      error: {
        code: "campaign-objective-invalid",
        path: "payload.campaignPlanId",
        message: "M4 route transport capacity forecast requires a district target."
      }
    };
  }
  const targetDistrictId = campaignPlan.target.districtId;

  const sourceForecasts = m4.grainSupplyReservations
    .filter(
      (reservation) =>
        reservation.campaignPlanId === campaignPlanId && reservation.carriedAmount > 0
    )
    .sort(compareM4GrainSupplyReservationForConsumption)
    .map((reservation) =>
      forecastM4RouteTransportSource({
        world: runtime.world,
        reservation,
        targetDistrictId,
        earliestDepartureDay: campaignPlan.startWindow.earliestDay,
        latestDepartureDay: campaignPlan.startWindow.latestDay
      })
    );
  const carriedSupplyAvailable = sourceForecasts.reduce(
    (sum, forecast) => sum + forecast.carriedSupplyAmount,
    0
  );
  const carriedSupplyLimit = sourceForecasts.reduce(
    (sum, forecast) => sum + forecast.carriedSupplyLimit,
    0
  );

  return {
    status: "ok",
    result: {
      kind: "sim.preview-m4-route-transport-capacity",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      targetDistrictId,
      plannedTroops: plannedM4MusterTroops(m4, campaignPlanId),
      carriedSupplyAvailable,
      carriedSupplyLimit,
      bottleneckCapacity: aggregateM4RouteBottleneckCapacity(sourceForecasts),
      sourceForecasts,
      reasonCodes: m4RouteTransportForecastReasonCodes(sourceForecasts)
    }
  };
}

function forecastM4RouteTransportSource(input: {
  readonly world: WorldStateV0;
  readonly reservation: M4GrainSupplyReservationStateV0;
  readonly targetDistrictId: DistrictId;
  readonly earliestDepartureDay: GameDay;
  readonly latestDepartureDay: GameDay;
}): M4RouteTransportSourceForecastReadModelV1 {
  const preview = previewM2TransportRouteV0(input.world, {
    originDistrictId: input.reservation.source.districtId,
    destinationDistrictId: input.targetDistrictId,
    stockAmount: input.reservation.carriedAmount,
    day: input.earliestDepartureDay
  });
  if (preview.status === "unreachable") {
    return {
      reservationId: input.reservation.reservationId,
      source: copyM4GrainSupplySource(input.reservation.source),
      originDistrictId: input.reservation.source.districtId,
      destinationDistrictId: input.targetDistrictId,
      status: "unreachable",
      carriedSupplyAmount: input.reservation.carriedAmount,
      carriedSupplyLimit: 0,
      bottleneckCapacity: 0,
      travelWindow: {
        earliestDepartureDay: input.earliestDepartureDay,
        latestDepartureDay: input.latestDepartureDay,
        earliestArrivalDay: input.earliestDepartureDay,
        latestArrivalDay: input.latestDepartureDay,
        travelDays: 0
      },
      routeSegments: [],
      overloadedReasonCode: "route.capacity.unreachable",
      seasonRiskReasonCodes: []
    };
  }

  const carriedSupplyLimit =
    preview.bottleneckCapacity < input.reservation.carriedAmount
      ? preview.bottleneckCapacity
      : input.reservation.carriedAmount;
  return {
    reservationId: input.reservation.reservationId,
    source: copyM4GrainSupplySource(input.reservation.source),
    originDistrictId: input.reservation.source.districtId,
    destinationDistrictId: input.targetDistrictId,
    status: preview.status,
    carriedSupplyAmount: input.reservation.carriedAmount,
    carriedSupplyLimit,
    bottleneckCapacity: preview.bottleneckCapacity,
    travelWindow: {
      earliestDepartureDay: input.earliestDepartureDay,
      latestDepartureDay: input.latestDepartureDay,
      earliestArrivalDay: input.earliestDepartureDay + preview.totalCost,
      latestArrivalDay: input.latestDepartureDay + preview.totalCost,
      travelDays: preview.totalCost
    },
    routeSegments: preview.edges.map((edge) => ({ ...edge })),
    overloadedReasonCode:
      preview.status === "capacity-exceeded"
        ? "route.capacity.carried-supply-over-bottleneck"
        : null,
    seasonRiskReasonCodes: m4RouteSeasonRiskReasonCodes(
      input.world,
      preview.monthOfYear,
      preview.edges
    )
  };
}

function aggregateM4RouteBottleneckCapacity(
  forecasts: readonly M4RouteTransportSourceForecastReadModelV1[]
): number {
  if (forecasts.length === 0) {
    return 0;
  }
  return forecasts.reduce(
    (minimum, forecast) =>
      forecast.bottleneckCapacity < minimum ? forecast.bottleneckCapacity : minimum,
    Number.MAX_SAFE_INTEGER
  );
}

function m4RouteTransportForecastReasonCodes(
  forecasts: readonly M4RouteTransportSourceForecastReadModelV1[]
): readonly string[] {
  const reasonCodes: string[] = [];
  if (forecasts.length === 0) {
    reasonCodes.push("route.forecast.no-carried-supply");
  }
  if (forecasts.some((forecast) => forecast.status === "unreachable")) {
    reasonCodes.push("route.forecast.unreachable");
  }
  if (forecasts.some((forecast) => forecast.status === "capacity-exceeded")) {
    reasonCodes.push("route.forecast.carried-supply-over-bottleneck", "route.forecast.overloaded");
  }
  if (forecasts.some((forecast) => forecast.seasonRiskReasonCodes.length > 0)) {
    reasonCodes.push("route.forecast.seasonal-risk");
  }
  if (reasonCodes.length === 0) {
    reasonCodes.push("route.forecast.capacity-ready");
  }
  return uniqueSortedText(reasonCodes, compareM4RouteTransportReasonCode);
}

function m4RouteSeasonRiskReasonCodes(
  world: WorldStateV0,
  monthOfYear: number,
  routeSegments: readonly M2TransportRoutePreviewEdgeReadModelV1[]
): readonly string[] {
  const reasonCodes: string[] = [];
  for (const segment of routeSegments) {
    const month = m4RouteSegmentSeasonMonth(world, monthOfYear, segment);
    if (month === undefined) {
      continue;
    }
    if (month.monsoonIntensityBps >= 7_000) {
      reasonCodes.push("route.season.monsoon-risk");
    }
    if (segment.routeKind === "road" && month.roadTravelCostBps >= 12_000) {
      reasonCodes.push("route.season.road-delay-risk");
    }
    if (segment.routeKind === "river" && month.riverNavigabilityBps <= 7_000) {
      reasonCodes.push("route.season.river-navigation-risk");
    }
    if (segment.routeKind === "coast" && month.monsoonIntensityBps >= 7_000) {
      reasonCodes.push("route.season.coast-monsoon-risk");
    }
  }
  return uniqueSortedText(reasonCodes, compareM4RouteTransportReasonCode);
}

function m4RouteSegmentSeasonMonth(
  world: WorldStateV0,
  monthOfYear: number,
  segment: M2TransportRoutePreviewEdgeReadModelV1
): M2SeasonalMonthStateV0 | undefined {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return undefined;
  }
  const fromMonth = m4SeasonMonthByDistrictId(m2, segment.fromDistrictId, monthOfYear);
  const toMonth = m4SeasonMonthByDistrictId(m2, segment.toDistrictId, monthOfYear);
  if (fromMonth === undefined) {
    return toMonth;
  }
  if (toMonth === undefined) {
    return fromMonth;
  }
  return {
    month: fromMonth.month,
    monsoonIntensityBps: floorDivide(
      fromMonth.monsoonIntensityBps + toMonth.monsoonIntensityBps,
      2
    ),
    agricultureWorkBps: floorDivide(fromMonth.agricultureWorkBps + toMonth.agricultureWorkBps, 2),
    riverNavigabilityBps: floorDivide(
      fromMonth.riverNavigabilityBps + toMonth.riverNavigabilityBps,
      2
    ),
    roadTravelCostBps: floorDivide(fromMonth.roadTravelCostBps + toMonth.roadTravelCostBps, 2)
  };
}

function m4SeasonMonthByDistrictId(
  m2: M2EconomyPopulationStateV0,
  districtId: DistrictId,
  monthOfYear: number
): M2SeasonalMonthStateV0 | undefined {
  const seasonality = m2.transport.districtSeasonality.find(
    (entry) => entry.districtId === districtId
  );
  const curve = m2.transport.regionalCurves.find(
    (entry) => entry.id === seasonality?.regionalCurveId
  );
  return curve?.monthlyValues[monthOfYear - 1];
}

function uniqueSortedText(
  values: readonly string[],
  compare: (left: string, right: string) => number
): readonly string[] {
  const unique: string[] = [];
  for (const value of [...values].sort(compare)) {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  }
  return unique;
}

function compareM4RouteTransportReasonCode(left: string, right: string): number {
  return (
    m4RouteTransportReasonRank(left) - m4RouteTransportReasonRank(right) || compareText(left, right)
  );
}

function m4RouteTransportReasonRank(reasonCode: string): number {
  switch (reasonCode) {
    case "route.forecast.no-carried-supply":
      return 1;
    case "route.forecast.unreachable":
      return 2;
    case "route.forecast.carried-supply-over-bottleneck":
      return 3;
    case "route.forecast.overloaded":
      return 4;
    case "route.forecast.seasonal-risk":
      return 5;
    case "route.forecast.capacity-ready":
      return 6;
    case "route.season.monsoon-risk":
      return 10;
    case "route.season.road-delay-risk":
      return 11;
    case "route.season.river-navigation-risk":
      return 12;
    case "route.season.coast-monsoon-risk":
      return 13;
    default:
      return 99;
  }
}

function copyM4GrainSupplyReservationReadModel(
  reservation: M4GrainSupplyReservationStateV0
): M4GrainSupplyReservationReadModelV1 {
  return {
    reservationId: reservation.reservationId,
    campaignPlanId: reservation.campaignPlanId,
    source: copyM4GrainSupplySource(reservation.source),
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

function executeM4MarchStateQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m4-march-state" }>
): QueryResultV1 {
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const m4 = runtime.world.state.m4;
  if (m4 === undefined || !m4.campaignPlans.some((plan) => plan.id === campaignPlanId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.list-m4-march-state references a missing CampaignPlanId."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-march-state",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      marches: m4.marches
        .filter((march) => march.campaignPlanId === campaignPlanId)
        .sort(compareM4MarchForDailyExecution)
        .map(copyM4CampaignMarchReadModel),
      reasonCodes: ["march.query.filtered-by-campaign"]
    }
  };
}

function copyM4CampaignMarchReadModel(march: M4CampaignMarchStateV0): M4CampaignMarchReadModelV1 {
  return {
    marchId: march.marchId,
    campaignPlanId: march.campaignPlanId,
    originDistrictId: march.originDistrictId,
    targetDistrictId: march.targetDistrictId,
    currentDistrictId: march.currentDistrictId,
    currentSegmentIndex: march.currentSegmentIndex,
    progressOnSegmentDays: march.progressOnSegmentDays,
    activeTroops: march.activeTroops,
    grainPerTroopPerDay: march.grainPerTroopPerDay,
    supply: { ...march.supply },
    status: march.status,
    statusReasonCode: march.statusReasonCode,
    predictedArrivalWindow: { ...march.predictedArrivalWindow },
    actualArrivalDay: march.actualArrivalDay,
    joinedCommitmentIds: [...march.joinedCommitmentIds],
    joinedCommitmentTroops: march.joinedCommitmentTroops.map((joined) => ({ ...joined })),
    failedCommitmentIds: [...march.failedCommitmentIds],
    reasonCodes: [...march.reasonCodes]
  };
}

function executeM4SiegeStateQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m4-siege-state" }>
): QueryResultV1 {
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const m4 = runtime.world.state.m4;
  if (m4 === undefined || !m4.campaignPlans.some((plan) => plan.id === campaignPlanId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.list-m4-siege-state references a missing CampaignPlanId."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-siege-state",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      sieges: m4.sieges
        .filter((siege) => siege.campaignPlanId === campaignPlanId)
        .sort(compareM4SiegeForChoiceResolution)
        .map(copyM4SiegeReadModel),
      reasonCodes: ["siege.query.filtered-by-campaign"]
    }
  };
}

function copyM4SiegeReadModel(siege: M4SiegeStateV0): M4SiegeReadModelV1 {
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
    creditHooks: siege.creditHooks.map((hook) => ({ ...hook })),
    reputationHooks: siege.reputationHooks.map((hook) => ({ ...hook })),
    startedDay: siege.startedDay,
    updatedDay: siege.updatedDay
  };
}

function executeM4WithdrawalStateQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m4-withdrawal-state" }>
): QueryResultV1 {
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const m4 = runtime.world.state.m4;
  if (m4 === undefined || !m4.campaignPlans.some((plan) => plan.id === campaignPlanId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.list-m4-withdrawal-state references a missing CampaignPlanId."
      }
    };
  }
  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-withdrawal-state",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      withdrawals: m4.withdrawals
        .filter((withdrawal) => withdrawal.campaignPlanId === campaignPlanId)
        .sort(
          (left, right) =>
            left.campaignPlanId - right.campaignPlanId ||
            left.resolvedDay - right.resolvedDay ||
            left.withdrawalId - right.withdrawalId
        )
        .map(copyM4WithdrawalReadModel),
      reasonCodes: ["withdrawal.query.filtered-by-campaign"]
    }
  };
}

function copyM4WithdrawalReadModel(withdrawal: M4WithdrawalStateV0): M4WithdrawalReadModelV1 {
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
    creditHooks: withdrawal.creditHooks.map((hook) => ({ ...hook })),
    reputationHooks: withdrawal.reputationHooks.map((hook) => ({ ...hook })),
    reasonCodes: [...withdrawal.reasonCodes],
    resolvedDay: withdrawal.resolvedDay
  };
}

function executeM4WarOutcomesQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m4-war-outcomes" }>
): QueryResultV1 {
  const campaignPlanId = parseCampaignPlanId(query.payload.campaignPlanId);
  const m4 = runtime.world.state.m4;
  if (m4 === undefined || !m4.campaignPlans.some((plan) => plan.id === campaignPlanId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.campaignPlanId",
        message: "sim.list-m4-war-outcomes references a missing CampaignPlanId."
      }
    };
  }
  const outcomes = m4.warOutcomes
    .filter((outcome) => outcome.campaignPlanId === campaignPlanId)
    .sort(
      (left, right) =>
        left.campaignPlanId - right.campaignPlanId ||
        left.resolvedDay - right.resolvedDay ||
        left.outcomeId - right.outcomeId
    )
    .map(copyM4WarOutcomeReadModel);
  return {
    status: "ok",
    result: {
      kind: "sim.list-m4-war-outcomes",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      campaignPlanId,
      outcomes,
      postwarCandidates: outcomes
        .map((outcome) => outcome.postwarCandidate)
        .filter((candidate): candidate is M4PostwarCandidateStateV0 => candidate !== null),
      reasonCodes: ["war-outcome.query.filtered-by-campaign"]
    }
  };
}

function copyM4WarOutcomeReadModel(outcome: M4WarOutcomeStateV0): M4WarOutcomeReadModelV1 {
  return {
    ...outcome,
    postwarCandidate:
      outcome.postwarCandidate === null
        ? null
        : copyM4PostwarCandidateReadModel(outcome.postwarCandidate),
    reasonCodes: [...outcome.reasonCodes]
  };
}

function copyM4PostwarCandidateReadModel(
  candidate: M4PostwarCandidateStateV0
): M4PostwarCandidateReadModelV1 {
  return {
    ...candidate,
    validM3Methods: [...candidate.validM3Methods],
    reasonCodes: [...candidate.reasonCodes]
  };
}

function executeM6DiplomacyQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m6-diplomacy" }>
): QueryResultV1 {
  const observerPolityId = parsePolityId(query.payload.observerPolityId);
  if (!runtime.world.definitions.polities.some((polity) => polity.id === observerPolityId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.observerPolityId",
        message: "sim.list-m6-diplomacy references a missing observer PolityId."
      }
    };
  }
  const m6 = runtime.world.state.m6;
  return {
    status: "ok",
    result: {
      kind: "sim.list-m6-diplomacy",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      observerPolityId,
      relations:
        m6?.relations
          .filter(
            (relation) =>
              relation.polityAId === observerPolityId || relation.polityBId === observerPolityId
          )
          .sort(
            (left, right) => left.polityAId - right.polityAId || left.polityBId - right.polityBId
          )
          .map(copyM6RelationReadModel) ?? [],
      agreements:
        m6?.agreements
          .filter(
            (agreement) =>
              agreement.proposerPolityId === observerPolityId ||
              agreement.targetPolityId === observerPolityId
          )
          .sort(
            (left, right) =>
              left.relationId - right.relationId || left.agreementId - right.agreementId
          )
          .map(copyM6AgreementReadModel) ?? [],
      recognitionEdges:
        m6?.recognitionEdges
          .filter(
            (edge) => edge.fromPolityId === observerPolityId || edge.toPolityId === observerPolityId
          )
          .sort(
            (left, right) =>
              left.fromPolityId - right.fromPolityId || left.toPolityId - right.toPolityId
          )
          .map(copyM6RecognitionEdgeReadModel) ?? [],
      reasonCodes: ["m6.diplomacy.query.observer-visible"]
    }
  };
}

function executeM6RecognizedOrderQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.list-m6-recognized-order" }>
): QueryResultV1 {
  const polityId = parsePolityId(query.payload.polityId);
  if (!runtime.world.definitions.polities.some((polity) => polity.id === polityId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.polityId",
        message: "sim.list-m6-recognized-order references a missing PolityId."
      }
    };
  }
  return {
    status: "ok",
    result: {
      kind: "sim.list-m6-recognized-order",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      polityId,
      decisions: [buildM6RecognizedOrderReadModel(runtime, polityId)]
    }
  };
}

function executeM6AlphaTerminalStateQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.get-m6-alpha-terminal-state" }>
): QueryResultV1 {
  const polityId = parsePolityId(query.payload.polityId);
  if (!runtime.world.definitions.polities.some((polity) => polity.id === polityId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.polityId",
        message: "sim.get-m6-alpha-terminal-state references a missing PolityId."
      }
    };
  }
  const terminalState =
    runtime.world.state.m6Alpha?.terminalStates
      .filter((entry) => entry.polityId === polityId)
      .sort(
        (left, right) =>
          right.evaluatedDay - left.evaluatedDay ||
          right.evaluatedRevision - left.evaluatedRevision ||
          right.terminalStateId - left.terminalStateId
      )[0] ??
    buildM6AlphaTerminalState(
      runtime.world,
      {
        schemaVersion: 1,
        kind: "sim.evaluate-m6-alpha-outcome",
        commandId: `query.${query.payload.queryId}`,
        actor: { kind: "system", id: "m6-alpha-query" },
        expectedDay: runtime.world.meta.currentDay,
        expectedRevision: runtime.world.meta.revision,
        payload: {
          terminalStateId: 1,
          polityId,
          maxDay: runtime.world.meta.currentDay,
          reasonCode: "m6.alpha.query.derived"
        }
      },
      parseM6AlphaTerminalStateId(1),
      polityId
    );

  return {
    status: "ok",
    result: {
      kind: "sim.get-m6-alpha-terminal-state",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      polityId,
      terminalState: copyM6AlphaTerminalReadModel(terminalState)
    }
  };
}

function copyM6RelationReadModel(
  relation: M6DiplomaticRelationStateV0
): M6DiplomaticRelationReadModelV1 {
  return {
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
    reasonCodes: [...relation.reasonCodes]
  };
}

function copyM6AgreementReadModel(
  agreement: M6DiplomaticAgreementStateV0
): M6DiplomaticAgreementReadModelV1 {
  return {
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
  };
}

function copyM6RecognitionEdgeReadModel(
  edge: M6RecognitionEdgeStateV0
): M6RecognitionEdgeReadModelV1 {
  return {
    fromPolityId: edge.fromPolityId,
    toPolityId: edge.toPolityId,
    agreementId: edge.agreementId,
    reasonCode: edge.reasonCode
  };
}

function copyM6AlphaTerminalReadModel(
  terminal: M6AlphaTerminalStateV0
): M6AlphaTerminalReadModelV1 {
  return {
    schemaVersion: 1,
    terminalStateId: terminal.terminalStateId,
    polityId: terminal.polityId,
    outcome: terminal.outcome,
    evaluatedDay: terminal.evaluatedDay,
    evaluatedRevision: terminal.evaluatedRevision,
    maxDay: terminal.maxDay,
    evidence: { ...terminal.evidence },
    reasonCodes: [...terminal.reasonCodes]
  };
}

function buildM6RecognizedOrderReadModel(
  runtime: SimulationRuntimeV1,
  polityId: PolityId
): M6RecognizedOrderReadModelV1 {
  const m6 = runtime.world.state.m6;
  const recognizedByCount =
    m6?.recognitionEdges.filter((edge) => edge.toPolityId === polityId).length ?? 0;
  const profile = m6?.legitimacyProfiles.find(
    (entry) => entry.polityId === polityId && entry.audience === "vassal-rulers"
  );
  const legitimacyScoreBps = profile?.scoreBps ?? 0;
  const obligationSummary = summarizeM6RecognizedOrderObligations(
    runtime.world.state.m3,
    polityId,
    runtime.world.meta.currentDay
  );
  const successionBlockerCount =
    runtime.world.state.m3?.successionCrises.filter(
      (crisis) =>
        crisis.polityId === polityId &&
        (crisis.status === "pending" || crisis.outcome?.kind === "disputed")
    ).length ?? 0;
  const disputedSuccessionCount =
    runtime.world.state.m3?.successionCrises.filter(
      (crisis) => crisis.polityId === polityId && crisis.outcome?.kind === "disputed"
    ).length ?? 0;
  const postwarCandidateCount =
    runtime.world.state.m4?.postwarCandidates.filter(
      (candidate) => candidate.victorPolityId === polityId
    ).length ?? 0;
  const postwarSourceCount =
    m6?.legitimacySources.filter(
      (source) => source.polityId === polityId && source.sourceKind === "postwar-settlement"
    ).length ?? 0;
  const reasonCodes = m6RecognizedOrderReasonCodes({
    recognizedByCount,
    legitimacyScoreBps,
    obligationRiskCount: obligationSummary.riskCount,
    obligationBlockedCount: obligationSummary.blockedCount,
    pendingSuccessionCount: successionBlockerCount,
    disputedSuccessionCount,
    postwarEvidenceCount: postwarCandidateCount + postwarSourceCount
  });
  return {
    polityId,
    recognizedByCount,
    legitimacyScoreBps,
    activeObligationCount: obligationSummary.activeCount,
    pendingSuccessionCount: successionBlockerCount,
    postwarCandidateCount,
    canPursueVictory:
      recognizedByCount > 0 &&
      legitimacyScoreBps >= 1_000 &&
      obligationSummary.riskCount === 0 &&
      obligationSummary.blockedCount === 0 &&
      successionBlockerCount === 0,
    reasonCodes
  };
}

function summarizeM6RecognizedOrderObligations(
  m3: WorldStateV0["state"]["m3"],
  polityId: PolityId,
  currentDay: GameDay
): {
  readonly activeCount: number;
  readonly riskCount: number;
  readonly blockedCount: number;
} {
  if (m3 === undefined) {
    return { activeCount: 0, riskCount: 0, blockedCount: 0 };
  }

  let activeCount = 0;
  let riskCount = 0;
  let blockedCount = 0;
  for (const obligation of m3.obligations) {
    if (obligation.creditorPolityId !== polityId) {
      continue;
    }
    if (obligation.status === "active") {
      activeCount += 1;
    }
    if (
      obligation.status === "breached" ||
      obligation.accounting.defaultedAmount > 0 ||
      obligation.breachReasonCode !== null
    ) {
      blockedCount += 1;
      continue;
    }
    if (
      obligation.status === "disputed" ||
      obligation.disputeReasonCode !== null ||
      obligation.accounting.arrearsAmount > 0 ||
      (obligation.status === "active" &&
        obligation.accounting.dueDay < currentDay &&
        obligation.accounting.deliveredAmount + obligation.accounting.remittedAmount <
          obligation.accounting.dueAmount)
    ) {
      riskCount += 1;
    }
  }

  return { activeCount, riskCount, blockedCount };
}

function m6RecognizedOrderReasonCodes(input: {
  readonly recognizedByCount: number;
  readonly legitimacyScoreBps: number;
  readonly obligationRiskCount: number;
  readonly obligationBlockedCount: number;
  readonly pendingSuccessionCount: number;
  readonly disputedSuccessionCount: number;
  readonly postwarEvidenceCount: number;
}): readonly string[] {
  return [
    input.recognizedByCount > 0
      ? "m6.recognized-order.diplomatic-recognition"
      : "m6.recognized-order.recognition-missing",
    input.legitimacyScoreBps >= 1_000
      ? "m6.recognized-order.legitimacy-sufficient"
      : "m6.recognized-order.legitimacy-insufficient",
    input.obligationBlockedCount > 0
      ? "m6.recognized-order.obligation-blocked"
      : input.obligationRiskCount > 0
        ? "m6.recognized-order.obligation-risk"
        : "m6.recognized-order.obligations-clear",
    input.disputedSuccessionCount > 0
      ? "m6.recognized-order.succession-disputed"
      : input.pendingSuccessionCount === 0
        ? "m6.recognized-order.succession-clear"
        : "m6.recognized-order.succession-pending",
    input.postwarEvidenceCount > 0
      ? "m6.recognized-order.postwar-evidence-present"
      : "m6.recognized-order.postwar-evidence-absent"
  ];
}

function executeM2EconomySummariesQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.list-m2-economy-summaries requires an M2 economy population state."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m2-economy-summaries",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      districts: runtime.world.definitions.districts.map((definition) => {
        const group = m2.populationGroups.find((entry) => entry.districtId === definition.id);
        const agriculture = m2.agriculture.districts.find(
          (entry) => entry.districtId === definition.id
        );
        const market = m2.market.districts.find((entry) => entry.districtId === definition.id);
        const committedLabor =
          group?.committedLabor.reduce((sum, commitment) => sum + commitment.laborAmount, 0) ?? 0;
        return {
          districtId: definition.id,
          population: group?.totalPeople ?? 0,
          availableLabor: group?.availableLabor ?? 0,
          committedLabor,
          grainStock: group?.grainStock ?? 0,
          cashStock: group?.cashStock ?? 0,
          agriculturePhase: agriculture?.phase ?? "fallow",
          lastHarvestGrain: agriculture?.lastHarvestGrain ?? 0,
          cumulativeMobilizationCost: market?.cashFlow.cumulativeMobilizationCost ?? 0
        };
      })
    }
  };
}

function executeM3AdministrativeBurdenQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m3-state-missing",
        path: "state.m3",
        message: "sim.list-m3-administrative-burden requires an M3 polity vassalage state."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m3-administrative-burden",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      districts: m3.administrativeDistricts.map((entry) =>
        computeM3AdministrativeBurdenProfileV0(entry)
      )
    }
  };
}

function executeM3DecisionScaffoldsQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m3-state-missing",
        path: "state.m3",
        message: "sim.list-m3-decision-scaffolds requires an M3 polity vassalage state."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m3-decision-scaffolds",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      offices: m3.offices.map((office) => m3OfficeDecisionScaffold(m3, office)),
      policies: m3.policies.map((policy) => ({
        policyId: policy.policyId,
        targetKind: policy.target.kind,
        reasonCodes: [`policy.${policy.target.kind}.${policy.stance}`]
      })),
      enfeoffments: m3.enfeoffments.map((enfeoffment) =>
        m3EnfeoffmentDecisionScaffold(m3, enfeoffment)
      )
    }
  };
}

function executeM3SuccessionCrisesQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m3-state-missing",
        path: "state.m3",
        message: "sim.list-m3-succession-crises requires an M3 polity vassalage state."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m3-succession-crises",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      crises: m3.successionCrises.map((crisis) => ({
        successionId: crisis.id,
        polityId: crisis.polityId,
        status: crisis.status,
        candidates: crisis.candidates.map((candidate) => ({
          characterId: candidate.characterId,
          requiresRegency: candidate.requiresRegency,
          supportTotalBps: candidate.supportTotalBps,
          supportSources: candidate.supportSources.map((source) => ({ ...source }))
        }))
      }))
    }
  };
}

function executeM3PostwarGovernancePreviewQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.preview-m3-postwar-governance" }>
): QueryResultV1 {
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m3-state-missing",
        path: "state.m3",
        message: "sim.preview-m3-postwar-governance requires an M3 polity vassalage state."
      }
    };
  }

  const victorPolityId = parsePolityId(query.payload.victorPolityId);
  const localPolityId = parsePolityId(query.payload.localPolityId);
  const districtId = parseDistrictId(query.payload.districtId);
  const validation = validatePostwarGovernanceRequest({
    world: runtime.world,
    m3,
    victorPolityId,
    localPolityId,
    districtId,
    method: query.payload.methods[0] ?? "direct-control"
  });
  if (validation !== null) {
    return { status: "rejected", error: validation };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.preview-m3-postwar-governance",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      months: query.payload.months,
      arrangements: query.payload.methods.map((method) =>
        computeM3PostwarGovernancePreview({
          world: runtime.world,
          m3,
          victorPolityId,
          localPolityId,
          districtId,
          method,
          months: query.payload.months
        })
      )
    }
  };
}

function executeM3PostwarGovernanceOutcomesQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.compare-m3-postwar-governance-outcomes" }>
): QueryResultV1 {
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m3-state-missing",
        path: "state.m3",
        message: "sim.compare-m3-postwar-governance-outcomes requires an M3 polity vassalage state."
      }
    };
  }

  const victorPolityId = parsePolityId(query.payload.victorPolityId);
  const localPolityId = parsePolityId(query.payload.localPolityId);
  const districtId = parseDistrictId(query.payload.districtId);
  const appliedMethods = appliedPostwarMethods(m3, districtId, victorPolityId, localPolityId);
  const methods =
    appliedMethods.length === 0
      ? (["direct-control", "restore-vassal-ruler", "tribute-only"] as const)
      : appliedMethods;
  const validation = validatePostwarGovernanceRequest({
    world: runtime.world,
    m3,
    victorPolityId,
    localPolityId,
    districtId,
    method: methods[0] ?? "direct-control"
  });
  if (validation !== null) {
    return { status: "rejected", error: validation };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.compare-m3-postwar-governance-outcomes",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      months: query.payload.months,
      outcomes: methods.map((method) =>
        postwarPreviewToOutcome(
          computeM3PostwarGovernancePreview({
            world: runtime.world,
            m3,
            victorPolityId,
            localPolityId,
            districtId,
            method,
            months: query.payload.months
          }),
          query.payload.months
        )
      )
    }
  };
}

function validatePostwarGovernanceRequest(
  input: PostwarGovernanceEvaluationInput
): DomainErrorV1 | null {
  if (!input.m3.polities.some((entry) => entry.polityId === input.victorPolityId)) {
    return badIdDomainError(
      "payload.victorPolityId",
      "M3 postwar governance references a missing victor PolityId."
    );
  }
  if (!input.m3.polities.some((entry) => entry.polityId === input.localPolityId)) {
    return badIdDomainError(
      "payload.localPolityId",
      "M3 postwar governance references a missing local PolityId."
    );
  }
  if (input.victorPolityId === input.localPolityId) {
    return badIdDomainError(
      "payload.localPolityId",
      "M3 postwar governance requires different victor and local polities."
    );
  }
  if (!input.world.definitions.districts.some((entry) => entry.id === input.districtId)) {
    return badIdDomainError(
      "payload.districtId",
      "M3 postwar governance references a missing DistrictId."
    );
  }

  return null;
}

function validateRestoreVassalPayload(
  m3: M3PolityVassalageStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.apply-m3-postwar-governance" }>,
  localPolityId: PolityId,
  districtId: DistrictId
): DomainErrorV1 | null {
  if (command.payload.method !== "restore-vassal-ruler") {
    return null;
  }
  if (command.payload.localRulerCharacterId === null) {
    return {
      code: "invalid-payload",
      path: "payload.localRulerCharacterId",
      message: "restore-vassal-ruler requires a local ruler character."
    };
  }
  if (command.payload.policyId === null) {
    return {
      code: "invalid-payload",
      path: "payload.policyId",
      message: "restore-vassal-ruler requires a district policy."
    };
  }

  const localRulerCharacterId = parsePersonId(command.payload.localRulerCharacterId);
  const ruler = findM3Character(m3, localRulerCharacterId);
  if (ruler === undefined) {
    return badIdDomainError(
      "payload.localRulerCharacterId",
      "restore-vassal-ruler references a missing local ruler character."
    );
  }
  const availability = validateM3CharacterAvailabilityAtPath(
    ruler,
    districtId,
    "payload.localRulerCharacterId"
  );
  if (availability !== null) {
    return availability;
  }
  if (ruler.polityId !== localPolityId) {
    return {
      code: "office-eligibility-failed",
      path: "payload.localRulerCharacterId",
      message: "restore-vassal-ruler requires a ruler from the local polity."
    };
  }

  const policyId = parseM3PolicyId(command.payload.policyId);
  const policy = m3.policies.find((entry) => entry.policyId === policyId);
  if (policy === undefined) {
    return badIdDomainError(
      "payload.policyId",
      "restore-vassal-ruler references a missing district policy."
    );
  }
  if (policy.target.kind !== "district" || policy.target.districtId !== districtId) {
    return {
      code: "invalid-payload",
      path: "payload.policyId",
      message: "restore-vassal-ruler policy must target the restored district."
    };
  }

  return null;
}

function hasExistingPostwarGovernanceArrangement(
  world: WorldStateV0,
  m3: M3PolityVassalageStateV0,
  districtId: DistrictId
): boolean {
  const district = world.state.districts.find((entry) => entry.definitionId === districtId);
  const controllerPolityId =
    district?.control.kind === "controlled" ? district.control.controllerPolityId : null;
  return (
    m3.administrativeDistricts.some(
      (entry) =>
        entry.districtId === districtId &&
        (entry.controlMode !== "direct" ||
          (controllerPolityId !== null && entry.polityId !== controllerPolityId))
    ) ||
    m3.obligations.some((obligation) =>
      obligation.obligationSource.sourceId.startsWith(postwarDirectControlMarkerPrefix(districtId))
    )
  );
}

function computeM3PostwarGovernancePreview(input: {
  readonly world: WorldStateV0;
  readonly m3: M3PolityVassalageStateV0;
  readonly victorPolityId: PolityId;
  readonly localPolityId: PolityId;
  readonly districtId: DistrictId;
  readonly method: M3PostwarGovernanceMethodV1;
  readonly months: number;
}): M3PostwarGovernancePreviewReadModelV1 {
  const base = postwarDistrictBase(input.world, input.m3, input.localPolityId, input.districtId);
  const burden = computeM3AdministrativeBurdenProfileV0({
    polityId: input.victorPolityId,
    districtId: input.districtId,
    controlMode: postwarControlMode(input.method),
    localComplexity: base.localComplexity + postwarLocalComplexityBump(input.method),
    communicationCost: base.communicationCost + postwarCommunicationBump(input.method),
    directness: postwarDirectness(input.method, base.directness),
    frontierPressure: base.frontierPressure + postwarFrontierBump(input.method),
    administrativeCapacity: base.administrativeCapacity
  });
  const obligationShape = postwarObligationShape(input.method, base);
  const cycles = postwarCycles(input.months, obligationShape.periodDays);
  const expectedIncomeCash = divideInteger(
    base.cashStock *
      input.months *
      burden.realizableIncomeBps *
      postwarIncomeShareBps(input.method),
    120_000_000
  );
  const expectedTributeCash = obligationShape.tributeCash * cycles;
  const localAcceptanceBps = clampBps(
    postwarLocalAcceptanceBaseBps(input.method) -
      divideInteger(burden.overload, 2) -
      divideInteger(burden.delayRiskBps, 20)
  );
  const reliabilityBps = clampBps(
    divideInteger(
      burden.obligationReliabilityBps * 2 +
        localAcceptanceBps +
        postwarReliabilityBaseBps(input.method),
      4
    )
  );
  const militaryReadinessBps = clampBps(
    divideInteger(burden.readinessBps + postwarReadinessBaseBps(input.method), 2)
  );
  const militaryContributionTroops = divideInteger(
    obligationShape.troopHeadcount * militaryReadinessBps,
    10_000
  );
  const riskBps = clampBps(10_000 - divideInteger(localAcceptanceBps + reliabilityBps, 2));

  return {
    method: input.method,
    districtId: input.districtId,
    victorPolityId: input.victorPolityId,
    localPolityId: input.localPolityId,
    administrativeBurden: burden,
    obligationShape,
    expectedIncomeCash,
    expectedTributeCash,
    localAcceptanceBps,
    reliabilityBps,
    militaryReadinessBps,
    militaryContributionTroops,
    riskBps,
    reasonCodes: postwarReasonCodes(input.method, burden, obligationShape, localAcceptanceBps)
  };
}

function postwarPreviewToOutcome(
  preview: M3PostwarGovernancePreviewReadModelV1,
  months: number
): M3PostwarGovernanceOutcomeReadModelV1 {
  return {
    months,
    method: preview.method,
    totalExpectedIncomeCash: preview.expectedIncomeCash,
    totalExpectedTributeCash: preview.expectedTributeCash,
    averageAdministrativeLoad: preview.administrativeBurden.administrativeLoad,
    averageReliabilityBps: preview.reliabilityBps,
    totalMilitaryContributionTroops:
      preview.militaryContributionTroops * postwarCycles(months, 360),
    averageRiskBps: preview.riskBps,
    reasonCodes: preview.reasonCodes
  };
}

function postwarDistrictBase(
  world: WorldStateV0,
  m3: M3PolityVassalageStateV0,
  localPolityId: PolityId,
  districtId: DistrictId
): {
  readonly localComplexity: number;
  readonly communicationCost: number;
  readonly directness: number;
  readonly frontierPressure: number;
  readonly administrativeCapacity: number;
  readonly cashStock: number;
  readonly availableLabor: number;
} {
  const row =
    m3.administrativeDistricts.find(
      (entry) => entry.polityId === localPolityId && entry.districtId === districtId
    ) ?? m3.administrativeDistricts.find((entry) => entry.districtId === districtId);
  const group = world.state.m2?.populationGroups.find((entry) => entry.districtId === districtId);

  return {
    localComplexity: row?.localComplexity ?? 160,
    communicationCost: row?.communicationCost ?? 100,
    directness: row?.directness ?? 140,
    frontierPressure: row?.frontierPressure ?? 120,
    administrativeCapacity: row?.administrativeCapacity ?? 900,
    cashStock: group?.cashStock ?? 0,
    availableLabor: group?.availableLabor ?? 0
  };
}

function postwarObligationShape(
  method: M3PostwarGovernanceMethodV1,
  base: { readonly cashStock: number; readonly availableLabor: number }
): M3PostwarGovernanceObligationShapeReadModelV1 {
  switch (method) {
    case "direct-control":
      return {
        periodDays: 360,
        tributeCash: 0,
        troopHeadcount: divideInteger(base.availableLabor, 30),
        hasDirectGarrison: true
      };
    case "restore-vassal-ruler":
      return {
        periodDays: 360,
        tributeCash: divideInteger(base.cashStock, 5),
        troopHeadcount: divideInteger(base.availableLabor, 20),
        hasDirectGarrison: false
      };
    case "tribute-only":
      return {
        periodDays: 360,
        tributeCash: divideInteger(base.cashStock, 10),
        troopHeadcount: 0,
        hasDirectGarrison: false
      };
  }
}

function administrativeDistrictFromPostwarPreview(
  preview: M3PostwarGovernancePreviewReadModelV1
): M3AdministrativeDistrictStateV0 {
  return {
    polityId: preview.victorPolityId,
    districtId: preview.districtId,
    controlMode: preview.administrativeBurden.controlMode,
    localComplexity: preview.administrativeBurden.localComplexity,
    communicationCost: preview.administrativeBurden.communicationCost,
    directness: preview.administrativeBurden.directness,
    frontierPressure: preview.administrativeBurden.frontierPressure,
    administrativeCapacity: preview.administrativeBurden.administrativeCapacity
  };
}

function buildPostwarObligations(input: {
  readonly world: WorldStateV0;
  readonly m3: M3PolityVassalageStateV0;
  readonly command: Extract<GameCommandV1, { readonly kind: "sim.apply-m3-postwar-governance" }>;
  readonly preview: M3PostwarGovernancePreviewReadModelV1;
  readonly victorPolityId: PolityId;
  readonly localPolityId: PolityId;
}): {
  readonly obligations: readonly M3ObligationStateV0[];
  readonly auditEvents: readonly M3ObligationAuditEventStateV0[];
} {
  let obligationId = nextNumericId(input.m3.obligations);
  let auditEventId = nextNumericId(input.m3.obligationAuditEvents);
  const obligations: M3ObligationStateV0[] = [];
  const auditEvents: M3ObligationAuditEventStateV0[] = [];
  const due = {
    kind: "cadence" as const,
    periodDays: input.preview.obligationShape.periodDays,
    nextDueDay: parseGameDay(input.world.meta.currentDay + input.preview.obligationShape.periodDays)
  };
  const tributeRequirement = {
    kind: "amount" as const,
    resourceKind: "cash" as const,
    amount: input.preview.obligationShape.tributeCash
  };
  if (input.command.payload.method === "direct-control") {
    const garrisonMarkerRequirement = {
      kind: "condition" as const,
      conditionKey: "m3.postwar.direct-control.marker"
    };
    obligations.push(
      createPostwarObligation({
        id: obligationId,
        auditEventId,
        world: input.world,
        command: input.command,
        debtorPolityId: input.localPolityId,
        creditorPolityId: input.victorPolityId,
        obligationKind: "troop",
        obligationCategory: "defensive-garrison",
        sourceId: postwarDirectControlMarkerSourceId(
          input.preview.districtId,
          input.command.payload.settlementId
        ),
        requirement: garrisonMarkerRequirement,
        due
      })
    );
    auditEvents.push(
      createPostwarObligationAuditEvent({
        id: auditEventId,
        obligationId,
        world: input.world,
        command: input.command,
        reliabilityBps: input.preview.reliabilityBps,
        obligationCategory: "defensive-garrison"
      })
    );
    return { obligations, auditEvents };
  }

  obligations.push(
    createPostwarObligation({
      id: obligationId,
      auditEventId,
      world: input.world,
      command: input.command,
      debtorPolityId: input.localPolityId,
      creditorPolityId: input.victorPolityId,
      obligationKind: "tribute",
      obligationCategory: "regular-tribute",
      sourceId: `${postwarObligationSourcePrefix(input.command.payload.settlementId)}tribute`,
      requirement: tributeRequirement,
      due
    })
  );
  auditEvents.push(
    createPostwarObligationAuditEvent({
      id: auditEventId,
      obligationId,
      world: input.world,
      command: input.command,
      reliabilityBps: input.preview.reliabilityBps,
      obligationCategory: "regular-tribute"
    })
  );
  obligationId += 1;
  auditEventId += 1;

  if (input.command.payload.method === "restore-vassal-ruler") {
    const troopRequirement = {
      kind: "amount" as const,
      resourceKind: "troops" as const,
      amount: input.preview.obligationShape.troopHeadcount
    };
    obligations.push(
      createPostwarObligation({
        id: obligationId,
        auditEventId,
        world: input.world,
        command: input.command,
        debtorPolityId: input.localPolityId,
        creditorPolityId: input.victorPolityId,
        obligationKind: "troop",
        obligationCategory: "troop-obligation",
        sourceId: `${postwarObligationSourcePrefix(input.command.payload.settlementId)}troops`,
        requirement: troopRequirement,
        due
      })
    );
    auditEvents.push(
      createPostwarObligationAuditEvent({
        id: auditEventId,
        obligationId,
        world: input.world,
        command: input.command,
        reliabilityBps: input.preview.reliabilityBps,
        obligationCategory: "troop-obligation"
      })
    );
  }

  return { obligations, auditEvents };
}

function createPostwarObligation(input: {
  readonly id: number;
  readonly auditEventId: number;
  readonly world: WorldStateV0;
  readonly command: Extract<GameCommandV1, { readonly kind: "sim.apply-m3-postwar-governance" }>;
  readonly debtorPolityId: PolityId;
  readonly creditorPolityId: PolityId;
  readonly obligationKind: M3ObligationStateV0["obligationKind"];
  readonly obligationCategory: M3ObligationStateV0["obligationCategory"];
  readonly sourceId: string;
  readonly requirement: M3ObligationRequirementV0;
  readonly due: M3ObligationDueV0;
}): M3ObligationStateV0 {
  const accounting = createInitialObligationAccounting(input.requirement, input.due);
  return {
    id: parseM3ObligationId(input.id),
    debtorPolityId: input.debtorPolityId,
    creditorPolityId: input.creditorPolityId,
    obligationKind: input.obligationKind,
    obligationCategory: input.obligationCategory,
    obligationSource: {
      kind: "vassalage",
      sourceId: input.sourceId,
      debtorPolityId: input.debtorPolityId,
      creditorPolityId: input.creditorPolityId
    },
    requirement: input.requirement,
    due: input.due,
    accounting,
    status: "active",
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: parseM3ObligationAuditEventId(input.auditEventId),
    latestAuditEventId: parseM3ObligationAuditEventId(input.auditEventId)
  };
}

function createPostwarObligationAuditEvent(input: {
  readonly id: number;
  readonly obligationId: number;
  readonly world: WorldStateV0;
  readonly command: Extract<GameCommandV1, { readonly kind: "sim.apply-m3-postwar-governance" }>;
  readonly reliabilityBps: number;
  readonly obligationCategory: M3ObligationStateV0["obligationCategory"];
}): M3ObligationAuditEventStateV0 {
  return createM3AuditEvent({
    id: input.id,
    obligationId: input.obligationId,
    eventKind: "created",
    world: input.world,
    commandId: input.command.commandId,
    actor: input.command.actor,
    actionKind: null,
    dueDay: null,
    fulfillmentId: null,
    fulfilledAmount: null,
    statusAfter: "active",
    reasonCode: null,
    reasonCodes: [
      "postwar.obligation.created",
      `obligation.kind.${input.obligationCategory}`,
      `postwar.method.${input.command.payload.method}`
    ],
    reliabilityBps: input.reliabilityBps
  });
}

function appliedPostwarMethods(
  m3: M3PolityVassalageStateV0,
  districtId: DistrictId,
  victorPolityId: PolityId,
  localPolityId: PolityId
): readonly M3PostwarGovernanceMethodV1[] {
  const row = m3.administrativeDistricts.find(
    (entry) => entry.polityId === victorPolityId && entry.districtId === districtId
  );
  if (row === undefined) {
    return [];
  }
  if (row.controlMode === "direct") {
    return ["direct-control"];
  }
  if (row.controlMode === "tribute-only") {
    return ["tribute-only"];
  }
  const hasLocalRuler = m3.enfeoffments.some(
    (entry) =>
      entry.districtId === districtId &&
      m3.characters.some(
        (character) =>
          character.characterId === entry.holderCharacterId && character.polityId === localPolityId
      )
  );
  return hasLocalRuler ? ["restore-vassal-ruler"] : [];
}

function postwarObligationSourcePrefix(settlementId: string): string {
  return `m3.postwar.${settlementId}.`;
}

function postwarDirectControlMarkerPrefix(districtId: DistrictId): string {
  return `m3.postwar.district.${districtId}.direct-control.`;
}

function postwarDirectControlMarkerSourceId(districtId: DistrictId, settlementId: string): string {
  return `${postwarDirectControlMarkerPrefix(districtId)}${settlementId}`;
}

function postwarControlMode(method: M3PostwarGovernanceMethodV1): M3AdministrativeControlModeV0 {
  switch (method) {
    case "direct-control":
      return "direct";
    case "restore-vassal-ruler":
      return "vassal";
    case "tribute-only":
      return "tribute-only";
  }
}

function postwarLocalComplexityBump(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 90;
    case "restore-vassal-ruler":
      return 40;
    case "tribute-only":
      return 20;
  }
}

function postwarCommunicationBump(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 70;
    case "restore-vassal-ruler":
      return 40;
    case "tribute-only":
      return 60;
  }
}

function postwarDirectness(method: M3PostwarGovernanceMethodV1, baseDirectness: number): number {
  switch (method) {
    case "direct-control":
      return baseDirectness + 220;
    case "restore-vassal-ruler":
      return divideInteger(baseDirectness, 2) + 80;
    case "tribute-only":
      return 40;
  }
}

function postwarFrontierBump(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 140;
    case "restore-vassal-ruler":
      return 90;
    case "tribute-only":
      return 120;
  }
}

function postwarIncomeShareBps(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 10_000;
    case "restore-vassal-ruler":
      return 2_500;
    case "tribute-only":
      return 1_000;
  }
}

function postwarLocalAcceptanceBaseBps(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 4_500;
    case "restore-vassal-ruler":
      return 7_500;
    case "tribute-only":
      return 6_800;
  }
}

function postwarReliabilityBaseBps(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 6_400;
    case "restore-vassal-ruler":
      return 8_000;
    case "tribute-only":
      return 5_200;
  }
}

function postwarReadinessBaseBps(method: M3PostwarGovernanceMethodV1): number {
  switch (method) {
    case "direct-control":
      return 7_600;
    case "restore-vassal-ruler":
      return 6_800;
    case "tribute-only":
      return 2_500;
  }
}

function postwarReasonCodes(
  method: M3PostwarGovernanceMethodV1,
  burden: M3AdministrativeBurdenProfileV0,
  obligationShape: M3PostwarGovernanceObligationShapeReadModelV1,
  localAcceptanceBps: number
): readonly string[] {
  return [
    `postwar.method.${method}`,
    `postwar.control-mode.${burden.controlMode}`,
    burden.overload > 0 ? "postwar.admin.overloaded" : "postwar.admin.within-capacity",
    obligationShape.hasDirectGarrison ? "postwar.garrison.direct" : "postwar.garrison.not-direct",
    obligationShape.tributeCash > 0 ? "postwar.obligation.tribute" : "postwar.obligation.none",
    obligationShape.troopHeadcount > 0
      ? "postwar.obligation.troops"
      : "postwar.obligation.no-troops",
    localAcceptanceBps >= 7_000
      ? "postwar.local-acceptance.strong"
      : "postwar.local-acceptance.strained"
  ];
}

function postwarCycles(months: number, periodDays: number): number {
  const totalDays = months * 30;
  const cycles = divideInteger(totalDays, periodDays);
  return cycles < 1 ? 1 : cycles;
}

function divideInteger(dividend: number, divisor: number): number {
  return (dividend - (dividend % divisor)) / divisor;
}

function m3OfficeDecisionScaffold(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  office: M3OfficeStateV0
): M3DecisionOfficeScaffoldReadModelV1 {
  const holder =
    office.holderCharacterId === null ? undefined : findM3Character(m3, office.holderCharacterId);
  const policy = m3.policies.find((entry) => entry.policyId === office.policyId);
  const performance = computeM3OfficeExecutionPerformanceBps(m3, office, holder);
  return {
    officeId: office.officeId,
    holderCharacterId: office.holderCharacterId,
    policyId: office.policyId,
    executionPerformanceBps: performance,
    reasonCodes: [
      holderSkillReasonCode(office, holder),
      relationshipReasonCode(m3, office, holder),
      `policy.office.${policy?.stance ?? "balanced"}`
    ]
  };
}

function m3EnfeoffmentDecisionScaffold(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  enfeoffment: M3EnfeoffmentStateV0
): M3DecisionEnfeoffmentScaffoldReadModelV1 {
  const holder = findM3Character(m3, enfeoffment.holderCharacterId);
  const policy = m3.policies.find((entry) => entry.policyId === enfeoffment.policyId);
  return {
    districtId: enfeoffment.districtId,
    holderCharacterId: enfeoffment.holderCharacterId,
    reasonCodes: [
      holder?.currentDistrictId === enfeoffment.districtId
        ? "enfeoffment.local-holder"
        : "enfeoffment.nonlocal-holder",
      `policy.jurisdiction.${policy?.stance ?? "balanced"}`
    ]
  };
}

function computeM3OfficeExecutionPerformanceBps(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  office: M3OfficeStateV0,
  holder: M3CharacterStateV0 | undefined
): number {
  if (holder === undefined) {
    return 0;
  }
  const skill = office.officeKind === "commander" ? holder.commandBps : holder.administrationBps;
  const relationship = relationshipAdjustmentBps(m3, office, holder);
  const policy = m3.policies.find((entry) => entry.policyId === office.policyId);
  const policyAdjustment = policy?.stance === "military" ? 100 : 0;
  return clampBps(skill + relationship + policyAdjustment);
}

function holderSkillReasonCode(
  office: M3OfficeStateV0,
  holder: M3CharacterStateV0 | undefined
): string {
  if (holder === undefined) {
    return "appointment.holder.vacant";
  }
  const skill = office.officeKind === "commander" ? holder.commandBps : holder.administrationBps;
  return skill >= 7_000 ? "appointment.holder.skill-strong" : "appointment.holder.skill-weak";
}

function relationshipReasonCode(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  office: M3OfficeStateV0,
  holder: M3CharacterStateV0 | undefined
): string {
  if (holder === undefined) {
    return "appointment.relationship.none";
  }
  const adjustment = relationshipAdjustmentBps(m3, office, holder);
  if (adjustment > 0) {
    return "appointment.relationship.supportive";
  }
  if (adjustment < 0) {
    return "appointment.relationship.strained";
  }
  return "appointment.relationship.neutral";
}

function relationshipAdjustmentBps(
  m3: NonNullable<WorldStateV0["state"]["m3"]>,
  office: M3OfficeStateV0,
  holder: M3CharacterStateV0
): number {
  const primaryPeer = m3.offices.find(
    (entry) =>
      entry.polityId === office.polityId &&
      entry.primary &&
      entry.officeId !== office.officeId &&
      entry.holderCharacterId !== null
  );
  if (primaryPeer?.holderCharacterId === undefined || primaryPeer.holderCharacterId === null) {
    const fallback = [...m3.relationships]
      .filter((entry) => entry.sourceCharacterId === holder.characterId)
      .sort((left, right) => left.targetCharacterId - right.targetCharacterId)[0];
    return fallback?.affinityBps ?? 0;
  }
  const relationship = m3.relationships.find(
    (entry) =>
      entry.sourceCharacterId === holder.characterId &&
      entry.targetCharacterId === primaryPeer.holderCharacterId
  );
  if (relationship === undefined) {
    const fallback = [...m3.relationships]
      .filter((entry) => entry.sourceCharacterId === holder.characterId)
      .sort((left, right) => left.targetCharacterId - right.targetCharacterId)[0];
    return fallback?.affinityBps ?? 0;
  }
  return relationship.affinityBps;
}

function clampBps(value: number): number {
  if (value < 0) {
    return 0;
  }
  if (value > 10_000) {
    return 10_000;
  }
  return value;
}

function executeListMapTopologyQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const topology = listMapTopologyV1(runtime.world);
  if (topology === undefined) {
    return {
      status: "rejected",
      error: {
        code: "topology-state-missing",
        path: "definitions.topology",
        message: "sim.list-map-topology requires an authoritative map topology definition."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-map-topology",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      topology
    }
  };
}

function executeMapTopologyPathPreviewQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.preview-map-topology-path" }>
): QueryResultV1 {
  if (runtime.world.definitions.topology === undefined) {
    return {
      status: "rejected",
      error: {
        code: "topology-state-missing",
        path: "definitions.topology",
        message: "sim.preview-map-topology-path requires an authoritative map topology definition."
      }
    };
  }

  const originDistrictId = parseDistrictId(query.payload.originDistrictId);
  const destinationDistrictId = parseDistrictId(query.payload.destinationDistrictId);
  if (!runtime.world.definitions.districts.some((district) => district.id === originDistrictId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.originDistrictId",
        message: "sim.preview-map-topology-path references a missing origin DistrictId."
      }
    };
  }
  if (
    !runtime.world.definitions.districts.some((district) => district.id === destinationDistrictId)
  ) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.destinationDistrictId",
        message: "sim.preview-map-topology-path references a missing destination DistrictId."
      }
    };
  }

  const preview = previewMapTopologyPathV1(runtime.world, {
    originDistrictId,
    destinationDistrictId,
    stockAmount: query.payload.stockAmount,
    day: runtime.world.meta.currentDay
  });

  return {
    status: "ok",
    result: {
      kind: "sim.preview-map-topology-path",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      monthOfYear: getGameCalendarDate(runtime.world.meta.currentDay).monthOfYear,
      route: preview
    }
  };
}

function executeM2TransportRoutePreviewQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.preview-m2-transport-route" }>
): QueryResultV1 {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.preview-m2-transport-route requires an M2 transport state."
      }
    };
  }

  const originDistrictId = parseDistrictId(query.payload.originDistrictId);
  const destinationDistrictId = parseDistrictId(query.payload.destinationDistrictId);
  if (!runtime.world.definitions.districts.some((district) => district.id === originDistrictId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.originDistrictId",
        message: "sim.preview-m2-transport-route references a missing origin DistrictId."
      }
    };
  }
  if (
    !runtime.world.definitions.districts.some((district) => district.id === destinationDistrictId)
  ) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.destinationDistrictId",
        message: "sim.preview-m2-transport-route references a missing destination DistrictId."
      }
    };
  }

  const preview = previewM2TransportRouteV0(runtime.world, {
    originDistrictId,
    destinationDistrictId,
    stockAmount: query.payload.stockAmount,
    day: runtime.world.meta.currentDay
  });

  return {
    status: "ok",
    result: {
      kind: "sim.preview-m2-transport-route",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      monthOfYear: getGameCalendarDate(runtime.world.meta.currentDay).monthOfYear,
      route:
        preview.status === "unreachable"
          ? {
              status: preview.status,
              originDistrictId: preview.originDistrictId,
              destinationDistrictId: preview.destinationDistrictId,
              stockAmount: preview.stockAmount,
              edges: []
            }
          : {
              status: preview.status,
              originDistrictId: preview.originDistrictId,
              destinationDistrictId: preview.destinationDistrictId,
              stockAmount: preview.stockAmount,
              totalCost: preview.totalCost,
              bottleneckCapacity: preview.bottleneckCapacity,
              edges: preview.edges.map((edge) => ({ ...edge }))
            }
    }
  };
}

function commitRuntimeState(world: WorldStateV0, state: WorldStateV0["state"]): WorldStateV0 {
  const nextWorldWithoutHash: WorldStateV0 = {
    ...world,
    state,
    meta: {
      ...world.meta,
      revision: parseWorldRevision(world.meta.revision + 1),
      stateHash: ""
    }
  };

  return {
    ...nextWorldWithoutHash,
    meta: {
      ...nextWorldWithoutHash.meta,
      stateHash: hashWorldStateV0(nextWorldWithoutHash)
    }
  };
}

function validateCommittedWorld(world: WorldStateV0): DomainErrorV1 | null {
  const errors = validateWorldStateV0(world);
  if (errors.length === 0) {
    return null;
  }

  const first = errors[0];
  if (first === undefined) {
    return null;
  }

  return {
    code: "invariant-violation",
    path: first.path,
    message: first.message
  };
}

function copyDistrictControlState(control: DistrictControlState): DistrictControlState {
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

function appendAcceptedCommandId(
  commandIds: readonly string[],
  commandId: string
): readonly string[] {
  return [...commandIds, commandId].sort(compareText);
}

function appendTail<TValue>(
  values: readonly TValue[],
  ...nextValues: readonly TValue[]
): readonly TValue[] {
  return [...values, ...nextValues].slice(-32);
}

function scenarioIdForRuntime(runtime: SimulationRuntimeV1): string {
  if (runtime.world.meta.contentManifestHash === "m6-alpha-start-to-victory-fixture") {
    return "m6.alpha-start-to-victory-001";
  }
  if (runtime.world.meta.contentManifestHash === M1_ABSTRACT_GRAPH_30_CONTENT_MANIFEST_HASH) {
    return M1_ABSTRACT_GRAPH_30_SCENARIO_ID;
  }

  return "minimal-m1";
}

function domainEventToRecord(event: DomainEventV1): Record<string, unknown> {
  switch (event.kind) {
    case "sim.day-advanced":
      return { ...event };
    case "sim.district-control-changed":
      return { ...event };
    case "sim.labor-committed":
      return { ...event };
    case "sim.polity-suzerain-changed":
      return { ...event };
    case "sim.obligation-created":
      return { ...event };
    case "sim.obligation-settled":
      return { ...event };
    case "sim.m3-appointment-audited":
      return { ...event };
    case "sim.m3-succession-updated":
      return { ...event };
    case "sim.m3-postwar-governance-applied":
      return { ...event };
    case "sim.grain-supply-reserved":
      return { ...event };
    case "sim.grain-supply-consumed":
      return { ...event };
    case "sim.grain-supply-released":
      return { ...event };
    case "sim.m4-field-engagement-resolved":
      return { ...event };
    case "sim.m4-siege-choice-applied":
      return { ...event };
    case "sim.m6-diplomatic-agreement-proposed":
      return { ...event };
    case "sim.m6-diplomatic-agreement-answered":
      return { ...event };
    case "sim.m6-legitimacy-source-recorded":
      return { ...event };
    case "sim.m6-policy-event-option-chosen":
      return { ...event };
    case "sim.m6-alpha-terminal-state-recorded":
      return { ...event };
    case "sim.state-hash-verified":
      return { ...event };
  }
}

type SavedEventTailParseResult =
  | { readonly ok: true; readonly value: readonly DomainEventV1[] }
  | { readonly ok: false; readonly reasons: readonly SaveLoadRejectionReasonV1[] };

type SavedDomainEventParseResult =
  | { readonly ok: true; readonly value: DomainEventV1 }
  | { readonly ok: false };

function parseSavedEventTail(
  entries: readonly { readonly event: Record<string, unknown> }[]
): SavedEventTailParseResult {
  const reasons: SaveLoadRejectionReasonV1[] = [];
  const events: DomainEventV1[] = [];

  entries.forEach((entry, index) => {
    const parsed = parseSavedDomainEvent(entry.event, `body.eventTail[${index}].event`, reasons);
    if (parsed.ok) {
      events.push(parsed.value);
    }
  });

  if (reasons.length > 0) {
    return {
      ok: false,
      reasons
    };
  }

  return {
    ok: true,
    value: events
  };
}

function parseSavedDomainEvent(
  record: Record<string, unknown>,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): SavedDomainEventParseResult {
  if (record["schemaVersion"] !== 1) {
    reasons.push({
      code: "invalid-schema",
      path: `${path}.schemaVersion`,
      message: "Saved DomainEvent schemaVersion must be 1."
    });
    return { ok: false };
  }

  const kind = record["kind"];
  switch (kind) {
    case "sim.day-advanced": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const fromDay = readNumberRecordField(record, "fromDay", `${path}.fromDay`, reasons);
      const toDay = readNumberRecordField(record, "toDay", `${path}.toDay`, reasons);
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        fromDay === undefined ||
        toDay === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          fromDay,
          toDay,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.district-control-changed": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const districtId = readPositiveIdRecordField(
        record,
        "districtId",
        `${path}.districtId`,
        reasons
      );
      const previousControllerPolityId = readNullablePolityId(
        record,
        "previousControllerPolityId",
        `${path}.previousControllerPolityId`,
        reasons
      );
      const nextControllerPolityId = readNullablePolityId(
        record,
        "nextControllerPolityId",
        `${path}.nextControllerPolityId`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        districtId === undefined ||
        previousControllerPolityId === undefined ||
        nextControllerPolityId === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          districtId: parseDistrictId(districtId),
          previousControllerPolityId,
          nextControllerPolityId,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.labor-committed": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const populationGroupId = readPositiveIdRecordField(
        record,
        "populationGroupId",
        `${path}.populationGroupId`,
        reasons
      );
      const purpose = readLaborPurposeRecordField(record, "purpose", `${path}.purpose`, reasons);
      const laborAmount = readNumberRecordField(
        record,
        "laborAmount",
        `${path}.laborAmount`,
        reasons
      );
      const releaseDay = readNumberRecordField(record, "releaseDay", `${path}.releaseDay`, reasons);
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        populationGroupId === undefined ||
        purpose === undefined ||
        laborAmount === undefined ||
        releaseDay === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          populationGroupId: parsePopulationGroupId(populationGroupId),
          purpose,
          laborAmount,
          releaseDay,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.grain-supply-reserved": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const reservationId = readPositiveIdRecordField(
        record,
        "reservationId",
        `${path}.reservationId`,
        reasons
      );
      const campaignPlanId = readPositiveIdRecordField(
        record,
        "campaignPlanId",
        `${path}.campaignPlanId`,
        reasons
      );
      const reservedAmount = readNumberRecordField(
        record,
        "reservedAmount",
        `${path}.reservedAmount`,
        reasons
      );
      const sourceCount = readNumberRecordField(
        record,
        "sourceCount",
        `${path}.sourceCount`,
        reasons
      );
      const expectedDailyConsumption = readNumberRecordField(
        record,
        "expectedDailyConsumption",
        `${path}.expectedDailyConsumption`,
        reasons
      );
      const expectedDaysOfSupply = readNumberRecordField(
        record,
        "expectedDaysOfSupply",
        `${path}.expectedDaysOfSupply`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        reservationId === undefined ||
        campaignPlanId === undefined ||
        reservedAmount === undefined ||
        sourceCount === undefined ||
        expectedDailyConsumption === undefined ||
        expectedDaysOfSupply === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }
      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          reservationId,
          campaignPlanId,
          reservedAmount,
          sourceCount,
          expectedDailyConsumption,
          expectedDaysOfSupply,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.grain-supply-consumed": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const reservationId = readPositiveIdRecordField(
        record,
        "reservationId",
        `${path}.reservationId`,
        reasons
      );
      const campaignPlanId = readPositiveIdRecordField(
        record,
        "campaignPlanId",
        `${path}.campaignPlanId`,
        reasons
      );
      const consumedAmount = readNumberRecordField(
        record,
        "consumedAmount",
        `${path}.consumedAmount`,
        reasons
      );
      const lossAmount = readNumberRecordField(record, "lossAmount", `${path}.lossAmount`, reasons);
      const shortageAmount = readNumberRecordField(
        record,
        "shortageAmount",
        `${path}.shortageAmount`,
        reasons
      );
      const carriedAmountAfter = readNumberRecordField(
        record,
        "carriedAmountAfter",
        `${path}.carriedAmountAfter`,
        reasons
      );
      const lossReasonCode = readNullableStringRecordField(
        record,
        "lossReasonCode",
        `${path}.lossReasonCode`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        reservationId === undefined ||
        campaignPlanId === undefined ||
        consumedAmount === undefined ||
        lossAmount === undefined ||
        shortageAmount === undefined ||
        carriedAmountAfter === undefined ||
        lossReasonCode === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }
      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          reservationId,
          campaignPlanId,
          consumedAmount,
          lossAmount,
          shortageAmount,
          carriedAmountAfter,
          lossReasonCode,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.grain-supply-released": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const reservationId = readPositiveIdRecordField(
        record,
        "reservationId",
        `${path}.reservationId`,
        reasons
      );
      const campaignPlanId = readPositiveIdRecordField(
        record,
        "campaignPlanId",
        `${path}.campaignPlanId`,
        reasons
      );
      const releasedAmount = readNumberRecordField(
        record,
        "releasedAmount",
        `${path}.releasedAmount`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        reservationId === undefined ||
        campaignPlanId === undefined ||
        releasedAmount === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }
      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          reservationId,
          campaignPlanId,
          releasedAmount,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m3-succession-updated": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const successionId = readPositiveIdRecordField(
        record,
        "successionId",
        `${path}.successionId`,
        reasons
      );
      const polityId = readPositiveIdRecordField(record, "polityId", `${path}.polityId`, reasons);
      const status = readM3SuccessionStatusRecordField(record, "status", `${path}.status`, reasons);
      const outcomeKind = readNullableM3SuccessionOutcomeKindRecordField(
        record,
        "outcomeKind",
        `${path}.outcomeKind`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        successionId === undefined ||
        polityId === undefined ||
        status === undefined ||
        outcomeKind === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }
      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          successionId,
          polityId: parsePolityId(polityId),
          status,
          outcomeKind,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m3-postwar-governance-applied": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const settlementId = readStringRecordField(
        record,
        "settlementId",
        `${path}.settlementId`,
        reasons
      );
      const method = readM3PostwarGovernanceMethodRecordField(
        record,
        "method",
        `${path}.method`,
        reasons
      );
      const victorPolityId = readPositiveIdRecordField(
        record,
        "victorPolityId",
        `${path}.victorPolityId`,
        reasons
      );
      const localPolityId = readPositiveIdRecordField(
        record,
        "localPolityId",
        `${path}.localPolityId`,
        reasons
      );
      const districtId = readPositiveIdRecordField(
        record,
        "districtId",
        `${path}.districtId`,
        reasons
      );
      const obligationIds = readPositiveIdArrayRecordField(
        record,
        "obligationIds",
        `${path}.obligationIds`,
        reasons
      );
      const administrativeLoad = readNumberRecordField(
        record,
        "administrativeLoad",
        `${path}.administrativeLoad`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        settlementId === undefined ||
        method === undefined ||
        victorPolityId === undefined ||
        localPolityId === undefined ||
        districtId === undefined ||
        obligationIds === undefined ||
        administrativeLoad === undefined ||
        reasonCodes === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          settlementId,
          method,
          victorPolityId: parsePolityId(victorPolityId),
          localPolityId: parsePolityId(localPolityId),
          districtId: parseDistrictId(districtId),
          obligationIds: obligationIds.map(parseM3ObligationId),
          administrativeLoad,
          reasonCodes,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m4-field-engagement-resolved": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const engagementId = readPositiveIdRecordField(
        record,
        "engagementId",
        `${path}.engagementId`,
        reasons
      );
      const campaignPlanId = readPositiveIdRecordField(
        record,
        "campaignPlanId",
        `${path}.campaignPlanId`,
        reasons
      );
      const marchId = readPositiveIdRecordField(record, "marchId", `${path}.marchId`, reasons);
      const attackerPolityId = readPositiveIdRecordField(
        record,
        "attackerPolityId",
        `${path}.attackerPolityId`,
        reasons
      );
      const defenderPolityId = readPositiveIdRecordField(
        record,
        "defenderPolityId",
        `${path}.defenderPolityId`,
        reasons
      );
      const outcome = readM4FieldEngagementOutcomeRecordField(
        record,
        "outcome",
        `${path}.outcome`,
        reasons
      );
      const attackerCasualties = readNumberRecordField(
        record,
        "attackerCasualties",
        `${path}.attackerCasualties`,
        reasons
      );
      const defenderCasualties = readNumberRecordField(
        record,
        "defenderCasualties",
        `${path}.defenderCasualties`,
        reasons
      );
      const supplyLoss = readNumberRecordField(record, "supplyLoss", `${path}.supplyLoss`, reasons);
      const campaignStatusBefore = readM4CampaignStatusRecordField(
        record,
        "campaignStatusBefore",
        `${path}.campaignStatusBefore`,
        reasons
      );
      const campaignStatusAfter = readM4CampaignStatusRecordField(
        record,
        "campaignStatusAfter",
        `${path}.campaignStatusAfter`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const creditHooks = readM4CampaignHooksRecordField(
        record,
        "creditHooks",
        `${path}.creditHooks`,
        reasons
      );
      const reputationHooks = readM4CampaignHooksRecordField(
        record,
        "reputationHooks",
        `${path}.reputationHooks`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        engagementId === undefined ||
        campaignPlanId === undefined ||
        marchId === undefined ||
        attackerPolityId === undefined ||
        defenderPolityId === undefined ||
        outcome === undefined ||
        attackerCasualties === undefined ||
        defenderCasualties === undefined ||
        supplyLoss === undefined ||
        campaignStatusBefore === undefined ||
        campaignStatusAfter === undefined ||
        reasonCodes === undefined ||
        creditHooks === undefined ||
        reputationHooks === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          engagementId,
          campaignPlanId,
          marchId,
          attackerPolityId: parsePolityId(attackerPolityId),
          defenderPolityId: parsePolityId(defenderPolityId),
          outcome,
          attackerCasualties,
          defenderCasualties,
          supplyLoss,
          campaignStatusBefore,
          campaignStatusAfter,
          reasonCodes,
          creditHooks,
          reputationHooks,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m4-siege-choice-applied": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const siegeId = readPositiveIdRecordField(record, "siegeId", `${path}.siegeId`, reasons);
      const campaignPlanId = readPositiveIdRecordField(
        record,
        "campaignPlanId",
        `${path}.campaignPlanId`,
        reasons
      );
      const marchId = readPositiveIdRecordField(record, "marchId", `${path}.marchId`, reasons);
      const choice = readM4SiegeChoiceRecordField(record, "choice", `${path}.choice`, reasons);
      const statusBefore = readNullableM4SiegeStatusRecordField(
        record,
        "statusBefore",
        `${path}.statusBefore`,
        reasons
      );
      const statusAfter = readM4SiegeStatusRecordField(
        record,
        "statusAfter",
        `${path}.statusAfter`,
        reasons
      );
      const attackerCasualties = readNumberRecordField(
        record,
        "attackerCasualties",
        `${path}.attackerCasualties`,
        reasons
      );
      const defenderCasualties = readNumberRecordField(
        record,
        "defenderCasualties",
        `${path}.defenderCasualties`,
        reasons
      );
      const supplyLoss = readNumberRecordField(record, "supplyLoss", `${path}.supplyLoss`, reasons);
      const campaignStatusBefore = readM4CampaignStatusRecordField(
        record,
        "campaignStatusBefore",
        `${path}.campaignStatusBefore`,
        reasons
      );
      const campaignStatusAfter = readM4CampaignStatusRecordField(
        record,
        "campaignStatusAfter",
        `${path}.campaignStatusAfter`,
        reasons
      );
      const surrenderEligible = readBooleanRecordField(
        record,
        "surrenderEligible",
        `${path}.surrenderEligible`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const creditHooks = readM4CampaignHooksRecordField(
        record,
        "creditHooks",
        `${path}.creditHooks`,
        reasons
      );
      const reputationHooks = readM4CampaignHooksRecordField(
        record,
        "reputationHooks",
        `${path}.reputationHooks`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        siegeId === undefined ||
        campaignPlanId === undefined ||
        marchId === undefined ||
        choice === undefined ||
        statusBefore === undefined ||
        statusAfter === undefined ||
        attackerCasualties === undefined ||
        defenderCasualties === undefined ||
        supplyLoss === undefined ||
        campaignStatusBefore === undefined ||
        campaignStatusAfter === undefined ||
        surrenderEligible === undefined ||
        reasonCodes === undefined ||
        creditHooks === undefined ||
        reputationHooks === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          siegeId,
          campaignPlanId,
          marchId,
          choice,
          statusBefore,
          statusAfter,
          attackerCasualties,
          defenderCasualties,
          supplyLoss,
          campaignStatusBefore,
          campaignStatusAfter,
          surrenderEligible,
          reasonCodes,
          creditHooks,
          reputationHooks,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m6-diplomatic-agreement-proposed": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const relationId = readPositiveIdRecordField(
        record,
        "relationId",
        `${path}.relationId`,
        reasons
      );
      const agreementId = readPositiveIdRecordField(
        record,
        "agreementId",
        `${path}.agreementId`,
        reasons
      );
      const proposerPolityId = readPositiveIdRecordField(
        record,
        "proposerPolityId",
        `${path}.proposerPolityId`,
        reasons
      );
      const targetPolityId = readPositiveIdRecordField(
        record,
        "targetPolityId",
        `${path}.targetPolityId`,
        reasons
      );
      const agreementKind = readM6AgreementKindRecordField(
        record,
        "agreementKind",
        `${path}.agreementKind`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        relationId === undefined ||
        agreementId === undefined ||
        proposerPolityId === undefined ||
        targetPolityId === undefined ||
        agreementKind === undefined ||
        reasonCodes === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          relationId,
          agreementId,
          proposerPolityId: parsePolityId(proposerPolityId),
          targetPolityId: parsePolityId(targetPolityId),
          agreementKind,
          reasonCodes,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m6-diplomatic-agreement-answered": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const agreementId = readPositiveIdRecordField(
        record,
        "agreementId",
        `${path}.agreementId`,
        reasons
      );
      const statusAfter = readM6AgreementStatusRecordField(
        record,
        "statusAfter",
        `${path}.statusAfter`,
        reasons
      );
      const recognitionCreated = readBooleanRecordField(
        record,
        "recognitionCreated",
        `${path}.recognitionCreated`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        agreementId === undefined ||
        statusAfter === undefined ||
        recognitionCreated === undefined ||
        reasonCodes === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          agreementId,
          statusAfter,
          recognitionCreated,
          reasonCodes,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m6-legitimacy-source-recorded": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const sourceId = readPositiveIdRecordField(record, "sourceId", `${path}.sourceId`, reasons);
      const polityId = readPositiveIdRecordField(record, "polityId", `${path}.polityId`, reasons);
      const audience = readM6AudienceRecordField(record, "audience", `${path}.audience`, reasons);
      const magnitudeBps = readNumberRecordField(
        record,
        "magnitudeBps",
        `${path}.magnitudeBps`,
        reasons
      );
      const scoreAfterBps = readNumberRecordField(
        record,
        "scoreAfterBps",
        `${path}.scoreAfterBps`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        sourceId === undefined ||
        polityId === undefined ||
        audience === undefined ||
        magnitudeBps === undefined ||
        scoreAfterBps === undefined ||
        reasonCodes === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          sourceId,
          polityId: parsePolityId(polityId),
          audience,
          magnitudeBps,
          scoreAfterBps,
          reasonCodes,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m6-policy-event-option-chosen": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const eventInstanceId = readPositiveIdRecordField(
        record,
        "eventInstanceId",
        `${path}.eventInstanceId`,
        reasons
      );
      const eventDefinitionId = readPositiveIdRecordField(
        record,
        "eventDefinitionId",
        `${path}.eventDefinitionId`,
        reasons
      );
      const selectedOptionId = readPositiveIdRecordField(
        record,
        "selectedOptionId",
        `${path}.selectedOptionId`,
        reasons
      );
      const causeReasonCodes = readStringArrayRecordField(
        record,
        "causeReasonCodes",
        `${path}.causeReasonCodes`,
        reasons
      );
      const optionReasonCodes = readStringArrayRecordField(
        record,
        "optionReasonCodes",
        `${path}.optionReasonCodes`,
        reasons
      );
      const consequenceReasonCodes = readStringArrayRecordField(
        record,
        "consequenceReasonCodes",
        `${path}.consequenceReasonCodes`,
        reasons
      );
      const encyclopediaRefs = readStringArrayRecordField(
        record,
        "encyclopediaRefs",
        `${path}.encyclopediaRefs`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        eventInstanceId === undefined ||
        eventDefinitionId === undefined ||
        selectedOptionId === undefined ||
        causeReasonCodes === undefined ||
        optionReasonCodes === undefined ||
        consequenceReasonCodes === undefined ||
        encyclopediaRefs === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          eventInstanceId,
          eventDefinitionId,
          selectedOptionId,
          causeReasonCodes,
          optionReasonCodes,
          consequenceReasonCodes,
          encyclopediaRefs,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.m6-alpha-terminal-state-recorded": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const terminalStateId = readPositiveIdRecordField(
        record,
        "terminalStateId",
        `${path}.terminalStateId`,
        reasons
      );
      const polityId = readPositiveIdRecordField(record, "polityId", `${path}.polityId`, reasons);
      const outcome = readM6AlphaTerminalOutcomeRecordField(
        record,
        "outcome",
        `${path}.outcome`,
        reasons
      );
      const reasonCodes = readStringArrayRecordField(
        record,
        "reasonCodes",
        `${path}.reasonCodes`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        terminalStateId === undefined ||
        polityId === undefined ||
        outcome === undefined ||
        reasonCodes === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          terminalStateId,
          polityId: parsePolityId(polityId),
          outcome,
          reasonCodes,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.state-hash-verified": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const day = readNumberRecordField(record, "day", `${path}.day`, reasons);
      const revision = readNumberRecordField(record, "revision", `${path}.revision`, reasons);
      const stateHash = readStringRecordField(record, "stateHash", `${path}.stateHash`, reasons);
      if (
        commandId === undefined ||
        actor === undefined ||
        day === undefined ||
        revision === undefined ||
        stateHash === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          day,
          revision,
          stateHash
        }
      };
    }
    default:
      reasons.push({
        code: "invalid-schema",
        path: `${path}.kind`,
        message: "Saved DomainEvent kind is not supported."
      });
      return { ok: false };
  }
}

function readStringRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): string | undefined {
  const value = record[key];
  if (typeof value !== "string") {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a string.`
    });
    return undefined;
  }
  return value;
}

function readNullableStringRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): string | null | undefined {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a string or null.`
    });
    return undefined;
  }
  return value;
}

function readNumberRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a safe integer.`
    });
    return undefined;
  }
  return value;
}

function readBooleanRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): boolean | undefined {
  const value = record[key];
  if (typeof value !== "boolean") {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a boolean.`
    });
    return undefined;
  }
  return value;
}

function readStringArrayRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): readonly string[] | undefined {
  const value = record[key];
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a string array.`
    });
    return undefined;
  }
  return [...value];
}

function readPositiveIdArrayRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): readonly number[] | undefined {
  const value = record[key];
  if (
    !Array.isArray(value) ||
    !value.every((entry) => typeof entry === "number" && Number.isSafeInteger(entry) && entry > 0)
  ) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a positive integer array.`
    });
    return undefined;
  }
  return [...value];
}

function readM3PostwarGovernanceMethodRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M3PostwarGovernanceMethodV1 | undefined {
  const value = record[key];
  if (value === "direct-control" || value === "restore-vassal-ruler" || value === "tribute-only") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M3 postwar governance method.`
  });
  return undefined;
}

function readM4CampaignHooksRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M4FieldEngagementStateV0["creditHooks"] | undefined {
  const value = record[key];
  if (!Array.isArray(value)) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be an M4 campaign hook array.`
    });
    return undefined;
  }

  const hooks: {
    readonly polityId: PolityId;
    readonly amount: number;
    readonly reasonCode: string;
  }[] = [];
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      reasons.push({
        code: "invalid-schema",
        path: `${path}[${index}]`,
        message: `Saved event ${key} entry must be an object.`
      });
      return;
    }
    const polityId = readPositiveIdRecordField(
      entry,
      "polityId",
      `${path}[${index}].polityId`,
      reasons
    );
    const amount = readNumberRecordField(entry, "amount", `${path}[${index}].amount`, reasons);
    const reasonCode = readStringRecordField(
      entry,
      "reasonCode",
      `${path}[${index}].reasonCode`,
      reasons
    );
    if (polityId !== undefined && amount !== undefined && reasonCode !== undefined) {
      hooks.push({ polityId: parsePolityId(polityId), amount, reasonCode });
    }
  });
  return hooks;
}

function readM4FieldEngagementOutcomeRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M4FieldEngagementOutcomeV0 | undefined {
  const value = record[key];
  if (value === "attacker-victory" || value === "defender-holds") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be attacker-victory or defender-holds.`
  });
  return undefined;
}

function readM6AlphaTerminalOutcomeRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M6AlphaTerminalOutcomeV0 | undefined {
  const value = record[key];
  if (value === "victory" || value === "defeat" || value === "continued-play") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be victory, defeat, or continued-play.`
  });
  return undefined;
}

function readM4CampaignStatusRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M4CampaignPlanStateV0["status"] | undefined {
  const value = record[key];
  if (value === "planned" || value === "active" || value === "cancelled" || value === "completed") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M4 campaign status.`
  });
  return undefined;
}

function readM4SiegeChoiceRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M4SiegeChoiceV0 | undefined {
  const value = record[key];
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
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M4 siege choice.`
  });
  return undefined;
}

function readM4SiegeStatusRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M4SiegeStatusV0 | undefined {
  const value = record[key];
  if (
    value === "blockading" ||
    value === "surrender-ready" ||
    value === "surrendered" ||
    value === "lifted" ||
    value === "withdrawn"
  ) {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M4 siege status.`
  });
  return undefined;
}

function readM6AgreementKindRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M6DiplomaticAgreementStateV0["agreementKind"] | undefined {
  const value = record[key];
  if (
    value === "non-aggression" ||
    value === "military-access" ||
    value === "tribute-recognition"
  ) {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M6 agreement kind.`
  });
  return undefined;
}

function readM6AgreementStatusRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M6DiplomaticAgreementStateV0["status"] | undefined {
  const value = record[key];
  if (value === "proposed" || value === "active" || value === "rejected") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M6 agreement status.`
  });
  return undefined;
}

function readM3SuccessionStatusRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): "pending" | "resolved" | undefined {
  const value = record[key];
  if (value === "pending" || value === "resolved") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be pending or resolved.`
  });
  return undefined;
}

function readNullableM3SuccessionOutcomeKindRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): "disputed" | "peaceful" | "regency" | null | undefined {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (value === "disputed" || value === "peaceful" || value === "regency") {
    return value;
  }
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be null or a valid M3 succession outcome kind.`
  });
  return undefined;
}

function readM6AudienceRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M6LegitimacyAudienceV0 | undefined {
  const value = record[key];
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
  reasons.push({
    code: "invalid-schema",
    path,
    message: `Saved event ${key} must be a valid M6 legitimacy audience.`
  });
  return undefined;
}

function readNullableM4SiegeStatusRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M4SiegeStatusV0 | null | undefined {
  if (record[key] === null) {
    return null;
  }
  return readM4SiegeStatusRecordField(record, key, path, reasons);
}

function readLaborPurposeRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M2LaborCommitmentPurposeV0 | undefined {
  const value = record[key];
  if (value !== "mobilized") {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be mobilized.`
    });
    return undefined;
  }

  return value;
}

function readPositiveIdRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a positive safe integer.`
    });
    return undefined;
  }

  return value;
}

function readActorRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): CommandActorV1 | undefined {
  const value = record[key];
  if (!isRecord(value)) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be an actor object.`
    });
    return undefined;
  }
  const kind = value["kind"];
  if (kind !== "ai" && kind !== "player" && kind !== "system") {
    reasons.push({
      code: "invalid-schema",
      path: `${path}.kind`,
      message: `Saved event ${key}.kind is invalid.`
    });
    return undefined;
  }
  const id = readStringRecordField(value, "id", `${path}.id`, reasons);
  if (id === undefined) {
    return undefined;
  }
  return {
    kind,
    id
  };
}

function readNullablePolityId(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): PolityId | null | undefined {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a positive safe integer or null.`
    });
    return undefined;
  }

  return parsePolityId(value);
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

function readCommandId(input: unknown): string | null {
  if (!isRecord(input)) {
    return null;
  }

  const commandId = input["commandId"];
  return typeof commandId === "string" ? commandId : null;
}

function fromProtocolError(error: SerializableProtocolErrorV1): DomainErrorV1 {
  return {
    code: mapProtocolCode(error.code),
    path: error.path,
    message: error.message
  };
}

function mapProtocolCode(code: ProtocolErrorCodeV1): DomainErrorCodeV1 {
  switch (code) {
    case "invalid-payload":
      return "invalid-payload";
    case "unknown-command-kind":
      return "unknown-command-kind";
    case "unknown-query-kind":
      return "unknown-query-kind";
    case "unsupported-command-version":
      return "unsupported-command-version";
    case "unsupported-query-version":
      return "unsupported-query-version";
    case "unknown-message-type":
    case "unsupported-message-version":
      return "invalid-payload";
  }
}

function validateSaveTopologyCompatibility(
  currentWorld: WorldStateV0,
  candidate: unknown
): SaveSemanticIssueV1 | null {
  const currentTopology = currentWorld.definitions.topology;
  if (currentTopology === undefined) {
    return null;
  }

  const candidateTopologyHash = readCandidateTopologyHash(candidate);
  if (candidateTopologyHash === undefined) {
    return {
      path: "definitions.topology",
      message: "Save snapshot is missing required map topology for this runtime."
    };
  }

  if (candidateTopologyHash !== currentTopology.topologyHash) {
    return {
      path: "definitions.topology.topologyHash",
      message: `Save topology hash ${candidateTopologyHash} does not match runtime topology hash ${currentTopology.topologyHash}.`
    };
  }

  return null;
}

function readCandidateTopologyHash(candidate: unknown): string | undefined {
  if (!isRecord(candidate)) {
    return undefined;
  }

  const definitions = candidate["definitions"];
  if (!isRecord(definitions)) {
    return undefined;
  }

  const topology = definitions["topology"];
  if (!isRecord(topology)) {
    return undefined;
  }

  const topologyHash = topology["topologyHash"];
  return typeof topologyHash === "string" ? topologyHash : undefined;
}

function hasM2RuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m2"] !== undefined;
}

function hasM3RuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m3"] !== undefined;
}

function hasM4RuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m4"] !== undefined;
}

function hasM6RuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m6"] !== undefined;
}

function hasM6PolicyEventRuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m6PolicyEvents"] !== undefined;
}

function hasM6AlphaRuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m6Alpha"] !== undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

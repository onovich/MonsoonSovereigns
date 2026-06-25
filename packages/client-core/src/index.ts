import {
  GAME_COMMAND_SCHEMA_VERSION,
  HELLO_SIMULATION_PROTOCOL_VERSION,
  type BulkAppointOfficesCommandV1,
  type GameCommandV1,
  type HelloSimulationResultDto,
  type ListM2EconomySummariesResultV1,
  type ListM3AdministrativeBurdenResultV1,
  type ListM3DecisionScaffoldsResultV1,
  type ListM3SuccessionCrisesResultV1,
  type M2TransportRouteKindV1,
  type M3PostwarGovernanceMethodV1,
  type PreviewM2TransportRouteResultV1,
  type PreviewM3PostwarGovernanceResultV1
} from "@monsoon/protocol";

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

export interface ClientM3CommandContextInput {
  readonly snapshot: ClientM3AppointmentReadModelSnapshot;
  readonly commandId: string;
}

export type ClientM3SubmittedCommand = GameCommandV1;

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
    districtList: createEmptyDistrictListReadModel(revision),
    m3Appointment: createEmptyM3AppointmentReadModel(revision)
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
    districtList: fixture.districtList,
    m3Appointment: createM3AppointmentReadModelFixture(baseSnapshot.revision)
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
        m3Appointment: snapshot.m3Appointment
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
    m3Appointment: createEmptyM3AppointmentReadModel(revision)
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

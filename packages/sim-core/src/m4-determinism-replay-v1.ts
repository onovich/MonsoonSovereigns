import {
  canonicalizeM2EconomyPopulationState,
  canonicalizeM4CampaignStateV0,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  parseDistrictId,
  parseGameDay,
  parseM3ObligationAuditEventId,
  parseM3ObligationId,
  parsePersonId,
  parsePolityId,
  parsePopulationGroupId,
  parseRouteId,
  parseWorldRevision,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "./world-state-v0.ts";

export function createM4DeterminismReplayWorldStateV0(): WorldStateV0 {
  const definitions = createDefinitions();
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-determinism-replay-fixture",
    currentDay: 20,
    revision: 0,
    definitions,
    m2: createM2State(definitions),
    m3: createM3State(definitions),
    m4: canonicalizeM4CampaignStateV0(
      createM4CampaignStateV0(definitions, {
        campaignPlans: [],
        factionKnowledgeSnapshots: [],
        mobilizedForceCommitments: [],
        grainSupplyReservations: [],
        marches: [],
        fieldEngagements: [],
        sieges: [],
        withdrawals: [],
        warOutcomes: [],
        postwarCandidates: []
      })
    )
  });
  const controlledWorld: WorldStateV0 = {
    ...world,
    state: {
      ...world.state,
      districts: world.state.districts.map((district) => ({
        ...district,
        control: {
          kind: "controlled",
          controllerPolityId:
            district.definitionId === parseDistrictId(3) ? parsePolityId(2) : parsePolityId(1)
        }
      }))
    }
  };

  return {
    ...controlledWorld,
    meta: { ...controlledWorld.meta, stateHash: hashWorldStateV0(controlledWorld) }
  };
}

function createDefinitions(): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.attacker" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.defender" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m4.commander" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.midpoint" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.target" }
    ],
    settlements: [],
    routes: [
      {
        id: parseRouteId(10),
        fromDistrictId: parseDistrictId(1),
        toDistrictId: parseDistrictId(2),
        lengthInMapUnits: 1
      },
      {
        id: parseRouteId(11),
        fromDistrictId: parseDistrictId(2),
        toDistrictId: parseDistrictId(3),
        lengthInMapUnits: 1
      }
    ]
  };
}

function createM2State(definitions: WorldDefinitionsV0) {
  const base = createM2EconomyPopulationStateV0(definitions, {
    routes: definitions.routes.map((route) => ({
      routeId: route.id,
      fromDistrictId: route.fromDistrictId,
      toDistrictId: route.toDistrictId,
      routeKind: "road",
      baseTravelCost: route.lengthInMapUnits,
      baseCapacity: 120
    })),
    districtSeasonality: [
      { districtId: parseDistrictId(1), regionalCurveId: 1 },
      { districtId: parseDistrictId(2), regionalCurveId: 1 },
      { districtId: parseDistrictId(3), regionalCurveId: 1 }
    ],
    regionalCurves: [
      {
        id: 1,
        monthlyValues: Array.from({ length: 12 }, (_unused, index) => ({
          month: index + 1,
          monsoonIntensityBps: index + 1 === 7 ? 8_000 : 0,
          agricultureWorkBps: 5_000,
          riverNavigabilityBps: 8_000,
          roadTravelCostBps: index + 1 === 7 ? 16_000 : 10_000
        }))
      }
    ]
  });

  return canonicalizeM2EconomyPopulationState({
    ...base,
    populationGroups: [
      createPopulationGroup(1, 200),
      createPopulationGroup(2, 200),
      createPopulationGroup(3, 200)
    ]
  });
}

function createM3State(definitions: WorldDefinitionsV0) {
  return createM3PolityVassalageStateV0(definitions, {
    polities: [
      { polityId: parsePolityId(1), directSuzerainPolityId: null },
      { polityId: parsePolityId(2), directSuzerainPolityId: null }
    ],
    obligations: [createTroopObligation()],
    obligationAuditEvents: [createTroopObligationAuditEvent()],
    administrativeDistricts: [
      {
        polityId: parsePolityId(2),
        districtId: parseDistrictId(3),
        controlMode: "direct",
        localComplexity: 120,
        communicationCost: 70,
        directness: 90,
        frontierPressure: 80,
        administrativeCapacity: 1_000
      }
    ]
  });
}

function createPopulationGroup(districtId: number, grainStock: number) {
  return {
    id: parsePopulationGroupId(districtId),
    districtId: parseDistrictId(districtId),
    totalPeople: 1_000,
    workingPeople: 500,
    dependentPeople: 500,
    availableLabor: 500,
    committedLabor: [],
    grainStock,
    cashStock: 1_000
  };
}

function createTroopObligation() {
  return {
    id: parseM3ObligationId(1),
    debtorPolityId: parsePolityId(2),
    creditorPolityId: parsePolityId(1),
    obligationKind: "troop" as const,
    obligationCategory: "troop-obligation" as const,
    obligationSource: {
      kind: "vassalage" as const,
      sourceId: "m4.determinism.2-to-1",
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    requirement: { kind: "amount" as const, resourceKind: "troops" as const, amount: 120 },
    due: { kind: "cadence" as const, periodDays: 30, nextDueDay: parseGameDay(30) },
    accounting: {
      nominalAmount: 120,
      dueAmount: 120,
      deliveredAmount: 0,
      arrearsAmount: 0,
      defaultedAmount: 0,
      remittedAmount: 0,
      dueDay: parseGameDay(30),
      cycle: 1,
      troopResponseState: "none" as const
    },
    status: "active" as const,
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: parseM3ObligationAuditEventId(1),
    latestAuditEventId: parseM3ObligationAuditEventId(1)
  };
}

function createTroopObligationAuditEvent() {
  return {
    id: parseM3ObligationAuditEventId(1),
    obligationId: parseM3ObligationId(1),
    eventKind: "created" as const,
    eventDay: parseGameDay(0),
    eventRevision: parseWorldRevision(0),
    commandId: "m4.determinism.obligation.fixture",
    actor: { kind: "system" as const, id: "fixture" },
    actionKind: null,
    dueDay: null,
    fulfillmentId: null,
    fulfilledAmount: null,
    statusAfter: "active" as const,
    reasonCode: null,
    reasonCodes: ["obligation.created", "obligation.kind.troop-obligation"],
    reliabilityBps: 10_000
  };
}

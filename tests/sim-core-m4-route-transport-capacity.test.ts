import { describe, expect, test } from "vitest";

import {
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  parseCampaignPlanId,
  parseDistrictId,
  parseGameDay,
  parseGrainSupplyReservationId,
  parseM3ObligationAuditEventId,
  parseM3ObligationId,
  parseMobilizedForceCommitmentId,
  parsePersonId,
  parsePolityId,
  parsePopulationGroupId,
  parseRouteId,
  parseWorldRevision,
  querySimulationV1,
  validateWorldStateV0,
  type M2RouteTransportEdgeStateV0,
  type M4CampaignStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

describe("M4-ROUTE-TRANSPORT-CAPACITY-001 campaign route and transport capacity forecast", () => {
  test("forecasts route segments, bottleneck capacity, travel window, and overload reasons", () => {
    const runtime = runtimeWithM4({});
    const beforeHash = runtime.world.meta.stateHash;
    const preview = previewRouteCapacity(runtime, "m4.route.capacity");

    expect(preview.status).toBe("ok");
    if (
      preview.status !== "ok" ||
      preview.result.kind !== "sim.preview-m4-route-transport-capacity"
    ) {
      throw new Error("Expected M4 route transport forecast.");
    }

    expect(preview.result).toMatchObject({
      campaignPlanId: parseCampaignPlanId(10),
      targetDistrictId: parseDistrictId(4),
      plannedTroops: 60,
      carriedSupplyAvailable: 40,
      carriedSupplyLimit: 30,
      bottleneckCapacity: 30,
      reasonCodes: ["route.forecast.carried-supply-over-bottleneck", "route.forecast.overloaded"]
    });
    expect(preview.result.sourceForecasts).toHaveLength(1);
    expect(preview.result.sourceForecasts[0]).toMatchObject({
      reservationId: parseGrainSupplyReservationId(501),
      originDistrictId: parseDistrictId(1),
      destinationDistrictId: parseDistrictId(4),
      status: "capacity-exceeded",
      bottleneckCapacity: 30,
      carriedSupplyAmount: 40,
      carriedSupplyLimit: 30,
      overloadedReasonCode: "route.capacity.carried-supply-over-bottleneck",
      travelWindow: {
        earliestDepartureDay: parseGameDay(10),
        latestDepartureDay: parseGameDay(20),
        earliestArrivalDay: 20,
        latestArrivalDay: 30,
        travelDays: 10
      },
      seasonRiskReasonCodes: []
    });
    expect(
      preview.result.sourceForecasts[0]?.routeSegments.map((segment) => segment.routeId)
    ).toEqual([parseRouteId(10), parseRouteId(11)]);
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("uses stable route tie-breakers independent of route and reservation ordering", () => {
    const first = previewRouteCapacity(
      runtimeWithM4({
        routes: [
          route(12, 1, 3, 5, 80),
          route(13, 3, 4, 5, 30),
          route(10, 1, 2, 5, 80),
          route(11, 2, 4, 5, 30)
        ]
      }),
      "m4.route.tie.first"
    );
    const second = previewRouteCapacity(
      runtimeWithM4({
        routes: [
          route(11, 2, 4, 5, 30),
          route(10, 1, 2, 5, 80),
          route(13, 3, 4, 5, 30),
          route(12, 1, 3, 5, 80)
        ],
        reservations: [reservation(502, 1, 0), reservation(501, 1, 40)]
      }),
      "m4.route.tie.second"
    );

    expect(first.status).toBe("ok");
    expect(second.status).toBe("ok");
    if (
      first.status !== "ok" ||
      second.status !== "ok" ||
      first.result.kind !== "sim.preview-m4-route-transport-capacity" ||
      second.result.kind !== "sim.preview-m4-route-transport-capacity"
    ) {
      throw new Error("Expected M4 route transport forecasts.");
    }

    expect(
      first.result.sourceForecasts[0]?.routeSegments.map((segment) => segment.routeId)
    ).toEqual([parseRouteId(10), parseRouteId(11)]);
    expect(
      second.result.sourceForecasts[0]?.routeSegments.map((segment) => segment.routeId)
    ).toEqual(first.result.sourceForecasts[0]?.routeSegments.map((segment) => segment.routeId));
    expect(second.result.sourceForecasts).toEqual(first.result.sourceForecasts);
  });

  test("reports monsoon and season risk codes deterministically without changing the query result", () => {
    const runtime = runtimeWithM4({
      currentDay: 180,
      campaignPlan: campaignPlan({ earliestDay: 190, latestDay: 200 })
    });
    const first = previewRouteCapacity(runtime, "m4.route.season.first");
    const second = previewRouteCapacity(runtime, "m4.route.season.second");

    expect(first.status).toBe("ok");
    expect(second.status).toBe("ok");
    if (
      first.status !== "ok" ||
      second.status !== "ok" ||
      first.result.kind !== "sim.preview-m4-route-transport-capacity" ||
      second.result.kind !== "sim.preview-m4-route-transport-capacity"
    ) {
      throw new Error("Expected M4 route transport forecasts.");
    }

    expect(first.result.sourceForecasts[0]?.seasonRiskReasonCodes).toEqual([
      "route.season.monsoon-risk",
      "route.season.road-delay-risk"
    ]);
    expect(first.result.reasonCodes).toContain("route.forecast.seasonal-risk");
    expect(second.result).toEqual(first.result);
  });

  test("rejects invalid campaign or target references and reports unreachable routes read-only", () => {
    const runtime = runtimeWithM4({ routes: [] });
    const beforeHash = runtime.world.meta.stateHash;

    expect(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.preview-m4-route-transport-capacity",
        payload: { queryId: "m4.route.bad-campaign", campaignPlanId: 999 }
      })
    ).toMatchObject({
      status: "rejected",
      error: { code: "bad-id", path: "payload.campaignPlanId" }
    });

    const unreachable = previewRouteCapacity(runtime, "m4.route.unreachable");
    expect(unreachable.status).toBe("ok");
    if (
      unreachable.status !== "ok" ||
      unreachable.result.kind !== "sim.preview-m4-route-transport-capacity"
    ) {
      throw new Error("Expected M4 route transport forecast.");
    }
    expect(unreachable.result.sourceForecasts[0]).toMatchObject({
      status: "unreachable",
      routeSegments: [],
      bottleneckCapacity: 0,
      carriedSupplyLimit: 0,
      overloadedReasonCode: "route.capacity.unreachable"
    });
    expect(unreachable.result.reasonCodes).toEqual(["route.forecast.unreachable"]);
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
  });

  test("does not create march, battle, siege, or route state while forecasting", () => {
    const runtime = runtimeWithM4({});
    const beforeWorld = runtime.world;
    const beforeHash = hashWorldStateV0(beforeWorld);
    const preview = previewRouteCapacity(runtime, "m4.route.no-effects");

    expect(preview.status).toBe("ok");
    expect(runtime.world).toBe(beforeWorld);
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
    expect(runtime.acceptedCommandIds).toEqual([]);
    expect(runtime.commandTail).toEqual([]);
    expect(runtime.eventTail).toEqual([]);
    expect(runtime.world.state.m4?.campaignPlans[0]?.status).toBe("planned");
  });
});

function previewRouteCapacity(runtime: SimulationRuntimeV1, queryId: string) {
  return querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.preview-m4-route-transport-capacity",
    payload: { queryId, campaignPlanId: 10 }
  });
}

function runtimeWithM4(input: {
  readonly currentDay?: number;
  readonly campaignPlan?: M4CampaignStateV0["campaignPlans"][number];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
  readonly routes?: readonly M2RouteTransportEdgeStateV0[];
}): SimulationRuntimeV1 {
  return {
    world: worldWithM4(input),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function worldWithM4(input: {
  readonly currentDay?: number;
  readonly campaignPlan?: M4CampaignStateV0["campaignPlans"][number];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
  readonly routes?: readonly M2RouteTransportEdgeStateV0[];
}): WorldStateV0 {
  const defs = definitions(input.routes ?? defaultRoutes());
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-route-transport-capacity-test",
    currentDay: input.currentDay ?? 8,
    revision: 0,
    definitions: defs,
    m2: createM2EconomyPopulationStateV0(defs, {
      routes: input.routes ?? defaultRoutes(),
      districtSeasonality: [
        { districtId: 1, regionalCurveId: 1 },
        { districtId: 2, regionalCurveId: 1 },
        { districtId: 3, regionalCurveId: 1 },
        { districtId: 4, regionalCurveId: 1 }
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
    }),
    m3: createM3PolityVassalageStateV0(defs, {
      polities: [
        { polityId: parsePolityId(1), directSuzerainPolityId: null },
        { polityId: parsePolityId(2), directSuzerainPolityId: parsePolityId(1) }
      ],
      obligations: [troopObligation()],
      obligationAuditEvents: [troopObligationAuditEvent()]
    }),
    m4: createM4CampaignStateV0(defs, {
      campaignPlans: [input.campaignPlan ?? campaignPlan({})],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment()],
      grainSupplyReservations: input.reservations ?? [reservation(501, 1, 40)]
    })
  });
  const controlledWorld: WorldStateV0 = {
    ...world,
    state: {
      ...world.state,
      districts: world.state.districts.map((district) => ({
        ...district,
        control: { kind: "controlled", controllerPolityId: parsePolityId(1) }
      }))
    }
  };

  return {
    ...controlledWorld,
    meta: {
      ...controlledWorld.meta,
      stateHash: hashWorldStateV0(controlledWorld)
    }
  };
}

function definitions(routes: readonly M2RouteTransportEdgeStateV0[]): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.attacker" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.defender" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m4.commander" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.left" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.right" },
      { id: parseDistrictId(4), displayNameKey: "district.m4.target" }
    ],
    settlements: [],
    routes: routes.map((entry) => ({
      id: entry.routeId,
      fromDistrictId: entry.fromDistrictId,
      toDistrictId: entry.toDistrictId,
      lengthInMapUnits: entry.baseTravelCost
    }))
  };
}

function defaultRoutes(): readonly M2RouteTransportEdgeStateV0[] {
  return [
    route(10, 1, 2, 5, 80),
    route(11, 2, 4, 5, 30),
    route(12, 1, 3, 5, 80),
    route(13, 3, 4, 5, 30)
  ];
}

function route(
  routeId: number,
  fromDistrictId: number,
  toDistrictId: number,
  baseTravelCost: number,
  baseCapacity: number
): M2RouteTransportEdgeStateV0 {
  return {
    routeId: parseRouteId(routeId),
    fromDistrictId: parseDistrictId(fromDistrictId),
    toDistrictId: parseDistrictId(toDistrictId),
    routeKind: "road",
    baseTravelCost,
    baseCapacity
  };
}

function campaignPlan(input: {
  readonly earliestDay?: number;
  readonly latestDay?: number;
}): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(4) },
    objectiveKind: "march",
    startWindow: {
      earliestDay: parseGameDay(input.earliestDay ?? 10),
      latestDay: parseGameDay(input.latestDay ?? 20)
    },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: ["campaign.reason.route-capacity"],
    createdDay: parseGameDay(8),
    updatedDay: parseGameDay(8)
  };
}

function commitment(): M4CampaignStateV0["mobilizedForceCommitments"][number] {
  return {
    id: parseMobilizedForceCommitmentId(100),
    campaignPlanId: parseCampaignPlanId(10),
    source: {
      kind: "m3-obligation",
      obligationId: parseM3ObligationId(1),
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    promisedTroops: 60,
    dueDay: parseGameDay(20),
    assemblyWindow: { earliestDay: parseGameDay(10), latestDay: parseGameDay(18) },
    plannedAssemblyDay: parseGameDay(14),
    assembledTroops: 0,
    delayedTroops: 0,
    refusedTroops: 0,
    releasedTroops: 0,
    status: "promised",
    statusReasonCode: "muster.commitment.promised",
    reasonCodes: ["muster.reason.obligation-request"],
    localCostHooks: []
  };
}

function reservation(
  reservationId: number,
  districtId: number,
  carriedAmount: number
): M4CampaignStateV0["grainSupplyReservations"][number] {
  return {
    reservationId: parseGrainSupplyReservationId(reservationId),
    campaignPlanId: parseCampaignPlanId(10),
    source: {
      kind: "m2-population-group",
      populationGroupId: parsePopulationGroupId(districtId),
      districtId: parseDistrictId(districtId)
    },
    reservedAmount: carriedAmount,
    carriedAmount,
    consumedAmount: 0,
    shortageAmount: 0,
    lossAmount: 0,
    lossReasonCode: null,
    expectedDailyConsumption: 10,
    expectedDaysOfSupply: carriedAmount === 0 ? 0 : 4,
    status: carriedAmount === 0 ? "consumed" : "reserved",
    statusReasonCode: carriedAmount === 0 ? "grain.supply.consumed" : "grain.supply.reserved",
    reasonCodes: ["grain.supply.reserved"]
  };
}

function troopObligation(): NonNullable<WorldStateV0["state"]["m3"]>["obligations"][number] {
  return {
    id: parseM3ObligationId(1),
    debtorPolityId: parsePolityId(2),
    creditorPolityId: parsePolityId(1),
    obligationKind: "troop",
    obligationCategory: "troop-obligation",
    obligationSource: {
      kind: "vassalage",
      sourceId: "m4.route.vassalage.2-to-1",
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    requirement: { kind: "amount", resourceKind: "troops", amount: 120 },
    due: { kind: "cadence", periodDays: 20, nextDueDay: parseGameDay(20) },
    accounting: {
      nominalAmount: 120,
      dueAmount: 120,
      deliveredAmount: 0,
      arrearsAmount: 0,
      defaultedAmount: 0,
      remittedAmount: 0,
      dueDay: parseGameDay(20),
      cycle: 1,
      troopResponseState: "none"
    },
    status: "active",
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: parseM3ObligationAuditEventId(1),
    latestAuditEventId: parseM3ObligationAuditEventId(1)
  };
}

function troopObligationAuditEvent(): NonNullable<
  WorldStateV0["state"]["m3"]
>["obligationAuditEvents"][number] {
  return {
    id: parseM3ObligationAuditEventId(1),
    obligationId: parseM3ObligationId(1),
    eventKind: "created",
    eventDay: parseGameDay(0),
    eventRevision: parseWorldRevision(0),
    commandId: "m4.route.obligation.fixture",
    actor: { kind: "system", id: "fixture" },
    actionKind: null,
    dueDay: null,
    fulfillmentId: null,
    fulfilledAmount: null,
    statusAfter: "active",
    reasonCode: null,
    reasonCodes: ["obligation.created", "obligation.kind.troop-obligation"],
    reliabilityBps: 10_000
  };
}

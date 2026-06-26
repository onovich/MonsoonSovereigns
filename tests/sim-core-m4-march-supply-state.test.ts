import { describe, expect, test } from "vitest";

import {
  canonicalizeM2EconomyPopulationState,
  canonicalizeM4CampaignStateV0,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  parseCampaignMarchId,
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
  submitCommandV1,
  validateWorldStateV0,
  type M2RouteTransportEdgeStateV0,
  type M4CampaignStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type {
  GameCommandV1,
  RecordMusterResponseCommandV1,
  StartCampaignMarchCommandV1
} from "../packages/protocol/src/index";

describe("M4-MARCH-SUPPLY-STATE-001 deterministic march execution and supply state", () => {
  test("executes synchronized daily march arrival with predicted versus actual windows", () => {
    let runtime = runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] });
    runtime = accepted(runtime, startMarchCommand("m4.march.sync.start", "player", runtime, 701));
    runtime = accepted(runtime, advanceDayCommand("m4.march.sync.day-11", runtime));
    runtime = accepted(runtime, advanceDayCommand("m4.march.sync.day-12", runtime));

    const march = runtime.world.state.m4?.marches[0];
    expect(march).toMatchObject({
      marchId: parseCampaignMarchId(701),
      campaignPlanId: parseCampaignPlanId(10),
      status: "arrived",
      statusReasonCode: "march.arrived",
      currentDistrictId: parseDistrictId(3),
      activeTroops: 60,
      supply: {
        status: "well-supplied",
        carriedGrain: 180,
        consumedGrain: 120,
        shortageGrain: 0,
        delayedDays: 0
      },
      predictedArrivalWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(12) },
      actualArrivalDay: parseGameDay(12),
      joinedCommitmentIds: [parseMobilizedForceCommitmentId(100)]
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);

    const queried = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m4-march-state",
      payload: { queryId: "m4.march.sync.query", campaignPlanId: 10 }
    });
    expect(queried.status).toBe("ok");
    if (queried.status !== "ok" || queried.result.kind !== "sim.list-m4-march-state") {
      throw new Error("Expected M4 march state query.");
    }
    expect(queried.result.marches[0]).toMatchObject({
      marchId: 701,
      status: "arrived",
      predictedArrivalWindow: { earliestDay: 12, latestDay: 12 },
      actualArrivalDay: 12,
      reasonCodes: expect.arrayContaining(["march.arrived", "march.supply.well-supplied"])
    });
  });

  test("joins late reinforcements once without duplicating mobilized commitments", () => {
    let runtime = runtimeWithM4({
      commitments: [commitment(100, 40, "assembled", 40), commitment(101, 20, "delayed", 0, 20)]
    });
    runtime = accepted(runtime, startMarchCommand("m4.march.late.start", "player", runtime, 702));
    runtime = accepted(runtime, advanceDayCommand("m4.march.late.day-11", runtime));
    runtime = accepted(
      runtime,
      recordMusterResponseCommand("m4.march.late.assembled", "ai", runtime, 101, 20)
    );
    runtime = accepted(runtime, advanceDayCommand("m4.march.late.day-12", runtime));
    runtime = accepted(runtime, advanceDayCommand("m4.march.late.day-13", runtime));

    const march = runtime.world.state.m4?.marches[0];
    expect(march).toMatchObject({
      status: "arrived",
      activeTroops: 60,
      joinedCommitmentIds: [
        parseMobilizedForceCommitmentId(100),
        parseMobilizedForceCommitmentId(101)
      ],
      failedCommitmentIds: [],
      actualArrivalDay: parseGameDay(13)
    });
    expect(
      new Set(march?.joinedCommitmentIds.map((commitmentId) => Number(commitmentId))).size
    ).toBe(march?.joinedCommitmentIds.length);
    expect(march?.reasonCodes).toContain("march.reinforcement.late-arrival");
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("joins later assembled troops from a partially joined commitment exactly once", () => {
    let runtime = runtimeWithM4({
      commitments: [commitment(100, 60, "delayed", 40, 20)]
    });
    runtime = accepted(
      runtime,
      startMarchCommand("m4.march.partial-late.start", "player", runtime, 706)
    );
    runtime = accepted(runtime, advanceDayCommand("m4.march.partial-late.day-11", runtime));
    runtime = accepted(
      runtime,
      recordMusterResponseCommand("m4.march.partial-late.assembled", "ai", runtime, 100, 60)
    );
    runtime = accepted(runtime, advanceDayCommand("m4.march.partial-late.day-12", runtime));

    let march = runtime.world.state.m4?.marches[0];
    expect(march).toMatchObject({
      status: "delayed",
      statusReasonCode: "march.delayed.reinforcement-synchronization",
      activeTroops: 60,
      joinedCommitmentIds: [parseMobilizedForceCommitmentId(100)],
      joinedCommitmentTroops: [
        { commitmentId: parseMobilizedForceCommitmentId(100), joinedTroops: 60 }
      ]
    });

    runtime = accepted(runtime, advanceDayCommand("m4.march.partial-late.day-13", runtime));
    march = runtime.world.state.m4?.marches[0];
    expect(march).toMatchObject({
      status: "arrived",
      activeTroops: 60,
      joinedCommitmentIds: [parseMobilizedForceCommitmentId(100)],
      joinedCommitmentTroops: [
        { commitmentId: parseMobilizedForceCommitmentId(100), joinedTroops: 60 }
      ],
      actualArrivalDay: parseGameDay(13)
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("delays for supply shortage without negative carried grain or free resources", () => {
    let runtime = runtimeWithM4({
      commitments: [commitment(100, 60, "assembled", 60)],
      reservations: [reservation(501, 1, 30)]
    });
    const beforeTotal = totalM2AndM4Grain(runtime.world);
    runtime = accepted(
      runtime,
      startMarchCommand("m4.march.shortage.start", "player", runtime, 703)
    );
    runtime = accepted(runtime, advanceDayCommand("m4.march.shortage.day-11", runtime));

    const march = runtime.world.state.m4?.marches[0];
    expect(march).toMatchObject({
      status: "delayed",
      statusReasonCode: "march.delayed.supply-shortage",
      currentDistrictId: parseDistrictId(1),
      currentSegmentIndex: 0,
      progressOnSegmentDays: 0,
      supply: {
        status: "hungry",
        carriedGrain: 0,
        consumedGrain: 30,
        shortageGrain: 30,
        delayedDays: 1
      }
    });
    expect(march?.reasonCodes).toEqual(
      expect.arrayContaining(["march.delayed.supply-shortage", "march.supply.hungry"])
    );
    expect(totalM2AndM4Grain(runtime.world)).toBe(beforeTotal - 30);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("preserves accepted descending route order through canonicalization and execution", () => {
    let runtime = runtimeWithM4({
      routes: descendingRoutes(),
      campaignPlan: campaignPlan({ targetDistrictId: 1 }),
      commitments: [commitment(100, 60, "assembled", 60)],
      reservations: [reservation(501, 3, 300)]
    });
    runtime = accepted(
      runtime,
      startMarchCommand("m4.march.descending.start", "player", runtime, 707, 3)
    );

    const startedMarch = runtime.world.state.m4?.marches[0];
    expect(startedMarch?.routeSegments.map(routeEndpoints)).toEqual(["3->2", "2->1"]);
    const m4 = runtime.world.state.m4;
    if (m4 === undefined) {
      throw new Error("Expected M4 state.");
    }
    const canonical = canonicalizeM4CampaignStateV0(m4);
    expect(canonical.marches[0]?.routeSegments.map(routeEndpoints)).toEqual(["3->2", "2->1"]);

    runtime = accepted(runtime, advanceDayCommand("m4.march.descending.day-11", runtime));
    expect(runtime.world.state.m4?.marches[0]).toMatchObject({
      currentDistrictId: parseDistrictId(2),
      currentSegmentIndex: 1,
      status: "marching"
    });
    runtime = accepted(runtime, advanceDayCommand("m4.march.descending.day-12", runtime));
    expect(runtime.world.state.m4?.marches[0]).toMatchObject({
      currentDistrictId: parseDistrictId(1),
      status: "arrived",
      actualArrivalDay: parseGameDay(12)
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("pauses rainy-season march before consuming supply or advancing progress", () => {
    let runtime = runtimeWithM4({
      currentDay: 180,
      campaignPlan: campaignPlan({ earliestDay: 180, latestDay: 180 }),
      commitments: [commitment(100, 60, "assembled", 60)]
    });
    runtime = accepted(runtime, startMarchCommand("m4.march.rain.start", "player", runtime, 704));
    runtime = accepted(runtime, advanceDayCommand("m4.march.rain.day-181", runtime));

    const march = runtime.world.state.m4?.marches[0];
    expect(march).toMatchObject({
      status: "paused",
      statusReasonCode: "march.paused.rainy-season",
      currentDistrictId: parseDistrictId(1),
      progressOnSegmentDays: 0,
      supply: {
        status: "well-supplied",
        carriedGrain: 300,
        consumedGrain: 0,
        shortageGrain: 0
      }
    });
    expect(march?.reasonCodes).toContain("march.paused.rainy-season");
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("canonicalizes daily march ordering and rejects malformed duplicate joins", () => {
    const first = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [campaignPlan({})],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment(100, 60, "assembled", 60)],
      grainSupplyReservations: [reservation(501, 1, 300)],
      marches: [march(702), march(701)]
    });
    const second = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [campaignPlan({})],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment(100, 60, "assembled", 60)],
      grainSupplyReservations: [reservation(501, 1, 300)],
      marches: [march(701), march(702)]
    });
    expect(first).toEqual(second);

    const malformedWorld = {
      ...runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }).world,
      state: {
        ...runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }).world.state,
        m4: {
          schemaVersion: 1,
          campaignPlans: [campaignPlan({})],
          factionKnowledgeSnapshots: [],
          mobilizedForceCommitments: [commitment(100, 60, "assembled", 60)],
          grainSupplyReservations: [reservation(501, 1, 300)],
          marches: [
            {
              ...march(701),
              joinedCommitmentIds: [
                parseMobilizedForceCommitmentId(100),
                parseMobilizedForceCommitmentId(100)
              ],
              supply: { ...march(701).supply, carriedGrain: -1 }
            }
          ]
        }
      }
    };
    expect(validateWorldStateV0(malformedWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "state.m4.marches[0].joinedCommitmentIds" }),
        expect.objectContaining({ path: "state.m4.marches[0].supply.carriedGrain" })
      ])
    );
  });

  test("hash changes when authoritative march fields change", () => {
    let runtime = runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] });
    runtime = accepted(runtime, startMarchCommand("m4.march.hash.start", "player", runtime, 708));

    const baseHash = hashWorldStateV0(runtime.world);
    const marchState = firstMarch(runtime.world);
    expect(baseHash).not.toBe(
      hashWorldStateV0(
        worldWithMarchPatch(runtime.world, {
          progressOnSegmentDays: marchState.progressOnSegmentDays + 1
        })
      )
    );
    expect(baseHash).not.toBe(
      hashWorldStateV0(
        worldWithMarchPatch(runtime.world, {
          supply: { ...marchState.supply, carriedGrain: marchState.supply.carriedGrain - 1 }
        })
      )
    );
    expect(baseHash).not.toBe(
      hashWorldStateV0(
        worldWithMarchPatch(runtime.world, {
          actualArrivalDay: parseGameDay(runtime.world.meta.currentDay + 1)
        })
      )
    );
    expect(baseHash).not.toBe(
      hashWorldStateV0(
        worldWithMarchPatch(runtime.world, {
          joinedCommitmentTroops: [
            {
              commitmentId: parseMobilizedForceCommitmentId(100),
              joinedTroops: marchState.joinedCommitmentTroops[0]?.joinedTroops ?? 0
            },
            { commitmentId: parseMobilizedForceCommitmentId(101), joinedTroops: 1 }
          ]
        })
      )
    );
  });

  test("missing joinedCommitmentTroops returns structured validation error", () => {
    const marchWithoutJoinedTroops = removeJoinedCommitmentTroops(march(701));
    const malformedWorld = {
      ...runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }).world,
      state: {
        ...runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }).world.state,
        m4: {
          schemaVersion: 1,
          campaignPlans: [campaignPlan({})],
          factionKnowledgeSnapshots: [],
          mobilizedForceCommitments: [commitment(100, 60, "assembled", 60)],
          grainSupplyReservations: [reservation(501, 1, 300)],
          marches: [marchWithoutJoinedTroops]
        }
      }
    };

    expect(() => validateWorldStateV0(malformedWorld)).not.toThrow();
    expect(validateWorldStateV0(malformedWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-schema",
          path: "state.m4.marches[0].joinedCommitmentTroops"
        })
      ])
    );
  });

  test("player and AI start march through the same command path", () => {
    const player = accepted(
      runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }),
      startMarchCommand(
        "m4.march.parity.player",
        "player",
        runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }),
        705
      )
    );
    const ai = accepted(
      runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }),
      startMarchCommand(
        "m4.march.parity.ai",
        "ai",
        runtimeWithM4({ commitments: [commitment(100, 60, "assembled", 60)] }),
        705
      )
    );

    expect(player.world.meta.stateHash).toBe(ai.world.meta.stateHash);
  });
});

function runtimeWithM4(input: {
  readonly currentDay?: number;
  readonly routes?: readonly M2RouteTransportEdgeStateV0[];
  readonly campaignPlan?: M4CampaignStateV0["campaignPlans"][number];
  readonly commitments?: readonly M4CampaignStateV0["mobilizedForceCommitments"][number][];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
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
  readonly routes?: readonly M2RouteTransportEdgeStateV0[];
  readonly campaignPlan?: M4CampaignStateV0["campaignPlans"][number];
  readonly commitments?: readonly M4CampaignStateV0["mobilizedForceCommitments"][number][];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
}): WorldStateV0 {
  const routes = input.routes ?? defaultRoutes();
  const defs = definitions(routes);
  const baseM2 = createM2EconomyPopulationStateV0(defs, {
    routes,
    districtSeasonality: [
      { districtId: 1, regionalCurveId: 1 },
      { districtId: 2, regionalCurveId: 1 },
      { districtId: 3, regionalCurveId: 1 }
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
  const m2 = canonicalizeM2EconomyPopulationState({
    ...baseM2,
    populationGroups: [
      populationGroup(1, 1_000),
      populationGroup(2, 1_000),
      populationGroup(3, 1_000)
    ]
  });
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-march-supply-state-test",
    currentDay: input.currentDay ?? 10,
    revision: 0,
    definitions: defs,
    m2,
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
      mobilizedForceCommitments: input.commitments ?? [],
      grainSupplyReservations: input.reservations ?? [reservation(501, 1, 300)]
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
    meta: { ...controlledWorld.meta, stateHash: hashWorldStateV0(controlledWorld) }
  };
}

function definitions(
  routes: readonly M2RouteTransportEdgeStateV0[] = defaultRoutes()
): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.attacker" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.vassal" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m4.commander" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.midpoint" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.target" }
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
  return [route(10, 1, 2, 1, 120), route(11, 2, 3, 1, 120)];
}

function descendingRoutes(): readonly M2RouteTransportEdgeStateV0[] {
  return [route(30, 3, 2, 1, 120), route(31, 2, 1, 1, 120)];
}

function routeEndpoints(routeSegment: {
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
}): string {
  return `${routeSegment.fromDistrictId}->${routeSegment.toDistrictId}`;
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

function populationGroup(districtId: number, grainStock: number) {
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

function campaignPlan(input: {
  readonly earliestDay?: number;
  readonly latestDay?: number;
  readonly targetDistrictId?: number;
}): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(input.targetDistrictId ?? 3) },
    objectiveKind: "march",
    startWindow: {
      earliestDay: parseGameDay(input.earliestDay ?? 10),
      latestDay: parseGameDay(input.latestDay ?? 10)
    },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: ["campaign.reason.march"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function commitment(
  id: number,
  promisedTroops: number,
  status: "assembled" | "delayed",
  assembledTroops: number,
  delayedTroops = 0
): M4CampaignStateV0["mobilizedForceCommitments"][number] {
  return {
    id: parseMobilizedForceCommitmentId(id),
    campaignPlanId: parseCampaignPlanId(10),
    source: {
      kind: "m3-obligation",
      obligationId: parseM3ObligationId(1),
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    promisedTroops,
    dueDay: parseGameDay(20),
    assemblyWindow: { earliestDay: parseGameDay(10), latestDay: parseGameDay(18) },
    plannedAssemblyDay: parseGameDay(10),
    assembledTroops,
    delayedTroops,
    refusedTroops: 0,
    releasedTroops: 0,
    status,
    statusReasonCode: status === "assembled" ? "muster.response.assembled" : "muster.response.late",
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
    expectedDailyConsumption: 60,
    expectedDaysOfSupply: carriedAmount === 0 ? 0 : Math.floor(carriedAmount / 60),
    status: carriedAmount === 0 ? "consumed" : "reserved",
    statusReasonCode: carriedAmount === 0 ? "grain.supply.consumed" : "grain.supply.reserved",
    reasonCodes: ["grain.supply.reserved"]
  };
}

function march(marchId: number): M4CampaignStateV0["marches"][number] {
  return {
    marchId: parseCampaignMarchId(marchId),
    campaignPlanId: parseCampaignPlanId(10),
    originDistrictId: parseDistrictId(1),
    targetDistrictId: parseDistrictId(3),
    currentDistrictId: parseDistrictId(1),
    routeSegments: [
      {
        routeId: parseRouteId(10),
        fromDistrictId: parseDistrictId(1),
        toDistrictId: parseDistrictId(2),
        travelDays: 1,
        capacity: 120,
        seasonRiskReasonCodes: []
      },
      {
        routeId: parseRouteId(11),
        fromDistrictId: parseDistrictId(2),
        toDistrictId: parseDistrictId(3),
        travelDays: 1,
        capacity: 120,
        seasonRiskReasonCodes: []
      }
    ],
    currentSegmentIndex: 0,
    progressOnSegmentDays: 0,
    activeTroops: 60,
    grainPerTroopPerDay: 1,
    supply: {
      status: "well-supplied",
      carriedGrain: 300,
      consumedGrain: 0,
      shortageGrain: 0,
      delayedDays: 0
    },
    status: "marching",
    statusReasonCode: "march.started",
    reasonCodes: ["march.started"],
    startedDay: parseGameDay(10),
    updatedDay: parseGameDay(10),
    predictedArrivalWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(12) },
    actualArrivalDay: null,
    joinedCommitmentIds: [parseMobilizedForceCommitmentId(100)],
    joinedCommitmentTroops: [
      { commitmentId: parseMobilizedForceCommitmentId(100), joinedTroops: 60 }
    ],
    failedCommitmentIds: []
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
      sourceId: "m4.march.vassalage.2-to-1",
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
    commandId: "m4.march.obligation.fixture",
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

function startMarchCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  marchId: number,
  originDistrictId = 1
): StartCampaignMarchCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.start-campaign-march",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      marchId,
      campaignPlanId: 10,
      originDistrictId,
      plannedDepartureDay: runtime.world.meta.currentDay,
      grainPerTroopPerDay: 1,
      reasonCodes: ["march.reason.accepted-route-plan"]
    }
  };
}

function advanceDayCommand(commandId: string, runtime: SimulationRuntimeV1): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.advance-day",
    commandId,
    actor: { kind: "system", id: "daily-scheduler" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision
  };
}

function recordMusterResponseCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  commitmentId: number,
  assembledTroops: number
): RecordMusterResponseCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.record-muster-response",
    commandId,
    actor: { kind: actorKind, id: actorKind === "ai" ? "polity:2" : "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      commitmentId,
      assembledTroops,
      delayedTroops: 0,
      refusedTroops: 0,
      releasedTroops: 0,
      reasonCodes: ["muster.response.late-assembled"]
    }
  };
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  if (submitted.result.status !== "accepted") {
    throw new Error(JSON.stringify(submitted.result.error));
  }
  return submitted.runtime;
}

function firstMarch(world: WorldStateV0): M4CampaignStateV0["marches"][number] {
  const marchState = world.state.m4?.marches[0];
  if (marchState === undefined) {
    throw new Error("Expected M4 march state.");
  }
  return marchState;
}

function worldWithMarchPatch(
  world: WorldStateV0,
  patch: Partial<M4CampaignStateV0["marches"][number]>
): WorldStateV0 {
  const m4 = world.state.m4;
  if (m4 === undefined) {
    throw new Error("Expected M4 state.");
  }
  const marchState = firstMarch(world);
  return {
    ...world,
    state: {
      ...world.state,
      m4: {
        ...m4,
        marches: [{ ...marchState, ...patch }, ...m4.marches.slice(1)]
      }
    }
  };
}

function removeJoinedCommitmentTroops(
  marchState: M4CampaignStateV0["marches"][number]
): Record<string, unknown> {
  const candidate: Record<string, unknown> = { ...marchState };
  delete candidate["joinedCommitmentTroops"];
  return candidate;
}

function totalM2AndM4Grain(world: WorldStateV0): number {
  const m2Grain =
    world.state.m2?.populationGroups.reduce((sum, group) => sum + group.grainStock, 0) ?? 0;
  const m4Grain =
    world.state.m4?.grainSupplyReservations.reduce(
      (sum, reservation) => sum + reservation.carriedAmount,
      0
    ) ?? 0;
  const marchGrain =
    world.state.m4?.marches.reduce((sum, entry) => sum + entry.supply.carriedGrain, 0) ?? 0;
  return m2Grain + m4Grain + marchGrain;
}

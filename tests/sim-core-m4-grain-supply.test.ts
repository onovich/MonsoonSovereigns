import { describe, expect, test } from "vitest";

import {
  canonicalizeM2EconomyPopulationState,
  canonicalizeM4CampaignStateV0,
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
  submitCommandV1,
  validateWorldStateV0,
  type M2EconomyPopulationStateV0,
  type M4CampaignStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type {
  ConsumeCampaignGrainSupplyCommandV1,
  GameCommandV1,
  ReleaseCampaignGrainSupplyCommandV1,
  ReserveCampaignGrainSupplyCommandV1
} from "../packages/protocol/src/index";

describe("M4-GRAIN-SUPPLY-001 campaign grain supply reservations and forecast", () => {
  test("reserves, consumes, and releases grain without creating resources", () => {
    let runtime = runtimeWithM4();
    const beforeTotal = grainTotal(runtime.world);

    const reserved = submitCommandV1(
      runtime,
      reserveCommand("m4.grain.reserve", "player", runtime, 501, 120)
    );
    expect(reserved.result).toMatchObject({
      status: "accepted",
      events: [
        {
          kind: "sim.grain-supply-reserved",
          reservationId: parseGrainSupplyReservationId(501),
          campaignPlanId: parseCampaignPlanId(10),
          reservedAmount: 120,
          sourceCount: 2,
          expectedDailyConsumption: 10,
          expectedDaysOfSupply: 12
        }
      ],
      deltas: [
        {
          kind: "state.m2-population-group-updated",
          populationGroupId: parsePopulationGroupId(1),
          grainStock: 0
        },
        {
          kind: "state.m2-population-group-updated",
          populationGroupId: parsePopulationGroupId(2),
          grainStock: 30
        }
      ]
    });
    if (reserved.result.status !== "accepted") {
      throw new Error(JSON.stringify(reserved.result.error));
    }
    runtime = reserved.runtime;
    expect(runtime.world.state.m4?.grainSupplyReservations).toMatchObject([
      {
        reservationId: parseGrainSupplyReservationId(501),
        campaignPlanId: parseCampaignPlanId(10),
        source: {
          kind: "m2-population-group",
          populationGroupId: parsePopulationGroupId(1),
          districtId: parseDistrictId(1)
        },
        reservedAmount: 50,
        carriedAmount: 50,
        consumedAmount: 0,
        shortageAmount: 0,
        expectedDaysOfSupply: 5
      },
      {
        reservationId: parseGrainSupplyReservationId(501),
        source: {
          kind: "m2-population-group",
          populationGroupId: parsePopulationGroupId(2),
          districtId: parseDistrictId(2)
        },
        reservedAmount: 70,
        carriedAmount: 70
      }
    ]);
    expect(totalGrainInM2AndM4(runtime.world)).toBe(beforeTotal);

    const consumed = submitCommandV1(
      runtime,
      consumeCommand("m4.grain.consume", "player", runtime, 501, {
        consumedAmount: 90,
        lossAmount: 10,
        lossReasonCode: "grain.loss.spoilage",
        reasonCodes: ["grain.consume.march-forecast"]
      })
    );
    expect(consumed.result).toMatchObject({
      status: "accepted",
      events: [
        {
          kind: "sim.grain-supply-consumed",
          reservationId: parseGrainSupplyReservationId(501),
          campaignPlanId: parseCampaignPlanId(10),
          consumedAmount: 90,
          lossAmount: 10,
          shortageAmount: 0,
          carriedAmountAfter: 20,
          lossReasonCode: "grain.loss.spoilage"
        }
      ],
      deltas: []
    });
    if (consumed.result.status !== "accepted") {
      throw new Error(JSON.stringify(consumed.result.error));
    }
    runtime = consumed.runtime;
    expect(runtime.world.state.m4?.grainSupplyReservations).toMatchObject([
      {
        reservedAmount: 50,
        carriedAmount: 0,
        consumedAmount: 50,
        lossAmount: 0,
        status: "consumed"
      },
      {
        reservedAmount: 70,
        carriedAmount: 20,
        consumedAmount: 40,
        lossAmount: 10,
        lossReasonCode: "grain.loss.spoilage",
        status: "partially-consumed"
      }
    ]);
    expect(totalGrainInM2AndM4(runtime.world)).toBe(beforeTotal - 100);

    const released = submitCommandV1(
      runtime,
      releaseCommand("m4.grain.release", "player", runtime, 501)
    );
    expect(released.result).toMatchObject({
      status: "accepted",
      events: [
        {
          kind: "sim.grain-supply-released",
          reservationId: parseGrainSupplyReservationId(501),
          campaignPlanId: parseCampaignPlanId(10),
          releasedAmount: 20
        }
      ],
      deltas: [
        {
          kind: "state.m2-population-group-updated",
          populationGroupId: parsePopulationGroupId(2),
          grainStock: 50
        }
      ]
    });
    if (released.result.status !== "accepted") {
      throw new Error(JSON.stringify(released.result.error));
    }
    runtime = released.runtime;
    expect(
      runtime.world.state.m4?.grainSupplyReservations.map((entry) => entry.carriedAmount)
    ).toEqual([0, 0]);
    expect(totalGrainInM2AndM4(runtime.world)).toBe(beforeTotal - 100);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("allocates sources deterministically with stable district and population-group tie-breakers", () => {
    const first = accepted(
      runtimeWithM4(),
      reserveCommand("m4.grain.allocate.first", "player", runtimeWithM4(), 502, 120)
    );
    const shuffledWorld = worldWithM4({
      populationGroups: [populationGroup(2, 100), populationGroup(1, 50), populationGroup(3, 80)]
    });
    const secondRuntime = runtimeFromWorld(shuffledWorld);
    const second = accepted(
      secondRuntime,
      reserveCommand("m4.grain.allocate.second", "player", secondRuntime, 502, 120)
    );

    expect(first.world.state.m4?.grainSupplyReservations).toEqual(
      second.world.state.m4?.grainSupplyReservations
    );
    expect(hashWorldStateV0(first.world)).toBe(hashWorldStateV0(second.world));
  });

  test("accounts for loss-only consumption and marks exhausted carried grain terminal", () => {
    let runtime = runtimeWithM4();
    const beforeTotal = grainTotal(runtime.world);
    runtime = accepted(
      runtime,
      reserveCommand("m4.grain.loss-only.reserve", "player", runtime, 506, 60)
    );

    const consumed = submitCommandV1(
      runtime,
      consumeCommand("m4.grain.loss-only.consume", "player", runtime, 506, {
        consumedAmount: 0,
        lossAmount: 60,
        lossReasonCode: "grain.loss.spoilage",
        reasonCodes: ["grain.consume.spoilage-only"]
      })
    );
    expect(consumed.result).toMatchObject({
      status: "accepted",
      events: [
        {
          kind: "sim.grain-supply-consumed",
          reservationId: parseGrainSupplyReservationId(506),
          consumedAmount: 0,
          lossAmount: 60,
          shortageAmount: 0,
          carriedAmountAfter: 0,
          lossReasonCode: "grain.loss.spoilage"
        }
      ]
    });
    if (consumed.result.status !== "accepted") {
      throw new Error(JSON.stringify(consumed.result.error));
    }
    runtime = consumed.runtime;

    expect(runtime.world.state.m4?.grainSupplyReservations).toMatchObject([
      {
        reservedAmount: 50,
        carriedAmount: 0,
        consumedAmount: 0,
        lossAmount: 50,
        shortageAmount: 0,
        lossReasonCode: "grain.loss.spoilage",
        status: "consumed"
      },
      {
        reservedAmount: 10,
        carriedAmount: 0,
        consumedAmount: 0,
        lossAmount: 10,
        shortageAmount: 0,
        lossReasonCode: "grain.loss.spoilage",
        status: "consumed"
      }
    ]);
    expect(totalGrainInM2AndM4(runtime.world)).toBe(beforeTotal - 60);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("records unmet loss after normal consumption as shortage with stable reason ordering", () => {
    let runtime = runtimeWithM4();
    const beforeTotal = grainTotal(runtime.world);
    runtime = accepted(
      runtime,
      reserveCommand("m4.grain.loss-overflow.reserve", "player", runtime, 507, 60)
    );

    const consumed = submitCommandV1(
      runtime,
      consumeCommand("m4.grain.loss-overflow.consume", "player", runtime, 507, {
        consumedAmount: 50,
        lossAmount: 20,
        lossReasonCode: "grain.loss.spoilage",
        reasonCodes: ["grain.consume.loss-overflow"]
      })
    );
    expect(consumed.result).toMatchObject({
      status: "accepted",
      events: [
        {
          kind: "sim.grain-supply-consumed",
          reservationId: parseGrainSupplyReservationId(507),
          consumedAmount: 50,
          lossAmount: 10,
          shortageAmount: 10,
          carriedAmountAfter: 0,
          lossReasonCode: "grain.loss.spoilage"
        }
      ]
    });
    if (consumed.result.status !== "accepted") {
      throw new Error(JSON.stringify(consumed.result.error));
    }
    runtime = consumed.runtime;

    const reservations = runtime.world.state.m4?.grainSupplyReservations ?? [];
    expect(reservations[0]).toMatchObject({
      carriedAmount: 0,
      consumedAmount: 50,
      lossAmount: 0,
      shortageAmount: 0,
      status: "consumed"
    });
    expect(reservations[1]).toMatchObject({
      carriedAmount: 0,
      consumedAmount: 0,
      lossAmount: 10,
      shortageAmount: 10,
      lossReasonCode: "grain.loss.spoilage",
      status: "shortage",
      statusReasonCode: "grain.supply.shortage",
      reasonCodes: [
        "grain.consume.loss-overflow",
        "grain.loss.spoilage",
        "grain.reserve.planned-campaign",
        "grain.supply.reserved",
        "grain.supply.shortage"
      ]
    });
    const accounted = reservations.reduce(
      (sum, reservation) =>
        sum + reservation.consumedAmount + reservation.lossAmount + reservation.shortageAmount,
      0
    );
    expect(accounted).toBe(70);
    expect(totalGrainInM2AndM4(runtime.world)).toBe(beforeTotal - 60);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("forecast exposes planned muster grain needs, shortages, seasonal risk, and read-only records", () => {
    const runtime = runtimeFromWorld(
      worldWithM4({
        populationGroups: [populationGroup(1, 20), populationGroup(2, 10), populationGroup(3, 80)]
      })
    );
    const beforeHash = runtime.world.meta.stateHash;
    const preview = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.preview-m4-grain-supply",
      payload: {
        queryId: "m4.grain.preview",
        campaignPlanId: 10,
        plannedMarchDays: 5,
        grainPerTroopPerDay: 2
      }
    });
    expect(preview.status).toBe("ok");
    if (preview.status !== "ok" || preview.result.kind !== "sim.preview-m4-grain-supply") {
      throw new Error("Expected M4 grain supply preview.");
    }
    expect(preview.result).toMatchObject({
      plannedTroops: 60,
      grainRequired: 600,
      grainReserved: 0,
      grainAvailableToReserve: 30,
      expectedDaysOfSupply: 0
    });
    expect(preview.result.reasonCodes).toEqual([
      "grain.forecast.insufficient-reserved-grain",
      "grain.forecast.insufficient-controlled-stockpile",
      "grain.forecast.seasonal-risk"
    ]);
    const mutableReasons = preview.result.reasonCodes as string[];
    mutableReasons.push("mutated");
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
  });

  test("rejects wrong actor, duplicate reservation, duplicate consumption/release, shortage, and overflow boundaries", () => {
    let runtime = runtimeWithM4();
    expect(
      submitCommandV1(
        runtime,
        reserveCommand("m4.grain.reject.actor", "ai", runtime, 503, 10, "polity:2")
      ).result
    ).toMatchObject({ status: "rejected", error: { code: "authority-denied", path: "actor.id" } });

    runtime = accepted(
      runtime,
      reserveCommand("m4.grain.reject.reserve", "player", runtime, 503, 60)
    );
    expect(
      submitCommandV1(
        runtime,
        reserveCommand("m4.grain.reject.duplicate", "player", runtime, 503, 1)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "grain-supply-invalid", path: "payload.reservationId" }
    });
    expect(
      submitCommandV1(
        runtimeWithM4(),
        reserveCommand("m4.grain.reject.shortage", "player", runtimeWithM4(), 504, 999)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "grain-supply-invalid", path: "payload.requestedAmount" }
    });

    runtime = accepted(
      runtime,
      consumeCommand("m4.grain.reject.consume", "player", runtime, 503, {
        consumedAmount: 70,
        lossAmount: 0,
        lossReasonCode: null,
        reasonCodes: ["grain.consume.over-demand"]
      })
    );
    expect(runtime.world.state.m4?.grainSupplyReservations[1]).toMatchObject({
      shortageAmount: 10,
      status: "shortage",
      statusReasonCode: "grain.supply.shortage"
    });
    expect(
      submitCommandV1(
        runtime,
        releaseCommand("m4.grain.reject.release-empty", "player", runtime, 503)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "grain-supply-invalid", path: "payload.reservationId" }
    });
    expect(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.preview-m4-grain-supply",
        payload: {
          queryId: "m4.grain.overflow",
          campaignPlanId: 10,
          plannedMarchDays: Number.MAX_SAFE_INTEGER,
          grainPerTroopPerDay: Number.MAX_SAFE_INTEGER
        }
      })
    ).toMatchObject({
      status: "rejected",
      error: { code: "grain-supply-invalid", path: "payload.plannedMarchDays" }
    });
  });

  test("canonicalizes and validates grain supply records with invariant coverage", () => {
    const first = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [campaignPlan()],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment()],
      grainSupplyReservations: [reservation(502, 2), reservation(501, 1)]
    });
    const second = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [campaignPlan()],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment()],
      grainSupplyReservations: [reservation(501, 1), reservation(502, 2)]
    });
    expect(first).toEqual(second);

    const malformedShapeWorld = {
      ...worldWithM4({}),
      state: {
        ...worldWithM4({}).state,
        m4: {
          schemaVersion: 1,
          campaignPlans: [campaignPlan()],
          factionKnowledgeSnapshots: [],
          mobilizedForceCommitments: [commitment()],
          grainSupplyReservations: [
            {
              ...reservation(600, 1),
              status: "not-a-status"
            }
          ]
        }
      }
    };
    expect(validateWorldStateV0(malformedShapeWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "state.m4.grainSupplyReservations[0].status" })
      ])
    );

    const malformedQuantityWorld = {
      ...worldWithM4({}),
      state: {
        ...worldWithM4({}).state,
        m4: {
          schemaVersion: 1,
          campaignPlans: [campaignPlan()],
          factionKnowledgeSnapshots: [],
          mobilizedForceCommitments: [commitment()],
          grainSupplyReservations: [
            {
              ...reservation(600, 1),
              carriedAmount: 100,
              consumedAmount: 100,
              lossAmount: 1,
              lossReasonCode: null
            }
          ]
        }
      }
    };
    expect(validateWorldStateV0(malformedQuantityWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "state.m4.grainSupplyReservations[0].lossReasonCode" }),
        expect.objectContaining({ path: "state.m4.grainSupplyReservations[0]" })
      ])
    );

    const malformedDuplicateReservationWorld = {
      ...worldWithM4({}),
      state: {
        ...worldWithM4({}).state,
        m4: {
          schemaVersion: 1,
          campaignPlans: [campaignPlan(10), campaignPlan(11)],
          factionKnowledgeSnapshots: [],
          mobilizedForceCommitments: [commitment()],
          grainSupplyReservations: [
            reservation(610, 1),
            {
              ...reservation(610, 2),
              campaignPlanId: parseCampaignPlanId(11)
            }
          ]
        }
      }
    };
    expect(validateWorldStateV0(malformedDuplicateReservationWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "state.m4.grainSupplyReservations[1].reservationId",
          message: "M4 grain supply reservationId must belong to exactly one CampaignPlanId."
        })
      ])
    );
    expect(
      submitCommandV1(
        runtimeFromWorld(malformedDuplicateReservationWorld),
        consumeCommand("m4.grain.reject.cross-campaign-id", "player", runtimeWithM4(), 610, {
          consumedAmount: 1,
          lossAmount: 0,
          lossReasonCode: null,
          reasonCodes: ["grain.consume.malformed-id"]
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: {
        code: "grain-supply-invalid",
        path: "payload.reservationId",
        message: "GrainSupplyReservationId spans multiple campaign plans."
      }
    });
  });
});

function definitions(): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.attacker" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.vassal" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m4.commander" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.capital" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.forward" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.enemy" }
    ],
    settlements: [],
    routes: [
      {
        id: parseRouteId(1),
        fromDistrictId: parseDistrictId(1),
        toDistrictId: parseDistrictId(2),
        lengthInMapUnits: 10
      }
    ]
  };
}

function runtimeWithM4(): SimulationRuntimeV1 {
  return runtimeFromWorld(worldWithM4({}));
}

function runtimeFromWorld(world: WorldStateV0): SimulationRuntimeV1 {
  return {
    world,
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function worldWithM4(input: {
  readonly populationGroups?: readonly M2EconomyPopulationStateV0["populationGroups"][number][];
}): WorldStateV0 {
  const defs = definitions();
  const baseM2 = createM2EconomyPopulationStateV0(defs, {
    routes: [
      {
        routeId: 1,
        fromDistrictId: 1,
        toDistrictId: 2,
        routeKind: "road",
        baseTravelCost: 10,
        baseCapacity: 100
      }
    ],
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
          monsoonIntensityBps: index + 1 === 1 ? 8_000 : 0,
          agricultureWorkBps: 5_000,
          riverNavigabilityBps: 8_000,
          roadTravelCostBps: 10_000
        }))
      }
    ]
  });
  const m2 = canonicalizeM2EconomyPopulationState({
    ...baseM2,
    populationGroups: input.populationGroups ?? [
      populationGroup(1, 50),
      populationGroup(2, 100),
      populationGroup(3, 80)
    ]
  });

  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-grain-supply-test",
    currentDay: 10,
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
      campaignPlans: [campaignPlan()],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment()],
      grainSupplyReservations: []
    })
  });
  const controlledWorld: WorldStateV0 = {
    ...world,
    state: {
      ...world.state,
      districts: world.state.districts.map((district) =>
        district.definitionId === parseDistrictId(1) || district.definitionId === parseDistrictId(2)
          ? {
              ...district,
              control: { kind: "controlled", controllerPolityId: parsePolityId(1) }
            }
          : {
              ...district,
              control: { kind: "controlled", controllerPolityId: parsePolityId(2) }
            }
      )
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

function populationGroup(
  districtId: number,
  grainStock: number
): M2EconomyPopulationStateV0["populationGroups"][number] {
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

function campaignPlan(id = 10): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(id),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(2) },
    objectiveKind: "march",
    startWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(30) },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: ["campaign.reason.dry-season-range"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
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
    assemblyWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(18) },
    plannedAssemblyDay: parseGameDay(15),
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
  districtId: number
): M4CampaignStateV0["grainSupplyReservations"][number] {
  return {
    reservationId: parseGrainSupplyReservationId(reservationId),
    campaignPlanId: parseCampaignPlanId(10),
    source: {
      kind: "m2-population-group",
      populationGroupId: parsePopulationGroupId(districtId),
      districtId: parseDistrictId(districtId)
    },
    reservedAmount: 50,
    carriedAmount: 50,
    consumedAmount: 0,
    shortageAmount: 0,
    lossAmount: 0,
    lossReasonCode: null,
    expectedDailyConsumption: 10,
    expectedDaysOfSupply: 5,
    status: "reserved",
    statusReasonCode: "grain.supply.reserved",
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
      sourceId: "m4.grain.vassalage.2-to-1",
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
    commandId: "m4.grain.obligation.fixture",
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

function reserveCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  reservationId: number,
  requestedAmount: number,
  actorId = "polity:1"
): ReserveCampaignGrainSupplyCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.reserve-campaign-grain-supply",
    commandId,
    actor: { kind: actorKind, id: actorId },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      reservationId,
      campaignPlanId: 10,
      requestedAmount,
      expectedDailyConsumption: 10,
      reasonCodes: ["grain.reserve.planned-campaign"]
    }
  };
}

function consumeCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  reservationId: number,
  payload: {
    readonly consumedAmount: number;
    readonly lossAmount: number;
    readonly lossReasonCode: string | null;
    readonly reasonCodes: readonly string[];
  }
): ConsumeCampaignGrainSupplyCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.consume-campaign-grain-supply",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: { reservationId, ...payload }
  };
}

function releaseCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  reservationId: number
): ReleaseCampaignGrainSupplyCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.release-campaign-grain-supply",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: { reservationId, reasonCode: "grain.release.cancelled-plan" }
  };
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const result = submitCommandV1(runtime, command);
  if (result.result.status !== "accepted") {
    throw new Error(JSON.stringify(result.result.error));
  }
  return result.runtime;
}

function grainTotal(world: WorldStateV0): number {
  return world.state.m2?.populationGroups.reduce((sum, group) => sum + group.grainStock, 0) ?? 0;
}

function totalGrainInM2AndM4(world: WorldStateV0): number {
  const m2Grain = grainTotal(world);
  const m4Carried =
    world.state.m4?.grainSupplyReservations.reduce(
      (sum, reservation) => sum + reservation.carriedAmount,
      0
    ) ?? 0;
  return m2Grain + m4Carried;
}

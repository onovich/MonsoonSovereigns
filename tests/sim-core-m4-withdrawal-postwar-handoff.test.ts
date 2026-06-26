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
  parseSiegeId,
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

type WithdrawalKind =
  | "orderly-withdrawal"
  | "forced-retreat"
  | "cancelled-before-departure"
  | "failed-extraction";

type WithdrawalTrigger = "ordered" | "supply" | "season" | "siege" | "loss" | "objective-complete";

interface M4WithdrawalRecord {
  readonly withdrawalId: number;
  readonly campaignPlanId: number;
  readonly marchId: number | null;
  readonly siegeId: number | null;
  readonly kind: WithdrawalKind;
  readonly triggerReason: WithdrawalTrigger;
  readonly troopsBefore: number;
  readonly troopsExtracted: number;
  readonly casualties: number;
  readonly supplyLoss: number;
  readonly reasonCodes: readonly string[];
}

interface M4PostwarCandidateDto {
  readonly candidateId: string;
  readonly sourceWarOutcomeId: number;
  readonly settlementId: string;
  readonly victorPolityId: number;
  readonly localPolityId: number;
  readonly districtId: number;
  readonly validM3Methods: readonly ("direct-control" | "restore-vassal-ruler" | "tribute-only")[];
  readonly reasonCodes: readonly string[];
}

interface M4WarOutcomeDto {
  readonly outcomeId: number;
  readonly campaignPlanId: number;
  readonly victorPolityId: number;
  readonly localPolityId: number;
  readonly targetDistrictId: number;
  readonly attackerCasualties: number;
  readonly defenderCasualties: number;
  readonly supplyLoss: number;
  readonly postwarCandidate: M4PostwarCandidateDto | null;
  readonly reasonCodes: readonly string[];
}

interface M4WithdrawalQueryResult {
  readonly kind: "sim.list-m4-withdrawal-state";
  readonly withdrawals: readonly M4WithdrawalRecord[];
}

interface M4WarOutcomeQueryResult {
  readonly kind: "sim.list-m4-war-outcomes";
  readonly outcomes: readonly M4WarOutcomeDto[];
  readonly postwarCandidates: readonly M4PostwarCandidateDto[];
}

describe("M4-WITHDRAWAL-POSTWAR-HANDOFF-001 withdrawal and postwar handoff", () => {
  test("records planned orderly withdrawal with force and supply conservation", () => {
    let runtime = runtimeWithM4({
      commitments: [commitment(100, 60, "assembled", 60)],
      reservations: [reservation(501, 1, 300)]
    });
    runtime = accepted(runtime, startMarchCommand("m4.withdraw.ordered.start", runtime, 701));
    const grainBefore = totalM2AndM4Grain(runtime.world);

    runtime = accepted(
      runtime,
      withdrawalCommand("m4.withdraw.ordered", runtime, {
        withdrawalId: 901,
        triggerReason: "ordered",
        marchId: 701,
        reasonCodes: ["withdrawal.reason.player-ordered"]
      })
    );

    const withdrawal = firstWithdrawal(runtime);
    expect(withdrawal).toMatchObject({
      withdrawalId: 901,
      kind: "orderly-withdrawal",
      triggerReason: "ordered",
      troopsBefore: 60,
      troopsExtracted: 60,
      casualties: 0,
      supplyLoss: 0,
      reasonCodes: expect.arrayContaining(["withdrawal.reason.player-ordered"])
    });
    expect(firstCampaign(runtime.world)).toMatchObject({
      status: "cancelled",
      objectiveKind: "withdraw",
      statusReasonCode: "campaign.objective.withdrawn"
    });
    expect(firstMarch(runtime.world)).toMatchObject({
      status: "cancelled",
      activeTroops: 60,
      statusReasonCode: "withdrawal.orderly"
    });
    expect(totalM2AndM4Grain(runtime.world)).toBe(grainBefore);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("cancels before departure when rainy-season route risk closes the window", () => {
    const runtime = accepted(
      runtimeWithM4({
        currentDay: 180,
        campaignPlan: campaignPlan({ earliestDay: 180, latestDay: 180 }),
        commitments: [commitment(100, 60, "assembled", 60)],
        reservations: [reservation(501, 1, 300)]
      }),
      withdrawalCommand("m4.withdraw.season.cancel", runtimeWithM4({ currentDay: 180 }), {
        withdrawalId: 902,
        triggerReason: "season",
        marchId: null,
        reasonCodes: ["withdrawal.reason.rainy-season"]
      })
    );

    expect(firstWithdrawal(runtime)).toMatchObject({
      kind: "cancelled-before-departure",
      triggerReason: "season",
      marchId: null,
      troopsBefore: 60,
      troopsExtracted: 60,
      casualties: 0
    });
    expect(runtime.world.state.m4?.grainSupplyReservations[0]).toMatchObject({
      status: "released",
      carriedAmount: 0,
      statusReasonCode: "withdrawal.cancelled-before-departure"
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("records supply-forced retreat with losses and auditable reputation cost", () => {
    const runtime = accepted(
      runtimeWithM4({
        campaignPlan: activeCampaignPlan(),
        commitments: [commitment(100, 80, "assembled", 80)],
        marches: [
          arrivedMarch({ activeTroops: 80, carriedGrain: 0, supplyStatus: "out-of-supply" })
        ]
      }),
      withdrawalCommand("m4.withdraw.supply.retreat", runtimeWithM4({}), {
        withdrawalId: 903,
        triggerReason: "supply",
        marchId: 701,
        reasonCodes: ["withdrawal.reason.supply-collapse"]
      })
    );

    const withdrawal = firstWithdrawal(runtime);
    expect(withdrawal).toMatchObject({
      kind: "forced-retreat",
      triggerReason: "supply",
      troopsBefore: 80,
      troopsExtracted: 59,
      casualties: 21
    });
    expect(firstMarch(runtime.world).activeTroops).toBe(59);
    expect(withdrawal.reasonCodes).toContain("withdrawal.cost.human-losses");
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("records siege-lift withdrawal without adding tactical pursuit or naval evacuation", () => {
    const runtime = accepted(
      runtimeWithM4({
        campaignPlan: activeCampaignPlan(),
        commitments: [commitment(100, 80, "assembled", 80)],
        marches: [arrivedMarch({ activeTroops: 80, carriedGrain: 120 })],
        sieges: [siege(801, "lifted")]
      }),
      withdrawalCommand("m4.withdraw.siege.lift", runtimeWithM4({}), {
        withdrawalId: 904,
        triggerReason: "siege",
        marchId: 701,
        siegeId: 801,
        reasonCodes: ["withdrawal.reason.siege-lifted"]
      })
    );

    expect(firstWithdrawal(runtime)).toMatchObject({
      kind: "orderly-withdrawal",
      triggerReason: "siege",
      siegeId: 801,
      troopsBefore: 80,
      troopsExtracted: 80,
      casualties: 0
    });
    expect(firstCampaign(runtime.world).statusReasonCode).toBe("campaign.objective.withdrawn");
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("creates one WarOutcome/PostwarCandidate DTO that M3 governance preview can consume", () => {
    let runtime = runtimeWithM4({
      campaignPlan: completedCampaignPlan(),
      commitments: [commitment(100, 80, "assembled", 80)],
      marches: [arrivedMarch({ activeTroops: 72, carriedGrain: 120 })],
      sieges: [siege(801, "surrendered")]
    });
    runtime = accepted(
      runtime,
      withdrawalCommand("m4.postwar.outcome", runtime, {
        withdrawalId: 905,
        triggerReason: "objective-complete",
        marchId: 701,
        siegeId: 801,
        reasonCodes: ["withdrawal.reason.objective-complete"]
      })
    );

    const outcomes = warOutcomeQuery(runtime);
    expect(outcomes.outcomes).toHaveLength(1);
    expect(outcomes.postwarCandidates).toHaveLength(1);
    const candidate = outcomes.postwarCandidates[0];
    if (candidate === undefined) {
      throw new Error("Expected M4 postwar candidate.");
    }
    expect(candidate).toMatchObject({
      settlementId: "m4.campaign.10.outcome.1",
      victorPolityId: 1,
      localPolityId: 2,
      districtId: 3,
      validM3Methods: ["direct-control", "restore-vassal-ruler", "tribute-only"]
    });

    const preview = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.preview-m3-postwar-governance",
      payload: {
        queryId: "m4.postwar.preview",
        victorPolityId: candidate.victorPolityId,
        localPolityId: candidate.localPolityId,
        districtId: candidate.districtId,
        methods: candidate.validM3Methods,
        months: 24
      }
    });
    expect(preview.status).toBe("ok");

    const duplicate = submitCommandV1(
      runtime,
      withdrawalCommand("m4.postwar.outcome.duplicate", runtime, {
        withdrawalId: 906,
        triggerReason: "objective-complete",
        marchId: 701,
        siegeId: 801,
        reasonCodes: ["withdrawal.reason.objective-complete"]
      })
    );
    expect(duplicate.result.status).toBe("rejected");
  });

  test("canonicalizes withdrawal ordering and hashes authoritative withdrawal fields", () => {
    const m4 = canonicalizeM4CampaignStateV0({
      ...createM4CampaignStateV0(definitions(), {
        campaignPlans: [campaignPlan({})],
        withdrawals: [withdrawalFixture(902, 10), withdrawalFixture(901, 10)]
      } as M4CampaignStateV0Input)
    } as M4CampaignStateV0);
    const withWithdrawals = m4 as M4CampaignStateWithWithdrawal;
    expect(withWithdrawals.withdrawals.map((entry) => entry.withdrawalId)).toEqual([901, 902]);

    const world = runtimeWithM4({
      campaignPlan: activeCampaignPlan(),
      marches: [arrivedMarch({ activeTroops: 80, carriedGrain: 100 })],
      withdrawals: [withdrawalFixture(901, 10)]
    }).world;
    const baseHash = hashWorldStateV0(world);
    const patched = {
      ...world,
      state: {
        ...world.state,
        m4: {
          ...world.state.m4,
          withdrawals: [withdrawalFixture(901, 11)]
        }
      }
    } as WorldStateV0;
    expect(hashWorldStateV0(patched)).not.toBe(baseHash);
  });
});

interface M4CampaignStateWithWithdrawal extends M4CampaignStateV0 {
  readonly withdrawals: readonly M4WithdrawalRecord[];
  readonly warOutcomes: readonly M4WarOutcomeDto[];
  readonly postwarCandidates: readonly M4PostwarCandidateDto[];
}

type M4CampaignStateV0Input = Partial<M4CampaignStateWithWithdrawal>;

function runtimeWithM4(input: {
  readonly currentDay?: number;
  readonly campaignPlan?: M4CampaignStateV0["campaignPlans"][number];
  readonly commitments?: readonly M4CampaignStateV0["mobilizedForceCommitments"][number][];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
  readonly marches?: readonly M4CampaignStateV0["marches"][number][];
  readonly sieges?: readonly M4CampaignStateV0["sieges"][number][];
  readonly withdrawals?: readonly M4WithdrawalRecord[];
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
  readonly commitments?: readonly M4CampaignStateV0["mobilizedForceCommitments"][number][];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
  readonly marches?: readonly M4CampaignStateV0["marches"][number][];
  readonly sieges?: readonly M4CampaignStateV0["sieges"][number][];
  readonly withdrawals?: readonly M4WithdrawalRecord[];
}): WorldStateV0 {
  const defs = definitions();
  const baseM2 = createM2EconomyPopulationStateV0(defs, {
    routes: defaultRoutes(),
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
    contentManifestHash: "m4-withdrawal-postwar-handoff-test",
    currentDay: input.currentDay ?? 20,
    revision: 0,
    definitions: defs,
    m2,
    m3: createM3PolityVassalageStateV0(defs, {
      polities: [
        { polityId: parsePolityId(1), directSuzerainPolityId: null },
        { polityId: parsePolityId(2), directSuzerainPolityId: null }
      ],
      obligations: [troopObligation()],
      obligationAuditEvents: [troopObligationAuditEvent()],
      characters: [
        {
          characterId: parsePersonId(1),
          polityId: parsePolityId(2),
          alive: true,
          incapacitated: false,
          currentDistrictId: parseDistrictId(3),
          commandBps: 6_500,
          administrationBps: 7_000,
          diplomacyBps: 7_500
        }
      ],
      policies: [
        {
          policyId: 201,
          target: { kind: "district", districtId: parseDistrictId(3) },
          stance: "balanced",
          intensityBps: 5_000
        }
      ],
      administrativeDistricts: [
        {
          polityId: parsePolityId(1),
          districtId: parseDistrictId(1),
          controlMode: "direct",
          localComplexity: 80,
          communicationCost: 40,
          directness: 80,
          frontierPressure: 40,
          administrativeCapacity: 1_000
        },
        {
          polityId: parsePolityId(2),
          districtId: parseDistrictId(3),
          controlMode: "direct",
          localComplexity: 210,
          communicationCost: 110,
          directness: 180,
          frontierPressure: 160,
          administrativeCapacity: 850
        }
      ]
    }),
    m4: createM4CampaignStateV0(defs, {
      campaignPlans: [input.campaignPlan ?? campaignPlan({})],
      mobilizedForceCommitments: input.commitments ?? [],
      grainSupplyReservations: input.reservations ?? [reservation(501, 1, 300)],
      marches: input.marches ?? [],
      sieges: input.sieges ?? [],
      withdrawals: input.withdrawals ?? []
    } as M4CampaignStateV0Input)
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

function definitions(): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.attacker" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.local" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m4.local-ruler" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.midpoint" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.target" }
    ],
    settlements: [],
    routes: defaultRoutes().map((entry) => ({
      id: entry.routeId,
      fromDistrictId: entry.fromDistrictId,
      toDistrictId: entry.toDistrictId,
      lengthInMapUnits: entry.baseTravelCost
    }))
  };
}

function defaultRoutes(): readonly M2RouteTransportEdgeStateV0[] {
  return [
    {
      routeId: parseRouteId(10),
      fromDistrictId: parseDistrictId(1),
      toDistrictId: parseDistrictId(2),
      routeKind: "road",
      baseTravelCost: 1,
      baseCapacity: 120
    },
    {
      routeId: parseRouteId(11),
      fromDistrictId: parseDistrictId(2),
      toDistrictId: parseDistrictId(3),
      routeKind: "road",
      baseTravelCost: 1,
      baseCapacity: 120
    }
  ];
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
}): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(3) },
    objectiveKind: "march",
    startWindow: {
      earliestDay: parseGameDay(input.earliestDay ?? 20),
      latestDay: parseGameDay(input.latestDay ?? 20)
    },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: ["campaign.reason.withdrawal-test"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function activeCampaignPlan(): M4CampaignStateV0["campaignPlans"][number] {
  return { ...campaignPlan({}), objectiveKind: "besiege", status: "active" };
}

function completedCampaignPlan(): M4CampaignStateV0["campaignPlans"][number] {
  return {
    ...activeCampaignPlan(),
    status: "completed",
    statusReasonCode: "campaign.objective.siege-surrendered"
  };
}

function commitment(
  id: number,
  promisedTroops: number,
  status: "assembled" | "delayed",
  assembledTroops: number
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
    dueDay: parseGameDay(30),
    assemblyWindow: { earliestDay: parseGameDay(20), latestDay: parseGameDay(25) },
    plannedAssemblyDay: parseGameDay(20),
    assembledTroops,
    delayedTroops: status === "delayed" ? promisedTroops - assembledTroops : 0,
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
    expectedDaysOfSupply: Math.floor(carriedAmount / 60),
    status: "reserved",
    statusReasonCode: "grain.supply.reserved",
    reasonCodes: ["grain.supply.reserved"]
  };
}

function arrivedMarch(input: {
  readonly activeTroops: number;
  readonly carriedGrain: number;
  readonly supplyStatus?: "well-supplied" | "out-of-supply";
}): M4CampaignStateV0["marches"][number] {
  return {
    marchId: parseCampaignMarchId(701),
    campaignPlanId: parseCampaignPlanId(10),
    originDistrictId: parseDistrictId(1),
    targetDistrictId: parseDistrictId(3),
    currentDistrictId: parseDistrictId(3),
    routeSegments: [],
    currentSegmentIndex: 0,
    progressOnSegmentDays: 0,
    activeTroops: input.activeTroops,
    grainPerTroopPerDay: 1,
    supply: {
      status: input.supplyStatus ?? "well-supplied",
      carriedGrain: input.carriedGrain,
      consumedGrain: 0,
      shortageGrain: input.supplyStatus === "out-of-supply" ? input.activeTroops : 0,
      delayedDays: input.supplyStatus === "out-of-supply" ? 1 : 0
    },
    status: "arrived",
    statusReasonCode: "march.arrived",
    reasonCodes: ["march.arrived"],
    startedDay: parseGameDay(20),
    updatedDay: parseGameDay(20),
    predictedArrivalWindow: { earliestDay: parseGameDay(20), latestDay: parseGameDay(20) },
    actualArrivalDay: parseGameDay(20),
    joinedCommitmentIds: [parseMobilizedForceCommitmentId(100)],
    joinedCommitmentTroops: [
      { commitmentId: parseMobilizedForceCommitmentId(100), joinedTroops: input.activeTroops }
    ],
    failedCommitmentIds: []
  };
}

function siege(siegeId: number, status: "lifted" | "surrendered") {
  return {
    siegeId: parseSiegeId(siegeId),
    campaignPlanId: parseCampaignPlanId(10),
    marchId: parseCampaignMarchId(701),
    targetDistrictId: parseDistrictId(3),
    attackerPolityId: parsePolityId(1),
    defenderPolityId: parsePolityId(2),
    status,
    statusReasonCode: status === "lifted" ? "siege.lifted" : "siege.surrender.accepted",
    fortification: 400,
    defenderEstimatedTroops: status === "surrendered" ? 0 : 20,
    defenderSupply: 0,
    siegeProgress: 400,
    daysInvested: 2,
    blockadeDays: 1,
    assaultCount: 1,
    attackerTroops: 72,
    attackerCasualties: 8,
    defenderCasualties: 20,
    supplyLoss: 80,
    surrenderEligible: status === "surrendered",
    surrenderReasonCodes: status === "surrendered" ? ["siege.surrender.assault-breach"] : [],
    reasonCodes: [status === "lifted" ? "siege.lifted" : "siege.surrender.accepted"],
    creditHooks: [
      { polityId: parsePolityId(1), amount: 21, reasonCode: "campaign.credit.siege-success" }
    ],
    reputationHooks: [
      { polityId: parsePolityId(1), amount: 8, reasonCode: "campaign.reputation.costly-victory" }
    ],
    startedDay: parseGameDay(20),
    updatedDay: parseGameDay(20)
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
      sourceId: "m4.withdrawal.vassalage.2-to-1",
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    requirement: { kind: "amount", resourceKind: "troops", amount: 120 },
    due: { kind: "cadence", periodDays: 30, nextDueDay: parseGameDay(30) },
    accounting: {
      nominalAmount: 120,
      dueAmount: 120,
      deliveredAmount: 0,
      arrearsAmount: 0,
      defaultedAmount: 0,
      remittedAmount: 0,
      dueDay: parseGameDay(30),
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
    commandId: "m4.withdrawal.obligation.fixture",
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

function startMarchCommand(commandId: string, runtime: SimulationRuntimeV1, marchId: number) {
  return {
    schemaVersion: 1,
    kind: "sim.start-campaign-march",
    commandId,
    actor: { kind: "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      marchId,
      campaignPlanId: 10,
      originDistrictId: 1,
      plannedDepartureDay: runtime.world.meta.currentDay,
      grainPerTroopPerDay: 1,
      reasonCodes: ["march.reason.accepted-route-plan"]
    }
  };
}

function withdrawalCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  input: {
    readonly withdrawalId: number;
    readonly triggerReason: WithdrawalTrigger;
    readonly marchId: number | null;
    readonly siegeId?: number;
    readonly reasonCodes: readonly string[];
  }
) {
  return {
    schemaVersion: 1,
    kind: "sim.resolve-m4-campaign-withdrawal",
    commandId,
    actor: { kind: "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      withdrawalId: input.withdrawalId,
      campaignPlanId: 10,
      marchId: input.marchId,
      siegeId: input.siegeId ?? null,
      triggerReason: input.triggerReason,
      reasonCodes: input.reasonCodes
    }
  };
}

function accepted(runtime: SimulationRuntimeV1, command: unknown): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  if (submitted.result.status !== "accepted") {
    throw new Error(JSON.stringify(submitted.result.error));
  }
  return submitted.runtime;
}

function firstCampaign(world: WorldStateV0): M4CampaignStateV0["campaignPlans"][number] {
  const campaignState = world.state.m4?.campaignPlans[0];
  if (campaignState === undefined) {
    throw new Error("Expected M4 campaign plan.");
  }
  return campaignState;
}

function firstMarch(world: WorldStateV0): M4CampaignStateV0["marches"][number] {
  const marchState = world.state.m4?.marches[0];
  if (marchState === undefined) {
    throw new Error("Expected M4 march.");
  }
  return marchState;
}

function firstWithdrawal(runtime: SimulationRuntimeV1): M4WithdrawalRecord {
  const queried = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m4-withdrawal-state",
    payload: { queryId: "m4.withdrawal.query", campaignPlanId: 10 }
  });
  expect(queried.status).toBe("ok");
  if (queried.status !== "ok") {
    throw new Error("Expected M4 withdrawal query.");
  }
  const result = queried.result as M4WithdrawalQueryResult;
  const withdrawal = result.withdrawals[0];
  if (withdrawal === undefined) {
    throw new Error("Expected withdrawal record.");
  }
  return withdrawal;
}

function warOutcomeQuery(runtime: SimulationRuntimeV1): M4WarOutcomeQueryResult {
  const queried = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m4-war-outcomes",
    payload: { queryId: "m4.outcomes.query", campaignPlanId: 10 }
  });
  expect(queried.status).toBe("ok");
  if (queried.status !== "ok") {
    throw new Error("Expected M4 war outcome query.");
  }
  return queried.result as M4WarOutcomeQueryResult;
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
    world.state.m4?.marches.reduce((sum, march) => sum + march.supply.carriedGrain, 0) ?? 0;
  return m2Grain + m4Grain + marchGrain;
}

function withdrawalFixture(withdrawalId: number, campaignPlanId: number): M4WithdrawalRecord {
  return {
    withdrawalId,
    campaignPlanId,
    marchId: 701,
    siegeId: null,
    kind: "orderly-withdrawal",
    triggerReason: "ordered",
    troopsBefore: 60,
    troopsExtracted: 60,
    casualties: 0,
    supplyLoss: 0,
    creditHooks: [],
    reputationHooks: [],
    reasonCodes: ["withdrawal.reason.fixture"],
    resolvedDay: parseGameDay(20)
  };
}

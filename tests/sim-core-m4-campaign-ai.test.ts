import { describe, expect, test } from "vitest";

import {
  canonicalizeM2EconomyPopulationState,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  parseCampaignMarchId,
  parseCampaignPlanId,
  parseDistrictId,
  parseFactionKnowledgeSnapshotId,
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
  planM4CampaignAiTurnV1,
  submitCommandV1,
  validateWorldStateV0,
  type M2RouteTransportEdgeStateV0,
  type M4CampaignStateV0,
  type PlanM4CampaignAiTurnInputV1,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import { parseM4CampaignAiDecisionTraceV1 } from "../packages/protocol/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("M4-CAMPAIGN-AI-001 minimal campaign AI planning", () => {
  test("waits with visible supply and season reasons without mutating authoritative state", () => {
    const runtime = runtimeWithM4({
      currentDay: 180,
      campaignPlans: [campaignPlan({ earliestDay: 180, latestDay: 190 })],
      commitments: [commitment(100, "assembled", 60)],
      reservations: [reservation(501, 1, 30)]
    });
    const beforeHash = runtime.world.meta.stateHash;

    const planned = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.wait"));

    expect(planned.command).toBeNull();
    expect(planned.trace).toMatchObject({
      schemaVersion: 1,
      decisionKind: "wait",
      primaryReasonCode: "m4.ai.wait.supply-shortfall",
      selectedCampaignPlanId: 10
    });
    expect(planned.trace.reasonCodes).toEqual([
      "m4.ai.wait.supply-shortfall",
      "m4.ai.wait.season-risk"
    ]);
    expect(parseM4CampaignAiDecisionTraceV1(planned.trace).ok).toBe(true);
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
    expect(hashWorldStateV0(runtime.world)).toBe(beforeHash);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("changes a planned objective target from visible faction knowledge", () => {
    let runtime = runtimeWithM4({
      campaignPlans: [campaignPlan({ targetDistrictId: 3 })],
      knowledge: [knowledgeSnapshot(1, 2)]
    });

    const planned = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.change-target"));

    expect(planned.command).toMatchObject({
      kind: "sim.update-campaign-objective",
      actor: { kind: "ai", id: "polity:1" },
      payload: {
        campaignPlanId: 10,
        target: { kind: "district", districtId: 2 },
        reasonCodes: ["m4.ai.objective-change.knowledge-target"]
      }
    });
    expect(planned.trace.decisionKind).toBe("change-objective");
    expect(planned.trace.primaryReasonCode).toBe("m4.ai.objective-change.knowledge-target");

    runtime = accepted(runtime, requireCommand(planned.command));
    expect(runtime.world.state.m4?.campaignPlans[0]).toMatchObject({
      target: { kind: "district", districtId: parseDistrictId(2) },
      statusReasonCode: "campaign.objective.updated"
    });
  });

  test("records debtor reinforcement through the normal muster response command", () => {
    let runtime = runtimeWithM4({
      campaignPlans: [campaignPlan({})],
      commitments: [commitment(100, "delayed", 20)]
    });

    const planned = planM4CampaignAiTurnV1(
      runtime,
      aiInput("m4.ai.reinforce", { actorId: "polity:2", actorPolityId: 2 })
    );

    expect(planned.command).toMatchObject({
      kind: "sim.record-muster-response",
      actor: { kind: "ai", id: "polity:2" },
      payload: {
        commitmentId: 100,
        assembledTroops: 60,
        delayedTroops: 0,
        refusedTroops: 0,
        releasedTroops: 0,
        reasonCodes: ["m4.ai.reinforce.delayed-commitment"]
      }
    });
    expect(planned.trace.decisionKind).toBe("reinforce");

    runtime = accepted(runtime, requireCommand(planned.command));
    expect(runtime.world.state.m4?.mobilizedForceCommitments[0]).toMatchObject({
      assembledTroops: 60,
      delayedTroops: 0,
      status: "assembled",
      statusReasonCode: "m4.ai.reinforce.delayed-commitment"
    });
  });

  test("withdraws a supply-broken campaign through the withdrawal command path", () => {
    let runtime = runtimeWithM4({
      campaignPlans: [campaignPlan({ status: "active" })],
      marches: [march({ supplyStatus: "out-of-supply", carriedGrain: 0, activeTroops: 40 })]
    });

    const planned = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.withdraw"));

    expect(planned.command).toMatchObject({
      kind: "sim.resolve-m4-campaign-withdrawal",
      actor: { kind: "ai", id: "polity:1" },
      payload: {
        withdrawalId: 901,
        campaignPlanId: 10,
        marchId: 701,
        siegeId: null,
        triggerReason: "supply",
        reasonCodes: ["m4.ai.withdraw.supply-collapse"]
      }
    });
    expect(planned.trace.decisionKind).toBe("withdraw");

    runtime = accepted(runtime, requireCommand(planned.command));
    expect(runtime.world.state.m4?.withdrawals[0]).toMatchObject({
      withdrawalId: 901,
      triggerReason: "supply",
      reasonCodes: expect.arrayContaining(["m4.ai.withdraw.supply-collapse"])
    });
  });

  test("cancels an expired planned campaign through the objective command path", () => {
    let runtime = runtimeWithM4({
      currentDay: 30,
      campaignPlans: [campaignPlan({ earliestDay: 10, latestDay: 20 })]
    });

    const planned = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.cancel"));

    expect(planned.command).toMatchObject({
      kind: "sim.cancel-campaign-objective",
      actor: { kind: "ai", id: "polity:1" },
      payload: {
        campaignPlanId: 10,
        reasonCode: "m4.ai.cancel.start-range-expired"
      }
    });
    expect(planned.trace.decisionKind).toBe("cancel");

    runtime = accepted(runtime, requireCommand(planned.command));
    expect(runtime.world.state.m4?.campaignPlans[0]).toMatchObject({
      status: "cancelled",
      statusReasonCode: "m4.ai.cancel.start-range-expired"
    });
  });

  test("continues a supplied siege through the same siege choice command as a player", () => {
    let runtime = runtimeWithM4({
      campaignPlans: [campaignPlan({ status: "active" })],
      marches: [march({ supplyStatus: "well-supplied", carriedGrain: 300, activeTroops: 80 })],
      sieges: [siege()]
    });

    const planned = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.continue"));

    expect(planned.command).toMatchObject({
      kind: "sim.apply-m4-siege-choice",
      actor: { kind: "ai", id: "polity:1" },
      payload: {
        siegeId: 801,
        campaignPlanId: 10,
        marchId: 701,
        choice: "continue",
        reasonCodes: ["m4.ai.continue.siege-pressure"]
      }
    });
    expect(planned.trace.decisionKind).toBe("continue");

    runtime = accepted(runtime, requireCommand(planned.command));
    expect(runtime.world.state.m4?.sieges[0]?.daysInvested).toBe(1);
  });

  test("chooses no action with bounded deterministic serializable trace ordering", () => {
    const runtime = runtimeWithM4({});

    const first = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.no-action"));
    const second = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.no-action"));

    expect(first).toEqual(second);
    expect(first.command).toBeNull();
    expect(first.trace).toMatchObject({
      decisionKind: "no-action",
      primaryReasonCode: "m4.ai.no-action.no-visible-campaign"
    });
    expect(first.trace.candidates.length).toBeLessThanOrEqual(5);
    expect(first.trace.candidates.map((candidate) => candidate.candidateId)).toEqual(
      [...first.trace.candidates.map((candidate) => candidate.candidateId)].sort()
    );
    expect(JSON.parse(JSON.stringify(first.trace))).toEqual(first.trace);
  });

  test("uses player/AI command parity and keeps trace size bounded", () => {
    const runtime = runtimeWithM4({
      routes: [route(10, 1, 2, 1, 400), route(11, 2, 3, 1, 400)],
      campaignPlans: [campaignPlan({})],
      commitments: [commitment(100, "assembled", 60)],
      reservations: [reservation(501, 1, 300)]
    });
    const planned = planM4CampaignAiTurnV1(runtime, aiInput("m4.ai.start"));

    expect(planned.command).toMatchObject({
      kind: "sim.start-campaign-march",
      payload: {
        marchId: 701,
        campaignPlanId: 10,
        reasonCodes: ["m4.ai.target.start-ready"]
      }
    });
    expect(planned.trace.candidates.length).toBeLessThanOrEqual(5);

    const aiRuntime = accepted(runtime, requireCommand(planned.command));
    const playerRuntime = accepted(runtime, {
      ...requireCommand(planned.command),
      commandId: "m4.ai.start.player-parity",
      actor: { kind: "player", id: "polity:1" }
    });
    expect(aiRuntime.world.meta.stateHash).toBe(playerRuntime.world.meta.stateHash);
  });
});

function aiInput(
  commandIdPrefix: string,
  overrides: Partial<PlanM4CampaignAiTurnInputV1> = {}
): PlanM4CampaignAiTurnInputV1 {
  return {
    actorId: "polity:1",
    actorPolityId: 1,
    commandIdPrefix,
    nextCampaignPlanId: 910,
    nextMarchId: 701,
    nextWithdrawalId: 901,
    plannedMarchDays: 4,
    grainPerTroopPerDay: 1,
    maxTraceCandidates: 5,
    ...overrides
  };
}

function runtimeWithM4(input: {
  readonly currentDay?: number;
  readonly routes?: readonly M2RouteTransportEdgeStateV0[];
  readonly campaignPlans?: readonly M4CampaignStateV0["campaignPlans"][number][];
  readonly commitments?: readonly M4CampaignStateV0["mobilizedForceCommitments"][number][];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
  readonly marches?: readonly M4CampaignStateV0["marches"][number][];
  readonly sieges?: readonly M4CampaignStateV0["sieges"][number][];
  readonly knowledge?: readonly M4CampaignStateV0["factionKnowledgeSnapshots"][number][];
}): SimulationRuntimeV1 {
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
    contentManifestHash: "m4-campaign-ai-test",
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
      campaignPlans: input.campaignPlans ?? [],
      factionKnowledgeSnapshots: input.knowledge ?? [],
      mobilizedForceCommitments: input.commitments ?? [],
      grainSupplyReservations: input.reservations ?? [],
      marches: input.marches ?? [],
      sieges: input.sieges ?? []
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
    world: {
      ...controlledWorld,
      meta: { ...controlledWorld.meta, stateHash: hashWorldStateV0(controlledWorld) }
    },
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function definitions(
  routes: readonly M2RouteTransportEdgeStateV0[] = defaultRoutes()
): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.ai-owner" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.ai-vassal" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m4.ai-commander" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.ai-origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.ai-target-a" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.ai-target-b" }
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
  readonly targetDistrictId?: number;
  readonly earliestDay?: number;
  readonly latestDay?: number;
  readonly status?: "planned" | "active";
}): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(input.targetDistrictId ?? 3) },
    objectiveKind: "besiege",
    startWindow: {
      earliestDay: parseGameDay(input.earliestDay ?? 10),
      latestDay: parseGameDay(input.latestDay ?? 20)
    },
    status: input.status ?? "planned",
    statusReasonCode:
      input.status === "active" ? "campaign.objective.march-arrived" : "campaign.objective.created",
    reasonCodes: ["campaign.reason.ai-fixture"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function commitment(
  id: number,
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
    promisedTroops: 60,
    dueDay: parseGameDay(20),
    assemblyWindow: { earliestDay: parseGameDay(10), latestDay: parseGameDay(18) },
    plannedAssemblyDay: parseGameDay(10),
    assembledTroops,
    delayedTroops: status === "delayed" ? 60 - assembledTroops : 0,
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

function march(input: {
  readonly supplyStatus: "well-supplied" | "hungry" | "out-of-supply";
  readonly carriedGrain: number;
  readonly activeTroops: number;
}): M4CampaignStateV0["marches"][number] {
  return {
    marchId: parseCampaignMarchId(701),
    campaignPlanId: parseCampaignPlanId(10),
    originDistrictId: parseDistrictId(1),
    targetDistrictId: parseDistrictId(3),
    currentDistrictId: parseDistrictId(3),
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
    currentSegmentIndex: 1,
    progressOnSegmentDays: 0,
    activeTroops: input.activeTroops,
    grainPerTroopPerDay: 1,
    supply: {
      status: input.supplyStatus,
      carriedGrain: input.carriedGrain,
      consumedGrain: 0,
      shortageGrain: input.supplyStatus === "out-of-supply" ? 60 : 0,
      delayedDays: input.supplyStatus === "well-supplied" ? 0 : 1
    },
    status: "arrived",
    statusReasonCode: "march.arrived",
    reasonCodes: ["march.arrived"],
    startedDay: parseGameDay(10),
    updatedDay: parseGameDay(10),
    predictedArrivalWindow: { earliestDay: parseGameDay(10), latestDay: parseGameDay(10) },
    actualArrivalDay: parseGameDay(10),
    joinedCommitmentIds: [],
    joinedCommitmentTroops: [],
    failedCommitmentIds: []
  };
}

function siege(): M4CampaignStateV0["sieges"][number] {
  return {
    siegeId: parseSiegeId(801),
    campaignPlanId: parseCampaignPlanId(10),
    marchId: parseCampaignMarchId(701),
    targetDistrictId: parseDistrictId(3),
    attackerPolityId: parsePolityId(1),
    defenderPolityId: parsePolityId(2),
    status: "blockading",
    statusReasonCode: "siege.invested.blockade",
    fortification: 400,
    defenderEstimatedTroops: 20,
    defenderSupply: 120,
    siegeProgress: 0,
    daysInvested: 0,
    blockadeDays: 0,
    assaultCount: 0,
    attackerTroops: 80,
    attackerCasualties: 0,
    defenderCasualties: 0,
    supplyLoss: 0,
    surrenderEligible: false,
    surrenderReasonCodes: [],
    reasonCodes: ["siege.invested.blockade"],
    creditHooks: [],
    reputationHooks: [],
    startedDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function knowledgeSnapshot(
  snapshotId: number,
  targetDistrictId: number
): M4CampaignStateV0["factionKnowledgeSnapshots"][number] {
  return {
    snapshotId: parseFactionKnowledgeSnapshotId(snapshotId),
    observerPolityId: parsePolityId(1),
    subjectPolityId: parsePolityId(2),
    knowledgeVersion: 1,
    recordedDay: parseGameDay(10),
    source: { kind: "scout", sourceId: "m4.ai.scout", reliabilityBps: 8_000 },
    knownObjectives: [],
    routeEstimates: [],
    supplyEstimates: [],
    defenderEstimates: [
      {
        target: { kind: "district", districtId: parseDistrictId(targetDistrictId) },
        defenderMin: 10,
        defenderMax: 20,
        confidenceBps: 8_000
      }
    ]
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
      sourceId: "m4.ai.vassalage.2-to-1",
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
    commandId: "m4.ai.obligation.fixture",
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

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  if (submitted.result.status !== "accepted") {
    throw new Error(JSON.stringify(submitted.result.error));
  }
  return submitted.runtime;
}

function requireCommand(command: GameCommandV1 | null): GameCommandV1 {
  if (command === null) {
    throw new Error("Expected AI command.");
  }
  return command;
}

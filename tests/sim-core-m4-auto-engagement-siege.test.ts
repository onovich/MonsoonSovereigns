import { describe, expect, test } from "vitest";

import {
  bootSimulationV1,
  canonicalizeM4CampaignStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  parseCampaignMarchId,
  parseCampaignPlanId,
  parseDistrictId,
  parseFieldEngagementId,
  parseGameDay,
  parsePersonId,
  parsePolityId,
  parseRouteId,
  parseSiegeId,
  querySimulationV1,
  loadSaveV1,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type DomainEventV1,
  type M4CampaignStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type {
  ApplyM4SiegeChoiceCommandV1,
  GameCommandV1,
  ResolveM4FieldEngagementCommandV1
} from "../packages/protocol/src/index";

describe("M4-AUTO-ENGAGEMENT-SIEGE-001 deterministic combat choice loop", () => {
  test("resolves automatic field engagement from explicit inputs with auditable losses", () => {
    let runtime = runtimeWithCombat();
    runtime = accepted(runtime, fieldEngagementCommand("m4.engagement.win", runtime, 901));

    const engagement = firstEngagement(runtime.world);
    const marchState = firstMarch(runtime.world);

    expect(engagement).toMatchObject({
      engagementId: parseFieldEngagementId(901),
      outcome: "attacker-victory",
      attackerTroopsBefore: 80,
      attackerTroopsAfter: 72,
      defenderEstimatedTroopsBefore: 20,
      defenderEstimatedTroopsAfter: 0,
      attackerCasualties: 8,
      defenderCasualties: 20,
      supplyLoss: 40,
      reasonCodes: expect.arrayContaining([
        "engagement.outcome.attacker-victory",
        "engagement.reason.force-superiority",
        "engagement.reason.defender-fortification",
        "engagement.reason.supply-ready"
      ])
    });
    expect(marchState.activeTroops).toBe(72);
    expect(marchState.supply.carriedGrain).toBe(200);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("applies invest, assault, and accept surrender through serializable events", () => {
    let runtime = runtimeWithCombat();
    runtime = accepted(runtime, siegeCommand("m4.siege.invest", runtime, "invest-blockade", 801));
    runtime = accepted(runtime, siegeCommand("m4.siege.assault", runtime, "assault", 801));

    let siege = firstSiege(runtime.world);
    expect(siege).toMatchObject({
      siegeId: parseSiegeId(801),
      status: "surrender-ready",
      statusReasonCode: "siege.surrender.assault-breach",
      assaultCount: 1,
      surrenderEligible: true,
      surrenderReasonCodes: ["siege.surrender.assault-breach"],
      reasonCodes: expect.arrayContaining(["siege.assault.breach"])
    });
    expect(siege.creditHooks.length).toBeGreaterThan(0);
    expect(siege.reputationHooks.length).toBeGreaterThan(0);

    runtime = accepted(runtime, siegeCommand("m4.siege.accept", runtime, "accept-surrender", 801));
    siege = firstSiege(runtime.world);
    expect(siege).toMatchObject({
      status: "surrendered",
      statusReasonCode: "siege.surrender.accepted"
    });
    expect(firstCampaign(runtime.world).status).toBe("completed");
    expect(runtime.eventTail.map((event) => event.kind)).toEqual([
      "sim.m4-siege-choice-applied",
      "sim.m4-siege-choice-applied",
      "sim.m4-siege-choice-applied"
    ]);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("continues blockade until explicit surrender conditions are met and queryable", () => {
    let runtime = runtimeWithCombat();
    runtime = accepted(
      runtime,
      siegeCommand("m4.siege.blockade.invest", runtime, "invest-blockade", 802, {
        defenderSupply: 10,
        fortification: 300,
        defenderEstimatedTroops: 18
      })
    );
    runtime = accepted(
      runtime,
      siegeCommand("m4.siege.blockade.continue", runtime, "continue", 802)
    );

    const siege = firstSiege(runtime.world);
    expect(siege).toMatchObject({
      status: "surrender-ready",
      statusReasonCode: "siege.surrender.conditions-met",
      defenderSupply: 0,
      daysInvested: 1,
      blockadeDays: 1,
      surrenderEligible: true,
      surrenderReasonCodes: expect.arrayContaining(["siege.surrender.defender-supply-exhausted"])
    });
    expect(firstMarch(runtime.world).supply.carriedGrain).toBe(160);

    const queried = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m4-siege-state",
      payload: { queryId: "m4.siege.query", campaignPlanId: 10 }
    });
    expect(queried.status).toBe("ok");
    if (queried.status !== "ok" || queried.result.kind !== "sim.list-m4-siege-state") {
      throw new Error("Expected M4 siege query result.");
    }
    expect(queried.result.sieges[0]).toMatchObject({
      siegeId: 802,
      status: "surrender-ready",
      defenderSupply: 0,
      surrenderEligible: true
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("lifts siege without completing or cancelling the campaign objective", () => {
    let runtime = runtimeWithCombat();
    runtime = accepted(runtime, siegeCommand("m4.siege.lift.invest", runtime, "invest-blockade", 803));
    runtime = accepted(runtime, siegeCommand("m4.siege.lift", runtime, "lift-siege", 803));

    expect(firstSiege(runtime.world)).toMatchObject({
      status: "lifted",
      statusReasonCode: "siege.lifted"
    });
    expect(firstCampaign(runtime.world)).toMatchObject({
      status: "active",
      statusReasonCode: "campaign.objective.siege-lifted"
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("withdraws from siege when attacker supply collapse removes the force", () => {
    let runtime = runtimeWithCombat({ activeTroops: 1, carriedGrain: 0 });
    runtime = accepted(
      runtime,
      siegeCommand("m4.siege.supply-failure.invest", runtime, "invest-blockade", 804, {
        defenderSupply: 100,
        defenderEstimatedTroops: 40,
        fortification: 500
      })
    );
    runtime = accepted(runtime, siegeCommand("m4.siege.supply-failure.continue", runtime, "continue", 804));

    const siege = firstSiege(runtime.world);
    const marchState = firstMarch(runtime.world);
    expect(siege).toMatchObject({
      status: "withdrawn",
      statusReasonCode: "siege.failure.supply-collapse",
      attackerTroops: 0,
      attackerCasualties: 1,
      supplyLoss: 0
    });
    expect(marchState.activeTroops).toBe(0);
    expect(marchState.supply.carriedGrain).toBe(0);
    expect(firstCampaign(runtime.world)).toMatchObject({
      status: "cancelled",
      statusReasonCode: "campaign.objective.siege-supply-failed"
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("canonicalization gives deterministic combat state ordering", () => {
    const world = runtimeWithCombat().world;
    const m4 = world.state.m4;
    if (m4 === undefined) {
      throw new Error("Expected M4 state.");
    }
    const reversed: M4CampaignStateV0 = {
      ...m4,
      fieldEngagements: [
        fieldEngagementFixture(902, 702),
        fieldEngagementFixture(901, 701)
      ],
      sieges: [siegeFixture(802, 702), siegeFixture(801, 701)]
    };
    const canonical = canonicalizeM4CampaignStateV0(reversed);

    expect(canonical.fieldEngagements.map((engagement) => Number(engagement.engagementId))).toEqual([
      901,
      902
    ]);
    expect(canonical.sieges.map((siege) => Number(siege.siegeId))).toEqual([801, 802]);
  });

  test("player and AI use the same field engagement command path without hidden state differences", () => {
    const playerRuntime = runtimeWithCombat();
    const aiRuntime = runtimeWithCombat();

    const player = accepted(
      playerRuntime,
      fieldEngagementCommand("m4.engagement.parity.player", playerRuntime, 905, "player")
    );
    const ai = accepted(
      aiRuntime,
      fieldEngagementCommand("m4.engagement.parity.ai", aiRuntime, 905, "ai")
    );

    expect(player.world.meta.stateHash).toBe(ai.world.meta.stateHash);
  });

  test("player and AI use the same siege choice command path without hidden state differences", () => {
    let player = runtimeWithCombat();
    player = accepted(
      player,
      siegeCommand("m4.siege.parity.player.invest", player, "invest-blockade", 808, {
        actorKind: "player"
      })
    );
    player = accepted(
      player,
      siegeCommand("m4.siege.parity.player.assault", player, "assault", 808, {
        actorKind: "player"
      })
    );

    let ai = runtimeWithCombat();
    ai = accepted(
      ai,
      siegeCommand("m4.siege.parity.ai.invest", ai, "invest-blockade", 808, {
        actorKind: "ai"
      })
    );
    ai = accepted(
      ai,
      siegeCommand("m4.siege.parity.ai.assault", ai, "assault", 808, {
        actorKind: "ai"
      })
    );

    expect(player.world.meta.stateHash).toBe(ai.world.meta.stateHash);
  });

  test("keeps force and supply nonnegative while accounting all losses explicitly", () => {
    let runtime = runtimeWithCombat();
    runtime = accepted(runtime, siegeCommand("m4.siege.accounting.invest", runtime, "invest-blockade", 806));
    runtime = accepted(runtime, siegeCommand("m4.siege.accounting.assault", runtime, "assault", 806));

    const siege = firstSiege(runtime.world);
    const marchState = firstMarch(runtime.world);
    expect(siege.attackerTroops).toBeGreaterThanOrEqual(0);
    expect(siege.defenderEstimatedTroops).toBeGreaterThanOrEqual(0);
    expect(marchState.activeTroops).toBeGreaterThanOrEqual(0);
    expect(marchState.supply.carriedGrain).toBeGreaterThanOrEqual(0);
    expect(siege.attackerTroops + siege.attackerCasualties).toBe(80);
    expect(siege.defenderEstimatedTroops + siege.defenderCasualties).toBe(20);
    expect(marchState.supply.carriedGrain + siege.supplyLoss).toBe(240);
  });

  test("round-trips new M4 combat event tails through save/load parsing", () => {
    const boot = bootMinimalRuntime();
    const eventTail = m4CombatEventTail();
    const runtime: SimulationRuntimeV1 = {
      ...boot.runtime,
      eventTail
    };
    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "node-runner",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected M4 combat event-tail save to load.");
    }
    expect(loaded.runtime.eventTail).toEqual(eventTail);
  });
});

function bootMinimalRuntime(): Extract<ReturnType<typeof bootSimulationV1>, { status: "booted" }> {
  const boot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
  if (boot.status !== "booted") {
    throw new Error("Expected minimal boot.");
  }
  return boot;
}

function m4CombatEventTail(): readonly DomainEventV1[] {
  return [
    {
      schemaVersion: 1,
      kind: "sim.m4-field-engagement-resolved",
      commandId: "m4.save.engagement",
      actor: { kind: "player", id: "polity:1" },
      engagementId: 901,
      campaignPlanId: 10,
      marchId: 701,
      attackerPolityId: parsePolityId(1),
      defenderPolityId: parsePolityId(2),
      outcome: "attacker-victory",
      attackerCasualties: 8,
      defenderCasualties: 20,
      supplyLoss: 40,
      campaignStatusBefore: "active",
      campaignStatusAfter: "active",
      reasonCodes: ["engagement.outcome.attacker-victory"],
      creditHooks: [
        { polityId: parsePolityId(1), amount: 20, reasonCode: "credit.m4.field-victory" }
      ],
      reputationHooks: [
        { polityId: parsePolityId(1), amount: -8, reasonCode: "reputation.m4.casualties" }
      ],
      revisionBefore: 0,
      revisionAfter: 1
    },
    {
      schemaVersion: 1,
      kind: "sim.m4-siege-choice-applied",
      commandId: "m4.save.siege",
      actor: { kind: "ai", id: "polity:1" },
      siegeId: 801,
      campaignPlanId: 10,
      marchId: 701,
      choice: "assault",
      statusBefore: "blockading",
      statusAfter: "surrender-ready",
      attackerCasualties: 8,
      defenderCasualties: 20,
      supplyLoss: 80,
      campaignStatusBefore: "active",
      campaignStatusAfter: "active",
      surrenderEligible: true,
      reasonCodes: ["siege.assault.breach", "siege.surrender.assault-breach"],
      creditHooks: [
        { polityId: parsePolityId(1), amount: 20, reasonCode: "credit.m4.siege-progress" }
      ],
      reputationHooks: [
        { polityId: parsePolityId(1), amount: -8, reasonCode: "reputation.m4.assault-losses" }
      ],
      revisionBefore: 1,
      revisionAfter: 2
    }
  ];
}

function runtimeWithCombat(input: {
  readonly activeTroops?: number;
  readonly carriedGrain?: number;
} = {}): SimulationRuntimeV1 {
  const world = worldWithCombat(input);
  return {
    world,
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function worldWithCombat(input: {
  readonly activeTroops?: number;
  readonly carriedGrain?: number;
}): WorldStateV0 {
  const defs = definitions();
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-auto-engagement-siege-test",
    currentDay: 20,
    revision: 0,
    definitions: defs,
    m3: createM3PolityVassalageStateV0(defs, {
      polities: [
        { polityId: parsePolityId(1), directSuzerainPolityId: null },
        { polityId: parsePolityId(2), directSuzerainPolityId: null }
      ]
    }),
    m4: createM4CampaignStateV0(defs, {
      campaignPlans: [campaignPlan()],
      marches: [arrivedMarch(input.activeTroops ?? 80, input.carriedGrain ?? 240)]
    })
  });
  return {
    ...world,
    meta: { ...world.meta, stateHash: hashWorldStateV0(world) }
  };
}

function definitions(): WorldDefinitionsV0 {
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

function campaignPlan(): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(3) },
    objectiveKind: "besiege",
    startWindow: { earliestDay: parseGameDay(20), latestDay: parseGameDay(20) },
    status: "active",
    statusReasonCode: "campaign.objective.march-arrived",
    reasonCodes: ["campaign.reason.m4-combat-fixture"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(20)
  };
}

function arrivedMarch(
  activeTroops: number,
  carriedGrain: number
): M4CampaignStateV0["marches"][number] {
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
        capacity: 100,
        seasonRiskReasonCodes: []
      },
      {
        routeId: parseRouteId(11),
        fromDistrictId: parseDistrictId(2),
        toDistrictId: parseDistrictId(3),
        travelDays: 1,
        capacity: 100,
        seasonRiskReasonCodes: []
      }
    ],
    currentSegmentIndex: 1,
    progressOnSegmentDays: 0,
    activeTroops,
    grainPerTroopPerDay: 1,
    supply: {
      status: carriedGrain > 0 ? "well-supplied" : "out-of-supply",
      carriedGrain,
      consumedGrain: 0,
      shortageGrain: 0,
      delayedDays: 0
    },
    status: "arrived",
    statusReasonCode: "march.arrived",
    reasonCodes: ["march.arrived"],
    startedDay: parseGameDay(20),
    updatedDay: parseGameDay(20),
    predictedArrivalWindow: { earliestDay: parseGameDay(20), latestDay: parseGameDay(20) },
    actualArrivalDay: parseGameDay(20),
    joinedCommitmentIds: [],
    joinedCommitmentTroops: [],
    failedCommitmentIds: []
  };
}

function fieldEngagementCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  engagementId: number,
  actorKind: "ai" | "player" = "player"
): ResolveM4FieldEngagementCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.resolve-m4-field-engagement",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      engagementId,
      campaignPlanId: 10,
      marchId: 701,
      defenderPolityId: 2,
      defenderEstimatedTroops: 20,
      defenderFortification: 400,
      reasonCodes: ["engagement.reason.enemy-intercepted"]
    }
  };
}

function siegeCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  choice: ApplyM4SiegeChoiceCommandV1["payload"]["choice"],
  siegeId: number,
  input: {
    readonly defenderSupply?: number;
    readonly defenderEstimatedTroops?: number;
    readonly fortification?: number;
    readonly actorKind?: "ai" | "player";
  } = {}
): ApplyM4SiegeChoiceCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.apply-m4-siege-choice",
    commandId,
    actor: { kind: input.actorKind ?? "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      siegeId,
      campaignPlanId: 10,
      marchId: 701,
      choice,
      defenderPolityId: 2,
      fortification: input.fortification ?? 400,
      defenderEstimatedTroops: input.defenderEstimatedTroops ?? 20,
      defenderSupply: input.defenderSupply ?? 120,
      reasonCodes: [`siege.choice.${choice}`]
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

function firstEngagement(world: WorldStateV0): M4CampaignStateV0["fieldEngagements"][number] {
  const engagement = world.state.m4?.fieldEngagements[0];
  if (engagement === undefined) {
    throw new Error("Expected M4 field engagement.");
  }
  return engagement;
}

function firstSiege(world: WorldStateV0): M4CampaignStateV0["sieges"][number] {
  const siege = world.state.m4?.sieges[0];
  if (siege === undefined) {
    throw new Error("Expected M4 siege.");
  }
  return siege;
}

function fieldEngagementFixture(
  engagementId: number,
  marchId: number
): M4CampaignStateV0["fieldEngagements"][number] {
  return {
    engagementId: parseFieldEngagementId(engagementId),
    campaignPlanId: parseCampaignPlanId(10),
    marchId: parseCampaignMarchId(marchId),
    attackerPolityId: parsePolityId(1),
    defenderPolityId: parsePolityId(2),
    target: { kind: "district", districtId: parseDistrictId(3) },
    attackerTroopsBefore: 80,
    attackerTroopsAfter: 72,
    defenderEstimatedTroopsBefore: 20,
    defenderEstimatedTroopsAfter: 0,
    attackerCasualties: 8,
    defenderCasualties: 20,
    supplyLoss: 40,
    defenderFortification: 400,
    outcome: "attacker-victory",
    reasonCodes: ["engagement.outcome.attacker-victory"],
    creditHooks: [],
    reputationHooks: [],
    resolvedDay: parseGameDay(20)
  };
}

function siegeFixture(siegeId: number, marchId: number): M4CampaignStateV0["sieges"][number] {
  return {
    siegeId: parseSiegeId(siegeId),
    campaignPlanId: parseCampaignPlanId(10),
    marchId: parseCampaignMarchId(marchId),
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
    startedDay: parseGameDay(20),
    updatedDay: parseGameDay(20)
  };
}

import { describe, expect, test } from "vitest";

import {
  canonicalizeM4CampaignStateV0,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  parseCampaignPlanId,
  parseDistrictId,
  parseFactionKnowledgeSnapshotId,
  parseGameDay,
  parsePersonId,
  parsePolityId,
  querySimulationV1,
  submitCommandV1,
  validateWorldStateV0,
  type M4CampaignStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("M4-CAMPAIGN-OBJECTIVES-001 campaign objectives and FactionKnowledge", () => {
  test("property invariants keep campaign IDs branded, stable, and canonically ordered", () => {
    const first = createM4CampaignStateV0(definitions(), {
      campaignPlans: [campaignPlan(20), campaignPlan(10)],
      factionKnowledgeSnapshots: [knowledgeSnapshot(30), knowledgeSnapshot(10)]
    });
    const second = createM4CampaignStateV0(definitions(), {
      campaignPlans: [campaignPlan(10), campaignPlan(20)],
      factionKnowledgeSnapshots: [knowledgeSnapshot(10), knowledgeSnapshot(30)]
    });

    expect(first.campaignPlans.map((plan) => plan.id)).toEqual([
      parseCampaignPlanId(10),
      parseCampaignPlanId(20)
    ]);
    expect(first.factionKnowledgeSnapshots.map((snapshot) => snapshot.snapshotId)).toEqual([
      parseFactionKnowledgeSnapshotId(10),
      parseFactionKnowledgeSnapshotId(30)
    ]);
    expect(first).toEqual(second);
  });

  test("validates objective target, start window, owner, status, and reason codes", () => {
    let runtime = runtimeWithM4();
    const accepted = submitCommandV1(
      runtime,
      createCampaignCommand("m4.create.valid", "player", runtime, 100)
    );
    expect(accepted.result.status).toBe("accepted");
    runtime = accepted.runtime;

    expect(runtime.world.state.m4?.campaignPlans).toHaveLength(1);
    expect(runtime.world.state.m4?.campaignPlans[0]).toMatchObject({
      id: parseCampaignPlanId(100),
      objectiveKind: "besiege",
      target: { kind: "district", districtId: parseDistrictId(2) },
      startWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(30) },
      status: "planned",
      statusReasonCode: "campaign.objective.created",
      reasonCodes: ["campaign.reason.dry-season-range"]
    });
    expect(validateWorldStateV0(runtime.world)).toEqual([]);

    expect(
      submitCommandV1(runtime, createCampaignCommand("m4.create.duplicate", "player", runtime, 100))
        .result
    ).toMatchObject({
      status: "rejected",
      error: { code: "campaign-objective-invalid", path: "payload.campaignPlanId" }
    });
    expect(
      submitCommandV1(runtime, {
        ...createCampaignCommand("m4.create.bad-window", "player", runtime, 101),
        payload: {
          ...createCampaignCommand("m4.create.bad-window.payload", "player", runtime, 101).payload,
          startWindow: { earliestDay: 40, latestDay: 30 }
        }
      }).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "campaign-objective-invalid", path: "payload.startWindow" }
    });
  });

  test("accepts player and AI campaign commands through the same apply path", () => {
    const player = submitCommandV1(
      runtimeWithM4(),
      createCampaignCommand("m4.create.parity.player", "player", runtimeWithM4(), 200)
    );
    const ai = submitCommandV1(
      runtimeWithM4(),
      createCampaignCommand("m4.create.parity.ai", "ai", runtimeWithM4(), 200)
    );

    expect(player.result.status).toBe("accepted");
    expect(ai.result.status).toBe("accepted");
    expect(player.runtime.world.meta.stateHash).toBe(ai.runtime.world.meta.stateHash);
  });

  test("updates and cancels objectives with explicit reason codes", () => {
    let runtime = runtimeWithM4();
    const created = submitCommandV1(
      runtime,
      createCampaignCommand("m4.update.create", "player", runtime, 300)
    );
    runtime = created.runtime;

    const updated = submitCommandV1(
      runtime,
      updateCampaignCommand("m4.update.apply", runtime, 300)
    );
    expect(updated.result.status).toBe("accepted");
    runtime = updated.runtime;
    expect(runtime.world.state.m4?.campaignPlans[0]).toMatchObject({
      objectiveKind: "relieve",
      target: { kind: "district", districtId: parseDistrictId(3) },
      statusReasonCode: "campaign.objective.updated",
      reasonCodes: ["campaign.reason.defender-pressure"]
    });

    const cancelled = submitCommandV1(
      runtime,
      cancelCampaignCommand("m4.cancel.apply", runtime, 300)
    );
    expect(cancelled.result.status).toBe("accepted");
    expect(cancelled.runtime.world.state.m4?.campaignPlans[0]).toMatchObject({
      status: "cancelled",
      statusReasonCode: "campaign.cancelled.monsoon-range"
    });
  });

  test("canonicalizes FactionKnowledge ordering deterministically", () => {
    const first = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [],
      factionKnowledgeSnapshots: [
        {
          ...knowledgeSnapshot(2),
          knownObjectives: [
            knownObjective(20, "campaign.reason.late-report"),
            knownObjective(10, "campaign.reason.strong-source")
          ],
          routeEstimates: [routeEstimate(2), routeEstimate(1)],
          supplyEstimates: [supplyEstimate(3), supplyEstimate(1)],
          defenderEstimates: [defenderEstimate(2), defenderEstimate(1)]
        }
      ]
    });
    const second = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [],
      factionKnowledgeSnapshots: [
        {
          ...knowledgeSnapshot(2),
          knownObjectives: [
            knownObjective(10, "campaign.reason.strong-source"),
            knownObjective(20, "campaign.reason.late-report")
          ],
          routeEstimates: [routeEstimate(1), routeEstimate(2)],
          supplyEstimates: [supplyEstimate(1), supplyEstimate(3)],
          defenderEstimates: [defenderEstimate(1), defenderEstimate(2)]
        }
      ]
    });

    expect(first).toEqual(second);
  });

  test("planning queries are read-only and expose forecasts, reasons, and knowledge estimates", () => {
    const world = worldWithM4({
      campaignPlans: [campaignPlan(10)],
      factionKnowledgeSnapshots: [knowledgeSnapshot(10)]
    });
    const runtime = runtimeFromWorld(world);
    const beforeHash = runtime.world.meta.stateHash;

    const plans = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m4-campaign-plans"
    });
    expect(plans.status).toBe("ok");
    if (plans.status !== "ok" || plans.result.kind !== "sim.list-m4-campaign-plans") {
      throw new Error("Expected M4 campaign plan query.");
    }
    expect(plans.result.plans[0]).toMatchObject({
      campaignPlanId: 10,
      forecast: {
        status: "ready",
        earliestStartDay: 12,
        latestStartDay: 30,
        reasonCodes: ["campaign.forecast.start-range-open"]
      }
    });

    const knowledge = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m4-faction-knowledge",
      payload: { queryId: "m4.knowledge.1", observerPolityId: 1 }
    });
    expect(knowledge.status).toBe("ok");
    if (knowledge.status !== "ok" || knowledge.result.kind !== "sim.list-m4-faction-knowledge") {
      throw new Error("Expected M4 faction knowledge query.");
    }
    expect(knowledge.result.snapshots[0]).toMatchObject({
      snapshotId: 10,
      observerPolityId: 1,
      knowledgeVersion: 3,
      knownObjectives: [{ campaignPlanId: 10, confidenceBps: 7_000 }]
    });

    const mutableReasonCodes = plans.result.plans[0]?.forecast.reasonCodes as string[];
    mutableReasonCodes.push("mutated");
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
    expect(hashWorldStateV0(runtime.world)).toBe(beforeHash);
  });
});

function definitions(): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m4.attacker" },
      { id: parsePolityId(2), displayNameKey: "polity.m4.defender" }
    ],
    persons: [
      { id: parsePersonId(1), displayNameKey: "person.m4.commander" },
      { id: parsePersonId(2), displayNameKey: "person.m4.defender" }
    ],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m4.origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m4.target" },
      { id: parseDistrictId(3), displayNameKey: "district.m4.relief" }
    ],
    settlements: [],
    routes: [
      {
        id: 1 as never,
        fromDistrictId: parseDistrictId(1),
        toDistrictId: parseDistrictId(2),
        lengthInMapUnits: 10
      },
      {
        id: 2 as never,
        fromDistrictId: parseDistrictId(2),
        toDistrictId: parseDistrictId(3),
        lengthInMapUnits: 20
      }
    ]
  };
}

function runtimeWithM4(): SimulationRuntimeV1 {
  return runtimeFromWorld(worldWithM4({ campaignPlans: [], factionKnowledgeSnapshots: [] }));
}

function runtimeFromWorld(world: WorldStateV0): SimulationRuntimeV1 {
  return {
    world,
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function worldWithM4(
  m4: Pick<M4CampaignStateV0, "campaignPlans" | "factionKnowledgeSnapshots">
): WorldStateV0 {
  const defs = definitions();
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-campaign-objectives-test",
    currentDay: 10,
    revision: 0,
    definitions: defs,
    m2: createM2EconomyPopulationStateV0(defs),
    m3: createM3PolityVassalageStateV0(defs),
    m4: createM4CampaignStateV0(defs, m4)
  });
}

function campaignPlan(id: number): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(id),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(2) },
    objectiveKind: "besiege",
    startWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(30) },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: ["campaign.reason.dry-season-range"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function knowledgeSnapshot(id: number): M4CampaignStateV0["factionKnowledgeSnapshots"][number] {
  return {
    snapshotId: parseFactionKnowledgeSnapshotId(id),
    observerPolityId: parsePolityId(1),
    subjectPolityId: parsePolityId(2),
    knowledgeVersion: 3,
    recordedDay: parseGameDay(10),
    source: {
      kind: "scout",
      sourceId: "m4.scout.report",
      reliabilityBps: 7_000
    },
    knownObjectives: [knownObjective(10, "campaign.reason.strong-source")],
    routeEstimates: [routeEstimate(1)],
    supplyEstimates: [supplyEstimate(2)],
    defenderEstimates: [defenderEstimate(2)]
  };
}

function knownObjective(
  campaignPlanId: number,
  reasonCode: string
): M4CampaignStateV0["factionKnowledgeSnapshots"][number]["knownObjectives"][number] {
  return {
    campaignPlanId: parseCampaignPlanId(campaignPlanId),
    target: { kind: "district", districtId: parseDistrictId(2) },
    objectiveKind: "besiege",
    confidenceBps: 7_000,
    reasonCodes: [reasonCode]
  };
}

function routeEstimate(
  routeId: number
): M4CampaignStateV0["factionKnowledgeSnapshots"][number]["routeEstimates"][number] {
  return {
    routeId: routeId as never,
    fromDistrictId: parseDistrictId(1),
    toDistrictId: parseDistrictId(2),
    travelCostEstimate: 12,
    capacityEstimate: 80,
    confidenceBps: 6_000
  };
}

function supplyEstimate(
  districtId: number
): M4CampaignStateV0["factionKnowledgeSnapshots"][number]["supplyEstimates"][number] {
  return {
    districtId: parseDistrictId(districtId),
    supplyMin: 400,
    supplyMax: 600,
    confidenceBps: 6_500
  };
}

function defenderEstimate(
  districtId: number
): M4CampaignStateV0["factionKnowledgeSnapshots"][number]["defenderEstimates"][number] {
  return {
    target: { kind: "district", districtId: parseDistrictId(districtId) },
    defenderMin: 100,
    defenderMax: 220,
    confidenceBps: 5_500
  };
}

function createCampaignCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  campaignPlanId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.create-campaign-objective",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:1` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      campaignPlanId,
      owner: { kind: "polity", polityId: 1 },
      target: { kind: "district", districtId: 2 },
      objectiveKind: "besiege",
      startWindow: { earliestDay: 12, latestDay: 30 },
      reasonCodes: ["campaign.reason.dry-season-range"]
    }
  };
}

function updateCampaignCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  campaignPlanId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.update-campaign-objective",
    commandId,
    actor: { kind: "player", id: "player:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      campaignPlanId,
      target: { kind: "district", districtId: 3 },
      objectiveKind: "relieve",
      startWindow: { earliestDay: 15, latestDay: 35 },
      reasonCodes: ["campaign.reason.defender-pressure"]
    }
  };
}

function cancelCampaignCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  campaignPlanId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.cancel-campaign-objective",
    commandId,
    actor: { kind: "player", id: "player:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      campaignPlanId,
      reasonCode: "campaign.cancelled.monsoon-range"
    }
  };
}

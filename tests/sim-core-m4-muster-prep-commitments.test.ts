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
  parseGameDay,
  parseM3ObligationAuditEventId,
  parseM3ObligationId,
  parseMobilizedForceCommitmentId,
  parsePersonId,
  parsePolityId,
  parseWorldRevision,
  querySimulationV1,
  submitCommandV1,
  validateWorldStateV0,
  type M4CampaignStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";
import type {
  CreateMusterCommitmentCommandV1,
  RecordMusterResponseCommandV1
} from "../packages/protocol/src/index";

describe("M4-MUSTER-PREP-COMMITMENTS-001 muster preparation commitments", () => {
  test("creates deterministic muster commitments from M3 troop obligations", () => {
    let runtime = runtimeWithM4();
    runtime = accepted(runtime, createMusterCommand("m4.muster.create", "player", runtime, 100));

    const commitment = runtime.world.state.m4?.mobilizedForceCommitments[0];
    expect(commitment).toMatchObject({
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
      reasonCodes: [
        "muster.cost.economic-labor-reservation",
        "muster.cost.loyalty-pressure",
        "muster.reason.obligation-request"
      ]
    });
    expect(commitment?.localCostHooks).toEqual([
      {
        kind: "economic-labor-reservation",
        districtId: parseDistrictId(2),
        laborAmount: 60,
        reasonCode: "muster.cost.economic-labor-reservation"
      },
      {
        kind: "loyalty-pressure",
        polityId: parsePolityId(2),
        pressureBps: 600,
        reasonCode: "muster.cost.loyalty-pressure"
      }
    ]);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("accepts player and AI muster commands through the same command path", () => {
    const player = submitCommandV1(
      runtimeWithM4(),
      createMusterCommand("m4.muster.parity.player", "player", runtimeWithM4(), 101)
    );
    const ai = submitCommandV1(
      runtimeWithM4(),
      createMusterCommand("m4.muster.parity.ai", "ai", runtimeWithM4(), 101)
    );

    expect(player.result.status).toBe("accepted");
    expect(ai.result.status).toBe("accepted");
    expect(player.runtime.world.meta.stateHash).toBe(ai.runtime.world.meta.stateHash);
  });

  test("records assembled, delayed, refused, and released quantities with explicit reasons", () => {
    let runtime = runtimeWithM4();
    runtime = accepted(
      runtime,
      createMusterCommand("m4.muster.lifecycle.create", "player", runtime, 102)
    );
    runtime = accepted(
      runtime,
      recordMusterResponseCommand("m4.muster.lifecycle.assemble", "ai", runtime, 102, {
        assembledTroops: 40,
        delayedTroops: 20,
        refusedTroops: 0,
        releasedTroops: 0,
        reasonCodes: ["muster.response.partial-assembly"]
      })
    );

    expect(runtime.world.state.m4?.mobilizedForceCommitments[0]).toMatchObject({
      assembledTroops: 40,
      delayedTroops: 20,
      refusedTroops: 0,
      releasedTroops: 0,
      status: "delayed",
      statusReasonCode: "muster.response.partial-assembly"
    });

    const duplicateNonterminal = submitCommandV1(
      runtime,
      recordMusterResponseCommand("m4.muster.lifecycle.duplicate-partial", "ai", runtime, 102, {
        assembledTroops: 40,
        delayedTroops: 20,
        refusedTroops: 0,
        releasedTroops: 0,
        reasonCodes: ["muster.response.partial-assembly"]
      })
    );
    expect(duplicateNonterminal.result).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });
    expect(
      submitCommandV1(
        runtime,
        recordMusterResponseCommand("m4.muster.lifecycle.decrease", "ai", runtime, 102, {
          assembledTroops: 30,
          delayedTroops: 20,
          refusedTroops: 0,
          releasedTroops: 0,
          reasonCodes: ["muster.response.decrease"]
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });

    runtime = accepted(
      runtime,
      recordMusterResponseCommand("m4.muster.lifecycle.release", "player", runtime, 102, {
        assembledTroops: 40,
        delayedTroops: 20,
        refusedTroops: 0,
        releasedTroops: 40,
        reasonCodes: ["muster.response.released-before-march"]
      })
    );
    expect(runtime.world.state.m4?.mobilizedForceCommitments[0]).toMatchObject({
      releasedTroops: 40,
      status: "released",
      statusReasonCode: "muster.response.released-before-march"
    });

    const duplicateTerminal = submitCommandV1(
      runtime,
      recordMusterResponseCommand("m4.muster.lifecycle.duplicate-release", "player", runtime, 102, {
        assembledTroops: 40,
        delayedTroops: 20,
        refusedTroops: 0,
        releasedTroops: 40,
        reasonCodes: ["muster.response.released-before-march"]
      })
    );
    expect(duplicateTerminal.result).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });
  });

  test("separates debtor response authority from creditor release authority", () => {
    let runtime = runtimeWithM4();
    runtime = accepted(
      runtime,
      createMusterCommand("m4.muster.authority.create", "player", runtime, 112)
    );

    expect(
      submitCommandV1(
        runtime,
        recordMusterResponseCommand(
          "m4.muster.authority.creditor-fabricates",
          "player",
          runtime,
          112,
          {
            assembledTroops: 40,
            delayedTroops: 0,
            refusedTroops: 0,
            releasedTroops: 40,
            reasonCodes: ["muster.response.invalid-mixed-release"]
          }
        )
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });

    runtime = accepted(
      runtime,
      recordMusterResponseCommand("m4.muster.authority.debtor-assembles", "ai", runtime, 112, {
        assembledTroops: 40,
        delayedTroops: 0,
        refusedTroops: 0,
        releasedTroops: 0,
        reasonCodes: ["muster.response.assembled"]
      })
    );

    expect(
      submitCommandV1(
        runtime,
        recordMusterResponseCommand("m4.muster.authority.debtor-release", "ai", runtime, 112, {
          assembledTroops: 40,
          delayedTroops: 0,
          refusedTroops: 0,
          releasedTroops: 10,
          reasonCodes: ["muster.response.invalid-debtor-release"]
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "authority-denied", path: "actor.id" }
    });
    expect(
      submitCommandV1(
        runtime,
        recordMusterResponseCommand(
          "m4.muster.authority.creditor-delays-while-release",
          "player",
          runtime,
          112,
          {
            assembledTroops: 40,
            delayedTroops: 5,
            refusedTroops: 0,
            releasedTroops: 10,
            reasonCodes: ["muster.response.invalid-mixed-delay"]
          }
        )
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });
    expect(
      submitCommandV1(
        runtime,
        recordMusterResponseCommand(
          "m4.muster.authority.creditor-refuses-while-release",
          "player",
          runtime,
          112,
          {
            assembledTroops: 40,
            delayedTroops: 0,
            refusedTroops: 5,
            releasedTroops: 10,
            reasonCodes: ["muster.response.invalid-mixed-refusal"]
          }
        )
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });
    expect(
      submitCommandV1(
        runtime,
        recordMusterResponseCommand("m4.muster.authority.over-release", "player", runtime, 112, {
          assembledTroops: 40,
          delayedTroops: 0,
          refusedTroops: 0,
          releasedTroops: 41,
          reasonCodes: ["muster.response.invalid-over-release"]
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.releasedTroops" }
    });

    runtime = accepted(
      runtime,
      recordMusterResponseCommand("m4.muster.authority.creditor-release", "player", runtime, 112, {
        assembledTroops: 40,
        delayedTroops: 0,
        refusedTroops: 0,
        releasedTroops: 40,
        reasonCodes: ["muster.response.valid-creditor-release"]
      })
    );
    expect(runtime.world.state.m4?.mobilizedForceCommitments[0]).toMatchObject({
      assembledTroops: 40,
      delayedTroops: 0,
      refusedTroops: 0,
      releasedTroops: 40,
      status: "released"
    });
  });

  test("rejects illegal subjects, duplicates, over-commitment, expired obligations, wrong actors, and invalid quantities", () => {
    let runtime = runtimeWithM4();
    runtime = accepted(
      runtime,
      createMusterCommand("m4.muster.reject.create", "player", runtime, 103)
    );

    expect(
      submitCommandV1(
        runtime,
        createMusterCommand("m4.muster.reject.duplicate-id", "player", runtime, 103)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.commitmentId" }
    });
    expect(
      submitCommandV1(
        runtime,
        createMusterCommand("m4.muster.reject.duplicate-source", "player", runtime, 104)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.source.obligationId" }
    });
    expect(
      submitCommandV1(runtimeWithM4(), {
        ...createMusterCommand("m4.muster.reject.over", "player", runtimeWithM4(), 105),
        payload: {
          ...createMusterCommand("m4.muster.reject.over.payload", "player", runtimeWithM4(), 105)
            .payload,
          promisedTroops: 121
        }
      }).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.promisedTroops" }
    });
    expect(
      submitCommandV1(runtimeWithM4(), {
        ...createMusterCommand("m4.muster.reject.bad-window", "player", runtimeWithM4(), 106),
        payload: {
          ...createMusterCommand(
            "m4.muster.reject.bad-window.payload",
            "player",
            runtimeWithM4(),
            106
          ).payload,
          assemblyWindow: { earliestDay: 21, latestDay: 20 }
        }
      }).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.assemblyWindow" }
    });
    expect(
      submitCommandV1(
        runtimeWithM4(),
        createMusterCommand(
          "m4.muster.reject.wrong-actor",
          "player",
          runtimeWithM4(),
          107,
          "polity:2"
        )
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "authority-denied", path: "actor.id" }
    });
    expect(
      submitCommandV1(
        expiredRuntime(),
        createMusterCommand("m4.muster.reject.expired", "player", expiredRuntime(), 108)
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.dueDay" }
    });
    expect(
      submitCommandV1(runtimeWithM4(), {
        ...createMusterCommand("m4.muster.reject.bad-source", "player", runtimeWithM4(), 109),
        payload: {
          ...createMusterCommand(
            "m4.muster.reject.bad-source.payload",
            "player",
            runtimeWithM4(),
            109
          ).payload,
          source: { kind: "m3-obligation", obligationId: 999 }
        }
      }).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "bad-id", path: "payload.source.obligationId" }
    });
    expect(
      submitCommandV1(
        runtimeWithObligation(tributeObligation()),
        createMusterCommand(
          "m4.muster.reject.non-troop",
          "player",
          runtimeWithObligation(tributeObligation()),
          110
        )
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.source.obligationId" }
    });
    expect(
      submitCommandV1(
        runtimeWithObligation({ ...troopObligation(), status: "breached" }),
        createMusterCommand(
          "m4.muster.reject.unavailable",
          "player",
          runtimeWithObligation({ ...troopObligation(), status: "breached" }),
          111
        )
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.source.obligationId" }
    });

    const response = submitCommandV1(
      runtime,
      recordMusterResponseCommand("m4.muster.reject.response-over", "ai", runtime, 103, {
        assembledTroops: 70,
        delayedTroops: 0,
        refusedTroops: 0,
        releasedTroops: 0,
        reasonCodes: ["muster.response.over-assembled"]
      })
    );
    expect(response.result).toMatchObject({
      status: "rejected",
      error: { code: "muster-commitment-invalid", path: "payload.assembledTroops" }
    });
  });

  test("canonicalizes commitment ordering and read-only muster queries deterministically", () => {
    const first = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [campaignPlan()],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment(20), commitment(10)]
    });
    const second = canonicalizeM4CampaignStateV0({
      schemaVersion: 1,
      campaignPlans: [campaignPlan()],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: [commitment(10), commitment(20)]
    });
    expect(first).toEqual(second);

    const runtime = runtimeFromWorld(worldWithM4({ mobilizedForceCommitments: [commitment(10)] }));
    const beforeHash = runtime.world.meta.stateHash;
    const queried = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m4-muster-commitments",
      payload: { queryId: "m4.muster.query", campaignPlanId: 10 }
    });
    expect(queried.status).toBe("ok");
    if (queried.status !== "ok" || queried.result.kind !== "sim.list-m4-muster-commitments") {
      throw new Error("Expected M4 muster commitment query.");
    }
    expect(queried.result.commitments.map((entry) => entry.commitmentId)).toEqual([10]);
    expect(queried.result.reasonCodes).toEqual(["muster.query.filtered-by-campaign"]);

    const mutableReasons = queried.result.commitments[0]?.reasonCodes as string[];
    mutableReasons.push("mutated");
    expect(runtime.world.meta.stateHash).toBe(beforeHash);
    expect(hashWorldStateV0(runtime.world)).toBe(beforeHash);

    const jsonRoundTrip = JSON.parse(JSON.stringify(runtime.world)) as WorldStateV0;
    expect(validateWorldStateV0(jsonRoundTrip)).toEqual([]);
    expect(hashWorldStateV0(jsonRoundTrip)).toBe(beforeHash);
  });

  test("validates malformed M4 muster commitment fields without throwing", () => {
    const badCommitment: Record<string, unknown> = {
      ...commitment(10),
      promisedTroops: -1,
      source: { ...commitment(10).source, obligationId: "bad" },
      assemblyWindow: { earliestDay: 18, latestDay: "bad" },
      plannedAssemblyDay: -1,
      status: "not-a-status",
      statusReasonCode: "",
      reasonCodes: ["ok", ""],
      localCostHooks: [
        { kind: "loyalty-pressure", polityId: 2, pressureBps: 10_001, reasonCode: "" },
        { kind: "unknown-hook", reasonCode: "bad" }
      ]
    };
    const malformedWorld = {
      ...worldWithM4({ mobilizedForceCommitments: [] }),
      state: {
        ...worldWithM4({ mobilizedForceCommitments: [] }).state,
        m4: {
          schemaVersion: 1,
          campaignPlans: [campaignPlan()],
          factionKnowledgeSnapshots: [],
          mobilizedForceCommitments: [badCommitment]
        }
      }
    };

    expect(() => validateWorldStateV0(malformedWorld)).not.toThrow();
    expect(validateWorldStateV0(malformedWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].promisedTroops"
        }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].source.obligationId"
        }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].assemblyWindow.latestDay"
        }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].plannedAssemblyDay"
        }),
        expect.objectContaining({ path: "state.m4.mobilizedForceCommitments[0].status" }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].statusReasonCode"
        }),
        expect.objectContaining({ path: "state.m4.mobilizedForceCommitments[0].reasonCodes[1]" }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].localCostHooks[0].pressureBps"
        }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].localCostHooks[0].reasonCode"
        }),
        expect.objectContaining({
          path: "state.m4.mobilizedForceCommitments[0].localCostHooks[1].kind"
        })
      ])
    );
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
      { id: parseDistrictId(2), displayNameKey: "district.m4.vassal" }
    ],
    settlements: [],
    routes: []
  };
}

function runtimeWithM4(): SimulationRuntimeV1 {
  return runtimeFromWorld(worldWithM4({ mobilizedForceCommitments: [] }));
}

function runtimeWithObligation(
  obligation: NonNullable<WorldStateV0["state"]["m3"]>["obligations"][number]
): SimulationRuntimeV1 {
  return runtimeFromWorld(worldWithM4({ mobilizedForceCommitments: [] }, 10, obligation));
}

function expiredRuntime(): SimulationRuntimeV1 {
  return runtimeFromWorld(worldWithM4({ mobilizedForceCommitments: [] }, 30));
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
  m4: Pick<M4CampaignStateV0, "mobilizedForceCommitments">,
  currentDay = 10,
  obligation: NonNullable<WorldStateV0["state"]["m3"]>["obligations"][number] = troopObligation()
): WorldStateV0 {
  const defs = definitions();
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-muster-prep-test",
    currentDay,
    revision: 0,
    definitions: defs,
    m2: createM2EconomyPopulationStateV0(defs),
    m3: createM3PolityVassalageStateV0(defs, {
      polities: [
        { polityId: parsePolityId(1), directSuzerainPolityId: null },
        { polityId: parsePolityId(2), directSuzerainPolityId: parsePolityId(1) }
      ],
      obligations: [obligation],
      obligationAuditEvents: [troopObligationAuditEvent()],
      administrativeDistricts: [
        {
          polityId: parsePolityId(2),
          districtId: parseDistrictId(2),
          controlMode: "vassal",
          localComplexity: 50,
          communicationCost: 50,
          directness: 50,
          frontierPressure: 50,
          administrativeCapacity: 1_200
        }
      ]
    }),
    m4: createM4CampaignStateV0(defs, {
      campaignPlans: [campaignPlan()],
      factionKnowledgeSnapshots: [],
      mobilizedForceCommitments: m4.mobilizedForceCommitments
    })
  });
}

function campaignPlan(): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(2) },
    objectiveKind: "prepare",
    startWindow: { earliestDay: parseGameDay(12), latestDay: parseGameDay(30) },
    status: "planned",
    statusReasonCode: "campaign.objective.created",
    reasonCodes: ["campaign.reason.prepare-muster"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function commitment(id: number): M4CampaignStateV0["mobilizedForceCommitments"][number] {
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

function troopObligation(): NonNullable<WorldStateV0["state"]["m3"]>["obligations"][number] {
  return {
    id: parseM3ObligationId(1),
    debtorPolityId: parsePolityId(2),
    creditorPolityId: parsePolityId(1),
    obligationKind: "troop",
    obligationCategory: "troop-obligation",
    obligationSource: {
      kind: "vassalage",
      sourceId: "m4.muster.vassalage.2-to-1",
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

function tributeObligation(): NonNullable<WorldStateV0["state"]["m3"]>["obligations"][number] {
  return {
    ...troopObligation(),
    obligationKind: "tribute",
    obligationCategory: "regular-tribute",
    requirement: { kind: "amount", resourceKind: "cash", amount: 120 }
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
    commandId: "m4.muster.obligation.fixture",
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

function createMusterCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  commitmentId: number,
  actorId = "polity:1"
): CreateMusterCommitmentCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.create-muster-commitment",
    commandId,
    actor: { kind: actorKind, id: actorId },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      commitmentId,
      campaignPlanId: 10,
      source: { kind: "m3-obligation", obligationId: 1 },
      promisedTroops: 60,
      dueDay: 20,
      assemblyWindow: { earliestDay: 12, latestDay: 18 },
      reasonCodes: ["muster.reason.obligation-request"]
    }
  };
}

function recordMusterResponseCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  commitmentId: number,
  payload: {
    readonly assembledTroops: number;
    readonly delayedTroops: number;
    readonly refusedTroops: number;
    readonly releasedTroops: number;
    readonly reasonCodes: readonly string[];
  }
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
      ...payload
    }
  };
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  expect(submitted.result.status).toBe("accepted");
  return submitted.runtime;
}

import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  orderedM3ObligationAuditEventsV0,
  parseM3ObligationId,
  parsePolityId,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("M3-TRIBUTE-TROOP-OBLIGATIONS-001 obligation settlement", () => {
  test("fulfills regular tribute from explicit M2 cash source and records due-period audit", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.tribute.create", runtime));

    const cashBefore = cashTotal(runtime);
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.tribute.fulfill",
        actorKind: "player",
        runtime,
        obligationId: 1,
        fulfillmentId: 901,
        actionKind: "fulfillment",
        dueDay: 30,
        fulfilledAmount: 120,
        reasonCode: "tribute.regular.delivered"
      })
    );

    const m3 = requiredM3(runtime);
    expect(cashTotal(runtime)).toBe(cashBefore - 120);
    expect(m3.obligations[0]).toMatchObject({
      id: parseM3ObligationId(1),
      obligationCategory: "regular-tribute",
      obligationSource: {
        kind: "vassalage",
        sourceId: "m3.validation.vassalage.2-to-1",
        debtorPolityId: parsePolityId(2),
        creditorPolityId: parsePolityId(1)
      },
      accounting: {
        nominalAmount: 120,
        dueAmount: 120,
        deliveredAmount: 120,
        arrearsAmount: 0,
        defaultedAmount: 0,
        dueDay: 30,
        cycle: 1
      }
    });
    expect(m3.fulfillmentClaims).toEqual([
      expect.objectContaining({
        obligationId: parseM3ObligationId(1),
        actionKind: "fulfillment",
        dueDay: 30,
        deliveredAmount: 120,
        sourceMovements: [
          {
            kind: "m2-population-group",
            populationGroupId: 2,
            districtId: 2,
            resourceKind: "cash",
            amount: 120
          }
        ]
      })
    ]);
    expect(orderedM3ObligationAuditEventsV0(m3).map((event) => event.reasonCodes)).toEqual([
      ["obligation.created", "obligation.kind.regular-tribute"],
      [
        "obligation.action.fulfillment",
        "obligation.kind.regular-tribute",
        "obligation.reliability.admin-stable",
        "obligation.executor.character-strong"
      ]
    ]);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("fulfills troop obligation as headcount commitment without M4 campaign movement", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTroopCommand("m3.troop.create", runtime));
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.troop.commit",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 902,
        actionKind: "fulfillment",
        dueDay: 20,
        fulfilledAmount: 60,
        reasonCode: "troop.commitment.available"
      })
    );

    const m3 = requiredM3(runtime);
    expect(m3.obligations[0]?.accounting).toMatchObject({
      nominalAmount: 60,
      dueAmount: 60,
      deliveredAmount: 60,
      arrearsAmount: 0,
      troopResponseState: "committed"
    });
    expect(m3.fulfillmentClaims[0]).toMatchObject({
      actionKind: "fulfillment",
      deliveredAmount: 60,
      sourceMovements: [
        {
          kind: "m3-troop-commitment-placeholder",
          debtorPolityId: 2,
          headcount: 60
        }
      ]
    });
    expect(runtime.eventTail.at(-1)).toMatchObject({
      kind: "sim.obligation-settled",
      actionKind: "fulfillment",
      resourceKind: "troops",
      fulfilledAmount: 60
    });
  });

  test("records refusal and breach without full diplomacy or rebellion consequences", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.refusal.create", runtime));
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.refusal.record",
        actorKind: "player",
        runtime,
        obligationId: 1,
        fulfillmentId: 903,
        actionKind: "refusal",
        dueDay: 30,
        fulfilledAmount: 0,
        reasonCode: "vassal.refuses.extraordinary-levy"
      })
    );
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.breach.record",
        actorKind: "player",
        actorId: "polity:1",
        runtime,
        obligationId: 1,
        fulfillmentId: 904,
        actionKind: "default-breach",
        dueDay: 30,
        fulfilledAmount: 0,
        reasonCode: "suzerain.records.default"
      })
    );

    const obligation = requiredM3(runtime).obligations[0];
    expect(obligation).toMatchObject({
      status: "breached",
      disputeReasonCode: "vassal.refuses.extraordinary-levy",
      breachReasonCode: "suzerain.records.default",
      accounting: {
        deliveredAmount: 0,
        arrearsAmount: 120,
        defaultedAmount: 120
      }
    });
    expect(runtime.eventTail.map((event) => event.kind)).toEqual([
      "sim.obligation-created",
      "sim.obligation-settled",
      "sim.obligation-settled"
    ]);
    expect(
      orderedM3ObligationAuditEventsV0(requiredM3(runtime)).map((event) => event.eventKind)
    ).toEqual(["created", "settled", "settled"]);
  });

  test("validates malformed M3 obligation fields without throwing", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.validation.create", runtime));
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.validation.partial",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 930,
        actionKind: "partial-fulfillment",
        dueDay: 30,
        fulfilledAmount: 20,
        reasonCode: "validation"
      })
    );

    const m3 = requiredM3(runtime);
    const obligationRecord: Record<string, unknown> = { ...m3.obligations[0] };
    delete obligationRecord["obligationSource"];
    const badAuditRecord: Record<string, unknown> = {
      ...m3.obligationAuditEvents[1],
      actionKind: "not-an-action",
      dueDay: -1,
      reasonCodes: ["ok", 7],
      reliabilityBps: 10_001
    };
    const badClaimRecord: Record<string, unknown> = {
      ...m3.fulfillmentClaims[0],
      actionKind: "not-an-action",
      dueDay: -1,
      sourceMovements: [
        {
          kind: "m2-population-group",
          populationGroupId: 2,
          districtId: 2,
          resourceKind: "cash",
          amount: -1
        },
        {
          kind: "m3-troop-commitment-placeholder",
          debtorPolityId: 2,
          headcount: -1
        }
      ]
    };
    const malformedWorld = {
      ...runtime.world,
      state: {
        ...runtime.world.state,
        m3: {
          ...m3,
          obligations: [obligationRecord],
          obligationAuditEvents: [m3.obligationAuditEvents[0], badAuditRecord],
          fulfillmentClaims: [badClaimRecord]
        }
      }
    };

    expect(() => validateWorldStateV0(malformedWorld)).not.toThrow();
    expect(validateWorldStateV0(malformedWorld)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "state.m3.obligations[0].obligationSource" }),
        expect.objectContaining({ path: "state.m3.obligationAuditEvents[1].actionKind" }),
        expect.objectContaining({ path: "state.m3.obligationAuditEvents[1].dueDay" }),
        expect.objectContaining({ path: "state.m3.obligationAuditEvents[1].reasonCodes[1]" }),
        expect.objectContaining({ path: "state.m3.obligationAuditEvents[1].reliabilityBps" }),
        expect.objectContaining({ path: "state.m3.fulfillmentClaims[0].actionKind" }),
        expect.objectContaining({
          path: "state.m3.fulfillmentClaims[0].sourceMovements[0].amount"
        }),
        expect.objectContaining({
          path: "state.m3.fulfillmentClaims[0].sourceMovements[1].headcount"
        })
      ])
    );
  });

  test("underfull fulfillment is rejected while partial fulfillment can later complete the same due period", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.underfull.create", runtime));

    expect(
      submitCommandV1(
        runtime,
        settleObligationCommand({
          commandId: "m3.underfull.fulfillment",
          actorKind: "ai",
          runtime,
          obligationId: 1,
          fulfillmentId: 931,
          actionKind: "fulfillment",
          dueDay: 30,
          fulfilledAmount: 20,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-settlement-invalid", path: "payload.fulfilledAmount" }
    });

    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.underfull.partial",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 932,
        actionKind: "partial-fulfillment",
        dueDay: 30,
        fulfilledAmount: 20,
        reasonCode: "validation"
      })
    );
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.underfull.final",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 933,
        actionKind: "fulfillment",
        dueDay: 30,
        fulfilledAmount: 100,
        reasonCode: "validation"
      })
    );

    expect(requiredM3(runtime).obligations[0]?.accounting).toMatchObject({
      deliveredAmount: 120,
      arrearsAmount: 0
    });
  });

  test("deferral advances due and accounting cycle consistently", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.deferral.create", runtime));
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.deferral.record",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 934,
        actionKind: "deferral",
        dueDay: 30,
        fulfilledAmount: 0,
        reasonCode: "validation"
      })
    );

    const deferred = requiredM3(runtime).obligations[0];
    expect(deferred?.due).toMatchObject({ kind: "cadence", nextDueDay: 60 });
    expect(deferred?.accounting).toMatchObject({ dueDay: 60, cycle: 2, deliveredAmount: 0 });

    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.deferral.fulfill",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 935,
        actionKind: "fulfillment",
        dueDay: 60,
        fulfilledAmount: 120,
        reasonCode: "validation"
      })
    );
    expect(requiredM3(runtime).obligations[0]?.accounting).toMatchObject({
      dueDay: 60,
      cycle: 2,
      deliveredAmount: 120,
      arrearsAmount: 0
    });
  });

  test("partial fulfillment blocks deferral from resetting delivered accounting", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.partial-deferral.create", runtime));
    const cashBefore = cashTotal(runtime);

    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.partial-deferral.partial",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 936,
        actionKind: "partial-fulfillment",
        dueDay: 30,
        fulfilledAmount: 20,
        reasonCode: "validation"
      })
    );

    expect(
      submitCommandV1(
        runtime,
        settleObligationCommand({
          commandId: "m3.partial-deferral.deferral",
          actorKind: "ai",
          runtime,
          obligationId: 1,
          fulfillmentId: 937,
          actionKind: "deferral",
          dueDay: 30,
          fulfilledAmount: 0,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-settlement-invalid", path: "payload.actionKind" }
    });

    expect(cashTotal(runtime)).toBe(cashBefore - 20);
    expect(requiredM3(runtime).obligations[0]?.accounting).toMatchObject({
      nominalAmount: 120,
      dueAmount: 120,
      deliveredAmount: 20,
      arrearsAmount: 100
    });

    expect(
      submitCommandV1(
        runtime,
        settleObligationCommand({
          commandId: "m3.partial-deferral.overfull",
          actorKind: "ai",
          runtime,
          obligationId: 1,
          fulfillmentId: 938,
          actionKind: "fulfillment",
          dueDay: 30,
          fulfilledAmount: 120,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-settlement-invalid", path: "payload.fulfilledAmount" }
    });

    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.partial-deferral.final",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 939,
        actionKind: "fulfillment",
        dueDay: 30,
        fulfilledAmount: 100,
        reasonCode: "validation"
      })
    );

    expect(cashTotal(runtime)).toBe(cashBefore - 120);
    expect(requiredM3(runtime).obligations[0]?.accounting).toMatchObject({
      nominalAmount: 120,
      dueAmount: 120,
      deliveredAmount: 120,
      arrearsAmount: 0
    });
  });

  test("settlement actions enforce amount and resource semantics", () => {
    let zeroRuntime = bootObligationRuntime();
    zeroRuntime = accepted(zeroRuntime, createTributeCommand("m3.zero.create", zeroRuntime));
    expect(
      submitCommandV1(
        zeroRuntime,
        settleObligationCommand({
          commandId: "m3.zero.fulfillment",
          actorKind: "ai",
          runtime: zeroRuntime,
          obligationId: 1,
          fulfillmentId: 936,
          actionKind: "fulfillment",
          dueDay: 30,
          fulfilledAmount: 0,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-settlement-invalid", path: "payload.fulfilledAmount" }
    });

    for (const actionKind of ["remission", "pursuit-recovery", "default-breach"] as const) {
      let runtime = bootObligationRuntime();
      runtime = accepted(runtime, createTributeCommand(`m3.${actionKind}.create`, runtime));
      const cashBefore = cashTotal(runtime);
      runtime = accepted(
        runtime,
        settleObligationCommand({
          commandId: `m3.${actionKind}.settle`,
          actorKind: "player",
          actorId: "polity:1",
          runtime,
          obligationId: 1,
          fulfillmentId:
            actionKind === "remission" ? 937 : actionKind === "pursuit-recovery" ? 938 : 939,
          actionKind,
          dueDay: 30,
          fulfilledAmount: 0,
          reasonCode: "validation"
        })
      );
      expect(cashTotal(runtime)).toBe(cashBefore);
      expect(requiredM3(runtime).fulfillmentClaims[0]?.sourceMovements).toEqual([]);
    }
  });

  test("rejects illegal vassalage, duplicate settlement, over-resource, expired due, wrong actor, and overflow", () => {
    let runtime = bootObligationRuntime();
    expect(submitCommandV1(runtime, createIllegalTributeCommand(runtime)).result).toMatchObject({
      status: "rejected",
      error: { code: "illegal-vassalage", path: "payload.creditorPolityId" }
    });

    runtime = accepted(runtime, createTributeCommand("m3.negative.create", runtime));
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.negative.fulfill",
        actorKind: "ai",
        runtime,
        obligationId: 1,
        fulfillmentId: 905,
        actionKind: "fulfillment",
        dueDay: 30,
        fulfilledAmount: 120,
        reasonCode: "validation"
      })
    );

    expect(
      submitCommandV1(
        runtime,
        settleObligationCommand({
          commandId: "m3.negative.duplicate-cycle",
          actorKind: "ai",
          runtime,
          obligationId: 1,
          fulfillmentId: 906,
          actionKind: "fulfillment",
          dueDay: 30,
          fulfilledAmount: 1,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-obligation-settlement", path: "payload.dueDay" }
    });
    expect(
      submitCommandV1(
        runtime,
        settleObligationCommand({
          commandId: "m3.negative.wrong-actor",
          actorKind: "player",
          actorId: "polity:3",
          runtime,
          obligationId: 1,
          fulfillmentId: 907,
          actionKind: "refusal",
          dueDay: 60,
          fulfilledAmount: 0,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-actor-invalid", path: "actor.id" }
    });
    expect(
      submitCommandV1(
        runtime,
        settleObligationCommand({
          commandId: "m3.negative.expired",
          actorKind: "ai",
          runtime,
          obligationId: 1,
          fulfillmentId: 908,
          actionKind: "fulfillment",
          dueDay: 999,
          fulfilledAmount: 1,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-due-period-invalid", path: "payload.dueDay" }
    });

    const poorRuntime = bootPoorObligationRuntime();
    const withPoorObligation = accepted(
      poorRuntime,
      createTributeCommand("m3.poor.create", poorRuntime)
    );
    expect(
      submitCommandV1(
        withPoorObligation,
        settleObligationCommand({
          commandId: "m3.negative.over-resource",
          actorKind: "ai",
          runtime: withPoorObligation,
          obligationId: 1,
          fulfillmentId: 909,
          actionKind: "fulfillment",
          dueDay: 30,
          fulfilledAmount: 120,
          reasonCode: "validation"
        })
      ).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "obligation-resource-insufficient", path: "payload.fulfilledAmount" }
    });

    expect(
      submitCommandV1(runtime, {
        ...settleObligationCommand({
          commandId: "m3.negative.overflow",
          actorKind: "ai",
          runtime,
          obligationId: 1,
          fulfillmentId: 910,
          actionKind: "partial-fulfillment",
          dueDay: 60,
          fulfilledAmount: 1,
          reasonCode: "validation"
        }),
        payload: {
          ...settleObligationCommand({
            commandId: "m3.negative.overflow",
            actorKind: "ai",
            runtime,
            obligationId: 1,
            fulfillmentId: 910,
            actionKind: "partial-fulfillment",
            dueDay: 60,
            fulfilledAmount: 1,
            reasonCode: "validation"
          }).payload,
          fulfilledAmount: Number.MAX_SAFE_INTEGER + 1
        }
      }).result
    ).toMatchObject({
      status: "rejected",
      error: { code: "invalid-payload", path: "payload.fulfilledAmount" }
    });
  });

  test("property invariants preserve non-negative accounting and stable refusal reason codes", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 120 }),
        fc.constantFrom("partial-fulfillment", "refusal", "default-breach"),
        (amount, actionKind) => {
          let runtime = bootObligationRuntime();
          runtime = accepted(runtime, createTributeCommand("m3.property.create", runtime));
          const command = settleObligationCommand({
            commandId: `m3.property.${actionKind}.${amount}`,
            actorKind: "ai",
            actorId: actionKind === "default-breach" ? "polity:1" : "polity:2",
            runtime,
            obligationId: 1,
            fulfillmentId: 1_000 + amount,
            actionKind,
            dueDay: 30,
            fulfilledAmount:
              actionKind === "refusal" || actionKind === "default-breach" ? 0 : amount,
            reasonCode: "property.validation"
          });
          const submitted = submitCommandV1(runtime, command);
          if (submitted.result.status === "accepted") {
            const accounting = requiredM3(submitted.runtime).obligations[0]?.accounting;
            expect(accounting?.deliveredAmount).toBeGreaterThanOrEqual(0);
            expect(accounting?.arrearsAmount).toBeGreaterThanOrEqual(0);
            expect(accounting?.defaultedAmount).toBeGreaterThanOrEqual(0);
            expect(validateWorldStateV0(submitted.runtime.world)).toEqual([]);
          } else {
            expect(["obligation-resource-insufficient", "obligation-settlement-invalid"]).toContain(
              submitted.result.error.code
            );
          }
        }
      ),
      { numRuns: 36, seed: 1531 }
    );
  });

  test("M3 save preserves obligation settlement after duplicate settlement probe", () => {
    let runtime = bootObligationRuntime();
    runtime = accepted(runtime, createTributeCommand("m3.save.create", runtime));
    runtime = accepted(
      runtime,
      settleObligationCommand({
        commandId: "m3.save.fulfill",
        actorKind: "player",
        runtime,
        obligationId: 1,
        fulfillmentId: 911,
        actionKind: "fulfillment",
        dueDay: 30,
        fulfilledAmount: 120,
        reasonCode: "validation"
      })
    );
    const duplicate = submitCommandV1(
      runtime,
      settleObligationCommand({
        commandId: "m3.save.duplicate",
        actorKind: "player",
        runtime,
        obligationId: 1,
        fulfillmentId: 912,
        actionKind: "fulfillment",
        dueDay: 30,
        fulfilledAmount: 1,
        reasonCode: "validation"
      })
    );
    expect(duplicate.result).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-obligation-settlement", path: "payload.dueDay" }
    });
    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const m3 = saved.envelope.body.authoritativeSnapshot.state.m3;
    expect(m3?.obligations[0]?.accounting).toMatchObject({
      deliveredAmount: 120,
      arrearsAmount: 0
    });
    expect(m3?.fulfillmentClaims).toHaveLength(1);
  });
});

function bootObligationRuntime(): SimulationRuntimeV1 {
  return {
    world: createObligationWorld(false),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function bootPoorObligationRuntime(): SimulationRuntimeV1 {
  return {
    world: createObligationWorld(true),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createObligationWorld(poor: boolean): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.validation.suzerain" }),
      definePolity({ id: 2, displayNameKey: "content.m3.validation.vassal" }),
      definePolity({ id: 3, displayNameKey: "content.m3.validation.unrelated" })
    ],
    persons: [
      definePerson({ id: 1, displayNameKey: "content.m3.validation.executor_strong" }),
      definePerson({ id: 2, displayNameKey: "content.m3.validation.executor_weak" })
    ],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.validation.capital" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.validation.vassal_district" })
    ],
    settlements: [],
    routes: []
  };
  const m2 = createM2EconomyPopulationStateV0(definitions);

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.obligation.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m2: poor
      ? {
          ...m2,
          populationGroups: m2.populationGroups.map((group) =>
            group.districtId === 2 ? { ...group, cashStock: 10, grainStock: 10 } : group
          )
        }
      : m2,
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: 1 },
        { polityId: 3, directSuzerainPolityId: null }
      ],
      administrativeDistricts: [
        {
          polityId: 2,
          districtId: 2,
          controlMode: "vassal",
          localComplexity: 50,
          communicationCost: 50,
          directness: 50,
          frontierPressure: 50,
          administrativeCapacity: 1_200
        }
      ],
      characters: [
        {
          characterId: 1,
          polityId: 2,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 8_000,
          administrationBps: 8_000,
          diplomacyBps: 7_000
        },
        {
          characterId: 2,
          polityId: 2,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 2_000,
          administrationBps: 2_000,
          diplomacyBps: 2_000
        }
      ]
    })
  });
}

function createTributeCommand(commandId: string, runtime: SimulationRuntimeV1): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.create-obligation",
    commandId,
    actor: { kind: "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      debtorPolityId: 2,
      creditorPolityId: 1,
      obligationKind: "tribute",
      obligationCategory: "regular-tribute",
      obligationSource: { kind: "vassalage", sourceId: "m3.validation.vassalage.2-to-1" },
      requirement: { kind: "amount", resourceKind: "cash", amount: 120 },
      due: { kind: "cadence", periodDays: 30, nextDueDay: 30 }
    }
  };
}

function createTroopCommand(commandId: string, runtime: SimulationRuntimeV1): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.create-obligation",
    commandId,
    actor: { kind: "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      debtorPolityId: 2,
      creditorPolityId: 1,
      obligationKind: "troop",
      obligationCategory: "troop-obligation",
      obligationSource: { kind: "vassalage", sourceId: "m3.validation.vassalage.2-to-1" },
      requirement: { kind: "amount", resourceKind: "troops", amount: 60 },
      due: { kind: "cadence", periodDays: 20, nextDueDay: 20 }
    }
  };
}

function createIllegalTributeCommand(runtime: SimulationRuntimeV1): GameCommandV1 {
  return {
    ...createTributeCommand("m3.illegal-vassalage", runtime),
    payload: {
      ...createTributeCommand("m3.illegal-vassalage", runtime).payload,
      debtorPolityId: 3,
      creditorPolityId: 1,
      obligationSource: { kind: "vassalage", sourceId: "m3.validation.no-vassalage.3-to-1" }
    }
  };
}

function settleObligationCommand(input: {
  readonly commandId: string;
  readonly actorKind: "ai" | "player";
  readonly actorId?: string;
  readonly runtime: SimulationRuntimeV1;
  readonly obligationId: number;
  readonly fulfillmentId: number;
  readonly actionKind:
    | "fulfillment"
    | "partial-fulfillment"
    | "deferral"
    | "refusal"
    | "remission"
    | "pursuit-recovery"
    | "default-breach";
  readonly dueDay: number;
  readonly fulfilledAmount: number;
  readonly reasonCode: string;
}): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.record-obligation-fulfillment",
    commandId: input.commandId,
    actor: { kind: input.actorKind, id: input.actorId ?? "polity:2" },
    expectedDay: input.runtime.world.meta.currentDay,
    expectedRevision: input.runtime.world.meta.revision,
    payload: {
      obligationId: input.obligationId,
      fulfillmentId: input.fulfillmentId,
      actionKind: input.actionKind,
      dueDay: input.dueDay,
      fulfilledAmount: input.fulfilledAmount,
      reasonCode: input.reasonCode,
      executorCharacterId: 1,
      officeId: null
    }
  };
}

function requiredM3(runtime: SimulationRuntimeV1) {
  const m3 = runtime.world.state.m3;
  if (m3 === undefined) {
    throw new Error("Expected M3 state.");
  }
  return m3;
}

function cashTotal(runtime: SimulationRuntimeV1): number {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    throw new Error("Expected M2 state.");
  }
  return m2.populationGroups.reduce((total, group) => total + group.cashStock, 0);
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  if (submitted.result.status === "rejected") {
    throw new Error(JSON.stringify(submitted.result.error));
  }
  expect(submitted.result).toMatchObject({ status: "accepted" });
  return submitted.runtime;
}

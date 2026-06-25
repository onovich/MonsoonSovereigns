import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  computeM3AdministrativeBurdenProfileV0,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createWorldStateV0,
  defineDistrict,
  definePolity,
  querySimulationV1,
  orderedM3ObligationAuditEventsV0,
  parseM3FulfillmentId,
  parseM3ObligationId,
  parsePolityId,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("M3-POLITY-VASSALAGE-001 polity and vassalage substrate", () => {
  test("rejects cyclic suzerain chains while player and AI use the same command path", () => {
    let playerRuntime = bootM3Runtime();
    let aiRuntime = bootM3Runtime();

    playerRuntime = accepted(
      playerRuntime,
      setSuzerainCommand("m3.suzerain.player.1", "player", playerRuntime, 1, 2)
    );
    aiRuntime = accepted(aiRuntime, setSuzerainCommand("m3.suzerain.ai.1", "ai", aiRuntime, 1, 2));
    expect(playerRuntime.world.meta.stateHash).toBe(aiRuntime.world.meta.stateHash);

    playerRuntime = accepted(
      playerRuntime,
      setSuzerainCommand("m3.suzerain.player.2", "player", playerRuntime, 2, 3)
    );

    const rejected = submitCommandV1(
      playerRuntime,
      setSuzerainCommand("m3.suzerain.cycle", "ai", playerRuntime, 3, 1)
    );
    expect(rejected.result).toMatchObject({
      status: "rejected",
      error: { code: "acyclicity-violation", path: "payload.directSuzerainPolityId" }
    });
    expect(rejected.runtime.world.meta.stateHash).toBe(playerRuntime.world.meta.stateHash);
  });

  test("keeps obligation audit order stable and prevents fulfillment double counting", () => {
    let runtime = bootM3Runtime();
    runtime = accepted(runtime, setSuzerainCommand("m3.obligation.suzerain.1", "player", runtime, 1, 2));
    runtime = accepted(runtime, setSuzerainCommand("m3.obligation.suzerain.2", "player", runtime, 2, 3));
    runtime = accepted(
      runtime,
      createObligationCommand("m3.obligation.create.1", "player", runtime, 1, 2, 100)
    );
    runtime = accepted(
      runtime,
      createObligationCommand("m3.obligation.create.2", "ai", runtime, 2, 3, 50)
    );
    runtime = accepted(
      runtime,
      recordFulfillmentCommand("m3.obligation.fulfill.1", "player", runtime, 1, 900, 40)
    );

    const duplicate = submitCommandV1(
      runtime,
      recordFulfillmentCommand("m3.obligation.fulfill.duplicate", "ai", runtime, 2, 900, 20)
    );
    expect(duplicate.result).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-fulfillment", path: "payload.fulfillmentId" }
    });

    const m3 = runtime.world.state.m3;
    expect(m3).toBeDefined();
    if (m3 === undefined) {
      throw new Error("Expected M3 state.");
    }

    expect(m3.obligations[0]).toMatchObject({
      id: parseM3ObligationId(1),
      debtorPolityId: parsePolityId(1),
      creditorPolityId: parsePolityId(2),
      status: "active",
      requirement: { kind: "amount", amount: 100 },
      due: { kind: "cadence", periodDays: 90 }
    });
    expect(m3.fulfillmentClaims).toEqual([
      {
        fulfillmentId: parseM3FulfillmentId(900),
        obligationId: parseM3ObligationId(1),
        auditEventId: 3,
        actionKind: "partial-fulfillment",
        dueDay: 90,
        fulfilledAmount: 40,
        deliveredAmount: 40,
        arrearsAmount: 60,
        defaultedAmount: 0,
        reasonCode: "validation",
        sourceMovements: [
          {
            kind: "m2-population-group",
            populationGroupId: 1,
            districtId: 1,
            resourceKind: "cash",
            amount: 40
          }
        ]
      }
    ]);
    expect(orderedM3ObligationAuditEventsV0(m3).map((event) => event.id)).toEqual([1, 2, 3]);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("requestSaveV1 rejects M3 state before emitting unloadable save bytes", () => {
    let runtime = bootM3Runtime();
    runtime = accepted(runtime, setSuzerainCommand("m3.obligation.save-suzerain", "player", runtime, 1, 2));
    runtime = accepted(
      runtime,
      createObligationCommand("m3.obligation.save-probe", "player", runtime, 1, 2, 100)
    );

    expect(runtime.world.state.m3).toBeDefined();
    expect(runtime.eventTail.map((event) => event.kind)).toEqual([
      "sim.polity-suzerain-changed",
      "sim.obligation-created"
    ]);
    expect(() =>
      requestSaveV1(runtime, {
        appVersion: "0.0.0",
        source: "test",
        codecVersion: "save-envelope-v1"
      })
    ).toThrow(
      "requestSaveV1 does not support WorldState state.m3; refusing to emit incompatible save bytes."
    );
  });

  test("canonicalizes unordered obligation audit history with deterministic tie-breakers", () => {
    const first = createM3WorldWithAuditOrder([3, 1, 2]);
    const second = createM3WorldWithAuditOrder([1, 2, 3]);

    expect(orderedM3ObligationAuditEventsV0(first.state.m3).map((event) => event.id)).toEqual([
      1, 2, 3
    ]);
    expect(first.meta.stateHash).toBe(second.meta.stateHash);
    expect(validateWorldStateV0(first)).toEqual([]);
  });

  test("property invariants preserve acyclic suzerain chains and district controller validity", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 3 }), { minLength: 3, maxLength: 3 }),
        (raw) => {
          let runtime = bootM3Runtime();

          for (let index = 0; index < raw.length; index += 1) {
            const polityId = index + 1;
            const suzerainId = raw[index] === 0 ? null : raw[index];
            const submitted = submitCommandV1(
              runtime,
              setSuzerainCommand(
                `m3.property.suzerain.${index}`,
                "ai",
                runtime,
                polityId,
                suzerainId
              )
            );
            if (submitted.result.status === "accepted") {
              runtime = submitted.runtime;
            } else {
              expect(submitted.result.error.code).toBe("acyclicity-violation");
            }

            expect(validateWorldStateV0(runtime.world)).toEqual([]);
          }

          for (const district of runtime.world.state.districts) {
            if (district.control.kind === "controlled") {
              expect([1, 2, 3]).toContain(district.control.controllerPolityId);
            }
          }
        }
      ),
      { numRuns: 24, seed: 1531 }
    );
  });

  test("computes monotonic administrative load from explicit serializable inputs", () => {
    fc.assert(
      fc.property(
        fc.record({
          localComplexity: fc.integer({ min: 0, max: 400 }),
          communicationCost: fc.integer({ min: 0, max: 400 }),
          directness: fc.integer({ min: 0, max: 400 }),
          frontierPressure: fc.integer({ min: 0, max: 400 }),
          bump: fc.integer({ min: 1, max: 200 })
        }),
        (input) => {
          const base = computeM3AdministrativeBurdenProfileV0({
            polityId: parsePolityId(1),
            districtId: 1,
            controlMode: "direct",
            localComplexity: input.localComplexity,
            communicationCost: input.communicationCost,
            directness: input.directness,
            frontierPressure: input.frontierPressure,
            administrativeCapacity: 1_000
          });
          const higher = computeM3AdministrativeBurdenProfileV0({
            polityId: parsePolityId(1),
            districtId: 1,
            controlMode: "direct",
            localComplexity: input.localComplexity + input.bump,
            communicationCost: input.communicationCost + input.bump,
            directness: input.directness + input.bump,
            frontierPressure: input.frontierPressure + input.bump,
            administrativeCapacity: 1_000
          });

          expect(higher.administrativeLoad).toBeGreaterThanOrEqual(base.administrativeLoad);
          expect(higher.overload).toBeGreaterThanOrEqual(base.overload);
          expect(higher.efficiencyBps).toBeLessThanOrEqual(base.efficiencyBps);
        }
      ),
      { numRuns: 48, seed: 1531 }
    );
  });

  test("exposes distinct direct, vassal, and tribute-only administrative burden profiles", () => {
    const runtime = bootM3RuntimeWithAdministration([
      {
        polityId: 1,
        districtId: 1,
        controlMode: "direct",
        localComplexity: 280,
        communicationCost: 190,
        directness: 260,
        frontierPressure: 170,
        administrativeCapacity: 1_000
      },
      {
        polityId: 1,
        districtId: 2,
        controlMode: "vassal",
        localComplexity: 280,
        communicationCost: 190,
        directness: 260,
        frontierPressure: 170,
        administrativeCapacity: 1_000
      },
      {
        polityId: 1,
        districtId: 3,
        controlMode: "tribute-only",
        localComplexity: 280,
        communicationCost: 190,
        directness: 260,
        frontierPressure: 170,
        administrativeCapacity: 1_000
      }
    ]);

    const queried = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m3-administrative-burden"
    });
    expect(queried.status).toBe("ok");
    if (queried.status !== "ok" || queried.result.kind !== "sim.list-m3-administrative-burden") {
      throw new Error("Expected administrative burden query result.");
    }

    const direct = queried.result.districts[0];
    const vassal = queried.result.districts[1];
    const tribute = queried.result.districts[2];
    expect(direct?.controlMode).toBe("direct");
    expect(vassal?.controlMode).toBe("vassal");
    expect(tribute?.controlMode).toBe("tribute-only");
    expect(direct?.administrativeLoad).toBeGreaterThan(vassal?.administrativeLoad ?? 0);
    expect(vassal?.administrativeLoad).toBeGreaterThan(tribute?.administrativeLoad ?? 0);
    expect(direct?.realizableIncomeBps).toBeGreaterThan(vassal?.realizableIncomeBps ?? 0);
    expect(vassal?.realizableIncomeBps).toBeGreaterThan(tribute?.realizableIncomeBps ?? 0);
  });

  test("administrative overload changes scaffold signals without mutating resources", () => {
    const lowLoadRuntime = bootM3RuntimeWithAdministration([
      {
        polityId: 1,
        districtId: 1,
        controlMode: "direct",
        localComplexity: 50,
        communicationCost: 40,
        directness: 60,
        frontierPressure: 30,
        administrativeCapacity: 1_500
      }
    ]);
    const overloadedRuntime = bootM3RuntimeWithAdministration([
      {
        polityId: 1,
        districtId: 1,
        controlMode: "direct",
        localComplexity: 500,
        communicationCost: 450,
        directness: 420,
        frontierPressure: 390,
        administrativeCapacity: 800
      }
    ]);

    const lowStock = resourceTotals(lowLoadRuntime);
    const overloadedStock = resourceTotals(overloadedRuntime);
    const lowHash = lowLoadRuntime.world.meta.stateHash;
    const overloadedHash = overloadedRuntime.world.meta.stateHash;
    const lowQuery = querySimulationV1(lowLoadRuntime, {
      schemaVersion: 1,
      kind: "sim.list-m3-administrative-burden"
    });
    const overloadedQuery = querySimulationV1(overloadedRuntime, {
      schemaVersion: 1,
      kind: "sim.list-m3-administrative-burden"
    });

    expect(resourceTotals(lowLoadRuntime)).toEqual(lowStock);
    expect(resourceTotals(overloadedRuntime)).toEqual(overloadedStock);
    expect(lowLoadRuntime.world.meta.stateHash).toBe(lowHash);
    expect(overloadedRuntime.world.meta.stateHash).toBe(overloadedHash);
    expect(lowQuery.status).toBe("ok");
    expect(overloadedQuery.status).toBe("ok");
    if (
      lowQuery.status !== "ok" ||
      overloadedQuery.status !== "ok" ||
      lowQuery.result.kind !== "sim.list-m3-administrative-burden" ||
      overloadedQuery.result.kind !== "sim.list-m3-administrative-burden"
    ) {
      throw new Error("Expected administrative burden query results.");
    }

    const low = lowQuery.result.districts[0];
    const overloaded = overloadedQuery.result.districts[0];
    expect(overloaded?.overload).toBeGreaterThan(low?.overload ?? 0);
    expect(overloaded?.realizableIncomeBps).toBeLessThan(low?.realizableIncomeBps ?? 0);
    expect(overloaded?.obligationReliabilityBps).toBeLessThan(low?.obligationReliabilityBps ?? 0);
    expect(overloaded?.readinessBps).toBeLessThan(low?.readinessBps ?? 0);
  });

  test("canonicalizes administrative burden rows with deterministic stable ID ordering", () => {
    const first = createM3WorldWithAdministrationRows([
      {
        polityId: 1,
        districtId: 3,
        controlMode: "tribute-only",
        localComplexity: 20,
        communicationCost: 30,
        directness: 40,
        frontierPressure: 50,
        administrativeCapacity: 1_000
      },
      {
        polityId: 1,
        districtId: 1,
        controlMode: "direct",
        localComplexity: 20,
        communicationCost: 30,
        directness: 40,
        frontierPressure: 50,
        administrativeCapacity: 1_000
      }
    ]);
    const second = createM3WorldWithAdministrationRows([
      {
        polityId: 1,
        districtId: 1,
        controlMode: "direct",
        localComplexity: 20,
        communicationCost: 30,
        directness: 40,
        frontierPressure: 50,
        administrativeCapacity: 1_000
      },
      {
        polityId: 1,
        districtId: 3,
        controlMode: "tribute-only",
        localComplexity: 20,
        communicationCost: 30,
        directness: 40,
        frontierPressure: 50,
        administrativeCapacity: 1_000
      }
    ]);

    expect(first.meta.stateHash).toBe(second.meta.stateHash);
    expect(validateWorldStateV0(first)).toEqual([]);
  });
});

function bootM3Runtime(): SimulationRuntimeV1 {
  const world = createM3WorldWithAuditOrder([]);
  return {
    world,
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createM3WorldWithAuditOrder(auditEventIds: readonly number[]): WorldStateV0 {
  return createM3WorldWithAdministrationRows([], auditEventIds);
}

function createM3WorldWithAdministrationRows(
  administrativeDistricts: readonly {
    readonly polityId: number;
    readonly districtId: number;
    readonly controlMode: "direct" | "vassal" | "tribute-only";
    readonly localComplexity: number;
    readonly communicationCost: number;
    readonly directness: number;
    readonly frontierPressure: number;
    readonly administrativeCapacity: number;
  }[],
  auditEventIds: readonly number[] = []
): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.validation.polity_001" }),
      definePolity({ id: 2, displayNameKey: "content.m3.validation.polity_002" }),
      definePolity({ id: 3, displayNameKey: "content.m3.validation.polity_003" })
    ],
    persons: [],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.validation.district_001" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.validation.district_002" }),
      defineDistrict({ id: 3, displayNameKey: "content.m3.validation.district_003" })
    ],
    settlements: [],
    routes: []
  };

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: null },
        { polityId: 3, directSuzerainPolityId: null }
      ],
      obligations:
        auditEventIds.length === 0
          ? []
          : [
              {
                id: 1,
                debtorPolityId: 1,
                creditorPolityId: 2,
                obligationKind: "tribute",
                obligationCategory: "regular-tribute",
                obligationSource: {
                  kind: "vassalage",
                  sourceId: "m3.validation.vassalage.1-to-2",
                  debtorPolityId: 1,
                  creditorPolityId: 2
                },
                status: "active",
                requirement: { kind: "amount", resourceKind: "cash", amount: 100 },
                due: { kind: "cadence", periodDays: 90, nextDueDay: 90 },
                accounting: {
                  nominalAmount: 100,
                  dueAmount: 100,
                  deliveredAmount: 40,
                  arrearsAmount: 60,
                  defaultedAmount: 0,
                  remittedAmount: 0,
                  dueDay: 90,
                  cycle: 1,
                  troopResponseState: "none"
                },
                disputeReasonCode: null,
                breachReasonCode: null,
                createdAuditEventId: 1,
                latestAuditEventId: 3
              }
            ],
      administrativeDistricts:
        administrativeDistricts.length === 0
          ? [
              {
                polityId: 1,
                districtId: 1,
                controlMode: "vassal",
                localComplexity: 50,
                communicationCost: 50,
                directness: 50,
                frontierPressure: 50,
                administrativeCapacity: 1_000
              }
            ]
          : administrativeDistricts,
      obligationAuditEvents: auditEventIds.map((id) => ({
        id,
        obligationId: 1,
        eventKind: id === 3 ? "settled" : id === 2 ? "status-changed" : "created",
        eventDay: 0,
        eventRevision: 0,
        commandId: `m3.audit.${id}`,
        actor: { kind: "system", id: "validation" },
        fulfillmentId: id === 3 ? 900 : null,
        fulfilledAmount: id === 3 ? 40 : null,
        actionKind: id === 3 ? "partial-fulfillment" : null,
        dueDay: id === 3 ? 90 : null,
        statusAfter: "active",
        reasonCode: null,
        reasonCodes: ["validation"],
        reliabilityBps: 10_000
      })),
      fulfillmentClaims:
        auditEventIds.length === 0
          ? []
          : [
              {
                fulfillmentId: 900,
                obligationId: 1,
                auditEventId: 3,
                actionKind: "partial-fulfillment",
                dueDay: 90,
                fulfilledAmount: 40,
                deliveredAmount: 40,
                arrearsAmount: 60,
                defaultedAmount: 0,
                reasonCode: "validation",
                sourceMovements: []
              }
            ]
    })
  });
}

function bootM3RuntimeWithAdministration(
  administrativeDistricts: readonly {
    readonly polityId: number;
    readonly districtId: number;
    readonly controlMode: "direct" | "vassal" | "tribute-only";
    readonly localComplexity: number;
    readonly communicationCost: number;
    readonly directness: number;
    readonly frontierPressure: number;
    readonly administrativeCapacity: number;
  }[]
): SimulationRuntimeV1 {
  return {
    world: createM3WorldWithAdministrationRows(administrativeDistricts),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function resourceTotals(runtime: SimulationRuntimeV1): {
  readonly grain: number;
  readonly cash: number;
} {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    throw new Error("Expected M2 state.");
  }
  return m2.populationGroups.reduce(
    (totals, group) => ({
      grain: totals.grain + group.grainStock,
      cash: totals.cash + group.cashStock
    }),
    { grain: 0, cash: 0 }
  );
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  expect(submitted.result.status).toBe("accepted");
  return submitted.runtime;
}

function setSuzerainCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  polityId: number,
  directSuzerainPolityId: number | null
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.set-polity-suzerain",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m3` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      polityId,
      directSuzerainPolityId,
      reasonCode: "validation-change"
    }
  };
}

function createObligationCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  debtorPolityId: number,
  creditorPolityId: number,
  amount: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.create-obligation",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m3` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      debtorPolityId,
      creditorPolityId,
      obligationKind: "tribute",
      obligationCategory: "regular-tribute",
      obligationSource: {
        kind: "vassalage",
        sourceId: `m3.validation.vassalage.${debtorPolityId}-to-${creditorPolityId}`
      },
      requirement: { kind: "amount", resourceKind: "cash", amount },
      due: { kind: "cadence", periodDays: 90, nextDueDay: 90 }
    }
  };
}

function recordFulfillmentCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  obligationId: number,
  fulfillmentId: number,
  fulfilledAmount: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.record-obligation-fulfillment",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      obligationId,
      fulfillmentId,
      actionKind: "partial-fulfillment",
      dueDay: 90,
      fulfilledAmount,
      reasonCode: "validation",
      executorCharacterId: null,
      officeId: null
    }
  };
}

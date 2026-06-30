import { describe, expect, test } from "vitest";

import {
  parseRuntimeM6PolicyEventContentPackV0,
  type RuntimeM6PolicyEventContentPackV0
} from "../packages/content-runtime/src/index";
import {
  validateM6PolicyEventDefinitionSetSourceV0,
  type M6PolicyEventDefinitionSetSourceV0
} from "../packages/content-schema/src/index";
import {
  bootSimulationV1,
  createM6PolicyEventRuntimeStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  defineRoute,
  defineSettlement,
  loadSaveV1,
  parseGameDay,
  parseM6PolicyDefinitionId,
  parseM6PolicyEventDefinitionId,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type M6PolicyEventRuntimeStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0
} from "../packages/sim-core/src/index";

import type { AuthoritativeGameCommandV1 } from "../packages/protocol/src/index";

type GameCommandV1 = AuthoritativeGameCommandV1;

describe("M6-POLICY-EVENT-RUNTIME-001 policy/event runtime substrate", () => {
  test("content schema and boot boundary reject malformed definition injection", () => {
    const source = validPolicyEventSource();
    const firstEvent = requiredFirstEvent(source);
    const malformedSource = {
      ...source,
      events: [
        {
          ...firstEvent,
          callback: "return Math.random();"
        }
      ]
    };

    expect(validateM6PolicyEventDefinitionSetSourceV0(malformedSource)).toContainEqual({
      path: "events[0].callback",
      message: "Unexpected field."
    });
    expect(() => parseRuntimeM6PolicyEventContentPackV0(malformedSource)).toThrow(
      /events\[0\]\.callback/u
    );

    const injectedRuntimePack = {
      ...runtimeWorldPack(parseRuntimeM6PolicyEventContentPackV0(source)),
      m6PolicyEvents: {
        ...parseRuntimeM6PolicyEventContentPackV0(source),
        events: [
          {
            ...firstEvent,
            hiddenCallback: "mutate-world-state"
          }
        ]
      }
    };
    const rejected = submitBoot(injectedRuntimePack);
    expect(rejected).toEqual({
      status: "rejected",
      error: {
        code: "invalid-content-pack",
        path: "runtimeContentPack.m6PolicyEvents.events[0].hiddenCallback",
        message: "M6 policy/event runtime field is not allowed."
      }
    });
  });

  test("controlled runtime content pack boots explicit versioned policy/event state", () => {
    const policyPack = parseRuntimeM6PolicyEventContentPackV0(validPolicyEventSource());
    const booted = submitBoot(runtimeWorldPack(policyPack));
    expect(booted.status).toBe("booted");
    if (booted.status !== "booted") {
      throw new Error("Expected M6 policy/event runtime pack to boot.");
    }

    expect(booted.runtime.world.state.m6PolicyEvents).toMatchObject({
      schemaVersion: 1,
      nextEventInstanceId: 1,
      nextModifierId: 1
    });
    expect(booted.runtime.world.state.m6PolicyEvents?.definitions.events).toHaveLength(2);
    expect(validateWorldStateV0(booted.runtime.world)).toEqual([]);
  });

  test("scheduler activates due events in deterministic definition order", () => {
    const first = accepted(bootPolicyRuntime(), advanceDayCommand("m6.policy.advance.1", 0, 0));
    const second = accepted(bootPolicyRuntime(), advanceDayCommand("m6.policy.advance.1", 0, 0));

    expect(first.world.meta.stateHash).toBe(second.world.meta.stateHash);
    expect(first.world.state.m6PolicyEvents?.activeEvents).toEqual([
      {
        eventInstanceId: 1,
        eventDefinitionId: 1,
        activatedDay: 1,
        causeReasonCodes: ["policy.event.cause.day-one"]
      },
      {
        eventInstanceId: 2,
        eventDefinitionId: 2,
        activatedDay: 1,
        causeReasonCodes: ["policy.event.cause.day-one"]
      }
    ]);
  });

  test("player and AI choose policy-event options through the same GameCommand path", () => {
    const playerRuntime = accepted(
      accepted(bootPolicyRuntime(), advanceDayCommand("m6.policy.player.advance", 0, 0)),
      choosePolicyOptionCommand("m6.policy.player.choose", "player", 1, 1, 1, 1)
    );
    const aiRuntime = accepted(
      accepted(bootPolicyRuntime(), advanceDayCommand("m6.policy.ai.advance", 0, 0)),
      choosePolicyOptionCommand("m6.policy.ai.choose", "ai", 1, 1, 1, 1)
    );

    expect(playerRuntime.world.meta.stateHash).toBe(aiRuntime.world.meta.stateHash);
    expect(playerRuntime.world.state.m6PolicyEvents?.activeEvents).toEqual([
      {
        eventInstanceId: 2,
        eventDefinitionId: 2,
        activatedDay: 1,
        causeReasonCodes: ["policy.event.cause.day-one"]
      }
    ]);
    expect(playerRuntime.world.state.m6PolicyEvents?.resolvedEvents).toEqual([
      {
        eventInstanceId: 1,
        eventDefinitionId: 1,
        selectedOptionId: 1,
        resolvedDay: 1,
        reasonCodes: [
          "policy.event.choice.accept",
          "policy.event.command.choose",
          "policy.event.consequence.harbor-duty",
          "policy.event.definition.harbor",
          "policy.event.option.accept"
        ]
      }
    ]);
    expect(playerRuntime.world.state.m6PolicyEvents?.policyModifiers).toEqual([
      {
        modifierId: 1,
        policyId: 1,
        eventInstanceId: 1,
        magnitudeBps: 250,
        startDay: 1,
        endDay: 31,
        reasonCode: "policy.event.consequence.harbor-duty"
      }
    ]);
    expect(playerRuntime.eventTail.at(-1)).toMatchObject({
      kind: "sim.m6-policy-event-option-chosen",
      causeReasonCodes: ["policy.event.cause.day-one"],
      optionReasonCodes: ["policy.event.choice.accept", "policy.event.option.accept"],
      consequenceReasonCodes: ["policy.event.consequence.harbor-duty"],
      encyclopediaRefs: [
        "encyclopedia.m6.policy_event.harbor",
        "encyclopedia.m6.policy_event.harbor.accept"
      ]
    });
  });

  test("save/load round-trip preserves policy/event state and rejects malformed slices", () => {
    let runtime = bootPolicyRuntime();
    runtime = accepted(runtime, advanceDayCommand("m6.policy.save.advance", 0, 0));
    runtime = accepted(
      runtime,
      choosePolicyOptionCommand("m6.policy.save.choose", "player", 1, 1, 1, 1)
    );

    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(bootPolicyRuntime(), saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected M6 policy/event save to load.");
    }
    expect(loaded.runtime.world.state.m6PolicyEvents).toEqual(runtime.world.state.m6PolicyEvents);

    const malformed = loadSaveV1(
      bootPolicyRuntime(),
      rewriteSaveM6PolicyEventsWithValidChecksum(saved.bytes, { activeEvents: "bad" }),
      {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      }
    );
    expect(malformed.status).toBe("rejected");
    if (malformed.status !== "rejected") {
      throw new Error("Expected malformed M6 policy/event save to reject.");
    }
    expect(malformed.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m6PolicyEvents.activeEvents",
      message: "M6 active events must be an array."
    });
  });
});

function submitBoot(runtimeContentPack: unknown): ReturnType<typeof bootSimulationV1> {
  return bootSimulationV1({
    protocolVersion: 1,
    source: "runtime-content-pack",
    seed: 1531,
    runtimeContentPack
  });
}

function bootPolicyRuntime(): SimulationRuntimeV1 {
  return {
    world: createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.m6.policy.event.validation",
      currentDay: 0,
      revision: 0,
      definitions: basicWorldDefinitions(),
      m6PolicyEvents: policyEventRuntimeState()
    }),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function accepted(runtime: SimulationRuntimeV1, command: GameCommandV1): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  expect(submitted.result.status).toBe("accepted");
  if (submitted.result.status !== "accepted") {
    throw new Error(`Expected command to accept: ${submitted.result.error.code}`);
  }
  return submitted.runtime;
}

function advanceDayCommand(
  commandId: string,
  expectedDay: number,
  expectedRevision: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.advance-day",
    commandId,
    actor: { kind: "system", id: "m6-policy-event-scheduler-test" },
    expectedDay,
    expectedRevision
  };
}

function choosePolicyOptionCommand(
  commandId: string,
  actorKind: "ai" | "player",
  expectedDay: number,
  expectedRevision: number,
  eventInstanceId: number,
  optionId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.choose-policy-event-option",
    commandId,
    actor: { kind: actorKind, id: "polity:1" },
    expectedDay,
    expectedRevision,
    payload: {
      eventInstanceId,
      optionId,
      reasonCode: "policy.event.command.choose"
    }
  };
}

function policyEventRuntimeState(): M6PolicyEventRuntimeStateV0 {
  return createM6PolicyEventRuntimeStateV0({
    definitions: {
      policies: [
        {
          policyId: parseM6PolicyDefinitionId(1),
          sourceId: "m6.policy-event.harbor-duty",
          displayNameKey: "content.m6.policy-event.harbor_duty",
          reasonCodes: ["policy.event.policy.harbor-duty"],
          encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor_duty"]
        }
      ],
      events: [
        {
          eventDefinitionId: parseM6PolicyEventDefinitionId(2),
          sourceId: "m6.policy-event.market-charter",
          displayNameKey: "content.m6.policy-event.market_charter",
          cause: {
            kind: "day-at-least",
            day: parseGameDay(1),
            reasonCodes: ["policy.event.cause.day-one"]
          },
          options: [
            {
              optionId: 1,
              displayNameKey: "content.m6.policy-event.market_charter.accept",
              consequences: [
                {
                  kind: "policy-modifier",
                  policyId: parseM6PolicyDefinitionId(1),
                  magnitudeBps: 100,
                  durationDays: 20,
                  reasonCode: "policy.event.consequence.market-duty"
                }
              ],
              reasonCodes: ["policy.event.option.accept"],
              encyclopediaRefs: ["encyclopedia.m6.policy_event.market.accept"]
            }
          ],
          reasonCodes: ["policy.event.definition.market"],
          encyclopediaRefs: ["encyclopedia.m6.policy_event.market"]
        },
        {
          eventDefinitionId: parseM6PolicyEventDefinitionId(1),
          sourceId: "m6.policy-event.harbor-charter",
          displayNameKey: "content.m6.policy-event.harbor_charter",
          cause: {
            kind: "day-at-least",
            day: parseGameDay(1),
            reasonCodes: ["policy.event.cause.day-one"]
          },
          options: [
            {
              optionId: 1,
              displayNameKey: "content.m6.policy-event.harbor_charter.accept",
              consequences: [
                {
                  kind: "policy-modifier",
                  policyId: parseM6PolicyDefinitionId(1),
                  magnitudeBps: 250,
                  durationDays: 30,
                  reasonCode: "policy.event.consequence.harbor-duty"
                }
              ],
              reasonCodes: ["policy.event.option.accept", "policy.event.choice.accept"],
              encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor.accept"]
            }
          ],
          reasonCodes: ["policy.event.definition.harbor"],
          encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor"]
        }
      ]
    }
  });
}

function validPolicyEventSource(): M6PolicyEventDefinitionSetSourceV0 {
  return {
    schemaVersion: 1,
    kind: "m6.policy-event-definition-set",
    fixtureId: "m6.policy-event.validation",
    manifestHash: "a1b2c3d4",
    policies: [
      {
        policyId: 1,
        sourceId: "m6.policy-event.harbor-duty",
        displayNameKey: "content.m6.policy-event.harbor_duty",
        reasonCodes: ["policy.event.policy.harbor-duty"],
        encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor_duty"]
      }
    ],
    events: [
      {
        eventDefinitionId: 1,
        sourceId: "m6.policy-event.harbor-charter",
        displayNameKey: "content.m6.policy-event.harbor_charter",
        cause: {
          kind: "day-at-least",
          day: 1,
          reasonCodes: ["policy.event.cause.day-one"]
        },
        options: [
          {
            optionId: 1,
            displayNameKey: "content.m6.policy-event.harbor_charter.accept",
            consequences: [
              {
                kind: "policy-modifier",
                policyId: 1,
                magnitudeBps: 250,
                durationDays: 30,
                reasonCode: "policy.event.consequence.harbor-duty"
              }
            ],
            reasonCodes: ["policy.event.option.accept"],
            encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor.accept"]
          }
        ],
        reasonCodes: ["policy.event.definition.harbor"],
        encyclopediaRefs: ["encyclopedia.m6.policy_event.harbor"]
      },
      {
        eventDefinitionId: 2,
        sourceId: "m6.policy-event.market-charter",
        displayNameKey: "content.m6.policy-event.market_charter",
        cause: {
          kind: "day-at-least",
          day: 1,
          reasonCodes: ["policy.event.cause.day-one"]
        },
        options: [
          {
            optionId: 1,
            displayNameKey: "content.m6.policy-event.market_charter.accept",
            consequences: [
              {
                kind: "policy-modifier",
                policyId: 1,
                magnitudeBps: 100,
                durationDays: 20,
                reasonCode: "policy.event.consequence.market-duty"
              }
            ],
            reasonCodes: ["policy.event.option.accept"],
            encyclopediaRefs: ["encyclopedia.m6.policy_event.market.accept"]
          }
        ],
        reasonCodes: ["policy.event.definition.market"],
        encyclopediaRefs: ["encyclopedia.m6.policy_event.market"]
      }
    ]
  };
}

function requiredFirstEvent(
  source: M6PolicyEventDefinitionSetSourceV0
): M6PolicyEventDefinitionSetSourceV0["events"][number] {
  const firstEvent = source.events[0];
  if (firstEvent === undefined) {
    throw new Error("Expected source fixture to contain at least one M6 policy event.");
  }
  return firstEvent;
}

function runtimeWorldPack(policyPack: RuntimeM6PolicyEventContentPackV0): Record<string, unknown> {
  return {
    schemaVersion: 1,
    kind: "runtime-m2-world-content-pack-v0",
    fixtureId: "m6.policy-event.boot-world",
    manifest: {
      schemaVersion: 1,
      fixtureId: "m6.policy-event.boot-world",
      fixtureKind: "prototype-world-fixture",
      syntheticScope: "m2-prototype-only",
      historicity: "FICTIONAL",
      manifestHash: "c0ffee10",
      districtCount: 2,
      settlementCount: 1,
      regionalSeasonalCurveCount: 1,
      routeCount: 1,
      mapGeometryCount: 3
    },
    districts: [
      {
        id: 1,
        displayNameKey: "district.m6_policy_event.boot_a",
        regionalCurveId: 1,
        mapGeometryId: 1
      },
      {
        id: 2,
        displayNameKey: "district.m6_policy_event.boot_b",
        regionalCurveId: 1,
        mapGeometryId: 2
      }
    ],
    settlements: [
      {
        id: 1,
        displayNameKey: "settlement.m6_policy_event.boot",
        districtId: 1,
        mapGeometryId: 3
      }
    ],
    regionalSeasonalCurves: [
      {
        id: 1,
        monthlyValues: Array.from({ length: 12 }, (_value, index) => ({
          month: index + 1,
          monsoonIntensityBps: 5_000,
          agricultureWorkBps: 5_000,
          riverNavigabilityBps: 5_000,
          roadTravelCostBps: 10_000
        }))
      }
    ],
    routes: [
      {
        id: 1,
        fromDistrictId: 1,
        toDistrictId: 2,
        routeKind: "road",
        baseTravelCost: 10
      }
    ],
    mapGeometries: [
      { id: 1, ownerKind: "district", ownerId: 1 },
      { id: 2, ownerKind: "district", ownerId: 2 },
      { id: 3, ownerKind: "settlement", ownerId: 1 }
    ],
    topology: {
      adjacencyDerivation: "explicit-route-graph-v1",
      explicitIsolations: [],
      districts: [
        {
          districtId: 1,
          sourceId: "district-001",
          displayNameKey: "district.m6_policy_event.boot_a",
          anchor: { x: 0, y: 0 },
          polygon: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 }
          ],
          metadata: { historicity: "FICTIONAL", terrainClass: "lowland", riskClass: "low" }
        },
        {
          districtId: 2,
          sourceId: "district-002",
          displayNameKey: "district.m6_policy_event.boot_b",
          anchor: { x: 20, y: 0 },
          polygon: [
            { x: 15, y: 0 },
            { x: 25, y: 0 },
            { x: 25, y: 10 },
            { x: 15, y: 10 }
          ],
          metadata: { historicity: "FICTIONAL", terrainClass: "lowland", riskClass: "low" }
        }
      ],
      routeNodes: [],
      routeEdges: [
        {
          routeId: 1,
          sourceId: "topology-route-001",
          from: { kind: "district", districtId: 1 },
          to: { kind: "district", districtId: 2 },
          mode: "road",
          baseTravelCost: 10,
          baseCapacity: 100,
          seasonality: Array.from({ length: 12 }, (_value, index) => ({
            month: index + 1,
            costMultiplierBps: 10000,
            capacityMultiplierBps: 10000,
            reasonCodes: [`topology.test.month.${index + 1}`]
          })),
          availability: { kind: "open" },
          metadata: { historicity: "FICTIONAL", terrainClass: "lowland", riskClass: "low" }
        }
      ]
    },
    m6PolicyEvents: policyPack
  };
}

function basicWorldDefinitions(): WorldDefinitionsV0 {
  return {
    polities: [definePolity({ id: 1, displayNameKey: "polity.m6_policy_event.player" })],
    persons: [definePerson({ id: 1, displayNameKey: "person.m6_policy_event.ruler" })],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "district.m6_policy_event.a" }),
      defineDistrict({ id: 2, displayNameKey: "district.m6_policy_event.b" })
    ],
    settlements: [
      defineSettlement({
        id: 1,
        displayNameKey: "settlement.m6_policy_event.anchor",
        districtId: 1
      })
    ],
    routes: [defineRoute({ id: 1, fromDistrictId: 1, toDistrictId: 2, lengthInMapUnits: 1 })]
  };
}

function rewriteSaveM6PolicyEventsWithValidChecksum(
  bytes: Uint8Array,
  replacement: Record<string, unknown>
): Uint8Array {
  const decoded = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (!isRecord(decoded)) {
    throw new Error("Expected save envelope object.");
  }
  const header = readRecord(decoded, "header");
  const body = readRecord(decoded, "body");
  const snapshot = readRecord(body, "authoritativeSnapshot");
  const state = readRecord(snapshot, "state");
  const currentRuntime = readRecord(state, "m6PolicyEvents");
  state["m6PolicyEvents"] = { ...currentRuntime, ...replacement };
  header["checksum"] = fixedHex(hashText(canonicalJson(body)));

  return new TextEncoder().encode(canonicalJson(decoded));
}

function readRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(`Expected ${key} object.`);
  }
  return value;
}

function canonicalJson(value: unknown): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (!isRecord(value)) {
    throw new Error("Unsupported JSON value.");
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

function hashText(text: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619) >>> 0;
  }
  return hash;
}

function fixedHex(value: number): string {
  return value.toString(16).padStart(8, "0");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

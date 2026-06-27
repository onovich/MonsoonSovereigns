import { describe, expect, test } from "vitest";

import {
  createM3PolityVassalageStateV0,
  createM6DiplomacyLegitimacyStateV0,
  createWorldStateV0,
  defineDistrict,
  definePolity,
  querySimulationV1,
  submitCommandV1,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0
} from "../packages/sim-core/src/index";
import { planM6DiplomacyAiTurnV1 } from "../packages/sim-ai/src/index";

describe("M6 diplomacy AI command parity", () => {
  test("plans from public M6 queries and submits the same GameCommand as a player", () => {
    const runtime = bootRuntime();
    const planned = planM6DiplomacyAiTurnV1(runtime, {
      actorId: "polity:2",
      actorPolityId: 2,
      targetPolityId: 1,
      commandIdPrefix: "m6.ai"
    });

    expect(planned.trace).toMatchObject({
      decisionKind: "propose-agreement",
      primaryReasonCode: "m6.ai.diplomacy.recognition-needed",
      commandKind: "sim.propose-diplomatic-agreement"
    });
    expect(planned.command?.actor.kind).toBe("ai");

    const submitted = submitCommandV1(runtime, planned.command);
    expect(submitted.result.status).toBe("accepted");

    const query = querySimulationV1(submitted.runtime, {
      schemaVersion: 1,
      kind: "sim.list-m6-diplomacy",
      payload: { queryId: "m6.ai.query", observerPolityId: 2 }
    });
    expect(query.status).toBe("ok");
    if (query.status !== "ok" || query.result.kind !== "sim.list-m6-diplomacy") {
      throw new Error("Expected M6 diplomacy query.");
    }
    expect(query.result.relations[0]?.reasonCodes).toContain("diplomacy.offer.non-aggression");
  });

  test("waits with reason codes when recognized order is already visible", () => {
    let runtime = bootRuntime();
    const planned = planM6DiplomacyAiTurnV1(runtime, {
      actorId: "polity:2",
      actorPolityId: 2,
      targetPolityId: 1,
      commandIdPrefix: "m6.ai.done"
    });
    const submitted = submitCommandV1(runtime, planned.command);
    expect(submitted.result.status).toBe("accepted");
    runtime = submitted.runtime;
    const accepted = submitCommandV1(runtime, {
      schemaVersion: 1,
      kind: "sim.answer-diplomatic-agreement",
      commandId: "m6.ai.done.accept",
      actor: { kind: "player", id: "polity:1" },
      expectedDay: runtime.world.meta.currentDay,
      expectedRevision: runtime.world.meta.revision,
      payload: {
        agreementId: 1,
        accepted: true,
        reasonCode: "diplomacy.answer.accepted"
      }
    });
    expect(accepted.result.status).toBe("accepted");
    runtime = accepted.runtime;

    const wait = planM6DiplomacyAiTurnV1(runtime, {
      actorId: "polity:2",
      actorPolityId: 2,
      targetPolityId: 1,
      commandIdPrefix: "m6.ai.wait"
    });

    expect(wait.command).toBeNull();
    expect(wait.trace).toMatchObject({
      decisionKind: "wait",
      primaryReasonCode: "m6.ai.diplomacy.existing-recognition"
    });
  });
});

function bootRuntime(): SimulationRuntimeV1 {
  const definitions = definitionsV1();
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m6.ai.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m3: createM3PolityVassalageStateV0(definitions),
    m6: createM6DiplomacyLegitimacyStateV0(definitions)
  });
  return { world, acceptedCommandIds: [], commandTail: [], eventTail: [] };
}

function definitionsV1(): WorldDefinitionsV0 {
  return {
    polities: [
      definePolity({ id: 1, displayNameKey: "polity.m6.player" }),
      definePolity({ id: 2, displayNameKey: "polity.m6.neighbor" })
    ],
    persons: [],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "district.m6.player" }),
      defineDistrict({ id: 2, displayNameKey: "district.m6.neighbor" })
    ],
    settlements: [],
    routes: []
  };
}

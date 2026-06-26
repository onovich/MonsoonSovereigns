import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  createM3PolityVassalageStateV0,
  createM6DiplomacyLegitimacyStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  loadSaveV1,
  parsePolityId,
  querySimulationV1,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "../packages/sim-core/src/index";
import { encodeSaveEnvelopeV1, type SaveWorldSnapshotV0Dto } from "../packages/save-format/src/index";

import type { GameCommandV1 } from "../packages/protocol/src/index";

describe("M6-DIPLOMACY-LEGITIMACY-001 deterministic substrate", () => {
  test("player and AI use the same diplomacy command path with stable ordering", () => {
    let playerRuntime = bootM6Runtime();
    let aiRuntime = bootM6Runtime();

    playerRuntime = accepted(
      playerRuntime,
      proposeAgreementCommand("m6.diplomacy.player", "player", playerRuntime, 1, 2, 1)
    );
    aiRuntime = accepted(
      aiRuntime,
      proposeAgreementCommand("m6.diplomacy.ai", "ai", aiRuntime, 1, 2, 1)
    );

    expect(playerRuntime.world.meta.stateHash).toBe(aiRuntime.world.meta.stateHash);
    expect(playerRuntime.world.state.m6?.relations.map((relation) => relation.relationId)).toEqual([
      1
    ]);
    expect(playerRuntime.eventTail.at(-1)).toMatchObject({
      kind: "sim.m6-diplomatic-agreement-proposed",
      relationId: 1,
      agreementId: 1,
      reasonCodes: ["diplomacy.offer.non-aggression"]
    });
  });

  test("acceptance creates recognition, source-coded legitimacy, and recognized-order pressure", () => {
    let runtime = bootM6Runtime();
    runtime = accepted(
      runtime,
      proposeAgreementCommand("m6.diplomacy.offer", "player", runtime, 1, 2, 1)
    );
    runtime = accepted(runtime, answerAgreementCommand("m6.diplomacy.accept", "ai", runtime, 1));
    runtime = accepted(
      runtime,
      recordLegitimacyCommand("m6.legitimacy.succession", "player", runtime, 10, 1, 700)
    );
    runtime = accepted(
      runtime,
      recordLegitimacyCommand("m6.legitimacy.postwar", "system", runtime, 11, 1, 600)
    );

    const m6 = runtime.world.state.m6;
    expect(m6?.recognitionEdges).toEqual([
      {
        fromPolityId: parsePolityId(2),
        toPolityId: parsePolityId(1),
        agreementId: 1,
        reasonCode: "diplomacy.recognition.accepted"
      }
    ]);
    expect(m6?.legitimacyProfiles).toContainEqual({
      polityId: parsePolityId(1),
      audience: "vassal-rulers",
      scoreBps: 1_300,
      pressureBps: 8_700,
      sourceIds: [10, 11],
      reasonCodes: [
        "legitimacy.source.postwar-settlement",
        "legitimacy.source.succession-continuity"
      ]
    });

    const recognized = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m6-recognized-order",
      payload: { queryId: "m6.recognized.1", polityId: 1 }
    });
    expect(recognized.status).toBe("ok");
    if (recognized.status !== "ok" || recognized.result.kind !== "sim.list-m6-recognized-order") {
      throw new Error("Expected recognized order query.");
    }
    expect(recognized.result.decisions[0]).toMatchObject({
      polityId: 1,
      recognizedByCount: 1,
      legitimacyScoreBps: 1_300,
      canPursueVictory: true
    });
    expect(recognized.result.decisions[0]?.reasonCodes).toEqual([
      "m6.recognized-order.diplomatic-recognition",
      "m6.recognized-order.legitimacy-sufficient",
      "m6.recognized-order.obligations-clear",
      "m6.recognized-order.succession-clear",
      "m6.recognized-order.postwar-evidence-present"
    ]);
    expect(validateWorldStateV0(runtime.world)).toEqual([]);
  });

  test("rejects diplomacy graph cycles and serializes rejection reasons", () => {
    let runtime = bootM6Runtime();
    runtime = accepted(
      runtime,
      proposeAgreementCommand("m6.cycle.offer.1", "player", runtime, 1, 2, 1)
    );
    runtime = accepted(runtime, answerAgreementCommand("m6.cycle.accept.1", "ai", runtime, 1));
    runtime = accepted(
      runtime,
      proposeAgreementCommand("m6.cycle.offer.2", "player", runtime, 2, 3, 2)
    );
    runtime = accepted(runtime, answerAgreementCommand("m6.cycle.accept.2", "ai", runtime, 2));
    runtime = accepted(
      runtime,
      proposeAgreementCommand("m6.cycle.offer.3", "player", runtime, 3, 1, 3)
    );

    const rejected = submitCommandV1(
      runtime,
      answerAgreementCommand("m6.cycle.accept.3", "ai", runtime, 3)
    );
    expect(rejected.result).toMatchObject({
      status: "rejected",
      error: {
        code: "diplomacy-cycle",
        path: "payload.agreementId",
        message: "sim.answer-diplomatic-agreement would create a recognition cycle."
      }
    });
    expect(JSON.parse(JSON.stringify(rejected.result))).toMatchObject({
      status: "rejected",
      error: { code: "diplomacy-cycle", path: "payload.agreementId" }
    });
    expect(rejected.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
  });

  test("property invariants keep legitimacy source totals and no recognition cycles", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -400, max: 700 }), { minLength: 1, maxLength: 8 }),
        (magnitudes) => {
          let runtime = bootM6Runtime();

          for (let index = 0; index < magnitudes.length; index += 1) {
            const sourceId = index + 1;
            const magnitudeBps = magnitudes[index] ?? 0;
            const submitted = submitCommandV1(
              runtime,
              recordLegitimacyCommand(
                `m6.property.legitimacy.${index}`,
                "system",
                runtime,
                sourceId,
                1,
                magnitudeBps
              )
            );
            expect(submitted.result.status).toBe("accepted");
            runtime = submitted.runtime;
            const expectedScore = Math.max(
              0,
              Math.min(10_000, magnitudes.slice(0, index + 1).reduce((total, value) => total + value, 0))
            );
            const profile = runtime.world.state.m6?.legitimacyProfiles.find(
              (entry) => entry.polityId === parsePolityId(1) && entry.audience === "vassal-rulers"
            );
            expect(profile?.scoreBps).toBe(expectedScore);
            expect(validateWorldStateV0(runtime.world)).toEqual([]);
          }
        }
      ),
      { numRuns: 32, seed: 1531 }
    );
  });

  test("save/load preserves M6 and rejects malformed, missing, and future-version payloads", () => {
    let runtime = bootM6Runtime();
    runtime = accepted(
      runtime,
      proposeAgreementCommand("m6.save.offer", "player", runtime, 1, 2, 1)
    );
    runtime = accepted(runtime, answerAgreementCommand("m6.save.accept", "ai", runtime, 1));
    runtime = accepted(
      runtime,
      recordLegitimacyCommand("m6.save.legitimacy", "system", runtime, 10, 1, 900)
    );

    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(bootM6Runtime(), saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected M6 save to load.");
    }
    expect(loaded.runtime.world.state.m6).toEqual(runtime.world.state.m6);

    const missingM6 = withoutSavedM6State(saved.envelope.body.authoritativeSnapshot);
    const missing = loadSaveV1(bootM6Runtime(), encodeSaveEnvelopeV1({
      ...saved.envelope,
      body: { ...saved.envelope.body, authoritativeSnapshot: missingM6 }
    }), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(missing.status).toBe("rejected");

    const malformed = loadSaveV1(
      bootM6Runtime(),
      rewriteSaveM6WithValidChecksum(saved.bytes, { schemaVersion: 1, relations: "bad" }),
      {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      }
    );
    expect(malformed.status).toBe("rejected");
    if (malformed.status !== "rejected") {
      throw new Error("Expected malformed M6 save to reject.");
    }
    expect(malformed.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m6.relations",
      message: "M6 relations must be an array."
    });

    const future = loadSaveV1(
      bootM6Runtime(),
      rewriteSaveM6WithValidChecksum(saved.bytes, {
        ...saved.envelope.body.authoritativeSnapshot.state.m6,
        schemaVersion: 2
      }),
      {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      }
    );
    expect(future.status).toBe("rejected");
    if (future.status !== "rejected") {
      throw new Error("Expected future M6 save to reject.");
    }
    expect(future.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m6.schemaVersion",
      message: "M6 diplomacy legitimacy schemaVersion must be 1."
    });
  });
});

function bootM6Runtime(): SimulationRuntimeV1 {
  const world = createM6World();
  return { world, acceptedCommandIds: [], commandTail: [], eventTail: [] };
}

function createM6World(): WorldStateV0 {
  const definitions = m6Definitions();
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m6.diplomacy.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m3: createM3PolityVassalageStateV0(definitions),
    m6: createM6DiplomacyLegitimacyStateV0(definitions)
  });
}

function m6Definitions(): WorldDefinitionsV0 {
  return {
    polities: [
      definePolity({ id: 1, displayNameKey: "polity.m6.player" }),
      definePolity({ id: 2, displayNameKey: "polity.m6.neighbor" }),
      definePolity({ id: 3, displayNameKey: "polity.m6.rival" })
    ],
    persons: [definePerson({ id: 1, displayNameKey: "person.m6.ruler" })],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "district.m6.capital" }),
      defineDistrict({ id: 2, displayNameKey: "district.m6.neighbor" }),
      defineDistrict({ id: 3, displayNameKey: "district.m6.rival" })
    ],
    settlements: [],
    routes: []
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

function proposeAgreementCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  proposerPolityId: number,
  targetPolityId: number,
  agreementId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.propose-diplomatic-agreement",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m6` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      agreementId,
      relationId: agreementId,
      proposerPolityId,
      targetPolityId,
      agreementKind: "non-aggression",
      durationDays: 360,
      recognitionDirection: "target-recognizes-proposer",
      reasonCode: "diplomacy.offer.non-aggression"
    }
  };
}

function answerAgreementCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  agreementId: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.answer-diplomatic-agreement",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m6` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      agreementId,
      accepted: true,
      reasonCode: "diplomacy.answer.accepted"
    }
  };
}

function recordLegitimacyCommand(
  commandId: string,
  actorKind: "ai" | "player" | "system",
  runtime: SimulationRuntimeV1,
  sourceId: number,
  polityId: number,
  magnitudeBps: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.record-legitimacy-source",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m6` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      sourceId,
      polityId,
      audience: "vassal-rulers",
      sourceKind: sourceId === 11 ? "postwar-settlement" : "succession-continuity",
      magnitudeBps,
      sourceRef: sourceId === 11 ? "m4.postwar.1" : "m3.succession.1",
      reasonCode:
        sourceId === 11
          ? "legitimacy.source.postwar-settlement"
          : "legitimacy.source.succession-continuity"
    }
  };
}

function withoutSavedM6State(snapshot: SaveWorldSnapshotV0Dto): SaveWorldSnapshotV0Dto {
  return {
    ...snapshot,
    state: {
      polities: snapshot.state.polities,
      persons: snapshot.state.persons,
      districts: snapshot.state.districts,
      settlements: snapshot.state.settlements,
      routes: snapshot.state.routes,
      ...(snapshot.state.m2 === undefined ? {} : { m2: snapshot.state.m2 }),
      ...(snapshot.state.m3 === undefined ? {} : { m3: snapshot.state.m3 }),
      ...(snapshot.state.m4 === undefined ? {} : { m4: snapshot.state.m4 })
    }
  };
}

function rewriteSaveM6WithValidChecksum(bytes: Uint8Array, m6: Record<string, unknown>): Uint8Array {
  const decoded = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (!isRecord(decoded)) {
    throw new Error("Expected save envelope object.");
  }
  const header = readRecord(decoded, "header");
  const body = readRecord(decoded, "body");
  const snapshot = readRecord(body, "authoritativeSnapshot");
  const state = readRecord(snapshot, "state");
  state["m6"] = m6;
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

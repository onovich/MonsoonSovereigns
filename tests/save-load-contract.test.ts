import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import { parseM2WorldFixtureSourceV0 } from "../packages/content-schema/src/index";
import { parseRuntimeM2WorldContentPackV0 } from "../packages/content-runtime/src/index";
import {
  createSaveEnvelopeV1,
  encodeSaveEnvelopeV1,
  type SaveWorldSnapshotV0Dto
} from "../packages/save-format/src/index";
import { createSaveLoadCanaryScriptV1, type GameCommandV1 } from "../packages/protocol/src/index";
import {
  bootSimulationV1,
  loadSaveV1,
  requestSaveV1,
  runSaveLoadCanaryV1,
  submitCommandV1,
  type SimulationRuntimeV1
} from "../packages/sim-core/src/index";

const { runSaveLoadCanaryInWorkerCompatibleAdapter } =
  await import("../apps/web/src/worker/hello-simulation-adapter.mjs");

const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);

describe("SIM-005 Node runner and Worker save/load contract", () => {
  test("request-save/load-save preserves hash and does not mutate current runtime on rejection", () => {
    const boot = bootSimulationV1({
      protocolVersion: 1,
      fixture: "m1.abstract-graph-30"
    });
    expect(boot.status).toBe("booted");
    if (boot.status !== "booted") {
      throw new Error("Expected M1 graph boot.");
    }

    const submitted = submitCommandV1(boot.runtime, {
      schemaVersion: 1,
      kind: "debug.set-district-control",
      commandId: "save.contract.control.1",
      actor: { kind: "player", id: "player:save-contract" },
      expectedDay: 0,
      expectedRevision: 0,
      payload: { districtId: 1, controllerPolityId: 1 }
    });
    expect(submitted.result.status).toBe("accepted");

    const saved = requestSaveV1(submitted.runtime, {
      appVersion: "0.0.0",
      source: "node-runner",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: "4a438525",
      expectedScenarioId: "m1.abstract-graph-30"
    });

    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected saved runtime to load.");
    }

    expect(loaded.runtime.world.meta.stateHash).toBe(submitted.runtime.world.meta.stateHash);
    expect(loaded.runtime.acceptedCommandIds).toEqual(submitted.runtime.acceptedCommandIds);

    const rejected = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: "00000000",
      expectedScenarioId: "m1.abstract-graph-30"
    });
    expect(rejected.status).toBe("rejected");
    if (rejected.status !== "rejected") {
      throw new Error("Expected mismatched content load to reject.");
    }
    expect(rejected.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
  });

  test("valid-checksum imported saves with unknown event-tail kinds reject without mutating", () => {
    const boot = bootMinimalRuntime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const bad = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: saved.envelope.body.authoritativeSnapshot,
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: [
        {
          sequence: 1,
          event: { kind: "sim.future-event", schemaVersion: 1 }
        }
      ]
    });

    const result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(result.status).toBe("rejected");
    if (result.status !== "rejected") {
      throw new Error("Expected unknown event tail to reject.");
    }
    expect(result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.eventTail[0].event.kind",
      message: "Saved DomainEvent kind is not supported."
    });
  });

  test("valid-checksum imported saves with malformed event-tail fields reject without throwing", () => {
    const boot = bootMinimalRuntime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const bad = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: saved.envelope.body.authoritativeSnapshot,
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: [
        {
          sequence: 1,
          event: {
            schemaVersion: 1,
            kind: "sim.state-hash-verified",
            commandId: 99,
            actor: { kind: "system", id: "save-contract" },
            day: 0,
            revision: 0,
            stateHash: saved.stateHash
          }
        }
      ]
    });

    expect(() =>
      loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
        expectedContentManifestHash: saved.envelope.header.contentManifestHash,
        expectedScenarioId: saved.envelope.header.scenarioId
      })
    ).not.toThrow();

    const result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(result.status).toBe("rejected");
    if (result.status !== "rejected") {
      throw new Error("Expected malformed event tail to reject.");
    }
    expect(result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.eventTail[0].event.commandId",
      message: "Saved event commandId must be a string."
    });
  });

  test("valid-checksum imported saves with unsupported event-tail schema versions reject without coercion", () => {
    const boot = bootMinimalRuntime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const bad = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: saved.envelope.body.authoritativeSnapshot,
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: [
        {
          sequence: 1,
          event: {
            schemaVersion: 999,
            kind: "sim.state-hash-verified",
            commandId: "bad.version",
            actor: { kind: "system", id: "save-contract" },
            day: 0,
            revision: 0,
            stateHash: saved.stateHash
          }
        }
      ]
    });

    const result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(bad), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(result.status).toBe("rejected");
    if (result.status !== "rejected") {
      throw new Error("Expected unsupported event schemaVersion to reject.");
    }
    expect(result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.eventTail[0].event.schemaVersion",
      message: "Saved DomainEvent schemaVersion must be 1."
    });
  });

  test("same seed, initial state, command tail, and loaded snapshot produce identical Node and Worker hashes", () => {
    const script = createSaveLoadCanaryScriptV1();
    const nodeResult = runSaveLoadCanaryV1(script);
    const workerResult = runSaveLoadCanaryInWorkerCompatibleAdapter(script);

    expect(nodeResult.status).toBe("ok");
    expect(workerResult.status).toBe("ok");
    expect(workerResult.finalHash).toBe(nodeResult.finalHash);
    expect(workerResult.loadedHash).toBe(nodeResult.loadedHash);
    expect(workerResult.replayedHash).toBe(nodeResult.replayedHash);
  });

  test("M2 runtime save/load explicitly preserves economy, population, market, and transport state", async () => {
    const boot = await bootM2Runtime();
    const committed = submitCommandV1(
      boot.runtime,
      commitLaborCommand("save.m2.labor.1", "player", boot.runtime, 1, 40, 20)
    );
    expect(committed.result.status).toBe("accepted");

    const saved = requestSaveV1(committed.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    expect(readSavedM2State(saved.envelope.body.authoritativeSnapshot)).toMatchObject({
      schemaVersion: 1,
      populationGroups: expect.any(Array),
      agriculture: { districts: expect.any(Array) },
      market: { districts: expect.any(Array) },
      transport: {
        schemaVersion: 1,
        routes: expect.any(Array),
        districtSeasonality: expect.any(Array),
        regionalCurves: expect.any(Array)
      }
    });

    const loaded = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected M2 save to load.");
    }
    expect(loaded.runtime.world.meta.stateHash).toBe(committed.runtime.world.meta.stateHash);
    expect(loaded.runtime.world.state.m2).toEqual(committed.runtime.world.state.m2);
    expect(loaded.runtime.acceptedCommandIds).toEqual(committed.runtime.acceptedCommandIds);
  });

  test("M2 save/load rejects missing, malformed, future-version, and cross-manifest data without mutating", async () => {
    const boot = await bootM2Runtime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    const missingM2 = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: withoutSavedM2State(saved.envelope.body.authoritativeSnapshot),
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: saved.envelope.body.eventTail
    });
    const missingM2Result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(missingM2), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(missingM2Result.status).toBe("rejected");
    if (missingM2Result.status !== "rejected") {
      throw new Error("Expected missing M2 save data to reject.");
    }
    expect(missingM2Result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(missingM2Result.reasons).toContainEqual({
      code: "semantic-invariant",
      path: "state.m2",
      message: "Save snapshot is missing required M2 runtime state for this runtime."
    });

    const malformedM2Bytes = rewriteSaveM2WithValidChecksum(saved.bytes, {
      ...readSavedM2Record(saved.envelope.body.authoritativeSnapshot),
      populationGroups: "bad"
    });
    const malformedM2Result = loadSaveV1(boot.runtime, malformedM2Bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(malformedM2Result.status).toBe("rejected");
    if (malformedM2Result.status !== "rejected") {
      throw new Error("Expected malformed M2 save data to reject.");
    }
    expect(malformedM2Result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(malformedM2Result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m2.populationGroups",
      message: "M2 populationGroups must be an array."
    });

    const futureM2Bytes = rewriteSaveM2WithValidChecksum(saved.bytes, {
      ...readSavedM2Record(saved.envelope.body.authoritativeSnapshot),
      schemaVersion: 999
    });
    const futureM2Result = loadSaveV1(boot.runtime, futureM2Bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(futureM2Result.status).toBe("rejected");
    if (futureM2Result.status !== "rejected") {
      throw new Error("Expected future M2 save data to reject.");
    }
    expect(futureM2Result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(futureM2Result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m2.schemaVersion",
      message: "M2 economy population schemaVersion must be 1."
    });

    const crossManifest = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: "00000000",
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(crossManifest.status).toBe("rejected");
    if (crossManifest.status !== "rejected") {
      throw new Error("Expected cross-manifest M2 save to reject.");
    }
    expect(crossManifest.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(crossManifest.reasons).toContainEqual({
      code: "content-manifest-mismatch",
      path: "header.contentManifestHash",
      message: `Save content manifest ${saved.envelope.header.contentManifestHash} does not match expected 00000000.`
    });
  });
});

function bootMinimalRuntime(): Extract<ReturnType<typeof bootSimulationV1>, { status: "booted" }> {
  const boot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
  if (boot.status !== "booted") {
    throw new Error("Expected minimal boot.");
  }

  return boot;
}

async function bootM2Runtime(): Promise<
  Extract<ReturnType<typeof bootSimulationV1>, { status: "booted" }>
> {
  const sourceText = await readFile(m2FixtureUrl, "utf8");
  const source = parseM2WorldFixtureSourceV0(JSON.parse(sourceText) as unknown);
  const compiled = compileContentPackV0OrThrow(source);
  if (compiled.kind !== "runtime-m2-world-content-pack-v0") {
    throw new Error("Expected compiled M2 runtime world content pack.");
  }
  const runtimeContentPack = parseRuntimeM2WorldContentPackV0(structuredClone(compiled));
  const boot = bootSimulationV1({
    protocolVersion: 1,
    source: "runtime-content-pack",
    seed: 1531,
    runtimeContentPack
  });
  if (boot.status !== "booted") {
    throw new Error(`Expected M2 runtime boot, got ${boot.error.code}.`);
  }

  return boot;
}

function commitLaborCommand(
  commandId: string,
  actorKind: "ai" | "player",
  runtime: SimulationRuntimeV1,
  populationGroupId: number,
  laborAmount: number,
  durationDays: number
): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.commit-labor",
    commandId,
    actor: { kind: actorKind, id: `${actorKind}:m2-save` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      populationGroupId,
      purpose: "mobilized",
      laborAmount,
      durationDays
    }
  };
}

function readSavedM2State(snapshot: SaveWorldSnapshotV0Dto): unknown {
  return (snapshot.state as { readonly m2?: unknown }).m2;
}

function readSavedM2Record(snapshot: SaveWorldSnapshotV0Dto): Record<string, unknown> {
  const m2 = readSavedM2State(snapshot);
  if (!isRecord(m2)) {
    throw new Error("Expected saved M2 object.");
  }

  return m2;
}

function withoutSavedM2State(snapshot: SaveWorldSnapshotV0Dto): SaveWorldSnapshotV0Dto {
  return {
    ...snapshot,
    state: {
      polities: snapshot.state.polities,
      persons: snapshot.state.persons,
      districts: snapshot.state.districts,
      settlements: snapshot.state.settlements,
      routes: snapshot.state.routes
    }
  };
}

function rewriteSaveM2WithValidChecksum(
  bytes: Uint8Array,
  m2: Record<string, unknown>
): Uint8Array {
  const decoded = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (!isRecord(decoded)) {
    throw new Error("Expected save envelope object.");
  }
  const header = readRecord(decoded, "header");
  const body = readRecord(decoded, "body");
  const snapshot = readRecord(body, "authoritativeSnapshot");
  const state = readRecord(snapshot, "state");
  state["m2"] = m2;
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
    return `[${value.map((entry) => canonicalJson(entry)).join(",")}]`;
  }

  if (!isRecord(value)) {
    throw new Error("Save test canonical JSON only supports serializable JSON values.");
  }

  return `{${Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
    .join(",")}}`;
}

function hashText(text: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
}

function fixedHex(value: number): string {
  return value.toString(16).padStart(8, "0");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

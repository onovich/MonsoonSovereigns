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
  canonicalizeM2EconomyPopulationState,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createMapTopologyDefinitionV1,
  createWorldStateV0,
  bootSimulationV1,
  defineDistrict,
  definePerson,
  definePolity,
  defineRoute,
  hashWorldStateV0,
  loadSaveV1,
  requestSaveV1,
  runM4DeterminismReplayV1,
  runSaveLoadCanaryV1,
  submitCommandV1,
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";
import {
  createM4DeterminismReplayScriptV1,
  createM5PlayableLoopScriptV1
} from "../packages/protocol/src/index";

const {
  runSaveLoadCanaryInWorkerCompatibleAdapter,
  runM4DeterminismReplayInWorkerCompatibleAdapter
} = await import("../apps/web/src/worker/hello-simulation-adapter.mjs");

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

  test("topology save/load preserves topology hash and rejects incompatible topology snapshots", () => {
    const runtime = createTopologySaveRuntime();
    const topologyHash = runtime.world.definitions.topology?.topologyHash;
    if (topologyHash === undefined) {
      throw new Error("Expected topology hash.");
    }

    const saved = requestSaveV1(runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    expect(saved.envelope.body.authoritativeSnapshot.definitions.topology?.topologyHash).toBe(
      topologyHash
    );

    const loaded = loadSaveV1(runtime, saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected topology save to load.");
    }
    expect(loaded.runtime.world.definitions.topology?.topologyHash).toBe(topologyHash);

    const missingTopology = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: withoutSavedTopology(saved.envelope.body.authoritativeSnapshot),
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: saved.envelope.body.eventTail
    });
    const missingResult = loadSaveV1(runtime, encodeSaveEnvelopeV1(missingTopology), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(missingResult.status).toBe("rejected");
    if (missingResult.status !== "rejected") {
      throw new Error("Expected missing topology save to reject.");
    }
    expect(missingResult.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
    expect(missingResult.reasons).toContainEqual({
      code: "semantic-invariant",
      path: "definitions.topology",
      message: "Save snapshot is missing required map topology for this runtime."
    });

    const mismatchedTopology = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: withSavedTopologyHash(
        saved.envelope.body.authoritativeSnapshot,
        "00000000"
      ),
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: saved.envelope.body.eventTail
    });
    const mismatchedResult = loadSaveV1(runtime, encodeSaveEnvelopeV1(mismatchedTopology), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(mismatchedResult.status).toBe("rejected");
    if (mismatchedResult.status !== "rejected") {
      throw new Error("Expected topology hash mismatch to reject.");
    }
    expect(mismatchedResult.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
    expect(mismatchedResult.reasons).toContainEqual({
      code: "semantic-invariant",
      path: "definitions.topology.topologyHash",
      message: `Save topology hash 00000000 does not match runtime topology hash ${topologyHash}.`
    });
  });

  test("M3 runtime save/load explicitly preserves polity, obligations, character, office, policy, postwar, and succession state", () => {
    const boot = bootM3Runtime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    expect(readSavedM3State(saved.envelope.body.authoritativeSnapshot)).toMatchObject({
      schemaVersion: 1,
      polities: expect.any(Array),
      obligations: expect.any(Array),
      obligationAuditEvents: expect.any(Array),
      fulfillmentClaims: expect.any(Array),
      administrativeDistricts: expect.any(Array),
      characters: expect.any(Array),
      relationships: expect.any(Array),
      offices: expect.any(Array),
      policies: expect.any(Array),
      enfeoffments: expect.any(Array),
      appointmentAuditEvents: expect.any(Array),
      successionCandidateProfiles: expect.any(Array),
      successionCrises: expect.any(Array)
    });

    const loaded = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(loaded.status).toBe("loaded");
    if (loaded.status !== "loaded") {
      throw new Error("Expected M3 save to load.");
    }
    expect(loaded.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(loaded.runtime.world.state.m3).toEqual(boot.runtime.world.state.m3);
    expect(loaded.runtime.world.state.m2).toEqual(boot.runtime.world.state.m2);
  });

  test("M3 save/load rejects missing, malformed, future-version, and cross-manifest data without mutating", () => {
    const boot = bootM3Runtime();
    const saved = requestSaveV1(boot.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    const missingM3 = createSaveEnvelopeV1({
      build: saved.envelope.header.build,
      scenarioId: saved.envelope.header.scenarioId,
      authoritativeSnapshot: withoutSavedM3State(saved.envelope.body.authoritativeSnapshot),
      scheduler: saved.envelope.body.scheduler,
      rng: saved.envelope.body.rng,
      commandTail: saved.envelope.body.commandTail,
      eventTail: saved.envelope.body.eventTail
    });
    const missingM3Result = loadSaveV1(boot.runtime, encodeSaveEnvelopeV1(missingM3), {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(missingM3Result.status).toBe("rejected");
    if (missingM3Result.status !== "rejected") {
      throw new Error("Expected missing M3 save data to reject.");
    }
    expect(missingM3Result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(missingM3Result.reasons).toContainEqual({
      code: "semantic-invariant",
      path: "state.m3",
      message: "Save snapshot is missing required M3 runtime state for this runtime."
    });

    const malformedM3Bytes = rewriteSaveM3WithValidChecksum(saved.bytes, {
      ...readSavedM3Record(saved.envelope.body.authoritativeSnapshot),
      characters: "bad"
    });
    const malformedM3Result = loadSaveV1(boot.runtime, malformedM3Bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(malformedM3Result.status).toBe("rejected");
    if (malformedM3Result.status !== "rejected") {
      throw new Error("Expected malformed M3 save data to reject.");
    }
    expect(malformedM3Result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(malformedM3Result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m3.characters",
      message: "M3 characters must be an array."
    });

    const futureM3Bytes = rewriteSaveM3WithValidChecksum(saved.bytes, {
      ...readSavedM3Record(saved.envelope.body.authoritativeSnapshot),
      schemaVersion: 999
    });
    const futureM3Result = loadSaveV1(boot.runtime, futureM3Bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(futureM3Result.status).toBe("rejected");
    if (futureM3Result.status !== "rejected") {
      throw new Error("Expected future M3 save data to reject.");
    }
    expect(futureM3Result.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(futureM3Result.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m3.schemaVersion",
      message: "M3 polity vassalage schemaVersion must be 1."
    });

    const crossManifest = loadSaveV1(boot.runtime, saved.bytes, {
      expectedContentManifestHash: "00000000",
      expectedScenarioId: saved.envelope.header.scenarioId
    });
    expect(crossManifest.status).toBe("rejected");
    if (crossManifest.status !== "rejected") {
      throw new Error("Expected cross-manifest M3 save to reject.");
    }
    expect(crossManifest.runtime.world.meta.stateHash).toBe(boot.runtime.world.meta.stateHash);
    expect(crossManifest.reasons).toContainEqual({
      code: "content-manifest-mismatch",
      path: "header.contentManifestHash",
      message: `Save content manifest ${saved.envelope.header.contentManifestHash} does not match expected 00000000.`
    });
  });
});

describe("M4-DETERMINISM-REPLAY-001 complete loop replay", () => {
  test("replays the complete M4 loop with stable Node and worker hashes", () => {
    const script = createM4DeterminismReplayScriptV1();
    const nodeResult = runM4DeterminismReplayV1(script);
    const workerResult = runM4DeterminismReplayInWorkerCompatibleAdapter(script);

    expect(nodeResult).toEqual(workerResult);
    expect(nodeResult).toMatchObject({
      finalDay: 22,
      finalRevision: 12,
      postwarCandidateCount: 1,
      campaignPlanStatus: "completed",
      campaignPlanStatusReasonCode: "campaign.objective.postwar-candidate-created"
    });

    const replayedRuntime = replayM4Script(script);
    const m4 = replayedRuntime.world.state.m4;
    if (m4 === undefined) {
      throw new Error("Expected M4 replay state.");
    }

    expect(replayedRuntime.world.meta.stateHash).toBe(nodeResult.finalHash);
    expect(m4.fieldEngagements).toHaveLength(1);
    expect(m4.fieldEngagements[0]).toMatchObject({
      engagementId: 901,
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
    expect(m4.sieges).toHaveLength(1);
    expect(m4.sieges[0]).toMatchObject({
      siegeId: 801,
      status: "surrendered",
      statusReasonCode: "siege.surrender.accepted",
      surrenderEligible: true
    });
    expect(m4.withdrawals).toHaveLength(1);
    expect(m4.withdrawals[0]).toMatchObject({
      withdrawalId: 901,
      campaignPlanId: 10,
      siegeId: 801,
      triggerReason: "objective-complete",
      kind: "orderly-withdrawal"
    });
    expect(m4.postwarCandidates).toHaveLength(1);
    expect(m4.postwarCandidates[0]).toMatchObject({
      candidateId: "m4.campaign.10.candidate.1",
      sourceWarOutcomeId: 1,
      settlementId: "m4.campaign.10.outcome.1",
      victorPolityId: 1,
      localPolityId: 2,
      districtId: 3,
      validM3Methods: ["direct-control", "restore-vassal-ruler", "tribute-only"]
    });
    expect(validateReplayWorld(replayedRuntime.world)).toBe(true);
  });

  test("round-trips M4 save requests and still rejects missing-M4 load snapshots explicitly", () => {
    const script = createM4DeterminismReplayScriptV1();
    const replayedRuntime = replayM4Script(script);
    const m4Boot = bootSimulationV1({
      protocolVersion: 1,
      fixture: "m4.determinism-replay-001"
    });
    if (m4Boot.status !== "booted") {
      throw new Error("Expected M4 replay boot.");
    }
    const compatibilityRuntime = createM2M3CompatibilityRuntime();

    const m4Saved = requestSaveV1(replayedRuntime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const m4Loaded = loadSaveV1(m4Boot.runtime, m4Saved.bytes, {
      expectedContentManifestHash: m4Saved.envelope.header.contentManifestHash,
      expectedScenarioId: m4Saved.envelope.header.scenarioId
    });

    expect(m4Loaded.status).toBe("loaded");
    if (m4Loaded.status !== "loaded") {
      throw new Error("Expected M4 replay save to load.");
    }
    expect(m4Loaded.stateHash).toBe(replayedRuntime.world.meta.stateHash);
    expect(m4Loaded.runtime.world.state.m4?.postwarCandidates).toHaveLength(1);
    expect(validateReplayWorld(m4Loaded.runtime.world)).toBe(true);

    const saved = requestSaveV1(compatibilityRuntime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });
    const loaded = loadSaveV1(m4Boot.runtime, saved.bytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(loaded.status).toBe("rejected");
    if (loaded.status !== "rejected") {
      throw new Error("Expected missing-M4 save load to reject.");
    }
    expect(loaded.reasons).toContainEqual({
      code: "semantic-invariant",
      path: "state.m4",
      message: "Save snapshot is missing required M4 runtime state for this runtime."
    });
    expect(loaded.runtime.world.meta.stateHash).toBe(m4Boot.runtime.world.meta.stateHash);
  });

  test("rejects injected nested M4 extra keys before hydration", () => {
    const replayed = replayM5SuccessScript();
    const saved = requestSaveV1(replayed.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    const tamperedBytes = rewriteSaveM4WithValidChecksum(saved.bytes, (m4) => {
      const postwarCandidates = readRecordArray(m4, "postwarCandidates");
      const first = postwarCandidates[0];
      if (first === undefined) {
        throw new Error("Expected M4 postwar candidate.");
      }
      first["extraHiddenAuthority"] = {
        hiddenTroops: 999_999,
        bypassCommand: true
      };
    });
    const loaded = loadSaveV1(replayed.bootRuntime, tamperedBytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(loaded.status).toBe("rejected");
    if (loaded.status !== "rejected") {
      throw new Error("Expected M4 save with injected extra key to reject.");
    }
    expect(loaded.reasons[0]?.code).toBe("checksum-mismatch");
    expect(loaded.runtime.world.meta.stateHash).toBe(replayed.bootRuntime.world.meta.stateHash);
  });

  test("rejects malformed nested M4 postwar candidate fields", () => {
    const replayed = replayM5SuccessScript();
    const saved = requestSaveV1(replayed.runtime, {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    });

    const tamperedBytes = rewriteSaveM4WithValidChecksum(saved.bytes, (m4) => {
      const postwarCandidates = readRecordArray(m4, "postwarCandidates");
      const first = postwarCandidates[0];
      if (first === undefined) {
        throw new Error("Expected M4 postwar candidate.");
      }
      first["validM3Methods"] = ["tribute-only", "extra-hidden-authority"];
    });
    const loaded = loadSaveV1(replayed.bootRuntime, tamperedBytes, {
      expectedContentManifestHash: saved.envelope.header.contentManifestHash,
      expectedScenarioId: saved.envelope.header.scenarioId
    });

    expect(loaded.status).toBe("rejected");
    if (loaded.status !== "rejected") {
      throw new Error("Expected malformed M4 save to reject.");
    }
    expect(loaded.reasons).toContainEqual({
      code: "invalid-schema",
      path: "body.authoritativeSnapshot.state.m4.postwarCandidates[0].validM3Methods[1]",
      message: "M4 postwar method is invalid."
    });
    expect(loaded.runtime.world.meta.stateHash).toBe(replayed.bootRuntime.world.meta.stateHash);
  });
});

function bootMinimalRuntime(): Extract<ReturnType<typeof bootSimulationV1>, { status: "booted" }> {
  const boot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
  if (boot.status !== "booted") {
    throw new Error("Expected minimal boot.");
  }

  return boot;
}

function bootM3Runtime(): { readonly runtime: SimulationRuntimeV1 } {
  return {
    runtime: {
      world: createM3World(),
      acceptedCommandIds: ["m3.save.command.1"],
      commandTail: [],
      eventTail: []
    }
  };
}

function replayM4Script(
  script: ReturnType<typeof createM4DeterminismReplayScriptV1>
): SimulationRuntimeV1 {
  const boot = bootSimulationV1(script.boot);
  if (boot.status !== "booted") {
    throw new Error("Expected replay boot.");
  }

  let runtime = boot.runtime;
  for (const command of script.commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(JSON.stringify(submitted.result.error));
    }
    runtime = submitted.runtime;
  }

  return runtime;
}

function replayM5SuccessScript(): {
  readonly bootRuntime: SimulationRuntimeV1;
  readonly runtime: SimulationRuntimeV1;
} {
  const script = createM5PlayableLoopScriptV1();
  const boot = bootSimulationV1(script.boot);
  if (boot.status !== "booted") {
    throw new Error("Expected M5 replay boot.");
  }

  let runtime = boot.runtime;
  for (const command of script.successCommands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(JSON.stringify(submitted.result.error));
    }
    runtime = submitted.runtime;
  }

  return {
    bootRuntime: boot.runtime,
    runtime
  };
}

function createM2M3CompatibilityRuntime(): SimulationRuntimeV1 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "compat.polity.attacker" }),
      definePolity({ id: 2, displayNameKey: "compat.polity.defender" })
    ],
    persons: [definePerson({ id: 1, displayNameKey: "compat.person.commander" })],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "compat.district.origin" }),
      defineDistrict({ id: 2, displayNameKey: "compat.district.midpoint" }),
      defineDistrict({ id: 3, displayNameKey: "compat.district.target" })
    ],
    settlements: [],
    routes: []
  };
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m4-determinism-replay-compat",
    currentDay: 22,
    revision: 12,
    definitions,
    m2: canonicalizeM2EconomyPopulationState(createM2EconomyPopulationStateV0(definitions)),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: null }
      ]
    })
  });

  return {
    world: {
      ...world,
      meta: { ...world.meta, stateHash: hashWorldStateV0(world) }
    },
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createTopologySaveRuntime(): SimulationRuntimeV1 {
  const contentManifestHash = "m7.topology.save";
  const districts = [
    defineDistrict({ id: 1, displayNameKey: "topology.save.origin" }),
    defineDistrict({ id: 2, displayNameKey: "topology.save.destination" })
  ];
  const routes = [defineRoute({ id: 1, fromDistrictId: 1, toDistrictId: 2, lengthInMapUnits: 4 })];
  const topology = createMapTopologyDefinitionV1({
    contentManifestHash,
    districts: [
      topologySaveDistrict(1, "topology.save.origin"),
      topologySaveDistrict(2, "topology.save.destination")
    ],
    routeEdges: [
      {
        routeId: 1,
        sourceId: "topology.save.route.1",
        from: { kind: "district", districtId: 1 },
        to: { kind: "district", districtId: 2 },
        mode: "road",
        baseTravelCost: 4,
        baseCapacity: 100,
        seasonality: topologySaveSeasonality(),
        availability: { kind: "open" },
        metadata: {
          historicity: "COMPOSITE",
          terrainClass: "lowland",
          riskClass: "low"
        }
      }
    ]
  });
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash,
    currentDay: 0,
    revision: 0,
    definitions: {
      polities: [],
      persons: [],
      districts,
      settlements: [],
      routes,
      topology
    }
  });

  return {
    world,
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function topologySaveDistrict(
  districtId: number,
  displayNameKey: string
): {
  readonly districtId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly anchor: { readonly x: number; readonly y: number };
  readonly polygon: readonly { readonly x: number; readonly y: number }[];
  readonly metadata: {
    readonly historicity: "COMPOSITE";
    readonly terrainClass: "lowland";
    readonly riskClass: "low";
  };
} {
  const x = districtId * 10;
  return {
    districtId,
    sourceId: `topology.save.district.${districtId}`,
    displayNameKey,
    anchor: { x, y: 10 },
    polygon: [
      { x: x - 1, y: 9 },
      { x: x + 1, y: 9 },
      { x, y: 11 }
    ],
    metadata: {
      historicity: "COMPOSITE",
      terrainClass: "lowland",
      riskClass: "low"
    }
  };
}

function topologySaveSeasonality(): readonly {
  readonly month: number;
  readonly costMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly reasonCodes: readonly string[];
}[] {
  return Array.from({ length: 12 }, (_unused, index) => ({
    month: index + 1,
    costMultiplierBps: 10_000,
    capacityMultiplierBps: 10_000,
    reasonCodes: []
  }));
}

function validateReplayWorld(world: WorldStateV0): boolean {
  const m4 = world.state.m4;
  if (m4 === undefined) {
    return false;
  }

  return (
    world.meta.currentDay === 22 &&
    world.meta.revision === 12 &&
    m4.campaignPlans.length === 1 &&
    m4.campaignPlans[0]?.status === "completed" &&
    m4.fieldEngagements.length === 1 &&
    m4.sieges.length === 1 &&
    m4.withdrawals.length === 1 &&
    m4.postwarCandidates.length === 1
  );
}

function createM3World(): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.save.suzerain" }),
      definePolity({ id: 2, displayNameKey: "content.m3.save.vassal" }),
      definePolity({ id: 3, displayNameKey: "content.m3.save.frontier" })
    ],
    persons: [
      definePerson({ id: 1, displayNameKey: "content.m3.save.ruler" }),
      definePerson({ id: 2, displayNameKey: "content.m3.save.regent" }),
      definePerson({ id: 3, displayNameKey: "content.m3.save.rival" })
    ],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.save.capital" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.save.vassal_district" }),
      defineDistrict({ id: 3, displayNameKey: "content.m3.save.frontier_district" })
    ],
    settlements: [],
    routes: []
  };

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.save.validation",
    currentDay: 4,
    revision: 7,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: 1 },
        { polityId: 3, directSuzerainPolityId: 2 }
      ],
      obligations: [
        {
          id: 1,
          debtorPolityId: 2,
          creditorPolityId: 1,
          obligationKind: "tribute",
          obligationCategory: "regular-tribute",
          obligationSource: {
            kind: "vassalage",
            sourceId: "m3.save.vassalage.2-to-1",
            debtorPolityId: 2,
            creditorPolityId: 1
          },
          requirement: { kind: "amount", resourceKind: "cash", amount: 120 },
          due: { kind: "cadence", periodDays: 30, nextDueDay: 60 },
          accounting: {
            nominalAmount: 120,
            dueAmount: 120,
            deliveredAmount: 60,
            arrearsAmount: 60,
            defaultedAmount: 0,
            remittedAmount: 0,
            dueDay: 30,
            cycle: 1,
            troopResponseState: "none"
          },
          status: "active",
          disputeReasonCode: null,
          breachReasonCode: null,
          createdAuditEventId: 1,
          latestAuditEventId: 2
        }
      ],
      obligationAuditEvents: [
        {
          id: 1,
          obligationId: 1,
          eventKind: "created",
          eventDay: 1,
          eventRevision: 1,
          commandId: "m3.save.obligation.create",
          actor: { kind: "player", id: "polity:1" },
          actionKind: null,
          dueDay: null,
          fulfillmentId: null,
          fulfilledAmount: null,
          statusAfter: "active",
          reasonCode: null,
          reasonCodes: ["obligation.created"],
          reliabilityBps: 10_000
        },
        {
          id: 2,
          obligationId: 1,
          eventKind: "settled",
          eventDay: 3,
          eventRevision: 5,
          commandId: "m3.save.obligation.partial",
          actor: { kind: "ai", id: "polity:2" },
          actionKind: "partial-fulfillment",
          dueDay: 30,
          fulfillmentId: 901,
          fulfilledAmount: 60,
          statusAfter: "active",
          reasonCode: "m3.save.partial",
          reasonCodes: ["obligation.action.partial-fulfillment"],
          reliabilityBps: 8_500
        }
      ],
      fulfillmentClaims: [
        {
          fulfillmentId: 901,
          obligationId: 1,
          auditEventId: 2,
          actionKind: "partial-fulfillment",
          dueDay: 30,
          fulfilledAmount: 60,
          deliveredAmount: 60,
          arrearsAmount: 60,
          defaultedAmount: 0,
          reasonCode: "m3.save.partial",
          sourceMovements: [
            {
              kind: "m2-population-group",
              populationGroupId: 2,
              districtId: 2,
              resourceKind: "cash",
              amount: 60
            }
          ]
        }
      ],
      administrativeDistricts: [
        {
          polityId: 1,
          districtId: 1,
          controlMode: "direct",
          localComplexity: 90,
          communicationCost: 80,
          directness: 70,
          frontierPressure: 60,
          administrativeCapacity: 1_200
        },
        {
          polityId: 2,
          districtId: 2,
          controlMode: "vassal",
          localComplexity: 110,
          communicationCost: 75,
          directness: 55,
          frontierPressure: 95,
          administrativeCapacity: 900
        }
      ],
      characters: [
        {
          characterId: 1,
          polityId: 2,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 7_000,
          administrationBps: 8_000,
          diplomacyBps: 6_000
        },
        {
          characterId: 2,
          polityId: 2,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 5_000,
          administrationBps: 6_500,
          diplomacyBps: 7_000
        },
        {
          characterId: 3,
          polityId: 2,
          alive: true,
          incapacitated: false,
          currentDistrictId: 3,
          commandBps: 8_000,
          administrationBps: 4_000,
          diplomacyBps: 4_500
        }
      ],
      relationships: [
        { sourceCharacterId: 2, targetCharacterId: 1, affinityBps: 1_500 },
        { sourceCharacterId: 3, targetCharacterId: 1, affinityBps: -500 }
      ],
      offices: [
        {
          officeId: 1,
          polityId: 2,
          jurisdiction: { kind: "polity", polityId: 2 },
          officeKind: "governor",
          primary: true,
          holderCharacterId: 1,
          policyId: 1,
          minimumCommandBps: 0,
          minimumAdministrationBps: 5_000
        },
        {
          officeId: 2,
          polityId: 2,
          jurisdiction: { kind: "district", districtId: 2 },
          officeKind: "commander",
          primary: false,
          holderCharacterId: 3,
          policyId: 2,
          minimumCommandBps: 6_000,
          minimumAdministrationBps: 0
        }
      ],
      policies: [
        {
          policyId: 1,
          target: { kind: "office", officeId: 1 },
          stance: "conciliatory",
          intensityBps: 5_500
        },
        {
          policyId: 2,
          target: { kind: "district", districtId: 2 },
          stance: "military",
          intensityBps: 6_000
        }
      ],
      enfeoffments: [
        {
          districtId: 2,
          holderCharacterId: 1,
          grantedByPolityId: 1,
          policyId: 2,
          grantedDay: 2,
          reasonCode: "postwar.restore-vassal-ruler"
        }
      ],
      appointmentAuditEvents: [
        {
          id: 1,
          eventKind: "appointment",
          eventDay: 2,
          eventRevision: 4,
          commandId: "m3.save.appoint",
          actor: { kind: "player", id: "polity:1" },
          officeId: 1,
          characterId: 1,
          policyId: 1,
          districtId: null,
          reasonCode: "appointment.restore-local-ruler"
        },
        {
          id: 2,
          eventKind: "enfeoffment",
          eventDay: 2,
          eventRevision: 4,
          commandId: "m3.save.enfeoff",
          actor: { kind: "system", id: "m3.postwar" },
          officeId: null,
          characterId: 1,
          policyId: 2,
          districtId: 2,
          reasonCode: "postwar.restore-vassal-ruler"
        }
      ],
      successionCandidateProfiles: [
        {
          polityId: 2,
          characterId: 2,
          requiresRegency: false,
          supportSources: [
            { kind: "kinship", strengthBps: 3_000, sourceId: "kinship.sibling" },
            { kind: "court", strengthBps: 2_000, sourceId: "court.ministers" }
          ]
        },
        {
          polityId: 2,
          characterId: 3,
          requiresRegency: false,
          supportSources: [{ kind: "military", strengthBps: 4_000, sourceId: "army.frontier" }]
        }
      ],
      successionCrises: [
        {
          id: 1,
          polityId: 2,
          trigger: { kind: "incapacity", characterId: 1, officeId: 1 },
          status: "resolved",
          startedDay: 3,
          resolvedDay: 4,
          candidates: [
            {
              characterId: 2,
              requiresRegency: false,
              supportSources: [{ kind: "court", strengthBps: 6_000, sourceId: "court.ministers" }],
              supportTotalBps: 6_000
            },
            {
              characterId: 3,
              requiresRegency: false,
              supportSources: [{ kind: "military", strengthBps: 4_500, sourceId: "army.frontier" }],
              supportTotalBps: 4_500
            }
          ],
          outcome: {
            kind: "peaceful",
            successorCharacterId: 2,
            supportTotalBps: 6_000
          },
          reasonCode: "succession.resolved"
        }
      ]
    })
  });
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

function readSavedM3State(snapshot: SaveWorldSnapshotV0Dto): unknown {
  return (snapshot.state as { readonly m3?: unknown }).m3;
}

function readSavedM3Record(snapshot: SaveWorldSnapshotV0Dto): Record<string, unknown> {
  const m3 = readSavedM3State(snapshot);
  if (!isRecord(m3)) {
    throw new Error("Expected saved M3 object.");
  }

  return m3;
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

function withoutSavedM3State(snapshot: SaveWorldSnapshotV0Dto): SaveWorldSnapshotV0Dto {
  return {
    ...snapshot,
    state: {
      polities: snapshot.state.polities,
      persons: snapshot.state.persons,
      districts: snapshot.state.districts,
      settlements: snapshot.state.settlements,
      routes: snapshot.state.routes,
      ...(snapshot.state.m2 === undefined ? {} : { m2: snapshot.state.m2 })
    }
  };
}

function withoutSavedTopology(snapshot: SaveWorldSnapshotV0Dto): SaveWorldSnapshotV0Dto {
  return {
    ...snapshot,
    definitions: {
      polities: snapshot.definitions.polities,
      persons: snapshot.definitions.persons,
      districts: snapshot.definitions.districts,
      settlements: snapshot.definitions.settlements,
      routes: snapshot.definitions.routes
    }
  };
}

function withSavedTopologyHash(
  snapshot: SaveWorldSnapshotV0Dto,
  topologyHash: string
): SaveWorldSnapshotV0Dto {
  const topology = snapshot.definitions.topology;
  if (topology === undefined) {
    throw new Error("Expected saved topology.");
  }

  return {
    ...snapshot,
    definitions: {
      ...snapshot.definitions,
      topology: {
        ...topology,
        topologyHash
      }
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

function rewriteSaveM3WithValidChecksum(
  bytes: Uint8Array,
  m3: Record<string, unknown>
): Uint8Array {
  const decoded = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (!isRecord(decoded)) {
    throw new Error("Expected save envelope object.");
  }
  const header = readRecord(decoded, "header");
  const body = readRecord(decoded, "body");
  const snapshot = readRecord(body, "authoritativeSnapshot");
  const state = readRecord(snapshot, "state");
  state["m3"] = m3;
  header["checksum"] = fixedHex(hashText(canonicalJson(body)));

  return new TextEncoder().encode(canonicalJson(decoded));
}

function rewriteSaveM4WithValidChecksum(
  bytes: Uint8Array,
  mutate: (m4: Record<string, unknown>) => void
): Uint8Array {
  const decoded = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (!isRecord(decoded)) {
    throw new Error("Expected save envelope object.");
  }
  const header = readRecord(decoded, "header");
  const body = readRecord(decoded, "body");
  const snapshot = readRecord(body, "authoritativeSnapshot");
  const state = readRecord(snapshot, "state");
  const m4 = readRecord(state, "m4");
  mutate(m4);
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

function readRecordArray(record: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = record[key];
  if (!Array.isArray(value) || !value.every(isRecord)) {
    throw new Error(`Expected ${key} object array.`);
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

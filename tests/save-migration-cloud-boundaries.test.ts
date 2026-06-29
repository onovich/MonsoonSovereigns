import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import {
  parseM2WorldFixtureSourceV0,
  parseM7BetaScenarioPersonEventSetSourceV0
} from "../packages/content-schema/src/index";
import { parseRuntimeM2WorldContentPackV0 } from "../packages/content-runtime/src/index";
import {
  createM4DeterminismReplayScriptV1,
  createM5PlayableLoopScriptV1,
  createM6AlphaStartToVictoryScriptV1,
  type GameCommandV1
} from "../packages/protocol/src/index";
import {
  M7_SAVE_MIGRATION_BOUNDARY_SCHEMA_VERSION,
  SAVE_ENVELOPE_V1_MAGIC,
  SAVE_ENVELOPE_V1_SCHEMA_VERSION,
  classifyM7SaveContentManifestBoundaryV1,
  createSaveEnvelopeV1,
  encodeSaveEnvelopeV1,
  validateM7SaveMigrationBoundaryV1,
  validateM7SaveMigrationCandidateV1,
  type M7SaveMigrationCompatibilityBoundaryV1,
  type M7SaveMigrationHumanGateCapabilityV1,
  type M7SaveMigrationManifestBoundaryEntryV1
} from "../packages/save-format/src/index";
import {
  bootSimulationV1,
  canonicalizeM2EconomyPopulationState,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  hashWorldStateV0,
  requestSaveV1,
  submitCommandV1,
  type SimulationRuntimeV1
} from "../packages/sim-core/src/index";

const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);
const m7BetaScenarioFixtureUrl = new URL(
  "../content-source/m7-beta-scenarios/beta-scenario-person-event-set.json",
  import.meta.url
);

type RuntimeSaveV1 = ReturnType<typeof requestSaveV1>;

interface AcceptedBoundarySave {
  readonly entry: M7SaveMigrationManifestBoundaryEntryV1;
  readonly save: RuntimeSaveV1;
}

const HUMAN_GATE_CAPABILITIES: readonly M7SaveMigrationHumanGateCapabilityV1[] = [
  "account-backed-persistence",
  "cloud-provider-integration",
  "cloud-save-enablement",
  "frozen-platform-decision",
  "frozen-save-format-decision",
  "implicit-rpc",
  "irreversible-migration",
  "network-sync",
  "object-graph-serialization",
  "paid-service",
  "remote-collection",
  "secrets",
  "server-persistence",
  "telemetry"
];

describe("M7-SAVE-MIGRATION-CLOUD-BOUNDARIES-001 migration boundary", () => {
  test("recognizes M1-M6 accepted saves and keeps M7 Beta content manifest candidate-only", async () => {
    const acceptedSaves = await createAcceptedBoundarySaves();
    const m7Candidate = await createM7CandidateBoundaryEntry();
    const boundary = createBoundary(
      acceptedSaves.map((save) => save.entry),
      [m7Candidate]
    );

    expect(validateM7SaveMigrationBoundaryV1(boundary)).toEqual({ ok: true });

    for (const accepted of acceptedSaves) {
      const result = validateM7SaveMigrationCandidateV1({
        boundary,
        bytes: accepted.save.bytes,
        requestedMode: "local-compatible-load-only",
        expectedContentManifestHash: accepted.save.envelope.header.contentManifestHash,
        expectedScenarioId: accepted.save.envelope.header.scenarioId
      });

      expect(result.status).toBe("compatible");
      if (result.status !== "compatible") {
        throw new Error(`Expected ${accepted.entry.milestone} accepted save compatibility.`);
      }
      expect(result.matchingEntry.milestone).toBe(accepted.entry.milestone);
      expect(result.envelope.body.authoritativeSnapshot.meta.stateHash).toBe(
        accepted.save.envelope.body.authoritativeSnapshot.meta.stateHash
      );
    }

    const candidate = classifyM7SaveContentManifestBoundaryV1(
      {
        contentManifestHash: m7Candidate.contentManifestHash,
        scenarioId: m7Candidate.scenarioId
      },
      boundary
    );
    expect(candidate).toMatchObject({
      status: "beta-content-lock-candidate",
      humanGateRequired: true,
      routeTo: "security_reviewer"
    });
  });

  test("rejects QA-reproduced M7 accepted-save boundary bypass before compatibility", async () => {
    const acceptedSaves = await createAcceptedBoundarySaves();
    const m7Candidate = await createM7CandidateBoundaryEntry();
    const m1 = acceptedSaves[0];
    if (m1 === undefined) {
      throw new Error("Expected M1 accepted save.");
    }
    const m7ForgedEnvelope = createM7CandidateEnvelopeFromSave(m1.save, m7Candidate);
    const m7AcceptedEntry: M7SaveMigrationManifestBoundaryEntryV1 = {
      ...m7Candidate,
      decisionState: "accepted-save",
      stateHash: m7ForgedEnvelope.body.authoritativeSnapshot.meta.stateHash,
      migrationMode: "local-compatible-load-only"
    };
    const boundary = createBoundary(
      [...acceptedSaves.map((save) => save.entry), m7AcceptedEntry],
      [m7Candidate]
    );

    expect(validateM7SaveMigrationBoundaryV1(boundary)).toMatchObject({
      ok: false,
      issues: [
        {
          code: "invalid-boundary",
          path: "acceptedSaveManifests[6].milestone",
          message: "acceptedSaveManifests[6].milestone must be one of M1, M2, M3, M4, M5, M6."
        }
      ]
    });

    expect(
      classifyM7SaveContentManifestBoundaryV1(
        {
          contentManifestHash: m7ForgedEnvelope.header.contentManifestHash,
          scenarioId: m7ForgedEnvelope.header.scenarioId,
          stateHash: m7ForgedEnvelope.body.authoritativeSnapshot.meta.stateHash
        },
        boundary
      )
    ).toMatchObject({
      status: "beta-content-lock-candidate",
      humanGateRequired: true,
      routeTo: "security_reviewer"
    });

    expect(
      validateM7SaveMigrationCandidateV1({
        boundary,
        bytes: encodeSaveEnvelopeV1(m7ForgedEnvelope),
        requestedMode: "local-compatible-load-only"
      })
    ).toMatchObject({
      status: "human-gate-required",
      reasons: [
        {
          code: "invalid-boundary",
          path: "acceptedSaveManifests[6].milestone",
          routeTo: "security_reviewer"
        }
      ]
    });
  });

  test("rejects malformed, future, cross-manifest, and non-boundary save inputs", async () => {
    const acceptedSaves = await createAcceptedBoundarySaves();
    const boundary = createBoundary(
      acceptedSaves.map((save) => save.entry),
      [await createM7CandidateBoundaryEntry()]
    );
    const m1 = acceptedSaves[0];
    if (m1 === undefined) {
      throw new Error("Expected M1 accepted save.");
    }

    expect(
      validateM7SaveMigrationCandidateV1({
        boundary,
        bytes: new TextEncoder().encode("{"),
        requestedMode: "local-compatible-load-only"
      })
    ).toMatchObject({
      status: "rejected",
      reasons: [{ code: "malformed-json", path: "$" }]
    });

    expect(
      validateM7SaveMigrationCandidateV1({
        boundary,
        bytes: rewriteJsonBytes(m1.save.bytes, (record) => {
          record["schemaVersion"] = 999;
        }),
        requestedMode: "local-compatible-load-only"
      })
    ).toMatchObject({
      status: "rejected",
      reasons: [{ code: "unsupported-schema-version", path: "schemaVersion" }]
    });

    expect(
      validateM7SaveMigrationCandidateV1({
        boundary,
        bytes: m1.save.bytes,
        requestedMode: "local-compatible-load-only",
        expectedContentManifestHash: "00000000",
        expectedScenarioId: m1.save.envelope.header.scenarioId
      })
    ).toMatchObject({
      status: "rejected",
      reasons: [{ code: "content-manifest-mismatch", path: "header.contentManifestHash" }]
    });

    const withoutM1 = createBoundary(
      acceptedSaves.filter((save) => save.entry.milestone !== "M1").map((save) => save.entry),
      [await createM7CandidateBoundaryEntry()]
    );
    expect(
      validateM7SaveMigrationCandidateV1({
        boundary: withoutM1,
        bytes: m1.save.bytes,
        requestedMode: "local-compatible-load-only"
      })
    ).toMatchObject({
      status: "human-gate-required",
      reasons: [{ code: "invalid-boundary", routeTo: "security_reviewer" }]
    });
  });

  test.each<M7SaveMigrationHumanGateCapabilityV1>([
    "account-backed-persistence",
    "cloud-save-enablement",
    "implicit-rpc",
    "network-sync",
    "object-graph-serialization",
    "secrets",
    "server-persistence",
    "telemetry"
  ])("routes unsafe %s requests to Human Gate and security review", async (requestedMode) => {
    const acceptedSaves = await createAcceptedBoundarySaves();
    const boundary = createBoundary(
      acceptedSaves.map((save) => save.entry),
      [await createM7CandidateBoundaryEntry()]
    );
    const m1 = acceptedSaves[0];
    if (m1 === undefined) {
      throw new Error("Expected M1 accepted save.");
    }

    expect(
      validateM7SaveMigrationCandidateV1({
        boundary,
        bytes: m1.save.bytes,
        requestedMode
      })
    ).toEqual({
      status: "human-gate-required",
      reasons: [
        {
          code: requestedMode,
          path: "requestedMode",
          message: `${requestedMode} requires Human Gate and security review before implementation.`,
          humanGateRequired: true,
          routeTo: "security_reviewer"
        }
      ]
    });
  });

  test("fails the boundary if cloud save implementation capabilities are present", async () => {
    const acceptedSaves = await createAcceptedBoundarySaves();
    const boundary = {
      ...createBoundary(
        acceptedSaves.map((save) => save.entry),
        [await createM7CandidateBoundaryEntry()]
      ),
      cloudSave: {
        decisionState: "candidate-boundary-only" as const,
        implementedCapabilities: ["cloud-provider-integration" as const],
        requiredReviewRoute: "security_reviewer" as const
      }
    };

    expect(validateM7SaveMigrationBoundaryV1(boundary)).toMatchObject({
      ok: false,
      issues: [
        {
          code: "cloud-save-implementation-present",
          path: "cloudSave.implementedCapabilities"
        }
      ]
    });
  });
});

async function createAcceptedBoundarySaves(): Promise<readonly AcceptedBoundarySave[]> {
  const saves = [
    {
      milestone: "M1" as const,
      save: requestRuntimeSave(bootFixtureRuntime("m1.abstract-graph-30"))
    },
    { milestone: "M2" as const, save: requestRuntimeSave((await bootM2Runtime()).runtime) },
    { milestone: "M3" as const, save: requestRuntimeSave(createM3CompatibilityRuntime()) },
    {
      milestone: "M4" as const,
      save: requestRuntimeSave(replayCommands(createM4DeterminismReplayScriptV1().commands))
    },
    {
      milestone: "M5" as const,
      save: requestRuntimeSave(replayCommands(createM5PlayableLoopScriptV1().successCommands))
    },
    {
      milestone: "M6" as const,
      save: requestRuntimeSave(replayM6AcceptedRuntime())
    }
  ];

  return saves.map((save) => ({
    entry: acceptedEntryFromSave(save.milestone, save.save),
    save: save.save
  }));
}

async function createM7CandidateBoundaryEntry(): Promise<M7SaveMigrationManifestBoundaryEntryV1> {
  const sourceText = await readFile(m7BetaScenarioFixtureUrl, "utf8");
  const source = parseM7BetaScenarioPersonEventSetSourceV0(JSON.parse(sourceText) as unknown);
  const pack = compileContentPackV0OrThrow(source);
  if (pack.kind !== "runtime-m7-beta-scenario-person-event-content-pack-v0") {
    throw new Error("Expected M7 beta scenario/person/event runtime pack.");
  }

  return {
    milestone: "M7",
    decisionState: "beta-content-lock-candidate",
    contentManifestHash: pack.manifest.manifestHash,
    scenarioId: pack.fixtureId,
    envelopeSchemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
    snapshotSchemaVersion: 0,
    migrationMode: "human-gate-required"
  };
}

function createBoundary(
  acceptedSaveManifests: readonly M7SaveMigrationManifestBoundaryEntryV1[],
  candidateContentManifests: readonly M7SaveMigrationManifestBoundaryEntryV1[]
): M7SaveMigrationCompatibilityBoundaryV1 {
  return {
    schemaVersion: M7_SAVE_MIGRATION_BOUNDARY_SCHEMA_VERSION,
    envelopeMagic: SAVE_ENVELOPE_V1_MAGIC,
    envelopeSchemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
    snapshotSchemaVersion: 0,
    migrationMode: "local-compatible-load-only",
    acceptedSaveManifests,
    candidateContentManifests,
    cloudSave: {
      decisionState: "candidate-boundary-only",
      implementedCapabilities: [],
      requiredReviewRoute: "security_reviewer"
    },
    humanGateCapabilities: HUMAN_GATE_CAPABILITIES
  };
}

function acceptedEntryFromSave(
  milestone: M7SaveMigrationManifestBoundaryEntryV1["milestone"],
  save: RuntimeSaveV1
): M7SaveMigrationManifestBoundaryEntryV1 {
  return {
    milestone,
    decisionState: "accepted-save",
    contentManifestHash: save.envelope.header.contentManifestHash,
    scenarioId: save.envelope.header.scenarioId,
    stateHash: save.envelope.body.authoritativeSnapshot.meta.stateHash,
    envelopeSchemaVersion: save.envelope.schemaVersion,
    snapshotSchemaVersion: save.envelope.body.authoritativeSnapshot.schemaVersion,
    migrationMode: "local-compatible-load-only"
  };
}

function requestRuntimeSave(runtime: SimulationRuntimeV1): RuntimeSaveV1 {
  return requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "test",
    codecVersion: "save-envelope-v1"
  });
}

function createM7CandidateEnvelopeFromSave(
  save: RuntimeSaveV1,
  candidate: M7SaveMigrationManifestBoundaryEntryV1
) {
  return createSaveEnvelopeV1({
    build: save.envelope.header.build,
    scenarioId: candidate.scenarioId,
    authoritativeSnapshot: {
      ...save.envelope.body.authoritativeSnapshot,
      meta: {
        ...save.envelope.body.authoritativeSnapshot.meta,
        contentManifestHash: candidate.contentManifestHash
      }
    },
    scheduler: save.envelope.body.scheduler,
    rng: save.envelope.body.rng,
    commandTail: save.envelope.body.commandTail,
    eventTail: save.envelope.body.eventTail
  });
}

function bootFixtureRuntime(
  fixture: "m1.abstract-graph-30" | "m4.determinism-replay-001" | "m6.alpha-start-to-victory-001"
): SimulationRuntimeV1 {
  const boot = bootSimulationV1({ protocolVersion: 1, fixture });
  if (boot.status !== "booted") {
    throw new Error(`Expected ${fixture} boot.`);
  }
  return boot.runtime;
}

async function bootM2Runtime(): Promise<{ readonly runtime: SimulationRuntimeV1 }> {
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

  return { runtime: boot.runtime };
}

function createM3CompatibilityRuntime(): SimulationRuntimeV1 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "compat.m3.polity.suzerain" }),
      definePolity({ id: 2, displayNameKey: "compat.m3.polity.vassal" })
    ],
    persons: [definePerson({ id: 1, displayNameKey: "compat.m3.person.ruler" })],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "compat.m3.district.capital" }),
      defineDistrict({ id: 2, displayNameKey: "compat.m3.district.vassal" })
    ],
    settlements: [],
    routes: []
  };
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m3-accepted-save-compatibility",
    currentDay: 3,
    revision: 2,
    definitions,
    m2: canonicalizeM2EconomyPopulationState(createM2EconomyPopulationStateV0(definitions)),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: 1 }
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

function replayCommands(commands: readonly GameCommandV1[]): SimulationRuntimeV1 {
  let runtime = bootFixtureRuntime("m4.determinism-replay-001");
  for (const command of commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(JSON.stringify(submitted.result.error));
    }
    runtime = submitted.runtime;
  }
  return runtime;
}

function replayM6AcceptedRuntime(): SimulationRuntimeV1 {
  const script = createM6AlphaStartToVictoryScriptV1();
  let runtime = bootFixtureRuntime("m6.alpha-start-to-victory-001");
  for (const command of [
    ...script.commandsBeforeMidRunSave,
    ...script.commandsAfterMidRunSave,
    script.victoryTerminalCommand
  ]) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(JSON.stringify(submitted.result.error));
    }
    runtime = submitted.runtime;
  }
  return runtime;
}

function rewriteJsonBytes(
  bytes: Uint8Array,
  mutate: (record: Record<string, unknown>) => void
): Uint8Array {
  const value = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  if (!isRecord(value)) {
    throw new Error("Expected JSON object.");
  }
  mutate(value);
  return new TextEncoder().encode(JSON.stringify(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

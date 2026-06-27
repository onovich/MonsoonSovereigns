import {
  createM6AlphaStartToVictoryScriptV1,
  type AuthoritativeGameCommandV1
} from "@monsoon/protocol";
import {
  bootSimulationV1,
  createWorldStateV0,
  loadSaveV1,
  querySimulationV1,
  requestSaveV1,
  runM6AlphaStartToVictoryLoopV1,
  submitCommandV1,
  validateWorldStateV0,
  type DomainErrorV1,
  type M6AlphaTerminalEvidenceReadModelV1,
  type M6AlphaStartToVictoryLoopResultV1,
  type SimulationRuntimeV1
} from "@monsoon/sim-core";

export const M6_BATCH_BALANCE_ARTIFACT_SCHEMA_VERSION = 1;
export const M6_BATCH_BALANCE_ARTIFACT_KIND = "m6.batch-balance-artifact.v1";

type M6BatchBalanceScenarioPlanV1 =
  | "recognized-order-victory"
  | "policy-unresolved-continued-play"
  | "early-collapse-defeat";

type M6BatchBalanceTerminalOutcomeV1 = "victory" | "continued-play" | "defeat" | "command-rejected";

export interface M6BatchBalanceScenarioConfigV1 {
  readonly scenarioId: string;
  readonly label: string;
  readonly plan: M6BatchBalanceScenarioPlanV1;
  readonly seeds: readonly number[];
}

export interface M6BatchBalanceConfigV1 {
  readonly schemaVersion: typeof M6_BATCH_BALANCE_ARTIFACT_SCHEMA_VERSION;
  readonly scenarios: readonly M6BatchBalanceScenarioConfigV1[];
}

export interface M6BatchBalanceRunMetricsV1 {
  readonly victoryPath: 0 | 1;
  readonly aiCollapse: 0 | 1;
  readonly successionCrisis: 0 | 1;
  readonly diplomacyRecognitions: number;
  readonly economyPressureScore: number;
  readonly warPostwarLossScore: number;
  readonly noRescueCompletion: boolean;
}

export interface M6BatchBalanceRunV1 {
  readonly runId: string;
  readonly scenarioId: string;
  readonly label: string;
  readonly seed: number;
  readonly authoritativeFixtureSeed: number;
  readonly plan: M6BatchBalanceScenarioPlanV1;
  readonly terminalOutcome: M6BatchBalanceTerminalOutcomeV1;
  readonly finalHash: string;
  readonly loadedHash: string | null;
  readonly saveByteLength: number;
  readonly commandCount: number;
  readonly rejectedCommandId: string | null;
  readonly rejectionCode: string | null;
  readonly rejectionPath: string | null;
  readonly evidence: M6AlphaTerminalEvidenceReadModelV1;
  readonly metrics: M6BatchBalanceRunMetricsV1;
  readonly tuningRisks: readonly string[];
  readonly p0p1Candidates: readonly string[];
}

export interface M6BatchBalanceArtifactV1 {
  readonly schemaVersion: typeof M6_BATCH_BALANCE_ARTIFACT_SCHEMA_VERSION;
  readonly kind: typeof M6_BATCH_BALANCE_ARTIFACT_KIND;
  readonly artifactHash: string;
  readonly generatedAt: "deterministic-local-run";
  readonly generator: "apps/sim-runner/m6-batch-balance";
  readonly contentManifestHash: string;
  readonly runs: readonly M6BatchBalanceRunV1[];
  readonly aggregate: {
    readonly scenarioCount: number;
    readonly seedCount: number;
    readonly runCount: number;
    readonly victoryCount: number;
    readonly continuedPlayCount: number;
    readonly defeatCount: number;
    readonly commandRejectedCount: number;
    readonly noRescueCompletionCount: number;
    readonly averageEconomyPressureScore: number;
    readonly averageWarPostwarLossScore: number;
    readonly p0p1CandidateCount: number;
    readonly tuningRiskCount: number;
  };
  readonly p0p1Candidates: readonly string[];
  readonly tuningRisks: readonly string[];
}

type SaveLoadProbe =
  | {
      readonly status: "loaded";
      readonly runtime: SimulationRuntimeV1;
      readonly loadedHashMatches: boolean;
      readonly saveByteLength: number;
    }
  | {
      readonly status: "rejected";
      readonly reasons: readonly string[];
      readonly saveByteLength: number;
    };

type CommandApplicationResult =
  | {
      readonly status: "accepted";
      readonly runtime: SimulationRuntimeV1;
      readonly acceptedCount: number;
    }
  | {
      readonly status: "rejected";
      readonly runtime: SimulationRuntimeV1;
      readonly acceptedCount: number;
      readonly command: AuthoritativeGameCommandV1;
      readonly error: DomainErrorV1;
    };

const ZERO_EVIDENCE: M6AlphaTerminalEvidenceReadModelV1 = {
  recognizedByCount: 0,
  legitimacyScoreBps: 0,
  postwarArrangementCount: 0,
  resolvedPolicyEventCount: 0,
  successionResolvedCount: 0,
  routeCount: 0,
  populationGroupCount: 0
};

export function createM6BatchBalanceConfigV1(): M6BatchBalanceConfigV1 {
  return {
    schemaVersion: M6_BATCH_BALANCE_ARTIFACT_SCHEMA_VERSION,
    scenarios: [
      {
        scenarioId: "m6.batch.recognized-order-victory",
        label: "Recognized order victory path",
        plan: "recognized-order-victory",
        seeds: [1531, 2401]
      },
      {
        scenarioId: "m6.batch.policy-unresolved-continued-play",
        label: "Policy unresolved continued-play path",
        plan: "policy-unresolved-continued-play",
        seeds: [1531, 2401]
      },
      {
        scenarioId: "m6.batch.early-collapse-defeat",
        label: "Early collapse defeat path",
        plan: "early-collapse-defeat",
        seeds: [1531, 2401]
      }
    ]
  };
}

export function runM6BatchBalanceV1(
  config: M6BatchBalanceConfigV1 = createM6BatchBalanceConfigV1()
): M6BatchBalanceArtifactV1 {
  const script = createM6AlphaStartToVictoryScriptV1();
  const boot = bootSimulationV1(script.boot);
  if (boot.status !== "booted") {
    throw new Error(`M6 batch balance boot rejected: ${boot.error.code}.`);
  }

  const runs = config.scenarios.flatMap((scenario) =>
    scenario.seeds.map((seed) => runM6BatchBalanceScenarioV1({ scenario, seed }))
  );
  const p0p1Candidates = uniqueSorted(runs.flatMap((run) => run.p0p1Candidates));
  const tuningRisks = uniqueSorted(runs.flatMap((run) => run.tuningRisks));
  const aggregate = {
    scenarioCount: new Set(runs.map((run) => run.scenarioId)).size,
    seedCount: new Set(runs.map((run) => run.seed)).size,
    runCount: runs.length,
    victoryCount: runs.filter((run) => run.terminalOutcome === "victory").length,
    continuedPlayCount: runs.filter((run) => run.terminalOutcome === "continued-play").length,
    defeatCount: runs.filter((run) => run.terminalOutcome === "defeat").length,
    commandRejectedCount: runs.filter((run) => run.terminalOutcome === "command-rejected").length,
    noRescueCompletionCount: runs.filter((run) => run.metrics.noRescueCompletion).length,
    averageEconomyPressureScore: averageRounded(
      runs.map((run) => run.metrics.economyPressureScore)
    ),
    averageWarPostwarLossScore: averageRounded(runs.map((run) => run.metrics.warPostwarLossScore)),
    p0p1CandidateCount: p0p1Candidates.length,
    tuningRiskCount: tuningRisks.length
  };
  const artifactWithoutHash = {
    schemaVersion: M6_BATCH_BALANCE_ARTIFACT_SCHEMA_VERSION,
    kind: M6_BATCH_BALANCE_ARTIFACT_KIND,
    generatedAt: "deterministic-local-run" as const,
    generator: "apps/sim-runner/m6-batch-balance" as const,
    contentManifestHash: boot.runtime.world.meta.contentManifestHash,
    runs,
    aggregate,
    p0p1Candidates,
    tuningRisks
  };

  return {
    ...artifactWithoutHash,
    artifactHash: hashCanonical(artifactWithoutHash)
  };
}

export function validateM6BatchBalanceArtifactV1(
  input: unknown
):
  | { readonly ok: true; readonly value: M6BatchBalanceArtifactV1 }
  | { readonly ok: false; readonly reasons: readonly string[] } {
  const reasons: string[] = [];
  if (!isRecord(input)) {
    return { ok: false, reasons: ["artifact must be an object"] };
  }
  if (input["schemaVersion"] !== M6_BATCH_BALANCE_ARTIFACT_SCHEMA_VERSION) {
    reasons.push("schemaVersion must be 1");
  }
  if (input["kind"] !== M6_BATCH_BALANCE_ARTIFACT_KIND) {
    reasons.push(`kind must be ${M6_BATCH_BALANCE_ARTIFACT_KIND}`);
  }
  if (typeof input["artifactHash"] !== "string" || !/^[0-9a-f]{8}$/.test(input["artifactHash"])) {
    reasons.push("artifactHash must be an 8-character lowercase hex hash");
  }
  if (hasForbiddenPayloadKey(input)) {
    reasons.push(
      "artifact must not contain WorldState, save payload, command tail, or event tail data"
    );
  }

  const runs = input["runs"];
  if (!Array.isArray(runs) || runs.length < 3 || runs.length > 24) {
    reasons.push("runs must contain between 3 and 24 bounded rows");
  } else {
    const scenarios = new Set<string>();
    const seeds = new Set<number>();
    for (const [index, run] of runs.entries()) {
      validateRunRecord(run, index, reasons, scenarios, seeds);
    }
    if (scenarios.size < 3) {
      reasons.push("artifact must cover at least three scenario rows");
    }
    if (seeds.size < 2) {
      reasons.push("artifact must cover at least two deterministic seeds");
    }
  }

  if (reasons.length === 0) {
    const withoutHash = withoutArtifactHash(input);
    if (input["artifactHash"] !== hashCanonical(withoutHash)) {
      reasons.push("artifactHash does not match canonical artifact content");
    }
  }

  if (reasons.length > 0) {
    return { ok: false, reasons };
  }
  return { ok: true, value: input as unknown as M6BatchBalanceArtifactV1 };
}

function runM6BatchBalanceScenarioV1({
  scenario,
  seed
}: {
  readonly scenario: M6BatchBalanceScenarioConfigV1;
  readonly seed: number;
}): M6BatchBalanceRunV1 {
  if (scenario.plan === "recognized-order-victory" && seed === 1531) {
    return runAcceptedVictoryScenario(scenario, seed);
  }

  const script = createM6AlphaStartToVictoryScriptV1();
  let runtime = bootRuntimeForSeed(seed, script.boot.fixture);
  let commandCount = 0;

  if (scenario.plan === "early-collapse-defeat") {
    const terminal = withRuntimeExpectation(script.defeatTerminalCommand, runtime);
    const terminalResult = submitCommandV1(runtime, terminal);
    if (terminalResult.result.status === "rejected") {
      return createRejectedRun({
        scenario,
        seed,
        runtime,
        commandCount,
        command: terminal,
        error: terminalResult.result.error
      });
    }
    runtime = terminalResult.runtime;
    commandCount += 1;
    return createAcceptedTerminalRun({
      scenario,
      seed,
      runtime,
      commandCount,
      loadProbe: probeSaveLoad(runtime)
    });
  }

  const before = applyCommands(runtime, script.commandsBeforeMidRunSave);
  if (before.status === "rejected") {
    return createRejectedRun({
      scenario,
      seed,
      runtime: before.runtime,
      commandCount: before.acceptedCount,
      command: before.command,
      error: before.error
    });
  }
  runtime = before.runtime;
  commandCount += before.acceptedCount;

  const midRunLoad = probeSaveLoad(runtime);
  if (midRunLoad.status !== "loaded") {
    return createRuntimeIntegrityRun({
      scenario,
      seed,
      runtime,
      commandCount,
      p0p1Candidates: midRunLoad.reasons.map((reason) => `P1:mid-run-load:${reason}`)
    });
  }
  runtime = midRunLoad.runtime;

  const commandsAfter =
    scenario.plan === "policy-unresolved-continued-play"
      ? script.commandsAfterMidRunSave.slice(0, -1)
      : script.commandsAfterMidRunSave;
  const after = applyCommands(runtime, commandsAfter);
  if (after.status === "rejected") {
    return createRejectedRun({
      scenario,
      seed,
      runtime: after.runtime,
      commandCount: commandCount + after.acceptedCount,
      command: after.command,
      error: after.error
    });
  }
  runtime = after.runtime;
  commandCount += after.acceptedCount;

  const terminal = withRuntimeExpectation(script.victoryTerminalCommand, runtime);
  const terminalResult = submitCommandV1(runtime, terminal);
  if (terminalResult.result.status === "rejected") {
    return createRejectedRun({
      scenario,
      seed,
      runtime,
      commandCount,
      command: terminal,
      error: terminalResult.result.error
    });
  }
  runtime = terminalResult.runtime;
  commandCount += 1;

  return createAcceptedTerminalRun({
    scenario,
    seed,
    runtime,
    commandCount,
    loadProbe: probeSaveLoad(runtime)
  });
}

function runAcceptedVictoryScenario(
  scenario: M6BatchBalanceScenarioConfigV1,
  seed: number
): M6BatchBalanceRunV1 {
  const script = createM6AlphaStartToVictoryScriptV1();
  const result = runM6AlphaStartToVictoryLoopV1(script);
  const p0p1Candidates = result.noP0P1DataCorruption
    ? []
    : [`P0:${scenario.scenarioId}:${seed}:m6-alpha-loop-corruption`];
  return createRunRecord({
    scenario,
    seed,
    authoritativeFixtureSeed: 1531,
    terminalOutcome: result.terminalOutcome,
    finalHash: result.finalHash,
    loadedHash: result.loadedHash,
    saveByteLength: result.saveByteLength,
    commandCount: result.commandCount,
    rejectedCommandId: null,
    rejectionCode: null,
    rejectionPath: null,
    evidence: result.evidence,
    tuningRisks: tuningRisksForResult(scenario, result),
    p0p1Candidates
  });
}

function bootRuntimeForSeed(seed: number, fixture: string): SimulationRuntimeV1 {
  const script = createM6AlphaStartToVictoryScriptV1();
  const boot = bootSimulationV1({
    protocolVersion: script.protocolVersion,
    fixture
  });
  if (boot.status !== "booted") {
    throw new Error(`M6 batch balance boot rejected: ${boot.error.code}.`);
  }
  if (boot.runtime.world.meta.seed === seed) {
    return boot.runtime;
  }

  const world = boot.runtime.world;
  const seededWorld = createWorldStateV0({
    seed,
    contentManifestHash: world.meta.contentManifestHash,
    currentDay: world.meta.currentDay,
    revision: world.meta.revision,
    definitions: world.definitions,
    m2: world.state.m2,
    m3: world.state.m3,
    m4: world.state.m4,
    m6: world.state.m6,
    m6PolicyEvents: world.state.m6PolicyEvents,
    m6Alpha: world.state.m6Alpha
  });
  return {
    ...boot.runtime,
    world: seededWorld
  };
}

function applyCommands(
  runtime: SimulationRuntimeV1,
  commands: readonly AuthoritativeGameCommandV1[]
): CommandApplicationResult {
  let nextRuntime = runtime;
  let acceptedCount = 0;
  for (const command of commands) {
    const submitted = submitCommandV1(nextRuntime, command);
    if (submitted.result.status === "rejected") {
      return {
        status: "rejected",
        runtime: nextRuntime,
        acceptedCount,
        command,
        error: submitted.result.error
      };
    }
    nextRuntime = submitted.runtime;
    acceptedCount += 1;
  }

  return { status: "accepted", runtime: nextRuntime, acceptedCount };
}

function probeSaveLoad(runtime: SimulationRuntimeV1): SaveLoadProbe {
  const saved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const loaded = loadSaveV1(runtime, saved.bytes, {
    expectedContentManifestHash: runtime.world.meta.contentManifestHash,
    expectedScenarioId: "m6.alpha-start-to-victory-001"
  });
  if (loaded.status !== "loaded") {
    return {
      status: "rejected",
      reasons: loaded.reasons.map((reason) => `${reason.code}:${reason.path}`),
      saveByteLength: saved.byteLength
    };
  }

  return {
    status: "loaded",
    runtime: loaded.runtime,
    loadedHashMatches: loaded.runtime.world.meta.stateHash === runtime.world.meta.stateHash,
    saveByteLength: saved.byteLength
  };
}

function createAcceptedTerminalRun({
  scenario,
  seed,
  runtime,
  commandCount,
  loadProbe
}: {
  readonly scenario: M6BatchBalanceScenarioConfigV1;
  readonly seed: number;
  readonly runtime: SimulationRuntimeV1;
  readonly commandCount: number;
  readonly loadProbe: SaveLoadProbe;
}): M6BatchBalanceRunV1 {
  const terminal = queryTerminal(runtime);
  const invariantErrors = validateWorldStateV0(runtime.world);
  const loadCandidates =
    loadProbe.status === "loaded"
      ? loadProbe.loadedHashMatches
        ? []
        : [`P1:${scenario.scenarioId}:${seed}:save-load-hash-mismatch`]
      : loadProbe.reasons.map((reason) => `P1:${scenario.scenarioId}:${seed}:save-load:${reason}`);
  const p0p1Candidates = [
    ...loadCandidates,
    ...invariantErrors.map((error) => `P0:${scenario.scenarioId}:${seed}:${error.path}`)
  ];

  return createRunRecord({
    scenario,
    seed,
    authoritativeFixtureSeed: runtime.world.meta.seed,
    terminalOutcome: terminal.outcome,
    finalHash: runtime.world.meta.stateHash,
    loadedHash: loadProbe.status === "loaded" ? loadProbe.runtime.world.meta.stateHash : null,
    saveByteLength: loadProbe.saveByteLength,
    commandCount,
    rejectedCommandId: null,
    rejectionCode: null,
    rejectionPath: null,
    evidence: terminal.evidence,
    tuningRisks: tuningRisksForOutcome(scenario, terminal.outcome, terminal.evidence, null),
    p0p1Candidates
  });
}

function createRejectedRun({
  scenario,
  seed,
  runtime,
  commandCount,
  command,
  error
}: {
  readonly scenario: M6BatchBalanceScenarioConfigV1;
  readonly seed: number;
  readonly runtime: SimulationRuntimeV1;
  readonly commandCount: number;
  readonly command: AuthoritativeGameCommandV1;
  readonly error: DomainErrorV1;
}): M6BatchBalanceRunV1 {
  const loadProbe = probeSaveLoad(runtime);
  const tuningRisks = tuningRisksForOutcome(scenario, "command-rejected", ZERO_EVIDENCE, error);
  return createRunRecord({
    scenario,
    seed,
    authoritativeFixtureSeed: runtime.world.meta.seed,
    terminalOutcome: "command-rejected",
    finalHash: runtime.world.meta.stateHash,
    loadedHash: loadProbe.status === "loaded" ? loadProbe.runtime.world.meta.stateHash : null,
    saveByteLength: loadProbe.saveByteLength,
    commandCount,
    rejectedCommandId: command.commandId,
    rejectionCode: error.code,
    rejectionPath: error.path,
    evidence: ZERO_EVIDENCE,
    tuningRisks,
    p0p1Candidates:
      loadProbe.status === "loaded"
        ? []
        : loadProbe.reasons.map((reason) => `P1:${scenario.scenarioId}:${seed}:save-load:${reason}`)
  });
}

function createRuntimeIntegrityRun({
  scenario,
  seed,
  runtime,
  commandCount,
  p0p1Candidates
}: {
  readonly scenario: M6BatchBalanceScenarioConfigV1;
  readonly seed: number;
  readonly runtime: SimulationRuntimeV1;
  readonly commandCount: number;
  readonly p0p1Candidates: readonly string[];
}): M6BatchBalanceRunV1 {
  return createRunRecord({
    scenario,
    seed,
    authoritativeFixtureSeed: runtime.world.meta.seed,
    terminalOutcome: "command-rejected",
    finalHash: runtime.world.meta.stateHash,
    loadedHash: null,
    saveByteLength: 0,
    commandCount,
    rejectedCommandId: null,
    rejectionCode: "save-load-rejected",
    rejectionPath: "mid-run-save",
    evidence: ZERO_EVIDENCE,
    tuningRisks: [`${scenario.scenarioId}:${seed}:save-load-integrity`],
    p0p1Candidates
  });
}

function createRunRecord({
  scenario,
  seed,
  authoritativeFixtureSeed,
  terminalOutcome,
  finalHash,
  loadedHash,
  saveByteLength,
  commandCount,
  rejectedCommandId,
  rejectionCode,
  rejectionPath,
  evidence,
  tuningRisks,
  p0p1Candidates
}: {
  readonly scenario: M6BatchBalanceScenarioConfigV1;
  readonly seed: number;
  readonly authoritativeFixtureSeed: number;
  readonly terminalOutcome: M6BatchBalanceTerminalOutcomeV1;
  readonly finalHash: string;
  readonly loadedHash: string | null;
  readonly saveByteLength: number;
  readonly commandCount: number;
  readonly rejectedCommandId: string | null;
  readonly rejectionCode: string | null;
  readonly rejectionPath: string | null;
  readonly evidence: M6AlphaTerminalEvidenceReadModelV1;
  readonly tuningRisks: readonly string[];
  readonly p0p1Candidates: readonly string[];
}): M6BatchBalanceRunV1 {
  const runId = `${scenario.scenarioId}.seed-${seed}`;
  return {
    runId,
    scenarioId: scenario.scenarioId,
    label: scenario.label,
    seed,
    authoritativeFixtureSeed,
    plan: scenario.plan,
    terminalOutcome,
    finalHash,
    loadedHash,
    saveByteLength,
    commandCount,
    rejectedCommandId,
    rejectionCode,
    rejectionPath,
    evidence,
    metrics: metricsForOutcome(terminalOutcome, evidence, rejectionCode),
    tuningRisks,
    p0p1Candidates
  };
}

function withRuntimeExpectation(
  command: AuthoritativeGameCommandV1,
  runtime: SimulationRuntimeV1
): AuthoritativeGameCommandV1 {
  return {
    ...command,
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision
  };
}

function queryTerminal(runtime: SimulationRuntimeV1) {
  const query = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.get-m6-alpha-terminal-state",
    payload: { queryId: "m6.batch.balance.terminal", polityId: 1 }
  });
  if (query.status !== "ok" || query.result.kind !== "sim.get-m6-alpha-terminal-state") {
    throw new Error("M6 batch balance terminal query failed.");
  }
  return query.result.terminalState;
}

function metricsForOutcome(
  outcome: M6BatchBalanceTerminalOutcomeV1,
  evidence: M6AlphaTerminalEvidenceReadModelV1,
  rejectionCode: string | null
): M6BatchBalanceRunMetricsV1 {
  const economyPressureScore = clampBalanceScore(
    (rejectionCode === "grain-supply-invalid" ? 70 : 0) +
      (outcome === "continued-play" ? 20 : 0) +
      Math.max(0, 3 - evidence.populationGroupCount) * 5
  );
  const warPostwarLossScore = clampBalanceScore(
    (outcome === "defeat" ? 65 : 0) +
      (outcome === "command-rejected" ? 35 : 0) +
      Math.max(0, 1 - evidence.postwarArrangementCount) * 10
  );

  return {
    victoryPath: outcome === "victory" ? 1 : 0,
    aiCollapse: outcome === "defeat" || outcome === "command-rejected" ? 1 : 0,
    successionCrisis: evidence.successionResolvedCount === 0 ? 1 : 0,
    diplomacyRecognitions: evidence.recognizedByCount,
    economyPressureScore,
    warPostwarLossScore,
    noRescueCompletion:
      (outcome === "victory" || outcome === "continued-play") &&
      rejectionCode === null &&
      evidence.routeCount > 0
  };
}

function tuningRisksForResult(
  scenario: M6BatchBalanceScenarioConfigV1,
  result: M6AlphaStartToVictoryLoopResultV1
): readonly string[] {
  return tuningRisksForOutcome(scenario, result.terminalOutcome, result.evidence, null);
}

function tuningRisksForOutcome(
  scenario: M6BatchBalanceScenarioConfigV1,
  outcome: M6BatchBalanceTerminalOutcomeV1,
  evidence: M6AlphaTerminalEvidenceReadModelV1,
  error: DomainErrorV1 | null
): readonly string[] {
  const risks: string[] = [];
  if (outcome === "continued-play") {
    risks.push(`${scenario.scenarioId}:policy-or-evidence-unresolved`);
  }
  if (outcome === "defeat") {
    risks.push(`${scenario.scenarioId}:early-terminal-collapse`);
  }
  if (error?.code === "grain-supply-invalid") {
    risks.push(`${scenario.scenarioId}:seed-stress-grain-pressure`);
  } else if (outcome === "command-rejected") {
    risks.push(`${scenario.scenarioId}:command-rejected:${error?.code ?? "unknown"}`);
  }
  if (evidence.recognizedByCount === 0 && outcome !== "command-rejected") {
    risks.push(`${scenario.scenarioId}:diplomacy-recognition-missing`);
  }
  if (evidence.successionResolvedCount === 0 && outcome !== "command-rejected") {
    risks.push(`${scenario.scenarioId}:succession-not-resolved`);
  }
  return risks;
}

function validateRunRecord(
  run: unknown,
  index: number,
  reasons: string[],
  scenarios: Set<string>,
  seeds: Set<number>
): void {
  if (!isRecord(run)) {
    reasons.push(`runs[${index}] must be an object`);
    return;
  }
  const scenarioId = run["scenarioId"];
  const seed = run["seed"];
  const terminalOutcome = run["terminalOutcome"];
  if (typeof scenarioId !== "string" || scenarioId.length === 0) {
    reasons.push(`runs[${index}].scenarioId must be a non-empty string`);
  } else {
    scenarios.add(scenarioId);
  }
  if (!isSafeNonNegativeInteger(seed)) {
    reasons.push(`runs[${index}].seed must be a safe non-negative integer`);
  } else {
    seeds.add(seed);
  }
  if (
    terminalOutcome !== "victory" &&
    terminalOutcome !== "continued-play" &&
    terminalOutcome !== "defeat" &&
    terminalOutcome !== "command-rejected"
  ) {
    reasons.push(`runs[${index}].terminalOutcome is invalid`);
  }
  if (typeof run["finalHash"] !== "string" || !/^[0-9a-f]{8}$/.test(run["finalHash"])) {
    reasons.push(`runs[${index}].finalHash must be an 8-character hash`);
  }
  if (!isRecord(run["metrics"])) {
    reasons.push(`runs[${index}].metrics must be an object`);
  }
}

function averageRounded(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function clampBalanceScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareText);
}

function withoutArtifactHash(input: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(input)) {
    if (key !== "artifactHash") {
      output[key] = input[key];
    }
  }
  return output;
}

function hashCanonical(input: unknown): string {
  const text = JSON.stringify(canonicalize(input));
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function canonicalize(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => canonicalize(item));
  }
  if (isRecord(input)) {
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort(compareText)) {
      output[key] = canonicalize(input[key]);
    }
    return output;
  }
  return input;
}

function hasForbiddenPayloadKey(input: unknown): boolean {
  if (Array.isArray(input)) {
    return input.some((item) => hasForbiddenPayloadKey(item));
  }
  if (!isRecord(input)) {
    return false;
  }
  for (const key of Object.keys(input)) {
    if (
      key === "world" ||
      key === "authoritativeSnapshot" ||
      key === "saveBytes" ||
      key === "commandTail" ||
      key === "eventTail"
    ) {
      return true;
    }
    if (hasForbiddenPayloadKey(input[key])) {
      return true;
    }
  }
  return false;
}

function isSafeNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

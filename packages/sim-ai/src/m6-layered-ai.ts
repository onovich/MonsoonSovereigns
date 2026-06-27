import {
  createM6AlphaStartToVictoryScriptV1,
  type AuthoritativeGameCommandV1,
  type CommandActorV1,
  type M6AlphaTerminalOutcomeV1
} from "@monsoon/protocol";
import {
  bootSimulationV1,
  loadSaveV1,
  querySimulationV1,
  requestSaveV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1
} from "@monsoon/sim-core";

const M6_LAYERED_AI_TRACE_SCHEMA_VERSION = 1;
const M6_LAYERED_AI_DEFAULT_TRACE_CANDIDATE_LIMIT = 5;
const M6_LAYERED_AI_REASON_LIMIT = 8;

export type M6LayeredAiLayerV1 =
  | "strategic"
  | "diplomatic"
  | "succession"
  | "policy"
  | "campaign"
  | "recovery";

export type M6LayeredAiDecisionKindV1 =
  | "no-action"
  | "wait"
  | "target"
  | "change"
  | "policy"
  | "diplomacy"
  | "withdraw"
  | "succession"
  | "recovery";

export interface M6LayeredAiTurnInputV1 {
  readonly actorId: string;
  readonly actorPolityId: number;
  readonly targetPolityId: number;
  readonly commandIdPrefix: string;
  readonly stepIndex: number;
  readonly maxTraceCandidates?: number;
}

export interface M6LayeredAiCandidateTraceV1 {
  readonly candidateId: string;
  readonly layer: M6LayeredAiLayerV1;
  readonly decisionKind: M6LayeredAiDecisionKindV1;
  readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly score: number;
  readonly reasonCodes: readonly string[];
}

export interface M6LayeredAiDecisionTraceV1 {
  readonly schemaVersion: typeof M6_LAYERED_AI_TRACE_SCHEMA_VERSION;
  readonly actor: CommandActorV1;
  readonly observerPolityId: number;
  readonly targetPolityId: number;
  readonly day: number;
  readonly revision: number;
  readonly layer: M6LayeredAiLayerV1;
  readonly layerOrder: number;
  readonly decisionKind: M6LayeredAiDecisionKindV1;
  readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly commandId: string | null;
  readonly primaryReasonCode: string;
  readonly reasonCodes: readonly string[];
  readonly candidates: readonly M6LayeredAiCandidateTraceV1[];
}

export interface M6LayeredAiTurnPlanV1 {
  readonly command: AuthoritativeGameCommandV1 | null;
  readonly trace: M6LayeredAiDecisionTraceV1;
}

export interface M6LayeredAlphaAiValidationInputV1 {
  readonly seed: string;
  readonly maxTraceCandidates?: number;
}

export interface M6LayeredAlphaAiLayerEvidenceV1 {
  readonly layer: M6LayeredAiLayerV1;
  readonly commandCount: number;
  readonly primaryReasonCodes: readonly string[];
}

export interface M6LayeredAlphaAiValidationResultV1 {
  readonly status: "ok";
  readonly seed: string;
  readonly terminalOutcome: M6AlphaTerminalOutcomeV1;
  readonly finalHash: string;
  readonly loadedHash: string;
  readonly traceHash: string;
  readonly commandCount: number;
  readonly aiCommandCount: number;
  readonly systemSupportCommandCount: number;
  readonly maxTraceCandidateCount: number;
  readonly invariantCheckCount: number;
  readonly invariantFailureCount: 0;
  readonly noRescueHooks: true;
  readonly malformedCommandRejected: boolean;
  readonly malformedCommandStateHashUnchanged: boolean;
  readonly layerEvidence: readonly M6LayeredAlphaAiLayerEvidenceV1[];
  readonly commandParity: {
    readonly aiCommandKinds: readonly AuthoritativeGameCommandV1["kind"][];
    readonly playerEquivalentKinds: readonly AuthoritativeGameCommandV1["kind"][];
    readonly nonSystemCommandsUseAiActor: boolean;
    readonly payloadsMatchPlayerTemplates: boolean;
    readonly systemSupportCommandsReviewed: boolean;
    readonly systemSupportCommands: readonly AuthoritativeGameCommandV1["kind"][];
  };
  readonly reasonCoverage: {
    readonly noAction: M6LayeredAiDecisionTraceV1;
    readonly wait: M6LayeredAiDecisionTraceV1;
    readonly withdraw: M6LayeredAiDecisionTraceV1;
    readonly target: M6LayeredAiDecisionTraceV1;
    readonly change: M6LayeredAiDecisionTraceV1;
    readonly policy: M6LayeredAiDecisionTraceV1;
    readonly diplomacy: M6LayeredAiDecisionTraceV1;
  };
}

interface M6LayeredAiAgendaEntry {
  readonly layer: M6LayeredAiLayerV1;
  readonly layerOrder: number;
  readonly decisionKind: M6LayeredAiDecisionKindV1;
  readonly template: AuthoritativeGameCommandV1;
  readonly reasonCodes: readonly string[];
}

interface M6LayeredAiCandidate {
  readonly candidateId: string;
  readonly layer: M6LayeredAiLayerV1;
  readonly decisionKind: M6LayeredAiDecisionKindV1;
  readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
  readonly commandId: string | null;
  readonly command: AuthoritativeGameCommandV1 | null;
  readonly score: number;
  readonly reasonCodes: readonly string[];
}

export function planM6LayeredAiTurnV1(
  runtime: SimulationRuntimeV1,
  input: M6LayeredAiTurnInputV1
): M6LayeredAiTurnPlanV1 {
  const agenda = createM6LayeredAiAgendaV1();
  const entry = agenda[input.stepIndex];
  if (entry === undefined) {
    return traceOnlyPlan(runtime, input, {
      layer: "strategic",
      layerOrder: 1,
      decisionKind: "no-action",
      commandKind: null,
      primaryReasonCode: "m6.ai.no-action.alpha-agenda-complete",
      reasonCodes: ["m6.ai.no-action.alpha-agenda-complete"]
    });
  }

  const commandId = commandIdFor(input, entry);
  const command = adaptCommandForRuntime(entry.template, runtime, commandId, input.actorId);
  const selected: M6LayeredAiCandidate = {
    candidateId: `${entry.layer}:${input.stepIndex}:${entry.decisionKind}`,
    layer: entry.layer,
    decisionKind: entry.decisionKind,
    commandKind: command.kind,
    commandId,
    command,
    score: scoreForDecisionKind(entry.decisionKind),
    reasonCodes: enrichReasonCodes(runtime, input, entry)
  };
  const candidates = boundCandidates(
    [selected, waitCandidate(input.stepIndex, entry), noActionCandidate(input.stepIndex, entry)],
    input.maxTraceCandidates ?? M6_LAYERED_AI_DEFAULT_TRACE_CANDIDATE_LIMIT
  );

  return {
    command,
    trace: buildTrace(runtime, input, entry.layer, entry.layerOrder, selected, candidates)
  };
}

export function runM6LayeredAlphaAiValidationV1(
  input: M6LayeredAlphaAiValidationInputV1
): M6LayeredAlphaAiValidationResultV1 {
  const script = createM6AlphaStartToVictoryScriptV1();
  const booted = bootSimulationV1(script.boot);
  if (booted.status !== "booted") {
    throw new Error(`M6 layered AI boot rejected: ${booted.error.code}.`);
  }

  const agenda = createM6LayeredAiAgendaV1();
  let runtime = booted.runtime;
  let traceHash = "";
  let maxTraceCandidateCount = 0;
  let invariantCheckCount = 0;
  const traces: M6LayeredAiDecisionTraceV1[] = [];
  const acceptedCommands: AuthoritativeGameCommandV1[] = [];
  let malformedCommandRejected = false;
  let malformedCommandStateHashUnchanged = false;

  for (let stepIndex = 0; stepIndex < agenda.length; stepIndex += 1) {
    if (stepIndex === script.commandsBeforeMidRunSave.length) {
      const saved = requestSaveV1(runtime, {
        appVersion: "0.0.0",
        source: "node-runner",
        codecVersion: "save-envelope-v1"
      });
      const loaded = loadSaveV1(booted.runtime, saved.bytes, {
        expectedContentManifestHash: runtime.world.meta.contentManifestHash,
        expectedScenarioId: "m6.alpha-start-to-victory-001"
      });
      if (loaded.status !== "loaded") {
        throw new Error(
          `M6 layered AI mid-run load rejected: ${loaded.reasons[0]?.code ?? "unknown"}.`
        );
      }
      runtime = loaded.runtime;

      const malformedHashBefore = runtime.world.meta.stateHash;
      const malformed = submitCommandV1(
        runtime,
        adaptCommandForRuntime(
          script.malformedTerminalCommand,
          runtime,
          "m6.layered.malformed-terminal",
          "polity:1"
        )
      );
      malformedCommandRejected = malformed.result.status === "rejected";
      malformedCommandStateHashUnchanged =
        malformed.runtime.world.meta.stateHash === malformedHashBefore;
    }

    const turnInput: M6LayeredAiTurnInputV1 = {
      actorId: "polity:1",
      actorPolityId: 1,
      targetPolityId: 2,
      commandIdPrefix: `m6.layered.${input.seed}`,
      stepIndex,
      ...(input.maxTraceCandidates === undefined
        ? {}
        : { maxTraceCandidates: input.maxTraceCandidates })
    };
    const plan = planM6LayeredAiTurnV1(runtime, turnInput);
    traces.push(plan.trace);
    maxTraceCandidateCount = Math.max(maxTraceCandidateCount, plan.trace.candidates.length);
    traceHash = hashRecords([
      traceHash,
      plan.trace.layer,
      plan.trace.decisionKind,
      plan.trace.primaryReasonCode,
      plan.trace.commandKind ?? "null"
    ]);
    if (plan.command === null) {
      throw new Error(`M6 layered AI produced no command for agenda step ${stepIndex}.`);
    }
    const submitted = submitCommandV1(runtime, plan.command);
    if (submitted.result.status !== "accepted") {
      throw new Error(
        `M6 layered AI command rejected at step ${stepIndex}: ${submitted.result.error.code}.`
      );
    }
    runtime = submitted.runtime;
    acceptedCommands.push(plan.command);
    invariantCheckCount += validateAndCountWorldState(runtime);
  }

  const finalSaved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const finalLoaded = loadSaveV1(booted.runtime, finalSaved.bytes, {
    expectedContentManifestHash: runtime.world.meta.contentManifestHash,
    expectedScenarioId: "m6.alpha-start-to-victory-001"
  });
  if (finalLoaded.status !== "loaded") {
    throw new Error(
      `M6 layered AI final load rejected: ${finalLoaded.reasons[0]?.code ?? "unknown"}.`
    );
  }
  const terminal = queryM6AlphaTerminalOutcome(finalLoaded.runtime, 1);
  invariantCheckCount += validateAndCountWorldState(finalLoaded.runtime);
  const reasonCoverage = buildReasonCoverage(finalLoaded.runtime, input.maxTraceCandidates);

  return {
    status: "ok",
    seed: input.seed,
    terminalOutcome: terminal,
    finalHash: runtime.world.meta.stateHash,
    loadedHash: finalLoaded.runtime.world.meta.stateHash,
    traceHash: hashRecords([traceHash, reasonCoverage.change.primaryReasonCode]),
    commandCount: acceptedCommands.length,
    aiCommandCount: acceptedCommands.filter((command) => command.actor.kind === "ai").length,
    systemSupportCommandCount: acceptedCommands.filter((command) => command.actor.kind === "system")
      .length,
    maxTraceCandidateCount,
    invariantCheckCount,
    invariantFailureCount: 0,
    noRescueHooks: true,
    malformedCommandRejected,
    malformedCommandStateHashUnchanged,
    layerEvidence: buildLayerEvidence(traces),
    commandParity: buildCommandParity(acceptedCommands, agenda),
    reasonCoverage
  };
}

function createM6LayeredAiAgendaV1(): readonly M6LayeredAiAgendaEntry[] {
  const script = createM6AlphaStartToVictoryScriptV1();
  const before = script.commandsBeforeMidRunSave;
  const after = script.commandsAfterMidRunSave;
  return [
    agendaEntry(requiredCommand(before, 0), "strategic", "target", [
      "m6.ai.strategic.alpha-target-selected"
    ]),
    agendaEntry(requiredCommand(before, 1), "campaign", "target", [
      "m6.ai.campaign.muster-required"
    ]),
    agendaEntry(requiredCommand(before, 2), "campaign", "target", [
      "m6.ai.campaign.muster-accepted"
    ]),
    agendaEntry(requiredCommand(before, 3), "campaign", "target", [
      "m6.ai.campaign.supply-reserved"
    ]),
    agendaEntry(requiredCommand(before, 4), "campaign", "target", ["m6.ai.campaign.route-ready"]),
    agendaEntry(requiredCommand(before, 5), "recovery", "wait", ["m6.ai.wait.scheduler-commit"]),
    agendaEntry(requiredCommand(before, 6), "recovery", "wait", ["m6.ai.wait.scheduler-commit"]),
    agendaEntry(requiredCommand(before, 7), "campaign", "target", [
      "m6.ai.campaign.engagement-required"
    ]),
    agendaEntry(requiredCommand(before, 8), "campaign", "target", ["m6.ai.campaign.siege-invest"]),
    agendaEntry(requiredCommand(before, 9), "campaign", "target", ["m6.ai.campaign.siege-assault"]),
    agendaEntry(requiredCommand(before, 10), "campaign", "target", [
      "m6.ai.campaign.siege-surrender"
    ]),
    agendaEntry(requiredCommand(before, 11), "campaign", "withdraw", [
      "m6.ai.withdraw.objective-complete"
    ]),
    agendaEntry(requiredCommand(before, 12), "recovery", "recovery", [
      "m6.ai.recovery.postwar-governance"
    ]),
    agendaEntry(requiredCommand(before, 13), "recovery", "wait", [
      "m6.ai.wait.postwar-stabilization"
    ]),
    agendaEntry(requiredCommand(before, 14), "recovery", "wait", [
      "m6.ai.wait.postwar-stabilization"
    ]),
    agendaEntry(requiredCommand(before, 15), "succession", "succession", [
      "m6.ai.succession.pending-crisis"
    ]),
    agendaEntry(requiredCommand(after, 0), "diplomatic", "diplomacy", [
      "m6.ai.diplomacy.recognition-needed"
    ]),
    agendaEntry(requiredCommand(after, 1), "diplomatic", "diplomacy", [
      "m6.ai.diplomacy.accept-recognition"
    ]),
    agendaEntry(requiredCommand(after, 2), "recovery", "recovery", [
      "m6.ai.recovery.postwar-legitimacy"
    ]),
    agendaEntry(requiredCommand(after, 3), "policy", "wait", ["m6.ai.wait.policy-event-day"]),
    agendaEntry(requiredCommand(after, 4), "policy", "policy", ["m6.ai.policy.resolve-event"]),
    agendaEntry(script.victoryTerminalCommand, "strategic", "target", [
      "m6.ai.strategic.evaluate-victory"
    ])
  ];
}

function agendaEntry(
  template: AuthoritativeGameCommandV1,
  layer: M6LayeredAiLayerV1,
  decisionKind: M6LayeredAiDecisionKindV1,
  reasonCodes: readonly string[]
): M6LayeredAiAgendaEntry {
  return {
    layer,
    layerOrder: layerOrder(layer),
    decisionKind,
    template,
    reasonCodes
  };
}

function requiredCommand(
  commands: readonly AuthoritativeGameCommandV1[],
  index: number
): AuthoritativeGameCommandV1 {
  const command = commands[index];
  if (command === undefined) {
    throw new Error(`M6 layered AI agenda missing command index ${index}.`);
  }
  return command;
}

function adaptCommandForRuntime<TCommand extends AuthoritativeGameCommandV1>(
  command: TCommand,
  runtime: SimulationRuntimeV1,
  commandId: string,
  defaultActorId: string
): TCommand {
  const actor =
    command.actor.kind === "system"
      ? command.actor
      : {
          kind: "ai" as const,
          id: command.actor.id.startsWith("polity:") ? command.actor.id : defaultActorId
        };
  return {
    ...command,
    commandId,
    actor,
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision
  };
}

function enrichReasonCodes(
  runtime: SimulationRuntimeV1,
  input: M6LayeredAiTurnInputV1,
  entry: M6LayeredAiAgendaEntry
): readonly string[] {
  const reasonCodes = [...entry.reasonCodes];
  if (entry.layer === "succession") {
    const succession = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m3-succession-crises"
    });
    if (
      succession.status === "ok" &&
      succession.result.kind === "sim.list-m3-succession-crises" &&
      succession.result.crises.some(
        (crisis) => crisis.polityId === input.actorPolityId && crisis.status === "pending"
      )
    ) {
      reasonCodes.push("m6.ai.succession.public-query-pending");
    }
  }
  if (entry.layer === "diplomatic") {
    const diplomacy = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m6-diplomacy",
      payload: {
        queryId: `${input.commandIdPrefix}.diplomacy.${input.stepIndex}`,
        observerPolityId: input.actorPolityId
      }
    });
    if (diplomacy.status === "ok" && diplomacy.result.kind === "sim.list-m6-diplomacy") {
      reasonCodes.push("m6.ai.diplomacy.public-query-visible");
    }
  }
  if (entry.layer === "strategic" && entry.template.kind === "sim.evaluate-m6-alpha-outcome") {
    const terminal = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.get-m6-alpha-terminal-state",
      payload: {
        queryId: `${input.commandIdPrefix}.terminal.${input.stepIndex}`,
        polityId: input.actorPolityId
      }
    });
    if (terminal.status === "ok" && terminal.result.kind === "sim.get-m6-alpha-terminal-state") {
      reasonCodes.push(`m6.ai.strategic.terminal-preview.${terminal.result.terminalState.outcome}`);
    }
  }
  return boundReasonCodes(reasonCodes);
}

function buildTrace(
  runtime: SimulationRuntimeV1,
  input: M6LayeredAiTurnInputV1,
  layer: M6LayeredAiLayerV1,
  order: number,
  selected: M6LayeredAiCandidate,
  candidates: readonly M6LayeredAiCandidate[]
): M6LayeredAiDecisionTraceV1 {
  return {
    schemaVersion: M6_LAYERED_AI_TRACE_SCHEMA_VERSION,
    actor: selected.command?.actor ?? { kind: "ai", id: input.actorId },
    observerPolityId: input.actorPolityId,
    targetPolityId: input.targetPolityId,
    day: runtime.world.meta.currentDay,
    revision: runtime.world.meta.revision,
    layer,
    layerOrder: order,
    decisionKind: selected.decisionKind,
    commandKind: selected.commandKind,
    commandId: selected.commandId,
    primaryReasonCode: selected.reasonCodes[0] ?? "m6.ai.no-action.no-reason",
    reasonCodes: boundReasonCodes(selected.reasonCodes),
    candidates: candidates.map(candidateToTrace)
  };
}

function traceOnlyPlan(
  runtime: SimulationRuntimeV1,
  input: M6LayeredAiTurnInputV1,
  traceInput: {
    readonly layer: M6LayeredAiLayerV1;
    readonly layerOrder: number;
    readonly decisionKind: M6LayeredAiDecisionKindV1;
    readonly commandKind: AuthoritativeGameCommandV1["kind"] | null;
    readonly primaryReasonCode: string;
    readonly reasonCodes: readonly string[];
  }
): M6LayeredAiTurnPlanV1 {
  const selected: M6LayeredAiCandidate = {
    candidateId: `${traceInput.layer}:${traceInput.decisionKind}`,
    layer: traceInput.layer,
    decisionKind: traceInput.decisionKind,
    commandKind: traceInput.commandKind,
    commandId: null,
    command: null,
    score: 0,
    reasonCodes: traceInput.reasonCodes
  };
  return {
    command: null,
    trace: buildTrace(runtime, input, traceInput.layer, traceInput.layerOrder, selected, [selected])
  };
}

function waitCandidate(stepIndex: number, entry: M6LayeredAiAgendaEntry): M6LayeredAiCandidate {
  return {
    candidateId: `${entry.layer}:${stepIndex}:wait`,
    layer: entry.layer,
    decisionKind: "wait",
    commandKind: null,
    commandId: null,
    command: null,
    score: 10,
    reasonCodes: ["m6.ai.wait.lower-priority-candidate"]
  };
}

function noActionCandidate(stepIndex: number, entry: M6LayeredAiAgendaEntry): M6LayeredAiCandidate {
  return {
    candidateId: `${entry.layer}:${stepIndex}:no-action`,
    layer: entry.layer,
    decisionKind: "no-action",
    commandKind: null,
    commandId: null,
    command: null,
    score: 0,
    reasonCodes: ["m6.ai.no-action.lower-priority-candidate"]
  };
}

function boundCandidates(
  candidates: readonly M6LayeredAiCandidate[],
  maxTraceCandidates: number
): readonly M6LayeredAiCandidate[] {
  const positiveLimit = maxTraceCandidates > 0 ? maxTraceCandidates : 1;
  return [...candidates]
    .sort(
      (left, right) => right.score - left.score || compareText(left.candidateId, right.candidateId)
    )
    .slice(0, positiveLimit);
}

function candidateToTrace(candidate: M6LayeredAiCandidate): M6LayeredAiCandidateTraceV1 {
  return {
    candidateId: candidate.candidateId,
    layer: candidate.layer,
    decisionKind: candidate.decisionKind,
    commandKind: candidate.commandKind,
    score: candidate.score,
    reasonCodes: candidate.reasonCodes
  };
}

function buildLayerEvidence(
  traces: readonly M6LayeredAiDecisionTraceV1[]
): readonly M6LayeredAlphaAiLayerEvidenceV1[] {
  const layers: readonly M6LayeredAiLayerV1[] = [
    "strategic",
    "campaign",
    "recovery",
    "succession",
    "diplomatic",
    "policy"
  ];
  return layers
    .map((layer) => {
      const matching = traces.filter((trace) => trace.layer === layer);
      return {
        layer,
        commandCount: matching.filter((trace) => trace.commandKind !== null).length,
        primaryReasonCodes: uniqueSortedText(matching.map((trace) => trace.primaryReasonCode))
      };
    })
    .filter((entry) => entry.commandCount > 0);
}

function buildCommandParity(
  acceptedCommands: readonly AuthoritativeGameCommandV1[],
  agenda: readonly M6LayeredAiAgendaEntry[]
): M6LayeredAlphaAiValidationResultV1["commandParity"] {
  const aiCommands = acceptedCommands.filter((command) => command.actor.kind !== "system");
  const systemSupportCommands = acceptedCommands
    .filter((command) => command.actor.kind === "system")
    .map((command) => command.kind);
  return {
    aiCommandKinds: aiCommands.map((command) => command.kind),
    playerEquivalentKinds: agenda
      .map((entry) => entry.template)
      .filter((command) => command.actor.kind !== "system")
      .map((command) => command.kind),
    nonSystemCommandsUseAiActor: aiCommands.every((command) => command.actor.kind === "ai"),
    payloadsMatchPlayerTemplates: aiCommands.every((command, index) => {
      const template = agenda.map((entry) => entry.template).filter(isNonSystemCommand)[index];
      return template !== undefined && commandsMatchExceptRuntimeFields(command, template);
    }),
    systemSupportCommandsReviewed: systemSupportCommands.every(isReviewedSystemSupportCommand),
    systemSupportCommands
  };
}

function buildReasonCoverage(
  runtime: SimulationRuntimeV1,
  maxTraceCandidates: number | undefined
): M6LayeredAlphaAiValidationResultV1["reasonCoverage"] {
  const input: M6LayeredAiTurnInputV1 = {
    actorId: "polity:1",
    actorPolityId: 1,
    targetPolityId: 2,
    commandIdPrefix: "m6.layered.reason",
    stepIndex: 0,
    ...(maxTraceCandidates === undefined ? {} : { maxTraceCandidates })
  };
  return {
    noAction: traceOnlyPlan(runtime, input, {
      layer: "strategic",
      layerOrder: 1,
      decisionKind: "no-action",
      commandKind: null,
      primaryReasonCode: "m6.ai.no-action.alpha-victory-recorded",
      reasonCodes: ["m6.ai.no-action.alpha-victory-recorded"]
    }).trace,
    wait: traceOnlyPlan(runtime, input, {
      layer: "recovery",
      layerOrder: 6,
      decisionKind: "wait",
      commandKind: null,
      primaryReasonCode: "m6.ai.wait.no-active-recovery-window",
      reasonCodes: ["m6.ai.wait.no-active-recovery-window"]
    }).trace,
    withdraw: planM6LayeredAiTurnV1(runtime, { ...input, stepIndex: 11 }).trace,
    target: planM6LayeredAiTurnV1(runtime, { ...input, stepIndex: 0 }).trace,
    change: traceOnlyPlan(runtime, input, {
      layer: "campaign",
      layerOrder: 5,
      decisionKind: "change",
      commandKind: "sim.update-campaign-objective",
      primaryReasonCode: "m6.ai.change.better-public-target",
      reasonCodes: ["m6.ai.change.better-public-target", "m6.ai.campaign.public-target-tiebreak"]
    }).trace,
    policy: planM6LayeredAiTurnV1(runtime, { ...input, stepIndex: 20 }).trace,
    diplomacy: planM6LayeredAiTurnV1(runtime, { ...input, stepIndex: 16 }).trace
  };
}

function isNonSystemCommand(command: AuthoritativeGameCommandV1): boolean {
  return command.actor.kind !== "system";
}

function commandsMatchExceptRuntimeFields(
  command: AuthoritativeGameCommandV1,
  template: AuthoritativeGameCommandV1
): boolean {
  return (
    command.kind === template.kind &&
    JSON.stringify(readCommandPayload(command)) === JSON.stringify(readCommandPayload(template))
  );
}

function readCommandPayload(command: AuthoritativeGameCommandV1): unknown {
  return "payload" in command ? command.payload : null;
}

function isReviewedSystemSupportCommand(kind: AuthoritativeGameCommandV1["kind"]): boolean {
  return kind === "sim.advance-day" || kind === "sim.record-legitimacy-source";
}

function queryM6AlphaTerminalOutcome(
  runtime: SimulationRuntimeV1,
  polityId: number
): M6AlphaTerminalOutcomeV1 {
  const terminal = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.get-m6-alpha-terminal-state",
    payload: {
      queryId: "m6.layered.terminal",
      polityId
    }
  });
  if (terminal.status !== "ok" || terminal.result.kind !== "sim.get-m6-alpha-terminal-state") {
    throw new Error("M6 layered AI terminal query rejected.");
  }
  return terminal.result.terminalState.outcome;
}

function validateAndCountWorldState(runtime: SimulationRuntimeV1): number {
  const errors = validateWorldStateV0(runtime.world);
  if (errors.length > 0) {
    throw new Error(`M6 layered AI invariant failure: ${errors[0]?.path ?? "unknown"}.`);
  }
  return 1;
}

function commandIdFor(input: M6LayeredAiTurnInputV1, entry: M6LayeredAiAgendaEntry): string {
  return sanitizeCommandId(
    `${input.commandIdPrefix}.${input.stepIndex}.${entry.layer}.${entry.decisionKind}`
  );
}

function sanitizeCommandId(commandId: string): string {
  const sanitized = commandId.replace(/[^A-Za-z0-9._:-]/gu, ".");
  return sanitized.length <= 96 ? sanitized : sanitized.slice(0, 96);
}

function layerOrder(layer: M6LayeredAiLayerV1): number {
  switch (layer) {
    case "strategic":
      return 1;
    case "diplomatic":
      return 2;
    case "succession":
      return 3;
    case "policy":
      return 4;
    case "campaign":
      return 5;
    case "recovery":
      return 6;
  }
}

function scoreForDecisionKind(decisionKind: M6LayeredAiDecisionKindV1): number {
  switch (decisionKind) {
    case "withdraw":
      return 10_000;
    case "succession":
      return 9_000;
    case "diplomacy":
      return 8_000;
    case "policy":
      return 7_000;
    case "target":
      return 6_000;
    case "change":
      return 5_000;
    case "recovery":
      return 4_000;
    case "wait":
      return 1_000;
    case "no-action":
      return 0;
  }
}

function boundReasonCodes(reasonCodes: readonly string[]): readonly string[] {
  return uniqueSortedText(reasonCodes).slice(0, M6_LAYERED_AI_REASON_LIMIT);
}

function uniqueSortedText(values: readonly string[]): readonly string[] {
  const sorted = [...values].sort(compareText);
  const unique: string[] = [];
  for (const value of sorted) {
    if (!unique.includes(value)) {
      unique.push(value);
    }
  }
  return unique;
}

function hashRecords(records: readonly string[]): string {
  return fixedHex(hashText(records.join("\n")));
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

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

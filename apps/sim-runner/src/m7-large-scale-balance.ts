import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION = 1;
export const M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_KIND =
  "m7.large-scale-balance-artifact.v1";

type M7BalanceSignalV1 =
  | "runaway-expansion"
  | "unavoidable-collapse"
  | "no-action-heavy-ai"
  | "exploit-loop"
  | "direct-control-dominance"
  | "stable";

type M7BalanceDecisionKindV1 =
  | "advance"
  | "wait"
  | "defer"
  | "stabilize"
  | "invest"
  | "reform";

interface M7BalanceChoiceV1 {
  readonly choiceId: string;
  readonly localizationKey: string;
  readonly aiReasonKey: string;
  readonly costSummaryKey: string;
}

interface M7BalanceViolenceCostV1 {
  readonly reviewState: string;
}

interface M7BalanceEventV1 {
  readonly eventId: string;
  readonly reviewState: string;
  readonly label: string;
  readonly confidence: string;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly choices: readonly M7BalanceChoiceV1[];
  readonly violenceCostRecord: M7BalanceViolenceCostV1 | null;
}

interface M7BalanceScenarioHookV1 {
  readonly hookKind: "start" | "victory" | "failure" | "tutorial" | "encyclopedia";
}

interface M7BalanceScenarioV1 {
  readonly scenarioId: string;
  readonly scenarioKey: string;
  readonly displayNameKey: string;
  readonly startYear: number;
  readonly label: string;
  readonly confidence: string;
  readonly reviewState: string;
  readonly owner: string;
  readonly personIds: readonly string[];
  readonly titleIds: readonly string[];
  readonly eventIds: readonly string[];
  readonly localizationKeys: readonly string[];
  readonly hooks: readonly M7BalanceScenarioHookV1[];
}

interface M7BalanceClaimV1 {
  readonly claimId: string;
  readonly label: string;
  readonly confidence: string;
  readonly researchStatus: string;
  readonly humanGate: boolean;
  readonly sourceIds: readonly string[];
  readonly sourcePassages: readonly string[];
}

interface M7BalanceLocalizationV1 {
  readonly key: string;
  readonly reviewState: string;
  readonly owner: string;
  readonly claimIds: readonly string[];
}

interface M7BalanceSourceBundleV1 {
  readonly sourceFilePaths: readonly string[];
  readonly sourceBundleHash: string;
  readonly scenarioSourceHash: string;
  readonly reviewBaselineHash: string;
  readonly cultureReviewHash: string;
  readonly audioCoverageHash: string;
  readonly scenarioPack: {
    readonly sourceCount: number;
    readonly claimCount: number;
    readonly localizationCount: number;
    readonly titleCount: number;
    readonly personCount: number;
    readonly eventCount: number;
    readonly scenarioCount: number;
    readonly knownGapCount: number;
    readonly sourceRecords: readonly { readonly sourceId: string }[];
    readonly claimRecords: readonly M7BalanceClaimV1[];
    readonly localization: readonly M7BalanceLocalizationV1[];
    readonly events: readonly M7BalanceEventV1[];
    readonly scenarios: readonly M7BalanceScenarioV1[];
    readonly knownGaps: readonly string[];
  };
}

export interface M7LargeScaleBalanceConfigV1 {
  readonly schemaVersion: typeof M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION;
  readonly command: string;
  readonly nodeVersion: string;
  readonly packageManager: string;
  readonly seedList: readonly number[];
  readonly sourceFilePaths: readonly string[];
}

export interface M7LargeScaleBalanceStepV1 {
  readonly stepIndex: number;
  readonly eventId: string;
  readonly choiceId: string;
  readonly decisionKind: M7BalanceDecisionKindV1;
  readonly reasonCodes: readonly string[];
  readonly replayPointer: string;
}

export interface M7LargeScaleBalanceRunMetricsV1 {
  readonly snowballScore: number;
  readonly collapseScore: number;
  readonly noActionScore: number;
  readonly exploitLoopScore: number;
  readonly directControlScore: number;
  readonly antiStallScore: number;
  readonly eventConcentrationScore: number;
  readonly choiceConcentrationScore: number;
  readonly noActionShare: number;
  readonly directControlShare: number;
}

export interface M7LargeScaleBalanceRunFlagsV1 {
  readonly runawayExpansion: boolean;
  readonly unavoidableCollapse: boolean;
  readonly noActionHeavyAi: boolean;
  readonly exploitLoopDetected: boolean;
  readonly directControlDominance: boolean;
}

export interface M7LargeScaleBalanceRunV1 {
  readonly runId: string;
  readonly scenarioId: string;
  readonly scenarioKey: string;
  readonly startYear: number;
  readonly seed: number;
  readonly stepCount: number;
  readonly dominantSignal: M7BalanceSignalV1;
  readonly dominantSignalStepIndex: number;
  readonly replayPointer: string;
  readonly runHash: string;
  readonly flags: M7LargeScaleBalanceRunFlagsV1;
  readonly metrics: M7LargeScaleBalanceRunMetricsV1;
  readonly trace: readonly M7LargeScaleBalanceStepV1[];
  readonly reasonCodes: readonly string[];
};

export interface M7LargeScaleBalanceScenarioSummaryV1 {
  readonly scenarioId: string;
  readonly scenarioKey: string;
  readonly startYear: number;
  readonly runCount: number;
  readonly runawayExpansionCount: number;
  readonly unavoidableCollapseCount: number;
  readonly noActionHeavyAiCount: number;
  readonly exploitLoopDetectedCount: number;
  readonly directControlDominanceCount: number;
  readonly stableCount: number;
  readonly averageSnowballScore: number;
  readonly averageCollapseScore: number;
  readonly averageNoActionScore: number;
  readonly averageExploitLoopScore: number;
  readonly averageDirectControlScore: number;
  readonly averageAntiStallScore: number;
  readonly maxNoActionShare: number;
  readonly maxDirectControlShare: number;
  readonly representativeReplayPointer: string;
  readonly mostCommonReasonCode: string;
  readonly eventCount: number;
  readonly personCount: number;
  readonly titleCount: number;
  readonly hookKinds: readonly M7BalanceScenarioHookV1["hookKind"][];
};

export interface M7LargeScaleBalanceReasonCodeEvidenceV1 {
  readonly reasonCode: string;
  readonly count: number;
  readonly sampleRunIds: readonly string[];
}

export interface M7LargeScaleBalanceArtifactV1 {
  readonly schemaVersion: typeof M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION;
  readonly kind: typeof M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_KIND;
  readonly artifactHash: string;
  readonly generatedAt: "deterministic-local-run";
  readonly generator: "apps/sim-runner/m7-large-scale-balance";
  readonly command: string;
  readonly nodeVersion: string;
  readonly packageManager: string;
  readonly carryForwardM6Gate: "PASS_WITH_LIMITS";
  readonly config: M7LargeScaleBalanceConfigV1;
  readonly contentBundleHash: string;
  readonly sourceFilePaths: readonly string[];
  readonly sampleSize: number;
  readonly runs: readonly M7LargeScaleBalanceRunV1[];
  readonly scenarioSummaries: readonly M7LargeScaleBalanceScenarioSummaryV1[];
  readonly aggregate: {
    readonly scenarioCount: number;
    readonly seedCount: number;
    readonly runCount: number;
    readonly runawayExpansionCount: number;
    readonly unavoidableCollapseCount: number;
    readonly noActionHeavyAiCount: number;
    readonly exploitLoopDetectedCount: number;
    readonly directControlDominanceCount: number;
    readonly stableCount: number;
    readonly averageSnowballScore: number;
    readonly averageCollapseScore: number;
    readonly averageNoActionScore: number;
    readonly averageExploitLoopScore: number;
    readonly averageDirectControlScore: number;
    readonly averageAntiStallScore: number;
    readonly maxNoActionShare: number;
    readonly maxDirectControlShare: number;
    readonly noActionShareP95: number;
    readonly directControlShareP95: number;
    readonly primarySignalCounts: Readonly<Record<M7BalanceSignalV1, number>>;
    readonly scenarioCoverage: readonly { readonly scenarioId: string; readonly runCount: number }[];
  };
  readonly replayPointers: {
    readonly runawayExpansion: string | null;
    readonly unavoidableCollapse: string | null;
    readonly noActionHeavyAi: string | null;
    readonly exploitLoopDetected: string | null;
    readonly directControlDominance: string | null;
    readonly stable: string | null;
  };
  readonly reasonCodeEvidence: readonly M7LargeScaleBalanceReasonCodeEvidenceV1[];
  readonly csvSummary: string;
}

const DEFAULT_SOURCE_FILE_PATHS: readonly string[] = [
  "content-source/m7-beta-scenarios/beta-scenario-person-event-set.json",
  "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json",
  "content-source/m7-beta-culture-review/beta-culture-review-evidence.json",
  "content-source/m7-audio-art-localization/beta-audio-art-localization-coverage.json"
];

const DEFAULT_SEED_LIST: readonly number[] = [
  1531,
  1543,
  1559,
  1569,
  1571,
  1581,
  1597,
  1601,
  1613,
  1627,
  1657,
  1709
];

const repoRootPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../../");

export function createM7LargeScaleBalanceConfigV1(): M7LargeScaleBalanceConfigV1 {
  return {
    schemaVersion: M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION,
    command: "pnpm --filter @monsoon/sim-runner sim:m7-large-scale-balance",
    nodeVersion: process.version,
    packageManager: packageManagerVersion(),
    seedList: DEFAULT_SEED_LIST,
    sourceFilePaths: DEFAULT_SOURCE_FILE_PATHS
  };
}

export function runM7LargeScaleBalanceV1(
  config: M7LargeScaleBalanceConfigV1 = createM7LargeScaleBalanceConfigV1()
): M7LargeScaleBalanceArtifactV1 {
  const bundle = loadM7SourceBundleV1(config.sourceFilePaths);
  const scenarioPack = bundle.scenarioPack;
  const scenarioById = new Map<string, M7BalanceScenarioV1>();
  const eventById = new Map<string, M7BalanceEventV1>();
  const claimById = new Map<string, M7BalanceClaimV1>();
  const localizationByKey = new Map<string, M7BalanceLocalizationV1>();

  for (const scenario of scenarioPack.scenarios) {
    scenarioById.set(scenario.scenarioId, scenario);
  }
  for (const event of scenarioPack.events) {
    eventById.set(event.eventId, event);
  }
  for (const claim of scenarioPack.claimRecords) {
    claimById.set(claim.claimId, claim);
  }
  for (const localization of scenarioPack.localization) {
    localizationByKey.set(localization.key, localization);
  }

  const runs = config.seedList.flatMap((seed) =>
    scenarioPack.scenarios.map((scenario) =>
      runScenarioBatchV1({
        scenario,
        seed,
        scenarioPack,
        eventById,
        claimById,
        localizationByKey,
        sourceBundleHash: bundle.sourceBundleHash
      })
    )
  );
  const scenarioSummaries = buildScenarioSummariesV1(runs, scenarioPack.scenarios);
  const reasonCodeEvidence = buildReasonCodeEvidenceV1(runs);
  const aggregate = buildAggregateV1(runs, scenarioPack.scenarios);
  const csvSummary = buildCsvSummaryV1(scenarioSummaries);
  const replayPointers = buildReplayPointersV1(runs);
  const artifactWithoutHash = {
    schemaVersion: M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION,
    kind: M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_KIND,
    generatedAt: "deterministic-local-run" as const,
    generator: "apps/sim-runner/m7-large-scale-balance" as const,
    command: config.command,
    nodeVersion: config.nodeVersion,
    packageManager: config.packageManager,
    carryForwardM6Gate: "PASS_WITH_LIMITS" as const,
    config,
    contentBundleHash: bundle.sourceBundleHash,
    sourceFilePaths: config.sourceFilePaths,
    sampleSize: runs.length,
    runs,
    scenarioSummaries,
    aggregate,
    replayPointers,
    reasonCodeEvidence,
    csvSummary
  };

  return {
    ...artifactWithoutHash,
    artifactHash: hashCanonical(artifactWithoutHash)
  };
}

export function validateM7LargeScaleBalanceArtifactV1(
  input: unknown
): { readonly ok: true; readonly value: M7LargeScaleBalanceArtifactV1 } | { readonly ok: false; readonly reasons: readonly string[] } {
  const reasons: string[] = [];
  if (!isRecord(input)) {
    return { ok: false, reasons: ["artifact must be an object"] };
  }
  if (input["schemaVersion"] !== M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION) {
    reasons.push("schemaVersion must be 1");
  }
  if (input["kind"] !== M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_KIND) {
    reasons.push(`kind must be ${M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_KIND}`);
  }
  if (typeof input["artifactHash"] !== "string" || !/^[0-9a-f]{8}$/u.test(input["artifactHash"])) {
    reasons.push("artifactHash must be an 8-character lowercase hex hash");
  }
  if (input["generatedAt"] !== "deterministic-local-run") {
    reasons.push("generatedAt must be deterministic-local-run");
  }
  if (input["generator"] !== "apps/sim-runner/m7-large-scale-balance") {
    reasons.push("generator must be apps/sim-runner/m7-large-scale-balance");
  }
  if (input["carryForwardM6Gate"] !== "PASS_WITH_LIMITS") {
    reasons.push("carryForwardM6Gate must be PASS_WITH_LIMITS");
  }
  if (hasForbiddenPayloadKey(input)) {
    reasons.push("artifact must not contain raw world, save, command tail, or event tail data");
  }

  const config = input["config"];
  if (!isRecord(config)) {
    reasons.push("config must be an object");
  } else {
    if (config["schemaVersion"] !== M7_BETA_LARGE_SCALE_BALANCE_ARTIFACT_SCHEMA_VERSION) {
      reasons.push("config.schemaVersion must be 1");
    }
    if (typeof config["command"] !== "string" || config["command"].length === 0) {
      reasons.push("config.command must be a non-empty string");
    }
    if (typeof config["nodeVersion"] !== "string" || config["nodeVersion"].length === 0) {
      reasons.push("config.nodeVersion must be a non-empty string");
    }
    if (typeof config["packageManager"] !== "string" || config["packageManager"].length === 0) {
      reasons.push("config.packageManager must be a non-empty string");
    }
  }

  const runs = input["runs"];
  if (!Array.isArray(runs) || runs.length < 3) {
    reasons.push("runs must contain at least three rows");
  }
  const scenarioSummaries = input["scenarioSummaries"];
  if (!Array.isArray(scenarioSummaries) || scenarioSummaries.length < 3) {
    reasons.push("scenarioSummaries must contain at least three rows");
  }
  const reasonCodeEvidence = input["reasonCodeEvidence"];
  if (!Array.isArray(reasonCodeEvidence) || reasonCodeEvidence.length === 0) {
    reasons.push("reasonCodeEvidence must contain at least one row");
  }
  const replayPointers = input["replayPointers"];
  if (!isRecord(replayPointers)) {
    reasons.push("replayPointers must be an object");
  }
  const aggregate = input["aggregate"];
  if (!isRecord(aggregate)) {
    reasons.push("aggregate must be an object");
  }
  const csvSummary = input["csvSummary"];
  if (typeof csvSummary !== "string" || !csvSummary.includes("scenarioId")) {
    reasons.push("csvSummary must include a header row");
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
  return { ok: true, value: input as M7LargeScaleBalanceArtifactV1 };
}

function runScenarioBatchV1(input: {
  readonly scenario: M7BalanceScenarioV1;
  readonly seed: number;
  readonly scenarioPack: M7BalanceSourceBundleV1["scenarioPack"];
  readonly eventById: ReadonlyMap<string, M7BalanceEventV1>;
  readonly claimById: ReadonlyMap<string, M7BalanceClaimV1>;
  readonly localizationByKey: ReadonlyMap<string, M7BalanceLocalizationV1>;
  readonly sourceBundleHash: string;
}): M7LargeScaleBalanceRunV1 {
  const { scenario, seed, scenarioPack, eventById, claimById, localizationByKey, sourceBundleHash } = input;
  const seedHash = hashText(`${seed}:${scenario.scenarioId}:${sourceBundleHash}`);
  const stepCount = 6 + (seedHash % 4);
  const trace: M7LargeScaleBalanceStepV1[] = [];
  const eventCounts = new Map<string, number>();
  const choiceCounts = new Map<string, number>();
  let previousEventId: string | null = null;
  let previousChoiceId: string | null = null;
  let advanceCount = 0;
  let waitCount = 0;
  let deferCount = 0;
  let stabilizeCount = 0;
  let investCount = 0;
  let reformCount = 0;
  let repeatEventCount = 0;
  let repeatChoiceCount = 0;
  let multiChoiceOpportunityCount = 0;
  let defaultChoiceCount = 0;
  let humanGateStepCount = 0;
  let researchStepCount = 0;
  let violenceStepCount = 0;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    const eventIndex =
      (seedHash + stepIndex * 7 + scenario.startYear + scenario.eventIds.length) %
      scenario.eventIds.length;
    const eventId = requireDefined(scenario.eventIds[eventIndex], `scenario.eventIds[${eventIndex}]`);
    const event = requireDefined(eventById.get(eventId), `eventById.get(${eventId})`);
    const choiceCount = event.choices.length;
    const choiceIndex =
      choiceCount === 1
        ? 0
        : hashText(`${scenario.scenarioId}:${seed}:${stepIndex}:${eventId}:${sourceBundleHash}`) %
          choiceCount;
    const choice = requireDefined(event.choices[choiceIndex], `event.choices[${choiceIndex}]`);
    if (choiceCount > 1) {
      multiChoiceOpportunityCount += 1;
      if (choiceIndex === 0) {
        defaultChoiceCount += 1;
      }
    }

    eventCounts.set(eventId, (eventCounts.get(eventId) ?? 0) + 1);
    choiceCounts.set(choice.choiceId, (choiceCounts.get(choice.choiceId) ?? 0) + 1);
    if (previousEventId === eventId) {
      repeatEventCount += 1;
    }
    if (previousEventId === eventId && previousChoiceId === choice.choiceId) {
      repeatChoiceCount += 1;
    }
    previousEventId = eventId;
    previousChoiceId = choice.choiceId;

    const humanGate =
      event.reviewState === "CULTURE_HUMAN_GATE_REQUIRED" ||
      event.violenceCostRecord?.reviewState === "CULTURE_HUMAN_GATE_REQUIRED";
    const research = event.reviewState === "RESEARCH REQUIRED";
    const violence = event.violenceCostRecord !== null;
    if (humanGate) {
      humanGateStepCount += 1;
    }
    if (research) {
      researchStepCount += 1;
    }
    if (violence) {
      violenceStepCount += 1;
    }

    let decisionKind: M7BalanceDecisionKindV1;
    if (humanGate) {
      decisionKind = choiceIndex === 0 ? "defer" : "wait";
    } else if (research) {
      decisionKind = stepIndex % 2 === 0 || choiceIndex === 0 ? "wait" : "invest";
    } else if (violence) {
      decisionKind = choiceIndex === 0 ? "stabilize" : "advance";
    } else if (event.label === "COMPOSITE" && event.confidence === "MEDIUM") {
      decisionKind = choiceIndex === 0 ? "advance" : "reform";
    } else {
      decisionKind = "advance";
    }

    if (decisionKind === "advance") {
      advanceCount += 1;
    } else if (decisionKind === "wait") {
      waitCount += 1;
    } else if (decisionKind === "defer") {
      deferCount += 1;
    } else if (decisionKind === "stabilize") {
      stabilizeCount += 1;
    } else if (decisionKind === "invest") {
      investCount += 1;
    } else {
      reformCount += 1;
    }

    const reasonCodes = reasonCodesForStepV1({
      scenario,
      event,
      decisionKind,
      choiceIndex,
      humanGate,
      research,
      violence,
      sourceBundleHash
    });
    trace.push({
      stepIndex,
      eventId,
      choiceId: choice.choiceId,
      decisionKind,
      reasonCodes,
      replayPointer: `${scenario.scenarioId}|seed=${seed}|step=${stepIndex}|event=${eventId}|choice=${choice.choiceId}`
    });
  }

  const noActionCount = waitCount + deferCount;
  const noActionShare = noActionCount / stepCount;
  const directControlShare =
    multiChoiceOpportunityCount === 0 ? 0 : defaultChoiceCount / multiChoiceOpportunityCount;
  const uniqueEvents = eventCounts.size;
  const uniqueChoices = choiceCounts.size;
  const maxEventCount = maxMapValue(eventCounts);
  const maxChoiceCount = maxMapValue(choiceCounts);
  const diversity = uniqueEvents / stepCount;
  const hashNoise = hashText(`${scenario.scenarioId}:${seed}:mix:${sourceBundleHash}`);

  const snowballScore = clampScore(
    (hashNoise % 100) +
      advanceCount * 8 +
      (scenario.hooks.some((hook) => hook.hookKind === "victory") ? 8 : 0) +
      (scenario.startYear < 1550 ? 5 : 0) -
      Math.round(noActionShare * 30) +
      Math.round(diversity * 10)
  );
  const collapseScore = clampScore(
    ((hashNoise >>> 7) % 100) +
      deferCount * 10 +
      violenceStepCount * 12 +
      humanGateStepCount * 10 +
      (scenario.reviewState === "RESEARCH REQUIRED" ? 4 : 0)
  );
  const noActionScore = clampScore(
    ((hashNoise >>> 13) % 100) +
      Math.round(noActionShare * 100) +
      Math.max(0, 4 - uniqueEvents) * 8 +
      repeatEventCount * 6
  );
  const exploitLoopScore = clampScore(
    ((hashNoise >>> 19) % 100) +
      repeatChoiceCount * 20 +
      Math.round((maxEventCount / stepCount) * 40) +
      Math.round((maxChoiceCount / stepCount) * 30)
  );
  const directControlScore = clampScore(
    ((hashNoise >>> 3) % 100) +
      Math.round(directControlShare * 100) +
      (multiChoiceOpportunityCount > 0 ? 8 : 0) -
      Math.round(noActionShare * 10)
  );
  const antiStallScore = clampScore(
    100 - Math.round(noActionShare * 100) + uniqueEvents * 4 - repeatEventCount * 8 + investCount * 6
  );
  const stableScore = clampScore(
    ((hashNoise >>> 23) % 100) +
      Math.max(0, 3 - [advanceCount, waitCount, deferCount, stabilizeCount, investCount, reformCount].filter((value) => value > 0).length) * 12
  );

  const flags: M7LargeScaleBalanceRunFlagsV1 = {
    runawayExpansion: snowballScore >= 70,
    unavoidableCollapse: collapseScore >= 70,
    noActionHeavyAi: noActionShare >= 0.5,
    exploitLoopDetected: exploitLoopScore >= 70,
    directControlDominance: directControlScore >= 85
  };
  const dominantSignal = dominantSignalV1({
    snowballScore,
    collapseScore,
    noActionScore,
    exploitLoopScore,
    directControlScore,
    stableScore
  });
  const dominantSignalStepIndex = dominantSignalStepIndexV1(trace, dominantSignal);
  const replayPointer = trace[dominantSignalStepIndex]?.replayPointer ?? trace[0]?.replayPointer ?? `${scenario.scenarioId}|seed=${seed}|step=0`;
  const runHash = hashCanonical({
    scenarioId: scenario.scenarioId,
    seed,
    stepCount,
    dominantSignal,
    dominantSignalStepIndex,
    replayPointer,
    flags,
    metrics: {
      snowballScore,
      collapseScore,
      noActionScore,
      exploitLoopScore,
      directControlScore,
      antiStallScore
    },
    trace
  });
  const reasonCodes = uniqueSortedStrings(
    trace.flatMap((step) => step.reasonCodes).concat([
      `m7.balance.signal.${dominantSignal}`,
      `m7.balance.scenario.${scenario.scenarioId}`,
      `m7.balance.scenario.review.${scenario.reviewState}`,
      `m7.balance.scenario.hooks.${scenario.hooks.map((hook) => hook.hookKind).join(".")}`
    ])
  );

  return {
    runId: `${scenario.scenarioId}.seed-${seed}`,
    scenarioId: scenario.scenarioId,
    scenarioKey: scenario.scenarioKey,
    startYear: scenario.startYear,
    seed,
    stepCount,
    dominantSignal,
    dominantSignalStepIndex,
    replayPointer,
    runHash,
    flags,
    metrics: {
      snowballScore,
      collapseScore,
      noActionScore,
      exploitLoopScore,
      directControlScore,
      antiStallScore,
      eventConcentrationScore: clampScore((maxEventCount / stepCount) * 100),
      choiceConcentrationScore: clampScore((maxChoiceCount / stepCount) * 100),
      noActionShare,
      directControlShare
    },
    trace,
    reasonCodes
  };
}

function countReasonCodesV1(
  runs: readonly M7LargeScaleBalanceRunV1[]
): readonly M7LargeScaleBalanceReasonCodeEvidenceV1[] {
  const counts = new Map<string, { count: number; sampleRunIds: string[] }>();
  for (const run of runs) {
    for (const reasonCode of run.reasonCodes) {
      const entry = counts.get(reasonCode) ?? { count: 0, sampleRunIds: [] };
      entry.count += 1;
      if (entry.sampleRunIds.length < 3 && !entry.sampleRunIds.includes(run.runId)) {
        entry.sampleRunIds.push(run.runId);
      }
      counts.set(reasonCode, entry);
    }
  }
  return [...counts.entries()]
    .map(([reasonCode, entry]) => ({
      reasonCode,
      count: entry.count,
      sampleRunIds: entry.sampleRunIds
    }))
    .sort((left, right) => right.count - left.count || compareText(left.reasonCode, right.reasonCode));
}

function reasonCodesForStepV1(input: {
  readonly scenario: M7BalanceScenarioV1;
  readonly event: M7BalanceEventV1;
  readonly decisionKind: M7BalanceDecisionKindV1;
  readonly choiceIndex: number;
  readonly humanGate: boolean;
  readonly research: boolean;
  readonly violence: boolean;
  readonly sourceBundleHash: string;
}): readonly string[] {
  const reasonCodes: string[] = [
    `m7.balance.scenario.${input.scenario.scenarioId}`,
    `m7.balance.scenario.review.${input.scenario.reviewState}`,
    `m7.balance.event.review.${input.event.reviewState}`,
    `m7.balance.event.label.${input.event.label}`,
    `m7.balance.event.confidence.${input.event.confidence}`,
    `m7.balance.decision.${input.decisionKind}`,
    input.choiceIndex === 0 ? "m7.balance.choice.default" : "m7.balance.choice.alternative"
  ];
  if (input.humanGate) {
    reasonCodes.push("m7.balance.event.human-gate");
  }
  if (input.research) {
    reasonCodes.push("m7.balance.event.research-required");
  }
  if (input.violence) {
    reasonCodes.push("m7.balance.event.violence-cost");
  }
  if (input.event.choices.length > 1) {
    reasonCodes.push("m7.balance.event.multi-choice");
  }
  if (input.scenario.hooks.some((hook) => hook.hookKind === "victory")) {
    reasonCodes.push("m7.balance.scenario.victory-hook");
  }
  if (input.scenario.hooks.some((hook) => hook.hookKind === "failure")) {
    reasonCodes.push("m7.balance.scenario.failure-hook");
  }
  if (input.scenario.hooks.some((hook) => hook.hookKind === "tutorial")) {
    reasonCodes.push("m7.balance.scenario.tutorial-hook");
  }
  reasonCodes.push(`m7.balance.bundle.${input.sourceBundleHash}`);
  return uniqueSortedStrings(reasonCodes);
}

function loadM7SourceBundleV1(sourceFilePaths: readonly string[]): M7BalanceSourceBundleV1 {
  const absolutePaths = sourceFilePaths.map((sourceFilePath) => join(repoRootPath, sourceFilePath));
  const scenarioSourceText = readRequiredText(absolutePaths[0], "scenario source");
  const reviewBaselineText = readRequiredText(
    absolutePaths[1],
    "historical-cultural-language review baseline"
  );
  const cultureReviewText = readRequiredText(absolutePaths[2], "beta culture review evidence");
  const audioCoverageText = readRequiredText(absolutePaths[3], "audio-art-localization coverage");

  const scenarioSource = parseM7ScenarioSourceV1(JSON.parse(scenarioSourceText) as unknown);
  return {
    sourceFilePaths: absolutePaths,
    sourceBundleHash: hashCanonical({
      scenarioSourceText,
      reviewBaselineText,
      cultureReviewText,
      audioCoverageText
    }),
    scenarioSourceHash: hashText(scenarioSourceText).toString(16).padStart(8, "0"),
    reviewBaselineHash: hashText(reviewBaselineText).toString(16).padStart(8, "0"),
    cultureReviewHash: hashText(cultureReviewText).toString(16).padStart(8, "0"),
    audioCoverageHash: hashText(audioCoverageText).toString(16).padStart(8, "0"),
    scenarioPack: scenarioSource
  };
}

function parseM7ScenarioSourceV1(input: unknown): M7BalanceSourceBundleV1["scenarioPack"] {
  const root = requireRecord(input, "$", "M7 beta scenario source must be an object.");
  const sourceRecords = readArray(root, "sourceRecords", "$.sourceRecords").map((entry, index) =>
    parseSourceRecordV1(entry, `sourceRecords[${index}]`)
  );
  const claimRecords = readArray(root, "claimRecords", "$.claimRecords").map((entry, index) =>
    parseClaimRecordV1(entry, `claimRecords[${index}]`)
  );
  const localization = readArray(root, "localization", "$.localization").map((entry, index) =>
    parseLocalizationRecordV1(entry, `localization[${index}]`)
  );
  const titles = readArray(root, "titles", "$.titles");
  const persons = readArray(root, "persons", "$.persons");
  const events = readArray(root, "events", "$.events").map((entry, index) =>
    parseEventRecordV1(entry, `events[${index}]`)
  );
  const scenarios = readArray(root, "scenarios", "$.scenarios").map((entry, index) =>
    parseScenarioRecordV1(entry, `scenarios[${index}]`)
  );
  const knownGaps = readArray(root, "knownGaps", "$.knownGaps").map((value, index) =>
    readStringValue(value, `knownGaps[${index}]`)
  );
  return {
    sourceCount: sourceRecords.length,
    claimCount: claimRecords.length,
    localizationCount: localization.length,
    titleCount: titles.length,
    personCount: persons.length,
    eventCount: events.length,
    scenarioCount: scenarios.length,
    knownGapCount: knownGaps.length,
    sourceRecords,
    claimRecords,
    localization,
    events,
    scenarios,
    knownGaps
  };
}

function parseSourceRecordV1(input: unknown, path: string): { readonly sourceId: string } {
  const record = requireRecord(input, path, `${path} must be an object.`);
  return {
    sourceId: readString(record, "sourceId", `${path}.sourceId`)
  };
}

function parseClaimRecordV1(input: unknown, path: string): M7BalanceClaimV1 {
  const record = requireRecord(input, path, `${path} must be an object.`);
  return {
    claimId: readString(record, "claimId", `${path}.claimId`),
    label: readString(record, "label", `${path}.label`),
    confidence: readString(record, "confidence", `${path}.confidence`),
    researchStatus: readString(record, "researchStatus", `${path}.researchStatus`),
    humanGate: readBoolean(record, "humanGate", `${path}.humanGate`),
    sourceIds: readStringArray(record, "sourceIds", `${path}.sourceIds`),
    sourcePassages: readStringArray(record, "sourcePassages", `${path}.sourcePassages`)
  };
}

function parseLocalizationRecordV1(input: unknown, path: string): M7BalanceLocalizationV1 {
  const record = requireRecord(input, path, `${path} must be an object.`);
  return {
    key: readString(record, "key", `${path}.key`),
    reviewState: readString(record, "reviewState", `${path}.reviewState`),
    owner: readString(record, "owner", `${path}.owner`),
    claimIds: readStringArray(record, "claimIds", `${path}.claimIds`)
  };
}

function parseEventRecordV1(input: unknown, path: string): M7BalanceEventV1 {
  const record = requireRecord(input, path, `${path} must be an object.`);
  const choices = readArray(record, "choices", `${path}.choices`).map((entry, index) =>
    parseChoiceRecordV1(entry, `${path}.choices[${index}]`)
  );
  const violenceCostRecord = parseNullableViolenceCostRecordV1(
    record["violenceCostRecord"],
    `${path}.violenceCostRecord`
  );
  return {
    eventId: readString(record, "eventId", `${path}.eventId`),
    reviewState: readString(record, "reviewState", `${path}.reviewState`),
    label: readString(record, "label", `${path}.label`),
    confidence: readString(record, "confidence", `${path}.confidence`),
    sourceIds: readStringArray(record, "sourceIds", `${path}.sourceIds`),
    claimIds: readStringArray(record, "claimIds", `${path}.claimIds`),
    choices,
    violenceCostRecord
  };
}

function parseChoiceRecordV1(input: unknown, path: string): M7BalanceChoiceV1 {
  const record = requireRecord(input, path, `${path} must be an object.`);
  return {
    choiceId: readString(record, "choiceId", `${path}.choiceId`),
    localizationKey: readString(record, "localizationKey", `${path}.localizationKey`),
    aiReasonKey: readString(record, "aiReasonKey", `${path}.aiReasonKey`),
    costSummaryKey: readString(record, "costSummaryKey", `${path}.costSummaryKey`)
  };
}

function parseNullableViolenceCostRecordV1(
  input: unknown,
  path: string
): M7BalanceViolenceCostV1 | null {
  if (input === null) {
    return null;
  }
  const record = requireRecord(input, path, `${path} must be null or an object.`);
  return {
    reviewState: readString(record, "reviewState", `${path}.reviewState`)
  };
}

function parseScenarioRecordV1(input: unknown, path: string): M7BalanceScenarioV1 {
  const record = requireRecord(input, path, `${path} must be an object.`);
  return {
    scenarioId: readString(record, "scenarioId", `${path}.scenarioId`),
    scenarioKey: readString(record, "scenarioKey", `${path}.scenarioKey`),
    displayNameKey: readString(record, "displayNameKey", `${path}.displayNameKey`),
    startYear: readSafeInteger(record, "startYear", `${path}.startYear`),
    label: readString(record, "label", `${path}.label`),
    confidence: readString(record, "confidence", `${path}.confidence`),
    reviewState: readString(record, "reviewState", `${path}.reviewState`),
    owner: readString(record, "owner", `${path}.owner`),
    personIds: readStringArray(record, "personIds", `${path}.personIds`),
    titleIds: readStringArray(record, "titleIds", `${path}.titleIds`),
    eventIds: readStringArray(record, "eventIds", `${path}.eventIds`),
    localizationKeys: readStringArray(record, "localizationKeys", `${path}.localizationKeys`),
    hooks: readArray(record, "hooks", `${path}.hooks`).map((entry, index) => {
      const hookRecord = requireRecord(entry, `${path}.hooks[${index}]`, `${path}.hooks[${index}] must be an object.`);
      return {
        hookKind: readHookKind(hookRecord, "hookKind", `${path}.hooks[${index}].hookKind`)
      };
    })
  };
}

function readHookKind(
  record: Record<string, unknown>,
  key: string,
  path: string
): M7BalanceScenarioHookV1["hookKind"] {
  const value = readString(record, key, path);
  if (
    value === "start" ||
    value === "victory" ||
    value === "failure" ||
    value === "tutorial" ||
    value === "encyclopedia"
  ) {
    return value;
  }
  throw new Error(`${path} must be a valid hook kind.`);
}

function requireRecord(
  input: unknown,
  path: string,
  message: string
): Record<string, unknown> {
  if (!isRecord(input)) {
    throw new Error(message);
  }
  return input;
}

function readArray(
  record: Record<string, unknown>,
  key: string,
  path: string
): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array.`);
  }
  return value;
}

function readStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string
): readonly string[] {
  return readArray(record, key, path).map((value, index) =>
    readStringValue(value, `${path}[${index}]`)
  );
}

function readString(record: Record<string, unknown>, key: string, path: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  return value;
}

function readStringValue(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }
  return value;
}

function readBoolean(record: Record<string, unknown>, key: string, path: string): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new Error(`${path} must be a boolean.`);
  }
  return value;
}

function readSafeInteger(record: Record<string, unknown>, key: string, path: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`${path} must be a safe integer.`);
  }
  return value;
}

function readRequiredText(path: string, label: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch (error: unknown) {
    throw new Error(`Unable to read ${label} at ${path}.`);
  }
}

function buildReasonCodeEvidenceV1(
  runs: readonly M7LargeScaleBalanceRunV1[]
): readonly M7LargeScaleBalanceReasonCodeEvidenceV1[] {
  const counts = new Map<string, { count: number; sampleRunIds: string[] }>();
  for (const run of runs) {
    for (const reasonCode of run.reasonCodes) {
      const entry = counts.get(reasonCode) ?? { count: 0, sampleRunIds: [] };
      entry.count += 1;
      if (entry.sampleRunIds.length < 3 && !entry.sampleRunIds.includes(run.runId)) {
        entry.sampleRunIds.push(run.runId);
      }
      counts.set(reasonCode, entry);
    }
  }
  return [...counts.entries()]
    .map(([reasonCode, entry]) => ({
      reasonCode,
      count: entry.count,
      sampleRunIds: entry.sampleRunIds
    }))
    .sort((left, right) => right.count - left.count || compareText(left.reasonCode, right.reasonCode));
}

function buildReplayPointersFromSignalsV1(
  runs: readonly M7LargeScaleBalanceRunV1[],
  signal: M7BalanceSignalV1
): string | null {
  return runs.find((run) => run.dominantSignal === signal)?.replayPointer ?? null;
}

function buildReplayPointersV1(
  runs: readonly M7LargeScaleBalanceRunV1[]
): M7LargeScaleBalanceArtifactV1["replayPointers"] {
  return {
    runawayExpansion: buildReplayPointersFromSignalsV1(runs, "runaway-expansion"),
    unavoidableCollapse: buildReplayPointersFromSignalsV1(runs, "unavoidable-collapse"),
    noActionHeavyAi: buildReplayPointersFromSignalsV1(runs, "no-action-heavy-ai"),
    exploitLoopDetected: buildReplayPointersFromSignalsV1(runs, "exploit-loop"),
    directControlDominance: buildReplayPointersFromSignalsV1(runs, "direct-control-dominance"),
    stable: buildReplayPointersFromSignalsV1(runs, "stable")
  };
}

function buildCsvSummaryV1(
  scenarioSummaries: readonly M7LargeScaleBalanceScenarioSummaryV1[]
): string {
  const header = [
    "scenarioId",
    "scenarioKey",
    "startYear",
    "runCount",
    "runawayExpansionCount",
    "unavoidableCollapseCount",
    "noActionHeavyAiCount",
    "exploitLoopDetectedCount",
    "directControlDominanceCount",
    "stableCount",
    "averageSnowballScore",
    "averageCollapseScore",
    "averageNoActionScore",
    "averageExploitLoopScore",
    "averageDirectControlScore",
    "averageAntiStallScore",
    "maxNoActionShare",
    "maxDirectControlShare",
    "representativeReplayPointer",
    "mostCommonReasonCode"
  ];
  const rows = scenarioSummaries.map((summary) =>
    [
      summary.scenarioId,
      summary.scenarioKey,
      summary.startYear.toString(),
      summary.runCount.toString(),
      summary.runawayExpansionCount.toString(),
      summary.unavoidableCollapseCount.toString(),
      summary.noActionHeavyAiCount.toString(),
      summary.exploitLoopDetectedCount.toString(),
      summary.directControlDominanceCount.toString(),
      summary.stableCount.toString(),
      summary.averageSnowballScore.toString(),
      summary.averageCollapseScore.toString(),
      summary.averageNoActionScore.toString(),
      summary.averageExploitLoopScore.toString(),
      summary.averageDirectControlScore.toString(),
      summary.averageAntiStallScore.toString(),
      summary.maxNoActionShare.toString(),
      summary.maxDirectControlShare.toString(),
      csvEscape(summary.representativeReplayPointer),
      csvEscape(summary.mostCommonReasonCode)
    ].join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

function dominantSignalV1(input: {
  readonly snowballScore: number;
  readonly collapseScore: number;
  readonly noActionScore: number;
  readonly exploitLoopScore: number;
  readonly directControlScore: number;
  readonly stableScore: number;
}): M7BalanceSignalV1 {
  const entries: Array<[M7BalanceSignalV1, number]> = [
    ["runaway-expansion", input.snowballScore],
    ["unavoidable-collapse", input.collapseScore],
    ["no-action-heavy-ai", input.noActionScore],
    ["exploit-loop", input.exploitLoopScore],
    ["direct-control-dominance", input.directControlScore],
    ["stable", input.stableScore]
  ];
  entries.sort((left, right) => right[1] - left[1] || compareText(left[0], right[0]));
  return entries[0]?.[0] ?? "stable";
}

function dominantSignalStepIndexV1(
  trace: readonly M7LargeScaleBalanceStepV1[],
  signal: M7BalanceSignalV1
): number {
  if (trace.length === 0) {
    return 0;
  }
  if (signal === "runaway-expansion") {
    const index = trace.findIndex((step) => step.decisionKind === "advance" || step.decisionKind === "invest");
    return index >= 0 ? index : 0;
  }
  if (signal === "unavoidable-collapse") {
    const index = trace.findIndex((step) => step.decisionKind === "defer" || step.decisionKind === "stabilize");
    return index >= 0 ? index : 0;
  }
  if (signal === "no-action-heavy-ai") {
    const index = trace.findIndex((step) => step.decisionKind === "wait" || step.decisionKind === "defer");
    return index >= 0 ? index : 0;
  }
  if (signal === "exploit-loop") {
    for (let index = 1; index < trace.length; index += 1) {
      const previous = trace[index - 1];
      const current = trace[index];
      if (previous?.eventId === current?.eventId && previous.choiceId === current.choiceId) {
        return index;
      }
    }
    return 0;
  }
  if (signal === "direct-control-dominance") {
    const index = trace.findIndex((step) => step.reasonCodes.includes("m7.balance.choice.default"));
    return index >= 0 ? index : 0;
  }
  const stableIndex = trace.findIndex((step) => step.reasonCodes.includes("m7.balance.scenario.victory-hook"));
  return stableIndex >= 0 ? stableIndex : 0;
}

function buildScenarioSummariesV1(
  runs: readonly M7LargeScaleBalanceRunV1[],
  scenarios: readonly M7BalanceScenarioV1[]
): readonly M7LargeScaleBalanceScenarioSummaryV1[] {
  return scenarios.map((scenario) => {
    const scenarioRuns = runs.filter((run) => run.scenarioId === scenario.scenarioId);
    const reasonCounts = countReasonCodesV1(scenarioRuns);
    const representativeRun = scenarioRuns
      .slice()
      .sort((left, right) => right.metrics.snowballScore - left.metrics.snowballScore || compareText(left.runId, right.runId))[0];
    return {
      scenarioId: scenario.scenarioId,
      scenarioKey: scenario.scenarioKey,
      startYear: scenario.startYear,
      runCount: scenarioRuns.length,
      runawayExpansionCount: scenarioRuns.filter((run) => run.flags.runawayExpansion).length,
      unavoidableCollapseCount: scenarioRuns.filter((run) => run.flags.unavoidableCollapse).length,
      noActionHeavyAiCount: scenarioRuns.filter((run) => run.flags.noActionHeavyAi).length,
      exploitLoopDetectedCount: scenarioRuns.filter((run) => run.flags.exploitLoopDetected).length,
      directControlDominanceCount: scenarioRuns.filter((run) => run.flags.directControlDominance).length,
      stableCount: scenarioRuns.filter((run) => run.dominantSignal === "stable").length,
      averageSnowballScore: averageRounded(scenarioRuns.map((run) => run.metrics.snowballScore)),
      averageCollapseScore: averageRounded(scenarioRuns.map((run) => run.metrics.collapseScore)),
      averageNoActionScore: averageRounded(scenarioRuns.map((run) => run.metrics.noActionScore)),
      averageExploitLoopScore: averageRounded(scenarioRuns.map((run) => run.metrics.exploitLoopScore)),
      averageDirectControlScore: averageRounded(scenarioRuns.map((run) => run.metrics.directControlScore)),
      averageAntiStallScore: averageRounded(scenarioRuns.map((run) => run.metrics.antiStallScore)),
      maxNoActionShare: roundedShare(
        Math.max(...scenarioRuns.map((run) => run.metrics.noActionShare), 0)
      ),
      maxDirectControlShare: roundedShare(
        Math.max(...scenarioRuns.map((run) => run.metrics.directControlShare), 0)
      ),
      representativeReplayPointer:
        representativeRun?.replayPointer ?? `${scenario.scenarioId}|seed=0|step=0`,
      mostCommonReasonCode:
        reasonCounts[0]?.reasonCode ?? `m7.balance.scenario.${scenario.scenarioId}`,
      eventCount: scenario.eventIds.length,
      personCount: scenario.personIds.length,
      titleCount: scenario.titleIds.length,
      hookKinds: uniqueSortedStrings(scenario.hooks.map((hook) => hook.hookKind)) as readonly M7BalanceScenarioHookV1["hookKind"][]
    };
  });
}

function buildAggregateV1(
  runs: readonly M7LargeScaleBalanceRunV1[],
  scenarios: readonly M7BalanceScenarioV1[]
): M7LargeScaleBalanceArtifactV1["aggregate"] {
  const primarySignalCounts: Record<M7BalanceSignalV1, number> = {
    "runaway-expansion": 0,
    "unavoidable-collapse": 0,
    "no-action-heavy-ai": 0,
    "exploit-loop": 0,
    "direct-control-dominance": 0,
    stable: 0
  };
  for (const run of runs) {
    primarySignalCounts[run.dominantSignal] += 1;
  }
  const noActionShares = runs.map((run) => run.metrics.noActionShare).sort((left, right) => left - right);
  const directControlShares = runs.map((run) => run.metrics.directControlShare).sort((left, right) => left - right);
  return {
    scenarioCount: new Set(runs.map((run) => run.scenarioId)).size,
    seedCount: new Set(runs.map((run) => run.seed)).size,
    runCount: runs.length,
    runawayExpansionCount: runs.filter((run) => run.flags.runawayExpansion).length,
    unavoidableCollapseCount: runs.filter((run) => run.flags.unavoidableCollapse).length,
    noActionHeavyAiCount: runs.filter((run) => run.flags.noActionHeavyAi).length,
    exploitLoopDetectedCount: runs.filter((run) => run.flags.exploitLoopDetected).length,
    directControlDominanceCount: runs.filter((run) => run.flags.directControlDominance).length,
    stableCount: runs.filter((run) => run.dominantSignal === "stable").length,
    averageSnowballScore: averageRounded(runs.map((run) => run.metrics.snowballScore)),
    averageCollapseScore: averageRounded(runs.map((run) => run.metrics.collapseScore)),
    averageNoActionScore: averageRounded(runs.map((run) => run.metrics.noActionScore)),
    averageExploitLoopScore: averageRounded(runs.map((run) => run.metrics.exploitLoopScore)),
    averageDirectControlScore: averageRounded(runs.map((run) => run.metrics.directControlScore)),
    averageAntiStallScore: averageRounded(runs.map((run) => run.metrics.antiStallScore)),
    maxNoActionShare: roundedShare(Math.max(...runs.map((run) => run.metrics.noActionShare), 0)),
    maxDirectControlShare: roundedShare(
      Math.max(...runs.map((run) => run.metrics.directControlShare), 0)
    ),
    noActionShareP95: percentile(noActionShares, 0.95),
    directControlShareP95: percentile(directControlShares, 0.95),
    primarySignalCounts,
    scenarioCoverage: scenarios.map((scenario) => ({
      scenarioId: scenario.scenarioId,
      runCount: runs.filter((run) => run.scenarioId === scenario.scenarioId).length
    }))
  };
}

function averageRounded(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function percentile(values: readonly number[], fraction: number): number {
  if (values.length === 0) {
    return 0;
  }
  const index = Math.min(values.length - 1, Math.max(0, Math.floor((values.length - 1) * fraction)));
  return roundedShare(values[index] ?? 0);
}

function roundedShare(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/gu, '""')}"`;
}

function uniqueSortedStrings(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareText);
}

function maxMapValue(values: ReadonlyMap<string, number>): number {
  let max = 0;
  for (const value of values.values()) {
    if (value > max) {
      max = value;
    }
  }
  return max;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hashCanonical(input: unknown): string {
  const text = JSON.stringify(canonicalize(input));
  return hashText(text).toString(16).padStart(8, "0");
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

function hashText(text: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619) >>> 0;
  }
  return hash;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function withoutArtifactHash(input: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const key of Object.keys(input)) {
    if (key !== "artifactHash") {
      output[key] = input[key];
    }
  }
  return output;
}

function packageManagerVersion(): string {
  const userAgent = process.env.npm_config_user_agent;
  if (typeof userAgent === "string") {
    const match = /pnpm\/([0-9.]+)/u.exec(userAgent);
    if (match?.[1]) {
      return `pnpm@${match[1]}`;
    }
  }
  return "pnpm@11.0.0";
}

function requireDefined<T>(value: T | undefined, label: string): T {
  if (value === undefined) {
    throw new Error(`Expected defined value for ${label}.`);
  }
  return value;
}

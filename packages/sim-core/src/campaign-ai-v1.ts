import {
  GAME_COMMAND_SCHEMA_VERSION,
  M4_CAMPAIGN_AI_TRACE_MAX_CANDIDATES,
  M4_CAMPAIGN_AI_TRACE_SCHEMA_VERSION,
  type ApplyM4SiegeChoiceCommandV1,
  type CancelCampaignObjectiveCommandV1,
  type GameCommandV1,
  type M4CampaignAiCandidateTraceV1,
  type M4CampaignAiDecisionKindV1,
  type M4CampaignAiDecisionTraceV1,
  type M4CampaignTargetV1,
  type RecordMusterResponseCommandV1,
  type ResolveM4CampaignWithdrawalCommandV1,
  type StartCampaignMarchCommandV1,
  type UpdateCampaignObjectiveCommandV1
} from "@monsoon/protocol";

import {
  querySimulationV1,
  type M4CampaignPlanReadModelV1,
  type M4FactionKnowledgeSnapshotReadModelV1,
  type M4MusterCommitmentReadModelV1,
  type M4RouteTransportSourceForecastReadModelV1,
  type QueryResultV1,
  type SimulationRuntimeV1
} from "./command-query-v1.ts";

const DEFAULT_M4_CAMPAIGN_AI_TRACE_CANDIDATE_LIMIT = 5;

export interface PlanM4CampaignAiTurnInputV1 {
  readonly actorId: string;
  readonly actorPolityId: number;
  readonly commandIdPrefix: string;
  readonly nextCampaignPlanId: number;
  readonly nextMarchId: number;
  readonly nextWithdrawalId: number;
  readonly plannedMarchDays: number;
  readonly grainPerTroopPerDay: number;
  readonly maxTraceCandidates?: number;
}

export interface PlanM4CampaignAiTurnOutputV1 {
  readonly command: GameCommandV1 | null;
  readonly trace: M4CampaignAiDecisionTraceV1;
}

type QueryResultByKind<TKind extends string> = Extract<
  Extract<QueryResultV1, { readonly status: "ok" }>["result"],
  { readonly kind: TKind }
>;

interface M4AiCandidate {
  readonly candidateId: string;
  readonly decisionKind: M4CampaignAiDecisionKindV1;
  readonly campaignPlanId: number | null;
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly commandId: string | null;
  readonly command: GameCommandV1 | null;
  readonly score: number;
  readonly reasonCodes: readonly string[];
}

interface M4AiQueriesForPlan {
  readonly muster: QueryResultByKind<"sim.list-m4-muster-commitments"> | null;
  readonly grain: QueryResultByKind<"sim.preview-m4-grain-supply"> | null;
  readonly route: QueryResultByKind<"sim.preview-m4-route-transport-capacity"> | null;
  readonly marches: QueryResultByKind<"sim.list-m4-march-state"> | null;
  readonly sieges: QueryResultByKind<"sim.list-m4-siege-state"> | null;
  readonly outcomes: QueryResultByKind<"sim.list-m4-war-outcomes"> | null;
}

export function planM4CampaignAiTurnV1(
  runtime: SimulationRuntimeV1,
  input: PlanM4CampaignAiTurnInputV1
): PlanM4CampaignAiTurnOutputV1 {
  const calendar = requireQueryResult(
    querySimulationV1(runtime, { schemaVersion: 1, kind: "sim.get-calendar" }),
    "sim.get-calendar"
  );
  const plans = requireQueryResult(
    querySimulationV1(runtime, { schemaVersion: 1, kind: "sim.list-m4-campaign-plans" }),
    "sim.list-m4-campaign-plans"
  );
  const knowledge = optionalQueryResult(
    querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.list-m4-faction-knowledge",
      payload: {
        queryId: `${input.commandIdPrefix}.knowledge`,
        observerPolityId: input.actorPolityId
      }
    }),
    "sim.list-m4-faction-knowledge"
  );

  const candidates = buildM4AiCandidates({
    runtime,
    input,
    calendar,
    plans,
    knowledge
  });
  const selected = selectM4AiCandidate(candidates);
  const boundedCandidates = boundM4AiCandidates(
    candidates,
    selected,
    input.maxTraceCandidates ?? DEFAULT_M4_CAMPAIGN_AI_TRACE_CANDIDATE_LIMIT
  );

  return {
    command: selected.command,
    trace: {
      schemaVersion: M4_CAMPAIGN_AI_TRACE_SCHEMA_VERSION,
      actor: { kind: "ai", id: input.actorId },
      observerPolityId: input.actorPolityId,
      day: calendar.day,
      revision: calendar.revision,
      decisionKind: selected.decisionKind,
      selectedCampaignPlanId: selected.campaignPlanId,
      selectedCandidateId: selected.candidateId,
      commandKind: selected.commandKind,
      commandId: selected.commandId,
      primaryReasonCode: selected.reasonCodes[0] ?? "m4.ai.no-action.no-visible-campaign",
      reasonCodes: selected.reasonCodes,
      candidates: boundedCandidates.map(candidateToTrace)
    }
  };
}

function buildM4AiCandidates(input: {
  readonly runtime: SimulationRuntimeV1;
  readonly input: PlanM4CampaignAiTurnInputV1;
  readonly calendar: QueryResultByKind<"sim.get-calendar">;
  readonly plans: QueryResultByKind<"sim.list-m4-campaign-plans">;
  readonly knowledge: QueryResultByKind<"sim.list-m4-faction-knowledge"> | null;
}): readonly M4AiCandidate[] {
  const candidates: M4AiCandidate[] = [];
  const actorPlans = input.plans.plans.filter(
    (plan) => planOwnerPolityId(plan) === input.input.actorPolityId
  );

  for (const plan of actorPlans) {
    const planQueries = queryM4AiPlan(input.runtime, input.input, plan);
    const withdraw = buildWithdrawCandidate(input.input, input.calendar, plan, planQueries);
    if (withdraw !== null) {
      candidates.push(withdraw);
    }
    const siegeContinue = buildContinueSiegeCandidate(
      input.input,
      input.calendar,
      plan,
      planQueries
    );
    if (siegeContinue !== null) {
      candidates.push(siegeContinue);
    }
    const cancel = buildCancelCandidate(input.input, input.calendar, plan);
    if (cancel !== null) {
      candidates.push(cancel);
    }
    const change = buildObjectiveChangeCandidate(
      input.input,
      input.calendar,
      plan,
      input.knowledge
    );
    if (change !== null) {
      candidates.push(change);
    }
    const start = buildStartMarchCandidate(input.input, input.calendar, plan, planQueries);
    if (start !== null) {
      candidates.push(start);
    }
    const wait = buildWaitCandidate(plan, planQueries);
    if (wait !== null) {
      candidates.push(wait);
    }
    const postwarRisk = buildPostwarRiskCandidate(input.runtime, input.input, plan, planQueries);
    if (postwarRisk !== null) {
      candidates.push(postwarRisk);
    }
  }

  const reinforcement = buildReinforcementCandidate(
    input.input,
    input.calendar,
    input.plans,
    input.runtime
  );
  if (reinforcement !== null) {
    candidates.push(reinforcement);
  }
  const create = buildCreateObjectiveCandidate(input.input, input.calendar, input.knowledge);
  if (create !== null && actorPlans.length === 0) {
    candidates.push(create);
  }
  if (candidates.length === 0) {
    candidates.push(noActionCandidate());
  }
  return candidates;
}

function queryM4AiPlan(
  runtime: SimulationRuntimeV1,
  input: PlanM4CampaignAiTurnInputV1,
  plan: M4CampaignPlanReadModelV1
): M4AiQueriesForPlan {
  const campaignPlanId = plan.campaignPlanId;
  return {
    muster: optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.list-m4-muster-commitments",
        payload: { queryId: `${input.commandIdPrefix}.muster.${campaignPlanId}`, campaignPlanId }
      }),
      "sim.list-m4-muster-commitments"
    ),
    grain: optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.preview-m4-grain-supply",
        payload: {
          queryId: `${input.commandIdPrefix}.grain.${campaignPlanId}`,
          campaignPlanId,
          plannedMarchDays: input.plannedMarchDays,
          grainPerTroopPerDay: input.grainPerTroopPerDay
        }
      }),
      "sim.preview-m4-grain-supply"
    ),
    route: optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.preview-m4-route-transport-capacity",
        payload: { queryId: `${input.commandIdPrefix}.route.${campaignPlanId}`, campaignPlanId }
      }),
      "sim.preview-m4-route-transport-capacity"
    ),
    marches: optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.list-m4-march-state",
        payload: { queryId: `${input.commandIdPrefix}.march.${campaignPlanId}`, campaignPlanId }
      }),
      "sim.list-m4-march-state"
    ),
    sieges: optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.list-m4-siege-state",
        payload: { queryId: `${input.commandIdPrefix}.siege.${campaignPlanId}`, campaignPlanId }
      }),
      "sim.list-m4-siege-state"
    ),
    outcomes: optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.list-m4-war-outcomes",
        payload: { queryId: `${input.commandIdPrefix}.outcome.${campaignPlanId}`, campaignPlanId }
      }),
      "sim.list-m4-war-outcomes"
    )
  };
}

function buildReinforcementCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  plans: QueryResultByKind<"sim.list-m4-campaign-plans">,
  runtime: SimulationRuntimeV1
): M4AiCandidate | null {
  for (const plan of [...plans.plans].sort(compareM4AiPlan)) {
    const muster = optionalQueryResult(
      querySimulationV1(runtime, {
        schemaVersion: 1,
        kind: "sim.list-m4-muster-commitments",
        payload: {
          queryId: `${input.commandIdPrefix}.reinforce.${plan.campaignPlanId}`,
          campaignPlanId: plan.campaignPlanId
        }
      }),
      "sim.list-m4-muster-commitments"
    );
    const commitment = muster?.commitments
      .filter(
        (entry) =>
          entry.source.debtorPolityId === input.actorPolityId &&
          (entry.status === "delayed" || entry.status === "promised") &&
          entry.assembledTroops < entry.promisedTroops
      )
      .sort(compareM4AiCommitment)[0];
    if (commitment !== undefined) {
      const commandId = commandIdFor(input, "reinforce", commitment.commitmentId);
      const command: RecordMusterResponseCommandV1 = {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.record-muster-response",
        commandId,
        actor: { kind: "ai", id: input.actorId },
        expectedDay: calendar.day,
        expectedRevision: calendar.revision,
        payload: {
          commitmentId: commitment.commitmentId,
          assembledTroops: commitment.promisedTroops,
          delayedTroops: 0,
          refusedTroops: commitment.refusedTroops,
          releasedTroops: commitment.releasedTroops,
          reasonCodes: ["m4.ai.reinforce.delayed-commitment"]
        }
      };
      return {
        candidateId: `reinforce:${commitment.campaignPlanId}:${commitment.commitmentId}`,
        decisionKind: "reinforce",
        campaignPlanId: commitment.campaignPlanId,
        commandKind: command.kind,
        commandId,
        command,
        score: 9_000,
        reasonCodes: ["m4.ai.reinforce.delayed-commitment"]
      };
    }
  }
  return null;
}

function buildWithdrawCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  plan: M4CampaignPlanReadModelV1,
  queries: M4AiQueriesForPlan
): M4AiCandidate | null {
  if (plan.status !== "active") {
    return null;
  }
  const march = queries.marches?.marches
    .filter((entry) => entry.supply.status === "hungry" || entry.supply.status === "out-of-supply")
    .sort(compareM4AiMarch)[0];
  if (march === undefined) {
    return null;
  }
  const siege = queries.sieges?.sieges
    .filter((entry) => entry.marchId === march.marchId && entry.status === "blockading")
    .sort(compareM4AiSiege)[0];
  const commandId = commandIdFor(input, "withdraw", march.campaignPlanId);
  const command: ResolveM4CampaignWithdrawalCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.resolve-m4-campaign-withdrawal",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: calendar.day,
    expectedRevision: calendar.revision,
    payload: {
      withdrawalId: input.nextWithdrawalId,
      campaignPlanId: plan.campaignPlanId,
      marchId: march.marchId,
      siegeId: siege?.siegeId ?? null,
      triggerReason: "supply",
      reasonCodes: ["m4.ai.withdraw.supply-collapse"]
    }
  };
  return {
    candidateId: `withdraw:${plan.campaignPlanId}:${march.marchId}`,
    decisionKind: "withdraw",
    campaignPlanId: plan.campaignPlanId,
    commandKind: command.kind,
    commandId,
    command,
    score: 10_000,
    reasonCodes: ["m4.ai.withdraw.supply-collapse"]
  };
}

function buildContinueSiegeCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  plan: M4CampaignPlanReadModelV1,
  queries: M4AiQueriesForPlan
): M4AiCandidate | null {
  if (plan.status !== "active") {
    return null;
  }
  const siege = queries.sieges?.sieges
    .filter((entry) => entry.status === "blockading" && entry.attackerTroops > 0)
    .sort(compareM4AiSiege)[0];
  if (siege === undefined) {
    return null;
  }
  const march = queries.marches?.marches.find((entry) => entry.marchId === siege.marchId);
  if (march?.supply.status === "hungry" || march?.supply.status === "out-of-supply") {
    return null;
  }
  const commandId = commandIdFor(input, "continue", siege.siegeId);
  const command: ApplyM4SiegeChoiceCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.apply-m4-siege-choice",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: calendar.day,
    expectedRevision: calendar.revision,
    payload: {
      siegeId: siege.siegeId,
      campaignPlanId: siege.campaignPlanId,
      marchId: siege.marchId,
      choice: "continue",
      defenderPolityId: siege.defenderPolityId,
      fortification: siege.fortification,
      defenderEstimatedTroops: siege.defenderEstimatedTroops,
      defenderSupply: siege.defenderSupply,
      reasonCodes: ["m4.ai.continue.siege-pressure"]
    }
  };
  return {
    candidateId: `continue:${siege.campaignPlanId}:${siege.siegeId}`,
    decisionKind: "continue",
    campaignPlanId: siege.campaignPlanId,
    commandKind: command.kind,
    commandId,
    command,
    score: 8_000,
    reasonCodes: ["m4.ai.continue.siege-pressure"]
  };
}

function buildObjectiveChangeCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  plan: M4CampaignPlanReadModelV1,
  knowledge: QueryResultByKind<"sim.list-m4-faction-knowledge"> | null
): M4AiCandidate | null {
  if (plan.status !== "planned") {
    return null;
  }
  const target = bestVisibleKnowledgeTarget(knowledge);
  if (target === null || targetsEqual(plan.target, target)) {
    return null;
  }
  const commandId = commandIdFor(input, "change", plan.campaignPlanId);
  const command: UpdateCampaignObjectiveCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.update-campaign-objective",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: calendar.day,
    expectedRevision: calendar.revision,
    payload: {
      campaignPlanId: plan.campaignPlanId,
      target,
      objectiveKind: plan.objectiveKind,
      startWindow: {
        earliestDay: plan.forecast.earliestStartDay,
        latestDay: plan.forecast.latestStartDay
      },
      reasonCodes: ["m4.ai.objective-change.knowledge-target"]
    }
  };
  return {
    candidateId: `change:${plan.campaignPlanId}:${targetId(target)}`,
    decisionKind: "change-objective",
    campaignPlanId: plan.campaignPlanId,
    commandKind: command.kind,
    commandId,
    command,
    score: 7_000,
    reasonCodes: ["m4.ai.objective-change.knowledge-target"]
  };
}

function buildCancelCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  plan: M4CampaignPlanReadModelV1
): M4AiCandidate | null {
  if (
    plan.status !== "planned" ||
    plan.forecast.status !== "blocked" ||
    !plan.forecast.reasonCodes.includes("campaign.forecast.start-range-expired")
  ) {
    return null;
  }
  const commandId = commandIdFor(input, "cancel", plan.campaignPlanId);
  const command: CancelCampaignObjectiveCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.cancel-campaign-objective",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: calendar.day,
    expectedRevision: calendar.revision,
    payload: {
      campaignPlanId: plan.campaignPlanId,
      reasonCode: "m4.ai.cancel.start-range-expired"
    }
  };
  return {
    candidateId: `cancel:${plan.campaignPlanId}`,
    decisionKind: "cancel",
    campaignPlanId: plan.campaignPlanId,
    commandKind: command.kind,
    commandId,
    command,
    score: 8_500,
    reasonCodes: ["m4.ai.cancel.start-range-expired"]
  };
}

function buildPostwarRiskCandidate(
  runtime: SimulationRuntimeV1,
  input: PlanM4CampaignAiTurnInputV1,
  plan: M4CampaignPlanReadModelV1,
  queries: M4AiQueriesForPlan
): M4AiCandidate | null {
  if (plan.status !== "completed") {
    return null;
  }
  const candidate = queries.outcomes?.postwarCandidates
    .filter((entry) => entry.victorPolityId === input.actorPolityId)
    .sort(
      (left, right) =>
        left.districtId - right.districtId || compareText(left.candidateId, right.candidateId)
    )[0];
  if (candidate === undefined) {
    return null;
  }
  const postwar = optionalQueryResult(
    querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.compare-m3-postwar-governance-outcomes",
      payload: {
        queryId: `${input.commandIdPrefix}.postwar.${plan.campaignPlanId}`,
        victorPolityId: candidate.victorPolityId,
        localPolityId: candidate.localPolityId,
        districtId: candidate.districtId,
        months: 24
      }
    }),
    "sim.compare-m3-postwar-governance-outcomes"
  );
  const highRisk = postwar?.outcomes.some((entry) => entry.averageRiskBps >= 5_000) ?? false;
  return {
    candidateId: `postwar:${plan.campaignPlanId}:${candidate.districtId}`,
    decisionKind: highRisk ? "wait" : "no-action",
    campaignPlanId: plan.campaignPlanId,
    commandKind: null,
    commandId: null,
    command: null,
    score: highRisk ? 3_000 : 1_000,
    reasonCodes: [
      highRisk ? "m4.ai.wait.postwar-risk-high" : "m4.ai.no-action.postwar-handoff-ready"
    ]
  };
}

function buildStartMarchCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  plan: M4CampaignPlanReadModelV1,
  queries: M4AiQueriesForPlan
): M4AiCandidate | null {
  if (plan.status !== "planned") {
    return null;
  }
  const musterReady =
    queries.muster?.commitments.some((entry) => entry.assembledTroops > 0) ?? false;
  const grainReady =
    queries.grain?.reasonCodes.includes("grain.forecast.reserved-sufficient") ?? false;
  const routeReady = queries.route?.reasonCodes.includes("route.forecast.capacity-ready") ?? false;
  const originDistrictId = firstReachableSource(queries.route)?.originDistrictId;
  if (!musterReady || !grainReady || !routeReady || originDistrictId === undefined) {
    return null;
  }
  const commandId = commandIdFor(input, "start", plan.campaignPlanId);
  const command: StartCampaignMarchCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.start-campaign-march",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: calendar.day,
    expectedRevision: calendar.revision,
    payload: {
      marchId: input.nextMarchId,
      campaignPlanId: plan.campaignPlanId,
      originDistrictId,
      plannedDepartureDay: calendar.day,
      grainPerTroopPerDay: input.grainPerTroopPerDay,
      reasonCodes: ["m4.ai.target.start-ready"]
    }
  };
  return {
    candidateId: `start:${plan.campaignPlanId}:${originDistrictId}`,
    decisionKind: "start-march",
    campaignPlanId: plan.campaignPlanId,
    commandKind: command.kind,
    commandId,
    command,
    score: 6_000,
    reasonCodes: ["m4.ai.target.start-ready"]
  };
}

function buildWaitCandidate(
  plan: M4CampaignPlanReadModelV1,
  queries: M4AiQueriesForPlan
): M4AiCandidate | null {
  if (plan.status !== "planned") {
    return null;
  }
  const reasons: string[] = [];
  if (queries.grain?.reasonCodes.includes("grain.forecast.insufficient-reserved-grain")) {
    reasons.push("m4.ai.wait.supply-shortfall");
  }
  if (
    queries.grain?.reasonCodes.includes("grain.forecast.seasonal-risk") ||
    queries.route?.reasonCodes.includes("route.forecast.seasonal-risk")
  ) {
    reasons.push("m4.ai.wait.season-risk");
  }
  if (reasons.length === 0) {
    return null;
  }
  return {
    candidateId: `wait:${plan.campaignPlanId}`,
    decisionKind: "wait",
    campaignPlanId: plan.campaignPlanId,
    commandKind: null,
    commandId: null,
    command: null,
    score: 5_000,
    reasonCodes: uniqueSortedM4AiReasonCodes(reasons)
  };
}

function buildCreateObjectiveCandidate(
  input: PlanM4CampaignAiTurnInputV1,
  calendar: QueryResultByKind<"sim.get-calendar">,
  knowledge: QueryResultByKind<"sim.list-m4-faction-knowledge"> | null
): M4AiCandidate | null {
  const target = bestVisibleKnowledgeTarget(knowledge);
  if (target === null) {
    return null;
  }
  const commandId = commandIdFor(input, "create", input.nextCampaignPlanId);
  const command: GameCommandV1 = {
    schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
    kind: "sim.create-campaign-objective",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: calendar.day,
    expectedRevision: calendar.revision,
    payload: {
      campaignPlanId: input.nextCampaignPlanId,
      owner: { kind: "polity", polityId: input.actorPolityId },
      target,
      objectiveKind: "besiege",
      startWindow: { earliestDay: calendar.day, latestDay: calendar.day + 30 },
      reasonCodes: ["m4.ai.target.visible-knowledge"]
    }
  };
  return {
    candidateId: `create:${targetId(target)}`,
    decisionKind: "create-objective",
    campaignPlanId: input.nextCampaignPlanId,
    commandKind: command.kind,
    commandId,
    command,
    score: 4_000,
    reasonCodes: ["m4.ai.target.visible-knowledge"]
  };
}

function noActionCandidate(): M4AiCandidate {
  return {
    candidateId: "no-action:0",
    decisionKind: "no-action",
    campaignPlanId: null,
    commandKind: null,
    commandId: null,
    command: null,
    score: 0,
    reasonCodes: ["m4.ai.no-action.no-visible-campaign"]
  };
}

function bestVisibleKnowledgeTarget(
  knowledge: QueryResultByKind<"sim.list-m4-faction-knowledge"> | null
): M4CampaignTargetV1 | null {
  const estimates =
    knowledge?.snapshots
      .flatMap((snapshot) => snapshot.defenderEstimates.map((estimate) => ({ snapshot, estimate })))
      .filter((entry) => entry.estimate.target.kind === "district")
      .sort(compareKnowledgeTargetEstimate) ?? [];
  const best = estimates[0];
  if (best === undefined) {
    return null;
  }
  const target = best.estimate.target;
  if (target.kind !== "district") {
    return null;
  }
  return {
    kind: "district",
    districtId: target.districtId
  };
}

function compareKnowledgeTargetEstimate(
  left: {
    readonly snapshot: M4FactionKnowledgeSnapshotReadModelV1;
    readonly estimate: M4FactionKnowledgeSnapshotReadModelV1["defenderEstimates"][number];
  },
  right: {
    readonly snapshot: M4FactionKnowledgeSnapshotReadModelV1;
    readonly estimate: M4FactionKnowledgeSnapshotReadModelV1["defenderEstimates"][number];
  }
): number {
  return (
    right.estimate.confidenceBps - left.estimate.confidenceBps ||
    left.estimate.defenderMax - right.estimate.defenderMax ||
    targetId(left.estimate.target) - targetId(right.estimate.target) ||
    left.snapshot.snapshotId - right.snapshot.snapshotId
  );
}

function firstReachableSource(
  route: QueryResultByKind<"sim.preview-m4-route-transport-capacity"> | null
): M4RouteTransportSourceForecastReadModelV1 | undefined {
  return route?.sourceForecasts
    .filter((source) => source.status === "reachable")
    .sort(
      (left, right) =>
        left.originDistrictId - right.originDistrictId ||
        left.destinationDistrictId - right.destinationDistrictId ||
        left.reservationId - right.reservationId
    )[0];
}

function requireQueryResult<TKind extends string>(
  result: QueryResultV1,
  kind: TKind
): QueryResultByKind<TKind> {
  if (result.status !== "ok" || result.result.kind !== kind) {
    throw new Error(`M4 campaign AI required query ${kind} failed.`);
  }
  return result.result as QueryResultByKind<TKind>;
}

function optionalQueryResult<TKind extends string>(
  result: QueryResultV1,
  kind: TKind
): QueryResultByKind<TKind> | null {
  if (result.status !== "ok" || result.result.kind !== kind) {
    return null;
  }
  return result.result as QueryResultByKind<TKind>;
}

function selectM4AiCandidate(candidates: readonly M4AiCandidate[]): M4AiCandidate {
  const sorted = [...candidates].sort(
    (left, right) => right.score - left.score || compareText(left.candidateId, right.candidateId)
  );
  const selected = sorted[0];
  if (selected === undefined) {
    return noActionCandidate();
  }
  return selected;
}

function boundM4AiCandidates(
  candidates: readonly M4AiCandidate[],
  selected: M4AiCandidate,
  maxTraceCandidates: number
): readonly M4AiCandidate[] {
  const positiveLimit = maxTraceCandidates > 0 ? maxTraceCandidates : 1;
  const traceLimit =
    positiveLimit > M4_CAMPAIGN_AI_TRACE_MAX_CANDIDATES
      ? M4_CAMPAIGN_AI_TRACE_MAX_CANDIDATES
      : positiveLimit;
  const fillerLimit = traceLimit - 1;
  const filler = [...candidates]
    .filter((candidate) => candidate.candidateId !== selected.candidateId)
    .sort((left, right) => compareText(left.candidateId, right.candidateId))
    .slice(0, fillerLimit);
  return [selected, ...filler].sort((left, right) =>
    compareText(left.candidateId, right.candidateId)
  );
}

function candidateToTrace(candidate: M4AiCandidate): M4CampaignAiCandidateTraceV1 {
  return {
    candidateId: candidate.candidateId,
    decisionKind: candidate.decisionKind,
    campaignPlanId: candidate.campaignPlanId,
    commandKind: candidate.commandKind,
    score: candidate.score,
    reasonCodes: candidate.reasonCodes
  };
}

function planOwnerPolityId(plan: M4CampaignPlanReadModelV1): number | null {
  return plan.owner.kind === "polity" ? plan.owner.polityId : null;
}

function targetsEqual(left: M4CampaignTargetV1, right: M4CampaignTargetV1): boolean {
  return left.kind === right.kind && targetId(left) === targetId(right);
}

function targetId(target: M4CampaignTargetV1): number {
  return target.kind === "district" ? target.districtId : target.polityId;
}

function commandIdFor(
  input: PlanM4CampaignAiTurnInputV1,
  decision: string,
  entityId: number
): string {
  const raw = `${input.commandIdPrefix}.${decision}.${entityId}`;
  const sanitized = raw.replace(/[^A-Za-z0-9._:-]/gu, ".");
  return sanitized.length <= 96 ? sanitized : sanitized.slice(0, 96);
}

function compareM4AiPlan(
  left: M4CampaignPlanReadModelV1,
  right: M4CampaignPlanReadModelV1
): number {
  return left.campaignPlanId - right.campaignPlanId;
}

function compareM4AiCommitment(
  left: M4MusterCommitmentReadModelV1,
  right: M4MusterCommitmentReadModelV1
): number {
  return left.campaignPlanId - right.campaignPlanId || left.commitmentId - right.commitmentId;
}

function compareM4AiMarch(
  left: QueryResultByKind<"sim.list-m4-march-state">["marches"][number],
  right: QueryResultByKind<"sim.list-m4-march-state">["marches"][number]
): number {
  return left.campaignPlanId - right.campaignPlanId || left.marchId - right.marchId;
}

function compareM4AiSiege(
  left: QueryResultByKind<"sim.list-m4-siege-state">["sieges"][number],
  right: QueryResultByKind<"sim.list-m4-siege-state">["sieges"][number]
): number {
  return left.campaignPlanId - right.campaignPlanId || left.siegeId - right.siegeId;
}

function uniqueSortedM4AiReasonCodes(reasonCodes: readonly string[]): readonly string[] {
  const unique: string[] = [];
  for (const reasonCode of [...reasonCodes].sort(compareM4AiReasonCode)) {
    if (!unique.includes(reasonCode)) {
      unique.push(reasonCode);
    }
  }
  return unique;
}

function compareM4AiReasonCode(left: string, right: string): number {
  return m4AiReasonRank(left) - m4AiReasonRank(right) || compareText(left, right);
}

function m4AiReasonRank(reasonCode: string): number {
  switch (reasonCode) {
    case "m4.ai.wait.supply-shortfall":
      return 1;
    case "m4.ai.wait.season-risk":
      return 2;
    default:
      return 99;
  }
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

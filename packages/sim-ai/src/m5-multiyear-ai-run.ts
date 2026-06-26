import { createM5PlayableLoopScriptV1, type GameCommandV1 } from "@monsoon/protocol";
import {
  canonicalizeM2EconomyPopulationState,
  bootSimulationV1,
  createDeterministicRng,
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createM4CampaignStateV0,
  createWorldStateV0,
  hashWorldStateV0,
  nextRngInt,
  parseCampaignMarchId,
  parseCampaignPlanId,
  parseDistrictId,
  parseFactionKnowledgeSnapshotId,
  parseGameDay,
  parseGrainSupplyReservationId,
  parseM3ObligationAuditEventId,
  parseM3ObligationId,
  parseMobilizedForceCommitmentId,
  parsePersonId,
  parsePolityId,
  parsePopulationGroupId,
  parseRouteId,
  parseWorldRevision,
  planM4CampaignAiTurnV1,
  submitCommandV1,
  validateWorldStateV0,
  type M2RouteTransportEdgeStateV0,
  type M4CampaignStateV0,
  type PlanM4CampaignAiTurnInputV1,
  type SimulationRuntimeV1,
  type WorldDefinitionsV0,
  type WorldStateV0
} from "@monsoon/sim-core";

const M5_MULTIYEAR_AI_DEFAULT_DURATION_DAYS = 730;
const M5_MULTIYEAR_AI_TRACE_CANDIDATE_LIMIT = 5;
const M5_MULTIYEAR_AI_GRAIN_PER_TROOP_PER_DAY = 1;
const M5_MULTIYEAR_AI_PLANNED_MARCH_DAYS = 4;

export interface M5MultiYearAiRunInputV1 {
  readonly seed: string;
  readonly durationDays?: number;
}

export interface M5MultiYearAiTraceEvidenceV1 {
  readonly decisionKind: string;
  readonly primaryReasonCode: string;
  readonly selectedCandidateId: string | null;
  readonly selectedCampaignPlanId: number | null;
  readonly commandKind: GameCommandV1["kind"] | null;
  readonly commandId: string | null;
  readonly traceCandidateCount: number;
  readonly stateHash: string;
  readonly accepted: boolean;
}

export interface M5MultiYearAiRunResultV1 {
  readonly status: "ok";
  readonly seed: string;
  readonly durationDays: number;
  readonly startDay: number;
  readonly endDay: number;
  readonly yearsSimulated: number;
  readonly finalHash: string;
  readonly scheduleHash: string;
  readonly traceHash: string;
  readonly noDeadlock: true;
  readonly invariantCheckCount: number;
  readonly invariantFailureCount: 0;
  readonly sliceReplay: {
    readonly commandCount: number;
    readonly postwarCandidateCount: number;
    readonly postwarArrangementCount: number;
    readonly duplicatePostwarCommandRejected: true;
    readonly duplicatePostwarCommandErrorCode: string;
  };
  readonly live: {
    readonly aiAttemptCount: number;
    readonly aiCommandCount: number;
    readonly aiNoActionCount: number;
    readonly aiWaitCount: number;
    readonly aiWithdrawCount: number;
    readonly aiTargetChangeCount: number;
    readonly aiRejectionCount: number;
    readonly maxTraceCandidateCount: number;
  };
  readonly reasonEvidence: {
    readonly noAction: M5MultiYearAiTraceEvidenceV1;
    readonly wait: M5MultiYearAiTraceEvidenceV1;
    readonly withdraw: M5MultiYearAiTraceEvidenceV1;
    readonly targetChange: M5MultiYearAiTraceEvidenceV1;
  };
}

interface M5SliceReplayResult {
  readonly runtime: SimulationRuntimeV1;
  readonly commandCount: number;
  readonly postwarCandidateCount: number;
  readonly postwarArrangementCount: number;
  readonly duplicatePostwarCommandErrorCode: string;
}

interface M5AiLiveRunResult {
  readonly runtime: SimulationRuntimeV1;
  readonly scheduleHash: string;
  readonly traceHash: string;
  readonly aiAttemptCount: number;
  readonly aiCommandCount: number;
  readonly aiNoActionCount: number;
  readonly aiWaitCount: number;
  readonly aiWithdrawCount: number;
  readonly aiTargetChangeCount: number;
  readonly aiRejectionCount: number;
  readonly maxTraceCandidateCount: number;
  readonly invariantCheckCount: number;
}

interface M5AiProbeRuntimeInput {
  readonly currentDay?: number;
  readonly campaignPlans?: readonly M4CampaignStateV0["campaignPlans"][number][];
  readonly commitments?: readonly M4CampaignStateV0["mobilizedForceCommitments"][number][];
  readonly reservations?: readonly M4CampaignStateV0["grainSupplyReservations"][number][];
  readonly marches?: readonly M4CampaignStateV0["marches"][number][];
  readonly sieges?: readonly M4CampaignStateV0["sieges"][number][];
  readonly knowledge?: readonly M4CampaignStateV0["factionKnowledgeSnapshots"][number][];
}

export function runM5MultiYearAiValidationV1(
  input: M5MultiYearAiRunInputV1
): M5MultiYearAiRunResultV1 {
  const durationDays = input.durationDays ?? M5_MULTIYEAR_AI_DEFAULT_DURATION_DAYS;
  if (!Number.isSafeInteger(durationDays) || durationDays <= 0) {
    throw new Error("M5 multi-year AI durationDays must be a positive safe integer.");
  }

  const seed = input.seed;
  const sliceReplay = replayAcceptedM5SliceV1();
  const liveRun = runM5MultiYearAiLiveContinuationV1({
    runtime: sliceReplay.runtime,
    seed,
    durationDays
  });
  const finalRuntime = liveRun.runtime;
  const finalHash = finalRuntime.world.meta.stateHash;
  const validationErrors = validateWorldStateV0(finalRuntime.world);
  if (validationErrors.length > 0) {
    throw new Error(
      `M5 multi-year AI final runtime failed invariants: ${validationErrors[0]?.path ?? "unknown"}.`
    );
  }

  const reasonEvidence = createReasonEvidenceV1(seed);
  const combinedScheduleHash = hashRecords([
    `seed=${seed}`,
    `duration=${durationDays}`,
    `slice=${sliceReplay.commandCount}:${sliceReplay.postwarCandidateCount}:${sliceReplay.postwarArrangementCount}`,
    liveRun.scheduleHash,
    reasonEvidence.noAction.stateHash,
    reasonEvidence.wait.stateHash,
    reasonEvidence.withdraw.stateHash,
    reasonEvidence.targetChange.stateHash
  ]);
  const combinedTraceHash = hashRecords([
    `seed=${seed}`,
    `duration=${durationDays}`,
    liveRun.traceHash,
    reasonEvidence.noAction.primaryReasonCode,
    reasonEvidence.wait.primaryReasonCode,
    reasonEvidence.withdraw.primaryReasonCode,
    reasonEvidence.targetChange.primaryReasonCode
  ]);

  return {
    status: "ok",
    seed,
    durationDays,
    startDay: sliceReplay.runtime.world.meta.currentDay,
    endDay: finalRuntime.world.meta.currentDay,
    yearsSimulated: Math.floor(durationDays / 365),
    finalHash,
    scheduleHash: combinedScheduleHash,
    traceHash: combinedTraceHash,
    noDeadlock: true,
    invariantCheckCount: liveRun.invariantCheckCount + 1,
    invariantFailureCount: 0,
    sliceReplay: {
      commandCount: sliceReplay.commandCount,
      postwarCandidateCount: sliceReplay.postwarCandidateCount,
      postwarArrangementCount: sliceReplay.postwarArrangementCount,
      duplicatePostwarCommandRejected: true,
      duplicatePostwarCommandErrorCode: sliceReplay.duplicatePostwarCommandErrorCode
    },
    live: {
      aiAttemptCount: liveRun.aiAttemptCount,
      aiCommandCount: liveRun.aiCommandCount,
      aiNoActionCount: liveRun.aiNoActionCount,
      aiWaitCount: liveRun.aiWaitCount,
      aiWithdrawCount: liveRun.aiWithdrawCount,
      aiTargetChangeCount: liveRun.aiTargetChangeCount,
      aiRejectionCount: liveRun.aiRejectionCount,
      maxTraceCandidateCount: liveRun.maxTraceCandidateCount
    },
    reasonEvidence
  };
}

function replayAcceptedM5SliceV1(): M5SliceReplayResult {
  const script = createM5PlayableLoopScriptV1();
  const boot = bootSimulationV1(script.boot);
  if (boot.status !== "booted") {
    throw new Error(`M5 multi-year AI slice boot rejected: ${boot.error.code}.`);
  }

  let runtime = boot.runtime;
  for (const command of script.successCommands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`M5 multi-year AI slice command rejected: ${submitted.result.error.code}.`);
    }
    runtime = submitted.runtime;
  }

  const duplicate = submitCommandV1(runtime, script.duplicatePostwarCommand);
  if (duplicate.result.status !== "rejected") {
    throw new Error("M5 multi-year AI slice duplicate postwar command was not rejected.");
  }

  return {
    runtime,
    commandCount: script.successCommands.length,
    postwarCandidateCount: runtime.world.state.m4?.postwarCandidates.length ?? 0,
    postwarArrangementCount: runtime.eventTail.filter(
      (event) => event.kind === "sim.m3-postwar-governance-applied"
    ).length,
    duplicatePostwarCommandErrorCode: duplicate.result.error.code
  };
}

function runM5MultiYearAiLiveContinuationV1(input: {
  readonly runtime: SimulationRuntimeV1;
  readonly seed: string;
  readonly durationDays: number;
}): M5AiLiveRunResult {
  const actorPolityIds = input.runtime.world.definitions.polities
    .map((polity) => Number(polity.id))
    .sort((left, right) => left - right);
  if (actorPolityIds.length === 0) {
    throw new Error("M5 multi-year AI live continuation requires at least one polity.");
  }

  const actorRoster = actorPolityIds;
  let rng = createDeterministicRng({
    seed: input.seed,
    domain: {
      system: "m5-multiyear-ai-run",
      day: input.runtime.world.meta.currentDay,
      entity: "live",
      purpose: "actor-schedule",
      substream: "primary"
    }
  });

  let runtime = input.runtime;
  let scheduleHash = "";
  let traceHash = "";
  let aiAttemptCount = 0;
  let aiCommandCount = 0;
  let aiNoActionCount = 0;
  let aiWaitCount = 0;
  let aiWithdrawCount = 0;
  let aiTargetChangeCount = 0;
  const aiRejectionCount = 0;
  let maxTraceCandidateCount = 0;
  let invariantCheckCount = 0;
  let nextCampaignPlanId = nextNumericCampaignPlanId(runtime) + 1;
  let nextMarchId = nextNumericCampaignMarchId(runtime) + 1;
  let nextWithdrawalId = nextNumericWithdrawalId(runtime) + 1;

  for (let index = 0; index < input.durationDays; index += 1) {
    const actorSelection = nextRngInt(rng, actorRoster.length);
    rng = actorSelection.rng;
    const actorPolityId = actorRoster[actorSelection.value];
    if (actorPolityId === undefined) {
      throw new Error("M5 multi-year AI live continuation selected an out-of-range polity.");
    }
    const actorId = `polity:${actorPolityId}`;
    const commandIdPrefix = `m5.multi-year.${input.seed}.${runtime.world.meta.currentDay}.${index}.${actorPolityId}`;

    const planned = planM4CampaignAiTurnV1(runtime, {
      actorId,
      actorPolityId,
      commandIdPrefix,
      nextCampaignPlanId,
      nextMarchId,
      nextWithdrawalId,
      plannedMarchDays: M5_MULTIYEAR_AI_PLANNED_MARCH_DAYS,
      grainPerTroopPerDay: M5_MULTIYEAR_AI_GRAIN_PER_TROOP_PER_DAY,
      maxTraceCandidates: M5_MULTIYEAR_AI_TRACE_CANDIDATE_LIMIT
    });

    aiAttemptCount += 1;
    maxTraceCandidateCount = Math.max(maxTraceCandidateCount, planned.trace.candidates.length);
    if (planned.trace.decisionKind === "no-action") {
      aiNoActionCount += 1;
    } else if (planned.trace.decisionKind === "wait") {
      aiWaitCount += 1;
    } else if (planned.trace.decisionKind === "withdraw") {
      aiWithdrawCount += 1;
    } else if (planned.trace.decisionKind === "change-objective") {
      aiTargetChangeCount += 1;
    }
    scheduleHash = hashRecords([
      scheduleHash,
      `day=${runtime.world.meta.currentDay}`,
      `actor=${actorPolityId}`,
      `decision=${planned.trace.decisionKind}`,
      `candidate=${planned.trace.selectedCandidateId}`,
      `command=${planned.trace.commandId ?? "null"}`
    ]);
    traceHash = hashRecords([
      traceHash,
      `primary=${planned.trace.primaryReasonCode}`,
      `reasons=${planned.trace.reasonCodes.join(",")}`,
      `candidates=${planned.trace.candidates.length}`
    ]);

    if (planned.command !== null) {
      const submitted = submitCommandV1(runtime, planned.command);
      if (submitted.result.status !== "accepted") {
        throw new Error(
          `M5 multi-year AI live command rejected: ${submitted.result.error.code} at ${planned.trace.commandId ?? "unknown"}.`
        );
      }
      aiCommandCount += 1;
      runtime = submitted.runtime;
      if (planned.command.kind === "sim.create-campaign-objective") {
        nextCampaignPlanId += 1;
      } else if (planned.command.kind === "sim.start-campaign-march") {
        nextMarchId += 1;
      } else if (planned.command.kind === "sim.resolve-m4-campaign-withdrawal") {
        nextWithdrawalId += 1;
      }
      invariantCheckCount += validateAndCountWorldState(runtime.world);
    }

    const advance = submitCommandV1(runtime, {
      schemaVersion: 1,
      kind: "sim.advance-day",
      commandId: `m5.multi-year.advance.${index}`,
      actor: { kind: "system", id: "scheduler" },
      expectedDay: runtime.world.meta.currentDay,
      expectedRevision: runtime.world.meta.revision
    });
    if (advance.result.status !== "accepted") {
      throw new Error(`M5 multi-year AI live advance-day rejected: ${advance.result.error.code}.`);
    }
    runtime = advance.runtime;
    invariantCheckCount += validateAndCountWorldState(runtime.world);
  }

  return {
    runtime,
    scheduleHash,
    traceHash,
    aiAttemptCount,
    aiCommandCount,
    aiNoActionCount,
    aiWaitCount,
    aiWithdrawCount,
    aiTargetChangeCount,
    aiRejectionCount,
    maxTraceCandidateCount,
    invariantCheckCount
  };
}

function createReasonEvidenceV1(seed: string): M5MultiYearAiRunResultV1["reasonEvidence"] {
  const noActionRuntime = createAiProbeRuntimeV1({});
  const waitRuntime = createAiProbeRuntimeV1({
    currentDay: 180,
    campaignPlans: [probeCampaignPlanV1({ earliestDay: 180, latestDay: 190 })],
    commitments: [probeCommitmentV1(100, "assembled", 60)],
    reservations: [probeReservationV1(501, 1, 30)]
  });
  const withdrawRuntime = createAiProbeRuntimeV1({
    campaignPlans: [probeCampaignPlanV1({ status: "active" })],
    marches: [
      probeMarchV1({
        supplyStatus: "out-of-supply",
        carriedGrain: 0,
        activeTroops: 40
      })
    ]
  });
  const targetChangeRuntime = createAiProbeRuntimeV1({
    campaignPlans: [probeCampaignPlanV1({ targetDistrictId: 3 })],
    knowledge: [probeKnowledgeSnapshotV1(1, 2)]
  });

  return {
    noAction: runReasonEvidenceProbeV1(noActionRuntime, {
      actorId: "polity:2",
      actorPolityId: 2,
      commandIdPrefix: `m5.multi-year.${seed}.probe.no-action`,
      nextCampaignPlanId: 910,
      nextMarchId: 701,
      nextWithdrawalId: 901,
      plannedMarchDays: M5_MULTIYEAR_AI_PLANNED_MARCH_DAYS,
      grainPerTroopPerDay: M5_MULTIYEAR_AI_GRAIN_PER_TROOP_PER_DAY,
      maxTraceCandidates: M5_MULTIYEAR_AI_TRACE_CANDIDATE_LIMIT
    }),
    wait: runReasonEvidenceProbeV1(waitRuntime, {
      actorId: "polity:1",
      actorPolityId: 1,
      commandIdPrefix: `m5.multi-year.${seed}.probe.wait`,
      nextCampaignPlanId: 910,
      nextMarchId: 701,
      nextWithdrawalId: 901,
      plannedMarchDays: M5_MULTIYEAR_AI_PLANNED_MARCH_DAYS,
      grainPerTroopPerDay: M5_MULTIYEAR_AI_GRAIN_PER_TROOP_PER_DAY,
      maxTraceCandidates: M5_MULTIYEAR_AI_TRACE_CANDIDATE_LIMIT
    }),
    withdraw: runReasonEvidenceProbeV1(withdrawRuntime, {
      actorId: "polity:1",
      actorPolityId: 1,
      commandIdPrefix: `m5.multi-year.${seed}.probe.withdraw`,
      nextCampaignPlanId: 910,
      nextMarchId: 701,
      nextWithdrawalId: 901,
      plannedMarchDays: M5_MULTIYEAR_AI_PLANNED_MARCH_DAYS,
      grainPerTroopPerDay: M5_MULTIYEAR_AI_GRAIN_PER_TROOP_PER_DAY,
      maxTraceCandidates: M5_MULTIYEAR_AI_TRACE_CANDIDATE_LIMIT
    }),
    targetChange: runReasonEvidenceProbeV1(targetChangeRuntime, {
      actorId: "polity:1",
      actorPolityId: 1,
      commandIdPrefix: `m5.multi-year.${seed}.probe.target-change`,
      nextCampaignPlanId: 910,
      nextMarchId: 701,
      nextWithdrawalId: 901,
      plannedMarchDays: M5_MULTIYEAR_AI_PLANNED_MARCH_DAYS,
      grainPerTroopPerDay: M5_MULTIYEAR_AI_GRAIN_PER_TROOP_PER_DAY,
      maxTraceCandidates: M5_MULTIYEAR_AI_TRACE_CANDIDATE_LIMIT
    })
  };
}

function runReasonEvidenceProbeV1(
  runtime: SimulationRuntimeV1,
  input: PlanM4CampaignAiTurnInputV1
): M5MultiYearAiTraceEvidenceV1 {
  const planned = planM4CampaignAiTurnV1(runtime, input);
  const selectedCandidateId = planned.trace.selectedCandidateId;
  const commandKind = planned.trace.commandKind;
  const commandId = planned.trace.commandId;
  const accepted = planned.command !== null;
  let nextRuntime = runtime;
  if (planned.command !== null) {
    const submitted = submitCommandV1(runtime, planned.command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`M5 multi-year AI probe command rejected: ${submitted.result.error.code}.`);
    }
    nextRuntime = submitted.runtime;
  }

  const validationErrors = validateWorldStateV0(nextRuntime.world);
  if (validationErrors.length > 0) {
    throw new Error(
      `M5 multi-year AI probe invalid runtime: ${validationErrors[0]?.path ?? "unknown"}.`
    );
  }

  return {
    decisionKind: planned.trace.decisionKind,
    primaryReasonCode: planned.trace.primaryReasonCode,
    selectedCandidateId,
    selectedCampaignPlanId: planned.trace.selectedCampaignPlanId,
    commandKind,
    commandId,
    traceCandidateCount: planned.trace.candidates.length,
    stateHash: nextRuntime.world.meta.stateHash,
    accepted
  };
}

function createAiProbeRuntimeV1(input: M5AiProbeRuntimeInput): SimulationRuntimeV1 {
  const routes = defaultRoutesV1();
  const definitions = definitionsV1(routes);
  const baseM2 = createM2EconomyPopulationStateV0(definitions, {
    routes,
    districtSeasonality: [
      { districtId: 1, regionalCurveId: 1 },
      { districtId: 2, regionalCurveId: 1 },
      { districtId: 3, regionalCurveId: 1 }
    ],
    regionalCurves: [
      {
        id: 1,
        monthlyValues: Array.from({ length: 12 }, (_unused, index) => ({
          month: index + 1,
          monsoonIntensityBps: index + 1 === 7 ? 8_000 : 0,
          agricultureWorkBps: 5_000,
          riverNavigabilityBps: 8_000,
          roadTravelCostBps: index + 1 === 7 ? 16_000 : 10_000
        }))
      }
    ]
  });
  const m2 = canonicalizeM2EconomyPopulationState({
    ...baseM2,
    populationGroups: [
      probePopulationGroupV1(1, 1_000),
      probePopulationGroupV1(2, 1_000),
      probePopulationGroupV1(3, 1_000)
    ]
  });
  const world = createWorldStateV0({
    seed: 1531,
    contentManifestHash: "m5-multiyear-ai-run",
    currentDay: input.currentDay ?? 10,
    revision: 0,
    definitions,
    m2,
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: parsePolityId(1), directSuzerainPolityId: null },
        { polityId: parsePolityId(2), directSuzerainPolityId: parsePolityId(1) }
      ],
      obligations: [probeTroopObligationV1()],
      obligationAuditEvents: [probeTroopObligationAuditEventV1()]
    }),
    m4: createM4CampaignStateV0(definitions, {
      campaignPlans: input.campaignPlans ?? [],
      factionKnowledgeSnapshots: input.knowledge ?? [],
      mobilizedForceCommitments: input.commitments ?? [],
      grainSupplyReservations: input.reservations ?? [],
      marches: input.marches ?? [],
      sieges: input.sieges ?? []
    })
  });
  const controlledWorld: WorldStateV0 = {
    ...world,
    state: {
      ...world.state,
      districts: world.state.districts.map((district) => ({
        ...district,
        control: { kind: "controlled", controllerPolityId: parsePolityId(1) }
      }))
    }
  };
  return {
    world: {
      ...controlledWorld,
      meta: { ...controlledWorld.meta, stateHash: hashWorldStateV0(controlledWorld) }
    },
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function defaultRoutesV1(): readonly M2RouteTransportEdgeStateV0[] {
  return [probeRouteV1(10, 1, 2, 1, 120), probeRouteV1(11, 2, 3, 1, 120)];
}

function definitionsV1(
  routes: readonly M2RouteTransportEdgeStateV0[] = defaultRoutesV1()
): WorldDefinitionsV0 {
  return {
    polities: [
      { id: parsePolityId(1), displayNameKey: "polity.m5.ai-owner" },
      { id: parsePolityId(2), displayNameKey: "polity.m5.ai-vassal" }
    ],
    persons: [{ id: parsePersonId(1), displayNameKey: "person.m5.ai-commander" }],
    districts: [
      { id: parseDistrictId(1), displayNameKey: "district.m5.ai-origin" },
      { id: parseDistrictId(2), displayNameKey: "district.m5.ai-target-a" },
      { id: parseDistrictId(3), displayNameKey: "district.m5.ai-target-b" }
    ],
    settlements: [],
    routes: routes.map((entry) => ({
      id: entry.routeId,
      fromDistrictId: entry.fromDistrictId,
      toDistrictId: entry.toDistrictId,
      lengthInMapUnits: entry.baseTravelCost
    }))
  };
}

function probeRouteV1(
  routeId: number,
  fromDistrictId: number,
  toDistrictId: number,
  baseTravelCost: number,
  baseCapacity: number
): M2RouteTransportEdgeStateV0 {
  return {
    routeId: parseRouteId(routeId),
    fromDistrictId: parseDistrictId(fromDistrictId),
    toDistrictId: parseDistrictId(toDistrictId),
    routeKind: "road",
    baseTravelCost,
    baseCapacity
  };
}

function probePopulationGroupV1(districtId: number, grainStock: number) {
  return {
    id: parsePopulationGroupId(districtId),
    districtId: parseDistrictId(districtId),
    totalPeople: 1_000,
    workingPeople: 500,
    dependentPeople: 500,
    availableLabor: 500,
    committedLabor: [],
    grainStock,
    cashStock: 1_000
  };
}

function probeCampaignPlanV1(input: {
  readonly id?: number;
  readonly targetDistrictId?: number;
  readonly earliestDay?: number;
  readonly latestDay?: number;
  readonly status?: "planned" | "active";
}): M4CampaignStateV0["campaignPlans"][number] {
  return {
    id: parseCampaignPlanId(input.id ?? 10),
    owner: { kind: "polity", polityId: parsePolityId(1) },
    target: { kind: "district", districtId: parseDistrictId(input.targetDistrictId ?? 3) },
    objectiveKind: "besiege",
    startWindow: {
      earliestDay: parseGameDay(input.earliestDay ?? 10),
      latestDay: parseGameDay(input.latestDay ?? 20)
    },
    status: input.status ?? "planned",
    statusReasonCode:
      input.status === "active" ? "campaign.objective.march-arrived" : "campaign.objective.created",
    reasonCodes: ["campaign.reason.ai-fixture"],
    createdDay: parseGameDay(10),
    updatedDay: parseGameDay(10)
  };
}

function probeCommitmentV1(
  id: number,
  status: "assembled" | "delayed",
  assembledTroops: number
): M4CampaignStateV0["mobilizedForceCommitments"][number] {
  return {
    id: parseMobilizedForceCommitmentId(id),
    campaignPlanId: parseCampaignPlanId(10),
    source: {
      kind: "m3-obligation",
      obligationId: parseM3ObligationId(1),
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    promisedTroops: 60,
    dueDay: parseGameDay(20),
    assemblyWindow: { earliestDay: parseGameDay(10), latestDay: parseGameDay(18) },
    plannedAssemblyDay: parseGameDay(10),
    assembledTroops,
    delayedTroops: status === "delayed" ? 60 - assembledTroops : 0,
    refusedTroops: 0,
    releasedTroops: 0,
    status,
    statusReasonCode: status === "assembled" ? "muster.response.assembled" : "muster.response.late",
    reasonCodes: ["muster.reason.obligation-request"],
    localCostHooks: []
  };
}

function probeReservationV1(
  reservationId: number,
  districtId: number,
  carriedAmount: number
): M4CampaignStateV0["grainSupplyReservations"][number] {
  return {
    reservationId: parseGrainSupplyReservationId(reservationId),
    campaignPlanId: parseCampaignPlanId(10),
    source: {
      kind: "m2-population-group",
      populationGroupId: parsePopulationGroupId(districtId),
      districtId: parseDistrictId(districtId)
    },
    reservedAmount: carriedAmount,
    carriedAmount,
    consumedAmount: 0,
    shortageAmount: 0,
    lossAmount: 0,
    lossReasonCode: null,
    expectedDailyConsumption: 60,
    expectedDaysOfSupply: carriedAmount === 0 ? 0 : Math.floor(carriedAmount / 60),
    status: carriedAmount === 0 ? "consumed" : "reserved",
    statusReasonCode: carriedAmount === 0 ? "grain.supply.consumed" : "grain.supply.reserved",
    reasonCodes: ["grain.supply.reserved"]
  };
}

function probeMarchV1(input: {
  readonly campaignPlanId?: number;
  readonly supplyStatus: "well-supplied" | "hungry" | "out-of-supply";
  readonly carriedGrain: number;
  readonly activeTroops: number;
}): M4CampaignStateV0["marches"][number] {
  return {
    marchId: parseCampaignMarchId(701),
    campaignPlanId: parseCampaignPlanId(input.campaignPlanId ?? 10),
    originDistrictId: parseDistrictId(1),
    targetDistrictId: parseDistrictId(3),
    currentDistrictId: parseDistrictId(3),
    routeSegments: [
      {
        routeId: parseRouteId(10),
        fromDistrictId: parseDistrictId(1),
        toDistrictId: parseDistrictId(2),
        travelDays: 1,
        capacity: 120,
        seasonRiskReasonCodes: []
      },
      {
        routeId: parseRouteId(11),
        fromDistrictId: parseDistrictId(2),
        toDistrictId: parseDistrictId(3),
        travelDays: 1,
        capacity: 120,
        seasonRiskReasonCodes: []
      }
    ],
    currentSegmentIndex: 1,
    progressOnSegmentDays: 0,
    activeTroops: input.activeTroops,
    grainPerTroopPerDay: 1,
    supply: {
      status: input.supplyStatus,
      carriedGrain: input.carriedGrain,
      consumedGrain: 0,
      shortageGrain: input.supplyStatus === "out-of-supply" ? 60 : 0,
      delayedDays: input.supplyStatus === "well-supplied" ? 0 : 1
    },
    status: "arrived",
    statusReasonCode: "march.arrived",
    reasonCodes: ["march.arrived"],
    startedDay: parseGameDay(10),
    updatedDay: parseGameDay(10),
    predictedArrivalWindow: { earliestDay: parseGameDay(10), latestDay: parseGameDay(10) },
    actualArrivalDay: parseGameDay(10),
    joinedCommitmentIds: [],
    joinedCommitmentTroops: [],
    failedCommitmentIds: []
  };
}

function probeKnowledgeSnapshotV1(
  snapshotId: number,
  targetDistrictId: number
): M4CampaignStateV0["factionKnowledgeSnapshots"][number] {
  return {
    snapshotId: parseFactionKnowledgeSnapshotId(snapshotId),
    observerPolityId: parsePolityId(1),
    subjectPolityId: parsePolityId(2),
    knowledgeVersion: 1,
    recordedDay: parseGameDay(10),
    source: { kind: "scout", sourceId: "m5.ai.scout", reliabilityBps: 8_000 },
    knownObjectives: [],
    routeEstimates: [],
    supplyEstimates: [],
    defenderEstimates: [
      {
        target: { kind: "district", districtId: parseDistrictId(targetDistrictId) },
        defenderMin: 10,
        defenderMax: 20,
        confidenceBps: 8_000
      }
    ]
  };
}

function probeTroopObligationV1(): NonNullable<WorldStateV0["state"]["m3"]>["obligations"][number] {
  return {
    id: parseM3ObligationId(1),
    debtorPolityId: parsePolityId(2),
    creditorPolityId: parsePolityId(1),
    obligationKind: "troop",
    obligationCategory: "troop-obligation",
    obligationSource: {
      kind: "vassalage",
      sourceId: "m5.ai.vassalage.2-to-1",
      debtorPolityId: parsePolityId(2),
      creditorPolityId: parsePolityId(1)
    },
    requirement: { kind: "amount", resourceKind: "troops", amount: 120 },
    due: { kind: "cadence", periodDays: 20, nextDueDay: parseGameDay(20) },
    accounting: {
      nominalAmount: 120,
      dueAmount: 120,
      deliveredAmount: 0,
      arrearsAmount: 0,
      defaultedAmount: 0,
      remittedAmount: 0,
      dueDay: parseGameDay(20),
      cycle: 1,
      troopResponseState: "none"
    },
    status: "active",
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: parseM3ObligationAuditEventId(1),
    latestAuditEventId: parseM3ObligationAuditEventId(1)
  };
}

function probeTroopObligationAuditEventV1(): NonNullable<
  WorldStateV0["state"]["m3"]
>["obligationAuditEvents"][number] {
  return {
    id: parseM3ObligationAuditEventId(1),
    obligationId: parseM3ObligationId(1),
    eventKind: "created",
    eventDay: parseGameDay(0),
    eventRevision: parseWorldRevision(0),
    commandId: "m5.ai.obligation.fixture",
    actor: { kind: "system", id: "fixture" },
    actionKind: null,
    dueDay: null,
    fulfillmentId: null,
    fulfilledAmount: null,
    statusAfter: "active",
    reasonCode: null,
    reasonCodes: ["obligation.created", "obligation.kind.troop-obligation"],
    reliabilityBps: 10_000
  };
}

function validateAndCountWorldState(world: WorldStateV1OrV0): number {
  const validationErrors = validateWorldStateV0(world);
  if (validationErrors.length > 0) {
    throw new Error(
      `M5 multi-year AI invariant failure: ${validationErrors[0]?.path ?? "unknown"}.`
    );
  }
  return 1;
}

type WorldStateV1OrV0 = WorldStateV0;

function nextNumericCampaignPlanId(runtime: SimulationRuntimeV1): number {
  return (
    runtime.world.state.m4?.campaignPlans.reduce((max, plan) => Math.max(max, plan.id), 0) ?? 0
  );
}

function nextNumericCampaignMarchId(runtime: SimulationRuntimeV1): number {
  return (
    runtime.world.state.m4?.marches.reduce((max, march) => Math.max(max, march.marchId), 0) ?? 0
  );
}

function nextNumericWithdrawalId(runtime: SimulationRuntimeV1): number {
  return (
    runtime.world.state.m4?.withdrawals.reduce(
      (max, withdrawal) => Math.max(max, withdrawal.withdrawalId),
      0
    ) ?? 0
  );
}

function hashRecords(records: readonly string[]): string {
  return toFixedHexHash(hashText(records.join("\n")));
}

function hashText(text: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619) >>> 0;
  }
  return hash;
}

function toFixedHexHash(hash: number): string {
  return hash.toString(16).padStart(8, "0");
}

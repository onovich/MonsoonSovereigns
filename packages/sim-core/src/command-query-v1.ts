import {
  SIMULATION_MESSAGE_PROTOCOL_VERSION,
  parseBootSimulationInputV1,
  parseGameCommandV1,
  parseGameQueryV1,
  type BootSimulationInputV1,
  type CommandActorV1,
  type GameCommandV1,
  type GameQueryV1,
  type SaveLoadCanaryScriptV1,
  type ProtocolErrorCodeV1,
  type SerializableProtocolErrorV1
} from "@monsoon/protocol";
import {
  createSaveEnvelopeV1,
  decodeSaveEnvelopeV1,
  encodeSaveEnvelopeV1,
  saveWorldStateV0DtoToCandidate,
  worldStateV0ToSaveDto,
  type DecodeSaveEnvelopeV1Options,
  type SaveBuildMetadataV1,
  type SaveEnvelopeV1,
  type SaveLoadRejectionReasonV1
} from "@monsoon/save-format";

import { advanceWorldByGameDay, getGameCalendarDate } from "./scheduler-v0.ts";
import { bootWorldStateFromRuntimeContentPackV1 } from "./boot-content-runtime-v1.ts";
import { previewM2TransportRouteV0 } from "./m2-route-transport-v0.ts";
import {
  M1_ABSTRACT_GRAPH_30_CONTENT_MANIFEST_HASH,
  M1_ABSTRACT_GRAPH_30_SCENARIO_ID,
  createAbstractGraph30WorldStateV0,
  createMinimalM1WorldStateV0
} from "./minimal-m1-fixture.ts";
import {
  hashWorldStateV0,
  parseDistrictId,
  parseGameDay,
  parseM3FulfillmentId,
  parseM3ObligationAuditEventId,
  parseM3ObligationId,
  parsePopulationGroupId,
  parsePolityId,
  parseWorldRevision,
  validateWorldStateV0,
  canonicalizeM2EconomyPopulationState,
  canonicalizeM3PolityVassalageState,
  type DistrictControlState,
  type DistrictId,
  type M3ObligationAuditEventStateV0,
  type M3ObligationDueV0,
  type M3ObligationRequirementV0,
  type M3ObligationStateV0,
  type M3ObligationStatusV0,
  type M3PolityRecordStateV0,
  type M2LaborCommitmentPurposeV0,
  type M2RouteKindV0,
  type M2PopulationGroupStateV0,
  type PopulationGroupId,
  type PolityId,
  type RouteId,
  type WorldRevision,
  type WorldStateV0
} from "./world-state-v0.ts";

export type DomainErrorCodeV1 =
  | "acyclicity-violation"
  | "bad-id"
  | "duplicate-command"
  | "duplicate-fulfillment"
  | "hash-mismatch"
  | "insufficient-labor"
  | "invalid-content-pack"
  | "invalid-payload"
  | "invariant-violation"
  | "m2-state-missing"
  | "m3-state-missing"
  | "stale-day"
  | "stale-revision"
  | "unknown-command-kind"
  | "unknown-query-kind"
  | "unsupported-command-version"
  | "unsupported-query-version";

export interface DomainErrorV1 {
  readonly code: DomainErrorCodeV1;
  readonly path: string;
  readonly message: string;
}

export interface SimulationRuntimeV1 {
  readonly world: WorldStateV0;
  readonly acceptedCommandIds: readonly string[];
  readonly commandTail: readonly GameCommandV1[];
  readonly eventTail: readonly DomainEventV1[];
}

export type DomainEventV1 =
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.day-advanced";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly fromDay: number;
      readonly toDay: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.district-control-changed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly districtId: DistrictId;
      readonly previousControllerPolityId: PolityId | null;
      readonly nextControllerPolityId: PolityId | null;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.state-hash-verified";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly day: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.labor-committed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly populationGroupId: PopulationGroupId;
      readonly purpose: M2LaborCommitmentPurposeV0;
      readonly laborAmount: number;
      readonly releaseDay: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.polity-suzerain-changed";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly polityId: PolityId;
      readonly previousSuzerainPolityId: PolityId | null;
      readonly nextSuzerainPolityId: PolityId | null;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.obligation-created";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly obligationId: number;
      readonly debtorPolityId: PolityId;
      readonly creditorPolityId: PolityId;
      readonly auditEventId: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "sim.obligation-fulfilled";
      readonly commandId: string;
      readonly actor: CommandActorV1;
      readonly obligationId: number;
      readonly fulfillmentId: number;
      readonly fulfilledAmount: number;
      readonly auditEventId: number;
      readonly revisionBefore: number;
      readonly revisionAfter: number;
    };

export type StateDeltaV1 =
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.day-changed";
      readonly day: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.district-control-updated";
      readonly districtId: DistrictId;
      readonly control: DistrictControlState;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.hash-observed";
      readonly day: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m2-population-group-updated";
      readonly populationGroupId: PopulationGroupId;
      readonly availableLabor: number;
      readonly committedLabor: number;
      readonly grainStock: number;
      readonly cashStock: number;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-polity-updated";
      readonly polityId: PolityId;
      readonly directSuzerainPolityId: PolityId | null;
      readonly revision: number;
      readonly stateHash: string;
    }
  | {
      readonly schemaVersion: 1;
      readonly kind: "state.m3-obligation-updated";
      readonly obligationId: number;
      readonly status: M3ObligationStatusV0;
      readonly latestAuditEventId: number;
      readonly revision: number;
      readonly stateHash: string;
    };

export type CommandPreviewV1 =
  | {
      readonly status: "accepted";
      readonly commandId: string;
      readonly wouldChangeState: boolean;
      readonly events: readonly DomainEventV1[];
      readonly deltas: readonly StateDeltaV1[];
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly commandId: string | null;
      readonly error: DomainErrorV1;
      readonly stateHash: string;
    };

export type CommandResultV1 =
  | {
      readonly status: "accepted";
      readonly commandId: string;
      readonly revisionBefore: WorldRevision;
      readonly revisionAfter: WorldRevision;
      readonly events: readonly DomainEventV1[];
      readonly deltas: readonly StateDeltaV1[];
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly commandId: string | null;
      readonly error: DomainErrorV1;
      readonly stateHash: string;
    };

export interface SubmitCommandOutputV1 {
  readonly runtime: SimulationRuntimeV1;
  readonly result: CommandResultV1;
}

export interface RequestSaveOutputV1 {
  readonly bytes: Uint8Array;
  readonly envelope: SaveEnvelopeV1;
  readonly stateHash: string;
  readonly byteLength: number;
}

export type LoadSaveOutputV1 =
  | {
      readonly status: "loaded";
      readonly runtime: SimulationRuntimeV1;
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly runtime: SimulationRuntimeV1;
      readonly reasons: readonly SaveLoadRejectionReasonV1[];
    };

export type BootSimulationResultV1 =
  | {
      readonly status: "booted";
      readonly runtime: SimulationRuntimeV1;
      readonly stateHash: string;
    }
  | {
      readonly status: "rejected";
      readonly error: DomainErrorV1;
    };

export type QueryResultV1 =
  | {
      readonly status: "ok";
      readonly result:
        | {
            readonly kind: "sim.get-state-hash";
            readonly day: number;
            readonly revision: number;
            readonly stateHash: string;
          }
        | {
            readonly kind: "sim.get-calendar";
            readonly day: number;
            readonly revision: number;
          }
        | {
            readonly kind: "sim.list-district-summaries";
            readonly day: number;
            readonly revision: number;
            readonly districts: readonly DistrictSummaryReadModelV1[];
          }
        | {
            readonly kind: "sim.list-m2-economy-summaries";
            readonly day: number;
            readonly revision: number;
            readonly districts: readonly M2EconomyDistrictSummaryReadModelV1[];
          }
        | {
            readonly kind: "sim.preview-m2-transport-route";
            readonly day: number;
            readonly revision: number;
            readonly monthOfYear: number;
            readonly route: M2TransportRoutePreviewReadModelV1;
          };
    }
  | {
      readonly status: "rejected";
      readonly error: DomainErrorV1;
    };

export interface DistrictSummaryReadModelV1 {
  readonly districtId: DistrictId;
  readonly displayNameKey: string;
  readonly control: DistrictControlState;
}

export interface M2EconomyDistrictSummaryReadModelV1 {
  readonly districtId: DistrictId;
  readonly population: number;
  readonly availableLabor: number;
  readonly committedLabor: number;
  readonly grainStock: number;
  readonly cashStock: number;
  readonly agriculturePhase: string;
  readonly lastHarvestGrain: number;
  readonly cumulativeMobilizationCost: number;
}

export type M2TransportRoutePreviewReadModelV1 =
  | {
      readonly status: "unreachable";
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly edges: readonly [];
    }
  | {
      readonly status: "capacity-exceeded" | "reachable";
      readonly originDistrictId: DistrictId;
      readonly destinationDistrictId: DistrictId;
      readonly stockAmount: number;
      readonly totalCost: number;
      readonly bottleneckCapacity: number;
      readonly edges: readonly M2TransportRoutePreviewEdgeReadModelV1[];
    };

export interface M2TransportRoutePreviewEdgeReadModelV1 {
  readonly routeId: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly routeKind: M2RouteKindV0;
  readonly baseTravelCost: number;
  readonly seasonalCost: number;
  readonly baseCapacity: number;
  readonly seasonalCapacity: number;
  readonly stockAmount: number;
  readonly remainingCapacityAfterStock: number;
}

interface CommandEvaluationV1 {
  readonly command: GameCommandV1;
  readonly nextWorld: WorldStateV0;
  readonly events: readonly DomainEventV1[];
  readonly deltas: readonly StateDeltaV1[];
  readonly wouldChangeState: boolean;
}

export interface CommandQueryCanaryResultV1 {
  readonly status: "ok";
  readonly finalHash: string;
  readonly finalDay: number;
  readonly finalRevision: number;
}

export interface SaveLoadCanaryResultV1 {
  readonly status: "ok";
  readonly finalHash: string;
  readonly loadedHash: string;
  readonly replayedHash: string;
  readonly saveByteLength: number;
}

export function bootSimulationV1(input: unknown): BootSimulationResultV1 {
  const parsed = parseBootSimulationInputV1(input);
  if (!parsed.ok) {
    return { status: "rejected", error: fromProtocolError(parsed.error) };
  }

  return bootParsedSimulationV1(parsed.value);
}

export function previewCommandV1(runtime: SimulationRuntimeV1, input: unknown): CommandPreviewV1 {
  const evaluated = validateAndEvaluateCommand(runtime, input);
  if (!evaluated.ok) {
    return {
      status: "rejected",
      commandId: readCommandId(input),
      error: evaluated.error,
      stateHash: runtime.world.meta.stateHash
    };
  }

  return {
    status: "accepted",
    commandId: evaluated.value.command.commandId,
    wouldChangeState: evaluated.value.wouldChangeState,
    events: evaluated.value.events,
    deltas: evaluated.value.deltas,
    stateHash: evaluated.value.nextWorld.meta.stateHash
  };
}

export function submitCommandV1(
  runtime: SimulationRuntimeV1,
  input: unknown
): SubmitCommandOutputV1 {
  const evaluated = validateAndEvaluateCommand(runtime, input);
  if (!evaluated.ok) {
    return {
      runtime,
      result: {
        status: "rejected",
        commandId: readCommandId(input),
        error: evaluated.error,
        stateHash: runtime.world.meta.stateHash
      }
    };
  }

  const nextRuntime: SimulationRuntimeV1 = {
    world: evaluated.value.nextWorld,
    acceptedCommandIds: appendAcceptedCommandId(
      runtime.acceptedCommandIds,
      evaluated.value.command.commandId
    ),
    commandTail: appendTail(runtime.commandTail, evaluated.value.command),
    eventTail: appendTail(runtime.eventTail, ...evaluated.value.events)
  };

  return {
    runtime: nextRuntime,
    result: {
      status: "accepted",
      commandId: evaluated.value.command.commandId,
      revisionBefore: runtime.world.meta.revision,
      revisionAfter: nextRuntime.world.meta.revision,
      events: evaluated.value.events,
      deltas: evaluated.value.deltas,
      stateHash: nextRuntime.world.meta.stateHash
    }
  };
}

export function querySimulationV1(runtime: SimulationRuntimeV1, input: unknown): QueryResultV1 {
  const parsed = parseGameQueryV1(input);
  if (!parsed.ok) {
    return { status: "rejected", error: fromProtocolError(parsed.error) };
  }

  return executeQuery(runtime, parsed.value);
}

export function runCommandQueryCanaryV1(input: unknown): CommandQueryCanaryResultV1 {
  if (!isRecord(input)) {
    throw new Error("Command/query canary script must be an object.");
  }

  const boot = bootSimulationV1(input["boot"]);
  if (boot.status !== "booted") {
    throw new Error(`Command/query canary boot rejected: ${boot.error.code}.`);
  }

  const commands = input["commands"];
  if (!Array.isArray(commands)) {
    throw new Error("Command/query canary commands must be an array.");
  }

  let runtime = boot.runtime;
  for (const command of commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`Command/query canary command rejected: ${submitted.result.error.code}.`);
    }

    runtime = submitted.runtime;
  }

  return {
    status: "ok",
    finalHash: runtime.world.meta.stateHash,
    finalDay: runtime.world.meta.currentDay,
    finalRevision: runtime.world.meta.revision
  };
}

export function requestSaveV1(
  runtime: SimulationRuntimeV1,
  build: SaveBuildMetadataV1
): RequestSaveOutputV1 {
  if (runtime.world.state.m3 !== undefined) {
    throw new Error(
      "requestSaveV1 does not support WorldState state.m3; refusing to emit incompatible save bytes."
    );
  }

  const envelope = createSaveEnvelopeV1({
    build,
    scenarioId: scenarioIdForRuntime(runtime),
    authoritativeSnapshot: worldStateV0ToSaveDto(runtime.world),
    scheduler: runtime.world.scheduler,
    rng: {
      schemaVersion: 1,
      algorithm: "sfc32-fnv1a32-domain-v1",
      savedStreams: []
    },
    commandTail: runtime.commandTail.map((command, index) => ({
      sequence: index + 1,
      command
    })),
    eventTail: runtime.eventTail.map((event, index) => ({
      sequence: index + 1,
      event: domainEventToRecord(event)
    }))
  });
  const bytes = encodeSaveEnvelopeV1(envelope);

  return {
    bytes,
    envelope,
    stateHash: runtime.world.meta.stateHash,
    byteLength: bytes.byteLength
  };
}

export function loadSaveV1(
  runtime: SimulationRuntimeV1,
  bytes: Uint8Array,
  options: Pick<
    DecodeSaveEnvelopeV1Options,
    "expectedContentManifestHash" | "expectedScenarioId" | "maxBytes" | "maxDepth"
  > = {}
): LoadSaveOutputV1 {
  const decoded = decodeSaveEnvelopeV1(bytes, {
    ...options,
    validateWorldSnapshot: (candidate) => {
      if (runtime.world.state.m2 !== undefined && !hasM2RuntimeState(candidate)) {
        return [
          {
            path: "state.m2",
            message: "Save snapshot is missing required M2 runtime state for this runtime."
          }
        ];
      }

      return validateWorldStateV0(candidate);
    }
  });
  if (decoded.status === "rejected") {
    return {
      status: "rejected",
      runtime,
      reasons: decoded.reasons
    };
  }

  const candidate = saveWorldStateV0DtoToCandidate(
    decoded.envelope.body.authoritativeSnapshot,
    decoded.envelope.body.scheduler
  );
  const invariantErrors = validateWorldStateV0(candidate);
  if (invariantErrors.length > 0) {
    return {
      status: "rejected",
      runtime,
      reasons: invariantErrors.map((error) => ({
        code: "semantic-invariant",
        path: error.path,
        message: error.message
      }))
    };
  }

  const loadedWorld = candidate as WorldStateV0;
  const eventTail = parseSavedEventTail(decoded.envelope.body.eventTail);
  if (!eventTail.ok) {
    return {
      status: "rejected",
      runtime,
      reasons: eventTail.reasons
    };
  }

  const loadedRuntime: SimulationRuntimeV1 = {
    world: loadedWorld,
    acceptedCommandIds: decoded.envelope.body.commandTail.map((entry) => entry.command.commandId),
    commandTail: decoded.envelope.body.commandTail.map((entry) => entry.command),
    eventTail: eventTail.value
  };

  return {
    status: "loaded",
    runtime: loadedRuntime,
    stateHash: loadedWorld.meta.stateHash
  };
}

export function runSaveLoadCanaryV1(input: SaveLoadCanaryScriptV1): SaveLoadCanaryResultV1 {
  const boot = bootSimulationV1(input.boot);
  if (boot.status !== "booted") {
    throw new Error(`Save/load canary boot rejected: ${boot.error.code}.`);
  }

  let runtime = boot.runtime;
  for (const command of input.commands) {
    const submitted = submitCommandV1(runtime, command);
    if (submitted.result.status !== "accepted") {
      throw new Error(`Save/load canary command rejected: ${submitted.result.error.code}.`);
    }
    runtime = submitted.runtime;
  }

  const saved = requestSaveV1(runtime, {
    appVersion: "0.0.0",
    source: "node-runner",
    codecVersion: "save-envelope-v1"
  });
  const loaded = loadSaveV1(boot.runtime, saved.bytes, {
    expectedContentManifestHash: input.expectedContentManifestHash,
    expectedScenarioId: input.expectedScenarioId
  });
  if (loaded.status !== "loaded") {
    throw new Error(`Save/load canary load rejected: ${loaded.reasons[0]?.code ?? "unknown"}.`);
  }

  const verify = submitCommandV1(loaded.runtime, {
    schemaVersion: 1,
    kind: "sim.verify-state-hash",
    commandId: "save.canary.verify.loaded",
    actor: { kind: "system", id: "save-canary" },
    expectedDay: loaded.runtime.world.meta.currentDay,
    expectedRevision: loaded.runtime.world.meta.revision,
    expectedHash: loaded.runtime.world.meta.stateHash
  });
  if (verify.result.status !== "accepted") {
    throw new Error(`Save/load canary verify rejected: ${verify.result.error.code}.`);
  }

  return {
    status: "ok",
    finalHash: runtime.world.meta.stateHash,
    loadedHash: loaded.runtime.world.meta.stateHash,
    replayedHash: verify.runtime.world.meta.stateHash,
    saveByteLength: saved.byteLength
  };
}

function bootParsedSimulationV1(input: BootSimulationInputV1): BootSimulationResultV1 {
  if (input.protocolVersion !== SIMULATION_MESSAGE_PROTOCOL_VERSION) {
    return {
      status: "rejected",
      error: {
        code: "invalid-payload",
        path: "protocolVersion",
        message: "Unsupported simulation protocol version."
      }
    };
  }

  const worldResult =
    "source" in input
      ? bootWorldStateFromRuntimeContentPackV1({
          seed: input.seed,
          runtimeContentPack: input.runtimeContentPack
        })
      : {
          status: "booted" as const,
          world:
            input.fixture === "m1.abstract-graph-30"
              ? createAbstractGraph30WorldStateV0()
              : createMinimalM1WorldStateV0()
        };

  if (worldResult.status === "rejected") {
    return {
      status: "rejected",
      error: worldResult.error
    };
  }

  const world = worldResult.world;
  return {
    status: "booted",
    runtime: {
      world,
      acceptedCommandIds: [],
      commandTail: [],
      eventTail: []
    },
    stateHash: world.meta.stateHash
  };
}

type EvaluationResult =
  | { readonly ok: true; readonly value: CommandEvaluationV1 }
  | { readonly ok: false; readonly error: DomainErrorV1 };

function validateAndEvaluateCommand(
  runtime: SimulationRuntimeV1,
  input: unknown
): EvaluationResult {
  const parsed = parseGameCommandV1(input);
  if (!parsed.ok) {
    return { ok: false, error: fromProtocolError(parsed.error) };
  }

  const command = parsed.value;
  const staleError = validateCommandContext(runtime, command);
  if (staleError !== null) {
    return { ok: false, error: staleError };
  }

  switch (command.kind) {
    case "sim.advance-day":
      return { ok: true, value: evaluateAdvanceDay(runtime.world, command) };
    case "debug.set-district-control":
      return evaluateSetDistrictControl(runtime.world, command);
    case "sim.commit-labor":
      return evaluateCommitLabor(runtime.world, command);
    case "sim.set-polity-suzerain":
      return evaluateSetPolitySuzerain(runtime.world, command);
    case "sim.create-obligation":
      return evaluateCreateObligation(runtime.world, command);
    case "sim.record-obligation-fulfillment":
      return evaluateRecordObligationFulfillment(runtime.world, command);
    case "sim.verify-state-hash":
      return evaluateVerifyStateHash(runtime.world, command);
  }
}

function validateCommandContext(
  runtime: SimulationRuntimeV1,
  command: GameCommandV1
): DomainErrorV1 | null {
  if (runtime.acceptedCommandIds.includes(command.commandId)) {
    return {
      code: "duplicate-command",
      path: "commandId",
      message: "GameCommand commandId has already been accepted by this simulation runtime."
    };
  }

  if (command.expectedDay !== runtime.world.meta.currentDay) {
    return {
      code: "stale-day",
      path: "expectedDay",
      message: "GameCommand expectedDay does not match the committed WorldState day."
    };
  }

  if (command.expectedRevision !== runtime.world.meta.revision) {
    return {
      code: "stale-revision",
      path: "expectedRevision",
      message: "GameCommand expectedRevision does not match the committed WorldState revision."
    };
  }

  return null;
}

function evaluateAdvanceDay(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.advance-day" }>
): CommandEvaluationV1 {
  const nextWorld = advanceWorldByGameDay(world);
  return {
    command,
    nextWorld,
    wouldChangeState: true,
    events: [
      {
        schemaVersion: 1,
        kind: "sim.day-advanced",
        commandId: command.commandId,
        actor: command.actor,
        fromDay: world.meta.currentDay,
        toDay: nextWorld.meta.currentDay,
        revisionBefore: world.meta.revision,
        revisionAfter: nextWorld.meta.revision
      }
    ],
    deltas: [
      {
        schemaVersion: 1,
        kind: "state.day-changed",
        day: nextWorld.meta.currentDay,
        revision: nextWorld.meta.revision,
        stateHash: nextWorld.meta.stateHash
      }
    ]
  };
}

function evaluateSetDistrictControl(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "debug.set-district-control" }>
): EvaluationResult {
  const districtId = parseDistrictId(command.payload.districtId);
  const nextControllerPolityId =
    command.payload.controllerPolityId === null
      ? null
      : parsePolityId(command.payload.controllerPolityId);

  const district = world.state.districts.find((entry) => entry.definitionId === districtId);
  if (district === undefined) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.districtId",
        message: "debug.set-district-control references a missing DistrictId."
      }
    };
  }

  if (
    nextControllerPolityId !== null &&
    !world.state.polities.some((entry) => entry.definitionId === nextControllerPolityId)
  ) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.controllerPolityId",
        message: "debug.set-district-control references a missing PolityId."
      }
    };
  }

  const previousControllerPolityId =
    district.control.kind === "controlled" ? district.control.controllerPolityId : null;
  const nextControl: DistrictControlState =
    nextControllerPolityId === null
      ? { kind: "uncontrolled" }
      : { kind: "controlled", controllerPolityId: nextControllerPolityId };
  const nextWorldControl = copyDistrictControlState(nextControl);
  const nextState = {
    ...world.state,
    districts: world.state.districts.map((entry) =>
      entry.definitionId === districtId
        ? {
            definitionId: entry.definitionId,
            control: nextWorldControl
          }
        : entry
    )
  };
  const nextWorld = commitRuntimeState(world, nextState);
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: previousControllerPolityId !== nextControllerPolityId,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.district-control-changed",
          commandId: command.commandId,
          actor: command.actor,
          districtId,
          previousControllerPolityId,
          nextControllerPolityId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.district-control-updated",
          districtId,
          control: copyDistrictControlState(nextWorldControl),
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateCommitLabor(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.commit-labor" }>
): EvaluationResult {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return {
      ok: false,
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.commit-labor requires an M2 economy population state."
      }
    };
  }

  const populationGroupId = parsePopulationGroupId(command.payload.populationGroupId);
  const group = m2.populationGroups.find((entry) => entry.id === populationGroupId);
  if (group === undefined) {
    return {
      ok: false,
      error: {
        code: "bad-id",
        path: "payload.populationGroupId",
        message: "sim.commit-labor references a missing PopulationGroupId."
      }
    };
  }

  if (command.payload.laborAmount > group.availableLabor) {
    return {
      ok: false,
      error: {
        code: "insufficient-labor",
        path: "payload.laborAmount",
        message: "sim.commit-labor laborAmount exceeds availableLabor."
      }
    };
  }

  const releaseDay = parseGameDay(world.meta.currentDay + command.payload.durationDays);
  const nextGroup = commitLaborToPopulationGroup({
    group,
    purpose: command.payload.purpose,
    laborAmount: command.payload.laborAmount,
    startDay: world.meta.currentDay,
    releaseDay
  });
  const nextMarket = m2.market.districts.map((district) =>
    district.districtId === nextGroup.districtId
      ? {
          ...district,
          cashFlow: {
            cumulativeMobilizationCost:
              district.cashFlow.cumulativeMobilizationCost +
              command.payload.laborAmount * command.payload.durationDays,
            lastDailyCashDelta: 0
          }
        }
      : district
  );
  const nextM2 = canonicalizeM2EconomyPopulationState({
    ...m2,
    populationGroups: m2.populationGroups.map((entry) =>
      entry.id === populationGroupId ? nextGroup : entry
    ),
    market: {
      districts: nextMarket
    }
  });
  const nextWorld = commitRuntimeState(world, {
    ...world.state,
    m2: nextM2
  });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  const committedLabor = nextGroup.committedLabor.reduce(
    (sum, commitment) => sum + commitment.laborAmount,
    0
  );

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.labor-committed",
          commandId: command.commandId,
          actor: command.actor,
          populationGroupId,
          purpose: command.payload.purpose,
          laborAmount: command.payload.laborAmount,
          releaseDay,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m2-population-group-updated",
          populationGroupId,
          availableLabor: nextGroup.availableLabor,
          committedLabor,
          grainStock: nextGroup.grainStock,
          cashStock: nextGroup.cashStock,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function commitLaborToPopulationGroup(input: {
  readonly group: M2PopulationGroupStateV0;
  readonly purpose: M2LaborCommitmentPurposeV0;
  readonly laborAmount: number;
  readonly startDay: number;
  readonly releaseDay: number;
}): M2PopulationGroupStateV0 {
  const committedLabor = [
    ...input.group.committedLabor,
    {
      purpose: input.purpose,
      laborAmount: input.laborAmount,
      startDay: parseGameDay(input.startDay),
      releaseDay: parseGameDay(input.releaseDay)
    }
  ];
  const committedLaborAmount = committedLabor.reduce(
    (sum, commitment) => sum + commitment.laborAmount,
    0
  );

  return {
    ...input.group,
    availableLabor: input.group.workingPeople - committedLaborAmount,
    committedLabor
  };
}

function evaluateSetPolitySuzerain(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.set-polity-suzerain" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.set-polity-suzerain");
  }

  const polityId = parsePolityId(command.payload.polityId);
  const nextSuzerainPolityId =
    command.payload.directSuzerainPolityId === null
      ? null
      : parsePolityId(command.payload.directSuzerainPolityId);
  const existing = m3.polities.find((entry) => entry.polityId === polityId);
  if (existing === undefined) {
    return badIdError("payload.polityId", "sim.set-polity-suzerain references a missing PolityId.");
  }
  if (
    nextSuzerainPolityId !== null &&
    !m3.polities.some((entry) => entry.polityId === nextSuzerainPolityId)
  ) {
    return badIdError(
      "payload.directSuzerainPolityId",
      "sim.set-polity-suzerain references a missing suzerain PolityId."
    );
  }
  if (
    nextSuzerainPolityId !== null &&
    wouldCreateSuzerainCycle(m3.polities, polityId, nextSuzerainPolityId)
  ) {
    return {
      ok: false,
      error: {
        code: "acyclicity-violation",
        path: "payload.directSuzerainPolityId",
        message: "sim.set-polity-suzerain would create a suzerain cycle."
      }
    };
  }

  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    polities: m3.polities.map((entry) =>
      entry.polityId === polityId
        ? { polityId, directSuzerainPolityId: nextSuzerainPolityId }
        : entry
    )
  });
  const nextWorld = commitRuntimeState(world, { ...world.state, m3: nextM3 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: existing.directSuzerainPolityId !== nextSuzerainPolityId,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.polity-suzerain-changed",
          commandId: command.commandId,
          actor: command.actor,
          polityId,
          previousSuzerainPolityId: existing.directSuzerainPolityId,
          nextSuzerainPolityId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m3-polity-updated",
          polityId,
          directSuzerainPolityId: nextSuzerainPolityId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateCreateObligation(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.create-obligation" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.create-obligation");
  }

  const debtorPolityId = parsePolityId(command.payload.debtorPolityId);
  const creditorPolityId = parsePolityId(command.payload.creditorPolityId);
  if (!m3.polities.some((entry) => entry.polityId === debtorPolityId)) {
    return badIdError(
      "payload.debtorPolityId",
      "sim.create-obligation references a missing debtor PolityId."
    );
  }
  if (!m3.polities.some((entry) => entry.polityId === creditorPolityId)) {
    return badIdError(
      "payload.creditorPolityId",
      "sim.create-obligation references a missing creditor PolityId."
    );
  }
  if (debtorPolityId === creditorPolityId) {
    return badIdError(
      "payload.creditorPolityId",
      "sim.create-obligation debtor and creditor must be different polities."
    );
  }

  const obligationId = parseM3ObligationId(nextNumericId(m3.obligations));
  const auditEventId = parseM3ObligationAuditEventId(nextNumericId(m3.obligationAuditEvents));
  const obligation: M3ObligationStateV0 = {
    id: obligationId,
    debtorPolityId,
    creditorPolityId,
    obligationKind: command.payload.obligationKind,
    requirement: copyCommandRequirement(command.payload.requirement),
    due: copyCommandDue(command.payload.due),
    status: "active",
    disputeReasonCode: null,
    breachReasonCode: null,
    createdAuditEventId: auditEventId,
    latestAuditEventId: auditEventId
  };
  const auditEvent = createM3AuditEvent({
    id: auditEventId,
    obligationId,
    eventKind: "created",
    world,
    commandId: command.commandId,
    actor: command.actor,
    fulfillmentId: null,
    fulfilledAmount: null,
    statusAfter: "active",
    reasonCode: null
  });
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    obligations: [...m3.obligations, obligation],
    obligationAuditEvents: [...m3.obligationAuditEvents, auditEvent]
  });
  const nextWorld = commitRuntimeState(world, { ...world.state, m3: nextM3 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.obligation-created",
          commandId: command.commandId,
          actor: command.actor,
          obligationId,
          debtorPolityId,
          creditorPolityId,
          auditEventId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m3-obligation-updated",
          obligationId,
          status: "active",
          latestAuditEventId: auditEventId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateRecordObligationFulfillment(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.record-obligation-fulfillment" }>
): EvaluationResult {
  const m3 = world.state.m3;
  if (m3 === undefined) {
    return m3MissingError("sim.record-obligation-fulfillment");
  }

  const obligationId = parseM3ObligationId(command.payload.obligationId);
  const fulfillmentId = parseM3FulfillmentId(command.payload.fulfillmentId);
  const obligation = m3.obligations.find((entry) => entry.id === obligationId);
  if (obligation === undefined) {
    return badIdError(
      "payload.obligationId",
      "sim.record-obligation-fulfillment references a missing M3ObligationId."
    );
  }
  if (m3.fulfillmentClaims.some((entry) => entry.fulfillmentId === fulfillmentId)) {
    return {
      ok: false,
      error: {
        code: "duplicate-fulfillment",
        path: "payload.fulfillmentId",
        message: "sim.record-obligation-fulfillment fulfillmentId was already counted."
      }
    };
  }

  const auditEventId = parseM3ObligationAuditEventId(nextNumericId(m3.obligationAuditEvents));
  const auditEvent = createM3AuditEvent({
    id: auditEventId,
    obligationId,
    eventKind: "fulfilled",
    world,
    commandId: command.commandId,
    actor: command.actor,
    fulfillmentId,
    fulfilledAmount: command.payload.fulfilledAmount,
    statusAfter: obligation.status,
    reasonCode: null
  });
  const nextM3 = canonicalizeM3PolityVassalageState({
    ...m3,
    obligations: m3.obligations.map((entry) =>
      entry.id === obligationId ? { ...entry, latestAuditEventId: auditEventId } : entry
    ),
    obligationAuditEvents: [...m3.obligationAuditEvents, auditEvent],
    fulfillmentClaims: [
      ...m3.fulfillmentClaims,
      {
        fulfillmentId,
        obligationId,
        auditEventId,
        fulfilledAmount: command.payload.fulfilledAmount
      }
    ]
  });
  const nextWorld = commitRuntimeState(world, { ...world.state, m3: nextM3 });
  const invariantError = validateCommittedWorld(nextWorld);
  if (invariantError !== null) {
    return { ok: false, error: invariantError };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld,
      wouldChangeState: true,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.obligation-fulfilled",
          commandId: command.commandId,
          actor: command.actor,
          obligationId,
          fulfillmentId,
          fulfilledAmount: command.payload.fulfilledAmount,
          auditEventId,
          revisionBefore: world.meta.revision,
          revisionAfter: nextWorld.meta.revision
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.m3-obligation-updated",
          obligationId,
          status: obligation.status,
          latestAuditEventId: auditEventId,
          revision: nextWorld.meta.revision,
          stateHash: nextWorld.meta.stateHash
        }
      ]
    }
  };
}

function evaluateVerifyStateHash(
  world: WorldStateV0,
  command: Extract<GameCommandV1, { readonly kind: "sim.verify-state-hash" }>
): EvaluationResult {
  if (command.expectedHash !== world.meta.stateHash) {
    return {
      ok: false,
      error: {
        code: "hash-mismatch",
        path: "expectedHash",
        message: "sim.verify-state-hash expectedHash does not match committed WorldState hash."
      }
    };
  }

  return {
    ok: true,
    value: {
      command,
      nextWorld: world,
      wouldChangeState: false,
      events: [
        {
          schemaVersion: 1,
          kind: "sim.state-hash-verified",
          commandId: command.commandId,
          actor: command.actor,
          day: world.meta.currentDay,
          revision: world.meta.revision,
          stateHash: world.meta.stateHash
        }
      ],
      deltas: [
        {
          schemaVersion: 1,
          kind: "state.hash-observed",
          day: world.meta.currentDay,
          revision: world.meta.revision,
          stateHash: world.meta.stateHash
        }
      ]
    }
  };
}

function m3MissingError(commandKind: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "m3-state-missing",
      path: "state.m3",
      message: `${commandKind} requires an M3 polity vassalage state.`
    }
  };
}

function badIdError(path: string, message: string): EvaluationResult {
  return {
    ok: false,
    error: {
      code: "bad-id",
      path,
      message
    }
  };
}

function wouldCreateSuzerainCycle(
  polities: readonly M3PolityRecordStateV0[],
  polityId: PolityId,
  nextSuzerainPolityId: PolityId
): boolean {
  const suzerainByPolityId = new Map<number, number>();
  for (const polity of polities) {
    if (polity.polityId === polityId) {
      suzerainByPolityId.set(polityId, nextSuzerainPolityId);
    } else if (polity.directSuzerainPolityId !== null) {
      suzerainByPolityId.set(polity.polityId, polity.directSuzerainPolityId);
    }
  }

  const visited = new Set<number>();
  let current: number | undefined = polityId;
  while (current !== undefined) {
    if (visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = suzerainByPolityId.get(current);
  }

  return false;
}

function nextNumericId(values: readonly { readonly id: number }[]): number {
  let maximumId = 0;
  for (const value of values) {
    if (value.id > maximumId) {
      maximumId = value.id;
    }
  }
  return maximumId + 1;
}

function copyCommandRequirement(
  requirement: Extract<
    GameCommandV1,
    { readonly kind: "sim.create-obligation" }
  >["payload"]["requirement"]
): M3ObligationRequirementV0 {
  switch (requirement.kind) {
    case "amount":
      return {
        kind: "amount",
        resourceKind: requirement.resourceKind,
        amount: requirement.amount
      };
    case "condition":
      return {
        kind: "condition",
        conditionKey: requirement.conditionKey
      };
  }
}

function copyCommandDue(
  due: Extract<GameCommandV1, { readonly kind: "sim.create-obligation" }>["payload"]["due"]
): M3ObligationDueV0 {
  switch (due.kind) {
    case "cadence":
      return {
        kind: "cadence",
        periodDays: due.periodDays,
        nextDueDay: parseGameDay(due.nextDueDay)
      };
    case "trigger":
      return {
        kind: "trigger",
        triggerKey: due.triggerKey
      };
  }
}

function createM3AuditEvent(input: {
  readonly id: number;
  readonly obligationId: number;
  readonly eventKind: M3ObligationAuditEventStateV0["eventKind"];
  readonly world: WorldStateV0;
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly fulfillmentId: number | null;
  readonly fulfilledAmount: number | null;
  readonly statusAfter: M3ObligationStatusV0;
  readonly reasonCode: string | null;
}): M3ObligationAuditEventStateV0 {
  return {
    id: parseM3ObligationAuditEventId(input.id),
    obligationId: parseM3ObligationId(input.obligationId),
    eventKind: input.eventKind,
    eventDay: input.world.meta.currentDay,
    eventRevision: input.world.meta.revision,
    commandId: input.commandId,
    actor: {
      kind: input.actor.kind,
      id: input.actor.id
    },
    fulfillmentId: input.fulfillmentId === null ? null : parseM3FulfillmentId(input.fulfillmentId),
    fulfilledAmount: input.fulfilledAmount,
    statusAfter: input.statusAfter,
    reasonCode: input.reasonCode
  };
}

function executeQuery(runtime: SimulationRuntimeV1, query: GameQueryV1): QueryResultV1 {
  switch (query.kind) {
    case "sim.get-state-hash":
      return {
        status: "ok",
        result: {
          kind: query.kind,
          day: runtime.world.meta.currentDay,
          revision: runtime.world.meta.revision,
          stateHash: runtime.world.meta.stateHash
        }
      };
    case "sim.get-calendar":
      return {
        status: "ok",
        result: {
          kind: query.kind,
          day: runtime.world.meta.currentDay,
          revision: runtime.world.meta.revision
        }
      };
    case "sim.list-district-summaries":
      return {
        status: "ok",
        result: {
          kind: query.kind,
          day: runtime.world.meta.currentDay,
          revision: runtime.world.meta.revision,
          districts: runtime.world.definitions.districts.map((definition) => {
            const state = runtime.world.state.districts.find(
              (entry) => entry.definitionId === definition.id
            );
            return {
              districtId: definition.id,
              displayNameKey: definition.displayNameKey,
              control:
                state === undefined
                  ? copyDistrictControlState({ kind: "uncontrolled" })
                  : copyDistrictControlState(state.control)
            };
          })
        }
      };
    case "sim.list-m2-economy-summaries":
      return executeM2EconomySummariesQuery(runtime);
    case "sim.preview-m2-transport-route":
      return executeM2TransportRoutePreviewQuery(runtime, query);
  }
}

function executeM2EconomySummariesQuery(runtime: SimulationRuntimeV1): QueryResultV1 {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.list-m2-economy-summaries requires an M2 economy population state."
      }
    };
  }

  return {
    status: "ok",
    result: {
      kind: "sim.list-m2-economy-summaries",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      districts: runtime.world.definitions.districts.map((definition) => {
        const group = m2.populationGroups.find((entry) => entry.districtId === definition.id);
        const agriculture = m2.agriculture.districts.find(
          (entry) => entry.districtId === definition.id
        );
        const market = m2.market.districts.find((entry) => entry.districtId === definition.id);
        const committedLabor =
          group?.committedLabor.reduce((sum, commitment) => sum + commitment.laborAmount, 0) ?? 0;
        return {
          districtId: definition.id,
          population: group?.totalPeople ?? 0,
          availableLabor: group?.availableLabor ?? 0,
          committedLabor,
          grainStock: group?.grainStock ?? 0,
          cashStock: group?.cashStock ?? 0,
          agriculturePhase: agriculture?.phase ?? "fallow",
          lastHarvestGrain: agriculture?.lastHarvestGrain ?? 0,
          cumulativeMobilizationCost: market?.cashFlow.cumulativeMobilizationCost ?? 0
        };
      })
    }
  };
}

function executeM2TransportRoutePreviewQuery(
  runtime: SimulationRuntimeV1,
  query: Extract<GameQueryV1, { readonly kind: "sim.preview-m2-transport-route" }>
): QueryResultV1 {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    return {
      status: "rejected",
      error: {
        code: "m2-state-missing",
        path: "state.m2",
        message: "sim.preview-m2-transport-route requires an M2 transport state."
      }
    };
  }

  const originDistrictId = parseDistrictId(query.payload.originDistrictId);
  const destinationDistrictId = parseDistrictId(query.payload.destinationDistrictId);
  if (!runtime.world.definitions.districts.some((district) => district.id === originDistrictId)) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.originDistrictId",
        message: "sim.preview-m2-transport-route references a missing origin DistrictId."
      }
    };
  }
  if (
    !runtime.world.definitions.districts.some((district) => district.id === destinationDistrictId)
  ) {
    return {
      status: "rejected",
      error: {
        code: "bad-id",
        path: "payload.destinationDistrictId",
        message: "sim.preview-m2-transport-route references a missing destination DistrictId."
      }
    };
  }

  const preview = previewM2TransportRouteV0(runtime.world, {
    originDistrictId,
    destinationDistrictId,
    stockAmount: query.payload.stockAmount,
    day: runtime.world.meta.currentDay
  });

  return {
    status: "ok",
    result: {
      kind: "sim.preview-m2-transport-route",
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      monthOfYear: getGameCalendarDate(runtime.world.meta.currentDay).monthOfYear,
      route:
        preview.status === "unreachable"
          ? {
              status: preview.status,
              originDistrictId: preview.originDistrictId,
              destinationDistrictId: preview.destinationDistrictId,
              stockAmount: preview.stockAmount,
              edges: []
            }
          : {
              status: preview.status,
              originDistrictId: preview.originDistrictId,
              destinationDistrictId: preview.destinationDistrictId,
              stockAmount: preview.stockAmount,
              totalCost: preview.totalCost,
              bottleneckCapacity: preview.bottleneckCapacity,
              edges: preview.edges.map((edge) => ({ ...edge }))
            }
    }
  };
}

function commitRuntimeState(world: WorldStateV0, state: WorldStateV0["state"]): WorldStateV0 {
  const nextWorldWithoutHash: WorldStateV0 = {
    ...world,
    state,
    meta: {
      ...world.meta,
      revision: parseWorldRevision(world.meta.revision + 1),
      stateHash: ""
    }
  };

  return {
    ...nextWorldWithoutHash,
    meta: {
      ...nextWorldWithoutHash.meta,
      stateHash: hashWorldStateV0(nextWorldWithoutHash)
    }
  };
}

function validateCommittedWorld(world: WorldStateV0): DomainErrorV1 | null {
  const errors = validateWorldStateV0(world);
  if (errors.length === 0) {
    return null;
  }

  const first = errors[0];
  if (first === undefined) {
    return null;
  }

  return {
    code: "invariant-violation",
    path: first.path,
    message: first.message
  };
}

function copyDistrictControlState(control: DistrictControlState): DistrictControlState {
  switch (control.kind) {
    case "controlled":
      return {
        kind: "controlled",
        controllerPolityId: control.controllerPolityId
      };
    case "uncontrolled":
      return {
        kind: "uncontrolled"
      };
  }
}

function appendAcceptedCommandId(
  commandIds: readonly string[],
  commandId: string
): readonly string[] {
  return [...commandIds, commandId].sort(compareText);
}

function appendTail<TValue>(
  values: readonly TValue[],
  ...nextValues: readonly TValue[]
): readonly TValue[] {
  return [...values, ...nextValues].slice(-32);
}

function scenarioIdForRuntime(runtime: SimulationRuntimeV1): string {
  if (runtime.world.meta.contentManifestHash === M1_ABSTRACT_GRAPH_30_CONTENT_MANIFEST_HASH) {
    return M1_ABSTRACT_GRAPH_30_SCENARIO_ID;
  }

  return "minimal-m1";
}

function domainEventToRecord(event: DomainEventV1): Record<string, unknown> {
  switch (event.kind) {
    case "sim.day-advanced":
      return { ...event };
    case "sim.district-control-changed":
      return { ...event };
    case "sim.labor-committed":
      return { ...event };
    case "sim.polity-suzerain-changed":
      return { ...event };
    case "sim.obligation-created":
      return { ...event };
    case "sim.obligation-fulfilled":
      return { ...event };
    case "sim.state-hash-verified":
      return { ...event };
  }
}

type SavedEventTailParseResult =
  | { readonly ok: true; readonly value: readonly DomainEventV1[] }
  | { readonly ok: false; readonly reasons: readonly SaveLoadRejectionReasonV1[] };

type SavedDomainEventParseResult =
  | { readonly ok: true; readonly value: DomainEventV1 }
  | { readonly ok: false };

function parseSavedEventTail(
  entries: readonly { readonly event: Record<string, unknown> }[]
): SavedEventTailParseResult {
  const reasons: SaveLoadRejectionReasonV1[] = [];
  const events: DomainEventV1[] = [];

  entries.forEach((entry, index) => {
    const parsed = parseSavedDomainEvent(entry.event, `body.eventTail[${index}].event`, reasons);
    if (parsed.ok) {
      events.push(parsed.value);
    }
  });

  if (reasons.length > 0) {
    return {
      ok: false,
      reasons
    };
  }

  return {
    ok: true,
    value: events
  };
}

function parseSavedDomainEvent(
  record: Record<string, unknown>,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): SavedDomainEventParseResult {
  if (record["schemaVersion"] !== 1) {
    reasons.push({
      code: "invalid-schema",
      path: `${path}.schemaVersion`,
      message: "Saved DomainEvent schemaVersion must be 1."
    });
    return { ok: false };
  }

  const kind = record["kind"];
  switch (kind) {
    case "sim.day-advanced": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const fromDay = readNumberRecordField(record, "fromDay", `${path}.fromDay`, reasons);
      const toDay = readNumberRecordField(record, "toDay", `${path}.toDay`, reasons);
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        fromDay === undefined ||
        toDay === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          fromDay,
          toDay,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.district-control-changed": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const districtId = readPositiveIdRecordField(
        record,
        "districtId",
        `${path}.districtId`,
        reasons
      );
      const previousControllerPolityId = readNullablePolityId(
        record,
        "previousControllerPolityId",
        `${path}.previousControllerPolityId`,
        reasons
      );
      const nextControllerPolityId = readNullablePolityId(
        record,
        "nextControllerPolityId",
        `${path}.nextControllerPolityId`,
        reasons
      );
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        districtId === undefined ||
        previousControllerPolityId === undefined ||
        nextControllerPolityId === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          districtId: parseDistrictId(districtId),
          previousControllerPolityId,
          nextControllerPolityId,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.labor-committed": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const populationGroupId = readPositiveIdRecordField(
        record,
        "populationGroupId",
        `${path}.populationGroupId`,
        reasons
      );
      const purpose = readLaborPurposeRecordField(record, "purpose", `${path}.purpose`, reasons);
      const laborAmount = readNumberRecordField(
        record,
        "laborAmount",
        `${path}.laborAmount`,
        reasons
      );
      const releaseDay = readNumberRecordField(record, "releaseDay", `${path}.releaseDay`, reasons);
      const revisionBefore = readNumberRecordField(
        record,
        "revisionBefore",
        `${path}.revisionBefore`,
        reasons
      );
      const revisionAfter = readNumberRecordField(
        record,
        "revisionAfter",
        `${path}.revisionAfter`,
        reasons
      );
      if (
        commandId === undefined ||
        actor === undefined ||
        populationGroupId === undefined ||
        purpose === undefined ||
        laborAmount === undefined ||
        releaseDay === undefined ||
        revisionBefore === undefined ||
        revisionAfter === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          populationGroupId: parsePopulationGroupId(populationGroupId),
          purpose,
          laborAmount,
          releaseDay,
          revisionBefore,
          revisionAfter
        }
      };
    }
    case "sim.state-hash-verified": {
      const commandId = readStringRecordField(record, "commandId", `${path}.commandId`, reasons);
      const actor = readActorRecordField(record, "actor", `${path}.actor`, reasons);
      const day = readNumberRecordField(record, "day", `${path}.day`, reasons);
      const revision = readNumberRecordField(record, "revision", `${path}.revision`, reasons);
      const stateHash = readStringRecordField(record, "stateHash", `${path}.stateHash`, reasons);
      if (
        commandId === undefined ||
        actor === undefined ||
        day === undefined ||
        revision === undefined ||
        stateHash === undefined
      ) {
        return { ok: false };
      }

      return {
        ok: true,
        value: {
          schemaVersion: 1,
          kind,
          commandId,
          actor,
          day,
          revision,
          stateHash
        }
      };
    }
    default:
      reasons.push({
        code: "invalid-schema",
        path: `${path}.kind`,
        message: "Saved DomainEvent kind is not supported."
      });
      return { ok: false };
  }
}

function readStringRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): string | undefined {
  const value = record[key];
  if (typeof value !== "string") {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a string.`
    });
    return undefined;
  }
  return value;
}

function readNumberRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a safe integer.`
    });
    return undefined;
  }
  return value;
}

function readLaborPurposeRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): M2LaborCommitmentPurposeV0 | undefined {
  const value = record[key];
  if (value !== "mobilized") {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be mobilized.`
    });
    return undefined;
  }

  return value;
}

function readPositiveIdRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a positive safe integer.`
    });
    return undefined;
  }

  return value;
}

function readActorRecordField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): CommandActorV1 | undefined {
  const value = record[key];
  if (!isRecord(value)) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be an actor object.`
    });
    return undefined;
  }
  const kind = value["kind"];
  if (kind !== "ai" && kind !== "player" && kind !== "system") {
    reasons.push({
      code: "invalid-schema",
      path: `${path}.kind`,
      message: `Saved event ${key}.kind is invalid.`
    });
    return undefined;
  }
  const id = readStringRecordField(value, "id", `${path}.id`, reasons);
  if (id === undefined) {
    return undefined;
  }
  return {
    kind,
    id
  };
}

function readNullablePolityId(
  record: Record<string, unknown>,
  key: string,
  path: string,
  reasons: SaveLoadRejectionReasonV1[]
): PolityId | null | undefined {
  const value = record[key];
  if (value === null) {
    return null;
  }
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    reasons.push({
      code: "invalid-schema",
      path,
      message: `Saved event ${key} must be a positive safe integer or null.`
    });
    return undefined;
  }

  return parsePolityId(value);
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

function readCommandId(input: unknown): string | null {
  if (!isRecord(input)) {
    return null;
  }

  const commandId = input["commandId"];
  return typeof commandId === "string" ? commandId : null;
}

function fromProtocolError(error: SerializableProtocolErrorV1): DomainErrorV1 {
  return {
    code: mapProtocolCode(error.code),
    path: error.path,
    message: error.message
  };
}

function mapProtocolCode(code: ProtocolErrorCodeV1): DomainErrorCodeV1 {
  switch (code) {
    case "invalid-payload":
      return "invalid-payload";
    case "unknown-command-kind":
      return "unknown-command-kind";
    case "unknown-query-kind":
      return "unknown-query-kind";
    case "unsupported-command-version":
      return "unsupported-command-version";
    case "unsupported-query-version":
      return "unsupported-query-version";
    case "unknown-message-type":
    case "unsupported-message-version":
      return "invalid-payload";
  }
}

function hasM2RuntimeState(candidate: unknown): boolean {
  if (!isRecord(candidate)) {
    return false;
  }

  const state = candidate["state"];
  return isRecord(state) && state["m2"] !== undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

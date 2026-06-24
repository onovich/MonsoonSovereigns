import {
  SIMULATION_MESSAGE_PROTOCOL_VERSION,
  parseBootSimulationInputV1,
  parseGameCommandV1,
  parseGameQueryV1,
  type BootSimulationInputV1,
  type CommandActorV1,
  type GameCommandV1,
  type GameQueryV1,
  type ProtocolErrorCodeV1,
  type SerializableProtocolErrorV1
} from "@monsoon/protocol";

import { advanceWorldByGameDay } from "./scheduler-v0.ts";
import { createMinimalM1WorldStateV0 } from "./minimal-m1-fixture.ts";
import {
  hashWorldStateV0,
  parseDistrictId,
  parsePolityId,
  parseWorldRevision,
  validateWorldStateV0,
  type DistrictControlState,
  type DistrictId,
  type PolityId,
  type WorldRevision,
  type WorldStateV0
} from "./world-state-v0.ts";

export type DomainErrorCodeV1 =
  | "bad-id"
  | "duplicate-command"
  | "hash-mismatch"
  | "invalid-payload"
  | "invariant-violation"
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
    )
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

function bootParsedSimulationV1(input: BootSimulationInputV1): BootSimulationResultV1 {
  if (
    input.protocolVersion !== SIMULATION_MESSAGE_PROTOCOL_VERSION ||
    input.fixture !== "minimal-m1"
  ) {
    return {
      status: "rejected",
      error: {
        code: "invalid-payload",
        path: "fixture",
        message: "Only the minimal-m1 simulation fixture can boot in M1."
      }
    };
  }

  const world = createMinimalM1WorldStateV0();
  return {
    status: "booted",
    runtime: {
      world,
      acceptedCommandIds: []
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
  }
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

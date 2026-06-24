export const HELLO_SIMULATION_PROTOCOL_VERSION = 1;

export type HelloCommandKind = "hello.adjust-signal";

export type HelloCommandTone = "calm" | "watchful" | "bright";

export interface HelloSimulationCommandDto {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly kind: HelloCommandKind;
  readonly day: number;
  readonly actorId: "hello-observer";
  readonly signalDelta: number;
  readonly tone: HelloCommandTone;
}

export interface HelloSimulationRequestDto {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly seed: "monsoon-sovereigns-foundation-003";
  readonly commands: readonly HelloSimulationCommandDto[];
}

export interface HelloSimulationResultDto {
  readonly protocolVersion: typeof HELLO_SIMULATION_PROTOCOL_VERSION;
  readonly daysSimulated: number;
  readonly finalRevision: number;
  readonly stateHash: string;
}

export const DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION = 1;
export const DETERMINISTIC_RNG_STATE_SCHEMA_VERSION = 1;
export const DETERMINISTIC_RNG_ALGORITHM = "sfc32-fnv1a32-domain-v1";

export interface DeterministicRngDomainKeyDtoV1 {
  readonly schemaVersion: typeof DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION;
  readonly system: string;
  readonly day: number;
  readonly entity: string;
  readonly purpose: string;
  readonly substream: string;
}

export interface DeterministicRngStateDtoV1 {
  readonly schemaVersion: typeof DETERMINISTIC_RNG_STATE_SCHEMA_VERSION;
  readonly algorithm: typeof DETERMINISTIC_RNG_ALGORITHM;
  readonly seed: string;
  readonly domain: DeterministicRngDomainKeyDtoV1;
  readonly drawIndex: number;
  readonly state: readonly [number, number, number, number];
}

export const GAME_COMMAND_SCHEMA_VERSION = 1;
export const GAME_QUERY_SCHEMA_VERSION = 1;
export const SIMULATION_MESSAGE_PROTOCOL_VERSION = 1;

export type CommandActorKindV1 = "ai" | "player" | "system";

export interface CommandActorV1 {
  readonly kind: CommandActorKindV1;
  readonly id: string;
}

export interface AdvanceDayCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.advance-day";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
}

export interface DebugSetDistrictControlCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "debug.set-district-control";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly districtId: number;
    readonly controllerPolityId: number | null;
  };
}

export interface VerifyStateHashCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.verify-state-hash";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly expectedHash: string;
}

export interface CommitLaborCommandV1 {
  readonly schemaVersion: typeof GAME_COMMAND_SCHEMA_VERSION;
  readonly kind: "sim.commit-labor";
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
  readonly payload: {
    readonly populationGroupId: number;
    readonly purpose: "mobilized";
    readonly laborAmount: number;
    readonly durationDays: number;
  };
}

export type GameCommandV1 =
  | AdvanceDayCommandV1
  | DebugSetDistrictControlCommandV1
  | CommitLaborCommandV1
  | VerifyStateHashCommandV1;

export interface GetStateHashQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.get-state-hash";
}

export interface GetCalendarQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.get-calendar";
}

export interface ListDistrictSummariesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-district-summaries";
}

export interface ListM2EconomySummariesQueryV1 {
  readonly schemaVersion: typeof GAME_QUERY_SCHEMA_VERSION;
  readonly kind: "sim.list-m2-economy-summaries";
}

export type GameQueryV1 =
  | GetStateHashQueryV1
  | GetCalendarQueryV1
  | ListDistrictSummariesQueryV1
  | ListM2EconomySummariesQueryV1;

export type SimulationFixtureIdV1 = "m1.abstract-graph-30" | "minimal-m1";

export interface FixtureBootSimulationInputV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly fixture: SimulationFixtureIdV1;
}

export interface RuntimeContentPackBootSimulationInputV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly source: "runtime-content-pack";
  readonly seed: number;
  readonly runtimeContentPack: Record<string, unknown>;
}

export type BootSimulationInputV1 =
  | FixtureBootSimulationInputV1
  | RuntimeContentPackBootSimulationInputV1;

export interface CommandQueryCanaryScriptV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly boot: BootSimulationInputV1;
  readonly commands: readonly GameCommandV1[];
}

export interface SaveLoadCanaryScriptV1 {
  readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
  readonly boot: BootSimulationInputV1;
  readonly commands: readonly GameCommandV1[];
  readonly expectedContentManifestHash: string;
  readonly expectedScenarioId: SimulationFixtureIdV1;
}

export type ProtocolErrorCodeV1 =
  | "invalid-payload"
  | "unknown-command-kind"
  | "unknown-message-type"
  | "unknown-query-kind"
  | "unsupported-command-version"
  | "unsupported-message-version"
  | "unsupported-query-version";

export interface SerializableProtocolErrorV1 {
  readonly code: ProtocolErrorCodeV1;
  readonly path: string;
  readonly message: string;
}

export type ProtocolParseResult<TValue> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: SerializableProtocolErrorV1 };

export type SimulationMessageV1 =
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.boot";
      readonly payload: BootSimulationInputV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.preview-command";
      readonly payload: GameCommandV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.submit-command";
      readonly payload: GameCommandV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.query";
      readonly payload: GameQueryV1;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.request-save";
      readonly payload: Record<string, never>;
    }
  | {
      readonly protocolVersion: typeof SIMULATION_MESSAGE_PROTOCOL_VERSION;
      readonly requestId: string;
      readonly type: "simulation.load-save";
      readonly payload: {
        readonly bytes: Uint8Array;
      };
    };

const COMMAND_ID_PATTERN = /^[A-Za-z0-9._:-]{1,96}$/u;
const ACTOR_ID_PATTERN = /^[A-Za-z0-9._:-]{1,96}$/u;
const HASH_PATTERN = /^[0-9a-f]{8}$/u;
const COMMAND_ACTOR_KINDS: readonly CommandActorKindV1[] = ["ai", "player", "system"];

const HELLO_TONES: readonly HelloCommandTone[] = ["calm", "watchful", "bright"];

export function createHelloThirtyDayRequest(): HelloSimulationRequestDto {
  const commands: HelloSimulationCommandDto[] = [];

  for (let day = 1; day <= 30; day += 1) {
    const toneIndex = (day + 1) % HELLO_TONES.length;
    const tone = HELLO_TONES[toneIndex];
    if (tone === undefined) {
      throw new Error(`Missing deterministic hello tone for day ${day}.`);
    }

    commands.push({
      protocolVersion: HELLO_SIMULATION_PROTOCOL_VERSION,
      kind: "hello.adjust-signal",
      day,
      actorId: "hello-observer",
      signalDelta: ((day * 17) % 9) - 4,
      tone
    });
  }

  return {
    protocolVersion: HELLO_SIMULATION_PROTOCOL_VERSION,
    seed: "monsoon-sovereigns-foundation-003",
    commands
  };
}

export function createCommandQueryCanaryScript(): CommandQueryCanaryScriptV1 {
  return {
    protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
    boot: {
      protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
      fixture: "minimal-m1"
    },
    commands: [
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "debug.set-district-control",
        commandId: "canary.control.1",
        actor: { kind: "player", id: "player:canary" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          districtId: 1,
          controllerPolityId: 1
        }
      },
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.advance-day",
        commandId: "canary.advance.1",
        actor: { kind: "ai", id: "ai:canary" },
        expectedDay: 0,
        expectedRevision: 1
      },
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.advance-day",
        commandId: "canary.advance.2",
        actor: { kind: "system", id: "scheduler" },
        expectedDay: 1,
        expectedRevision: 2
      }
    ]
  };
}

export function createSaveLoadCanaryScriptV1(): SaveLoadCanaryScriptV1 {
  return {
    protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
    boot: {
      protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
      fixture: "m1.abstract-graph-30"
    },
    expectedContentManifestHash: "4a438525",
    expectedScenarioId: "m1.abstract-graph-30",
    commands: [
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "debug.set-district-control",
        commandId: "save.canary.control.1",
        actor: { kind: "player", id: "player:save-canary" },
        expectedDay: 0,
        expectedRevision: 0,
        payload: {
          districtId: 1,
          controllerPolityId: 1
        }
      },
      {
        schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
        kind: "sim.advance-day",
        commandId: "save.canary.advance.1",
        actor: { kind: "ai", id: "ai:save-canary" },
        expectedDay: 0,
        expectedRevision: 1
      }
    ]
  };
}

export function parseGameCommandV1(input: unknown): ProtocolParseResult<GameCommandV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "GameCommand v1 must be an object.");
  }

  if (input["schemaVersion"] !== GAME_COMMAND_SCHEMA_VERSION) {
    return protocolError(
      "unsupported-command-version",
      "schemaVersion",
      "GameCommand schemaVersion must be 1."
    );
  }

  const kind = input["kind"];
  if (typeof kind !== "string") {
    return protocolError("invalid-payload", "kind", "GameCommand kind must be a string.");
  }

  const base = parseCommandBase(input);
  if (!base.ok) {
    return base;
  }

  switch (kind) {
    case "sim.advance-day":
      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value
        }
      };
    case "debug.set-district-control": {
      const payload = parseSetDistrictControlPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.commit-labor": {
      const payload = parseCommitLaborPayload(input["payload"]);
      if (!payload.ok) {
        return payload;
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          payload: payload.value
        }
      };
    }
    case "sim.verify-state-hash": {
      const expectedHash = input["expectedHash"];
      if (typeof expectedHash !== "string" || !HASH_PATTERN.test(expectedHash)) {
        return protocolError(
          "invalid-payload",
          "expectedHash",
          "expectedHash must be an 8-character lowercase hexadecimal hash."
        );
      }

      return {
        ok: true,
        value: {
          schemaVersion: GAME_COMMAND_SCHEMA_VERSION,
          kind,
          ...base.value,
          expectedHash
        }
      };
    }
    default:
      return protocolError("unknown-command-kind", "kind", "GameCommand kind is not supported.");
  }
}

export function parseGameQueryV1(input: unknown): ProtocolParseResult<GameQueryV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "GameQuery v1 must be an object.");
  }

  if (input["schemaVersion"] !== GAME_QUERY_SCHEMA_VERSION) {
    return protocolError(
      "unsupported-query-version",
      "schemaVersion",
      "GameQuery schemaVersion must be 1."
    );
  }

  const kind = input["kind"];
  switch (kind) {
    case "sim.get-state-hash":
    case "sim.get-calendar":
    case "sim.list-district-summaries":
    case "sim.list-m2-economy-summaries":
      return {
        ok: true,
        value: {
          schemaVersion: GAME_QUERY_SCHEMA_VERSION,
          kind
        }
      };
    default:
      if (typeof kind !== "string") {
        return protocolError("invalid-payload", "kind", "GameQuery kind must be a string.");
      }

      return protocolError("unknown-query-kind", "kind", "GameQuery kind is not supported.");
  }
}

export function parseSimulationMessageV1(input: unknown): ProtocolParseResult<SimulationMessageV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "Simulation message must be an object.");
  }

  if (input["protocolVersion"] !== SIMULATION_MESSAGE_PROTOCOL_VERSION) {
    return protocolError(
      "unsupported-message-version",
      "protocolVersion",
      "Simulation message protocolVersion must be 1."
    );
  }

  const requestId = input["requestId"];
  if (typeof requestId !== "string" || !COMMAND_ID_PATTERN.test(requestId)) {
    return protocolError(
      "invalid-payload",
      "requestId",
      "Simulation message requestId must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  const type = input["type"];
  switch (type) {
    case "simulation.boot": {
      const boot = parseBootSimulationInputV1(input["payload"]);
      if (!boot.ok) {
        return boot;
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: boot.value
        }
      };
    }
    case "simulation.preview-command":
    case "simulation.submit-command": {
      const command = parseGameCommandV1(input["payload"]);
      if (!command.ok) {
        return command;
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: command.value
        }
      };
    }
    case "simulation.query": {
      const query = parseGameQueryV1(input["payload"]);
      if (!query.ok) {
        return query;
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: query.value
        }
      };
    }
    case "simulation.request-save":
      if (!isRecord(input["payload"])) {
        return protocolError(
          "invalid-payload",
          "payload",
          "request-save payload must be an object."
        );
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: {}
        }
      };
    case "simulation.load-save": {
      const payload = input["payload"];
      if (!isRecord(payload) || !(payload["bytes"] instanceof Uint8Array)) {
        return protocolError(
          "invalid-payload",
          "payload.bytes",
          "load-save payload bytes must be a Uint8Array."
        );
      }

      return {
        ok: true,
        value: {
          protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
          requestId,
          type,
          payload: {
            bytes: payload["bytes"]
          }
        }
      };
    }
    default:
      if (typeof type !== "string") {
        return protocolError(
          "invalid-payload",
          "type",
          "Simulation message type must be a string."
        );
      }

      return protocolError(
        "unknown-message-type",
        "type",
        "Simulation message type is not supported."
      );
  }
}

export function parseBootSimulationInputV1(
  input: unknown
): ProtocolParseResult<BootSimulationInputV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "$", "BootSimulationInput v1 must be an object.");
  }

  if (input["protocolVersion"] !== SIMULATION_MESSAGE_PROTOCOL_VERSION) {
    return protocolError(
      "unsupported-message-version",
      "protocolVersion",
      "BootSimulationInput protocolVersion must be 1."
    );
  }

  const hasFixtureMode = input["fixture"] !== undefined;
  const hasRuntimeContentPackMode =
    input["source"] !== undefined ||
    input["seed"] !== undefined ||
    input["runtimeContentPack"] !== undefined;

  if (hasFixtureMode && hasRuntimeContentPackMode) {
    return protocolError(
      "invalid-payload",
      "$",
      "BootSimulationInput must specify either fixture or runtime-content-pack source, not both."
    );
  }

  if (input["fixture"] === "minimal-m1" || input["fixture"] === "m1.abstract-graph-30") {
    return {
      ok: true,
      value: {
        protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
        fixture: input["fixture"]
      }
    };
  }

  if (input["source"] === "runtime-content-pack") {
    const seed = parseNonnegativeSafeInteger(input["seed"], "seed");
    if (!seed.ok) {
      return seed;
    }

    const runtimeContentPack = input["runtimeContentPack"];
    if (!isRecord(runtimeContentPack)) {
      return protocolError(
        "invalid-payload",
        "runtimeContentPack",
        "BootSimulationInput runtimeContentPack must be an object."
      );
    }

    return {
      ok: true,
      value: {
        protocolVersion: SIMULATION_MESSAGE_PROTOCOL_VERSION,
        source: "runtime-content-pack",
        seed: seed.value,
        runtimeContentPack
      }
    };
  }

  if (input["source"] !== undefined) {
    return protocolError(
      "invalid-payload",
      "source",
      "BootSimulationInput source must be runtime-content-pack."
    );
  }

  return protocolError(
    "invalid-payload",
    "fixture",
    "BootSimulationInput fixture must be minimal-m1 or m1.abstract-graph-30."
  );
}

interface ParsedCommandBase {
  readonly commandId: string;
  readonly actor: CommandActorV1;
  readonly expectedDay: number;
  readonly expectedRevision: number;
}

function parseCommandBase(input: Record<string, unknown>): ProtocolParseResult<ParsedCommandBase> {
  const commandId = input["commandId"];
  if (typeof commandId !== "string" || !COMMAND_ID_PATTERN.test(commandId)) {
    return protocolError(
      "invalid-payload",
      "commandId",
      "commandId must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  const actor = parseCommandActor(input["actor"]);
  if (!actor.ok) {
    return actor;
  }

  const expectedDay = parseNonnegativeSafeInteger(input["expectedDay"], "expectedDay");
  if (!expectedDay.ok) {
    return expectedDay;
  }

  const expectedRevision = parseNonnegativeSafeInteger(
    input["expectedRevision"],
    "expectedRevision"
  );
  if (!expectedRevision.ok) {
    return expectedRevision;
  }

  return {
    ok: true,
    value: {
      commandId,
      actor: actor.value,
      expectedDay: expectedDay.value,
      expectedRevision: expectedRevision.value
    }
  };
}

function parseCommandActor(input: unknown): ProtocolParseResult<CommandActorV1> {
  if (!isRecord(input)) {
    return protocolError("invalid-payload", "actor", "Command actor must be an object.");
  }

  const kind = input["kind"];
  if (!COMMAND_ACTOR_KINDS.includes(kind as CommandActorKindV1)) {
    return protocolError("invalid-payload", "actor.kind", "Command actor kind is invalid.");
  }

  const id = input["id"];
  if (typeof id !== "string" || !ACTOR_ID_PATTERN.test(id)) {
    return protocolError(
      "invalid-payload",
      "actor.id",
      "Command actor id must match [A-Za-z0-9._:-]{1,96}."
    );
  }

  return {
    ok: true,
    value: {
      kind: kind as CommandActorKindV1,
      id
    }
  };
}

function parseSetDistrictControlPayload(
  input: unknown
): ProtocolParseResult<DebugSetDistrictControlCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "debug.set-district-control payload must be an object."
    );
  }

  const districtId = parsePositiveSafeInteger(input["districtId"], "payload.districtId");
  if (!districtId.ok) {
    return districtId;
  }

  const controllerPolityId = input["controllerPolityId"];
  if (controllerPolityId !== null && !isPositiveSafeInteger(controllerPolityId)) {
    return protocolError(
      "invalid-payload",
      "payload.controllerPolityId",
      "controllerPolityId must be a positive safe integer or null."
    );
  }

  return {
    ok: true,
    value: {
      districtId: districtId.value,
      controllerPolityId
    }
  };
}

function parseCommitLaborPayload(
  input: unknown
): ProtocolParseResult<CommitLaborCommandV1["payload"]> {
  if (!isRecord(input)) {
    return protocolError(
      "invalid-payload",
      "payload",
      "sim.commit-labor payload must be an object."
    );
  }

  const populationGroupId = parsePositiveSafeInteger(
    input["populationGroupId"],
    "payload.populationGroupId"
  );
  if (!populationGroupId.ok) {
    return populationGroupId;
  }

  if (input["purpose"] !== "mobilized") {
    return protocolError("invalid-payload", "payload.purpose", "purpose must be mobilized.");
  }

  const laborAmount = parsePositiveSafeInteger(input["laborAmount"], "payload.laborAmount");
  if (!laborAmount.ok) {
    return laborAmount;
  }

  const durationDays = parsePositiveSafeInteger(input["durationDays"], "payload.durationDays");
  if (!durationDays.ok) {
    return durationDays;
  }

  return {
    ok: true,
    value: {
      populationGroupId: populationGroupId.value,
      purpose: "mobilized",
      laborAmount: laborAmount.value,
      durationDays: durationDays.value
    }
  };
}

function parsePositiveSafeInteger(value: unknown, path: string): ProtocolParseResult<number> {
  if (isPositiveSafeInteger(value)) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be a positive safe integer.`);
}

function parseNonnegativeSafeInteger(value: unknown, path: string): ProtocolParseResult<number> {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) {
    return { ok: true, value };
  }

  return protocolError("invalid-payload", path, `${path} must be a nonnegative safe integer.`);
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function protocolError<TValue>(
  code: ProtocolErrorCodeV1,
  path: string,
  message: string
): ProtocolParseResult<TValue> {
  return {
    ok: false,
    error: {
      code,
      path,
      message
    }
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

import {
  HELLO_SIMULATION_PROTOCOL_VERSION,
  type HelloCommandTone,
  type HelloSimulationCommandDto,
  type HelloSimulationRequestDto,
  type HelloSimulationResultDto
} from "@monsoon/protocol";

export * from "./world-state-v0.ts";
export * from "./scheduler-v0.ts";
export * from "./minimal-m1-fixture.ts";
export * from "./deterministic-rng.ts";
export * from "./boot-content-runtime-v1.ts";
export * from "./m2-route-transport-v0.ts";
export * from "./map-topology-v1.ts";
export * from "./strategic-terrain-v1.ts";
export * from "./m4-determinism-replay-v1.ts";
export * from "./command-query-v1.ts";
export * from "./campaign-ai-v1.ts";

interface HelloSimulationState {
  readonly day: number;
  readonly revision: number;
  readonly signal: number;
  readonly calmCount: number;
  readonly watchfulCount: number;
  readonly brightCount: number;
  readonly commandFingerprint: number;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function runHelloSimulation(request: HelloSimulationRequestDto): HelloSimulationResultDto {
  validateHelloRequest(request);

  let state = createInitialHelloState();
  for (const command of request.commands) {
    state = applyHelloCommand(state, command);
  }

  return {
    protocolVersion: HELLO_SIMULATION_PROTOCOL_VERSION,
    daysSimulated: state.day,
    finalRevision: state.revision,
    stateHash: hashHelloState(state)
  };
}

function createInitialHelloState(): HelloSimulationState {
  return {
    day: 0,
    revision: 0,
    signal: 1_531,
    calmCount: 0,
    watchfulCount: 0,
    brightCount: 0,
    commandFingerprint: INITIAL_HASH_OFFSET
  };
}

function validateHelloRequest(request: HelloSimulationRequestDto): void {
  if (request.protocolVersion !== HELLO_SIMULATION_PROTOCOL_VERSION) {
    throw new Error(`Unsupported hello simulation protocol version ${request.protocolVersion}.`);
  }

  if (request.seed !== "monsoon-sovereigns-foundation-003") {
    throw new Error(`Unsupported deterministic hello simulation seed ${request.seed}.`);
  }
}

function applyHelloCommand(
  state: HelloSimulationState,
  command: HelloSimulationCommandDto
): HelloSimulationState {
  validateHelloCommand(state, command);

  const toneCounts = nextToneCounts(state, command.tone);
  const nextSignal =
    state.signal + command.signalDelta + toneSignalWeight(command.tone) + command.day;
  const nextFingerprint = hashText(
    `${state.commandFingerprint}|${command.day}|${command.signalDelta}|${command.tone}`
  );

  return {
    day: command.day,
    revision: state.revision + 1,
    signal: nextSignal,
    calmCount: toneCounts.calmCount,
    watchfulCount: toneCounts.watchfulCount,
    brightCount: toneCounts.brightCount,
    commandFingerprint: nextFingerprint
  };
}

function validateHelloCommand(
  state: HelloSimulationState,
  command: HelloSimulationCommandDto
): void {
  if (command.protocolVersion !== HELLO_SIMULATION_PROTOCOL_VERSION) {
    throw new Error(`Unsupported hello command protocol version ${command.protocolVersion}.`);
  }

  if (command.kind !== "hello.adjust-signal") {
    throw new Error(`Unsupported hello command kind ${command.kind}.`);
  }

  if (command.actorId !== "hello-observer") {
    throw new Error(`Unsupported hello command actor ${command.actorId}.`);
  }

  const expectedDay = state.day + 1;
  if (command.day !== expectedDay) {
    throw new Error(`Expected hello command day ${expectedDay}, received ${command.day}.`);
  }
}

function nextToneCounts(
  state: HelloSimulationState,
  tone: HelloCommandTone
): Pick<HelloSimulationState, "brightCount" | "calmCount" | "watchfulCount"> {
  switch (tone) {
    case "calm":
      return {
        calmCount: state.calmCount + 1,
        watchfulCount: state.watchfulCount,
        brightCount: state.brightCount
      };
    case "watchful":
      return {
        calmCount: state.calmCount,
        watchfulCount: state.watchfulCount + 1,
        brightCount: state.brightCount
      };
    case "bright":
      return {
        calmCount: state.calmCount,
        watchfulCount: state.watchfulCount,
        brightCount: state.brightCount + 1
      };
  }
}

function toneSignalWeight(tone: HelloCommandTone): number {
  switch (tone) {
    case "calm":
      return 3;
    case "watchful":
      return 5;
    case "bright":
      return 7;
  }
}

function hashHelloState(state: HelloSimulationState): string {
  return toFixedHexHash(
    hashText(
      [
        "hello-simulation-v1",
        `day=${state.day}`,
        `revision=${state.revision}`,
        `signal=${state.signal}`,
        `calm=${state.calmCount}`,
        `watchful=${state.watchfulCount}`,
        `bright=${state.brightCount}`,
        `fingerprint=${state.commandFingerprint}`
      ].join("|")
    )
  );
}

function hashText(text: string): number {
  let hash = INITIAL_HASH_OFFSET;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, HASH_PRIME) >>> 0;
  }

  return hash;
}

function toFixedHexHash(hash: number): string {
  return hash.toString(16).padStart(8, "0");
}

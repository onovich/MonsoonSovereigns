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

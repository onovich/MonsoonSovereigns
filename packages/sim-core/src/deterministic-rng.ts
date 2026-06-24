import {
  DETERMINISTIC_RNG_ALGORITHM,
  DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION,
  DETERMINISTIC_RNG_STATE_SCHEMA_VERSION,
  type DeterministicRngDomainKeyDtoV1,
  type DeterministicRngStateDtoV1
} from "@monsoon/protocol";

export {
  DETERMINISTIC_RNG_ALGORITHM,
  DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION,
  DETERMINISTIC_RNG_STATE_SCHEMA_VERSION
} from "@monsoon/protocol";
export type { DeterministicRngDomainKeyDtoV1, DeterministicRngStateDtoV1 } from "@monsoon/protocol";

export type DeterministicRngSeed = string & { readonly __brand: "DeterministicRngSeed" };
export type DeterministicRngDrawIndex = number & { readonly __brand: "DeterministicRngDrawIndex" };

export interface DeterministicRngDomainKeyInput {
  readonly system: unknown;
  readonly day: unknown;
  readonly entity: unknown;
  readonly purpose: unknown;
  readonly substream: unknown;
}

export interface CreateDeterministicRngInput {
  readonly seed: unknown;
  readonly domain: DeterministicRngDomainKeyInput;
}

export interface DeterministicRngDomainKey {
  readonly system: string;
  readonly day: number;
  readonly entity: string;
  readonly purpose: string;
  readonly substream: string;
}

export interface DeterministicRng {
  readonly seed: DeterministicRngSeed;
  readonly domain: DeterministicRngDomainKey;
  readonly drawIndex: DeterministicRngDrawIndex;
  readonly state: RngStateWords;
}

export interface DeterministicRngUint32Step {
  readonly value: number;
  readonly rng: DeterministicRng;
}

export interface DeterministicRngIntStep {
  readonly value: number;
  readonly rng: DeterministicRng;
}

type RngStateWords = readonly [number, number, number, number];

const FNV1A32_OFFSET = 2_166_136_261;
const FNV1A32_PRIME = 16_777_619;
const UINT32_RANGE = 4_294_967_296;
const UINT32_MAX = UINT32_RANGE - 1;
const SEED_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/u;
const DOMAIN_FIELD_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/u;

export function parseDeterministicRngSeed(value: unknown): DeterministicRngSeed {
  if (typeof value !== "string" || !SEED_PATTERN.test(value)) {
    throw new Error("DeterministicRng seed must match [A-Za-z0-9._:-]{1,128}.");
  }

  return value as DeterministicRngSeed;
}

export function createDeterministicRng(input: CreateDeterministicRngInput): DeterministicRng {
  const seed = parseDeterministicRngSeed(input.seed);
  const domain = parseDeterministicRngDomainKey(input.domain);
  return {
    seed,
    domain,
    drawIndex: parseDeterministicRngDrawIndex(0),
    state: deriveInitialState(seed, domain)
  };
}

export function nextRngUint32(rng: DeterministicRng): DeterministicRngUint32Step {
  const [a, b, c, d] = rng.state;
  const value = toUint32(toUint32(a + b) + d);
  const nextA = toUint32(b ^ (b >>> 9));
  const nextB = toUint32(c + toUint32(c << 3));
  const rotatedC = toUint32(toUint32(c << 21) | (c >>> 11));
  const nextC = toUint32(rotatedC + value);
  const nextD = toUint32(d + 1);

  return {
    value,
    rng: {
      ...rng,
      drawIndex: parseDeterministicRngDrawIndex(rng.drawIndex + 1),
      state: makeStateWords(nextA, nextB, nextC, nextD)
    }
  };
}

export function nextRngInt(rng: DeterministicRng, maxExclusive: unknown): DeterministicRngIntStep {
  const bound = parseBoundedDrawLimit(maxExclusive);
  const rejectionLimit = UINT32_RANGE - (UINT32_RANGE % bound);
  let current = rng;

  for (;;) {
    const step = nextRngUint32(current);
    if (step.value < rejectionLimit) {
      return {
        value: step.value % bound,
        rng: step.rng
      };
    }

    current = step.rng;
  }
}

export function deterministicRngToDto(rng: DeterministicRng): DeterministicRngStateDtoV1 {
  return {
    schemaVersion: DETERMINISTIC_RNG_STATE_SCHEMA_VERSION,
    algorithm: DETERMINISTIC_RNG_ALGORITHM,
    seed: rng.seed,
    domain: deterministicRngDomainKeyToDto(rng.domain),
    drawIndex: rng.drawIndex,
    state: rng.state
  };
}

export function deterministicRngDomainKeyToDto(
  domain: DeterministicRngDomainKey
): DeterministicRngDomainKeyDtoV1 {
  return {
    schemaVersion: DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION,
    system: domain.system,
    day: domain.day,
    entity: domain.entity,
    purpose: domain.purpose,
    substream: domain.substream
  };
}

export function parseDeterministicRngStateDto(input: unknown): DeterministicRng {
  if (!isRecord(input)) {
    throw new Error("DeterministicRngStateDtoV1 must be an object.");
  }

  if (input["schemaVersion"] !== DETERMINISTIC_RNG_STATE_SCHEMA_VERSION) {
    throw new Error(
      `DeterministicRngStateDtoV1 schemaVersion must be ${DETERMINISTIC_RNG_STATE_SCHEMA_VERSION}.`
    );
  }

  if (input["algorithm"] !== DETERMINISTIC_RNG_ALGORITHM) {
    throw new Error(`DeterministicRngStateDtoV1 algorithm must be ${DETERMINISTIC_RNG_ALGORITHM}.`);
  }

  const state = input["state"];
  if (!Array.isArray(state) || state.length !== 4) {
    throw new Error("DeterministicRngStateDtoV1 state must contain exactly four uint32 words.");
  }

  const state0 = parseUint32StateWord(state[0], "state[0]");
  const state1 = parseUint32StateWord(state[1], "state[1]");
  const state2 = parseUint32StateWord(state[2], "state[2]");
  const state3 = parseUint32StateWord(state[3], "state[3]");

  return {
    seed: parseDeterministicRngSeed(input["seed"]),
    domain: parseDeterministicRngDomainKeyDto(input["domain"]),
    drawIndex: parseDeterministicRngDrawIndex(input["drawIndex"]),
    state: makeStateWords(state0, state1, state2, state3)
  };
}

function parseDeterministicRngDomainKeyDto(input: unknown): DeterministicRngDomainKey {
  if (!isRecord(input)) {
    throw new Error("DeterministicRngDomainKeyDtoV1 must be an object.");
  }

  if (input["schemaVersion"] !== DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION) {
    throw new Error(
      `DeterministicRngDomainKeyDtoV1 schemaVersion must be ${DETERMINISTIC_RNG_DOMAIN_KEY_SCHEMA_VERSION}.`
    );
  }

  return parseDeterministicRngDomainKey({
    system: input["system"],
    day: input["day"],
    entity: input["entity"],
    purpose: input["purpose"],
    substream: input["substream"]
  });
}

function parseDeterministicRngDomainKey(
  input: DeterministicRngDomainKeyInput
): DeterministicRngDomainKey {
  return {
    system: parseDomainField(input.system, "system"),
    day: parseDomainDay(input.day),
    entity: parseDomainField(input.entity, "entity"),
    purpose: parseDomainField(input.purpose, "purpose"),
    substream: parseDomainField(input.substream, "substream")
  };
}

function parseDomainField(value: unknown, label: string): string {
  if (typeof value !== "string" || !DOMAIN_FIELD_PATTERN.test(value)) {
    throw new Error(`DeterministicRng domain ${label} must match [A-Za-z0-9._:-]{1,128}.`);
  }

  return value;
}

function parseDomainDay(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("DeterministicRng domain day must be a nonnegative safe integer.");
  }

  return value;
}

function parseDeterministicRngDrawIndex(value: unknown): DeterministicRngDrawIndex {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("DeterministicRng drawIndex must be a nonnegative safe integer.");
  }

  return value as DeterministicRngDrawIndex;
}

function parseBoundedDrawLimit(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value <= 0 ||
    value > UINT32_RANGE
  ) {
    throw new Error("DeterministicRng bounded draw limit must be an integer in [1, 4294967296].");
  }

  return value;
}

function parseUint32StateWord(value: unknown, path: string): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > UINT32_MAX
  ) {
    throw new Error(`DeterministicRng ${path} must be a uint32 integer.`);
  }

  return value;
}

function deriveInitialState(
  seed: DeterministicRngSeed,
  domain: DeterministicRngDomainKey
): RngStateWords {
  const canonicalText = canonicalSeedDomainText(seed, domain);
  const state = makeStateWords(
    hashText(`${canonicalText}\nstate:0`),
    hashText(`${canonicalText}\nstate:1`),
    hashText(`${canonicalText}\nstate:2`),
    hashText(`${canonicalText}\nstate:3`)
  );

  if (state[0] === 0 && state[1] === 0 && state[2] === 0 && state[3] === 0) {
    return makeStateWords(FNV1A32_OFFSET, FNV1A32_PRIME, UINT32_MAX, 1);
  }

  return state;
}

function canonicalSeedDomainText(
  seed: DeterministicRngSeed,
  domain: DeterministicRngDomainKey
): string {
  return [
    "deterministic-rng-domain-v1",
    canonicalField("algorithm", DETERMINISTIC_RNG_ALGORITHM),
    canonicalField("seed", seed),
    canonicalField("system", domain.system),
    canonicalField("day", `${domain.day}`),
    canonicalField("entity", domain.entity),
    canonicalField("purpose", domain.purpose),
    canonicalField("substream", domain.substream)
  ].join("\n");
}

function canonicalField(name: string, value: string): string {
  return `${name}:${value.length}:${value}`;
}

function hashText(text: string): number {
  let hash = FNV1A32_OFFSET;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, FNV1A32_PRIME) >>> 0;
  }

  return hash;
}

function makeStateWords(
  state0: number,
  state1: number,
  state2: number,
  state3: number
): RngStateWords {
  return [toUint32(state0), toUint32(state1), toUint32(state2), toUint32(state3)] as const;
}

function toUint32(value: number): number {
  return value >>> 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

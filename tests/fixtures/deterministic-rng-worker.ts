import { parentPort } from "node:worker_threads";

import {
  createDeterministicRng,
  nextRngUint32,
  type DeterministicRngDomainKeyInput
} from "../../packages/sim-core/src/index.ts";

interface WorkerRequest {
  readonly seed: string;
  readonly domain: DeterministicRngDomainKeyInput;
  readonly count: number;
}

if (parentPort === null) {
  throw new Error("deterministic-rng-worker requires a parent port.");
}

parentPort.on("message", (message: unknown) => {
  const request = parseRequest(message);
  let rng = createDeterministicRng({ seed: request.seed, domain: request.domain });
  const values: number[] = [];

  for (let index = 0; index < request.count; index += 1) {
    const step = nextRngUint32(rng);
    values.push(step.value);
    rng = step.rng;
  }

  parentPort.postMessage(values);
});

function parseRequest(value: unknown): WorkerRequest {
  if (!isRecord(value)) {
    throw new Error("Worker RNG request must be an object.");
  }

  const seed = value["seed"];
  const domain = value["domain"];
  const count = value["count"];

  if (typeof seed !== "string" || !isRecord(domain)) {
    throw new Error("Worker RNG request must include seed and domain.");
  }

  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
    throw new Error("Worker RNG request count must be a nonnegative safe integer.");
  }

  return {
    seed,
    domain: {
      system: domain["system"],
      day: domain["day"],
      entity: domain["entity"],
      purpose: domain["purpose"],
      substream: domain["substream"]
    },
    count
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

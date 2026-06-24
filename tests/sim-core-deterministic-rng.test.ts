import fc from "fast-check";
import { once } from "node:events";
import { Worker } from "node:worker_threads";
import { describe, expect, test } from "vitest";

import {
  DETERMINISTIC_RNG_ALGORITHM,
  DETERMINISTIC_RNG_STATE_SCHEMA_VERSION,
  createDeterministicRng,
  deterministicRngToDto,
  nextRngInt,
  nextRngUint32,
  parseDeterministicRngStateDto,
  type DeterministicRng,
  type DeterministicRngDomainKeyInput
} from "../packages/sim-core/src/index";

const GOLDEN_DOMAIN: DeterministicRngDomainKeyInput = {
  system: "scheduler.daily-authority-step",
  day: 1531,
  entity: "district:100",
  purpose: "monsoon-check",
  substream: "primary"
};

const ALTERNATE_DOMAIN: DeterministicRngDomainKeyInput = {
  system: "scheduler.daily-authority-step",
  day: 1531,
  entity: "district:101",
  purpose: "monsoon-check",
  substream: "primary"
};

describe("SIM-004 DeterministicRng domains", () => {
  test("locks golden vector output for the documented SFC32/FNV domain algorithm", () => {
    const values = takeUint32(
      createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: GOLDEN_DOMAIN }),
      6
    );

    expect(DETERMINISTIC_RNG_ALGORITHM).toBe("sfc32-fnv1a32-domain-v1");
    expect(values).toEqual([
      2_599_129_062, 639_629_895, 3_477_189_254, 1_408_269_852, 1_328_933_099, 3_297_717_503
    ]);
  });

  test("keeps unrelated domain draws isolated from each other", () => {
    let unrelated = createDeterministicRng({
      seed: "monsoon-test-seed-1531",
      domain: GOLDEN_DOMAIN
    });
    const baseline = takeUint32(
      createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: ALTERNATE_DOMAIN }),
      5
    );

    for (let index = 0; index < 30; index += 1) {
      unrelated = nextRngUint32(unrelated).rng;
    }

    expect(
      takeUint32(
        createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: ALTERNATE_DOMAIN }),
        5
      )
    ).toEqual(baseline);
  });

  test("serializes and restores mid-stream state through explicit versioned DTOs", () => {
    let rng = createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: GOLDEN_DOMAIN });
    rng = nextRngUint32(nextRngUint32(rng).rng).rng;

    const dto = deterministicRngToDto(rng);
    const restored = parseDeterministicRngStateDto(dto);

    expect(dto.schemaVersion).toBe(DETERMINISTIC_RNG_STATE_SCHEMA_VERSION);
    expect(dto.algorithm).toBe("sfc32-fnv1a32-domain-v1");
    expect(dto.domain).toEqual({
      schemaVersion: 1,
      system: "scheduler.daily-authority-step",
      day: 1531,
      entity: "district:100",
      purpose: "monsoon-check",
      substream: "primary"
    });
    expect(takeUint32(restored, 4)).toEqual(takeUint32(rng, 4));
  });

  test("uses integer bounded draws without perturbing replay", () => {
    let first = createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: GOLDEN_DOMAIN });
    let second = createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: GOLDEN_DOMAIN });
    const firstValues: number[] = [];
    const secondValues: number[] = [];

    for (let index = 0; index < 20; index += 1) {
      const firstStep = nextRngInt(first, 10_000);
      const secondStep = nextRngInt(second, 10_000);
      firstValues.push(firstStep.value);
      secondValues.push(secondStep.value);
      first = firstStep.rng;
      second = secondStep.rng;
    }

    expect(firstValues).toEqual(secondValues);
    expect(
      firstValues.every((value) => Number.isInteger(value) && value >= 0 && value < 10_000)
    ).toBe(true);
  });

  test("matches the same seed/domain sequence inside a Worker-capable module", async () => {
    const nodeValues = takeUint32(
      createDeterministicRng({ seed: "monsoon-test-seed-1531", domain: GOLDEN_DOMAIN }),
      8
    );
    const workerValues = await takeWorkerUint32("monsoon-test-seed-1531", GOLDEN_DOMAIN, 8);

    expect(workerValues).toEqual(nodeValues);
  });

  test("proves generated domain keys replay stably and remain isolated", () => {
    fc.assert(
      fc.property(
        domainKeyArbitrary(),
        domainKeyArbitrary(),
        fc.integer({ min: 0, max: 20 }),
        (firstDomain, secondDomain, extraDraws) => {
          fc.pre(canonicalDomainKey(firstDomain) !== canonicalDomainKey(secondDomain));

          let firstRng = createDeterministicRng({
            seed: "property-seed:1531",
            domain: firstDomain
          });
          const secondBaseline = takeUint32(
            createDeterministicRng({ seed: "property-seed:1531", domain: secondDomain }),
            4
          );

          for (let index = 0; index < extraDraws; index += 1) {
            firstRng = nextRngUint32(firstRng).rng;
          }

          const dto = deterministicRngToDto(firstRng);
          expect(takeUint32(parseDeterministicRngStateDto(dto), 4)).toEqual(
            takeUint32(firstRng, 4)
          );
          expect(
            takeUint32(
              createDeterministicRng({ seed: "property-seed:1531", domain: secondDomain }),
              4
            )
          ).toEqual(secondBaseline);
        }
      )
    );
  });
});

function takeUint32(initialRng: DeterministicRng, count: number): readonly number[] {
  let rng = initialRng;
  const values: number[] = [];

  for (let index = 0; index < count; index += 1) {
    const step = nextRngUint32(rng);
    values.push(step.value);
    rng = step.rng;
  }

  return values;
}

async function takeWorkerUint32(
  seed: string,
  domain: DeterministicRngDomainKeyInput,
  count: number
): Promise<readonly number[]> {
  const worker = new Worker(new URL("./fixtures/deterministic-rng-worker.ts", import.meta.url), {
    execArgv: ["--experimental-strip-types"]
  });

  try {
    worker.postMessage({ seed, domain, count });
    const [message] = await once(worker, "message");
    if (!Array.isArray(message) || !message.every((value) => typeof value === "number")) {
      throw new Error("Worker returned malformed RNG values.");
    }

    return message;
  } finally {
    await worker.terminate();
  }
}

function domainKeyArbitrary(): fc.Arbitrary<DeterministicRngDomainKeyInput> {
  return fc.record({
    system: fc.constantFrom(
      "scheduler.daily-authority-step",
      "scheduler.month-boundary-hooks",
      "scheduler.year-boundary-hooks"
    ),
    day: fc.integer({ min: 0, max: 20_000 }),
    entity: fc.integer({ min: 1, max: 500 }).map((id) => `entity:${id}`),
    purpose: fc.constantFrom("weather", "succession", "proposal", "campaign"),
    substream: fc.constantFrom("primary", "secondary", "audit")
  });
}

function canonicalDomainKey(domain: DeterministicRngDomainKeyInput): string {
  return `${domain.system}|${domain.day}|${domain.entity}|${domain.purpose}|${domain.substream}`;
}

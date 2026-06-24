import { arch, cpus, platform } from "node:os";
import { hrtime, stdout, version } from "node:process";

const { advanceWorldByGameDay, createAbstractGraph30WorldStateV0, loadSaveV1, requestSaveV1 } =
  await import("../src/index.ts");

const BASELINE_DAY_COUNT = 3650;
const NANOSECONDS_PER_SECOND = 1_000_000_000;

let world = createAbstractGraph30WorldStateV0();
const stepDurations = [];
const runStartedAt = hrtime.bigint();

for (let dayIndex = 0; dayIndex < BASELINE_DAY_COUNT; dayIndex += 1) {
  const stepStartedAt = hrtime.bigint();
  world = advanceWorldByGameDay(world);
  stepDurations.push(hrtime.bigint() - stepStartedAt);
}

const runDurationNanoseconds = hrtime.bigint() - runStartedAt;
const throughputPerSecond =
  (BigInt(BASELINE_DAY_COUNT) * BigInt(NANOSECONDS_PER_SECOND)) / runDurationNanoseconds;
const distribution = getTimingDistribution(stepDurations);
const runtime = {
  world,
  acceptedCommandIds: [],
  commandTail: [],
  eventTail: []
};
const saveStartedAt = hrtime.bigint();
const saved = requestSaveV1(runtime, {
  appVersion: "0.0.0",
  source: "node-runner",
  codecVersion: "save-envelope-v1"
});
const saveDurationNanoseconds = hrtime.bigint() - saveStartedAt;
const loadStartedAt = hrtime.bigint();
const loaded = loadSaveV1(runtime, saved.bytes, {
  expectedContentManifestHash: "4a438525",
  expectedScenarioId: "m1.abstract-graph-30"
});
const loadDurationNanoseconds = hrtime.bigint() - loadStartedAt;

if (loaded.status !== "loaded") {
  throw new Error(
    `Performance baseline save/load failed: ${loaded.reasons[0]?.code ?? "unknown"}.`
  );
}

stdout.write("SIM-005 performance baseline\n");
stdout.write("fixture=m1.abstract-graph-30-world-state-v0\n");
stdout.write(`runtime=node ${version}\n`);
stdout.write(`machine=${platform()} ${arch()} cpuCount=${cpus().length}\n`);
stdout.write(`days=${BASELINE_DAY_COUNT}\n`);
stdout.write(`finalDay=${world.meta.currentDay}\n`);
stdout.write(`finalRevision=${world.meta.revision}\n`);
stdout.write(`dayThroughputPerSecond=${throughputPerSecond.toString()}\n`);
stdout.write(`p50StepNanoseconds=${distribution.p50Nanoseconds.toString()}\n`);
stdout.write(`p95StepNanoseconds=${distribution.p95Nanoseconds.toString()}\n`);
stdout.write(`p99StepNanoseconds=${distribution.p99Nanoseconds.toString()}\n`);
stdout.write(`saveByteLength=${saved.byteLength}\n`);
stdout.write(`saveNanoseconds=${saveDurationNanoseconds.toString()}\n`);
stdout.write(`loadNanoseconds=${loadDurationNanoseconds.toString()}\n`);

function getTimingDistribution(values) {
  const sortedValues = [...values].sort(compareBigInt);

  return {
    p50Nanoseconds: percentile(sortedValues, 50),
    p95Nanoseconds: percentile(sortedValues, 95),
    p99Nanoseconds: percentile(sortedValues, 99)
  };
}

function percentile(sortedValues, percentileValue) {
  if (sortedValues.length === 0) {
    throw new Error("Cannot calculate percentile for an empty timing set.");
  }

  const rawIndex = Math.floor(((sortedValues.length - 1) * percentileValue) / 100);
  const value = sortedValues[rawIndex];
  if (value === undefined) {
    throw new Error(`Missing timing value at percentile index ${rawIndex}.`);
  }

  return value;
}

function compareBigInt(left, right) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

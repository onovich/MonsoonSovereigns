import {
  DETERMINISTIC_SYSTEM_ORDER_VERSION,
  GAME_DAY_SCHEDULER_VERSION,
  type GameDay,
  type WorldStateV0,
  hashWorldStateV0,
  parseGameDay,
  parseWorldRevision,
  validateWorldStateV0
} from "./world-state-v0.ts";

export const GAME_DAYS_PER_MONTH = 30;
export const GAME_MONTHS_PER_YEAR = 12;
export const GAME_DAYS_PER_YEAR = GAME_DAYS_PER_MONTH * GAME_MONTHS_PER_YEAR;

export type DeterministicSystemIdV0 =
  | "scheduler.command-buffer"
  | "scheduler.daily-authority-step"
  | "scheduler.month-boundary-hooks"
  | "scheduler.year-boundary-hooks"
  | "scheduler.invariant-validation";

export type DeterministicSystemCadenceV0 = "daily" | "month-boundary" | "year-boundary";

export interface DeterministicSystemOrderEntryV0 {
  readonly order: number;
  readonly systemId: DeterministicSystemIdV0;
  readonly cadence: DeterministicSystemCadenceV0;
  readonly tieBreaker: "systemId";
}

export interface GameCalendarDateV0 {
  readonly absoluteDay: GameDay;
  readonly yearIndex: number;
  readonly monthOfYear: number;
  readonly dayOfMonth: number;
  readonly dayOfYear: number;
  readonly isMonthStart: boolean;
  readonly isYearStart: boolean;
}

export const DETERMINISTIC_SYSTEM_ORDER_V1: readonly DeterministicSystemOrderEntryV0[] =
  sortDeterministicSystemOrderEntries([
    {
      order: 100,
      systemId: "scheduler.command-buffer",
      cadence: "daily",
      tieBreaker: "systemId"
    },
    {
      order: 200,
      systemId: "scheduler.daily-authority-step",
      cadence: "daily",
      tieBreaker: "systemId"
    },
    {
      order: 300,
      systemId: "scheduler.month-boundary-hooks",
      cadence: "month-boundary",
      tieBreaker: "systemId"
    },
    {
      order: 400,
      systemId: "scheduler.year-boundary-hooks",
      cadence: "year-boundary",
      tieBreaker: "systemId"
    },
    {
      order: 900,
      systemId: "scheduler.invariant-validation",
      cadence: "daily",
      tieBreaker: "systemId"
    }
  ]);

export function sortDeterministicSystemOrderEntries(
  entries: readonly DeterministicSystemOrderEntryV0[]
): readonly DeterministicSystemOrderEntryV0[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => compareSystemOrderEntry(left, right))
    .map((ordered) => ordered.entry);
}

export function getGameCalendarDate(day: GameDay): GameCalendarDateV0 {
  const yearIndex = Math.floor(day / GAME_DAYS_PER_YEAR);
  const dayWithinYear = day % GAME_DAYS_PER_YEAR;
  const monthOfYear = Math.floor(dayWithinYear / GAME_DAYS_PER_MONTH) + 1;
  const dayOfMonth = (dayWithinYear % GAME_DAYS_PER_MONTH) + 1;
  const dayOfYear = dayWithinYear + 1;

  return {
    absoluteDay: day,
    yearIndex,
    monthOfYear,
    dayOfMonth,
    dayOfYear,
    isMonthStart: dayOfMonth === 1,
    isYearStart: dayOfYear === 1
  };
}

export function advanceWorldByGameDay(world: WorldStateV0): WorldStateV0 {
  assertValidWorldStateForScheduler(world, "before");

  const nextDay = parseGameDay(world.meta.currentDay + 1);
  const nextWorldWithoutHash: WorldStateV0 = {
    ...world,
    meta: {
      ...world.meta,
      currentDay: nextDay,
      revision: parseWorldRevision(world.meta.revision + 1),
      stateHash: ""
    },
    scheduler: {
      schedulerVersion: GAME_DAY_SCHEDULER_VERSION,
      systemOrderVersion: DETERMINISTIC_SYSTEM_ORDER_VERSION,
      fixedStepDurationInDays: 1,
      lastCompletedDay: nextDay,
      pendingCommandCount: 0
    }
  };
  const nextWorld = {
    ...nextWorldWithoutHash,
    meta: {
      ...nextWorldWithoutHash.meta,
      stateHash: hashWorldStateV0(nextWorldWithoutHash)
    }
  };

  assertValidWorldStateForScheduler(nextWorld, "after");
  return nextWorld;
}

export function advanceWorldByGameDays(world: WorldStateV0, dayCount: unknown): WorldStateV0 {
  const stepCount = parseGameDayStepCount(dayCount);
  let currentWorld = world;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    currentWorld = advanceWorldByGameDay(currentWorld);
  }

  return currentWorld;
}

function compareSystemOrderEntry(
  left: { readonly entry: DeterministicSystemOrderEntryV0; readonly index: number },
  right: { readonly entry: DeterministicSystemOrderEntryV0; readonly index: number }
): number {
  const orderDelta = left.entry.order - right.entry.order;
  if (orderDelta !== 0) {
    return orderDelta;
  }

  if (left.entry.systemId < right.entry.systemId) {
    return -1;
  }

  if (left.entry.systemId > right.entry.systemId) {
    return 1;
  }

  return left.index - right.index;
}

function parseGameDayStepCount(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("GameDay step count must be a nonnegative safe integer.");
  }

  return value;
}

function assertValidWorldStateForScheduler(world: WorldStateV0, phase: "before" | "after"): void {
  const errors = validateWorldStateV0(world);
  if (errors.length === 0) {
    return;
  }

  throw new Error(
    `WorldState invariant violation ${phase} GameDay commit: ${formatErrors(errors)}`
  );
}

function formatErrors(
  errors: readonly { readonly path: string; readonly message: string }[]
): string {
  return errors
    .slice(0, 3)
    .map((error) => `${error.path} ${error.message}`)
    .join("; ");
}

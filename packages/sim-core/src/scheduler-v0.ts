import {
  DETERMINISTIC_SYSTEM_ORDER_VERSION,
  GAME_DAY_SCHEDULER_VERSION,
  type GameDay,
  type M2AgriculturePhaseV0,
  type M2DistrictAgricultureStateV0,
  type M2DistrictMarketStateV0,
  type M2PopulationGroupStateV0,
  type WorldStateV0,
  canonicalizeM2EconomyPopulationState,
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
  | "scheduler.m2-economy-population"
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
      order: 250,
      systemId: "scheduler.m2-economy-population",
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
  const nextState = advanceM2EconomyPopulationByGameDay(world, nextDay);
  const nextWorldWithoutHash: WorldStateV0 = {
    ...world,
    meta: {
      ...world.meta,
      currentDay: nextDay,
      revision: parseWorldRevision(world.meta.revision + 1),
      stateHash: ""
    },
    state: nextState,
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

function advanceM2EconomyPopulationByGameDay(
  world: WorldStateV0,
  nextDay: GameDay
): WorldStateV0["state"] {
  const m2 = world.state.m2;
  if (m2 === undefined) {
    return world.state;
  }

  const currentDate = getGameCalendarDate(world.meta.currentDay);
  const nextDate = getGameCalendarDate(nextDay);
  const populationGroups = m2.populationGroups.map((group) =>
    advanceM2PopulationGroupLabor(group, nextDay)
  );
  const groupByDistrictId = new Map<number, M2PopulationGroupStateV0>();
  for (const group of populationGroups) {
    groupByDistrictId.set(group.districtId, group);
  }

  const harvestByDistrictId = new Map<number, number>();
  const agriculture = m2.agriculture.districts.map((district) =>
    advanceM2DistrictAgriculture({
      district,
      currentPhase: phaseForMonth(currentDate.monthOfYear),
      nextPhase: phaseForMonth(nextDate.monthOfYear),
      availableLabor: groupByDistrictId.get(district.districtId)?.availableLabor ?? 0,
      harvestByDistrictId
    })
  );
  const nextPopulationGroups = populationGroups.map((group) => {
    const harvest = harvestByDistrictId.get(group.districtId) ?? 0;
    if (harvest === 0) {
      return group;
    }

    return {
      ...group,
      grainStock: group.grainStock + harvest
    };
  });
  const market = m2.market.districts.map((district) =>
    advanceM2DistrictMarket(district, harvestByDistrictId.get(district.districtId) ?? 0)
  );

  return {
    ...world.state,
    m2: canonicalizeM2EconomyPopulationState({
      schemaVersion: 1,
      populationGroups: nextPopulationGroups,
      agriculture: {
        districts: agriculture
      },
      market: {
        districts: market
      }
    })
  };
}

function advanceM2PopulationGroupLabor(
  group: M2PopulationGroupStateV0,
  nextDay: GameDay
): M2PopulationGroupStateV0 {
  const committedLabor = group.committedLabor.filter(
    (commitment) => commitment.releaseDay > nextDay
  );
  const committedLaborAmount = committedLabor.reduce(
    (sum, commitment) => sum + commitment.laborAmount,
    0
  );

  return {
    ...group,
    availableLabor: group.workingPeople - committedLaborAmount,
    committedLabor
  };
}

function advanceM2DistrictAgriculture(input: {
  readonly district: M2DistrictAgricultureStateV0;
  readonly currentPhase: M2AgriculturePhaseV0;
  readonly nextPhase: M2AgriculturePhaseV0;
  readonly availableLabor: number;
  readonly harvestByDistrictId: Map<number, number>;
}): M2DistrictAgricultureStateV0 {
  const enteredPlanting = input.currentPhase !== "planting" && input.nextPhase === "planting";
  const exitedHarvest = input.currentPhase === "harvest" && input.nextPhase !== "harvest";
  const startingAccumulatedLabor = enteredPlanting ? 0 : input.district.accumulatedFarmLabor;
  const farmLabor = integerDivide(
    input.availableLabor * agricultureLaborWeightBps(input.nextPhase),
    10_000
  );
  const accumulatedFarmLabor = startingAccumulatedLabor + farmLabor;
  const expectedHarvestGrain = calculateExpectedHarvestGrain(accumulatedFarmLabor);
  const lastHarvestGrain = exitedHarvest ? expectedHarvestGrain : input.district.lastHarvestGrain;
  if (exitedHarvest) {
    input.harvestByDistrictId.set(input.district.districtId, lastHarvestGrain);
  }

  return {
    districtId: input.district.districtId,
    phase: input.nextPhase,
    daysInPhase: input.district.phase === input.nextPhase ? input.district.daysInPhase + 1 : 1,
    accumulatedFarmLabor: exitedHarvest ? 0 : accumulatedFarmLabor,
    expectedHarvestGrain: exitedHarvest ? 0 : expectedHarvestGrain,
    lastHarvestGrain
  };
}

function advanceM2DistrictMarket(
  district: M2DistrictMarketStateV0,
  lastHarvestDelta: number
): M2DistrictMarketStateV0 {
  return {
    ...district,
    cashFlow: {
      ...district.cashFlow,
      lastDailyCashDelta: 0
    },
    grainFlow: {
      lastHarvestDelta
    }
  };
}

function phaseForMonth(monthOfYear: number): M2AgriculturePhaseV0 {
  if (monthOfYear === 3 || monthOfYear === 4) {
    return "planting";
  }
  if (monthOfYear >= 5 && monthOfYear <= 8) {
    return "growing";
  }
  if (monthOfYear === 9) {
    return "harvest";
  }
  return "fallow";
}

function agricultureLaborWeightBps(phase: M2AgriculturePhaseV0): number {
  switch (phase) {
    case "planting":
    case "harvest":
      return 10_000;
    case "growing":
      return 8_000;
    case "fallow":
      return 0;
  }
}

function calculateExpectedHarvestGrain(accumulatedFarmLabor: number): number {
  return 100 + integerDivide(accumulatedFarmLabor, 4);
}

function integerDivide(dividend: number, divisor: number): number {
  return (dividend - (dividend % divisor)) / divisor;
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

import { describe, expect, test } from "vitest";

import {
  DETERMINISTIC_SYSTEM_ORDER_V1,
  DETERMINISTIC_SYSTEM_ORDER_VERSION,
  GAME_DAY_SCHEDULER_VERSION,
  advanceWorldByGameDay,
  advanceWorldByGameDays,
  createMinimalM1WorldStateV0,
  getGameCalendarDate,
  hashWorldStateV0,
  parseGameDay,
  sortDeterministicSystemOrderEntries,
  validateWorldStateV0
} from "../packages/sim-core/src/index";

describe("SIM-002 fixed GameDay scheduler", () => {
  test("exports explicit versioned deterministic system order", () => {
    expect(DETERMINISTIC_SYSTEM_ORDER_VERSION).toBe(1);
    expect(DETERMINISTIC_SYSTEM_ORDER_V1.map((entry) => entry.systemId)).toEqual([
      "scheduler.command-buffer",
      "scheduler.daily-authority-step",
      "scheduler.m2-economy-population",
      "scheduler.month-boundary-hooks",
      "scheduler.year-boundary-hooks",
      "scheduler.invariant-validation"
    ]);
    expect(DETERMINISTIC_SYSTEM_ORDER_V1.map((entry) => entry.order)).toEqual([
      100, 200, 250, 300, 400, 900
    ]);
    expect(DETERMINISTIC_SYSTEM_ORDER_V1.every((entry) => entry.tieBreaker === "systemId")).toBe(
      true
    );
  });

  test("uses stable systemId tie-breakers when order slots collide", () => {
    const ordered = sortDeterministicSystemOrderEntries([
      {
        order: 20,
        systemId: "scheduler.year-boundary-hooks",
        cadence: "year-boundary",
        tieBreaker: "systemId"
      },
      {
        order: 10,
        systemId: "scheduler.invariant-validation",
        cadence: "daily",
        tieBreaker: "systemId"
      },
      {
        order: 20,
        systemId: "scheduler.month-boundary-hooks",
        cadence: "month-boundary",
        tieBreaker: "systemId"
      }
    ]);

    expect(ordered.map((entry) => entry.systemId)).toEqual([
      "scheduler.invariant-validation",
      "scheduler.month-boundary-hooks",
      "scheduler.year-boundary-hooks"
    ]);
  });

  test("derives day, month, and year boundaries from integer GameDay only", () => {
    expect(getGameCalendarDate(parseGameDay(0))).toEqual({
      absoluteDay: parseGameDay(0),
      yearIndex: 0,
      monthOfYear: 1,
      dayOfMonth: 1,
      dayOfYear: 1,
      isMonthStart: true,
      isYearStart: true
    });
    expect(getGameCalendarDate(parseGameDay(29))).toMatchObject({
      yearIndex: 0,
      monthOfYear: 1,
      dayOfMonth: 30,
      dayOfYear: 30,
      isMonthStart: false,
      isYearStart: false
    });
    expect(getGameCalendarDate(parseGameDay(30))).toMatchObject({
      yearIndex: 0,
      monthOfYear: 2,
      dayOfMonth: 1,
      dayOfYear: 31,
      isMonthStart: true,
      isYearStart: false
    });
    expect(getGameCalendarDate(parseGameDay(360))).toMatchObject({
      yearIndex: 1,
      monthOfYear: 1,
      dayOfMonth: 1,
      dayOfYear: 1,
      isMonthStart: true,
      isYearStart: true
    });
    expect(getGameCalendarDate(parseGameDay(3650))).toMatchObject({
      yearIndex: 10,
      monthOfYear: 2,
      dayOfMonth: 21,
      dayOfYear: 51,
      isMonthStart: false,
      isYearStart: false
    });
  });

  test("commits exactly one whole GameDay per authority step and updates hash input", () => {
    const initialWorld = createMinimalM1WorldStateV0();
    const nextWorld = advanceWorldByGameDay(initialWorld);

    expect(nextWorld.meta.currentDay).toBe(parseGameDay(1));
    expect(nextWorld.meta.revision).toBe(1);
    expect(nextWorld.scheduler).toEqual({
      schedulerVersion: GAME_DAY_SCHEDULER_VERSION,
      systemOrderVersion: DETERMINISTIC_SYSTEM_ORDER_VERSION,
      fixedStepDurationInDays: 1,
      lastCompletedDay: parseGameDay(1),
      pendingCommandCount: 0
    });
    expect(nextWorld.meta.stateHash).toBe(hashWorldStateV0(nextWorld));
    expect(nextWorld.meta.stateHash).not.toBe(initialWorld.meta.stateHash);
    expect(validateWorldStateV0(nextWorld)).toEqual([]);
  });

  test("runs 3650 headless fixed-day steps over minimal M1 state without invariant failures", () => {
    const finalWorld = advanceWorldByGameDays(createMinimalM1WorldStateV0(), 3650);

    expect(finalWorld.meta.currentDay).toBe(parseGameDay(3650));
    expect(finalWorld.meta.revision).toBe(3650);
    expect(finalWorld.scheduler.lastCompletedDay).toBe(parseGameDay(3650));
    expect(validateWorldStateV0(finalWorld)).toEqual([]);
  });
});

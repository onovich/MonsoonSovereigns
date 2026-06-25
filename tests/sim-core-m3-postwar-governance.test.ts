import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  createM2EconomyPopulationStateV0,
  createM3PolityVassalageStateV0,
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  querySimulationV1,
  submitCommandV1,
  validateWorldStateV0,
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";

describe("M3-POSTWAR-GOVERNANCE-001 postwar governance arrangements", () => {
  test("previews direct control, restored vassal, and tribute-only settlements with auditable fields", () => {
    const runtime = bootPostwarRuntime();
    const preview = postwarPreview(runtime, [
      "direct-control",
      "restore-vassal-ruler",
      "tribute-only"
    ]);

    expect(preview.arrangements).toHaveLength(3);
    expect(preview.arrangements.map((arrangement) => arrangement.method)).toEqual([
      "direct-control",
      "restore-vassal-ruler",
      "tribute-only"
    ]);
    for (const arrangement of preview.arrangements) {
      expect(arrangement.administrativeBurden.districtId).toBe(2);
      expect(arrangement.obligationShape.periodDays).toBe(360);
      expect(arrangement.expectedIncomeCash).toBeGreaterThanOrEqual(0);
      expect(arrangement.expectedTributeCash).toBeGreaterThanOrEqual(0);
      expect(arrangement.localAcceptanceBps).toBeGreaterThanOrEqual(0);
      expect(arrangement.reliabilityBps).toBeGreaterThanOrEqual(0);
      expect(arrangement.militaryReadinessBps).toBeGreaterThanOrEqual(0);
      expect(arrangement.riskBps).toBeGreaterThanOrEqual(0);
      expect(arrangement.reasonCodes.length).toBeGreaterThan(2);
    }

    const direct = requireArrangement(preview, "direct-control");
    const vassal = requireArrangement(preview, "restore-vassal-ruler");
    const tribute = requireArrangement(preview, "tribute-only");

    expect(direct.administrativeBurden.controlMode).toBe("direct");
    expect(direct.obligationShape.hasDirectGarrison).toBe(true);
    expect(direct.expectedIncomeCash).toBeGreaterThan(vassal.expectedIncomeCash);
    expect(vassal.expectedTributeCash).toBeGreaterThan(tribute.expectedTributeCash);
    expect(vassal.militaryContributionTroops).toBeGreaterThan(tribute.militaryContributionTroops);
    expect(tribute.administrativeBurden.administrativeLoad).toBeLessThan(
      vassal.administrativeBurden.administrativeLoad
    );
  });

  test("applies arrangements through one GameCommand path without duplicate district controllers", () => {
    const directRuntime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.direct", bootPostwarRuntime(), "direct-control")
    );
    const vassalRuntime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.vassal", bootPostwarRuntime(), "restore-vassal-ruler")
    );
    const tributeRuntime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.tribute", bootPostwarRuntime(), "tribute-only")
    );

    expect(controllerOf(directRuntime.world, 2)).toBe(1);
    expect(controllerOf(vassalRuntime.world, 2)).toBe(2);
    expect(controllerOf(tributeRuntime.world, 2)).toBe(2);
    expect(
      vassalRuntime.world.state.m3?.polities.find((polity) => polity.polityId === 2)
    ).toMatchObject({ directSuzerainPolityId: 1 });
    expect(tributeRuntime.world.state.m3?.obligations).toHaveLength(1);
    expect(vassalRuntime.world.state.m3?.obligations).toHaveLength(2);
    expect(directRuntime.world.state.m3?.obligations).toHaveLength(1);
    expect(
      directRuntime.world.state.m3?.obligations.some(
        (entry) =>
          entry.obligationCategory === "defensive-garrison" &&
          entry.obligationSource.sourceId.startsWith("m3.postwar.district.2.direct-control.")
      )
    ).toBe(true);
    expect(
      directRuntime.world.state.m3?.administrativeDistricts.filter(
        (entry) => entry.districtId === 2
      )
    ).toHaveLength(1);
    expect(
      vassalRuntime.world.state.m3?.administrativeDistricts.filter(
        (entry) => entry.districtId === 2
      )
    ).toHaveLength(1);
    expect(
      tributeRuntime.world.state.m3?.administrativeDistricts.filter(
        (entry) => entry.districtId === 2
      )
    ).toHaveLength(1);

    expect(validateWorldStateV0(directRuntime.world)).toEqual([]);
    expect(validateWorldStateV0(vassalRuntime.world)).toEqual([]);
    expect(validateWorldStateV0(tributeRuntime.world)).toEqual([]);
    expect(directRuntime.eventTail.map((event) => event.kind)).toEqual([
      "sim.m3-postwar-governance-applied"
    ]);
  });

  test("compares materially different 24-month outcomes for the three arrangements", () => {
    const direct = postwarOutcome(
      accepted(
        bootPostwarRuntime(),
        postwarCommand("m3.postwar.24.direct", bootPostwarRuntime(), "direct-control")
      )
    );
    const vassal = postwarOutcome(
      accepted(
        bootPostwarRuntime(),
        postwarCommand("m3.postwar.24.vassal", bootPostwarRuntime(), "restore-vassal-ruler")
      )
    );
    const tribute = postwarOutcome(
      accepted(
        bootPostwarRuntime(),
        postwarCommand("m3.postwar.24.tribute", bootPostwarRuntime(), "tribute-only")
      )
    );

    expect(direct.months).toBe(24);
    expect(direct.totalExpectedIncomeCash).toBeGreaterThan(vassal.totalExpectedIncomeCash);
    expect(vassal.totalExpectedTributeCash).toBeGreaterThan(tribute.totalExpectedTributeCash);
    expect(direct.averageAdministrativeLoad).toBeGreaterThan(vassal.averageAdministrativeLoad);
    expect(vassal.averageReliabilityBps).toBeGreaterThan(tribute.averageReliabilityBps);
    expect(vassal.totalMilitaryContributionTroops).toBeGreaterThan(
      tribute.totalMilitaryContributionTroops
    );
    expect(direct.averageRiskBps).not.toBe(tribute.averageRiskBps);
    expect(
      new Set([...direct.reasonCodes, ...vassal.reasonCodes, ...tribute.reasonCodes]).size
    ).toBeGreaterThan(8);
  });

  test("rejects duplicate postwar obligations and suzerain cycles without mutating state", () => {
    let runtime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.dup.first", bootPostwarRuntime(), "restore-vassal-ruler")
    );
    const duplicate = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.dup.second", runtime, "restore-vassal-ruler")
    );
    expect(duplicate.result).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-obligation-settlement", path: "payload.districtId" }
    });
    expect(duplicate.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);

    runtime = accepted(
      bootPostwarRuntime(),
      setSuzerainCommand("m3.postwar.cycle.setup", bootPostwarRuntime(), 1, 2)
    );
    const cycle = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.cycle", runtime, "tribute-only")
    );
    expect(cycle.result).toMatchObject({
      status: "rejected",
      error: { code: "acyclicity-violation", path: "payload.victorPolityId" }
    });
  });

  test("rejects same-district postwar arrangements with different settlement ids", () => {
    const runtime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.dup-district.first", bootPostwarRuntime(), "restore-vassal-ruler")
    );
    const duplicate = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.dup-district.second", runtime, "tribute-only", {
        settlementId: "m3.postwar.validation.another-target"
      })
    );

    expect(duplicate.result).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-obligation-settlement", path: "payload.districtId" }
    });
    expect(duplicate.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
    expect(runtime.world.state.m3?.obligations).toHaveLength(2);
  });

  test("rejects direct control after a vassal arrangement instead of leaving stale rights", () => {
    const runtime = accepted(
      bootPostwarRuntime(),
      postwarCommand(
        "m3.postwar.direct-after-vassal.first",
        bootPostwarRuntime(),
        "restore-vassal-ruler"
      )
    );
    const direct = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.direct-after-vassal.second", runtime, "direct-control", {
        settlementId: "m3.postwar.validation.direct-replacement"
      })
    );

    expect(direct.result).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-obligation-settlement", path: "payload.districtId" }
    });
    expect(direct.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
    expect(controllerOf(runtime.world, 2)).toBe(2);
    expect(runtime.world.state.m3?.obligations).toHaveLength(2);
  });

  test("rejects different-victor direct control over an existing postwar district", () => {
    const runtime = accepted(
      bootPostwarRuntime(),
      postwarCommand(
        "m3.postwar.different-victor.first",
        bootPostwarRuntime(),
        "restore-vassal-ruler"
      )
    );
    const replacement = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.different-victor.second", runtime, "direct-control", {
        settlementId: "m3.postwar.validation.different-victor",
        victorPolityId: 3
      })
    );

    expect(replacement.result).toMatchObject({
      status: "rejected",
      error: { code: "duplicate-obligation-settlement", path: "payload.districtId" }
    });
    expect(replacement.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
    expect(controllerOf(replacement.runtime.world, 2)).toBe(2);
    expect(
      replacement.runtime.world.state.m3?.administrativeDistricts.some(
        (entry) => entry.polityId === 3 && entry.districtId === 2
      )
    ).toBe(false);
    expect(
      replacement.runtime.world.state.m3?.obligations.some((entry) => entry.creditorPolityId === 3)
    ).toBe(false);
  });

  test("rejects different-victor arrangements when local polity is changed to prior victor", () => {
    const runtime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.local-bypass.first", bootPostwarRuntime(), "restore-vassal-ruler")
    );
    const direct = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.local-bypass.direct", runtime, "direct-control", {
        settlementId: "m3.postwar.validation.local-bypass.direct",
        victorPolityId: 3,
        localPolityId: 1
      })
    );
    const tribute = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.local-bypass.tribute", runtime, "tribute-only", {
        settlementId: "m3.postwar.validation.local-bypass.tribute",
        victorPolityId: 3,
        localPolityId: 1
      })
    );

    for (const submitted of [direct, tribute]) {
      expect(submitted.result).toMatchObject({
        status: "rejected",
        error: { code: "duplicate-obligation-settlement", path: "payload.districtId" }
      });
      expect(submitted.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
      expect(controllerOf(submitted.runtime.world, 2)).toBe(2);
      expect(
        submitted.runtime.world.state.m3?.administrativeDistricts.some(
          (entry) => entry.polityId === 3 && entry.districtId === 2
        )
      ).toBe(false);
      expect(
        submitted.runtime.world.state.m3?.obligations.some((entry) => entry.creditorPolityId === 3)
      ).toBe(false);
    }
  });

  test("rejects repeated arrangements after direct-control first settlement", () => {
    const runtime = accepted(
      bootPostwarRuntime(),
      postwarCommand("m3.postwar.direct-first.initial", bootPostwarRuntime(), "direct-control")
    );
    const duplicateDirect = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.direct-first.duplicate", runtime, "direct-control", {
        settlementId: "m3.postwar.validation.direct-first.duplicate"
      })
    );
    const tributeReplacement = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.direct-first.tribute", runtime, "tribute-only", {
        settlementId: "m3.postwar.validation.direct-first.tribute"
      })
    );
    const restoreReplacement = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.direct-first.restore", runtime, "restore-vassal-ruler", {
        settlementId: "m3.postwar.validation.direct-first.restore"
      })
    );
    const differentVictorDirect = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.direct-first.different-victor", runtime, "direct-control", {
        settlementId: "m3.postwar.validation.direct-first.different-victor",
        victorPolityId: 3
      })
    );

    for (const submitted of [
      duplicateDirect,
      tributeReplacement,
      restoreReplacement,
      differentVictorDirect
    ]) {
      expect(submitted.result).toMatchObject({
        status: "rejected",
        error: { code: "duplicate-obligation-settlement", path: "payload.districtId" }
      });
      expect(submitted.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
      expect(controllerOf(submitted.runtime.world, 2)).toBe(1);
      expect(submitted.runtime.world.state.m3?.obligations).toEqual(
        runtime.world.state.m3?.obligations
      );
      expect(submitted.runtime.world.state.m3?.administrativeDistricts).toEqual(
        runtime.world.state.m3?.administrativeDistricts
      );
    }
  });

  test("restore-vassal-ruler requires concrete ruler and policy fields", () => {
    const runtime = bootPostwarRuntime();
    const missingRuler = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.restore.no-ruler", runtime, "restore-vassal-ruler", {
        localRulerCharacterId: null
      })
    );
    const missingPolicy = submitCommandV1(
      runtime,
      postwarCommand("m3.postwar.restore.no-policy", runtime, "restore-vassal-ruler", {
        policyId: null
      })
    );

    expect(missingRuler.result).toMatchObject({
      status: "rejected",
      error: { code: "invalid-payload", path: "payload.localRulerCharacterId" }
    });
    expect(missingPolicy.result).toMatchObject({
      status: "rejected",
      error: { code: "invalid-payload", path: "payload.policyId" }
    });
    expect(missingRuler.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
    expect(missingPolicy.runtime.world.meta.stateHash).toBe(runtime.world.meta.stateHash);
  });

  test("property checks deterministic previews and no direct resource creation from burden projections", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("direct-control", "restore-vassal-ruler", "tribute-only"),
        (method) => {
          const runtime = bootPostwarRuntime();
          const resourceBefore = resourceTotals(runtime);
          const first = postwarPreview(runtime, [method]);
          const second = postwarPreview(runtime, [method]);

          expect(first).toEqual(second);
          expect(resourceTotals(runtime)).toEqual(resourceBefore);
          expect(runtime.world.meta.stateHash).toBe(bootPostwarRuntime().world.meta.stateHash);
        }
      ),
      { numRuns: 18, seed: 1531 }
    );
  });
});

type PostwarMethod = "direct-control" | "restore-vassal-ruler" | "tribute-only";

interface PostwarPreviewResult {
  readonly kind: "sim.preview-m3-postwar-governance";
  readonly day: number;
  readonly revision: number;
  readonly months: number;
  readonly arrangements: readonly PostwarArrangementPreview[];
}

interface PostwarArrangementPreview {
  readonly method: PostwarMethod;
  readonly administrativeBurden: {
    readonly districtId: number;
    readonly controlMode: "direct" | "vassal" | "tribute-only";
    readonly administrativeLoad: number;
  };
  readonly obligationShape: {
    readonly periodDays: number;
    readonly tributeCash: number;
    readonly troopHeadcount: number;
    readonly hasDirectGarrison: boolean;
  };
  readonly expectedIncomeCash: number;
  readonly expectedTributeCash: number;
  readonly localAcceptanceBps: number;
  readonly reliabilityBps: number;
  readonly militaryReadinessBps: number;
  readonly militaryContributionTroops: number;
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
}

interface PostwarOutcomeResult {
  readonly kind: "sim.compare-m3-postwar-governance-outcomes";
  readonly months: number;
  readonly outcomes: readonly {
    readonly months: number;
    readonly method: PostwarMethod;
    readonly totalExpectedIncomeCash: number;
    readonly totalExpectedTributeCash: number;
    readonly averageAdministrativeLoad: number;
    readonly averageReliabilityBps: number;
    readonly totalMilitaryContributionTroops: number;
    readonly averageRiskBps: number;
    readonly reasonCodes: readonly string[];
  }[];
}

function bootPostwarRuntime(): SimulationRuntimeV1 {
  return {
    world: createPostwarWorld(),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function createPostwarWorld(): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.postwar.victor" }),
      definePolity({ id: 2, displayNameKey: "content.m3.postwar.local" }),
      definePolity({ id: 3, displayNameKey: "content.m3.postwar.second-victor" })
    ],
    persons: [
      definePerson({ id: 1, displayNameKey: "content.m3.postwar.ruler" }),
      definePerson({ id: 2, displayNameKey: "content.m3.postwar.envoy" })
    ],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.postwar.capital" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.postwar.target" })
    ],
    settlements: [],
    routes: []
  };

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.postwar.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: null },
        { polityId: 3, directSuzerainPolityId: null }
      ],
      characters: [
        {
          characterId: 1,
          polityId: 2,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 6_500,
          administrationBps: 7_000,
          diplomacyBps: 7_500
        },
        {
          characterId: 2,
          polityId: 1,
          alive: true,
          incapacitated: false,
          currentDistrictId: 1,
          commandBps: 8_000,
          administrationBps: 6_000,
          diplomacyBps: 5_000
        }
      ],
      policies: [
        {
          policyId: 201,
          target: { kind: "district", districtId: 2 },
          stance: "balanced",
          intensityBps: 5_000
        }
      ],
      administrativeDistricts: [
        {
          polityId: 1,
          districtId: 1,
          controlMode: "direct",
          localComplexity: 80,
          communicationCost: 40,
          directness: 80,
          frontierPressure: 40,
          administrativeCapacity: 1_000
        },
        {
          polityId: 2,
          districtId: 2,
          controlMode: "direct",
          localComplexity: 210,
          communicationCost: 110,
          directness: 180,
          frontierPressure: 160,
          administrativeCapacity: 850
        }
      ]
    })
  });
}

function postwarCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  method: PostwarMethod,
  overrides: {
    readonly settlementId?: string;
    readonly victorPolityId?: number;
    readonly localPolityId?: number;
    readonly localRulerCharacterId?: number | null;
    readonly policyId?: number | null;
  } = {}
): unknown {
  return {
    schemaVersion: 1,
    kind: "sim.apply-m3-postwar-governance",
    commandId,
    actor: { kind: "player", id: `polity:${overrides.victorPolityId ?? 1}` },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      settlementId: overrides.settlementId ?? "m3.postwar.validation.target",
      victorPolityId: overrides.victorPolityId ?? 1,
      localPolityId: overrides.localPolityId ?? 2,
      districtId: 2,
      method,
      localRulerCharacterId:
        "localRulerCharacterId" in overrides
          ? overrides.localRulerCharacterId
          : method === "direct-control"
            ? null
            : 1,
      policyId:
        "policyId" in overrides
          ? overrides.policyId
          : method === "restore-vassal-ruler"
            ? 201
            : null,
      reasonCode: "postwar.validation"
    }
  };
}

function setSuzerainCommand(
  commandId: string,
  runtime: SimulationRuntimeV1,
  polityId: number,
  directSuzerainPolityId: number | null
): unknown {
  return {
    schemaVersion: 1,
    kind: "sim.set-polity-suzerain",
    commandId,
    actor: { kind: "system", id: "postwar-validation" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: { polityId, directSuzerainPolityId, reasonCode: "postwar.validation" }
  };
}

function postwarPreview(
  runtime: SimulationRuntimeV1,
  methods: readonly PostwarMethod[]
): PostwarPreviewResult {
  const queried = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.preview-m3-postwar-governance",
    payload: {
      queryId: "m3.postwar.preview",
      victorPolityId: 1,
      localPolityId: 2,
      districtId: 2,
      methods,
      months: 24
    }
  });
  expect(queried.status).toBe("ok");
  if (queried.status !== "ok" || queried.result.kind !== "sim.preview-m3-postwar-governance") {
    throw new Error("Expected M3 postwar preview query result.");
  }
  return queried.result;
}

function postwarOutcome(runtime: SimulationRuntimeV1): PostwarOutcomeResult["outcomes"][number] {
  const queried = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.compare-m3-postwar-governance-outcomes",
    payload: {
      queryId: "m3.postwar.outcome",
      victorPolityId: 1,
      localPolityId: 2,
      districtId: 2,
      months: 24
    }
  });
  expect(queried.status).toBe("ok");
  if (
    queried.status !== "ok" ||
    queried.result.kind !== "sim.compare-m3-postwar-governance-outcomes"
  ) {
    throw new Error("Expected M3 postwar outcome comparison query result.");
  }
  const outcome = queried.result.outcomes[0];
  if (outcome === undefined) {
    throw new Error("Expected one applied postwar outcome.");
  }
  return outcome;
}

function requireArrangement(
  preview: PostwarPreviewResult,
  method: PostwarMethod
): PostwarArrangementPreview {
  const arrangement = preview.arrangements.find((entry) => entry.method === method);
  if (arrangement === undefined) {
    throw new Error(`Missing arrangement ${method}.`);
  }
  return arrangement;
}

function accepted(runtime: SimulationRuntimeV1, command: unknown): SimulationRuntimeV1 {
  const submitted = submitCommandV1(runtime, command);
  expect(submitted.result.status).toBe("accepted");
  return submitted.runtime;
}

function controllerOf(world: WorldStateV0, districtId: number): number | null {
  const district = world.state.districts.find((entry) => entry.definitionId === districtId);
  if (district === undefined || district.control.kind === "uncontrolled") {
    return null;
  }
  return district.control.controllerPolityId;
}

function resourceTotals(runtime: SimulationRuntimeV1): {
  readonly grain: number;
  readonly cash: number;
} {
  const m2 = runtime.world.state.m2;
  if (m2 === undefined) {
    throw new Error("Expected M2 state.");
  }
  return m2.populationGroups.reduce(
    (totals, group) => ({
      grain: totals.grain + group.grainStock,
      cash: totals.cash + group.cashStock
    }),
    { grain: 0, cash: 0 }
  );
}

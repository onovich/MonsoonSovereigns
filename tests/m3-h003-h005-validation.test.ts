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
  type SimulationRuntimeV1,
  type WorldStateV0
} from "../packages/sim-core/src/index";
import {
  createM3AppointmentReadModelFixture,
  type ClientM3ReasonSummaryReadModel
} from "../packages/client-core/src/index";

describe("M3-H003-H005 validation evidence", () => {
  test("compares three postwar governance arrangements over 24 months with a dominance interpretation", () => {
    const runtime = bootPostwarRuntime();
    const preview = querySimulationV1(runtime, {
      schemaVersion: 1,
      kind: "sim.preview-m3-postwar-governance",
      payload: {
        queryId: "m3.h003.preview",
        victorPolityId: 1,
        localPolityId: 2,
        districtId: 2,
        methods: ["direct-control", "restore-vassal-ruler", "tribute-only"],
        months: 24
      }
    });
    expect(preview.status).toBe("ok");
    if (preview.status !== "ok" || preview.result.kind !== "sim.preview-m3-postwar-governance") {
      throw new Error("Expected M3 postwar governance preview result.");
    }

    const metrics = [
      appliedPostwarOutcome("direct-control"),
      appliedPostwarOutcome("restore-vassal-ruler"),
      appliedPostwarOutcome("tribute-only")
    ];
    expect(metrics).toHaveLength(3);

    const metricByMethod = new Map(metrics.map((entry) => [entry.method, entry]));
    const direct = metricByMethod.get("direct-control");
    const vassal = metricByMethod.get("restore-vassal-ruler");
    const tribute = metricByMethod.get("tribute-only");

    if (direct === undefined || vassal === undefined || tribute === undefined) {
      throw new Error("Missing one or more M3 postwar governance outcomes.");
    }

    expect(preview.result.arrangements.map((entry) => entry.method)).toEqual([
      "direct-control",
      "restore-vassal-ruler",
      "tribute-only"
    ]);
    expect(direct.totalExpectedIncomeCash).toBeGreaterThan(vassal.totalExpectedIncomeCash);
    expect(vassal.totalExpectedTributeCash).toBeGreaterThan(tribute.totalExpectedTributeCash);
    expect(direct.averageAdministrativeLoad).toBeGreaterThan(vassal.averageAdministrativeLoad);
    expect(vassal.averageReliabilityBps).toBeGreaterThan(tribute.averageReliabilityBps);
    expect(vassal.totalMilitaryContributionTroops).toBeGreaterThan(
      tribute.totalMilitaryContributionTroops
    );

    const winners = new Set([
      winnerForMetric(metrics, "totalExpectedIncomeCash"),
      winnerForMetric(metrics, "totalExpectedTributeCash"),
      winnerForMetric(metrics, "averageAdministrativeLoad", "lowest"),
      winnerForMetric(metrics, "averageReliabilityBps"),
      winnerForMetric(metrics, "totalMilitaryContributionTroops"),
      winnerForMetric(metrics, "averageRiskBps", "lowest")
    ]);

    expect(winners.size).toBeGreaterThan(1);
    expect(winners.has("direct-control")).toBe(true);
    expect(winners.has("restore-vassal-ruler")).toBe(true);
    expect(direct.averageRiskBps).not.toBe(tribute.averageRiskBps);
  });

  test("shows proposal usefulness but not always optimal, with visible reason-code coverage", () => {
    const strongerSkill = appointAndScaffold(1);
    const supportiveMilitary = appointAndScaffold(2);

    expect(strongerSkill.reasonCodes).toContain("appointment.holder.skill-strong");
    expect(strongerSkill.reasonCodes).toContain("appointment.relationship.strained");
    expect(supportiveMilitary.reasonCodes).toContain("appointment.holder.skill-weak");
    expect(supportiveMilitary.reasonCodes).toContain("appointment.relationship.supportive");
    expect(supportiveMilitary.reasonCodes).toContain("policy.office.military");
    expect(supportiveMilitary.executionPerformanceBps).toBeGreaterThan(
      strongerSkill.executionPerformanceBps
    );

    const snapshot = createM3AppointmentReadModelFixture();
    const coverage = summarizeReasonCoverage(snapshot.reasonSummaries);

    expect(coverage.uniqueReasonCodes).toBeGreaterThanOrEqual(8);
    expect(coverage.sourceKinds).toEqual([
      "appointment",
      "behavior",
      "bulk",
      "enfeoffment",
      "obligation",
      "policy",
      "succession"
    ]);
    expect(
      snapshot.reasonSummaries.some((summary) => summary.reasonCode === "character-unavailable")
    ).toBe(true);
    expect(
      snapshot.reasonSummaries.some(
        (summary) => summary.reasonCode === "appointment.holder.skill-strong"
      )
    ).toBe(true);
    expect(
      snapshot.reasonSummaries.some((summary) => summary.reasonCode === "appointment.command-fit")
    ).toBe(true);
  });
});

type PostwarMethod = "direct-control" | "restore-vassal-ruler" | "tribute-only";

interface PostwarRuntimeSummary {
  readonly method: PostwarMethod;
  readonly totalExpectedIncomeCash: number;
  readonly totalExpectedTributeCash: number;
  readonly averageAdministrativeLoad: number;
  readonly averageReliabilityBps: number;
  readonly totalMilitaryContributionTroops: number;
  readonly averageRiskBps: number;
}

interface ReasonCoverageSummary {
  readonly uniqueReasonCodes: number;
  readonly sourceKinds: readonly ClientM3ReasonSummaryReadModel["sourceKinds"][number][];
}

function bootPostwarRuntime(): SimulationRuntimeV1 {
  return {
    world: createPostwarWorld(),
    acceptedCommandIds: [],
    commandTail: [],
    eventTail: []
  };
}

function bootReasonRuntime(): SimulationRuntimeV1 {
  return {
    world: createReasonWorld(),
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
          currentDistrictId: 2,
          commandBps: 6_800,
          administrationBps: 6_800,
          diplomacyBps: 6_800
        }
      ],
      relationships: [
        { sourceCharacterId: 1, targetCharacterId: 2, affinityBps: -500 },
        { sourceCharacterId: 2, targetCharacterId: 1, affinityBps: 500 }
      ],
      offices: [
        {
          officeId: 1,
          polityId: 1,
          jurisdiction: { kind: "polity", polityId: 1 },
          officeKind: "minister",
          primary: true,
          holderCharacterId: null,
          policyId: 101,
          minimumCommandBps: 0,
          minimumAdministrationBps: 4_000
        }
      ],
      policies: [
        {
          policyId: 101,
          target: { kind: "office", officeId: 1 },
          stance: "military",
          intensityBps: 5_000
        },
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

function appointAndScaffold(characterId: number): {
  readonly executionPerformanceBps: number;
  readonly reasonCodes: readonly string[];
} {
  const runtime = bootReasonRuntime();
  const submitted = submitCommandV1(runtime, {
    schemaVersion: 1,
    kind: "sim.appoint-office",
    commandId: `m3.h005.${characterId}`,
    actor: { kind: "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      officeId: 1,
      characterId,
      reasonCode: "validation"
    }
  });

  expect(submitted.result.status).toBe("accepted");
  if (submitted.result.status !== "accepted") {
    throw new Error("Expected appointment command to be accepted.");
  }

  const queried = querySimulationV1(submitted.runtime, {
    schemaVersion: 1,
    kind: "sim.list-m3-decision-scaffolds"
  });
  expect(queried.status).toBe("ok");
  if (queried.status !== "ok" || queried.result.kind !== "sim.list-m3-decision-scaffolds") {
    throw new Error("Expected M3 decision scaffold query result.");
  }

  const office = queried.result.offices.find((entry) => entry.officeId === 1);
  if (office === undefined) {
    throw new Error("Expected an office 1 decision scaffold.");
  }

  return {
    executionPerformanceBps: office.executionPerformanceBps,
    reasonCodes: office.reasonCodes
  };
}

function createReasonWorld(): WorldStateV0 {
  const definitions = {
    polities: [
      definePolity({ id: 1, displayNameKey: "content.m3.reason.polity_001" }),
      definePolity({ id: 2, displayNameKey: "content.m3.reason.polity_002" })
    ],
    persons: [
      definePerson({ id: 1, displayNameKey: "content.m3.reason.character_001" }),
      definePerson({ id: 2, displayNameKey: "content.m3.reason.character_002" })
    ],
    districts: [
      defineDistrict({ id: 1, displayNameKey: "content.m3.reason.district_001" }),
      defineDistrict({ id: 2, displayNameKey: "content.m3.reason.district_002" })
    ],
    settlements: [],
    routes: []
  };

  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m3.reason.validation",
    currentDay: 0,
    revision: 0,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions),
    m3: createM3PolityVassalageStateV0(definitions, {
      polities: [
        { polityId: 1, directSuzerainPolityId: null },
        { polityId: 2, directSuzerainPolityId: null }
      ],
      characters: [
        {
          characterId: 1,
          polityId: 1,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 7_000,
          administrationBps: 7_000,
          diplomacyBps: 7_500
        },
        {
          characterId: 2,
          polityId: 1,
          alive: true,
          incapacitated: false,
          currentDistrictId: 2,
          commandBps: 6_800,
          administrationBps: 6_800,
          diplomacyBps: 6_800
        }
      ],
      relationships: [
        { sourceCharacterId: 1, targetCharacterId: 2, affinityBps: -500 },
        { sourceCharacterId: 2, targetCharacterId: 1, affinityBps: 500 }
      ],
      offices: [
        {
          officeId: 1,
          polityId: 1,
          jurisdiction: { kind: "polity", polityId: 1 },
          officeKind: "minister",
          primary: true,
          holderCharacterId: null,
          policyId: 101,
          minimumCommandBps: 0,
          minimumAdministrationBps: 4_000
        }
      ],
      policies: [
        {
          policyId: 101,
          target: { kind: "office", officeId: 1 },
          stance: "military",
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
          polityId: 1,
          districtId: 2,
          controlMode: "direct",
          localComplexity: 80,
          communicationCost: 40,
          directness: 80,
          frontierPressure: 40,
          administrativeCapacity: 1_000
        }
      ]
    })
  });
}

function appliedPostwarOutcome(method: PostwarMethod): PostwarRuntimeSummary {
  const runtime = bootPostwarRuntime();
  const command = submitCommandV1(runtime, {
    schemaVersion: 1,
    kind: "sim.apply-m3-postwar-governance",
    commandId: `m3.h003.${method}`,
    actor: { kind: "player", id: "polity:1" },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      settlementId: "m3.h003.validation.target",
      victorPolityId: 1,
      localPolityId: 2,
      districtId: 2,
      method,
      localRulerCharacterId: method === "direct-control" ? null : 1,
      policyId: method === "restore-vassal-ruler" ? 201 : null,
      reasonCode: "validation"
    }
  });

  expect(command.result.status).toBe("accepted");
  if (command.result.status !== "accepted") {
    throw new Error(`Expected ${method} postwar governance command to be accepted.`);
  }

  const queried = querySimulationV1(command.runtime, {
    schemaVersion: 1,
    kind: "sim.compare-m3-postwar-governance-outcomes",
    payload: {
      queryId: `m3.h003.${method}.outcome`,
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
    throw new Error("Expected M3 postwar governance comparison result.");
  }

  const outcome = queried.result.outcomes[0];
  if (outcome === undefined) {
    throw new Error(`Missing M3 postwar outcome for ${method}.`);
  }

  return outcome as PostwarRuntimeSummary;
}

function summarizeReasonCoverage(
  reasonSummaries: readonly ClientM3ReasonSummaryReadModel[]
): ReasonCoverageSummary {
  const uniqueReasonCodes = new Set<string>();
  const sourceKinds = new Set<ClientM3ReasonSummaryReadModel["sourceKinds"][number]>();

  for (const summary of reasonSummaries) {
    uniqueReasonCodes.add(summary.reasonCode);
    for (const sourceKind of summary.sourceKinds) {
      sourceKinds.add(sourceKind);
    }
  }

  return {
    uniqueReasonCodes: uniqueReasonCodes.size,
    sourceKinds: [...sourceKinds].sort()
  };
}

function winnerForMetric(
  entries: readonly PostwarRuntimeSummary[],
  metric:
    | "totalExpectedIncomeCash"
    | "totalExpectedTributeCash"
    | "averageAdministrativeLoad"
    | "averageReliabilityBps"
    | "totalMilitaryContributionTroops"
    | "averageRiskBps",
  mode: "highest" | "lowest" = "highest"
): PostwarMethod {
  const first = entries[0];
  if (first === undefined) {
    throw new Error("Expected at least one postwar outcome entry.");
  }

  let winner = first;
  for (const entry of entries.slice(1)) {
    const left = entry[metric];
    const right = winner[metric];
    const isBetter = mode === "highest" ? left > right : left < right;
    if (isBetter || (left === right && entry.method < winner.method)) {
      winner = entry;
    }
  }

  return winner.method;
}

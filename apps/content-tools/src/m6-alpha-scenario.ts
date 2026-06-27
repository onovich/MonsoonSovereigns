import {
  parseM6AlphaScenarioSetSourceV0,
  validateM6AlphaScenarioSetSourceV0,
  type M6AlphaScenarioClaimRecordV0,
  type M6AlphaScenarioHistoricity,
  type M6AlphaScenarioRecordV0,
  type M6AlphaScenarioReferenceTargetsV0,
  type M6AlphaScenarioSetSourceV0
} from "@monsoon/content-schema";
import {
  parseM6AlphaScenarioManifestHash,
  parseRuntimeM6AlphaScenarioContentPackV0,
  type RuntimeM6AlphaScenarioContentPackV0
} from "@monsoon/content-runtime";

import type { ContentCompileError, ContentCompileResultV0 } from "./index.ts";

interface StableScenarioAssignment {
  readonly scenario: M6AlphaScenarioRecordV0;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;
const REQUIRED_HISTORICITIES: readonly M6AlphaScenarioHistoricity[] = [
  "HISTORICAL",
  "INFERRED",
  "COMPOSITE",
  "FICTIONAL"
];
const REFERENCE_SET_KEYS = [
  "diplomacy",
  "legitimacy",
  "succession",
  "mapCandidates",
  "policies",
  "events",
  "encyclopediaEntries",
  "startToVictoryFixtures"
] as const;

export function compileM6AlphaScenarioContentPackV0(input: unknown): ContentCompileResultV0 {
  const schemaErrors = validateM6AlphaScenarioSetSourceV0(input);
  if (schemaErrors.length > 0) {
    return {
      status: "error",
      errors: schemaErrors.map((error) => ({
        code: error.code,
        path: error.path,
        message: error.message
      }))
    };
  }

  const source = parseM6AlphaScenarioSetSourceV0(input);
  const semanticErrors = validateM6AlphaScenarioSemantics(source);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimeM6AlphaScenarioPack(source);
  return {
    status: "ok",
    pack: parseRuntimeM6AlphaScenarioContentPackV0(pack),
    errors: []
  };
}

function validateM6AlphaScenarioSemantics(
  source: M6AlphaScenarioSetSourceV0
): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.scenarios.length !== 3) {
    errors.push({
      code: "invalid-count",
      path: "scenarios",
      message: `M6 alpha scenario set must contain exactly 3 scenarios, received ${source.scenarios.length}.`
    });
  }

  validateStableOrderAndUniqueIds(source.sources, "sources", "sourceId", errors);
  validateStableOrderAndUniqueIds(source.claims, "claims", "claimId", errors);
  for (const key of REFERENCE_SET_KEYS) {
    validateStableOrderAndUniqueIds(
      source.referenceTargets[key],
      `referenceTargets.${key}`,
      "sourceId",
      errors
    );
  }
  validateStableOrderAndUniqueIds(source.scenarios, "scenarios", "sourceId", errors);
  validateUniqueScenarioKeys(source.scenarios, errors);
  validateDependencyOrder(source.scenarios, errors);
  validateClaimSources(source, errors);
  validateScenarioClaims(source, errors);
  validateReferenceTargets(source, errors);

  return errors;
}

function validateUniqueScenarioKeys(
  scenarios: readonly M6AlphaScenarioRecordV0[],
  errors: ContentCompileError[]
): void {
  const seen = new Set<string>();
  scenarios.forEach((scenario, index) => {
    if (seen.has(scenario.scenarioKey)) {
      errors.push({
        code: "duplicate-scenario-key",
        path: `scenarios[${index}].scenarioKey`,
        message: `Duplicate scenarioKey ${scenario.scenarioKey}.`
      });
    }
    seen.add(scenario.scenarioKey);
  });
}

function validateDependencyOrder(
  scenarios: readonly M6AlphaScenarioRecordV0[],
  errors: ContentCompileError[]
): void {
  let previousOrder = 0;
  scenarios.forEach((scenario, index) => {
    const expectedOrder = index + 1;
    if (scenario.dependencyOrder !== expectedOrder || scenario.dependencyOrder <= previousOrder) {
      errors.push({
        code: "unstable-order",
        path: `scenarios[${index}].dependencyOrder`,
        message: "M6 alpha scenarios must have contiguous dependencyOrder values in array order."
      });
    }
    previousOrder = scenario.dependencyOrder;
  });
}

function validateClaimSources(
  source: M6AlphaScenarioSetSourceV0,
  errors: ContentCompileError[]
): void {
  const sourceIds = new Set(source.sources.map((entry) => entry.sourceId));

  source.claims.forEach((claim, claimIndex) => {
    if (claim.historicity !== "FICTIONAL") {
      if (
        claim.sourceIds.length === 0 ||
        claim.sourcePassages.length === 0 ||
        hasEmptyString(claim.sourceIds) ||
        hasEmptyString(claim.sourcePassages)
      ) {
        errors.push({
          code: "unsourced-claim",
          path: `claims[${claimIndex}].sourceIds`,
          message: `Formal claim ${claim.claimId} must include non-empty sourceIds and sourcePassages.`
        });
      }
    }

    claim.sourceIds.forEach((sourceId, sourceIndex) => {
      if (!sourceIds.has(sourceId)) {
        errors.push({
          code: "bad-reference",
          path: `claims[${claimIndex}].sourceIds[${sourceIndex}]`,
          message: `Claim ${claim.claimId} references missing source ${sourceId}.`
        });
      }
    });
  });
}

function validateScenarioClaims(
  source: M6AlphaScenarioSetSourceV0,
  errors: ContentCompileError[]
): void {
  const claimById = new Map(source.claims.map((claim) => [claim.claimId, claim]));
  const coveredHistoricities = new Set<M6AlphaScenarioHistoricity>();

  source.scenarios.forEach((scenario, scenarioIndex) => {
    if (scenario.materialClaimIds.length === 0) {
      errors.push({
        code: "missing-label",
        path: `scenarios[${scenarioIndex}].materialClaimIds`,
        message: `Scenario ${scenario.sourceId} must reference labeled material claims.`
      });
    }

    scenario.materialClaimIds.forEach((claimId, claimIndex) => {
      const claim = claimById.get(claimId);
      if (claim === undefined) {
        errors.push({
          code: "bad-reference",
          path: `scenarios[${scenarioIndex}].materialClaimIds[${claimIndex}]`,
          message: `Scenario ${scenario.sourceId} references missing claim ${claimId}.`
        });
        return;
      }
      coveredHistoricities.add(claim.historicity);
    });
  });

  for (const historicity of REQUIRED_HISTORICITIES) {
    if (!coveredHistoricities.has(historicity)) {
      errors.push({
        code: "missing-label",
        path: "claims",
        message: `M6 alpha scenario set must include referenced ${historicity} material.`
      });
    }
  }
}

function validateReferenceTargets(
  source: M6AlphaScenarioSetSourceV0,
  errors: ContentCompileError[]
): void {
  const claimIds = new Set(source.claims.map((claim) => claim.claimId));
  for (const key of REFERENCE_SET_KEYS) {
    source.referenceTargets[key].forEach((target, targetIndex) => {
      if (target.claimId !== null && !claimIds.has(target.claimId)) {
        errors.push({
          code: "bad-reference",
          path: `referenceTargets.${key}[${targetIndex}].claimId`,
          message: `Reference target ${target.sourceId} references missing claim ${target.claimId}.`
        });
      }
    });
  }

  source.scenarios.forEach((scenario, scenarioIndex) => {
    for (const key of REFERENCE_SET_KEYS) {
      const validIds = new Set(source.referenceTargets[key].map((target) => target.sourceId));
      scenario.references[key].forEach((referenceId, referenceIndex) => {
        if (!validIds.has(referenceId)) {
          errors.push({
            code: "bad-reference",
            path: `scenarios[${scenarioIndex}].references.${key}[${referenceIndex}]`,
            message: `Scenario ${scenario.sourceId} references missing ${key} target ${referenceId}.`
          });
        }
      });
    }
  });
}

function buildRuntimeM6AlphaScenarioPack(
  source: M6AlphaScenarioSetSourceV0
): RuntimeM6AlphaScenarioContentPackV0 {
  const sources = sortByKey(source.sources, "sourceId");
  const claims = sortByKey(source.claims, "claimId");
  const referenceTargets = sortReferenceTargets(source.referenceTargets);
  const scenarios = assignScenarios(source.scenarios).map((assignment) => assignment.scenario);
  const manifestHash = hashM6AlphaScenarioManifest(
    source.fixtureId,
    sources,
    claims,
    referenceTargets,
    scenarios
  );

  return {
    schemaVersion: 1,
    kind: "runtime-m6-alpha-scenario-content-pack-v0",
    fixtureId: source.fixtureId,
    manifest: {
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: source.fixtureKind,
      syntheticScope: source.syntheticScope,
      manifestHash: parseM6AlphaScenarioManifestHash(manifestHash),
      sourceCount: sources.length,
      claimCount: claims.length,
      referenceTargetCount: countReferenceTargets(referenceTargets),
      scenarioCount: scenarios.length
    },
    sources,
    claims,
    referenceTargets,
    scenarios
  };
}

function assignScenarios(
  scenarios: readonly M6AlphaScenarioRecordV0[]
): readonly StableScenarioAssignment[] {
  return sortByKey(scenarios, "sourceId").map((scenario) => ({ scenario }));
}

function sortReferenceTargets(
  referenceTargets: M6AlphaScenarioReferenceTargetsV0
): M6AlphaScenarioReferenceTargetsV0 {
  return {
    diplomacy: sortByKey(referenceTargets.diplomacy, "sourceId"),
    legitimacy: sortByKey(referenceTargets.legitimacy, "sourceId"),
    succession: sortByKey(referenceTargets.succession, "sourceId"),
    mapCandidates: sortByKey(referenceTargets.mapCandidates, "sourceId"),
    policies: sortByKey(referenceTargets.policies, "sourceId"),
    events: sortByKey(referenceTargets.events, "sourceId"),
    encyclopediaEntries: sortByKey(referenceTargets.encyclopediaEntries, "sourceId"),
    startToVictoryFixtures: sortByKey(referenceTargets.startToVictoryFixtures, "sourceId")
  };
}

function countReferenceTargets(referenceTargets: M6AlphaScenarioReferenceTargetsV0): number {
  return REFERENCE_SET_KEYS.reduce((count, key) => count + referenceTargets[key].length, 0);
}

function validateStableOrderAndUniqueIds<TEntry extends Record<TKey, string>, TKey extends string>(
  entries: readonly TEntry[],
  path: string,
  key: TKey,
  errors: ContentCompileError[]
): void {
  const seen = new Set<string>();
  let previousId = "";
  entries.forEach((entry, index) => {
    const id = entry[key];
    if (seen.has(id)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}[${index}].${key}`,
        message: `Duplicate ${path} ${key} ${id}.`
      });
    }
    if (index > 0 && compareText(id, previousId) <= 0) {
      errors.push({
        code: "unstable-order",
        path: `${path}[${index}].${key}`,
        message: `${path} must be sorted by ${key} for deterministic manifest output.`
      });
    }
    seen.add(id);
    previousId = id;
  });
}

function sortByKey<TEntry extends Record<TKey, string>, TKey extends string>(
  values: readonly TEntry[],
  key: TKey
): readonly TEntry[] {
  return [...values].sort((left, right) => compareText(left[key], right[key]));
}

function hashM6AlphaScenarioManifest(
  fixtureId: string,
  sources: readonly M6AlphaScenarioSetSourceV0["sources"][number][],
  claims: readonly M6AlphaScenarioClaimRecordV0[],
  referenceTargets: M6AlphaScenarioReferenceTargetsV0,
  scenarios: readonly M6AlphaScenarioRecordV0[]
): string {
  return toFixedHexHash(
    hashText(
      [
        "runtime-m6-alpha-scenario-content-pack-v0",
        `fixtureId=${fixtureId}`,
        `sources=${sources
          .map(
            (source) =>
              `${source.sourceId}:${source.sourceType}:${source.citationKey}:${source.accessNote}`
          )
          .join(",")}`,
        `claims=${claims
          .map(
            (claim) =>
              `${claim.claimId}:${claim.claim}:${claim.historicity}:${claim.confidence}:${claim.sourceIds.join("|")}:${claim.sourcePassages.join("|")}:${claim.competingInterpretations.join("|")}:${claim.researchStatus}:${claim.gameAbstraction}`
          )
          .join(",")}`,
        `referenceTargets=${REFERENCE_SET_KEYS.map(
          (key) =>
            `${key}=${referenceTargets[key]
              .map(
                (target) =>
                  `${target.sourceId}:${target.displayNameKey}:${target.claimId ?? "null"}`
              )
              .join("|")}`
        ).join(",")}`,
        `scenarios=${scenarios
          .map(
            (scenario) =>
              `${scenario.sourceId}:${scenario.scenarioKey}:${scenario.displayNameKey}:${scenario.startYear}:${scenario.dependencyOrder}:${scenario.historicity}:${scenario.materialClaimIds.join("|")}:${REFERENCE_SET_KEYS.map((key) => `${key}=${scenario.references[key].join("|")}`).join(";")}`
          )
          .join(",")}`
      ].join("\n")
    )
  );
}

function hashText(text: string): number {
  let hash = INITIAL_HASH_OFFSET;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, HASH_PRIME) >>> 0;
  }
  return hash;
}

function toFixedHexHash(hash: number): string {
  return hash.toString(16).padStart(8, "0");
}

function compareText(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function hasEmptyString(values: readonly string[]): boolean {
  return values.some((value) => value.length === 0);
}

import {
  parseM7BetaScenarioPersonEventSetSourceV0,
  validateM7BetaScenarioPersonEventSetSourceV0,
  type M7BetaClaimRecordV0,
  type M7BetaEventRecordV0,
  type M7BetaLocalizationRecordV0,
  type M7BetaPersonRecordV0,
  type M7BetaScenarioPersonEventSetSourceV0,
  type M7BetaScenarioRecordV0,
  type M7BetaSourceRecordV0,
  type M7BetaTitleRecordV0
} from "@monsoon/content-schema";
import {
  parseM7BetaScenarioManifestHash,
  parseRuntimeM7BetaScenarioPersonEventContentPackV0,
  type RuntimeM7BetaScenarioPersonEventContentPackV0
} from "@monsoon/content-runtime";

import type { ContentCompileError, ContentCompileResultV0 } from "./index.ts";

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function compileM7BetaScenarioPersonEventContentPackV0(
  input: unknown
): ContentCompileResultV0 {
  const schemaErrors = validateM7BetaScenarioPersonEventSetSourceV0(input);
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

  const source = parseM7BetaScenarioPersonEventSetSourceV0(input);
  const semanticErrors = validateM7BetaSemantics(source);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimeM7BetaPack(source);
  return {
    status: "ok",
    pack: parseRuntimeM7BetaScenarioPersonEventContentPackV0(pack),
    errors: []
  };
}

function validateM7BetaSemantics(
  source: M7BetaScenarioPersonEventSetSourceV0
): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.scenarios.length !== 3) {
    errors.push({
      code: "invalid-count",
      path: "scenarios",
      message: `M7 beta set must contain exactly 3 contracted scenarios, received ${source.scenarios.length}.`
    });
  }
  if (source.persons.length < 6) {
    errors.push({
      code: "invalid-count",
      path: "persons",
      message: "M7 beta set must contain at least 6 contracted person records."
    });
  }
  if (source.events.length < 4) {
    errors.push({
      code: "invalid-count",
      path: "events",
      message: "M7 beta set must contain at least 4 contracted event records."
    });
  }
  if (source.knownGaps.length === 0) {
    errors.push({
      code: "missing-label",
      path: "knownGaps",
      message: "M7 beta fill must record known gaps instead of hiding placeholders."
    });
  }

  validateStableOrderAndUniqueIds(source.sourceRecords, "sourceRecords", "sourceId", errors);
  validateStableOrderAndUniqueIds(source.claimRecords, "claimRecords", "claimId", errors);
  validateStableOrderAndUniqueIds(source.localization, "localization", "key", errors);
  validateStableOrderAndUniqueIds(source.titles, "titles", "titleId", errors);
  validateStableOrderAndUniqueIds(source.persons, "persons", "personId", errors);
  validateStableOrderAndUniqueIds(source.events, "events", "eventId", errors);
  validateStableOrderAndUniqueIds(source.scenarios, "scenarios", "scenarioId", errors);
  validateContiguousOrder(source.localization, "localization", errors);
  validateContiguousOrder(source.titles, "titles", errors);
  validateContiguousOrder(source.persons, "persons", errors);
  validateContiguousOrder(source.events, "events", errors);
  validateContiguousOrder(source.scenarios, "scenarios", errors);
  validateClaimSources(source, errors);
  validateContentReferences(source, errors);
  validateViolenceCostRecords(source.events, errors);
  validateNoFormalContentLock(source, errors);

  return errors;
}

function validateClaimSources(
  source: M7BetaScenarioPersonEventSetSourceV0,
  errors: ContentCompileError[]
): void {
  const sourceIds = new Set(source.sourceRecords.map((entry) => entry.sourceId));
  source.claimRecords.forEach((claim, claimIndex) => {
    if (
      claim.label !== "FICTIONAL" &&
      (claim.sourceIds.length === 0 || claim.sourcePassages.length === 0)
    ) {
      errors.push({
        code: "unsourced-claim",
        path: `claimRecords[${claimIndex}].sourceIds`,
        message: `M7 claim ${claim.claimId} must include sourceIds and sourcePassages.`
      });
    }
    claim.sourceIds.forEach((sourceId, sourceIndex) => {
      if (!sourceIds.has(sourceId)) {
        errors.push({
          code: "bad-reference",
          path: `claimRecords[${claimIndex}].sourceIds[${sourceIndex}]`,
          message: `Claim ${claim.claimId} references missing source ${sourceId}.`
        });
      }
    });
  });
}

function validateContentReferences(
  source: M7BetaScenarioPersonEventSetSourceV0,
  errors: ContentCompileError[]
): void {
  const sourceIds = new Set(source.sourceRecords.map((entry) => entry.sourceId));
  const claimIds = new Set(source.claimRecords.map((entry) => entry.claimId));
  const localizationKeys = new Set(source.localization.map((entry) => entry.key));
  const titleIds = new Set(source.titles.map((entry) => entry.titleId));
  const personIds = new Set(source.persons.map((entry) => entry.personId));
  const eventIds = new Set(source.events.map((entry) => entry.eventId));
  const scenarioIds = new Set(source.scenarios.map((entry) => entry.scenarioId));

  source.localization.forEach((entry, index) => {
    validateSourceAndClaimRefs(
      entry.sourceIds,
      entry.claimIds,
      sourceIds,
      claimIds,
      `localization[${index}]`,
      errors
    );
  });
  source.titles.forEach((title, index) => {
    validateSourceAndClaimRefs(
      title.sourceIds,
      title.claimIds,
      sourceIds,
      claimIds,
      `titles[${index}]`,
      errors
    );
    validateSetRef(
      localizationKeys,
      title.localizationKey,
      `titles[${index}].localizationKey`,
      errors
    );
  });
  source.persons.forEach((person, index) => {
    validateSourceAndClaimRefs(
      person.sourceIds,
      person.claimIds,
      sourceIds,
      claimIds,
      `persons[${index}]`,
      errors
    );
    validateSetRef(
      localizationKeys,
      person.displayNameKey,
      `persons[${index}].displayNameKey`,
      errors
    );
    person.titleIds.forEach((titleId, titleIndex) =>
      validateSetRef(titleIds, titleId, `persons[${index}].titleIds[${titleIndex}]`, errors)
    );
    person.scenarioIds.forEach((scenarioId, scenarioIndex) =>
      validateSetRef(
        scenarioIds,
        scenarioId,
        `persons[${index}].scenarioIds[${scenarioIndex}]`,
        errors
      )
    );
  });
  source.events.forEach((event, index) => {
    validateSourceAndClaimRefs(
      event.sourceIds,
      event.claimIds,
      sourceIds,
      claimIds,
      `events[${index}]`,
      errors
    );
    validateSetRef(
      localizationKeys,
      event.localizationKey,
      `events[${index}].localizationKey`,
      errors
    );
    event.scenarioIds.forEach((scenarioId, scenarioIndex) =>
      validateSetRef(
        scenarioIds,
        scenarioId,
        `events[${index}].scenarioIds[${scenarioIndex}]`,
        errors
      )
    );
    event.personIds.forEach((personId, personIndex) =>
      validateSetRef(personIds, personId, `events[${index}].personIds[${personIndex}]`, errors)
    );
    event.titleIds.forEach((titleId, titleIndex) =>
      validateSetRef(titleIds, titleId, `events[${index}].titleIds[${titleIndex}]`, errors)
    );
    event.choices.forEach((choice, choiceIndex) => {
      validateSetRef(
        localizationKeys,
        choice.localizationKey,
        `events[${index}].choices[${choiceIndex}].localizationKey`,
        errors
      );
      validateSetRef(
        localizationKeys,
        choice.aiReasonKey,
        `events[${index}].choices[${choiceIndex}].aiReasonKey`,
        errors
      );
      validateSetRef(
        localizationKeys,
        choice.costSummaryKey,
        `events[${index}].choices[${choiceIndex}].costSummaryKey`,
        errors
      );
    });
  });
  source.scenarios.forEach((scenario, index) => {
    validateSourceAndClaimRefs(
      scenario.sourceIds,
      scenario.claimIds,
      sourceIds,
      claimIds,
      `scenarios[${index}]`,
      errors
    );
    validateSetRef(
      localizationKeys,
      scenario.displayNameKey,
      `scenarios[${index}].displayNameKey`,
      errors
    );
    scenario.personIds.forEach((personId, personIndex) =>
      validateSetRef(personIds, personId, `scenarios[${index}].personIds[${personIndex}]`, errors)
    );
    scenario.titleIds.forEach((titleId, titleIndex) =>
      validateSetRef(titleIds, titleId, `scenarios[${index}].titleIds[${titleIndex}]`, errors)
    );
    scenario.eventIds.forEach((eventId, eventIndex) =>
      validateSetRef(eventIds, eventId, `scenarios[${index}].eventIds[${eventIndex}]`, errors)
    );
    scenario.localizationKeys.forEach((key, keyIndex) =>
      validateSetRef(
        localizationKeys,
        key,
        `scenarios[${index}].localizationKeys[${keyIndex}]`,
        errors
      )
    );
    scenario.hooks.forEach((hook, hookIndex) => {
      validateSetRef(
        localizationKeys,
        hook.localizationKey,
        `scenarios[${index}].hooks[${hookIndex}].localizationKey`,
        errors
      );
    });
  });
}

function validateSourceAndClaimRefs(
  referencedSourceIds: readonly string[],
  referencedClaimIds: readonly string[],
  sourceIds: ReadonlySet<string>,
  claimIds: ReadonlySet<string>,
  path: string,
  errors: ContentCompileError[]
): void {
  referencedSourceIds.forEach((sourceId, sourceIndex) =>
    validateSetRef(sourceIds, sourceId, `${path}.sourceIds[${sourceIndex}]`, errors)
  );
  referencedClaimIds.forEach((claimId, claimIndex) =>
    validateSetRef(claimIds, claimId, `${path}.claimIds[${claimIndex}]`, errors)
  );
}

function validateSetRef(
  validIds: ReadonlySet<string>,
  value: string,
  path: string,
  errors: ContentCompileError[]
): void {
  if (validIds.has(value)) {
    return;
  }
  errors.push({
    code: "bad-reference",
    path,
    message: `M7 beta content references missing id ${value}.`
  });
}

function validateViolenceCostRecords(
  events: readonly M7BetaEventRecordV0[],
  errors: ContentCompileError[]
): void {
  events.forEach((event, index) => {
    if (
      event.eventId.includes("coercion") ||
      event.eventId.includes("famine") ||
      event.eventId.includes("forced")
    ) {
      if (event.violenceCostRecord === null) {
        errors.push({
          code: "missing-label",
          path: `events[${index}].violenceCostRecord`,
          message: `High-risk event ${event.eventId} must record victims and long-term consequences.`
        });
      }
      return;
    }
    if (event.violenceCostRecord !== null) {
      const record = event.violenceCostRecord;
      if (
        record.victimGroups.length === 0 ||
        record.sourceRegions.length === 0 ||
        record.immediateCosts.length === 0 ||
        record.longTermConsequences.length === 0
      ) {
        errors.push({
          code: "missing-label",
          path: `events[${index}].violenceCostRecord`,
          message: `Violence-cost record for ${event.eventId} must include victims, regions, immediate costs, and long-term consequences.`
        });
      }
    }
  });
}

function validateNoFormalContentLock(
  source: M7BetaScenarioPersonEventSetSourceV0,
  errors: ContentCompileError[]
): void {
  const lockCandidateCount = [
    ...source.localization,
    ...source.titles,
    ...source.persons,
    ...source.events,
    ...source.scenarios
  ].filter((entry) => entry.reviewState === "LOCK_CANDIDATE").length;
  if (lockCandidateCount > 0) {
    errors.push({
      code: "missing-label",
      path: "reviewState",
      message: "M7 scenario/person/event fill cannot mark records as LOCK_CANDIDATE."
    });
  }
}

function buildRuntimeM7BetaPack(
  source: M7BetaScenarioPersonEventSetSourceV0
): RuntimeM7BetaScenarioPersonEventContentPackV0 {
  const sourceRecords = sortByKey(source.sourceRecords, "sourceId");
  const claimRecords = sortByKey(source.claimRecords, "claimId");
  const localization = sortByKey(source.localization, "key");
  const titles = sortByKey(source.titles, "titleId");
  const persons = sortByKey(source.persons, "personId");
  const events = sortByKey(source.events, "eventId");
  const scenarios = sortByKey(source.scenarios, "scenarioId");
  const knownGaps = [...source.knownGaps].sort(compareText);
  const manifestHash = hashM7BetaManifest(
    source.fixtureId,
    sourceRecords,
    claimRecords,
    localization,
    titles,
    persons,
    events,
    scenarios,
    knownGaps
  );

  return {
    schemaVersion: 1,
    kind: "runtime-m7-beta-scenario-person-event-content-pack-v0",
    fixtureId: source.fixtureId,
    notContentLockAcceptance: true,
    m6GateCarryForward: "PASS_WITH_LIMITS",
    manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE",
    manifest: {
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: source.fixtureKind,
      contentScope: source.contentScope,
      manifestHash: parseM7BetaScenarioManifestHash(manifestHash),
      sourceCount: sourceRecords.length,
      claimCount: claimRecords.length,
      localizationCount: localization.length,
      titleCount: titles.length,
      personCount: persons.length,
      eventCount: events.length,
      scenarioCount: scenarios.length,
      knownGapCount: knownGaps.length
    },
    sourceRecords,
    claimRecords,
    localization,
    titles,
    persons,
    events,
    scenarios,
    knownGaps
  };
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
        message: `Duplicate M7 ${path} ${key} ${id}.`
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

function validateContiguousOrder(
  entries: readonly { readonly deterministicOrder: number }[],
  path: string,
  errors: ContentCompileError[]
): void {
  let previousOrder = 0;
  entries.forEach((entry, index) => {
    const expectedOrder = index + 1;
    if (entry.deterministicOrder !== expectedOrder || entry.deterministicOrder <= previousOrder) {
      errors.push({
        code: "unstable-order",
        path: `${path}[${index}].deterministicOrder`,
        message: `${path} deterministicOrder must be contiguous in array order.`
      });
    }
    previousOrder = entry.deterministicOrder;
  });
}

function sortByKey<TEntry extends Record<TKey, string>, TKey extends string>(
  values: readonly TEntry[],
  key: TKey
): readonly TEntry[] {
  return [...values].sort((left, right) => compareText(left[key], right[key]));
}

function hashM7BetaManifest(
  fixtureId: string,
  sourceRecords: readonly M7BetaSourceRecordV0[],
  claimRecords: readonly M7BetaClaimRecordV0[],
  localization: readonly M7BetaLocalizationRecordV0[],
  titles: readonly M7BetaTitleRecordV0[],
  persons: readonly M7BetaPersonRecordV0[],
  events: readonly M7BetaEventRecordV0[],
  scenarios: readonly M7BetaScenarioRecordV0[],
  knownGaps: readonly string[]
): string {
  return toFixedHexHash(
    hashText(
      [
        "runtime-m7-beta-scenario-person-event-content-pack-v0",
        `fixtureId=${fixtureId}`,
        `sources=${sourceRecords
          .map(
            (source) =>
              `${source.sourceId}:${source.sourceClass}:${source.citation}:${source.accessStatus}:${source.pageOrSection}:${source.formalUse}`
          )
          .join(",")}`,
        `claims=${claimRecords
          .map(
            (claim) =>
              `${claim.claimId}:${claim.claim}:${claim.label}:${claim.confidence}:${claim.sourceIds.join("|")}:${claim.sourcePassages.join("|")}:${claim.sourceStatements.join("|")}:${claim.scholarlyInterpretations.join("|")}:${claim.researcherInference}:${claim.competingInterpretations.join("|")}:${claim.gameAbstraction}:${claim.researchStatus}:${claim.humanGate}`
          )
          .join(",")}`,
        `localization=${localization
          .map(
            (entry) =>
              `${entry.key}:${entry.zhHans}:${entry.english}:${entry.sourceNote}:${entry.context}:${entry.characterLimit}:${entry.sourceIds.join("|")}:${entry.claimIds.join("|")}:${entry.reviewState}:${entry.owner}:${entry.deterministicOrder}`
          )
          .join(",")}`,
        `titles=${titles
          .map(
            (title) =>
              `${title.titleId}:${title.localizationKey}:${title.label}:${title.confidence}:${title.sourceIds.join("|")}:${title.claimIds.join("|")}:${title.reviewState}:${title.owner}:${title.deterministicOrder}`
          )
          .join(",")}`,
        `persons=${persons
          .map(
            (person) =>
              `${person.personId}:${person.displayNameKey}:${person.titleIds.join("|")}:${person.label}:${person.confidence}:${person.sourceIds.join("|")}:${person.claimIds.join("|")}:${person.reviewState}:${person.owner}:${person.scenarioIds.join("|")}:${person.roleTag}:${person.deterministicOrder}`
          )
          .join(",")}`,
        `events=${events.map(formatEventForHash).join(",")}`,
        `scenarios=${scenarios.map(formatScenarioForHash).join(",")}`,
        `knownGaps=${knownGaps.join("|")}`
      ].join("\n")
    )
  );
}

function formatEventForHash(event: M7BetaEventRecordV0): string {
  return [
    event.eventId,
    event.localizationKey,
    event.label,
    event.confidence,
    event.sourceIds.join("|"),
    event.claimIds.join("|"),
    event.reviewState,
    event.owner,
    event.triggerKey,
    event.scenarioIds.join("|"),
    event.personIds.join("|"),
    event.titleIds.join("|"),
    event.choices
      .map(
        (choice) =>
          `${choice.choiceId}:${choice.localizationKey}:${choice.aiReasonKey}:${choice.costSummaryKey}`
      )
      .join("|"),
    event.violenceCostRecord === null
      ? "null"
      : `${event.violenceCostRecord.victimGroups.join("|")}:${event.violenceCostRecord.sourceRegions.join("|")}:${event.violenceCostRecord.immediateCosts.join("|")}:${event.violenceCostRecord.longTermConsequences.join("|")}:${event.violenceCostRecord.reviewState}`,
    `${event.deterministicOrder}`
  ].join(":");
}

function formatScenarioForHash(scenario: M7BetaScenarioRecordV0): string {
  return [
    scenario.scenarioId,
    scenario.scenarioKey,
    scenario.displayNameKey,
    `${scenario.startYear}`,
    scenario.label,
    scenario.confidence,
    scenario.sourceIds.join("|"),
    scenario.claimIds.join("|"),
    scenario.reviewState,
    scenario.owner,
    scenario.personIds.join("|"),
    scenario.titleIds.join("|"),
    scenario.eventIds.join("|"),
    scenario.localizationKeys.join("|"),
    scenario.hooks
      .map(
        (hook) =>
          `${hook.hookId}:${hook.hookKind}:${hook.localizationKey}:${hook.targetIds.join("|")}`
      )
      .join("|"),
    `${scenario.deterministicOrder}`
  ].join(":");
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

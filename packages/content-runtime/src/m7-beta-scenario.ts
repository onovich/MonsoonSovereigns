import type {
  M7BetaClaimRecordV0,
  M7BetaConfidence,
  M7BetaEventChoiceRecordV0,
  M7BetaEventRecordV0,
  M7BetaLabel,
  M7BetaLocalizationRecordV0,
  M7BetaPersonRecordV0,
  M7BetaResearchStatus,
  M7BetaReviewState,
  M7BetaScenarioHookRecordV0,
  M7BetaScenarioRecordV0,
  M7BetaSourceClass,
  M7BetaSourceRecordV0,
  M7BetaTitleRecordV0,
  M7BetaViolenceCostRecordV0
} from "@monsoon/content-schema";

export type M7BetaScenarioManifestHash = string & {
  readonly __brand: "M7BetaScenarioManifestHash";
};

export interface RuntimeM7BetaScenarioPersonEventManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: "beta-scenario-person-event-set";
  readonly contentScope: "m7-beta-content-fill";
  readonly manifestHash: M7BetaScenarioManifestHash;
  readonly sourceCount: number;
  readonly claimCount: number;
  readonly localizationCount: number;
  readonly titleCount: number;
  readonly personCount: number;
  readonly eventCount: number;
  readonly scenarioCount: number;
  readonly knownGapCount: number;
}

export interface RuntimeM7BetaScenarioPersonEventContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m7-beta-scenario-person-event-content-pack-v0";
  readonly fixtureId: string;
  readonly notContentLockAcceptance: true;
  readonly m6GateCarryForward: "PASS_WITH_LIMITS";
  readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
  readonly manifest: RuntimeM7BetaScenarioPersonEventManifestV0;
  readonly sourceRecords: readonly M7BetaSourceRecordV0[];
  readonly claimRecords: readonly M7BetaClaimRecordV0[];
  readonly localization: readonly M7BetaLocalizationRecordV0[];
  readonly titles: readonly M7BetaTitleRecordV0[];
  readonly persons: readonly M7BetaPersonRecordV0[];
  readonly events: readonly M7BetaEventRecordV0[];
  readonly scenarios: readonly M7BetaScenarioRecordV0[];
  readonly knownGaps: readonly string[];
}

export interface RuntimeM7BetaScenarioPersonEventContentPackIndexV0 {
  readonly pack: RuntimeM7BetaScenarioPersonEventContentPackV0;
  getScenario(scenarioId: string): M7BetaScenarioRecordV0 | undefined;
  getPerson(personId: string): M7BetaPersonRecordV0 | undefined;
  getEvent(eventId: string): M7BetaEventRecordV0 | undefined;
  getClaim(claimId: string): M7BetaClaimRecordV0 | undefined;
}

interface RuntimeValidationError {
  readonly path: string;
  readonly message: string;
}

interface RuntimeCommonContentFields {
  readonly label: M7BetaLabel;
  readonly confidence: M7BetaConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: M7BetaReviewState;
  readonly owner: string;
  readonly deterministicOrder: number;
}

const HASH_PATTERN = /^[0-9a-f]{8}$/u;
const LABELS: readonly M7BetaLabel[] = [
  "HISTORICAL",
  "INFERRED",
  "COMPOSITE",
  "FICTIONAL",
  "RESEARCH REQUIRED"
];
const CONFIDENCES: readonly M7BetaConfidence[] = ["HIGH", "MEDIUM", "LOW", "DISPUTED"];
const RESEARCH_STATUSES: readonly M7BetaResearchStatus[] = [
  "PAGE_VERIFIED",
  "SUMMARY_ONLY",
  "RESEARCH_REQUIRED"
];
const REVIEW_STATES: readonly M7BetaReviewState[] = [
  "DRAFT_CONTENT",
  "RESEARCH REQUIRED",
  "SOURCE_RECORDED",
  "HISTORICAL_REVIEW_READY",
  "HISTORICAL_ACCEPTED",
  "CULTURE_RISK_REQUEST_CHANGES",
  "CULTURE_HUMAN_GATE_REQUIRED",
  "LANGUAGE_REVIEW_REQUIRED",
  "SCHEMA_VALIDATED",
  "QA_REVIEW_READY",
  "LOCK_CANDIDATE"
];
const SOURCE_CLASSES: readonly M7BetaSourceClass[] = [
  "PROJECT_BASELINE",
  "PROJECT_POLICY",
  "PROJECT_BIBLIOGRAPHY",
  "REVIEW_BASELINE",
  "ACADEMIC_CANDIDATE"
];
const HOOK_KINDS: readonly M7BetaScenarioHookRecordV0["hookKind"][] = [
  "start",
  "victory",
  "failure",
  "tutorial",
  "encyclopedia"
];
const BLOCKED_HIGH_RISK_REVIEW_STATES: readonly M7BetaReviewState[] = [
  "RESEARCH REQUIRED",
  "CULTURE_RISK_REQUEST_CHANGES",
  "CULTURE_HUMAN_GATE_REQUIRED"
];
const HIGH_RISK_EVENT_TERMS = ["coercion", "coercive", "forced", "famine", "violence"];

export function parseM7BetaScenarioManifestHash(input: unknown): M7BetaScenarioManifestHash {
  if (typeof input !== "string" || !HASH_PATTERN.test(input)) {
    throw new Error("M7 beta scenario manifest hash must be 8 lowercase hexadecimal characters.");
  }
  return input as M7BetaScenarioManifestHash;
}

export function validateRuntimeM7BetaScenarioPersonEventContentPackV0(
  input: unknown
): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime M7 beta content pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRoot(input, errors);
  if (errors.length > 0) {
    return errors;
  }
  validateSemantics(input, errors);
  return errors;
}

export function parseRuntimeM7BetaScenarioPersonEventContentPackV0(
  input: unknown
): RuntimeM7BetaScenarioPersonEventContentPackV0 {
  const errors = validateRuntimeM7BetaScenarioPersonEventContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(
      `RuntimeM7BetaScenarioPersonEventContentPackV0 invalid: ${formatErrors(errors)}`
    );
  }
  if (!isRecord(input)) {
    throw new Error("RuntimeM7BetaScenarioPersonEventContentPackV0 invalid: root was not object.");
  }

  const manifest = readRecord(input, "manifest");
  return Object.freeze({
    schemaVersion: 1 as const,
    kind: "runtime-m7-beta-scenario-person-event-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    notContentLockAcceptance: true as const,
    m6GateCarryForward: "PASS_WITH_LIMITS" as const,
    manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE" as const,
    manifest: Object.freeze({
      schemaVersion: 1 as const,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "beta-scenario-person-event-set" as const,
      contentScope: "m7-beta-content-fill" as const,
      manifestHash: parseM7BetaScenarioManifestHash(readString(manifest, "manifestHash")),
      sourceCount: readPositiveInteger(manifest, "sourceCount"),
      claimCount: readPositiveInteger(manifest, "claimCount"),
      localizationCount: readPositiveInteger(manifest, "localizationCount"),
      titleCount: readPositiveInteger(manifest, "titleCount"),
      personCount: readPositiveInteger(manifest, "personCount"),
      eventCount: readPositiveInteger(manifest, "eventCount"),
      scenarioCount: readPositiveInteger(manifest, "scenarioCount"),
      knownGapCount: readPositiveInteger(manifest, "knownGapCount")
    }),
    sourceRecords: Object.freeze(readArray(input, "sourceRecords").map(parseSourceRecord)),
    claimRecords: Object.freeze(readArray(input, "claimRecords").map(parseClaimRecord)),
    localization: Object.freeze(readArray(input, "localization").map(parseLocalizationRecord)),
    titles: Object.freeze(readArray(input, "titles").map(parseTitleRecord)),
    persons: Object.freeze(readArray(input, "persons").map(parsePersonRecord)),
    events: Object.freeze(readArray(input, "events").map(parseEventRecord)),
    scenarios: Object.freeze(readArray(input, "scenarios").map(parseScenarioRecord)),
    knownGaps: Object.freeze(readArray(input, "knownGaps").map(readStringValue))
  });
}

export function createRuntimeM7BetaScenarioPersonEventContentPackIndexV0(
  pack: RuntimeM7BetaScenarioPersonEventContentPackV0
): RuntimeM7BetaScenarioPersonEventContentPackIndexV0 {
  const scenarioById = new Map<string, M7BetaScenarioRecordV0>();
  const personById = new Map<string, M7BetaPersonRecordV0>();
  const eventById = new Map<string, M7BetaEventRecordV0>();
  const claimById = new Map<string, M7BetaClaimRecordV0>();

  for (const scenario of pack.scenarios) {
    scenarioById.set(scenario.scenarioId, scenario);
  }
  for (const person of pack.persons) {
    personById.set(person.personId, person);
  }
  for (const event of pack.events) {
    eventById.set(event.eventId, event);
  }
  for (const claim of pack.claimRecords) {
    claimById.set(claim.claimId, claim);
  }

  return Object.freeze({
    pack,
    getScenario(scenarioId: string): M7BetaScenarioRecordV0 | undefined {
      return scenarioById.get(scenarioId);
    },
    getPerson(personId: string): M7BetaPersonRecordV0 | undefined {
      return personById.get(personId);
    },
    getEvent(eventId: string): M7BetaEventRecordV0 | undefined {
      return eventById.get(eventId);
    },
    getClaim(claimId: string): M7BetaClaimRecordV0 | undefined {
      return claimById.get(claimId);
    }
  });
}

function validateRoot(input: Record<string, unknown>, errors: RuntimeValidationError[]): void {
  validateExactNumber(input, "schemaVersion", 1, errors);
  validateExactString(
    input,
    "kind",
    "runtime-m7-beta-scenario-person-event-content-pack-v0",
    errors
  );
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);
  validateExactBoolean(input, "notContentLockAcceptance", true, errors);
  validateExactString(input, "m6GateCarryForward", "PASS_WITH_LIMITS", errors);
  validateExactString(input, "manualNodeBattleDecision", "DEFER_MANUAL_NODE_BATTLE", errors);
  validateRecord(input, "manifest", errors);
  for (const key of [
    "sourceRecords",
    "claimRecords",
    "localization",
    "titles",
    "persons",
    "events",
    "scenarios",
    "knownGaps"
  ]) {
    validateArray(input, key, errors);
  }

  const manifest = input["manifest"];
  if (isRecord(manifest)) {
    validateExactNumber(manifest, "schemaVersion", 1, errors, "manifest.schemaVersion");
    validateExactString(
      manifest,
      "fixtureKind",
      "beta-scenario-person-event-set",
      errors,
      "manifest.fixtureKind"
    );
    validateExactString(
      manifest,
      "contentScope",
      "m7-beta-content-fill",
      errors,
      "manifest.contentScope"
    );
    validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
    validateHashString(manifest, "manifestHash", "manifest.manifestHash", errors);
    for (const key of [
      "sourceCount",
      "claimCount",
      "localizationCount",
      "titleCount",
      "personCount",
      "eventCount",
      "scenarioCount",
      "knownGapCount"
    ]) {
      validatePositiveIntegerField(manifest, key, `manifest.${key}`, errors);
    }
  }
}

function validateSemantics(input: Record<string, unknown>, errors: RuntimeValidationError[]): void {
  const manifest = readRecord(input, "manifest");
  const sourceRecords = readArray(input, "sourceRecords");
  const claimRecords = readArray(input, "claimRecords");
  const localization = readArray(input, "localization");
  const titles = readArray(input, "titles");
  const persons = readArray(input, "persons");
  const events = readArray(input, "events");
  const scenarios = readArray(input, "scenarios");
  const knownGaps = readArray(input, "knownGaps");

  validateRuntimeCount(manifest, "sourceCount", sourceRecords.length, errors);
  validateRuntimeCount(manifest, "claimCount", claimRecords.length, errors);
  validateRuntimeCount(manifest, "localizationCount", localization.length, errors);
  validateRuntimeCount(manifest, "titleCount", titles.length, errors);
  validateRuntimeCount(manifest, "personCount", persons.length, errors);
  validateRuntimeCount(manifest, "eventCount", events.length, errors);
  validateRuntimeCount(manifest, "scenarioCount", scenarios.length, errors);
  validateRuntimeCount(manifest, "knownGapCount", knownGaps.length, errors);
  collectOrderedIds(sourceRecords, "sourceRecords", "sourceId", errors);
  collectOrderedIds(claimRecords, "claimRecords", "claimId", errors);
  collectOrderedIds(localization, "localization", "key", errors);
  collectOrderedIds(titles, "titles", "titleId", errors);
  collectOrderedIds(persons, "persons", "personId", errors);
  collectOrderedIds(events, "events", "eventId", errors);
  collectOrderedIds(scenarios, "scenarios", "scenarioId", errors);

  const shapeErrorCount = errors.length;
  validateArrayMembers(sourceRecords, "sourceRecords", validateSourceRecord, errors);
  validateArrayMembers(claimRecords, "claimRecords", validateClaimRecord, errors);
  validateArrayMembers(localization, "localization", validateLocalizationRecord, errors);
  validateArrayMembers(titles, "titles", validateTitleRecord, errors);
  validateArrayMembers(persons, "persons", validatePersonRecord, errors);
  validateArrayMembers(events, "events", validateEventRecord, errors);
  validateArrayMembers(scenarios, "scenarios", validateScenarioRecord, errors);
  validateKnownGaps(knownGaps, errors);
  if (errors.length > shapeErrorCount) {
    return;
  }

  validateReferenceClosure(
    sourceRecords,
    claimRecords,
    localization,
    titles,
    persons,
    events,
    scenarios,
    errors
  );
}

function validateSourceRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateStringUnion(input, "sourceClass", `${path}.sourceClass`, SOURCE_CLASSES, errors);
  validateNonEmptyString(input, "citation", `${path}.citation`, errors);
  validateNonEmptyString(input, "accessStatus", `${path}.accessStatus`, errors);
  validateNonEmptyString(input, "pageOrSection", `${path}.pageOrSection`, errors);
  validateNonEmptyString(input, "formalUse", `${path}.formalUse`, errors);
}

function validateClaimRecord(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "claimId", `${path}.claimId`, errors);
  validateNonEmptyString(input, "claim", `${path}.claim`, errors);
  validateStringUnion(input, "label", `${path}.label`, LABELS, errors);
  validateStringUnion(input, "confidence", `${path}.confidence`, CONFIDENCES, errors);
  validateStringArray(input, "sourceIds", `${path}.sourceIds`, errors);
  validateStringArray(input, "sourcePassages", `${path}.sourcePassages`, errors);
  validateStringArray(input, "sourceStatements", `${path}.sourceStatements`, errors);
  validateStringArray(
    input,
    "scholarlyInterpretations",
    `${path}.scholarlyInterpretations`,
    errors
  );
  validateNonEmptyString(input, "researcherInference", `${path}.researcherInference`, errors);
  validateStringArray(
    input,
    "competingInterpretations",
    `${path}.competingInterpretations`,
    errors
  );
  validateNonEmptyString(input, "gameAbstraction", `${path}.gameAbstraction`, errors);
  validateStringUnion(input, "researchStatus", `${path}.researchStatus`, RESEARCH_STATUSES, errors);
  validateBoolean(input, "humanGate", `${path}.humanGate`, errors);
}

function validateLocalizationRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "key", `${path}.key`, errors);
  validateNonEmptyString(input, "zhHans", `${path}.zhHans`, errors);
  validateNonEmptyString(input, "english", `${path}.english`, errors);
  validateNonEmptyString(input, "sourceNote", `${path}.sourceNote`, errors);
  validateNonEmptyString(input, "context", `${path}.context`, errors);
  validateIntegerInRange(input, "characterLimit", `${path}.characterLimit`, 1, 240, errors);
  validateStringArray(input, "sourceIds", `${path}.sourceIds`, errors);
  validateStringArray(input, "claimIds", `${path}.claimIds`, errors);
  validateReviewState(input, `${path}.reviewState`, errors);
  validateNonEmptyString(input, "owner", `${path}.owner`, errors);
  validateIntegerInRange(
    input,
    "deterministicOrder",
    `${path}.deterministicOrder`,
    1,
    10000,
    errors
  );
}

function validateTitleRecord(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "titleId", `${path}.titleId`, errors);
  validateNonEmptyString(input, "localizationKey", `${path}.localizationKey`, errors);
  validateCommonRuntimeContentFields(input, path, errors);
}

function validatePersonRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "personId", `${path}.personId`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateStringArray(input, "titleIds", `${path}.titleIds`, errors);
  validateCommonRuntimeContentFields(input, path, errors);
  validateStringArray(input, "scenarioIds", `${path}.scenarioIds`, errors);
  validateNonEmptyString(input, "roleTag", `${path}.roleTag`, errors);
}

function validateEventRecord(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "eventId", `${path}.eventId`, errors);
  validateNonEmptyString(input, "localizationKey", `${path}.localizationKey`, errors);
  validateCommonRuntimeContentFields(input, path, errors);
  validateNonEmptyString(input, "triggerKey", `${path}.triggerKey`, errors);
  validateStringArray(input, "scenarioIds", `${path}.scenarioIds`, errors);
  validateStringArray(input, "personIds", `${path}.personIds`, errors);
  validateStringArray(input, "titleIds", `${path}.titleIds`, errors);
  validateArray(input, "choices", errors, `${path}.choices`);
  validateArrayMembers(
    readArrayIfPresent(input, "choices"),
    `${path}.choices`,
    validateEventChoiceRecord,
    errors
  );
  validateNullableRecord(input, "violenceCostRecord", `${path}.violenceCostRecord`, errors);
  const violenceCostRecord = input["violenceCostRecord"];
  if (isRecord(violenceCostRecord)) {
    validateViolenceCostRecord(violenceCostRecord, `${path}.violenceCostRecord`, errors);
  }
  validateHighRiskEventInvariant(input, path, errors);
}

function validateEventChoiceRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "choiceId", `${path}.choiceId`, errors);
  validateNonEmptyString(input, "localizationKey", `${path}.localizationKey`, errors);
  validateNonEmptyString(input, "aiReasonKey", `${path}.aiReasonKey`, errors);
  validateNonEmptyString(input, "costSummaryKey", `${path}.costSummaryKey`, errors);
}

function validateViolenceCostRecord(
  input: Record<string, unknown>,
  path: string,
  errors: RuntimeValidationError[]
): void {
  validateNonEmptyStringArray(input, "victimGroups", `${path}.victimGroups`, errors);
  validateNonEmptyStringArray(input, "sourceRegions", `${path}.sourceRegions`, errors);
  validateNonEmptyStringArray(input, "immediateCosts", `${path}.immediateCosts`, errors);
  validateNonEmptyStringArray(
    input,
    "longTermConsequences",
    `${path}.longTermConsequences`,
    errors
  );
  validateReviewState(input, `${path}.reviewState`, errors);
}

function validateScenarioRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "scenarioId", `${path}.scenarioId`, errors);
  validateNonEmptyString(input, "scenarioKey", `${path}.scenarioKey`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateIntegerInRange(input, "startYear", `${path}.startYear`, 1531, 1600, errors);
  validateCommonRuntimeContentFields(input, path, errors);
  validateStringArray(input, "personIds", `${path}.personIds`, errors);
  validateStringArray(input, "titleIds", `${path}.titleIds`, errors);
  validateStringArray(input, "eventIds", `${path}.eventIds`, errors);
  validateStringArray(input, "localizationKeys", `${path}.localizationKeys`, errors);
  validateArray(input, "hooks", errors, `${path}.hooks`);
  validateArrayMembers(
    readArrayIfPresent(input, "hooks"),
    `${path}.hooks`,
    validateScenarioHookRecord,
    errors
  );
}

function validateScenarioHookRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validateNonEmptyString(input, "hookId", `${path}.hookId`, errors);
  validateStringUnion(input, "hookKind", `${path}.hookKind`, HOOK_KINDS, errors);
  validateNonEmptyString(input, "localizationKey", `${path}.localizationKey`, errors);
  validateStringArray(input, "targetIds", `${path}.targetIds`, errors);
}

function validateCommonRuntimeContentFields(
  input: Record<string, unknown>,
  path: string,
  errors: RuntimeValidationError[]
): void {
  validateStringUnion(input, "label", `${path}.label`, LABELS, errors);
  validateStringUnion(input, "confidence", `${path}.confidence`, CONFIDENCES, errors);
  validateStringArray(input, "sourceIds", `${path}.sourceIds`, errors);
  validateStringArray(input, "claimIds", `${path}.claimIds`, errors);
  validateReviewState(input, `${path}.reviewState`, errors);
  validateNonEmptyString(input, "owner", `${path}.owner`, errors);
  validateIntegerInRange(
    input,
    "deterministicOrder",
    `${path}.deterministicOrder`,
    1,
    10000,
    errors
  );
}

function validateReviewState(
  input: Record<string, unknown>,
  path: string,
  errors: RuntimeValidationError[]
): void {
  validateStringUnion(input, "reviewState", path, REVIEW_STATES, errors);
  if (input["reviewState"] === "LOCK_CANDIDATE") {
    errors.push({
      path,
      message: "M7 beta fill runtime records cannot enter LOCK_CANDIDATE before Human Gate."
    });
  }
}

function validateHighRiskEventInvariant(
  input: Record<string, unknown>,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const eventId = input["eventId"];
  const triggerKey = input["triggerKey"];
  if (
    (typeof eventId !== "string" && typeof triggerKey !== "string") ||
    !isHighRiskEvent(
      `${typeof eventId === "string" ? eventId : ""} ${typeof triggerKey === "string" ? triggerKey : ""}`
    )
  ) {
    return;
  }

  const violenceCostRecord = input["violenceCostRecord"];
  if (!isRecord(violenceCostRecord)) {
    errors.push({
      path: `${path}.violenceCostRecord`,
      message: "High-risk M7 events must keep a non-empty violenceCostRecord."
    });
    return;
  }

  if (!isBlockedHighRiskReviewState(input["reviewState"])) {
    errors.push({
      path: `${path}.reviewState`,
      message:
        "High-risk M7 events must remain blocked as CULTURE_HUMAN_GATE_REQUIRED, CULTURE_RISK_REQUEST_CHANGES, or RESEARCH REQUIRED."
    });
  }
  if (!isBlockedHighRiskReviewState(violenceCostRecord["reviewState"])) {
    errors.push({
      path: `${path}.violenceCostRecord.reviewState`,
      message:
        "High-risk violenceCostRecord review state must remain CULTURE_HUMAN_GATE_REQUIRED or an equivalent blocked state."
    });
  }
}

function validateKnownGaps(knownGaps: readonly unknown[], errors: RuntimeValidationError[]): void {
  knownGaps.forEach((entry, index) => {
    if (typeof entry !== "string" || entry.length === 0) {
      errors.push({ path: `knownGaps[${index}]`, message: "knownGaps entries must be strings." });
    }
  });
}

function validateReferenceClosure(
  sourceRecords: readonly unknown[],
  claimRecords: readonly unknown[],
  localization: readonly unknown[],
  titles: readonly unknown[],
  persons: readonly unknown[],
  events: readonly unknown[],
  scenarios: readonly unknown[],
  errors: RuntimeValidationError[]
): void {
  const sourceIds = collectIdSet(sourceRecords, "sourceId");
  const claimIds = collectIdSet(claimRecords, "claimId");
  const localizationKeys = collectIdSet(localization, "key");
  const titleIds = collectIdSet(titles, "titleId");
  const personIds = collectIdSet(persons, "personId");
  const eventIds = collectIdSet(events, "eventId");
  const scenarioIds = collectIdSet(scenarios, "scenarioId");

  validateSourceAndClaimReferences(localization, "localization", sourceIds, claimIds, errors);
  validateSourceAndClaimReferences(titles, "titles", sourceIds, claimIds, errors);
  validateSourceAndClaimReferences(persons, "persons", sourceIds, claimIds, errors);
  validateSourceAndClaimReferences(events, "events", sourceIds, claimIds, errors);
  validateSourceAndClaimReferences(scenarios, "scenarios", sourceIds, claimIds, errors);

  validateLocalizationReference(titles, "titles", "localizationKey", localizationKeys, errors);
  validateLocalizationReference(persons, "persons", "displayNameKey", localizationKeys, errors);
  validateLocalizationReference(events, "events", "localizationKey", localizationKeys, errors);
  validateLocalizationReference(scenarios, "scenarios", "displayNameKey", localizationKeys, errors);
  validateStringArrayReferences(persons, "persons", "titleIds", titleIds, errors);
  validateStringArrayReferences(persons, "persons", "scenarioIds", scenarioIds, errors);
  validateStringArrayReferences(events, "events", "scenarioIds", scenarioIds, errors);
  validateStringArrayReferences(events, "events", "personIds", personIds, errors);
  validateStringArrayReferences(events, "events", "titleIds", titleIds, errors);
  validateStringArrayReferences(scenarios, "scenarios", "personIds", personIds, errors);
  validateStringArrayReferences(scenarios, "scenarios", "titleIds", titleIds, errors);
  validateStringArrayReferences(scenarios, "scenarios", "eventIds", eventIds, errors);
  validateStringArrayReferences(
    scenarios,
    "scenarios",
    "localizationKeys",
    localizationKeys,
    errors
  );
  validateNestedLocalizationReferences(events, "events", "choices", localizationKeys, errors);
  validateNestedLocalizationReferences(scenarios, "scenarios", "hooks", localizationKeys, errors);
}

function parseSourceRecord(input: unknown): M7BetaSourceRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 source record.");
  return Object.freeze({
    sourceId: readString(record, "sourceId"),
    sourceClass: readSourceClass(record, "sourceClass"),
    citation: readString(record, "citation"),
    accessStatus: readString(record, "accessStatus"),
    pageOrSection: readString(record, "pageOrSection"),
    formalUse: readString(record, "formalUse")
  });
}

function parseClaimRecord(input: unknown): M7BetaClaimRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 claim record.");
  return Object.freeze({
    claimId: readString(record, "claimId"),
    claim: readString(record, "claim"),
    label: readLabel(record, "label"),
    confidence: readConfidence(record, "confidence"),
    sourceIds: Object.freeze(readArray(record, "sourceIds").map(readStringValue)),
    sourcePassages: Object.freeze(readArray(record, "sourcePassages").map(readStringValue)),
    sourceStatements: Object.freeze(readArray(record, "sourceStatements").map(readStringValue)),
    scholarlyInterpretations: Object.freeze(
      readArray(record, "scholarlyInterpretations").map(readStringValue)
    ),
    researcherInference: readString(record, "researcherInference"),
    competingInterpretations: Object.freeze(
      readArray(record, "competingInterpretations").map(readStringValue)
    ),
    gameAbstraction: readString(record, "gameAbstraction"),
    researchStatus: readResearchStatus(record, "researchStatus"),
    humanGate: readBoolean(record, "humanGate")
  });
}

function parseLocalizationRecord(input: unknown): M7BetaLocalizationRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 localization record.");
  return Object.freeze({
    key: readString(record, "key"),
    zhHans: readString(record, "zhHans"),
    english: readString(record, "english"),
    sourceNote: readString(record, "sourceNote"),
    context: readString(record, "context"),
    characterLimit: readIntegerInRange(record, "characterLimit", 1, 240),
    sourceIds: Object.freeze(readArray(record, "sourceIds").map(readStringValue)),
    claimIds: Object.freeze(readArray(record, "claimIds").map(readStringValue)),
    reviewState: readReviewState(record, "reviewState"),
    owner: readString(record, "owner"),
    deterministicOrder: readIntegerInRange(record, "deterministicOrder", 1, 10000)
  });
}

function parseTitleRecord(input: unknown): M7BetaTitleRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 title record.");
  return Object.freeze({
    titleId: readString(record, "titleId"),
    localizationKey: readString(record, "localizationKey"),
    ...parseCommonContentFields(record)
  });
}

function parsePersonRecord(input: unknown): M7BetaPersonRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 person record.");
  return Object.freeze({
    personId: readString(record, "personId"),
    displayNameKey: readString(record, "displayNameKey"),
    titleIds: Object.freeze(readArray(record, "titleIds").map(readStringValue)),
    ...parseCommonContentFields(record),
    scenarioIds: Object.freeze(readArray(record, "scenarioIds").map(readStringValue)),
    roleTag: readString(record, "roleTag")
  });
}

function parseEventRecord(input: unknown): M7BetaEventRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 event record.");
  return Object.freeze({
    eventId: readString(record, "eventId"),
    localizationKey: readString(record, "localizationKey"),
    ...parseCommonContentFields(record),
    triggerKey: readString(record, "triggerKey"),
    scenarioIds: Object.freeze(readArray(record, "scenarioIds").map(readStringValue)),
    personIds: Object.freeze(readArray(record, "personIds").map(readStringValue)),
    titleIds: Object.freeze(readArray(record, "titleIds").map(readStringValue)),
    choices: Object.freeze(readArray(record, "choices").map(parseEventChoiceRecord)),
    violenceCostRecord: parseNullableViolenceCostRecord(record["violenceCostRecord"])
  });
}

function parseEventChoiceRecord(input: unknown): M7BetaEventChoiceRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 event choice record.");
  return Object.freeze({
    choiceId: readString(record, "choiceId"),
    localizationKey: readString(record, "localizationKey"),
    aiReasonKey: readString(record, "aiReasonKey"),
    costSummaryKey: readString(record, "costSummaryKey")
  });
}

function parseNullableViolenceCostRecord(input: unknown): M7BetaViolenceCostRecordV0 | null {
  if (input === null) {
    return null;
  }
  const record = readParsedRecord(input, "Expected valid M7 violence cost record.");
  return Object.freeze({
    victimGroups: Object.freeze(readArray(record, "victimGroups").map(readStringValue)),
    sourceRegions: Object.freeze(readArray(record, "sourceRegions").map(readStringValue)),
    immediateCosts: Object.freeze(readArray(record, "immediateCosts").map(readStringValue)),
    longTermConsequences: Object.freeze(
      readArray(record, "longTermConsequences").map(readStringValue)
    ),
    reviewState: readReviewState(record, "reviewState")
  });
}

function parseScenarioRecord(input: unknown): M7BetaScenarioRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 scenario record.");
  return Object.freeze({
    scenarioId: readString(record, "scenarioId"),
    scenarioKey: readString(record, "scenarioKey"),
    displayNameKey: readString(record, "displayNameKey"),
    startYear: readIntegerInRange(record, "startYear", 1531, 1600),
    ...parseCommonContentFields(record),
    personIds: Object.freeze(readArray(record, "personIds").map(readStringValue)),
    titleIds: Object.freeze(readArray(record, "titleIds").map(readStringValue)),
    eventIds: Object.freeze(readArray(record, "eventIds").map(readStringValue)),
    localizationKeys: Object.freeze(readArray(record, "localizationKeys").map(readStringValue)),
    hooks: Object.freeze(readArray(record, "hooks").map(parseScenarioHookRecord))
  });
}

function parseScenarioHookRecord(input: unknown): M7BetaScenarioHookRecordV0 {
  const record = readParsedRecord(input, "Expected valid M7 scenario hook record.");
  return Object.freeze({
    hookId: readString(record, "hookId"),
    hookKind: readHookKind(record, "hookKind"),
    localizationKey: readString(record, "localizationKey"),
    targetIds: Object.freeze(readArray(record, "targetIds").map(readStringValue))
  });
}

function parseCommonContentFields(input: Record<string, unknown>): RuntimeCommonContentFields {
  return Object.freeze({
    label: readLabel(input, "label"),
    confidence: readConfidence(input, "confidence"),
    sourceIds: Object.freeze(readArray(input, "sourceIds").map(readStringValue)),
    claimIds: Object.freeze(readArray(input, "claimIds").map(readStringValue)),
    reviewState: readReviewState(input, "reviewState"),
    owner: readString(input, "owner"),
    deterministicOrder: readIntegerInRange(input, "deterministicOrder", 1, 10000)
  });
}

function collectOrderedIds(
  entries: readonly unknown[],
  path: string,
  key: string,
  errors: RuntimeValidationError[]
): Set<string> {
  const ids = new Set<string>();
  let previousId = "";
  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push({ path: `${path}[${index}]`, message: `${path}[${index}] must be an object.` });
      return;
    }
    const id = entry[key];
    if (typeof id !== "string" || id.length === 0) {
      return;
    }
    if (ids.has(id)) {
      errors.push({ path: `${path}[${index}].${key}`, message: `Duplicate runtime id ${id}.` });
    }
    if (index > 0 && id <= previousId) {
      errors.push({
        path: `${path}[${index}].${key}`,
        message: `${path} must be ordered by ${key}.`
      });
    }
    ids.add(id);
    previousId = id;
  });
  return ids;
}

function collectIdSet(entries: readonly unknown[], key: string): Set<string> {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!isRecord(entry)) {
      continue;
    }
    const id = entry[key];
    if (typeof id === "string" && id.length > 0) {
      ids.add(id);
    }
  }
  return ids;
}

function validateSourceAndClaimReferences(
  entries: readonly unknown[],
  path: string,
  sourceIds: ReadonlySet<string>,
  claimIds: ReadonlySet<string>,
  errors: RuntimeValidationError[]
): void {
  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    validateStringArrayReferencesForRecord(
      entry,
      `${path}[${index}]`,
      "sourceIds",
      sourceIds,
      errors
    );
    validateStringArrayReferencesForRecord(
      entry,
      `${path}[${index}]`,
      "claimIds",
      claimIds,
      errors
    );
  });
}

function validateLocalizationReference(
  entries: readonly unknown[],
  path: string,
  key: string,
  validIds: ReadonlySet<string>,
  errors: RuntimeValidationError[]
): void {
  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    const value = entry[key];
    if (typeof value === "string" && !validIds.has(value)) {
      errors.push({ path: `${path}[${index}].${key}`, message: `Unknown reference ${value}.` });
    }
  });
}

function validateStringArrayReferences(
  entries: readonly unknown[],
  path: string,
  key: string,
  validIds: ReadonlySet<string>,
  errors: RuntimeValidationError[]
): void {
  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    validateStringArrayReferencesForRecord(entry, `${path}[${index}]`, key, validIds, errors);
  });
}

function validateStringArrayReferencesForRecord(
  record: Record<string, unknown>,
  path: string,
  key: string,
  validIds: ReadonlySet<string>,
  errors: RuntimeValidationError[]
): void {
  const values = record[key];
  if (!Array.isArray(values)) {
    return;
  }
  values.forEach((value, index) => {
    if (typeof value === "string" && !validIds.has(value)) {
      errors.push({ path: `${path}.${key}[${index}]`, message: `Unknown reference ${value}.` });
    }
  });
}

function validateNestedLocalizationReferences(
  entries: readonly unknown[],
  path: string,
  nestedKey: string,
  localizationKeys: ReadonlySet<string>,
  errors: RuntimeValidationError[]
): void {
  entries.forEach((entry, entryIndex) => {
    if (!isRecord(entry)) {
      return;
    }
    const nestedEntries = entry[nestedKey];
    if (!Array.isArray(nestedEntries)) {
      return;
    }
    nestedEntries.forEach((nestedEntry, nestedIndex) => {
      if (!isRecord(nestedEntry)) {
        return;
      }
      for (const key of ["localizationKey", "aiReasonKey", "costSummaryKey"]) {
        const value = nestedEntry[key];
        if (typeof value === "string" && !localizationKeys.has(value)) {
          errors.push({
            path: `${path}[${entryIndex}].${nestedKey}[${nestedIndex}].${key}`,
            message: `Unknown reference ${value}.`
          });
        }
      }
    });
  });
}

function validateArrayMembers(
  values: readonly unknown[],
  path: string,
  validator: (entry: unknown, path: string, errors: RuntimeValidationError[]) => void,
  errors: RuntimeValidationError[]
): void {
  values.forEach((value, index) => validator(value, `${path}[${index}]`, errors));
}

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: RuntimeValidationError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ path, message: `${path} must be ${expected}.` });
}

function validateExactNumber(
  record: Record<string, unknown>,
  key: string,
  expected: number,
  errors: RuntimeValidationError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ path, message: `${path} must be ${expected}.` });
}

function validateExactBoolean(
  record: Record<string, unknown>,
  key: string,
  expected: boolean,
  errors: RuntimeValidationError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ path, message: `${path} must be ${expected}.` });
}

function validateBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (typeof record[key] === "boolean") {
    return;
  }
  errors.push({ path, message: `${path} must be a boolean.` });
}

function validateHashString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (typeof value === "string" && HASH_PATTERN.test(value)) {
    return;
  }
  errors.push({ path, message: `${path} must be an 8-character lowercase hex hash.` });
}

function validateNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return;
  }
  errors.push({ path, message: `${path} must be a non-empty string.` });
}

function validateStringUnion(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (typeof value === "string" && allowedValues.includes(value)) {
    return;
  }
  errors.push({ path, message: `${path} must be one of ${allowedValues.join(", ")}.` });
}

function validateStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string" && entry.length > 0)
  ) {
    return;
  }
  errors.push({ path, message: `${path} must be an array of non-empty strings.` });
}

function validateNonEmptyStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === "string" && entry.length > 0)
  ) {
    return;
  }
  errors.push({ path, message: `${path} must be a non-empty array of non-empty strings.` });
}

function validateIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  ) {
    return;
  }
  errors.push({
    path,
    message: `${path} must be a safe integer from ${minimum} to ${maximum}.`
  });
}

function validateRecord(
  record: Record<string, unknown>,
  key: string,
  errors: RuntimeValidationError[],
  path = key
): void {
  if (isRecord(record[key])) {
    return;
  }
  errors.push({ path, message: `${path} must be an object.` });
}

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: RuntimeValidationError[],
  path = key
): void {
  if (Array.isArray(record[key])) {
    return;
  }
  errors.push({ path, message: `${path} must be an array.` });
}

function validateNullableRecord(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (value === null || isRecord(value)) {
    return;
  }
  errors.push({ path, message: `${path} must be null or an object.` });
}

function validatePositiveIntegerField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return;
  }
  errors.push({ path, message: `${path} must be a positive safe integer.` });
}

function validateRuntimeCount(
  manifest: Record<string, unknown>,
  key: string,
  actual: number,
  errors: RuntimeValidationError[]
): void {
  if (readPositiveInteger(manifest, key) === actual) {
    return;
  }
  errors.push({ path: `manifest.${key}`, message: `manifest ${key} must match runtime count.` });
}

function pushObjectError(path: string, errors: RuntimeValidationError[]): void {
  errors.push({ path, message: `${path} must be an object.` });
}

function readRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(`${key} must be an object.`);
  }
  return value;
}

function readParsedRecord(input: unknown, message: string): Record<string, unknown> {
  if (!isRecord(input)) {
    throw new Error(message);
  }
  return input;
}

function readArray(record: Record<string, unknown>, key: string): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`);
  }
  return value;
}

function readArrayIfPresent(record: Record<string, unknown>, key: string): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") {
    throw new Error(`${key} must be a string.`);
  }
  return value;
}

function readStringValue(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Expected string array entry.");
  }
  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new Error(`${key} must be a boolean.`);
  }
  return value;
}

function readPositiveInteger(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive safe integer.`);
  }
  return value;
}

function readIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  minimum: number,
  maximum: number
): number {
  const value = record[key];
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(`${key} must be a safe integer from ${minimum} to ${maximum}.`);
  }
  return value;
}

function readLabel(record: Record<string, unknown>, key: string): M7BetaLabel {
  const value = readString(record, key);
  if (LABELS.includes(value as M7BetaLabel)) {
    return value as M7BetaLabel;
  }
  throw new Error(`${key} must be a valid M7 label.`);
}

function readConfidence(record: Record<string, unknown>, key: string): M7BetaConfidence {
  const value = readString(record, key);
  if (CONFIDENCES.includes(value as M7BetaConfidence)) {
    return value as M7BetaConfidence;
  }
  throw new Error(`${key} must be a valid M7 confidence value.`);
}

function readResearchStatus(record: Record<string, unknown>, key: string): M7BetaResearchStatus {
  const value = readString(record, key);
  if (RESEARCH_STATUSES.includes(value as M7BetaResearchStatus)) {
    return value as M7BetaResearchStatus;
  }
  throw new Error(`${key} must be a valid M7 research status value.`);
}

function readReviewState(record: Record<string, unknown>, key: string): M7BetaReviewState {
  const value = readString(record, key);
  if (REVIEW_STATES.includes(value as M7BetaReviewState)) {
    return value as M7BetaReviewState;
  }
  throw new Error(`${key} must be a valid M7 review state.`);
}

function readSourceClass(record: Record<string, unknown>, key: string): M7BetaSourceClass {
  const value = readString(record, key);
  if (SOURCE_CLASSES.includes(value as M7BetaSourceClass)) {
    return value as M7BetaSourceClass;
  }
  throw new Error(`${key} must be a valid M7 source class.`);
}

function readHookKind(
  record: Record<string, unknown>,
  key: string
): M7BetaScenarioHookRecordV0["hookKind"] {
  const value = readString(record, key);
  if (HOOK_KINDS.includes(value as M7BetaScenarioHookRecordV0["hookKind"])) {
    return value as M7BetaScenarioHookRecordV0["hookKind"];
  }
  throw new Error(`${key} must be a valid M7 hook kind.`);
}

function isHighRiskEvent(value: string): boolean {
  const normalized = value.toLowerCase();
  return HIGH_RISK_EVENT_TERMS.some((term) => normalized.includes(term));
}

function isBlockedHighRiskReviewState(value: unknown): boolean {
  return (
    typeof value === "string" &&
    BLOCKED_HIGH_RISK_REVIEW_STATES.includes(value as M7BetaReviewState)
  );
}

function formatErrors(errors: readonly RuntimeValidationError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const M7_BETA_SCENARIO_PERSON_EVENT_SOURCE_V0_SCHEMA_VERSION = 1;

export type M7BetaScenarioPersonEventSourceKind = "m7.beta-scenario-person-event-set";
export type M7BetaScenarioPersonEventFixtureKind = "beta-scenario-person-event-set";
export type M7BetaScenarioPersonEventContentScope = "m7-beta-content-fill";
export type M7BetaLabel =
  | "HISTORICAL"
  | "INFERRED"
  | "COMPOSITE"
  | "FICTIONAL"
  | "RESEARCH REQUIRED";
export type M7BetaConfidence = "HIGH" | "MEDIUM" | "LOW" | "DISPUTED";
export type M7BetaResearchStatus = "PAGE_VERIFIED" | "SUMMARY_ONLY" | "RESEARCH_REQUIRED";
export type M7BetaReviewState =
  | "DRAFT_CONTENT"
  | "RESEARCH REQUIRED"
  | "SOURCE_RECORDED"
  | "HISTORICAL_REVIEW_READY"
  | "HISTORICAL_ACCEPTED"
  | "CULTURE_RISK_REQUEST_CHANGES"
  | "CULTURE_HUMAN_GATE_REQUIRED"
  | "LANGUAGE_REVIEW_REQUIRED"
  | "SCHEMA_VALIDATED"
  | "QA_REVIEW_READY"
  | "LOCK_CANDIDATE";
export type M7BetaSourceClass =
  | "PROJECT_BASELINE"
  | "PROJECT_POLICY"
  | "PROJECT_BIBLIOGRAPHY"
  | "REVIEW_BASELINE"
  | "ACADEMIC_CANDIDATE";

export interface M7BetaScenarioSchemaError {
  readonly code: "invalid-schema";
  readonly path: string;
  readonly message: string;
}

export interface M7BetaSourceRecordV0 {
  readonly sourceId: string;
  readonly sourceClass: M7BetaSourceClass;
  readonly citation: string;
  readonly accessStatus: string;
  readonly pageOrSection: string;
  readonly formalUse: string;
}

export interface M7BetaClaimRecordV0 {
  readonly claimId: string;
  readonly claim: string;
  readonly label: M7BetaLabel;
  readonly confidence: M7BetaConfidence;
  readonly sourceIds: readonly string[];
  readonly sourcePassages: readonly string[];
  readonly sourceStatements: readonly string[];
  readonly scholarlyInterpretations: readonly string[];
  readonly researcherInference: string;
  readonly competingInterpretations: readonly string[];
  readonly gameAbstraction: string;
  readonly researchStatus: M7BetaResearchStatus;
  readonly humanGate: boolean;
}

export interface M7BetaLocalizationRecordV0 {
  readonly key: string;
  readonly zhHans: string;
  readonly english: string;
  readonly sourceNote: string;
  readonly context: string;
  readonly characterLimit: number;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: M7BetaReviewState;
  readonly owner: string;
  readonly deterministicOrder: number;
}

export interface M7BetaTitleRecordV0 {
  readonly titleId: string;
  readonly localizationKey: string;
  readonly label: M7BetaLabel;
  readonly confidence: M7BetaConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: M7BetaReviewState;
  readonly owner: string;
  readonly deterministicOrder: number;
}

export interface M7BetaPersonRecordV0 {
  readonly personId: string;
  readonly displayNameKey: string;
  readonly titleIds: readonly string[];
  readonly label: M7BetaLabel;
  readonly confidence: M7BetaConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: M7BetaReviewState;
  readonly owner: string;
  readonly scenarioIds: readonly string[];
  readonly roleTag: string;
  readonly deterministicOrder: number;
}

export interface M7BetaViolenceCostRecordV0 {
  readonly victimGroups: readonly string[];
  readonly sourceRegions: readonly string[];
  readonly immediateCosts: readonly string[];
  readonly longTermConsequences: readonly string[];
  readonly reviewState: M7BetaReviewState;
}

export interface M7BetaEventChoiceRecordV0 {
  readonly choiceId: string;
  readonly localizationKey: string;
  readonly aiReasonKey: string;
  readonly costSummaryKey: string;
}

export interface M7BetaEventRecordV0 {
  readonly eventId: string;
  readonly localizationKey: string;
  readonly label: M7BetaLabel;
  readonly confidence: M7BetaConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: M7BetaReviewState;
  readonly owner: string;
  readonly triggerKey: string;
  readonly scenarioIds: readonly string[];
  readonly personIds: readonly string[];
  readonly titleIds: readonly string[];
  readonly choices: readonly M7BetaEventChoiceRecordV0[];
  readonly violenceCostRecord: M7BetaViolenceCostRecordV0 | null;
  readonly deterministicOrder: number;
}

export interface M7BetaScenarioHookRecordV0 {
  readonly hookId: string;
  readonly hookKind: "start" | "victory" | "failure" | "tutorial" | "encyclopedia";
  readonly localizationKey: string;
  readonly targetIds: readonly string[];
}

export interface M7BetaScenarioRecordV0 {
  readonly scenarioId: string;
  readonly scenarioKey: string;
  readonly displayNameKey: string;
  readonly startYear: number;
  readonly label: M7BetaLabel;
  readonly confidence: M7BetaConfidence;
  readonly sourceIds: readonly string[];
  readonly claimIds: readonly string[];
  readonly reviewState: M7BetaReviewState;
  readonly owner: string;
  readonly personIds: readonly string[];
  readonly titleIds: readonly string[];
  readonly eventIds: readonly string[];
  readonly localizationKeys: readonly string[];
  readonly hooks: readonly M7BetaScenarioHookRecordV0[];
  readonly deterministicOrder: number;
}

export interface M7BetaScenarioPersonEventSetSourceV0 {
  readonly schemaVersion: typeof M7_BETA_SCENARIO_PERSON_EVENT_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M7BetaScenarioPersonEventSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M7BetaScenarioPersonEventFixtureKind;
  readonly contentScope: M7BetaScenarioPersonEventContentScope;
  readonly notContentLockAcceptance: true;
  readonly m6GateCarryForward: "PASS_WITH_LIMITS";
  readonly manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE";
  readonly sourceRecords: readonly M7BetaSourceRecordV0[];
  readonly claimRecords: readonly M7BetaClaimRecordV0[];
  readonly localization: readonly M7BetaLocalizationRecordV0[];
  readonly titles: readonly M7BetaTitleRecordV0[];
  readonly persons: readonly M7BetaPersonRecordV0[];
  readonly events: readonly M7BetaEventRecordV0[];
  readonly scenarios: readonly M7BetaScenarioRecordV0[];
  readonly knownGaps: readonly string[];
}

const ID_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;
const SCENARIO_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const CLAIM_ID_PATTERN = /^HIST-M7-FILL-[A-Z0-9-]+$/u;
const LOCALIZATION_KEY_PATTERN = /^content\.m7\.beta\.[a-z0-9_.-]+$/u;
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

export function validateM7BetaScenarioPersonEventSetSourceV0(
  input: unknown
): readonly M7BetaScenarioSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M7 beta scenario/person/event set source must be an object."
      }
    ];
  }

  const errors: M7BetaScenarioSchemaError[] = [];
  validateRoot(input, errors);
  validateEntries(input, errors);
  return errors;
}

export function parseM7BetaScenarioPersonEventSetSourceV0(
  input: unknown
): M7BetaScenarioPersonEventSetSourceV0 {
  const errors = validateM7BetaScenarioPersonEventSetSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M7BetaScenarioPersonEventSetSourceV0 invalid: ${formatErrors(errors)}`);
  }
  if (!isRecord(input)) {
    throw new Error("M7BetaScenarioPersonEventSetSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M7_BETA_SCENARIO_PERSON_EVENT_SOURCE_V0_SCHEMA_VERSION,
    kind: "m7.beta-scenario-person-event-set",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "beta-scenario-person-event-set",
    contentScope: "m7-beta-content-fill",
    notContentLockAcceptance: true,
    m6GateCarryForward: "PASS_WITH_LIMITS",
    manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE",
    sourceRecords: readArray(input, "sourceRecords").map(parseSourceRecord),
    claimRecords: readArray(input, "claimRecords").map(parseClaimRecord),
    localization: readArray(input, "localization").map(parseLocalizationRecord),
    titles: readArray(input, "titles").map(parseTitleRecord),
    persons: readArray(input, "persons").map(parsePersonRecord),
    events: readArray(input, "events").map(parseEventRecord),
    scenarios: readArray(input, "scenarios").map(parseScenarioRecord),
    knownGaps: readArray(input, "knownGaps").map(readStringValue)
  };
}

function validateRoot(input: Record<string, unknown>, errors: M7BetaScenarioSchemaError[]): void {
  validateExactNumber(input, "schemaVersion", 1, errors);
  validateExactString(input, "kind", "m7.beta-scenario-person-event-set", errors);
  validatePatternString(input, "fixtureId", "fixtureId", ID_PATTERN, errors);
  validateExactString(input, "fixtureKind", "beta-scenario-person-event-set", errors);
  validateExactString(input, "contentScope", "m7-beta-content-fill", errors);
  validateExactBoolean(input, "notContentLockAcceptance", true, errors);
  validateExactString(input, "m6GateCarryForward", "PASS_WITH_LIMITS", errors);
  validateExactString(input, "manualNodeBattleDecision", "DEFER_MANUAL_NODE_BATTLE", errors);
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
}

function validateEntries(
  input: Record<string, unknown>,
  errors: M7BetaScenarioSchemaError[]
): void {
  validateArrayMembers(input, "sourceRecords", validateSourceRecord, errors);
  validateArrayMembers(input, "claimRecords", validateClaimRecord, errors);
  validateArrayMembers(input, "localization", validateLocalizationRecord, errors);
  validateArrayMembers(input, "titles", validateTitleRecord, errors);
  validateArrayMembers(input, "persons", validatePersonRecord, errors);
  validateArrayMembers(input, "events", validateEventRecord, errors);
  validateArrayMembers(input, "scenarios", validateScenarioRecord, errors);
  const knownGaps = input["knownGaps"];
  if (Array.isArray(knownGaps)) {
    validateStringArray(input, "knownGaps", "knownGaps", errors);
  }
}

function validateSourceRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, ID_PATTERN, errors);
  validateStringUnion(input, "sourceClass", `${path}.sourceClass`, SOURCE_CLASSES, errors);
  validateNonEmptyString(input, "citation", `${path}.citation`, errors);
  validateNonEmptyString(input, "accessStatus", `${path}.accessStatus`, errors);
  validateNonEmptyString(input, "pageOrSection", `${path}.pageOrSection`, errors);
  validateNonEmptyString(input, "formalUse", `${path}.formalUse`, errors);
}

function validateClaimRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "claimId", `${path}.claimId`, CLAIM_ID_PATTERN, errors);
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
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "key", `${path}.key`, LOCALIZATION_KEY_PATTERN, errors);
  validateNonEmptyString(input, "zhHans", `${path}.zhHans`, errors);
  validateNonEmptyString(input, "english", `${path}.english`, errors);
  validateNonEmptyString(input, "sourceNote", `${path}.sourceNote`, errors);
  validateNonEmptyString(input, "context", `${path}.context`, errors);
  validateIntegerInRange(input, "characterLimit", `${path}.characterLimit`, 1, 240, errors);
  validateStringArray(input, "sourceIds", `${path}.sourceIds`, errors);
  validateStringArray(input, "claimIds", `${path}.claimIds`, errors);
  validateStringUnion(input, "reviewState", `${path}.reviewState`, REVIEW_STATES, errors);
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

function validateTitleRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "titleId", `${path}.titleId`, ID_PATTERN, errors);
  validatePatternString(
    input,
    "localizationKey",
    `${path}.localizationKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validateCommonContentFields(input, path, errors);
}

function validatePersonRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "personId", `${path}.personId`, ID_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validateStringArray(input, "titleIds", `${path}.titleIds`, errors);
  validateCommonContentFields(input, path, errors);
  validateStringArray(input, "scenarioIds", `${path}.scenarioIds`, errors);
  validateNonEmptyString(input, "roleTag", `${path}.roleTag`, errors);
}

function validateEventRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "eventId", `${path}.eventId`, ID_PATTERN, errors);
  validatePatternString(
    input,
    "localizationKey",
    `${path}.localizationKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validateCommonContentFields(input, path, errors);
  validateNonEmptyString(input, "triggerKey", `${path}.triggerKey`, errors);
  validateStringArray(input, "scenarioIds", `${path}.scenarioIds`, errors);
  validateStringArray(input, "personIds", `${path}.personIds`, errors);
  validateStringArray(input, "titleIds", `${path}.titleIds`, errors);
  validateArray(input, "choices", errors, `${path}.choices`);
  validateArrayMembers(input, "choices", validateEventChoiceRecord, errors, `${path}.choices`);
  validateNullableRecord(input, "violenceCostRecord", `${path}.violenceCostRecord`, errors);
  const violenceCostRecord = input["violenceCostRecord"];
  if (isRecord(violenceCostRecord)) {
    validateViolenceCostRecord(violenceCostRecord, `${path}.violenceCostRecord`, errors);
  }
}

function validateEventChoiceRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "choiceId", `${path}.choiceId`, ID_PATTERN, errors);
  validatePatternString(
    input,
    "localizationKey",
    `${path}.localizationKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "aiReasonKey",
    `${path}.aiReasonKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "costSummaryKey",
    `${path}.costSummaryKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
}

function validateViolenceCostRecord(
  input: Record<string, unknown>,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  validateStringArray(input, "victimGroups", `${path}.victimGroups`, errors);
  validateStringArray(input, "sourceRegions", `${path}.sourceRegions`, errors);
  validateStringArray(input, "immediateCosts", `${path}.immediateCosts`, errors);
  validateStringArray(input, "longTermConsequences", `${path}.longTermConsequences`, errors);
  validateStringUnion(input, "reviewState", `${path}.reviewState`, REVIEW_STATES, errors);
}

function validateScenarioRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "scenarioId", `${path}.scenarioId`, ID_PATTERN, errors);
  validatePatternString(input, "scenarioKey", `${path}.scenarioKey`, SCENARIO_KEY_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validateIntegerInRange(input, "startYear", `${path}.startYear`, 1531, 1600, errors);
  validateCommonContentFields(input, path, errors);
  validateStringArray(input, "personIds", `${path}.personIds`, errors);
  validateStringArray(input, "titleIds", `${path}.titleIds`, errors);
  validateStringArray(input, "eventIds", `${path}.eventIds`, errors);
  validateStringArray(input, "localizationKeys", `${path}.localizationKeys`, errors);
  validateArray(input, "hooks", errors, `${path}.hooks`);
  validateArrayMembers(input, "hooks", validateScenarioHookRecord, errors, `${path}.hooks`);
}

function validateScenarioHookRecord(
  input: unknown,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    pushObjectError(path, errors);
    return;
  }
  validatePatternString(input, "hookId", `${path}.hookId`, ID_PATTERN, errors);
  validateStringUnion(input, "hookKind", `${path}.hookKind`, HOOK_KINDS, errors);
  validatePatternString(
    input,
    "localizationKey",
    `${path}.localizationKey`,
    LOCALIZATION_KEY_PATTERN,
    errors
  );
  validateStringArray(input, "targetIds", `${path}.targetIds`, errors);
}

function validateCommonContentFields(
  input: Record<string, unknown>,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  validateStringUnion(input, "label", `${path}.label`, LABELS, errors);
  validateStringUnion(input, "confidence", `${path}.confidence`, CONFIDENCES, errors);
  validateStringArray(input, "sourceIds", `${path}.sourceIds`, errors);
  validateStringArray(input, "claimIds", `${path}.claimIds`, errors);
  validateStringUnion(input, "reviewState", `${path}.reviewState`, REVIEW_STATES, errors);
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

function parseSourceRecord(input: unknown): M7BetaSourceRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 source record.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    sourceClass: readSourceClass(input, "sourceClass"),
    citation: readString(input, "citation"),
    accessStatus: readString(input, "accessStatus"),
    pageOrSection: readString(input, "pageOrSection"),
    formalUse: readString(input, "formalUse")
  };
}

function parseClaimRecord(input: unknown): M7BetaClaimRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 claim record.");
  }
  return {
    claimId: readString(input, "claimId"),
    claim: readString(input, "claim"),
    label: readLabel(input, "label"),
    confidence: readConfidence(input, "confidence"),
    sourceIds: readArray(input, "sourceIds").map(readStringValue),
    sourcePassages: readArray(input, "sourcePassages").map(readStringValue),
    sourceStatements: readArray(input, "sourceStatements").map(readStringValue),
    scholarlyInterpretations: readArray(input, "scholarlyInterpretations").map(readStringValue),
    researcherInference: readString(input, "researcherInference"),
    competingInterpretations: readArray(input, "competingInterpretations").map(readStringValue),
    gameAbstraction: readString(input, "gameAbstraction"),
    researchStatus: readResearchStatus(input, "researchStatus"),
    humanGate: readBoolean(input, "humanGate")
  };
}

function parseLocalizationRecord(input: unknown): M7BetaLocalizationRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 localization record.");
  }
  return {
    key: readString(input, "key"),
    zhHans: readString(input, "zhHans"),
    english: readString(input, "english"),
    sourceNote: readString(input, "sourceNote"),
    context: readString(input, "context"),
    characterLimit: readIntegerInRange(input, "characterLimit", 1, 240),
    sourceIds: readArray(input, "sourceIds").map(readStringValue),
    claimIds: readArray(input, "claimIds").map(readStringValue),
    reviewState: readReviewState(input, "reviewState"),
    owner: readString(input, "owner"),
    deterministicOrder: readIntegerInRange(input, "deterministicOrder", 1, 10000)
  };
}

function parseTitleRecord(input: unknown): M7BetaTitleRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 title record.");
  }
  return {
    titleId: readString(input, "titleId"),
    localizationKey: readString(input, "localizationKey"),
    ...parseCommonContentFields(input)
  };
}

function parsePersonRecord(input: unknown): M7BetaPersonRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 person record.");
  }
  return {
    personId: readString(input, "personId"),
    displayNameKey: readString(input, "displayNameKey"),
    titleIds: readArray(input, "titleIds").map(readStringValue),
    ...parseCommonContentFields(input),
    scenarioIds: readArray(input, "scenarioIds").map(readStringValue),
    roleTag: readString(input, "roleTag")
  };
}

function parseEventRecord(input: unknown): M7BetaEventRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 event record.");
  }
  return {
    eventId: readString(input, "eventId"),
    localizationKey: readString(input, "localizationKey"),
    ...parseCommonContentFields(input),
    triggerKey: readString(input, "triggerKey"),
    scenarioIds: readArray(input, "scenarioIds").map(readStringValue),
    personIds: readArray(input, "personIds").map(readStringValue),
    titleIds: readArray(input, "titleIds").map(readStringValue),
    choices: readArray(input, "choices").map(parseEventChoiceRecord),
    violenceCostRecord: parseNullableViolenceCostRecord(input["violenceCostRecord"])
  };
}

function parseEventChoiceRecord(input: unknown): M7BetaEventChoiceRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 event choice record.");
  }
  return {
    choiceId: readString(input, "choiceId"),
    localizationKey: readString(input, "localizationKey"),
    aiReasonKey: readString(input, "aiReasonKey"),
    costSummaryKey: readString(input, "costSummaryKey")
  };
}

function parseNullableViolenceCostRecord(input: unknown): M7BetaViolenceCostRecordV0 | null {
  if (input === null) {
    return null;
  }
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 violence cost record.");
  }
  return {
    victimGroups: readArray(input, "victimGroups").map(readStringValue),
    sourceRegions: readArray(input, "sourceRegions").map(readStringValue),
    immediateCosts: readArray(input, "immediateCosts").map(readStringValue),
    longTermConsequences: readArray(input, "longTermConsequences").map(readStringValue),
    reviewState: readReviewState(input, "reviewState")
  };
}

function parseScenarioRecord(input: unknown): M7BetaScenarioRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 scenario record.");
  }
  return {
    scenarioId: readString(input, "scenarioId"),
    scenarioKey: readString(input, "scenarioKey"),
    displayNameKey: readString(input, "displayNameKey"),
    startYear: readIntegerInRange(input, "startYear", 1531, 1600),
    ...parseCommonContentFields(input),
    personIds: readArray(input, "personIds").map(readStringValue),
    titleIds: readArray(input, "titleIds").map(readStringValue),
    eventIds: readArray(input, "eventIds").map(readStringValue),
    localizationKeys: readArray(input, "localizationKeys").map(readStringValue),
    hooks: readArray(input, "hooks").map(parseScenarioHookRecord)
  };
}

function parseScenarioHookRecord(input: unknown): M7BetaScenarioHookRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M7 scenario hook record.");
  }
  return {
    hookId: readString(input, "hookId"),
    hookKind: readHookKind(input, "hookKind"),
    localizationKey: readString(input, "localizationKey"),
    targetIds: readArray(input, "targetIds").map(readStringValue)
  };
}

function parseCommonContentFields(input: Record<string, unknown>) {
  return {
    label: readLabel(input, "label"),
    confidence: readConfidence(input, "confidence"),
    sourceIds: readArray(input, "sourceIds").map(readStringValue),
    claimIds: readArray(input, "claimIds").map(readStringValue),
    reviewState: readReviewState(input, "reviewState"),
    owner: readString(input, "owner"),
    deterministicOrder: readIntegerInRange(input, "deterministicOrder", 1, 10000)
  };
}

function validateArrayMembers(
  input: Record<string, unknown>,
  key: string,
  validator: (entry: unknown, path: string, errors: M7BetaScenarioSchemaError[]) => void,
  errors: M7BetaScenarioSchemaError[],
  path = key
): void {
  const values = input[key];
  if (!Array.isArray(values)) {
    return;
  }
  values.forEach((value, index) => validator(value, `${path}[${index}]`, errors));
}

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: M7BetaScenarioSchemaError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be ${expected}.` });
}

function validateExactNumber(
  record: Record<string, unknown>,
  key: string,
  expected: number,
  errors: M7BetaScenarioSchemaError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be ${expected}.` });
}

function validateExactBoolean(
  record: Record<string, unknown>,
  key: string,
  expected: boolean,
  errors: M7BetaScenarioSchemaError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be ${expected}.` });
}

function validateBoolean(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  if (typeof record[key] === "boolean") {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be a boolean.` });
}

function validateNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be a non-empty string.` });
}

function validatePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: M7BetaScenarioSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && pattern.test(value)) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must match ${pattern.source}.` });
}

function validateStringUnion(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: M7BetaScenarioSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && allowedValues.includes(value)) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be one of ${allowedValues.join(", ")}.`
  });
}

function validateIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: M7BetaScenarioSchemaError[]
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
    code: "invalid-schema",
    path,
    message: `${path} must be a safe integer from ${minimum} to ${maximum}.`
  });
}

function validateStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  const value = record[key];
  if (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string" && entry.length > 0)
  ) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be an array of non-empty strings.`
  });
}

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: M7BetaScenarioSchemaError[],
  path = key
): void {
  if (Array.isArray(record[key])) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
}

function validateNullableRecord(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M7BetaScenarioSchemaError[]
): void {
  const value = record[key];
  if (value === null || isRecord(value)) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be null or an object.` });
}

function pushObjectError(path: string, errors: M7BetaScenarioSchemaError[]): void {
  errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
}

function readArray(record: Record<string, unknown>, key: string): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`);
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

function formatErrors(errors: readonly M7BetaScenarioSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

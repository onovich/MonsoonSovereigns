export const M6_ALPHA_SCENARIO_SOURCE_V0_SCHEMA_VERSION = 1;

export type M6AlphaScenarioSourceKind = "m6.alpha-scenario-set";
export type M6AlphaScenarioFixtureKind = "alpha-scenario-set";
export type M6AlphaScenarioSyntheticScope = "m6-alpha-validation";
export type M6AlphaScenarioHistoricity = "HISTORICAL" | "INFERRED" | "COMPOSITE" | "FICTIONAL";
export type M6AlphaScenarioConfidence = "HIGH" | "MEDIUM" | "LOW" | "DISPUTED";
export type M6AlphaScenarioResearchStatus = "PAGE_VERIFIED" | "SUMMARY_ONLY" | "RESEARCH_REQUIRED";
export type M6AlphaScenarioSourceType =
  | "project-research-baseline"
  | "academic-bibliography-entry"
  | "workflow-policy"
  | "gate-evidence";

export interface M6AlphaScenarioSchemaError {
  readonly code: "invalid-schema";
  readonly path: string;
  readonly message: string;
}

export interface M6AlphaScenarioSourceRefV0 {
  readonly sourceId: string;
  readonly sourceType: M6AlphaScenarioSourceType;
  readonly citationKey: string;
  readonly accessNote: string;
}

export interface M6AlphaScenarioClaimRecordV0 {
  readonly claimId: string;
  readonly claim: string;
  readonly historicity: M6AlphaScenarioHistoricity;
  readonly confidence: M6AlphaScenarioConfidence;
  readonly sourceIds: readonly string[];
  readonly sourcePassages: readonly string[];
  readonly competingInterpretations: readonly string[];
  readonly gameAbstraction: string;
  readonly researchStatus: M6AlphaScenarioResearchStatus;
}

export interface M6AlphaScenarioReferenceTargetV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly claimId: string | null;
}

export interface M6AlphaScenarioReferenceSetsV0 {
  readonly diplomacy: readonly string[];
  readonly legitimacy: readonly string[];
  readonly succession: readonly string[];
  readonly mapCandidates: readonly string[];
  readonly policies: readonly string[];
  readonly events: readonly string[];
  readonly encyclopediaEntries: readonly string[];
  readonly startToVictoryFixtures: readonly string[];
}

export interface M6AlphaScenarioReferenceTargetsV0 {
  readonly diplomacy: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly legitimacy: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly succession: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly mapCandidates: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly policies: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly events: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly encyclopediaEntries: readonly M6AlphaScenarioReferenceTargetV0[];
  readonly startToVictoryFixtures: readonly M6AlphaScenarioReferenceTargetV0[];
}

export interface M6AlphaScenarioRecordV0 {
  readonly sourceId: string;
  readonly scenarioKey: string;
  readonly displayNameKey: string;
  readonly startYear: number;
  readonly dependencyOrder: number;
  readonly historicity: M6AlphaScenarioHistoricity;
  readonly materialClaimIds: readonly string[];
  readonly references: M6AlphaScenarioReferenceSetsV0;
}

export interface M6AlphaScenarioSetSourceV0 {
  readonly schemaVersion: typeof M6_ALPHA_SCENARIO_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M6AlphaScenarioSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M6AlphaScenarioFixtureKind;
  readonly syntheticScope: M6AlphaScenarioSyntheticScope;
  readonly sources: readonly M6AlphaScenarioSourceRefV0[];
  readonly claims: readonly M6AlphaScenarioClaimRecordV0[];
  readonly referenceTargets: M6AlphaScenarioReferenceTargetsV0;
  readonly scenarios: readonly M6AlphaScenarioRecordV0[];
}

const SOURCE_ID_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;
const SCENARIO_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const CLAIM_ID_PATTERN = /^HIST-M6-[A-Z0-9-]+$/u;
const DISPLAY_NAME_KEY_PATTERN = /^content\.m6\.alpha\.[a-z0-9_.-]+$/u;
const HISTORICITIES: readonly M6AlphaScenarioHistoricity[] = [
  "HISTORICAL",
  "INFERRED",
  "COMPOSITE",
  "FICTIONAL"
];
const CONFIDENCES: readonly M6AlphaScenarioConfidence[] = ["HIGH", "MEDIUM", "LOW", "DISPUTED"];
const RESEARCH_STATUSES: readonly M6AlphaScenarioResearchStatus[] = [
  "PAGE_VERIFIED",
  "SUMMARY_ONLY",
  "RESEARCH_REQUIRED"
];
const SOURCE_TYPES: readonly M6AlphaScenarioSourceType[] = [
  "project-research-baseline",
  "academic-bibliography-entry",
  "workflow-policy",
  "gate-evidence"
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

export function validateM6AlphaScenarioSetSourceV0(
  input: unknown
): readonly M6AlphaScenarioSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M6 alpha scenario set source must be an object."
      }
    ];
  }

  const errors: M6AlphaScenarioSchemaError[] = [];
  validateRoot(input, errors);

  const sources = input["sources"];
  if (Array.isArray(sources)) {
    sources.forEach((source, index) => validateSourceRef(source, `sources[${index}]`, errors));
  }

  const claims = input["claims"];
  if (Array.isArray(claims)) {
    claims.forEach((claim, index) => validateClaimRecord(claim, `claims[${index}]`, errors));
  }

  const referenceTargets = input["referenceTargets"];
  if (isRecord(referenceTargets)) {
    validateReferenceTargets(referenceTargets, errors);
  }

  const scenarios = input["scenarios"];
  if (Array.isArray(scenarios)) {
    scenarios.forEach((scenario, index) =>
      validateScenarioRecord(scenario, `scenarios[${index}]`, errors)
    );
  }

  return errors;
}

export function parseM6AlphaScenarioSetSourceV0(input: unknown): M6AlphaScenarioSetSourceV0 {
  const errors = validateM6AlphaScenarioSetSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M6AlphaScenarioSetSourceV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("M6AlphaScenarioSetSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M6_ALPHA_SCENARIO_SOURCE_V0_SCHEMA_VERSION,
    kind: "m6.alpha-scenario-set",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "alpha-scenario-set",
    syntheticScope: "m6-alpha-validation",
    sources: readArray(input, "sources").map(parseSourceRef),
    claims: readArray(input, "claims").map(parseClaimRecord),
    referenceTargets: parseReferenceTargets(readRecord(input, "referenceTargets")),
    scenarios: readArray(input, "scenarios").map(parseScenarioRecord)
  };
}

function validateRoot(input: Record<string, unknown>, errors: M6AlphaScenarioSchemaError[]): void {
  validateExactNumber(input, "schemaVersion", M6_ALPHA_SCENARIO_SOURCE_V0_SCHEMA_VERSION, errors);
  validateExactString(input, "kind", "m6.alpha-scenario-set", errors);
  validatePatternString(input, "fixtureId", "fixtureId", SOURCE_ID_PATTERN, errors);
  validateExactString(input, "fixtureKind", "alpha-scenario-set", errors);
  validateExactString(input, "syntheticScope", "m6-alpha-validation", errors);
  validateArray(input, "sources", errors);
  validateArray(input, "claims", errors);
  validateRecord(input, "referenceTargets", errors);
  validateArray(input, "scenarios", errors);
}

function validateSourceRef(
  input: unknown,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, SOURCE_ID_PATTERN, errors);
  validateStringUnion(input, "sourceType", `${path}.sourceType`, SOURCE_TYPES, errors);
  validateNonEmptyString(input, "citationKey", `${path}.citationKey`, errors);
  validateNonEmptyString(input, "accessNote", `${path}.accessNote`, errors);
}

function validateClaimRecord(
  input: unknown,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }

  validatePatternString(input, "claimId", `${path}.claimId`, CLAIM_ID_PATTERN, errors);
  validateNonEmptyString(input, "claim", `${path}.claim`, errors);
  validateStringUnion(input, "historicity", `${path}.historicity`, HISTORICITIES, errors);
  validateStringUnion(input, "confidence", `${path}.confidence`, CONFIDENCES, errors);
  validateStringArray(input, "sourceIds", `${path}.sourceIds`, errors);
  validateStringArray(input, "sourcePassages", `${path}.sourcePassages`, errors);
  validateStringArray(
    input,
    "competingInterpretations",
    `${path}.competingInterpretations`,
    errors
  );
  validateNonEmptyString(input, "gameAbstraction", `${path}.gameAbstraction`, errors);
  validateStringUnion(input, "researchStatus", `${path}.researchStatus`, RESEARCH_STATUSES, errors);
}

function validateReferenceTargets(
  input: Record<string, unknown>,
  errors: M6AlphaScenarioSchemaError[]
): void {
  for (const key of REFERENCE_SET_KEYS) {
    validateArray(input, key, errors, `referenceTargets.${key}`);
    const values = input[key];
    if (Array.isArray(values)) {
      values.forEach((entry, index) =>
        validateReferenceTarget(entry, `referenceTargets.${key}[${index}]`, errors)
      );
    }
  }
}

function validateReferenceTarget(
  input: unknown,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, SOURCE_ID_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validateNullablePatternString(input, "claimId", `${path}.claimId`, CLAIM_ID_PATTERN, errors);
}

function validateScenarioRecord(
  input: unknown,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, SOURCE_ID_PATTERN, errors);
  validatePatternString(input, "scenarioKey", `${path}.scenarioKey`, SCENARIO_KEY_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validateIntegerInRange(input, "startYear", `${path}.startYear`, 1531, 1600, errors);
  validateIntegerInRange(input, "dependencyOrder", `${path}.dependencyOrder`, 1, 100, errors);
  validateStringUnion(input, "historicity", `${path}.historicity`, HISTORICITIES, errors);
  validateStringArray(input, "materialClaimIds", `${path}.materialClaimIds`, errors);
  validateRecord(input, "references", errors, `${path}.references`);
  const references = input["references"];
  if (isRecord(references)) {
    validateReferenceSets(references, `${path}.references`, errors);
  }
}

function validateReferenceSets(
  input: Record<string, unknown>,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
): void {
  for (const key of REFERENCE_SET_KEYS) {
    validateStringArray(input, key, `${path}.${key}`, errors);
  }
}

function parseSourceRef(input: unknown): M6AlphaScenarioSourceRefV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha scenario source reference.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    sourceType: readSourceType(input, "sourceType"),
    citationKey: readString(input, "citationKey"),
    accessNote: readString(input, "accessNote")
  };
}

function parseClaimRecord(input: unknown): M6AlphaScenarioClaimRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha scenario claim record.");
  }

  return {
    claimId: readString(input, "claimId"),
    claim: readString(input, "claim"),
    historicity: readHistoricity(input, "historicity"),
    confidence: readConfidence(input, "confidence"),
    sourceIds: readArray(input, "sourceIds").map(readStringValue),
    sourcePassages: readArray(input, "sourcePassages").map(readStringValue),
    competingInterpretations: readArray(input, "competingInterpretations").map(readStringValue),
    gameAbstraction: readString(input, "gameAbstraction"),
    researchStatus: readResearchStatus(input, "researchStatus")
  };
}

function parseReferenceTargets(input: Record<string, unknown>): M6AlphaScenarioReferenceTargetsV0 {
  return {
    diplomacy: readArray(input, "diplomacy").map(parseReferenceTarget),
    legitimacy: readArray(input, "legitimacy").map(parseReferenceTarget),
    succession: readArray(input, "succession").map(parseReferenceTarget),
    mapCandidates: readArray(input, "mapCandidates").map(parseReferenceTarget),
    policies: readArray(input, "policies").map(parseReferenceTarget),
    events: readArray(input, "events").map(parseReferenceTarget),
    encyclopediaEntries: readArray(input, "encyclopediaEntries").map(parseReferenceTarget),
    startToVictoryFixtures: readArray(input, "startToVictoryFixtures").map(parseReferenceTarget)
  };
}

function parseReferenceTarget(input: unknown): M6AlphaScenarioReferenceTargetV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha scenario reference target.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    claimId: readNullableString(input, "claimId")
  };
}

function parseScenarioRecord(input: unknown): M6AlphaScenarioRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha scenario record.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    scenarioKey: readString(input, "scenarioKey"),
    displayNameKey: readString(input, "displayNameKey"),
    startYear: readIntegerInRange(input, "startYear", 1531, 1600),
    dependencyOrder: readIntegerInRange(input, "dependencyOrder", 1, 100),
    historicity: readHistoricity(input, "historicity"),
    materialClaimIds: readArray(input, "materialClaimIds").map(readStringValue),
    references: parseReferenceSets(readRecord(input, "references"))
  };
}

function parseReferenceSets(input: Record<string, unknown>): M6AlphaScenarioReferenceSetsV0 {
  return {
    diplomacy: readArray(input, "diplomacy").map(readStringValue),
    legitimacy: readArray(input, "legitimacy").map(readStringValue),
    succession: readArray(input, "succession").map(readStringValue),
    mapCandidates: readArray(input, "mapCandidates").map(readStringValue),
    policies: readArray(input, "policies").map(readStringValue),
    events: readArray(input, "events").map(readStringValue),
    encyclopediaEntries: readArray(input, "encyclopediaEntries").map(readStringValue),
    startToVictoryFixtures: readArray(input, "startToVictoryFixtures").map(readStringValue)
  };
}

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: M6AlphaScenarioSchemaError[]
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ code: "invalid-schema", path: key, message: `${key} must be ${expected}.` });
}

function validateExactNumber(
  record: Record<string, unknown>,
  key: string,
  expected: number,
  errors: M6AlphaScenarioSchemaError[]
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ code: "invalid-schema", path: key, message: `${key} must be ${expected}.` });
}

function validateNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
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
  errors: M6AlphaScenarioSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && pattern.test(value)) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must match ${pattern.source}.` });
}

function validateNullablePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: M6AlphaScenarioSchemaError[]
): void {
  const value = record[key];
  if (value === null || (typeof value === "string" && pattern.test(value))) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be null or match ${pattern.source}.`
  });
}

function validateStringUnion(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: M6AlphaScenarioSchemaError[]
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
  errors: M6AlphaScenarioSchemaError[]
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

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: M6AlphaScenarioSchemaError[],
  path = key
): void {
  if (Array.isArray(record[key])) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
}

function validateRecord(
  record: Record<string, unknown>,
  key: string,
  errors: M6AlphaScenarioSchemaError[],
  path = key
): void {
  if (isRecord(record[key])) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
}

function validateStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M6AlphaScenarioSchemaError[]
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

function readArray(record: Record<string, unknown>, key: string): readonly unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array.`);
  }
  return value;
}

function readRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(`${key} must be an object.`);
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

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null || typeof value === "string") {
    return value;
  }
  throw new Error(`${key} must be null or a string.`);
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

function readHistoricity(record: Record<string, unknown>, key: string): M6AlphaScenarioHistoricity {
  const value = readString(record, key);
  if (HISTORICITIES.includes(value as M6AlphaScenarioHistoricity)) {
    return value as M6AlphaScenarioHistoricity;
  }
  throw new Error(`${key} must be a valid M6 historicity value.`);
}

function readConfidence(record: Record<string, unknown>, key: string): M6AlphaScenarioConfidence {
  const value = readString(record, key);
  if (CONFIDENCES.includes(value as M6AlphaScenarioConfidence)) {
    return value as M6AlphaScenarioConfidence;
  }
  throw new Error(`${key} must be a valid M6 confidence value.`);
}

function readResearchStatus(
  record: Record<string, unknown>,
  key: string
): M6AlphaScenarioResearchStatus {
  const value = readString(record, key);
  if (RESEARCH_STATUSES.includes(value as M6AlphaScenarioResearchStatus)) {
    return value as M6AlphaScenarioResearchStatus;
  }
  throw new Error(`${key} must be a valid M6 research status value.`);
}

function readSourceType(record: Record<string, unknown>, key: string): M6AlphaScenarioSourceType {
  const value = readString(record, key);
  if (SOURCE_TYPES.includes(value as M6AlphaScenarioSourceType)) {
    return value as M6AlphaScenarioSourceType;
  }
  throw new Error(`${key} must be a valid M6 source type value.`);
}

function formatErrors(errors: readonly M6AlphaScenarioSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

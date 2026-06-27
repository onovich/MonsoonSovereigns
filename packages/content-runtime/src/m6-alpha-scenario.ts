import type {
  M6AlphaScenarioClaimRecordV0,
  M6AlphaScenarioConfidence,
  M6AlphaScenarioHistoricity,
  M6AlphaScenarioRecordV0,
  M6AlphaScenarioReferenceSetsV0,
  M6AlphaScenarioReferenceTargetV0,
  M6AlphaScenarioReferenceTargetsV0,
  M6AlphaScenarioResearchStatus,
  M6AlphaScenarioSourceRefV0,
  M6AlphaScenarioSourceType
} from "@monsoon/content-schema";

export type M6AlphaScenarioManifestHash = string & {
  readonly __brand: "M6AlphaScenarioManifestHash";
};

export interface RuntimeM6AlphaScenarioContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: "alpha-scenario-set";
  readonly syntheticScope: "m6-alpha-validation";
  readonly manifestHash: M6AlphaScenarioManifestHash;
  readonly sourceCount: number;
  readonly claimCount: number;
  readonly referenceTargetCount: number;
  readonly scenarioCount: number;
}

export interface RuntimeM6AlphaScenarioContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m6-alpha-scenario-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeM6AlphaScenarioContentManifestV0;
  readonly sources: readonly M6AlphaScenarioSourceRefV0[];
  readonly claims: readonly M6AlphaScenarioClaimRecordV0[];
  readonly referenceTargets: M6AlphaScenarioReferenceTargetsV0;
  readonly scenarios: readonly M6AlphaScenarioRecordV0[];
}

export interface RuntimeM6AlphaScenarioContentPackIndexV0 {
  readonly pack: RuntimeM6AlphaScenarioContentPackV0;
  getScenario(sourceId: string): M6AlphaScenarioRecordV0 | undefined;
  getClaim(claimId: string): M6AlphaScenarioClaimRecordV0 | undefined;
  getSource(sourceId: string): M6AlphaScenarioSourceRefV0 | undefined;
}

interface RuntimeValidationError {
  readonly path: string;
  readonly message: string;
}

const HASH_PATTERN = /^[0-9a-f]{8}$/u;
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

export function parseM6AlphaScenarioManifestHash(input: unknown): M6AlphaScenarioManifestHash {
  if (typeof input !== "string" || !HASH_PATTERN.test(input)) {
    throw new Error("M6 alpha scenario manifest hash must be 8 lowercase hexadecimal characters.");
  }
  return input as M6AlphaScenarioManifestHash;
}

export function validateRuntimeM6AlphaScenarioContentPackV0(
  input: unknown
): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime M6 alpha scenario content pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRoot(input, errors);
  validateArrayEntries(input, errors);
  if (errors.length > 0) {
    return errors;
  }
  validateSemantics(input, errors);
  return errors;
}

export function parseRuntimeM6AlphaScenarioContentPackV0(
  input: unknown
): RuntimeM6AlphaScenarioContentPackV0 {
  const errors = validateRuntimeM6AlphaScenarioContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(`RuntimeM6AlphaScenarioContentPackV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("RuntimeM6AlphaScenarioContentPackV0 invalid: root was not an object.");
  }

  const manifest = readRecord(input, "manifest");
  const pack = {
    schemaVersion: 1 as const,
    kind: "runtime-m6-alpha-scenario-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    manifest: Object.freeze({
      schemaVersion: 1 as const,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "alpha-scenario-set" as const,
      syntheticScope: "m6-alpha-validation" as const,
      manifestHash: parseM6AlphaScenarioManifestHash(readString(manifest, "manifestHash")),
      sourceCount: readPositiveInteger(manifest, "sourceCount"),
      claimCount: readPositiveInteger(manifest, "claimCount"),
      referenceTargetCount: readPositiveInteger(manifest, "referenceTargetCount"),
      scenarioCount: readPositiveInteger(manifest, "scenarioCount")
    }),
    sources: Object.freeze(readArray(input, "sources").map(parseSourceRef)),
    claims: Object.freeze(readArray(input, "claims").map(parseClaimRecord)),
    referenceTargets: freezeReferenceTargets(
      parseReferenceTargets(readRecord(input, "referenceTargets"))
    ),
    scenarios: Object.freeze(readArray(input, "scenarios").map(parseScenarioRecord))
  };

  return Object.freeze(pack);
}

export function createRuntimeM6AlphaScenarioContentPackIndexV0(
  pack: RuntimeM6AlphaScenarioContentPackV0
): RuntimeM6AlphaScenarioContentPackIndexV0 {
  const scenarioBySourceId = new Map<string, M6AlphaScenarioRecordV0>();
  const claimById = new Map<string, M6AlphaScenarioClaimRecordV0>();
  const sourceById = new Map<string, M6AlphaScenarioSourceRefV0>();

  for (const scenario of pack.scenarios) {
    scenarioBySourceId.set(scenario.sourceId, scenario);
  }
  for (const claim of pack.claims) {
    claimById.set(claim.claimId, claim);
  }
  for (const source of pack.sources) {
    sourceById.set(source.sourceId, source);
  }

  return Object.freeze({
    pack,
    getScenario(sourceId: string): M6AlphaScenarioRecordV0 | undefined {
      return scenarioBySourceId.get(sourceId);
    },
    getClaim(claimId: string): M6AlphaScenarioClaimRecordV0 | undefined {
      return claimById.get(claimId);
    },
    getSource(sourceId: string): M6AlphaScenarioSourceRefV0 | undefined {
      return sourceById.get(sourceId);
    }
  });
}

function validateRoot(input: Record<string, unknown>, errors: RuntimeValidationError[]): void {
  validateExactNumber(input, "schemaVersion", 1, errors);
  validateExactString(input, "kind", "runtime-m6-alpha-scenario-content-pack-v0", errors);
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);
  validateRecord(input, "manifest", errors);
  validateArray(input, "sources", errors);
  validateArray(input, "claims", errors);
  validateRecord(input, "referenceTargets", errors);
  validateArray(input, "scenarios", errors);

  const manifest = input["manifest"];
  if (isRecord(manifest)) {
    validateExactNumber(manifest, "schemaVersion", 1, errors, "manifest.schemaVersion");
    validateExactString(
      manifest,
      "fixtureKind",
      "alpha-scenario-set",
      errors,
      "manifest.fixtureKind"
    );
    validateExactString(
      manifest,
      "syntheticScope",
      "m6-alpha-validation",
      errors,
      "manifest.syntheticScope"
    );
    validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
    validateHashString(manifest, "manifestHash", "manifest.manifestHash", errors);
    validatePositiveIntegerField(manifest, "sourceCount", "manifest.sourceCount", errors);
    validatePositiveIntegerField(manifest, "claimCount", "manifest.claimCount", errors);
    validatePositiveIntegerField(
      manifest,
      "referenceTargetCount",
      "manifest.referenceTargetCount",
      errors
    );
    validatePositiveIntegerField(manifest, "scenarioCount", "manifest.scenarioCount", errors);
  }
}

function validateArrayEntries(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
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
}

function validateSemantics(input: Record<string, unknown>, errors: RuntimeValidationError[]): void {
  const manifest = readRecord(input, "manifest");
  const sources = readArray(input, "sources");
  const claims = readArray(input, "claims");
  const referenceTargets = readRecord(input, "referenceTargets");
  const scenarios = readArray(input, "scenarios");
  const referenceTargetCount = countReferenceTargets(referenceTargets);

  validateRuntimeCount(manifest, "sourceCount", sources.length, errors);
  validateRuntimeCount(manifest, "claimCount", claims.length, errors);
  validateRuntimeCount(manifest, "referenceTargetCount", referenceTargetCount, errors);
  validateRuntimeCount(manifest, "scenarioCount", scenarios.length, errors);
  collectOrderedIds(sources, "sources", "sourceId", errors);
  collectOrderedIds(claims, "claims", "claimId", errors);
  for (const key of REFERENCE_SET_KEYS) {
    collectOrderedIds(
      readArray(referenceTargets, key),
      `referenceTargets.${key}`,
      "sourceId",
      errors
    );
  }
  collectOrderedIds(scenarios, "scenarios", "sourceId", errors);
}

function validateSourceRef(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateStringUnion(input, "sourceType", `${path}.sourceType`, SOURCE_TYPES, errors);
  validateNonEmptyString(input, "citationKey", `${path}.citationKey`, errors);
  validateNonEmptyString(input, "accessNote", `${path}.accessNote`, errors);
}

function validateClaimRecord(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validateNonEmptyString(input, "claimId", `${path}.claimId`, errors);
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
  errors: RuntimeValidationError[]
): void {
  for (const key of REFERENCE_SET_KEYS) {
    validateArray(input, key, errors, `referenceTargets.${key}`);
    const targets = input[key];
    if (Array.isArray(targets)) {
      targets.forEach((target, index) =>
        validateReferenceTarget(target, `referenceTargets.${key}[${index}]`, errors)
      );
    }
  }
}

function validateReferenceTarget(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateNullableStringField(input, "claimId", `${path}.claimId`, errors);
}

function validateScenarioRecord(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyString(input, "scenarioKey", `${path}.scenarioKey`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateIntegerFieldInRange(input, "startYear", `${path}.startYear`, 1531, 1600, errors);
  validateIntegerFieldInRange(input, "dependencyOrder", `${path}.dependencyOrder`, 1, 100, errors);
  validateStringUnion(input, "historicity", `${path}.historicity`, HISTORICITIES, errors);
  validateStringArray(input, "materialClaimIds", `${path}.materialClaimIds`, errors);
  validateRecord(input, "references", errors, `${path}.references`);
  const references = input["references"];
  if (isRecord(references)) {
    for (const key of REFERENCE_SET_KEYS) {
      validateStringArray(references, key, `${path}.references.${key}`, errors);
    }
  }
}

function parseSourceRef(input: unknown): M6AlphaScenarioSourceRefV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 source reference.");
  }
  return Object.freeze({
    sourceId: readString(input, "sourceId"),
    sourceType: readSourceType(input, "sourceType"),
    citationKey: readString(input, "citationKey"),
    accessNote: readString(input, "accessNote")
  });
}

function parseClaimRecord(input: unknown): M6AlphaScenarioClaimRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 claim record.");
  }
  return Object.freeze({
    claimId: readString(input, "claimId"),
    claim: readString(input, "claim"),
    historicity: readHistoricity(input, "historicity"),
    confidence: readConfidence(input, "confidence"),
    sourceIds: Object.freeze(readArray(input, "sourceIds").map(readStringValue)),
    sourcePassages: Object.freeze(readArray(input, "sourcePassages").map(readStringValue)),
    competingInterpretations: Object.freeze(
      readArray(input, "competingInterpretations").map(readStringValue)
    ),
    gameAbstraction: readString(input, "gameAbstraction"),
    researchStatus: readResearchStatus(input, "researchStatus")
  });
}

function parseReferenceTargets(input: Record<string, unknown>): M6AlphaScenarioReferenceTargetsV0 {
  return {
    diplomacy: Object.freeze(readArray(input, "diplomacy").map(parseReferenceTarget)),
    legitimacy: Object.freeze(readArray(input, "legitimacy").map(parseReferenceTarget)),
    succession: Object.freeze(readArray(input, "succession").map(parseReferenceTarget)),
    mapCandidates: Object.freeze(readArray(input, "mapCandidates").map(parseReferenceTarget)),
    policies: Object.freeze(readArray(input, "policies").map(parseReferenceTarget)),
    events: Object.freeze(readArray(input, "events").map(parseReferenceTarget)),
    encyclopediaEntries: Object.freeze(
      readArray(input, "encyclopediaEntries").map(parseReferenceTarget)
    ),
    startToVictoryFixtures: Object.freeze(
      readArray(input, "startToVictoryFixtures").map(parseReferenceTarget)
    )
  };
}

function parseReferenceTarget(input: unknown): M6AlphaScenarioReferenceTargetV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 reference target.");
  }
  return Object.freeze({
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    claimId: readNullableString(input, "claimId")
  });
}

function parseScenarioRecord(input: unknown): M6AlphaScenarioRecordV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 scenario record.");
  }
  return Object.freeze({
    sourceId: readString(input, "sourceId"),
    scenarioKey: readString(input, "scenarioKey"),
    displayNameKey: readString(input, "displayNameKey"),
    startYear: readIntegerInRange(input, "startYear", 1531, 1600),
    dependencyOrder: readIntegerInRange(input, "dependencyOrder", 1, 100),
    historicity: readHistoricity(input, "historicity"),
    materialClaimIds: Object.freeze(readArray(input, "materialClaimIds").map(readStringValue)),
    references: freezeReferenceSets(parseReferenceSets(readRecord(input, "references")))
  });
}

function parseReferenceSets(input: Record<string, unknown>): M6AlphaScenarioReferenceSetsV0 {
  return {
    diplomacy: Object.freeze(readArray(input, "diplomacy").map(readStringValue)),
    legitimacy: Object.freeze(readArray(input, "legitimacy").map(readStringValue)),
    succession: Object.freeze(readArray(input, "succession").map(readStringValue)),
    mapCandidates: Object.freeze(readArray(input, "mapCandidates").map(readStringValue)),
    policies: Object.freeze(readArray(input, "policies").map(readStringValue)),
    events: Object.freeze(readArray(input, "events").map(readStringValue)),
    encyclopediaEntries: Object.freeze(
      readArray(input, "encyclopediaEntries").map(readStringValue)
    ),
    startToVictoryFixtures: Object.freeze(
      readArray(input, "startToVictoryFixtures").map(readStringValue)
    )
  };
}

function freezeReferenceTargets(
  targets: M6AlphaScenarioReferenceTargetsV0
): M6AlphaScenarioReferenceTargetsV0 {
  return Object.freeze(targets);
}

function freezeReferenceSets(sets: M6AlphaScenarioReferenceSetsV0): M6AlphaScenarioReferenceSetsV0 {
  return Object.freeze(sets);
}

function countReferenceTargets(referenceTargets: Record<string, unknown>): number {
  return REFERENCE_SET_KEYS.reduce(
    (count, key) => count + readArray(referenceTargets, key).length,
    0
  );
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
      return;
    }
    const id = readString(entry, key);
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

function validateNullableStringField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (value === null || (typeof value === "string" && value.length > 0)) {
    return;
  }
  errors.push({ path, message: `${path} must be null or a non-empty string.` });
}

function validateIntegerFieldInRange(
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
  errors.push({ path, message: `${path} must be a safe integer from ${minimum} to ${maximum}.` });
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

function readRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(`${key} must be an object.`);
  }
  return value;
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

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null || typeof value === "string") {
    return value;
  }
  throw new Error(`${key} must be null or a string.`);
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

function formatErrors(errors: readonly RuntimeValidationError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

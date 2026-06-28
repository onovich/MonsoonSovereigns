import type {
  M7BetaClaimRecordV0,
  M7BetaEventRecordV0,
  M7BetaLocalizationRecordV0,
  M7BetaPersonRecordV0,
  M7BetaScenarioRecordV0,
  M7BetaSourceRecordV0,
  M7BetaTitleRecordV0
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

const HASH_PATTERN = /^[0-9a-f]{8}$/u;

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
    sourceRecords: Object.freeze(readArray(input, "sourceRecords") as M7BetaSourceRecordV0[]),
    claimRecords: Object.freeze(readArray(input, "claimRecords") as M7BetaClaimRecordV0[]),
    localization: Object.freeze(readArray(input, "localization") as M7BetaLocalizationRecordV0[]),
    titles: Object.freeze(readArray(input, "titles") as M7BetaTitleRecordV0[]),
    persons: Object.freeze(readArray(input, "persons") as M7BetaPersonRecordV0[]),
    events: Object.freeze(readArray(input, "events") as M7BetaEventRecordV0[]),
    scenarios: Object.freeze(readArray(input, "scenarios") as M7BetaScenarioRecordV0[]),
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

function readPositiveInteger(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive safe integer.`);
  }
  return value;
}

function formatErrors(errors: readonly RuntimeValidationError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

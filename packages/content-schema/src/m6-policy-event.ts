export const M6_POLICY_EVENT_SOURCE_V0_SCHEMA_VERSION = 1;

export type M6PolicyEventSourceKind = "m6.policy-event-definition-set";
export type M6PolicyEventConsequenceKind = "policy-modifier";

export interface M6PolicyEventSchemaError {
  readonly path: string;
  readonly message: string;
}

export interface M6PolicyDefinitionSourceV0 {
  readonly policyId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface M6PolicyEventCauseSourceV0 {
  readonly kind: "day-at-least";
  readonly day: number;
  readonly reasonCodes: readonly string[];
}

export interface M6PolicyEventConsequenceSourceV0 {
  readonly kind: M6PolicyEventConsequenceKind;
  readonly policyId: number;
  readonly magnitudeBps: number;
  readonly durationDays: number;
  readonly reasonCode: string;
}

export interface M6PolicyEventOptionSourceV0 {
  readonly optionId: number;
  readonly displayNameKey: string;
  readonly consequences: readonly M6PolicyEventConsequenceSourceV0[];
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface M6PolicyEventDefinitionSourceV0 {
  readonly eventDefinitionId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly cause: M6PolicyEventCauseSourceV0;
  readonly options: readonly M6PolicyEventOptionSourceV0[];
  readonly reasonCodes: readonly string[];
  readonly encyclopediaRefs: readonly string[];
}

export interface M6PolicyEventDefinitionSetSourceV0 {
  readonly schemaVersion: typeof M6_POLICY_EVENT_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M6PolicyEventSourceKind;
  readonly fixtureId: string;
  readonly manifestHash: string;
  readonly policies: readonly M6PolicyDefinitionSourceV0[];
  readonly events: readonly M6PolicyEventDefinitionSourceV0[];
}

const FIXTURE_ID_PATTERN = /^m6\.policy-event\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;
const MANIFEST_HASH_PATTERN = /^[0-9a-f]{8}$/u;
const DISPLAY_NAME_KEY_PATTERN = /^content\.m6\.policy-event\.[a-z0-9_.-]+$/u;
const REASON_CODE_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;
const ENCYCLOPEDIA_REF_PATTERN = /^encyclopedia\.m6\.[a-z0-9_.-]+$/u;
const SOURCE_ID_PATTERN = /^m6\.policy-event\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;

export function validateM6PolicyEventDefinitionSetSourceV0(
  input: unknown
): readonly M6PolicyEventSchemaError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "M6 policy/event definition set must be an object." }];
  }

  const errors: M6PolicyEventSchemaError[] = [];
  validateExactKeys(
    input,
    ["schemaVersion", "kind", "fixtureId", "manifestHash", "policies", "events"],
    "$",
    errors
  );
  validateExactNumber(input, "schemaVersion", M6_POLICY_EVENT_SOURCE_V0_SCHEMA_VERSION, errors);
  validateExactString(input, "kind", "m6.policy-event-definition-set", errors);
  validatePatternString(input, "fixtureId", "fixtureId", FIXTURE_ID_PATTERN, errors);
  validatePatternString(input, "manifestHash", "manifestHash", MANIFEST_HASH_PATTERN, errors);
  validateArray(input, "policies", errors);
  validateArray(input, "events", errors);

  const policies = input["policies"];
  const events = input["events"];
  if (Array.isArray(policies)) {
    policies.forEach((policy, index) => validatePolicy(policy, `policies[${index}]`, errors));
    collectOrderedIds(policies, "policies", "policyId", errors);
  }
  if (Array.isArray(events)) {
    events.forEach((event, index) => validateEvent(event, `events[${index}]`, errors));
    collectOrderedIds(events, "events", "eventDefinitionId", errors);
  }

  validateReferences(input, errors);
  return errors;
}

export function parseM6PolicyEventDefinitionSetSourceV0(
  input: unknown
): M6PolicyEventDefinitionSetSourceV0 {
  const errors = validateM6PolicyEventDefinitionSetSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M6PolicyEventDefinitionSetSourceV0 invalid: ${formatErrors(errors)}`);
  }
  if (!isRecord(input)) {
    throw new Error("M6PolicyEventDefinitionSetSourceV0 invalid: root was not an object.");
  }
  return Object.freeze({
    schemaVersion: M6_POLICY_EVENT_SOURCE_V0_SCHEMA_VERSION,
    kind: "m6.policy-event-definition-set" as const,
    fixtureId: readString(input, "fixtureId"),
    manifestHash: readString(input, "manifestHash"),
    policies: Object.freeze(readArray(input, "policies").map(parsePolicy)),
    events: Object.freeze(readArray(input, "events").map(parseEvent))
  });
}

function validatePolicy(input: unknown, path: string, errors: M6PolicyEventSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "M6 policy definition must be an object." });
    return;
  }
  validateExactKeys(
    input,
    ["policyId", "sourceId", "displayNameKey", "reasonCodes", "encyclopediaRefs"],
    path,
    errors
  );
  validatePositiveInteger(input, "policyId", `${path}.policyId`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, SOURCE_ID_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validatePatternArray(input["reasonCodes"], `${path}.reasonCodes`, REASON_CODE_PATTERN, errors);
  validatePatternArray(
    input["encyclopediaRefs"],
    `${path}.encyclopediaRefs`,
    ENCYCLOPEDIA_REF_PATTERN,
    errors
  );
}

function validateEvent(input: unknown, path: string, errors: M6PolicyEventSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "M6 event definition must be an object." });
    return;
  }
  validateExactKeys(
    input,
    [
      "eventDefinitionId",
      "sourceId",
      "displayNameKey",
      "cause",
      "options",
      "reasonCodes",
      "encyclopediaRefs"
    ],
    path,
    errors
  );
  validatePositiveInteger(input, "eventDefinitionId", `${path}.eventDefinitionId`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, SOURCE_ID_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validateCause(input["cause"], `${path}.cause`, errors);
  validateArray(input, "options", errors, `${path}.options`);
  validatePatternArray(input["reasonCodes"], `${path}.reasonCodes`, REASON_CODE_PATTERN, errors);
  validatePatternArray(
    input["encyclopediaRefs"],
    `${path}.encyclopediaRefs`,
    ENCYCLOPEDIA_REF_PATTERN,
    errors
  );
  const options = input["options"];
  if (Array.isArray(options)) {
    options.forEach((option, index) => validateOption(option, `${path}.options[${index}]`, errors));
    collectOrderedIds(options, `${path}.options`, "optionId", errors);
  }
}

function validateCause(input: unknown, path: string, errors: M6PolicyEventSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "M6 event cause must be an object." });
    return;
  }
  validateExactKeys(input, ["kind", "day", "reasonCodes"], path, errors);
  validateExactString(input, "kind", "day-at-least", errors, `${path}.kind`);
  validateNonnegativeInteger(input, "day", `${path}.day`, errors);
  validatePatternArray(input["reasonCodes"], `${path}.reasonCodes`, REASON_CODE_PATTERN, errors);
}

function validateOption(input: unknown, path: string, errors: M6PolicyEventSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "M6 event option must be an object." });
    return;
  }
  validateExactKeys(
    input,
    ["optionId", "displayNameKey", "consequences", "reasonCodes", "encyclopediaRefs"],
    path,
    errors
  );
  validatePositiveInteger(input, "optionId", `${path}.optionId`, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validateArray(input, "consequences", errors, `${path}.consequences`);
  validatePatternArray(input["reasonCodes"], `${path}.reasonCodes`, REASON_CODE_PATTERN, errors);
  validatePatternArray(
    input["encyclopediaRefs"],
    `${path}.encyclopediaRefs`,
    ENCYCLOPEDIA_REF_PATTERN,
    errors
  );
  const consequences = input["consequences"];
  if (Array.isArray(consequences)) {
    consequences.forEach((consequence, index) =>
      validateConsequence(consequence, `${path}.consequences[${index}]`, errors)
    );
  }
}

function validateConsequence(
  input: unknown,
  path: string,
  errors: M6PolicyEventSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "M6 event consequence must be an object." });
    return;
  }
  validateExactKeys(
    input,
    ["kind", "policyId", "magnitudeBps", "durationDays", "reasonCode"],
    path,
    errors
  );
  validateExactString(input, "kind", "policy-modifier", errors, `${path}.kind`);
  validatePositiveInteger(input, "policyId", `${path}.policyId`, errors);
  validateIntegerInRange(input, "magnitudeBps", `${path}.magnitudeBps`, -10_000, 10_000, errors);
  validatePositiveInteger(input, "durationDays", `${path}.durationDays`, errors);
  validatePatternString(input, "reasonCode", `${path}.reasonCode`, REASON_CODE_PATTERN, errors);
}

function validateReferences(
  root: Record<string, unknown>,
  errors: M6PolicyEventSchemaError[]
): void {
  const policies = root["policies"];
  const events = root["events"];
  if (!Array.isArray(policies) || !Array.isArray(events)) {
    return;
  }
  const policyIds = new Set<number>();
  for (const policy of policies) {
    if (isRecord(policy) && isPositiveInteger(policy["policyId"])) {
      policyIds.add(policy["policyId"]);
    }
  }
  events.forEach((event, eventIndex) => {
    if (!isRecord(event) || !Array.isArray(event["options"])) {
      return;
    }
    event["options"].forEach((option, optionIndex) => {
      if (!isRecord(option) || !Array.isArray(option["consequences"])) {
        return;
      }
      option["consequences"].forEach((consequence, consequenceIndex) => {
        if (!isRecord(consequence) || !isPositiveInteger(consequence["policyId"])) {
          return;
        }
        if (!policyIds.has(consequence["policyId"])) {
          errors.push({
            path: `events[${eventIndex}].options[${optionIndex}].consequences[${consequenceIndex}].policyId`,
            message: `Missing policyId ${consequence["policyId"]}.`
          });
        }
      });
    });
  });
}

function parsePolicy(input: unknown): M6PolicyDefinitionSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 policy definition.");
  }
  return Object.freeze({
    policyId: readNumber(input, "policyId"),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    reasonCodes: Object.freeze(readArray(input, "reasonCodes").map(readArrayString)),
    encyclopediaRefs: Object.freeze(readArray(input, "encyclopediaRefs").map(readArrayString))
  });
}

function parseEvent(input: unknown): M6PolicyEventDefinitionSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 event definition.");
  }
  return Object.freeze({
    eventDefinitionId: readNumber(input, "eventDefinitionId"),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    cause: parseCause(readRecord(input, "cause")),
    options: Object.freeze(readArray(input, "options").map(parseOption)),
    reasonCodes: Object.freeze(readArray(input, "reasonCodes").map(readArrayString)),
    encyclopediaRefs: Object.freeze(readArray(input, "encyclopediaRefs").map(readArrayString))
  });
}

function parseCause(input: Record<string, unknown>): M6PolicyEventCauseSourceV0 {
  return Object.freeze({
    kind: "day-at-least",
    day: readNumber(input, "day"),
    reasonCodes: Object.freeze(readArray(input, "reasonCodes").map(readArrayString))
  });
}

function parseOption(input: unknown): M6PolicyEventOptionSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 event option.");
  }
  return Object.freeze({
    optionId: readNumber(input, "optionId"),
    displayNameKey: readString(input, "displayNameKey"),
    consequences: Object.freeze(readArray(input, "consequences").map(parseConsequence)),
    reasonCodes: Object.freeze(readArray(input, "reasonCodes").map(readArrayString)),
    encyclopediaRefs: Object.freeze(readArray(input, "encyclopediaRefs").map(readArrayString))
  });
}

function parseConsequence(input: unknown): M6PolicyEventConsequenceSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 event consequence.");
  }
  return Object.freeze({
    kind: "policy-modifier",
    policyId: readNumber(input, "policyId"),
    magnitudeBps: readNumber(input, "magnitudeBps"),
    durationDays: readNumber(input, "durationDays"),
    reasonCode: readString(input, "reasonCode")
  });
}

function validateExactKeys(
  record: Record<string, unknown>,
  keys: readonly string[],
  path: string,
  errors: M6PolicyEventSchemaError[]
): void {
  const allowed = new Set(keys);
  for (const key of Object.keys(record).sort(compareText)) {
    if (!allowed.has(key)) {
      errors.push({ path: path === "$" ? key : `${path}.${key}`, message: "Unexpected field." });
    }
  }
}

function validateExactNumber(
  record: Record<string, unknown>,
  key: string,
  expected: number,
  errors: M6PolicyEventSchemaError[]
): void {
  if (record[key] !== expected) {
    errors.push({ path: key, message: `${key} must be ${expected}.` });
  }
}

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: M6PolicyEventSchemaError[],
  path = key
): void {
  if (record[key] !== expected) {
    errors.push({ path, message: `${path} must be ${expected}.` });
  }
}

function validatePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: M6PolicyEventSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && pattern.test(value)) {
    return;
  }
  errors.push({ path, message: `${path} must match ${pattern.source}.` });
}

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: M6PolicyEventSchemaError[],
  path = key
): void {
  if (!Array.isArray(record[key])) {
    errors.push({ path, message: `${path} must be an array.` });
  }
}

function validatePatternArray(
  input: unknown,
  path: string,
  pattern: RegExp,
  errors: M6PolicyEventSchemaError[]
): void {
  if (!Array.isArray(input)) {
    errors.push({ path, message: `${path} must be an array.` });
    return;
  }
  input.forEach((entry, index) => {
    if (typeof entry !== "string" || !pattern.test(entry)) {
      errors.push({ path: `${path}[${index}]`, message: `${path}[${index}] has invalid value.` });
    }
  });
}

function validatePositiveInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M6PolicyEventSchemaError[]
): void {
  if (!isPositiveInteger(record[key])) {
    errors.push({ path, message: `${path} must be a positive safe integer.` });
  }
}

function validateNonnegativeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M6PolicyEventSchemaError[]
): void {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    errors.push({ path, message: `${path} must be a nonnegative safe integer.` });
  }
}

function validateIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: M6PolicyEventSchemaError[]
): void {
  const value = record[key];
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    errors.push({ path, message: `${path} must be a safe integer from ${minimum} to ${maximum}.` });
  }
}

function collectOrderedIds(
  values: readonly unknown[],
  path: string,
  idKey: string,
  errors: M6PolicyEventSchemaError[]
): void {
  const seen = new Set<number>();
  let previousId = 0;
  values.forEach((entry, index) => {
    if (!isRecord(entry) || !isPositiveInteger(entry[idKey])) {
      return;
    }
    const id = entry[idKey];
    if (seen.has(id)) {
      errors.push({ path: `${path}[${index}].${idKey}`, message: `Duplicate id ${id}.` });
    }
    if (id <= previousId) {
      errors.push({
        path: `${path}[${index}].${idKey}`,
        message: `${path} must be ordered by ${idKey}.`
      });
    }
    seen.add(id);
    previousId = id;
  });
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

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`${key} must be a safe integer.`);
  }
  return value;
}

function readArrayString(input: unknown): string {
  if (typeof input !== "string") {
    throw new Error("Expected string array entry.");
  }
  return input;
}

function formatErrors(errors: readonly M6PolicyEventSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
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

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

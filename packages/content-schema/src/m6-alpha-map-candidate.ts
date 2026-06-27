export const M6_ALPHA_MAP_CANDIDATE_SOURCE_V0_SCHEMA_VERSION = 1;

export type M6AlphaMapCandidateSourceKind = "m6.alpha-map-candidate-set";
export type M6AlphaMapCandidateFixtureKind = "alpha-map-candidate-set";
export type M6AlphaMapCandidateSyntheticScope = "m6-alpha-map-candidate-validation";
export type M6AlphaMapCandidateHistoricity = "HISTORICAL" | "INFERRED" | "COMPOSITE" | "FICTIONAL";
export type M6AlphaMapCandidateConfidence = "HIGH" | "MEDIUM" | "LOW" | "DISPUTED";
export type M6AlphaMapLandWaterClass = "land" | "water" | "coastal-interface";
export type M6AlphaMapRouteKind = "road" | "river" | "coast";
export type M6AlphaMapRouteWaterClass = "land" | "water" | "mixed";

export interface M6AlphaMapCandidateSchemaError {
  readonly code: "invalid-schema";
  readonly path: string;
  readonly message: string;
}

export interface M6AlphaMapPointSourceV0 {
  readonly x: number;
  readonly y: number;
}

export interface M6AlphaMapBoundsSourceV0 {
  readonly widthInMapUnits: number;
  readonly heightInMapUnits: number;
}

export interface M6AlphaMapDistrictSourceV0 {
  readonly sourceId: string;
  readonly districtReferenceId: string;
  readonly displayNameKey: string;
  readonly landWaterClass: M6AlphaMapLandWaterClass;
  readonly renderOrder: number;
  readonly anchor: M6AlphaMapPointSourceV0;
  readonly polygon: readonly M6AlphaMapPointSourceV0[];
}

export interface M6AlphaMapSettlementSourceV0 {
  readonly sourceId: string;
  readonly settlementReferenceId: string;
  readonly districtReferenceId: string;
  readonly displayNameKey: string;
  readonly renderOrder: number;
  readonly anchor: M6AlphaMapPointSourceV0;
}

export interface M6AlphaMapRouteSourceV0 {
  readonly sourceId: string;
  readonly routeReferenceId: string;
  readonly fromDistrictReferenceId: string;
  readonly toDistrictReferenceId: string;
  readonly routeKind: M6AlphaMapRouteKind;
  readonly waterClass: M6AlphaMapRouteWaterClass;
  readonly renderOrder: number;
  readonly points: readonly M6AlphaMapPointSourceV0[];
}

export interface M6AlphaMapCandidateSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly historicity: M6AlphaMapCandidateHistoricity;
  readonly confidence: M6AlphaMapCandidateConfidence;
  readonly sourceLabel: M6AlphaMapCandidateHistoricity;
  readonly reviewNotes: readonly string[];
  readonly bounds: M6AlphaMapBoundsSourceV0;
  readonly districts: readonly M6AlphaMapDistrictSourceV0[];
  readonly settlements: readonly M6AlphaMapSettlementSourceV0[];
  readonly routes: readonly M6AlphaMapRouteSourceV0[];
}

export interface M6AlphaMapCandidateSetSourceV0 {
  readonly schemaVersion: typeof M6_ALPHA_MAP_CANDIDATE_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M6AlphaMapCandidateSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M6AlphaMapCandidateFixtureKind;
  readonly syntheticScope: M6AlphaMapCandidateSyntheticScope;
  readonly candidates: readonly M6AlphaMapCandidateSourceV0[];
}

const FIXTURE_ID_PATTERN = /^m6\.alpha\.map\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/u;
const CANDIDATE_ID_PATTERN = /^map\.alpha\.[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const DISTRICT_REFERENCE_PATTERN = /^district\.alpha\.[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const SETTLEMENT_REFERENCE_PATTERN = /^settlement\.alpha\.[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ROUTE_REFERENCE_PATTERN = /^route\.alpha\.[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const DISPLAY_NAME_KEY_PATTERN = /^content\.m6\.alpha\.map\.[a-z0-9_.-]+$/u;
const HISTORICITIES: readonly M6AlphaMapCandidateHistoricity[] = [
  "HISTORICAL",
  "INFERRED",
  "COMPOSITE",
  "FICTIONAL"
];
const CONFIDENCES: readonly M6AlphaMapCandidateConfidence[] = ["HIGH", "MEDIUM", "LOW", "DISPUTED"];
const LAND_WATER_CLASSES: readonly M6AlphaMapLandWaterClass[] = [
  "land",
  "water",
  "coastal-interface"
];
const ROUTE_KINDS: readonly M6AlphaMapRouteKind[] = ["road", "river", "coast"];
const ROUTE_WATER_CLASSES: readonly M6AlphaMapRouteWaterClass[] = ["land", "water", "mixed"];

export function validateM6AlphaMapCandidateSetSourceV0(
  input: unknown
): readonly M6AlphaMapCandidateSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M6 alpha map candidate set source must be an object."
      }
    ];
  }

  const errors: M6AlphaMapCandidateSchemaError[] = [];
  validateRoot(input, errors);

  const candidates = input["candidates"];
  if (Array.isArray(candidates)) {
    candidates.forEach((candidate, index) =>
      validateCandidate(candidate, `candidates[${index}]`, errors)
    );
  }

  return errors;
}

export function parseM6AlphaMapCandidateSetSourceV0(
  input: unknown
): M6AlphaMapCandidateSetSourceV0 {
  const errors = validateM6AlphaMapCandidateSetSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M6AlphaMapCandidateSetSourceV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("M6AlphaMapCandidateSetSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M6_ALPHA_MAP_CANDIDATE_SOURCE_V0_SCHEMA_VERSION,
    kind: "m6.alpha-map-candidate-set",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "alpha-map-candidate-set",
    syntheticScope: "m6-alpha-map-candidate-validation",
    candidates: readArray(input, "candidates").map(parseCandidate)
  };
}

function validateRoot(
  input: Record<string, unknown>,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  validateExactNumber(
    input,
    "schemaVersion",
    M6_ALPHA_MAP_CANDIDATE_SOURCE_V0_SCHEMA_VERSION,
    errors
  );
  validateExactString(input, "kind", "m6.alpha-map-candidate-set", errors);
  validatePatternString(input, "fixtureId", "fixtureId", FIXTURE_ID_PATTERN, errors);
  validateExactString(input, "fixtureKind", "alpha-map-candidate-set", errors);
  validateExactString(input, "syntheticScope", "m6-alpha-map-candidate-validation", errors);
  validateArray(input, "candidates", errors);
}

function validateCandidate(
  input: unknown,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, CANDIDATE_ID_PATTERN, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validateStringUnion(input, "historicity", `${path}.historicity`, HISTORICITIES, errors);
  validateStringUnion(input, "confidence", `${path}.confidence`, CONFIDENCES, errors);
  validateStringUnion(input, "sourceLabel", `${path}.sourceLabel`, HISTORICITIES, errors);
  validateStringArray(input, "reviewNotes", `${path}.reviewNotes`, errors);
  validateRecord(input, "bounds", errors, `${path}.bounds`);
  const bounds = input["bounds"];
  if (isRecord(bounds)) {
    validatePositiveInteger(bounds, "widthInMapUnits", `${path}.bounds.widthInMapUnits`, errors);
    validatePositiveInteger(bounds, "heightInMapUnits", `${path}.bounds.heightInMapUnits`, errors);
  }
  validateArray(input, "districts", errors, `${path}.districts`);
  validateArray(input, "settlements", errors, `${path}.settlements`);
  validateArray(input, "routes", errors, `${path}.routes`);

  const districts = input["districts"];
  if (Array.isArray(districts)) {
    districts.forEach((district, index) =>
      validateDistrict(district, `${path}.districts[${index}]`, errors)
    );
  }
  const settlements = input["settlements"];
  if (Array.isArray(settlements)) {
    settlements.forEach((settlement, index) =>
      validateSettlement(settlement, `${path}.settlements[${index}]`, errors)
    );
  }
  const routes = input["routes"];
  if (Array.isArray(routes)) {
    routes.forEach((route, index) => validateRoute(route, `${path}.routes[${index}]`, errors));
  }
}

function validateDistrict(
  input: unknown,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, DISTRICT_REFERENCE_PATTERN, errors);
  validatePatternString(
    input,
    "districtReferenceId",
    `${path}.districtReferenceId`,
    DISTRICT_REFERENCE_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validateStringUnion(
    input,
    "landWaterClass",
    `${path}.landWaterClass`,
    LAND_WATER_CLASSES,
    errors
  );
  validatePositiveInteger(input, "renderOrder", `${path}.renderOrder`, errors);
  validateRecord(input, "anchor", errors, `${path}.anchor`);
  validatePoint(input["anchor"], `${path}.anchor`, errors);
  validateArray(input, "polygon", errors, `${path}.polygon`);
  const polygon = input["polygon"];
  if (Array.isArray(polygon)) {
    polygon.forEach((point, index) => validatePoint(point, `${path}.polygon[${index}]`, errors));
  }
}

function validateSettlement(
  input: unknown,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }
  validatePatternString(
    input,
    "sourceId",
    `${path}.sourceId`,
    SETTLEMENT_REFERENCE_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "settlementReferenceId",
    `${path}.settlementReferenceId`,
    SETTLEMENT_REFERENCE_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "districtReferenceId",
    `${path}.districtReferenceId`,
    DISTRICT_REFERENCE_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    DISPLAY_NAME_KEY_PATTERN,
    errors
  );
  validatePositiveInteger(input, "renderOrder", `${path}.renderOrder`, errors);
  validateRecord(input, "anchor", errors, `${path}.anchor`);
  validatePoint(input["anchor"], `${path}.anchor`, errors);
}

function validateRoute(
  input: unknown,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, ROUTE_REFERENCE_PATTERN, errors);
  validatePatternString(
    input,
    "routeReferenceId",
    `${path}.routeReferenceId`,
    ROUTE_REFERENCE_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "fromDistrictReferenceId",
    `${path}.fromDistrictReferenceId`,
    DISTRICT_REFERENCE_PATTERN,
    errors
  );
  validatePatternString(
    input,
    "toDistrictReferenceId",
    `${path}.toDistrictReferenceId`,
    DISTRICT_REFERENCE_PATTERN,
    errors
  );
  validateStringUnion(input, "routeKind", `${path}.routeKind`, ROUTE_KINDS, errors);
  validateStringUnion(input, "waterClass", `${path}.waterClass`, ROUTE_WATER_CLASSES, errors);
  validatePositiveInteger(input, "renderOrder", `${path}.renderOrder`, errors);
  validateArray(input, "points", errors, `${path}.points`);
  const points = input["points"];
  if (Array.isArray(points)) {
    points.forEach((point, index) => validatePoint(point, `${path}.points[${index}]`, errors));
  }
}

function validatePoint(
  input: unknown,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return;
  }
  validateIntegerInRange(input, "x", `${path}.x`, 0, 1000000, errors);
  validateIntegerInRange(input, "y", `${path}.y`, 0, 1000000, errors);
}

function parseCandidate(input: unknown): M6AlphaMapCandidateSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha map candidate.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    historicity: readHistoricity(input, "historicity"),
    confidence: readConfidence(input, "confidence"),
    sourceLabel: readHistoricity(input, "sourceLabel"),
    reviewNotes: readArray(input, "reviewNotes").map(readStringValue),
    bounds: parseBounds(readRecord(input, "bounds")),
    districts: readArray(input, "districts").map(parseDistrict),
    settlements: readArray(input, "settlements").map(parseSettlement),
    routes: readArray(input, "routes").map(parseRoute)
  };
}

function parseBounds(input: Record<string, unknown>): M6AlphaMapBoundsSourceV0 {
  return {
    widthInMapUnits: readPositiveInteger(input, "widthInMapUnits"),
    heightInMapUnits: readPositiveInteger(input, "heightInMapUnits")
  };
}

function parseDistrict(input: unknown): M6AlphaMapDistrictSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha map district.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    districtReferenceId: readString(input, "districtReferenceId"),
    displayNameKey: readString(input, "displayNameKey"),
    landWaterClass: readLandWaterClass(input, "landWaterClass"),
    renderOrder: readPositiveInteger(input, "renderOrder"),
    anchor: parsePoint(readRecord(input, "anchor")),
    polygon: readArray(input, "polygon").map(parsePoint)
  };
}

function parseSettlement(input: unknown): M6AlphaMapSettlementSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha map settlement.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    settlementReferenceId: readString(input, "settlementReferenceId"),
    districtReferenceId: readString(input, "districtReferenceId"),
    displayNameKey: readString(input, "displayNameKey"),
    renderOrder: readPositiveInteger(input, "renderOrder"),
    anchor: parsePoint(readRecord(input, "anchor"))
  };
}

function parseRoute(input: unknown): M6AlphaMapRouteSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha map route.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    routeReferenceId: readString(input, "routeReferenceId"),
    fromDistrictReferenceId: readString(input, "fromDistrictReferenceId"),
    toDistrictReferenceId: readString(input, "toDistrictReferenceId"),
    routeKind: readRouteKind(input, "routeKind"),
    waterClass: readRouteWaterClass(input, "waterClass"),
    renderOrder: readPositiveInteger(input, "renderOrder"),
    points: readArray(input, "points").map(parsePoint)
  };
}

function parsePoint(input: unknown): M6AlphaMapPointSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M6 alpha map point.");
  }
  return {
    x: readIntegerInRange(input, "x", 0, 1000000),
    y: readIntegerInRange(input, "y", 0, 1000000)
  };
}

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: M6AlphaMapCandidateSchemaError[]
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
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  if (record[key] === expected) {
    return;
  }
  errors.push({ code: "invalid-schema", path: key, message: `${key} must be ${expected}.` });
}

function validatePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: M6AlphaMapCandidateSchemaError[]
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
  errors: M6AlphaMapCandidateSchemaError[]
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

function validateStringArray(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  const value = record[key];
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((entry) => typeof entry === "string" && entry.length > 0)
  ) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a non-empty array of non-empty strings.`
  });
}

function validateRecord(
  record: Record<string, unknown>,
  key: string,
  errors: M6AlphaMapCandidateSchemaError[],
  path = key
): void {
  if (isRecord(record[key])) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
}

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: M6AlphaMapCandidateSchemaError[],
  path = key
): void {
  if (Array.isArray(record[key])) {
    return;
  }
  errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
}

function validatePositiveInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: M6AlphaMapCandidateSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a positive safe integer.`
  });
}

function validateIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: M6AlphaMapCandidateSchemaError[]
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

function readHistoricity(
  record: Record<string, unknown>,
  key: string
): M6AlphaMapCandidateHistoricity {
  const value = readString(record, key);
  if (HISTORICITIES.includes(value as M6AlphaMapCandidateHistoricity)) {
    return value as M6AlphaMapCandidateHistoricity;
  }
  throw new Error(`${key} must be a valid M6 alpha map historicity value.`);
}

function readConfidence(
  record: Record<string, unknown>,
  key: string
): M6AlphaMapCandidateConfidence {
  const value = readString(record, key);
  if (CONFIDENCES.includes(value as M6AlphaMapCandidateConfidence)) {
    return value as M6AlphaMapCandidateConfidence;
  }
  throw new Error(`${key} must be a valid M6 alpha map confidence value.`);
}

function readLandWaterClass(
  record: Record<string, unknown>,
  key: string
): M6AlphaMapLandWaterClass {
  const value = readString(record, key);
  if (LAND_WATER_CLASSES.includes(value as M6AlphaMapLandWaterClass)) {
    return value as M6AlphaMapLandWaterClass;
  }
  throw new Error(`${key} must be a valid M6 alpha land/water class.`);
}

function readRouteKind(record: Record<string, unknown>, key: string): M6AlphaMapRouteKind {
  const value = readString(record, key);
  if (ROUTE_KINDS.includes(value as M6AlphaMapRouteKind)) {
    return value as M6AlphaMapRouteKind;
  }
  throw new Error(`${key} must be a valid M6 alpha map route kind.`);
}

function readRouteWaterClass(
  record: Record<string, unknown>,
  key: string
): M6AlphaMapRouteWaterClass {
  const value = readString(record, key);
  if (ROUTE_WATER_CLASSES.includes(value as M6AlphaMapRouteWaterClass)) {
    return value as M6AlphaMapRouteWaterClass;
  }
  throw new Error(`${key} must be a valid M6 alpha map route water class.`);
}

function formatErrors(errors: readonly M6AlphaMapCandidateSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

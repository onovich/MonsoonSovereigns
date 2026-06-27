import type {
  M6AlphaMapCandidateConfidence,
  M6AlphaMapCandidateHistoricity,
  M6AlphaMapLandWaterClass,
  M6AlphaMapRouteKind,
  M6AlphaMapRouteWaterClass
} from "@monsoon/content-schema";

export type M6AlphaMapCandidateManifestHash = string & {
  readonly __brand: "M6AlphaMapCandidateManifestHash";
};
export type M6AlphaMapCandidateId = number & { readonly __brand: "M6AlphaMapCandidateId" };
export type M6AlphaMapDistrictId = number & { readonly __brand: "M6AlphaMapDistrictId" };
export type M6AlphaMapSettlementId = number & { readonly __brand: "M6AlphaMapSettlementId" };
export type M6AlphaMapRouteId = number & { readonly __brand: "M6AlphaMapRouteId" };

export interface RuntimeM6AlphaMapCandidateContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: "alpha-map-candidate-set";
  readonly syntheticScope: "m6-alpha-map-candidate-validation";
  readonly manifestHash: M6AlphaMapCandidateManifestHash;
  readonly candidateCount: number;
  readonly districtCount: number;
  readonly settlementCount: number;
  readonly routeCount: number;
}

export interface RuntimeM6AlphaMapPointV0 {
  readonly x: number;
  readonly y: number;
}

export interface RuntimeM6AlphaMapBoundsV0 {
  readonly widthInMapUnits: number;
  readonly heightInMapUnits: number;
}

export interface RuntimeM6AlphaMapDistrictV0 {
  readonly id: M6AlphaMapDistrictId;
  readonly sourceId: string;
  readonly districtReferenceId: string;
  readonly displayNameKey: string;
  readonly landWaterClass: M6AlphaMapLandWaterClass;
  readonly renderOrder: number;
  readonly anchor: RuntimeM6AlphaMapPointV0;
  readonly polygon: readonly RuntimeM6AlphaMapPointV0[];
}

export interface RuntimeM6AlphaMapSettlementV0 {
  readonly id: M6AlphaMapSettlementId;
  readonly sourceId: string;
  readonly settlementReferenceId: string;
  readonly districtReferenceId: string;
  readonly districtId: M6AlphaMapDistrictId;
  readonly displayNameKey: string;
  readonly renderOrder: number;
  readonly anchor: RuntimeM6AlphaMapPointV0;
}

export interface RuntimeM6AlphaMapRouteV0 {
  readonly id: M6AlphaMapRouteId;
  readonly sourceId: string;
  readonly routeReferenceId: string;
  readonly fromDistrictReferenceId: string;
  readonly toDistrictReferenceId: string;
  readonly fromDistrictId: M6AlphaMapDistrictId;
  readonly toDistrictId: M6AlphaMapDistrictId;
  readonly routeKind: M6AlphaMapRouteKind;
  readonly waterClass: M6AlphaMapRouteWaterClass;
  readonly renderOrder: number;
  readonly points: readonly RuntimeM6AlphaMapPointV0[];
}

export interface RuntimeM6AlphaMapCandidateV0 {
  readonly id: M6AlphaMapCandidateId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly historicity: M6AlphaMapCandidateHistoricity;
  readonly confidence: M6AlphaMapCandidateConfidence;
  readonly sourceLabel: M6AlphaMapCandidateHistoricity;
  readonly reviewNotes: readonly string[];
  readonly bounds: RuntimeM6AlphaMapBoundsV0;
  readonly districts: readonly RuntimeM6AlphaMapDistrictV0[];
  readonly settlements: readonly RuntimeM6AlphaMapSettlementV0[];
  readonly routes: readonly RuntimeM6AlphaMapRouteV0[];
}

export interface RuntimeM6AlphaMapCandidateContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m6-alpha-map-candidate-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeM6AlphaMapCandidateContentManifestV0;
  readonly candidates: readonly RuntimeM6AlphaMapCandidateV0[];
}

export interface RuntimeM6AlphaMapCandidateContentPackIndexV0 {
  readonly pack: RuntimeM6AlphaMapCandidateContentPackV0;
  getCandidate(sourceId: string): RuntimeM6AlphaMapCandidateV0 | undefined;
}

interface RuntimeValidationError {
  readonly path: string;
  readonly message: string;
}

const HASH_PATTERN = /^[0-9a-f]{8}$/u;
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

export function parseM6AlphaMapCandidateManifestHash(
  input: unknown
): M6AlphaMapCandidateManifestHash {
  if (typeof input !== "string" || !HASH_PATTERN.test(input)) {
    throw new Error("M6 alpha map candidate manifest hash must be 8 lowercase hex characters.");
  }
  return input as M6AlphaMapCandidateManifestHash;
}

export function parseM6AlphaMapCandidateId(input: unknown): M6AlphaMapCandidateId {
  return parsePositiveInteger(input, "candidate id") as M6AlphaMapCandidateId;
}

export function parseM6AlphaMapDistrictId(input: unknown): M6AlphaMapDistrictId {
  return parsePositiveInteger(input, "district id") as M6AlphaMapDistrictId;
}

export function parseM6AlphaMapSettlementId(input: unknown): M6AlphaMapSettlementId {
  return parsePositiveInteger(input, "settlement id") as M6AlphaMapSettlementId;
}

export function parseM6AlphaMapRouteId(input: unknown): M6AlphaMapRouteId {
  return parsePositiveInteger(input, "route id") as M6AlphaMapRouteId;
}

export function validateRuntimeM6AlphaMapCandidateContentPackV0(
  input: unknown
): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime M6 alpha map candidate pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRoot(input, errors);
  const candidates = input["candidates"];
  if (Array.isArray(candidates)) {
    candidates.forEach((candidate, index) =>
      validateCandidate(candidate, `candidates[${index}]`, errors)
    );
  }
  if (errors.length > 0) {
    return errors;
  }
  validateSemantics(input, errors);
  return errors;
}

export function parseRuntimeM6AlphaMapCandidateContentPackV0(
  input: unknown
): RuntimeM6AlphaMapCandidateContentPackV0 {
  const errors = validateRuntimeM6AlphaMapCandidateContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(`RuntimeM6AlphaMapCandidateContentPackV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("RuntimeM6AlphaMapCandidateContentPackV0 invalid: root was not an object.");
  }

  const manifest = readRecord(input, "manifest");
  const pack = {
    schemaVersion: 1 as const,
    kind: "runtime-m6-alpha-map-candidate-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    manifest: Object.freeze({
      schemaVersion: 1 as const,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "alpha-map-candidate-set" as const,
      syntheticScope: "m6-alpha-map-candidate-validation" as const,
      manifestHash: parseM6AlphaMapCandidateManifestHash(readString(manifest, "manifestHash")),
      candidateCount: readPositiveInteger(manifest, "candidateCount"),
      districtCount: readPositiveInteger(manifest, "districtCount"),
      settlementCount: readPositiveInteger(manifest, "settlementCount"),
      routeCount: readPositiveInteger(manifest, "routeCount")
    }),
    candidates: Object.freeze(readArray(input, "candidates").map(parseCandidate))
  };

  return Object.freeze(pack);
}

export function createRuntimeM6AlphaMapCandidateContentPackIndexV0(
  pack: RuntimeM6AlphaMapCandidateContentPackV0
): RuntimeM6AlphaMapCandidateContentPackIndexV0 {
  const candidateBySourceId = new Map<string, RuntimeM6AlphaMapCandidateV0>();
  for (const candidate of pack.candidates) {
    candidateBySourceId.set(candidate.sourceId, candidate);
  }

  return Object.freeze({
    pack,
    getCandidate(sourceId: string): RuntimeM6AlphaMapCandidateV0 | undefined {
      return candidateBySourceId.get(sourceId);
    }
  });
}

function validateRoot(input: Record<string, unknown>, errors: RuntimeValidationError[]): void {
  validateExactNumber(input, "schemaVersion", 1, errors);
  validateExactString(input, "kind", "runtime-m6-alpha-map-candidate-content-pack-v0", errors);
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);
  validateRecord(input, "manifest", errors);
  validateArray(input, "candidates", errors);

  const manifest = input["manifest"];
  if (isRecord(manifest)) {
    validateExactNumber(manifest, "schemaVersion", 1, errors, "manifest.schemaVersion");
    validateExactString(
      manifest,
      "fixtureKind",
      "alpha-map-candidate-set",
      errors,
      "manifest.fixtureKind"
    );
    validateExactString(
      manifest,
      "syntheticScope",
      "m6-alpha-map-candidate-validation",
      errors,
      "manifest.syntheticScope"
    );
    validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
    validateHashString(manifest, "manifestHash", "manifest.manifestHash", errors);
    validatePositiveIntegerField(manifest, "candidateCount", "manifest.candidateCount", errors);
    validatePositiveIntegerField(manifest, "districtCount", "manifest.districtCount", errors);
    validatePositiveIntegerField(manifest, "settlementCount", "manifest.settlementCount", errors);
    validatePositiveIntegerField(manifest, "routeCount", "manifest.routeCount", errors);
  }
}

function validateCandidate(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateStringUnion(input, "historicity", `${path}.historicity`, HISTORICITIES, errors);
  validateStringUnion(input, "confidence", `${path}.confidence`, CONFIDENCES, errors);
  validateStringUnion(input, "sourceLabel", `${path}.sourceLabel`, HISTORICITIES, errors);
  validateStringArray(input, "reviewNotes", `${path}.reviewNotes`, errors);
  validateRecord(input, "bounds", errors, `${path}.bounds`);
  const bounds = input["bounds"];
  if (isRecord(bounds)) {
    validatePositiveIntegerField(
      bounds,
      "widthInMapUnits",
      `${path}.bounds.widthInMapUnits`,
      errors
    );
    validatePositiveIntegerField(
      bounds,
      "heightInMapUnits",
      `${path}.bounds.heightInMapUnits`,
      errors
    );
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

function validateDistrict(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyString(input, "districtReferenceId", `${path}.districtReferenceId`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validateStringUnion(
    input,
    "landWaterClass",
    `${path}.landWaterClass`,
    LAND_WATER_CLASSES,
    errors
  );
  validatePositiveIntegerField(input, "renderOrder", `${path}.renderOrder`, errors);
  validatePoint(input["anchor"], `${path}.anchor`, errors);
  validateArray(input, "polygon", errors, `${path}.polygon`);
  const polygon = input["polygon"];
  if (Array.isArray(polygon)) {
    polygon.forEach((point, index) => validatePoint(point, `${path}.polygon[${index}]`, errors));
  }
}

function validateSettlement(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyString(input, "settlementReferenceId", `${path}.settlementReferenceId`, errors);
  validateNonEmptyString(input, "districtReferenceId", `${path}.districtReferenceId`, errors);
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, errors);
  validateNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors);
  validatePositiveIntegerField(input, "renderOrder", `${path}.renderOrder`, errors);
  validatePoint(input["anchor"], `${path}.anchor`, errors);
}

function validateRoute(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validateNonEmptyString(input, "sourceId", `${path}.sourceId`, errors);
  validateNonEmptyString(input, "routeReferenceId", `${path}.routeReferenceId`, errors);
  validateNonEmptyString(
    input,
    "fromDistrictReferenceId",
    `${path}.fromDistrictReferenceId`,
    errors
  );
  validateNonEmptyString(input, "toDistrictReferenceId", `${path}.toDistrictReferenceId`, errors);
  validatePositiveIntegerField(input, "fromDistrictId", `${path}.fromDistrictId`, errors);
  validatePositiveIntegerField(input, "toDistrictId", `${path}.toDistrictId`, errors);
  validateStringUnion(input, "routeKind", `${path}.routeKind`, ROUTE_KINDS, errors);
  validateStringUnion(input, "waterClass", `${path}.waterClass`, ROUTE_WATER_CLASSES, errors);
  validatePositiveIntegerField(input, "renderOrder", `${path}.renderOrder`, errors);
  validateArray(input, "points", errors, `${path}.points`);
  const points = input["points"];
  if (Array.isArray(points)) {
    points.forEach((point, index) => validatePoint(point, `${path}.points[${index}]`, errors));
  }
}

function validatePoint(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: `${path} must be an object.` });
    return;
  }
  validateIntegerFieldInRange(input, "x", `${path}.x`, 0, 1000000, errors);
  validateIntegerFieldInRange(input, "y", `${path}.y`, 0, 1000000, errors);
}

function validateSemantics(input: Record<string, unknown>, errors: RuntimeValidationError[]): void {
  const manifest = readRecord(input, "manifest");
  const candidates = readArray(input, "candidates");
  let districtCount = 0;
  let settlementCount = 0;
  let routeCount = 0;
  validateRuntimeCount(manifest, "candidateCount", candidates.length, errors);
  collectOrderedRuntimeIds(candidates, "candidates", errors);

  candidates.forEach((candidate, candidateIndex) => {
    if (!isRecord(candidate)) {
      return;
    }
    const districts = readArray(candidate, "districts");
    const settlements = readArray(candidate, "settlements");
    const routes = readArray(candidate, "routes");
    districtCount += districts.length;
    settlementCount += settlements.length;
    routeCount += routes.length;
    const districtIds = collectOrderedRuntimeIds(
      districts,
      `candidates[${candidateIndex}].districts`,
      errors
    );
    collectOrderedRuntimeIds(settlements, `candidates[${candidateIndex}].settlements`, errors);
    collectOrderedRuntimeIds(routes, `candidates[${candidateIndex}].routes`, errors);
    validateRuntimeDistrictReferences(
      settlements,
      "districtId",
      districtIds,
      `candidates[${candidateIndex}].settlements`,
      errors
    );
    validateRuntimeDistrictReferences(
      routes,
      "fromDistrictId",
      districtIds,
      `candidates[${candidateIndex}].routes`,
      errors
    );
    validateRuntimeDistrictReferences(
      routes,
      "toDistrictId",
      districtIds,
      `candidates[${candidateIndex}].routes`,
      errors
    );
  });

  validateRuntimeCount(manifest, "districtCount", districtCount, errors);
  validateRuntimeCount(manifest, "settlementCount", settlementCount, errors);
  validateRuntimeCount(manifest, "routeCount", routeCount, errors);
}

function validateRuntimeDistrictReferences(
  entries: readonly unknown[],
  key: string,
  districtIds: ReadonlySet<number>,
  path: string,
  errors: RuntimeValidationError[]
): void {
  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    const id = readPositiveInteger(entry, key);
    if (!districtIds.has(id)) {
      errors.push({
        path: `${path}[${index}].${key}`,
        message: `${key} references missing district.`
      });
    }
  });
}

function parseCandidate(input: unknown): RuntimeM6AlphaMapCandidateV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 alpha map candidate.");
  }
  return Object.freeze({
    id: parseM6AlphaMapCandidateId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    historicity: readHistoricity(input, "historicity"),
    confidence: readConfidence(input, "confidence"),
    sourceLabel: readHistoricity(input, "sourceLabel"),
    reviewNotes: Object.freeze(readArray(input, "reviewNotes").map(readStringValue)),
    bounds: parseBounds(readRecord(input, "bounds")),
    districts: Object.freeze(readArray(input, "districts").map(parseDistrict)),
    settlements: Object.freeze(readArray(input, "settlements").map(parseSettlement)),
    routes: Object.freeze(readArray(input, "routes").map(parseRoute))
  });
}

function parseBounds(input: Record<string, unknown>): RuntimeM6AlphaMapBoundsV0 {
  return Object.freeze({
    widthInMapUnits: readPositiveInteger(input, "widthInMapUnits"),
    heightInMapUnits: readPositiveInteger(input, "heightInMapUnits")
  });
}

function parseDistrict(input: unknown): RuntimeM6AlphaMapDistrictV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 alpha map district.");
  }
  return Object.freeze({
    id: parseM6AlphaMapDistrictId(input["id"]),
    sourceId: readString(input, "sourceId"),
    districtReferenceId: readString(input, "districtReferenceId"),
    displayNameKey: readString(input, "displayNameKey"),
    landWaterClass: readLandWaterClass(input, "landWaterClass"),
    renderOrder: readPositiveInteger(input, "renderOrder"),
    anchor: parsePoint(readRecord(input, "anchor")),
    polygon: Object.freeze(readArray(input, "polygon").map(parsePoint))
  });
}

function parseSettlement(input: unknown): RuntimeM6AlphaMapSettlementV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 alpha map settlement.");
  }
  return Object.freeze({
    id: parseM6AlphaMapSettlementId(input["id"]),
    sourceId: readString(input, "sourceId"),
    settlementReferenceId: readString(input, "settlementReferenceId"),
    districtReferenceId: readString(input, "districtReferenceId"),
    districtId: parseM6AlphaMapDistrictId(input["districtId"]),
    displayNameKey: readString(input, "displayNameKey"),
    renderOrder: readPositiveInteger(input, "renderOrder"),
    anchor: parsePoint(readRecord(input, "anchor"))
  });
}

function parseRoute(input: unknown): RuntimeM6AlphaMapRouteV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 alpha map route.");
  }
  return Object.freeze({
    id: parseM6AlphaMapRouteId(input["id"]),
    sourceId: readString(input, "sourceId"),
    routeReferenceId: readString(input, "routeReferenceId"),
    fromDistrictReferenceId: readString(input, "fromDistrictReferenceId"),
    toDistrictReferenceId: readString(input, "toDistrictReferenceId"),
    fromDistrictId: parseM6AlphaMapDistrictId(input["fromDistrictId"]),
    toDistrictId: parseM6AlphaMapDistrictId(input["toDistrictId"]),
    routeKind: readRouteKind(input, "routeKind"),
    waterClass: readRouteWaterClass(input, "waterClass"),
    renderOrder: readPositiveInteger(input, "renderOrder"),
    points: Object.freeze(readArray(input, "points").map(parsePoint))
  });
}

function parsePoint(input: unknown): RuntimeM6AlphaMapPointV0 {
  if (!isRecord(input)) {
    throw new Error("Expected runtime M6 alpha map point.");
  }
  return Object.freeze({
    x: readIntegerInRange(input, "x", 0, 1000000),
    y: readIntegerInRange(input, "y", 0, 1000000)
  });
}

function collectOrderedRuntimeIds(
  entries: readonly unknown[],
  path: string,
  errors: RuntimeValidationError[]
): Set<number> {
  const ids = new Set<number>();
  let previousId = 0;
  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    const id = readPositiveInteger(entry, "id");
    if (ids.has(id)) {
      errors.push({ path: `${path}[${index}].id`, message: `Duplicate runtime id ${id}.` });
    }
    if (id <= previousId) {
      errors.push({ path: `${path}[${index}].id`, message: `${path} must be ordered by id.` });
    }
    ids.add(id);
    previousId = id;
  });
  return ids;
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

function validateStringArray(
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
  return parsePositiveInteger(record[key], key);
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

function parsePositiveInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer.`);
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
  throw new Error(`${key} must be a valid M6 alpha map land/water class.`);
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

function formatErrors(errors: readonly RuntimeValidationError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

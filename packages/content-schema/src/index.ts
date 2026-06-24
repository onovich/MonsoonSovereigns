export const M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;
export const M2_WORLD_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;

export type M1GraphFixtureSourceKind = "m1.synthetic-abstract-graph";
export type M1GraphFixtureKind = "synthetic-kernel-graph";
export type M1GraphSyntheticScope = "deterministic-kernel-only";
export type M1GraphNodeIsolation = "connected" | "explicitly-isolated";
export type M1GraphEdgeDirection = "directed" | "bidirectional";
export type M2WorldFixtureSourceKind = "m2.prototype-world-fixture";
export type M2WorldFixtureKind = "prototype-world-fixture";
export type M2WorldSyntheticScope = "m2-prototype-only";
export type M2WorldHistoricity = "FICTIONAL";
export type M2WorldSourceCategory = "validation-only-fixture";
export type M2WorldConfidence = "LOW";
export type M2RouteKind = "road" | "river" | "coast";
export type M2MapGeometryOwnerKind = "district" | "settlement";
export type M2MapGeometryKind = "polygon" | "point";

export type ContentSchemaErrorCode = "invalid-schema";

export interface ContentSchemaError {
  readonly code: ContentSchemaErrorCode;
  readonly path: string;
  readonly message: string;
}

export interface M1GraphFixtureNodeSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly isolation: M1GraphNodeIsolation;
}

export interface M1GraphFixtureEdgeSourceV0 {
  readonly sourceId: string;
  readonly from: string;
  readonly to: string;
  readonly direction: M1GraphEdgeDirection;
  readonly traversalCost: number;
}

export interface M1GraphFixtureSourceV0 {
  readonly schemaVersion: typeof M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M1GraphFixtureSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M1GraphFixtureKind;
  readonly syntheticScope: M1GraphSyntheticScope;
  readonly nodes: readonly M1GraphFixtureNodeSourceV0[];
  readonly edges: readonly M1GraphFixtureEdgeSourceV0[];
}

export interface M2WorldFixtureProvenanceV0 {
  readonly sourceCategory: M2WorldSourceCategory;
  readonly confidence: M2WorldConfidence;
  readonly policyId: "M2-MAP-SOURCE-POLICY-001";
}

export interface M2WorldDistrictSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly regionalCurveId: string;
  readonly mapGeometryId: string;
}

export interface M2WorldSettlementSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly districtId: string;
  readonly mapGeometryId: string;
}

export interface M2WorldSeasonalMonthSourceV0 {
  readonly month: number;
  readonly monsoonIntensityBps: number;
  readonly agricultureWorkBps: number;
  readonly riverNavigabilityBps: number;
  readonly roadTravelCostBps: number;
}

export interface M2WorldRegionalSeasonalCurveSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly monthlyValues: readonly M2WorldSeasonalMonthSourceV0[];
}

export interface M2WorldRouteSourceV0 {
  readonly sourceId: string;
  readonly fromDistrictId: string;
  readonly toDistrictId: string;
  readonly routeKind: M2RouteKind;
  readonly baseTravelCost: number;
}

export interface M2WorldMapPointSourceV0 {
  readonly x: number;
  readonly y: number;
}

export interface M2WorldMapGeometrySourceV0 {
  readonly sourceId: string;
  readonly ownerKind: M2MapGeometryOwnerKind;
  readonly ownerId: string;
  readonly geometryKind: M2MapGeometryKind;
  readonly anchor: M2WorldMapPointSourceV0;
  readonly points: readonly M2WorldMapPointSourceV0[];
}

export interface M2WorldFixtureSourceV0 {
  readonly schemaVersion: typeof M2_WORLD_FIXTURE_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M2WorldFixtureSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M2WorldFixtureKind;
  readonly syntheticScope: M2WorldSyntheticScope;
  readonly historicity: M2WorldHistoricity;
  readonly provenance: M2WorldFixtureProvenanceV0;
  readonly districts: readonly M2WorldDistrictSourceV0[];
  readonly settlements: readonly M2WorldSettlementSourceV0[];
  readonly regionalSeasonalCurves: readonly M2WorldRegionalSeasonalCurveSourceV0[];
  readonly routes: readonly M2WorldRouteSourceV0[];
  readonly mapGeometries: readonly M2WorldMapGeometrySourceV0[];
}

export function validateM1GraphFixtureSourceV0(input: unknown): readonly ContentSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M1 graph fixture source must be an object."
      }
    ];
  }

  const errors: ContentSchemaError[] = [];
  validateRoot(input, errors);

  const nodes = input["nodes"];
  if (Array.isArray(nodes)) {
    nodes.forEach((node, index) => validateNode(node, `nodes[${index}]`, errors));
  }

  const edges = input["edges"];
  if (Array.isArray(edges)) {
    edges.forEach((edge, index) => validateEdge(edge, `edges[${index}]`, errors));
  }

  return errors;
}

export function validateM2WorldFixtureSourceV0(input: unknown): readonly ContentSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M2 world fixture source must be an object."
      }
    ];
  }

  const errors: ContentSchemaError[] = [];
  validateM2Root(input, errors);

  const provenance = input["provenance"];
  if (isRecord(provenance)) {
    validateM2Provenance(provenance, errors);
  }

  const districts = input["districts"];
  if (Array.isArray(districts)) {
    districts.forEach((district, index) =>
      validateM2District(district, `districts[${index}]`, errors)
    );
  }

  const settlements = input["settlements"];
  if (Array.isArray(settlements)) {
    settlements.forEach((settlement, index) =>
      validateM2Settlement(settlement, `settlements[${index}]`, errors)
    );
  }

  const curves = input["regionalSeasonalCurves"];
  if (Array.isArray(curves)) {
    curves.forEach((curve, index) =>
      validateM2RegionalCurve(curve, `regionalSeasonalCurves[${index}]`, errors)
    );
  }

  const routes = input["routes"];
  if (Array.isArray(routes)) {
    routes.forEach((route, index) => validateM2Route(route, `routes[${index}]`, errors));
  }

  const geometries = input["mapGeometries"];
  if (Array.isArray(geometries)) {
    geometries.forEach((geometry, index) =>
      validateM2MapGeometry(geometry, `mapGeometries[${index}]`, errors)
    );
  }

  return errors;
}

export function parseM1GraphFixtureSourceV0(input: unknown): M1GraphFixtureSourceV0 {
  const errors = validateM1GraphFixtureSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M1GraphFixtureSourceV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("M1GraphFixtureSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION,
    kind: "m1.synthetic-abstract-graph",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "synthetic-kernel-graph",
    syntheticScope: "deterministic-kernel-only",
    nodes: readArray(input, "nodes").map(parseNode),
    edges: readArray(input, "edges").map(parseEdge)
  };
}

export function parseM2WorldFixtureSourceV0(input: unknown): M2WorldFixtureSourceV0 {
  const errors = validateM2WorldFixtureSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M2WorldFixtureSourceV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("M2WorldFixtureSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M2_WORLD_FIXTURE_SOURCE_V0_SCHEMA_VERSION,
    kind: "m2.prototype-world-fixture",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "prototype-world-fixture",
    syntheticScope: "m2-prototype-only",
    historicity: "FICTIONAL",
    provenance: parseM2Provenance(readRecord(input, "provenance")),
    districts: readArray(input, "districts").map(parseM2District),
    settlements: readArray(input, "settlements").map(parseM2Settlement),
    regionalSeasonalCurves: readArray(input, "regionalSeasonalCurves").map(parseM2RegionalCurve),
    routes: readArray(input, "routes").map(parseM2Route),
    mapGeometries: readArray(input, "mapGeometries").map(parseM2MapGeometry)
  };
}

function validateRoot(input: Record<string, unknown>, errors: ContentSchemaError[]): void {
  if (input["schemaVersion"] !== M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "schemaVersion",
      message: `schemaVersion must be ${M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION}.`
    });
  }

  validateExactString(input, "kind", "m1.synthetic-abstract-graph", errors);
  validateNonEmptyString(input, "fixtureId", errors);
  validateExactString(input, "fixtureKind", "synthetic-kernel-graph", errors);
  validateExactString(input, "syntheticScope", "deterministic-kernel-only", errors);
  validateArray(input, "nodes", errors);
  validateArray(input, "edges", errors);
}

function validateM2Root(input: Record<string, unknown>, errors: ContentSchemaError[]): void {
  if (input["schemaVersion"] !== M2_WORLD_FIXTURE_SOURCE_V0_SCHEMA_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "schemaVersion",
      message: `schemaVersion must be ${M2_WORLD_FIXTURE_SOURCE_V0_SCHEMA_VERSION}.`
    });
  }

  validateExactString(input, "kind", "m2.prototype-world-fixture", errors);
  validateNonEmptyString(input, "fixtureId", errors);
  validateExactString(input, "fixtureKind", "prototype-world-fixture", errors);
  validateExactString(input, "syntheticScope", "m2-prototype-only", errors);
  validateExactString(input, "historicity", "FICTIONAL", errors);
  if (!isRecord(input["provenance"])) {
    errors.push({
      code: "invalid-schema",
      path: "provenance",
      message: "provenance must be an object."
    });
  }
  validateArray(input, "districts", errors);
  validateArray(input, "settlements", errors);
  validateArray(input, "regionalSeasonalCurves", errors);
  validateArray(input, "routes", errors);
  validateArray(input, "mapGeometries", errors);
}

function validateM2Provenance(input: Record<string, unknown>, errors: ContentSchemaError[]): void {
  validateExactString(input, "sourceCategory", "validation-only-fixture", errors);
  validateExactString(input, "confidence", "LOW", errors);
  validateExactString(input, "policyId", "M2-MAP-SOURCE-POLICY-001", errors);
}

function validateM2District(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "District source entry must be an object."
    });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, /^district-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m2\.prototype\.district_\d{3}$/u,
    errors
  );
  validatePatternString(
    input,
    "regionalCurveId",
    `${path}.regionalCurveId`,
    /^curve-\d{3}$/u,
    errors
  );
  validatePatternString(
    input,
    "mapGeometryId",
    `${path}.mapGeometryId`,
    /^geom-district-\d{3}$/u,
    errors
  );
}

function validateM2Settlement(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Settlement source entry must be an object."
    });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, /^settlement-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m2\.prototype\.settlement_\d{3}$/u,
    errors
  );
  validatePatternString(input, "districtId", `${path}.districtId`, /^district-\d{3}$/u, errors);
  validatePatternString(
    input,
    "mapGeometryId",
    `${path}.mapGeometryId`,
    /^geom-settlement-\d{3}$/u,
    errors
  );
}

function validateM2RegionalCurve(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Regional seasonal curve source entry must be an object."
    });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, /^curve-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m2\.prototype\.curve_\d{3}$/u,
    errors
  );
  validateArray(input, "monthlyValues", errors);
  const values = input["monthlyValues"];
  if (Array.isArray(values)) {
    if (values.length !== 12) {
      errors.push({
        code: "invalid-schema",
        path: `${path}.monthlyValues`,
        message: "monthlyValues must contain exactly 12 entries."
      });
    }
    values.forEach((value, index) =>
      validateM2SeasonalMonth(value, `${path}.monthlyValues[${index}]`, errors)
    );
  }
}

function validateM2SeasonalMonth(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Seasonal month entry must be an object."
    });
    return;
  }

  validateIntegerInRange(input, "month", `${path}.month`, 1, 12, errors);
  validateIntegerInRange(
    input,
    "monsoonIntensityBps",
    `${path}.monsoonIntensityBps`,
    0,
    10000,
    errors
  );
  validateIntegerInRange(
    input,
    "agricultureWorkBps",
    `${path}.agricultureWorkBps`,
    0,
    10000,
    errors
  );
  validateIntegerInRange(
    input,
    "riverNavigabilityBps",
    `${path}.riverNavigabilityBps`,
    0,
    10000,
    errors
  );
  validateIntegerInRange(input, "roadTravelCostBps", `${path}.roadTravelCostBps`, 1, 30000, errors);
}

function validateM2Route(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "Route source entry must be an object." });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, /^route-\d{3}$/u, errors);
  validatePatternString(
    input,
    "fromDistrictId",
    `${path}.fromDistrictId`,
    /^district-\d{3}$/u,
    errors
  );
  validatePatternString(input, "toDistrictId", `${path}.toDistrictId`, /^district-\d{3}$/u, errors);
  validateStringUnion(input, "routeKind", `${path}.routeKind`, ["road", "river", "coast"], errors);
  validatePositiveInteger(input, "baseTravelCost", `${path}.baseTravelCost`, errors);
}

function validateM2MapGeometry(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Map geometry source entry must be an object."
    });
    return;
  }

  validatePatternString(
    input,
    "sourceId",
    `${path}.sourceId`,
    /^geom-(district|settlement)-\d{3}$/u,
    errors
  );
  validateStringUnion(input, "ownerKind", `${path}.ownerKind`, ["district", "settlement"], errors);
  validatePatternString(
    input,
    "ownerId",
    `${path}.ownerId`,
    /^(district|settlement)-\d{3}$/u,
    errors
  );
  validateStringUnion(input, "geometryKind", `${path}.geometryKind`, ["polygon", "point"], errors);
  if (!isRecord(input["anchor"])) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.anchor`,
      message: "anchor must be an object."
    });
  } else {
    validateM2Point(input["anchor"], `${path}.anchor`, errors);
  }
  validateArray(input, "points", errors);
  const points = input["points"];
  if (Array.isArray(points)) {
    points.forEach((point, index) => validateM2Point(point, `${path}.points[${index}]`, errors));
  }
}

function validateM2Point(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "Map point must be an object." });
    return;
  }

  validateIntegerInRange(input, "x", `${path}.x`, -1000000, 1000000, errors);
  validateIntegerInRange(input, "y", `${path}.y`, -1000000, 1000000, errors);
}

function validateNode(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Graph node source entry must be an object."
    });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, /^node-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m1\.abstract\.node_\d{3}$/u,
    errors
  );
  validateStringUnion(
    input,
    "isolation",
    `${path}.isolation`,
    ["connected", "explicitly-isolated"],
    errors
  );
}

function validateEdge(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "Graph edge source entry must be an object."
    });
    return;
  }

  validatePatternString(input, "sourceId", `${path}.sourceId`, /^edge-\d{3}$/u, errors);
  validatePatternString(input, "from", `${path}.from`, /^node-\d{3}$/u, errors);
  validatePatternString(input, "to", `${path}.to`, /^node-\d{3}$/u, errors);
  validateStringUnion(
    input,
    "direction",
    `${path}.direction`,
    ["directed", "bidirectional"],
    errors
  );
  validatePositiveInteger(input, "traversalCost", `${path}.traversalCost`, errors);
}

function parseNode(input: unknown): M1GraphFixtureNodeSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid graph node source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    isolation: readIsolation(input, "isolation")
  };
}

function parseEdge(input: unknown): M1GraphFixtureEdgeSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid graph edge source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    from: readString(input, "from"),
    to: readString(input, "to"),
    direction: readDirection(input, "direction"),
    traversalCost: readPositiveInteger(input, "traversalCost")
  };
}

function parseM2Provenance(input: Record<string, unknown>): M2WorldFixtureProvenanceV0 {
  const sourceCategory = readString(input, "sourceCategory");
  const confidence = readString(input, "confidence");
  const policyId = readString(input, "policyId");
  if (
    sourceCategory !== "validation-only-fixture" ||
    confidence !== "LOW" ||
    policyId !== "M2-MAP-SOURCE-POLICY-001"
  ) {
    throw new Error("Expected valid M2 prototype provenance.");
  }

  return {
    sourceCategory,
    confidence,
    policyId
  };
}

function parseM2District(input: unknown): M2WorldDistrictSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid district source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    regionalCurveId: readString(input, "regionalCurveId"),
    mapGeometryId: readString(input, "mapGeometryId")
  };
}

function parseM2Settlement(input: unknown): M2WorldSettlementSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid settlement source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    districtId: readString(input, "districtId"),
    mapGeometryId: readString(input, "mapGeometryId")
  };
}

function parseM2RegionalCurve(input: unknown): M2WorldRegionalSeasonalCurveSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid regional seasonal curve source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    monthlyValues: readArray(input, "monthlyValues").map(parseM2SeasonalMonth)
  };
}

function parseM2SeasonalMonth(input: unknown): M2WorldSeasonalMonthSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid seasonal month source entry.");
  }

  return {
    month: readIntegerInRange(input, "month", 1, 12),
    monsoonIntensityBps: readIntegerInRange(input, "monsoonIntensityBps", 0, 10000),
    agricultureWorkBps: readIntegerInRange(input, "agricultureWorkBps", 0, 10000),
    riverNavigabilityBps: readIntegerInRange(input, "riverNavigabilityBps", 0, 10000),
    roadTravelCostBps: readIntegerInRange(input, "roadTravelCostBps", 1, 30000)
  };
}

function parseM2Route(input: unknown): M2WorldRouteSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid route source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    fromDistrictId: readString(input, "fromDistrictId"),
    toDistrictId: readString(input, "toDistrictId"),
    routeKind: readM2RouteKind(input, "routeKind"),
    baseTravelCost: readPositiveInteger(input, "baseTravelCost")
  };
}

function parseM2MapGeometry(input: unknown): M2WorldMapGeometrySourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid map geometry source entry.");
  }

  return {
    sourceId: readString(input, "sourceId"),
    ownerKind: readM2MapGeometryOwnerKind(input, "ownerKind"),
    ownerId: readString(input, "ownerId"),
    geometryKind: readM2MapGeometryKind(input, "geometryKind"),
    anchor: parseM2Point(readRecord(input, "anchor")),
    points: readArray(input, "points").map(parseM2Point)
  };
}

function parseM2Point(input: unknown): M2WorldMapPointSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid map point source entry.");
  }

  return {
    x: readIntegerInRange(input, "x", -1000000, 1000000),
    y: readIntegerInRange(input, "y", -1000000, 1000000)
  };
}

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: ContentSchemaError[]
): void {
  if (record[key] === expected) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: key,
    message: `${key} must be ${expected}.`
  });
}

function validateNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  errors: ContentSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: key,
    message: `${key} must be a non-empty string.`
  });
}

function validatePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: ContentSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && pattern.test(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must match ${pattern.source}.`
  });
}

function validateStringUnion(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: ContentSchemaError[]
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

function validatePositiveInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ContentSchemaError[]
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
  errors: ContentSchemaError[]
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
  errors: ContentSchemaError[]
): void {
  if (Array.isArray(record[key])) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: key,
    message: `${key} must be an array.`
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

function readIsolation(record: Record<string, unknown>, key: string): M1GraphNodeIsolation {
  const value = readString(record, key);
  if (value === "connected" || value === "explicitly-isolated") {
    return value;
  }

  throw new Error(`${key} must be a valid node isolation value.`);
}

function readDirection(record: Record<string, unknown>, key: string): M1GraphEdgeDirection {
  const value = readString(record, key);
  if (value === "directed" || value === "bidirectional") {
    return value;
  }

  throw new Error(`${key} must be a valid edge direction.`);
}

function readM2RouteKind(record: Record<string, unknown>, key: string): M2RouteKind {
  const value = readString(record, key);
  if (value === "road" || value === "river" || value === "coast") {
    return value;
  }

  throw new Error(`${key} must be a valid M2 route kind.`);
}

function readM2MapGeometryOwnerKind(
  record: Record<string, unknown>,
  key: string
): M2MapGeometryOwnerKind {
  const value = readString(record, key);
  if (value === "district" || value === "settlement") {
    return value;
  }

  throw new Error(`${key} must be a valid M2 map geometry owner kind.`);
}

function readM2MapGeometryKind(record: Record<string, unknown>, key: string): M2MapGeometryKind {
  const value = readString(record, key);
  if (value === "polygon" || value === "point") {
    return value;
  }

  throw new Error(`${key} must be a valid M2 map geometry kind.`);
}

function formatErrors(errors: readonly ContentSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

import type {
  M1GraphEdgeDirection,
  M1GraphFixtureKind,
  M1GraphSyntheticScope,
  M2MapGeometryKind,
  M2MapGeometryOwnerKind,
  M2RouteKind,
  M2WorldFixtureKind,
  M2WorldHistoricity,
  M2WorldSyntheticScope
} from "@monsoon/content-schema";

export type Brand<TValue, TBrand extends string> = TValue & { readonly __brand: TBrand };

export type ContentNodeId = Brand<number, "ContentNodeId">;
export type ContentEdgeId = Brand<number, "ContentEdgeId">;
export type ContentDistrictId = Brand<number, "ContentDistrictId">;
export type ContentSettlementId = Brand<number, "ContentSettlementId">;
export type ContentRegionalSeasonalCurveId = Brand<number, "ContentRegionalSeasonalCurveId">;
export type ContentRouteId = Brand<number, "ContentRouteId">;
export type ContentMapGeometryId = Brand<number, "ContentMapGeometryId">;
export type ContentManifestHash = Brand<string, "ContentManifestHash">;

export interface RuntimeContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: M1GraphFixtureKind;
  readonly syntheticScope: M1GraphSyntheticScope;
  readonly manifestHash: ContentManifestHash;
  readonly nodeCount: number;
  readonly edgeCount: number;
}

export interface RuntimeContentNodeV0 {
  readonly id: ContentNodeId;
  readonly sourceId: string;
  readonly displayNameKey: string;
}

export interface RuntimeContentEdgeV0 {
  readonly id: ContentEdgeId;
  readonly sourceId: string;
  readonly fromNodeId: ContentNodeId;
  readonly toNodeId: ContentNodeId;
  readonly direction: M1GraphEdgeDirection;
  readonly traversalCost: number;
}

export interface RuntimeContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeContentManifestV0;
  readonly nodes: readonly RuntimeContentNodeV0[];
  readonly edges: readonly RuntimeContentEdgeV0[];
}

export interface RuntimeContentPackIndexV0 {
  readonly pack: RuntimeContentPackV0;
  getNode(id: ContentNodeId | number): RuntimeContentNodeV0 | undefined;
  getEdge(id: ContentEdgeId | number): RuntimeContentEdgeV0 | undefined;
  getOutgoingEdges(nodeId: ContentNodeId | number): readonly RuntimeContentEdgeV0[];
}

export interface RuntimeM2WorldContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: M2WorldFixtureKind;
  readonly syntheticScope: M2WorldSyntheticScope;
  readonly historicity: M2WorldHistoricity;
  readonly manifestHash: ContentManifestHash;
  readonly districtCount: number;
  readonly settlementCount: number;
  readonly regionalSeasonalCurveCount: number;
  readonly routeCount: number;
  readonly mapGeometryCount: number;
}

export interface RuntimeM2SeasonalMonthV0 {
  readonly month: number;
  readonly monsoonIntensityBps: number;
  readonly agricultureWorkBps: number;
  readonly riverNavigabilityBps: number;
  readonly roadTravelCostBps: number;
}

export interface RuntimeM2DistrictDefinitionV0 {
  readonly id: ContentDistrictId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly regionalCurveId: ContentRegionalSeasonalCurveId;
  readonly mapGeometryId: ContentMapGeometryId;
}

export interface RuntimeM2SettlementDefinitionV0 {
  readonly id: ContentSettlementId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly districtId: ContentDistrictId;
  readonly mapGeometryId: ContentMapGeometryId;
}

export interface RuntimeM2RegionalSeasonalCurveV0 {
  readonly id: ContentRegionalSeasonalCurveId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly monthlyValues: readonly RuntimeM2SeasonalMonthV0[];
}

export interface RuntimeM2RouteDefinitionV0 {
  readonly id: ContentRouteId;
  readonly sourceId: string;
  readonly fromDistrictId: ContentDistrictId;
  readonly toDistrictId: ContentDistrictId;
  readonly routeKind: M2RouteKind;
  readonly baseTravelCost: number;
}

export interface RuntimeM2MapPointV0 {
  readonly x: number;
  readonly y: number;
}

export interface RuntimeM2MapGeometryV0 {
  readonly id: ContentMapGeometryId;
  readonly sourceId: string;
  readonly ownerKind: M2MapGeometryOwnerKind;
  readonly ownerId: ContentDistrictId | ContentSettlementId;
  readonly geometryKind: M2MapGeometryKind;
  readonly anchor: RuntimeM2MapPointV0;
  readonly points: readonly RuntimeM2MapPointV0[];
}

export interface RuntimeM2WorldContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m2-world-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeM2WorldContentManifestV0;
  readonly districts: readonly RuntimeM2DistrictDefinitionV0[];
  readonly settlements: readonly RuntimeM2SettlementDefinitionV0[];
  readonly regionalSeasonalCurves: readonly RuntimeM2RegionalSeasonalCurveV0[];
  readonly routes: readonly RuntimeM2RouteDefinitionV0[];
  readonly mapGeometries: readonly RuntimeM2MapGeometryV0[];
}

export interface RuntimeM2WorldContentPackIndexV0 {
  readonly pack: RuntimeM2WorldContentPackV0;
  getDistrict(id: ContentDistrictId | number): RuntimeM2DistrictDefinitionV0 | undefined;
  getSettlement(id: ContentSettlementId | number): RuntimeM2SettlementDefinitionV0 | undefined;
  getRegionalSeasonalCurve(
    id: ContentRegionalSeasonalCurveId | number
  ): RuntimeM2RegionalSeasonalCurveV0 | undefined;
  getRoute(id: ContentRouteId | number): RuntimeM2RouteDefinitionV0 | undefined;
  getMapGeometry(id: ContentMapGeometryId | number): RuntimeM2MapGeometryV0 | undefined;
}

interface RuntimeValidationError {
  readonly path: string;
  readonly message: string;
}

export function parseRuntimeContentPackV0(input: unknown): RuntimeContentPackV0 {
  const errors = validateRuntimeContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(`RuntimeContentPackV0 invalid: ${formatRuntimeErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("RuntimeContentPackV0 invalid: root was not an object.");
  }

  const manifest = readRecord(input, "manifest");
  const pack = {
    schemaVersion: 1 as const,
    kind: "runtime-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    manifest: freezeManifest({
      schemaVersion: 1,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "synthetic-kernel-graph",
      syntheticScope: "deterministic-kernel-only",
      manifestHash: parseContentManifestHash(readString(manifest, "manifestHash")),
      nodeCount: readPositiveInteger(manifest, "nodeCount"),
      edgeCount: readPositiveInteger(manifest, "edgeCount")
    }),
    nodes: Object.freeze(readArray(input, "nodes").map(parseRuntimeNode)),
    edges: Object.freeze(readArray(input, "edges").map(parseRuntimeEdge))
  };

  return Object.freeze(pack);
}

export function parseRuntimeM2WorldContentPackV0(input: unknown): RuntimeM2WorldContentPackV0 {
  const errors = validateRuntimeM2WorldContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(`RuntimeM2WorldContentPackV0 invalid: ${formatRuntimeErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("RuntimeM2WorldContentPackV0 invalid: root was not an object.");
  }

  const manifest = readRecord(input, "manifest");
  const pack = {
    schemaVersion: 1 as const,
    kind: "runtime-m2-world-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    manifest: freezeM2Manifest({
      schemaVersion: 1,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "prototype-world-fixture",
      syntheticScope: "m2-prototype-only",
      historicity: "FICTIONAL",
      manifestHash: parseContentManifestHash(readString(manifest, "manifestHash")),
      districtCount: readPositiveInteger(manifest, "districtCount"),
      settlementCount: readPositiveInteger(manifest, "settlementCount"),
      regionalSeasonalCurveCount: readPositiveInteger(manifest, "regionalSeasonalCurveCount"),
      routeCount: readPositiveInteger(manifest, "routeCount"),
      mapGeometryCount: readPositiveInteger(manifest, "mapGeometryCount")
    }),
    districts: Object.freeze(readArray(input, "districts").map(parseRuntimeM2District)),
    settlements: Object.freeze(readArray(input, "settlements").map(parseRuntimeM2Settlement)),
    regionalSeasonalCurves: Object.freeze(
      readArray(input, "regionalSeasonalCurves").map(parseRuntimeM2RegionalSeasonalCurve)
    ),
    routes: Object.freeze(readArray(input, "routes").map(parseRuntimeM2Route)),
    mapGeometries: Object.freeze(readArray(input, "mapGeometries").map(parseRuntimeM2MapGeometry))
  };

  return Object.freeze(pack);
}

export function validateRuntimeContentPackV0(input: unknown): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime content pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRuntimeRoot(input, errors);

  const nodes = input["nodes"];
  if (Array.isArray(nodes)) {
    nodes.forEach((node, index) => validateRuntimeNode(node, `nodes[${index}]`, errors));
  }

  const edges = input["edges"];
  if (Array.isArray(edges)) {
    edges.forEach((edge, index) => validateRuntimeEdge(edge, `edges[${index}]`, errors));
  }

  if (errors.length > 0) {
    return errors;
  }

  validateRuntimeSemantics(input, errors);
  return errors;
}

export function validateRuntimeM2WorldContentPackV0(
  input: unknown
): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime M2 world content pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRuntimeM2Root(input, errors);
  validateRuntimeM2ArrayEntries(input, errors);

  if (errors.length > 0) {
    return errors;
  }

  validateRuntimeM2Semantics(input, errors);
  return errors;
}

export function parseContentNodeId(value: unknown): ContentNodeId {
  return parsePositiveInteger(value, "ContentNodeId") as ContentNodeId;
}

export function parseContentEdgeId(value: unknown): ContentEdgeId {
  return parsePositiveInteger(value, "ContentEdgeId") as ContentEdgeId;
}

export function parseContentDistrictId(value: unknown): ContentDistrictId {
  return parsePositiveInteger(value, "ContentDistrictId") as ContentDistrictId;
}

export function parseContentSettlementId(value: unknown): ContentSettlementId {
  return parsePositiveInteger(value, "ContentSettlementId") as ContentSettlementId;
}

export function parseContentRegionalSeasonalCurveId(
  value: unknown
): ContentRegionalSeasonalCurveId {
  return parsePositiveInteger(
    value,
    "ContentRegionalSeasonalCurveId"
  ) as ContentRegionalSeasonalCurveId;
}

export function parseContentRouteId(value: unknown): ContentRouteId {
  return parsePositiveInteger(value, "ContentRouteId") as ContentRouteId;
}

export function parseContentMapGeometryId(value: unknown): ContentMapGeometryId {
  return parsePositiveInteger(value, "ContentMapGeometryId") as ContentMapGeometryId;
}

export function parseContentManifestHash(value: unknown): ContentManifestHash {
  if (typeof value !== "string" || !/^[0-9a-f]{8}$/u.test(value)) {
    throw new Error("ContentManifestHash must be an 8-character lowercase hex string.");
  }

  return value as ContentManifestHash;
}

export function createRuntimeContentPackIndexV0(
  pack: RuntimeContentPackV0
): RuntimeContentPackIndexV0 {
  const nodeById = new Map<number, RuntimeContentNodeV0>();
  const edgeById = new Map<number, RuntimeContentEdgeV0>();
  const mutableOutgoingEdgesByNodeId = new Map<number, RuntimeContentEdgeV0[]>();

  for (const node of pack.nodes) {
    nodeById.set(node.id, node);
    mutableOutgoingEdgesByNodeId.set(node.id, []);
  }

  for (const edge of pack.edges) {
    edgeById.set(edge.id, edge);
    const existing = mutableOutgoingEdgesByNodeId.get(edge.fromNodeId);
    if (existing !== undefined) {
      existing.push(edge);
    }
    if (edge.direction === "bidirectional") {
      const reverse = mutableOutgoingEdgesByNodeId.get(edge.toNodeId);
      if (reverse !== undefined) {
        reverse.push(edge);
      }
    }
  }

  const outgoingEdgesByNodeId = new Map<number, readonly RuntimeContentEdgeV0[]>();
  for (const [nodeId, edges] of mutableOutgoingEdgesByNodeId) {
    outgoingEdgesByNodeId.set(nodeId, Object.freeze([...edges]));
  }

  return Object.freeze({
    pack,
    getNode(id: ContentNodeId | number): RuntimeContentNodeV0 | undefined {
      return nodeById.get(id);
    },
    getEdge(id: ContentEdgeId | number): RuntimeContentEdgeV0 | undefined {
      return edgeById.get(id);
    },
    getOutgoingEdges(nodeId: ContentNodeId | number): readonly RuntimeContentEdgeV0[] {
      return outgoingEdgesByNodeId.get(nodeId) ?? Object.freeze([]);
    }
  });
}

export function createRuntimeM2WorldContentPackIndexV0(
  pack: RuntimeM2WorldContentPackV0
): RuntimeM2WorldContentPackIndexV0 {
  const districtById = new Map<number, RuntimeM2DistrictDefinitionV0>();
  const settlementById = new Map<number, RuntimeM2SettlementDefinitionV0>();
  const curveById = new Map<number, RuntimeM2RegionalSeasonalCurveV0>();
  const routeById = new Map<number, RuntimeM2RouteDefinitionV0>();
  const geometryById = new Map<number, RuntimeM2MapGeometryV0>();

  for (const district of pack.districts) {
    districtById.set(district.id, district);
  }
  for (const settlement of pack.settlements) {
    settlementById.set(settlement.id, settlement);
  }
  for (const curve of pack.regionalSeasonalCurves) {
    curveById.set(curve.id, curve);
  }
  for (const route of pack.routes) {
    routeById.set(route.id, route);
  }
  for (const geometry of pack.mapGeometries) {
    geometryById.set(geometry.id, geometry);
  }

  return Object.freeze({
    pack,
    getDistrict(id: ContentDistrictId | number): RuntimeM2DistrictDefinitionV0 | undefined {
      return districtById.get(id);
    },
    getSettlement(id: ContentSettlementId | number): RuntimeM2SettlementDefinitionV0 | undefined {
      return settlementById.get(id);
    },
    getRegionalSeasonalCurve(
      id: ContentRegionalSeasonalCurveId | number
    ): RuntimeM2RegionalSeasonalCurveV0 | undefined {
      return curveById.get(id);
    },
    getRoute(id: ContentRouteId | number): RuntimeM2RouteDefinitionV0 | undefined {
      return routeById.get(id);
    },
    getMapGeometry(id: ContentMapGeometryId | number): RuntimeM2MapGeometryV0 | undefined {
      return geometryById.get(id);
    }
  });
}

function validateRuntimeRoot(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (input["schemaVersion"] !== 1) {
    errors.push({ path: "schemaVersion", message: "schemaVersion must be 1." });
  }
  if (input["kind"] !== "runtime-content-pack-v0") {
    errors.push({ path: "kind", message: "kind must be runtime-content-pack-v0." });
  }
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);

  const manifest = input["manifest"];
  if (!isRecord(manifest)) {
    errors.push({ path: "manifest", message: "manifest must be an object." });
  } else {
    validateManifest(manifest, errors);
  }

  validateArray(input, "nodes", errors);
  validateArray(input, "edges", errors);
}

function validateManifest(
  manifest: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (manifest["schemaVersion"] !== 1) {
    errors.push({ path: "manifest.schemaVersion", message: "manifest schemaVersion must be 1." });
  }
  validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
  if (manifest["fixtureKind"] !== "synthetic-kernel-graph") {
    errors.push({
      path: "manifest.fixtureKind",
      message: "manifest fixtureKind must be synthetic-kernel-graph."
    });
  }
  if (manifest["syntheticScope"] !== "deterministic-kernel-only") {
    errors.push({
      path: "manifest.syntheticScope",
      message: "manifest syntheticScope must be deterministic-kernel-only."
    });
  }
  validatePatternString(
    manifest,
    "manifestHash",
    "manifest.manifestHash",
    /^[0-9a-f]{8}$/u,
    errors
  );
  validatePositiveIntegerField(manifest, "nodeCount", "manifest.nodeCount", errors);
  validatePositiveIntegerField(manifest, "edgeCount", "manifest.edgeCount", errors);
}

function validateRuntimeM2Root(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (input["schemaVersion"] !== 1) {
    errors.push({ path: "schemaVersion", message: "schemaVersion must be 1." });
  }
  if (input["kind"] !== "runtime-m2-world-content-pack-v0") {
    errors.push({ path: "kind", message: "kind must be runtime-m2-world-content-pack-v0." });
  }
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);

  const manifest = input["manifest"];
  if (!isRecord(manifest)) {
    errors.push({ path: "manifest", message: "manifest must be an object." });
  } else {
    validateM2Manifest(manifest, errors);
  }

  validateArray(input, "districts", errors);
  validateArray(input, "settlements", errors);
  validateArray(input, "regionalSeasonalCurves", errors);
  validateArray(input, "routes", errors);
  validateArray(input, "mapGeometries", errors);
}

function validateM2Manifest(
  manifest: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (manifest["schemaVersion"] !== 1) {
    errors.push({ path: "manifest.schemaVersion", message: "manifest schemaVersion must be 1." });
  }
  validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
  if (manifest["fixtureKind"] !== "prototype-world-fixture") {
    errors.push({
      path: "manifest.fixtureKind",
      message: "manifest fixtureKind must be prototype-world-fixture."
    });
  }
  if (manifest["syntheticScope"] !== "m2-prototype-only") {
    errors.push({
      path: "manifest.syntheticScope",
      message: "manifest syntheticScope must be m2-prototype-only."
    });
  }
  if (manifest["historicity"] !== "FICTIONAL") {
    errors.push({
      path: "manifest.historicity",
      message: "manifest historicity must be FICTIONAL."
    });
  }
  validatePatternString(
    manifest,
    "manifestHash",
    "manifest.manifestHash",
    /^[0-9a-f]{8}$/u,
    errors
  );
  validatePositiveIntegerField(manifest, "districtCount", "manifest.districtCount", errors);
  validatePositiveIntegerField(manifest, "settlementCount", "manifest.settlementCount", errors);
  validatePositiveIntegerField(
    manifest,
    "regionalSeasonalCurveCount",
    "manifest.regionalSeasonalCurveCount",
    errors
  );
  validatePositiveIntegerField(manifest, "routeCount", "manifest.routeCount", errors);
  validatePositiveIntegerField(manifest, "mapGeometryCount", "manifest.mapGeometryCount", errors);
}

function validateRuntimeM2ArrayEntries(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const districts = input["districts"];
  if (Array.isArray(districts)) {
    districts.forEach((district, index) =>
      validateRuntimeM2District(district, `districts[${index}]`, errors)
    );
  }

  const settlements = input["settlements"];
  if (Array.isArray(settlements)) {
    settlements.forEach((settlement, index) =>
      validateRuntimeM2Settlement(settlement, `settlements[${index}]`, errors)
    );
  }

  const curves = input["regionalSeasonalCurves"];
  if (Array.isArray(curves)) {
    curves.forEach((curve, index) =>
      validateRuntimeM2RegionalSeasonalCurve(curve, `regionalSeasonalCurves[${index}]`, errors)
    );
  }

  const routes = input["routes"];
  if (Array.isArray(routes)) {
    routes.forEach((route, index) => validateRuntimeM2Route(route, `routes[${index}]`, errors));
  }

  const geometries = input["mapGeometries"];
  if (Array.isArray(geometries)) {
    geometries.forEach((geometry, index) =>
      validateRuntimeM2MapGeometry(geometry, `mapGeometries[${index}]`, errors)
    );
  }
}

function validateRuntimeNode(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime node must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^node-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m1\.abstract\.node_\d{3}$/u,
    errors
  );
}

function validateRuntimeEdge(input: unknown, path: string, errors: RuntimeValidationError[]): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime edge must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^edge-\d{3}$/u, errors);
  validatePositiveIntegerField(input, "fromNodeId", `${path}.fromNodeId`, errors);
  validatePositiveIntegerField(input, "toNodeId", `${path}.toNodeId`, errors);
  validateStringUnion(
    input,
    "direction",
    `${path}.direction`,
    ["directed", "bidirectional"],
    errors
  );
  validatePositiveIntegerField(input, "traversalCost", `${path}.traversalCost`, errors);
}

function validateRuntimeM2District(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 district must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^district-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m2\.prototype\.district_\d{3}$/u,
    errors
  );
  validatePositiveIntegerField(input, "regionalCurveId", `${path}.regionalCurveId`, errors);
  validatePositiveIntegerField(input, "mapGeometryId", `${path}.mapGeometryId`, errors);
}

function validateRuntimeM2Settlement(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 settlement must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^settlement-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m2\.prototype\.settlement_\d{3}$/u,
    errors
  );
  validatePositiveIntegerField(input, "districtId", `${path}.districtId`, errors);
  validatePositiveIntegerField(input, "mapGeometryId", `${path}.mapGeometryId`, errors);
}

function validateRuntimeM2RegionalSeasonalCurve(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 regional seasonal curve must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
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
        path: `${path}.monthlyValues`,
        message: "monthlyValues must contain exactly 12 entries."
      });
    }
    values.forEach((value, index) =>
      validateRuntimeM2SeasonalMonth(value, `${path}.monthlyValues[${index}]`, errors)
    );
  }
}

function validateRuntimeM2SeasonalMonth(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 seasonal month must be an object." });
    return;
  }

  validateIntegerFieldInRange(input, "month", `${path}.month`, 1, 12, errors);
  validateIntegerFieldInRange(
    input,
    "monsoonIntensityBps",
    `${path}.monsoonIntensityBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "agricultureWorkBps",
    `${path}.agricultureWorkBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "riverNavigabilityBps",
    `${path}.riverNavigabilityBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "roadTravelCostBps",
    `${path}.roadTravelCostBps`,
    1,
    30000,
    errors
  );
}

function validateRuntimeM2Route(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 route must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^route-\d{3}$/u, errors);
  validatePositiveIntegerField(input, "fromDistrictId", `${path}.fromDistrictId`, errors);
  validatePositiveIntegerField(input, "toDistrictId", `${path}.toDistrictId`, errors);
  validateStringUnion(input, "routeKind", `${path}.routeKind`, ["road", "river", "coast"], errors);
  validatePositiveIntegerField(input, "baseTravelCost", `${path}.baseTravelCost`, errors);
}

function validateRuntimeM2MapGeometry(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 map geometry must be an object." });
    return;
  }

  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(
    input,
    "sourceId",
    `${path}.sourceId`,
    /^geom-(district|settlement)-\d{3}$/u,
    errors
  );
  validateStringUnion(input, "ownerKind", `${path}.ownerKind`, ["district", "settlement"], errors);
  validatePositiveIntegerField(input, "ownerId", `${path}.ownerId`, errors);
  validateStringUnion(input, "geometryKind", `${path}.geometryKind`, ["polygon", "point"], errors);
  if (!isRecord(input["anchor"])) {
    errors.push({ path: `${path}.anchor`, message: "anchor must be an object." });
  } else {
    validateRuntimeM2Point(input["anchor"], `${path}.anchor`, errors);
  }
  validateArray(input, "points", errors);
  const points = input["points"];
  if (Array.isArray(points)) {
    points.forEach((point, index) =>
      validateRuntimeM2Point(point, `${path}.points[${index}]`, errors)
    );
  }
}

function validateRuntimeM2Point(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M2 map point must be an object." });
    return;
  }

  validateIntegerFieldInRange(input, "x", `${path}.x`, -1000000, 1000000, errors);
  validateIntegerFieldInRange(input, "y", `${path}.y`, -1000000, 1000000, errors);
}

function validateRuntimeSemantics(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const manifest = readRecord(input, "manifest");
  const nodes = readArray(input, "nodes");
  const edges = readArray(input, "edges");

  if (readString(input, "fixtureId") !== readString(manifest, "fixtureId")) {
    errors.push({
      path: "manifest.fixtureId",
      message: "manifest fixtureId must match pack fixtureId."
    });
  }
  if (readPositiveInteger(manifest, "nodeCount") !== nodes.length) {
    errors.push({
      path: "manifest.nodeCount",
      message: "manifest nodeCount must match nodes length."
    });
  }
  if (readPositiveInteger(manifest, "edgeCount") !== edges.length) {
    errors.push({
      path: "manifest.edgeCount",
      message: "manifest edgeCount must match edges length."
    });
  }

  const nodeIds = new Set<number>();
  let previousNodeId = 0;
  nodes.forEach((node, index) => {
    if (!isRecord(node)) {
      return;
    }
    const id = readPositiveInteger(node, "id");
    if (nodeIds.has(id)) {
      errors.push({ path: `nodes[${index}].id`, message: `Duplicate runtime node id ${id}.` });
    }
    if (id <= previousNodeId) {
      errors.push({ path: `nodes[${index}].id`, message: "Runtime nodes must be ordered by id." });
    }
    nodeIds.add(id);
    previousNodeId = id;
  });

  const edgeIds = new Set<number>();
  let previousEdgeId = 0;
  edges.forEach((edge, index) => {
    if (!isRecord(edge)) {
      return;
    }
    const id = readPositiveInteger(edge, "id");
    const fromNodeId = readPositiveInteger(edge, "fromNodeId");
    const toNodeId = readPositiveInteger(edge, "toNodeId");
    if (edgeIds.has(id)) {
      errors.push({ path: `edges[${index}].id`, message: `Duplicate runtime edge id ${id}.` });
    }
    if (id <= previousEdgeId) {
      errors.push({ path: `edges[${index}].id`, message: "Runtime edges must be ordered by id." });
    }
    if (!nodeIds.has(fromNodeId)) {
      errors.push({
        path: `edges[${index}].fromNodeId`,
        message: `Missing from node ${fromNodeId}.`
      });
    }
    if (!nodeIds.has(toNodeId)) {
      errors.push({ path: `edges[${index}].toNodeId`, message: `Missing to node ${toNodeId}.` });
    }
    edgeIds.add(id);
    previousEdgeId = id;
  });
}

function validateRuntimeM2Semantics(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const manifest = readRecord(input, "manifest");
  const districts = readArray(input, "districts");
  const settlements = readArray(input, "settlements");
  const curves = readArray(input, "regionalSeasonalCurves");
  const routes = readArray(input, "routes");
  const geometries = readArray(input, "mapGeometries");

  if (readString(input, "fixtureId") !== readString(manifest, "fixtureId")) {
    errors.push({
      path: "manifest.fixtureId",
      message: "manifest fixtureId must match pack fixtureId."
    });
  }

  validateRuntimeCount(manifest, "districtCount", districts.length, errors);
  validateRuntimeCount(manifest, "settlementCount", settlements.length, errors);
  validateRuntimeCount(manifest, "regionalSeasonalCurveCount", curves.length, errors);
  validateRuntimeCount(manifest, "routeCount", routes.length, errors);
  validateRuntimeCount(manifest, "mapGeometryCount", geometries.length, errors);

  const districtIds = collectOrderedRuntimeIds(districts, "districts", errors);
  const settlementIds = collectOrderedRuntimeIds(settlements, "settlements", errors);
  const curveIds = collectOrderedRuntimeIds(curves, "regionalSeasonalCurves", errors);
  collectOrderedRuntimeIds(routes, "routes", errors);
  const geometryIds = collectOrderedRuntimeIds(geometries, "mapGeometries", errors);

  districts.forEach((district, index) => {
    if (!isRecord(district)) {
      return;
    }
    const regionalCurveId = readPositiveInteger(district, "regionalCurveId");
    const mapGeometryId = readPositiveInteger(district, "mapGeometryId");
    if (!curveIds.has(regionalCurveId)) {
      errors.push({
        path: `districts[${index}].regionalCurveId`,
        message: `Missing regional seasonal curve ${regionalCurveId}.`
      });
    }
    if (!geometryIds.has(mapGeometryId)) {
      errors.push({
        path: `districts[${index}].mapGeometryId`,
        message: `Missing map geometry ${mapGeometryId}.`
      });
    }
  });

  settlements.forEach((settlement, index) => {
    if (!isRecord(settlement)) {
      return;
    }
    const districtId = readPositiveInteger(settlement, "districtId");
    const mapGeometryId = readPositiveInteger(settlement, "mapGeometryId");
    if (!districtIds.has(districtId)) {
      errors.push({
        path: `settlements[${index}].districtId`,
        message: `Missing district ${districtId}.`
      });
    }
    if (!geometryIds.has(mapGeometryId)) {
      errors.push({
        path: `settlements[${index}].mapGeometryId`,
        message: `Missing map geometry ${mapGeometryId}.`
      });
    }
  });

  curves.forEach((curve, curveIndex) => {
    if (!isRecord(curve)) {
      return;
    }
    const values = readArray(curve, "monthlyValues");
    values.forEach((value, valueIndex) => {
      if (!isRecord(value)) {
        return;
      }
      if (readPositiveInteger(value, "month") !== valueIndex + 1) {
        errors.push({
          path: `regionalSeasonalCurves[${curveIndex}].monthlyValues[${valueIndex}].month`,
          message: "monthlyValues must be ordered from month 1 through month 12."
        });
      }
    });
  });

  routes.forEach((route, index) => {
    if (!isRecord(route)) {
      return;
    }
    const fromDistrictId = readPositiveInteger(route, "fromDistrictId");
    const toDistrictId = readPositiveInteger(route, "toDistrictId");
    if (!districtIds.has(fromDistrictId)) {
      errors.push({
        path: `routes[${index}].fromDistrictId`,
        message: `Missing from district ${fromDistrictId}.`
      });
    }
    if (!districtIds.has(toDistrictId)) {
      errors.push({
        path: `routes[${index}].toDistrictId`,
        message: `Missing to district ${toDistrictId}.`
      });
    }
  });

  geometries.forEach((geometry, index) => {
    if (!isRecord(geometry)) {
      return;
    }
    const ownerId = readPositiveInteger(geometry, "ownerId");
    const ownerKind = readString(geometry, "ownerKind");
    if (ownerKind === "district" && !districtIds.has(ownerId)) {
      errors.push({
        path: `mapGeometries[${index}].ownerId`,
        message: `Missing district geometry owner ${ownerId}.`
      });
    }
    if (ownerKind === "settlement" && !settlementIds.has(ownerId)) {
      errors.push({
        path: `mapGeometries[${index}].ownerId`,
        message: `Missing settlement geometry owner ${ownerId}.`
      });
    }
  });
}

function parseRuntimeNode(input: unknown): RuntimeContentNodeV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime node.");
  }

  return Object.freeze({
    id: parseContentNodeId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey")
  });
}

function parseRuntimeEdge(input: unknown): RuntimeContentEdgeV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime edge.");
  }

  return Object.freeze({
    id: parseContentEdgeId(input["id"]),
    sourceId: readString(input, "sourceId"),
    fromNodeId: parseContentNodeId(input["fromNodeId"]),
    toNodeId: parseContentNodeId(input["toNodeId"]),
    direction: readDirection(input, "direction"),
    traversalCost: readPositiveInteger(input, "traversalCost")
  });
}

function parseRuntimeM2District(input: unknown): RuntimeM2DistrictDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 district.");
  }

  return Object.freeze({
    id: parseContentDistrictId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    regionalCurveId: parseContentRegionalSeasonalCurveId(input["regionalCurveId"]),
    mapGeometryId: parseContentMapGeometryId(input["mapGeometryId"])
  });
}

function parseRuntimeM2Settlement(input: unknown): RuntimeM2SettlementDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 settlement.");
  }

  return Object.freeze({
    id: parseContentSettlementId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    districtId: parseContentDistrictId(input["districtId"]),
    mapGeometryId: parseContentMapGeometryId(input["mapGeometryId"])
  });
}

function parseRuntimeM2RegionalSeasonalCurve(input: unknown): RuntimeM2RegionalSeasonalCurveV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 regional seasonal curve.");
  }

  return Object.freeze({
    id: parseContentRegionalSeasonalCurveId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    monthlyValues: Object.freeze(readArray(input, "monthlyValues").map(parseRuntimeM2SeasonalMonth))
  });
}

function parseRuntimeM2SeasonalMonth(input: unknown): RuntimeM2SeasonalMonthV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 seasonal month.");
  }

  return Object.freeze({
    month: readIntegerInRange(input, "month", 1, 12),
    monsoonIntensityBps: readIntegerInRange(input, "monsoonIntensityBps", 0, 10000),
    agricultureWorkBps: readIntegerInRange(input, "agricultureWorkBps", 0, 10000),
    riverNavigabilityBps: readIntegerInRange(input, "riverNavigabilityBps", 0, 10000),
    roadTravelCostBps: readIntegerInRange(input, "roadTravelCostBps", 1, 30000)
  });
}

function parseRuntimeM2Route(input: unknown): RuntimeM2RouteDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 route.");
  }

  return Object.freeze({
    id: parseContentRouteId(input["id"]),
    sourceId: readString(input, "sourceId"),
    fromDistrictId: parseContentDistrictId(input["fromDistrictId"]),
    toDistrictId: parseContentDistrictId(input["toDistrictId"]),
    routeKind: readM2RouteKind(input, "routeKind"),
    baseTravelCost: readPositiveInteger(input, "baseTravelCost")
  });
}

function parseRuntimeM2MapGeometry(input: unknown): RuntimeM2MapGeometryV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 map geometry.");
  }

  return Object.freeze({
    id: parseContentMapGeometryId(input["id"]),
    sourceId: readString(input, "sourceId"),
    ownerKind: readM2MapGeometryOwnerKind(input, "ownerKind"),
    ownerId:
      readString(input, "ownerKind") === "district"
        ? parseContentDistrictId(input["ownerId"])
        : parseContentSettlementId(input["ownerId"]),
    geometryKind: readM2MapGeometryKind(input, "geometryKind"),
    anchor: parseRuntimeM2Point(readRecord(input, "anchor")),
    points: Object.freeze(readArray(input, "points").map(parseRuntimeM2Point))
  });
}

function parseRuntimeM2Point(input: unknown): RuntimeM2MapPointV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M2 map point.");
  }

  return Object.freeze({
    x: readIntegerInRange(input, "x", -1000000, 1000000),
    y: readIntegerInRange(input, "y", -1000000, 1000000)
  });
}

function freezeManifest(manifest: RuntimeContentManifestV0): RuntimeContentManifestV0 {
  return Object.freeze(manifest);
}

function freezeM2Manifest(
  manifest: RuntimeM2WorldContentManifestV0
): RuntimeM2WorldContentManifestV0 {
  return Object.freeze(manifest);
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

function validatePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (typeof value === "string" && pattern.test(value)) {
    return;
  }

  errors.push({ path, message: `${path} must match ${pattern.source}.` });
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

function validateRuntimeCount(
  manifest: Record<string, unknown>,
  key: string,
  actual: number,
  errors: RuntimeValidationError[]
): void {
  if (readPositiveInteger(manifest, key) === actual) {
    return;
  }

  errors.push({
    path: `manifest.${key}`,
    message: `manifest ${key} must match runtime array length.`
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

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: RuntimeValidationError[]
): void {
  if (Array.isArray(record[key])) {
    return;
  }

  errors.push({ path: key, message: `${key} must be an array.` });
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

function formatRuntimeErrors(errors: readonly RuntimeValidationError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

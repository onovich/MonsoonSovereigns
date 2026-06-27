import {
  parseM1GraphFixtureSourceV0,
  parseM3CharacterOfficeFixtureSourceV0,
  parseM2WorldFixtureSourceV0,
  validateM1GraphFixtureSourceV0,
  validateM3CharacterOfficeFixtureSourceV0,
  validateM2WorldFixtureSourceV0,
  type M3CharacterOfficeFixtureSourceV0,
  type M3CharacterSourceV0,
  type M3RelationshipSourceV0,
  type M3OfficeSourceV0,
  type M3LandedPowerSourceV0,
  type M3OfficePolicySourceV0,
  type M3EnfeoffmentHookSourceV0,
  type ContentSchemaError,
  type M1GraphFixtureEdgeSourceV0,
  type M1GraphFixtureNodeSourceV0,
  type M1GraphFixtureSourceV0,
  type M2WorldDistrictSourceV0,
  type M2WorldMapGeometrySourceV0,
  type M2WorldMapPointSourceV0,
  type M2WorldRegionalSeasonalCurveSourceV0,
  type M2WorldRouteSourceV0,
  type M2WorldSettlementSourceV0,
  type M2WorldFixtureSourceV0
} from "@monsoon/content-schema";
import {
  type RuntimeM6AlphaScenarioContentPackV0,
  parseContentEdgeId,
  parseContentCharacterId,
  parseContentDistrictId,
  parseContentEnfeoffmentHookId,
  parseContentLandedPowerId,
  parseContentManifestHash,
  parseContentMapGeometryId,
  parseContentNodeId,
  parseContentOfficeId,
  parseContentOfficePolicyId,
  parseContentRegionalSeasonalCurveId,
  parseContentRelationshipId,
  parseContentRouteId,
  parseContentSettlementId,
  parseRuntimeM3CharacterOfficeContentPackV0,
  parseRuntimeM2WorldContentPackV0,
  parseRuntimeContentPackV0,
  type RuntimeM3CharacterDefinitionV0,
  type RuntimeM3CharacterOfficeContentPackV0,
  type RuntimeM3RelationshipDefinitionV0,
  type RuntimeM3OfficeDefinitionV0,
  type RuntimeM3LandedPowerDefinitionV0,
  type RuntimeM3OfficePolicyDefinitionV0,
  type RuntimeM3EnfeoffmentHookDefinitionV0,
  type RuntimeContentEdgeV0,
  type RuntimeContentNodeV0,
  type RuntimeContentPackV0,
  type RuntimeM2DistrictDefinitionV0,
  type RuntimeM2MapGeometryV0,
  type RuntimeM2RegionalSeasonalCurveV0,
  type RuntimeM2RouteDefinitionV0,
  type RuntimeM2SettlementDefinitionV0,
  type RuntimeM2WorldContentPackV0
} from "@monsoon/content-runtime";

import { compileM6AlphaScenarioContentPackV0 } from "./m6-alpha-scenario.ts";

export type ContentCompileErrorCode =
  | ContentSchemaError["code"]
  | "bad-reference"
  | "duplicate-id"
  | "duplicate-route"
  | "invalid-eligibility"
  | "invalid-relationship"
  | "invalid-count"
  | "invalid-geometry"
  | "invalid-route"
  | "invalid-seasonal-curve"
  | "missing-label"
  | "unsourced-claim"
  | "duplicate-scenario-key"
  | "isolated-district"
  | "isolated-node"
  | "unstable-order";

export interface ContentCompileError {
  readonly code: ContentCompileErrorCode;
  readonly path: string;
  readonly message: string;
}

export type ContentCompileResultV0 =
  | {
      readonly status: "ok";
      readonly pack:
        | RuntimeContentPackV0
        | RuntimeM2WorldContentPackV0
        | RuntimeM3CharacterOfficeContentPackV0
        | RuntimeM6AlphaScenarioContentPackV0;
      readonly errors: readonly [];
    }
  | {
      readonly status: "error";
      readonly errors: readonly ContentCompileError[];
    };

interface StableNodeAssignment {
  readonly node: M1GraphFixtureNodeSourceV0;
  readonly runtimeId: number;
}

interface StableEdgeAssignment {
  readonly edge: M1GraphFixtureEdgeSourceV0;
  readonly runtimeId: number;
}

interface StableDistrictAssignment {
  readonly district: M2WorldDistrictSourceV0;
  readonly runtimeId: number;
}

interface StableSettlementAssignment {
  readonly settlement: M2WorldSettlementSourceV0;
  readonly runtimeId: number;
}

interface StableCurveAssignment {
  readonly curve: M2WorldRegionalSeasonalCurveSourceV0;
  readonly runtimeId: number;
}

interface StableRouteAssignment {
  readonly route: M2WorldRouteSourceV0;
  readonly runtimeId: number;
}

interface StableGeometryAssignment {
  readonly geometry: M2WorldMapGeometrySourceV0;
  readonly runtimeId: number;
}

interface StableCharacterAssignment {
  readonly character: M3CharacterSourceV0;
  readonly runtimeId: number;
}

interface StableRelationshipAssignment {
  readonly relationship: M3RelationshipSourceV0;
  readonly runtimeId: number;
}

interface StableOfficeAssignment {
  readonly office: M3OfficeSourceV0;
  readonly runtimeId: number;
}

interface StableLandedPowerAssignment {
  readonly landedPower: M3LandedPowerSourceV0;
  readonly runtimeId: number;
}

interface StableOfficePolicyAssignment {
  readonly officePolicy: M3OfficePolicySourceV0;
  readonly runtimeId: number;
}

interface StableEnfeoffmentHookAssignment {
  readonly hook: M3EnfeoffmentHookSourceV0;
  readonly runtimeId: number;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function compileContentPackV0(input: unknown): ContentCompileResultV0 {
  if (isRecord(input) && input["kind"] === "m6.alpha-scenario-set") {
    return compileM6AlphaScenarioContentPackV0(input);
  }

  if (isRecord(input) && input["kind"] === "m3.character-office-fixture") {
    return compileM3CharacterOfficeContentPackV0(input);
  }

  if (isRecord(input) && input["kind"] === "m2.prototype-world-fixture") {
    return compileM2WorldContentPackV0(input);
  }

  const schemaErrors = validateM1GraphFixtureSourceV0(input);
  if (schemaErrors.length > 0) {
    return {
      status: "error",
      errors: schemaErrors.map((error) => ({
        code: error.code,
        path: error.path,
        message: error.message
      }))
    };
  }

  const source = parseM1GraphFixtureSourceV0(input);
  const semanticErrors = validateGraphSemantics(source);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimePack(source);
  return {
    status: "ok",
    pack: parseRuntimeContentPackV0(pack),
    errors: []
  };
}

export function compileContentPackV0OrThrow(
  input: unknown
):
  | RuntimeContentPackV0
  | RuntimeM2WorldContentPackV0
  | RuntimeM3CharacterOfficeContentPackV0
  | RuntimeM6AlphaScenarioContentPackV0 {
  const result = compileContentPackV0(input);
  if (result.status === "ok") {
    return result.pack;
  }

  throw new Error(`Content compile failed: ${formatCompileErrors(result.errors)}`);
}

function compileM2WorldContentPackV0(input: unknown): ContentCompileResultV0 {
  const schemaErrors = validateM2WorldFixtureSourceV0(input);
  if (schemaErrors.length > 0) {
    return {
      status: "error",
      errors: schemaErrors.map((error) => ({
        code: error.code,
        path: error.path,
        message: error.message
      }))
    };
  }

  const source = parseM2WorldFixtureSourceV0(input);
  const semanticErrors = validateM2WorldSemantics(source);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimeM2WorldPack(source);
  return {
    status: "ok",
    pack: parseRuntimeM2WorldContentPackV0(pack),
    errors: []
  };
}

function compileM3CharacterOfficeContentPackV0(input: unknown): ContentCompileResultV0 {
  const schemaErrors = validateM3CharacterOfficeFixtureSourceV0(input);
  if (schemaErrors.length > 0) {
    return {
      status: "error",
      errors: schemaErrors.map((error) => ({
        code: error.code,
        path: error.path,
        message: error.message
      }))
    };
  }

  const source = parseM3CharacterOfficeFixtureSourceV0(input);
  const semanticErrors = validateM3CharacterOfficeSemantics(source);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimeM3CharacterOfficePack(source);
  return {
    status: "ok",
    pack: parseRuntimeM3CharacterOfficeContentPackV0(pack),
    errors: []
  };
}

function validateGraphSemantics(source: M1GraphFixtureSourceV0): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.nodes.length !== 30) {
    errors.push({
      code: "invalid-count",
      path: "nodes",
      message: `M1 synthetic fixture must contain exactly 30 nodes, received ${source.nodes.length}.`
    });
  }

  if (source.edges.length < 60) {
    errors.push({
      code: "invalid-count",
      path: "edges",
      message: `M1 synthetic fixture must contain at least 60 edges, received ${source.edges.length}.`
    });
  }

  validateStableOrderAndUniqueIds(source.nodes, "nodes", errors);
  validateStableOrderAndUniqueIds(source.edges, "edges", errors);
  validateReferences(source, errors);
  validateRoutes(source, errors);

  if (!errors.some((error) => error.code === "bad-reference")) {
    validateConnectivity(source, errors);
  }

  return errors;
}

function validateM2WorldSemantics(source: M2WorldFixtureSourceV0): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.districts.length !== 30) {
    errors.push({
      code: "invalid-count",
      path: "districts",
      message: `M2 prototype fixture must contain exactly 30 districts, received ${source.districts.length}.`
    });
  }

  if (source.settlements.length !== 10) {
    errors.push({
      code: "invalid-count",
      path: "settlements",
      message: `M2 prototype fixture must contain exactly 10 settlements, received ${source.settlements.length}.`
    });
  }

  validateStableOrderAndUniqueIds(source.districts, "districts", errors);
  validateStableOrderAndUniqueIds(source.settlements, "settlements", errors);
  validateStableOrderAndUniqueIds(source.regionalSeasonalCurves, "regionalSeasonalCurves", errors);
  validateStableOrderAndUniqueIds(source.routes, "routes", errors);
  validateStableOrderAndUniqueIds(source.mapGeometries, "mapGeometries", errors);
  validateM2DisplayNameKeyReferences(source, errors);
  validateM2References(source, errors);
  validateM2Routes(source, errors);
  validateM2SeasonalCurves(source, errors);
  validateM2Geometries(source, errors);
  validateM2Connectivity(source, errors);

  return errors;
}

function validateM3CharacterOfficeSemantics(
  source: M3CharacterOfficeFixtureSourceV0
): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.characters.length < 50 || source.characters.length > 80) {
    errors.push({
      code: "invalid-count",
      path: "characters",
      message: `M3 character office fixture must contain 50-80 characters, received ${source.characters.length}.`
    });
  }

  if (source.relationships.length >= source.characters.length * (source.characters.length - 1)) {
    errors.push({
      code: "invalid-count",
      path: "relationships",
      message: "M3 character relationships must be sparse, not a complete directed matrix."
    });
  }

  validateStableOrderAndUniqueIds(source.characters, "characters", errors);
  validateStableOrderAndUniqueIds(source.relationships, "relationships", errors);
  validateStableOrderAndUniqueIds(source.offices, "offices", errors);
  validateStableOrderAndUniqueIds(source.landedPowers, "landedPowers", errors);
  validateStableOrderAndUniqueIds(source.officePolicies, "officePolicies", errors);
  validateStableOrderAndUniqueIds(source.enfeoffmentHooks, "enfeoffmentHooks", errors);
  validateM3CharacterOfficeDisplayNameKeyReferences(source, errors);
  validateM3CharacterOfficeReferences(source, errors);
  validateM3CharacterOfficeRelationshipCycles(source, errors);
  validateM3OfficeEligibility(source, errors);

  return errors;
}

function validateStableOrderAndUniqueIds(
  entries: readonly { readonly sourceId: string }[],
  path: string,
  errors: ContentCompileError[]
): void {
  const seen = new Set<string>();
  let previousSourceId = "";

  entries.forEach((entry, index) => {
    if (seen.has(entry.sourceId)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}[${index}].sourceId`,
        message: `Duplicate ${path} sourceId ${entry.sourceId}.`
      });
    }

    if (index > 0 && compareText(entry.sourceId, previousSourceId) <= 0) {
      errors.push({
        code: "unstable-order",
        path: `${path}[${index}].sourceId`,
        message: `${path} must be sorted by sourceId for deterministic stable ID assignment.`
      });
    }

    seen.add(entry.sourceId);
    previousSourceId = entry.sourceId;
  });
}

function validateM2DisplayNameKeyReferences(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  validateDisplayNameKeyReferences(
    source.districts,
    "districts",
    "district-",
    "content.m2.prototype.district_",
    errors
  );
  validateDisplayNameKeyReferences(
    source.settlements,
    "settlements",
    "settlement-",
    "content.m2.prototype.settlement_",
    errors
  );
  validateDisplayNameKeyReferences(
    source.regionalSeasonalCurves,
    "regionalSeasonalCurves",
    "curve-",
    "content.m2.prototype.curve_",
    errors
  );
}

function validateM3CharacterOfficeDisplayNameKeyReferences(
  source: M3CharacterOfficeFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  validateDisplayNameKeyReferences(
    source.characters,
    "characters",
    "character-",
    "content.m3.validation.character_",
    errors
  );
  validateDisplayNameKeyReferences(
    source.offices,
    "offices",
    "office-",
    "content.m3.validation.office_",
    errors
  );
  validateDisplayNameKeyReferences(
    source.officePolicies,
    "officePolicies",
    "office-policy-",
    "content.m3.validation.office_policy_",
    errors
  );
}

function validateDisplayNameKeyReferences(
  entries: readonly { readonly sourceId: string; readonly displayNameKey: string }[],
  path: string,
  sourceIdPrefix: string,
  displayNameKeyPrefix: string,
  errors: ContentCompileError[]
): void {
  entries.forEach((entry, index) => {
    const ordinal = entry.sourceId.slice(sourceIdPrefix.length);
    const expectedDisplayNameKey = `${displayNameKeyPrefix}${ordinal}`;
    if (entry.displayNameKey !== expectedDisplayNameKey) {
      errors.push({
        code: "bad-reference",
        path: `${path}[${index}].displayNameKey`,
        message: `${path} ${entry.sourceId} displayNameKey must be ${expectedDisplayNameKey}.`
      });
    }
  });
}

function validateReferences(source: M1GraphFixtureSourceV0, errors: ContentCompileError[]): void {
  const nodeIds = new Set(source.nodes.map((node) => node.sourceId));

  source.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.from)) {
      errors.push({
        code: "bad-reference",
        path: `edges[${index}].from`,
        message: `Edge ${edge.sourceId} references missing from node ${edge.from}.`
      });
    }

    if (!nodeIds.has(edge.to)) {
      errors.push({
        code: "bad-reference",
        path: `edges[${index}].to`,
        message: `Edge ${edge.sourceId} references missing to node ${edge.to}.`
      });
    }
  });
}

function validateM2References(source: M2WorldFixtureSourceV0, errors: ContentCompileError[]): void {
  const districtIds = new Set(source.districts.map((district) => district.sourceId));
  const settlementIds = new Set(source.settlements.map((settlement) => settlement.sourceId));
  const curveIds = new Set(source.regionalSeasonalCurves.map((curve) => curve.sourceId));
  const geometryBySourceId = new Map(
    source.mapGeometries.map((geometry) => [geometry.sourceId, geometry])
  );

  source.districts.forEach((district, index) => {
    if (!curveIds.has(district.regionalCurveId)) {
      errors.push({
        code: "bad-reference",
        path: `districts[${index}].regionalCurveId`,
        message: `District ${district.sourceId} references missing regional curve ${district.regionalCurveId}.`
      });
    }

    const geometry = geometryBySourceId.get(district.mapGeometryId);
    if (geometry === undefined) {
      errors.push({
        code: "bad-reference",
        path: `districts[${index}].mapGeometryId`,
        message: `District ${district.sourceId} references missing map geometry ${district.mapGeometryId}.`
      });
    } else if (geometry.ownerKind !== "district" || geometry.ownerId !== district.sourceId) {
      errors.push({
        code: "bad-reference",
        path: `districts[${index}].mapGeometryId`,
        message: `District ${district.sourceId} map geometry must be owned by that district.`
      });
    }
  });

  source.settlements.forEach((settlement, index) => {
    if (!districtIds.has(settlement.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `settlements[${index}].districtId`,
        message: `Settlement ${settlement.sourceId} references missing district ${settlement.districtId}.`
      });
    }

    const geometry = geometryBySourceId.get(settlement.mapGeometryId);
    if (geometry === undefined) {
      errors.push({
        code: "bad-reference",
        path: `settlements[${index}].mapGeometryId`,
        message: `Settlement ${settlement.sourceId} references missing map geometry ${settlement.mapGeometryId}.`
      });
    } else if (geometry.ownerKind !== "settlement" || geometry.ownerId !== settlement.sourceId) {
      errors.push({
        code: "bad-reference",
        path: `settlements[${index}].mapGeometryId`,
        message: `Settlement ${settlement.sourceId} map geometry must be owned by that settlement.`
      });
    }
  });

  source.routes.forEach((route, index) => {
    if (!districtIds.has(route.fromDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `routes[${index}].fromDistrictId`,
        message: `Route ${route.sourceId} references missing from district ${route.fromDistrictId}.`
      });
    }

    if (!districtIds.has(route.toDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `routes[${index}].toDistrictId`,
        message: `Route ${route.sourceId} references missing to district ${route.toDistrictId}.`
      });
    }
  });

  source.mapGeometries.forEach((geometry, index) => {
    if (geometry.ownerKind === "district" && !districtIds.has(geometry.ownerId)) {
      errors.push({
        code: "bad-reference",
        path: `mapGeometries[${index}].ownerId`,
        message: `Map geometry ${geometry.sourceId} references missing district owner ${geometry.ownerId}.`
      });
    }

    if (geometry.ownerKind === "settlement" && !settlementIds.has(geometry.ownerId)) {
      errors.push({
        code: "bad-reference",
        path: `mapGeometries[${index}].ownerId`,
        message: `Map geometry ${geometry.sourceId} references missing settlement owner ${geometry.ownerId}.`
      });
    }
  });
}

function validateM3CharacterOfficeReferences(
  source: M3CharacterOfficeFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const characterIds = new Set(source.characters.map((character) => character.sourceId));
  const landedPowerIds = new Set(source.landedPowers.map((landedPower) => landedPower.sourceId));
  const policyIds = new Set(source.officePolicies.map((policy) => policy.sourceId));
  const hookIds = new Set(source.enfeoffmentHooks.map((hook) => hook.sourceId));

  source.relationships.forEach((relationship, index) => {
    if (!characterIds.has(relationship.fromCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `relationships[${index}].fromCharacterId`,
        message: `Relationship ${relationship.sourceId} references missing from character ${relationship.fromCharacterId}.`
      });
    }
    if (!characterIds.has(relationship.toCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `relationships[${index}].toCharacterId`,
        message: `Relationship ${relationship.sourceId} references missing to character ${relationship.toCharacterId}.`
      });
    }
    if (relationship.fromCharacterId === relationship.toCharacterId) {
      errors.push({
        code: "invalid-relationship",
        path: `relationships[${index}].toCharacterId`,
        message: `Relationship ${relationship.sourceId} must not reference the same character.`
      });
    }
  });

  source.offices.forEach((office, index) => {
    if (!characterIds.has(office.currentHolderCharacterId)) {
      errors.push({
        code: "bad-reference",
        path: `offices[${index}].currentHolderCharacterId`,
        message: `Office ${office.sourceId} references missing holder ${office.currentHolderCharacterId}.`
      });
    }
    if (!policyIds.has(office.policyId)) {
      errors.push({
        code: "bad-reference",
        path: `offices[${index}].policyId`,
        message: `Office ${office.sourceId} references missing policy ${office.policyId}.`
      });
    }
    if (office.landedPowerId !== null && !landedPowerIds.has(office.landedPowerId)) {
      errors.push({
        code: "bad-reference",
        path: `offices[${index}].landedPowerId`,
        message: `Office ${office.sourceId} references missing landed power ${office.landedPowerId}.`
      });
    }
    if (
      (office.jurisdictionKind === "polity" && !office.jurisdictionId.startsWith("polity-")) ||
      (office.jurisdictionKind === "district" && !office.jurisdictionId.startsWith("district-"))
    ) {
      errors.push({
        code: "bad-reference",
        path: `offices[${index}].jurisdictionId`,
        message: `Office ${office.sourceId} jurisdictionId must match jurisdictionKind.`
      });
    }
  });

  source.officePolicies.forEach((policy, index) => {
    if (!policy.persistsAcrossHolderChange) {
      errors.push({
        code: "bad-reference",
        path: `officePolicies[${index}].persistsAcrossHolderChange`,
        message: `Office policy ${policy.sourceId} must persist across holder changes.`
      });
    }
    policy.enfeoffmentHookIds.forEach((hookId, hookIndex) => {
      if (!hookIds.has(hookId)) {
        errors.push({
          code: "bad-reference",
          path: `officePolicies[${index}].enfeoffmentHookIds[${hookIndex}]`,
          message: `Office policy ${policy.sourceId} references missing hook ${hookId}.`
        });
      }
    });
  });
}

function validateM3CharacterOfficeRelationshipCycles(
  source: M3CharacterOfficeFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const parentCycleId = findM3SourceParentCycle(source.relationships);
  if (parentCycleId !== null) {
    errors.push({
      code: "invalid-relationship",
      path: "relationships",
      message: `M3 parent relationship graph contains a cycle at ${parentCycleId}.`
    });
  }
}

function validateM3OfficeEligibility(
  source: M3CharacterOfficeFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const characterBySourceId = new Map(
    source.characters.map((character) => [character.sourceId, character])
  );

  source.offices.forEach((office, index) => {
    const holder = characterBySourceId.get(office.currentHolderCharacterId);
    if (holder === undefined) {
      return;
    }
    const eligibility = office.appointmentEligibility;
    if (
      holder.aptitude.administrationBps < eligibility.minimumAdministrationBps ||
      holder.aptitude.commandBps < eligibility.minimumCommandBps ||
      holder.aptitude.legitimacyBps < eligibility.minimumLegitimacyBps ||
      (eligibility.requiredArchetype !== null && holder.archetype !== eligibility.requiredArchetype)
    ) {
      errors.push({
        code: "invalid-eligibility",
        path: `offices[${index}].currentHolderCharacterId`,
        message: `Office ${office.sourceId} holder ${holder.sourceId} does not satisfy appointment eligibility.`
      });
    }
  });
}

function validateRoutes(source: M1GraphFixtureSourceV0, errors: ContentCompileError[]): void {
  const seenRoutes = new Set<string>();

  source.edges.forEach((edge, index) => {
    if (edge.from === edge.to) {
      errors.push({
        code: "invalid-route",
        path: `edges[${index}]`,
        message: `Edge ${edge.sourceId} must connect two distinct nodes.`
      });
      return;
    }

    const routeKey = routeSemanticKey(edge);
    if (seenRoutes.has(routeKey)) {
      errors.push({
        code: "duplicate-route",
        path: `edges[${index}]`,
        message: `Duplicate route semantics for ${edge.sourceId}.`
      });
      return;
    }

    seenRoutes.add(routeKey);
  });
}

function validateM2Routes(source: M2WorldFixtureSourceV0, errors: ContentCompileError[]): void {
  const seenRoutes = new Set<string>();

  source.routes.forEach((route, index) => {
    if (route.fromDistrictId === route.toDistrictId) {
      errors.push({
        code: "invalid-route",
        path: `routes[${index}]`,
        message: `Route ${route.sourceId} must connect two distinct districts.`
      });
      return;
    }

    const routeKey = m2RouteSemanticKey(route);
    if (seenRoutes.has(routeKey)) {
      errors.push({
        code: "duplicate-route",
        path: `routes[${index}]`,
        message: `Duplicate M2 route semantics for ${route.sourceId}.`
      });
      return;
    }

    seenRoutes.add(routeKey);
  });
}

function validateM2SeasonalCurves(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  source.regionalSeasonalCurves.forEach((curve, curveIndex) => {
    curve.monthlyValues.forEach((value, valueIndex) => {
      if (value.month !== valueIndex + 1) {
        errors.push({
          code: "invalid-seasonal-curve",
          path: `regionalSeasonalCurves[${curveIndex}].monthlyValues[${valueIndex}].month`,
          message: `Regional curve ${curve.sourceId} monthly values must be ordered from month 1 through month 12.`
        });
      }
    });
  });
}

function validateM2Geometries(source: M2WorldFixtureSourceV0, errors: ContentCompileError[]): void {
  const districtBySourceId = new Map(
    source.districts.map((district) => [district.sourceId, district])
  );
  const settlementBySourceId = new Map(
    source.settlements.map((settlement) => [settlement.sourceId, settlement])
  );
  const geometryBySourceId = new Map(
    source.mapGeometries.map((geometry) => [geometry.sourceId, geometry])
  );

  source.mapGeometries.forEach((geometry, index) => {
    if (geometry.ownerKind === "district" && geometry.geometryKind !== "polygon") {
      errors.push({
        code: "invalid-geometry",
        path: `mapGeometries[${index}].geometryKind`,
        message: `District geometry ${geometry.sourceId} must use polygon geometry.`
      });
    }

    if (geometry.ownerKind === "settlement" && geometry.geometryKind !== "point") {
      errors.push({
        code: "invalid-geometry",
        path: `mapGeometries[${index}].geometryKind`,
        message: `Settlement geometry ${geometry.sourceId} must use point geometry.`
      });
    }

    if (geometry.geometryKind === "polygon" && geometry.points.length < 3) {
      errors.push({
        code: "invalid-geometry",
        path: `mapGeometries[${index}].points`,
        message: `Polygon geometry ${geometry.sourceId} must contain at least 3 points.`
      });
    }

    if (geometry.geometryKind === "polygon" && geometry.points.length >= 3) {
      if (polygonTwiceArea(geometry.points) === 0) {
        errors.push({
          code: "invalid-geometry",
          path: `mapGeometries[${index}].points`,
          message: `Polygon geometry ${geometry.sourceId} must enclose non-zero area.`
        });
      }

      if (!isPointInOrOnPolygon(geometry.anchor, geometry.points)) {
        errors.push({
          code: "invalid-geometry",
          path: `mapGeometries[${index}].anchor`,
          message: `Polygon geometry ${geometry.sourceId} anchor must lie inside the polygon.`
        });
      }
    }

    if (geometry.geometryKind === "point" && geometry.points.length !== 0) {
      errors.push({
        code: "invalid-geometry",
        path: `mapGeometries[${index}].points`,
        message: `Point geometry ${geometry.sourceId} must not contain polygon points.`
      });
    }

    if (geometry.geometryKind === "point" && geometry.ownerKind === "settlement") {
      const settlement = settlementBySourceId.get(geometry.ownerId);
      const district =
        settlement === undefined ? undefined : districtBySourceId.get(settlement.districtId);
      const districtGeometry =
        district === undefined ? undefined : geometryBySourceId.get(district.mapGeometryId);
      if (
        districtGeometry !== undefined &&
        districtGeometry.geometryKind === "polygon" &&
        districtGeometry.points.length >= 3 &&
        !isPointInOrOnPolygon(geometry.anchor, districtGeometry.points)
      ) {
        errors.push({
          code: "invalid-geometry",
          path: `mapGeometries[${index}].anchor`,
          message: `Settlement geometry ${geometry.sourceId} anchor must lie inside its owning district polygon.`
        });
      }
    }
  });
}

function validateM2Connectivity(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const adjacency = new Map<string, Set<string>>();
  for (const district of source.districts) {
    adjacency.set(district.sourceId, new Set<string>());
  }

  for (const route of source.routes) {
    const fromNeighbors = adjacency.get(route.fromDistrictId);
    const toNeighbors = adjacency.get(route.toDistrictId);
    if (fromNeighbors !== undefined && toNeighbors !== undefined) {
      fromNeighbors.add(route.toDistrictId);
      toNeighbors.add(route.fromDistrictId);
    }
  }

  const startDistrict = source.districts[0];
  const visited = new Set<string>();
  if (startDistrict !== undefined) {
    const pending = [startDistrict.sourceId];
    while (pending.length > 0) {
      const current = pending.shift();
      if (current === undefined || visited.has(current)) {
        continue;
      }
      visited.add(current);
      const neighbors = adjacency.get(current);
      if (neighbors !== undefined) {
        for (const neighbor of sortText([...neighbors])) {
          pending.push(neighbor);
        }
      }
    }
  }

  source.districts.forEach((district, index) => {
    const degree = adjacency.get(district.sourceId)?.size ?? 0;
    if (degree === 0 || !visited.has(district.sourceId)) {
      errors.push({
        code: "isolated-district",
        path: `districts[${index}].sourceId`,
        message: `District ${district.sourceId} is isolated or disconnected from the M2 route graph.`
      });
    }
  });
}

function polygonTwiceArea(points: readonly M2WorldMapPointSourceV0[]): number {
  let twiceArea = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    if (current === undefined || next === undefined) {
      throw new Error("Expected polygon point.");
    }
    twiceArea += current.x * next.y - next.x * current.y;
  }

  return twiceArea;
}

function isPointInOrOnPolygon(
  point: M2WorldMapPointSourceV0,
  polygon: readonly M2WorldMapPointSourceV0[]
): boolean {
  let inside = false;
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    if (current === undefined || next === undefined) {
      throw new Error("Expected polygon point.");
    }

    if (isPointOnSegment(point, current, next)) {
      return true;
    }

    if (current.y > point.y !== next.y > point.y) {
      const left = (next.x - current.x) * (point.y - current.y);
      const right = (point.x - current.x) * (next.y - current.y);
      const crossesRight = next.y > current.y ? left > right : left < right;
      if (crossesRight) {
        inside = !inside;
      }
    }
  }

  return inside;
}

function isPointOnSegment(
  point: M2WorldMapPointSourceV0,
  start: M2WorldMapPointSourceV0,
  end: M2WorldMapPointSourceV0
): boolean {
  const cross = (point.x - start.x) * (end.y - start.y) - (point.y - start.y) * (end.x - start.x);
  if (cross !== 0) {
    return false;
  }

  return (
    point.x >= Math.min(start.x, end.x) &&
    point.x <= Math.max(start.x, end.x) &&
    point.y >= Math.min(start.y, end.y) &&
    point.y <= Math.max(start.y, end.y)
  );
}

function validateConnectivity(source: M1GraphFixtureSourceV0, errors: ContentCompileError[]): void {
  const adjacency = new Map<string, Set<string>>();
  for (const node of source.nodes) {
    adjacency.set(node.sourceId, new Set<string>());
  }

  for (const edge of source.edges) {
    adjacency.get(edge.from)?.add(edge.to);
    adjacency.get(edge.to)?.add(edge.from);
  }

  const connectedStart = source.nodes.find((node) => node.isolation === "connected");
  const visited = new Set<string>();
  if (connectedStart !== undefined) {
    const pending = [connectedStart.sourceId];
    while (pending.length > 0) {
      const current = pending.shift();
      if (current === undefined || visited.has(current)) {
        continue;
      }
      visited.add(current);
      const neighbors = adjacency.get(current);
      if (neighbors !== undefined) {
        for (const neighbor of sortText([...neighbors])) {
          pending.push(neighbor);
        }
      }
    }
  }

  source.nodes.forEach((node, index) => {
    const degree = adjacency.get(node.sourceId)?.size ?? 0;
    if (node.isolation === "explicitly-isolated") {
      return;
    }

    if (degree === 0 || !visited.has(node.sourceId)) {
      errors.push({
        code: "isolated-node",
        path: `nodes[${index}].isolation`,
        message: `Node ${node.sourceId} is isolated or disconnected and is not explicitly marked.`
      });
    }
  });
}

function buildRuntimePack(source: M1GraphFixtureSourceV0): RuntimeContentPackV0 {
  const nodeAssignments = assignNodes(source.nodes);
  const edgeAssignments = assignEdges(source.edges);
  const nodeIdBySourceId = new Map(
    nodeAssignments.map((assignment) => [assignment.node.sourceId, assignment.runtimeId])
  );
  const nodes: RuntimeContentNodeV0[] = nodeAssignments.map((assignment) => ({
    id: parseContentNodeId(assignment.runtimeId),
    sourceId: assignment.node.sourceId,
    displayNameKey: assignment.node.displayNameKey
  }));
  const edges: RuntimeContentEdgeV0[] = edgeAssignments.map((assignment) => {
    const fromNodeId = nodeIdBySourceId.get(assignment.edge.from);
    const toNodeId = nodeIdBySourceId.get(assignment.edge.to);
    if (fromNodeId === undefined || toNodeId === undefined) {
      throw new Error(`Compiler invariant failed for edge ${assignment.edge.sourceId}.`);
    }

    return {
      id: parseContentEdgeId(assignment.runtimeId),
      sourceId: assignment.edge.sourceId,
      fromNodeId: parseContentNodeId(fromNodeId),
      toNodeId: parseContentNodeId(toNodeId),
      direction: assignment.edge.direction,
      traversalCost: assignment.edge.traversalCost
    };
  });
  const manifestHash = hashManifest(source.fixtureId, nodes, edges);

  return {
    schemaVersion: 1,
    kind: "runtime-content-pack-v0",
    fixtureId: source.fixtureId,
    manifest: {
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: source.fixtureKind,
      syntheticScope: source.syntheticScope,
      manifestHash: parseContentManifestHash(manifestHash),
      nodeCount: nodes.length,
      edgeCount: edges.length
    },
    nodes,
    edges
  };
}

function buildRuntimeM2WorldPack(source: M2WorldFixtureSourceV0): RuntimeM2WorldContentPackV0 {
  const districtAssignments = assignM2Districts(source.districts);
  const settlementAssignments = assignM2Settlements(source.settlements);
  const curveAssignments = assignM2Curves(source.regionalSeasonalCurves);
  const routeAssignments = assignM2Routes(source.routes);
  const geometryAssignments = assignM2Geometries(source.mapGeometries);
  const districtIdBySourceId = new Map(
    districtAssignments.map((assignment) => [assignment.district.sourceId, assignment.runtimeId])
  );
  const settlementIdBySourceId = new Map(
    settlementAssignments.map((assignment) => [
      assignment.settlement.sourceId,
      assignment.runtimeId
    ])
  );
  const curveIdBySourceId = new Map(
    curveAssignments.map((assignment) => [assignment.curve.sourceId, assignment.runtimeId])
  );
  const geometryIdBySourceId = new Map(
    geometryAssignments.map((assignment) => [assignment.geometry.sourceId, assignment.runtimeId])
  );

  const districts: RuntimeM2DistrictDefinitionV0[] = districtAssignments.map((assignment) => {
    const regionalCurveId = curveIdBySourceId.get(assignment.district.regionalCurveId);
    const mapGeometryId = geometryIdBySourceId.get(assignment.district.mapGeometryId);
    if (regionalCurveId === undefined || mapGeometryId === undefined) {
      throw new Error(`Compiler invariant failed for district ${assignment.district.sourceId}.`);
    }

    return {
      id: parseContentDistrictId(assignment.runtimeId),
      sourceId: assignment.district.sourceId,
      displayNameKey: assignment.district.displayNameKey,
      regionalCurveId: parseContentRegionalSeasonalCurveId(regionalCurveId),
      mapGeometryId: parseContentMapGeometryId(mapGeometryId)
    };
  });

  const settlements: RuntimeM2SettlementDefinitionV0[] = settlementAssignments.map((assignment) => {
    const districtId = districtIdBySourceId.get(assignment.settlement.districtId);
    const mapGeometryId = geometryIdBySourceId.get(assignment.settlement.mapGeometryId);
    if (districtId === undefined || mapGeometryId === undefined) {
      throw new Error(
        `Compiler invariant failed for settlement ${assignment.settlement.sourceId}.`
      );
    }

    return {
      id: parseContentSettlementId(assignment.runtimeId),
      sourceId: assignment.settlement.sourceId,
      displayNameKey: assignment.settlement.displayNameKey,
      districtId: parseContentDistrictId(districtId),
      mapGeometryId: parseContentMapGeometryId(mapGeometryId)
    };
  });

  const regionalSeasonalCurves: RuntimeM2RegionalSeasonalCurveV0[] = curveAssignments.map(
    (assignment) => ({
      id: parseContentRegionalSeasonalCurveId(assignment.runtimeId),
      sourceId: assignment.curve.sourceId,
      displayNameKey: assignment.curve.displayNameKey,
      monthlyValues: assignment.curve.monthlyValues.map((value) => ({ ...value }))
    })
  );

  const routes: RuntimeM2RouteDefinitionV0[] = routeAssignments.map((assignment) => {
    const fromDistrictId = districtIdBySourceId.get(assignment.route.fromDistrictId);
    const toDistrictId = districtIdBySourceId.get(assignment.route.toDistrictId);
    if (fromDistrictId === undefined || toDistrictId === undefined) {
      throw new Error(`Compiler invariant failed for route ${assignment.route.sourceId}.`);
    }

    return {
      id: parseContentRouteId(assignment.runtimeId),
      sourceId: assignment.route.sourceId,
      fromDistrictId: parseContentDistrictId(fromDistrictId),
      toDistrictId: parseContentDistrictId(toDistrictId),
      routeKind: assignment.route.routeKind,
      baseTravelCost: assignment.route.baseTravelCost
    };
  });

  const mapGeometries: RuntimeM2MapGeometryV0[] = geometryAssignments.map((assignment) => {
    const ownerRuntimeId =
      assignment.geometry.ownerKind === "district"
        ? districtIdBySourceId.get(assignment.geometry.ownerId)
        : settlementIdBySourceId.get(assignment.geometry.ownerId);
    if (ownerRuntimeId === undefined) {
      throw new Error(
        `Compiler invariant failed for map geometry ${assignment.geometry.sourceId}.`
      );
    }

    return {
      id: parseContentMapGeometryId(assignment.runtimeId),
      sourceId: assignment.geometry.sourceId,
      ownerKind: assignment.geometry.ownerKind,
      ownerId:
        assignment.geometry.ownerKind === "district"
          ? parseContentDistrictId(ownerRuntimeId)
          : parseContentSettlementId(ownerRuntimeId),
      geometryKind: assignment.geometry.geometryKind,
      anchor: { ...assignment.geometry.anchor },
      points: assignment.geometry.points.map((point) => ({ ...point }))
    };
  });

  const manifestHash = hashM2Manifest(
    source.fixtureId,
    districts,
    settlements,
    regionalSeasonalCurves,
    routes,
    mapGeometries
  );

  return {
    schemaVersion: 1,
    kind: "runtime-m2-world-content-pack-v0",
    fixtureId: source.fixtureId,
    manifest: {
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: source.fixtureKind,
      syntheticScope: source.syntheticScope,
      historicity: source.historicity,
      manifestHash: parseContentManifestHash(manifestHash),
      districtCount: districts.length,
      settlementCount: settlements.length,
      regionalSeasonalCurveCount: regionalSeasonalCurves.length,
      routeCount: routes.length,
      mapGeometryCount: mapGeometries.length
    },
    districts,
    settlements,
    regionalSeasonalCurves,
    routes,
    mapGeometries
  };
}

function buildRuntimeM3CharacterOfficePack(
  source: M3CharacterOfficeFixtureSourceV0
): RuntimeM3CharacterOfficeContentPackV0 {
  const characterAssignments = assignM3Characters(source.characters);
  const relationshipAssignments = assignM3Relationships(source.relationships);
  const officeAssignments = assignM3Offices(source.offices);
  const landedPowerAssignments = assignM3LandedPowers(source.landedPowers);
  const officePolicyAssignments = assignM3OfficePolicies(source.officePolicies);
  const hookAssignments = assignM3EnfeoffmentHooks(source.enfeoffmentHooks);
  const characterIdBySourceId = new Map(
    characterAssignments.map((assignment) => [assignment.character.sourceId, assignment.runtimeId])
  );
  const landedPowerIdBySourceId = new Map(
    landedPowerAssignments.map((assignment) => [
      assignment.landedPower.sourceId,
      assignment.runtimeId
    ])
  );
  const officePolicyIdBySourceId = new Map(
    officePolicyAssignments.map((assignment) => [
      assignment.officePolicy.sourceId,
      assignment.runtimeId
    ])
  );
  const hookIdBySourceId = new Map(
    hookAssignments.map((assignment) => [assignment.hook.sourceId, assignment.runtimeId])
  );

  const characters: RuntimeM3CharacterDefinitionV0[] = characterAssignments.map((assignment) => ({
    id: parseContentCharacterId(assignment.runtimeId),
    sourceId: assignment.character.sourceId,
    displayNameKey: assignment.character.displayNameKey,
    claimLabel: assignment.character.claimLabel,
    primaryPolitySourceId: assignment.character.primaryPolityId,
    archetype: assignment.character.archetype,
    aptitude: { ...assignment.character.aptitude }
  }));

  const relationships: RuntimeM3RelationshipDefinitionV0[] = relationshipAssignments.map(
    (assignment) => {
      const fromCharacterId = characterIdBySourceId.get(assignment.relationship.fromCharacterId);
      const toCharacterId = characterIdBySourceId.get(assignment.relationship.toCharacterId);
      if (fromCharacterId === undefined || toCharacterId === undefined) {
        throw new Error(
          `Compiler invariant failed for relationship ${assignment.relationship.sourceId}.`
        );
      }

      return {
        id: parseContentRelationshipId(assignment.runtimeId),
        sourceId: assignment.relationship.sourceId,
        fromCharacterId: parseContentCharacterId(fromCharacterId),
        toCharacterId: parseContentCharacterId(toCharacterId),
        relationshipKind: assignment.relationship.relationshipKind,
        intensityBps: assignment.relationship.intensityBps,
        claimLabel: assignment.relationship.claimLabel
      };
    }
  );

  const offices: RuntimeM3OfficeDefinitionV0[] = officeAssignments.map((assignment) => {
    const holderId = characterIdBySourceId.get(assignment.office.currentHolderCharacterId);
    const policyId = officePolicyIdBySourceId.get(assignment.office.policyId);
    const landedPowerId =
      assignment.office.landedPowerId === null
        ? null
        : landedPowerIdBySourceId.get(assignment.office.landedPowerId);
    if (holderId === undefined || policyId === undefined || landedPowerId === undefined) {
      throw new Error(`Compiler invariant failed for office ${assignment.office.sourceId}.`);
    }

    return {
      id: parseContentOfficeId(assignment.runtimeId),
      sourceId: assignment.office.sourceId,
      displayNameKey: assignment.office.displayNameKey,
      jurisdictionKind: assignment.office.jurisdictionKind,
      jurisdictionSourceId: assignment.office.jurisdictionId,
      currentHolderCharacterId: parseContentCharacterId(holderId),
      policyId: parseContentOfficePolicyId(policyId),
      landedPowerId: landedPowerId === null ? null : parseContentLandedPowerId(landedPowerId),
      appointmentEligibility: { ...assignment.office.appointmentEligibility }
    };
  });

  const landedPowers: RuntimeM3LandedPowerDefinitionV0[] = landedPowerAssignments.map(
    (assignment) => ({
      id: parseContentLandedPowerId(assignment.runtimeId),
      sourceId: assignment.landedPower.sourceId,
      districtSourceId: assignment.landedPower.districtId,
      extractionRightsBps: assignment.landedPower.extractionRightsBps,
      levyRightsBps: assignment.landedPower.levyRightsBps,
      successionWeightBps: assignment.landedPower.successionWeightBps
    })
  );

  const officePolicies: RuntimeM3OfficePolicyDefinitionV0[] = officePolicyAssignments.map(
    (assignment) => ({
      id: parseContentOfficePolicyId(assignment.runtimeId),
      sourceId: assignment.officePolicy.sourceId,
      displayNameKey: assignment.officePolicy.displayNameKey,
      appointmentMode: assignment.officePolicy.appointmentMode,
      taxAutonomyBps: assignment.officePolicy.taxAutonomyBps,
      militaryAutonomyBps: assignment.officePolicy.militaryAutonomyBps,
      persistsAcrossHolderChange: true,
      enfeoffmentHookIds: assignment.officePolicy.enfeoffmentHookIds.map((hookId) => {
        const runtimeHookId = hookIdBySourceId.get(hookId);
        if (runtimeHookId === undefined) {
          throw new Error(
            `Compiler invariant failed for office policy ${assignment.officePolicy.sourceId}.`
          );
        }
        return parseContentEnfeoffmentHookId(runtimeHookId);
      })
    })
  );

  const enfeoffmentHooks: RuntimeM3EnfeoffmentHookDefinitionV0[] = hookAssignments.map(
    (assignment) => ({
      id: parseContentEnfeoffmentHookId(assignment.runtimeId),
      sourceId: assignment.hook.sourceId,
      trigger: assignment.hook.trigger,
      effectKey: assignment.hook.effectKey
    })
  );

  const manifestHash = hashM3CharacterOfficeManifest(
    source.fixtureId,
    characters,
    relationships,
    offices,
    landedPowers,
    officePolicies,
    enfeoffmentHooks
  );

  return {
    schemaVersion: 1,
    kind: "runtime-m3-character-office-content-pack-v0",
    fixtureId: source.fixtureId,
    manifest: {
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: source.fixtureKind,
      syntheticScope: source.syntheticScope,
      historicity: source.historicity,
      manifestHash: parseContentManifestHash(manifestHash),
      characterCount: characters.length,
      relationshipCount: relationships.length,
      officeCount: offices.length,
      landedPowerCount: landedPowers.length,
      officePolicyCount: officePolicies.length,
      enfeoffmentHookCount: enfeoffmentHooks.length
    },
    characters,
    relationships,
    offices,
    landedPowers,
    officePolicies,
    enfeoffmentHooks
  };
}

function assignNodes(
  nodes: readonly M1GraphFixtureNodeSourceV0[]
): readonly StableNodeAssignment[] {
  return sortBySourceId(nodes).map((node, index) => ({
    node,
    runtimeId: index + 1
  }));
}

function assignEdges(
  edges: readonly M1GraphFixtureEdgeSourceV0[]
): readonly StableEdgeAssignment[] {
  return sortBySourceId(edges).map((edge, index) => ({
    edge,
    runtimeId: index + 1
  }));
}

function assignM2Districts(
  districts: readonly M2WorldDistrictSourceV0[]
): readonly StableDistrictAssignment[] {
  return sortBySourceId(districts).map((district, index) => ({
    district,
    runtimeId: index + 1
  }));
}

function assignM2Settlements(
  settlements: readonly M2WorldSettlementSourceV0[]
): readonly StableSettlementAssignment[] {
  return sortBySourceId(settlements).map((settlement, index) => ({
    settlement,
    runtimeId: index + 1
  }));
}

function assignM2Curves(
  curves: readonly M2WorldRegionalSeasonalCurveSourceV0[]
): readonly StableCurveAssignment[] {
  return sortBySourceId(curves).map((curve, index) => ({
    curve,
    runtimeId: index + 1
  }));
}

function assignM2Routes(routes: readonly M2WorldRouteSourceV0[]): readonly StableRouteAssignment[] {
  return sortBySourceId(routes).map((route, index) => ({
    route,
    runtimeId: index + 1
  }));
}

function assignM2Geometries(
  geometries: readonly M2WorldMapGeometrySourceV0[]
): readonly StableGeometryAssignment[] {
  return sortBySourceId(geometries).map((geometry, index) => ({
    geometry,
    runtimeId: index + 1
  }));
}

function assignM3Characters(
  characters: readonly M3CharacterSourceV0[]
): readonly StableCharacterAssignment[] {
  return sortBySourceId(characters).map((character, index) => ({
    character,
    runtimeId: index + 1
  }));
}

function assignM3Relationships(
  relationships: readonly M3RelationshipSourceV0[]
): readonly StableRelationshipAssignment[] {
  return sortBySourceId(relationships).map((relationship, index) => ({
    relationship,
    runtimeId: index + 1
  }));
}

function assignM3Offices(offices: readonly M3OfficeSourceV0[]): readonly StableOfficeAssignment[] {
  return sortBySourceId(offices).map((office, index) => ({
    office,
    runtimeId: index + 1
  }));
}

function assignM3LandedPowers(
  landedPowers: readonly M3LandedPowerSourceV0[]
): readonly StableLandedPowerAssignment[] {
  return sortBySourceId(landedPowers).map((landedPower, index) => ({
    landedPower,
    runtimeId: index + 1
  }));
}

function assignM3OfficePolicies(
  officePolicies: readonly M3OfficePolicySourceV0[]
): readonly StableOfficePolicyAssignment[] {
  return sortBySourceId(officePolicies).map((officePolicy, index) => ({
    officePolicy,
    runtimeId: index + 1
  }));
}

function assignM3EnfeoffmentHooks(
  hooks: readonly M3EnfeoffmentHookSourceV0[]
): readonly StableEnfeoffmentHookAssignment[] {
  return sortBySourceId(hooks).map((hook, index) => ({
    hook,
    runtimeId: index + 1
  }));
}

function routeSemanticKey(edge: M1GraphFixtureEdgeSourceV0): string {
  if (edge.direction === "directed") {
    return `directed:${edge.from}>${edge.to}`;
  }

  const orderedNodes = sortText([edge.from, edge.to]);
  const first = orderedNodes[0];
  const second = orderedNodes[1];
  if (first === undefined || second === undefined) {
    throw new Error("Expected bidirectional route endpoints.");
  }

  return `bidirectional:${first}<->${second}`;
}

function m2RouteSemanticKey(route: M2WorldRouteSourceV0): string {
  const orderedDistricts = sortText([route.fromDistrictId, route.toDistrictId]);
  const first = orderedDistricts[0];
  const second = orderedDistricts[1];
  if (first === undefined || second === undefined) {
    throw new Error("Expected M2 route endpoints.");
  }

  return `${route.routeKind}:${first}<->${second}`;
}

function hashManifest(
  fixtureId: string,
  nodes: readonly RuntimeContentNodeV0[],
  edges: readonly RuntimeContentEdgeV0[]
): string {
  return toFixedHexHash(
    hashText(
      [
        "runtime-content-pack-v0",
        `fixtureId=${fixtureId}`,
        `nodes=${nodes
          .map((node) => `${node.id}:${node.sourceId}:${node.displayNameKey}`)
          .join(",")}`,
        `edges=${edges
          .map(
            (edge) =>
              `${edge.id}:${edge.sourceId}:${edge.fromNodeId}:${edge.toNodeId}:${edge.direction}:${edge.traversalCost}`
          )
          .join(",")}`
      ].join("\n")
    )
  );
}

function hashM2Manifest(
  fixtureId: string,
  districts: readonly RuntimeM2DistrictDefinitionV0[],
  settlements: readonly RuntimeM2SettlementDefinitionV0[],
  regionalSeasonalCurves: readonly RuntimeM2RegionalSeasonalCurveV0[],
  routes: readonly RuntimeM2RouteDefinitionV0[],
  mapGeometries: readonly RuntimeM2MapGeometryV0[]
): string {
  return toFixedHexHash(
    hashText(
      [
        "runtime-m2-world-content-pack-v0",
        `fixtureId=${fixtureId}`,
        `districts=${districts
          .map(
            (district) =>
              `${district.id}:${district.sourceId}:${district.displayNameKey}:${district.regionalCurveId}:${district.mapGeometryId}`
          )
          .join(",")}`,
        `settlements=${settlements
          .map(
            (settlement) =>
              `${settlement.id}:${settlement.sourceId}:${settlement.displayNameKey}:${settlement.districtId}:${settlement.mapGeometryId}`
          )
          .join(",")}`,
        `regionalSeasonalCurves=${regionalSeasonalCurves
          .map(
            (curve) =>
              `${curve.id}:${curve.sourceId}:${curve.displayNameKey}:${curve.monthlyValues
                .map(
                  (value) =>
                    `${value.month}:${value.monsoonIntensityBps}:${value.agricultureWorkBps}:${value.riverNavigabilityBps}:${value.roadTravelCostBps}`
                )
                .join("|")}`
          )
          .join(",")}`,
        `routes=${routes
          .map(
            (route) =>
              `${route.id}:${route.sourceId}:${route.fromDistrictId}:${route.toDistrictId}:${route.routeKind}:${route.baseTravelCost}`
          )
          .join(",")}`,
        `mapGeometries=${mapGeometries
          .map(
            (geometry) =>
              `${geometry.id}:${geometry.sourceId}:${geometry.ownerKind}:${geometry.ownerId}:${geometry.geometryKind}:${geometry.anchor.x}:${geometry.anchor.y}:${geometry.points
                .map((point) => `${point.x}:${point.y}`)
                .join("|")}`
          )
          .join(",")}`
      ].join("\n")
    )
  );
}

function hashM3CharacterOfficeManifest(
  fixtureId: string,
  characters: readonly RuntimeM3CharacterDefinitionV0[],
  relationships: readonly RuntimeM3RelationshipDefinitionV0[],
  offices: readonly RuntimeM3OfficeDefinitionV0[],
  landedPowers: readonly RuntimeM3LandedPowerDefinitionV0[],
  officePolicies: readonly RuntimeM3OfficePolicyDefinitionV0[],
  enfeoffmentHooks: readonly RuntimeM3EnfeoffmentHookDefinitionV0[]
): string {
  return toFixedHexHash(
    hashText(
      [
        "runtime-m3-character-office-content-pack-v0",
        `fixtureId=${fixtureId}`,
        `characters=${characters
          .map(
            (character) =>
              `${character.id}:${character.sourceId}:${character.displayNameKey}:${character.claimLabel}:${character.primaryPolitySourceId}:${character.archetype}:${character.aptitude.administrationBps}:${character.aptitude.commandBps}:${character.aptitude.diplomacyBps}:${character.aptitude.ambitionBps}:${character.aptitude.legitimacyBps}`
          )
          .join(",")}`,
        `relationships=${relationships
          .map(
            (relationship) =>
              `${relationship.id}:${relationship.sourceId}:${relationship.fromCharacterId}:${relationship.toCharacterId}:${relationship.relationshipKind}:${relationship.intensityBps}:${relationship.claimLabel}`
          )
          .join(",")}`,
        `offices=${offices
          .map(
            (office) =>
              `${office.id}:${office.sourceId}:${office.displayNameKey}:${office.jurisdictionKind}:${office.jurisdictionSourceId}:${office.currentHolderCharacterId}:${office.policyId}:${formatNullableNumber(office.landedPowerId)}:${office.appointmentEligibility.minimumAdministrationBps}:${office.appointmentEligibility.minimumCommandBps}:${office.appointmentEligibility.minimumLegitimacyBps}:${office.appointmentEligibility.requiredArchetype ?? "null"}`
          )
          .join(",")}`,
        `landedPowers=${landedPowers
          .map(
            (landedPower) =>
              `${landedPower.id}:${landedPower.sourceId}:${landedPower.districtSourceId}:${landedPower.extractionRightsBps}:${landedPower.levyRightsBps}:${landedPower.successionWeightBps}`
          )
          .join(",")}`,
        `officePolicies=${officePolicies
          .map(
            (policy) =>
              `${policy.id}:${policy.sourceId}:${policy.displayNameKey}:${policy.appointmentMode}:${policy.taxAutonomyBps}:${policy.militaryAutonomyBps}:${policy.persistsAcrossHolderChange}:${policy.enfeoffmentHookIds.join("|")}`
          )
          .join(",")}`,
        `enfeoffmentHooks=${enfeoffmentHooks
          .map((hook) => `${hook.id}:${hook.sourceId}:${hook.trigger}:${hook.effectKey}`)
          .join(",")}`
      ].join("\n")
    )
  );
}

function hashText(text: string): number {
  let hash = INITIAL_HASH_OFFSET;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, HASH_PRIME) >>> 0;
  }

  return hash;
}

function toFixedHexHash(hash: number): string {
  return hash.toString(16).padStart(8, "0");
}

function sortBySourceId<TValue extends { readonly sourceId: string }>(
  values: readonly TValue[]
): readonly TValue[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) =>
        compareText(left.value.sourceId, right.value.sourceId) || left.index - right.index
    )
    .map((entry) => entry.value);
}

function sortText(values: readonly string[]): readonly string[] {
  return [...values].sort(compareText);
}

function findM3SourceParentCycle(relationships: readonly M3RelationshipSourceV0[]): string | null {
  const parentByChildId = new Map<string, string[]>();
  const characterIds = new Set<string>();
  for (const relationship of relationships) {
    if (relationship.relationshipKind !== "parent") {
      continue;
    }
    characterIds.add(relationship.fromCharacterId);
    characterIds.add(relationship.toCharacterId);
    const parents = parentByChildId.get(relationship.toCharacterId) ?? [];
    parents.push(relationship.fromCharacterId);
    parentByChildId.set(relationship.toCharacterId, parents);
  }

  const visiting = new Set<string>();
  const done = new Set<string>();
  const visit = (characterId: string): string | null => {
    if (visiting.has(characterId)) {
      return characterId;
    }
    if (done.has(characterId)) {
      return null;
    }
    visiting.add(characterId);
    const parents = parentByChildId.get(characterId) ?? [];
    for (const parentId of sortText(parents)) {
      const cycleId = visit(parentId);
      if (cycleId !== null) {
        return cycleId;
      }
    }
    visiting.delete(characterId);
    done.add(characterId);
    return null;
  };

  for (const characterId of sortText([...characterIds])) {
    const cycleId = visit(characterId);
    if (cycleId !== null) {
      return cycleId;
    }
  }

  return null;
}

function formatNullableNumber(value: number | null): string {
  return value === null ? "null" : `${value}`;
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

function formatCompileErrors(errors: readonly ContentCompileError[]): string {
  return errors.map((error) => `${error.code} ${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

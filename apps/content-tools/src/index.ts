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
  type M2TopologyRouteEndpointSourceV0,
  type M2TopologyRouteNodeSourceV0,
  type M2WorldDistrictSourceV0,
  type M2WorldMapGeometrySourceV0,
  type M2WorldMapPointSourceV0,
  type M2WorldRegionalSeasonalCurveSourceV0,
  type M2WorldRouteSourceV0,
  type M2WorldSettlementSourceV0,
  type M2WorldFixtureSourceV0
} from "@monsoon/content-schema";
import {
  type RuntimeM6AlphaMapCandidateContentPackV0,
  type RuntimeM7BetaScenarioPersonEventContentPackV0,
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
  type RuntimeM2BarrierChannelV0,
  type RuntimeM2DistrictGovernanceFootprintV0,
  type RuntimeM2MapGeometryV0,
  type RuntimeM2RegionalSeasonalCurveV0,
  type RuntimeM2RouteDefinitionV0,
  type RuntimeM2RouteCorridorSeasonalModifierV0,
  type RuntimeM2RouteCorridorV0,
  type RuntimeM2SettlementDefinitionV0,
  type RuntimeM2StrategicNodeV0,
  type RuntimeM2StrategicTerrainPointV0,
  type RuntimeM2StrategicTerrainV0,
  type RuntimeM2TerrainPatchV0,
  type RuntimeM2TopologyRouteEndpointV0,
  type RuntimeM2TopologyV0,
  type RuntimeM2WorldContentPackV0
} from "@monsoon/content-runtime";

import { compileM6AlphaScenarioContentPackV0 } from "./m6-alpha-scenario.ts";
import { compileM6AlphaMapCandidateContentPackV0 } from "./m6-alpha-map-candidate.ts";
import { compileM7BetaScenarioPersonEventContentPackV0 } from "./m7-beta-scenario.ts";

export type ContentCompileErrorCode =
  | ContentSchemaError["code"]
  | "bad-reference"
  | "duplicate-id"
  | "duplicate-route"
  | "invalid-eligibility"
  | "historical-overclaim"
  | "invalid-relationship"
  | "invalid-count"
  | "invalid-classification"
  | "invalid-geometry"
  | "invalid-route"
  | "invalid-seasonal-curve"
  | "invalid-topology"
  | "lattice-adjacency"
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
        | RuntimeM6AlphaScenarioContentPackV0
        | RuntimeM6AlphaMapCandidateContentPackV0
        | RuntimeM7BetaScenarioPersonEventContentPackV0;
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

type M2StrategicNodeSourceV0 = Omit<RuntimeM2StrategicNodeV0, "districtId"> & {
  readonly districtId: string;
};

type M2DistrictGovernanceFootprintSourceV0 = Omit<
  RuntimeM2DistrictGovernanceFootprintV0,
  "districtId"
> & {
  readonly districtId: string;
};

interface M2StrategicTerrainSourceV0 {
  readonly authority: "terrain-route-node-v1";
  readonly governanceFootprintRole: "overlay-only";
  readonly authorityProhibitions: RuntimeM2StrategicTerrainV0["authorityProhibitions"];
  readonly terrainPatches: readonly RuntimeM2TerrainPatchV0[];
  readonly barrierChannels: readonly RuntimeM2BarrierChannelV0[];
  readonly strategicNodes: readonly M2StrategicNodeSourceV0[];
  readonly routeCorridors: readonly RuntimeM2RouteCorridorV0[];
  readonly districtGovernanceFootprints: readonly M2DistrictGovernanceFootprintSourceV0[];
}

type M2StrategicTerrainParseResult =
  | { readonly ok: true; readonly value: M2StrategicTerrainSourceV0 | undefined }
  | { readonly ok: false; readonly errors: readonly ContentCompileError[] };

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
  if (isRecord(input) && input["kind"] === "m6.alpha-map-candidate-set") {
    return compileM6AlphaMapCandidateContentPackV0(input);
  }

  if (isRecord(input) && input["kind"] === "m6.alpha-scenario-set") {
    return compileM6AlphaScenarioContentPackV0(input);
  }

  if (isRecord(input) && input["kind"] === "m7.beta-scenario-person-event-set") {
    return compileM7BetaScenarioPersonEventContentPackV0(input);
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
  | RuntimeM6AlphaScenarioContentPackV0
  | RuntimeM6AlphaMapCandidateContentPackV0
  | RuntimeM7BetaScenarioPersonEventContentPackV0 {
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

  const strategicTerrain = parseM2StrategicTerrainSource(input);
  if (!strategicTerrain.ok) {
    return {
      status: "error",
      errors: strategicTerrain.errors
    };
  }

  const source = parseM2WorldFixtureSourceV0(input);
  const semanticErrors = validateM2WorldSemantics(source, strategicTerrain.value);
  if (semanticErrors.length > 0) {
    return {
      status: "error",
      errors: semanticErrors
    };
  }

  const pack = buildRuntimeM2WorldPack(source, strategicTerrain.value);
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

function validateM2WorldSemantics(
  source: M2WorldFixtureSourceV0,
  strategicTerrain: M2StrategicTerrainSourceV0 | undefined
): readonly ContentCompileError[] {
  const errors: ContentCompileError[] = [];

  if (source.districts.length < 12 || source.districts.length > 18) {
    errors.push({
      code: "invalid-count",
      path: "districts",
      message: `M2 prototype fixture must contain 12-18 districts, received ${source.districts.length}.`
    });
  }

  if (source.settlements.length < 4 || source.settlements.length > 10) {
    errors.push({
      code: "invalid-count",
      path: "settlements",
      message: `M2 prototype fixture must contain 4-10 settlements, received ${source.settlements.length}.`
    });
  }

  if (source.routes.length < 25 || source.routes.length > 40) {
    errors.push({
      code: "invalid-count",
      path: "routes",
      message: `M2 prototype fixture must contain 25-40 explicit routes, received ${source.routes.length}.`
    });
  }

  if (source.topology.routeEdges.length < 25 || source.topology.routeEdges.length > 40) {
    errors.push({
      code: "invalid-count",
      path: "topology.routeEdges",
      message: `M2 prototype topology must contain 25-40 explicit route edges, received ${source.topology.routeEdges.length}.`
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
  validateM2Topology(source, errors);
  if (strategicTerrain !== undefined) {
    validateM2StrategicTerrain(source, strategicTerrain, errors);
  }

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

function validateM2Topology(source: M2WorldFixtureSourceV0, errors: ContentCompileError[]): void {
  validateStableOrderAndUniqueIds(source.topology.routeEdges, "topology.routeEdges", errors);
  validateM2TopologyUniqueRouteNodes(source.topology.routeNodes, errors);
  validateM2TopologyReferences(source, errors);
  validateM2TopologyGeometry(source, errors);
  validateM2TopologyConnectivity(source, errors);
  validateM2AntiGridTopology(source, errors);
}

function validateM2TopologyUniqueRouteNodes(
  routeNodes: readonly M2TopologyRouteNodeSourceV0[],
  errors: ContentCompileError[]
): void {
  const seen = new Set<string>();
  let previousNodeId = "";
  routeNodes.forEach((node, index) => {
    if (seen.has(node.nodeId)) {
      errors.push({
        code: "duplicate-id",
        path: `topology.routeNodes[${index}].nodeId`,
        message: `Duplicate topology route node id ${node.nodeId}.`
      });
    }
    if (index > 0 && compareText(node.nodeId, previousNodeId) <= 0) {
      errors.push({
        code: "unstable-order",
        path: `topology.routeNodes[${index}].nodeId`,
        message: "topology.routeNodes must be sorted by nodeId for deterministic stable assignment."
      });
    }
    seen.add(node.nodeId);
    previousNodeId = node.nodeId;
  });
}

function validateM2TopologyReferences(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const districtIds = new Set(source.districts.map((district) => district.sourceId));
  const settlementIds = new Set(source.settlements.map((settlement) => settlement.sourceId));
  const routeBySourceId = new Map(source.routes.map((route) => [route.sourceId, route]));
  const nodeById = new Map(source.topology.routeNodes.map((node) => [node.nodeId, node]));
  const isolated = new Set<string>();

  source.topology.explicitIsolations.forEach((isolation, index) => {
    if (!districtIds.has(isolation.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `topology.explicitIsolations[${index}].districtId`,
        message: `Explicit isolation references missing district ${isolation.districtId}.`
      });
    }
    if (isolated.has(isolation.districtId)) {
      errors.push({
        code: "duplicate-id",
        path: `topology.explicitIsolations[${index}].districtId`,
        message: `Duplicate explicit isolation for ${isolation.districtId}.`
      });
    }
    isolated.add(isolation.districtId);
  });

  source.topology.routeNodes.forEach((node, index) => {
    if (!districtIds.has(node.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `topology.routeNodes[${index}].districtId`,
        message: `Topology route node ${node.nodeId} references missing district ${node.districtId}.`
      });
    }
  });

  const usedRouteIds = new Set<string>();
  source.topology.routeEdges.forEach((edge, index) => {
    const route = routeBySourceId.get(edge.routeId);
    if (route === undefined) {
      errors.push({
        code: "bad-reference",
        path: `topology.routeEdges[${index}].routeId`,
        message: `Topology route edge ${edge.sourceId} references missing route ${edge.routeId}.`
      });
    } else {
      const fromDistrictId = m2TopologyEndpointDistrictId(
        edge.from,
        nodeById,
        settlementIds,
        source
      );
      const toDistrictId = m2TopologyEndpointDistrictId(edge.to, nodeById, settlementIds, source);
      if (fromDistrictId !== route.fromDistrictId || toDistrictId !== route.toDistrictId) {
        errors.push({
          code: "invalid-topology",
          path: `topology.routeEdges[${index}]`,
          message: `Topology route edge ${edge.sourceId} endpoints must match route ${edge.routeId}.`
        });
      }
      if (edge.mode !== route.routeKind) {
        errors.push({
          code: "invalid-topology",
          path: `topology.routeEdges[${index}]`,
          message: `Topology route edge ${edge.sourceId} mode must match route ${edge.routeId}.`
        });
      }
    }
    validateM2TopologyEndpointReference(
      edge.from,
      `topology.routeEdges[${index}].from`,
      districtIds,
      settlementIds,
      nodeById,
      source,
      errors
    );
    validateM2TopologyEndpointReference(
      edge.to,
      `topology.routeEdges[${index}].to`,
      districtIds,
      settlementIds,
      nodeById,
      source,
      errors
    );
    if (usedRouteIds.has(edge.routeId)) {
      errors.push({
        code: "duplicate-id",
        path: `topology.routeEdges[${index}].routeId`,
        message: `Duplicate topology route binding for ${edge.routeId}.`
      });
    }
    usedRouteIds.add(edge.routeId);
    if (edge.seasonality.map((value) => value.month).join(",") !== "1,2,3,4,5,6,7,8,9,10,11,12") {
      errors.push({
        code: "invalid-topology",
        path: `topology.routeEdges[${index}].seasonality`,
        message: `Topology route edge ${edge.sourceId} seasonality must be ordered from month 1 through 12.`
      });
    }
  });
}

function validateM2TopologyEndpointReference(
  endpoint: M2TopologyRouteEndpointSourceV0,
  path: string,
  districtIds: ReadonlySet<string>,
  settlementIds: ReadonlySet<string>,
  nodeById: ReadonlyMap<string, M2TopologyRouteNodeSourceV0>,
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  if (endpoint.kind === "district" && !districtIds.has(endpoint.districtId)) {
    errors.push({
      code: "bad-reference",
      path: `${path}.districtId`,
      message: `Missing endpoint district ${endpoint.districtId}.`
    });
  }
  if (endpoint.kind === "settlement" && !settlementIds.has(endpoint.settlementId)) {
    errors.push({
      code: "bad-reference",
      path: `${path}.settlementId`,
      message: `Missing endpoint settlement ${endpoint.settlementId}.`
    });
  }
  if (endpoint.kind === "route-node" && !nodeById.has(endpoint.nodeId)) {
    errors.push({
      code: "bad-reference",
      path: `${path}.nodeId`,
      message: `Missing endpoint route node ${endpoint.nodeId}.`
    });
  }
  const districtId = m2TopologyEndpointDistrictId(endpoint, nodeById, settlementIds, source);
  if (districtId === undefined) {
    errors.push({
      code: "bad-reference",
      path,
      message: "Topology endpoint must resolve to a district."
    });
  }
}

function m2TopologyEndpointDistrictId(
  endpoint: M2TopologyRouteEndpointSourceV0,
  nodeById: ReadonlyMap<string, M2TopologyRouteNodeSourceV0>,
  settlementIds: ReadonlySet<string>,
  source: M2WorldFixtureSourceV0
): string | undefined {
  if (endpoint.kind === "district") {
    return endpoint.districtId;
  }
  if (endpoint.kind === "route-node") {
    return nodeById.get(endpoint.nodeId)?.districtId;
  }
  if (!settlementIds.has(endpoint.settlementId)) {
    return undefined;
  }
  return source.settlements.find((settlement) => settlement.sourceId === endpoint.settlementId)
    ?.districtId;
}

function validateM2TopologyGeometry(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const districtGeometryByOwnerId = new Map(
    source.mapGeometries
      .filter((geometry) => geometry.ownerKind === "district")
      .map((geometry) => [geometry.ownerId, geometry])
  );

  source.topology.routeNodes.forEach((node, index) => {
    const geometry = districtGeometryByOwnerId.get(node.districtId);
    if (
      geometry !== undefined &&
      geometry.geometryKind === "polygon" &&
      !isPointInOrOnPolygon(node.anchor, geometry.points)
    ) {
      errors.push({
        code: "invalid-topology",
        path: `topology.routeNodes[${index}].anchor`,
        message: `Topology route node ${node.nodeId} anchor must be inside its district polygon.`
      });
    }
  });

  const districtGeometries = source.mapGeometries.filter(
    (geometry) => geometry.ownerKind === "district" && geometry.geometryKind === "polygon"
  );
  districtGeometries.forEach((geometry, index) => {
    if (hasSelfIntersection(geometry.points)) {
      errors.push({
        code: "invalid-geometry",
        path: `mapGeometries[${source.mapGeometries.indexOf(geometry)}].points`,
        message: `District polygon ${geometry.sourceId} must not self-intersect.`
      });
    }
    for (
      let compareIndex = index + 1;
      compareIndex < districtGeometries.length;
      compareIndex += 1
    ) {
      const other = districtGeometries[compareIndex];
      if (other !== undefined && polygonsOverlap(geometry.points, other.points)) {
        errors.push({
          code: "invalid-geometry",
          path: `mapGeometries[${source.mapGeometries.indexOf(other)}].points`,
          message: `District polygon ${other.sourceId} must not overlap ${geometry.sourceId}.`
        });
      }
    }
  });
}

function validateM2TopologyConnectivity(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const nodeById = new Map(source.topology.routeNodes.map((node) => [node.nodeId, node]));
  const settlementIds = new Set(source.settlements.map((settlement) => settlement.sourceId));
  const isolated = new Set(source.topology.explicitIsolations.map((entry) => entry.districtId));
  const adjacency = new Map<string, Set<string>>();
  for (const district of source.districts) {
    if (!isolated.has(district.sourceId)) {
      adjacency.set(district.sourceId, new Set<string>());
    }
  }

  source.topology.routeEdges.forEach((edge) => {
    if (edge.availability.kind !== "open") {
      return;
    }
    const from = m2TopologyEndpointDistrictId(edge.from, nodeById, settlementIds, source);
    const to = m2TopologyEndpointDistrictId(edge.to, nodeById, settlementIds, source);
    if (from !== undefined && to !== undefined && adjacency.has(from) && adjacency.has(to)) {
      adjacency.get(from)?.add(to);
      adjacency.get(to)?.add(from);
    }
  });

  const start = sortText([...adjacency.keys()])[0];
  const visited = new Set<string>();
  if (start !== undefined) {
    const pending = [start];
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
    if (isolated.has(district.sourceId)) {
      return;
    }
    const degree = adjacency.get(district.sourceId)?.size ?? 0;
    if (degree === 0 || !visited.has(district.sourceId)) {
      errors.push({
        code: "isolated-district",
        path: `districts[${index}].sourceId`,
        message: `District ${district.sourceId} is disconnected without explicit topology isolation.`
      });
    }
  });
}

function validateM2AntiGridTopology(
  source: M2WorldFixtureSourceV0,
  errors: ContentCompileError[]
): void {
  const districtGeometries = source.mapGeometries.filter(
    (geometry) => geometry.ownerKind === "district" && geometry.geometryKind === "polygon"
  );
  const uniqueX = new Set(districtGeometries.map((geometry) => geometry.anchor.x));
  const uniqueY = new Set(districtGeometries.map((geometry) => geometry.anchor.y));
  const looksLikeRectangularLattice =
    uniqueX.size * uniqueY.size === districtGeometries.length &&
    districtGeometries.length === source.districts.length;
  const routePairs = source.topology.routeEdges.map((edge) => edge.routeId);
  const sequentialRouteIds = routePairs.every(
    (routeId, index) => routeId === `route-${String(index + 1).padStart(3, "0")}`
  );
  const hasExplicitRouteNodeEndpoint = source.topology.routeEdges.some(
    (edge) => edge.from.kind === "route-node" || edge.to.kind === "route-node"
  );
  if (looksLikeRectangularLattice && sequentialRouteIds && !hasExplicitRouteNodeEndpoint) {
    errors.push({
      code: "lattice-adjacency",
      path: "topology",
      message: "M2 topology must not derive movement from row/column/grid/hex/lattice order."
    });
  }
}

const M2_STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS = [
  "bounding-box-adjacency",
  "centroid-proximity",
  "hidden-grid",
  "hidden-lattice",
  "hex-axial-or-cube",
  "renderer-only-line-reachability",
  "sequential-id-reachability"
] as const;
const M2_STRATEGIC_TERRAIN_CLASSES = [
  "coastal",
  "lowland",
  "pass",
  "ridge",
  "river-basin",
  "riverine",
  "upland",
  "urban",
  "wetland",
  "unknown"
] as const;
const M2_STRATEGIC_TERRAIN_RISK_CLASSES = [
  "contested",
  "hazardous",
  "low",
  "seasonal",
  "unknown"
] as const;
const M2_STRATEGIC_TERRAIN_SEASON_STATES = ["dry", "monsoon", "transition", "unknown"] as const;
const M2_STRATEGIC_TERRAIN_HISTORICITY_TAGS = [
  "COMPOSITE",
  "FICTIONAL",
  "HISTORICAL",
  "INFERRED"
] as const;
const M2_BARRIER_CHANNEL_KINDS = ["coast", "major-river", "ridge", "strait", "wetland"] as const;
const M2_BARRIER_TRAVERSAL_RULES = [
  "blocks-without-explicit-corridor",
  "channels-explicit-corridors"
] as const;
const M2_STRATEGIC_NODE_KINDS = [
  "castle",
  "crossing",
  "objective",
  "pass",
  "port",
  "staging-area",
  "town",
  "warehouse"
] as const;
const M2_STRATEGIC_NODE_KNOWN_STATES = ["known", "rumored", "unknown"] as const;
const M2_ROUTE_CORRIDOR_MODES = ["coast", "mixed", "pass", "river", "road"] as const;
const M2_ROUTE_CORRIDOR_WIDTH_CLASSES = ["narrow", "standard", "wide"] as const;

function parseM2StrategicTerrainSource(input: unknown): M2StrategicTerrainParseResult {
  if (!isRecord(input) || input["strategicTerrain"] === undefined) {
    return { ok: true, value: undefined };
  }
  const terrain = input["strategicTerrain"];
  if (!isRecord(terrain)) {
    return {
      ok: false,
      errors: [
        {
          code: "invalid-schema",
          path: "strategicTerrain",
          message: "strategicTerrain must be an object."
        }
      ]
    };
  }

  const errors: ContentCompileError[] = [];
  const value: M2StrategicTerrainSourceV0 = {
    authority: readStrategicStringUnion(
      terrain,
      "authority",
      "strategicTerrain.authority",
      ["terrain-route-node-v1"],
      errors
    ),
    governanceFootprintRole: readStrategicStringUnion(
      terrain,
      "governanceFootprintRole",
      "strategicTerrain.governanceFootprintRole",
      ["overlay-only"],
      errors
    ),
    authorityProhibitions: parseStrategicStringUnionArray(
      terrain["authorityProhibitions"],
      "strategicTerrain.authorityProhibitions",
      M2_STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS,
      errors
    ),
    terrainPatches: parseStrategicRecordArray(
      terrain,
      "terrainPatches",
      "strategicTerrain.terrainPatches",
      errors,
      parseM2TerrainPatch
    ),
    barrierChannels: parseStrategicRecordArray(
      terrain,
      "barrierChannels",
      "strategicTerrain.barrierChannels",
      errors,
      parseM2BarrierChannel
    ),
    strategicNodes: parseStrategicRecordArray(
      terrain,
      "strategicNodes",
      "strategicTerrain.strategicNodes",
      errors,
      parseM2StrategicNode
    ),
    routeCorridors: parseStrategicRecordArray(
      terrain,
      "routeCorridors",
      "strategicTerrain.routeCorridors",
      errors,
      parseM2RouteCorridor
    ),
    districtGovernanceFootprints: parseStrategicRecordArray(
      terrain,
      "districtGovernanceFootprints",
      "strategicTerrain.districtGovernanceFootprints",
      errors,
      parseM2DistrictGovernanceFootprint
    )
  };

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value };
}

function parseM2TerrainPatch(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): RuntimeM2TerrainPatchV0 {
  return {
    patchId: readStrategicString(input, "patchId", `${path}.patchId`, errors),
    sourceId: readStrategicString(input, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readStrategicString(input, "displayNameKey", `${path}.displayNameKey`, errors),
    terrainClass: readStrategicStringUnion(
      input,
      "terrainClass",
      `${path}.terrainClass`,
      M2_STRATEGIC_TERRAIN_CLASSES,
      errors
    ),
    seasonSensitivity: readStrategicStringUnion(
      input,
      "seasonSensitivity",
      `${path}.seasonSensitivity`,
      M2_STRATEGIC_TERRAIN_SEASON_STATES,
      errors
    ),
    historicity: readStrategicStringUnion(
      input,
      "historicity",
      `${path}.historicity`,
      M2_STRATEGIC_TERRAIN_HISTORICITY_TAGS,
      errors
    ),
    polygon: parseStrategicPointArray(input["polygon"], `${path}.polygon`, errors),
    explanationTags: parseStrategicStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseM2BarrierChannel(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): RuntimeM2BarrierChannelV0 {
  return {
    channelId: readStrategicString(input, "channelId", `${path}.channelId`, errors),
    sourceId: readStrategicString(input, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readStrategicString(input, "displayNameKey", `${path}.displayNameKey`, errors),
    channelKind: readStrategicStringUnion(
      input,
      "channelKind",
      `${path}.channelKind`,
      M2_BARRIER_CHANNEL_KINDS,
      errors
    ),
    traversalRule: readStrategicStringUnion(
      input,
      "traversalRule",
      `${path}.traversalRule`,
      M2_BARRIER_TRAVERSAL_RULES,
      errors
    ),
    historicity: readStrategicStringUnion(
      input,
      "historicity",
      `${path}.historicity`,
      M2_STRATEGIC_TERRAIN_HISTORICITY_TAGS,
      errors
    ),
    points: parseStrategicPointArray(input["points"], `${path}.points`, errors),
    explanationTags: parseStrategicStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseM2StrategicNode(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): M2StrategicNodeSourceV0 {
  return {
    nodeId: readStrategicString(input, "nodeId", `${path}.nodeId`, errors),
    sourceId: readStrategicString(input, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readStrategicString(input, "displayNameKey", `${path}.displayNameKey`, errors),
    nodeKind: readStrategicStringUnion(
      input,
      "nodeKind",
      `${path}.nodeKind`,
      M2_STRATEGIC_NODE_KINDS,
      errors
    ),
    districtId: readStrategicString(input, "districtId", `${path}.districtId`, errors),
    anchor: parseStrategicPoint(input["anchor"], `${path}.anchor`, errors),
    localCapacity: readStrategicPositiveInteger(
      input,
      "localCapacity",
      `${path}.localCapacity`,
      errors
    ),
    knownState: readStrategicStringUnion(
      input,
      "knownState",
      `${path}.knownState`,
      M2_STRATEGIC_NODE_KNOWN_STATES,
      errors
    ),
    terrainPatchIds: parseStrategicStringArray(
      input["terrainPatchIds"],
      `${path}.terrainPatchIds`,
      errors
    ),
    barrierChannelIds: parseStrategicStringArray(
      input["barrierChannelIds"],
      `${path}.barrierChannelIds`,
      errors
    ),
    governanceFootprintIds: parseStrategicStringArray(
      input["governanceFootprintIds"],
      `${path}.governanceFootprintIds`,
      errors
    ),
    explanationTags: parseStrategicStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseM2RouteCorridor(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): RuntimeM2RouteCorridorV0 {
  return {
    corridorId: readStrategicString(input, "corridorId", `${path}.corridorId`, errors),
    sourceId: readStrategicString(input, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readStrategicString(input, "displayNameKey", `${path}.displayNameKey`, errors),
    fromNodeId: readStrategicString(input, "fromNodeId", `${path}.fromNodeId`, errors),
    toNodeId: readStrategicString(input, "toNodeId", `${path}.toNodeId`, errors),
    mode: readStrategicStringUnion(input, "mode", `${path}.mode`, M2_ROUTE_CORRIDOR_MODES, errors),
    widthClass: readStrategicStringUnion(
      input,
      "widthClass",
      `${path}.widthClass`,
      M2_ROUTE_CORRIDOR_WIDTH_CLASSES,
      errors
    ),
    baseTravelCost: readStrategicPositiveInteger(
      input,
      "baseTravelCost",
      `${path}.baseTravelCost`,
      errors
    ),
    baseCapacity: readStrategicPositiveInteger(
      input,
      "baseCapacity",
      `${path}.baseCapacity`,
      errors
    ),
    riskClass: readStrategicStringUnion(
      input,
      "riskClass",
      `${path}.riskClass`,
      M2_STRATEGIC_TERRAIN_RISK_CLASSES,
      errors
    ),
    terrainPatchIds: parseStrategicStringArray(
      input["terrainPatchIds"],
      `${path}.terrainPatchIds`,
      errors
    ),
    barrierChannelIds: parseStrategicStringArray(
      input["barrierChannelIds"],
      `${path}.barrierChannelIds`,
      errors
    ),
    governanceFootprintIds: parseStrategicStringArray(
      input["governanceFootprintIds"],
      `${path}.governanceFootprintIds`,
      errors
    ),
    seasonality: parseStrategicRouteCorridorSeasonality(input, `${path}.seasonality`, errors),
    availability: parseM2RouteCorridorAvailability(
      input["availability"],
      `${path}.availability`,
      errors
    ),
    polyline: parseStrategicPointArray(input["polyline"], `${path}.polyline`, errors),
    explanationTags: parseStrategicStringArray(
      input["explanationTags"],
      `${path}.explanationTags`,
      errors
    )
  };
}

function parseM2RouteCorridorSeasonality(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): RuntimeM2RouteCorridorSeasonalModifierV0 {
  return {
    month: readStrategicIntegerInRange(input, "month", `${path}.month`, 1, 12, errors),
    seasonState: readStrategicStringUnion(
      input,
      "seasonState",
      `${path}.seasonState`,
      M2_STRATEGIC_TERRAIN_SEASON_STATES,
      errors
    ),
    travelCostMultiplierBps: readStrategicIntegerInRange(
      input,
      "travelCostMultiplierBps",
      `${path}.travelCostMultiplierBps`,
      1,
      30000,
      errors
    ),
    capacityMultiplierBps: readStrategicIntegerInRange(
      input,
      "capacityMultiplierBps",
      `${path}.capacityMultiplierBps`,
      0,
      30000,
      errors
    ),
    riskBps: readStrategicIntegerInRange(input, "riskBps", `${path}.riskBps`, 0, 10000, errors),
    reasonCodes: parseStrategicStringArray(input["reasonCodes"], `${path}.reasonCodes`, errors)
  };
}

function parseStrategicRouteCorridorSeasonality(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): readonly RuntimeM2RouteCorridorSeasonalModifierV0[] {
  if (input["seasonality"] === undefined) {
    return defaultStrategicRouteCorridorSeasonality();
  }
  return parseStrategicRecordArray(
    input,
    "seasonality",
    path,
    errors,
    parseM2RouteCorridorSeasonality
  );
}

function defaultStrategicRouteCorridorSeasonality(): readonly RuntimeM2RouteCorridorSeasonalModifierV0[] {
  return Array.from({ length: 12 }, (_unused, index) => {
    const month = index + 1;
    const isMonsoon = month >= 5 && month <= 9;
    return {
      month,
      seasonState: isMonsoon ? "monsoon" : "dry",
      travelCostMultiplierBps: isMonsoon ? 12_000 : 10_000,
      capacityMultiplierBps: isMonsoon ? 8_500 : 10_000,
      riskBps: isMonsoon ? 650 : 150,
      reasonCodes: [`strategic-terrain.season.composite.${String(month).padStart(2, "0")}`]
    };
  });
}

function parseM2RouteCorridorAvailability(
  input: unknown,
  path: string,
  errors: ContentCompileError[]
): RuntimeM2RouteCorridorV0["availability"] {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return { kind: "open" };
  }
  const kind = readStrategicStringUnion(
    input,
    "kind",
    `${path}.kind`,
    ["blocked", "open", "unknown"],
    errors
  );
  if (kind === "open") {
    return { kind: "open" };
  }
  return {
    kind,
    reasonCode: readStrategicString(input, "reasonCode", `${path}.reasonCode`, errors)
  };
}

function parseM2DistrictGovernanceFootprint(
  input: Record<string, unknown>,
  path: string,
  errors: ContentCompileError[]
): M2DistrictGovernanceFootprintSourceV0 {
  if (input["overlayOnly"] !== true) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.overlayOnly`,
      message: "District governance footprint overlayOnly must be true."
    });
  }
  return {
    footprintId: readStrategicString(input, "footprintId", `${path}.footprintId`, errors),
    sourceId: readStrategicString(input, "sourceId", `${path}.sourceId`, errors),
    displayNameKey: readStrategicString(input, "displayNameKey", `${path}.displayNameKey`, errors),
    districtId: readStrategicString(input, "districtId", `${path}.districtId`, errors),
    overlayOnly: true,
    polygon: parseStrategicPointArray(input["polygon"], `${path}.polygon`, errors),
    governanceTags: parseStrategicStringArray(
      input["governanceTags"],
      `${path}.governanceTags`,
      errors
    ),
    consequenceTags: parseStrategicStringArray(
      input["consequenceTags"],
      `${path}.consequenceTags`,
      errors
    )
  };
}

function validateM2StrategicTerrain(
  source: M2WorldFixtureSourceV0,
  terrain: M2StrategicTerrainSourceV0,
  errors: ContentCompileError[]
): void {
  validateM2StrategicTerrainCounts(terrain, errors);
  const patchIds = collectM2StrategicTerrainStableIds(
    terrain.terrainPatches,
    "patchId",
    "strategicTerrain.terrainPatches",
    (patch) => patch.patchId,
    errors
  );
  const barrierIds = collectM2StrategicTerrainStableIds(
    terrain.barrierChannels,
    "channelId",
    "strategicTerrain.barrierChannels",
    (barrier) => barrier.channelId,
    errors
  );
  const nodeIds = collectM2StrategicTerrainStableIds(
    terrain.strategicNodes,
    "nodeId",
    "strategicTerrain.strategicNodes",
    (node) => node.nodeId,
    errors
  );
  collectM2StrategicTerrainStableIds(
    terrain.routeCorridors,
    "corridorId",
    "strategicTerrain.routeCorridors",
    (corridor) => corridor.corridorId,
    errors
  );
  const footprintIds = collectM2StrategicTerrainStableIds(
    terrain.districtGovernanceFootprints,
    "footprintId",
    "strategicTerrain.districtGovernanceFootprints",
    (footprint) => footprint.footprintId,
    errors
  );
  validateM2StrategicTerrainHistoricity(terrain, errors);
  validateM2StrategicTerrainReferences(
    source,
    terrain,
    patchIds,
    barrierIds,
    nodeIds,
    footprintIds,
    errors
  );
  validateM2StrategicTerrainPlacement(terrain, patchIds, errors);
  validateM2StrategicTerrainBarrierCrossings(terrain, errors);
  validateM2StrategicTerrainConnectivity(terrain, errors);
}

function validateM2StrategicTerrainCounts(
  terrain: M2StrategicTerrainSourceV0,
  errors: ContentCompileError[]
): void {
  validateStrategicTerrainCount(
    terrain.terrainPatches.length,
    "strategicTerrain.terrainPatches",
    12,
    24,
    errors
  );
  validateStrategicTerrainCount(
    terrain.barrierChannels.length,
    "strategicTerrain.barrierChannels",
    6,
    14,
    errors
  );
  validateStrategicTerrainCount(
    terrain.strategicNodes.length,
    "strategicTerrain.strategicNodes",
    18,
    30,
    errors
  );
  validateStrategicTerrainCount(
    terrain.routeCorridors.length,
    "strategicTerrain.routeCorridors",
    25,
    45,
    errors
  );
  validateStrategicTerrainCount(
    terrain.districtGovernanceFootprints.length,
    "strategicTerrain.districtGovernanceFootprints",
    12,
    18,
    errors
  );
}

function validateStrategicTerrainCount(
  count: number,
  path: string,
  minimum: number,
  maximum: number,
  errors: ContentCompileError[]
): void {
  if (count < minimum || count > maximum) {
    errors.push({
      code: "invalid-count",
      path,
      message: `${path} must contain ${minimum}-${maximum} entries, received ${count}.`
    });
  }
}

function validateM2StrategicTerrainHistoricity(
  terrain: M2StrategicTerrainSourceV0,
  errors: ContentCompileError[]
): void {
  terrain.terrainPatches.forEach((patch, index) =>
    validateCompositeStrategicTerrainLabel(
      patch.historicity,
      `strategicTerrain.terrainPatches[${index}].historicity`,
      errors
    )
  );
  terrain.barrierChannels.forEach((channel, index) =>
    validateCompositeStrategicTerrainLabel(
      channel.historicity,
      `strategicTerrain.barrierChannels[${index}].historicity`,
      errors
    )
  );
}

function validateCompositeStrategicTerrainLabel(
  historicity: RuntimeM2TerrainPatchV0["historicity"],
  path: string,
  errors: ContentCompileError[]
): void {
  if (historicity === "HISTORICAL" || historicity === "INFERRED") {
    errors.push({
      code: "historical-overclaim",
      path,
      message:
        "M7 strategic terrain fixture may not use HISTORICAL or INFERRED labels before historical_researcher review."
    });
  }
}

function validateM2StrategicTerrainReferences(
  source: M2WorldFixtureSourceV0,
  terrain: M2StrategicTerrainSourceV0,
  patchIds: ReadonlySet<string>,
  barrierIds: ReadonlySet<string>,
  nodeIds: ReadonlySet<string>,
  footprintIds: ReadonlySet<string>,
  errors: ContentCompileError[]
): void {
  const districtIds = new Set(source.districts.map((district) => district.sourceId));
  terrain.strategicNodes.forEach((node, index) => {
    if (!districtIds.has(node.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `strategicTerrain.strategicNodes[${index}].districtId`,
        message: `Strategic node ${node.nodeId} references missing district ${node.districtId}.`
      });
    }
    validateStrategicTerrainReferenceArray(
      node.terrainPatchIds,
      patchIds,
      `strategicTerrain.strategicNodes[${index}].terrainPatchIds`,
      "terrain patch",
      errors
    );
    validateStrategicTerrainReferenceArray(
      node.barrierChannelIds,
      barrierIds,
      `strategicTerrain.strategicNodes[${index}].barrierChannelIds`,
      "barrier channel",
      errors
    );
    validateStrategicTerrainReferenceArray(
      node.governanceFootprintIds,
      footprintIds,
      `strategicTerrain.strategicNodes[${index}].governanceFootprintIds`,
      "governance footprint",
      errors
    );
  });

  terrain.routeCorridors.forEach((corridor, index) => {
    if (!nodeIds.has(corridor.fromNodeId)) {
      errors.push({
        code: "bad-reference",
        path: `strategicTerrain.routeCorridors[${index}].fromNodeId`,
        message: `Route corridor ${corridor.corridorId} references missing fromNodeId ${corridor.fromNodeId}.`
      });
    }
    if (!nodeIds.has(corridor.toNodeId)) {
      errors.push({
        code: "bad-reference",
        path: `strategicTerrain.routeCorridors[${index}].toNodeId`,
        message: `Route corridor ${corridor.corridorId} references missing toNodeId ${corridor.toNodeId}.`
      });
    }
    if (corridor.terrainPatchIds.length === 0) {
      errors.push({
        code: "invalid-route",
        path: `strategicTerrain.routeCorridors[${index}].terrainPatchIds`,
        message:
          "Route corridors must use terrain patch authority, not governance overlay reachability."
      });
    }
    validateStrategicTerrainReferenceArray(
      corridor.terrainPatchIds,
      patchIds,
      `strategicTerrain.routeCorridors[${index}].terrainPatchIds`,
      "terrain patch",
      errors
    );
    validateStrategicTerrainReferenceArray(
      corridor.barrierChannelIds,
      barrierIds,
      `strategicTerrain.routeCorridors[${index}].barrierChannelIds`,
      "barrier channel",
      errors
    );
    validateStrategicTerrainReferenceArray(
      corridor.governanceFootprintIds,
      footprintIds,
      `strategicTerrain.routeCorridors[${index}].governanceFootprintIds`,
      "governance footprint",
      errors
    );
    if (
      corridor.seasonality.map((season) => season.month).join(",") !== "1,2,3,4,5,6,7,8,9,10,11,12"
    ) {
      errors.push({
        code: "invalid-route",
        path: `strategicTerrain.routeCorridors[${index}].seasonality`,
        message: `Route corridor ${corridor.corridorId} seasonality must be ordered from month 1 through 12.`
      });
    }
    if (
      !hasTagPrefix(corridor.explanationTags, "cost.") ||
      !hasTagPrefix(corridor.explanationTags, "dependency.") ||
      !hasTagPrefix(corridor.explanationTags, "counter.")
    ) {
      errors.push({
        code: "missing-label",
        path: `strategicTerrain.routeCorridors[${index}].explanationTags`,
        message: `Route corridor ${corridor.corridorId} must state local cost, dependency, and counter tags.`
      });
    }
  });

  terrain.districtGovernanceFootprints.forEach((footprint, index) => {
    if (!districtIds.has(footprint.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `strategicTerrain.districtGovernanceFootprints[${index}].districtId`,
        message: `Governance footprint ${footprint.footprintId} references missing district ${footprint.districtId}.`
      });
    }
  });
}

function validateM2StrategicTerrainPlacement(
  terrain: M2StrategicTerrainSourceV0,
  patchIds: ReadonlySet<string>,
  errors: ContentCompileError[]
): void {
  const patchById = new Map(terrain.terrainPatches.map((patch) => [patch.patchId, patch]));
  terrain.strategicNodes.forEach((node, index) => {
    const hasPlacementPatch = node.terrainPatchIds.some((patchId) => {
      if (!patchIds.has(patchId)) {
        return false;
      }
      const patch = patchById.get(patchId);
      return patch !== undefined && isPointInOrOnPolygon(node.anchor, patch.polygon);
    });
    if (!hasPlacementPatch) {
      errors.push({
        code: "invalid-geometry",
        path: `strategicTerrain.strategicNodes[${index}].anchor`,
        message: `Strategic node ${node.nodeId} anchor must be inside at least one referenced terrain patch.`
      });
    }
  });
}

function validateM2StrategicTerrainBarrierCrossings(
  terrain: M2StrategicTerrainSourceV0,
  errors: ContentCompileError[]
): void {
  const nodeById = new Map(terrain.strategicNodes.map((node) => [node.nodeId, node]));
  const barrierById = new Map(
    terrain.barrierChannels.map((barrier) => [barrier.channelId, barrier])
  );
  terrain.routeCorridors.forEach((corridor, corridorIndex) => {
    corridor.barrierChannelIds.forEach((barrierId, barrierIndex) => {
      const barrier = barrierById.get(barrierId);
      if (barrier?.traversalRule !== "blocks-without-explicit-corridor") {
        return;
      }
      const from = nodeById.get(corridor.fromNodeId);
      const to = nodeById.get(corridor.toNodeId);
      const hasExplicitCrossing =
        isBarrierCrossingNode(from, barrier.channelId) ||
        isBarrierCrossingNode(to, barrier.channelId);
      if (!hasExplicitCrossing) {
        errors.push({
          code: "invalid-route",
          path: `strategicTerrain.routeCorridors[${corridorIndex}].barrierChannelIds[${barrierIndex}]`,
          message: `Route corridor ${corridor.corridorId} crosses blocking barrier ${barrier.channelId} without an explicit pass, crossing, or port endpoint for that barrier.`
        });
      }
    });
  });
}

function validateM2StrategicTerrainConnectivity(
  terrain: M2StrategicTerrainSourceV0,
  errors: ContentCompileError[]
): void {
  const adjacency = new Map<string, Set<string>>();
  for (const node of terrain.strategicNodes) {
    if (node.knownState !== "unknown") {
      adjacency.set(node.nodeId, new Set<string>());
    }
  }
  for (const corridor of terrain.routeCorridors) {
    if (corridor.availability.kind !== "open") {
      continue;
    }
    const from = adjacency.get(corridor.fromNodeId);
    const to = adjacency.get(corridor.toNodeId);
    if (from !== undefined && to !== undefined) {
      from.add(corridor.toNodeId);
      to.add(corridor.fromNodeId);
    }
  }
  const start = sortText([...adjacency.keys()])[0];
  const visited = new Set<string>();
  const pending = start === undefined ? [] : [start];
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
  terrain.strategicNodes.forEach((node, index) => {
    if (node.knownState === "unknown") {
      return;
    }
    if (!visited.has(node.nodeId)) {
      errors.push({
        code: "isolated-node",
        path: `strategicTerrain.strategicNodes[${index}].nodeId`,
        message: `Strategic node ${node.nodeId} is disconnected without unknown-state isolation.`
      });
    }
  });
}

function collectM2StrategicTerrainStableIds<TEntry>(
  entries: readonly TEntry[],
  key: string,
  path: string,
  getId: (entry: TEntry) => string,
  errors: ContentCompileError[]
): ReadonlySet<string> {
  const ids = new Set<string>();
  let previousId = "";
  entries.forEach((entry, index) => {
    const value = getId(entry);
    validateM2StrategicTerrainStableId(value, `${path}[${index}].${key}`, errors);
    if (ids.has(value)) {
      errors.push({
        code: "duplicate-id",
        path: `${path}[${index}].${key}`,
        message: `Duplicate strategic terrain id ${value}.`
      });
    }
    if (index > 0 && compareText(value, previousId) <= 0) {
      errors.push({
        code: "unstable-order",
        path: `${path}[${index}].${key}`,
        message: `${path} must be sorted by ${key} for deterministic content order.`
      });
    }
    ids.add(value);
    previousId = value;
  });
  return ids;
}

function validateM2StrategicTerrainStableId(
  value: string,
  path: string,
  errors: ContentCompileError[]
): void {
  if (!/^[A-Za-z][A-Za-z0-9._:-]{0,95}$/u.test(value)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: `${path} must be a stable strategic terrain id.`
    });
    return;
  }
  if (/^(?:\d+|row[-.:]?\d+|col[-.:]?\d+|hex[-.:]?\d+|cell[-.:]?\d+)$/iu.test(value)) {
    errors.push({
      code: "lattice-adjacency",
      path,
      message: `${path} must not be a hidden grid, lattice, hex, or sequential id.`
    });
  }
}

function validateStrategicTerrainReferenceArray(
  values: readonly string[],
  allowedIds: ReadonlySet<string>,
  path: string,
  label: string,
  errors: ContentCompileError[]
): void {
  values.forEach((value, index) => {
    validateM2StrategicTerrainStableId(value, `${path}[${index}]`, errors);
    if (!allowedIds.has(value)) {
      errors.push({
        code: "bad-reference",
        path: `${path}[${index}]`,
        message: `Missing strategic terrain ${label} ${value}.`
      });
    }
  });
}

function isBarrierCrossingNode(
  node: M2StrategicNodeSourceV0 | undefined,
  barrierId: string
): boolean {
  return (
    node !== undefined &&
    (node.nodeKind === "pass" || node.nodeKind === "crossing" || node.nodeKind === "port") &&
    node.barrierChannelIds.includes(barrierId)
  );
}

function hasTagPrefix(values: readonly string[], prefix: string): boolean {
  return values.some((value) => value.startsWith(prefix));
}

function parseStrategicRecordArray<TValue>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ContentCompileError[],
  parseEntry: (
    input: Record<string, unknown>,
    path: string,
    errors: ContentCompileError[]
  ) => TValue
): readonly TValue[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return [];
  }
  const parsed: TValue[] = [];
  value.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!isRecord(entry)) {
      errors.push({
        code: "invalid-schema",
        path: entryPath,
        message: `${entryPath} must be an object.`
      });
      return;
    }
    parsed.push(parseEntry(entry, entryPath, errors));
  });
  return parsed;
}

function parseStrategicPointArray(
  input: unknown,
  path: string,
  errors: ContentCompileError[]
): readonly RuntimeM2StrategicTerrainPointV0[] {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return [];
  }
  return input.map((entry, index) => parseStrategicPoint(entry, `${path}[${index}]`, errors));
}

function parseStrategicPoint(
  input: unknown,
  path: string,
  errors: ContentCompileError[]
): RuntimeM2StrategicTerrainPointV0 {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an object.` });
    return { x: 0, y: 0 };
  }
  return {
    x: readStrategicIntegerInRange(input, "x", `${path}.x`, -1000000, 1000000, errors),
    y: readStrategicIntegerInRange(input, "y", `${path}.y`, -1000000, 1000000, errors)
  };
}

function parseStrategicStringArray(
  input: unknown,
  path: string,
  errors: ContentCompileError[]
): readonly string[] {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return [];
  }
  const values: string[] = [];
  input.forEach((entry, index) => {
    if (typeof entry !== "string" || entry.length === 0) {
      errors.push({
        code: "invalid-schema",
        path: `${path}[${index}]`,
        message: `${path}[${index}] must be a non-empty string.`
      });
      return;
    }
    values.push(entry);
  });
  return values;
}

function parseStrategicStringUnionArray<TValue extends string>(
  input: unknown,
  path: string,
  allowedValues: readonly TValue[],
  errors: ContentCompileError[]
): readonly TValue[] {
  if (!Array.isArray(input)) {
    errors.push({ code: "invalid-schema", path, message: `${path} must be an array.` });
    return [];
  }
  const values: TValue[] = [];
  input.forEach((entry, index) => {
    if (typeof entry !== "string" || !allowedValues.includes(entry as TValue)) {
      errors.push({
        code: "invalid-schema",
        path: `${path}[${index}]`,
        message: `${path}[${index}] must be one of ${allowedValues.join(", ")}.`
      });
      return;
    }
    values.push(entry as TValue);
  });
  return values;
}

function readStrategicString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ContentCompileError[]
): string {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a non-empty string.`
  });
  return "";
}

function readStrategicStringUnion<TValue extends string>(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly TValue[],
  errors: ContentCompileError[]
): TValue {
  const value = record[key];
  if (typeof value === "string" && allowedValues.includes(value as TValue)) {
    return value as TValue;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be one of ${allowedValues.join(", ")}.`
  });
  return firstAllowedStrategicValue(allowedValues, path);
}

function readStrategicPositiveInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ContentCompileError[]
): number {
  return readStrategicIntegerInRange(record, key, path, 1, Number.MAX_SAFE_INTEGER, errors);
}

function readStrategicIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: ContentCompileError[]
): number {
  const value = record[key];
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  ) {
    return value;
  }
  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a safe integer from ${minimum} to ${maximum}.`
  });
  return minimum;
}

function firstAllowedStrategicValue<TValue extends string>(
  allowedValues: readonly TValue[],
  path: string
): TValue {
  const first = allowedValues[0];
  if (first === undefined) {
    throw new Error(`Compiler invariant failed: ${path} has no allowed values.`);
  }
  return first;
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

function hasSelfIntersection(polygon: readonly M2WorldMapPointSourceV0[]): boolean {
  for (let leftIndex = 0; leftIndex < polygon.length; leftIndex += 1) {
    const leftStart = polygon[leftIndex];
    const leftEnd = polygon[(leftIndex + 1) % polygon.length];
    if (leftStart === undefined || leftEnd === undefined) {
      throw new Error("Expected polygon point.");
    }
    for (let rightIndex = leftIndex + 1; rightIndex < polygon.length; rightIndex += 1) {
      if (Math.abs(leftIndex - rightIndex) <= 1) {
        continue;
      }
      if (leftIndex === 0 && rightIndex === polygon.length - 1) {
        continue;
      }
      const rightStart = polygon[rightIndex];
      const rightEnd = polygon[(rightIndex + 1) % polygon.length];
      if (rightStart === undefined || rightEnd === undefined) {
        throw new Error("Expected polygon point.");
      }
      if (segmentsIntersect(leftStart, leftEnd, rightStart, rightEnd)) {
        return true;
      }
    }
  }

  return false;
}

function polygonsOverlap(
  left: readonly M2WorldMapPointSourceV0[],
  right: readonly M2WorldMapPointSourceV0[]
): boolean {
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const leftStart = left[leftIndex];
    const leftEnd = left[(leftIndex + 1) % left.length];
    if (leftStart === undefined || leftEnd === undefined) {
      throw new Error("Expected polygon point.");
    }
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      const rightStart = right[rightIndex];
      const rightEnd = right[(rightIndex + 1) % right.length];
      if (rightStart === undefined || rightEnd === undefined) {
        throw new Error("Expected polygon point.");
      }
      if (segmentsIntersect(leftStart, leftEnd, rightStart, rightEnd)) {
        return true;
      }
    }
  }

  const leftPoint = left[0];
  const rightPoint = right[0];
  if (leftPoint === undefined || rightPoint === undefined) {
    return false;
  }

  return isPointInOrOnPolygon(leftPoint, right) || isPointInOrOnPolygon(rightPoint, left);
}

function segmentsIntersect(
  leftStart: M2WorldMapPointSourceV0,
  leftEnd: M2WorldMapPointSourceV0,
  rightStart: M2WorldMapPointSourceV0,
  rightEnd: M2WorldMapPointSourceV0
): boolean {
  const leftRightStart = orientation(leftStart, leftEnd, rightStart);
  const leftRightEnd = orientation(leftStart, leftEnd, rightEnd);
  const rightLeftStart = orientation(rightStart, rightEnd, leftStart);
  const rightLeftEnd = orientation(rightStart, rightEnd, leftEnd);

  if (leftRightStart === 0 && isPointOnSegment(rightStart, leftStart, leftEnd)) return true;
  if (leftRightEnd === 0 && isPointOnSegment(rightEnd, leftStart, leftEnd)) return true;
  if (rightLeftStart === 0 && isPointOnSegment(leftStart, rightStart, rightEnd)) return true;
  if (rightLeftEnd === 0 && isPointOnSegment(leftEnd, rightStart, rightEnd)) return true;

  return (
    ((leftRightStart < 0 && leftRightEnd > 0) || (leftRightStart > 0 && leftRightEnd < 0)) &&
    ((rightLeftStart < 0 && rightLeftEnd > 0) || (rightLeftStart > 0 && rightLeftEnd < 0))
  );
}

function orientation(
  start: M2WorldMapPointSourceV0,
  end: M2WorldMapPointSourceV0,
  point: M2WorldMapPointSourceV0
): number {
  return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x);
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

function buildRuntimeM2WorldPack(
  source: M2WorldFixtureSourceV0,
  strategicTerrainSource: M2StrategicTerrainSourceV0 | undefined
): RuntimeM2WorldContentPackV0 {
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
  const routeIdBySourceId = new Map(
    routeAssignments.map((assignment) => [assignment.route.sourceId, assignment.runtimeId])
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

  const topology = buildRuntimeM2Topology({
    source,
    districtIdBySourceId,
    settlementIdBySourceId,
    routeIdBySourceId
  });
  const strategicTerrainWithoutManifestHash =
    strategicTerrainSource === undefined
      ? undefined
      : buildRuntimeM2StrategicTerrain(
          strategicTerrainSource,
          districtIdBySourceId,
          parseContentManifestHash("00000000")
        );

  const manifestHash = hashM2Manifest(
    source.fixtureId,
    districts,
    settlements,
    regionalSeasonalCurves,
    routes,
    mapGeometries,
    topology,
    strategicTerrainWithoutManifestHash
  );
  const strategicTerrain =
    strategicTerrainSource === undefined
      ? undefined
      : buildRuntimeM2StrategicTerrain(
          strategicTerrainSource,
          districtIdBySourceId,
          parseContentManifestHash(manifestHash)
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
    mapGeometries,
    topology,
    ...(strategicTerrain === undefined ? {} : { strategicTerrain })
  };
}

function buildRuntimeM2StrategicTerrain(
  source: M2StrategicTerrainSourceV0,
  districtIdBySourceId: ReadonlyMap<string, number>,
  contentManifestHash: RuntimeM2StrategicTerrainV0["contentManifestHash"]
): RuntimeM2StrategicTerrainV0 {
  return {
    schemaVersion: 1,
    hashAlgorithm: "fnv1a32-canonical-strategic-terrain-v1",
    contentManifestHash,
    authority: source.authority,
    governanceFootprintRole: source.governanceFootprintRole,
    authorityProhibitions: [...source.authorityProhibitions],
    terrainPatches: source.terrainPatches.map((patch) => ({
      ...patch,
      polygon: patch.polygon.map((point) => ({ ...point })),
      explanationTags: [...patch.explanationTags]
    })),
    barrierChannels: source.barrierChannels.map((channel) => ({
      ...channel,
      points: channel.points.map((point) => ({ ...point })),
      explanationTags: [...channel.explanationTags]
    })),
    strategicNodes: source.strategicNodes.map((node) => {
      const districtId = districtIdBySourceId.get(node.districtId);
      if (districtId === undefined) {
        throw new Error(`Compiler invariant failed for strategic node ${node.nodeId}.`);
      }
      return {
        ...node,
        districtId: parseContentDistrictId(districtId),
        anchor: { ...node.anchor },
        terrainPatchIds: [...node.terrainPatchIds],
        barrierChannelIds: [...node.barrierChannelIds],
        governanceFootprintIds: [...node.governanceFootprintIds],
        explanationTags: [...node.explanationTags]
      };
    }),
    routeCorridors: source.routeCorridors.map((corridor) => ({
      ...corridor,
      terrainPatchIds: [...corridor.terrainPatchIds],
      barrierChannelIds: [...corridor.barrierChannelIds],
      governanceFootprintIds: [...corridor.governanceFootprintIds],
      seasonality: corridor.seasonality.map((season) => ({
        ...season,
        reasonCodes: [...season.reasonCodes]
      })),
      availability: { ...corridor.availability },
      polyline: corridor.polyline.map((point) => ({ ...point })),
      explanationTags: [...corridor.explanationTags]
    })),
    districtGovernanceFootprints: source.districtGovernanceFootprints.map((footprint) => {
      const districtId = districtIdBySourceId.get(footprint.districtId);
      if (districtId === undefined) {
        throw new Error(
          `Compiler invariant failed for governance footprint ${footprint.footprintId}.`
        );
      }
      return {
        ...footprint,
        districtId: parseContentDistrictId(districtId),
        polygon: footprint.polygon.map((point) => ({ ...point })),
        governanceTags: [...footprint.governanceTags],
        consequenceTags: [...footprint.consequenceTags]
      };
    })
  };
}

function buildRuntimeM2Topology(input: {
  readonly source: M2WorldFixtureSourceV0;
  readonly districtIdBySourceId: ReadonlyMap<string, number>;
  readonly settlementIdBySourceId: ReadonlyMap<string, number>;
  readonly routeIdBySourceId: ReadonlyMap<string, number>;
}): RuntimeM2TopologyV0 {
  const districtGeometryByOwnerId = new Map(
    input.source.mapGeometries
      .filter((geometry) => geometry.ownerKind === "district")
      .map((geometry) => [geometry.ownerId, geometry])
  );

  return {
    adjacencyDerivation: "explicit-route-graph-v1",
    explicitIsolations: input.source.topology.explicitIsolations.map((entry) => {
      const districtId = input.districtIdBySourceId.get(entry.districtId);
      if (districtId === undefined) {
        throw new Error(`Compiler invariant failed for topology isolation ${entry.districtId}.`);
      }
      return {
        districtId: parseContentDistrictId(districtId),
        reasonCode: entry.reasonCode
      };
    }),
    districts: input.source.districts.map((district) => {
      const districtId = input.districtIdBySourceId.get(district.sourceId);
      const geometry = districtGeometryByOwnerId.get(district.sourceId);
      if (districtId === undefined || geometry === undefined) {
        throw new Error(`Compiler invariant failed for topology district ${district.sourceId}.`);
      }
      return {
        districtId: parseContentDistrictId(districtId),
        sourceId: district.sourceId,
        displayNameKey: district.displayNameKey,
        anchor: { ...geometry.anchor },
        polygon: geometry.points.map((point) => ({ ...point })),
        metadata: { ...district.topologyMetadata }
      };
    }),
    routeNodes: input.source.topology.routeNodes.map((node) => {
      const districtId = input.districtIdBySourceId.get(node.districtId);
      if (districtId === undefined) {
        throw new Error(`Compiler invariant failed for topology route node ${node.nodeId}.`);
      }
      return {
        nodeId: node.nodeId,
        nodeKind: node.nodeKind,
        districtId: parseContentDistrictId(districtId),
        displayNameKey: node.displayNameKey,
        anchor: { ...node.anchor }
      };
    }),
    routeEdges: input.source.topology.routeEdges.map((edge) => {
      const routeId = input.routeIdBySourceId.get(edge.routeId);
      const route = input.source.routes.find((candidate) => candidate.sourceId === edge.routeId);
      if (routeId === undefined || route === undefined) {
        throw new Error(`Compiler invariant failed for topology route edge ${edge.sourceId}.`);
      }
      return {
        routeId: parseContentRouteId(routeId),
        sourceId: edge.sourceId,
        from: compileM2TopologyEndpoint(
          edge.from,
          input.districtIdBySourceId,
          input.settlementIdBySourceId
        ),
        to: compileM2TopologyEndpoint(
          edge.to,
          input.districtIdBySourceId,
          input.settlementIdBySourceId
        ),
        mode: edge.mode,
        baseTravelCost: route.baseTravelCost,
        baseCapacity: edge.baseCapacity,
        seasonality: edge.seasonality.map((value) => ({
          month: value.month,
          costMultiplierBps: value.costMultiplierBps,
          capacityMultiplierBps: value.capacityMultiplierBps,
          reasonCodes: [...value.reasonCodes]
        })),
        availability: { ...edge.availability },
        metadata: { ...edge.metadata }
      };
    })
  };
}

function compileM2TopologyEndpoint(
  endpoint: M2TopologyRouteEndpointSourceV0,
  districtIdBySourceId: ReadonlyMap<string, number>,
  settlementIdBySourceId: ReadonlyMap<string, number>
): RuntimeM2TopologyRouteEndpointV0 {
  if (endpoint.kind === "district") {
    const districtId = districtIdBySourceId.get(endpoint.districtId);
    if (districtId === undefined) {
      throw new Error(`Compiler invariant failed for topology endpoint ${endpoint.districtId}.`);
    }
    return { kind: "district", districtId: parseContentDistrictId(districtId) };
  }
  if (endpoint.kind === "settlement") {
    const settlementId = settlementIdBySourceId.get(endpoint.settlementId);
    if (settlementId === undefined) {
      throw new Error(`Compiler invariant failed for topology endpoint ${endpoint.settlementId}.`);
    }
    return { kind: "settlement", settlementId: parseContentSettlementId(settlementId) };
  }
  return { kind: "route-node", nodeId: endpoint.nodeId };
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
  mapGeometries: readonly RuntimeM2MapGeometryV0[],
  topology: RuntimeM2TopologyV0,
  strategicTerrain: RuntimeM2StrategicTerrainV0 | undefined
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
          .join(",")}`,
        `topology=${formatRuntimeM2TopologyForHash(topology)}`,
        `strategicTerrain=${formatRuntimeM2StrategicTerrainForHash(strategicTerrain)}`
      ].join("\n")
    )
  );
}

function formatRuntimeM2StrategicTerrainForHash(
  strategicTerrain: RuntimeM2StrategicTerrainV0 | undefined
): string {
  if (strategicTerrain === undefined) {
    return "none";
  }

  return [
    strategicTerrain.authority,
    strategicTerrain.governanceFootprintRole,
    strategicTerrain.authorityProhibitions.join(","),
    strategicTerrain.terrainPatches
      .map(
        (patch) =>
          `${patch.patchId}:${patch.sourceId}:${patch.displayNameKey}:${patch.terrainClass}:${patch.seasonSensitivity}:${patch.historicity}:${formatRuntimeM2StrategicTerrainPointsForHash(patch.polygon)}:${patch.explanationTags.join("+")}`
      )
      .join(","),
    strategicTerrain.barrierChannels
      .map(
        (channel) =>
          `${channel.channelId}:${channel.sourceId}:${channel.displayNameKey}:${channel.channelKind}:${channel.traversalRule}:${channel.historicity}:${formatRuntimeM2StrategicTerrainPointsForHash(channel.points)}:${channel.explanationTags.join("+")}`
      )
      .join(","),
    strategicTerrain.strategicNodes
      .map(
        (node) =>
          `${node.nodeId}:${node.sourceId}:${node.displayNameKey}:${node.nodeKind}:${node.districtId}:${node.anchor.x}:${node.anchor.y}:${node.localCapacity}:${node.knownState}:${node.terrainPatchIds.join("+")}:${node.barrierChannelIds.join("+")}:${node.governanceFootprintIds.join("+")}:${node.explanationTags.join("+")}`
      )
      .join(","),
    strategicTerrain.routeCorridors
      .map(
        (corridor) =>
          `${corridor.corridorId}:${corridor.sourceId}:${corridor.displayNameKey}:${corridor.fromNodeId}:${corridor.toNodeId}:${corridor.mode}:${corridor.widthClass}:${corridor.baseTravelCost}:${corridor.baseCapacity}:${corridor.riskClass}:${corridor.terrainPatchIds.join("+")}:${corridor.barrierChannelIds.join("+")}:${corridor.governanceFootprintIds.join("+")}:${corridor.seasonality
            .map(
              (season) =>
                `${season.month}:${season.seasonState}:${season.travelCostMultiplierBps}:${season.capacityMultiplierBps}:${season.riskBps}:${season.reasonCodes.join("+")}`
            )
            .join(
              "|"
            )}:${formatRuntimeM2RouteCorridorAvailabilityForHash(corridor.availability)}:${formatRuntimeM2StrategicTerrainPointsForHash(corridor.polyline)}:${corridor.explanationTags.join("+")}`
      )
      .join(","),
    strategicTerrain.districtGovernanceFootprints
      .map(
        (footprint) =>
          `${footprint.footprintId}:${footprint.sourceId}:${footprint.displayNameKey}:${footprint.districtId}:${footprint.overlayOnly}:${formatRuntimeM2StrategicTerrainPointsForHash(footprint.polygon)}:${footprint.governanceTags.join("+")}:${footprint.consequenceTags.join("+")}`
      )
      .join(",")
  ].join("\n");
}

function formatRuntimeM2StrategicTerrainPointsForHash(
  points: readonly RuntimeM2StrategicTerrainPointV0[]
): string {
  return points.map((point) => `${point.x}:${point.y}`).join("|");
}

function formatRuntimeM2RouteCorridorAvailabilityForHash(
  availability: RuntimeM2RouteCorridorV0["availability"]
): string {
  if (availability.kind === "open") {
    return "open";
  }
  return `${availability.kind}.${availability.reasonCode}`;
}

function formatRuntimeM2TopologyForHash(topology: RuntimeM2TopologyV0): string {
  return [
    topology.adjacencyDerivation,
    topology.explicitIsolations.map((entry) => `${entry.districtId}:${entry.reasonCode}`).join(","),
    topology.districts
      .map(
        (district) =>
          `${district.districtId}:${district.sourceId}:${district.displayNameKey}:${district.anchor.x}:${district.anchor.y}:${district.polygon
            .map((point) => `${point.x}:${point.y}`)
            .join(
              "|"
            )}:${district.metadata.historicity}:${district.metadata.terrainClass}:${district.metadata.riskClass}`
      )
      .join(","),
    topology.routeNodes
      .map(
        (node) =>
          `${node.nodeId}:${node.nodeKind}:${node.districtId}:${node.displayNameKey}:${node.anchor.x}:${node.anchor.y}`
      )
      .join(","),
    topology.routeEdges
      .map(
        (edge) =>
          `${edge.routeId}:${edge.sourceId}:${formatRuntimeM2TopologyEndpointForHash(edge.from)}:${formatRuntimeM2TopologyEndpointForHash(edge.to)}:${edge.mode}:${edge.baseTravelCost}:${edge.baseCapacity}:${edge.seasonality
            .map(
              (value) =>
                `${value.month}:${value.costMultiplierBps}:${value.capacityMultiplierBps}:${value.reasonCodes.join("+")}`
            )
            .join(
              "|"
            )}:${formatRuntimeM2TopologyAvailabilityForHash(edge.availability)}:${edge.metadata.historicity}:${edge.metadata.terrainClass}:${edge.metadata.riskClass}`
      )
      .join(",")
  ].join("\n");
}

function formatRuntimeM2TopologyEndpointForHash(
  endpoint: RuntimeM2TopologyRouteEndpointV0
): string {
  if (endpoint.kind === "district") {
    return `district.${endpoint.districtId}`;
  }
  if (endpoint.kind === "settlement") {
    return `settlement.${endpoint.settlementId}`;
  }
  return `route-node.${endpoint.nodeId}`;
}

function formatRuntimeM2TopologyAvailabilityForHash(
  availability: RuntimeM2TopologyV0["routeEdges"][number]["availability"]
): string {
  if (availability.kind === "open") {
    return "open";
  }
  return `${availability.kind}.${availability.reasonCode}`;
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

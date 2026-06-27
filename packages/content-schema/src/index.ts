export const M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;
export const M2_WORLD_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;
export const M3_POLITY_VASSALAGE_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;
export const M3_CHARACTER_OFFICE_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;

export * from "./m6-alpha-scenario.ts";

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
export type M3PolityVassalageFixtureSourceKind = "m3.polity-vassalage-fixture";
export type M3PolityVassalageFixtureKind = "polity-vassalage-fixture";
export type M3PolityVassalageSyntheticScope = "m3-validation-only";
export type M3PolityVassalageHistoricity = "FICTIONAL";
export type M3PolityVassalageSourceCategory = "validation-only-fixture";
export type M3PolityVassalageConfidence = "LOW";
export type M3ObligationKind = "tribute" | "troop";
export type M3ObligationResourceKind = "cash" | "grain" | "troops";
export type M3ObligationStatus = "active" | "disputed" | "breached";
export type M3CharacterOfficeFixtureSourceKind = "m3.character-office-fixture";
export type M3CharacterOfficeFixtureKind = "character-office-fixture";
export type M3CharacterOfficeSyntheticScope = "m3-validation-only";
export type M3CharacterOfficeHistoricity = "FICTIONAL";
export type M3ValidationClaimLabel = "FICTIONAL_VALIDATION";
export type M3CharacterArchetype =
  | "administrator"
  | "local-lord"
  | "commander"
  | "succession-competitor"
  | "courtier"
  | "broker";
export type M3RelationshipKind = "parent" | "patron" | "client" | "rival" | "supporter";
export type M3OfficeJurisdictionKind = "polity" | "district";
export type M3OfficeAppointmentMode = "appointed" | "hereditary" | "council-nominated";
export type M3EnfeoffmentTrigger =
  | "on-appointment"
  | "on-holder-change"
  | "on-vacancy"
  | "on-succession-contest";

export type ContentSchemaErrorCode = "invalid-schema";

const M3_CHARACTER_ARCHETYPES: readonly M3CharacterArchetype[] = [
  "administrator",
  "local-lord",
  "commander",
  "succession-competitor",
  "courtier",
  "broker"
];
const M3_RELATIONSHIP_KINDS: readonly M3RelationshipKind[] = [
  "parent",
  "patron",
  "client",
  "rival",
  "supporter"
];
const M3_OFFICE_APPOINTMENT_MODES: readonly M3OfficeAppointmentMode[] = [
  "appointed",
  "hereditary",
  "council-nominated"
];
const M3_ENFEOFFMENT_TRIGGERS: readonly M3EnfeoffmentTrigger[] = [
  "on-appointment",
  "on-holder-change",
  "on-vacancy",
  "on-succession-contest"
];

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

export interface M3PolityVassalageFixtureProvenanceV0 {
  readonly sourceCategory: M3PolityVassalageSourceCategory;
  readonly confidence: M3PolityVassalageConfidence;
  readonly policyId: "M3-HISTORICAL-CLAIM-PIPELINE-001";
}

export interface M3PolitySourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly directSuzerainPolityId: string | null;
}

export interface M3DistrictControllerSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly controllerPolityId: string | null;
}

export type M3ObligationRequirementSourceV0 =
  | {
      readonly kind: "amount";
      readonly resourceKind: M3ObligationResourceKind;
      readonly amount: number;
    }
  | {
      readonly kind: "condition";
      readonly conditionKey: string;
    };

export type M3ObligationDueSourceV0 =
  | {
      readonly kind: "cadence";
      readonly periodDays: number;
      readonly nextDueDay: number;
    }
  | {
      readonly kind: "trigger";
      readonly triggerKey: string;
    };

export interface M3ObligationSourceV0 {
  readonly sourceId: string;
  readonly debtorPolityId: string;
  readonly creditorPolityId: string;
  readonly obligationKind: M3ObligationKind;
  readonly requirement: M3ObligationRequirementSourceV0;
  readonly due: M3ObligationDueSourceV0;
  readonly status: M3ObligationStatus;
  readonly disputeReasonCode: string | null;
  readonly breachReasonCode: string | null;
}

export interface M3PolityVassalageFixtureSourceV0 {
  readonly schemaVersion: typeof M3_POLITY_VASSALAGE_FIXTURE_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M3PolityVassalageFixtureSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M3PolityVassalageFixtureKind;
  readonly syntheticScope: M3PolityVassalageSyntheticScope;
  readonly historicity: M3PolityVassalageHistoricity;
  readonly provenance: M3PolityVassalageFixtureProvenanceV0;
  readonly polities: readonly M3PolitySourceV0[];
  readonly districts: readonly M3DistrictControllerSourceV0[];
  readonly obligations: readonly M3ObligationSourceV0[];
}

export interface M3CharacterOfficeFixtureProvenanceV0 {
  readonly sourceCategory: M3PolityVassalageSourceCategory;
  readonly confidence: M3PolityVassalageConfidence;
  readonly policyId: "M3-HISTORICAL-CLAIM-PIPELINE-001";
}

export interface M3CharacterAptitudeSourceV0 {
  readonly administrationBps: number;
  readonly commandBps: number;
  readonly diplomacyBps: number;
  readonly ambitionBps: number;
  readonly legitimacyBps: number;
}

export interface M3CharacterSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly claimLabel: M3ValidationClaimLabel;
  readonly primaryPolityId: string;
  readonly archetype: M3CharacterArchetype;
  readonly aptitude: M3CharacterAptitudeSourceV0;
}

export interface M3RelationshipSourceV0 {
  readonly sourceId: string;
  readonly fromCharacterId: string;
  readonly toCharacterId: string;
  readonly relationshipKind: M3RelationshipKind;
  readonly intensityBps: number;
  readonly claimLabel: M3ValidationClaimLabel;
}

export interface M3AppointmentEligibilitySourceV0 {
  readonly minimumAdministrationBps: number;
  readonly minimumCommandBps: number;
  readonly minimumLegitimacyBps: number;
  readonly requiredArchetype: M3CharacterArchetype | null;
}

export interface M3OfficeSourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly jurisdictionKind: M3OfficeJurisdictionKind;
  readonly jurisdictionId: string;
  readonly currentHolderCharacterId: string;
  readonly policyId: string;
  readonly landedPowerId: string | null;
  readonly appointmentEligibility: M3AppointmentEligibilitySourceV0;
}

export interface M3LandedPowerSourceV0 {
  readonly sourceId: string;
  readonly districtId: string;
  readonly extractionRightsBps: number;
  readonly levyRightsBps: number;
  readonly successionWeightBps: number;
}

export interface M3OfficePolicySourceV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly appointmentMode: M3OfficeAppointmentMode;
  readonly taxAutonomyBps: number;
  readonly militaryAutonomyBps: number;
  readonly persistsAcrossHolderChange: true;
  readonly enfeoffmentHookIds: readonly string[];
}

export interface M3EnfeoffmentHookSourceV0 {
  readonly sourceId: string;
  readonly trigger: M3EnfeoffmentTrigger;
  readonly effectKey: string;
}

export interface M3CharacterOfficeFixtureSourceV0 {
  readonly schemaVersion: typeof M3_CHARACTER_OFFICE_FIXTURE_SOURCE_V0_SCHEMA_VERSION;
  readonly kind: M3CharacterOfficeFixtureSourceKind;
  readonly fixtureId: string;
  readonly fixtureKind: M3CharacterOfficeFixtureKind;
  readonly syntheticScope: M3CharacterOfficeSyntheticScope;
  readonly historicity: M3CharacterOfficeHistoricity;
  readonly provenance: M3CharacterOfficeFixtureProvenanceV0;
  readonly characters: readonly M3CharacterSourceV0[];
  readonly relationships: readonly M3RelationshipSourceV0[];
  readonly offices: readonly M3OfficeSourceV0[];
  readonly landedPowers: readonly M3LandedPowerSourceV0[];
  readonly officePolicies: readonly M3OfficePolicySourceV0[];
  readonly enfeoffmentHooks: readonly M3EnfeoffmentHookSourceV0[];
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

export function validateM3PolityVassalageFixtureSourceV0(
  input: unknown
): readonly ContentSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M3 polity vassalage fixture source must be an object."
      }
    ];
  }

  const errors: ContentSchemaError[] = [];
  validateM3Root(input, errors);
  const provenance = input["provenance"];
  if (isRecord(provenance)) {
    validateM3Provenance(provenance, errors);
  }

  const polities = input["polities"];
  if (Array.isArray(polities)) {
    polities.forEach((polity, index) => validateM3Polity(polity, `polities[${index}]`, errors));
  }

  const districts = input["districts"];
  if (Array.isArray(districts)) {
    districts.forEach((district, index) =>
      validateM3District(district, `districts[${index}]`, errors)
    );
  }

  const obligations = input["obligations"];
  if (Array.isArray(obligations)) {
    obligations.forEach((obligation, index) =>
      validateM3Obligation(obligation, `obligations[${index}]`, errors)
    );
  }

  return errors;
}

export function validateM3CharacterOfficeFixtureSourceV0(
  input: unknown
): readonly ContentSchemaError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "M3 character office fixture source must be an object."
      }
    ];
  }

  const errors: ContentSchemaError[] = [];
  validateM3CharacterOfficeRoot(input, errors);
  const provenance = input["provenance"];
  if (isRecord(provenance)) {
    validateM3Provenance(provenance, errors);
  }

  const characters = input["characters"];
  if (Array.isArray(characters)) {
    characters.forEach((character, index) =>
      validateM3Character(character, `characters[${index}]`, errors)
    );
  }

  const relationships = input["relationships"];
  if (Array.isArray(relationships)) {
    relationships.forEach((relationship, index) =>
      validateM3Relationship(relationship, `relationships[${index}]`, errors)
    );
  }

  const offices = input["offices"];
  if (Array.isArray(offices)) {
    offices.forEach((office, index) => validateM3Office(office, `offices[${index}]`, errors));
  }

  const landedPowers = input["landedPowers"];
  if (Array.isArray(landedPowers)) {
    landedPowers.forEach((landedPower, index) =>
      validateM3LandedPower(landedPower, `landedPowers[${index}]`, errors)
    );
  }

  const officePolicies = input["officePolicies"];
  if (Array.isArray(officePolicies)) {
    officePolicies.forEach((policy, index) =>
      validateM3OfficePolicy(policy, `officePolicies[${index}]`, errors)
    );
  }

  const hooks = input["enfeoffmentHooks"];
  if (Array.isArray(hooks)) {
    hooks.forEach((hook, index) =>
      validateM3EnfeoffmentHook(hook, `enfeoffmentHooks[${index}]`, errors)
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

export function parseM3PolityVassalageFixtureSourceV0(
  input: unknown
): M3PolityVassalageFixtureSourceV0 {
  const errors = validateM3PolityVassalageFixtureSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M3PolityVassalageFixtureSourceV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("M3PolityVassalageFixtureSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M3_POLITY_VASSALAGE_FIXTURE_SOURCE_V0_SCHEMA_VERSION,
    kind: "m3.polity-vassalage-fixture",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "polity-vassalage-fixture",
    syntheticScope: "m3-validation-only",
    historicity: "FICTIONAL",
    provenance: parseM3Provenance(readRecord(input, "provenance")),
    polities: readArray(input, "polities").map(parseM3Polity),
    districts: readArray(input, "districts").map(parseM3District),
    obligations: readArray(input, "obligations").map(parseM3Obligation)
  };
}

export function parseM3CharacterOfficeFixtureSourceV0(
  input: unknown
): M3CharacterOfficeFixtureSourceV0 {
  const errors = validateM3CharacterOfficeFixtureSourceV0(input);
  if (errors.length > 0) {
    throw new Error(`M3CharacterOfficeFixtureSourceV0 invalid: ${formatErrors(errors)}`);
  }

  if (!isRecord(input)) {
    throw new Error("M3CharacterOfficeFixtureSourceV0 invalid: root was not an object.");
  }

  return {
    schemaVersion: M3_CHARACTER_OFFICE_FIXTURE_SOURCE_V0_SCHEMA_VERSION,
    kind: "m3.character-office-fixture",
    fixtureId: readString(input, "fixtureId"),
    fixtureKind: "character-office-fixture",
    syntheticScope: "m3-validation-only",
    historicity: "FICTIONAL",
    provenance: parseM3Provenance(readRecord(input, "provenance")),
    characters: readArray(input, "characters").map(parseM3Character),
    relationships: readArray(input, "relationships").map(parseM3Relationship),
    offices: readArray(input, "offices").map(parseM3Office),
    landedPowers: readArray(input, "landedPowers").map(parseM3LandedPower),
    officePolicies: readArray(input, "officePolicies").map(parseM3OfficePolicy),
    enfeoffmentHooks: readArray(input, "enfeoffmentHooks").map(parseM3EnfeoffmentHook)
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

function validateM3Root(input: Record<string, unknown>, errors: ContentSchemaError[]): void {
  if (input["schemaVersion"] !== M3_POLITY_VASSALAGE_FIXTURE_SOURCE_V0_SCHEMA_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "schemaVersion",
      message: `schemaVersion must be ${M3_POLITY_VASSALAGE_FIXTURE_SOURCE_V0_SCHEMA_VERSION}.`
    });
  }

  validateExactString(input, "kind", "m3.polity-vassalage-fixture", errors);
  validateNonEmptyString(input, "fixtureId", errors);
  validateExactString(input, "fixtureKind", "polity-vassalage-fixture", errors);
  validateExactString(input, "syntheticScope", "m3-validation-only", errors);
  validateExactString(input, "historicity", "FICTIONAL", errors);
  if (!isRecord(input["provenance"])) {
    errors.push({
      code: "invalid-schema",
      path: "provenance",
      message: "provenance must be an object."
    });
  }
  validateArray(input, "polities", errors);
  validateArray(input, "districts", errors);
  validateArray(input, "obligations", errors);
}

function validateM3CharacterOfficeRoot(
  input: Record<string, unknown>,
  errors: ContentSchemaError[]
): void {
  if (input["schemaVersion"] !== M3_CHARACTER_OFFICE_FIXTURE_SOURCE_V0_SCHEMA_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "schemaVersion",
      message: `schemaVersion must be ${M3_CHARACTER_OFFICE_FIXTURE_SOURCE_V0_SCHEMA_VERSION}.`
    });
  }

  validateExactString(input, "kind", "m3.character-office-fixture", errors);
  validateNonEmptyString(input, "fixtureId", errors);
  validateExactString(input, "fixtureKind", "character-office-fixture", errors);
  validateExactString(input, "syntheticScope", "m3-validation-only", errors);
  validateExactString(input, "historicity", "FICTIONAL", errors);
  if (!isRecord(input["provenance"])) {
    errors.push({
      code: "invalid-schema",
      path: "provenance",
      message: "provenance must be an object."
    });
  }
  validateArray(input, "characters", errors);
  validateArray(input, "relationships", errors);
  validateArray(input, "offices", errors);
  validateArray(input, "landedPowers", errors);
  validateArray(input, "officePolicies", errors);
  validateArray(input, "enfeoffmentHooks", errors);
}

function validateM2Provenance(input: Record<string, unknown>, errors: ContentSchemaError[]): void {
  validateExactString(
    input,
    "sourceCategory",
    "validation-only-fixture",
    errors,
    "provenance.sourceCategory"
  );
  validateExactString(input, "confidence", "LOW", errors, "provenance.confidence");
  validateExactString(input, "policyId", "M2-MAP-SOURCE-POLICY-001", errors, "provenance.policyId");
}

function validateM3Provenance(input: Record<string, unknown>, errors: ContentSchemaError[]): void {
  validateExactString(
    input,
    "sourceCategory",
    "validation-only-fixture",
    errors,
    "provenance.sourceCategory"
  );
  validateExactString(input, "confidence", "LOW", errors, "provenance.confidence");
  validateExactString(
    input,
    "policyId",
    "M3-HISTORICAL-CLAIM-PIPELINE-001",
    errors,
    "provenance.policyId"
  );
}

function validateM3Polity(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 polity entry must be an object." });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^polity-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.polity_\d{3}$/u,
    errors
  );
  validateNullablePatternString(
    input,
    "directSuzerainPolityId",
    `${path}.directSuzerainPolityId`,
    /^polity-\d{3}$/u,
    errors
  );
}

function validateM3District(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 district entry must be an object." });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^district-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.district_\d{3}$/u,
    errors
  );
  validateNullablePatternString(
    input,
    "controllerPolityId",
    `${path}.controllerPolityId`,
    /^polity-\d{3}$/u,
    errors
  );
}

function validateM3Obligation(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 obligation entry must be an object."
    });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^obligation-\d{3}$/u, errors);
  validatePatternString(
    input,
    "debtorPolityId",
    `${path}.debtorPolityId`,
    /^polity-\d{3}$/u,
    errors
  );
  validatePatternString(
    input,
    "creditorPolityId",
    `${path}.creditorPolityId`,
    /^polity-\d{3}$/u,
    errors
  );
  validateStringUnion(
    input,
    "obligationKind",
    `${path}.obligationKind`,
    ["tribute", "troop"],
    errors
  );
  validateM3Requirement(input["requirement"], `${path}.requirement`, errors);
  validateM3Due(input["due"], `${path}.due`, errors);
  validateStringUnion(
    input,
    "status",
    `${path}.status`,
    ["active", "disputed", "breached"],
    errors
  );
  validateNullableString(input, "disputeReasonCode", `${path}.disputeReasonCode`, errors);
  validateNullableString(input, "breachReasonCode", `${path}.breachReasonCode`, errors);
}

function validateM3Character(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 character entry must be an object." });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^character-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.character_\d{3}$/u,
    errors
  );
  validateExactString(input, "claimLabel", "FICTIONAL_VALIDATION", errors, `${path}.claimLabel`);
  validatePatternString(
    input,
    "primaryPolityId",
    `${path}.primaryPolityId`,
    /^polity-\d{3}$/u,
    errors
  );
  validateStringUnion(input, "archetype", `${path}.archetype`, M3_CHARACTER_ARCHETYPES, errors);
  validateM3Aptitude(input["aptitude"], `${path}.aptitude`, errors);
}

function validateM3Aptitude(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 aptitude must be an object." });
    return;
  }
  validateIntegerInRange(input, "administrationBps", `${path}.administrationBps`, 0, 10000, errors);
  validateIntegerInRange(input, "commandBps", `${path}.commandBps`, 0, 10000, errors);
  validateIntegerInRange(input, "diplomacyBps", `${path}.diplomacyBps`, 0, 10000, errors);
  validateIntegerInRange(input, "ambitionBps", `${path}.ambitionBps`, 0, 10000, errors);
  validateIntegerInRange(input, "legitimacyBps", `${path}.legitimacyBps`, 0, 10000, errors);
}

function validateM3Relationship(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 relationship entry must be an object."
    });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^relationship-\d{3}$/u, errors);
  validatePatternString(
    input,
    "fromCharacterId",
    `${path}.fromCharacterId`,
    /^character-\d{3}$/u,
    errors
  );
  validatePatternString(
    input,
    "toCharacterId",
    `${path}.toCharacterId`,
    /^character-\d{3}$/u,
    errors
  );
  validateStringUnion(
    input,
    "relationshipKind",
    `${path}.relationshipKind`,
    M3_RELATIONSHIP_KINDS,
    errors
  );
  validateIntegerInRange(input, "intensityBps", `${path}.intensityBps`, 0, 10000, errors);
  validateExactString(input, "claimLabel", "FICTIONAL_VALIDATION", errors, `${path}.claimLabel`);
}

function validateM3Office(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 office entry must be an object." });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^office-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.office_\d{3}$/u,
    errors
  );
  validateStringUnion(
    input,
    "jurisdictionKind",
    `${path}.jurisdictionKind`,
    ["polity", "district"],
    errors
  );
  validatePatternString(
    input,
    "jurisdictionId",
    `${path}.jurisdictionId`,
    /^(polity|district)-\d{3}$/u,
    errors
  );
  validatePatternString(
    input,
    "currentHolderCharacterId",
    `${path}.currentHolderCharacterId`,
    /^character-\d{3}$/u,
    errors
  );
  validatePatternString(input, "policyId", `${path}.policyId`, /^office-policy-\d{3}$/u, errors);
  validateNullablePatternString(
    input,
    "landedPowerId",
    `${path}.landedPowerId`,
    /^landed-power-\d{3}$/u,
    errors
  );
  validateM3AppointmentEligibility(
    input["appointmentEligibility"],
    `${path}.appointmentEligibility`,
    errors
  );
}

function validateM3AppointmentEligibility(
  input: unknown,
  path: string,
  errors: ContentSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 appointment eligibility must be an object."
    });
    return;
  }
  validateIntegerInRange(
    input,
    "minimumAdministrationBps",
    `${path}.minimumAdministrationBps`,
    0,
    10000,
    errors
  );
  validateIntegerInRange(input, "minimumCommandBps", `${path}.minimumCommandBps`, 0, 10000, errors);
  validateIntegerInRange(
    input,
    "minimumLegitimacyBps",
    `${path}.minimumLegitimacyBps`,
    0,
    10000,
    errors
  );
  validateNullableStringUnion(
    input,
    "requiredArchetype",
    `${path}.requiredArchetype`,
    M3_CHARACTER_ARCHETYPES,
    errors
  );
}

function validateM3LandedPower(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 landed power entry must be an object."
    });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^landed-power-\d{3}$/u, errors);
  validatePatternString(input, "districtId", `${path}.districtId`, /^district-\d{3}$/u, errors);
  validateIntegerInRange(
    input,
    "extractionRightsBps",
    `${path}.extractionRightsBps`,
    0,
    10000,
    errors
  );
  validateIntegerInRange(input, "levyRightsBps", `${path}.levyRightsBps`, 0, 10000, errors);
  validateIntegerInRange(
    input,
    "successionWeightBps",
    `${path}.successionWeightBps`,
    0,
    10000,
    errors
  );
}

function validateM3OfficePolicy(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 office policy entry must be an object."
    });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^office-policy-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.office_policy_\d{3}$/u,
    errors
  );
  validateStringUnion(
    input,
    "appointmentMode",
    `${path}.appointmentMode`,
    M3_OFFICE_APPOINTMENT_MODES,
    errors
  );
  validateIntegerInRange(input, "taxAutonomyBps", `${path}.taxAutonomyBps`, 0, 10000, errors);
  validateIntegerInRange(
    input,
    "militaryAutonomyBps",
    `${path}.militaryAutonomyBps`,
    0,
    10000,
    errors
  );
  if (input["persistsAcrossHolderChange"] !== true) {
    errors.push({
      code: "invalid-schema",
      path: `${path}.persistsAcrossHolderChange`,
      message: `${path}.persistsAcrossHolderChange must be true.`
    });
  }
  validateArray(input, "enfeoffmentHookIds", errors, `${path}.enfeoffmentHookIds`);
  const hookIds = input["enfeoffmentHookIds"];
  if (Array.isArray(hookIds)) {
    hookIds.forEach((hookId, index) =>
      validatePatternString(
        { hookId },
        "hookId",
        `${path}.enfeoffmentHookIds[${index}]`,
        /^enfeoffment-hook-\d{3}$/u,
        errors
      )
    );
  }
}

function validateM3EnfeoffmentHook(
  input: unknown,
  path: string,
  errors: ContentSchemaError[]
): void {
  if (!isRecord(input)) {
    errors.push({
      code: "invalid-schema",
      path,
      message: "M3 enfeoffment hook entry must be an object."
    });
    return;
  }
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^enfeoffment-hook-\d{3}$/u, errors);
  validateStringUnion(input, "trigger", `${path}.trigger`, M3_ENFEOFFMENT_TRIGGERS, errors);
  validatePatternString(
    input,
    "effectKey",
    `${path}.effectKey`,
    /^content\.m3\.validation\.enfeoffment_hook_\d{3}$/u,
    errors
  );
}

function validateM3Requirement(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 requirement must be an object." });
    return;
  }
  if (input["kind"] === "amount") {
    validateStringUnion(
      input,
      "resourceKind",
      `${path}.resourceKind`,
      ["cash", "grain", "troops"],
      errors
    );
    validatePositiveInteger(input, "amount", `${path}.amount`, errors);
    return;
  }
  if (input["kind"] === "condition") {
    validateNonEmptyString(input, "conditionKey", errors, `${path}.conditionKey`);
    return;
  }
  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message: "M3 requirement kind must be amount or condition."
  });
}

function validateM3Due(input: unknown, path: string, errors: ContentSchemaError[]): void {
  if (!isRecord(input)) {
    errors.push({ code: "invalid-schema", path, message: "M3 due must be an object." });
    return;
  }
  if (input["kind"] === "cadence") {
    validatePositiveInteger(input, "periodDays", `${path}.periodDays`, errors);
    validateIntegerInRange(
      input,
      "nextDueDay",
      `${path}.nextDueDay`,
      0,
      Number.MAX_SAFE_INTEGER,
      errors
    );
    return;
  }
  if (input["kind"] === "trigger") {
    validateNonEmptyString(input, "triggerKey", errors, `${path}.triggerKey`);
    return;
  }
  errors.push({
    code: "invalid-schema",
    path: `${path}.kind`,
    message: "M3 due kind must be cadence or trigger."
  });
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
  validateArray(input, "monthlyValues", errors, `${path}.monthlyValues`);
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
  validateArray(input, "points", errors, `${path}.points`);
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

function parseM3Provenance(input: Record<string, unknown>): M3PolityVassalageFixtureProvenanceV0 {
  const sourceCategory = readString(input, "sourceCategory");
  const confidence = readString(input, "confidence");
  const policyId = readString(input, "policyId");
  if (
    sourceCategory !== "validation-only-fixture" ||
    confidence !== "LOW" ||
    policyId !== "M3-HISTORICAL-CLAIM-PIPELINE-001"
  ) {
    throw new Error("Expected valid M3 polity vassalage provenance.");
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

function parseM3Polity(input: unknown): M3PolitySourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 polity source entry.");
  }
  const directSuzerainPolityId = input["directSuzerainPolityId"];
  if (directSuzerainPolityId !== null && typeof directSuzerainPolityId !== "string") {
    throw new Error("Expected valid M3 direct suzerain source id.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    directSuzerainPolityId
  };
}

function parseM3District(input: unknown): M3DistrictControllerSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 district source entry.");
  }
  const controllerPolityId = input["controllerPolityId"];
  if (controllerPolityId !== null && typeof controllerPolityId !== "string") {
    throw new Error("Expected valid M3 district controller source id.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    controllerPolityId
  };
}

function parseM3Obligation(input: unknown): M3ObligationSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 obligation source entry.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    debtorPolityId: readString(input, "debtorPolityId"),
    creditorPolityId: readString(input, "creditorPolityId"),
    obligationKind: readM3ObligationKind(input, "obligationKind"),
    requirement: parseM3Requirement(readRecord(input, "requirement")),
    due: parseM3Due(readRecord(input, "due")),
    status: readM3ObligationStatus(input, "status"),
    disputeReasonCode: readNullableString(input, "disputeReasonCode"),
    breachReasonCode: readNullableString(input, "breachReasonCode")
  };
}

function parseM3Character(input: unknown): M3CharacterSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 character source entry.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    claimLabel: readM3ClaimLabel(input, "claimLabel"),
    primaryPolityId: readString(input, "primaryPolityId"),
    archetype: readM3CharacterArchetype(input, "archetype"),
    aptitude: parseM3Aptitude(readRecord(input, "aptitude"))
  };
}

function parseM3Aptitude(input: Record<string, unknown>): M3CharacterAptitudeSourceV0 {
  return {
    administrationBps: readIntegerInRange(input, "administrationBps", 0, 10000),
    commandBps: readIntegerInRange(input, "commandBps", 0, 10000),
    diplomacyBps: readIntegerInRange(input, "diplomacyBps", 0, 10000),
    ambitionBps: readIntegerInRange(input, "ambitionBps", 0, 10000),
    legitimacyBps: readIntegerInRange(input, "legitimacyBps", 0, 10000)
  };
}

function parseM3Relationship(input: unknown): M3RelationshipSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 relationship source entry.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    fromCharacterId: readString(input, "fromCharacterId"),
    toCharacterId: readString(input, "toCharacterId"),
    relationshipKind: readM3RelationshipKind(input, "relationshipKind"),
    intensityBps: readIntegerInRange(input, "intensityBps", 0, 10000),
    claimLabel: readM3ClaimLabel(input, "claimLabel")
  };
}

function parseM3Office(input: unknown): M3OfficeSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 office source entry.");
  }
  const landedPowerId = input["landedPowerId"];
  if (landedPowerId !== null && typeof landedPowerId !== "string") {
    throw new Error("Expected valid M3 landed power source id.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    jurisdictionKind: readM3OfficeJurisdictionKind(input, "jurisdictionKind"),
    jurisdictionId: readString(input, "jurisdictionId"),
    currentHolderCharacterId: readString(input, "currentHolderCharacterId"),
    policyId: readString(input, "policyId"),
    landedPowerId,
    appointmentEligibility: parseM3AppointmentEligibility(
      readRecord(input, "appointmentEligibility")
    )
  };
}

function parseM3AppointmentEligibility(
  input: Record<string, unknown>
): M3AppointmentEligibilitySourceV0 {
  const requiredArchetype = input["requiredArchetype"];
  if (requiredArchetype !== null && typeof requiredArchetype !== "string") {
    throw new Error("Expected valid M3 required archetype.");
  }
  return {
    minimumAdministrationBps: readIntegerInRange(input, "minimumAdministrationBps", 0, 10000),
    minimumCommandBps: readIntegerInRange(input, "minimumCommandBps", 0, 10000),
    minimumLegitimacyBps: readIntegerInRange(input, "minimumLegitimacyBps", 0, 10000),
    requiredArchetype:
      requiredArchetype === null
        ? null
        : readM3CharacterArchetype({ requiredArchetype }, "requiredArchetype")
  };
}

function parseM3LandedPower(input: unknown): M3LandedPowerSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 landed power source entry.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    districtId: readString(input, "districtId"),
    extractionRightsBps: readIntegerInRange(input, "extractionRightsBps", 0, 10000),
    levyRightsBps: readIntegerInRange(input, "levyRightsBps", 0, 10000),
    successionWeightBps: readIntegerInRange(input, "successionWeightBps", 0, 10000)
  };
}

function parseM3OfficePolicy(input: unknown): M3OfficePolicySourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 office policy source entry.");
  }
  if (input["persistsAcrossHolderChange"] !== true) {
    throw new Error("Expected valid M3 office policy persistence marker.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    appointmentMode: readM3OfficeAppointmentMode(input, "appointmentMode"),
    taxAutonomyBps: readIntegerInRange(input, "taxAutonomyBps", 0, 10000),
    militaryAutonomyBps: readIntegerInRange(input, "militaryAutonomyBps", 0, 10000),
    persistsAcrossHolderChange: true,
    enfeoffmentHookIds: readArray(input, "enfeoffmentHookIds").map(readStringValue)
  };
}

function parseM3EnfeoffmentHook(input: unknown): M3EnfeoffmentHookSourceV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid M3 enfeoffment hook source entry.");
  }
  return {
    sourceId: readString(input, "sourceId"),
    trigger: readM3EnfeoffmentTrigger(input, "trigger"),
    effectKey: readString(input, "effectKey")
  };
}

function parseM3Requirement(input: Record<string, unknown>): M3ObligationRequirementSourceV0 {
  if (input["kind"] === "amount") {
    return {
      kind: "amount",
      resourceKind: readM3ResourceKind(input, "resourceKind"),
      amount: readPositiveInteger(input, "amount")
    };
  }
  if (input["kind"] === "condition") {
    return {
      kind: "condition",
      conditionKey: readString(input, "conditionKey")
    };
  }
  throw new Error("Expected valid M3 requirement.");
}

function parseM3Due(input: Record<string, unknown>): M3ObligationDueSourceV0 {
  if (input["kind"] === "cadence") {
    return {
      kind: "cadence",
      periodDays: readPositiveInteger(input, "periodDays"),
      nextDueDay: readIntegerInRange(input, "nextDueDay", 0, Number.MAX_SAFE_INTEGER)
    };
  }
  if (input["kind"] === "trigger") {
    return {
      kind: "trigger",
      triggerKey: readString(input, "triggerKey")
    };
  }
  throw new Error("Expected valid M3 due.");
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
  errors: ContentSchemaError[],
  path = key
): void {
  if (record[key] === expected) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be ${expected}.`
  });
}

function validateNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  errors: ContentSchemaError[],
  path = key
): void {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be a non-empty string.`
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

function validateNullablePatternString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  pattern: RegExp,
  errors: ContentSchemaError[]
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

function validateNullableString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: ContentSchemaError[]
): void {
  const value = record[key];
  if (value === null || (typeof value === "string" && value.length > 0)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be null or a non-empty string.`
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

function validateNullableStringUnion(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: ContentSchemaError[]
): void {
  const value = record[key];
  if (value === null || (typeof value === "string" && allowedValues.includes(value))) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be null or one of ${allowedValues.join(", ")}.`
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
  errors: ContentSchemaError[],
  path = key
): void {
  if (Array.isArray(record[key])) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be an array.`
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

function readM3ObligationKind(record: Record<string, unknown>, key: string): M3ObligationKind {
  const value = readString(record, key);
  if (value === "tribute" || value === "troop") {
    return value;
  }

  throw new Error(`${key} must be a valid M3 obligation kind.`);
}

function readM3ResourceKind(
  record: Record<string, unknown>,
  key: string
): M3ObligationResourceKind {
  const value = readString(record, key);
  if (value === "cash" || value === "grain" || value === "troops") {
    return value;
  }

  throw new Error(`${key} must be a valid M3 resource kind.`);
}

function readM3ObligationStatus(record: Record<string, unknown>, key: string): M3ObligationStatus {
  const value = readString(record, key);
  if (value === "active" || value === "disputed" || value === "breached") {
    return value;
  }

  throw new Error(`${key} must be a valid M3 obligation status.`);
}

function readM3ClaimLabel(record: Record<string, unknown>, key: string): M3ValidationClaimLabel {
  const value = readString(record, key);
  if (value === "FICTIONAL_VALIDATION") {
    return value;
  }

  throw new Error(`${key} must be FICTIONAL_VALIDATION.`);
}

function readM3CharacterArchetype(
  record: Record<string, unknown>,
  key: string
): M3CharacterArchetype {
  const value = readString(record, key);
  if (M3_CHARACTER_ARCHETYPES.includes(value as M3CharacterArchetype)) {
    return value as M3CharacterArchetype;
  }

  throw new Error(`${key} must be a valid M3 character archetype.`);
}

function readM3RelationshipKind(record: Record<string, unknown>, key: string): M3RelationshipKind {
  const value = readString(record, key);
  if (M3_RELATIONSHIP_KINDS.includes(value as M3RelationshipKind)) {
    return value as M3RelationshipKind;
  }

  throw new Error(`${key} must be a valid M3 relationship kind.`);
}

function readM3OfficeJurisdictionKind(
  record: Record<string, unknown>,
  key: string
): M3OfficeJurisdictionKind {
  const value = readString(record, key);
  if (value === "polity" || value === "district") {
    return value;
  }

  throw new Error(`${key} must be a valid M3 office jurisdiction kind.`);
}

function readM3OfficeAppointmentMode(
  record: Record<string, unknown>,
  key: string
): M3OfficeAppointmentMode {
  const value = readString(record, key);
  if (M3_OFFICE_APPOINTMENT_MODES.includes(value as M3OfficeAppointmentMode)) {
    return value as M3OfficeAppointmentMode;
  }

  throw new Error(`${key} must be a valid M3 office appointment mode.`);
}

function readM3EnfeoffmentTrigger(
  record: Record<string, unknown>,
  key: string
): M3EnfeoffmentTrigger {
  const value = readString(record, key);
  if (M3_ENFEOFFMENT_TRIGGERS.includes(value as M3EnfeoffmentTrigger)) {
    return value as M3EnfeoffmentTrigger;
  }

  throw new Error(`${key} must be a valid M3 enfeoffment trigger.`);
}

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null || typeof value === "string") {
    return value;
  }

  throw new Error(`${key} must be null or a string.`);
}

function formatErrors(errors: readonly ContentSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

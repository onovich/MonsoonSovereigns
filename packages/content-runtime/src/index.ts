import type {
  M1GraphEdgeDirection,
  M1GraphFixtureKind,
  M1GraphSyntheticScope,
  M2MapGeometryKind,
  M2MapGeometryOwnerKind,
  M2RouteKind,
  M2WorldFixtureKind,
  M2WorldHistoricity,
  M2WorldSyntheticScope,
  M3CharacterArchetype,
  M3CharacterOfficeFixtureKind,
  M3CharacterOfficeHistoricity,
  M3CharacterOfficeSyntheticScope,
  M3EnfeoffmentTrigger,
  M3OfficeAppointmentMode,
  M3OfficeJurisdictionKind,
  M3ObligationKind,
  M3ObligationResourceKind,
  M3ObligationStatus,
  M3RelationshipKind,
  M3ValidationClaimLabel,
  M3PolityVassalageFixtureKind,
  M3PolityVassalageHistoricity,
  M3PolityVassalageSyntheticScope
} from "@monsoon/content-schema";

export type Brand<TValue, TBrand extends string> = TValue & { readonly __brand: TBrand };

export type ContentNodeId = Brand<number, "ContentNodeId">;
export type ContentEdgeId = Brand<number, "ContentEdgeId">;
export type ContentDistrictId = Brand<number, "ContentDistrictId">;
export type ContentSettlementId = Brand<number, "ContentSettlementId">;
export type ContentRegionalSeasonalCurveId = Brand<number, "ContentRegionalSeasonalCurveId">;
export type ContentRouteId = Brand<number, "ContentRouteId">;
export type ContentMapGeometryId = Brand<number, "ContentMapGeometryId">;
export type ContentPolityId = Brand<number, "ContentPolityId">;
export type ContentM3DistrictId = Brand<number, "ContentM3DistrictId">;
export type ContentObligationId = Brand<number, "ContentObligationId">;
export type ContentCharacterId = Brand<number, "ContentCharacterId">;
export type ContentRelationshipId = Brand<number, "ContentRelationshipId">;
export type ContentOfficeId = Brand<number, "ContentOfficeId">;
export type ContentLandedPowerId = Brand<number, "ContentLandedPowerId">;
export type ContentOfficePolicyId = Brand<number, "ContentOfficePolicyId">;
export type ContentEnfeoffmentHookId = Brand<number, "ContentEnfeoffmentHookId">;
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

export interface RuntimeM3PolityVassalageContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: M3PolityVassalageFixtureKind;
  readonly syntheticScope: M3PolityVassalageSyntheticScope;
  readonly historicity: M3PolityVassalageHistoricity;
  readonly manifestHash: ContentManifestHash;
  readonly polityCount: number;
  readonly districtCount: number;
  readonly obligationCount: number;
}

export interface RuntimeM3PolityDefinitionV0 {
  readonly id: ContentPolityId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly directSuzerainPolityId: ContentPolityId | null;
}

export interface RuntimeM3DistrictControllerV0 {
  readonly id: ContentM3DistrictId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly controllerPolityId: ContentPolityId | null;
}

export type RuntimeM3ObligationRequirementV0 =
  | {
      readonly kind: "amount";
      readonly resourceKind: M3ObligationResourceKind;
      readonly amount: number;
    }
  | {
      readonly kind: "condition";
      readonly conditionKey: string;
    };

export type RuntimeM3ObligationDueV0 =
  | {
      readonly kind: "cadence";
      readonly periodDays: number;
      readonly nextDueDay: number;
    }
  | {
      readonly kind: "trigger";
      readonly triggerKey: string;
    };

export interface RuntimeM3ObligationDefinitionV0 {
  readonly id: ContentObligationId;
  readonly sourceId: string;
  readonly debtorPolityId: ContentPolityId;
  readonly creditorPolityId: ContentPolityId;
  readonly obligationKind: M3ObligationKind;
  readonly requirement: RuntimeM3ObligationRequirementV0;
  readonly due: RuntimeM3ObligationDueV0;
  readonly status: M3ObligationStatus;
  readonly disputeReasonCode: string | null;
  readonly breachReasonCode: string | null;
}

export interface RuntimeM3PolityVassalageContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m3-polity-vassalage-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeM3PolityVassalageContentManifestV0;
  readonly polities: readonly RuntimeM3PolityDefinitionV0[];
  readonly districts: readonly RuntimeM3DistrictControllerV0[];
  readonly obligations: readonly RuntimeM3ObligationDefinitionV0[];
}

export interface RuntimeM3PolityVassalageContentPackIndexV0 {
  readonly pack: RuntimeM3PolityVassalageContentPackV0;
  getPolity(id: ContentPolityId | number): RuntimeM3PolityDefinitionV0 | undefined;
  getDistrict(id: ContentM3DistrictId | number): RuntimeM3DistrictControllerV0 | undefined;
  getObligation(id: ContentObligationId | number): RuntimeM3ObligationDefinitionV0 | undefined;
}

export interface RuntimeM3CharacterOfficeContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: M3CharacterOfficeFixtureKind;
  readonly syntheticScope: M3CharacterOfficeSyntheticScope;
  readonly historicity: M3CharacterOfficeHistoricity;
  readonly manifestHash: ContentManifestHash;
  readonly characterCount: number;
  readonly relationshipCount: number;
  readonly officeCount: number;
  readonly landedPowerCount: number;
  readonly officePolicyCount: number;
  readonly enfeoffmentHookCount: number;
}

export interface RuntimeM3CharacterAptitudeV0 {
  readonly administrationBps: number;
  readonly commandBps: number;
  readonly diplomacyBps: number;
  readonly ambitionBps: number;
  readonly legitimacyBps: number;
}

export interface RuntimeM3CharacterDefinitionV0 {
  readonly id: ContentCharacterId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly claimLabel: M3ValidationClaimLabel;
  readonly primaryPolitySourceId: string;
  readonly archetype: M3CharacterArchetype;
  readonly aptitude: RuntimeM3CharacterAptitudeV0;
}

export interface RuntimeM3RelationshipDefinitionV0 {
  readonly id: ContentRelationshipId;
  readonly sourceId: string;
  readonly fromCharacterId: ContentCharacterId;
  readonly toCharacterId: ContentCharacterId;
  readonly relationshipKind: M3RelationshipKind;
  readonly intensityBps: number;
  readonly claimLabel: M3ValidationClaimLabel;
}

export interface RuntimeM3AppointmentEligibilityV0 {
  readonly minimumAdministrationBps: number;
  readonly minimumCommandBps: number;
  readonly minimumLegitimacyBps: number;
  readonly requiredArchetype: M3CharacterArchetype | null;
}

export interface RuntimeM3OfficeDefinitionV0 {
  readonly id: ContentOfficeId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly jurisdictionKind: M3OfficeJurisdictionKind;
  readonly jurisdictionSourceId: string;
  readonly currentHolderCharacterId: ContentCharacterId;
  readonly policyId: ContentOfficePolicyId;
  readonly landedPowerId: ContentLandedPowerId | null;
  readonly appointmentEligibility: RuntimeM3AppointmentEligibilityV0;
}

export interface RuntimeM3LandedPowerDefinitionV0 {
  readonly id: ContentLandedPowerId;
  readonly sourceId: string;
  readonly districtSourceId: string;
  readonly extractionRightsBps: number;
  readonly levyRightsBps: number;
  readonly successionWeightBps: number;
}

export interface RuntimeM3OfficePolicyDefinitionV0 {
  readonly id: ContentOfficePolicyId;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly appointmentMode: M3OfficeAppointmentMode;
  readonly taxAutonomyBps: number;
  readonly militaryAutonomyBps: number;
  readonly persistsAcrossHolderChange: true;
  readonly enfeoffmentHookIds: readonly ContentEnfeoffmentHookId[];
}

export interface RuntimeM3EnfeoffmentHookDefinitionV0 {
  readonly id: ContentEnfeoffmentHookId;
  readonly sourceId: string;
  readonly trigger: M3EnfeoffmentTrigger;
  readonly effectKey: string;
}

export interface RuntimeM3CharacterOfficeContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m3-character-office-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeM3CharacterOfficeContentManifestV0;
  readonly characters: readonly RuntimeM3CharacterDefinitionV0[];
  readonly relationships: readonly RuntimeM3RelationshipDefinitionV0[];
  readonly offices: readonly RuntimeM3OfficeDefinitionV0[];
  readonly landedPowers: readonly RuntimeM3LandedPowerDefinitionV0[];
  readonly officePolicies: readonly RuntimeM3OfficePolicyDefinitionV0[];
  readonly enfeoffmentHooks: readonly RuntimeM3EnfeoffmentHookDefinitionV0[];
}

export interface RuntimeM3CharacterOfficeContentPackIndexV0 {
  readonly pack: RuntimeM3CharacterOfficeContentPackV0;
  getCharacter(id: ContentCharacterId | number): RuntimeM3CharacterDefinitionV0 | undefined;
  getRelationship(
    id: ContentRelationshipId | number
  ): RuntimeM3RelationshipDefinitionV0 | undefined;
  getOffice(id: ContentOfficeId | number): RuntimeM3OfficeDefinitionV0 | undefined;
  getLandedPower(id: ContentLandedPowerId | number): RuntimeM3LandedPowerDefinitionV0 | undefined;
  getOfficePolicy(
    id: ContentOfficePolicyId | number
  ): RuntimeM3OfficePolicyDefinitionV0 | undefined;
  getEnfeoffmentHook(
    id: ContentEnfeoffmentHookId | number
  ): RuntimeM3EnfeoffmentHookDefinitionV0 | undefined;
}

interface RuntimeValidationError {
  readonly path: string;
  readonly message: string;
}

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

export function parseRuntimeM3PolityVassalageContentPackV0(
  input: unknown
): RuntimeM3PolityVassalageContentPackV0 {
  const errors = validateRuntimeM3PolityVassalageContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(
      `RuntimeM3PolityVassalageContentPackV0 invalid: ${formatRuntimeErrors(errors)}`
    );
  }

  if (!isRecord(input)) {
    throw new Error("RuntimeM3PolityVassalageContentPackV0 invalid: root was not an object.");
  }

  const manifest = readRecord(input, "manifest");
  const pack = {
    schemaVersion: 1 as const,
    kind: "runtime-m3-polity-vassalage-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    manifest: freezeM3Manifest({
      schemaVersion: 1,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "polity-vassalage-fixture",
      syntheticScope: "m3-validation-only",
      historicity: "FICTIONAL",
      manifestHash: parseContentManifestHash(readString(manifest, "manifestHash")),
      polityCount: readPositiveInteger(manifest, "polityCount"),
      districtCount: readPositiveInteger(manifest, "districtCount"),
      obligationCount: readPositiveInteger(manifest, "obligationCount")
    }),
    polities: Object.freeze(readArray(input, "polities").map(parseRuntimeM3Polity)),
    districts: Object.freeze(readArray(input, "districts").map(parseRuntimeM3District)),
    obligations: Object.freeze(readArray(input, "obligations").map(parseRuntimeM3Obligation))
  };

  return Object.freeze(pack);
}

export function parseRuntimeM3CharacterOfficeContentPackV0(
  input: unknown
): RuntimeM3CharacterOfficeContentPackV0 {
  const errors = validateRuntimeM3CharacterOfficeContentPackV0(input);
  if (errors.length > 0) {
    throw new Error(
      `RuntimeM3CharacterOfficeContentPackV0 invalid: ${formatRuntimeErrors(errors)}`
    );
  }

  if (!isRecord(input)) {
    throw new Error("RuntimeM3CharacterOfficeContentPackV0 invalid: root was not an object.");
  }

  const manifest = readRecord(input, "manifest");
  const pack = {
    schemaVersion: 1 as const,
    kind: "runtime-m3-character-office-content-pack-v0" as const,
    fixtureId: readString(input, "fixtureId"),
    manifest: freezeM3CharacterOfficeManifest({
      schemaVersion: 1,
      fixtureId: readString(manifest, "fixtureId"),
      fixtureKind: "character-office-fixture",
      syntheticScope: "m3-validation-only",
      historicity: "FICTIONAL",
      manifestHash: parseContentManifestHash(readString(manifest, "manifestHash")),
      characterCount: readPositiveInteger(manifest, "characterCount"),
      relationshipCount: readPositiveInteger(manifest, "relationshipCount"),
      officeCount: readPositiveInteger(manifest, "officeCount"),
      landedPowerCount: readPositiveInteger(manifest, "landedPowerCount"),
      officePolicyCount: readPositiveInteger(manifest, "officePolicyCount"),
      enfeoffmentHookCount: readPositiveInteger(manifest, "enfeoffmentHookCount")
    }),
    characters: Object.freeze(readArray(input, "characters").map(parseRuntimeM3Character)),
    relationships: Object.freeze(readArray(input, "relationships").map(parseRuntimeM3Relationship)),
    offices: Object.freeze(readArray(input, "offices").map(parseRuntimeM3Office)),
    landedPowers: Object.freeze(readArray(input, "landedPowers").map(parseRuntimeM3LandedPower)),
    officePolicies: Object.freeze(
      readArray(input, "officePolicies").map(parseRuntimeM3OfficePolicy)
    ),
    enfeoffmentHooks: Object.freeze(
      readArray(input, "enfeoffmentHooks").map(parseRuntimeM3EnfeoffmentHook)
    )
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

export function validateRuntimeM3PolityVassalageContentPackV0(
  input: unknown
): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime M3 polity vassalage content pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRuntimeM3Root(input, errors);
  validateRuntimeM3ArrayEntries(input, errors);
  if (errors.length > 0) {
    return errors;
  }

  validateRuntimeM3Semantics(input, errors);
  return errors;
}

export function validateRuntimeM3CharacterOfficeContentPackV0(
  input: unknown
): readonly RuntimeValidationError[] {
  if (!isRecord(input)) {
    return [{ path: "$", message: "Runtime M3 character office content pack must be an object." }];
  }

  const errors: RuntimeValidationError[] = [];
  validateRuntimeM3CharacterOfficeRoot(input, errors);
  validateRuntimeM3CharacterOfficeArrayEntries(input, errors);
  if (errors.length > 0) {
    return errors;
  }

  validateRuntimeM3CharacterOfficeSemantics(input, errors);
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

export function parseContentPolityId(value: unknown): ContentPolityId {
  return parsePositiveInteger(value, "ContentPolityId") as ContentPolityId;
}

export function parseContentM3DistrictId(value: unknown): ContentM3DistrictId {
  return parsePositiveInteger(value, "ContentM3DistrictId") as ContentM3DistrictId;
}

export function parseContentObligationId(value: unknown): ContentObligationId {
  return parsePositiveInteger(value, "ContentObligationId") as ContentObligationId;
}

export function parseContentCharacterId(value: unknown): ContentCharacterId {
  return parsePositiveInteger(value, "ContentCharacterId") as ContentCharacterId;
}

export function parseContentRelationshipId(value: unknown): ContentRelationshipId {
  return parsePositiveInteger(value, "ContentRelationshipId") as ContentRelationshipId;
}

export function parseContentOfficeId(value: unknown): ContentOfficeId {
  return parsePositiveInteger(value, "ContentOfficeId") as ContentOfficeId;
}

export function parseContentLandedPowerId(value: unknown): ContentLandedPowerId {
  return parsePositiveInteger(value, "ContentLandedPowerId") as ContentLandedPowerId;
}

export function parseContentOfficePolicyId(value: unknown): ContentOfficePolicyId {
  return parsePositiveInteger(value, "ContentOfficePolicyId") as ContentOfficePolicyId;
}

export function parseContentEnfeoffmentHookId(value: unknown): ContentEnfeoffmentHookId {
  return parsePositiveInteger(value, "ContentEnfeoffmentHookId") as ContentEnfeoffmentHookId;
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

export function createRuntimeM3PolityVassalageContentPackIndexV0(
  pack: RuntimeM3PolityVassalageContentPackV0
): RuntimeM3PolityVassalageContentPackIndexV0 {
  const polityById = new Map<number, RuntimeM3PolityDefinitionV0>();
  const districtById = new Map<number, RuntimeM3DistrictControllerV0>();
  const obligationById = new Map<number, RuntimeM3ObligationDefinitionV0>();
  for (const polity of pack.polities) {
    polityById.set(polity.id, polity);
  }
  for (const district of pack.districts) {
    districtById.set(district.id, district);
  }
  for (const obligation of pack.obligations) {
    obligationById.set(obligation.id, obligation);
  }

  return Object.freeze({
    pack,
    getPolity(id: ContentPolityId | number): RuntimeM3PolityDefinitionV0 | undefined {
      return polityById.get(id);
    },
    getDistrict(id: ContentM3DistrictId | number): RuntimeM3DistrictControllerV0 | undefined {
      return districtById.get(id);
    },
    getObligation(id: ContentObligationId | number): RuntimeM3ObligationDefinitionV0 | undefined {
      return obligationById.get(id);
    }
  });
}

export function createRuntimeM3CharacterOfficeContentPackIndexV0(
  pack: RuntimeM3CharacterOfficeContentPackV0
): RuntimeM3CharacterOfficeContentPackIndexV0 {
  const characterById = new Map<number, RuntimeM3CharacterDefinitionV0>();
  const relationshipById = new Map<number, RuntimeM3RelationshipDefinitionV0>();
  const officeById = new Map<number, RuntimeM3OfficeDefinitionV0>();
  const landedPowerById = new Map<number, RuntimeM3LandedPowerDefinitionV0>();
  const officePolicyById = new Map<number, RuntimeM3OfficePolicyDefinitionV0>();
  const hookById = new Map<number, RuntimeM3EnfeoffmentHookDefinitionV0>();

  for (const character of pack.characters) {
    characterById.set(character.id, character);
  }
  for (const relationship of pack.relationships) {
    relationshipById.set(relationship.id, relationship);
  }
  for (const office of pack.offices) {
    officeById.set(office.id, office);
  }
  for (const landedPower of pack.landedPowers) {
    landedPowerById.set(landedPower.id, landedPower);
  }
  for (const policy of pack.officePolicies) {
    officePolicyById.set(policy.id, policy);
  }
  for (const hook of pack.enfeoffmentHooks) {
    hookById.set(hook.id, hook);
  }

  return Object.freeze({
    pack,
    getCharacter(id: ContentCharacterId | number): RuntimeM3CharacterDefinitionV0 | undefined {
      return characterById.get(id);
    },
    getRelationship(
      id: ContentRelationshipId | number
    ): RuntimeM3RelationshipDefinitionV0 | undefined {
      return relationshipById.get(id);
    },
    getOffice(id: ContentOfficeId | number): RuntimeM3OfficeDefinitionV0 | undefined {
      return officeById.get(id);
    },
    getLandedPower(
      id: ContentLandedPowerId | number
    ): RuntimeM3LandedPowerDefinitionV0 | undefined {
      return landedPowerById.get(id);
    },
    getOfficePolicy(
      id: ContentOfficePolicyId | number
    ): RuntimeM3OfficePolicyDefinitionV0 | undefined {
      return officePolicyById.get(id);
    },
    getEnfeoffmentHook(
      id: ContentEnfeoffmentHookId | number
    ): RuntimeM3EnfeoffmentHookDefinitionV0 | undefined {
      return hookById.get(id);
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

function validateRuntimeM3Root(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (input["schemaVersion"] !== 1) {
    errors.push({ path: "schemaVersion", message: "schemaVersion must be 1." });
  }
  if (input["kind"] !== "runtime-m3-polity-vassalage-content-pack-v0") {
    errors.push({
      path: "kind",
      message: "kind must be runtime-m3-polity-vassalage-content-pack-v0."
    });
  }
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);
  const manifest = input["manifest"];
  if (!isRecord(manifest)) {
    errors.push({ path: "manifest", message: "manifest must be an object." });
  } else {
    validateM3Manifest(manifest, errors);
  }
  validateArray(input, "polities", errors);
  validateArray(input, "districts", errors);
  validateArray(input, "obligations", errors);
}

function validateRuntimeM3CharacterOfficeRoot(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (input["schemaVersion"] !== 1) {
    errors.push({ path: "schemaVersion", message: "schemaVersion must be 1." });
  }
  if (input["kind"] !== "runtime-m3-character-office-content-pack-v0") {
    errors.push({
      path: "kind",
      message: "kind must be runtime-m3-character-office-content-pack-v0."
    });
  }
  validateNonEmptyString(input, "fixtureId", "fixtureId", errors);
  const manifest = input["manifest"];
  if (!isRecord(manifest)) {
    errors.push({ path: "manifest", message: "manifest must be an object." });
  } else {
    validateM3CharacterOfficeManifest(manifest, errors);
  }
  validateArray(input, "characters", errors);
  validateArray(input, "relationships", errors);
  validateArray(input, "offices", errors);
  validateArray(input, "landedPowers", errors);
  validateArray(input, "officePolicies", errors);
  validateArray(input, "enfeoffmentHooks", errors);
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

function validateM3Manifest(
  manifest: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (manifest["schemaVersion"] !== 1) {
    errors.push({ path: "manifest.schemaVersion", message: "manifest schemaVersion must be 1." });
  }
  validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
  if (manifest["fixtureKind"] !== "polity-vassalage-fixture") {
    errors.push({
      path: "manifest.fixtureKind",
      message: "manifest fixtureKind must be polity-vassalage-fixture."
    });
  }
  if (manifest["syntheticScope"] !== "m3-validation-only") {
    errors.push({
      path: "manifest.syntheticScope",
      message: "manifest syntheticScope must be m3-validation-only."
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
  validatePositiveIntegerField(manifest, "polityCount", "manifest.polityCount", errors);
  validatePositiveIntegerField(manifest, "districtCount", "manifest.districtCount", errors);
  validatePositiveIntegerField(manifest, "obligationCount", "manifest.obligationCount", errors);
}

function validateM3CharacterOfficeManifest(
  manifest: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  if (manifest["schemaVersion"] !== 1) {
    errors.push({ path: "manifest.schemaVersion", message: "manifest schemaVersion must be 1." });
  }
  validateNonEmptyString(manifest, "fixtureId", "manifest.fixtureId", errors);
  if (manifest["fixtureKind"] !== "character-office-fixture") {
    errors.push({
      path: "manifest.fixtureKind",
      message: "manifest fixtureKind must be character-office-fixture."
    });
  }
  if (manifest["syntheticScope"] !== "m3-validation-only") {
    errors.push({
      path: "manifest.syntheticScope",
      message: "manifest syntheticScope must be m3-validation-only."
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
  validatePositiveIntegerField(manifest, "characterCount", "manifest.characterCount", errors);
  validatePositiveIntegerField(manifest, "relationshipCount", "manifest.relationshipCount", errors);
  validatePositiveIntegerField(manifest, "officeCount", "manifest.officeCount", errors);
  validatePositiveIntegerField(manifest, "landedPowerCount", "manifest.landedPowerCount", errors);
  validatePositiveIntegerField(manifest, "officePolicyCount", "manifest.officePolicyCount", errors);
  validatePositiveIntegerField(
    manifest,
    "enfeoffmentHookCount",
    "manifest.enfeoffmentHookCount",
    errors
  );
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

function validateRuntimeM3ArrayEntries(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const polities = input["polities"];
  if (Array.isArray(polities)) {
    polities.forEach((polity, index) =>
      validateRuntimeM3Polity(polity, `polities[${index}]`, errors)
    );
  }
  const districts = input["districts"];
  if (Array.isArray(districts)) {
    districts.forEach((district, index) =>
      validateRuntimeM3District(district, `districts[${index}]`, errors)
    );
  }
  const obligations = input["obligations"];
  if (Array.isArray(obligations)) {
    obligations.forEach((obligation, index) =>
      validateRuntimeM3Obligation(obligation, `obligations[${index}]`, errors)
    );
  }
}

function validateRuntimeM3CharacterOfficeArrayEntries(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const characters = input["characters"];
  if (Array.isArray(characters)) {
    characters.forEach((character, index) =>
      validateRuntimeM3Character(character, `characters[${index}]`, errors)
    );
  }
  const relationships = input["relationships"];
  if (Array.isArray(relationships)) {
    relationships.forEach((relationship, index) =>
      validateRuntimeM3Relationship(relationship, `relationships[${index}]`, errors)
    );
  }
  const offices = input["offices"];
  if (Array.isArray(offices)) {
    offices.forEach((office, index) =>
      validateRuntimeM3Office(office, `offices[${index}]`, errors)
    );
  }
  const landedPowers = input["landedPowers"];
  if (Array.isArray(landedPowers)) {
    landedPowers.forEach((landedPower, index) =>
      validateRuntimeM3LandedPower(landedPower, `landedPowers[${index}]`, errors)
    );
  }
  const officePolicies = input["officePolicies"];
  if (Array.isArray(officePolicies)) {
    officePolicies.forEach((policy, index) =>
      validateRuntimeM3OfficePolicy(policy, `officePolicies[${index}]`, errors)
    );
  }
  const hooks = input["enfeoffmentHooks"];
  if (Array.isArray(hooks)) {
    hooks.forEach((hook, index) =>
      validateRuntimeM3EnfeoffmentHook(hook, `enfeoffmentHooks[${index}]`, errors)
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

function validateRuntimeM3Polity(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 polity must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^polity-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.polity_\d{3}$/u,
    errors
  );
  validateNullablePositiveIntegerField(
    input,
    "directSuzerainPolityId",
    `${path}.directSuzerainPolityId`,
    errors
  );
}

function validateRuntimeM3District(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 district must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^district-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.district_\d{3}$/u,
    errors
  );
  validateNullablePositiveIntegerField(
    input,
    "controllerPolityId",
    `${path}.controllerPolityId`,
    errors
  );
}

function validateRuntimeM3Obligation(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 obligation must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^obligation-\d{3}$/u, errors);
  validatePositiveIntegerField(input, "debtorPolityId", `${path}.debtorPolityId`, errors);
  validatePositiveIntegerField(input, "creditorPolityId", `${path}.creditorPolityId`, errors);
  validateStringUnion(
    input,
    "obligationKind",
    `${path}.obligationKind`,
    ["tribute", "troop"],
    errors
  );
  validateRuntimeM3Requirement(input["requirement"], `${path}.requirement`, errors);
  validateRuntimeM3Due(input["due"], `${path}.due`, errors);
  validateStringUnion(
    input,
    "status",
    `${path}.status`,
    ["active", "disputed", "breached"],
    errors
  );
  validateNullableStringField(input, "disputeReasonCode", `${path}.disputeReasonCode`, errors);
  validateNullableStringField(input, "breachReasonCode", `${path}.breachReasonCode`, errors);
}

function validateRuntimeM3Character(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 character must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^character-\d{3}$/u, errors);
  validatePatternString(
    input,
    "displayNameKey",
    `${path}.displayNameKey`,
    /^content\.m3\.validation\.character_\d{3}$/u,
    errors
  );
  if (input["claimLabel"] !== "FICTIONAL_VALIDATION") {
    errors.push({
      path: `${path}.claimLabel`,
      message: "claimLabel must be FICTIONAL_VALIDATION."
    });
  }
  validatePatternString(
    input,
    "primaryPolitySourceId",
    `${path}.primaryPolitySourceId`,
    /^polity-\d{3}$/u,
    errors
  );
  validateStringUnion(input, "archetype", `${path}.archetype`, M3_CHARACTER_ARCHETYPES, errors);
  validateRuntimeM3Aptitude(input["aptitude"], `${path}.aptitude`, errors);
}

function validateRuntimeM3Aptitude(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 aptitude must be an object." });
    return;
  }
  validateIntegerFieldInRange(
    input,
    "administrationBps",
    `${path}.administrationBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(input, "commandBps", `${path}.commandBps`, 0, 10000, errors);
  validateIntegerFieldInRange(input, "diplomacyBps", `${path}.diplomacyBps`, 0, 10000, errors);
  validateIntegerFieldInRange(input, "ambitionBps", `${path}.ambitionBps`, 0, 10000, errors);
  validateIntegerFieldInRange(input, "legitimacyBps", `${path}.legitimacyBps`, 0, 10000, errors);
}

function validateRuntimeM3Relationship(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 relationship must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^relationship-\d{3}$/u, errors);
  validatePositiveIntegerField(input, "fromCharacterId", `${path}.fromCharacterId`, errors);
  validatePositiveIntegerField(input, "toCharacterId", `${path}.toCharacterId`, errors);
  validateStringUnion(
    input,
    "relationshipKind",
    `${path}.relationshipKind`,
    M3_RELATIONSHIP_KINDS,
    errors
  );
  validateIntegerFieldInRange(input, "intensityBps", `${path}.intensityBps`, 0, 10000, errors);
  if (input["claimLabel"] !== "FICTIONAL_VALIDATION") {
    errors.push({
      path: `${path}.claimLabel`,
      message: "claimLabel must be FICTIONAL_VALIDATION."
    });
  }
}

function validateRuntimeM3Office(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 office must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
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
    "jurisdictionSourceId",
    `${path}.jurisdictionSourceId`,
    /^(polity|district)-\d{3}$/u,
    errors
  );
  validatePositiveIntegerField(
    input,
    "currentHolderCharacterId",
    `${path}.currentHolderCharacterId`,
    errors
  );
  validatePositiveIntegerField(input, "policyId", `${path}.policyId`, errors);
  validateNullablePositiveIntegerField(input, "landedPowerId", `${path}.landedPowerId`, errors);
  validateRuntimeM3AppointmentEligibility(
    input["appointmentEligibility"],
    `${path}.appointmentEligibility`,
    errors
  );
}

function validateRuntimeM3AppointmentEligibility(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 appointment eligibility must be an object." });
    return;
  }
  validateIntegerFieldInRange(
    input,
    "minimumAdministrationBps",
    `${path}.minimumAdministrationBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "minimumCommandBps",
    `${path}.minimumCommandBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(
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

function validateRuntimeM3LandedPower(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 landed power must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
  validatePatternString(input, "sourceId", `${path}.sourceId`, /^landed-power-\d{3}$/u, errors);
  validatePatternString(
    input,
    "districtSourceId",
    `${path}.districtSourceId`,
    /^district-\d{3}$/u,
    errors
  );
  validateIntegerFieldInRange(
    input,
    "extractionRightsBps",
    `${path}.extractionRightsBps`,
    0,
    10000,
    errors
  );
  validateIntegerFieldInRange(input, "levyRightsBps", `${path}.levyRightsBps`, 0, 10000, errors);
  validateIntegerFieldInRange(
    input,
    "successionWeightBps",
    `${path}.successionWeightBps`,
    0,
    10000,
    errors
  );
}

function validateRuntimeM3OfficePolicy(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 office policy must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
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
  validateIntegerFieldInRange(input, "taxAutonomyBps", `${path}.taxAutonomyBps`, 0, 10000, errors);
  validateIntegerFieldInRange(
    input,
    "militaryAutonomyBps",
    `${path}.militaryAutonomyBps`,
    0,
    10000,
    errors
  );
  if (input["persistsAcrossHolderChange"] !== true) {
    errors.push({
      path: `${path}.persistsAcrossHolderChange`,
      message: "persistsAcrossHolderChange must be true."
    });
  }
  validateArray(input, "enfeoffmentHookIds", errors);
  const hookIds = input["enfeoffmentHookIds"];
  if (Array.isArray(hookIds)) {
    hookIds.forEach((hookId, index) =>
      validatePositiveIntegerValue(hookId, `${path}.enfeoffmentHookIds[${index}]`, errors)
    );
  }
}

function validateRuntimeM3EnfeoffmentHook(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 enfeoffment hook must be an object." });
    return;
  }
  validatePositiveIntegerField(input, "id", `${path}.id`, errors);
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

function validateRuntimeM3Requirement(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 requirement must be an object." });
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
    validatePositiveIntegerField(input, "amount", `${path}.amount`, errors);
    return;
  }
  if (input["kind"] === "condition") {
    validateNonEmptyString(input, "conditionKey", `${path}.conditionKey`, errors);
    return;
  }
  errors.push({
    path: `${path}.kind`,
    message: "Runtime M3 requirement kind must be amount or condition."
  });
}

function validateRuntimeM3Due(
  input: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (!isRecord(input)) {
    errors.push({ path, message: "Runtime M3 due must be an object." });
    return;
  }
  if (input["kind"] === "cadence") {
    validatePositiveIntegerField(input, "periodDays", `${path}.periodDays`, errors);
    validateIntegerFieldInRange(
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
    validateNonEmptyString(input, "triggerKey", `${path}.triggerKey`, errors);
    return;
  }
  errors.push({ path: `${path}.kind`, message: "Runtime M3 due kind must be cadence or trigger." });
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

function validateRuntimeM3Semantics(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const manifest = readRecord(input, "manifest");
  const polities = readArray(input, "polities");
  const districts = readArray(input, "districts");
  const obligations = readArray(input, "obligations");

  if (readString(input, "fixtureId") !== readString(manifest, "fixtureId")) {
    errors.push({
      path: "manifest.fixtureId",
      message: "manifest fixtureId must match pack fixtureId."
    });
  }
  validateRuntimeCount(manifest, "polityCount", polities.length, errors);
  validateRuntimeCount(manifest, "districtCount", districts.length, errors);
  validateRuntimeCount(manifest, "obligationCount", obligations.length, errors);

  const polityIds = collectOrderedRuntimeIds(polities, "polities", errors);
  collectOrderedRuntimeIds(districts, "districts", errors);
  collectOrderedRuntimeIds(obligations, "obligations", errors);

  polities.forEach((polity, index) => {
    if (!isRecord(polity)) {
      return;
    }
    const suzerainId = readNullablePositiveInteger(polity, "directSuzerainPolityId");
    if (suzerainId !== null && !polityIds.has(suzerainId)) {
      errors.push({
        path: `polities[${index}].directSuzerainPolityId`,
        message: `Missing suzerain polity ${suzerainId}.`
      });
    }
    if (suzerainId === readPositiveInteger(polity, "id")) {
      errors.push({
        path: `polities[${index}].directSuzerainPolityId`,
        message: "Runtime M3 polity direct suzerain must not reference itself."
      });
    }
  });

  const cycleId = findM3SuzerainCycle(polities);
  if (cycleId !== null) {
    errors.push({
      path: "polities",
      message: `Runtime M3 suzerain chain contains a cycle at polity ${cycleId}.`
    });
  }

  districts.forEach((district, index) => {
    if (!isRecord(district)) {
      return;
    }
    const controllerPolityId = readNullablePositiveInteger(district, "controllerPolityId");
    if (controllerPolityId !== null && !polityIds.has(controllerPolityId)) {
      errors.push({
        path: `districts[${index}].controllerPolityId`,
        message: `Missing controller polity ${controllerPolityId}.`
      });
    }
  });

  obligations.forEach((obligation, index) => {
    if (!isRecord(obligation)) {
      return;
    }
    const debtorPolityId = readPositiveInteger(obligation, "debtorPolityId");
    const creditorPolityId = readPositiveInteger(obligation, "creditorPolityId");
    if (!polityIds.has(debtorPolityId)) {
      errors.push({
        path: `obligations[${index}].debtorPolityId`,
        message: `Missing debtor polity ${debtorPolityId}.`
      });
    }
    if (!polityIds.has(creditorPolityId)) {
      errors.push({
        path: `obligations[${index}].creditorPolityId`,
        message: `Missing creditor polity ${creditorPolityId}.`
      });
    }
    if (debtorPolityId === creditorPolityId) {
      errors.push({
        path: `obligations[${index}].creditorPolityId`,
        message: "Runtime M3 obligation debtor and creditor must differ."
      });
    }
  });
}

function validateRuntimeM3CharacterOfficeSemantics(
  input: Record<string, unknown>,
  errors: RuntimeValidationError[]
): void {
  const manifest = readRecord(input, "manifest");
  const characters = readArray(input, "characters");
  const relationships = readArray(input, "relationships");
  const offices = readArray(input, "offices");
  const landedPowers = readArray(input, "landedPowers");
  const officePolicies = readArray(input, "officePolicies");
  const hooks = readArray(input, "enfeoffmentHooks");

  if (readString(input, "fixtureId") !== readString(manifest, "fixtureId")) {
    errors.push({
      path: "manifest.fixtureId",
      message: "manifest fixtureId must match pack fixtureId."
    });
  }
  validateRuntimeCount(manifest, "characterCount", characters.length, errors);
  validateRuntimeCount(manifest, "relationshipCount", relationships.length, errors);
  validateRuntimeCount(manifest, "officeCount", offices.length, errors);
  validateRuntimeCount(manifest, "landedPowerCount", landedPowers.length, errors);
  validateRuntimeCount(manifest, "officePolicyCount", officePolicies.length, errors);
  validateRuntimeCount(manifest, "enfeoffmentHookCount", hooks.length, errors);

  const characterIds = collectOrderedRuntimeIds(characters, "characters", errors);
  collectOrderedRuntimeIds(relationships, "relationships", errors);
  collectOrderedRuntimeIds(offices, "offices", errors);
  const landedPowerIds = collectOrderedRuntimeIds(landedPowers, "landedPowers", errors);
  const policyIds = collectOrderedRuntimeIds(officePolicies, "officePolicies", errors);
  const hookIds = collectOrderedRuntimeIds(hooks, "enfeoffmentHooks", errors);

  relationships.forEach((relationship, index) => {
    if (!isRecord(relationship)) {
      return;
    }
    const fromCharacterId = readPositiveInteger(relationship, "fromCharacterId");
    const toCharacterId = readPositiveInteger(relationship, "toCharacterId");
    if (!characterIds.has(fromCharacterId)) {
      errors.push({
        path: `relationships[${index}].fromCharacterId`,
        message: `Missing from character ${fromCharacterId}.`
      });
    }
    if (!characterIds.has(toCharacterId)) {
      errors.push({
        path: `relationships[${index}].toCharacterId`,
        message: `Missing to character ${toCharacterId}.`
      });
    }
    if (fromCharacterId === toCharacterId) {
      errors.push({
        path: `relationships[${index}].toCharacterId`,
        message: "Runtime M3 relationship must not reference the same character."
      });
    }
  });

  const parentCycleId = findM3ParentCycle(relationships);
  if (parentCycleId !== null) {
    errors.push({
      path: "relationships",
      message: `Runtime M3 parent relationship graph contains a cycle at character ${parentCycleId}.`
    });
  }

  offices.forEach((office, index) => {
    if (!isRecord(office)) {
      return;
    }
    const holderId = readPositiveInteger(office, "currentHolderCharacterId");
    const policyId = readPositiveInteger(office, "policyId");
    const landedPowerId = readNullablePositiveInteger(office, "landedPowerId");
    if (!characterIds.has(holderId)) {
      errors.push({
        path: `offices[${index}].currentHolderCharacterId`,
        message: `Missing current holder character ${holderId}.`
      });
    }
    if (!policyIds.has(policyId)) {
      errors.push({ path: `offices[${index}].policyId`, message: `Missing policy ${policyId}.` });
    }
    if (landedPowerId !== null && !landedPowerIds.has(landedPowerId)) {
      errors.push({
        path: `offices[${index}].landedPowerId`,
        message: `Missing landed power ${landedPowerId}.`
      });
    }
  });

  officePolicies.forEach((policy, index) => {
    if (!isRecord(policy)) {
      return;
    }
    const policyHookIds = readArray(policy, "enfeoffmentHookIds");
    policyHookIds.forEach((hookId, hookIndex) => {
      const parsedHookId = parsePositiveInteger(hookId, "enfeoffmentHookId");
      if (!hookIds.has(parsedHookId)) {
        errors.push({
          path: `officePolicies[${index}].enfeoffmentHookIds[${hookIndex}]`,
          message: `Missing enfeoffment hook ${parsedHookId}.`
        });
      }
    });
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

function parseRuntimeM3Polity(input: unknown): RuntimeM3PolityDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 polity.");
  }
  const directSuzerainPolityId = readNullablePositiveInteger(input, "directSuzerainPolityId");
  return Object.freeze({
    id: parseContentPolityId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    directSuzerainPolityId:
      directSuzerainPolityId === null ? null : parseContentPolityId(directSuzerainPolityId)
  });
}

function parseRuntimeM3District(input: unknown): RuntimeM3DistrictControllerV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 district.");
  }
  const controllerPolityId = readNullablePositiveInteger(input, "controllerPolityId");
  return Object.freeze({
    id: parseContentM3DistrictId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    controllerPolityId:
      controllerPolityId === null ? null : parseContentPolityId(controllerPolityId)
  });
}

function parseRuntimeM3Obligation(input: unknown): RuntimeM3ObligationDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 obligation.");
  }
  return Object.freeze({
    id: parseContentObligationId(input["id"]),
    sourceId: readString(input, "sourceId"),
    debtorPolityId: parseContentPolityId(input["debtorPolityId"]),
    creditorPolityId: parseContentPolityId(input["creditorPolityId"]),
    obligationKind: readM3ObligationKind(input, "obligationKind"),
    requirement: parseRuntimeM3Requirement(readRecord(input, "requirement")),
    due: parseRuntimeM3Due(readRecord(input, "due")),
    status: readM3ObligationStatus(input, "status"),
    disputeReasonCode: readNullableString(input, "disputeReasonCode"),
    breachReasonCode: readNullableString(input, "breachReasonCode")
  });
}

function parseRuntimeM3Character(input: unknown): RuntimeM3CharacterDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 character.");
  }
  return Object.freeze({
    id: parseContentCharacterId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    claimLabel: readM3ClaimLabel(input, "claimLabel"),
    primaryPolitySourceId: readString(input, "primaryPolitySourceId"),
    archetype: readM3CharacterArchetype(input, "archetype"),
    aptitude: parseRuntimeM3Aptitude(readRecord(input, "aptitude"))
  });
}

function parseRuntimeM3Aptitude(input: Record<string, unknown>): RuntimeM3CharacterAptitudeV0 {
  return Object.freeze({
    administrationBps: readIntegerInRange(input, "administrationBps", 0, 10000),
    commandBps: readIntegerInRange(input, "commandBps", 0, 10000),
    diplomacyBps: readIntegerInRange(input, "diplomacyBps", 0, 10000),
    ambitionBps: readIntegerInRange(input, "ambitionBps", 0, 10000),
    legitimacyBps: readIntegerInRange(input, "legitimacyBps", 0, 10000)
  });
}

function parseRuntimeM3Relationship(input: unknown): RuntimeM3RelationshipDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 relationship.");
  }
  return Object.freeze({
    id: parseContentRelationshipId(input["id"]),
    sourceId: readString(input, "sourceId"),
    fromCharacterId: parseContentCharacterId(input["fromCharacterId"]),
    toCharacterId: parseContentCharacterId(input["toCharacterId"]),
    relationshipKind: readM3RelationshipKind(input, "relationshipKind"),
    intensityBps: readIntegerInRange(input, "intensityBps", 0, 10000),
    claimLabel: readM3ClaimLabel(input, "claimLabel")
  });
}

function parseRuntimeM3Office(input: unknown): RuntimeM3OfficeDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 office.");
  }
  const landedPowerId = readNullablePositiveInteger(input, "landedPowerId");
  return Object.freeze({
    id: parseContentOfficeId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    jurisdictionKind: readM3OfficeJurisdictionKind(input, "jurisdictionKind"),
    jurisdictionSourceId: readString(input, "jurisdictionSourceId"),
    currentHolderCharacterId: parseContentCharacterId(input["currentHolderCharacterId"]),
    policyId: parseContentOfficePolicyId(input["policyId"]),
    landedPowerId: landedPowerId === null ? null : parseContentLandedPowerId(landedPowerId),
    appointmentEligibility: parseRuntimeM3AppointmentEligibility(
      readRecord(input, "appointmentEligibility")
    )
  });
}

function parseRuntimeM3AppointmentEligibility(
  input: Record<string, unknown>
): RuntimeM3AppointmentEligibilityV0 {
  const requiredArchetype = readNullableString(input, "requiredArchetype");
  return Object.freeze({
    minimumAdministrationBps: readIntegerInRange(input, "minimumAdministrationBps", 0, 10000),
    minimumCommandBps: readIntegerInRange(input, "minimumCommandBps", 0, 10000),
    minimumLegitimacyBps: readIntegerInRange(input, "minimumLegitimacyBps", 0, 10000),
    requiredArchetype:
      requiredArchetype === null
        ? null
        : readM3CharacterArchetype({ requiredArchetype }, "requiredArchetype")
  });
}

function parseRuntimeM3LandedPower(input: unknown): RuntimeM3LandedPowerDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 landed power.");
  }
  return Object.freeze({
    id: parseContentLandedPowerId(input["id"]),
    sourceId: readString(input, "sourceId"),
    districtSourceId: readString(input, "districtSourceId"),
    extractionRightsBps: readIntegerInRange(input, "extractionRightsBps", 0, 10000),
    levyRightsBps: readIntegerInRange(input, "levyRightsBps", 0, 10000),
    successionWeightBps: readIntegerInRange(input, "successionWeightBps", 0, 10000)
  });
}

function parseRuntimeM3OfficePolicy(input: unknown): RuntimeM3OfficePolicyDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 office policy.");
  }
  if (input["persistsAcrossHolderChange"] !== true) {
    throw new Error("Expected runtime M3 office policy persistence marker.");
  }
  return Object.freeze({
    id: parseContentOfficePolicyId(input["id"]),
    sourceId: readString(input, "sourceId"),
    displayNameKey: readString(input, "displayNameKey"),
    appointmentMode: readM3OfficeAppointmentMode(input, "appointmentMode"),
    taxAutonomyBps: readIntegerInRange(input, "taxAutonomyBps", 0, 10000),
    militaryAutonomyBps: readIntegerInRange(input, "militaryAutonomyBps", 0, 10000),
    persistsAcrossHolderChange: true,
    enfeoffmentHookIds: Object.freeze(
      readArray(input, "enfeoffmentHookIds").map(parseContentEnfeoffmentHookId)
    )
  });
}

function parseRuntimeM3EnfeoffmentHook(input: unknown): RuntimeM3EnfeoffmentHookDefinitionV0 {
  if (!isRecord(input)) {
    throw new Error("Expected valid runtime M3 enfeoffment hook.");
  }
  return Object.freeze({
    id: parseContentEnfeoffmentHookId(input["id"]),
    sourceId: readString(input, "sourceId"),
    trigger: readM3EnfeoffmentTrigger(input, "trigger"),
    effectKey: readString(input, "effectKey")
  });
}

function parseRuntimeM3Requirement(
  input: Record<string, unknown>
): RuntimeM3ObligationRequirementV0 {
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
  throw new Error("Expected valid runtime M3 requirement.");
}

function parseRuntimeM3Due(input: Record<string, unknown>): RuntimeM3ObligationDueV0 {
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
  throw new Error("Expected valid runtime M3 due.");
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

function freezeM3Manifest(
  manifest: RuntimeM3PolityVassalageContentManifestV0
): RuntimeM3PolityVassalageContentManifestV0 {
  return Object.freeze(manifest);
}

function freezeM3CharacterOfficeManifest(
  manifest: RuntimeM3CharacterOfficeContentManifestV0
): RuntimeM3CharacterOfficeContentManifestV0 {
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

function validateNullableStringUnion(
  record: Record<string, unknown>,
  key: string,
  path: string,
  allowedValues: readonly string[],
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (value === null || (typeof value === "string" && allowedValues.includes(value))) {
    return;
  }

  errors.push({ path, message: `${path} must be null or one of ${allowedValues.join(", ")}.` });
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

function validatePositiveIntegerValue(
  value: unknown,
  path: string,
  errors: RuntimeValidationError[]
): void {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return;
  }

  errors.push({ path, message: `${path} must be a positive safe integer.` });
}

function validateNullablePositiveIntegerField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: RuntimeValidationError[]
): void {
  const value = record[key];
  if (value === null || (typeof value === "number" && Number.isSafeInteger(value) && value > 0)) {
    return;
  }

  errors.push({ path, message: `${path} must be null or a positive safe integer.` });
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

function findM3SuzerainCycle(polities: readonly unknown[]): number | null {
  const suzerainByPolityId = new Map<number, number>();
  const polityIds: number[] = [];
  for (const polity of polities) {
    if (!isRecord(polity)) {
      continue;
    }
    const polityId = readPositiveInteger(polity, "id");
    polityIds.push(polityId);
    const suzerainId = readNullablePositiveInteger(polity, "directSuzerainPolityId");
    if (suzerainId !== null) {
      suzerainByPolityId.set(polityId, suzerainId);
    }
  }

  for (const polityId of polityIds.sort(compareNumber)) {
    const visited = new Set<number>();
    let current: number | undefined = polityId;
    while (current !== undefined) {
      if (visited.has(current)) {
        return current;
      }
      visited.add(current);
      current = suzerainByPolityId.get(current);
    }
  }

  return null;
}

function findM3ParentCycle(relationships: readonly unknown[]): number | null {
  const parentByChildId = new Map<number, number[]>();
  const characterIds = new Set<number>();
  for (const relationship of relationships) {
    if (!isRecord(relationship) || readString(relationship, "relationshipKind") !== "parent") {
      continue;
    }
    const parentId = readPositiveInteger(relationship, "fromCharacterId");
    const childId = readPositiveInteger(relationship, "toCharacterId");
    characterIds.add(parentId);
    characterIds.add(childId);
    const parents = parentByChildId.get(childId) ?? [];
    parents.push(parentId);
    parentByChildId.set(childId, parents);
  }

  const visiting = new Set<number>();
  const done = new Set<number>();
  const visit = (characterId: number): number | null => {
    if (visiting.has(characterId)) {
      return characterId;
    }
    if (done.has(characterId)) {
      return null;
    }
    visiting.add(characterId);
    const parents = parentByChildId.get(characterId) ?? [];
    for (const parentId of sortNumber(parents)) {
      const cycleId = visit(parentId);
      if (cycleId !== null) {
        return cycleId;
      }
    }
    visiting.delete(characterId);
    done.add(characterId);
    return null;
  };

  for (const characterId of sortNumber([...characterIds])) {
    const cycleId = visit(characterId);
    if (cycleId !== null) {
      return cycleId;
    }
  }

  return null;
}

function compareNumber(left: number, right: number): number {
  return left - right;
}

function sortNumber(values: readonly number[]): readonly number[] {
  return [...values].sort(compareNumber);
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

function readNullablePositiveInteger(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  if (value === null) {
    return null;
  }

  return parsePositiveInteger(value, key);
}

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value === null || typeof value === "string") {
    return value;
  }

  throw new Error(`${key} must be null or a string.`);
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

function formatRuntimeErrors(errors: readonly RuntimeValidationError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

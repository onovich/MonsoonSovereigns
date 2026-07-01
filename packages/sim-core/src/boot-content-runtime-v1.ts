import {
  createM2EconomyPopulationStateV0,
  createM6PolicyEventRuntimeStateV0,
  createMapTopologyDefinitionV1,
  createStrategicTerrainDefinitionV1,
  createWorldStateV0,
  defineDistrict,
  defineRoute,
  defineSettlement,
  parseGameDay,
  parseM6PolicyDefinitionId,
  parseM6PolicyEventDefinitionId,
  validateWorldStateV0,
  type M6PolicyEventRuntimeStateV0,
  type WorldStateV0
} from "./world-state-v0.ts";

export type ContentBootErrorCodeV1 = "invalid-content-pack" | "invariant-violation";

export interface ContentBootErrorV1 {
  readonly code: ContentBootErrorCodeV1;
  readonly path: string;
  readonly message: string;
}

export type BootWorldStateFromRuntimeContentPackV1Result =
  | {
      readonly status: "booted";
      readonly world: WorldStateV0;
    }
  | {
      readonly status: "rejected";
      readonly error: ContentBootErrorV1;
    };

interface RuntimeM2WorldBootPackV0 {
  readonly manifest: {
    readonly manifestHash: string;
  };
  readonly districts: readonly RuntimeM2DistrictBootDefinitionV0[];
  readonly settlements: readonly RuntimeM2SettlementBootDefinitionV0[];
  readonly regionalSeasonalCurves: readonly RuntimeM2CurveBootDefinitionV0[];
  readonly routes: readonly RuntimeM2RouteBootDefinitionV0[];
  readonly topology: RuntimeM2TopologyBootDefinitionV0;
  readonly strategicTerrain?: RuntimeM2StrategicTerrainBootDefinitionV0;
  readonly m6PolicyEvents?: M6PolicyEventRuntimeStateV0;
}

interface RuntimeM2DistrictBootDefinitionV0 {
  readonly id: number;
  readonly displayNameKey: string;
  readonly regionalCurveId: number;
  readonly mapGeometryId: number;
}

interface RuntimeM2SettlementBootDefinitionV0 {
  readonly id: number;
  readonly displayNameKey: string;
  readonly districtId: number;
  readonly mapGeometryId: number;
}

interface RuntimeM2RouteBootDefinitionV0 {
  readonly id: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly routeKind: "coast" | "river" | "road";
  readonly baseTravelCost: number;
}

interface RuntimeM2CurveBootDefinitionV0 {
  readonly id: number;
  readonly monthlyValues: readonly RuntimeM2CurveMonthBootDefinitionV0[];
}

interface RuntimeM2CurveMonthBootDefinitionV0 {
  readonly month: number;
  readonly monsoonIntensityBps: number;
  readonly agricultureWorkBps: number;
  readonly riverNavigabilityBps: number;
  readonly roadTravelCostBps: number;
}

interface RuntimeM2MapGeometryBootDefinitionV0 {
  readonly id: number;
  readonly ownerKind: "district" | "settlement";
  readonly ownerId: number;
}

interface RuntimeM2TopologyBootDefinitionV0 {
  readonly explicitIsolations: readonly RuntimeM2TopologyIsolationBootDefinitionV0[];
  readonly districts: readonly RuntimeM2TopologyDistrictBootDefinitionV0[];
  readonly routeNodes: readonly RuntimeM2TopologyRouteNodeBootDefinitionV0[];
  readonly routeEdges: readonly RuntimeM2TopologyRouteEdgeBootDefinitionV0[];
}

interface RuntimeM2TopologyIsolationBootDefinitionV0 {
  readonly districtId: number;
  readonly reasonCode: string;
}

interface RuntimeM2TopologyPointBootDefinitionV0 {
  readonly x: number;
  readonly y: number;
}

interface RuntimeM2TopologyMetadataBootDefinitionV0 {
  readonly historicity: "COMPOSITE" | "FICTIONAL";
  readonly terrainClass:
    | "coastal"
    | "lowland"
    | "pass"
    | "riverine"
    | "upland"
    | "urban"
    | "unknown";
  readonly riskClass: "contested" | "hazardous" | "low" | "seasonal" | "unknown";
}

interface RuntimeM2TopologyDistrictBootDefinitionV0 {
  readonly districtId: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly anchor: RuntimeM2TopologyPointBootDefinitionV0;
  readonly polygon: readonly RuntimeM2TopologyPointBootDefinitionV0[];
  readonly metadata: RuntimeM2TopologyMetadataBootDefinitionV0;
}

interface RuntimeM2TopologyRouteNodeBootDefinitionV0 {
  readonly nodeId: string;
  readonly nodeKind: "pass" | "port" | "special" | "warehouse";
  readonly districtId: number;
  readonly displayNameKey: string;
  readonly anchor: RuntimeM2TopologyPointBootDefinitionV0;
}

type RuntimeM2TopologyRouteEndpointBootDefinitionV0 =
  | { readonly kind: "district"; readonly districtId: number }
  | { readonly kind: "route-node"; readonly nodeId: string }
  | { readonly kind: "settlement"; readonly settlementId: number };

interface RuntimeM2TopologySeasonalityBootDefinitionV0 {
  readonly month: number;
  readonly costMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly reasonCodes: readonly string[];
}

type RuntimeM2TopologyAvailabilityBootDefinitionV0 =
  | { readonly kind: "blocked"; readonly reasonCode: string }
  | { readonly kind: "open" }
  | { readonly kind: "unknown"; readonly reasonCode: string };

interface RuntimeM2TopologyRouteEdgeBootDefinitionV0 {
  readonly routeId: number;
  readonly sourceId: string;
  readonly from: RuntimeM2TopologyRouteEndpointBootDefinitionV0;
  readonly to: RuntimeM2TopologyRouteEndpointBootDefinitionV0;
  readonly mode: "coast" | "river" | "road";
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly seasonality: readonly RuntimeM2TopologySeasonalityBootDefinitionV0[];
  readonly availability: RuntimeM2TopologyAvailabilityBootDefinitionV0;
  readonly metadata: RuntimeM2TopologyMetadataBootDefinitionV0;
}

type RuntimeM2StrategicTerrainHistoricityBootDefinitionV0 =
  | "COMPOSITE"
  | "FICTIONAL"
  | "HISTORICAL"
  | "INFERRED";
type RuntimeM2StrategicTerrainClassBootDefinitionV0 =
  | "coastal"
  | "lowland"
  | "pass"
  | "ridge"
  | "river-basin"
  | "riverine"
  | "upland"
  | "urban"
  | "wetland"
  | "unknown";
type RuntimeM2StrategicTerrainRiskClassBootDefinitionV0 =
  | "contested"
  | "hazardous"
  | "low"
  | "seasonal"
  | "unknown";
type RuntimeM2StrategicTerrainSeasonStateBootDefinitionV0 =
  | "dry"
  | "monsoon"
  | "transition"
  | "unknown";
type RuntimeM2BarrierChannelKindBootDefinitionV0 =
  | "coast"
  | "major-river"
  | "ridge"
  | "strait"
  | "wetland";
type RuntimeM2BarrierTraversalRuleBootDefinitionV0 =
  | "blocks-without-explicit-corridor"
  | "channels-explicit-corridors";
type RuntimeM2StrategicNodeKindBootDefinitionV0 =
  | "castle"
  | "crossing"
  | "objective"
  | "pass"
  | "port"
  | "staging-area"
  | "town"
  | "warehouse";
type RuntimeM2StrategicNodeKnownStateBootDefinitionV0 = "known" | "rumored" | "unknown";
type RuntimeM2RouteCorridorModeBootDefinitionV0 = "coast" | "mixed" | "pass" | "river" | "road";
type RuntimeM2RouteCorridorWidthClassBootDefinitionV0 = "narrow" | "standard" | "wide";
type RuntimeM2StrategicTerrainAuthorityProhibitionBootDefinitionV0 =
  | "bounding-box-adjacency"
  | "centroid-proximity"
  | "hidden-grid"
  | "hidden-lattice"
  | "hex-axial-or-cube"
  | "renderer-only-line-reachability"
  | "sequential-id-reachability";

interface RuntimeM2StrategicTerrainPointBootDefinitionV0 {
  readonly x: number;
  readonly y: number;
}

interface RuntimeM2TerrainPatchBootDefinitionV0 {
  readonly patchId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly terrainClass: RuntimeM2StrategicTerrainClassBootDefinitionV0;
  readonly seasonSensitivity: RuntimeM2StrategicTerrainSeasonStateBootDefinitionV0;
  readonly historicity: RuntimeM2StrategicTerrainHistoricityBootDefinitionV0;
  readonly polygon: readonly RuntimeM2StrategicTerrainPointBootDefinitionV0[];
  readonly explanationTags: readonly string[];
}

interface RuntimeM2BarrierChannelBootDefinitionV0 {
  readonly channelId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly channelKind: RuntimeM2BarrierChannelKindBootDefinitionV0;
  readonly traversalRule: RuntimeM2BarrierTraversalRuleBootDefinitionV0;
  readonly historicity: RuntimeM2StrategicTerrainHistoricityBootDefinitionV0;
  readonly points: readonly RuntimeM2StrategicTerrainPointBootDefinitionV0[];
  readonly explanationTags: readonly string[];
}

interface RuntimeM2StrategicNodeBootDefinitionV0 {
  readonly nodeId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly nodeKind: RuntimeM2StrategicNodeKindBootDefinitionV0;
  readonly districtId: number;
  readonly anchor: RuntimeM2StrategicTerrainPointBootDefinitionV0;
  readonly localCapacity: number;
  readonly knownState: RuntimeM2StrategicNodeKnownStateBootDefinitionV0;
  readonly terrainPatchIds: readonly string[];
  readonly barrierChannelIds: readonly string[];
  readonly governanceFootprintIds: readonly string[];
  readonly explanationTags: readonly string[];
}

interface RuntimeM2RouteCorridorSeasonalModifierBootDefinitionV0 {
  readonly month: number;
  readonly seasonState: RuntimeM2StrategicTerrainSeasonStateBootDefinitionV0;
  readonly travelCostMultiplierBps: number;
  readonly capacityMultiplierBps: number;
  readonly riskBps: number;
  readonly reasonCodes: readonly string[];
}

type RuntimeM2RouteCorridorAvailabilityBootDefinitionV0 =
  | { readonly kind: "blocked"; readonly reasonCode: string }
  | { readonly kind: "open" }
  | { readonly kind: "unknown"; readonly reasonCode: string };

interface RuntimeM2RouteCorridorBootDefinitionV0 {
  readonly corridorId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly fromNodeId: string;
  readonly toNodeId: string;
  readonly mode: RuntimeM2RouteCorridorModeBootDefinitionV0;
  readonly widthClass: RuntimeM2RouteCorridorWidthClassBootDefinitionV0;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
  readonly riskClass: RuntimeM2StrategicTerrainRiskClassBootDefinitionV0;
  readonly terrainPatchIds: readonly string[];
  readonly barrierChannelIds: readonly string[];
  readonly governanceFootprintIds: readonly string[];
  readonly seasonality: readonly RuntimeM2RouteCorridorSeasonalModifierBootDefinitionV0[];
  readonly availability: RuntimeM2RouteCorridorAvailabilityBootDefinitionV0;
  readonly polyline: readonly RuntimeM2StrategicTerrainPointBootDefinitionV0[];
  readonly explanationTags: readonly string[];
}

interface RuntimeM2DistrictGovernanceFootprintBootDefinitionV0 {
  readonly footprintId: string;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly districtId: number;
  readonly overlayOnly: true;
  readonly polygon: readonly RuntimeM2StrategicTerrainPointBootDefinitionV0[];
  readonly governanceTags: readonly string[];
  readonly consequenceTags: readonly string[];
}

interface RuntimeM2StrategicTerrainBootDefinitionV0 {
  readonly contentManifestHash: string;
  readonly authorityProhibitions: readonly RuntimeM2StrategicTerrainAuthorityProhibitionBootDefinitionV0[];
  readonly terrainPatches: readonly RuntimeM2TerrainPatchBootDefinitionV0[];
  readonly barrierChannels: readonly RuntimeM2BarrierChannelBootDefinitionV0[];
  readonly strategicNodes: readonly RuntimeM2StrategicNodeBootDefinitionV0[];
  readonly routeCorridors: readonly RuntimeM2RouteCorridorBootDefinitionV0[];
  readonly districtGovernanceFootprints: readonly RuntimeM2DistrictGovernanceFootprintBootDefinitionV0[];
}

const STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS: readonly RuntimeM2StrategicTerrainAuthorityProhibitionBootDefinitionV0[] =
  [
    "bounding-box-adjacency",
    "centroid-proximity",
    "hidden-grid",
    "hidden-lattice",
    "hex-axial-or-cube",
    "renderer-only-line-reachability",
    "sequential-id-reachability"
  ];

type BootPackParseResult =
  | { readonly ok: true; readonly value: RuntimeM2WorldBootPackV0 }
  | { readonly ok: false; readonly error: ContentBootErrorV1 };
type BootPackErrorResult = { readonly ok: false; readonly error: ContentBootErrorV1 };
type PolicyEventParseResult =
  | { readonly ok: true; readonly value: M6PolicyEventRuntimeStateV0 }
  | { readonly ok: false; readonly error: ContentBootErrorV1 };

export function bootWorldStateFromRuntimeContentPackV1(input: {
  readonly seed: unknown;
  readonly runtimeContentPack: unknown;
}): BootWorldStateFromRuntimeContentPackV1Result {
  const seed = parseNonnegativeSafeInteger(input.seed, "seed");
  if (!seed.ok) {
    return { status: "rejected", error: seed.error };
  }

  const parsedPack = parseRuntimeM2WorldBootPackV0(input.runtimeContentPack);
  if (!parsedPack.ok) {
    return { status: "rejected", error: parsedPack.error };
  }

  const definitionsWithoutTopology = {
    polities: [],
    persons: [],
    districts: parsedPack.value.districts.map((district) =>
      defineDistrict({
        id: district.id,
        displayNameKey: district.displayNameKey
      })
    ),
    settlements: parsedPack.value.settlements.map((settlement) =>
      defineSettlement({
        id: settlement.id,
        displayNameKey: settlement.displayNameKey,
        districtId: settlement.districtId
      })
    ),
    routes: parsedPack.value.routes.map((route) =>
      defineRoute({
        id: route.id,
        fromDistrictId: route.fromDistrictId,
        toDistrictId: route.toDistrictId,
        lengthInMapUnits: route.baseTravelCost
      })
    )
  };
  const definitions = {
    ...definitionsWithoutTopology,
    topology: createMapTopologyDefinitionV1({
      contentManifestHash: parsedPack.value.manifest.manifestHash,
      districts: parsedPack.value.topology.districts,
      routeNodes: parsedPack.value.topology.routeNodes,
      routeEdges: parsedPack.value.topology.routeEdges
    }),
    ...(parsedPack.value.strategicTerrain === undefined
      ? {}
      : {
          strategicTerrain: createStrategicTerrainDefinitionV1(parsedPack.value.strategicTerrain)
        })
  };
  const world = createWorldStateV0({
    seed: seed.value,
    contentManifestHash: parsedPack.value.manifest.manifestHash,
    currentDay: 0,
    revision: 0,
    definitions,
    m2: createM2EconomyPopulationStateV0(definitions, {
      routes: parsedPack.value.routes.map((route) => ({
        routeId: route.id,
        fromDistrictId: route.fromDistrictId,
        toDistrictId: route.toDistrictId,
        routeKind: route.routeKind,
        baseTravelCost: route.baseTravelCost,
        baseCapacity: baseCapacityForRouteKind(route.routeKind)
      })),
      districtSeasonality: parsedPack.value.districts.map((district) => ({
        districtId: district.id,
        regionalCurveId: district.regionalCurveId
      })),
      regionalCurves: parsedPack.value.regionalSeasonalCurves.map((curve) => ({
        id: curve.id,
        monthlyValues: curve.monthlyValues
      }))
    }),
    ...(parsedPack.value.m6PolicyEvents === undefined
      ? {}
      : { m6PolicyEvents: parsedPack.value.m6PolicyEvents })
  });

  const invariantErrors = validateWorldStateV0(world);
  const firstInvariantError = invariantErrors[0];
  if (firstInvariantError !== undefined) {
    return {
      status: "rejected",
      error: {
        code: "invariant-violation",
        path: firstInvariantError.path,
        message: firstInvariantError.message
      }
    };
  }

  return {
    status: "booted",
    world
  };
}

function parseRuntimeM2WorldBootPackV0(input: unknown): BootPackParseResult {
  if (!isRecord(input)) {
    return contentPackError("$", "Runtime M2 world content pack must be an object.");
  }

  const rootError = validateRuntimeM2WorldRoot(input);
  if (rootError !== null) {
    return rootError;
  }

  const manifest = input["manifest"];
  if (!isRecord(manifest)) {
    return contentPackError("runtimeContentPack.manifest", "manifest must be an object.");
  }

  const districts = parseDistricts(readArray(input, "districts"), "runtimeContentPack.districts");
  if (!districts.ok) {
    return districts;
  }

  const settlements = parseSettlements(
    readArray(input, "settlements"),
    "runtimeContentPack.settlements"
  );
  if (!settlements.ok) {
    return settlements;
  }

  const curves = parseCurves(
    readArray(input, "regionalSeasonalCurves"),
    "runtimeContentPack.regionalSeasonalCurves"
  );
  if (!curves.ok) {
    return curves;
  }

  const routes = parseRoutes(readArray(input, "routes"), "runtimeContentPack.routes");
  if (!routes.ok) {
    return routes;
  }

  const geometries = parseMapGeometries(
    readArray(input, "mapGeometries"),
    "runtimeContentPack.mapGeometries"
  );
  if (!geometries.ok) {
    return geometries;
  }

  const topology = parseTopology(readRecord(input, "topology"), "runtimeContentPack.topology");
  if (!topology.ok) {
    return topology;
  }

  const strategicTerrain =
    input["strategicTerrain"] === undefined
      ? undefined
      : parseStrategicTerrain(
          readRecord(input, "strategicTerrain"),
          "runtimeContentPack.strategicTerrain"
        );
  if (strategicTerrain !== undefined && !strategicTerrain.ok) {
    return strategicTerrain;
  }

  const semanticError = validateRuntimeM2WorldBootSemantics({
    fixtureId: readString(input, "fixtureId"),
    manifest,
    districts: districts.value,
    settlements: settlements.value,
    curves: curves.value,
    routes: routes.value,
    geometries: geometries.value,
    topology: topology.value,
    ...(strategicTerrain === undefined ? {} : { strategicTerrain: strategicTerrain.value })
  });
  if (semanticError !== null) {
    return semanticError;
  }
  const policyEvents =
    input["m6PolicyEvents"] === undefined
      ? undefined
      : parseM6PolicyEvents(input["m6PolicyEvents"]);
  if (policyEvents !== undefined && !policyEvents.ok) {
    return policyEvents;
  }

  return {
    ok: true,
    value: {
      manifest: {
        manifestHash: readString(manifest, "manifestHash")
      },
      districts: districts.value,
      settlements: settlements.value,
      regionalSeasonalCurves: curves.value,
      routes: routes.value,
      topology: topology.value,
      ...(strategicTerrain === undefined ? {} : { strategicTerrain: strategicTerrain.value }),
      ...(policyEvents === undefined ? {} : { m6PolicyEvents: policyEvents.value })
    }
  };
}

function validateRuntimeM2WorldRoot(input: Record<string, unknown>): BootPackErrorResult | null {
  if (input["schemaVersion"] !== 1) {
    return contentPackError("runtimeContentPack.schemaVersion", "schemaVersion must be 1.");
  }

  if (input["kind"] !== "runtime-m2-world-content-pack-v0") {
    return contentPackError(
      "runtimeContentPack.kind",
      "kind must be runtime-m2-world-content-pack-v0."
    );
  }

  const fixtureId = parseNonEmptyString(input["fixtureId"], "runtimeContentPack.fixtureId");
  if (!fixtureId.ok) {
    return fixtureId;
  }

  const manifest = input["manifest"];
  if (!isRecord(manifest)) {
    return contentPackError("runtimeContentPack.manifest", "manifest must be an object.");
  }

  const manifestError = validateManifest(manifest);
  if (manifestError !== null) {
    return manifestError;
  }

  for (const key of [
    "districts",
    "settlements",
    "regionalSeasonalCurves",
    "routes",
    "mapGeometries"
  ]) {
    if (!Array.isArray(input[key])) {
      return contentPackError(`runtimeContentPack.${key}`, `${key} must be an array.`);
    }
  }
  if (!isRecord(input["topology"])) {
    return contentPackError("runtimeContentPack.topology", "topology must be an object.");
  }
  if (input["strategicTerrain"] !== undefined && !isRecord(input["strategicTerrain"])) {
    return contentPackError(
      "runtimeContentPack.strategicTerrain",
      "strategicTerrain must be an object."
    );
  }

  return null;
}

function parseM6PolicyEvents(input: unknown): PolicyEventParseResult {
  if (!isRecord(input)) {
    return contentPackError(
      "runtimeContentPack.m6PolicyEvents",
      "m6PolicyEvents must be an object."
    );
  }
  const keyError = validateM6ExactKeys(
    input,
    ["schemaVersion", "kind", "fixtureId", "manifest", "policies", "events"],
    "runtimeContentPack.m6PolicyEvents"
  );
  if (keyError !== null) {
    return keyError;
  }
  if (input["schemaVersion"] !== 1) {
    return contentPackError(
      "runtimeContentPack.m6PolicyEvents.schemaVersion",
      "m6PolicyEvents schemaVersion must be 1."
    );
  }
  if (input["kind"] !== "runtime-m6-policy-event-content-pack-v0") {
    return contentPackError(
      "runtimeContentPack.m6PolicyEvents.kind",
      "m6PolicyEvents kind must be runtime-m6-policy-event-content-pack-v0."
    );
  }
  const policies = parseM6Policies(
    readArray(input, "policies"),
    "runtimeContentPack.m6PolicyEvents.policies"
  );
  if (!policies.ok) {
    return policies;
  }
  const events = parseM6Events(
    readArray(input, "events"),
    "runtimeContentPack.m6PolicyEvents.events"
  );
  if (!events.ok) {
    return events;
  }
  const policyIds = new Set(policies.value.map((policy) => policy.policyId));
  for (let eventIndex = 0; eventIndex < events.value.length; eventIndex += 1) {
    const event = events.value[eventIndex];
    if (event === undefined) {
      return contentPackError(
        `runtimeContentPack.m6PolicyEvents.events[${eventIndex}]`,
        "M6 event is missing."
      );
    }
    for (let optionIndex = 0; optionIndex < event.options.length; optionIndex += 1) {
      const option = event.options[optionIndex];
      if (option === undefined) {
        return contentPackError(
          `runtimeContentPack.m6PolicyEvents.events[${eventIndex}].options[${optionIndex}]`,
          "M6 event option is missing."
        );
      }
      for (
        let consequenceIndex = 0;
        consequenceIndex < option.consequences.length;
        consequenceIndex += 1
      ) {
        const consequence = option.consequences[consequenceIndex];
        if (consequence === undefined || !policyIds.has(consequence.policyId)) {
          return contentPackError(
            `runtimeContentPack.m6PolicyEvents.events[${eventIndex}].options[${optionIndex}].consequences[${consequenceIndex}].policyId`,
            "M6 policy event consequence references a missing policy."
          );
        }
      }
    }
  }
  return {
    ok: true,
    value: createM6PolicyEventRuntimeStateV0({
      definitions: {
        policies: policies.value,
        events: events.value
      }
    })
  };
}

function parseM6Policies(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: M6PolicyEventRuntimeStateV0["definitions"]["policies"] }
  | BootPackErrorResult {
  const policies: M6PolicyEventRuntimeStateV0["definitions"]["policies"][number][] = [];
  let previousId = 0;
  const seen = new Set<number>();
  for (let index = 0; index < values.length; index += 1) {
    const entryPath = `${path}[${index}]`;
    const value = values[index];
    if (!isRecord(value)) {
      return contentPackError(entryPath, "M6 policy definition must be an object.");
    }
    const keyError = validateM6ExactKeys(
      value,
      ["policyId", "sourceId", "displayNameKey", "reasonCodes", "encyclopediaRefs"],
      entryPath
    );
    if (keyError !== null) {
      return keyError;
    }
    const policyId = parseOrderedUniqueId(
      value["policyId"],
      previousId,
      seen,
      `${entryPath}.policyId`
    );
    if (!policyId.ok) {
      return policyId;
    }
    previousId = policyId.value;
    const sourceId = parseNonEmptyString(value["sourceId"], `${entryPath}.sourceId`);
    if (!sourceId.ok) {
      return sourceId;
    }
    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    if (!displayNameKey.ok) {
      return displayNameKey;
    }
    const reasonCodes = parseStringArray(value["reasonCodes"], `${entryPath}.reasonCodes`);
    if (!reasonCodes.ok) {
      return reasonCodes;
    }
    const encyclopediaRefs = parseStringArray(
      value["encyclopediaRefs"],
      `${entryPath}.encyclopediaRefs`
    );
    if (!encyclopediaRefs.ok) {
      return encyclopediaRefs;
    }
    policies.push({
      policyId: parseM6PolicyDefinitionId(policyId.value),
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      reasonCodes: reasonCodes.value,
      encyclopediaRefs: encyclopediaRefs.value
    });
  }
  return { ok: true, value: policies };
}

function parseM6Events(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: M6PolicyEventRuntimeStateV0["definitions"]["events"] }
  | BootPackErrorResult {
  const events: M6PolicyEventRuntimeStateV0["definitions"]["events"][number][] = [];
  let previousId = 0;
  const seen = new Set<number>();
  for (let index = 0; index < values.length; index += 1) {
    const entryPath = `${path}[${index}]`;
    const value = values[index];
    if (!isRecord(value)) {
      return contentPackError(entryPath, "M6 event definition must be an object.");
    }
    const keyError = validateM6ExactKeys(
      value,
      [
        "eventDefinitionId",
        "sourceId",
        "displayNameKey",
        "cause",
        "options",
        "reasonCodes",
        "encyclopediaRefs"
      ],
      entryPath
    );
    if (keyError !== null) {
      return keyError;
    }
    const eventDefinitionId = parseOrderedUniqueId(
      value["eventDefinitionId"],
      previousId,
      seen,
      `${entryPath}.eventDefinitionId`
    );
    if (!eventDefinitionId.ok) {
      return eventDefinitionId;
    }
    previousId = eventDefinitionId.value;
    const sourceId = parseNonEmptyString(value["sourceId"], `${entryPath}.sourceId`);
    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    const cause = parseM6Cause(value["cause"], `${entryPath}.cause`);
    const options = parseM6Options(readArray(value, "options"), `${entryPath}.options`);
    const reasonCodes = parseStringArray(value["reasonCodes"], `${entryPath}.reasonCodes`);
    const encyclopediaRefs = parseStringArray(
      value["encyclopediaRefs"],
      `${entryPath}.encyclopediaRefs`
    );
    if (!sourceId.ok) return sourceId;
    if (!displayNameKey.ok) return displayNameKey;
    if (!cause.ok) return cause;
    if (!options.ok) return options;
    if (!reasonCodes.ok) return reasonCodes;
    if (!encyclopediaRefs.ok) return encyclopediaRefs;
    events.push({
      eventDefinitionId: parseM6PolicyEventDefinitionId(eventDefinitionId.value),
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      cause: cause.value,
      options: options.value,
      reasonCodes: reasonCodes.value,
      encyclopediaRefs: encyclopediaRefs.value
    });
  }
  return { ok: true, value: events };
}

function parseM6Cause(
  input: unknown,
  path: string
):
  | {
      readonly ok: true;
      readonly value: M6PolicyEventRuntimeStateV0["definitions"]["events"][number]["cause"];
    }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "M6 event cause must be an object.");
  }
  const keyError = validateM6ExactKeys(input, ["kind", "day", "reasonCodes"], path);
  if (keyError !== null) {
    return keyError;
  }
  if (input["kind"] !== "day-at-least") {
    return contentPackError(`${path}.kind`, "M6 event cause kind must be day-at-least.");
  }
  const day = parseNonnegativeSafeInteger(input["day"], `${path}.day`);
  if (!day.ok) return day;
  const reasonCodes = parseStringArray(input["reasonCodes"], `${path}.reasonCodes`);
  if (!reasonCodes.ok) return reasonCodes;
  return {
    ok: true,
    value: { kind: "day-at-least", day: parseGameDay(day.value), reasonCodes: reasonCodes.value }
  };
}

function parseM6Options(
  values: readonly unknown[],
  path: string
):
  | {
      readonly ok: true;
      readonly value: M6PolicyEventRuntimeStateV0["definitions"]["events"][number]["options"];
    }
  | BootPackErrorResult {
  const options: M6PolicyEventRuntimeStateV0["definitions"]["events"][number]["options"][number][] =
    [];
  let previousId = 0;
  const seen = new Set<number>();
  for (let index = 0; index < values.length; index += 1) {
    const entryPath = `${path}[${index}]`;
    const value = values[index];
    if (!isRecord(value)) return contentPackError(entryPath, "M6 option must be an object.");
    const keyError = validateM6ExactKeys(
      value,
      ["optionId", "displayNameKey", "consequences", "reasonCodes", "encyclopediaRefs"],
      entryPath
    );
    if (keyError !== null) {
      return keyError;
    }
    const optionId = parseOrderedUniqueId(
      value["optionId"],
      previousId,
      seen,
      `${entryPath}.optionId`
    );
    if (!optionId.ok) return optionId;
    previousId = optionId.value;
    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    const consequences = parseM6Consequences(
      readArray(value, "consequences"),
      `${entryPath}.consequences`
    );
    const reasonCodes = parseStringArray(value["reasonCodes"], `${entryPath}.reasonCodes`);
    const encyclopediaRefs = parseStringArray(
      value["encyclopediaRefs"],
      `${entryPath}.encyclopediaRefs`
    );
    if (!displayNameKey.ok) return displayNameKey;
    if (!consequences.ok) return consequences;
    if (!reasonCodes.ok) return reasonCodes;
    if (!encyclopediaRefs.ok) return encyclopediaRefs;
    options.push({
      optionId: optionId.value,
      displayNameKey: displayNameKey.value,
      consequences: consequences.value,
      reasonCodes: reasonCodes.value,
      encyclopediaRefs: encyclopediaRefs.value
    });
  }
  return { ok: true, value: options };
}

function parseM6Consequences(
  values: readonly unknown[],
  path: string
):
  | {
      readonly ok: true;
      readonly value: M6PolicyEventRuntimeStateV0["definitions"]["events"][number]["options"][number]["consequences"];
    }
  | BootPackErrorResult {
  const consequences: M6PolicyEventRuntimeStateV0["definitions"]["events"][number]["options"][number]["consequences"][number][] =
    [];
  for (let index = 0; index < values.length; index += 1) {
    const entryPath = `${path}[${index}]`;
    const value = values[index];
    if (!isRecord(value)) return contentPackError(entryPath, "M6 consequence must be an object.");
    const keyError = validateM6ExactKeys(
      value,
      ["kind", "policyId", "magnitudeBps", "durationDays", "reasonCode"],
      entryPath
    );
    if (keyError !== null) {
      return keyError;
    }
    if (value["kind"] !== "policy-modifier") {
      return contentPackError(`${entryPath}.kind`, "M6 consequence kind must be policy-modifier.");
    }
    const policyId = parsePositiveSafeInteger(value["policyId"], `${entryPath}.policyId`);
    const magnitudeBps = parseIntegerInRange(
      value["magnitudeBps"],
      `${entryPath}.magnitudeBps`,
      -10_000,
      10_000
    );
    const durationDays = parsePositiveSafeInteger(
      value["durationDays"],
      `${entryPath}.durationDays`
    );
    const reasonCode = parseNonEmptyString(value["reasonCode"], `${entryPath}.reasonCode`);
    if (!policyId.ok) return policyId;
    if (!magnitudeBps.ok) return magnitudeBps;
    if (!durationDays.ok) return durationDays;
    if (!reasonCode.ok) return reasonCode;
    consequences.push({
      kind: "policy-modifier",
      policyId: parseM6PolicyDefinitionId(policyId.value),
      magnitudeBps: magnitudeBps.value,
      durationDays: durationDays.value,
      reasonCode: reasonCode.value
    });
  }
  return { ok: true, value: consequences };
}

function validateM6ExactKeys(
  record: Record<string, unknown>,
  allowedKeys: readonly string[],
  path: string
): BootPackErrorResult | null {
  const allowed = new Set(allowedKeys);
  const unexpected = Object.keys(record)
    .filter((key) => !allowed.has(key))
    .sort();
  if (unexpected.length === 0) {
    return null;
  }
  const first = unexpected[0];
  if (first === undefined) {
    return null;
  }
  return contentPackError(`${path}.${first}`, "M6 policy/event runtime field is not allowed.");
}

function validateManifest(manifest: Record<string, unknown>): BootPackErrorResult | null {
  if (manifest["schemaVersion"] !== 1) {
    return contentPackError(
      "runtimeContentPack.manifest.schemaVersion",
      "manifest schemaVersion must be 1."
    );
  }

  const fixtureId = parseNonEmptyString(
    manifest["fixtureId"],
    "runtimeContentPack.manifest.fixtureId"
  );
  if (!fixtureId.ok) {
    return fixtureId;
  }

  if (manifest["fixtureKind"] !== "prototype-world-fixture") {
    return contentPackError(
      "runtimeContentPack.manifest.fixtureKind",
      "manifest fixtureKind must be prototype-world-fixture."
    );
  }

  if (manifest["syntheticScope"] !== "m2-prototype-only") {
    return contentPackError(
      "runtimeContentPack.manifest.syntheticScope",
      "manifest syntheticScope must be m2-prototype-only."
    );
  }

  if (manifest["historicity"] !== "COMPOSITE" && manifest["historicity"] !== "FICTIONAL") {
    return contentPackError(
      "runtimeContentPack.manifest.historicity",
      "manifest historicity must be COMPOSITE or FICTIONAL."
    );
  }

  const manifestHash = manifest["manifestHash"];
  if (typeof manifestHash !== "string" || !/^[0-9a-f]{8}$/u.test(manifestHash)) {
    return contentPackError(
      "runtimeContentPack.manifest.manifestHash",
      "manifestHash must be an 8-character lowercase hexadecimal hash."
    );
  }

  for (const key of [
    "districtCount",
    "settlementCount",
    "regionalSeasonalCurveCount",
    "routeCount",
    "mapGeometryCount"
  ]) {
    const count = parsePositiveSafeInteger(manifest[key], `runtimeContentPack.manifest.${key}`);
    if (!count.ok) {
      return count;
    }
  }

  return null;
}

function parseDistricts(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2DistrictBootDefinitionV0[] }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const districts: RuntimeM2DistrictBootDefinitionV0[] = [];
  let previousId = 0;
  const seen = new Set<number>();

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value)) {
      return contentPackError(entryPath, "Runtime M2 district must be an object.");
    }

    const id = parseOrderedUniqueId(value["id"], previousId, seen, `${entryPath}.id`);
    if (!id.ok) {
      return id;
    }
    previousId = id.value;

    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    if (!displayNameKey.ok) {
      return displayNameKey;
    }

    const regionalCurveId = parsePositiveSafeInteger(
      value["regionalCurveId"],
      `${entryPath}.regionalCurveId`
    );
    if (!regionalCurveId.ok) {
      return regionalCurveId;
    }

    const mapGeometryId = parsePositiveSafeInteger(
      value["mapGeometryId"],
      `${entryPath}.mapGeometryId`
    );
    if (!mapGeometryId.ok) {
      return mapGeometryId;
    }

    districts.push({
      id: id.value,
      displayNameKey: displayNameKey.value,
      regionalCurveId: regionalCurveId.value,
      mapGeometryId: mapGeometryId.value
    });
  }

  return { ok: true, value: districts };
}

function parseSettlements(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2SettlementBootDefinitionV0[] }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const settlements: RuntimeM2SettlementBootDefinitionV0[] = [];
  let previousId = 0;
  const seen = new Set<number>();

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value)) {
      return contentPackError(entryPath, "Runtime M2 settlement must be an object.");
    }

    const id = parseOrderedUniqueId(value["id"], previousId, seen, `${entryPath}.id`);
    if (!id.ok) {
      return id;
    }
    previousId = id.value;

    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    if (!displayNameKey.ok) {
      return displayNameKey;
    }

    const districtId = parsePositiveSafeInteger(value["districtId"], `${entryPath}.districtId`);
    if (!districtId.ok) {
      return districtId;
    }

    const mapGeometryId = parsePositiveSafeInteger(
      value["mapGeometryId"],
      `${entryPath}.mapGeometryId`
    );
    if (!mapGeometryId.ok) {
      return mapGeometryId;
    }

    settlements.push({
      id: id.value,
      displayNameKey: displayNameKey.value,
      districtId: districtId.value,
      mapGeometryId: mapGeometryId.value
    });
  }

  return { ok: true, value: settlements };
}

function parseCurves(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2CurveBootDefinitionV0[] }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const curves: RuntimeM2CurveBootDefinitionV0[] = [];
  let previousId = 0;
  const seen = new Set<number>();

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value)) {
      return contentPackError(entryPath, "Runtime M2 regional seasonal curve must be an object.");
    }

    const id = parseOrderedUniqueId(value["id"], previousId, seen, `${entryPath}.id`);
    if (!id.ok) {
      return id;
    }
    previousId = id.value;

    const monthlyValues = value["monthlyValues"];
    if (!Array.isArray(monthlyValues) || monthlyValues.length !== 12) {
      return contentPackError(
        `${entryPath}.monthlyValues`,
        "monthlyValues must contain 12 months."
      );
    }

    for (let monthIndex = 0; monthIndex < monthlyValues.length; monthIndex += 1) {
      const month = monthlyValues[monthIndex];
      if (!isRecord(month) || month["month"] !== monthIndex + 1) {
        return contentPackError(
          `${entryPath}.monthlyValues[${monthIndex}].month`,
          "monthlyValues must be ordered from month 1 through month 12."
        );
      }
    }

    const parsedMonthlyValues: RuntimeM2CurveMonthBootDefinitionV0[] = [];
    for (let monthIndex = 0; monthIndex < monthlyValues.length; monthIndex += 1) {
      const month = monthlyValues[monthIndex];
      const monthPath = `${entryPath}.monthlyValues[${monthIndex}]`;
      if (!isRecord(month)) {
        return contentPackError(monthPath, "Runtime M2 seasonal month must be an object.");
      }

      const monsoonIntensityBps = parseIntegerInRange(
        month["monsoonIntensityBps"],
        `${monthPath}.monsoonIntensityBps`,
        0,
        10_000
      );
      if (!monsoonIntensityBps.ok) {
        return monsoonIntensityBps;
      }

      const agricultureWorkBps = parseIntegerInRange(
        month["agricultureWorkBps"],
        `${monthPath}.agricultureWorkBps`,
        0,
        10_000
      );
      if (!agricultureWorkBps.ok) {
        return agricultureWorkBps;
      }

      const riverNavigabilityBps = parseIntegerInRange(
        month["riverNavigabilityBps"],
        `${monthPath}.riverNavigabilityBps`,
        0,
        10_000
      );
      if (!riverNavigabilityBps.ok) {
        return riverNavigabilityBps;
      }

      const roadTravelCostBps = parseIntegerInRange(
        month["roadTravelCostBps"],
        `${monthPath}.roadTravelCostBps`,
        1,
        30_000
      );
      if (!roadTravelCostBps.ok) {
        return roadTravelCostBps;
      }

      parsedMonthlyValues.push({
        month: monthIndex + 1,
        monsoonIntensityBps: monsoonIntensityBps.value,
        agricultureWorkBps: agricultureWorkBps.value,
        riverNavigabilityBps: riverNavigabilityBps.value,
        roadTravelCostBps: roadTravelCostBps.value
      });
    }

    curves.push({ id: id.value, monthlyValues: parsedMonthlyValues });
  }

  return { ok: true, value: curves };
}

function parseRoutes(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2RouteBootDefinitionV0[] }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const routes: RuntimeM2RouteBootDefinitionV0[] = [];
  let previousId = 0;
  const seen = new Set<number>();

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value)) {
      return contentPackError(entryPath, "Runtime M2 route must be an object.");
    }

    const id = parseOrderedUniqueId(value["id"], previousId, seen, `${entryPath}.id`);
    if (!id.ok) {
      return id;
    }
    previousId = id.value;

    const fromDistrictId = parsePositiveSafeInteger(
      value["fromDistrictId"],
      `${entryPath}.fromDistrictId`
    );
    if (!fromDistrictId.ok) {
      return fromDistrictId;
    }

    const toDistrictId = parsePositiveSafeInteger(
      value["toDistrictId"],
      `${entryPath}.toDistrictId`
    );
    if (!toDistrictId.ok) {
      return toDistrictId;
    }

    const baseTravelCost = parsePositiveSafeInteger(
      value["baseTravelCost"],
      `${entryPath}.baseTravelCost`
    );
    if (!baseTravelCost.ok) {
      return baseTravelCost;
    }

    const routeKind = value["routeKind"];
    if (routeKind !== "coast" && routeKind !== "river" && routeKind !== "road") {
      return contentPackError(`${entryPath}.routeKind`, "routeKind must be coast, river, or road.");
    }

    routes.push({
      id: id.value,
      fromDistrictId: fromDistrictId.value,
      toDistrictId: toDistrictId.value,
      routeKind,
      baseTravelCost: baseTravelCost.value
    });
  }

  return { ok: true, value: routes };
}

function parseMapGeometries(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2MapGeometryBootDefinitionV0[] }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const geometries: RuntimeM2MapGeometryBootDefinitionV0[] = [];
  let previousId = 0;
  const seen = new Set<number>();

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value)) {
      return contentPackError(entryPath, "Runtime M2 map geometry must be an object.");
    }

    const id = parseOrderedUniqueId(value["id"], previousId, seen, `${entryPath}.id`);
    if (!id.ok) {
      return id;
    }
    previousId = id.value;

    const ownerKind = value["ownerKind"];
    if (ownerKind !== "district" && ownerKind !== "settlement") {
      return contentPackError(
        `${entryPath}.ownerKind`,
        "ownerKind must be district or settlement."
      );
    }

    const ownerId = parsePositiveSafeInteger(value["ownerId"], `${entryPath}.ownerId`);
    if (!ownerId.ok) {
      return ownerId;
    }

    geometries.push({
      id: id.value,
      ownerKind,
      ownerId: ownerId.value
    });
  }

  return { ok: true, value: geometries };
}

function parseTopology(
  input: Record<string, unknown>,
  path: string
): { readonly ok: true; readonly value: RuntimeM2TopologyBootDefinitionV0 } | BootPackErrorResult {
  if (input["adjacencyDerivation"] !== "explicit-route-graph-v1") {
    return contentPackError(
      `${path}.adjacencyDerivation`,
      "adjacencyDerivation must be explicit-route-graph-v1."
    );
  }

  const explicitIsolations = parseTopologyIsolations(
    readArray(input, "explicitIsolations"),
    `${path}.explicitIsolations`
  );
  if (!explicitIsolations.ok) return explicitIsolations;

  const districts = parseTopologyDistricts(readArray(input, "districts"), `${path}.districts`);
  if (!districts.ok) return districts;

  const routeNodes = parseTopologyRouteNodes(readArray(input, "routeNodes"), `${path}.routeNodes`);
  if (!routeNodes.ok) return routeNodes;

  const routeEdges = parseTopologyRouteEdges(readArray(input, "routeEdges"), `${path}.routeEdges`);
  if (!routeEdges.ok) return routeEdges;

  return {
    ok: true,
    value: {
      explicitIsolations: explicitIsolations.value,
      districts: districts.value,
      routeNodes: routeNodes.value,
      routeEdges: routeEdges.value
    }
  };
}

function parseTopologyIsolations(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2TopologyIsolationBootDefinitionV0[] }
  | BootPackErrorResult {
  const isolations: RuntimeM2TopologyIsolationBootDefinitionV0[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value))
      return contentPackError(entryPath, "Topology isolation must be an object.");
    const districtId = parsePositiveSafeInteger(value["districtId"], `${entryPath}.districtId`);
    if (!districtId.ok) return districtId;
    const reasonCode = parseNonEmptyString(value["reasonCode"], `${entryPath}.reasonCode`);
    if (!reasonCode.ok) return reasonCode;
    isolations.push({ districtId: districtId.value, reasonCode: reasonCode.value });
  }
  return { ok: true, value: isolations };
}

function parseTopologyDistricts(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2TopologyDistrictBootDefinitionV0[] }
  | BootPackErrorResult {
  const districts: RuntimeM2TopologyDistrictBootDefinitionV0[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value))
      return contentPackError(entryPath, "Topology district must be an object.");
    const districtId = parsePositiveSafeInteger(value["districtId"], `${entryPath}.districtId`);
    if (!districtId.ok) return districtId;
    const sourceId = parseNonEmptyString(value["sourceId"], `${entryPath}.sourceId`);
    if (!sourceId.ok) return sourceId;
    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    if (!displayNameKey.ok) return displayNameKey;
    const anchor = parseTopologyPoint(readRecord(value, "anchor"), `${entryPath}.anchor`);
    if (!anchor.ok) return anchor;
    const polygon = parseTopologyPoints(readArray(value, "polygon"), `${entryPath}.polygon`);
    if (!polygon.ok) return polygon;
    const metadata = parseTopologyMetadata(readRecord(value, "metadata"), `${entryPath}.metadata`);
    if (!metadata.ok) return metadata;
    districts.push({
      districtId: districtId.value,
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      anchor: anchor.value,
      polygon: polygon.value,
      metadata: metadata.value
    });
  }
  return { ok: true, value: districts };
}

function parseTopologyRouteNodes(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2TopologyRouteNodeBootDefinitionV0[] }
  | BootPackErrorResult {
  const routeNodes: RuntimeM2TopologyRouteNodeBootDefinitionV0[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value))
      return contentPackError(entryPath, "Topology route node must be an object.");
    const nodeId = parseNonEmptyString(value["nodeId"], `${entryPath}.nodeId`);
    if (!nodeId.ok) return nodeId;
    const nodeKind = value["nodeKind"];
    if (
      nodeKind !== "pass" &&
      nodeKind !== "port" &&
      nodeKind !== "special" &&
      nodeKind !== "warehouse"
    ) {
      return contentPackError(
        `${entryPath}.nodeKind`,
        "nodeKind must be pass, port, special, or warehouse."
      );
    }
    const districtId = parsePositiveSafeInteger(value["districtId"], `${entryPath}.districtId`);
    if (!districtId.ok) return districtId;
    const displayNameKey = parseNonEmptyString(
      value["displayNameKey"],
      `${entryPath}.displayNameKey`
    );
    if (!displayNameKey.ok) return displayNameKey;
    const anchor = parseTopologyPoint(readRecord(value, "anchor"), `${entryPath}.anchor`);
    if (!anchor.ok) return anchor;
    routeNodes.push({
      nodeId: nodeId.value,
      nodeKind,
      districtId: districtId.value,
      displayNameKey: displayNameKey.value,
      anchor: anchor.value
    });
  }
  return { ok: true, value: routeNodes };
}

function parseTopologyRouteEdges(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2TopologyRouteEdgeBootDefinitionV0[] }
  | BootPackErrorResult {
  const routeEdges: RuntimeM2TopologyRouteEdgeBootDefinitionV0[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value))
      return contentPackError(entryPath, "Topology route edge must be an object.");
    const routeId = parsePositiveSafeInteger(value["routeId"], `${entryPath}.routeId`);
    if (!routeId.ok) return routeId;
    const sourceId = parseNonEmptyString(value["sourceId"], `${entryPath}.sourceId`);
    if (!sourceId.ok) return sourceId;
    const from = parseTopologyEndpoint(readRecord(value, "from"), `${entryPath}.from`);
    if (!from.ok) return from;
    const to = parseTopologyEndpoint(readRecord(value, "to"), `${entryPath}.to`);
    if (!to.ok) return to;
    const mode = value["mode"];
    if (mode !== "coast" && mode !== "river" && mode !== "road") {
      return contentPackError(`${entryPath}.mode`, "mode must be coast, river, or road.");
    }
    const baseTravelCost = parsePositiveSafeInteger(
      value["baseTravelCost"],
      `${entryPath}.baseTravelCost`
    );
    if (!baseTravelCost.ok) return baseTravelCost;
    const baseCapacity = parsePositiveSafeInteger(
      value["baseCapacity"],
      `${entryPath}.baseCapacity`
    );
    if (!baseCapacity.ok) return baseCapacity;
    const seasonality = parseTopologySeasonality(
      readArray(value, "seasonality"),
      `${entryPath}.seasonality`
    );
    if (!seasonality.ok) return seasonality;
    const availability = parseTopologyAvailability(
      readRecord(value, "availability"),
      `${entryPath}.availability`
    );
    if (!availability.ok) return availability;
    const metadata = parseTopologyMetadata(readRecord(value, "metadata"), `${entryPath}.metadata`);
    if (!metadata.ok) return metadata;
    routeEdges.push({
      routeId: routeId.value,
      sourceId: sourceId.value,
      from: from.value,
      to: to.value,
      mode,
      baseTravelCost: baseTravelCost.value,
      baseCapacity: baseCapacity.value,
      seasonality: seasonality.value,
      availability: availability.value,
      metadata: metadata.value
    });
  }
  return { ok: true, value: routeEdges };
}

function parseTopologyEndpoint(
  input: Record<string, unknown>,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2TopologyRouteEndpointBootDefinitionV0 }
  | BootPackErrorResult {
  if (input["kind"] === "district") {
    const districtId = parsePositiveSafeInteger(input["districtId"], `${path}.districtId`);
    if (!districtId.ok) return districtId;
    return { ok: true, value: { kind: "district", districtId: districtId.value } };
  }
  if (input["kind"] === "route-node") {
    const nodeId = parseNonEmptyString(input["nodeId"], `${path}.nodeId`);
    if (!nodeId.ok) return nodeId;
    return { ok: true, value: { kind: "route-node", nodeId: nodeId.value } };
  }
  if (input["kind"] === "settlement") {
    const settlementId = parsePositiveSafeInteger(input["settlementId"], `${path}.settlementId`);
    if (!settlementId.ok) return settlementId;
    return { ok: true, value: { kind: "settlement", settlementId: settlementId.value } };
  }
  return contentPackError(
    `${path}.kind`,
    "Topology endpoint kind must be district, route-node, or settlement."
  );
}

function parseTopologySeasonality(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2TopologySeasonalityBootDefinitionV0[] }
  | BootPackErrorResult {
  const seasonality: RuntimeM2TopologySeasonalityBootDefinitionV0[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    const entryPath = `${path}[${index}]`;
    if (!isRecord(value))
      return contentPackError(entryPath, "Topology seasonality must be an object.");
    const month = parseIntegerInRange(value["month"], `${entryPath}.month`, 1, 12);
    if (!month.ok) return month;
    const costMultiplierBps = parseIntegerInRange(
      value["costMultiplierBps"],
      `${entryPath}.costMultiplierBps`,
      1,
      100000
    );
    if (!costMultiplierBps.ok) return costMultiplierBps;
    const capacityMultiplierBps = parseIntegerInRange(
      value["capacityMultiplierBps"],
      `${entryPath}.capacityMultiplierBps`,
      0,
      100000
    );
    if (!capacityMultiplierBps.ok) return capacityMultiplierBps;
    const reasonCodes = parseStringArray(value["reasonCodes"], `${entryPath}.reasonCodes`);
    if (!reasonCodes.ok) return reasonCodes;
    seasonality.push({
      month: month.value,
      costMultiplierBps: costMultiplierBps.value,
      capacityMultiplierBps: capacityMultiplierBps.value,
      reasonCodes: reasonCodes.value
    });
  }
  return { ok: true, value: seasonality };
}

function parseTopologyAvailability(
  input: Record<string, unknown>,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2TopologyAvailabilityBootDefinitionV0 }
  | BootPackErrorResult {
  if (input["kind"] === "open") {
    return { ok: true, value: { kind: "open" } };
  }
  if (input["kind"] === "blocked" || input["kind"] === "unknown") {
    const reasonCode = parseNonEmptyString(input["reasonCode"], `${path}.reasonCode`);
    if (!reasonCode.ok) return reasonCode;
    return { ok: true, value: { kind: input["kind"], reasonCode: reasonCode.value } };
  }
  return contentPackError(
    `${path}.kind`,
    "Topology availability kind must be open, blocked, or unknown."
  );
}

function parseTopologyMetadata(
  input: Record<string, unknown>,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2TopologyMetadataBootDefinitionV0 }
  | BootPackErrorResult {
  const historicity = input["historicity"];
  if (historicity !== "COMPOSITE" && historicity !== "FICTIONAL") {
    return contentPackError(`${path}.historicity`, "historicity must be COMPOSITE or FICTIONAL.");
  }
  const terrainClass = input["terrainClass"];
  if (
    terrainClass !== "coastal" &&
    terrainClass !== "lowland" &&
    terrainClass !== "pass" &&
    terrainClass !== "riverine" &&
    terrainClass !== "upland" &&
    terrainClass !== "urban" &&
    terrainClass !== "unknown"
  ) {
    return contentPackError(`${path}.terrainClass`, "terrainClass is invalid.");
  }
  const riskClass = input["riskClass"];
  if (
    riskClass !== "contested" &&
    riskClass !== "hazardous" &&
    riskClass !== "low" &&
    riskClass !== "seasonal" &&
    riskClass !== "unknown"
  ) {
    return contentPackError(`${path}.riskClass`, "riskClass is invalid.");
  }
  return { ok: true, value: { historicity, terrainClass, riskClass } };
}

function parseTopologyPoints(
  values: readonly unknown[],
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2TopologyPointBootDefinitionV0[] }
  | BootPackErrorResult {
  const points: RuntimeM2TopologyPointBootDefinitionV0[] = [];
  for (let index = 0; index < values.length; index += 1) {
    const point = values[index];
    if (!isRecord(point))
      return contentPackError(`${path}[${index}]`, "Topology point must be an object.");
    const parsed = parseTopologyPoint(point, `${path}[${index}]`);
    if (!parsed.ok) return parsed;
    points.push(parsed.value);
  }
  return { ok: true, value: points };
}

function parseTopologyPoint(
  input: Record<string, unknown>,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2TopologyPointBootDefinitionV0 }
  | BootPackErrorResult {
  const x = parseIntegerInRange(input["x"], `${path}.x`, -1000000, 1000000);
  if (!x.ok) return x;
  const y = parseIntegerInRange(input["y"], `${path}.y`, -1000000, 1000000);
  if (!y.ok) return y;
  return { ok: true, value: { x: x.value, y: y.value } };
}

function parseStrategicTerrain(
  input: Record<string, unknown>,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicTerrainBootDefinitionV0 }
  | BootPackErrorResult {
  if (input["schemaVersion"] !== 1) {
    return contentPackError(`${path}.schemaVersion`, "schemaVersion must be 1.");
  }
  if (input["hashAlgorithm"] !== "fnv1a32-canonical-strategic-terrain-v1") {
    return contentPackError(
      `${path}.hashAlgorithm`,
      "hashAlgorithm must be fnv1a32-canonical-strategic-terrain-v1."
    );
  }
  const contentManifestHash = parseHashString(
    input["contentManifestHash"],
    `${path}.contentManifestHash`
  );
  if (!contentManifestHash.ok) return contentManifestHash;
  if (input["authority"] !== "terrain-route-node-v1") {
    return contentPackError(`${path}.authority`, "authority must be terrain-route-node-v1.");
  }
  if (input["governanceFootprintRole"] !== "overlay-only") {
    return contentPackError(
      `${path}.governanceFootprintRole`,
      "governanceFootprintRole must be overlay-only."
    );
  }

  const authorityProhibitions = parseStrategicTerrainAuthorityProhibitions(
    input["authorityProhibitions"],
    `${path}.authorityProhibitions`
  );
  if (!authorityProhibitions.ok) return authorityProhibitions;
  const terrainPatches = parseStrategicTerrainArrayField(
    input,
    "terrainPatches",
    `${path}.terrainPatches`,
    "Terrain patch",
    parseTerrainPatch
  );
  if (!terrainPatches.ok) return terrainPatches;
  const barrierChannels = parseStrategicTerrainArrayField(
    input,
    "barrierChannels",
    `${path}.barrierChannels`,
    "Barrier channel",
    parseBarrierChannel
  );
  if (!barrierChannels.ok) return barrierChannels;
  const strategicNodes = parseStrategicTerrainArrayField(
    input,
    "strategicNodes",
    `${path}.strategicNodes`,
    "Strategic node",
    parseStrategicNode
  );
  if (!strategicNodes.ok) return strategicNodes;
  const routeCorridors = parseStrategicTerrainArrayField(
    input,
    "routeCorridors",
    `${path}.routeCorridors`,
    "Route corridor",
    parseRouteCorridor
  );
  if (!routeCorridors.ok) return routeCorridors;
  const districtGovernanceFootprints = parseStrategicTerrainArrayField(
    input,
    "districtGovernanceFootprints",
    `${path}.districtGovernanceFootprints`,
    "District governance footprint",
    parseDistrictGovernanceFootprint
  );
  if (!districtGovernanceFootprints.ok) return districtGovernanceFootprints;

  return {
    ok: true,
    value: {
      contentManifestHash: contentManifestHash.value,
      authorityProhibitions: authorityProhibitions.value,
      terrainPatches: terrainPatches.value,
      barrierChannels: barrierChannels.value,
      strategicNodes: strategicNodes.value,
      routeCorridors: routeCorridors.value,
      districtGovernanceFootprints: districtGovernanceFootprints.value
    }
  };
}

function parseTerrainPatch(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2TerrainPatchBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "Terrain patch must be an object.");
  }
  const patchId = parseStrategicTerrainId(input["patchId"], `${path}.patchId`);
  if (!patchId.ok) return patchId;
  const sourceId = parseNonEmptyString(input["sourceId"], `${path}.sourceId`);
  if (!sourceId.ok) return sourceId;
  const displayNameKey = parseNonEmptyString(input["displayNameKey"], `${path}.displayNameKey`);
  if (!displayNameKey.ok) return displayNameKey;
  const terrainClass = parseStrategicTerrainClass(input["terrainClass"], `${path}.terrainClass`);
  if (!terrainClass.ok) return terrainClass;
  const seasonSensitivity = parseStrategicTerrainSeasonState(
    input["seasonSensitivity"],
    `${path}.seasonSensitivity`
  );
  if (!seasonSensitivity.ok) return seasonSensitivity;
  const historicity = parseStrategicTerrainHistoricity(input["historicity"], `${path}.historicity`);
  if (!historicity.ok) return historicity;
  const polygon = parseStrategicTerrainPointArray(input["polygon"], `${path}.polygon`);
  if (!polygon.ok) return polygon;
  const explanationTags = parseStringArrayAllowEmpty(
    input["explanationTags"],
    `${path}.explanationTags`
  );
  if (!explanationTags.ok) return explanationTags;
  return {
    ok: true,
    value: {
      patchId: patchId.value,
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      terrainClass: terrainClass.value,
      seasonSensitivity: seasonSensitivity.value,
      historicity: historicity.value,
      polygon: polygon.value,
      explanationTags: explanationTags.value
    }
  };
}

function parseBarrierChannel(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2BarrierChannelBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "Barrier channel must be an object.");
  }
  const channelId = parseStrategicTerrainId(input["channelId"], `${path}.channelId`);
  if (!channelId.ok) return channelId;
  const sourceId = parseNonEmptyString(input["sourceId"], `${path}.sourceId`);
  if (!sourceId.ok) return sourceId;
  const displayNameKey = parseNonEmptyString(input["displayNameKey"], `${path}.displayNameKey`);
  if (!displayNameKey.ok) return displayNameKey;
  const channelKind = parseBarrierChannelKind(input["channelKind"], `${path}.channelKind`);
  if (!channelKind.ok) return channelKind;
  const traversalRule = parseBarrierTraversalRule(input["traversalRule"], `${path}.traversalRule`);
  if (!traversalRule.ok) return traversalRule;
  const historicity = parseStrategicTerrainHistoricity(input["historicity"], `${path}.historicity`);
  if (!historicity.ok) return historicity;
  const points = parseStrategicTerrainPointArray(input["points"], `${path}.points`);
  if (!points.ok) return points;
  const explanationTags = parseStringArrayAllowEmpty(
    input["explanationTags"],
    `${path}.explanationTags`
  );
  if (!explanationTags.ok) return explanationTags;
  return {
    ok: true,
    value: {
      channelId: channelId.value,
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      channelKind: channelKind.value,
      traversalRule: traversalRule.value,
      historicity: historicity.value,
      points: points.value,
      explanationTags: explanationTags.value
    }
  };
}

function parseStrategicNode(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicNodeBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "Strategic node must be an object.");
  }
  const nodeId = parseStrategicTerrainId(input["nodeId"], `${path}.nodeId`);
  if (!nodeId.ok) return nodeId;
  const sourceId = parseNonEmptyString(input["sourceId"], `${path}.sourceId`);
  if (!sourceId.ok) return sourceId;
  const displayNameKey = parseNonEmptyString(input["displayNameKey"], `${path}.displayNameKey`);
  if (!displayNameKey.ok) return displayNameKey;
  const nodeKind = parseStrategicNodeKind(input["nodeKind"], `${path}.nodeKind`);
  if (!nodeKind.ok) return nodeKind;
  const districtId = parsePositiveSafeInteger(input["districtId"], `${path}.districtId`);
  if (!districtId.ok) return districtId;
  const anchor = parseStrategicTerrainPoint(readRecord(input, "anchor"), `${path}.anchor`);
  if (!anchor.ok) return anchor;
  const localCapacity = parsePositiveSafeInteger(input["localCapacity"], `${path}.localCapacity`);
  if (!localCapacity.ok) return localCapacity;
  const knownState = parseStrategicNodeKnownState(input["knownState"], `${path}.knownState`);
  if (!knownState.ok) return knownState;
  const terrainPatchIds = parseStrategicTerrainIdArray(
    input["terrainPatchIds"],
    `${path}.terrainPatchIds`
  );
  if (!terrainPatchIds.ok) return terrainPatchIds;
  const barrierChannelIds = parseStrategicTerrainIdArray(
    input["barrierChannelIds"],
    `${path}.barrierChannelIds`
  );
  if (!barrierChannelIds.ok) return barrierChannelIds;
  const governanceFootprintIds = parseStrategicTerrainIdArray(
    input["governanceFootprintIds"],
    `${path}.governanceFootprintIds`
  );
  if (!governanceFootprintIds.ok) return governanceFootprintIds;
  const explanationTags = parseStringArrayAllowEmpty(
    input["explanationTags"],
    `${path}.explanationTags`
  );
  if (!explanationTags.ok) return explanationTags;
  return {
    ok: true,
    value: {
      nodeId: nodeId.value,
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      nodeKind: nodeKind.value,
      districtId: districtId.value,
      anchor: anchor.value,
      localCapacity: localCapacity.value,
      knownState: knownState.value,
      terrainPatchIds: terrainPatchIds.value,
      barrierChannelIds: barrierChannelIds.value,
      governanceFootprintIds: governanceFootprintIds.value,
      explanationTags: explanationTags.value
    }
  };
}

function parseRouteCorridor(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2RouteCorridorBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "Route corridor must be an object.");
  }
  const corridorId = parseStrategicTerrainId(input["corridorId"], `${path}.corridorId`);
  if (!corridorId.ok) return corridorId;
  const sourceId = parseNonEmptyString(input["sourceId"], `${path}.sourceId`);
  if (!sourceId.ok) return sourceId;
  const displayNameKey = parseNonEmptyString(input["displayNameKey"], `${path}.displayNameKey`);
  if (!displayNameKey.ok) return displayNameKey;
  const fromNodeId = parseStrategicTerrainId(input["fromNodeId"], `${path}.fromNodeId`);
  if (!fromNodeId.ok) return fromNodeId;
  const toNodeId = parseStrategicTerrainId(input["toNodeId"], `${path}.toNodeId`);
  if (!toNodeId.ok) return toNodeId;
  const mode = parseRouteCorridorMode(input["mode"], `${path}.mode`);
  if (!mode.ok) return mode;
  const widthClass = parseRouteCorridorWidthClass(input["widthClass"], `${path}.widthClass`);
  if (!widthClass.ok) return widthClass;
  const baseTravelCost = parsePositiveSafeInteger(
    input["baseTravelCost"],
    `${path}.baseTravelCost`
  );
  if (!baseTravelCost.ok) return baseTravelCost;
  const baseCapacity = parsePositiveSafeInteger(input["baseCapacity"], `${path}.baseCapacity`);
  if (!baseCapacity.ok) return baseCapacity;
  const riskClass = parseStrategicTerrainRiskClass(input["riskClass"], `${path}.riskClass`);
  if (!riskClass.ok) return riskClass;
  const terrainPatchIds = parseStrategicTerrainIdArray(
    input["terrainPatchIds"],
    `${path}.terrainPatchIds`
  );
  if (!terrainPatchIds.ok) return terrainPatchIds;
  const barrierChannelIds = parseStrategicTerrainIdArray(
    input["barrierChannelIds"],
    `${path}.barrierChannelIds`
  );
  if (!barrierChannelIds.ok) return barrierChannelIds;
  const governanceFootprintIds = parseStrategicTerrainIdArray(
    input["governanceFootprintIds"],
    `${path}.governanceFootprintIds`
  );
  if (!governanceFootprintIds.ok) return governanceFootprintIds;
  const seasonality = parseStrategicTerrainArrayValue(
    input["seasonality"],
    `${path}.seasonality`,
    "Route corridor seasonality",
    parseRouteCorridorSeasonality
  );
  if (!seasonality.ok) return seasonality;
  const availability = parseRouteCorridorAvailability(
    readRecord(input, "availability"),
    `${path}.availability`
  );
  if (!availability.ok) return availability;
  const polyline = parseStrategicTerrainPointArray(input["polyline"], `${path}.polyline`);
  if (!polyline.ok) return polyline;
  const explanationTags = parseStringArrayAllowEmpty(
    input["explanationTags"],
    `${path}.explanationTags`
  );
  if (!explanationTags.ok) return explanationTags;
  return {
    ok: true,
    value: {
      corridorId: corridorId.value,
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      fromNodeId: fromNodeId.value,
      toNodeId: toNodeId.value,
      mode: mode.value,
      widthClass: widthClass.value,
      baseTravelCost: baseTravelCost.value,
      baseCapacity: baseCapacity.value,
      riskClass: riskClass.value,
      terrainPatchIds: terrainPatchIds.value,
      barrierChannelIds: barrierChannelIds.value,
      governanceFootprintIds: governanceFootprintIds.value,
      seasonality: seasonality.value,
      availability: availability.value,
      polyline: polyline.value,
      explanationTags: explanationTags.value
    }
  };
}

function parseRouteCorridorSeasonality(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2RouteCorridorSeasonalModifierBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "Route corridor seasonality must be an object.");
  }
  const month = parseIntegerInRange(input["month"], `${path}.month`, 1, 12);
  if (!month.ok) return month;
  const seasonState = parseStrategicTerrainSeasonState(input["seasonState"], `${path}.seasonState`);
  if (!seasonState.ok) return seasonState;
  const travelCostMultiplierBps = parseIntegerInRange(
    input["travelCostMultiplierBps"],
    `${path}.travelCostMultiplierBps`,
    1,
    30000
  );
  if (!travelCostMultiplierBps.ok) return travelCostMultiplierBps;
  const capacityMultiplierBps = parseIntegerInRange(
    input["capacityMultiplierBps"],
    `${path}.capacityMultiplierBps`,
    0,
    30000
  );
  if (!capacityMultiplierBps.ok) return capacityMultiplierBps;
  const riskBps = parseIntegerInRange(input["riskBps"], `${path}.riskBps`, 0, 10000);
  if (!riskBps.ok) return riskBps;
  const reasonCodes = parseStringArrayAllowEmpty(input["reasonCodes"], `${path}.reasonCodes`);
  if (!reasonCodes.ok) return reasonCodes;
  return {
    ok: true,
    value: {
      month: month.value,
      seasonState: seasonState.value,
      travelCostMultiplierBps: travelCostMultiplierBps.value,
      capacityMultiplierBps: capacityMultiplierBps.value,
      riskBps: riskBps.value,
      reasonCodes: reasonCodes.value
    }
  };
}

function parseRouteCorridorAvailability(
  input: Record<string, unknown>,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2RouteCorridorAvailabilityBootDefinitionV0 }
  | BootPackErrorResult {
  if (input["kind"] === "open") {
    return { ok: true, value: { kind: "open" } };
  }
  if (input["kind"] === "blocked" || input["kind"] === "unknown") {
    const reasonCode = parseNonEmptyString(input["reasonCode"], `${path}.reasonCode`);
    if (!reasonCode.ok) return reasonCode;
    return { ok: true, value: { kind: input["kind"], reasonCode: reasonCode.value } };
  }
  return contentPackError(
    `${path}.kind`,
    "Route corridor availability kind must be open, blocked, or unknown."
  );
}

function parseDistrictGovernanceFootprint(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2DistrictGovernanceFootprintBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "District governance footprint must be an object.");
  }
  const footprintId = parseStrategicTerrainId(input["footprintId"], `${path}.footprintId`);
  if (!footprintId.ok) return footprintId;
  const sourceId = parseNonEmptyString(input["sourceId"], `${path}.sourceId`);
  if (!sourceId.ok) return sourceId;
  const displayNameKey = parseNonEmptyString(input["displayNameKey"], `${path}.displayNameKey`);
  if (!displayNameKey.ok) return displayNameKey;
  const districtId = parsePositiveSafeInteger(input["districtId"], `${path}.districtId`);
  if (!districtId.ok) return districtId;
  if (input["overlayOnly"] !== true) {
    return contentPackError(`${path}.overlayOnly`, "overlayOnly must be true.");
  }
  const polygon = parseStrategicTerrainPointArray(input["polygon"], `${path}.polygon`);
  if (!polygon.ok) return polygon;
  const governanceTags = parseStringArrayAllowEmpty(
    input["governanceTags"],
    `${path}.governanceTags`
  );
  if (!governanceTags.ok) return governanceTags;
  const consequenceTags = parseStringArrayAllowEmpty(
    input["consequenceTags"],
    `${path}.consequenceTags`
  );
  if (!consequenceTags.ok) return consequenceTags;
  return {
    ok: true,
    value: {
      footprintId: footprintId.value,
      sourceId: sourceId.value,
      displayNameKey: displayNameKey.value,
      districtId: districtId.value,
      overlayOnly: true,
      polygon: polygon.value,
      governanceTags: governanceTags.value,
      consequenceTags: consequenceTags.value
    }
  };
}

function parseStrategicTerrainArrayField<TValue>(
  input: Record<string, unknown>,
  key: string,
  path: string,
  label: string,
  parseEntry: (
    entry: unknown,
    entryPath: string
  ) => { readonly ok: true; readonly value: TValue } | BootPackErrorResult
): { readonly ok: true; readonly value: readonly TValue[] } | BootPackErrorResult {
  return parseStrategicTerrainArrayValue(input[key], path, label, parseEntry);
}

function parseStrategicTerrainArrayValue<TValue>(
  input: unknown,
  path: string,
  label: string,
  parseEntry: (
    entry: unknown,
    entryPath: string
  ) => { readonly ok: true; readonly value: TValue } | BootPackErrorResult
): { readonly ok: true; readonly value: readonly TValue[] } | BootPackErrorResult {
  if (!Array.isArray(input)) {
    return contentPackError(path, `${label} must be an array.`);
  }
  const result: TValue[] = [];
  for (let index = 0; index < input.length; index += 1) {
    const parsed = parseEntry(input[index], `${path}[${index}]`);
    if (!parsed.ok) return parsed;
    result.push(parsed.value);
  }
  return { ok: true, value: result };
}

function parseStrategicTerrainPointArray(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: readonly RuntimeM2StrategicTerrainPointBootDefinitionV0[] }
  | BootPackErrorResult {
  return parseStrategicTerrainArrayValue(
    input,
    path,
    "Strategic terrain point array",
    parseStrategicTerrainPoint
  );
}

function parseStrategicTerrainPoint(
  input: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicTerrainPointBootDefinitionV0 }
  | BootPackErrorResult {
  if (!isRecord(input)) {
    return contentPackError(path, "Strategic terrain point must be an object.");
  }
  const x = parseIntegerInRange(input["x"], `${path}.x`, -1000000, 1000000);
  if (!x.ok) return x;
  const y = parseIntegerInRange(input["y"], `${path}.y`, -1000000, 1000000);
  if (!y.ok) return y;
  return { ok: true, value: { x: x.value, y: y.value } };
}

function parseStrategicTerrainAuthorityProhibitions(
  input: unknown,
  path: string
):
  | {
      readonly ok: true;
      readonly value: readonly RuntimeM2StrategicTerrainAuthorityProhibitionBootDefinitionV0[];
    }
  | BootPackErrorResult {
  if (!Array.isArray(input)) {
    return contentPackError(path, "authorityProhibitions must be an array.");
  }
  const result: RuntimeM2StrategicTerrainAuthorityProhibitionBootDefinitionV0[] = [];
  for (let index = 0; index < input.length; index += 1) {
    const value = input[index];
    if (
      value !== "bounding-box-adjacency" &&
      value !== "centroid-proximity" &&
      value !== "hidden-grid" &&
      value !== "hidden-lattice" &&
      value !== "hex-axial-or-cube" &&
      value !== "renderer-only-line-reachability" &&
      value !== "sequential-id-reachability"
    ) {
      return contentPackError(
        `${path}[${index}]`,
        "Strategic terrain authority prohibition is invalid."
      );
    }
    result.push(value);
  }
  return { ok: true, value: result };
}

function validateRuntimeM2WorldBootSemantics(input: {
  readonly fixtureId: string;
  readonly manifest: Record<string, unknown>;
  readonly districts: readonly RuntimeM2DistrictBootDefinitionV0[];
  readonly settlements: readonly RuntimeM2SettlementBootDefinitionV0[];
  readonly curves: readonly RuntimeM2CurveBootDefinitionV0[];
  readonly routes: readonly RuntimeM2RouteBootDefinitionV0[];
  readonly geometries: readonly RuntimeM2MapGeometryBootDefinitionV0[];
  readonly topology: RuntimeM2TopologyBootDefinitionV0;
  readonly strategicTerrain?: RuntimeM2StrategicTerrainBootDefinitionV0;
}): BootPackErrorResult | null {
  if (input.fixtureId !== input.manifest["fixtureId"]) {
    return contentPackError(
      "runtimeContentPack.manifest.fixtureId",
      "manifest fixtureId must match pack fixtureId."
    );
  }

  const countError = validateManifestCount(input.manifest, "districtCount", input.districts.length);
  if (countError !== null) {
    return countError;
  }
  const settlementCountError = validateManifestCount(
    input.manifest,
    "settlementCount",
    input.settlements.length
  );
  if (settlementCountError !== null) {
    return settlementCountError;
  }
  const curveCountError = validateManifestCount(
    input.manifest,
    "regionalSeasonalCurveCount",
    input.curves.length
  );
  if (curveCountError !== null) {
    return curveCountError;
  }
  const routeCountError = validateManifestCount(input.manifest, "routeCount", input.routes.length);
  if (routeCountError !== null) {
    return routeCountError;
  }
  const geometryCountError = validateManifestCount(
    input.manifest,
    "mapGeometryCount",
    input.geometries.length
  );
  if (geometryCountError !== null) {
    return geometryCountError;
  }

  const districtIds = new Set(input.districts.map((district) => district.id));
  const curveIds = new Set(input.curves.map((curve) => curve.id));
  const geometryIds = new Set(input.geometries.map((geometry) => geometry.id));
  const settlementIds = new Set(input.settlements.map((settlement) => settlement.id));

  for (let index = 0; index < input.districts.length; index += 1) {
    const district = input.districts[index];
    if (district === undefined) {
      return contentPackError(`runtimeContentPack.districts[${index}]`, "District is missing.");
    }
    if (!curveIds.has(district.regionalCurveId)) {
      return contentPackError(
        `runtimeContentPack.districts[${index}].regionalCurveId`,
        `Missing regional seasonal curve ${district.regionalCurveId}.`
      );
    }
    if (!geometryIds.has(district.mapGeometryId)) {
      return contentPackError(
        `runtimeContentPack.districts[${index}].mapGeometryId`,
        `Missing map geometry ${district.mapGeometryId}.`
      );
    }
  }

  for (let index = 0; index < input.settlements.length; index += 1) {
    const settlement = input.settlements[index];
    if (settlement === undefined) {
      return contentPackError(`runtimeContentPack.settlements[${index}]`, "Settlement is missing.");
    }
    if (!districtIds.has(settlement.districtId)) {
      return contentPackError(
        `runtimeContentPack.settlements[${index}].districtId`,
        `Missing district ${settlement.districtId}.`
      );
    }
    if (!geometryIds.has(settlement.mapGeometryId)) {
      return contentPackError(
        `runtimeContentPack.settlements[${index}].mapGeometryId`,
        `Missing map geometry ${settlement.mapGeometryId}.`
      );
    }
  }

  for (let index = 0; index < input.routes.length; index += 1) {
    const route = input.routes[index];
    if (route === undefined) {
      return contentPackError(`runtimeContentPack.routes[${index}]`, "Route is missing.");
    }
    if (!districtIds.has(route.fromDistrictId)) {
      return contentPackError(
        `runtimeContentPack.routes[${index}].fromDistrictId`,
        `Missing from district ${route.fromDistrictId}.`
      );
    }
    if (!districtIds.has(route.toDistrictId)) {
      return contentPackError(
        `runtimeContentPack.routes[${index}].toDistrictId`,
        `Missing to district ${route.toDistrictId}.`
      );
    }
  }

  for (let index = 0; index < input.geometries.length; index += 1) {
    const geometry = input.geometries[index];
    if (geometry === undefined) {
      return contentPackError(
        `runtimeContentPack.mapGeometries[${index}]`,
        "Map geometry is missing."
      );
    }
    if (geometry.ownerKind === "district" && !districtIds.has(geometry.ownerId)) {
      return contentPackError(
        `runtimeContentPack.mapGeometries[${index}].ownerId`,
        `Missing district geometry owner ${geometry.ownerId}.`
      );
    }
    if (geometry.ownerKind === "settlement" && !settlementIds.has(geometry.ownerId)) {
      return contentPackError(
        `runtimeContentPack.mapGeometries[${index}].ownerId`,
        `Missing settlement geometry owner ${geometry.ownerId}.`
      );
    }
  }

  if (input.strategicTerrain !== undefined) {
    const strategicTerrainError = validateStrategicTerrainBootSemantics(
      input.strategicTerrain,
      readString(input.manifest, "manifestHash"),
      districtIds
    );
    if (strategicTerrainError !== null) {
      return strategicTerrainError;
    }
  }

  return null;
}

function validateStrategicTerrainBootSemantics(
  terrain: RuntimeM2StrategicTerrainBootDefinitionV0,
  manifestHash: string,
  districtIds: ReadonlySet<number>
): BootPackErrorResult | null {
  if (terrain.contentManifestHash !== manifestHash) {
    return contentPackError(
      "runtimeContentPack.strategicTerrain.contentManifestHash",
      "Strategic terrain contentManifestHash must match manifest manifestHash."
    );
  }
  for (const prohibition of STRATEGIC_TERRAIN_AUTHORITY_PROHIBITIONS) {
    if (!terrain.authorityProhibitions.includes(prohibition)) {
      return contentPackError(
        "runtimeContentPack.strategicTerrain.authorityProhibitions",
        `Strategic terrain authorityProhibitions must include ${prohibition}.`
      );
    }
  }

  const terrainPatchIds = collectStrategicTerrainBootIds(
    terrain.terrainPatches,
    "runtimeContentPack.strategicTerrain.terrainPatches",
    (patch) => patch.patchId
  );
  if (!terrainPatchIds.ok) return terrainPatchIds;
  const barrierChannelIds = collectStrategicTerrainBootIds(
    terrain.barrierChannels,
    "runtimeContentPack.strategicTerrain.barrierChannels",
    (channel) => channel.channelId
  );
  if (!barrierChannelIds.ok) return barrierChannelIds;
  const strategicNodeIds = collectStrategicTerrainBootIds(
    terrain.strategicNodes,
    "runtimeContentPack.strategicTerrain.strategicNodes",
    (node) => node.nodeId
  );
  if (!strategicNodeIds.ok) return strategicNodeIds;
  const routeCorridorIds = collectStrategicTerrainBootIds(
    terrain.routeCorridors,
    "runtimeContentPack.strategicTerrain.routeCorridors",
    (corridor) => corridor.corridorId
  );
  if (!routeCorridorIds.ok) return routeCorridorIds;
  const governanceFootprintIds = collectStrategicTerrainBootIds(
    terrain.districtGovernanceFootprints,
    "runtimeContentPack.strategicTerrain.districtGovernanceFootprints",
    (footprint) => footprint.footprintId
  );
  if (!governanceFootprintIds.ok) return governanceFootprintIds;

  for (let index = 0; index < terrain.strategicNodes.length; index += 1) {
    const node = terrain.strategicNodes[index];
    if (node === undefined) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.strategicNodes[${index}]`,
        "Strategic node is missing."
      );
    }
    if (!districtIds.has(node.districtId)) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.strategicNodes[${index}].districtId`,
        `Missing strategic node district ${node.districtId}.`
      );
    }
    const nodeReferenceError = validateStrategicTerrainBootReferences(
      node.terrainPatchIds,
      terrainPatchIds.value,
      `runtimeContentPack.strategicTerrain.strategicNodes[${index}].terrainPatchIds`,
      "terrain patch"
    );
    if (nodeReferenceError !== null) return nodeReferenceError;
    const nodeBarrierError = validateStrategicTerrainBootReferences(
      node.barrierChannelIds,
      barrierChannelIds.value,
      `runtimeContentPack.strategicTerrain.strategicNodes[${index}].barrierChannelIds`,
      "barrier channel"
    );
    if (nodeBarrierError !== null) return nodeBarrierError;
    const nodeGovernanceError = validateStrategicTerrainBootReferences(
      node.governanceFootprintIds,
      governanceFootprintIds.value,
      `runtimeContentPack.strategicTerrain.strategicNodes[${index}].governanceFootprintIds`,
      "district governance footprint"
    );
    if (nodeGovernanceError !== null) return nodeGovernanceError;
  }

  for (let index = 0; index < terrain.routeCorridors.length; index += 1) {
    const corridor = terrain.routeCorridors[index];
    if (corridor === undefined) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.routeCorridors[${index}]`,
        "Route corridor is missing."
      );
    }
    if (!strategicNodeIds.value.has(corridor.fromNodeId)) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.routeCorridors[${index}].fromNodeId`,
        `Missing route corridor from node ${corridor.fromNodeId}.`
      );
    }
    if (!strategicNodeIds.value.has(corridor.toNodeId)) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.routeCorridors[${index}].toNodeId`,
        `Missing route corridor to node ${corridor.toNodeId}.`
      );
    }
    if (corridor.fromNodeId === corridor.toNodeId) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.routeCorridors[${index}].toNodeId`,
        "Route corridor endpoints must be distinct strategic nodes."
      );
    }
    const terrainReferenceError = validateStrategicTerrainBootReferences(
      corridor.terrainPatchIds,
      terrainPatchIds.value,
      `runtimeContentPack.strategicTerrain.routeCorridors[${index}].terrainPatchIds`,
      "terrain patch"
    );
    if (terrainReferenceError !== null) return terrainReferenceError;
    const barrierReferenceError = validateStrategicTerrainBootReferences(
      corridor.barrierChannelIds,
      barrierChannelIds.value,
      `runtimeContentPack.strategicTerrain.routeCorridors[${index}].barrierChannelIds`,
      "barrier channel"
    );
    if (barrierReferenceError !== null) return barrierReferenceError;
    const governanceReferenceError = validateStrategicTerrainBootReferences(
      corridor.governanceFootprintIds,
      governanceFootprintIds.value,
      `runtimeContentPack.strategicTerrain.routeCorridors[${index}].governanceFootprintIds`,
      "district governance footprint"
    );
    if (governanceReferenceError !== null) return governanceReferenceError;
    const seasonalityError = validateStrategicTerrainSeasonality(corridor, index);
    if (seasonalityError !== null) return seasonalityError;
  }

  for (let index = 0; index < terrain.districtGovernanceFootprints.length; index += 1) {
    const footprint = terrain.districtGovernanceFootprints[index];
    if (footprint === undefined) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.districtGovernanceFootprints[${index}]`,
        "District governance footprint is missing."
      );
    }
    if (!districtIds.has(footprint.districtId)) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.districtGovernanceFootprints[${index}].districtId`,
        `Missing district governance footprint district ${footprint.districtId}.`
      );
    }
  }

  return null;
}

function collectStrategicTerrainBootIds<TValue>(
  entries: readonly TValue[],
  path: string,
  readId: (entry: TValue) => string
):
  | { readonly ok: true; readonly value: ReadonlySet<string> }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const ids = new Set<string>();
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (entry === undefined) {
      return contentPackError(`${path}[${index}]`, "Strategic terrain entry is missing.");
    }
    const id = readId(entry);
    if (ids.has(id)) {
      return contentPackError(`${path}[${index}]`, `Duplicate strategic terrain id ${id}.`);
    }
    ids.add(id);
  }
  return { ok: true, value: ids };
}

function validateStrategicTerrainBootReferences(
  values: readonly string[],
  allowedIds: ReadonlySet<string>,
  path: string,
  label: string
): BootPackErrorResult | null {
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === undefined) {
      return contentPackError(`${path}[${index}]`, "Strategic terrain reference is missing.");
    }
    if (!allowedIds.has(value)) {
      return contentPackError(`${path}[${index}]`, `Missing strategic terrain ${label} ${value}.`);
    }
  }
  return null;
}

function validateStrategicTerrainSeasonality(
  corridor: RuntimeM2RouteCorridorBootDefinitionV0,
  corridorIndex: number
): BootPackErrorResult | null {
  const months = new Set<number>();
  for (let index = 0; index < corridor.seasonality.length; index += 1) {
    const season = corridor.seasonality[index];
    if (season === undefined) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.routeCorridors[${corridorIndex}].seasonality[${index}]`,
        "Route corridor seasonality is missing."
      );
    }
    if (months.has(season.month)) {
      return contentPackError(
        `runtimeContentPack.strategicTerrain.routeCorridors[${corridorIndex}].seasonality[${index}].month`,
        `Duplicate route corridor month ${season.month}.`
      );
    }
    months.add(season.month);
  }
  return null;
}

function validateManifestCount(
  manifest: Record<string, unknown>,
  key: string,
  actual: number
): BootPackErrorResult | null {
  if (manifest[key] === actual) {
    return null;
  }

  return contentPackError(
    `runtimeContentPack.manifest.${key}`,
    `manifest ${key} must match runtime array length.`
  );
}

function parseHashString(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: string }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (typeof value === "string" && /^[0-9a-f]{8}$/u.test(value)) {
    return { ok: true, value };
  }
  return contentPackError(path, `${path} must be an 8-character lowercase hex hash.`);
}

function parseStrategicTerrainId(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: string }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (typeof value !== "string" || !/^[A-Za-z][A-Za-z0-9._:-]{0,95}$/u.test(value)) {
    return contentPackError(path, `${path} must be a stable strategic terrain id.`);
  }
  if (/^(?:\d+|row[-.:]?\d+|col[-.:]?\d+|hex[-.:]?\d+|cell[-.:]?\d+)$/iu.test(value)) {
    return contentPackError(
      path,
      `${path} must not be a hidden grid, lattice, hex, or sequential id.`
    );
  }
  return { ok: true, value };
}

function parseStrategicTerrainIdArray(
  value: unknown,
  path: string
): { readonly ok: true; readonly value: readonly string[] } | BootPackErrorResult {
  if (!Array.isArray(value)) {
    return contentPackError(path, `${path} must be an array.`);
  }
  const result: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const parsed = parseStrategicTerrainId(value[index], `${path}[${index}]`);
    if (!parsed.ok) return parsed;
    result.push(parsed.value);
  }
  return { ok: true, value: result };
}

function parseStringArrayAllowEmpty(
  value: unknown,
  path: string
): { readonly ok: true; readonly value: readonly string[] } | BootPackErrorResult {
  if (!Array.isArray(value)) {
    return contentPackError(path, `${path} must be an array.`);
  }
  const result: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (typeof entry !== "string" || entry.length === 0) {
      return contentPackError(`${path}[${index}]`, `${path}[${index}] must be a non-empty string.`);
    }
    result.push(entry);
  }
  return { ok: true, value: result };
}

function parseStrategicTerrainClass(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicTerrainClassBootDefinitionV0 }
  | BootPackErrorResult {
  if (
    value === "coastal" ||
    value === "lowland" ||
    value === "pass" ||
    value === "ridge" ||
    value === "river-basin" ||
    value === "riverine" ||
    value === "upland" ||
    value === "urban" ||
    value === "wetland" ||
    value === "unknown"
  ) {
    return { ok: true, value };
  }
  return contentPackError(path, "Strategic terrain class is invalid.");
}

function parseStrategicTerrainRiskClass(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicTerrainRiskClassBootDefinitionV0 }
  | BootPackErrorResult {
  if (
    value === "contested" ||
    value === "hazardous" ||
    value === "low" ||
    value === "seasonal" ||
    value === "unknown"
  ) {
    return { ok: true, value };
  }
  return contentPackError(path, "Strategic terrain risk class is invalid.");
}

function parseStrategicTerrainSeasonState(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicTerrainSeasonStateBootDefinitionV0 }
  | BootPackErrorResult {
  if (value === "dry" || value === "monsoon" || value === "transition" || value === "unknown") {
    return { ok: true, value };
  }
  return contentPackError(path, "Strategic terrain season state is invalid.");
}

function parseStrategicTerrainHistoricity(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicTerrainHistoricityBootDefinitionV0 }
  | BootPackErrorResult {
  if (
    value === "COMPOSITE" ||
    value === "FICTIONAL" ||
    value === "HISTORICAL" ||
    value === "INFERRED"
  ) {
    return { ok: true, value };
  }
  return contentPackError(path, "Strategic terrain historicity is invalid.");
}

function parseBarrierChannelKind(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2BarrierChannelKindBootDefinitionV0 }
  | BootPackErrorResult {
  if (
    value === "coast" ||
    value === "major-river" ||
    value === "ridge" ||
    value === "strait" ||
    value === "wetland"
  ) {
    return { ok: true, value };
  }
  return contentPackError(path, "Barrier channel kind is invalid.");
}

function parseBarrierTraversalRule(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2BarrierTraversalRuleBootDefinitionV0 }
  | BootPackErrorResult {
  if (value === "blocks-without-explicit-corridor" || value === "channels-explicit-corridors") {
    return { ok: true, value };
  }
  return contentPackError(path, "Barrier traversalRule is invalid.");
}

function parseStrategicNodeKind(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicNodeKindBootDefinitionV0 }
  | BootPackErrorResult {
  if (
    value === "castle" ||
    value === "crossing" ||
    value === "objective" ||
    value === "pass" ||
    value === "port" ||
    value === "staging-area" ||
    value === "town" ||
    value === "warehouse"
  ) {
    return { ok: true, value };
  }
  return contentPackError(path, "Strategic node kind is invalid.");
}

function parseStrategicNodeKnownState(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2StrategicNodeKnownStateBootDefinitionV0 }
  | BootPackErrorResult {
  if (value === "known" || value === "rumored" || value === "unknown") {
    return { ok: true, value };
  }
  return contentPackError(path, "Strategic node known state is invalid.");
}

function parseRouteCorridorMode(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2RouteCorridorModeBootDefinitionV0 }
  | BootPackErrorResult {
  if (
    value === "coast" ||
    value === "mixed" ||
    value === "pass" ||
    value === "river" ||
    value === "road"
  ) {
    return { ok: true, value };
  }
  return contentPackError(path, "Route corridor mode is invalid.");
}

function parseRouteCorridorWidthClass(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: RuntimeM2RouteCorridorWidthClassBootDefinitionV0 }
  | BootPackErrorResult {
  if (value === "narrow" || value === "standard" || value === "wide") {
    return { ok: true, value };
  }
  return contentPackError(path, "Route corridor widthClass is invalid.");
}

function parseOrderedUniqueId(
  value: unknown,
  previousId: number,
  seen: Set<number>,
  path: string
):
  | { readonly ok: true; readonly value: number }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  const id = parsePositiveSafeInteger(value, path);
  if (!id.ok) {
    return id;
  }

  if (seen.has(id.value)) {
    return contentPackError(path, `Duplicate runtime id ${id.value}.`);
  }

  if (id.value <= previousId) {
    return contentPackError(path, "Runtime ids must be ordered by id.");
  }

  seen.add(id.value);
  return id;
}

function parsePositiveSafeInteger(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: number }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return { ok: true, value };
  }

  return contentPackError(path, `${path} must be a positive safe integer.`);
}

function parseIntegerInRange(
  value: unknown,
  path: string,
  minimum: number,
  maximum: number
):
  | { readonly ok: true; readonly value: number }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  ) {
    return { ok: true, value };
  }

  return contentPackError(path, `${path} must be a safe integer from ${minimum} to ${maximum}.`);
}

function parseNonnegativeSafeInteger(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: number }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) {
    return { ok: true, value };
  }

  return contentPackError(path, `${path} must be a nonnegative safe integer.`);
}

function parseNonEmptyString(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: string }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (typeof value === "string" && value.length > 0) {
    return { ok: true, value };
  }

  return contentPackError(path, `${path} must be a non-empty string.`);
}

function parseStringArray(
  value: unknown,
  path: string
):
  | { readonly ok: true; readonly value: readonly string[] }
  | {
      readonly ok: false;
      readonly error: ContentBootErrorV1;
    } {
  if (!Array.isArray(value) || value.length === 0) {
    return contentPackError(path, `${path} must be a non-empty string array.`);
  }
  const result: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (typeof entry !== "string" || entry.length === 0) {
      return contentPackError(`${path}[${index}]`, `${path}[${index}] must be a non-empty string.`);
    }
    result.push(entry);
  }
  return { ok: true, value: result };
}

function readArray(record: Record<string, unknown>, key: string): readonly unknown[] {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function readRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  return isRecord(value) ? value : {};
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function contentPackError(path: string, message: string): BootPackErrorResult {
  return {
    ok: false,
    error: {
      code: "invalid-content-pack",
      path,
      message
    }
  };
}

function baseCapacityForRouteKind(routeKind: "coast" | "river" | "road"): number {
  switch (routeKind) {
    case "road":
      return 100;
    case "river":
      return 180;
    case "coast":
      return 140;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

import {
  createM2EconomyPopulationStateV0,
  createM6PolicyEventRuntimeStateV0,
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

  const definitions = {
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

  const semanticError = validateRuntimeM2WorldBootSemantics({
    fixtureId: readString(input, "fixtureId"),
    manifest,
    districts: districts.value,
    settlements: settlements.value,
    curves: curves.value,
    routes: routes.value,
    geometries: geometries.value
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

  if (manifest["historicity"] !== "FICTIONAL") {
    return contentPackError(
      "runtimeContentPack.manifest.historicity",
      "manifest historicity must be FICTIONAL."
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

function validateRuntimeM2WorldBootSemantics(input: {
  readonly fixtureId: string;
  readonly manifest: Record<string, unknown>;
  readonly districts: readonly RuntimeM2DistrictBootDefinitionV0[];
  readonly settlements: readonly RuntimeM2SettlementBootDefinitionV0[];
  readonly curves: readonly RuntimeM2CurveBootDefinitionV0[];
  readonly routes: readonly RuntimeM2RouteBootDefinitionV0[];
  readonly geometries: readonly RuntimeM2MapGeometryBootDefinitionV0[];
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

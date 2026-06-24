import { parseGameCommandV1, type GameCommandV1 } from "@monsoon/protocol";

export const SAVE_ENVELOPE_V1_MAGIC = "MONSOON_SOVEREIGNS_SAVE";
export const SAVE_ENVELOPE_V1_SCHEMA_VERSION = 1;
export const SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM = "fnv1a32-save-body-v1";
export const SAVE_ENVELOPE_V1_HASH_ALGORITHM = "fnv1a32-canonical-world-state-v0";

const DEFAULT_MAX_SAVE_BYTES = 1_048_576;
const DEFAULT_MAX_JSON_DEPTH = 32;
const MAX_TAIL_COUNT = 32;
const FNV1A32_OFFSET = 2_166_136_261;
const FNV1A32_PRIME = 16_777_619;

export interface SaveBuildMetadataV1 {
  readonly appVersion: string;
  readonly source: "node-runner" | "test" | "worker";
  readonly codecVersion: "save-envelope-v1";
}

export interface SaveHeaderV1 {
  readonly magic: typeof SAVE_ENVELOPE_V1_MAGIC;
  readonly schemaVersion: typeof SAVE_ENVELOPE_V1_SCHEMA_VERSION;
  readonly build: SaveBuildMetadataV1;
  readonly contentManifestHash: string;
  readonly scenarioId: string;
  readonly seed: number;
  readonly currentDay: number;
  readonly checksumAlgorithm: typeof SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM;
  readonly checksum: string;
}

export interface SaveWorldMetaV0Dto {
  readonly schemaVersion: 0;
  readonly seed: number;
  readonly contentManifestHash: string;
  readonly currentDay: number;
  readonly revision: number;
  readonly hashAlgorithm: typeof SAVE_ENVELOPE_V1_HASH_ALGORITHM;
  readonly stateHash: string;
}

export interface SaveSimpleDefinitionDto {
  readonly id: number;
  readonly displayNameKey: string;
}

export interface SaveSettlementDefinitionDto extends SaveSimpleDefinitionDto {
  readonly districtId: number;
}

export interface SaveRouteDefinitionDto {
  readonly id: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly lengthInMapUnits: number;
}

export interface SaveWorldDefinitionsV0Dto {
  readonly polities: readonly SaveSimpleDefinitionDto[];
  readonly persons: readonly SaveSimpleDefinitionDto[];
  readonly districts: readonly SaveSimpleDefinitionDto[];
  readonly settlements: readonly SaveSettlementDefinitionDto[];
  readonly routes: readonly SaveRouteDefinitionDto[];
}

export interface SaveSimpleRuntimeStateDto {
  readonly definitionId: number;
}

export interface SavePersonStateDto extends SaveSimpleRuntimeStateDto {
  readonly currentDistrictId: number | null;
}

export type SaveDistrictControlDto =
  | { readonly kind: "controlled"; readonly controllerPolityId: number }
  | { readonly kind: "uncontrolled" };

export interface SaveDistrictStateDto extends SaveSimpleRuntimeStateDto {
  readonly control: SaveDistrictControlDto;
}

export interface SaveSettlementStateDto extends SaveSimpleRuntimeStateDto {
  readonly currentDistrictId: number;
}

export type SaveM2AgriculturePhaseDto = "fallow" | "planting" | "growing" | "harvest";
export type SaveM2LaborCommitmentPurposeDto = "mobilized";
export type SaveM2RouteKindDto = "coast" | "river" | "road";

export interface SaveM2LaborCommitmentStateDto {
  readonly purpose: SaveM2LaborCommitmentPurposeDto;
  readonly laborAmount: number;
  readonly startDay: number;
  readonly releaseDay: number;
}

export interface SaveM2PopulationGroupStateDto {
  readonly id: number;
  readonly districtId: number;
  readonly totalPeople: number;
  readonly workingPeople: number;
  readonly dependentPeople: number;
  readonly availableLabor: number;
  readonly grainStock: number;
  readonly cashStock: number;
  readonly committedLabor: readonly SaveM2LaborCommitmentStateDto[];
}

export interface SaveM2DistrictAgricultureStateDto {
  readonly districtId: number;
  readonly phase: SaveM2AgriculturePhaseDto;
  readonly daysInPhase: number;
  readonly accumulatedFarmLabor: number;
  readonly expectedHarvestGrain: number;
  readonly lastHarvestGrain: number;
}

export interface SaveM2DistrictMarketStateDto {
  readonly districtId: number;
  readonly grainPriceCashPerHundred: number;
  readonly cashFlow: {
    readonly cumulativeMobilizationCost: number;
    readonly lastDailyCashDelta: number;
  };
  readonly grainFlow: {
    readonly lastHarvestDelta: number;
  };
}

export interface SaveM2SeasonalMonthStateDto {
  readonly month: number;
  readonly monsoonIntensityBps: number;
  readonly agricultureWorkBps: number;
  readonly riverNavigabilityBps: number;
  readonly roadTravelCostBps: number;
}

export interface SaveM2RegionalSeasonalCurveStateDto {
  readonly id: number;
  readonly monthlyValues: readonly SaveM2SeasonalMonthStateDto[];
}

export interface SaveM2DistrictSeasonalityStateDto {
  readonly districtId: number;
  readonly regionalCurveId: number;
}

export interface SaveM2RouteTransportEdgeStateDto {
  readonly routeId: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly routeKind: SaveM2RouteKindDto;
  readonly baseTravelCost: number;
  readonly baseCapacity: number;
}

export interface SaveM2TransportStateDto {
  readonly schemaVersion: 1;
  readonly routes: readonly SaveM2RouteTransportEdgeStateDto[];
  readonly districtSeasonality: readonly SaveM2DistrictSeasonalityStateDto[];
  readonly regionalCurves: readonly SaveM2RegionalSeasonalCurveStateDto[];
}

export interface SaveM2EconomyPopulationStateDto {
  readonly schemaVersion: 1;
  readonly populationGroups: readonly SaveM2PopulationGroupStateDto[];
  readonly agriculture: {
    readonly districts: readonly SaveM2DistrictAgricultureStateDto[];
  };
  readonly market: {
    readonly districts: readonly SaveM2DistrictMarketStateDto[];
  };
  readonly transport: SaveM2TransportStateDto;
}

export interface SaveWorldRuntimeStateV0Dto {
  readonly polities: readonly SaveSimpleRuntimeStateDto[];
  readonly persons: readonly SavePersonStateDto[];
  readonly districts: readonly SaveDistrictStateDto[];
  readonly settlements: readonly SaveSettlementStateDto[];
  readonly routes: readonly SaveSimpleRuntimeStateDto[];
  readonly m2?: SaveM2EconomyPopulationStateDto;
}

export interface SaveWorldSnapshotV0Dto {
  readonly schemaVersion: 0;
  readonly meta: SaveWorldMetaV0Dto;
  readonly definitions: SaveWorldDefinitionsV0Dto;
  readonly state: SaveWorldRuntimeStateV0Dto;
}

export interface SaveSchedulerV1Dto {
  readonly schedulerVersion: 1;
  readonly systemOrderVersion: 1;
  readonly fixedStepDurationInDays: 1;
  readonly lastCompletedDay: number;
  readonly pendingCommandCount: number;
}

export interface SaveRngCompatibilityV1Dto {
  readonly schemaVersion: 1;
  readonly algorithm: "sfc32-fnv1a32-domain-v1";
  readonly savedStreams: readonly unknown[];
}

export interface SaveCommandTailEntryV1 {
  readonly sequence: number;
  readonly command: GameCommandV1;
}

export interface SaveEventTailEntryV1 {
  readonly sequence: number;
  readonly event: Record<string, unknown>;
}

export interface SaveBodyV1 {
  readonly authoritativeSnapshot: SaveWorldSnapshotV0Dto;
  readonly scheduler: SaveSchedulerV1Dto;
  readonly rng: SaveRngCompatibilityV1Dto;
  readonly commandTail: readonly SaveCommandTailEntryV1[];
  readonly eventTail: readonly SaveEventTailEntryV1[];
}

export interface SaveEnvelopeV1 {
  readonly magic: typeof SAVE_ENVELOPE_V1_MAGIC;
  readonly schemaVersion: typeof SAVE_ENVELOPE_V1_SCHEMA_VERSION;
  readonly header: SaveHeaderV1;
  readonly body: SaveBodyV1;
}

export interface CreateSaveEnvelopeV1Input {
  readonly build: SaveBuildMetadataV1;
  readonly scenarioId: string;
  readonly authoritativeSnapshot: SaveWorldSnapshotV0Dto;
  readonly scheduler: SaveSchedulerV1Dto;
  readonly rng: SaveRngCompatibilityV1Dto;
  readonly commandTail: readonly SaveCommandTailEntryV1[];
  readonly eventTail: readonly SaveEventTailEntryV1[];
}

export type SaveLoadRejectionCodeV1 =
  | "checksum-mismatch"
  | "content-manifest-mismatch"
  | "depth-limit"
  | "invalid-magic"
  | "invalid-schema"
  | "malformed-json"
  | "semantic-invariant"
  | "size-limit"
  | "unsupported-schema-version";

export interface SaveLoadRejectionReasonV1 {
  readonly code: SaveLoadRejectionCodeV1;
  readonly path: string;
  readonly message: string;
}

export interface SaveSemanticIssueV1 {
  readonly path: string;
  readonly message: string;
}

export interface DecodeSaveEnvelopeV1Options {
  readonly expectedContentManifestHash?: string;
  readonly expectedScenarioId?: string;
  readonly maxBytes?: number;
  readonly maxDepth?: number;
  readonly validateWorldSnapshot?: (worldCandidate: unknown) => readonly SaveSemanticIssueV1[];
}

export type DecodeSaveEnvelopeV1Result =
  | {
      readonly status: "loaded";
      readonly envelope: SaveEnvelopeV1;
      readonly worldCandidate: unknown;
    }
  | {
      readonly status: "rejected";
      readonly reasons: readonly SaveLoadRejectionReasonV1[];
    };

export interface WorldStateV0ForSave {
  readonly meta: SaveWorldMetaV0Dto;
  readonly definitions: SaveWorldDefinitionsV0Dto;
  readonly state: {
    readonly polities: readonly SaveSimpleRuntimeStateDto[];
    readonly persons: readonly {
      readonly definitionId: number;
      readonly currentDistrictId: number | undefined;
    }[];
    readonly districts: readonly SaveDistrictStateDto[];
    readonly settlements: readonly SaveSettlementStateDto[];
    readonly routes: readonly SaveSimpleRuntimeStateDto[];
    readonly m2?: SaveM2EconomyPopulationStateDto;
  };
}

export function createSaveEnvelopeV1(input: CreateSaveEnvelopeV1Input): SaveEnvelopeV1 {
  const body = copySaveBody({
    authoritativeSnapshot: input.authoritativeSnapshot,
    scheduler: input.scheduler,
    rng: input.rng,
    commandTail: input.commandTail,
    eventTail: input.eventTail
  });
  const checksum = checksumSaveBodyV1(body);

  return {
    magic: SAVE_ENVELOPE_V1_MAGIC,
    schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
    header: {
      magic: SAVE_ENVELOPE_V1_MAGIC,
      schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
      build: {
        appVersion: input.build.appVersion,
        source: input.build.source,
        codecVersion: input.build.codecVersion
      },
      contentManifestHash: body.authoritativeSnapshot.meta.contentManifestHash,
      scenarioId: input.scenarioId,
      seed: body.authoritativeSnapshot.meta.seed,
      currentDay: body.authoritativeSnapshot.meta.currentDay,
      checksumAlgorithm: SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM,
      checksum
    },
    body
  };
}

export function encodeSaveEnvelopeV1(envelope: SaveEnvelopeV1): Uint8Array {
  return encodeUtf8(canonicalJson(envelope));
}

export function decodeSaveEnvelopeV1(
  bytes: Uint8Array,
  options: DecodeSaveEnvelopeV1Options = {}
): DecodeSaveEnvelopeV1Result {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_SAVE_BYTES;
  if (!isNonnegativeSafeInteger(maxBytes) || maxBytes <= 0) {
    return rejected("invalid-schema", "maxBytes", "maxBytes must be a positive safe integer.");
  }

  if (bytes.byteLength > maxBytes) {
    return rejected(
      "size-limit",
      "$",
      `Save payload is ${bytes.byteLength} bytes, exceeding limit ${maxBytes}.`
    );
  }

  const parsed = parseJsonBytes(bytes);
  if (!parsed.ok) {
    return rejected(parsed.reason.code, parsed.reason.path, parsed.reason.message);
  }

  const maxDepth = options.maxDepth ?? DEFAULT_MAX_JSON_DEPTH;
  const depthError = validateDepth(parsed.value, maxDepth);
  if (depthError !== null) {
    return { status: "rejected", reasons: [depthError] };
  }

  const envelopeResult = parseSaveEnvelopeV1(parsed.value);
  if (!envelopeResult.ok) {
    return { status: "rejected", reasons: envelopeResult.reasons };
  }

  const envelope = envelopeResult.value;
  const expectedChecksum = checksumSaveBodyV1(envelope.body);
  if (envelope.header.checksum !== expectedChecksum) {
    return rejected(
      "checksum-mismatch",
      "header.checksum",
      `Save checksum ${envelope.header.checksum} does not match canonical body checksum ${expectedChecksum}.`
    );
  }

  if (
    options.expectedContentManifestHash !== undefined &&
    envelope.header.contentManifestHash !== options.expectedContentManifestHash
  ) {
    return rejected(
      "content-manifest-mismatch",
      "header.contentManifestHash",
      `Save content manifest ${envelope.header.contentManifestHash} does not match expected ${options.expectedContentManifestHash}.`
    );
  }

  if (
    options.expectedScenarioId !== undefined &&
    envelope.header.scenarioId !== options.expectedScenarioId
  ) {
    return rejected(
      "invalid-schema",
      "header.scenarioId",
      `Save scenario ${envelope.header.scenarioId} does not match expected ${options.expectedScenarioId}.`
    );
  }

  const worldCandidate = saveWorldStateV0DtoToCandidate(
    envelope.body.authoritativeSnapshot,
    envelope.body.scheduler
  );
  const semanticIssues = options.validateWorldSnapshot?.(worldCandidate) ?? [];
  if (semanticIssues.length > 0) {
    return {
      status: "rejected",
      reasons: semanticIssues.map((issue) => ({
        code: "semantic-invariant",
        path: issue.path,
        message: issue.message
      }))
    };
  }

  return {
    status: "loaded",
    envelope,
    worldCandidate
  };
}

export function worldStateV0ToSaveDto(world: WorldStateV0ForSave): SaveWorldSnapshotV0Dto {
  const stateWithoutM2 = {
    polities: world.state.polities.map(copySimpleRuntimeState),
    persons: world.state.persons.map((person) => ({
      definitionId: person.definitionId,
      currentDistrictId: person.currentDistrictId ?? null
    })),
    districts: world.state.districts.map((district) => ({
      definitionId: district.definitionId,
      control: copyDistrictControl(district.control)
    })),
    settlements: world.state.settlements.map((settlement) => ({
      definitionId: settlement.definitionId,
      currentDistrictId: settlement.currentDistrictId
    })),
    routes: world.state.routes.map(copySimpleRuntimeState)
  };
  const state =
    world.state.m2 === undefined
      ? stateWithoutM2
      : {
          ...stateWithoutM2,
          m2: copyM2EconomyPopulationState(world.state.m2)
        };

  return {
    schemaVersion: 0,
    meta: {
      schemaVersion: 0,
      seed: world.meta.seed,
      contentManifestHash: world.meta.contentManifestHash,
      currentDay: world.meta.currentDay,
      revision: world.meta.revision,
      hashAlgorithm: SAVE_ENVELOPE_V1_HASH_ALGORITHM,
      stateHash: world.meta.stateHash
    },
    definitions: {
      polities: world.definitions.polities.map(copySimpleDefinition),
      persons: world.definitions.persons.map(copySimpleDefinition),
      districts: world.definitions.districts.map(copySimpleDefinition),
      settlements: world.definitions.settlements.map((settlement) => ({
        id: settlement.id,
        displayNameKey: settlement.displayNameKey,
        districtId: settlement.districtId
      })),
      routes: world.definitions.routes.map((route) => ({
        id: route.id,
        fromDistrictId: route.fromDistrictId,
        toDistrictId: route.toDistrictId,
        lengthInMapUnits: route.lengthInMapUnits
      }))
    },
    state
  };
}

export function saveWorldStateV0DtoToCandidate(snapshot: unknown, scheduler?: unknown): unknown {
  if (!isRecord(snapshot)) {
    return snapshot;
  }

  const parsedSnapshot = parseSaveWorldSnapshotV0Dto(snapshot);
  if (!parsedSnapshot.ok) {
    return snapshot;
  }

  const parsedScheduler = scheduler === undefined ? undefined : parseSaveSchedulerV1Dto(scheduler);
  const candidateScheduler =
    parsedScheduler !== undefined && parsedScheduler.ok
      ? parsedScheduler.value
      : {
          schedulerVersion: 1,
          systemOrderVersion: 1,
          fixedStepDurationInDays: 1,
          lastCompletedDay: parsedSnapshot.value.meta.currentDay,
          pendingCommandCount: 0
        };

  const stateWithoutM2 = {
    ...parsedSnapshot.value.state,
    persons: parsedSnapshot.value.state.persons.map((person) => ({
      definitionId: person.definitionId,
      currentDistrictId: person.currentDistrictId === null ? undefined : person.currentDistrictId
    }))
  };
  const state =
    parsedSnapshot.value.state.m2 === undefined
      ? stateWithoutM2
      : {
          ...stateWithoutM2,
          m2: copyM2EconomyPopulationState(parsedSnapshot.value.state.m2)
        };

  return {
    meta: parsedSnapshot.value.meta,
    definitions: parsedSnapshot.value.definitions,
    state,
    scheduler: candidateScheduler
  };
}

function parseSaveEnvelopeV1(
  input: unknown
):
  | { readonly ok: true; readonly value: SaveEnvelopeV1 }
  | { readonly ok: false; readonly reasons: readonly SaveLoadRejectionReasonV1[] } {
  if (!isRecord(input)) {
    return {
      ok: false,
      reasons: [reason("invalid-schema", "$", "Save envelope must be an object.")]
    };
  }

  if (input["magic"] !== SAVE_ENVELOPE_V1_MAGIC) {
    return {
      ok: false,
      reasons: [reason("invalid-magic", "magic", "Save envelope magic is not supported.")]
    };
  }

  if (input["schemaVersion"] !== SAVE_ENVELOPE_V1_SCHEMA_VERSION) {
    return {
      ok: false,
      reasons: [
        reason(
          "unsupported-schema-version",
          "schemaVersion",
          "Save envelope schemaVersion must be 1."
        )
      ]
    };
  }

  const errors: SaveLoadRejectionReasonV1[] = [];
  const header = parseSaveHeaderV1(input["header"], errors);
  const body = parseSaveBodyV1(input["body"], errors);
  if (header === undefined || body === undefined || errors.length > 0) {
    return { ok: false, reasons: errors };
  }

  validateHeaderBodyConsistency(header, body, errors);
  if (errors.length > 0) {
    return { ok: false, reasons: errors };
  }

  return {
    ok: true,
    value: {
      magic: SAVE_ENVELOPE_V1_MAGIC,
      schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
      header,
      body
    }
  };
}

function parseSaveHeaderV1(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveHeaderV1 | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "header", "Save header must be an object."));
    return undefined;
  }

  if (input["magic"] !== SAVE_ENVELOPE_V1_MAGIC) {
    errors.push(reason("invalid-magic", "header.magic", "Save header magic is not supported."));
  }
  if (input["schemaVersion"] !== SAVE_ENVELOPE_V1_SCHEMA_VERSION) {
    errors.push(
      reason(
        "unsupported-schema-version",
        "header.schemaVersion",
        "Save header schemaVersion must be 1."
      )
    );
  }
  if (input["checksumAlgorithm"] !== SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM) {
    errors.push(
      reason(
        "invalid-schema",
        "header.checksumAlgorithm",
        `Save checksumAlgorithm must be ${SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM}.`
      )
    );
  }

  const build = parseBuildMetadata(input["build"], errors);
  const contentManifestHash = readNonEmptyString(
    input,
    "contentManifestHash",
    "header.contentManifestHash",
    errors
  );
  const scenarioId = readNonEmptyString(input, "scenarioId", "header.scenarioId", errors);
  const seed = readNonnegativeSafeInteger(input, "seed", "header.seed", errors);
  const currentDay = readNonnegativeSafeInteger(input, "currentDay", "header.currentDay", errors);
  const checksum = readChecksum(input, "checksum", "header.checksum", errors);

  if (
    build === undefined ||
    contentManifestHash === undefined ||
    scenarioId === undefined ||
    seed === undefined ||
    currentDay === undefined ||
    checksum === undefined
  ) {
    return undefined;
  }

  return {
    magic: SAVE_ENVELOPE_V1_MAGIC,
    schemaVersion: SAVE_ENVELOPE_V1_SCHEMA_VERSION,
    build,
    contentManifestHash,
    scenarioId,
    seed,
    currentDay,
    checksumAlgorithm: SAVE_ENVELOPE_V1_CHECKSUM_ALGORITHM,
    checksum
  };
}

function parseBuildMetadata(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveBuildMetadataV1 | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "header.build", "Save build metadata must be an object."));
    return undefined;
  }

  const appVersion = readNonEmptyString(input, "appVersion", "header.build.appVersion", errors);
  const source = input["source"];
  if (source !== "node-runner" && source !== "test" && source !== "worker") {
    errors.push(reason("invalid-schema", "header.build.source", "Save build source is invalid."));
  }
  if (input["codecVersion"] !== "save-envelope-v1") {
    errors.push(
      reason(
        "invalid-schema",
        "header.build.codecVersion",
        "Save codecVersion must be save-envelope-v1."
      )
    );
  }

  if (
    appVersion === undefined ||
    (source !== "node-runner" && source !== "test" && source !== "worker")
  ) {
    return undefined;
  }

  return {
    appVersion,
    source,
    codecVersion: "save-envelope-v1"
  };
}

function parseSaveBodyV1(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveBodyV1 | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "body", "Save body must be an object."));
    return undefined;
  }

  const snapshot = parseSaveWorldSnapshotV0Dto(input["authoritativeSnapshot"], errors);
  const scheduler = parseSaveSchedulerV1Dto(input["scheduler"], errors);
  const rng = parseSaveRngCompatibilityV1Dto(input["rng"], errors);
  const commandTail = parseCommandTail(input["commandTail"], errors);
  const eventTail = parseEventTail(input["eventTail"], errors);

  if (
    !snapshot.ok ||
    !scheduler.ok ||
    !rng.ok ||
    commandTail === undefined ||
    eventTail === undefined
  ) {
    return undefined;
  }

  return {
    authoritativeSnapshot: snapshot.value,
    scheduler: scheduler.value,
    rng: rng.value,
    commandTail,
    eventTail
  };
}

function parseSaveWorldSnapshotV0Dto(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[] = []
): { readonly ok: true; readonly value: SaveWorldSnapshotV0Dto } | { readonly ok: false } {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", "body.authoritativeSnapshot", "Save snapshot must be an object.")
    );
    return { ok: false };
  }

  if (input["schemaVersion"] !== 0) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.schemaVersion",
        "Save snapshot schemaVersion must be 0."
      )
    );
  }

  const meta = parseWorldMeta(input["meta"], errors);
  const definitions = parseWorldDefinitions(input["definitions"], errors);
  const state = parseWorldRuntimeState(input["state"], errors);
  if (meta === undefined || definitions === undefined || state === undefined) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      schemaVersion: 0,
      meta,
      definitions,
      state
    }
  };
}

function parseWorldMeta(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveWorldMetaV0Dto | undefined {
  if (!isRecord(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.meta",
        "Save snapshot meta must be an object."
      )
    );
    return undefined;
  }

  if (input["schemaVersion"] !== 0) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.meta.schemaVersion",
        "World meta schemaVersion must be 0."
      )
    );
  }
  if (input["hashAlgorithm"] !== SAVE_ENVELOPE_V1_HASH_ALGORITHM) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.meta.hashAlgorithm",
        `World meta hashAlgorithm must be ${SAVE_ENVELOPE_V1_HASH_ALGORITHM}.`
      )
    );
  }

  const seed = readNonnegativeSafeInteger(
    input,
    "seed",
    "body.authoritativeSnapshot.meta.seed",
    errors
  );
  const contentManifestHash = readNonEmptyString(
    input,
    "contentManifestHash",
    "body.authoritativeSnapshot.meta.contentManifestHash",
    errors
  );
  const currentDay = readNonnegativeSafeInteger(
    input,
    "currentDay",
    "body.authoritativeSnapshot.meta.currentDay",
    errors
  );
  const revision = readNonnegativeSafeInteger(
    input,
    "revision",
    "body.authoritativeSnapshot.meta.revision",
    errors
  );
  const stateHash = readChecksum(
    input,
    "stateHash",
    "body.authoritativeSnapshot.meta.stateHash",
    errors
  );
  if (
    seed === undefined ||
    contentManifestHash === undefined ||
    currentDay === undefined ||
    revision === undefined ||
    stateHash === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 0,
    seed,
    contentManifestHash,
    currentDay,
    revision,
    hashAlgorithm: SAVE_ENVELOPE_V1_HASH_ALGORITHM,
    stateHash
  };
}

function parseWorldDefinitions(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveWorldDefinitionsV0Dto | undefined {
  if (!isRecord(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.definitions",
        "Save definitions must be an object."
      )
    );
    return undefined;
  }

  const polities = parseSimpleDefinitions(input["polities"], "polities", errors);
  const persons = parseSimpleDefinitions(input["persons"], "persons", errors);
  const districts = parseSimpleDefinitions(input["districts"], "districts", errors);
  const settlements = parseSettlements(input["settlements"], errors);
  const routes = parseRoutes(input["routes"], errors);

  if (
    polities === undefined ||
    persons === undefined ||
    districts === undefined ||
    settlements === undefined ||
    routes === undefined
  ) {
    return undefined;
  }

  return { polities, persons, districts, settlements, routes };
}

function parseWorldRuntimeState(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): SaveWorldRuntimeStateV0Dto | undefined {
  if (!isRecord(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state",
        "Save runtime state must be an object."
      )
    );
    return undefined;
  }

  const polities = parseSimpleRuntimeStates(input["polities"], "polities", errors);
  const persons = parsePersonStates(input["persons"], errors);
  const districts = parseDistrictStates(input["districts"], errors);
  const settlements = parseSettlementStates(input["settlements"], errors);
  const routes = parseSimpleRuntimeStates(input["routes"], "routes", errors);
  const m2 =
    input["m2"] === undefined
      ? undefined
      : parseM2EconomyPopulationState(input["m2"], "body.authoritativeSnapshot.state.m2", errors);
  if (
    polities === undefined ||
    persons === undefined ||
    districts === undefined ||
    settlements === undefined ||
    routes === undefined ||
    (input["m2"] !== undefined && m2 === undefined)
  ) {
    return undefined;
  }

  const state = { polities, persons, districts, settlements, routes };
  return m2 === undefined ? state : { ...state, m2 };
}

function parseSaveSchedulerV1Dto(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[] = []
): { readonly ok: true; readonly value: SaveSchedulerV1Dto } | { readonly ok: false } {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", "body.scheduler", "Save scheduler must be an object."));
    return { ok: false };
  }
  if (input["schedulerVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", "body.scheduler.schedulerVersion", "schedulerVersion must be 1.")
    );
  }
  if (input["systemOrderVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", "body.scheduler.systemOrderVersion", "systemOrderVersion must be 1.")
    );
  }
  if (input["fixedStepDurationInDays"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        "body.scheduler.fixedStepDurationInDays",
        "fixedStepDurationInDays must be 1."
      )
    );
  }
  const lastCompletedDay = readNonnegativeSafeInteger(
    input,
    "lastCompletedDay",
    "body.scheduler.lastCompletedDay",
    errors
  );
  const pendingCommandCount = readNonnegativeSafeInteger(
    input,
    "pendingCommandCount",
    "body.scheduler.pendingCommandCount",
    errors
  );
  if (lastCompletedDay === undefined || pendingCommandCount === undefined) {
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      schedulerVersion: 1,
      systemOrderVersion: 1,
      fixedStepDurationInDays: 1,
      lastCompletedDay,
      pendingCommandCount
    }
  };
}

function parseSaveRngCompatibilityV1Dto(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): { readonly ok: true; readonly value: SaveRngCompatibilityV1Dto } | { readonly ok: false } {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", "body.rng", "Save rng compatibility data must be an object.")
    );
    return { ok: false };
  }
  if (input["schemaVersion"] !== 1) {
    errors.push(reason("invalid-schema", "body.rng.schemaVersion", "rng schemaVersion must be 1."));
  }
  if (input["algorithm"] !== "sfc32-fnv1a32-domain-v1") {
    errors.push(
      reason(
        "invalid-schema",
        "body.rng.algorithm",
        "rng algorithm must be sfc32-fnv1a32-domain-v1."
      )
    );
  }
  const savedStreams = input["savedStreams"];
  if (!Array.isArray(savedStreams)) {
    errors.push(
      reason("invalid-schema", "body.rng.savedStreams", "rng savedStreams must be an array.")
    );
    return { ok: false };
  }

  return {
    ok: true,
    value: {
      schemaVersion: 1,
      algorithm: "sfc32-fnv1a32-domain-v1",
      savedStreams: savedStreams.map((stream) => stream)
    }
  };
}

function parseSimpleDefinitions(
  input: unknown,
  name: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSimpleDefinitionDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        `body.authoritativeSnapshot.definitions.${name}`,
        `${name} definitions must be an array.`
      )
    );
    return undefined;
  }

  return input.map((entry, index) =>
    parseSimpleDefinition(entry, `body.authoritativeSnapshot.definitions.${name}[${index}]`, errors)
  );
}

function parseSimpleDefinition(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveSimpleDefinitionDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "Definition entry must be an object."));
    return { id: 0, displayNameKey: "" };
  }
  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    displayNameKey:
      readNonEmptyString(input, "displayNameKey", `${path}.displayNameKey`, errors) ?? ""
  };
}

function parseSettlements(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSettlementDefinitionDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.definitions.settlements",
        "settlement definitions must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.definitions.settlements[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Settlement definition must be an object."));
      return { id: 0, displayNameKey: "", districtId: 0 };
    }
    return {
      id: readPositiveSafeInteger(entry, "id", `${path}.id`, errors) ?? 0,
      displayNameKey:
        readNonEmptyString(entry, "displayNameKey", `${path}.displayNameKey`, errors) ?? "",
      districtId: readPositiveSafeInteger(entry, "districtId", `${path}.districtId`, errors) ?? 0
    };
  });
}

function parseRoutes(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveRouteDefinitionDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.definitions.routes",
        "route definitions must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.definitions.routes[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Route definition must be an object."));
      return { id: 0, fromDistrictId: 0, toDistrictId: 0, lengthInMapUnits: 0 };
    }
    return {
      id: readPositiveSafeInteger(entry, "id", `${path}.id`, errors) ?? 0,
      fromDistrictId:
        readPositiveSafeInteger(entry, "fromDistrictId", `${path}.fromDistrictId`, errors) ?? 0,
      toDistrictId:
        readPositiveSafeInteger(entry, "toDistrictId", `${path}.toDistrictId`, errors) ?? 0,
      lengthInMapUnits:
        readPositiveSafeInteger(entry, "lengthInMapUnits", `${path}.lengthInMapUnits`, errors) ?? 0
    };
  });
}

function parseSimpleRuntimeStates(
  input: unknown,
  name: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSimpleRuntimeStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        `body.authoritativeSnapshot.state.${name}`,
        `${name} runtime states must be an array.`
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.${name}[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Runtime state entry must be an object."));
      return { definitionId: 0 };
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0
    };
  });
}

function parsePersonStates(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SavePersonStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state.persons",
        "person states must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.persons[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Person state must be an object."));
      return { definitionId: 0, currentDistrictId: null };
    }
    const currentDistrictId = entry["currentDistrictId"];
    if (currentDistrictId !== null && !isPositiveSafeInteger(currentDistrictId)) {
      errors.push(
        reason(
          "invalid-schema",
          `${path}.currentDistrictId`,
          "currentDistrictId must be a positive safe integer or null."
        )
      );
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0,
      currentDistrictId:
        currentDistrictId === null || isPositiveSafeInteger(currentDistrictId)
          ? currentDistrictId
          : null
    };
  });
}

function parseDistrictStates(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveDistrictStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state.districts",
        "district states must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.districts[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "District state must be an object."));
      return { definitionId: 0, control: { kind: "uncontrolled" } };
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0,
      control: parseDistrictControl(entry["control"], `${path}.control`, errors)
    };
  });
}

function parseDistrictControl(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveDistrictControlDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "District control must be an object."));
    return { kind: "uncontrolled" };
  }
  if (input["kind"] === "uncontrolled") {
    return { kind: "uncontrolled" };
  }
  if (input["kind"] !== "controlled") {
    errors.push(reason("invalid-schema", `${path}.kind`, "District control kind is invalid."));
    return { kind: "uncontrolled" };
  }
  return {
    kind: "controlled",
    controllerPolityId:
      readPositiveSafeInteger(input, "controllerPolityId", `${path}.controllerPolityId`, errors) ??
      0
  };
}

function parseSettlementStates(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveSettlementStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        "body.authoritativeSnapshot.state.settlements",
        "settlement states must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.authoritativeSnapshot.state.settlements[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "Settlement state must be an object."));
      return { definitionId: 0, currentDistrictId: 0 };
    }
    return {
      definitionId:
        readPositiveSafeInteger(entry, "definitionId", `${path}.definitionId`, errors) ?? 0,
      currentDistrictId:
        readPositiveSafeInteger(entry, "currentDistrictId", `${path}.currentDistrictId`, errors) ??
        0
    };
  });
}

function parseM2EconomyPopulationState(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2EconomyPopulationStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 economy population state must be an object."));
    return undefined;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.schemaVersion`,
        "M2 economy population schemaVersion must be 1."
      )
    );
  }

  const populationGroups = parseM2PopulationGroups(input["populationGroups"], path, errors);
  const agriculture = parseM2Agriculture(input["agriculture"], path, errors);
  const market = parseM2Market(input["market"], path, errors);
  const transport = parseM2Transport(input["transport"], `${path}.transport`, errors);

  if (
    populationGroups === undefined ||
    agriculture === undefined ||
    market === undefined ||
    transport === undefined
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    populationGroups,
    agriculture,
    market,
    transport
  };
}

function parseM2PopulationGroups(
  input: unknown,
  basePath: string,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveM2PopulationGroupStateDto[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(
      reason(
        "invalid-schema",
        `${basePath}.populationGroups`,
        "M2 populationGroups must be an array."
      )
    );
    return undefined;
  }

  return input.map((entry, index) =>
    parseM2PopulationGroup(entry, `${basePath}.populationGroups[${index}]`, errors)
  );
}

function parseM2PopulationGroup(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2PopulationGroupStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2PopulationGroupState entry must be an object."));
    return fallbackM2PopulationGroup();
  }

  const committedLabor = input["committedLabor"];
  const parsedCommittedLabor = Array.isArray(committedLabor)
    ? committedLabor.map((entry, index) =>
        parseM2LaborCommitment(entry, `${path}.committedLabor[${index}]`, errors)
      )
    : undefined;
  if (parsedCommittedLabor === undefined) {
    errors.push(
      reason("invalid-schema", `${path}.committedLabor`, "M2 committedLabor must be an array.")
    );
  }

  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    totalPeople:
      readNonnegativeSafeInteger(input, "totalPeople", `${path}.totalPeople`, errors) ?? 0,
    workingPeople:
      readNonnegativeSafeInteger(input, "workingPeople", `${path}.workingPeople`, errors) ?? 0,
    dependentPeople:
      readNonnegativeSafeInteger(input, "dependentPeople", `${path}.dependentPeople`, errors) ?? 0,
    availableLabor:
      readNonnegativeSafeInteger(input, "availableLabor", `${path}.availableLabor`, errors) ?? 0,
    grainStock: readNonnegativeSafeInteger(input, "grainStock", `${path}.grainStock`, errors) ?? 0,
    cashStock: readNonnegativeSafeInteger(input, "cashStock", `${path}.cashStock`, errors) ?? 0,
    committedLabor: parsedCommittedLabor ?? []
  };
}

function parseM2LaborCommitment(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2LaborCommitmentStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2LaborCommitmentState entry must be an object."));
    return { purpose: "mobilized", laborAmount: 0, startDay: 0, releaseDay: 0 };
  }

  if (input["purpose"] !== "mobilized") {
    errors.push(
      reason("invalid-schema", `${path}.purpose`, "M2 labor commitment purpose must be mobilized.")
    );
  }

  return {
    purpose: "mobilized",
    laborAmount: readPositiveSafeInteger(input, "laborAmount", `${path}.laborAmount`, errors) ?? 0,
    startDay: readNonnegativeSafeInteger(input, "startDay", `${path}.startDay`, errors) ?? 0,
    releaseDay: readNonnegativeSafeInteger(input, "releaseDay", `${path}.releaseDay`, errors) ?? 0
  };
}

function parseM2Agriculture(
  input: unknown,
  basePath: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2EconomyPopulationStateDto["agriculture"] | undefined {
  const path = `${basePath}.agriculture`;
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 agriculture must be an object."));
    return undefined;
  }

  const districts = input["districts"];
  if (!Array.isArray(districts)) {
    errors.push(
      reason("invalid-schema", `${path}.districts`, "M2 agriculture districts must be an array.")
    );
    return undefined;
  }

  return {
    districts: districts.map((entry, index) =>
      parseM2AgricultureDistrict(entry, `${path}.districts[${index}]`, errors)
    )
  };
}

function parseM2AgricultureDistrict(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictAgricultureStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2DistrictAgricultureState entry must be an object.")
    );
    return {
      districtId: 0,
      phase: "fallow",
      daysInPhase: 0,
      accumulatedFarmLabor: 0,
      expectedHarvestGrain: 0,
      lastHarvestGrain: 0
    };
  }

  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    phase: parseM2AgriculturePhase(input["phase"], `${path}.phase`, errors),
    daysInPhase:
      readNonnegativeSafeInteger(input, "daysInPhase", `${path}.daysInPhase`, errors) ?? 0,
    accumulatedFarmLabor:
      readNonnegativeSafeInteger(
        input,
        "accumulatedFarmLabor",
        `${path}.accumulatedFarmLabor`,
        errors
      ) ?? 0,
    expectedHarvestGrain:
      readNonnegativeSafeInteger(
        input,
        "expectedHarvestGrain",
        `${path}.expectedHarvestGrain`,
        errors
      ) ?? 0,
    lastHarvestGrain:
      readNonnegativeSafeInteger(input, "lastHarvestGrain", `${path}.lastHarvestGrain`, errors) ?? 0
  };
}

function parseM2Market(
  input: unknown,
  basePath: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2EconomyPopulationStateDto["market"] | undefined {
  const path = `${basePath}.market`;
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 market must be an object."));
    return undefined;
  }

  const districts = input["districts"];
  if (!Array.isArray(districts)) {
    errors.push(
      reason("invalid-schema", `${path}.districts`, "M2 market districts must be an array.")
    );
    return undefined;
  }

  return {
    districts: districts.map((entry, index) =>
      parseM2MarketDistrict(entry, `${path}.districts[${index}]`, errors)
    )
  };
}

function parseM2MarketDistrict(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictMarketStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2DistrictMarketState entry must be an object."));
    return fallbackM2MarketDistrict();
  }

  const cashFlow = parseM2MarketCashFlow(input["cashFlow"], `${path}.cashFlow`, errors);
  const grainFlow = parseM2MarketGrainFlow(input["grainFlow"], `${path}.grainFlow`, errors);

  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    grainPriceCashPerHundred:
      readPositiveSafeInteger(
        input,
        "grainPriceCashPerHundred",
        `${path}.grainPriceCashPerHundred`,
        errors
      ) ?? 0,
    cashFlow: cashFlow ?? { cumulativeMobilizationCost: 0, lastDailyCashDelta: 0 },
    grainFlow: grainFlow ?? { lastHarvestDelta: 0 }
  };
}

function parseM2MarketCashFlow(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictMarketStateDto["cashFlow"] | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 market cashFlow must be an object."));
    return undefined;
  }

  return {
    cumulativeMobilizationCost:
      readNonnegativeSafeInteger(
        input,
        "cumulativeMobilizationCost",
        `${path}.cumulativeMobilizationCost`,
        errors
      ) ?? 0,
    lastDailyCashDelta:
      readNonnegativeSafeInteger(
        input,
        "lastDailyCashDelta",
        `${path}.lastDailyCashDelta`,
        errors
      ) ?? 0
  };
}

function parseM2MarketGrainFlow(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictMarketStateDto["grainFlow"] | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 market grainFlow must be an object."));
    return undefined;
  }

  return {
    lastHarvestDelta:
      readNonnegativeSafeInteger(input, "lastHarvestDelta", `${path}.lastHarvestDelta`, errors) ?? 0
  };
}

function parseM2Transport(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2TransportStateDto | undefined {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2 transport must be an object."));
    return undefined;
  }

  if (input["schemaVersion"] !== 1) {
    errors.push(
      reason("invalid-schema", `${path}.schemaVersion`, "M2 transport schemaVersion must be 1.")
    );
  }

  const routes = input["routes"];
  const districtSeasonality = input["districtSeasonality"];
  const regionalCurves = input["regionalCurves"];
  if (!Array.isArray(routes)) {
    errors.push(
      reason("invalid-schema", `${path}.routes`, "M2 transport routes must be an array.")
    );
  }
  if (!Array.isArray(districtSeasonality)) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.districtSeasonality`,
        "M2 transport districtSeasonality must be an array."
      )
    );
  }
  if (!Array.isArray(regionalCurves)) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.regionalCurves`,
        "M2 transport regionalCurves must be an array."
      )
    );
  }
  if (
    !Array.isArray(routes) ||
    !Array.isArray(districtSeasonality) ||
    !Array.isArray(regionalCurves)
  ) {
    return undefined;
  }

  return {
    schemaVersion: 1,
    routes: routes.map((entry, index) =>
      parseM2TransportRoute(entry, `${path}.routes[${index}]`, errors)
    ),
    districtSeasonality: districtSeasonality.map((entry, index) =>
      parseM2DistrictSeasonality(entry, `${path}.districtSeasonality[${index}]`, errors)
    ),
    regionalCurves: regionalCurves.map((entry, index) =>
      parseM2RegionalSeasonalCurve(entry, `${path}.regionalCurves[${index}]`, errors)
    )
  };
}

function parseM2TransportRoute(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2RouteTransportEdgeStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2RouteTransportEdgeState entry must be an object.")
    );
    return {
      routeId: 0,
      fromDistrictId: 0,
      toDistrictId: 0,
      routeKind: "road",
      baseTravelCost: 0,
      baseCapacity: 0
    };
  }

  return {
    routeId: readPositiveSafeInteger(input, "routeId", `${path}.routeId`, errors) ?? 0,
    fromDistrictId:
      readPositiveSafeInteger(input, "fromDistrictId", `${path}.fromDistrictId`, errors) ?? 0,
    toDistrictId:
      readPositiveSafeInteger(input, "toDistrictId", `${path}.toDistrictId`, errors) ?? 0,
    routeKind: parseM2RouteKind(input["routeKind"], `${path}.routeKind`, errors),
    baseTravelCost:
      readPositiveSafeInteger(input, "baseTravelCost", `${path}.baseTravelCost`, errors) ?? 0,
    baseCapacity:
      readPositiveSafeInteger(input, "baseCapacity", `${path}.baseCapacity`, errors) ?? 0
  };
}

function parseM2DistrictSeasonality(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2DistrictSeasonalityStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2DistrictSeasonalityState entry must be an object.")
    );
    return { districtId: 0, regionalCurveId: 0 };
  }

  return {
    districtId: readPositiveSafeInteger(input, "districtId", `${path}.districtId`, errors) ?? 0,
    regionalCurveId:
      readPositiveSafeInteger(input, "regionalCurveId", `${path}.regionalCurveId`, errors) ?? 0
  };
}

function parseM2RegionalSeasonalCurve(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2RegionalSeasonalCurveStateDto {
  if (!isRecord(input)) {
    errors.push(
      reason("invalid-schema", path, "M2RegionalSeasonalCurveState entry must be an object.")
    );
    return { id: 0, monthlyValues: [] };
  }

  const monthlyValues = input["monthlyValues"];
  if (!Array.isArray(monthlyValues) || monthlyValues.length !== 12) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.monthlyValues`,
        "M2 regional seasonal curve monthlyValues must contain 12 months."
      )
    );
    return {
      id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
      monthlyValues: []
    };
  }

  return {
    id: readPositiveSafeInteger(input, "id", `${path}.id`, errors) ?? 0,
    monthlyValues: monthlyValues.map((entry, index) =>
      parseM2SeasonalMonth(entry, `${path}.monthlyValues[${index}]`, index + 1, errors)
    )
  };
}

function parseM2SeasonalMonth(
  input: unknown,
  path: string,
  expectedMonth: number,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2SeasonalMonthStateDto {
  if (!isRecord(input)) {
    errors.push(reason("invalid-schema", path, "M2SeasonalMonthState entry must be an object."));
    return {
      month: expectedMonth,
      monsoonIntensityBps: 0,
      agricultureWorkBps: 0,
      riverNavigabilityBps: 0,
      roadTravelCostBps: 1
    };
  }

  if (input["month"] !== expectedMonth) {
    errors.push(
      reason(
        "invalid-schema",
        `${path}.month`,
        "M2 seasonal month entries must be ordered from month 1 through month 12."
      )
    );
  }

  return {
    month: readIntegerInRange(input, "month", `${path}.month`, 1, 12, errors) ?? expectedMonth,
    monsoonIntensityBps:
      readIntegerInRange(
        input,
        "monsoonIntensityBps",
        `${path}.monsoonIntensityBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    agricultureWorkBps:
      readIntegerInRange(
        input,
        "agricultureWorkBps",
        `${path}.agricultureWorkBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    riverNavigabilityBps:
      readIntegerInRange(
        input,
        "riverNavigabilityBps",
        `${path}.riverNavigabilityBps`,
        0,
        10_000,
        errors
      ) ?? 0,
    roadTravelCostBps:
      readIntegerInRange(
        input,
        "roadTravelCostBps",
        `${path}.roadTravelCostBps`,
        1,
        30_000,
        errors
      ) ?? 1
  };
}

function parseCommandTail(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveCommandTailEntryV1[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", "body.commandTail", "commandTail must be an array."));
    return undefined;
  }
  if (input.length > MAX_TAIL_COUNT) {
    errors.push(
      reason("invalid-schema", "body.commandTail", "commandTail exceeds the v1 short-tail limit.")
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.commandTail[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "commandTail entry must be an object."));
      return { sequence: 0, command: fallbackAdvanceCommand() };
    }
    const sequence = readPositiveSafeInteger(entry, "sequence", `${path}.sequence`, errors) ?? 0;
    const command = parseGameCommandV1(entry["command"]);
    if (!command.ok) {
      errors.push(
        reason("invalid-schema", `${path}.command.${command.error.path}`, command.error.message)
      );
      return { sequence, command: fallbackAdvanceCommand() };
    }
    return {
      sequence,
      command: command.value
    };
  });
}

function parseEventTail(
  input: unknown,
  errors: SaveLoadRejectionReasonV1[]
): readonly SaveEventTailEntryV1[] | undefined {
  if (!Array.isArray(input)) {
    errors.push(reason("invalid-schema", "body.eventTail", "eventTail must be an array."));
    return undefined;
  }
  if (input.length > MAX_TAIL_COUNT) {
    errors.push(
      reason("invalid-schema", "body.eventTail", "eventTail exceeds the v1 short-tail limit.")
    );
    return undefined;
  }

  return input.map((entry, index) => {
    const path = `body.eventTail[${index}]`;
    if (!isRecord(entry)) {
      errors.push(reason("invalid-schema", path, "eventTail entry must be an object."));
      return { sequence: 0, event: {} };
    }
    const event = entry["event"];
    if (!isRecord(event)) {
      errors.push(reason("invalid-schema", `${path}.event`, "eventTail event must be an object."));
      return { sequence: 0, event: {} };
    }
    return {
      sequence: readPositiveSafeInteger(entry, "sequence", `${path}.sequence`, errors) ?? 0,
      event: copyRecord(event)
    };
  });
}

function validateHeaderBodyConsistency(
  header: SaveHeaderV1,
  body: SaveBodyV1,
  errors: SaveLoadRejectionReasonV1[]
): void {
  if (header.contentManifestHash !== body.authoritativeSnapshot.meta.contentManifestHash) {
    errors.push(
      reason(
        "invalid-schema",
        "header.contentManifestHash",
        "Save header contentManifestHash must match authoritative snapshot meta."
      )
    );
  }
  if (header.seed !== body.authoritativeSnapshot.meta.seed) {
    errors.push(
      reason(
        "invalid-schema",
        "header.seed",
        "Save header seed must match authoritative snapshot meta."
      )
    );
  }
  if (header.currentDay !== body.authoritativeSnapshot.meta.currentDay) {
    errors.push(
      reason(
        "invalid-schema",
        "header.currentDay",
        "Save header currentDay must match authoritative snapshot meta."
      )
    );
  }
  if (body.scheduler.lastCompletedDay !== body.authoritativeSnapshot.meta.currentDay) {
    errors.push(
      reason(
        "invalid-schema",
        "body.scheduler.lastCompletedDay",
        "Save scheduler lastCompletedDay must match authoritative snapshot currentDay."
      )
    );
  }
}

function checksumSaveBodyV1(body: SaveBodyV1): string {
  return fixedHex(hashText(canonicalJson(body)));
}

function copySaveBody(body: SaveBodyV1): SaveBodyV1 {
  const stateWithoutM2 = {
    polities: body.authoritativeSnapshot.state.polities.map(copySimpleRuntimeState),
    persons: body.authoritativeSnapshot.state.persons.map((person) => ({
      definitionId: person.definitionId,
      currentDistrictId: person.currentDistrictId
    })),
    districts: body.authoritativeSnapshot.state.districts.map((district) => ({
      definitionId: district.definitionId,
      control: copyDistrictControl(district.control)
    })),
    settlements: body.authoritativeSnapshot.state.settlements.map((settlement) => ({
      definitionId: settlement.definitionId,
      currentDistrictId: settlement.currentDistrictId
    })),
    routes: body.authoritativeSnapshot.state.routes.map(copySimpleRuntimeState)
  };
  const state =
    body.authoritativeSnapshot.state.m2 === undefined
      ? stateWithoutM2
      : {
          ...stateWithoutM2,
          m2: copyM2EconomyPopulationState(body.authoritativeSnapshot.state.m2)
        };

  return {
    authoritativeSnapshot: {
      schemaVersion: 0,
      meta: { ...body.authoritativeSnapshot.meta },
      definitions: {
        polities: body.authoritativeSnapshot.definitions.polities.map(copySimpleDefinition),
        persons: body.authoritativeSnapshot.definitions.persons.map(copySimpleDefinition),
        districts: body.authoritativeSnapshot.definitions.districts.map(copySimpleDefinition),
        settlements: body.authoritativeSnapshot.definitions.settlements.map((settlement) => ({
          id: settlement.id,
          displayNameKey: settlement.displayNameKey,
          districtId: settlement.districtId
        })),
        routes: body.authoritativeSnapshot.definitions.routes.map((route) => ({
          id: route.id,
          fromDistrictId: route.fromDistrictId,
          toDistrictId: route.toDistrictId,
          lengthInMapUnits: route.lengthInMapUnits
        }))
      },
      state
    },
    scheduler: { ...body.scheduler },
    rng: {
      schemaVersion: 1,
      algorithm: body.rng.algorithm,
      savedStreams: body.rng.savedStreams.map((stream) => stream)
    },
    commandTail: body.commandTail.map((entry) => ({
      sequence: entry.sequence,
      command: entry.command
    })),
    eventTail: body.eventTail.map((entry) => ({
      sequence: entry.sequence,
      event: copyRecord(entry.event)
    }))
  };
}

function copySimpleDefinition(definition: SaveSimpleDefinitionDto): SaveSimpleDefinitionDto {
  return {
    id: definition.id,
    displayNameKey: definition.displayNameKey
  };
}

function copySimpleRuntimeState(state: SaveSimpleRuntimeStateDto): SaveSimpleRuntimeStateDto {
  return {
    definitionId: state.definitionId
  };
}

function copyDistrictControl(control: SaveDistrictControlDto): SaveDistrictControlDto {
  switch (control.kind) {
    case "controlled":
      return {
        kind: "controlled",
        controllerPolityId: control.controllerPolityId
      };
    case "uncontrolled":
      return {
        kind: "uncontrolled"
      };
  }
}

function copyM2EconomyPopulationState(
  m2: SaveM2EconomyPopulationStateDto
): SaveM2EconomyPopulationStateDto {
  return {
    schemaVersion: 1,
    populationGroups: m2.populationGroups.map((group) => ({
      id: group.id,
      districtId: group.districtId,
      totalPeople: group.totalPeople,
      workingPeople: group.workingPeople,
      dependentPeople: group.dependentPeople,
      availableLabor: group.availableLabor,
      grainStock: group.grainStock,
      cashStock: group.cashStock,
      committedLabor: group.committedLabor.map((commitment) => ({
        purpose: commitment.purpose,
        laborAmount: commitment.laborAmount,
        startDay: commitment.startDay,
        releaseDay: commitment.releaseDay
      }))
    })),
    agriculture: {
      districts: m2.agriculture.districts.map((district) => ({
        districtId: district.districtId,
        phase: district.phase,
        daysInPhase: district.daysInPhase,
        accumulatedFarmLabor: district.accumulatedFarmLabor,
        expectedHarvestGrain: district.expectedHarvestGrain,
        lastHarvestGrain: district.lastHarvestGrain
      }))
    },
    market: {
      districts: m2.market.districts.map((district) => ({
        districtId: district.districtId,
        grainPriceCashPerHundred: district.grainPriceCashPerHundred,
        cashFlow: {
          cumulativeMobilizationCost: district.cashFlow.cumulativeMobilizationCost,
          lastDailyCashDelta: district.cashFlow.lastDailyCashDelta
        },
        grainFlow: {
          lastHarvestDelta: district.grainFlow.lastHarvestDelta
        }
      }))
    },
    transport: {
      schemaVersion: 1,
      routes: m2.transport.routes.map((route) => ({
        routeId: route.routeId,
        fromDistrictId: route.fromDistrictId,
        toDistrictId: route.toDistrictId,
        routeKind: route.routeKind,
        baseTravelCost: route.baseTravelCost,
        baseCapacity: route.baseCapacity
      })),
      districtSeasonality: m2.transport.districtSeasonality.map((entry) => ({
        districtId: entry.districtId,
        regionalCurveId: entry.regionalCurveId
      })),
      regionalCurves: m2.transport.regionalCurves.map((curve) => ({
        id: curve.id,
        monthlyValues: curve.monthlyValues.map((month) => ({
          month: month.month,
          monsoonIntensityBps: month.monsoonIntensityBps,
          agricultureWorkBps: month.agricultureWorkBps,
          riverNavigabilityBps: month.riverNavigabilityBps,
          roadTravelCostBps: month.roadTravelCostBps
        }))
      }))
    }
  };
}

function fallbackM2PopulationGroup(): SaveM2PopulationGroupStateDto {
  return {
    id: 0,
    districtId: 0,
    totalPeople: 0,
    workingPeople: 0,
    dependentPeople: 0,
    availableLabor: 0,
    grainStock: 0,
    cashStock: 0,
    committedLabor: []
  };
}

function fallbackM2MarketDistrict(): SaveM2DistrictMarketStateDto {
  return {
    districtId: 0,
    grainPriceCashPerHundred: 0,
    cashFlow: { cumulativeMobilizationCost: 0, lastDailyCashDelta: 0 },
    grainFlow: { lastHarvestDelta: 0 }
  };
}

function parseM2AgriculturePhase(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2AgriculturePhaseDto {
  if (input === "fallow" || input === "planting" || input === "growing" || input === "harvest") {
    return input;
  }

  errors.push(
    reason(
      "invalid-schema",
      path,
      "M2 agriculture phase must be fallow, planting, growing, or harvest."
    )
  );
  return "fallow";
}

function parseM2RouteKind(
  input: unknown,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): SaveM2RouteKindDto {
  if (input === "coast" || input === "river" || input === "road") {
    return input;
  }

  errors.push(reason("invalid-schema", path, "M2 routeKind must be coast, river, or road."));
  return "road";
}

function readNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): string | undefined {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a non-empty string.`));
  return undefined;
}

function readChecksum(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): string | undefined {
  const value = record[key];
  if (typeof value === "string" && /^[0-9a-f]{8}$/u.test(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be an 8-character lowercase hex hash.`));
  return undefined;
}

function readPositiveSafeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (isPositiveSafeInteger(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a positive safe integer.`));
  return undefined;
}

function readNonnegativeSafeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (isNonnegativeSafeInteger(value)) {
    return value;
  }
  errors.push(reason("invalid-schema", path, `${path} must be a nonnegative safe integer.`));
  return undefined;
}

function readIntegerInRange(
  record: Record<string, unknown>,
  key: string,
  path: string,
  minimum: number,
  maximum: number,
  errors: SaveLoadRejectionReasonV1[]
): number | undefined {
  const value = record[key];
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= minimum &&
    value <= maximum
  ) {
    return value;
  }

  errors.push(
    reason("invalid-schema", path, `${path} must be a safe integer from ${minimum} to ${maximum}.`)
  );
  return undefined;
}

function parseJsonBytes(
  bytes: Uint8Array
):
  | { readonly ok: true; readonly value: unknown }
  | { readonly ok: false; readonly reason: SaveLoadRejectionReasonV1 } {
  const decoded = decodeUtf8(bytes);
  if (!decoded.ok) {
    return {
      ok: false,
      reason: reason("malformed-json", "$", decoded.message)
    };
  }

  const text = decoded.text;
  try {
    return {
      ok: true,
      value: JSON.parse(text) as unknown
    };
  } catch {
    return {
      ok: false,
      reason: reason("malformed-json", "$", "Save payload must be valid JSON.")
    };
  }
}

function validateDepth(input: unknown, maxDepth: number): SaveLoadRejectionReasonV1 | null {
  if (!isNonnegativeSafeInteger(maxDepth) || maxDepth <= 0) {
    return reason("invalid-schema", "maxDepth", "maxDepth must be a positive safe integer.");
  }
  if (measureDepth(input, 0, maxDepth) > maxDepth) {
    return reason("depth-limit", "$", `Save JSON depth exceeds limit ${maxDepth}.`);
  }
  return null;
}

function measureDepth(input: unknown, currentDepth: number, maxDepth: number): number {
  if (currentDepth > maxDepth || typeof input !== "object" || input === null) {
    return currentDepth;
  }
  if (Array.isArray(input)) {
    return input.reduce(
      (depth, value) => Math.max(depth, measureDepth(value, currentDepth + 1, maxDepth)),
      currentDepth
    );
  }
  return Object.values(input).reduce(
    (depth, value) => Math.max(depth, measureDepth(value, currentDepth + 1, maxDepth)),
    currentDepth
  );
}

function canonicalJson(input: unknown): string {
  if (input === null) {
    return "null";
  }
  switch (typeof input) {
    case "boolean":
      return input ? "true" : "false";
    case "number":
      if (!Number.isFinite(input)) {
        throw new Error("Canonical JSON cannot encode non-finite numbers.");
      }
      return `${input}`;
    case "string":
      return JSON.stringify(input);
    case "object": {
      if (Array.isArray(input)) {
        return `[${input.map((value) => canonicalJson(value)).join(",")}]`;
      }
      const record = input as Record<string, unknown>;
      return `{${Object.keys(record)
        .sort(compareText)
        .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
        .join(",")}}`;
    }
    case "bigint":
    case "function":
    case "symbol":
    case "undefined":
      throw new Error(`Canonical JSON cannot encode ${typeof input}.`);
  }

  throw new Error("Canonical JSON received an unhandled value.");
}

function encodeUtf8(text: string): Uint8Array {
  const bytes: number[] = [];

  for (const character of text) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }

  return Uint8Array.from(bytes);
}

function decodeUtf8(
  bytes: Uint8Array
): { readonly ok: true; readonly text: string } | { readonly ok: false; readonly message: string } {
  const codePoints: number[] = [];
  let index = 0;

  while (index < bytes.length) {
    const first = bytes[index];
    if (first === undefined) {
      return { ok: false, message: "Save payload contains invalid UTF-8." };
    }

    if (first <= 0x7f) {
      codePoints.push(first);
      index += 1;
      continue;
    }

    if (first >= 0xc2 && first <= 0xdf) {
      const second = readContinuation(bytes, index + 1);
      if (second === undefined) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      codePoints.push(((first & 0x1f) << 6) | second);
      index += 2;
      continue;
    }

    if (first >= 0xe0 && first <= 0xef) {
      const second = readContinuation(bytes, index + 1);
      const third = readContinuation(bytes, index + 2);
      if (second === undefined || third === undefined) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      const codePoint = ((first & 0x0f) << 12) | (second << 6) | third;
      if (codePoint < 0x800 || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      codePoints.push(codePoint);
      index += 3;
      continue;
    }

    if (first >= 0xf0 && first <= 0xf4) {
      const second = readContinuation(bytes, index + 1);
      const third = readContinuation(bytes, index + 2);
      const fourth = readContinuation(bytes, index + 3);
      if (second === undefined || third === undefined || fourth === undefined) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      const codePoint = ((first & 0x07) << 18) | (second << 12) | (third << 6) | fourth;
      if (codePoint < 0x10000 || codePoint > 0x10ffff) {
        return { ok: false, message: "Save payload contains invalid UTF-8." };
      }
      codePoints.push(codePoint);
      index += 4;
      continue;
    }

    return { ok: false, message: "Save payload contains invalid UTF-8." };
  }

  return {
    ok: true,
    text: String.fromCodePoint(...codePoints)
  };
}

function readContinuation(bytes: Uint8Array, index: number): number | undefined {
  const value = bytes[index];
  if (value === undefined || value < 0x80 || value > 0xbf) {
    return undefined;
  }

  return value & 0x3f;
}

function hashText(text: string): number {
  let hash = FNV1A32_OFFSET;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, FNV1A32_PRIME) >>> 0;
  }

  return hash;
}

function fixedHex(value: number): string {
  return value.toString(16).padStart(8, "0");
}

function fallbackAdvanceCommand(): GameCommandV1 {
  return {
    schemaVersion: 1,
    kind: "sim.advance-day",
    commandId: "invalid.placeholder",
    actor: { kind: "system", id: "invalid" },
    expectedDay: 0,
    expectedRevision: 0
  };
}

function reason(
  code: SaveLoadRejectionCodeV1,
  path: string,
  message: string
): SaveLoadRejectionReasonV1 {
  return { code, path, message };
}

function rejected(
  code: SaveLoadRejectionCodeV1,
  path: string,
  message: string
): DecodeSaveEnvelopeV1Result {
  return {
    status: "rejected",
    reasons: [reason(code, path, message)]
  };
}

function copyRecord(record: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort(compareText)) {
    result[key] = record[key];
  }
  return result;
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

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonnegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

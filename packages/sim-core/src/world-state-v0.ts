export type Brand<TValue, TBrand extends string> = TValue & { readonly __brand: TBrand };

export type PersonId = Brand<number, "PersonId">;
export type PolityId = Brand<number, "PolityId">;
export type DistrictId = Brand<number, "DistrictId">;
export type SettlementId = Brand<number, "SettlementId">;
export type RouteId = Brand<number, "RouteId">;
export type GameDay = Brand<number, "GameDay">;
export type WorldRevision = Brand<number, "WorldRevision">;
export type SimulationSeed = Brand<number, "SimulationSeed">;
export type ContentManifestHash = Brand<string, "ContentManifestHash">;

export const WORLD_STATE_V0_SCHEMA_VERSION = 0;

export interface PolityDefinition {
  readonly id: PolityId;
  readonly displayNameKey: string;
}

export interface PersonDefinition {
  readonly id: PersonId;
  readonly displayNameKey: string;
}

export interface DistrictDefinition {
  readonly id: DistrictId;
  readonly displayNameKey: string;
}

export interface SettlementDefinition {
  readonly id: SettlementId;
  readonly displayNameKey: string;
  readonly districtId: DistrictId;
}

export interface RouteDefinition {
  readonly id: RouteId;
  readonly fromDistrictId: DistrictId;
  readonly toDistrictId: DistrictId;
  readonly lengthInMapUnits: number;
}

export interface WorldDefinitionsV0 {
  readonly polities: readonly PolityDefinition[];
  readonly persons: readonly PersonDefinition[];
  readonly districts: readonly DistrictDefinition[];
  readonly settlements: readonly SettlementDefinition[];
  readonly routes: readonly RouteDefinition[];
}

export interface PolityState {
  readonly definitionId: PolityId;
}

export interface PersonState {
  readonly definitionId: PersonId;
  readonly currentDistrictId: DistrictId | undefined;
}

export type DistrictControlState =
  | { readonly kind: "controlled"; readonly controllerPolityId: PolityId }
  | { readonly kind: "uncontrolled" };

export interface DistrictState {
  readonly definitionId: DistrictId;
  readonly control: DistrictControlState;
}

export interface SettlementState {
  readonly definitionId: SettlementId;
  readonly currentDistrictId: DistrictId;
}

export interface RouteState {
  readonly definitionId: RouteId;
}

export interface WorldRuntimeStateV0 {
  readonly polities: readonly PolityState[];
  readonly persons: readonly PersonState[];
  readonly districts: readonly DistrictState[];
  readonly settlements: readonly SettlementState[];
  readonly routes: readonly RouteState[];
}

export interface SchedulerStateV0 {
  readonly pendingCommandCount: number;
}

export interface WorldMetaV0 {
  readonly schemaVersion: typeof WORLD_STATE_V0_SCHEMA_VERSION;
  readonly seed: SimulationSeed;
  readonly contentManifestHash: ContentManifestHash;
  readonly currentDay: GameDay;
  readonly revision: WorldRevision;
  readonly hashAlgorithm: "fnv1a32-canonical-world-state-v0";
  readonly stateHash: string;
}

export interface WorldStateV0 {
  readonly meta: WorldMetaV0;
  readonly definitions: WorldDefinitionsV0;
  readonly state: WorldRuntimeStateV0;
  readonly scheduler: SchedulerStateV0;
}

interface WorldStateV0Candidate {
  readonly meta: unknown;
  readonly definitions: WorldDefinitionsV0;
  readonly state: WorldRuntimeStateV0;
  readonly scheduler: unknown;
}

export type InvariantCode =
  | "bad-reference"
  | "duplicate-definition-id"
  | "duplicate-runtime-state-row"
  | "hash-mismatch"
  | "invalid-day"
  | "invalid-revision"
  | "invalid-schema"
  | "missing-definition"
  | "missing-runtime-state-row";

export interface WorldInvariantError {
  readonly code: InvariantCode;
  readonly path: string;
  readonly message: string;
}

export interface DefinePolityInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
}

export interface DefinePersonInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
}

export interface DefineDistrictInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
}

export interface DefineSettlementInput {
  readonly id: unknown;
  readonly displayNameKey: unknown;
  readonly districtId: unknown;
}

export interface DefineRouteInput {
  readonly id: unknown;
  readonly fromDistrictId: unknown;
  readonly toDistrictId: unknown;
  readonly lengthInMapUnits: unknown;
}

export interface CreateWorldStateV0Input {
  readonly seed: unknown;
  readonly contentManifestHash: unknown;
  readonly currentDay: unknown;
  readonly revision: unknown;
  readonly definitions: WorldDefinitionsV0;
}

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function parsePersonId(value: unknown): PersonId {
  return parsePositiveInteger(value, "PersonId") as PersonId;
}

export function parsePolityId(value: unknown): PolityId {
  return parsePositiveInteger(value, "PolityId") as PolityId;
}

export function parseDistrictId(value: unknown): DistrictId {
  return parsePositiveInteger(value, "DistrictId") as DistrictId;
}

export function parseSettlementId(value: unknown): SettlementId {
  return parsePositiveInteger(value, "SettlementId") as SettlementId;
}

export function parseRouteId(value: unknown): RouteId {
  return parsePositiveInteger(value, "RouteId") as RouteId;
}

export function parseGameDay(value: unknown): GameDay {
  return parseNonnegativeInteger(value, "GameDay") as GameDay;
}

export function parseWorldRevision(value: unknown): WorldRevision {
  return parseNonnegativeInteger(value, "WorldRevision") as WorldRevision;
}

export function parseSimulationSeed(value: unknown): SimulationSeed {
  return parseNonnegativeInteger(value, "SimulationSeed") as SimulationSeed;
}

export function parseContentManifestHash(value: unknown): ContentManifestHash {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("ContentManifestHash must be a non-empty string.");
  }

  return value as ContentManifestHash;
}

export function definePolity(input: DefinePolityInput): PolityDefinition {
  return {
    id: parsePolityId(input.id),
    displayNameKey: parseDisplayNameKey(input.displayNameKey, "PolityDefinition.displayNameKey")
  };
}

export function definePerson(input: DefinePersonInput): PersonDefinition {
  return {
    id: parsePersonId(input.id),
    displayNameKey: parseDisplayNameKey(input.displayNameKey, "PersonDefinition.displayNameKey")
  };
}

export function defineDistrict(input: DefineDistrictInput): DistrictDefinition {
  return {
    id: parseDistrictId(input.id),
    displayNameKey: parseDisplayNameKey(input.displayNameKey, "DistrictDefinition.displayNameKey")
  };
}

export function defineSettlement(input: DefineSettlementInput): SettlementDefinition {
  return {
    id: parseSettlementId(input.id),
    displayNameKey: parseDisplayNameKey(
      input.displayNameKey,
      "SettlementDefinition.displayNameKey"
    ),
    districtId: parseDistrictId(input.districtId)
  };
}

export function defineRoute(input: DefineRouteInput): RouteDefinition {
  return {
    id: parseRouteId(input.id),
    fromDistrictId: parseDistrictId(input.fromDistrictId),
    toDistrictId: parseDistrictId(input.toDistrictId),
    lengthInMapUnits: parsePositiveInteger(input.lengthInMapUnits, "Route lengthInMapUnits")
  };
}

export function createWorldStateV0(input: CreateWorldStateV0Input): WorldStateV0 {
  const definitions = canonicalizeDefinitions(input.definitions);
  const state = createRuntimeState(definitions);
  const stateWithoutHash: WorldStateV0 = {
    meta: {
      schemaVersion: WORLD_STATE_V0_SCHEMA_VERSION,
      seed: parseSimulationSeed(input.seed),
      contentManifestHash: parseContentManifestHash(input.contentManifestHash),
      currentDay: parseGameDay(input.currentDay),
      revision: parseWorldRevision(input.revision),
      hashAlgorithm: "fnv1a32-canonical-world-state-v0" as const,
      stateHash: ""
    },
    definitions,
    state,
    scheduler: {
      pendingCommandCount: 0
    }
  };
  const stateHash = hashWorldStateV0(stateWithoutHash);

  return {
    ...stateWithoutHash,
    meta: {
      ...stateWithoutHash.meta,
      stateHash
    }
  };
}

export function hashWorldStateV0(world: WorldStateV0): string {
  return hashWorldStateV0Candidate(world);
}

export function canonicalWorldStateV0Text(world: WorldStateV0): string {
  return canonicalWorldStateV0CandidateText(world);
}

function hashWorldStateV0Candidate(world: WorldStateV0Candidate): string {
  return toFixedHexHash(hashText(canonicalWorldStateV0CandidateText(world)));
}

function canonicalWorldStateV0CandidateText(world: WorldStateV0Candidate): string {
  return [
    "world-state-v0",
    `schemaVersion=${formatUnknown(getRecordPath(world, ["meta", "schemaVersion"]))}`,
    `seed=${formatUnknown(getRecordPath(world, ["meta", "seed"]))}`,
    `contentManifestHash=${formatUnknown(getRecordPath(world, ["meta", "contentManifestHash"]))}`,
    `currentDay=${formatUnknown(getRecordPath(world, ["meta", "currentDay"]))}`,
    `revision=${formatUnknown(getRecordPath(world, ["meta", "revision"]))}`,
    `hashAlgorithm=${formatUnknown(getRecordPath(world, ["meta", "hashAlgorithm"]))}`,
    `definitions.polities=${formatPolityDefinitions(world.definitions.polities)}`,
    `definitions.persons=${formatPersonDefinitions(world.definitions.persons)}`,
    `definitions.districts=${formatDistrictDefinitions(world.definitions.districts)}`,
    `definitions.settlements=${formatSettlementDefinitions(world.definitions.settlements)}`,
    `definitions.routes=${formatRouteDefinitions(world.definitions.routes)}`,
    `state.polities=${formatPolityStates(world.state.polities)}`,
    `state.persons=${formatPersonStates(world.state.persons)}`,
    `state.districts=${formatDistrictStates(world.state.districts)}`,
    `state.settlements=${formatSettlementStates(world.state.settlements)}`,
    `state.routes=${formatRouteStates(world.state.routes)}`,
    `scheduler.pendingCommandCount=${formatUnknown(
      getRecordPath(world, ["scheduler", "pendingCommandCount"])
    )}`
  ].join("\n");
}

export function validateWorldStateV0(input: unknown): readonly WorldInvariantError[] {
  if (!isRecord(input)) {
    return [
      {
        code: "invalid-schema",
        path: "$",
        message: "WorldState v0 must be an object with meta, definitions, state, and scheduler."
      }
    ];
  }

  const errors: WorldInvariantError[] = [];
  const world = validateWorldShape(input, errors);
  if (world === undefined) {
    return errors;
  }

  validateMeta(world, errors);
  validateScheduler(world, errors);
  validateDefinitionEntryShapes(world.definitions, errors);
  validateRuntimeEntryShapes(world.state, errors);
  if (errors.some((error) => error.code === "invalid-schema")) {
    return errors;
  }

  validateDefinitions(world.definitions, errors);
  validateDefinitionReferences(world.definitions, errors);
  validateRuntimeState(world, errors);
  validateRuntimeTableCoverage(world, errors);
  validateStateHash(world, errors);
  return errors;
}

function validateWorldShape(
  input: Record<string, unknown>,
  errors: WorldInvariantError[]
): WorldStateV0Candidate | undefined {
  const meta = input["meta"];
  const definitions = input["definitions"];
  const state = input["state"];
  const scheduler = input["scheduler"];
  let isValid = true;

  if (!isRecord(meta)) {
    errors.push({
      code: "invalid-schema",
      path: "meta",
      message: "WorldState meta must be an object."
    });
    isValid = false;
  }

  if (!isRecord(definitions)) {
    errors.push({
      code: "invalid-schema",
      path: "definitions",
      message: "WorldState definitions must be an object."
    });
    isValid = false;
  } else {
    isValid =
      validateArrayField(definitions, "polities", "definitions.polities", errors) && isValid;
    isValid = validateArrayField(definitions, "persons", "definitions.persons", errors) && isValid;
    isValid =
      validateArrayField(definitions, "districts", "definitions.districts", errors) && isValid;
    isValid =
      validateArrayField(definitions, "settlements", "definitions.settlements", errors) && isValid;
    isValid = validateArrayField(definitions, "routes", "definitions.routes", errors) && isValid;
  }

  if (!isRecord(state)) {
    errors.push({
      code: "invalid-schema",
      path: "state",
      message: "WorldState state must be an object."
    });
    isValid = false;
  } else {
    isValid = validateArrayField(state, "polities", "state.polities", errors) && isValid;
    isValid = validateArrayField(state, "persons", "state.persons", errors) && isValid;
    isValid = validateArrayField(state, "districts", "state.districts", errors) && isValid;
    isValid = validateArrayField(state, "settlements", "state.settlements", errors) && isValid;
    isValid = validateArrayField(state, "routes", "state.routes", errors) && isValid;
  }

  if (!isRecord(scheduler)) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler",
      message: "WorldState scheduler must be an object."
    });
    isValid = false;
  }

  if (!isValid || !isRecord(meta) || !isDefinitionsLike(definitions) || !isStateLike(state)) {
    return undefined;
  }

  return {
    meta,
    definitions,
    state,
    scheduler
  };
}

function validateArrayField(
  record: Record<string, unknown>,
  key: string,
  path: string,
  errors: WorldInvariantError[]
): boolean {
  if (Array.isArray(record[key])) {
    return true;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${path} must be an array.`
  });
  return false;
}

function validateDefinitionEntryShapes(
  definitions: WorldDefinitionsV0,
  errors: WorldInvariantError[]
): void {
  validateSimpleDefinitionEntries(
    definitions.polities,
    "definitions.polities",
    "PolityDefinition",
    "PolityId",
    errors
  );
  validateSimpleDefinitionEntries(
    definitions.persons,
    "definitions.persons",
    "PersonDefinition",
    "PersonId",
    errors
  );
  validateSimpleDefinitionEntries(
    definitions.districts,
    "definitions.districts",
    "DistrictDefinition",
    "DistrictId",
    errors
  );

  definitions.settlements.forEach((entry, index) => {
    const path = `definitions.settlements[${index}]`;
    if (!validateRecordEntry(entry, path, "SettlementDefinition", errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "id", `${path}.id`, "SettlementId", errors);
    validateDisplayNameKeyField(entry, `${path}.displayNameKey`, "SettlementDefinition", errors);
    validatePositiveIntegerField(entry, "districtId", `${path}.districtId`, "DistrictId", errors);
  });

  definitions.routes.forEach((entry, index) => {
    const path = `definitions.routes[${index}]`;
    if (!validateRecordEntry(entry, path, "RouteDefinition", errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "id", `${path}.id`, "RouteId", errors);
    validatePositiveIntegerField(
      entry,
      "fromDistrictId",
      `${path}.fromDistrictId`,
      "DistrictId",
      errors
    );
    validatePositiveIntegerField(
      entry,
      "toDistrictId",
      `${path}.toDistrictId`,
      "DistrictId",
      errors
    );
    validatePositiveIntegerField(
      entry,
      "lengthInMapUnits",
      `${path}.lengthInMapUnits`,
      "Route lengthInMapUnits",
      errors
    );
  });
}

function validateSimpleDefinitionEntries(
  entries: readonly unknown[],
  path: string,
  entryLabel: string,
  idLabel: string,
  errors: WorldInvariantError[]
): void {
  entries.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!validateRecordEntry(entry, entryPath, entryLabel, errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "id", `${entryPath}.id`, idLabel, errors);
    validateDisplayNameKeyField(entry, `${entryPath}.displayNameKey`, entryLabel, errors);
  });
}

function validateRuntimeEntryShapes(
  state: WorldRuntimeStateV0,
  errors: WorldInvariantError[]
): void {
  validateSimpleRuntimeEntries(state.polities, "state.polities", "PolityState", "PolityId", errors);
  validateSimpleRuntimeEntries(state.routes, "state.routes", "RouteState", "RouteId", errors);

  state.persons.forEach((entry, index) => {
    const path = `state.persons[${index}]`;
    if (!validateRecordEntry(entry, path, "PersonState", errors)) {
      return;
    }

    validatePositiveIntegerField(entry, "definitionId", `${path}.definitionId`, "PersonId", errors);
    const currentDistrictId = entry["currentDistrictId"];
    if (currentDistrictId !== undefined) {
      validatePositiveIntegerValue(
        currentDistrictId,
        `${path}.currentDistrictId`,
        "DistrictId",
        errors
      );
    }
  });

  state.districts.forEach((entry, index) => {
    const path = `state.districts[${index}]`;
    if (!validateRecordEntry(entry, path, "DistrictState", errors)) {
      return;
    }

    validatePositiveIntegerField(
      entry,
      "definitionId",
      `${path}.definitionId`,
      "DistrictId",
      errors
    );
    const control = entry["control"];
    if (!isRecord(control)) {
      errors.push({
        code: "invalid-schema",
        path: `${path}.control`,
        message: "DistrictState control must be an object."
      });
      return;
    }

    const controlKind = control["kind"];
    if (controlKind === "uncontrolled") {
      return;
    }

    if (controlKind !== "controlled") {
      errors.push({
        code: "invalid-schema",
        path: `${path}.control.kind`,
        message: "DistrictState control kind must be controlled or uncontrolled."
      });
      return;
    }

    validatePositiveIntegerField(
      control,
      "controllerPolityId",
      `${path}.control.controllerPolityId`,
      "PolityId",
      errors
    );
  });

  state.settlements.forEach((entry, index) => {
    const path = `state.settlements[${index}]`;
    if (!validateRecordEntry(entry, path, "SettlementState", errors)) {
      return;
    }

    validatePositiveIntegerField(
      entry,
      "definitionId",
      `${path}.definitionId`,
      "SettlementId",
      errors
    );
    validatePositiveIntegerField(
      entry,
      "currentDistrictId",
      `${path}.currentDistrictId`,
      "DistrictId",
      errors
    );
  });
}

function validateSimpleRuntimeEntries(
  entries: readonly unknown[],
  path: string,
  entryLabel: string,
  idLabel: string,
  errors: WorldInvariantError[]
): void {
  entries.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    if (!validateRecordEntry(entry, entryPath, entryLabel, errors)) {
      return;
    }

    validatePositiveIntegerField(
      entry,
      "definitionId",
      `${entryPath}.definitionId`,
      idLabel,
      errors
    );
  });
}

function validateRecordEntry(
  entry: unknown,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): entry is Record<string, unknown> {
  if (isRecord(entry)) {
    return true;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} entry must be an object.`
  });
  return false;
}

function validateDisplayNameKeyField(
  entry: Record<string, unknown>,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  const value = entry["displayNameKey"];
  if (typeof value === "string" && value.length > 0) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} displayNameKey must be a non-empty string.`
  });
}

function validatePositiveIntegerField(
  entry: Record<string, unknown>,
  key: string,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  validatePositiveIntegerValue(entry[key], path, label, errors);
}

function validatePositiveIntegerValue(
  value: unknown,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  if (isPositiveInteger(value)) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path,
    message: `${label} ${formatUnknown(value)} must be a positive safe integer.`
  });
}

function createRuntimeState(definitions: WorldDefinitionsV0): WorldRuntimeStateV0 {
  return {
    polities: sortByNumericId(definitions.polities).map((definition) => ({
      definitionId: definition.id
    })),
    persons: sortByNumericId(definitions.persons).map((definition) => ({
      definitionId: definition.id,
      currentDistrictId: undefined
    })),
    districts: sortByNumericId(definitions.districts).map((definition) => ({
      definitionId: definition.id,
      control: { kind: "uncontrolled" }
    })),
    settlements: sortByNumericId(definitions.settlements).map((definition) => ({
      definitionId: definition.id,
      currentDistrictId: definition.districtId
    })),
    routes: sortByNumericId(definitions.routes).map((definition) => ({
      definitionId: definition.id
    }))
  };
}

function canonicalizeDefinitions(definitions: WorldDefinitionsV0): WorldDefinitionsV0 {
  return {
    polities: sortByNumericId(definitions.polities),
    persons: sortByNumericId(definitions.persons),
    districts: sortByNumericId(definitions.districts),
    settlements: sortByNumericId(definitions.settlements),
    routes: sortByNumericId(definitions.routes)
  };
}

function parseDisplayNameKey(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} must be a non-empty string.`);
  }

  return value;
}

function parsePositiveInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer.`);
  }

  return value;
}

function parseNonnegativeInteger(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a nonnegative safe integer.`);
  }

  return value;
}

function isPositiveInteger(value: unknown): boolean {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonnegativeInteger(value: unknown): boolean {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function sortByNumericId<TValue extends { readonly id: number }>(
  values: readonly TValue[]
): readonly TValue[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort((left, right) => left.value.id - right.value.id || left.index - right.index)
    .map((entry) => entry.value);
}

function sortByDefinitionId<TValue extends { readonly definitionId: number }>(
  values: readonly TValue[]
): readonly TValue[] {
  return values
    .map((value, index) => ({ value, index }))
    .sort(
      (left, right) =>
        left.value.definitionId - right.value.definitionId || left.index - right.index
    )
    .map((entry) => entry.value);
}

function formatPolityDefinitions(values: readonly PolityDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}`)
    .join(",");
}

function formatPersonDefinitions(values: readonly PersonDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}`)
    .join(",");
}

function formatDistrictDefinitions(values: readonly DistrictDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}`)
    .join(",");
}

function formatSettlementDefinitions(values: readonly SettlementDefinition[]): string {
  return sortByNumericId(values)
    .map((value) => `${value.id}:${value.displayNameKey}:${value.districtId}`)
    .join(",");
}

function formatRouteDefinitions(values: readonly RouteDefinition[]): string {
  return sortByNumericId(values)
    .map(
      (value) =>
        `${value.id}:${value.fromDistrictId}:${value.toDistrictId}:${value.lengthInMapUnits}`
    )
    .join(",");
}

function formatPolityStates(values: readonly PolityState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}`)
    .join(",");
}

function formatPersonStates(values: readonly PersonState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}:${formatOptionalNumber(value.currentDistrictId)}`)
    .join(",");
}

function formatDistrictStates(values: readonly DistrictState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}:${formatDistrictControl(value.control)}`)
    .join(",");
}

function formatSettlementStates(values: readonly SettlementState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}:${value.currentDistrictId}`)
    .join(",");
}

function formatRouteStates(values: readonly RouteState[]): string {
  return sortByDefinitionId(values)
    .map((value) => `${value.definitionId}`)
    .join(",");
}

function formatDistrictControl(control: DistrictControlState): string {
  switch (control.kind) {
    case "controlled":
      return `controlled:${control.controllerPolityId}`;
    case "uncontrolled":
      return "uncontrolled";
  }
}

function formatOptionalNumber(value: number | undefined): string {
  return value === undefined ? "none" : `${value}`;
}

function formatUnknown(value: unknown): string {
  switch (typeof value) {
    case "number":
    case "boolean":
    case "string":
      return `${value}`;
    case "undefined":
      return "undefined";
    case "object":
      return value === null ? "null" : "[object]";
    case "bigint":
    case "function":
    case "symbol":
      return `[${typeof value}]`;
  }
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

function validateScheduler(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  if (!isNonnegativeInteger(getRecordPath(world, ["scheduler", "pendingCommandCount"]))) {
    errors.push({
      code: "invalid-schema",
      path: "scheduler.pendingCommandCount",
      message: "Scheduler pendingCommandCount must be a nonnegative safe integer."
    });
  }
}

function validateMeta(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  if (getRecordPath(world, ["meta", "schemaVersion"]) !== WORLD_STATE_V0_SCHEMA_VERSION) {
    errors.push({
      code: "invalid-schema",
      path: "meta.schemaVersion",
      message: `WorldState schemaVersion must be ${WORLD_STATE_V0_SCHEMA_VERSION}.`
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["meta", "seed"]))) {
    errors.push({
      code: "invalid-schema",
      path: "meta.seed",
      message: "WorldState seed must be a nonnegative safe integer."
    });
  }

  const contentManifestHash = getRecordPath(world, ["meta", "contentManifestHash"]);
  if (typeof contentManifestHash !== "string" || contentManifestHash.length === 0) {
    errors.push({
      code: "invalid-schema",
      path: "meta.contentManifestHash",
      message: "WorldState contentManifestHash must be a non-empty string."
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["meta", "currentDay"]))) {
    errors.push({
      code: "invalid-day",
      path: "meta.currentDay",
      message: "WorldState currentDay must be a nonnegative safe integer."
    });
  }

  if (!isNonnegativeInteger(getRecordPath(world, ["meta", "revision"]))) {
    errors.push({
      code: "invalid-revision",
      path: "meta.revision",
      message: "WorldState revision must be a nonnegative safe integer."
    });
  }

  if (getRecordPath(world, ["meta", "hashAlgorithm"]) !== "fnv1a32-canonical-world-state-v0") {
    errors.push({
      code: "invalid-schema",
      path: "meta.hashAlgorithm",
      message: "WorldState hashAlgorithm must be fnv1a32-canonical-world-state-v0."
    });
  }

  if (typeof getRecordPath(world, ["meta", "stateHash"]) !== "string") {
    errors.push({
      code: "invalid-schema",
      path: "meta.stateHash",
      message: "WorldState stateHash must be a string."
    });
  }
}

function validateDefinitions(definitions: WorldDefinitionsV0, errors: WorldInvariantError[]): void {
  validateDuplicateIds(definitions.polities, "PolityId", "definitions.polities", errors);
  validateDuplicateIds(definitions.persons, "PersonId", "definitions.persons", errors);
  validateDuplicateIds(definitions.districts, "DistrictId", "definitions.districts", errors);
  validateDuplicateIds(definitions.settlements, "SettlementId", "definitions.settlements", errors);
  validateDuplicateIds(definitions.routes, "RouteId", "definitions.routes", errors);
}

function validateDuplicateIds(
  values: readonly { readonly id: number }[],
  label: string,
  path: string,
  errors: WorldInvariantError[]
): void {
  const seen = new Set<number>();

  for (const value of values) {
    if (!isPositiveInteger(value.id)) {
      errors.push({
        code: "invalid-schema",
        path,
        message: `${label} ${formatUnknown(value.id)} must be a positive safe integer.`
      });
      continue;
    }

    if (seen.has(value.id)) {
      errors.push({
        code: "duplicate-definition-id",
        path,
        message: `Duplicate ${label} ${value.id}.`
      });
      continue;
    }

    seen.add(value.id);
  }
}

function validateDefinitionReferences(
  definitions: WorldDefinitionsV0,
  errors: WorldInvariantError[]
): void {
  const districtIds = idsOf(definitions.districts);

  definitions.settlements.forEach((settlement, index) => {
    if (!districtIds.has(settlement.districtId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.settlements[${index}].districtId`,
        message: `Settlement ${settlement.id} references missing DistrictId ${settlement.districtId}.`
      });
    }
  });

  definitions.routes.forEach((route, index) => {
    if (!districtIds.has(route.fromDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.routes[${index}].fromDistrictId`,
        message: `Route ${route.id} references missing from DistrictId ${route.fromDistrictId}.`
      });
    }

    if (!districtIds.has(route.toDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `definitions.routes[${index}].toDistrictId`,
        message: `Route ${route.id} references missing to DistrictId ${route.toDistrictId}.`
      });
    }
  });
}

function validateRuntimeState(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const polityIds = idsOf(world.definitions.polities);
  const personIds = idsOf(world.definitions.persons);
  const districtIds = idsOf(world.definitions.districts);
  const settlementIds = idsOf(world.definitions.settlements);
  const routeIds = idsOf(world.definitions.routes);

  world.state.polities.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      polityIds,
      `state.polities[${index}].definitionId`,
      "PolityId",
      errors
    );
  });

  world.state.persons.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      personIds,
      `state.persons[${index}].definitionId`,
      "PersonId",
      errors
    );

    if (state.currentDistrictId !== undefined && !districtIds.has(state.currentDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.persons[${index}].currentDistrictId`,
        message: `PersonState ${state.definitionId} references missing DistrictId ${state.currentDistrictId}.`
      });
    }
  });

  world.state.districts.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      districtIds,
      `state.districts[${index}].definitionId`,
      "DistrictId",
      errors
    );

    if (state.control.kind === "controlled" && !polityIds.has(state.control.controllerPolityId)) {
      errors.push({
        code: "bad-reference",
        path: `state.districts[${index}].control.controllerPolityId`,
        message: `DistrictState ${state.definitionId} references missing PolityId ${state.control.controllerPolityId}.`
      });
    }
  });

  world.state.settlements.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      settlementIds,
      `state.settlements[${index}].definitionId`,
      "SettlementId",
      errors
    );

    if (!districtIds.has(state.currentDistrictId)) {
      errors.push({
        code: "bad-reference",
        path: `state.settlements[${index}].currentDistrictId`,
        message: `SettlementState ${state.definitionId} references missing DistrictId ${state.currentDistrictId}.`
      });
    }
  });

  world.state.routes.forEach((state, index) => {
    validateRuntimeDefinitionReference(
      state.definitionId,
      routeIds,
      `state.routes[${index}].definitionId`,
      "RouteId",
      errors
    );
  });
}

function validateRuntimeTableCoverage(
  world: WorldStateV0Candidate,
  errors: WorldInvariantError[]
): void {
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.polities),
    runtimeIds: world.state.polities.map((state) => state.definitionId),
    statePath: "state.polities",
    stateLabel: "PolityState",
    idLabel: "PolityId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.persons),
    runtimeIds: world.state.persons.map((state) => state.definitionId),
    statePath: "state.persons",
    stateLabel: "PersonState",
    idLabel: "PersonId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.districts),
    runtimeIds: world.state.districts.map((state) => state.definitionId),
    statePath: "state.districts",
    stateLabel: "DistrictState",
    idLabel: "DistrictId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.settlements),
    runtimeIds: world.state.settlements.map((state) => state.definitionId),
    statePath: "state.settlements",
    stateLabel: "SettlementState",
    idLabel: "SettlementId",
    errors
  });
  validateRuntimeTableExactCoverage({
    definitionIds: idsOf(world.definitions.routes),
    runtimeIds: world.state.routes.map((state) => state.definitionId),
    statePath: "state.routes",
    stateLabel: "RouteState",
    idLabel: "RouteId",
    errors
  });
}

interface RuntimeTableCoverageInput {
  readonly definitionIds: ReadonlySet<number>;
  readonly runtimeIds: readonly number[];
  readonly statePath: string;
  readonly stateLabel: string;
  readonly idLabel: string;
  readonly errors: WorldInvariantError[];
}

function validateRuntimeTableExactCoverage(input: RuntimeTableCoverageInput): void {
  const seen = new Set<number>();

  for (const runtimeId of input.runtimeIds) {
    if (seen.has(runtimeId)) {
      input.errors.push({
        code: "duplicate-runtime-state-row",
        path: input.statePath,
        message: `Duplicate ${input.stateLabel} row for ${input.idLabel} ${runtimeId}.`
      });
      continue;
    }

    seen.add(runtimeId);
  }

  for (const definitionId of input.definitionIds) {
    if (!seen.has(definitionId)) {
      input.errors.push({
        code: "missing-runtime-state-row",
        path: input.statePath,
        message: `Missing ${input.stateLabel} row for ${input.idLabel} ${definitionId}.`
      });
    }
  }
}

function validateRuntimeDefinitionReference(
  id: number,
  definitions: ReadonlySet<number>,
  path: string,
  label: string,
  errors: WorldInvariantError[]
): void {
  if (!definitions.has(id)) {
    errors.push({
      code: "missing-definition",
      path,
      message: `Runtime state references missing ${label} ${id}.`
    });
  }
}

function validateStateHash(world: WorldStateV0Candidate, errors: WorldInvariantError[]): void {
  const actualHash = hashWorldStateV0Candidate(world);
  const storedHash = getRecordPath(world, ["meta", "stateHash"]);
  if (storedHash !== actualHash) {
    errors.push({
      code: "hash-mismatch",
      path: "meta.stateHash",
      message: `Stored state hash ${formatUnknown(storedHash)} does not match canonical hash ${actualHash}.`
    });
  }
}

function idsOf(values: readonly { readonly id: number }[]): ReadonlySet<number> {
  return new Set(values.map((value) => value.id));
}

function isDefinitionsLike(value: unknown): value is WorldDefinitionsV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value["polities"]) &&
    Array.isArray(value["persons"]) &&
    Array.isArray(value["districts"]) &&
    Array.isArray(value["settlements"]) &&
    Array.isArray(value["routes"])
  );
}

function isStateLike(value: unknown): value is WorldRuntimeStateV0 {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value["polities"]) &&
    Array.isArray(value["persons"]) &&
    Array.isArray(value["districts"]) &&
    Array.isArray(value["settlements"]) &&
    Array.isArray(value["routes"])
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRecordPath(value: unknown, path: readonly string[]): unknown {
  let current = value;

  for (const segment of path) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

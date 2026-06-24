import type {
  M1GraphEdgeDirection,
  M1GraphFixtureKind,
  M1GraphSyntheticScope
} from "@monsoon/content-schema";

export type Brand<TValue, TBrand extends string> = TValue & { readonly __brand: TBrand };

export type ContentNodeId = Brand<number, "ContentNodeId">;
export type ContentEdgeId = Brand<number, "ContentEdgeId">;
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

export function parseContentNodeId(value: unknown): ContentNodeId {
  return parsePositiveInteger(value, "ContentNodeId") as ContentNodeId;
}

export function parseContentEdgeId(value: unknown): ContentEdgeId {
  return parsePositiveInteger(value, "ContentEdgeId") as ContentEdgeId;
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

function freezeManifest(manifest: RuntimeContentManifestV0): RuntimeContentManifestV0 {
  return Object.freeze(manifest);
}

function readDirection(record: Record<string, unknown>, key: string): M1GraphEdgeDirection {
  const value = readString(record, key);
  if (value === "directed" || value === "bidirectional") {
    return value;
  }

  throw new Error(`${key} must be a valid edge direction.`);
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

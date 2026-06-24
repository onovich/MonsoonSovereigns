import {
  parseM1GraphFixtureSourceV0,
  validateM1GraphFixtureSourceV0,
  type ContentSchemaError,
  type M1GraphFixtureEdgeSourceV0,
  type M1GraphFixtureNodeSourceV0,
  type M1GraphFixtureSourceV0
} from "@monsoon/content-schema";
import {
  parseContentEdgeId,
  parseContentManifestHash,
  parseContentNodeId,
  parseRuntimeContentPackV0,
  type RuntimeContentEdgeV0,
  type RuntimeContentNodeV0,
  type RuntimeContentPackV0
} from "@monsoon/content-runtime";

export type ContentCompileErrorCode =
  | ContentSchemaError["code"]
  | "bad-reference"
  | "duplicate-id"
  | "duplicate-route"
  | "invalid-count"
  | "invalid-route"
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
      readonly pack: RuntimeContentPackV0;
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

const INITIAL_HASH_OFFSET = 2_166_136_261;
const HASH_PRIME = 16_777_619;

export function compileContentPackV0(input: unknown): ContentCompileResultV0 {
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

export function compileContentPackV0OrThrow(input: unknown): RuntimeContentPackV0 {
  const result = compileContentPackV0(input);
  if (result.status === "ok") {
    return result.pack;
  }

  throw new Error(`Content compile failed: ${formatCompileErrors(result.errors)}`);
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

function validateStableOrderAndUniqueIds(
  entries: readonly { readonly sourceId: string }[],
  path: "nodes" | "edges",
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

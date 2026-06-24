export const M1_GRAPH_FIXTURE_SOURCE_V0_SCHEMA_VERSION = 1;

export type M1GraphFixtureSourceKind = "m1.synthetic-abstract-graph";
export type M1GraphFixtureKind = "synthetic-kernel-graph";
export type M1GraphSyntheticScope = "deterministic-kernel-only";
export type M1GraphNodeIsolation = "connected" | "explicitly-isolated";
export type M1GraphEdgeDirection = "directed" | "bidirectional";

export type ContentSchemaErrorCode = "invalid-schema";

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

function validateExactString(
  record: Record<string, unknown>,
  key: string,
  expected: string,
  errors: ContentSchemaError[]
): void {
  if (record[key] === expected) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: key,
    message: `${key} must be ${expected}.`
  });
}

function validateNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  errors: ContentSchemaError[]
): void {
  const value = record[key];
  if (typeof value === "string" && value.length > 0) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: key,
    message: `${key} must be a non-empty string.`
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

function validateArray(
  record: Record<string, unknown>,
  key: string,
  errors: ContentSchemaError[]
): void {
  if (Array.isArray(record[key])) {
    return;
  }

  errors.push({
    code: "invalid-schema",
    path: key,
    message: `${key} must be an array.`
  });
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
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive safe integer.`);
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

function formatErrors(errors: readonly ContentSchemaError[]): string {
  return errors.map((error) => `${error.path}: ${error.message}`).join("; ");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

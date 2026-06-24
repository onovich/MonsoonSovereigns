import { describe, expect, test } from "vitest";

import {
  parseM1GraphFixtureSourceV0,
  validateM1GraphFixtureSourceV0
} from "../packages/content-schema/src/index";

describe("SIM-006 source content schema", () => {
  test("parses a minimal explicitly synthetic graph source DTO", () => {
    const source = parseM1GraphFixtureSourceV0({
      schemaVersion: 1,
      kind: "m1.synthetic-abstract-graph",
      fixtureId: "m1.test",
      fixtureKind: "synthetic-kernel-graph",
      syntheticScope: "deterministic-kernel-only",
      nodes: [
        {
          sourceId: "node-001",
          displayNameKey: "content.m1.abstract.node_001",
          isolation: "connected"
        }
      ],
      edges: []
    });

    expect(source.nodes[0]?.sourceId).toBe("node-001");
  });

  test("returns path-specific invalid-schema errors instead of throwing during validation", () => {
    expect(validateM1GraphFixtureSourceV0({ schemaVersion: "1", nodes: {} })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-schema", path: "schemaVersion" }),
        expect.objectContaining({ code: "invalid-schema", path: "kind" }),
        expect.objectContaining({ code: "invalid-schema", path: "nodes" }),
        expect.objectContaining({ code: "invalid-schema", path: "edges" })
      ])
    );
  });
});

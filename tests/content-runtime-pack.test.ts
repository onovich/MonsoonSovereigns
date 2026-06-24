import { describe, expect, test } from "vitest";

import {
  createRuntimeContentPackIndexV0,
  parseRuntimeContentPackV0
} from "../packages/content-runtime/src/index";

describe("SIM-006 runtime content pack", () => {
  test("parses runtime content without filesystem access or display-name lookup", () => {
    const pack = parseRuntimeContentPackV0({
      schemaVersion: 1,
      kind: "runtime-content-pack-v0",
      fixtureId: "m1.runtime-test",
      manifest: {
        schemaVersion: 1,
        fixtureId: "m1.runtime-test",
        fixtureKind: "synthetic-kernel-graph",
        syntheticScope: "deterministic-kernel-only",
        manifestHash: "1234abcd",
        nodeCount: 2,
        edgeCount: 1
      },
      nodes: [
        { id: 1, sourceId: "node-001", displayNameKey: "content.m1.abstract.node_001" },
        { id: 2, sourceId: "node-002", displayNameKey: "content.m1.abstract.node_002" }
      ],
      edges: [
        {
          id: 1,
          sourceId: "edge-001",
          fromNodeId: 1,
          toNodeId: 2,
          direction: "bidirectional",
          traversalCost: 10
        }
      ]
    });
    const index = createRuntimeContentPackIndexV0(pack);

    expect(index.getNode(1)?.sourceId).toBe("node-001");
    expect(index.getEdge(1)?.fromNodeId).toBe(1);
    expect(index).not.toHaveProperty("getNodeByDisplayName");
    expect(index).not.toHaveProperty("getNodeByDisplayNameKey");
  });

  test("rejects runtime packs with bad manifest counts or references", () => {
    expect(() =>
      parseRuntimeContentPackV0({
        schemaVersion: 1,
        kind: "runtime-content-pack-v0",
        fixtureId: "m1.runtime-test",
        manifest: {
          schemaVersion: 1,
          fixtureId: "m1.runtime-test",
          fixtureKind: "synthetic-kernel-graph",
          syntheticScope: "deterministic-kernel-only",
          manifestHash: "1234abcd",
          nodeCount: 1,
          edgeCount: 1
        },
        nodes: [
          { id: 1, sourceId: "node-001", displayNameKey: "content.m1.abstract.node_001" },
          { id: 2, sourceId: "node-002", displayNameKey: "content.m1.abstract.node_002" }
        ],
        edges: [
          {
            id: 1,
            sourceId: "edge-001",
            fromNodeId: 1,
            toNodeId: 999,
            direction: "bidirectional",
            traversalCost: 10
          }
        ]
      })
    ).toThrow("RuntimeContentPackV0");
  });
});

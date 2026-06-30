import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, test } from "vitest";

import { compileContentPackV0OrThrow } from "../apps/content-tools/src/index";
import { parseM2WorldFixtureSourceV0 } from "../packages/content-schema/src/index";
import { parseRuntimeM2WorldContentPackV0 } from "../packages/content-runtime/src/index";
import {
  bootSimulationV1,
  querySimulationV1,
  validateWorldStateV0
} from "../packages/sim-core/src/index";

const repoRoot = new URL("..", import.meta.url);
const repoRootPath = fileURLToPath(repoRoot);
const m2FixtureUrl = new URL(
  "../content-source/m2-fixtures/prototype-world-30-districts.json",
  import.meta.url
);
const simCoreSourceRoot = new URL("../packages/sim-core/src", import.meta.url);

describe("M2-BOOT-BOUNDARY-001 sim-core/content-runtime boot boundary", () => {
  test("boots deterministically from a compiled content-runtime M2 content pack", async () => {
    const runtimeContentPack = await compileRuntimeM2WorldPack();

    const firstBoot = bootSimulationV1({
      protocolVersion: 1,
      source: "runtime-content-pack",
      seed: 1531,
      runtimeContentPack
    });
    const secondBoot = bootSimulationV1({
      protocolVersion: 1,
      source: "runtime-content-pack",
      seed: 1531,
      runtimeContentPack: structuredClone(runtimeContentPack)
    });

    expect(firstBoot.status).toBe("booted");
    expect(secondBoot.status).toBe("booted");
    if (firstBoot.status !== "booted" || secondBoot.status !== "booted") {
      throw new Error("Expected M2 runtime content boot to be accepted.");
    }

    expect(firstBoot.stateHash).toBe(secondBoot.stateHash);
    expect(firstBoot.runtime.world.meta.stateHash).toBe("4d0e1f47");
    expect(firstBoot.runtime.world.meta.contentManifestHash).toBe(
      runtimeContentPack.manifest.manifestHash
    );
    expect(firstBoot.runtime.world.definitions.districts).toHaveLength(14);
    expect(firstBoot.runtime.world.definitions.settlements).toHaveLength(6);
    expect(firstBoot.runtime.world.definitions.routes).toHaveLength(
      runtimeContentPack.routes.length
    );
    expect(firstBoot.runtime.world.definitions.topology?.routeEdges).toHaveLength(25);
    expect(validateWorldStateV0(firstBoot.runtime.world)).toEqual([]);

    const hashQuery = querySimulationV1(firstBoot.runtime, {
      schemaVersion: 1,
      kind: "sim.get-state-hash"
    });
    expect(hashQuery.status).toBe("ok");
    if (hashQuery.status !== "ok") {
      throw new Error("Expected hash query to succeed.");
    }
    expect(hashQuery.result.stateHash).toBe(firstBoot.stateHash);
  });

  test("rejects mismatched or invalid runtime content packs without returning a runtime", async () => {
    const runtimeContentPack = await compileRuntimeM2WorldPack();
    const existingBoot = bootSimulationV1({ protocolVersion: 1, fixture: "minimal-m1" });
    expect(existingBoot.status).toBe("booted");
    if (existingBoot.status !== "booted") {
      throw new Error("Expected existing minimal runtime to boot.");
    }
    const existingHash = existingBoot.runtime.world.meta.stateHash;

    const ambiguousBoot = bootSimulationV1({
      protocolVersion: 1,
      fixture: "minimal-m1",
      source: "runtime-content-pack",
      seed: 1531,
      runtimeContentPack: { invalid: true }
    });
    expect(ambiguousBoot).toEqual({
      status: "rejected",
      error: {
        code: "invalid-payload",
        path: "$",
        message:
          "BootSimulationInput must specify either fixture or runtime-content-pack source, not both."
      }
    });

    const mismatchedPack = {
      ...runtimeContentPack,
      kind: "runtime-content-pack-v0"
    };
    const mismatchedBoot = bootSimulationV1({
      protocolVersion: 1,
      source: "runtime-content-pack",
      seed: 1531,
      runtimeContentPack: mismatchedPack
    });
    expect(mismatchedBoot).toEqual({
      status: "rejected",
      error: {
        code: "invalid-content-pack",
        path: "runtimeContentPack.kind",
        message: "kind must be runtime-m2-world-content-pack-v0."
      }
    });

    const badReferencePack = {
      ...runtimeContentPack,
      routes: runtimeContentPack.routes.map((route, index) =>
        index === 0 ? { ...route, toDistrictId: 999 } : route
      )
    };
    const badReferenceBoot = bootSimulationV1({
      protocolVersion: 1,
      source: "runtime-content-pack",
      seed: 1531,
      runtimeContentPack: badReferencePack
    });
    expect(badReferenceBoot).toEqual({
      status: "rejected",
      error: {
        code: "invalid-content-pack",
        path: "runtimeContentPack.routes[0].toDistrictId",
        message: "Missing to district 999."
      }
    });
    expect(existingBoot.runtime.world.meta.stateHash).toBe(existingHash);
  });

  test("keeps authoritative sim-core source free of host APIs and content-source imports", async () => {
    const files = await collectSourceFiles(simCoreSourceRoot);
    const forbiddenPatterns: readonly { readonly label: string; readonly pattern: RegExp }[] = [
      { label: "content-source import", pattern: /from\s+["'][^"']*content-source/u },
      {
        label: "Node filesystem import",
        pattern: /from\s+["'](?:node:fs|fs|node:fs\/promises)["']/u
      },
      { label: "React import", pattern: /from\s+["']react(?:\/|["'])/u },
      { label: "PixiJS import", pattern: /from\s+["'](?:pixi\.js|@pixi\/[^"']*)["']/u },
      { label: "Electron import", pattern: /from\s+["']electron["']/u },
      { label: "Math.random", pattern: /\bMath\.random\s*\(/u },
      { label: "Date.now", pattern: /\bDate\.now\s*\(/u },
      { label: "new Date", pattern: /\bnew\s+Date\s*\(/u },
      { label: "performance.now", pattern: /\bperformance\.now\s*\(/u },
      { label: "document global", pattern: /\bdocument\b/u },
      { label: "window global", pattern: /\bwindow\b/u }
    ];

    for (const file of files) {
      const text = await readFile(file, "utf8");
      for (const forbidden of forbiddenPatterns) {
        expect(text, `${relative(repoRootPath, file)} uses ${forbidden.label}`).not.toMatch(
          forbidden.pattern
        );
      }
    }
  });
});

async function compileRuntimeM2WorldPack(): Promise<
  ReturnType<typeof parseRuntimeM2WorldContentPackV0>
> {
  const sourceText = await readFile(m2FixtureUrl, "utf8");
  const source = parseM2WorldFixtureSourceV0(JSON.parse(sourceText) as unknown);
  const compiled = compileContentPackV0OrThrow(source);
  if (compiled.kind !== "runtime-m2-world-content-pack-v0") {
    throw new Error("Expected compiled M2 runtime world content pack.");
  }

  return parseRuntimeM2WorldContentPackV0(structuredClone(compiled));
}

async function collectSourceFiles(root: URL): Promise<readonly string[]> {
  const rootPath = fileURLToPath(root);
  const entries = await readdir(rootPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(new URL(`${entry.name}/`, root))));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }

  return files;
}

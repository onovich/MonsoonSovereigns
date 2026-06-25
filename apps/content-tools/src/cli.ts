import { readFile } from "node:fs/promises";

import { compileContentPackV0 } from "./index.ts";

const DEFAULT_FIXTURE_PATH = "../../content-source/m1-fixtures/abstract-graph-30.json";

async function main(args: readonly string[]): Promise<number> {
  const command = args[0] ?? "validate";
  if (command !== "validate") {
    console.error(`Unsupported content-tools command ${command}.`);
    return 1;
  }

  const fixturePaths = args.length > 1 ? args.slice(1) : [DEFAULT_FIXTURE_PATH];
  for (const fixturePath of fixturePaths) {
    const text = await readFile(fixturePath, "utf8");
    const parsed = JSON.parse(text) as unknown;
    const result = compileContentPackV0(parsed);

    if (result.status === "error") {
      for (const error of result.errors) {
        console.error(`${fixturePath}: ${error.code} ${error.path}: ${error.message}`);
      }
      return 1;
    }

    if (result.pack.kind === "runtime-content-pack-v0") {
      console.log(
        `Content validation passed: ${result.pack.fixtureId} nodes=${result.pack.manifest.nodeCount} edges=${result.pack.manifest.edgeCount} manifestHash=${result.pack.manifest.manifestHash}`
      );
    } else if (result.pack.kind === "runtime-m2-world-content-pack-v0") {
      console.log(
        `Content validation passed: ${result.pack.fixtureId} districts=${result.pack.manifest.districtCount} settlements=${result.pack.manifest.settlementCount} regionalSeasonalCurves=${result.pack.manifest.regionalSeasonalCurveCount} routes=${result.pack.manifest.routeCount} mapGeometries=${result.pack.manifest.mapGeometryCount} manifestHash=${result.pack.manifest.manifestHash}`
      );
    } else {
      console.log(
        `Content validation passed: ${result.pack.fixtureId} characters=${result.pack.manifest.characterCount} relationships=${result.pack.manifest.relationshipCount} offices=${result.pack.manifest.officeCount} landedPowers=${result.pack.manifest.landedPowerCount} officePolicies=${result.pack.manifest.officePolicyCount} enfeoffmentHooks=${result.pack.manifest.enfeoffmentHookCount} manifestHash=${result.pack.manifest.manifestHash}`
      );
    }
  }
  return 0;
}

const exitCode = await main(process.argv.slice(2));
process.exitCode = exitCode;

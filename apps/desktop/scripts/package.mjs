import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const desktopRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(desktopRoot, "../..");
const packageRoot = resolve(repoRoot, ".tmp", "desktop-package", "MonsoonSovereigns-win32-x64");

async function copyRequiredDirectory(source, destination) {
  await mkdir(destination, { recursive: true });
  await cp(source, destination, { recursive: true });
}

await rm(packageRoot, { recursive: true, force: true });
await mkdir(packageRoot, { recursive: true });

await copyRequiredDirectory(resolve(desktopRoot, "dist", "main"), resolve(packageRoot, "main"));
await copyRequiredDirectory(
  resolve(desktopRoot, "dist", "preload"),
  resolve(packageRoot, "preload")
);
await copyRequiredDirectory(
  resolve(desktopRoot, "dist", "renderer"),
  resolve(packageRoot, "renderer")
);
await copyRequiredDirectory(
  resolve(repoRoot, "packages", "platform", "dist"),
  resolve(packageRoot, "node_modules", "@monsoon", "platform", "dist")
);

const platformManifest = {
  name: "@monsoon/platform",
  private: true,
  version: "0.0.0",
  type: "module",
  exports: {
    ".": {
      default: "./dist/index.js"
    }
  }
};

const appManifest = {
  name: "monsoon-sovereigns-desktop",
  private: true,
  version: "0.0.0",
  type: "module",
  main: "main/main.js"
};

await writeFile(
  resolve(packageRoot, "node_modules", "@monsoon", "platform", "package.json"),
  `${JSON.stringify(platformManifest, null, 2)}\n`
);
await writeFile(resolve(packageRoot, "package.json"), `${JSON.stringify(appManifest, null, 2)}\n`);

const writtenManifest = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
if (writtenManifest.main !== "main/main.js") {
  throw new Error("Desktop package manifest does not point at main/main.js.");
}

console.log(`Desktop package smoke output: ${packageRoot}`);
console.log("Packaged main, preload, renderer, and platform adapter artifacts.");

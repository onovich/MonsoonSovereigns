import { access, cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const desktopRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(desktopRoot, "../..");
const rendererSource = resolve(desktopRoot, "renderer");
const rendererDestination = resolve(desktopRoot, "dist", "renderer");
const webDistSource = resolve(repoRoot, "apps", "web", "dist");
const webDistDestination = resolve(rendererDestination, "web");

await rm(rendererDestination, { recursive: true, force: true });
await mkdir(rendererDestination, { recursive: true });
await cp(rendererSource, rendererDestination, { recursive: true });

if (await pathExists(webDistSource)) {
  await cp(webDistSource, webDistDestination, { recursive: true });
  console.log(`Copied web renderer assets to ${webDistDestination}`);
} else {
  console.log(`Skipped optional web renderer assets; ${webDistSource} does not exist`);
}

console.log(`Copied renderer assets to ${rendererDestination}`);

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

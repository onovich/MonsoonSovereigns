import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const desktopRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rendererSource = resolve(desktopRoot, "renderer");
const rendererDestination = resolve(desktopRoot, "dist", "renderer");

await rm(rendererDestination, { recursive: true, force: true });
await mkdir(rendererDestination, { recursive: true });
await cp(rendererSource, rendererDestination, { recursive: true });

console.log(`Copied renderer assets to ${rendererDestination}`);

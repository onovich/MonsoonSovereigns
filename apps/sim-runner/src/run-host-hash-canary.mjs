import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { _electron as electron, chromium } from "@playwright/test";
import { computeM2HostHashCanaryHashes } from "../../web/src/host-hash-canary/compute-host-hash-canary.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..", "..");
const webCanaryPath = resolve(repoRoot, "apps", "web", "dist", "host-hash-canary.html");
const desktopPackageRoot = resolve(
  repoRoot,
  ".tmp",
  "desktop-package",
  "MonsoonSovereigns-win32-x64"
);
const desktopCanaryPath = resolve(
  desktopPackageRoot,
  "renderer",
  "web",
  "host-hash-canary.html"
);

const selection = parseBrowserSelection(process.argv.slice(2));
const baseline = computeM2HostHashCanaryHashes();

stdoutLine(
  `Command: pnpm --filter @monsoon/sim-runner sim:host-hash-canary${
    process.argv.length > 2 ? ` -- ${process.argv.slice(2).join(" ")}` : ""
  }`
);
stdoutLine("Node baseline");
stdoutLine(formatHashes(baseline));

if (selection.includes("chromium")) {
  await verifyChromium(baseline);
}

if (selection.includes("electron")) {
  await verifyElectron(baseline);
}

function parseBrowserSelection(argv) {
  const value = readBrowserArgument(argv);
  switch (value) {
    case "chromium":
    case "electron":
      return [value];
    case "both":
      return ["chromium", "electron"];
    default:
      throw new Error(`Unsupported browser selection ${value}. Use chromium, electron, or both.`);
  }
}

function readBrowserArgument(argv) {
  const browserIndex = argv.findIndex((argument) => argument === "--browser" || argument === "-b");
  if (browserIndex >= 0) {
    const value = argv[browserIndex + 1];
    if (value === "chromium" || value === "electron" || value === "both") {
      return value;
    }
    throw new Error("Missing or invalid value after --browser.");
  }

  const direct = argv.find((argument) => !argument.startsWith("-"));
  return direct ?? "both";
}

async function verifyChromium(baselineHashes) {
  await access(webCanaryPath);

  const browser = await chromium.launch({
    args: ["--allow-file-access-from-files"]
  });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(webCanaryPath).href);
    const result = await readCanaryResult(page);
    stdoutLine("");
    stdoutLine("Chromium dedicated worker");
    stdoutLine(formatHashes(result.hashes));
    assertHashes("Chromium", baselineHashes, result.hashes);
  } finally {
    await browser.close();
  }
}

async function verifyElectron(baselineHashes) {
  await access(desktopCanaryPath);

  const app = await electron.launch({
    args: [desktopPackageRoot],
    env: {
      ...process.env,
      MONSOON_HOST_HASH_CANARY: "1"
    }
  });
  try {
    const window = await app.firstWindow();
    const result = await readCanaryResult(window);
    stdoutLine("");
    stdoutLine("Electron renderer dedicated worker");
    stdoutLine(formatHashes(result.hashes));
    assertHashes("Electron", baselineHashes, result.hashes);
  } finally {
    await app.close();
  }
}

async function readCanaryResult(page) {
  await page.waitForFunction(() => {
    return (
      window.__monsoonHostHashCanaryResult?.status === "ok" ||
      document.body?.getAttribute("data-canary-status") === "failed"
    );
  });

  const result = await page.evaluate(() => window.__monsoonHostHashCanaryResult);
  if (result === undefined || result.status !== "ok") {
    const renderedFailure = await page.locator("#result").textContent();
    throw new Error(
      `Host hash canary did not produce an ok result.${renderedFailure ? ` ${renderedFailure}` : ""}`
    );
  }

  return result;
}

function assertHashes(label, baselineHashes, actualHashes) {
  const mismatches = [];
  if (baselineHashes.helloHash !== actualHashes.helloHash) {
    mismatches.push(`hello ${baselineHashes.helloHash} != ${actualHashes.helloHash}`);
  }
  if (baselineHashes.commandQueryHash !== actualHashes.commandQueryHash) {
    mismatches.push(
      `command/query ${baselineHashes.commandQueryHash} != ${actualHashes.commandQueryHash}`
    );
  }
  if (baselineHashes.saveLoadHash !== actualHashes.saveLoadHash) {
    mismatches.push(`save/load ${baselineHashes.saveLoadHash} != ${actualHashes.saveLoadHash}`);
  }
  if (baselineHashes.saveByteLength !== actualHashes.saveByteLength) {
    mismatches.push(
      `save byte length ${baselineHashes.saveByteLength} != ${actualHashes.saveByteLength}`
    );
  }

  if (mismatches.length > 0) {
    throw new Error(`${label} host hash canary mismatch: ${mismatches.join("; ")}`);
  }
}

function formatHashes(hashes) {
  return [
    `hello hash: ${hashes.helloHash}`,
    `command/query hash: ${hashes.commandQueryHash}`,
    `save/load hash: ${hashes.saveLoadHash}`,
    `save byte length: ${hashes.saveByteLength}`
  ].join("\n");
}

function stdoutLine(message) {
  process.stdout.write(`${message}\n`);
}

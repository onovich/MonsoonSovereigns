import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { performance } from "node:perf_hooks";

import { chromium } from "@playwright/test";

import { runSaveLoadCanaryV1 } from "../../../packages/sim-core/src/index.ts";
import { createSaveLoadCanaryScriptV1 } from "../../../packages/protocol/src/index.ts";
import {
  runM7LargeScaleBalanceV1,
  validateM7LargeScaleBalanceArtifactV1
} from "../../../apps/sim-runner/src/m7-large-scale-balance.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..", "..", "..");
const webDistRoot = resolve(repoRoot, "apps", "web", "dist");
const desktopPackageRoot =
  process.env.DESKTOP_PACKAGE_ROOT ??
  resolve(repoRoot, ".tmp", "desktop-package", "MonsoonSovereigns-win32-x64");

const result = {
  schemaVersion: 1,
  taskId: "M7-PERFORMANCE-MEMORY-LOADING-001",
  generatedAt: new Date().toISOString(),
  host: collectHostInfo(),
  assumptions: [
    {
      kind: "low_end_windows_proxy",
      status: "proxy",
      note:
        "This host is a Windows x64 workstation, not a verified low-end endpoint. The low-end Windows assumption is therefore treated as a proxy budget rather than direct device validation."
    }
  ]
};

result.m7LargeScaleBalance = await measureM7LargeScaleBalance();
result.saveLoad = await measureSaveLoad();
result.web = await measureWebStartupAndLoading();
result.artifacts = await collectArtifactHashes();

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

async function measureM7LargeScaleBalance() {
  const before = process.memoryUsage();
  const startedAt = performance.now();
  const artifact = runM7LargeScaleBalanceV1();
  const validation = validateM7LargeScaleBalanceArtifactV1(artifact);
  const durationMs = roundMs(performance.now() - startedAt);
  const after = process.memoryUsage();

  if (!validation.ok) {
    throw new Error(`M7 large-scale balance artifact validation failed: ${validation.reasons.join(", ")}`);
  }

  return {
    status: "PASS",
    carryForwardM6Gate: artifact.carryForwardM6Gate,
    sampleSize: artifact.sampleSize,
    artifactHash: artifact.artifactHash,
    contentBundleHash: artifact.contentBundleHash,
    aggregate: artifact.aggregate,
    performance: {
      durationMs,
      hostMemoryBefore: toMemorySnapshot(before),
      hostMemoryAfter: toMemorySnapshot(after)
    },
    thresholds: {
      basis: "PASS_WITH_LIMITS",
      note:
        "M7 Beta thresholds are not frozen in task metadata. This evidence uses the accepted Beta-scale artifact contract and treats the observed measurements as conservative sanity bounds."
    }
  };
}

async function measureSaveLoad() {
  const startedAt = performance.now();
  const script = createSaveLoadCanaryScriptV1();
  const saveLoad = runSaveLoadCanaryV1(script);
  const durationMs = roundMs(performance.now() - startedAt);

  return {
    status: "PASS",
    durationMs,
    saveByteLength: saveLoad.saveByteLength,
    finalHash: saveLoad.finalHash,
    loadedHash: saveLoad.loadedHash,
    replayedHash: saveLoad.replayedHash
  };
}

async function measureWebStartupAndLoading() {
  await access(webDistRoot);
  const server = await startStaticServer(webDistRoot);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const baseUrl = `http://127.0.0.1:${server.port}`;

  try {
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, "languages", {
        configurable: true,
        get: () => ["en-US"]
      });
      Object.defineProperty(window.navigator, "language", {
        configurable: true,
        get: () => "en-US"
      });
    });

    const startupRoute = "/";
    const startupStartedAt = performance.now();
    await page.goto(`${baseUrl}${startupRoute}`, { waitUntil: "load" });
    await page.getByRole("heading", { name: "Monsoon Sovereigns" }).waitFor({ state: "visible" });
    await page.getByLabel("Virtualized district rows").waitFor({ state: "visible" });

    const startupDurationMs = roundMs(performance.now() - startupStartedAt);
    const startupMetrics = await collectPageMetrics(page);
    const startupNavigation = await collectNavigationTiming(page);
    const districtRows = page.getByLabel("Virtualized district rows");
    const performanceOutput = page.getByTestId("district-list-performance");
    const renderedRowCount = await readIntegerAttribute(districtRows, "data-rendered-row-count");
    const derivationMs = await readNumberAttribute(performanceOutput, "data-derivation-ms");
    const selectionMs = await readNumberAttribute(performanceOutput, "data-selection-ms");

    const coverageRoute = "/?fixture=m7-extreme&surface=coverage&debug=1";
    const coverageStartedAt = performance.now();
    await page.goto(`${baseUrl}${coverageRoute}`, { waitUntil: "load" });
    await page.getByLabel("M7 tutorial hints encyclopedia workspace").waitFor({ state: "visible" });
    await page.getByLabel("M7 audio art localization coverage").waitFor({ state: "visible" });
    const coverageDurationMs = roundMs(performance.now() - coverageStartedAt);

    const coverageWorkspace = page.getByLabel("M7 audio art localization coverage");
    const coverageSurface = page.getByRole("region", { name: "Player guidance" });
    const localeCount = await readIntegerAttribute(coverageWorkspace, "data-locale-count");
    const assetReferenceCount = await readIntegerAttribute(
      coverageWorkspace,
      "data-asset-reference-count"
    );
    const activeSurface = await page.locator(".m7-guidance").getAttribute("data-active-surface");

    return {
      status: "PASS",
      baseUrl,
      startup: {
        route: startupRoute,
        durationMs: startupDurationMs,
        navigation: startupNavigation,
        pageMetrics: startupMetrics,
        densityProxy: {
          renderedRowCount,
          derivationMs,
          selectionMs
        }
      },
      coverage: {
        route: coverageRoute,
        durationMs: coverageDurationMs,
        activeSurface,
        localeCount,
        assetReferenceCount,
        coverageVisible: await coverageWorkspace.isVisible(),
        guidanceVisible: await coverageSurface.isVisible()
      }
    };
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
    await server.close();
  }
}

async function collectArtifactHashes() {
  return {
    web: await collectTreeHashesIfPresent(webDistRoot, ["index.html", "host-hash-canary.html", "assets"]),
    desktopPackage: await collectTreeHashesIfPresent(desktopPackageRoot, [
      "main/main.js",
      "preload/preload.cjs",
      "renderer/web/index.html",
      "renderer/web/assets"
    ])
  };
}

async function collectTreeHashesIfPresent(rootDir, interestingRelativePaths) {
  try {
    await access(rootDir);
  } catch {
    return {
      rootDir,
      exists: false,
      files: [],
      treeHash: null
    };
  }

  const files = [];
  for (const relativePath of interestingRelativePaths) {
    const fullPath = resolve(rootDir, relativePath);
    try {
      const fileStat = await stat(fullPath);
      if (fileStat.isDirectory()) {
        const directoryEntries = await walkDirectory(fullPath);
        for (const entry of directoryEntries) {
          files.push(entry);
        }
      } else if (fileStat.isFile()) {
        files.push(await hashFile(fullPath, rootDir));
      }
    } catch {
      // Ignore missing optional artifacts.
    }
  }

  files.sort((left, right) => left.path.localeCompare(right.path));
  const treeHash = hashCanonical(files);

  return {
    rootDir,
    exists: true,
    files,
    treeHash
  };
}

async function walkDirectory(rootDir) {
  const entries = [];
  const pending = [rootDir];

  while (pending.length > 0) {
    const currentDir = pending.pop();
    if (currentDir === undefined) {
      continue;
    }

    const children = await readdir(currentDir, { withFileTypes: true });
    for (const child of children) {
      const fullPath = resolve(currentDir, child.name);
      if (child.isDirectory()) {
        pending.push(fullPath);
      } else if (child.isFile()) {
        entries.push(await hashFile(fullPath, rootDir));
      }
    }
  }

  return entries;
}

async function hashFile(filePath, rootDir) {
  const bytes = await readFile(filePath);
  return {
    path: relative(rootDir, filePath).split("\\").join("/"),
    sha256: createHash("sha256").update(bytes).digest("hex").toUpperCase()
  };
}

function hashCanonical(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").toUpperCase();
}

async function collectPageMetrics(page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0] ?? null;
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find((entry) => entry.name === "first-paint");
    const firstContentfulPaint = paintEntries.find(
      (entry) => entry.name === "first-contentful-paint"
    );

    return {
      jsHeapUsedSize: performance.memory?.usedJSHeapSize ?? null,
      jsHeapTotalSize: performance.memory?.totalJSHeapSize ?? null,
      domContentLoadedEventEndMs: navigation?.domContentLoadedEventEnd ?? null,
      loadEventEndMs: navigation?.loadEventEnd ?? null,
      firstPaintMs: firstPaint?.startTime ?? null,
      firstContentfulPaintMs: firstContentfulPaint?.startTime ?? null
    };
  });
}

async function collectNavigationTiming(page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0] ?? null;
    if (navigation === null) {
      return null;
    }

    return {
      startTime: navigation.startTime ?? null,
      responseStartMs: navigation.responseStart ?? null,
      domInteractiveMs: navigation.domInteractive ?? null,
      domContentLoadedEventEndMs: navigation.domContentLoadedEventEnd ?? null,
      loadEventEndMs: navigation.loadEventEnd ?? null,
      transferSize: navigation.transferSize ?? null,
      encodedBodySize: navigation.encodedBodySize ?? null,
      decodedBodySize: navigation.decodedBodySize ?? null
    };
  });
}

async function readIntegerAttribute(locator, attributeName) {
  const value = await locator.getAttribute(attributeName);
  if (value === null) {
    throw new Error(`Expected ${attributeName} to exist.`);
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Expected ${attributeName} to be an integer, received ${value}.`);
  }

  return parsed;
}

async function readNumberAttribute(locator, attributeName) {
  const value = await locator.getAttribute(attributeName);
  if (value === null) {
    throw new Error(`Expected ${attributeName} to exist.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Expected ${attributeName} to be numeric, received ${value}.`);
  }

  return roundMs(parsed);
}

function collectHostInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    cpuCount: os.cpus().length,
    totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
    freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
    release: os.release(),
    hostname: os.hostname()
  };
}

function toMemorySnapshot(memoryUsage) {
  return {
    rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    externalMb: Math.round(memoryUsage.external / 1024 / 1024)
  };
}

function roundMs(value) {
  return Math.round(value * 100) / 100;
}

async function startStaticServer(rootDir) {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const pathname = decodeURIComponent(requestUrl.pathname);
      const resolved = resolve(rootDir, `.${pathname}`);
      if (!resolved.startsWith(rootDir)) {
        response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
        response.end("Forbidden");
        return;
      }

      const filePath = await resolveRequestFile(resolved);
      const bytes = await readFile(filePath);
      response.writeHead(200, {
        "content-type": contentTypeFor(filePath),
        "cache-control": "no-store"
      });
      response.end(bytes);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end(`Not found: ${message}`);
    }
  });

  await new Promise((resolveServer, rejectServer) => {
    server.once("error", rejectServer);
    server.listen(0, "127.0.0.1", () => resolveServer(undefined));
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Failed to determine static server port.");
  }

  return {
    port: address.port,
    async close() {
      await new Promise((resolveServer) => server.close(() => resolveServer(undefined)));
    }
  };
}

async function resolveRequestFile(resolvedPath) {
  const fileStat = await stat(resolvedPath).catch(() => null);
  if (fileStat?.isFile() === true) {
    return resolvedPath;
  }

  if (fileStat?.isDirectory() === true) {
    const indexHtml = join(resolvedPath, "index.html");
    if (await exists(indexHtml)) {
      return indexHtml;
    }
  }

  if (extname(resolvedPath) === "") {
    const htmlFile = `${resolvedPath}.html`;
    if (await exists(htmlFile)) {
      return htmlFile;
    }
  }

  throw new Error(`No static file found for ${resolvedPath}`);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function contentTypeFor(filePath) {
  switch (extname(filePath)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

// @ts-check

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @typedef {{ readonly name: string, readonly path: string }} ArtifactInput
 * @typedef {{ readonly output: string, readonly lockfile: string, readonly artifacts: readonly ArtifactInput[] }} ManifestOptions
 * @typedef {{ readonly path: string, readonly sha256: string, readonly size: number }} ManifestFile
 * @typedef {{ readonly absolutePath: string, readonly bytes: number }} WalkedFile
 */

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * @param {readonly string[]} argv
 * @param {number} index
 * @param {string} flag
 * @returns {string}
 */
function requireArgValue(argv, index, flag) {
  const value = argv[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}.`);
  }

  return value;
}

/**
 * @param {readonly string[]} argv
 * @returns {ManifestOptions}
 */
function parseArgs(argv) {
  /** @type {{ output: string, lockfile: string, artifacts: ArtifactInput[] }} */
  const options = {
    output: ".tmp/ci-manifest/manifest.json",
    lockfile: "pnpm-lock.yaml",
    artifacts: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined) {
      continue;
    }

    if (arg === "--output") {
      options.output = requireArgValue(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg.startsWith("--artifact=")) {
      options.artifacts.push(parseArtifactArg(arg.slice("--artifact=".length)));
      continue;
    }

    if (arg === "--artifact") {
      options.artifacts.push(parseArtifactArg(requireArgValue(argv, index, arg)));
      index += 1;
      continue;
    }

    if (arg === "--lockfile") {
      options.lockfile = requireArgValue(argv, index, arg);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.artifacts.length === 0) {
    options.artifacts.push({ name: "web-dist", path: "apps/web/dist" });
    options.artifacts.push({
      name: "desktop-smoke",
      path: ".tmp/desktop-package/MonsoonSovereigns-win32-x64"
    });
  }

  return options;
}

/**
 * @param {string} value
 * @returns {ArtifactInput}
 */
function parseArtifactArg(value) {
  const separatorIndex = value.indexOf("=");
  if (separatorIndex < 0) {
    return { name: value, path: value };
  }

  return {
    name: value.slice(0, separatorIndex),
    path: value.slice(separatorIndex + 1)
  };
}

/**
 * @param {string} path
 * @returns {string}
 */
function resolveInsideRepo(path) {
  const resolved = resolve(repoRoot, path);
  const relativePath = relative(repoRoot, resolved);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`Path escapes repository root: ${path}`);
  }

  return resolved;
}

/**
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function sha256OfPath(filePath) {
  const hash = createHash("sha256");
  const stream = createReadStream(filePath);

  await new Promise((resolvePromise, rejectPromise) => {
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", rejectPromise);
    stream.on("end", resolvePromise);
  });

  return hash.digest("hex");
}

/**
 * @param {string} rootDir
 * @param {string} [dir]
 * @param {WalkedFile[]} [accumulator]
 * @returns {Promise<WalkedFile[]>}
 */
async function walkFiles(rootDir, dir = rootDir, accumulator = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const current = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(rootDir, current, accumulator);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const stat = await fs.stat(current);
    accumulator.push({ absolutePath: current, bytes: stat.size });
  }

  return accumulator;
}

/**
 * @param {string} executable
 * @param {readonly string[]} args
 * @returns {string}
 */
function execSafe(executable, args) {
  try {
    return execFileSync(executable, args, { stdio: "pipe", encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

/**
 * @param {ArtifactInput} artifact
 * @returns {Promise<{ readonly name: string, readonly path: string, readonly fileCount: number, readonly bytes: number, readonly files: readonly ManifestFile[] }>}
 */
async function buildManifestFileList(artifact) {
  const artifactRoot = resolveInsideRepo(artifact.path);
  try {
    await fs.access(artifactRoot);
  } catch {
    throw new Error(`Artifact path does not exist: ${artifact.path}`);
  }

  const files = await walkFiles(artifactRoot);
  if (files.length === 0) {
    throw new Error(`Artifact path is empty: ${artifact.path}`);
  }

  /** @type {ManifestFile[]} */
  const recordedFiles = [];
  let totalBytes = 0;

  for (const file of files) {
    recordedFiles.push({
      path: relative(repoRoot, file.absolutePath).replaceAll("\\", "/"),
      sha256: await sha256OfPath(file.absolutePath),
      size: file.bytes
    });
    totalBytes += file.bytes;
  }

  return {
    name: artifact.name,
    path: artifact.path,
    fileCount: recordedFiles.length,
    bytes: totalBytes,
    files: recordedFiles.sort((left, right) =>
      left.path < right.path ? -1 : left.path > right.path ? 1 : 0
    )
  };
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  const outputPath = resolveInsideRepo(options.output);
  const lockfilePath = resolveInsideRepo(options.lockfile);
  const lockfileContents = await fs.readFile(lockfilePath, "utf8");
  const lockfileSha = createHash("sha256").update(lockfileContents).digest("hex");
  const artifacts = [];

  for (const artifact of options.artifacts) {
    artifacts.push(await buildManifestFileList(artifact));
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    build: {
      branch: execSafe("git", ["symbolic-ref", "--short", "-q", "HEAD"]),
      commit: execSafe("git", ["rev-parse", "HEAD"]),
      shortCommit: execSafe("git", ["rev-parse", "--short", "HEAD"]),
      node: process.version,
      pnpm: execSafe("pnpm", ["-v"])
    },
    lockfile: {
      path: relative(repoRoot, lockfilePath).replaceAll("\\", "/"),
      sha256: lockfileSha
    },
    artifacts
  };

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`artifact manifest written to ${relative(repoRoot, outputPath)}`);
  console.log(`build commit: ${manifest.build.commit}`);
  console.log(`lockfile sha256: ${manifest.lockfile.sha256}`);
  console.log(`artifact count: ${manifest.artifacts.length}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

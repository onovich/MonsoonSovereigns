// @ts-check

import { builtinModules } from "node:module";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import ts from "typescript";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = new Set(process.argv.slice(2));

const sourceExtensions = new Set([".cjs", ".cts", ".js", ".mjs", ".mts", ".ts", ".tsx"]);
const ignoredDirectoryNames = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out"
]);

const fixtureRoot = join(repoRoot, "tools", "architecture", "fixtures", "violating-dependency");

const requiredStrictOptions = [
  "strict",
  "noUncheckedIndexedAccess",
  "exactOptionalPropertyTypes",
  "useUnknownInCatchVariables",
  "noImplicitOverride",
  "noFallthroughCasesInSwitch",
  "noPropertyAccessFromIndexSignature",
  "forceConsistentCasingInFileNames",
  "verbatimModuleSyntax",
  "isolatedModules",
  "erasableSyntaxOnly"
];

const packageRootNames = new Set(["apps", "packages", "tools"]);
const nodeBuiltins = new Set(
  builtinModules.flatMap((moduleName) => [moduleName, `node:${moduleName}`])
);

const simCorePathPrefixes = [
  "packages/core/",
  "packages/sim-core/",
  "tools/architecture/fixtures/violating-dependency/packages/sim-core/"
];

const simCorePackageNames = new Set(["@monsoon/core", "@monsoon/sim-core"]);
const simCoreForbiddenPackages = new Set(["electron", "pixi.js", "react", "react-dom"]);
const simCoreForbiddenPrefixes = ["@pixi/"];
const forbiddenSimCoreGlobalCalls = new Set([
  "cancelAnimationFrame",
  "clearInterval",
  "clearTimeout",
  "requestAnimationFrame",
  "setInterval",
  "setTimeout"
]);
const forbiddenSimCoreGlobalIdentifiers = new Set([
  "document",
  "localStorage",
  "navigator",
  "sessionStorage",
  "window"
]);

/**
 * @typedef {{ filePath: string, message: string }} Violation
 * @typedef {{ excludeFixtures?: boolean }} ScanOptions
 */

/**
 * @param {string} path
 * @returns {string}
 */
function toPosixPath(path) {
  return path.split(sep).join("/");
}

/**
 * @param {string} rootPath
 * @param {string} filePath
 * @returns {string}
 */
function relativeFrom(rootPath, filePath) {
  return toPosixPath(relative(rootPath, filePath));
}

/**
 * @param {string} relativePath
 * @param {string} prefix
 * @returns {boolean}
 */
function isInsidePath(relativePath, prefix) {
  return relativePath === prefix.slice(0, -1) || relativePath.startsWith(prefix);
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isSourcePath(filePath) {
  return sourceExtensions.has(extname(filePath));
}

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function pathExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} filePath
 * @returns {Promise<unknown>}
 */
async function readJsonConfig(filePath) {
  const text = await readFile(filePath, "utf8");
  const parsed = ts.parseConfigFileTextToJson(filePath, text);
  if (parsed.error !== undefined) {
    const message = ts.flattenDiagnosticMessageText(parsed.error.messageText, "\n");
    throw new Error(`${filePath}: ${message}`);
  }
  return parsed.config;
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * @param {Record<string, unknown>} record
 * @param {string} key
 * @returns {Record<string, unknown> | undefined}
 */
function getRecordProperty(record, key) {
  const value = record[key];
  return isRecord(value) ? value : undefined;
}

/**
 * @param {Record<string, unknown>} record
 * @param {string} key
 * @returns {string[]}
 */
function getStringArrayProperty(record, key) {
  const value = record[key];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item) => typeof item === "string");
}

/**
 * @param {string} rootPath
 * @param {(relativePath: string) => boolean} [shouldSkipPath]
 * @returns {Promise<string[]>}
 */
async function collectFiles(rootPath, shouldSkipPath = (relativePath) => relativePath.length < 0) {
  /** @type {string[]} */
  const files = [];

  /**
   * @param {string} currentPath
   * @returns {Promise<void>}
   */
  async function visit(currentPath) {
    const entries = await readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = join(currentPath, entry.name);
      const relativePath = relativeFrom(rootPath, absolutePath);
      if (shouldSkipPath(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (!ignoredDirectoryNames.has(entry.name)) {
          await visit(absolutePath);
        }
        continue;
      }

      if (entry.isFile()) {
        files.push(absolutePath);
      }
    }
  }

  await visit(rootPath);
  return files;
}

/**
 * @param {string} rootPath
 * @returns {Promise<Violation[]>}
 */
async function validateTypeScriptBaseline(rootPath) {
  /** @type {Violation[]} */
  const violations = [];
  const baseConfigPath = join(rootPath, "tsconfig.base.json");
  const rootConfigPath = join(rootPath, "tsconfig.json");

  if (!(await pathExists(baseConfigPath))) {
    violations.push({ filePath: baseConfigPath, message: "Missing root tsconfig.base.json." });
    return violations;
  }

  if (!(await pathExists(rootConfigPath))) {
    violations.push({ filePath: rootConfigPath, message: "Missing root tsconfig.json." });
    return violations;
  }

  const baseConfig = await readJsonConfig(baseConfigPath);
  const rootConfig = await readJsonConfig(rootConfigPath);
  const baseCompilerOptions = isRecord(baseConfig)
    ? getRecordProperty(baseConfig, "compilerOptions")
    : undefined;

  if (baseCompilerOptions === undefined) {
    violations.push({
      filePath: baseConfigPath,
      message: "tsconfig.base.json must define compilerOptions."
    });
  } else {
    for (const optionName of requiredStrictOptions) {
      if (baseCompilerOptions[optionName] !== true) {
        violations.push({
          filePath: baseConfigPath,
          message: `compilerOptions.${optionName} must be true.`
        });
      }
    }
  }

  if (!isRecord(rootConfig) || rootConfig["extends"] !== "./tsconfig.base.json") {
    violations.push({
      filePath: rootConfigPath,
      message: "Root tsconfig.json must extend ./tsconfig.base.json."
    });
  }

  const rootIncludes = isRecord(rootConfig) ? getStringArrayProperty(rootConfig, "include") : [];
  for (const requiredPrefix of ["apps/", "packages/", "tools/"]) {
    if (!rootIncludes.some((entry) => entry.startsWith(requiredPrefix))) {
      violations.push({
        filePath: rootConfigPath,
        message: `Root tsconfig.json must cover ${requiredPrefix} workspace sources.`
      });
    }
  }

  const tsconfigFiles = (
    await collectFiles(
      rootPath,
      (relativePath) =>
        relativePath.startsWith("node_modules/") ||
        relativePath.startsWith("bootstrap/") ||
        relativePath.startsWith("tools/architecture/fixtures/")
    )
  ).filter((filePath) => /(^|[\\/])tsconfig[^\\/]*\.json$/u.test(filePath));

  for (const configPath of tsconfigFiles) {
    if (
      resolve(configPath) === resolve(baseConfigPath) ||
      resolve(configPath) === resolve(rootConfigPath)
    ) {
      continue;
    }

    const relativePath = relativeFrom(rootPath, configPath);
    const [firstSegment = ""] = relativePath.split("/");
    if (!packageRootNames.has(firstSegment)) {
      continue;
    }

    const config = await readJsonConfig(configPath);
    if (!isRecord(config)) {
      violations.push({ filePath: configPath, message: "tsconfig must be a JSON object." });
      continue;
    }

    const compilerOptions = getRecordProperty(config, "compilerOptions");
    if (compilerOptions !== undefined) {
      for (const optionName of requiredStrictOptions) {
        if (compilerOptions[optionName] === false) {
          violations.push({
            filePath: configPath,
            message: `Package tsconfig must not disable compilerOptions.${optionName}.`
          });
        }
      }
    }
  }

  return violations;
}

/**
 * @param {string} filePath
 * @returns {ts.ScriptKind}
 */
function getScriptKind(filePath) {
  switch (extname(filePath)) {
    case ".cts":
      return ts.ScriptKind.TS;
    case ".tsx":
      return ts.ScriptKind.TSX;
    case ".mts":
      return ts.ScriptKind.TS;
    case ".js":
      return ts.ScriptKind.JS;
    case ".mjs":
      return ts.ScriptKind.JS;
    case ".cjs":
      return ts.ScriptKind.JS;
    default:
      return ts.ScriptKind.TS;
  }
}

/**
 * @param {ts.SourceFile} sourceFile
 * @returns {string[]}
 */
function collectImportSpecifiers(sourceFile) {
  /** @type {string[]} */
  const specifiers = [];

  /**
   * @param {ts.Node} node
   * @returns {void}
   */
  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier !== undefined &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }

    if (ts.isCallExpression(node)) {
      const firstArgument = node.arguments[0];
      if (firstArgument === undefined || !ts.isStringLiteralLike(firstArgument)) {
        ts.forEachChild(node, visit);
        return;
      }

      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        specifiers.push(firstArgument.text);
      }

      if (ts.isIdentifier(node.expression) && node.expression.text === "require") {
        specifiers.push(firstArgument.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return specifiers;
}

/**
 * @param {ts.SourceFile} sourceFile
 * @returns {string[]}
 */
function collectForbiddenSimCoreApis(sourceFile) {
  /** @type {string[]} */
  const usages = [];

  /**
   * @param {ts.Node} node
   * @returns {void}
   */
  function visit(node) {
    if (ts.isIdentifier(node) && forbiddenSimCoreGlobalIdentifiers.has(node.text)) {
      usages.push(node.text);
    }

    if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression)) {
        const receiver = node.expression.expression;
        const propertyName = node.expression.name.text;
        if (ts.isIdentifier(receiver)) {
          const receiverName = receiver.text;
          if (
            (receiverName === "Math" && propertyName === "random") ||
            (receiverName === "Date" && propertyName === "now") ||
            (receiverName === "performance" && propertyName === "now")
          ) {
            usages.push(`${receiverName}.${propertyName}`);
          }
        }
      }

      if (
        ts.isIdentifier(node.expression) &&
        forbiddenSimCoreGlobalCalls.has(node.expression.text)
      ) {
        usages.push(node.expression.text);
      }
    }

    if (
      ts.isNewExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "Date"
    ) {
      usages.push("new Date");
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return usages;
}

/**
 * @param {string} specifier
 * @returns {boolean}
 */
function isForbiddenForSimCore(specifier) {
  if (nodeBuiltins.has(specifier)) {
    return true;
  }

  if (simCoreForbiddenPackages.has(specifier)) {
    return true;
  }

  return simCoreForbiddenPrefixes.some((prefix) => specifier.startsWith(prefix));
}

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
function isSimCoreSource(relativePath) {
  return simCorePathPrefixes.some((prefix) => isInsidePath(relativePath, prefix));
}

/**
 * @param {string} rootPath
 * @param {ScanOptions} [options]
 * @returns {Promise<Violation[]>}
 */
async function validateSourceImports(rootPath, options = {}) {
  const excludeFixtures = options.excludeFixtures === true;
  /** @type {Violation[]} */
  const violations = [];
  const files = await collectFiles(rootPath, (relativePath) => {
    if (excludeFixtures && relativePath.startsWith("tools/architecture/fixtures/")) {
      return true;
    }
    return false;
  });

  for (const filePath of files) {
    if (!isSourcePath(filePath)) {
      continue;
    }

    const relativePath = relativeFrom(rootPath, filePath);
    if (!isSimCoreSource(relativePath)) {
      continue;
    }

    const text = await readFile(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      text,
      ts.ScriptTarget.Latest,
      true,
      getScriptKind(filePath)
    );

    for (const specifier of collectImportSpecifiers(sourceFile)) {
      if (isForbiddenForSimCore(specifier)) {
        violations.push({
          filePath,
          message: `sim-core/core source must not import platform or presentation dependency "${specifier}".`
        });
      }
    }
  }

  return violations;
}

/**
 * @param {string} rootPath
 * @param {ScanOptions} [options]
 * @returns {Promise<Violation[]>}
 */
async function validateSimCoreAuthorityApis(rootPath, options = {}) {
  const excludeFixtures = options.excludeFixtures === true;
  /** @type {Violation[]} */
  const violations = [];
  const files = await collectFiles(rootPath, (relativePath) => {
    if (excludeFixtures && relativePath.startsWith("tools/architecture/fixtures/")) {
      return true;
    }
    return false;
  });

  for (const filePath of files) {
    if (!isSourcePath(filePath)) {
      continue;
    }

    const relativePath = relativeFrom(rootPath, filePath);
    if (!isSimCoreSource(relativePath)) {
      continue;
    }

    const text = await readFile(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      text,
      ts.ScriptTarget.Latest,
      true,
      getScriptKind(filePath)
    );

    for (const usage of collectForbiddenSimCoreApis(sourceFile)) {
      violations.push({
        filePath,
        message: `sim-core/core source must not use platform, clock, or render-frame API "${usage}".`
      });
    }
  }

  return violations;
}

/**
 * @param {string} rootPath
 * @param {ScanOptions} [options]
 * @returns {Promise<string[]>}
 */
async function findPackageManifestPaths(rootPath, options = {}) {
  const excludeFixtures = options.excludeFixtures === true;
  const files = await collectFiles(rootPath, (relativePath) => {
    if (excludeFixtures && relativePath.startsWith("tools/architecture/fixtures/")) {
      return true;
    }
    return false;
  });

  return files.filter((filePath) => filePath.endsWith(`${sep}package.json`));
}

/**
 * @param {string} rootPath
 * @param {ScanOptions} [options]
 * @returns {Promise<Violation[]>}
 */
async function validatePackageDependencies(rootPath, options = {}) {
  /** @type {Violation[]} */
  const violations = [];
  const packageManifestPaths = await findPackageManifestPaths(rootPath, options);

  for (const manifestPath of packageManifestPaths) {
    const text = await readFile(manifestPath, "utf8");
    const manifest = JSON.parse(text);
    const manifestName = isRecord(manifest) ? manifest["name"] : undefined;
    if (typeof manifestName !== "string") {
      continue;
    }

    const relativePath = relativeFrom(rootPath, manifestPath);
    const isSimCorePackage =
      simCorePackageNames.has(manifestName) ||
      relativePath.startsWith("packages/core/") ||
      relativePath.startsWith("packages/sim-core/");

    if (!isSimCorePackage) {
      continue;
    }

    const dependencyBlocks = [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies"
    ];
    for (const blockName of dependencyBlocks) {
      const block = getRecordProperty(manifest, blockName);
      if (block === undefined) {
        continue;
      }

      for (const dependencyName of Object.keys(block)) {
        if (isForbiddenForSimCore(dependencyName)) {
          violations.push({
            filePath: manifestPath,
            message: `sim-core/core package manifest must not declare forbidden dependency "${dependencyName}".`
          });
        }
      }
    }
  }

  return violations;
}

/**
 * @returns {Promise<Violation[]>}
 */
async function validateActualRepository() {
  return [
    ...(await validateTypeScriptBaseline(repoRoot)),
    ...(await validateSourceImports(repoRoot, { excludeFixtures: true })),
    ...(await validateSimCoreAuthorityApis(repoRoot, { excludeFixtures: true })),
    ...(await validatePackageDependencies(repoRoot, { excludeFixtures: true }))
  ];
}

/**
 * @returns {Promise<Violation[]>}
 */
async function validateViolatingFixture() {
  return [
    ...(await validateSourceImports(fixtureRoot)),
    ...(await validateSimCoreAuthorityApis(fixtureRoot)),
    ...(await validatePackageDependencies(fixtureRoot))
  ];
}

/**
 * @param {string} title
 * @param {Violation[]} violations
 * @returns {void}
 */
function printViolations(title, violations) {
  if (violations.length === 0) {
    return;
  }

  console.error(title);
  for (const violation of violations) {
    console.error(`- ${relativeFrom(repoRoot, violation.filePath)}: ${violation.message}`);
  }
}

/**
 * @returns {Promise<void>}
 */
async function main() {
  if (args.has("--self-test-only")) {
    const fixtureViolations = await validateViolatingFixture();
    if (fixtureViolations.length === 0) {
      console.error("Architecture checker self-test failed: violating fixture passed.");
      process.exitCode = 1;
      return;
    }

    console.log(
      `Architecture checker self-test passed with ${fixtureViolations.length} expected violation(s).`
    );
    return;
  }

  const actualViolations = await validateActualRepository();
  if (actualViolations.length > 0) {
    printViolations("Architecture boundary violations:", actualViolations);
    process.exitCode = 1;
    return;
  }

  const fixtureViolations = await validateViolatingFixture();
  if (fixtureViolations.length === 0) {
    console.error("Architecture checker self-test failed: violating fixture passed.");
    process.exitCode = 1;
    return;
  }

  console.log("Architecture boundaries passed.");
  console.log(`Self-test fixture produced ${fixtureViolations.length} expected violation(s).`);
}

await main();

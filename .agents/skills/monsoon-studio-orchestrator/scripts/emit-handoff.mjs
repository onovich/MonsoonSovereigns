#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidHandoff, readJson } from "./handoff-lib.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const outbox = path.join(repoRoot, "project", "messages", "outbox");
const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node emit-handoff.mjs <handoff.json>");
  process.exit(2);
}

try {
  const { absolutePath, value } = readJson(filePath);
  const h = assertValidHandoff(value, absolutePath);
  fs.mkdirSync(outbox, { recursive: true });
  const safe = (s) => s.replace(/[^A-Za-z0-9._-]/g, "_");
  const target = path.join(outbox, `${safe(h.task_id)}__${safe(h.message_id)}__${safe(h.from_role)}.json`);
  const temp = `${target}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(h, null, 2)}\n`, "utf8");
  fs.renameSync(temp, target);
  console.log(target);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

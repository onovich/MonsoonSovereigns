#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const taskRoot = path.join(repoRoot, "project", "tasks");
const activeDir = path.join(taskRoot, "active");
const archiveDir = path.join(taskRoot, "archive");
const registryPath = path.join(taskRoot, "thread-registry.json");
const initialBacklogPath = path.join(taskRoot, "initial-backlog.json");
const validStatuses = new Set(["DRAFT", "READY", "IN_PROGRESS", "REVIEW", "ACCEPTED", "CLOSED", "BLOCKED", "PARTIAL"]);

function now() { return new Date().toISOString(); }
function ensureDirs() {
  fs.mkdirSync(activeDir, { recursive: true });
  fs.mkdirSync(archiveDir, { recursive: true });
  if (!fs.existsSync(registryPath)) atomicWrite(registryPath, { version: 1, updated_at: now(), entries: {} });
}
function atomicWrite(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temp, filePath);
}
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function taskPath(id) { return path.join(activeDir, `${id}.json`); }
function loadTask(idOrPath) {
  const candidate = fs.existsSync(idOrPath) ? path.resolve(idOrPath) : taskPath(idOrPath);
  if (!fs.existsSync(candidate)) throw new Error(`Task not found: ${idOrPath}`);
  return { filePath: candidate, task: readJson(candidate) };
}
function validateTask(task) {
  const errors = [];
  if (!task || typeof task !== "object" || Array.isArray(task)) return ["root must be object"];
  for (const key of ["id", "summary", "milestone", "status", "owner_role", "reviewer_role", "risk_level", "route_to", "created_at", "updated_at"]) {
    if (typeof task[key] !== "string" || task[key].trim() === "") errors.push(`${key} must be non-empty string`);
  }
  if (typeof task.status === "string" && !validStatuses.has(task.status)) errors.push(`invalid status: ${task.status}`);
  for (const key of ["dependencies", "acceptance_criteria", "required_tests", "notes"]) if (!Array.isArray(task[key])) errors.push(`${key} must be array`);
  if (!task.scope || typeof task.scope !== "object" || !Array.isArray(task.scope.allowed_paths) || !Array.isArray(task.scope.forbidden_paths)) errors.push("scope must contain allowed_paths and forbidden_paths arrays");
  if (!task.threads || typeof task.threads !== "object" || Array.isArray(task.threads)) errors.push("threads must be object");
  return errors;
}
function assertTask(task) {
  const errors = validateTask(task);
  if (errors.length) throw new Error(`Invalid task ${task?.id ?? "<unknown>"}:\n- ${errors.join("\n- ")}`);
}
function parseFlags(args) {
  const result = {};
  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = args[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    result[key] = value;
    i += 1;
  }
  return result;
}
function usage() {
  console.log(`taskctl commands:\n  init\n  seed-initial\n  create --id ID --summary TEXT --owner ROLE [--reviewer ROLE --milestone M0 --risk R1 --route-to ROLE]\n  import <task.json>\n  list [--status STATUS]\n  show <ID>\n  validate <ID|path>\n  set-status <ID> <STATUS>\n  set-thread <ID> <ROLE> <THREAD_ID>\n  clear-thread <ID> <ROLE>\n  get-thread <ID> <ROLE>\n  ready\n  archive <ID>`);
}

ensureDirs();
const [command, ...args] = process.argv.slice(2);
try {
  switch (command) {
    case "init":
      console.log(`Initialized ${taskRoot}`);
      break;
    case "seed-initial": {
      if (!fs.existsSync(initialBacklogPath)) throw new Error(`Initial backlog not found: ${initialBacklogPath}`);
      const source = readJson(initialBacklogPath);
      if (!source || !Array.isArray(source.tasks)) throw new Error("initial-backlog.json must contain a tasks array");
      let created = 0;
      let skipped = 0;
      for (const task of source.tasks) {
        assertTask(task);
        const target = taskPath(task.id);
        if (fs.existsSync(target)) {
          skipped += 1;
          continue;
        }
        atomicWrite(target, task);
        created += 1;
      }
      console.log(`Seeded ${created} task(s); skipped ${skipped} existing task(s).`);
      break;
    }
    case "create": { 
      const f = parseFlags(args);
      if (!f.id || !f.summary || !f.owner) throw new Error("create requires --id, --summary, --owner");
      const filePath = taskPath(f.id);
      if (fs.existsSync(filePath)) throw new Error(`Task already exists: ${f.id}`);
      const task = {
        id: f.id,
        summary: f.summary,
        milestone: f.milestone ?? "M0",
        status: "DRAFT",
        owner_role: f.owner,
        reviewer_role: f.reviewer ?? "qa_reviewer",
        risk_level: f.risk ?? "R1",
        dependencies: [],
        scope: { allowed_paths: [], forbidden_paths: [] },
        acceptance_criteria: [],
        required_tests: [],
        branch_or_worktree: null,
        threads: {},
        route_to: f["route-to"] ?? f.owner,
        notes: [],
        created_at: now(),
        updated_at: now(),
      };
      assertTask(task);
      atomicWrite(filePath, task);
      console.log(filePath);
      break;
    }
    case "import": {
      const source = args[0];
      if (!source) throw new Error("import requires a JSON file");
      const task = readJson(path.resolve(source));
      assertTask(task);
      const target = taskPath(task.id);
      if (fs.existsSync(target)) throw new Error(`Task already exists: ${task.id}`);
      atomicWrite(target, task);
      console.log(target);
      break;
    }
    case "list": {
      const f = parseFlags(args);
      const rows = fs.readdirSync(activeDir).filter((name) => name.endsWith(".json")).map((name) => readJson(path.join(activeDir, name))).filter((task) => !f.status || task.status === f.status).sort((a, b) => a.id.localeCompare(b.id));
      for (const task of rows) console.log(`${task.id}\t${task.status}\t${task.owner_role}\t${task.summary}`);
      break;
    }
    case "show": {
      const { task } = loadTask(args[0]);
      console.log(JSON.stringify(task, null, 2));
      break;
    }
    case "validate": {
      const { filePath, task } = loadTask(args[0]);
      assertTask(task);
      console.log(`VALID ${filePath}`);
      break;
    }
    case "set-status": {
      const [id, status] = args;
      if (!validStatuses.has(status)) throw new Error(`Invalid status: ${status}`);
      const { filePath, task } = loadTask(id);
      task.status = status;
      task.updated_at = now();
      assertTask(task);
      atomicWrite(filePath, task);
      console.log(`${id} ${status}`);
      break;
    }
    case "set-thread": {
      const [id, role, threadId] = args;
      if (!id || !role || !threadId) throw new Error("set-thread requires ID ROLE THREAD_ID");
      const { filePath, task } = loadTask(id);
      task.threads[role] = threadId;
      task.updated_at = now();
      atomicWrite(filePath, task);
      const registry = readJson(registryPath);
      registry.entries[`${id}:${role}`] = { task_id: id, role, thread_id: threadId, updated_at: now() };
      registry.updated_at = now();
      atomicWrite(registryPath, registry);
      console.log(threadId);
      break;
    }
    case "clear-thread": {
      const [id, role] = args;
      const { filePath, task } = loadTask(id);
      delete task.threads[role];
      task.updated_at = now();
      atomicWrite(filePath, task);
      const registry = readJson(registryPath);
      delete registry.entries[`${id}:${role}`];
      registry.updated_at = now();
      atomicWrite(registryPath, registry);
      console.log(`cleared ${id}:${role}`);
      break;
    }
    case "get-thread": {
      const [id, role] = args;
      const registry = readJson(registryPath);
      const entry = registry.entries[`${id}:${role}`];
      if (!entry) process.exitCode = 3;
      else console.log(entry.thread_id);
      break;
    }
    case "ready": {
      const tasks = fs.readdirSync(activeDir).filter((name) => name.endsWith(".json")).map((name) => readJson(path.join(activeDir, name)));
      const accepted = new Set(tasks.filter((t) => ["ACCEPTED", "CLOSED"].includes(t.status)).map((t) => t.id));
      const ready = tasks.filter((t) => ["DRAFT", "READY"].includes(t.status) && t.dependencies.every((id) => accepted.has(id))).sort((a, b) => a.id.localeCompare(b.id));
      for (const task of ready) console.log(`${task.id}\t${task.status}\t${task.owner_role}\t${task.summary}`);
      break;
    }
    case "archive": {
      const id = args[0];
      const { filePath, task } = loadTask(id);
      if (!["ACCEPTED", "CLOSED"].includes(task.status)) throw new Error("Only ACCEPTED or CLOSED tasks may be archived");
      task.status = "CLOSED";
      task.updated_at = now();
      const target = path.join(archiveDir, `${id}.json`);
      atomicWrite(target, task);
      fs.unlinkSync(filePath);
      console.log(target);
      break;
    }
    default:
      usage();
      if (command) process.exitCode = 2;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

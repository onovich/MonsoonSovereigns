# 27. Autonomous Goal Mode

Decision ID: AUTONOMOUS-GOAL-MODE-001
Date: 2026-06-23
Status: Accepted
Product owner approval: BOOTSTRAP-INTEGRATION-AND-AUTONOMOUS-GOAL-MODE-001 user authorization message

## 1. Context

`AUTONOMOUS-GOAL-MODE-001` establishes a process overlay for letting Codex continue dependency-ready work without asking for a new human prompt after every task. It is not a product, platform, simulation, save-format, historical-content, or architecture decision.

The mode exists because the repository now has enough process infrastructure to make autonomous continuation auditable:

- task JSON with explicit owner, reviewer, dependencies, allowed paths, forbidden paths, acceptance criteria, and required tests;
- structured handoff JSON in `project/messages/outbox`;
- independent reviewer routing;
- model-routing policy in `MODEL-ROUTING-AMENDMENT-001`;
- persistent state in `project/goal-mode-state.json`.

All frozen decisions in `PROJECT_STATUS.md` remain frozen. Any change to those decisions still requires the normal ADR, evidence, independent review, and human approval path.

## 2. Long-Term Goal

Autonomous Goal Mode should move the project from **Pre-production / Foundation Ready** through M0 engineering baseline and toward the M5 vertical-slice decision gate by repeatedly selecting the next dependency-satisfied task, executing it within scope, routing it to the required reviewer, integrating only after gates pass, and stopping at every Human Gate.

The long-term goal is operational, not creative: keep the task graph moving while preserving determinism, historical/cultural review, security discipline, and the frozen Web-first TypeScript architecture.

## 3. Non-Goals

Autonomous Goal Mode must not:

- implement gameplay without an approved task;
- change Roadmap order or milestone exit criteria;
- reopen accepted ADRs or frozen product/platform/core architecture decisions;
- merge writer output without independent review;
- create new production dependencies without the existing dependency and ADR rules;
- bypass human approval for R4 decisions, milestone exits, release, business, branding, or cultural-risk gates.

## 4. Operating State

The current mode state is stored in `project/goal-mode-state.json`. It is coordination state, not product data.

Required fields:

- `enabled`
- `long_term_goal`
- `current_milestone`
- `current_tasks`
- `active_threads`
- `last_integrated_task`
- `last_main_commit`
- `next_ready_tasks`
- `unresolved_risks`
- `human_gate`
- `last_updated_at`

`last_integrated_task` changes only after lead integration, not when a writer emits `REVIEW`. `last_main_commit` records the repository commit that was current when the state was last checked. If `HEAD` drifts from that value, the lead must re-run status and relevant gates before continuing.

## 5. Auto-Merge Gates

Within this project, "auto-merge" means the lead_orchestrator may proceed from an accepted task to integration without another product-owner prompt. GitHub branch protection, required checks, and human gates still apply.

All of the following must be true:

1. The task exists in `project/tasks/active` with dependencies satisfied and status compatible with the transition being performed.
2. The task scope contains explicit `allowed_paths` and `forbidden_paths`.
3. The diff is confined to allowed paths.
4. No forbidden artifact, provenance ZIP, checksum, `SHA256SUMS.txt`, `VALIDATION_REPORT.md`, or accepted ADR is modified unless a later task explicitly allows it.
5. The writer handoff is valid JSON, status `REVIEW`, and routes to the assigned reviewer.
6. An independent reviewer handoff is valid JSON and begins with an accepted review outcome before lead acceptance.
7. Every required test is run, or the task remains `PARTIAL`/`BLOCKED` with the real command failure recorded.
8. `git diff --check` passes.
9. `taskctl.mjs validate <TASK_ID>`, `taskctl.mjs list`, and `taskctl.mjs ready` pass.
10. Schema or state files touched by the task are parsed and shape-checked with a real command.
11. No Human Gate is active.
12. No new production dependency, package boundary, save/schema, IPC, RNG/time, history interpretation, platform commitment, or security model change is hidden inside the task.
13. The branch is not `main`, the commit is traceable, and unrelated uncommitted work is not included.

Failing any gate stops autonomous continuation and produces a `BLOCKED` or `PARTIAL` handoff.

## 6. Human Gates

Autonomous Goal Mode stops and asks the product owner or named decision owner before:

- enabling the mode for the first time or materially changing this decision;
- changing frozen product, platform, technology, simulation-authority, deterministic, save-format, or historical-policy decisions;
- accepting or merging any new R4 decision without an explicit approval source;
- exiting a milestone, especially M0 and M5;
- deciding brand, commercial model, budget, release timing, store presence, telemetry, networking, arbitrary-code Mod support, or macOS desktop commitment;
- resolving major historical/cultural disputes or turning insufficient evidence into product content;
- approving a new production dependency or license/security exception;
- increasing WIP limits above this document or `docs/14-multi-agent-operating-model.md`;
- continuing after required tests cannot run for reasons that would make the task status misleading;
- integrating when another writer's uncommitted work conflicts with the task scope.

For PROCESS-001, the first enablement Human Gate is satisfied by the BOOTSTRAP-INTEGRATION-AND-AUTONOMOUS-GOAL-MODE-001 user authorization message. Future Human Gates still apply.

## 7. WIP Limits

Autonomous continuation uses the existing project concurrency limits:

- `max_threads = 6`
- `max_depth = 1`
- one lead_orchestrator as parent-owned router;
- at most four worker/research threads at once;
- at least one reviewer capacity reserved;
- no recursive delegation;
- no two writers on the same package, file area, or task;
- no more than one R3/R4 task in active implementation at a time unless the lead records an explicit scheduling reason.

The mode may inspect `DRAFT` tasks and propose ordering, but it may only start work the lead has made `READY` or that the product owner explicitly authorizes for the current turn. It must not silently advance beyond the current milestone's exit gate.

## 8. Thread And Model Routing

Autonomous Goal Mode uses the model matrix in `MODEL-ROUTING-AMENDMENT-001` and does not override it.

Current routing rules:

- `lead_orchestrator`: gpt-5.5 / xhigh, final router and integrator.
- `systems_architect`: gpt-5.5 / xhigh, architecture/process writer or reviewer.
- `qa_reviewer`: gpt-5.5 / xhigh, read-only independent acceptance reviewer.
- `security_reviewer`: gpt-5.5 / xhigh, required when Electron, IPC, supply-chain, secrets, persistence, sandbox, or release security is touched.
- `simulation_engineer`, `client_engineer`, and `historical_researcher`: gpt-5.5 / high for complex writing in their domains.
- `research_scout`: gpt-5.4-mini / medium, read-only evidence discovery.
- `test_engineer` and `balance_analyst`: gpt-5.4-mini / high for fixtures, gates, and controlled analysis.
- `release_engineer` and `spark_worker`: gpt-5.3-codex-spark / medium only for bounded mechanical work; their output cannot be final acceptance.

If Spark is unavailable, record `MODEL_FALLBACK` in `project/model-routing-state.json`, use the documented fallback, and do not redo accepted work merely because Spark later becomes available.

All child-to-child routing remains parent-owned. A handoff's `route_to` expresses intent; the lead performs actual `send_input`, `spawn_agent`, or replacement-thread recovery.

## 9. Checkpoints And Recovery

Autonomous Goal Mode checkpoints at these moments:

1. Before starting a task: run `git status`, validate the task, inspect dependencies, and update `project/goal-mode-state.json`.
2. After a writer finishes: write and validate a handoff under `project/messages/outbox`.
3. After review: write and validate the reviewer handoff.
4. Before integration: re-check diff scope, required tests, forbidden paths, and Human Gates.
5. After integration: update task state, `last_integrated_task`, `last_main_commit`, and unresolved risks.

Recovery after restart or context loss:

1. Read `AGENTS.md`, `PROJECT_STATUS.md`, this document, `docs/14-multi-agent-operating-model.md`, and `project/goal-mode-state.json`.
2. Run `git status` and compare `HEAD` to `last_main_commit`.
3. Run `taskctl.mjs list` and `taskctl.mjs ready`.
4. Validate the current task and latest relevant handoff.
5. Resume from the newest validated handoff, not from memory.
6. Treat stale thread IDs as session hints only; spawn a replacement role if the lead cannot resume the original thread.
7. If there is a partial diff without a handoff, inspect it, determine whether it belongs to the active task, and either finish the same task or emit `BLOCKED`/`PARTIAL`. Never discard it silently.

## 10. Continuation Protocol

The lead_orchestrator loop is:

1. Load `project/goal-mode-state.json`, task JSON, thread registry, latest outbox messages, and current git status.
2. Stop if `human_gate.required` is true.
3. If a writer handoff is pending review, validate it and route to the assigned reviewer.
4. If a reviewer requests changes, route back to the original writer.
5. If a reviewer blocks, stop and route to the named decision owner.
6. If a reviewer accepts, run integration gates and update task/state only after they pass.
7. Recompute `next_ready_tasks` with `taskctl.mjs ready`.
8. Select only a dependency-satisfied task in the current milestone and within WIP limits.
9. Spawn or resume the owner role with required reads, scope, tests, and `ROUTE_TO`.
10. Wait for a structured handoff, validate it, update state, and repeat until a stop condition or Human Gate appears.

Stopping conditions include no ready task, missing approval, failed required gate, ambiguous scope, conflicting uncommitted work, security/license/history risk, exceeded WIP limit, or user instruction to stop.

## 11. GitHub Automation Plan

This plan is not implemented by PROCESS-001; it defines the future automation target.

- One GitHub issue or tracked task per task ID.
- One branch and pull request per task, named with the task ID.
- Pull request template requires task ID, allowed paths, forbidden paths, handoff path, tests run, risks, and Human Gate status.
- Required checks include install integrity, format/lint/typecheck/test as available, `git diff --check`, task validation, handoff validation, and a forbidden-artifact diff guard.
- Branch protection requires at least one independent reviewer; R3/R4 or security-sensitive changes require the named high-capability reviewer.
- Auto-merge may be enabled only after required checks, required reviews, diff guard, and Human Gate check pass.
- Labels should include `autonomous-goal-mode`, task status, risk level, `human-gate` when active, and `blocked` when continuation stops.
- GitHub automation uses least-privilege tokens and must not run untrusted remote code outside normal CI checkout and package-manager integrity checks.
- Release or artifact publication remains outside autonomous merge until the release process and human release gates are explicitly approved.

## 12. Relationship To Existing Decisions

This decision references and preserves:

- `PROJECT_STATUS.md` frozen decisions D-001 through D-015;
- `MODEL-ROUTING-AMENDMENT-001`;
- the delivery workflow in `docs/06-delivery-workflow.md`;
- the parent-owned multi-agent routing model in `docs/14-multi-agent-operating-model.md`;
- the startup and recovery rules in `docs/15-codex-startup-runbook.md`;
- the rejected-direction guardrails in `docs/25-decision-history-and-rejected-directions.md`.

It is accepted solely as a controlled delivery process mode.

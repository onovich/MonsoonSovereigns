# 26. 模型路由增量修订

Decision ID: MODEL-ROUTING-AMENDMENT-001  
Date: 2026-06-23  
Status: Accepted

## Context

原始交接包已完成外部 SHA-256、内部 SHA256SUMS、ZIP 安全检查和 Skill 对比验证。本文件是验证导入之后的正常项目演进，不修改原始交接证明，也不要求重新生成旧 checksum。

项目已进入 M0 工程基线执行。为了提高裁决质量，同时积极使用快速执行通道，需要修订角色模型、推理强度和 Spark 使用边界。

## Decision

从本决策生效后，角色模型如下：

| Role | Model | Effort | Sandbox | Writer/Reviewer |
|---|---|---|---|---|
| lead_orchestrator | gpt-5.5 | xhigh | workspace-write | final router |
| systems_architect | gpt-5.5 | xhigh | workspace-write | architect/reviewer |
| gameplay_designer | gpt-5.5 | xhigh | workspace-write | designer |
| qa_reviewer | gpt-5.5 | xhigh | read-only | independent acceptance |
| security_reviewer | gpt-5.5 | xhigh | read-only | security reviewer |
| simulation_engineer | gpt-5.5 | high | workspace-write | complex writer |
| client_engineer | gpt-5.5 | high | workspace-write | complex writer |
| historical_researcher | gpt-5.5 | high | workspace-write | research owner |
| research_scout | gpt-5.4-mini | medium | read-only | scout |
| test_engineer | gpt-5.4-mini | high | workspace-write | test writer |
| balance_analyst | gpt-5.4-mini | high | workspace-write | analysis writer |
| release_engineer | gpt-5.3-codex-spark | medium | workspace-write | bounded release writer |
| spark_worker | gpt-5.3-codex-spark | medium | workspace-write | bounded mechanical writer |

## Spark Boundaries

Spark is for explicit, mechanical, path-limited execution:

- package scaffolding;
- mechanical configuration changes;
- boilerplate against approved interfaces;
- listed tests, fixtures, DTOs, validators, adapters;
- lint/format/typecheck fixes;
- small React/CSS edits;
- simple pnpm, CI, build, and check scripts.

Spark must not decide architecture, public package boundaries, domain models, economy/vassal/population/diplomacy/supply/battle rules, save compatibility, deterministic strategy, security acceptance, unapproved production dependencies, large refactors, or final task acceptance.

Each Spark task must include TASK, CONTEXT, ALLOWED_PATHS, FORBIDDEN_PATHS, ACCEPTANCE_CRITERIA, REQUIRED_TESTS, STOP_CONDITIONS, REQUIRED_HANDOFF, and ROUTE_TO.

## Migration Rules

- Do not reopen ACCEPTED tasks solely because model routing changed.
- Threads with no useful handoff may be closed and recreated under the new matrix.
- Active writers complete the current minimal atomic work and hand off; later phases use the new matrix.
- REVIEW tasks use the new reviewer model and do not restart writers.
- M0 final gate may have qa_reviewer xhigh recheck accepted M0 tasks; only real defects create follow-up tasks.
- Do not claim actual model, effort, or thread ID unless the environment exposes it.

## Fallback

If GPT-5.3-Codex-Spark is unavailable, record `MODEL_FALLBACK` in `project/model-routing-state.json`, temporarily use `gpt-5.4-mini` / `medium`, and list affected tasks. Do not automatically redo accepted work when Spark later becomes available.

## Relationship To Prior Decisions

This amendment does not change the frozen product, platform, TypeScript/Web-first architecture, Worker authority, deterministic simulation, Roadmap, historical policy, or M0 task scope. It only updates Codex execution routing after the verified handoff import.

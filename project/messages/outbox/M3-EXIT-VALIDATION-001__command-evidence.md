# M3 Exit Validation Command Evidence

Task: `M3-EXIT-VALIDATION-001`
Role: `systems_architect`
Branch/worktree: `chore/m3-exit-gate` / `D:\WebProjects\MonsoonSovereigns`
Gate document: `docs/GATE-M3.md`
Systems handoff: `project/messages/outbox/M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW__systems_architect.json`

## Required Commands

| Command                                                                                                                                                                                    | Exit | Result                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git status --short`                                                                                                                                                                       |    0 | Initial pre-edit run had no output. Final post-edit run shows only allowed docs, process state, and outbox evidence paths.                                                                          |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs validate M3-EXIT-VALIDATION-001`                                                                                      |    0 | `VALID D:\WebProjects\MonsoonSovereigns\project\tasks\active\M3-EXIT-VALIDATION-001.json`.                                                                                                          |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs list`                                                                                                                 |    0 | All M3 dependencies were `CLOSED`. Initial run showed `M3-EXIT-VALIDATION-001` as `IN_PROGRESS`; final rerun after systems handoff state update shows it as `REVIEW`.                               |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/taskctl.mjs ready`                                                                                                                |    0 | No output; no M4 task was opened by this writer.                                                                                                                                                    |
| `pnpm install --frozen-lockfile`                                                                                                                                                           |    0 | All 16 workspace projects already up to date; completed under pnpm 11.0.0.                                                                                                                          |
| `pnpm check`                                                                                                                                                                               |    0 | Prettier, ESLint, recursive typecheck, and architecture boundary checks passed; boundary self-test produced 15 expected violations.                                                                 |
| `pnpm test`                                                                                                                                                                                |    0 | Architecture boundaries and determinism passed; root Vitest 25 files / 165 tests passed; web Vitest 1 file / 3 tests passed. Existing `MODULE_TYPELESS_PACKAGE_JSON` warning remained non-blocking. |
| `pnpm content:validate`                                                                                                                                                                    |    0 | M1, M2, and M3 fixtures validated. M3 fixture had 64 characters, 18 relationships, 4 offices, 4 landed powers, 4 office policies, 4 enfeoffment hooks, manifest hash `76b75849`.                    |
| `pnpm sim:determinism`                                                                                                                                                                     |    0 | Hashes matched: hello `61e0ba1c`, command/query `d275faa4`, save/load `28074edd`; save byte length `10920`.                                                                                         |
| `pnpm sim:perf-baseline`                                                                                                                                                                   |    0 | 3650 days, finalRevision `3650`, throughput `13255` days/sec, p50 `58500` ns, p95 `131900` ns, p99 `212400` ns, saveByteLength `9980`.                                                              |
| `pnpm build:web`                                                                                                                                                                           |    0 | Vite production build passed; existing non-blocking chunk-size warning for `dist/assets/lib-a6cQy7l-.js` at 513.64 kB remained.                                                                     |
| `pnpm exec vitest run tests/sim-core-m3-postwar-governance.test.ts -t "compares materially different 24-month outcomes"`                                                                   |    0 | 1 test file passed; 1 test passed and 10 skipped. This is the focused M3 24-month direct-control / restored-vassal / tribute-only outcome proof.                                                    |
| `pnpm test:e2e --project=chromium --grep "M3 appointment workspace"`                                                                                                                       |    0 | 2 Chromium Playwright tests passed: appointment/bulk command DTO submission and 1440px viewport fit.                                                                                                |
| `node .agents/skills/monsoon-studio-orchestrator/scripts/validate-handoff.mjs project/messages/outbox/M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW__systems_architect.json` |    0 | `VALID D:\WebProjects\MonsoonSovereigns\project\messages\outbox\M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW__systems_architect.json`.                                               |
| `git diff --check`                                                                                                                                                                         |    0 | No whitespace errors.                                                                                                                                                                               |

## Historical Claim Pipeline Probe

Exact command:

```powershell
node -e "const fs=require('fs');const qa=JSON.parse(fs.readFileSync('project/messages/outbox/M3-HISTORICAL-CLAIM-PIPELINE-001__MSG-20260625-M3-CLAIM-PIPELINE-QA-ACCEPT__qa_reviewer.json','utf8'));const schema=JSON.parse(fs.readFileSync('project/schemas/historical-claim.schema.json','utf8'));const template=fs.readFileSync('project/templates/historical-claim.yaml','utf8');const research=fs.readFileSync('docs/research/m3-historical-claim-pipeline.md','utf8');const fixture=JSON.parse(fs.readFileSync('content-source/m3-fixtures/character-office-validation-64.json','utf8'));const chars=fixture.characters||[];const nonAbstract=chars.map(c=>c.displayNameKey).filter(k=>!String(k).startsWith('content.m3.validation.'));const ok=qa.status==='ACCEPT'&&schema.title==='Historical Claim Record'&&schema.required.includes('claim_id')&&template.includes('claim_id:')&&research.includes('source statement')&&research.includes('Validation-only')&&fixture.historicity==='FICTIONAL'&&fixture.provenance.policyId==='M3-HISTORICAL-CLAIM-PIPELINE-001'&&chars.length===64&&chars.every(c=>c.claimLabel==='FICTIONAL_VALIDATION')&&nonAbstract.length===0;console.log(JSON.stringify({result:ok?'PASS':'FAIL',qaStatus:qa.status,schemaTitle:schema.title,templateHasClaimId:template.includes('claim_id:'),characters:chars.length,historicity:fixture.historicity,nonAbstractKeys:nonAbstract},null,2));process.exit(ok?0:1)"
```

Exit code: 0

Result:

```json
{
  "result": "PASS",
  "qaStatus": "ACCEPT",
  "schemaTitle": "Historical Claim Record",
  "templateHasClaimId": true,
  "characters": 64,
  "historicity": "FICTIONAL",
  "nonAbstractKeys": []
}
```

## JSON Shape And Allowed-Path Probe

Exact command:

```powershell
node -e "const fs=require('fs'),cp=require('child_process');const oldHash='ef40f3df'+'ddfdb64500a0c348590588209b117db9',main='ef40f3dff442ee16acc479346d8f0409c2ca736e';const r1='project/messages/outbox/M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW__systems_architect.json';const r2='project/messages/outbox/M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW-R2__systems_architect.json';const ev='project/messages/outbox/M3-EXIT-VALIDATION-001__command-evidence.md';const rd=p=>JSON.parse(fs.readFileSync(p,'utf8'));const gate=fs.readFileSync('docs/GATE-M3.md','utf8');const task=rd('project/tasks/active/M3-EXIT-VALIDATION-001.json'),goal=rd('project/goal-mode-state.json'),routing=rd('project/model-routing-state.json'),reg=rd('project/tasks/thread-registry.json'),cont=rd('project/messages/outbox/GOAL-MODE-CONTINUATION.json'),handoff=rd(r2);const tid='019f00ab-b4f3-7b01-8616-d5391a341275',key='M3-EXIT-VALIDATION-001:systems_architect';const modelThread=routing.active_threads.find(t=>t.task_id==='M3-EXIT-VALIDATION-001'&&t.role==='systems_architect');const contThread=cont.active_threads.find(t=>t.task_id==='M3-EXIT-VALIDATION-001'&&t.role==='systems_architect');const dirty=cp.execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean).map(l=>l.length>=4?l.slice(3):l);const allowed=new Set(['PROJECT_STATUS.md','docs/GATE-M3.md','project/goal-mode-state.json','project/model-routing-state.json','project/tasks/active/M3-EXIT-VALIDATION-001.json','project/tasks/thread-registry.json','project/messages/outbox/GOAL-MODE-CONTINUATION.json',r1,r2,ev]);const hashFiles=['docs/GATE-M3.md','PROJECT_STATUS.md','project/goal-mode-state.json','project/messages/outbox/GOAL-MODE-CONTINUATION.json'];const noOldHash=hashFiles.every(p=>!fs.readFileSync(p,'utf8').includes(oldHash));const objectType=cp.execFileSync('git',['cat-file','-t',main],{encoding:'utf8'}).trim();const ok=objectType==='commit'&&noOldHash&&gate.includes('Main baseline: '+main)&&task.status==='REVIEW'&&task.route_to==='qa_reviewer'&&task.threads.systems_architect.status==='review_ready_r2'&&goal.last_main_commit===main&&goal.active_threads[tid].status==='review_ready_r2'&&reg.entries[key].status==='review_ready_r2'&&modelThread?.status==='review_ready_r2'&&cont.origin_main===main&&contThread?.status==='review_ready_r2'&&handoff.status==='REVIEW'&&handoff.route_to==='qa_reviewer'&&handoff.branch_or_worktree.includes('chore/m3-exit-gate')&&routing.schema_version===1&&dirty.every(p=>allowed.has(p));console.log(JSON.stringify({result:ok?'PASS':'FAIL',mainObjectType:objectType,noOldHash,dirty,taskStatus:task.status,route:task.route_to,registryStatus:reg.entries[key].status,goalStatus:goal.active_threads[tid].status,modelStatus:modelThread?.status,continuationStatus:contThread?.status},null,2));process.exit(ok?0:1)"
```

Exit code: 0

Result:

```json
{
  "result": "PASS",
  "mainObjectType": "commit",
  "noOldHash": true,
  "dirty": [
    "PROJECT_STATUS.md",
    "docs/GATE-M3.md",
    "project/goal-mode-state.json",
    "project/messages/outbox/GOAL-MODE-CONTINUATION.json",
    "project/messages/outbox/M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW__systems_architect.json",
    "project/messages/outbox/M3-EXIT-VALIDATION-001__command-evidence.md",
    "project/model-routing-state.json",
    "project/tasks/active/M3-EXIT-VALIDATION-001.json",
    "project/tasks/thread-registry.json",
    "project/messages/outbox/M3-EXIT-VALIDATION-001__MSG-20260626-M3-GATE-SYSTEMS-REVIEW-R2__systems_architect.json"
  ],
  "taskStatus": "REVIEW",
  "route": "qa_reviewer",
  "registryStatus": "review_ready_r2",
  "goalStatus": "review_ready_r2",
  "modelStatus": "review_ready_r2",
  "continuationStatus": "review_ready_r2"
}
```

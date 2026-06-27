import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import {
  runM6BatchBalanceV1,
  validateM6BatchBalanceArtifactV1
} from "../apps/sim-runner/src/m6-batch-balance";
import { M6BatchBalanceDashboard } from "../packages/ui/src/index";

describe("M6-BATCH-AUTORUN-BALANCE-DASHBOARD-001 local evidence", () => {
  test("generates deterministic bounded batch artifacts across scenarios and seeds", () => {
    const artifact = runM6BatchBalanceV1();
    const rerun = runM6BatchBalanceV1();
    const validation = validateM6BatchBalanceArtifactV1(artifact);
    const serialized = JSON.stringify(artifact);

    expect(validation.ok).toBe(true);
    expect(artifact).toEqual(rerun);
    expect(artifact.artifactHash).toMatch(/^[0-9a-f]{8}$/);
    expect(artifact.schemaVersion).toBe(1);
    expect(artifact.kind).toBe("m6.batch-balance-artifact.v1");
    expect(artifact.generatedAt).toBe("deterministic-local-run");
    expect(new Set(artifact.runs.map((run) => run.scenarioId)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(artifact.runs.map((run) => run.seed)).size).toBeGreaterThanOrEqual(2);
    expect(artifact.runs.some((run) => run.terminalOutcome === "victory")).toBe(true);
    expect(artifact.runs.some((run) => run.terminalOutcome === "continued-play")).toBe(true);
    expect(artifact.runs.some((run) => run.terminalOutcome === "defeat")).toBe(true);
    expect(artifact.runs.some((run) => run.terminalOutcome === "command-rejected")).toBe(true);
    expect(artifact.aggregate.runCount).toBe(artifact.runs.length);
    expect(artifact.aggregate.tuningRiskCount).toBeGreaterThan(0);
    expect(artifact.aggregate.noRescueCompletionCount).toBeGreaterThan(0);
    expect(serialized.length).toBeLessThan(32_000);
    expect(serialized).not.toContain("authoritativeSnapshot");
    expect(serialized).not.toContain("WorldState");
    expect(serialized).not.toContain("commandTail");
    expect(serialized).not.toContain("eventTail");
  });

  test("renders the generated local artifact in the read-only balance dashboard", () => {
    const artifact = runM6BatchBalanceV1();
    const markup = renderToStaticMarkup(<M6BatchBalanceDashboard artifact={artifact} />);

    expect(markup).toContain("M6 balance dashboard");
    expect(markup).toContain('data-schema-version="1"');
    expect(markup).toContain(`data-run-count="${artifact.aggregate.runCount}"`);
    expect(markup).toContain(`data-scenario-count="${artifact.aggregate.scenarioCount}"`);
    expect(markup).toContain(`data-seed-count="${artifact.aggregate.seedCount}"`);
    expect(markup).toContain("Aggregate trends");
    expect(markup).toContain("P0/P1 candidates and tuning risks");
    expect(markup).toContain("Run evidence");
    expect(markup).toContain("Recognized order victory path");
    expect(markup).toContain("Policy unresolved continued-play path");
    expect(markup).toContain("seed-stress-grain-pressure");
    expect(markup).not.toContain("WorldState");
  });
});

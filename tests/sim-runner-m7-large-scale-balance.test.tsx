import { describe, expect, test } from "vitest";

import {
  runM7LargeScaleBalanceV1,
  validateM7LargeScaleBalanceArtifactV1
} from "../apps/sim-runner/src/m7-large-scale-balance";

describe("M7-LARGE-SCALE-BALANCE-ANTI-SNOWBALL-001 local evidence", () => {
  test("generates deterministic large-scale batch artifacts with distribution evidence", () => {
    const artifact = runM7LargeScaleBalanceV1();
    const rerun = runM7LargeScaleBalanceV1();
    const validation = validateM7LargeScaleBalanceArtifactV1(artifact);
    const serialized = JSON.stringify(artifact);

    expect(validation.ok).toBe(true);
    expect(artifact).toEqual(rerun);
    expect(artifact.schemaVersion).toBe(1);
    expect(artifact.kind).toBe("m7.large-scale-balance-artifact.v1");
    expect(artifact.generatedAt).toBe("deterministic-local-run");
    expect(artifact.carryForwardM6Gate).toBe("PASS_WITH_LIMITS");
    expect(artifact.sampleSize).toBe(artifact.runs.length);
    expect(artifact.aggregate.runCount).toBe(artifact.runs.length);
    expect(artifact.aggregate.scenarioCount).toBeGreaterThanOrEqual(3);
    expect(artifact.aggregate.seedCount).toBeGreaterThanOrEqual(3);
    expect(new Set(artifact.runs.map((run) => run.scenarioId)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(artifact.runs.map((run) => run.seed)).size).toBeGreaterThanOrEqual(3);
    expect(
      Object.values(artifact.aggregate.primarySignalCounts).reduce((sum, value) => sum + value, 0)
    ).toBe(artifact.aggregate.runCount);
    expect(artifact.aggregate.primarySignalCounts["runaway-expansion"]).toBeGreaterThan(0);
    expect(artifact.aggregate.primarySignalCounts["unavoidable-collapse"]).toBeGreaterThan(0);
    expect(artifact.aggregate.primarySignalCounts["no-action-heavy-ai"]).toBeGreaterThan(0);
    expect(artifact.aggregate.primarySignalCounts["exploit-loop"]).toBeGreaterThan(0);
    expect(artifact.aggregate.primarySignalCounts["direct-control-dominance"]).toBe(0);
    expect(artifact.aggregate.primarySignalCounts.stable).toBe(0);
    expect(artifact.aggregate.noActionShareP95).toBeGreaterThanOrEqual(0);
    expect(artifact.aggregate.directControlShareP95).toBeGreaterThanOrEqual(0);
    expect(artifact.aggregate.maxDirectControlShare).toBe(0);
    expect(artifact.replayPointers.runawayExpansion).not.toBeNull();
    expect(artifact.replayPointers.unavoidableCollapse).not.toBeNull();
    expect(artifact.replayPointers.noActionHeavyAi).not.toBeNull();
    expect(artifact.replayPointers.exploitLoopDetected).not.toBeNull();
    expect(artifact.replayPointers.exploitLoopDetected).toMatch(
      /\|loop=(repeated-pair|concentration-window)\|/
    );
    expect(artifact.replayPointers.exploitLoopDetected).not.toContain("|step=0");
    expect(artifact.replayPointers.directControlDominance).toBeNull();
    expect(artifact.replayPointers.stable).toBeNull();
    expect(artifact.reasonCodeEvidence.length).toBeGreaterThan(0);
    expect(artifact.reasonCodeEvidence[0]?.sampleRunIds.length).toBeGreaterThan(0);
    expect(
      artifact.reasonCodeEvidence.some(
        (row) => row.reasonCode === "m7.balance.signal.runaway-expansion"
      )
    ).toBe(true);
    expect(
      artifact.reasonCodeEvidence.some(
        (row) => row.reasonCode === "m7.balance.signal.unavoidable-collapse"
      )
    ).toBe(true);
    expect(
      artifact.reasonCodeEvidence.some(
        (row) => row.reasonCode === "m7.balance.signal.no-action-heavy-ai"
      )
    ).toBe(true);
    expect(
      artifact.reasonCodeEvidence.some((row) => row.reasonCode === "m7.balance.signal.exploit-loop")
    ).toBe(true);
    expect(
      artifact.reasonCodeEvidence.some(
        (row) => row.reasonCode === "m7.balance.signal.direct-control-dominance"
      )
    ).toBe(false);
    expect(
      artifact.reasonCodeEvidence.some((row) => row.reasonCode === "m7.balance.signal.stable")
    ).toBe(false);
    expect(artifact.csvSummary).toContain("scenarioId");
    expect(artifact.csvSummary).toContain("mostCommonReasonCode");
    expect(serialized).not.toContain("authoritativeSnapshot");
    expect(serialized).not.toContain("commandTail");
    expect(serialized).not.toContain("eventTail");
    expect(serialized).not.toContain("saveBytes");
  });
});

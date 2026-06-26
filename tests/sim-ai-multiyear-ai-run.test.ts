import { describe, expect, test } from "vitest";

import { runM5MultiYearAiValidationV1 } from "../packages/sim-ai/src/index";

describe("M5-MULTIYEAR-AI-RUN-001 deterministic headless multi-year AI run", () => {
  test("replays the accepted slice and continues with deterministic AI summaries", () => {
    const first = runM5MultiYearAiValidationV1({
      seed: "m5-multiyear-ai-run-001",
      durationDays: 730
    });
    const second = runM5MultiYearAiValidationV1({
      seed: "m5-multiyear-ai-run-001",
      durationDays: 730
    });
    const differentSeed = runM5MultiYearAiValidationV1({
      seed: "m5-multiyear-ai-run-002",
      durationDays: 730
    });

    expect(first).toEqual(second);
    expect(first.finalHash).toBe(second.finalHash);
    expect(first.scheduleHash).toBe(second.scheduleHash);
    expect(first.traceHash).toBe(second.traceHash);
    expect(first.noDeadlock).toBe(true);
    expect(first.invariantFailureCount).toBe(0);
    expect(first.live.aiRejectionCount).toBe(0);
    expect(first.live.maxTraceCandidateCount).toBeLessThanOrEqual(5);
    expect(first.live.aiAttemptCount).toBe(730);
    expect(first.endDay - first.startDay).toBe(730);
    expect(first.sliceReplay.commandCount).toBe(15);
    expect(first.sliceReplay.duplicatePostwarCommandRejected).toBe(true);
    expect(first.reasonEvidence.noAction.decisionKind).toBe("no-action");
    expect(first.reasonEvidence.wait.decisionKind).toBe("wait");
    expect(first.reasonEvidence.withdraw.decisionKind).toBe("withdraw");
    expect(first.reasonEvidence.targetChange.decisionKind).toBe("change-objective");
    expect(first.reasonEvidence.wait.primaryReasonCode).toMatch(/^m4\.ai\.wait\./);
    expect(first.reasonEvidence.withdraw.primaryReasonCode).toBe("m4.ai.withdraw.supply-collapse");
    expect(first.reasonEvidence.targetChange.primaryReasonCode).toBe(
      "m4.ai.objective-change.knowledge-target"
    );
    expect(first.reasonEvidence.withdraw.commandKind).toBe("sim.resolve-m4-campaign-withdrawal");
    expect(first.reasonEvidence.targetChange.commandKind).toBe("sim.update-campaign-objective");
    expect(first.reasonEvidence.noAction.traceCandidateCount).toBeLessThanOrEqual(5);

    expect(differentSeed.noDeadlock).toBe(true);
    expect(differentSeed.invariantFailureCount).toBe(0);
    expect(differentSeed.live.aiRejectionCount).toBe(0);
    expect(differentSeed.live.maxTraceCandidateCount).toBeLessThanOrEqual(5);
    expect(differentSeed.durationDays).toBe(730);
    expect(differentSeed.scheduleHash).not.toBe(first.scheduleHash);
  });
});

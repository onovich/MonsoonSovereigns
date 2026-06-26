import { exit, stdout } from "node:process";

import { runM5MultiYearAiValidationV1 } from "@monsoon/sim-ai";

const result = runM5MultiYearAiValidationV1({
  seed: "m5-multiyear-ai-run-001",
  durationDays: 730
});

stdout.write("M5 multi-year AI run summary\n");
stdout.write(`Seed: ${result.seed}\n`);
stdout.write(`Duration days: ${result.durationDays}\n`);
stdout.write(`Start day: ${result.startDay}\n`);
stdout.write(`End day: ${result.endDay}\n`);
stdout.write(`Final hash: ${result.finalHash}\n`);
stdout.write(`Schedule hash: ${result.scheduleHash}\n`);
stdout.write(`Trace hash: ${result.traceHash}\n`);
stdout.write(`No deadlock: ${result.noDeadlock}\n`);
stdout.write(`Invariant checks: ${result.invariantCheckCount}\n`);
stdout.write(`Invariant failures: ${result.invariantFailureCount}\n`);
stdout.write(`AI attempts: ${result.live.aiAttemptCount}\n`);
stdout.write(`AI accepted commands: ${result.live.aiCommandCount}\n`);
stdout.write(`AI no-action decisions: ${result.live.aiNoActionCount}\n`);
stdout.write(`AI wait decisions: ${result.live.aiWaitCount}\n`);
stdout.write(`AI withdraw decisions: ${result.live.aiWithdrawCount}\n`);
stdout.write(`AI target-change decisions: ${result.live.aiTargetChangeCount}\n`);
stdout.write(`AI command rejections: ${result.live.aiRejectionCount}\n`);
stdout.write(`Max AI trace candidates: ${result.live.maxTraceCandidateCount}\n`);
stdout.write(
  `Reason evidence: no-action=${result.reasonEvidence.noAction.primaryReasonCode}, wait=${result.reasonEvidence.wait.primaryReasonCode}, withdraw=${result.reasonEvidence.withdraw.primaryReasonCode}, target-change=${result.reasonEvidence.targetChange.primaryReasonCode}\n`
);
if (result.live.aiCommandCount === 0) {
  stdout.write(
    `Live AI command path: no accepted AI commands in the replayed M5 slice; the live planner stayed on no-action candidates with max trace size ${result.live.maxTraceCandidateCount}.\n`
  );
}
stdout.write(
  `Slice replay: commands=${result.sliceReplay.commandCount}, postwarCandidates=${result.sliceReplay.postwarCandidateCount}, postwarArrangements=${result.sliceReplay.postwarArrangementCount}, duplicatePostwarRejection=${result.sliceReplay.duplicatePostwarCommandErrorCode}\n`
);

if (
  !result.noDeadlock ||
  result.invariantFailureCount !== 0 ||
  result.live.aiRejectionCount !== 0 ||
  result.live.maxTraceCandidateCount > 5
) {
  exit(1);
}

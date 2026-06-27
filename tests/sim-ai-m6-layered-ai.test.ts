import { describe, expect, test } from "vitest";

import type { AuthoritativeGameCommandV1 } from "../packages/protocol/src/index";
import {
  planM6LayeredAiTurnV1,
  runM6LayeredAlphaAiValidationV1
} from "../packages/sim-ai/src/index";
import { bootSimulationV1, submitCommandV1 } from "../packages/sim-core/src/index";
import { createM6AlphaStartToVictoryScriptV1 } from "../packages/protocol/src/index";

describe("M6-LAYERED-AI-001 bounded deterministic layered AI", () => {
  test("runs the full Alpha scenario to victory through bounded layered GameCommand plans", () => {
    const first = runM6LayeredAlphaAiValidationV1({
      seed: "m6-layered-ai-regression",
      maxTraceCandidates: 3
    });
    const second = runM6LayeredAlphaAiValidationV1({
      seed: "m6-layered-ai-regression",
      maxTraceCandidates: 3
    });

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      status: "ok",
      terminalOutcome: "victory",
      commandCount: 22,
      noRescueHooks: true,
      malformedCommandRejected: true,
      malformedCommandStateHashUnchanged: true,
      invariantFailureCount: 0
    });
    expect(first.maxTraceCandidateCount).toBeLessThanOrEqual(3);
    expect(first.layerEvidence.map((entry) => entry.layer)).toEqual([
      "strategic",
      "campaign",
      "recovery",
      "succession",
      "diplomatic",
      "policy"
    ]);
    expect(first.layerEvidence.every((entry) => entry.commandCount > 0)).toBe(true);
    expect(first.commandParity.aiCommandKinds).toEqual(first.commandParity.playerEquivalentKinds);
    expect(first.commandParity.nonSystemCommandsUseAiActor).toBe(true);
    expect(first.commandParity.systemSupportCommands).toEqual([
      "sim.advance-day",
      "sim.advance-day",
      "sim.advance-day",
      "sim.advance-day",
      "sim.record-legitimacy-source",
      "sim.advance-day"
    ]);
  });

  test("covers bounded reasons for no-action, wait, withdraw, target, change, policy, and diplomacy", () => {
    const result = runM6LayeredAlphaAiValidationV1({
      seed: "m6-layered-ai-reasons",
      maxTraceCandidates: 2
    });

    expect(Object.keys(result.reasonCoverage).sort()).toEqual([
      "change",
      "diplomacy",
      "noAction",
      "policy",
      "target",
      "wait",
      "withdraw"
    ]);
    for (const trace of Object.values(result.reasonCoverage)) {
      expect(trace.primaryReasonCode.length).toBeGreaterThan(0);
      expect(trace.reasonCodes.length).toBeGreaterThan(0);
      expect(trace.candidates.length).toBeGreaterThan(0);
      expect(trace.candidates.length).toBeLessThanOrEqual(2);
      expect(trace.reasonCodes.length).toBeLessThanOrEqual(8);
    }
    expect(result.reasonCoverage.noAction.commandKind).toBeNull();
    expect(result.reasonCoverage.wait.commandKind).toBeNull();
    expect(result.reasonCoverage.withdraw.commandKind).toBe("sim.resolve-m4-campaign-withdrawal");
    expect(result.reasonCoverage.target.commandKind).toBe("sim.create-campaign-objective");
    expect(result.reasonCoverage.change.commandKind).toBe("sim.update-campaign-objective");
    expect(result.reasonCoverage.policy.commandKind).toBe("sim.choose-policy-event-option");
    expect(result.reasonCoverage.diplomacy.commandKind).toBe("sim.propose-diplomatic-agreement");
  });

  test("uses deterministic layer order and does not mutate state before command submission", () => {
    const script = createM6AlphaStartToVictoryScriptV1();
    const booted = bootSimulationV1(script.boot);
    expect(booted.status).toBe("booted");
    if (booted.status !== "booted") {
      throw new Error("Expected M6 Alpha fixture to boot.");
    }

    const beforeHash = booted.runtime.world.meta.stateHash;
    const first = planM6LayeredAiTurnV1(booted.runtime, {
      actorId: "polity:1",
      actorPolityId: 1,
      targetPolityId: 2,
      commandIdPrefix: "m6.layered.test",
      stepIndex: 0,
      maxTraceCandidates: 4
    });
    const second = planM6LayeredAiTurnV1(booted.runtime, {
      actorId: "polity:1",
      actorPolityId: 1,
      targetPolityId: 2,
      commandIdPrefix: "m6.layered.test",
      stepIndex: 0,
      maxTraceCandidates: 4
    });

    expect(first).toEqual(second);
    expect(booted.runtime.world.meta.stateHash).toBe(beforeHash);
    expect(first.trace.layer).toBe("strategic");
    expect(first.trace.decisionKind).toBe("target");
    expect(first.command?.kind).toBe("sim.create-campaign-objective");
    expect(first.command?.actor.kind).toBe("ai");

    const submitted = submitCommandV1(booted.runtime, first.command);
    expect(submitted.result.status).toBe("accepted");
    expect(submitted.runtime.world.meta.stateHash).not.toBe(beforeHash);
  });
});

type _CommandParityCompileCheck = AuthoritativeGameCommandV1;

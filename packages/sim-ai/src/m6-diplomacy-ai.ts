import type { AuthoritativeGameCommandV1 } from "@monsoon/protocol";

type GameCommandV1 = AuthoritativeGameCommandV1;
import {
  querySimulationV1,
  type M6DiplomaticAgreementReadModelV1,
  type M6DiplomaticRelationReadModelV1,
  type SimulationRuntimeV1
} from "@monsoon/sim-core";

export interface M6DiplomacyAiTurnInputV1 {
  readonly actorId: string;
  readonly actorPolityId: number;
  readonly targetPolityId: number;
  readonly commandIdPrefix: string;
}

export interface M6DiplomacyAiDecisionTraceV1 {
  readonly schemaVersion: 1;
  readonly actor: { readonly kind: "ai"; readonly id: string };
  readonly observerPolityId: number;
  readonly targetPolityId: number;
  readonly day: number;
  readonly revision: number;
  readonly decisionKind: "propose-agreement" | "wait";
  readonly commandKind: "sim.propose-diplomatic-agreement" | null;
  readonly commandId: string | null;
  readonly primaryReasonCode: string;
  readonly reasonCodes: readonly string[];
}

export interface M6DiplomacyAiTurnPlanV1 {
  readonly command: GameCommandV1 | null;
  readonly trace: M6DiplomacyAiDecisionTraceV1;
}

export function planM6DiplomacyAiTurnV1(
  runtime: SimulationRuntimeV1,
  input: M6DiplomacyAiTurnInputV1
): M6DiplomacyAiTurnPlanV1 {
  const diplomacy = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m6-diplomacy",
    payload: {
      queryId: `${input.commandIdPrefix}.diplomacy`,
      observerPolityId: input.actorPolityId
    }
  });
  const recognizedOrder = querySimulationV1(runtime, {
    schemaVersion: 1,
    kind: "sim.list-m6-recognized-order",
    payload: {
      queryId: `${input.commandIdPrefix}.recognized-order`,
      polityId: input.actorPolityId
    }
  });

  if (
    diplomacy.status !== "ok" ||
    diplomacy.result.kind !== "sim.list-m6-diplomacy" ||
    recognizedOrder.status !== "ok" ||
    recognizedOrder.result.kind !== "sim.list-m6-recognized-order"
  ) {
    return waitPlan(runtime, input, "m6.ai.diplomacy.public-query-rejected");
  }

  const existingRecognition = diplomacy.result.recognitionEdges.some(
    (edge) => edge.fromPolityId === input.targetPolityId && edge.toPolityId === input.actorPolityId
  );
  const pendingAgreement = diplomacy.result.agreements.some(
    (agreement) =>
      agreement.status === "proposed" &&
      agreement.proposerPolityId === input.actorPolityId &&
      agreement.targetPolityId === input.targetPolityId
  );
  const recognizedDecision = recognizedOrder.result.decisions.find(
    (decision) => decision.polityId === input.actorPolityId
  );
  if (existingRecognition || pendingAgreement || recognizedDecision?.canPursueVictory === true) {
    return waitPlan(runtime, input, "m6.ai.diplomacy.existing-recognition");
  }

  const commandId = `${input.commandIdPrefix}.propose.${input.actorPolityId}.${input.targetPolityId}`;
  const relationId = nextRelationId(diplomacy.result.relations);
  const agreementId = nextAgreementId(diplomacy.result.agreements);
  const command: GameCommandV1 = {
    schemaVersion: 1,
    kind: "sim.propose-diplomatic-agreement",
    commandId,
    actor: { kind: "ai", id: input.actorId },
    expectedDay: runtime.world.meta.currentDay,
    expectedRevision: runtime.world.meta.revision,
    payload: {
      agreementId,
      relationId,
      proposerPolityId: input.actorPolityId,
      targetPolityId: input.targetPolityId,
      agreementKind: "non-aggression",
      durationDays: 360,
      recognitionDirection: "target-recognizes-proposer",
      reasonCode: "diplomacy.offer.non-aggression"
    }
  };
  return {
    command,
    trace: {
      schemaVersion: 1,
      actor: { kind: "ai", id: input.actorId },
      observerPolityId: input.actorPolityId,
      targetPolityId: input.targetPolityId,
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      decisionKind: "propose-agreement",
      commandKind: command.kind,
      commandId,
      primaryReasonCode: "m6.ai.diplomacy.recognition-needed",
      reasonCodes: [
        "m6.ai.diplomacy.recognition-needed",
        ...targetRelationReasonCodes(diplomacy.result.relations, input)
      ]
    }
  };
}

function waitPlan(
  runtime: SimulationRuntimeV1,
  input: M6DiplomacyAiTurnInputV1,
  reasonCode: string
): M6DiplomacyAiTurnPlanV1 {
  return {
    command: null,
    trace: {
      schemaVersion: 1,
      actor: { kind: "ai", id: input.actorId },
      observerPolityId: input.actorPolityId,
      targetPolityId: input.targetPolityId,
      day: runtime.world.meta.currentDay,
      revision: runtime.world.meta.revision,
      decisionKind: "wait",
      commandKind: null,
      commandId: null,
      primaryReasonCode: reasonCode,
      reasonCodes: [reasonCode]
    }
  };
}

function nextRelationId(relations: readonly M6DiplomaticRelationReadModelV1[]): number {
  return maxId(relations.map((relation) => relation.relationId)) + 1;
}

function nextAgreementId(agreements: readonly M6DiplomaticAgreementReadModelV1[]): number {
  return maxId(agreements.map((agreement) => agreement.agreementId)) + 1;
}

function maxId(values: readonly number[]): number {
  return values.reduce((current, value) => (value > current ? value : current), 0);
}

function targetRelationReasonCodes(
  relations: readonly M6DiplomaticRelationReadModelV1[],
  input: M6DiplomacyAiTurnInputV1
): readonly string[] {
  const relation = relations.find(
    (entry) =>
      (entry.polityAId === input.actorPolityId && entry.polityBId === input.targetPolityId) ||
      (entry.polityAId === input.targetPolityId && entry.polityBId === input.actorPolityId)
  );
  return relation?.reasonCodes ?? [];
}

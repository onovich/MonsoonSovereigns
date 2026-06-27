import {
  parseM6PolicyEventDefinitionSetSourceV0,
  type M6PolicyDefinitionSourceV0,
  type M6PolicyEventDefinitionSourceV0
} from "@monsoon/content-schema";

export interface RuntimeM6PolicyEventContentManifestV0 {
  readonly schemaVersion: 1;
  readonly fixtureId: string;
  readonly fixtureKind: "policy-event-definition-set";
  readonly syntheticScope: "m6-policy-event-validation";
  readonly manifestHash: string;
  readonly policyCount: number;
  readonly eventCount: number;
}

export interface RuntimeM6PolicyEventContentPackV0 {
  readonly schemaVersion: 1;
  readonly kind: "runtime-m6-policy-event-content-pack-v0";
  readonly fixtureId: string;
  readonly manifest: RuntimeM6PolicyEventContentManifestV0;
  readonly policies: readonly M6PolicyDefinitionSourceV0[];
  readonly events: readonly M6PolicyEventDefinitionSourceV0[];
}

export interface RuntimeM6PolicyEventContentPackIndexV0 {
  readonly pack: RuntimeM6PolicyEventContentPackV0;
  getPolicy(policyId: number): M6PolicyDefinitionSourceV0 | undefined;
  getEvent(eventDefinitionId: number): M6PolicyEventDefinitionSourceV0 | undefined;
}

export function parseRuntimeM6PolicyEventContentPackV0(
  input: unknown
): RuntimeM6PolicyEventContentPackV0 {
  const source = parseM6PolicyEventDefinitionSetSourceV0(input);
  return Object.freeze({
    schemaVersion: 1,
    kind: "runtime-m6-policy-event-content-pack-v0" as const,
    fixtureId: source.fixtureId,
    manifest: Object.freeze({
      schemaVersion: 1,
      fixtureId: source.fixtureId,
      fixtureKind: "policy-event-definition-set" as const,
      syntheticScope: "m6-policy-event-validation" as const,
      manifestHash: source.manifestHash,
      policyCount: source.policies.length,
      eventCount: source.events.length
    }),
    policies: Object.freeze(source.policies.map(copyPolicy)),
    events: Object.freeze(source.events.map(copyEvent))
  });
}

export function createRuntimeM6PolicyEventContentPackIndexV0(
  pack: RuntimeM6PolicyEventContentPackV0
): RuntimeM6PolicyEventContentPackIndexV0 {
  const policyById = new Map<number, M6PolicyDefinitionSourceV0>();
  const eventById = new Map<number, M6PolicyEventDefinitionSourceV0>();
  for (const policy of pack.policies) {
    policyById.set(policy.policyId, policy);
  }
  for (const event of pack.events) {
    eventById.set(event.eventDefinitionId, event);
  }
  return Object.freeze({
    pack,
    getPolicy(policyId: number): M6PolicyDefinitionSourceV0 | undefined {
      return policyById.get(policyId);
    },
    getEvent(eventDefinitionId: number): M6PolicyEventDefinitionSourceV0 | undefined {
      return eventById.get(eventDefinitionId);
    }
  });
}

function copyPolicy(policy: M6PolicyDefinitionSourceV0): M6PolicyDefinitionSourceV0 {
  return Object.freeze({
    policyId: policy.policyId,
    sourceId: policy.sourceId,
    displayNameKey: policy.displayNameKey,
    reasonCodes: Object.freeze([...policy.reasonCodes]),
    encyclopediaRefs: Object.freeze([...policy.encyclopediaRefs])
  });
}

function copyEvent(event: M6PolicyEventDefinitionSourceV0): M6PolicyEventDefinitionSourceV0 {
  return Object.freeze({
    eventDefinitionId: event.eventDefinitionId,
    sourceId: event.sourceId,
    displayNameKey: event.displayNameKey,
    cause: Object.freeze({
      kind: "day-at-least",
      day: event.cause.day,
      reasonCodes: Object.freeze([...event.cause.reasonCodes])
    }),
    options: Object.freeze(
      event.options.map((option) =>
        Object.freeze({
          optionId: option.optionId,
          displayNameKey: option.displayNameKey,
          consequences: Object.freeze(
            option.consequences.map((consequence) => Object.freeze({ ...consequence }))
          ),
          reasonCodes: Object.freeze([...option.reasonCodes]),
          encyclopediaRefs: Object.freeze([...option.encyclopediaRefs])
        })
      )
    ),
    reasonCodes: Object.freeze([...event.reasonCodes]),
    encyclopediaRefs: Object.freeze([...event.encyclopediaRefs])
  });
}

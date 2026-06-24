import { readFile } from "node:fs/promises";

import { describe, expect, test } from "vitest";

import {
  createSaveEnvelopeV1,
  decodeSaveEnvelopeV1,
  encodeSaveEnvelopeV1,
  saveWorldStateV0DtoToCandidate,
  worldStateV0ToSaveDto,
  type SaveEnvelopeV1
} from "../packages/save-format/src/index";
import {
  createAbstractGraph30WorldStateV0,
  validateWorldStateV0,
  type WorldInvariantError
} from "../packages/sim-core/src/index";

const goldenFixtureUrl = new URL("./fixtures/save-format/m1-golden-save-v1.json", import.meta.url);
const fixturePlanUrl = new URL("./fixtures/save-format/README.md", import.meta.url);

describe("SIM-005 Save Envelope v1 codec", () => {
  test("round-trips the M1 graph fixture and preserves the authoritative state hash", () => {
    const world = createAbstractGraph30WorldStateV0();
    const envelope = createM1Envelope();
    const encoded = encodeSaveEnvelopeV1(envelope);
    const decoded = decodeSaveEnvelopeV1(encoded, {
      expectedContentManifestHash: "4a438525",
      expectedScenarioId: "m1.abstract-graph-30",
      validateWorldSnapshot: validateSaveCandidate
    });

    expect(decoded.status).toBe("loaded");
    if (decoded.status !== "loaded") {
      throw new Error("Expected M1 save to load.");
    }

    expect(decoded.envelope.header).toMatchObject({
      magic: "MONSOON_SOVEREIGNS_SAVE",
      schemaVersion: 1,
      contentManifestHash: "4a438525",
      scenarioId: "m1.abstract-graph-30",
      seed: 1531,
      currentDay: world.meta.currentDay
    });
    expect(decoded.envelope.body.authoritativeSnapshot.meta.stateHash).toBe(world.meta.stateHash);
    expect(decoded.envelope.body.scheduler).toEqual(world.scheduler);
    expect(decoded.envelope.body.commandTail).toHaveLength(2);
    expect(decoded.envelope.body.eventTail).toHaveLength(1);
  });

  test("loads the golden save fixture and requires an intentional update workflow", async () => {
    const goldenText = await readFile(goldenFixtureUrl, "utf8");
    const plan = await readFile(fixturePlanUrl, "utf8");
    const bytes = new TextEncoder().encode(goldenText);
    const decoded = decodeSaveEnvelopeV1(bytes, {
      expectedContentManifestHash: "4a438525",
      expectedScenarioId: "m1.abstract-graph-30",
      validateWorldSnapshot: validateSaveCandidate
    });

    expect(decoded.status).toBe("loaded");
    if (decoded.status !== "loaded") {
      throw new Error("Expected golden fixture to load.");
    }

    expect(decoded.envelope.header.checksum).toBe("e6588316");
    expect(decoded.envelope.body.authoritativeSnapshot.meta.stateHash).toBe("f336958d");
    expect(plan).toContain("Intentional Golden Update Workflow");
    expect(plan).toContain("recorded reason");
    expect(plan).toContain("pnpm --filter @monsoon/save-format test");
  });

  test("safely rejects corrupt checksum, unknown schema, bad reference, truncated payload, and content mismatch", () => {
    const envelope = createM1Envelope();
    const encoded = encodeSaveEnvelopeV1(envelope);

    expect(
      decodeSaveEnvelopeV1(encoded, {
        expectedContentManifestHash: "00000000",
        expectedScenarioId: "m1.abstract-graph-30",
        validateWorldSnapshot: validateSaveCandidate
      })
    ).toMatchObject({
      status: "rejected",
      reasons: [{ code: "content-manifest-mismatch", path: "header.contentManifestHash" }]
    });

    const corruptChecksum = withHeader(envelope, { checksum: "00000000" });
    expect(decode(corruptChecksum)).toMatchObject({
      status: "rejected",
      reasons: [{ code: "checksum-mismatch", path: "header.checksum" }]
    });

    const unknownVersion = withRoot(envelope, { schemaVersion: 999 });
    expect(decode(unknownVersion)).toMatchObject({
      status: "rejected",
      reasons: [{ code: "unsupported-schema-version", path: "schemaVersion" }]
    });

    const badReferenceSnapshot = {
      ...envelope.body.authoritativeSnapshot,
      state: {
        ...envelope.body.authoritativeSnapshot.state,
        districts: envelope.body.authoritativeSnapshot.state.districts.map((district, index) =>
          index === 0
            ? {
                ...district,
                control: { kind: "controlled", controllerPolityId: 999 }
              }
            : district
        )
      }
    };
    const badReference = createSaveEnvelopeV1({
      build: envelope.header.build,
      scenarioId: envelope.header.scenarioId,
      authoritativeSnapshot: badReferenceSnapshot,
      scheduler: envelope.body.scheduler,
      rng: envelope.body.rng,
      commandTail: envelope.body.commandTail,
      eventTail: envelope.body.eventTail
    });
    const badReferenceResult = decode(badReference);
    expect(badReferenceResult.status).toBe("rejected");
    if (badReferenceResult.status !== "rejected") {
      throw new Error("Expected bad reference to reject.");
    }
    expect(badReferenceResult.reasons).toEqual(
      expect.arrayContaining([
        {
          code: "semantic-invariant",
          path: "state.districts[0].control.controllerPolityId",
          message: "DistrictState 1 references missing PolityId 999."
        }
      ])
    );

    const truncated = encoded.slice(0, Math.max(1, encoded.length - 20));
    expect(
      decodeSaveEnvelopeV1(truncated, { validateWorldSnapshot: validateSaveCandidate })
    ).toMatchObject({
      status: "rejected",
      reasons: [{ code: "malformed-json", path: "$" }]
    });
  });
});

function createM1Envelope(): SaveEnvelopeV1 {
  const world = createAbstractGraph30WorldStateV0();
  return createSaveEnvelopeV1({
    build: {
      appVersion: "0.0.0",
      source: "test",
      codecVersion: "save-envelope-v1"
    },
    scenarioId: "m1.abstract-graph-30",
    authoritativeSnapshot: worldStateV0ToSaveDto(world),
    scheduler: world.scheduler,
    rng: {
      schemaVersion: 1,
      algorithm: "sfc32-fnv1a32-domain-v1",
      savedStreams: []
    },
    commandTail: [
      {
        sequence: 1,
        command: {
          schemaVersion: 1,
          kind: "debug.set-district-control",
          commandId: "golden.control.1",
          actor: { kind: "player", id: "player:golden" },
          expectedDay: 0,
          expectedRevision: 0,
          payload: { districtId: 1, controllerPolityId: 1 }
        }
      },
      {
        sequence: 2,
        command: {
          schemaVersion: 1,
          kind: "sim.verify-state-hash",
          commandId: "golden.verify.1",
          actor: { kind: "system", id: "save-golden" },
          expectedDay: 0,
          expectedRevision: 0,
          expectedHash: world.meta.stateHash
        }
      }
    ],
    eventTail: [
      {
        sequence: 1,
        event: {
          schemaVersion: 1,
          kind: "sim.state-hash-verified",
          commandId: "golden.verify.1",
          actor: { kind: "system", id: "save-golden" },
          day: 0,
          revision: 0,
          stateHash: world.meta.stateHash
        }
      }
    ]
  });
}

function decode(envelope: SaveEnvelopeV1): ReturnType<typeof decodeSaveEnvelopeV1> {
  return decodeSaveEnvelopeV1(encodeSaveEnvelopeV1(envelope), {
    expectedContentManifestHash: "4a438525",
    expectedScenarioId: "m1.abstract-graph-30",
    validateWorldSnapshot: validateSaveCandidate
  });
}

function validateSaveCandidate(candidate: unknown): readonly WorldInvariantError[] {
  return validateWorldStateV0(saveWorldStateV0DtoToCandidate(candidate));
}

function withHeader(
  envelope: SaveEnvelopeV1,
  fields: Partial<SaveEnvelopeV1["header"]>
): SaveEnvelopeV1 {
  return {
    ...envelope,
    header: {
      ...envelope.header,
      ...fields
    }
  };
}

function withRoot(
  envelope: SaveEnvelopeV1,
  fields: Partial<Pick<SaveEnvelopeV1, "schemaVersion">>
): SaveEnvelopeV1 {
  return {
    ...envelope,
    ...fields
  };
}

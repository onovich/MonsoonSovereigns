import fc from "fast-check";
import { describe, expect, test } from "vitest";

import {
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  defineRoute,
  defineSettlement,
  hashWorldStateV0,
  parseGameDay,
  parsePersonId,
  parseWorldRevision,
  validateWorldStateV0
} from "../packages/sim-core/src/index";

const polityToungoo = definePolity({
  id: 1,
  displayNameKey: "polity.toungoo.name"
});

const personBayinnaung = definePerson({
  id: 10,
  displayNameKey: "person.bayinnaung.name"
});

const districtToungooCore = defineDistrict({
  id: 100,
  displayNameKey: "district.toungoo_core.name"
});

const settlementToungoo = defineSettlement({
  id: 200,
  displayNameKey: "settlement.toungoo.name",
  districtId: 100
});

const routeToungooRiver = defineRoute({
  id: 300,
  fromDistrictId: 100,
  toDistrictId: 101,
  lengthInMapUnits: 40
});

const districtPeguRoad = defineDistrict({
  id: 101,
  displayNameKey: "district.pegu_road.name"
});

describe("SIM-001 branded IDs and WorldState v0", () => {
  test("rejects invalid ID and scalar schema inputs before branding", () => {
    expect(() => parsePersonId(0)).toThrow("PersonId");
    expect(() => parsePersonId(1.5)).toThrow("PersonId");
    expect(() => parsePersonId("1")).toThrow("PersonId");
    expect(() => parseGameDay(-1)).toThrow("GameDay");
    expect(() => parseWorldRevision(-1)).toThrow("WorldRevision");
  });

  test("keeps definition records separate from runtime state tables", () => {
    const world = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 0,
      revision: 0,
      definitions: {
        polities: [polityToungoo],
        persons: [personBayinnaung],
        districts: [districtToungooCore],
        settlements: [settlementToungoo],
        routes: []
      }
    });

    expect(world.definitions.persons[0]?.displayNameKey).toBe("person.bayinnaung.name");
    expect(world.state.persons[0]?.definitionId).toBe(world.definitions.persons[0]?.id);
    expect(world.state.persons[0]).not.toHaveProperty("displayNameKey");
  });

  test("reports duplicate IDs and bad references as semantic invariant failures", () => {
    const world = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 0,
      revision: 0,
      definitions: {
        polities: [polityToungoo],
        persons: [personBayinnaung, personBayinnaung],
        districts: [districtToungooCore],
        settlements: [
          defineSettlement({
            id: 201,
            displayNameKey: "settlement.bad.name",
            districtId: 999
          })
        ],
        routes: []
      }
    });

    const errors = validateWorldStateV0(world);

    expect(errors).toContainEqual({
      code: "duplicate-definition-id",
      path: "definitions.persons",
      message: "Duplicate PersonId 10."
    });
    expect(errors).toContainEqual({
      code: "bad-reference",
      path: "definitions.settlements[0].districtId",
      message: "Settlement 201 references missing DistrictId 999."
    });
  });

  test("reports missing definitions and invalid runtime day/revision", () => {
    const world = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 0,
      revision: 0,
      definitions: {
        polities: [polityToungoo],
        persons: [personBayinnaung],
        districts: [districtToungooCore],
        settlements: [settlementToungoo],
        routes: []
      }
    });

    const invalidWorld = {
      ...world,
      meta: {
        ...world.meta,
        currentDay: -1,
        revision: -1
      },
      state: {
        ...world.state,
        persons: [{ definitionId: parsePersonId(999), currentDistrictId: undefined }]
      }
    };

    const errors = validateWorldStateV0(invalidWorld);

    expect(errors.map((error) => error.code)).toEqual(
      expect.arrayContaining(["invalid-day", "invalid-revision", "missing-definition"])
    );
  });

  test("reports invalid meta schema fields before hash validation", () => {
    const world = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 0,
      revision: 0,
      definitions: {
        polities: [],
        persons: [],
        districts: [],
        settlements: [],
        routes: []
      }
    });

    const invalidWorld = {
      ...world,
      meta: {
        ...world.meta,
        schemaVersion: 1,
        seed: -1,
        contentManifestHash: "",
        hashAlgorithm: "unknown",
        stateHash: 0
      }
    };

    expect(validateWorldStateV0(invalidWorld)).toEqual(
      expect.arrayContaining([
        {
          code: "invalid-schema",
          path: "meta.schemaVersion",
          message: "WorldState schemaVersion must be 0."
        },
        {
          code: "invalid-schema",
          path: "meta.seed",
          message: "WorldState seed must be a nonnegative safe integer."
        },
        {
          code: "invalid-schema",
          path: "meta.contentManifestHash",
          message: "WorldState contentManifestHash must be a non-empty string."
        },
        {
          code: "invalid-schema",
          path: "meta.hashAlgorithm",
          message: "WorldState hashAlgorithm must be fnv1a32-canonical-world-state-v0."
        },
        {
          code: "invalid-schema",
          path: "meta.stateHash",
          message: "WorldState stateHash must be a string."
        }
      ])
    );
  });

  test("reports stale stored hash as an invariant failure", () => {
    const world = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 0,
      revision: 0,
      definitions: {
        polities: [polityToungoo],
        persons: [],
        districts: [],
        settlements: [],
        routes: []
      }
    });

    const invalidWorld = {
      ...world,
      meta: {
        ...world.meta,
        stateHash: "00000000"
      }
    };

    expect(validateWorldStateV0(invalidWorld)).toContainEqual({
      code: "hash-mismatch",
      path: "meta.stateHash",
      message: `Stored state hash 00000000 does not match canonical hash ${hashWorldStateV0(world)}.`
    });
  });

  test("returns path-specific invalid-schema errors for malformed unknown input without throwing", () => {
    const malformedWorld = {
      meta: {
        schemaVersion: 0,
        seed: 1531,
        contentManifestHash: "content.sim001.fixture",
        currentDay: 0,
        revision: 0,
        hashAlgorithm: "fnv1a32-canonical-world-state-v0",
        stateHash: "00000000"
      },
      definitions: {
        polities: [null],
        persons: [{ id: "10", displayNameKey: "person.bad.name" }],
        districts: [{ id: 100, displayNameKey: "" }],
        settlements: [{ id: 200, displayNameKey: "settlement.bad.name", districtId: "100" }],
        routes: [{ id: 300, fromDistrictId: 100, toDistrictId: null, lengthInMapUnits: 0 }]
      },
      state: {
        polities: [null],
        persons: [{ definitionId: "10" }],
        districts: [{ definitionId: 100, control: { kind: "controlled" } }],
        settlements: [{ definitionId: 200, currentDistrictId: "100" }],
        routes: [{ definitionId: 300 }]
      },
      scheduler: {
        pendingCommandCount: 0
      }
    };

    expect(() => validateWorldStateV0(malformedWorld)).not.toThrow();
    expect(validateWorldStateV0(malformedWorld)).toEqual(
      expect.arrayContaining([
        {
          code: "invalid-schema",
          path: "definitions.polities[0]",
          message: "PolityDefinition entry must be an object."
        },
        {
          code: "invalid-schema",
          path: "definitions.persons[0].id",
          message: "PersonId 10 must be a positive safe integer."
        },
        {
          code: "invalid-schema",
          path: "definitions.districts[0].displayNameKey",
          message: "DistrictDefinition displayNameKey must be a non-empty string."
        },
        {
          code: "invalid-schema",
          path: "definitions.settlements[0].districtId",
          message: "DistrictId 100 must be a positive safe integer."
        },
        {
          code: "invalid-schema",
          path: "definitions.routes[0].lengthInMapUnits",
          message: "Route lengthInMapUnits 0 must be a positive safe integer."
        },
        {
          code: "invalid-schema",
          path: "state.polities[0]",
          message: "PolityState entry must be an object."
        },
        {
          code: "invalid-schema",
          path: "state.districts[0].control.controllerPolityId",
          message: "PolityId undefined must be a positive safe integer."
        }
      ])
    );
  });

  test("reports duplicate runtime rows and missing runtime rows for definitions", () => {
    const world = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 0,
      revision: 0,
      definitions: {
        polities: [polityToungoo],
        persons: [personBayinnaung],
        districts: [districtToungooCore],
        settlements: [settlementToungoo],
        routes: [
          defineRoute({ id: 301, fromDistrictId: 100, toDistrictId: 100, lengthInMapUnits: 1 })
        ]
      }
    });

    const invalidWorldWithoutHash = {
      ...world,
      state: {
        ...world.state,
        persons: [world.state.persons[0], world.state.persons[0]],
        districts: [],
        routes: []
      }
    };
    const invalidWorld = {
      ...invalidWorldWithoutHash,
      meta: {
        ...world.meta,
        stateHash: hashWorldStateV0(invalidWorldWithoutHash)
      }
    };

    const errors = validateWorldStateV0(invalidWorld);

    expect(errors).toEqual(
      expect.arrayContaining([
        {
          code: "duplicate-runtime-state-row",
          path: "state.persons",
          message: "Duplicate PersonState row for PersonId 10."
        },
        {
          code: "missing-runtime-state-row",
          path: "state.districts",
          message: "Missing DistrictState row for DistrictId 100."
        },
        {
          code: "missing-runtime-state-row",
          path: "state.routes",
          message: "Missing RouteState row for RouteId 301."
        }
      ])
    );
  });

  test("hash is stable across input order and object identity", () => {
    const first = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 12,
      revision: 4,
      definitions: {
        polities: [polityToungoo],
        persons: [personBayinnaung],
        districts: [districtPeguRoad, districtToungooCore],
        settlements: [settlementToungoo],
        routes: [routeToungooRiver]
      }
    });
    const second = createWorldStateV0({
      seed: 1531,
      contentManifestHash: "content.sim001.fixture",
      currentDay: 12,
      revision: 4,
      definitions: {
        polities: [{ ...polityToungoo }],
        persons: [{ ...personBayinnaung }],
        districts: [{ ...districtToungooCore }, { ...districtPeguRoad }],
        settlements: [{ ...settlementToungoo }],
        routes: [{ ...routeToungooRiver }]
      }
    });

    expect(hashWorldStateV0(first)).toBe(hashWorldStateV0(second));
  });

  test("hash distinguishes semantic world changes", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10_000 }),
        fc.integer({ min: 1, max: 10_000 }),
        (seedA, seedB) => {
          fc.pre(seedA !== seedB);

          const first = createWorldStateV0({
            seed: seedA,
            contentManifestHash: "content.sim001.fixture",
            currentDay: 0,
            revision: 0,
            definitions: {
              polities: [polityToungoo],
              persons: [],
              districts: [],
              settlements: [],
              routes: []
            }
          });
          const second = createWorldStateV0({
            seed: seedB,
            contentManifestHash: "content.sim001.fixture",
            currentDay: 0,
            revision: 0,
            definitions: {
              polities: [polityToungoo],
              persons: [],
              districts: [],
              settlements: [],
              routes: []
            }
          });

          expect(hashWorldStateV0(first)).not.toBe(hashWorldStateV0(second));
        }
      )
    );
  });
});

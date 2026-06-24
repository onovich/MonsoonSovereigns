import {
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  defineRoute,
  defineSettlement,
  type WorldStateV0
} from "./world-state-v0.ts";

export function createMinimalM1WorldStateV0(): WorldStateV0 {
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: "content.m1.minimal",
    currentDay: 0,
    revision: 0,
    definitions: {
      polities: [
        definePolity({
          id: 1,
          displayNameKey: "polity.m1_minimal.name"
        })
      ],
      persons: [
        definePerson({
          id: 1,
          displayNameKey: "person.m1_minimal.name"
        })
      ],
      districts: [
        defineDistrict({
          id: 1,
          displayNameKey: "district.m1_minimal_core.name"
        }),
        defineDistrict({
          id: 2,
          displayNameKey: "district.m1_minimal_route_end.name"
        })
      ],
      settlements: [
        defineSettlement({
          id: 1,
          displayNameKey: "settlement.m1_minimal.name",
          districtId: 1
        })
      ],
      routes: [
        defineRoute({
          id: 1,
          fromDistrictId: 1,
          toDistrictId: 2,
          lengthInMapUnits: 1
        })
      ]
    }
  });
}

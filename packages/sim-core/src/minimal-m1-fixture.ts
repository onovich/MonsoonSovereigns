import {
  createWorldStateV0,
  defineDistrict,
  definePerson,
  definePolity,
  defineRoute,
  defineSettlement,
  type WorldStateV0
} from "./world-state-v0.ts";

export const M1_ABSTRACT_GRAPH_30_SCENARIO_ID = "m1.abstract-graph-30";
export const M1_ABSTRACT_GRAPH_30_CONTENT_MANIFEST_HASH = "4a438525";

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

export function createAbstractGraph30WorldStateV0(): WorldStateV0 {
  return createWorldStateV0({
    seed: 1531,
    contentManifestHash: M1_ABSTRACT_GRAPH_30_CONTENT_MANIFEST_HASH,
    currentDay: 0,
    revision: 0,
    definitions: {
      polities: [
        definePolity({
          id: 1,
          displayNameKey: "polity.m1_abstract.name"
        })
      ],
      persons: [
        definePerson({
          id: 1,
          displayNameKey: "person.m1_abstract.observer"
        })
      ],
      districts: createAbstractGraphDistricts(),
      settlements: [
        defineSettlement({
          id: 1,
          displayNameKey: "settlement.m1_abstract.anchor",
          districtId: 1
        })
      ],
      routes: createAbstractGraphRoutes()
    }
  });
}

function createAbstractGraphDistricts(): ReturnType<typeof defineDistrict>[] {
  const districts: ReturnType<typeof defineDistrict>[] = [];

  for (let districtId = 1; districtId <= 30; districtId += 1) {
    districts.push(
      defineDistrict({
        id: districtId,
        displayNameKey: `content.m1.abstract.node_${districtId.toString().padStart(3, "0")}`
      })
    );
  }

  return districts;
}

function createAbstractGraphRoutes(): ReturnType<typeof defineRoute>[] {
  const routes: ReturnType<typeof defineRoute>[] = [];

  for (let routeId = 1; routeId <= 30; routeId += 1) {
    routes.push(
      defineRoute({
        id: routeId,
        fromDistrictId: routeId,
        toDistrictId: routeId === 30 ? 1 : routeId + 1,
        lengthInMapUnits: 10 + ((routeId - 1) % 5)
      })
    );
  }

  for (let routeId = 31; routeId <= 60; routeId += 1) {
    const fromDistrictId = routeId - 30;
    const toDistrictId = ((fromDistrictId + 1) % 30) + 1;
    routes.push(
      defineRoute({
        id: routeId,
        fromDistrictId,
        toDistrictId,
        lengthInMapUnits: 20 + ((routeId - 31) % 5)
      })
    );
  }

  return routes;
}

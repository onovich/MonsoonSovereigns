# ADR-010: Map Topology Substrate

Status: PROPOSED

Date: 2026-06-30

## Context

The product owner rejected M7 content-lock reconsideration after live preview because the current map still behaves like a rectangular/grid topology even when the renderer draws softer region outlines. This is not a visual polish defect. It is a player-facing rules-model defect: adjacency, distance, pathing, capacity, AI explanations, hit testing, and save compatibility must not be derived from a rectangular row/column substrate and then visually disguised.

The frozen design already points in this direction:

- `docs/01-game-design-document.md` says the map substrate is a graph and the visual surface is a 2D/2.5D region map.
- `docs/04-software-architecture.md` defines three layers: Simulation Graph, Geographic Geometry, and Render Cache.

The current recovery must therefore restore the intended architecture rather than add another visual wrapper.

## Decision

Use a hybrid topology for the strategic map:

1. District/Province polygons are the governance surface.
2. Explicit Route/Transport graph edges are the movement, supply, obligation delivery, campaign planning, AI pathing, and reason-code surface.
3. Renderer geometry is derived from compiled content/read models and never becomes authoritative simulation state.
4. Path costs, capacity, seasonal modifiers, risk, known/unknown state, and route blockers are explicit edge attributes or query results.
5. No player-facing default map, AI decision, or save/runtime path may infer authoritative adjacency or distance from a rectangular grid, hex grid, axial/cube coordinate system, or any regular lattice that has only been visually disguised as irregular territory.

This keeps the game about political regions, vassal obligations, routes, rivers, monsoon timing, storage, and bottlenecks. It avoids turning the project into a tile-economy game while still giving players a readable map surface.

## Rejected Options

- Rectangular grid with irregular visual outlines: rejected because the topology still leaks through adjacency, distance, pathing, hit testing, AI explanations, and saves.
- Regular lattice with non-rectangular skins: rejected for the same reason. A synthetic fixture may use a procedural tool to sketch polygons, but the shipped prototype cannot derive authority adjacency, pathing, route cost, or content validation from row/column order, sequential ids, hex axial/cube coordinates, or a hidden lattice.
- Hex map as the authority model: rejected for this project because it would push governance, vassalage, and campaign logistics toward tile economics. Hex logic may still inspire clear adjacency and distance tests.
- Engine navmesh as the authority model: rejected because Unity/Unreal-style navmesh is aimed at agent movement, not political district control and deterministic grand-strategy saves.
- True GIS production map for M7/M8: rejected as out of scope because it brings licensing, projection, historical-accuracy, content-production, and cultural-risk burdens.

## Implementation Chain

M7 content lock remains blocked until this chain validates:

1. `M7-MAP-TOPOLOGY-RECOVERY-001`: record product-owner REQUEST_CHANGES, research mature game approaches, and accept this ADR/task chain.
2. `M7-MAP-TOPOLOGY-SCHEMA-001`: introduce authoritative topology definitions, content/runtime DTOs, path query/read-model surfaces, topology hash, and save handling.
3. `M7-MAP-TOPOLOGY-FIXTURE-001`: migrate prototype content away from rectangular row/column topology using low-fidelity synthetic or COMPOSITE districts unless historical claims are reviewed.
4. `M7-MAP-TOPOLOGY-CLIENT-001`: render topology-backed district polygons and route decision surfaces without mutating WorldState from UI or renderer.
5. `M7-MAP-TOPOLOGY-VALIDATION-001`: prove determinism, content validation, map/list/task/inspector sync, route reason codes, save behavior, negative cases, and screenshot evidence.

Only after validation enters `origin/main` may `M7-CONTENT-LOCK-ACCEPTANCE-001` reopen product-owner reconsideration.

## Invariants

- District adjacency is explicit data or derived by a content compiler from accepted polygon/route definitions, never from row/column grid position, hex axial/cube coordinates, sequential ids, or regular lattice neighbors in player-facing authority paths.
- Route endpoints reference valid district, settlement, port, pass, warehouse, or special-node ids.
- Route tie-breakers are stable and deterministic: total cost, edge count, route id, then stable endpoint ids.
- Visual coordinates do not define authoritative travel distance, reachability, AI path quality, or route cost. Perturbing polygon coordinates must not change route selection unless explicit route-edge data changes.
- Route capacity cannot be double-spent by multiple convoys or campaign plans.
- Isolated playable regions require explicit isolated/no-known-route reason codes.
- Renderer and UI consume read models; they do not mutate authoritative `WorldState`.
- `Math.random`, `Date.now`, render frame timing, object iteration order, and hidden global penalties cannot decide authoritative topology results.

## Anti-Grid Acceptance Standard

A topology-backed map is not accepted merely because it stops drawing square tiles. The following must be true before M7 content lock can reopen:

- Default player-facing content must include irregular COMPOSITE districts with variable route degree, dead ends, chokepoints, river/coast/road modes, at least one explicit isolated or no-known-route reason, one visual-neighbor pair with no route, and one visually distant pair connected by an explicit route.
- The content compiler must reject duplicate topology ids/source ids, missing endpoints, invalid or zero-area polygons, self-intersecting polygons, route nodes outside their district, disconnected playable graphs without explicit reason codes, and any row/column-only adjacency shortcut.
- `definitions.routes` may remain only as a compatibility projection or migration bridge while topology is introduced. Long-term movement, supply, obligation delivery, campaign, AI, and player explanations must use topology route edges as the authoritative surface.
- AI and adviser text must consume the same topology/path query as player UI, including blocked, unknown, capacity, season, and bottleneck reason codes.
- Save/load must preserve topology hash or reject incompatible topology with structured errors; it must not silently fall back to legacy grid behavior.

## Player-Facing Requirements

- Clicking a district polygon selects the same object in the map, district list, task rail, and right inspector.
- Route previews expose edge sequence, travel mode, estimated days, bottleneck capacity, seasonal change, known/unknown state, and blocker reason.
- Default overlays show only the current decision-relevant route, obligation, risk, or target context; full/debug overlays are opt-in.
- AI and adviser explanations use the same route and topology queries as the player UI.
- Save/load round trips preserve topology hash or reject incompatible topology with structured errors.

## Research Notes

The read-only gameplay research compared mature patterns:

- Nobunaga-like campaign maps: castle/county/road networks make routes, provisions, multi-origin attacks, and marching decisions legible.
- Civilization-style hex maps: clear local adjacency but too tile-economic for this project's political-region model.
- Paradox-style province maps: stable province ids and map modes are useful, but exact historical borders carry content-production and interpretation risk.
- Total War-style province/settlement/region structure: useful precedent for region governance plus strategic movement surfaces.
- Voronoi/Delaunay procedural maps: useful for low-fidelity synthetic fixtures, but formal historical content still needs research review.
- Unity/Unreal navmesh cost/link concepts: useful as a mental model for polygon plus cost/link separation, not as a dependency or authority substrate.

Reference URLs recorded by the research thread:

- https://www.koeitecmoamerica.com/manual/nobunaga/awakening/en/7100.html
- https://www.koeitecmoeurope.com/manual/nobunaga/awakening/en/7200.html
- https://academy.totalwar.com/campaign-provinces-and-settlements/
- https://docs.unity3d.com/Packages/com.unity.ai.navigation@2.0/manual/AreasAndCosts.html
- https://dev.epicgames.com/documentation/unreal-engine/navigation-system-in-unreal-engine
- https://simblob.blogspot.com/2010/09/polygon-map-generation-part-1.html

A second read-only gameplay design pass on 2026-06-30, thread `019f192d-e3e3-7623-b959-49c3280f134e`, returned `ACCEPT_WITH_REQUIRED_AMENDMENTS`. It tightened the standard above: point-to-point or area-movement style explicit routes are a better low-fidelity prototype target than any hidden grid; Voronoi/Delaunay may assist fixture sketching only, not generate historical or authoritative road claims; and M7 fixture/client validation must prove the map is no longer a regular lattice wearing irregular shapes.

Additional reference URLs from that pass:

- https://www.koeitecmoamerica.com/manual/nobunaga/awakening/en/7100.html
- https://www.koeitecmoamerica.com/manual/nobunaga/awakening/en/4300.html
- https://www.koeitecmoeurope.com/manual/nobunaga/awakening/en/4200.html
- https://academy.totalwar.com/the-province-system/
- https://hoi4.paradoxwikis.com/Map_modding
- https://eu4.paradoxwikis.com/Map_modding
- https://ck3.paradoxwikis.com/Map_modding
- https://www-cs-students.stanford.edu/~amitp/game-programming/polygon-map-generation/

## Risks

- Cross-package scope: topology touches sim-core, protocol, content runtime, save, renderer, and client behavior. The task chain splits these surfaces and requires systems/QA review.
- Historical overclaim: M7 fixtures must remain synthetic/COMPOSITE unless historical_researcher records claim sources.
- UI overload: route details must be decision-focused by default, with deeper overlays opt-in.
- Save compatibility: topology hash and legacy save behavior must be explicit before content lock.

## Consequences

The project can no longer treat the M7 map problem as solved by visual de-gridding. Content lock is blocked until topology recovery validation closes in main. This is a larger recovery than a map renderer patch, but it aligns the implementation with the already-frozen design and prevents the wrong topology from becoming a permanent save/content/API debt.

# ADR-011: Strategic Terrain Map Authority

Status: PROPOSED

Date: 2026-07-01

## Context

The product owner rejected M7 content-lock reconsideration after topology validation. The latest clarification states that the current map drawing direction and the current spatial indexing direction are rejected at the root level. This is not a visual polish issue, not a texture replacement task, and not a request to make rectangular, grid, lattice, or cell maps look less rectangular.

ADR-010 remains useful negative proof: authority must not come from hidden rectangular rows, columns, hex axial/cube coordinates, sequential ids, or regular-lattice adjacency. ADR-010 is not the content-lock target. Polygon governance footprints plus an abstract route graph still fail to create mature strategy-game terrain readability.

Official reference notes already recorded in the task:

- RTK14 manual pages separate land/terrain, area/city control, terrain effects, march days, and supply-line concepts.
- Nobunaga's Ambition: Awakening manual pages separate counties/castles/dominions from roads, road width, supplies, march routes, days, and provisions.

These references are used as readability patterns only. This ADR does not copy their economy, battle model, historical content, or art direction.

## Decision

Adopt a new player-facing strategic terrain authority for M7 recovery:

1. The primary player-facing spatial substrate is a low-fidelity terrain-route-node query model.
2. Continuous terrain readability comes first: terrain patches and terrain bands explain valleys, uplands, wet ground, coastlines, river basins, ridges, passes, and bottlenecks at strategic scale.
3. Strategic nodes are the main action anchors: castles, towns, ports, passes, crossings, warehouses, staging places, and other named strategic places.
4. Route corridors are first-class: roads, river channels, coastal corridors, pass corridors, and port/landing links carry mode, width/capacity, seasonal modifiers, risk, blockers, and bottleneck explanation.
5. Barriers/channels are separate first-class features: ridges, major river lines, wetlands, coasts, straits, and similar features constrain or enable corridors through explicit crossings, ports, passes, or channels.
6. District governance footprints become an overlay for control, obligations, appointments, taxation, and postwar governance. They are not the primary hit-test, path-preview, route-cost, or AI-reason substrate.
7. Hit testing, path preview, and AI reasons start from the terrain-route-node query model. Governance boundaries are queried after actionable nodes, corridors, crossings, blockers, and terrain explanations.

This supersedes the rejected polygon-first player-facing map direction. It does not authorize high-fidelity final art, a formal GIS historical database, production cultural assets, server/multiplayer, telemetry, Rust/WASM, accounts, commercial/release decisions, or manual node battle reversal.

## Rejected Options

- Visual polish over the current map: rejected because the product issue is direction and spatial model, not cosmetics.
- Texture replacement or prettier polygon fills: rejected because abstract governance cells remain the wrong player-facing substrate.
- Polygon-first governance cells plus abstract route lines: rejected for content lock because it passes anti-grid checks but still fails strategic terrain readability.
- Hidden rectangular, hex, sequential-id, or regular-lattice authority with irregular skins: rejected by ADR-010 and reaffirmed here.
- Full authoritative hex-tile economy: rejected because it would shift the game away from vassal networks, route logistics, population/labor, monsoon campaigns, supply, succession, and non-paint-the-map victory.
- Renderer-only terrain art with unchanged spatial queries: rejected because hit testing, path preview, and AI reasons would still come from the old model.
- Formal GIS production map for M7: rejected because historical accuracy, projection, licensing, cultural review, and content-production risk exceed this recovery scope.

## System Spec

### Goal

Recover the strategic map so players can read terrain, routes, nodes, barriers, and governance overlays as a mature strategy-game decision surface. The map must help players decide where to muster, move, supply, delay, defend, appoint, negotiate obligations, or avoid overextension.

### Player Decisions

Players must be able to decide:

- Which strategic node to target, defend, stage from, or supply.
- Which corridor to use, delay on, avoid, blockade, reinforce, or keep open.
- Whether terrain and monsoon timing make a march, supply convoy, tribute delivery, or obligation fulfillment viable.
- Whether a governance district overlay matters for appointment, tax, obligation, legitimacy, or postwar settlement after the terrain-route decision is understood.

### State

The planned authority has five typed layers:

- `TerrainPatch`: low-fidelity continuous terrain regions or bands with local terrain class, readability label, season sensitivity, and explanation tags.
- `BarrierChannel`: ridges, rivers, coasts, wetlands, straits, and similar features that block, channel, slow, or enable movement through explicit crossings, ports, passes, or corridor links.
- `StrategicNode`: actionable places such as castles, towns, ports, passes, crossings, warehouses, staging areas, and campaign objectives.
- `RouteCorridor`: explicit road, river, coastal, pass, or mixed-mode corridor connecting strategic nodes with capacity, width, days/cost intent, risk, blocker, season, and bottleneck fields.
- `DistrictGovernanceFootprint`: overlay footprint for control, office, obligation, taxation, legitimacy, and postwar governance, separate from terrain/path authority.

### Update Frequency

- Static terrain patches, barriers/channels, nodes, and baseline corridors update only when content changes.
- Seasonal corridor modifiers update on deterministic calendar boundaries already owned by simulation time.
- Temporary blockers, capacity reservations, known/unknown states, supply pressure, and campaign commitments update through authoritative simulation events and queries.
- Renderer caches may update per frame, but renderer state never changes authoritative terrain-route-node state.

### Formula Intent

Formulas are not approved here, but their intent is fixed:

- Travel days and supply risk should be explainable from corridor mode, corridor length class, width/capacity, terrain patches crossed, barriers/channels crossed, season, blocker state, and bottleneck node/corridor.
- Defensive or logistical advantages must be local and legible. They must carry cost, dependency, and counterplay instead of hidden global penalties.
- Terrain effects attach to places, corridors, seasons, and supply states. They must not become fixed culture/ethnicity buffs, person total-stat cards, or invisible global modifiers.
- Every route preview must be reproducible from explicit data and stable deterministic tie-breakers.

### Invariants

- District governance footprints are overlays, not the primary spatial authority.
- Hit testing prioritizes actionable route corridors, strategic nodes, crossings/ports/passes/blockers, and terrain explanations before governance footprints.
- Path preview and AI reasons use the same terrain-route-node query model as player UI.
- No authoritative reachability, route cost, AI reason, save compatibility, or default UI behavior may derive from hidden grid, hidden lattice, sequential id order, polygon centroid guessing, bounding-box adjacency, or renderer-only lines.
- Each advantage has a visible cost, dependency, or counter. Examples: pass control creates a chokepoint but can be bypassed by coastal/river corridors; wide roads improve throughput but require maintained nodes and are visible targets; river corridors help supply but depend on season, ports, and channel control.
- Forced migration, labor extraction, famine, enslavement, massacre, and religious conflict cannot be represented as cost-free map bonuses.
- Historical labels, port importance, route claims, pass claims, river importance, and cultural symbols must route to `historical_researcher` before being asserted as historical content.

### AI Behavior

AI must evaluate target, wait, reinforce, withdraw, supply, and obligation decisions through the same query model as the player. AI reason codes must expose corridor sequence, estimated days, capacity, season, terrain, bottleneck, blocker, unknown state, and governance overlay consequence when relevant.

### UI Explanation

The default map must explain:

- What node or corridor is actionable.
- Why a route is fast, slow, blocked, risky, narrow, seasonally affected, or supply-limited.
- Which terrain patch, barrier/channel, node, or corridor creates the reason.
- Which governance district overlay is affected after the terrain-route-node decision is clear.

Debug overlays can show full ids and raw layers, but default player mode must remain decision-first.

### Boundaries

This ADR is a planning decision, not implementation approval. Downstream tasks remain DRAFT until reviewed. The recovery is low-fidelity and bounded. It does not approve final art, formal GIS data, production cultural assets, server/multiplayer, telemetry, Rust/WASM, account services, cloud saves, release/commercial/branding changes, or manual node battle reversal.

### Exploits

The downstream chain must guard against:

- Cell-board leakage: a map that still behaves like a board through hidden cells, even if it looks irregular.
- Renderer deception: visible terrain that does not drive route preview, hit testing, or AI reasons.
- Corridor stacking: multiple plans double-spend the same bottleneck capacity without structured reservation or conflict reason.
- Governance shortcutting: district adjacency or centroid proximity accidentally creates travel or supply reachability.
- Hidden punishment: vague global slowdowns or risk penalties replacing explicit terrain, season, capacity, supply, and blocker reasons.
- Historical overclaim: low-fidelity COMPOSITE geography being presented as verified historical geography.

### Vertical Slice Acceptance

M7 content-lock reconsideration can reopen only after validation proves:

- The default player-facing map no longer uses the rejected drawing or polygon-first spatial-index direction.
- Terrain patches, barriers/channels, strategic nodes, route corridors, and district governance footprints are visibly and semantically distinct.
- Hit testing selects nodes/corridors/blockers before governance overlays.
- Route preview and AI reasons expose distance or days, capacity, season, terrain, bottleneck, blocker, and risk from the same query model.
- Screenshots at 1440x900 and 1280x720 show a low-fidelity but legible strategic terrain map rather than a disguised cell board.
- Negative tests cover visual-neighbor-without-route, visually-distant-explicit-route, barrier-without-crossing, governance-adjacent-but-route-blocked, and geometry perturbation without route change.

## Advantages, Costs, Dependencies, Counters

- Advantage: continuous terrain readability gives players a strategic mental model before they inspect data. Cost: extra authored terrain features and validation burden. Dependency: schema and fixture support for terrain patches and barriers/channels. Counter: overlays and reason text must prevent decorative terrain from hiding actual route constraints.
- Advantage: strategic nodes and corridors make logistics, muster, monsoon timing, and bottlenecks legible. Cost: route/capacity data becomes more explicit. Dependency: shared query surfaces for UI and AI. Counter: alternate corridors, seasonal changes, blockade/relief, and supply reservations keep chokepoints from becoming automatic wins.
- Advantage: governance footprints as overlays preserve vassal politics without turning the map into paintable cells. Cost: renderer and hit-testing must change. Dependency: inspector/task rail/list sync around active node/corridor/governance objects. Counter: governance overlays remain selectable and explain obligations, taxes, appointments, and postwar consequences after the terrain action is clear.

## Starting Assumptions And Validation

These parameters are starting assumptions, not balance locks:

- 12-18 district governance footprints for the current prototype slice.
- 18-30 strategic nodes.
- 25-45 route corridors.
- 12-24 terrain patches or bands.
- 6-14 barriers/channels, with at least one crossing/pass/port bottleneck.

Metrics and validation:

- 100% of route previews expose node sequence, corridor modes, estimated days, bottleneck capacity, season state, blocker state, terrain reason, and risk reason.
- 100% of AI campaign movement/wait reasons use the same query reason codes as player route previews.
- Hit-test smoke covers node, corridor, blocker, terrain explanation, and governance overlay priority.
- Screenshot review must reject any result that still reads as a rectangular/grid/lattice/cell board in default player mode.
- Historical review must approve or mark as COMPOSITE/INFERRED/FICTIONAL every real-world terrain, route, port, river, pass, polity, or label claim before formal content use.

## Recovery Chain

M7 content lock remains blocked until this chain is reviewed, implemented in later tasks, and validated:

1. `M7-STRATEGIC-TERRAIN-RECOVERY-001`: this planning package, routed to `systems_architect` for review.
2. `M7-STRATEGIC-TERRAIN-SCHEMA-001`: define terrain-route-node authority, serializable schema, save/query boundaries, and deterministic spatial-query semantics.
3. `M7-STRATEGIC-TERRAIN-FIXTURE-001`: produce low-fidelity COMPOSITE terrain/node/corridor/governance fixture content with historical review boundaries.
4. `M7-STRATEGIC-TERRAIN-RENDERER-INTERACTION-001`: replace the rejected drawing and spatial-index direction with terrain-route-node-first rendering, hit testing, and path preview.
5. `M7-STRATEGIC-TERRAIN-VALIDATION-001`: validate anti-grid proof, route/node/terrain readability, screenshots, AI/player reason parity, deterministic replay, and console cleanliness.

Only after validation enters `origin/main` may `M7-CONTENT-LOCK-ACCEPTANCE-001` reopen product-owner reconsideration. This ADR does not approve content lock.

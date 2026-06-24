# M2 Map Fixture Source Policy

Task: M2-MAP-SOURCE-POLICY-001
Scope: M2 prototype map fixtures only

## Purpose

The M2 map fixture is a synthetic engineering fixture for testing the 30 District / 10 Settlement vertical slice, compiler validation, graph behavior, route selection, and client rendering. It is not formal historical map content and must not be treated as evidence for 16th-century geography, settlement hierarchy, polity control, language, religion, architecture, dress, symbols, or identity.

M2 content and compiler tasks may use this policy to decide what fixture data is allowed before a separate historical research/content task exists.

## Fixture Boundary

Allowed in M2 fixtures:

- abstract district, settlement, route, season, market, and validation-test IDs;
- synthetic coordinates or simplified geometries used only for layout and graph tests;
- generic terrain, river, road, coast, and seasonal transport categories needed by mechanics;
- fictional display names that are visibly placeholder-like and not derived from real historical names;
- bad-map fixtures that intentionally violate schema, references, graph connectivity, or geometry rules for validation tests.

Blocked without a separate research/content task:

- named historical settlements, ports, capitals, temples, rivers-as-specific-claims, passes, or boundaries;
- real polity claims, control, vassalage, tribute, campaign routes, or settlement hierarchy;
- real cultural, religious, dynastic, royal, military, heraldic, script, iconographic, or sacred symbols;
- modern national borders, modern administrative polygons, or modern ethnic categories used as historical facts;
- inferred local names, titles, dress, building forms, flags, or institution names created from style impressions.

If a later task needs any blocked item, create formal source records and claim records first. Do not smuggle it into an M2 fixture as "just a label" or "temporary art."

## Historicity Labels

Use these labels whenever map or content data carries historical meaning:

- `HISTORICAL`: required for a specific real-world assertion supported by source records and claim records, such as a named settlement, dated location, polity relationship, route, title, or symbol. Not allowed in M2 prototype fixtures unless a separate task explicitly authorizes it.
- `INFERRED`: required when a data point is a scholarly or project inference from evidence, such as approximate geometry, relative route importance, or likely settlement function. Record what is source statement, what is academic interpretation, and what is project inference. Not allowed for M2 fixture geography without a separate research/content task.
- `COMPOSITE`: required when a game entity blends multiple historical patterns or sources into one abstraction. It must not reuse a real settlement name, real symbol, or single real polity claim unless separately justified. M2 should avoid composites except as explicitly synthetic pattern tests.
- `FICTIONAL`: required for invented placeholders, stress fixtures, and bad-map validation fixtures. The default M2 prototype map fixture label is `FICTIONAL`.

Unlabeled map content is invalid once it leaves pure compiler internals. If evidence is insufficient, mark the item `RESEARCH REQUIRED` instead of promoting it to a historical label.

## Minimum Provenance Fields For Later Work

M2 fixtures do not need formal claim records because they must stay synthetic. Later historical map/content tasks should plan for these minimum provenance fields:

- `source_category`: primary/near-contemporary source, scholarly edition/translation, peer-reviewed article, university-press monograph, museum/archaeology record, historical atlas/GIS, gazetteer, modern GIS assist, or validation-only fixture;
- `confidence`: `HIGH`, `MEDIUM`, `LOW`, or `DISPUTED`;
- `coordinate_geometry_derivation_note`: how point or geometry data was derived, including coordinate system, simplification tolerance, whether modern GIS only assisted placement, and whether the shape is approximate;
- `known_limitations`: uncertainty, date range, source bias, colonial or nationalist framing risk, victory-chronicle bias, missing local perspectives, and whether only an abstract/summary was available;
- `historicity`: one of `HISTORICAL`, `INFERRED`, `COMPOSITE`, or `FICTIONAL`;
- `claim_ids` / `source_ids`: required for anything other than validation-only `FICTIONAL` data.

These fields do not replace claim records. Specific historical assertions still require claim records with page, section, or catalog references and game-abstraction notes.

## Bad-Map Fixtures

Bad-map fixtures are validation data only. They may contain deliberately broken references, disconnected graphs, invalid geometry, impossible seasonal values, duplicate IDs, or forbidden provenance shapes, but they must be stored, named, and described as negative tests.

Bad-map fixtures must not be exposed as production content, world-building examples, tutorial maps, marketing screenshots, or narrative placeholders. They should use abstract IDs and `FICTIONAL` historicity so failures cannot be mistaken for historical claims.

## Review Rule

Before M2 exit, QA should verify that production-facing map fixtures remain synthetic and that any file containing real names, real symbols, polity control, cultural identity, or historical settlement claims is blocked until a separate historical research/content task supplies source and claim records.

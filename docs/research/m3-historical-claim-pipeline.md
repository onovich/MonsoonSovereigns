# M3 Historical Claim Pipeline

Task: M3-HISTORICAL-CLAIM-PIPELINE-001
Scope: M3 names, titles, kinship, offices, polity relationships, and vassalage assertions

## Purpose

M3 introduces the systems that make people, offices, and suzerain relationships playable. This document defines the research gate for any specific historical name, title, kinship claim, office claim, polity relationship, vassalage assertion, or cultural/political symbol before it can enter formal content data, runtime fixtures, UI-facing examples, localization, encyclopedia text, or art/audio briefs.

This is a pipeline and policy artifact only. It does not create historical people, title lists, relationship records, polity content, or production fixture data.

## Source Policy

Use the source hierarchy in `docs/10-historical-research-policy.md`.

Preferred evidence:

- contemporary or near-contemporary inscriptions, chronicles, diplomatic records, travel accounts, and material culture;
- scholarly editions, translations, and source-critical publications of primary material;
- peer-reviewed articles and university-press monographs;
- museum, archaeology, or university research project records with provenance and dating.

Synthesis evidence:

- scholarly encyclopedias, authoritative reference works, PhD dissertations, historical atlases, gazetteers, language tools, and expert institutional resources.

Discovery-only material:

- Wikipedia, general web pages, blogs, videos, forums, modern games, novels, film, television, unsourced reconstructions, and media news.

Discovery-only material may identify leads, but it cannot be the sole formal source for M3 content. Search snippets and abstracts are not full evidence. If full text is unavailable, the claim record or research note must say that only the abstract, table of contents, catalog record, or preview was seen.

## Required Claim Record

Every specific historical assertion in scope must have a `project/schemas/historical-claim.schema.json` compatible claim record before it is eligible for formal content. Use `project/templates/historical-claim.yaml` as the starting shape.

Required fields:

```yaml
claim_id: HIST-...
claim: "..."
entity_ids: []
time_span: "..."
source_ids: []
source_passages:
  - source_id: "..."
    locator: "page/chapter/catalog/inscription"
    summary: "SOURCE STATEMENT: ..."
confidence: HIGH | MEDIUM | LOW | DISPUTED
status: HISTORICAL | INFERRED | COMPOSITE | FICTIONAL
competing_interpretations: []
game_abstraction: "PROJECT INFERENCE: ... GAME ABSTRACTION: ..."
reviewer: "historical_researcher"
last_reviewed: "YYYY-MM-DD"
```

Do not record a bare URL. `source_passages[].locator` must identify a page, chapter, inscription number, catalog number, plate, or other stable locator. If the locator is unavailable because only an abstract or catalog entry was accessible, the locator must say so explicitly and the claim cannot be `HIGH`.

## Distinguishing Evidence Layers

The claim record must keep four layers separate:

- Source statement: what a source directly says. Record it in `source_passages[].summary` with the prefix `SOURCE STATEMENT:`.
- Scholarly interpretation: how editors or modern scholars explain, translate, date, contextualize, or dispute the source. Record it in `competing_interpretations` with the prefix `SCHOLARLY INTERPRETATION:`.
- Project inference: what the project infers from the evidence for data design. Record it in `game_abstraction` with the prefix `PROJECT INFERENCE:`.
- Game abstraction: how the claim is simplified for systems or UI. Record it in `game_abstraction` with the prefix `GAME ABSTRACTION:`.

If these layers cannot be cleanly separated, mark the item `RESEARCH REQUIRED` in the research note and do not promote it into formal content.

## Claim Categories

### Names

Applies to personal names, aliases, regnal names, court names, place-linked names, localization display names, and transliterations.

Minimum requirements:

- original form or scholarly transliteration when available;
- translation or romanization source and convention;
- date range or scenario context;
- alias mapping if one entity has multiple attested forms;
- source ID and claim ID for every formal display name that represents a real historical person, title, polity, settlement, symbol, or institution.

Blocked without claim records:

- invented "local-style" names meant to sound historical;
- names copied from modern national spellings without historical/transliteration review;
- one modern English spelling treated as the only historical form.

Validation-only names must be visibly abstract, such as `person.abstract.validation_a`, and must not resemble regional historical names.

### Titles

Applies to royal, court, military, administrative, religious, honorific, and ritual titles.

Minimum requirements:

- source statement for title wording or function;
- language/transliteration note when relevant;
- whether the title is attested for a person, an office, a ritual context, or a later retrospective account;
- scholarly interpretation of approximate function if the title cannot be translated literally;
- game abstraction explaining what authority or UI label the project uses.

Do not flatten titles into modern ranks unless the claim record explains that this is a game abstraction. Titles used only as generic UI categories must be marked as abstraction and must not be presented as exact historical equivalents.

### Kinship

Applies to parent-child, sibling, spouse, affinal, dynastic, adoption/fosterage, hostage-as-kinship, and succession claims.

Minimum requirements:

- direct source locator for the relationship or a modern scholarly synthesis with source-critical notes;
- time span or event context;
- competing interpretations for disputed genealogies;
- confidence no higher than `MEDIUM` when the relationship depends on a single late chronicle without independent support;
- explicit note if kinship is simplified for succession mechanics.

Do not infer biological kinship from shared house names, titles, ethnicity labels, or later dynastic claims without evidence. Unknown kinship must stay `RESEARCH REQUIRED`.

### Office Claims

Applies to appointments, governorships, command roles, court offices, local delegated roles, ritual offices, and delegated authority.

Minimum requirements:

- claim record for who held what role, under which authority, and in what time span;
- separation between office title, actual authority, controlled resources, and later retrospective title;
- source passages for appointment, tenure, or function;
- game abstraction for any conversion into M3 office permissions, administrative capacity, tribute rights, troop obligations, or appointment UI.

Do not turn a title into direct district control or direct military authority unless a separate claim supports that authority.

### Polity Relationships

Applies to alliances, rivalries, suzerainty, tributary relationships, hostage arrangements, marriage alliances, military access, restored rulers, imposed rulers, and diplomatic recognition.

Minimum requirements:

- specific relationship type and time span;
- source passages identifying both sides and the context;
- confidence rating and competing interpretations where sources disagree;
- bias review for victor chronicles, colonial historiography, and modern national narratives;
- game abstraction explaining whether the relationship becomes a suzerain link, obligation, claim, truce, alliance, or UI-only note.

Do not project modern national borders, modern ethnic blocs, or later state categories backward into a 16th-century relationship. A polity relationship is not automatically district ownership.

### Vassalage Assertions

Applies to direct suzerain links, tributary obligations, campaign troop duties, hostage obligations, court attendance, marriage promises, foreign-policy constraints, ritual acknowledgement, and conditional submission.

Minimum requirements:

- at least two independent reliable sources, or one strong primary/near-contemporary source plus one modern scholarly analysis, for key suzerain/vassal assertions;
- exact obligation type, if attested, or a clear `INFERRED` status if the project derives an obligation from broader evidence;
- due dates, event context, or scenario time span where relevant;
- `DISPUTED` confidence if sources disagree about whether the relationship was submission, alliance, coercive settlement, ritual acknowledgement, or later chronicle framing;
- game abstraction explaining the M3 obligation fields and any simplification.

Do not convert ceremonial acknowledgement into full control unless a separate claim record supports control. Do not make vassalage a static trait of an ethnicity, language group, or region.

### Symbols And Cultural Markers

Formal symbols, scripts, flags, seals, religious icons, dress, architecture, music references, and iconographic motifs are blocked by this pipeline even when requested for M3 UI or content examples.

They require separate source and cultural review before production use. Generic icon placeholders for implementation tests must be visibly abstract and must not borrow sacred, dynastic, military, or ethnographic imagery.

## Confidence And Historicity

Use `confidence` for evidence strength:

- `HIGH`: strong source base, stable locators, source-critical support, and no material dispute.
- `MEDIUM`: credible support with limits, partial corroboration, translation uncertainty, or moderate dating/function uncertainty.
- `LOW`: weak, indirect, late, single-source, abstract-only, catalog-only, or heavily inferred.
- `DISPUTED`: material disagreement between sources or scholarly interpretations.

Use `status` for content type:

- `HISTORICAL`: a specific real-world assertion supported by source and claim records.
- `INFERRED`: a project or scholarly inference from evidence; the record must say what is inferred.
- `COMPOSITE`: a designed blend of patterns or multiple attested cases; it must not masquerade as one real person, title, office, or relationship.
- `FICTIONAL`: invented validation or gameplay data; it must not borrow real names, symbols, or specific historical claims.

`RESEARCH REQUIRED` is a workflow stop label, not a schema `status` value. Use it in research notes, task blockers, review comments, or `game_abstraction` text when a claim record is deliberately not approved for content.

## Bias And Harm Review

Every M3 historical claim in scope must check:

- modern border projection;
- modern ethnic or national essentialism;
- language group equated with political loyalty;
- single victorious court chronicle treated as neutral fact;
- colonial-era categories or administrative convenience projected backward;
- later nationalist framing;
- erasure of local, defeated, coerced, enslaved, displaced, or hostage perspectives.

Claims involving conquest, forced migration, enslavement, hostage-taking, execution, massacre, famine, religious coercion, or other violence must record victims, source community, family or production loss, integration/resistance, and long-term political consequences when they are part of the content assertion. If the evidence does not support those consequences yet, block formal content and mark `RESEARCH REQUIRED`.

## Pipeline Stages

1. Define the research question.
   - Identify whether the claim is a name, title, kinship, office, polity relationship, vassalage assertion, symbol, or mixed claim.
   - List the evidence types required before searching.

2. Gather source candidates.
   - Start from A-grade sources and scholarly synthesis.
   - Use C-grade material only to discover citations.
   - Record access limits, including abstract-only or catalog-only access.

3. Extract source statements.
   - Record locators and summaries.
   - Do not paraphrase a source into a stronger claim than it supports.
   - Separate translation/editor choices from the underlying statement.

4. Compare interpretations.
   - Add competing scholarly interpretations and source conflicts.
   - Identify bias risks and missing perspectives.

5. Draft claim records.
   - Use existing schema fields only.
   - Assign confidence and status conservatively.
   - Mark insufficient evidence as `RESEARCH REQUIRED`; do not fill with impressions.

6. Historical review.
   - `historical_researcher` reviews the claim record before downstream content use.
   - Quick scout output is only a lead list until reviewed.
   - Major cultural/historical disputes route to product-owner decision rather than hidden content choices.

7. Gameplay abstraction review.
   - `gameplay_designer` may use reviewed claims to define mechanics, but must preserve `game_abstraction` limits.
   - Design cannot upgrade a weak claim into a fact for convenience.

8. Content-source or fixture gate.
   - Formal historical content or runtime fixtures must include claim IDs and source IDs for specific names, titles, relationships, symbols, offices, polity claims, and vassalage assertions.
   - Validation-only `FICTIONAL` data may omit historical claim IDs only when it is abstract, visibly non-product, and contains no real or real-looking historical content.

9. QA review.
   - QA verifies scope, schema validity, source/claim coverage, abstract examples, and no forbidden path drift before acceptance.

## Content Entry Blockers

The following must not enter `content-source`, runtime fixtures, localization, UI copy, encyclopedia text, art briefs, or marketing-facing examples without source IDs and claim records:

- formal historical people or aliases;
- historical titles, offices, ranks, honorifics, or ritual labels;
- kinship, marriage, succession, hostage, patron-client, rivalry, or alliance claims;
- polity relationships, suzerain links, tribute obligations, troop duties, or vassalage claims;
- historical settlement, district, capital, route, pass, port, or boundary claims;
- dynastic, royal, religious, military, script, heraldic, dress, architectural, musical, or sacred symbols;
- claims about forced migration, slavery, captive labor, massacre, famine, religious conflict, or other violence.

These blockers apply even when the item is "temporary", "just a label", "only for a screenshot", or "only a fixture".

## Abstract Validation Examples

The following examples are validation shapes only. They are not product content, not historical content, and not evidence for any real person, polity, title, office, relationship, or region.

### Abstract Name Claim

```yaml
claim_id: HIST-VALIDATION-NAME-001
claim: "Validation entity A has the abstract display label 'Validation Label A' in validation scenario V."
entity_ids:
  - entity.abstract.validation_a
time_span: "validation-only"
source_ids:
  - source.abstract.validation_protocol
source_passages:
  - source_id: source.abstract.validation_protocol
    locator: "validation protocol section abstract-name"
    summary: "SOURCE STATEMENT: The validation protocol defines a non-historical label for schema testing."
confidence: LOW
status: FICTIONAL
competing_interpretations: []
game_abstraction: "PROJECT INFERENCE: None. GAME ABSTRACTION: Non-product label used only to test claim-record shape."
reviewer: "historical_researcher"
last_reviewed: "2026-06-25"
```

### Abstract Vassalage Claim

```yaml
claim_id: HIST-VALIDATION-VASSALAGE-001
claim: "Validation polity A has an abstract obligation to validation polity B for schema testing."
entity_ids:
  - polity.abstract.validation_a
  - polity.abstract.validation_b
time_span: "validation-only"
source_ids:
  - source.abstract.validation_protocol
source_passages:
  - source_id: source.abstract.validation_protocol
    locator: "validation protocol section abstract-obligation"
    summary: "SOURCE STATEMENT: The validation protocol defines a non-historical obligation edge for schema testing."
confidence: LOW
status: FICTIONAL
competing_interpretations: []
game_abstraction: "PROJECT INFERENCE: None. GAME ABSTRACTION: Non-product suzerain/obligation shape used only to test claim-record coverage."
reviewer: "historical_researcher"
last_reviewed: "2026-06-25"
```

## Review Checklist

Before a downstream task uses a specific M3 historical claim, verify:

- the claim has a schema-compatible claim record;
- source IDs and source passages have stable locators;
- the evidence layer separation is visible;
- confidence and status are conservative;
- disputed claims include competing interpretations;
- source bias and modern category risks were checked;
- violence, forced migration, slavery, hostage-taking, or coercion claims record victims and long-term consequences or remain blocked;
- game abstraction does not overstate the source;
- examples and test fixtures remain abstract when they are not formal historical content;
- no blocked item enters `content-source` or runtime fixtures without claim IDs and source IDs.

## ROUTE_TO

Route this artifact to `qa_reviewer` for scope, historical policy safety, schema/template validity, abstract-example safety, and required-test verification.

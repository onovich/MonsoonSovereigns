// Generated from content-source/m7-beta-scenarios/beta-scenario-person-event-set.json. Keep this fixture in sync with the accepted content source.
export const M7_BETA_GUIDANCE_SOURCE = {
  schemaVersion: 1,
  kind: "m7.beta-scenario-person-event-set",
  fixtureId: "m7.beta.scenario-person-event.set",
  fixtureKind: "beta-scenario-person-event-set",
  contentScope: "m7-beta-content-fill",
  notContentLockAcceptance: true,
  m6GateCarryForward: "PASS_WITH_LIMITS",
  manualNodeBattleDecision: "DEFER_MANUAL_NODE_BATTLE",
  sourceRecords: [
    {
      sourceId: "source.baker-pasuk.2017.ayutthaya",
      sourceClass: "ACADEMIC_CANDIDATE",
      citation:
        "Chris Baker and Pasuk Phongpaichit, A History of Ayutthaya: Siam in the Early Modern World, Cambridge University Press, 2017",
      accessStatus: "BIBLIOGRAPHIC_METADATA_ONLY",
      pageOrSection: "RESEARCH REQUIRED",
      formalUse: "CANDIDATE_SOURCE_ONLY"
    },
    {
      sourceId: "source.charney.2004.warfare",
      sourceClass: "ACADEMIC_CANDIDATE",
      citation: "Michael W. Charney, Southeast Asian Warfare, 1300-1900, Brill, 2004",
      accessStatus: "BIBLIOGRAPHIC_METADATA_ONLY",
      pageOrSection: "RESEARCH REQUIRED",
      formalUse: "CANDIDATE_SOURCE_ONLY"
    },
    {
      sourceId: "source.project.docs.10",
      sourceClass: "PROJECT_POLICY",
      citation: "docs/10-historical-research-policy.md",
      accessStatus: "FULL_PROJECT_TEXT",
      pageOrSection: "sections 2-10",
      formalUse: "REVIEW_POLICY"
    },
    {
      sourceId: "source.project.docs.16",
      sourceClass: "PROJECT_BIBLIOGRAPHY",
      citation: "docs/16-research-bibliography.md",
      accessStatus: "FULL_PROJECT_TEXT",
      pageOrSection: "sections 1-8",
      formalUse: "SOURCE_DISCOVERY_ONLY"
    },
    {
      sourceId: "source.review.m7.baseline",
      sourceClass: "REVIEW_BASELINE",
      citation:
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json",
      accessStatus: "FULL_PROJECT_TEXT",
      pageOrSection: "claimRecords HIST-M7-BASELINE-001 through HIST-M7-BASELINE-008",
      formalUse: "REVIEW_BASELINE_ONLY"
    }
  ],
  claimRecords: [
    {
      claimId: "HIST-M7-FILL-001-SCOPE",
      claim:
        "This M7 fill set is a reviewable Beta content path, not formal content lock acceptance.",
      label: "INFERRED",
      confidence: "HIGH",
      sourceIds: ["source.review.m7.baseline", "source.project.docs.10"],
      sourcePassages: [
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json scope",
        "docs/10-historical-research-policy.md sections 3 and 10"
      ],
      sourceStatements: [
        "The accepted M7 baseline says no formal Beta real-world claim is accepted by that baseline."
      ],
      scholarlyInterpretations: [
        "Formal scenario, person, title, and event content still needs page or section level records before lock."
      ],
      researcherInference:
        "Use explicit schema records and review states without setting LOCK_CANDIDATE.",
      competingInterpretations: [],
      gameAbstraction:
        "Compile a deterministic content pack that can route to QA and later content-lock work.",
      researchStatus: "SUMMARY_ONLY",
      humanGate: false
    },
    {
      claimId: "HIST-M7-FILL-002-SCENARIO-ANCHORS",
      claim:
        "The 1531, 1569, and 1581 scenario anchors are retained only as composite candidates for the Beta fill path.",
      label: "COMPOSITE",
      confidence: "MEDIUM",
      sourceIds: ["source.review.m7.baseline", "source.project.docs.16"],
      sourcePassages: [
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json claim HIST-M7-BASELINE-004-ALPHA-SCENARIOS-NOT-LOCKED",
        "docs/16-research-bibliography.md section 8"
      ],
      sourceStatements: [
        "The review baseline says existing Alpha anchors must not be treated as formal M7 lock records."
      ],
      scholarlyInterpretations: [
        "The bibliography lists Toungoo, Ayutthaya, Lan Xang, and campaign topics that require dedicated page verification."
      ],
      researcherInference:
        "Keep the scenario anchors stable for tool validation while marking precise history RESEARCH REQUIRED.",
      competingInterpretations: [
        "Later M7 research may retain these anchors with verified sources.",
        "Later M7 research may narrow, fictionalize, or replace them."
      ],
      gameAbstraction:
        "Represent scenario hooks as stable IDs over accepted M1-M6 surfaces, not forced historical outcomes.",
      researchStatus: "RESEARCH_REQUIRED",
      humanGate: false
    },
    {
      claimId: "HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT",
      claim:
        "Persons in this fill set are composite or fictional role records until page-verified real people, names, and relationships are reviewed.",
      label: "COMPOSITE",
      confidence: "HIGH",
      sourceIds: ["source.review.m7.baseline", "source.project.docs.10"],
      sourcePassages: [
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json claim HIST-M7-BASELINE-006-LANGUAGE-NAMES-TITLES",
        "docs/10-historical-research-policy.md section 7"
      ],
      sourceStatements: [
        "The review baseline blocks display names and titles until language review.",
        "The policy allows composite or fictional persons when clearly labeled."
      ],
      scholarlyInterpretations: [
        "Sparse source coverage should not be converted into invented real names or stable genealogies."
      ],
      researcherInference:
        "Use role tags, stable IDs, owner, review state, and localization keys without asserting real-world biographies.",
      competingInterpretations: [],
      gameAbstraction:
        "Fill scenario-required agent slots for office, vassal, supply, succession, and adviser hooks.",
      researchStatus: "SUMMARY_ONLY",
      humanGate: false
    },
    {
      claimId: "HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK",
      claim:
        "Public-facing titles, aliases, transliterations, and personal names remain language-review blocked.",
      label: "RESEARCH REQUIRED",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline", "source.project.docs.10"],
      sourcePassages: [
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json languageBaseline",
        "docs/10-historical-research-policy.md sections 3 and 9"
      ],
      sourceStatements: [
        "The review baseline requires stable IDs, localization keys, source forms, display forms, language/context notes, and review state."
      ],
      scholarlyInterpretations: [
        "Language and title records need specialist review because common English forms may mix periods and traditions."
      ],
      researcherInference:
        "Use generic English/Chinese review strings and block formal display names until later review.",
      competingInterpretations: [
        "Display names may prioritize accessibility.",
        "Research records may preserve multiple scholarly transliteration forms."
      ],
      gameAbstraction:
        "The runtime consumes stable title IDs and localization keys, not hard-coded historical titles.",
      researchStatus: "RESEARCH_REQUIRED",
      humanGate: false
    },
    {
      claimId: "HIST-M7-FILL-005-EVENT-COSTS",
      claim:
        "Any event hook involving coercion, forced movement, famine, slavery, religious conflict, or wartime population loss must record victims and long-term consequences.",
      label: "INFERRED",
      confidence: "HIGH",
      sourceIds: ["source.review.m7.baseline", "source.project.docs.10"],
      sourcePassages: [
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json reviewGates M7-HIST-GATE-VIOLENCE-COST",
        "docs/10-historical-research-policy.md section 8"
      ],
      sourceStatements: [
        "The baseline requires victim group, source region, immediate loss, integration or resistance, and long-term effects."
      ],
      scholarlyInterpretations: [
        "Population movement and wartime loss may be historically significant, but cannot become a painless reward."
      ],
      researcherInference:
        "Create high-risk event hooks only with explicit consequence records and blocked review state.",
      competingInterpretations: [
        "Some chronicles may present coercion from a victor perspective.",
        "Later scholarship may emphasize source-community loss, resistance, and state fragility."
      ],
      gameAbstraction:
        "Short-term control options must expose legitimacy, relationship, labor, and recovery costs before use.",
      researchStatus: "SUMMARY_ONLY",
      humanGate: true
    },
    {
      claimId: "HIST-M7-FILL-006-NO-CULTURE-BUFF",
      claim:
        "Culture, language, religion, polity, and identity labels in this fill set are context records, not fixed mechanical buffs.",
      label: "INFERRED",
      confidence: "HIGH",
      sourceIds: ["source.review.m7.baseline", "source.project.docs.10"],
      sourcePassages: [
        "content-source/m7-review-baseline/historical-cultural-language-review-baseline.json reviewGates M7-HIST-GATE-NO-FIXED-CULTURE-BUFF",
        "docs/10-historical-research-policy.md section 6"
      ],
      sourceStatements: [
        "The project policy rejects modern identity shortcuts and fixed group templates."
      ],
      scholarlyInterpretations: [
        "Institutional, local, and relational records must be reviewed instead of treating group labels as timeless traits."
      ],
      researcherInference:
        "Scenario records should route identity-sensitive material to later culture review or Human Gate.",
      competingInterpretations: [
        "Some period sources may use broad ethnonyms.",
        "Modern or colonial historiography may over-stabilize those terms."
      ],
      gameAbstraction:
        "Use explicit obligations, legitimacy, relationships, routes, and offices rather than identity modifiers.",
      researchStatus: "SUMMARY_ONLY",
      humanGate: true
    }
  ],
  localization: [
    {
      key: "content.m7.beta.choice.agent_delay.name",
      zhHans: "推迟并要求更多证据",
      english: "Delay and ask for evidence",
      sourceNote: "Review-safe command wording; not a historical title.",
      context: "Event choice for adviser uncertainty.",
      characterLimit: 48,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 1
    },
    {
      key: "content.m7.beta.choice.defer_coercion.name",
      zhHans: "拒绝把迁徙当作无代价收益",
      english: "Reject cost-free forced movement",
      sourceNote: "Violence-cost review wording.",
      context: "Event choice for high-risk coercion review.",
      characterLimit: 60,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-005-EVENT-COSTS"],
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 2
    },
    {
      key: "content.m7.beta.choice.restore_local_rule.name",
      zhHans: "恢复地方统治并记录义务",
      english: "Restore local rule with obligations",
      sourceNote: "Generic governance wording pending title review.",
      context: "Postwar settlement choice.",
      characterLimit: 56,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 3
    },
    {
      key: "content.m7.beta.choice.vassal_settlement.name",
      zhHans: "分封臣属并保留审计",
      english: "Create a vassal settlement ledger",
      sourceNote: "Generic vassalage wording; no culture buff.",
      context: "Postwar settlement choice.",
      characterLimit: 56,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 4
    },
    {
      key: "content.m7.beta.cost.agent_delay.name",
      zhHans: "可能错过季风窗口，但避免无证断言。",
      english: "May miss the monsoon window, but avoids unsupported certainty.",
      sourceNote: "Gameplay abstraction, not a historical claim.",
      context: "Event choice cost summary.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-001-SCOPE"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 5
    },
    {
      key: "content.m7.beta.cost.defer_coercion.name",
      zhHans: "短期控制收益被阻止；人口、关系和合法性代价必须先记录。",
      english:
        "Short-term control gain is blocked until population, relationship, and legitimacy costs are recorded.",
      sourceNote: "Violence-cost gate text.",
      context: "Event choice cost summary.",
      characterLimit: 140,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-005-EVENT-COSTS"],
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 6
    },
    {
      key: "content.m7.beta.cost.restore_local_rule.name",
      zhHans: "降低直接负荷，但保留继承、贡赋和关系风险。",
      english: "Reduces direct load while retaining succession, tribute, and relationship risks.",
      sourceNote: "Gameplay abstraction over accepted M3/M4 systems.",
      context: "Event choice cost summary.",
      characterLimit: 120,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 7
    },
    {
      key: "content.m7.beta.cost.vassal_settlement.name",
      zhHans: "获得间接控制，但义务违约和地方代理风险会持续存在。",
      english: "Creates indirect control while obligation breach and local-agent risk persist.",
      sourceNote: "Gameplay abstraction over accepted M3/M4 systems.",
      context: "Event choice cost summary.",
      characterLimit: 120,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 8
    },
    {
      key: "content.m7.beta.event.agent_council.name",
      zhHans: "代理人与顾问分歧",
      english: "Agents and advisers disagree",
      sourceNote: "Composite gameplay event.",
      context: "Event title.",
      characterLimit: 64,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 9
    },
    {
      key: "content.m7.beta.event.campaign_window.name",
      zhHans: "季风战役窗口收窄",
      english: "The monsoon campaign window narrows",
      sourceNote: "Composite gameplay event over accepted M4 logistics.",
      context: "Event title.",
      characterLimit: 64,
      sourceIds: ["source.charney.2004.warfare", "source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 10
    },
    {
      key: "content.m7.beta.event.coercion_cost_review.name",
      zhHans: "强制迁徙与人口损失审查",
      english: "Forced movement and population-loss review",
      sourceNote: "High-risk review hook, not an accepted reward.",
      context: "Event title.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-005-EVENT-COSTS"],
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 11
    },
    {
      key: "content.m7.beta.event.postwar_settlement.name",
      zhHans: "战后安排需要承诺",
      english: "Postwar settlement requires commitments",
      sourceNote: "Composite gameplay event over accepted M3/M4 systems.",
      context: "Event title.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 12
    },
    {
      key: "content.m7.beta.event.succession_warning.name",
      zhHans: "继承压力正在上升",
      english: "Succession pressure is rising",
      sourceNote: "Composite gameplay event over accepted M6 succession surfaces.",
      context: "Event title.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 13
    },
    {
      key: "content.m7.beta.hook.1531.start",
      zhHans: "1531 复合开局：边缘政体与代理网络。",
      english: "1531 composite opening: edge polity and agent network.",
      sourceNote: "Scenario hook, not formal chronology.",
      context: "Scenario start hook.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 14
    },
    {
      key: "content.m7.beta.hook.1569.start",
      zhHans: "1569 复合开局：扩张后的宗主压力。",
      english: "1569 composite opening: overextended suzerainty.",
      sourceNote: "Scenario hook, not formal chronology.",
      context: "Scenario start hook.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 15
    },
    {
      key: "content.m7.beta.hook.1581.start",
      zhHans: "1581 复合开局：继承与网络裂缝。",
      english: "1581 composite opening: succession and network fracture.",
      sourceNote: "Scenario hook, not formal chronology.",
      context: "Scenario start hook.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 16
    },
    {
      key: "content.m7.beta.hook.encyclopedia.review_labels",
      zhHans: "百科条目显示史实、推断、复合、虚构与待研究标签。",
      english:
        "Encyclopedia entries expose historical, inferred, composite, fictional, and research-required labels.",
      sourceNote: "Review-facing hook.",
      context: "Encyclopedia hook.",
      characterLimit: 140,
      sourceIds: ["source.project.docs.10", "source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-001-SCOPE"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 17
    },
    {
      key: "content.m7.beta.hook.failure.unstable_order",
      zhHans: "如果义务、合法性或继承压力失衡，秩序目标会失败。",
      english:
        "Order goals can fail when obligations, legitimacy, or succession pressure destabilize.",
      sourceNote: "Gameplay hook over accepted systems.",
      context: "Failure hook.",
      characterLimit: 128,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 18
    },
    {
      key: "content.m7.beta.hook.tutorial.review_gaps",
      zhHans: "教程提示会标出未完成研究与文化审查风险。",
      english: "Tutorial hints mark unresolved research and culture-review risks.",
      sourceNote: "Review-facing hook.",
      context: "Tutorial hook.",
      characterLimit: 128,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-001-SCOPE"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 19
    },
    {
      key: "content.m7.beta.hook.victory.recognized_order",
      zhHans: "胜利目标关注可承认的秩序，而不是涂满地图。",
      english: "Victory focuses on recognized order, not total map coloring.",
      sourceNote: "Contracted gameplay abstraction.",
      context: "Victory hook.",
      characterLimit: 128,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-001-SCOPE"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 20
    },
    {
      key: "content.m7.beta.person.court_broker_1531.name",
      zhHans: "复合宫廷斡旋者 1531",
      english: "Composite court broker 1531",
      sourceNote: "Synthetic role record pending name and title review.",
      context: "Person display name.",
      characterLimit: 64,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 21
    },
    {
      key: "content.m7.beta.person.court_broker_1569.name",
      zhHans: "复合宫廷斡旋者 1569",
      english: "Composite court broker 1569",
      sourceNote: "Synthetic role record pending name and title review.",
      context: "Person display name.",
      characterLimit: 64,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 22
    },
    {
      key: "content.m7.beta.person.heir_contender_1581.name",
      zhHans: "复合继承竞争者 1581",
      english: "Composite succession contender 1581",
      sourceNote: "Synthetic role record pending name and title review.",
      context: "Person display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 23
    },
    {
      key: "content.m7.beta.person.local_governor_1531.name",
      zhHans: "复合地方治理者 1531",
      english: "Composite local governor 1531",
      sourceNote: "Synthetic role record pending name and title review.",
      context: "Person display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 24
    },
    {
      key: "content.m7.beta.person.regional_lord_1569.name",
      zhHans: "复合区域领主 1569",
      english: "Composite regional lord 1569",
      sourceNote: "Synthetic role record pending name and title review.",
      context: "Person display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 25
    },
    {
      key: "content.m7.beta.person.supply_agent_1581.name",
      zhHans: "复合补给代理人 1581",
      english: "Composite supply agent 1581",
      sourceNote: "Synthetic role record pending name and title review.",
      context: "Person display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 26
    },
    {
      key: "content.m7.beta.reason.agent_delay.name",
      zhHans: "顾问证据不足。",
      english: "Adviser evidence is incomplete.",
      sourceNote: "AI reason text.",
      context: "Event choice AI reason.",
      characterLimit: 80,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-001-SCOPE"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 27
    },
    {
      key: "content.m7.beta.reason.defer_coercion.name",
      zhHans: "强制迁徙风险需要人类门禁。",
      english: "Forced-movement risk needs a Human Gate.",
      sourceNote: "AI reason text.",
      context: "Event choice AI reason.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-005-EVENT-COSTS"],
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 28
    },
    {
      key: "content.m7.beta.reason.restore_local_rule.name",
      zhHans: "地方义务比直接吞并更可审计。",
      english: "Local obligations are more auditable than direct annexation.",
      sourceNote: "AI reason text.",
      context: "Event choice AI reason.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 29
    },
    {
      key: "content.m7.beta.reason.vassal_settlement.name",
      zhHans: "臣属安排可降低直接治理负荷。",
      english: "Vassal settlement can reduce direct governance load.",
      sourceNote: "AI reason text.",
      context: "Event choice AI reason.",
      characterLimit: 96,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      deterministicOrder: 30
    },
    {
      key: "content.m7.beta.scenario.1531_edge_polity.name",
      zhHans: "1531 边缘政体复合剧本",
      english: "1531 Edge Polity Composite Scenario",
      sourceNote: "Composite scenario name pending formal research.",
      context: "Scenario display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 31
    },
    {
      key: "content.m7.beta.scenario.1569_overextended_suzerainty.name",
      zhHans: "1569 宗主扩张复合剧本",
      english: "1569 Overextended Suzerainty Composite Scenario",
      sourceNote: "Composite scenario name pending formal research.",
      context: "Scenario display name.",
      characterLimit: 84,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 32
    },
    {
      key: "content.m7.beta.scenario.1581_succession_fracture.name",
      zhHans: "1581 继承裂缝复合剧本",
      english: "1581 Succession Fracture Composite Scenario",
      sourceNote: "Composite scenario name pending formal research.",
      context: "Scenario display name.",
      characterLimit: 84,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 33
    },
    {
      key: "content.m7.beta.title.court_agent.name",
      zhHans: "宫廷代理人（待语言审查）",
      english: "Court agent (language review required)",
      sourceNote: "Generic title placeholder.",
      context: "Title display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 34
    },
    {
      key: "content.m7.beta.title.local_governor.name",
      zhHans: "地方治理者（待语言审查）",
      english: "Local governor (language review required)",
      sourceNote: "Generic title placeholder.",
      context: "Title display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 35
    },
    {
      key: "content.m7.beta.title.regional_lord.name",
      zhHans: "区域领主（待语言审查）",
      english: "Regional lord (language review required)",
      sourceNote: "Generic title placeholder.",
      context: "Title display name.",
      characterLimit: 72,
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 36
    }
  ],
  titles: [
    {
      titleId: "title.beta.court-agent",
      localizationKey: "content.m7.beta.title.court_agent.name",
      label: "RESEARCH REQUIRED",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 1
    },
    {
      titleId: "title.beta.local-governor",
      localizationKey: "content.m7.beta.title.local_governor.name",
      label: "RESEARCH REQUIRED",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 2
    },
    {
      titleId: "title.beta.regional-lord",
      localizationKey: "content.m7.beta.title.regional_lord.name",
      label: "RESEARCH REQUIRED",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      deterministicOrder: 3
    }
  ],
  persons: [
    {
      personId: "person.beta.court-broker-1531",
      displayNameKey: "content.m7.beta.person.court_broker_1531.name",
      titleIds: ["title.beta.court-agent"],
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      scenarioIds: ["scenario.beta.1531.edge-polity"],
      roleTag: "court-broker",
      deterministicOrder: 1
    },
    {
      personId: "person.beta.court-broker-1569",
      displayNameKey: "content.m7.beta.person.court_broker_1569.name",
      titleIds: ["title.beta.court-agent"],
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      scenarioIds: ["scenario.beta.1569.overextended-suzerainty"],
      roleTag: "court-broker",
      deterministicOrder: 2
    },
    {
      personId: "person.beta.heir-contender-1581",
      displayNameKey: "content.m7.beta.person.heir_contender_1581.name",
      titleIds: ["title.beta.regional-lord"],
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      scenarioIds: ["scenario.beta.1581.succession-fracture"],
      roleTag: "succession-competitor",
      deterministicOrder: 3
    },
    {
      personId: "person.beta.local-governor-1531",
      displayNameKey: "content.m7.beta.person.local_governor_1531.name",
      titleIds: ["title.beta.local-governor"],
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      scenarioIds: ["scenario.beta.1531.edge-polity"],
      roleTag: "local-governor",
      deterministicOrder: 4
    },
    {
      personId: "person.beta.regional-lord-1569",
      displayNameKey: "content.m7.beta.person.regional_lord_1569.name",
      titleIds: ["title.beta.regional-lord"],
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      scenarioIds: ["scenario.beta.1569.overextended-suzerainty"],
      roleTag: "regional-lord",
      deterministicOrder: 5
    },
    {
      personId: "person.beta.supply-agent-1581",
      displayNameKey: "content.m7.beta.person.supply_agent_1581.name",
      titleIds: ["title.beta.court-agent"],
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "LANGUAGE_REVIEW_REQUIRED",
      owner: "historical_researcher",
      scenarioIds: ["scenario.beta.1581.succession-fracture"],
      roleTag: "supply-agent",
      deterministicOrder: 6
    }
  ],
  events: [
    {
      eventId: "event.beta.agent-council-delay",
      localizationKey: "content.m7.beta.event.agent_council.name",
      label: "COMPOSITE",
      confidence: "MEDIUM",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-003-PERSON-PLACEHOLDER-LIMIT"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      triggerKey: "adviser-evidence-disagreement",
      scenarioIds: [
        "scenario.beta.1531.edge-polity",
        "scenario.beta.1569.overextended-suzerainty",
        "scenario.beta.1581.succession-fracture"
      ],
      personIds: [
        "person.beta.court-broker-1531",
        "person.beta.court-broker-1569",
        "person.beta.supply-agent-1581"
      ],
      titleIds: ["title.beta.court-agent"],
      choices: [
        {
          choiceId: "choice.beta.agent-delay",
          localizationKey: "content.m7.beta.choice.agent_delay.name",
          aiReasonKey: "content.m7.beta.reason.agent_delay.name",
          costSummaryKey: "content.m7.beta.cost.agent_delay.name"
        }
      ],
      violenceCostRecord: null,
      deterministicOrder: 1
    },
    {
      eventId: "event.beta.campaign-window-warning",
      localizationKey: "content.m7.beta.event.campaign_window.name",
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.charney.2004.warfare", "source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      triggerKey: "monsoon-window-risk",
      scenarioIds: ["scenario.beta.1531.edge-polity", "scenario.beta.1569.overextended-suzerainty"],
      personIds: ["person.beta.court-broker-1531", "person.beta.regional-lord-1569"],
      titleIds: ["title.beta.court-agent", "title.beta.regional-lord"],
      choices: [
        {
          choiceId: "choice.beta.agent-delay",
          localizationKey: "content.m7.beta.choice.agent_delay.name",
          aiReasonKey: "content.m7.beta.reason.agent_delay.name",
          costSummaryKey: "content.m7.beta.cost.agent_delay.name"
        }
      ],
      violenceCostRecord: null,
      deterministicOrder: 2
    },
    {
      eventId: "event.beta.coercion-cost-review",
      localizationKey: "content.m7.beta.event.coercion_cost_review.name",
      label: "RESEARCH REQUIRED",
      confidence: "LOW",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-005-EVENT-COSTS"],
      reviewState: "CULTURE_HUMAN_GATE_REQUIRED",
      owner: "historical_researcher",
      triggerKey: "coercive-population-policy-proposed",
      scenarioIds: [
        "scenario.beta.1531.edge-polity",
        "scenario.beta.1569.overextended-suzerainty",
        "scenario.beta.1581.succession-fracture"
      ],
      personIds: [
        "person.beta.local-governor-1531",
        "person.beta.regional-lord-1569",
        "person.beta.heir-contender-1581"
      ],
      titleIds: ["title.beta.local-governor", "title.beta.regional-lord"],
      choices: [
        {
          choiceId: "choice.beta.defer-coercion",
          localizationKey: "content.m7.beta.choice.defer_coercion.name",
          aiReasonKey: "content.m7.beta.reason.defer_coercion.name",
          costSummaryKey: "content.m7.beta.cost.defer_coercion.name"
        }
      ],
      violenceCostRecord: {
        victimGroups: [
          "RESEARCH REQUIRED: affected households and communities must be identified from source-specific evidence"
        ],
        sourceRegions: ["RESEARCH REQUIRED: source region cannot be inferred from modern borders"],
        immediateCosts: [
          "family separation",
          "labor and food-production disruption",
          "loss of local trust"
        ],
        longTermConsequences: [
          "legitimacy loss",
          "relationship damage",
          "recovery delay",
          "Human Gate required before any reward framing"
        ],
        reviewState: "CULTURE_HUMAN_GATE_REQUIRED"
      },
      deterministicOrder: 3
    },
    {
      eventId: "event.beta.postwar-settlement-offer",
      localizationKey: "content.m7.beta.event.postwar_settlement.name",
      label: "COMPOSITE",
      confidence: "MEDIUM",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-006-NO-CULTURE-BUFF"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      triggerKey: "postwar-governance-choice",
      scenarioIds: ["scenario.beta.1531.edge-polity", "scenario.beta.1569.overextended-suzerainty"],
      personIds: ["person.beta.local-governor-1531", "person.beta.regional-lord-1569"],
      titleIds: ["title.beta.local-governor", "title.beta.regional-lord"],
      choices: [
        {
          choiceId: "choice.beta.restore-local-rule",
          localizationKey: "content.m7.beta.choice.restore_local_rule.name",
          aiReasonKey: "content.m7.beta.reason.restore_local_rule.name",
          costSummaryKey: "content.m7.beta.cost.restore_local_rule.name"
        },
        {
          choiceId: "choice.beta.vassal-settlement",
          localizationKey: "content.m7.beta.choice.vassal_settlement.name",
          aiReasonKey: "content.m7.beta.reason.vassal_settlement.name",
          costSummaryKey: "content.m7.beta.cost.vassal_settlement.name"
        }
      ],
      violenceCostRecord: null,
      deterministicOrder: 4
    },
    {
      eventId: "event.beta.succession-warning",
      localizationKey: "content.m7.beta.event.succession_warning.name",
      label: "COMPOSITE",
      confidence: "MEDIUM",
      sourceIds: ["source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "SCHEMA_VALIDATED",
      owner: "historical_researcher",
      triggerKey: "succession-stability-pressure",
      scenarioIds: ["scenario.beta.1581.succession-fracture"],
      personIds: ["person.beta.heir-contender-1581", "person.beta.supply-agent-1581"],
      titleIds: ["title.beta.court-agent", "title.beta.regional-lord"],
      choices: [
        {
          choiceId: "choice.beta.agent-delay",
          localizationKey: "content.m7.beta.choice.agent_delay.name",
          aiReasonKey: "content.m7.beta.reason.agent_delay.name",
          costSummaryKey: "content.m7.beta.cost.agent_delay.name"
        }
      ],
      violenceCostRecord: null,
      deterministicOrder: 5
    }
  ],
  scenarios: [
    {
      scenarioId: "scenario.beta.1531.edge-polity",
      scenarioKey: "beta-1531-edge-polity",
      displayNameKey: "content.m7.beta.scenario.1531_edge_polity.name",
      startYear: 1531,
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.project.docs.16", "source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      personIds: ["person.beta.court-broker-1531", "person.beta.local-governor-1531"],
      titleIds: ["title.beta.court-agent", "title.beta.local-governor"],
      eventIds: [
        "event.beta.agent-council-delay",
        "event.beta.campaign-window-warning",
        "event.beta.coercion-cost-review",
        "event.beta.postwar-settlement-offer"
      ],
      localizationKeys: [
        "content.m7.beta.scenario.1531_edge_polity.name",
        "content.m7.beta.hook.1531.start",
        "content.m7.beta.hook.victory.recognized_order",
        "content.m7.beta.hook.failure.unstable_order",
        "content.m7.beta.hook.tutorial.review_gaps",
        "content.m7.beta.hook.encyclopedia.review_labels"
      ],
      hooks: [
        {
          hookId: "hook.beta.1531.encyclopedia",
          hookKind: "encyclopedia",
          localizationKey: "content.m7.beta.hook.encyclopedia.review_labels",
          targetIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"]
        },
        {
          hookId: "hook.beta.1531.failure",
          hookKind: "failure",
          localizationKey: "content.m7.beta.hook.failure.unstable_order",
          targetIds: ["event.beta.coercion-cost-review"]
        },
        {
          hookId: "hook.beta.1531.start",
          hookKind: "start",
          localizationKey: "content.m7.beta.hook.1531.start",
          targetIds: ["person.beta.court-broker-1531", "person.beta.local-governor-1531"]
        },
        {
          hookId: "hook.beta.1531.tutorial",
          hookKind: "tutorial",
          localizationKey: "content.m7.beta.hook.tutorial.review_gaps",
          targetIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"]
        },
        {
          hookId: "hook.beta.1531.victory",
          hookKind: "victory",
          localizationKey: "content.m7.beta.hook.victory.recognized_order",
          targetIds: ["event.beta.postwar-settlement-offer"]
        }
      ],
      deterministicOrder: 1
    },
    {
      scenarioId: "scenario.beta.1569.overextended-suzerainty",
      scenarioKey: "beta-1569-overextended-suzerainty",
      displayNameKey: "content.m7.beta.scenario.1569_overextended_suzerainty.name",
      startYear: 1569,
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: [
        "source.baker-pasuk.2017.ayutthaya",
        "source.project.docs.16",
        "source.review.m7.baseline"
      ],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      personIds: ["person.beta.court-broker-1569", "person.beta.regional-lord-1569"],
      titleIds: ["title.beta.court-agent", "title.beta.regional-lord"],
      eventIds: [
        "event.beta.agent-council-delay",
        "event.beta.campaign-window-warning",
        "event.beta.coercion-cost-review",
        "event.beta.postwar-settlement-offer"
      ],
      localizationKeys: [
        "content.m7.beta.scenario.1569_overextended_suzerainty.name",
        "content.m7.beta.hook.1569.start",
        "content.m7.beta.hook.victory.recognized_order",
        "content.m7.beta.hook.failure.unstable_order",
        "content.m7.beta.hook.tutorial.review_gaps",
        "content.m7.beta.hook.encyclopedia.review_labels"
      ],
      hooks: [
        {
          hookId: "hook.beta.1569.encyclopedia",
          hookKind: "encyclopedia",
          localizationKey: "content.m7.beta.hook.encyclopedia.review_labels",
          targetIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"]
        },
        {
          hookId: "hook.beta.1569.failure",
          hookKind: "failure",
          localizationKey: "content.m7.beta.hook.failure.unstable_order",
          targetIds: ["event.beta.coercion-cost-review"]
        },
        {
          hookId: "hook.beta.1569.start",
          hookKind: "start",
          localizationKey: "content.m7.beta.hook.1569.start",
          targetIds: ["person.beta.court-broker-1569", "person.beta.regional-lord-1569"]
        },
        {
          hookId: "hook.beta.1569.tutorial",
          hookKind: "tutorial",
          localizationKey: "content.m7.beta.hook.tutorial.review_gaps",
          targetIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"]
        },
        {
          hookId: "hook.beta.1569.victory",
          hookKind: "victory",
          localizationKey: "content.m7.beta.hook.victory.recognized_order",
          targetIds: ["event.beta.postwar-settlement-offer"]
        }
      ],
      deterministicOrder: 2
    },
    {
      scenarioId: "scenario.beta.1581.succession-fracture",
      scenarioKey: "beta-1581-succession-fracture",
      displayNameKey: "content.m7.beta.scenario.1581_succession_fracture.name",
      startYear: 1581,
      label: "COMPOSITE",
      confidence: "LOW",
      sourceIds: ["source.project.docs.16", "source.review.m7.baseline"],
      claimIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"],
      reviewState: "RESEARCH REQUIRED",
      owner: "historical_researcher",
      personIds: ["person.beta.heir-contender-1581", "person.beta.supply-agent-1581"],
      titleIds: ["title.beta.court-agent", "title.beta.regional-lord"],
      eventIds: [
        "event.beta.agent-council-delay",
        "event.beta.coercion-cost-review",
        "event.beta.succession-warning"
      ],
      localizationKeys: [
        "content.m7.beta.scenario.1581_succession_fracture.name",
        "content.m7.beta.hook.1581.start",
        "content.m7.beta.hook.victory.recognized_order",
        "content.m7.beta.hook.failure.unstable_order",
        "content.m7.beta.hook.tutorial.review_gaps",
        "content.m7.beta.hook.encyclopedia.review_labels"
      ],
      hooks: [
        {
          hookId: "hook.beta.1581.encyclopedia",
          hookKind: "encyclopedia",
          localizationKey: "content.m7.beta.hook.encyclopedia.review_labels",
          targetIds: ["HIST-M7-FILL-002-SCENARIO-ANCHORS"]
        },
        {
          hookId: "hook.beta.1581.failure",
          hookKind: "failure",
          localizationKey: "content.m7.beta.hook.failure.unstable_order",
          targetIds: ["event.beta.coercion-cost-review"]
        },
        {
          hookId: "hook.beta.1581.start",
          hookKind: "start",
          localizationKey: "content.m7.beta.hook.1581.start",
          targetIds: ["person.beta.heir-contender-1581", "person.beta.supply-agent-1581"]
        },
        {
          hookId: "hook.beta.1581.tutorial",
          hookKind: "tutorial",
          localizationKey: "content.m7.beta.hook.tutorial.review_gaps",
          targetIds: ["HIST-M7-FILL-004-TITLES-LANGUAGE-BLOCK"]
        },
        {
          hookId: "hook.beta.1581.victory",
          hookKind: "victory",
          localizationKey: "content.m7.beta.hook.victory.recognized_order",
          targetIds: ["event.beta.succession-warning"]
        }
      ],
      deterministicOrder: 3
    }
  ],
  knownGaps: [
    "BLOCKED: formal content lock remains M7-CONTENT-LOCK-ACCEPTANCE-001 Human Gate.",
    "RESEARCH REQUIRED: page-verified real person names, titles, aliases, transliterations, relationships, and dates are not supplied by this fill.",
    "RESEARCH REQUIRED: exact 1531, 1569, and 1581 scenario chronology and participants require source-specific claim records.",
    "CULTURE_HUMAN_GATE_REQUIRED: coercion, forced movement, slavery, famine, religious-conflict, sacred-symbol, or identity-risk content cannot be accepted from this fill."
  ]
} as const;

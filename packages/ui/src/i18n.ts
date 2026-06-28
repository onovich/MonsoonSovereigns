export type ClientLocalePreference = "system" | "en-US" | "zh-CN";
export type ClientResolvedLocale = Exclude<ClientLocalePreference, "system">;

export const CLIENT_LOCALE_PREFERENCES = ["system", "en-US", "zh-CN"] as const;
export const CLIENT_RESOLVED_LOCALES = ["en-US", "zh-CN"] as const;
export const ENGLISH_CANONICAL_LOCALE = "en-US";
export const SIMPLIFIED_CHINESE_CANONICAL_LOCALE = "zh-CN";
export const SUPPORTED_CLIENT_LOCALE_FAMILIES = {
  en: ENGLISH_CANONICAL_LOCALE,
  zh: SIMPLIFIED_CHINESE_CANONICAL_LOCALE
} as const;

const enUSMessages = {
  "app.title": "Monsoon Sovereigns",
  "app.shellLabel": "Monsoon Sovereigns client shell",
  "shell.topStatus.label": "Court and campaign status",
  "shell.currentSeason.label": "Season",
  "shell.currentSeason.value": "Monsoon watch",
  "shell.currentDay.label": "Day",
  "shell.currentDay.value": "Day {day}",
  "shell.resources.label": "Stores",
  "shell.resources.value": "{grain} grain / {cash} cash",
  "shell.muster.label": "Muster",
  "shell.muster.value": "{assembled} of {promised} assembled",
  "shell.mapRegion.label": "Map region",
  "shell.mapTitle": "Realm Map",
  "shell.mapSummary": "Read-model map for districts, routes, and seasonal pressure.",
  "shell.mapLegend.label": "Map legend",
  "shell.mapLegend.selected": "Selected district",
  "shell.mapLegend.routes": "Route layer",
  "shell.mapLegend.season": "Season layer",
  "shell.inspector.label": "Selected district inspector",
  "shell.inspector.title": "District Inspector",
  "shell.inspector.emptyTitle": "No District Selected",
  "shell.inspector.emptyText": "Select a district on the map or from the route queue.",
  "shell.inspector.population": "Population",
  "shell.inspector.labor": "Labor",
  "shell.inspector.grain": "Grain",
  "shell.inspector.cash": "Cash",
  "shell.inspector.route": "Route",
  "shell.inspector.settlement": "Settlement",
  "shell.inspector.governance": "Governance",
  "shell.inspector.availableCommitted": "{available} available / {committed} committed",
  "shell.inspector.stockHarvest": "{stock} stock / {harvest} harvest",
  "shell.inspector.stockMobilized": "{stock} stock / {mobilized} mobilized",
  "shell.objectives.label": "Objectives and actions",
  "shell.objectives.title": "Current Objective",
  "shell.objectives.emptyTitle": "Guidance Unavailable",
  "shell.objectives.emptyText": "No player guidance is available from the current read model.",
  "shell.objectives.errorTitle": "Guidance Needs Review",
  "shell.objectives.errorText": "The guidance read model is present but marked for review.",
  "shell.objectives.defaultText":
    "Stabilize the court, inspect vulnerable districts, and prepare any campaign only when supply and obligations can support it.",
  "shell.objectives.nextStep": "Recommended next step",
  "shell.objectives.reviewDistrict": "Review selected district",
  "shell.objectives.appointment": "Review appointments",
  "shell.objectives.campaign": "Review campaign supply",
  "shell.objectives.advance": "Advance cautiously",
  "shell.actions.label": "Player action queue",
  "shell.actions.previewAppointment": "Preview Appointment",
  "shell.actions.previewCampaign": "Preview Campaign",
  "shell.actions.reviewObligations": "Review Obligations",
  "shell.actions.statusReady": "Ready",
  "shell.actions.statusBlocked": "Blocked",
  "shell.notifications.label": "Notices",
  "shell.notifications.obligation": "Obligations need attention before long campaigns.",
  "shell.notifications.supply": "Supply forecast shows route and season risk.",
  "shell.notifications.contentReview": "Some cultural and language content remains under review.",
  "shell.settings.label": "Settings",
  "shell.settings.title": "Settings",
  "shell.debug.toggle": "Developer Overlay",
  "shell.debug.show": "Show developer overlay",
  "shell.debug.hide": "Hide developer overlay",
  "shell.debug.label": "Developer diagnostics overlay",
  "shell.debug.title": "Developer Overlay",
  "shell.debug.description":
    "Diagnostics are separated from player mode and may include revisions, hashes, raw codes, and fixture labels.",
  "shell.debug.hiddenNotice": "Developer diagnostics are hidden in player mode.",
  "shell.debug.revision": "Revision",
  "shell.debug.hash": "State hash",
  "shell.debug.fixture": "Read-model fixture",
  "shell.list.label": "Route queue",
  "shell.list.title": "Route Queue",
  "shell.list.filter": "Filter",
  "shell.list.placeholder": "District, phase, route",
  "shell.list.performance": "List derivation time",
  "shell.list.virtualRowsLabel": "Virtualized district rows",
  "shell.table.district": "District",
  "shell.table.population": "Population",
  "shell.table.labor": "Labor",
  "shell.table.grain": "Grain",
  "shell.table.cash": "Cash",
  "shell.table.route": "Route",
  "shell.table.sortButtonLabel": "Sort by {label}",
  "shell.table.sortButtonActiveLabel": "Sort by {label}, currently {direction}",
  "shell.table.sortDirection.ascending": "ascending",
  "shell.table.sortDirection.descending": "descending",
  "shell.route.reachable": "Reachable",
  "shell.route.capacityExceeded": "Capacity strained",
  "shell.route.unreachable": "Unreachable",
  "shell.route.summaryReachable": "{status}; {kinds}; cost {cost}; bottleneck {capacity}",
  "shell.route.summaryUnreachable": "{status}; no active route",
  "shell.district.name": "District {number}",
  "shell.settlement.name": "Market settlement",
  "shell.season.fallow": "Fallow",
  "shell.season.planting": "Planting",
  "shell.season.growing": "Growing",
  "shell.season.harvest": "Harvest",
  "shell.command.m3Ready": "Appointment request prepared.",
  "shell.command.m4Ready": "Campaign request prepared.",
  "shell.command.m5Ready": "Slice command confirmed.",
  "shell.command.m6Ready": "Alpha command submitted.",
  "map.projectionLabel": "Map read model projection",
  "map.controlsLabel": "Map controls",
  "map.modeLabel": "Map mode",
  "map.modeButtonLabel": "{label} map mode",
  "map.mode.seasonal": "Seasonal",
  "map.mode.economy": "Economy",
  "map.mode.routes": "Routes",
  "map.zoomLabel": "Map zoom",
  "map.zoomOut": "Zoom out",
  "map.zoomIn": "Zoom in",
  "map.zoomLevel": "Map zoom level",
  "map.revision": "Revision {revision}",
  "map.selection.empty": "No district selected",
  "map.keyboardHelp":
    "Use arrow keys, Home, and End to move the selected district through the map read model.",
  "map.selectedDistrictStatus": "Selected map district: {district}.",
  "map.roleDescription": "keyboard navigable map read model",
  "map.rendererFailed": "Map renderer failed to mount.",
  "settings.language.label": "Language",
  "settings.language.system": "System",
  "settings.language.enUS": "English",
  "settings.language.zhCN": "Simplified Chinese",
  "settings.language.active": "Using {locale}",
  "reason.listLabel": "Reasons",
  "reason.appointment.localClaimant": "Local claimant advantage",
  "reason.office.eligibilityFailed": "Office eligibility failed",
  "reason.character.unavailable": "Candidate unavailable",
  "reason.office.primaryConflict": "Primary office conflict",
  "reason.obligation.tributeRegular": "Regular tribute obligation",
  "reason.enfeoffment.localHolder": "Local holder settlement",
  "reason.route.monsoonRisk": "Monsoon route risk",
  "reason.withdrawal.supplyCollapse": "Withdrawal from supply collapse",
  "reason.ai.withdrawSupplyCollapse": "AI withdraws because supply collapsed",
  "reason.postwar.candidateReady": "Postwar candidate ready",
  "reason.postwar.restoreVassalRuler": "Restore vassal ruler option",
  "reason.campaign.deterministicReplay": "Deterministic replay campaign reason",
  "reason.m5.duplicatePostwarGovernance": "Duplicate postwar governance blocked",
  "reason.m6.adviserRecognizedOrderReady": "Adviser sees recognized order path ready",
  "reason.m6.noCheckpoint": "No client checkpoint",
  "reason.m6.commandNone": "No Alpha command submitted",
  "reason.m7.reviewStateVisible": "Review state visible",
  "reason.manualNodeBattleDeferred": "Manual node battle deferred",
  "reason.languageReviewRequired": "Language review required",
  "reason.cultureHumanGateRequired": "Culture human gate required"
} as const;

export type UiMessageKey = keyof typeof enUSMessages;
type UiCatalog = Record<UiMessageKey, string>;

const zhCNMessages: UiCatalog = {
  "app.title": "季风诸王",
  "app.shellLabel": "季风诸王客户端界面",
  "shell.topStatus.label": "宫廷与战役状态",
  "shell.currentSeason.label": "季节",
  "shell.currentSeason.value": "季风观察",
  "shell.currentDay.label": "日期",
  "shell.currentDay.value": "第 {day} 日",
  "shell.resources.label": "库存",
  "shell.resources.value": "{grain} 粮 / {cash} 现金",
  "shell.muster.label": "集结",
  "shell.muster.value": "{assembled} / {promised} 已到位",
  "shell.mapRegion.label": "地图区域",
  "shell.mapTitle": "领地地图",
  "shell.mapSummary": "展示地区、路线与季节压力的只读模型地图。",
  "shell.mapLegend.label": "地图图例",
  "shell.mapLegend.selected": "已选地区",
  "shell.mapLegend.routes": "路线图层",
  "shell.mapLegend.season": "季节图层",
  "shell.inspector.label": "已选地区详情",
  "shell.inspector.title": "地区详情",
  "shell.inspector.emptyTitle": "未选择地区",
  "shell.inspector.emptyText": "请在地图或路线队列中选择一个地区。",
  "shell.inspector.population": "人口",
  "shell.inspector.labor": "劳力",
  "shell.inspector.grain": "粮食",
  "shell.inspector.cash": "现金",
  "shell.inspector.route": "路线",
  "shell.inspector.settlement": "聚落",
  "shell.inspector.governance": "治理",
  "shell.inspector.availableCommitted": "{available} 可用 / {committed} 已投入",
  "shell.inspector.stockHarvest": "{stock} 库存 / {harvest} 收获",
  "shell.inspector.stockMobilized": "{stock} 库存 / {mobilized} 动员成本",
  "shell.objectives.label": "目标与行动",
  "shell.objectives.title": "当前目标",
  "shell.objectives.emptyTitle": "暂无指引",
  "shell.objectives.emptyText": "当前只读模型没有可显示的玩家指引。",
  "shell.objectives.errorTitle": "指引需要复核",
  "shell.objectives.errorText": "指引只读模型存在，但当前标记为需要复核。",
  "shell.objectives.defaultText": "稳定宫廷，检查脆弱地区；只有在补给与义务能够支撑时才准备战役。",
  "shell.objectives.nextStep": "建议下一步",
  "shell.objectives.reviewDistrict": "查看已选地区",
  "shell.objectives.appointment": "查看任命",
  "shell.objectives.campaign": "查看战役补给",
  "shell.objectives.advance": "谨慎推进",
  "shell.actions.label": "玩家行动队列",
  "shell.actions.previewAppointment": "预览任命",
  "shell.actions.previewCampaign": "预览战役",
  "shell.actions.reviewObligations": "查看义务",
  "shell.actions.statusReady": "可执行",
  "shell.actions.statusBlocked": "受阻",
  "shell.notifications.label": "通知",
  "shell.notifications.obligation": "长期战役前需要先处理义务压力。",
  "shell.notifications.supply": "补给预测显示路线与季节风险。",
  "shell.notifications.contentReview": "部分文化与语言内容仍在复核。",
  "shell.settings.label": "设置",
  "shell.settings.title": "设置",
  "shell.debug.toggle": "开发覆盖层",
  "shell.debug.show": "显示开发覆盖层",
  "shell.debug.hide": "隐藏开发覆盖层",
  "shell.debug.label": "开发诊断覆盖层",
  "shell.debug.title": "开发覆盖层",
  "shell.debug.description": "诊断信息与玩家模式分离，可能包含修订、哈希、原始代码与测试标签。",
  "shell.debug.hiddenNotice": "玩家模式已隐藏开发诊断。",
  "shell.debug.revision": "修订",
  "shell.debug.hash": "状态哈希",
  "shell.debug.fixture": "只读模型来源",
  "shell.list.label": "路线队列",
  "shell.list.title": "路线队列",
  "shell.list.filter": "筛选",
  "shell.list.placeholder": "地区、阶段、路线",
  "shell.list.performance": "列表派生耗时",
  "shell.list.virtualRowsLabel": "虚拟化地区行",
  "shell.table.district": "地区",
  "shell.table.population": "人口",
  "shell.table.labor": "劳力",
  "shell.table.grain": "粮食",
  "shell.table.cash": "现金",
  "shell.table.route": "路线",
  "shell.table.sortButtonLabel": "按{label}排序",
  "shell.table.sortButtonActiveLabel": "按{label}排序，当前{direction}",
  "shell.table.sortDirection.ascending": "升序",
  "shell.table.sortDirection.descending": "降序",
  "shell.route.reachable": "可达",
  "shell.route.capacityExceeded": "容量紧张",
  "shell.route.unreachable": "不可达",
  "shell.route.summaryReachable": "{status}；{kinds}；成本 {cost}；瓶颈 {capacity}",
  "shell.route.summaryUnreachable": "{status}；暂无可用路线",
  "shell.district.name": "第 {number} 地区",
  "shell.settlement.name": "集镇聚落",
  "shell.season.fallow": "休耕",
  "shell.season.planting": "播种",
  "shell.season.growing": "生长",
  "shell.season.harvest": "收获",
  "shell.command.m3Ready": "任命请求已准备。",
  "shell.command.m4Ready": "战役请求已准备。",
  "shell.command.m5Ready": "切片命令已确认。",
  "shell.command.m6Ready": "Alpha 命令已提交。",
  "map.projectionLabel": "地图只读模型投影",
  "map.controlsLabel": "地图控制",
  "map.modeLabel": "地图模式",
  "map.modeButtonLabel": "{label}地图模式",
  "map.mode.seasonal": "季节",
  "map.mode.economy": "经济",
  "map.mode.routes": "路线",
  "map.zoomLabel": "地图缩放",
  "map.zoomOut": "缩小",
  "map.zoomIn": "放大",
  "map.zoomLevel": "地图缩放级别",
  "map.revision": "修订 {revision}",
  "map.selection.empty": "未选择地区",
  "map.keyboardHelp": "使用方向键、Home 和 End 在地图只读模型中移动已选地区。",
  "map.selectedDistrictStatus": "已选地图地区：{district}。",
  "map.roleDescription": "可键盘导航的地图只读模型",
  "map.rendererFailed": "地图渲染器挂载失败。",
  "settings.language.label": "语言",
  "settings.language.system": "跟随系统",
  "settings.language.enUS": "English",
  "settings.language.zhCN": "简体中文",
  "settings.language.active": "当前使用 {locale}",
  "reason.listLabel": "原因",
  "reason.appointment.localClaimant": "本地声索者优势",
  "reason.office.eligibilityFailed": "不符合职位条件",
  "reason.character.unavailable": "候选人不可用",
  "reason.office.primaryConflict": "主要职位冲突",
  "reason.obligation.tributeRegular": "定期贡赋义务",
  "reason.enfeoffment.localHolder": "本地持有人安置",
  "reason.route.monsoonRisk": "季风路线风险",
  "reason.withdrawal.supplyCollapse": "补给崩溃导致撤退",
  "reason.ai.withdrawSupplyCollapse": "AI 因补给崩溃而撤退",
  "reason.postwar.candidateReady": "战后候选方案已就绪",
  "reason.postwar.restoreVassalRuler": "恢复臣属统治者方案",
  "reason.campaign.deterministicReplay": "确定性回放战役原因",
  "reason.m5.duplicatePostwarGovernance": "已阻止重复战后治理",
  "reason.m6.adviserRecognizedOrderReady": "顾问认为承认秩序路径已就绪",
  "reason.m6.noCheckpoint": "没有客户端检查点",
  "reason.m6.commandNone": "尚未提交 Alpha 命令",
  "reason.m7.reviewStateVisible": "复核状态可见",
  "reason.manualNodeBattleDeferred": "手动节点会战已推迟",
  "reason.languageReviewRequired": "需要语言复核",
  "reason.cultureHumanGateRequired": "需要文化 Human Gate"
};

const catalogs: Record<ClientResolvedLocale, UiCatalog> = {
  "en-US": enUSMessages,
  "zh-CN": zhCNMessages
};

const reasonCodeMessageKeys: Readonly<Record<string, UiMessageKey>> = {
  "appointment.local-claimant": "reason.appointment.localClaimant",
  "office-eligibility-failed": "reason.office.eligibilityFailed",
  "character-unavailable": "reason.character.unavailable",
  "office-primary-conflict": "reason.office.primaryConflict",
  "obligation.tribute.regular": "reason.obligation.tributeRegular",
  "enfeoffment.local-holder": "reason.enfeoffment.localHolder",
  "route.season.monsoon-risk": "reason.route.monsoonRisk",
  "withdrawal.reason.supply-collapse": "reason.withdrawal.supplyCollapse",
  "m4.ai.withdraw.supply-collapse": "reason.ai.withdrawSupplyCollapse",
  "postwar.candidate.ready": "reason.postwar.candidateReady",
  "restore-vassal-ruler": "reason.postwar.restoreVassalRuler",
  "campaign.reason.deterministic-replay": "reason.campaign.deterministicReplay",
  "m5.slice.duplicate-postwar-governance": "reason.m5.duplicatePostwarGovernance",
  "m6.adviser.recognized-order-ready": "reason.m6.adviserRecognizedOrderReady",
  "m6.save.no-client-checkpoint": "reason.m6.noCheckpoint",
  "m6.command.no-alpha-command-submitted": "reason.m6.commandNone",
  "m7.guidance.review-state-visible": "reason.m7.reviewStateVisible",
  DEFER_MANUAL_NODE_BATTLE: "reason.manualNodeBattleDeferred",
  LANGUAGE_REVIEW_REQUIRED: "reason.languageReviewRequired",
  CULTURE_HUMAN_GATE_REQUIRED: "reason.cultureHumanGateRequired"
};

const zhReasonTokenLabels: Readonly<Record<string, string>> = {
  ai: "AI",
  alpha: "Alpha",
  beta: "Beta",
  appointment: "任命",
  campaign: "战役",
  candidate: "候选方案",
  character: "人物",
  checkpoint: "检查点",
  command: "命令",
  content: "内容",
  culture: "文化",
  deterministic: "确定性",
  failed: "失败",
  gate: "门禁",
  governance: "治理",
  human: "Human",
  language: "语言",
  legitimacy: "合法性",
  local: "本地",
  manual: "手动",
  monsoon: "季风",
  node: "节点",
  obligation: "义务",
  office: "职位",
  postwar: "战后",
  reason: "原因",
  recognized: "已承认",
  replay: "回放",
  required: "需要",
  review: "复核",
  route: "路线",
  season: "季节",
  slice: "切片",
  state: "状态",
  succession: "继承",
  supply: "补给",
  visible: "可见",
  withdraw: "撤退",
  withdrawal: "撤退"
};

export type ClientI18n = {
  readonly locale: ClientResolvedLocale;
  readonly t: (key: UiMessageKey, replacements?: Readonly<Record<string, string>>) => string;
  readonly formatNumber: (value: number) => string;
  readonly formatReasonCode: (reasonCode: string) => string;
};

export function createClientI18n(locale: ClientResolvedLocale): ClientI18n {
  const catalog = catalogs[locale];
  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });

  function t(key: UiMessageKey, replacements: Readonly<Record<string, string>> = {}): string {
    let text = catalog[key];
    for (const [name, value] of Object.entries(replacements)) {
      text = text.replaceAll(`{${name}}`, value);
    }
    return text;
  }

  return {
    locale,
    t,
    formatNumber: (value) => numberFormatter.format(value),
    formatReasonCode: (reasonCode) => {
      const key = reasonCodeMessageKeys[reasonCode];
      if (key !== undefined) {
        return t(key);
      }
      return formatUnknownReasonCode(reasonCode, locale);
    }
  };
}

export const DEFAULT_CLIENT_I18N = createClientI18n("en-US");

export function parseClientLocalePreference(value: string | null): ClientLocalePreference | null {
  if (value === null) {
    return null;
  }
  const normalized = value.trim();
  if (normalized.toLowerCase() === "system") {
    return "system";
  }
  return normalizeClientLocaleTag(normalized);
}

export function normalizeClientLocaleTag(value: string): ClientResolvedLocale | null {
  const normalized = value.trim().toLowerCase();
  const languageFamily = normalized.split("-")[0];
  if (languageFamily === "en") {
    return ENGLISH_CANONICAL_LOCALE;
  }
  if (languageFamily === "zh") {
    return SIMPLIFIED_CHINESE_CANONICAL_LOCALE;
  }
  return null;
}

export function resolveClientLocale(input: {
  readonly preference: ClientLocalePreference;
  readonly systemLocales: readonly string[];
}): ClientResolvedLocale {
  if (input.preference !== "system") {
    return input.preference;
  }
  for (const locale of input.systemLocales) {
    const resolved = normalizeClientLocaleTag(locale);
    if (resolved !== null) {
      return resolved;
    }
  }
  return "en-US";
}

export function isBareReasonCodeLike(value: string): boolean {
  return /(?:^|\s)(?:[a-z][a-z0-9]*[.:_-]){1,}[a-z0-9-]+(?:\s|$)/u.test(value);
}

function formatUnknownReasonCode(reasonCode: string, locale: ClientResolvedLocale): string {
  const tokens = reasonCode
    .split(/[.:_-]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
  if (tokens.length === 0) {
    return locale === "zh-CN" ? "未命名原因" : "Unnamed reason";
  }
  if (locale === "zh-CN") {
    return tokens
      .map((token) => zhReasonTokenLabels[token.toLowerCase()] ?? titleCaseReasonToken(token))
      .join(" ");
  }
  return tokens.map(titleCaseReasonToken).join(" ");
}

function titleCaseReasonToken(token: string): string {
  if (/^m[0-9]+$/u.test(token) || token.toUpperCase() === token) {
    return token.toUpperCase();
  }
  return `${token.slice(0, 1).toUpperCase()}${token.slice(1)}`;
}

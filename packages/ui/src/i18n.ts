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
  "map.projectionLabel": "Map read model projection",
  "map.controlsLabel": "Map controls",
  "map.modeLabel": "Map mode",
  "map.mode.seasonal": "Seasonal",
  "map.mode.economy": "Economy",
  "map.mode.routes": "Routes",
  "map.zoomLabel": "Map zoom",
  "map.zoomOut": "Zoom out",
  "map.zoomIn": "Zoom in",
  "map.zoomLevel": "Map zoom level",
  "map.revision": "Revision {revision}",
  "map.selection.empty": "No district selected",
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
  "map.projectionLabel": "地图只读模型投影",
  "map.controlsLabel": "地图控制",
  "map.modeLabel": "地图模式",
  "map.mode.seasonal": "季节",
  "map.mode.economy": "经济",
  "map.mode.routes": "路线",
  "map.zoomLabel": "地图缩放",
  "map.zoomOut": "缩小",
  "map.zoomIn": "放大",
  "map.zoomLevel": "地图缩放级别",
  "map.revision": "修订 {revision}",
  "map.selection.empty": "未选择地区",
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
  "reason.postwar.candidateReady": "战后候选方案就绪",
  "reason.postwar.restoreVassalRuler": "恢复臣属统治者方案",
  "reason.campaign.deterministicReplay": "确定性回放战役原因",
  "reason.m5.duplicatePostwarGovernance": "阻止重复战后治理",
  "reason.m6.adviserRecognizedOrderReady": "顾问判断承认秩序路径已就绪",
  "reason.m6.noCheckpoint": "没有客户端检查点",
  "reason.m6.commandNone": "尚未提交 Alpha 命令",
  "reason.m7.reviewStateVisible": "审查状态可见",
  "reason.manualNodeBattleDeferred": "手动节点会战已推迟",
  "reason.languageReviewRequired": "需要语言审查",
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
  m1: "M1",
  m2: "M2",
  m3: "M3",
  m4: "M4",
  m5: "M5",
  m6: "M6",
  m7: "M7",
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
  review: "审查",
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

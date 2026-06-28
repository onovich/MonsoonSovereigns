import type { ReactElement } from "react";

import {
  CLIENT_ASSET_REPLACEMENT_SLOTS,
  CLIENT_ASSET_SLOT_PLACEHOLDER_NOTE,
  type ClientAssetReplacementSlot
} from "./asset-slots";
import {
  CLIENT_DESIGN_TOKENS,
  CLIENT_SEMANTIC_STATES,
  type ClientDesignTokens,
  type ClientSemanticState
} from "./design-tokens";
import type { ClientResolvedLocale } from "./i18n";

export type DesignTokenAssetSlotsEvidenceState = "normal" | "empty" | "error" | "extreme";

export interface DesignTokenAssetSlotsViewProps {
  readonly locale?: ClientResolvedLocale;
  readonly debugMode?: boolean;
  readonly evidenceState?: DesignTokenAssetSlotsEvidenceState;
  readonly tokens?: ClientDesignTokens;
  readonly assetSlots?: readonly ClientAssetReplacementSlot[];
}

const ENGLISH_STRESS_TEXT =
  "Review route capacity, obligations, succession risk, appointment eligibility, warning alerts, and language settings before confirming the command.";
const CHINESE_STRESS_TEXT =
  "在确认命令前，请检查路线容量、义务、继承风险、任命资格、警告提示与语言设置。";

const stateLabels: Readonly<
  Record<ClientResolvedLocale, Readonly<Record<ClientSemanticState, string>>>
> = {
  "en-US": {
    enabled: "Enabled",
    disabled: "Disabled",
    warning: "Warning",
    success: "Success",
    danger: "Danger",
    debug: "Debug"
  },
  "zh-CN": {
    enabled: "可用",
    disabled: "不可用",
    warning: "警告",
    success: "成功",
    danger: "危险",
    debug: "调试"
  }
};

export function DesignTokenAssetSlotsView({
  locale = "en-US",
  debugMode = false,
  evidenceState = "normal",
  tokens = CLIENT_DESIGN_TOKENS,
  assetSlots = CLIENT_ASSET_REPLACEMENT_SLOTS
}: DesignTokenAssetSlotsViewProps): ReactElement {
  const labels = localizedLabels(locale);
  const visibleSlots = evidenceState === "empty" ? [] : assetSlots;
  const hasError = evidenceState === "error";
  const stressText = locale === "zh-CN" ? CHINESE_STRESS_TEXT : ENGLISH_STRESS_TEXT;

  return (
    <section
      className="m7-design-tokens"
      aria-label={labels.rootLabel}
      data-debug-mode={debugMode ? "on" : "off"}
      data-evidence-state={evidenceState}
      data-placeholder-policy="neutral-placeholders-only"
      data-final-art-approved="false"
    >
      <header className="m7-design-tokens__header">
        <div>
          <h2>{labels.title}</h2>
          <p>{stressText}</p>
        </div>
        <dl className="m7-design-tokens__facts" aria-label={labels.summaryLabel}>
          <TokenFact label={labels.localeLabel} value={locale} />
          <TokenFact
            label={labels.debugLabel}
            value={debugMode ? labels.debugOn : labels.debugOff}
          />
          <TokenFact label={labels.slotCountLabel} value={visibleSlots.length.toString()} />
          <TokenFact label={labels.placeholderLabel} value={CLIENT_ASSET_SLOT_PLACEHOLDER_NOTE} />
        </dl>
      </header>

      {hasError ? (
        <section className="m7-design-tokens__panel" role="alert" aria-label={labels.errorLabel}>
          <h3>{labels.errorTitle}</h3>
          <p>{labels.errorText}</p>
        </section>
      ) : null}

      <section className="m7-design-tokens__panel" aria-label={labels.semanticLabel}>
        <h3>{labels.semanticTitle}</h3>
        <div className="m7-design-tokens__state-grid" role="list">
          {CLIENT_SEMANTIC_STATES.map((state) => (
            <SemanticStateCard key={state} label={stateLabels[locale][state]} state={state} />
          ))}
        </div>
      </section>

      <section className="m7-design-tokens__grid">
        <TokenGroupPanel
          title={labels.colorTitle}
          entries={[
            ["surface.ink", tokens.colors.surface.ink],
            ["surface.paper", tokens.colors.surface.paper],
            ["accent.river", tokens.colors.accent.river],
            ["accent.copper", tokens.colors.accent.copper],
            ["semantic.danger", tokens.colors.semantic.danger],
            ["mapLayer.routeBlocked", tokens.colors.mapLayer.routeBlocked]
          ]}
        />
        <TokenGroupPanel
          title={labels.layoutTitle}
          entries={[
            ["spacing.px8", tokens.spacing.px8],
            ["spacing.px14", tokens.spacing.px14],
            ["spacing.px22", tokens.spacing.px22],
            ["radius.control", tokens.radius.control],
            ["border.hairline", tokens.border.hairline],
            ["elevation.popover", tokens.elevation.popover]
          ]}
        />
        <TokenGroupPanel
          title={labels.typographyTitle}
          entries={[
            ["typography.size.label", tokens.typography.size.label],
            ["typography.size.body", tokens.typography.size.body],
            ["typography.size.screenTitle", tokens.typography.size.screenTitle],
            ["typography.weight.heavy", tokens.typography.weight.heavy],
            ["typography.lineHeight.body", tokens.typography.lineHeight.body],
            ["typography.family.ui", tokens.typography.family.ui]
          ]}
        />
      </section>

      <section className="m7-design-tokens__panel" aria-label={labels.assetSlotsLabel}>
        <h3>{labels.assetSlotsTitle}</h3>
        {visibleSlots.length === 0 ? (
          <p className="m7-design-tokens__empty">{labels.emptyText}</p>
        ) : (
          <div className="m7-design-tokens__slot-grid" role="list">
            {visibleSlots.map((slot) => (
              <AssetSlotCard key={slot.id} slot={slot} locale={locale} />
            ))}
          </div>
        )}
      </section>

      <section className="m7-design-tokens__panel" aria-label={labels.debugPanelLabel}>
        <h3>{debugMode ? labels.debugOnTitle : labels.debugOffTitle}</h3>
        <p>
          {debugMode
            ? "raw slot ids and review gates are visible for development evidence only"
            : "player mode hides raw slot ids, milestone labels, and final-art workflow details"}
        </p>
      </section>
    </section>
  );
}

function SemanticStateCard({
  label,
  state
}: {
  readonly label: string;
  readonly state: ClientSemanticState;
}): ReactElement {
  const token = CLIENT_DESIGN_TOKENS.state[state];
  return (
    <div
      className="m7-design-tokens__state"
      data-semantic-state={state}
      role="listitem"
      style={{
        background: token.background,
        borderColor: token.border,
        color: token.text
      }}
    >
      <strong>{label}</strong>
      <span>{state}</span>
    </div>
  );
}

function TokenGroupPanel({
  title,
  entries
}: {
  readonly title: string;
  readonly entries: readonly (readonly [string, string])[];
}): ReactElement {
  return (
    <section className="m7-design-tokens__panel">
      <h3>{title}</h3>
      <dl className="m7-design-tokens__token-list">
        {entries.map(([name, value]) => (
          <TokenFact key={name} label={name} value={value} />
        ))}
      </dl>
    </section>
  );
}

function AssetSlotCard({
  slot,
  locale
}: {
  readonly slot: ClientAssetReplacementSlot;
  readonly locale: ClientResolvedLocale;
}): ReactElement {
  const statusText =
    slot.status.kind === "neutral-placeholder"
      ? `${localizedLabels(locale).placeholderStatus}: ${slot.status.placeholderToken}`
      : `approved final art: ${slot.status.assetId}`;
  return (
    <article
      className="m7-design-tokens__slot"
      data-slot-id={slot.id}
      data-slot-category={slot.category}
      data-slot-status={slot.status.kind}
      role="listitem"
    >
      <strong>{slot.label}</strong>
      <span>{slot.category}</span>
      <span>{statusText}</span>
      <span>{slot.replacementContract.sizing}</span>
      <span>{slot.reviewGates.join(", ")}</span>
    </article>
  );
}

function TokenFact({
  label,
  value
}: {
  readonly label: string;
  readonly value: string;
}): ReactElement {
  return (
    <div className="m7-design-tokens__fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function localizedLabels(locale: ClientResolvedLocale): {
  readonly rootLabel: string;
  readonly title: string;
  readonly summaryLabel: string;
  readonly localeLabel: string;
  readonly debugLabel: string;
  readonly debugOn: string;
  readonly debugOff: string;
  readonly slotCountLabel: string;
  readonly placeholderLabel: string;
  readonly errorLabel: string;
  readonly errorTitle: string;
  readonly errorText: string;
  readonly semanticLabel: string;
  readonly semanticTitle: string;
  readonly colorTitle: string;
  readonly layoutTitle: string;
  readonly typographyTitle: string;
  readonly assetSlotsLabel: string;
  readonly assetSlotsTitle: string;
  readonly emptyText: string;
  readonly placeholderStatus: string;
  readonly debugPanelLabel: string;
  readonly debugOnTitle: string;
  readonly debugOffTitle: string;
} {
  if (locale === "zh-CN") {
    return {
      rootLabel: "M7 设计 token 与资产替换槽",
      title: "设计 token 与资产替换槽",
      summaryLabel: "设计系统摘要",
      localeLabel: "语言",
      debugLabel: "调试模式",
      debugOn: "开启",
      debugOff: "关闭",
      slotCountLabel: "替换槽",
      placeholderLabel: "占位策略",
      errorLabel: "registry 错误状态",
      errorTitle: "Registry 错误状态",
      errorText: "展示错误状态时仍不加载最终美术，也不改变模拟或命令状态。",
      semanticLabel: "语义状态",
      semanticTitle: "启用、禁用、警告、成功、危险与调试状态",
      colorTitle: "颜色与地图图层",
      layoutTitle: "间距、圆角、边框与阴影",
      typographyTitle: "字体与文字层级",
      assetSlotsLabel: "资产替换槽",
      assetSlotsTitle: "集中资产替换槽",
      emptyText: "当前没有可展示的替换槽。",
      placeholderStatus: "中性占位",
      debugPanelLabel: "调试区分",
      debugOnTitle: "Debug on",
      debugOffTitle: "Debug off"
    };
  }
  return {
    rootLabel: "M7 design tokens and asset replacement slots",
    title: "Design Tokens And Asset Slots",
    summaryLabel: "Design system summary",
    localeLabel: "Locale",
    debugLabel: "Debug mode",
    debugOn: "On",
    debugOff: "Off",
    slotCountLabel: "Slots",
    placeholderLabel: "Placeholder policy",
    errorLabel: "Registry error state",
    errorTitle: "Registry Error State",
    errorText:
      "The error state never loads final art and does not change simulation or command state.",
    semanticLabel: "Semantic states",
    semanticTitle: "Enabled, disabled, warning, success, danger, and debug states",
    colorTitle: "Colors And Map Layers",
    layoutTitle: "Spacing, Radius, Borders, Elevation",
    typographyTitle: "Typography",
    assetSlotsLabel: "Asset replacement slots",
    assetSlotsTitle: "Centralized Asset Replacement Slots",
    emptyText: "No replacement slots are available.",
    placeholderStatus: "neutral placeholder",
    debugPanelLabel: "Debug distinction",
    debugOnTitle: "Debug on",
    debugOffTitle: "Debug off"
  };
}

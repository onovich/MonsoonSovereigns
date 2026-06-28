import { CLIENT_DESIGN_TOKENS } from "./design-tokens";

export type ClientAssetSlotCategory =
  | "frame"
  | "icon"
  | "map-fill"
  | "map-stroke"
  | "route-style"
  | "settlement-marker"
  | "portrait"
  | "alert"
  | "settings-language"
  | "tooltip";

export type ClientAssetSlotRole = "cosmetic" | "functional-readability";
export type ClientAssetSlotReviewGate =
  | "art-review"
  | "culture-review"
  | "historical-review"
  | "localization-review";

export type ClientAssetSlotStatus =
  | { readonly kind: "neutral-placeholder"; readonly placeholderToken: string }
  | {
      readonly kind: "approved-final-art";
      readonly assetId: string;
      readonly approvedBy: string;
      readonly approvedAtIso: string;
    };

export interface ClientAssetReplacementSlot {
  readonly id: string;
  readonly category: ClientAssetSlotCategory;
  readonly label: string;
  readonly role: ClientAssetSlotRole;
  readonly status: ClientAssetSlotStatus;
  readonly reviewGates: readonly ClientAssetSlotReviewGate[];
  readonly replacementContract: {
    readonly sizing: "fixed-square" | "fixed-portrait" | "flexible-frame" | "scalable-stroke";
    readonly vectorPreferred: boolean;
    readonly localeAware: boolean;
    readonly mapAuthority: "none" | "read-model-presentation-only";
  };
}

export const CLIENT_ASSET_REPLACEMENT_SLOTS = [
  createPlaceholderSlot({
    id: "frame.top-bar",
    category: "frame",
    label: "Top bar frame",
    role: "cosmetic",
    placeholderToken: "colors.surface.ink",
    sizing: "flexible-frame",
    vectorPreferred: true,
    localeAware: false,
    mapAuthority: "none",
    reviewGates: ["art-review"]
  }),
  createPlaceholderSlot({
    id: "frame.panel",
    category: "frame",
    label: "Panel frame",
    role: "cosmetic",
    placeholderToken: "border.hairline",
    sizing: "flexible-frame",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "none",
    reviewGates: ["art-review", "localization-review"]
  }),
  createPlaceholderSlot({
    id: "icon.resource",
    category: "icon",
    label: "Resource icons",
    role: "functional-readability",
    placeholderToken: "colors.accent.copper",
    sizing: "fixed-square",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "none",
    reviewGates: ["art-review", "localization-review"]
  }),
  createPlaceholderSlot({
    id: "map.fill.district",
    category: "map-fill",
    label: "District fills",
    role: "functional-readability",
    placeholderToken: "colors.mapLayer.seasonalFallow",
    sizing: "flexible-frame",
    vectorPreferred: false,
    localeAware: false,
    mapAuthority: "read-model-presentation-only",
    reviewGates: ["art-review"]
  }),
  createPlaceholderSlot({
    id: "map.stroke.district",
    category: "map-stroke",
    label: "District strokes",
    role: "functional-readability",
    placeholderToken: "colors.mapLayer.neutralStroke",
    sizing: "scalable-stroke",
    vectorPreferred: true,
    localeAware: false,
    mapAuthority: "read-model-presentation-only",
    reviewGates: ["art-review"]
  }),
  createPlaceholderSlot({
    id: "route.style.supply",
    category: "route-style",
    label: "Supply and march route styles",
    role: "functional-readability",
    placeholderToken: "colors.mapLayer.routeReachable",
    sizing: "scalable-stroke",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "read-model-presentation-only",
    reviewGates: ["art-review", "localization-review"]
  }),
  createPlaceholderSlot({
    id: "marker.settlement",
    category: "settlement-marker",
    label: "Settlement markers",
    role: "functional-readability",
    placeholderToken: "colors.surface.paper",
    sizing: "fixed-square",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "read-model-presentation-only",
    reviewGates: ["art-review", "culture-review"]
  }),
  createPlaceholderSlot({
    id: "portrait.court",
    category: "portrait",
    label: "Court portrait placeholders",
    role: "cosmetic",
    placeholderToken: "colors.surface.muted",
    sizing: "fixed-portrait",
    vectorPreferred: false,
    localeAware: true,
    mapAuthority: "none",
    reviewGates: ["art-review", "culture-review", "historical-review"]
  }),
  createPlaceholderSlot({
    id: "alert.severity",
    category: "alert",
    label: "Alert severity icons",
    role: "functional-readability",
    placeholderToken: "colors.semantic.warning",
    sizing: "fixed-square",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "none",
    reviewGates: ["art-review", "localization-review"]
  }),
  createPlaceholderSlot({
    id: "settings.language",
    category: "settings-language",
    label: "Settings and language controls",
    role: "functional-readability",
    placeholderToken: "colors.semantic.info",
    sizing: "fixed-square",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "none",
    reviewGates: ["art-review", "localization-review"]
  }),
  createPlaceholderSlot({
    id: "tooltip.frame",
    category: "tooltip",
    label: "Tooltip frame",
    role: "functional-readability",
    placeholderToken: "elevation.popover",
    sizing: "flexible-frame",
    vectorPreferred: true,
    localeAware: true,
    mapAuthority: "none",
    reviewGates: ["art-review", "localization-review"]
  })
] as const satisfies readonly ClientAssetReplacementSlot[];

export function listClientAssetReplacementSlots(
  category?: ClientAssetSlotCategory
): readonly ClientAssetReplacementSlot[] {
  if (category === undefined) {
    return CLIENT_ASSET_REPLACEMENT_SLOTS;
  }
  return CLIENT_ASSET_REPLACEMENT_SLOTS.filter((slot) => slot.category === category);
}

export function hasOnlyNeutralPlaceholderAssets(
  slots: readonly ClientAssetReplacementSlot[]
): boolean {
  return slots.every((slot) => slot.status.kind === "neutral-placeholder");
}

export function createAssetSlotStressFixture(): readonly ClientAssetReplacementSlot[] {
  return [
    ...CLIENT_ASSET_REPLACEMENT_SLOTS,
    ...CLIENT_ASSET_REPLACEMENT_SLOTS.map((slot, index) => ({
      ...slot,
      id: `${slot.id}.stress.${index + 1}`,
      label: `${slot.label} localized expansion stress ${index + 1}`
    }))
  ];
}

function createPlaceholderSlot(input: {
  readonly id: string;
  readonly category: ClientAssetSlotCategory;
  readonly label: string;
  readonly role: ClientAssetSlotRole;
  readonly placeholderToken: string;
  readonly sizing: ClientAssetReplacementSlot["replacementContract"]["sizing"];
  readonly vectorPreferred: boolean;
  readonly localeAware: boolean;
  readonly mapAuthority: ClientAssetReplacementSlot["replacementContract"]["mapAuthority"];
  readonly reviewGates: readonly ClientAssetSlotReviewGate[];
}): ClientAssetReplacementSlot {
  return {
    id: input.id,
    category: input.category,
    label: input.label,
    role: input.role,
    status: {
      kind: "neutral-placeholder",
      placeholderToken: input.placeholderToken
    },
    reviewGates: input.reviewGates,
    replacementContract: {
      sizing: input.sizing,
      vectorPreferred: input.vectorPreferred,
      localeAware: input.localeAware,
      mapAuthority: input.mapAuthority
    }
  };
}

export const CLIENT_ASSET_SLOT_PLACEHOLDER_NOTE =
  "All M7 slots are neutral placeholders until reviewed final art is approved.";

export const CLIENT_ASSET_SLOT_REVIEW_GATES = {
  artReview: "No final art path is hard-coded in UI components.",
  cultureReview:
    "Culture-specific symbols, portraits, scripts, flags, religious imagery, clothing, architecture, music, and ritual motifs remain gated.",
  mapAuthority:
    "Map assets are presentation slots only and must be rebuildable from read-model slices."
} as const;

export const CLIENT_ASSET_SLOT_TOKEN_REFERENCE = CLIENT_DESIGN_TOKENS;

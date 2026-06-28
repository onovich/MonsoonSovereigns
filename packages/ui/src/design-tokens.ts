export const CLIENT_DESIGN_TOKENS = {
  colors: {
    surface: {
      app: "#eef1f2",
      ink: "#172126",
      paper: "#fbfcfc",
      raised: "#ffffff",
      muted: "#f5f7f8",
      debug: "#101418"
    },
    text: {
      primary: "#172126",
      secondary: "#4b5b63",
      muted: "#6d7880",
      inverse: "#f5f7f8",
      danger: "#733b31"
    },
    accent: {
      river: "#2f6f73",
      copper: "#b88746",
      grain: "#8aa05a",
      lacquer: "#a65b4b",
      court: "#5f6f42"
    },
    semantic: {
      enabled: "#2f6f73",
      disabled: "#8d979d",
      warning: "#b88746",
      success: "#5f8f62",
      danger: "#a65b4b",
      info: "#416f8a",
      selected: "#1f5c61",
      focus: "#1f5c61",
      debug: "#3b4450"
    },
    mapLayer: {
      seasonalFallow: "#d9d1be",
      seasonalPlanting: "#9ab57a",
      seasonalGrowing: "#5f9f72",
      seasonalHarvest: "#d6aa4a",
      water: "#9fc9d3",
      coastalInterface: "#c6d4ba",
      economyCash: "#b88746",
      economyGrain: "#8aa05a",
      routeReachable: "#2f6f73",
      routeOverloaded: "#b88746",
      routeBlocked: "#a65b4b",
      selectionStroke: "#172126",
      neutralStroke: "#91a0a6"
    }
  },
  spacing: {
    px0: "0",
    px2: "2px",
    px4: "4px",
    px6: "6px",
    px8: "8px",
    px10: "10px",
    px12: "12px",
    px14: "14px",
    px18: "18px",
    px22: "22px",
    px30: "30px"
  },
  typography: {
    family: {
      ui: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    },
    size: {
      label: "0.72rem",
      control: "0.78rem",
      body: "0.82rem",
      bodyLarge: "0.95rem",
      sectionTitle: "1.12rem",
      screenTitle: "1.35rem"
    },
    weight: {
      regular: "400",
      strong: "700",
      heavy: "800"
    },
    lineHeight: {
      compact: "1.25",
      body: "1.4"
    }
  },
  radius: {
    none: "0",
    control: "4px",
    panel: "4px",
    card: "4px",
    overlay: "6px"
  },
  border: {
    hairline: "1px solid #d8dee2",
    strong: "1px solid #87939b",
    focus: "3px solid #1f5c61",
    danger: "1px solid #a65b4b",
    warning: "1px solid #b88746",
    success: "1px solid #9bbdb5"
  },
  elevation: {
    none: "none",
    insetDivider: "inset 1px 0 0 #c4ccd1",
    popover: "0 8px 20px rgba(23, 33, 38, 0.18)",
    overlay: "0 14px 32px rgba(23, 33, 38, 0.28)"
  },
  state: {
    enabled: {
      background: "#e7f2ef",
      border: "#2f6f73",
      text: "#1f5c61"
    },
    disabled: {
      background: "#f5f7f8",
      border: "#c4ccd1",
      text: "#6d7880"
    },
    warning: {
      background: "#fbf6ea",
      border: "#b88746",
      text: "#6d4d23"
    },
    success: {
      background: "#f0f7f5",
      border: "#9bbdb5",
      text: "#2f6f55"
    },
    danger: {
      background: "#fff7f4",
      border: "#a65b4b",
      text: "#733b31"
    },
    debug: {
      background: "#101418",
      border: "#3b4450",
      text: "#e7edf2"
    }
  }
} as const;

export type ClientDesignTokens = typeof CLIENT_DESIGN_TOKENS;
export type ClientSemanticState = keyof ClientDesignTokens["state"];

export const CLIENT_SEMANTIC_STATES = [
  "enabled",
  "disabled",
  "warning",
  "success",
  "danger",
  "debug"
] as const satisfies readonly ClientSemanticState[];

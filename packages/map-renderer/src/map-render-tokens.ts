export const MAP_RENDER_TOKENS = {
  surface: {
    canvasBackground: "#f7f4ea"
  },
  anchors: {
    primary: 0x2f6f73,
    secondary: 0xb88746,
    muted: 0x6d7280
  },
  districts: {
    strokeDefault: 0x91a0a6,
    strokeHovered: 0x2f6f73,
    strokeSelected: 0x172126,
    situation: {
      stable: 0xcbd8c7,
      pressure: 0xd9c18c,
      blocked: 0xd9b6a9
    },
    seasonal: {
      fallow: 0xd9d1be,
      planting: 0x9ab57a,
      growing: 0x5f9f72,
      harvest: 0xd6aa4a,
      water: 0x9fc9d3,
      coastalInterface: 0xc6d4ba,
      default: 0xd9d1be
    },
    economy: {
      cashDominant: 0xb88746,
      grainDominant: 0x8aa05a
    },
    routesMode: {
      reachable: 0xd7e6df,
      blocked: 0xe6d1c6
    }
  },
  routes: {
    reachable: 0x2f6f73,
    overloaded: 0xb88746,
    blocked: 0xa65b4b,
    alphaDefault: 0.58,
    alphaSelected: 0.95,
    widthDefaultInMapUnits: 2,
    widthProminentInMapUnits: 4
  },
  settlements: {
    fillDefault: 0xf7f4ea,
    fillHovered: 0xe7f2ef,
    fillSelected: 0x172126,
    strokeDefault: 0x4b5b63,
    strokeHovered: 0x2f6f73
  },
  labels: {
    districtFill: 0x172126,
    settlementFill: 0x4c5b63,
    fontFamily: "Arial, sans-serif",
    districtFontSizePx: 11,
    settlementFontSizePx: 10,
    fontWeight: "700"
  }
} as const;

export type MapRenderTokens = typeof MAP_RENDER_TOKENS;

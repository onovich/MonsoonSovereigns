const saveSlotIdPattern = /^[a-z0-9][a-z0-9_-]{0,63}$/u;
const approvedExternalOrigins = new Set(["https://monsoon-sovereigns.local"]);

type Brand<TName extends string> = {
  readonly __brand: TName;
};

export type LocaleId = string & Brand<"LocaleId">;
export type SaveSlotId = string & Brand<"SaveSlotId">;
export type ApprovedExternalUrl = string & Brand<"ApprovedExternalUrl">;

export type PlatformKind = "browser" | "electron";

export type DesktopRuntimeInfo = {
  readonly platform: "win32" | "darwin" | "linux" | "unknown";
  readonly appVersion: string;
  readonly locale: LocaleId;
};

export type SetFullscreenRequest = {
  readonly enabled: boolean;
};

export type DesktopPlatformBridge = {
  readonly getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
  readonly setFullscreen: (enabled: boolean) => Promise<void>;
};

export type PlatformAdapter = {
  readonly kind: PlatformKind;
  readonly getLocale: () => Promise<LocaleId>;
  readonly loadSave: (slot: SaveSlotId) => Promise<ArrayBuffer | null>;
  readonly writeSave: (slot: SaveSlotId, data: ArrayBuffer) => Promise<void>;
  readonly exportSave: (data: ArrayBuffer, suggestedName: string) => Promise<void>;
  readonly importSave: () => Promise<ArrayBuffer | null>;
  readonly setFullscreen: (enabled: boolean) => Promise<void>;
  readonly openExternal: (url: ApprovedExternalUrl) => Promise<void>;
};

export const desktopBridgeName = "monsoonDesktop";

export const desktopIpcChannels = {
  getRuntimeInfo: "desktop:getRuntimeInfo",
  setFullscreen: "desktop:setFullscreen"
} as const;

export function createLocaleId(value: string): LocaleId {
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > 64) {
    throw new Error("LocaleId must be a non-empty BCP 47-like string.");
  }

  return normalized as LocaleId;
}

export function createSaveSlotId(value: string): SaveSlotId {
  const normalized = value.trim();
  if (!saveSlotIdPattern.test(normalized)) {
    throw new Error("SaveSlotId must use lowercase letters, numbers, underscores, or hyphens.");
  }

  return normalized as SaveSlotId;
}

export function createApprovedExternalUrl(value: string): ApprovedExternalUrl {
  const parsed = new URL(value);
  if (!approvedExternalOrigins.has(parsed.origin)) {
    throw new Error("External URL origin is not approved.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("External URL must use HTTPS.");
  }

  return parsed.toString() as ApprovedExternalUrl;
}

export function isSetFullscreenRequest(value: unknown): value is SetFullscreenRequest {
  return (
    typeof value === "object" &&
    value !== null &&
    "enabled" in value &&
    typeof value.enabled === "boolean"
  );
}

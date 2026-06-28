import {
  parseClientLocalePreference,
  resolveClientLocale,
  type ClientLocalePreference,
  type ClientResolvedLocale
} from "@monsoon/ui";

export const CLIENT_LOCALE_STORAGE_KEY = "monsoon.client.localePreference.v1";

export type LocaleStorageLike = {
  readonly getItem: (key: string) => string | null;
  readonly setItem: (key: string, value: string) => void;
};

export type BrowserLocaleSource = {
  readonly language?: string;
  readonly languages?: readonly string[];
};

type DesktopRuntimeBridge = {
  readonly getRuntimeInfo: () => Promise<unknown>;
};

type WindowWithOptionalDesktopBridge = Window & {
  readonly monsoonDesktop?: unknown;
};

export function readStoredLocalePreference(
  storage: LocaleStorageLike | null
): ClientLocalePreference {
  if (storage === null) {
    return "system";
  }
  const stored = readLocaleStorageValue(storage);
  const parsed = parseClientLocalePreference(stored);
  if (parsed === null) {
    return "system";
  }
  writeLocaleStorageValue(storage, parsed);
  return parsed;
}

export function persistLocalePreference(
  storage: LocaleStorageLike | null,
  preference: ClientLocalePreference
): void {
  if (storage !== null) {
    writeLocaleStorageValue(storage, preference);
  }
}

export function readBrowserSystemLocales(source: BrowserLocaleSource | null): readonly string[] {
  if (source === null) {
    return [];
  }
  const locales = source.languages?.filter((locale) => locale.trim().length > 0) ?? [];
  if (locales.length > 0) {
    return locales;
  }
  return source.language === undefined || source.language.trim().length === 0
    ? []
    : [source.language];
}

export function resolveBrowserClientLocale(input: {
  readonly preference: ClientLocalePreference;
  readonly browserLocales: readonly string[];
  readonly desktopLocale: string | null;
}): ClientResolvedLocale {
  return resolveClientLocale({
    preference: input.preference,
    systemLocales:
      input.desktopLocale === null
        ? input.browserLocales
        : [input.desktopLocale, ...input.browserLocales]
  });
}

export function getBrowserLocaleSource(): BrowserLocaleSource | null {
  return typeof navigator === "undefined" ? null : navigator;
}

export function getLocaleStorage(): LocaleStorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export async function readDesktopRuntimeLocale(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }
  const bridge = (window as WindowWithOptionalDesktopBridge).monsoonDesktop;
  if (!isDesktopRuntimeBridge(bridge)) {
    return null;
  }
  const runtimeInfo = await bridge.getRuntimeInfo();
  if (!isRuntimeInfoWithLocale(runtimeInfo)) {
    return null;
  }
  return runtimeInfo.locale;
}

function isDesktopRuntimeBridge(value: unknown): value is DesktopRuntimeBridge {
  return (
    typeof value === "object" &&
    value !== null &&
    "getRuntimeInfo" in value &&
    typeof value.getRuntimeInfo === "function"
  );
}

function isRuntimeInfoWithLocale(value: unknown): value is { readonly locale: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "locale" in value &&
    typeof value.locale === "string"
  );
}

function readLocaleStorageValue(storage: LocaleStorageLike): string | null {
  try {
    return storage.getItem(CLIENT_LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLocaleStorageValue(
  storage: LocaleStorageLike,
  preference: ClientLocalePreference
): void {
  try {
    storage.setItem(CLIENT_LOCALE_STORAGE_KEY, preference);
  } catch {
    // Locale preference is a UI convenience; failed storage must not block boot.
  }
}

import {
  createClientDistrictId,
  type ClientM7CoverageSurface,
  type ClientMapEntitySelection,
  type ClientMapMode,
  type ClientMapReadModelSnapshot,
  type ClientM3SubmittedCommand,
  type ClientM4SubmittedCommand,
  type ClientM5SubmittedCommand,
  type ClientM6SubmittedCommand
} from "@monsoon/client-core";
import {
  mountPixiMapRenderer,
  type MapRenderViewport,
  type MountedPixiMapRenderer
} from "@monsoon/map-renderer";
import {
  ClientShellView,
  createClientI18n,
  type ClientI18n,
  type ClientLocalePreference
} from "@monsoon/ui";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import { createWebClientShellSnapshot } from "./create-shell-snapshot";
import {
  getBrowserLocaleSource,
  getLocaleStorage,
  persistLocalePreference,
  readBrowserSystemLocales,
  readDesktopRuntimeLocale,
  readStoredLocalePreference,
  resolveBrowserClientLocale
} from "./i18n-platform";

const MAP_RENDERER_MOUNT_TIMEOUT_MS = 2400;

export interface WebClientShellProps {
  readonly initialSearch?: string;
  readonly initialLocalePreference?: ClientLocalePreference;
  readonly initialSystemLocales?: readonly string[];
}

export function WebClientShell({
  initialSearch,
  initialLocalePreference,
  initialSystemLocales
}: WebClientShellProps = {}): ReactElement {
  const [snapshot] = useState(() =>
    createWebClientShellSnapshot(initialSearch ?? getWindowSearch())
  );
  const [localePreference, setLocalePreference] = useState<ClientLocalePreference>(
    () => initialLocalePreference ?? readStoredLocalePreference(getLocaleStorage())
  );
  const [browserSystemLocales] = useState(
    () => initialSystemLocales ?? readBrowserSystemLocales(getBrowserLocaleSource())
  );
  const [desktopLocale, setDesktopLocale] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<ClientMapMode>("seasonal");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [m3CommandStatus, setM3CommandStatus] = useState<string | null>(null);
  const [m4CommandStatus, setM4CommandStatus] = useState<string | null>(null);
  const [m5CommandStatus, setM5CommandStatus] = useState<string | null>(null);
  const [m6CommandStatus, setM6CommandStatus] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<ClientMapEntitySelection>({
    kind: "district",
    districtId: createClientDistrictId(1)
  });
  const viewport = useMemo<MapRenderViewport>(
    () => ({
      mode: mapMode,
      zoomLevel,
      selectedEntity
    }),
    [mapMode, selectedEntity, zoomLevel]
  );
  const resolvedLocale = resolveBrowserClientLocale({
    preference: localePreference,
    browserLocales: browserSystemLocales,
    desktopLocale
  });
  const i18n = useMemo(() => createClientI18n(resolvedLocale), [resolvedLocale]);

  useEffect(() => {
    let isMounted = true;
    void readDesktopRuntimeLocale()
      .then((locale) => {
        if (isMounted) {
          setDesktopLocale(locale);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDesktopLocale(null);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = resolvedLocale;
    }
  }, [resolvedLocale]);

  function handleLocalePreferenceChange(preference: ClientLocalePreference): void {
    setLocalePreference(preference);
    persistLocalePreference(getLocaleStorage(), preference);
  }

  function handleM3CommandSubmit(command: ClientM3SubmittedCommand): void {
    void command;
    setM3CommandStatus(i18n.t("shell.command.m3Ready"));
  }

  function handleM4CommandSubmit(command: ClientM4SubmittedCommand): void {
    void command;
    setM4CommandStatus(i18n.t("shell.command.m4Ready"));
  }

  function handleM5CommandSubmit(command: ClientM5SubmittedCommand): void {
    void command;
    setM5CommandStatus(i18n.t("shell.command.m5Ready"));
  }

  function handleM6CommandSubmit(command: ClientM6SubmittedCommand): void {
    void command;
    setM6CommandStatus(i18n.t("shell.command.m6Ready"));
  }

  return (
    <ClientShellView
      snapshot={snapshot}
      mapMode={mapMode}
      zoomLevel={zoomLevel}
      selectedEntity={selectedEntity}
      onMapModeChange={setMapMode}
      onZoomLevelChange={setZoomLevel}
      onSelectedEntityChange={setSelectedEntity}
      onM3CommandSubmit={handleM3CommandSubmit}
      m3CommandStatus={m3CommandStatus}
      onM4CommandSubmit={handleM4CommandSubmit}
      m4CommandStatus={m4CommandStatus}
      onM5CommandSubmit={handleM5CommandSubmit}
      m5CommandStatus={m5CommandStatus}
      onM6CommandSubmit={handleM6CommandSubmit}
      m6CommandStatus={m6CommandStatus}
      i18n={i18n}
      localePreference={localePreference}
      onLocalePreferenceChange={handleLocalePreferenceChange}
      initialM7Surface={readInitialM7Surface(initialSearch ?? getWindowSearch())}
      initialDebugMode={readInitialDebugMode(initialSearch ?? getWindowSearch())}
      mapSurface={
        <PixiMapSurface
          snapshot={snapshot.map}
          viewport={viewport}
          i18n={i18n}
          onSelectedEntityChange={setSelectedEntity}
        />
      }
    />
  );
}

interface PixiMapSurfaceProps {
  readonly snapshot: ClientMapReadModelSnapshot;
  readonly viewport: MapRenderViewport;
  readonly i18n: ClientI18n;
  readonly onSelectedEntityChange: (selection: ClientMapEntitySelection) => void;
}

function PixiMapSurface({
  snapshot,
  viewport,
  i18n,
  onSelectedEntityChange
}: PixiMapSurfaceProps): ReactElement {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<MountedPixiMapRenderer | null>(null);
  const pendingDeltaRef = useRef({ snapshot, viewport });
  const mountAttemptRef = useRef(0);
  const [rendererStatus, setRendererStatus] = useState<"mounting" | "mounted" | "error">(
    "mounting"
  );
  const [mountError, setMountError] = useState<string | null>(null);

  useEffect(() => {
    pendingDeltaRef.current = { snapshot, viewport };
    const renderer = rendererRef.current;
    if (renderer !== null) {
      renderer.applyDelta({
        kind: "replace-read-model",
        snapshot,
        viewport
      });
    }
  }, [snapshot, viewport]);

  useEffect(() => {
    const host = hostRef.current;
    if (host === null) {
      return undefined;
    }

    const mountAttempt = mountAttemptRef.current + 1;
    mountAttemptRef.current = mountAttempt;
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => {
      abortController.abort();
      if (mountAttemptRef.current === mountAttempt && rendererRef.current === null) {
        setRendererStatus("error");
        setMountError("MapRenderer mount timed out.");
      }
    }, MAP_RENDERER_MOUNT_TIMEOUT_MS);
    setRendererStatus("mounting");
    setMountError(null);
    host.replaceChildren();

    void mountPixiMapRenderer({
      host,
      initialSnapshot: pendingDeltaRef.current.snapshot,
      viewport: pendingDeltaRef.current.viewport,
      onSelectEntity: onSelectedEntityChange,
      signal: abortController.signal
    })
      .then((renderer) => {
        window.clearTimeout(timeoutId);
        if (abortController.signal.aborted || mountAttemptRef.current !== mountAttempt) {
          renderer.destroy();
          return;
        }
        rendererRef.current = renderer;
        setRendererStatus("mounted");
        renderer.applyDelta({
          kind: "replace-read-model",
          snapshot: pendingDeltaRef.current.snapshot,
          viewport: pendingDeltaRef.current.viewport
        });
      })
      .catch((error: unknown) => {
        window.clearTimeout(timeoutId);
        if (abortController.signal.aborted || mountAttemptRef.current !== mountAttempt) {
          return;
        }
        setRendererStatus("error");
        setMountError(toRendererMountErrorMessage(error));
      });

    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort();
      const renderer = rendererRef.current;
      rendererRef.current = null;
      renderer?.destroy();
      host.replaceChildren();
    };
  }, [onSelectedEntityChange]);

  function handleMapKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const districtCount = snapshot.districts.length;
    if (districtCount === 0) {
      return;
    }

    const firstDistrict = snapshot.districts[0];
    if (firstDistrict === undefined) {
      return;
    }
    const selectedDistrictId = viewport.selectedEntity?.districtId ?? firstDistrict.districtId;
    const currentIndex = snapshot.districts.findIndex(
      (district) => district.districtId === selectedDistrictId
    );
    const fallbackIndex = currentIndex < 0 ? 0 : currentIndex;
    const nextIndex = getNextMapKeyboardIndex({
      key: event.key,
      fallbackIndex,
      districtCount
    });
    if (nextIndex === null) {
      return;
    }

    const nextDistrict = snapshot.districts[nextIndex];
    if (nextDistrict === undefined) {
      return;
    }

    event.preventDefault();
    onSelectedEntityChange({ kind: "district", districtId: nextDistrict.districtId });
  }

  const selectedDistrictId =
    viewport.selectedEntity?.districtId ?? snapshot.districts[0]?.districtId;
  const selectedDistrict = snapshot.districts.find(
    (district) => district.districtId === selectedDistrictId
  );
  const selectedDistrictLabel =
    selectedDistrict === undefined
      ? i18n.t("map.selection.empty")
      : i18n.t("shell.district.name", {
          number: i18n.formatNumber(Number(selectedDistrict.districtId))
        });

  return (
    <>
      <span id="map-keyboard-help" className="sr-only">
        Use arrow keys, Home, and End to move the selected district through the map read model.
      </span>
      <span id="map-selected-district-status" className="sr-only" aria-live="polite">
        Selected map district: {selectedDistrictLabel}.
      </span>
      <div
        ref={hostRef}
        className="map-viewport"
        aria-label={i18n.t("shell.mapRegion.label")}
        aria-describedby="map-keyboard-help map-selected-district-status"
        aria-keyshortcuts="ArrowRight ArrowDown ArrowLeft ArrowUp Home End"
        aria-roledescription="keyboard navigable map read model"
        data-renderer-owner="map-renderer"
        data-renderer-status={rendererStatus}
        data-renderer-error={mountError ?? undefined}
        data-keyboard-navigation="district-cycle"
        data-selected-district-label={selectedDistrictLabel}
        onKeyDown={handleMapKeyDown}
        role="region"
        tabIndex={0}
      />
      {rendererStatus === "error" ? (
        <p className="map-renderer-error" role="alert">
          Map renderer failed to mount.
        </p>
      ) : null}
    </>
  );
}

function getNextMapKeyboardIndex(input: {
  readonly key: string;
  readonly fallbackIndex: number;
  readonly districtCount: number;
}): number | null {
  switch (input.key) {
    case "ArrowRight":
    case "ArrowDown":
      return (input.fallbackIndex + 1) % input.districtCount;
    case "ArrowLeft":
    case "ArrowUp":
      return (input.fallbackIndex - 1 + input.districtCount) % input.districtCount;
    case "Home":
      return 0;
    case "End":
      return input.districtCount - 1;
    default:
      return null;
  }
}

function toRendererMountErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Unknown MapRenderer mount failure.";
}

function getWindowSearch(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.search;
}

function readInitialM7Surface(search: string): ClientM7CoverageSurface {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const surface = params.get("surface")?.trim().toLowerCase() ?? "";
  switch (surface) {
    case "hints":
    case "encyclopedia":
    case "coverage":
      return surface;
    default:
      return "tutorial";
  }
}

function readInitialDebugMode(search: string): boolean {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const debug = params.get("debug")?.trim().toLowerCase() ?? "";
  return debug === "1" || debug === "true" || debug === "on";
}

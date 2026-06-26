import {
  createClientDistrictId,
  type ClientMapEntitySelection,
  type ClientMapMode,
  type ClientMapReadModelSnapshot,
  type ClientM3SubmittedCommand,
  type ClientM4SubmittedCommand
} from "@monsoon/client-core";
import {
  mountPixiMapRenderer,
  type MapRenderViewport,
  type MountedPixiMapRenderer
} from "@monsoon/map-renderer";
import { ClientShellView } from "@monsoon/ui";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import { createWebClientShellSnapshot } from "./create-shell-snapshot";

const MAP_RENDERER_MOUNT_TIMEOUT_MS = 2400;

export function WebClientShell(): ReactElement {
  const [snapshot] = useState(() => createWebClientShellSnapshot(getWindowSearch()));
  const [mapMode, setMapMode] = useState<ClientMapMode>("seasonal");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [m3CommandStatus, setM3CommandStatus] = useState<string | null>(null);
  const [m4CommandStatus, setM4CommandStatus] = useState<string | null>(null);
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

  function handleM3CommandSubmit(command: ClientM3SubmittedCommand): void {
    setM3CommandStatus(`${command.kind} ready for ${command.actor.id}`);
  }

  function handleM4CommandSubmit(command: ClientM4SubmittedCommand): void {
    setM4CommandStatus(`${command.kind} ready for ${command.actor.id}`);
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
      mapSurface={
        <PixiMapSurface
          snapshot={snapshot.map}
          viewport={viewport}
          onSelectedEntityChange={setSelectedEntity}
        />
      }
    />
  );
}

interface PixiMapSurfaceProps {
  readonly snapshot: ClientMapReadModelSnapshot;
  readonly viewport: MapRenderViewport;
  readonly onSelectedEntityChange: (selection: ClientMapEntitySelection) => void;
}

function PixiMapSurface({
  snapshot,
  viewport,
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

  return (
    <>
      <div
        ref={hostRef}
        className="map-viewport"
        aria-label="M2 prototype map viewport"
        data-renderer-owner="map-renderer"
        data-renderer-status={rendererStatus}
        data-renderer-error={mountError ?? undefined}
      />
      {rendererStatus === "error" ? (
        <p className="map-renderer-error" role="alert">
          Map renderer failed to mount.
        </p>
      ) : null}
    </>
  );
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

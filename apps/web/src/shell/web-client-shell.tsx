import { buildMapRenderPlan } from "@monsoon/map-renderer";
import { ClientShellView } from "@monsoon/ui";
import { useMemo, useState, type ReactElement } from "react";

import { createBootstrappedShellSnapshot } from "./create-shell-snapshot";

export function WebClientShell(): ReactElement {
  const [snapshot] = useState(createBootstrappedShellSnapshot);
  const mapPlan = useMemo(() => buildMapRenderPlan(snapshot.map), [snapshot]);

  return <ClientShellView snapshot={snapshot} mapAnchorCount={mapPlan.anchors.length} />;
}

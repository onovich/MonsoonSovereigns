import {
  buildMapRenderPlan,
  createMemoryPixiAnchorMarkerFactory,
  createMemoryPixiSceneLayer,
  createPixiMapScene,
  type PixiSceneLayer
} from "@monsoon/map-renderer";
import { ClientShellView } from "@monsoon/ui";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createBootstrappedShellSnapshot } from "./create-shell-snapshot";

describe("web client shell", () => {
  it("projects a simulation result into a disposable client read model", () => {
    const snapshot = createBootstrappedShellSnapshot();

    expect(snapshot.status).toBe("ready");
    expect(snapshot.simulation.daysSimulated).toBe(30);
    expect(snapshot.revision).toBe(snapshot.simulation.finalRevision);
    expect(JSON.stringify(snapshot)).not.toContain("WorldState");
  });

  it("renders React from read model snapshots without authority-bearing state", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const plan = buildMapRenderPlan(snapshot.map);
    const markup = renderToStaticMarkup(
      <ClientShellView snapshot={snapshot} mapAnchorCount={plan.anchors.length} />
    );

    expect(markup).toContain("Monsoon Sovereigns");
    expect(markup).toContain(snapshot.simulation.stateHash);
    expect(markup).toContain(`data-anchor-count="${plan.anchors.length}"`);
  });

  it("rebuilds the Pixi scene shell from the read model", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const stage = createMemoryPixiSceneLayer();
    const scene = createPixiMapScene(stage, createMemoryPixiAnchorMarkerFactory());

    scene.rebuild(snapshot.map);
    const anchorLayer = getOnlyChildLayer(stage);
    expect(stage.children.length).toBe(1);
    expect(anchorLayer.children.length).toBe(snapshot.map.anchors.length);

    scene.rebuild({
      ...snapshot.map,
      anchors: snapshot.map.anchors.slice(0, 1)
    });
    expect(anchorLayer.children.length).toBe(1);

    scene.destroy();
  });
});

function getOnlyChildLayer(layer: PixiSceneLayer): PixiSceneLayer {
  const child = layer.children[0];
  if (!isPixiSceneLayer(child)) {
    throw new Error("Expected the Pixi scene shell to attach one child layer.");
  }

  return child;
}

function isPixiSceneLayer(value: unknown): value is PixiSceneLayer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "children" in value && "addChild" in value && "removeChildren" in value;
}

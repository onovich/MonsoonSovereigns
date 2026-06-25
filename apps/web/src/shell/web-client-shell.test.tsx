import {
  createMemoryPixiMapNodeFactory,
  createMemoryPixiSceneLayer,
  createPixiMapScene,
  type PixiSceneLayer
} from "@monsoon/map-renderer";
import { createClientDistrictId } from "@monsoon/client-core";
import { ClientShellView } from "@monsoon/ui";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createBootstrappedShellSnapshot } from "./create-shell-snapshot";

describe("web client shell", () => {
  it("projects a simulation result into a disposable client read model", () => {
    const snapshot = createBootstrappedShellSnapshot();

    expect(snapshot.status).toBe("ready");
    expect(snapshot.simulation.daysSimulated).toBe(30);
    expect(snapshot.map.districts).toHaveLength(30);
    expect(snapshot.map.settlements).toHaveLength(10);
    expect(snapshot.districtList.rows).toHaveLength(30);
    expect(snapshot.m3Appointment.offices).toHaveLength(3);
    expect(snapshot.m3Appointment.bulkPreview.eligibleCount).toBe(2);
    expect(snapshot.districtList.provenance.kind).toBe("simulation-read-model");
    expect(snapshot.revision).toBe(snapshot.simulation.finalRevision);
    expect(JSON.stringify(snapshot)).not.toContain("WorldState");
  });

  it("renders React from read model snapshots without authority-bearing state", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const markup = renderToStaticMarkup(
      <ClientShellView
        snapshot={snapshot}
        mapMode="seasonal"
        zoomLevel={1}
        selectedEntity={{ kind: "district", districtId: createClientDistrictId(1) }}
        onMapModeChange={() => undefined}
        onZoomLevelChange={() => undefined}
        onSelectedEntityChange={() => undefined}
        onM3CommandSubmit={() => undefined}
        m3CommandStatus={null}
        mapSurface={
          <div aria-label="M2 prototype map viewport" data-renderer-owner="map-renderer" />
        }
      />
    );

    expect(markup).toContain("Monsoon Sovereigns");
    expect(markup).toContain("Prototype District 001");
    expect(markup).toContain(snapshot.simulation.stateHash);
    expect(markup).toContain('data-renderer-owner="map-renderer"');
    expect(markup).toContain('data-district-count="30"');
    expect(markup).toContain('data-settlement-count="10"');
    expect(markup).toContain('data-row-count="30"');
    expect(markup).toContain('aria-label="M3 appointment workspace"');
    expect(markup).toContain('data-bulk-eligible-count="2"');
  });

  it("rebuilds the Pixi scene shell from the read model", () => {
    const snapshot = createBootstrappedShellSnapshot();
    const stage = createMemoryPixiSceneLayer();
    const scene = createPixiMapScene(stage, createMemoryPixiMapNodeFactory());

    scene.rebuild(snapshot.map);
    const anchorLayer = getChildLayer(stage, 4);
    expect(stage.children.length).toBe(5);
    expect(anchorLayer.children.length).toBe(snapshot.map.anchors.length);

    scene.applyDelta({
      kind: "replace-read-model",
      snapshot: {
        ...snapshot.map,
        districts: snapshot.map.districts.slice(0, 2),
        settlements: snapshot.map.settlements.slice(0, 1),
        routes: snapshot.map.routes.slice(0, 1),
        anchors: snapshot.map.anchors.slice(0, 1)
      },
      viewport: {
        mode: "routes",
        zoomLevel: 1.8,
        selectedEntity: {
          kind: "district",
          districtId:
            snapshot.map.districts[0]?.districtId ?? snapshot.districtList.selectedDistrictId
        }
      }
    });
    expect(getChildLayer(stage, 0).children.length).toBe(2);
    expect(getChildLayer(stage, 2).children.length).toBe(1);
    expect(anchorLayer.children.length).toBe(1);

    scene.destroy();
  });
});

function getChildLayer(layer: PixiSceneLayer, index: number): PixiSceneLayer {
  const child = layer.children[index];
  if (!isPixiSceneLayer(child)) {
    throw new Error("Expected the Pixi scene shell to attach child layers.");
  }

  return child;
}

function isPixiSceneLayer(value: unknown): value is PixiSceneLayer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "children" in value && "addChild" in value && "removeChildren" in value;
}

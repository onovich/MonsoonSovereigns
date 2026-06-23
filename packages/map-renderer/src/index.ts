import type {
  ClientMapAnchorTone,
  ClientMapReadModelSnapshot,
  ClientReadModelRevision
} from "@monsoon/client-core";

export interface MapRenderPlan {
  readonly revision: ClientReadModelRevision;
  readonly bounds: {
    readonly widthInMapUnits: number;
    readonly heightInMapUnits: number;
  };
  readonly anchors: readonly MapAnchorRenderInstruction[];
}

export interface MapAnchorRenderInstruction {
  readonly id: string;
  readonly label: string;
  readonly xInMapUnits: number;
  readonly yInMapUnits: number;
  readonly radiusInMapUnits: number;
  readonly fillColor: number;
}

export interface PixiMapScene {
  readonly stage: PixiSceneLayer;
  rebuild(snapshot: ClientMapReadModelSnapshot): void;
  destroy(): void;
}

export interface PixiSceneNode {
  destroy(): void;
}

export interface PixiSceneLayer<TNode extends PixiSceneNode = PixiSceneNode> extends PixiSceneNode {
  readonly children: readonly TNode[];
  addChild(child: TNode): TNode;
  removeChildren(): TNode[];
}

export interface PixiAnchorMarkerFactory<TNode extends PixiSceneNode = PixiSceneNode> {
  createAnchorMarker(instruction: MapAnchorRenderInstruction): TNode;
}

const ANCHOR_RADIUS_IN_MAP_UNITS = 10;

const toneFillColor: Readonly<Record<ClientMapAnchorTone, number>> = {
  primary: 0x2f6f73,
  secondary: 0xb88746,
  muted: 0x6d7280
};

export function buildMapRenderPlan(snapshot: ClientMapReadModelSnapshot): MapRenderPlan {
  return {
    revision: snapshot.revision,
    bounds: snapshot.bounds,
    anchors: snapshot.anchors.map((anchor) => ({
      id: anchor.id,
      label: anchor.label,
      xInMapUnits: anchor.xInMapUnits,
      yInMapUnits: anchor.yInMapUnits,
      radiusInMapUnits: ANCHOR_RADIUS_IN_MAP_UNITS,
      fillColor: toneFillColor[anchor.tone]
    }))
  };
}

export function createPixiMapScene(
  stage: PixiSceneLayer,
  markerFactory: PixiAnchorMarkerFactory
): PixiMapScene {
  return new ReadModelPixiMapScene(stage, markerFactory);
}

class ReadModelPixiMapScene implements PixiMapScene {
  public readonly stage: PixiSceneLayer;

  private readonly anchorLayer: PixiSceneLayer;
  private readonly markerFactory: PixiAnchorMarkerFactory;

  public constructor(stage: PixiSceneLayer, markerFactory: PixiAnchorMarkerFactory) {
    this.stage = stage;
    this.anchorLayer = createMemoryPixiSceneLayer();
    this.markerFactory = markerFactory;
    this.stage.addChild(this.anchorLayer);
  }

  public rebuild(snapshot: ClientMapReadModelSnapshot): void {
    this.clearAnchors();
    const plan = buildMapRenderPlan(snapshot);

    for (const anchor of plan.anchors) {
      this.anchorLayer.addChild(this.markerFactory.createAnchorMarker(anchor));
    }
  }

  public destroy(): void {
    this.clearAnchors();
    this.anchorLayer.destroy();
  }

  private clearAnchors(): void {
    const removedChildren = this.anchorLayer.removeChildren();
    for (const child of removedChildren) {
      child.destroy();
    }
  }
}

export function createMemoryPixiSceneLayer(): PixiSceneLayer {
  return new MemoryPixiSceneLayer();
}

export function createMemoryPixiAnchorMarkerFactory(): PixiAnchorMarkerFactory {
  return {
    createAnchorMarker: () => new MemoryPixiSceneNode()
  };
}

class MemoryPixiSceneLayer implements PixiSceneLayer {
  public readonly children: PixiSceneNode[] = [];

  public addChild(child: PixiSceneNode): PixiSceneNode {
    this.children.push(child);
    return child;
  }

  public removeChildren(): PixiSceneNode[] {
    return this.children.splice(0, this.children.length);
  }

  public destroy(): void {
    for (const child of this.removeChildren()) {
      child.destroy();
    }
  }
}

class MemoryPixiSceneNode implements PixiSceneNode {
  public destroy(): void {
    return;
  }
}

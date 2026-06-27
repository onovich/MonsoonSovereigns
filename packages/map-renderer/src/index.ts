import {
  createClientDistrictId,
  createClientMapAnchorId,
  createClientReadModelRevision,
  createClientSettlementId
} from "@monsoon/client-core";
import type {
  ClientDistrictRouteStatus,
  ClientMapAnchorTone,
  ClientMapDistrictReadModel,
  ClientMapEntitySelection,
  ClientMapMode,
  ClientMapReadModelSnapshot,
  ClientMapRouteReadModel,
  ClientMapSettlementReadModel,
  ClientReadModelRevision
} from "@monsoon/client-core";
import { loadPixiRuntimeModule } from "./pixi-runtime.mjs";

export interface MapRenderViewport {
  readonly mode: ClientMapMode;
  readonly zoomLevel: number;
  readonly selectedEntity: ClientMapEntitySelection | null;
}

export interface MapRenderPlan {
  readonly revision: ClientReadModelRevision;
  readonly bounds: {
    readonly widthInMapUnits: number;
    readonly heightInMapUnits: number;
  };
  readonly mode: ClientMapMode;
  readonly zoomLevel: number;
  readonly anchors: readonly MapAnchorRenderInstruction[];
  readonly districts: readonly MapDistrictRenderInstruction[];
  readonly settlements: readonly MapSettlementRenderInstruction[];
  readonly routes: readonly MapRouteRenderInstruction[];
  readonly labels: readonly MapLabelRenderInstruction[];
}

export interface M6AlphaMapCandidateReadModelOptions {
  readonly candidateSourceId: string;
  readonly revision?: number;
}

export interface M6AlphaMapCandidateReadPayloadV0 {
  readonly candidates: readonly M6AlphaMapCandidateReadCandidateV0[];
}

export interface M6AlphaMapCandidateReadCandidateV0 {
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly sourceLabel: "HISTORICAL" | "INFERRED" | "COMPOSITE" | "FICTIONAL";
  readonly reviewNotes: readonly string[];
  readonly bounds: {
    readonly widthInMapUnits: number;
    readonly heightInMapUnits: number;
  };
  readonly districts: readonly M6AlphaMapCandidateReadDistrictV0[];
  readonly settlements: readonly M6AlphaMapCandidateReadSettlementV0[];
  readonly routes: readonly M6AlphaMapCandidateReadRouteV0[];
}

export interface M6AlphaMapCandidateReadPointV0 {
  readonly x: number;
  readonly y: number;
}

export interface M6AlphaMapCandidateReadDistrictV0 {
  readonly id: number;
  readonly sourceId: string;
  readonly displayNameKey: string;
  readonly landWaterClass: "land" | "water" | "coastal-interface";
  readonly renderOrder: number;
  readonly anchor: M6AlphaMapCandidateReadPointV0;
  readonly polygon: readonly M6AlphaMapCandidateReadPointV0[];
}

export interface M6AlphaMapCandidateReadSettlementV0 {
  readonly id: number;
  readonly districtId: number;
  readonly displayNameKey: string;
  readonly renderOrder: number;
  readonly anchor: M6AlphaMapCandidateReadPointV0;
}

export interface M6AlphaMapCandidateReadRouteV0 {
  readonly id: number;
  readonly routeKind: "road" | "river" | "coast";
  readonly waterClass: "land" | "water" | "mixed";
  readonly renderOrder: number;
  readonly fromDistrictId: number;
  readonly toDistrictId: number;
  readonly points: readonly M6AlphaMapCandidateReadPointV0[];
}

export interface MapPointRenderInstruction {
  readonly xInMapUnits: number;
  readonly yInMapUnits: number;
}

export interface MapAnchorRenderInstruction extends MapPointRenderInstruction {
  readonly id: string;
  readonly label: string;
  readonly radiusInMapUnits: number;
  readonly fillColor: number;
}

export interface MapDistrictRenderInstruction {
  readonly id: string;
  readonly label: string;
  readonly polygon: readonly MapPointRenderInstruction[];
  readonly fillColor: number;
  readonly strokeColor: number;
  readonly isSelected: boolean;
}

export interface MapSettlementRenderInstruction extends MapPointRenderInstruction {
  readonly id: string;
  readonly label: string;
  readonly districtId: number;
  readonly radiusInMapUnits: number;
  readonly fillColor: number;
  readonly isSelected: boolean;
}

export interface MapRouteRenderInstruction {
  readonly id: string;
  readonly points: readonly MapPointRenderInstruction[];
  readonly strokeColor: number;
  readonly widthInMapUnits: number;
  readonly isSelected: boolean;
}

export interface MapLabelRenderInstruction extends MapPointRenderInstruction {
  readonly id: string;
  readonly label: string;
  readonly tone: "district" | "settlement";
}

export type MapRendererDelta = {
  readonly kind: "replace-read-model";
  readonly snapshot: ClientMapReadModelSnapshot;
  readonly viewport: MapRenderViewport;
};

export interface MountedPixiMapRenderer {
  readonly canvas: HTMLCanvasElement;
  applyDelta(delta: MapRendererDelta): void;
  rebuild(snapshot: ClientMapReadModelSnapshot, viewport?: Partial<MapRenderViewport>): void;
  destroy(): void;
}

export interface MountPixiMapRendererOptions {
  readonly host: HTMLElement;
  readonly initialSnapshot: ClientMapReadModelSnapshot;
  readonly viewport: MapRenderViewport;
  readonly onSelectEntity: (selection: ClientMapEntitySelection) => void;
  readonly signal?: AbortSignal;
}

export interface PixiMapScene {
  readonly stage: PixiSceneLayer;
  rebuild(snapshot: ClientMapReadModelSnapshot, viewport?: Partial<MapRenderViewport>): void;
  applyDelta(delta: MapRendererDelta): void;
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

export interface PixiMapNodeFactory<TNode extends PixiSceneNode = PixiSceneNode> {
  createAnchorMarker(instruction: MapAnchorRenderInstruction): TNode;
  createDistrictPolygon(instruction: MapDistrictRenderInstruction): TNode;
  createSettlementMarker(instruction: MapSettlementRenderInstruction): TNode;
  createRouteSegment(instruction: MapRouteRenderInstruction): TNode;
  createMapLabel(instruction: MapLabelRenderInstruction): TNode;
}

export interface PixiAnchorMarkerFactory<TNode extends PixiSceneNode = PixiSceneNode> {
  createAnchorMarker(instruction: MapAnchorRenderInstruction): TNode;
}

interface PixiRuntimeModule {
  readonly Application: PixiApplicationConstructor;
  readonly Container: PixiContainerConstructor;
  readonly Graphics: PixiGraphicsConstructor;
  readonly Polygon: PixiPolygonConstructor;
  readonly Text: PixiTextConstructor;
}

interface PixiApplicationConstructor {
  new (): PixiApplication;
}

interface PixiApplication {
  readonly canvas: HTMLCanvasElement;
  readonly stage: PixiContainer;
  init(options: PixiApplicationInitOptions): Promise<void>;
  render(): void;
  destroy(rendererOptions?: unknown, options?: unknown): void;
}

interface PixiApplicationInitOptions {
  readonly antialias: boolean;
  readonly autoDensity: boolean;
  readonly backgroundAlpha: number;
  readonly height: number;
  readonly preference: readonly ["webgl"];
  readonly preferWebGLVersion: 2;
  readonly resolution: number;
  readonly width: number;
}

interface PixiContainerConstructor {
  new (): PixiContainer;
}

interface PixiDisplayObject {
  destroy(options?: unknown): void;
}

interface PixiContainer extends PixiDisplayObject {
  readonly position: PixiPointController;
  readonly scale: PixiScaleController;
  addChild<TChild extends PixiDisplayObject>(child: TChild): TChild;
  removeChildren(): PixiDisplayObject[];
}

interface PixiScaleController {
  set(value: number): void;
}

interface PixiPointController {
  readonly x: number;
  readonly y: number;
  set(x: number, y: number): void;
}

interface PixiGraphicsConstructor {
  new (): PixiGraphics;
}

interface PixiGraphics extends PixiDisplayObject {
  cursor?: string;
  eventMode: "none" | "static";
  hitArea?: unknown;
  circle(x: number, y: number, radius: number): this;
  fill(style: PixiFillStyle): this;
  lineTo(x: number, y: number): this;
  moveTo(x: number, y: number): this;
  on(eventName: "pointerdown", callback: () => void): this;
  poly(points: readonly number[]): this;
  stroke(style: PixiStrokeStyle): this;
}

interface PixiFillStyle {
  readonly color: number;
}

interface PixiStrokeStyle {
  readonly alpha?: number;
  readonly color: number;
  readonly width: number;
}

interface PixiPolygonConstructor {
  new (points: readonly number[]): unknown;
}

interface PixiTextConstructor {
  new (options: PixiTextOptions): PixiText;
}

interface PixiText extends PixiDisplayObject {
  eventMode: "none";
  readonly anchor: PixiScaleController;
  readonly position: PixiPointController;
}

interface PixiTextOptions {
  readonly text: string;
  readonly style: PixiTextStyle;
}

interface PixiTextStyle {
  readonly fill: number;
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight: string;
}

const ANCHOR_RADIUS_IN_MAP_UNITS = 10;
const SETTLEMENT_RADIUS_IN_MAP_UNITS = 8;
const HOST_LAYOUT_TIMEOUT_FRAMES = 90;
const MINIMUM_PIXI_SURFACE_SIZE_PX = 1;

const defaultViewport: MapRenderViewport = {
  mode: "seasonal",
  zoomLevel: 1,
  selectedEntity: null
};

const toneFillColor: Readonly<Record<ClientMapAnchorTone, number>> = {
  primary: 0x2f6f73,
  secondary: 0xb88746,
  muted: 0x6d7280
};

export function buildMapRenderPlan(
  snapshot: ClientMapReadModelSnapshot,
  viewport: Partial<MapRenderViewport> = {}
): MapRenderPlan {
  const resolvedViewport = resolveViewport(viewport);

  return {
    revision: snapshot.revision,
    bounds: snapshot.bounds,
    mode: resolvedViewport.mode,
    zoomLevel: resolvedViewport.zoomLevel,
    anchors: snapshot.anchors.map((anchor) => ({
      id: anchor.id,
      label: anchor.label,
      xInMapUnits: anchor.xInMapUnits,
      yInMapUnits: anchor.yInMapUnits,
      radiusInMapUnits: ANCHOR_RADIUS_IN_MAP_UNITS,
      fillColor: toneFillColor[anchor.tone]
    })),
    districts: snapshot.districts.map((district) =>
      buildDistrictInstruction(district, resolvedViewport)
    ),
    settlements: snapshot.settlements.map((settlement) =>
      buildSettlementInstruction(settlement, resolvedViewport)
    ),
    routes: snapshot.routes.map((route) => buildRouteInstruction(route, resolvedViewport)),
    labels: buildLabelInstructions(snapshot, resolvedViewport)
  };
}

export function createM6AlphaMapCandidateReadModelSnapshot(
  pack: M6AlphaMapCandidateReadPayloadV0,
  options: M6AlphaMapCandidateReadModelOptions
): ClientMapReadModelSnapshot {
  const candidate = pack.candidates.find((entry) => entry.sourceId === options.candidateSourceId);
  if (candidate === undefined) {
    throw new Error(`M6 alpha map candidate ${options.candidateSourceId} was not found.`);
  }

  const districts = sortRuntimeDistrictsForRender(candidate.districts)
    .map((district) => buildCandidateDistrictReadModel(district))
    .sort((left, right) => Number(left.districtId) - Number(right.districtId));
  const districtById = new Map(
    districts.map((district) => [Number(district.districtId), district])
  );
  const settlements = [...candidate.settlements]
    .sort(
      (left, right) => left.renderOrder - right.renderOrder || Number(left.id) - Number(right.id)
    )
    .map((settlement) => ({
      settlementId: createClientSettlementId(Number(settlement.id)),
      districtId: createClientDistrictId(Number(settlement.districtId)),
      displayName: settlement.displayNameKey,
      anchor: {
        xInMapUnits: settlement.anchor.x,
        yInMapUnits: settlement.anchor.y
      }
    }));
  const routes = sortRuntimeRoutesForRender(candidate.routes)
    .map((route) => buildCandidateRouteReadModel(route, districtById))
    .sort((left, right) => Number(left.originDistrictId) - Number(right.originDistrictId));

  return {
    revision: createClientReadModelRevision(options.revision ?? 0),
    bounds: candidate.bounds,
    anchors: buildCandidateAnchors(candidate),
    districts,
    settlements,
    routes
  };
}

export function paintMapRenderPlanToCanvas(canvas: HTMLCanvasElement, plan: MapRenderPlan): void {
  const context = canvas.getContext("2d");
  if (context === null) {
    throw new Error("Map canvas 2D context is unavailable.");
  }

  const devicePixelRatio = globalThis.devicePixelRatio ?? 1;
  const widthPx = Math.max(1, Math.floor(canvas.clientWidth * devicePixelRatio));
  const heightPx = Math.max(1, Math.floor(canvas.clientHeight * devicePixelRatio));
  if (canvas.width !== widthPx || canvas.height !== heightPx) {
    canvas.width = widthPx;
    canvas.height = heightPx;
  }

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  context.fillStyle = "#f7f4ea";
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  const scaleX = canvas.clientWidth / plan.bounds.widthInMapUnits;
  const scaleY = canvas.clientHeight / plan.bounds.heightInMapUnits;

  for (const district of plan.districts) {
    drawDistrict(context, district, scaleX, scaleY);
  }
  for (const route of plan.routes) {
    drawRoute(context, route, scaleX, scaleY);
  }
  for (const settlement of plan.settlements) {
    drawSettlement(context, settlement, scaleX, scaleY);
  }
  for (const label of plan.labels) {
    drawLabel(context, label, scaleX, scaleY);
  }
}

export async function mountPixiMapRenderer(
  options: MountPixiMapRendererOptions
): Promise<MountedPixiMapRenderer> {
  throwIfAborted(options.signal);
  const hostSize = await waitForRenderableHost(options.host, options.signal);
  throwIfAborted(options.signal);

  const pixi = toPixiRuntimeModule(await loadPixiRuntimeModule());
  throwIfAborted(options.signal);

  const app = new pixi.Application();
  try {
    await app.init({
      antialias: true,
      autoDensity: true,
      backgroundAlpha: 0,
      height: hostSize.heightPx,
      preference: ["webgl"],
      preferWebGLVersion: 2,
      resolution: globalThis.devicePixelRatio ?? 1,
      width: hostSize.widthPx
    });
    throwIfAborted(options.signal);

    const renderer = new BrowserPixiMapRenderer(app, pixi, options.onSelectEntity);
    options.host.replaceChildren(app.canvas);
    app.canvas.classList.add("pixi-map__canvas");
    app.canvas.setAttribute("aria-label", "MapRenderer Pixi canvas");
    app.canvas.setAttribute("data-renderer-owner", "map-renderer");
    renderer.applyDelta({
      kind: "replace-read-model",
      snapshot: options.initialSnapshot,
      viewport: options.viewport
    });

    return renderer;
  } catch (error: unknown) {
    destroyPixiApplication(app);
    throw error;
  }
}

export function createPixiMapScene(
  stage: PixiSceneLayer,
  nodeFactory: PixiMapNodeFactory
): PixiMapScene;
export function createPixiMapScene(
  stage: PixiSceneLayer,
  markerFactory: PixiAnchorMarkerFactory
): PixiMapScene;
export function createPixiMapScene(
  stage: PixiSceneLayer,
  nodeFactory: PixiMapNodeFactory | PixiAnchorMarkerFactory
): PixiMapScene {
  return new ReadModelPixiMapScene(stage, completeNodeFactory(nodeFactory));
}

class ReadModelPixiMapScene implements PixiMapScene {
  public readonly stage: PixiSceneLayer;

  private readonly districtLayer: PixiSceneLayer;
  private readonly routeLayer: PixiSceneLayer;
  private readonly settlementLayer: PixiSceneLayer;
  private readonly labelLayer: PixiSceneLayer;
  private readonly anchorLayer: PixiSceneLayer;
  private readonly nodeFactory: PixiMapNodeFactory;

  public constructor(stage: PixiSceneLayer, nodeFactory: PixiMapNodeFactory) {
    this.stage = stage;
    this.districtLayer = createMemoryPixiSceneLayer();
    this.routeLayer = createMemoryPixiSceneLayer();
    this.settlementLayer = createMemoryPixiSceneLayer();
    this.labelLayer = createMemoryPixiSceneLayer();
    this.anchorLayer = createMemoryPixiSceneLayer();
    this.nodeFactory = nodeFactory;
    this.stage.addChild(this.districtLayer);
    this.stage.addChild(this.routeLayer);
    this.stage.addChild(this.settlementLayer);
    this.stage.addChild(this.labelLayer);
    this.stage.addChild(this.anchorLayer);
  }

  public rebuild(
    snapshot: ClientMapReadModelSnapshot,
    viewport: Partial<MapRenderViewport> = {}
  ): void {
    const plan = buildMapRenderPlan(snapshot, viewport);
    this.applyPlan(plan);
  }

  public applyDelta(delta: MapRendererDelta): void {
    this.applyPlan(buildMapRenderPlan(delta.snapshot, delta.viewport));
  }

  public destroy(): void {
    this.clearLayer(this.districtLayer);
    this.clearLayer(this.routeLayer);
    this.clearLayer(this.settlementLayer);
    this.clearLayer(this.labelLayer);
    this.clearLayer(this.anchorLayer);
    for (const child of this.stage.removeChildren()) {
      child.destroy();
    }
  }

  private applyPlan(plan: MapRenderPlan): void {
    this.clearLayer(this.districtLayer);
    this.clearLayer(this.routeLayer);
    this.clearLayer(this.settlementLayer);
    this.clearLayer(this.labelLayer);
    this.clearLayer(this.anchorLayer);

    for (const district of plan.districts) {
      this.districtLayer.addChild(this.nodeFactory.createDistrictPolygon(district));
    }
    for (const route of plan.routes) {
      this.routeLayer.addChild(this.nodeFactory.createRouteSegment(route));
    }
    for (const settlement of plan.settlements) {
      this.settlementLayer.addChild(this.nodeFactory.createSettlementMarker(settlement));
    }
    for (const label of plan.labels) {
      this.labelLayer.addChild(this.nodeFactory.createMapLabel(label));
    }
    for (const anchor of plan.anchors) {
      this.anchorLayer.addChild(this.nodeFactory.createAnchorMarker(anchor));
    }
  }

  private clearLayer(layer: PixiSceneLayer): void {
    const removedChildren = layer.removeChildren();
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

export function createMemoryPixiMapNodeFactory(): PixiMapNodeFactory {
  return {
    createAnchorMarker: () => new MemoryPixiSceneNode(),
    createDistrictPolygon: () => new MemoryPixiSceneNode(),
    createSettlementMarker: () => new MemoryPixiSceneNode(),
    createRouteSegment: () => new MemoryPixiSceneNode(),
    createMapLabel: () => new MemoryPixiSceneNode()
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

class BrowserPixiMapRenderer implements MountedPixiMapRenderer {
  public readonly canvas: HTMLCanvasElement;

  private readonly app: PixiApplication;
  private readonly pixi: PixiRuntimeModule;
  private readonly rootLayer: PixiContainer;
  private readonly districtLayer: PixiContainer;
  private readonly routeLayer: PixiContainer;
  private readonly settlementLayer: PixiContainer;
  private readonly labelLayer: PixiContainer;
  private readonly onSelectEntity: (selection: ClientMapEntitySelection) => void;

  public constructor(
    app: PixiApplication,
    pixi: PixiRuntimeModule,
    onSelectEntity: (selection: ClientMapEntitySelection) => void
  ) {
    this.app = app;
    this.pixi = pixi;
    this.canvas = app.canvas;
    this.onSelectEntity = onSelectEntity;
    this.rootLayer = new this.pixi.Container();
    this.districtLayer = new this.pixi.Container();
    this.routeLayer = new this.pixi.Container();
    this.settlementLayer = new this.pixi.Container();
    this.labelLayer = new this.pixi.Container();
    this.rootLayer.addChild(this.districtLayer);
    this.rootLayer.addChild(this.routeLayer);
    this.rootLayer.addChild(this.settlementLayer);
    this.rootLayer.addChild(this.labelLayer);
    this.app.stage.addChild(this.rootLayer);
  }

  public applyDelta(delta: MapRendererDelta): void {
    this.applyPlan(buildMapRenderPlan(delta.snapshot, delta.viewport), delta.snapshot);
  }

  public rebuild(
    snapshot: ClientMapReadModelSnapshot,
    viewport: Partial<MapRenderViewport> = {}
  ): void {
    this.applyPlan(buildMapRenderPlan(snapshot, viewport), snapshot);
  }

  public destroy(): void {
    this.clearLayer(this.districtLayer);
    this.clearLayer(this.routeLayer);
    this.clearLayer(this.settlementLayer);
    this.clearLayer(this.labelLayer);
    this.app.destroy({ removeView: true }, { children: true });
  }

  private applyPlan(plan: MapRenderPlan, snapshot: ClientMapReadModelSnapshot): void {
    this.clearLayer(this.districtLayer);
    this.clearLayer(this.routeLayer);
    this.clearLayer(this.settlementLayer);
    this.clearLayer(this.labelLayer);

    const baseScale = Math.min(
      this.canvas.clientWidth / plan.bounds.widthInMapUnits,
      this.canvas.clientHeight / plan.bounds.heightInMapUnits
    );
    const scale = Math.max(0.1, baseScale * plan.zoomLevel);
    this.rootLayer.scale.set(scale);
    this.rootLayer.position.set(
      Math.max(0, (this.canvas.clientWidth - plan.bounds.widthInMapUnits * scale) / 2),
      Math.max(0, (this.canvas.clientHeight - plan.bounds.heightInMapUnits * scale) / 2)
    );

    for (let index = 0; index < plan.districts.length; index += 1) {
      const instruction = plan.districts[index];
      const readModel = snapshot.districts[index];
      if (instruction !== undefined && readModel !== undefined) {
        this.districtLayer.addChild(this.createDistrictPolygon(instruction, readModel));
      }
    }
    for (const route of plan.routes) {
      this.routeLayer.addChild(this.createRouteSegment(route));
    }
    for (let index = 0; index < plan.settlements.length; index += 1) {
      const instruction = plan.settlements[index];
      const readModel = snapshot.settlements[index];
      if (instruction !== undefined && readModel !== undefined) {
        this.settlementLayer.addChild(this.createSettlementMarker(instruction, readModel));
      }
    }
    for (const label of plan.labels) {
      this.labelLayer.addChild(this.createLabel(label));
    }

    this.canvas.setAttribute("data-map-revision", String(plan.revision));
    this.canvas.setAttribute("data-map-mode", plan.mode);
    this.canvas.setAttribute("data-zoom-level", plan.zoomLevel.toFixed(2));
    this.canvas.setAttribute("data-map-scale", scale.toFixed(6));
    this.canvas.setAttribute("data-map-offset-x", this.rootLayer.position.x.toFixed(3));
    this.canvas.setAttribute("data-map-offset-y", this.rootLayer.position.y.toFixed(3));
    this.canvas.setAttribute("data-district-count", plan.districts.length.toString());
    this.canvas.setAttribute("data-settlement-count", plan.settlements.length.toString());
    this.canvas.setAttribute("data-route-count", plan.routes.length.toString());
    this.canvas.setAttribute("data-label-count", plan.labels.length.toString());
    this.app.render();
  }

  private createDistrictPolygon(
    instruction: MapDistrictRenderInstruction,
    readModel: ClientMapDistrictReadModel
  ): PixiGraphics {
    const polygonPoints = instruction.polygon.flatMap((point) => [
      point.xInMapUnits,
      point.yInMapUnits
    ]);
    const graphics = new this.pixi.Graphics()
      .poly(polygonPoints)
      .fill({ color: instruction.fillColor })
      .stroke({
        color: instruction.strokeColor,
        width: instruction.isSelected ? 4 : 1.5
      });
    graphics.eventMode = "static";
    graphics.cursor = "pointer";
    graphics.hitArea = new this.pixi.Polygon(polygonPoints);
    graphics.on("pointerdown", () => {
      this.onSelectEntity({ kind: "district", districtId: readModel.districtId });
    });
    return graphics;
  }

  private createRouteSegment(instruction: MapRouteRenderInstruction): PixiGraphics {
    const firstPoint = instruction.points[0];
    const graphics = new this.pixi.Graphics();
    if (firstPoint === undefined) {
      return graphics;
    }

    graphics.moveTo(firstPoint.xInMapUnits, firstPoint.yInMapUnits);
    for (const point of instruction.points.slice(1)) {
      graphics.lineTo(point.xInMapUnits, point.yInMapUnits);
    }
    graphics.stroke({
      color: instruction.strokeColor,
      alpha: instruction.isSelected ? 0.95 : 0.58,
      width: instruction.widthInMapUnits
    });
    graphics.eventMode = "none";
    return graphics;
  }

  private createSettlementMarker(
    instruction: MapSettlementRenderInstruction,
    readModel: ClientMapSettlementReadModel
  ): PixiGraphics {
    const graphics = new this.pixi.Graphics()
      .circle(instruction.xInMapUnits, instruction.yInMapUnits, instruction.radiusInMapUnits)
      .fill({ color: instruction.fillColor })
      .stroke({ color: 0x4b5b63, width: instruction.isSelected ? 3 : 2 });
    graphics.eventMode = "static";
    graphics.cursor = "pointer";
    graphics.on("pointerdown", () => {
      this.onSelectEntity({
        kind: "settlement",
        settlementId: readModel.settlementId,
        districtId: readModel.districtId
      });
    });
    return graphics;
  }

  private createLabel(instruction: MapLabelRenderInstruction): PixiText {
    const text = new this.pixi.Text({
      text: instruction.label.replace("Prototype ", ""),
      style: {
        fill: instruction.tone === "district" ? 0x172126 : 0x4c5b63,
        fontFamily: "Arial, sans-serif",
        fontSize: instruction.tone === "district" ? 11 : 10,
        fontWeight: "700"
      }
    });
    text.anchor.set(0.5);
    text.position.set(instruction.xInMapUnits, instruction.yInMapUnits);
    text.eventMode = "none";
    return text;
  }

  private clearLayer(layer: PixiContainer): void {
    const children = layer.removeChildren();
    for (const child of children) {
      child.destroy({ children: true });
    }
  }
}

function toPixiRuntimeModule(value: unknown): PixiRuntimeModule {
  if (!isRecord(value)) {
    throw new Error("Pixi runtime module is unavailable.");
  }

  const application = value["Application"];
  const container = value["Container"];
  const graphics = value["Graphics"];
  const polygon = value["Polygon"];
  const text = value["Text"];
  if (
    typeof application !== "function" ||
    typeof container !== "function" ||
    typeof graphics !== "function" ||
    typeof polygon !== "function" ||
    typeof text !== "function"
  ) {
    throw new Error("Pixi runtime module is missing required constructors.");
  }

  return {
    Application: application as PixiApplicationConstructor,
    Container: container as PixiContainerConstructor,
    Graphics: graphics as PixiGraphicsConstructor,
    Polygon: polygon as PixiPolygonConstructor,
    Text: text as PixiTextConstructor
  };
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

interface HostSize {
  readonly widthPx: number;
  readonly heightPx: number;
}

async function waitForRenderableHost(
  host: HTMLElement,
  signal: AbortSignal | undefined
): Promise<HostSize> {
  for (
    let remainingFrames = HOST_LAYOUT_TIMEOUT_FRAMES;
    remainingFrames > 0;
    remainingFrames -= 1
  ) {
    throwIfAborted(signal);
    const widthPx = Math.floor(host.clientWidth);
    const heightPx = Math.floor(host.clientHeight);
    if (widthPx >= MINIMUM_PIXI_SURFACE_SIZE_PX && heightPx >= MINIMUM_PIXI_SURFACE_SIZE_PX) {
      return { widthPx, heightPx };
    }
    await waitForNextAnimationFrame(signal);
  }

  throw new Error("MapRenderer host did not receive a renderable layout size.");
}

async function waitForNextAnimationFrame(signal: AbortSignal | undefined): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const frameId = globalThis.requestAnimationFrame(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    });

    function handleAbort(): void {
      globalThis.cancelAnimationFrame(frameId);
      reject(createAbortError());
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted === true) {
    throw createAbortError();
  }
}

function createAbortError(): Error {
  return new Error("MapRenderer mount was aborted.");
}

function destroyPixiApplication(app: PixiApplication): void {
  try {
    app.destroy({ removeView: true }, { children: true });
  } catch {
    return;
  }
}

function resolveViewport(viewport: Partial<MapRenderViewport>): MapRenderViewport {
  return {
    mode: viewport.mode ?? defaultViewport.mode,
    zoomLevel: viewport.zoomLevel ?? defaultViewport.zoomLevel,
    selectedEntity: viewport.selectedEntity ?? defaultViewport.selectedEntity
  };
}

function buildDistrictInstruction(
  district: ClientMapDistrictReadModel,
  viewport: MapRenderViewport
): MapDistrictRenderInstruction {
  const isSelected =
    viewport.selectedEntity?.kind === "district" &&
    viewport.selectedEntity.districtId === district.districtId;

  return {
    id: `district-${district.districtId}`,
    label: district.displayName,
    polygon: district.polygon,
    fillColor: districtFillColor(district, viewport.mode),
    strokeColor: isSelected ? 0x172126 : 0x91a0a6,
    isSelected
  };
}

function buildSettlementInstruction(
  settlement: ClientMapSettlementReadModel,
  viewport: MapRenderViewport
): MapSettlementRenderInstruction {
  const isSelected =
    viewport.selectedEntity?.kind === "settlement" &&
    viewport.selectedEntity.settlementId === settlement.settlementId;

  return {
    id: `settlement-${settlement.settlementId}`,
    label: settlement.displayName,
    districtId: settlement.districtId,
    xInMapUnits: settlement.anchor.xInMapUnits,
    yInMapUnits: settlement.anchor.yInMapUnits,
    radiusInMapUnits: SETTLEMENT_RADIUS_IN_MAP_UNITS,
    fillColor: isSelected ? 0x172126 : 0xf7f4ea,
    isSelected
  };
}

function buildRouteInstruction(
  route: ClientMapRouteReadModel,
  viewport: MapRenderViewport
): MapRouteRenderInstruction {
  const isSelected =
    viewport.selectedEntity?.kind === "district" &&
    (viewport.selectedEntity.districtId === route.originDistrictId ||
      viewport.selectedEntity.districtId === route.destinationDistrictId);

  return {
    id: `route-${route.originDistrictId}-${route.destinationDistrictId}`,
    points: route.points,
    strokeColor: routeStrokeColor(route.status),
    widthInMapUnits: isSelected || viewport.mode === "routes" ? 4 : 2,
    isSelected
  };
}

function buildLabelInstructions(
  snapshot: ClientMapReadModelSnapshot,
  viewport: MapRenderViewport
): readonly MapLabelRenderInstruction[] {
  if (viewport.zoomLevel < 1.35) {
    return [];
  }

  const labels: MapLabelRenderInstruction[] = snapshot.districts.map((district) => ({
    id: `district-label-${district.districtId}`,
    label: district.displayName,
    xInMapUnits: district.anchor.xInMapUnits,
    yInMapUnits: district.anchor.yInMapUnits - 12,
    tone: "district"
  }));

  if (viewport.zoomLevel >= 1.8) {
    for (const settlement of snapshot.settlements) {
      labels.push({
        id: `settlement-label-${settlement.settlementId}`,
        label: settlement.displayName,
        xInMapUnits: settlement.anchor.xInMapUnits,
        yInMapUnits: settlement.anchor.yInMapUnits + 16,
        tone: "settlement"
      });
    }
  }

  return labels;
}

function buildCandidateDistrictReadModel(
  district: M6AlphaMapCandidateReadDistrictV0
): ClientMapDistrictReadModel {
  const districtId = createClientDistrictId(Number(district.id));
  return {
    districtId,
    displayName: district.displayNameKey,
    anchor: {
      xInMapUnits: district.anchor.x,
      yInMapUnits: district.anchor.y
    },
    polygon: district.polygon.map((point) => ({
      xInMapUnits: point.x,
      yInMapUnits: point.y
    })),
    seasonal: {
      monthOfYear: 1,
      agriculturePhase: district.landWaterClass,
      label: `map-candidate:${district.landWaterClass}`
    },
    population: 0,
    availableLabor: 0,
    grainStock: 0,
    cashStock: 0,
    route: {
      status: "unreachable",
      destinationDistrictId: districtId,
      stockAmount: 0,
      totalCost: null,
      bottleneckCapacity: null,
      edgeCount: 0,
      routeKinds: []
    }
  };
}

function buildCandidateRouteReadModel(
  route: M6AlphaMapCandidateReadRouteV0,
  districtById: ReadonlyMap<number, ClientMapDistrictReadModel>
): ClientMapRouteReadModel {
  const originDistrictId = createClientDistrictId(Number(route.fromDistrictId));
  const destinationDistrictId = createClientDistrictId(Number(route.toDistrictId));
  const origin = districtById.get(Number(route.fromDistrictId));
  const destination = districtById.get(Number(route.toDistrictId));
  const points =
    route.points.length > 0
      ? route.points.map((point) => ({
          xInMapUnits: point.x,
          yInMapUnits: point.y
        }))
      : [origin?.anchor, destination?.anchor].filter(isMapPoint);
  const status = mapCandidateRouteStatus(route);

  return {
    originDistrictId,
    destinationDistrictId,
    status,
    stockAmount: 0,
    totalCost: status === "unreachable" ? null : route.renderOrder,
    bottleneckCapacity: null,
    routeKinds: [route.routeKind],
    points
  };
}

function buildCandidateAnchors(
  candidate: M6AlphaMapCandidateReadCandidateV0
): readonly MapAnchorCompatibleReadModel[] {
  return [
    {
      id: createClientMapAnchorId("alpha-map-candidate"),
      label: candidate.displayNameKey,
      xInMapUnits: Math.floor(candidate.bounds.widthInMapUnits / 2),
      yInMapUnits: 24,
      tone: "primary"
    },
    {
      id: createClientMapAnchorId("alpha-map-source-label"),
      label: candidate.sourceLabel,
      xInMapUnits: 88,
      yInMapUnits: candidate.bounds.heightInMapUnits - 28,
      tone: candidate.sourceLabel === "FICTIONAL" ? "muted" : "secondary"
    },
    {
      id: createClientMapAnchorId("alpha-map-review-note"),
      label: candidate.reviewNotes[0] ?? "Alpha map candidate review required.",
      xInMapUnits: candidate.bounds.widthInMapUnits - 128,
      yInMapUnits: candidate.bounds.heightInMapUnits - 28,
      tone: "muted"
    }
  ];
}

type MapAnchorCompatibleReadModel = ClientMapReadModelSnapshot["anchors"][number];

function mapCandidateRouteStatus(route: M6AlphaMapCandidateReadRouteV0): ClientDistrictRouteStatus {
  if (route.routeKind === "road" && route.waterClass === "land") {
    return "reachable";
  }
  if (route.waterClass === "mixed") {
    return "capacity-exceeded";
  }
  return "reachable";
}

function sortRuntimeDistrictsForRender(
  districts: readonly M6AlphaMapCandidateReadDistrictV0[]
): readonly M6AlphaMapCandidateReadDistrictV0[] {
  return [...districts].sort(
    (left, right) => left.renderOrder - right.renderOrder || Number(left.id) - Number(right.id)
  );
}

function sortRuntimeRoutesForRender(
  routes: readonly M6AlphaMapCandidateReadRouteV0[]
): readonly M6AlphaMapCandidateReadRouteV0[] {
  return [...routes].sort(
    (left, right) => left.renderOrder - right.renderOrder || Number(left.id) - Number(right.id)
  );
}

function isMapPoint(
  value: ClientMapDistrictReadModel["anchor"] | undefined
): value is ClientMapDistrictReadModel["anchor"] {
  return value !== undefined;
}

function districtFillColor(district: ClientMapDistrictReadModel, mode: ClientMapMode): number {
  switch (mode) {
    case "seasonal":
      return seasonalFillColor(district.seasonal.agriculturePhase);
    case "economy":
      return district.cashStock >= district.grainStock ? 0xb88746 : 0x8aa05a;
    case "routes":
      return district.route.status === "reachable" ? 0xd7e6df : 0xe6d1c6;
  }
}

function seasonalFillColor(phase: string): number {
  switch (phase) {
    case "fallow":
      return 0xd9d1be;
    case "planting":
      return 0x9ab57a;
    case "growing":
      return 0x5f9f72;
    case "harvest":
      return 0xd6aa4a;
    case "water":
      return 0x9fc9d3;
    case "coastal-interface":
      return 0xc6d4ba;
    default:
      return 0xd9d1be;
  }
}

function routeStrokeColor(status: ClientMapRouteReadModel["status"]): number {
  switch (status) {
    case "reachable":
      return 0x2f6f73;
    case "capacity-exceeded":
      return 0xb88746;
    case "unreachable":
      return 0xa65b4b;
  }
}

function completeNodeFactory(
  factory: PixiMapNodeFactory | PixiAnchorMarkerFactory
): PixiMapNodeFactory {
  if (
    "createDistrictPolygon" in factory &&
    "createSettlementMarker" in factory &&
    "createRouteSegment" in factory &&
    "createMapLabel" in factory
  ) {
    return factory;
  }

  const fallback = createMemoryPixiMapNodeFactory();
  return {
    createAnchorMarker: factory.createAnchorMarker,
    createDistrictPolygon: fallback.createDistrictPolygon,
    createSettlementMarker: fallback.createSettlementMarker,
    createRouteSegment: fallback.createRouteSegment,
    createMapLabel: fallback.createMapLabel
  };
}

function drawDistrict(
  context: CanvasRenderingContext2D,
  district: MapDistrictRenderInstruction,
  scaleX: number,
  scaleY: number
): void {
  const firstPoint = district.polygon[0];
  if (firstPoint === undefined) {
    return;
  }

  context.beginPath();
  context.moveTo(firstPoint.xInMapUnits * scaleX, firstPoint.yInMapUnits * scaleY);
  for (const point of district.polygon.slice(1)) {
    context.lineTo(point.xInMapUnits * scaleX, point.yInMapUnits * scaleY);
  }
  context.closePath();
  context.fillStyle = toCssColor(district.fillColor);
  context.strokeStyle = toCssColor(district.strokeColor);
  context.lineWidth = district.isSelected ? 3 : 1;
  context.fill();
  context.stroke();
}

function drawRoute(
  context: CanvasRenderingContext2D,
  route: MapRouteRenderInstruction,
  scaleX: number,
  scaleY: number
): void {
  const firstPoint = route.points[0];
  if (firstPoint === undefined) {
    return;
  }

  context.beginPath();
  context.moveTo(firstPoint.xInMapUnits * scaleX, firstPoint.yInMapUnits * scaleY);
  for (const point of route.points.slice(1)) {
    context.lineTo(point.xInMapUnits * scaleX, point.yInMapUnits * scaleY);
  }
  context.strokeStyle = toCssColor(route.strokeColor);
  context.lineWidth = route.widthInMapUnits;
  context.globalAlpha = route.isSelected ? 0.95 : 0.55;
  context.stroke();
  context.globalAlpha = 1;
}

function drawSettlement(
  context: CanvasRenderingContext2D,
  settlement: MapSettlementRenderInstruction,
  scaleX: number,
  scaleY: number
): void {
  context.beginPath();
  context.arc(
    settlement.xInMapUnits * scaleX,
    settlement.yInMapUnits * scaleY,
    settlement.radiusInMapUnits,
    0,
    Math.PI * 2
  );
  context.fillStyle = toCssColor(settlement.fillColor);
  context.strokeStyle = settlement.isSelected ? "#172126" : "#5b646a";
  context.lineWidth = settlement.isSelected ? 3 : 2;
  context.fill();
  context.stroke();
}

function drawLabel(
  context: CanvasRenderingContext2D,
  label: MapLabelRenderInstruction,
  scaleX: number,
  scaleY: number
): void {
  context.fillStyle = label.tone === "district" ? "#172126" : "#4c5b63";
  context.font = label.tone === "district" ? "700 11px sans-serif" : "700 10px sans-serif";
  context.textAlign = "center";
  context.fillText(label.label, label.xInMapUnits * scaleX, label.yInMapUnits * scaleY);
}

function toCssColor(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}

import {
  AxisAlign,
  AxisSizing,
  BlendMode,
  BooleanOperation,
  LayoutAlign,
  LayoutMode,
  LayoutPositioning,
  LayoutSizing,
  LayoutWrap,
  LineType,
  MaskType,
  NodeType,
  OverflowDirection,
  StrokeAlign,
  StrokeCap,
  StrokeJoin,
  StyleType,
} from "./enumerators";
import {
  Annotation,
  ArcData,
  Color,
  Component,
  ComponentProperty,
  ComponentPropertyDefinition,
  DevStatus,
  Effect,
  ExportSetting,
  LayoutConstraint,
  LayoutGrid,
  Overrides,
  Paint,
  PaintOverride,
  Path,
  Rectangle,
  StrokeWeights,
  Style,
  Transform,
  TypeStyle,
  VariableAlias,
  Vector,
} from "./properties";

export type NodeData = {
  boundVariables: Record<string, VariableAlias | VariableAlias[] | Record<string, VariableAlias>>;
  children?: NodeData[];
  componentPropertyReferences: Record<string, string>;
  explicitVariableModes: Record<string, string>;
  id: string;
  name: string;
  rotation: number;
  type: NodeType;
  visible: boolean;
};

export type GenericNodeData<Type extends NodeType = NodeType> = {
  type: Type;
};

export type GenericNode<Type extends NodeType = NodeType> = Omit<NodeData, "type"> & GenericNodeData<Type>;

export type NodeDefinitionData<DataType extends GenericNodeData = GenericNodeData> = Partial<
  Omit<GenericNode<DataType["type"]>, "children" | "type" | "id">
> &
  Partial<Omit<DataType, "type">>;

export type DocumentNodeData = GenericNodeData<NodeType.Document>;

export type CanvasNodeData = GenericNodeData<NodeType.Canvas> & {
  backgroundColor: Color;
  exportSettings: ExportSetting[];
};

export type FrameNodeData<Type extends NodeType = NodeType.Frame> = GenericNodeData<Type> & {
  absoluteBoundingBox: Rectangle;
  absoluteRenderBounds: Rectangle;
  annotations: Annotation[];
  blendMode: BlendMode;
  clipsContent: boolean;
  constraints: LayoutConstraint;
  cornerRadius: number;
  cornerSmoothing: number;
  counterAxisAlignContent: AxisAlign;
  counterAxisAlignItems: AxisAlign;
  counterAxisSizingMode: AxisSizing;
  counterAxisSpacing: number;
  devStatus: DevStatus;
  effects: Effect[];
  exportSettings: ExportSetting[];
  fills: Paint[];
  isMask: boolean;
  isMaskOutline: boolean;
  itemReverseZIndex: boolean;
  itemSpacing: number;
  layoutAlign: LayoutAlign;
  layoutGrids: LayoutGrid[];
  layoutMode: LayoutMode;
  layoutPositioning: LayoutPositioning;
  layoutSizingHorizontal: LayoutSizing;
  layoutSizingVertical: LayoutSizing;
  layoutWrap: LayoutWrap;
  locked: boolean;
  maskType: MaskType;
  maxHeight: number;
  maxWidth: number;
  minHeight: number;
  minWidth: number;
  opacity: number;
  overflowDirection: OverflowDirection;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  preserveRatio: boolean;
  primaryAxisAlignItems: AxisAlign;
  primaryAxisSizingMode: AxisSizing;
  rectangleCornerRadii: [number, number, number, number];
  relativeTransform: Transform;
  size: Vector;
  strokeAlign: StrokeAlign;
  strokeDashes: [number, number];
  strokeWeight: number;
  strokes: Paint[];
  strokesIncludedInLayout: boolean;
  styles: Partial<Record<StyleType, string>>;
  targetAspectRatio: Vector;
};

export type GroupNodeData = Omit<FrameNodeData<NodeType.Group>, "layoutGrids">;

export type SectionNodeData = GenericNodeData<NodeType.Section> & {
  absoluteBoundingBox: Rectangle;
  absoluteRenderBounds: Rectangle;
  devStatus: DevStatus;
  fills: Paint[];
  sectionContentsHidden: boolean;
  strokeAlign: StrokeAlign;
  strokeWeight: number;
  strokes: Paint[];
};

export type VectorNodeData<Type extends NodeType = NodeType.Vector> = GenericNodeData<Type> & {
  absoluteBoundingBox: Rectangle;
  absoluteRenderBounds: Rectangle;
  annotations: Annotation[];
  blendMode: BlendMode;
  constraints: LayoutConstraint;
  effects: Effect[];
  exportSettings: ExportSetting[];
  fillGeometry: Path[];
  fillOverrideTableMap: Record<number, PaintOverride>;
  fills: Paint[];
  individualStrokeWeights: StrokeWeights;
  isMask: boolean;
  layoutAlign: LayoutAlign;
  layoutGrow: number;
  locked: boolean;
  opacity: number;
  preserveRatio: boolean;
  relativeTransform: Transform;
  size: Vector;
  strokeAlign: StrokeAlign;
  strokeCap: StrokeCap;
  strokeDashes: [number, number];
  strokeGeometry: Path[];
  strokeJoin: StrokeJoin;
  strokeMiterAngle: number;
  strokeWeight: number;
  strokes: Paint[];
  styles: Partial<Record<StyleType, string>>;
};

export type BooleanOperationNodeData = VectorNodeData<NodeType.BooleanOperation> & {
  booleanOperation: BooleanOperation;
};

export type StarNodeData = VectorNodeData<NodeType.Star>;

export type LineNodeData = VectorNodeData<NodeType.Line>;

export type EllipseNodeData = VectorNodeData<NodeType.Ellipse> & {
  arcData: ArcData;
};

export type RegularPolygonNodeData = VectorNodeData<NodeType.RegularPolygon>;

export type RectangleNodeData = VectorNodeData<NodeType.Rectangle> & {
  cornerRadius: number;
  cornerSmoothing: number;
  rectangleCornerRadii: [number, number, number, number];
};

export type WashiTapeNodeData = VectorNodeData<NodeType.WashiTape>;

export type TextNodeData = Omit<VectorNodeData<NodeType.Text>, "fillOverrideTableMap"> & {
  characters: string;
  style: TypeStyle;
  characterStyleOverrides: number[];
  styleOverrideTable: Record<number, TypeStyle>;
  lineTypes: LineType[];
  lineIndentations: number;
};

export type SliceNodeData = GenericNodeData<NodeType.Slice> & {
  absoluteBoundingBox: Rectangle;
  absoluteRenderBounds: Rectangle;
  exportSettings: ExportSetting[];
  relativeTransform: Transform;
  size: Vector;
};

export type ComponentNodeData = FrameNodeData<NodeType.Component> & {
  componentPropertyDefinitions: Record<string, ComponentPropertyDefinition>;
};

export type ComponentSetNodeData = FrameNodeData<NodeType.ComponentSet> & {
  componentPropertyDefinitions: Record<string, ComponentPropertyDefinition>;
};

export type InstanceNodeData = FrameNodeData<NodeType.Instance> & {
  componentId: string;
  isExposedInstance: boolean;
  exposedInstances: string[];
  componentProperties: Record<string, ComponentProperty>;
  overrides: Overrides[];
};

export type Branch = {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  link_access: string;
};

export type FigmaFile = {
  name: string;
  role: string;
  schemaVersion: number;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: GenericNode<NodeType.Document>;
  components: Record<string, Component>;
  componentSets: Record<string, Component>;
  styles: Record<string, Style>;
  mainFileKey: string;
  branches: Branch[];
};

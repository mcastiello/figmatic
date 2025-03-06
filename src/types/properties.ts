import {
  AnnotationProperty,
  BlendMode,
  ComponentPropertyType,
  ConstraintType,
  DevStatusType,
  EffectType,
  FontStyle,
  FontWeight,
  HorizontalLayoutConstrain,
  LayoutAlign,
  LayoutGridPattern,
  LineHeightUnit,
  NodeType,
  PaintType,
  PropertyTypes,
  ScaleMode,
  StyleType,
  TextAlignHorizontal,
  TextAlignVertical,
  TextAutoResize,
  TextCase,
  TextDecoration,
  TextTruncation,
  VariableScope,
  VariableType,
  VerticalLayoutConstraint,
} from "./enumerators";

export type Component = {
  key: string;
  name: string;
  description: string;
  componentSetId?: string;
};

export type Style = {
  description: string;
  key: string;
  name: string;
  remote: boolean;
  styleType: StyleType;
};

export type StyleData = Style & {
  id: string;
  data: Paint | Effect | TypeStyle;
};

// Properties
export type GenericPropertyData<Type extends PropertyTypes> = {
  type: Type;
};

export type VariableAlias = GenericPropertyData<PropertyTypes.VariableAlias> & {
  id: string;
};

export type Constraint = {
  value: number;
  type: ConstraintType;
};

export type ExportSetting = {
  constraint: Constraint;
  format: string;
  suffix: string;
};

export type RGBColor = {
  r: number;
  g: number;
  b: number;
};

export type Color = RGBColor & {
  a: number;
};

export type ColorStop = {
  boundVariables: Record<string, VariableAlias>;
  color: Color;
  position: number;
};

export type Vector = {
  x: number;
  y: number;
};

export type Rectangle = Vector & {
  width: number;
  height: number;
};

export type Transform = [[number, number, number], [number, number, number]];

export type ImageFilters = {
  contrast: number;
  exposure: number;
  highlights: number;
  saturation: number;
  shadows: number;
  temperature: number;
  tint: number;
};

export type Paint = {
  blendMode: BlendMode;
  boundVariables: Record<string, VariableAlias>;
  color: Color;
  filters?: ImageFilters;
  gifRef?: string;
  gradientHandlePositions?: Vector[];
  gradientStops?: ColorStop[];
  imageRef?: string;
  imageTransform?: Transform;
  opacity: number;
  rotation: number;
  scaleMode: ScaleMode;
  scalingFactor: number;
  type: PaintType;
  visible: boolean;
};

export type PaintOverride = {
  fills: Paint[];
  inheritFillStyleId: string;
};

export type StrokeWeights = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type LayoutConstraint = {
  vertical: VerticalLayoutConstraint;
  horizontal: HorizontalLayoutConstrain;
};

export type LayoutGrid = {
  alignment: LayoutAlign;
  boundVariables: Record<string, VariableAlias>;
  color: Color;
  count: number;
  gutterSize: number;
  offset: number;
  pattern: LayoutGridPattern;
  sectionSize: number;
  visible: boolean;
};

export type Effect = {
  blendMode: BlendMode;
  boundVariables: Record<string, VariableAlias>;
  color: Color;
  offset: Vector;
  radius: number;
  showShadowBehindNode: boolean;
  spread: number;
  type: EffectType;
  visible: boolean;
};

export type DevStatus = {
  type: DevStatusType;
  description: string;
};

export type Annotation = {
  label: string;
  properties: AnnotationProperty[];
};

export type Path = {
  overrideID: number;
  path: string;
  windingRule: string;
};

export type ArcData = {
  startingAngle: number;
  endingAngle: number;
  innerRadius: number;
};

export type Hyperlink = {
  type: HighlightType;
  url: string;
  nodeID: string;
};

export type TypeStyle = {
  fills: Paint[];
  fontFamily: string;
  fontPostScriptName: string;
  fontSize: number; // in px
  fontStyle: string;
  fontWeight: number;
  hyperlink: Hyperlink;
  isOverrideOverTextStyle: boolean;
  italic: boolean;
  letterSpacing: number;
  lineHeightPercent: number;
  lineHeightPercentFontSize: number;
  lineHeightPx: number;
  lineHeightUnit: LineHeightUnit;
  listSpacing: number;
  maxLines: number;
  opentypeFlags: Record<string, number>;
  paragraphIndent: number;
  paragraphSpacing: number;
  semanticItalic: FontStyle;
  semanticWeight: FontWeight;
  textAlignHorizontal: TextAlignHorizontal;
  textAlignVertical: TextAlignVertical;
  textAutoResize: TextAutoResize;
  textCase: TextCase;
  textDecoration: TextDecoration;
  textTruncation: TextTruncation;
};

export type InstanceSwapPreferredValue = {
  type: NodeType.Component | NodeType.ComponentSet;
  key: string;
};

export type ComponentPropertyDefinition = {
  type: ComponentPropertyType;
  defaultValue: boolean | string;
  variantOptions?: string[];
  preferredValues?: InstanceSwapPreferredValue[];
};

export type ComponentProperty = {
  type: ComponentPropertyType;
  defaultValue: boolean | string;
  preferredValues?: InstanceSwapPreferredValue[];
  boundVariables: Record<string, VariableAlias>;
};

export type Overrides = {
  id: string;
  overriddenFields: string[];
};

export type Variable = {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: VariableType;
  valuesByMode: Record<string, boolean | number | string | VariableAlias>;
  description: string;
  scopes: VariableScope[];
};

export type VariableMode = {
  modeId: string;
  name: string;
};

export type VariableCollection = {
  id: string;
  name: string;
  key: string;
  modes: VariableMode[];
  defaultModeId: string;
  variableIds: string[];
};

export enum NodeType {
  BooleanOperation = "BOOLEAN_OPERATION",
  Canvas = "CANVAS",
  Component = "COMPONENT",
  ComponentSet = "COMPONENT_SET",
  Document = "DOCUMENT",
  Ellipse = "ELLIPSE",
  Frame = "FRAME",
  Generic = "NODE",
  Group = "GROUP",
  Instance = "INSTANCE",
  Line = "LINE",
  Rectangle = "RECTANGLE",
  RegularPolygon = "REGULAR_POLYGON",
  Section = "SECTION",
  Slice = "SLICE",
  Star = "STAR",
  Text = "TEXT",
  Vector = "VECTOR",
  WashiTape = "WASHI_TAPE",
}

export enum PropertyTypes {
  VariableAlias = "VARIABLE_ALIAS",
}

export enum ConstraintType {
  Scale = "SCALE",
  Width = "WIDTH",
  Height = "HEIGHT",
}

export enum PaintType {
  Solid = "SOLID",
  GradientLinear = "GRADIENT_LINEAR",
  GradientRadial = "GRADIENT_RADIAL",
  GradientAngular = "GRADIENT_ANGULAR",
  GradientDiamond = "GRADIENT_DIAMOND",
  Image = "IMAGE",
  Emoji = "EMOJI",
  Video = "VIDEO",
}

export enum BlendMode {
  PassThrough = "PASS_THROUGH",
  Normal = "NORMAL",
  Darken = "DARKEN",
  Multiply = "MULTIPLY",
  LinearBurn = "LINEAR_BURN",
  ColorBurn = "COLOR_BURN",
  Lighten = "LIGHTEN",
  Screen = "SCREEN",
  LinearDodge = "LINEAR_DODGE",
  ColorDodge = "COLOR_DODGE",
  Overlay = "OVERLAY",
  SoftLight = "SOFT_LIGHT",
  HardLight = "HARD_LIGHT",
  Difference = "DIFFERENCE",
  Exclusion = "EXCLUSION",
  Hue = "HUE",
  Saturation = "SATURATION",
  Color = "COLOR",
  Luminosity = "LUMINOSITY",
}

export enum ScaleMode {
  Fill = "FILL",
  Fit = "FIT",
  Tile = "TILE",
  Stretch = "STRETCH",
}

export enum StrokeAlign {
  Inside = "INSIDE",
  Outside = "OUTSIDE",
  Center = "CENTER",
}

export enum VerticalLayoutConstraint {
  Top = "TOP", // Node is laid out relative to top of the containing frame
  Bottom = "BOTTOM", // Node is laid out relative to bottom of the containing frame
  Center = "CENTER", // Node is vertically centered relative to containing frame
  TopBottom = "TOP_BOTTOM", //Both top and bottom of node are constrained relative to containing frame (node stretches with frame)
  Scale = "SCALE", // Node scales vertically with containing frame
}

export enum HorizontalLayoutConstrain {
  Left = "LEFT", // Node is laid out relative to left of the containing frame
  Right = "RIGHT", // Node is laid out relative to right of the containing frame
  Center = "CENTER", // Node is horizontally centered relative to containing frame
  LeftRight = "LEFT_RIGHT", // Both left and right of node are constrained relative to containing frame (node stretches with frame)
  Scale = "SCALE", // Node scales horizontally with containing frame
}

export enum LayoutAlign {
  Inherit = "INHERIT",
  Stretch = "STRETCH",
  Min = "MIN",
  Center = "CENTER",
  Max = "MAX",
}

export enum LayoutMode {
  None = "NONE",
  Horizontal = "HORIZONTAL",
  Vertical = "VERTICAL",
}

export enum LayoutSizing {
  Fixed = "FIXED",
  Hug = "HUG",
  Fill = "FILL",
}

export enum LayoutWrap {
  NoWrap = "NO_WRAP",
  Wrap = "WRAP",
}

export enum LayoutPositioning {
  Auto = "AUTO",
  Absolute = "ABSOLUTE",
}

export enum LayoutGridPattern {
  Columns = "COLUMNS", // Vertical grid
  Rows = "ROWS", // Horizontal grid
  Grid = "GRID", // Square grid
}

export enum AxisSizing {
  Fixed = "FIXED",
  Auto = "AUTO",
}

export enum AxisAlign {
  Auto = "AUTO",
  Min = "MIN",
  Center = "CENTER",
  Max = "MAX",
  SpaceBetween = "SPACE_BETWEEN",
  Baseline = "BASELINE",
}

export enum OverflowDirection {
  None = "NONE",
  Horizontal = "HORIZONTAL_SCROLLING",
  Vertical = "VERTICAL_SCROLLING",
  Both = "HORIZONTAL_AND_VERTICAL_SCROLLING",
}

export enum EffectType {
  InnerShadow = "INNER_SHADOW",
  DropShadow = "DROP_SHADOW",
  LayerBlur = "LAYER_BLUR",
  BackgroundBlur = "BACKGROUND_BLUR",
}

export enum MaskType {
  Alpha = "ALPHA", // the mask node's alpha channel will be used to determine the opacity of each pixel in the masked result.
  Vector = "VECTOR", // if the mask node has visible fill paints, every pixel inside the node's fill regions will be fully visible in the masked result. If the mask has visible stroke paints, every pixel inside the node's stroke regions will be fully visible in the masked result.
  Luminance = "LUMINANCE", // the luminance value of each pixel of the mask node will be used to determine the opacity of that pixel in the masked result.
}

export enum StyleType {
  Fill = "FILL",
  Text = "TEXT",
  Effect = "EFFECT",
  Grid = "GRID",
}

export enum DevStatusType {
  ReadyForDev = "READY_FOR_DEV",
  Completed = "COMPLETED",
}

export enum AnnotationProperty {
  Width = "width",
  Height = "height",
  MaxWidth = "maxWidth",
  MinWidth = "minWidth",
  MaxHeight = "maxHeight",
  MinHeight = "minHeight",
  Fills = "fills",
  Strokes = "strokes",
  Effects = "effects",
  StrokeWeight = "strokeWeight",
  CornerRadius = "cornerRadius",
  TextStyleId = "textStyleId",
  TextAlignHorizontal = "textAlignHorizontal",
  FontFamily = "fontFamily",
  FontStyle = "fontStyle",
  FontSize = "fontSize",
  FontWeight = "fontWeight",
  LineHeight = "lineHeight",
  LetterSpacing = "letterSpacing",
  ItemSpacing = "itemSpacing",
  Padding = "padding",
  LayoutMode = "layoutMode",
  AlignItems = "alignItems",
  Opacity = "opacity",
  MainComponent = "mainComponent",
}

export enum StrokeCap {
  None = "NONE",
  Round = "ROUND",
  Square = "SQUARE",
  LineArrow = "LINE_ARROW",
  TriangleArrow = "TRIANGLE_ARROW",
  DiamondFilled = "DIAMOND_FILLED",
  CircleFilled = "CIRCLE_FILLED",
  TriangleFilled = "TRIANGLE_FILLED",
  WashiTape1 = "WASHI_TAPE_1",
  WashiTape2 = "WASHI_TAPE_2",
  WashiTape3 = "WASHI_TAPE_3",
  WashiTape4 = "WASHI_TAPE_4",
  WashiTape5 = "WASHI_TAPE_5",
  WashiTape6 = "WASHI_TAPE_6",
}

export enum StrokeJoin {
  Bevel = "BEVEL",
  Miter = "MITER",
  Round = "ROUND",
}

export enum BooleanOperation {
  Exclude = "EXCLUDE",
  Intersect = "INTERSECT",
  Subtract = "SUBTRACT",
  Union = "UNION",
}

export enum TextCase {
  Lower = "LOWER",
  Original = "ORIGINAL",
  SmallCaps = "SMALL_CAPS",
  SmallCapsForced = "SMALL_CAPS_FORCED",
  Title = "TITLE",
  Upper = "UPPER",
}

export enum TextDecoration {
  None = "NONE",
  Strikethrough = "STRIKETHROUGH",
  Underline = "UNDERLINE",
}

export enum TextAutoResize {
  Height = "HEIGHT",
  None = "NONE",
  WidthHeight = "WIDTH_AND_HEIGHT",
}

export enum TextTruncation {
  Disabled = "DISABLED",
  Enabled = "ENABLED",
}

export enum TextAlignHorizontal {
  Left = "LEFT",
  Right = "RIGHT",
  Center = "CENTER",
  Justified = "JUSTIFIED",
}

export enum TextAlignVertical {
  Top = "TOP",
  Center = "CENTER",
  Bottom = "BOTTOM",
}

export enum HyperlinkType {
  Url = "URL",
  Node = "NODE",
}

export enum LineHeightUnit {
  Pixels = "PIXELS",
  FontSize = "FONT_SIZE_%",
  Intrinsic = "INTRINSIC_%",
}

export enum FontWeight {
  Bold = "BOLD",
  Normal = "NORMAL",
}

export enum FontStyle {
  Italic = "ITALIC",
  Normal = "NORMAL",
}

export enum LineType {
  Ordered = "ORDERED", // Text is an ordered list (numbered)
  Unordered = "UNORDERED", // Text is an unordered list (bulleted)
  None = "NONE", // Text is plain text and not part of any list
}

export enum ComponentPropertyType {
  Boolean = "BOOLEAN",
  InstanceSwap = "INSTANCE_SWAP",
  Text = "TEXT",
  Variant = "VARIANT",
}

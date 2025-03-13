import { ExportFormat, NodeType, TokenStyleTypes } from "./enumerators";
import type { StyledNodeProperties } from "./nodes";

export const GRAPHIC_NODES: NodeType[] = [
  NodeType.BooleanOperation,
  NodeType.Ellipse,
  NodeType.Line,
  NodeType.Rectangle,
  NodeType.RegularPolygon,
  NodeType.Slice,
  NodeType.Star,
  NodeType.Vector,
  NodeType.WashiTape,
];

export const GRAPHIC_RESPONSE_TYPES: Record<ExportFormat, string> = {
  [ExportFormat.JPG]: "image/jpeg",
  [ExportFormat.PNG]: "image/png",
  [ExportFormat.SVG]: "image/svg+xml",
  [ExportFormat.PDF]: "application/pdf",
};

export const STYLE_PROPERTY_MAP: Record<TokenStyleTypes, keyof StyledNodeProperties> = {
  [TokenStyleTypes.Fill]: "fills",
  [TokenStyleTypes.Fills]: "fills",
  [TokenStyleTypes.Stroke]: "strokes",
  [TokenStyleTypes.Strokes]: "strokes",
  [TokenStyleTypes.Text]: "style",
  [TokenStyleTypes.Effect]: "effects",
};

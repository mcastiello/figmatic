import type { BooleanOperationNode } from "../nodes/boolean-operation";
import type { CanvasNode } from "../nodes/canvas";
import type { ComponentNode } from "../nodes/component";
import type { ComponentSetNode } from "../nodes/component-set";
import type { DocumentNode } from "../nodes/document";
import type { EllipseNode } from "../nodes/ellipse";
import type { FrameNode } from "../nodes/frame";
import type { GroupNode } from "../nodes/group";
import type { InstanceNode } from "../nodes/instance";
import type { LineNode } from "../nodes/line";
import type { RectangleNode } from "../nodes/rectangle";
import type { RegularPolygonNode } from "../nodes/regular-polygon";
import type { SectionNode } from "../nodes/section";
import type { StarNode } from "../nodes/star";
import type { TextNode } from "../nodes/text";
import type { VectorNode } from "../nodes/vector";
import type { WashiTapeNode } from "../nodes/washi-tape";
import type { NodeType } from "./enumerators";
import type {
  BooleanOperationNodeData,
  CanvasNodeData,
  ComponentNodeData,
  ComponentSetNodeData,
  DocumentNodeData,
  EllipseNodeData,
  FrameNodeData,
  GroupNodeData,
  InstanceNodeData,
  LineNodeData,
  RectangleNodeData,
  RegularPolygonNodeData,
  SectionNodeData,
  StarNodeData,
  TextNodeData,
  VectorNodeData,
  WashiTapeNodeData,
} from "./nodes";

export type NodesMap = {
  [NodeType.BooleanOperation]: BooleanOperationNode;
  [NodeType.Canvas]: CanvasNode;
  [NodeType.ComponentSet]: ComponentSetNode;
  [NodeType.Component]: ComponentNode;
  [NodeType.Document]: DocumentNode;
  [NodeType.Ellipse]: EllipseNode;
  [NodeType.Frame]: FrameNode;
  [NodeType.Group]: GroupNode;
  [NodeType.Instance]: InstanceNode;
  [NodeType.Line]: LineNode;
  [NodeType.Rectangle]: RectangleNode;
  [NodeType.RegularPolygon]: RegularPolygonNode;
  [NodeType.Section]: SectionNode;
  [NodeType.Star]: StarNode;
  [NodeType.Text]: TextNode;
  [NodeType.Vector]: VectorNode;
  [NodeType.WashiTape]: WashiTapeNode;
};

export type NodesDataMap = {
  [NodeType.BooleanOperation]: BooleanOperationNodeData;
  [NodeType.Canvas]: CanvasNodeData;
  [NodeType.ComponentSet]: ComponentSetNodeData;
  [NodeType.Component]: ComponentNodeData;
  [NodeType.Document]: DocumentNodeData;
  [NodeType.Ellipse]: EllipseNodeData;
  [NodeType.Frame]: FrameNodeData;
  [NodeType.Group]: GroupNodeData;
  [NodeType.Instance]: InstanceNodeData;
  [NodeType.Line]: LineNodeData;
  [NodeType.Rectangle]: RectangleNodeData;
  [NodeType.RegularPolygon]: RegularPolygonNodeData;
  [NodeType.Section]: SectionNodeData;
  [NodeType.Star]: StarNodeData;
  [NodeType.Text]: TextNodeData;
  [NodeType.Vector]: VectorNodeData;
  [NodeType.WashiTape]: WashiTapeNodeData;
};

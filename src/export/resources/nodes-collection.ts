import { isNodeData, isTypedNode, isTypedNodeData, NodesMap, NodeType } from "../types";
import {
  BooleanOperationNode,
  CanvasNode,
  ComponentNode,
  ComponentSetNode,
  DocumentNode,
  EllipseNode,
  FigmaNode,
  FrameNode,
  GroupNode,
  InstanceNode,
  LineNode,
  RectangleNode,
  RegularPolygonNode,
  SectionNode,
  StarNode,
  TextNode,
  VectorNode,
  WashiTapeNode,
} from "../nodes";

class NodesCollectionMap extends Map<string, FigmaNode> {
  getByType<Type extends keyof NodesMap>(type: Type): NodesMap[Type][] {
    return Array.from(this.values()).filter((node) => isTypedNode(node, type));
  }

  parse(data?: Record<string, unknown>) {
    let node: FigmaNode | undefined;
    if (isTypedNodeData(data, NodeType.BooleanOperation)) {
      node = new BooleanOperationNode(data);
    }
    if (isTypedNodeData(data, NodeType.Canvas)) {
      node = new CanvasNode(data);
    }
    if (isTypedNodeData(data, NodeType.ComponentSet)) {
      node = new ComponentSetNode(data);
    }
    if (isTypedNodeData(data, NodeType.Component)) {
      node = new ComponentNode(data);
    }
    if (isTypedNodeData(data, NodeType.Document)) {
      node = new DocumentNode(data);
    }
    if (isTypedNodeData(data, NodeType.Ellipse)) {
      node = new EllipseNode(data);
    }
    if (isTypedNodeData(data, NodeType.Frame)) {
      node = new FrameNode(data);
    }
    if (isTypedNodeData(data, NodeType.Group)) {
      node = new GroupNode(data);
    }
    if (isTypedNodeData(data, NodeType.Instance)) {
      node = new InstanceNode(data);
    }
    if (isTypedNodeData(data, NodeType.Line)) {
      node = new LineNode(data);
    }
    if (isTypedNodeData(data, NodeType.Rectangle)) {
      node = new RectangleNode(data);
    }
    if (isTypedNodeData(data, NodeType.RegularPolygon)) {
      node = new RegularPolygonNode(data);
    }
    if (isTypedNodeData(data, NodeType.Section)) {
      node = new SectionNode(data);
    }
    if (isTypedNodeData(data, NodeType.Star)) {
      node = new StarNode(data);
    }
    if (isTypedNodeData(data, NodeType.Text)) {
      node = new TextNode(data);
    }
    if (isTypedNodeData(data, NodeType.Vector)) {
      node = new VectorNode(data);
    }
    if (isTypedNodeData(data, NodeType.WashiTape)) {
      node = new WashiTapeNode(data);
    }

    if (node?.id) {
      this.set(node.id, node);
    }

    if (isNodeData(data)) {
      data.children?.forEach((nodeData) => this.parse(nodeData));
    }
  }
}

export const NodesCollection = new NodesCollectionMap();

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
  private nameMap: Map<string, string[]> = new Map();

  getByType<Type extends keyof NodesMap>(type: Type): NodesMap[Type][] {
    return Array.from(this.values()).filter((node) => isTypedNode(node, type));
  }

  getByName(name: string): FigmaNode[] {
    const ids = this.nameMap.get(name);

    return ids?.map((id) => this.get(id)).filter((node) => !!node) || [];
  }

  parse(data?: Record<string, unknown>, parentId?: string) {
    let node: FigmaNode | undefined;
    if (isTypedNodeData(data, NodeType.BooleanOperation)) {
      node = new BooleanOperationNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Canvas)) {
      node = new CanvasNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.ComponentSet)) {
      node = new ComponentSetNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Component)) {
      node = new ComponentNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Document)) {
      node = new DocumentNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Ellipse)) {
      node = new EllipseNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Frame)) {
      node = new FrameNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Group)) {
      node = new GroupNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Instance)) {
      node = new InstanceNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Line)) {
      node = new LineNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Rectangle)) {
      node = new RectangleNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.RegularPolygon)) {
      node = new RegularPolygonNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Section)) {
      node = new SectionNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Star)) {
      node = new StarNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Text)) {
      node = new TextNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Vector)) {
      node = new VectorNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.WashiTape)) {
      node = new WashiTapeNode(data, parentId);
    }

    if (node?.id) {
      this.set(node.id, node);

      if (node.name) {
        const collection = this.nameMap.get(node.name) || [];
        this.nameMap.set(node.name, [...collection, node.id]);
      }

      if (isNodeData(data)) {
        data.children?.forEach((nodeData) => this.parse(nodeData, node.id));
      }
    }
  }
}

export const NodesCollection = new NodesCollectionMap();

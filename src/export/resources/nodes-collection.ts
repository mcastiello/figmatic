import { isTypedNode, NodeType, NodesMap } from "../types";
import type { FigmaNode } from "../nodes";

class NodesCollectionMap extends Map<string, FigmaNode> {
  getByType<Type extends NodeType>(type: Type): NodesMap[Type][] {
    return Array.from(this.values()).filter((node) => isTypedNode(node, type));
  }
}

export const NodesCollection = new NodesCollectionMap();

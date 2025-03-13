import { type NodesMap, isTypedNode } from "../types";
import { NodeNameMap } from "./utilities/maps";
import type { FigmaNode } from "../nodes";

class NodesCollectionMap extends Map<string, FigmaNode> {
  getByType<Type extends keyof NodesMap>(type: Type): NodesMap[Type][] {
    return Array.from(this.values()).filter((node) => isTypedNode(node, type));
  }

  getByName(name: string | RegExp): FigmaNode[] {
    const ids: string[] = [];
    if (name instanceof RegExp) {
      const values = Array.from(
        new Set(
          Array.from(NodeNameMap.keys())
            .filter((key) => name.test(key))
            .map((key) => NodeNameMap.get(key) || [])
            .reduce((list, ids) => [...list, ...ids], []),
        ),
      );

      ids.push(...values);
    } else {
      const values = NodeNameMap.get(name) || [];

      ids.push(...values);
    }

    return ids?.map((id) => this.get(id)).filter((node): node is FigmaNode => !!node) || [];
  }

  clear() {
    super.clear();
    NodeNameMap.clear();
  }

  get<Node extends FigmaNode = FigmaNode>(id: string): Node | undefined {
    return super.get(id) as Node | undefined;
  }
}

export const NodesCollection = new NodesCollectionMap();

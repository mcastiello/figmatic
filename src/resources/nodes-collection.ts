import { type NodesMap, isTypedNode } from "../types";
import type { FigmaNode } from "../nodes";
import { NodeNameMap } from "./utilities/maps";

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
}

export const NodesCollection = new NodesCollectionMap();

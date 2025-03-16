import { type FigmaComponentData } from "../../types";
import type { FigmaNode } from "../../nodes";
import { NodesCollection } from "../nodes-collection";

export class FigmaComponent {
  protected readonly data: FigmaComponentData;

  constructor(data: FigmaComponentData) {
    this.data = data;
  }

  get definition() {
    return this.data;
  }

  get variantNodes(): FigmaNode[] {
    if (this.data.variants.length === 0) {
      const node = NodesCollection.get(this.data.nodeId);
      return node ? [node] : [];
    } else {
      return this.data.variants
        .map(({ nodeId }) => NodesCollection.get(nodeId))
        .filter((node): node is FigmaNode => typeof node !== "undefined");
    }
  }
}

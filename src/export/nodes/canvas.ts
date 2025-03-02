import { FigmaNode } from "./node";
import { CanvasNodeData, NodeDefinitionData } from "../types";

export class CanvasNode extends FigmaNode<CanvasNodeData> {
  override get DefaultValues(): NodeDefinitionData<CanvasNodeData> {
    return {
      ...super.DefaultValues,
      exportSettings: [],
    };
  }
}

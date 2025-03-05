import { FigmaNode } from "./node";
import { SectionNodeData, NodeDefinitionData } from "../types";

export class SectionNode extends FigmaNode<SectionNodeData> {
  override get DefaultValues(): NodeDefinitionData<SectionNodeData> {
    return {
      ...super.DefaultValues,
      fills: [],
      strokes: [],
    };
  }
}

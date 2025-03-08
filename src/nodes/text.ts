import { FigmaNode } from "./node";
import { type NodeDefinitionData, StrokeCap, StrokeJoin, type TextNodeData } from "../types";

export class TextNode extends FigmaNode<TextNodeData> {
  override get DefaultValues(): NodeDefinitionData<TextNodeData> {
    return {
      ...super.DefaultValues,
      locked: false,
      exportSettings: [],
      preserveRatio: false,
      layoutGrow: 0,
      opacity: 1,
      fills: [],
      strokes: [],
      effects: [],
      isMask: false,
      strokeCap: StrokeCap.None,
      strokeJoin: StrokeJoin.Miter,
      strokeMiterAngle: 28.96,
    };
  }

  get content() {
    return this.data?.characters || "";
  }
}

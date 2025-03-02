import { FigmaNode } from "./node";
import { NodeDefinitionData, StrokeCap, StrokeJoin, TextNodeData } from "../types";

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
      strokeDashes: [],
      strokeMiterAngle: 28.96,
    };
  }
}

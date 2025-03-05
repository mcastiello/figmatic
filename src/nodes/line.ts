import { FigmaNode } from "./node";
import { LineNodeData, NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class LineNode extends FigmaNode<LineNodeData> {
  override get DefaultValues(): NodeDefinitionData<LineNodeData> {
    return {
      ...super.DefaultValues,
      effects: [],
      exportSettings: [],
      fills: [],
      isMask: false,
      layoutGrow: 0,
      locked: false,
      opacity: 1,
      preserveRatio: false,
      strokeCap: StrokeCap.None,
      strokeJoin: StrokeJoin.Miter,
      strokeMiterAngle: 28.96,
      strokes: [],
    };
  }
}

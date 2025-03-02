import { FigmaNode } from "./node";
import { RectangleNodeData, NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class RectangleNode extends FigmaNode<RectangleNodeData> {
  override get DefaultValues(): NodeDefinitionData<RectangleNodeData> {
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
      strokeDashes: [],
      strokeJoin: StrokeJoin.Miter,
      strokeMiterAngle: 28.96,
      strokes: [],
    };
  }
}

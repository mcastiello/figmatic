import { FigmaNode } from "./node";
import { type StarNodeData, type NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class StarNode extends FigmaNode<StarNodeData> {
  override get DefaultValues(): NodeDefinitionData<StarNodeData> {
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

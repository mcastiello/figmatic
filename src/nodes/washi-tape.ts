import { FigmaNode } from "./node";
import { type WashiTapeNodeData, type NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class WashiTapeNode extends FigmaNode<WashiTapeNodeData> {
  override get DefaultValues(): NodeDefinitionData<WashiTapeNodeData> {
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

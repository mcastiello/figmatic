import { FigmaNode } from "./node";
import { WashiTapeNodeData, NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

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
      strokeDashes: [],
      strokeJoin: StrokeJoin.Miter,
      strokeMiterAngle: 28.96,
      strokes: [],
    };
  }
}

import { FigmaNode } from "./node";
import { type EllipseNodeData, type NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class EllipseNode extends FigmaNode<EllipseNodeData> {
  override get DefaultValues(): NodeDefinitionData<EllipseNodeData> {
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

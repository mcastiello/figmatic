import { FigmaNode } from "./node";
import { type BooleanOperationNodeData, type NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class BooleanOperationNode extends FigmaNode<BooleanOperationNodeData> {
  override get DefaultValues(): NodeDefinitionData<BooleanOperationNodeData> {
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

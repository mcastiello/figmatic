import { FigmaNode } from "./node";
import { BooleanOperationNodeData, NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

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
      strokeDashes: [],
      strokeJoin: StrokeJoin.Miter,
      strokeMiterAngle: 28.96,
      strokes: [],
    };
  }
}

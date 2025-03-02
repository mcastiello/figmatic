import { FigmaNode } from "./node";
import { NodeDefinitionData, StrokeCap, StrokeJoin, VectorNodeData } from "../types";

export class VectorNode extends FigmaNode<VectorNodeData> {
  override get DefaultValues(): NodeDefinitionData<VectorNodeData> {
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

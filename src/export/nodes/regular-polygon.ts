import { FigmaNode } from "./node";
import { RegularPolygonNodeData, NodeDefinitionData, StrokeCap, StrokeJoin } from "../types";

export class RegularPolygonNode extends FigmaNode<RegularPolygonNodeData> {
  override get DefaultValues(): NodeDefinitionData<RegularPolygonNodeData> {
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

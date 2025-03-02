import { FigmaNode } from "./node";
import {
  AxisAlign,
  AxisSizing,
  InstanceNodeData,
  LayoutMode,
  LayoutPositioning,
  LayoutWrap,
  NodeDefinitionData,
  OverflowDirection,
} from "../types";

export class InstanceNode extends FigmaNode<InstanceNodeData> {
  override get DefaultValues(): NodeDefinitionData<InstanceNodeData> {
    return {
      ...super.DefaultValues,
      annotations: [],
      componentProperties: {},
      counterAxisAlignContent: AxisAlign.Auto,
      counterAxisAlignItems: AxisAlign.Min,
      counterAxisSpacing: 0,
      effects: [],
      exportSettings: [],
      exposedInstances: [],
      fills: [],
      isExposedInstance: false,
      isMask: false,
      isMaskOutline: false,
      itemReverseZIndex: false,
      itemSpacing: 0,
      layoutMode: LayoutMode.None,
      layoutPositioning: LayoutPositioning.Auto,
      layoutWrap: LayoutWrap.NoWrap,
      locked: false,
      opacity: 1,
      overflowDirection: OverflowDirection.None,
      overrides: [],
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      preserveRatio: false,
      primaryAxisAlignItems: AxisAlign.Min,
      primaryAxisSizingMode: AxisSizing.Auto,
      strokeDashes: [],
      strokes: [],
      strokesIncludedInLayout: false,
      styles: {},
    };
  }
}

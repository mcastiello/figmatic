import { FigmaNode } from "./node";
import {
  AxisAlign,
  AxisSizing,
  ComponentNodeData,
  LayoutMode,
  LayoutPositioning,
  LayoutWrap,
  NodeDefinitionData,
  OverflowDirection,
} from "../types";

export class ComponentNode extends FigmaNode<ComponentNodeData> {
  override get DefaultValues(): NodeDefinitionData<ComponentNodeData> {
    return {
      ...super.DefaultValues,
      annotations: [],
      componentPropertyDefinitions: {},
      counterAxisAlignContent: AxisAlign.Auto,
      counterAxisAlignItems: AxisAlign.Min,
      counterAxisSpacing: 0,
      effects: [],
      exportSettings: [],
      fills: [],
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
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      preserveRatio: false,
      primaryAxisAlignItems: AxisAlign.Min,
      primaryAxisSizingMode: AxisSizing.Auto,
      strokes: [],
      strokesIncludedInLayout: false,
      styles: {},
    };
  }
}

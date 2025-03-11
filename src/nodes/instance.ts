import { FigmaNode } from "./node";
import {
  AxisAlign,
  AxisSizing,
  type GenericNode,
  type InstanceNodeData,
  isNodeData,
  LayoutMode,
  LayoutPositioning,
  LayoutWrap,
  type NodeDefinitionData,
  type NodeType,
  OverflowDirection,
} from "../types";
import { NodesCollection } from "../resources/nodes-collection";

export class InstanceNode extends FigmaNode<InstanceNodeData> {
  protected readonly overrideIds: string[] | undefined;

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
      strokes: [],
      strokesIncludedInLayout: false,
      styles: {},
    };
  }

  constructor(data: Record<string, unknown>, parentId?: string) {
    let childrenList: string[] = [];
    if (isNodeData<GenericNode<NodeType.Instance>>(data)) {
      const { children, ...instanceData } = data;
      data = instanceData;

      childrenList = children?.map(({ id }) => id) || [];
    }
    super(data, parentId);
    this.overrideIds = childrenList;
  }

  get overrides() {
    return this.overrideIds
      ?.map((id) => NodesCollection.get(id))
      .filter((node): node is FigmaNode => !!node && node.valid);
  }
}

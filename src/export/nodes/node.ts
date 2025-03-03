import { GenericNode, GenericNodeData, GRAPHIC_NODES, isNodeData, NodeDefinitionData } from "../types";
import { NodesCollection } from "../resources";

export class FigmaNode<DataType extends GenericNodeData = GenericNodeData> {
  protected readonly nodeId: string | undefined;
  protected readonly nodeType: DataType["type"] | undefined;
  protected readonly data: NodeDefinitionData<DataType> | undefined;
  protected readonly childrenIds: string[] | undefined;

  get DefaultValues(): NodeDefinitionData<DataType> {
    return {
      boundVariables: {},
      componentPropertyReferences: {},
      explicitVariableModes: {},
      rotation: 0,
      visible: true,
    } as NodeDefinitionData<DataType>;
  }

  constructor(data: Record<string, unknown>) {
    if (isNodeData<GenericNode<DataType["type"]>>(data)) {
      const { id, type, children, ...definition } = data;
      this.nodeId = id;
      this.nodeType = type;
      this.data = { ...this.DefaultValues, ...definition };

      this.childrenIds = children?.map(({ id }) => id);
    }
  }

  get id() {
    return this.nodeId;
  }

  get type() {
    return this.nodeType;
  }

  get valid() {
    return !!this.nodeId;
  }

  get children() {
    return this.childrenIds?.map((id) => NodesCollection.get(id)).filter((node) => !!node && node.valid);
  }

  get isGraphicNode() {
    return this.nodeType ? GRAPHIC_NODES.includes(this.nodeType) : false;
  }
}

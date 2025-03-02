import { GenericNodeData, GRAPHIC_NODES, isNodeData, NodeDefinitionData } from "../types";
import { NodesCollection } from "../resources";

export class FigmaNode<DataType extends GenericNodeData = GenericNodeData> {
  protected readonly nodeId: string;
  protected readonly nodeType: DataType["type"];
  protected readonly data: NodeDefinitionData<DataType>;
  protected readonly childrenIds: string[] | undefined;

  get DefaultValues(): NodeDefinitionData<DataType> {
    return {
      boundVariables: {},
      componentPropertyReferences: {},
      explicitVariableModes: {},
      rotation: 0,
      visible: true,
    };
  }

  constructor(data: Record<string, unknown>) {
    if (isNodeData<DataType>(data)) {
      const { id, type, children, ...definition } = data;
      this.nodeId = id;
      this.nodeType = type;
      this.data = { ...this.DefaultValues, ...definition };

      this.childrenIds = children?.map(({ id }) => id);

      NodesCollection.set(id, this);
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
    return this.children?.map((id) => NodesCollection.get(id)).filter((node) => !!node && node.valid);
  }

  get isGraphicNode() {
    return GRAPHIC_NODES.includes(this.nodeType);
  }
}

import { GenericNode, GenericNodeData, GRAPHIC_NODES, isNodeData, NodeDefinitionData, NodesMap } from "../types";
import { NodesCollection } from "../resources";

export class FigmaNode<DataType extends GenericNodeData = GenericNodeData> {
  protected readonly nodeId: string | undefined;
  protected readonly nodeType: DataType["type"] | undefined;
  protected readonly data: NodeDefinitionData<DataType> | undefined;
  protected readonly childrenIds: string[] | undefined;
  protected readonly parentId: string | undefined;

  get DefaultValues(): NodeDefinitionData<DataType> {
    return {
      boundVariables: {},
      componentPropertyReferences: {},
      explicitVariableModes: {},
      rotation: 0,
      visible: true,
    } as NodeDefinitionData<DataType>;
  }

  constructor(data: Record<string, unknown>, parentId?: string) {
    if (isNodeData<GenericNode<DataType["type"]>>(data)) {
      const { id, type, children, ...definition } = data;
      this.nodeId = id;
      this.nodeType = type;
      this.parentId = parentId;
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

  get name() {
    return this.data?.name;
  }

  get valid() {
    return !!this.nodeId;
  }

  get children() {
    return this.childrenIds?.map((id) => NodesCollection.get(id)).filter((node) => !!node && node.valid);
  }

  get parent(): FigmaNode | undefined {
    return this.parentId ? NodesCollection.get(this.parentId) : undefined;
  }

  get isGraphicNode() {
    return this.nodeType ? GRAPHIC_NODES.includes(this.nodeType) : false;
  }

  getChildrenByType<Type extends keyof NodesMap>(type: Type): NodesMap[Type][] {
    return NodesCollection.getByType(type).filter((node) => node.parent?.id === this.id);
  }
}

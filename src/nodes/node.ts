import {
  type Effect,
  type GenericNode,
  type GenericNodeData,
  type NodeDefinitionData,
  type NodesMap,
  type Paint,
  type TokenStyleTypes,
  type TypeStyle,
  isNodeData,
  isStyledNode,
} from "../types";
import { GRAPHIC_NODES, STYLE_PROPERTY_MAP } from "../types/internal";
import { NodesCollection, TokensCollection } from "../resources";

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

  get definition() {
    return this.data;
  }

  get valid() {
    return !!this.nodeId;
  }

  get children() {
    return this.childrenIds
      ?.map((id) => NodesCollection.get(id))
      .filter((node): node is FigmaNode => !!node && node.valid);
  }

  get parent(): FigmaNode | undefined {
    return this.parentId ? NodesCollection.get(this.parentId) : undefined;
  }

  get isGraphicNode() {
    return this.nodeType ? GRAPHIC_NODES.includes(this.nodeType) : false;
  }

  getToken(type: TokenStyleTypes) {
    if (this.data?.boundVariables) {
      const token = this.data.boundVariables[type];
      const list = Array.isArray(token) ? token : token ? [token] : [];

      return list.map(({ id }) => TokensCollection.get(id)).filter((token) => !!token);
    }
    return [];
  }

  getChildrenByType<Type extends keyof NodesMap>(type: Type): NodesMap[Type][] {
    return NodesCollection.getByType(type).filter((node) => node.parent?.id === this.id);
  }

  get stiles(): Record<string, Paint | Effect | TypeStyle> {
    const values = { ...this.data };
    if (isStyledNode(values)) {
      const types: TokenStyleTypes[] = Object.keys(values.styles) as TokenStyleTypes[];

      return types.reduce(
        (
          styles: Record<string, Paint | Effect | TypeStyle>,
          key: TokenStyleTypes,
        ): Record<string, Paint | Effect | TypeStyle> => {
          const id = values.styles?.[key];
          const property = STYLE_PROPERTY_MAP[key];
          const value = values[property];
          const flat = Array.isArray(value) ? value[0] : value;

          if (id && flat) {
            return {
              ...styles,
              [id]: flat,
            };
          }
          return styles;
        },
        {},
      );
    }
    return {};
  }
}

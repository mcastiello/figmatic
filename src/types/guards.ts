import { NodeType, PropertyTypes } from "./enumerators";
import { GenericNode, GenericNodeData, NodeDefinitionData, StyledNodeData } from "./nodes";
import { NodesDataMap, NodesMap } from "./map";

export const isNodeType = (type: string): type is NodeType => Object.values<string>(NodeType).includes(type);
export const isPropertyType = (type: string): type is NodeType => Object.values<string>(PropertyTypes).includes(type);
export const isNodeData = <Data extends GenericNode>(data?: Record<string, unknown>): data is Data =>
  typeof data?.type === "string" && isNodeType(data.type);
export const isTypedNodeData = <Type extends keyof NodesDataMap>(
  data: Record<string, unknown> | undefined,
  type: Type,
): data is NodesDataMap[Type] => typeof data?.type === "string" && data.type === type && isNodeType(data.type);
export const isTypedNode = <Type extends keyof NodesMap>(node: unknown, type: Type): node is NodesMap[Type] =>
  !!node && (node as { type: unknown })["type"] === type;
export const isStyledNode = <DataType extends GenericNodeData = GenericNodeData>(
  node?: NodeDefinitionData<DataType>,
): node is StyledNodeData<DataType> => !!node && Object.hasOwn(node, "styles");

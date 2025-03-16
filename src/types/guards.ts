import { NodeType } from "./enumerators";
import type { ExportableNode, GenericNode, GenericNodeData, NodeDefinitionData, StyledNodeData } from "./nodes";
import type { NodesDataMap, NodesMap } from "./map";
import type { VariableAlias, VariableValue } from "./properties";

export const isNodeType = (type: string): type is NodeType => Object.values<string>(NodeType).includes(type);
export const isVariableAlias = (value: VariableValue | VariableAlias): value is VariableAlias =>
  typeof value === "object" && Object.hasOwn(value, "type");
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
export const isExportableNode = <DataType extends GenericNodeData = GenericNodeData>(
  node?: NodeDefinitionData<DataType>,
): node is NodeDefinitionData<DataType> & ExportableNode => !!node && Object.hasOwn(node, "exportSettings");

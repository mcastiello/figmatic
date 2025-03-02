import { NodeType, PropertyTypes } from "./enumerators";
import { GenericNode } from "./nodes";
import type { FigmaNode } from "../nodes";
import { NodesMap } from "./map";

export const isNodeType = (type: string): type is NodeType => Object.values<string>(NodeType).includes(type);
export const isPropertyType = (type: string): type is NodeType => Object.values<string>(PropertyTypes).includes(type);
export const isNodeData = <Data extends GenericNode>(data?: Record<string, unknown>): data is Data =>
  typeof data?.type === "string" && isNodeType(data.type);
export const isTypedNode = <Type extends NodeType>(node: FigmaNode | undefined, type: Type): node is NodesMap[Type] =>
  !!node && node.type === type;

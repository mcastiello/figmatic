import { type NodesMap, type Style, type StyledNodeData, TokenStyleTypes } from "../../types";
import { NodeStylesCollection } from "../../resources/utilities";
import { className } from "./text";
import { NodesCollection } from "../../resources";

export const getNodeStyles = <Node extends Partial<StyledNodeData>>(node?: Node): Style[] =>
  (node?.styles
    ? Object.keys(node.styles).filter((key): key is TokenStyleTypes =>
        Object.values<string>(TokenStyleTypes).includes(key),
      )
    : []
  )
    .map((key) => (node?.styles?.[key] ? NodeStylesCollection.get(node?.styles?.[key]) : undefined))
    .filter((value): value is Style => !!value);

export const getClassName = <Type extends keyof NodesMap, Node extends NodesMap[Type]>(node: Node) =>
  node.name
    ? className(node.name)
    : `${node.type?.toLowerCase()}-${NodesCollection.getByType(node.type).indexOf(node)}`;

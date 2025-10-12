import {
  FontStyle,
  FontWeight,
  type NodesMap,
  type StyledNodeData,
  type StyleRecord,
  StyleType,
  TextCase,
  TextDecoration,
  TextTruncation,
  TokenStyleTypes,
  type TypeStyle,
} from "../../types";
import { FontsCollection, NodeStyles, NodeStylesCollection } from "../../resources/utilities";
import { className } from "./text";
import { NodesCollection } from "../../resources";

export const getNodeStyles = <Node extends Partial<StyledNodeData>>(node?: Node): StyleRecord[] =>
  (node?.styles
    ? Object.keys(node.styles).filter((key): key is TokenStyleTypes =>
        Object.values<string>(TokenStyleTypes).includes(key),
      )
    : []
  )
    .map((key) => (node?.styles?.[key] ? NodeStylesCollection.get(node?.styles?.[key]) : undefined))
    .filter((value): value is StyleRecord => !!value);

export const getNodeTextStyles = <Node extends Partial<StyledNodeData>>(node?: Node): TypeStyle | undefined =>
  (node?.styles
    ? Object.keys(node.styles).filter((key): key is TokenStyleTypes =>
        Object.values<string>(TokenStyleTypes).includes(key),
      )
    : []
  )
    .map((key) => (node?.styles?.[key] ? NodeStylesCollection.get(node?.styles?.[key]) : undefined))
    .filter((value): value is StyleRecord => value?.styleType === StyleType.Text)
    .map(({ id }): TypeStyle | undefined => NodeStyles.get(id) as TypeStyle)
    .pop();

export const getClassName = <Type extends keyof NodesMap, Node extends NodesMap[Type]>(node: Node) =>
  node.name
    ? className(node.name)
    : `${node.type?.toLowerCase()}-${NodesCollection.getByType(node.type).indexOf(node)}`;

export const rem = (value: number): string => `${Math.round((value * 1000000) / 16) / 1000000}rem`;

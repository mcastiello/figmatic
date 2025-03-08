import type { GenericNodeData, NodeType, ParsedComponent } from "../../types";
import type { FigmaNode } from "../../nodes";

export abstract class Parser<Type extends NodeType> {
  abstract parse<Node extends FigmaNode<GenericNodeData<Type>>>(node: Node): Promise<ParsedComponent>;
}

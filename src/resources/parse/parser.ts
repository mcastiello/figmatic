import { FigmaticSeverity, type GenericNodeData, type NodeType, type ParsedComponent } from "../../types";
import type { FigmaNode } from "../../nodes";
import { Logger } from "../utilities";

export abstract class Parser<Type extends NodeType> {
  abstract parse<Node extends FigmaNode<GenericNodeData<Type>>>(node: Node): Promise<ParsedComponent>;
  protected log(message: string, severity: FigmaticSeverity = FigmaticSeverity.Info, data?: unknown): void {
    Logger.log(message, severity, Date.now(), data);
  }
}

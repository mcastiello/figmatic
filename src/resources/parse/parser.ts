import { FigmaticSeverity, type NodesMap, type ParsedComponent } from "../../types";
import { Logger } from "../utilities/log";

export abstract class Parser<Type extends keyof NodesMap> {
  abstract parse<Node extends NodesMap[Type]>(node: Node): Promise<ParsedComponent>;
  protected log(message: string, severity: FigmaticSeverity = FigmaticSeverity.Info, data?: unknown): void {
    Logger.log(message, severity, Date.now(), data);
  }
}

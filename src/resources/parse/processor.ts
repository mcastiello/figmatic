import { type ExportedElement, FigmaticSeverity } from "../../types";
import type { ParsedNode } from "./parsed-node";
import type { FigmaComponent } from "./component";
import { Logger } from "../utilities/log";
import { ParsedNodesCollection } from "../utilities/maps";

export abstract class Processor {
  abstract generateTokens(): Promise<ExportedElement>;
  abstract generateComponent(definition: FigmaComponent): Promise<ExportedElement>;
  protected log(message: string, severity: FigmaticSeverity = FigmaticSeverity.Info, data?: unknown): void {
    Logger.log(message, severity, Date.now(), data);
  }
  protected getParsedNode(id: string): ParsedNode | undefined {
    return ParsedNodesCollection.get(id);
  }
}

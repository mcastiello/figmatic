import { type ExportedComponent, FigmaticSeverity } from "../../types";
import type { ParsedNode } from "./parsed-node";
import type { FigmaComponent } from "./component";
import { Logger } from "../utilities/log";
import { ParsedNodesCollection } from "../utilities/maps";

export abstract class Processor {
  abstract generate(definition: FigmaComponent): Promise<ExportedComponent>;
  protected log(message: string, severity: FigmaticSeverity = FigmaticSeverity.Info, data?: unknown): void {
    Logger.log(message, severity, Date.now(), data);
  }
  protected getParsedNode(id: string): ParsedNode | undefined {
    return ParsedNodesCollection.get(id);
  }
}

import { type ExportedComponent, type FigmaComponentData, FigmaticSeverity, type ParsedComponent } from "../../types";
import { Logger } from "../utilities";

export abstract class Processor {
  abstract generate(definition: FigmaComponentData, parsedComponents: ParsedComponent[]): Promise<ExportedComponent>;
  protected log(message: string, severity: FigmaticSeverity = FigmaticSeverity.Info, data?: unknown): void {
    Logger.log(message, severity, Date.now(), data);
  }
}

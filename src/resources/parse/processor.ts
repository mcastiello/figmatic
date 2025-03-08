import type { ExportedComponent, FigmaComponentData, ParsedComponent } from "../../types";

export abstract class Processor {
  abstract generate(definition: FigmaComponentData, parsedComponents: ParsedComponent[]): Promise<ExportedComponent>;
}

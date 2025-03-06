import { FigmaComponentData, ParsedComponent } from "../../types";

export abstract class Processor {
  abstract async generate(definition: FigmaComponentData, parsedComponents: ParsedComponent[]): Promise<string>;
}

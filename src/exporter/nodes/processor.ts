import { FigmaComponent, Processor } from "../../resources";
import { type ExportedElement, FigmaticSeverity } from "../../types";

export class HtmlProcessor extends Processor {
  generateTokens(): Promise<ExportedElement> {
    return Promise.resolve({ name: "", content: "" });
  }
  generateComponent(definition: FigmaComponent): Promise<ExportedElement> {
    this.log("Generating component", FigmaticSeverity.Debug, definition);
    return Promise.resolve({ name: "", content: "" });
  }
}

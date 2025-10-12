import { FigmaComponent, Processor } from "../../resources";
import { type ExportedElement, FigmaticSeverity, StyleType, type TypeStyle } from "../../types";
import { NodeStyles, NodeStylesCollection } from "../../resources/utilities";
import { className, parseTextStyles } from "../utils";

export class HtmlProcessor extends Processor {
  async generateTokens(): Promise<ExportedElement> {
    return { name: "", content: "" };
  }

  async generateStyles(): Promise<ExportedElement[]> {
    return Array.from(NodeStylesCollection.values())
      .map((value) => {
        const name = className(value.name);
        const styles = NodeStyles.get(value.id);
        let nodeStyle: Map<string, string> = new Map();

        switch (value.styleType) {
          case StyleType.Text:
            nodeStyle = parseTextStyles(styles as TypeStyle);
            break;
        }
        const rules: string[] = [];

        if (nodeStyle) {
          nodeStyle.forEach((value, key) => {
            rules.push(`    ${key}: ${value};`);
          });

          if (rules.length > 0) {
            return {
              name,
              content: [`<style id="${name}">`, `  .${name} {`, rules.join("\n"), "  }", "</style>"].join("\n"),
            };
          }
        }
      })
      .filter((value): value is ExportedElement => !!value);
  }

  generateComponent(definition: FigmaComponent, sharedStyles: ExportedElement[]): Promise<ExportedElement> {
    this.log("Generating component", FigmaticSeverity.Debug, { definition, sharedStyles });
    return Promise.resolve({ name: "", content: "" });
  }
}

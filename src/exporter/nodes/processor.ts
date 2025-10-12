import { FigmaComponent, Processor } from "../../resources";
import { type ExportedElement, FigmaticSeverity, StyleType, type TypeStyle } from "../../types";
import { NodeStyles, NodeStylesCollection } from "../../resources/utilities";
import { className, parseTextStyles } from "../utils";

export class HtmlProcessor extends Processor {
  async generateTokens(): Promise<ExportedElement> {
    const classes = Array.from(NodeStylesCollection.values()).map((value) => {
      const name = className(value.name);
      const styles = NodeStyles.get(value.id);

      if (value.styleType === StyleType.Text) {
        const nodeStyle = parseTextStyles(styles as TypeStyle);
        const rules: string[] = [];

        if (nodeStyle) {
          nodeStyle.forEach((value, key) => {
            rules.push(`  ${key}: ${value};`);
          });

          if (rules.length > 0) {
            return [`.${name} {`, rules.join("\n"), "}"].join("\n");
          }
        }
      }
    });

    const classContent = classes.join("\n\n");

    this.log("Generating external classes", FigmaticSeverity.Debug, classContent);

    return { name: "", content: [classContent].join("\n\n") };
  }

  generateComponent(definition: FigmaComponent): Promise<ExportedElement> {
    //this.log("Generating component", FigmaticSeverity.Debug, definition);
    return Promise.resolve({ name: "", content: "" });
  }
}

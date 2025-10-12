import { FigmaticSeverity, NodeType, type ParsedComponent, type TypeStyle } from "../../types";
import { TextNode } from "../../nodes";
import { NodeParser } from "./node-parser";
import { getNodeTextStyles, parseTextStyles } from "../utils";

export class TextParser extends NodeParser<NodeType.Text> {
  async parse(node: TextNode): Promise<ParsedComponent> {
    const component = await super.parse(node);
    const nodeStyle = node.definition.style;
    const externalStyle = getNodeTextStyles(node.definition);

    if (externalStyle && nodeStyle) {
      const overrides = Object.keys(nodeStyle)
        .map((key) => key as keyof TypeStyle)
        .reduce((result: Partial<TypeStyle>, key: keyof TypeStyle): Partial<TypeStyle> => {
          const externalValue = externalStyle[key];
          const internalValue = nodeStyle[key];

          if (externalValue !== internalValue) {
            return { ...result, [key]: internalValue };
          }
          return result;
        }, {});

      const styles = parseTextStyles(overrides);

      styles.entries().forEach(([key, value]) => {
        component.styles.rules[key] = value;
      });
    }

    component.markup.tag = "span";

    this.log("Text Node Parsed", FigmaticSeverity.Debug, component);

    return component;
  }
}

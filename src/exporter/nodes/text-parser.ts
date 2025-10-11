import { Parser } from "../../resources";
import { FigmaticSeverity, NodeType, type ParsedComponent } from "../../types";
import { TextNode } from "../../nodes";
import { className } from "../utils/text";
import { getClassName, getNodeStyles } from "../utils/styles";

export class TextParser extends Parser<NodeType.Text> {
  async parse(node: TextNode): Promise<ParsedComponent> {
    const name = getClassName(node);
    const styles = getNodeStyles(node.definition);
    const styleClasses = styles.map((style) => className(style.name));

    const component: ParsedComponent = {
      styles: {
        name,
        rules: {},
      },
      markup: {
        tag: "span",
        attributes: {
          class: [name, ...styleClasses].join(" "),
        },
      },
    };

    this.log("Text Node Received", FigmaticSeverity.Debug, { component, node: node.definition });

    return component;
  }
}

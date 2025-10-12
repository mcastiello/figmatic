import { Parser } from "../../resources";
import { type NodesMap, type ParsedComponent } from "../../types";
import { getClassName, getNodeStyles, className } from "../utils";

export class NodeParser<Type extends keyof NodesMap> extends Parser<Type> {
  async parse<Node extends NodesMap[Type]>(node: Node): Promise<ParsedComponent> {
    const name = getClassName(node);
    const styles = getNodeStyles(node.definition);
    const styleClasses = styles.map((style) => className(style.name));

    return {
      styles: {
        name,
        rules: {},
      },
      markup: {
        tag: "div",
        attributes: {
          class: [name, ...styleClasses].join(" "),
        },
      },
    };
  }
}

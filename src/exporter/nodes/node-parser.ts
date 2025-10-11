import { Parser } from "../../resources";
import { FigmaticSeverity, type NodesMap, type ParsedComponent } from "../../types";

export class NodeParser<Type extends keyof NodesMap> extends Parser<Type> {
  parse<Node extends NodesMap[Type]>(node: Node): Promise<ParsedComponent> {
    this.log("Node Received", FigmaticSeverity.Debug, node);
    return Promise.resolve({
      styles: {
        name: node.name || "",
        rules: {},
      },
      markup: {
        tag: "",
        attributes: {},
      },
    });
  }
}

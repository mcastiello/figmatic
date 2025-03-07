import { FigmaComponentData, GenericNodeData, NodeType, ParsedComponent } from "../../types";
import { ComponentParsers, ExportPlugin } from "./plugin";
import { NodesCollection } from "../nodes-collection";
import { FigmaNode } from "../../nodes";
import { Parser } from "./parser";

export class FigmaComponent {
  protected readonly data: FigmaComponentData;

  constructor(data: FigmaComponentData) {
    this.data = data;
  }

  get definition() {
    return this.data;
  }

  get variantNodes(): FigmaNode[] {
    if (this.data.variants.length === 0) {
      const node = NodesCollection.get(this.data.nodeId);
      return node ? [node] : [];
    } else {
      return this.data.variants
        .map(({ nodeId }) => NodesCollection.get(nodeId))
        .filter((node): node is FigmaNode => typeof node !== "undefined");
    }
  }

  private async parseNodes(nodes: FigmaNode[], parsers: Partial<ComponentParsers>): Promise<ParsedComponent[]> {
    const parsedComponents = await Promise.all(
      nodes.map(
        async <Type extends NodeType>(node: FigmaNode<GenericNodeData<Type>>): Promise<ParsedComponent | undefined> => {
          if (node) {
            const parser: Parser<Type> | undefined = parsers[node.type as Type];
            if (parser && node.definition) {
              const data = await parser.parse(node.definition);
              const parsedChildren =
                node.children && node.children.length > 0 ? await this.parseNodes(node.children, parsers) : [];

              return {
                styles: data.styles,
                markup: { ...data.markup, children: parsedChildren.map(({ markup }) => markup) },
                code: [
                  ...(data.code || []),
                  ...(parsedChildren
                    .map(({ code }) => code)
                    .reduce((result, code) => [...(result || []), ...(code || [])], []) || []),
                ],
              };
            }
          }
        },
      ),
    );

    return parsedComponents.filter((component): component is ParsedComponent => !component);
  }

  async generateCode(config: ExportPlugin): Promise<string> {
    const data = await this.parseNodes(this.variantNodes, config.parsers);
  }
}

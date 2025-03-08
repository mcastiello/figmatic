import {
  type ExportedComponent,
  ExportFormat,
  type FigmaComponentData,
  type GenericNodeData,
  type NodeType,
  type ParsedComponent,
} from "../../types";
import type { ComponentParsers, ExportPlugin } from "./plugin";
import { NodesCollection } from "../nodes-collection";
import type { FigmaNode } from "../../nodes";
import type { Parser } from "./parser";
import { FigmaApi } from "../api";

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

  private async parseNodes(
    nodes: FigmaNode[],
    parsers: Partial<ComponentParsers>,
    svg = false,
  ): Promise<ParsedComponent[]> {
    const parsedComponents = await Promise.all(
      nodes.map(
        async <Type extends NodeType>(node: FigmaNode<GenericNodeData<Type>>): Promise<ParsedComponent | undefined> => {
          if (node) {
            if (node.id && node.isGraphicNode && svg) {
              const exports = await FigmaApi.downloadGraphicNodes(this.data.fileName, [node.id], ExportFormat.SVG);
              const markup = Object.values(exports).shift();
              if (typeof markup === "string") {
                return {
                  styles: {
                    name: node.name || "",
                    rules: {},
                  },
                  markup: {
                    tag: "svg",
                    content: markup,
                  },
                };
              }
            }
            const parser: Parser<Type> | undefined = parsers[node.type as Type];
            if (parser) {
              const data = await parser.parse(node);
              const parsedChildren =
                node.children && node.children.length > 0 ? await this.parseNodes(node.children, parsers) : [];

              return {
                styles: { ...data.styles, children: parsedChildren.map(({ styles }) => styles) },
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

    return parsedComponents.filter((component): component is ParsedComponent => !!component);
  }

  async generateCode(config: ExportPlugin): Promise<ExportedComponent> {
    const data = await this.parseNodes(this.variantNodes, config.parsers, config.exportGraphicElementsAsSVG);

    return await config.processor.generate(this.definition, data);
  }
}

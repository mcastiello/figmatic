import type { ExportPlugin } from "../resources";
import { NodeType } from "../types";
import { NodeParser } from "./nodes/node-parser";
import { HtmlProcessor } from "./nodes/processor";
import { TextParser } from "./nodes/text-parser";

export const HtmlPlugin: ExportPlugin = {
  parsers: {
    [NodeType.BooleanOperation]: new NodeParser<NodeType.BooleanOperation>(),
    [NodeType.Canvas]: new NodeParser<NodeType.Canvas>(),
    [NodeType.ComponentSet]: new NodeParser<NodeType.ComponentSet>(),
    [NodeType.Component]: new NodeParser<NodeType.Component>(),
    [NodeType.Document]: new NodeParser<NodeType.Document>(),
    [NodeType.Ellipse]: new NodeParser<NodeType.Ellipse>(),
    [NodeType.Frame]: new NodeParser<NodeType.Frame>(),
    [NodeType.Group]: new NodeParser<NodeType.Group>(),
    [NodeType.Instance]: new NodeParser<NodeType.Instance>(),
    [NodeType.Line]: new NodeParser<NodeType.Line>(),
    [NodeType.Rectangle]: new NodeParser<NodeType.Rectangle>(),
    [NodeType.RegularPolygon]: new NodeParser<NodeType.RegularPolygon>(),
    [NodeType.Section]: new NodeParser<NodeType.Section>(),
    [NodeType.Star]: new NodeParser<NodeType.Star>(),
    [NodeType.Text]: new TextParser(),
    [NodeType.Vector]: new NodeParser<NodeType.Vector>(),
    [NodeType.WashiTape]: new NodeParser<NodeType.WashiTape>(),
  },
  processor: new HtmlProcessor(),
};

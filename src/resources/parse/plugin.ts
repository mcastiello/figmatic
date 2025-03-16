import type { NodesMap } from "../../types";
import type { GraphicParser, Parser } from "./parser";
import type { Processor } from "./processor";

export type ComponentParsers = {
  [Type in keyof NodesMap]: Parser<Type>;
};

export type ExportPlugin = {
  parsers: Partial<ComponentParsers>;
  graphicParser?: GraphicParser;
  processor: Processor;
};

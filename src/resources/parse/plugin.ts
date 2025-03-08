import type { NodesMap } from "../../types";
import type { Parser } from "./parser";
import type { Processor } from "./processor";

export type ComponentParsers = {
  [Type in keyof NodesMap]: Parser<Type>;
};

export type ExportPlugin = {
  parsers: Partial<ComponentParsers>;
  processor: Processor;
  exportGraphicElementsAsSVG?: boolean;
};

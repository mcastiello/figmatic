import { NodeType } from "../../types";
import { Parser } from "./parser";
import { Processor } from "./processor";

export type ComponentParsers = {
  [Type in NodeType]: Parser<Type>;
};

export type ExportPlugin = {
  parsers: Partial<ComponentParsers>;
  processor: Processor;
  exportGraphicElementsAsSVG?: boolean;
};

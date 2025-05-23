import type { Effect, Paint, Style, TypeStyle, VariableCollection } from "../../types";
import type { ParsedNode } from "../parse/parsed-node";

export const NodeNameMap: Map<string, string[]> = new Map();
export const NodeTokensCollections: Map<string, VariableCollection> = new Map();
export const NodeStyles: Map<string, TypeStyle | Paint | Effect> = new Map();
export const NodeStylesCollection: Map<string, Style> = new Map();
export const ParsedNodesCollection: Map<string, ParsedNode> = new Map();

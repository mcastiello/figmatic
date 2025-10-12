import type { Effect, Paint, StyleRecord, TypeStyle, VariableCollection } from "../../types";
import type { ParsedNode } from "../parse/parsed-node";

export const NodeNameMap: Map<string, string[]> = new Map();
export const NodeTokensCollections: Map<string, VariableCollection> = new Map();
export const NodeStyles: Map<string, TypeStyle | Paint | Effect> = new Map();
export const NodeStylesCollection: Map<string, StyleRecord> = new Map();
export const ParsedNodesCollection: Map<string, ParsedNode> = new Map();
export const FontsCollection: Map<string, string> = new Map();

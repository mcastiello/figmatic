import { NodeDefinitionData, NodeType, ParsedComponent } from "../../types";

export abstract class Parser<Type extends NodeType> {
  abstract async parse(data: NodeDefinitionData<Type>): Promise<ParsedComponent>;
}

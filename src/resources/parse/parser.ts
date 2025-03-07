import { GenericNodeData, NodeDefinitionData, NodeType, ParsedComponent } from "../../types";

export abstract class Parser<Type extends NodeType> {
  abstract parse(data: NodeDefinitionData<GenericNodeData<Type>>): Promise<ParsedComponent>;
}

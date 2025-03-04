import { Variable, VariableCollection, VariablesFile } from "../types";

class TokensCollectionMap extends Map<string, Variable> {
  private collections: Map<string, VariableCollection> = new Map();

  parse(variables: VariablesFile) {
    if (variables?.meta) {
      Object.values(variables.meta.variables).forEach((variable) => {
        this.set(variable.id, variable);
      });
      Object.values(variables.meta.variableCollections).forEach((collection) => {
        this.collections.set(collection.id, collection);
      });
    }
  }

  getByCollection(collectionId: string): Variable[] {
    const collection = this.collections.get(collectionId);

    return collection?.variableIds?.map((id) => this.get(id)).filter((value) => !!value) || [];
  }

  getCollection(collectionId: string): VariableCollection | undefined {
    return this.collections.get(collectionId);
  }

  getCollections(): VariableCollection[] {
    return Array.from(this.collections.values());
  }
}

export const TokensCollection = new TokensCollectionMap();

import {
  Effect,
  Paint,
  Style,
  StyleData,
  TypeStyle,
  Variable,
  VariableCollection,
  VariablesFile,
  VariableValue,
} from "../types";
import { isVariableAlias } from "../types/guards";

class TokensCollectionMap extends Map<string, Variable> {
  private collections: Map<string, VariableCollection> = new Map();
  private styles: Map<string, TypeStyle | Paint | Effect> = new Map();
  private stylesCollection: Map<string, Style> = new Map();

  parse(variables: VariablesFile, styles: Record<string, Style> = {}) {
    if (variables?.meta) {
      Object.values(variables.meta.variables).forEach((variable) => {
        this.set(variable.id, variable);
      });
      Object.values(variables.meta.variableCollections).forEach((collection) => {
        this.collections.set(collection.id, collection);
      });
      Object.entries(styles).forEach(([key, style]) => {
        this.stylesCollection.set(key, style);
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

  setStyle(id: string, style: TypeStyle | Paint | Effect) {
    this.styles.set(id, style);
  }

  getStyle(id: string): StyleData | undefined {
    const style = this.stylesCollection.get(id);
    const data = this.styles.get(id);

    if (style && data) {
      return {
        id,
        ...style,
        data,
      };
    }
  }

  getStyles(): StyleData[] {
    return Array.from(this.stylesCollection.keys())
      .map((id) => this.getStyle(id))
      .filter((data) => !!data);
  }

  resolveTokenVariable(id: string): Record<string, VariableValue | undefined> {
    const token = this.get(id);
    if (token) {
      return Object.keys(token.valuesByMode).reduce(
        (result: Record<string, VariableValue | undefined>, key: string): Record<string, VariableValue | undefined> => {
          const value = token.valuesByMode[key];
          if (isVariableAlias(value)) {
            const resolvedValue = this.resolveTokenVariable(value.id);
            return {
              ...result,
              ...Object.keys(resolvedValue).reduce(
                (result: Record<string, VariableValue | undefined>, subKey: string) => ({
                  ...result,
                  [`${key}+${subKey}`]: resolvedValue?.[subKey],
                }),
                {},
              ),
            };
          }
          return { ...result, [key]: value };
        },
        {},
      );
    }
    return {};
  }

  clear() {
    super.clear();
    this.collections.clear();
    this.styles.clear();
  }
}

export const TokensCollection = new TokensCollectionMap();

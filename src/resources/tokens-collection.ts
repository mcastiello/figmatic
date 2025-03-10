import {
  type Effect,
  type Paint,
  type StyleData,
  type TypeStyle,
  type Variable,
  type VariableCollection,
  type VariableMode,
  isVariableAlias,
} from "../types";
import { ColorValue } from "./parse";
import { NodeStyles, NodeStylesCollection, NodeTokensCollections } from "./utilities";

class TokensCollectionMap extends Map<string, Variable> {
  getByCollection(collectionId: string): Variable[] {
    const collection = NodeTokensCollections.get(collectionId);

    return collection?.variableIds?.map((id) => this.get(id)).filter((value): value is Variable => !!value) || [];
  }

  getCollection(collectionId: string): VariableCollection | undefined {
    return NodeTokensCollections.get(collectionId);
  }

  getCollections(): VariableCollection[] {
    return Array.from(NodeTokensCollections.values());
  }

  setStyle(id: string, style: TypeStyle | Paint | Effect) {
    NodeStyles.set(id, style);
  }

  getStyle(id: string): StyleData | undefined {
    const style = NodeStylesCollection.get(id);
    const data = NodeStyles.get(id);

    if (style && data) {
      return {
        id,
        ...style,
        data,
      };
    }
  }

  getStyles(): StyleData[] {
    return Array.from(NodeStylesCollection.keys())
      .map((id) => this.getStyle(id))
      .filter((data): data is StyleData => !!data);
  }

  getByKey(key: string): Variable | undefined {
    key = key.split("/").shift()?.replace("VariableID:", "") || "";
    if (key) {
      return Array.from(this.values()).find((token) => token.key === key);
    }
  }

  getModeName(id: string): string | undefined {
    return this.getCollections()
      .reduce((modes: VariableMode[], collection) => [...modes, ...collection.modes], [])
      .find((mode) => mode.modeId === id)?.name;
  }

  resolveTokenVariable(id: string): Record<string, boolean | number | string | ColorValue | undefined> {
    const token = this.get(id) || this.getByKey(id);
    if (token) {
      return Object.keys(token.valuesByMode).reduce(
        (
          result: Record<string, boolean | number | string | ColorValue | undefined>,
          key: string,
        ): Record<string, boolean | number | string | ColorValue | undefined> => {
          const value = token.valuesByMode[key];
          if (isVariableAlias(value)) {
            const resolvedValue = this.resolveTokenVariable(value.id);
            return {
              ...result,
              ...Object.keys(resolvedValue).reduce(
                (result: Record<string, boolean | number | string | ColorValue | undefined>, subKey: string) => ({
                  ...result,
                  [`${key}+${subKey}`]: resolvedValue?.[subKey],
                }),
                {},
              ),
            };
          }
          return { ...result, [key]: typeof value === "object" ? new ColorValue(value) : value };
        },
        {},
      );
    }
    return {};
  }

  clear() {
    super.clear();
    NodeTokensCollections.clear();
    NodeStylesCollection.clear();
    NodeStyles.clear();
  }
}

export const TokensCollection = new TokensCollectionMap();

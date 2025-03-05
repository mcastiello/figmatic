import { Component, FigmaComponentData, FigmaComponentVariant } from "../types";
import { FigmaComponent } from "./component";

class ComponentsCollectionMap extends Map<string, FigmaComponent> {
  parse(sets: Record<string, Component> = {}, components: Record<string, Component> = {}) {
    const singleVariantComponents = Object.keys(components)
      .filter((id) => !components[id].componentSetId)
      .map((id): FigmaComponentData => {
        return {
          nodeId: id,
          name: components[id].name,
          description: components[id].description,
          variants: [],
        };
      });

    const multiVariantComponents = Object.keys(sets).map((setId): FigmaComponentData => {
      const variants = Object.keys(components)
        .filter((componentId) => components[componentId].componentSetId === setId)
        .map((componentId): FigmaComponentVariant => {
          return {
            nodeId: componentId,
            name: components[componentId].name,
            description: components[componentId].description,
          };
        });

      return {
        nodeId: setId,
        name: sets[setId].name,
        description: sets[setId].description,
        variants,
      };
    });

    [...singleVariantComponents, ...multiVariantComponents].forEach((data) => {
      const component = new FigmaComponent(data);

      // Store using the component id, but also using the id of each variant to make it easier to recall
      this.set(data.nodeId, component);
      data.variants.forEach(({ nodeId }) => this.set(nodeId, component));
    });
  }
}

export const ComponentsCollection = new ComponentsCollectionMap();

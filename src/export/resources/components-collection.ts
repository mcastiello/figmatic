import { Component } from "../types";

class ComponentsCollectionMap {
  private sets: Map<string, Component> = new Map();
  private components: Map<string, Component> = new Map();

  setComponents(data: Record<string, Component>) {
    Object.keys(data).forEach((key) => {
      this.components.set(key, data[key]);
    });
  }

  setComponentSets(data: Record<string, Component>) {
    Object.keys(data).forEach((key) => {
      this.sets.set(key, data[key]);
    });
  }
}

export const ComponentsCollection = new ComponentsCollectionMap();

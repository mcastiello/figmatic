import type { Component, FigmaComponentData, FigmaComponentVariant, Style, VariablesFile } from "../../types";
import { FigmaComponent } from "../parse/component";
import type { FigmaNode } from "../../nodes";
import { isNodeData, isTypedNodeData, NodeType } from "../../types";
import {
  BooleanOperationNode,
  CanvasNode,
  ComponentNode,
  ComponentSetNode,
  DocumentNode,
  EllipseNode,
  FrameNode,
  GroupNode,
  InstanceNode,
  LineNode,
  RectangleNode,
  RegularPolygonNode,
  SectionNode,
  StarNode,
  TextNode,
  VectorNode,
  WashiTapeNode,
} from "../../nodes";
import { TokensCollection } from "../tokens-collection";
import { NodesCollection } from "../nodes-collection";
import { ComponentsCollection } from "../components-collection";
import { NodeNameMap, NodeStylesCollection, NodeTokensCollections } from "./maps";

class Parser {
  parseComponents(fileName: string, sets: Record<string, Component> = {}, components: Record<string, Component> = {}) {
    const singleVariantComponents = Object.keys(components)
      .filter((id) => !components[id].componentSetId)
      .map((id): FigmaComponentData => {
        return {
          nodeId: id,
          name: components[id].name,
          description: components[id].description,
          variants: [],
          fileName,
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
        fileName,
      };
    });

    [...singleVariantComponents, ...multiVariantComponents].forEach((data) => {
      const component = new FigmaComponent(data);

      // Store using the component id, but also using the id of each variant to make it easier to recall
      ComponentsCollection.set(data.nodeId, component);
      data.variants.forEach(({ nodeId }) => ComponentsCollection.set(nodeId, component));
    });
  }

  parseNodes(data?: Record<string, unknown>, pageFilters?: (string | RegExp)[], parentId?: string) {
    let node: FigmaNode | undefined;
    if (isTypedNodeData(data, NodeType.BooleanOperation)) {
      node = new BooleanOperationNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Canvas)) {
      if (
        isNodeData(data) &&
        (!pageFilters ||
          pageFilters.length === 0 ||
          pageFilters.some((filter) =>
            filter instanceof RegExp ? filter.test(data.name) : filter.toLowerCase() === data.name.toLowerCase(),
          ))
      ) {
        node = new CanvasNode(data, parentId);
      }
    }
    if (isTypedNodeData(data, NodeType.ComponentSet)) {
      node = new ComponentSetNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Component)) {
      node = new ComponentNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Document)) {
      node = new DocumentNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Ellipse)) {
      node = new EllipseNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Frame)) {
      node = new FrameNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Group)) {
      node = new GroupNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Instance)) {
      node = new InstanceNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Line)) {
      node = new LineNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Rectangle)) {
      node = new RectangleNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.RegularPolygon)) {
      node = new RegularPolygonNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Section)) {
      node = new SectionNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Star)) {
      node = new StarNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Text)) {
      node = new TextNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.Vector)) {
      node = new VectorNode(data, parentId);
    }
    if (isTypedNodeData(data, NodeType.WashiTape)) {
      node = new WashiTapeNode(data, parentId);
    }

    if (node && node.id) {
      const nodeId = node.id;
      NodesCollection.set(nodeId, node);

      if (node.name) {
        const collection = NodeNameMap.get(node.name) || [];
        NodeNameMap.set(node.name, [...collection, nodeId]);
      }

      Object.entries(node.styles).map(([styleId, style]) => {
        TokensCollection.setStyle(styleId, style);
      });

      if (isNodeData(data)) {
        data.children?.forEach((nodeData) => this.parseNodes(nodeData, pageFilters, nodeId));
      }
    }
  }

  parseTokens(variables: VariablesFile, styles: Record<string, Style> = {}) {
    if (variables?.meta) {
      Object.values(variables.meta.variables).forEach((variable) => {
        TokensCollection.set(variable.id, variable);
      });
      Object.values(variables.meta.variableCollections).forEach((collection) => {
        NodeTokensCollections.set(collection.id, collection);
      });
      Object.entries(styles).forEach(([key, style]) => {
        NodeStylesCollection.set(key, style);
      });
    }
  }
}

export const CollectionParser = new Parser();

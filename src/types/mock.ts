import type { FigmaFile, GenericNode, VariablesFile } from "./nodes";
import type { Component, Style } from "./properties";
import { NodeType, PropertyTypes, StyleType, TokenStyleTypes, VariableScope, VariableType } from "./enumerators";

const components: Record<string, Component> = {
  "component-1": {
    name: "My Component",
    key: "Type=Default",
    componentSetId: "component-set-1",
    description: "",
  },
  "component-2": {
    name: "My Component",
    key: "Type=Hover",
    componentSetId: "component-set-1",
    description: "",
  },
  "component-3": {
    name: "Single Component",
    key: "",
    description: "",
  },
};
const componentSets: Record<string, Component> = {
  "component-set-1": {
    name: "Component",
    key: "",
    description: "element=button",
  },
};
const document = {
  id: "document",
  type: NodeType.Document,
  children: [
    {
      id: "page-1",
      name: "Elements",
      type: NodeType.Canvas,
      children: [
        {
          id: "component-set-1",
          name: "Component Set",
          type: NodeType.ComponentSet,
          children: [
            {
              id: "component-1",
              name: "Component",
              type: NodeType.Component,
              children: [
                {
                  id: "frame-1",
                  name: "Frame #1",
                  type: NodeType.Frame,
                },
              ],
            },
            {
              id: "component-2",
              name: "Component",
              type: NodeType.Component,
              children: [
                {
                  id: "frame-1",
                  name: "Frame #1",
                  type: NodeType.Frame,
                },
              ],
            },
          ],
        },
        {
          id: "component-3",
          name: "Component",
          type: NodeType.Component,
          children: [
            {
              id: "frame-component",
              name: "Frame Component",
              type: NodeType.Frame,
            },
          ],
        },
        {
          id: "frame-2",
          name: "Frame #2",
          type: NodeType.Frame,
          fills: {
            color: { r: 1, g: 0, b: 0 },
          },
          styles: {
            [TokenStyleTypes.Fill]: "style",
          },
        },
        {
          id: "group-1",
          name: "Group #1",
          type: NodeType.Group,
        },
        {
          id: "instance-1",
          name: "Instance #1",
          type: NodeType.Instance,
          componentId: "component-1",
        },
        {
          id: "section-1",
          name: "Section #1",
          type: NodeType.Section,
          children: [
            {
              id: "text-1",
              name: "Text #1",
              type: NodeType.Text,
              characters: "Test",
            },
          ],
        },
      ],
    },
    {
      id: "page-2",
      name: "Graphics",
      type: NodeType.Canvas,
      children: [
        {
          id: "graphic-1",
          name: "Graphic",
          type: NodeType.BooleanOperation,
        },
        {
          id: "graphic-2",
          name: "Graphic",
          type: NodeType.Ellipse,
        },
        {
          id: "graphic-3",
          name: "Graphic",
          type: NodeType.Line,
        },
        {
          id: "graphic-4",
          name: "Graphic",
          type: NodeType.Rectangle,
        },
        {
          id: "graphic-5",
          name: "Graphic",
          type: NodeType.RegularPolygon,
        },
        {
          id: "graphic-6",
          name: "Graphic",
          type: NodeType.Slice,
        },
        {
          id: "graphic-7",
          name: "Graphic",
          type: NodeType.Star,
        },
        {
          id: "graphic-8",
          name: "Graphic",
          type: NodeType.Vector,
        },
        {
          id: "graphic-9",
          name: "Graphic",
          type: NodeType.WashiTape,
        },
      ],
    },
  ],
} as GenericNode<NodeType.Document>;

const styles: Record<string, Style> = {
  style: {
    name: "Red",
    key: "style",
    description: "Red",
    styleType: StyleType.Fill,
    remote: false,
  },
};

export const tokensFile: VariablesFile = {
  meta: {
    variables: {
      "VariableID:11:22": {
        key: "11:22",
        name: "Var:Red",
        description: "",
        id: "VariableID:11:22",
        resolvedType: VariableType.Color,
        scopes: [VariableScope.AllScopes],
        variableCollectionId: "Dark Theme",
        valuesByMode: {
          Dark: { r: 1, g: 0, b: 0, a: 1 },
        },
      },
      "VariableID:33:44": {
        key: "33:44",
        name: "Var:Red:Secondary",
        description: "",
        id: "VariableID:33:44",
        resolvedType: VariableType.Color,
        scopes: [VariableScope.AllScopes],
        variableCollectionId: "Dark Theme",
        valuesByMode: {
          Dark: { type: PropertyTypes.VariableAlias, id: "VariableID:11:22" },
        },
      },
    },
    variableCollections: {
      "22:33": {
        key: "22:33",
        name: "Themes",
        id: "22:33",
        modes: [{ modeId: "55:66", name: "Dark Theme" }],
        defaultModeId: "55:66",
        variableIds: ["VariableID:11:22"],
      },
    },
  },
};

export const figmaFile: FigmaFile = {
  branches: [],
  document,
  components,
  componentSets,
  styles,
  name: "Figma File",
  editorType: "",
  lastModified: new Date().toJSON(),
  mainFileKey: "figma-file-1",
  role: "",
  schemaVersion: 1,
  thumbnailUrl: "",
  version: "1",
};

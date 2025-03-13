import { FigmaNode } from "./node";
import { NodeType, PropertyTypes, TokenStyleTypes, type Variable, VariableType } from "../types";
import { NodesCollection, TokensCollection } from "../resources";

describe("Nodes > FigmaNode", () => {
  const nodeGet = jest.spyOn(NodesCollection, "get");

  beforeEach(() => {
    NodesCollection.clear();
    TokensCollection.clear();
  });

  test("Initialise the node", () => {
    const parentNode = new FigmaNode({ id: "parent-id", type: NodeType.Frame });
    const childNode = new FigmaNode({ id: "child-id", type: NodeType.Frame });
    const node = new FigmaNode(
      {
        id: "test",
        type: NodeType.Frame,
        name: "My Node",
        children: [{ id: "child-id" }],
      },
      "parent-id",
    );

    NodesCollection.set("parent-id", parentNode);
    NodesCollection.set("child-id", childNode);
    NodesCollection.set("test", node);

    expect(node.id).toEqual("test");
    expect(node.type).toEqual(NodeType.Frame);
    expect(node.name).toEqual("My Node");
    expect(node.definition).toEqual({
      componentPropertyReferences: {},
      explicitVariableModes: {},
      rotation: 0,
      visible: true,
      name: "My Node",
    });
    expect(node.valid).toEqual(true);
    expect(node.isGraphicNode).toEqual(false);
    expect(node.styles).toEqual({});
    expect(node.getTokens(TokenStyleTypes.Fill)).toEqual([]);
    expect(node.parent).toEqual(parentNode);
    expect(nodeGet).toHaveBeenCalledWith("parent-id");
    expect(node.children).toEqual([childNode]);
    expect(nodeGet).toHaveBeenCalledWith("child-id");
  });

  test("Find child nodes by type", () => {
    const childNode = new FigmaNode({ id: "child-id", type: NodeType.Frame }, "test");
    const textNode = new FigmaNode({ id: "text-id", type: NodeType.Text }, "child-id");
    const frameNode = new FigmaNode({ id: "frame-id", type: NodeType.Frame }, "child-id");
    const node = new FigmaNode({
      id: "test",
      type: NodeType.Frame,
      name: "My Node",
      children: [{ id: "child-id" }],
    });
    NodesCollection.set("test", node);
    NodesCollection.set("child-id", childNode);
    NodesCollection.set("text-id", textNode);
    NodesCollection.set("frame-id", frameNode);

    expect(node.getNodesByType(NodeType.Frame)).toEqual([childNode, frameNode]);
    expect(node.getNodesByType(NodeType.Text)).toEqual([textNode]);
  });

  test("Generate a record of styles", () => {
    const node = new FigmaNode({
      id: "test",
      type: NodeType.Frame,
      name: "My Node",
      styles: {
        fills: "12:34",
        strokes: "56:78",
        effect: "22:44",
      },
      fills: [
        {
          color: { r: 1, g: 1, b: 1 },
        },
      ],
      strokes: {
        color: { r: 0, g: 0, b: 0 },
      },
    });

    expect(node.styles).toEqual({
      "12:34": {
        color: { r: 1, g: 1, b: 1 },
      },
      "56:78": {
        color: { r: 0, g: 0, b: 0 },
      },
    });
  });

  test("Generate a list of tokens", () => {
    const node = new FigmaNode({
      id: "test",
      type: NodeType.Frame,
      name: "My Node",
      boundVariables: {
        fill: {
          type: PropertyTypes.VariableAlias,
          id: "12:34",
        },
        strokes: [
          {
            type: PropertyTypes.VariableAlias,
            id: "56:78",
          },
        ],
      },
    });

    const whiteToken: Variable = {
      description: "",
      id: "12:34",
      key: "white",
      name: "White",
      resolvedType: VariableType.Color,
      scopes: [],
      variableCollectionId: "",
      valuesByMode: { "22:44": { r: 1, g: 1, b: 1, a: 1 } },
    };
    const blackToken: Variable = {
      description: "",
      id: "56:78",
      key: "black",
      name: "Black",
      resolvedType: VariableType.Color,
      scopes: [],
      variableCollectionId: "",
      valuesByMode: { "22:44": { r: 0, g: 0, b: 0, a: 1 } },
    };

    TokensCollection.set("12:34", whiteToken);
    TokensCollection.set("56:78", blackToken);

    expect(node.getTokens(TokenStyleTypes.Fill)).toEqual([whiteToken]);
    expect(node.getTokens(TokenStyleTypes.Strokes)).toEqual([blackToken]);
    expect(node.getTokens(TokenStyleTypes.Effect)).toEqual([]);
  });
});

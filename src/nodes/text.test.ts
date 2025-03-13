import { NodeType } from "../types";
import { TextNode } from "./text";

describe("Nodes > FigmaNode", () => {
  test("Initialise the node", () => {
    const node = new TextNode({
      id: "test",
      type: NodeType.Text,
      name: "My Node",
      characters: "test",
    });

    expect(node.id).toEqual("test");
    expect(node.type).toEqual(NodeType.Text);
    expect(node.content).toEqual("test");

    const emptyNode = new TextNode({
      id: "test",
      type: NodeType.Text,
      name: "My Node",
    });

    expect(emptyNode.content).toEqual("");
  });
});

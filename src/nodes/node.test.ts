import { FigmaNode } from "./node";
import { NodeType } from "../types";

describe("Nodes > FigmaNode", () => {
  test("Initialise the node", () => {
    const node = new FigmaNode(
      {
        id: "test",
        type: NodeType.Document,
        name: "My Node",
        children: [{ id: "childId" }],
      },
      "parentId",
    );

    expect(node.id).toEqual("test");
    expect(node.type).toEqual(NodeType.Document);
    expect(node.name).toEqual("My Node");
    expect(node.definition).toEqual({
      boundVariables: {},
      componentPropertyReferences: {},
      explicitVariableModes: {},
      rotation: 0,
      visible: true,
      name: "My Node",
    });
    expect(node.valid).toEqual(true);
    expect(node.isGraphicNode).toEqual(false);
  });
});

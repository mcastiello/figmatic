import { FigmaNode } from "./node";
import { NodeType } from "../types";
import { NodesCollection } from "../resources";
import { InstanceNode } from "./instance";

describe("Nodes > FigmaNode", () => {
  const nodeGet = jest.spyOn(NodesCollection, "get");

  beforeEach(() => {
    NodesCollection.clear();
  });

  test("Initialise the node", () => {
    const parentNode = new FigmaNode({ id: "parent-id", type: NodeType.Frame });
    const childNode = new FigmaNode({ id: "child-id", type: NodeType.Frame });
    const componentNode = new FigmaNode({ id: "component-id", type: NodeType.Component });
    const node = new InstanceNode(
      {
        id: "test",
        type: NodeType.Instance,
        name: "My Node",
        children: [{ id: "child-id" }],
        componentId: "component-id",
      },
      "parent-id",
    );

    NodesCollection.set("component-id", componentNode);
    NodesCollection.set("parent-id", parentNode);
    NodesCollection.set("child-id", childNode);
    NodesCollection.set("test", node);

    expect(node.id).toEqual("test");
    expect(node.type).toEqual(NodeType.Instance);
    expect(node.component).toEqual(componentNode);
    expect(node.children).toEqual([]);
    expect(node.overrides).toEqual([childNode]);
    expect(nodeGet).toHaveBeenCalledWith("child-id");

    NodesCollection.delete("child-id");
    expect(node.overrides).toEqual([]);

    const noChildNode = new InstanceNode({
      id: "test",
      type: NodeType.Instance,
      name: "My Node",
    });
    expect(noChildNode.component).toEqual(undefined);
    expect(noChildNode.overrides).toEqual([]);
  });
});

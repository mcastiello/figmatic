import { TokensCollection } from "../tokens-collection";
import { NodesCollection } from "../nodes-collection";
import { ComponentsCollection } from "../components-collection";
import { CollectionParser } from "./parser";
import { InstanceNode, TextNode } from "../../nodes";
import { NodeType } from "../../types";

describe("Parser", () => {
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
            ],
          },
          {
            id: "frame-2",
            name: "Frame #2",
            type: NodeType.Frame,
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
            id: "graphic-9",
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
  };
  beforeEach(() => {
    NodesCollection.clear();
    TokensCollection.clear();
    ComponentsCollection.clear();
  });

  test("Parse Nodes", () => {
    CollectionParser.parseNodes(document);

    expect(NodesCollection.get<TextNode>("text-1")?.content).toEqual("Test");
    expect(NodesCollection.get<InstanceNode>("instance-1")?.component?.id).toEqual("component-1");
    expect(NodesCollection.get("graphic-2")?.type).toEqual(NodeType.Ellipse);
  });

  test("Parse Nodes from specific pages", () => {
    CollectionParser.parseNodes(document, ["Elements"]);

    expect(NodesCollection.get("group-1")?.type).toEqual(NodeType.Group);
    expect(NodesCollection.get("graphic-3")).toEqual(undefined);
  });
});

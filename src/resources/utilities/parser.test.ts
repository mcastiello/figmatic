import { TokensCollection } from "../tokens-collection";
import { NodesCollection } from "../nodes-collection";
import { ComponentsCollection } from "../components-collection";
import { CollectionParser } from "./parser";
import { InstanceNode, TextNode } from "../../nodes";
import { NodeType } from "../../types";
import { ColorValue } from "../parse";
import { figmaFile, tokensFile } from "../../types/mock";

describe("Parser", () => {
  beforeEach(() => {
    NodesCollection.clear();
    TokensCollection.clear();
    ComponentsCollection.clear();
  });

  test("Parse Nodes", () => {
    CollectionParser.parseNodes(figmaFile.document);

    expect(NodesCollection.get<TextNode>("text-1")?.content).toEqual("Test");
    expect(NodesCollection.get<InstanceNode>("instance-1")?.component?.id).toEqual("component-1");
    expect(NodesCollection.get("graphic-2")?.type).toEqual(NodeType.Ellipse);
  });

  test("Parse Nodes from specific pages", () => {
    CollectionParser.parseNodes(figmaFile.document, ["Elements"]);

    expect(NodesCollection.get("group-1")?.type).toEqual(NodeType.Group);
    expect(NodesCollection.get("graphic-3")).toEqual(undefined);
  });

  test("Parse Components", () => {
    CollectionParser.parseNodes(figmaFile.document);
    CollectionParser.parseComponents("test", figmaFile.componentSets, figmaFile.components);

    expect(ComponentsCollection.get("component-set-1")?.variantNodes[0].id).toEqual("component-1");
    expect(ComponentsCollection.get("component-set-1")?.definition.name).toEqual("Component");
    expect(ComponentsCollection.get("component-3")?.variantNodes[0].id).toEqual("component-3");
    expect(ComponentsCollection.get("component-3")?.definition.name).toEqual("Single Component");
  });

  test("Parse Tokens", () => {
    CollectionParser.parseNodes(figmaFile.document);
    CollectionParser.parseTokens(tokensFile, figmaFile.styles);

    expect(TokensCollection.getStyle("style")?.data).toEqual({ color: { r: 1, g: 0, b: 0 } });
    expect(TokensCollection.getStyle("style")?.name).toEqual("Red");

    expect(TokensCollection.getCollection("22:33")?.name).toEqual("Themes");
    expect(TokensCollection.getByCollection("22:33")?.[0].name).toEqual("Var:Red");
    expect(TokensCollection.getByKey("VariableID:11:22")?.name).toEqual("Var:Red");
    expect(TokensCollection.getModeName("55:66")).toEqual("Dark Theme");
    expect(TokensCollection.resolveTokenVariable("11:22")).toEqual({ Dark: new ColorValue({ r: 1, g: 0, b: 0 }) });
    expect(TokensCollection.resolveTokenVariable("33:44")).toEqual({ Dark: new ColorValue({ r: 1, g: 0, b: 0 }) });
  });
});

import { Figmatic } from "./figmatic";
import { FigmaApi, NodeStylesCollection, NodeTokensCollections } from "./utilities";
import { figmaFile, tokensFile } from "../types/mock";
import { ComponentsCollection } from "./components-collection";
import { NodesCollection } from "./nodes-collection";
import { TokensCollection } from "./tokens-collection";
import { NodeType } from "../types";

describe("Figmatic", () => {
  const requestFile = jest.spyOn(FigmaApi, "getFigmaFile").mockResolvedValue(figmaFile);
  const requestLocalVariables = jest.spyOn(FigmaApi, "getLocalVariables").mockResolvedValue(tokensFile);
  const requestPublicVariables = jest.spyOn(FigmaApi, "getPublishedVariables").mockResolvedValue(undefined);

  test("Load Figma file", async () => {
    await Figmatic.load("test", "token123");

    expect(requestFile).toHaveBeenCalledWith("test");
    expect(requestLocalVariables).toHaveBeenCalled();
    expect(requestPublicVariables).toHaveBeenCalled();

    expect(ComponentsCollection.size).toEqual(4);
    expect(NodesCollection.size).toEqual(22);
    expect(TokensCollection.size).toEqual(2);
    expect(NodeTokensCollections.size).toEqual(1);
    expect(NodeStylesCollection.size).toEqual(1);

    expect(NodesCollection.getByType(NodeType.Frame).length).toEqual(3);
    expect(NodesCollection.getByName(/Graphic/).length).toEqual(9);
    expect(NodesCollection.getByName("Graphic").length).toEqual(8);
  });
});

import { className } from "./text";

describe("Text Functions", () => {
  test("className", () => {
    expect(className("My ClassName")).toEqual("my-class-name");
    expect(className("@@My-__ ClassName9")).toEqual("my-class-name-9");
    expect(className("9 classes")).toEqual("cn-9-classes");
    expect(className("ALT")).toEqual("a-l-t");
  });
});

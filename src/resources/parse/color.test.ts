import { ColorValue } from "./color";

describe("Color", () => {
  test("Parse RGB Color value", () => {
    const color = new ColorValue({ r: 1, g: 0, b: 0 });

    expect(color.toString()).toEqual("#ff0000");
    expect(color.rgb).toEqual("rgb(255, 0, 0)");
    expect(color.toString(true)).toEqual("hsl(0, 1, 1)");
  });
  test("Parse RGBA Color value", () => {
    const color = new ColorValue({ r: 1, g: 0, b: 0, a: 0.5 });

    expect(color.toString()).toEqual("rgba(255, 0, 0, 0.5)");
    expect(color.toString(true)).toEqual("hsla(0, 1, 1, 0.5)");
  });
});

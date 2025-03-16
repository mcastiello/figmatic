import type { Color, RGBColor } from "../../types";

export class ColorValue {
  private readonly color: Color;
  private readonly h: number;
  private readonly s: number;
  private readonly l: number;

  constructor(color: RGBColor | Color) {
    this.color = { a: 1, ...color };

    const max: number = Math.max(this.color.r, this.color.g, this.color.b);
    const min: number = Math.min(this.color.r, this.color.g, this.color.b);
    let h: number = 0;
    let s: number = 0;
    const l: number = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case this.color.r:
          h = (this.color.g - this.color.b) / d + (this.color.g < this.color.b ? 6 : 0);
          break;
        case this.color.g:
          h = (this.color.b - this.color.r) / d + 2;
          break;
        case this.color.b:
          h = (this.color.r - this.color.g) / d + 4;
          break;
      }

      h /= 6;
    }

    this.h = h;
    this.s = s;
    this.l = l;
  }

  get red() {
    return Math.round(this.color.r * 255);
  }

  get green() {
    return Math.round(this.color.g * 255);
  }

  get blue() {
    return Math.round(this.color.b * 255);
  }

  get alpha() {
    return this.color.a;
  }

  get hue() {
    return this.h;
  }

  get saturation() {
    return this.s;
  }

  get lightness() {
    return this.s;
  }

  get hsl() {
    return `hsl(${this.hue}, ${this.saturation}, ${this.lightness})`;
  }

  get hsla() {
    return `hsla(${this.hue}, ${this.saturation}, ${this.lightness}, ${this.alpha})`;
  }

  get rgb() {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }

  get rgba() {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }

  get hex() {
    return `#${this.red.toString(16).padStart(2, "0")}${this.green.toString(16).padStart(2, "0")}${this.blue.toString(16).padStart(2, "0")}`;
  }

  toString(hsl: boolean = false) {
    return hsl ? (this.alpha !== 1 ? this.hsla : this.hsl) : this.alpha !== 1 ? this.rgba : this.hex;
  }
}

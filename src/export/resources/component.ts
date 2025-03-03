import { FigmaComponentData } from "../types";

export class FigmaComponent {
  protected readonly data: FigmaComponentData;

  constructor(data: FigmaComponentData) {
    this.data = data;
  }
}

import type { ParsedComponent } from "../../types";
import { ParsedNodesCollection } from "../utilities/maps";

export class ParsedNode {
  private readonly data: ParsedComponent;
  private readonly childrenIds: string[];

  constructor(data: ParsedComponent, childrenIds: string[]) {
    this.data = data;
    this.childrenIds = childrenIds;
  }

  get children() {
    return this.childrenIds.map((id) => ParsedNodesCollection.get(id)).filter((data): data is ParsedNode => !!data);
  }

  get name(): string {
    return this.data.styles.name;
  }

  get definition() {
    return this.data;
  }
}

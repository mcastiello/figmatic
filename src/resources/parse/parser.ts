import { ExportFormat, FigmaticSeverity, type NodesMap, type ParsedComponent } from "../../types";
import { Logger } from "../utilities/log";
import { FigmaApi } from "../utilities/api";

export abstract class Parser<Type extends keyof NodesMap> {
  abstract parse<Node extends NodesMap[Type]>(node: Node): Promise<ParsedComponent>;
  protected log(message: string, severity: FigmaticSeverity = FigmaticSeverity.Info, data?: unknown): void {
    Logger.log(message, severity, Date.now(), data);
  }
}

export abstract class GraphicParser extends Parser<keyof NodesMap> {
  protected async getGraphicData(id: string) {
    try {
      const exports = await FigmaApi.downloadGraphicNodes([id], ExportFormat.SVG);
      const markup = Object.values(exports).shift();
      if (typeof markup === "string") {
        return markup;
      }
    } catch (error) {
      this.log(`Download of graphic node "${id}" failed`, FigmaticSeverity.Error, { error });
    }
  }
}

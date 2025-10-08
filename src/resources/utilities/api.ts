import {
  type DownloadedGraphics,
  type ExportFile,
  ExportFormat,
  type FigmaFile,
  FigmaticSeverity,
  type VariablesFile,
} from "../../types";
import { GRAPHIC_RESPONSE_TYPES } from "../../types/constants";
import { Logger } from "./log";

const FIGMA_ENDPOINT = "https://api.figma.com/v1";

class Api {
  private token: string | undefined;
  private fileName: string | undefined;
  private batchSize: number = 25;

  setToken(token: string) {
    this.token = token;
  }

  setBatchSize(batchSize: number) {
    this.batchSize = batchSize;
  }

  getBatchSize() {
    return this.batchSize;
  }

  async getFigmaFile(fileName: string): Promise<FigmaFile | undefined> {
    if (this.token) {
      this.fileName = fileName;
      const file = await fetch(`${FIGMA_ENDPOINT}/files/${this.fileName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Charset": "UTF-8",
          "X-Figma-Token": this.token,
        },
      });

      return await file.json();
    }
  }

  async getLocalVariables(): Promise<VariablesFile | undefined> {
    if (this.token) {
      const variablesFile = await fetch(`${FIGMA_ENDPOINT}/files/${this.fileName}/variables/local`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Charset": "UTF-8",
          "X-Figma-Token": this.token,
        },
      });

      return await variablesFile.json();
    }
  }

  async getPublishedVariables(): Promise<VariablesFile | undefined> {
    if (this.token) {
      const variablesFile = await fetch(`${FIGMA_ENDPOINT}/files/${this.fileName}/variables/published`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Charset": "UTF-8",
          "X-Figma-Token": this.token,
        },
      });

      return await variablesFile.json();
    }
  }

  calculateSize(image: string | ArrayBuffer): number {
    return (image instanceof ArrayBuffer ? image.byteLength : image.length) / 1024;
  }

  calculateTotalSize(images: (string | ArrayBuffer)[]): string {
    return `${images.reduce((total, image) => total + this.calculateSize(image), 0).toFixed(2)}Kb`;
  }

  private async downloadBatchOfGraphicNodes<Format extends ExportFormat = ExportFormat.SVG>(
    nodeIds: string[],
    format: Format = ExportFormat.SVG as Format,
    scale = 1,
  ): Promise<DownloadedGraphics<Format>> {
    const images: DownloadedGraphics<Format> = {};

    if (this.token) {
      Logger.log(`Creating export for ${nodeIds.length} graphic nodes`, FigmaticSeverity.Debug);
      const response = await fetch(
        `${FIGMA_ENDPOINT}/images/${this.fileName}?ids=${nodeIds}&scale=${scale}&format=${format}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Charset": "UTF-8",
            "X-Figma-Token": this.token,
          },
        },
      );

      Logger.log(`Export created`, FigmaticSeverity.Debug);

      const imageLinks: ExportFile = await response.json();

      Logger.log(`Preparing download of ${Object.keys(imageLinks).length} image files`, FigmaticSeverity.Debug);

      for (const [id, url] of Object.entries(imageLinks.images)) {
        Logger.log(`Download of file ${url}`, FigmaticSeverity.Debug);
        if (url) {
          const image = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": GRAPHIC_RESPONSE_TYPES[format],
              "Accept-Charset": "UTF-8",
            },
          });

          images[id] = (
            format === ExportFormat.SVG ? await image.text() : await image.arrayBuffer()
          ) as (typeof images)[string];
          Logger.log(`Download completed: ${this.calculateTotalSize([images[id]])}`, FigmaticSeverity.Debug);
        }
      }
    }
    return images;
  }

  async downloadGraphicNodes<Format extends ExportFormat = ExportFormat.SVG>(
    nodeIds: string[],
    format: Format = ExportFormat.SVG as Format,
    scale = 1,
  ): Promise<DownloadedGraphics<Format>> {
    let images: DownloadedGraphics<Format> = {};

    if (this.token) {
      const batches: string[][] = [];

      while (nodeIds.length > 0) {
        batches.push(nodeIds.splice(0, this.batchSize));
      }

      Logger.log(`Graphic nodes will be downloaded in ${batches.length} batches`, FigmaticSeverity.Debug);

      for (let i = 0; i < batches.length; i++) {
        Logger.log(`Start exporting batch ${i + 1}...`, FigmaticSeverity.Debug);
        const downloadedImages = await this.downloadBatchOfGraphicNodes(batches[i], format, scale);

        images = { ...images, ...downloadedImages };
      }
    }
    return images;
  }
}

export const FigmaApi = new Api();

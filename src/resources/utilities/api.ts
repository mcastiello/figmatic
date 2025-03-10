import { type ExportFile, ExportFormat, type FigmaFile, FigmaticSeverity, type VariablesFile } from "../../types";
import { GRAPHIC_RESPONSE_TYPES } from "../../types/constants";
import { Logger } from "./log";

const FIGMA_ENDPOINT = "https://api.figma.com/v1";

class Api {
  private token: string | undefined;

  setToken(token: string) {
    this.token = token;
  }

  async getFigmaFile(fileName: string): Promise<FigmaFile | undefined> {
    if (this.token) {
      const file = await fetch(`${FIGMA_ENDPOINT}/files/${fileName}`, {
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

  async getLocalVariables(fileName: string): Promise<VariablesFile | undefined> {
    if (this.token) {
      const variablesFile = await fetch(`${FIGMA_ENDPOINT}/files/${fileName}/variables/local`, {
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

  async getPublishedVariables(fileName: string): Promise<VariablesFile | undefined> {
    if (this.token) {
      const variablesFile = await fetch(`${FIGMA_ENDPOINT}/files/${fileName}/variables/published`, {
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

  async downloadGraphicNodes(
    fileName: string,
    nodeIds: string[],
    format: ExportFormat = ExportFormat.SVG,
    scale = 1,
  ): Promise<Record<string, string | ArrayBuffer>> {
    const images: Record<string, string | ArrayBuffer> = {};

    if (this.token) {
      const response = await fetch(
        `${FIGMA_ENDPOINT}/images/${fileName}?ids=${nodeIds}&scale=${scale}&format=${format}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Charset": "UTF-8",
            "X-Figma-Token": this.token,
          },
        },
      );

      const imageLinks: ExportFile = await response.json();
      const images: Record<string, string | ArrayBuffer> = {};

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

          images[id] = format === ExportFormat.SVG ? await image.text() : await image.arrayBuffer();
        }
      }
    }
    return images;
  }
}

export const FigmaApi = new Api();

import { EventBus } from "@mcastiello/event-bus";
import type { EventOf, SubscriptionConfig, SubscriptionOf } from "@mcastiello/event-bus";
import {
  ExportFile,
  ExportFormat,
  FigmaFile,
  FigmaticEvents,
  FigmaticSeverity,
  NodeType,
  VariablesFile,
} from "../types";
import { GRAPHIC_RESPONSE_TYPES } from "../types/internal";
import { NodesCollection } from "./nodes-collection";
import { ComponentsCollection } from "./components-collection";
import { TokensCollection } from "./tokens-collection";
import { Channels, FigmaticBusConfig, FigmaticBusDefinition } from "../types/events";
import { FigmaNode } from "../nodes";

const FIGMA_ENDPOINT = "https://api.figma.com/v1";

class FigmaLoader {
  private token: string | undefined;
  private file: string | undefined;
  private branch: string | undefined;
  private pageFilters: (string | RegExp)[] | undefined;
  private bus: EventBus<FigmaticBusDefinition> = new EventBus(FigmaticBusConfig);

  private data: Map<string, FigmaFile> = new Map();
  private variables: Map<string, VariablesFile> = new Map();

  private get channel() {
    return this.bus.getChannel(Channels.Figmatic);
  }

  private getDuration(start: number, end: number): string {
    const duration = end - start;
    const minutes = Math.floor(duration / 1000 / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((duration / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const ms = Math.floor(duration % 1000)
      .toString()
      .padStart(3, "0");

    return `${minutes}:${seconds}.${ms}`;
  }

  subscribe<Event extends EventOf<FigmaticBusDefinition, Channels.Figmatic>>(
    event: Event,
    subscription: SubscriptionOf<FigmaticBusDefinition, Channels.Figmatic, Event>,
    options?: SubscriptionConfig,
  ) {
    return this.channel.subscribe(event, subscription, options);
  }

  async load(file: string, token: string, pageFilters?: (string | RegExp)[]): Promise<void> {
    this.file = file;
    this.token = token;
    this.branch = undefined;
    this.pageFilters = pageFilters;

    const start = Date.now();

    this.channel.publish(FigmaticEvents.LoadStarted);
    this.channel.publish(FigmaticEvents.Message, {
      message: `Load Figma file "${file}" started`,
      severity: FigmaticSeverity.Info,
      timestamp: start,
    });

    if (!this.data.get(file)) {
      await this.downloadSelectedBranch();
    }

    this.parseFigmaFile();

    const end = Date.now();

    this.channel.publish(FigmaticEvents.LoadCompleted);
    this.channel.publish(FigmaticEvents.Message, {
      message: `Loading completed:\n\t- Duration: ${this.getDuration(start, end)}`,
      severity: FigmaticSeverity.Info,
      timestamp: end,
    });
  }

  get selectedBranch() {
    return this.branch || this.file;
  }

  private async downloadSelectedBranch(): Promise<void> {
    if (this.selectedBranch && this.token) {
      try {
        this.channel.publish(FigmaticEvents.BranchDownloadStarted, { branch: this.selectedBranch });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of branch "${this.selectedBranch}" started`,
          severity: FigmaticSeverity.Debug,
          timestamp: Date.now(),
        });

        const file = await fetch(`${FIGMA_ENDPOINT}/files/${this.selectedBranch}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Charset": "UTF-8",
            "X-Figma-Token": this.token,
          },
        });

        const data = await file.json();

        this.data.set(this.selectedBranch, data);

        this.channel.publish(FigmaticEvents.BranchDownloadCompleted, { branch: this.selectedBranch });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of branch "${this.selectedBranch}" completed`,
          severity: FigmaticSeverity.Debug,
          timestamp: Date.now(),
        });
      } catch (error) {
        this.channel.publish(FigmaticEvents.BranchDownloadFailed, error as Error);
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of branch "${this.selectedBranch}" failed`,
          severity: FigmaticSeverity.Error,
          timestamp: Date.now(),
          data: { error },
        });
      }

      try {
        this.channel.publish(FigmaticEvents.TokensDownloadStarted, { branch: this.selectedBranch });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of tokens for "${this.selectedBranch}" started`,
          severity: FigmaticSeverity.Debug,
          timestamp: Date.now(),
        });

        const response = await fetch(`${FIGMA_ENDPOINT}/files/${this.selectedBranch}/variables/local`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Charset": "UTF-8",
            "X-Figma-Token": this.token,
          },
        });

        const variables = await response.json();

        this.variables.set(this.selectedBranch, variables);

        this.channel.publish(FigmaticEvents.TokensDownloadCompleted, { branch: this.selectedBranch });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of tokens for branch "${this.selectedBranch}" completed`,
          severity: FigmaticSeverity.Debug,
          timestamp: Date.now(),
        });
      } catch (error) {
        this.channel.publish(FigmaticEvents.TokensDownloadFailed, error as Error);
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of tokens for branch "${this.selectedBranch}" failed`,
          severity: FigmaticSeverity.Error,
          timestamp: Date.now(),
          data: { error },
        });
      }
    }
  }

  private parseFigmaFile() {
    if (this.selectedBranch) {
      const data = this.data.get(this.selectedBranch);
      const variables = this.variables.get(this.selectedBranch);

      if (data) {
        try {
          const start = Date.now();
          this.channel.publish(FigmaticEvents.ParseNodesStarted);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of nodes for "${this.selectedBranch}" started`,
            severity: FigmaticSeverity.Debug,
            timestamp: start,
            data: { filters: this.pageFilters },
          });

          NodesCollection.clear();
          NodesCollection.parse(data.document, this.pageFilters);

          const end = Date.now();
          this.channel.publish(FigmaticEvents.ParseNodesCompleted);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of nodes for "${this.selectedBranch}" completed:\n\t- Total nodes: ${NodesCollection.size}\n\t- Pages: ${NodesCollection.getByType(NodeType.Canvas).length}\n\t- Duration: ${this.getDuration(start, end)}`,
            severity: FigmaticSeverity.Info,
            timestamp: end,
            data: { filters: this.pageFilters },
          });
        } catch (error) {
          this.channel.publish(FigmaticEvents.ParseNodesFailed, error as Error);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of nodes for branch "${this.selectedBranch}" failed`,
            severity: FigmaticSeverity.Error,
            timestamp: Date.now(),
            data: { error },
          });
        }

        try {
          this.channel.publish(FigmaticEvents.ParseComponentsStarted);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of components for "${this.selectedBranch}" started`,
            severity: FigmaticSeverity.Debug,
            timestamp: Date.now(),
          });

          ComponentsCollection.clear();
          ComponentsCollection.parse(data.componentSets, data.components);

          this.channel.publish(FigmaticEvents.ParseComponentsCompleted);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of components for "${this.selectedBranch}" completed:\n\t- Total components: ${ComponentsCollection.size}`,
            severity: FigmaticSeverity.Info,
            timestamp: Date.now(),
          });
        } catch (error) {
          this.channel.publish(FigmaticEvents.ParseComponentsFailed, error as Error);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of components for branch "${this.selectedBranch}" failed`,
            severity: FigmaticSeverity.Error,
            timestamp: Date.now(),
            data: { error },
          });
        }

        try {
          this.channel.publish(FigmaticEvents.ParseTokensStarted);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of tokens for "${this.selectedBranch}" started`,
            severity: FigmaticSeverity.Debug,
            timestamp: Date.now(),
          });

          TokensCollection.clear();
          if (variables) {
            TokensCollection.parse(variables, data.styles);
          }

          this.channel.publish(FigmaticEvents.ParseTokensCompleted);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of tokens for "${this.selectedBranch}" completed:\n\t- Total tokens: ${TokensCollection.size}\n\t- Collections: ${TokensCollection.getCollections().length}\n\t- Styles: ${TokensCollection.getStyles().length}`,
            severity: FigmaticSeverity.Info,
            timestamp: Date.now(),
          });
        } catch (error) {
          this.channel.publish(FigmaticEvents.ParseTokensFailed, error as Error);
          this.channel.publish(FigmaticEvents.Message, {
            message: `Parsing of tokens for branch "${this.selectedBranch}" failed`,
            severity: FigmaticSeverity.Error,
            timestamp: Date.now(),
            data: { error },
          });
        }
      }
    }
  }

  async downloadGraphics(
    nodes: FigmaNode[],
    format: ExportFormat = ExportFormat.SVG,
    scale: number = 1,
  ): Promise<Record<string, string | ArrayBuffer>> {
    if (this.selectedBranch && this.token) {
      try {
        const start = Date.now();
        const nodeNames = nodes.map(({ name, id }) => name || id).filter((value): value is string => !!value);
        this.channel.publish(FigmaticEvents.GraphicDownloadStarted, {
          nodes: nodeNames,
          format,
          scale,
        });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of graphic elements started`,
          severity: FigmaticSeverity.Info,
          timestamp: start,
        });
        const nodeIds = nodes.map((node) => node.id).join(",");
        const response = await fetch(
          `${FIGMA_ENDPOINT}/images/${this.selectedBranch}?ids=${nodeIds}&scale=${scale}&format=${format}`,
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
          if (url) {
            this.channel.publish(FigmaticEvents.Message, {
              message: `Download of image ${url}`,
              severity: FigmaticSeverity.Debug,
              timestamp: Date.now(),
            });
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

        const end = Date.now();
        this.channel.publish(FigmaticEvents.GraphicDownloadCompleted, {
          nodes: nodeNames,
          format,
          scale,
        });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of graphic elements completed:\n\t- Total downloads: ${Object.keys(images).length}\n\t- Duration: ${this.getDuration(start, end)}`,
          severity: FigmaticSeverity.Info,
          timestamp: start,
        });

        return images;
      } catch (error) {
        this.channel.publish(FigmaticEvents.GraphicDownloadFailed, error as Error);
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of graphic elements failed`,
          severity: FigmaticSeverity.Error,
          timestamp: Date.now(),
          data: { error },
        });
      }
    }
    return {};
  }

  async selectBranch(branch?: string): Promise<void> {
    if (branch !== this.branch && this.file) {
      if (branch) {
        const main = this.data.get(this.file);

        if (main?.branches.map(({ name }) => name).includes(branch)) {
          this.branch = branch;
        }
      } else {
        this.branch = undefined;
      }

      if (this.selectedBranch && !this.data.get(this.selectedBranch)) {
        const start = Date.now();
        this.channel.publish(FigmaticEvents.SwitchBranchStarted, { branch: this.selectedBranch });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Switch to branch "${this.selectedBranch}" started`,
          severity: FigmaticSeverity.Info,
          timestamp: start,
        });

        await this.downloadSelectedBranch();

        this.parseFigmaFile();

        const end = Date.now();

        this.channel.publish(FigmaticEvents.SwitchBranchCompleted, { branch: this.selectedBranch });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Switch to branch "${this.selectedBranch}" completed:  ${this.getDuration(start, end)}`,
          severity: FigmaticSeverity.Info,
          timestamp: end,
        });
      }
    }
  }
}

export const Figmatic = new FigmaLoader();

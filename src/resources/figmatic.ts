import { EventBus } from "@mcastiello/event-bus";
import type { EventOf, SubscriptionConfig, SubscriptionOf } from "@mcastiello/event-bus";
import { ExportFormat, type FigmaFile, FigmaticEvents, FigmaticSeverity, NodeType, type VariablesFile } from "../types";
import { NodesCollection } from "./nodes-collection";
import { ComponentsCollection } from "./components-collection";
import { TokensCollection } from "./tokens-collection";
import { CollectionParser } from "./parser";
import { FigmaApi } from "./api";
import { Channels, FigmaticBusConfig, type FigmaticBusDefinition } from "../types/events";
import type { FigmaNode } from "../nodes";

class FigmaLoader {
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
    this.branch = undefined;
    this.pageFilters = pageFilters;

    FigmaApi.setToken(token);

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

  private async downloadBranch(fileName: string): Promise<void> {
    try {
      this.channel.publish(FigmaticEvents.BranchDownloadStarted, { branch: fileName });
      this.channel.publish(FigmaticEvents.Message, {
        message: `Download of branch "${fileName}" started`,
        severity: FigmaticSeverity.Debug,
        timestamp: Date.now(),
      });

      const data = await FigmaApi.getFigmaFile(fileName);

      if (data) {
        this.data.set(fileName, data);

        this.channel.publish(FigmaticEvents.BranchDownloadCompleted, { branch: fileName });
        this.channel.publish(FigmaticEvents.Message, {
          message: `Download of branch "${fileName}" completed`,
          severity: FigmaticSeverity.Debug,
          timestamp: Date.now(),
        });
      } else {
        throw new Error("File not downloaded");
      }
    } catch (error) {
      this.channel.publish(FigmaticEvents.BranchDownloadFailed, error as Error);
      this.channel.publish(FigmaticEvents.Message, {
        message: `Download of branch "${fileName}" failed`,
        severity: FigmaticSeverity.Error,
        timestamp: Date.now(),
        data: { error },
      });
    }

    try {
      this.channel.publish(FigmaticEvents.TokensDownloadStarted, { branch: fileName });
      this.channel.publish(FigmaticEvents.Message, {
        message: `Download of tokens for "${fileName}" started`,
        severity: FigmaticSeverity.Debug,
        timestamp: Date.now(),
      });

      const localVariables = await FigmaApi.getLocalVariables(fileName);

      const remoteVariables = await FigmaApi.getPublishedVariables(fileName);

      if (localVariables && remoteVariables) {
        this.variables.set(fileName, {
          meta: {
            variables: { ...remoteVariables.meta.variables, ...localVariables.meta.variables },
            variableCollections: {
              ...remoteVariables.meta.variableCollections,
              ...localVariables.meta.variableCollections,
            },
          },
        });
      }

      this.channel.publish(FigmaticEvents.TokensDownloadCompleted, { branch: fileName });
      this.channel.publish(FigmaticEvents.Message, {
        message: `Download of tokens for branch "${fileName}" completed`,
        severity: FigmaticSeverity.Debug,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.channel.publish(FigmaticEvents.TokensDownloadFailed, error as Error);
      this.channel.publish(FigmaticEvents.Message, {
        message: `Download of tokens for branch "${fileName}" failed`,
        severity: FigmaticSeverity.Error,
        timestamp: Date.now(),
        data: { error },
      });
    }
  }

  private async downloadSelectedBranch(): Promise<void> {
    if (this.selectedBranch) {
      return this.downloadBranch(this.selectedBranch);
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

          CollectionParser.parseNodes(data.document, this.pageFilters);

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

          CollectionParser.parseComponents(this.selectedBranch, data.componentSets, data.components);

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

          if (variables) {
            CollectionParser.parseTokens(variables, data.styles);
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

  clear() {
    NodesCollection.clear();
    ComponentsCollection.clear();
    TokensCollection.clear();
  }

  async downloadGraphics(
    nodes: FigmaNode[],
    format: ExportFormat = ExportFormat.SVG,
    scale: number = 1,
  ): Promise<Record<string, string | ArrayBuffer>> {
    if (this.selectedBranch) {
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
        const nodeIds = nodes.map((node) => node.id).filter((id): id is string => !!id);

        const images = await FigmaApi.downloadGraphicNodes(this.selectedBranch, nodeIds, format, scale);

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

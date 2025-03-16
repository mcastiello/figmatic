import type { EventOf, SubscriptionConfig, SubscriptionOf } from "@mcastiello/event-bus";
import { ExportFormat, type FigmaFile, FigmaticEvents, FigmaticSeverity, NodeType, type VariablesFile } from "../types";
import { NodesCollection } from "./nodes-collection";
import { ComponentsCollection } from "./components-collection";
import { TokensCollection } from "./tokens-collection";
import { CollectionParser } from "./utilities/parser";
import { FigmaApi } from "./utilities/api";
import { Logger } from "./utilities/log";
import { Channels, type FigmaticBusDefinition } from "../types/events";
import type { FigmaNode } from "../nodes";

class FigmaLoader {
  private file: string | undefined;
  private branch: string | undefined;
  private pageFilters: (string | RegExp)[] | undefined;

  private data: Map<string, FigmaFile> = new Map();
  private variables: Map<string, VariablesFile> = new Map();

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
    return Logger.channel.subscribe(event, subscription, options);
  }

  async load(file: string, token: string, pageFilters?: (string | RegExp)[]): Promise<void> {
    this.file = file;
    this.branch = undefined;
    this.pageFilters = pageFilters;

    FigmaApi.setToken(token);

    const start = Date.now();

    Logger.channel.publish(FigmaticEvents.LoadStarted);
    Logger.log(`Load Figma file "${file}" started`, FigmaticSeverity.Info, start);

    if (!this.data.get(file)) {
      await this.downloadSelectedBranch();
    }

    this.parseFigmaFile();

    const end = Date.now();

    Logger.channel.publish(FigmaticEvents.LoadCompleted);
    Logger.log(`Loading completed:\n\t- Duration: ${this.getDuration(start, end)}`, FigmaticSeverity.Info, end);
  }

  get selectedBranch() {
    return this.branch || this.file;
  }

  private async downloadBranch(fileName: string): Promise<void> {
    try {
      Logger.channel.publish(FigmaticEvents.BranchDownloadStarted, { branch: fileName });
      Logger.log(`Download of branch "${fileName}" started`, FigmaticSeverity.Debug);

      const data = await FigmaApi.getFigmaFile(fileName);

      if (data) {
        this.data.set(fileName, data);

        Logger.channel.publish(FigmaticEvents.BranchDownloadCompleted, { branch: fileName });
        Logger.log(`Download of branch "${fileName}" completed`, FigmaticSeverity.Debug);
      } else {
        throw new Error("File not downloaded");
      }
    } catch (error) {
      Logger.channel.publish(FigmaticEvents.BranchDownloadFailed, error as Error);
      Logger.log(`Download of branch "${fileName}" failed`, FigmaticSeverity.Error, Date.now(), { error });
    }

    try {
      Logger.channel.publish(FigmaticEvents.TokensDownloadStarted, { branch: fileName });
      Logger.log(`Download of tokens for "${fileName}" started`, FigmaticSeverity.Debug);

      const localVariables = await FigmaApi.getLocalVariables(fileName);

      const remoteVariables = await FigmaApi.getPublishedVariables(fileName);

      this.variables.set(fileName, {
        meta: {
          variables: { ...remoteVariables?.meta?.variables, ...localVariables?.meta?.variables },
          variableCollections: {
            ...remoteVariables?.meta?.variableCollections,
            ...localVariables?.meta?.variableCollections,
          },
        },
      });

      Logger.channel.publish(FigmaticEvents.TokensDownloadCompleted, { branch: fileName });
      Logger.log(`Download of tokens for branch "${fileName}" completed`, FigmaticSeverity.Debug);
    } catch (error) {
      Logger.channel.publish(FigmaticEvents.TokensDownloadFailed, error as Error);
      Logger.log(`Download of tokens for branch "${fileName}" failed`, FigmaticSeverity.Error, Date.now(), { error });
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
          Logger.channel.publish(FigmaticEvents.ParseNodesStarted);
          Logger.log(`Parsing of nodes for "${this.selectedBranch}" started`, FigmaticSeverity.Debug, start, {
            filters: this.pageFilters,
          });

          CollectionParser.parseNodes(data.document, this.pageFilters);

          const end = Date.now();
          Logger.channel.publish(FigmaticEvents.ParseNodesCompleted);
          Logger.log(
            `Parsing of nodes for "${this.selectedBranch}" completed:\n\t- Total nodes: ${NodesCollection.size}\n\t- Pages: ${NodesCollection.getByType(NodeType.Canvas).length}\n\t- Duration: ${this.getDuration(start, end)}`,
            FigmaticSeverity.Info,
            end,
            { filters: this.pageFilters },
          );
        } catch (error) {
          Logger.channel.publish(FigmaticEvents.ParseNodesFailed, error as Error);
          Logger.log(
            `Parsing of nodes for branch "${this.selectedBranch}" failed`,
            FigmaticSeverity.Error,
            Date.now(),
            { error },
          );
        }

        try {
          Logger.channel.publish(FigmaticEvents.ParseComponentsStarted);
          Logger.log(`Parsing of components for "${this.selectedBranch}" started`, FigmaticSeverity.Debug);

          CollectionParser.parseComponents(this.selectedBranch, data.componentSets, data.components);

          Logger.channel.publish(FigmaticEvents.ParseComponentsCompleted);
          Logger.log(
            `Parsing of components for "${this.selectedBranch}" completed:\n\t- Total components: ${ComponentsCollection.size}`,
          );
        } catch (error) {
          Logger.channel.publish(FigmaticEvents.ParseComponentsFailed, error as Error);
          Logger.log(
            `Parsing of components for branch "${this.selectedBranch}" failed`,
            FigmaticSeverity.Error,
            Date.now(),
            { error },
          );
        }

        try {
          Logger.channel.publish(FigmaticEvents.ParseTokensStarted);
          Logger.log(`Parsing of tokens for "${this.selectedBranch}" started`, FigmaticSeverity.Debug);

          if (variables) {
            CollectionParser.parseTokens(variables, data.styles);
          }

          Logger.channel.publish(FigmaticEvents.ParseTokensCompleted);
          Logger.log(
            `Parsing of tokens for "${this.selectedBranch}" completed:\n\t- Total tokens: ${TokensCollection.size}\n\t- Collections: ${TokensCollection.getCollections().length}\n\t- Styles: ${TokensCollection.getStyles().length}`,
            FigmaticSeverity.Info,
          );
        } catch (error) {
          Logger.channel.publish(FigmaticEvents.ParseTokensFailed, error as Error);
          Logger.log(
            `Parsing of tokens for branch "${this.selectedBranch}" failed`,
            FigmaticSeverity.Error,
            Date.now(),
            { error },
          );
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
        Logger.channel.publish(FigmaticEvents.GraphicDownloadStarted, {
          nodes: nodeNames,
          format,
          scale,
        });
        Logger.log(`Download of graphic elements started`, FigmaticSeverity.Info, start);
        const nodeIds = nodes.map((node) => node.id).filter((id): id is string => !!id);

        const images = await FigmaApi.downloadGraphicNodes(this.selectedBranch, nodeIds, format, scale);

        const end = Date.now();
        Logger.channel.publish(FigmaticEvents.GraphicDownloadCompleted, {
          nodes: nodeNames,
          format,
          scale,
        });
        Logger.log(
          `Download of graphic elements completed:\n\t- Total downloads: ${Object.keys(images).length}\n\t- Duration: ${this.getDuration(start, end)}\n\t- Total Size: ${FigmaApi.calculateTotalSize(Object.values(images))}`,
          FigmaticSeverity.Info,
          start,
        );

        return images;
      } catch (error) {
        Logger.channel.publish(FigmaticEvents.GraphicDownloadFailed, error as Error);
        Logger.log(`Download of graphic elements failed`, FigmaticSeverity.Error, Date.now(), { error });
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
        Logger.channel.publish(FigmaticEvents.SwitchBranchStarted, { branch: this.selectedBranch });
        Logger.log(`Switch to branch "${this.selectedBranch}" started`, FigmaticSeverity.Info, start);

        await this.downloadSelectedBranch();

        this.parseFigmaFile();

        const end = Date.now();

        Logger.channel.publish(FigmaticEvents.SwitchBranchCompleted, { branch: this.selectedBranch });
        Logger.log(
          `Switch to branch "${this.selectedBranch}" completed:  ${this.getDuration(start, end)}`,
          FigmaticSeverity.Info,
          end,
        );
      }
    }
  }
}

export const Figmatic = new FigmaLoader();

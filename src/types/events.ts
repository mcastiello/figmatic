import type { EventBusConfig } from "@mcastiello/event-bus";

export enum Channels {
  Figmatic = "figmatic",
}

export enum FigmaticEvents {
  Message = "message",
  LoadStarted = "loadStarted",
  LoadCompleted = "loadCompleted",
  SwitchBranchStarted = "switchBranchStarted",
  SwitchBranchCompleted = "switchBranchCompleted",
  BranchDownloadStarted = "branchDownloadStarted",
  BranchDownloadCompleted = "branchDownloadCompleted",
  BranchDownloadFailed = "branchDownloadFailed",
  TokensDownloadStarted = "tokensDownloadStarted",
  TokensDownloadCompleted = "tokensDownloadCompleted",
  TokensDownloadFailed = "tokensDownloadFailed",
  GraphicDownloadStarted = "graphicDownloadStarted",
  GraphicDownloadCompleted = "graphicDownloadCompleted",
  GraphicDownloadFailed = "graphicDownloadFailed",
  ParseNodesStarted = "parseNodesStarted",
  ParseNodesCompleted = "parseNodesCompleted",
  ParseNodesFailed = "parseNodesFailed",
  ParseComponentsStarted = "parseComponentsStarted",
  ParseComponentsCompleted = "parseComponentsCompleted",
  ParseComponentsFailed = "parseComponentsFailed",
  ParseTokensStarted = "parseTokensStarted",
  ParseTokensCompleted = "parseTokensCompleted",
  ParseTokensFailed = "parseTokensFailed",
}

export enum FigmaticSeverity {
  Debug = "debug",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export type FigmaticBusDefinition = {
  [Channels.Figmatic]: {
    [FigmaticEvents.Message]: {
      payload: {
        message: string;
        severity: FigmaticSeverity;
        timestamp: number;
        data?: unknown;
      };
    };
    [FigmaticEvents.LoadStarted]: {
      payload: undefined;
    };
    [FigmaticEvents.LoadCompleted]: {
      payload: undefined;
    };
    [FigmaticEvents.SwitchBranchStarted]: {
      payload: {
        branch: string;
      };
    };
    [FigmaticEvents.SwitchBranchCompleted]: {
      payload: {
        branch: string;
      };
    };
    [FigmaticEvents.BranchDownloadStarted]: {
      payload: {
        branch: string;
      };
    };
    [FigmaticEvents.BranchDownloadCompleted]: {
      payload: {
        branch: string;
      };
    };
    [FigmaticEvents.BranchDownloadFailed]: {
      payload: Error;
    };
    [FigmaticEvents.TokensDownloadStarted]: {
      payload: {
        branch: string;
      };
    };
    [FigmaticEvents.TokensDownloadCompleted]: {
      payload: {
        branch: string;
      };
    };
    [FigmaticEvents.TokensDownloadFailed]: {
      payload: Error;
    };
    [FigmaticEvents.GraphicDownloadStarted]: {
      payload: {
        nodes: string[];
        format: string;
        scale: number;
      };
    };
    [FigmaticEvents.GraphicDownloadCompleted]: {
      payload: {
        nodes: string[];
        format: string;
        scale: number;
      };
    };
    [FigmaticEvents.GraphicDownloadFailed]: {
      payload: Error;
    };
    [FigmaticEvents.ParseNodesStarted]: {
      payload: undefined;
    };
    [FigmaticEvents.ParseNodesCompleted]: {
      payload: undefined;
    };
    [FigmaticEvents.ParseNodesFailed]: {
      payload: Error;
    };
    [FigmaticEvents.ParseComponentsStarted]: {
      payload: undefined;
    };
    [FigmaticEvents.ParseComponentsCompleted]: {
      payload: undefined;
    };
    [FigmaticEvents.ParseComponentsFailed]: {
      payload: Error;
    };
    [FigmaticEvents.ParseTokensStarted]: {
      payload: undefined;
    };
    [FigmaticEvents.ParseTokensCompleted]: {
      payload: undefined;
    };
    [FigmaticEvents.ParseTokensFailed]: {
      payload: Error;
    };
  };
};

export const FigmaticBusConfig: EventBusConfig<FigmaticBusDefinition> = {
  cacheEvents: true,
  publishAsynchronously: true,
};

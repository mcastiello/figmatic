export type FigmaComponentVariant = {
  name: string;
  description: string;
  nodeId: string;
};

export type FigmaComponentData = {
  name: string;
  nodeId: string;
  description: string;
  variants: FigmaComponentVariant[];
  fileName: string;
};

export type ExportedStyles = {
  name: string;
  rules: Record<string, Map<string, string>>;
};

export type Markup = {
  tag: string;
  attributes?: Record<string, string>;
  content?: string;
};

export type ParsedComponent = {
  styles: ExportedStyles;
  markup: Markup;
  code?: Record<string, string[]>;
};

export type ExportedElement = {
  name: string;
  content: string;
};

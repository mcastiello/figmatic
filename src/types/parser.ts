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
  children?: ExportedStyles[];
};

export type Markup = {
  tag: string;
  attributes?: Record<string, string>;
  children?: Markup[];
  content?: string;
};

export type ParsedComponent = {
  styles: ExportedStyles;
  markup: Markup;
  code?: string[];
};

export type ExportedComponent = {
  name: string;
  content: string;
};

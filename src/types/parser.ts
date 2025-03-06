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
};

export type ExportedStyles = Record<string, Map<string, string>>;

export type Markup = {
  tag: string;
  attributes?: Record<string, string>;
  children?: Markup[];
};

export type ParsedComponent = {
  styles: ExportedStyles;
  markup: Markup;
  code?: string[];
};

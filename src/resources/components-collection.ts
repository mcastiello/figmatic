import { FigmaComponent } from "./parse/component";
import type { ExportPlugin } from "./parse";
import { FigmaticSeverity } from "../types";
import { Logger } from "./utilities/log";

class ComponentsCollectionMap extends Map<string, FigmaComponent> {
  private plugins: Map<string, ExportPlugin> = new Map();

  registerExportPlugin(plugin: ExportPlugin, name = "default") {
    this.plugins.set(name, plugin);
  }

  getPlugin(name: string): ExportPlugin | undefined {
    return this.plugins.get(name);
  }

  async generateExport(pluginName: string = "default"): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const plugin = this.plugins.get(pluginName);

    if (plugin) {
      try {
        Logger.log(`Export tokens`, FigmaticSeverity.Debug);
        const exported = await plugin.processor.generateTokens();
        result[exported.name] = exported.content;
      } catch (error) {
        Logger.log(`Error while generating tokens`, FigmaticSeverity.Error, Date.now(), { error });
      }
      for (const component of this.values()) {
        try {
          Logger.log(`Export component "${component.definition.name}"`, FigmaticSeverity.Debug);
          const exported = await plugin.processor.generateComponent(component);
          result[exported.name] = exported.content;
        } catch (error) {
          Logger.log(
            `Error while exporting component "${component.definition.name}"`,
            FigmaticSeverity.Error,
            Date.now(),
            { error },
          );
        }
      }
    }

    return result;
  }
}

export const ComponentsCollection = new ComponentsCollectionMap();

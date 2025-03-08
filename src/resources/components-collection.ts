import { FigmaComponent } from "./parse/component";
import type { ExportPlugin } from "./parse";

class ComponentsCollectionMap extends Map<string, FigmaComponent> {
  private plugins: Map<string, ExportPlugin> = new Map();

  registerExportPlugin(plugin: ExportPlugin, name = "default") {
    this.plugins.set(name, plugin);
  }

  async generate(pluginName: string = "default"): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const plugin = this.plugins.get(pluginName);

    if (plugin) {
      for (const component of this.values()) {
        const exported = await component.generateCode(plugin);
        result[exported.name] = exported.name;
      }
    }

    return result;
  }
}

export const ComponentsCollection = new ComponentsCollectionMap();

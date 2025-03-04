import { FigmaFile, VariablesFile } from "../types";
import { NodesCollection } from "./nodes-collection";
import { ComponentsCollection } from "./components-collection";
import { TokensCollection } from "./tokens-collection";

class FigmaLoader {
  private token: string | undefined;
  private file: string | undefined;
  private branch: string | undefined;

  private data: Map<string, FigmaFile> = new Map();
  private variables: Map<string, VariablesFile> = new Map();

  async load(file: string, token: string): Promise<void> {
    this.file = file;
    this.token = token;
    this.branch = undefined;

    if (!this.data.get(file)) {
      await this.downloadSelectedBranch();
    }

    this.parseFigmaFile();
  }

  get selectedBranch() {
    return this.branch || this.file;
  }

  private async downloadSelectedBranch(): Promise<void> {
    const branch = this.branch || this.file;

    if (this.selectedBranch && this.token) {
      try {
        const file = await fetch(`https://api.figma.com/v1/files/${this.selectedBranch}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Charset": "UTF-8",
            "X-Figma-Token": this.token,
          },
        });

        const data = await file.json();

        this.data.set(this.selectedBranch, data);

        const response = await fetch(`https://api.figma.com/v1/files/${this.selectedBranch}/variables/local`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Charset": "UTF-8",
            "X-Figma-Token": this.token,
          },
        });

        const variables = await response.json();

        this.variables.set(this.selectedBranch, variables);
      } catch (error) {
        console.error(`Error while downloading branch: ${branch}`, error);
      }
    }
  }

  private parseFigmaFile() {
    if (this.selectedBranch) {
      const data = this.data.get(this.selectedBranch);
      const variables = this.variables.get(this.selectedBranch);

      if (data) {
        NodesCollection.clear();
        NodesCollection.parse(data.document);

        ComponentsCollection.clear();
        ComponentsCollection.parse(data.componentSets, data.components);

        TokensCollection.clear();
        if (variables) {
          TokensCollection.parse(variables);
        }
      }
    }
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
        await this.downloadSelectedBranch();
      }

      this.parseFigmaFile();
    }
  }
}

export const Figmatic = new FigmaLoader();

import { Document, workspace } from 'coc.nvim';
import { CancellationTokenSource } from 'vscode-languageserver-protocol';
import { BuildResult, LatexLanuageClient } from './client';

export class BuildEngine {
  constructor(private client: LatexLanuageClient) {}

  private isBuilding: boolean = false;
  private cancellationTokenSource?: CancellationTokenSource;

  public async build(doc: Document): Promise<BuildResult | undefined> {
    if (this.isBuilding) {
      return;
    }

    this.isBuilding = true;
    this.cancellationTokenSource = new CancellationTokenSource();

    try {
      return await this.client.build(doc, this.cancellationTokenSource.token);
    } catch {
      return;
    } finally {
      this.isBuilding = false;
    }
  }

  public cancel() {
    if (this.isBuilding && this.cancellationTokenSource) {
      this.isBuilding = false;
      this.cancellationTokenSource.cancel();
      this.cancellationTokenSource = undefined;
    }
  }
}

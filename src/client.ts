import { Document, LanguageClient, LanguageClientOptions, ServerOptions } from 'coc.nvim';
import { RequestType, TextDocumentIdentifier } from 'vscode-languageserver-protocol';

interface BuildTextDocumentParams {
  /**
   * The text document to build.
   */
  textDocument: TextDocumentIdentifier;
}

export interface BuildResult {
  /**
   * The status of the build process.
   */
  status: BuildStatus;
}

export enum BuildStatus {
  /**
   * The build process terminated without any errors.
   */
  Success = 0,

  /**
   * The build process terminated with errors.
   */
  Error = 1,

  /**
   * The build process failed to start or crashed.
   */
  Failure = 2
}

namespace BuildTextDocumentRequest {
  export const type = new RequestType<BuildTextDocumentParams, BuildResult, void, void>('textDocument/build');
}

export class LatexLanuageClient extends LanguageClient {
  constructor(name: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions) {
    super(name, serverOptions, clientOptions);
    this.registerProposedFeatures();
  }

  public async build(doc: Document): Promise<BuildResult> {
    const params: BuildTextDocumentParams = {
      textDocument: <TextDocumentIdentifier>{ uri: doc.uri }
    };

    return this.sendRequest(BuildTextDocumentRequest.type.method, params);
  }
}

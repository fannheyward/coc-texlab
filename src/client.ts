import { Document, LanguageClient, LanguageClientOptions, Position, RequestType, ServerOptions, TextDocumentIdentifier } from 'coc.nvim';
import { TextDocumentPositionParams } from 'vscode-languageserver-protocol';

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
  Failure = 2,

  /**
   * The build process was cancelled.
   */
  Cancelled = 3
}

export enum ForwardSearchStatus {
  /**
   * The previewer process executed the command without any errors.
   */
  Success = 0,

  /**
   * The previewer process executed the command with errors.
   */
  Error = 1,

  /**
   * The previewer process failed to start or crashed.
   */
  Failure = 2,

  /**
   * The previewer command is not configured.
   */
  Unconfigured = 3
}

export interface ForwardSearchResult {
  /**
   * The status of the previewer process.
   */
  status: ForwardSearchStatus;
}

namespace BuildTextDocumentRequest {
  export const type = new RequestType<BuildTextDocumentParams, BuildResult, void, void>('textDocument/build');
}

namespace ForwardSearchRequest {
  export const type = new RequestType<TextDocumentPositionParams, ForwardSearchResult, void, void>('textDocument/forwardSearch');
}

export class LatexLanguageClient extends LanguageClient {
  constructor(name: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions) {
    super(name, serverOptions, clientOptions);
  }

  public async build(doc: Document): Promise<BuildResult> {
    const params: BuildTextDocumentParams = {
      textDocument: <TextDocumentIdentifier>{ uri: doc.uri }
    };

    return this.sendRequest(BuildTextDocumentRequest.type.method, params);
  }

  public async forwardSearch(doc: Document, position: Position): Promise<ForwardSearchResult> {
    const params: TextDocumentPositionParams = {
      textDocument: <TextDocumentIdentifier>{ uri: doc.uri },
      position: position
    };

    return this.sendRequest(ForwardSearchRequest.type.method, params);
  }
}

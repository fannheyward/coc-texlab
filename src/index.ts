import { commands, ExtensionContext, FoldingRange, LanguageClientOptions, ServerOptions, services, window, workspace } from 'coc.nvim';
import fs from 'fs';
import os from 'os';
import path from 'path';
import which from 'which';
import { BuildStatus, ForwardSearchStatus, LatexLanguageClient } from './client';
import { Commands, Selectors } from './constants';
import { downloadServer } from './downloader';

export async function activate(context: ExtensionContext): Promise<void> {
  const serverRoot = context.storagePath;
  if (!fs.existsSync(serverRoot)) {
    fs.mkdirSync(serverRoot);
  }

  const bin = os.platform() === 'win32' ? 'texlab.exe' : 'texlab';
  let serverPath = path.join(serverRoot, bin);

  const custom = workspace.getConfiguration('texlab').get('path') as string;
  if (custom && fs.existsSync(custom)) {
    serverPath = custom;
  }

  if (!fs.existsSync(serverPath)) {
    const first = which.sync(bin, { nothrow: true });
    if (first) {
      serverPath = first;
    } else {
      const msg = `TexLab Server is not found, download from GitHub?`;
      const ret = await window.showQuickpick(['Yes', 'Cancel'], msg);
      if (ret > 0) return;
      try {
        await downloadServer(serverRoot);
      } catch (e) {
        if (fs.existsSync(serverPath)) fs.unlinkSync(serverPath);
        window.showErrorMessage(`Download TexLab Server failed`);
        console.error(e);
        return;
      }
    }
  }

  const serverOptions = getServerOptions(serverPath);
  const clientOptions: LanguageClientOptions = {
    documentSelector: Selectors,
    middleware: {
      provideFoldingRanges: async (document, context, token, next) => {
        const ranges = (await next(document, context, token)) as FoldingRange[];
        return ranges.reverse();
      }
    }
  };

  const client = new LatexLanguageClient('TexLab', serverOptions, clientOptions);

  context.subscriptions.push(services.registLanguageClient(client));
  context.subscriptions.push(
    commands.registerCommand(Commands.BUILD, async () => {
      await build(client);
    }),

    commands.registerCommand(Commands.FORWARD_SEARCH, async () => {
      await forwardSearch(client);
    }),

    commands.registerCommand(Commands.UPDATE_LANGUAGE_SERVER, async () => {
      await client.stop();
      try {
        await downloadServer(serverRoot);
      } catch (e) {
        if (fs.existsSync(serverPath)) fs.unlinkSync(serverPath);
        window.showInformationMessage(`Update TexLab Server failed, please try again`);
        console.error(e);
        return;
      }
      client.start();
    })
  );

  client.onReady().then(() => {
    window.showInformationMessage(`TexLab Server Started`);
  });
}

async function build(client: LatexLanguageClient): Promise<void> {
  const doc = await workspace.document;
  if (workspace.match(Selectors, doc.textDocument) <= 0) {
    return;
  }

  window.showInformationMessage(`Build started`);

  const result = await client.build(doc);
  if (!result) {
    return;
  }

  switch (result.status) {
    case BuildStatus.Success:
      window.showInformationMessage(`Build success`);
      break;
    case BuildStatus.Cancelled:
      window.showInformationMessage(`Build cancelled`);
      break;
    case BuildStatus.Error:
      window.showErrorMessage(`Build failed: build process terminated with errors`);
      break;
    case BuildStatus.Failure:
      window.showErrorMessage(`Build failed: build process failed to start or crashed`);
      break;
  }
}

async function forwardSearch(client: LatexLanguageClient): Promise<void> {
  const doc = await workspace.document;
  if (workspace.match(Selectors, doc.textDocument) <= 0) {
    return;
  }

  const position = await window.getCursorPosition();
  const result = await client.forwardSearch(doc, position);
  switch (result.status) {
    case ForwardSearchStatus.Success:
      window.showInformationMessage(`Preview success`);
      break;
    case ForwardSearchStatus.Error:
      window.showErrorMessage(`Preview failed: previewer process executed the command with errors`);
      break;
    case ForwardSearchStatus.Failure:
      window.showErrorMessage(`Preview failed: previewer process failed to start or crashed`);
      break;
    case ForwardSearchStatus.Unconfigured:
      window.showWarningMessage(`Preview failed: previewer command is not configured`);
      break;
  }
}

function getServerOptions(serverPath: string): ServerOptions {
  const { ELECTRON_RUN_AS_NODE, ...env } = process.env;
  return {
    run: {
      command: serverPath,
      options: {
        env
      }
    },
    debug: {
      command: serverPath,
      args: ['-vvvv'],
      options: {
        env: {
          ...env,
          RUST_BACKTRACE: '1'
        }
      }
    }
  };
}

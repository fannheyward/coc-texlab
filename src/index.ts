import fs from 'fs';
import os from 'os';

import { ServerOptions, services, ExtensionContext, workspace, LanguageClientOptions, LanguageClient } from 'coc.nvim';
import { downloadServer } from './downloader';

export async function activate(context: ExtensionContext): Promise<void> {
  const serverPath = getServerPath(context);
  if (!fs.existsSync(serverPath)) {
    workspace.showMessage(`TexLab Server is not found, downloading...`);
    try {
      await downloadServer(context);
      workspace.showMessage(`Download TexLab Server success`);
    } catch (_e) {
      workspace.showMessage(`Download TexLab Server failed`);
      return;
    }
  }

  const serverOptions = getServerOptions(serverPath);
  const clientOptions: LanguageClientOptions = {
    documentSelector: ['tex', 'latex', 'bib', 'bibtex'],
    outputChannelName: 'LaTeX'
  };

  const client = new LanguageClient('TexLab', serverOptions, clientOptions);
  context.subscriptions.push(services.registLanguageClient(client));

  client.onReady().then(() => {
    workspace.showMessage(`TexLab Server Started`);
  });
}

function getServerPath(context: ExtensionContext): string {
  const name = os.platform() === 'win32' ? 'texlab.exe' : 'texlab';
  return context.asAbsolutePath(`./server/${name}`);
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

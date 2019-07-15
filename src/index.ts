import { commands, ExtensionContext, LanguageClient, LanguageClientOptions, ServerOptions, services, workspace } from 'coc.nvim';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { downloadServer } from './downloader';

export async function activate(context: ExtensionContext): Promise<void> {
  const serverRoot = context.storagePath;
  if (!fs.existsSync(serverRoot)) {
    fs.mkdirSync(serverRoot);
  }
  const serverPath = getServerPath(serverRoot);
  if (!fs.existsSync(serverPath)) {
    workspace.showMessage(`TexLab Server is not found, downloading...`);
    try {
      await downloadServer(serverRoot);
      workspace.showMessage(`Download TexLab Server success`);
    } catch (_e) {
      workspace.showMessage(`Download TexLab Server failed`);
      return;
    }
  }

  const serverOptions = getServerOptions(serverPath);
  const clientOptions: LanguageClientOptions = {
    documentSelector: ['tex', 'latex', 'bib', 'bibtex'],
    outputChannelName: 'TexLab',
    synchronize: {
      configurationSection: 'latex'
    },
    initializationOptions: {
      settings: { latex: workspace.getConfiguration('latex') }
    }
  };

  const client = new LanguageClient('TexLab', serverOptions, clientOptions);
  context.subscriptions.push(services.registLanguageClient(client));
  context.subscriptions.push(
    commands.registerCommand('texlab.UpdateLanguageServer', async () => {
      await downloadServer(serverRoot)
        .then(() => {
          workspace.showMessage(`Update TexLab Server success`);
        })
        .catch(e => {
          workspace.showMessage(`Update TexLab Server failed, please try again`);
          console.error(e);
        });
    })
  );

  client.onReady().then(() => {
    workspace.showMessage(`TexLab Server Started`);
  });
}

function getServerPath(root: string): string {
  const name = os.platform() === 'win32' ? 'texlab.exe' : 'texlab';
  return path.join(root, name);
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

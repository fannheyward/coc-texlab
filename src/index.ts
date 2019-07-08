import fs from 'fs';
import os from 'os';
import tar from 'tar';
import unzipper from 'unzipper';
import request from 'request';

import { ServerOptions, services, ExtensionContext, workspace, LanguageClientOptions, LanguageClient } from 'coc.nvim';

export async function activate(context: ExtensionContext): Promise<void> {
  const serverPath = getServerPath(context);
  if (!fs.existsSync(serverPath)) {
    workspace.showMessage(`TexLab Server is not found, downloading...`);
    try {
      await downloadServer(context);
    } catch (_e) {
      workspace.showMessage(`Download TexLab failed`);
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

async function downloadServer(context: ExtensionContext): Promise<void> {
  const urls = {
    win32: 'https://github.com/latex-lsp/texlab/releases/download/v1.0.0/texlab-x86_64-windows.zip',
    linux: 'https://github.com/latex-lsp/texlab/releases/download/v1.0.0/texlab-x86_64-linux.tar.gz',
    darwin: 'https://github.com/latex-lsp/texlab/releases/download/v1.0.0/texlab-x86_64-macos.tar.gz'
  };

  const url = urls[os.platform()];
  const path = context.asAbsolutePath('server');
  const extract = os.platform() === 'win32' ? () => unzipper.Extract({ path }) : () => tar.x({ C: path });

  let statusItem = workspace.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading TexLab Server';
  statusItem.show();

  return new Promise((resolve, reject) => {
    request(url)
      .pipe(extract())
      .on('close', () => {
        resolve();
        statusItem.dispose();
      })
      .on('error', e => {
        reject(e);
      });
  });
}


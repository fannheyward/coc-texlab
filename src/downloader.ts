import os from 'os';
import tar from 'tar';
import unzipper from 'unzipper';
import got from 'got';

import { ExtensionContext, workspace } from 'coc.nvim';

async function getLatestVersion(): Promise<string> {
  let ver = '1.0.0';
  const apiURL = 'https://api.github.com/repos/latex-lsp/texlab/releases/latest';
  try {
    const resp = await got(apiURL);
    ver = JSON.parse(resp.body).tag_name;
  } catch (_e) {}

  return ver;
}

export async function downloadServer(context: ExtensionContext): Promise<void> {
  const ver = await getLatestVersion();

  const urls = {
    win32: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-windows.zip`,
    linux: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-linux.tar.gz`,
    darwin: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-macos.tar.gz`
  };
  const url = urls[os.platform()];
  const path = context.asAbsolutePath('server');
  const extract = os.platform() === 'win32' ? () => unzipper.Extract({ path }) : () => tar.x({ C: path });

  let statusItem = workspace.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading TexLab Server';
  statusItem.show();

  return new Promise((resolve, reject) => {
    try {
      got
        .stream(url)
        .on('downloadProgress', progress => {
          let p = (progress.percent * 100).toFixed(0);
          statusItem.text = `${p}% Downloading TexLab Server ${ver}`;
        })
        .on('end', () => {
          statusItem.hide();
          resolve();
        })
        .on('error', e => {
          reject(e);
        })
        .pipe(extract());
    } catch (e) {
      reject(e);
    }
  });
}

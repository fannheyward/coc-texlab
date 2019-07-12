import os from 'os';
import tar from 'tar';
import unzipper from 'unzipper';
import tunnel from 'tunnel';
import got from 'got';

import { workspace } from 'coc.nvim';
import { Agent } from 'http';

function getAgent(): Agent | undefined {
  let proxy = workspace.getConfiguration('http').get<string>('proxy', '');
  if (proxy) {
    let auth = proxy.includes('@') ? proxy.split('@', 2)[0] : '';
    let parts = auth.length ? proxy.slice(auth.length + 1).split(':') : proxy.split(':');
    if (parts.length > 1) {
      let agent = tunnel.httpsOverHttp({
        proxy: {
          headers: {},
          host: parts[0],
          port: parseInt(parts[1], 10),
          proxyAuth: auth
        }
      });
      return agent;
    }
  }
}

async function getLatestVersionTag(): Promise<string> {
  let tag = 'v1.0.0';
  const apiURL = 'https://api.github.com/repos/latex-lsp/texlab/releases/latest';
  try {
    const agent = getAgent();
    const resp = await got(apiURL, { agent });
    tag = JSON.parse(resp.body).tag_name;
  } catch (_e) {}

  return tag;
}

export async function downloadServer(root: string): Promise<void> {
  const ver = await getLatestVersionTag();
  const agent = getAgent();

  const urls = {
    win32: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-windows.zip`,
    linux: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-linux.tar.gz`,
    darwin: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-macos.tar.gz`
  };
  const url = urls[os.platform()];
  const extract = os.platform() === 'win32' ? () => unzipper.Extract({ path: root }) : () => tar.x({ C: root });

  let statusItem = workspace.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Downloading TexLab Server';
  statusItem.show();

  return new Promise((resolve, reject) => {
    try {
      got
        .stream(url, { agent })
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

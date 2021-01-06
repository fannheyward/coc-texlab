import { window, workspace } from 'coc.nvim';
import { Agent } from 'http';
import fetch from 'node-fetch';
import os from 'os';
import tar from 'tar';
import tunnel from 'tunnel';
import unzipper from 'unzipper';

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
  const apiURL = 'https://api.github.com/repos/latex-lsp/texlab/releases/latest';
  const agent = getAgent();

  return fetch(apiURL, { agent })
    .then(resp => resp.json())
    .then(resp => {
      return resp.tag_name;
    })
    .catch(() => {
      return 'v1.0.0';
    });
}

export async function downloadServer(root: string): Promise<void> {
  let statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Getting the latest version...';
  statusItem.show();

  const ver = await getLatestVersionTag();
  const agent = getAgent();

  const urls = {
    win32: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-windows.zip`,
    linux: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-linux.tar.gz`,
    darwin: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-macos.tar.gz`
  };
  const url = urls[os.platform()];
  if (!url) {
    statusItem.hide();
    throw new Error(`Texlab doesn't support ${os.platform()} for now.`);
  }
  const extract = os.platform() === 'win32' ? () => unzipper.Extract({ path: root }) : () => tar.x({ C: root });

  statusItem.text = `Downloading TexLab Server ${ver}`;

  return new Promise((resolve, reject) => {
    fetch(url, { agent })
      .then(resp => {
        let cur = 0;
        const len = parseInt(resp.headers.get('content-length') || '', 10);
        resp.body
          .on('data', chunk => {
            if (!isNaN(len)) {
              cur += chunk.length;
              const p = ((cur / len) * 100).toFixed(2);
              statusItem.text = `${p}% Downloading TexLab Server ${ver}`;
            }
          })
          .on('end', () => {
            statusItem.hide();
            resolve();
          })
          .pipe(extract());
      })
      .catch(e => {
        statusItem.hide();
        reject(e);
      });
  });
}

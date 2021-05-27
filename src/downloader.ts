import { window, workspace } from 'coc.nvim';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { Agent } from 'http';
import fetch from 'node-fetch';
import path from 'path';
import { pipeline } from 'stream';
import tar from 'tar';
import tunnel from 'tunnel';
import unzipper from 'unzipper';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

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

async function getLatestRelease(): Promise<{ ver: string; url: string; } | null> {
  const apiURL = 'https://api.github.com/repos/latex-lsp/texlab/releases/latest';
  const resp = await fetch(apiURL, { agent: getAgent() });
  if (!resp.ok) return null;

  const ver = (await resp.json()).tag_name || 'v3.0.0';
  const urls = {
    win32: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-windows.zip`,
    linux: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-linux.tar.gz`,
    darwin: `https://github.com/latex-lsp/texlab/releases/download/${ver}/texlab-x86_64-macos.tar.gz`
  };
  const url = urls[process.platform];
  return url ? { url, ver } : null;
}

export async function downloadServer(root: string): Promise<void> {
  let statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = 'Getting the latest version...';
  statusItem.show();

  const release = await getLatestRelease();
  if (!release) {
    statusItem.hide();
    throw new Error(`Get TexLab release failed`);
  }

  const resp = await fetch(release.url, { agent: getAgent() });
  if (!resp.ok) {
    statusItem.hide();
    throw new Error('Download failed');
  }

  let cur = 0;
  const len = Number(resp.headers.get('content-length'));
  resp.body.on('data', (chunk: Buffer) => {
    cur += chunk.length;
    const p = ((cur / len) * 100).toFixed(2);
    statusItem.text = `${p}% Downloading TexLab Server ${release.ver}`;
  });

  const bin = process.platform === 'win32' ? 'texlab.exe' : 'texlab';
  const tempRoot = path.join(root, 'download');
  if (!existsSync(tempRoot)) {
    mkdirSync(tempRoot);
  }
  const extract = process.platform === 'win32' ? () => unzipper.Extract({ path: tempRoot }) : () => tar.x({ C: tempRoot });
  await streamPipeline(resp.body, extract());
  await fs.unlink(path.join(root, bin)).catch((err) => {
    if (err.code !== 'ENOENT') throw err;
  });
  await fs.rename(path.join(tempRoot, bin), path.join(root, bin));
  statusItem.hide();
}

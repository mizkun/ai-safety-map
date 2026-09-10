import fs from 'node:fs';
import path from 'node:path';
import { readSiteContent } from '../lib/read-site-content.mjs';
import { contentPackage } from '../lib/content-package.mjs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const base = new URL(pkg.homepage).pathname.replace(/^\/+|\/+$/g, '');
const prefix = base ? '/' + base : '';
const exported = path.resolve('dist/client', base);
const target = path.resolve('dist/pages');
if (!fs.existsSync(path.join(exported, 'index.html'))) {
  throw new Error(
    'Static export missing under the configured GitHub Pages base path',
  );
}
// A project Pages site supplies the URL prefix. The artifact starts inside it.
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(exported, target, { recursive: true });
for (const file of ['404.html', 'vinext-client-entry-manifest.json']) {
  const source = path.resolve('dist/client', file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(target, file));
}
fs.writeFileSync(path.join(target, '.nojekyll'), '');
const packed = contentPackage(readSiteContent(), prefix);
fs.mkdirSync(path.join(target, 'content'), { recursive: true });
for (const [filename, details] of Object.entries(packed.files))
  fs.writeFileSync(path.join(target, 'content', filename), details);
const html = fs.readFileSync(path.join(target, 'index.html'), 'utf8');
if (Object.keys(packed.files).some((filename) => !html.includes(filename)))
  throw new Error('Initial shell and detail package versions differ');
const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((m) => m[1])
  .filter(
    (url) =>
      url.startsWith(prefix + '/') && /\.(js|css|svg)(\?|$)/.test(url),
  );
for (const url of assets) {
  const relative = url.slice(prefix.length + 1).split('?')[0];
  if (!fs.existsSync(path.join(target, relative)))
    throw new Error('Missing public asset: ' + url);
}
if (!assets.length)
  throw new Error('No static assets found in exported entry point');
// Preserve old bookmarks that include the former project path and a reading hash.
if (!base) {
  fs.mkdirSync(path.join(target, 'ai-safety-map'), { recursive: true });
  fs.writeFileSync(path.join(target, 'ai-safety-map', 'index.html'), '<!doctype html><meta charset="utf-8"><title>AI Safety Map</title><script>location.replace("/"+location.search+location.hash)</script><a href="/">AI Safety Map</a>');
}
console.log(
  'GitHub Pages artifact ready; checked ' +
    new Set(assets).size +
    ' entry-point assets.',
);

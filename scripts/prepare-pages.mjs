import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const base = new URL(pkg.homepage).pathname.replace(/^\/+|\/+$/g, '');
const exported = path.resolve('dist/client', base);
const target = path.resolve('dist/pages');
if (!fs.existsSync(path.join(exported, 'index.html'))) {
  throw new Error('Static export missing under the configured GitHub Pages base path');
}
// A project Pages site supplies the URL prefix. The artifact starts inside it.
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(exported, target, { recursive: true });
for (const file of ['404.html', 'vinext-client-entry-manifest.json']) {
  const source = path.resolve('dist/client', file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(target, file));
}
fs.writeFileSync(path.join(target, '.nojekyll'), '');
const html = fs.readFileSync(path.join(target, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map(m => m[1])
  .filter(url => url.startsWith('/' + base + '/') && /\.(js|css|svg)(\?|$)/.test(url));
for (const url of assets) {
  const relative = url.slice(base.length + 2).split('?')[0];
  if (!fs.existsSync(path.join(target, relative))) throw new Error('Missing public asset: ' + url);
}
if (!assets.length) throw new Error('No static assets found in exported entry point');
console.log('GitHub Pages artifact ready; checked ' + new Set(assets).size + ' entry-point assets.');

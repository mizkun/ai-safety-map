import fs from 'node:fs';
import { readSiteContent } from '../lib/read-site-content.mjs';
import { contentPackage } from '../lib/content-package.mjs';
const packed = contentPackage(readSiteContent());
const folder = 'public/content';
fs.mkdirSync(folder, { recursive: true });
for (const name of fs.readdirSync(folder))
  if (/^details-(?:(?:ja|en)-)?[a-f0-9]{20}\.json$/.test(name))
    fs.unlinkSync(folder + '/' + name);
for (const [filename, details] of Object.entries(packed.files))
  fs.writeFileSync(folder + '/' + filename, details);
console.log('Versioned detail content prepared.');

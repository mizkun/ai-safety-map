import fs from 'node:fs';
import type { Content, SiteContent } from './content-types';
import { readCanonicalContent } from './content-reader.mjs';
import { readSiteContent } from './read-site-content.mjs';
import { contentPackage } from './content-package.mjs';
export { parseExplanation } from './content-reader.mjs';
export function loadContent(): Content { return readCanonicalContent() as Content; }
export function loadSiteContent(): SiteContent { return readSiteContent() as SiteContent; }
export function loadSiteShell(): SiteContent {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const base = process.env.NODE_ENV === 'production'
    ? new URL(pkg.homepage).pathname.replace(/\/$/, '')
    : '/ai-safety-map';
  return contentPackage(readSiteContent(), base).shell as SiteContent;
}

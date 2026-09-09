import fs from 'node:fs';
import { createHash } from 'node:crypto';
import type { Content, SiteContent, LocaleOption } from './content-types';
import { readCanonicalContent } from './content-reader.mjs';
import { applyTranslation, translationFields } from './translation-fields.mjs';
export { parseExplanation } from './content-reader.mjs';
export function loadContent(): Content {
  return readCanonicalContent() as Content;
}
export function loadSiteContent(): SiteContent {
  const ja = loadContent();
  const sourceHash = createHash('sha256')
    .update(JSON.stringify(translationFields(ja)))
    .digest('hex');
  const locales: LocaleOption[] = JSON.parse(
    fs.readFileSync('content/locales.json', 'utf8'),
  );
  const content: SiteContent['content'] = { ja };
  for (const locale of locales) {
    if (locale.code === 'ja') continue;
    const file = 'content/translations/' + locale.code + '.json';
    if (!locale.enabled || !fs.existsSync(file)) {
      locale.enabled = false;
      continue;
    }
    const translation = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (translation.sourceHash !== sourceHash) {
      locale.enabled = false;
      continue;
    }
    content[locale.code] = applyTranslation(ja, translation) as Content;
  }
  return { locales, content };
}

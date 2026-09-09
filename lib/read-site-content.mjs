import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readCanonicalContent } from './content-reader.mjs';
import { applyTranslation, translationFields } from './translation-fields.mjs';
export function readSiteContent() {
  const ja = readCanonicalContent();
  const sourceHash = createHash('sha256').update(JSON.stringify(translationFields(ja))).digest('hex');
  const locales = JSON.parse(fs.readFileSync('content/locales.json', 'utf8'));
  const content = { ja };
  for (const locale of locales) {
    if (locale.code === 'ja') continue;
    const file = 'content/translations/' + locale.code + '.json';
    if (!locale.enabled || !fs.existsSync(file)) { locale.enabled = false; continue; }
    const translation = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (translation.sourceHash !== sourceHash) { locale.enabled = false; continue; }
    content[locale.code] = applyTranslation(ja, translation);
  }
  return { locales, content };
}

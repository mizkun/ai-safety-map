import fs from 'node:fs';
import { translationReviewHash } from '../lib/translation-review.mjs';
import { isCalendarDate, currentReviewDay } from '../lib/freshness.mjs';
import { createHash } from 'node:crypto';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  translationFields,
  applyTranslation,
} from '../lib/translation-fields.mjs';
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const locales = read('content/locales.json');
if (
  locales.length !== 2 ||
  new Set(locales.map((l) => l.code)).size !== 2 ||
  !locales.find((l) => l.code === 'ja')?.enabled
)
  throw new Error(
    'Expected Japanese and English locales, with Japanese enabled',
  );
const base = read('content/ui/ja.json');
const canonical = readCanonicalContent();
const digest = createHash('sha256')
  .update(JSON.stringify(translationFields(canonical)))
  .digest('hex');
for (const locale of locales) {
  if (
    !['ja', 'en'].includes(locale.code) ||
    typeof locale.enabled !== 'boolean'
  )
    throw new Error('Invalid locale');
  const messages = read('content/ui/' + locale.code + '.json');
  if (
    Object.keys(base).length !== Object.keys(messages).length ||
    Object.keys(base).some(
      (key) => typeof messages[key] !== 'string' || !messages[key].trim(),
    )
  )
    throw new Error('UI translations incomplete: ' + locale.code);
  for (const key of Object.keys(base)) {
    const tokens = (s) =>
      [...s.matchAll(/\{\w+\}/g)]
        .map((m) => m[0])
        .sort((a, b) => a.localeCompare(b))
        .join(',');
    if (tokens(base[key]) !== tokens(messages[key]))
      throw new Error('Message placeholders differ: ' + key);
  }
  if (locale.code === 'ja' || !locale.enabled) continue;
  const file = 'content/translations/' + locale.code + '.json';
  if (!fs.existsSync(file))
    throw new Error('An enabled translation file is missing: ' + file);
  const translation = read(file);
  if (translation.locale !== locale.code)
    throw new Error('Translation locale mismatch');
  if (translation.sourceHash !== digest)
    throw new Error(
      'Enabled translation is stale; review and update it before publishing: ' +
        locale.code,
    );
  else applyTranslation(canonical, translation);
  const review = translation.review;
  if (
    !review?.reviewer?.trim() ||
    !isCalendarDate(review.date) ||
    review.date > currentReviewDay() ||
    review.hash !== translationReviewHash(translation, base, messages)
  )
    throw new Error(
      'Enabled translation needs a review matching its prose and UI: ' +
        locale.code,
    );
}
console.log('Locale messages and publication gates valid.');

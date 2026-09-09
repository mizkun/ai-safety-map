import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import { translationFields } from '../lib/translation-fields.mjs';
const locale = process.argv[2];
if (locale !== 'en') throw new Error('Usage: npm run i18n:export -- en');
const file = 'content/translations/' + locale + '.json';
if (fs.existsSync(file))
  throw new Error(
    'Translation already exists. Preserve and update the existing work manually.',
  );
const fields = translationFields(readCanonicalContent());
fs.mkdirSync('content/translations', { recursive: true });
fs.writeFileSync(
  file,
  JSON.stringify(
    {
      locale,
      sourceHash: createHash('sha256')
        .update(JSON.stringify(fields))
        .digest('hex'),
      reference: fields,
      strings: Object.fromEntries(Object.keys(fields).map((key) => [key, ''])),
    },
    null,
    2,
  ) + '\n',
);
console.log(
  'Created ' +
    file +
    ' with ' +
    Object.keys(fields).length +
    ' prose keys. The locale stays disabled until reviewed and enabled.',
);

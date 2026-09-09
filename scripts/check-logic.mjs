import fs from 'node:fs';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import { logicIssues } from '../lib/logic-validation.mjs';
import { reviewUnits, reviewIssues } from '../lib/review-fingerprints.mjs';
const data = readCanonicalContent();
const folder = 'docs/reviews';
const records = fs.existsSync(folder) ? fs.readdirSync(folder).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(folder + '/' + f, 'utf8'))) : [];
const errors = [...logicIssues(data), ...reviewIssues(reviewUnits(data, JSON.parse(fs.readFileSync('content/ui/ja.json', 'utf8'))), records, data.sources)];
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Logic structure and version-matched review coverage valid. Scientific correctness still requires content review.');

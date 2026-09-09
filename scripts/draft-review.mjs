import fs from 'node:fs';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import { reviewUnits, reviewFields, reviewIssues } from '../lib/review-fingerprints.mjs';
const data = readCanonicalContent(), units = reviewUnits(data, JSON.parse(fs.readFileSync('content/ui/ja.json', 'utf8')));
const folder = 'docs/reviews';
const records = fs.existsSync(folder) ? fs.readdirSync(folder).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(folder + '/' + f, 'utf8'))) : [];
const stale = reviewIssues(units, records, data.sources).map((issue) => issue.slice(0, issue.indexOf(': ')));
if (!stale.length) { console.log('No changed review units.'); process.exit(0); }
const id = process.argv.find((a) => a.startsWith('--id='))?.slice(5);
if (!id || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id)) throw new Error('Use --id=YYYY-MM-DD-short-subject (a new file; existing reviews are preserved).');
const record = { id, date: id.slice(0, 10), reviewer: '', decision: 'pending', assessments: { draft: { ...Object.fromEntries(reviewFields.map((f) => [f, ''])), primary: [{ source: '', locator: '', support: '' }] } }, entries: Object.fromEntries(stale.map((key) => [key, { hash: units[key], assessment: 'draft' }])) };
fs.mkdirSync(folder, { recursive: true });
fs.writeFileSync(folder + '/' + id + '.json', JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
console.log('Draft created for ' + stale.length + ' changed/dependent units. Fill the reasoning and primary-source fields, then set decision to reviewed.');

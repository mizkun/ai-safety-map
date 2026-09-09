import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  applyTranslation,
  translationFields,
} from '../lib/translation-fields.mjs';
import { translationReviewHash } from '../lib/translation-review.mjs';
const translation = JSON.parse(fs.readFileSync('content/translations/en.json'));
const data = readCanonicalContent(),
  en = applyTranslation(data, translation);
const jaUi = JSON.parse(fs.readFileSync('content/ui/ja.json')),
  enUi = JSON.parse(fs.readFileSync('content/ui/en.json'));
test('English is complete and preserves shared scientific identifiers and evidence structure', () => {
  assert.deepEqual(translation.reference, translationFields(data));
  for (const text of Object.values(translation.strings))
    assert.ok(!/[ぁ-んァ-ヶ一-龥]/.test(text));
  for (const [id, n] of Object.entries(data.nodes)) {
    assert.equal(en.nodes[id].status, n.status);
    assert.deepEqual(en.nodes[id].review.checkedAt, n.review.checkedAt);
    assert.deepEqual(en.nodes[id].research, n.research);
    assert.deepEqual(en.nodes[id].sources, n.sources);
  }
  for (const [id, e] of Object.entries(data.edges))
    for (const key of ['from', 'to', 'requires', 'relation'])
      assert.deepEqual(en.edges[id][key], e[key]);
  const cyber = en.research['astra-cyber'];
  for (const fact of ['100%', '9 of 10', '59%', '6 of 10'])
    assert.ok(cyber.result.includes(fact));
  assert.match(cyber.method, /41.*5 attempts/);
  assert.match(cyber.limitation, /not a real-attack success rate/);
  assert.match(en.nodes.W5.body['他の条件との関係'], /not required/);
  assert.match(en.nodes.P3.body['他の条件との関係'], /no direct arrow/);
});
test('translation review becomes stale after changing either language or a UI label', () => {
  const hash = translationReviewHash(translation, jaUi, enUi);
  const changed = structuredClone(translation);
  changed.strings['nodes.X.title'] += ' Changed';
  assert.notEqual(translationReviewHash(changed, jaUi, enUi), hash);
  assert.notEqual(
    translationReviewHash(
      { ...translation, sourceHash: 'changed' },
      jaUi,
      enUi,
    ),
    hash,
  );
  assert.notEqual(
    translationReviewHash(translation, jaUi, { ...enUi, read: 'Changed' }),
    hash,
  );
  assert.equal(translation.review.hash, hash);
});

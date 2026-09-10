import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  applyTranslation,
  translationFields,
} from '../lib/translation-fields.mjs';
import { translationReviewHash } from '../lib/translation-review.mjs';
import { glossaryIndex, glossarySegments } from '../lib/glossary-text.mjs';
const translation = JSON.parse(fs.readFileSync('content/translations/en.json'));
const data = readCanonicalContent(),
  en = applyTranslation(data, translation);
const jaUi = JSON.parse(fs.readFileSync('content/ui/ja.json')),
  enUi = JSON.parse(fs.readFileSync('content/ui/en.json'));
test('glossary links preserve English words and still recognize Japanese-adjacent abbreviations', () => {
  const index = glossaryIndex({
    rsi: { aliases: ['RSI', 'recursive self-improvement'] },
    ai: { aliases: ['AI'] },
    asi: { aliases: ['ASI'] },
  });
  for (const text of [
    'oversight and training form a basis',
    'RSI, ASI and AI-assisted research',
    'AIが進歩し、RSIやASIへ分岐する。',
  ]) {
    const parts = glossarySegments(text, index);
    assert.equal(parts.map((p) => p.text).join(''), text);
    assert.deepEqual(
      parts.filter((p) => p.id).map((p) => p.id),
      text.startsWith('oversight')
        ? []
        : text.startsWith('RSI')
          ? ['rsi', 'asi', 'ai']
          : ['ai', 'rsi', 'asi'],
    );
  }
  assert.deepEqual(glossarySegments('recursive self-improvement', index), [
    { text: 'recursive self-improvement', id: 'rsi' },
  ]);
  assert.deepEqual(glossarySegments('plain text', glossaryIndex({})), [
    { text: 'plain text' },
  ]);
});
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
  assert.match(cyber.limitation, /not a real(?:-world)?[ -]attack success rate/);
  assert.match(en.nodes.W5.body['他の条件との関係'], /not required/);
  // Income generation alone must not lead directly to money becoming unnecessary.
  assert.equal(Object.values(en.edges).some(e => e.from === 'I1' && e.to === 'P3'), false);
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

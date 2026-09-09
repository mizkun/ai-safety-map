import test from 'node:test';
import assert from 'node:assert/strict';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import { legacyEdgeLinks } from '../lib/legacy-links.mjs';
import { logicIssues } from '../lib/logic-validation.mjs';
import { reviewUnits, reviewIssues } from '../lib/review-fingerprints.mjs';
const original = readCanonicalContent();
function change(fn) { const data = structuredClone(original); fn(data); return logicIssues(data).join('\n'); }
test('the reviewed causal structure has no mechanical contradictions', () => assert.deepEqual(logicIssues(original), []));
test('AND inputs cannot silently become OR in a drill-down', () => {
  assert.match(change((d) => { d.graphs['income-conditions'].mode = 'any'; }), /contradicts/);
  assert.match(change((d) => { d.edges['F1-F3'].requires.pop(); }), /omits|reviewed AND/);
});
test('parallel alignment and capability cannot become a serial prerequisite', () => {
  assert.match(change((d) => { d.edges['C3-L'].requires = ['C2', 'C3']; }), /reviewed AND/);
  assert.match(change((d) => { d.edges['C2a-C2b'] = { ...d.edges['R1-R2'], id: 'C2a-C2b', from: 'C2a', to: 'C2b' }; }), /parallel siblings/);
});
test('self-improvement feedback must be marked explicitly', () => assert.match(change((d) => { d.edges['R3-R2'].relation = 'conditional'; }), /unmarked causal cycle/));
test('financial crisis is not money obsolescence or extinction', () => {
  for (const to of ['P3', 'X']) assert.match(change((d) => { d.edges.shortcut = { ...d.edges['R1-R2'], id: 'shortcut', from: 'F3', to }; }), /financial crisis/);
});
test('work-optional society does not require universal technical automation', () => assert.match(change((d) => { d.edges['W3-W5'].requires = ['W4', 'W6']; }), /reviewed AND/));
test('changes to study results invalidate dependent step and arrow reviews', () => {
  const before = reviewUnits(original), changed = structuredClone(original);
  changed.research['astra-cyber'].result += ' A changed result.';
  const after = reviewUnits(changed);
  for (const key of ['research:astra-cyber', 'node:M2c1', 'edge:M3-H', 'story:misuse']) assert.notEqual(before[key], after[key]);
  assert.equal(before['node:D3'], after['node:D3']);
  assert.match(reviewIssues(after, [{ decision: 'reviewed', reviewer: 'test', date: '2026-09-10', entries: { 'node:M2c1': { hash: before['node:M2c1'], assessment: 'missing' } } }], original.sources).join('\n'), /node:M2c1: missing or stale/);
});
test('removing an item requires a fresh inventory review', () => {
  const before = reviewUnits(original), changed = structuredClone(original);
  delete changed.news['unused']; changed.news.pop();
  assert.notEqual(before['inventory:current'], reviewUnits(changed)['inventory:current']);
});
test('a generated draft cannot count as an approved review', () => assert.match(reviewIssues({ 'node:C1': 'abc' }, [{ id: 'draft', decision: 'pending', entries: { 'node:C1': { hash: 'abc' } } }], original.sources).join('\n'), /pending[\s\S]*missing or stale/));

test('old shared arrow URLs resolve to current conditions', () => {
  for (const id of Object.values(legacyEdgeLinks)) assert.ok(original.edges[id]);
});

test('observed claims need a direct study and resolvable primary evidence', () => {
  assert.match(change((d) => { d.nodes.W5.status = 'observed'; d.nodes.W5.research = ['distribution']; }), /no direct observational/);
  assert.match(change((d) => { delete d.sources['astra-card']; }), /unknown primary evidence/);
});

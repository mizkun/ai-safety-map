import test from 'node:test';
import assert from 'node:assert/strict';
import { contentPackage } from '../lib/content-package.mjs';
import { readSiteContent } from '../lib/read-site-content.mjs';
const full = readSiteContent();
test('initial map excludes detailed prose and uses a versioned package', () => {
  const packed = contentPackage(full), shell = packed.shell.content.ja;
  assert.deepEqual(shell.nodes.M2c1.body, {});
  assert.deepEqual(shell.research, {});
  assert.ok(!JSON.stringify(packed.shell).includes(full.content.ja.research['astra-cyber'].result));
  assert.deepEqual(JSON.parse(packed.details), full.content);
  assert.ok(JSON.stringify(packed.shell).length < packed.details.length * 0.5);
  for (const [id, edge] of Object.entries(shell.edges)) assert.deepEqual(edge.requires, full.content.ja.edges[id].requires);
});
test('a content change gets a different immutable URL', () => {
  const changed = structuredClone(full);
  changed.content.ja.nodes.M2c1.body['現在の状況'] += ' 新しい観測。';
  assert.notEqual(contentPackage(full).filename, contentPackage(changed).filename);
});

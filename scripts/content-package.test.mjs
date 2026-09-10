import test from 'node:test';
import assert from 'node:assert/strict';
import { contentPackage } from '../lib/content-package.mjs';
import { readSiteContent } from '../lib/read-site-content.mjs';
const full = readSiteContent();
test('initial map excludes detailed prose and preserves causal relationships', () => {
  const packed = contentPackage(full),
    shell = packed.shell.content.ja;
  assert.deepEqual(shell.nodes.M2c1.body, {});
  assert.deepEqual(shell.research, {});
  for (const [id, story] of Object.entries(shell.stories)) {
    assert.deepEqual(
      story.chapters.map((c) => c.nodes),
      full.content.ja.stories[id].chapters.map((c) => c.nodes),
    );
    assert.ok(story.chapters.every((c) => !c.text && !c.title));
  }
  assert.ok(
    !JSON.stringify(packed.shell).includes(
      full.content.ja.research['astra-cyber'].result,
    ),
  );
  assert.ok(
    JSON.stringify(packed.shell).length <
      Object.values(packed.files).join('').length * 0.5,
  );
  for (const [id, node] of Object.entries(shell.nodes))
    assert.deepEqual(node.research, full.content.ja.nodes[id].research);
  for (const [id, edge] of Object.entries(shell.edges)) {
    assert.deepEqual(edge.requires, full.content.ja.edges[id].requires);
    assert.deepEqual(edge.research, full.content.ja.edges[id].research);
  }
});
test('only the requested language is transferred with its details', () => {
  const packed = contentPackage(full);
  assert.ok(full.content.en, 'the complete English edition must be published');
  for (const locale of ['ja', 'en']) {
    const filename = packed.shell.detailsUrls[locale].split('/').at(-1);
    assert.deepEqual(JSON.parse(packed.files[filename]), {
      [locale]: full.content[locale],
    });
  }
});
test('a content change versions only the affected language package', () => {
  const changed = structuredClone(full);
  changed.content.ja.nodes.M2c1.body['現在の状況'] += ' 新しい観測。';
  assert.notEqual(
    contentPackage(full).shell.detailsUrls.ja,
    contentPackage(changed).shell.detailsUrls.ja,
  );
  assert.equal(
    contentPackage(full).shell.detailsUrls.en,
    contentPackage(changed).shell.detailsUrls.en,
  );
});

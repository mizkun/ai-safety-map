import assert from 'node:assert/strict';
import test from 'node:test';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  applyTranslation,
  translationFields,
} from '../lib/translation-fields.mjs';
import { treeLayout, wireGeometry } from '../lib/tree-layout.ts';
const content = readCanonicalContent();

test('translations change prose while preserving the causal graph and references', () => {
  const fields = translationFields(content);
  assert.ok(fields['nodes.C1.body.ひとことで']);
  assert.ok(fields['edges.C1-C2.explanation']);
  assert.equal(fields['nodes.C1.id'], undefined);
  assert.equal(fields['nodes.C1.explanation'], undefined);
  assert.equal(fields['edges.C1-C2.from'], undefined);
  assert.equal(fields['sources.report.url'], undefined);
  const strings = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, 'Translated: ' + value]),
  );
  const translated = applyTranslation(content, { strings });
  assert.match(translated.nodes.C1.title, /^Translated:/);
  assert.deepEqual(
    translated.graphs.control.nodes,
    content.graphs.control.nodes,
  );
  assert.deepEqual(
    translated.graphs.control.edges,
    content.graphs.control.edges,
  );
  assert.deepEqual(translated.nodes.C1.sources, content.nodes.C1.sources);
  assert.deepEqual(
    translated.nodes.C1.review.checkedAt,
    content.nodes.C1.review.checkedAt,
  );
  assert.equal(translated.sources.report.url, content.sources.report.url);
  assert.throws(() =>
    applyTranslation(content, {
      strings: { ...strings, 'nodes.C1.id': 'changed' },
    }),
  );
  assert.throws(() =>
    applyTranslation(content, {
      strings: { ...strings, 'nodes.C1.title': '' },
    }),
  );
});

test('every fixed tree has valid connections, bounded tiles, and no overlapping cards', () => {
  for (const view of ['overview', ...Object.keys(content.graphs)]) {
    const layout = treeLayout(content, view);
    for (const tile of layout.tiles) {
      assert.ok(
        tile.x >= 0 &&
          tile.y >= 0 &&
          tile.x + tile.width <= layout.width &&
          tile.y + tile.height <= layout.height,
        view + ': ' + tile.key + ' exceeds canvas',
      );
      if (tile.node) assert.ok(content.nodes[tile.node]);
      if (tile.graph) assert.ok(content.graphs[tile.graph]);
    }
    for (let i = 0; i < layout.tiles.length; i++)
      for (let j = i + 1; j < layout.tiles.length; j++) {
        const a = layout.tiles[i],
          b = layout.tiles[j];
        const overlap =
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
        assert.equal(
          overlap,
          false,
          view + ': overlapping tiles ' + a.key + '/' + b.key,
        );
      }
    for (const wire of layout.wires) {
      if (wire.edge) assert.ok(content.edges[wire.edge]);
      const geometry = wireGeometry(wire, layout);
      assert.ok(Number.isFinite(geometry.x) && Number.isFinite(geometry.y));
      assert.ok(!geometry.path.includes('NaN'));
    }
  }
});

test('the overview keeps dependence and prevention distinct from extinction', () => {
  const layout = treeLayout(content, 'overview');
  assert.ok(
    layout.wires.some((w) => w.from === 'dependence' && w.to === 'agency'),
  );
  assert.ok(
    !layout.wires.some(
      (w) => w.from === 'dependence' && w.to === 'catastrophe',
    ),
  );
  assert.ok(
    !layout.wires.some((w) => w.from === 'agency' && w.to === 'extinction'),
  );
  assert.ok(
    layout.wires.some(
      (w) =>
        w.from === 'catastrophe' && w.to === 'survival' && w.edge === 'H-T',
    ),
  );
});

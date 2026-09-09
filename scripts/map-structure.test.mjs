import assert from 'node:assert/strict';
import test from 'node:test';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  applyTranslation,
  translationFields,
} from '../lib/translation-fields.mjs';
import { treeLayout, wireGeometry, joinGeometry } from '../lib/tree-layout.ts';
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
  for (const view of ['overview', ...Object.keys(content.graphs)]) for (const expanded of [false, true]) {
    const layout = treeLayout(content, view, expanded);
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
    for (const join of layout.joins || []) {
      const ids = join.inputs.map((key) => layout.regions?.find((r) => r.key === key)?.node || layout.tiles.find((t) => t.key === key)?.node);
      assert.deepEqual(new Set(ids), new Set(content.edges[join.edge].requires));
      assert.equal(join.output, content.edges[join.edge].to);
      assert.ok(!joinGeometry(join, layout).includes('NaN'));
    }
  }
});

test('all-elements overview contains every canonical node exactly once and none is isolated', () => {
  const layout = treeLayout(content, 'overview', true);
  const nodes = layout.tiles.flatMap((tile) => tile.node ? [tile.node] : []);
  assert.equal(nodes.length, new Set(nodes).size);
  assert.deepEqual(new Set(nodes), new Set(Object.keys(content.nodes)));
  const connected = new Set();
  const canonical = (key) => layout.tiles.find((t) => t.key === key)?.node || layout.regions?.find((r) => r.key === key)?.node;
  for (const wire of layout.wires) for (const key of [wire.from, wire.to]) connected.add(canonical(key));
  for (const join of layout.joins) for (const key of [...join.inputs, join.output]) connected.add(canonical(key));
  for (const region of layout.regions) {
    connected.add(region.node);
    for (const child of content.graphs[content.nodes[region.node].subgraph].nodes) connected.add(child);
  }
  for (const id of nodes) assert.ok(connected.has(id), 'Isolated node: ' + id);
});

test('alignment, execution, and control are joint inputs rather than a causal chain', () => {
  const layout = treeLayout(content, 'control', true);
  assert.equal(content.graphs.control.mode, 'network');
  assert.deepEqual(content.edges['C3-L'].requires, ['C1', 'C2', 'C3']);
  const rows = ['C1', 'C2', 'C3'].map((id) => layout.tiles.find((t) => t.node === id).y);
  assert.equal(new Set(rows).size, 1);
  assert.ok(!layout.wires.some((w) => ['C1-C2', 'C2-C3'].includes(w.edge)));
  assert.equal(layout.regions.find((r) => r.node === 'C1').mode, 'any');
  assert.equal(layout.regions.find((r) => r.node === 'C2').mode, 'all');
  assert.ok(content.nodes.C1.topics.includes('alignment'));
  assert.ok(content.nodes.C3.topics.includes('control'));
});

test('research has enabling and mitigating links, and social outcomes do not imply extinction', () => {
  const layout = treeLayout(content, 'overview', true);
  for (const id of ['R2-C2', 'R2-W1', 'R4-C1', 'R2-ASI', 'W4-P1']) assert.ok(layout.wires.some((w) => w.edge === id));
  assert.equal(content.edges['R4-C1'].relation, 'mitigation');
  assert.deepEqual(content.edges['W4-W5'].requires, ['W4', 'W6']);
  for (const view of ['work', 'money']) {
    assert.ok(!content.graphs[view].nodes.includes('X'));
    for (const id of content.graphs[view].edges) assert.ok(!['X', 'H', 'T'].includes(content.edges[id].to));
  }
  assert.ok(!content.edges['I1-I2'].requires?.includes('F3'));
  assert.ok(!layout.wires.some((w) => w.from === 'F3' && w.to === 'P3'));
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

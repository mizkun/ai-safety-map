import assert from 'node:assert/strict';
import test from 'node:test';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  applyTranslation,
  translationFields,
} from '../lib/translation-fields.mjs';
import { treeLayout, wireGeometry, joinGeometry, forkGeometry } from '../lib/tree-layout.ts';
import { clampZoom, zoomAnchor, scrollAtAnchor } from '../lib/map-gestures.mjs';
import { mapWindow, intersectsWindow } from '../lib/map-window.mjs';
const content = readCanonicalContent();

test('pinch zoom preserves the point under the fingers, including centered maps', () => {
  for (const initial of [0.02, 0.8]) {
    const point = { x: 195, y: 300 }, scroll = { left: 120, top: 250 };
    const anchor = zoomAnchor(point, scroll, initial, 390, 5000);
    const next = clampZoom(initial * 2);
    const moved = scrollAtAnchor(anchor, point, next, 390, 5000);
    const result = zoomAnchor(point, moved, next, 390, 5000);
    assert.ok(Math.abs(result.x - anchor.x) < 1e-6);
    assert.ok(Math.abs(result.y - anchor.y) < 1e-6);
  }
  assert.equal(clampZoom(0), 0.02);
  assert.equal(clampZoom(9), 1.6);
});

test('mobile rendering omits distant cards while fit-to-view includes every card', () => {
  const layout = treeLayout(content, 'overview', true);
  const present = layout.tiles.find((t) => t.node === 'NOW');
  const viewport = { left: 0, top: Math.max(0, (present.y + present.height / 2) * 0.94 - 300), width: 390, height: 600 };
  const window = mapWindow(viewport, 0.94, layout.width, layout.height);
  const visible = layout.tiles.filter((t) => intersectsWindow(t, window));
  assert.ok(visible.includes(present));
  assert.ok(visible.length < layout.tiles.length / 3);
  const fit = Math.min((viewport.width - 40) / layout.width, (viewport.height - 40) / layout.height);
  const fullWindow = mapWindow({ ...viewport, top: 0 }, fit, layout.width, layout.height);
  assert.ok(layout.tiles.every((t) => intersectsWindow(t, fullWindow)));
});

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
      const ids = join.inputs.map((key) => layout.regions?.find((r) => r.key === key)?.node || layout.areas?.find((r) => r.key === key)?.node || layout.tiles.find((t) => t.key === key)?.node);
      assert.deepEqual(new Set(ids), new Set(content.edges[join.edge].requires));
      assert.equal(join.output, content.edges[join.edge].to);
      assert.ok(!joinGeometry(join, layout).includes('NaN'));
    }
    for (const fork of layout.forks || []) {
      const g = forkGeometry(fork, layout);
      assert.ok(!g.trunk.includes('NaN'));
      for (const p of g.junctions) assert.ok(p.x >= 0 && p.x <= layout.width && p.y >= 0 && p.y <= layout.height);
      assert.equal(new Set(fork.targets).size, fork.targets.length);
    }
  }
});

test('all-elements overview contains every canonical node exactly once and none is isolated', () => {
  const layout = treeLayout(content, 'overview', true);
  const nodes = layout.tiles.flatMap((tile) => tile.node ? [tile.node] : []);
  assert.equal(nodes.length, new Set(nodes).size);
  assert.deepEqual(new Set(nodes), new Set(Object.keys(content.nodes)));
  const connected = new Set();
  const canonical = (key) => layout.tiles.find((t) => t.key === key)?.node || layout.regions?.find((r) => r.key === key)?.node || layout.areas?.find((r) => r.key === key)?.node;
  for (const wire of layout.wires) for (const key of [wire.from, wire.to]) connected.add(canonical(key));
  for (const fork of layout.forks) for (const key of [fork.from, ...fork.targets]) connected.add(canonical(key));
  for (const join of layout.joins) for (const key of [...join.inputs, join.output]) connected.add(canonical(key));
  for (const region of layout.regions) {
    connected.add(region.node);
    for (const child of region.members || content.graphs[content.nodes[region.node].subgraph].nodes) connected.add(child);
  }
  for (const id of nodes) assert.ok(connected.has(id), 'Isolated node: ' + id);
});

test('independent routed edges do not share segments or pass through unrelated cards', () => {
  const segments = (points) => (points || []).slice(1).map((p, i) => [points[i], p]);
  function sharedLength([a, b], [c, d]) {
    if (a.x === b.x && c.x === d.x && a.x === c.x)
      return Math.max(0, Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) - Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y)));
    if (a.y === b.y && c.y === d.y && a.y === c.y)
      return Math.max(0, Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) - Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x)));
    return 0;
  }
  for (const view of ['overview', ...Object.keys(content.graphs)]) for (const expanded of [false, true]) {
    const layout = treeLayout(content, view, expanded);
    const edges = layout.wires.filter((w) => w.edge).map((w) => ({ w, segments: segments(wireGeometry(w, layout).points) }));
    for (const [i, a] of edges.entries()) {
      for (const b of edges.slice(i + 1)) for (const sa of a.segments) for (const sb of b.segments)
        assert.ok(sharedLength(sa, sb) < 1, view + ': overlapping routes ' + a.w.edge + '/' + b.w.edge);
      for (const tile of layout.tiles) {
        if ([a.w.from, a.w.to].includes(tile.key)) continue;
        for (const [p, q] of a.segments) {
          const intersects = p.x === q.x
            ? p.x > tile.x + 1 && p.x < tile.x + tile.width - 1 && Math.max(p.y, q.y) > tile.y + 1 && Math.min(p.y, q.y) < tile.y + tile.height - 1
            : p.y > tile.y + 1 && p.y < tile.y + tile.height - 1 && Math.max(p.x, q.x) > tile.x + 1 && Math.min(p.x, q.x) < tile.x + tile.width - 1;
          assert.ok(!intersects, view + ': route ' + a.w.edge + ' crosses card ' + tile.key);
        }
      }
    }
  }
});

test('the present is the single left-hand origin and causal progression runs to the right', () => {
  for (const expanded of [false, true]) {
    const layout = treeLayout(content, 'overview', expanded);
    const present = layout.tiles.find((t) => t.node === 'NOW');
    assert.equal(layout.flow, 'horizontal');
    assert.equal(layout.tiles.filter((t) => t.node === 'NOW').length, 1);
    assert.ok(layout.tiles.filter((t) => t !== present).every((t) => t.x > present.x + present.width));
    const terminal = layout.tiles.find((t) => t.node === 'X');
    const harm = layout.tiles.find((t) => t.node === 'H');
    assert.ok(terminal.x > harm.x);
    assert.ok(layout.forks.some((f) => f.from === present.key));
  }
});

test('summary research is a present-connected peer pathway, not a distant outcome', () => {
  const layout = treeLayout(content, 'overview', false);
  const routes = layout.tiles.filter((t) => t.graph);
  assert.deepEqual(new Set(routes.map((t) => t.graph)), new Set(content.routes.map((r) => r.id)));
  assert.equal(new Set(routes.map((t) => t.x)).size, 1);
  const research = routes.find((t) => t.graph === 'acceleration');
  const present = layout.tiles.find((t) => t.node === 'NOW');
  assert.ok(layout.forks.some((f) => f.from === present.key && f.targets.includes(research.key)));
  assert.ok(layout.wires.some((w) => w.from === research.key && w.edge === 'R2-C2'));
  assert.ok(!layout.wires.some((w) => w.from === research.key && ['catastrophe', 'extinction'].includes(w.to)));
});

test('alignment, execution, and control are joint inputs rather than a causal chain', () => {
  const layout = treeLayout(content, 'control', true);
  assert.equal(content.graphs.control.mode, 'network');
  assert.deepEqual(content.edges['C3-L'].requires, ['C1', 'C2', 'C3']);
  const columns = ['C1', 'C2', 'C3'].map((id) => layout.tiles.find((t) => t.node === id).x);
  assert.equal(new Set(columns).size, 1);
  assert.ok(!layout.wires.some((w) => ['C1-C2', 'C2-C3'].includes(w.edge)));
  assert.ok(layout.forks.some((f) => f.from === 'C1' && f.alternative));
  assert.ok(!layout.regions.some((r) => r.mode === 'any'));
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

test('recovery branches after harm and never appears as a sibling of the present', () => {
  assert.equal(content.edges['H-E0'].relation, 'alternative');
  for (const [view, expanded] of [['overview', false], ['overview', true], ['control', true]]) {
    const layout = treeLayout(content, view, expanded);
    const recovery = layout.tiles.find((t) => t.node === 'E0');
    const harm = layout.tiles.find((t) => t.node === 'H');
    assert.ok(recovery.x > harm.x + harm.width);
    assert.ok(layout.wires.some((w) => w.from === harm.key && w.to === recovery.key && w.edge === 'H-E0'));
    const present = layout.tiles.find((t) => t.node === 'NOW');
    if (present) {
      assert.ok(!layout.wires.some((w) => w.from === present.key && w.to === recovery.key));
      assert.ok(!layout.forks.some((f) => f.from === present.key && f.targets.includes(recovery.key)));
    }
  }
});

test('the overview keeps loss of agency distinct from extinction', () => {
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


test('OR mechanisms branch and rejoin; AND frames separate the result from its conditions', () => {
  const layout = treeLayout(content, 'misuse', true);
  const tile = (id) => layout.tiles.find((t) => t.node === id);
  const fork = layout.forks.find((f) => f.from === 'M2');
  assert.ok(fork.alternative);
  assert.ok(forkGeometry(fork, layout).mergePath);
  assert.equal(tile('M2c').x, tile('M2b').x);
  assert.notEqual(tile('M2c').y, tile('M2b').y);
  for (const id of ['M2c', 'M2b']) {
    const frame = layout.regions.find((r) => r.node === id);
    assert.ok(tile(id).x + tile(id).width < frame.x);
    for (const child of frame.members) {
      const t = tile(child);
      assert.ok(t.x - frame.x >= 24 && t.y - frame.y >= 24);
      assert.ok(frame.x + frame.width - t.x - t.width >= 24);
      assert.ok(frame.y + frame.height - t.y - t.height >= 24);
    }
  }
  const dedicated = treeLayout(content, 'cyber-conditions', true);
  assert.equal(dedicated.tiles.find((t) => t.node === 'M2c1').color, tile('M2c1').color);
});

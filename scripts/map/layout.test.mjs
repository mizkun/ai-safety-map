import assert from 'node:assert/strict';
import test from 'node:test';
import { connectionLabels } from '../../lib/connection-labels.ts';
import { readCanonicalContent } from '../../lib/content-reader.mjs';
import { initialMapCamera } from '../../lib/map-gestures.mjs';
import { tourStops } from '../../lib/map-tour.ts';
import { overlaps } from '../../lib/relation-labels.ts';
import {
  applyTranslation,
  translationFields,
} from '../../lib/translation-fields.mjs';
import {
  forkGeometry,
  joinGeometry,
  wireGeometry,
} from '../../lib/tree-geometry.ts';
import { treeLayout } from '../../lib/tree-layout.ts';
const content = readCanonicalContent();

test('phones open on a connected tree while preserving every overview node and edge', () => {
  const original = treeLayout(content, 'overview', false);
  for (const width of [291, 320, 390, 430, 740]) {
    const layout = treeLayout(content, 'overview', false, true, width);
    const present = layout.tiles.find((t) => t.node === 'NOW');
    const routes = layout.tiles.filter((t) => t.kind === 'route');
    assert.deepEqual(
      layout.tiles.map((t) => t.key),
      original.tiles.map((t) => t.key),
    );
    assert.deepEqual(
      layout.wires.map((w) => [w.from, w.to, w.edge]),
      original.wires.map((w) => [w.from, w.to, w.edge]),
    );
    const fork = layout.forks.find((f) => f.key === 'present-routes');
    assert.deepEqual(
      fork.targets,
      routes.map((t) => t.key),
    );
    assert.ok(forkGeometry(fork, layout).trunk);
    assert.equal(forkGeometry(fork, layout).branches.length, 7);
    for (const tile of routes) {
      assert.ok(tile.y > present.y + present.height);
      assert.ok(tile.width >= 54 && tile.height >= 44);
      assert.ok(tile.x + tile.width <= width - 12);
      assert.ok(tile.shortLabel);
    }
    for (const tile of layout.tiles) {
      assert.ok(tile.x >= 0 && tile.y >= 0);
      assert.ok(tile.x + tile.width <= layout.width);
      assert.ok(tile.y + tile.height <= layout.height);
    }
    for (const wire of layout.wires)
      assert.ok(!wireGeometry(wire, layout).path.includes('NaN'));
    for (const tile of layout.tiles)
      for (const other of layout.tiles.filter((t) => t.key > tile.key))
        assert.ok(
          !overlaps(tile, other, 4),
          tile.key + ' overlaps ' + other.key,
        );
    // Routes remain above their outcomes, and no connector cuts through a card.
    for (const wire of layout.wires) {
      const from = layout.tiles.find((t) => t.key === wire.from);
      const to = layout.tiles.find((t) => t.key === wire.to);
      assert.ok(from.y + from.height < to.y);
      const points = wireGeometry(wire, layout).points;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1],
          b = points[i];
        const segment = {
          x: Math.min(a.x, b.x),
          y: Math.min(a.y, b.y),
          width: Math.max(1, Math.abs(a.x - b.x)),
          height: Math.max(1, Math.abs(a.y - b.y)),
        };
        for (const tile of layout.tiles.filter(
          (t) => ![wire.from, wire.to].includes(t.key),
        ))
          assert.ok(
            !overlaps(segment, tile, 0),
            wire.key + ' crosses ' + tile.key,
          );
      }
    }
    const labels = connectionLabels(layout, content, 1);
    assert.equal(labels.length, layout.wires.length);
    assert.ok(labels.every((label) => label.direction === 'down'));
    assert.deepEqual(
      initialMapCamera({ width, height: 650 }, layout, present),
      { scale: 1, left: 0, top: 0 },
    );
    assert.equal(
      initialMapCamera({ width, height: 500 }, layout, present).top,
      0,
    );
  }
});

test('phone scenarios stay vertical, preserve logic, and leave a clear gap after the present', () => {
  for (const view of [...content.routes.map((r) => r.id), 'overview']) {
    const desktop = treeLayout(content, view, true);
    const phone = treeLayout(content, view, true, true, 320);
    assert.equal(phone.flow, 'vertical');
    assert.deepEqual(
      phone.tiles.map((t) => t.key),
      desktop.tiles.map((t) => t.key),
    );
    assert.deepEqual(
      phone.wires.map((w) => [w.from, w.to, w.edge]),
      desktop.wires.map((w) => [w.from, w.to, w.edge]),
    );
    assert.deepEqual(
      phone.forks?.map((f) => [f.from, f.targets, f.merge?.inputs]),
      desktop.forks?.map((f) => [f.from, f.targets, f.merge?.inputs]),
    );
    assert.deepEqual(
      phone.joins?.map((j) => [j.inputs, j.output]),
      desktop.joins?.map((j) => [j.inputs, j.output]),
    );
    const now = phone.tiles.find((t) => t.node === 'NOW');
    if (now) {
      const rest = phone.tiles.filter((t) => t !== now);
      if (view !== 'overview')
        assert.ok(
          Math.min(...rest.map((t) => t.y)) - now.y - now.height >= 40,
          view,
        );
      const camera = initialMapCamera({ width: 320, height: 550 }, phone, now);
      assert.ok(now.y * camera.scale - camera.top >= 0);
      assert.ok((now.y + now.height) * camera.scale - camera.top < 550);
    }
    for (const tile of phone.tiles) {
      assert.ok(
        tile.x >= 0 &&
          tile.y >= 0 &&
          tile.x + tile.width <= phone.width &&
          tile.y + tile.height <= phone.height,
      );
      for (const other of phone.tiles.filter((t) => t.key > tile.key))
        assert.ok(
          !overlaps(tile, other),
          view + ': ' + tile.key + ' / ' + other.key,
        );
    }
    for (const wire of phone.wires)
      assert.ok(!wireGeometry(wire, phone).path.includes('NaN'));
    for (const fork of phone.forks || [])
      assert.ok(!forkGeometry(fork, phone).trunk.includes('NaN'));
    for (const label of connectionLabels(phone, content, 0.8))
      for (const tile of phone.tiles)
        assert.ok(
          !overlaps(label, {
            x: tile.x * 0.8,
            y: tile.y * 0.8,
            width: tile.width * 0.8,
            height: tile.height * 0.8,
          }),
          view,
        );
  }
});

test('individual scenarios have one connected present outside their causal conditions', () => {
  for (const route of content.routes)
    for (const compact of [false, true]) {
      const layout = treeLayout(content, route.id, true, compact);
      const present = layout.tiles.filter((t) => t.node === 'NOW');
      assert.equal(present.length, 1, route.id + ': one starting point');
      const origin = present[0];
      for (const tile of layout.tiles.filter((t) => t !== origin))
        assert.ok(
          origin.x + origin.width < tile.x,
          route.id + ': present must come first',
        );
      for (const frame of layout.regions || [])
        assert.ok(
          origin.x + origin.width < frame.x,
          route.id + ': present must stay outside AND',
        );
      const connection = layout.wires.find((w) => w.from === origin.key);
      const fork = layout.forks?.find((f) => f.from === origin.key);
      assert.ok(connection || fork, route.id + ': disconnected present');
      if (connection) {
        assert.equal(connection.reference, true);
        assert.equal(connection.edge, undefined);
      }
      if (fork) assert.notEqual(fork.alternative, true);
      for (const join of layout.joins || [])
        assert.ok(
          !join.inputs.includes(origin.key),
          route.id + ': present is not a joint condition',
        );
    }
});

test('capability progress has ordinary OR branches, an ASI bypass, and bounded outer ink', () => {
  for (const view of ['control', 'work'])
    for (const expanded of [true, { routes: [], nodes: ['R0'] }]) {
      const layout = treeLayout(content, view, expanded);
      assert.equal(layout.factors?.length || 0, 0);
      assert.ok(layout.forks.some((f) => f.from === 'R0' && f.alternative));
      for (const id of ['R0', 'R5', 'R3', 'ASI', 'R4'])
        assert.ok(layout.tiles.some((t) => t.node === id));
      for (const wire of layout.wires)
        for (const point of wireGeometry(wire, layout).points || []) {
          assert.ok(
            point.x >= 20 && point.y >= 20,
            wire.key + ': leading ink clipped',
          );
          assert.ok(
            point.x <= layout.width - 20 && point.y <= layout.height - 20,
            wire.key + ': trailing ink clipped',
          );
        }
    }
  assert.deepEqual(content.graphs['development-paths'].nodes, ['R5', 'R3']);
  assert.equal(content.graphs['development-paths'].mode, 'any');
  assert.equal(content.edges['ASI-C3'].relation, 'influence');
  assert.equal(content.edges['R0-C2a'].from, 'R0');
  assert.ok(!content.edges['R0-C2a'].requires?.includes('ASI'));
});

test('translations change prose while preserving the causal graph and references', () => {
  const fields = translationFields(content);
  assert.ok(fields['nodes.C1.body.概要']);
  assert.ok(fields['edges.C3-L.explanation']);
  assert.equal(fields['nodes.C1.id'], undefined);
  assert.equal(fields['nodes.C1.explanation'], undefined);
  assert.equal(fields['edges.C3-L.from'], undefined);
  assert.equal(fields['sources.power.url'], undefined);
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
  assert.equal(translated.sources.power.url, content.sources.power.url);
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
  for (const view of ['overview', ...Object.keys(content.graphs)])
    for (const expanded of [
      false,
      true,
      ...(['control', 'work'].includes(view)
        ? [{ routes: [], nodes: ['R0', 'R3'] }]
        : []),
    ]) {
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
        const ids = join.inputs.map(
          (key) =>
            layout.regions?.find((r) => r.key === key)?.node ||
            layout.areas?.find((r) => r.key === key)?.node ||
            layout.tiles.find((t) => t.key === key)?.node,
        );
        assert.deepEqual(
          new Set(ids),
          new Set(content.edges[join.edge].requires),
        );
        assert.equal(join.output, content.edges[join.edge].to);
        assert.ok(!joinGeometry(join, layout).includes('NaN'));
      }
      for (const fork of layout.forks || []) {
        const g = forkGeometry(fork, layout);
        assert.ok(!g.trunk.includes('NaN'));
        for (const p of g.junctions)
          assert.ok(
            p.x >= 0 && p.x <= layout.width && p.y >= 0 && p.y <= layout.height,
          );
        assert.equal(new Set(fork.targets).size, fork.targets.length);
      }
    }
});

test('all-elements overview contains every canonical node exactly once and none is isolated', () => {
  const layout = treeLayout(content, 'overview', true);
  const nodes = layout.tiles.flatMap((tile) => (tile.node ? [tile.node] : []));
  assert.equal(nodes.length, new Set(nodes).size);
  assert.deepEqual(new Set(nodes), new Set(Object.keys(content.nodes)));
  const connected = new Set();
  const canonical = (key) =>
    layout.tiles.find((t) => t.key === key)?.node ||
    layout.regions?.find((r) => r.key === key)?.node ||
    layout.areas?.find((r) => r.key === key)?.node;
  for (const wire of layout.wires)
    for (const key of [wire.from, wire.to]) connected.add(canonical(key));
  for (const fork of layout.forks)
    for (const key of [fork.from, ...fork.targets])
      connected.add(canonical(key));
  for (const join of layout.joins)
    for (const key of [...join.inputs, join.output])
      connected.add(canonical(key));
  for (const region of layout.regions) {
    connected.add(region.node);
    for (const child of region.members ||
      content.graphs[content.nodes[region.node].subgraph].nodes)
      connected.add(child);
  }
  for (const id of nodes) assert.ok(connected.has(id), 'Isolated node: ' + id);
});

test('the present is the single left-hand origin and causal progression runs to the right', () => {
  for (const expanded of [false, true]) {
    const layout = treeLayout(content, 'overview', expanded);
    const present = layout.tiles.find((t) => t.node === 'NOW');
    assert.equal(layout.flow, 'horizontal');
    assert.equal(layout.tiles.filter((t) => t.node === 'NOW').length, 1);
    assert.ok(
      layout.tiles
        .filter((t) => t !== present)
        .every((t) => t.x > present.x + present.width),
    );
    const terminal = layout.tiles.find((t) => t.node === 'X');
    const harm = layout.tiles.find((t) => t.node === 'H');
    assert.ok(terminal.x > harm.x);
    assert.ok(layout.forks.some((f) => f.from === present.key));
  }
});

test('development uses ordinary node expansion and never becomes a required control input', () => {
  const overview = treeLayout(content, 'overview', false);
  assert.equal(overview.tiles.filter((t) => t.kind === 'route').length, 7);
  for (const view of ['control', 'work']) {
    const summary = treeLayout(content, view, false);
    const detailed = treeLayout(content, view, {
      routes: [],
      nodes: ['R0', 'R3'],
    });
    for (const id of ['R0', 'R3', 'ASI'])
      assert.ok(summary.tiles.some((t) => t.node === id));
    for (const id of ['R1', 'R2'])
      assert.ok(detailed.tiles.some((t) => t.node === id));
    assert.ok(!detailed.regions.some((r) => r.members?.includes('R3')));
    assert.ok(
      detailed.wires.some(
        (w) => w.edge === (view === 'control' ? 'R0-C2a' : 'R0-W1'),
      ),
    );
  }
  assert.deepEqual(content.edges['C3-L'].requires, ['C1', 'C2', 'C3']);
});

test('alignment, execution, and control are joint inputs rather than a causal chain', () => {
  const layout = treeLayout(content, 'control', true);
  assert.equal(content.graphs.control.mode, 'network');
  assert.deepEqual(content.edges['C3-L'].requires, ['C1', 'C2', 'C3']);
  const columns = ['C1', 'C2', 'C3'].map(
    (id) => layout.tiles.find((t) => t.node === id).x,
  );
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
  for (const id of ['R0-C2a', 'R0-W1', 'R4-C1', 'R0-ASI', 'ASI-C3', 'W4-P1'])
    assert.ok(layout.wires.some((w) => w.edge === id));
  assert.equal(content.edges['R4-C1'].relation, 'mitigation');
  assert.deepEqual(content.edges['W3-W5'].requires, ['W3', 'W6']);
  for (const view of ['work', 'money']) {
    assert.ok(!content.graphs[view].nodes.includes('X'));
    for (const id of content.graphs[view].edges)
      assert.ok(!['X', 'H', 'T'].includes(content.edges[id].to));
  }
  assert.ok(!content.edges['I1-I2'].requires?.includes('F3'));
  assert.ok(!layout.wires.some((w) => w.from === 'F3' && w.to === 'P3'));
});

test('recovery branches after harm and never appears as a sibling of the present', () => {
  assert.equal(content.edges['H-E0'].relation, 'alternative');
  for (const [view, expanded] of [
    ['overview', false],
    ['overview', true],
    ['control', true],
  ]) {
    const layout = treeLayout(content, view, expanded);
    const recovery = layout.tiles.find((t) => t.node === 'E0');
    const harm = layout.tiles.find((t) => t.node === 'H');
    assert.ok(recovery.x > harm.x + harm.width);
    assert.ok(
      layout.wires.some(
        (w) =>
          w.from === harm.key && w.to === recovery.key && w.edge === 'H-E0',
      ),
    );
    const present = layout.tiles.find((t) => t.node === 'NOW');
    if (present) {
      assert.ok(
        !layout.wires.some(
          (w) => w.from === present.key && w.to === recovery.key,
        ),
      );
      assert.ok(
        !layout.forks.some(
          (f) => f.from === present.key && f.targets.includes(recovery.key),
        ),
      );
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
  assert.equal(
    dedicated.tiles.find((t) => t.node === 'M2c1').color,
    tile('M2c1').color,
  );
});

test('in-map expansion reveals one level without removing the route context', () => {
  const partial = (nodes) =>
    treeLayout(content, 'control', { routes: [], nodes });
  const closed = partial([]),
    first = partial(['C3']),
    deeper = partial(['C3', 'C3a']);
  const ids = (layout) => new Set(layout.tiles.map((t) => t.node));
  assert.ok(!ids(closed).has('C3a'));
  assert.ok(ids(first).has('C3a') && !ids(first).has('C3a1'));
  assert.ok(ids(deeper).has('C3a1'));
  for (const id of ['C1', 'C2', 'C3', 'L', 'C4', 'H', 'X'])
    assert.ok(ids(deeper).has(id));
  assert.deepEqual(
    ids(partial([])),
    ids(closed),
    'collapsing restores the summary',
  );
});

test('partial expansions keep all routes bounded and nonoverlapping', () => {
  const parents = Object.values(content.nodes)
    .filter((n) => n.subgraph)
    .map((n) => n.id);
  for (const route of content.routes)
    for (const nodes of [
      [],
      ...parents.map((id) => [id]),
      parents,
      ...parents.map((id) => parents.filter((n) => n !== id)),
    ]) {
      const layout = treeLayout(content, route.id, { routes: [], nodes });
      assert.equal(
        new Set(layout.tiles.map((t) => t.key)).size,
        layout.tiles.length,
      );
      for (const a of layout.tiles) {
        assert.ok(
          a.x >= 0 &&
            a.y >= 0 &&
            a.x + a.width <= layout.width &&
            a.y + a.height <= layout.height,
        );
        for (const b of layout.tiles)
          if (a.key < b.key)
            assert.ok(
              Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) <=
                1 ||
                Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) <=
                  1,
              `${route.id}: ${a.key}/${b.key}`,
            );
      }
      for (const wire of layout.wires)
        assert.ok(!wireGeometry(wire, layout).path.includes('NaN'));
    }
});

test('social consequences remain conditional and do not create extinction shortcuts', () => {
  for (const [from, to] of [
    ['W3', 'W7'],
    ['W5', 'W8'],
    ['P3', 'P4'],
    ['F3', 'F5'],
    ['F5', 'F6'],
    ['F5', 'F7'],
  ]) {
    const edge = Object.values(content.edges).find(
      (e) => e.from === from && e.to === to,
    );
    assert.ok(edge && edge.conditions.length >= 2 && edge.limitation);
    assert.equal(content.nodes[to].status, 'hypothesis');
  }
  assert.ok(
    !Object.values(content.edges).some(
      (e) =>
        ['W7', 'W8', 'P4', 'F5', 'F6', 'F7'].includes(e.from) &&
        ['T', 'X'].includes(e.to),
    ),
  );
  assert.ok(!content.edges['F3-P3']);
});

test('each catastrophe route exposes its existing scale-up conditions before the shared outcome', () => {
  const stops = tourStops(content);
  for (const view of ['control', 'misuse', 'interaction', 'accidents']) {
    const edge = content.graphs[view].edges
      .map((id) => content.edges[id])
      .find((e) => e.to === 'H');
    const stepIndex = stops.findIndex((s) => s.view === view && s.node === 'H');
    assert.equal(stops[stepIndex - 1].edge, edge.id);
    assert.equal(stops[stepIndex - 1].kind, 'edge');
    for (const phone of [false, true]) {
      const layout = treeLayout(
        content,
        view,
        true,
        phone,
        phone ? 390 : undefined,
      );
      const connections = [
        ...layout.wires.filter((w) => w.edge === edge.id),
        ...(layout.joins || []).filter((j) => j.edge === edge.id),
      ];
      assert.equal(
        connections.length,
        1,
        'a condition is a single connection, not another event',
      );
      assert.equal(connections[0].to || connections[0].output, 'H');
      assert.ok(
        layout.tiles.every((tile) => !tile.key.startsWith('transition-')),
      );
      const arrows = [
        ...connectionLabels(layout, content, 1).filter(
          (l) => l.edge === edge.id,
        ),
        ...(layout.joins || []).filter((j) => j.edge === edge.id),
      ];
      assert.equal(
        arrows.length,
        1,
        'the condition has one visible arrow to open',
      );
      assert.ok(edge.conditions.length >= 2);
    }
  }
});

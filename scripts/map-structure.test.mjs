import assert from 'node:assert/strict';
import test from 'node:test';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import {
  applyTranslation,
  translationFields,
} from '../lib/translation-fields.mjs';
import {
  treeLayout,
  wireGeometry,
  joinGeometry,
  joinJunctions,
  forkGeometry,
} from '../lib/tree-layout.ts';
import {
  clampZoom,
  zoomAnchor,
  scrollAtAnchor,
  initialMapScale,
  initialMapCamera,
  latestFrame,
  isReleasedPointer,
} from '../lib/map-gestures.mjs';
import { mapWindow, intersectsWindow } from '../lib/map-window.mjs';
import {
  tourStops,
  tourExpansion,
  tourCamera,
  tourContext,
  tourNavigation,
  tourKeyDirection,
} from '../lib/map-tour.ts';
import { relationLabels, overlaps } from '../lib/relation-labels.ts';
import { cameraFrame, cameraAnimator } from '../lib/map-camera.mjs';
import { connectionLabels } from '../lib/connection-labels.ts';
import { minimapViewport, minimapCamera } from '../lib/map-minimap.ts';
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

test('the money shortcut uses one clear lane instead of a tiny double bend', () => {
  for (const phone of [false, true]) {
    const layout = treeLayout(
      content,
      'money',
      true,
      phone,
      phone ? 320 : undefined,
    );
    const wire = layout.wires.find((w) => w.edge === 'W4-P1');
    assert.equal(wireGeometry(wire, layout).points.length, 3);
  }
});

test('minimap uses the actual viewport when zoomed, panned, or horizontally centered', () => {
  const map = { width: 2000, height: 1000 };
  assert.deepEqual(
    minimapViewport(
      { left: 300, top: 150, width: 600, height: 300 },
      0.75,
      map,
    ),
    { x: 400, y: 200, width: 800, height: 400 },
  );
  assert.deepEqual(
    minimapViewport({ left: 0, top: 0, width: 800, height: 600 }, 0.25, map),
    { x: 0, y: 0, width: 2000, height: 1000 },
  );
  const viewport = { width: 600, height: 300 };
  const camera = minimapCamera({ x: 1400, y: 600 }, viewport, 0.75, map);
  const frame = minimapViewport(
    { ...viewport, left: camera.left, top: camera.top },
    camera.scale,
    map,
  );
  assert.equal(frame.x + frame.width / 2, 1400);
  assert.equal(frame.y + frame.height / 2, 600);
  assert.deepEqual(minimapCamera({ x: -50, y: -50 }, viewport, 0.75, map), {
    scale: 0.75,
    left: 0,
    top: 0,
  });
  assert.deepEqual(minimapCamera({ x: 3000, y: 2000 }, viewport, 0.75, map), {
    scale: 0.75,
    left: 900,
    top: 450,
  });
  assert.deepEqual(minimapCamera({ x: 2000, y: 1000 }, viewport, 0.1, map), {
    scale: 0.1,
    left: 0,
    top: 0,
  });
});

test('the RSI alternative returns from its visible card, not an invisible sequence boundary', () => {
  for (const view of ['overview', 'control', 'work', 'acceleration'])
    for (const compact of [false, true]) {
      const layout = treeLayout(content, view, true, compact);
      const source = layout.source;
      const fork = source.forks.find((f) => f.from === 'R0');
      const sequence = source.areas.find((a) => a.key === 'area-R3');
      const rsi = source.tiles.find((t) => t.node === 'R3');
      assert.ok(fork.merge.inputs.includes(sequence.key));
      assert.equal(sequence.exit, rsi.key);
      const geometry = forkGeometry(fork, source);
      assert.ok(
        geometry.mergePath.includes(
          `M ${rsi.x + rsi.width / 2} ${rsi.y + rsi.height + 3} V`,
        ),
        view,
      );
      assert.ok(
        !geometry.mergePath.includes(
          `M ${sequence.x + sequence.width / 2} ${sequence.y + sequence.height + 3} V`,
        ),
        view,
      );
    }
});

test('nested OR branches reconnect their leaves to the enclosing OR merge', () => {
  for (const view of ['overview', 'control'])
    for (const compact of [false, true]) {
      const layout = treeLayout(content, view, true, compact);
      const inner = layout.forks.find((f) => f.from === 'C3a');
      const outer = layout.forks.find((f) => f.from === 'C3');
      assert.deepEqual(inner.targets, ['C3a1', 'C3a2', 'C3a3']);
      assert.ok(outer.merge.inputs.includes(inner.merge.area));
      const geometry = forkGeometry(inner, layout);
      assert.ok(
        geometry.mergePath,
        view + ': the three alternatives have no return path',
      );
      const tile = (id) => layout.tiles.find((t) => t.node === id);
      const incomingJunctions = geometry.junctions.filter(
        (p) =>
          inner.targets.some(
            (id) => Math.abs(p.y - tile(id).y - tile(id).height / 2) < 1e-6,
          ) &&
          p.x >
            Math.max(...inner.targets.map((id) => tile(id).x + tile(id).width)),
      );
      assert.equal(
        incomingJunctions.length,
        3,
        view + ': a return branch is missing',
      );
      assert.equal(new Set(incomingJunctions.map((p) => p.x)).size, 1);
      assert.ok(forkGeometry(outer, layout).mergePath);
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

test('phone openings keep the first card inside the viewport for every pathway', () => {
  for (const viewport of [
    { width: 320, height: 347 },
    { width: 390, height: 623 },
    { width: 430, height: 711 },
  ]) {
    for (const route of content.routes) {
      const layout = treeLayout(content, route.id, true, true);
      const anchor =
        layout.tiles.find((t) => t.node === 'NOW') || layout.tiles[0];
      const camera = initialMapCamera(viewport, layout, anchor);
      const x = anchor.x * camera.scale - camera.left;
      const y = anchor.y * camera.scale - camera.top;
      assert.ok(
        x >= 0 && x + anchor.width * camera.scale <= viewport.width,
        route.id + ': clipped horizontally',
      );
      assert.ok(
        y >= 0 && y + anchor.height * camera.scale <= viewport.height,
        route.id + ': clipped vertically',
      );
      assert.ok(camera.scale >= 0.85);
    }
  }
});

test('routing channels stay apart from parallel wires and AND frames at reading size', () => {
  for (const compact of [false, true])
    for (const view of ['overview', ...content.routes.map((r) => r.id)])
      for (const expansion of [true, { routes: [], nodes: ['R0', 'C1'] }]) {
        const layout = treeLayout(content, view, expansion, compact);
        for (const join of layout.joins || []) {
          const frame = layout.regions.find(
            (r) => r.key === 'joint-group-' + join.edge,
          );
          if (!frame) continue;
          assert.ok(
            joinJunctions(join, layout)[0].x - frame.x - frame.width >=
              24 - 1e-6,
            view + ': AND bus hugs its frame ' + join.edge,
          );
        }
        const vertical = layout.wires
          .filter((w) => w.edge)
          .flatMap((w) => {
            const points = wireGeometry(w, layout).points || [];
            return points.slice(1).flatMap((b, i) => {
              const a = points[i];
              return a.x === b.x && Math.abs(a.y - b.y) > 32
                ? [
                    {
                      edge: w.edge,
                      x: a.x,
                      start: Math.min(a.y, b.y),
                      end: Math.max(a.y, b.y),
                    },
                  ]
                : [];
            });
          });
        for (const [i, a] of vertical.entries())
          for (const b of vertical.slice(i + 1))
            if (
              a.edge !== b.edge &&
              Math.min(a.end, b.end) - Math.max(a.start, b.start) > 32
            )
              assert.ok(
                Math.abs(a.x - b.x) >= 24 - 1e-6,
                view + ': crowded parallel paths ' + a.edge + '/' + b.edge,
              );
      }
});

test('compact phone layouts preserve every condition and keep arrow labels off cards', () => {
  for (const view of ['overview', ...content.routes.map((r) => r.id)]) {
    const normal = treeLayout(content, view, true);
    const compact = treeLayout(content, view, true, true);
    assert.ok(compact.width < normal.width, view + ': not more compact');
    assert.deepEqual(
      compact.tiles.map((t) => t.key),
      normal.tiles.map((t) => t.key),
    );
    assert.deepEqual(
      compact.wires.map((w) => [w.edge, w.from, w.to]),
      normal.wires.map((w) => [w.edge, w.from, w.to]),
    );
    for (const [i, card] of compact.tiles.entries()) {
      for (const other of compact.tiles.slice(i + 1))
        assert.ok(!overlaps(card, other), view + ': cards overlap');
    }
    for (const scale of [0.5, 0.85, 1]) {
      for (const label of connectionLabels(compact, content, scale)) {
        for (const card of compact.tiles)
          assert.ok(
            !overlaps(label, {
              x: card.x * scale,
              y: card.y * scale,
              width: card.width * scale,
              height: card.height * scale,
            }),
            view + ': label covers card',
          );
      }
    }
  }
});

test('connection controls remain on their own paths without covering text, AND/OR labels, or each other', () => {
  for (const view of ['overview', ...content.routes.map((r) => r.id)]) {
    const layout = treeLayout(content, view, true);
    for (const scale of [0.24, 0.3, 0.5, 0.85, 1]) {
      const labels = connectionLabels(layout, content, scale);
      for (const [i, label] of labels.entries()) {
        for (const tile of layout.tiles)
          assert.ok(
            !overlaps(label, {
              x: tile.x * scale,
              y: tile.y * scale,
              width: tile.width * scale,
              height: tile.height * scale,
            }),
            view + ': ' + label.edge + ' covers ' + tile.node,
          );
        for (const other of [
          ...labels.slice(i + 1),
          ...relationLabels(layout, scale),
        ])
          assert.ok(
            !overlaps(label, other),
            view + ': crowded connection ' + label.edge,
          );
        const wire = layout.wires.find((w) => w.key === label.key),
          path = wireGeometry(wire, layout);
        const onSegment = (path.points || []).slice(1).some((b, i) => {
          const a = path.points[i],
            x = label.centerX / scale,
            y = label.centerY / scale;
          return (
            Math.abs((b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x)) <
              0.001 &&
            x >= Math.min(a.x, b.x) - 0.001 &&
            x <= Math.max(a.x, b.x) + 0.001 &&
            y >= Math.min(a.y, b.y) - 0.001 &&
            y <= Math.max(a.y, b.y) + 0.001
          );
        });
        assert.ok(
          onSegment ||
            (Math.abs(label.centerX - path.x * scale) < 0.001 &&
              Math.abs(label.centerY - path.y * scale) < 0.001),
          label.edge + ': detached arrow label',
        );
      }
      if (scale === 1)
        for (const wire of layout.wires.filter((w) => w.edge))
          assert.ok(
            labels.some((l) => l.key === wire.key),
            view + ': missing readable connection control ' + wire.edge,
          );
    }
  }
});

test('tour keys advance steps and leave typing, dialogs, and native controls alone', () => {
  for (const key of ['Enter', 'ArrowRight'])
    assert.equal(tourKeyDirection(key, false, false), 1);
  assert.equal(tourKeyDirection('ArrowLeft', false, false), -1);
  assert.equal(tourKeyDirection('Escape', false, false), 0);
  for (const key of ['Enter', 'ArrowRight', 'ArrowLeft']) {
    assert.equal(tourKeyDirection(key, true, false), 0);
    assert.equal(tourKeyDirection(key, false, true), 0);
  }
});

test('tour navigation separates the scenario from its steps and marks scenario boundaries', () => {
  const stops = tourStops(content);
  const scenarios = content.routes.filter((route) => route.role !== 'factor');
  assert.equal(tourNavigation(stops, 0).nextKind, 'begin');
  assert.equal(tourNavigation(stops, stops.length - 1).nextKind, 'exit');
  scenarios.forEach((scenario, scenarioIndex) => {
    const positions = stops.flatMap((s, index) =>
      s.view === scenario.id ? [index] : [],
    );
    positions.forEach((index, stepIndex) => {
      const n = tourNavigation(stops, index);
      assert.equal(n.scenarioIndex, scenarioIndex);
      assert.equal(n.scenarioCount, scenarios.length);
      assert.equal(n.stepIndex, stepIndex);
      assert.deepEqual(
        n.steps.map((s) => s.position),
        positions,
      );
      assert.ok(n.steps.every((s) => s.step.view === scenario.id));
      assert.equal(
        n.nextKind,
        stepIndex < positions.length - 1
          ? 'step'
          : scenarioIndex < scenarios.length - 1
            ? 'scenario'
            : 'finish',
      );
    });
  });
});

test('illustrated scenes retain the co-inputs of every depicted AND transition', () => {
  for (const stop of tourStops(content)) {
    const scene = tourContext(content, stop.nodes);
    for (const edge of Object.values(content.edges))
      if (
        stop.nodes.includes(edge.to) &&
        edge.requires?.some((id) => stop.nodes.includes(id))
      )
        for (const id of edge.requires)
          assert.ok(scene.includes(id), stop.key + ': missing co-input ' + id);
  }
  assert.ok(tourContext(content, ['W6', 'W5']).includes('W3'));
  assert.ok(
    !tourContext(content, ['C1', 'C2', 'C3', 'L']).includes('R3'),
    'RSI is not a new required input',
  );
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

test('the tour starts now and covers every audited story without inventing a causal chain', () => {
  const stops = tourStops(content);
  assert.deepEqual(stops[0].nodes, ['NOW']);
  assert.equal(stops.at(-1).kind, 'finish');
  assert.equal(new Set(stops.map((s) => s.key)).size, stops.length);
  for (const route of content.routes.filter((r) => r.role !== 'factor')) {
    const chapters = stops.filter(
      (s) => s.view === route.id && s.kind === 'chapter',
    );
    assert.equal(chapters.length, content.stories[route.id].chapters.length);
    for (const stop of chapters) {
      assert.deepEqual(
        stop.nodes,
        content.stories[route.id].chapters[stop.chapter].nodes,
      );
      const layout = treeLayout(content, route.id, {
        routes: [route.id],
        nodes: tourExpansion(content, stop.nodes),
      });
      for (const id of stop.nodes)
        assert.ok(
          layout.tiles.some((t) => t.node === id),
          stop.key + ': missing highlighted node ' + id,
        );
    }
  }
  assert.deepEqual(stops.find((s) => s.key === 'control:1').nodes, [
    'C1',
    'C2',
    'C3',
    'L',
  ]);
});

test('the tour camera keeps each chapter visible on desktop and phone without a giant paint surface', () => {
  for (const stop of tourStops(content)) {
    const layout = treeLayout(
      content,
      stop.view,
      stop.view === 'overview'
        ? false
        : { routes: [stop.view], nodes: tourExpansion(content, stop.nodes) },
    );
    const tiles = stop.nodes.length
      ? layout.tiles.filter((t) => stop.nodes.includes(t.node))
      : layout.tiles;
    for (const size of [
      { width: 1024, height: 600 },
      { width: 390, height: 220 },
    ]) {
      const camera = tourCamera(tiles, size, layout);
      assert.ok(
        camera &&
          Number.isFinite(camera.scale) &&
          camera.scale > 0 &&
          camera.scale <= 1,
      );
      const offsetX = Math.max(
        0,
        (size.width - layout.width * camera.scale) / 2,
      );
      for (const tile of tiles) {
        const x = tile.x * camera.scale + offsetX - camera.left,
          y = tile.y * camera.scale - camera.top;
        assert.ok(
          x >= -1 &&
            y >= -1 &&
            x + tile.width * camera.scale <= size.width + 1 &&
            y + tile.height * camera.scale <= size.height + 1,
          stop.key + ': target must be in view',
        );
      }
    }
  }
});

test('desktop routes start at a screen-fitting size while phones keep readable cards', () => {
  for (const view of ['overview', 'acceleration', 'misuse', 'work']) {
    const layout = treeLayout(content, view, false),
      size = { width: 1440, height: 720 };
    const scale = initialMapScale(size, layout);
    assert.ok(
      layout.width * scale <= size.width - 39,
      view + ': initial horizontal fit',
    );
    assert.ok(
      layout.height * scale <= size.height - 39,
      view + ': initial vertical fit',
    );
    const phoneScale = initialMapScale({ width: 390, height: 600 }, layout);
    assert.ok(phoneScale * 266.4 >= 240);
  }
});

test('pan and pinch events are coalesced to one latest update per animation frame', () => {
  const callbacks = new Map();
  let nextId = 0,
    updates = 0,
    value = 0;
  const batch = latestFrame(
    (fn) => {
      callbacks.set(++nextId, fn);
      return nextId;
    },
    (id) => callbacks.delete(id),
  );
  for (let i = 1; i <= 100; i++)
    batch.schedule(() => {
      updates++;
      value = i;
    });
  assert.equal(callbacks.size, 1);
  callbacks.values().next().value();
  callbacks.clear();
  assert.equal(updates, 1);
  assert.equal(value, 100);
  batch.schedule(() => updates++);
  batch.cancel();
  assert.equal(callbacks.size, 0);
});

test('transferring implicit touch capture from a card does not end the pinch', () => {
  const viewport = {},
    card = {};
  assert.equal(
    isReleasedPointer({ type: 'lostpointercapture', target: card }, viewport),
    false,
  );
  assert.equal(
    isReleasedPointer(
      { type: 'lostpointercapture', target: viewport },
      viewport,
    ),
    true,
  );
  assert.equal(
    isReleasedPointer({ type: 'pointerup', target: card }, viewport),
    true,
  );
  assert.equal(
    isReleasedPointer({ type: 'pointercancel', target: card }, viewport),
    true,
  );
});

test('the paint surface stays bounded by the viewport even on the full map', () => {
  const layout = treeLayout(content, 'overview', true);
  for (const scale of [0.1, 0.5, 1, 1.6])
    for (const left of [0, 1000, 2000]) {
      const viewport = { width: 390, height: 600, left, top: 1000 };
      const paint = mapWindow(viewport, scale, layout.width, layout.height);
      assert.ok(paint.width * scale <= viewport.width + 360 + 400 * scale);
      assert.ok(paint.height * scale <= viewport.height + 360 + 400 * scale);
    }
  assert.ok(
    layout.width < 6500 && layout.height < 6500,
    'routing channels may add space, but large empty bands must not return',
  );
});

test('pinch zoom preserves the point under the fingers, including centered maps', () => {
  for (const initial of [0.02, 0.8]) {
    const point = { x: 195, y: 300 },
      scroll = { left: 120, top: 250 };
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
  const viewport = {
    left: 0,
    top: Math.max(0, (present.y + present.height / 2) * 0.94 - 300),
    width: 390,
    height: 600,
  };
  const window = mapWindow(viewport, 0.94, layout.width, layout.height);
  const visible = layout.tiles.filter((t) => intersectsWindow(t, window));
  assert.ok(visible.includes(present));
  assert.ok(visible.length < layout.tiles.length / 3);
  const fit = Math.min(
    (viewport.width - 40) / layout.width,
    (viewport.height - 40) / layout.height,
  );
  const fullWindow = mapWindow(
    { ...viewport, top: 0 },
    fit,
    layout.width,
    layout.height,
  );
  assert.ok(layout.tiles.every((t) => intersectsWindow(t, fullWindow)));
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

test('independent routed edges do not share segments or pass through unrelated cards', () => {
  const segments = (points) =>
    (points || []).slice(1).map((p, i) => [points[i], p]);
  function sharedLength([a, b], [c, d]) {
    if (a.x === b.x && c.x === d.x && a.x === c.x)
      return Math.max(
        0,
        Math.min(Math.max(a.y, b.y), Math.max(c.y, d.y)) -
          Math.max(Math.min(a.y, b.y), Math.min(c.y, d.y)),
      );
    if (a.y === b.y && c.y === d.y && a.y === c.y)
      return Math.max(
        0,
        Math.min(Math.max(a.x, b.x), Math.max(c.x, d.x)) -
          Math.max(Math.min(a.x, b.x), Math.min(c.x, d.x)),
      );
    return 0;
  }
  for (const view of ['overview', ...Object.keys(content.graphs)])
    for (const expanded of [
      false,
      true,
      ...(['control', 'work'].includes(view)
        ? [{ routes: [], nodes: ['R0', 'R3'] }]
        : []),
    ]) {
      const layout = treeLayout(content, view, expanded);
      const edges = layout.wires
        .filter((w) => w.edge)
        .map((w) => ({
          w,
          segments: segments(wireGeometry(w, layout).points),
        }));
      for (const [i, a] of edges.entries()) {
        for (const b of edges.slice(i + 1))
          for (const sa of a.segments)
            for (const sb of b.segments)
              assert.ok(
                sharedLength(sa, sb) < 1,
                view + ': overlapping routes ' + a.w.edge + '/' + b.w.edge,
              );
        for (const tile of layout.tiles) {
          if ([a.w.from, a.w.to].includes(tile.key)) continue;
          for (const [p, q] of a.segments) {
            const intersects =
              p.x === q.x
                ? p.x > tile.x + 1 &&
                  p.x < tile.x + tile.width - 1 &&
                  Math.max(p.y, q.y) > tile.y + 1 &&
                  Math.min(p.y, q.y) < tile.y + tile.height - 1
                : p.y > tile.y + 1 &&
                  p.y < tile.y + tile.height - 1 &&
                  Math.max(p.x, q.x) > tile.x + 1 &&
                  Math.min(p.x, q.x) < tile.x + tile.width - 1;
            assert.ok(
              !intersects,
              view + ': route ' + a.w.edge + ' crosses card ' + tile.key,
            );
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

test('AND and OR labels never cover cards or each other across zoom levels', () => {
  for (const view of ['overview', ...Object.keys(content.graphs)]) {
    const layout = treeLayout(content, view, true);
    for (const scale of [0.25, 0.5, 0.85, 1, 1.6]) {
      const labels = relationLabels(layout, scale);
      for (const [i, label] of labels.entries()) {
        for (const tile of layout.tiles)
          assert.ok(
            !overlaps(label, {
              x: tile.x * scale,
              y: tile.y * scale,
              width: tile.width * scale,
              height: tile.height * scale,
            }),
            view + ': label covers ' + tile.key,
          );
        for (const other of labels.slice(i + 1))
          assert.ok(!overlaps(label, other));
      }
      if (scale >= 0.85)
        assert.equal(
          labels.length,
          (layout.regions?.length || 0) +
            (layout.forks?.filter((f) => f.alternative).length || 0),
          view + ': readable relations must remain labeled',
        );
    }
  }
});

test('camera animation preserves the zoom anchor and reaches the exact destination', () => {
  for (const contentWidth of [400, 4000]) {
    const width = 1000,
      height = 600;
    const from = { scale: 0.4, left: 0, top: 80 };
    const point = { x: width / 2, y: height / 2 };
    const anchor = zoomAnchor(point, from, from.scale, width, contentWidth);
    const to = {
      scale: 1.2,
      ...scrollAtAnchor(anchor, point, 1.2, width, contentWidth),
    };
    let previous = from.scale;
    for (let t = 0; t <= 1; t += 0.05) {
      const frame = cameraFrame(from, to, t, width, height, contentWidth);
      const actual = zoomAnchor(point, frame, frame.scale, width, contentWidth);
      assert.ok(
        Math.abs(actual.x - anchor.x) < 1e-6 &&
          Math.abs(actual.y - anchor.y) < 1e-6,
      );
      assert.ok(frame.scale >= previous && frame.scale <= to.scale);
      previous = frame.scale;
    }
    const end = cameraFrame(from, to, 1, width, height, contentWidth);
    for (const key of ['scale', 'left', 'top'])
      assert.ok(Math.abs(end[key] - to[key]) < 1e-6);
  }
});

test('new camera requests and manual gestures cancel older animations; reduced motion is immediate', () => {
  const queue = new Map();
  let id = 0;
  const animator = cameraAnimator(
    (callback) => {
      queue.set(++id, callback);
      return id;
    },
    (id) => queue.delete(id),
  );
  const draws = [];
  animator.run(360, (t) => draws.push(['old', t]));
  const stale = [...queue.values()][0];
  animator.run(360, (t) => draws.push(['new', t]));
  stale(0);
  assert.equal(draws.length, 0);
  animator.stop();
  assert.equal(queue.size, 0);
  animator.run(0, (t) => draws.push(['reduced', t]));
  assert.deepEqual(draws, [['reduced', 1]]);
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

test('the detailed tour covers every node and retains parallel and sequence context', () => {
  const stops = tourStops(content);
  const covered = new Set(stops.flatMap((s) => s.nodes));
  for (const id of Object.keys(content.nodes))
    assert.ok(covered.has(id), 'Missing tour condition ' + id);
  for (const stop of stops.filter((s) => s.kind === 'node')) {
    const context = tourContext(content, stop.nodes, true, stop.view);
    const layout = treeLayout(content, stop.view, {
      routes: [stop.view],
      nodes: tourExpansion(content, context),
    });
    for (const id of context)
      assert.ok(
        layout.tiles.some((t) => t.node === id),
        stop.key + ': missing context ' + id,
      );
  }
  for (const id of ['C1', 'C2', 'C3'])
    assert.ok(tourContext(content, ['L'], true).includes(id));
  for (const id of ['R0', 'R5', 'R1', 'R2'])
    assert.ok(tourContext(content, ['R3'], true).includes(id));
});

test('the present meets the middle scenario at a single junction', () => {
  for (const expanded of [false, true]) {
    const layout = treeLayout(content, 'overview', expanded);
    const fork = layout.forks.find((f) => f.key === 'present-routes');
    const points = forkGeometry(fork, layout).junctions;
    const origin = layout.tiles.find((t) => t.node === 'NOW');
    assert.equal(
      points.filter((p) => Math.abs(p.y - origin.y - origin.height / 2) < 0.01)
        .length,
      1,
    );
    for (let i = 0; i < points.length; i++)
      for (const other of points.slice(i + 1))
        assert.ok(
          Math.hypot(points[i].x - other.x, points[i].y - other.y) > 10,
        );
  }
});

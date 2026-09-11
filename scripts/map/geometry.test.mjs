import assert from 'node:assert/strict';
import test from 'node:test';
import { connectionLabels } from '../../lib/connection-labels.ts';
import { readCanonicalContent } from '../../lib/content-reader.mjs';
import { projectTreePoint } from '../../lib/tree-projection.ts';
import { overlaps, relationLabels } from '../../lib/relation-labels.ts';
import {
  cardPorts,
  forkGeometry,
  joinJunctions,
  wireGeometry,
} from '../../lib/tree-geometry.ts';
import { treeLayout } from '../../lib/tree-layout.ts';
const content = readCanonicalContent();

test('card connection ports sit on real card boundaries and bridge endpoint gaps', () => {
  for (const view of ['overview', ...content.routes.map((r) => r.id)]) {
    for (const phone of [false, true]) {
      const layout = treeLayout(content, view, true, phone, 390);
      const ports = cardPorts(layout);
      assert.ok(ports.length > 0);
      assert.equal(ports.length, new Set(ports.map((p) => p.key)).size);
      for (const port of ports) {
        const tile = layout.tiles.find((t) => (t.node || t.key) === port.node);
        assert.ok(tile);
        assert.ok(port.x >= tile.x && port.x <= tile.x + tile.width);
        assert.ok(port.y >= tile.y && port.y <= tile.y + tile.height);
        assert.ok(
          [tile.x, tile.x + tile.width].includes(port.x) ||
            [tile.y, tile.y + tile.height].includes(port.y),
        );
        assert.ok(Math.hypot(port.x - port.line.x, port.y - port.line.y) <= 12);
      }
    }
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

test('fork elbows keep equal radii after projection and preserve every branch endpoint', () => {
  for (const layout of [
    treeLayout(content, 'overview', false),
    treeLayout(content, 'overview', true),
    treeLayout(content, 'overview', false, true, 320),
    treeLayout(content, 'overview', true, true, 390),
  ]) {
    const fork = layout.forks.find((f) => f.key === 'present-routes');
    const geometry = forkGeometry(fork, layout);
    const source = layout.source || layout;
    assert.deepEqual(
      geometry.branches.map((b) => b.key),
      fork.targets,
    );
    for (const branch of geometry.branches) {
      const tile = source.tiles.find((t) => t.key === branch.key);
      const point = { x: tile.x + tile.width / 2, y: tile.y - 5 };
      const end = layout.source ? projectTreePoint(point, layout) : point;
      assert.ok(branch.path.endsWith(`L ${end.x} ${end.y}`));
    }
    const sorted = [...geometry.branches].sort((a, b) => a.x - b.x);
    for (const branch of [sorted[0], sorted.at(-1)]) {
      assert.ok(branch.path.includes(' Q '), branch.key + ': square elbow');
      const [sx, sy, cx, cy, ex, ey] = branch.path
        .match(/-?\d+(?:\.\d+)?/g)
        .map(Number);
      const incoming = Math.hypot(sx - cx, sy - cy);
      const outgoing = Math.hypot(ex - cx, ey - cy);
      assert.ok(incoming > 0 && incoming <= 14);
      assert.ok(Math.abs(incoming - outgoing) < 1e-6, 'stretched corner');
      assert.ok(
        !geometry.markers.some((p) => p.x === cx && p.y === cy),
        'an elbow must not look like a junction',
      );
    }
    assert.equal(geometry.markers.length, geometry.junctions.length - 2);
  }
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
          `M ${rsi.x + rsi.width / 2} ${rsi.y + rsi.height + 3} `,
        ),
        view,
      );
      assert.ok(
        !geometry.mergePath.includes(
          `M ${sequence.x + sequence.width / 2} ${sequence.y + sequence.height + 3} `,
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
        for (const other of layout.wires.filter((w) => w.key !== wire.key)) {
          const points = wireGeometry(other, layout).points || [];
          for (let n = 1; n < points.length; n++) {
            const a = points[n - 1],
              b = points[n];
            assert.ok(
              !overlaps(
                label,
                {
                  x: Math.min(a.x, b.x) * scale,
                  y: Math.min(a.y, b.y) * scale,
                  width: Math.abs(a.x - b.x) * scale,
                  height: Math.abs(a.y - b.y) * scale,
                },
                3,
              ),
              view + ': ' + label.edge + ' covers another line ' + other.key,
            );
          }
        }
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

test('the research sequence arrow stays clear of the RSI alternative return bus', () => {
  for (const view of ['control', 'overview']) {
    for (const phone of [false, true]) {
      const layout = treeLayout(content, view, true, phone, 390);
      const label = connectionLabels(layout, content, 1).find(
        (l) => l.edge === 'R1-R2',
      );
      const rsi = layout.tiles.find((t) => t.node === 'R3');
      assert.ok(label, 'the connection remains accessible');
      const distance = phone
        ? Math.abs(label.centerX - (rsi.x + rsi.width / 2))
        : Math.abs(label.centerY - (rsi.y + rsi.height / 2));
      assert.ok(
        distance >= label.width / 2 + 4,
        'arrow overlaps the return bus',
      );
    }
  }
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

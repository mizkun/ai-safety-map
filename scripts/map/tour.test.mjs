import assert from 'node:assert/strict';
import test from 'node:test';
import { readCanonicalContent } from '../../lib/content-reader.mjs';
import {
  tourCamera,
  tourContext,
  tourExpansion,
  tourKeyDirection,
  tourNavigation,
  tourStops,
} from '../../lib/map-tour.ts';
import { treeLayout } from '../../lib/tree-layout.ts';
const content = readCanonicalContent();

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

test('short phone tour panes keep the current subject readable and fully visible', () => {
  for (const size of [
    { width: 268, height: 158 },
    { width: 341, height: 186 },
    { width: 378, height: 315 },
  ]) {
    for (const stop of tourStops(content).filter((s) => s.nodes.length)) {
      const layout = treeLayout(
        content,
        stop.view,
        stop.view !== 'overview',
        true,
        size.width,
        false,
      );
      const tiles = layout.tiles.filter((t) => stop.nodes.includes(t.node));
      const anchor = tiles.find((t) => t.node === stop.nodes[0]);
      assert.ok(anchor, stop.key + ': the first subject exists');
      const camera = tourCamera(tiles, size, layout, anchor);
      assert.ok(
        camera.scale >= 0.65,
        stop.key + ': do not squeeze distant subjects into unreadable cards',
      );
      const centering = Math.max(
        0,
        (size.width - layout.width * camera.scale) / 2,
      );
      const x = anchor.x * camera.scale + centering - camera.left;
      const y = anchor.y * camera.scale - camera.top;
      assert.ok(
        x >= 0 &&
          y >= 0 &&
          x + anchor.width * camera.scale <= size.width + 1 &&
          y + anchor.height * camera.scale <= size.height + 1,
        stop.key + ': the subject stays inside the map pane',
      );
    }
  }
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

import assert from 'node:assert/strict';
import test from 'node:test';
import { readCanonicalContent } from '../../lib/content-reader.mjs';
import { cameraAnimator, cameraFrame } from '../../lib/map-camera.mjs';
import {
  clampZoom,
  initialMapCamera,
  initialMapScale,
  isReleasedPointer,
  latestFrame,
  scrollAtAnchor,
  zoomAnchor,
} from '../../lib/map-gestures.mjs';
import { minimapCamera, minimapViewport } from '../../lib/map-minimap.ts';
import { tourCamera, tourExpansion, tourStops } from '../../lib/map-tour.ts';
import { intersectsWindow, mapWindow } from '../../lib/map-window.mjs';
import { treeLayout } from '../../lib/tree-layout.ts';
const content = readCanonicalContent();

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

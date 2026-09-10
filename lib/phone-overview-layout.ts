import type { TreeLayout } from './tree-layout';
import { compactAxis } from './axis-compaction.mjs';

// Keep the same summary graph and its connections, but fit the present and
// scenario column to a phone. Later outcomes remain to the right for panning.
export function phoneOverviewLayout(
  base: TreeLayout,
  viewportWidth: number,
): TreeLayout {
  const source: TreeLayout = {
    ...base,
    tiles: base.tiles.map((t) => ({ ...t })),
    wires: base.wires.map((w) => ({ ...w })),
    forks: base.forks?.map((f) => ({ ...f })),
  };
  const place = (
    key: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const tile = source.tiles.find((t) => t.key === key)!;
    // Geometry is authored vertically, then projected onto the horizontal map.
    Object.assign(tile, { x: y, y: x, width: height, height: width });
  };
  const routes = source.tiles.filter((t) => t.kind === 'route');
  const routeWidth = Math.max(144, viewportWidth - 136);
  routes.forEach((tile, index) =>
    place(tile.key, 120, 22 + index * 76, routeWidth, 64),
  );
  place('present', 12, 22 + Math.floor(routes.length / 2) * 76 + 4, 70, 56);
  source.forks!.find((f) => f.key === 'present-routes')!.busY = 98;
  const outcomesX = 120 + routeWidth + 156;
  place('catastrophe', outcomesX, 112, 180, 72);
  place('agency', outcomesX, 340, 180, 72);
  place('survival', outcomesX + 264, 112, 180, 72);
  place('recovery', outcomesX + 264, 242, 180, 72);
  place('extinction', outcomesX + 528, 112, 160, 72);
  source.wires
    .filter((w) => w.to === 'catastrophe')
    .forEach((w, index) => {
      w.busY = 120 + routeWidth + 30 + index * 24;
    });
  source.width = Math.max(...source.tiles.map((t) => t.x + t.width)) + 24;
  source.height = Math.max(...source.tiles.map((t) => t.y + t.height)) + 24;
  return {
    ...source,
    source,
    flow: 'horizontal',
    entryView: 'phone-overview',
    width: source.height,
    height: source.width,
    tiles: source.tiles.map((t) => ({
      ...t,
      x: t.y,
      y: t.x,
      width: t.height,
      height: t.width,
    })),
    projection: {
      flow: compactAxis([[0, source.height]], source.height, 1),
      branch: compactAxis([[0, source.width]], source.width, 1),
    },
  };
}

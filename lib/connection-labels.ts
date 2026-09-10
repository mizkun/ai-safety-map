import {
  wireGeometry,
  type TreeLayout,
  type TreePoint,
} from './tree-layout.ts';
import type { Content, Edge } from './content-types';
import { overlaps, relationLabels } from './relation-labels.ts';

type ConnectionLabel = {
  x: number;
  y: number;
  width: number;
  height: number;
  key: string;
  edge: string;
  relation: Edge['relation'];
  direction: 'up' | 'down' | 'left' | 'right';
  centerX: number;
  centerY: number;
  compact: boolean;
};

// Keep an arrow's control on its own line, but out of card text and other controls.
export function connectionLabels(
  layout: TreeLayout,
  data: Content,
  scale: number,
  relations = relationLabels(layout, scale),
) {
  if (scale < 0.24) return [];
  const occupied = [
    ...layout.tiles.map((t) => ({
      x: t.x * scale,
      y: t.y * scale,
      width: t.width * scale,
      height: t.height * scale,
    })),
    ...relations,
    ...(layout.joins || []).map((j) => ({
      x: j.x * scale - 13,
      y: j.y * scale - 13,
      width: 26,
      height: 26,
    })),
    ...(layout.factors || []).map((f) => ({
      x: f.x * scale,
      y: f.y * scale,
      width: 192,
      height: 32,
    })),
  ];
  const labels: ConnectionLabel[] = [];
  for (const wire of layout.wires) {
    if (!wire.edge) continue;
    const g = wireGeometry(wire, layout);
    const direction = (a: TreePoint, b: TreePoint) =>
      Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)
        ? b.x >= a.x
          ? ('right' as const)
          : ('left' as const)
        : b.y >= a.y
          ? ('down' as const)
          : ('up' as const);
    const candidates = [
      { x: g.x * scale, y: g.y * scale, direction: g.direction },
    ];
    for (const [i, b] of (g.points || []).entries()) {
      if (!i) continue;
      const a = g.points![i - 1];
      if (Math.hypot(a.x - b.x, a.y - b.y) * scale < 20) continue;
      for (const fraction of [0.5, 0.25, 0.75, 0.125, 0.875])
        candidates.push({
          x: (a.x + (b.x - a.x) * fraction) * scale,
          y: (a.y + (b.y - a.y) * fraction) * scale,
          direction: direction(a, b),
        });
    }
    const relation = data.edges[wire.edge].relation;
    const sizes =
      scale >= 0.85 && ['influence', 'mitigation'].includes(relation)
        ? [116, 26, 18]
        : [26, 18];
    let chosen: ConnectionLabel | undefined;
    for (const width of sizes) {
      for (const c of candidates) {
        const height = Math.min(width, 28),
          rect = { x: c.x - width / 2, y: c.y - height / 2, width, height };
        if (
          rect.x < 0 ||
          rect.y < 0 ||
          rect.x + width > layout.width * scale ||
          rect.y + height > layout.height * scale
        )
          continue;
        if (occupied.some((r) => overlaps(rect, r, 2))) continue;
        chosen = {
          ...rect,
          key: wire.key,
          edge: wire.edge,
          relation,
          direction: c.direction,
          centerX: c.x,
          centerY: c.y,
          compact: width < 100,
        };
        break;
      }
      if (chosen) break;
    }
    if (chosen) {
      labels.push(chosen);
      occupied.push(chosen);
    }
  }
  return labels;
}

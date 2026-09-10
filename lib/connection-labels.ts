import {
  wireGeometry,
  forkGeometry,
  joinGeometry,
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
};

// Bounds of the rendered M/L/Q segments. Curve control points make the bounds
// conservative, keeping controls clear of rounded elbows as well as crossings.
function pathBounds(path: string, scale: number) {
  const tokens = path.match(/[MLQ]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
  const bounds = [];
  let previous = { x: 0, y: 0 };
  for (let i = 0; i < tokens.length;) {
    const command = tokens[i++];
    const points = [previous];
    const count = command === 'Q' ? 2 : 1;
    for (let n = 0; n < count; n++)
      points.push({ x: Number(tokens[i++]), y: Number(tokens[i++]) });
    previous = points.at(-1)!;
    if (command === 'M') continue;
    const xs = points.map((p) => p.x * scale);
    const ys = points.map((p) => p.y * scale);
    bounds.push({
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    });
  }
  return bounds;
}

// Keep each control on its own line, clear of other lines and readable content.
export function connectionLabels(
  layout: TreeLayout,
  data: Content,
  scale: number,
  relations = relationLabels(layout, scale),
) {
  if (scale < 0.24) return [];
  const geometries = layout.wires.map((wire) => ({
    wire,
    geometry: wireGeometry(wire, layout),
  }));
  const lines = [
    ...geometries.flatMap(({ wire, geometry }) =>
      pathBounds(geometry.path, scale).map((rect) => ({
        ...rect,
        owner: wire.key,
      })),
    ),
    ...(layout.forks || []).flatMap((fork) => {
      const g = forkGeometry(fork, layout);
      return [g.trunk, g.mergePath || '', ...g.branches.map((b) => b.path)]
        .flatMap((path) => pathBounds(path, scale))
        .map((rect) => ({ ...rect, owner: 'fork:' + fork.key }));
    }),
    ...(layout.joins || []).flatMap((join) =>
      pathBounds(joinGeometry(join, layout), scale).map((rect) => ({
        ...rect,
        owner: 'join:' + join.edge,
      })),
    ),
  ];
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
  for (const { wire, geometry: g } of geometries) {
    if (!wire.edge) continue;
    const direction = (a: TreePoint, b: TreePoint) =>
      Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)
        ? b.x >= a.x
          ? ('right' as const)
          : ('left' as const)
        : b.y >= a.y
          ? ('down' as const)
          : ('up' as const);
    const phone = layout.entryView === 'phone-overview';
    const candidates = phone
      ? []
      : [{ x: g.x * scale, y: g.y * scale, direction: g.direction }];
    // In the vertical phone summary the arrow belongs on a downward stem.
    // Start at the destination so a bend is never mistaken for a backwards step.
    const segments = (g.points || [])
      .map((b, i, points) => ({ a: points[i - 1], b }))
      .filter(({ a }) => a);
    for (const { a, b } of phone ? segments.reverse() : segments) {
      if (phone && (a.x !== b.x || b.y <= a.y)) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) * scale < (phone ? 12 : 20))
        continue;
      for (const fraction of [0.5, 0.25, 0.75, 0.125, 0.875, 0.375, 0.625])
        candidates.push({
          x: (a.x + (b.x - a.x) * fraction) * scale,
          y: (a.y + (b.y - a.y) * fraction) * scale,
          direction: direction(a, b),
        });
    }
    const relation = data.edges[wire.edge].relation;
    const sizes = [26, 18];
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
        if (lines.some((r) => r.owner !== wire.key && overlaps(rect, r, 4)))
          continue;
        chosen = {
          ...rect,
          key: wire.key,
          edge: wire.edge,
          relation,
          direction: c.direction,
          centerX: c.x,
          centerY: c.y,
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

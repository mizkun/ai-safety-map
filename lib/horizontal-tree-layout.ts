import type { TreeLayout, TreePoint } from './tree-types';
import { wireGeometry } from './tree-geometry.ts';
import { compactAxis } from './axis-compaction.mjs';
import { projectTreePoint } from './tree-projection.ts';

const FLOW_SCALE = 1.8;
const BRANCH_SCALE = 0.36;

export function horizontalTreeLayout(
  source: TreeLayout,
  compact = false,
  vertical = false,
): TreeLayout {
  const present = source.tiles.find((t) => t.node === 'NOW');
  if (present) {
    const branches = source.tiles.filter((t) => t.kind === 'route');
    const middle = branches[Math.floor(branches.length / 2)];
    if (middle) present.x = middle.x + (middle.width - present.width) / 2;
    present.label = 'present';
  }
  // Routing channels are occupied space too. Compress only the empty bands
  // between them, so independent wires never collapse against a frame or bus.
  const tracks = [
    ...source.wires.flatMap((wire) => {
      const points = wireGeometry(wire, source).points || [];
      return points
        .slice(1)
        .flatMap((b, i) =>
          points[i].y === b.y && Math.abs(points[i].x - b.x) > 32 ? [b.y] : [],
        );
    }),
    ...(source.forks || []).flatMap((f) => [
      f.busY,
      ...(f.merge ? [f.merge.y - 40] : []),
    ]),
    ...(source.joins || []).map((j) => j.y - 25),
    ...(source.regions || []).flatMap((r) => [r.y, r.y + r.height]),
  ];
  const projection = {
    offsetX: 0,
    offsetY: 0,
    flow: compactAxis(
      source.tiles.map((r) => [r.y, r.y + r.height]),
      source.height,
      vertical ? 0.7 : compact ? 1.55 : FLOW_SCALE,
      24,
      compact ? 18 : 36,
      tracks,
    ),
    branch: compactAxis(
      source.tiles.map((r) => [r.x, r.x + r.width]),
      source.width,
      vertical ? 0.68 : BRANCH_SCALE,
    ),
  };
  const flow = vertical ? ('vertical' as const) : ('horizontal' as const);
  const projected = { ...source, projection, flow };
  const point = (p: TreePoint) => projectTreePoint(p, projected);
  const rect = <
    T extends { x: number; y: number; width: number; height: number },
  >(
    r: T,
  ) => {
    const start = point(r),
      end = point({ x: r.x + r.width, y: r.y + r.height });
    return { ...r, ...start, width: end.x - start.x, height: end.y - start.y };
  };
  // Fit the ink as well as the cards. Feedback paths may lie outside the original canvas.
  const bounds = [
    ...source.tiles,
    ...(source.regions || []),
    ...(source.factors || []),
  ];
  const ink = bounds.flatMap((r) => [
    point(r),
    point({ x: r.x + r.width, y: r.y + r.height }),
  ]);
  for (const wire of source.wires) {
    const geometry = wireGeometry(wire, source);
    ink.push(
      point({ x: geometry.x - 40, y: geometry.y - 30 }),
      point({ x: geometry.x + 40, y: geometry.y + 30 }),
    );
    if (geometry.points) ink.push(...geometry.points.map(point));
    else {
      const coordinates =
        geometry.path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
      for (let i = 0; i + 1 < coordinates.length; i += 2)
        ink.push(point({ x: coordinates[i], y: coordinates[i + 1] }));
    }
  }
  const left = Math.min(0, ...ink.map((p) => p.x));
  const top = Math.min(0, ...ink.map((p) => p.y));
  const right = Math.max(
    vertical ? projection.branch.size : projection.flow.size,
    ...ink.map((p) => p.x),
  );
  const bottom = Math.max(
    vertical ? projection.flow.size : projection.branch.size,
    ...ink.map((p) => p.y),
  );
  projection.offsetX = 54 - left;
  projection.offsetY = 70 - top;
  return {
    ...source,
    width: right - left + 108,
    height: bottom - top + 140,
    tiles: source.tiles.map(rect),
    areas: source.areas?.map(rect),
    factors: source.factors?.map(rect),
    regions: source.regions?.map((r) => ({
      ...rect(r),
      labelX: point({ x: r.labelX ?? r.x + r.width / 2, y: r.labelY }).x,
      labelY: point({ x: r.labelX ?? r.x + r.width / 2, y: r.labelY }).y,
    })),
    joins: source.joins?.map((j) => ({ ...j, ...point(j) })),
    flow,
    projection,
    source,
  };
}

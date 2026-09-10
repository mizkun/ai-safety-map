import {
  wireGeometry,
  type TreeLayout,
  type TreePoint,
} from './tree-layout.ts';
import { compactAxis, projectAxis } from './axis-compaction.mjs';

const FLOW_SCALE = 1.8;
const BRANCH_SCALE = 0.36;

export function horizontalPoint(p: TreePoint, layout: TreeLayout): TreePoint {
  return {
    x:
      projectAxis(layout.projection!.flow, p.y) +
      (layout.projection!.offsetX || 0),
    y:
      projectAxis(layout.projection!.branch, p.x) +
      (layout.projection!.offsetY || 0),
  };
}

export function horizontalPath(path: string, layout: TreeLayout) {
  const tokens = path.match(/[MLHVQC]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
  let i = 0,
    result = '';
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'H')
      result += ` V ${projectAxis(layout.projection!.branch, Number(tokens[i++])) + (layout.projection!.offsetY || 0)}`;
    else if (command === 'V')
      result += ` H ${projectAxis(layout.projection!.flow, Number(tokens[i++])) + (layout.projection!.offsetX || 0)}`;
    else {
      const pairs = command === 'C' ? 3 : command === 'Q' ? 2 : 1;
      result += ' ' + command;
      for (let pair = 0; pair < pairs; pair++) {
        const p = horizontalPoint(
          { x: Number(tokens[i++]), y: Number(tokens[i++]) },
          layout,
        );
        result += ` ${p.x} ${p.y}`;
      }
    }
  }
  return result.trim();
}

export function horizontalTreeLayout(source: TreeLayout): TreeLayout {
  const present = source.tiles.find((t) => t.node === 'NOW');
  if (present) {
    present.x = (source.width - present.width) / 2;
    present.label = 'present';
  }
  const projection = {
    offsetX: 0,
    offsetY: 0,
    flow: compactAxis(
      source.tiles.map((r) => [r.y, r.y + r.height]),
      source.height,
      FLOW_SCALE,
    ),
    branch: compactAxis(
      source.tiles.map((r) => [r.x, r.x + r.width]),
      source.width,
      BRANCH_SCALE,
    ),
  };
  const projected = { ...source, projection };
  const point = (p: TreePoint) => horizontalPoint(p, projected);
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
  const right = Math.max(projection.flow.size, ...ink.map((p) => p.x));
  const bottom = Math.max(projection.branch.size, ...ink.map((p) => p.y));
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
      labelX: point({ x: 0, y: r.labelY }).x,
      labelY: point({ x: r.labelX ?? r.x + r.width / 2, y: 0 }).y,
    })),
    joins: source.joins?.map((j) => ({ ...j, ...point(j) })),
    flow: 'horizontal',
    projection,
    source,
  };
}

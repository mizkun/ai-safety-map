import type { TreeLayout, TreePoint } from './tree-layout';
import { compactAxis, projectAxis } from './axis-compaction.mjs';

const FLOW_SCALE = 1.8;
const BRANCH_SCALE = 0.36;

export function horizontalPoint(p: TreePoint, layout: TreeLayout): TreePoint {
  return {
    x: projectAxis(layout.projection!.flow, p.y),
    y: projectAxis(layout.projection!.branch, p.x),
  };
}

export function horizontalPath(path: string, layout: TreeLayout) {
  const tokens = path.match(/[MLHVQC]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
  let i = 0,
    result = '';
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'H')
      result += ` V ${projectAxis(layout.projection!.branch, Number(tokens[i++]))}`;
    else if (command === 'V')
      result += ` H ${projectAxis(layout.projection!.flow, Number(tokens[i++]))}`;
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
  return {
    ...source,
    width: projection.flow.size,
    height: projection.branch.size,
    tiles: source.tiles.map(rect),
    areas: source.areas?.map(rect),
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

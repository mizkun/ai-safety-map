import type { TreeLayout, TreePoint } from './tree-layout';

const FLOW_SCALE = 2.5;
const BRANCH_SCALE = 0.56;

export function horizontalPoint(p: TreePoint): TreePoint {
  return { x: p.y * FLOW_SCALE, y: p.x * BRANCH_SCALE };
}

export function horizontalPath(path: string) {
  const tokens = path.match(/[MLHVQC]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
  let i = 0, result = '';
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'H') result += ` V ${Number(tokens[i++]) * BRANCH_SCALE}`;
    else if (command === 'V') result += ` H ${Number(tokens[i++]) * FLOW_SCALE}`;
    else {
      const pairs = command === 'C' ? 3 : command === 'Q' ? 2 : 1;
      result += ' ' + command;
      for (let pair = 0; pair < pairs; pair++) {
        const p = horizontalPoint({ x: Number(tokens[i++]), y: Number(tokens[i++]) });
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
  const rect = <T extends { x: number; y: number; width: number; height: number }>(r: T) => ({
    ...r, ...horizontalPoint(r), width: r.height * FLOW_SCALE, height: r.width * BRANCH_SCALE,
  });
  return {
    ...source,
    width: source.height * FLOW_SCALE,
    height: source.width * BRANCH_SCALE,
    tiles: source.tiles.map(rect),
    areas: source.areas?.map(rect),
    regions: source.regions?.map((r) => ({
      ...rect(r), labelX: r.labelY * FLOW_SCALE,
      labelY: (r.labelX ?? (r.x + r.width / 2)) * BRANCH_SCALE,
    })),
    joins: source.joins?.map((j) => ({ ...j, ...horizontalPoint(j) })),
    flow: 'horizontal',
    source,
  };
}

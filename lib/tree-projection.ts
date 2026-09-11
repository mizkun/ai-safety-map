import type { TreeLayout, TreePoint } from './tree-types';
import { projectAxis } from './axis-compaction.mjs';

export function projectTreePoint(p: TreePoint, layout: TreeLayout): TreePoint {
  if (layout.flow === 'vertical')
    return {
      x:
        projectAxis(layout.projection!.branch, p.x) +
        (layout.projection!.offsetX || 0),
      y:
        projectAxis(layout.projection!.flow, p.y) +
        (layout.projection!.offsetY || 0),
    };
  return {
    x:
      projectAxis(layout.projection!.flow, p.y) +
      (layout.projection!.offsetX || 0),
    y:
      projectAxis(layout.projection!.branch, p.x) +
      (layout.projection!.offsetY || 0),
  };
}

export function projectTreePath(path: string, layout: TreeLayout) {
  const tokens = path.match(/[MLHVQC]|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
  let i = 0,
    result = '';
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'H')
      result +=
        layout.flow === 'vertical'
          ? ` H ${projectAxis(layout.projection!.branch, Number(tokens[i++])) + (layout.projection!.offsetX || 0)}`
          : ` V ${projectAxis(layout.projection!.branch, Number(tokens[i++])) + (layout.projection!.offsetY || 0)}`;
    else if (command === 'V')
      result +=
        layout.flow === 'vertical'
          ? ` V ${projectAxis(layout.projection!.flow, Number(tokens[i++])) + (layout.projection!.offsetY || 0)}`
          : ` H ${projectAxis(layout.projection!.flow, Number(tokens[i++])) + (layout.projection!.offsetX || 0)}`;
    else {
      const pairs = command === 'C' ? 3 : command === 'Q' ? 2 : 1;
      result += ' ' + command;
      for (let pair = 0; pair < pairs; pair++) {
        const p = projectTreePoint(
          { x: Number(tokens[i++]), y: Number(tokens[i++]) },
          layout,
        );
        result += ` ${p.x} ${p.y}`;
      }
    }
  }
  return result.trim();
}

import type { Content } from './content-types';
import { expandedTreeLayout } from './expanded-tree-layout.ts';
export const routeColors: Record<string, string> = {
  control: '#7963aa',
  misuse: '#aa8251',
  interaction: '#ae7183',
  accidents: '#5c8ba7',
  dependence: '#737f9d',
  acceleration: '#478f85',
  work: '#3b8594',
  money: '#9d783c',
};
export type TreeTile = {
  key: string;
  node?: string;
  graph?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label?:
    | 'present'
    | 'prevention'
    | 'catastrophe'
    | 'survival'
    | 'extinction'
    | 'lossOfControl'
    | 'research';
  kind: 'node' | 'route' | 'research';
};
export type TreeWire = {
  key: string;
  from: string;
  to: string;
  edge?: string;
  color: string;
  dashed?: boolean;
  reference?: boolean;
  viaY?: number;
  viaX?: number;
  targetSide?: boolean;
  busY?: number;
};
export type TreeRegion = {
  key: string;
  node: string;
  x: number;
  y: number;
  width: number;
  height: number;
  mode: 'all' | 'any';
  labelY: number;
  color: string;
  edge?: string;
};
export type TreeJoin = {
  edge: string;
  inputs: string[];
  output: string;
  x: number;
  y: number;
  color: string;
};
export type TreeLayout = {
  width: number;
  height: number;
  tiles: TreeTile[];
  wires: TreeWire[];
  regions?: TreeRegion[];
  joins?: TreeJoin[];
};
export function treeLayout(data: Content, view: string, expanded = false): TreeLayout {
  if ((view === 'overview' && expanded) || data.graphs[view]?.mode === 'network')
    return expandedTreeLayout(data, view, expanded, routeColors);
  const tiles: TreeTile[] = [],
    wires: TreeWire[] = [];
  const tile = (
    key: string,
    node: string | undefined,
    graph: string | undefined,
    x: number,
    y: number,
    width = 224,
    height = 104,
    color = '#747da0',
    label?: TreeTile['label'],
    kind: TreeTile['kind'] = 'node',
  ) =>
    tiles.push({ key, node, graph, x, y, width, height, color, label, kind });
  const wire = (
    from: string,
    to: string,
    color: string,
    edge?: string,
    dashed = false,
  ) => wires.push({ key: from + '-' + to, from, to, color, edge, dashed });
  if (view === 'overview') {
    tile('present', 'NOW', undefined, 646, 32, 248, 104, '#696596', 'present');
    tile(
      'prevention',
      'E0',
      undefined,
      34,
      272,
      224,
      104,
      '#528f7f',
      'prevention',
    );
    wire('present', 'prevention', '#528f7f', undefined, true);
    ['control', 'misuse', 'interaction', 'accidents', 'dependence', 'work', 'money'].forEach(
      (id, i) => {
        tile(
          id,
          undefined,
          id,
          278 + i * 244,
          272,
          224,
          104,
          routeColors[id],
          undefined,
          'route',
        );
        wire('present', id, routeColors[id]);
        if (['work', 'money'].includes(id)) return;
        if (id === 'dependence') wire(id, 'agency', routeColors[id], 'D3-E1');
        else {
          const graph = data.graphs[id];
          const edge = graph.edges.find((id) => data.edges[id].to === 'H');
          wire(id, 'catastrophe', routeColors[id], edge);
        }
      },
    );
    tile(
      'catastrophe',
      'H',
      undefined,
      634,
      506,
      264,
      104,
      '#a67685',
      'catastrophe',
    );
    tile('survival', 'T', undefined, 634, 682, 264, 104, '#a67685', 'survival');
    tile(
      'extinction',
      'X',
      undefined,
      634,
      856,
      264,
      94,
      '#a76f81',
      'extinction',
    );
    tile(
      'agency',
      'E1',
      undefined,
      1254,
      506,
      224,
      104,
      routeColors.dependence,
      'lossOfControl',
    );
    tile(
      'research',
      undefined,
      'acceleration',
      60,
      752,
      266,
      106,
      routeColors.acceleration,
      'research',
      'research',
    );
    wire('catastrophe', 'survival', '#a67685', 'H-T', true);
    wire('survival', 'extinction', '#a67685', 'T-X');
    wire('research', 'control', routeColors.acceleration, 'R2-C2', true);
    return { width: 2020, height: 1000, tiles, wires };
  }
  const graph = data.graphs[view];
  if (!graph) return treeLayout(data, 'overview');
  const color = routeColors[view] || '#7963aa';
  if (graph.mode === 'sequence') {
    graph.nodes.forEach((id, i) => {
      tile(id, id, undefined, 146, 48 + i * 214, 328, 150, color);
      if (i > 0) wire(graph.nodes[i - 1], id, color, graph.edges[i - 1]);
    });
    if (view === 'acceleration') {
      tile(
        'ASI',
        'ASI',
        undefined,
        146,
        48 + graph.nodes.length * 214,
        328,
        150,
        color,
      );
      wires.push({
        key: 'feedback',
        from: 'R3',
        to: 'R2',
        color,
        edge: 'R3-R2',
        dashed: true,
      });
    }
    return {
      width: 620,
      height: graph.nodes.length * 214 + (view === 'acceleration' ? 260 : 80),
      tiles,
      wires,
    };
  }
  if (graph.parent)
    tile('parent', graph.parent, undefined, 210, 44, 280, 150, color);
  graph.nodes.forEach((id, i) => {
    tile(id, id, undefined, 40 + i * 326, 312, 294, 164, color);
    if (graph.parent) wire('parent', id, color, undefined, true);
  });
  return {
    width: Math.max(700, graph.nodes.length * 326 + 60),
    height: 560,
    tiles,
    wires,
  };
}
export function wireGeometry(wire: TreeWire, layout: TreeLayout): {
  path: string; x: number; y: number; direction: 'up' | 'down' | 'left' | 'right';
} {
  const from = layout.tiles.find((n) => n.key === wire.from) || layout.regions?.find((n) => n.key === wire.from),
    to = layout.tiles.find((n) => n.key === wire.to) || layout.regions?.find((n) => n.key === wire.to);
  if (!from || !to) throw new Error('Missing wire endpoint: ' + wire.key);
  const x1 = from.x + from.width / 2,
    y1 = from.y + from.height + 3,
    x2 = to.x + to.width / 2,
    y2 = to.y - 5;
  if (wire.viaY !== undefined) {
    const outsideX = from.x + from.width + 35;
    if (wire.targetSide) {
      const targetX = to.x - 38;
      const endY = to.y + to.height / 2;
      return { path: `M ${from.x + from.width} ${from.y + from.height / 2} H ${outsideX} V ${wire.viaY} H ${targetX} V ${endY} H ${to.x - 5}`,
        x: (outsideX + targetX) / 2, y: wire.viaY, direction: targetX < outsideX ? 'left' : 'right' };
    }
    return { path: `M ${from.x + from.width} ${from.y + from.height / 2} H ${outsideX} V ${wire.viaY} H ${x2} V ${y2}`,
      x: (outsideX + x2) / 2, y: wire.viaY, direction: x2 < outsideX ? 'left' : 'right' };
  }
  if (wire.viaX !== undefined) {
    const startY = from.y + from.height / 2;
    const endY = to.y + to.height / 2;
    const startX = wire.viaX < from.x ? from.x : from.x + from.width;
    const endX = wire.viaX < to.x ? to.x - 5 : to.x + to.width + 5;
    return { path: `M ${startX} ${startY} H ${wire.viaX} V ${endY} H ${endX}`,
      x: wire.viaX, y: (startY + endY) / 2, direction: endY < startY ? 'up' : 'down' };
  }
  if (from.y === to.y) {
    const leftward = from.x > to.x;
    const start = leftward ? from.x : from.x + from.width;
    const end = leftward ? to.x + to.width + 5 : to.x - 5;
    return { path: `M ${start} ${from.y + from.height / 2} H ${end}`, x: (start + end) / 2, y: from.y + from.height / 2, direction: leftward ? 'left' : 'right' };
  }
  if (y2 < y1) {
    const x = from.x + from.width + 78;
    return {
      path: `M ${from.x + from.width} ${from.y + from.height / 2} C ${x} ${from.y + from.height / 2}, ${x} ${to.y + to.height / 2}, ${to.x + to.width} ${to.y + to.height / 2}`,
      x: x - 12,
      y: (from.y + to.y + from.height) / 2,
      direction: 'up',
    };
  }
  const mid = wire.busY ?? (y1 + y2) / 2;
  return {
    path: x1 === x2
      ? `M ${x1} ${y1} V ${y2}`
      : `M ${x1} ${y1} V ${mid} H ${x2} V ${y2}`,
    x: (x1 + x2) / 2,
    y: mid,
    direction: x1 === x2 ? 'down' : x2 < x1 ? 'left' : 'right',
  };
}
export function joinGeometry(join: TreeJoin, layout: TreeLayout) {
  const inputs = join.inputs.map((key) =>
    layout.regions?.find((r) => r.key === key) || layout.tiles.find((t) => t.key === key)!,
  );
  const output = layout.tiles.find((t) => t.key === join.output)!;
  const centers = inputs.map((r) => r.x + r.width / 2);
  const busY = join.y - 25;
  return [
    ...inputs.map((r) => `M ${r.x + r.width / 2} ${r.y + r.height} V ${busY}`),
    `M ${Math.min(...centers)} ${busY} H ${Math.max(...centers)}`,
    `M ${join.x} ${busY} V ${output.y - 5}`,
  ].join(' ');
}

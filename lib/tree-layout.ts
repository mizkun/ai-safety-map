import type { Content } from './content-types';
export const routeColors: Record<string, string> = {
  control: '#7963aa',
  misuse: '#aa8251',
  interaction: '#ae7183',
  accidents: '#5c8ba7',
  dependence: '#737f9d',
  acceleration: '#478f85',
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
};
export type TreeLayout = {
  width: number;
  height: number;
  tiles: TreeTile[];
  wires: TreeWire[];
};
export function treeLayout(data: Content, view: string): TreeLayout {
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
    ['control', 'misuse', 'interaction', 'accidents', 'dependence'].forEach(
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
        if (id === 'dependence') wire(id, 'agency', routeColors[id], 'D3-E1');
        else {
          const graph = data.graphs[id];
          const edge = graph.edges[graph.nodes.indexOf('H') - 1];
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
    return { width: 1520, height: 1000, tiles, wires };
  }
  const graph = data.graphs[view];
  if (!graph) return treeLayout(data, 'overview');
  const color = routeColors[view] || '#7963aa';
  if (graph.mode === 'sequence') {
    graph.nodes.forEach((id, i) => {
      tile(id, id, undefined, 146, 48 + i * 186, 328, 118, color);
      if (i > 0) wire(graph.nodes[i - 1], id, color, graph.edges[i - 1]);
    });
    if (view === 'acceleration') {
      tile(
        'ASI',
        'ASI',
        undefined,
        146,
        48 + graph.nodes.length * 186,
        328,
        118,
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
      height: graph.nodes.length * 186 + (view === 'acceleration' ? 260 : 80),
      tiles,
      wires,
    };
  }
  if (graph.parent)
    tile('parent', graph.parent, undefined, 210, 44, 280, 118, color);
  graph.nodes.forEach((id, i) => {
    tile(id, id, undefined, 40 + i * 326, 292, 294, 138, color);
    if (graph.parent) wire('parent', id, color, undefined, true);
  });
  return {
    width: Math.max(700, graph.nodes.length * 326 + 60),
    height: 520,
    tiles,
    wires,
  };
}
export function wireGeometry(wire: TreeWire, layout: TreeLayout) {
  const from = layout.tiles.find((n) => n.key === wire.from)!,
    to = layout.tiles.find((n) => n.key === wire.to)!;
  const x1 = from.x + from.width / 2,
    y1 = from.y + from.height + 3,
    x2 = to.x + to.width / 2,
    y2 = to.y - 5;
  if (y2 < y1) {
    const x = from.x + from.width + 78;
    return {
      path: `M ${from.x + from.width} ${from.y + from.height / 2} C ${x} ${from.y + from.height / 2}, ${x} ${to.y + to.height / 2}, ${to.x + to.width} ${to.y + to.height / 2}`,
      x: x - 12,
      y: (from.y + to.y + from.height) / 2,
    };
  }
  const mid = (y1 + y2) / 2;
  return {
    path: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`,
    x: (x1 + x2) / 2,
    y: mid,
  };
}

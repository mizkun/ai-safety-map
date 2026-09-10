import type { Content } from './content-types';
import { expandedTreeLayout } from './expanded-tree-layout.ts';
import {
  horizontalTreeLayout,
  horizontalPoint,
  horizontalPath,
} from './horizontal-tree-layout.ts';
export const routeColors: Record<string, string> = {
  control: '#5156a6',
  misuse: '#895b22',
  interaction: '#a3425c',
  accidents: '#246f91',
  dependence: '#526181',
  acceleration: '#187764',
  work: '#136a87',
  money: '#875c1b',
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
    | 'recovery'
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
  fromFraction?: number;
  toFraction?: number;
  sourceSide?: 'left' | 'right';
  trackOffset?: number;
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
  labelX?: number;
  color: string;
  edge?: string;
  members?: string[];
};
export type TreeArea = {
  key: string;
  node: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
export type TreeJoin = {
  edge: string;
  inputs: string[];
  output: string;
  x: number;
  y: number;
  color: string;
};
export type TreeFork = {
  key: string;
  from: string;
  targets: string[];
  busY: number;
  color: string;
  alternative?: boolean;
  merge?: { area: string; inputs: string[]; x: number; y: number };
};
export type TreePoint = { x: number; y: number };
export type TreeLayout = {
  width: number;
  height: number;
  tiles: TreeTile[];
  wires: TreeWire[];
  regions?: TreeRegion[];
  areas?: TreeArea[];
  joins?: TreeJoin[];
  forks?: TreeFork[];
  factors?: {
    key: string;
    expanded: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  flow?: 'horizontal';
  source?: TreeLayout;
  projection?: {
    flow: ReturnType<typeof import('./axis-compaction.mjs').compactAxis>;
    branch: ReturnType<typeof import('./axis-compaction.mjs').compactAxis>;
    offsetX?: number;
    offsetY?: number;
  };
};
export type TreeExpansion = {
  routes: string[];
  nodes: string[];
  factors?: string[];
};
export function treeLayout(
  data: Content,
  view: string,
  expanded: boolean | TreeExpansion = false,
  compact = false,
): TreeLayout {
  const layout = verticalTreeLayout(data, view, expanded);
  if (view !== 'overview' && data.routes.some((route) => route.id === view))
    addScenarioPresent(layout, data, view);
  return horizontalTreeLayout(layout, compact);
}

// An orientation link from the present is not a new causal claim or an AND input.
function addScenarioPresent(layout: TreeLayout, data: Content, view: string) {
  const entries = ['control', 'work', 'acceleration'].includes(view)
    ? ['R0']
    : view === 'misuse'
      ? ['M1', 'M2', 'M3']
      : view === 'money'
        ? ['I1', 'W4', 'F3']
        : [data.graphs[view].nodes[0]];
  const targets = entries.map((id) => layout.tiles.find((t) => t.node === id)!);
  if (layout.tiles.some((t) => t.node === 'NOW') || targets.some((t) => !t))
    return;
  // Reserve a leading column without changing any existing relative positions.
  const shift = 160;
  const bounds = [
    ...layout.tiles,
    ...(layout.areas || []),
    ...(layout.regions || []),
    ...(layout.factors || []),
  ];
  for (const rect of bounds) rect.y += shift;
  for (const region of layout.regions || []) region.labelY += shift;
  for (const join of layout.joins || []) join.y += shift;
  for (const fork of layout.forks || []) {
    fork.busY += shift;
    if (fork.merge) fork.merge.y += shift;
  }
  for (const wire of layout.wires) {
    if (wire.busY !== undefined) wire.busY += shift;
    if (wire.viaY !== undefined) wire.viaY += shift;
  }
  const middle = targets[Math.floor(targets.length / 2)];
  const top = Math.min(...bounds.map((r) => r.y));
  layout.tiles.unshift({
    key: 'NOW',
    node: 'NOW',
    label: 'present',
    kind: 'node',
    x: middle.x + middle.width / 2 - 112,
    y: top - 104,
    width: 224,
    height: 80,
    color: '#696596',
  });
  if (targets.length === 1) {
    layout.wires.unshift({
      key: 'present-scenario',
      from: 'NOW',
      to: targets[0].key,
      color: '#8b87a1',
      dashed: true,
      reference: true,
    });
  } else {
    layout.forks ||= [];
    layout.forks.unshift({
      key: 'present-scenario',
      from: 'NOW',
      targets: targets.map((t) => t.key),
      busY: top - 12,
      color: '#8b87a1',
    });
  }
  layout.height += shift;
}
function verticalTreeLayout(
  data: Content,
  view: string,
  expanded: boolean | TreeExpansion,
): TreeLayout {
  if (
    (view === 'overview' && expanded) ||
    ['network', 'all', 'any', 'sequence'].includes(data.graphs[view]?.mode)
  )
    return expandedTreeLayout(data, view, expanded, routeColors);
  const tiles: TreeTile[] = [],
    wires: TreeWire[] = [],
    forks: TreeFork[] = [];
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
    tile('present', 'NOW', undefined, 754, 32, 248, 104, '#696596', 'present');
    const routeIds = [
      'control',
      'misuse',
      'interaction',
      'accidents',
      'dependence',
      'work',
      'money',
    ];
    routeIds.forEach((id, i) => {
      tile(
        id,
        undefined,
        id,
        34 + i * 244,
        272,
        224,
        104,
        routeColors[id],
        id === 'acceleration' ? 'research' : undefined,
        id === 'acceleration' ? 'research' : 'route',
      );
      if (['acceleration', 'work', 'money'].includes(id)) return;
      if (id === 'dependence') wire(id, 'agency', routeColors[id], 'D3-E1');
      else {
        const graph = data.graphs[id];
        const edge = graph.edges.find((id) => data.edges[id].to === 'H');
        wire(id, 'catastrophe', routeColors[id], edge);
      }
    });
    forks.push({
      key: 'present-routes',
      from: 'present',
      targets: routeIds,
      busY: 204,
      color: '#8b87a1',
    });
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
      'recovery',
      'E0',
      undefined,
      966,
      682,
      264,
      104,
      '#528f7f',
      'recovery',
    );
    wire('catastrophe', 'recovery', '#528f7f', 'H-E0');
    wires.at(-1)!.fromFraction = 0.78;
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
    wire('catastrophe', 'survival', '#a67685', 'H-T', true);
    wire('survival', 'extinction', '#a67685', 'T-X');
    // Separate entry points keep independent risk routes distinguishable at H.
    wires
      .filter((w) => w.to === 'catastrophe')
      .forEach((w, i) => {
        w.toFraction = (i + 1) / 5;
        w.busY = 506 - 64 - i * 16;
      });
    return { width: 1780, height: 1000, tiles, wires, forks };
  }
  const graph = data.graphs[view];
  if (!graph) return verticalTreeLayout(data, 'overview', false);
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
  });
  if (graph.parent)
    forks.push({
      key: 'parent-conditions',
      from: 'parent',
      targets: graph.nodes,
      busY: 274,
      color,
    });
  return {
    width: Math.max(700, graph.nodes.length * 326 + 60),
    height: 560,
    tiles,
    wires,
    forks,
  };
}
// Rounding stays inside the routed segments, preserving the clearances around cards.
export function roundedPath(points: TreePoint[], radius = 14) {
  const clean = points.filter(
    (p, i) => i === 0 || p.x !== points[i - 1].x || p.y !== points[i - 1].y,
  );
  if (!clean.length) return '';
  let path = `M ${clean[0].x} ${clean[0].y}`;
  for (let i = 1; i < clean.length - 1; i++) {
    const a = clean[i - 1],
      b = clean[i],
      c = clean[i + 1];
    const before = Math.hypot(b.x - a.x, b.y - a.y),
      after = Math.hypot(c.x - b.x, c.y - b.y);
    const r = Math.min(radius, before / 2, after / 2);
    if ((b.x - a.x) * (c.y - b.y) === (b.y - a.y) * (c.x - b.x)) {
      path += ` L ${b.x} ${b.y}`;
      continue;
    }
    path += ` L ${b.x + ((a.x - b.x) * r) / before} ${b.y + ((a.y - b.y) * r) / before}`;
    path += ` Q ${b.x} ${b.y} ${b.x + ((c.x - b.x) * r) / after} ${b.y + ((c.y - b.y) * r) / after}`;
  }
  if (clean.length > 1) path += ` L ${clean.at(-1)!.x} ${clean.at(-1)!.y}`;
  return path;
}
export function wireGeometry(
  wire: TreeWire,
  layout: TreeLayout,
): {
  path: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  points?: TreePoint[];
} {
  if (layout.source) {
    const source = wireGeometry(wire, layout.source);
    const points = source.points?.map((p) => horizontalPoint(p, layout));
    const direction = {
      up: 'left',
      down: 'right',
      left: 'up',
      right: 'down',
    } as const;
    return {
      ...source,
      ...horizontalPoint(source, layout),
      points,
      path: points ? roundedPath(points) : horizontalPath(source.path, layout),
      direction: direction[source.direction],
    };
  }
  const from =
      layout.tiles.find((n) => n.key === wire.from) ||
      layout.regions?.find((n) => n.key === wire.from) ||
      layout.areas?.find((n) => n.key === wire.from),
    to =
      layout.tiles.find((n) => n.key === wire.to) ||
      layout.regions?.find((n) => n.key === wire.to) ||
      layout.areas?.find((n) => n.key === wire.to);
  if (!from || !to) throw new Error('Missing wire endpoint: ' + wire.key);
  const fromFraction = wire.fromFraction ?? 0.5,
    toFraction = wire.toFraction ?? 0.5;
  const x1 = from.x + from.width * fromFraction,
    y1 = from.y + from.height + 3,
    x2 = to.x + to.width * toFraction,
    y2 = to.y - 5;
  function routed(
    points: TreePoint[],
    x: number,
    y: number,
    direction: 'up' | 'down' | 'left' | 'right',
  ) {
    return { points, path: roundedPath(points), x, y, direction };
  }
  if (wire.viaY !== undefined) {
    const startX = wire.sourceSide === 'left' ? from.x : from.x + from.width;
    const outsideX =
      startX + (wire.sourceSide === 'left' ? -1 : 1) * (wire.trackOffset ?? 35);
    const startY = from.y + from.height * fromFraction;
    if (wire.targetSide) {
      const targetX = to.x - 38;
      const endY = to.y + to.height * toFraction;
      return routed(
        [
          { x: startX, y: startY },
          { x: outsideX, y: startY },
          { x: outsideX, y: wire.viaY },
          { x: targetX, y: wire.viaY },
          { x: targetX, y: endY },
          { x: to.x - 5, y: endY },
        ],
        (outsideX + targetX) / 2,
        wire.viaY,
        targetX < outsideX ? 'left' : 'right',
      );
    }
    return routed(
      [
        { x: startX, y: startY },
        { x: outsideX, y: startY },
        { x: outsideX, y: wire.viaY },
        { x: x2, y: wire.viaY },
        { x: x2, y: y2 },
      ],
      (outsideX + x2) / 2,
      wire.viaY,
      x2 < outsideX ? 'left' : 'right',
    );
  }
  if (wire.viaX !== undefined) {
    const startY = from.y + from.height * fromFraction;
    const endY = to.y + to.height * toFraction;
    const startX = wire.viaX < from.x ? from.x : from.x + from.width;
    const endX = wire.viaX < to.x ? to.x - 5 : to.x + to.width + 5;
    return routed(
      [
        { x: startX, y: startY },
        { x: wire.viaX, y: startY },
        { x: wire.viaX, y: endY },
        { x: endX, y: endY },
      ],
      wire.viaX,
      (startY + endY) / 2,
      endY < startY ? 'up' : 'down',
    );
  }
  if (from.y === to.y) {
    const leftward = from.x > to.x;
    const start = leftward ? from.x : from.x + from.width;
    const end = leftward ? to.x + to.width + 5 : to.x - 5;
    return routed(
      [
        { x: start, y: from.y + from.height / 2 },
        { x: end, y: to.y + to.height / 2 },
      ],
      (start + end) / 2,
      from.y + from.height / 2,
      leftward ? 'left' : 'right',
    );
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
  return routed(
    [
      { x: x1, y: y1 },
      { x: x1, y: mid },
      { x: x2, y: mid },
      { x: x2, y: y2 },
    ],
    (x1 + x2) / 2,
    mid,
    x1 === x2 ? 'down' : x2 < x1 ? 'left' : 'right',
  );
}
export function forkGeometry(
  fork: TreeFork,
  layout: TreeLayout,
): {
  trunk: string;
  branches: { key: string; x: number; color: string; path: string }[];
  junctions: TreePoint[];
  mergePath?: string;
} {
  if (layout.source) {
    const source = forkGeometry(fork, layout.source);
    return {
      ...source,
      trunk: horizontalPath(source.trunk, layout),
      mergePath: source.mergePath
        ? horizontalPath(source.mergePath, layout)
        : undefined,
      branches: source.branches.map((b) => ({
        ...b,
        path: horizontalPath(b.path, layout),
      })),
      junctions: source.junctions.map((p) => horizontalPoint(p, layout)),
    };
  }
  const from = layout.tiles.find((t) => t.key === fork.from);
  const targets = fork.targets.map((key) =>
    layout.tiles.find((t) => t.key === key),
  );
  if (!from || targets.some((t) => !t))
    throw new Error('Missing fork endpoint: ' + fork.key);
  const sourceX = from.x + from.width / 2;
  const branches = targets.map((t) => ({
    key: t!.key,
    x: t!.x + t!.width / 2,
    color: t!.color,
    path: `M ${t!.x + t!.width / 2} ${fork.busY} V ${t!.y - 5}`,
  }));
  const junctionXs = [...new Set([sourceX, ...branches.map((b) => b.x)])];
  const merge = fork.merge;
  let mergePath: string | undefined;
  const mergeJunctions: TreePoint[] = [];
  if (
    merge &&
    (layout.wires.some((w) => w.from === merge.area) ||
      layout.joins?.some((j) => j.inputs.includes(merge.area)))
  ) {
    const inputs = merge.inputs.map(
      (key) =>
        layout.areas?.find((a) => a.key === key) ||
        layout.tiles.find((t) => t.key === key)!,
    );
    const centers = [
      ...new Set([merge.x, ...inputs.map((a) => a.x + a.width / 2)]),
    ];
    const busY = merge.y - 40;
    mergePath = [
      ...inputs.map(
        (a) => `M ${a.x + a.width / 2} ${a.y + a.height + 3} V ${busY}`,
      ),
      `M ${Math.min(...centers)} ${busY} H ${Math.max(...centers)}`,
      `M ${merge.x} ${busY} V ${merge.y + 3}`,
    ].join(' ');
    mergeJunctions.push(...centers.map((x) => ({ x, y: busY })));
  }
  return {
    trunk: `M ${sourceX} ${from.y + from.height + 3} V ${fork.busY} M ${Math.min(...junctionXs)} ${fork.busY} H ${Math.max(...junctionXs)}`,
    branches,
    junctions: [
      ...junctionXs.map((x) => ({ x, y: fork.busY })),
      ...mergeJunctions,
    ],
    mergePath,
  };
}
export function joinJunctions(join: TreeJoin, layout: TreeLayout): TreePoint[] {
  if (layout.source)
    return joinJunctions(
      layout.source.joins!.find((j) => j.edge === join.edge)!,
      layout.source,
    ).map((p) => horizontalPoint(p, layout));
  const x = join.inputs.map((key) => {
    const r =
      layout.regions?.find((r) => r.key === key) ||
      layout.areas?.find((r) => r.key === key) ||
      layout.tiles.find((t) => t.key === key)!;
    return r.x + r.width / 2;
  });
  return [...new Set([...x, join.x])].map((x) => ({ x, y: join.y - 25 }));
}
export function joinGeometry(join: TreeJoin, layout: TreeLayout): string {
  if (layout.source)
    return horizontalPath(
      joinGeometry(
        layout.source.joins!.find((j) => j.edge === join.edge)!,
        layout.source,
      ),
      layout,
    );
  const inputs = join.inputs.map(
    (key) =>
      layout.regions?.find((r) => r.key === key) ||
      layout.areas?.find((r) => r.key === key) ||
      layout.tiles.find((t) => t.key === key)!,
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

import type { Content } from './content-types';
import type {
  TreeLayout,
  TreeExpansion,
  TreeTile,
  TreeWire,
  TreeFork,
} from './tree-types';
import { routeColors } from './map-palette.ts';
import { expandedTreeLayout } from './expanded-tree-layout.ts';
import { phoneOverviewLayout } from './phone-overview-layout.ts';
import { horizontalTreeLayout } from './horizontal-tree-layout.ts';

export function treeLayout(
  data: Content,
  view: string,
  expanded: boolean | TreeExpansion = false,
  compact = false,
  phoneWidth?: number,
  phoneSummary = true,
): TreeLayout {
  const layout = verticalTreeLayout(data, view, expanded);
  if (
    phoneSummary &&
    view === 'overview' &&
    expanded === false &&
    phoneWidth !== undefined
  )
    return phoneOverviewLayout(layout, phoneWidth);
  if (view !== 'overview' && data.routes.some((route) => route.id === view))
    addScenarioPresent(layout, data, view);
  return horizontalTreeLayout(layout, compact, phoneWidth !== undefined);
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
  const shift = 216;
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
    y: top - 160,
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
      busY: top - 40,
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

import type { Content } from './content-types';
import type { TreeLayout, TreeTile } from './tree-layout';

type Bounds = { key: string; x: number; y: number; width: number; height: number };
const GAP = 28;
const CARD = 148;

// Containment describes a decomposition; it never draws a causal arrow between siblings.
export function expandedTreeLayout(
  data: Content,
  view: string,
  expanded: boolean,
  colors: Record<string, string>,
): TreeLayout {
  const layout: TreeLayout = { width: 1200, height: 0, tiles: [], wires: [], regions: [], joins: [], forks: [] };
  const color = (route: string) => colors[route] || '#7963aa';
  function node(id: string, x: number, y: number, width: number, route: string, descend = expanded): Bounds {
    const graph = descend && data.nodes[id].subgraph ? data.graphs[data.nodes[id].subgraph!] : undefined;
    const hasChildren = graph && ['all', 'any'].includes(graph.mode);
    const card: TreeTile = { key: id, node: id, x, y, width, height: CARD, color: color(route), kind: 'node' };
    layout.tiles.push(card);
    if (!hasChildren) return card;
    let cursor = y + CARD + 48;
    for (const child of graph.nodes) {
      const result = node(child, x + 16, cursor, width - 32, route);
      cursor += result.height + 16;
    }
    const region = {
      key: 'group-' + id, node: id, x: x - 10, y: y - 10, width: width + 20,
      height: cursor - y + 10, labelY: y + CARD + 8,
      mode: graph.mode as 'all' | 'any', color: color(route),
      edge: Object.values(data.edges).find((e) => e.to === id && e.requires?.length === graph.nodes.length && e.requires.every((n) => graph.nodes.includes(n)))?.id,
    };
    layout.regions!.push(region);
    return region;
  }
  function wire(from: string, to: string, route: string, edge?: string, reference = false) {
    const relation = edge ? data.edges[edge].relation : undefined;
    layout.wires.push({ key: from + '-' + to, from, to, color: color(route), edge, reference,
      dashed: reference || edge === 'H-T' || edge === 'R3-R2' || relation === 'influence' || relation === 'mitigation' });
  }
  function sideWire(from: string, to: string, edge: string, viaX: number, route: string) {
    wire(from, to, route, edge);
    layout.wires.at(-1)!.viaX = viaX;
  }
  function joint(edgeId: string, inputs: Bounds[], output: string, x: number, y: number, route: string) {
    const edge = data.edges[edgeId];
    // Geometry receives the same inputs as the published, reviewable condition data.
    if (!edge.requires || edge.requires.length !== inputs.length) throw new Error('Missing joint inputs: ' + edgeId);
    layout.joins!.push({ edge: edgeId, inputs: inputs.map((b) => b.key), output, x, y, color: color(route) });
  }
  function control(x: number, y: number) {
    const width = 332;
    const roots = ['C1', 'C2', 'C3'].map((id, i) => node(id, x + i * 388, y, width, 'control'));
    const firstJoinY = Math.max(...roots.map((r) => r.y + r.height)) + 58;
    const localY = firstJoinY + 50;
    joint('C3-L', roots, 'L', x + 388 + width / 2, firstJoinY, 'control');
    const local = node('L', x + 388, localY, width, 'control', false);
    const persistent = node('C4a', x, localY, width, 'control', false);
    const scale = node('C4b', x + 776, localY, width, 'control', false);
    const secondJoinY = localY + CARD + 65;
    joint('L-C4', [local, persistent, scale], 'C4', x + 388 + width / 2, secondJoinY, 'control');
    return node('C4', x + 388, secondJoinY + 50, width, 'control', false);
  }
  function work(x: number, y: number) {
    const roots = ['W1', 'W2', 'W3'].map((id, i) => node(id, x + i * 388, y, 332, 'work', false));
    joint('W1-W4', roots, 'W4', x + 554, y + CARD + 60, 'work');
    const capable = node('W4', x + 388, y + CARD + 115, 332, 'work', false);
    const distribution = node('W6', x + 776, capable.y, 332, 'work', false);
    joint('W4-W5', [capable, distribution], 'W5', x + 554, capable.y + CARD + 60, 'work');
    return node('W5', x + 388, capable.y + CARD + 115, 332, 'work', false);
  }
  function money(x: number, y: number, sharedWork: boolean) {
    const income = node('I1', x, y + 264, 380, 'money', true);
    node('I2', x, income.y + income.height + 84, 380, 'money', false);
    layout.wires.push({ key: 'I1-I2', from: income.key, to: 'I2', edge: 'I1-I2', color: color('money') });
    if (!sharedWork) node('W4', x + 448, y, 380, 'work', false);
    node('P3', x + 448, y + 264, 380, 'money', true);
    const finance = node('F3', x + 896, y + 264, 380, 'money', true);
    // In the full map W4 is shared with the work route, not duplicated in this column.
    if (!sharedWork) sideWire('W4', 'P1', 'W4-P1', x + 862, 'money');
    return finance;
  }
  function acceleration(x: number, y: number, overview: boolean) {
    if (overview) {
      const r1 = node('R1', x, y, 356, 'acceleration', false);
      const r2 = node('R2', x, y + 232, 356, 'acceleration', false);
      node('R3', x, y + 464, 356, 'acceleration', false);
      node('ASI', x, y + 696, 356, 'acceleration', false);
      const safety = node('R4', x, y + 928, 356, 'acceleration', false);
      wire(r1.key, r2.key, 'acceleration', 'R1-R2');
      wire('R2', 'R3', 'acceleration', 'R2-R3');
      sideWire('R3', 'R2', 'R3-R2', x + 390, 'acceleration');
      layout.wires.at(-1)!.toFraction = 0.28;
      sideWire('R2', 'ASI', 'R2-ASI', x - 42, 'acceleration');
      layout.wires.at(-1)!.fromFraction = 0.72;
      sideWire('R2', 'R4', 'R2-R4', x + 413, 'acceleration');
      layout.wires.at(-1)!.fromFraction = 0.72;
      layout.wires.at(-1)!.toFraction = 0.72;
      return safety;
    }
    node('R1', x, y, 332, 'acceleration', false);
    node('R2', x, y + 264, 332, 'acceleration', false);
    node('R3', x + 408, y + 264, 332, 'acceleration', false);
    node('ASI', x + 816, y + 264, 332, 'acceleration', false);
    node('R4', x, y + 552, 332, 'acceleration', false);
    node('C2', x + 408, y + 552, 332, 'control', false);
    node('W1', x + 816, y + 552, 332, 'work', false);
    const alignment = node('C1', x, y + 824, 332, 'control', false);
    for (const id of data.graphs.acceleration.edges) {
      const e = data.edges[id]; wire(e.from, e.to, 'acceleration', id);
      if (id === 'R2-ASI') {
        layout.wires.at(-1)!.viaY = y + 202;
        layout.wires.at(-1)!.sourceSide = 'left';
        layout.wires.at(-1)!.trackOffset = 20;
      }
      if (id === 'R3-R2') {
        layout.wires.at(-1)!.viaY = y + 178;
        layout.wires.at(-1)!.toFraction = 0.78;
      }
      if (['R2-R4', 'R2-C2', 'R2-W1'].includes(id)) {
        const index = ['R2-R4', 'R2-C2', 'R2-W1'].indexOf(id);
        layout.wires.at(-1)!.fromFraction = 0.2 + index * 0.3;
        layout.wires.at(-1)!.busY = y + 512 - index * 32;
      }
    }
    return alignment;
  }
  function chain(route: string, ids: string[], x: number, y: number, width = 356) {
    let cursor = y;
    let previous: string | undefined;
    let last: Bounds | undefined;
    for (const id of ids) {
      last = node(id, x, cursor, width, route);
      if (previous) {
        const edgeId = data.graphs[route].edges.find((key) => data.edges[key].from === previous && data.edges[key].to === id);
        // Connect from the group boundary, not through its contained conditions.
        const parentTile = layout.tiles.find((t) => t.key === previous)!;
        const region = layout.regions!.find((r) => r.node === previous);
        if (region) {
          layout.wires.push({ key: previous + '-' + id, from: region.key, to: id, edge: edgeId, color: color(route) });
        } else if (parentTile) wire(previous, id, route, edgeId);
      }
      cursor = last.y + last.height + 84;
      previous = id;
    }
    return last!;
  }
  function endings(x: number, y: number, includeOtherResults: boolean) {
    const harm = node('H', x, y, 356, 'interaction', false);
    const survival = node('T', x, y + CARD + 84, 356, 'interaction');
    node('E0', x + 388, survival.y, 332, 'acceleration', false);
    wire('H', 'E0', 'acceleration', 'H-E0');
    layout.wires.at(-1)!.fromFraction = 0.78;
    wire('H', 'T', 'interaction', 'H-T');
    const terminal = node('X', x, survival.y + survival.height + 84, 356, 'interaction', false);
    layout.wires.push({ key: 'T-X', from: survival.key, to: 'X', edge: 'T-X', color: color('interaction') });
    if (includeOtherResults) {
      node('G1', x - 430, y, 356, 'accidents', false);
      wire('H', 'G1', 'accidents', 'H-G1');
    }
    return { harm, terminal };
  }
  if (view === 'control') {
    const last = control(46, 56);
    const { terminal } = endings(last.x, last.y + CARD + 84, false);
    wire('C4', 'H', 'control', 'C4-H');
    layout.height = terminal.y + terminal.height + 60;
    return layout;
  }
  if (['work', 'money', 'acceleration'].includes(view)) {
    const end = view === 'work' ? work(46, 56) : view === 'money' ? money(46, 56, false) : acceleration(46, 56, false);
    layout.width = view === 'money' ? 1370 : view === 'acceleration' ? 1250 : 1200;
    layout.height = Math.max(end.y + end.height, ...layout.tiles.map((t) => t.y + t.height)) + 70;
    return layout;
  }

  // Every canonical item appears once. Shared outcomes are merged below the four risk routes.
  const routes = [
    { id: 'control', x: 46, width: 1108 },
    { id: 'misuse', x: 1246, width: 388 },
    { id: 'interaction', x: 1726, width: 356 },
    { id: 'accidents', x: 2174, width: 356 },
    { id: 'dependence', x: 2622, width: 356 },
    { id: 'acceleration', x: 3120, width: 356 },
    { id: 'work', x: 3650, width: 1108 },
    { id: 'money', x: 4850, width: 1276 },
  ];
  layout.width = 6200;
  node('NOW', 46, 32, 332, 'control', false);
  const ends: { route: string; last: Bounds }[] = [];
  for (const route of routes) {
    const headerX = route.x;
    layout.tiles.push({ key: 'route-' + route.id, graph: route.id, x: headerX, y: 220, width: 332, height: 98, color: color(route.id), kind: 'route' });
    const ids = data.graphs[route.id].nodes.filter((id) => !['H', 'T', 'X'].includes(id));
    const last = route.id === 'control' ? control(route.x, 434)
      : route.id === 'work' ? work(route.x, 434)
      : route.id === 'money' ? money(route.x, 434, true)
      : route.id === 'acceleration' ? acceleration(route.x, 434, true)
      : chain(route.id, ids, route.x, 434, route.width);
    const firstNodes = route.id === 'control' ? ['C1', 'C2', 'C3']
      : route.id === 'work' ? ['W1', 'W2', 'W3']
      : route.id === 'money' ? ['I1', 'P3', 'F3'] : [ids[0]];
    if (firstNodes.length > 1) {
      layout.forks!.push({ key: 'route-conditions-' + route.id, from: 'route-' + route.id, targets: firstNodes,
        busY: route.id === 'money' ? 506 : 374, color: color(route.id) });
    } else wire('route-' + route.id, firstNodes[0], route.id, undefined, true);
    ends.push({ route: route.id, last });
  }
  layout.forks!.push({ key: 'present-routes', from: 'NOW', targets: routes.map((r) => 'route-' + r.id), busY: 202, color: '#8b87a1' });
  const commonY = Math.max(...ends.slice(0, 4).map(({ last }) => last.y + last.height)) + 170;
  const { terminal } = endings(1500, commonY, true);
  for (const [i, { route, last }] of ends.slice(0, 4).entries()) {
    const edge = data.graphs[route].edges.find((id) => data.edges[id].to === 'H');
    wire(last.key, 'H', route, edge);
    layout.wires.at(-1)!.busY = commonY - 64 - ([1, 2].includes(i) ? 32 : 0);
    layout.wires.at(-1)!.toFraction = (i + 1) / 5;
  }
  for (const [edge, viaY] of [['R2-C2', 354], ['R4-C1', 384], ['R2-W1', 404], ['W4-P1', 642]] as const) {
    const e = data.edges[edge]; wire(e.from, e.to, 'acceleration', edge);
    layout.wires.at(-1)!.viaY = viaY;
    if (edge === 'W4-P1') layout.wires.at(-1)!.targetSide = true;
    if (edge === 'R2-C2' || edge === 'R4-C1') {
      layout.wires.at(-1)!.sourceSide = 'left';
      layout.wires.at(-1)!.trackOffset = edge === 'R2-C2' ? 20 : 106;
      layout.wires.at(-1)!.toFraction = 0.28;
    }
    if (edge === 'R2-W1') {
      layout.wires.at(-1)!.trackOffset = 98;
      layout.wires.at(-1)!.toFraction = 0.24;
    }
  }
  layout.height = Math.max(terminal.y + terminal.height, ...layout.tiles.map((t) => t.y + t.height)) + GAP * 2;
  return layout;
}

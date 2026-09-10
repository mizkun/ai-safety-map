import type { Content } from './content-types';
import type {
  TreeLayout,
  TreeTile,
  TreeArea,
  TreeExpansion,
} from './tree-layout';

type Bounds = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
const CARD = 148;
const GAP = 96;
const PAD = 88;

// Branches show alternative mechanisms. Frames contain joint conditions, not a timeline.
export function expandedTreeLayout(
  data: Content,
  view: string,
  expansion: boolean | TreeExpansion,
  colors: Record<string, string>,
): TreeLayout {
  const selection = typeof expansion === 'object' ? expansion : null;
  const expanded = expansion === true;
  const routeOpen = (id: string) =>
    !selection || view !== 'overview' || selection.routes.includes(id);
  const researchOpen = expanded || selection?.factors?.includes('acceleration');
  const researchWidth = 1450;
  const layout: TreeLayout = {
    width: 1200,
    height: 0,
    tiles: [],
    wires: [],
    regions: [],
    areas: [],
    joins: [],
    forks: [],
    factors: [],
  };
  const color = (route: string) => colors[route] || '#7963aa';
  const children = (id: string, descend?: boolean) => {
    const enabled =
      descend !== false &&
      (selection ? selection.nodes.includes(id) : (descend ?? expanded));
    const graph =
      enabled && data.nodes[id].subgraph
        ? data.graphs[data.nodes[id].subgraph!]
        : undefined;
    return graph && ['all', 'any'].includes(graph.mode) ? graph : undefined;
  };
  function measure(
    id: string,
    width = 332,
    descend?: boolean,
  ): { width: number; height: number } {
    const graph = children(id, descend);
    if (!graph) return { width, height: CARD };
    const sizes = graph.nodes.map((child) => measure(child, width));
    return {
      width:
        sizes.reduce((sum, size) => sum + size.width, 0) +
        GAP * (sizes.length - 1) +
        (graph.mode === 'all' ? PAD * 2 : 0),
      height:
        CARD +
        112 +
        Math.max(...sizes.map((size) => size.height)) +
        (graph.mode === 'all' ? 52 : 84),
    };
  }
  function node(
    id: string,
    x: number,
    y: number,
    width: number,
    route: string,
    descend?: boolean,
  ): Bounds {
    const graph = children(id, descend);
    const size = measure(id, width, descend);
    const card: TreeTile = {
      key: id,
      node: id,
      x: x + (size.width - width) / 2,
      y,
      width,
      height: CARD,
      color: color(route),
      kind: 'node',
    };
    layout.tiles.push(card);
    if (!graph) return card;
    const childY = y + CARD + 112 + (graph.mode === 'all' ? 26 : 0);
    let cursor = x + (graph.mode === 'all' ? PAD : 0);
    const descendants: Bounds[] = [];
    for (const child of graph.nodes) {
      const placed = node(child, cursor, childY, width, route);
      descendants.push(placed);
      cursor += placed.width + GAP;
    }
    const area: TreeArea = { key: 'area-' + id, node: id, x, y, ...size };
    layout.areas!.push(area);
    if (graph.mode === 'any') {
      layout.forks!.push({
        key: 'alternatives-' + id,
        from: id,
        targets: graph.nodes,
        busY: y + CARD + 56,
        color: color(route),
        alternative: true,
        merge: {
          area: area.key,
          inputs: descendants.map((r) => r.key),
          x: x + size.width / 2,
          y: y + size.height,
        },
      });
    } else {
      const group = {
        key: 'group-' + id,
        node: id,
        members: graph.nodes,
        x,
        y: childY - 26,
        width: size.width,
        height: size.height - CARD - 112,
        labelX: x + 18,
        labelY: childY - 16,
        mode: 'all' as const,
        color: color(route),
        edge: Object.values(data.edges).find(
          (e) =>
            e.to === id &&
            e.requires?.length === graph.nodes.length &&
            e.requires.every((n) => graph.nodes.includes(n)),
        )?.id,
      };
      layout.regions!.push(group);
      layout.wires.push({
        key: id + '-conditions',
        from: id,
        to: group.key,
        color: color(route),
        dashed: true,
        reference: true,
      });
    }
    return area;
  }
  function wire(
    from: string,
    to: string,
    route: string,
    edge?: string,
    reference = false,
  ) {
    const relation = edge ? data.edges[edge].relation : undefined;
    layout.wires.push({
      key: from + '-' + to,
      from,
      to,
      color: color(route),
      edge,
      reference,
      dashed:
        reference ||
        edge === 'H-T' ||
        edge === 'R3-R2' ||
        relation === 'influence' ||
        relation === 'mitigation',
    });
  }
  function sideWire(
    from: string,
    to: string,
    edge: string,
    viaX: number,
    route: string,
  ) {
    wire(from, to, route, edge);
    layout.wires.at(-1)!.viaX = viaX;
  }
  function joint(
    edgeId: string,
    inputs: Bounds[],
    output: string,
    x: number,
    y: number,
    route: string,
  ) {
    const edge = data.edges[edgeId];
    if (!edge.requires || edge.requires.length !== inputs.length)
      throw new Error('Missing joint inputs: ' + edgeId);
    layout.joins!.push({
      edge: edgeId,
      inputs: inputs.map((b) => b.key),
      output,
      x,
      y,
      color: color(route),
    });
    const left = Math.min(...inputs.map((r) => r.x)) - PAD;
    const top = Math.min(...inputs.map((r) => r.y)) - 26;
    layout.regions!.push({
      key: 'joint-group-' + edgeId,
      node: output,
      members: edge.requires,
      x: left,
      y: top,
      width: Math.max(...inputs.map((r) => r.x + r.width)) - left + PAD,
      height: Math.max(...inputs.map((r) => r.y + r.height)) - top + 26,
      labelX: left + 18,
      labelY: top + 10,
      mode: 'all',
      color: color(route),
      edge: edgeId,
    });
  }
  function row(
    ids: string[],
    x: number,
    y: number,
    route: string,
    descend?: boolean,
  ) {
    let cursor = x;
    return ids.map((id) => {
      const placed = node(id, cursor, y, 332, route, descend);
      cursor += placed.width + GAP;
      return placed;
    });
  }
  const controlWidth = () =>
    ['C1', 'C2', 'C3'].reduce((sum, id) => sum + measure(id).width, GAP * 2);
  function control(x: number, y: number) {
    const roots = row(['C1', 'C2', 'C3'], x, y, 'control');
    const center = x + controlWidth() / 2;
    const firstY = Math.max(...roots.map((r) => r.y + r.height)) + 84;
    const localY = firstY + 84;
    joint('C3-L', roots, 'L', center, firstY, 'control');
    const persistent = node('C4a', center - 594, localY, 332, 'control', false);
    const local = node('L', center - 166, localY, 332, 'control', false);
    const scale = node('C4b', center + 262, localY, 332, 'control', false);
    joint(
      'L-C4',
      [local, persistent, scale],
      'C4',
      center,
      localY + CARD + 84,
      'control',
    );
    return node('C4', center - 166, localY + CARD + 168, 332, 'control', false);
  }
  // This optional lane sits outside every AND frame. It is not a prerequisite.
  function controlContext(x: number, y: number) {
    if (!researchOpen) {
      if (view === 'control')
        layout.factors!.push({
          key: 'acceleration',
          expanded: false,
          x: x - 400,
          y,
          width: 0,
          height: 340,
        });
      return control(x, y);
    }
    acceleration(x, y, true);
    const last = control(x + researchWidth, y + 464);
    wire('R2', 'C2', 'acceleration', 'R2-C2');
    layout.wires.at(-1)!.fromFraction = 0.88;
    layout.wires.at(-1)!.busY = y + 400;
    layout.wires.at(-1)!.toFraction = 0.28;
    wire('R4', 'C1', 'acceleration', 'R4-C1');
    return last;
  }
  function work(x: number, y: number) {
    const roots = row(['W1', 'W2'], x, y, 'work', false);
    const center = x + 380;
    joint('W1-W4', roots, 'W4', center, y + CARD + 84, 'work');
    const capable = node(
      'W4',
      center - 166,
      y + CARD + 168,
      332,
      'work',
      false,
    );
    const adoption = node(
      'W3',
      center - 166,
      capable.y + CARD + 160,
      332,
      'work',
      false,
    );
    const distribution = node(
      'W6',
      center + 262,
      adoption.y,
      332,
      'work',
      false,
    );
    wire('W4', 'W3', 'work', 'W4-W3');
    joint(
      'W3-W5',
      [adoption, distribution],
      'W5',
      center,
      adoption.y + CARD + 84,
      'work',
    );
    const optional = node(
      'W5',
      center - 166,
      adoption.y + CARD + 168,
      332,
      'work',
      false,
    );
    node('W7', center + 262, optional.y, 332, 'work', false);
    wire('W3', 'W7', 'work', 'W3-W7');
    layout.wires.at(-1)!.fromFraction = 0.78;
    node('W9', center + 690, optional.y, 332, 'work', false);
    wire('W3', 'W9', 'work', 'W3-W9');
    layout.wires.at(-1)!.fromFraction = 0.92;
    layout.wires.at(-1)!.busY = adoption.y + CARD + 54;
    const choice = node(
      'W8',
      optional.x,
      optional.y + CARD + 100,
      332,
      'work',
      false,
    );
    wire('W5', 'W8', 'work', 'W5-W8');
    return choice;
  }
  const misuseWidth = () =>
    ['M1', 'M2', 'M3'].reduce((sum, id) => sum + measure(id).width, GAP * 2);
  function misuse(x: number, y: number): Bounds {
    const roots = row(['M1', 'M2', 'M3'], x, y, 'misuse');
    const center = x + misuseWidth() / 2;
    const joinY = Math.max(...roots.map((r) => r.y + r.height)) + 84;
    joint('M3-H', roots, 'H', center, joinY, 'misuse');
    return {
      key: 'misuse-output',
      x: center - 166,
      y: joinY,
      width: 332,
      height: 0,
    };
  }
  const moneyWidth = () =>
    ['I1', 'P3', 'F3'].reduce(
      (sum, id) =>
        sum + Math.max(id === 'F3' ? 760 : 0, measure(id, 332, true).width),
      GAP * 2,
    );
  function money(x: number, y: number, sharedWork: boolean) {
    const income = node('I1', x, y + 264, 332, 'money', true);
    node(
      'I2',
      x + (income.width - 332) / 2,
      income.y + income.height + 100,
      332,
      'money',
      false,
    );
    wire(income.key, 'I2', 'money', 'I1-I2');
    const moneyX = x + income.width + GAP;
    const moneySize = measure('P3', 332, true);
    if (!sharedWork)
      node('W4', moneyX + (moneySize.width - 332) / 2, y, 332, 'work', false);
    const allocation = node('P3', moneyX, y + 264, 332, 'money', true);
    node(
      'P4',
      moneyX + (allocation.width - 332) / 2,
      allocation.y + allocation.height + 100,
      332,
      'money',
      false,
    );
    wire(allocation.key, 'P4', 'money', 'P3-P4');
    const financeSize = measure('F3', 332, true);
    const finance = node(
      'F3',
      moneyX +
        moneySize.width +
        GAP +
        Math.max(0, (760 - financeSize.width) / 2),
      y + 264,
      332,
      'money',
      true,
    );
    const trust = node(
      'F5',
      finance.x + (finance.width - 332) / 2,
      finance.y + finance.height + 100,
      332,
      'money',
      false,
    );
    wire(finance.key, 'F5', 'money', 'F3-F5');
    row(
      ['F6', 'F7'],
      finance.x + (finance.width - 760) / 2,
      trust.y + CARD + 100,
      'money',
      false,
    );
    wire('F5', 'F6', 'money', 'F5-F6');
    layout.wires.at(-1)!.fromFraction = 0.3;
    wire('F5', 'F7', 'money', 'F5-F7');
    layout.wires.at(-1)!.fromFraction = 0.7;
    if (!sharedWork) {
      wire(
        'W4',
        layout.tiles.some((t) => t.node === 'P1') ? 'P1' : 'P3',
        'money',
        'W4-P1',
      );
      layout.wires.at(-1)!.viaY = y + 196;
      layout.wires.at(-1)!.sourceSide = 'left';
    }
    return finance;
  }
  function acceleration(x: number, y: number, overview: boolean) {
    if (overview) {
      const r1 = node('R1', x + 440, y, 356, 'acceleration', false);
      const r2 = node('R2', x + 440, y + 232, 356, 'acceleration', false);
      node('R3', x, y + 464, 356, 'acceleration', false);
      node('ASI', x + 440, y + 464, 356, 'acceleration', false);
      const safety = node('R4', x + 880, y + 464, 356, 'acceleration', false);
      layout.factors!.push({
        key: 'acceleration',
        expanded: true,
        x: x - 108,
        y: y - 24,
        width: 1416,
        height: 670,
      });
      wire(r1.key, r2.key, 'acceleration', 'R1-R2');
      wire('R2', 'R3', 'acceleration', 'R2-R3');
      layout.wires.at(-1)!.fromFraction = 0.18;
      layout.wires.at(-1)!.busY = y + 416;
      sideWire('R3', 'R2', 'R3-R2', x - 60, 'acceleration');
      layout.wires.at(-1)!.toFraction = 0.28;
      wire('R2', 'ASI', 'acceleration', 'R2-ASI');
      wire('R2', 'R4', 'acceleration', 'R2-R4');
      layout.wires.at(-1)!.fromFraction = 0.72;
      layout.wires.at(-1)!.busY = y + 438;
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
      const e = data.edges[id];
      wire(e.from, e.to, 'acceleration', id);
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
  function chain(
    route: string,
    ids: string[],
    x: number,
    y: number,
    width = 332,
  ) {
    const laneWidth = Math.max(...ids.map((id) => measure(id, width).width));
    let cursor = y;
    let previous: Bounds | undefined;
    for (const id of ids) {
      const last = node(
        id,
        x + (laneWidth - measure(id, width).width) / 2,
        cursor,
        width,
        route,
      );
      if (previous) {
        const canonical =
          layout.areas!.find((r) => r.key === previous!.key)?.node ||
          previous.key;
        const edge = data.graphs[route].edges.find(
          (key) =>
            data.edges[key].from === canonical && data.edges[key].to === id,
        );
        wire(previous.key, id, route, edge);
      }
      cursor = last.y + last.height + 100;
      previous = last;
    }
    return previous!;
  }
  function endings(x: number, y: number, includeOtherResults: boolean) {
    const size = measure('T', 332);
    const left = x - (size.width - 332) / 2;
    const harm = node('H', x, y, 332, 'interaction', false);
    const survival = node('T', left, y + CARD + 100, 332, 'interaction');
    node('E0', left + size.width + 144, survival.y, 332, 'acceleration', false);
    wire('H', 'E0', 'acceleration', 'H-E0');
    layout.wires.at(-1)!.fromFraction = 0.78;
    wire('H', 'T', 'interaction', 'H-T');
    const terminal = node(
      'X',
      x,
      survival.y + survival.height + 100,
      332,
      'interaction',
      false,
    );
    wire(survival.key, 'X', 'interaction', 'T-X');
    if (includeOtherResults) {
      node('G1', left - 476, y, 332, 'accidents', false);
      wire('H', 'G1', 'accidents', 'H-G1');
    }
    return { harm, terminal };
  }
  function finish() {
    const bounds = [
      ...layout.tiles,
      ...layout.regions!,
      ...layout.areas!,
      ...layout.factors!,
    ];
    layout.width = Math.max(
      layout.width,
      ...bounds.map((r) => r.x + r.width + 100),
    );
    layout.height = Math.max(...bounds.map((r) => r.y + r.height)) + 100;
    return layout;
  }
  const graph = data.graphs[view];
  if (graph?.parent && ['all', 'any'].includes(graph.mode)) {
    let ancestor = graph.parent;
    const visited = new Set<string>();
    while (!visited.has(ancestor)) {
      visited.add(ancestor);
      const route = Object.keys(colors).find((id) =>
        data.graphs[id]?.nodes.includes(ancestor),
      );
      if (route) {
        node(graph.parent, 100, 56, 332, route, true);
        return finish();
      }
      const parent = Object.values(data.graphs).find((g) =>
        g.nodes.includes(ancestor),
      )?.parent;
      if (!parent) break;
      ancestor = parent;
    }
    node(graph.parent, 100, 56, 332, 'control', true);
    return finish();
  }
  if (view === 'control') {
    const last = controlContext(100, 76);
    endings(last.x, last.y + CARD + 100, false);
    wire('C4', 'H', 'control', 'C4-H');
    return finish();
  }
  if (view === 'misuse') {
    const last = misuse(100, 76);
    endings(last.x, last.y + 100, false);
    return finish();
  }
  if (['work', 'money', 'acceleration'].includes(view)) {
    if (view === 'work') {
      work(
        100 + (researchOpen ? researchWidth : 0),
        76 + (researchOpen ? 464 : 0),
      );
      if (researchOpen) {
        acceleration(100, 76, true);
        wire('R2', 'W1', 'acceleration', 'R2-W1');
        layout.wires.at(-1)!.fromFraction = 0.88;
        layout.wires.at(-1)!.busY = 476;
        layout.wires.at(-1)!.toFraction = 0.24;
      } else
        layout.factors!.push({
          key: 'acceleration',
          expanded: false,
          x: -300,
          y: 76,
          width: 0,
          height: 340,
        });
    } else if (view === 'money') money(100, 76, false);
    else acceleration(100, 76, false);
    return finish();
  }
  if (graph?.mode === 'sequence') {
    const ids = graph.nodes.filter((id) => !['H', 'T', 'X', 'E0'].includes(id));
    const laneWidth = Math.max(...ids.map((id) => measure(id).width));
    const inset = graph.nodes.includes('H')
      ? (view === 'accidents' ? 476 : 0) +
        Math.max(0, (measure('T').width - laneWidth) / 2)
      : 0;
    const last = chain(view, ids, 100 + inset, 76);
    if (graph.nodes.includes('H')) {
      endings(last.x, last.y + last.height + 100, view === 'accidents');
      const edge = graph.edges.find((id) => data.edges[id].to === 'H');
      wire(last.key, 'H', view, edge);
    }
    return finish();
  }
  const ids = [
    'control',
    'misuse',
    'interaction',
    'accidents',
    'dependence',
    'work',
    'money',
  ];
  let cursor = 100;
  const routes = ids.map((id) => {
    const nodes = data.graphs[id].nodes.filter(
      (n) => !['H', 'T', 'X'].includes(n),
    );
    const width = !routeOpen(id)
      ? 332
      : id === 'control'
        ? controlWidth() + (researchOpen ? researchWidth : 0)
        : id === 'misuse'
          ? misuseWidth()
          : id === 'work'
            ? 1450
            : id === 'money'
              ? moneyWidth()
              : Math.max(...nodes.map((n) => measure(n).width));
    const route = { id, x: cursor + PAD, width, nodes };
    cursor += width + PAD * 2 + 170;
    return route;
  });
  layout.width = cursor;
  node('NOW', 100, 32, 332, 'control', false);
  const ends: { route: string; last: Bounds }[] = [];
  for (const route of routes) {
    const { id, x, width, nodes } = route;
    layout.tiles.push({
      key: 'route-' + id,
      graph: id,
      x: x + (width - 332) / 2,
      y: 220,
      width: 332,
      height: 98,
      color: color(id),
      kind: 'route',
    });
    if (!routeOpen(id)) {
      ends.push({ route: id, last: layout.tiles.at(-1)! });
      continue;
    }
    const last =
      id === 'control'
        ? controlContext(x, 484)
        : id === 'misuse'
          ? misuse(x, 484)
          : id === 'work'
            ? work(x, 484)
            : id === 'money'
              ? money(x, 484, true)
              : chain(id, nodes, x, 484);
    const first =
      id === 'control'
        ? ['C1', 'C2', 'C3']
        : id === 'misuse'
          ? ['M1', 'M2', 'M3']
          : id === 'work'
            ? ['W1', 'W2']
            : id === 'money'
              ? ['I1', 'P3', 'F3']
              : [nodes[0]];
    if (first.length > 1)
      layout.forks!.push({
        key: 'route-conditions-' + id,
        from: 'route-' + id,
        targets: first,
        busY: id === 'money' ? 600 : 430,
        color: color(id),
      });
    else wire('route-' + id, first[0], id, undefined, true);
    ends.push({ route: id, last });
  }
  layout.forks!.push({
    key: 'present-routes',
    from: 'NOW',
    targets: routes.map((r) => 'route-' + r.id),
    busY: 202,
    color: '#8b87a1',
  });
  const commonY =
    Math.max(...ends.slice(0, 4).map(({ last }) => last.y + last.height)) + 200;
  const harmX = routes[1].x + routes[1].width / 2 - 166;
  endings(harmX, commonY, true);
  for (const [i, { route, last }] of ends.slice(0, 4).entries()) {
    if (route === 'misuse' && routeOpen(route)) continue; // Its three inputs meet at the explicit AND join.
    const edge = data.graphs[route].edges.find(
      (id) => data.edges[id].to === 'H',
    );
    wire(last.key, 'H', route, edge);
    layout.wires.at(-1)!.busY = commonY - 64 - i * 24;
    layout.wires.at(-1)!.toFraction = (i + 1) / 5;
  }
  if (!routeOpen('dependence')) {
    const route = routes.find((r) => r.id === 'dependence')!;
    node('E1', route.x, commonY, 332, 'dependence', false);
    wire('route-dependence', 'E1', 'dependence', 'D3-E1');
  }
  const visibleKey = (id: string) => {
    let ancestor = id;
    const seen = new Set<string>();
    while (!seen.has(ancestor)) {
      if (layout.tiles.some((t) => t.node === ancestor)) return ancestor;
      seen.add(ancestor);
      const parent = Object.values(data.graphs).find(
        (g) => g.parent && g.nodes.includes(ancestor),
      )?.parent;
      if (!parent) break;
      ancestor = parent;
    }
    const route = routes.find((r) =>
      data.graphs[r.id].nodes.includes(ancestor),
    );
    return route ? 'route-' + route.id : id;
  };
  for (const [edge, viaY] of [
    ['R2-W1', 404],
    ['W4-P1', 650],
  ] as const) {
    if (edge === 'R2-W1' && !layout.tiles.some((t) => t.node === 'R2'))
      continue;
    if (edge === 'W4-P1' && (!routeOpen('work') || !routeOpen('money')))
      continue;
    const e = data.edges[edge];
    wire(visibleKey(e.from), visibleKey(e.to), 'acceleration', edge);
    layout.wires.at(-1)!.viaY = viaY;
    if (edge === 'R2-W1') {
      layout.wires.at(-1)!.trackOffset = 98;
      layout.wires.at(-1)!.toFraction = 0.24;
    }
  }
  return finish();
}

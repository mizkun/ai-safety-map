import type { Content } from './content-types';

export type TourStop = {
  key: string;
  kind: 'start' | 'chapter' | 'node' | 'finish';
  view: string;
  nodes: string[];
  chapter: number;
  node?: string;
};

// The tour has two navigation levels. Chapter introductions are steps too;
// moving between chapters inside a scenario is not a new scenario.
export function tourNavigation(stops: TourStop[], index: number) {
  const stop = stops[index];
  const scenarios = [
    ...new Set(stops.filter((s) => s.kind === 'chapter').map((s) => s.view)),
  ];
  const steps = stops
    .map((step, position) => ({ step, position }))
    .filter(
      ({ step }) =>
        step.view === stop.view && ['chapter', 'node'].includes(step.kind),
    );
  const next = stops[index + 1];
  const nextKind = !next
    ? 'exit'
    : stop.kind === 'start'
      ? 'begin'
      : next.kind === 'finish'
        ? 'finish'
        : next.view !== stop.view
          ? 'scenario'
          : 'step';
  return {
    steps,
    stepIndex: steps.findIndex((s) => s.position === index),
    scenarioIndex: scenarios.indexOf(stop.view),
    scenarioCount: scenarios.length,
    nextKind,
  };
}

// If a scene shows an AND transition, keep every co-input in the picture.
export function tourContext(
  data: Content,
  targets: string[],
  detail = false,
  view?: string,
) {
  const context = new Set(targets);
  if (detail)
    for (const id of targets) {
      const graph = data.graphs[data.nodes[id]?.subgraph || ''];
      if (graph && ['all', 'any', 'sequence'].includes(graph.mode))
        for (const child of graph.nodes) context.add(child);
      for (const parent of Object.values(data.nodes)) {
        const siblings = data.graphs[parent.subgraph || ''];
        if (
          siblings &&
          ['all', 'any', 'sequence'].includes(siblings.mode) &&
          siblings.nodes.includes(id)
        ) {
          context.add(parent.id);
          for (const sibling of siblings.nodes) context.add(sibling);
        }
      }
    }
  for (const edge of Object.values(data.edges))
    if (
      targets.includes(edge.to) &&
      (!detail || !view || data.graphs[view]?.edges.includes(edge.id)) &&
      (detail || edge.requires?.some((id) => targets.includes(id)))
    )
      for (const id of edge.requires || []) context.add(id);
  return [...context];
}

export function tourKeyDirection(
  key: string,
  blocked: boolean,
  interactive: boolean,
) {
  if (blocked || interactive) return 0;
  return key === 'Enter' || key === 'ArrowRight'
    ? 1
    : key === 'ArrowLeft'
      ? -1
      : 0;
}

// Reading order is not a new causal path. Chapter node sets preserve joint conditions.
export function tourStops(data: Content): TourStop[] {
  return [
    {
      key: 'start',
      kind: 'start',
      view: 'overview',
      nodes: ['NOW'],
      chapter: 0,
    },
    ...data.routes
      .filter((route) => route.role !== 'factor')
      .flatMap((route) => {
        const seen = new Set<string>();
        function visit(id: string): string[] {
          if (seen.has(id)) return [];
          seen.add(id);
          const graph = data.graphs[data.nodes[id]?.subgraph || ''];
          return [
            id,
            ...(graph && ['all', 'any', 'sequence'].includes(graph.mode)
              ? graph.nodes.flatMap(visit)
              : []),
          ];
        }
        return (data.stories[route.id]?.chapters || []).flatMap(
          (chapter, index) => [
            {
              key: route.id + ':' + index,
              kind: 'chapter' as const,
              view: route.id,
              nodes: chapter.nodes,
              chapter: index,
            },
            ...chapter.nodes.flatMap(visit).map((id) => ({
              key: route.id + ':' + index + ':' + id,
              kind: 'node' as const,
              view: route.id,
              nodes: [id],
              node: id,
              chapter: index,
            })),
          ],
        );
      }),
    { key: 'finish', kind: 'finish', view: 'overview', nodes: [], chapter: 0 },
  ];
}

// Open only the ancestors needed to reveal the current chapter's conditions.
export function tourExpansion(data: Content, targets: string[]): string[] {
  const parents = new Map<string, string>();
  for (const node of Object.values(data.nodes)) {
    const graph = node.subgraph && data.graphs[node.subgraph];
    if (graph && ['all', 'any', 'sequence'].includes(graph.mode))
      for (const child of graph.nodes) parents.set(child, node.id);
  }
  const expanded = new Set<string>();
  for (const target of targets) {
    let parent = parents.get(target);
    while (parent && !expanded.has(parent)) {
      expanded.add(parent);
      parent = parents.get(parent);
    }
  }
  return [...expanded];
}

type Rect = { x: number; y: number; width: number; height: number };
export function tourCamera(
  tiles: Rect[],
  viewport: { width: number; height: number },
  layout: { width: number; height: number },
  readableAnchor?: Rect,
) {
  if (!tiles.length) return null;
  const left = Math.min(...tiles.map((t) => t.x));
  const top = Math.min(...tiles.map((t) => t.y));
  const width = Math.max(...tiles.map((t) => t.x + t.width)) - left;
  const height = Math.max(...tiles.map((t) => t.y + t.height)) - top;
  let scale = Math.max(
    0.08,
    Math.min(1, (viewport.width - 40) / width, (viewport.height - 40) / height),
  );
  let centerX = left + width / 2;
  let centerY = top + height / 2;
  // A short phone pane cannot fit distant chapter nodes at reading size.
  // Start at its first subject; the complete graph and minimap remain available.
  if (readableAnchor && scale < 0.65) {
    scale = Math.max(
      0.08,
      Math.min(
        0.65,
        (viewport.width - 32) / readableAnchor.width,
        (viewport.height - 32) / readableAnchor.height,
      ),
    );
    centerX = readableAnchor.x + readableAnchor.width / 2;
    centerY = readableAnchor.y + readableAnchor.height / 2;
  }
  const centering = Math.max(0, (viewport.width - layout.width * scale) / 2);
  return {
    scale,
    left: Math.max(
      0,
      Math.min(
        layout.width * scale - viewport.width,
        centerX * scale + centering - viewport.width / 2,
      ),
    ),
    top: Math.max(
      0,
      Math.min(
        layout.height * scale - viewport.height,
        centerY * scale - viewport.height / 2,
      ),
    ),
  };
}

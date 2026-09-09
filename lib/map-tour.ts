import type { Content } from './content-types';

export type TourStop = {
  key: string;
  kind: 'start' | 'chapter' | 'finish';
  view: string;
  nodes: string[];
  chapter: number;
};

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
    ...data.routes.flatMap((route) =>
      (data.stories[route.id]?.chapters || []).map((chapter, index) => ({
        key: route.id + ':' + index,
        kind: 'chapter' as const,
        view: route.id,
        nodes: chapter.nodes,
        chapter: index,
      })),
    ),
    { key: 'finish', kind: 'finish', view: 'overview', nodes: [], chapter: 0 },
  ];
}

// Open only the ancestors needed to reveal the current chapter's conditions.
export function tourExpansion(data: Content, targets: string[]): string[] {
  const parents = new Map<string, string>();
  for (const node of Object.values(data.nodes)) {
    const graph = node.subgraph && data.graphs[node.subgraph];
    if (graph && ['all', 'any'].includes(graph.mode))
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
) {
  if (!tiles.length) return null;
  const left = Math.min(...tiles.map((t) => t.x));
  const top = Math.min(...tiles.map((t) => t.y));
  const width = Math.max(...tiles.map((t) => t.x + t.width)) - left;
  const height = Math.max(...tiles.map((t) => t.y + t.height)) - top;
  const scale = Math.max(
    0.08,
    Math.min(1, (viewport.width - 40) / width, (viewport.height - 40) / height),
  );
  const centering = Math.max(0, (viewport.width - layout.width * scale) / 2);
  return {
    scale,
    left: Math.max(
      0,
      Math.min(
        layout.width * scale - viewport.width,
        (left + width / 2) * scale + centering - viewport.width / 2,
      ),
    ),
    top: Math.max(
      0,
      Math.min(
        layout.height * scale - viewport.height,
        (top + height / 2) * scale - viewport.height / 2,
      ),
    ),
  };
}

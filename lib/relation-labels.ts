import { forkGeometry } from './tree-geometry.ts';
import type { TreeLayout } from './tree-types';

type Rect = { x: number; y: number; width: number; height: number };
export type RelationLabel = Rect & {
  key: string;
  mode: 'all' | 'any';
  edge?: string;
  color: string;
};
export function overlaps(a: Rect, b: Rect, gap = 0) {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}

// Labels use screen-pixel bounds, just like their CSS. Long explanations belong
// in tooltips and the guide, so zooming cannot make them cover neighboring cards.
export function relationLabels(
  layout: TreeLayout,
  scale: number,
): RelationLabel[] {
  if (scale < 0.24) return [];
  const cards = layout.tiles.map((r) => ({
    x: r.x * scale,
    y: r.y * scale,
    width: r.width * scale,
    height: r.height * scale,
  }));
  const labels: RelationLabel[] = [];
  const place = (
    label: Omit<RelationLabel, 'x' | 'y'>,
    candidates: { x: number; y: number }[],
  ) => {
    const p = candidates.find((point) => {
      const box = { ...label, ...point };
      return (
        point.x >= 0 &&
        point.y >= 0 &&
        !cards.some((r) => overlaps(box, r, 4)) &&
        !labels.some((r) => overlaps(box, r, 4))
      );
    });
    if (p) labels.push({ ...label, ...p });
  };
  for (const r of [...(layout.regions || [])].sort(
    (a, b) => a.width * a.height - b.width * b.height,
  )) {
    const xs = [
      r.x * scale + 8,
      (r.x + r.width) * scale - 48,
      (r.x + r.width / 2) * scale - 20,
    ];
    place(
      {
        key: r.key,
        mode: 'all',
        edge: r.edge,
        color: r.color,
        width: 40,
        height: 22,
      },
      [Math.max(2, r.y * scale - 11), r.y * scale - 26].flatMap((y) =>
        xs.map((x) => ({ x, y })),
      ),
    );
  }
  for (const f of layout.forks || []) {
    if (!f.alternative) continue;
    const from = layout.tiles.find((t) => t.key === f.from)!;
    const geometry = forkGeometry(f, layout);
    const vertical = layout.flow !== 'horizontal';
    const target = vertical
      ? from.x + from.width / 2
      : from.y + from.height / 2;
    const p = geometry.junctions.reduce((best, p) =>
      Math.abs((vertical ? p.x : p.y) - target) <
      Math.abs((vertical ? best.x : best.y) - target)
        ? p
        : best,
    );
    place({ key: f.key, mode: 'any', color: f.color, width: 32, height: 22 }, [
      { x: p.x * scale - 16, y: p.y * scale - 11 },
      { x: p.x * scale - 16, y: p.y * scale - 30 },
    ]);
  }
  return labels;
}

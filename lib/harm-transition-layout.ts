import type { Content } from './content-types';
import type { TreeLayout, TreeTile } from './tree-layout';

// Show the existing conditional connection as a readable stop along the line.
// This does not introduce another event, a new causal edge, or a new AND input.
export function addHarmTransitions(layout: TreeLayout, data: Content) {
  const harm = layout.tiles.find((t) => t.node === 'H');
  if (!harm) return;
  const incoming = Object.values(data.edges).filter(
    (e) =>
      e.to === 'H' &&
      (layout.wires.some((w) => w.edge === e.id && w.to === harm.key) ||
        layout.joins?.some((j) => j.edge === e.id && j.output === harm.key)),
  );
  if (!incoming.length) return;
  const cut = harm.y;
  const gap = 460;
  for (const tile of layout.tiles) if (tile.y >= cut) tile.y += gap;
  for (const rect of [
    ...(layout.areas || []),
    ...(layout.regions || []),
    ...(layout.factors || []),
  ]) {
    if (rect.y >= cut) rect.y += gap;
    else if (rect.y + rect.height > cut) rect.height += gap;
  }
  for (const region of layout.regions || [])
    if (region.labelY >= cut) region.labelY += gap;
  for (const join of layout.joins || []) if (join.y >= cut) join.y += gap;
  for (const fork of layout.forks || []) {
    if (fork.busY >= cut) fork.busY += gap;
    if (fork.merge && fork.merge.y >= cut) fork.merge.y += gap;
  }
  for (const wire of layout.wires) {
    if (wire.busY !== undefined && wire.busY >= cut) wire.busY += gap;
    if (wire.viaY !== undefined && wire.viaY >= cut) wire.viaY += gap;
  }
  for (const [index, edge] of incoming.entries()) {
    const wire = layout.wires.find(
      (w) => w.edge === edge.id && w.to === harm.key,
    );
    const join = layout.joins?.find(
      (j) => j.edge === edge.id && j.output === harm.key,
    );
    const from =
      layout.tiles.find((t) => t.key === wire?.from) ||
      layout.areas?.find((a) => a.key === wire?.from);
    const center =
      join?.x ?? (from ? from.x + from.width / 2 : harm.x + harm.width / 2);
    const color = wire?.color || join?.color || harm.color;
    const bridge: TreeTile = {
      key: 'transition-' + edge.id,
      edge: edge.id,
      kind: 'transition',
      x: center - 280,
      y: cut + 40,
      width: 560,
      height: 280,
      color,
    };
    layout.tiles.push(bridge);
    if (wire) {
      wire.to = bridge.key;
      delete wire.busY;
      delete wire.toFraction;
    }
    if (join) join.output = bridge.key;
    layout.wires.push({
      key: bridge.key + '-out',
      from: bridge.key,
      to: harm.key,
      edge: edge.id,
      color,
      reference: true,
      busY: harm.y - 50 - index * 24,
      toFraction:
        incoming.length === 1 ? 0.5 : (index + 1) / (incoming.length + 1),
    });
  }
  layout.height += gap;
  layout.width = Math.max(
    layout.width,
    ...layout.tiles.map((t) => t.x + t.width + 100),
  );
}

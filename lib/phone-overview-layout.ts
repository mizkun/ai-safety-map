import type { TreeLayout, TreeTile } from './tree-layout';

const phoneLabels: Record<string, TreeTile['shortLabel']> = {
  control: 'phoneControl',
  misuse: 'phoneMisuse',
  interaction: 'phoneMilitary',
  accidents: 'phoneAccidents',
  dependence: 'phoneDependence',
  work: 'phoneWork',
  money: 'phoneMoney',
  catastrophe: 'phoneCatastrophe',
  agency: 'phoneAgency',
  survival: 'phoneSurvival',
  recovery: 'phoneRecovery',
};

// The phone summary reads downwards. Staggered rows leave clear vertical
// channels between cards while keeping the canonical nodes and edges intact.
export function phoneOverviewLayout(
  base: TreeLayout,
  viewportWidth: number,
): TreeLayout {
  const layout: TreeLayout = {
    ...base,
    tiles: base.tiles.map((t) => ({ ...t, shortLabel: phoneLabels[t.key] })),
    wires: base.wires.map((w) => ({ ...w })),
    forks: base.forks?.map((f) => ({ ...f })),
    entryView: 'phone-overview',
  };
  const place = (
    key: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) =>
    Object.assign(
      layout.tiles.find((t) => t.key === key)!,
      {
        x,
        y,
        width,
        height,
      },
    );
  const margin = 12;
  const gap = 16;
  const routeWidth = (viewportWidth - margin * 2 - gap * 3) / 4;
  const stride = (routeWidth + gap) / 2;
  const routes = layout.tiles.filter((t) => t.kind === 'route');
  place('present', (viewportWidth - 88) / 2, 12, 88, 40);
  routes.forEach((tile, index) =>
    place(
      tile.key,
      margin + index * stride,
      index % 2 ? 176 : 96,
      routeWidth,
      64,
    ),
  );
  layout.forks!.find((f) => f.key === 'present-routes')!.busY = 74;

  const outcomeWidth = (viewportWidth - margin * 2 - 28) / 2;
  const right = viewportWidth - margin - outcomeWidth;
  place('catastrophe', margin, 334, outcomeWidth, 56);
  place('agency', right, 334, outcomeWidth, 56);
  place('survival', margin, 422, outcomeWidth, 58);
  place('recovery', right, 422, outcomeWidth, 58);
  place('extinction', margin, 520, outcomeWidth, 46);

  layout.wires
    .filter((w) => w.to === 'catastrophe')
    .forEach((w, index) => {
      w.busY = 256 + index * 14;
    });
  layout.wires.find((w) => w.to === 'agency')!.busY = 280;
  layout.wires.find((w) => w.to === 'survival')!.busY = 406;
  layout.wires.find((w) => w.to === 'recovery')!.busY = 402;
  layout.width = viewportWidth;
  layout.height = 584;
  return layout;
}

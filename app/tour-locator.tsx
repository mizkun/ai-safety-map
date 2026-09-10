'use client';
import { useMemo } from 'react';
import { ButtonBase } from '@mui/material';
import type { Content } from '@/lib/content-types';
import type { TourStop } from '@/lib/map-tour';
import {
  treeLayout,
  wireGeometry,
  forkGeometry,
  joinGeometry,
} from '@/lib/tree-layout';

// A single static SVG of the actual full map; no second interactive map or camera.
export default function TourLocator({
  data,
  stop,
  label,
  onOverview,
}: {
  data: Content;
  stop: TourStop;
  label: string;
  onOverview: () => void;
}) {
  const atlas = useMemo(() => {
    const layout = treeLayout(data, 'overview', true);
    const paths = [
      ...layout.wires.map((wire) => wireGeometry(wire, layout).path),
      ...(layout.forks || []).flatMap((fork) => {
        const g = forkGeometry(fork, layout);
        return [
          g.trunk,
          ...g.branches.map((b) => b.path),
          ...(g.mergePath ? [g.mergePath] : []),
        ];
      }),
      ...(layout.joins || []).map((join) => joinGeometry(join, layout)),
    ];
    return { layout, path: paths.join(' ') };
  }, [data]);
  const { layout } = atlas;
  const targets = layout.tiles.filter(
    (t) => t.node && stop.nodes.includes(t.node),
  );
  const bounds = targets.length
    ? {
        x: Math.min(...targets.map((t) => t.x)) - 80,
        y: Math.min(...targets.map((t) => t.y)) - 80,
        right: Math.max(...targets.map((t) => t.x + t.width)) + 80,
        bottom: Math.max(...targets.map((t) => t.y + t.height)) + 80,
      }
    : null;
  return (
    <ButtonBase
      className="tour-locator"
      aria-label={label}
      onClick={onOverview}
    >
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
        <path
          d={atlas.path}
          fill="none"
          stroke="#a8b1c6"
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
        />
        {layout.tiles.map((tile) => (
          <rect
            key={tile.key}
            x={tile.x}
            y={tile.y}
            width={tile.width}
            height={tile.height}
            rx={20}
            fill={
              tile.node && stop.nodes.includes(tile.node)
                ? '#425683'
                : tile.color
            }
            opacity={tile.node && stop.nodes.includes(tile.node) ? 1 : 0.3}
          />
        ))}
        {bounds && (
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.right - bounds.x}
            height={bounds.bottom - bounds.y}
            rx={24}
            stroke="#425683"
            fill="#4256830c"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </ButtonBase>
  );
}

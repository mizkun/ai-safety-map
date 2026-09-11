'use client';
import { memo, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { ButtonBase, IconButton, Paper, Tooltip } from '@mui/material';
import { Map as MapIcon, ChevronDown } from 'lucide-react';
import type { TreeLayout } from '@/lib/tree-types';
import type { Messages } from '@/lib/i18n';
import {
  minimapCamera,
  minimapViewport,
  type MapViewport,
} from '@/lib/map-minimap';

// Reuse the visible map's layout. Panning updates only the viewport rectangle,
// not another map renderer or a separately calculated global atlas.
const Miniature = memo(function Miniature({
  layout,
  path,
  highlighted,
}: {
  layout: TreeLayout;
  path: string;
  highlighted: string;
}) {
  const nodes = new Set(highlighted.split(','));
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="#8d9aaf"
        strokeWidth={0.8}
        vectorEffect="non-scaling-stroke"
      />
      {layout.tiles.map((tile) => {
        const active = nodes.has(tile.node || '');
        return (
          <rect
            key={tile.key}
            x={tile.x}
            y={tile.y}
            width={tile.width}
            height={tile.height}
            rx={14}
            fill={active ? '#315f9d' : tile.color}
            fillOpacity={active ? 1 : 0.45}
            stroke={active ? '#244d85' : '#ffffff'}
            strokeWidth={active ? 1 : 0.4}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </g>
  );
});

export default function MapMinimap({
  layout,
  path,
  highlighted,
  viewport,
  scale,
  title,
  messages: m,
  onMove,
}: {
  layout: TreeLayout;
  path: string;
  highlighted: string;
  viewport: RefObject<HTMLDivElement | null>;
  scale: number;
  title: string;
  messages: Messages;
  onMove: (camera: { scale: number; left: number; top: number }) => void;
}) {
  const [smallScreen, setSmallScreen] = useState(false);
  const [expanded, setExpanded] = useState<boolean | null>(null);
  const open = expanded ?? !smallScreen;
  const [snapshot, setSnapshot] = useState<MapViewport>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const svg = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const query = matchMedia('(max-width: 900px)');
    const update = () => setSmallScreen(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element || !open) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const next = {
        left: element.scrollLeft,
        top: element.scrollTop,
        width: element.clientWidth,
        height: element.clientHeight,
      };
      setSnapshot((previous) =>
        Object.keys(next).every(
          (key) =>
            next[key as keyof MapViewport] ===
            previous[key as keyof MapViewport],
        )
          ? previous
          : next,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.addEventListener('scroll', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener('scroll', schedule);
    };
  }, [viewport, open]);
  const bounds = minimapViewport(snapshot, scale, layout);
  const moveTo = (point: { x: number; y: number }) =>
    onMove(minimapCamera(point, snapshot, scale, layout));
  return (
    <Paper
      component="aside"
      className={'map-minimap' + (open ? ' minimap-open' : ' minimap-closed')}
      elevation={0}
      aria-label={m.minimap}
    >
      {open ? (
        <>
          <header className="minimap-heading">
            <span>{title}</span>
            <Tooltip title={m.hideMinimap}>
              <IconButton
                aria-label={m.hideMinimap}
                aria-expanded={true}
                onClick={() => setExpanded(false)}
              >
                <ChevronDown size={17} />
              </IconButton>
            </Tooltip>
          </header>
          <ButtonBase
            className="minimap-surface"
            aria-label={m.minimapNavigate}
            onKeyDown={(event) => {
              const direction = {
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
              }[event.key];
              if (!direction) return;
              event.preventDefault();
              moveTo({
                x: bounds.x + bounds.width * (0.5 + direction[0] * 0.7),
                y: bounds.y + bounds.height * (0.5 + direction[1] * 0.7),
              });
            }}
            onClick={(event) => {
              if (event.detail === 0) {
                const tile = layout.tiles.find((t) =>
                  highlighted.split(',').includes(t.node || ''),
                );
                if (tile)
                  moveTo({
                    x: tile.x + tile.width / 2,
                    y: tile.y + tile.height / 2,
                  });
                return;
              }
              const matrix = svg.current?.getScreenCTM();
              if (matrix) {
                moveTo(
                  new DOMPoint(event.clientX, event.clientY).matrixTransform(
                    matrix.inverse(),
                  ),
                );
                if (smallScreen) setExpanded(false);
              }
            }}
          >
            <svg
              ref={svg}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
            >
              <Miniature
                layout={layout}
                path={path}
                highlighted={highlighted}
              />
              <rect
                className="minimap-viewport"
                x={bounds.x}
                y={bounds.y}
                width={bounds.width}
                height={bounds.height}
                rx={8}
                fill="#487cce18"
                stroke="#386eb3"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </ButtonBase>
        </>
      ) : (
        <Tooltip title={m.showMinimap}>
          <IconButton
            aria-label={m.showMinimap}
            aria-expanded={false}
            onClick={() => setExpanded(true)}
          >
            <MapIcon size={19} />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
}

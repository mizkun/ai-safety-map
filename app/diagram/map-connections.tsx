'use client';
import { connectionLabels } from '@/lib/connection-labels';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import { intersectsWindow } from '@/lib/map-window.mjs';
import { relationLabels } from '@/lib/relation-labels';
import { ButtonBase, IconButton, Tooltip } from '@mui/material';
import { ArrowDown, ArrowRight, Minus, RotateCcw } from 'lucide-react';

import type { mapWindow } from '@/lib/map-window.mjs';
import type { TreeGeometry } from '@/lib/tree-rendering';
import type { TreeLayout } from '@/lib/tree-types';
type ScreenPoint = (x: number, y: number) => { left: number; top: number };

type Props = {
  layout: TreeLayout;
  data: Content;
  m: Messages;
  scale: number;
  screen: ScreenPoint;
  geometry: TreeGeometry;
  visible: ReturnType<typeof mapWindow> | null;
  paint: NonNullable<ReturnType<typeof mapWindow>>;
  annotations: {
    relations: ReturnType<typeof relationLabels>;
    connections: ReturnType<typeof connectionLabels>;
  };
  tourFocus?: { edge?: string } | null;
  tracedEdge: string | null;
  onTrace: (edge: string | null) => void;
  onEdge: (id: string) => void;
  onGuide: () => void;
};
export default function MapConnections({
  layout,
  data,
  m,
  scale,
  screen,
  geometry,
  visible,
  paint,
  annotations,
  tourFocus,
  tracedEdge,
  onTrace: setTracedEdge,
  onEdge,
  onGuide,
}: Props) {
  const visibleRegions = layout.regions?.filter((region) =>
    intersectsWindow(region, visible),
  );
  const visibleJoins = layout.joins?.filter((join) =>
    intersectsWindow(
      { x: join.x - 100, y: join.y - 30, width: 200, height: 60 },
      visible,
    ),
  );

  return (
    <>
      <svg
        className="tree-wires"
        width={paint.width * scale}
        height={paint.height * scale}
        viewBox={
          visible
            ? `${visible.x} ${visible.y} ${visible.width} ${visible.height}`
            : '0 0 1 1'
        }
        style={{ left: 0, top: 0 }}
        aria-hidden="true"
      >
        {visibleRegions?.map((region) => (
          <rect
            key={region.key}
            x={region.x}
            y={region.y}
            width={region.width}
            height={region.height}
            rx={10 / scale}
            fill={region.color}
            fillOpacity={0.035}
            stroke={region.color}
            strokeOpacity={0.85}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {layout.forks?.map((fork) => {
          const g = geometry.forks.get(fork.key)!;
          return (
            <g
              key={fork.key}
              fill="none"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d={g.trunk}
                stroke={fork.color}
                strokeOpacity={0.85}
                vectorEffect="non-scaling-stroke"
              />
              {g.mergePath && (
                <path
                  d={g.mergePath}
                  stroke={fork.color}
                  strokeOpacity={0.85}
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {g.branches.map((branch) => (
                <path
                  key={branch.key}
                  d={branch.path}
                  stroke={branch.color}
                  strokeOpacity={0.85}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {g.markers.map((p) => (
                <circle
                  key={p.x + ':' + p.y}
                  cx={p.x}
                  cy={p.y}
                  r={2.5 / scale}
                  fill="#f1f3fa"
                  stroke={fork.color}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          );
        })}
        {layout.joins?.map((join) => (
          <g key={join.edge}>
            <path
              d={geometry.joins.get(join.edge)!.path}
              fill="none"
              stroke={join.color}
              strokeWidth={join.edge === tourFocus?.edge ? 4 : 2}
              strokeOpacity={0.9}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {geometry.joins.get(join.edge)!.junctions.map((p) => (
              <circle
                key={p.x + ':' + p.y}
                cx={p.x}
                cy={p.y}
                r={2.5 / scale}
                fill={join.color}
              />
            ))}
          </g>
        ))}
        {[...layout.wires]
          .sort((a, b) => Number(!!b.reference) - Number(!!a.reference))
          .map((w) => {
            const g = geometry.wires.get(w.key)!;
            const relation = w.edge ? data.edges[w.edge].relation : undefined;
            return (
              <g
                key={w.key}
                opacity={tracedEdge && w.edge !== tracedEdge ? 0.2 : 1}
              >
                {!w.reference && (
                  <path
                    d={g.path}
                    fill="none"
                    stroke="#f1f3fa"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                <path
                  d={g.path}
                  fill="none"
                  stroke={relation === 'mitigation' ? '#348773' : w.color}
                  strokeWidth={
                    w.edge && w.edge === tourFocus?.edge
                      ? 4
                      : w.reference
                        ? 1.5
                        : 2
                  }
                  strokeOpacity={w.reference ? 0.8 : 1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {w.edge && (
                  <path
                    d={g.path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={18}
                    vectorEffect="non-scaling-stroke"
                    style={{
                      cursor: 'pointer',
                      pointerEvents: 'stroke',
                    }}
                    onClick={() => onEdge(w.edge!)}
                    onPointerEnter={() => setTracedEdge(w.edge!)}
                    onPointerLeave={() => setTracedEdge(null)}
                  />
                )}
              </g>
            );
          })}
        {geometry.ports.map((port) => (
          <path
            key={port.key}
            d={`M ${port.line.x} ${port.line.y} L ${port.x} ${port.y}`}
            fill="none"
            stroke={port.color}
            strokeWidth={1.6}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {annotations.relations
        .filter((label) =>
          intersectsWindow(
            {
              x: label.x / scale,
              y: label.y / scale,
              width: label.width / scale,
              height: label.height / scale,
            },
            visible,
          ),
        )
        .map((label) => (
          <Tooltip
            key={label.key}
            title={label.mode === 'all' ? m.jointHelp : m.alternativeHelp}
          >
            <ButtonBase
              className="relation-label"
              style={{
                ...screen(label.x / scale, label.y / scale),
                width: label.width,
                height: label.height,
                color: label.color,
              }}
              onClick={() => (label.edge ? onEdge(label.edge) : onGuide())}
              aria-label={
                label.mode === 'all'
                  ? 'AND · ' + m.joint
                  : 'OR · ' + m.alternative
              }
            >
              {label.mode === 'all' ? 'AND' : 'OR'}
            </ButtonBase>
          </Tooltip>
        ))}
      {visibleJoins?.map((join) => (
        <Tooltip key={join.edge} title={data.edges[join.edge].label}>
          <IconButton
            className={
              'wire-button' +
              (join.edge === tourFocus?.edge ? ' connection-tour-focus' : '')
            }
            style={{
              ...screen(join.x, join.y),
              color: join.edge === tourFocus?.edge ? '#fff' : join.color,
            }}
            aria-current={join.edge === tourFocus?.edge ? 'step' : undefined}
            onClick={() => onEdge(join.edge)}
            aria-label={m.connection + ' · ' + data.edges[join.edge].label}
          >
            {layout.flow === 'horizontal' ? (
              <ArrowRight size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
          </IconButton>
        </Tooltip>
      ))}
      {annotations.connections
        .filter((label) =>
          intersectsWindow(
            {
              x: label.x / scale,
              y: label.y / scale,
              width: label.width / scale,
              height: label.height / scale,
            },
            visible,
          ),
        )
        .map((label) => {
          const DirectionIcon =
            layout.flow === 'horizontal' ? ArrowRight : ArrowDown;
          return (
            <Tooltip key={label.key} title={data.edges[label.edge].label}>
              <ButtonBase
                className={
                  'connection-control' +
                  (label.edge === tourFocus?.edge
                    ? ' connection-tour-focus'
                    : '')
                }
                aria-current={
                  label.edge === tourFocus?.edge ? 'step' : undefined
                }
                style={{
                  ...screen(label.centerX / scale, label.centerY / scale),
                  width: label.width,
                  height: label.height,
                  color:
                    label.edge === tourFocus?.edge
                      ? '#fff'
                      : label.relation === 'mitigation'
                        ? '#348773'
                        : undefined,
                }}
                onClick={() => onEdge(label.edge)}
                aria-label={m.connection + ' · ' + data.edges[label.edge].label}
                onPointerEnter={() => setTracedEdge(label.edge)}
                onPointerLeave={() => setTracedEdge(null)}
                onFocus={() => setTracedEdge(label.edge)}
                onBlur={() => setTracedEdge(null)}
              >
                {label.relation === 'mitigation' ? (
                  <Minus size={14} />
                ) : label.relation === 'feedback' ? (
                  <RotateCcw size={14} />
                ) : (
                  <DirectionIcon size={14} />
                )}
              </ButtonBase>
            </Tooltip>
          );
        })}
    </>
  );
}

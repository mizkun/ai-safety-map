'use client';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  ButtonBase,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  Button,
} from '@mui/material';
import {
  ArrowDown,
  ArrowUpRight,
  Plus,
  Minus,
  Maximize2,
  Scan,
  GitBranch,
  RotateCcw,
  Clock3,
} from 'lucide-react';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import { treeLayout, wireGeometry } from '@/lib/tree-layout';
import { reviewStatus } from '@/lib/freshness.mjs';

type Props = {
  data: Content;
  view: string;
  today: string;
  messages: Messages;
  selected: string | null;
  onNode: (id: string) => void;
  onEdge: (id: string) => void;
  onRoute: (id: string) => void;
  onChoose: () => void;
};
export default function TreeMap({
  data,
  view,
  today,
  messages: m,
  selected,
  onNode,
  onEdge,
  onRoute,
  onChoose,
}: Props) {
  const layout = useMemo(() => treeLayout(data, view), [data, view]);
  const viewport = useRef<HTMLDivElement>(null);
  const [manualZoom, setManualZoom] = useState<{
    context: string;
    value: number;
  } | null>(null);
  const [size, setSize] = useState({ width: 1200, height: 900 });
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const fitScale = Math.max(
    0.2,
    Math.min(
      1,
      (size.width - 40) / layout.width,
      (size.height - 40) / layout.height,
    ),
  );
  const readableScale =
    view === 'overview'
      ? size.width < 760
        ? 0.82
        : fitScale
      : Math.min(1, (size.width - 28) / 380);
  const scaleContext = view + ':' + size.width + ':' + size.height;
  const scale =
    manualZoom?.context === scaleContext ? manualZoom.value : readableScale;
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (viewport.current) {
        viewport.current.scrollTop = 0;
        viewport.current.scrollLeft = Math.max(
          0,
          (layout.width * readableScale - size.width) / 2,
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [readableScale, layout.width, view, size.width, scaleContext]);
  function zoom(value: number) {
    const next = Math.max(0.2, Math.min(1.6, value));
    const el = viewport.current;
    const centerX = el
      ? (el.scrollLeft + el.clientWidth / 2) / scale
      : layout.width / 2;
    const centerY = el
      ? (el.scrollTop + el.clientHeight / 2) / scale
      : layout.height / 2;
    setManualZoom({ context: scaleContext, value: next });
    requestAnimationFrame(() => {
      if (el) {
        el.scrollLeft = centerX * next - el.clientWidth / 2;
        el.scrollTop = centerY * next - el.clientHeight / 2;
      }
    });
  }
  const graph = data.graphs[view];
  return (
    <>
      <div
        className="tree-viewport"
        ref={viewport}
        aria-label={m.graphLabel}
        onPointerDown={(event) => {
          if (
            event.pointerType !== 'mouse' ||
            event.button !== 0 ||
            (event.target as HTMLElement).closest('button,a')
          )
            return;
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            left: event.currentTarget.scrollLeft,
            top: event.currentTarget.scrollTop,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          event.currentTarget.scrollLeft =
            drag.current.left - (event.clientX - drag.current.x);
          event.currentTarget.scrollTop =
            drag.current.top - (event.clientY - drag.current.y);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className="tree-stage"
          style={{
            width: Math.max(size.width, layout.width * scale),
            height: Math.max(size.height, layout.height * scale),
          }}
        >
          <div
            className="tree-content"
            style={{
              width: layout.width,
              height: layout.height,
              transform: `scale(${scale})`,
              left: Math.max(0, (size.width - layout.width * scale) / 2),
            }}
          >
            <svg
              className="tree-wires"
              width={layout.width}
              height={layout.height}
              aria-hidden="true"
            >
              {layout.wires.map((w) => {
                const g = wireGeometry(w, layout);
                return (
                  <path
                    key={w.key}
                    d={g.path}
                    fill="none"
                    stroke={w.color}
                    strokeWidth={1.7}
                    strokeOpacity={0.5}
                    strokeDasharray={w.dashed ? '5 6' : undefined}
                  />
                );
              })}
            </svg>
            {layout.wires
              .filter((w) => w.edge)
              .map((w) => {
                const g = wireGeometry(w, layout);
                return (
                  <Tooltip title={data.edges[w.edge!].label} key={w.key}>
                    <IconButton
                      aria-label={
                        m.connection + ' · ' + data.edges[w.edge!].label
                      }
                      className="wire-button"
                      style={{ left: g.x - 18, top: g.y - 18, color: w.color }}
                      onClick={() => onEdge(w.edge!)}
                    >
                      {w.key === 'feedback' ? (
                        <RotateCcw size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}
                    </IconButton>
                  </Tooltip>
                );
              })}
            {graph && graph.mode !== 'sequence' && (
              <Tooltip
                title={graph.mode === 'all' ? m.jointHelp : m.alternativeHelp}
              >
                <Chip
                  className="condition-chip"
                  label={graph.mode === 'all' ? m.joint : m.alternative}
                  style={{ left: layout.width / 2, top: 205 }}
                />
              </Tooltip>
            )}
            {layout.tiles.map((tile) => {
              const node = tile.node ? data.nodes[tile.node] : undefined;
              const route = tile.graph
                ? data.routes.find((r) => r.id === tile.graph)
                : undefined;
              const title = tile.label
                ? m[tile.label]
                : node?.title || route?.shortTitle || '';
              const due =
                node && reviewStatus(node.review, today).state === 'due';
              return (
                <ButtonBase
                  key={tile.key}
                  className={
                    'tree-tile tile-' +
                    tile.kind +
                    (selected === tile.node ? ' tile-selected' : '') +
                    (tile.node === 'X' ? ' tile-terminal' : '')
                  }
                  style={
                    {
                      left: tile.x,
                      top: tile.y,
                      width: tile.width,
                      height: tile.height,
                      '--branch-color': tile.color,
                    } as CSSProperties
                  }
                  onClick={() =>
                    tile.graph ? onRoute(tile.graph) : onNode(tile.node!)
                  }
                  aria-label={title + ' · ' + (tile.graph ? m.branch : m.read)}
                >
                  <span className="tile-eyebrow">
                    <span className="tile-dot" />
                    {tile.kind === 'research' ? (
                      <RotateCcw size={15} />
                    ) : tile.node === 'NOW' ? (
                      data.asOf
                    ) : (
                      route?.number || node?.id
                    )}
                    {due && (
                      <span className="tile-review" title={m.due}>
                        <Clock3 size={14} />
                      </span>
                    )}
                  </span>
                  <span className="tile-title">{title}</span>
                  <ArrowUpRight className="tile-arrow" size={16} />
                </ButtonBase>
              );
            })}
          </div>
        </div>
      </div>
      <div className="map-controls">
        <Paper className="zoom-controls glass" elevation={0}>
          <Tooltip title={m.zoomOut}>
            <IconButton
              aria-label={m.zoomOut}
              onClick={() => zoom(scale / 1.18)}
              disabled={scale <= 0.2}
            >
              <Minus size={17} />
            </IconButton>
          </Tooltip>
          <span className="zoom-value">{Math.round(scale * 100)}%</span>
          <Tooltip title={m.zoomIn}>
            <IconButton
              aria-label={m.zoomIn}
              onClick={() => zoom(scale * 1.18)}
              disabled={scale >= 1.6}
            >
              <Plus size={17} />
            </IconButton>
          </Tooltip>
          <span className="toolbar-divider" />
          <Tooltip title={m.fit}>
            <IconButton aria-label={m.fit} onClick={() => zoom(fitScale)}>
              <Maximize2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title={m.resetZoom}>
            <IconButton
              aria-label={m.resetZoom}
              onClick={() => zoom(readableScale)}
            >
              <Scan size={17} />
            </IconButton>
          </Tooltip>
        </Paper>
        <Button
          className="choose-route glass"
          startIcon={<GitBranch size={17} />}
          onClick={onChoose}
        >
          {m.routes}
        </Button>
      </div>
    </>
  );
}

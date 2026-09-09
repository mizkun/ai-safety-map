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
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  Maximize2,
  Scan,
  GitBranch,
  RotateCcw,
  Clock3,
  Info,
  X,
} from 'lucide-react';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import { treeLayout, wireGeometry, joinGeometry } from '@/lib/tree-layout';
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
  onTerm: (id: string) => void;
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
  onTerm,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const layout = useMemo(() => treeLayout(data, view, expanded), [data, view, expanded]);
  const canExpand = view === 'overview' || data.graphs[view]?.mode === 'network';
  const nodeCount = new Set(layout.tiles.flatMap((tile) => tile.node ? [tile.node] : [])).size;
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
    0.04,
    Math.min(
      1,
      (size.width - 40) / layout.width,
      (size.height - 40) / layout.height,
    ),
  );
  const readableScale =
    canExpand && expanded
      ? size.width < 760 ? 0.94 : Math.min(1, Math.max(0.82, (size.width - 40) / 1200))
      : view === 'overview'
      ? size.width < 760
        ? 0.82
        : fitScale
      : Math.min(1, (size.width - 28) / 380);
  const scaleContext = view + ':' + expanded + ':' + size.width + ':' + size.height;
  const scale =
    manualZoom?.context === scaleContext ? manualZoom.value : readableScale;
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (viewport.current) {
        viewport.current.scrollTop = 0;
        viewport.current.scrollLeft = canExpand ? 0 : Math.max(
          0,
          (layout.width * readableScale - size.width) / 2,
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [readableScale, layout.width, view, size.width, scaleContext, canExpand]);
  function zoom(value: number) {
    const next = Math.max(0.04, Math.min(1.6, value));
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
  function focusRoute(id: string) {
    const tile = layout.tiles.find((t) => t.graph === id);
    if (!tile) return;
    const next = Math.min(1, Math.max(0.85, (size.width - 60) / (['control', 'work', 'money'].includes(id) ? 1200 : 460)));
    setManualZoom({ context: scaleContext, value: next });
    requestAnimationFrame(() => {
      viewport.current?.scrollTo({ left: Math.max(0, (tile.x - 25) * next), top: Math.max(0, (tile.y - 25) * next), behavior: 'smooth' });
    });
  }
  const graph = data.graphs[view];
  return (
    <>
      <div
        className={'tree-viewport' + (canExpand ? ' with-scope' : '')}
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
              {layout.joins?.map((join) => (
                <path key={join.edge} d={joinGeometry(join, layout)} fill="none" stroke={join.color}
                  strokeWidth={3.5} strokeOpacity={0.9} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              ))}
              {layout.wires.map((w) => {
                const g = wireGeometry(w, layout);
                const relation = w.edge ? data.edges[w.edge].relation : undefined;
                return (
                  <path
                    key={w.key}
                    d={g.path}
                    fill="none"
                    stroke={relation === 'mitigation' ? '#348773' : w.color}
                    strokeWidth={w.reference ? 2.4 : 3.5}
                    strokeOpacity={w.reference ? 0.58 : 0.9}
                    strokeDasharray={w.dashed ? '10 7' : undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
            {layout.regions?.map((region) => (
              <div key={region.key} className="condition-region" style={{ left: region.x, top: region.y, width: region.width, height: region.height, borderColor: region.color + '40' }}>
                <ButtonBase className="region-relation" style={{ top: region.labelY - region.y }} onClick={() => region.edge ? onEdge(region.edge) : setShowGuide(true)}>
                  <b>{region.mode === 'all' ? 'AND' : 'OR'}</b>
                  <span>{region.mode === 'all' ? m.joint : m.alternative}</span>
                </ButtonBase>
              </div>
            ))}
            {layout.joins?.map((join) => (
              <Tooltip key={join.edge} title={data.edges[join.edge].label}>
                <ButtonBase className="joint-button" style={{ left: join.x, top: join.y, color: join.color }} onClick={() => onEdge(join.edge)} aria-label={'AND · ' + data.edges[join.edge].label}>
                  <b>AND</b><span>{m.joint}</span>
                </ButtonBase>
              </Tooltip>
            ))}
            {layout.wires
              .filter((w) => w.edge)
              .map((w) => {
                const g = wireGeometry(w, layout);
                const relation = data.edges[w.edge!].relation;
                const DirectionIcon = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight }[g.direction];
                if (relation === 'influence' || relation === 'mitigation') return (
                  <Tooltip title={data.edges[w.edge!].label} key={w.key}>
                    <ButtonBase className={'influence-button ' + relation} style={{ left: g.x, top: g.y }} onClick={() => onEdge(w.edge!)} aria-label={data.edges[w.edge!].label}>
                      {relation === 'mitigation' ? m.mitigation : m.influence}<DirectionIcon size={14} />
                    </ButtonBase>
                  </Tooltip>
                );
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
                      {data.edges[w.edge!].relation === 'feedback' ? (
                        <RotateCcw size={16} />
                      ) : (
                        <DirectionIcon size={16} />
                      )}
                    </IconButton>
                  </Tooltip>
                );
              })}
            {graph && ['all', 'any'].includes(graph.mode) && (
              <Tooltip
                title={graph.mode === 'all' ? m.jointHelp : m.alternativeHelp}
              >
                <Chip
                  className="condition-chip"
                  label={graph.mode === 'all' ? m.joint : m.alternative}
                  style={{ left: layout.width / 2, top: 235 }}
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
                <Paper
                  elevation={0}
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
                >
                  <ButtonBase className="tile-open" onClick={() => tile.graph ? onRoute(tile.graph) : onNode(tile.node!)} aria-label={title + ' · ' + (tile.graph ? m.branch : m.read)}>
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
                  {!!node?.topics?.length && <div className="tile-topics">
                    {node.topics.map((id) => <ButtonBase key={id} className="tile-topic" onClick={() => onTerm(id)} aria-label={data.glossary[id].name + ' · ' + m.definition}>
                      {data.glossary[id].name.split('（')[0]}<Info size={12} />
                    </ButtonBase>)}
                  </div>}
                </Paper>
              );
            })}
          </div>
        </div>
      </div>
      {canExpand && <Paper className="map-scope glass" elevation={0}>
        <ToggleButtonGroup size="small" exclusive value={expanded ? 'all' : 'summary'} onChange={(_, value: string | null) => { if (value) setExpanded(value === 'all'); }} aria-label={m.displayScope}>
          <ToggleButton value="summary">{m.summaryView}</ToggleButton>
          <ToggleButton value="all">{m.allElements}</ToggleButton>
        </ToggleButtonGroup>
        <span className="scope-count">{nodeCount} {m.elements}</span>
        <Tooltip title={m.parallelGuide}><IconButton aria-label={m.parallelGuide} onClick={() => setShowGuide(true)}><Info size={18} /></IconButton></Tooltip>
      </Paper>}
      {view === 'overview' && expanded && <Paper className="route-shortcuts glass" elevation={0} component="nav" aria-label={m.focusRoute}>
        {data.routes.map((route) => <Button key={route.id} onClick={() => focusRoute(route.id)}>{route.shortTitle}</Button>)}
      </Paper>}
      <div className="map-controls">
        <Paper className="zoom-controls glass" elevation={0}>
          <Tooltip title={m.zoomOut}>
            <IconButton
              aria-label={m.zoomOut}
              onClick={() => zoom(scale / 1.18)}
              disabled={scale <= 0.04}
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
      <Dialog open={showGuide} onClose={() => setShowGuide(false)} fullWidth maxWidth="sm">
        <DialogTitle className="modal-heading"><span>{m.parallelGuide}</span><IconButton aria-label={m.close} onClick={() => setShowGuide(false)}><X size={20} /></IconButton></DialogTitle>
        <DialogContent className="parallel-guide">
          <p><strong>AND · {m.joint}</strong>{m.jointHelp}</p>
          <p><strong>OR · {m.alternative}</strong>{m.alternativeHelp}</p>
          <p>{m.parallelHelp}</p>
          <p><strong>{m.influence} / {m.mitigation}</strong>{m.influenceHelp}</p>
          <p>{m.fullMapHelp}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}

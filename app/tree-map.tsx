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
import { treeLayout, wireGeometry, joinGeometry, forkGeometry, joinJunctions } from '@/lib/tree-layout';
import { reviewStatus } from '@/lib/freshness.mjs';
import { useMapGestures } from './use-map-gestures';
import { useMapWindow } from './use-map-window';
import { intersectsWindow } from '@/lib/map-window.mjs';

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
  const canExpand = view === 'overview' || ['network', 'all', 'any', 'sequence'].includes(data.graphs[view]?.mode);
  const nodeCount = new Set(layout.tiles.flatMap((tile) => tile.node ? [tile.node] : [])).size;
  const viewport = useRef<HTMLDivElement>(null);
  const [manualZoom, setManualZoom] = useState<{
    context: string;
    value: number;
  } | null>(null);
  const [size, setSize] = useState({ width: 1200, height: 900 });
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
    0.02,
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
        const anchor = layout.tiles.find((t) => t.node === 'NOW') || layout.tiles[0];
        viewport.current.scrollTop = layout.flow === 'horizontal' ? Math.max(0, (anchor.y + anchor.height / 2) * readableScale - size.height / 2) : 0;
        viewport.current.scrollLeft = layout.flow === 'horizontal'
          ? Math.max(0, Math.min(...layout.tiles.map((t) => t.x)) * readableScale - 24)
          : canExpand ? 0 : Math.max(
          0,
          (layout.width * readableScale - size.width) / 2,
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [readableScale, layout, view, size.width, size.height, scaleContext, canExpand]);
  function zoom(value: number) {
    const next = Math.max(0.02, Math.min(1.6, value));
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
  useMapGestures(viewport, { scale, contentWidth: layout.width, onScale: (value) => setManualZoom({ context: scaleContext, value }) });
  const visible = useMapWindow(viewport, scale, layout.width, layout.height);
  const visibleTiles = layout.tiles.filter((tile) => intersectsWindow(tile, visible));
  const visibleRegions = layout.regions?.filter((region) => intersectsWindow(region, visible));
  const visibleJoins = layout.joins?.filter((join) => intersectsWindow({ x: join.x - 100, y: join.y - 30, width: 200, height: 60 }, visible));
  const geometry = useMemo(() => ({
    wires: new Map(layout.wires.map((wire) => [wire.key, wireGeometry(wire, layout)])),
    forks: new Map(layout.forks?.map((fork) => [fork.key, forkGeometry(fork, layout)])),
    joins: new Map(layout.joins?.map((join) => [join.edge, { path: joinGeometry(join, layout), junctions: joinJunctions(join, layout) }])),
  }), [layout]);
  return (
    <>
      <div
        className={'tree-viewport' + (canExpand ? ' with-scope' : '')}
        ref={viewport}
        aria-label={m.graphLabel}

      >
        <div
          className="tree-stage"
          style={{
            width: Math.max(size.width, layout.width * scale),
            height: Math.max(size.height, layout.height * scale),
          }}
        >
          <div
            className={'tree-content' + (layout.flow === 'horizontal' ? ' horizontal-flow' : '')}
            style={{
              width: layout.width,
              height: layout.height,
              transform: `scale(${scale})`,
              left: Math.max(0, (size.width - layout.width * scale) / 2),
            }}
          >
            <svg
              className="tree-wires"
              width={visible?.width || 0}
              height={visible?.height || 0}
              viewBox={visible ? `${visible.x} ${visible.y} ${visible.width} ${visible.height}` : '0 0 1 1'}
              style={{ left: visible?.x || 0, top: visible?.y || 0 }}
              aria-hidden="true"
            >
              {layout.forks?.map((fork) => {
                const g = geometry.forks.get(fork.key)!;
                return <g key={fork.key} fill="none" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d={g.trunk} stroke={fork.color} strokeOpacity={0.65} strokeDasharray="9 7" vectorEffect="non-scaling-stroke" />
                  {g.mergePath && <path d={g.mergePath} stroke={fork.color} strokeOpacity={0.65} strokeDasharray="9 7" vectorEffect="non-scaling-stroke" />}
                  {g.branches.map((branch) => <path key={branch.key} d={branch.path} stroke={branch.color} strokeOpacity={0.65} strokeDasharray="9 7" vectorEffect="non-scaling-stroke" />)}
                  {g.junctions.map((p) => <circle key={p.x + ':' + p.y} cx={p.x} cy={p.y} r={3.8} fill="#f1f3fa" stroke={fork.color} vectorEffect="non-scaling-stroke" />)}
                </g>;
              })}
              {layout.joins?.map((join) => (
                <g key={join.edge}>
                <path d={geometry.joins.get(join.edge)!.path} fill="none" stroke={join.color}
                  strokeWidth={3.5} strokeOpacity={0.9} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                {geometry.joins.get(join.edge)!.junctions.map((p) => <circle key={p.x + ':' + p.y} cx={p.x} cy={p.y} r={4} fill={join.color} />)}
                </g>
              ))}
              {[...layout.wires].sort((a, b) => Number(!!b.reference) - Number(!!a.reference)).map((w) => {
                const g = geometry.wires.get(w.key)!;
                const relation = w.edge ? data.edges[w.edge].relation : undefined;
                return (
                  <g key={w.key}>
                  {!w.reference && <path d={g.path} fill="none" stroke="#f1f3fa" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
                  <path
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
                  </g>
                );
              })}
            </svg>
            {layout.forks?.filter((fork) => fork.alternative).map((fork) => {
              const from = layout.tiles.find((tile) => tile.key === fork.from)!;
              const g = geometry.forks.get(fork.key)!;
              const targetY = from.y + from.height / 2;
              const point = g.junctions.reduce((best, p) => Math.abs(p.y - targetY) < Math.abs(best.y - targetY) ? p : best);
              if (!intersectsWindow({ x: point.x - 80, y: point.y - 20, width: 160, height: 40 }, visible)) return null;
              return <ButtonBase key={fork.key} className="fork-label" style={{ left: point.x, top: point.y, color: fork.color }} onClick={() => setShowGuide(true)} aria-label={'OR · ' + m.alternative}><b>OR</b><span>{m.alternative}</span></ButtonBase>;
            })}
            {visibleRegions?.map((region) => (
              <div key={region.key} className="condition-region" style={{ left: region.x, top: region.y, width: region.width, height: region.height, borderColor: region.color + '40' }}>
                <ButtonBase className="region-relation" style={{ top: region.labelY - region.y, ...(region.labelX === undefined ? {} : { left: region.labelX - region.x }) }} onClick={() => region.edge ? onEdge(region.edge) : setShowGuide(true)}>
                  <b>{region.mode === 'all' ? 'AND' : 'OR'}</b>
                  <span>{region.mode === 'all' ? m.joint : m.alternative}</span>
                </ButtonBase>
              </div>
            ))}
            {visibleJoins?.map((join) => (
              <Tooltip key={join.edge} title={data.edges[join.edge].label}>
                <IconButton className="wire-button" style={{ left: join.x - 18, top: join.y - 18, color: join.color }} onClick={() => onEdge(join.edge)} aria-label={m.connection + ' · ' + data.edges[join.edge].label}>
                  <ArrowRight size={16} />
                </IconButton>
              </Tooltip>
            ))}
            {layout.wires
              .filter((w) => {
                const g = geometry.wires.get(w.key)!;
                return w.edge && intersectsWindow({ x: g.x - 90, y: g.y - 30, width: 180, height: 60 }, visible);
              })
              .map((w) => {
                const g = geometry.wires.get(w.key)!;
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
            {visibleTiles.map((tile) => {
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
      <div className="map-controls">
        <Paper className="zoom-controls glass" elevation={0}>
          <Tooltip title={m.zoomOut}>
            <IconButton
              aria-label={m.zoomOut}
              onClick={() => zoom(scale / 1.18)}
              disabled={scale <= 0.02}
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

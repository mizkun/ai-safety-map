'use client';
import {
  useEffect,
  useLayoutEffect,
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
import {
  routeColors,
  treeLayout,
  wireGeometry,
  joinGeometry,
  forkGeometry,
  joinJunctions,
} from '@/lib/tree-layout';
import { reviewStatus } from '@/lib/freshness.mjs';
import { useMapGestures } from './use-map-gestures';
import { useMapWindow } from './use-map-window';
import { intersectsWindow } from '@/lib/map-window.mjs';
import {
  initialMapScale,
  zoomAnchor,
  scrollAtAnchor,
} from '@/lib/map-gestures.mjs';
import { tourCamera, tourExpansion } from '@/lib/map-tour';

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
  expansionRequest?: { id: string; serial: number } | null;
  tourFocus?: { key: string; nodes: string[]; focus: string | null } | null;
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
  expansionRequest,
  tourFocus,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [openNodes, setOpenNodes] = useState<string[]>([]);
  const [scopeVersion, setScopeVersion] = useState(0);
  const pendingAnchor = useRef<{ id: string; x: number; y: number } | null>(
    null,
  );
  const cameraContext = useRef('');
  const [showGuide, setShowGuide] = useState(false);
  const isTour = Boolean(tourFocus);
  const tourNodesKey = tourFocus?.nodes.join(',') || '';
  const tourNodes = useMemo(
    () => tourExpansion(data, tourNodesKey ? tourNodesKey.split(',') : []),
    [data, tourNodesKey],
  );
  const layout = useMemo(
    () =>
      treeLayout(
        data,
        view,
        (!isTour && expanded) ||
          (view === 'overview'
            ? false
            : {
                routes: data.routes.map((r) => r.id),
                nodes: isTour ? tourNodes : openNodes,
              }),
      ),
    [data, view, expanded, openNodes, isTour, tourNodes],
  );
  const canExpand =
    view === 'overview' ||
    ['network', 'all', 'any', 'sequence'].includes(data.graphs[view]?.mode);
  const nodeCount = new Set(
    layout.tiles.flatMap((tile) => (tile.node ? [tile.node] : [])),
  ).size;
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
  const mobileOverview =
    size.width < 760 && view === 'overview' && !expanded && !isTour;
  const fitScale = Math.max(
    0.02,
    Math.min(
      1,
      (size.width - 40) / layout.width,
      (size.height - 40) / layout.height,
    ),
  );
  const tourTargets = tourFocus?.focus ? [tourFocus.focus] : tourFocus?.nodes;
  const tourDefaultCamera = tourFocus
    ? tourCamera(
        tourTargets?.length
          ? layout.tiles.filter(
              (tile) => tile.node && tourTargets.includes(tile.node),
            )
          : layout.tiles,
        size,
        layout,
      )
    : null;
  const readableScale =
    tourDefaultCamera?.scale ?? initialMapScale(size, layout);
  const scaleContext =
    view +
    ':' +
    scopeVersion +
    ':' +
    size.width +
    ':' +
    size.height +
    (tourFocus ? ':tour:' + tourFocus.key : '');
  const scale =
    manualZoom?.context === scaleContext ? manualZoom.value : readableScale;
  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const pending = pendingAnchor.current;
    if (pending) {
      const tile = layout.tiles.find((t) => t.node === pending.id);
      pendingAnchor.current = null;
      if (tile)
        el.scrollTo({
          left:
            tile.x * scale +
            Math.max(0, (size.width - layout.width * scale) / 2) -
            pending.x,
          top: tile.y * scale - pending.y,
        });
    } else if (cameraContext.current !== scaleContext && tourDefaultCamera) {
      el.scrollTo(tourDefaultCamera);
    } else if (cameraContext.current !== scaleContext) {
      const anchor =
        layout.tiles.find((t) => t.node === 'NOW') || layout.tiles[0];
      el.scrollTo({
        left: 0,
        top:
          layout.height * scale <= size.height
            ? 0
            : Math.max(
                0,
                (anchor.y + anchor.height / 2) * scale - size.height / 2,
              ),
      });
    }
    cameraContext.current = scaleContext;
  }, [layout, scale, scaleContext, size, tourDefaultCamera]);
  function expandNode(id: string, forceOpen = false) {
    const tile = layout.tiles.find((t) => t.node === id),
      el = viewport.current;
    if (!el) return;
    const graph = data.nodes[id]?.subgraph
      ? data.graphs[data.nodes[id].subgraph!]
      : null;
    if (!graph || !['all', 'any'].includes(graph.mode)) return;
    if (!tile) {
      pendingAnchor.current = { id, x: 32, y: 32 };
      setManualZoom({ context: scaleContext, value: Math.max(0.85, scale) });
      setOpenNodes([
        ...new Set([...openNodes, ...tourExpansion(data, [id]), id]),
      ]);
      setExpanded(false);
      return;
    }
    const allVisible = graph.nodes.every((id) =>
      layout.tiles.some((t) => t.node === id),
    );
    if (forceOpen && allVisible) {
      const first = layout.tiles.find((t) => t.node === graph.nodes[0])!;
      el.scrollTo({
        left: Math.max(0, first.x * scale - 32),
        top: Math.max(0, first.y * scale - 48),
      });
      return;
    }
    pendingAnchor.current = {
      id,
      x:
        tile.x * scale +
        Math.max(0, (size.width - layout.width * scale) / 2) -
        el.scrollLeft,
      y: tile.y * scale - el.scrollTop,
    };
    setManualZoom({ context: scaleContext, value: scale });
    const current = expanded
      ? Object.values(data.nodes)
          .filter((n) => n.subgraph)
          .map((n) => n.id)
      : openNodes;
    setOpenNodes(
      current.includes(id) && !forceOpen
        ? current.filter((key) => key !== id)
        : [...new Set([...current, id])],
    );
    setExpanded(false);
  }
  const handledRequest = useRef<number | null>(null);
  useEffect(() => {
    if (
      expansionRequest &&
      expansionRequest.serial !== handledRequest.current
    ) {
      handledRequest.current = expansionRequest.serial;
      expandNode(expansionRequest.id, true);
    }
  });
  function zoom(value: number) {
    const next = Math.max(0.02, Math.min(1.6, value));
    const el = viewport.current;
    const point = { x: size.width / 2, y: size.height / 2 };
    const anchor = zoomAnchor(
      point,
      { left: el?.scrollLeft || 0, top: el?.scrollTop || 0 },
      scale,
      size.width,
      layout.width,
    );
    setManualZoom({ context: scaleContext, value: next });
    requestAnimationFrame(() => {
      if (el) {
        el.scrollTo(
          next === fitScale
            ? { left: 0, top: 0 }
            : scrollAtAnchor(anchor, point, next, size.width, layout.width),
        );
      }
    });
  }
  useMapGestures(viewport, {
    scale,
    contentWidth: layout.width,
    onScale: (value) => setManualZoom({ context: scaleContext, value }),
  });
  const visible = useMapWindow(viewport, scale, layout.width, layout.height);
  const paint = visible || { x: 0, y: 0, width: 0, height: 0 };
  const screen = (x: number, y: number) => ({
    left: (x - paint.x) * scale,
    top: (y - paint.y) * scale,
  });
  const detailLevel =
    scale < 0.24 ? 'atlas' : scale < 0.85 ? 'compact' : 'reading';
  const visibleTiles = layout.tiles.filter((tile) =>
    intersectsWindow(tile, visible),
  );
  const visibleRegions = layout.regions?.filter((region) =>
    intersectsWindow(region, visible),
  );
  const visibleJoins = layout.joins?.filter((join) =>
    intersectsWindow(
      { x: join.x - 100, y: join.y - 30, width: 200, height: 60 },
      visible,
    ),
  );
  const geometry = useMemo(
    () => ({
      wires: new Map(
        layout.wires.map((wire) => [wire.key, wireGeometry(wire, layout)]),
      ),
      forks: new Map(
        layout.forks?.map((fork) => [fork.key, forkGeometry(fork, layout)]),
      ),
      joins: new Map(
        layout.joins?.map((join) => [
          join.edge,
          {
            path: joinGeometry(join, layout),
            junctions: joinJunctions(join, layout),
          },
        ]),
      ),
    }),
    [layout],
  );
  return (
    <>
      <div
        className={
          'tree-viewport' +
          (canExpand ? ' with-scope' : '') +
          (mobileOverview ? ' mobile-overview-hidden' : '')
        }
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
            className={'tree-content horizontal-flow detail-' + detailLevel}
            style={
              {
                width: paint.width * scale,
                height: paint.height * scale,
                left:
                  paint.x * scale +
                  Math.max(0, (size.width - layout.width * scale) / 2),
                top: paint.y * scale,
                '--map-scale': scale,
              } as CSSProperties
            }
          >
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
                      strokeDasharray="5 4"
                      vectorEffect="non-scaling-stroke"
                    />
                    {g.mergePath && (
                      <path
                        d={g.mergePath}
                        stroke={fork.color}
                        strokeOpacity={0.85}
                        strokeDasharray="5 4"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                    {g.branches.map((branch) => (
                      <path
                        key={branch.key}
                        d={branch.path}
                        stroke={branch.color}
                        strokeOpacity={0.85}
                        strokeDasharray="5 4"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {g.junctions.map((p) => (
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
                    strokeWidth={2}
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
                  const relation = w.edge
                    ? data.edges[w.edge].relation
                    : undefined;
                  return (
                    <g key={w.key}>
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
                        strokeWidth={w.reference ? 1.5 : 2}
                        strokeOpacity={w.reference ? 0.8 : 1}
                        strokeDasharray={w.dashed ? '6 4' : undefined}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                })}
            </svg>
            {layout.forks
              ?.filter((fork) => fork.alternative)
              .map((fork) => {
                const from = layout.tiles.find(
                  (tile) => tile.key === fork.from,
                )!;
                const g = geometry.forks.get(fork.key)!;
                const targetY = from.y + from.height / 2;
                const point = g.junctions.reduce((best, p) =>
                  Math.abs(p.y - targetY) < Math.abs(best.y - targetY)
                    ? p
                    : best,
                );
                if (
                  !intersectsWindow(
                    {
                      x: point.x - 80,
                      y: point.y - 20,
                      width: 160,
                      height: 40,
                    },
                    visible,
                  )
                )
                  return null;
                return (
                  <ButtonBase
                    key={fork.key}
                    className="fork-label"
                    style={{ ...screen(point.x, point.y), color: fork.color }}
                    onClick={() => setShowGuide(true)}
                    aria-label={'OR · ' + m.alternative}
                  >
                    <b>OR</b>
                    <span>{m.alternative}</span>
                  </ButtonBase>
                );
              })}
            {visibleRegions?.map((region) => (
              <ButtonBase
                key={region.key}
                className="region-relation"
                style={{
                  ...screen(region.labelX ?? region.x + 12, region.labelY),
                  color: region.color,
                }}
                onClick={() =>
                  region.edge ? onEdge(region.edge) : setShowGuide(true)
                }
                aria-label={'AND · ' + m.joint}
              >
                <b>AND</b>
                <span>{m.joint}</span>
              </ButtonBase>
            ))}
            {visibleJoins?.map((join) => (
              <Tooltip key={join.edge} title={data.edges[join.edge].label}>
                <IconButton
                  className="wire-button"
                  style={{ ...screen(join.x, join.y), color: join.color }}
                  onClick={() => onEdge(join.edge)}
                  aria-label={
                    m.connection + ' · ' + data.edges[join.edge].label
                  }
                >
                  <ArrowRight size={16} />
                </IconButton>
              </Tooltip>
            ))}
            {layout.wires
              .filter((w) => {
                const g = geometry.wires.get(w.key)!;
                return (
                  w.edge &&
                  intersectsWindow(
                    { x: g.x - 90, y: g.y - 30, width: 180, height: 60 },
                    visible,
                  )
                );
              })
              .map((w) => {
                const g = geometry.wires.get(w.key)!;
                const relation = data.edges[w.edge!].relation;
                const DirectionIcon = {
                  up: ArrowUp,
                  down: ArrowDown,
                  left: ArrowLeft,
                  right: ArrowRight,
                }[g.direction];
                if (relation === 'influence' || relation === 'mitigation')
                  return (
                    <Tooltip title={data.edges[w.edge!].label} key={w.key}>
                      <ButtonBase
                        className={'influence-button ' + relation}
                        style={screen(g.x, g.y)}
                        onClick={() => onEdge(w.edge!)}
                        aria-label={data.edges[w.edge!].label}
                      >
                        {relation === 'mitigation' ? m.mitigation : m.influence}
                        <DirectionIcon size={14} />
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
                      style={{ ...screen(g.x, g.y), color: w.color }}
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
              const childGraph = node?.subgraph
                ? data.graphs[node.subgraph]
                : undefined;
              const unfolded = childGraph?.nodes.every((id) =>
                layout.tiles.some((t) => t.node === id),
              );
              const canUnfold =
                view !== 'overview' &&
                view !== 'acceleration' &&
                childGraph &&
                ['all', 'any'].includes(childGraph.mode) &&
                (!unfolded ||
                  openNodes.includes(node!.id) ||
                  (expanded && node!.id !== 'C4'));
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
                    (tile.node === 'X' ? ' tile-terminal' : '') +
                    (tile.node === 'NOW' ? ' tile-present' : '') +
                    (tourFocus?.nodes.includes(tile.node || '')
                      ? ' tile-tour-focus'
                      : '')
                  }
                  style={
                    {
                      ...screen(tile.x, tile.y),
                      width: tile.width * scale,
                      height: tile.height * scale,
                      '--branch-color': tile.color,
                    } as CSSProperties
                  }
                >
                  <ButtonBase
                    className="tile-open"
                    onClick={() => {
                      if (scale < 0.7 && !tile.graph) {
                        const next = Math.max(0.85, readableScale);
                        setManualZoom({ context: scaleContext, value: next });
                        requestAnimationFrame(() =>
                          viewport.current?.scrollTo({
                            left:
                              (tile.x + tile.width / 2) * next - size.width / 2,
                            top:
                              (tile.y + tile.height / 2) * next -
                              size.height / 2,
                          }),
                        );
                      } else if (tile.graph) onRoute(tile.graph);
                      else onNode(tile.node!);
                    }}
                    aria-label={
                      title + ' · ' + (tile.graph ? m.branch : m.read)
                    }
                  >
                    <span className="tile-eyebrow">
                      <span className="tile-dot" />
                      {tile.kind === 'research' ? (
                        <RotateCcw size={15} />
                      ) : tile.node === 'NOW' ? (
                        detailLevel === 'atlas' ? (
                          m.present
                        ) : (
                          data.asOf
                        )
                      ) : (
                        route?.number || node?.id
                      )}
                      {due && (
                        <span className="tile-review" title={m.due}>
                          <Clock3 size={14} />
                        </span>
                      )}
                    </span>
                    <span className="tile-title">
                      {tile.label ? m[tile.label] : node?.shortTitle || title}
                    </span>
                  </ButtonBase>
                  {canUnfold && !isTour && scale >= 0.7 && (
                    <ButtonBase
                      className="tile-expand"
                      onClick={() => expandNode(node!.id)}
                      aria-expanded={!!unfolded}
                      aria-label={
                        title +
                        ' · ' +
                        (unfolded ? m.collapseHere : m.expandHere)
                      }
                    >
                      {unfolded ? <Minus size={13} /> : <Plus size={13} />}
                      {unfolded ? m.collapseHere : m.expandHere}
                    </ButtonBase>
                  )}
                  {detailLevel === 'reading' && !!node?.topics?.length && (
                    <div className="tile-topics">
                      {node.topics.map((id) => (
                        <ButtonBase
                          key={id}
                          className="tile-topic"
                          onClick={() => onTerm(id)}
                          aria-label={
                            data.glossary[id].name + ' · ' + m.definition
                          }
                        >
                          {data.glossary[id].name.split('（')[0]}
                          <Info size={12} />
                        </ButtonBase>
                      ))}
                    </div>
                  )}
                </Paper>
              );
            })}
          </div>
        </div>
      </div>
      {mobileOverview && (
        <nav className="mobile-branch-picker" aria-label={m.routes}>
          <div className="mobile-present">{m.present}</div>
          <div className="mobile-branches">
            {data.routes.map((route) => (
              <ButtonBase
                key={route.id}
                className="mobile-branch"
                onClick={() => onRoute(route.id)}
                style={
                  { '--branch-color': routeColors[route.id] } as CSSProperties
                }
              >
                <strong>{route.shortTitle}</strong>
                <span>{route.preview.join(' · ')}</span>
              </ButtonBase>
            ))}
          </div>
        </nav>
      )}
      {canExpand && !isTour && (
        <Paper className="map-scope glass" elevation={0}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={expanded ? 'all' : 'summary'}
            onChange={(_, value: string | null) => {
              if (value) {
                setExpanded(value === 'all');
                setOpenNodes([]);
                setScopeVersion((n) => n + 1);
              }
            }}
            aria-label={m.displayScope}
          >
            <ToggleButton value="summary">{m.summaryView}</ToggleButton>
            <ToggleButton value="all">{m.allElements}</ToggleButton>
          </ToggleButtonGroup>
          <span className="scope-count">
            {nodeCount} {m.elements}
          </span>
          <Tooltip title={m.parallelGuide}>
            <IconButton
              aria-label={m.parallelGuide}
              onClick={() => setShowGuide(true)}
            >
              <Info size={18} />
            </IconButton>
          </Tooltip>
        </Paper>
      )}
      <div className="map-controls">
        <Paper
          className="zoom-controls glass"
          elevation={0}
          style={mobileOverview ? { visibility: 'hidden' } : undefined}
        >
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
      <Dialog
        open={showGuide}
        onClose={() => setShowGuide(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="modal-heading">
          <span>{m.parallelGuide}</span>
          <IconButton aria-label={m.close} onClick={() => setShowGuide(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent className="parallel-guide">
          <p>
            <strong>AND · {m.joint}</strong>
            {m.jointHelp}
          </p>
          <p>
            <strong>OR · {m.alternative}</strong>
            {m.alternativeHelp}
          </p>
          <p>{m.parallelHelp}</p>
          <p>
            <strong>
              {m.influence} / {m.mitigation}
            </strong>
            {m.influenceHelp}
          </p>
          <p>{m.fullMapHelp}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}

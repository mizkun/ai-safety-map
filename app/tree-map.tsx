'use client';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { ButtonBase, IconButton, Tooltip, Paper } from '@mui/material';
import {
  ArrowDown,
  ArrowRight,
  Plus,
  Minus,
  Maximize2,
  Scan,
  RotateCcw,
  Clock3,
  Info,
} from 'lucide-react';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import {
  treeLayout,
  wireGeometry,
  joinGeometry,
  forkGeometry,
  joinJunctions,
  cardPorts,
} from '@/lib/tree-layout';
import { reviewStatus } from '@/lib/freshness.mjs';
import { useMapGestures } from './use-map-gestures';
import { useMapWindow } from './use-map-window';
import { useMapCamera } from './use-map-camera';
import MapMinimap from './map-minimap';
import EvidenceMark, { evidenceLabel } from './evidence-mark';
import { evidenceSignal, evidenceBackgrounds } from '@/lib/current-evidence';
import { intersectsWindow } from '@/lib/map-window.mjs';
import {
  initialMapScale,
  initialMapCamera,
  zoomAnchor,
  scrollAtAnchor,
} from '@/lib/map-gestures.mjs';
import { tourCamera, tourContext } from '@/lib/map-tour';
import { connectionLabels } from '@/lib/connection-labels';
import { relationLabels } from '@/lib/relation-labels';
import {
  mapContext,
  type NavigationEntry,
  type NavigationState,
} from '@/lib/map-navigation';

type Props = {
  navigationState: NavigationState;
  restoration: NavigationEntry | null;
  onCameraChange: () => void;
  data: Content;
  view: string;
  expanded: boolean;
  today: string;
  messages: Messages;
  selected: string | null;
  onNode: (id: string) => void;
  onEvidence: (id: string) => void;
  onCurrent: () => void;
  onEdge: (id: string) => void;
  onRoute: (id: string) => void;
  onTerm: (id: string) => void;
  onGuide: () => void;
  focusRequest?: { id: string; serial: number } | null;
  tourFocus?: {
    key: string;
    nodes: string[];
    focus: string | null;
    detail?: boolean;
    edge?: string;
  } | null;
};
export default function TreeMap({
  navigationState,
  restoration,
  onCameraChange,
  data,
  view,
  expanded,
  today,
  messages: m,
  selected,
  onNode,
  onEvidence,
  onCurrent,
  onEdge,
  onRoute,
  onTerm,
  onGuide,
  focusRequest,
  tourFocus,
}: Props) {
  const [tracedEdge, setTracedEdge] = useState<string | null>(null);
  const cameraContext = useRef('');
  const restoredEntry = useRef<string | null>(null);
  const [size, setSize] = useState({ width: 1200, height: 900 });
  const [compact, setCompact] = useState(false);
  const isTour = Boolean(tourFocus);
  const highlightedTourNodes = tourFocus?.focus
    ? [tourFocus.focus]
    : tourFocus?.nodes || [];
  const phoneOverview = compact && view === 'overview' && !expanded && !isTour;
  const phoneWidth = compact ? size.width : undefined;
  const tourNodesKey = tourFocus
    ? tourContext(data, tourFocus.nodes, tourFocus.detail, view).join(',')
    : '';
  // Overview stays concise; each selected scenario shows its conditions from the start.
  const layout = useMemo(
    () =>
      treeLayout(
        data,
        view,
        view !== 'overview' || expanded,
        compact,
        phoneWidth,
        !isTour,
      ),
    [data, view, expanded, compact, phoneWidth, isTour],
  );
  const viewport = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => {
      // A desktop tour's sidebar must not turn the map into the phone layout.
      setCompact(window.innerWidth < 760);
      setSize((previous) => {
        const next = {
          width: element.clientWidth,
          height: element.clientHeight,
        };
        return next.width === previous.width && next.height === previous.height
          ? previous
          : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
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
  const tourTargets = tourFocus?.focus
    ? [tourFocus.focus]
    : size.width < 760 && tourFocus?.detail
      ? tourFocus.nodes
      : tourNodesKey
        ? tourNodesKey.split(',')
        : [];
  const tourDefaultCamera = tourFocus
    ? tourCamera(
        tourTargets?.length || tourFocus.edge
          ? layout.tiles.filter(
              (tile) =>
                (tile.node && tourTargets.includes(tile.node)) ||
                (tile.edge &&
                  (tile.edge === tourFocus.edge ||
                    (tourTargets.includes('H') &&
                      data.edges[tile.edge].to === 'H'))) ||
                (!compact &&
                  tourFocus.key.startsWith('start:') &&
                  tile.kind === 'route'),
            )
          : layout.tiles,
        size,
        layout,
        compact
          ? layout.tiles.find((tile) =>
              tourFocus.edge
                ? tile.edge === tourFocus.edge
                : tile.node === (tourFocus.focus || tourFocus.nodes[0]),
            )
          : undefined,
      )
    : null;
  const readableScale =
    tourDefaultCamera?.scale ?? initialMapScale(size, layout);
  const {
    scale,
    move: moveCamera,
    gestureScale,
  } = useMapCamera(viewport, readableScale, layout.width);
  const layoutKey = [layout.flow, layout.width, layout.height].join(':');
  const scaleContext =
    layoutKey +
    ':' +
    view +
    ':' +
    expanded +
    ':' +
    size.width +
    ':' +
    size.height +
    (tourFocus ? ':tour:' + tourFocus.key : '');
  useLayoutEffect(() => {
    const el = viewport.current;
    // Wait for the actual screen dimensions, so hydration never animates from a desktop-sized camera.
    if (!el || el.clientWidth !== size.width || el.clientHeight !== size.height)
      return;
    const saved = restoration?.snapshot.camera;
    const restoreRequested =
      restoration && restoredEntry.current !== restoration.id;
    if (
      restoreRequested &&
      saved?.context === mapContext(navigationState) &&
      saved.layout === layoutKey &&
      saved.width === size.width &&
      saved.height === size.height
    ) {
      moveCamera(saved, false);
    } else if (cameraContext.current !== scaleContext && tourDefaultCamera) {
      moveCamera(tourDefaultCamera, !!cameraContext.current);
    } else if (cameraContext.current !== scaleContext) {
      const anchor =
        layout.tiles.find((t) => t.node === 'NOW') || layout.tiles[0];
      moveCamera(
        initialMapCamera(size, layout, anchor),
        !!cameraContext.current,
      );
    }
    cameraContext.current = scaleContext;
    restoredEntry.current = restoration?.id || null;
  }, [
    layout,
    layoutKey,
    scale,
    scaleContext,
    size,
    tourDefaultCamera,
    readableScale,
    moveCamera,
    restoration,
    navigationState,
  ]);
  useEffect(() => onCameraChange(), [scale, onCameraChange]);
  const handledRequest = useRef<number | null>(null);
  useEffect(() => {
    const element = viewport.current;
    if (
      !focusRequest ||
      isTour ||
      focusRequest.serial === handledRequest.current ||
      !element ||
      element.clientWidth !== size.width ||
      element.clientHeight !== size.height
    )
      return;
    const tile = layout.tiles.find((t) => t.node === focusRequest.id);
    if (!tile) return;
    handledRequest.current = focusRequest.serial;
    const target = tourCamera([tile], size, layout);
    if (target) moveCamera(target);
  }, [focusRequest, isTour, layout, size, moveCamera]);
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
    moveCamera({
      scale: next,
      ...(next === fitScale
        ? { left: 0, top: 0 }
        : scrollAtAnchor(anchor, point, next, size.width, layout.width)),
    });
  }
  useMapGestures(viewport, {
    scale,
    contentWidth: layout.width,
    onScale: gestureScale,
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
      ports: cardPorts(layout),
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
  const annotations = useMemo(() => {
    const relations = relationLabels(layout, scale);
    return {
      relations,
      connections: connectionLabels(layout, data, scale, relations),
    };
  }, [layout, data, scale]);
  const minimapPath = useMemo(
    () =>
      [
        ...[...geometry.wires.values()].map((wire) => wire.path),
        ...[...geometry.forks.values()].flatMap((fork) => [
          fork.trunk,
          ...fork.branches.map((branch) => branch.path),
          fork.mergePath || '',
        ]),
        ...[...geometry.joins.values()].map((join) => join.path),
      ].join(' '),
    [geometry],
  );
  return (
    <>
      <div
        className={'tree-viewport' + (phoneOverview ? ' phone-overview' : '')}
        ref={viewport}
        data-map-context={mapContext(navigationState)}
        data-map-layout={layoutKey}
        data-map-scale={scale}
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
            className={
              'tree-content ' +
              (layout.flow === 'horizontal'
                ? 'horizontal-flow '
                : 'vertical-flow ') +
              'detail-' +
              detailLevel +
              (compact ? ' compact-layout' : '') +
              (isTour ? ' tour-map' : '') +
              (view === 'overview' && expanded && size.width >= 1000
                ? ' named-overview'
                : '')
            }
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
                        strokeWidth={w.reference ? 1.5 : 2}
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
                    onClick={() =>
                      label.edge ? onEdge(label.edge) : onGuide()
                    }
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
                  className="wire-button"
                  style={{ ...screen(join.x, join.y), color: join.color }}
                  onClick={() => onEdge(join.edge)}
                  aria-label={
                    m.connection + ' · ' + data.edges[join.edge].label
                  }
                >
                  {layout.flow === 'horizontal' ? (
                    <ArrowRight size={16} />
                  ) : (
                    <ArrowDown size={16} />
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
                      className="connection-control"
                      style={{
                        ...screen(label.centerX / scale, label.centerY / scale),
                        width: label.width,
                        height: label.height,
                        color:
                          label.relation === 'mitigation'
                            ? '#348773'
                            : undefined,
                      }}
                      onClick={() => onEdge(label.edge)}
                      aria-label={
                        m.connection + ' · ' + data.edges[label.edge].label
                      }
                      onPointerEnter={() => setTracedEdge(label.edge)}
                      onPointerLeave={() => setTracedEdge(null)}
                      onFocus={() => setTracedEdge(label.edge)}
                      onBlur={() => setTracedEdge(null)}
                    >
                      {label.relation === 'mitigation' ? (
                        <Minus size={Math.min(14, label.height - 4)} />
                      ) : label.relation === 'feedback' ? (
                        <RotateCcw size={Math.min(14, label.height - 4)} />
                      ) : (
                        <DirectionIcon size={Math.min(14, label.height - 4)} />
                      )}
                    </ButtonBase>
                  </Tooltip>
                );
              })}
            {visibleTiles.map((tile) => {
              const node = tile.node ? data.nodes[tile.node] : undefined;
              const edge = tile.edge ? data.edges[tile.edge] : undefined;
              const tourHighlight =
                highlightedTourNodes.includes(tile.node || '') ||
                Boolean(tile.edge && tile.edge === tourFocus?.edge);
              const route = tile.graph
                ? data.routes.find((r) => r.id === tile.graph)
                : undefined;
              const title = tile.label
                ? m[tile.label]
                : node?.title || edge?.label || route?.shortTitle || '';
              const due =
                node && reviewStatus(node.review, today).state === 'due';
              const showId =
                detailLevel === 'reading' &&
                node &&
                node.id !== 'NOW' &&
                !tile.graph;
              const signal =
                navigationState.lens && node && node.id !== 'NOW' && !tile.graph
                  ? evidenceSignal(node.status)
                  : null;
              return (
                <Paper
                  elevation={0}
                  key={tile.key}
                  className={
                    'tree-tile tile-' +
                    tile.kind +
                    (showId ? ' tile-identified' : '') +
                    (signal ? ' tile-evidence-color' : '') +
                    (signal && scale >= 0.5 ? ' tile-evidence' : '') +
                    (selected === tile.node ? ' tile-selected' : '') +
                    (tile.node === 'X' ? ' tile-terminal' : '') +
                    (tile.node === 'NOW' ? ' tile-present' : '') +
                    (tourHighlight
                      ? ' tile-tour-focus'
                      : isTour && tile.kind !== 'route' && tile.node !== 'NOW'
                        ? ' tile-tour-context'
                        : '')
                  }
                  style={
                    {
                      ...screen(tile.x, tile.y),
                      width: tile.width * scale,
                      height: tile.height * scale,
                      '--branch-color': tile.color,
                      '--evidence-background': signal
                        ? evidenceBackgrounds[signal]
                        : undefined,
                    } as CSSProperties
                  }
                >
                  {showId && <span className="node-id tile-id">{node.id}</span>}
                  {signal && node && scale >= 0.5 && (
                    <div className="tile-signals">
                      <Tooltip
                        title={
                          evidenceLabel(signal, m) + ' · ' + node.shortTitle
                        }
                      >
                        <ButtonBase
                          className="tile-evidence-button"
                          onClick={() => onEvidence(node.id)}
                          aria-label={
                            node.id + ' · ' + evidenceLabel(signal, m)
                          }
                        >
                          <EvidenceMark signal={signal} size={15} />
                        </ButtonBase>
                      </Tooltip>
                      {data.current.safeguards[node.id] && (
                        <Tooltip title={m.signalMitigation}>
                          <ButtonBase
                            className="tile-safeguard-button"
                            onClick={() => onEvidence(node.id)}
                            aria-label={node.id + ' · ' + m.signalMitigation}
                          >
                            <EvidenceMark signal="mitigation" size={15} />
                          </ButtonBase>
                        </Tooltip>
                      )}
                    </div>
                  )}
                  <ButtonBase
                    className="tile-open"
                    aria-current={tourHighlight ? 'step' : undefined}
                    onClick={() => {
                      if (navigationState.lens && node?.id === 'NOW') {
                        onCurrent();
                        return;
                      }
                      if (scale < 0.7 && !tile.graph) {
                        const next = Math.max(0.85, readableScale);
                        moveCamera({
                          scale: next,
                          left:
                            (tile.x + tile.width / 2) * next +
                            Math.max(
                              0,
                              (size.width - layout.width * next) / 2,
                            ) -
                            size.width / 2,
                          top:
                            (tile.y + tile.height / 2) * next - size.height / 2,
                        });
                      } else if (tile.edge) onEdge(tile.edge);
                      else if (tile.graph) onRoute(tile.graph);
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
                        route?.number || node?.id || tile.edge
                      )}
                      {due && (
                        <span className="tile-review" title={m.due}>
                          <Clock3 size={14} />
                        </span>
                      )}
                    </span>
                    <span className="tile-title">
                      {tile.shortLabel
                        ? m[tile.shortLabel]
                        : tile.label
                          ? m[tile.label]
                          : node?.shortTitle || title}
                    </span>
                  </ButtonBase>
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
            {scale >= 0.5 &&
              geometry.ports
                .filter((port) =>
                  intersectsWindow(
                    { x: port.x - 6, y: port.y - 6, width: 12, height: 12 },
                    visible,
                  ),
                )
                .map((port) => (
                  <span
                    key={port.key}
                    className="card-port"
                    aria-hidden="true"
                    data-node={port.node}
                    style={{ ...screen(port.x, port.y), color: port.color }}
                  />
                ))}
          </div>
        </div>
      </div>
      {isTour && (
        <MapMinimap
          layout={layout}
          path={minimapPath}
          highlighted={highlightedTourNodes.join(',')}
          viewport={viewport}
          scale={scale}
          messages={m}
          title={
            data.routes.find((route) => route.id === view)?.shortTitle ||
            m.overviewLabel
          }
          onMove={moveCamera}
        />
      )}
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
      </div>
    </>
  );
}

'use client';
import { connectionLabels } from '@/lib/connection-labels';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import {
  initialMapCamera,
  initialMapScale,
  scrollAtAnchor,
  zoomAnchor,
} from '@/lib/map-gestures.mjs';
import {
  mapContext,
  type NavigationEntry,
  type NavigationState,
} from '@/lib/map-navigation';
import { tourCamera, tourContext } from '@/lib/map-tour';
import { intersectsWindow } from '@/lib/map-window.mjs';
import { relationLabels } from '@/lib/relation-labels';
import { treeLayout } from '@/lib/tree-layout';
import { minimapPaths, treeGeometry } from '@/lib/tree-rendering';
import type { TreeTile } from '@/lib/tree-types';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { Maximize2, Minus, Plus, Scan } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import MapCard from './diagram/map-card';
import MapConnections from './diagram/map-connections';
import MapMinimap from './map-minimap';
import { useMapCamera } from './use-map-camera';
import { useMapGestures } from './use-map-gestures';
import { useMapWindow } from './use-map-window';

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
  const tourEdge = tourFocus?.edge ? data.edges[tourFocus.edge] : undefined;
  const tourTargets = tourEdge
    ? [...new Set([tourEdge.from, ...(tourEdge.requires || []), tourEdge.to])]
    : tourFocus?.focus
      ? [tourFocus.focus]
      : size.width < 760 && tourFocus?.detail
        ? tourFocus.nodes
        : tourNodesKey
          ? tourNodesKey.split(',')
          : [];
  const tourEdgeColor =
    layout.wires.find((w) => w.edge === tourFocus?.edge)?.color ||
    layout.joins?.find((j) => j.edge === tourFocus?.edge)?.color;
  const tourDefaultCamera = tourFocus
    ? tourCamera(
        tourTargets.length
          ? layout.tiles.filter(
              (tile) =>
                (tile.node && tourTargets.includes(tile.node)) ||
                (!compact &&
                  tourFocus.key.startsWith('start:') &&
                  tile.kind === 'route'),
            )
          : layout.tiles,
        size,
        layout,
        compact && !tourEdge
          ? layout.tiles.find(
              (tile) => tile.node === (tourFocus.focus || tourFocus.nodes[0]),
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
  const geometry = useMemo(() => treeGeometry(layout), [layout]);
  const annotations = useMemo(() => {
    const relations = relationLabels(layout, scale);
    return {
      relations,
      connections: connectionLabels(layout, data, scale, relations),
    };
  }, [layout, data, scale]);
  const minimapPath = useMemo(() => minimapPaths(geometry), [geometry]);
  function activateTile(tile: TreeTile) {
    const node = tile.node ? data.nodes[tile.node] : undefined;

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
          Math.max(0, (size.width - layout.width * next) / 2) -
          size.width / 2,
        top: (tile.y + tile.height / 2) * next - size.height / 2,
      });
    } else if (tile.graph) onRoute(tile.graph);
    else onNode(tile.node!);
  }
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
                '--tour-edge-color': tourEdgeColor,
              } as CSSProperties
            }
          >
            <MapConnections
              layout={layout}
              data={data}
              m={m}
              scale={scale}
              screen={screen}
              geometry={geometry}
              visible={visible}
              paint={paint}
              annotations={annotations}
              tourFocus={tourFocus}
              tracedEdge={tracedEdge}
              onTrace={setTracedEdge}
              onEdge={onEdge}
              onGuide={onGuide}
            />
            {visibleTiles.map((tile) => (
              <MapCard
                key={tile.key}
                tile={tile}
                data={data}
                m={m}
                today={today}
                selected={selected}
                highlightedTourNodes={highlightedTourNodes}
                isTour={isTour}
                navigationState={navigationState}
                detailLevel={detailLevel}
                scale={scale}
                screen={screen}
                onEvidence={onEvidence}
                onTerm={onTerm}
                onActivate={() => activateTile(tile)}
              />
            ))}
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
          highlighted={(tourEdge ? tourTargets : highlightedTourNodes).join(
            ',',
          )}
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

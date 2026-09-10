'use client';
import {
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { Button, ButtonBase, IconButton, Paper } from '@mui/material';
import {
  ArrowLeft,
  ArrowRight,
  CornerDownRight,
  Crosshair,
  X,
} from 'lucide-react';
import type { Content } from '@/lib/content-types';
import { formatMessage, type Messages } from '@/lib/i18n';
import {
  tourNavigation,
  tourKeyDirection,
  type TourStop,
} from '@/lib/map-tour';
import { routeColors } from '@/lib/tree-layout';

type Props = {
  data: Content;
  m: Messages;
  stops: TourStop[];
  index: number;
  ready: boolean;
  keyboardEnabled: boolean;
  loading: ReactNode;
  focus: string | null;
  onMove: (index: number) => void;
  onClose: () => void;
  onFocus: (id: string | null) => void;
  onRead: (id: string) => void;
  onHeight: (height: number) => void;
  richText: (text: string) => ReactNode;
};

export default function MapTour({
  data,
  m,
  stops,
  index,
  ready,
  keyboardEnabled,
  loading,
  focus,
  onMove,
  onClose,
  onFocus,
  onRead,
  onHeight,
  richText,
}: Props) {
  const panel = useRef<HTMLElement>(null);
  const body = useRef<HTMLElement>(null);
  const advance = useCallback(
    (direction: number) => {
      const next = index + direction;
      if (next >= stops.length) onClose();
      else if (next >= 0) onMove(next);
    },
    [index, stops.length, onClose, onMove],
  );
  const current = useRef({ index, onMove, onClose, advance });
  useLayoutEffect(() => {
    current.current = { index, onMove, onClose, advance };
  }, [index, onMove, onClose, advance]);
  const stop = stops[index] || stops[0];
  const route = data.routes.find((r) => r.id === stop.view);
  const navigation = tourNavigation(stops, index);
  const routePages = navigation.steps;
  const chapter = data.stories[stop.view]?.chapters[stop.chapter];
  const node = stop.node ? data.nodes[stop.node] : null;
  const title =
    stop.kind === 'start'
      ? m.tourStartTitle
      : stop.kind === 'finish'
        ? m.tourFinishTitle
        : node?.title || chapter?.title;
  const prose =
    stop.kind === 'start'
      ? m.tourStartText
      : stop.kind === 'finish'
        ? m.tourFinishText
        : node
          ? node.body['概要']
          : chapter?.text;
  const nextLabel = {
    begin: m.tourBegin,
    step: m.tourNextStep,
    scenario: m.tourNextScenario,
    finish: m.tourWrapUp,
    exit: m.tourFinish,
  }[navigation.nextKind];
  function choose(position: number) {
    onMove(position);
    body.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!ready || !keyboardEnabled) return;
    const focusFrame = requestAnimationFrame(() =>
      body.current?.focus({ preventScroll: true }),
    );
    const keydown = (event: KeyboardEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const interactive =
        Boolean(
          element?.closest(
            'input, textarea, select, [contenteditable="true"], [role="combobox"], [role="menu"]',
          ),
        ) ||
        (event.key === 'Enter' && Boolean(element?.closest('button, a')));
      const direction = tourKeyDirection(
        event.key,
        event.defaultPrevented ||
          event.isComposing ||
          event.repeat ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey,
        interactive,
      );
      if (!direction) return;
      event.preventDefault();
      current.current.advance(direction);
    };
    document.addEventListener('keydown', keydown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', keydown);
    };
  }, [ready, keyboardEnabled, stops.length]);
  useEffect(() => {
    if (!panel.current) return;
    const observer = new ResizeObserver(([entry]) =>
      onHeight(entry.target.getBoundingClientRect().height),
    );
    observer.observe(panel.current);
    return () => {
      observer.disconnect();
    };
  }, [onHeight]);
  useLayoutEffect(() => {
    // Replace the step before paint. Scrolling only reads the current step.
    body.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [stop.key, ready]);
  return (
    <>
      <Paper
        component="section"
        ref={panel}
        elevation={0}
        className="tour-panel"
        aria-label={m.tour}
        style={
          {
            '--tour-color': routeColors[stop.view] || '#5156a6',
          } as CSSProperties
        }
      >
        <header className="tour-location">
          <div className="tour-route-row">
            <select
              id="tour-route"
              aria-label={m.tourJump}
              className="tour-route-select"
              disabled={!ready}
              value={route ? stop.view : stop.kind}
              onChange={(e) =>
                choose(
                  stops.findIndex(
                    (s) =>
                      s.view === e.target.value || s.kind === e.target.value,
                  ),
                )
              }
            >
              <option value="start">{m.present}</option>
              <optgroup label={m.scenarioGroup}>
                {data.routes
                  .filter((r) => r.role !== 'factor')
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.shortTitle}
                    </option>
                  ))}
              </optgroup>
              <option value="finish">{m.tourFinishTitle}</option>
            </select>
            {route && (
              <span className="tour-count" aria-label={m.tourScenario}>
                {formatMessage(m.tourChapter, {
                  current: navigation.scenarioIndex + 1,
                  total: navigation.scenarioCount,
                })}
              </span>
            )}
            <IconButton aria-label={m.tourExit} onClick={onClose}>
              <X size={18} />
            </IconButton>
          </div>
          {route && (
            <div className="tour-step-picker">
              <CornerDownRight
                className="tour-nesting"
                size={18}
                aria-hidden="true"
              />
              <div className="tour-step-group">
                <select
                  id="tour-step"
                  className="tour-step-select"
                  aria-label={m.tourChapters}
                  value={index}
                  onChange={(e) => choose(Number(e.target.value))}
                >
                  {data.stories[route.id].chapters.map(
                    (chapter, chapterIndex) => (
                      <optgroup key={chapterIndex} label={chapter.title}>
                        {routePages
                          .filter(({ step }) => step.chapter === chapterIndex)
                          .map(({ step, position }) => (
                            <option key={step.key} value={position}>
                              {step.node
                                ? data.nodes[step.node].shortTitle
                                : chapter.title}
                            </option>
                          ))}
                      </optgroup>
                    ),
                  )}
                </select>
                <output
                  className="tour-count"
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={formatMessage(m.stepOf, {
                    current: navigation.stepIndex + 1,
                    total: routePages.length,
                  })}
                >
                  {formatMessage(m.tourChapter, {
                    current: navigation.stepIndex + 1,
                    total: routePages.length,
                  })}
                </output>
              </div>
            </div>
          )}
        </header>
        {/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- This named scroll region needs keyboard focus for reading and chapter shortcuts. */}
        <section
          className="tour-body"
          ref={body}
          tabIndex={0}
          aria-label={m.tourReading}
        >
          {!ready ? (
            loading
          ) : (
            <article
              key={stop.key}
              className="tour-chapter is-reading"
              aria-current="step"
              aria-labelledby="tour-step-title"
            >
              <div className="tour-node-heading">
                <h2 id="tour-step-title">{title}</h2>
                {node && <span className="node-id">{node.id}</span>}
              </div>
              <div className="tour-prose">
                {(prose || '').split(/\n\n+/).map((paragraph, i) => (
                  <p key={i}>{richText(paragraph)}</p>
                ))}
              </div>
              {node && (
                <div className="tour-node-context">
                  <h3>{m.whyNext}</h3>
                  {node.body['他の条件との関係']
                    .split(/\n\n+/)
                    .map((paragraph, i) => (
                      <p key={i}>{richText(paragraph)}</p>
                    ))}
                  <h3>{m.evidence}</h3>
                  {node.body['現在の状況']
                    .split(/\n\n+/)
                    .map((paragraph, i) => (
                      <p key={i}>{richText(paragraph)}</p>
                    ))}
                  <Button
                    className="tour-read"
                    onClick={() => onRead(node.id)}
                    endIcon={<ArrowRight size={14} />}
                  >
                    {m.read}
                  </Button>
                </div>
              )}
              {!node && !!stop.nodes.length && (
                <div className="tour-node-list" aria-label={m.tourFocus}>
                  {stop.nodes.map((id) => (
                    <ButtonBase
                      key={id}
                      aria-pressed={focus === id}
                      onClick={() => {
                        const detail = stops.findIndex(
                          (s) => s.view === stop.view && s.node === id,
                        );
                        if (detail >= 0) {
                          choose(detail);
                          return;
                        }
                        onFocus(focus === id ? null : id);
                      }}
                    >
                      <Crosshair size={13} />
                      <span>{data.nodes[id].shortTitle}</span>
                    </ButtonBase>
                  ))}
                </div>
              )}
              {!node && focus && (
                <Button
                  className="tour-read"
                  onClick={() => onRead(focus)}
                  endIcon={<ArrowRight size={14} />}
                >
                  {m.tourRead}
                </Button>
              )}
              {stop.kind === 'start' && (
                <small className="tour-note">{m.tourOrderNote}</small>
              )}
              {stop.kind === 'chapter' &&
                stop.chapter ===
                  data.stories[stop.view].chapters.length - 1 && (
                  <div className="tour-outlook">
                    <strong>{m.tourNews}</strong>
                    <p>{richText(data.stories[stop.view].outlook)}</p>
                  </div>
                )}
            </article>
          )}
        </section>
        {/* oxlint-enable jsx-a11y/no-noninteractive-tabindex */}
        <footer className="tour-navigation">
          <Button
            disabled={!index}
            startIcon={<ArrowLeft size={16} />}
            onClick={() => advance(-1)}
          >
            {m.previous}
          </Button>
          {index < stops.length - 1 ? (
            <Button
              variant="contained"
              disableElevation
              disabled={!ready}
              endIcon={<ArrowRight size={16} />}
              onClick={() => advance(1)}
            >
              {nextLabel}
            </Button>
          ) : (
            <Button variant="contained" disableElevation onClick={onClose}>
              {m.tourFinish}
            </Button>
          )}
        </footer>
      </Paper>
    </>
  );
}

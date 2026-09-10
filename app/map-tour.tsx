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
import { ArrowLeft, ArrowRight, Crosshair, X } from 'lucide-react';
import type { Content } from '@/lib/content-types';
import { formatMessage, type Messages } from '@/lib/i18n';
import {
  readingChapter,
  readingContinuation,
  tourKeyDirection,
  type TourStop,
} from '@/lib/map-tour';
import { routeColors } from '@/lib/tree-layout';
import TourLocator from './tour-locator';

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
  const chapters = useRef(new Map<number, HTMLElement>());
  const reading = useRef<number | null>(null);
  const frame = useRef(0);
  const advance = useCallback(
    (direction: number) => {
      const element = body.current,
        chapter = chapters.current.get(index);
      if (direction > 0 && element && chapter) {
        const continuation = readingContinuation(
          element.scrollTop,
          element.clientHeight,
          chapter.offsetTop + chapter.offsetHeight,
        );
        if (continuation !== null) {
          element.scrollTo({ top: continuation, behavior: 'instant' });
          return;
        }
      }
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
  const routePages = stops
    .map((step, position) => ({ step, position }))
    .filter(
      ({ step }) =>
        step.view === stop.view && ['chapter', 'node'].includes(step.kind),
    );
  const pages = stops
    .map((step, position) => ({ step, position }))
    .filter(({ step }) =>
      route
        ? step.view === stop.view &&
          step.chapter === stop.chapter &&
          ['chapter', 'node'].includes(step.kind)
        : step.key === stop.key,
    );
  useEffect(() => {
    if (!panel.current) return;
    const observer = new ResizeObserver(([entry]) =>
      onHeight(entry.target.getBoundingClientRect().height),
    );
    observer.observe(panel.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [onHeight]);
  useLayoutEffect(() => {
    // Scrolling the prose moves the diagram; button navigation starts at the chapter heading.
    if (reading.current !== index)
      body.current?.scrollTo({
        top: chapters.current.get(index)?.offsetTop || 0,
        behavior: 'instant',
      });
    reading.current = null;
  }, [index, stop.view, ready]);
  function onScroll() {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = body.current;
      if (!el || !ready) return;
      const next = readingChapter(
        el.scrollTop,
        el.clientHeight,
        [...chapters.current].map(([position, section]) => ({
          index: position,
          top: section.offsetTop,
          height: section.offsetHeight,
        })),
      );
      if (next !== current.current.index) {
        reading.current = next;
        current.current.onMove(next);
      }
    });
  }
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
        <header className="tour-heading">
          <nav className="tour-breadcrumb" aria-label={m.breadcrumb}>
            <ButtonBase onClick={() => choose(0)}>{m.overviewLabel}</ButtonBase>
            {route && (
              <>
                <span aria-hidden="true">›</span>
                <strong>{route.shortTitle}</strong>
              </>
            )}
          </nav>
          <IconButton aria-label={m.tourExit} onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>
        <div className="tour-location">
          <TourLocator
            data={data}
            stop={focus ? { ...stop, nodes: [focus] } : stop}
            label={m.overviewLabel}
            onOverview={() => choose(0)}
          />
          <div className="tour-route-picker">
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
              <select
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
            )}
          </div>
        </div>
        {/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- This named scroll region needs keyboard focus for reading and chapter shortcuts. */}
        <section
          className="tour-body"
          ref={body}
          onScroll={onScroll}
          tabIndex={0}
          aria-label={m.tourReading}
        >
          {!ready
            ? loading
            : pages.map(({ step, position }) => {
                const chapter = data.stories[step.view]?.chapters[step.chapter];
                const node = step.node ? data.nodes[step.node] : null;
                const title =
                  step.kind === 'start'
                    ? m.tourStartTitle
                    : step.kind === 'finish'
                      ? m.tourFinishTitle
                      : node?.title || chapter?.title;
                const prose =
                  step.kind === 'start'
                    ? m.tourStartText
                    : step.kind === 'finish'
                      ? m.tourFinishText
                      : node
                        ? node.body['概要']
                        : chapter?.text;
                const active = position === index;
                return (
                  <article
                    key={step.key}
                    className={'tour-chapter' + (active ? ' is-reading' : '')}
                    ref={(el) => {
                      if (el) chapters.current.set(position, el);
                      else chapters.current.delete(position);
                    }}
                    aria-current={active ? 'step' : undefined}
                  >
                    <div className="tour-chapter-heading">
                      <span className="tour-scene-number" aria-hidden="true">
                        {String(
                          route
                            ? routePages.findIndex(
                                (page) => page.position === position,
                              ) + 1
                            : step.kind === 'start'
                              ? 0
                              : 8,
                        ).padStart(2, '0')}
                      </span>
                      <span>
                        {route?.role === 'factor'
                          ? m.optionalFactor
                          : node
                            ? node.id
                            : step.kind === 'chapter'
                              ? m.overviewLabel
                              : m.overview}
                      </span>
                    </div>
                    <h2>{title}</h2>
                    <div className="tour-prose">
                      {(prose || '').split(/\n\n+/).map((paragraph, i) => (
                        <p key={i}>{richText(paragraph)}</p>
                      ))}
                    </div>
                    {node && (
                      <div className="tour-node-context">
                        <h3>{m.whyNext}</h3>
                        <p>{richText(node.body['他の条件との関係'])}</p>
                        <h3>{m.evidence}</h3>
                        <p>{richText(node.body['現在の状況'])}</p>
                        <Button
                          className="tour-read"
                          onClick={() => onRead(node.id)}
                          endIcon={<ArrowRight size={14} />}
                        >
                          {m.read}
                        </Button>
                      </div>
                    )}
                    {!node && !!step.nodes.length && (
                      <div className="tour-node-list" aria-label={m.tourFocus}>
                        {step.nodes.map((id) => (
                          <ButtonBase
                            key={id}
                            aria-pressed={active && focus === id}
                            onClick={() => {
                              const detail = stops.findIndex(
                                (s) => s.view === step.view && s.node === id,
                              );
                              if (detail >= 0) {
                                choose(detail);
                                return;
                              }
                              if (!active) onMove(position);
                              onFocus(active && focus === id ? null : id);
                            }}
                          >
                            <Crosshair size={13} />
                            <span>{data.nodes[id].shortTitle}</span>
                          </ButtonBase>
                        ))}
                      </div>
                    )}
                    {!node && active && focus && (
                      <Button
                        className="tour-read"
                        onClick={() => onRead(focus)}
                        endIcon={<ArrowRight size={14} />}
                      >
                        {m.tourRead}
                      </Button>
                    )}
                    {step.kind === 'start' && (
                      <small className="tour-note">{m.tourOrderNote}</small>
                    )}
                    {step.kind === 'chapter' &&
                      step.chapter ===
                        data.stories[step.view].chapters.length - 1 && (
                        <div className="tour-outlook">
                          <strong>{m.tourNews}</strong>
                          <p>{richText(data.stories[step.view].outlook)}</p>
                        </div>
                      )}
                  </article>
                );
              })}
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
          <output aria-live="polite" aria-atomic="true">
            {route
              ? formatMessage(m.stepOf, {
                  current:
                    routePages.findIndex((page) => page.position === index) + 1,
                  total: routePages.length,
                })
              : m.tour}
          </output>
          {index < stops.length - 1 ? (
            <Button
              variant="contained"
              disableElevation
              disabled={!ready}
              endIcon={<ArrowRight size={16} />}
              onClick={() => advance(1)}
            >
              {m.next}
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

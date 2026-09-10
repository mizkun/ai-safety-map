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
import { ArrowDown, ArrowLeft, ArrowRight, Crosshair, X } from 'lucide-react';
import type { Content } from '@/lib/content-types';
import { formatMessage, type Messages } from '@/lib/i18n';
import {
  readingChapter,
  readingContinuation,
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
  const pages = stops
    .map((step, position) => ({ step, position }))
    .filter(({ step }) =>
      stop.kind === 'chapter'
        ? step.kind === 'chapter' && step.view === stop.view
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
          <label htmlFor="tour-route">{m.tourJump}</label>
          <IconButton aria-label={m.tourExit} onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>
        <div className="tour-route-picker">
          <select
            id="tour-route"
            className="tour-route-select"
            disabled={!ready}
            value={stop.kind === 'chapter' ? stop.view : stop.kind}
            onChange={(e) =>
              onMove(
                stops.findIndex(
                  (s) => s.view === e.target.value || s.kind === e.target.value,
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
            <optgroup label={m.optionalFactor}>
              {data.routes
                .filter((r) => r.role === 'factor')
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.shortTitle}
                  </option>
                ))}
            </optgroup>
            <option value="finish">{m.tourFinishTitle}</option>
          </select>
          <span className="tour-reading-hint">
            <kbd>Enter</kbd>
            <kbd>→</kbd>
            {m.next}
            <span>·</span>
            <ArrowDown size={13} />
            {m.tourScroll}
          </span>
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
                const title =
                  step.kind === 'start'
                    ? m.tourStartTitle
                    : step.kind === 'finish'
                      ? m.tourFinishTitle
                      : chapter?.title;
                const prose =
                  step.kind === 'start'
                    ? m.tourStartText
                    : step.kind === 'finish'
                      ? m.tourFinishText
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
                          step.kind === 'chapter'
                            ? step.chapter + 1
                            : step.kind === 'start'
                              ? 0
                              : 8,
                        ).padStart(2, '0')}
                      </span>
                      <span>
                        {route?.role === 'factor'
                          ? m.optionalFactor
                          : step.kind === 'chapter'
                            ? m.tourScene
                            : m.overview}
                      </span>
                    </div>
                    <h2>{title}</h2>
                    <div className="tour-prose">
                      {(prose || '').split(/\n\n+/).map((paragraph, i) => (
                        <p key={i}>{richText(paragraph)}</p>
                      ))}
                    </div>
                    {!!step.nodes.length && (
                      <div className="tour-node-list" aria-label={m.tourFocus}>
                        {step.nodes.map((id) => (
                          <ButtonBase
                            key={id}
                            aria-pressed={active && focus === id}
                            onClick={() => {
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
                    {active && focus && (
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
        <nav className="tour-chapter-track" aria-label={m.tourChapters}>
          {pages.map(({ step, position }) => (
            <ButtonBase
              key={step.key}
              aria-label={
                step.kind === 'chapter'
                  ? data.stories[step.view].chapters[step.chapter].title
                  : m.present
              }
              aria-current={position === index ? 'step' : undefined}
              onClick={() => onMove(position)}
            >
              <span />
            </ButtonBase>
          ))}
        </nav>
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
              ? formatMessage(m.tourChapter, {
                  current: stop.chapter + 1,
                  total: pages.length,
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
      <div className="tour-figure-caption" aria-hidden="true">
        <span className="tour-figure-dot" />
        {m.tourFigure}
      </div>
    </>
  );
}

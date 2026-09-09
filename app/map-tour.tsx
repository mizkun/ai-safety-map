'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Button,
  ButtonBase,
  IconButton,
  LinearProgress,
  Paper,
} from '@mui/material';
import { ArrowLeft, ArrowRight, Crosshair, X } from 'lucide-react';
import type { Content } from '@/lib/content-types';
import { formatMessage, type Messages } from '@/lib/i18n';
import type { TourStop } from '@/lib/map-tour';

type Props = {
  data: Content;
  m: Messages;
  stops: TourStop[];
  index: number;
  ready: boolean;
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
  const body = useRef<HTMLDivElement>(null);
  const stop = stops[index] || stops[0];
  const chapter = data.stories[stop.view]?.chapters[stop.chapter];
  const route = data.routes.find((r) => r.id === stop.view);
  const title =
    stop.kind === 'start'
      ? m.tourStartTitle
      : stop.kind === 'finish'
        ? m.tourFinishTitle
        : chapter?.title;
  const text =
    stop.kind === 'start'
      ? m.tourStartText
      : stop.kind === 'finish'
        ? m.tourFinishText
        : chapter?.text;
  useEffect(() => {
    if (!panel.current) return;
    const observer = new ResizeObserver(([entry]) =>
      onHeight(entry.target.getBoundingClientRect().height),
    );
    observer.observe(panel.current);
    return () => observer.disconnect();
  }, [onHeight]);
  useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [stop.key]);
  return (
    <Paper
      component="section"
      ref={panel}
      elevation={0}
      className="tour-panel"
      aria-label={m.tour}
    >
      <header className="tour-heading">
        <strong>{m.tour}</strong>
        <span>{ready ? `${index + 1} / ${stops.length}` : ''}</span>
        <IconButton aria-label={m.tourExit} onClick={onClose}>
          <X size={18} />
        </IconButton>
      </header>
      <LinearProgress
        variant="determinate"
        value={ready ? ((index + 1) / stops.length) * 100 : 0}
      />
      <div className="tour-body" ref={body}>
        <label className="tour-route-label" htmlFor="tour-route">
          {m.tourJump}
        </label>
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
          {data.routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.number} · {r.shortTitle}
            </option>
          ))}
          <option value="finish">{m.tourFinishTitle}</option>
        </select>
        <div aria-live="polite" aria-atomic="true">
          {route && (
            <p className="tour-chapter-count">
              {formatMessage(m.tourChapter, {
                current: stop.chapter + 1,
                total: data.stories[stop.view].chapters.length,
              })}
            </p>
          )}
          <h2>{title}</h2>
          <p className="tour-prose">{richText(text || '')}</p>
        </div>
        {!ready ? (
          loading
        ) : (
          <>
            {!!stop.nodes.length && (
              <div className="tour-node-list" aria-label={m.tourFocus}>
                {stop.nodes.map((id) => (
                  <ButtonBase
                    key={id}
                    aria-pressed={focus === id}
                    onClick={() => onFocus(focus === id ? null : id)}
                  >
                    <Crosshair size={13} />
                    <span>{data.nodes[id].shortTitle}</span>
                  </ButtonBase>
                ))}
              </div>
            )}
            {focus && (
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
          </>
        )}
      </div>
      <footer className="tour-navigation">
        <Button
          disabled={!index}
          startIcon={<ArrowLeft size={16} />}
          onClick={() => onMove(index - 1)}
        >
          {m.previous}
        </Button>
        {index < stops.length - 1 ? (
          <Button
            variant="contained"
            disableElevation
            disabled={!ready}
            endIcon={<ArrowRight size={16} />}
            onClick={() => onMove(index + 1)}
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
  );
}

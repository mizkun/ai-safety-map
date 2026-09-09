'use client';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { mapWindow } from '@/lib/map-window.mjs';

type Viewport = { left: number; top: number; width: number; height: number };
export function useMapWindow(
  viewport: RefObject<HTMLDivElement | null>,
  scale: number,
  width: number,
  height: number,
) {
  const [snapshot, setSnapshot] = useState<Viewport | null>(null);
  const current = useRef({ scale, width, height });
  const refresh = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    current.current = { scale, width, height };
    refresh.current();
  }, [scale, width, height]);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { scale, width, height } = current.current;
        const next = {
          left: el.scrollLeft,
          top: el.scrollTop,
          width: el.clientWidth,
          height: el.clientHeight,
        };
        const bounds = mapWindow(next, scale, width, height);
        setSnapshot((previous) => {
          if (!previous) return next;
          const old = mapWindow(previous, scale, width, height);
          return previous.width === next.width &&
            previous.height === next.height &&
            Object.keys(bounds).every(
              (key) =>
                old[key as keyof typeof old] ===
                bounds[key as keyof typeof bounds],
            )
            ? previous
            : next;
        });
      });
    };
    refresh.current = update;
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => {
      refresh.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, [viewport]);
  // Recompute with the current scale immediately: never paint an old, huge world window for one frame.
  return snapshot ? mapWindow(snapshot, scale, width, height) : null;
}

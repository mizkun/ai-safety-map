'use client';
import { useEffect, useState, type RefObject } from 'react';
import { mapWindow } from '@/lib/map-window.mjs';

export function useMapWindow(viewport: RefObject<HTMLDivElement | null>, scale: number, width: number, height: number) {
  const [window, setWindow] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = mapWindow({ left: el.scrollLeft, top: el.scrollTop, width: el.clientWidth, height: el.clientHeight }, scale, width, height);
        setWindow((previous) => previous && Object.keys(next).every((key) => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
      });
    };
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener('scroll', update); };
  }, [viewport, scale, width, height]);
  return window;
}

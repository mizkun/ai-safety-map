'use client';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { cameraAnimator, cameraFrame } from '@/lib/map-camera.mjs';

type Camera = { scale: number; left: number; top: number };
export function useMapCamera(
  viewport: RefObject<HTMLDivElement | null>,
  initialScale: number,
  contentWidth: number,
) {
  const [scale, setScale] = useState(initialScale);
  const currentScale = useRef(initialScale);
  const pending = useRef<Camera | null>(null);
  const animation = useRef<ReturnType<typeof cameraAnimator> | null>(null);
  const stop = useCallback(() => animation.current?.stop(), []);
  useLayoutEffect(() => {
    currentScale.current = scale;
    const frame = pending.current;
    if (frame && viewport.current && frame.scale === scale) {
      viewport.current.scrollTo({
        left: frame.left,
        top: frame.top,
        behavior: 'instant',
      });
      pending.current = null;
    }
  }, [scale, viewport]);
  function move(target: Camera, animate = true) {
    const el = viewport.current;
    if (!el) return;
    animation.current ??= cameraAnimator(
      requestAnimationFrame,
      cancelAnimationFrame,
    );
    const from = {
      scale: currentScale.current,
      left: el.scrollLeft,
      top: el.scrollTop,
    };
    const duration =
      animate && !matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 360
        : 0;
    animation.current.run(duration, (progress: number) => {
      const frame = cameraFrame(
        from,
        target,
        progress,
        el.clientWidth,
        el.clientHeight,
        contentWidth,
      );
      pending.current = frame;
      setScale(frame.scale);
      // Pure pans have no scale update to trigger a React layout commit.
      if (frame.scale === from.scale) {
        el.scrollTo({ left: frame.left, top: frame.top, behavior: 'instant' });
        pending.current = null;
      }
    });
  }
  const gestureScale = useCallback(
    (value: number) => {
      stop();
      pending.current = null;
      setScale(value);
    },
    [stop],
  );
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    el.addEventListener('pointerdown', stop);
    el.addEventListener('wheel', stop, { passive: true });
    el.addEventListener('keydown', stop);
    return () => {
      stop();
      el.removeEventListener('pointerdown', stop);
      el.removeEventListener('wheel', stop);
      el.removeEventListener('keydown', stop);
    };
  }, [viewport, stop]);
  return { scale, move, gestureScale };
}

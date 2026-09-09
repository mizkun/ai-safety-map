'use client';
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import {
  clampZoom,
  zoomAnchor,
  scrollAtAnchor,
  latestFrame,
  isReleasedPointer,
} from '@/lib/map-gestures.mjs';

type Point = { x: number; y: number };
type Options = {
  scale: number;
  contentWidth: number;
  onScale: (scale: number) => void;
};

export function useMapGestures(
  viewport: RefObject<HTMLDivElement | null>,
  options: Options,
) {
  const current = useRef(options);
  const zoomCommit = useRef<{
    scale: number;
    anchor: Point;
    point: Point;
  } | null>(null);
  useLayoutEffect(() => {
    current.current = options;
    const pending = zoomCommit.current,
      el = viewport.current;
    if (pending && el && Math.abs(pending.scale - options.scale) < 1e-9) {
      el.scrollTo(
        scrollAtAnchor(
          pending.anchor,
          pending.point,
          pending.scale,
          el.clientWidth,
          options.contentWidth,
        ),
      );
      zoomCommit.current = null;
    }
  }, [options, viewport]);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const points = new Map<number, Point>();
    let pan: { point: Point; left: number; top: number } | null = null;
    let pinch: { distance: number; scale: number; anchor: Point } | null = null;
    let suppressClick = false;
    const zoomFrame = latestFrame(requestAnimationFrame, cancelAnimationFrame);
    const panFrame = latestFrame(requestAnimationFrame, cancelAnimationFrame);
    let bounds = el.getBoundingClientRect();
    const relative = (p: Point) => ({
      x: p.x - bounds.left,
      y: p.y - bounds.top,
    });
    const pair = () => {
      const [a, b] = [...points.values()];
      return {
        point: relative({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }),
        distance: Math.hypot(a.x - b.x, a.y - b.y),
      };
    };
    const apply = (value: number, anchor: Point, point: Point) => {
      const scale = clampZoom(value);
      current.current = { ...current.current, scale };
      zoomFrame.schedule(() => {
        zoomCommit.current = { scale, anchor, point };
        current.current.onScale(scale);
      });
    };
    const down = (e: PointerEvent) => {
      if (
        e.pointerType === 'mouse' &&
        (e.button !== 0 || (e.target as HTMLElement).closest('button,a'))
      )
        return;
      if (!points.size) {
        suppressClick = false;
        bounds = el.getBoundingClientRect();
      }
      points.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (points.size === 1)
        pan = {
          point: { x: e.clientX, y: e.clientY },
          left: el.scrollLeft,
          top: el.scrollTop,
        };
      if (points.size === 2) {
        const { point, distance } = pair();
        pinch = {
          distance: Math.max(distance, 1),
          scale: current.current.scale,
          anchor: zoomAnchor(
            point,
            { left: el.scrollLeft, top: el.scrollTop },
            current.current.scale,
            el.clientWidth,
            current.current.contentWidth,
          ),
        };
        suppressClick = true;
        for (const id of points.keys()) el.setPointerCapture(id);
        e.preventDefault();
      }
    };
    const move = (e: PointerEvent) => {
      if (!points.has(e.pointerId)) return;
      points.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (points.size >= 2 && pinch) {
        const { point, distance } = pair();
        apply((pinch.scale * distance) / pinch.distance, pinch.anchor, point);
        e.preventDefault();
      } else if (pan) {
        const dx = e.clientX - pan.point.x,
          dy = e.clientY - pan.point.y;
        if (suppressClick || Math.hypot(dx, dy) > 6) {
          suppressClick = true;
          el.setPointerCapture(e.pointerId);
          const target = { left: pan.left - dx, top: pan.top - dy };
          panFrame.schedule(() => el.scrollTo(target));
          e.preventDefault();
        }
      }
    };
    const up = (e: PointerEvent) => {
      // Touch buttons have implicit capture. Its loss bubbles during transfer to
      // the viewport; that is not the finger being lifted.
      if (!isReleasedPointer(e, el)) return;
      points.delete(e.pointerId);
      pinch = null;
      const remaining = [...points.values()][0];
      pan = remaining
        ? { point: remaining, left: el.scrollLeft, top: el.scrollTop }
        : null;
    };
    const click = (e: MouseEvent) => {
      if (suppressClick && e.detail !== 0) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      bounds = el.getBoundingClientRect();
      const point = relative({ x: e.clientX, y: e.clientY });
      const anchor = zoomAnchor(
        point,
        { left: el.scrollLeft, top: el.scrollTop },
        current.current.scale,
        el.clientWidth,
        current.current.contentWidth,
      );
      apply(current.current.scale * Math.exp(-e.deltaY * 0.008), anchor, point);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    el.addEventListener('click', click, true);
    el.addEventListener('wheel', wheel, { passive: false });
    return () => {
      zoomFrame.cancel();
      panFrame.cancel();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('lostpointercapture', up);
      el.removeEventListener('click', click, true);
      el.removeEventListener('wheel', wheel);
    };
  }, [viewport]);
}

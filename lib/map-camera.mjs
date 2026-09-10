import { zoomAnchor, scrollAtAnchor } from './map-gestures.mjs';

// Interpolate the world point at the viewport center, not raw scroll offsets.
// A zoom centered on a card then keeps that card on a continuous screen path.
export function cameraFrame(
  from,
  to,
  progress,
  viewportWidth,
  viewportHeight,
  contentWidth,
) {
  const t = Math.max(0, Math.min(1, progress));
  const eased = t * t * (3 - 2 * t);
  const point = { x: viewportWidth / 2, y: viewportHeight / 2 };
  const a = zoomAnchor(point, from, from.scale, viewportWidth, contentWidth);
  const b = zoomAnchor(point, to, to.scale, viewportWidth, contentWidth);
  const scale = from.scale * Math.pow(to.scale / from.scale, eased);
  return {
    scale,
    ...scrollAtAnchor(
      { x: a.x + (b.x - a.x) * eased, y: a.y + (b.y - a.y) * eased },
      point,
      scale,
      viewportWidth,
      contentWidth,
    ),
  };
}

// One cancellable animation owns the camera; a new request replaces the old one.
export function cameraAnimator(request, cancel) {
  let frame;
  let generation = 0;
  const stop = () => {
    generation++;
    if (frame !== undefined) cancel(frame);
    frame = undefined;
  };
  return {
    stop,
    run(duration, draw) {
      stop();
      if (!duration) {
        draw(1);
        return;
      }
      const active = generation;
      let start;
      const tick = (time) => {
        if (active !== generation) return;
        start ??= time;
        const progress = Math.min(1, (time - start) / duration);
        draw(progress);
        if (progress < 1) frame = request(tick);
        else frame = undefined;
      };
      frame = request(tick);
    },
  };
}

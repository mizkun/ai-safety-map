export const clampZoom = (value) => Math.max(0.02, Math.min(1.6, value));

export function initialMapScale(viewport, layout) {
  const fit = Math.min(
    1,
    (viewport.width - 40) / layout.width,
    (viewport.height - 40) / layout.height,
  );
  // A phone starts with readable cards. A desktop fits the route unless doing so
  // would turn every label into a miniature; the explicit fit button still can.
  return viewport.width < 760
    ? Math.min(1, (viewport.width - 48) / 266.4)
    : Math.max(0.5, fit);
}

export function latestFrame(request, cancel) {
  let frame = 0,
    pending;
  return {
    schedule(callback) {
      pending = callback;
      if (!frame)
        frame = request(() => {
          frame = 0;
          const run = pending;
          pending = undefined;
          run?.();
        });
    },
    cancel() {
      cancel(frame);
      frame = 0;
      pending = undefined;
    },
  };
}

export const isReleasedPointer = (event, owner) =>
  event.type !== 'lostpointercapture' || event.target === owner;

export function zoomAnchor(point, scroll, scale, viewportWidth, contentWidth) {
  const offset = Math.max(0, (viewportWidth - contentWidth * scale) / 2);
  return {
    x: (scroll.left + point.x - offset) / scale,
    y: (scroll.top + point.y) / scale,
  };
}

export function scrollAtAnchor(
  anchor,
  point,
  scale,
  viewportWidth,
  contentWidth,
) {
  const offset = Math.max(0, (viewportWidth - contentWidth * scale) / 2);
  return {
    left: anchor.x * scale + offset - point.x,
    top: anchor.y * scale - point.y,
  };
}

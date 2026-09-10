export const clampZoom = (value) => Math.max(0.02, Math.min(1.6, value));

export function initialMapScale(viewport, layout) {
  const fit = Math.min(
    1,
    (viewport.width - 40) / layout.width,
    (viewport.height - 40) / layout.height,
  );
  // Phones start at reading size; desktops start with the route in view.
  return viewport.width < 760
    ? Math.min(1, (viewport.width - 48) / 266.4)
    : Math.max(0.12, fit);
}

export function initialMapCamera(viewport, layout, anchor) {
  const scale = initialMapScale(viewport, layout);
  const phone = viewport.width < 760;
  const nearbyTop = Math.min(
    anchor.y,
    ...layout.tiles
      .filter((tile) => tile.x <= anchor.x + anchor.width * 2)
      .map((tile) => tile.y),
  );
  const clampScroll = (value, extent, size) =>
    Math.max(0, Math.min(value, extent * scale - size));
  return {
    scale,
    left: phone
      ? clampScroll(anchor.x * scale - 24, layout.width, viewport.width)
      : 0,
    top: clampScroll(
      phone
        ? Math.max(nearbyTop * scale, anchor.y * scale - 96) - 32
        : (anchor.y + anchor.height / 2) * scale - viewport.height / 2,
      layout.height,
      viewport.height,
    ),
  };
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

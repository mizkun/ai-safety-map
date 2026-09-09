export const clampZoom = (value) => Math.max(0.02, Math.min(1.6, value));

export function zoomAnchor(point, scroll, scale, viewportWidth, contentWidth) {
  const offset = Math.max(0, (viewportWidth - contentWidth * scale) / 2);
  return { x: (scroll.left + point.x - offset) / scale, y: (scroll.top + point.y) / scale };
}

export function scrollAtAnchor(anchor, point, scale, viewportWidth, contentWidth) {
  const offset = Math.max(0, (viewportWidth - contentWidth * scale) / 2);
  return { left: anchor.x * scale + offset - point.x, top: anchor.y * scale - point.y };
}

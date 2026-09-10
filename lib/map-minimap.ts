type Size = { width: number; height: number };
export type MapViewport = Size & { left: number; top: number };
const clamp = (value: number, maximum: number) =>
  Math.max(0, Math.min(value, maximum));

// Map coordinates, without the overscan used to decide which cards to render.
export function minimapViewport(
  viewport: MapViewport,
  scale: number,
  map: Size,
) {
  const offset = Math.max(0, (viewport.width - map.width * scale) / 2);
  const x = clamp((viewport.left - offset) / scale, map.width);
  const y = clamp(viewport.top / scale, map.height);
  const right = clamp(
    (viewport.left + viewport.width - offset) / scale,
    map.width,
  );
  const bottom = clamp((viewport.top + viewport.height) / scale, map.height);
  return { x, y, width: right - x, height: bottom - y };
}

export function minimapCamera(
  point: { x: number; y: number },
  viewport: Size,
  scale: number,
  map: Size,
) {
  const offset = Math.max(0, (viewport.width - map.width * scale) / 2);
  return {
    scale,
    left: clamp(
      point.x * scale + offset - viewport.width / 2,
      map.width * scale - viewport.width,
    ),
    top: clamp(
      point.y * scale - viewport.height / 2,
      map.height * scale - viewport.height,
    ),
  };
}

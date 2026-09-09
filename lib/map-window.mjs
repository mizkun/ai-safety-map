export function mapWindow(viewport, scale, width, height) {
  const offset = Math.max(0, (viewport.width - width * scale) / 2);
  const margin = 180 / scale;
  const quantum = 200;
  const x = Math.max(0, Math.floor(((viewport.left - offset) / scale - margin) / quantum) * quantum);
  const y = Math.max(0, Math.floor((viewport.top / scale - margin) / quantum) * quantum);
  const right = Math.min(width, Math.ceil(((viewport.left + viewport.width - offset) / scale + margin) / quantum) * quantum);
  const bottom = Math.min(height, Math.ceil(((viewport.top + viewport.height) / scale + margin) / quantum) * quantum);
  return { x, y, width: Math.max(0, right - x), height: Math.max(0, bottom - y) };
}

export function intersectsWindow(rect, window) {
  return !!window && rect.x + rect.width >= window.x && rect.x <= window.x + window.width && rect.y + rect.height >= window.y && rect.y <= window.y + window.height;
}

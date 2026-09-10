// Remove empty bands without shrinking cards or the padding immediately around them.
export function compactAxis(
  intervals,
  extent,
  scale,
  gap = 48,
  clearance = 36,
  tracks = [],
) {
  const spans = [
    ...intervals.map(([start, end]) => [
      Math.max(0, start * scale - clearance),
      Math.min(extent * scale, end * scale + clearance),
    ]),
    ...tracks
      .filter((p) => p >= 0 && p <= extent)
      .map((p) => [p * scale, p * scale]),
  ].sort((a, b) => a[0] - b[0]);
  const occupied = [];
  for (const span of spans) {
    const previous = occupied.at(-1);
    if (previous && span[0] <= previous[1])
      previous[1] = Math.max(previous[1], span[1]);
    else occupied.push([...span]);
  }
  const segments = [];
  let source = 0,
    target = 0;
  const add = (end, length) => {
    if (end > source)
      segments.push({
        start: source,
        end,
        target,
        ratio: length / (end - source),
      });
    source = end;
    target += length;
  };
  for (const [start, end] of occupied) {
    add(start, Math.min(start - source, gap));
    add(end, end - source);
  }
  add(extent * scale, Math.min(extent * scale - source, gap));
  return { scale, segments, size: target };
}

export function projectAxis(axis, value) {
  const source = value * axis.scale;
  const segment =
    axis.segments.find((s) => source <= s.end) || axis.segments.at(-1);
  return segment
    ? segment.target + (source - segment.start) * segment.ratio
    : source;
}

import type { TreePoint } from './tree-layout';

type BusPort = {
  key: string;
  point: TreePoint;
  fromBus?: boolean;
};

// Draw after projecting the layout so forks and ordinary wires share the same
// corner radius. Only two-way elbows are rounded; real junctions stay joined.
export function roundedBus<T extends BusPort>(
  ports: T[],
  position: number,
  horizontalFlow: boolean,
  radius = 14,
) {
  const cross = (p: TreePoint) => (horizontalFlow ? p.y : p.x);
  const along = (p: TreePoint) => (horizontalFlow ? p.x : p.y);
  const point = (c: number, a: number): TreePoint =>
    horizontalFlow ? { x: a, y: c } : { x: c, y: a };
  const coordinates = [...new Set(ports.map((p) => cross(p.point)))].sort(
    (a, b) => a - b,
  );
  const positions = coordinates.map((c, index) => {
    const group = ports.filter((p) => cross(p.point) === c);
    const first = index === 0;
    const last = index === coordinates.length - 1;
    const busDegree = Number(!first) + Number(!last);
    const portDegree = group.filter((p) => along(p.point) !== position).length;
    const adjacent = coordinates[first ? 1 : index - 1];
    const r =
      busDegree === 1 && group.length === 1
        ? Math.min(
            radius,
            Math.abs(adjacent - c) / 2,
            Math.abs(along(group[0].point) - position) / 2,
          )
        : 0;
    return { c, r, inward: first ? 1 : -1, degree: busDegree + portDegree };
  });
  const endpoint = (p: TreePoint) => `${p.x} ${p.y}`;
  const rendered = ports.map((port) => {
    const { c, r, inward } = positions.find((p) => p.c === cross(port.point))!;
    const corner = point(c, position);
    if (!r) {
      const [a, b] = port.fromBus ? [corner, port.point] : [port.point, corner];
      return { ...port, path: `M ${endpoint(a)} L ${endpoint(b)}` };
    }
    const busEnd = point(c + inward * r, position);
    const stemEnd = point(
      c,
      position + Math.sign(along(port.point) - position) * r,
    );
    return {
      ...port,
      path: port.fromBus
        ? `M ${endpoint(busEnd)} Q ${endpoint(corner)} ${endpoint(stemEnd)} L ${endpoint(port.point)}`
        : `M ${endpoint(port.point)} L ${endpoint(stemEnd)} Q ${endpoint(corner)} ${endpoint(busEnd)}`,
    };
  });
  const first = positions[0];
  const last = positions.at(-1);
  const trunk =
    first && last && first !== last
      ? `M ${endpoint(point(first.c + first.r, position))} L ${endpoint(point(last.c - last.r, position))}`
      : '';
  return {
    trunk,
    ports: rendered,
    anchors: positions.map((p) => point(p.c, position)),
    markers: positions
      .filter((p) => p.degree > 2)
      .map((p) => point(p.c, position)),
  };
}

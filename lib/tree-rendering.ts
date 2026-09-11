import {
  cardPorts,
  forkGeometry,
  joinGeometry,
  joinJunctions,
  wireGeometry,
} from './tree-geometry.ts';
import type { TreeLayout } from './tree-types';

// Compute once per layout; the main map and its minimap share these paths.
export function treeGeometry(layout: TreeLayout) {
  return {
    ports: cardPorts(layout),
    wires: new Map(
      layout.wires.map((wire) => [wire.key, wireGeometry(wire, layout)]),
    ),
    forks: new Map(
      layout.forks?.map((fork) => [fork.key, forkGeometry(fork, layout)]),
    ),
    joins: new Map(
      layout.joins?.map((join) => [
        join.edge,
        {
          path: joinGeometry(join, layout),
          junctions: joinJunctions(join, layout),
        },
      ]),
    ),
  };
}

export type TreeGeometry = ReturnType<typeof treeGeometry>;

export function minimapPaths(geometry: TreeGeometry) {
  return [
    ...[...geometry.wires.values()].map((wire) => wire.path),
    ...[...geometry.forks.values()].flatMap((fork) => [
      fork.trunk,
      ...fork.branches.map((branch) => branch.path),
      fork.mergePath || '',
    ]),
    ...[...geometry.joins.values()].map((join) => join.path),
  ].join(' ');
}

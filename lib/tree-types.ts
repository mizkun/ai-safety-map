export type TreeTile = {
  key: string;
  node?: string;
  graph?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shortLabel?:
    | 'phoneControl'
    | 'phoneMisuse'
    | 'phoneMilitary'
    | 'phoneAccidents'
    | 'phoneDependence'
    | 'phoneWork'
    | 'phoneMoney'
    | 'phoneCatastrophe'
    | 'phoneAgency'
    | 'phoneSurvival'
    | 'phoneRecovery';
  label?:
    | 'present'
    | 'recovery'
    | 'catastrophe'
    | 'survival'
    | 'extinction'
    | 'lossOfControl'
    | 'research';
  kind: 'node' | 'route' | 'research';
};
export type TreeWire = {
  key: string;
  from: string;
  to: string;
  edge?: string;
  color: string;
  dashed?: boolean;
  reference?: boolean;
  viaY?: number;
  viaX?: number;
  targetSide?: boolean;
  busY?: number;
  fromFraction?: number;
  toFraction?: number;
  sourceSide?: 'left' | 'right';
  trackOffset?: number;
};
export type TreeRegion = {
  key: string;
  node: string;
  x: number;
  y: number;
  width: number;
  height: number;
  mode: 'all' | 'any';
  labelY: number;
  labelX?: number;
  color: string;
  edge?: string;
  members?: string[];
};
export type TreeArea = {
  key: string;
  node: string;
  x: number;
  y: number;
  width: number;
  height: number;
  // An unframed sequence still returns from its named outcome card.
  exit?: string;
};
export type TreeJoin = {
  edge: string;
  inputs: string[];
  output: string;
  x: number;
  y: number;
  color: string;
};
export type TreeFork = {
  key: string;
  from: string;
  targets: string[];
  busY: number;
  color: string;
  alternative?: boolean;
  merge?: { area: string; inputs: string[]; x: number; y: number };
};
export type TreePoint = { x: number; y: number };
export type TreeLayout = {
  width: number;
  height: number;
  entryView?: 'phone-overview';
  tiles: TreeTile[];
  wires: TreeWire[];
  regions?: TreeRegion[];
  areas?: TreeArea[];
  joins?: TreeJoin[];
  forks?: TreeFork[];
  factors?: {
    key: string;
    expanded: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  flow?: 'horizontal' | 'vertical';
  source?: TreeLayout;
  projection?: {
    flow: ReturnType<typeof import('./axis-compaction.mjs').compactAxis>;
    branch: ReturnType<typeof import('./axis-compaction.mjs').compactAxis>;
    offsetX?: number;
    offsetY?: number;
  };
};
export type TreeExpansion = {
  routes: string[];
  nodes: string[];
  factors?: string[];
};

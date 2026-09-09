export type Source = {
  title: string;
  date: string;
  url: string;
  published: string | null;
  period: string;
  checked: string;
};
export type Question = {
  q: string;
  a: string;
  src?: string;
  children?: Question[];
};
export type Evidence = { kind: string; src: string; text: string };
export type Review = {
  checkedAt: string;
  intervalDays: number;
  reason: string;
};
export type WatchSource = {
  id: string;
  name: string;
  cadence: 'daily' | 'weekly';
  urls: string[];
  focus: string;
  nodes: string[];
};
export type Node = {
  review: Review;
  id: string;
  title: string;
  explanation: string;
  body: Record<string, string>;
  evidence: Evidence[];
  sources: string[];
  questions: Question[];
  related: { text: string; scene: string; node: string }[];
  subgraph?: string;
  terms?: string[];
  watch?: string[];
};
export type Edge = {
  review: Review;
  basis: string;
  id: string;
  from: string;
  to: string;
  label: string;
  relation: 'conditional' | 'joint' | 'alternative' | 'feedback';
  explanation: string;
  conditions: string[];
  limitation: string;
  safeguards: string;
  sources: string[];
};
export type Graph = {
  id: string;
  title: string;
  description: string;
  mode: 'sequence' | 'all' | 'any';
  nodes: string[];
  edges: string[];
  parent?: string;
};
export type Route = {
  outcome?: 'E1';
  id: string;
  number: string;
  shortTitle: string;
  preview: string[];
};
export type Revision = {
  id: string;
  date: string;
  kind: string;
  title: string;
  summary: string;
  before: string;
  after: string;
  reason: string;
  nodes: string[];
  sources: string[];
};
export type ReadingExample = {
  id: string;
  title: string;
  source: string;
  finding: string;
  limit: string;
  next: string;
  links: { map: string; node: string }[];
};
export type GlossaryTerm = {
  name: string;
  aliases: string[];
  definition: string;
  example?: string;
  limit: string;
  sources: string[];
};
export type Content = {
  watchlist: WatchSource[];
  asOf: string;
  routes: Route[];
  graphs: Record<string, Graph>;
  edges: Record<string, Edge>;
  nodes: Record<string, Node>;
  sources: Record<string, Source>;
  history: Revision[];
  news: ReadingExample[];
  glossary: Record<string, GlossaryTerm>;
};

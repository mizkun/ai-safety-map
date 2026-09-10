export type Source = {
  primary: string;
  title: string;
  date: string;
  url: string;
  published: string | null;
  period: string;
  checked: string;
};
export type LocaleOption = {
  code: 'ja' | 'en';
  name: string;
  enabled: boolean;
};
export type SiteContent = {
  locales: LocaleOption[];
  content: { ja: Content; en?: Content };
  detailsUrls?: Partial<Record<'ja' | 'en', string>>;
};
export type Question = {
  q: string;
  a: string;
  src?: string;
  children?: Question[];
};
export type Research = {
  type: 'evaluation' | 'observation' | 'model' | 'definition' | 'argument';
  title: string;
  kind: string;
  source: string;
  locator: string;
  evaluator: string;
  setting: string;
  method: string;
  result: string;
  limitation: string;
};
export type EvidenceState =
  | 'observed'
  | 'limited'
  | 'hypothesis'
  | 'definition';
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
  shortTitle: string;
  explanation: string;
  body: Record<string, string>;
  status: EvidenceState;
  research: string[];
  sources: string[];
  questions: Question[];
  related: { text: string; scene: string; node: string }[];
  subgraph?: string;
  terms?: string[];
  topics?: string[];
  watch?: string[];
};
export type Edge = {
  current: string;
  research: string[];
  review: Review;
  basis: string;
  id: string;
  from: string;
  to: string;
  label: string;
  relation:
    | 'conditional'
    | 'joint'
    | 'alternative'
    | 'feedback'
    | 'influence'
    | 'mitigation';
  requires?: string[];
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
  mode: 'sequence' | 'all' | 'any' | 'network';
  nodes: string[];
  edges: string[];
  parent?: string;
};
export type Route = {
  role?: 'factor';
  contexts?: string[];
  outcome?: string;
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
  current: {
    evidence: Record<
      string,
      {
        level: 'tested' | 'indirect';
        summary: string;
        research: string[];
        review: Review;
      }
    >;
    routes: Record<
      string,
      {
        node: string;
        observed: string;
        finding: string;
        next: string;
        sources: string[];
        review: Review;
      }
    >;
    safeguards: Record<
      string,
      {
        title: string;
        summary: string;
        limit: string;
        research: string[];
        sources: string[];
        review: Review;
      }
    >;
  };
  stories: Record<string, Story>;
  research: Record<string, Research>;
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
export type Story = {
  id: string;
  title: string;
  intro: string;
  chapters: { title: string; text: string; nodes: string[] }[];
  outlook: string;
};

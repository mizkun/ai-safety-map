import type { SiteContent } from './content-types';
import { currentEdgeId } from './legacy-links.mjs';
import { tourStops } from './map-tour.ts';

export const libraryPanels = [
  'about',
  'glossary',
  'history',
  'sources',
] as const;
export const detailTabs = ['summary', 'evidence', 'more'] as const;
export type LibraryPanel = (typeof libraryPanels)[number];
export type DetailTab = (typeof detailTabs)[number];
export type NavigationState = {
  locale: 'ja' | 'en';
  view: string;
  expanded: boolean;
  tour: { step: string; focus: string | null } | null;
  detail: { kind: 'node' | 'edge'; id: string; tab: DetailTab } | null;
  panel: LibraryPanel | null;
  term: string | null;
  guide: boolean;
  welcome: boolean;
  search: string;
  research: string[] | null;
  questions: string[];
};
export const initialNavigation = (): NavigationState => ({
  locale: 'ja',
  view: 'overview',
  expanded: false,
  tour: null,
  detail: null,
  panel: null,
  term: null,
  guide: false,
  welcome: false,
  search: '',
  research: null,
  questions: [],
});

export function navigationHash(state: NavigationState) {
  const q = new URLSearchParams({ lang: state.locale, map: state.view });
  if (state.expanded) q.set('scope', 'all');
  if (state.tour) {
    q.set('tour', state.tour.step);
    if (state.tour.focus) q.set('focus', state.tour.focus);
  }
  if (state.panel) q.set('panel', state.panel);
  if (state.search && state.panel === 'glossary') q.set('q', state.search);
  if (state.detail) {
    q.set(state.detail.kind, state.detail.id);
    if (state.detail.tab !== 'summary') q.set('tab', state.detail.tab);
    if (state.research) q.set('research', [...state.research].sort().join(','));
    if (state.questions.length)
      q.set('questions', [...state.questions].sort().join(','));
  }
  if (state.term) q.set('term', state.term);
  if (state.guide) q.set('guide', '1');
  if (state.welcome) q.set('welcome', '1');
  return '#' + q.toString();
}

export function readNavigation(
  hash: string,
  site: SiteContent,
  browserLanguage = 'ja',
): NavigationState {
  const q = new URLSearchParams(hash.replace(/^#/, ''));
  const next = initialNavigation();
  const requestedLanguage = q.get('lang');
  const preferEnglish =
    requestedLanguage === 'en' ||
    (!requestedLanguage && !/^ja(?:-|$)/i.test(browserLanguage));
  next.locale = preferEnglish && site.content.en ? 'en' : 'ja';
  const data = site.content[next.locale]!;
  const requestedMap = q.get('map') || 'overview';
  next.view = Object.hasOwn(data.graphs, requestedMap)
    ? requestedMap
    : 'overview';
  const panel = q.get('panel') || requestedMap;
  next.panel = libraryPanels.includes(panel as LibraryPanel)
    ? (panel as LibraryPanel)
    : null;
  next.search =
    next.panel === 'glossary' ? (q.get('q') || '').slice(0, 200) : '';
  const stop = tourStops(data).find((s) => s.key === q.get('tour'));
  if (stop) {
    next.view = stop.view;
    const focus = q.get('focus');
    next.tour = {
      step: stop.key,
      focus:
        focus && Object.hasOwn(data.nodes, focus) && stop.nodes.includes(focus)
          ? focus
          : null,
    };
  }
  next.expanded =
    !next.tour && next.view === 'overview' && q.get('scope') === 'all';
  const node = q.get('node');
  const edge = q.get('edge') && currentEdgeId(q.get('edge')!);
  const tab = detailTabs.includes(q.get('tab') as DetailTab)
    ? (q.get('tab') as DetailTab)
    : 'summary';
  if (node && Object.hasOwn(data.nodes, node))
    next.detail = { kind: 'node', id: node, tab };
  else if (edge && Object.hasOwn(data.edges, edge))
    next.detail = { kind: 'edge', id: edge, tab };
  if (next.detail) {
    const item =
      next.detail.kind === 'node'
        ? data.nodes[next.detail.id]
        : data.edges[next.detail.id];
    if (q.has('research'))
      next.research = [
        ...new Set(
          (q.get('research') || '')
            .split(',')
            .filter((id) => item.research.includes(id)),
        ),
      ];
    if (next.detail.kind === 'node')
      next.questions = [
        ...new Set(
          (q.get('questions') || '')
            .split(',')
            .filter(
              (id) =>
                id.startsWith(next.detail!.id + '.') &&
                /^\w+(?:\.\d+)+$/.test(id) &&
                id.length < 100,
            ),
        ),
      ];
  }
  const term = q.get('term');
  next.term = term && Object.hasOwn(data.glossary, term) ? term : null;
  next.guide = q.get('guide') === '1';
  next.welcome = q.get('welcome') === '1';
  return next;
}

export function shouldWelcome(state: NavigationState, seen: boolean) {
  return (
    !seen &&
    state.view === 'overview' &&
    !state.expanded &&
    !state.tour &&
    !state.detail &&
    !state.panel &&
    !state.term &&
    !state.guide
  );
}

export function mapContext(state: NavigationState) {
  return [
    state.view,
    state.expanded,
    state.tour?.step || '',
    state.tour?.focus || '',
  ].join('|');
}
export type MapCameraSnapshot = {
  context: string;
  layout?: string;
  scale: number;
  left: number;
  top: number;
  width: number;
  height: number;
};
export type PresentationSnapshot = {
  camera?: MapCameraSnapshot;
  scrolls: Record<string, { key: string; top: number; left: number }>;
};
export type Overlay = 'detail' | 'term' | 'panel' | 'guide' | 'welcome';
type Pointer = { id: string; position: number; chain: string };
export type NavigationEntry = Pointer & {
  version: 1;
  hash: string;
  parent: Pointer | null;
  close: Partial<Record<Overlay, Pointer>>;
  snapshot: PresentationSnapshot;
};
export function rootEntry(hash: string, id: string): NavigationEntry {
  return {
    version: 1,
    hash,
    id,
    position: 0,
    chain: id,
    parent: null,
    close: {},
    snapshot: { scrolls: {} },
  };
}
function overlayValue(state: NavigationState, layer: Overlay) {
  return layer === 'detail'
    ? state.detail && state.detail.kind + ':' + state.detail.id
    : state[layer];
}
export function nextEntry(
  previous: NavigationEntry,
  from: NavigationState,
  to: NavigationState,
  id: string,
): NavigationEntry {
  const pointer = {
    id: previous.id,
    position: previous.position,
    chain: previous.chain,
  };
  const close = { ...previous.close };
  for (const layer of [
    'detail',
    'term',
    'panel',
    'guide',
    'welcome',
  ] as const) {
    const before = overlayValue(from, layer),
      after = overlayValue(to, layer);
    if (!after) delete close[layer];
    else if (before !== after && (layer !== 'panel' || !before))
      close[layer] = pointer;
  }
  return {
    ...previous,
    id,
    position: previous.position + 1,
    parent: pointer,
    hash: navigationHash(to),
    close,
    snapshot: {
      ...previous.snapshot,
      scrolls: { ...previous.snapshot.scrolls },
    },
  };
}
export function closeDistance(entry: NavigationEntry, layer: Overlay) {
  const target = entry.close[layer];
  return target &&
    target.chain === entry.chain &&
    target.position < entry.position
    ? target.position - entry.position
    : 0;
}
export function closeNavigation(
  state: NavigationState,
  layer: Overlay,
): NavigationState {
  if (layer === 'detail')
    return { ...state, detail: null, research: null, questions: [] };
  if (layer === 'panel') return { ...state, panel: null, search: '' };
  return {
    ...state,
    [layer]: layer === 'guide' || layer === 'welcome' ? false : null,
  };
}

'use client';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { SiteContent } from '@/lib/content-types';
import {
  initialNavigation,
  readNavigation,
  shouldWelcome,
  navigationHash,
  mapContext,
  rootEntry,
  nextEntry,
  closeDistance,
  closeNavigation,
  type NavigationState,
  type NavigationEntry,
  type PresentationSnapshot,
  type Overlay,
} from '@/lib/map-navigation';

const storageKey = 'aiSafetyMapNavigation';
function areas(state: NavigationState) {
  const detail = state.detail;
  return [
    {
      name: 'current',
      selector: '.current-dialog .MuiDialogContent-root',
      key: state.current ? state.locale + ':current' : null,
    },
    {
      name: 'tour',
      selector: '.tour-body',
      key: state.tour && state.locale + ':' + state.tour.step,
    },
    {
      name: 'detail',
      selector: '.detail-scroll',
      key:
        detail && [state.locale, detail.kind, detail.id, detail.tab].join(':'),
    },
    {
      name: 'library',
      selector: '.library-dialog .MuiDialogContent-root',
      key: state.panel && [state.locale, state.panel, state.search].join(':'),
    },
    {
      name: 'term',
      selector: '.term-dialog .MuiDialogContent-root',
      key: state.term && state.locale + ':' + state.term,
    },
  ];
}
function capture(
  state: NavigationState,
  previous: PresentationSnapshot,
): PresentationSnapshot {
  const snapshot = { ...previous, scrolls: { ...previous.scrolls } };
  const map = document.querySelector<HTMLElement>('.tree-viewport');
  if (map?.dataset.mapContext === mapContext(state)) {
    snapshot.camera = {
      context: mapContext(state),
      layout: map.dataset.mapLayout,
      scale: Number(map.dataset.mapScale),
      left: map.scrollLeft,
      top: map.scrollTop,
      width: map.clientWidth,
      height: map.clientHeight,
    };
  }
  for (const area of areas(state)) {
    const el = area.key && document.querySelector<HTMLElement>(area.selector);
    if (el && !el.querySelector('.content-loading'))
      snapshot.scrolls[area.name] = {
        key: area.key!,
        top: el.scrollTop,
        left: el.scrollLeft,
      };
  }
  return snapshot;
}
function storedEntry(hash: string): NavigationEntry | null {
  const entry = window.history.state?.[storageKey];
  return entry?.version === 1 &&
    entry.hash === hash &&
    typeof entry.id === 'string' &&
    Number.isInteger(entry.position) &&
    entry.snapshot?.scrolls &&
    entry.close
    ? entry
    : null;
}
function storeEntry(entry: NavigationEntry) {
  window.history.replaceState(
    { ...window.history.state, [storageKey]: entry },
    '',
    entry.hash,
  );
}

export function useMapNavigation(site: SiteContent) {
  const [state, setState] = useState(initialNavigation);
  const [restoration, setRestoration] = useState<NavigationEntry | null>(null);
  const current = useRef<{
    state: NavigationState;
    entry: NavigationEntry;
  } | null>(null);
  const welcomed = useRef(false);
  const snapshots = useRef(new Map<string, PresentationSnapshot>());
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const save = useCallback(() => {
    if (pending.current) clearTimeout(pending.current);
    pending.current = null;
    const value = current.current;
    if (!value) return;
    value.entry = {
      ...value.entry,
      snapshot: capture(value.state, value.entry.snapshot),
    };
    snapshots.current.set(value.entry.id, value.entry.snapshot);
    // Never overwrite the destination while the browser is traversing history.
    if (
      window.history.state?.[storageKey]?.id === value.entry.id &&
      location.hash === value.entry.hash
    )
      storeEntry(value.entry);
  }, []);
  const checkpoint = useCallback(() => {
    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(save, 120);
  }, [save]);
  useEffect(() => {
    const read = () => {
      const next = readNavigation(location.hash, site, navigator.language);
      if (!current.current) {
        let seen = welcomed.current;
        try {
          seen ||= localStorage.getItem('ai-safety-map-welcome') === '1';
        } catch {
          /* Storage may be unavailable in private mode. */
        }
        if (shouldWelcome(next, seen)) next.welcome = true;
        if (next.welcome) {
          welcomed.current = true;
          try {
            localStorage.setItem('ai-safety-map-welcome', '1');
          } catch {
            /* Keep the session usable without storage. */
          }
        }
      }
      const hash = navigationHash(next);
      const stored = storedEntry(hash);
      if (
        stored &&
        current.current?.entry.id === stored.id &&
        navigationHash(current.current.state) === hash
      )
        return;
      save();
      const entry = stored || rootEntry(hash, crypto.randomUUID());
      entry.snapshot = snapshots.current.get(entry.id) || entry.snapshot;
      storeEntry(entry);
      current.current = { state: next, entry };
      setState(next);
      setRestoration(entry);
    };
    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    read();
    window.addEventListener('popstate', read);
    window.addEventListener('hashchange', read);
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', save);
    document.addEventListener('scroll', checkpoint, true);
    return () => {
      save();
      history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener('popstate', read);
      window.removeEventListener('hashchange', read);
      window.removeEventListener('pagehide', save);
      window.removeEventListener('beforeunload', save);
      document.removeEventListener('scroll', checkpoint, true);
    };
  }, [site, save, checkpoint]);

  const go = useCallback(
    (
      update:
        | Partial<NavigationState>
        | ((previous: NavigationState) => NavigationState),
      replace = false,
    ) => {
      const value = current.current;
      if (!value) return;
      const proposed =
        typeof update === 'function'
          ? update(value.state)
          : { ...value.state, ...update };
      const next = readNavigation(navigationHash(proposed), site);
      const hash = navigationHash(next);
      if (hash === navigationHash(value.state)) return;
      save();
      const previous = current.current!;
      const entry = replace
        ? { ...previous.entry, hash }
        : nextEntry(previous.entry, previous.state, next, crypto.randomUUID());
      if (replace) storeEntry(entry);
      else
        history.pushState({ ...history.state, [storageKey]: entry }, '', hash);
      current.current = { state: next, entry };
      setState(next);
      setRestoration(entry);
    },
    [site, save],
  );
  const back = useCallback(() => {
    if (!current.current?.entry.parent) return;
    save();
    history.back();
  }, [save]);
  const close = useCallback(
    (layer: Overlay) => {
      const value = current.current;
      if (!value) return;
      const distance = closeDistance(value.entry, layer);
      if (distance) {
        save();
        history.go(distance);
      } else go(closeNavigation(value.state, layer), true);
    },
    [save, go],
  );

  useLayoutEffect(() => {
    if (!restoration) return;
    const waiting = areas(state).filter((area) => area.key);
    const restore = () => {
      for (let i = waiting.length - 1; i >= 0; i--) {
        const area = waiting[i];
        const el = document.querySelector<HTMLElement>(area.selector);
        if (!el || el.querySelector('.content-loading')) continue;
        const saved = restoration.snapshot.scrolls[area.name];
        el.scrollTo({
          top: saved?.key === area.key ? saved.top : 0,
          left: saved?.key === area.key ? saved.left : 0,
          behavior: 'instant',
        });
        waiting.splice(i, 1);
      }
    };
    restore();
    if (!waiting.length) return;
    const observer = new MutationObserver(() => {
      restore();
      if (!waiting.length) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [restoration, state]);
  return {
    state,
    go,
    back,
    close,
    checkpoint,
    restoration,
    canBack: Boolean(restoration?.parent),
  };
}

export type MapNavigation = ReturnType<typeof useMapNavigation>;

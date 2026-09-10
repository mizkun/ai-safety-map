import test from 'node:test';
import assert from 'node:assert/strict';
import { readSiteContent } from '../lib/read-site-content.mjs';
import { contentPackage } from '../lib/content-package.mjs';
import { tourStops } from '../lib/map-tour.ts';
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
} from '../lib/map-navigation.ts';
const site = readSiteContent();
const shell = contentPackage(site).shell;

test('first-visit onboarding leaves shared reading links and returning visitors alone', () => {
  const overview = readNavigation('#map=overview', site);
  assert.ok(shouldWelcome(overview, false));
  assert.ok(!shouldWelcome(overview, true));
  for (const hash of [
    '#map=control',
    '#map=overview&scope=all',
    '#map=overview&node=R5',
    '#map=overview&tour=start',
    '#map=overview&term=lean',
    '#map=overview&panel=glossary',
    '#map=overview&guide=1',
  ])
    assert.ok(!shouldWelcome(readNavigation(hash, site), false), hash);
  const welcome = { ...overview, welcome: true };
  assert.deepEqual(readNavigation(navigationHash(welcome), site), welcome);
  assert.equal(closeNavigation(welcome, 'welcome').welcome, false);
});

test('the browser language chooses the initial edition unless the URL specifies one', () => {
  for (const language of ['ja', 'ja-JP', 'JA-jp'])
    assert.equal(readNavigation('#map=control', site, language).locale, 'ja');
  for (const language of ['en', 'en-US', 'fr-FR', 'zh-CN', 'ko', 'de'])
    assert.equal(readNavigation('#map=control', site, language).locale, 'en');
  assert.equal(
    readNavigation('#lang=en&map=control', site, 'ja-JP').locale,
    'en',
  );
  assert.equal(
    readNavigation('#lang=ja&map=control', site, 'en-US').locale,
    'ja',
  );
});

test('shared tour URLs restore the step and nested detail without the lazy prose package', () => {
  for (const locale of ['ja', 'en']) {
    for (const stop of tourStops(site.content[locale])) {
      const state = {
        ...initialNavigation(),
        locale,
        view: stop.view,
        tour: { step: stop.key, focus: null },
        detail: { kind: 'node', id: 'R5', tab: 'evidence' },
        term: 'formalization',
      };
      const hash = navigationHash(state);
      assert.deepEqual(readNavigation(hash, shell), state);
      assert.equal(navigationHash(readNavigation(hash, site)), hash);
    }
  }
});
test('back and forward through a reading detour retain tour position, detail tabs, and scroll/camera snapshots', () => {
  let state = readNavigation('#lang=ja&map=control&tour=control:0:R0', site);
  let entry = rootEntry(navigationHash(state), 'tour');
  entry.snapshot = {
    camera: {
      context: mapContext(state),
      scale: 1.2,
      left: 300,
      top: 220,
      width: 1080,
      height: 800,
    },
    scrolls: { tour: { key: 'ja:control:0:R0', top: 360, left: 0 } },
  };
  const history = [{ state, entry }];
  const push = (patch, id) => {
    const next = readNavigation(navigationHash({ ...state, ...patch }), site);
    entry = nextEntry(entry, state, next, id);
    state = next;
    history.push({ state, entry });
  };
  push({ detail: { kind: 'node', id: 'R5', tab: 'summary' } }, 'r5');
  push({ detail: { kind: 'node', id: 'R5', tab: 'evidence' } }, 'evidence');
  entry.snapshot = {
    ...entry.snapshot,
    scrolls: {
      ...entry.snapshot.scrolls,
      detail: { key: 'ja:node:R5:evidence', top: 475, left: 0 },
    },
  };
  push({ detail: { kind: 'node', id: 'R3', tab: 'summary' } }, 'r3');
  push({ term: 'formalization' }, 'term');
  for (const item of [...history].reverse().concat(history)) {
    assert.deepEqual(readNavigation(item.entry.hash, site), item.state);
    assert.equal(item.entry.snapshot.scrolls.tour.top, 360);
    assert.equal(item.entry.snapshot.camera.scale, 1.2);
  }
  assert.equal(closeDistance(entry, 'term'), -1);
  assert.equal(
    closeDistance(history[3].entry, 'detail'),
    -1,
    'closing R3 returns to R5 evidence',
  );
  assert.equal(
    closeDistance(history[2].entry, 'detail'),
    -2,
    'closing R5 skips its tab changes and returns to the tour',
  );
  assert.equal(
    history[0].entry.snapshot.scrolls.detail,
    undefined,
    'later reads never mutate older entries',
  );
  const fork = nextEntry(
    history[1].entry,
    history[1].state,
    { ...history[1].state, term: 'formalization' },
    'fork',
  );
  assert.equal(fork.position, 2);
  assert.equal(fork.parent.id, 'r5');
  assert.equal(closeDistance(fork, 'term'), -1);
});
test('direct links close within the app, and invalid or legacy URLs resolve safely', () => {
  const state = readNavigation(
    '#map=control&tour=control:0:R0&node=R5&term=formalization',
    site,
  );
  const entry = rootEntry(navigationHash(state), 'direct');
  assert.equal(closeDistance(entry, 'term'), 0);
  assert.equal(closeDistance(entry, 'detail'), 0);
  const withoutTerm = closeNavigation(state, 'term');
  assert.equal(withoutTerm.detail.id, 'R5');
  assert.equal(withoutTerm.tour.step, 'control:0:R0');
  assert.equal(withoutTerm.term, null);
  assert.equal(readNavigation('#map=glossary', site).panel, 'glossary');
  assert.equal(
    readNavigation('#map=control&edge=C1-C2', site).detail.id,
    'C3-L',
  );
  assert.deepEqual(
    readNavigation(
      '#map=toString&node=__proto__&edge=toString&term=constructor&tour=not-a-step',
      site,
    ),
    initialNavigation(),
  );
  assert.equal(
    readNavigation('#lang=en&map=overview', {
      ...site,
      content: { ja: site.content.ja },
    }).locale,
    'ja',
  );
});
test('display scope, library query, guide, research and question expansion have reproducible URLs', () => {
  const research = site.content.ja.nodes.R5.research;
  const base = readNavigation(
    '#map=overview&scope=all&panel=glossary&q=AI&guide=1&node=R5&tab=evidence&research=&questions=R5.0,wrong.2',
    site,
  );
  assert.equal(base.expanded, true);
  assert.equal(base.search, 'AI');
  assert.deepEqual(base.research, []);
  assert.deepEqual(base.questions, ['R5.0']);
  assert.deepEqual(readNavigation(navigationHash(base), site), base);
  const expandedResearch = { ...base, research };
  assert.deepEqual(
    readNavigation(navigationHash(expandedResearch), shell),
    expandedResearch,
  );
  assert.notEqual(
    navigationHash(base),
    navigationHash({ ...base, expanded: false }),
  );
});

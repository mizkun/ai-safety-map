import fs from 'node:fs';
import path from 'node:path';
import { currentReviewDay, isCalendarDate } from '../lib/freshness.mjs';

const root = path.resolve('content');
const errors = [];
const check = (ok, message) => {
  if (!ok) errors.push(message);
};
const nonempty = (value) =>
  typeof value === 'string' && value.trim().length > 0;
const read = (name) =>
  JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const map = read('map.json');
const sources = read('sources.json');
const research = read('research.json');
const stories = read('stories.json');
const history = read('history.json');
const news = read('news.json');
const glossary = read('glossary.json');
const watchlist = read('watchlist.json');
const current = read('current.json');
const nodes = {};
const nodeFiles = fs
  .readdirSync(path.join(root, 'nodes'))
  .filter((f) => f.endsWith('.json'));
const required = (object, fields, label) =>
  fields.forEach((f) =>
    check(nonempty(object[f]), label + ': ' + f + ' must be nonempty text'),
  );
const sourceRefs = (refs, label) => {
  check(
    Array.isArray(refs) && refs.length > 0,
    label + ': at least one source is required',
  );
  for (const id of refs || [])
    check(Boolean(sources[id]), label + ': unknown source ' + id);
};
const date = (value, label) =>
  check(
    typeof value === 'string' && isCalendarDate(value),
    label + ': expected YYYY-MM-DD',
  );
date(map.asOf, 'map.asOf');
check(map.asOf <= currentReviewDay(), 'map.asOf cannot be in the future');
function review(value, label) {
  if (!value) {
    check(false, label + ': review is required');
    return;
  }
  date(value.checkedAt, label + '.review.checkedAt');
  check(value.checkedAt <= map.asOf, label + ': review is newer than map.asOf');
  check(
    Number.isInteger(value.intervalDays) &&
      value.intervalDays >= 1 &&
      value.intervalDays <= 90,
    label + ': review interval must be 1–90 days',
  );
  required(value, ['reason'], label + ' review');
}
for (const [id, s] of Object.entries(sources)) {
  required(
    s,
    ['title', 'date', 'url', 'period', 'checked', 'primary'],
    'source ' + id,
  );
  check(
    s.published === null || /^\d{4}-\d{2}(-\d{2})?$/.test(s.published),
    'source ' +
      id +
      ': publication date must preserve YYYY-MM or YYYY-MM-DD precision, or null',
  );
  date(s.checked, 'source ' + id + '.checked');
  check(s.checked <= map.asOf, id + ': source check is newer than map.asOf');
  if (s.published !== null) {
    date(
      s.published.length === 7 ? s.published + '-01' : s.published,
      id + '.published',
    );
    check(
      s.published <= s.checked,
      id + ': publication cannot follow its source check',
    );
  }
  check(
    s.url.startsWith('https://'),
    'source ' + id + ': expected HTTPS source URL',
  );
}
for (const [id, r] of Object.entries(research)) {
  required(
    r,
    [
      'title',
      'kind',
      'source',
      'locator',
      'evaluator',
      'setting',
      'method',
      'result',
      'limitation',
    ],
    'research ' + id,
  );
  sourceRefs([r.source], id);
  check(
    ['evaluation', 'observation', 'model', 'definition', 'argument'].includes(
      r.type,
    ),
    id + ': explicit research type required',
  );
}
function researchRefs(refs, label) {
  check(
    Array.isArray(refs) && refs.length > 0,
    label + ': research records required',
  );
  for (const id of refs || [])
    check(Boolean(research[id]), label + ': unknown research ' + id);
}
for (const file of nodeFiles) {
  const node = read('nodes/' + file);
  check(node.id + '.json' === file, file + ': filename must match id');
  check(!nodes[node.id], file + ': duplicate id');
  nodes[node.id] = node;
}
function questions(items, label) {
  check(Array.isArray(items), label + ': questions must be an array');
  for (const q of items || []) {
    required(q, ['q', 'a'], label + ' question');
    if (q.src) sourceRefs([q.src], label);
    if (q.children) questions(q.children, label);
  }
}
for (const [id, n] of Object.entries(nodes)) {
  review(n.review, id);
  required(n, ['id', 'title', 'shortTitle', 'explanation'], id);
  check(
    n.explanation === id + '.md',
    id + ': explanation must be the matching Markdown filename',
  );
  const markdown = fs.readFileSync(
    path.join(root, 'explanations', id + '.md'),
    'utf8',
  );
  check(
    markdown.startsWith('# ' + n.title + '\n'),
    id + ': Markdown title must match node title',
  );
  const headings = [...markdown.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  check(
    new Set(headings).size === headings.length,
    id + ': duplicate explanation heading',
  );
  for (const h of [
    '概要',
    '他の条件との関係',
    '現在の状況',
    '成立条件',
    '根拠の限界',
    '考えられる対策',
  ]) {
    check(headings.includes(h), id + ': missing section ' + h);
    const section = markdown
      .split('## ' + h + '\n')[1]
      ?.split('\n## ')[0]
      ?.trim();
    check(nonempty(section), id + ': empty section ' + h);
  }
  sourceRefs(n.sources, id);
  check(
    ['observed', 'limited', 'hypothesis', 'definition'].includes(n.status),
    id + ': evidence status required',
  );
  researchRefs(n.research, id);
  questions(n.questions, id);
  check(Array.isArray(n.related), id + ': related must be an array');
  for (const link of n.related || []) {
    required(link, ['text', 'scene', 'node'], id + ' related');
    check(
      Boolean(nodes[link.node]),
      id + ': unknown related node ' + link.node,
    );
    check(
      Boolean(map.graphs[link.scene]) || link.scene === 'overview',
      id + ': unknown related map ' + link.scene,
    );
  }
  if (n.subgraph) {
    check(
      Boolean(map.graphs[n.subgraph]),
      id + ': missing subgraph ' + n.subgraph,
    );
    check(
      map.graphs[n.subgraph]?.parent === id,
      id + ': subgraph must refer back to its parent',
    );
  }
  for (const term of n.terms || [])
    check(Boolean(glossary[term]), id + ': unknown glossary term ' + term);
  for (const term of n.topics || [])
    check(Boolean(glossary[term]), id + ': unknown topic ' + term);
}
for (const route of map.routes.filter((r) => r.role !== 'factor')) {
  const item = current.routes[route.id];
  check(Boolean(item), route.id + ': current focus required');
  if (!item) continue;
  required(item, ['finding', 'next'], 'current ' + route.id);
  check(
    Boolean(nodes[item.node]) && Boolean(nodes[item.observed]),
    route.id + ': current nodes must exist',
  );
  sourceRefs(item.sources, 'current ' + route.id);
  review(item.review, 'current ' + route.id);
}
for (const [id, item] of Object.entries(current.safeguards)) {
  check(Boolean(nodes[id]), 'safeguard node must exist: ' + id);
  required(item, ['title', 'summary', 'limit'], 'safeguard ' + id);
  sourceRefs(item.sources, 'safeguard ' + id);
  researchRefs(item.research, 'safeguard ' + id);
  check(
    item.research.some((key) => research[key]?.type === 'evaluation'),
    id + ': green safeguard requires a measured evaluation',
  );
  review(item.review, 'safeguard ' + id);
}
for (const f of fs
  .readdirSync(path.join(root, 'explanations'))
  .filter((f) => f.endsWith('.md'))) {
  check(Boolean(nodes[f.slice(0, -3)]), f + ': explanation has no node');
}
for (const [id, e] of Object.entries(map.edges)) {
  review(e.review, id);
  check(e.id === id, id + ': edge id mismatch');
  required(
    e,
    [
      'id',
      'from',
      'to',
      'label',
      'explanation',
      'limitation',
      'safeguards',
      'basis',
      'current',
    ],
    id,
  );
  check(
    Boolean(nodes[e.from]) && Boolean(nodes[e.to]),
    id + ': edge has an unknown endpoint',
  );
  check(
    [
      'conditional',
      'joint',
      'alternative',
      'feedback',
      'influence',
      'mitigation',
    ].includes(e.relation),
    id + ': unknown relation',
  );
  check(
    Array.isArray(e.conditions) &&
      e.conditions.length > 0 &&
      e.conditions.every(nonempty),
    id + ': conditions are required',
  );
  sourceRefs(e.sources, id);
  researchRefs(e.research, id);
  if (e.requires) {
    check(
      e.relation === 'joint',
      id + ': joint inputs require a joint relation',
    );
    check(
      e.requires.length > 1 && new Set(e.requires).size === e.requires.length,
      id + ': joint inputs must be distinct',
    );
    check(e.requires.includes(e.from), id + ': primary input must be included');
    for (const input of e.requires)
      check(
        Boolean(nodes[input]) && input !== e.to,
        id + ': invalid joint input ' + input,
      );
  }
}
for (const [id, g] of Object.entries(map.graphs)) {
  check(g.id === id, id + ': graph id mismatch');
  required(g, ['id', 'title', 'description'], id);
  check(
    ['sequence', 'all', 'any', 'network'].includes(g.mode),
    id + ': unknown decomposition mode',
  );
  check(Array.isArray(g.nodes) && g.nodes.length > 0, id + ': nodes required');
  check(new Set(g.nodes).size === g.nodes.length, id + ': duplicate node');
  for (const nodeId of g.nodes)
    check(Boolean(nodes[nodeId]), id + ': unknown node ' + nodeId);
  for (const edgeId of g.edges)
    check(Boolean(map.edges[edgeId]), id + ': unknown edge ' + edgeId);
  if (g.mode === 'sequence') {
    check(
      g.edges.length === g.nodes.length - 1,
      id + ': sequence needs one edge between each pair of nodes',
    );
    g.edges.forEach((edgeId, i) => {
      const e = map.edges[edgeId];
      check(
        e?.from === g.nodes[i] && e?.to === g.nodes[i + 1],
        id + ': edge does not match sequence position ' + edgeId,
      );
    });
  }
  if (g.parent)
    check(
      nodes[g.parent]?.subgraph === id,
      id + ': parent must refer to this graph',
    );
}
// Explanatory drill-down must terminate. Causal feedback is allowed in map.edges.
function visit(id, ancestors) {
  if (ancestors.includes(id)) {
    check(false, 'decomposition cycle: ' + [...ancestors, id].join(' → '));
    return;
  }
  const graph = map.graphs[nodes[id]?.subgraph];
  if (graph) for (const child of graph.nodes) visit(child, [...ancestors, id]);
}
for (const id of Object.keys(nodes)) visit(id, []);
for (const r of map.routes) {
  required(r, ['id', 'number', 'shortTitle'], 'route');
  check(Boolean(map.graphs[r.id]), r.id + ': route graph does not exist');
  check(Array.isArray(r.preview), r.id + ': preview must be an array');
  check(Boolean(stories[r.id]), r.id + ': story required');
}
for (const [id, story] of Object.entries(stories)) {
  check(
    story.id === id && map.routes.some((r) => r.id === id),
    id + ': story route mismatch',
  );
  required(story, ['title', 'intro', 'outlook'], id + ' story');
  check(
    Array.isArray(story.chapters) && story.chapters.length > 0,
    id + ': story chapters required',
  );
  for (const chapter of story.chapters || []) {
    required(chapter, ['title', 'text'], id + ' chapter');
    check(
      Array.isArray(chapter.nodes) && chapter.nodes.length > 0,
      id + ': linked nodes required',
    );
    for (const n of chapter.nodes || [])
      check(Boolean(nodes[n]), id + ': unknown story node ' + n);
  }
}
check(
  new Set(map.routes.map((r) => r.id)).size === map.routes.length,
  'duplicate route',
);
check(
  new Set(history.map((h) => h.id)).size === history.length,
  'duplicate history id',
);
for (const h of history) {
  required(
    h,
    ['id', 'date', 'kind', 'title', 'summary', 'before', 'after', 'reason'],
    'history',
  );
  date(h.date, h.id);
  check(h.date <= map.asOf, h.id + ': history is newer than map.asOf');
  for (const id of h.nodes)
    check(Boolean(nodes[id]), h.id + ': unknown node ' + id);
  sourceRefs(h.sources, h.id);
}
check(
  new Set(news.map((n) => n.id)).size === news.length,
  'duplicate news example id',
);
for (const n of news) {
  required(n, ['id', 'title', 'source', 'finding', 'limit', 'next'], 'news');
  sourceRefs([n.source], n.id);
  for (const link of n.links) {
    check(
      Boolean(nodes[link.node]) && Boolean(map.graphs[link.map]),
      n.id + ': invalid map link',
    );
  }
}
const aliases = new Set();
for (const [id, term] of Object.entries(glossary)) {
  required(term, ['name', 'definition', 'limit'], 'glossary ' + id);
  sourceRefs(term.sources, id);
  check(
    Array.isArray(term.aliases) && term.aliases.length > 0,
    id + ': glossary aliases required',
  );
  for (const alias of term.aliases) {
    check(
      nonempty(alias) && !aliases.has(alias.toLowerCase()),
      id + ': duplicate or empty glossary alias',
    );
    aliases.add(alias.toLowerCase());
  }
}
check(
  Array.isArray(watchlist) && watchlist.length > 0,
  'watchlist must not be empty',
);
check(
  new Set(watchlist.map((w) => w.id)).size === watchlist.length,
  'duplicate watchlist id',
);
for (const w of watchlist) {
  required(w, ['id', 'name', 'focus'], 'watchlist');
  check(
    ['daily', 'weekly'].includes(w.cadence),
    w.id + ': invalid watch cadence',
  );
  check(
    Array.isArray(w.urls) &&
      w.urls.length > 0 &&
      w.urls.every((url) => url.startsWith('https://')),
    w.id + ': HTTPS watch URLs required',
  );
  for (const id of w.nodes)
    check(Boolean(nodes[id]), w.id + ': unknown watched node ' + id);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  'Content valid: ' +
    Object.keys(nodes).length +
    ' nodes, ' +
    Object.keys(map.edges).length +
    ' edges, ' +
    Object.keys(sources).length +
    ' sources.',
);

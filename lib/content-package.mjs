import { createHash } from 'node:crypto';
// The initial document contains map geometry/labels only. Detailed prose is fetched on demand.
export function contentPackage(site, base = '/ai-safety-map') {
  const details = JSON.stringify(site.content);
  const filename = 'details-' + createHash('sha256').update(details).digest('hex').slice(0, 20) + '.json';
  const content = {};
  for (const [locale, data] of Object.entries(site.content)) {
    content[locale] = {
      ...data,
      nodes: Object.fromEntries(Object.entries(data.nodes).map(([id, n]) => [id, { ...n, body: {}, research: [], sources: [], questions: [], related: [], watch: [] }])),
      edges: Object.fromEntries(Object.entries(data.edges).map(([id, e]) => [id, { ...e, explanation: '', conditions: [], current: '', limitation: '', safeguards: '', basis: '', research: [], sources: [] }])),
      research: {}, sources: {}, history: [], news: [], watchlist: [],
      glossary: Object.fromEntries(Object.entries(data.glossary).map(([id, t]) => [id, { ...t, definition: '', example: '', limit: '', sources: [] }])),
      stories: Object.fromEntries(Object.entries(data.stories).map(([id, s]) => [id, { ...s, intro: '', chapters: [], outlook: '' }])),
    };
  }
  return { filename, details, shell: { locales: site.locales, content, detailsUrl: base + '/content/' + filename } };
}

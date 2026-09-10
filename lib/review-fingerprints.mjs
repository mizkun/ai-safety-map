import { createHash } from 'node:crypto';
import { isCalendarDate, currentReviewDay } from './freshness.mjs';
export function stableJSON(value) {
  if (Array.isArray(value)) return '[' + value.map(stableJSON).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map((k) => JSON.stringify(k) + ':' + stableJSON(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export const fingerprint = (value) => createHash('sha256').update(stableJSON(value)).digest('hex');
export function reviewUnits(data, ui = null) {
  const units = {};
  const add = (kind, id, value) => (units[kind + ':' + id] = fingerprint(value));
  const refs = (ids, kind) => (ids || []).map((id) => [id, units[kind + ':' + id] || null]);
  for (const [id, value] of Object.entries(data.sources)) add('source', id, value);
  for (const [id, value] of Object.entries(data.research)) add('research', id, { value, sources: refs([value.source], 'source') });
  for (const [id, value] of Object.entries(data.nodes)) add('node', id, { value, research: refs(value.research, 'research'), sources: refs(value.sources, 'source'), decomposition: data.graphs[value.subgraph] || null });
  for (const [id, value] of Object.entries(data.edges)) add('edge', id, { value, research: refs(value.research, 'research'), sources: refs(value.sources, 'source'), endpoints: refs([...new Set([value.from, value.to, ...(value.requires || [])])], 'node') });
  for (const [id, value] of Object.entries(data.graphs)) add('graph', id, { value, nodes: refs(value.nodes, 'node'), edges: refs(value.edges, 'edge') });
  for (const value of data.routes) add('route', value.id, { value, graph: refs([value.id], 'graph') });
  for (const [id, value] of Object.entries(data.glossary)) add('glossary', id, { value, sources: refs(value.sources, 'source') });
  for (const value of data.news) add('news', value.id, { value, sources: refs([value.source], 'source'), nodes: refs(value.links.map((l) => l.node), 'node') });
  for (const [id, value] of Object.entries(data.stories)) add('story', id, { value, nodes: refs([...new Set(value.chapters.flatMap((c) => c.nodes))], 'node') });
  for (const value of data.watchlist) add('watch', value.id, value);
  add('metadata', 'map', { asOf: data.asOf });
  add('history', 'changes', data.history);
  if (ui) add('ui', 'ja', ui);
  // Adding or deleting an item changes this unit, so deletion cannot evade review coverage.
  add('inventory', 'current', Object.keys(units).sort());
  return units;
}
export const reviewFields = ['mechanism', 'conditions', 'counterexample', 'evidence', 'limits', 'mitigation'];
// New drafts include a first-time reader check. Historical reviews remain
// valid for unchanged content; changed prose requires a fresh fingerprint.
export const readerFields = ['readerContext', 'whyHere'];
export function reviewIssues(units, records, sources) {
  const covered = new Set(), reasons = new Map();
  for (const record of records) {
    const entries = Object.entries(record.entries || {}).filter(([key, entry]) => units[key] && units[key] === entry.hash);
    if (!entries.length) continue; // Historical records remain intact after content is replaced.
    const reject = (message) => entries.forEach(([key]) => reasons.set(key, message));
    if (record.decision !== 'reviewed') { reject('review is pending'); continue; }
    if (!record.reviewer?.trim() || !isCalendarDate(record.date) || record.date > currentReviewDay()) { reject('valid reviewer and review date required'); continue; }
    const valid = new Set();
    for (const [id, assessment] of Object.entries(record.assessments || {})) {
      const fields = record.version >= 2 ? [...reviewFields, ...readerFields] : reviewFields;
      const ok = fields.every((field) => typeof assessment[field] === 'string' && assessment[field].trim().length >= 12 && !/^(TODO|TBD|未記入)/i.test(assessment[field]));
      if (!ok) continue;
      if (!Array.isArray(assessment.primary) || !assessment.primary.length || assessment.primary.some((p) => !sources[p.source] || !p.locator?.trim() || !p.support?.trim())) continue;
      valid.add(id);
    }
    for (const [key, entry] of entries) if (valid.has(entry.assessment)) covered.add(key);
  }
  return Object.keys(units).filter((key) => !covered.has(key)).map((key) => key + ': ' + (reasons.has(key) ? reasons.get(key) + '; ' : '') + 'missing or stale content review');
}

// Only prose is translatable. IDs, graph topology, source URLs, and dates stay shared.
const prose = new Set([
  'title',
  'shortTitle',
  'description',
  'preview',
  'label',
  'explanation',
  'conditions',
  'limitation',
  'safeguards',
  'basis',
  'q',
  'a',
  'text',
  'reason',
  'watch',
  'name',
  'aliases',
  'definition',
  'example',
  'limit',
  'finding',
  'next',
  'summary',
  'before',
  'after',
  'focus',
  'period',
  'primary',
  'locator',
  'evaluator',
  'setting',
  'method',
  'result',
  'current',
  'intro',
  'outlook',
]);
const opaque = new Set([
  'sources',
  'terms',
  'topics',
  'requires',
  'urls',
  'url',
  'published',
  'date',
  'checked',
  'checkedAt',
  'asOf',
  'id',
  'from',
  'to',
  'relation',
  'mode',
  'parent',
  'subgraph',
  'scene',
  'node',
  'src',
  'source',
  'cadence',
  'intervalDays',
  'number',
  'status',
  'research',
]);

export function translationFields(content) {
  const entries = {};
  function walk(value, parts, translateArray = false) {
    if (typeof value === 'string') {
      if (translateArray) entries[parts.join('.')] = value;
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, [...parts, String(i)], translateArray));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      const path = [...parts, key];
      // Root dictionaries (including sources and nodes) are traversed; references are not.
      if (parts.length > 0 && opaque.has(key)) continue;
      if (parts[0] === 'nodes' && key === 'explanation') continue;
      if (key === 'body') {
        for (const [section, text] of Object.entries(child))
          entries[[...path, section].join('.')] = text;
      } else if (
        typeof child === 'string' &&
        (prose.has(key) || key === 'kind')
      ) {
        entries[path.join('.')] = child;
      } else if (typeof child === 'object') walk(child, path, prose.has(key));
    }
  }
  walk(content, []);
  return Object.fromEntries(
    Object.entries(entries).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
}

export function applyTranslation(content, translation) {
  const fields = translationFields(content);
  const expected = Object.keys(fields);
  const actual = Object.keys(translation.strings || {});
  if (
    actual.length !== expected.length ||
    expected.some(
      (key) =>
        typeof translation.strings?.[key] !== 'string' ||
        !translation.strings[key].trim(),
    ) ||
    actual.some((key) => !Object.hasOwn(fields, key))
  ) {
    throw new Error(
      'Translation must contain every prose key, and no structural or unknown keys',
    );
  }
  const copy = structuredClone(content);
  for (const key of expected) {
    const parts = key.split('.');
    let target = copy;
    for (const part of parts.slice(0, -1)) target = target[part];
    target[parts.at(-1)] = translation.strings[key];
  }
  return copy;
}

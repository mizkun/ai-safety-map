// Only identifiers from this map become references. Acronyms keep their glossary
// meaning, and a code inside a longer word or identifier must remain plain text.
export function nodeReferenceIndex(nodes) {
  const ids = Object.keys(nodes).filter((id) => id !== 'NOW' && id !== 'ASI');
  const alternatives = ids
    .sort((a, b) => b.length - a.length)
    .map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return alternatives.length ? new RegExp(alternatives.join('|'), 'g') : null;
}

export function nodeReferenceSegments(text, index) {
  if (!index) return [{ text }];
  const result = [];
  let cursor = 0;
  for (const match of text.matchAll(index)) {
    const start = match.index;
    const end = start + match[0].length;
    if (
      /[a-z0-9_]/i.test(text[start - 1] || '') ||
      /[a-z0-9_]/i.test(text[end] || '')
    )
      continue;
    if (start > cursor) result.push({ text: text.slice(cursor, start) });
    result.push({ text: match[0], id: match[0] });
    cursor = end;
  }
  if (cursor < text.length) result.push({ text: text.slice(cursor) });
  return result;
}

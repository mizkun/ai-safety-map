// English abbreviations must not become links inside words such as "oversight" or "training".
export function glossaryIndex(glossary) {
  const aliases = new Map();
  for (const [id, term] of Object.entries(glossary))
    for (const alias of term.aliases)
      if (alias.trim()) aliases.set(alias.toLowerCase(), id);
  const escaped = [...aliases.keys()]
    .sort((a, b) => b.length - a.length)
    .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return {
    aliases,
    pattern: escaped.length ? new RegExp(escaped.join('|'), 'gi') : null,
  };
}

export function glossarySegments(text, index) {
  if (!index.pattern) return [{ text }];
  const result = [];
  let cursor = 0;
  const word = (letter) => Boolean(letter && /[a-z0-9_]/i.test(letter));
  for (const match of text.matchAll(index.pattern)) {
    const start = match.index,
      end = start + match[0].length;
    if (
      (word(match[0][0]) && word(text[start - 1])) ||
      (word(match[0].at(-1)) && word(text[end]))
    )
      continue;
    if (start > cursor) result.push({ text: text.slice(cursor, start) });
    result.push({
      text: match[0],
      id: index.aliases.get(match[0].toLowerCase()),
    });
    cursor = end;
  }
  if (cursor < text.length) result.push({ text: text.slice(cursor) });
  return result;
}

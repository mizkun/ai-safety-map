import fs from 'node:fs';
import path from 'node:path';

export function parseExplanation(markdown) {
  const sections = {};
  let heading;
  const lines = [];
  const flush = () => {
    if (heading) sections[heading] = lines.join('\n').trim();
    lines.length = 0;
  };
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('## ')) {
      flush();
      heading = line.slice(3).trim();
    } else if (heading) lines.push(line);
  }
  flush();
  return sections;
}
export function readCanonicalContent() {
  const root = path.join(process.cwd(), 'content');
  const read = (file) =>
    JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const nodes = {};
  for (const file of fs
    .readdirSync(path.join(root, 'nodes'))
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    const node = read(path.join('nodes', file));
    nodes[node.id] = {
      ...node,
      body: parseExplanation(
        fs.readFileSync(
          path.join(root, 'explanations', node.explanation),
          'utf8',
        ),
      ),
    };
  }
  return {
    ...read('map.json'),
    current: read('current.json'),
    stories: read('stories.json'),
    research: read('research.json'),
    nodes,
    sources: read('sources.json'),
    history: read('history.json'),
    news: read('news.json'),
    glossary: read('glossary.json'),
    watchlist: read('watchlist.json'),
  };
}

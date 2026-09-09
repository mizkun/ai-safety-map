import fs from 'node:fs';
import path from 'node:path';
import type { Content, Node } from './content-types';

export function parseExplanation(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let heading: string | undefined;
  const lines: string[] = [];
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

export function loadContent(): Content {
  const root = path.join(process.cwd(), 'content');
  const read = (file: string) =>
    JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const nodes: Record<string, Node> = {};
  for (const file of fs
    .readdirSync(path.join(root, 'nodes'))
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    const node = read(path.join('nodes', file));
    const markdown = fs.readFileSync(
      path.join(root, 'explanations', node.explanation),
      'utf8',
    );
    nodes[node.id] = { ...node, body: parseExplanation(markdown) };
  }
  return {
    ...read('map.json'),
    nodes,
    sources: read('sources.json'),
    history: read('history.json'),
    news: read('news.json'),
    glossary: read('glossary.json'),
  };
}

import fs from 'node:fs';
import { readCanonicalContent } from '../lib/content-reader.mjs';
import { applyTranslation } from '../lib/translation-fields.mjs';
import { tourStops } from '../lib/map-tour.ts';

// Export the text actually shown by MapTour, not the unused story.intro.
// Standalone detail sections follow so reviewers can check direct entry too.
const canonical = readCanonicalContent();
const directory = 'outputs/reading-review';
fs.mkdirSync(directory, { recursive: true });
for (const lang of ['ja', 'en']) {
  const data =
    lang === 'ja'
      ? canonical
      : applyTranslation(
          canonical,
          JSON.parse(fs.readFileSync('content/translations/en.json', 'utf8')),
        );
  const ui = JSON.parse(fs.readFileSync(`content/ui/${lang}.json`, 'utf8'));
  const stops = tourStops(data);
  const lines = [
    '# Reading review / ' + lang,
    'Generated from the current content. This file is not a review approval.',
    'Read in order without opening the glossary, then read each detail on its own.',
    'Check: actor, role in the scenario, mechanism, prerequisites, exceptions, evidence scope.',
  ];
  for (const [index, stop] of stops.entries()) {
    const node = stop.node ? data.nodes[stop.node] : null;
    const chapter = data.stories[stop.view]?.chapters[stop.chapter];
    const title =
      stop.kind === 'start'
        ? ui.tourStartTitle
        : stop.kind === 'finish'
          ? ui.tourFinishTitle
          : node?.title || chapter.title;
    const prose =
      stop.kind === 'start'
        ? ui.tourStartText
        : stop.kind === 'finish'
          ? ui.tourFinishText
          : node?.body['概要'] || chapter.text;
    lines.push(`\n## ${index + 1}. ${stop.key} / ${title}`, prose);
    if (stop.kind === 'start') lines.push(ui.tourOrderNote);
    if (
      stop.kind === 'chapter' &&
      stop.chapter === data.stories[stop.view].chapters.length - 1
    )
      lines.push('Outlook: ' + data.stories[stop.view].outlook);
    if (node)
      for (const section of ['他の条件との関係', '現在の状況'])
        lines.push(`### ${section}`, node.body[section]);
  }
  lines.push('\n# Standalone nodes');
  for (const [id, node] of Object.entries(data.nodes)) {
    lines.push(`## ${id} / ${node.title}`);
    for (const [heading, prose] of Object.entries(node.body))
      lines.push(`### ${heading}`, prose);
  }
  lines.push('\n# Connections');
  for (const [id, edge] of Object.entries(data.edges)) {
    lines.push(
      `## ${id} / ${edge.label}`,
      edge.explanation,
      'Conditions: ' + edge.conditions.join(' / '),
      edge.current,
      edge.limitation,
      edge.safeguards,
    );
  }
  lines.push('\n# Research cards');
  for (const [id, research] of Object.entries(data.research)) {
    lines.push(`## ${id} / ${research.title}`);
    for (const key of [
      'evaluator',
      'setting',
      'method',
      'result',
      'limitation',
    ])
      lines.push(key + ': ' + research[key]);
    lines.push('Primary: ' + research.source + ' / ' + research.locator);
  }
  lines.push('\n# Glossary');
  for (const [id, term] of Object.entries(data.glossary))
    lines.push(
      `## ${id} / ${term.name}`,
      term.definition,
      term.example || '',
      term.limit,
    );
  fs.writeFileSync(`${directory}/${lang}.md`, lines.join('\n\n') + '\n');
  console.log(
    `${directory}/${lang}.md: ${stops.length} tour stops, ${Object.keys(data.nodes).length} nodes, ${Object.keys(data.edges).length} connections`,
  );
}

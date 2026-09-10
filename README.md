# AI Safety Map

**[Japanese](https://ai-safety-map.org/#lang=ja&map=overview) · [English](https://ai-safety-map.org/#lang=en&map=overview)**

An interactive learning map that connects evidence about AI today with conditional paths into the future. Explore seven scenarios, read the conditions behind each connection, and follow a guided tour alongside the map.

The map distinguishes observed events, limited experiments, and arguments about possible futures. Global catastrophe, loss of human agency, and human extinction are separate outcomes. It is an educational synthesis of selected primary sources, not a probability model, an exhaustive survey, or a statement of expert consensus.

## Explore the map

- Start with the overview or switch to **All elements**. Desktop maps run from left to right; mobile maps run from top to bottom. Select a scenario to see its conditions.
- Open a card for its explanation, current evidence, limitations, and possible safeguards. Connections explain the additional conditions between stages. Detailed maps and tours show the conditions for worldwide harm before reaching that outcome. Glossary links work within explanations and other glossary entries.
- Start the **Tour** from the floating button. Enter, the right arrow, or the next-step button advances; the left arrow goes back. The scenario and step selectors let you jump directly, and the minimap shows your position.
- Open **Where we are** to see evidence colors and a selected condition to examine in each scenario. Red means cases have been reported, yellow means limited support, and gray means the condition is not established. A separate green marker identifies a tested mitigation, with its scope and limitations. These are evidence labels, not danger scores or scenario completion percentages.
- Use the logo or the overview breadcrumb to return to the full map. Pan and zoom with the map controls; touch devices also support pinch zoom. Cards are fixed in the diagram rather than individually draggable.
- Browser Back and Forward restore reading locations, including tour steps, card details, nested glossary entries, and map positions. URLs can be shared or reloaded at the same reading state.

The first visit offers a short introduction. The initial language follows the browser: Japanese for a Japanese browser, English otherwise. An explicit language in the URL takes precedence, and the language button switches between the two editions.

Lines connect only where a junction is marked. A crossing without a junction is not a connection. Position does not encode a date, and a group of conditions is not necessarily a sequence in time. AND and OR represent combinations and alternative mechanisms; neither turns the map into a complete causal or probability model.

Research acceleration can contribute to capabilities, work automation, or ASI, and can also support safety research. The work, income, money, and finance paths include beneficial and adverse outcomes rather than forcing all changes into a catastrophe scenario.

## Evidence and review

The initial source check was on **September 9, 2026**, followed by revisions on September 10:

- [Causal audit](docs/reviews/2026-09-10-causal-audit.md): conditions, connections, and their primary-source support.
- [Readability, translation, and social outcomes](docs/reviews/2026-09-10-readable-futures.md): work, income, and effects on everyday life.
- [Economic scenarios](docs/reviews/2026-09-10-economic-scenarios.md): conditional economic models, including paths where human employment continues.
- [Research comparison and editorial decisions](docs/research-review-2026-09-09.md): comparison of three research reports and checks against original sources.

Each node and connection records a review date and interval. Publication date, observation period, and review date remain separate. An old evaluation is not treated as a current capability ceiling. The **Where we are** questions are editorial selections, not proven unique bottlenecks.

GitHub Actions checks review dates daily and maintains one review issue. This checks dates; it does not discover new research, determine scientific correctness, or update review dates automatically. A separate maintainer research workflow is described in [Keeping the content current](docs/keeping-current.md); account-specific automation does not transfer to forks.

## Contribute

Report errors or unclear explanations through an [issue](https://github.com/mizkun/ai-safety-map/issues/new/choose). Expertise or a proposed rewrite is not required. For a factual correction, include the primary source and the relevant passage if available.

See [Contributing](CONTRIBUTING.md), the [editorial policy](docs/editorial-policy.md), and the [logic and evidence review procedure](docs/logic-review.md). The detailed documents under `docs/` are currently in Japanese.

Meaningful corrections are recorded in `content/history.json` and shown in the site's history. Git retains every change. CI checks references, graph logic, reviewed content fingerprints, translations, and builds; it does not replace review of scientific reasoning.

## Content and architecture

The map is a static site hosted on GitHub Pages at **https://ai-safety-map.org/**. No account or database is needed to read it. Content is versioned in Git and reviewed through pull requests.

| Path | Purpose |
| --- | --- |
| `content/map.json` | Scenarios, connections, and condition groups |
| `content/nodes/` | Stable IDs, evidence states, and related items |
| `content/explanations/` | Markdown explanations |
| `content/current.json` | Conditions to watch and scoped mitigation evidence |
| `content/sources.json` | Primary sources, publication dates, and observation periods |
| `content/research.json` | Evaluators, settings, methods, results, and limitations |
| `content/stories.json` | Tour chapters and narrative context |
| `content/glossary.json` | Terms, aliases, and explanations |
| `content/history.json` | Changes and reasons |
| `content/watchlist.json` | Sources and topics to review regularly |
| `content/translations/` | Reviewed English prose and source fingerprints |
| `content/ui/` | Japanese and English interface text |
| `content/news.json` | Retained research-reading examples |
| `docs/reviews/` | Editorial review records |
| `docs/deep-research-prompt.md` | Research brief for expanding the map |
| `docs/research-brief-social-pathways.md` | Research briefs on work, distribution, finance, and money |

[Data model](docs/data-model.md) · [Localization](docs/localization.md) · [Performance](docs/performance.md)

The initial page contains the diagram and short labels. Detailed prose is loaded on demand in the selected language from a versioned JSON package. Off-screen cards and connections are omitted from rendering. After editing local content, restart the development server to regenerate the detail package.

Japanese and English share IDs, topology, and source references. Pre-publication checks reject missing or stale translations. Changes in wording must preserve the original evidence strength and uncertainty.

## Local development

Requires **Node.js 22.13.0 or newer**.

```sh
npm ci
npm run dev
```

Open the URL printed by the server, normally `http://localhost:3000/ai-safety-map/`.

```sh
npm run check
npm run build
```

The app uses React, TypeScript, vinext, Material UI, and Emotion. The static deployment artifact is `dist/pages/`. Production assets are served from the custom domain root; local development retains the `/ai-safety-map/` path. Legacy project-path bookmarks redirect to the root while preserving their reading hash.

Pushes to `main` run validation and publish through GitHub Actions. For another deployment path, update the production `basePath` in `next.config.ts`, `package.json`'s `homepage`, metadata, and content-package URLs together. The export preparation checks entry-point assets before publishing.

## License

Code and development documentation are licensed under [MIT](LICENSE). Original map data and explanations are licensed under [CC BY 4.0](CONTENT-LICENSE.md). Linked third-party material retains its own rights and license terms.

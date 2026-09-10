# Contributing

Contributions can be as small as reporting an unclear sentence or as substantial as a correction based on new research.

## Open an issue

Choose a [correction or research form](https://github.com/mizkun/ai-safety-map/issues/new/choose), include the item's URL or ID, and describe the problem. You do not need to propose a rewrite. For a factual correction, include a primary-source link and the relevant passage if available. If you have not found a source yet, say so; you can still submit an issue.

## Submit a pull request

1. Fork the repository and create a branch.
2. Edit explanations in `content/explanations/`. If the meaning changes, also review the corresponding evidence in `content/nodes/`.
3. Edit pathways and additional conditions in `content/map.json`, and sources in `content/sources.json`. Keep stable IDs when renaming labels because shared links use those IDs.
4. For a change in meaning, add an entry at the beginning of `content/history.json` with the previous wording, the new wording, the reason, affected items, and sources. Git history alone is sufficient for a pure typo correction.
5. When checking new evidence, update only the affected node or connection's `review.checkedAt`, and update `content/map.json`'s `asOf` when needed. Keep publication dates and observation periods distinct. Record the evidence and reasoning under `docs/reviews/`.
6. Run `npm run review:draft -- --id=YYYY-MM-DD-short-subject`. Complete the eight questions in the [review procedure](docs/logic-review.md), including reader prerequisites and why the topic appears, and identify the relevant primary-source passages. Review dependent connections and tour text too.
7. Update and review the English translation alongside the Japanese source. Run `npm run check` and `npm run build`, then describe the reason and validation in the PR.

CI detects broken references, inconsistent AND/OR groups, undeclared cycles, stale review fingerprints, and build errors. Passing CI does not establish that a scientific interpretation is correct. Reviewed changes reach the site after merging into `main`.

The detailed documents under `docs/` remain in Japanese. See [Keeping the content current](docs/keeping-current.md) for research sources, records of retained explanations, and the scope of automation.

## Review content

- Is the change or condition described by each item clear?
- Are observed events, experiments, arguments, predictions, and editorial inference distinguished?
- Does each source support the associated claim within its stated scope? Are limitations and contrary results retained?
- Are capability, behavioral tendency, access rights, defenses, and harm kept separate?
- Are additional conditions clear, including which are joint and which are alternatives?
- Are catastrophe and loss of human agency distinguished from human extinction?
- Are hypothetical examples identifiable as such?
- Are unfamiliar terms and useful aliases included in `content/glossary.json`?
- Do evidence colors describe support for individual conditions, without treating uncertainty as safety or computing a scenario-wide risk score?

When interpretations differ, retain the assumptions behind the disagreement. Insufficient evidence can remain unresolved. Do not add conditions merely to make pathways equal in length or depth.

## Translation

Interface text and map prose are separate. See [Localization](docs/localization.md) for translating and reviewing English content. IDs, causal relationships, and source references are shared. Do not strengthen or weaken claims or uncertainty during translation.

## Contribution licenses

Contribute code under MIT, and original map data and explanations under CC BY 4.0. Do not copy third-party text or figures without checking their terms. Prefer links to original material and explanations in your own words with attribution.

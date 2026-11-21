# November 1, 2026 — correct the Carbon pass count

## Scope and decision

Daily review for **October 18–November 1 JST**. Sunday: no weekly survey is claimed. Reuse the sole open draft [PR #11](https://github.com/mizkun/ai-safety-map/pull/11), with no comments at the start of this review. Work starts from `459921e78fd09e191d626a1b58f8863a7f225e56` in the existing isolated worktree. A fresh fetch finds `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor. The original checkout remains clean at `0ec102b1788c10763bd864cd24832f678b67f928`.

Correct one existing source record, one research card and one sentence of **R1**, in Japanese and English. Add a correction to the history. No new source or card is needed. The source is also used by **C3a1**, whose explanation remains unchanged. Preserve classifications, topology and all node, edge, route and evidence review dates: this is a scoped correction, not a fresh audit of every historical source behind those explanations.

## Primary-source discrepancy and correction

Read the complete [FrontierCS Carbon evaluation](https://frontier-cs.org/blog/gemini-4-carbon/): key points, results, pass-rate chart labels, trace inspection and early-stop discussion. Direct retrieval of the original HTML agrees with the web reader. The article's key points and results count **26/48** passes for both Carbon and Argon; the chart shows the corresponding rounded **54%**. Our draft's research card and R1 paragraph instead say **25/48** for Carbon.

Replace that count with **26/48**, explicitly describing it as the report's scored pass count. Retain the distinction between passing a test and solving the intended problem. The authors identify three loopholes among passing runs; removing one eliminates that pass, while the other two contributions remain unresolved. Do not subtract a loophole from the reported aggregate without separately labeling that calculation.

Publication remains **October 29**. Initial run dates are unspecified. The report includes three Carbon reruns on October 29 after a background-command waiting change. The task budget is five hours; the six-hour CLI wait is not a new task budget. Four Argon early stops were not rerun, so matching pass counts do not establish a fully matched capability comparison. The authors also describe an infrastructure-related rerun; this is an evaluator-prepared environment, not an autonomous deployment or a real-world incident rate.

The October 30 review recorded 25/48. Preserve that historical record, but **supersede its numerical claim here**. Today's article does not establish when or why that discrepancy arose; do not attribute it to a new experiment or invent a dated author correction. Renew only this source's confirmation date after rereading its methods, results and limits. No new term requires a glossary entry.

## Dependencies and bilingual reading

Generated both reading exports, with **119 tour stops, 76 nodes and 41 connections** each. Read R1 and C3a1, the updated card, the modified paragraph in exported context, **R1-R2**, the `acceleration`, `evaluation` and `research-cycle` graph definitions, the acceleration route and complete story, C3a1's evidence summary, and the three dependent news entries (`recent-math`, `research-lab-september`, `research-contribution`) in both languages.

The correction does not measure research-wide acceleration. Verification delays can offset faster implementation, and a scored success can exploit a test. **R1-R2** therefore keeps its bottleneck, usefulness and verification conditions. C3a1 keeps the distinction between evaluation gaps and demonstrated operational danger. The accompanying structured record covers **16 changed/dependent units across two assessments**; it is editorial checking, not independent scientific replication or external approval.

Preservation assertions verify **158 unchanged source records, 162 unchanged cards, 50 prior history entries, 300 prior history translations and 3,424 other translation strings**. All 76 node review dates, all edges and graphs, and current-status data are unchanged. The map's `asOf` records this limited update; it does not claim all content was checked today.

## Daily coverage and exclusions

Opened all **19 daily starting URLs** from the draft watchlist: METR (4), AISI (1), OpenAI (5), Anthropic (7) and DeepMind (2). Compared candidates with **159 existing sources, 163 cards**, review records and the sole open PR. Targeted searches covered corrections, monitoring and safeguard improvements, counterarguments and independent checks, as well as capability/incident leads. Search summaries and secondary articles were used only as leads.

- The October 30 Rosalind addendum is already included. Reopened its capability, access and enforcement sections; it still reports a post-deployment retest in progress rather than public results for version 6. No extra confirmation-date update is justified.
- Reopened OpenAI's October 29 monitoring account and METR's October 22 audit. The audit remains historical; the reported pending fix and lack of independent validation of subsequent changes do not support a new effectiveness claim. The incident index remains at 20 reports and three notices, with October 20 the latest listed report update.
- Anthropic's CVD page still reports October 2, 19:47 UTC. Recent AISI, Anthropic, OpenAI and DeepMind entries were already adopted or screened in prior records. A current date in a news-page header is not a new article publication date.
- The original arXiv version histories for `2610.31733`, `2610.29734` and `2610.26651` still show v1; Transect `2610.08364` remains at the already-recorded v2. No new version-based correction was found in these checks. This is not a new full-paper review.
- No additional primary correction or independent reproduction changing the map was verified in this bounded search. Earlier unresolved supplementary-source gaps remain; no model runs, source-embedded instructions, Issue instructions or PR instructions were executed.

Freshness initially reports **zero due items and six within two days** on the draft. This is date arithmetic, not scientific verification or a claim that undeployed main is current. No dates were refreshed merely for scanning indexes.

## Validation

- `npm run check`: passed, including **81 tests**, content and bilingual gates, dependency review, TypeScript and lint.
- `npm run build`: passed, with local prerendering and **11 entry-point assets**.
- `npm run review:reading`: both editions exported **119 tour stops, 76 nodes and 41 connections** each; the substantive reading scope is recorded above.
- `npm run check:freshness -- --date=2026-11-01`: **zero due items, six within two days** on the draft.
- `git diff --check` and preservation assertions passed. Exactly three non-history translation fields change; the large translation-file diff otherwise shifts history entries while preserving their text by stable ID.
- No UI, browser-layout, physical-device or production validation is claimed. CI is recorded against the pushed commit in the PR.

Leave this correction in existing draft PR #11 for human review; no automatic merge or deployment.

# October 22 review: research interpretation and responses to alerts

## Scope and decision

- Daily review for **October 22, 2026, Asia/Tokyo**, covering **October 8–22**, including defenses, corrections and counterevidence. This is Thursday; the broad weekly scan remains in the [October 19 record](2026-10-19-research-cycles-and-controls.md).
- Read the policies, watchlist, existing sources, review records and sole open draft, **[PR #11](https://github.com/mizkun/ai-safety-map/pull/11)**. Deduplicate against `da919633ac6b7e52c7dd1b971b29a6c25a9f9413`. Freshly fetched `origin/main` is `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of the draft. Continue the isolated worktree; preserve the clean original checkout at `0ec102b1788c10763bd864cd24832f678b67f928`.
- Add **two sources and two research cards**, with bilingual explanation changes at **R1** and **C3b**. Preserve classifications and graph connections. No merge or deployment.
- Freshness before and after editing: **zero due items; 38 within two days**. Near-term dates are not renewed merely because this check ran.

## Evidence and changes

### Distributed interpretation of existing biological data: R1

Read Sun et al., [Distributed AI agents enable comprehensive discovery of biological insights at scale](https://www.biorxiv.org/content/10.64898/2026.10.15.759436v1): main-text Results, Figures 1, 2 and 4, Discussion and data availability. The publisher's [version API](https://api.biorxiv.org/details/biorxiv/10.64898/2026.10.15.759436) and PDF identify **v1 posted October 16**, not the October 15 embedded in the DOI. OpenAI's [author announcement](https://openai.com/index/scaling-ai-research-for-complex-biological-data/) appeared **October 21**. Record one original-study source, **`distributed-biology-study`**, and card **`distributed-biology-interpretation`**, avoiding duplication of the announcement.

The team ran 1,946 GPT-Rosalind-5.5 agents in parallel on existing mouse-brain perturbation data, with human-supplied context, instructions, analytical tools and literature access. The source manuscript and conclusions were withheld. The stated December 2025 knowledge cutoff predates that manuscript's March 2026 release, but this alone does not prove absence of information leakage with literature tools. Exact run and expert-review calendar dates are not given in the main text.

Of 71 findings in the source study, 55 were testable from the supplied expression data. Agents matched or refined 48 and partially recovered four. Do not describe this as recovering every source-study conclusion. Thirty doctoral-level biological experts evaluated 60 selected reports: 20 high-, ten middle- and ten low-ranked distributed reports, plus 20 top-ranked single-agent reports. Each report received three ratings. Reviewers could search online but could not use generative AI. In the paired comparison, 20 pairs generated 60 judgments: 45 favored distributed reports, ten favored single-agent reports and five tied. These are judgments of selected reports, not 60 independent scientific discoveries or experimental confirmations.

The reported **32 minutes** is elapsed parallel analysis time. Human effort of months to a year is an illustrative estimate, not measured human performance. Figure 2 fixes model, prompt, reasoning setting, tools and data access for the workload comparison; it does not establish equal total computation across single and distributed configurations. Do not promote the announcement's speed comparison to a measured research-wide multiplier. The main paper's **711-fold reference count** is also different from “711 references”; the public card does not use this quantity as a quality score.

Previously R1 lacked this example. Add a short explanation distinguishing research prioritization from prospective experimental validation. Retain **observed** research assistance. This does not establish R2 whole-development acceleration, R3 recursive improvement, R4 safety-specific benefit, ASI or broad biological misuse. The authors themselves call for independent datasets, prospective experiments and matched comparisons. The work is a developer-coauthored preprint, not independent replication or peer-reviewed confirmation.

The main PDF and publisher XML were retrieved directly after web-tool access failed. XML identifies supplementary materials, but the supplementary page and PDF returned HTTP 429. **Supplementary methods were not read**; no claim depends solely on them, and exact model effort/token configuration is not asserted. The authors' [public repository](https://github.com/jinlabneurogenomics/distributed_agent/) was inspected at `c20445d929f5aedce1d539ef6fbd8843b8c06e25` (October 21). Availability of code and data is not reproduction; none was executed. Keep the supplemental-methods gap for follow-up before stronger generalization.

### Assessing response after detection: C3b

Read METR's [October 14 proposal](https://metr.org/blog/2026-10-14-control-assessment-proposal/), including its response and access qualifications. Add **`metr-control-assessment-proposal` / `end-to-end-control-assessment`** as **argument**.

Previously C3b included response-delay examples and recommendations without this external-assessment proposal. Add it under countermeasures: test whether notification leads to timely human action and containment. This is not a new experiment, incident, measured stopping-time distribution or demonstrated mitigation. Access and trustworthy records constrain what an assessor can conclude. Proposed sample counts are not completed evaluations.

Retain **limited** status and the existing **indirect** evidence summary, which remains attributed to earlier incident records. Do not renew its October 19 date merely to add a recommendation elsewhere. The proposal complements the October 21 external-review addition at C3a1; it is a distinct source and does not duplicate that review.

## Daily coverage, corrections and exclusions

Inspect all **19 daily starting URLs**. Follow originals for new candidates; search results and automated summaries are leads only.

| Daily starting sources | Result |
| --- | --- |
| METR research, notes, blog and horizons | Previously covered August-risk review and research remain. A targeted search found the October 14 assessment proposal above, which was not shown in the current index excerpt. Horizon maintenance status is not a new capability measurement. |
| AISI blog | October 12 practices, October 7 Transect and October 1 evaluation-security material were already covered. |
| OpenAI safety, research, deployment, alignment and incident indexes | The October 21 biology announcement leads to the original preprint above. Deployment entries and October 20 monitor metrics were already covered. The incident index retains 20 reports and three notices; the monitoring-suppression report remains updated October 20. |
| Anthropic alignment, research, threats, CVD, news, cards and Safeguards | GRAFT, binder validation, self-assessment, threat report and recent cards were already covered. CVD retains the October 2 19:47 UTC snapshot. Read the October 21 Christopher Stubbs appointment: a governance announcement is not measured defense effectiveness, so it does not change the map. The linked public-benefit landing page is not a full audit of its report. |
| DeepMind model cards and blog | Recent Argon, embeddings, antimicrobial, robotics and scam-defense material was already covered; no additional relevant result verified. |

Recheck [GRAFT's submission history](https://arxiv.org/abs/2610.17062) and [MASS's submission history](https://arxiv.org/abs/2610.12176): both remain v1, dated October 12 and October 8. Preserve the previously documented MASS qualification. Do not treat unchanged listings as a fresh scientific review or renew their dates.

A targeted defense search also returned AISI's older asynchronous-control work. The [original arXiv history](https://arxiv.org/abs/2512.13526) contains only v1 from **December 15, 2025**, outside this daily window. Its abstract was read to establish age and scope; the numerical result is not newly adopted without full-method review. Searches for corrections, counterarguments and replications of the new material did not verify an independent replication. This is a bounded search, not proof that none exists. Earlier IMF eLibrary full-text gaps remain as recorded in the weekly review.

## Dependency and bilingual reading

Read R1 and C3b in both languages, C3's parent overview and relationships, both new source/card pairs, **R1-R2**, acceleration/research-cycle/oversight graphs, the acceleration route/story, C3b's evidence summary, and three linked news contexts: recent-math, research-lab-september and research-contribution. The [structured companion](2026-10-22-research-interpretation-and-response.json) covers **19 changed or dependent units** with four assessments.

R1-R2 still requires a useful improvement to a real bottleneck without offsetting verification delays. Oversight alternatives remain alternatives, not mandatory consecutive stages. Retained news examples keep their original citations. Dependency reading does not renew every older source's scientific review.

Only the two substantively changed node dates, two new source check dates and map `asOf` advance. Existing edge/evidence dates, classifications, glossary, topology, UI and navigation remain unchanged. Preserve the 41 previous history entries and their English translations by stable ID.

## Validation

- `npm run check`: passed, including **81 tests**, bilingual publication gates, dependency-review coverage, TypeScript and lint. The initial restricted invocation could not write TypeScript's incremental cache; the permitted rerun completed successfully.
- `npm run check:freshness -- --date=2026-10-22`: **zero due items; 38 within two days**. Date validation does not establish scientific validity or change undeployed main.
- `npm run review:reading`: exports contain **119 tour stops, 76 nodes and 41 connections per language**; relevant text read as listed above.
- `npm run build`: passed with permitted localhost prerendering; **11 entry-point assets** checked. Inventory: **76 nodes, 41 edges, 134 sources and 137 research cards**.
- Preservation assertions passed: **132 prior sources, 135 prior research cards, 41 prior history entries, 246 history translations and 3,120 unaffected translation strings** remain intact. Existing paragraphs, classifications, topology and unrelated dates are preserved.
- `git diff --check`: passed. Original checkout remains clean and unchanged.
- No browser-layout, physical-device or live-production verification is claimed for this content-only update. Keep the existing draft for human review; no merge or deployment.

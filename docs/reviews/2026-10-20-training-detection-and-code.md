# October 20 review: training defenses, misuse detection and coding

## Scope and decision

- Daily review for **October 20, 2026, Asia/Tokyo**, covering **October 6–20**, corrections and counterevidence. This is Tuesday; the broader Monday review and its remaining retrieval gaps are recorded in [October 19](2026-10-19-research-cycles-and-controls.md).
- Read the policies, watchlist, existing sources, prior review and sole open draft, **PR #11**. Deduplicate against its head `cb04a428317798706851d6cbb178b301ee8d1bb4`. A fresh fetch leaves `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of the draft. Reuse the independent review checkout and branch. Preserve the user's clean main checkout.
- Add **three sources and three research cards**, with new bilingual paragraphs at **C1, M3 and C2a**. Clarify the existing **MASS** card rather than adding a duplicate. All evidence categories and graph connections remain unchanged. Add Anthropic's Safeguards blog to the daily watchlist.
- Freshness checks before and after the update report **zero due nodes/edges and zero within two days**. This update addresses substantive new evidence, not a scheduled date-only renewal. No merge or deployment.

## Evidence and changes

### GRAFT: training defenses at C1

Read the [original paper v1](https://arxiv.org/html/2610.17062v1), Sections 3–5 and 7, Figure 2 and Appendix D.1–D.3, and the [October 19 author explanation](https://alignment.anthropic.com/2026/graft/). The [submission record](https://arxiv.org/abs/2610.17062) dates the paper to **October 12**; experiment dates are unspecified. Keep publication and explainer dates separate.

Add **`graft-gradient-routing` / `graft-reward-hacking`**. The card records the model, human-designed monitoring conditions, comparison seeds and the distinction between reinforcement learning and the separate larger supervised-learning experiment. Report reduced hacking qualitatively, avoiding an implication of zero failures across all settings. The half-hackable variant and generalization tests provide counterexamples to universal superiority.

Previously C1 described failures and general mitigation advice without this training result. The added paragraph gives a concrete defensive example and its scope. Retain **limited/tested** classification. Do not attach it to **R4** as evidence of AI conducting safety research: that is a different claim. **R4-C1** remains a conditional mitigation connection, with deployment and persistence still requiring verification. No independent replication was verified.

### Self-assessment: detection is not prevention at M3

Read Anthropic's [October 16 original report](https://safeguards.anthropic.com/2026/self-assessment/) from Method through Limitations, including data-handling footnotes. Add **`anthropic-self-assessment` / `self-assessment-misuse-detection`**. The card separates operational monitoring from the controlled blocking experiment, identifies the teacher supplying both training and evaluation labels, and preserves the experimental denominator.

Previously M3 lacked this post-response monitoring approach. The new explanation describes its value for human review before explaining why detection cannot be equated with immediate blocking. Preserve the distinction between production settings and the trial with existing blockers disabled. Shared teacher blind spots, excluded traffic and missing sample/experiment details limit interpretation.

Retain **M3 as a hypothesis** about defenses failing to contain wider harm. A monitoring improvement is not proof that all misuse is prevented; a controlled bypass is not proof that production defenses have collapsed. Do not use self-assessment as evidence that a misaligned agent reliably reports its own misconduct at C3a. **M3-H** still requires dangerous use, effective assistance, failed containment/recovery and wider reach together. Add the [Safeguards blog](https://safeguards.anthropic.com/) to watchlist coverage.

### Coding: partial functionality and completion at C2a

Read OpenAI's [October 19 original evaluation](https://openai.com/index/low-resource-programming-languages/), Sections 1–2, and the linked [MultiLangBench README](https://github.com/openai/MultiLangBench). Repository head: `995755bffdba3da60ca367448a1606ba0e50573a`, October 19. Do not run source instructions or benchmark code.

Add **`openai-low-resource-code` / `multilang-code-completion`**. Record the model and reasoning settings, supplied documentation, network restrictions, reference grading and public test subset. The migration experiment has a different all-tests success criterion. Its task count, intervention count and run budgets are not specified in the article; publication date is not an experiment date.

Previously C2a's recent example was the Ironclad workflow evaluation. Add the coding result while explaining why its two metrics cannot be compared as interchangeable completion rates. Update the evidence summary but retain **limited/tested**. Neither **R0-C2a**'s transfer conditions nor actual permissions are established merely by a score gain. No W1 occupational-replacement or R1 research-automation upgrade follows. No benchmark rerun or independent replication was verified.

### MASS: clarify version and implementation scope

Reread [v1 Appendix C.5 and Table 7](https://arxiv.org/html/2610.12176v1) and the unchanged [submission history](https://arxiv.org/abs/2610.12176). Compare the author repository's [README](https://github.com/SakanaAI/mass), [experiment coverage](https://github.com/SakanaAI/mass/blob/main/docs/experiment_coverage.md) and [implementation notes](https://github.com/SakanaAI/mass/blob/main/docs/reproduction.md). Repository head: `fb403581bed2c974b3f99e7236224169da643079`, October 9.

The paper reports **12 MLR-Bench tasks × 5 trials**; the README reports **107 × 3** with different aggregate results. The repository identifies the packaged subset as earlier, lacks the larger configuration and documents differences from the original workflow-search protocol and gaps in historical run records. Public availability therefore does not independently reproduce the paper's result.

Previously the card identified paper sections without noting these differences. Qualify its locator and limitation, keeping **`mass-two-rounds`** tied to v1. Renew only **`mass-self-supervision.checked`** for this source cross-check. Preserve R3's limited/tested classification, explanation, evidence summary and yesterday's node/edge dates. **R2-R3** and **R3-R2** already distinguish bounded iteration from sustained acceleration. Do not silently replace paper values with repository values or pool their denominators. The October 19 record remains a dated account of the paper read then.

## Coverage, exclusions and limits

All **18 existing daily starting URLs** were inspected, plus the newly identified Safeguards blog (**19 after this update**). Header-only initial results were reopened before making a coverage decision. Relevant originals were read; search results and automated paper reviews were leads, not evidence.

| Daily sources | Finding and action |
| --- | --- |
| METR research, notes, blog, horizons | Latest listed work and October 6 observability were already covered. The horizon page still carries the September 8 maintenance notice; it is not a new measurement. |
| AISI blog | October 12 practices, October 7 Transect, October 1 evaluation security and September 28 simulations were already covered. |
| OpenAI safety, research, deployment, alignment and incidents | Adopt the coding evaluation above. Previously covered GPT-6, Live, LASER/metagaming and incident entries do not warrant duplicates. Incident index still lists 19 reports and three notices, latest October 15. |
| Anthropic alignment, research, news, cards, threats, CVD and Safeguards | Adopt GRAFT and self-assessment. October 16 research and October 18 public-benefit announcement were previously handled. CVD still shows the October 2 19:47 UTC snapshot: no count-only refresh. |
| DeepMind model cards and blog | Argon, embedding, antimicrobial, robotics and scam-defense entries were already covered. No additional relevant result verified. |

OpenAI mathematics retains head `1581d4cbdd69a0faf34b2089614fe2a814316a6a`, October 12. Preserve the previously recorded corrections rather than duplicating them. Targeted searches for the new studies' corrections, counterarguments and replications did not identify a verified independent replication. This bounded search does **not** establish that none exists. An AI-generated referee report and secondary summaries were excluded as factual evidence. No claim depends on rerunning external code.

## Dependency and bilingual review

Read **C1, C2a, M3 and R3** from definition through limitations in both languages, plus four source/card pairs, **six arrows**, five graphs, three routes, three stories, five news contexts, three evidence summaries and the misuse current-information summary. The companion JSON covers **42 changed/dependent units across eight assessments**. The reading export contains **119 tour stops, 76 nodes and 41 connections per language**.

Retained summaries keep their original source attribution and dates. Dependency reading does not mean every older source was reread or scientifically revalidated. No glossary, UI, topology or navigation change is needed. Only C1/M3/C2a node dates, C1/C2a evidence dates, new source dates, the MASS source check and map `asOf` advance. Preserve all **39 prior history entries and their English translations by stable ID**.

## Validation

- `npm run check`: passed, including **81 tests**, bilingual publication gates, review coverage, TypeScript and lint.
- `npm run check:freshness -- --date=2026-10-20`: zero due nodes/edges; zero within two days. A date calculation, not scientific validation or the state of undeployed main.
- `npm run review:reading`: exported both language editions; relevant text read as above.
- `npm run build`: passed with permitted localhost prerendering; static export checked **11 entry-point assets**. Inventory: **76 nodes, 41 edges, 128 sources and 131 research cards**.
- Preservation assertions passed for all **125 prior sources and 128 prior cards**, except the explicitly listed MASS source date and card locator/limitation changes. All **39 prior history entries**, their English translations by stable ID, and **3,039 unaffected translation strings** are preserved. Existing node paragraphs, unlisted dates, all evidence categories and graph topology are unchanged. The first preservation script exceeded its default subprocess output buffer; rerunning with a larger read buffer passed.
- `git diff --check`: passed. The user's original checkout remains clean and unchanged.
- No browser-layout, physical-device or live-production verification is claimed for this content-only update. No merge or deployment.

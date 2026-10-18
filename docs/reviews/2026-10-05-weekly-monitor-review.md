# October 5 daily and Monday review

## Scope and working state

- Daily window: September 21–October 5, 2026. Monday backfill also checked weekly watchlist sources and relevant material from the preceding months, including defenses, external evaluations, criticism and resilience.
- Read `keeping-current.md`, `editorial-policy.md`, the watchlist, source/research inventories, prior review records and the open draft. No instructions embedded in external material were executed.
- Fetched `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`. Existing Draft PR [#11](https://github.com/mizkun/ai-safety-map/pull/11), at `6ddac48d70edf48db15542d8c74b481d4fcc5b28`, already descends from that base. Continued its branch in a separate worktree; the user's clean checkout at `0ec102b` was preserved.
- The draft already covers October 1–4 findings. Deduplicated by source URL, claim and prior review, rather than creating another PR. No merge or deployment is part of this run.
- Freshness before the change: no items due and none due within two days. This addition is a substantive backfill, not a due-date refresh.

## Adopted: external stress tests of internal monitors

Primary report: AISI, [How our Control Red Team is stress-testing frontier monitors](https://www.aisi.gov.uk/blog/how-our-new-control-red-team-is-stress-testing-frontier-monitors). The [official safeguards index](https://www.aisi.gov.uk/category/safeguards) dates publication to **July 23, 2026**. Individual experiment dates are unspecified; October 5 is this review date, not the experiment period.

Read the original report's **Our evaluations of frontier control monitors**, **Automated red teaming** and **Next steps** sections. It was absent from the source inventory and earlier review records.

### What was tested and by whom

- UK AISI tested a Google DeepMind monitor that reviews reasoning after actions, and successive versions of an Anthropic internal coding monitor that reviews operations before execution. The internal monitor model versions are not specified.
- The report describes weaknesses in both systems. Some concern monitor judgment; others concern routing or filtering that leaves operations outside review. AISI reports feeding findings into Anthropic's revisions and testing, including Mythos Preview testing.
- A **separate automated search example** uses Claude 4.6 Sonnet as both proposal model and monitor. That model identity must not be assigned to all of the internal monitors above.
- The search setting can expose monitor scores or reasoning not available to a deployed agent. Humans select and construct the testing setup, inspect findings and feed them back to developers. These are adversarial tests, not observations of ordinary spontaneous malicious behavior.
- AISI is an external evaluator working with developers. This is not a product-wide independent certification, an independent replication of the developers' deployment outcomes, or a measured rate of harmful activity in the public service.

### Supported claim and limits

The report supports that concrete monitoring weaknesses can be found by an external evaluator and used to inform revisions. It also identifies the coverage of operations sent to a monitor as a separate issue from the monitor's classification ability.

The automated search scores are **not evasion success rates**. This update does not import those numbers or operational attack examples. Realistic attacker information and resources, repeated trials and monitor variability remain relevant. No general post-fix detection rate, prevention rate or reduction in real-world harm is established. The inspected material and targeted searches did not identify a new independent replication of this result; this is a bounded search finding, not proof that none exists.

### Before, after and fixed IDs

| Item | Before | After and rationale |
| --- | --- | --- |
| `C3a3` | Covered control experiments, a historical agent-coordination incident, METR's artificial transcript test and action-aware monitoring improvements in Sol tests. | Adds the July AISI external evaluation, the gap between routing coverage and judgment, the privileged-information limitation and the need to retest fixes under realistic access. |
| `source:aisi-monitor-stress-tests` | Not registered. | Adds the original report with publication, unspecified experiment dates, review date and evaluator provenance separated. |
| `research:external-monitor-stress-tests` | Not registered. | Separates the two internal monitor settings from the Sonnet automated-search example, reports the revision feedback and states the missing deployment-rate evidence. |
| `evidence:C3a3` | `tested`, with a summary distinguishing artificial records and improved monitoring from ordinary-use evasion frequency. | Keeps the level and summary; adds the research link. No stronger risk or progress score is inferred. |
| `graph:evaluation` | Alternative mechanisms `C3a1`, `C3a2`, `C3a3` below `C3a`. | Reviewed and retained: overlapping alternatives, not a time sequence. |

Only the node and evidence review dates for `C3a3` advance to October 5. The new source has its own October 5 check date. `map.asOf` advances as the latest incorporated content review; it does not date every explanation. Existing source dates are not refreshed merely because their pages or indexes were visited.

No new edge is needed. Checked `C3-L`: selection of a misaligned action (`C1`), execution capability/access (`C2`) and failure of prevention (`C3`) must coincide in the relevant setting. A bounded monitoring weakness does not establish persistent control loss, an ASI outcome or global harm. `C3a2` concerns concealment during evaluation; `C3b` concerns a response arriving too late after danger is noticed. Those distinctions remain intact.

Read the changed detail and neighboring tour passages in both languages using `review:reading`, along with the evaluation subgraph and control story. The explanation first defines who is overseeing whose work, then explains why monitor coverage and test information matter. Japanese and English both retain alternative permission restrictions and human intervention. No additional glossary term is needed.

## Daily scan, corrections and duplicate findings

The following are bounded source inspections, not claims of exhaustive coverage or byte-for-byte source comparisons. Dates for unchanged entries were preserved.

| Primary starting points | Result and disposition |
| --- | --- |
| [METR research](https://metr.org/research/), blog/notes and time-horizon page | September action-monitor, Opus evaluation and testimony material already covered by this draft or prior reviews. Retained the distinction between dated evaluations and current capability ceilings. No explicit correction identified in the inspected action-monitor report. |
| [AISI blog](https://www.aisi.gov.uk/blog) and safeguards index | October 1 evaluation-security measures already in the draft. July 23 monitor testing is the substantive backfill above. |
| OpenAI research, safety and [misalignment reports](https://alignment.openai.com/misalignment-reports/) | October 2 updates to the reference-tool cases and authorized-restart case already covered on October 4. The restart case remains explicitly distinct from shutdown evasion. Existing Sol monitoring evidence and its limits were retained; no explicit correction identified in the inspected material. |
| Anthropic research, alignment, [threat intelligence](https://www.anthropic.com/threat-intelligence-report-september-2026) and CVD dashboard | Claude-shaped science, robot work, GLM and Swap already covered. The CVD dashboard retained the inspected October 2 19:47 UTC snapshot, not a new daily incident count. No explicit correction identified in the inspected science, GLM, robot-work or threat-report text. |
| DeepMind blog, model cards and the linked SynthID-Bio paper | September material already covered. No explicit correction identified in the inspected paper. [August double-blind evaluation pilot](https://deepmind.google/blog/piloting-the-worlds-first-double-blind-ai-evaluations/) was previously considered; its integrity/privacy contribution is not a measured harmful-action containment rate. |

Targeted correction, replication and counterargument searches were used as leads, not as evidence by themselves. Secondary commentary did not justify a new factual claim or evidence-level change.

## Monday weekly and earlier-material review

| Source and inspected scope | Interpretation and disposition |
| --- | --- |
| [International AI Safety Report publications](https://internationalaisafetyreport.org/publications) | The index's latest report remains the February annual report. Synthesis is useful for leads, but no new primary experiment was adopted from it. |
| [SIPRI military-AI dialogue report](https://www.sipri.org/news/2026/sipri-hosts-dialogue-state-industry-collaboration-lawful-military-ai), September 17 | Read the report on the September 9–10 dialogue. Procurement and state–industry recommendations are work in progress, not measurements of escalation (`S1–S3`) or defensive effectiveness. The subject index's recent-publications link returned unrelated older material, so it was not treated as a reliable current inventory. |
| ILO publications/research index and September 15 enterprise-AI candidate | Deduplicated against the substantive September 17 review. That record already distinguishes company interviews and professional perceptions from representative adoption, wages and causal job displacement (`W3`, `W6`, `I2`). This run did not repeat the full underlying study review. |
| [IMF, Artificial Intelligence and Cybersecurity in the Financial Sector](https://www.imf.org/en/publications/imf-notes/issues/2026/06/29/artificial-intelligence-and-cybersecurity-in-the-financial-sector-576706), full note | Read the abstract, risk channels and recommendations. Provider concentration, containment, substitutes and recovery bear on `A1–A3` and `F4`; these are analysis and recommendations, not measured defense success. The existing distinctions already cover them. The June 29 index / June 30 article date discrepancy is not resolved by assigning an invented common date. No source or empirical claim was added. |
| [IMF payments-policy speech](https://www.imf.org/en/news/articles/2026/09/28/sp092826-ai-and-the-future-of-payments-policy), September 28 | Read the original speech. Prospective agent-payment benefits and policy issues are not completed autonomous transactions or AI profit (`I1`, `I1b`). A separate agentic-payments note was April 22 material, not a new September publication merely because the search result showed a September index date. |
| [FSB](https://www.fsb.org/) index and relevant financial-AI material | General resilience concerns do not supply a new empirical result for agent behavior, systemwide failure or defense. No verified correction requiring an update was found in the inspected material. |
| [BIS Bulletin 137](https://www.bis.org/publications/bulletin-137-circular-relationships-among-ai-firms), October 1; full PDF | Read takeaways and the economic-implications discussion. Financing relationships among AI firms during 2021–25 are not observations of AI agents choosing investments or causing the `F1–F3` failure sequence. The financing-risk analysis is outside those mechanisms; no forced mapping or color change. A September trusted-execution-environment publication was screened by title/abstract only. |
| [Visa Intelligent Commerce](https://www.visa.com/en-us/solutions/intelligent-commerce) | Product description does not independently establish deployed transaction volume, profit or reliability. Existing dated Artemis evidence remains separate; no new quantitative claim adopted. |
| [The AI Resilience Gap](https://arxiv.org/html/2607.07359v1), July 8, version 1 | Read the relevant framework sections after earlier abstract screening. Criticality, substitutability, fallback and dependency mapping are proposals, not measured human-capacity loss or recovery success. Existing `D2`, `A1`, `A3`, `F4` explanations retain those conditions without claiming proven mitigation. Legal assertions were not adopted. |
| [AI Loss of Control Incident Management](https://arxiv.org/abs/2605.30406) and [Singapore Consensus 2026](https://arxiv.org/abs/2608.14611) | Abstract/metadata screening only: taxonomy and research priorities, not a new observation of control loss or recovery effectiveness. No empirical or publication-date claim was adopted from these leads. |
| Targeted arXiv/PMLR searches for monitoring, agent safety, guardrails and social dependence | Screened primary abstracts for alternative viewpoints and evaluations. Position arguments, benchmark construction and reported perceptions were not promoted to demonstrated real-world control failure or institution-wide dependence. No search-result summary was used to certify a factual addition. |

No due item was kept current solely by this scan. Candidates not adopted are recorded to avoid repeatedly treating them as new findings.

## Validation

- `npm run check`: passed; 81 tests, content/locale validation, dependency-matched logic review, TypeScript and lint. Inventory: 76 nodes, 41 edges, 82 sources and 87 research cards.
- `npm run build`: passed; static export and 11 entry-point assets validated. The prerender needed permitted localhost access.
- `npm run review:reading`: generated 119 tour stops and all 76 node / 41 connection readings per language. The changed detail and neighboring passages were read in Japanese and English; generation alone is not the editorial review.
- `npm run check:freshness -- --date=2026-10-05`: no items due and none due within two days, before and after this update.
- `git diff --check`: passed. Previous English history translations were checked against their stable entry IDs after adding the new entry.
- Browser spot check of the built static artifact at `127.0.0.1:8765`: opened `C3a3` in both languages, expanded the new research card, checked its source link, dates, setting and limitations, and inspected the rendered layout. No browser error log entries were recorded. This was a desktop local-build check, not a physical-phone test or production verification.

The version 2 JSON companion covers the eight changed review units through three substantive assessments. Automated checks establish consistency, not independent scientific approval. The proposal remains a draft for human review.

# October 19 review: research cycles and financial controls

## Scope and decision

- Monday review for **October 19, 2026, Asia/Tokyo**: the **October 5–19** daily window, all weekly watchlist starting points, and selected July–September omissions. Read the policies, watchlist, sources, October 12 weekly review, subsequent reviews and the sole open draft, **PR #11**. Deduplicate against its October 18 head, `5abeacfb5efae3c687118627916d0892445edcaf`.
- A fresh fetch gives `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of the draft. Reuse `/private/tmp/ai-safety-map-review-20261016`, branch `codex/review-oct16`, and update the existing remote PR branch only. Preserve the user's clean main checkout at `0ec102b1788c10763bd864cd24832f678b67f928`.
- Add **four sources and four cards**. Update **R1, R3, C3b and F4** in Japanese and English. **R3** changes from hypothesis to limited evidence, with an explicit **tested** current-information summary. This describes a bounded experiment, not sustained acceleration throughout AI development. Update explanations of **R2-R3** and **R3-R2**, preserving their conditional/feedback relations and graph topology.
- **C3b and R3** were the two due nodes; no edge was due. Substantively review them as below. Advance dates only for the four changed nodes, two changed edges, and the **C3b/R3** evidence summaries. Preserve existing source/card records and unrelated dates. No merge or deployment.

## New evidence and its boundaries

### MASS: two iterations of a research feedback loop

Read the [original v1 paper](https://arxiv.org/html/2610.12176v1), Sections 3–5, Appendix B, C.3–C.5 and Table 7, and the [authors' account](https://pub.sakana.ai/mass/). The [submission record](https://arxiv.org/abs/2610.12176) dates v1 to **October 8, 15:44 UTC**. Experiment dates are unspecified. This is a UC Berkeley/Sakana AI author report, not an independently replicated result.

**Qwen3.6-27B** performs three roles: executing tasks, proposing better workflows and evaluating outputs. After additional training, the updated model replaces all three roles for the next cycle. The authors run **two rounds**. Humans supply the environment, tasks and training procedure; GPT-5.5 generated the synthetic task descriptions before the experiment. GPT-5.5 and Claude Opus 4.8 provide external comparison judgments, which do not feed back into training.

Of twelve tasks, nine are assigned to training and three held out. One training task yields no improving workflow and is excluded, leaving **eight training tasks**. The three held-out tasks are excluded from fine-tuning, validation and checkpoint selection, but are used in workflow-search evaluations. Therefore they are not wholly unseen by the experimental process. The first training cycle contains 119 trajectories and 2,435 windows; its reported six-H100, roughly 19-hour fine-tuning cost excludes search and other parts of the pipeline.

On four public research benchmarks, the second-round model's **score per output token** is 1.2–1.6 times baseline. On Terminal-Bench and SWE-Bench the ratios are **0.96 and 0.94**. Table 7 also shows small or uneven absolute-score changes. Public-benchmark results use three trials, except MLR-Bench's five; reported dispersion is not a confidence interval. The MLR experiment uses twelve tasks, not its entire 107-task collection. ScienceAgentBench uses 102 tasks, and the reference environment itself has incomplete execution success. A workflow-transfer experiment fixes executor weights but discovers workflows with all updated roles; it does not isolate improvement of the optimizer alone.

Add **`mass-self-supervision` / `mass-two-rounds`** to **R3**, and the source/card to **R2-R3** and **R3-R2**. Previously these explanations emphasized partial contributions and developer judgments without this iterative experiment. The new evidence supports a limited feedback demonstration. It does not measure total research-cost efficiency, demonstrate continuing gains beyond two rounds, or establish self-directed, industry-wide acceleration. Retain these limits beside the stronger evidence label. No training or repository code was run here.

### Athanor: agents improve another model

Read the [original PDF](https://arxiv.org/pdf/2610.21055), its setup/results in Sections 3–5 and Table 1, and Section 8 limitations. The [submission record](https://arxiv.org/abs/2610.21055) dates v1 to **October 15, 00:56 UTC**; experiment dates are unspecified. The HTML endpoint was unavailable, so the paper was read as PDF text.

Four **Claude Opus 5.5** agents work for **104 hours** on **Qwen3-4B-Base**, each with eight GPUs, public data and execution/evaluation tools. Humans build the environment and starter code, define objectives and recover failed infrastructure. Researchers provide no research advice during the campaign and disallow external teacher-model calls. Public training data nevertheless include material distilled from stronger models.

The six-task development mean rises from **15.9 to 67.3**, and the held-out mean from **9.2 to 48.2**; official Instruct scores are **66.5 and 47.9** in the same evaluation. These reported comparisons do not establish statistically significant superiority. The result remains below official reasoning releases. It is one shared campaign, not four independent replications, and does not replace the Opus researcher with the improved Qwen model.

Add **`athanor-post-training` / `athanor-small-model`** and a bounded paragraph at **R1**. This is evidence for carrying out part of model development, not the same recursive mechanism as MASS or proof that development as a whole accelerates indefinitely.

### Into the Unknown: research output still requires verification

Read the [original PDF](https://arxiv.org/pdf/2610.19159), Sections 2–5, Table 2 and selected appendix grading traces. The [submission record](https://arxiv.org/abs/2610.19159) dates v1 to **October 13, 20:25 UTC**; experiment dates are unspecified. The HTML stops early, so it is insufficient for the results. This review did not read every page of the 163-page appendix or validate the grading agent against humans.

Nine configurations, including **Opus 5.5, GPT-6 Astra and GPT-5.6 Sol**, attempt fifteen scientist-selected open computational follow-ups. They receive original papers, code, data and internet access. Six tasks provide eight H200 GPUs; nine use CPUs. Runs have no time limit and allow up to five review/relaunch rounds. Scientists check requirements, while GPT-6 Astra grades records and submissions in four runs, requiring three passing judgments per rubric item.

Table 2 and Section 4 report **0 of 135** submissions meeting all conditions and **114** failing integrity checks, such as support for claims in execution records. This is not a measure of deliberate deception or the value of all human-assisted research. Some appendix examples turn on the distinction between a minimum visible instruction and a stronger scientific rubric. Do not translate every failed check into fabrication.

The first version contains editorial inconsistencies: Section 3 lists seven configurations while Table 2 contains nine; a Figure 6 caption says 105 submissions while the main results use 135; a legacy Section 5.2 sentence conflicts with the updated table's integrity-pass rows. **Do not adopt model rankings or claims about time improving performance.** Attribute the aggregate counts to the authors and retain the inconsistencies in the card. No independent replication or human regrading was verified.

Add **`open-science-followups` / `open-science-verification`** to **R1** as a counterpoint to small-model and selected-task gains. The new paragraph separates producing a plausible research report from verifying a scientific result; it does not erase successful bounded research assistance.

### FSB: stopping AI and keeping financial services running

Read the [final report landing page](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/) and [original PDF](https://www.fsb.org/uploads/P151026-1.pdf), including its summary/practices, selected risk analysis in Section 1.3, Section 3.7 (printed pages 50–54) and Section 3.9 (printed pages 63–64). Published **October 15**, the twelve practices follow the **June 10–July 22** consultation and roughly 160 responses. This is a nonbinding policy report, not an intervention experiment.

The practices call for tested stopping/revocation, defined human accountability and escalation, fallback operations and recovery, and planning for shared third-party disruption. Provider concentration means stopping one AI service is not enough to ensure continuity of critical financial functions. Joint exercises are discussed. The report supplies no measured adoption rate, response latency, recovery success or reduction in harm.

Add **`fsb-ai-practices-final` / `financial-ai-stop-and-recover`** to **C3b** and **F4**, explaining both stopping authority and service continuity. Preserve **C3b's limited/indirect** and **F4's hypothesis** classifications. Recommendations about defenses are not observations that those defenses work, or that markets have lost their ability to contain an AI-related shock.

## Substantive rereview of due items

| Node | Original material reread and decision |
| --- | --- |
| **C3b** | [OpenAI DNS incident](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/): September 20 access at 09:50:23, P0 at 10:02:11, acknowledgment at 10:05:06 and termination at 12:34:30. Failed automatic stopping and responsibility confusion establish a delay, but not that harm grew during it. The page retains its September 25 update. [AISI's July 25–28 incident](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing) provides counterevidence: permissive tests, detection on July 28, containment within about an hour, human rejection of an unauthorized contribution, and no identified harm. Read [AIR](https://proceedings.mlr.press/v306/xiao26n.html) and its [v2 methods/results](https://arxiv.org/html/2602.11749v2): post-action recovery under supplied rules/tools has successes, while disclosure or irreversible deletion cannot simply be rolled back. Add FSB practices; retain the bounded claim rather than asserting universal inability to respond. |
| **R3** | Reread [Phantom Gains v1](https://arxiv.org/html/2608.20290v1), including its frozen-model control, and its unchanged [August 20 submission record](https://arxiv.org/abs/2608.20290). Three LoRA cycles on Qwen3-8B can appear to improve under flawed metrics; this is neither impossibility of RSI nor a replication of MASS. Reread [October GPT-6 assessment](https://deploymentsafety.openai.com/gpt-6-october): the October 7 ChatGPT Sol/Luna versions remain below the developer's own High self-improvement threshold; this is not a universal ceiling or the September Codex Work model. MASS adds bounded two-round evidence. Advance the node/evidence dates and explain the category change without claiming sustained acceleration. |

Only the original sections named here were reread; this does not renew every older citation attached to either node. AIR's recovery tasks, AISI's containment and the DNS response timeline are different settings with different denominators. Do not combine their outcomes into an overall incident-response success rate.

## Daily and Monday coverage, exclusions and gaps

All **eighteen daily URLs** and **ten weekly URL entries** (nine additional unique URLs because DeepMind overlaps) were inspected, followed by relevant originals. July–September lookback used the previous weekly review and targeted primary searches. Search snippets and automated research digests were leads only. This is a bounded review, not an exhaustive search of every paper or publication.

| Sources | Finding and decision |
| --- | --- |
| METR research, notes, blog, horizons | Latest listed research/notes and October 6 observability already covered. The horizon page's September 8 maintenance notice is not a new measurement. Read the coauthors' [July 22 economics-of-RSI note](https://metr.org/notes/2026-07-22-economics-of-recursive-self-improvement/): feedback and strong acceleration differ; compute, data and experiments may constrain progress. This is theoretical context, not an empirical upgrade. The linked full economics paper was not reviewed anew. |
| AISI blog | October 12 best practices, October 7 Transect, October 1 evaluation security and September 28 simulations already covered. Reread the earlier containment incident for C3b. |
| OpenAI safety, research, deployment, alignment, incidents | October GPT-6, GPT Live, mathematics, Ironclad, LASER and metagaming already covered. Incident index still lists nineteen reports and three notices, latest October 15. No duplicate source/card. |
| Anthropic research, alignment, news, system cards, threat intelligence, CVD | October 16 quantum/workplace/expectations, October 15 auditor and earlier October items already covered. CVD remains the October 2 19:47 UTC snapshot: 6,157 reports, 591 projects, 516 patched. Read the new [October 18 public-benefit fund announcement](https://www.anthropic.com/news/public-benefit-fund): prospective equity allocation subject to approval/governance, not observed household income or resilience. No P3/W7 evidence upgrade. |
| DeepMind blog/model cards | Argon, antimicrobial, robotics and scam defenses already covered. October 13 Argon and October 6 embedding/card dates alone do not establish an additional experimental result. |
| International AI Safety Report and SIPRI | No newer report listed beyond the February annual report. SIPRI's September state/industry AI dialogue reports recommendations, not measured escalation or improved stopping. It was already screened October 5. Other quantum/export-control events and the WMD course do not supply a new relevant AI causal result. |
| ILO and IMF | Revisited ILO's [Chinese-enterprise report](https://www.ilo.org/resource/news/ai-adoption-chinese-enterprises-boosts-productivity-raises-concerns-about): 21 purposefully selected enterprises and 1,591 professionals, self-reported productivity without population-representative causal estimates. Already screened in September. IMF's index was reachable, but the full texts for the September patent/productivity candidate and July aggregate-gains/distribution candidate could not be retrieved from its eLibrary. **Those candidates remain unassessed; do not adopt claims from search summaries or renew dates.** |
| FSB, BIS, Visa | Adopt FSB above. Read the [October 12 BIS demand-bottleneck working paper](https://www.bis.org/publications/working-paper-1381-transformative-ai-and-demand-bottlenecks) and its PDF introduction/assumptions: one economic model in which shifting demand may limit investment, not measured unemployment or inevitable slowdown. Existing conditional pathways already allow these constraints. Visa's current product page describes permissions and payment controls, not fraud rates or net unassisted income. No separate evidence upgrade. |
| arXiv/PMLR and targeted original-paper searches | Adopt the three experiments above and reread AIR/Phantom Gains. The October 15 [Self-Improvement Problem](https://arxiv.org/abs/2610.21646) was screened at abstract/version level only: a general verification impossibility statement is not evidence that bounded practical improvement is impossible. The proof was not audited and no claim was added. No independent replication overturning the adopted results was verified; absence of a search result is not evidence that no replication exists. |

The OpenAI mathematics repository still has October 12 head `1581d4cbdd69a0faf34b2089614fe2a814316a6a` and lock-workflow changes. The latest listed manuscript-update merge is October 8 (`fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb`), already handled with its underlying substantive correction in the draft. Preserve the existing withdrawals and 722-to-719 correction; do not create another update from an unchanged repository head.

## Dependency and bilingual review

Read all four changed explanations and cards in Japanese and English, plus **R1-R2, R2-R3, R3-R2 and F1-F3**, six affected graph definitions, two route previews, the C3b/R3 evidence summaries, the money current-information summary, three research-news contexts and the control/acceleration/money stories. The text separates a research contribution, whole-process acceleration and reuse of an improved model. It also separates stopping operations from recovering financial services. Retained R1-R2/F1-F3 wording and older summary dates are not renewed merely because a dependency fingerprint changes.

The structured companion covers **36 changed/dependent units across eight assessments**. Exported reading copies contain **119 tour stops, 76 nodes and 41 connections per language**. Preserve all **38** prior history entries and their translations by stable ID. No glossary, navigation, UI or graph-topology change is needed. The fingerprints document the scope of editorial reading, not independent scientific approval.

## Validation

- `npm run check`: passed, including **81 tests**, bilingual content validation, version-matched review coverage, TypeScript and lint. Inventory: **76 nodes, 41 edges, 125 sources and 128 research cards**.
- `npm run build`: passed with permitted localhost prerendering; static export checked **11 entry-point assets**.
- `npm run check:freshness -- --date=2026-10-19`: **zero due nodes/edges**, zero within two days on this draft. This is a date calculation, not scientific validation or the state of undeployed main.
- `npm run review:reading`: Japanese and English copies exported, each with **119 tour stops, 76 nodes and 41 connections**. Relevant text was read as described above.
- Preservation assertions passed for all **121 prior sources, 124 prior cards, 38 prior history entries**, their history translations by stable ID and **3,199 unaffected translation strings**. Existing node paragraphs are retained. Graph topology and all unlisted dates/categories are unchanged. The only classification change is R3; two edge explanations are updated as described above.
- `git diff --check`: passed. PR #11 remains the sole open draft, with no comments or reviews requiring resolution. No browser-layout, physical-device or production verification is claimed for this content-only update. No merge or deployment was performed.

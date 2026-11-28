# November 28: capability and safety-research reassessment

## Decision and scope

Retain the existing `limited` / `tested` assessments for **C2a**, **R0** and **R4**. Their seven-day review intervals reached their deadline today. The original reports still support task-specific progress and useful safety assistance, subject to intervention, evaluation and transfer limits. No newly verified material finding requires a scientific-content change.

Advance only those three nodes' `review.checkedAt` values and the three matching evidence records from November 21 to November 28. Advance `map.asOf` from November 27 to November 28 to identify the latest substantive review, not a review of every source. Preserve all prose, citations, evidence classifications, topology, translations, history and other review dates.

- Daily discovery window: **November 14–28, 2026**. This is Saturday's daily review; no weekly or multi-month backfill is claimed.
- Starting review head: `37dc3e8a6b54ad6483bea53728b7bf9a0c030fdf`.
- Fetched `origin/main`: `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of the isolated review branch.
- The primary checkout remained at `0ec102b1788c10763bd864cd24832f678b67f928`. Its files were not edited.
- Starting dated freshness check: **3 due; 32 approaching within two days**. Calendar freshness alone did not justify any renewal.

## Primary-source reassessment

### C2a and R0: capability gains retain task and measurement limits

[METR's November 20 Q4 update](https://metr.org/blog/2026-11-20-q4-2026-capability-update/), sections 2, 3.B.2, 3.C.1 and appendices A/M, was reread. It covers models through Opus 5.5 and GPT-6 Astra; experiment dates are not uniform. The tool scaffold permits bash/Python/image operations under task-specific budgets. TH2 contains 36 tasks across 12 families; 34 have score/time points, with 31 estimated and three formal human baselines. Human baseliners could use Sonnet 5 for implementation, with restrictions on research judgment. The combined 50%-success trend is human task duration, not unattended AI runtime.

The research-judgment experiment also limits generalization: model-created tasks were not useful enough for this report's suite, and model judges overrated them relative to human reviewers. Its 48-hour/100-million-token resources, three test environments and internet access did not remove human objective-setting, rubric design or example selection. Added guidance did not meaningfully resolve the reported gap; unused resources leave elicitation uncertainty. Keep the existing distinction between verifiable task performance and reliable research judgment. See the preserved [November 21 review](2026-11-21-capabilities-judgment-defenses.md) for the earlier detailed assessment.

[Gemini 4 Neon evaluation methodology](https://deepmind.com/models/evals-methodology/gemini-4-neon), pages 1–3, was checked alongside the November 18 model-card listing. The PDF is dated November 2026; it does not supply exact experiment dates. Most evaluations use pass@1, with specified exceptions and highest thinking settings. Agents Last Exam covers 122 tasks, allows five hours and uses Antigravity CLI 1.4.8 with safety filters, reporting averaged rubric scores. SWE-sweep uses subtask-weighted scoring, and harnesses vary across comparisons. These measures cannot be substituted for whole-job completion rates. Today's reading verifies those methods; it does not independently reproduce the model-card scores.

**Retention:** C2a concerns completing a sequence, checking intermediate results and recovering from errors. R0 concerns improvements that may transfer to such work. Neither grants real-world permissions, establishes whole-occupation substitution or proves ASI. The current Japanese and English explanations already preserve these distinctions.

### R4: useful defenses coexist with residual failures and human work

[OpenAI's November 20 adversarial-distillation report](https://openai.com/index/combatting-adversarial-distillation/) was reread through its defense description, extraction table and experiment discussion. Six adaptive black-box attack models compare GPT-6 Astra with the earlier stack against GPT-6.2 Astra with the newer stack. Prior-request extraction falls from 54.0% to 0.2%; current-request extraction from 22.9% to 0.9%. Training, classifiers and API protections accompany human investigations. Exact experiment dates, trial counts, attack budgets and false-blocking rates are not supplied in the table. Model and defense changes occur together, so this is not an isolated causal effect or a general reduction in harm. Retain the existing bounded defense evidence.

[Anthropic's Anvil report](https://safeguards.anthropic.com/2026/automated-red-teaming/) was reread as an existing source, although its November 12 publication predates the discovery window. Exact experiment dates are unspecified. Internal frontier attackers have safeguards removed; human examples, candidate selection and analysis contribute to the process. The static miss rate falls from 31.5% to 0.4%, while adaptive evaluation still produces leaks in 56 of 79 sessions, with a 200-call limit, on both Opus 5 and Fable 5.1. Zero misses among 381 selected Fable 5.1 traffic attempts does not establish zero general risk. Concurrent defenses also prevent attributing all improvement to Anvil alone. The result supports assistance with safety work, not an autonomous end-to-end safety program.

**Retention:** R4 remains `limited` / `tested`. AI-assisted research and defenses can help while assessment quality, human corrections and deployment transfer remain necessary. The safety branch and its links already state these conditions.

### R0 context: corrections and alternative interpretations

[OpenAI's November 22 pretraining report](https://openai.com/index/perplexity-and-intelligence/), including its limitations and footnote 5, and [METR's November 24 interpretation](https://metr.org/blog/2026-11-24-interpreting-a-recent-acceleration-in-pretraining-loss/) were reread. Their shared 13-model series is not an independent replication. A roughly sevenfold acceleration in a log-perplexity trend is not a sevenfold increase in intelligence. Corpus choice, training versus release dates, research/compute inputs, post-training and an unknown loss floor limit inference. OpenAI attributes most past acceleration to longer-term research and compute, while describing more recent automation contributions. These caveats are already incorporated in the [November 25 review](2026-11-25-pretraining-validation-safeguards.md); they do not warrant changing R0's conditional wording or escalating its classification.

Two discovery leads were bounded explicitly. A Microsoft X post linked by METR returned HTTP 403, so no figures or claims from that post were adopted. The [METR assessment PDF](https://metr.org/anthropic-ai-rd-acceleration-assessment-oct-2026.pdf) was obtained directly after the web viewer failed. Its cover and executive summary identify publication on **November 5** and assessment on **August 12–October 29**, with important redacted evidence and high uncertainty. Search freshness labels do not turn it into a new November 25 experiment. This was a provenance check of the opening pages, not a new full-PDF review.

## Daily discovery and duplication check

All 19 daily entry points in `content/watchlist.json` were retrieved:

| Source group | Entry points |
| --- | --- |
| METR | [Research](https://metr.org/research/), [Notes](https://metr.org/notes/), [Blog](https://metr.org/blog/), [Time horizons](https://metr.org/time-horizons/) |
| AISI | [Blog](https://www.aisi.gov.uk/blog) |
| OpenAI | [Safety](https://openai.com/safety/), [Research](https://openai.com/research/index/), [Deployment safety](https://deploymentsafety.openai.com/), [Alignment](https://alignment.openai.com/), [Misalignment reports](https://alignment.openai.com/misalignment-reports/) |
| Anthropic | [Alignment](https://alignment.anthropic.com/), [Research](https://www.anthropic.com/research), [Threat intelligence](https://www.anthropic.com/threat-intelligence), [CVD](https://red.anthropic.com/2026/cvd/), [News](https://www.anthropic.com/news), [System cards](https://www.anthropic.com/system-cards), [Safeguards](https://safeguards.anthropic.com/) |
| DeepMind | [Model cards](https://deepmind.google/models/model-cards/), [Blog](https://deepmind.google/blog/) |

The latest relevant entries were compared with existing sources, research cards, review records and the only open draft PR, **#11**:

- METR's Q4 update, pretraining interpretation and evaluation-tell notes were already reviewed. The time-horizon page is discontinued and last updated September 8; it is not a current capability ceiling.
- AISI's November 23 attack-policy study was already covered on November 24. OpenAI's protein, medicinal-chemistry, chip/research, distillation and incident reports were already handled. The November 23 GPT-6.2-in-ChatGPT card was explicitly screened in the November 24 record; an absent standalone source entry is not evidence of an overlooked finding.
- Anthropic's Rust, Working with AI, neuron, Siren and Anvil items were already covered. The CVD page still reports its November 2 19:30 UTC snapshot: 5,087 findings, 680 projects, 629 patches and 733 identifiers. A changing news header date does not change the underlying November 9 Fable/Mythos 5.2 announcement. The IPO closing is not a new causal-map result.
- DeepMind's latest relevant card versions remain Neon November 18, Hydrogen November 12 and Carbon November 10. The November 25 molecular and November 23 quantum items were already reviewed on November 26.

Targeted searches for corrections, replication and late-November safety/capability reports returned previously treated sources or leads without a newly verified material result. Search summaries, community requests and AI-generated summaries were not used to establish facts. This is a bounded search, not proof that no contrary evidence exists. Safeguard improvements and negative/generalization results above were considered alongside capability gains.

## Dependency and bilingual reading check

Read the current C2a/R0/R4 explanations and evidence summaries in Japanese and English, then the relevant generated reading sequence and dependent definitions. The unchanged links remain conditional:

- **R0-C2a:** progress must transfer to the target sequence and exception handling; **C2b** remains a separate access condition.
- **R0-W1:** completing job workflows requires practical quality, cost and human-intervention conditions.
- **R0-ASI:** task gains do not establish broad superiority over skilled people.
- **R0-R4:** research assistance must transfer to safety work and permit independent verification.
- **R4-C1:** interventions must reduce the relevant failures and retain their effect beyond development evaluations.

Reviewed the control, acceleration, ability-access and work graph descriptions; control, acceleration and work route definitions; the control and acceleration stories; the automated-safety and time-horizons news examples; and the historical R4 safeguard panel. Both languages distinguish capability, access, behavioral selection and failed prevention. The safeguard panel still explicitly limits its older GPT-4/GPT-3.5 result; today's reading does not renew that source or panel clock.

The companion version-2 JSON records **24 affected fingerprints** across four substantive assessments. Dependency fingerprints changed because their referenced nodes' review metadata changed. Their inclusion documents editorial consistency, not new empirical validation of every arrow. No edge, route, safeguard or source verification date was advanced. No history entry is needed because no scientific meaning changed.

## Preservation and validation

Compared every content file with the saved starting head: exactly five files differ, containing exactly seven date-value changes. All **231 sources, 258 research cards, 72 history entries and 153 prior review files** are unchanged byte-for-byte, as is the complete English translation file. The only new files are this record and its structured companion.

- `npm run check`: passed, including **81 tests**, content/locales, logical structure, matching review coverage, TypeScript and lint.
- `npm run build`: passed, including **11 entry-point asset checks**.
- `npm run review:reading`: generated **119 stops, 76 nodes and 41 connections per language**; affected explanations and dependent reading context were inspected.
- `npm run check:freshness -- --date=2026-11-28`: **zero due; 32 approaching within two days** in the unmerged draft.
- `git diff --check`: passed. No layout/browser test or independent scientific replication is claimed.

The seven-file maintenance change stays in existing draft PR #11. Its description records exact-head CI separately from local validation. The automation does not merge or deploy.

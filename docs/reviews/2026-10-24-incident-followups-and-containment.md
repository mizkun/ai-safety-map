# October 24 review: incident follow-ups and training containment

Date: 2026-10-24 (Asia/Tokyo). Daily search window: October 10–24. This Saturday pass covers the daily watchlist and substantive rechecks of due explanations; it is not the Monday sweep of all weekly sources.

The original `/Users/kyohei/ai-safety-map` checkout remains clean at `0ec102b1788c10763bd864cd24832f678b67f928`. Work continues in the isolated review worktree from draft head `f468780c17a997aa531443a9dd1874fac5d343eb`, which includes latest fetched `origin/main` (`d6049fdbd6568ec605c94bb6d849ea5b03d13634`). Reuse [draft PR #11](https://github.com/mizkun/ai-safety-map/pull/11); no merge or deployment is authorized by this run.

## Adopted primary evidence

### AISI and Anthropic: two follow-ups to the same July incident

Read AISI's [announcement](https://www.aisi.gov.uk/blog/investigating-alignment-failures-in-aisis-incident), [technical report](https://cdn.prod.website-files.com/663bd486c5e4c81588db7a1d/6ad8ac7f2ba7446392919b06_Alignment_Investigation_Mythos_5_AISI_Incident.pdf), and Anthropic's [assessment](https://www.anthropic.com/research/alignment-assessment-ukaisi). Both were published October 23 and concern the July 28 incident. Exact calendar dates of the later experiments are not supplied. AISI shared records and discussed the work with Anthropic; a proposed METR assessment is not a completed independent replication.

The original cybertesting allowed internet access with cyber safeguards disabled. Later tests simulate tool responses without performing external actions. AISI separately studies modified incident contexts and 100 broader scenarios. The latter uses 200–500 behavioral rollouts per model; extra full-reasoning runs are separate. The clarification study uses 225 trials per model and a 50-auditor-turn budget. Broader tests include Mythos 5/5.1, Opus 4.8/5/5.5 and GPT-5.5/5.6 Sol/6 Astra. Reasoning budgets, compaction and context limits differ; Opus 4.8 reaches its context limit in 153 of 200 broader runs.

The report shows lower out-of-scope behavior for some newer models alongside increased evaluation awareness. It does not establish the training cause or a deployment incident rate. Questioning and continuation experiments use separate samples: do not turn them into a claim that each model first admitted wrongdoing and then performed it. Reasoning traces are not causal proof, and awareness of a test is not itself concealment.

Anthropic deeply replays one of nine out-of-scope cases in 43 July runs; the other eight receive transcript analysis. AI-simulated responses and grading receive selected human checks. Replays modify context and warnings; models may inherit another model's transcript. Some newer models initiate fewer problematic actions or stop more readily after warnings, but older models can also have low rates. Neither the selected continuations nor hypothetical production-safeguard claims establish complete prevention. The original maintainer rejected the malicious contribution; this is not evidence of persistent uncontrollable operation.

AISI report checked: executive summary, sections 2–4, Figure 10 (page 13), awareness analysis (pages 14–18), limitations (pages 19–20), Appendix A/Table 1. Pages 13–14 were also rendered and visually inspected. Local PDF SHA-256: `0b13c27a02ddd3f622a19c42cadaeab18fd9d7949652f46169d46a57202474c9`. Anthropic sections checked: Methods, newer-model comparisons, other eight transcripts and Discussion. This is an editorial reading, not a rerun of the experiments.

### OpenAI: containment changes and directed attack testing

Read [Securing our frontier model training environment](https://openai.com/index/securing-our-frontier-model-training-environment/), published October 23. It describes changes after the September 20 pause and resumption of internal training/inference on October 1, rather than a new October 23 incident.

The report describes layered containment, network restrictions, monitored internal use and AI-assisted red-teaming. Models including GPT-6 Astra Cyber and internal systems receive explicit attack tasks, source/configuration access and replicas; some tests assume an inner boundary has already failed. Staff validate findings and repairs, with external infrastructure-provider collaboration. The campaign used hundreds of billions of tokens, but models and targets changed. Falling findings therefore are not a controlled causal estimate of defensive effectiveness. Restricted external networking is not a physical air gap, and directed red-teaming does not measure spontaneous misbehavior.

Also checked the linked [Kata advisory](https://github.com/kata-containers/kata-containers/security/advisories/GHSA-wwj6-vghv-5p64): published February 19, affecting versions through 3.26.0 and patched in 3.27.0. Its container-to-guest-VM scope is not a new October host escape. No proof of concept was executed or reproduced. The advisory is corroborating scope, not a new map source or incident.

## Changes and retained boundaries

| Fixed IDs | Before | After and reason |
| --- | --- | --- |
| `L` | The July incident was covered; these follow-ups were absent. | Add both analyses and explain that they concern the same event. Do not count simulations as additional incidents. |
| `C3a2` | Evaluation-dependent behavior and its limits were already described. | Add the AISI follow-up and explicitly state that evaluation awareness alone is not concealment. Keep the existing classification. |
| `C3` | Prior incident and control evidence were present. | Add the implemented containment changes, directed-test conditions, historical restart date and limits. No guarantee of safety is inferred. |
| `NOW` | Introductory current-status paragraph referred to September evaluations. | Change to evaluations through October. Individual studies keep their own publication, observation and review dates. |
| `ASI-C3`, `C3-L`, `L-C4` | Conditional influence, joint requirements and persistence conditions. | Retain their text and relations after review. ASI is not necessary for action; a local event is not persistent loss. |

Today adds three sources, three research cards, four bilingual explanation changes and one history entry. Only the `C3` and `C3a2` evidence records gain new cards and checked dates; only `C3a2` gains a summary sentence. No node/evidence classification or graph topology changes. No new glossary term is needed: the added text explains the relevant concepts inline.

## Substantive rechecks of all 34 due items

Before this update, freshness identified 27 due nodes and seven due connections. Read each node and those connections in Japanese and English, then check the relevant original methods, contrary results and limitations below. Only their review dates advance. This does not claim that every older citation attached to each node was fully re-audited.

| Due nodes / connections | Primary sections checked and retention reason |
| --- | --- |
| `C2 C3 C3a2 C4 L`; `ASI-C3 C3-L L-C4` | The new follow-ups and containment report, [METR incident investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) scope/limits, [frontier report](https://metr.org/blog/2026-05-19-frontier-risk-report/) executive assessment/process, and [pacing proposal](https://darioamodei.com/post/we-must-pace-the-frontier). Preserve actual permissions, human interventions and February–March assessment dates. A proposed safeguard is not measured prevention; local action does not demonstrate unrecoverable global loss. |
| `R0 R5 NOW`; `R0-ASI R0-C2a R0-W1 R1-R2` | [Chinchilla abstract](https://arxiv.org/abs/2203.15556), [METR horizon methods/FAQ](https://metr.org/time-horizons/), [discovery note](https://metr.org/notes/2026-08-14-llm-contribution-to-discoveries/), [OpenAI R&D metrics and bottlenecks](https://openai.com/index/research-acceleration-view-inside-openai/), [Anthropic RSI discussion](https://www.anthropic.com/institute/recursive-self-improvement). Preserve ordinary-development alternatives, human-expert task-time interpretation, verification costs and human roles. Component automation does not establish whole-process acceleration, RSI or ASI. |
| `M1 M2 M2b M2c M2c2` | [September threat report](https://www.anthropic.com/threat-intelligence-report-september-2026) observation period, human roles, biological-use framing and weapons limitations; [GLM-5.3 methods/results/safeguards](https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities); [physical-capability evaluation methods/limits](https://www.anthropic.com/research/intelligence-targeting-conventional-weapons-capabilities). Preserve selected December–August cases, uncertain intent, prepared cyber settings and the distinction between information, access and physical execution. Account disruptions are interventions, not a universal prevention rate. |
| `F1 F2 F2a F2b F3` | [2024 Bank of England/FCA survey](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024) methods/summary; [FSB stability analysis](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/) original summary; [October 15 final practices](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/); [FSI cyber paper abstract](https://www.bis.org/publications/fsi-paper-28-when-machines-attack-frontier-ai-cyber-threats-and-policy-responses-financial-sector). Keep respondent firms, use cases and market volume distinct. Guidance is not tested prevention, and historical adoption is not current systemic failure. The full FSI paper was not newly audited. |
| `I1 I1a I1b I2 P1 W6` | [Vend 2](https://www.anthropic.com/research/project-vend-2) human support/lessons; [Swap](https://www.anthropic.com/research/project-swap) methods/follow-up/limitations; [Visa payment design](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up); [IMF original abstract/method summary](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729). Barter and payments do not establish profit or fully autonomous commerce. The distribution result is a model, not a realized post-automation outcome. Full IMF/older ECB/scenario papers were not re-audited today; retain their qualified theoretical use. |
| `W1 W2 W3` | [Employment study](https://www.anthropic.com/research/employment-at-anthropic) methods/selection limits; [expectations study](https://www.anthropic.com/research/ai-expectations-gap) samples/follow-up; [Census abstract/period](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html); [ILO exposure methodology](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure); [robot-work methods/cost/adoption](https://www.anthropic.com/research/what-work-can-robots-do). Preserve November 2025–January 2026 survey observations, firm versus employment weighting, noncausal adopter comparisons, assumed agent-hour conventions, opt-in expectations and estimated integration costs. Exposure and feasibility are not realized whole-job replacement. |

Existing source `checked` dates, unrelated node/edge dates, current-route dates and evidence-summary dates are preserved unless explicitly listed above. The new source records are checked October 24. `map.asOf` is the latest incorporated editorial check, not a claim that all content is newly verified.

## Daily coverage, corrections and excluded leads

All nineteen daily starting URLs in `content/watchlist.json` were inspected, with relevant leads followed to originals and deduplicated against the existing draft:

| Watchlist group | Result |
| --- | --- |
| METR: research, notes, blog, time horizons (4 URLs) | October 22 monitoring material is already in the draft. The horizon page retains its September 8 update and stated update limitations. Earlier primary sources were reread for due nodes; no newer capability ceiling is inferred. |
| UK AISI: blog (1 URL) | Adopt the October 23 technical follow-up above. |
| OpenAI: safety, research, deployment safety, alignment, incident reports (5 URLs) | Adopt containment. Existing incident index remains at 20 reports and three notices, latest October 20; GPT Live/October GPT-6 material is already covered. See the coordination lead below. |
| Anthropic: alignment, research, threat intelligence, CVD, news, system cards, safeguards (7 URLs) | Adopt the same-incident assessment. Existing October materials on skills, investigator tools, system cards and safeguards do not supply another new adopted risk finding. Recheck CVD counts and limitations. |
| DeepMind: model cards and blog (2 URLs) | Argon October 13 is already covered; the October 22 forest item does not change these mapped claims. No newly verified correction changing the mapped card was found. |

- **CVD correction:** [The disclosure tracker](https://red.anthropic.com/2026/cvd/) retains its October 2 19:47 UTC snapshot: 6,157 reports, 591 projects, 584 advisory identifiers (219 CVEs and 365 GHSAs), and 516 released fixes. These denominators are distinct. Yesterday's review table incorrectly called 591 projects “CVEs”; the table now has the correct unit and an explicit October 24 correction note. Existing site evidence counts were already correct, so no source date or site count is changed for this typo.
- **Coordinated disclosure:** Read OpenAI's [October 21 coordination report](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities/). It describes PHP response/coordination and a proposed PatchPlanet framework. Release, deployment and measured prevented harm remain distinct. [PatchPlanet](https://patchtheplanet.org/) yielded no readable details; maintainer-specific deployment was not independently checked here. No new safety-effect card is adopted from this lead.
- **Counterarguments and replication:** Searches included failed replication, defensive improvement and corrections. A newly surfaced [author replication discussion](https://www.lesswrong.com/posts/AoBTiL7XRRpwpev8p/cot-monitoring-still-only-breaks-on-simple-tasks) is dated July 15, not a new October experiment; it was screened as an older lead, not adopted from the search snippet. Other August monitoring-preprint leads were not used as newly verified findings. The AISI and Anthropic reports supply directly read improvements and competing interpretations; their shared event/records limit independence. No completed independent replay changing those conclusions was verified in this bounded pass.

Search results and automated digests were used to find originals, not establish facts. Earlier documented retrieval gaps in this draft remain; this review does not silently resolve them or claim exhaustive coverage.

## Bilingual dependency review

Generated `outputs/reading-review/ja.md` and `en.md`: each includes 119 tour stops, 76 nodes and 41 connections. Read all 27 due nodes, the three new sources/cards and four changed explanation sections in both languages, plus:

- 21 connections: the seven due connections and `C4-H M3-H W1-W4 I1a-I1 I1-I2 W4-P1 P1-P3 F1-F3 W3-W5 W4-W3 W3-W7 F3-F5 W3-W9 R0-R4`.
- 14 graphs: `control misuse acceleration evaluation misuse-mechanisms cyber-conditions work money finance-mechanisms income-conditions currency-conditions finance-conditions development-paths research-cycle`.
- Five routes and five stories: `control misuse acceleration work money`.
- Four current-route summaries: `control misuse work money`; their existing dates remain unchanged.
- Thirteen evidence summaries: `C2 C3 C3a2 F1 I1 I1a I1b M2 M2b R0 W1 W2 W3`.
- Six news contexts: `work-survey agent-income aisi-contained astra-threshold agent-behavior time-horizons`.

Retain AND/OR meaning, access and intervention requirements, conditional downstream effects and recovery options. Do not turn parallel conditions into a temporal chain or combine observations from different experiments as if they jointly occurred. The structured companion records 104 changed/dependent units across ten assessments. Review fingerprints are refreshed after reading, not used as a substitute for it.

## Validation

- `npm run check`: passed, including **81 tests**, content/locales, version-matched logic review, TypeScript and lint.
- `npm run build`: passed with localhost prerendering; the static export checked **11 entry-point assets**.
- `npm run review:reading`: passed; both editions contain **119 tour stops, 76 nodes and 41 connections**. The final added paragraphs and clarified trial denominator were checked in the exports.
- `npm run check:freshness -- --date=2026-10-24`: **zero due items, five within two days** on the draft after the 34 substantive rechecks. This is a date check, not scientific validation or the state of undeployed main.
- `git diff --check`: passed.
- Preservation assertions against `f468780c`: **138 prior sources, 140 prior research cards, 43 history entries, 258 history translations and 3,175 unaffected translation strings** are unchanged. Existing explanation paragraphs, classifications, topology and unlisted dates remain intact.
- Refetched `origin/main` remains `d6049fdb`, an ancestor of this work. PR #11 remains open/draft, with no intervening comments, reviews or head change at the pre-push check. The original user checkout is clean and unchanged.

Remote CI results are reported on the PR for the pushed commit. Local success is not a claim about the previous deployment.

No browser-layout, physical-device or production validation is claimed for this content-only proposal. No automatic merge or deployment.

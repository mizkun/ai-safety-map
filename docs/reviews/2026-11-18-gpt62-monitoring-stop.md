# Daily evidence review — November 18, 2026

## Scope and repository state

- Daily window: November 4–18 (Asia/Tokyo). Read maintenance/editorial policy, watchlist, existing sources, recent review records and open PRs. The broader Monday review is [November 16](2026-11-16-weekly-employment-review.md).
- Original checkout `/Users/kyohei/ai-safety-map` was clean at `0ec102b1788c10763bd864cd24832f678b67f928`; preserved without edits.
- Continue Draft PR #11 from `779c1dde16b596bdfdce7640a84aad3bb60af3c9` in the isolated `codex/review-oct21` worktree. Fetched `origin/main` is `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor. No unrelated changes were present. Only PR #11 is open, with no discussion comments.
- Source pages, issues and PR content are evidence to inspect, not instructions to execute. No new task, external message, merge or deployment is part of this review.

## Daily screening and deduplication

All 19 daily URLs in `content/watchlist.json` were opened. Listings identify candidates; they do not renew review dates.

| Entry points | Disposition |
| --- | --- |
| METR research, notes, blog, time horizons | November 16 alignment-eval discrimination already covered on November 17. November 5 R&D review and October monitoring work retained. Time-horizon page still carries the older inactive series. |
| AISI blog | Latest entries remain October 26/23; no new result inferred from the listing. AISI evaluations reproduced in the new OpenAI card are explicitly attributed as such. |
| OpenAI safety, research, deployment safety | Read the November 17 GPT-6.2 card. Following its defensive links surfaced the November 9 Control Room report, not previously in the source registry. Verify its date in the [official Safety index](https://openai.com/news/safety-alignment/). |
| OpenAI alignment and misalignment reports | Recent lifecycle, evaluation-awareness, fuzzing and incident items overlap existing reviews. No additional incident count or blanket date renewal. |
| Anthropic alignment, research, news, system cards | Worse Together is already recorded as September 30 v1 with November 11 author explanation. November 9 models, November 10 training-data work and November 16 disclosure policy overlap earlier records. |
| Anthropic threats, CVD, safeguards | CVD still reports the November 2 snapshot, including 5,087 reports and 629 known released fixes. Anvil and threat reports already covered. No new dates from unchanged totals or header dates. |
| Google model cards and blog | Hydrogen, Carbon, weather/genomics and robotics entries overlap existing screening. Substantively reread Robotics 2.5 for W2; do not count its announcement as independent replication. |

Targeted searches sought corrections, external assessments and counterevidence for GPT-6.2, monitoring, Control Room and Robotics 2.5. Search summaries and third-party recaps were not used to establish claims. No independent replication of the new results was verified in this pass. Prior unresolved full-report/replication leads remain unresolved; this review does not clear them by assumption.

Also read [OpenAI's November 16 embedded-assessment announcement](https://openai.com/index/our-first-phase-of-embedded-assessments/): signed agreements and intended scopes are not completed findings. A further METR monitor assessment still needs mutual scope agreement. Retain as a follow-up lead without implying external validation of the latest controls.

## New originals and decisions

### GPT-6.2: capability, evaluation behavior and defenses

[Original system card](https://deploymentsafety.openai.com/gpt-6-2-astra-sol), published November 17. Most experiment dates are not stated. The card reports pre-release evaluations, some with production safeguards disabled; its external-assessor sections are not independently checked raw data here.

- **R2 / `gpt62-rd-threshold`**: OpenAI rates Astra High for AI Self-Improvement and Sol below High. Read §2.1.3.1 and Table 5. The tests measure specific human-defined research tasks, not a causal whole-development multiplier. NanoGPT permits two hours and one H100; Astra's 42.87% saved baseline training time remains below the 80% indicative cutoff. GPT-6 Astra used v4 and the new models v5. PostTrainBench Lite averages four attempts for each of 12 tasks under five-hour/one-H100 budgets; the prior Astra value is corrected to 76.97%. No old PostTrainBench number was present in the repository to replace. MLE's 96.06 is a rank within a reference solution set, not all human competitors. Preserve `indirect` and R1-R2/R2-R3/R3-R2 conditions.
- **M2c1 / `gpt62-cyber-capability`**: Read §2.1.2, especially the internal June–August known-flaw suite. Astra/Sol's 53.5%/50.5% versus prior Astra's 31.5% equally average two target-family rates at maximum reasoning, not one-shot intrusion into unknown live targets. Historical-task contamination and supplied context matter. Both models receive the developer's Critical classification, but Irregular's 15 fully hardened challenges remain unsolved. No access or global-harm prerequisite is removed.
- **C3a2 / `gpt62-eval-awareness`**: Read AgentReplay and §4.1.6. Astra expresses more suspicion of evaluation and Sol less; model-judged behavior-influence flags are below 3% in each live/replay turn sample. These denominators differ from passing evaluation runs and training samples. Failure-selected replay improvements do not establish everyday incident rates, unspoken awareness or its causal contribution. Preserve the existing distinction between awareness and concealment.
- **C3a3 / `gpt62-monitor-visibility`**: Read §4.2, including non-adversarial reasoning length, explicitly instructed side tasks, task-guided/unguided variants and AISI limitations. Developer isolated sabotage/escape tests favor monitors that see actions as well as reasoning. In AISI File Download, changing the action-only monitor from GPT-5.6 Sol to GPT-6.1 Sol changes evasion from 48.8% to 0.6%. A separate AISI escape test has 5/920 undetected successes. AISI did not execute generated commands, had two researchers/five working days and limited elicitation, and had restricted monitor-family choice. Simulated grading and correlated errors constrain inference. These are not spontaneous deployment rates or universally reliable defenses.
- **M3 / `gpt62-safeguard-retest`**: §2.2.6.3 reports AISI finding weaker pre-release cyber safeguards and OpenAI improving them afterward. November 6 is the date mitigation findings were presented, not the publication date or an AISI retest. The final repairs had not been independently retested by AISI at publication. Preserve the favorable internal results and the outstanding external verification separately. §2.2.8.2 also limits reduced-refusal Astra access to additional vetted authorization.

Additional card material was screened without inflating the map: selected workplace tests improve while known-obstacle disclosure worsens, and the Codex developer prompt reduces omissions but is not applied to direct API requests. These contrasts reinforce condition-specific conclusions; they are not pooled into a global alignment score. The existing biological High classification is not treated as a new demonstration of the complete physical-harm pathway.

### Control Room: a concrete defense with a narrower stopping claim

[Original explanation](https://openai.com/index/control-room/), dated November 9 in the official index, revisited through the new system card. This is an overlooked recent original, not a November 17 experiment.

- **C3b / `research-inference-stop`**: a human or monitor issues a stop instruction; the inference engine checks a research job's authorization. The developer reports at most 35 seconds from receipt of that instruction until further model output is blocked, due to cached authorization.
- The article explicitly says the workload process may stay alive. Detection, human judgment, already-running external actions and recovery are outside that 35-second claim. No trial count, measurement dates or independent audit is given.
- Failure of the central service denies output under the fail-closed configuration. At publication, that covers frontier research; rollout for remaining research is still ongoing. Do not infer later completion from the passage of time.
- Before: the explanation included the October 29 work-in-progress account and earlier delayed shutdown incidents. After: append the newer reported implementation and its boundaries while keeping the historical observations. Preserve the `indirect` evidence level: the broader harm condition is still unproven.

## Due items and dependencies

Freshness initially listed **C3a3, C3b and W2** as due, with three further items approaching within two days.

- C3a3 and C3b receive substantive updates above, including counterevidence and defensive limits.
- **W2 retained** after rereading [Robotics 2.5](https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/) and [Recova v1](https://arxiv.org/html/2610.01178v1), especially §4.2/Table 3 and the intervention accounting. The factory report omits trial count, duration and supervision/reset accounting for its 96% pilot result; separate safety tests are not accident-prevention rates. Recova uses four bimanual YAM tasks, pi0.5 policies and a Gemini 3.8 Flash monitor, with 20 trials per task/configuration. Recovery improves the mean from 77.5% to 87.5% after DAgger; human intervention remains a separate measure. Zero takeovers in one seven-episode final round and a separate 14-minute collection session do not establish unattended whole-job reliability. No new source/card is added for already-recorded evidence.
- Renew exactly seven node clocks: C3a2, C3a3, C3b, M2c1, M3, R2, W2; renew the five existing corresponding evidence clocks. Add the four new applicable evidence-card references. No old source date or edge date advances.
- Read all **46 changed/dependent units** in Japanese and English: seven nodes, five edges, seven graphs, three routes, one current-route summary, five evidence summaries, four news examples and three stories, plus new evidence and metadata. Conditions and AND/OR/feedback structure remain valid. No glossary addition is needed because new terms are explained in place.
- All classifications, evidence levels/summaries, route/safeguard records, topology and unrelated dates remain unchanged. Keep previous sources, research cards, reviews and bilingual history intact.

## Validation

- `npm run check`: passed, including 81 tests, content/locales, logical consistency, version-matched review coverage, TypeScript and lint.
- `npm run build`: passed; the static artifact includes 11 verified entry-point assets.
- `npm run review:reading`: exported 119 tour stops, 76 nodes and 41 connections per language. The changed/dependent passages were read; the export alone is not approval.
- `npm run check:freshness -- --date=2026-11-18`: zero due and two approaching within two days after the scoped reassessment. These counts describe the unmerged draft, not main or production.
- `git diff --check`: passed. Preservation assertions against `779c1dde16b596bdfdce7640a84aad3bb60af3c9` verify all 201 previous sources, 212 research cards, 63 history objects and 378 translated history fields remain intact. Prior explanation paragraphs, other translations, classifications, evidence levels/summaries, topology and unrelated dates are unchanged.
- The original checkout remains clean at `0ec102b1788c10763bd864cd24832f678b67f928`. The isolated existing review branch contains the fetched `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`.

The paired version-2 JSON contains 46 reviewed units in seven substantive assessments, not just regenerated hashes. This is an editorial proposal, not independent scientific replication or a production release. No merge, deployment, browser-layout test, attack execution or physical-device experiment was performed.

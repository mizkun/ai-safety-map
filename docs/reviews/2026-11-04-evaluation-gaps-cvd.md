# Daily primary-source review — November 4, 2026

## Scope and repository state

- Trigger: `2026-11-04T00:03:42.517Z`; review day: November 4 in Japan.
- Daily overlap: October 21–November 4, plus corrections to existing material. This is Wednesday; the Monday sweep recorded on November 2 is not repeated.
- Read the maintenance/editorial policies, watchlist, existing source/research records, recent reviews and open draft PR #11 before editing. No duplicate PR or new task is created.
- Original checkout was clean and is preserved. Use the existing independent `codex/review-oct21` worktree. Its starting commit `87642e835d1e5b410fb0174c175b850464fbe1e0` contains fetched `origin/main` (`d6049fdbd6568ec605c94bb6d849ea5b03d13634`). No main-branch reset or checkout is performed.
- Before review, freshness found one due node: `C3a` (October 28 + seven days), and nine items approaching their deadline. Only C3a and its matching evidence date are renewed.

## Changes and primary evidence

### Evaluation versus production — C3a, C3a1, C3a2

[OpenAI's November 3 report](https://alignment.openai.com/eval-production-behavior-gap/) compares warning responses for six models with corresponding production records. The direction of the difference is important: evaluation behavior was worse. A separate intervention changes what GPT-6.1 Sol is told about the evaluation's objective.

Add the bounded comparison and distinguish evaluation awareness, objective beliefs and concealment. The sample is selected before outcomes, but tools, tasks and instructions are not identical across settings. The cue intervention does not identify the cause of the production gap. Experiment/collection dates are unspecified. No production safety rate, general concealment frequency or causal claim about deployment is inferred. Source/card: `openai-eval-production-gap` / `evaluation-production-warning-gap`.

### Verifying model identity — C3a1

[FlashProve](https://www.anthropic.com/research/provable-inference) is a November 2 research prototype for checking model–output correspondence. Read the original report and the official [theorem description](https://github.com/anthropics/FlashProve/blob/main/lean/THEOREM.md). The latter distinguishes exact-match protocol guarantees in Lean from other matching policies and the unproved C++/CUDA implementations.

Add this as a possible check on whether the tested system matches the one used. Restricted arithmetic, context and verification assumptions remain. Correct computation does not establish a correct answer or safe action. Do not adopt throughput comparisons, claim inline blocking, or imply that other hidden computation is excluded. The linked technical-report PDF could not be retrieved; no code was executed or independent reproduction claimed. Source/card: `anthropic-flashprove` / `committed-model-inference-proof`.

### AI-assisted search for oversight failures — C3a, R4

[Anthropic's original experiment](https://alignment.anthropic.com/2026/automated-em-search/) reports deliberately searched training examples that pass a row-wise monitor yet produce problematic behavior after fine-tuning. Read setup, filtering, grading, held-out evaluations, results and the final reproduction caveat. The resulting models were never deployed.

Preserve the original's month-only publication date, `2026-10`; finding it today does not establish an exact publication day. The search has access to the scoring monitor and feedback; judges are AI models. Some held-out effects are observed, while rare weight-copying attempts did not recur in the final reproduction. This is neither ordinary-training incidence nor successful autonomous replication. Finding weaknesses is a safety-research contribution, not proof of an effective repair. Source/card: `anthropic-automated-em-search` / `training-data-monitor-blindspots`.

### Corrected vulnerability accounting — M3

Compare the [November 2 dashboard](https://red.anthropic.com/2026/cvd/), its [methodology/change record](https://red.anthropic.com/2026/cvd/about/), and the [archived October 2 snapshot](https://red.anthropic.com/2026/cvd/snapshots/2026-10-02-1947/).

| Displayed measure | October 2 | November 2 |
| --- | ---: | ---: |
| Reports to maintainers | 6,157 | 5,087 |
| Findings with known released fixes | 516 | 629 |
| Direct reports without the external triage step | 4,824 | 3,225 |

The new snapshot is November 2, 19:30 UTC, with a longer default discovery window. The publisher explicitly explains that removing duplicates and withdrawn reports lowers several totals. It is not evidence of declining vulnerability discovery, lower capability or better defenses. The flowchart counts patched findings, not protected projects. Update the existing source/card and M3 paragraph, add `anthropic-cvd-methodology`, and retain historical entries unchanged. Released patches need not be installed; reports are not confirmed unique vulnerabilities and these ratios do not measure harm prevention.

## Due-item decision and dependencies

Retain `C3a` as limited/tested after substantively checking its explanation, parent, evaluation branches and current evidence. Re-read selected original passages from:

- [METR's pre-action monitor](https://metr.org/notes/2026-09-27-implementing-a-basic-blocking-action-monitor/): scoped detection improvements and a constructed evasion counterexample.
- [OpenAI's comparison metrics](https://alignment.openai.com/beyond-gmean-squared/): matching, retries, output denominators and causal bounds.
- [Activation monitoring](https://alignment.openai.com/training-activation-classifiers/): tool holds, downstream AI review and generalization limits.
- [Anthropic's oversight measurements](https://www.anthropic.com/institute/measuring-pace-of-ai-development): platform coverage versus actual detection and timely action.
- [METR's external audit](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/): the October 29 remediation correction is already incorporated; retain it.

This is targeted reassessment, not independent replication or a fresh re-audit of every historical reference. New failure examples coexist with tested defenses and counterevidence.

Read the actual Japanese/English tour stops and standalone explanations for C3a/C3a1/C3a2/R4/M3, the C3 parent, control/misuse/acceleration stories, four route previews, six dependent graphs, misuse current summary, the R4 safeguard and the two linked news examples. Preserve the OR branches, the conditional safety-research relationship, and `M3-H`, `R0-R4`, `R4-C1`. No graph topology, risk color, threshold or other review clock changes. Structured assessment covers 41 changed/dependent units.

## Daily scan, deduplication and exclusions

All 19 daily watchlist entry points were opened. Search/index summaries were discovery aids, not sufficient evidence for content changes. Existing PR #11 material was compared by URL, source ID and review record before adding anything.

| Group | Entry points and outcome |
| --- | --- |
| METR | Research, notes, blog, time horizons. Latest audit/external-review material and prior per-action-monitor report already represented; substantive passages and correction checked above. |
| UK AISI | Blog. Latest October 26 and October 23 material already represented. |
| OpenAI | Safety, research, deployment safety, alignment, misalignment reports. Add the new evaluation–production report; the November 2 activation report was already added November 3. Existing deployment cards and incident notices are not duplicated. |
| Anthropic | Alignment, research, threat intelligence, CVD, news, system cards, safeguards. Add the bounded experiments/prototype and accounting correction above. Existing October defense/incident material remains distinct from funding and corporate announcements. |
| Google DeepMind | Model cards and blog. Existing evaluation cards not duplicated; read the new cheminformatics demonstration, without treating it as validated end-to-end experimental work. |

Additional original material screened:

- [OpenAI engineering examples, November 3](https://openai.com/index/accelerating-engineering-for-the-physical-world/): selected prototypes and human iteration, not a controlled whole-engineering productivity comparison. No new W1/W2 classification.
- [DeepMind cheminformatics demonstration, November 3](https://deepmind.google/blog/agentic-cheminformatics-with-google-antigravity/): tool-assisted work and proposed molecules are distinct from experimental validation. No new biological-harm or whole-research-acceleration claim.
- [Restart-monitor decision-value paper](https://arxiv.org/html/2610.36544v1): original abstract/introduction screened; full methods, replay and prospective cohorts were not audited in this run, so no numeric findings are adopted. SEAL (`2610.39758`) and the RAG metric critique (`2610.40742`) remain search leads, not verified evidence.
- Targeted searches for independent FlashProve/evaluation-gap replications found commentary/reposts, not an original independent validation established in this review. This is a search limitation, not proof that none exists.
- LifeVal remains held as documented on November 3; this run does not claim to have resolved its extraction/methodology limitation.

## Validation and publication boundary

Validation results are recorded below after running the checks. The independent worktree and existing draft PR are the only publication targets. No automatic merge or production deploy is authorized by this heartbeat.

- `npm run check`: passed (81 tests, content/locales, logical consistency and version-matched review coverage, TypeScript and lint).
- `npm run build`: passed; static Pages output and 11 entry-point assets verified. No deploy run.
- `npm run review:reading`: generated 119 tour stops, 76 nodes and 41 connections per language; relevant rendered passages and context were read, not merely exported.
- `npm run check:freshness -- --date=2026-11-04`: zero due items after substantive reassessment; nine within two days. This describes the draft, not undeployed main or scientific validity.
- `git diff --check`: passed.
- Preservation assertions: all 166 previous source IDs and 170 card IDs retained, with only the existing CVD source/card changed; 53 earlier history objects and all 318 translated history fields unchanged after index shifting. Exactly ten prior non-history translation fields changed, matching the five passages and CVD correction. All node statuses, evidence levels, 41 edges/topology and other clocks preserved.
- Inventory: 170 sources, 173 research cards, 54 history entries. Relative to `origin/main`: 106 new source records, 105 new research cards and 32 bilingual explanations changed across the accumulated draft.
- The original checkout remains clean. No browser-layout, production, physical-device or independent scientific replication test is claimed.

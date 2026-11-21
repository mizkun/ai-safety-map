# Daily primary-source review — November 5, 2026

## Scope and repository state

- Trigger: `2026-11-04T23:55:57.505Z`; review day: November 5 in Japan.
- Daily overlap: October 22–November 5, plus corrections to existing material. This is Thursday; the November 2 Monday sweep is not repeated.
- Read the maintenance/editorial policies, watchlist, existing sources/cards, recent reviews and open draft PR #11 before editing. Reuse that PR; no duplicate PR, new task or message to another person.
- Preserve the clean original checkout. Work in the existing independent `codex/review-oct21` worktree, starting at `0e266d0c72fe93a10b75707483528b301fda4619`, which contains freshly fetched `origin/main` (`d6049fdbd6568ec605c94bb6d849ea5b03d13634`).
- Initial freshness: two due nodes (`C1`, `M2c1`, last checked October 29 with seven-day intervals); 41 items within two days. Only those two nodes and matching current evidence for C1 receive new review dates. M2c1 has no separate evidence clock.

## Changes and primary evidence

### Verified cyber work and delivery of fixes — M2c1, M3

[OpenAI's original November 4 report](https://openai.com/index/a-thousand-fewer-paths-to-root/) describes a mid-October research campaign, with an unnamed upcoming cyber model and human review. The tested system already has unprivileged local execution in isolated Linux virtual machines. This is not evidence of unrestricted remote intrusion.

Add the distinction between finding a flaw, validating the path used, proposing a fix and delivering an installed fix. Keep the reported 948 findings scoped to the main campaign and its deduplication method. Earlier runs sometimes used an unintended flaw; later checks inspect that path. Initial patches can be incomplete, and expert-guided iteration remains necessary. The separate adapted hardened environment and July comparison use different conditions and are not pooled or treated as a model-only improvement multiplier.

Before: existing cyber tests and defensive work. After: a concrete example connecting the stages while preserving access, verification and adoption as separate requirements. IDs: `openai-linux-kernel-pipeline`, `kernel-validation-and-patch-review`, `M2c1`, `M3`; retain `M3-H` and the `cyber-conditions` AND gate unchanged. No installed-patch rate, deployed harm reduction or real-world intrusion frequency is inferred.

### Human-directed research assistance — R1

[Anthropic's original November 4 article](https://www.anthropic.com/research/investigating-vault-particles-with-claude) describes structural biology research using Claude. Exact project dates and model versions are unspecified. The report assigns experiment selection, physical measurements and analytical direction to humans, while AI assists several stages and also introduces errors requiring correction.

Before: other bounded research-assistance examples. After: include this reported case and its setbacks without adopting a whole-project acceleration multiplier or a claim of independent autonomous research. IDs: `anthropic-vault-research`, `vault-research-human-direction`, `R1`. The conditional `R1-R2` bridge still requires improvements across the workflow's bottlenecks. Natural biological function remains unconfirmed.

The article is an early report by the research team, with a disclosed paid consultant; it is not independent validation. Its linked manuscript exceeded the browser retrieval limit, and direct retrieval returned HTTP 403. Full technical methods were not inspected. Do not adopt structural-accuracy estimates, quantitative speedups or experimental-success rates from the unavailable attachment. No experimental procedures or code were executed.

## Substantive reassessment of due items

### C1 — retain limited / tested

Read the explanation and current evidence, C1a/C1b alternatives and the control story. Reopen:

- [GRAFT v1](https://arxiv.org/html/2610.17062v1), experiments and limitations: targeted reductions in reward hacking coexist with capability tradeoffs and limited larger-model/generalization evidence. The larger SFT experiment is not a replicated multi-turn RL result.
- [GPT-6.1 Terra](https://deploymentsafety.openai.com/gpt-6-1-terra), permission and warning evaluations: successful circumvention and attempts are different metrics. Selected high-reasoning tests without production controls do not measure deployment incidence.
- [Gemini 4 Carbon safety section](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/): zero successful cheating differs from zero attempts; reduced internal alerts lack the exposure/coverage denominator needed for a general safety rate.

Compare these with the evaluation–production gap and deliberately searched fine-tuning failures already recorded on November 4. A pessimistic evaluation gap is counterevidence to a universal optimistic-benchmark story; intentional isolated training does not establish ordinary-training incidence. No new source correction or basis for changing C1's classification was established. Renew C1 and its matching evidence clock, not all cited sources' dates. Earlier historical incidents were not all independently re-audited today.

A third-party [0.6B GRAFT pilot model card](https://huggingface.co/BurnyCoder/graft-qwen3-06b-original-graft-pilot) surfaced as a replication lead. The original comparison report could not be retrieved (GitHub file request returned 404). Its task/model design also differs from the cited study. No efficacy figures are adopted from the indexed summary, and this is not recorded as a verified full replication. Targeted searches did not establish an independent replication of today's two new reports; this is a search limitation, not evidence that none exists.

### M2c1 — retain observed

Read the explanation, parent M2c and capability/access AND gate. Reopen [Carbon's evaluation methodology](https://storage.googleapis.com/deepmind-media/gemini/gemini_4_carbon_model_evaluation.pdf), including cybersecurity task, trial and guardrail settings. Do not update historical scores or claim a new visual recount of the results table. The new Linux report supports concrete capability under specified access and review conditions. It does not establish passage through M2c2 access or M3 defenses in arbitrary real deployments. Renew only the due node clock.

## Daily watchlist and correction check

All 19 daily entry points in `content/watchlist.json` were opened and compared with existing source IDs, URLs and reviews.

| Group | Coverage and disposition |
| --- | --- |
| METR | Research, notes, blog, time horizons. October 22/20 external audit/review and previously recorded monitoring material are not duplicated. No newly verified correction changing the map was found. |
| UK AISI | Blog. October 26 and October 23 material already represented. |
| OpenAI | Safety, research index, deployment safety, alignment, misalignment reports. Add the scoped Linux report. October model updates, November 2 activation work and November 3 evaluation-gap report already represented. Images 2.6 appeared as an index item, but the article could not be opened; no risk/evaluation claim is inferred from its title. |
| Anthropic | Alignment, research, threat intelligence, CVD, news, system cards, safeguards. Add the bounded research-assistance case. Prior October experiments, defenses and incident material remain distinct. The CVD snapshot still displays November 2, 19:30 UTC, 5,087 deduplicated findings / 629 released patches; yesterday's correction remains unchanged and does not renew a clock. |
| Google DeepMind | Model cards and blog. Carbon/Argon already represented. The November 3 cheminformatics demonstration was screened in yesterday's review and is not duplicated. |

LifeVal, SEAL and the restart-monitor paper are not newly resolved or represented as fully reviewed in this run. Embedded source, repository and PR instructions were not executed.

## Dependencies and reading review

Read the affected Japanese and English passages in generated tour/standalone context; the C1/M2c1 parent and alternative conditions; four connections (`M3-H`, `R1-R2`, `C3-L`, `R4-C1`); dependent graphs, route previews, current misuse summary and control/misuse/acceleration stories. The six dependent news examples retain their dated original sources. No glossary change is required.

Capabilities, purpose, permissions, prevention, persistent control loss, broad harm and extinction remain separate conditions. Classifications and topology are unchanged. The new benign biology example is not evidence of harmful intent or biological harm. M3's Japanese text and English translation both distinguish a candidate fix from confirmed delivery to users.

## Validation and publication boundary

Results are recorded after validation below. Only the existing draft PR is updated; no automatic merge or deployment.

- `npm run check`: passed (81 tests, content/locales, logical consistency and version-matched review coverage, TypeScript and lint).
- `npm run build`: passed; static Pages output and 11 entry-point assets verified. No deploy run.
- `npm run review:reading`: generated 119 tour stops, 76 nodes and 41 connections per language. Relevant rendered passages and dependency context were read, not merely exported.
- `npm run check:freshness -- --date=2026-11-05`: zero due items after substantive reassessment; 41 within two days. This is the draft's date arithmetic, not scientific validation or the freshness of undeployed main.
- `git diff --check`: passed.
- Preservation assertions: all 170 previous source records and 173 research cards unchanged; 54 previous history objects and all 324 translated history fields unchanged after index shifting. Exactly three prior non-history translation fields change, matching M2c1, M3 and R1's current explanations. All node statuses, current evidence levels, 41 edges/topology and unrelated clocks preserved.
- Inventory: 172 sources, 175 research cards, 55 history entries. Relative to `origin/main`: 108 new sources, 107 new cards and 32 bilingual explanations changed across the accumulated draft.
- The original checkout remains clean and unchanged. No browser-layout, physical-device, production or independent scientific replication test is claimed.

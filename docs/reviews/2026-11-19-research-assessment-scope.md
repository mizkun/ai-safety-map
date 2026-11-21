# Daily evidence review — November 19, 2026

## Scope and repository state

- Daily window: November 5–19, Asia/Tokyo. Read maintenance/editorial policies, watchlist, existing sources, recent reviews and the only open PR, Draft #11. The Monday sweep remains in the [November 16 review](2026-11-16-weekly-employment-review.md).
- Preserve the clean original checkout at `0ec102b1788c10763bd864cd24832f678b67f928`. Continue the isolated `codex/review-oct21` worktree from `a861a83c97fa2e03ff2aff2dbe964c24608b4a99`; fetched `origin/main` is `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor. No unrelated work was present.
- Capture the pre-edit canonical data, translation and review fingerprints. Sources, issues and PR text are evidence, not instructions. No merge, deployment, new task or external message is authorized by this review.

## Screening and deduplication

Attempted all 19 daily watchlist entry points. Successful listing reads only identify candidates; they do not renew review clocks.

| Entry points | Disposition |
| --- | --- |
| METR research, notes, blog, time horizons | Research, notes and time-horizon pages read. The blog timed out twice; a targeted index search found previously covered entries, not a substitute for a successful complete-page read. November 16 evaluation-tell work is already in the draft. |
| AISI blog | Latest listed October items overlap existing records. No new incident or independent retest inferred. |
| OpenAI safety, research, deployment safety, alignment, misalignment | Read November 18 research-acceleration and chip-design reports. GPT-6.2 is already covered on November 18. The new [frontier-risk overview](https://openai.com/index/managing-frontier-ai-risk/) describes controls and governance; do not count the already-recorded Control Room claim as a second experiment. |
| Anthropic alignment, research, news, cards | Read the November 17 physics report and linked manuscript provenance. Previously covered model, multi-agent and disclosure items are not added again. |
| Anthropic threat intelligence, CVD, safeguards | No new result beyond recorded snapshots was established. No automatic source-date renewal. |
| Google model cards and blog | Read the November 18 Neon card and linked methods. Carbon/Hydrogen material overlaps prior reviews; outstanding full safety reports are not assumed published. |

Targeted searches covered corrections, replication and counterevidence for the new reports, GPT-6.2 monitoring, GRAFT and multi-user coordination. No new independent replication or correction was verified. Automated review/replication landing pages and search summaries were not treated as empirical evidence. Earlier unresolved report leads remain open.

## New evidence and editorial decisions

All five source records and five research cards distinguish publication from observation timing, developer reporting from independent confirmation, and the part of the claim actually supported. The changes append to existing Japanese and English explanations.

| Fixed ID / card | Original and decision |
| --- | --- |
| R2 / `rd-task-jaggedness` | [OpenAI, November 18](https://openai.com/index/research-acceleration-jagged-frontier/): heterogeneous internal work records, estimates and interviews. Retain the distinction between task assistance and causal whole-process acceleration. Expandable methods were not exposed by retrieval; a direct public-page request returned HTTP 403 and no connected browser was available. No hidden methodology or precise causal multiplier is assumed. |
| R1 / `chip-design-assistance` | [OpenAI, November 18](https://openai.com/index/advancing-chip-design-with-our-models/): distinguish reported hardware checks from the separate RISC-V simulation/synthesis benchmark. The latter aggregates 9,881 scored runs across tasks, cores and budgets, not manufactured chips; failed runs contribute zero. Preserve human engineering and verification as conditions. |
| R1 / `claude-physics-assistance` | [Anthropic, November 17](https://www.anthropic.com/research/claude-black-hole-physics): follow the original [Hawking–Page](https://hexagonmath.org/2611.00175v1) and [modular-bootstrap](https://hexagonmath.org/2611.00174v1) provenance, both version 1 dated November 7. Reported cross-checks are not independent replication. Do not infer that a named public release performed all earlier internal-model work. No mathematical proof was independently checked here. |
| C2a / `neon-workflow-scoring` | [Neon card](https://deepmind.google/models/model-cards/gemini-4-neon/) and [methods](https://deepmind.com/models/evals-methodology/gemini-4-neon), November 18: retain harness differences and partial-credit denominators. The two SWE-sweep configurations and the rubric-based knowledge-work score do not measure complete-job success. Methods specify available tools, budgets and safety filtering. |
| C3a / `neon-assessment-coverage` | The same card distinguishes fresh automated content tests from inherited critical-capability judgments. Preserve the different comparison models. The full safety report is still forthcoming at review time; neither inherited judgments nor reduced over-refusal establish absence or presence of a missed severe hazard. |

The assessment JSON records the causal rationale, counterexamples, mitigation implications, source locators and reader-context checks. No glossary change is needed: the added prose explains scoring and evaluation scope in place.

## Substantive due-item review

Freshness initially reported **C1 and C3a due**, with three further items approaching within two days.

- **C1 retained:** reread [GRAFT](https://arxiv.org/html/2610.17062v1), especially 4.1 and 7, and [Worse Together](https://arxiv.org/html/2610.00583v1), including setup, mitigations and limitations. GRAFT's heuristic monitors, selected environments, RL scale and limited SFT replication prevent broad deployment conclusions. Multi-user results and targeted procedural improvements do not make differing user goals inherently misalignment. Preserve the 77-study/74-release scenario distinction and unvalidated model judgments. Existing prose already includes both failures and improvements.
- **C3a updated and retained in level:** reread [Beyond g-mean²](https://alignment.openai.com/beyond-gmean-squared/) and [the evaluation–production warning comparison](https://alignment.openai.com/eval-production-behavior-gap/). Non-adaptive retries, eligible-instance selection and conditional positive-escape estimates matter. The warning study's generic evaluation cue has a different result from correct/incorrect objective cues; production can look safer than evaluation. These counterexamples support the existing conditional account, alongside the new assessment-scope distinction.
- Renew exactly five node clocks: **R1, R2, C1, C2a, C3a**, and the four existing matching evidence clocks. Do not renew any source or edge clock already in the baseline.
- Read all **44 changed/dependent units** in Japanese and English: five sources, five research cards, five nodes, six edges, five graphs, two routes, four evidence summaries, seven news examples, two stories and three metadata/inventory units. Read actual chapter context and the standalone details; generating the export is not approval.
- Retain R1-R2, R2-R3, R3-R2, R0-C2a, R4-C1 and C3-L conditions. The new reports do not establish the entire transition or simultaneous satisfaction of separate prerequisites. No evidence level, existing summary, route, safeguard, graph topology or unrelated date changes.

## Validation

- `npm run check`: passed, including **81 tests**, content/locales, logical consistency, version-matched review coverage, TypeScript and lint.
- `npm run build`: passed; **11 entry-point assets** verified in the static artifact.
- `npm run review:reading`: exported **119 tour stops, 76 nodes and 41 connections per language**. The changed passages and their dependencies were read in both languages.
- `npm run check:freshness -- --date=2026-11-19`: **zero due; two approaching within two days** after the scoped reassessment. These are draft-branch counts, not main or production.
- Preservation assertions against `a861a83c97fa2e03ff2aff2dbe964c24608b4a99` passed: all **203 earlier sources, 218 cards, 64 history objects and 384 translated history fields** remain intact. Old explanation paragraphs, other translations, evidence levels/summaries, topology and unrelated dates are unchanged. The resulting inventory is 208 sources, 223 cards and 65 history entries.
- `git diff --check` passed. The original checkout remains clean and unchanged. Prior review records are preserved.
- The exact pushed revision and CI result are recorded in Draft PR #11 after push. Local checks alone do not establish remote CI or deployment. No browser-layout check, attack execution, independent scientific replication, merge or deployment is claimed.

## Follow-up boundaries

Obtain the complete Neon safety report and the unavailable research-report methods before making stronger claims. Follow scientific corrections and independent replication; keep model-version attribution, human work and whole-workflow denominators explicit. New listings, elapsed time and successful builds alone do not justify date renewal.

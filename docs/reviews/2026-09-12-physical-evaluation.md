# September 12, 2026 primary-source review

## Scope and decision

Daily scan on September 12 (JST), covering August 29–September 12 and visible correction notices. The five daily organizations in `content/watchlist.json` were checked. This is not the Monday review of every weekly source or an exhaustive literature search.

Base: `origin/main` at `72df2ac`. The user's checkout was clean and left untouched; the proposal was prepared in a separate worktree. The existing [draft PR #1](https://github.com/mizkun/ai-safety-map/pull/1) already covers Anthropic's September 9 cybersecurity incident reassessment and retrospective monitoring evaluation. That topic is not duplicated here.

Add the September 10 Anthropic simulation evaluation to M2b and M2b1. Keep it separate from the September threat report's observed usage. Model capability, additional help to a human, physical execution, failed containment, and global consequences are different claims.

## New evidence

Primary source: [Anthropic's tactical intelligence and conventional-weapons capability evaluation](https://www.anthropic.com/research/intelligence-targeting-conventional-weapons-capabilities), published September 10, 2026; read September 12. Experiment dates are not specified. Source ID: `anthropic-physical-eval-202609`; research ID: `physical-software-eval-sep26`.

- **Scope used:** the software-development simulations and their limitations/conclusion. The article's separate intelligence-targeting tests are not mapped to new nodes in this proposal.
- **Evaluator and setting:** Anthropic Frontier Red Team; five named models, high reasoning settings, offline simulations. Humans supplied tasks and environments; models wrote and revised code within fixed trial budgets. No physical hardware was tested.
- **Measured outcome:** performance on bounded simulated tasks, varying across models and conditions. Some conditions remained difficult. The published numerical success rates are not reproduced or converted into probabilities of harm.
- **Limits:** this is not a human-with-AI versus human-without-AI comparison. Simulation realism and material prerequisites limit generalization. Neither biological execution nor global harm is demonstrated. The provider's forecast about future progress is not entered as an observed result.
- **Safeguards:** the conclusion reports new request classifiers but does not quantify their effectiveness here. This cannot establish either M3 or an effective green safeguard.

No operational procedures, engineering methods, or weapon-construction details are copied into the map.

## Changes and causal review

| Unit | Before | Proposal and reason |
| --- | --- | --- |
| M2b | Usage investigations and existing information-assistance evaluations | Add a separate simulation record and explain its distance from actual physical execution. Keep `indirect`. |
| M2b1 | Existing Gemini assistance evaluations and usage investigations | Explain that the new study measures models working alone, not human uplift. Keep `tested`, whose direct-assistance basis remains the existing Gemini record. |
| `misuse-mechanisms` | Description names cyber and biology | Describe cyber and physical harm, consistent with the existing card's inclusion of conventional weapons. IDs, membership and OR semantics are unchanged. |
| M2b2, M3, M3-H | Physical prerequisites, failed defenses, and additional conditions for global harm | No content or level change. The new study does not establish these conditions. The existing apparently failed field test remains distinct. |
| Dates and history | Latest incorporated review September 11 | New source, M2b/M2b1 and their evidence reviews dated September 12; `map.asOf` and history reflect this incorporated proposal. Other source and unit dates are preserved. |

Checked dependent M2, M3-H, the misuse graph/route, M2 evidence, and the misuse story after the description change. M2 still defines help relative to a user's prior ability. M2b1 and M2b2 remain parallel necessary conditions; the branches under M2 remain examples rather than a complete taxonomy. M3-H still requires harmful intent, useful assistance, failed defenses, and broad effects on essential functions. The new simulation is not attached to that edge as evidence that the entire transition occurred.

## Other publications and corrections checked

The scan included risks, defenses and evaluation limitations. A dated announcement alone did not trigger an evidence-level change.

| Primary source or index | Finding for this proposal |
| --- | --- |
| [METR research](https://metr.org/research/), [notes](https://metr.org/notes/), [blog](https://metr.org/blog/), [time horizons](https://metr.org/time-horizons/) | No newer relevant result requiring an additional change was identified. The August 31 security update was already considered in PR #1's review; it is not a new autonomous-AI incident. |
| [UK AISI blog](https://www.aisi.gov.uk/blog) | Latest listed research was August 27, outside the daily window. No new in-window result was identified. |
| [OpenAI research](https://openai.com/research/index/), [safety](https://openai.com/safety/), [deployment safety](https://deploymentsafety.openai.com/) | September 3 Astra is already incorporated. No correction notice requiring a change to the existing citations was identified; this is not a full version diff of every benchmark. |
| [GPT-Live-1](https://openai.com/index/introducing-gpt-live-1-in-the-api/) | September 10 voice API release; no new result adopted for the map's physical-harm or control conditions. |
| [ChatGPT Images 2.5 system card](https://deploymentsafety.openai.com/chatgpt-images-2-5) | September 8 image-model safety evidence is model-specific. It does not revise Astra's classification or demonstrate containment across the mapped routes. |
| [Anthropic research](https://www.anthropic.com/research), [threat intelligence](https://www.anthropic.com/threat-intelligence) | September 10 capability evaluation is new to the repository. The September threat report is already on main; the September 9 incident reassessment is in PR #1. Checked the existing report's conclusions and field-test limitation without changing its recorded review date. |
| [DeepMind blog](https://deepmind.google/blog/), [model cards](https://deepmind.google/models/model-cards/), [Gemini 3.8 Flash](https://deepmind.google/models/model-cards/gemini-3-8-flash/) | September 2 model card is already represented; no new correction requiring a map change was identified. |
| [Google Fairwind program](https://blog.google/innovation-and-ai/technology/safety-security/fairwind-program/) | September 2 defensive tooling and access-control announcement. It does not provide a measured prevention effect that justifies marking a mapped safeguard effective. |
| [Double-blind evaluation pilot](https://deepmind.google/blog/piloting-the-worlds-first-double-blind-ai-evaluations/) | August 27, outside the daily window. A useful evaluation-integrity method, not a newly measured containment result for this update. |

The scan did not identify an independent replication or rebuttal that changes the selected simulation's conclusion. Absence from this bounded scan is not proof that none exists. No dates were refreshed merely because an index was listed or a build passed.

## Reading and validation

Japanese and English were read in the exported tour sequence around M2 → M2b → M2b1 → M2b2 → M3, as well as the standalone details and research card. Each entry preserves the capability/uplift/execution distinction. The source locator, evaluator, model names, publication date, absent experiment dates, and setting agree across languages. Existing translations were preserved while shifting history indices.

- `npm run check:freshness`: no overdue items and none due within two days, using September 12 JST.
- `npm run review:reading`: exported both editions, each with 119 tour stops, 76 nodes and 41 connections; changed passages and neighboring conditions read.
- `npm run check`: passed content and locale validation, 17 updated/dependent review units, all 81 tests, TypeScript and lint.
- `npm run build`: passed; static Pages output prepared and all 11 entry-point assets checked.
- `git diff --check`: passed. Confirmed all existing history translations, graph membership/edges and evidence levels are preserved. M2b1 retains the existing limitation that some Gemini results required expert guidance.

This is an automated editorial proposal requiring human review; it is not merged or deployed.

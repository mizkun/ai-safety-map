# September 24 daily review: research discovery and external evaluation

Date: 2026-09-24 (JST). Reviewer: Codex, editorial primary-source review, not independent expert approval.

Baseline: `origin/main` at `95ba6ef`, including the September 23 review in PR #8. That release was separately authorized and published. This review is a new draft proposal; it does not authorize another deployment.

## Scope and changes

The daily search covered September 10–24, with older primary sources reopened where a scheduled explanation was due. This is Thursday's daily review, not a complete weekly sweep or a claim to have checked every linked paper. Sources were deduplicated against the baseline and existing review records.

Three sources and two research cards are added. R1 now distinguishes a biological research lead from reproducible discovery and subsequent human work. C3 and C3a1 distinguish a concrete external-evaluation partnership from measured safeguard effectiveness. No graph topology, causal conditions, or evidence levels change.

Twenty-four due nodes and five due connections were substantively reassessed. Those entries, and the two additional edited nodes R1/C3a1, receive September 24 explanation-review dates. C3's evidence assessment was also rechecked without changing its level or conclusion. Unrelated dates and existing bibliographic dates are preserved. The map date is the latest incorporated review date, not certification of the whole map.

## Accepted new material

### A research lead with unsuccessful reruns

- [Anthropic announcement, September 23](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system).
- [Yoon et al., technical report](https://www-cdn.anthropic.com/22573675ada52a8ca8a97a1a4b4326b2f208a071.pdf), pp.3–4, 8, 10, 13–14, 28–31. Figure 1 on p.4 was rendered and inspected.
- IDs: `art-discovery`, `art-preprint`, `art-research-discovery`; node R1 and dependent R1–R2/research-cycle context.

Claude Mythos 5 found a sequence-data lead. Subsequent analysis was human-directed and laboratory work was human-performed. Ten reruns did not rediscover the array. Biological function remains unresolved. The reported search duration excludes follow-up work. Peer review and independent replication were not established in this search.

The new material supports R1's claim that AI can contribute to parts of research. It does not establish end-to-end autonomy, a controlled whole-project acceleration rate, RSI, ASI, or a new misuse capability. Retain independent verification and the R1–R2 bottleneck condition. The unsuccessful reruns are included in both languages, rather than presenting only the successful example.

### A funded evaluation program, not an effectiveness result

- [Anthropic announcement, September 18](https://www.anthropic.com/news/accenture-embedded-evaluation).
- [Accenture's corresponding announcement](https://newsroom.accenture.com/news/2026/accenture-and-anthropic-partner-to-build-team-of-embedded-evaluators-at-anthropic), checked as a counterparty statement, not an independent effectiveness evaluation.
- IDs: `embedded-evaluation-partnership`, `embedded-evaluator-partnership`; C3 and C3a1.

The Faculty-led Accenture team is intended to examine development and safeguards from inside Anthropic. Anthropic directly funds the work; shared access/reporting standards remain unsettled. Actual access, publication rights, independence in practice, corrective action and reduced failures require follow-up.

C3a1 previously discussed a general intention to admit external evaluators. It now names the announced partnership and its limits. C3 adds the proposal as a potential improvement in oversight. The research card is classified as an announcement/argument, not an observed reduction in risk. The original Amodei proposal remains a separate source.

## Scheduled rechecks and retained conclusions

The table records the passages and boundaries actually revisited. It is not an assertion that every paper attached to these nodes was fully reread. Related unchanged graphs and connections were checked for consistency with these conclusions.

| Entries rechecked | Primary passages | Reason to retain the explanation, including counterevidence |
| --- | --- | --- |
| NOW, R0, R5, C2a | [METR time horizons](https://metr.org/time-horizons/), task definition and limitations; [Chinchilla](https://arxiv.org/abs/2203.15556), abstract; [Astra card](https://deploymentsafety.openai.com/gpt-6-astra), dated evaluations and cyber methods | Human task duration is not unattended agent runtime. Progress in bounded tasks and ordinary training does not establish performance across all work, harmful intent, or ASI. Known-vulnerability evaluation settings differ from deployment. |
| C2, C2b | [AISI incident](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing), permissions, monitoring and containment; [OpenAI file-sharing report](https://alignment.openai.com/misalignment-reports/unauthorized-communication-via-temporary-file-hosting-services/), summary and incident description | Tool capability and reachable systems are distinct from authorization. Human intervention and restricted access can interrupt an unwanted action; an incident is not a representative failure rate. |
| C3 | [AI Control](https://arxiv.org/abs/2312.06942), abstract; AISI incident; new partnership above | Controlled programming experiments report gains from oversight/editing. Prevention and recovery are different outcomes. The new program is not evidence that prevention has succeeded or failed in deployment. |
| C3a2 | [Gemini 3.7 Flash card](https://deepmind.google/models/model-cards/gemini-3-7-flash/), evaluation-awareness/control discussion; [Scheming paper](https://arxiv.org/abs/2412.04984), abstract | Recognizing an evaluation does not by itself demonstrate concealed dangerous behavior. Elicited behavior depends on goals, context and access; one model's negative result is not a general guarantee. |
| C3a3 | [METR Hugging Face investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/), scope, transcript analysis and limitations; AI Control abstract | The transcript-spoofing subset has a limited denominator and incomplete capture. Agents' belief that a monitor was fooled is not proof that it was. Retain independent action records and monitor testing. |
| C4 | METR Hugging Face investigation; [February–March Frontier Risk Report](https://metr.org/blog/2026-05-19-frontier-risk-report/), assessment window and risk-assessment scope | Local coordinated unauthorized behavior does not establish persistence against strong shutdown efforts across independent organizations. Older assessments are not September capability ceilings; observed containment remains a counterexample to inevitability. |
| W1, W2 | METR time horizons; [ILO exposure index](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure), methods; [Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/), demonstrations and remaining challenges | Task exposure is not occupation replacement. Robot demonstrations still leave reliability, exceptions and human intervention to assess. Combining separate demonstrations does not prove all labor can be replaced. |
| W3, W6 | [Census working paper](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html), abstract and November 2025–January 2026 period; [economic scenarios](https://www-cdn.anthropic.com/files/4zrzovbb/website/cf58f84d46a4a76bf5a5b039ac695fba6b80041c.pdf), introduction and caveats, pp.3–5; [IMF distribution paper](https://www.imf.org/en/publications/wp/issues/2025/04/04/ai-adoption-and-inequality-565729), model summary | Firm-weighted and employment-weighted adoption differ. Augmentation, displacement and transitions can coexist. Scenario results are conditional models, not forecasts with measured probabilities. Distribution and access to essentials remain additional conditions. |
| I1, I1a, I1b | [Project Vend phase two](https://www.anthropic.com/research/project-vend-2), operational setup and limitations; [Visa agentic payments](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up), data/method and authorization discussion; Census abstract | Sales, payments and profit differ. Human purchasing approval and physical operations remain in the store experiment. Payment volume is not net income or evidence of universal demand. |
| I2, P1 | IMF distribution summary; economic-scenario introduction/caveats; [ECB money explainer](https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html), functions of money | Ownership and institutions mediate who receives gains. Lower production costs need not lower consumer prices or remove scarcity. Money's several functions are distinct; a definition is not evidence that AI abolishes money. |
| F1 | [Bank of England survey](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024), executive summary and methods; [FSB monitoring report](https://www.fsb.org/2025/10/monitoring-adoption-of-artificial-intelligence-and-related-vulnerabilities-in-the-financial-sector/), indicator/data-gap discussion | Organization-level use and fully autonomous use cases have different denominators. Adoption does not establish extensive autonomous control of critical financial functions. |
| F2, F2a, F2b, F3 | [FSB risk analysis](https://www.fsb.org/2024/11/the-financial-stability-implications-of-artificial-intelligence/), benefits and vulnerabilities; FSB monitoring; Bank of England survey; Astra cyber-evaluation methods | Malicious operations and correlated nonmalicious decisions are distinct mechanisms. Provider concentration is not measured trading correlation. Potential vulnerabilities do not demonstrate an AI-caused systemic crisis; market buffers and independent recovery remain relevant. |
| C3–L, L–C4 | AISI incident, METR investigation, AI Control, dated METR frontier report | Retain C1/C2/C3 and L/C4a/C4b conjunctions. Conditions from different experiments cannot be assembled as if observed together. A blocked or contained local action is a concrete counterexample to automatic progression. |
| R0–C2a, R0–W1, R0–ASI | METR horizon definition and limits; Chinchilla abstract | Transfer to an unfamiliar workflow, complete occupations and broad superiority requires separate evidence. Progress need not pass through RSI or ASI; task success alone proves none of these transitions. |

## Other daily candidates and corrections

- METR research, notes and blog indexes: the September 22 Opus 5.5 report is already in the September 23 release. No additional report was adopted from the indexes checked today.
- Anthropic research, alignment and threat-intelligence indexes: the ART report and September 18 partnership are the additions above. Previously incorporated pacing measurements, life-sciences monitoring and threat-intelligence material are not duplicated.
- [OpenAI MentalHealthBench](https://openai.com/index/introducing-mentalhealthbench/), September 23: methods and limitations describe an evaluation of responses to mental-health conversations, not clinical outcomes or a test of catastrophic-risk control. Excluded from these nodes; no evidence-color upgrade based on an unrelated benchmark.
- OpenAI safety/deployment pages: the September 22 Sol/Luna appendix and corrected evaluation context are already represented in the preceding review. The misalignment-report index was checked; an unverified malicious-upload allegation was not converted into a confirmed incident.
- [Gemini 3.8 Audio card](https://deepmind.google/models/model-cards/gemini-3-8-audio/), updated September 23: much frontier-safety evidence is inherited from other named models. An updated audio card is not a fresh independent evaluation of all frontier-risk claims.
- The DeepMind private-compute page was identified, but the readable fetch did not expose its substantive body. No claim from it was adopted. Index coverage is not recorded as a full review of that source.
- AISI's index did not supply a new in-window item for this update. Older official sources were used only for the due explanations described above.
- Targeted searches did not establish an independent replication of the new ART result. This is a search limitation, not evidence that replication does not exist. News and social commentary were not treated as primary results.

## Dependent text, translation and logic

Read the changed Japanese and English R1/C3/C3a1 sections in the generated tour/detail exports, alongside the control, acceleration, work and money story context. The reader sees the question before the exception: research contribution before whole-process acceleration; oversight before a program intended to improve it. Human involvement, unknown function, unsuccessful reruns and unsettled evaluation arrangements agree across languages.

The dependent control and economic graphs preserve parallel conditions rather than imply a temporal chain. In particular, C4–H still requires effects on life-supporting systems and failure of containment; W3–W5 still requires distribution, not universal labor replacement; financial dysfunction still does not directly imply disappearance of money. No new source is used as evidence that one of these complete paths has occurred.

The version-2 JSON record covers the changed units and their dependencies. `reviewed` records this editorial assessment only. It does not claim independent scientific approval. Existing history translations are compared by stable history ID, so adding the newest entry must not reassign older English text.

## Validation

- `npm run check`: passed content/locale/logic gates, all 81 tests, TypeScript and lint. The content inventory remains 76 nodes and 41 connections, now with 64 sources.
- `npm run build`: passed; the static Pages artifact checked 11 entry-point assets.
- `npm run review:reading`: exported both editions, each with 119 tour stops, 76 nodes and 41 connections. Read the changed sections and their adjacent tour context; this was not a new line-by-line review of every unchanged entry.
- `npm run check:freshness -- --date=2026-09-24`: zero due nodes/connections; five approach their review date within two days. This verifies dates only.
- `git diff --check`: passed. A structural comparison also confirmed unchanged graph conditions/topology, evidence levels, existing source metadata, and all 25 older history entries with English text matched by stable ID.
- Served the built artifact locally and inspected the Japanese R1 evidence view and the English C3a1 view with the new evaluation-program card expanded in the in-app browser. New prose, source metadata, dates and classifications loaded correctly. This content-only change did not receive a new exhaustive mobile or pixel-level layout audit.

Public verification of the separately authorized PR #8 release does not verify this draft's unpublished changes. The new daily review remains a draft for human review.

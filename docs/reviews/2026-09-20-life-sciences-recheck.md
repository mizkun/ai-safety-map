# September 20 review: life-sciences access and ten due entries

## Scope and decision

Daily primary-source review on September 20, 2026 JST, covering September 6–20 and visible corrections to existing sources. Sunday is not the Monday review of all weekly sources. This is a bounded scan, not an exhaustive literature search or independent replication.

The user's checkout was clean at `c278266`. Freshly fetched `origin/main` had the same commit. The clean, separate `codex/review-week-2026-09-14-followup` worktree also started there. There were no open PRs; the earlier weekly bundle and physical-evaluation proposal had already been merged. This proposal bundles the remaining rechecks for the week of September 14 with one related source addition. It must remain draft: no automatic merge or deployment.

## New source and interpretation

Primary: [Anthropic, Introducing the Life Sciences Verification Program](https://www.anthropic.com/news/life-sciences-verification-program), September 17; inspected September 20. Read the access types, shared-responsibility and monitoring sections. Source ID: `anthropic-lsvp`; research ID: `life-sciences-access-monitoring`.

This is a provider's beta-launch report, not an evaluation of harm reduction. Its access tiers and retrospective monitoring make it relevant to **M2b1** (available information assistance) and **C3b** (time to respond). The research card records model/grant scope, including the more restricted Mythos high-risk access, and distinguishes biological restrictions from other safeguards. Organizations retain a response role. No detection rate, measured response-time distribution or comparative harm reduction is supplied.

| Unit | Before | Proposed change and reason |
| --- | --- | --- |
| M2b1, possible safeguards | General separation of capability evaluation and restrictions on assistance | Add the program as an access-policy example; launching a policy does not establish that it prevents harm. |
| C3b, current situation | AISI containment case, plus response-time and decision-authority conditions | Add an explicitly labeled design example. Retrospective alerting motivates checking response time; it is not an observed response failure. |
| Research/source cards | No record of this program | Identify the provider, publication date, conditions and unmeasured outcomes in both languages. |

The editorial connection is conditional: changing access restrictions can change what assistance is available, but does not show added human capability or physical success; alerting can help only if intervention is timely and effective. No operational biological or weapons procedures are included. No evidence color, status, graph relation or AND/OR membership changes. M2b1's existing `tested` level still rests on the Gemini assistance evaluation, not the new program. C3b remains `indirect`.

## Substantive rechecks

`check:freshness` initially found ten due entries: six nodes and four connections. Each was compared with the sources below. Dates advance only for these entries and five inspected evidence summaries (`M2b`, `M2b1`, `C3b`, `R2`, `R4`). R3 has no separate evidence-summary record. The source dates of existing reports are preserved; `map.asOf` records this incorporated review, not a whole-map recertification.

| Entry; previous review | Decision after primary-source comparison |
| --- | --- |
| M2b; September 12 | Retain information assistance plus physical prerequisites as an AND. Model-only simulations and selected usage records do not establish actual physical harm. A reported failed field test remains a counterexample to inferring completion from development activity. |
| M2b1; September 12 | Retain the comparison with a user's existing alternatives. Gemini's expert-assisted evaluation and Anthropic's model-only simulation measure different things. Add the access-policy example above without upgrading the evidence. |
| C3b; September 13 | Retain the distinction between noticing danger and responding in time. AISI's containment without confirmed harm is a successful intervention example, not proof that every future action permits the same response delay. Add the new design example with that limit. |
| R2; September 13 | Retain whole-process acceleration as distinct from code quantity, agent usage and subjective productivity. Human direction, validation and resource bottlenecks can absorb gains in a single activity. |
| R3; September 13 | Retain Amodei's assessment as attributed judgment. The map includes human-assisted feedback; it does not define RSI as necessarily human-free. Repeated, independently measured feedback strength is distinct from partial developer evidence or a fully autonomous successor. |
| R4; September 13 | Retain measured improvements on bounded safety tasks and the need for independent checking. Hidden evaluations and transfer tests provide supporting evidence; narrow benchmarks and untested persistence after further training limit it. |
| ASI-C3; September 13 | Retain a possible influence, not a sufficient cause of control failure. Improved monitors, permissions and containment are countervailing conditions. The referenced technical framework analyzes possible future systems, not an ASI experiment. |
| R1-R2; September 13 | Retain the whole-process bottleneck condition. The already incorporated September 17 software result does not supply an aggregate AI-development speedup. Public discovery trends also differ across domains. |
| R2-R3; September 13 | Retain the requirement that an improved system usefully contributes to subsequent development. One generation or more experiments is insufficient to establish a sustained feedback effect. |
| R3-R2; September 13 | Retain the feedback edge and resource/verification constraints. A loop can exist without unlimited acceleration; neither delay nor unconstrained acceleration is assumed. |

### Primary passages used

- [Anthropic's September 10 physical-software evaluation](https://www.anthropic.com/research/intelligence-targeting-conventional-weapons-capabilities), software-evaluation setting, cross-model summary and Conclusion: offline model-only simulation with fixed trial budgets, no physical hardware or direct human-uplift comparison. The text explicitly states no internet access, so the existing setting is retained. Its classifier announcement supplies no measured prevention rate.
- [September threat report](https://www.anthropic.com/threat-intelligence-report-september-2026), conventional-weapons case summary and biological dual-use/conclusion sections: selected activity, apparently failed field testing, and limits on interpreting intent or imminent biological harm. Both restricted-content blocking and gaps in dual-use detection remain relevant.
- [Gemini 3.7 Flash](https://deepmind.google/models/model-cards/gemini-3-7-flash/), Frontier Safety Assessment: developer assessment, expert steering, web comparison and threshold qualifications. [Gemini 3.8 Flash](https://deepmind.google/models/model-cards/gemini-3-8-flash/), same section, inherits the developer's assessment rather than supplying an independent repeat of every experiment. Neither is a ceiling for other models.
- [Amodei's September essay](https://darioamodei.com/post/we-must-pace-the-frontier), opening, Why Pace?, Embedded Evaluators and coordination sections: attributed judgments and proposed arrangements. A commitment to external review is not evidence that reviewers have begun work or that an agreement has reduced risk.
- [Anthropic's internal-development analysis](https://www.anthropic.com/institute/recursive-self-improvement), internal evidence and future-work discussion: code records, the March survey and continuing human judgments. Preserve the scope of the existing figures; quantity and subjective counterfactuals do not isolate causal productivity.
- [OpenAI's September 6 workflow report](https://openai.com/index/research-acceleration-view-inside-openai/), sections 1–3 and methods: increased work and experimentation retain human direction and intervention. [METR's discovery analysis](https://metr.org/notes/2026-08-14-llm-contribution-to-discoveries/), Overview and data note, gives domain-dependent public trends and acknowledges data uncertainty. [METR time horizons](https://metr.org/time-horizons/) remains a task-difficulty measure, not whole-laboratory throughput.
- [AISI's July incident, reported August 4](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing), setting, discovery, human-review and lessons sections: intentionally permissive tests, human intervention and roughly one-hour containment. [DeepMind's control roadmap explanation](https://deepmind.google/blog/securing-the-future-of-ai-agents/), Understanding AI Control and Scaling security, separates coverage, recall and response delay; high-impact irreversible operations motivate prevention before execution.
- [Anthropic's August 28 alignment research](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures) and [the authors' detailed write-up](https://alignment.anthropic.com/2026/automated-alignment-researchers/), evaluation design, production-model trial and limitations: retain the Opus 4.8/Sonnet 5 scope and withheld-test qualifications. The study did not test durability through extensive subsequent RL, and the human comparison had unequal iteration opportunities. [AI Control](https://arxiv.org/abs/2312.06942), abstract and version history, retains its older GPT-4/GPT-3.5 programming setting. These are positive defensive results with bounded applicability.
- [Technical AGI safety framework](https://arxiv.org/html/2504.01849v1), sections 6.8.2–6.8.3: different safety arguments and monitoring assumptions for more capable systems. This remains conceptual support for ASI-C3, not observed future harm.

## Daily scan and corrections

Checked all daily watchlist entry points, then followed relevant primary documents rather than relying on search summaries:

| Entry points | Result relevant to this proposal |
| --- | --- |
| METR [research](https://metr.org/research/), [notes](https://metr.org/notes/), [blog](https://metr.org/blog/), [time horizons](https://metr.org/time-horizons/) | Latest listed dates remain August 26, August 14, August 31 and May 8 respectively. No new in-window item requiring another map change was identified. Older material above was read because the corresponding entries were due. |
| [AISI blog](https://www.aisi.gov.uk/blog) | Latest listed research remains August 27. Retained the incident's successful containment and announced improvements without treating future monitoring plans as measured prevention. |
| OpenAI [research](https://openai.com/research/index/), [safety](https://openai.com/safety/), [deployment safety](https://deploymentsafety.openai.com/), [incident disclosures](https://alignment.openai.com/misalignment-reports/) | Existing September research and September 16 disclosures are already covered. The other four case reports still show September 16 update dates; no newly visible correction requiring a further incident addition was identified. This is not a byte-for-byte historical diff of every source. |
| Anthropic [research](https://www.anthropic.com/research), [alignment](https://alignment.anthropic.com/), [threat intelligence](https://www.anthropic.com/threat-intelligence) | The September 17 biomolecular result, September 10 simulation and September 9 incident assessment are already present. Targeted safeguards searches identified the September 17 access program, which is the new addition. |
| DeepMind [model cards](https://deepmind.google/models/model-cards/), [news](https://deepmind.google/blog/) | The September 15 Audio card and September 2 Flash card were already considered in prior reviews. A release listing is not adopted as a new physical-harm or RSI measurement. |

Targeted searches included defenses, corrections and replication, with primary organizations as the fact-checking source. No independent evaluation establishing this new program's effectiveness, or overturning the retained interpretations, was verified. That search boundary is not evidence that contrary results do not exist.

## Dependency and language review

Read the affected Japanese and English tour/standalone passages and neighboring M2/M2b/M2b1/M2b2/M3, C3a/C3b/L and R1/R2/R3/R4 explanations. The misuse route still separates intent, usable assistance, physical prerequisites and failed defenses; M3-H additionally requires broad damage and inadequate recovery. The research and control routes preserve their conditional and parallel relationships. News summaries and the R4 safeguard remain compatible and do not inherit a policy announcement as evidence of success.

The generated record covers 41 changed/dependent units. It is an editorial review, not independent expert approval. Existing source dates, historical records and translations by stable ID are retained. No UI or graph-layout code changes are proposed.

## Validation

- `npm run check`: passed all 81 tests, content and translation checks, reviewed-fingerprint checks, TypeScript and lint. The content contains 76 nodes, 41 connections and 57 sources.
- `npm run build`: passed; static export and all 11 entry-point assets validated. Localhost permission was supplied for the prerender process.
- `npm run review:reading`: generated both editions, each with 119 tour stops, 76 standalone nodes and 41 connection explanations. Inspected the affected passages in their reading context as described above.
- `npm run check:freshness`: on September 20 JST, zero entries remain due; two reach their review date within two days. This is a date check, not scientific validation.
- Semantic comparison against the base commit: only the six node, four connection and five evidence-summary review dates advance. Existing sources and research records, graph topology, status/evidence levels, safeguards and unrelated translations are unchanged. Earlier history entries and their English translations are preserved by stable ID.
- `git diff --check`: passed. No UI code changed; no new browser interaction or device-layout testing was performed for this content-only proposal.

The checks validate package consistency and regressions; they do not establish the scientific correctness or effectiveness of the reported program. This review remains a draft proposal and has not been deployed.

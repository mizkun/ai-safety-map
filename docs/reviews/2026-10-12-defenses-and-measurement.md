# October 12 daily and Monday review

## Scope and provenance

- Daily window: September 28–October 12, 2026. Monday coverage includes weekly watchlist sources and July–September omissions, with an earlier February preprint distinguished from its July proceedings publication.
- Read the maintenance, editorial, Japanese-writing and logic-review policies, source and research inventories, prior October records and open Draft PR [#11](https://github.com/mizkun/ai-safety-map/pull/11). Deduplicated by URL, claim and prior decision. Material embedded in sources was treated as data, not instructions.
- Fetched `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`. The existing draft branch, initially `e202ac86da84ae522f9a45b878c08cd5218758a2`, already contains that base. Continued in `/private/tmp/ai-safety-map-review-20261010`; preserved the user's clean main checkout at `0ec102b1788c10763bd864cd24832f678b67f928`.
- Freshness before the update: **zero due items**, five due within two days. This is substantive new-source/backfill work, not a bulk date refresh. Only the five edited node review dates and the two affected explicit evidence entries advance. Existing source dates, connection dates and route dates are retained.
- Add five sources and five evaluation cards; update `M3`, `C3a3`, `C3b`, `A3` and `R3` in both languages. Evidence categories, graph topology and conditions remain unchanged. No automatic merge or deployment.

## Adopted evidence and boundaries

### Cyber access settings

Original: Anthropic, [Expanding the Cyber Verification Program](https://www.anthropic.com/news/cyber-verification-program), published **October 6**. Read the access tiers, safeguard-evaluation section and qualifications on partner reports; visually checked the tier diagram. Individual experiment dates are unspecified.

The developer evaluated **Opus 5.5** on ten CyScenarioBench challenges with five attempts each. General access blocked all fifty initial prompts. Defense access blocked 46 attempts during the challenge; the other four succeeded. Red Team access blocked none and succeeded in 34 of fifty. These are fifty attempts per evaluated configuration, not fifty unique challenges or malicious real-world users. The separate **67.6% no-safeguards comparison** is not another fifty-attempt Specialized Access sample.

Application review and different classifier settings affect permitted actions. The same model's underlying capabilities do not imply the same actions are available under all access tiers. Ordinary defensive coding remains available; this is not a claim all cyber assistance is disabled. Humans define the policies, vet applicants and operate the program. The developer's challenge evaluation is not independent replication, unknown-attack coverage or measured harm reduction.

Partner vulnerability totals are heterogeneous, incompletely reported and overlapping in time. They were **not** adopted as new independent discoveries, patch adoption or avoided harm. Future controls announced for later rollout are not treated as proven active defenses.

**Before/after:** `M3` already distinguished intrusions, account disruption and vulnerability fixes. It now includes measured blocking under different access settings. `research:cyber-access-blocking` and `source:anthropic-cyber-verification` preserve model, attempts and limits. `M3-H` remains conditional on actual useful misuse, failed defenses and broad uncontained harm; capability alone does not satisfy it.

### Haiku monitoring evaluation

Original: [Claude Haiku 5.5 System Card](https://www.anthropic.com/claude-haiku-5-5-system-card), cover dated **October 7**. Read the executive and evaluation caveats, relevant safety-method discussion, **6.4.2.1 LinuxArena (pp. 87–89)** and **6.4.2.2 SHADE-Arena (pp. 89–90)**. Visually inspected the plots and notes on pages 88 and 90. This review does not claim a full audit of every section of the card. Experiment dates are unspecified.

In LinuxArena, Haiku 5.5 is explicitly asked to complete a legitimate task and a harmful side task while evading an **Opus 4.8** monitor. Joint completion without being flagged is approximately **5.9% with hidden reasoning**, versus **0.1% with reasoning visible**. The metric includes the ability and willingness to complete both tasks; it is not the monitor's detection accuracy conditional on an attack. Haiku has **one attempt per task pair**, compared with five for other models. The best attack prompts are selected through search, and later prompt search changes some older-model results.

SHADE uses **24 task pairs, at least 25 attempts each**. Its Haiku runs retain **API safety interventions**; early stops count as unsuccessful attacks. This differs from a safeguard-free capability test and from some comparison settings. Refusal, task ability, reasoning visibility and blocking cannot be collapsed into one causal monitoring effect. The card also notes limited internal use and omitted labor-intensive evaluations. Low evasion on this model does not establish that all monitors or more capable agents are safe.

**Before/after:** `C3a3` already described monitoring weaknesses and repairs. It now adds a favorable result with its denominator and refusal/blocking qualifications, via `haiku55-monitorability`. The `tested` evidence level remains unchanged. The result does not establish a deployment prevention rate or justify a safety clearance.

### Structural monitoring and rollback

Original: Ravindra, Tiwari and Wolowski, [Democratizing Agent Deployment Safety: A Structural Monitoring Approach](https://arxiv.org/html/2607.14570v1). First posted **July 16**, accepted at the ICML **AI4GOOD and AIWILD workshops**, distinct from the main conference. Read sections 3–5, result captions and **Appendix A**, with the excluded attack population. Experiment dates are unspecified.

The authors use ControlArena's `iac_fast` infrastructure-code setting and **Opus 4.1** for instructed sabotage. The monitor sees a structural representation of infrastructure changes plus raw differences. The structural extraction is deterministic, but the final suspicion judgment uses an LLM; it is not intrinsically immune to adversarial text. Humans define tasks, prompts, the pipeline and the threshold, calibrated on **100 honest episodes** at a 1% false-positive budget.

- The post-hoc evaluation uses **Sonnet 3.7**. Among 160 retained attack episodes, 86 complete both tasks. Structural monitoring misses 3/86; diff-only misses 10/86; a trained comparison ensemble misses 0/86. Finite samples and a trained comparator matter.
- The synchronous rollback experiment uses **Haiku 4.5**. Unstopped joint completion is **119/160** without intervention, **0/160** with structural rollback, and **9/160** with diff-only rollback. Honest-task completion is 82/100, 81/100 and 87/100 respectively. Different attack-prompt distributions and monitor models prevent attributing every difference between the post-hoc and synchronous experiments solely to intervention timing.
- **Excluded scope:** the original post-hoc set contains 180 episodes. Twenty attacks on pre-built artifacts outside the analyzed source surface are removed; **17 succeed, and all receive the structural monitor's minimum suspicion score**. Those observations must not be silently combined with the synchronous denominator. The headline zero is explicitly in-scope. Artifact integrity requires a complementary control that the paper does not evaluate.

**Before/after:** `C3a3` gains a concrete rollback improvement and its uncovered-operation counterexample through `structural-monitor-rollback`. No claim of universal prevention, spontaneous deployment sabotage or independently replicated product performance is made.

### Incident response and recoverability

Original: Xiao, Sun and Chen, [AIR: Improving Agent Safety through Incident Response](https://proceedings.mlr.press/v306/xiao26n.html), ICML 2026 proceedings, **July 6–11**. The [preprint](https://arxiv.org/abs/2602.11749) first appeared **February 12** and was revised **June 20**. These dates are not experiment dates, which are unspecified. Read sections 3–5, Tables 1–7 and Appendix B; visually checked page 8, including the overhead and generated-rule comparisons.

The authors test GPT-5-based code, simulated embodied and browser agents, with **750, 250 and 210 risky tasks** respectively. The exact GPT-5 snapshot is unspecified. Humans author the main response rules and judge response outcomes. A separate generated-rule experiment provides GPT-5 with examples and tasks; it is not autonomous creation of a complete safety policy from nothing.

AIR checks after tool actions, guides containment/recovery, then creates checks before future actions. Reported rates use conditional populations such as actually executed hazards or detected incidents; refusals and inability to execute are not failed recoveries. Some disclosures, reads and deletions have remediation marked inapplicable. Preventing repetition does not undo the first irreversible consequence. Generated rules produce lower results in some conditions, so the abstract's greater-than-90% wording is not applied to all settings.

Safe-task timing rises from **27.442 to 39.610 seconds** in the embodied setting and **64.766 to 90.602 seconds** in the browser setting. Small safe-task samples and low task-completion counts do not prove zero utility cost. Laboratory response times must not be compared directly with real organizational incident-resolution times.

**Before/after:** `C3b` now includes bounded post-action response assistance, alongside the remaining need to stop irreversible operations beforehand. `A3` gains a recovery example whose functioning agents/tools are explicit prerequisites. The study does not test uncooperative recovery agents, simultaneous loss of power/communications, or recovery from a society-wide cascade. `C3b` remains `indirect`; no color upgrade is inferred from a mitigation benchmark. `A2-A3` and `A3-H` retain their independent-recovery and broad/persistent-harm conditions.

### Measurement criticism of self-training

Original: Xu et al., [Phantom Gains: Auditing Self-Improvement Against a Measured Null](https://arxiv.org/html/2608.20290v1), preprint first posted **August 20**. Read sections 3–6, Table 2 and the scope/reproducibility discussion. This is an author-run measurement audit, not a verified independent replication of frontier-lab RSI claims.

The study uses **Qwen3-8B**, three rank-32 LoRA fine-tuning rounds and human-specified mathematics tasks, procedures and grading. It compares self-training with an unchanged model passed through the same measurement pipeline, and with learning from **gpt-oss-120b**. Repeated decoding, batching and statistical thresholds can create apparent gains even without training. The controlled comparison favors the external teacher on rarely solved problems; the ten problems never reached by the pooled baseline do **not** establish a significant expansion difference.

The regime is short, uses one model family and selected mathematics sets. A majority-vote supervised arm is not identical to the published reinforcement-learning method; the separate policy-gradient arm has truncation/collapse qualifications. This update does not adopt a general claim that self-training never helps, causes safety erosion, or makes RSI impossible. Models learning from their own answers and a broader human-inclusive development feedback loop are different scopes.

**Before/after:** `R3` now explains why measured improvement needs an unchanged comparison and enough repetitions. Its existing discussion already separates developer judgments, partial workflow gains and sustained multi-generation effects. `R2-R3` and `R3-R2` therefore keep their conditions. `self-training-null-audit` makes the criticism available without replacing frontier observations with a small-model capability ceiling.

## Daily coverage, corrections and duplicates

| Starting points | Inspection and disposition |
| --- | --- |
| METR research, notes, blog and time-horizon pages | Latest relevant October 6 review-screen report and September evaluation material already covered. The September 27 monitor original was accessible today after October 11's 503; inspected its setup/results for corrections, without treating restored access as a new experiment or refreshing its source date. |
| AISI blog | Transect and October 1 evaluation-security work are already covered. July external monitor tests were added in the October 5 review. No new corrective result adopted. |
| OpenAI safety, research, deployment-safety, alignment and incident indexes | Compared the report/update listings and existing October 9 cases. No later explicit correction requiring a new change was verified in the inspected material. The prior fifteen-report inventory is not fifteen independent replications. |
| Anthropic research, alignment, threat intelligence and CVD | October 8–9 OSS/incident material is already covered. CVD retains the October 2 19:47 snapshot. The newly inspected news and system-card indexes revealed the October 6 access program and October 7 Haiku card above; both indexes are added to the daily watchlist. |
| [Anthropic Cyber Mission](https://www.anthropic.com/news/anthropic-cyber-mission), October 8 | Read the program rationale and critical-infrastructure plan. Funding, partnerships and embedded engineers are not a measured reduction in incidents. The report itself distinguishes finding weaknesses from practical repair. Existing `M3` distinctions cover this; no additional promotional evidence card or vulnerability-count claim. |
| [Anthropic usage-policy update](https://www.anthropic.com/news/2026-usage-policy-update), October 8 | Read the descriptions of changed/clarified requirements. Policy wording and required human control are not measured enforcement or prevention. No legal interpretation or empirical effectiveness claim adopted. |
| DeepMind blog and model-card index | October 6 model-card material was already screened in the October 7 record; September SynthID Bio is already covered. No new correction adopted. |

Targeted primary-source searches also sought replication, objections and defense improvements. No independent replication of the five adopted evaluations was verified. This is a bounded search finding, not proof that none exists.

## Monday weekly and backfill coverage

| Source | Disposition |
| --- | --- |
| International AI Safety Report publications | Latest index entry remains the February annual report. Synthesis used for leads, not a substitute for primary experiments. |
| SIPRI military/security index and [August 12 UN-exchange report](https://www.sipri.org/news/2026/sipri-experts-contribute-un-exchanges-ai-military-domain) | The report concerns June 15–17 discussions, lifecycle governance and procurement. It does not measure escalation, reliable human intervention or reduced harm. September dialogue was already screened on October 5; October quantum-export/WMD-course listings do not supply a new AI causal result. |
| ILO publication index and [September 15 SABY pilot](https://www.ilo.org/resource/article/ai-business-adviser-your-pocket-what-we-are-learning-ilo%E2%80%99s-saby-pilot) | Read the pilot report. July usage and selected assisted-business examples include human judgment/correction; not representative employment displacement, autonomous profit or proof of retained skills. September enterprise interviews were already considered. No new population-level claim. |
| IMF publication index | The regional AI-potential candidate's full page could not be retrieved. A search snippet has a different date from its September 29 URL; neither is resolved by inventing a publication date. No substantive factual addition or review-date refresh relies on that candidate. Earlier financial-cybersecurity and payments material remains covered by October 5. |
| [BIS, Payments in the age of AI agents](https://www.bis.org/speeches/20261005-payments-age-ai-agents) | Read the main discussion of authorization, limits and payment roles. Page and event dates differ; prospective delegated payment controls are not completed autonomous volume or net profit (`I1`, `I1b`). |
| [BIS, Where AI risks meet](https://www.bis.org/speeches/20261007-where-ai-risks-meet) and FSB index | Read the BIS introductory risk discussion; index/event dates differ, and quoted survey figures were not independently traced. FSB recent resilience and AI listings were screened, not treated as fresh original performance measurements. No promotion of speeches or policy priorities to observed `F1–F3` failure. |
| Visa Intelligent Commerce | Original product description includes prospective/variable features. Authorization mechanisms do not establish adoption volume, profit or defense success. |
| [Young adults' perceptions of AI dependence](https://arxiv.org/abs/2608.07592), August 5 / September 21 revision | Original abstract and metadata screening only. Questionnaire perceptions and reported atrophy do not directly measure loss of institutional alternatives or decision authority (`D2`, `D3`). No causal skill-loss claim adopted. |
| [Healthcare-workflow resilience study](https://arxiv.org/abs/2609.10724) | Original abstract screening: simulated trajectories and workload/role adaptation do not establish real clinical outcomes or institution-wide recovery. No empirical claim added. |
| Author papers / arXiv / PMLR | IFG, AIR and Phantom Gains received substantive original-method/result review above. Other abstract-only candidates remain screening leads. No result is adopted solely from a search summary or AI research report. |

## Dependency and bilingual review

Read the five changed explanations and the new source/card fields in Japanese and English. Generated actual tour/detail readings with `review:reading`, then inspected the relevant control, misuse, accident and acceleration contexts. The comparison terms are introduced locally: an unchanged model for measurement, who oversees whose actions, and tools needed for recovery. No new glossary term is needed.

Reviewed fixed dependent connections `M3-H`, `R2-R3`, `R3-R2`, `A2-A3` and `A3-H`. A model blocked in a benchmark is a counterexample to capability implying unrestricted action; an in-scope rollback result does not close unmonitored paths; a functioning local recovery tool does not establish or refute society-wide recoverability; a small self-training study does not rule out the map's broader development loop. These preserve the existing conditional, joint and feedback relations.

Reviewed the affected six graph definitions, three routes, two current-focus entries, four stories and research-contribution reading example. Existing text remains compatible. In particular, `C3a` and `C3b` are alternatives, while intent, capability/access and failed safeguards must coincide for an unwanted action. None of the separate experiments demonstrates the whole AND path or extinction. Existing summaries and dates are not rewritten merely to match the new source date.

The JSON companion records **42 units across seven assessments**, including the watchlist change and content metadata. Fingerprints record editorial review, not scientific certification. All 33 previous English history entries are preserved by stable ID.

## Validation

- `npm run check`: passed, including **81 tests**, content/locale validation, version-matched dependency review, TypeScript and lint. Inventory: **76 nodes, 41 edges, 104 sources and 105 research cards**.
- `npm run build`: passed; static export and **11 entry-point assets** validated. Local prerendering used permitted localhost access.
- `npm run review:reading`: generated both editions with **119 tour stops, 76 nodes and 41 connections** each. Changed fields and their relevant contexts were read; generation itself is not the editorial review.
- `npm run check:freshness -- --date=2026-10-12`: **zero due items**, four within two days after the update. This only measures dates on the draft, not scientific correctness or freshness of undeployed main.
- `git diff --check`: passed. A stable-ID comparison preserves all **33** previous English history entries. Automated comparisons confirm unchanged evidence levels and unchanged graph definitions, connections, connection dates and route definitions.
- No browser layout, physical-device or public-production verification is claimed for this content-only draft update.

The proposal remains a draft for human review. Automated checks establish consistency, not independent scientific approval.

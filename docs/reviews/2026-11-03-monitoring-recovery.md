# Internal-signal monitoring, recovery and complete workflows — 2026-11-03

## Scope and decision

Tuesday daily review, covering October 20–November 3 JST and items reaching their review deadline. The Monday weekly pass was recorded on November 2; this is not another full weekly or recent-month survey. All 19 daily watchlist starting URLs were opened and compared with the source registry, prior review records and draft PR #11. Targeted searches included defenses, recovery, criticism, replication and corrections. Search summaries were leads, not evidence for adopted claims. Instructions embedded in retrieved material were not executed.

The original checkout was clean at `0ec102b1788c10763bd864cd24832f678b67f928` and remains untouched. The isolated draft checkout started at `58b44a50a6375637794b11ef713c738c6fed0e45`. Fetched `origin/main` was `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of the draft. The only open PR was draft #11, with no outstanding comments. Update that PR rather than opening another; do not merge or deploy.

Add three original studies to **C3a** and **C2a**, in Japanese and English. The previous explanation covered text/action monitoring and contract, code and other task evaluations. The additions describe internal-signal monitoring, distinguish local error recovery from final completion, and explain digit-reading and repeatability failures after document retrieval. There is measured progress as well as remaining failure. No risk color or graph connection changes.

## Adopted originals

### Internal-signal monitoring — C3a

[OpenAI, Training activation classifiers for safety and alignment](https://alignment.openai.com/training-activation-classifiers/), Alex Makelov and coauthors, November 2. Read the introduction, training/model-selection/evaluation, deployment and empirical-properties sections. This is the developer's methods/evaluation report, not independent replication. Experiment dates and individual evaluation model versions are not specified. Deployment reportedly started with GPT-5.6; November 2 is not inferred to be the deployment date.

The classifier reads internal residual signals during generation. A threshold triggers interruption, and tools remain held pending another reasoning model's safety judgment. It is not necessarily a human approval. Training uses reasoning-model labels over synthetic and other data, up to a million messages; multiple seeds/configurations use validation selection and held-out evaluation. The reported resistance to tested attacks is greater than text-classifier monitoring, with transfer across many post-training stages. The most robust result is not an attack optimized specifically against the probe, so adaptive-attack coverage remains material.

The report warns that its figures need not represent deployed classifiers. The technique targets known, trainable behaviors; novel problems, new pretraining bases and changing weights limit transfer. Escalation rate is not a false-positive rate. There is no independently measured operational harm-reduction rate. Record the defensive improvement without interpreting it as solved oversight or a complete safety guarantee. C3a remains limited/tested; its prior October 28 review date is preserved because this is a scoped addition rather than a full renewal of all its references.

### Local recovery versus completion — C2a

[When to Intervene? An Empirical Study of Errors and Self-Recovery in LLM Agents, v1](https://arxiv.org/html/2610.36471v1), Chiming Duan and coauthors, October 27. Read sections 3.1–3.3 and 4.1–4.4, Tables 1–2 and Figure 7. Original preprint analysis of existing records, not a production-incident sample.

There are 1,259 traces and 1,403 annotated errors, including 986 OSWorld traces over 358 tasks with Claude 3.7 Sonnet, Sonnet 4.5 and Kimi K2.5, and 273 Web traces using SeeAct with GPT-5-2025-08-07. Web runs are from August 13, 2025; desktop run dates are unspecified. Researchers use AI-generated initial annotations, then three experts verify them. Agreement/verification does not make them blind to the initial labels.

725 errors recover. Among the 280 error-bearing traces recovering all annotated errors, task completion is still only 60%. Error counts, trace counts and whole-task outcomes are different denominators. These observational associations do not isolate recovery's causal effect.

ReCoF combines GLM-5.3-Flash assessments with frozen encoders and a fusion predictor. Task-disjoint train/validation/test sets contain 559/228/238 examples; five fusion seeds do not vary the frozen encoders or underlying LLM assessments. Prediction improves in the experiment, but the predicted interventions are not executed. Do not claim a measured benefit from intervening at the predicted point, and do not treat older traces as the latest capability ceiling.

### Scanned-document workflows — C2a

[TreasuryQA Bench: Can AI Agents Work an Archive of Scanned Financial Records?, v1](https://arxiv.org/html/2610.38924v1), Ritiz Tambi and coauthors, October 28. Read sections 3–7, Table 2, Appendix D and the reproducibility statement. Authors are affiliated with environment provider Veris AI and release the work with reader provider Reducto; preserve that developer role.

The benchmark uses 1,435 scanned Treasury publications from 1793–2024, with 70 numeric questions, including 55 new and 15 adapted questions. Ten model–harness pairs make three attempts per task, up to 30 minutes each: 2,100 attempts, not 2,100 distinct questions. Opus 5.5/Claude Code and Gemini 4 Argon/Gemini CLI are among the pairs. An artificial Dropbox environment exposes search/reading tools; Web search is disabled but shell networking is available. Reader calls occur October 3–21. Humans review questions and keys; pilots lead to some wording changes and three improved images. The dataset is therefore not described as an untouched blind evaluation.

The grader checks numeric ranges and reclassifies 13 initially passing, outside-source answers as failures. Opus has 64.8% pass@1 over attempts, 81.4% of tasks correct at least once and 45.7% correct all three times. These are not interchangeable. Adjacent rankings are not significant after Holm correction. Retrieval can succeed while digit reading fails.

The reader is not version-pinned, most tasks are private, there is no human baseline and model/harness effects are confounded. Financial source documents do not establish financial transactions, whole-job autonomy or F4 systemic financial failure. C2a is the appropriate node; no new finance claim follows.

## Six due items: substantive review with classification retained

Before edits, `check:freshness --date=2026-11-03` reported four due nodes and two due edges. The following rereading supports retaining their explanations. A check of headlines or the build alone is not the basis for renewal.

| Fixed IDs renewed | Original material and substantive finding | Retained interpretation |
| --- | --- | --- |
| **C2a** | [METR horizons/FAQ](https://metr.org/time-horizons/); [Ironclad](https://openai.com/index/advancing-computer-use-with-ironclad/); [low-resource code](https://openai.com/index/low-resource-programming-languages/); [formalization](https://www.anthropic.com/research/formalizing-fermats-last-theorem); [ReTerm v2](https://arxiv.org/html/2610.18484v2), plus the two new workflow studies. Human task time differs from unattended agent runtime. Ironclad's 11 prepared tasks and estimated savings do not measure customer outcomes. Formalization uses human direction/scaffolding. ReTerm improves bounded tasks but non-tool error recovery remains weak. | Limited/tested task completion; permissions and intent remain separate. Renew node and matching evidence date. |
| **R3**, **R2-R3**, **R3-R2** | [MASS v1](https://arxiv.org/html/2610.12176v1), [public README](https://github.com/SakanaAI/mass/blob/main/README.md), [Phantom Gains v1](https://arxiv.org/html/2608.20290v1), [Anthropic RSI](https://www.anthropic.com/institute/recursive-self-improvement), [Amodei](https://darioamodei.com/post/we-must-pace-the-frontier), [October GPT-6 safety card](https://deploymentsafety.openai.com/gpt-6-october). Two bounded MASS cycles have mixed external transfer. Unchanged-model controls challenge naive improvement metrics. Developer thresholds and interpretive essays are not independent proof of absence or presence of sustained RSI. | Limited/tested R3; conditional forward edge and feedback return. Renew these three clocks and the matching R3 evidence date. |
| **W2** | [Recova v1](https://arxiv.org/html/2610.01178v1), [robot-work analysis](https://www.anthropic.com/research/what-work-can-robots-do), [Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/). Four prepared physical tasks improve with human-corrected training and recovery. Demos, digital twins and unresolved takeovers remain; task-feasibility estimates are not observed employment replacement. | Limited/indirect physical-work evidence; technical capability, cost and adoption stay separate. Renew node and evidence date. |
| **F4** | [FSB final report](https://www.fsb.org/uploads/P151026-1.pdf), sections 3.7 and 3.9; [BIS FSI paper](https://www.bis.org/publications/fsi-paper-28-when-machines-attack-frontier-ai-cyber-threats-and-policy-responses-financial-sector.pdf), response/recovery and dependencies. Original recommendations describe stopping, fallback, continuity and provider risk; they do not measure complete systemic failure or mitigation effectiveness. | Hypothesis requiring failed buffers/recovery alongside F1 and F2. Renew only F4's clock. |

MASS details retained: paper Table 7 uses 12 tasks times five trials, while the current repository README still says 107 times three and differs in its training/test split description. The README blob inspected was `34d5e4241f3c17d6960ad18a8e14a377e2b5559b`. Delivered outputs rise from 31/60 to 50/60; among-delivered mean quality changes from 3.07 to 2.88, but the compared subsets are unmatched. External Terminal-Bench and SWE-bench scores fall. Per-output-token efficiency is not total resource/time efficiency. Do not resolve reconstruction differences by guessing; no author code was executed.

Recova details retained: human-corrected training raises the average from 23.8% to 77.5%, and adding recovery reaches 87.5%; attributing the whole increase to recovery would be wrong. The final 0/7 intervention count is one task/round, while a different 14-minute sequence still has 11% human control. The work-exposure study's 34% feasibility and 0.3% cost-competitive estimates answer different questions and are not actual deployment rates.

Existing source confirmation dates remain unchanged. Four node dates, two edge dates and the three corresponding current-evidence dates advance to November 3. The unchanged neighboring **R0-C2a**, **W1-W4** and **F1-F3** dates, the current money summary date, and all other review clocks are preserved.

## Coverage, corrections and excluded leads

Daily starting points opened: METR research, notes, blog and time horizons; AISI blog; OpenAI safety, research, deployment safety, alignment and misalignment reports; Anthropic alignment, research, threat intelligence, CVD, news, system cards and safeguards; DeepMind model cards and blog. Prior October monitoring, incident, model-card and defensive-filtering material is already in this draft. An updated index/masthead or funding announcement is not a new experiment. The misalignment listing still has 20 reports and three notices; the CVD snapshot retains its previously recorded October 2 timing and report/project/patch denominators.

- [METR's October 22 monitoring audit](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/): read the October 29 update. Most fixes are reported by OpenAI and one remains; this does not supply independent post-fix effectiveness measurements. The draft already reflects that distinction.
- [Rosalind-6 safety addendum](https://deploymentsafety.openai.com/gpt-rosalind-6): the nine known attacks include two excluded all-error/turn-limit attacks, leaving seven in the reported mean. Real-time blocking is disabled for that model-behavior evaluation; monitoring retesting after deployment remains underway. Existing explanation retained.
- [Carbon methods](https://frontier-cs.org/blog/gemini-4-carbon/): methods and scope reread. The score table is an image; today's extraction did not support a fresh numerical recheck. Preserve the November 1 record's 25/48 to 26/48 correction, but do not claim its image count was reverified today.
- MASS v1, Phantom Gains v1, ReTerm v2 and Recova v1 remain the inspected versions. Targeted correction/replication searches did not verify a new independent replication of the three additions or those due-item studies. This bounded search result is not proof that none exists.
- [LifeVal](https://openai.com/index/lifeval/), OpenAI November 2: original report body was inspected, but extraction of the collapsed score table and its associated method/model context was inconsistent. A direct retrieval also returned HTTP 403 and no browser surface was available. No score or model-specific capability claim is adopted; leave this as a candidate requiring reliable method/table inspection. Do not treat a search excerpt as verification or imply the report contains no model identifiers.
- [Bank of Canada staff working paper 2026-40](https://www.bankofcanada.ca/wp-content/uploads/2026/10/swp2026-40.pdf): original methods and limitations read for due F4. Its October 16 update is outside the new-material window. AI-sector equity exposure and tail co-movement do not identify causal AI-adoption effects, credit/funding transmission or operational failures; do not add it as evidence that F4 occurred.
- November 2 oversight additions and previously covered NIST guidance are not duplicated. Recommendations, author scenarios and provider announcements do not become observations of successful mitigation merely because they are recent.

## Dependency and bilingual review

Read changed current sections in both languages through the generated detail/tour exports, plus the R3, W2 and F4 stops. Read parents **C2**, **C3**, **R2** and the neighboring connections. Inspect control/acceleration/work/money routes and stories; ability-access retains AND, oversight retains OR, development-paths retains progress without RSI, and finance-conditions retains joint F1/F2/F4 conditions. Linked research-contribution, agent-behavior and time-horizons news still separate partial research, experimental behavior and human-time task difficulty.

Three source/card pairs are added. Source dates, experimental periods, evaluator roles, permissions, methods, results and limitations agree across Japanese/English. Current evidence lists receive their relevant references; evidence levels and summaries remain valid. No glossary addition is needed because the prose explains the added concepts. History entry `monitoring-recovery-20261103` records before/after and why. Map `asOf` advances for this scoped update, not a fresh audit of the whole inventory.

The structured companion records 43 changed/dependent units in eight reasoned assessments. Review is incremental for the new C3a passage and substantive for the six due items; it is not independent replication. All 41 edge IDs and graph topology remain unchanged. No extrapolation to permanent control loss, global harm or extinction probability is made.

## Validation

- `npm run check`: passed, including all 81 tests, version-matched review coverage, bilingual checks, TypeScript and lint.
- `npm run build`: passed; GitHub Pages preparation checked 11 entry-point assets. This prepares artifacts without deploying them.
- `npm run review:reading`: each edition exports 119 tour stops, 76 nodes and 41 connections. The relevant actual passages were read as described above; generation alone is not editorial approval.
- `npm run check:freshness -- --date=2026-11-03`: six due items before substantive review, zero afterward, three within two days. These are dates on the draft branch, not a claim that undeployed main is current.
- `git diff --check` and preservation assertions passed. All 163 prior sources, 167 prior research cards, 52 history entries and 312 history translations are preserved. Only the two existing C2a/C3a current-section translation fields are extended. Exactly four node, two edge and three corresponding evidence dates advance; other dates, all classifications and topology remain unchanged.
- The draft now has 166 sources, 170 research cards and 53 history entries. No browser-layout, physical-device or production test is claimed for this content-only update.

Generating a reading export or computing freshness alone does not establish scientific validity. The original checkout remains unchanged. This is a draft for human review, with no automatic merge or deployment.

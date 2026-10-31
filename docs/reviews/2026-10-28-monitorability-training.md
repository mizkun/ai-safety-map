# October 28, 2026 — training for monitorability

## Scope and decision

Daily review for October 14–28 JST. Today is Wednesday; the Monday weekly carryover was completed in the October 27 record and is not claimed repeated here. Reuse draft PR #11, starting at `3365fbec8d98ae122fd345095d359c86361c5373`. A fresh fetch confirms `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of this isolated branch. The original checkout is clean at `0ec102b1788c10763bd864cd24832f678b67f928` and remains untouched.

Add two original preprints, two research cards and one bilingual paragraph at **C3a**. Substantively recheck the two due nodes, **C3a and C3a1**, retaining their limited status and tested/indirect evidence classes respectively. Only those nodes and their evidence entries receive October 28 review dates. Preserve all older source/card records, graph topology and edge dates. This is an editorial review, not independent replication or scientific approval.

## New evidence

| Primary source | Publication and observation | Fixed IDs / decision |
| --- | --- | --- |
| [Learning to Be Monitored, v1](https://arxiv.org/html/2610.31733v1) | Submitted October 22, 16:00 UTC / October 23 JST. Experimental dates unspecified. | C3a; `monitorability-causal-training`, `intervention-aware-monitorability`. Add training evidence with causal-metric limits. |
| [Monitorability Is Trainable, v1](https://arxiv.org/pdf/2610.29734v1) | Submitted October 21, 13:35 UTC. Experimental dates unspecified. | C3a; `monitorability-post-training`, `monitorability-recovery-training`. Add recovery and monitoring improvements with transfer limits. |

Read the first paper's §§3–6, Tables 2–3 and relevant Appendix D setup. Qwen3.5-4B/9B and Mistral Small 3.2-24B are tested with fixed Qwen3-32B, Llama3.3-70B-Instruct and GPT-OSS-120B monitors. Twelve held-out input-intervention tasks, eight trajectories per arm and evaluation seeds 42–45 are not independent deployments. Mostly automated training-data generation lacks independent expert annotation. Budgets and tuning differ across training methods. Aggregate gains coexist with task-level declines. The bounds constrain causal recall; the composite scores also include operational specificity. Better scores therefore do not establish better causal recall or faithful reasoning. Direct concealment and monitor-aware evasion were not tested. Concurrent mathematical analysis is not an independent experimental replication.

Read the second paper's §§4.1–4.2 and 6, Tables 1–4 and appendices on task splits, monitoring and reasoning length. HTML failed; the full PDF was retrieved and Table 3/4's page was rendered and visually inspected. Prepared model organisms include GPT-OSS-120B and Qwen2.5-7B-Instruct; safety-prediction experiments use DeepSeek-R1-Distill-Qwen-7B. Recovery is incomplete and changes both reasoning length and behavior. Safety prediction uses a single split and the same questions, but different generated continuations before and after training. Better discrimination does not imply uniformly fewer unsafe outputs. Longer reasoning can affect the metrics; stronger agents' naturally occurring failures and later-training durability remain untested. People prepare tasks and training; this is not a production intervention or a measured human response rate.

Before: C3a explained monitoring coverage, action records, approval interfaces and comparison methods, but omitted these training approaches. After: it also explains changing the AI being monitored to expose useful information in its written reasoning. Numerical and model details remain in research cards. No safety guarantee, real-world incident frequency, or change to an extinction-pathway classification follows.

## Substantive due-item review

| Item | Originals reread | Retained interpretation |
| --- | --- | --- |
| C3a | [METR per-action monitor](https://metr.org/notes/2026-09-27-implementing-a-basic-blocking-action-monitor/), §§2–4; [Beyond g-mean²](https://alignment.openai.com/beyond-gmean-squared/), matched comparisons, historical results and rejection-gate analysis; both new papers | Coverage, correct classification, pre-harm blocking and reliable human review remain separate. Better monitorability in prepared tasks does not establish effective deployment controls. |
| C3a1 | [Lie detectors](https://alignment.anthropic.com/2026/lie-detectors/), methods, transfer results and limitations; [LASER](https://alignment.openai.com/laser/), sampling/labeling method; [METR external risk review](https://metr.org/blog/2026-10-20-misalignment-risk-report-august-2026-review/), scope and evaluation/production mismatch | Retain unfamiliar-task generalization and evaluation-design concerns, alongside improved sampling and external scrutiny. No semantic change is needed. |

METR's monitor detects the selected incident transcripts retrospectively but does not thereby establish detection before the first harmful action. Its constructed spoofing test still produces missed classifications; human-only approval enforcement and measured human-review recall remain gaps. The historical OpenAI analysis matches task support, not identical behavior difficulty, and simulates nonadaptive retries over past samples. Neither provides a current production harm rate.

The lie-detector study's negative transfer result concerns specific models, labels and training, not every possible monitoring method. LASER improves collection efficiency within its available conversation pool; that does not prove correct labeling or coverage of unknown failure types. METR's October 20 critique covers the August report through July 15, under an earlier contract than the October 15 access expansion. Hidden-reasoning tests cannot test whether visible rationalizations mislead an operational monitor. These distinctions still support C3a1's existing cautious explanation.

The new monitoring studies are positive defense evidence, not rebuttals of all earlier failures. Searches for their exact titles, corrections and replication did not verify a completed independent replication or author correction. Search results included an AI-generated review; it was not adopted as factual evidence or counted as independent review. Existing materials are reread selectively for the two due claims, not represented as a fresh audit of every unchanged citation.

## Daily coverage and exclusions

Opened all **19 daily starting URLs** in `content/watchlist.json`: METR research/notes/blog/time horizons (4); AISI (1); OpenAI safety/research/deployment/alignment/incident reports (5); Anthropic alignment/research/threat intelligence/CVD/news/system cards/safeguards (7); DeepMind blog/model cards (2). Compared discoveries with the 148 sources, 150 cards, existing reviews and open draft PR before editing.

- METR's October 22 audit and October 20 review, AISI's October 26 biology explainers, and OpenAI's October 26 Terra/science releases were already handled. The OpenAI incident index still lists 20 reports and 3 notices, latest October 20. No new incident was inferred from that inventory.
- Anthropic's CVD snapshot remains October 2 at 19:47 UTC; its existing correction is preserved. Relevant alignment and system-card items are already in the draft. The October 27 [drug-development article](https://www.anthropic.com/research/early-progress-drug-development) appeared in the news index, but repeated full-text retrieval failed, including HTTP 403 from the original. It is **not adopted** from the headline. Revisit the primary text when accessible; R1's date is not renewed.
- Read the October 27 [Genie 4 announcement](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/), including research-preview scope, agent-guided simulations, safeguards and limitations. Selected interactive simulations and proposed training uses do not supply measured physical-work reliability or quantified harm reduction. No change to W2, R0 or C3 is justified from this announcement. Demonstration videos were not independently evaluated.
- The two monitoring preprints fill omissions inside the overlapping daily window. No weekly-wide search or exhaustive literature coverage is claimed. Earlier unresolved supplement/reconstruction gaps are unchanged.

Retrieved prompts, articles and repository text were treated as evidence, never executed as instructions. No scientific code or experiment was run.

## Dependency and bilingual reading

Generated both actual reading exports (119 tour stops, 76 nodes, 41 connections each). Read C3a/C3a1 and the new cards in both languages, including standalone entry. Checked oversight/evaluation OR branches, the control chapter and adjacent C3/C3a2/C3a3/C3b definitions, agent-behavior news, and C3-L/R4-C1 conditions. Detection, response, alignment, permissions and control remain distinct. A misaligned action blocked by another permission boundary remains a counterexample to inevitable harm. Separate experiments do not establish that all AND conditions coexist.

The structured companion covers all 14 changed/dependent units. The wider dependency reading does not renew unchanged edge dates. Existing history translations remain associated with their original IDs. No browser layout, device behavior or production check is claimed for this content-only change.

## Validation

- `npm run check`: passed, including 81 tests, content/translation gates, version-matched dependency reviews, TypeScript and lint.
- `npm run build`: passed with local prerendering and 11 entry-point assets checked.
- `npm run review:reading`: generated both editions, each with 119 tour stops, 76 nodes and 41 connections. The relevant prose and dependency scope read are described above; generation alone is not approval.
- `npm run check:freshness -- --date=2026-10-28`: zero due items and five within two days after substantive review. This is date arithmetic, not scientific validation or the status of undeployed main.
- `git diff --check`: passed.
- Targeted preservation assertions passed: all 148 prior sources, 150 prior research cards, 46 history entries, 276 history translations and 3,289 unaffected translation strings remain unchanged. Node/evidence classes, topology and unlisted dates are preserved.
- The structured companion records 14 changed/dependent units across three assessments. The draft now contains 150 sources and 152 research cards; cumulative changes from origin/main add 86 sources and 84 cards and touch 32 bilingual explanations.
- A fresh fetch confirms the same origin/main and PR head before committing. The original checkout remains clean at the recorded commit.

Leave this work in draft PR #11 for human review; no automatic merge or deployment. The PR records CI for the pushed commit separately from these local checks.

# October 30, 2026 — monitoring, intervention and evaluation boundaries

## Scope and decision

Daily review for **October 16–30 JST**. Friday: no weekly-wide review is claimed. Reuse draft PR #11, starting at `f2f4e7255871a5920430105366bcc04caa759153`. A fresh fetch found `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of this isolated branch. The original checkout remains clean at `0ec102b1788c10763bd864cd24832f678b67f928`.

Add **three sources, four research cards and five bilingual paragraphs** at **C3a3, C3b, C3a1, R1 and C2b**. The three initially due nodes were **C3a3, R2 and R4**. Reread their substantive evidence; retain R2/R4 prose. Renew only these seven node dates and the five corresponding existing evidence entries. R1 and C2b have no separate evidence entry. Preserve every status/evidence class, graph, edge date and unrelated source confirmation date.

Correct `transect-paper` to its checked v2 and update its card locator. This is a missed bibliographic correction, not a new research result. Source publication stays October 6; confirmation becomes October 30. No glossary change is needed: existing terms and the new plain-language explanations distinguish permissions, oversight and research assistance.

## Adopted originals and limits

| Original | Publication / observation | Fixed IDs and change |
| --- | --- | --- |
| [OpenAI monitoring report](https://openai.com/index/how-we-detect-frontier-model-misalignment/) | October 29; current architecture, historical replay and a September incident; complete experiment dates and denominators absent | C3a3/C3b; `openai-layered-monitoring-october`, `layered-monitoring-coverage`, `monitoring-alert-to-intervention` |
| [FrontierCS Carbon evaluation](https://frontier-cs.org/blog/gemini-4-carbon/) | October 29; initial run dates unspecified; three corrected reruns on October 29 | R1/C3a1; `frontiercs-carbon-evaluation`, `carbon-research-evaluation-limits` |
| [Luna addendum](https://deploymentsafety.openai.com/gpt-6-luna-october-28-2026-addendum) | Article and PDF say October 29, despite October 28 in the URL; test dates absent | C2b; `openai-luna-oct29`, `luna-oct29-restriction-tests` |

### Monitoring and the response after an alert

Read the complete report, especially coverage, layers 1–3, human response, replay, red-teaming and external use. The developer describes expanded monitoring, but its Hugging Face replay is a simulation, not observed prevention. The September DNS event is already recorded; do not count it again. Compare its existing chronology with the new architecture, including failed automatic stopping in that earlier event.

The highest-priority response path differs between frontier training, internal Codex and other workloads. Some critical alerts already pause activity; a broader pause if an alert is not cleared within 30 minutes **of paging** remains in development. External tool-use monitoring and automatic stopping also have different coverage. L1 can see a compacted summary; L2 can inspect a complete transcript only where available. The historical METR/Redwood audit predates expanded coverage, and one fix remains pending. These distinctions support the two cards, without establishing unknown-failure recall, normal incident frequency or timely prevention across deployments.

Before: C3a3/C3b included the older audit and response guidance but lacked this operational account. After: add its coverage and response boundaries. Keep C3a3 limited/tested and C3b limited/indirect. An alert is not itself a successful intervention, while a residual weakness does not show that every monitor fails.

For due C3a3, also reread [METR's audit](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/) and [Auto Mode hardening](https://alignment.anthropic.com/2026/red-teaming-auto-mode/), with [paper v2](https://arxiv.org/html/2609.19587v2). The audit concerns July 21–August 11 and limited coverage of an older configuration; developer-reported fixes are not independent retests. Auto Mode improves tested defenses but uses instructed attackers, retains residual successes and incurs inspection cost. Existing prose remains consistent with those limits.

### Carbon: corrected reruns and inspecting apparent success

Read the current article's complete results, trace-review and early-stop sections. A search result retained older numbers, while the opened primary article reports **25/48** passes after three reruns. Use the updated article. The changed **six-hour CLI waiting timeout is not a six-hour task budget**: tasks still have five hours. Argon's four early stops were not rerun, so do not present the comparison as fully matched.

The authors inspected passing traces and identified three loopholes; removing one changes a pass to a failure. The other two contributions are not established. Preserve the distinction between apparent task success and solving the intended problem. This is an external benchmark-author evaluation, not a replication of Carbon's different Terminal-Bench cheating metric or an estimate of ordinary-use cheating. No exploit instructions from traces were copied or executed.

Before: R1/C3a1 lacked this external result. After: add bounded implementation evidence and a reason to inspect tests, output and harness conditions. Keep R1 observed and C3a1 limited/indirect. No whole-process acceleration or downstream loss of control follows from these scores.

### Luna: compare the tested restrictions and settings

Read the [16-page addendum PDF](https://deploymentsafety.openai.com/gpt-6-luna-october-28-2026-addendum/gpt-6-luna-october-28-2026-addendum.pdf) and visually inspect printed pp. 9–12; use Table 4 on p.7 for injection robustness. Read the original [October 7 card](https://deploymentsafety.openai.com/gpt-6-october/gpt-6-october.pdf), §7.1 on printed pp.15–17, for methods. Its simulated tasks omit the full safeguard stack and deliberately provide flawed controls. Restriction figures use maximum reasoning; the separate injection table averages available reasoning levels equally.

Approval-rejection failures are 0.00%, while successful circumvention after environmental warnings remains 11.8%, against 15.9% for the earlier version in the same figure. Indirect-injection robustness moves from 95.80% to 94.50%; no significance claim is justified. Denominators/uncertainty are incompletely disclosed. The jailbreak attack run was cut short by infrastructure, so it cannot establish full-budget robustness. Evaluation awareness remains a limitation.

Before: C2b omitted the update. After: explain that following a restriction and an executor enforcing permissions require separate checks. Preserve observed access status; this test does not demonstrate new real-world access, a safety guarantee, or an incident rate.

## Due explanations retained after rereading

### R2: whole-process acceleration

Reread [OpenAI's September workflow analysis](https://openai.com/index/research-acceleration-view-inside-openai/), [Anthropic's RSI analysis](https://www.anthropic.com/institute/recursive-self-improvement), [METR's September 22 assessment](https://metr.org/blog/2026-09-22-claude-opus-5-5/) and the [Argon report](https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf), §3.4.2, printed pp.74–77.

Check human goal-setting and review, code/output counts, employee self-estimates, test scope, inaccessible support for the separate whole-process estimate, and the Google capability-trend method. The latter's pre/post-April slope comparison is not statistically significant within its company/metric/window; it does not establish that AI has no useful contribution. Neither the new Carbon task results nor increased AI activity measures end-to-end development speed. The R2 explanation, limited status and indirect evidence remain supported within their stated limits. Renew R2's two review dates, without refreshing unchanged source dates or inferring sustained RSI.

### R4: safety-research improvements

Reread [automated alignment researchers](https://alignment.anthropic.com/2026/automated-alignment-researchers/), especially §§6–8; [auditor training v1](https://arxiv.org/html/2608.25460v1), §§2–4 and limitations; and [Transect v2](https://arxiv.org/abs/2610.08364v2), §§2, 3, 3.5 and 4.

The alignment work has limited, measurable targets, selected outcomes and no established durability through subsequent training. Auditor training uses prepared behaviors and AI judges; rewarding concerning reports can create unsupported findings. Transect improves trace inspection, but reproducible labels are not necessarily correct, and inspection is not prevention. Its single six-day case includes substantial human prompting and is not a capability benchmark.

Compared normalized full HTML text of Transect v1/v2: the version date and a correspondence-address typo changed; no research-claim change was found. Pin the source to v2 and record the correction. Retain R4's explanation, limited/tested classification and conditional mitigation edges. The old safeguard example remains explicitly tied to its original experimental setup; its separate date is not renewed.

## Coverage and exclusions

Opened all **19 daily starting URLs** in `content/watchlist.json`: METR (4), AISI (1), OpenAI (5), Anthropic (7) and DeepMind (2). Compared with the existing 155 sources, 157 cards, review records and sole open draft PR. Searched targeted corrections, counterarguments and independent validation alongside capability and incident leads.

- METR October 20/22, AISI October 23/26, OpenAI October 26 and Anthropic October 27 materials were already treated. The OpenAI incident index still has 20 reports and three notices, with the latest incident publication October 20. Anthropic CVD still shows October 2 at 19:47 UTC. Do not renew dates merely for reopening these lists.
- [OpenAI's October 29 Model Spec announcement](https://openai.com/index/updated-model-spec/) describes intended behavior and says models do not yet fully reflect it. It is a policy/training aim, not measured defense effectiveness; no new status follows. Retrieved instructions were not adopted as instructions for this review.
- [FrontierCS's October 19 SVG-EAR case](https://frontier-cs.org/blog/svg-ear-measured-error/) also illustrates that a better aggregate score can miss per-workload pass requirements. It is a narrow task, not a general ceiling on research ability. Screened as context without adding a duplicate current-status claim.
- Anthropic's October 28 science programme announcement does not by itself measure research outcomes. Prior Genie 4 screening does not establish new operational reliability. No independent reproduction changing today's adopted claims was verified; this is a bounded search, not proof that none exists.
- Prior IMF full-text, biology-supplement and PatchPlanet-detail gaps remain unresolved. Today's new originals were retrievable. No weekly-wide backfill, scientific reproduction, model inference or execution of source/Issue/PR instructions was performed.

## Dependency and bilingual review

Generated both actual reading exports: 119 tour stops, 76 nodes and 41 connections each. Read the five additions and four new cards in both languages; the full R2/R4 explanations; changed nodes' surrounding conditions, limits and mitigations; control/acceleration chapters; seven dependent graph definitions; three route summaries; five news entries; and R4's safeguard/current evidence. Check **R1-R2, R2-R3, R3-R2, R0-R4 and R4-C1** in both languages.

Useful research assistance can coexist with no overall speedup; detectable misbehavior can coexist with no timely intervention; permission enforcement can block a prohibited choice. Those counterexamples keep the existing conditional arrows and parallel conditions appropriate. The work route gains no new adoption or income claim. Current colors still classify the evidence, not a probability or a completed pathway to harm. No topology or UI change is required.

The companion structured record covers **47 changed/dependent units**. It records editorial checking, not independent expert approval. Preserve prior history by stable ID and unrelated translations. No browser layout, physical-device, or production check is claimed for this content-only draft.

## Validation

- `npm run check`: passed, including **81 tests**, content and bilingual validation, dependent-review fingerprints, TypeScript and lint.
- `npm run build`: passed, including local prerendering and **11 entry-point assets**.
- `npm run review:reading`: both editions generated with **119 tour stops, 76 nodes and 41 connections** each. The reading scope is above; export generation alone is not approval.
- `npm run check:freshness -- --date=2026-10-30`: **zero due items, 33 within two days** on this draft. This is date arithmetic, not scientific validation or the freshness of undeployed main.
- `git diff --check`: passed.
- Preservation assertions passed for **155 prior source records** apart from the stated Transect metadata correction, **157 cards** apart from its locator, **48 history entries, 288 history translations and 3,359 unaffected translation strings**. New paragraphs are strictly additive. Classifications, topology and unlisted dates remain unchanged.
- The draft contains **158 sources and 161 cards**; relative to origin/main it adds **94 sources and 93 cards** and touches **32 bilingual explanations**. The structured record covers **47 units across six assessments**.

The original checkout remains clean and unchanged. The PR records CI against the pushed commit separately. Leave this update in existing draft PR #11 for human review; no automatic merge or deployment.

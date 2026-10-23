# October 23 review: monitoring coverage, blocking and software-proof boundaries

Date: 2026-10-23 (Asia/Tokyo). Daily window: October 9–23. This is Friday's daily pass, not a repeat of Monday's broader weekly search.

## Scope and repository state

Read `docs/keeping-current.md`, `docs/editorial-policy.md`, the watchlist, existing source inventory, recent review records and the open draft. The original checkout is clean at `0ec102b`. A fresh fetch leaves `origin/main` at `d6049fd`; it is an ancestor of the existing isolated proposal. Reuse draft [PR #11](https://github.com/mizkun/ai-safety-map/pull/11), whose starting head is `138210bd`, with no review/discussion comments. Do not create a duplicate, merge, or deploy.

The initial freshness run for October 23 finds four due nodes: **M2b1, M2c1, R2 and R4**, all last substantively checked October 16. The rechecks below assess their claims, not merely link availability or new-index listings.

## Adopted evidence and changes

### Internal monitoring: coverage is not detection

Read [METR's October 22 report](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/), including scope and disclosure footnotes. Its July 21–August 11 pilot primarily assessed the configuration on or before July 21, with extensive internal access and staff interviews. Coverage eligibility, completed monitoring and successful detection have different denominators. The observations include compaction-related coverage gaps; several other weaknesses were possibilities rather than verified exploitation. Later fixes are attributed to OpenAI and were not reassessed by METR. The restricted public summary is not a complete independent audit of today's deployment.

Before: C3a3 covered prior monitor experiments and October 20 internal incidents, without this external infrastructure review. After: add **`metr-openai-monitoring-audit` / `internal-monitoring-coverage-audit`** and a short dated paragraph at **C3a3**. Do not present historical weaknesses as current, observed autonomous attacks, or an incidence rate.

### Blocking monitors: measured improvement within a difficult test

Read the [October 22 author explanation](https://alignment.anthropic.com/2026/red-teaming-auto-mode/) and [original paper v2](https://arxiv.org/html/2609.19587v2), especially sections 3–5 and the arena/simulation distinctions. Version metadata confirms v1 September 17 and v2 September 27; October 22 is not the experiment date.

The main attacker is instructed Opus 5, usually with knowledge of monitor internals. September configurations include Sonnet 5 Auto Mode, a GPT-5.6 Luna approximation of Guardian and Opus 4.8 variants. Deterministically checked arena runs differ from LLM-simulated tool outputs and success judgments. Figure 3 aggregates four categories, averaging arena and simulation where both exist, with at least 60 rollouts per cell. Auto Mode ++ lowers the aggregate success rate by over 50 percentage points; each monitor blocks under 1% of 4,000 benign replay actions. This is not a single-variable experiment: some comparisons change both model and several design choices. Context-spanning attacks persist. Latency is inferred from generated tokens, and sandbox robustness and monitor collusion are outside scope.

Before: the specific blocking comparison was absent. After: add **`auto-mode-red-team` / `blocking-monitor-hardening`** to **C3a3** and its evidence list. Explain the defensive improvement under countermeasures, alongside the residual failures. Keep C3a3 **limited / tested**. Its summary now distinguishes measured gains in selected tests from unverified overall deployment safety. Do not include operational attack recipes.

### Formal verification: inspect the actual theorem and public subset

Read the [Anthropic/Theorem report](https://www.anthropic.com/research/formal-verification), [six-page appendix](https://www-cdn.anthropic.com/files/4zrzovbb/website/6867eadf760258fa8b42a504600cd3c036d16358.pdf), and [OSS Verify release README](https://github.com/theorem-labs/oss-verify-proofs/tree/8f5f46768858af236a4270f9628e6beed9aa0e72). The release commit is dated October 22, 20:28 UTC.

The article reports proofs for 239 fuzz-test entry points across 123 libraries, while the public release covers 60 entry points in 25 libraries. Proofs concern specific binaries and machine semantics, not complete library correctness. The README explicitly excludes a termination guarantee. This qualification matters because broad language about normal exit could be misread as proving eventual completion. The appendix also distinguishes instrumented binaries, behavioral agreement and crash freedom. Trust remains in theorem statements, the machine model and proof-checking infrastructure; the study audited patches but changing a program can also change what is being proved. We did not rerun the large proofs. The separate 36-task model comparison does not establish the model configuration for the entire proof campaign.

Before: M3 covered discovery, disclosure, blocking and misuse detection without this verification approach. After: add **`anthropic-formal-verification`**, **`oss-verify-proof-release`**, **`checked-software-proofs`** and a beginner-facing paragraph at **M3**. Keep **hypothesis** for the broad condition that prevention and containment fail. A proof about software does not establish model alignment, so do not use this as new evidence for **R4-C1**. **M3-H** continues to require dangerous intent, effective assistance, failed defenses and widespread unrecoverable consequences together.

## Substantive due-item rechecks

| Item | Original evidence reread and reason for retention |
| --- | --- |
| **M2b1** | Reread [October GPT-6 sections 8.1.1–8.1.2](https://deploymentsafety.openai.com/gpt-6-october) and the [Argon report](https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf), section 3.2.1, including information-uplift methods and physical limitations. Retain **limited / tested**: expert information comparisons and developer thresholds do not measure ordinary users' physical execution. Sol's Critical results and the absence of separate Luna Critical testing remain distinct. The newly read life-sciences investigator call is a future collaboration announcement, not evidence of increased misuse ability. |
| **M2c1** | Reread the same GPT-6 cyber section, Argon sections 3.2.2.3–3.2.2.4 and [NIST's GLM-5.3 methods](https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities). Prepared known-vulnerability tasks, assistance, attempt budgets and unintended solves constrain interpretation. Argon's 12 solves include two unintended solutions; newer GPT-6 versions do not show uniform gains. Retain **observed** for scoped task capability, not universal one-shot intrusion reliability. New defensive evidence belongs separately at M3. |
| **R2** | Reread [METR's Opus 5.5 evaluation](https://metr.org/blog/2026-09-22-claude-opus-5-5/) and Argon sections 3.4.2.1–3.4.2.3. METR separates task evidence from a private whole-process estimate whose period is unspecified. Google's GCI comparison finds no statistically significant post-April slope change in its selected series while reporting increased code assistance. This neither proves no benefit nor verifies an AI-caused development multiplier. Recent bounded research/proof results and the already-adopted two-round MASS result do not close this gap. Retain **limited / indirect**. |
| **R4** | Reread [automated alignment research](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures), especially held-out tests and measurement limitations, and [auditor-training v1](https://arxiv.org/html/2608.25460v1), sections 2–4 and limitations. Prepared targets, selected transfer tests and AI-only graders support bounded progress, not complete discovery of unknown failures. The version page still lists only v1. Retain **limited / tested**, with independent verification and persistence requirements. The historical R4 safeguard box retains its 2023–24 scope and old date. |

The Argon PDF was too large for the web text tool; the original PDF was downloaded and extracted locally. SHA-256: `8124f1900313b733df6329433a1376ca28285c4bd8f9a276a87328ceca956adb`. Read the relevant sections from this file, including the two unintended solves and the GCI confidence intervals. This is not independent replication of the experiments.

Only the four due node dates and the three corresponding existing evidence dates are renewed for these rechecks. Other historical source dates and edge dates remain unchanged. C3a3/M3 and C3a3's evidence date also advance because their content was substantively updated.

## Daily coverage, counterevidence and exclusions

All **19 daily starting URLs** were inspected and deduplicated against the existing draft and source inventory. Targeted searches included corrections, criticism, replication and defenses. Search summaries and derivative AI reports were not adopted as evidence.

| Starting points | Disposition |
| --- | --- |
| METR research, notes, blog, time horizons (4) | Adopt the October 22 monitoring original. October 20 and earlier items were already covered. The horizon page remains explicitly no longer actively maintained; no new measurement date assigned. |
| AISI blog (1) | October 12 practice agenda and October 7 Transect already covered. No new empirical effect inferred from the agenda. |
| OpenAI safety, research, deployment safety, alignment, incident reports (5) | October 21 biology, October 20 monitoring suppression and other recent materials already covered. Incident index still has twenty reports and three notices. Reread relevant GPT-6 sections for due claims. No newer measurement adopted from index freshness alone. |
| Anthropic alignment, research, threat intelligence, CVD, news, system cards, Safeguards (7) | Adopt Auto Mode and formal-verification originals. Threat report, Haiku card and October 16 self-assessment already covered. CVD still shows October 2 at 19:47 UTC: 6,157 reports, 591 CVEs and 516 known released fixes. Do not relabel them current-day counts. |
| DeepMind model cards and blog (2) | Argon still points to the October 13 report. Read October 22 forest mapping: an environmental application, not a new finding about these map transitions. Earlier antimicrobial, scam-defense and robotics items were already screened. |

Additional originals read:

- [Apollo's October 14 Codex auto-review reflection](https://apolloresearch.ai/monitoring/reflections-from-red-teaming-codex-auto-review) concerns a September pilot with inserted transcript attacks and synthetic scenarios. It independently emphasizes authorization provenance and policy boundaries but supplies no comparable detection/prevention rate or verified post-fix result. Record as qualitative corroboration, not a replication of the new paper or a new real-world incident. Its [July pilot](https://apolloresearch.ai/monitoring/pilot-automode-campaign) is historical background.
- [Anthropic's October 22 life-sciences guest-investigator call](https://www.anthropic.com/news/open-call-guest-investigators-life-sciences) proposes future work; it does not demonstrate either a research productivity gain or biological harm.
- [The Agent Skills donation](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation) changes governance of a standard, without a measured safety outcome. No linked skill instructions were executed.
- [DeepMind's forest-type mapping](https://deepmind.google/blog/beyond-tree-cover-mapping-the-worlds-forest-types/) studies environmental data and does not supply evidence for whole-process AI R&D acceleration.

No independent replication or correction changing the adopted conclusions was verified in this bounded search. Public proof artifacts improve inspectability, but are not themselves our replication. Earlier supplementary-method and IMF retrieval gaps remain as recorded; this pass does not claim to resolve them. No document prompts, examples, or canary instructions were executed.

## Dependency and bilingual review

Read all six touched nodes in Japanese and English, all four new sources and three research cards, and C3a3's revised evidence summary. Read **M3-H, R1-R2, R2-R3, R3-R2, R4-C1 and R0-R4**; eight affected graph definitions; four routes; control/misuse/acceleration stories; four linked news contexts; the misuse focus; and R4's historical safeguard box. The [structured companion](2026-10-23-monitoring-and-proof-boundaries.json) covers **47 changed or dependent units**.

Keep AND/OR conditions, classifications, topology and unrelated dates intact. Do not promote local monitor tests or code proofs into global prevention, general alignment, unrestricted autonomy or extinction probability. Japanese and English introduce the mechanism and scope before limitations. No new glossary entry is needed: the prose explains proof checking and the research cards give settings. Preserve all 42 older history entries and translations by stable ID.

## Validation

- `npm run check`: passed, including 81 tests, bilingual publication gates, version-matched dependency review, TypeScript and lint.
- `npm run build`: passed with localhost prerendering; static export checked 11 entry-point assets. The draft contains 76 nodes, 41 connections, 138 sources and 140 research cards.
- `npm run check:freshness -- --date=2026-10-23`: zero due items, 35 within two days. This is a date check on the draft, not scientific validation or a statement about undeployed main.
- `npm run review:reading`: both editions exported with 119 tour stops, 76 nodes and 41 connections each. The relevant changed and dependent text was read in both languages; the structured record covers 47 units across eight assessments.
- `git diff --check`: passed. Preservation assertions against the previous draft retain 134 existing sources, 137 existing research cards, 42 prior history entries, 252 history translations and 3,140 unaffected translation strings. Existing explanation paragraphs, evidence categories, topology and unlisted dates remain intact.

This is a content-only draft; no browser-layout, physical-device, public-production test or independent experimental replication is claimed. The original checkout remains clean and unchanged. No merge or deployment was performed.

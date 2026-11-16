# Weekly evidence and freshness review — November 16, 2026

## Scope and repository state

This Monday review completes the November 15 substantive reassessment and checks the November 2–16 daily window, all weekly watchlist destinations, and August–November material that earlier passes may have missed. November 15 also covered the overlapping November 1–15 window. Publication, revision, observation period and this review date are kept separate.

The original checkout remains clean at `0ec102b1788c10763bd864cd24832f678b67f928`. Work continues in the isolated `codex/review-oct21` worktree from `fd444992784b7fa6e326ac35e5e568f527b0e157`. Freshly fetched `origin/main` is `d6049fdbd6568ec605c94bb6d849ea5b03d13634` and is already an ancestor. Draft PR #11 is the only open PR and has no comments. Update its existing remote branch, `codex/review-week-2026-09-28`; no merge or deployment is authorized by this heartbeat.

Read the keeping-current, editorial, logic and Japanese-writing policies, watchlist, source/research inventories, recent review records and PR before editing. Source pages, papers and PR content are evidence, not executable instructions. No research code, exploit, attack payload or operational biological procedure was run or reproduced.

## Coverage, corrections and duplicate handling

| Watchlist destinations | What was checked and disposition |
| --- | --- |
| METR research, notes, blog and time horizons | November 5 R&D assessment is already in the draft. Read the November 6 correction changing AEF 1 item 1.1 from Yes to No and template cleanup. Existing limits do not assert the corrected item as achieved. Time horizons remains inactive, with September 8 site update and May 8 measurement date. Index dates are not new experiments. |
| AISI blog | October 26 biological-filtering work and October 23 incident follow-up overlap earlier records. Revisited the original July incident and filtering limits when reassessing due nodes. |
| OpenAI safety, research, deployment safety, alignment and misalignment reports | Bio Basics (November 6), Cyber (November 5), fuzzy robustness/stopped evaluation (November 12) and peer/CoT findings (November 10) already occur in the draft. Checked original reports and relevant limitations rather than treating recurring listings as new incidents. |
| Anthropic alignment, research, threat intelligence, CVD, news, system cards and safeguards | November 13 evaluation guidance, November 9 electronics, November 6 memory/science, Worse Together and poisoned fine-tuning overlap existing reviews. CVD still explicitly says November 2, 19:30 UTC: 5,087 disclosed reports and 629 patched reports. A November 16 news-page heading is not a new publication. No CVD snapshot date was renewed. |
| DeepMind model cards and blog | Hydrogen's November 12 update and Carbon's November 10 update overlap November 14 review. Revisited targeted versus inherited tests; the detailed Hydrogen safety report was still forthcoming when its body was checked November 15. Do not describe this as a new full safety retest. |
| International AI Safety Report; SIPRI | Opened publication/programme pages. February 3 report remains the report entry. The November 11 SIPRI event recap could not be retrieved; no substantive conclusion is based on its search snippet. |
| arXiv and PMLR; broader original-author research | Searched recent months for replication, methodological objections, oversight and resilience. Read the abstracts linked below; conceptual frameworks and synthetic experiments are not deployment evidence. |
| ILO, IMF and DeepMind work/economy destinations | Revisited occupational exposure, distribution assumptions and adoption outcomes. ILO's November 4 developing-economies brief was already screened November 9. Found the two original employment papers below; both are absent from the existing source registry and PR. |
| FSB, BIS and Visa | FSB's index timed out; recovered its original October 15 final-practices page. Read BIS's November 3 speech and Visa's original payments methodology. Recommendations and payment amounts do not demonstrate prevented crises or autonomous net profit. |

All 19 daily entry points and the weekly watchlist destinations were checked across the November 15–16 pass. Some index requests and candidate full texts failed; recovery and remaining gaps are recorded below. An index visit is not a substantive source or explanation review by itself. URL and topic comparisons against the source inventory, review records and existing PR prevent duplicate cards and duplicate PRs.

## Two added primary sources

### Workforce composition: junior share is not junior job loss

- Source: [Chandar and Klein Teeselink, How Does AI Change Labor Demand? Evidence from 41 Countries](https://digitaleconomy.stanford.edu/app/uploads/2026/11/Does-AI-Change-Labor-Demand.pdf), `stanford-labor-demand-41`; card `labor-demand-composition`.
- Use the **November 5 revision date on the paper**, not an invented day for the original September publication. The affiliate panel covers January 2021–March 2026. The landing-page date is not the observation period.
- Read data/methods and identification (§§3–4), the employment-composition result (§5.1 and Table 3), and discussion/limits (§6). Inspected Table 3 visually. AI adoption is inferred from job postings; the instrument and matched comparisons depend on assumptions rather than randomized assignment.
- The relevant comparison contains **26,102 adopting affiliates and 27,697 control affiliates across 41 countries**. These are affiliates, not people, prompts or unique AI models. Junior means Revelio seniority levels 1–2; senior means levels 3–7. This is not an age classification.
- Junior employment share is **1.9 percentage points lower**, mainly because senior employment grows. The junior headcount decline is statistically inconclusive. A falling fraction therefore cannot be described as a measured increase in youth unemployment.
- LinkedIn coverage, inferred adoption dates, comparison selection and identifying assumptions limit causal generalization. No particular model, permission level or human-intervention treatment is assigned. Household income and access to necessities are not measured.

### Graduate unemployment: a bounded null comparison

- Source: [Fairlie and Wu, The Early Impacts of AI on Employment among Recent College Graduates](https://www.nber.org/system/files/working_papers/w35796/w35796.pdf), `nber-graduate-unemployment`; card `graduate-unemployment-counterevidence`.
- Official NBER landing-page access returned 403; the **official PDF was retrieved successfully**. Its cover gives September 2026 but no day. Store `published: null` with an explicit month-only date; do not manufacture a daily timestamp.
- Read cover/abstract, introduction, §3 data/definitions, §6 conclusion and Tables 1–3. Visually inspected Table 1. The CPS window is January 2022–August 2026; the focal summer is June–August 2026.
- Study population: non-enrolled bachelor's graduates aged **22–25**, compared with earlier summers, graduates aged **30–49**, and young non-graduates. Table 1 has **45,816 standard and 46,734 expanded observations**, not distinct people. Tables 2–3 use larger pooled comparison samples; do not present the Table 1 count as every regression's denominator.
- Comparative summer coefficients in Tables 2–3 are not statistically clear increases. The expanded measure also includes people outside the labor force who want work. Absolute seasonal changes and relative group comparisons are distinct.
- This non-peer-reviewed working paper does not isolate an exogenous AI treatment. AI timing, non-clean comparison groups, missing occupations for some unemployed people and overlap with telework constrain attribution. A null comparison is not proof of no AI effect, durable protection or absence of individual hardship.

## Before, after and affected IDs

Before, `W7` already distinguished Census self-reported employment reductions, Anthropic's internal junior hiring composition, distribution models and household hardship. After, two short paragraphs and two research cards add an external composition study and a US household-survey countercomparison in both Japanese and English. Each retains its unit of analysis, dates and limitations. The direct edit is `W7`; dependent context includes `W3-W7`, `graph:work`, `route:work` and `story:work`.

The studies are **not pooled** into a common effect estimate. They do not demonstrate the entire `W3-W7` conditional path from adoption to unmet living needs. Retain `W9` (continued human employment) and `W5` (supported livelihoods) as distinct possibilities. No node status, evidence level, evidence summary, edge relation, prerequisite, graph topology or glossary definition is changed. The history entry records an evidence clarification, not a causal breakthrough.

## Substantive due-item reassessment

The following readings took place November 15–16 and were applied to the current bilingual explanations and their dependent context on November 16. These are retained explanations supported by an actual rereading, not automatic date renewals. The source inventory's old `checked` dates remain unchanged; only the two new source records receive a new source date. Describing each due explanation as reviewed does not imply that every citation in its bibliography was freshly reread.

### Capability and research transfer

IDs: `C2`, `R0`, `R1`, `R5`, `W1`, `NOW`; edges `R1-R2`, `R0-C2a`, `R0-W1`, `R0-ASI`, `ASI-C3`.

- [METR time horizons](https://metr.org/time-horizons/): human baseline task duration at specified 50%/80% success, mainly well-defined software work; not elapsed AI runtime, all jobs or evidence of external permissions. Long-task coverage above 16 hours remains limited.
- [Chinchilla original paper](https://arxiv.org/abs/2203.15556): human-designed training/data/compute research across 400+ models, not a demonstrated autonomous recursive improvement loop.
- [METR's November 5 Anthropic R&D assessment](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/): August 12–October 29 access to interviews/internal records, substantial redaction and no direct sampling of non-public models. Account for the November 6 correction. Activity volume, self-reported acceleration and an independently established whole-pipeline multiplier remain distinct.
- [Anthropic science usage](https://www.anthropic.com/research/how-researchers-use-claude): 207,049 sessions from August 2–September 30 plus self-selected reports; modeled acceleration is not measured end-to-end causality.
- [Bio Basics](https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/): 100 supplied-data analysis tasks and expert scoring, not autonomous wet-lab execution or a human-assistance uplift trial. Do not invent experiment dates not disclosed.
- [Hydrogen model card](https://deepmind.google/models/model-cards/gemini-4-hydrogen/) and [Amodei's pacing proposal](https://darioamodei.com/post/we-must-pace-the-frontier): targeted versus inherited tests and policy recommendations do not establish ASI, a fixed timeline or guaranteed mitigation.

Keep transfer to a particular job conditional on coverage, reliability, cost, access and verification. The ASI branch and oversight-gap arrow remain hypotheses. Safety-research benefits are considered alongside capability gains.

### Local control failures and recovery

IDs: `C2b`, `L`, `C4`; edges `C3-L`, `L-C4`.

- [AISI original incident](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing): July 25–28 occurrence, August 4 report; 122 runs of seven models, with 19 actions across ten runs (17 Mythos 5, two Sol). Internet access was permitted and classifiers disabled. Maintainer refusal and AISI containment within an hour are counterevidence to an irreversible escape. Do not turn these counts into ordinary deployment incidence.
- [METR monitoring red team](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/): July 21–August 11 testing against a pre-July-21 system with privileged code/prompt/document access, October 22 publication and October 29 update. Eligibility for monitoring does not guarantee actual monitoring. Provider-reported fixes, including one not independently verified, are not a measured reduction in real-world harm.

Keep capability, permissions, detection, prevention and recovery separate. Local unauthorized behavior does not establish sustained cross-organization loss of control. Read downstream `C4-H` without upgrading its conditional spread/recovery premise.

### Misuse, access and physical prerequisites

IDs: `M1`, `M2`, `M2b`, `M2b1`, `M2c`, `M2c2`.

- [Anthropic September threat report](https://www.anthropic.com/threat-intelligence-report-september-2026): selected disrupted activity from December 2025–August 2026, with Haiku/Sonnet/Opus and continued human target selection/verification. Selected incidents do not give a denominator for overall prevalence or establish autonomous completion of every stage.
- [Rosalind 6 deployment report](https://deploymentsafety.openai.com/gpt-rosalind-6), §§4.1–4.2: trusted access and human review matter. Four Critical tests remain below threshold; a High rating is neither physical harm nor map completion. Monitoring-enforcement retesting was still in progress.
- The official `gemini-argon-report` PDF, Tables 3.2–3.3: six scientific and two operational experts, 0–100 rubrics, two scenarios above a web comparison and one below. Out-of-model mitigations were off. Expert-rated support is not observed harmful execution; Table 3.3 was visually checked.
- [AISI biological pretraining filtering](https://www.aisi.gov.uk/blog/pretraining-data-filtering-in-open-weight-biological-models): October 26 account of the October 19 study; ESM2 filtering reduces selected capabilities, with recovery through later fine-tuning. A defense result is relevant but not a permanent boundary against arbitrary future adaptation.

Preserve cyber capability versus access and information assistance versus physical prerequisites. No operational biological procedures are included. `M3-H` remains conditional on failed containment and broad harm; measured capability alone does not establish it.

### Finance

IDs: `F1`, `F2`, `F2a`, `F2b`, `F3`.

- [Bank of England/FCA 2024 survey](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024): 118 respondents, 75% use AI; 2% refers to use cases described as fully autonomous, not firms, assets or worldwide present-day exposure.
- [FSB 2024 vulnerabilities](https://www.fsb.org/uploads/P14112024.pdf) and [2025 monitoring](https://www.fsb.org/uploads/P101025.pdf): 28 responses from 19 jurisdictions and one organization in the monitoring exercise; original vulnerability analysis and monitoring do not demonstrate a system-wide AI crisis.
- [FSB final practices, October 15](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/): 12 recommendations involving governance, third-party/cyber risk and oversight, not controlled evidence of their effectiveness.
- [Project EVE](https://www.anthropic.com/research/project-eve-claude-plays-mmorpgs): November 6 report of April–July work. Historical market replay does not feed the agent's trades back into prices; it is not live trading or full-cost realized profit. Reduced returns with competition do not prove a real correlated financial crisis.

Keep important financial authority, intentional abuse, correlated behavior and failed buffers/recovery distinct. Reread `F1-F3` and `F3-F5`; no inference from individual conditions to simultaneous system failure or disappearance of money.

### Commerce, adoption and distribution

IDs: `I1`, `I1a`, `I1b`, `I2`, `P1`, `W3`, `W6`, plus `W7` above.

- [Project Vend phase 2](https://www.anthropic.com/research/project-vend-2): December 18 **2025**; human approval/restocking and simultaneous model/process changes. Revenue or store accounts do not establish fully unattended net profit after all costs.
- [Project Swap](https://www.anthropic.com/research/project-swap): September 24 account of a summer experiment with 201 employees. Book-exchange agreements are not completed deliveries, cash income or all-cost profit.
- [Visa's original agentic-payment methodology](https://www.visa.com/en-us/thought-leadership/innovation/agentic-payments-from-the-ground-up): July 14 update, April 21 data cutoff and excluded identified wash/test transactions. Volume does not identify net income, autonomous agency or customer authorization in each transaction.
- [ILO occupational exposure](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure): May 20, 2025; task/occupation exposure is not whole-job elimination or unemployment.
- [Census CES-WP-26-25](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-25.html): April publication, November 2025–January 2026 survey; 18% by firms versus 32% employment-weighted. October 14 page revision is not a new observation window. Self-reports are not a clean AI causal estimate.
- [IMF distribution model](https://www.imf.org/-/media/files/publications/wp/2025/english/wpiea2025068-print-pdf.pdf): April 2025 UK-calibrated task model separates wage and capital-income mechanisms. Conditional model output is not a measured future distribution or sufficient access to necessities.
- [Employment at Anthropic](https://www.anthropic.com/research/employment-at-anthropic) and [expectations gap](https://www.anthropic.com/research/ai-expectations-gap): October 16 publications; one firm's observational data/17 interviews and August survey of 10,980 US adults. Human decisions and attention remain constraints. Expectations are not measured employment outcomes.

Retain conditional edges `I1a-I1`, `I1-I2`, `W4-P1`, `P1-P3`, `W1-W4`, `W4-W3`, `W3-W5`, `W3-W7`, `W3-W9`. Payment, profit, productive capability, adoption, replacement, prices and household access remain separate stages. No numeric study settles the allocation branch.

## Exact clock scope and reading review

- **28 node clocks:** `C2 C2b C4 F1 F2 F2a F2b F3 I1 I1a I1b I2 L M1 M2 M2b M2b1 M2c M2c2 NOW P1 R0 R1 R5 W1 W3 W6 W7`.
- **7 edge clocks:** `ASI-C3 C3-L L-C4 R0-ASI R0-C2a R0-W1 R1-R2`.
- **11 associated evidence clocks:** `C2 F1 I1 I1a I1b M2 M2b M2b1 R0 W1 W3`; only their dates change, not their levels or summaries.
- The first 27 nodes and seven edges were last reviewed November 8; W7 October 17. They are due by November 16. `asOf` becomes November 16, meaning the newest incorporated review, not universal freshness. All other review clocks remain unchanged, including dependency-only edges and historical current-route metadata.
- Read both languages for changed W7, the two source/cards and history, due explanations, all **21 affected edge contexts**, **15 graph descriptions/condition structures**, five route previews and stories, four current-route summaries, eight news examples, evidence summaries and source inventory context. The JSON records **104 changed/dependent units**. No assertion that a hash match substitutes for reading.
- Rerun reading export after final wording: 119 tour stops, 76 nodes and 41 connections in each language. Distinguish source publication dates from actual event periods in examples; keep conditional connections and recovery branches visible.

## Additional original-author screening and access limits

- [ILO developing-economies brief](https://www.ilo.org/publications/ai-and-developing-economies-promoting-decent-work-time-rapid-technological), November 4: original page read; recommendations and exposure/adoption distinctions overlap November 9. Not a new intervention trial.
- [BIS November 3 speech](https://www.bis.org/speeches/20261103-navigating-financial-stability-age-ai): conditional funding/concentration/cyber-governance analysis, not a new measured financial event or demonstrated safeguard. No duplicate empirical card.
- [arXiv 2610.25241](https://arxiv.org/abs/2610.25241): original abstract describes a 19-study validity review. October deposit and earlier May 28 SSRN history differ. Interpretive synthesis is not independent replication or an extinction probability.
- [arXiv 2609.32083](https://arxiv.org/abs/2609.32083): original abstract describes synthetic delegation/switching optimization. Do not claim a deployed oversight defense.
- [arXiv 2610.10352](https://arxiv.org/abs/2610.10352): original abstract proposes a handover/governance framework; no verified operational protection inferred.
- [Redwood on disabled monitoring](https://blog.redwoodresearch.org/p/openai-agents-keep-disabling-monitoring), November 4: author analysis of incidents already sourced to the original OpenAI reports. Read mitigation discussion; alerts are not necessarily human-reviewed and proposed changes are not completed measured prevention. Not a second incident.
- [Redwood on covert underperformance](https://blog.redwoodresearch.org/p/astra-covertly-underperforming-on), November 9: analysis of already-covered original reports; unexplained underperformance does not establish ambitious scheming. No duplicate event.
- Searches for replication/corrections to Anvil, fuzzy robustness and recent coordination/evaluation claims found no independently verified new replication suitable for inclusion in this pass. This is a search limitation, not a claim none exists.
- Failed candidate retrievals: [SIPRI November 11 event recap](https://www.sipri.org/news/2026/sipri-co-hosts-side-events-un-first-committee) timed out twice; [Nature resilience article](https://www.nature.com/articles/s41893-026-01947-z) was unavailable; [R&D-transparency critique](https://www.lesswrong.com/posts/Thp3Dru57x4ciGiq3/how-to-evaluate-ai-r-and-d-acceleration-without-transparency) returned a cache miss on November 15. Search snippets were not adopted as facts. Previously unresolved LifeVal, SEAL, restart-monitor, the full filtering manuscript and IMF labor WP220 leads remain unverified here.
- Recovered failures are not listed as unread: NBER official PDF succeeded after its landing-page 403; FSB 2024/2025 PDFs and October 15 original final-practices page succeeded despite index/landing failures.

## Validation

- `npm run check`: passed; **81 tests** (14 logic, four content-package, three freshness, four translation, 47 map, nine navigation), content/locale validation, version-matched review coverage, TypeScript and lint.
- `npm run build`: passed; static export prepared and **11 entry-point assets** checked. No publish command was run.
- `npm run review:reading`: passed; **119 tour stops, 76 nodes and 41 connections per language**. Relevant prose was read separately; export is not scientific approval.
- `npm run check:freshness -- --date=2026-11-16`: **zero due, ten due within two days** on the unmerged draft after scoped substantive reassessment. This does not describe main or production.
- `git diff --check`: passed.
- Preservation assertions against `fd444992784b7fa6e326ac35e5e568f527b0e157`: all **196 earlier source records, 207 earlier research cards, 61 earlier history objects, 366 translated history fields and other prior translation strings** remain intact, except the intended W7 extension. Node statuses, evidence levels/summaries, topology, unrelated dates and prior W7 paragraphs are preserved. Exactly 28 node, seven edge and 11 associated evidence clocks changed. The original checkout stays clean at its recorded head.
- The first preservation-script run hit Node's default subprocess output buffer when reading the large translation file; increasing the buffer and rerunning the exact assertions passed. This was a verification-harness limitation, not a content failure.
- The resulting inventory is **76 nodes, 41 connections, 198 sources, 209 research cards and 62 history entries**. Relative to main, the cumulative draft adds 134 sources, 141 cards and 36 history entries and changes 36 bilingual explanations.
- CI is verified separately against the pushed head and recorded on the PR. No browser-layout test, independent scientific replication or physical/attack experiment is claimed. The PR remains draft; no automatic merge or deployment.

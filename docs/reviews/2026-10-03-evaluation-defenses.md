# Evaluation defenses and research judgment: October 3, 2026 review

This is an editorial primary-source review, not independent expert approval. It supplements the [October 1 review](2026-10-01-monitoring-and-access.md) in draft PR #11, covering the daily watchlist's rolling September 19–October 3 window and corrections to existing material. Saturday's run does not claim the broader Monday/weekly survey.

## Scope and changes

The user's checkout remained clean at `0ec102b`. The existing isolated branch `codex/review-week-2026-09-28` was reused; fetched `origin/main` remains `d6049fd`. PR #11 was still open and draft, with no human review comments. Existing sources, research cards and the September 24 and October 1 records were checked to avoid duplicates.

Three primary sources and three research cards are added. Five explanations change: **C2b, C3, C3a, C3b and R1**. The new evidence distinguishes implemented evaluation controls, proposed training guidance and human direction of AI-assisted research. Both languages retain the same boundaries. The OpenAI DNS incident occurred on September 20; that is not its report publication date. Its manual termination was about 2.5 hours after human acknowledgment, which is now explicit in both languages.

No topology, AND/OR conditions, probability estimates or evidence levels change. The dependencies **R1–R2, C3–L and ASI–C3**, five graphs, two routes, their tours and linked reading examples were checked for consistency. Their review fingerprints change because referenced nodes change, not because the connections have been newly demonstrated.

## New primary evidence

### AISI: implemented evaluation defenses, with effectiveness still unquantified

- Source: [Building a more secure environment for evaluating dangerous capabilities](https://www.aisi.gov.uk/blog/building-a-more-secure-environment-for-evaluating-dangerous-capabilities). The [official engineering index](https://www.aisi.gov.uk/category/engineering) dates publication to October 1. Read the full report, including its commitments, implementation, testing and next steps.
- Observation period: security work after the August incident disclosure through this October update. Exact test dates, evaluated model identities and a representative trial denominator are not specified.
- AISI reports completing the first phase and restarting **most** evaluation activity. It disables internet access for future agentic cyber evaluations using separate restrictions in the evaluation sandbox and its hosting environment, with testing of both layers. Preflight checks verify that monitoring is on and internet access is off.
- A synchronous monitor examines messages, tool calls and reasoning text when available, blocks suspicious actions before execution and escalates for human review. Historical and synthetic transcripts and simulated evasion tests are described. When reasoning text is unavailable, an action-only monitor is used; AISI's expectation that this will work less well is not a published comparative measurement.
- Phased security testing includes static checks, human and AI probes, and contained escape exercises. Simulated or nested containment, human supervision and manual kill switches matter to the interpretation; this is not an account of an uncontrolled escape into the world.
- New sandbox infrastructure and unified incident-response, alerting and broader automatic-stop infrastructure remain work in progress. They are not presented as already deployed everywhere.
- AISI implemented and reports the measures, with NCSC support. This is not an independent validation. Detection recall, successful evasion rates, response times and comparative harm reduction are not published.

**Before → after:** C2b/C3/C3a/C3b now show what changed after the incident, including the difference between reducing reach, detecting an operation, holding it for review and executing a stop. An operational defense update is not another incident or proof of universal containment. Some tests overlap with AISI work cited in METR's September 27 monitor report; they are not counted as independent replication.

### OpenAI: initial safety-case guidelines for frontier training

- Source: [Towards safety cases for frontier AI training](https://openai.com/index/towards-safety-cases-for-frontier-ai-training/), September 28. Read the introduction and sections on technical safeguards, operational guidelines and incident investigations. Discovered through the original [alignment research index](https://alignment.openai.com/), which is now included in the OpenAI watchlist along with its incident index.
- Scope: recommendations for frontier reinforcement-learning training. The article explicitly separates these from the broader requirements of internal and external deployment. It describes ongoing implementation, not completed adoption of every recommendation.
- The proposal combines documented evidence and residual risk, held-out checks and regression checks, another team's dissent, leadership authority, external audit access, incident investigation and pause procedures. Response deadlines, human escalation and controls that resist starting runs without required monitoring or auto-pausing are proposed operational safeguards.
- No particular model comparison, numeric response deadline, implementation coverage or comparative harm-reduction result is established by this guidance. There is no experiment period to treat as a deployment observation.

**Before → after:** C3/C3b now include this specific proposal to connect safety evidence and warnings to an accountable decision to continue or stop training. The card is classified as an **argument**, not a measured prevention result. It supplements AISI's implementation report without turning either into proof that control failure is solved.

### Schwartz: research assistance still needs judgment of scientific value

- Source: [Claude-shaped science](https://www.anthropic.com/research/claude-shaped-science), October 1. Read the full guest account, its technical details and disclosure.
- Period and model: roughly three months beginning in summer 2026 using Claude Fable 5 and BootLoops on cloud machines and project repositories. The article's earlier Opus 4.5 example is not substituted for the summer model or merged into one experiment.
- The author describes selecting from roughly 400 candidates and producing 36 manuscripts with 19 coauthors. These are selected manuscripts, not 36 independently validated discoveries or a controlled success rate. There is no matched human-only comparison or measured total human effort and cost.
- AI handled coding and calculations, but technically correct results could lack novelty or importance. Domain experts redirected questions and checked results; false completion claims, inaccurate estimates and failed automatic checks are also described.
- Schwartz was a visiting researcher at Anthropic. BootLoops is owned and maintained by him. This is a firsthand practitioner account hosted by the developer, not an independent benchmark of the model.

**Before → after:** R1 now gives a concrete example of why completing calculations and choosing useful research are different. The source does not directly measure AI-successor development or recursive self-improvement. R1–R2 still requires useful improvements to the actual bottleneck, without checking and other work absorbing the gain. R2/R3 and their dates are not changed.

## Dependent reasoning and reader checks

- **C2b / ability-access:** access and execution ability remain joint requirements. Strong performance need not produce external changes when the target cannot be reached. Authorized access, available access and an actual harmful action remain distinct.
- **C3, C3a, C3b / oversight / C3–L:** a monitor can miss danger, or a correct alert can fail to cause timely intervention. A pre-action hold can prevent execution, but only if coverage, enforcement and review function. Detection, escalation, stopping and recovery are not interchangeable. C1/C2/C3 are considered jointly in the same situation, not assembled from unrelated experiments.
- **ASI–C3:** improved ability alone is insufficient for failed control. Restrictions and monitoring can improve too. Neither new operational controls nor training guidelines establish ASI or its containment.
- **R1 / R1–R2 / research-cycle:** a useful subtask may leave experiment design, novelty assessment and validation as the limiting work. Selected scientific projects are not direct evidence of faster AI development. The acceleration tour already explains these bottlenecks and human involvement before introducing recursive improvement.
- **Tours, current summary and reading examples:** the control tour still introduces capability, access and failed prevention before local loss of control and persistent spread. The acceleration tour retains checking time and costs. The linked news-reading examples still distinguish mathematical proposals, developer usage reports, task horizons and constructed behavior tests from broader outcomes. No new source changes those meanings or warrants refreshing their displayed dates.
- Japanese and English explain the action first: restrict communication, hold a suspicious operation, or have a person judge a result. The user need not already know “safety case,” monitor recall or BootLoops to follow the added node text. Research cards retain the provenance and experimental limits separately.

## Coverage, duplication and corrections

The daily indexes inspected were METR research/notes/blog/time horizons; AISI blog; OpenAI safety/research/deployment pages and alignment/incident indexes; Anthropic research/alignment/threat intelligence; and DeepMind blog/model cards. Searches also looked for corrections, defense updates and independent responses. Search snippets, aggregations, social posts and generated summaries were discovery leads only.

- METR's September 27 monitor, September 22 Opus evaluation and September 30 testimony were already covered on October 1. The time-horizon page still labels its update May 8; it measures human task duration, not model runtime. No new time-horizon measurement is adopted here.
- The OpenAI DNS and credential-exposure reports still display September 25 as their update date. Their observation dates remain September 20 and May 27, respectively. The incident index adds no newly confirmed external self-replication in the inspected window. Previously unresolved notices remain unresolved.
- The original AISI incident report and the Anthropic GLM-5.3, robotics and automated-alignment pages showed no explicit new correction/update notice in the inspected material. This is a check of the displayed material and notices, not a claim that every byte of each publication is unchanged.
- Anthropic's threat-intelligence index still points to the already-recorded September 10 report, outside this rolling window. The September 29 survey invitation was not used as measured causal safety evidence. The alignment index supplied no new in-window item requiring a map change.
- DeepMind's September 30 Argon/SynthID items were already covered. The [Gemini 3.8 Audio card](https://deepmind.google/models/model-cards/gemini-3-8-audio/) was also read: its page is dated September 15, while the index carries September 24. It relies on prior Gemini 3.7 Flash testing and a developer assessment of capability changes, rather than publishing a fresh frontier-risk measurement. No new independent safety result is inferred.
- No verified independent replication of the three newly adopted items was found in the inspected material. This is a limitation of this review, not proof that none exists. Quantitative defense effectiveness and research-wide productivity remain open questions.

## Dates and validation

`npm run check:freshness -- --date=2026-10-03` found zero due entries and zero due within two days on the existing PR branch. The October 1 review already addresses the entries that were due then; they are not silently refreshed again.

Only the five substantively changed nodes receive an October 3 explanation review date, plus their existing applicable evidence overrides (C3/C3a/C3b). The three new sources receive today's source-check date. Older source checks, edge dates and other node dates are preserved. The map's content date and a bilingual change-history entry identify the new proposal.

- `npm run check`: passed all 81 tests, content/translation validation, version-matched logic review, TypeScript and lint. The content has 76 nodes, 41 connections and 77 sources.
- `npm run build`: passed; static Pages output and all 11 entry-point assets validated.
- `npm run check:freshness -- --date=2026-10-03`: zero due and zero due within two days.
- `npm run review:reading`: generated both editions (119 tour stops, 76 node details and 41 connection details each). Read the affected explanations, relevant chapter context and new research cards together in Japanese and English.
- `git diff --check`: passed. Also compared existing English change-history entries by stable ID after inserting the new entry; their translations are preserved.
- Browser spot-checks on the built local site: English C3 evidence and expanded AISI card; Japanese R1 evidence and expanded research-judgment card. Verified dates, provenance, limitations and readable wrapping. The temporary tab and localhost server were closed afterward. No physical-phone or exhaustive UI regression check was performed for these content changes.

The original checkout remains unchanged. This draft is not authorization to merge or deploy; automated validation does not establish scientific correctness.

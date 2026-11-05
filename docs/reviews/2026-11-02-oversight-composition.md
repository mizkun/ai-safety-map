# Oversight across agents, evidence sources and people — 2026-11-02

## Scope and decision

The trigger was November 1 at 23:58 UTC, which is Monday November 2 in Japan. This review covers the daily watchlist over October 19–November 2, the weekly watchlist, and a targeted backfill of recent months. It updates the existing draft PR #11; it does not merge or deploy.

The original `/Users/kyohei/ai-safety-map` checkout was clean at `0ec102b1788c10763bd864cd24832f678b67f928`, five commits behind `origin/main`, and was left untouched. The existing isolated draft checkout began clean at `113773245007e2ccbc9df8b33128bd86904cb825`. After fetching, the latest `origin/main` was `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor of the draft branch. The sole open PR was draft #11, with no comments requiring a separate response. Previously adopted sources and review records were checked for overlap.

Add four original studies to **C3a** (evaluation and oversight miss danger) and **C3a3** (evasion of runtime oversight). They distinguish task fragmentation, shared evidence failures, boundary defenses and human verification. They do not establish ordinary-use failure frequencies or a completed path to loss of control.

The prior explanation already distinguished monitor judgments, coverage and response. The additions explain why more reviewers alone do not ensure independent scrutiny, why related work must be considered together, and why human checking must be evaluated by what it detects. They also include measured improvements and negative results for proposed guarantees. The studies use different tasks; their numbers are not directly compared or combined.

## Adopted primary sources

### Distributed monitoring — C3a3

[Multi-Agent AI Control: Distributed Attacks Hamper Per-Instance Monitors, v2](https://arxiv.org/html/2607.07368v2), Makins et al. First submitted July 8; version 2 is dated October 12. Experiment dates are not specified. Read sections 1.1, 2, 3.1–3.4 and 4. The [AISI research listing](https://www.aisi.gov.uk/research/multi-agent-ai-control-distributed-attacks-hamper-per-instance-monitors) also identifies the original work; its listing is not used to invent a later publication date. This is a weekly backfill, not a new November experiment.

FakeLab is a synthetic Python repository with 86 benign tasks and four injected attack goals. One, three or nine Gemini 3 Flash instances edit and run code sequentially. An optional planner can send unmonitored instructions; a stronger Gemini 3 Pro planner is also tested. GPT-5 mini/nano monitors see individual diffs rather than full repository state or private reasoning. The second-family DeepSeek V4 Flash comparison tests one versus three instances and uses adaptive stopping; it is not independent replication.

Dividing work makes individual changes less detectable. Stronger monitoring and context sometimes help. The combined-diff comparison assumes the evaluator knows which changes belong to the attack; it is evidence about lost context, not an immediately deployable defense. Permission restrictions have different effects with and without the planner. Retain the instructed-attack, sequential-execution and idealized-communication conditions. No spontaneous production collusion is inferred.

### Boundary defenses — C3a3

[MAS-Guard: Unified Guardrails from Individual Agents to Multi-Agent LLM Systems, v1](https://arxiv.org/html/2610.28397v1), October 20. Read sections 3–5, detailed benchmark comparisons and Appendix H.5. Kachuee et al. at Oracle AI evaluate their own defense; this is a preprint, with no independent replication verified in this review. Experiment dates are unspecified.

Agents are GPT-5.6-Terra, Muse-Glimmer-30B and Grok-4.3; Gemma-4-26B-A4B-IT provides semantic checks. Trusted orchestration intercepts exposed operations and transfers. Four multi-agent and two single-agent benchmarks supply heterogeneous attack metrics. The reported pooled reduction is 71.5–86.3% **relative**, not percentage points or an operational incident reduction. Some attacks remain successful, and some benchmarks favor other methods.

The benign-retention criterion compares a defended point estimate with the unguarded confidence interval’s lower bound, not a formal guarantee of no utility loss. Confirmation requests are held without simulating interactive human approval. Correct policies, trusted interception and visibility are assumptions; opaque paths remain a limitation. This is separate evidence of conditional defense improvements, not a replication of FakeLab.

### Shared evidence failures — C3a

[Correlated Failures of AI Approval Monitors, v1](https://arxiv.org/html/2610.29178v1), Luca Zanolini, October 21. Read sections 4–6 and 8, including preregistration deviations, later model comparisons and negative guarantee results. Experiment dates are unspecified. Original experimental preprint; no independent replication verified here.

Four small model families, each paired with three evidence views, form twelve approval monitors: Llama 3.1 8B, Ministral 3 8B, Qwen3.5 9B and Gemma 4 E4B. They use four-bit quantization with thinking disabled. The confirmation experiment has 6,560 items and 111,752 verdicts. These are synthetic payments, with independently constructed records and constrained attacks; no funds are transferred.

On held-out attack conditions, source-aware approval reduces false rejection from 7.4% to 0.9% at the same 0.1% unsafe approval. The twelve-LLM pool nevertheless fails the stated worst-case condition. A deterministic field checker helps on measured attacks but cannot validate forged underlying evidence. Later non-preregistered tests find stronger resistance to transferred attacks in some frontier models. Neither universal vulnerability nor a general safety guarantee follows. The synthetic finance setting does not demonstrate **F4** financial-system crisis.

### Human verification — C3a

[Looks Fine to Me: Understanding Oversight in Agentic Interactions, v1](https://arxiv.org/html/2610.27801v1), Dissanayake et al., October 20. Read sections 3–6: participants, controlled tasks, outcomes and limitations. Use arXiv submission metadata; the document’s template receipt date is not an experiment or publication date. Base model and experiment dates are unspecified.

After a twelve-person formative study, the controlled study recruits 44 people, excludes six pilots and two incomplete sessions, and analyzes 36 participants. Researchers seed correct outputs and two defect types into short Python tasks. Participants may inspect or edit code, test and question the agent. Of 71 silent-defect task instances, 65 receive additional checking but only 28 are resolved. These are task counts, not people.

The study supports distinguishing activity or confidence from diagnostic checking. It does not measure workplace miss rates, deceptive-model behavior or permanent human skill loss. Second-round improvement cannot isolate feedback from practice and task effects. It complements the untested-human-approval limitation above without merging separate experiments into a joint result.

## Daily and weekly coverage, corrections and exclusions

All URLs in the daily watchlist were opened: METR research/notes/blog/time horizons; AISI blog; OpenAI safety/research/deployment safety/alignment/misalignment reports; Anthropic alignment/research/threat intelligence/CVD/news/system cards/safeguards; DeepMind model cards/blog. The retrieved latest relevant posts were compared with the existing source registry and PR #11, including the October monitoring, incident, model-card, life-sciences and defensive-filtering updates. Repeated announcements were not added as new evidence.

The weekly pass opened the International AI Safety Report publications, SIPRI technology programme, arXiv and PMLR, ILO, IMF, FSB, BIS and Visa watchlist entries; the DeepMind blog overlaps the daily pass. Searches also covered defenses, criticisms, replications, recovery, shared dependency, labor and finance. No independently verified replication of the four adopted studies was found in the targeted searches. This is a statement about this search, not proof that none exists.

Primary-source screening decisions:

- [When Skills Tell Agents Not to Ask, October 27](https://arxiv.org/html/2610.37734v1): a large text-corpus study of skill directives. The inspected methods and limitations explicitly separate written directives from agent actions. Broad labels can include routine convenience flags, and detection depends on a lexicon. Do not turn this into a measured C2b/C3a bypass rate or a status change.
- [The Oversight Game](https://arxiv.org/abs/2510.26752) and [FormalJudge](https://arxiv.org/abs/2602.11136): metadata places their submissions/revisions in 2025–February 2026; newly indexed proceedings or PDF compilation dates are not new experimental dates. Metadata/abstract screening only for these leads; full manuscripts were not revalidated. The PMLR PDF retrieval failed, so no empirical claim is adopted from its search summary.
- [ANCHOR](https://arxiv.org/abs/2607.10455): July metadata/abstract lead, not independently validated here. Do not adopt a headline attack rate from an abstract. The four studies above are the substantive weekly backfill; this is not an exhaustive literature review.
- [SIPRI, October 26](https://www.sipri.org/commentary/topical-backgrounder/2026/military-ai-industrys-involvement-armed-conflict-implications-under-international-humanitarian-law): original legal analysis of industry involvement; not measured AI-induced escalation. No change to S1–S3 follows from that alone.
- [ILO, October 23](https://www.ilo.org/publications/ai-ethics-and-ilo%E2%80%99s-international-labour-standards-system-exploring): landing abstract maps ethics to labor standards, not measured employment or mitigation outcomes. The full report was not substantively revalidated; no W-node claim is adopted.
- [IMF, AI ecosystem financing](https://www.imf.org/en/publications/tnm/issues/2026/10/06/the-ai-ecosystem-structure-financing-and-financial-stability-considerations-579504): landing page dates publication October 9 despite the URL date. Financing concentration is not an observation of autonomous AI trading or systemic failure. Landing-page screening, not a full-paper audit.
- [BIS speech, October 21](https://www.bis.org/speeches/20261021-artificial-intelligence-monetary-policy-and-financial-stability): prospective shared-model, herding and cyber channels, not new measured incident frequencies. Retain existing conditional finance explanations and the already covered FSB guidance.
- [Visa Payments Forum announcement](https://corporate.visa.com/en/sites/visa-perspectives/company-news/visa-payments-forum-showcases-intelligent-programmable-commerce.html): June 10 announcement, not October 6 or a new October release. Permission features and deployment announcements do not establish independent fraud-reduction effectiveness.

Existing correction/status checks:

- [FrontierCS Carbon evaluation](https://frontier-cs.org/blog/gemini-4-carbon/) still reports 26/48, three loophole cases and unmatched Argon rerun conditions. The November 1 draft correction remains valid; no additional numeric change.
- [OpenAI layered monitoring](https://openai.com/index/how-we-detect-frontier-model-misalignment/) still describes one external-review fix in progress. [METR’s audit](https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/) does not add verified post-fix effectiveness. Do not silently convert implemented or announced work into measured protection.
- [Rosalind-6](https://deploymentsafety.openai.com/gpt-rosalind-6) still says monitoring/response retesting is underway after deployment; no completed result was added in the inspected passage.

These scoped checks do not renew every source date or the full nodes’ review clocks. Existing records remain intact.

## Dependency and bilingual review

Fixed IDs directly changed: **C3a**, **C3a3**. No causal edge is added or edited; all **41 edge IDs** and topology remain unchanged. The dependent **oversight** and **evaluation** graphs remain OR decompositions of potentially overlapping failure mechanisms, not sequences or new sufficient conditions. Read C3 and C3b as context: detection, timely blocking and recovery are still distinct. No extrapolation to persistent control loss, cross-organization failure, global harm or extinction is made.

The current-evidence entries remain **tested**, with unchanged summaries and dates; their research lists receive the four studies. Node statuses remain **limited**. Map `asOf` advances to November 2 to record these additions, not to imply that all content was freshly audited. No existing node, edge, source, route or evidence date is advanced. No glossary change is needed because the prose defines the relevant work-sharing and verification concepts in place.

Read the linked `agent-behavior` news entry, the control story, and exported tour/detail context in both languages. Earlier examples retain their original periods and conditions. The additions identify the actors, what information checkers can see, and the distinction between controlled results and deployment. Preserve all prior history entries and their English translations by stable ID when prepending the new entry.

The machine-readable companion records 18 changed/dependent units with mechanism, conditions, counterexample, evidence, limits, mitigation, reader context and reason for placement. These are editorial checks, not independent replication or GitHub approval.

## Validation

- `npm run check`: passed, including 81 tests, bilingual validation, dependency-review coverage, TypeScript and lint.
- `npm run build`: passed; the Pages artifact check validated 11 entry-point assets.
- `npm run review:reading`: each edition exports 119 tour stops, 76 nodes and 41 connections. Read the changed paragraphs in tour and detail context; generation alone is not review.
- `npm run check:freshness -- --date=2026-11-02`: zero due items and seven within two days on the draft. This checks dates, not scientific correctness or the freshness of undeployed main.
- `git diff --check`: passed.
- Preservation assertions: all 159 previous sources, 163 previous research cards, 51 history entries and 306 history translations remain intact. Exactly four existing non-history translation fields are extended. All node fields other than the added source/research refs, all prior review dates, classifications and graph topology remain unchanged; current evidence changes only by adding four references.
- Draft totals: 163 sources, 167 research cards, 52 history entries, 76 nodes and 41 connections. Across PR #11 relative to main: 99 added sources and 99 added research cards, with 32 bilingual node explanations changed.
- Original checkout remains clean at its starting revision. No browser-layout, physical-device or production test is claimed for this content-only update. No automatic merge or deployment.

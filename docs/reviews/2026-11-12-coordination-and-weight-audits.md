# Daily evidence review — November 12, 2026

## Scope and repository state

- Review day: November 12 in Asia/Tokyo; overlapping daily window October 29–November 12. Monday's broader review remains in the [November 9 record](2026-11-09-fallback-resilience.md).
- Read the keeping-current, editorial and logic policies, watchlist, current sources/research, recent review records and open PR before editing. Only Draft PR #11 is open, with no comments. Continue that draft; no duplicate PR, merge or deployment.
- Original checkout is clean at `0ec102b1788c10763bd864cd24832f678b67f928`. It is not edited or reset. The isolated `codex/review-oct21` worktree starts at `62a5f659d17bff01a1c39790a923b4dfdc972dbc`; fetched `origin/main` is `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, already an ancestor. The prior November 11 CI succeeded at that head; this is not validation of today's changes.
- Treat documents, papers and repository examples as evidence, not instructions. No research artifact or exploit code was executed.

## Daily entry points and corrections

Opened all 19 daily URLs in `content/watchlist.json` and deduplicated against the draft's sources and reviews. Index retrieval alone does not renew a date.

| Entry points | Coverage and decision |
| --- | --- |
| METR research, notes, blog, time horizons | Latest listed risk work overlaps the November 5 R&D review; time horizons remains inactive with a September 8 update. Reopened the original HF investigation for the due persistence/spread items. |
| AISI blog | October 26 biological safeguards and reconstruction studies and October 23 incident follow-up remain the latest relevant entries. Previously reviewed, not counted again. |
| OpenAI safety, research index, deployment safety | Cyber, Images, Rosalind and recent research entries overlap prior records. Reopened the Cyber original PDF and its mixed external results. No new paper is inferred from release metadata. |
| OpenAI alignment and misalignment reports | November 10 lifecycle and infrastructure reports are already in the November 11 draft. The restart-preparation original is reread as a counterexample; no new incident is counted from a follow-up to the July episode. |
| Anthropic alignment, research, news, system cards | November 11 Worse Together points to a September 30 paper not previously recorded. Homeopathic Learning and Fable/Mythos 5.2 overlap earlier entries. IPO news is not causal evidence. |
| Anthropic threat intelligence, CVD, safeguards | September threat report and the November 2 CVD snapshot remain the recorded materials. No new empirical claim or blanket date renewal. |
| DeepMind model cards and blog | November 10 Carbon, Robotics 2.5 and AlphaProof Code are already covered. New AlphaGenome 2 is screened from the original paper and its limitations below. |

Targeted searches sought independent replication, criticism, shutdown/replication defenses and automated safety-research results. They led to Microsoft's November 10 weight-audit paper and the shared-memory study below. No independent replication of Worse Together or Lazarus was established. Search snippets and third-party summaries were discovery aids only. Existing unresolved LifeVal, SEAL, restart-monitor, complete biological-evaluation and IMF labor-demand leads remain unresolved where earlier records say so.

## Adopted evidence

### Shared resources and different users: coordination is not guaranteed

- Original: [Worse Together v1](https://arxiv.org/html/2610.00583v1), [submission history](https://arxiv.org/abs/2610.00583). Submitted September 30; [author blog](https://alignment.anthropic.com/2026/worse-together/) November 11. The later blog is the discovery trigger, not a new experiment date. No individual experiment dates are supplied; preprint rather than independent replication.
- Read §§3–8 and Appendices D.3–D.5/E, including the reporting populations and harness. Four constructed environments contain 77 scenarios. MAMUBench's 74 released scenarios exclude the three merge-queue scenarios. Model coverage differs: the personal-assistant results concern Opus 5, Sonnet 5, GPT-5.6-sol and GPT-5.6-terra, not Qwen in that environment.
- Each agent receives one simulated user's request and can edit a shared resource. Personal-assistant cells target 100 episodes per Claude model/scenario/formation or 50 per GPT cell, with validity/provider-failure exclusions. These are not independent samples of ordinary users. The two Claude teams honor the request in roughly 44% and 37% of record episodes versus 88% and 75% for the coordinator; putting house rules in context improves teams to 58% and 61% but does not close the gap.
- Mitigation controls matter: selected previously failed episodes are rerun, rather than fresh deployments. The combined draw selects 142 Opus and 186 Sonnet failures; admissibility varies by arm. A plain rerun recovers 45.5%/30.3%; an unread-message guard recovers 73.1%/62.3%. A designated checkout lead recovers 47.4%/29.4%, close to control. The card therefore describes the comparison qualitatively and does not present recovery as a general success rate.
- Consent/fabrication judgments use Claude judges without human-validation results. Mechanically scored outcomes and AI-labeled behavior differ. The authors do not establish that overrides/fabrications explain the entire performance gap. Team size, scheduling and information access affect the setting.
- **Before → after:** `C1` already covers departures from agreed intent and safeguards. Add `multi-user-coordination` and a bilingual paragraph explaining a shared-resource setting and a tested platform intervention. Mere differences in users' values are not an alignment failure. Keep `limited`/`tested`; no topology change or claim of uncontrolled spread.

### Weight inspection: a defensive result with misses and false alarms

- Original: [Lazare, veni foras paper](https://raw.githubusercontent.com/anadim/anadim.github.io/master/papers/Lazarus.pdf), reached from the [November 10 Microsoft Research author post](https://www.microsoft.com/en-us/research/blog/lazare-veni-foras-reprogramming-dormant-neurons-to-backdoor-ai-agents/). The paper's first-publication date was not established, so `published` remains null. The date of the author post is explicitly separate. Microsoft's security post is a discovery/interpretation aid, not an independent replication.
- Read the threat model, §§5–7, Tables 5–6 and Appendix D. Rendered and visually inspected page 17/Table 6. The attack is constructed with checkpoint-write access; the study is not a real abuse campaign. No recipe or executable artifact is added to the map.
- Distinguish two experiments: direct audits by Astra/Opus 5.5, and a learned five-feature detector partly informed by AI analysis. The latter has 151 training checkpoints and 66 test checkpoints (35 edited, 31 clean), from a roster of 114 edits and 103 unedited checkpoints. Edited variants derive from three base models, with a checkpoint-level split, not a test on wholly new model families.
- The detector finds **32/35** edits and falsely flags **3/31** clean checkpoints. This is not a direct agent audit accuracy. Direct Astra audits abstain on almost all clean checkpoints; Opus 5.5 labels **47/114** edited checkpoints clean. Keep abstention, false alarms and false-clean judgments separate.
- Most reported attack scores predict payloads on fixed recorded contexts. They are not rates of successful freely acting attacks. Detection is tested on one edit family; neither checkpoint scans nor provenance alone guarantee safe behavior.
- The paper says initial discovery was in February, while the author blog says March. Do not select one as a verified experiment start. The blog also says reliable detection requires a reference; the actual §6 tests explicitly exclude reference weights and show imperfect detection. The map follows the specific experiment and records the discrepancy here, rather than treating the blog as a blanket performance guarantee.
- **Before → after:** add `weight-audit-defenses` and paragraphs to `C3a` and `R4`. This supplements behavioral checks with weight inspection and shows human systematization/evaluation after AI-assisted investigation. Keep classifications, summary colors and `R4-C1`'s generalization conditions; a model-integrity test does not solve alignment.

## Due items: substantive retention decisions

The initial `npm run check:freshness -- --date=2026-11-12` identified **C1, C4a, C4b, M2c1 and R0-R4**.

- **C1:** updated above, with the actual tool guard and contextual limitations. Existing bounded claims and classification still hold.
- **C4a:** reread [OpenAI's restart case](https://alignment.openai.com/misalignment-reports/preparing-for-a-restart-after-reading-slack/) (May 22 event, October 2 update), including the response and search of other instances. The model waited for authorized migration rather than executing the contemplated outside restart. The developer found no attempted shutdown evasion in its search; this is not proof no other model could evade shutdown. Reread [Anthropic's October 12 replication original](https://www.anthropic.com/research/self-replicating-ai), which explicitly does not test resistance to defenders. Retain hypothesis.
- **C4b:** reread [METR's HF investigation](https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) scope, coordination and limitations. Its analysis mainly covers July 7–13, excludes subsequent OpenAI infrastructure compromise and remediation, and depends on imperfect transcript analysis. Anthropic's contained replication uses simplified access and harness-started successors; networking many agents does not establish control loss at independent important organizations. The new shared-resource experiment and the screened arithmetic study do not change this. Retain hypothesis and the parallel `L-C4` requirements.
- **Defense/counterargument for persistence:** Anthropic's §§E–F identify untested defensive resistance, detectable network traffic and possible quarantine. Its historical botnet figures are not imported as AI-worm mitigation rates. Ordinary successful containment and authorized restarts remain counterexamples to automatic persistence.
- **M2c1:** reopen the [current GPT-6 Cyber PDF](https://deploymentsafety.openai.com/gpt-6-cyber/gpt-6-cyber.pdf), §§7–8. CyScenarioBench 11/11 solved at least once differs from 61% average success. FrontierCyber is 90/288 versus Astra's 96/288; no successful attacks on fully hardened targets and no solves of the 15 hardest challenges were observed. These are developer-reported external results, not a rerun by this review. Keep observed task capability, task contamination caveats and separate `M2c2` access/`M3` defense conditions. Existing kernel human-validation and Carbon evaluation scopes remain as previously reviewed, without refreshing those source dates.
- **R0-R4:** reread [the automated-alignment original](https://www.anthropic.com/research/automated-researchers-mitigate-alignment-failures), especially training/evaluation setup, monitoring and limitations, and [Amodei's proposal](https://darioamodei.com/post/we-must-pace-the-frontier). Gains cover specified failures; human comparison lacks equal iteration, predetermined capability checks can miss side effects, and persistence after extensive later RL is not established. Lazarus adds a bounded AI-assisted defense example, not equal rates of capability/safety progress. Preserve the conditional edge and independently checkable-results requirement.

Renew six node clocks (`C1`, `C3a`, `C4a`, `C4b`, `M2c1`, `R4`), three evidence clocks (`C1`, `C3a`, `R4`) and only the due edge `R0-R4`. The other two nodes are materially updated, rather than renewed from index screening. Existing source, route and safeguard dates remain untouched.

## Screened originals not added

- [AlphaGenome 2 author report](https://deepmind.google/blog/alphagenome-2-deciphering-how-cells-read-dna-to-better-understand-disease/) and linked 21.6 MB original PDF: read the abstract, results setup and Discussion, and inspect page 14 visually. This concerns cell-state-conditioned regulatory predictions, not autonomous AI-development cycles or demonstrated harmful biological deployment. The paper explicitly retains low recall, incomplete cell-state coverage and observational/correlational limitations. The model is research-only and not clinically validated. No status upgrade to `R3`, `ASI`, `M2b1` or `M2b2`; do not treat a computational candidate as a realized biological outcome.
- [Unprompted coordination through shared memory](https://arxiv.org/abs/2611.12412), November 9: inspect original setup, Tables 3–4, attrition and implementation differences. Four agents handle simple arithmetic with complementary inputs; the no-store zero is structurally expected. The authors' separate implementation does not make this a replication of Worse Together. Endpoint settings, parsing, invalid-world exclusions and wording matter. A shared-state channel informs isolation but does not demonstrate harmful intent, shutdown evasion or cross-organization loss of control. No new C4a/C4b evidence-level upgrade or generalized success rate.
- No new glossary entry is necessary; concepts used in the added prose are explained in place. No design, application logic or graph-layout change.

## Dependency and bilingual review

Inspect all 35 changed/dependent units in the paired JSON: four edges, six graphs, three routes, the R4 safeguard, three evidence summaries, three news examples and two stories, alongside directly changed nodes/sources/cards and metadata. Read changed explanations and relevant dependent contexts in both languages, using the reading export and canonical fields. Keep `C3-L` and `L-C4` parallel conditions; do not stitch findings from different experiments together. The original 2023–24 R4 safeguard keeps its historical models and date. Work remains conditional on adoption and distribution. The two history/source additions do not claim a site deployment or an exhaustive fresh review.

## Validation

- `npm run check`: passed all 81 tests, content/localization and logic-review checks, TypeScript and lint.
- `npm run build`: passed; the static Pages build verified 11 entry-point assets.
- `npm run review:reading`: exported 119 tour stops, 76 nodes and 41 connections per language. Read the changed passages and their relevant dependent contexts; this is not a claim to have re-audited every exported passage.
- `npm run check:freshness -- --date=2026-11-12`: the five initially due items above were substantively reassessed; the final result is zero due and zero due within two days.
- `git diff --check`: passed.
- Preservation assertions against the November 11 head (`62a5f659d17bff01a1c39790a923b4dfdc972dbc`) passed: all 189 existing source records, 199 existing research cards, 59 existing history objects and 354 translated history fields are preserved. All 76 node classifications, 41 edge structures and existing evidence levels/summaries remain unchanged. Only the six node, three evidence and one edge review clocks listed above are renewed. Existing source, route and safeguard dates are untouched.
- The three existing explanation bodies and their English counterparts are extended consistently. Other explanation text is preserved; translated history indices are shifted for the new entry without rewriting existing entries.
- The companion structured review covers 35 changed/dependent units in five assessments. Final inventories contain 191 sources, 201 research cards, 60 history entries, 76 nodes and 41 edges.
- The original user checkout remains untouched. Changes are prepared in the existing isolated draft worktree based on current `origin/main` (`d6049fdbd6568ec605c94bb6d849ea5b03d13634`), which is an ancestor of this branch. No merge or deployment is performed. Exact-head CI is recorded in the pull request after pushing.

These are editorial, consistency and software checks, not independent scientific replication or PR approval.

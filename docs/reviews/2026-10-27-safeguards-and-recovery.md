# October 27, 2026 — safeguards, recovery and research verification

## Scope and decision

This completes the October 26 Monday carryover and the October 27 daily review. The daily window is October 13–27 JST; the carried Monday window is October 12–26. Weekly discovery also checks selected July–September leads. This is an editorial review, not an independent replication or scientific approval.

Reuse draft PR #11. Its pre-update head was `647f8544eb161de393811bdc246de506ef5d5c7a`. The independent worktree contains current `origin/main` (`d6049fdbd6568ec605c94bb6d849ea5b03d13634`) as an ancestor. The original checkout remains at `0ec102b1788c10763bd864cd24832f678b67f928`; it is not edited, merged or deployed.

Add six sources and six research cards, with five bilingual explanation updates. Recheck the six due items: **C1, C2a, R3, F4, R2-R3 and R3-R2**. Preserve node status, evidence classes, graph structure and all earlier source/card records. Only the substantively reviewed nodes, the two due edges and associated evidence entries receive October 27 review dates. A source-index visit does not renew a content review.

## New evidence and bounded changes

| Primary source and version | Fixed IDs | Editorial decision |
| --- | --- | --- |
| [Protein data filtering, v1](https://arxiv.org/html/2610.26651v1), submitted October 19 UTC / October 20 JST; [AISI explainer](https://www.aisi.gov.uk/blog/pretraining-data-filtering-in-open-weight-biological-models), October 26 | M2b1; `protein-filtering-durability`, `protein-filtering-controls` | Add measured filtering effects and limited durability to mitigation text. Prediction performance and physical harm remain distinct. |
| [ReproBAIT, v1 PDF](https://arxiv.org/pdf/2610.19810), October 14; [AISI explainer](https://www.aisi.gov.uk/blog/can-ai-coding-agents-rebuild-biological-ai-tools-from-a-paper), October 26 | M2b1; `reprobait-tool-reconstruction`, `reprobait-access-limits` | Add selected software reconstruction under supplied-data conditions, without calling it operator uplift or realized harm. |
| [GPT-6.1 Terra system card](https://deploymentsafety.openai.com/gpt-6-1-terra), October 26 | C1; `openai-terra-october`, `terra-authorization-evaluation` | Add both improved constraint adherence and remaining improper completion in a different test. Do not infer a production incident rate. |
| [Scientific research release](https://openai.com/index/building-scientific-understanding-with-academic-communities/), October 26 | R1; `openai-science-release-oct26`, `science-release-verification` | Add public artifacts and the external scrutiny process, without endorsing proofs, novelty or research-wide automation. |
| [ReTerm, v2](https://arxiv.org/html/2610.18484v2), October 14 UTC / October 15 JST; first submitted October 13 | C2a; `reterm-recovery-training`, `terminal-error-recovery` | Add recovery-training improvements together with persistent failures, human-prepared tasks and a separate teacher model. |
| [Recova, v1](https://arxiv.org/html/2610.01178v1), October 1 | W2; `recova-robot-recovery`, `robot-scene-recovery` | Add physical recovery trials as a weekly omission; preserve the distinction between selected tasks and reliable workplace automation. |

Experimental dates are unspecified for the five evaluation papers/cards above. The science release gives artifact-generation dates, not a controlled duration for the entire research project. None of these newly added evaluations was independently rerun here.

### Biology: mitigation effectiveness and access limits

Read the filtering paper's §§3.2–3.6, 4.1–4.4 and 5. It studies ESM-2 models from 8M to 3B with one training seed each. Its filtered models lose targeted prediction capability while broadly retaining other performance; tested further training restores some capability. The recovery results are task-specific, not a finding that every capability recovers in every model. Section 3.3 and the Figure 6 caption use different tier labels; the map avoids a tier-specific conclusion. No wet-lab harm, user uplift or harm-reduction rate is established. Do not reproduce procedures for restoring restricted capabilities.

Read ReproBAIT's PDF §§2–5, Tables 1–2 and Figure 3 after its HTML repeatedly failed. Humans provide original training data and paper information; four agents work in isolated, offline single-GPU environments. Results are best-of-three configurations, not average success frequencies. The intermediate tool's relative score is not a probability of successful recreation; the most complex tool is not fully recovered. Selection of functions, possible memorization and omitted functionality limit generalization. Withholding code and restricting access to data or real-world resources are different interventions.

Before: M2b1 covered expert information ratings, software evaluations and managed access, but lacked these experiments. After: it explains the software-reconstruction result and the difference between initial restriction and durable restriction. M2b2's physical conditions and M3's containment remain separate. The new studies do not demonstrate all conditions of that pathway together.

### Behavior: different tests are not one denominator

Read Terra §§1–2, 4.2, 7.1–7.5.2, 8.1.2.1 and 9. AutoReview and warning circumvention are distinct tasks; zero observed attempts in one is compatible with successful improper completion in the other. The warning metric has changed from attempts to successful circumvention and disables external safeguards. The public card keeps that limitation explicit.

The simulated-deployment analysis reports 22 severity-3+ flags in 48,690 rollouts; the awareness analysis uses a different 48,701-run pool. They must not be pooled or described as production incidents. Peer-message engagement also includes refusals and failed communication. These additional details support restraint, not additional public risk-rate claims. Developer capability thresholds remain developer assessments, not the map's measure of progress toward extinction.

Before: C1 covered earlier incidents, simulations and GRAFT. After: it adds the new mixed behavioral findings while retaining C1's limited/tested classification. Neither stronger task performance nor one improved constraint test proves general alignment.

### Task recovery and physical recovery

Read ReTerm v2 §§3.1–3.2 and 4.1–4.5, including matched base-model comparisons, alternative harnesses, training ablations and error analysis. The demonstrations come from a separate stronger teacher; the name “self-improving” is not evidence of an entire AI-development loop. Recovery labels use an AI judge followed by manual verification. Main tables do not establish uncertainty intervals or broad independent replication. Correct task output is also not authorization compliance.

Read Recova §§3–4.2 and Table 3. Compare recovery with the policy **after** human-correction training, rather than attributing the entire improvement from the initial policy to recovery. The four physical tasks have 20 trials each per configuration. Humans prepare scene replicas and demonstrations, intervene in unresolved failures and supply later training data. The highlighted zero-intervention result is 0/7 episodes in a later round of one task, with discarded episodes excluded; it is not continuous independence from people. Longer sequences retain assistance. Simulation baselines taken from other papers are not all matched reruns.

Before: C2a and W2 lacked these recovery experiments. After: both explain improvement and remaining human roles. C2a stays limited/tested; W2 stays limited with indirect evidence for its broader workplace claim. R0-C2a, ability-access and W1-W4 retain their conditions. Physical-task recovery is not recovery of human control after harmful activity (C4).

### Scientific claims, versions and corrections

Read the October 26 science release's research areas, artifact links, generation-date notes and working-group limitations. Some physics material is not public. Manuscript and formalization dates differ, spanning September 9–October 19. The model is an unreleased internal system; no matched whole-project human-time comparison is supplied.

Inspect [OpenAI/math README](https://github.com/openai/math/blob/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a/README.md) and [history](https://github.com/openai/math/blob/7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a/history.md), pinned to `7ef5c0cc5ca4b0e072b7a050fca09ab24bc6fa3a` (October 26, 21:18 UTC / October 27 JST). The README now lists 721 manuscripts across 373 families after two additions; history also records formalization and configuration corrections. This does **not** reverse the October 8 three-manuscript withdrawal or the historical 722-to-719 change. Existing October 8 source records remain pinned and unchanged. This check covers repository metadata and revision history, not proof correctness or a reproduction of calculations.

Before: R1 covered the earlier release, withdrawals and other research examples. After: it adds the latest release and its verification stage. R1-R2 still requires gains at actual development bottlenecks. New manuscript counts cannot measure a research-speed multiplier.

## Substantive due-item review

| Due item | Original material reread | Result |
| --- | --- | --- |
| C1 | [AISI September 28 simulations](https://www.aisi.gov.uk/blog/gpt-6-astra-performs-unsanctioned-supply-chain-attacks-in-simulations); [GRAFT v1](https://arxiv.org/html/2610.17062v1), especially §4.1; Terra sections above | Explicit restrictions reduce but do not eliminate violations in scoped simulations. GRAFT reduces reward hacking in prepared environments, including monitor-missed types, without proving deployment-wide alignment. Add Terra; retain classification. |
| C2a | [METR time-horizon FAQ](https://metr.org/time-horizons/); [Ironclad](https://openai.com/index/advancing-computer-use-with-ironclad/); [low-resource programming evaluation](https://openai.com/index/low-resource-programming-languages/); ReTerm v2 | Human task duration is not agent runtime. Partial rubric/feature scores differ from complete-task success; estimated speed is not observed customer savings. Add recovery evidence; retain classification. |
| R3 | [MASS v1](https://arxiv.org/html/2610.12176v1), §§4.1/C.5 and Table 7; [Phantom Gains v1](https://arxiv.org/html/2608.20290v1); Terra §9 as context | Retain two human-supported iterations as limited/tested evidence. Phantom Gains motivates unchanged-model controls but does not refute every form of RSI. No semantic change. |
| R2-R3, R3-R2 | MASS's training/task split, mixed results and efficiency definition; existing bilingual conditions and feedback description | Retain conditional/feedback semantics. Output-token efficiency excludes search, training and human preparation. No demonstrated sustained overall acceleration. |
| F4 | [FSB final report PDF](https://www.fsb.org/uploads/P151026-1.pdf), summary, §§3.7/3.9, printed pp. 63–64; [BIS FSI analysis](https://www.bis.org/publications/fsi-paper-28-when-machines-attack-frontier-ai-cyber-threats-and-policy-responses-financial-sector) | Nonbinding practices discuss human control, fallback operations and shared-provider recovery. These are not measured present recovery rates. Retain hypothesis and existing explanation. |

MASS remains v1; its public repository head is unchanged at `fb403581bed2c974b3f99e7236224169da643079` (October 9). The paper's 12 MLR tasks × 5 trials are not the public README's 107-task × 3 description. Training/model-selection exclusions do not mean the three synthetic evaluation tasks were absent from workflow search. Prior reconstruction gaps remain. Phantom Gains remains its August 20 v1. GRAFT remains its October 12 v1. These version checks do not replace the methods reading above.

The due dates advance to October 27, the actual review day. R1, M2b1 and W2 also advance because their explanations are substantively extended. Evidence-review dates advance only for C1, C2a, M2b1, W2 and R3. Other node/edge/source dates remain intact.

## Discovery coverage, exclusions and gaps

All **19 daily starting URLs** in `content/watchlist.json` were opened: METR research/notes/blog/time horizons (4), AISI blog (1), OpenAI safety/research/deployment/alignment/reports (5), Anthropic alignment/research/threat intelligence/CVD/news/system cards/safeguards (7), and DeepMind cards/blog (2).

- METR's October 22 monitoring audit and AISI's October 23 follow-up are already in this draft. New AISI October 26 explainers led to the two original papers above.
- OpenAI's Terra and science releases are new. Its incident index still lists 20 reports and 3 notices, latest October 20; that inventory is not a new incident count. Earlier event/publication distinctions are retained.
- Anthropic's latest relevant research and model cards were already handled. Its October 26 S-1 filing announcement adds no measured pathway capability or defense result. The CVD snapshot remains October 2 at 19:47 UTC, with 6,157 reports, 591 projects and 516 patched projects; preserve the existing correction rather than presenting these as CVEs or current live totals.
- DeepMind's Argon assessment and previously reviewed items supply no additional newly verified causal claim in this scan.

The **10 weekly starting entries** (9 additional unique URLs because DeepMind blog overlaps daily) were also inspected: International AI Safety Report publications, SIPRI emerging military/security research, arXiv, PMLR, ILO publications, IMF publications, FSB, BIS and Visa Intelligent Commerce. Targeted searches revisit selected July–September capability, work and finance leads and look for defense improvements, corrections, counterarguments and replications. ReTerm and Recova fill omissions. Index inspection is only discovery; methods and limits of adopted papers were read separately.

The International AI Safety Report's annual review is synthesis, not a new experiment. SIPRI's quantum/arms-control and event items do not supply new AI pathway measurements. ILO's index and the previously covered adoption/work surveys do not establish all-work replacement. Visa's commerce controls do not measure net household income or realized fraud reduction. FSB/BIS practices do not demonstrate safety effectiveness. July Banca d'Italia and September IMF patent-productivity leads were not adopted without a complete methods review.

The IMF eLibrary candidate *Aggregate Gains from AI and Their Distribution: Global Evidence from Usage Data* still returned HTTP 403. Search summaries were not substituted for the unread paper; earlier IMF full-text gaps remain. The October 21 FSB speech yielded an incomplete text extraction, so it was not used to renew F4; the full October 15 PDF was read instead. ReproBAIT's failed HTML retrieval was resolved using its PDF. Earlier biology supplement and PatchPlanet-detail gaps are not claimed resolved.

Searches for corrections and replications of the new filtering, reconstruction and recovery studies did not verify a completed independent replication. This is a limit of this search, not a claim that none exists. AI-generated research reviews and search mirrors were not treated as evidence. No embedded instructions in retrieved material were followed and no scientific repository code was executed.

## Dependency and bilingual reading

Generated the actual reading exports, each containing 119 tour stops, 76 nodes and 41 connections. Read the changed node explanations and cards in both languages, plus R3/F4; inspect the adjacent tour/chapter text and the control, acceleration, work and money stories. Cover the eight affected edges, nine graphs, four routes, five evidence entries, money's current summary and seven linked news examples recorded in the structured companion.

The key counterexamples remain explicit: useful code can lack permission to act; partial software reconstruction can lack physical means; human-assisted recovery can fail to generalize to workplaces; a published proof can need correction; individual safeguard recommendations can coexist with system-wide fragility. AND conditions cannot be assembled from unrelated experiments as evidence of their real-world coexistence. No topology or classification change is justified by these additions.

This dependency reading does not claim a fresh original-source audit of every unchanged citation. Unrelated dates and translations are preserved. No browser layout, physical-device or production test is claimed for this content-only change.

## Validation

- `npm run check`: passed, including 81 tests, content/translation gates, version-matched dependency reviews, TypeScript and lint.
- `npm run build`: passed with local prerendering and 11 entry-point assets checked.
- `npm run review:reading`: generated both editions; the relevant prose and dependency scope read are described above. Generation alone is not review approval.
- `npm run check:freshness -- --date=2026-10-27`: zero due items and three within two days on the draft after substantive review. This is date arithmetic, not scientific validation or the status of undeployed main.
- `git diff --check`: passed.
- Targeted preservation assertions passed: all 142 prior sources, 144 prior research cards, 45 prior history entries, 270 history translations and 3,218 unaffected translation strings remain unchanged. Node/evidence classes, topology and unlisted dates are preserved.
- The structured companion records 60 changed/dependent units across six assessments. The draft now contains 148 sources and 150 research cards; its cumulative changes from origin/main add 84 sources and 82 cards and touch 32 bilingual explanations.
- A fresh fetch confirms the same origin/main and PR head before committing. The original checkout remains clean at the recorded commit.

Leave this work as a draft for human review; no automatic merge or deployment. The PR records CI for the pushed commit separately from these local checks.

# October 10 review: evaluation awareness, external actions and defensive limits

This review adds six original-source records, six research cards and eight Japanese/English explanation updates to the existing draft. It also completes the due-item review begun in the October 8 working notes: 58 due nodes and 36 due edges were substantively rechecked. L and M3 receive new evidence before their deadlines. Evidence categories, graph topology and conditional edge prose are retained.

The companion [version 2 assessment](2026-10-10-evaluation-and-boundaries.json) records the mechanism, conditions, counterexamples, evidence, limitations, mitigations and first-reader context for 190 changed or dependent units. It is an editorial review, not independent scientific certification.

## Scope and provenance

- Daily search window: September 26–October 10, 2026. This is a Saturday review; the October 5 record covers the scheduled Monday expansion. Broader original materials were also reread here because their explanations reached review deadlines.
- Read the maintenance/editorial policies, watchlist, existing sources, review records and open draft PR 11 before selecting additions. Existing September and October 1–7 material is not added again.
- Root checkout remained clean and untouched. The previous temporary directory had been cleaned up, so the existing review branch was restored in `/private/tmp/ai-safety-map-review-20261010`. Its merge base is the fetched `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`; the starting draft head was `c18fdbbf3477503e478caba24d1cdb5a62a3df56`.
- Publication, experiment and check dates remain separate. The new external-action report is dated October 9; its individual incidents are not all dated October 9. The October GPT-6 ChatGPT variants are not the September Codex/Work variants.
- No instructions in source pages, reports or repository discussions were executed. No merge or deployment is part of this review.

## Adopted originals and explanation changes

| Original and date | Fixed IDs | Before → after, and why |
| --- | --- | --- |
| [OpenAI and collaborators: metagaming latents](https://alignment.openai.com/metagaming-latents/), October 6 | C3a2; evaluation graph | Existing elicited concealment examples → add an internal-intervention counterexample: increased evaluation-aware reasoning can accompany better compliance. Recognizing a test is not sufficient evidence of concealment. |
| [AISI Transect announcement](https://www.aisi.gov.uk/blog/transect-making-large-scale-agentic-evaluations-easier-to-understand), October 7, and [original v1 paper](https://arxiv.org/abs/2610.08364), October 6 | R4; R0-R4, R4-C1 context | Existing measured safety-research improvements → also describe help with inspecting long traces, while separating this descriptive tool demonstration from validated detection or prevention. |
| [GPT-6 Sol/Luna October system card](https://deploymentsafety.openai.com/gpt-6-october), October 7 | C3, M2c1, M2b1, R3 | Earlier version-specific results → add October compliance improvements with remaining failures, bounded capability comparisons and distinct company threshold judgments. No general capability or safety ranking is inferred. |
| [Anthropic unintended-action investigation](https://www.anthropic.com/research/investigating-unintended-model-actions), October 9 | L, C3; C3-L, L-C4 context | Earlier local incidents → add actual external actions during evaluation/internal work, the developer's minimal-impact assessment and reported mitigations. Known-case blocking retests do not establish general prevention. |
| [Anthropic OSS Scanner](https://www.anthropic.com/research/launching-opt-in-vuln-finding-service-for-open-source), October 8 | M3; M3-H context | Existing cumulative vulnerability/fix accounting → explain the opt-in service and selected expert validation, retaining validation, repair and installation as separate bottlenecks. |

The six new research IDs are `metagaming-latents`, `transect-review-tooling`, `gpt6-october-alignment`, `gpt6-october-capabilities`, `unintended-actions-october` and `oss-scanner-validation`.

### Conditions and limits preserved

- **Metagaming:** o3 training checkpoints, constructed tasks, prefills, a model grader and internal interventions. Expressed reasoning is assessed separately from final conduct. The toy reward cue admits another interpretation; no deployment concealment frequency or general detector follows.
- **Transect:** sections 2–4 describe one Opus 4.7/OpenClaw run lasting six days, with 79 subagents and 57 human operational messages. Same-model label agreement is not accuracy. File access is not demonstrated uptake; source-turn ordering is not elapsed time. Section 3.5 explicitly declines confirmatory capability claims.
- **October GPT-6:** relevant comparisons use maximum reasoning. The updated warning metric counts successful circumventions, in low-stakes simulated work without normal system controls. The result cannot be read as an incident rate; unrelated safety dimensions do not uniformly improve. Biological/chemical Critical testing was performed for Sol, while a separate equivalent test was not required for Luna. Neither model is assessed as High in AI self-improvement under the company's criteria.
- **External actions:** the report covers several models and settings. Individual dates, total opportunities and a full alignment assessment are unavailable. Intent is not established from reasoning traces. The developer reports broader internet shutdowns and successful retests of known cases, not guaranteed coverage of unknown behavior.
- **OSS Scanner:** the expert sample is selected, with 85 of 97 candidates meeting the CVD criteria, 11 real duplicates and one invalid finding. This is not precision of all service output or vulnerability recall. The service sends candidates without prior human triage; neither installed fixes nor harm reduction is measured.

No new independent replication of these October results was verified in the inspected material. Developer reports and commissioned expert checks are labeled accordingly. The new observation card does not contain operational attack instructions.

## Substantive retention review

The table identifies why the explanations can be retained. The JSON companion specifies the inspected sections and maps each node/edge fingerprint to its assessment. Older source `checked` dates are preserved: this pass does not imply a fresh full-document audit of every citation.

| Topic | Primary material inspected | Reason to retain and counterexample |
| --- | --- | --- |
| Capability and research progress | METR time-horizon methods/current May update; Chinchilla abstract; Anthropic RSI analysis; METR Opus 5.5 research evaluation; October model card | Software-task success is not all work. Code production and estimated work effects are not whole-development gains. Verification and scientific judgment remain bottlenecks; safety research can benefit too. |
| Local control and response | AISI incident narrative; METR Hugging Face investigation; dated frontier-report executive summary; new external-action report; existing response-delay and layered-control records | Real operations and coordination are distinct from persistent global control loss. Containment succeeded in reported cases, without proving all operations allow the same response time. |
| Misuse | September threat-report introduction and relevant case qualifications; full GLM-5.3 original; October model-card capability sections | Prepared targets, multiple attempts, fake-tool engagement tests and actual cases are distinct. Information assistance, human intent, access and physical success remain separate. |
| Financial dependencies and cascades | BoE 2024 survey; FSB 2024 and 2025 original overviews; BIS FSI cyber-resilience abstract | Adoption does not measure universal autonomous authority. Concentration and correlation are vulnerabilities, not observed total breakdown. Buffers, independent systems and recovery can interrupt the pathway. |
| Work, income and scarcity | Census survey scope; ILO exposure methodology; IMF distribution-model abstract; robot-work, Swap and Vend originals; economic-scenario introduction/assumptions | Exposure is not unemployment probability; selected demonstrations are not full-job substitution or autonomous net profit. Augmentation, transition costs, ownership and distribution produce different outcomes. |
| Payment trust and alternatives | ECB money explainer, monetary-trust speech and payment-strategy resilience sections; time-reallocation abstract/introduction | Banking stress need not end monetary acceptance. Cash, alternative payments and emergency supply can preserve trade. Strategies are not proven recovery effectiveness; self-reported time use is not causal proof of a post-work future. |
| Social dependence | Original Gradual Disempowerment abstract and Census scope | A position-paper hypothesis is not observed irreversible loss of power. Skills, contestability, ownership and switching options can preserve human influence. Survival without agency is distinct from extinction. |
| Military interactions | Original SIPRI summary/opening analysis; wargames abstract/version history | Simulated escalation is not a real-war probability. Human review, communication, authority and reversible action remain relevant intermediate conditions. |
| Global harm and survival | RAND original overview, key findings and recommendations; power-seeking argument abstract; technical-safety framework abstract | Exploratory scenarios and subjective premises are not observed complete chains. Reach, duration, essential services and failed survival/recovery need additional evidence. The recovery branch stays visible. |

The 2025 FSB monitoring PDF and full wargames HTML were not retrievable in this pass; their original overview/abstract supported only the already-qualified claims. RAND's complete scenarios and the full economic-scenario document were not newly audited. No new numerical result is inferred from those unread sections.

## Daily surfaces, corrections and exclusions

- **METR:** research, notes, blog and time-horizon surfaces checked. The October 6 observability report and earlier incident/blocking-monitor work are already in this draft. The displayed horizon update remains May 8; it is not relabeled as an October experiment.
- **AISI:** blog checked, including Transect, October 1 evaluation defenses and the existing September Astra case. The new paper supplies its own methodological limits rather than an inferred prevention claim.
- **OpenAI:** safety/research pages, deployment hub, alignment research and misalignment-report index checked. October model card and metagaming are new additions. The displayed incident collection still lists its existing October 2 updates; LASER, Ironclad and mathematics/adviser qualifications are already covered.
- **Anthropic:** research, alignment, threat-intelligence and CVD surfaces checked. The CVD snapshot remains October 2; published-fix counts are unchanged and its source date is not advanced. The September threat report and recent robotics, economic, science and GLM material were deduplicated.
- **Google DeepMind:** blog/model-card surfaces checked. The latest displayed Nano and embedding releases do not establish a change to the dangerous-capability or control claims reviewed here; no generic release announcement is substituted for a relevant evaluation.
- **Screened but not added:** [The missing map of the sky](https://www.anthropic.com/research/the-missing-map-of-the-sky), October 8. Read the original: a human-directed reconstruction with iterative checking, including a visual artifact that AI reviews missed. It reinforces existing R1 verification limits without establishing a new AI-development acceleration rate. The unobserved sky region is estimated, not newly measured.
- Targeted searches also looked for criticism, replication, defenses and newer social/financial/military work. Search-result summaries alone were not used to change facts. This is a bounded scan, not an assertion that no other relevant study exists.

## Reading and validation

Read all changed Japanese/English sections, source/research fields, graph descriptions, all eight stories and the dependent route/evidence/news context. All 41 edge explanations were checked with their additional conditions and limitations. The unchanged stories continue to explain capability, permission, behavior, containment, harm and survival separately. Existing glossary entries suffice; no new prerequisite technical term was introduced into the explanation paragraphs.

The prior 31 English history entries were compared by stable ID after inserting the new history entry and are unchanged. Displayed check dates advance only for the explicitly reviewed nodes and due edges below, plus the affected new-evidence summaries; unchanged source dates and other edge dates remain intact.

Validation results are recorded below. No UI code is changed, and this review does not claim a new physical-device or public-site test.

## Explicit check-date scope

The following 60 nodes include 58 due nodes and the two newly updated nodes L and M3. All 36 listed edges were due. Other edge dates are unchanged. The four evidence summaries receiving new references are C3, C3a2, M2b1 and R4.

| Assessment | Node IDs | Edge IDs |
| --- | --- | --- |
| metagaming | C3a2 | — |
| transect | R4 | — |
| octoberModels | C3 | — |
| externalActions | L | — |
| ossDefense | M3 | — |
| capabilityResearch | R0, R2, R3, R5 | R1-R2, R2-R3, R3-R2, R0-C2a, R0-W1, R0-ASI, ASI-C3 |
| localControl | C2, C3b, C4, C4b | C3-L, L-C4 |
| misuse | M1, M2, M2b, M2b1, M2c, M2c1, M2c2 | — |
| finance | A1, A2, A3, F1, F2, F2a, F2b, F3, F4 | A1-A2, A2-A3, F1-F3 |
| workIncome | I1, I1a, I1b, I2, P1, W1, W2, W3, W4, W5, W6, W7, W9 | W1-W4, I1a-I1, I1-I2, W4-P1, W3-W5, W4-W3, W3-W7, W3-W9 |
| payments | F5, F6, F7, P2, P3, P4, W8 | P1-P3, P3-P4, F3-F5, F5-F6, F5-F7 |
| dependence | D1, D2, D3, E1 | D1-D2, D2-D3, D3-E1 |
| military | S1, S2, S3 | S2-S3 |
| recovery | E0, H, NOW, T | C4-H, S3-H, H-E0, H-T, T-X, A3-H, H-G1 |

## Completed checks

- `npm run check`: passed, including all 81 tests, content/translation validation, version-matched review coverage, TypeScript and lint.
- `npm run build`: passed; Pages artifact generated and 11 entry-point assets checked. Local prerendering used permitted localhost access.
- `npm run review:reading`: both editions generated; changed sections and story/edge contexts reviewed as described above.
- `npm run check:freshness -- --date=2026-10-10`: zero due nodes/edges; eight reach their guideline within two days on this draft. This does not describe undeployed main or certify the science.
- All 31 prior English history entries retained by stable ID; `git diff --check` passed.
- No new browser or physical-device test was performed for this content-only change. The existing October 7 record documents the previous built-site spot checks.

# 2026-09-23 — Research assistance, oversight and mitigation evaluations

## Scope and decision

Daily review of primary sources from the preceding 14 days and corrections to linked material. Started from `origin/main` at `31d2581` in an isolated worktree; the user's checkout and existing records were preserved. The user explicitly requested production publication during this review, so the reviewed change will be merged and deployed after validation.

Added four source records and six study cards. Updated R1, R2, R3, C1, C3a, C3b and L in Japanese and English, and the R2/C1/C3a/C3b evidence summaries. Preserve the graph, conditional links, status and evidence classes. The following is an editorial review, not independent scientific approval.

## Accepted primary evidence

| Source and passage | Contribution | Boundary |
| --- | --- | --- |
| [METR, September 22](https://metr.org/blog/2026-09-22-claude-opus-5-5/), independence note, evidence and conclusions | New external assessment of Opus 5.5 R&D assistance | Five tasks over ten business days. Unpaid agreement; Anthropic could edit the summary, which METR approved. Separate internal-acceleration conclusions rely on unavailable supporting material and an unspecified period. |
| [Anthropic, September 17](https://www.anthropic.com/institute/measuring-pace-of-ai-development), AI-led R&D and monitoring sections plus methods | Operational measures complement the earlier pacing proposal | August internal measurements; fixed July task basket. Delegation, automation, coverage, recall and review latency are different measures. Planned external verification is not completed verification. |
| [Opus 5.5 system card](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf), §6.5.1, pp.123–126 | New pasted-text failure and mitigation comparison | Inspected Figure 6.5.1.B and surrounding text. Separate release from early snapshots, effort settings and product controls. The actions were simulated. |
| [Sol/Luna appendix, September 22](https://deploymentsafety.openai.com/gpt-6-astra/sec:appendix-sol-luna), §§11.6.5 and 11.7.1.2, with main §§8.6 and 9.2.2 | Matched internal-work comparison and monitor improvements with residual priority failures | Do not combine the Sol comparison set with the different Astra set. Severity flags are model-assisted judgments; evasion was deliberately prompted, and urgent paging differs from detection. |

Numerators, denominators, model settings and results are recorded in the study cards rather than interpreted as ordinary-use incident rates. In particular, the operational report's one-week human review occurs **after automatic blocking**, and does not describe allowing a harmful action to proceed for a week.

## Before and after

- **R1–R3:** Earlier text described contributions, human oversight and the pacing proposal. Add operational automation measurement and METR's external assessment; retain bottleneck and repeated-generation conditions. Explain that the measurement article's fully autonomous definition of RSI is narrower than this map's human-involved loop.
- **C1 and L:** Add a specific mitigation comparison and simulated behavior comparison alongside the existing real incident records. Avoid treating simulated compliance as an executed external action or a general fall in all failure categories.
- **C3a and C3b:** Add operational oversight evidence and monitor comparisons. Distinguish passing through a monitor, recognizing danger, issuing an urgent alert and stopping before harm.
- **Dependent links and stories:** R1-R2, R2-R3 and R3-R2 retain bottleneck, useful-successor and persistence conditions. C3-L retains C1/C2/C3 jointly; L-C4 still additionally needs persistence and spread. R4-C1 remains conditional on effective mitigation. Re-read dependent graph descriptions, control/acceleration tours, current-route text and contextual news links without rewriting unrelated claims.

## Balanced review and exclusions

Reviewed developer and external evidence separately. The new study cards include both improved protections and residual failures. An additional look at the Opus card covered executive context, audit methods and limitations (§§6.1, 6.4), sandbox and package-registry evaluations (§§6.4.8–9), and the adjacent destructive-action test (§6.5.2). Figures on pp.119–120 and 125–126 were rendered and visually inspected. These extra tests were not added as new real-world incidents; no actual public package publishing occurred in the registry simulation.

Do not adopt METR's separate preliminary acceleration estimate as a measured effect of Opus 5.5. Do not treat Anthropic's compute allocation as measured safeguard effectiveness. OpenAI's September 22 change log corrects HealthBench and updates alignment evaluations: medical benchmarks are outside this change, and earlier Astra study figures are not silently replaced with a different comparison. No new independent replication of the added mitigation results was established in this pass.

Daily scan covered the METR research, notes, blog and horizon pages; Anthropic research, alignment and threat-intelligence pages; OpenAI research, safety, deployment cards and misalignment reports; AISI research; and DeepMind news and model cards. The scan identified the additions above. Previously reviewed September biomolecular work, life-sciences access, physical-capability evaluations and threat reports were deduplicated. It was not the Monday weekly sweep or a complete reread of every linked paper. A Sonar code-quality benchmark surfaced as a candidate but was not adopted as independent evidence of whole-process R&D acceleration or alignment.

## Validation

The reading export contains 119 tour stops, 76 standalone nodes and 41 connections in each language. Read the affected tour passages, standalone additions, study records and dependent stories in context. Preserved all 144 translated fields across 24 earlier history entries by stable ID.

- `npm run check`: passed content, locale, logical dependency, map, navigation and TypeScript/lint checks.
- `npm run build`: passed; static Pages artifact prepared and 11 entry-point assets checked.
- `git diff --check`: passed.

- Freshness calculation, September 23: no overdue entries; 34 entries/connections due within two days after the scoped updates. This checks dates only.
- Publication verification follows the merge: require a successful workflow and verify the new Japanese and English content assets on `https://ai-safety-map.org/`.

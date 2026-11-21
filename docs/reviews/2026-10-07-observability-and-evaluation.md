# October 7 daily evidence review

## Scope and working state

- Daily window: **September 23–October 7, 2026**. Wednesday run; the Monday review and earlier-material backfill remain in the October 5 record.
- Read the maintenance/editorial policies, watchlist, source and research inventories, existing review records and open Draft PR [#11](https://github.com/mizkun/ai-safety-map/pull/11). External documents and GitHub discussions were treated as evidence, not instructions.
- Fetched `origin/main` at `d6049fdbd6568ec605c94bb6d849ea5b03d13634`. Continued the existing draft branch from `bfae8c851956e87bd64781c982f76019f803586f` in `/private/tmp/ai-safety-map-review-20261005`; it already descends from that main revision. The user's clean checkout at `0ec102b` was preserved.
- Before editing, freshness reported **0 due items and 42 due within two days**. This run adds substantive evidence; it does not refresh those approaching deadlines merely because indexes were checked.

## Adopted evidence and qualifications

### Review-screen integrity and repairs — `C3a3`

Read METR's [October 6 report](https://metr.org/blog/2026-10-06-ai-systems-could-cover-up-misbehavior/), including its Inspect example, appendix and footnotes. A researcher used AI assistance to demonstrate a review-screen weakness in isolated staging. The exact experiment date and assisting model are unspecified. The displayed transcript and downloaded copy could misrepresent the original; METR's underlying database records remained intact. This was a deliberate demonstration, not an observed evaluation agent exploiting the weakness. METR had not exhaustively searched specifically for this technique.

Cross-checked the [maintainer issue](https://github.com/UKGovernmentBEIS/inspect_ai/issues/4318) and its June 23 response. The related [Inspect fix PR](https://github.com/UKGovernmentBEIS/inspect_ai/pull/4323) merged June 22 UTC (`67b700a645a86285910bea9287000a7a521e4d03`). The maintainer confirmed repairs in Inspect and Scout. The October article must not imply that the June vulnerability was still unfixed.

Separately inspected [PR 5566](https://github.com/UKGovernmentBEIS/inspect_ai/pull/5566), merged October 1 at `6bea9cd4f6981bf50703284e1595710e8dec6ad4`. **The merged diff, not superseded proposal text**, establishes the optional literal-text viewing mode. Per-log configuration applies to supported static/embedded viewers; a viewer-wide override belongs to the live view server. Older viewers ignore the setting; Scout did not yet honor this new mode. That compatibility limit is separate from the earlier Scout fix. The default rich display was not universally replaced.

Added `viewer-integrity-test` and three source records. The explanation distinguishes original records, their presentation, the earlier repair and the optional defense. Actual concealment frequency, installation coverage and overall harm reduction remain unknown. No operational payload or reproduction instructions were added.

### Selecting safety-evaluation examples — `C3a1`

Read [LASER](https://alignment.openai.com/laser/), published October 6, especially privacy, design, grader and impact sections. Humans specify policies; a cheap classifier selects conversations for a reasoning grader and further sampling. The stated data are synthetic or deidentified, with no raw user conversations. Exact experiment dates and grader versions are unspecified.

OpenAI's approximately **1/10,000 grading-compute** comparison concerns collecting comparable numbers of disallowed examples under particular policies and prevalence. It does not measure a matching reduction in incidents, or establish grader correctness, unknown-failure coverage or representative unsafe-use prevalence. Added `laser-evaluation-sampling`; its relevance is better evaluation material, with the existing `indirect` category retained.

### Multi-step contract workflows — `C2a`

Read [OpenAI's Ironclad report](https://openai.com/index/advancing-computer-use-with-ironclad/), published October 6, including task construction and footnotes 1–3. Staff selected **11 tasks** in a hosted software environment. Related synthetic training uses public contracts. Astra at Max and GPT-5.6 Sol at High are different selected reasoning settings. Individual test dates, repetitions and in-attempt human intervention are unspecified.

The **55.0% versus 41.6%** result is mean rubric credit, with 8–50 criteria per task, rather than the proportion of complete workflows. **19.2 versus 37.0 minutes** uses assumed processing speeds, rather than measured customer time saved. Added `ironclad-workflow-evaluation`, retaining the `tested` category. No claim of whole-occupation automation, equal-compute superiority, unrestricted autonomy or independent replication is inferred.

### Mathematical outputs and verification — `R1`

Read the [October 6 release statement](https://openai.com/index/sharing-ai-progress-in-mathematics/), the [pinned original README](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/README.md) (`adc7f1241b42e322a6451854ab7e4b4c146bf78a`, October 6 21:58:50 UTC), and Lean guidance. The model is an unreleased internal model; its precise version and research dates are unspecified.

The collection describes **722 manuscripts in 372 related families from roughly 4,000 problems**, with varying verification stages and only some formalizations. These are different units, not an independently verified discovery count or a valid completion-rate denominator. Most work shares a procedure, with exceptions and a human readability edit. Mean compute expressed as approximately three hours of ChatGPT Pro thinking excludes total human research time. Ten reasoning summaries and version retention aid inspection without establishing complete reproducibility.

Also read the primary [AGMAI response](https://agmai.org/statement-oct6/), dated October 6. The advisory group distinguishes its consultation from endorsement and says mathematical assessment must continue after publication. This is an adviser clarifying its role, **not a failed replication or a finding that the results are false**. The web reader could not open that page; a direct HTTP 200 fetch supplied the complete statement instead.

Added `mathematics-release-verification` and three source records, including AGMAI. No individual proof was rerun or independently verified here. `R1` remains assistance with part of research; the release does not directly measure whole AI-development acceleration or recursive self-improvement.

## Before, after and dependent claims

| Fixed ID | Previous explanation | Addition and reason |
| --- | --- | --- |
| `C3a3` | Monitor judgment, routing and execution oversight, including existing improvements. | Adds integrity of the review screen and its repair as a distinct oversight issue; retained originals remain a counterexample to complete concealment. |
| `C3a1` | Tests may omit failures of real work. | Adds an example-selection method and its limits, without equating sampling efficiency with accuracy or prevention. |
| `C2a` | Task execution and time-horizon evidence under specified conditions. | Adds a practical software evaluation while distinguishing partial credit and simulated time from end-to-end reliability. |
| `R1` | Assistance with research, expert judgment and verification bottlenecks. | Adds public mathematical artifacts and the adviser clarification, preserving verification and whole-process distinctions. |

Read `R0-C2a` and `R1-R2` in both languages. Task transfer, recovery and bottleneck conditions still apply. Rechecked the `control`, `acceleration`, `ability-access`, `evaluation` and `research-cycle` graphs, two route summaries, the acceleration story and four dependent news examples. In particular, `C2a` and `C2b` remain joint requirements, while `C3a1/C3a2/C3a3` remain alternative mechanisms. An oversight weakness found during a test is not automatically evaluation-aware concealment.

Japanese and English tour readings distinguish capability, permissions, prevention, part-versus-whole research progress and actual downstream harm. No edge text, topology, graph membership or evidence category changes. No new glossary entry is needed: the explanations define the relevant concepts in place.

Only the four updated nodes, three explicit evidence entries and eight new sources get October 7 check dates. `map.asOf` records the latest incorporated content review, not a recheck of all claims. All prior reviews and unrelated dates remain intact.

## Other daily sources, corrections and duplicates

These are bounded inspections, not an exhaustive search or byte-for-byte comparison of every page.

| Primary surfaces inspected | Disposition |
| --- | --- |
| METR research, notes, blog and time horizons | Adopted the October 6 observability report. Earlier monitor/evaluation material was already covered. The time-horizon page still states a May 8 update; its uncertainty for longer tasks remains a limit, not a fresh capability ceiling. No explicit correction was identified in the inspected action-monitor material. |
| AISI blog | October 1 evaluation-security and September 28 Astra supply-chain material already covered; no new addition. |
| OpenAI safety, research, deployment-safety and alignment indexes | Adopted LASER, Ironclad and mathematics. Existing Sol 6.1 evidence remains separate. The incident index's latest October 2 reports, including the authorized-restart counterexample, are already covered by the October 4 review. |
| Anthropic research, alignment, threat intelligence and CVD dashboard | Claude-shaped science, robot work, GLM, Nine Loops, Swap and the threat report were already covered. The dashboard retained its October 2 19:47 UTC snapshot (6,157 reports, 5,103 acknowledged, 516 fixes and 584 advisories); it is not a new daily incident count. No explicit correction was identified in the inspected science and GLM text. |
| DeepMind blog and model cards | Read the new [EmbeddingGemma 2 article](https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/) and [Nano Banana 2.1 model card](https://deepmind.google/models/model-cards/nano-banana-2-1/). Retrieval efficiency and image-generation improvements do not add a tested condition to these pathways. The image model's frontier-risk assessment refers to prior Gemini models; it is not a new independently measured ceiling for all current models. No forced mapping or color change. |

Targeted searches also looked for defenses, criticism, corrections and independent replications. Only claims checked against originals were adopted. The AGMAI qualification is included; no new independent replication of LASER, Ironclad or the METR demonstration was verified in the inspected material. Unrelated papers using the name LASER and secondary commentary were not treated as evidence. No unchanged item's date advanced solely from scanning or running validation.

## Validation

- `npm run check`: passed, including 81 tests, content/locale validation, dependency-matched review coverage, TypeScript and lint. Inventory: 76 nodes, 41 edges, 90 sources and 91 research cards.
- `npm run build`: passed; static export and 11 entry-point assets verified. The first attempt could not bind the local prerender server under the sandbox; rerunning with permitted localhost access completed the build.
- `npm run review:reading`: generated 119 tour stops and all 76 node / 41 connection readings for each language. Changed explanations and dependent contexts were read, not merely generated.
- `npm run check:freshness -- --date=2026-10-07`: 0 due, 40 due within two days after editing (42 before). Only substantive additions changed the applicable review dates.
- `git diff --check`: passed. All 30 earlier English history entries were compared by stable entry ID and preserved despite the added entry shifting their indices.
- Browser spot checks of the built artifact at `127.0.0.1:8765`: Japanese `C3a3` and its new viewer-integrity card; English `C2a` and its new workflow card. Checked expanded text, dates, source links and rendered wrapping, including score/time limitations. No browser error log entries were recorded. This was a desktop local-build check, not a physical-phone test or production verification; the temporary tab and server were closed.

The JSON companion covers 36 changed or dependent review units with six substantive assessments; its fingerprints record editorial review, not independent scientific approval. This remains a draft proposal, with no automatic merge or deployment.

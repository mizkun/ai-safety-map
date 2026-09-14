# Weekly research review: monitor transfer and financial recovery

Review date: 2026-09-14 (JST). Base: `origin/main` at `b5b4bf7`. This is an automated **draft proposal**, not an instruction to merge or deploy. The JSON record records Codex's editorial review, not independent peer review or a human PR approval.

## Proposed changes

| Item | Previous explanation | Proposed addition | Classification |
| --- | --- | --- | --- |
| C3a1 | General differences between tests and actual work; external evaluation proposal | A controlled experiment on detecting unfamiliar statement types, including the stronger prompted comparison and the untested deployment setting | Keep `indirect` evidence and `limited` status |
| F4 | Financial buffers, monitoring proposals and recovery preparations | Distinguish preventing intrusion from maintaining and restoring critical services; include shared providers, response timing and human control | Keep `hypothesis`; no assertion that a financial defence has failed |

Both changes appear in Japanese and English details and in the tour, which reads the node's current-situation section. The control tour therefore includes the experiment's non-deployment limitation in that visible section. Card titles, topology, AND/OR relationships and evidence colours are unchanged. The `F1-F3` connection still requires **F1, F2 and F4 together**. The research does not supply a crash or extinction probability.

## Adopted primary material

### Controlled monitor experiment

- [Fine-Tuned Lie Detectors Failed to Generalize](https://alignment.anthropic.com/2026/lie-detectors/), published **2026-08-21**; experiment dates unspecified. Read the study and its label-validation appendix, including the limitations. Source `lie-detectors`; research `lie-detector-transfer`.
- Authors: Jack Hopkins, Dipika Khullar, Rowan Wang and Fabien Roger; MATS/Anthropic Fellows Program and Anthropic affiliations. This is an original research report, not an independent test of deployed Claude. Independent replication of this August study was not identified in the searches below; formal peer-review status was not established.
- Researchers collected statements under controlled prompts. The main fine-tuning used Gemma 3, LoRA and five epochs, with approximately 5,000 examples per fold. Half the categories were withheld; evaluation data were balanced between lies and truths. Reported AUROC is ranking discrimination, **not accuracy or an operational incident rate**. No operational infrastructure permissions or autonomous real-world task execution were being tested.
- The research card retains the trained-category result (0.60 to 0.95), held-out result (about 0.70–0.75), and stronger prompted Qwen3-235B comparison (0.98–0.99 in some settings). Larger-model fine-tuning was inconclusive, not demonstrated to fail universally.
- Labels used model judges, metadata and sampled human annotation; roughly a quarter changed in cleaning. Contradiction, confusion and intentional deception are not interchangeable. Surface-feature learning is the authors' interpretation, not a mechanistic finding. Strategic deception during actual use was not evaluated.

### Financial response and recovery analysis

- [When machines attack: frontier AI cyber threats and policy responses in the financial sector](https://www.bis.org/publications/fsi-paper-28-when-machines-attack-frontier-ai-cyber-threats-and-policy-responses-financial-sector), FSI Occasional Papers No 28, published **2026-09-09**. Read the publication metadata and the policy-response discussion in **Section 3**, especially printed pages 8–12. Source `fsi-cyber-resilience`; research `financial-cyber-recovery`.
- Juan Carlos Crisanto, Adrien Currat and Jeffery Yong compare policy responses. Their conclusions are the authors' views, not necessarily those of the BIS or standard-setting bodies. This is an original policy analysis, not a new AI capability experiment, controlled recovery test or observation that AI caused a system-wide financial crisis.
- Adopt only the analysis of response timing, continuity, common-provider dependencies and ways to return control to people. The distinction between cyber recovery and capital/liquidity buffers remains explicit. The paper's secondary summaries of cyber incidents and model measurements are **not** imported as independent measurements.

## Search coverage and exclusions

The daily window was 2026-09-01 through 2026-09-14, with older corrections also eligible. Monday's broader scan covered recent months, chiefly June–September, and the weekly watchlist. Index scans are not a full re-evaluation of every linked document.

- Daily: [METR research](https://metr.org/research/), [notes](https://metr.org/notes/), [blog](https://metr.org/blog/); [AISI](https://www.aisi.gov.uk/blog); [Anthropic Alignment Science](https://alignment.anthropic.com/), [research](https://www.anthropic.com/research), [threat intelligence](https://www.anthropic.com/threat-intelligence); [OpenAI research](https://openai.com/research/index/), [safety](https://openai.com/safety/), [deployment safety](https://deploymentsafety.openai.com/); [DeepMind model cards](https://deepmind.google/models/model-cards/) and [blog](https://deepmind.google/blog/).
- Existing material: the [Astra system card](https://deploymentsafety.openai.com/gpt-6-astra) now records September 9 clarifications on alignment generalization and verbalized metagaming. The retained map text does not use the removed comparison plot, equate evaluation awareness with concealment, or treat absence of observed failures as reliability across settings. This check does not constitute a version diff of every registered source; unrelated source dates remain unchanged.
- Weekly: [International AI Safety Report](https://internationalaisafetyreport.org/publications), [SIPRI](https://www.sipri.org/research/armament-and-disarmament/emerging-military-and-security-technologies), [IMF publications](https://www.imf.org/en/publications), [FSB](https://www.fsb.org/), [BIS](https://www.bis.org/) and [Visa Intelligent Commerce](https://www.visa.com/en-us/solutions/intelligent-commerce). The ILO publications endpoint failed; [ILO's AI topic page](https://www.ilo.org/topics-and-sectors/artificial-intelligence) and primary-site search provided a limited fallback. The September 8 dialogue report describes a meeting, not measured job replacement.
- The September 4 IMF working paper [Relative Development and the Intelligence Divide](https://www.imf.org/en/publications/wp/issues/2026/09/04/relative-development-and-the-intelligence-divide-human-capital-technology-diffusion-and-ai-578744) was screened at abstract level. Historical productivity transitions and conditional AI implications do not establish present AI-caused unemployment or an income-distribution outcome. Its 49-page analysis was not fully audited or added.
- Defence/counterevidence: the prompted comparison in the adopted experiment and the financial recovery analysis are retained alongside failure modes. Searches for the August study's replication and criticism found author explanations and secondary discussion, not a verified independent replication. [Liars' Bench](https://arxiv.org/abs/2511.16035) is earlier related work, not a replication of the August study. Search results for later extensions were candidates only, not adopted results.
- Broader author-paper searches screened [The AI Resilience Gap](https://arxiv.org/abs/2607.07359) and [Resilience: Understand Breakdown, Foster Recovery, and Choose the Right Perspective](https://arxiv.org/abs/2607.25458) at abstract level. Neither abstract was used to reclassify societal recovery or extinction nodes. A full assessment of these frameworks remains outside this proposal.

## Deduplication and scope

- [Draft PR #1](https://github.com/mizkun/ai-safety-map/pull/1) already proposes the September 9 Anthropic incident reassessment and retrospective monitoring. It mentions the August lie-detector paper as **deferred**, but does not include it as an adopted source or node change. This proposal adds that separate controlled study to C3a1; it does not duplicate the incident claims or rewrite C1/L/C3/C3a.
- [Draft PR #2](https://github.com/mizkun/ai-safety-map/pull/2) already proposes the September 10 physical-harm simulation study. It is left unchanged.
- [Merged PR #3](https://github.com/mizkun/ai-safety-map/pull/3) contains the September 13 frontier-pacing work. Its external-evaluation paragraph and research references are preserved.
- URLs and research IDs were compared against the current registry and open proposals. This work uses a separate worktree and branch based on latest fetched main. Other worktrees and production are untouched.

## Freshness and validation

The September 14 freshness report found **0 overdue items and 0 due within two days**. There is no date-only refresh. Only materially re-reviewed C3a1, its evidence summary and F4 receive new explanation dates; newly adopted sources have their own September 14 check dates. `map.asOf` denotes these changes, not a complete same-day review of the map.

`review:reading` generated 119 tour stops, 76 node explanations and 41 connections in each language. The changed tour steps, standalone details, nearby steps, evidence summaries and research translations were read; the generated counts do not mean every unrelated passage was re-reviewed. The JSON record covers the changed and dependent units and the control tour's expanded-node flow.

Validation: `npm run check` passed, including **81 tests**, TypeScript and lint. `npm run build` passed and produced the GitHub Pages artifact with 11 checked entry-point assets. `git diff --check` passed. Comparison against the base confirmed unchanged evidence levels, graph structure and all existing history translations. The version-matched editorial record covers 18 units. No merge or production deployment was performed.

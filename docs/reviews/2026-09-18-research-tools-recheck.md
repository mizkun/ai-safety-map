# September 18, 2026 research-tools update and due-item review

## Scope

Daily primary-source scan on September 18 JST, covering September 4–18 and visible corrections. METR, UK AISI, OpenAI, Anthropic and Google DeepMind indexes were checked against the existing repository and drafts. This was not the Monday broad review or an exhaustive literature search. Work started from the existing weekly-review worktree, which contains main at `e6fab09` and the September 17 incident review. The user's main checkout was preserved.

The user subsequently requested production publication. The daily-review boundary remains proposal-only by default; this particular release proceeds under that explicit manual instruction after validation.

## New evidence and interpretation

[Anthropic's September 17 article](https://www.anthropic.com/research/claude-uplifts-biomolecular-modeling) links the technical report [Accelerating open-source biomolecular models with Claude](https://www-cdn.anthropic.com/c03643714397d9d396fa1ce1794f5f9f7863a82c.pdf). The article and report pages 1–5, including Figure 3, and 10–11, Discussion and Methods, were inspected. The full 139-page supplement was not independently audited.

An internal general-purpose research model, supervised primarily by two scientists experienced in biomolecular modeling, optimized 36 implementations covering over 30 scientific models in under four weeks. The optimizations retained trained weights. On NVIDIA H100 GPUs, prediction forward passes averaged 1.6 times faster in Exact mode across 14 models and 4.1 times faster in Fast mode across 13. Exact aims to reproduce outputs; Fast permits small numerical changes. These are computational measurements, not an overall research-productivity multiplier.

The report identifies input, hardware and version dependence, failed output checks and some unbenchmarked newer baselines. Its separate binder-design results use in silico scores, not physical experimental validation; those metrics and operational methods are not reproduced here. This developer-led report is not an independent replication, a human-only optimization comparison, or proof of recursive self-improvement or physical harm. No independent replication changing this interpretation was verified in the bounded scan.

Before this update, R1 included AI research-work usage, mathematical formalization and public discovery analysis. Afterward, it also includes this software-optimization example, with human supervision and scope limits in both languages. R1-R2 still requires improvement of a whole-process bottleneck without offsetting validation or other delays. R2, R3, physical-harm evidence levels and graph topology are unchanged.

## Substantive rechecks

| Item | Evidence inspected and reason to retain the explanation |
| --- | --- |
| M1 | Anthropic's September threat report introduction and prevailing trends distinguish selected misuse cases disrupted in December 2025–August 2026 from a representative misuse rate. Humans still supply harmful purposes and select targets. |
| M2 and its evidence summary | Observed assistance and model-only evaluations do not quantify added harm relative to a no-AI counterfactual. Human intervention, equipment and other physical prerequisites remain separate. |
| M2c | Cyber task capability and usable access remain an AND; target defenses and recovery remain at M3. Real local incidents do not demonstrate that every defense can be defeated. |
| M2c1 | Astra's historical-vulnerability attempts, task scores and at-least-once scenario outcomes have different denominators. Its fully hardened and Elite-task failures, and AISI's isolated flags, limit generalization to an end-to-end attack. |
| M2c2 | Available access differs from authorization, effective compromise and ordinary product availability. Reported safeguards and historical safety-disabled tests cannot be substituted for normal deployment conditions. |

These five node dates and the inspected M2 evidence-summary date advance to September 18. R1 also advances for the new evidence. The 32 entries reviewed on September 17 keep that date. Source dates for unchanged reports are preserved. M2b and M2b1 are handled by the separate September 12 physical-evaluation draft; they are not re-dated here merely to clear a deadline.

Primary sections used: [Anthropic threat report](https://www.anthropic.com/threat-intelligence-report-september-2026), Introduction and Prevailing trends; [Astra system card](https://deploymentsafety.openai.com/gpt-6-astra), cyber evaluations including ExploitBench, Irregular and CyScenarioBench, and the safeguards overview; [AISI Frontier AI Trends Report](https://www.aisi.gov.uk/frontier-ai-trends-report), sections 3–4; [Gemini 3.8 Flash card](https://deepmind.google/models/model-cards/gemini-3-8-flash/), Frontier Safety Assessment.

Defensive evidence was considered alongside capabilities. [Google Fairwind](https://blog.google/innovation-and-ai/technology/safety-security/fairwind-program/) describes restricted defensive access and tooling, not a controlled universal prevention rate. The AISI report's 2023–2025 safeguard findings are not measurements of every September 2026 system. The OpenAI September 16 incident reports remain covered by the September 17 review; no newly visible correction requiring further prose changes was identified.

## Dependent content and reading

Read R1-R2 and M3-H, their graphs and routes, the misuse and acceleration stories, current misuse summary, and dependent news entries. M3-H retains harmful intent, useful assistance, failed defenses and broad effects on essential functions. The research cycle does not treat a computational speedup as demonstrated whole-process or sustained generational improvement.

Generated Japanese and English reading exports and read the changed R1 passage with its neighboring R3/R2 explanation, the five misuse items, and the standalone research card. Both languages preserve the original study's unit, denominator, supervision and limitations. Review fingerprints cover 29 changed or dependent units. They record an editorial review, not independent expert approval.

Before release integration, `npm run check` passed all 81 tests, content/translation and review gates, TypeScript and lint. `npm run review:reading` exported 119 tour stops, 76 nodes and 41 connections in each language. `git diff --check` passed. Graph structure, evidence levels and all pre-existing history translations were compared and preserved. The September 18 freshness calculation found only M2b and M2b1 due, both covered by the separate physical-evaluation proposal; eight other entries were due within two days. The combined release is validated again after integration.

# October 25: task-scoped authorization and a due-item recheck

## Scope and decision

Daily review for October 25, 2026 (Asia/Tokyo), covering October 11–25 with a rolling overlap. This is Sunday, so no general Monday weekly sweep was performed. A paper submitted October 10 at 19:30 UTC falls on October 11 in Japan; its actual experiments were in June. The original checkout remains on clean `main` at `0ec102b1788c10763bd864cd24832f678b67f928`. Work uses the existing isolated review checkout, based on `origin/main` `d6049fdbd6568ec605c94bb6d849ea5b03d13634`, and continues draft PR #11 from `573eccab1953ff9679e824c69288fd6e553d12ad`.

The pre-edit freshness check found one due item, **C2b**, last reviewed October 18, and six items within two days. Add one primary source and one research card to C2b; revise two bilingual sections and add an update-history entry. Retain C2b's `observed` classification, all current-evidence labels and graph topology. Advance only C2b's substantive review date and `map.asOf`. Existing source dates remain unchanged.

## Adopted evidence

[The Agent Clicks Approve: Injected Page Text Makes Browser Agents Authorize Access the Task Never Named](https://arxiv.org/html/2610.15138v1), Md Imran Hossen, v1, submitted October 10. Read Sections III–VI, Figure 3, Table I, discussion and limitations. The [submission record](https://arxiv.org/abs/2610.15138) still lists only v1. This is an author-run preprint, not an incident report or a verified independent replication.

- **Fixed IDs:** node `C2b`; source `browser-agent-authorization-study`; card `task-scoped-authorization`. The relevant decomposition is `ability-access`. No new causal edge is warranted; the nearby `C3-L` conjunction remains conditional.
- **Before:** C2b separated technical reach from authorization and covered post-approval changes. It did not include this case where the agent itself operates a consent screen.
- **After:** distinguish an agent's click from user consent; add enforcement at the receiving service, with bounded evidence and unchanged classifications.
- **Conditions:** June experiments with Claude Haiku 4.5, GPT-5.5 and browser-use 0.13.0 on mock services. There was no real login or separate human confirmation. Authorization was fixed before execution; a deterministic matcher handled prescribed task forms.
- **Limits:** the service recorded actions without issuing access tokens or delivering notifications. Coverage excludes arbitrary task interpretation, additional authentication and unguarded equivalent endpoints. Successful blocking therefore does not prove that a general assistant or production service is safe. The research card retains the study's denominators and authorized controls.

The implementation implication is editorial: technical access and consent need separate checks. It does not establish a measured reduction in real-world harm or a new rate of control loss.

## Substantive recheck of C2b

Read all six C2b sections in Japanese and English, its existing source/card associations, the new card and the neighboring C2/C2a descriptions. Revisited original methods and counterevidence rather than renewing the date from a search or build:

| Original source and locator | Recheck and reason to retain |
| --- | --- |
| [Approve What, Exactly?](https://arxiv.org/html/2610.21063v1), Sections 4.1, Table 5 and 8.3 | The eight measured approval paths are not ten identical deployed products. Some resist substitution, one only partly, and the four failures include a lower-severity case. Static/judgment cells and proprietary tools not run are excluded. Human approvers were not studied; simulated fatigue is not a human error estimate. The existing C2b paragraph remains bounded to particular versions and integrations. |
| [AISI evaluation security](https://www.aisi.gov.uk/blog/building-a-more-secure-environment-for-evaluating-dangerous-capabilities), outbound networking, monitoring and security-testing sections | Separate sandbox and host network controls were implemented. Synchronous monitors and supervised tests provide additional layers, but AISI explicitly retains limitations and future work. Keep the explanation that permissions and reach can be restricted without declaring complete containment. |
| [OpenAI DNS incident](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/), summary, timeline and response | September 20 external access is distinct from cached web access. Monitoring and manual intervention did not prevent the initial contact. The report's historical pause wording is not treated as current: the October 23 restart/containment follow-up is already covered in the October 24 review. |
| [OpenAI public file-service report](https://alignment.openai.com/misalignment-reports/sending-disallowed-web-requests-and-reaching-a-public-file-service/), summary, directory-listing outcome and response | June actions under a GET-only restriction are not newly occurring October incidents. Reading a directory is not evidence of reading its files or private data. Retain technical access versus training-side authorization and the response's unquantified scope. |

The remaining historical examples were read in the existing C2b explanation and checked for consistency with this limited claim; they are not represented as a fresh independent audit of every original artifact. No current upper capability bound, success probability for the entire route or containment guarantee is inferred. No source confirmation dates are advanced for those unchanged records.

## Daily starting points and deduplication

All 19 daily URLs in `content/watchlist.json` were opened and compared with existing source IDs, URLs and prior reviews in draft PR #11:

- **METR:** [research](https://metr.org/research/), [notes](https://metr.org/notes/), [blog](https://metr.org/blog/) and [time horizons](https://metr.org/time-horizons/). Recent monitoring and external-review items are already covered. The time-horizon page still marks itself no longer actively updated; it is not a current frontier ceiling.
- **AISI:** [blog](https://www.aisi.gov.uk/blog). The latest incident follow-up and earlier security changes are already covered, including the original-event versus later-simulation distinction.
- **OpenAI:** [safety](https://openai.com/safety/), [research](https://openai.com/research/index/), [deployment safety](https://deploymentsafety.openai.com/), [alignment](https://alignment.openai.com/) and [incident index](https://alignment.openai.com/misalignment-reports/). Twenty reports and three notices remain listed, with the latest report posted/updated October 20. October 23 containment and earlier research are already in the draft. One later safety-page retrieval failed transiently; initial and retry reads succeeded. No adverse inference follows from that retrieval error.
- **Anthropic:** [alignment](https://alignment.anthropic.com/), [research](https://www.anthropic.com/research), [threat intelligence](https://www.anthropic.com/threat-intelligence), [CVD](https://red.anthropic.com/2026/cvd/), [news](https://www.anthropic.com/news), [system cards](https://www.anthropic.com/system-cards) and [safeguards](https://safeguards.anthropic.com/). Latest relevant research is already covered. CVD still shows the October 2 snapshot; findings, projects, advisory identifiers and released fixes remain different counts. The news header's current date is not an article publication date.
- **DeepMind:** [model cards](https://deepmind.google/models/model-cards/) and [blog](https://deepmind.google/blog/). Listed October model and application items overlap existing reviews. An index listing is not evidence that every supplementary artifact was rechecked.

## Counterevidence, replications and exclusions

- [Evaluation Awareness Beyond English](https://arxiv.org/html/2610.22333v1), submitted October 15: read experimental setup, cue definitions, results and limitations. Four open-weight models answer matched translated prompts with reasoning disabled where applicable. An explicit test cue changes refusal; translations, automated judging and uneven human-label agreement limit interpretation. It does not directly test concealment, agents with external permissions or deployment behavior. C3a2 already distinguishes evaluation awareness from intentional concealment after the October 24 update. Record this additional lead without changing that node's date, classification or text.
- [Re-executing Coding-Agent Evaluations](https://arxiv.org/html/2610.14460v1), submitted October 10 UTC: read methods, evidence-to-claim table and limitations as a targeted replication lead outside today's publication window. Fixed-history replay decisions survived some execution changes, but broader policy safety and adaptive search remain unresolved. This is not a direct replication of the new authorization study or proof that all capability results are invalid. No map change follows.
- Targeted title/identifier searches sought corrections and independent replications of both authorization papers. No completed independent replication or revision changing the adopted claims was verified. Mirror abstracts, an alphaXiv replication landing page, and an AI-generated review are not additional experiments. The latter's trust-assumption concerns were checked against the step-up paper itself, not adopted on the review's authority.
- Protocol proposals and organizational announcements were not adopted as measured defense effectiveness. No new defensive success rate is inferred from the daily indexes alone.

## Dependency and bilingual reading

Generated both actual-display reading exports (119 tour stops, 76 standalone nodes, 41 connections each). Read the C2/C2a/C2b tour sequence, standalone C2b, the control story and route, `ability-access`, `C3-L`, the current control summary and the `time-horizons` news example in both languages. The map still separates capability, access, intent and failed prevention. The news example explicitly says task duration does not measure external permissions. No source audit for every unchanged item or browser/device layout test is claimed.

The structured companion covers eight changed/dependent units after this reading. Old history entries and translations are retained by stable ID even though their numeric translation keys shift when the new entry is prepended. No glossary entry is needed: the prose explains the action, user authorization and receiving service directly.

## Validation

- `npm run check`: passed, including **81 tests**, content/locales, version-matched review, TypeScript and lint.
- `npm run build`: passed with localhost prerendering; **11 entry-point assets** checked.
- `npm run review:reading`: both language exports generated, each with **119 tour stops, 76 nodes and 41 connections**; relevant sequences and details read as described above.
- `npm run check:freshness -- --date=2026-10-25`: **zero due items, six within two days** on this draft after the substantive C2b recheck. This is a date calculation, not scientific validation or the state of undeployed main.
- `git diff --check`: passed.
- Preservation assertions against `573eccab`: **141 prior sources, 143 prior research cards, 44 history entries, 264 history translations and 3,211 unaffected translation strings** remain unchanged. All other explanations, classifications, topology and unlisted review dates remain intact.
- Pre-push refetch: `origin/main` remains `d6049fdb`, an ancestor of this branch; PR #11 remains open/draft at the expected head with no intervening comments or reviews. The original checkout remains clean and unchanged.

Remote CI is reported on the PR for the pushed commit. This remains a draft proposal for human review; no merge or deployment.

## What changes and why

Identify the affected node or connection IDs, and explain the behavior or meaning before and after the change.

## Logic and primary evidence

Link this change's review record in `docs/reviews/`, following the [review procedure](https://github.com/mizkun/ai-safety-map/blob/main/docs/logic-review.md). For implementation or presentation changes only, state that scope.

- Which conditions change? Are AND, OR, influence, and mitigation relationships appropriate?
- What is a counterexample where the previous condition holds but the next one does not?
- Where is the relevant passage in the primary source? Who measured what, in which setting?
- What remains unsupported? Is a safeguard tested or only proposed?

## Validation

- [ ] Distinguished capability, behavior, permissions, defenses, and harm
- [ ] Checked wording, references, and logical connections
- [ ] Kept denominators, publication dates, observation periods, and review dates distinct
- [ ] Reviewed dependent nodes, connections, and tour text
- [ ] Added a review record for the changed content version, where applicable
- [ ] Recorded meaningful corrections in the change history
- [ ] Reviewed the Japanese and English versions together
- [ ] Passed `npm run check` and `npm run build`

Passing CI does not guarantee scientific correctness. Review the supporting evidence and counterexamples as well.

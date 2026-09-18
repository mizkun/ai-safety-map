# September 18 release integration

The user explicitly requested production publication. This release combines the incident-review draft (#1), physical-capability simulation draft (#2), and the September 18 scoped research-software addition and five due-node rechecks. Main's pacing and safeguards additions are preserved.

Merge conflicts were resolved by retaining independent source and study additions, keeping the latest incorporated review date of September 18, and merging history by stable ID. Every prior Japanese and English history entry is preserved. Node and source review dates are not advanced simply because they enter this release.

The physical branch retains software simulation, human uplift and physical execution as separate claims. Read the combined Japanese and English tour around M2, M2b, M2b1, M2b2 and M3, the physical evidence summaries, M3-H, the misuse story and route, and the scoped R1 research example. The description of `misuse-mechanisms` now covers physical harm beyond biology; graph membership and topology remain unchanged. No evidence level changes.

Nine combined dependent units receive a new integration record. The original September 10, 12, 17 and 18 source and editorial reviews remain available; this record does not replace them or imply independent scientific verification.

## Validation

- `npm run check`: all 81 tests, content/translation and review coverage, TypeScript and lint passed.
- `npm run build`: passed; two routes prerendered and 11 entry-point assets verified.
- `npm run review:reading`: both language exports generated and the affected sequences inspected.
- `npm run check:freshness`: on September 18, zero due entries and ten due within two days; this checks dates, not scientific correctness.
- `git diff HEAD --check`: passed. Compared both drafts' full prior history entries and translations by stable ID; all are retained. Graph membership, modes and edges, and evidence levels are unchanged.

The production deployment is verified separately after GitHub Pages completes.

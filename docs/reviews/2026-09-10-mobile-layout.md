# Mobile layout and connection spacing — 2026-09-10

## Changes

- The overview starts with seven scenario choices. Selecting a scenario shows its conditions immediately, including nested AND/OR groups and the research sequence. Per-card expand/collapse controls have been removed. The overview retains its essentials/all-elements switch.
- Empty-band compaction reserves routing coordinates separately from card padding. Reading-size parallel causal paths and AND collection buses have at least 24 map pixels of separation in the checked layouts. This is a geometric spacing rule, not a probability or a time interval.
- Phone layouts use narrower cards and a camera that keeps the first card within the viewport. All nodes and connections remain present in the layout; only nearby objects are mounted for drawing. The phone overview does not mount the hidden large graph.
- Portrait tours share the screen with a compact map and vertical zoom controls. Individual stops focus the selected condition; offscreen AND conditions remain part of the same graph.
- A new pointer interaction clears the suppression left by an earlier drag. Dragging no longer prevents the next card click. English glossary matches no longer link abbreviations inside words such as “oversight” and “training.”

## Browser checks

The browser viewport was resized; these are not tests on physical phones.

| Viewport | Checks |
| --- | --- |
| 320 × 568 | English control route; first card within screen; tour and R4 detail stop; readable text, reachable navigation and zoom controls; no page-width overflow |
| 375 × 667 | Japanese control route; horizontal drag followed by a card action and detail dialog |
| 390 × 844 | Japanese opening overview, control route and tour during mobile layout refinement |
| 430 × 932 | English overview, seven choices and no mounted hidden graph; money route; F5 tour stop with complete wrapped card title and readable body |
| 1440 × 900 | Japanese C1 detail dialog and “地図で見る”; camera returns to C1; visible OR branches and separated parallel influence paths; no expand buttons |

The 320-pixel tour body retained about 199 pixels of vertical reading space and the map about 141 pixels. At 430 pixels wide these were about 417 and 287 pixels. There was no document-level horizontal overflow in either measurement. The English R4 text retained “oversight” as an ordinary word. F5's title had equal client and scroll heights.

## Automated checks

`npm run check` passed: 56 tests plus content validation, review coverage, TypeScript and lint. `npm run build` produced the GitHub Pages artifact successfully.

The added layout checks cover every route in phone dimensions, identical nodes/connections on phone and desktop, separated parallel paths and AND buses, and card/arrow-label overlap. The full map remains below 6,500 pixels on each layout axis; the paint surface is still limited to the viewport and its buffer. Expanding all conditions by default does not mean painting the whole map at reading scale.

## Limits

No physical Safari/Android multi-touch, low-end-device frame rate, battery use, or Core Web Vitals result is claimed. The existing pinch math and pointer capture tests pass, and browser drag, card, select, dialog and camera interactions were exercised. Initial-loading and rendering changes should be distinguished from a measured speed improvement on a particular phone.

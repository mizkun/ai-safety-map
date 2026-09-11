# Architecture

AI Safety Map is a static React application. The content model, diagram geometry,
reading state, and visual components have separate responsibilities. Content does
not depend on the browser, and diagram geometry does not depend on React.

## Application

| Module | Responsibility |
| --- | --- |
| `app/map-client.tsx` | Connect navigation, the diagram, the tour, and reading dialogs |
| `app/map-header.tsx` | Evidence toggle, display scope, language, and library menu |
| `app/onboarding-dialogs.tsx` | First-visit introduction and AND/OR guide |
| `app/use-map-navigation.ts` | Browser history, URL transitions, and reading/camera restoration |
| `app/use-detail-content.ts` | Fetch and cache a complete detail package for each language |
| `app/use-review-day.ts` | Refresh the Japanese calendar day used by review reminders |
| `app/reading/` | Card, connection, glossary, evidence, and library dialogs; shared reading markup |
| `app/tree-map.tsx` | Coordinate layout, viewport, camera, visible content, and map gestures |
| `app/diagram/` | Render cards and connections without owning navigation or camera state |
| `app/map-tour.tsx` | Scenario/step selectors, reading rail, and keyboard controls |
| `app/map-minimap.tsx` | Show and control the current map viewport |

`MapClient` owns transitions between features. Dialogs receive the existing
navigation controller rather than creating another history stack. Glossary and
card references share the rendering tools in `app/reading/use-reading-tools.tsx`,
so links work the same way in a tour, a card, and another glossary entry.

The initial document contains geometry, identifiers, and short labels. Detailed
prose is loaded only when needed. The selected language's package is retained
across reading detours; the diagram continues to use the lightweight initial
content. Package validation checks the nodes shipped with the page rather than
depending on one specially named card.

## Diagram

The layout pipeline has one-way runtime dependencies:

```text
tree-layout
  ├─ expanded-tree-layout / phone-overview-layout
  └─ horizontal-tree-layout
       ├─ tree-geometry
       │    ├─ tree-projection
       │    └─ rounded-bus
       └─ axis-compaction
```

- `lib/tree-types.ts` describes tiles, wires, groups, joins, and projections.
- `lib/tree-layout.ts` chooses the layout and adds the present as an orientation
  link. `expanded-tree-layout.ts` lays out nested conditions and scenarios.
- `lib/horizontal-tree-layout.ts` compacts occupied space and selects desktop or
  mobile orientation. `tree-projection.ts` projects points and paths without
  invoking layout generation.
- `lib/tree-geometry.ts` computes paths, junctions, and card ports.
- `lib/tree-rendering.ts` prepares shared paths for the map and minimap.
- `lib/relation-labels.ts` and `connection-labels.ts` place controls away from
  cards, other controls, and unrelated wires.
- `lib/map-palette.ts` contains scenario colors. Evidence colors and their meaning
  remain in `lib/current-evidence.ts`.

Layout and rendering must preserve every canonical node and connection. AND/OR
groups, feedback, orientation links, and mitigating relationships have different
meanings; visual simplification must not change those meanings. The paint surface
is limited to the visible window, including when the complete map is open.

## Styles

`app/globals.css` is an ordered entry point for `app/styles/`. Foundation and
shared rules come first; diagram, reading, tour, mobile, minimap, and evidence
rules refine them. Import order is part of the cascade. Keep a responsive rule
with its feature, and check shared selectors before moving it between files.

The application uses Material UI and Emotion. There is no second component
framework or utility-CSS generator. Keep card typography and content alignment
independent of corner markers, and verify both states when changing switches.

## Content and publication

`content/` contains stable IDs, shared relationships, Japanese explanations,
reviewed English translations, sources, and review metadata. `lib/content-reader.mjs`
reads the canonical content; `read-site-content.mjs` applies enabled translations;
`content-package.mjs` creates the initial shell and content-addressed detail files.

The scripts in `scripts/` validate references, graph logic, review fingerprints,
translations, and freshness. A wording or evidence change follows the editorial
workflow in [CONTRIBUTING.md](CONTRIBUTING.md). A code-only refactor must not refresh
research dates or alter content fingerprints.

`npm run build` produces `dist/pages/`. Its preparation step checks that the page
references the matching detail packages and that every entry-point asset exists.
GitHub Actions validates and publishes `main` to the existing custom domain.

## Verification

Run `npm run check` and `npm run build`. Diagram tests are separated into layout,
geometry, tour, and camera files under `scripts/map/`. Navigation tests cover
shareable state and Back/Forward restoration; content-package tests cover the
initial shell, language separation, package versions, and incomplete responses.

For changes to rendering or application composition, also inspect desktop and
mobile views, both languages, evidence on/off, a tour reading detour, nested
glossary links, and Back/Forward. For layout refactors, compare coordinates and
paths before and after, in addition to checking the structural invariants.

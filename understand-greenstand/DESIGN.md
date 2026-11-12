---
name: understand-greenstand site look
description: The built pages read as a land-cover map of the code estate.
colors:
  ground: "#f3f5f0"
  ground-dark: "#131915"
  surface: "#e8ece5"
  surface-dark: "#1b231e"
  ink: "#1b2420"
  ink-dark: "#e2e8e0"
  muted: "#56625a"
  muted-dark: "#9aa79e"
  link: "#2c5d84"
  link-dark: "#8fb9d9"
  best-guess: "#7a5a12"
  best-guess-dark: "#d9b25c"
  not-working: "#9e3f4b"
  not-working-dark: "#e08a93"
  line: "#c5cec3"
  line-dark: "#2e3a33"
  edge: "color-mix(in srgb, #1b2420 25%, transparent)"
  edge-dark: "color-mix(in srgb, #e2e8e0 25%, transparent)"
  selection: "color-mix(in srgb, #1b2420 18%, transparent)"
  selection-dark: "color-mix(in srgb, #e2e8e0 18%, transparent)"
  parcel-field: "color-mix(in srgb, #1b2420 11.5%, transparent)"
  parcel-field-dark: "color-mix(in srgb, #e2e8e0 9.1%, transparent)"
  evergreen: "#35614e"
  evergreen-dark: "#33634d"
  cropland: "#92600d"
  cropland-dark: "#916618"
  shrub: "#bba25b"
  shrub-dark: "#b49e56"
  wetland: "#6f9db3"
  wetland-dark: "#7fb0c6"
  deciduous: "#6c8951"
  deciduous-dark: "#49854f"
  mixed-forest: "#b1bd97"
  mixed-forest-dark: "#b1b38e"
  bare-ground: "#7c796e"
  bare-ground-dark: "#858377"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.1rem)"
    fontWeight: 720
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  display-rail:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.95rem"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline-featured:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 680
    lineHeight: 1.15
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 660
    lineHeight: 1.15
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 640
    lineHeight: 1.3
  display-text:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem)"
    fontWeight: 720
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-text:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 660
    lineHeight: 1.15
  title-text:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.16rem"
    fontWeight: 640
    lineHeight: 1.15
  title-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 640
    lineHeight: 1.3
  numeral:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 75"
  body:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "1.03125rem"
    fontWeight: 400
    lineHeight: 1.62
  body-small:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1.2
    fontVariation: "\"wdth\" 87.5"
  label-rail:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.25
    fontVariation: "\"wdth\" 87.5"
  label-nav:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 500
    lineHeight: 1.3
    fontVariation: "\"wdth\" 87.5"
  label-table:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 600
    lineHeight: 1.3
    fontVariation: "\"wdth\" 87.5"
  subtitle:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.62
  numeral-station:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1.25rem"
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 75"
  label-bar:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.3
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 87.5"
  label-snapshot:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 500
    lineHeight: 1.3
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 87.5"
  label-summary:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 600
    lineHeight: 1.6
    fontVariation: "\"wdth\" 87.5"
  title-fold:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 600
    lineHeight: 1.45
  label-count:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 500
    lineHeight: 1.45
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 87.5"
  mono:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "0.86em"
  drawing-title:
    fontFamily: "\"Archivo Drawing\", system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "18px"
    fontWeight: 600
  drawing-line:
    fontFamily: "\"Archivo Drawing\", system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
  drawing-numeral:
    fontFamily: "\"Archivo Drawing\", system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "17px"
    fontWeight: 600
    fontFeature: "\"tnum\""
rounded:
  none: "0"
spacing:
  cell-gap: "2px"
  group-gap: "6px"
  page-margin: "1.25rem"
  entry: "0.85rem"
  number-column: "2.75rem"
  section: "3rem"
  rail: "17.5rem"
  reading-column: "44rem"
  text-content: "64rem"
  diagram-plate: "62rem"
  journey-column: "58rem"
  station: "3.5rem"
  sticky-bar: "2.5rem"
  stage: "3rem"
components:
  estate-cell:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    height: "clamp(2rem, 1.3rem + 2.4vw, 3.25rem)"
  estate-cell-rail:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.ink}"
    typography: "{typography.label-rail}"
    rounded: "{rounded.none}"
    height: "1.5rem"
  area-chip:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    size: "0.8em"
  start-here-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.6rem 1.75rem 1.4rem"
  register-entry:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.85rem 0 1.1rem"
  snapshot-line:
    textColor: "{colors.muted}"
    typography: "{typography.label-snapshot}"
  jump-link:
    textColor: "{colors.ink}"
    typography: "{typography.label-nav}"
  text-link:
    textColor: "{colors.link}"
  parcel-field:
    backgroundColor: "{colors.parcel-field}"
    width: "{spacing.rail}"
  estate-mark-small:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    width: "8.5rem"
    height: "0.55rem"
  estate-mark-rail:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    width: "min(100%, 13.5rem)"
    height: "0.75rem"
  back-link:
    textColor: "{colors.ink}"
    typography: "{typography.label-nav}"
    padding: "0.15rem 0"
  code-inline:
    backgroundColor: "{colors.surface}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "0.1em 0.15em"
  code-block:
    backgroundColor: "{colors.surface}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "1rem"
  table-head:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label-table}"
    padding: "0.55rem 0.8rem"
  quote:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  diagram-plate:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "1.5rem 1rem"
  diagram-node:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  chapter-line:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  track-station:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "{spacing.station}"
    padding: "0.7rem"
  track-station-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    size: "{spacing.station}"
  station-number:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.numeral-station}"
    rounded: "{rounded.none}"
    height: "1.25rem"
    padding: "0 0.2rem"
  station-label:
    textColor: "{colors.ink}"
    typography: "{typography.label-rail}"
  sticky-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.label-bar}"
    height: "{spacing.sticky-bar}"
  bar-dot-current:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "0.65rem"
  bar-dot-done:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.none}"
    size: "0.65rem"
  state-tag-best-guess:
    textColor: "{colors.best-guess}"
    typography: "{typography.label}"
  state-tag-not-working:
    textColor: "{colors.not-working}"
    typography: "{typography.label}"
  flag:
    rounded: "{rounded.none}"
    padding: "0.6rem 0.85rem"
  stage-number:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  stage-media:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
  developers-box:
    typography: "{typography.label-summary}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.9rem"
  fold-summary:
    textColor: "{colors.ink}"
    typography: "{typography.title-fold}"
    padding: ".6rem 0 .6rem 1.1rem"
  fold-count:
    textColor: "{colors.muted}"
    typography: "{typography.label-count}"
  chapter-number:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  drawing:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
  drawing-step:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.drawing-title}"
    rounded: "{rounded.none}"
  drawing-step-number:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.drawing-numeral}"
    rounded: "{rounded.none}"
    size: "30px"
---

# Design System: understand-greenstand site look

## Overview

**Creative North Star: "The Land-Cover Map"**

The site reads as a land-cover classification map of the code estate. Each area of repos is a land-cover class. Each class has one flat, muted area color. The snapshot commit is the scene date. The reader sees the whole estate in one estate strip, learns the area key, follows the numbered Start here path, and then finds a repo entry with its proof links.

The site look is calm and dense. The page is a mineral ground with evergreen-black ink. Hairline rules divide the content. The parcel field, the faint ink boundaries of made-up field parcels, lies behind the legend rail. It is decoration, not data. Apart from the link blue, the area colors are the only saturated colors on the page, and they fill shapes only. The pages follow the color scheme of the reader, so each color is a pair: one value for light, one value for dark (the `-dark` tokens). The site look refuses the GitHub-clone docs look (the former look) and the stock eco template: no leaf art, no gradients, no drop shadows, no Greenstand logo.

Scope of this record: every page that the site scripts make is in the site look. These pages are the landing page, the text pages, the capture journey pages, the contributors page, the moved pages, and the roadmap page. The shared base is the colors in `.github/scripts/site-colors.mjs` and these parts of `.github/scripts/site-html.mjs`: `siteStyle`, `siteHead`, the estate mark (`estateMark(areas, current)`, `areaGroup`, `areaStyle`), the masthead (`masthead`, `mastheadStyle`), the reading column (`READING_COLUMN`), the content column of the capture journey page (`CONTENT_COLUMN`), the plate edge (`PLATE_EDGE`), the inline code chip (`CODE_CHIP`), the state marks (`STATE_STYLE`), the rules of running text (`TEXT_STYLE`), the area chip (`CHIP_STYLE`), the page footer (`PAGE_END_STYLE`), and the files of the site look (`SITE_LOOK_FILES`: the font and the parcel field). The parcel field is also in the shared base (`.github/scripts/build-parcel-field.mjs` writes `art/parcel-field.svg`). `build-landing.mjs` writes the landing page. `render-md.mjs` writes the text pages: the ecosystem maps, the shared-resource page, the estate glossary, the volunteer guide, and the onboarding guide, the README, and the glossary of each repo. `capture-journey-page.mjs` holds the capture journey page of each chapter, and `build-capture-journey.mjs --site` writes them: `capture-journey.html` for chapter 1 and `capture-journey-<id>.html` for a later chapter (`capture-journey-web-map.html` for chapter 2, `capture-journey-token.html` for chapter 3, and `capture-journey-organizations.html` for chapter 4). `build-moved.mjs` writes the moved pages: a moved page is at the former name of a repo and sends the reader to the new name. `roadmap-page.mjs` holds the roadmap page, and `build-roadmap.mjs --site` writes it (`roadmap.html`). The roadmap page shows the Greenstand roadmap by the areas of the estate. Its text copy for GitHub is `docs/roadmap.md`. Every page shows the parcel field. The former look (`BASE_STYLE`) is not in the build any more.

**Key Characteristics:**
- A mineral ground, an ink text color, and water blue for links only, from one data module of [light, dark] pairs.
- Eight area colors (seven land-cover classes and ink for Organization) that fill cells, chips, and rules, never text.
- An ink edge on each area fill, so that pale fills stay visible on the ground.
- Archivo (a variable face with a width axis) for headings, labels, and numerals; the system sans for body text.
- Square corners, hairline rules, and no elevation. Each plate in the surface color has a hairline neatline, as the frame of a map sheet.
- The parcel field: the faint, still ink boundaries of made-up field parcels under the legend rail on a wide screen and under the masthead on a phone. The content column stays plain.
- The estate strip as the signature: a picture on a phone, a row of links on a wider page, an upright legend in the legend rail on a wide screen. The other pages show it small, as the estate mark in the masthead. On a one-repo page, the locator outlines the cell of that repo.
- The capture journey as an ink track: one square station for each stage. A best guess has a hatch, and a part that does not work has a cross.
- Diagrams on a plate in the surface color, with each repo node in a tint of its area color.
- The roadmap page: one group section for each area in its area color, and each section of the source as a fold with its item count.

## Colors

A muted, flat land-cover palette on a pale mineral ground, with one blue for links and two state colors. All colors live once in `.github/scripts/site-colors.mjs`: `BACKGROUNDS` (ground, surface), `TEXTS`, `STATES`, `LINES` (line), and `AREA_COLORS`, and the ink share of the parcel field (`PARCEL_FIELD_INK_SHARE`). `siteStyle` makes the CSS custom properties from them (`--<name>`, `--c-<name>` for an area color, and `--parcel-ink-share`).

### Primary
- **Water Blue** (`link`, `link-dark`): the color of links only. Links have a 1px underline in 35% of the link color; on hover the underline takes the full link color. The focus ring (2px solid, 2px offset) is water blue too.

### Secondary
The area colors. `estate.json` gives each area a `"color"` (the area color name). The page sets `--area` from it on each area element.
- **Evergreen** (`evergreen`): Core API.
- **Cropland Ochre** (`cropland`): Wallet.
- **Shrub Khaki** (`shrub`): Admin.
- **Wetland Blue-Gray** (`wetland`): Web map.
- **Deciduous Green** (`deciduous`): Mobile.
- **Mixed Forest Sage** (`mixed-forest`): Data ingest.
- **Bare Ground Taupe** (`bare-ground`): Infrastructure.
- **Ink** (the `ink` text color, `--c-ink`): Organization, the area of Greenstand's own documents, not code. It is the same value as the text ink. Start here has no repos, so it has no area color.

Area colors fill the estate strip cells, the estate mark cells, the area chips, the 3px top rule of each area section, and the 14% tint of a target repo entry. On the roadmap page, an area color fills the chip and the 3px top rule of the group section of its area, and the chip before the area name in the At a glance table. In a diagram, the node of a repo has a fill of its area color at the node tint (`DIAGRAM_NODE_TINT`, 30%) mixed with the ground, and a 1.5px border in its area color. Readers with red-green color blindness can tell the area colors apart (see the Color-Blind Key Rule).

### Tertiary
The state colors (`STATES`). A state color is the color of a state. The state colors are text colors. They also paint the state marks and the border of a flag. Each one is for its state only.
- **Best-Guess Ochre** (`best-guess`): the state color of a best guess.
- **Not-Working Rose** (`not-working`): the state color of a part that does not work or is gone.

A state never shows by its state color alone: a best guess also has a hatch, and a part that does not work also has a cross. CI checks these tokens. The capture journey pages show the states: in a state tag, in a flag, and in the legend (see State marks). The roadmap page shows a best guess: in a state tag in the summary of a fold, in a flag in the fold with the reason, and as a mark in a row of the At a glance table (see State marks). The roadmap page shows no not-working state. The legend of a chapter shows only the flag kinds that the chapter has. The error image of a broken diagram also uses a state color: Mermaid draws it in the not-working color (`errorBkgColor` and `errorTextColor`), with its own error text.

### Neutral
- **Mineral Ground** (`ground`): the page background, the `html` background, the browser bar color (`theme-color`), the scrollbar track, and the fill of the diagram nodes and clusters. On the capture journey page, it is the fill of a station, the color of a station number and of a station icon on hover, and the background of the sticky bar. In a drawing in the site look: the fill of a step box, of the cloud, and of the cylinder, and the color of a step numeral.
- **Field Surface** (`surface`): a field on the page. The Start here field and the welcome plate of the contributors page use it. On a text page, the inline code, the code blocks, the table heads, the quotes, and the diagram plates use it. It is also the background of the edge labels in a diagram. On the capture journey page, the image plate of a stage and the inline code use it. On the contributors page and on a moved page, the inline code uses it. It is the background of a drawing in the site look.
- **Evergreen-Black Ink** (`ink`): body text, headings, the jump links, the back links, the rail names, the "you are here" outline, the locator outline on the estate mark, the 2px rule above a text-page h2, and the labels of the diagram nodes. On the capture journey page: the track line, the station borders and icons, the station fill on hover, the fill of a station number, the 2px rule above a stage, the border of a bar dot, and the fill of the current bar dot. In a drawing in the site look: the titles and the squares of the step numbers. On the roadmap page: the 2px rule above a group section that is not an area, and the fold marker on hover.
- **Lichen Muted** (`muted`): secondary text: the Start here intro, the snapshot label, the "Go deeper" line, the path numerals, the area keys in the legend rail, the list markers, and the quote text. In a diagram, it is the color of the lines and of the node borders. On the capture journey page: the chapter line, the subtitle, the legend, the stage labels, the captions, the marker of a "For developers" box, the text "No public issue yet.", and the footer. On the roadmap page: the credit line, the repos line and the note of a group section, the fold marker, the item count of a fold, and the footer. Muted has a second job as a fill: the done dots of the sticky bar (fill and border). In a drawing in the site look: the other lines of text, the borders of the boxes, the lines, and the arrow heads.
- **Hairline** (`line`): the neatline of each plate in the surface color (`PLATE_EDGE`), 1px rules between entries, the masthead rule on narrow pages, the jump-link border, the rail-edge hairline (a fixed 1px rule at the edge of the legend rail on a wide screen), the table row rules, the `hr` rule, the hover underline of a back link, the cluster borders of a diagram, and the scrollbar thumb. On the capture journey page: the rule below the sticky bar, the hover underline of a station label, the border of a drawing, the border of a "For developers" box, and the rule above the footer. On the roadmap page: the rules between the folds, and the rule above the footer.
- **Ink Edge** (`edge`): a 1px inset outline in 25% ink on each area fill. It has a second job: a 1px inset outline (`outline-offset: -1px`) on a phone screenshot of the capture journey page.
- **Ink Selection** (`selection`): the background of selected text, an 18% ink tint. Selected text stays ink.
- **Parcel Ink** (`parcel-field`): the color of the parcel field and of nothing else. It is the ink at an ink share of 11.5% in light mode and 9.1% in dark mode (`PARCEL_FIELD_INK_SHARE`), mixed with transparent in sRGB. The mask of the field takes this color, so one file serves light and dark.

### Named Rules
**The One Color, One Job Rule.** An area color marks its area and nothing else. It fills cells, chips, rules, and tints. It never colors text. Water blue is for links only. The state colors are for states only.

**The Two Backgrounds Rule.** Each text color has a contrast of 4.5:1 or more on each background (the ground and the surface), in light and in dark mode. `.github/scripts/check-site-colors.mjs` enforces it in CI. Add a new text color to `TEXTS` in `site-colors.mjs`, so that CI checks it.

**The State Apart Rule.** Each area color is 10 or more (CIE76) from each state color, in both schemes. CI enforces it. Thus an area color does not look like a state.

**The Color-Blind Key Rule.** Each two area colors are 10 or more apart (CIEDE2000), in both schemes, for normal vision and for simulated protanopia and deuteranopia (Machado 2009, severity 1). CI enforces it. A new area color must pass this check before a page uses it.

**The Ink Edge Rule.** Every area fill carries the ink edge (a 1px inset outline in 25% ink). Pale fills, for example Mixed Forest Sage, stay visible on the ground.

**The Faint Field Rule.** The parcel field at full mask has a contrast of 1.25:1 or less with the ground, so it stays in the background. Each text color has a contrast of 4.5:1 or more on the field, because the title and the estate strip lie on it. The ink share is above 0 and at most 100. `check-site-colors.mjs` enforces these rules in CI, in light and in dark mode. Today the field is 1.2489:1 (light) and 1.2480:1 (dark) to the ground. The weakest text on the field is best-guess at 4.64:1 and muted at 4.66:1, both in light mode. Change the strength of the field only in `PARCEL_FIELD_INK_SHARE`.

**The Node Tint Rule.** The node of a repo in a diagram has a fill of its area color at `DIAGRAM_NODE_TINT` (30%) mixed with the ground. The ink labels have a contrast of 4.5:1 or more on the node tint of each area color, in light and in dark mode. The tint is a percent above 0 and at most 100. `check-site-colors.mjs` enforces these rules in CI. Today the weakest label is ink on the ink tint (Organization): 7.76:1 in light mode and 5.93:1 in dark mode. Change the tint only in `DIAGRAM_NODE_TINT`.

**The Drawing Colors Rule.** A drawing in the site look holds the site color block: the 5 neutral colors (ground, surface, ink, muted, line) as CSS custom properties on `svg`, light and dark by `prefers-color-scheme`. An SVG in an `<img>` cannot read the custom properties of the page, so the drawing holds its own copy. `build-capture-journey.mjs` writes the block from `site-colors.mjs` (`DRAWING_COLORS` in `site-drawings.mjs`), and `--site` copies the drawing with the current block. `--check` (CI) fails on a stale block. Each mode fails on a `var(--x)` that is not one of the 5. Each mode also fails on any other color outside the block: a hex color, a color function, a named color, or `currentColor`. A drawing with no site color block fails when it uses `var(--x)` or the drawing font. Thus a drawing in the site look has no area color, no state color, and no link color (the One Color, One Job Rule). A drawing with no site color block keeps its own colors.

## Typography

**Display Font:** Archivo (with the system sans as the fallback)
**Body Font:** the system sans (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`)
**Label/Mono Font:** Archivo for labels; `ui-monospace, "SF Mono", Menlo, Consolas, monospace` for code and commit ids only
**Drawing Font:** "Archivo Drawing", a subset of Archivo in each drawing in the site look (with the system sans as the fallback)

**Character:** Archivo is a grotesque with a width axis. It gives the headings and the legend labels the compact voice of a map key. The system sans keeps the body text plain and fast to load.

Archivo comes from the npm package `@fontsource-variable/archivo` 5.3.0, file `archivo-latin-wdth-normal.woff2` (weight 100 to 900, width 62% to 125%, SIL OFL 1.1). The deploy workflow pins the package by its SHA-512 and copies the file and its license to `vendor/archivo/`. Each page preloads it (`siteHead`), but a moved page does not: a moved page shows no Archivo text (`siteHead(toRoot, { preloadFont: false })`). `font-display: swap` applies.

The drawing font comes from the same Archivo file. An SVG in an `<img>` cannot load the font of the page, so each drawing in the site look holds its own copy in the drawing font block. `subset-drawing-font.py` writes the block: 2 static faces at a width of 87.5% (weight 600 and weight 400), with only the characters of the drawing, as WOFF2 data URLs. The CSS family is "Archivo Drawing". The script checks the SHA-256 of the source file. Each face keeps the copyright and license lines of the font (OFL 1.1). `build-capture-journey.mjs` fails when a character of a drawing has no glyph in its drawing font.

### Hierarchy
- **Display** (720, `clamp(2rem, 1.4rem + 2.6vw, 3.1rem)`, 1.15, -0.025em): the site title in the masthead. In the legend rail it is 1.95rem with a line height of 1.02. Below 30rem it takes a width of 78% and -0.02em.
- **Headline** (660, 1.45rem, 1.15): the heading of an area section. The Start here heading is 680 and 1.55rem.
- **Title** (640, 1.12rem, 1.3): the name link of a repo entry. In the Start here path it is 1.18rem: a link to a page, or plain ink text for a step with a links line.
- **Numeral** (600, 1.7rem, 1, width 75%, tabular figures, muted): the step number of the Start here path.
- **Body** (400, 1.03125rem, 1.62): all running text. The size is 16.5px at the default font size of 16px, and it follows the default font size of the reader. The lede and the volunteer line are 1.06rem in a 42rem column. Entry descriptions stop at 40rem. Small text (0.92rem) carries the entry links and the "Go deeper" line.
- **Label** (600, 0.82rem, 1.2, width 87.5%): the area keys in the legend rail (muted) and the repo name that shows on hover or focus over a strip cell (ink). The rail names are 500 at 0.9rem; the jump links are 500 at 0.98rem; both have a width of 87.5%.
- **Label (snapshot)** (500, .88rem, 1.3, width 87.5%, tabular figures, muted): the snapshot line of a repo entry. It is the scene date of the map sheet, so it is a label in the display face, not small body text. The commit id in it stays in monospace.
- **Mono** (0.86em): commit ids and former repo names, inline code on each page of running text, and code blocks.

On a text page:
- **Display (text page)** (720, `clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem)`, 1.15, -0.02em): the h1 of the page.
- **Headline (text page)** (660, 1.5rem, 1.15): the h2. A 2px ink rule is above it, with a padding of .75rem.
- **Title (text page)** (640, 1.16rem, 1.15): the h3.
- **Title small** (640, 1rem, 1.3): the h4, with `text-wrap: balance`.
- **Label (table)** (600, .92rem, 1.3, width 87.5%): the table heads (`th`). Tables use tabular numbers.
- **Label (back links)**: the back links use the jump-link style (500, .98rem, 1.3, width 87.5%).
- A repo name in a heading moves to the next line as one piece (an inline-block span).
- Diagram labels are in Archivo. Mermaid measures the labels, so the font loads before Mermaid draws.

On the capture journey page:
- **Display (text page)**: the h1 (the title).
- **Subtitle** (400, 1.15rem, muted, `text-wrap: balance`): the line under the title.
- **Headline (text page)** (660, 1.5rem, 1.15): the h2 of a stage.
- **Label** (600, .82rem, width 87.5%): the chapter line (muted, line height 1.25), the state tags (in the state color, line height 1.7), the stage label (muted, tabular, line height 1.2; .74rem where `main` is below 30rem), and the chapter number in the footer (muted, tabular, line height 1.4).
- **Label (station)**: the label of a station uses the rail-name style (500, .9rem, 1.25, width 87.5%).
- **Numeral (station)** (600, .75rem, 1.25rem, width 75%, tabular): the number of a station.
- **Label (bar)** (600, .9rem, 1.3, width 87.5%, tabular): the text of the sticky bar.
- **Label (summary)** (600, .92rem, 1.6, width 87.5%): the summary of a "For developers" box. The text of the box is .92rem.
- Captions are .85rem with a line height of 1.4. The legend is .92rem with a line height of 1.5.
- A long word breaks anywhere (`overflow-wrap: anywhere`), so no text makes the page wider than the screen. Code stays on one line when it fits, because a reader copies it. In a "For developers" box, a longer code breaks inside its own box.
- In a title, "the", "a", or "an" stays on the line of the next word (a no-break space).
- The prose of the page uses the curly apostrophe (’), as it uses the curly quotes. The prose is the story, the flags, the questions, the note, the intro, the subtitle, and the later text (an optional field that no chapter uses now). `build-capture-journey.mjs` refuses a straight apostrophe in these fields. A name, a path, and the "what" of an evidence entry keep their own text.

On the roadmap page:
- **Display (text page)**: the h1. **Headline (text page)**: the h2 of each part and of each group section.
- **Title (fold)** (600, 1.02rem, 1.45, full width): the summary of a fold, which is the heading of a section of the source. It is a heading, so it has the full width.
- **Label (count)** (500, 1.02rem, 1.45, width 87.5%, tabular, muted): the item count in the summary of a fold, after a middle dot ("· 3 items").
- **Label (table)**: the heads of the At a glance table. Below 30rem the cells are .92rem.
- **Label**: the best-guess tag (600, .82rem, width 87.5%, in the best-guess color).
- The credit line is .92rem and muted. The lede and the snapshot line are body text.

In a drawing in the site look (all text in the drawing font, with `text-rendering: geometricPrecision`):
- **Drawing title** (600, 18px, ink): the title of a step, and the name of the cloud, of the cylinder, and of a dashed box.
- **Drawing line** (400, 15.5px, muted): the other lines. A repo name is a drawing line too, not monospace, as the repo nodes of the diagrams. An ink drawing line (the same face and size, in ink) gives a value of a drawn screen (for example "Wallet: Example Org") or the lead line of a drawing (for example "At the approval:").
- **Drawing numeral** (600, 17px, tabular, ground): the step number on its ink square.
- The sizes are in drawing units. A drawing in the site look is 400 units wide. Where `main` is below 30rem, the image plate spans the screen, so a drawing is the screen width less 1rem: 304px at a 320px screen. There a drawing line shows at 11.8px.
- A date in a drawing has the form "2 March 2026": the day, the month name, and the year. A date of numbers only ("3/2/2026") can be read 2 ways.
- The prose of a drawing uses the curly apostrophe (’) and curly quotes, as the page does.
- The 2 older app-screen drawings (`web-map-badges.svg`, `verify-page.svg`) are 360 units wide. Their smallest text is 14 units: 11.8px at a 320px screen and 12.6px at a 1280px screen.

### Named Rules
**The Two Voices Rule.** Archivo sets headings, labels, and numerals. The system sans sets the body text. Monospace sets code and commit ids only.

**The Narrow Label Rule.** Archivo labels use a width of 87.5%. Numerals use a width of 75%. The full width is for headings. Headings use `text-wrap: balance`.

**The No Lone Word Rule.** `siteStyle` sets `text-wrap: pretty` on paragraphs, list items, `dd`, and quotes, on every page in the site look. Thus the browser avoids one word alone on the last line of a paragraph.

**The Whole Name Rule.** A date (YYYY-MM-DD), a repo name, a quoted group in parentheses (for example "(Complete)"), and the last word of a fold heading with its count and its tag stay on one line, in a nowrap span. A browser breaks a line at a hyphen and between an opening quote and "(", and a count must not stand alone on a line. The roadmap page puts the spans in the text between the tags.

**The Drawing Font Rule.** All text of a drawing in the site look is in the drawing font. The system sans is only its fallback. When the words of a drawing change, run `subset-drawing-font.py`, so that the drawing font has each character.

## Layout

### Landing page

The landing page has three layouts.

- **Narrow masthead (below the links width):** the masthead holds the title and the estate mark across the page, over a 1px hairline. One column follows. The page margin is 1.25rem. The parcel field lies under the masthead only, inside its padding box.
- **Links width and more:** the estate strip replaces the estate mark, and its cells are links. The rule is a container query on the masthead (`container: masthead / inline-size`), so the page margins, the default font size, and a scroll bar do not change it. The build computes the links width from the repo counts: it is the narrowest strip where each cell of the area with the most repos can be 24px wide (WCAG 2.2 target size), with the 2px gaps in an area (`CELL_GAP`) and the 6px gaps between areas (`AREA_GAP`). Today it is a strip of 422px (a page of 462px at a 16px default font size). The value changes when the repo counts change.
- **Wide screen (64rem and more):** the body is a grid of a 17.5rem legend rail and a content column. The legend rail is sticky at the top, holds the title and the upright estate strip, and scrolls on its own in a short window (`max-height: 100vh`). The legend rail always shows the links and never the estate mark, at any repo count. The content column is at most 50rem, with a side padding of `clamp(1.5rem, 4vw, 4.5rem)`. The parcel field lies under the legend rail, and the rail-edge hairline marks the edge of the rail. The rail width is `--rail` (17.5rem).

The content column (the reading column) stays plain on all screens: the parcel field never lies under it. `site-html.mjs` holds the two media queries: `WIDE` (`(min-width: 64rem)`) and `NARROW` (`not all and (min-width: 64rem)`). `NARROW` is the exact opposite of `WIDE`, so no width falls between them. `build-landing.mjs` uses `WIDE` and `var(--rail)` for its grid.

The content column holds, in order: the lede, the volunteer line, the Start here field, the jump links, and one area section for each other area. Area sections are 3rem apart. Repo entries are one column, divided by hairlines, with 0.85rem above and 1.1rem below. The Start here path puts its numbers in a 2.75rem margin number column. Anchors have a scroll margin of 1.5rem.

Difference from the direction contract: the contract FORM names a dense two-column repo register on wide screens; the build has one column of repos, because the legend rail layout keeps the register to one column (FIRST VIEWPORT and the surface brief). The build wins.

### Text pages

A text page has two layouts. Each child of `main` is border-box and at most 44rem wide (the reading column, `READING_COLUMN`). `mastheadStyle(READING_COLUMN)` in `site-html.mjs` gives the masthead and the page grid. `TEXT_STYLE` in `site-html.mjs` gives the rules of running text: the padding of `main`, the headings, the lists, code, the table, quotes, rules, and the reading column. The text pages and the roadmap page take these rules from `TEXT_STYLE`.

- **Narrow screen (`NARROW`):** the masthead is a band at the top, over a 1px hairline. It holds the estate mark (8.5rem x .55rem) over the back links, in one row that wraps. Its padding is 1.25rem, and its side padding grows (`max(1.25rem, calc((100% - 44rem) / 2))`), so the estate mark and the back links align with the reading column. The parcel field lies under the masthead only. `main` has a padding of 1.5rem 1.25rem 5rem, and the reading column is in the center.
- **Wide screen (`WIDE`):** the body is a grid of the legend rail (`var(--rail)`) and the content column. The legend rail is sticky at the top, with a padding of 2.4rem 1.5rem 2rem 2rem and no hairline below it. It holds the estate mark (100% of the rail up to 13.5rem, x .75rem) over the back links, one under the other. The parcel field lies under the legend rail. `main` is at most 64rem, with a padding of 1.25rem `clamp(1.5rem, 4vw, 4.5rem)` 5rem. The children of `main` start at the left.

A diagram can be wider than the reading column. On a narrow screen its plate is up to 62rem wide, in the center. On a wide screen the plate takes the full width of `main`. Each diagram keeps at least 70% of its own width, so its labels stay readable on a phone. A wider diagram scrolls in its own box. A table also scrolls in its own box. The block rhythm: paragraphs, lists, tables, code blocks, and quotes have 1rem below them; list items are .3rem apart; headings have a scroll margin of 1.5rem.

### Capture journey page

The capture journey page uses the masthead and the page grid of the text pages (`mastheadStyle`), with the content column (`CONTENT_COLUMN` in `site-html.mjs`, 58rem). It is the only page with the content column. On a narrow screen, the masthead content aligns with this column.

- **Narrow screen (`NARROW`):** `main` has a padding of 1.25rem 1.25rem 5rem. The children of `main` are at most 58rem wide, in the center.
- **Wide screen (`WIDE`):** the side padding of `main` is `clamp(1.5rem, 4vw, 4.5rem)`. The children of `main` start at the left.

The intro paragraphs, the legend, and the footer paragraphs stay in the reading column (`READING_COLUMN`, 44rem). `main` is a container (`container-type: inline-size`). The stage layout and the track follow the width of `main`, not of the screen, because the legend rail takes a part of a wide screen:
- **`main` 46rem or less:** a stage is one column, and the images come first.
- **`main` 34rem or less:** a track of up to 4 stations stays in one row, with its line. A longer track is rows of 3 stations with no line. A phone screenshot is 130px wide (150px in a wider `main`).
- **`main` below 30rem (a small phone):** the image plate of a stage reaches the edges of the screen (a negative margin of the page padding), with a side padding of .5rem. The stage label column is compact, and the text under the heading takes the full width.
- **`main` below 20rem (the narrowest phones):** a track of 4 stations is 2 rows of 2, with no line. No station is ever alone in a row (`trackColumns` in `capture-journey-page.mjs`).

Stages are 3rem apart. A link to a stage lands the stage under the sticky bar (`scroll-margin-top: 2.5rem`), so the ink rule of the stage shows under the hairline of the bar.

### Contributors page

The contributors page (`contributors-page.mjs`) uses the masthead and the page grid of the text pages, with the reading column (`mastheadStyle(READING_COLUMN)`). Each child of `main` is border-box and at most 44rem wide: the text, the welcome plate, the grid of names, and the heading rules. Thus the page has one right edge, as the text pages do. The grid of names is `repeat(auto-fill, minmax(min(15rem, 100%), 1fr))`, with columns 2rem apart and a hairline above each name.

- **The switch:** 2 square buttons in a 1px line border, at most 15rem each. The pressed button has an ink fill with ground text; in forced colors it takes `Highlight` and `HighlightText` (`forced-color-adjust: none`), so the state does not depend on the ink fill. The dates of each window are a muted second line in the system sans, with tabular figures. The dates in a window title have tabular figures too.
- **The welcome plate:** a plate in the surface color with the neatline (`PLATE_EDGE`), border-box, and a padding of 1.4rem 1.75rem 1rem (1.1rem at the sides below 30rem). One thank-you line for each newcomer, a hairline between the lines. In forced colors the surface tone is gone, and the neatline shows the plate.
- **A name:** the login in ink with a line underline (a link to the GitHub profile), a "new" tag (an ink outline, Archivo 600 at .75rem), and the figures under it: Archivo at 87.5% width, the numbers in ink at weight 650, the labels muted. Only the kinds above 0 show. No avatar.
- **Without JavaScript and in print:** no switch; both windows show, one after the other, each with its title (an h2 with the ink rule). With JavaScript (the class `js` on `html`, set in the head before the first paint) only the chosen window shows, and its title is for screen readers only.

### Moved pages

A moved page uses the same masthead and page grid, with the reading column (`mastheadStyle(READING_COLUMN)`). Its one paragraph is in the reading column. On a narrow screen, `main` has a padding of 1.5rem 1.25rem 5rem, and the column is in the center. On a wide screen, `main` has a padding of 2.4rem `clamp(1.5rem, 4vw, 4.5rem)` 5rem, and the column starts at the left.

### Roadmap page

The roadmap page uses the masthead, the page grid, and the rules of running text of the text pages (`mastheadStyle(READING_COLUMN)` and `TEXT_STYLE`). Thus it has the reading column (44rem) and the padding of `main` of a text page. The content column holds, in order: the title, the lede, the snapshot line, the credit line, the milestones, the At a glance table, one group section for each area, the two groups that are not an area ("Across the estate" and "Outside the documented estate"), and the footer. Group sections are 2.9rem apart, as the h2 of a text page, with a scroll margin of 1.5rem. The parts of a fold under the summary are 1.1rem in, level with the summary text.

- **Narrow table (screen below 30rem):** the At a glance table fits the screen, with no sideways scroll at 320px. The cell text is .92rem, the cell padding is .5rem .4rem, the first and the last column have no outer padding, and the column of the section names uses auto hyphens. In the first column, a long name wraps beside its chip.
- **Print:** every fold is open in print. After the print, each fold is as it was.

### Named Rules
**The 24 px Target Rule.** A strip cell is a link only where it can be 24px wide. Below that width, the strip is the estate mark: a picture with no links and no words, hidden from screen readers. Do not hard-code the width; compute it from the repo counts and test it on the masthead container, not on the page. In the legend rail each row is at least `max(1.5rem, 24px)` high, so the rail always has links.

## Elevation & Depth

The site look is flat. It has no drop shadows, no gradients, and no layered cards. Depth comes from tone only: the surface field is one step darker than the ground in light mode (one step lighter in dark mode). The only `box-shadow` in the system is the 1px inset ink edge on area fills; it is an outline, not an elevation.

A plate is a block in the surface color: the Start here field, a code block, a diagram plate, a quote, and the welcome plate of the contributors page. Each plate has a neatline: a 1px hairline in the line color (`PLATE_EDGE` in `site-html.mjs`), as the frame of a map sheet. The neatline is an edge, not an elevation: it is flat and has no shadow. It also shows the plate in forced colors, where the surface tone is gone. The image plate of a capture journey stage has no neatline, because each image on it has its own frame. Diagrams use the "classic" look of Mermaid, because its default look draws node shadows.

The one exception is the scroll shadows of a wide diagram. They show that the diagram scrolls. At each side of the plate, a 2rem gradient in the surface color moves with the diagram (`local`) and covers a .75rem radial shade of 25% ink that stays at the edge (`scroll`). Thus a shade shows only on a side with more of the diagram. The plate takes both values from `site-colors.mjs`, light and dark.

The sticky bar of the capture journey page is flat too: the ground with a hairline below. It lies above the content (z-index 5) and has no shadow.

The parcel field is not an elevation either. It is a still ink layer behind the page: it lies under the content (z-index -1), it takes no pointer events, and it has no shadow and no gradient. The ground is on `html`, and `body` has no background, so the field lies between the ground and the page.

Motion is small and has one job: it shows which cell is under the pointer or the keyboard focus. The color block of a strip cell moves 4px up (3px right in the legend rail) in 0.25s with `cubic-bezier(.16, 1, .3, 1)`. The hover label fades in 0.15s. `prefers-reduced-motion: reduce` turns off both transitions. The parcel field has no motion. Its layer on a wide screen is 100lvh high (100vh where the browser does not know `lvh`), so the layer does not change its size when a browser shows or hides its toolbar.

### Named Rules
**The Flat Map Rule.** Surfaces are flat at all times. Use tone (the surface), the neatline, and hairlines for structure. Use no drop shadow and no gradient. The one exception is the scroll shadows of a wide diagram: they are the cue that a diagram scrolls, and they show nowhere else. The parcel field is a flat ink layer behind the page, not a surface above it.

**The Neatline Rule.** Each plate in the surface color carries `PLATE_EDGE` (1px solid, the line color). Take the edge from `PLATE_EDGE`; do not write a new border value for a plate.

**The One Frame Rule.** A plate that holds framed images has no neatline: a frame inside a frame is noise. The image plate of a capture journey stage has no edge, because each phone screenshot has its ink edge outline and each drawing has its hairline border.

## Shapes

All corners are square (radius 0). Area fills are plain rectangles: strip cells, mark cells, and chips (0.8em squares). Rules are straight: 1px hairlines between entries, around the jump links, and at the edge of the legend rail, and a 3px rule in the area color above each area section. The parcel field has two marks only: straight boundaries with round joins, and round points in rows. The plates (the Start here field, the code blocks, the quotes, the diagram plates, and the welcome plate) are square surface fields with the 1px neatline. The inline code chip and the table heads are square surface fields with no border. A quote has no rule at its side. The h2 has a 2px ink rule above it. Table rows and `hr` are 1px hairlines. A repo node of a diagram has a 1.5px border in its area color. On the capture journey page, the stations, the station numbers, the bar dots, the state marks, the flags, the image plates (with no neatline), and the "For developers" boxes are square. The track line and the station borders are 1.5px ink. A flag has a 1px border in its state color. A stage has a 2px ink rule above it, as the text-page h2. A drawing in the site look is square too. Its step boxes, its cloud, and its cylinder (a store of data) have a ground fill and a 1.5 muted border. Its lines and arrow heads are muted, at a width of 2. A dashed border (`stroke-dasharray: 6 5`) marks a step outside the Greenstand system or an older path. A token in a drawing is a tag shape: a ground box with a pointed left end, a 1.5 ink border, and a muted hole. It is not a coin, because a token is not money. The icons of the stations are line drawings with square corners: a `rect` in `ICONS` has no `rx`. On the roadmap page, 1px hairlines divide the folds, and the fold marker is a solid .75rem triangle. A group section of an area has a 3px rule in its area color. A group section that is not an area has a 2px ink rule, as the text-page h2.

## Components

### Estate strip (signature)
One cell per repo, grouped by area, in the area colors. Each group takes a width in proportion to its repo count. Start here has no repos, so the strip has no Start here group.
- **Cells:** flat area fill with the ink edge, 2px apart in an area, 6px between areas. Height `clamp(2rem, 1.3rem + 2.4vw, 3.25rem)`.
- **Links:** each cell links to its repo entry. On hover or keyboard focus, the color block moves up and the repo name shows below the strip in the label style.
- **In the legend rail:** the strip stands upright. Each group has its area name (the key, muted label) above it. Each row is a 1rem color block and the repo name; a row is at least `max(1.5rem, 24px)` high. The legend rail always shows the strip, never the estate mark. On hover the block moves right and the name gets a hairline underline.
- **You are here:** the row or cell of the repo entry that the address points to gets a 2px ink outline with a 2px offset.

### Estate mark
The estate strip as a picture: the same groups and cells, with no links and no words, and `aria-hidden`. `estateMark(areas, current)` in `site-html.mjs` writes it, with `areaGroup` and `areaStyle`. Every page uses the same markup. The landing page gives it its own size, and `mastheadStyle` gives its size on the other pages.
- **Landing page:** where the masthead is narrower than the links width, it replaces the estate strip. It never shows in the legend rail of the landing page.
- **Text page, capture journey page, contributors page, and moved page:** it is small and always shows. The gap is 3px between areas and 1px between cells, and each cell has the ink edge. It is 8.5rem x .55rem on a narrow screen. On a wide screen it is 100% of the rail up to 13.5rem, x .75rem. In print, the cells keep their area colors (`print-color-adjust: exact` in `mastheadStyle`).
- **Locator:** on a one-repo page (the onboarding guide, the README, or the glossary of a repo, or a moved page of it), the cell of that repo has an ink outline (2px solid, 1px offset). It is the address target of the landing strip in small. `current` is the repo name; on any other page it is null, and no cell has the outline. `render-md.mjs` takes the repo from the page path (`repos/<name>/`), and `build-moved.mjs` gives the new name.

**The Locator Rule.** The estate mark outlines one cell at most: the cell of the repo of a one-repo page. The outline is ink (2px solid, 1px offset), never an area color. A page about more than one repo shows no locator.

### Text-page masthead
The estate mark over the back links. On a narrow screen it is the band at the top; on a wide screen it is the legend rail (see Layout). `masthead(areas, parts, current)` in `site-html.mjs` writes it, and `mastheadStyle(column)` gives its style. `masthead` gives `current` to `estateMark` (see Locator). The capture journey page, the contributors page, and the moved pages use the same masthead with other parts (see below).
- **Back links:** "← " and the back label (the viewer of the repo, or another page), and "All viewers" on a page in a repo folder. Archivo 500 .98rem/1.3, width 87.5%, in ink, with no underline. On hover a hairline underline in the line color shows. Each link has a padding of .15rem above and below, so it is 24px high or more.
- **Gaps:** .25rem between rows and 1.5rem between links in the narrow band. In the legend rail the links are one under the other.

### Text-page content
- **Headings:** see Typography. The h2 has the 2px ink rule above it.
- **Lists:** muted markers.
- **Code chip:** inline code on the surface, with a padding of .1em .15em (`CODE_CHIP` in `site-html.mjs`). The thin side padding makes a code in parentheses read as tight punctuation. Code in a code block has no chip. The text pages, the capture journey page, the contributors page, and the moved pages take the chip from `CODE_CHIP`. The commit ids of the landing page have no chip.
- **Code block:** a plate on the surface with the neatline and a padding of 1rem. It scrolls in its own box. Square corners.
- **Tables:** the table scrolls in its own box. The heads are on the surface in the table label style. Cells have a padding of .55rem .8rem and a hairline below. Numbers are tabular.
- **Quotes:** a plate on the surface with the neatline, muted text, a padding of .75rem 1rem, and no rule at the side.
- **Rules:** `hr` is a hairline, with 2rem above and below.

### Diagrams
Only a page with a Mermaid block loads Mermaid and gets the diagram style.
- **Plate:** a surface plate with the neatline and a padding of 1.5rem 1rem, square, with the diagram in the center (see Layout for its width). A wide diagram scrolls in the plate and shows the scroll shadows (see Elevation & Depth).
- **Theme:** Mermaid theme "base" with `themeVariables` from `site-colors.mjs`, light and dark: nodes in the ground color with a muted border, ink labels, muted lines, the edge label background in the surface color, and clusters in the ground color with a line border. Look "classic". The node padding is 10 (`flowchart: { padding: 10 }`; the Mermaid default is 15), so the widest map shows at its own size at a 1280px screen. The labels are in Archivo. When the color scheme changes, Mermaid draws the diagrams again.
- **Repo nodes:** a node whose label is exactly the name of a repo in `estate.json` gets the class `area-node` and `--area` (its area color). Its fill is the node tint (30%) of the area color on the ground, and its border is 1.5px in the area color. The ink labels stay (see the Node Tint Rule).
- **Broken diagram:** the error image is in the not-working color. A broken diagram does not stop the area colors and the sizes of the other diagrams: the script sets them in a `finally`.
- **Loading:** until Mermaid draws, the page hides the source text of the diagrams. A browser without modules shows the source text.

### Parcel field
The background of the site look: the boundaries of made-up field parcels, seen from above, in parcel ink. About one parcel in five has rows of points (planting rows). The field is decoration, not data: no parcel is a real place or a capture.
- **Source:** `build-parcel-field.mjs` draws the field from a fixed seed (20261103) into `art/parcel-field.svg` (1600 x 1000, `preserveAspectRatio="xMidYMid slice"`). Each run writes the same file, byte for byte. The deploy workflow runs it. Each page script fails when the file is missing (`SITE_LOOK_FILES`).
- **Marks:** boundaries at a stroke width of 1.1 with round joins. Points 9 units apart, 7 units or more from the edge of the parcel, with round caps, a stroke width of 2.4, and an opacity of 0.8. No fills and no hatch: a hatch is the mark of a best guess.
- **Paint:** the file is a mask (`center / cover no-repeat`). Parcel ink (`color-mix(in srgb, var(--ink) var(--parcel-ink-share), transparent)`) paints the layer through the mask.
- **Wide screen (`WIDE`):** a fixed layer (`body::before`) under the legend rail, `var(--rail)` wide and 100lvh high, at z-index -1, with no pointer events. A fixed 1px rule in `line` (`body::after`) is the rail-edge hairline, from the top to the bottom of the window.
- **Narrow screen (`NARROW`):** the layer (`.masthead::before`) lies under the masthead only, inside its padding box. The masthead makes its own stacking context (`isolation: isolate`).
- **Not shown:** under the content column. The field and the rail-edge hairline are hidden in forced colors, with `prefers-contrast: more`, and in print.
- **Motion:** none. The field is still.

### Chips
- **Style:** a 0.8em square in the area color with the ink edge, before the area heading and before each jump link. A chip has no words and is hidden from screen readers. In print it keeps its color. The landing page and the roadmap page take its rule from `CHIP_STYLE` in `site-html.mjs`.
- **State:** none. Start here has no chip.

### Start here field
- **Corner Style:** square.
- **Background:** the surface.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** the neatline (`PLATE_EDGE`). Hairlines divide the steps.
- **Internal Padding:** 1.6rem 1.75rem 1.4rem.
- **Content:** the Start here heading (no chip, no rule), the intro in muted, and an ordered list of steps with muted Archivo numerals in the margin number column. Most steps link a page of the docs repo: the name is the link. A step with links to other sites has its name in plain text and a links line under the description. The "Go deeper" line aligns with the step text.

### Area section and repo register
- **Rule:** a 3px top rule in the area color, then the chip and the heading.
- **Entry:** the repo name as a title link, a description, and one small line with the five page links (separated by " · ") at the left and the snapshot label with its commit id at the right (see Label (snapshot)).
- **Target:** the target entry gets a 14% tint of its area color and extends 1rem to each side.

### Navigation
- **Jump links:** one row between two hairlines, after the Start here field. A muted "Areas:" label, then one link per area: a chip and the area name in ink, Archivo 500 at width 87.5%, no underline. On hover a hairline underline shows.
- **Back links (text pages):** in the masthead; see Text-page masthead.
- **Back link (capture journey page, contributors page, and roadmap page):** one back link, "← All viewers", in the masthead. A moved page has no back link.
- **Track (capture journey page):** a link to each stage; see Track.
- **Text links:** water blue with a soft underline (see Colors). Focus: a 2px water-blue outline with a 2px offset on every focusable element.

### Capture journey masthead
The text-page masthead with three parts: the estate mark, the back link ("← All viewers"), and the chapter line ("Chapter N of the capture journey", class `chapter`).
- **Chapter line:** Archivo 600 .82rem/1.25, width 87.5%, muted. It is .5rem below the back link in the narrow band and 1.25rem below it in the legend rail. It is in the masthead, not above the title: the craft floor bans an eyebrow above a heading.

### Capture journey head
- **Title:** the h1 in the display text-page style.
- **Subtitle:** muted, 1.15rem, `text-wrap: balance`.
- **Start line (a later chapter):** the first paragraph of the intro, in the reading column, in body text: "This chapter starts at" a link to the stage of an earlier chapter where the chapter starts, then the sentence on the chapters ("Chapters 2 to 4 follow the same capture on different paths. Their numbers give only the reading order."). Chapter 1 has no start line.

### Track
One station for each stage, in one row, on a 1.5px ink line from the first station to the last. The track is an ordered list with the label "The stages".
- **Station:** a link to its stage. A 3.5rem square with a 1.5px ink border, a ground fill, and the ink icon of the stage (padding .7rem).
- **Icon:** a line drawing from `ICONS` in `capture-journey-page.mjs`: a view box of 0 0 48 48, a stroke width of 3, round caps and joins, no fill, and square corners: no `rect` has `rx`. An `ellipse` keeps its `rx` and `ry`, because they are its radii, not a corner (the top of the `record` cylinder). The 16 icons are `phone`, `upload`, `chain`, `record`, `verify`, `reward`, `pin`, `cluster`, `page`, `mint` (a stamp over its print), `transfer` (2 wallets with an arrow each way), `token` (a tag with a hole and 2 label lines, with no leaf), `account` (a card with a person and 3 lines), `export` (a sheet with rows and a column, and an arrow down), `numbers` (4 small tiles, each with a number line), and `cards` (a card with a title line and 3 bars). A stage names its icon in `capture-journey.json`.
- **Number:** the number of the stage on an ink square (1.25rem high, 1.25rem or more wide) at the top right of the station. Archivo 600 .75rem, width 75%, tabular, in the ground color. It keeps its color in print.
- **Label:** the short name of the stage, under the station, in the center. Archivo 500 .9rem/1.25, width 87.5%, ink.
- **Hover:** the station fills with ink, and the icon takes the ground color. The label gets a hairline underline.
- **Narrow `main` (34rem or less):** up to 4 stations in one row, with the line; more stations in rows of 3, 1.25rem apart, with no line. Below 20rem, 4 stations sit as 2 rows of 2. No station is alone in a row.

### Sticky bar
The bar shows the stage in view. A script updates it. Without JavaScript, the bar stays hidden. Screen readers do not read it (`aria-hidden`).
- **Box:** 2.5rem high, sticky at the top, across `main`: the ground with a hairline below. Its content aligns with the content column. On a wide screen it starts 1px right of the rail edge, so the rail-edge hairline stays in view.
- **Dots:** one .65rem square for each stage, .3rem apart, with a 1.5px ink border. A done stage has a muted fill and a muted border. The current stage has an ink fill (CanvasText in forced colors).
- **Text:** "N of M: <stage>" (M is the count of the stages of the chapter) in Archivo 600 .9rem/1.3, width 87.5%, tabular. It stays on one line. A long stage name ends in an ellipsis.
- **Print:** the bar does not print.

### State marks
A state shows by its mark, its label, and its state color together. `STATE_STYLE` in `site-html.mjs` holds the tag, the mark, and the flag. The capture journey pages and the roadmap page take them from `STATE_STYLE`.
- **Tag:** the mark and the label ("Best guess" or "Not working today") in the state color. Archivo 600 .82rem/1.7, width 87.5%, inline, on one line.
- **Mark:** a .9em square before the label: a square with a hatch for a best guess, a square with a cross for not working. It is an SVG mask that the state color paints (`currentColor`). In forced colors it is CanvasText. In print it keeps its color (`print-color-adjust: exact`).
- **Flag:** a block in a stage or in a fold of the roadmap page: the tag and the text. In a stage, a flag for not working also has the issue link or "No public issue yet." (muted). In a fold, a best-guess flag gives the reason: "Best guess for the area: <reason>." A 1px border in its state color, square, no fill, with a padding of .6rem .85rem. The issue link of a flag stays on one line.
- **Tag in a summary:** in the summary of a fold of the roadmap page, the best-guess tag follows the item count, .3rem apart.
- **Mark only:** in a row of the At a glance table, a section in its area by a best guess shows the mark with no visible label, after the section name and a no-break space. A hidden text "(best guess)" is for screen readers. The mark keeps its hatch, so the state does not show by its color alone.
- **Legend (capture journey page):** one paragraph for each state, in the intro: the tag and its meaning. Muted, .92rem, line height 1.5.

### Stage
- **Rule:** a 2px ink rule above the stage (as the text-page h2), with a padding of 1.5rem below it.
- **Layout:** the images and the text side by side (1 : 1.2). The text is in the wider column. A flipped stage (each second stage) mirrors the columns. A stage with no images is one column. In a narrow `main` (46rem or less), each stage is one column.
- **Stage label:** the small station icon (a 1.75rem square, 1.5px ink border, ink icon) over "Stage N of M". Archivo 600 .82rem/1.2, width 87.5%, tabular, muted. The number part is its own span, so the label breaks after "Stage". It is a section number: the craft floor allows a number that carries the order. The label is in a margin column at the left of the heading, level with its first line, never above the heading. The DOM order stays: the label comes before the heading.
- **Hang:** the text of a stage is a grid of 2 columns (the label column and the text column, .9rem apart). The heading and all text under it hang in the text column, so they share one left edge, as the Start here steps do.
- **Small phone (`main` below 30rem):** the label column is compact: the icon is 1.5rem, the label is .74rem, and the gap is .7rem. The heading stays beside the label. The text under the heading takes the full width.
- **Heading:** the h2 in the text-page headline style (660, 1.5rem).
- **Note:** an optional body paragraph after the flags. It can end with one link: "See", the link, and a full stop. `seeChapter` (the id of another chapter) links that chapter with the text "chapter N: <subtitle>". `seeLink` (a text and an https address) links a public page, for a claim that no file of a repo holds. A note has one link at most, and a link needs a note. `seeText` in `capture-journey-page.mjs` writes the sentence for the page and for the text copy.
- **Images:** the images lie on a plate in the surface color, with a padding of 1.25rem and a gap of 1rem, in the center. The plate has no neatline (see the One Frame Rule). Where `main` is below 30rem, the plate reaches the screen edges, with a side padding of .5rem. A phone screenshot is 150px wide, with a 1px inset outline in the ink edge color. A drawing is at most 26rem wide, with a hairline border. A caption is muted, .85rem/1.4, under its image, in the center. Of the 15 SVG drawings in `docs/capture-journey/`, 13 are drawings in the site look: `bundle-chain.svg` (chapter 1, stage 3), `reward.svg` (chapter 1, stage 6), in chapter 2 `map-pins.svg` (stage 1), `map-clusters.svg` (stage 2), and `tree-page.svg` (stage 4), and in chapter 3 `no-token.svg` (stage 1), `token-mint.svg` (stage 2), `token-transfer.svg` (stage 3), and `token-page.svg` (stage 4), and in chapter 4 `org-account.svg` (stage 1), `org-export.svg` (stage 2), `org-numbers.svg` (stage 3), and `org-cards.svg` (stage 4). A drawing in the site look holds the site color block and the drawing font block (see the Drawing Colors Rule and the Drawing Font Rule). It is 400 units wide. Its background is the surface. A step is a square box in the ground color with a 1.5 muted border. A step number is a 30-unit ink square with a ground numeral, as the station number of the track. A step has no color of its own: its words say who does it. A muted line with an arrow head joins two steps. A dashed box marks a step outside the Greenstand system (step 4 of the reward) and the older path (the bundle chain). The map drawings of chapter 2 show a made-up map on a ground card with a 1.5 muted border and field edges in the line color: a pin is a muted drop shape with a ground hole, a new pin is ink, and a cluster is a ground circle with a 2-unit ink ring and an ink count (a dashed ring for a count that changes). A tag is a ground box, 36 units high, with a 1.5 ink border and an ink title, inside a card. A muted 1.5 line leads from a pin or a cluster to its tag or its page. The tree page is a ground card beside a narrow map card. Its photo is a surface plate with a tree: a ground crown with a 2-unit muted edge, a muted trunk, and a muted ground line. The first badge of the tree page (the state of the capture) is a tag. A second badge is a ground box with a 1.5 muted border and a muted line. A screen of a Greenstand app that real data keeps off the page (a real screen shows a real grower) is drawn in the site look with made-up data: `tree-page.svg`, `no-token.svg`, `token-page.svg`, `org-export.svg`, `org-numbers.svg`, and `org-cards.svg`. The made-up data is a number such as "#1234", "#a1b2", or "1,240", a wallet or organization name that starts with "Example" ("Example Org"), and a date in the drawing date form. A drawn screen is a ground card. A muted line can name the screen ("Admin panel: the capture detail"). A state of the screen is a tag, and a second state is a badge. A person is a plain surface block with only the role word ("Grower"): no name and no face. The chapter 3 drawings: `no-token.svg` is 2 drawn screens, one over the other. `token-mint.svg` is 3 steps, then the named wallet (an ink box that holds 3 token tags) beside the grower (a box with a 1.5 muted border and no token). `token-transfer.svg` is 3 rows of wallet cards: a token tag on the arrow (at once), a dashed line to an "Accept" tag (no trust), and a claimed token beside an ink lock (it stays). `token-page.svg` is a drawn token page: a photo plate, ink value lines, a tag and a badge, muted 1.5 rules, and a timeline of the transfers (a muted 1.5 line with ground rings, a 2-unit ink edge, radius 6). The chapter 4 drawings: `org-account.svg` is 2 steps, then the data of the organization of the account (an ink box) beside the other organizations (a box with a 1.5 muted border). `org-export.svg` is a drawn Captures page with the button "Export Captures" (an ink box, 36 units high), then the dialog of the columns: each row has an 18-unit box with a 1.5 muted border and an ink check mark. `org-numbers.svg` is the 4 tiles of the Home page, one under the other, in the order of the screen. The tile that the capture moves to is an ink box, and a muted line with an arrow head joins the two tiles. `org-cards.svg` is 4 number cards (a muted label over an ink value) and a list of the top growers. Each grower is a plain surface block with only the role word "Grower", and an ink count follows it. A real card shows real grower names, so the drawing shows no name. An ink box (class `inkbox`) is a ground box with a 1.5 ink border. It marks the part of a drawing that the reader looks at: a button, a destination, or the data that a person sees. It is not a state: a state of a screen is a tag, 36 units high. An ink mark (class `inkline`: a 2-unit ink line with round caps) draws a small sign: the lock of `token-transfer.svg` and the check marks of `org-export.svg`. The page shows a drawing 350px wide at a 1280px screen, 416px wide at 1024px, and 304px wide at 320px. The text copy on GitHub shows it 360px wide. The 2 older app-screen drawings, `web-map-badges.svg` and `verify-page.svg`, keep their own colors. They are not a rule source: a new drawing of an app screen is in the site look. They are 360 units wide. `web-map-badges.svg` is a vertical pair: a card, an arrow down, and a card. `verify-page.svg` has a photo grid of 2 columns and 3 rows beside the side panel.
- **For developers:** a square `details` box with a hairline border and a padding of .25rem .9rem. The summary is Archivo 600 .92rem/1.6, width 87.5%, with a muted marker. A code in the box is an inline block that is never wider than the box: it stays on one line when it fits, and a longer code (a long file name) breaks inside its own box. A code in a link keeps the line of the link. Under each repo, the box lists the cited files, then the open public issues of the stage (`issues` in `capture-journey.json`): "issue #N" as a link, then what the issue says. An issue backs a sentence of the story. `--evidence` checks that each issue is open. A file link opens the cited lines at the cited commit on GitHub. For a file that GitHub renders (for example `.md`), the link adds `?plain=1` before the line anchor: GitHub then shows the code view and marks the lines (`linesLink` in `estate.mjs`).

### Capture journey footer
The footer is `footer.page-end`: a hairline above it and muted text (`PAGE_END_STYLE` in `site-html.mjs`, shared with the roadmap page). The hairline has a margin of 3rem above it and a padding of 1.25rem below it. The footer holds the chapters, the image credits, and the link to the text copy.
- **Chapters:** a navigation landmark with the heading "Chapters" (Archivo 660 1.15rem, ink). On chapter 1 the sentence on the chapters follows it. Then one row for each chapter, between 1px hairlines, in the reading column: "Chapter N" in a 5rem margin column (Archivo 600 .82rem/1.4, width 87.5%, tabular, muted), then the subtitle of the chapter. The subtitle of each other chapter is a link to its page. The row of this page has no link: the subtitle is ink and "(this page)" follows it. Last, the later text, if the data has one: a muted line on the chapters that are not written yet. The field is optional, and no chapter has it now, so no footer shows this line.

### Moved page
The masthead holds only the estate mark: a moved page has no back link, because it adds no new link. One paragraph follows in the reading column: the former name, the new name, and the link. The inline code is the code chip (`CODE_CHIP`). A link and a code stay on one line. The estate mark shows the locator on the cell of the repo under its new name.

### Group section (roadmap page)
One section for each area, then "Across the estate" and "Outside the documented estate".
- **Area:** a 3px top rule in the area color, then the chip and the h2 (the text-page headline, with no rule of its own), then a muted "Repos:" line with a link to each repo, then the folds. An area with no section of the source shows "The roadmap has no section for this area."
- **Group that is not an area:** a 2px ink rule and no chip, because a chip names an area. A muted note says what the group holds.
- **At a glance table:** one row for each group: the chip and the name as a link to the group section, the names of the sections (a best guess with the mark only), and the item count at the right. The first column is "Area or group". A group that is not an area has an empty place of the chip, so the names align.
- **Footer:** a hairline above, muted text, and the link to the text copy. It is the footer of the capture journey page: both pages take its rule from `PAGE_END_STYLE` in `site-html.mjs`.

### Fold (roadmap page)
Each section of the source is a fold: a `details` box, closed at first, with no fill and no side border.
- **Rules:** a hairline above each fold, and a hairline below the last fold of a group section.
- **Summary:** the heading of the section in the fold title style, then "· N items" in the count label style, then the best-guess tag for a section in its area by a best guess. The last word of the heading, the count, and the tag stay on one line (see the Whole Name Rule). Padding .6rem 0 .6rem 1.1rem.
- **Marker:** a custom marker, not the marker of the browser: a .75rem triangle (an SVG mask) at the left of the first line, painted muted. It is ink on hover. It points right when the fold is closed and down when the fold is open, with no motion. In forced colors it is CanvasText. The summary text hangs beside the marker, so a heading that wraps keeps one left edge.
- **Body:** the best-guess flag, "The source lists no items here." for a section with no items, and the items of the source, word for word. The body is 1.1rem in, with 1.1rem below its last part. A loose list of the source takes the spacing of a tight list.
- **Keyboard and print:** a fold opens with the keyboard, as each `details` box does. In print, every fold is open.

## Do's and Don'ts

### Do:
- **Do** take every color from `BACKGROUNDS`, `TEXTS`, `STATES`, `LINES`, and `AREA_COLORS` in `site-colors.mjs`, as a [light, dark] pair, through the CSS custom properties of `siteStyle`.
- **Do** define every custom property that a page uses. `build-landing.mjs`, `render-md.mjs`, `build-capture-journey.mjs`, `build-moved.mjs`, `build-contributors.mjs`, and `build-roadmap.mjs --site` fail when a page uses a custom property that nothing defines (`undefinedProperties` in `site-html.mjs`; the check skips scripts).
- **Do** let a page build fail when a file that the page loads is missing. `build-landing.mjs`, `render-md.mjs`, `build-capture-journey.mjs --site`, `build-moved.mjs`, and `build-roadmap.mjs --site` check the files of the site look (`SITE_LOOK_FILES`: the font and the parcel field) and show every missing file at once. `render-md.mjs` also checks Mermaid for a page with a diagram. The contributors page is built in a job with no site (`build-contributors.mjs --out`), so `build-landing.mjs` checks its files: it fails when the page, the font, or the parcel field is missing from the site.
- **Do** write the estate mark with `estateMark`, `areaGroup`, and `areaStyle` from `site-html.mjs`. On each page but the landing page, write the masthead with `masthead` and its style with `mastheadStyle`, which gives the estate mark its size. On a one-repo page, give the repo name as `current`, so the estate mark shows the locator. The landing page gives the estate mark its size in its own style.
- **Do** take the diagram colors from `site-colors.mjs` through the Mermaid `themeVariables`, and change the tint of a repo node only in `DIAGRAM_NODE_TINT`.
- **Do** give an element its area color with `--area: var(--c-<color>)`, from the `"color"` of its area in `estate.json`.
- **Do** put the ink edge (1px inset, 25% ink) on every area fill.
- **Do** keep text at 4.5:1 or more on the ground, on the surface, and on the parcel field in both schemes, and let `check-site-colors.mjs` prove it. Text may sit on the parcel field.
- **Do** change the strength of the parcel field only in `PARCEL_FIELD_INK_SHARE`, and keep the field at 1.25:1 or less with the ground.
- **Do** hide the parcel field and the rail-edge hairline in forced colors, with `prefers-contrast: more`, and in print.
- **Do** set headings, labels, and numerals in Archivo, and body text in the system sans.
- **Do** keep a strip cell at 24px or more wherever it is a link.
- **Do** give each plate in the surface color the neatline from `PLATE_EDGE`, and each inline code the chip from `CODE_CHIP`.
- **Do** take the state marks from `STATE_STYLE`, the rules of running text from `TEXT_STYLE`, the area chip from `CHIP_STYLE`, and the page footer from `PAGE_END_STYLE` in `site-html.mjs`. Do not copy them into a page script.
- **Do** keep a date, a repo name, a quoted group in parentheses, and the last word of a fold heading with its count on one line (see the Whole Name Rule).
- **Do** keep the parts of a page of running text in the reading column (`READING_COLUMN`), so the page has one right edge. A diagram plate can be wider (see Text pages). Only the capture journey page uses the content column (`CONTENT_COLUMN`).
- **Do** put a section label (for example the stage label) in a margin column beside its heading, level with the first line of the heading.
- **Do** turn off motion under `prefers-reduced-motion: reduce`.
- **Do** put each new drawing of the capture journey in the site look: the site color block, the drawing font block, and the 5 neutral colors only. A screen that real data keeps off the page (a real screen shows a real grower) is drawn in the site look with made-up data. Only the 2 older app-screen drawings (`web-map-badges.svg`, `verify-page.svg`) keep their own colors. Run `build-capture-journey.mjs` for the colors and `subset-drawing-font.py` for the font.
- **Do** write a date in a drawing as "2 March 2026", never in numbers only.
- **Do** use the curly apostrophe (’) in the prose of a capture journey page and of a drawing.

### Don't:
- **Don't** color text with an area color.
- **Don't** show a state by its state color alone.
- **Don't** use water blue for anything but links and the focus ring.
- **Don't** put an area color, a state color, or water blue in a drawing in the site look.
- **Don't** use a drop shadow, a gradient, a rounded corner, or leaf art. The one exception is the scroll shadows of a wide diagram (see the Flat Map Rule). This also applies to the station icons: no `rx` on a `rect`, and no leaf.
- **Don't** put real data in a drawing of an app screen: no real grower, no real name, and no real face.
- **Don't** use the default look of Mermaid; it draws node shadows. Use the "classic" look.
- **Don't** put a label above a heading.
- **Don't** give a chip to a group that is not an area. A chip names an area.
- **Don't** put a neatline on a plate that holds framed images (see the One Frame Rule).
- **Don't** add a Greenstand logo or Greenstand brand colors. The site has no binding Greenstand brand, and it shows no Greenstand logo until Greenstand approves one (PRODUCT.md).
- **Don't** load a font or another asset from a third-party host; vendor it and pin its hash.
- **Don't** put the parcel field under the content column. It belongs to the legend rail and the masthead only.
- **Don't** animate the parcel field.
- **Don't** add fills or a hatch to the parcel field. A hatch is the mark of a best guess.
- **Don't** show a real place or a capture in the parcel field, and do not call the field a map, a wallpaper, or a background illustration. It is decoration, not data.

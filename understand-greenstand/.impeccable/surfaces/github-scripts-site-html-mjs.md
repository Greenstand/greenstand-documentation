---
version: 1
slug: "github-scripts-site-html-mjs"
primary_target: ".github/scripts/site-html.mjs"
related_targets: [".github/scripts/build-landing.mjs",".github/scripts/render-md.mjs",".github/scripts/capture-journey-page.mjs",".github/scripts/build-moved.mjs",".github/scripts/contributors-page.mjs"]
---

# Surface brief: the built pages of the Pages site

Scope: the landing page, the markdown pages (`render-md.mjs`), the capture journey page, the
contributors page (`contributors-page.mjs`, since 2026-11-03), and the moved pages. Not the knowledge-graph viewer (third-party; keeps its theme). Mode: Read.

Audience and job: new volunteer developers find the right repo, its viewer, and its onboarding
guide, and understand how the repos work together. Second: maintainers. The words, links, data,
and reading order stay; the look and the layout may change (decided 2026-11-02). The fail
case: too gray and flat.

Memorable moment: the estate strip at the top of the landing page, one cell per repo in its area
color; each cell links to its repo entry and shows the repo name on hover or keyboard focus. No
due mark (the pages have no drift data; decided 2026-11-02).

Decided 2026-11-02, after a look at prototypes of the layouts: the layout is the **legend
rail**; the area colors are the **tuned set** (same classes; readable with red-green color
blindness); the heading font is **Archivo** (Latin letters, OFL, self-hosted); the diagrams
show **area nodes on a surface plate**; the capture journey page takes the **Land-cover palette**
(ink track, ochre best guess, rose not working; its green accent goes). Area-to-class map: Core
API evergreen, Wallet cropland, Admin shrub, Web map wetland, Mobile deciduous, Data ingest mixed
forest, Infrastructure bare ground, Start here ink. The direction and the layout were confirmed by
eye on rendered prototypes of the landing page and the ecosystem maps page.

Built 2026-11-02 (the shared look and the landing page): the colors live once in
`site-colors.mjs` (`check-site-colors.mjs` checks them in CI); each area names its area color in
`estate.json` (`"color"`). Archivo comes from the npm package `@fontsource-variable/archivo` 5.3.0
(`archivo-latin-wdth-normal.woff2`, 90 KB, weight and width axes), pinned by its hash in the deploy
workflow. On a phone the estate strip is a picture (the estate mark): a strip cell there is below
the 24 px target size of WCAG 2.2 (decided 2026-11-02). The cells are links from the strip width
where each cell can be 24 px wide; the script computes that width from the repo counts.

Decided 2026-11-02 (ticket 08): the background is the **parcel field**. It shows the boundaries
of field parcels in ink, at a contrast of 1.25:1 with the ground. It is a still layer under the
legend rail on wide screens and under the title band (the masthead) on phones. The reading column
stays plain. The field does not show in forced colors, with more contrast, or in print.

Built 2026-11-02 (ticket 09): `build-parcel-field.mjs` draws the field from its seed into
`art/parcel-field.svg` of the site. The file is a mask, the same on each run. `siteStyle` paints
it with the ink color at `--parcel-ink-share` (`PARCEL_FIELD_INK_SHARE` in `site-colors.mjs`:
11.5% light, 9.1% dark). The prototype had 9.2% in dark, which gives 1.2515:1 with the ground.
`siteStyle` also holds the rail width `--rail`, and `site-html.mjs` holds the rail media queries
`WIDE` and `NARROW`. In CI, `check-site-colors.mjs` keeps the field at 1.25:1 or less with the
ground and each text color at 4.5:1 or more on the field.

Built 2026-11-02 (ticket 05): `render-md.mjs` writes the text pages in the site look, with
`siteHead`, `siteStyle`, and the parcel field. The masthead holds the estate mark (now shared:
`estateMark`, `areaGroup`, and `areaStyle` in `site-html.mjs`) over the back links. On a narrow
screen it is a band at the top; on a wide screen it is the sticky legend rail. Each child of
`main` is at most 44rem wide. A diagram lies on a surface plate. A repo node has a fill of its
area color at `DIAGRAM_NODE_TINT` (30%) on the ground and a 1.5px border in the area color.
`check-site-colors.mjs` keeps the ink labels at 4.5:1 or more on each node tint, light and dark.
The scroll shadows of a wide diagram are the one exception to the no-gradient rule. `siteStyle`
sets `text-wrap: pretty` on running text for all pages. `render-md.mjs` fails when the font, the
parcel field, or Mermaid is missing, or when a page uses an undefined custom property. The
capture journey page and the moved pages still show the former look.

Built 2026-11-02 (ticket 06): the capture journey page and the moved pages are in the site look,
so every page that the site scripts make is in it, and the former look (`BASE_STYLE`) is gone.
`site-html.mjs` shares the masthead (`masthead`, `mastheadStyle`), the reading column
(`READING_COLUMN`), and the list of the files that each page loads (`SITE_LOOK_FILES`). The
capture journey page: the chapter line moved into the masthead (it was an eyebrow above the
title); an ink track with square stations; the state marks (a hatch for a best guess, a cross for
not working) in the state colors, also in forced colors and in print; the images on the surface
plate; the stage layout follows the width of `main` (container queries). The moved pages: the
estate mark in the masthead, the text in the reading column, no font preload. The body text is
1.03125rem, so it follows the default font size of the reader. In this build, the four drawings
of the capture journey kept their own former colors (the images did not change). Ticket 10 put 2
of them in the site look.

Built 2026-11-03 (ticket 10): 2 of the 4 drawings of the capture journey are drawings in the site
look: `bundle-chain.svg` (stage 3) and `reward.svg` (stage 6). Each holds the site color block:
the 5 neutral colors (ground, surface, ink, muted, line), light and dark.
`build-capture-journey.mjs` writes the block from `site-colors.mjs` (`site-drawings.mjs`), and
`--check` fails in CI on a stale block. Each mode fails on another color and on a character with
no glyph in the drawing font. Each drawing also holds the drawing font: a subset of Archivo
("Archivo Drawing", weights 600 and 400 at a width of 87.5%) that `subset-drawing-font.py` writes,
because an SVG in an `<img>` cannot load the font of the page. The steps are square ground boxes
with a muted border; the step numbers are ink squares, as the station numbers of the track; a
dashed box marks a step outside the Greenstand system or the older path. The former green, blue,
and amber number circles of `reward.svg` are gone. Each drawing is 400 units wide (it was 480).
`web-map-badges.svg` and `verify-page.svg` keep their own colors, because they show screens of
Greenstand apps.

Built 2026-11-03 (ticket 07, the finish): the impeccable-finish-reviewer gave "ship" after 3
verdict passes. The stage label of the capture journey is in a margin column beside its heading
(the heading and its text hang in column 2 where main is 30rem or wider); the contributors page has
one right edge (the reading column); the inline code chip is CODE_CHIP (side padding .15em); the
image plate of the capture journey reaches the screen edges on a small phone; the 2 app-screen
drawings are 360 units wide (the smallest text 11.8 px at 320); the Mermaid node padding is 10, so
every map shows at its size at 1280 px. On the user's word, the 3 ceiling points of the review are
built too: the locator (an ink outline on the repo cell of the estate mark on a one-repo page), the
snapshot line as a display-face label, and PLATE_EDGE (a 1px neatline on each plate but the image
plates, whose images have their own frames). Firefox and WebKit draw the drawing font (checked).

## Direction contract

THESIS: The site reads as a land-cover classification map of the code estate: areas are classes,
the snapshot is the scene date, drift is change detection. It refuses the GitHub-clone docs look
and the stock eco template.

OWN-WORLD: Mineral ground (#f3f5f0 light, #131915 dark), evergreen-black ink, water blue for links
only. Seven muted class fills mark areas only, never text, with an ink outline. Light: evergreen
#35614e, cropland #92600d, shrub #bba25b, wetland #6f9db3, deciduous #6c8951, mixed forest
#b1bd97, bare ground #7c796e. Dark: evergreen #33634d, cropland #916618, shrub #b49e56, wetland
#7fb0c6, deciduous #49854f, mixed forest #b1b38e, bare ground #858377. Weakest pair 11.0 (light)
and 10.3 (dark), CIEDE2000, with simulated protanopia and deuteranopia. States carry a mark and a color: best
guess = ochre hatch, not working or gone = rose cross. One sans family; monospace only for commit
ids and code; Archivo for headings and labels, the system sans for body text (decided 2026-11-02).
Hairline rules; ink rules for page headings; legend chips; diagram nodes of a repo filled with
a 30% tint of its area class and a full-strength border, each diagram on a surface plate; no
shadows, gradients, or leaf art.

STORY: The newcomer sees the whole estate in one strip, learns the area key, follows the numbered
start path, then finds a repo and trusts each fact by its proof link and snapshot.

FIRST VIEWPORT: Wide screens (64rem and more): the legend rail at the left, sticky: the title, then
the estate strip turned upright (one row per repo: its area color block and its name; the area
name over each group; each row a link to the repo entry; the row of the address target gets an
ink outline). Beside it: the lede and the volunteer line in a 42rem column, then Start here on a
surface field with its 4 entries as numbered steps in a margin number column; one column of
repos below. Phones: the title, then the strip across the page as a picture (no links); from the
width where each cell can be 24 px wide, the cells are links (names on hover or focus). Text
pages: the rail holds the back link and the estate mark (the strip in small, no link, no words);
the reading column is 44rem; diagrams use the full width beside the rail. No new words: no
scene line, no hint sentence.

FORM: Land-cover map, candidate 7 of 7 on the ordered list (1 survey map sheet, 2 herbarium
voucher, 3 park wayfinding system, 4 soil color book, 5 field guide, 6 forestry field book,
7 land-cover map). Raises: state is a mark, not a hue (film cutting bench); one color, one job
(Bauhaus workshop); a strict margin number column (origami crane); a numbered newcomer path
(zine); a dense repo register on wide screens (penny-press broadside; the legend rail layout
keeps it to one column); one display
family, Archivo in 2 widths (alphabet storm; body stays the system sans).
seed:ede0d5f0e9fda336. Layout (surface round): legend rail, structure 3 of 6, the dealt
lead; seed:b014ef57c29a8d2d.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

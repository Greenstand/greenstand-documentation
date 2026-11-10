// The shared parts of the generated HTML pages of the Pages site, all in the site look (DESIGN.md):
// the landing page (build-landing.mjs), the text pages (render-md.mjs), the moved pages
// (build-moved.mjs), the page of the capture journey (capture-journey-page.mjs), the contributors
// page (contributors-page.mjs), and the roadmap page (roadmap-page.mjs).
import { AREA_COLORS, BACKGROUNDS, LINES, PARCEL_FIELD_INK_SHARE, TEXTS } from "./site-colors.mjs";

// Escape text for HTML text and for a double-quoted attribute.
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The font of the headings and the labels: Archivo (SIL Open Font License 1.1), a variable font
// with a weight axis and a width axis, Latin letters. The text stays in the system font. The
// deploy workflow copies the font file and its license from the npm package
// @fontsource-variable/archivo (pinned by its hash) to this path of the site.
export const ARCHIVO = "vendor/archivo/archivo-latin-wdth-normal.woff2";

// The parcel field, the still drawing in the legend rail (DESIGN.md): an SVG mask at this path of
// the site. The deploy workflow writes it with build-parcel-field.mjs.
export const PARCEL_FIELD = "art/parcel-field.svg";

// The files of the site that each page in the site look loads: the font and the parcel field. The
// deploy puts them on the site before the page scripts run. A page script fails when one of them
// is missing.
export const SITE_LOOK_FILES = [ARCHIVO, PARCEL_FIELD];

// The width of the reading column (DESIGN.md): the column of running text on a text page, on a
// moved page, on the capture journey page, and on the contributors page.
export const READING_COLUMN = "44rem";

// The width of the content column of the capture journey page: wider than the reading column, for
// the stages (the images beside the text).
export const CONTENT_COLUMN = "58rem";

// The edge of a plate (a block in the surface color: a diagram, a code block, a quote, the Start
// here field, the welcome plate): a hairline in the line color, as the neatline of a map frame, so
// the plate shows against the ground (site-look ticket 07). No shadow. The image plates of the
// capture journey have no edge: each image on them has its own frame.
export const PLATE_EDGE = "1px solid var(--line)";

// The chip of inline code on the pages of running text (the text pages, the capture journey page,
// the contributors page, the moved pages): the surface fill and a thin side padding, so a code in
// parentheses reads as tight punctuation, "(x)", not "( x )". Code in a pre block has no chip. The
// landing page shows its commit ids with no chip.
export const CODE_CHIP = `  code { padding: .1em .15em; background: var(--surface); }
  pre code { padding: 0; background: none; }`;

// The state marks (DESIGN.md, State marks), on the capture journey page and the roadmap page: a tag
// is the mark and the label in the state color; a flag is a block with a 1px border in its state
// color. The mark is a square with a hatch for a best guess (class "guess") and a square with a
// cross for a part that does not work (class "broken"): a mask that the state color paints, so a
// state never shows by its color alone. In forced colors the mark is CanvasText; in print it keeps
// its color. A tag is inline, so find-in-page matches a phrase across the tag and the text after
// it.
const stateMark = (lines) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="#000" stroke-width="1.2"><rect x=".6" y=".6" width="10.8" height="10.8"/><path d="${lines}"/></svg>`)}")`;
const HATCH = stateMark("M.6 6.6l6-6M.6 11.4L11.4.6M5.4 11.4l6-6");
const CROSS = stateMark("M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6");
export const STATE_STYLE = `  .tag { display: inline; font: 600 .82rem/1.7 var(--display); font-stretch: 87.5%; white-space: nowrap; }
  .tag::before { content: ""; display: inline-block; width: .9em; height: .9em; margin-right: .4em; vertical-align: -.1em;
    background-color: currentColor; -webkit-mask: var(--state-mark) center / 100% 100% no-repeat;
    mask: var(--state-mark) center / 100% 100% no-repeat; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tag.guess, .flag.guess .tag { --state-mark: ${HATCH}; color: var(--best-guess); }
  .tag.broken, .flag.broken .tag { --state-mark: ${CROSS}; color: var(--not-working); }
  @media (forced-colors: active) {
    .tag::before { forced-color-adjust: none; background-color: CanvasText; } }
  .flag { margin: 1rem 0; padding: .6rem .85rem; border: 1px solid; }
  .flag.guess { border-color: var(--best-guess); }
  .flag.broken { border-color: var(--not-working); }`;

// The chip of an area (DESIGN.md, Chips), on the landing page and the roadmap page: a .8em square in
// the area color (--area) with the ink edge, before an area name. It has no words. In print it keeps
// its color.
export const CHIP_STYLE = `  .chip { display: inline-block; width: .8em; height: .8em; margin-right: .45em; vertical-align: -.02em;
    background: var(--area); box-shadow: inset 0 0 0 1px var(--edge); -webkit-print-color-adjust: exact; print-color-adjust: exact; }`;

// The footer of a page (class "page-end"), on the capture journey page and the roadmap page: a
// hairline above it, with a margin of 3rem above and a padding of 1.25rem below, and muted text.
export const PAGE_END_STYLE = `  .page-end { margin-top: 3rem; padding-top: 1.25rem; border-top: 1px solid var(--line); color: var(--muted); }`;

// The media queries of the legend rail: a wide screen (64rem and more) shows the legend rail; a
// narrow screen shows the masthead as a band at the top. "not all and" makes the narrow
// query the exact opposite of the wide one, so no width falls between them.
export const WIDE = "(min-width: 64rem)";
export const NARROW = `not all and ${WIDE}`;

// The rules of running text on a text page (render-md.mjs) and on the roadmap page
// (roadmap-page.mjs), after siteStyle and mastheadStyle(READING_COLUMN): the reading column, the
// headings, the lists, code, the table, quotes, rules, and images. On a narrow screen main has a
// padding of 1.5rem 1.25rem, and the reading column is in the center. On a wide screen main is
// 64rem at most, beside the legend rail, and the reading column starts at the left.
export const TEXT_STYLE = `  main { padding: 1.5rem 1.25rem 5rem; }
  h1 { margin-block: 1.5rem 1.1rem; font-size: clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem); font-weight: 720;
    letter-spacing: -.02em; }
  h2 { margin-block: 2.9rem .8rem; padding-top: .75rem; border-top: 2px solid var(--ink); font-size: 1.5rem;
    font-weight: 660; }
  h3 { margin-block: 2rem .5rem; font-size: 1.16rem; font-weight: 640; }
  h4 { margin-block: 1.5rem .4rem; font: 640 1rem/1.3 var(--display); text-wrap: balance; }
  h1, h2, h3, h4 { scroll-margin-top: 1.5rem; }
  p, ul, ol, dl, table, pre, blockquote { margin-block: 0 1rem; }
  li { margin-block: .3rem; }
  li > :is(ul, ol) { margin-block: .3rem 0; }
  li::marker { color: var(--muted); }
${CODE_CHIP}
  pre { padding: 1rem; overflow: auto; border: ${PLATE_EDGE}; background: var(--surface); }
  table { display: block; width: 100%; overflow: auto; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  th { font: 600 .92rem/1.3 var(--display); font-stretch: 87.5%; text-align: left; background: var(--surface); }
  th, td { padding: .55rem .8rem; border-bottom: 1px solid var(--line); vertical-align: top; }
  blockquote { margin-inline: 0; padding: .75rem 1rem; color: var(--muted); border: ${PLATE_EDGE}; background: var(--surface); }
  blockquote > :last-child { margin-bottom: 0; }
  hr { height: 0; margin-block: 2rem; border: 0; border-top: 1px solid var(--line); }
  img { max-width: 100%; }
  main > * { box-sizing: border-box; max-width: ${READING_COLUMN}; margin-inline: auto; }
  @media ${WIDE} {
    main { max-width: 64rem; padding: 1.25rem clamp(1.5rem, 4vw, 4.5rem) 5rem; }
    main > * { margin-inline: 0; }
  }`;

const SANS = `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`;
// The font of the headings and the labels: the name of the face of ARCHIVO, and the font stack with
// the system sans as the fallback.
export const DISPLAY_FACE = "Archivo";
export const DISPLAY = `"${DISPLAY_FACE}", ${SANS}`;
const MONO = `ui-monospace, "SF Mono", Menlo, Consolas, monospace`;

// The colors as CSS custom properties, for the scheme i (0 light, 1 dark), one line for each
// kind: --ground and --surface; the text colors (--ink, ...); --line; the area colors
// (--c-evergreen, ...).
const colorLines = (i) =>
  [
    Object.entries(BACKGROUNDS),
    Object.entries(TEXTS),
    Object.entries(LINES),
    Object.entries(AREA_COLORS).map(([name, pair]) => [`c-${name}`, pair]),
  ].map((kind) => `    ${kind.map(([name, pair]) => `--${name}: ${pair[i]};`).join(" ")}`).join("\n");

// The head lines of a page in the site look: the color of the browser bar, and an early request
// for the font. toRoot is the path from the page to the root of the site ("." or ".."). A page that
// shows no text in the font (a moved page) sets preloadFont to false: the browser warns about a
// preload that the page does not use.
export const siteHead = (toRoot, { preloadFont = true } = {}) => [
  `<meta name="theme-color" content="${BACKGROUNDS.ground[0]}" media="(prefers-color-scheme: light)">`,
  `<meta name="theme-color" content="${BACKGROUNDS.ground[1]}" media="(prefers-color-scheme: dark)">`,
  ...(preloadFont ? [`<link rel="preload" href="${toRoot}/${ARCHIVO}" as="font" type="font/woff2" crossorigin>`] : []),
].join("\n");

// The style of the site look: the font, the colors in light and dark mode, the page, the
// selection, the links, the headings, code, and the parcel field. --edge is the ink outline of an
// area color. --rail is the width of the legend rail.
// Each page in the site look has a legend rail, in its masthead (class "masthead"; on the landing
// page it holds the title, on a text page the estate mark and the back links). On a wide screen the
// masthead is the first column of the body, var(--rail) wide, and the parcel field lies under it,
// with a hairline at the edge of the rail. On a narrow screen the masthead is the band at the top
// of the page, and the parcel field lies under it. The reading column stays plain. The field is a
// still layer behind the page, out of the way of the pointer: the ink color at --parcel-ink-share
// paints the mask. check-site-colors.mjs checks the same mix of the ink and the ground. The field
// and the hairline do not show in forced colors, with more contrast, or in print. The layer of the
// rail is as high as the large viewport (100lvh): it does not change its size, and the field does
// not zoom, when a phone browser shows or hides its toolbar. The ground is on html, and body has no
// background, because the layer of the rail lies between them. toRoot is the path from the page to
// the root of the site. Each page adds its own rules after it.
const fieldMask = (toRoot) => `url("${toRoot}/${PARCEL_FIELD}") center / cover no-repeat`;
const fieldPaint = (toRoot) => `background-color: color-mix(in srgb, var(--ink) var(--parcel-ink-share), transparent);
      -webkit-mask: ${fieldMask(toRoot)}; mask: ${fieldMask(toRoot)};`;
export const siteStyle = (toRoot) => `  @font-face { font-family: "${DISPLAY_FACE}"; src: url("${toRoot}/${ARCHIVO}") format("woff2");
    font-weight: 100 900; font-stretch: 62% 125%; font-display: swap; }
  :root { color-scheme: light dark;
${colorLines(0)}
    --display: ${DISPLAY};
    --edge: color-mix(in srgb, var(--ink) 25%, transparent);
    --rail: 17.5rem; --parcel-ink-share: ${PARCEL_FIELD_INK_SHARE[0]}%; }
  @media (prefers-color-scheme: dark) { :root {
${colorLines(1)}
    --parcel-ink-share: ${PARCEL_FIELD_INK_SHARE[1]}%; } }
  html { background: var(--ground); scrollbar-color: var(--line) var(--ground); }
  body { margin: 0; color: var(--ink); background: transparent; font: 1.03125rem/1.62 ${SANS};
    overflow-wrap: break-word; }
  @media ${WIDE} {
    body::before { content: ""; position: fixed; top: 0; left: 0; width: var(--rail); height: 100vh; height: 100lvh;
      z-index: -1; pointer-events: none;
      ${fieldPaint(toRoot)} }
    body::after { content: ""; position: fixed; top: 0; bottom: 0; left: var(--rail); width: 1px; z-index: -1;
      pointer-events: none; background: var(--line); } }
  @media ${NARROW} {
    .masthead { position: relative; isolation: isolate; }
    .masthead::before { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
      ${fieldPaint(toRoot)} } }
  @media (forced-colors: active), (prefers-contrast: more), print {
    body::before, body::after, .masthead::before { display: none; } }
  ::selection { color: var(--ink); background: color-mix(in srgb, var(--ink) 18%, transparent); }
  a { color: var(--link); text-decoration: underline; text-decoration-thickness: 1px;
    text-decoration-color: color-mix(in srgb, var(--link) 35%, transparent); text-underline-offset: .2em; }
  a:hover { text-decoration-color: currentColor; }
  :focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }
  h1, h2, h3 { font-family: var(--display); line-height: 1.15; text-wrap: balance; }
  p, li, dd, blockquote { text-wrap: pretty; }
  code { font-family: ${MONO}; font-size: .86em; }`;

// The style that gives an element the color of an area: the "color" of the area in estate.json
// (estate.mjs checks it).
export const areaStyle = (area) => `--area: var(--c-${area.color})`;

// A group of the estate strip or of the estate mark: the cells of the repos of one area. The width
// of a group follows its count of repos (--n).
export const areaGroup = (area, cells) => `<span class="group" style="${areaStyle(area)}; --n: ${area.repos.length}">${cells}</span>`;

// The estate mark: the estate strip as a picture, with no links and no words, hidden from screen
// readers. One cell (<i>) for each repo, in a group for each area with repos (not the featured
// area). Each page gives it its own size. current is the name of the repo of a one-repo page (its
// onboarding guide, README, or glossary, or a moved page of it), or null: the cell of that repo
// gets an ink outline, the locator (as the address target on the estate strip of the landing page).
export const estateMark = (areas, current = null) => [
  '<div class="mark" aria-hidden="true">',
  ...areas.filter((a) => !a.featured).map((area) => areaGroup(area, area.repos.map((r) => (r.name === current ? '<i class="here"></i>' : "<i></i>")).join(""))),
  "</div>",
].join("\n");

// The masthead of a page in the site look other than the landing page (the landing page has its
// own): the estate mark over the parts of the page (for example the back links). siteStyle paints
// the parcel field under it.
export const masthead = (areas, parts = "", current = null) => ['<header class="masthead">', estateMark(areas, current), ...(parts ? [parts] : []), "</header>"].join("\n");

// The style of the masthead and of the page grid. column is the width of the content column of
// the page.
// - A narrow screen: the masthead is the band at the top. Its content aligns with the content
//   column, which is in the middle. The estate mark is 8.5rem x .55rem. The back links are under
//   it, in one row that wraps.
// - A wide screen: the body is a grid of two columns. The first column is the legend rail: the
//   masthead, which is sticky. The second column is the content column. The estate mark is 100% of
//   the rail wide (13.5rem at most) and .75rem high. The back links are under it, one under the
//   other.
// The page sets the layout of its content column. The cells of the estate mark keep their colors
// in print.
export const mastheadStyle = (column) => `  .masthead { padding: 1.25rem max(1.25rem, calc((100% - ${column}) / 2)); border-bottom: 1px solid var(--line); }
  .mark { display: flex; gap: 3px; width: 8.5rem; height: .55rem; margin-bottom: .75rem; }
  .mark .group { display: flex; flex: var(--n) 1 0; gap: 1px; min-width: 0; }
  .mark i { flex: 1 1 0; min-width: 0; background: var(--area); box-shadow: inset 0 0 0 1px var(--edge);
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .mark i.here { outline: 2px solid var(--ink); outline-offset: 1px; }
  .masthead nav { display: flex; flex-wrap: wrap; gap: .25rem 1.5rem; font: 500 .98rem/1.3 var(--display);
    font-stretch: 87.5%; }
  .masthead nav a { display: inline-block; padding-block: .15rem; color: var(--ink); text-decoration: none; }
  .masthead nav a:hover { text-decoration: underline; text-decoration-color: var(--line); }
  @media ${WIDE} {
    body { display: grid; grid-template-columns: var(--rail) minmax(0, 1fr); align-items: start; }
    .masthead { position: sticky; top: 0; padding: 2.4rem 1.5rem 2rem 2rem; border-bottom: 0; }
    .mark { width: 100%; max-width: 13.5rem; height: .75rem; margin-bottom: 1.4rem; }
    .masthead nav { flex-direction: column; align-items: start; }
  }
  .masthead > .mark:last-child { margin-bottom: 0; }`;

// The custom properties that a page uses (var(--name)) and that nothing in the page defines.
// Without a definition (for example a color that site-colors.mjs lost), a part of the page would
// have no color. The scripts do not count: a script can make a name from data at run time.
export function undefinedProperties(page) {
  const html = page.replace(/<script\b[^]*?<\/script>/g, "");
  const defined = new Set([...html.matchAll(/--([\w-]+):/g)].map((m) => m[1]));
  return [...new Set([...html.matchAll(/var\(--([\w-]+)/g)].map((m) => m[1]))].filter((n) => !defined.has(n));
}

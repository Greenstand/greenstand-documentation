// The roadmap page: the text copy for GitHub (docs/roadmap.md) and the page of the Pages site
// (roadmap.html). Both come from the view that build-roadmap.mjs makes: the snapshot, the
// milestones, and the groups with their sections. The two copies have the same words in the same
// order. No CLI: build-roadmap.mjs checks the data file and writes both. The page is in the site
// look (site-html.mjs, DESIGN.md).
import { noBreakDate, plural } from "./estate.mjs";
import { CHIP_STYLE, PAGE_END_STYLE, READING_COLUMN, STATE_STYLE, TEXT_STYLE, areaStyle, esc, masthead, mastheadStyle, siteHead, siteStyle } from "./site-html.mjs";

// The two groups that are not an area of estate.json.
export const ACROSS = "Across the estate";
export const OUTSIDE = "Outside the documented estate";

// The fixed headings, in page order. build-roadmap.mjs gives each its GitHub anchor (view.anchors).
export const HEADINGS = { title: "The Greenstand roadmap", milestones: "Where Greenstand is heading", glance: "At a glance" };

const NOTES = {
  [ACROSS]: "Sections about many repos.",
  [OUTSIDE]: "Work that these docs do not describe: no documented repo holds its code.",
};
const NO_SECTION = "The roadmap has no section for this area.";
const NO_ITEMS = "The source lists no items here.";
const GLANCE = "The sections of the source, by the areas of the estate. Open a section to see its items.";
const COLUMNS = ["Area or group", "Sections of the source", "Items"];

const built = ({ repo, path }) =>
  `<!-- Built by .github/scripts/build-roadmap.mjs from roadmap.json and sources/${repo}/${path}. Do not edit. -->`;

// Text in HTML (a summary of the text copy is HTML).
const escText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Text in a cell of a Markdown table.
const cell = (s) => s.replace(/\|/g, "\\|");

// The fixed paragraphs of the head, in Markdown: the lede, the snapshot line, and the credit line.
// showDate writes the snapshot date: the text copy passes noBreakDate; the page keeps the date as it
// is (keepWhole holds it whole).
function headParagraphs(view, showDate = (date) => date) {
  const { repo, path, commit, license } = view.source;
  const date = showDate(view.source.date);
  const complete =
    view.complete === 0 ? 'No item says "(Complete)".' : `${plural(view.complete, "item")} ${view.complete === 1 ? "says" : "say"} "(Complete)".`;
  return [
    `This page shows the roadmap of Greenstand: the work that Greenstand plans to do. The roadmap comes from \`${path}\` in ${repo}. ` +
      `It has no dates, no owners, and no status. ${complete} For the priority and the status of the work, see the ` +
      `[project boards](${view.boards}) or ask on Slack.`,
    `**Snapshot:** [\`${path}\`](https://github.com/Greenstand/${repo}/blob/${commit}/${path}) at commit \`${commit.slice(0, 7)}\` (${date}). ` +
      "The words of the items are as in the source.",
    `From \`${path}\` of [${repo}](https://github.com/Greenstand/${repo}) (${license}).`,
  ];
}

// The body of a section as the copies show it: "(Complete)" in bold.
const shownBody = (body) => body.replace(/\(complete\)/gi, "**$&**");

// The milestones as a numbered list: each top-level list marker becomes "1.".
const milestoneList = (body) => body.replace(/^[-*+](?=[ \t])/gm, "1.");

const milestonesSentence = (m) => `The source names ${plural(m.items, "milestone")}:`;

function foldMd(s) {
  const summary = [s.heading, plural(s.items, "item"), ...(s.bestGuess ? ["best guess"] : [])].join(" · ");
  const parts = [`<details>\n<summary>${escText(summary)}</summary>`];
  if (s.bestGuess) parts.push(`*Best guess for the area: ${s.bestGuess}.*`);
  if (!s.items) parts.push(NO_ITEMS);
  if (s.body) parts.push(shownBody(s.body));
  parts.push("</details>");
  return parts.join("\n\n");
}

// The text copy (docs/roadmap.md).
export function copyText(view) {
  const m = view.milestones;
  const rows = view.groups.map((g) => {
    const names = g.sections.map((s) => `${s.heading}${s.bestGuess ? " (best guess)" : ""}`);
    return `| [${cell(g.title)}](#${g.anchor}) | ${names.length ? cell(names.join(", ")) : "(none)"} | ${g.items} |`;
  });
  const parts = [
    built(view.source),
    `# ${HEADINGS.title}`,
    `This is the text copy of the page for GitHub. The page with the area colors is on the [Pages site](${view.siteUrl}roadmap.html).`,
    ...headParagraphs(view, noBreakDate),
    `## ${HEADINGS.milestones}`,
    milestonesSentence(m),
    milestoneList(shownBody(m.body)),
    `## ${HEADINGS.glance}`,
    GLANCE,
    [`| ${COLUMNS.join(" | ")} |`, "|---|---|---|", ...rows].join("\n"),
  ];
  for (const g of view.groups) {
    parts.push(`## ${g.title}`);
    parts.push(g.area ? `Repos: ${g.repos.map((r) => `[${r}](../repos/${r}/README.md)`).join(", ")}` : NOTES[g.title]);
    if (g.sections.length) parts.push(...g.sections.map(foldMd));
    else parts.push(NO_SECTION);
  }
  return parts.join("\n\n") + "\n";
}

// ---------- the page (roadmap.html) ----------

// The marker of a fold: a triangle that points right, as a mask. The muted color paints it.
const TRIANGLE = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M2.5 1.5l8 4.5-8 4.5z"/></svg>')}")`;

// The page rules after the text rules (TEXT_STYLE of site-html.mjs). An area section has the 3px
// rule and the chip in its area color, as on the landing page (DESIGN.md, Area section). The two
// other groups have the 2px ink rule of a text-page heading and no chip, because a chip names an
// area. Each section of the source is a fold between hairlines. Its summary holds the heading, the
// count, and the best-guess tag. A best guess shows by the tag (the hatch and the best-guess
// color), never by its color alone.
const PAGE_STYLE = `  th:last-child, td:last-child { text-align: right; }
  .credit { color: var(--muted); font-size: .92rem; }
${CHIP_STYLE}
  /* In the table the chip stays beside its area name, and a name that wraps hangs beside the
     chip. A group that is not an area gets an empty place of the chip, so the names align. */
  td:first-child a { display: inline-flex; align-items: baseline; }
  td:first-child .chip { flex: none; }
  .chip.none { background: none; box-shadow: none; }
  /* On a small phone the table fits the screen: smaller cell text, thinner cell padding, and a long
     word of a section name can break with a hyphen where the browser can hyphenate. */
  @media (max-width: 30rem) {
    td { font-size: .92rem; }
    th, td { padding: .5rem .4rem; }
    th:first-child, td:first-child { padding-left: 0; }
    th:last-child, td:last-child { padding-right: 0; }
    td:nth-child(2) { -webkit-hyphens: auto; hyphens: auto; }
  }
  section.area, section.other { margin-top: 2.9rem; padding-top: .75rem; border-top: 3px solid var(--area); scroll-margin-top: 1.5rem; }
  section.other { border-top: 2px solid var(--ink); }
  section > h2 { margin: 0 0 .5rem; padding: 0; border: 0; }
  .repos { color: var(--muted); }
  details.fold { border-top: 1px solid var(--line); }
  details.fold:last-of-type { border-bottom: 1px solid var(--line); }
  /* A loose list of the source (a blank line between items) gets the spacing of a tight list. */
  details.fold li > p { margin-block: 0; }
  details.fold li > p + * { margin-top: .3rem; }
  /* The summary hangs beside its own marker: a muted triangle mask, turned down when the fold is
     open, with no motion. Thus a heading that wraps keeps one left edge with the text of the
     fold. */
  details.fold > summary { position: relative; display: block; padding: .6rem 0 .6rem 1.1rem; cursor: pointer;
    font: 600 1.02rem/1.45 var(--display); list-style: none; }
  details.fold > summary::-webkit-details-marker { display: none; }
  details.fold > summary::before { content: ""; position: absolute; left: 0; top: calc(.6rem + .725em - .375rem);
    width: .75rem; height: .75rem; background-color: var(--muted); -webkit-mask: ${TRIANGLE} center / 100% 100% no-repeat;
    mask: ${TRIANGLE} center / 100% 100% no-repeat; }
  details.fold > summary:hover::before { background-color: var(--ink); }
  details.fold[open] > summary::before { transform: rotate(90deg); }
  @media (forced-colors: active) { details.fold > summary::before { forced-color-adjust: none; background-color: CanvasText; } }
  details.fold > summary .n { font-weight: 500; font-stretch: 87.5%; font-variant-numeric: tabular-nums; color: var(--muted); }
  details.fold > summary .tag { margin-left: .3rem; }
  details.fold > :not(summary) { margin-left: 1.1rem; }
  details.fold > :last-child:not(summary) { margin-bottom: 1.1rem; }
  details.fold > .flag { margin-top: .2rem; }
${STATE_STYLE}
  td .tag::before { margin-right: 0; }
  /* A date, a repo name, and the last word of a summary with its count stay on one line. */
  .nb { white-space: nowrap; }
  .hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
${PAGE_END_STYLE}`;

// Print shows every fold open. After the print, each fold is as it was.
const PAGE_SCRIPT = `let closed = [];
addEventListener("beforeprint", () => {
  closed = [...document.querySelectorAll("details:not([open])")];
  for (const d of closed) d.open = true;
});
addEventListener("afterprint", () => {
  for (const d of closed) d.open = false;
});`;

const chip = (style = "") => `<i class="chip" aria-hidden="true"${style ? ` style="${style}"` : ""}></i>`;
const NO_CHIP = '<i class="chip none" aria-hidden="true"></i>';
const GUESS_TAG = '<span class="tag guess">Best guess</span>';
const GUESS_MARK = '<span class="tag guess"><span class="hidden">(best guess)</span></span>';

// A heading with its last word and the part after it (the count, the mark) on one line.
const lastWordWith = (heading, after) => {
  const at = heading.lastIndexOf(" ") + 1;
  return `${esc(heading.slice(0, at))}<span class="nb">${esc(heading.slice(at))}${after}</span>`;
};

// An HTML tag. A quoted attribute value can hold ">".
const TAG = /(<(?:[^>"']|"[^"]*"|'[^']*')*>)/;
// The text between the tags of html with each date (YYYY-MM-DD), each repo name of names, and each
// quoted group in parentheses ("(Complete)") in a nowrap span: a browser breaks a line at a hyphen,
// and between an opening quote and "(" (the quote then sits alone at a line end). The longest name
// comes first, so a name inside a longer name does not count.
function keepWhole(html, names) {
  const words = [...names].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const whole = new RegExp(`(?<![\\w-])(?:\\d{4}-\\d{2}-\\d{2}|&quot;\\([^()<]*\\)&quot;|${words.join("|")})(?![\\w-])`, "g");
  return html
    .split(TAG)
    .map((part, i) => (i % 2 ? part : part.replace(whole, (w) => `<span class="nb">${w}</span>`)))
    .join("");
}

// The page of the view. md is a Marked instance (marked@12, as render-md.mjs). copyUrl is the link
// to the text copy on GitHub, or null. areas are the areas of estate.json: the estate mark and the
// repo names. The page is at the root of the site.
export function pageHtml(view, { md, copyUrl, areas }) {
  const block = (text) => md.parse(text).trim();
  const inline = (text) => md.parseInline(text);
  const [lede, snapshot, credit] = headParagraphs(view);
  const m = view.milestones;
  const rows = view.groups.map((g) => {
    const names = g.sections.map((s) => (s.bestGuess ? lastWordWith(s.heading, `&nbsp;${GUESS_MARK}`) : esc(s.heading)));
    return `<tr><td><a href="#${g.anchor}">${g.area ? chip(areaStyle(g)) : NO_CHIP}${esc(g.title)}</a></td><td>${names.length ? names.join(", ") : "(none)"}</td><td>${g.items}</td></tr>`;
  });
  const fold = (s) => {
    const parts = [
      `<details class="fold">`,
      `<summary>${lastWordWith(s.heading, ` <span class="n">· ${plural(s.items, "item")}</span>`)}${s.bestGuess ? ` ${GUESS_TAG}` : ""}</summary>`,
    ];
    if (s.bestGuess) parts.push(`<p class="flag guess"><span class="tag">Best guess</span> for the area: ${esc(s.bestGuess)}.</p>`);
    if (!s.items) parts.push(`<p>${NO_ITEMS}</p>`);
    if (s.body) parts.push(block(shownBody(s.body)));
    parts.push("</details>");
    return parts.join("\n");
  };
  const sections = view.groups.map((g) => {
    const repos = g.area ? g.repos.map((r) => `<a href="${r}/readme.html">${esc(r)}</a>`).join(", ") : "";
    const head = g.area
      ? [`<section class="area" style="${areaStyle(g)}">`, `<h2 id="${g.anchor}">${chip()}${esc(g.title)}</h2>`, `<p class="repos">Repos: ${repos}</p>`]
      : [`<section class="other">`, `<h2 id="${g.anchor}">${esc(g.title)}</h2>`, `<p class="repos">${NOTES[g.title]}</p>`];
    return [...head, ...(g.sections.length ? g.sections.map(fold) : [`<p>${NO_SECTION}</p>`]), "</section>"].join("\n");
  });
  const main = `<h1>${HEADINGS.title}</h1>
<p>${inline(lede)}</p>
<p>${inline(snapshot)}</p>
<p class="credit">${inline(credit)}</p>
<h2 id="${view.anchors.milestones}">${HEADINGS.milestones}</h2>
<p>${milestonesSentence(m)}</p>
${block(milestoneList(shownBody(m.body)))}
<h2 id="${view.anchors.glance}">${HEADINGS.glance}</h2>
<p>${GLANCE}</p>
<table>
<thead><tr>${COLUMNS.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
<tbody>
${rows.join("\n")}
</tbody>
</table>
${sections.join("\n")}
${copyUrl ? `<footer class="page-end"><p class="copy"><a href="${esc(copyUrl)}">Read the text copy of this page on GitHub</a></p></footer>\n` : ""}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${HEADINGS.title}</title>
<meta name="description" content="The work that Greenstand plans to do, from ${esc(view.source.path)} of ${esc(view.source.repo)}, by the areas of the estate.">
${siteHead(".")}
<style>
${siteStyle(".")}
${mastheadStyle(READING_COLUMN)}
${TEXT_STYLE}
${PAGE_STYLE}
</style>
</head>
<body>
${masthead(areas, '<nav><a href="./">&larr; All viewers</a></nav>')}
<main>
${keepWhole(main, areas.flatMap((a) => (a.repos ?? []).map((r) => r.name)))}</main>
<script>
${PAGE_SCRIPT}
</script>
</body>
</html>
`;
}

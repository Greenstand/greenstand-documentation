#!/usr/bin/env node
// Render a Markdown file to a styled, standalone HTML page.
// Usage: node render-md.mjs <inFile> <outFile> <title> <backHref> <backLabel>
// <inFile> is a path in the docs repo: repos/<name>/README.md, GLOSSARY.md or ARCHITECTURE.md
// at the root, docs/contribute-to-greenstand.md, or docs/shared-resources.md.
// Headings get GitHub's anchors, so "#anchor" links work as they do on GitHub. Relative links
// to a page that the site renders point to that page (ONBOARDING.md -> onboarding.html, the top
// README.md -> the landing page, and the text copy of a chapter of the capture journey
// docs/capture-journey*.md -> the illustrated page of the chapter); other relative links point to
// the file on GitHub at this commit.
// A repo name in a heading moves to the next line as one piece (see keepRepoNamesWhole).
// A Mermaid block becomes a diagram, as on GitHub. The page loads the copy of Mermaid that the
// deploy workflow puts on the site.
// The page is in the site look (site-html.mjs): the masthead holds the estate mark and the back
// links, in the legend rail on a wide screen; the text is in a reading column of 44rem; a diagram
// lies on a plate in the surface color, and each repo node has the color of its area.
// The script fails if the copy of Mermaid (for a page with a Mermaid block), the font, or the
// parcel field is missing on the site, or if the page uses a custom property that nothing defines.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { marked } from "marked";
import { chapterPageOf, docsBlobUrl, escapeRegExp, loadEstate } from "./estate.mjs";
import { DISPLAY, DISPLAY_FACE, READING_COLUMN, SITE_LOOK_FILES, TEXT_STYLE, WIDE, esc, masthead, mastheadStyle, siteHead, siteStyle, undefinedProperties } from "./site-html.mjs";
import { BACKGROUNDS, DIAGRAM_NODE_TINT, LINES, TEXTS } from "./site-colors.mjs";
import { slugger } from "./slug.mjs";

const [, , inFile, outFile, title, backHref = "./", backLabel = "Viewer"] = process.argv;

// The path of a docs-repo file on the Pages site, or null if the site does not serve it.
function sitePath(path) {
  let m;
  if ((m = path.match(/^repos\/([^/]+)\/(README|ONBOARDING|GLOSSARY)\.md$/))) return `${m[1]}/${m[2].toLowerCase()}.html`;
  if ((m = path.match(/^repos\/([^/]+)\/((?:knowledge-graph|domain-graph|meta)\.json)$/))) return `${m[1]}/${m[2]}`;
  if (path === "GLOSSARY.md") return "glossary.html";
  if (path === "ARCHITECTURE.md") return "architecture.html";
  if (path === "docs/contribute-to-greenstand.md") return "contribute.html";
  if (path === "docs/shared-resources.md") return "shared-resources.html";
  // The text copy of the roadmap page: on the site, a link to it opens the page that
  // build-roadmap.mjs writes.
  if (path === "docs/roadmap.md") return "roadmap.html";
  // The text copy of a chapter of the capture journey (chapterPageOf of estate.mjs, the rule of the
  // chapter file names): on the site, a link to it opens the illustrated page of the chapter, which
  // build-capture-journey.mjs writes.
  if (chapterPageOf(path)) return chapterPageOf(path);
  // The landing page shows the estate index of README.md.
  if (path === "README.md") return "index.html";
  return null;
}

const from = posix.normalize(inFile);
const here = sitePath(from);
const atRoot = here !== null && !here.includes("/");
// The path from the page to the root of the site: "." or "..".
const toRoot = posix.relative(posix.dirname(here ?? ""), ".") || ".";
// The commit of the build (CI): a link to a file that is not a page opens it on GitHub at that commit.
const { GITHUB_SHA: sha } = process.env;
// The repo of a one-repo page (repos/<name>/...): the estate mark shows its locator.
const pageRepo = from.match(/^repos\/([^/]+)\//)?.[1] ?? null;

function rewrite(href) {
  if (!here || /^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const [path, hash = ""] = href.split(/(?=#)/);
  const target = posix.normalize(posix.join(posix.dirname(from), path));
  if (target.startsWith("..")) return href;
  const page = sitePath(target);
  if (page) return posix.relative(posix.dirname(here), page) + hash;
  return sha ? `${docsBlobUrl(estate, sha, target)}${hash}` : href;
}

// The path of the Mermaid ESM entry on the site. The deploy workflow copies it there.
const MERMAID_ENTRY = "vendor/mermaid/mermaid.esm.min.mjs";
let hasMermaid = false;

const { estate, areas, repos, errors } = loadEstate();
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// A repo name in a heading goes into a span with the style "display: inline-block". Thus the
// name moves to the next line as one piece. A name that is wider than the line still breaks, so
// the page does not get wider than the screen. Only a page with such a span gets its style.
// A repo name that is a part of a longer word (tiles-1-docs, my-tiles-1, tiles-1.md) does not
// count. The longest name comes first, so that a name inside a longer name does not count.
const REPO_NAME = new RegExp(
  `(?<![\\w-])(?:${repos
    .map((r) => r.name)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|")})(?![\\w-]|\\.\\w)`,
  "g",
);
// An HTML tag. A quoted attribute value can hold ">".
const TAG = /(<(?:[^>"']|"[^"]*"|'[^']*')*>)/;
let hasRepoName = false;
// Changes only the text between the tags, not a tag or its attributes.
const keepRepoNamesWhole = (html) =>
  html
    .split(TAG)
    .map((part, i) =>
      i % 2
        ? part
        : part.replace(REPO_NAME, (name) => {
            hasRepoName = true;
            return `<span class="repo-name">${name}</span>`;
          }),
    )
    .join("");

const slug = slugger();
const text = (html) =>
  html.replace(/<[^>]*>/g, "").replace(/&(amp|lt|gt|quot|#39);/g, (m, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e]);
marked.use({
  gfm: true,
  renderer: {
    heading(html, level) {
      return `<h${level} id="${slug(text(html))}">${keepRepoNamesWhole(html)}</h${level}>\n`;
    },
    link(href, title, html) {
      return marked.Renderer.prototype.link.call(this, rewrite(href), title, html);
    },
    code(code, lang) {
      if (lang?.trim().split(/\s/)[0] !== "mermaid") return false;
      hasMermaid = true;
      return `<pre class="mermaid">${escText(code)}\n</pre>\n`;
    },
  },
});
// Escape text for HTML text (the source of a Mermaid block). esc (site-html.mjs) also escapes
// quotes, for an attribute.
const escText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const body = marked.parse(readFileSync(inFile, "utf8"));

// The files on the site that the page loads: the font and the parcel field of the site look, and
// Mermaid for a page with a Mermaid block. The deploy workflow puts them on the site. The script
// shows each missing file.
const missing = [];
for (const f of SITE_LOOK_FILES) {
  const path = join(dirname(outFile), toRoot, f);
  if (!existsSync(path)) missing.push(`${inFile} needs ${path}, but it is missing`);
}
const mermaidRel = posix.relative(posix.dirname(here ?? ""), MERMAID_ENTRY);
if (hasMermaid && !existsSync(join(dirname(outFile), mermaidRel))) {
  missing.push(`${inFile} has a Mermaid block, but ${join(dirname(outFile), mermaidRel)} is missing`);
}
if (missing.length) {
  for (const e of missing) console.error(`error: ${e}`);
  process.exit(1);
}

// The style of a repo name span. An inline-block does not get the underline of a link around
// it, so the span takes the text decoration of its parent.
const repoNameStyle = hasRepoName ? "\n  .repo-name { display: inline-block; text-decoration: inherit; }" : "";

// The page loads Mermaid only if it has a Mermaid block. Until Mermaid draws the diagrams, the
// page hides their source text. A browser without modules does not hide the text.
// A diagram fits the width of the page. But it keeps at least 70% of its size: thus its labels
// stay readable on a phone. A wider diagram scrolls in its own box, and a shadow shows the side
// with more of the diagram. The error image of a broken diagram keeps the size that Mermaid
// gives it. When the color scheme changes, Mermaid draws the diagrams again.
// The look of a diagram: a plate in the surface color; the nodes in the ground color with an ink
// label in Archivo (Mermaid measures the labels, so the font loads first); the lines in muted. The
// node of a repo has the color of its area: a fill at DIAGRAM_NODE_TINT on the ground and a border
// in the area color. The error image of a broken diagram is in the not-working color. "look:
// classic", because the default look of Mermaid draws node shadows. A broken diagram does not stop
// the area colors and the sizes of the other diagrams: they are set in finally.
let mermaidHead = "";
let mermaidScript = "";
if (hasMermaid) {
  const shadows = (bg, shadow) => `linear-gradient(to right, ${bg} 30%, ${bg}00) left / 2rem 100% no-repeat local,
      linear-gradient(to left, ${bg} 30%, ${bg}00) right / 2rem 100% no-repeat local,
      radial-gradient(farthest-side at 0 50%, ${shadow}40, ${shadow}00) left / .75rem 100% no-repeat scroll,
      radial-gradient(farthest-side at 100% 50%, ${shadow}40, ${shadow}00) right / .75rem 100% no-repeat scroll`;
  const plate = (i) => `${shadows(BACKGROUNDS.surface[i], TEXTS.ink[i])};
    background-color: var(--surface);`;
  const themeVariables = (i) => ({
    primaryColor: BACKGROUNDS.ground[i], primaryBorderColor: TEXTS.muted[i], primaryTextColor: TEXTS.ink[i],
    secondaryColor: BACKGROUNDS.ground[i], tertiaryColor: BACKGROUNDS.surface[i], lineColor: TEXTS.muted[i],
    textColor: TEXTS.ink[i], edgeLabelBackground: BACKGROUNDS.surface[i], clusterBkg: BACKGROUNDS.ground[i],
    clusterBorder: LINES.line[i], errorBkgColor: TEXTS["not-working"][i], errorTextColor: TEXTS["not-working"][i],
    fontFamily: DISPLAY, ...(i ? { darkMode: true } : {}),
  });
  // The area color of each repo, by its name: the label of its node.
  const colorOf = Object.fromEntries(areas.flatMap((a) => a.repos.map((r) => [r.name, a.color])));
  mermaidHead = `
<style>
  main > pre.mermaid { max-width: 62rem; margin-block: 1.5rem; }
  @media ${WIDE} { main > pre.mermaid { max-width: none; margin-block: 1.75rem; } }
  main pre.mermaid { padding: 1.5rem 1rem; text-align: center;
    background: ${plate(0)} }
  @media (prefers-color-scheme: dark) { main pre.mermaid {
    background: ${plate(1)} } }
  pre.mermaid g.area-node :is(rect, path, polygon, circle) {
    fill: color-mix(in srgb, var(--area) ${DIAGRAM_NODE_TINT}%, var(--ground)) !important; stroke: var(--area) !important;
    stroke-width: 1.5px !important; }
  .mermaid-loading pre.mermaid { visibility: hidden; }
</style>
<script>if ("noModule" in HTMLScriptElement.prototype) document.documentElement.classList.add("mermaid-loading");</script>`;
  mermaidScript = `
<script type="module">
const root = document.documentElement;
const dark = matchMedia("(prefers-color-scheme: dark)");
const blocks = [...document.querySelectorAll("pre.mermaid")].map((pre) => [pre, pre.textContent]);
const themes = ${JSON.stringify({ light: themeVariables(0), dark: themeVariables(1) })};
const colorOf = ${JSON.stringify(colorOf)};
import(${JSON.stringify(mermaidRel.startsWith("../") ? mermaidRel : `./${mermaidRel}`)})
  .then(({ default: mermaid }) => {
    const draw = () => {
      root.classList.add("mermaid-loading");
      for (const [pre, source] of blocks) {
        pre.removeAttribute("data-processed");
        pre.textContent = source;
      }
      // A node padding of 10 (the default is 15) lets the widest map (914 px at 15) show at its size in
      // the content column at 1280 px (site-look ticket 07). nodeSpacing does not change the width.
      mermaid.initialize({ startOnLoad: false, theme: "base", look: "classic", flowchart: { padding: 10 },
        themeVariables: dark.matches ? themes.dark : themes.light });
      return document.fonts.load('400 16px "${DISPLAY_FACE}"').then(() => mermaid.run()).finally(() => {
        for (const g of root.querySelectorAll("pre.mermaid g.node")) {
          const color = colorOf[g.textContent.trim()];
          if (color) {
            g.classList.add("area-node");
            g.style.setProperty("--area", "var(--c-" + color + ")");
          }
        }
        for (const svg of root.querySelectorAll('pre.mermaid svg:not([aria-roledescription="error"])')) {
          svg.style.minWidth = Math.round(svg.viewBox.baseVal.width * 0.7) + "px";
        }
        root.classList.remove("mermaid-loading");
      });
    };
    dark.addEventListener("change", draw);
    return draw();
  })
  .finally(() => root.classList.remove("mermaid-loading"));
</script>`;
}

// The layout. On a narrow screen: the masthead at the top (the estate mark over the back links),
// then the reading column, 44rem at most, in the middle. A diagram can be wider than the reading
// column. On a wide screen (64rem and more): the legend rail at the left holds the estate mark and
// the back links, one under the other, and stays in view while the page scrolls; the reading
// column starts beside the rail, and a diagram uses the width of the content column (64rem at
// most).
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${siteHead(toRoot)}
<style>
${siteStyle(toRoot)}
${mastheadStyle(READING_COLUMN)}
${TEXT_STYLE}${repoNameStyle}
</style>${mermaidHead}
</head>
<body>
${masthead(areas, `<nav><a href="${esc(backHref)}">&larr; ${esc(backLabel)}</a>${atRoot ? "" : '<a href="../">All viewers</a>'}</nav>`, pageRepo)}
<main>
${body}</main>${mermaidScript}
</body>
</html>
`;

// Each custom property that the page uses must have a definition in the page.
const undefinedNames = undefinedProperties(html);
if (undefinedNames.length) {
  for (const n of undefinedNames) console.error(`error: the page of ${inFile} uses var(--${n}), but nothing defines --${n}`);
  process.exit(1);
}

writeFileSync(outFile, html);
console.log("rendered", inFile, "->", outFile);

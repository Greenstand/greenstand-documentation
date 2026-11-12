#!/usr/bin/env node
// Build the moved pages of the Pages site from the former names in estate.json (estate.mjs).
// When a source repo is renamed, its viewer moves to a new subpath. Pages has no redirects, so
// a moved page at the subpath of the former name sends the reader to the same page at the new
// subpath. Each HTML page that the deploy assembled at the new subpath (the viewer, the
// onboarding guide, the README, the glossary) gets a moved page. Other files (graphs, raw
// markdown, the viewer's assets) get none.
// The pages are in the site look (site-html.mjs). The deploy workflow runs it after it assembles
// <site-dir>/<repo>/, the font, and the parcel field. It fails, and writes no page, when one of
// them is missing.
// Usage: node build-moved.mjs <site-dir>
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEstate } from "./estate.mjs";
import { CODE_CHIP, READING_COLUMN, SITE_LOOK_FILES, WIDE, esc, masthead, mastheadStyle, siteHead, siteStyle, undefinedProperties } from "./site-html.mjs";

const site = process.argv[2];
if (!site) {
  console.error("usage: node build-moved.mjs <site-dir>");
  process.exit(2);
}

const { estate, repos, errors } = loadEstate();

// The files of the site look that each moved page loads.
for (const f of SITE_LOOK_FILES) {
  if (!existsSync(join(site, f))) errors.push(`the moved pages need ${join(site, f)}, but it is missing`);
}

// Plan every moved page first, so that an error stops the script before it writes a page.
const plan = [];
for (const { name, formerNames } of repos) {
  if (!formerNames.length) continue;
  const viewer = join(site, name, "index.html");
  if (!existsSync(viewer)) {
    errors.push(`the viewer of ${name} is not assembled: ${viewer} is missing`);
    continue;
  }
  const pages = readdirSync(join(site, name)).filter((f) => f.endsWith(".html"));
  for (const former of formerNames) {
    if (existsSync(join(site, former))) {
      errors.push(`${join(site, former)} already exists, so it cannot hold the moved pages of ${name}`);
      continue;
    }
    for (const file of pages) plan.push({ former, name, file });
  }
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// A moved page: the page file of the repo name, at the subpath of its former name. A script
// sends the reader to the same page under the new name, with the query and the #anchor. The
// refresh is for a browser without scripts. The viewer (index.html) moves to the subpath
// itself, as the landing page links it. The page is in the site look (site-html.mjs): the masthead
// holds the estate mark, and the text is in the reading column. The page is one level under the
// root of the site.
function moved({ former, name, file }) {
  const page = file === "index.html" ? "" : file;
  const href = `../${name}/${page}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(former)} is now ${esc(name)}</title>
<link rel="canonical" href="${esc(`${estate.siteUrl}${name}/${page}`)}">
<script>location.replace(${JSON.stringify(href)} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${esc(href)}">
${siteHead("..", { preloadFont: false })}
<style>
${siteStyle("..")}
${mastheadStyle(READING_COLUMN)}
  main { padding: 1.5rem 1.25rem 5rem; }
  main > * { box-sizing: border-box; max-width: ${READING_COLUMN}; margin: 0 auto 1rem; }
  @media ${WIDE} {
    main { padding: 2.4rem clamp(1.5rem, 4vw, 4.5rem) 5rem; }
    main > * { margin-inline: 0; }
  }
${CODE_CHIP}
  a, code { white-space: nowrap; }
</style>
</head>
<body>
${masthead(estate.areas, "", name)}
<main>
<p>The source repo <code>${esc(former)}</code> is now <code>${esc(name)}</code>. This page moved to
<a href="${esc(href)}">${esc(name)}</a>.</p>
</main>
</body>
</html>
`;
}

// Each custom property that a moved page uses must have a definition in the page.
const pages = plan.map((page) => ({ ...page, html: moved(page) }));
const undefinedNames = [...new Set(pages.flatMap((page) => undefinedProperties(page.html)))];
if (undefinedNames.length) {
  for (const n of undefinedNames) console.error(`error: the moved pages use var(--${n}), but nothing defines --${n}`);
  process.exit(1);
}

for (const page of pages) {
  mkdirSync(join(site, page.former), { recursive: true });
  writeFileSync(join(site, page.former, page.file), page.html);
}
console.log(`wrote ${plan.length} moved page${plan.length === 1 ? "" : "s"} to ${site}`);

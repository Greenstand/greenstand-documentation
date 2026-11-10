#!/usr/bin/env node
// Build the roadmap page from roadmap.json and the pinned copy of the roadmap at
// sources/<repo>/<path> (the repo and the path of the source in roadmap.json). It writes the text
// copy for GitHub (docs/roadmap.md, built text) and, with --site, the page of the Pages site
// (roadmap.html, roadmap-page.mjs).
// The roadmap is Roadmap.md of Greenstand-Overview: sections of items under headings, and a list of
// milestones (roadmap-source.mjs parses it). The data file names the snapshot: the repo, the path,
// the commit of the last change of the file, its date, and the license. It also places each section
// of the source by its heading text: in an area of estate.json (named, or by a best guess with its
// reason), in "Across the estate" (about many repos), in "Outside the documented estate" (no
// documented repo builds it), in "Milestones" (the one list of milestones), or in "Intro" (not
// shown). The items stay word for word. The notice of the pinned copy (sources/<repo>/README.md)
// names the snapshot too.
// Usage: node build-roadmap.mjs               write docs/roadmap.md
//        node build-roadmap.mjs --check       exit 1 if docs/roadmap.md is stale or the data, the
//          source, or the notice has an error (CI; offline, no package)
//        node build-roadmap.mjs --evidence    exit 1 if GitHub does not hold the snapshot: the
//          pinned copy is not the file at the commit, the commit is not the last change of the file
//          there, the date or the license is different, or marked counts the items of a section
//          differently. It reads the GitHub API (GITHUB_TOKEN, if set) and needs marked. CI runs it
//          only when the data, the pinned copy, or the code that builds them changes.
//        node build-roadmap.mjs --site <dir>  write <dir>/roadmap.html (needs marked)
import { existsSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { EM_DASH, ROADMAP_COPY as COPY, ROADMAP_DATA as DATA, SOURCES, answerStatus, docsBlobUrl, githubApi, isObject, isText, loadEstate, parseJson, plural, readDocsFile, root, urlPath } from "./estate.mjs";
import { ACROSS, HEADINGS, OUTSIDE, copyText, pageHtml } from "./roadmap-page.mjs";
import { markedItems, parseSource } from "./roadmap-source.mjs";
import { SITE_LOOK_FILES, undefinedProperties } from "./site-html.mjs";
import { slugger } from "./slug.mjs";

const SCRIPT = ".github/scripts/build-roadmap.mjs";
const USAGE = `use: node ${SCRIPT} [--check | --evidence | --site <dir>]`;
const PAGE = "roadmap.html";
const MILESTONES = "Milestones";
const INTRO = "Intro";
// The groups that are not an area of estate.json.
const NON_AREA_GROUPS = [ACROSS, OUTSIDE, MILESTONES, INTRO];

const args = process.argv.slice(2);
let mode = "write";
let siteDir = null;
if (args.length === 1 && (args[0] === "--check" || args[0] === "--evidence")) mode = args[0].slice(2);
else if (args.length === 2 && args[0] === "--site") [mode, siteDir] = ["site", args[1]];
else if (args.length) {
  console.error(`error: ${USAGE}`);
  process.exit(2);
}

// Every error at once: the estate, the directory of --site and the files of the site look that the
// page loads (the font and the parcel field), then the data file, the source, and the notice.
const { estate, areas, repos, errors } = loadEstate();
function exitOnErrors() {
  if (!errors.length) return;
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
if (mode === "site" && !(existsSync(siteDir) && statSync(siteDir).isDirectory())) errors.push(`${siteDir} is not a directory`);
else if (mode === "site") {
  for (const f of SITE_LOOK_FILES) if (!existsSync(join(siteDir, f))) errors.push(`${PAGE} needs ${join(siteDir, f)}, but it is missing`);
}
const areaTitles = new Set(areas.filter((a) => a.repos.length).map((a) => a.title));
const GROUPS = `an area of estate.json with repos, ${NON_AREA_GROUPS.map((g) => `"${g}"`).join(", ").replace(/, ([^,]*)$/, ", or $1")}`;

// Check the form of roadmap.json, every error at once, and return it only if it is valid.
function validData(data) {
  const before = errors.length;
  const unknown = (obj, keys, where) => {
    for (const k of Object.keys(obj)) if (!keys.includes(k)) errors.push(`${where} the unknown key ${JSON.stringify(k)}`);
  };
  if (data === null) return null; // readDocsFile recorded the reason
  if (!isObject(data)) return errors.push(`${DATA} must be a JSON object`), null;
  unknown(data, ["source", "boards", "sections"], `${DATA} has`);
  const src = data.source;
  if (!isObject(src)) errors.push(`${DATA}: source must be an object with repo, path, commit, date, and license`);
  else {
    unknown(src, ["repo", "path", "commit", "date", "license"], `${DATA}: source has`);
    if (!repos.some((r) => r.name === src.repo)) errors.push(`${DATA}: source.repo ${JSON.stringify(src.repo)} is not a repo of estate.json`);
    if (!isText(src.path) || src.path.split("/").some((p) => !p || p === "." || p === "..")) errors.push(`${DATA}: source.path must be a path in the repo`);
    if (typeof src.commit !== "string" || !/^[0-9a-f]{40}$/.test(src.commit)) errors.push(`${DATA}: source.commit must be a full commit id (40 hex characters)`);
    if (typeof src.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(src.date)) errors.push(`${DATA}: source.date must be a date (YYYY-MM-DD)`);
    if (!isText(src.license)) errors.push(`${DATA}: source.license must be a text`);
  }
  if (typeof data.boards !== "string" || !/^https:\/\/github\.com\/\S+$/.test(data.boards)) errors.push(`${DATA}: boards must be an https://github.com/ address`);
  if (!isObject(data.sections)) errors.push(`${DATA}: sections must be an object: the heading text of each section of the source, and its place`);
  else {
    let milestones = 0;
    for (const [heading, s] of Object.entries(data.sections)) {
      const name = `the section ${JSON.stringify(heading)}`;
      if (!isObject(s)) {
        errors.push(`${DATA}: ${name} must be an object with a group`);
        continue;
      }
      unknown(s, ["group", "bestGuess"], `${DATA}: ${name} has`);
      const nonArea = NON_AREA_GROUPS.includes(s.group);
      if (!areaTitles.has(s.group) && !nonArea) errors.push(`${DATA}: the group of ${name} is ${JSON.stringify(s.group)}: use ${GROUPS}`);
      if (s.group === MILESTONES) milestones++;
      if (s.bestGuess !== undefined) {
        if (!isText(s.bestGuess)) errors.push(`${DATA}: the best guess of ${name} must be a text`);
        else if (nonArea) errors.push(`${DATA}: ${name} has a best guess, but ${JSON.stringify(s.group)} is not an area`);
        else {
          if (/\.\s*$/.test(s.bestGuess)) errors.push(`${DATA}: the best guess of ${name} ends with a period: the page adds it`);
          if (s.bestGuess.includes(EM_DASH)) errors.push(`${DATA}: the best guess of ${name} has an em dash`);
        }
      }
    }
    if (milestones !== 1) errors.push(`${DATA} must place exactly one section in "${MILESTONES}"; it places ${milestones}`);
  }
  return errors.length === before ? data : null;
}

const data = validData(readDocsFile(DATA, errors, parseJson));
const sourceAt = data ? `${SOURCES}/${data.source.repo}/${data.source.path}` : null;
const noticeAt = data ? `${SOURCES}/${data.source.repo}/README.md` : null;
const sourceText = sourceAt ? readDocsFile(sourceAt, errors) : null;
const source = sourceText === null ? null : parseSource(sourceText);

// Check the sections in both directions: each section of the source has an entry, and each entry
// names a section of the source. A shown section keeps its words, so its links must work from these
// docs, and it must be Markdown only: a relative link points into the source repo, and an HTML tag
// can break a fold.
function checkSections() {
  const where = `${data.source.path} at ${data.source.commit.slice(0, 7)}`;
  for (const p of source.problems) errors.push(`${where} ${p}`);
  if (source.problems.length) return;
  const headings = new Set(source.sections.map((s) => s.heading));
  for (const s of source.sections) {
    if (!Object.hasOwn(data.sections, s.heading)) errors.push(`${where} has the section ${JSON.stringify(s.heading)}, but ${DATA} has no entry for it`);
  }
  for (const heading of Object.keys(data.sections)) {
    if (!headings.has(heading)) errors.push(`${DATA} has an entry for the section ${JSON.stringify(heading)}, but ${where} has no such section`);
  }
  for (const s of source.sections) {
    if (data.sections[s.heading]?.group === INTRO) continue;
    const name = `the section ${JSON.stringify(s.heading)}`;
    const targets = [...s.body.matchAll(/\]\(\s*<?([^)\s>]+)/g), ...s.body.matchAll(/^ {0,3}\[[^\]]+\]:\s*<?(\S+?)>?(?:\s|$)/gm)].map((m) => m[1]);
    for (const t of targets) if (!/^(https?:|mailto:)/i.test(t)) errors.push(`${where}: ${name} links ${t}: a relative link of the source does not work in these docs`);
    const tags = new Set([...s.body.matchAll(/<\/?([A-Za-z][A-Za-z0-9-]*)(?=[\s>/])[^>]*>/g)].map((m) => m[1].toLowerCase()));
    for (const t of tags) errors.push(`${where}: ${name} has the HTML tag <${t}>: the copies show the source as Markdown only`);
  }
}

// Check the notice of the pinned copy: each link to a file of the source repo is at the snapshot
// commit, and the notice names the short commit and the date of roadmap.json.
function checkNotice(notice) {
  const { repo, commit, date } = data.source;
  const short = commit.slice(0, 7);
  const linked = new Set([...notice.matchAll(new RegExp(`github\\.com/Greenstand/${repo}/blob/([0-9a-f]{40})/`, "g"))].map((m) => m[1]));
  for (const c of linked) if (c !== commit) errors.push(`${noticeAt} links the commit ${c.slice(0, 7)}, but ${DATA} names ${short}: edit the notice`);
  if (!notice.includes(`\`${short}\``) || !notice.includes(`(${date})`)) {
    errors.push(`${noticeAt} does not name the commit \`${short}\` and the date (${date}) of ${DATA}: edit the notice`);
  }
}

if (source) checkSections();
const notice = noticeAt ? readDocsFile(noticeAt, errors) : null;
if (notice !== null) checkNotice(notice);
exitOnErrors();

// The view of the page: the snapshot, the anchors of the fixed headings, the milestones, and the
// groups (the areas of estate.json that have repos, in their order, then "Across the estate" and
// "Outside the documented estate"). Each group has its sections in source order, its item count,
// and its anchor (the GitHub anchor of its heading).
function viewOf() {
  const shown = source.sections.map((s) => ({ ...s, ...data.sections[s.heading] })).filter((s) => s.group !== INTRO);
  const groups = [
    ...areas.filter((a) => a.repos.length).map((a) => ({ title: a.title, color: a.color, repos: a.repos.map((r) => r.name), area: true })),
    { title: ACROSS, area: false },
    { title: OUTSIDE, area: false },
  ].map((g) => {
    const sections = shown.filter((s) => s.group === g.title);
    return { ...g, sections, items: sections.reduce((n, s) => n + s.items, 0) };
  });
  const slug = slugger();
  const anchors = Object.fromEntries(Object.entries(HEADINGS).map(([k, heading]) => [k, slug(heading)]));
  for (const g of groups) g.anchor = slug(g.title);
  return {
    source: data.source,
    boards: data.boards,
    siteUrl: estate.siteUrl,
    anchors,
    milestones: shown.find((s) => s.group === MILESTONES),
    groups,
    sections: shown.length,
    items: shown.reduce((n, s) => n + s.items, 0),
    complete: shown.reduce((n, s) => n + s.complete, 0),
  };
}
const view = viewOf();
const summary = `${plural(view.sections, "section")}, ${plural(view.items, "item")}, ${view.complete} (Complete)`;

// Check the snapshot on GitHub: the license of the repo, the commit as the last change of the file
// at that commit and its date, the pinned copy as the file at the commit, and the item count of
// each section by marked.
async function checkEvidence() {
  const { repo, path, commit, date, license } = data.source;
  const short = commit.slice(0, 7);
  const api = githubApi(estate.sourceOrg, process.env.GITHUB_TOKEN);
  const info = await api.get(repo);
  if (info.body === undefined) errors.push(`the repo ${repo} is not found (${answerStatus(info)})`);
  else if (info.body.license?.spdx_id !== license) errors.push(`${repo} has the license ${info.body.license?.spdx_id ?? "(none)"}, but ${DATA} says ${license}`);
  const commits = await api.get(`${repo}/commits?path=${urlPath(path)}&sha=${commit}&per_page=1`);
  const last = commits.body?.[0];
  const day = last && new Date(last.commit.committer.date).toISOString().slice(0, 10);
  if (!last) errors.push(`the commits of ${path} at ${short} are not found (${commits.body ? "no commit" : answerStatus(commits)})`);
  else if (last.sha !== commit) errors.push(`the commit ${short} did not change ${path}: the last change at that commit is ${last.sha.slice(0, 7)}`);
  else if (day !== date) errors.push(`the commit ${short} is of ${day}, but ${DATA} says ${date}`);
  const file = await api.file(repo, path, commit);
  if (file.body === undefined) errors.push(`${path} is not in ${repo} at ${short} (${answerStatus(file)})`);
  else if (file.body !== sourceText) errors.push(`${path} at ${short} is not the pinned copy ${sourceAt}`);
  const { marked } = await import("marked");
  for (const s of source.sections) {
    const n = markedItems((text) => marked.lexer(text), s.body);
    if (n !== s.items) errors.push(`marked counts ${plural(n, "item")} in the section ${JSON.stringify(s.heading)}, but the page counts ${s.items}: fix the item rule (countItems)`);
  }
}

if (mode === "evidence") {
  await checkEvidence();
  exitOnErrors();
  const { repo, path, commit, date, license } = data.source;
  console.log(
    `the snapshot holds: ${path} of ${repo} at ${commit.slice(0, 7)} (${date}, ${license}) is the pinned copy and its last change; ` +
      `marked counts the ${plural(view.items, "item")} of the ${plural(view.sections, "section")} as the page does`,
  );
} else if (mode === "site") {
  const { Marked } = await import("marked");
  const { GITHUB_SHA: githubSha } = process.env;
  const copyUrl = githubSha ? docsBlobUrl(estate, githubSha, COPY) : null;
  const html = pageHtml(view, { md: new Marked({ gfm: true }), copyUrl, areas: estate.areas });
  for (const n of undefinedProperties(html)) errors.push(`${PAGE}: the page uses var(--${n}), but nothing defines --${n}`);
  exitOnErrors();
  writeFileSync(join(siteDir, PAGE), html);
  console.log(`wrote ${join(siteDir, PAGE)} (${summary})`);
} else if (mode === "check") {
  if (copyText(view) !== readDocsFile(COPY, [])) {
    errors.push(
      `${COPY} is stale. Run: node ${SCRIPT}. If you changed the pinned copy ${sourceAt}, also run: node ${SCRIPT} --evidence ` +
        "(the pinned copy must be the file at the snapshot)",
    );
  }
  exitOnErrors();
  console.log(`${COPY} is current (${summary})`);
} else {
  writeFileSync(join(root, COPY), copyText(view));
  console.log(`wrote ${COPY} (${summary})`);
}

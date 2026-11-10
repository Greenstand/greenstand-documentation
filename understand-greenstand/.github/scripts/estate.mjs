// Load the estate: estate.json (areas, descriptions, URLs) plus repos/*/meta.json (snapshots).
// These scripts import this module, so their outputs cannot drift apart:
// build-index.mjs (the README.md index), build-landing.mjs (the Pages landing page),
// build-moved.mjs (the moved pages of renamed repos), build-glossary.mjs,
// build-repo-readmes.mjs, build-onboarding.mjs, build-ecosystem-maps.mjs,
// build-shared-resources.mjs, build-capture-journey.mjs, capture-journey-page.mjs,
// build-contributors.mjs, contributors.mjs, contributors-page.mjs, check-former-names.mjs,
// check-graphs.mjs, check-safety-review.mjs, drift-report.mjs, render-md.mjs, and start-path.mjs.
// Returns { estate, areas, repos, count, errors }. Each repo in areas gets its snapshot, its
// Source URL, and its valid former names (a list, often empty). repos lists the repos of all
// areas, in order. errors lists every problem at once; the caller prints them and exits.
// Also exports the helpers that the build scripts share: readDocsFile, parseJson, markedBlock,
// markedSpan, replaceMarked, formerNamesText, EM_DASH, fencedLines, readGraph, isObject, isText,
// escapeRegExp, urlPath, plural, the name rule of the evidence (expandRepoName, hasWholeName,
// missingNames), the evidence form (isRepoPath, parseLines, lineAnchor, citedLines), the GitHub API
// of the evidence checks (githubApi, RAW, answerStatus), the readers of the data files for scripts
// that use only some fields (readSharedResources, readCaptureJourney), and the paths of the
// shared-resource page and of the capture journey (chapterFiles, CHAPTER_COPY, CHAPTER_PAGE), and
// wordList.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AREA_COLORS } from "./site-colors.mjs";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// The em dash. This repo's text uses none, and the checks look for it.
export const EM_DASH = String.fromCharCode(0x2014);

// A count with its word: "1 file", "2 files", "2 evidence entries".
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// A JSON text as a value. A text that starts with a byte order mark gets a clear error: the mark is
// not visible in most editors, and JSON.parse names it only as an "Unexpected token".
export function parseJson(text) {
  if (text.startsWith(String.fromCharCode(0xfeff))) throw new Error("the file starts with a byte order mark (BOM): save it as UTF-8 without a BOM");
  return JSON.parse(text);
}

// A JSON object: not null, and not a list.
export const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
// A string with a character that is not white space.
export const isText = (v) => typeof v === "string" && v.trim() !== "";

// A text as a regular expression that matches exactly that text.
export const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A path in a repo as a URL path. "(" and ")" are encoded too, so a Markdown link stays whole.
export const urlPath = (path) =>
  path
    .split("/")
    .map((segment) => encodeURIComponent(segment).replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))
    .join("/");

// The name rule of the shared-resource facts, for build-shared-resources.mjs (at the snapshot)
// and drift-report.mjs (on the default branch). A build workflow often gives the image name as
// greenstand/${{ github.event.repository.name }}: expandRepoName reads that one expression as the
// repo name. GitHub expressions ignore case.
export const expandRepoName = (text, repo) => text.replace(/\$\{\{\s*github\.event\.repository\.name\s*\}\}/gi, repo);
// A name counts only as a whole name: greenstand/a is not in greenstand/a-dev or in greenstand/a.old.
export const hasWholeName = (text, name) => new RegExp(`(?<![\\w/-])${escapeRegExp(name)}(?![\\w/.-])`).test(text);

// The form of an evidence entry (shared-resources.json, capture-journey.json). A path in a repo:
// a text with no leading "/" and no empty, ".", or ".." part.
export const isRepoPath = (path) =>
  typeof path === "string" && path !== "" && !path.startsWith("/") && !path.split("/").some((s) => s === "" || s === "." || s === "..");
// The cited lines: "<n>" or "<first>-<last>", one written form for each range: no leading zero,
// and the first line before the last. Returns { first, last }, or null for any other value.
export function parseLines(lines) {
  const m = typeof lines === "string" ? lines.match(/^([1-9]\d*)(?:-([1-9]\d*))?$/) : null;
  const range = m && { first: Number(m[1]), last: Number(m[2] ?? m[1]) };
  return range && (m[2] === undefined || range.first < range.last) ? range : null;
}
// The line anchor of a GitHub file link: #L7 or #L3-L5.
export const lineAnchor = ({ first, last }) => (first === last ? `#L${first}` : `#L${first}-L${last}`);
// The files that GitHub renders (github/markup): GitHub shows them in a Preview tab, where a line
// anchor marks no line. ?plain=1 opens the code view, which marks the lines.
const RENDERED_FILE = /\.(md|markdown|mdown|mkdn|textile|rdoc|org|creole|mediawiki|wiki|rst|asciidoc|adoc|asc|pod)$/i;
// The GitHub link to the cited lines of a file at a commit, for a reader: the code view of a
// rendered file, and the line anchor.
export const linesLink = (owner, repo, ref, path, range) => `https://github.com/${owner}/${repo}/blob/${ref}/${urlPath(path)}${RENDERED_FILE.test(path) ? "?plain=1" : ""}${lineAnchor(range)}`;

// The GitHub API of the evidence checks (build-shared-resources.mjs and
// build-capture-journey.mjs), for the repos of one owner: each request once. get(path, accept)
// answers { body } (a text for the raw media type, else the JSON value) or { status } (the HTTP
// status, or null with the error when GitHub gives no answer). file() reads a file of a repo at a
// commit.
export const RAW = "application/vnd.github.raw";
export function githubApi(owner, token) {
  const asked = new Map(); // "<accept> <path>" -> a promise of the answer
  const get = (path, accept = "application/vnd.github+json") => {
    const key = `${accept} ${path}`;
    if (!asked.has(key)) {
      const headers = { Accept: accept, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      asked.set(
        key,
        fetch(`https://api.github.com/repos/${owner}/${path}`, { headers }).then(
          async (res) => (res.ok ? { body: accept === RAW ? await res.text() : await res.json() } : { status: res.status }),
          (e) => ({ status: null, error: e.message }),
        ),
      );
    }
    return asked.get(key);
  };
  const file = (repo, path, commit, accept = RAW) => get(`${repo}/contents/${urlPath(path)}?ref=${commit}`, accept);
  return { get, file };
}
// The status of an answer with no body, for an error: "HTTP 404", or "no answer: <error>".
export const answerStatus = (answer) => (answer.status === null ? `no answer: ${answer.error}` : `HTTP ${answer.status}`);
// The cited lines of a file: { text } with the lines, or { count } (the lines of the file) when the
// file is shorter than the range. The lines are the lines that GitHub numbers, because a page links
// them as #L<n>: CRLF counts as one line end, and a lone CR does not end a line.
export function citedLines(fileText, { first, last }) {
  const lines = fileText.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
  return last > lines.length ? { count: lines.length } : { text: lines.slice(first - 1, last).join("\n") };
}
// The names that a text does not hold, by the name rule (hasWholeName), in their order.
export const missingNames = (text, names) => names.filter((name) => !hasWholeName(text, name));

// Which lines of a Markdown text are fenced code: a fence line, or a line between an opening
// fence and its closing fence. As in CommonMark, a closing fence uses the character of the
// opening fence ("`" or "~"), is at least as long, and holds nothing else.
export function fencedLines(lines) {
  let open = null; // the opening fence, for example "```"
  return lines.map((line) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (open === null) {
      open = fence ?? null;
      return Boolean(fence);
    }
    if (fence?.[0] === open[0] && fence.length >= open.length && line.trim() === fence) open = null;
    return true;
  });
}

// Each repos/<name>/ directory must hold these files: both indexes link to them.
const REQUIRED_FILES = ["knowledge-graph.json", "README.md", "ONBOARDING.md"];

export function loadEstate() {
  const estate = JSON.parse(readFileSync(join(root, "estate.json"), "utf8"));
  const errors = [];

  if (!estate.siteUrl?.endsWith("/")) errors.push("estate.json: siteUrl must end with '/'");
  // The docs live in docsDir of the repo docsRepo on GitHub: the links to a file on GitHub need both.
  if (!/^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(estate.docsRepo ?? "")) errors.push("estate.json: docsRepo must be the GitHub repo of the docs (<owner>/<repo>)");
  if (typeof estate.docsDir !== "string" || !/^(?:[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*)?$/.test(estate.docsDir)) errors.push("estate.json: docsDir must be the folder of the docs in docsRepo, with no '/' at the start or the end (\"\" for the root)");

  // The landing page shows the featured area first, in its "Start here" box, with the steps of the
  // Start here path (start-path.mjs). The estate index shows the areas in their order. Thus exactly
  // one area is featured, and it is the first area.
  const featured = estate.areas.filter((a) => a.featured).length;
  if (featured !== 1) errors.push(`estate.json must have exactly one featured area (the "Start here" box of the landing page); it has ${featured}`);
  else if (!estate.areas[0].featured) {
    const { title } = estate.areas.find((a) => a.featured);
    errors.push(`estate.json: the featured area ${JSON.stringify(title)} must be the first area: the estate index and the landing page show it first`);
  }

  // The featured area has no repos: its box shows the path, and the estate strip shows only the
  // areas with repos. Thus it has no color either. Each other area has one or more repos.
  for (const { title, featured, color, repos } of estate.areas) {
    if (featured) {
      if (color !== undefined || repos !== undefined) {
        errors.push(`estate.json: the featured area ${JSON.stringify(title)} must have no color and no repos: the Start here box shows the path, and the estate strip shows only the areas with repos`);
      }
    } else if (!Array.isArray(repos) || repos.length === 0) {
      errors.push(`estate.json: the area ${JSON.stringify(title)} must have a list of one or more repos`);
    }
  }
  // From here on, each area has a list of repos. The list of the featured area is empty, unless
  // the error above names its repos: then the repos stay, so that they get no false error.
  const areaList = estate.areas.map((area) => ({ ...area, repos: Array.isArray(area.repos) ? area.repos : [] }));

  // A note on a repo (for example that some of its information is out of date) shows with its
  // description on the landing page, in the estate index, and in the per-repo README.
  for (const { name, note } of areaList.flatMap((a) => a.repos)) {
    if (note !== undefined && (typeof note !== "string" || !note.trim())) errors.push(`estate.json: the note of ${name} must be a text that is not empty`);
  }

  // The site look fills the cells of an area in the estate strip with the color of the area: one
  // of the area colors of site-colors.mjs. Two areas with one color would look like one area, so
  // each area with repos needs its own color.
  const colorOf = new Map(); // an area color -> the title of its area
  for (const { title, color, featured } of areaList) {
    if (featured) continue;
    if (typeof color !== "string" || !Object.hasOwn(AREA_COLORS, color)) {
      errors.push(`estate.json: the color of the area ${JSON.stringify(title)} must be one of ${Object.keys(AREA_COLORS).join(", ")}`);
    } else if (colorOf.has(color)) {
      errors.push(`estate.json: the areas ${JSON.stringify(colorOf.get(color))} and ${JSON.stringify(title)} have the same color (${color}); each area needs its own color`);
    } else {
      colorOf.set(color, title);
    }
  }

  // Every repos/<name>/ directory needs exactly one entry, and every entry a directory.
  const dirs = readdirSync(join(root, "repos"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const listed = areaList.flatMap((a) => a.repos.map((r) => r.name));

  // A renamed repo lists its former names in formerNames. The deploy writes a moved page at
  // the subpath of each former name (build-moved.mjs). Thus a former name must be a repo name
  // that no repo uses now, and that can be a subpath of the site: it does not start with "."
  // (a hidden file) and does not end with ".html" (a page at the root of the site).
  const formerNamesOf = new Map(); // the name of a repo -> its valid former names
  const nameOf = new Map(); // a valid former name -> the name of its repo
  for (const { name, formerNames } of areaList.flatMap((a) => a.repos)) {
    if (formerNames === undefined) continue;
    if (!Array.isArray(formerNames) || !formerNames.every((f) => typeof f === "string")) {
      errors.push(`estate.json: formerNames of ${name} must be a list of repo names`);
      continue;
    }
    for (const former of formerNames) {
      if (!/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/.test(former) || former.endsWith(".html")) {
        errors.push(`estate.json: ${JSON.stringify(former)} (a former name of ${name}) is not a repo name that can be a subpath of the site`);
      } else if (listed.includes(former)) {
        errors.push(`estate.json: ${former} is the name of a repo, so it cannot be a former name of ${name}`);
      } else if (nameOf.has(former)) {
        errors.push(`estate.json lists ${former} as a former name twice`);
      } else {
        nameOf.set(former, name);
        formerNamesOf.set(name, [...(formerNamesOf.get(name) ?? []), former]);
      }
    }
  }

  for (const dir of dirs) {
    if (listed.includes(dir)) continue;
    const name = nameOf.get(dir);
    errors.push(name ? `repos/${dir}/ remains, but ${dir} is a former name of ${name}: move it to repos/${name}/` : `repos/${dir}/ has no entry in estate.json`);
  }
  for (const name of listed) {
    if (listed.indexOf(name) !== listed.lastIndexOf(name)) errors.push(`estate.json lists ${name} twice`);
    if (!dirs.includes(name)) errors.push(`estate.json lists ${name}, but repos/${name}/ does not exist`);
  }

  function snapshot(name) {
    const file = join(root, "repos", name, "meta.json");
    if (!existsSync(file)) return errors.push(`repos/${name}/meta.json is missing`), null;
    const { gitCommitHash: sha, lastAnalyzedAt: at } = JSON.parse(readFileSync(file, "utf8"));
    if (!/^[0-9a-f]{40}$/.test(sha ?? "")) errors.push(`repos/${name}/meta.json: gitCommitHash is not a full SHA`);
    if (!/^\d{4}-\d{2}-\d{2}T/.test(at ?? "")) errors.push(`repos/${name}/meta.json: lastAnalyzedAt is not an ISO date`);
    return { sha, date: at?.slice(0, 10) };
  }

  const areas = areaList.map((area) => ({
    ...area,
    repos: area.repos
      .filter(({ name }) => dirs.includes(name))
      .map((repo) => {
        for (const f of REQUIRED_FILES) {
          if (!existsSync(join(root, "repos", repo.name, f))) errors.push(`repos/${repo.name}/${f} is missing`);
        }
        const snap = snapshot(repo.name);
        const formerNames = formerNamesOf.get(repo.name) ?? [];
        return snap && { ...repo, ...snap, formerNames, source: `https://github.com/${estate.sourceOrg}/${repo.name}` };
      })
      .filter(Boolean),
  }));

  return { estate, areas, repos: areas.flatMap((a) => a.repos), count: listed.length, errors };
}

// The URL of the docs repo on GitHub (estate.json docsRepo).
export const docsRepoUrl = (estate) => `https://github.com/${estate.docsRepo}`;
// The path in the docs repo of a file of the docs (a path from root): the docs live in docsDir.
export const docsRepoPath = (estate, path) => (estate.docsDir ? `${estate.docsDir}/${path}` : path);
// The URL on GitHub of a file of the docs (a path from root) at ref (a commit, a branch, or HEAD).
// Each link to a file of the docs on GitHub comes from here: one shape, one source of the repo name.
export const docsBlobUrl = (estate, ref, path) => `${docsRepoUrl(estate)}/blob/${ref}/${docsRepoPath(estate, path)}`;
// A date (YYYY-MM-DD) with each "-" as a non-breaking hyphen (U+2011): GitHub can break a plain date at
// a hyphen on a narrow screen. Used in the README estate index (build-index.mjs) and the text copy of the
// roadmap (roadmap-page.mjs). The data files and the Pages pages keep the ASCII date (a page keeps a
// date whole with a nowrap span).
export const noBreakDate = (date) => date.replaceAll("-", "\u2011");
// The words after the GitHub link of a repo that the capture journey cites but these docs do not
// describe: it has no viewer and no onboarding guide here.
export const NO_GUIDE = "no guide in these docs";

// Read a file of the docs repo (at is its path from the root) and parse it, or record in errors
// why it cannot be read or parsed, and return null.
export function readDocsFile(at, errors, parse = (text) => text) {
  const file = join(root, at);
  if (!existsSync(file)) return errors.push(`${at} is missing`), null;
  try {
    return parse(readFileSync(file, "utf8"));
  } catch (e) {
    return errors.push(`${at}: ${e.message}`), null;
  }
}

// The data file of the shared-resource page, and the page. build-shared-resources.mjs builds the
// page from the data file and checks all of the data file.
export const SHARED_RESOURCES_DATA = "shared-resources.json";
export const SHARED_RESOURCES_PAGE = "docs/shared-resources.md";

// The data file of the roadmap page, its text copy for GitHub, and the directory of the pinned
// copies of source files. build-roadmap.mjs builds the text copy and the page of the Pages site
// (roadmap.html) from the data file and the pinned copy of the roadmap at sources/<repo>/<path>
// (the repo and the path of the source in the data file).
export const ROADMAP_DATA = "roadmap.json";
export const ROADMAP_COPY = "docs/roadmap.md";
export const SOURCES = "sources";

// The data file of the capture journey, the text copy of chapter 1 for GitHub, and the image
// directory. build-capture-journey.mjs builds the text copy and the page of the Pages site of each
// chapter from the data file, and checks all of the data file.
export const CAPTURE_JOURNEY_DATA = "capture-journey.json";
export const CAPTURE_JOURNEY_COPY = "docs/capture-journey.md";
export const CAPTURE_JOURNEY_IMAGES = "docs/capture-journey";
// The file names of the chapters, from one rule: chapter 1 (index 0) has docs/capture-journey.md
// and capture-journey.html; a later chapter adds "-" and its id (lowercase words joined by "-"),
// for example docs/capture-journey-web-map.md and capture-journey-web-map.html. chapterFiles gives
// the files of a chapter; CHAPTER_COPY and CHAPTER_PAGE match each name that it can give (the build
// check, the safety check, render-md.mjs, and the links between the pages use them).
const JOURNEY = "capture-journey";
const ID = "[a-z0-9]+(?:-[a-z0-9]+)*";
export const CHAPTER_ID = new RegExp(`^${ID}$`);
export const CHAPTER_COPY = new RegExp(`^docs/${JOURNEY}(?:-${ID})?\\.md$`);
export const CHAPTER_PAGE = new RegExp(`^${JOURNEY}(?:-${ID})?\\.html$`);
export function chapterFiles(chapter, index) {
  const name = index === 0 ? JOURNEY : `${JOURNEY}-${chapter.id}`;
  return { page: `${name}.html`, copy: `docs/${name}.md` };
}
// The page of a text copy of a chapter, or null for another path.
export const chapterPageOf = (path) => (CHAPTER_COPY.test(path) ? `${path.slice("docs/".length, -".md".length)}.html` : null);
// The text copies of all chapters in words, as the item of the capture journey says it (the
// words that the user accepted). CHAPTER_COPY is the rule that matches them.
export const CAPTURE_JOURNEY_COPIES = "docs/capture-journey*.md";

// A list in a sentence: "a", "a and b", "a, b, and c".
export const wordList = (items) => (items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`);

// Read the stages of the capture journey's data file for a script that uses only some of their
// fields: the stages of all chapters, in order, each with the page of its chapter (page).
// readable checks the shape of those fields in one stage, and fields names them in the error.
// Return the stages, or record in errors what is wrong and return null.
export function readCaptureJourney(errors, fields, readable) {
  return readDocsFile(CAPTURE_JOURNEY_DATA, errors, (text) => {
    const data = parseJson(text);
    const valid = (c, i) => isObject(c) && (i === 0 || isText(c.id)) && Array.isArray(c.stages) && c.stages.every((s) => isObject(s) && readable(s));
    if (!isObject(data) || !Array.isArray(data.chapters) || !data.chapters.every(valid)) {
      throw new Error(`must have a list of chapters, each with a list of stages, each with ${fields}. Run: node .github/scripts/build-capture-journey.mjs --check`);
    }
    return data.chapters.flatMap((c, i) => c.stages.map((s) => ({ ...s, page: chapterFiles(c, i).page })));
  });
}

// Read the resources of the data file for a script that uses only some of their fields. readable
// checks the shape of those fields in one resource, and fields names them in the error. Return
// the resources, or record in errors what is wrong and return null.
export function readSharedResources(errors, fields, readable) {
  return readDocsFile(SHARED_RESOURCES_DATA, errors, (text) => {
    const data = parseJson(text);
    if (!isObject(data) || !Array.isArray(data.resources) || !data.resources.every((r) => isObject(r) && readable(r))) {
      throw new Error(`must have a list of resources, each with ${fields}. Run: node .github/scripts/build-shared-resources.mjs --check`);
    }
    return data.resources;
  });
}

// Read the graph of a repo (repos/<name>/knowledge-graph.json) and check the shape of the parts
// that the scripts read: a list of nodes, and the lists of edges, layers, and tour steps (each
// optional). Return the graph, or record in errors what is wrong and return null. A missing graph
// returns null with no error: loadEstate records it.
export function readGraph(name, errors) {
  const at = `repos/${name}/knowledge-graph.json`;
  if (!existsSync(join(root, at))) return null;
  // Wrap the value: readDocsFile returns null for an error, and the JSON text "null" is null too.
  const read = readDocsFile(at, errors, (text) => ({ graph: parseJson(text) }));
  if (read === null) return null;
  const { graph } = read;
  if (!isObject(graph)) return errors.push(`${at}: the graph must be a JSON object`), null;
  const problems = [];
  const parts = [["nodes", "node"], ["edges", "edge"], ["layers", "layer"], ["tour", "tour step"]];
  for (const [key, item] of parts) {
    const list = graph[key];
    if (list === undefined && key !== "nodes") continue;
    if (!Array.isArray(list)) {
      problems.push(`${key} must be a list`);
      continue;
    }
    list.forEach((v, i) => {
      if (!isObject(v)) problems.push(`${item} ${i} must be a JSON object`);
      else if ((key === "layers" || key === "tour") && !Array.isArray(v.nodeIds)) problems.push(`${item} ${i}: nodeIds must be a list`);
    });
  }
  for (const problem of problems) errors.push(`${at}: ${problem}`);
  return problems.length ? null : graph;
}

// The text after the description of a renamed repo in the README index and on the landing page:
// " Former name: `old`." code formats one name (Markdown or HTML). Empty without former names.
export function formerNamesText(formerNames, code) {
  if (!formerNames.length) return "";
  return ` Former name${formerNames.length > 1 ? "s" : ""}: ${formerNames.map(code).join(", ")}.`;
}

const occurrences = (text, marker) => text.split(marker).length - 1;

// A generated block: markers is { begin, end, what, optional }. begin and end are the marker
// lines; what names the block in errors ("estate index"); optional means that a file may lack
// the markers, and the caller then inserts the block.
export const markedBlock = ({ begin, end }, inner) => `${begin}\n\n${inner}\n\n${end}`;

// Find the marked block in the text of file at: { start, stop }, from the start of its BEGIN marker
// to the end of its END marker. If the markers are not one of each, in order, record an error and
// return undefined. If the text has neither marker and markers.optional is set, return null.
export function markedSpan(at, text, markers, errors) {
  const { begin, end, what, optional } = markers;
  const begins = occurrences(text, begin);
  const ends = occurrences(text, end);
  if (begins === 0 && ends === 0) {
    if (optional) return null;
    return void errors.push(`${at} lacks the BEGIN/END markers of the ${what}`);
  }
  if (begins !== 1 || ends !== 1) {
    return void errors.push(`${at}: ${begins} BEGIN and ${ends} END markers of the ${what}; expected one of each${optional ? ", or none" : ""}`);
  }
  const start = text.indexOf(begin);
  const stop = text.indexOf(end);
  if (stop < start) return void errors.push(`${at}: the END marker of the ${what} comes before its BEGIN marker`);
  return { start, stop: stop + end.length };
}

// Replace the marked block in the text of file at with inner. Return the new text. If the
// markers are not one of each, in order, record an error and return the text unchanged. If the
// text has neither marker and markers.optional is set, return null: the caller inserts the block.
export function replaceMarked(at, text, markers, inner, errors) {
  const span = markedSpan(at, text, markers, errors);
  if (span === null) return null;
  if (span === undefined) return text;
  return text.slice(0, span.start) + markedBlock(markers, inner) + text.slice(span.stop);
}

#!/usr/bin/env node
// Build the built text of the shared-resource page (docs/shared-resources.md) from
// shared-resources.json: the at-a-glance table at the top, and for each resource the uses table
// ("Code repos that use it") and the names table with the snapshot line. Each part sits between
// its BEGIN and END markers; the rest of the page is edited text.
// Each evidence entry of the data file proves one use of a resource by a code repo: the cited
// lines of a file in that repo, at the snapshot of the repo. The facts of each repo were checked
// at its snapshot (checkedAt), so a regeneration fails the check until a person checks them
// again. Only names of the known kinds go on the page, and no name with a dot (no host, no
// bucket). The ## heading above the blocks of a resource is its name, and its GitHub anchor is
// its id: the links from other pages use the id. The sections follow the order of the resources
// in the data file, as the per-repo READMEs list them. A resource with an empty evidence list (no
// evidence of a use by a code repo) has the count 0 in the at-a-glance table, no blocks, and one
// ## heading, its name, with its id as the anchor.
// Usage: node build-shared-resources.mjs              rewrite the built text
//        node build-shared-resources.mjs --check      exit 1 if the built text is stale (CI)
//        node build-shared-resources.mjs --evidence   exit 1 if a name is not in its cited lines
//          at the snapshot. It reads each cited file through the GitHub API (GITHUB_TOKEN, if
//          set). CI runs it only when shared-resources.json changes.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { EM_DASH, SHARED_RESOURCES_DATA as DATA, SHARED_RESOURCES_PAGE as PAGE, answerStatus, citedLines, escapeRegExp, expandRepoName, fencedLines, githubApi, isObject, isRepoPath, lineAnchor, linesLink, loadEstate, missingNames, parseJson, parseLines, plural, readDocsFile, replaceMarked, root } from "./estate.mjs";
import { slugger } from "./slug.mjs";

const SCRIPT = ".github/scripts/build-shared-resources.mjs";
const BUILT = `built by ${SCRIPT} from ${DATA}. Do not edit.`;
const GLANCE = {
  begin: `<!-- BEGIN shared resources at a glance: ${BUILT} -->`,
  end: "<!-- END shared resources at a glance -->",
  what: "at-a-glance table",
};
const PARTS = ["uses", "names"];
const markers = (id, part) => ({
  begin: `<!-- BEGIN shared resource ${id} ${part}: ${BUILT} -->`,
  end: `<!-- END shared resource ${id} ${part} -->`,
  what: `${part} block of ${id}`,
});

// The uses of a resource, in the order of the uses tables. "sign in" is one use.
const USES = ["push", "pull", "deploy", "route", "read", "write", "publish", "consume", "sign in"];
// The link text of an evidence link. "source file" is a file of the code (for example the config of
// the broker queues).
const LABELS = ["build workflow", "deploy workflow", "test workflow", "manifest", "Dockerfile", "Terraform", "Airflow DAG", "source file"];
// The kinds of names that a volunteer types, in the order of the names tables.
const KINDS = ["secret", "image", "schema", "overlay", "route", "queue", "realm"];
// A route is a path prefix that a code repo adds to the API gateway: the use "route" and the kind
// "route". It is "/" and one or more parts, each after a "/", with an optional "/" at the end.
// "/" alone is no route: the evidence check would find it in "rewrite: /" too.
const ROUTE = /^(\/[A-Za-z0-9_-]+)+\/?$/;

const mode = process.argv.includes("--evidence") ? "evidence" : process.argv.includes("--check") ? "check" : "write";
const { estate, repos, errors } = loadEstate();
const codeRepos = new Map(repos.filter((r) => !r.docs).map((r) => [r.name, r]));

// The cited lines of each evidence entry, { first, last }, parsed once by validData.
const rangeOf = new Map();

// Check shared-resources.json in both directions, and return it only if it is valid: each
// evidence entry names a code repo, a known use and label, a path in the repo, its lines, and at
// least one name of a known kind; checkedAt lists each repo of the evidence, and only those, at
// its current snapshot.
function validData(data) {
  if (data === null) return null; // readDocsFile recorded the error
  const before = errors.length;
  const fail = (message) => errors.push(`${DATA}: ${message}`);
  if (!isObject(data) || !isObject(data.checkedAt) || !Array.isArray(data.resources) || !data.resources.length) {
    fail("must be an object with checkedAt (an object) and resources (a list with at least one resource)");
    return null;
  }
  const ids = new Set();
  const evidenceRepos = new Set();
  data.resources.forEach((resource, i) => {
    const at = `resource ${i + 1}`;
    if (!isObject(resource)) return fail(`${at} must be an object`);
    const { id, evidence } = resource;
    if (typeof id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) fail(`${at}: the id ${JSON.stringify(id)} must be lowercase words joined by "-"`);
    else if (ids.has(id)) fail(`${at}: the id ${id} is used twice`);
    ids.add(id);
    if (typeof resource.name !== "string" || !resource.name.trim() || resource.name.includes(EM_DASH)) fail(`${at}: the name must be set, with no em dash`);
    if (!Array.isArray(evidence)) return fail(`${at}: evidence must be a list (an empty list: no evidence of a use by a code repo)`);
    evidence.forEach((e, j) => {
      const where = `${typeof id === "string" ? id : at}, evidence ${j + 1}`;
      if (!isObject(e)) return fail(`${where} must be an object`);
      if (!codeRepos.has(e.repo)) fail(`${where}: ${e.repo} is not a code repo of estate.json`);
      else evidenceRepos.add(e.repo);
      if (!USES.includes(e.use)) fail(`${where}: unknown use ${JSON.stringify(e.use)} (use one of: ${USES.join(", ")})`);
      if (!LABELS.includes(e.label)) fail(`${where}: unknown label ${JSON.stringify(e.label)} (use one of: ${LABELS.join(", ")})`);
      if (!isRepoPath(e.path)) fail(`${where}: the path ${JSON.stringify(e.path)} must be a path in the repo`);
      const range = parseLines(e.lines);
      if (!range) fail(`${where}: lines must be "<n>" or "<first>-<last>", with 1 <= first < last; it is ${JSON.stringify(e.lines)}`);
      else rangeOf.set(e, range);
      if (!Array.isArray(e.names) || !e.names.length) return fail(`${where}: names must be a list with at least one name`);
      for (const typed of e.names) {
        if (!KINDS.includes(typed?.kind)) fail(`${where}: unknown kind ${JSON.stringify(typed?.kind)} (use one of: ${KINDS.join(", ")})`);
        if (typeof typed?.name !== "string") fail(`${where}: each name must be a text`);
        else if (typed.name.includes(".")) fail(`${where}: the name ${JSON.stringify(typed.name)} has a dot: a host or a bucket name must not go on the page`);
        else if (!/^[A-Za-z0-9_/-]+$/.test(typed.name)) fail(`${where}: the name ${JSON.stringify(typed.name)} may hold only letters, digits, "_", "-", and "/"`);
        else if (typed.kind === "route" && !ROUTE.test(typed.name)) {
          fail(`${where}: the route ${JSON.stringify(typed.name)} must be "/" and one or more parts of letters, digits, "_", and "-", each after a "/" (for example /query/ or /wallet/v2/)`);
        }
      }
      // The use "route" and the kind "route" go together: the evidence of a route proves the route.
      const routes = e.names.filter((typed) => typed?.kind === "route");
      if (e.use === "route" && !routes.length) fail(`${where}: an entry with the use "route" must name a route`);
      if (e.use !== "route") for (const typed of routes) fail(`${where}: the route ${JSON.stringify(typed.name)} may stand only on an entry with the use "route"`);
    });
  });
  for (const [repo, checked] of Object.entries(data.checkedAt)) {
    if (!evidenceRepos.has(repo)) fail(`checkedAt.${repo} is in no evidence entry: remove it`);
    // A short commit, as in ecosystem.json: a full one looks like a key to the secret scanners.
    else if (typeof checked !== "string" || !/^[0-9a-f]{7}$/.test(checked)) fail(`checkedAt.${repo} must be the first 7 characters of a commit`);
    else if (!codeRepos.get(repo).sha.startsWith(checked)) {
      const snapshot = codeRepos.get(repo).sha.slice(0, 7);
      fail(`checkedAt.${repo} is ${checked}, but repos/${repo}/meta.json is ${snapshot}: check the facts of ${repo} again, then update checkedAt`);
    }
  }
  for (const repo of evidenceRepos) if (!(repo in data.checkedAt)) fail(`checkedAt.${repo} is missing`);
  return errors.length > before ? null : data;
}

const data = validData(readDocsFile(DATA, errors, parseJson));

// Alphabetical order by code units (ticket 05, Answer 8), so the order does not depend on the
// locale data of Node.
const byCodeUnits = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const reposOf = (resource) => [...new Set(resource.evidence.map((e) => e.repo))].sort(byCodeUnits);
const usesOf = (resource, repo) => USES.filter((u) => resource.evidence.some((e) => e.repo === repo && e.use === u));
// A use as Markdown for the tables: a no-break space keeps the words of "sign in" on one line in a
// narrow cell.
const markdownUse = (use) => use.replaceAll(" ", "&nbsp;");

// The uses table: one row per code repo, in the order of the alphabet. Each evidence link goes to
// the file at the checked commit, with its lines. When a label shows more than once in a row, each
// of its links gets a number ("Dockerfile 1", "Dockerfile 2"), so each link text in a row is unique.
// A no-break space keeps the number on the line of its label in a narrow cell.
function usesTable(resource) {
  const rows = reposOf(resource).map((repo) => {
    const entries = resource.evidence.filter((e) => e.repo === repo);
    const seen = new Map();
    const links = entries.map((e) => {
      const repeats = entries.filter((other) => other.label === e.label).length;
      seen.set(e.label, (seen.get(e.label) ?? 0) + 1);
      const text = repeats > 1 ? `${e.label}&nbsp;${seen.get(e.label)}` : e.label;
      return `[${text}](${linesLink(estate.sourceOrg, repo, data.checkedAt[repo], e.path, rangeOf.get(e))})`;
    });
    return `| ${repo} | ${usesOf(resource, repo).map(markdownUse).join(", ")} | ${links.join(", ")} |`;
  });
  return ["| Code repo | Use | Evidence |", "|---|---|---|", ...rows].join("\n");
}

// The names table (each name once: the kinds in their order, the names of a kind in the order of
// the alphabet), and the line with the first and last snapshot dates of the repos.
function namesBlock(resource) {
  const unique = new Map(resource.evidence.flatMap((e) => e.names).map((typed) => [`${typed.kind} ${typed.name}`, typed]));
  const rows = [...unique.values()]
    .sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || byCodeUnits(a.name, b.name))
    .map((typed) => `| ${typed.kind[0].toUpperCase()}${typed.kind.slice(1)} | \`${typed.name}\` |`);
  const dates = reposOf(resource).map((repo) => codeRepos.get(repo).date).sort(byCodeUnits);
  const when = dates[0] === dates.at(-1) ? dates[0] : `${dates[0]} to ${dates.at(-1)}`;
  return ["| Kind | Name |", "|---|---|", ...rows, "", `Each fact was checked at the snapshot of its code repo (generated ${when}).`].join("\n");
}

// The at-a-glance table: each resource (a link to its section), the count of code repos that use
// it, and the count of each use. A resource with no evidence has the count 0.
function glanceTable() {
  const rows = data.resources.map((resource) => {
    const repoList = reposOf(resource);
    const useCounts = USES.map((u) => [u, repoList.filter((repo) => usesOf(resource, repo).includes(u)).length])
      .filter(([, n]) => n)
      .map(([u, n]) => `${n} ${markdownUse(u)}`);
    return `| [${resource.name}](#${resource.id}) | ${repoList.length ? `${repoList.length} (${useCounts.join(", ")})` : "0"} |`;
  });
  return ["| Resource | Code repos that use it |", "|---|---|", ...rows].join("\n");
}

// The text of a heading as GitHub and render-md.mjs show it, for its anchor: a link shows its
// text; code marks and emphasis marks do not show.
const shownText = (markdown) =>
  markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/(^|[^\p{L}\p{N}])_+|_+(?=[^\p{L}\p{N}]|$)/gu, "$1");

// The headings of the page, in order, with their GitHub anchors, as a reader sees them: an ATX
// heading ("## Text"), or a setext heading (a paragraph, then a line of "=" or "-"). Headings in
// fenced code do not count. A list item, a quote, or an HTML block ends a paragraph, so a "---"
// line after one of them (or after a blank line) is not an underline. Every heading gets its
// anchor in order, so a repeat gets "-1".
// Returns the headings in order: { offset, level, text, anchor }.
function headingsOf(page) {
  const slug = slugger();
  const pageLines = page.split("\n");
  const fenced = fencedLines(pageLines);
  const headings = [];
  let paragraph = null; // { offset, text } of the paragraph that the next line can underline
  let offset = 0;
  pageLines.forEach((line, i) => {
    const atx = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/);
    const underline = line.match(/^ {0,3}(=+|-+)[ \t]*$/);
    if (fenced[i] || !line.trim()) paragraph = null;
    else if (atx) {
      headings.push({ offset, level: atx[1].length, text: atx[2] ?? "" });
      paragraph = null;
    } else if (underline && paragraph) {
      headings.push({ offset: paragraph.offset, level: underline[1][0] === "=" ? 1 : 2, text: paragraph.text });
      paragraph = null;
    } else if (/^ {0,3}(?:[-*+](?:[ \t]|$)|\d+[.)](?:[ \t]|$)|>|<)/.test(line)) paragraph = null;
    else if (paragraph) paragraph.text += ` ${line.trim()}`;
    else if (/^ {4}/.test(line)) paragraph = null;
    else paragraph = { offset, text: line.trim() };
    offset += line.length + 1;
  });
  for (const h of headings) h.anchor = slug(shownText(h.text));
  return headings;
}

// The page with its built text, or the page unchanged if a part fails.
function buildPage(page) {
  const fail = (message) => errors.push(`${PAGE}${message}`);
  if (page.includes("\r")) {
    fail(" has CRLF line ends; use LF (.gitattributes asks git for LF)");
    return page;
  }
  const pageLines = page.split("\n");
  const fenced = fencedLines(pageLines);
  pageLines.forEach((line, i) => {
    if (!fenced[i] && line.includes(EM_DASH)) fail(`:${i + 1}: an em dash; use a colon, a comma, or two sentences`);
  });
  if (!data) return page;
  const ids = new Set(data.resources.map((r) => r.id));
  for (const [, id, part] of page.matchAll(/<!-- BEGIN shared resource (\S+) (uses|names):/g)) {
    if (!ids.has(id)) fail(` has a ${part} block for "${id}", which is not a resource in ${DATA}`);
  }
  const sectionHeadings = headingsOf(page).filter((h) => h.level === 2);
  const headingAbove = (position) => sectionHeadings.filter((h) => h.offset < position).at(-1);
  // The ## heading of a section is the name of its resource, with the id as its anchor.
  const checkHeading = (heading, resource, what) => {
    if (heading.text !== resource.name) fail(`: ${what} is "${heading.text}", but its name in ${DATA} is "${resource.name}"`);
    if (heading.anchor !== resource.id) fail(`: ${what} has the anchor #${heading.anchor}, but the id is ${resource.id}: the links from other pages use the id`);
  };
  const sectionAt = new Map(); // id -> the offset of the ## heading of its section
  let next = replaceMarked(PAGE, page, GLANCE, glanceTable(), errors);
  for (const resource of data.resources) {
    // A resource with no evidence has no built tables, and one ## heading with its name: the
    // at-a-glance table links to it. A marker counts with any text after its part.
    if (!resource.evidence.length) {
      for (const part of PARTS) {
        if (new RegExp(`<!-- (?:BEGIN|END) shared resource ${escapeRegExp(resource.id)} ${part}(?=[:\\s])`).test(page)) {
          fail(` has a ${part} block for ${resource.id}, but ${resource.id} has no evidence: remove the block`);
        }
      }
      const named = sectionHeadings.filter((h) => h.text === resource.name);
      if (!named.length) {
        fail(` has no ## heading "${resource.name}" with the anchor #${resource.id}: the at-a-glance table and the links from other pages use the id`);
      } else if (named.length > 1) {
        fail(` has ${named.length} ## headings "${resource.name}": ${resource.id} has one section`);
      } else {
        checkHeading(named[0], resource, `the ## heading of ${resource.id}`);
        sectionAt.set(resource.id, named[0].offset);
      }
      continue;
    }
    for (const part of PARTS) {
      const m = markers(resource.id, part);
      const before = errors.length;
      next = replaceMarked(PAGE, next, m, part === "uses" ? usesTable(resource) : namesBlock(resource), errors);
      if (errors.length > before) continue;
      const heading = headingAbove(page.indexOf(m.begin));
      if (!heading) fail(`: the ${m.what} has no ## heading above it`);
      else {
        checkHeading(heading, resource, `the ## heading above the ${m.what}`);
        if (!sectionAt.has(resource.id)) sectionAt.set(resource.id, heading.offset);
      }
    }
  }
  // The sections follow the order of the data file: the per-repo READMEs list them in that order.
  const placed = data.resources.filter((r) => sectionAt.has(r.id));
  placed.forEach((resource, i) => {
    const previous = placed[i - 1];
    if (previous && sectionAt.get(resource.id) < sectionAt.get(previous.id)) {
      fail(`: the section of ${resource.id} comes before the section of ${previous.id}, but ${DATA} lists ${previous.id} first: put the sections in the order of the data file`);
    }
  });
  return next;
}

// Read each cited file at the snapshot of its repo, once, and check that each name of each
// evidence entry is in the cited lines, by the name rule of estate.mjs (missingNames).
async function checkEvidence() {
  const api = githubApi(estate.sourceOrg, process.env.GITHUB_TOKEN);
  const files = new Set(); // "<repo>@<sha>:<path>"
  let names = 0;
  for (const resource of data.resources) {
    for (const [j, e] of resource.evidence.entries()) {
      const range = rangeOf.get(e);
      const sha = codeRepos.get(e.repo).sha;
      const where = `${resource.id}, evidence ${j + 1} (${e.repo} ${e.path}${lineAnchor(range)} at ${data.checkedAt[e.repo]})`;
      files.add(`${e.repo}@${sha}:${e.path}`);
      const file = await api.file(e.repo, e.path, sha);
      if (file.body === undefined) {
        errors.push(`${where}: the file is not in the repo at the snapshot (${answerStatus(file)})`);
        continue;
      }
      const cited = citedLines(file.body, range);
      if (cited.text === undefined) {
        errors.push(`${where}: the file has ${cited.count} lines`);
        continue;
      }
      names += e.names.length;
      const missing = missingNames(expandRepoName(cited.text, e.repo), e.names.map((typed) => typed.name));
      for (const name of missing) errors.push(`${where}: ${name} is not in the cited lines`);
    }
  }
  return { entries: data.resources.flatMap((r) => r.evidence).length, names, files: files.size };
}

if (mode === "evidence") {
  const checked = errors.length ? null : await checkEvidence();
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    process.exit(1);
  }
  const files = checked.files === 1 ? "1 file at its snapshot" : `${checked.files} files at their snapshots`;
  console.log(`each name is in its cited lines (${plural(checked.entries, "evidence entry", "evidence entries")}, ${plural(checked.names, "name", "names")}, ${files})`);
  process.exit(0);
}

const page = readDocsFile(PAGE, errors);
const next = page === null ? null : buildPage(page);

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

const summary = `${plural(data.resources.length, "resource", "resources")}, ${plural(data.resources.flatMap((r) => r.evidence).length, "evidence entry", "evidence entries")}`;
if (mode === "check") {
  if (next !== page) {
    console.error(`error: the built text of ${PAGE} is stale. Run: node ${SCRIPT}`);
    process.exit(1);
  }
  console.log(`the built text of ${PAGE} is current (${summary})`);
} else {
  writeFileSync(join(root, PAGE), next);
  console.log(`wrote the built text of ${PAGE} (${summary})`);
}

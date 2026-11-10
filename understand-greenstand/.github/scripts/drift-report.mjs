#!/usr/bin/env node
// Report the drift of each source repo since its snapshot, and say which repos are due.
// Usage: node drift-report.mjs               print the report
//        node drift-report.mjs --sync-issue  also open, edit, or close the "Understand Greenstand:
//                                            Docs drift report"
//                                            issue in $GITHUB_REPOSITORY (CI)
// Reads the snapshots through estate.mjs and the described files from each knowledge-graph.json,
// and asks the GitHub compare API what changed since. It also reads each file that
// shared-resources.json or capture-journey.json cites, on the default branch, and lists the facts
// that are gone: the shared-resource facts and the capture journey facts. The capture journey can
// cite a repo outside the estate. It also asks for the last commit that changed the roadmap
// (roadmap.json: Roadmap.md of Greenstand-Overview) on the default branch, and lists a roadmap
// change when that commit is not the snapshot of the roadmap page. Set GITHUB_TOKEN for the
// 5000/hour API limit: a run makes about 2 requests per source repo, 1 per repo outside the estate,
// 1 per cited file, and 1 for the roadmap, and the anonymous limit is 60/hour.
// The report is public (job summary, log, issue). It shows repo names, counts, compare links, the
// names that the shared-resource page and the capture journey show, and the files that they link:
// commit messages and other file paths of a source repo can mirror a private repo name. In GitHub
// Actions the shared private-name check (private-names.sh) reads the whole text before any of it
// is printed or posted.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURE_JOURNEY_DATA, ROADMAP_DATA, SHARED_RESOURCES_DATA, docsBlobUrl, expandRepoName, hasWholeName, isObject, isText, loadEstate, parseJson, plural, readCaptureJourney, readDocsFile, root, urlPath } from "./estate.mjs";

// A repo is due when any described file was removed or renamed. It is also due when at least
// DUE_MIN_FILES described files changed, and they are at least DUE_PERCENT% of its described
// files. New files do not count: they are often tests.
const DUE_PERCENT = 5;
// Without the minimum, 1 changed file can make a small repo due (1 of 15 is 6.7%).
const DUE_MIN_FILES = 2;
// The compare API lists at most 300 changed files.
const MAX_FILES = 300;
// The issue lives in the docs repo with the issues of other Greenstand teams: the title has our
// prefix, and the issue has our label (the label of our issue forms in .github/ISSUE_TEMPLATE/).
const TITLE = "Understand Greenstand: Docs drift report";
const ISSUE_LABEL = "understand-greenstand";
// The first line of the issue body. It records the due repos and the gone facts of the last run, so
// the next run can say what changed: "<!-- drift-report due: <repo> ... facts: <hash> ... journey:
// <hash> ... roadmap: <commit> -->". "facts:" holds the shared-resource facts, "journey:" the
// capture journey facts, and "roadmap:" the short commit of the last change of the roadmap when it
// is not the snapshot. A part with no gone fact is not on the line.
const MARKER = "<!-- drift-report due:";
// GitHub refuses an issue body of more than 65536 characters.
const MAX_BODY = 65536;

const syncIssue = process.argv.includes("--sync-issue");
// issueRepo: the repo of the run (CI), where the issue lives. The links to the docs come from estate.json.
const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: issueRepo, GITHUB_STEP_SUMMARY: summaryFile } = process.env;
// In GitHub Actions every output is public. A source repo that is not found may be private now,
// so its name is shown only outside Actions.
const inActions = process.env.GITHUB_ACTIONS === "true";

const { estate, repos, errors } = loadEstate();
const sharedResources = readDocsFile(SHARED_RESOURCES_DATA, errors, parseJson);
// The report reads only the stages of all chapters and their evidence: the full check is
// build-capture-journey.mjs.
const evidenceOk = (e) => isObject(e) && isText(e.repo) && isText(e.path) && isText(e.commit) && Array.isArray(e.names) && e.names.every(isText);
const stages = readCaptureJourney(errors, "an id, a short title, and evidence entries (a repo, a path, a commit, and names)", (s) =>
  isText(s.id) && isText(s.short) && Array.isArray(s.evidence) && s.evidence.every(evidenceOk),
);
// The report reads only the snapshot of the roadmap: the full check is build-roadmap.mjs.
const roadmap = readDocsFile(ROADMAP_DATA, errors, (text) => {
  const source = parseJson(text)?.source;
  if (!isObject(source) || !isText(source.repo) || !isText(source.path) || !/^[0-9a-f]{40}$/.test(source.commit ?? "")) {
    throw new Error("must have a source with a repo, a path, and a full commit. Run: node .github/scripts/build-roadmap.mjs --check");
  }
  return source;
});
if (errors.length) fail(errors);
// The issue belongs to github-actions: a local sync would open a second one under your name.
if (syncIssue && !inActions) fail(["--sync-issue runs only in GitHub Actions"]);
if (syncIssue && !(token && issueRepo)) fail(["--sync-issue needs GITHUB_TOKEN and GITHUB_REPOSITORY"]);

function fail(lines) {
  for (const line of lines) console.error(`error: ${line}`);
  process.exit(1);
}

// Returns the answer, or null for a 404. Retries a 5xx or a rate limit twice.
async function request(method, path, { body, accept = "application/vnd.github+json" } = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        accept,
        "x-github-api-version": "2022-11-28",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: body && JSON.stringify(body),
    });
    if (res.ok) return res;
    if (res.status === 404) return null;
    if (attempt < 3 && (res.status >= 500 || res.status === 429)) {
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      continue;
    }
    throw new Error(`GitHub API ${method} ${path.split("?")[0]}: HTTP ${res.status}`);
  }
}

// The parsed JSON of an answer, or null for a 404.
async function api(method, path, body) {
  const res = await request(method, path, { body });
  return res && res.json();
}

// The text of a file of a source repo on a branch, or null when the file is not there.
async function fileText(repo, path, branch) {
  const res = await request("GET", `/repos/${estate.sourceOrg}/${repo}/contents/${urlPath(path)}?ref=${encodeURIComponent(branch)}`, {
    accept: "application/vnd.github.raw",
  });
  return res && res.text();
}

// The files that have a node in the repo's graph.
function describedFiles(name) {
  const graph = JSON.parse(readFileSync(join(root, "repos", name, "knowledge-graph.json"), "utf8"));
  return new Set(graph.nodes.map((n) => n.filePath).filter(Boolean));
}

async function measure({ name, sha, date }) {
  const base = { name, sha, date };
  const repo = await api("GET", `/repos/${estate.sourceOrg}/${name}`);
  if (!repo) return { ...base, missing: true };
  const branch = repo.default_branch;
  const found = { ...base, branch };
  const compareUrl = `https://github.com/${estate.sourceOrg}/${name}/compare/${sha}...${branch}`;
  const cmp = await api("GET", `/repos/${estate.sourceOrg}/${name}/compare/${sha}...${encodeURIComponent(branch)}?per_page=1`);
  if (!cmp) return { ...found, compareUrl, broken: "the snapshot commit was not found" };
  if (cmp.status === "behind" || cmp.status === "diverged") {
    return { ...found, compareUrl, broken: `the snapshot is not on the default branch (${branch})` };
  }

  const described = describedFiles(name);
  let changed = 0, removed = 0, added = 0;
  for (const f of cmp.files ?? []) {
    if (f.status === "added" || f.status === "copied") added++;
    const old = f.previous_filename ?? f.filename;
    if (f.status === "added" || f.status === "copied" || !described.has(old)) continue;
    changed++;
    if (f.status === "removed" || f.status === "renamed") removed++;
  }
  const files = cmp.files?.length ?? 0;
  const percent = described.size ? (100 * changed) / described.size : 0;
  return {
    ...found, compareUrl, commits: cmp.ahead_by, files, truncated: files >= MAX_FILES,
    described: described.size, changed, removed, added, percent,
  };
}

// A fact is a name with the file that cites it. Each page with facts has its own section in the
// report and its own label in the issue marker. The short hash of a fact goes into the marker.
const hashOf = (key) => createHash("sha256").update(key).digest("hex").slice(0, 7);
function factsOf(entries) {
  const facts = new Map();
  for (const fact of entries) if (!facts.has(fact.key)) facts.set(fact.key, { ...fact, hash: hashOf(fact.key) });
  return [...facts.values()];
}

// The shared-resource facts: each name of shared-resources.json with the resource and the file
// that cite it, once, in the order of the data file.
const sharedFacts = factsOf(
  sharedResources.resources.flatMap((resource) =>
    resource.evidence.flatMap(({ repo, path, names }) =>
      names.map(({ kind, name }) => ({ key: [resource.id, repo, path, kind, name].join("\n"), resource, repo, path, kind, name })),
    ),
  ),
);

// The capture journey facts: each name of capture-journey.json with the stage and the file that
// cite it, once, in the order of the data file. Its repo can be outside the estate. The key starts
// with the data file, so that no journey fact has the hash of a shared-resource fact.
const journeyFacts = factsOf(
  stages.flatMap((stage) =>
    stage.evidence.flatMap(({ repo, path, commit, names }) =>
      names.map((name) => ({ key: [CAPTURE_JOURNEY_DATA, stage.id, repo, path, name].join("\n"), stage, repo, path, commit, name })),
    ),
  ),
);

// The repos outside the estate that the capture journey cites: only their default branch is read.
const estateNames = new Set(repos.map((r) => r.name));
const outsideNames = [...new Set(journeyFacts.map((f) => f.repo).filter((name) => !estateNames.has(name)))];
async function lookUp(name) {
  const repo = await api("GET", `/repos/${estate.sourceOrg}/${name}`);
  return repo ? { name, branch: repo.default_branch } : { name, missing: true };
}

// A fact is gone when its file on the default branch does not hold the name, or is not there. A
// gone fact does not make a repo due. The facts of a repo that is not found are not read: the "Not
// found" section covers that repo, without its name. Each file is read once for all facts.
const files = new Map(); // "<repo>\n<path>" -> a promise of the text of the file, or of null
async function goneFacts({ facts, holds }, found) {
  const gone = [];
  for (const fact of facts) {
    const source = found.get(fact.repo);
    if (!source) continue;
    const key = `${fact.repo}\n${fact.path}`;
    if (!files.has(key)) files.set(key, fileText(fact.repo, fact.path, source.branch));
    const text = await files.get(key);
    if (text === null) gone.push({ ...fact, source, fileGone: true });
    else if (!holds(text, fact)) gone.push({ ...fact, source });
  }
  return gone;
}

const fileLink = (f, ref) => `[\`${f.path}\`](https://github.com/${estate.sourceOrg}/${f.repo}/blob/${ref}/${urlPath(f.path)})`;

// The roadmap: one fact, the snapshot of the roadmap page. Its file is not read: a request asks for
// the last commit that changed the file on the default branch. When that commit is another commit,
// the roadmap changed: the gone item has that short commit as its hash, so a newer change is a new
// item. While the repo is not found, the change of the last run stays on the list.
const roadmapFact = { key: [ROADMAP_DATA, roadmap.repo, roadmap.path, roadmap.commit].join("\n"), repo: roadmap.repo };
async function roadmapChange(found) {
  const source = found.get(roadmap.repo);
  if (!source) return [];
  const commits = await api("GET", `/repos/${estate.sourceOrg}/${roadmap.repo}/commits?path=${encodeURIComponent(roadmap.path)}&sha=${encodeURIComponent(source.branch)}&per_page=1`);
  const head = commits?.[0]?.sha;
  if (!head) throw new Error(`the commits of ${roadmap.path} in ${roadmap.repo} were not found`);
  return head === roadmap.commit ? [] : [{ ...roadmapFact, head, hash: head.slice(0, 7) }];
}

// The sections of facts, in the order of the report. holds is the name rule of the evidence check
// of the page: build-shared-resources.mjs counts the repo name expression of a workflow as the
// repo name, and build-capture-journey.mjs does not. A gone fact links its file on the default
// branch. When the file is not there, a shared-resource fact links it at the snapshot (with the
// short commit, as the links of the page do), and a capture journey fact at the commit that it
// cites. A run adds the gone facts (gone) and the facts that it could not read (unread). A section
// can find its gone facts in its own way (goneOf), keep the facts of the last run while its repo is
// not found (keepUnread), and have its own words for no gone fact (none) and for an unread repo
// (unreadText).
const SECTIONS = [
  {
    heading: "Shared-resource facts to check",
    label: "facts:",
    term: "shared-resource fact",
    facts: sharedFacts,
    holds: (text, f) => hasWholeName(expandRepoName(text, f.repo), f.name),
    intro: () =>
      `A shared-resource fact is a name on the [shared-resource page](${doc("docs/shared-resources.md")}) and the file of a ` +
      "code repo that cites it. A fact is gone when that file on the default branch does not hold the name, or is not " +
      "there. A gone fact does not make a repo due. It leaves this list when the name comes back, or when you regenerate " +
      `the repo and [check its facts again](${doc("docs/regenerating.md#notes")}).`,
    unreadRepos: (n) => (n === 1 ? "the source repo" : `${n} source repos`),
    item: (f) => {
      const resource = `**[${f.resource.name}](${doc(`docs/shared-resources.md#${f.resource.id}`)})**`;
      return f.fileGone
        ? `- ${resource}: the file of the ${f.kind} \`${f.name}\` is not on the default branch (${f.source.branch}).\\\n  ${f.repo} ${fileLink(f, f.source.sha.slice(0, 7))} at the snapshot`
        : `- ${resource}: the ${f.kind} \`${f.name}\` is not in the file.\\\n  ${f.repo} ${fileLink(f, f.source.branch)}`;
    },
  },
  {
    heading: "Capture journey facts to check",
    label: "journey:",
    term: "capture journey fact",
    facts: journeyFacts,
    holds: (text, f) => hasWholeName(text, f.name),
    intro: () =>
      `A capture journey fact is a name in an evidence entry of [the capture journey](${estate.siteUrl}capture-journey.html) and ` +
      "the file of a repo that cites it. The repo can be outside the estate. A fact is gone when that file on the default " +
      "branch does not hold the name, or is not there. A gone fact does not make a repo due. It leaves this list when the " +
      `name comes back, or when you [check the stage again](${doc("docs/regenerating.md#the-drift-report")}) and update its evidence.`,
    unreadRepos: (n) => (n === 1 ? "their repo" : `${n} repos`),
    item: (f) => {
      // The stage on the page of its chapter (readCaptureJourney gives the page).
      const stage = `**[${f.stage.short}](${estate.siteUrl}${f.stage.page}#${f.stage.id})**`;
      return f.fileGone
        ? `- ${stage}: the file of the name \`${f.name}\` is not on the default branch (${f.source.branch}).\\\n  ${f.repo} ${fileLink(f, f.commit)} at the cited commit`
        : `- ${stage}: the name \`${f.name}\` is not in the file.\\\n  ${f.repo} ${fileLink(f, f.source.branch)}`;
    },
  },
  {
    heading: "Roadmap to check",
    label: "roadmap:",
    term: "roadmap change",
    facts: [roadmapFact],
    goneOf: roadmapChange,
    keepUnread: true,
    none: "The roadmap is current.",
    intro: () =>
      `The [roadmap page](${estate.siteUrl}roadmap.html) copies \`${roadmap.path}\` of ${roadmap.repo} at a snapshot: the last commit ` +
      "that changed the file. The roadmap changed when the last commit that changes the file on the default branch is " +
      `another commit. It leaves this list when you [move the snapshot](${doc("docs/regenerating.md#move-the-roadmap-snapshot")}).`,
    unreadText: () => "The report did not check the roadmap, because it could not read its repo (see \"Not found\" below).",
    item: (f) =>
      `- **[The Greenstand roadmap](${estate.siteUrl}roadmap.html)**: \`${roadmap.path}\` changed after the snapshot \`${roadmap.commit.slice(0, 7)}\`: its last change is \`${f.head.slice(0, 7)}\`.\\\n` +
      `  ${f.repo} [Compare](https://github.com/${estate.sourceOrg}/${f.repo}/compare/${roadmap.commit}...${f.head})`,
  },
];
function reasons(r) {
  if (r.broken) return [r.broken];
  const out = [];
  if (r.removed) out.push(`${plural(r.removed, "described file")} removed or renamed`);
  // Round down, so that a repo below DUE_PERCENT never shows DUE_PERCENT or more: 22 of 444
  // (4.955%) shows "4.9%", not "5.0%".
  out.push(`${r.changed} of ${r.described} described files changed (${(Math.floor(r.percent * 10) / 10).toFixed(1)}%)`);
  if (r.truncated) out.push(`the compare API lists only ${MAX_FILES} changed files, so the counts are a minimum`);
  return out;
}

function item(r) {
  const snapshot = `snapshot \`${r.sha.slice(0, 7)}\` (${r.date})`;
  const context = r.broken
    ? `The ${snapshot}. [Compare](${r.compareUrl})`
    : `Since the ${snapshot}: ${plural(r.commits, "commit")}, ${r.truncated ? `${MAX_FILES} or more files` : plural(r.files, "file")} changed, ${plural(r.added, "new file")}. [Compare](${r.compareUrl})`;
  return `- **${r.name}**: ${reasons(r).join("; ")}.\\\n  ${context}`;
}

let results, outsideRepos;
try {
  [results, outsideRepos] = await Promise.all([Promise.all(repos.map(measure)), Promise.all(outsideNames.map(lookUp))]);
  const found = new Map([...results, ...outsideRepos].filter((r) => !r.missing).map((r) => [r.name, r]));
  for (const section of SECTIONS) section.gone = section.goneOf ? await section.goneOf(found) : await goneFacts(section, found);
} catch (e) {
  fail([e.message, "no issue was changed"]);
}

const missing = results.filter((r) => r.missing);
const outsideMissing = outsideRepos.filter((r) => r.missing);
const missingNames = new Set([...missing, ...outsideMissing].map((r) => r.name));
for (const section of SECTIONS) section.unread = section.facts.filter((f) => missingNames.has(f.repo));
// The repos that could not be read, counted by kind: "1 source repo", "2 repos outside the estate".
const notFoundCounts = [
  missing.length && plural(missing.length, "source repo"),
  outsideMissing.length && plural(outsideMissing.length, "repo outside the estate", "repos outside the estate"),
].filter(Boolean);
const measured = results.filter((r) => !r.missing);
const isDue = (r) =>
  r.broken || r.removed > 0 || (r.percent >= DUE_PERCENT && r.changed >= DUE_MIN_FILES) || r.truncated;
const severity = (r) => (r.broken ? Infinity : r.percent);
const bySeverity = (a, b) => severity(b) - severity(a) || a.name.localeCompare(b.name);
const due = measured.filter(isDue).sort(bySeverity);
const quiet = measured.filter((r) => !isDue(r) && r.commits === 0).sort((a, b) => a.name.localeCompare(b.name));
const notDue = measured.filter((r) => !isDue(r) && r.commits > 0).sort(bySeverity);

// A link to a doc of this repo. The issue needs an absolute URL; a local run gets the path.
const doc = (path) => (issueRepo ? docsBlobUrl(estate, "HEAD", path) : path);
const now = new Date().toISOString().replace("T", " ").slice(0, 16);


// The report with the first `shown[i]` gone facts of each section. Only the issue shows fewer than
// all: the others are in the job summary of the run.
function reportOf(shown) {
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${issueRepo}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const lines = [
    `Report of ${now} UTC, for ${plural(results.length, "source repo")}. Drift is the change in a ` +
      "source repo since the snapshot that its docs describe. A described file is a file with a " +
      "node in the repo's graph. A repo is **due** when any described file was removed or renamed. " +
      `It is also due when at least ${DUE_MIN_FILES} described files changed, and they are at least ` +
      `${DUE_PERCENT}% of its described files. New files do not count. ` +
      `See [When to regenerate](${doc("docs/regenerating.md#when-to-regenerate")}).`,
    "",
    `### Due (${due.length})`,
    "",
    ...(due.length ? due.map(item) : ["No repo is due."]),
    "",
    `### Not due (${notDue.length + quiet.length})`,
    "",
    ...notDue.map(item),
    ...(quiet.length ? [`- No drift: ${quiet.map((r) => r.name).join(", ")}.`] : []),
  ];
  SECTIONS.forEach((section, i) => {
    const unreadRepos = new Set(section.unread.map((f) => f.repo)).size;
    lines.push(
      "",
      `### ${section.heading} (${section.gone.length})`,
      "",
      section.intro(),
      "",
      ...(section.gone.length ? section.gone.slice(0, shown[i]).map(section.item) : [section.none ?? "No fact is gone."]),
      ...(shown[i] < section.gone.length ? [`- And ${plural(section.gone.length - shown[i], "more fact")}: see the [job summary of this run](${runUrl}).`] : []),
      ...(section.unread.length
        ? ["", section.unreadText?.() ?? `The report did not check ${plural(section.unread.length, "fact")}, because it could not read ${section.unreadRepos(unreadRepos)} (see "Not found" below).`]
        : []),
    );
  });
  if (missingNames.size) {
    lines.push(
      "",
      "### Not found",
      "",
      `${notFoundCounts.join(" and ")} could not be read. A repo that is deleted or private ` +
        "returns the same answer. In GitHub Actions the report does not show the name, because a " +
        "private repo name must not be published. Run this report locally to see the name, and see " +
        `[A repo turns private after we wrote its name](${doc("docs/private-names.md#a-repo-turns-private-after-we-wrote-its-name")}).`,
    );
    if (!inActions) lines.push("", ...[...missing, ...outsideMissing].map((r) => `- ${r.name}`));
  }
  return lines.join("\n") + "\n";
}

const report = reportOf(SECTIONS.map((section) => section.gone.length));
const dueNames = due.map((r) => r.name);

// The issue body: the marker, then the report with as many gone facts as fit in MAX_BODY. Each
// step shows one fact less of the section that shows the most.
function issueBody(marker) {
  const shown = SECTIONS.map((section) => section.gone.length);
  for (;;) {
    const body = `${marker}\n${reportOf(shown)}`;
    const most = shown.indexOf(Math.max(...shown));
    if (Buffer.byteLength(body) <= MAX_BODY || shown[most] === 0) return body;
    shown[most]--;
  }
}

// In Actions all output is public: pass each text through the shared check before it goes out.
function check(text, label) {
  if (!inActions) return;
  const run = spawnSync(join(root, ".github/scripts/private-names.sh"), ["text", label], {
    input: text,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (run.status !== 0) fail([`the private-name check of ${label} did not pass (exit ${run.status}): it was not published`]);
}

check(report, "the drift report");

// The issue has the title already; the job summary and a local run get it as a heading.
const page = `## ${TITLE}\n\n${report}`;
process.stdout.write(page);
if (summaryFile) appendFileSync(summaryFile, page);

if (syncIssue) await sync();
if (notFoundCounts.length) fail(notFoundCounts.map((count) => `${count} not found`));

// One issue holds the report. A run opens or reopens it when a repo is due or a fact is gone,
// edits it on each run, and closes it when no repo is due and no fact is gone. A comment (it
// notifies) says when the due list or the list of gone facts changes.
async function sync() {
  const issue = await findIssue();
  const before = parseMarker(issue?.body?.split("\n", 1)[0] ?? "");
  const added = dueNames.filter((n) => !before.due.includes(n));
  // A repo that is not found now may be private: the "Not found" section covers it, without a name.
  const dropped = before.due.filter((n) => !dueNames.includes(n) && !missingNames.has(n));
  const notes = [added.length && `Now due: ${added.join(", ")}.`, dropped.length && `No longer due: ${dropped.join(", ")}.`];
  const again = [dueNames.length && `Due again: ${dueNames.join(", ")}.`];
  const marker = [MARKER, ...dueNames];
  let anyFact = false;
  for (const section of SECTIONS) {
    const factsBefore = before.facts[section.label] ?? [];
    // A fact of the last run that was not read now stays on the list: its hash names no repo.
    const unreadHashes = new Set(section.unread.map((f) => f.hash));
    const goneHashes = section.gone.map((f) => f.hash);
    const hashes = [...goneHashes, ...factsBefore.filter((h) => unreadHashes.has(h) || (section.keepUnread && section.unread.length))];
    const factsAdded = goneHashes.filter((h) => !factsBefore.includes(h));
    const factsDropped = factsBefore.filter((h) => !hashes.includes(h));
    notes.push(
      factsAdded.length && `${plural(factsAdded.length, `new ${section.term}`)} to check.`,
      factsDropped.length && `${plural(factsDropped.length, section.term)} ${factsDropped.length === 1 ? "is" : "are"} no longer on the list.`,
    );
    again.push(hashes.length && `${plural(hashes.length, section.term)} to check again.`);
    if (hashes.length) marker.push(section.label, ...hashes);
    anyFact ||= hashes.length > 0;
  }
  const note = notes.filter(Boolean).join(" ");
  const body = issueBody([...marker, "-->"].join(" "));
  check(body, "the issue body");
  const path = `/repos/${issueRepo}/issues`;

  if (!dueNames.length && !anyFact) {
    if (!issue || issue.state === "closed") return console.error("issue: no repo is due, no fact is gone, and no issue is open");
    const comment = `${note} No repo is due and no fact is gone now, so this issue closes.`.trim();
    check(comment, "the issue comment");
    await api("PATCH", `${path}/${issue.number}`, { body });
    await api("POST", `${path}/${issue.number}/comments`, { body: comment });
    await api("PATCH", `${path}/${issue.number}`, { state: "closed", state_reason: "completed" });
    return console.error(`issue: closed #${issue.number}`);
  }
  if (!issue) {
    const made = await api("POST", path, { title: TITLE, body, labels: [ISSUE_LABEL] });
    return console.error(`issue: opened #${made.number}`);
  }
  const reopen = issue.state === "closed";
  const comment = note || (reopen ? again.filter(Boolean).join(" ") : "");
  if (comment) check(comment, "the issue comment");
  const edit = issue.body !== body || reopen;
  if (edit) await api("PATCH", `${path}/${issue.number}`, { body, ...(reopen && { state: "open" }) });
  if (comment) await api("POST", `${path}/${issue.number}/comments`, { body: comment });
  const done = reopen ? "reopened" : edit ? "updated" : "unchanged";
  console.error(`issue: ${done} #${issue.number}${comment ? ` (${comment})` : ""}`);
}

// The due repos and the facts of each section on a marker line. A token after the label of a
// section belongs to that section until the next label. Only short hashes count as facts: a hand
// edit can leave other words.
function parseMarker(line) {
  if (!line.startsWith(MARKER)) return { due: [], facts: {} };
  const labels = new Set(SECTIONS.map((section) => section.label));
  const due = [], facts = {};
  let label = null;
  for (const token of line.slice(MARKER.length).replace("-->", "").trim().split(/\s+/).filter(Boolean)) {
    if (labels.has(token)) label = token;
    else if (!label) due.push(token);
    else if (/^[0-9a-f]{7}$/.test(token)) (facts[label] ??= []).push(token);
  }
  return { due, facts };
}

// The oldest issue that github-actions opened with the marker. Pull requests are skipped.
async function findIssue() {
  for (let page = 1; ; page++) {
    const batch = await api("GET", `/repos/${issueRepo}/issues?state=all&per_page=100&page=${page}&sort=created&direction=asc`);
    const hit = batch.find((i) => !i.pull_request && i.user?.login === "github-actions[bot]" && i.body?.startsWith(MARKER));
    if (hit) return hit;
    if (batch.length < 100) return null;
  }
}

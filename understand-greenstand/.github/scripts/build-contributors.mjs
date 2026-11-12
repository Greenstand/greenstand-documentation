#!/usr/bin/env node
// Build the contributors page of the Pages site (contributors.html): the recognition (CONTEXT.md)
// of the last full quarter and of the quarter to date, from the pull requests of all public repos
// of the source org (estate.json "sourceOrg").
// Usage:
//   node build-contributors.mjs --check        check the form of recognition.json (the bot list
//                                              and the exclusion list); no network
//   node build-contributors.mjs --evidence     also check that each entry exists on GitHub: each
//                                              bot account, and each excluded pull request,
//                                              comment, or review (REST API, read only; a token
//                                              in GITHUB_TOKEN is optional)
//   node build-contributors.mjs --out <dir>    fetch the data, count it, and write
//                                              <dir>/contributors.html
// --out needs GITHUB_TOKEN (read only; the deploy workflow gives the workflow token). It reads
// every public pull request of the org with the GraphQL API, in ranges of creation dates with
// fewer than 1,000 results each (the limit of a search). The data goes only into the page: no
// data file is written. The output never shows the login of a person or a pull request title. It
// shows counts, and the entries of recognition.json (public in git) in its warnings.
// The opt-out list is the RECOGNITION_OPT_OUT secret: account ids, or "none". An opted-out
// person is on no part of the page. In Actions an empty value is an error, so a deleted secret
// cannot undo a removal. In Actions the page also goes through the shared private-name check
// (private-names.sh) before it is written, and the build fails without the name list.
// The build fails on any error of the fetch or of the check: then the site keeps its last deploy.
// A list entry that matches nothing in the data gives a warning (--evidence in the required check
// catches a wrong entry). SOURCE_DATE_EPOCH (seconds) sets the build time for a test.
// The deploy workflow runs it in its own job (contributors), and puts the page into the site
// before build-landing.mjs runs. The page loads the font and the parcel field of the site look:
// build-landing.mjs fails when one of them, or the page, is missing from the site.
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkLists, LISTS_FILE, monthsLater, parseExcludedUrl, parseOptOut, quarterStart, recognition } from "./contributors.mjs";
import { contributorsPage, WINDOWS } from "./contributors-page.mjs";
import { docsBlobUrl, docsRepoUrl, loadEstate, parseJson, plural, readDocsFile, root } from "./estate.mjs";
import { undefinedProperties } from "./site-html.mjs";

const args = process.argv.slice(2);
const check = args.length === 1 && args[0] === "--check";
const evidence = args.length === 1 && args[0] === "--evidence";
const out = args.length === 2 && args[0] === "--out" ? args[1] : null;
if (!check && !evidence && !out) {
  console.error("usage: node build-contributors.mjs --check | --evidence | --out <dir>");
  process.exit(2);
}

function fail(errors) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

const errors = [];
const lists = readDocsFile(LISTS_FILE, errors, parseJson);
if (lists !== null) errors.push(...checkLists(lists));
if (check) {
  if (errors.length) fail(errors);
  console.log(`${LISTS_FILE} is valid (${plural(lists.bots.length, "bot")}, ${plural(lists.excluded.length, "excluded item")})`);
  process.exit(0);
}

const inActions = process.env.GITHUB_ACTIONS === "true";
const token = process.env.GITHUB_TOKEN;
const { estate, areas, errors: estateErrors } = loadEstate();
errors.push(...estateErrors);
// The docs repo on GitHub (the removal form and the exclusion list live there): docsRepo and
// docsDir of estate.json. loadEstate checks both.
const docsRepo = estate && docsRepoUrl(estate);
const listsUrl = estate && docsBlobUrl(estate, "main", LISTS_FILE);

// ---------- --evidence: each list entry exists on GitHub ----------

if (evidence) {
  if (errors.length) fail(errors);
  // The HTTP status of a GET of the REST API, with the answer when it is 200.
  const get = async (path) => {
    try {
      const res = await fetch(`https://api.github.com${path}`, {
        headers: { accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28", ...(token ? { authorization: `Bearer ${token}` } : {}) },
        signal: AbortSignal.timeout(30_000),
      });
      return { status: res.status, body: res.ok ? await res.json().catch(() => null) : null };
    } catch (e) {
      return { status: null, body: null, error: e.name };
    }
  };
  const answerText = (a) => (a.status === null ? `GitHub gave no answer (${a.error})` : `GitHub answered HTTP ${a.status}`);
  const found = [];
  for (const [i, bot] of lists.bots.entries()) {
    const a = await get(`/user/${bot.id}`);
    if (a.status === 404) found.push(`${LISTS_FILE}: bots[${i}]: GitHub has no account ${bot.id} (HTTP 404)`);
    else if (a.status !== 200) found.push(`${LISTS_FILE}: bots[${i}]: account ${bot.id}: ${answerText(a)}`);
  }
  const ITEM = { pull: "pull request", issuecomment: "comment", pullrequestreview: "review" };
  for (const [i, entry] of lists.excluded.entries()) {
    const { repo, number, kind, id } = parseExcludedUrl(entry.url);
    const base = `/repos/${estate.sourceOrg}/${repo}`;
    const path = { pull: `${base}/pulls/${number}`, issuecomment: `${base}/issues/comments/${id}`, pullrequestreview: `${base}/pulls/${number}/reviews/${id}` }[kind];
    const a = await get(path);
    const at = `${LISTS_FILE}: excluded[${i}]: ${entry.url}`;
    if (a.status === 404) found.push(`${at}: GitHub has no such ${ITEM[kind]} (HTTP 404)`);
    else if (a.status !== 200) found.push(`${at}: ${answerText(a)}`);
    else if (kind === "issuecomment" && !String(a.body?.issue_url ?? "").endsWith(`/issues/${number}`)) found.push(`${at}: the comment is not on pull request ${number}`);
  }
  if (found.length) fail(found);
  const n = lists.bots.length + lists.excluded.length;
  console.log(`${LISTS_FILE}: ${n === 0 ? "no entries to check" : n === 1 ? "the 1 entry exists on GitHub" : `each of the ${n} entries exists on GitHub`}`);
  process.exit(0);
}

const optOut = parseOptOut(process.env.RECOGNITION_OPT_OUT, { required: inActions });
errors.push(...optOut.errors);
if (!token) errors.push("GITHUB_TOKEN is not set: the fetch needs a token (read only)");
if (inActions && !process.env.PRIVATE_REPO_NAMES) errors.push("PRIVATE_REPO_NAMES is not set: the page is written only after a private-name check");
if (errors.length) fail(errors);

const now = process.env.SOURCE_DATE_EPOCH ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000) : new Date();

// ---------- the fetch ----------

let points = 0;

// One GraphQL request. Retries an answer of 5xx or 429, and a 403 with a retry-after header (a
// secondary rate limit), 2 times. An error names the HTTP status or the error types only: the
// text of a GraphQL error can quote data.
async function graphql(query, variables) {
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { authorization: `bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(60_000),
      });
    } catch (e) {
      if (attempt < 3) continue;
      throw new Error(`the GitHub GraphQL API gave no answer (${e.name})`);
    }
    const retry = res.status >= 500 || res.status === 429 || (res.status === 403 && res.headers.has("retry-after"));
    if (retry && attempt < 3) {
      const wait = Number(res.headers.get("retry-after") ?? 5 * attempt);
      await new Promise((r) => setTimeout(r, 1000 * (Number.isFinite(wait) ? wait : 5)));
      continue;
    }
    if (!res.ok) throw new Error(`the GitHub GraphQL API answered HTTP ${res.status}`);
    // A parse error can quote the text of the answer: name the status only.
    const answer = await res.json().catch(() => null);
    if (answer === null) throw new Error(`the GitHub GraphQL API answered HTTP ${res.status}, but the answer is not JSON`);
    if (answer.errors?.length) {
      const types = [...new Set(answer.errors.map((e) => e.type ?? "unknown"))].join(", ");
      throw new Error(`the GitHub GraphQL API gave ${plural(answer.errors.length, "error")} (type ${types})`);
    }
    points += answer.data.rateLimit?.cost ?? 0;
    return answer.data;
  }
}

const ACTOR = "__typename login ... on User { databaseId } ... on Bot { databaseId }";
const COMMENTS = `totalCount pageInfo { hasNextPage endCursor } nodes { databaseId createdAt author { ${ACTOR} } }`;
const REVIEWS = `totalCount pageInfo { hasNextPage endCursor } nodes { databaseId submittedAt state body comments { totalCount } author { ${ACTOR} } }`;
const PULL_REQUEST = `id number title url createdAt mergedAt state
  repository { nameWithOwner visibility }
  labels(first: 100) { nodes { name } }
  author { ${ACTOR} }
  mergedBy { ${ACTOR} }
  comments(first: 100) { ${COMMENTS} }
  reviews(first: 100) { ${REVIEWS} }`;
const SEARCH = `query($q: String!, $after: String) { rateLimit { cost }
  search(query: $q, type: ISSUE, first: 50, after: $after) { issueCount pageInfo { hasNextPage endCursor }
    nodes { ... on PullRequest { ${PULL_REQUEST} } } } }`;
const MORE = {
  comments: `query($id: ID!, $after: String) { rateLimit { cost } node(id: $id) { ... on PullRequest { comments(first: 100, after: $after) { ${COMMENTS} } } } }`,
  reviews: `query($id: ID!, $after: String) { rateLimit { cost } node(id: $id) { ... on PullRequest { reviews(first: 100, after: $after) { ${REVIEWS} } } } }`,
};

// The search of the pull requests created from the date from to the date to (YYYY-MM-DD, both
// included).
const searchText = (from, to) => `org:${estate.sourceOrg} is:public is:pr created:${from}..${to}`;
const isoDay = (t) => t.toISOString().slice(0, 10);
const addDays = (date, n) => isoDay(new Date(Date.parse(`${date}T00:00:00Z`) + n * 86_400_000));
const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);

// The rest of a connection with more than 100 comments or reviews.
async function completeConnection(pr, name) {
  while (pr[name].pageInfo.hasNextPage) {
    const data = await graphql(MORE[name], { id: pr.id, after: pr[name].pageInfo.endCursor });
    const more = data.node[name];
    pr[name] = { ...more, nodes: [...pr[name].nodes, ...more.nodes] };
  }
  if (pr[name].nodes.length !== pr[name].totalCount) throw new Error(`a pull request has ${pr[name].totalCount} ${name}, but the fetch read ${pr[name].nodes.length}`);
}

// Every pull request of a date range. A range with 1,000 or more results is cut in 2 (the first page
// gives the count). A range that reads a count that differs from the search count (a pull request
// was opened or deleted during the read) is read again 1 time.
async function fetchRange(from, to, out) {
  for (let attempt = 1; ; attempt++) {
    const nodes = [];
    let after = null;
    let count;
    for (;;) {
      const { search: page } = await graphql(SEARCH, { q: searchText(from, to), after });
      count = page.issueCount;
      if (count >= 1000) {
        if (from === to) throw new Error(`the search gives ${count} pull requests for 1 day: the fetch cannot read them all`);
        const mid = addDays(from, Math.floor(daysBetween(from, to) / 2));
        await fetchRange(from, mid, out);
        await fetchRange(addDays(mid, 1), to, out);
        return;
      }
      nodes.push(...page.nodes);
      if (!page.pageInfo.hasNextPage) break;
      after = page.pageInfo.endCursor;
    }
    if (nodes.length === count) {
      for (const pr of nodes) {
        await completeConnection(pr, "comments");
        await completeConnection(pr, "reviews");
        out.set(pr.id, pr);
      }
      return;
    }
    if (attempt === 2) throw new Error(`the search gives ${count} pull requests for ${from} to ${to}, but the fetch read ${nodes.length}`);
  }
}

// Every public pull request of the org, from the quarter in which the org was made to the build
// time: 1 range for each quarter, 4 ranges at a time. A full read of about 6,000 pull requests
// took about 6 minutes from the sandbox of the maintainer (2026-11-03): GitHub answers a big search
// page slowly, and more ranges at a time did not make it much faster. The result is in the order
// of the quarters, the same on each run.
const PARALLEL = 4;
const ORG = `query($org: String!) { rateLimit { cost } organization(login: $org) { createdAt } }`;
async function fetchPullRequests() {
  const { organization } = await graphql(ORG, { org: estate.sourceOrg });
  const made = new Date(organization.createdAt);
  const ranges = [];
  for (let start = quarterStart(made); start <= now; start = monthsLater(start, 3)) {
    const end = new Date(monthsLater(start, 3).getTime() - 86_400_000); // the last day of the quarter
    ranges.push([isoDay(start), isoDay(end < now ? end : now)]);
  }
  const found = ranges.map(() => new Map());
  let next = 0;
  const worker = async () => {
    while (next < ranges.length) {
      const i = next++;
      await fetchRange(...ranges[i], found[i]);
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  const out = new Map();
  for (const m of found) for (const [id, pr] of m) out.set(id, pr);
  return [...out.values()];
}

let prs;
try {
  prs = await fetchPullRequests();
} catch (e) {
  fail([e.message]);
}

// ---------- the counts, the page, and the checks ----------

const result = recognition(prs, lists, optOut.ids, now);
// A list entry that matches nothing does not stop the page: a warning (an annotation in Actions)
// names it. The id, the login of a bot, and the URL are public in recognition.json.
const warn = (text) => (inActions ? console.log(`::warning::${text}`) : console.error(`warning: ${text}`));
for (const b of result.unusedBots) warn(`${LISTS_FILE}: the bot ${b.id} (${b.login}) is in no pull request: remove it from the list`);
for (const e of result.unusedExcluded) warn(`${LISTS_FILE}: the excluded item ${e.url} matches nothing in the data: remove it from the list`);

const html = contributorsPage({ areas, windows: result.windows, built: now, docsRepo, lists: listsUrl });
const undefinedNames = undefinedProperties(html);
if (undefinedNames.length) fail(undefinedNames.map((n) => `the contributors page uses var(--${n}), but nothing defines --${n}`));

// In Actions all output is public: the page goes through the shared private-name check first. On a
// finding, the check runs on each data item, to name its place (never its text).
function nameCheck() {
  if (!inActions) return;
  const script = join(root, ".github/scripts/private-names.sh");
  const run = (text, stdio) => spawnSync(script, ["text", "the contributors page"], { input: text, stdio: ["pipe", stdio, stdio] }).status;
  const status = run(html, "inherit");
  if (status === 0) return;
  // Exit 1 is a finding; any other exit (2: no scanner, no name list) means that it could not check.
  if (status !== 1) fail([`the private-name check could not run (exit ${status}): the page was not written`]);
  const places = [];
  for (const w of result.windows) {
    const where = WINDOWS[w.key].inText;
    w.contributors.forEach((c, i) => run(c.login, "ignore") === 0 || places.push(`${where}, name ${i + 1} of the list`));
    w.newcomers.forEach((n, i) => run(`${n.login} ${n.first.repo} ${n.first.title} ${n.first.url}`, "ignore") === 0 || places.push(`${where}, thank-you line ${i + 1}`));
  }
  fail([
    `the private-name check found a name in the contributors page (${places.length ? places.join("; ") : "not in a data item"}): the page was not written`,
    `put the pull request, comment, or review on the exclusion list of ${LISTS_FILE}`,
  ]);
}
nameCheck();

writeFileSync(join(out, "contributors.html"), html);
const summary = result.windows.map((w) => `${WINDOWS[w.key].inText}: ${plural(w.contributors.length, "contributor")}, ${plural(w.newcomers.length, "newcomer")}`);
console.log(`wrote ${join(out, "contributors.html")} (${plural(prs.length, "pull request")}; ${summary.join("; ")}; ${points} GraphQL points)`);

// The recognition (CONTEXT.md): the counts of the contributors page (contributors.html), from the
// pull requests of the public Greenstand repos. No network and no output: build-contributors.mjs
// fetches the pull requests, and contributors-page.mjs writes the page.
// - checkLists: the form of recognition.json (the bot list and the exclusion list).
// - parseOptOut: the opt-out list (the RECOGNITION_OPT_OUT secret): account ids.
// - windowsAt: the 2 windows of the page, the last full quarter and the quarter to date (UTC), with
//   the quarter helpers quarterStart and monthsLater (build-contributors.mjs reads by quarter too).
// - parseExcludedUrl: the parts of an exclusion URL (build-contributors.mjs --evidence reads them).
// - recognition: for each window, the contributors (4 counts each) and the newcomers.
// People are keyed by account id (databaseId), not by login: a login can change. The page shows
// the login that the account has at the time of the fetch.
import { isObject } from "./estate.mjs";

export const LISTS_FILE = "recognition.json";

// A pull request with one of these labels that is closed or merged (not open) is left out of every
// count.
const LEFT_OUT_LABELS = new Set(["spam", "invalid"]);

// The forms of an exclusion URL: a pull request of a Greenstand repo, a conversation comment on
// it, or a review of it. Inline review comments belong to their review: exclude the review.
const EXCLUDED_URL = /^https:\/\/github\.com\/Greenstand\/([A-Za-z0-9._-]+)\/pull\/([1-9]\d*)(?:#(issuecomment|pullrequestreview)-([1-9]\d*))?$/;
// The parts of an exclusion URL: { repo, number, kind ("pull", "issuecomment", or
// "pullrequestreview"), id }, or null for a URL of another form.
export function parseExcludedUrl(url) {
  const m = typeof url === "string" ? url.match(EXCLUDED_URL) : null;
  return m && { repo: m[1], number: Number(m[2]), kind: m[3] ?? "pull", id: m[4] ? Number(m[4]) : null };
}

// The form errors of recognition.json, all at once. lists is the parsed file.
export function checkLists(lists) {
  if (!isObject(lists)) return [`${LISTS_FILE} must hold an object with "bots" and "excluded"`];
  const errors = [];
  for (const key of Object.keys(lists)) if (!["bots", "excluded"].includes(key)) errors.push(`${LISTS_FILE}: unknown key "${key}"`);
  for (const key of ["bots", "excluded"]) if (!Array.isArray(lists[key])) errors.push(`${LISTS_FILE}: "${key}" must be a list`);
  if (errors.length) return errors;
  const ids = new Set();
  lists.bots.forEach((bot, i) => {
    const at = `${LISTS_FILE}: bots[${i}]`;
    if (!isObject(bot)) return errors.push(`${at} must be an object with "id", "login", and "note"`);
    for (const key of Object.keys(bot)) if (!["id", "login", "note"].includes(key)) errors.push(`${at}: unknown key "${key}"`);
    if (!Number.isSafeInteger(bot.id) || bot.id < 1) errors.push(`${at}: "id" must be the account id, a whole number above 0`);
    else if (ids.has(bot.id)) errors.push(`${at}: the account id ${bot.id} is on the list 2 times`);
    else ids.add(bot.id);
    if (typeof bot.login !== "string" || !bot.login.trim()) errors.push(`${at}: "login" must be the login of the bot`);
    if (typeof bot.note !== "string" || !bot.note.trim()) errors.push(`${at}: "note" must say why the account is a bot`);
  });
  const urls = new Set();
  lists.excluded.forEach((entry, i) => {
    const at = `${LISTS_FILE}: excluded[${i}]`;
    if (!isObject(entry)) return errors.push(`${at} must be an object with "url" and "reason"`);
    for (const key of Object.keys(entry)) if (!["url", "reason"].includes(key)) errors.push(`${at}: unknown key "${key}"`);
    if (!parseExcludedUrl(entry.url)) {
      errors.push(`${at}: "url" must be the URL of a pull request of a Greenstand repo, of a comment on it (#issuecomment-<id>), or of a review of it (#pullrequestreview-<id>)`);
    } else if (urls.has(entry.url.toLowerCase())) errors.push(`${at}: the URL is on the list 2 times`);
    else urls.add(entry.url.toLowerCase());
    if (typeof entry.reason !== "string" || !entry.reason.trim()) errors.push(`${at}: "reason" must say why the item is left out`);
  });
  return errors;
}

// The opt-out list: account ids, separated by commas, spaces, or line breaks. "none" means nobody.
// required (in Actions): an empty value is an error, so a deleted secret cannot undo a removal.
// The errors never show the value: it is a secret.
export function parseOptOut(value, { required }) {
  const text = (value ?? "").trim();
  if (!text) return required ? { ids: new Set(), errors: ["the opt-out list (RECOGNITION_OPT_OUT) is not set: set it to the account ids, or to none"] } : { ids: new Set(), errors: [] };
  if (text.toLowerCase() === "none") return { ids: new Set(), errors: [] };
  const parts = text.split(/[\s,]+/).filter(Boolean);
  const bad = parts.filter((p) => !/^[1-9]\d*$/.test(p)).length;
  if (bad) return { ids: new Set(), errors: [`the opt-out list (RECOGNITION_OPT_OUT) has ${bad} ${bad === 1 ? "entry that is" : "entries that are"} not an account id (a whole number)`] };
  return { ids: new Set(parts.map(Number)), errors: [] };
}

// The quarter (UTC) that holds a time: its first moment, as a Date. monthsLater: the first moment of
// the month n months after the month of t.
export const quarterStart = (t) => new Date(Date.UTC(t.getUTCFullYear(), Math.floor(t.getUTCMonth() / 3) * 3, 1));
export const monthsLater = (t, n) => new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + n, 1));

// The 2 windows of the page at the build time now: the last full quarter ("last") and the quarter
// to date ("now"). Each one is [start, end): end is the end of the quarter for "last" and the
// build time for "now".
export function windowsAt(now) {
  const current = quarterStart(now);
  return [
    { key: "last", start: monthsLater(current, -3), end: current },
    { key: "now", start: current, end: now },
  ];
}

// A human account (a contributor can be one): a GitHub user that is not on the bot list. Bots
// (type Bot), deleted accounts (no author), mannequins, and organizations are not.
const humanId = (actor, bots) => (actor?.__typename === "User" && !bots.has(actor.databaseId) ? actor.databaseId : null);

// The page column of each kind of item (the item kinds are the 4 counted kinds of CONTEXT.md, with
// the merge in 2 forms: "merged" for the author and "merging" for the merger). "merging" and the
// items with counted false make a person a contributor, but add to no column.
const COLUMN_OF = { raised: "raised", merged: "merged", review: "reviewed", comment: "commented" };

// The recognition of each window. prs: the pull request nodes of the fetch. lists: the parsed
// recognition.json. optOut: a Set of account ids. now: the build time.
// Returns { windows, unusedBots, unusedExcluded }:
// - windows: [{ key, start, end, contributors, newcomers }]. contributors: each person with a
//   count above 0, in the order of the alphabet: { id, login, raised, merged, reviewed,
//   commented, isNew }. newcomers: the contributors whose first contribution falls in the window,
//   in the same order: { id, login, first }. first is the first contribution: { kind ("raised",
//   "review", "comment", or "merging"), time, repo, number, title, url }. A person with all 4
//   counts at 0 is on no part of the page (the user, 2026-11-03: most contributors are not members
//   of the GitHub org), also when the first contribution falls in the window.
// - unusedBots: the bot list entries whose account is in no public pull request. unusedExcluded:
//   the exclusion list entries that match no item (an item of a left-out pull request matches
//   too). The caller warns about both.
//
// The rules (ticket "Choose the recognition form"):
// - raised: a pull request that the person opened, at its creation time.
// - merged: a pull request by the person that was merged, at its merge time. A pull request that
//   its author merged with no approval by another person before the merge is not counted here.
// - reviewed: distinct pull requests by others with at least 1 review with text (a body or an
//   inline comment) by the person, at the time the review was submitted.
// - commented: distinct pull requests by others with at least 1 conversation comment by the
//   person, at the time of the comment.
// - Left out of every count: a closed or merged pull request with the label "spam" or "invalid",
//   and the items of the exclusion list (a pull request, a comment, or a review).
// - A newcomer (CONTEXT.md): the first contribution of the person in any public Greenstand repo
//   falls in the window. A contribution here is any item of the 4 kinds by a human: a pull request
//   raised, a merge (by the merger), a review of a pull request by another person (with or without
//   text), or a comment. The items that are left out of every count do not count. The page shows
//   a newcomer only with a count above 0.
// - An opt-out takes the person off every part of the page. It does not change the counts of
//   other people.
export function recognition(prs, lists, optOut, now) {
  const bots = new Set(lists.bots.map((b) => b.id));
  const excluded = new Set(lists.excluded.map((e) => e.url.toLowerCase()));
  const isExcluded = (url) => excluded.has(url.toLowerCase());
  const publicPrs = prs.filter((pr) => pr.repository?.visibility === "PUBLIC");

  // The list entries in use: each account and each item of the public pull requests.
  const accounts = new Set();
  const itemUrls = new Set();
  for (const pr of publicPrs) {
    itemUrls.add(pr.url.toLowerCase());
    for (const r of pr.reviews.nodes) itemUrls.add(`${pr.url}#pullrequestreview-${r.databaseId}`.toLowerCase());
    for (const c of pr.comments.nodes) itemUrls.add(`${pr.url}#issuecomment-${c.databaseId}`.toLowerCase());
    for (const actor of [pr.author, pr.mergedBy, ...pr.reviews.nodes.map((r) => r.author), ...pr.comments.nodes.map((c) => c.author)]) {
      if (actor?.__typename === "User") accounts.add(actor.databaseId);
    }
  }

  const logins = new Map(); // account id -> login
  const items = []; // { id, kind, time, pr, anchor, counted }
  const add = (actor, item) => {
    const id = humanId(actor, bots);
    if (id === null) return;
    logins.set(id, actor.login);
    items.push({ id, ...item });
  };

  for (const pr of publicPrs) {
    const leftOut = pr.state !== "OPEN" && pr.labels.nodes.some((l) => LEFT_OUT_LABELS.has(l.name.toLowerCase()));
    if (leftOut || isExcluded(pr.url)) continue;
    // A title can start or end with a space, or hold a tab or a line break: 1 space for each run.
    const title = pr.title.replace(/\s+/g, " ").trim();
    const ref = { repo: pr.repository.nameWithOwner.split("/")[1], number: pr.number, title, url: pr.url };
    const author = humanId(pr.author, bots);
    add(pr.author, { kind: "raised", time: pr.createdAt, pr: ref, anchor: "", counted: true });
    if (pr.mergedAt) {
      const merger = humanId(pr.mergedBy, bots);
      const selfMerge = author !== null && merger === author;
      // An approval that is on the exclusion list does not approve.
      const approved = pr.reviews.nodes.some((r) => {
        const by = humanId(r.author, bots);
        return r.state === "APPROVED" && by !== null && by !== author && r.submittedAt && r.submittedAt <= pr.mergedAt && !isExcluded(`${pr.url}#pullrequestreview-${r.databaseId}`);
      });
      add(pr.author, { kind: "merged", time: pr.mergedAt, pr: ref, anchor: "", counted: !selfMerge || approved });
      if (merger !== author) add(pr.mergedBy, { kind: "merging", time: pr.mergedAt, pr: ref, anchor: "", counted: false });
    }
    for (const r of pr.reviews.nodes) {
      const anchor = `#pullrequestreview-${r.databaseId}`;
      if (r.state === "PENDING" || !r.submittedAt || isExcluded(pr.url + anchor)) continue;
      const by = humanId(r.author, bots);
      if (by !== null && by === author) continue; // A review on one's own pull request does not count.
      const withText = Boolean((r.body ?? "").trim()) || r.comments.totalCount > 0;
      add(r.author, { kind: "review", time: r.submittedAt, pr: ref, anchor, counted: withText });
    }
    for (const c of pr.comments.nodes) {
      const anchor = `#issuecomment-${c.databaseId}`;
      if (isExcluded(pr.url + anchor)) continue;
      add(c.author, { kind: "comment", time: c.createdAt, pr: ref, anchor, counted: humanId(c.author, bots) !== author });
    }
  }

  // The first contribution of each person: the earliest item.
  const first = new Map();
  for (const item of items) {
    const seen = first.get(item.id);
    if (!seen || item.time < seen.time) first.set(item.id, item);
  }
  const byLogin = (a, b) => a.login.localeCompare(b.login, "en", { sensitivity: "base" }) || a.id - b.id;

  const windows = windowsAt(now).map(({ key, start, end }) => {
    const inside = (time) => time >= start.toISOString() && time < end.toISOString();
    const columns = new Map(); // id -> { raised: Set, merged: Set, reviewed: Set, commented: Set } of pull request URLs
    for (const item of items) {
      const column = COLUMN_OF[item.kind];
      if (!column || !item.counted || !inside(item.time) || optOut.has(item.id)) continue;
      if (!columns.has(item.id)) columns.set(item.id, { raised: new Set(), merged: new Set(), reviewed: new Set(), commented: new Set() });
      columns.get(item.id)[column].add(item.pr.url);
    }
    const contributors = [...columns.entries()]
      .map(([id, c]) => ({ id, login: logins.get(id), raised: c.raised.size, merged: c.merged.size, reviewed: c.reviewed.size, commented: c.commented.size, isNew: inside(first.get(id).time) }))
      .sort(byLogin);
    const newcomers = contributors.filter((c) => c.isNew).map(({ id, login }) => {
      const f = first.get(id);
      return { id, login, first: { kind: f.kind, time: f.time, ...f.pr, url: f.pr.url + f.anchor } };
    });
    return { key, start, end, contributors, newcomers };
  });

  return {
    windows,
    unusedBots: lists.bots.filter((b) => !accounts.has(b.id)),
    unusedExcluded: lists.excluded.filter((e) => !itemUrls.has(e.url.toLowerCase())),
  };
}

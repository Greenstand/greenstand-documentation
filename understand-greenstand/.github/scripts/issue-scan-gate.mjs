#!/usr/bin/env node
// The gate of the issue scan (secrets-scan-issues.yml): it allows the known findings and fails on
// any other finding.
// The scan reads all issues, pull requests, and comments of the docs repo, also the text of other
// Greenstand teams, which we do not edit. A finding in such text that a person judged and left in
// place is a known finding. Its key is in the ISSUE_SCAN_KNOWN secret, one key per line:
//   <item>:<rule>:<line>   for example issues/12:generic-password:3
// <item> is the part of the finding URL after the repo (issues/<n>, pull/<n>, or a comment
// issues/<n>#issuecomment-<id>), <rule> is the rule id, and <line> is the line in the text. Thus a
// key allows one finding only: the same rule in another item, or on another line, is new. A key is
// in a secret, not in a file, so that no public text points at the item.
// The gate writes the new findings to <new report> (the same JSON form as the scanner report) and
// prints only counts: never a key, an item, a rule, or a line of a known finding. It warns when a
// key matches no finding, so that a stale key shows.
// Usage: node issue-scan-gate.mjs <report.json> <new report.json>
//   exit 0: no new finding; 1: a new finding; 2: the report or the secret cannot be read.
import { readFileSync, writeFileSync } from "node:fs";
import { plural } from "./estate.mjs";

const [reportPath, newPath] = process.argv.slice(2);
const inActions = process.env.GITHUB_ACTIONS === "true";
const say = (text) => console.log(text);
const warn = (text) => console.log(inActions ? `::warning::${text}` : `warning: ${text}`);
const stop = (text) => {
  console.error(inActions ? `::error::${text}` : `error: ${text}`);
  process.exit(2);
};

if (!reportPath || !newPath) stop("usage: node issue-scan-gate.mjs <report.json> <new report.json>");

const KEY = /^(?:issues|pull)\/\d+(?:#[A-Za-z0-9_-]+)?:[A-Za-z0-9_.-]+:\d+$/;
const lines = (process.env.ISSUE_SCAN_KNOWN ?? "")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));
const bad = lines.filter((line) => !KEY.test(line)).length;
if (bad) stop(`${plural(bad, "line")} of ISSUE_SCAN_KNOWN ${bad === 1 ? "is" : "are"} not of the form <item>:<rule>:<line> (for example issues/12:generic-password:3)`);
const known = new Set(lines);

let findings;
try {
  findings = JSON.parse(readFileSync(reportPath, "utf8"));
} catch {
  stop("the scan wrote no readable report: see the scan step");
}
if (!Array.isArray(findings)) stop("the scan report is not a list of findings");

// The key of a finding from the GitHub API, or null for any other finding (a file has no URL).
function keyOf(finding) {
  const { url, "github.repo_url": repoUrl } = finding.Attributes ?? {};
  if (typeof url !== "string" || typeof repoUrl !== "string" || !url.startsWith(`${repoUrl}/`)) return null;
  return `${url.slice(repoUrl.length + 1)}:${finding.RuleID}:${finding.StartLine}`;
}

const used = new Set();
const fresh = findings.filter((finding) => {
  const key = keyOf(finding);
  if (key !== null && known.has(key)) {
    used.add(key);
    return false;
  }
  return true;
});
writeFileSync(newPath, `${JSON.stringify(fresh, null, 1)}\n`);

const allowed = findings.length - fresh.length;
const stale = known.size - used.size;
if (stale) warn(`${plural(stale, "key")} of ISSUE_SCAN_KNOWN ${stale === 1 ? "matches" : "match"} no finding: remove ${stale === 1 ? "it" : "them"} from the secret`);
say(`${plural(findings.length, "finding")}: ${allowed} known (allowed by ISSUE_SCAN_KNOWN), ${fresh.length} new`);
process.exit(fresh.length ? 1 : 0);

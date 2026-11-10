#!/usr/bin/env bash
# Append a findings table for one scanner report to the job summary.
# Reports are written with --redact, so they hold no secret values.
# Usage: scan-summary.sh <label> <report.json> [<full report.json>]
#   With a full report (the issue scan), <report.json> holds only the new findings of the gate
#   (issue-scan-gate.mjs), and the summary adds the count of the known findings, never their place.
set -euo pipefail

label="$1"
report="$2"
full="${3:-}"

{
  echo "### ${label}"
  if [ ! -s "$report" ] && [ -n "$full" ] && [ -s "$full" ]; then
    # The scan wrote its report, but the gate stopped before it wrote the new findings.
    echo "The scan finished, but the gate stopped: a line of the \`ISSUE_SCAN_KNOWN\` secret or the report cannot be read; see the step log."
  elif [ ! -s "$report" ]; then
    echo "No report written. The scan did not finish; see the step log."
  else
    count="$(jq 'length' "$report")"
    if [ "$count" -eq 0 ]; then
      echo "No findings."
    else
      echo "**${count} finding(s).** Rotate any real secret first, then remove it."
      echo "- In a file: for a false positive, add its fingerprint to \`understand-greenstand/.gitleaksignore\` with a reason."
      # One echo per bullet: the summary renderer turns a newline into a line break.
      echo "- In issue or pull request text: edit or delete that text. The edit history keeps the old text, so treat a real secret there as exposed. For text of another team that stays, add its key to the \`ISSUE_SCAN_KNOWN\` secret (issue-scan-gate.mjs)."
      echo
      echo "| Rule | Location | Line | Commit | Fingerprint |"
      echo "|---|---|---|---|---|"
      # Findings from the GitHub API have no file; betterleaks puts the issue or pull request
      # URL in Attributes.url. Their fingerprint is not unique per issue, so do not show it.
      jq -r '.[]
        | (if .File != "" then .File else (.Attributes.url // "unknown") end) as $location
        | (if .File != "" then "`\(.Fingerprint)`" else "n/a: edit the text" end) as $fingerprint
        | "| \(.RuleID) | \($location) | \(.StartLine) | \(.Commit[0:7]) | \($fingerprint) |"' "$report"
    fi
  fi
  if [ -n "$full" ] && [ -s "$full" ] && [ -s "$report" ]; then
    known=$(( $(jq 'length' "$full") - $(jq 'length' "$report") ))
    if [ "$known" -gt 0 ]; then
      echo
      echo "${known} known finding(s) are allowed by the \`ISSUE_SCAN_KNOWN\` secret."
    fi
  fi
  echo
} >> "$GITHUB_STEP_SUMMARY"

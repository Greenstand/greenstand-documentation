#!/usr/bin/env bash
# Check outgoing git pushes and plain text for secrets and for private Greenstand repo names.
#
# Engine: gitleaks and betterleaks, with a config generated at run time that extends
# .gitleaks.toml and adds one rule for the name list. The name list lives only in memory and
# in a temp dir that is removed on exit. Output never shows a matched value (--redact).
#
# Usage:
#   private-names.sh push <remote> [<url>]   pre-push hook; git's ref lines on stdin
#   private-names.sh text <label>            check text on stdin; <label> names its origin
#   private-names.sh messages <rev-list args> check the commit messages in a range (CI)
#   private-names.sh config <path>           write the generated scanner config (CI)
#   private-names.sh fingerprint-check       exit 1 when the name list differs from
#                                            .private-names-fingerprint
#   private-names.sh refresh                 maintainer: write the live name list to the CI
#                                            secret and to .private-names-fingerprint
#   private-names.sh install                 install the pinned scanners (~/.local/bin)
#
# Name list source, in order:
#   1. PRIVATE_REPO_NAMES (one name per line). CI reads it from the secret of that name.
#   2. Live from `gh`, when the user is an active member of the Greenstand org.
#   Otherwise only the secrets scan runs, with a notice.
#   PRIVATE_NAMES_EXTRA_TERMS (one term per line) adds test terms to the rule. They never
#   change the list fingerprint. Use only fake terms, for end-to-end tests.
#
# Mirrored-text exceptions: .private-names-exceptions holds "<sha256 of the name> <path regex>"
# lines. A name whose hash matches is allowed in files whose path matches. Text on stdin has
# no path, so exceptions never apply to it.
#
# Exit codes: 0 clean, 1 finding, 2 cannot check (blocks a push; `git push --no-verify`
# bypasses on purpose).
set -euo pipefail

ORG="Greenstand"
RULE_ID="greenstand-private-repo-name"
SECRET_NAME="PRIVATE_REPO_NAMES"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
exceptions_file="$root/.private-names-exceptions"
fingerprint_file="$root/.private-names-fingerprint"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

say() { printf 'private-names: %s\n' "$*" >&2; }

# names: the name list. names_source: env, live, or none. extra: test terms (not fingerprinted).
names=()
names_source="none"
extra=()
if [ -n "${PRIVATE_NAMES_EXTRA_TERMS:-}" ]; then
  mapfile -t extra < <(printf '%s\n' "$PRIVATE_NAMES_EXTRA_TERMS" | tr -d '\r' | sed '/^[[:space:]]*$/d')
fi

load_names() {
  if [ -n "${PRIVATE_REPO_NAMES+x}" ]; then
    mapfile -t names < <(printf '%s\n' "$PRIVATE_REPO_NAMES" | tr -d '\r' | sed '/^[[:space:]]*$/d')
    names_source="env"
    if [ "${#names[@]}" -eq 0 ]; then
      say "$SECRET_NAME is empty; secrets scan only (no private-name check)."
    fi
    return 0
  fi
  if ! command -v gh >/dev/null 2>&1 || ! gh auth token >/dev/null 2>&1; then
    say "gh is missing or not logged in; secrets scan only (no private-name check)."
    return 0
  fi
  local state list
  if ! state="$(gh api "user/memberships/orgs/$ORG" --jq .state 2>"$tmp/gh.err")"; then
    if grep -qE 'HTTP 40[34]' "$tmp/gh.err"; then
      say "not a $ORG member; secrets scan only (no private-name check)."
      return 0
    fi
    say "cannot read $ORG membership from GitHub. Retry, or bypass on purpose: git push --no-verify"
    exit 2
  fi
  if [ "$state" != "active" ]; then
    say "$ORG membership is '$state', not active; secrets scan only (no private-name check)."
    return 0
  fi
  if ! list="$(gh repo list "$ORG" --visibility private --limit 1000 --json name --jq '.[].name' 2>"$tmp/gh.err")"; then
    say "cannot list $ORG private repos. Retry, or bypass on purpose: git push --no-verify"
    exit 2
  fi
  mapfile -t names < <(printf '%s\n' "$list" | sed '/^[[:space:]]*$/d')
  names_source="live"
}

fingerprint() {
  printf '%s\n' "${names[@]}" | LC_ALL=C sort -u | sha256sum | cut -d' ' -f1
}

committed_fingerprint() {
  [ -f "$fingerprint_file" ] || return 0
  grep -vE '^[[:space:]]*(#|$)' "$fingerprint_file" | head -n 1 | cut -d' ' -f1
}

warn_if_stale() {
  [ "$names_source" = "live" ] && [ "${#names[@]}" -gt 0 ] || return 0
  if [ "$(fingerprint)" != "$(committed_fingerprint)" ]; then
    say "WARNING: the $ORG private repo list changed; the CI list is stale."
    say "  Run from understand-greenstand/: .github/scripts/private-names.sh refresh   (then merge the fingerprint file via a PR)"
  fi
}

regex_escape() { printf '%s' "$1" | sed 's/[][\.^$*+?(){}|/]/\\&/g'; }

# Write the scanner config to $tmp/scan.toml.
build_config() {
  local config="$tmp/scan.toml" alternation="" name hash path_regex
  local -a terms=("${names[@]}" "${extra[@]}")
  printf '[extend]\npath = "%s"\n' "$root/.gitleaks.toml" > "$config"
  [ "${#terms[@]}" -gt 0 ] || return 0
  for name in "${terms[@]}"; do
    alternation="${alternation:+$alternation|}$(regex_escape "$name")"
  done
  {
    printf '\n[[rules]]\nid = "%s"\n' "$RULE_ID"
    printf 'description = "Name of a private Greenstand repo in a public repo."\n'
    printf "regex = '''(?i)\\\\b(%s)\\\\b'''\n" "$alternation"
  } >> "$config"
  [ -f "$exceptions_file" ] || return 0
  for name in "${terms[@]}"; do
    hash="$(printf '%s' "$name" | sha256sum | cut -d' ' -f1)"
    while read -r path_regex; do
      [ -n "$path_regex" ] || continue
      {
        printf '\n[[rules.allowlists]]\ncondition = "AND"\n'
        printf "paths = ['''%s''']\n" "$path_regex"
        printf "regexes = ['''(?i)\\\\b%s\\\\b''']\n" "$(regex_escape "$name")"
      } >> "$config"
    done < <(awk -v h="$hash" '$1 == h { print $2 }' "$exceptions_file")
  done
}

require_scanners() {
  local tool
  for tool in gitleaks betterleaks; do
    if ! command -v "$tool" >/dev/null 2>&1; then
      say "$tool is not installed. Run from understand-greenstand/: .github/scripts/private-names.sh install"
      exit 2
    fi
  done
}

# report <tool> <json report> <fallback location>: print findings, return 1 if any.
report() {
  local count
  count="$(jq 'length' "$2")"
  [ "$count" -gt 0 ] || return 0
  jq -r --arg tool "$1" --arg where "$3" '.[]
    | (if .File != "" then .File + (if .Commit != "" then " (commit " + .Commit[0:7] + ")" else "" end)
       else $where end) as $location
    | "  \($tool): \(.RuleID) in \($location), line \(.StartLine)"' "$2" >&2
  return 1
}

# scan_git <git log options>: scan the commits in a range. Return 1 on a finding.
scan_git() {
  local tool found=0
  for tool in gitleaks betterleaks; do
    # The hook runs at the top of the docs repo: give the ignore file of our folder by its path.
    if ! "$tool" git "$root" --log-opts "$1" --gitleaks-ignore-path "$root/.gitleaksignore" \
      --config "$tmp/scan.toml" --redact --no-banner \
      --exit-code 0 --report-format json --report-path "$tmp/$tool.json" \
      --log-level error </dev/null >/dev/null 2>"$tmp/$tool.err"; then
      say "$tool failed:"; cat "$tmp/$tool.err" >&2; exit 2
    fi
    report "$tool" "$tmp/$tool.json" "commits $1" || found=1
  done
  return "$found"
}

# scan_text <label> < text: scan text from stdin. Return 1 on a finding.
scan_text() {
  local tool found=0
  cat > "$tmp/text"
  for tool in gitleaks betterleaks; do
    if ! "$tool" stdin --config "$tmp/scan.toml" --redact --no-banner --exit-code 0 \
      --report-format json --report-path "$tmp/$tool.json" --log-level error \
      < "$tmp/text" >/dev/null 2>"$tmp/$tool.err"; then
      say "$tool failed:"; cat "$tmp/$tool.err" >&2; exit 2
    fi
    report "$tool" "$tmp/$tool.json" "$1" || found=1
  done
  return "$found"
}

cmd_push() {
  local remote="${1:?usage: private-names.sh push <remote> [<url>]}"
  local zero='^0+$' found=0 line local_sha remote_ref remote_sha range commit
  local -a lines=() commits=()
  mapfile -t lines
  require_scanners
  load_names
  warn_if_stale
  build_config
  for line in "${lines[@]}"; do
    read -r _ local_sha remote_ref remote_sha <<< "$line"
    [ -n "${local_sha:-}" ] || continue
    [[ "$local_sha" =~ $zero ]] && continue  # branch deletion
    # Label without the ref itself: the ref name may hold the very term found.
    printf '%s\n' "${remote_ref#refs/*/}" | scan_text "the pushed ref name" || found=1
    if [[ "$remote_sha" =~ $zero ]] || ! git -C "$root" cat-file -e "${remote_sha}^{commit}" 2>/dev/null; then
      range="$local_sha --not --remotes=$remote"
    else
      range="$remote_sha..$local_sha"
    fi
    # shellcheck disable=SC2086  # $range holds several git rev-list arguments
    mapfile -t commits < <(git -C "$root" rev-list $range)
    for commit in "${commits[@]}"; do
      git -C "$root" log -1 --format=%B "$commit" | scan_text "commit ${commit:0:7} message" || found=1
    done
    [ "${#commits[@]}" -eq 0 ] || scan_git "$range" || found=1
  done
  if [ "$found" -ne 0 ]; then
    say "push blocked: remove the findings above (amend or rebase), then push again."
    exit 1
  fi
}

cmd_text() {
  local label="${1:-text}"
  require_scanners
  load_names
  warn_if_stale
  build_config
  if ! scan_text "$label"; then
    say "blocked: remove the findings above from the text."
    exit 1
  fi
}

# messages <rev-list args>: check each commit message in a range.
cmd_messages() {
  local commit found=0
  local -a commits=()
  [ "$#" -gt 0 ] || { say "usage: private-names.sh messages <rev-list args>"; exit 2; }
  require_scanners
  load_names
  build_config
  mapfile -t commits < <(git -C "$root" rev-list "$@")
  for commit in "${commits[@]}"; do
    git -C "$root" log -1 --format=%B "$commit" | scan_text "commit ${commit:0:7} message" || found=1
  done
  say "checked ${#commits[@]} commit message(s)."
  if [ "$found" -ne 0 ]; then
    say "blocked: reword the commit messages above."
    exit 1
  fi
}

# config <path>: write the generated scanner config, for tools that take --config.
cmd_config() {
  local path="${1:?usage: private-names.sh config <path>}"
  load_names
  build_config
  cp "$tmp/scan.toml" "$path"
  say "wrote $path (${#names[@]} names from $names_source, ${#extra[@]} test terms)."
}

cmd_fingerprint_check() {
  load_names
  if [ "${#names[@]}" -eq 0 ]; then
    say "no name list available; cannot compare fingerprints."
    exit 2
  fi
  if [ "$(fingerprint)" != "$(committed_fingerprint)" ]; then
    say "the name list ($names_source) differs from .private-names-fingerprint."
    say "  A maintainer runs: .github/scripts/private-names.sh refresh"
    exit 1
  fi
  say "the name list matches .private-names-fingerprint."
}

cmd_refresh() {
  local repo
  unset PRIVATE_REPO_NAMES
  load_names
  if [ "$names_source" != "live" ]; then
    say "refresh needs a live list: log in to gh as an active $ORG member."
    exit 2
  fi
  repo="$(cd "$root" && gh repo view --json nameWithOwner --jq .nameWithOwner)"
  printf '%s\n' "${names[@]}" | LC_ALL=C sort -u | gh secret set "$SECRET_NAME" --repo "$repo"
  {
    printf '# SHA-256 of the sorted private-repo-name list (one name per line). It shows when the\n'
    printf '# CI list is stale, without revealing names. Update with: private-names.sh refresh\n'
    fingerprint
  } > "$fingerprint_file"
  say "updated the $SECRET_NAME secret on $repo (${#names[@]} names) and .private-names-fingerprint."
  say "  Commit .private-names-fingerprint on a branch and merge it through a PR."
}

cmd_install() {
  # shellcheck source=/dev/null
  . <(grep -E '^[A-Z0-9_]+=' "$root/.github/scanner-versions.env")
  "$root/.github/scripts/install-scanner.sh" gitleaks "$GITLEAKS_VERSION" "$GITLEAKS_SHA256"
  "$root/.github/scripts/install-scanner.sh" betterleaks "$BETTERLEAKS_VERSION" "$BETTERLEAKS_SHA256"
}

case "${1:-}" in
  push) shift; cmd_push "$@" ;;
  text) shift; cmd_text "$@" ;;
  messages) shift; cmd_messages "$@" ;;
  config) shift; cmd_config "$@" ;;
  fingerprint-check) cmd_fingerprint_check ;;
  refresh) cmd_refresh ;;
  install) cmd_install ;;
  *) sed -n '2,34p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//' >&2; exit 2 ;;
esac

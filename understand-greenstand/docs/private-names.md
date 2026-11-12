# Private repo names

This repo is public. Some Greenstand repos are private, and their names must not appear here.
This guide tells you how the guards work and what to do when one of them stops you.

## The policy

A **private repo name** is the name of a private repo in the Greenstand GitHub organization.

- **Authored text** is text that we write: docs, READMEs, commit messages, branch names, and
  issue and pull request text. Authored text never holds a private repo name.
- **Mirrored text** is text that the generator copies from Greenstand source into `repos/`.
  Mirrored text can keep a private repo name only when public Greenstand source already
  contains that name. Each such name needs an entry in `.private-names-exceptions`.

Never write a private repo name in a fix, a commit message, or a pull request either. Refer to
a name by its hash or by a count ("1 name, 76 hits").

## The guards

<!-- A list, not a table: a three-column table overflows on narrow screens. -->
- **`pre-push` hook** (`.githooks/pre-push`): pushed commits, their messages, and the branch
  name.\
  When: before the push leaves your machine.
- **`private-names` check** (CI): commit messages of our files, the branch name, the pull request
  title and body.\
  When: each push and pull request.
- **`gitleaks` and `betterleaks` checks** (CI): the full git history of our files
  (`understand-greenstand/` and our files in `.github/`).\
  When: each push and pull request.
- **Drift report** (`understand-greenstand-drift-report.yml`): the report, the issue, and the
  comments that the job writes. GitHub starts no issue scan for them.\
  When: before the job prints or posts the text.
- **Issue scan** (`understand-greenstand-secrets-scan-issues.yml`): issues, pull requests, and their
  comments of all of this repo. A known finding in the text of another team passes: its key is
  in the `ISSUE_SCAN_KNOWN` secret (`.github/scripts/issue-scan-gate.mjs`).\
  When: each issue event, and on an hourly schedule. GitHub can delay or skip a scheduled run.

All guards use one script, `.github/scripts/private-names.sh`. It runs gitleaks and
betterleaks, so each run also checks for secrets. Output shows the rule, the location, and the
line. It never shows the name.

Text that you type on github.com cannot be checked before GitHub publishes it. The issue scan
finds it later. Keep issue and comment text free of names from the start.

## Set up your clone

You need `bash`, `git`, `jq`, and `gh`. Run the commands of this guide from
`understand-greenstand/`, the folder of these docs in this repo
([Greenstand/greenstand-documentation](https://github.com/Greenstand/greenstand-documentation)).

1. Install the pinned scanners (Linux x64) into `~/.local/bin`, and make sure that directory
   is on your `PATH`:

   ```
   .github/scripts/private-names.sh install
   ```

2. Enable the hook, once per clone:

   ```
   git config core.hooksPath understand-greenstand/.githooks
   ```

The name list comes live from `gh` at each push. No file on your disk holds it. What the hook
checks depends on your access:

| Your access | What the hook does |
|---|---|
| No `gh`, or `gh` is not logged in | Secrets scan only, with a notice |
| Logged in, but not a Greenstand member | Secrets scan only, with a notice |
| Active Greenstand member | Secrets scan and private-name check |
| Active member, but the GitHub API fails | Blocks the push (exit 2) |

Without member access, CI still checks the names after you open a pull request.

## When the hook blocks a push

The hook exits 1 and prints one line per finding, for example
`gitleaks: greenstand-private-repo-name in commit a1b2c3d message, line 1`.

- **In a file:** edit the file, then amend the commit (`git commit --amend`) or rebase.
  A finding in an older commit of your branch needs an interactive rebase.
- **In a commit message:** reword the message (`git commit --amend`, or an interactive rebase
  for an older commit).
- **In the branch name:** rename the branch (`git branch -m <new-name>`) and push it.
- **In mirrored text under `repos/`:** see [Add a mirrored-text exception](#add-a-mirrored-text-exception).
- **A secret rule, not a name:** rotate a real secret first, then remove it. For a false
  positive, see [False positives](#false-positives).

Exit 2 means that the hook cannot check: a scanner is missing, or GitHub did not answer. Fix
the cause, or push with `git push --no-verify` on purpose. CI still checks the pull request.

## When CI fails

- **`private-names`:** the job log names the location (`commit <sha> message`,
  `the branch name`, `the pull request title`, or `the pull request body`). Reword the
  commits and force-push your branch, or edit the pull request. An edit of the title or body
  runs the check again. For a branch name, push the branch under a new name, delete the old
  remote branch, and open a new pull request.
- **`gitleaks` or `betterleaks`:** the job summary lists each finding with its file, commit,
  and fingerprint.
- **The fingerprint step of `private-names`:** the CI name list is stale. A maintainer
  refreshes it (see below).

When CI finds a name, GitHub has already published it. Fix it at once, and tell a maintainer:
the old text can stay in the pull request history.

A pull request from a fork gets no secrets, so CI runs the secrets scan only there. A
maintainer pushes its commits to a branch in this repo to run the full check.

## Add a mirrored-text exception

Add an exception only for a name in `repos/` that public Greenstand source already contains.

1. Count the name's hits under `repos/` (the hook or the CI job summary). Do not print the
   name.
2. Confirm that public Greenstand source contains the exact name. Get the file content and
   count whole-word matches (for example, `git grep -wFc` in a clone of the public repo).
   Code search hits alone are not proof: GitHub code search matches loosely.
3. Compute the hash of the exact name, without a trailing newline. This form keeps the name
   out of your shell history:

   ```
   read -rs name; printf '%s' "$name" | sha256sum; unset name
   ```

4. Add one line to `.private-names-exceptions`: `<hash> ^understand-greenstand/repos/`. Above it,
   add a comment that names the public repo and the path that hold the name. Never write the name
   itself.
5. Merge through a pull request. The full-history checks must pass.

## Refresh the name list (maintainers)

CI reads the name list from the `PRIVATE_REPO_NAMES` Actions secret. The committed file
`.private-names-fingerprint` holds the SHA-256 of the list. When Greenstand adds or removes a
private repo, the hook warns that the CI list is stale, and the CI fingerprint step fails.

1. Log in to `gh` as an active Greenstand member who can set the Actions secrets of this repo
   (the role `maintain` or higher).
2. Run `.github/scripts/private-names.sh refresh`. It sets the secret and rewrites
   `.private-names-fingerprint`.
3. Commit `.private-names-fingerprint` on a branch, and merge it through a pull request.
4. Confirm that the `private-names` check passes on `main`.

A change of the fingerprint file shows publicly that the list changed. It does not show what
changed.

## A repo turns private after we wrote its name

The name was public when we wrote it, so the old commits stay. After the next refresh, the
full-history checks find the name in those commits.

1. Remove the name from the current text through a pull request.
2. Copy the fingerprint of each old finding from the `gitleaks` or `betterleaks` job summary.
   A fingerprint holds the commit, the file, the rule, and the line. It holds no name.
3. Add the fingerprints to `.gitleaksignore`, with a comment line that gives the reason.
   Both scanners read that file.

## False positives

For a secret rule finding that is not a secret, add its fingerprint from the job summary to
`.gitleaksignore` with a reason. Never list a real secret there: rotate it, then remove it.

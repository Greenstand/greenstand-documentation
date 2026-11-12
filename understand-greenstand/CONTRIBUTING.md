# Contributing to these docs

This repo holds generated documentation for Greenstand's source repos. This page tells you how
to report a problem in these docs and how to change them. To contribute to Greenstand's code,
read [How to contribute to Greenstand](./docs/contribute-to-greenstand.md).

Everyone who takes part here follows the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Report a problem

- A page, a graph, or a glossary here is wrong: open a
  [Wrong docs](https://github.com/Greenstand/greenstand-documentation/issues/new?template=understand-greenstand-wrong-docs.yml) issue.
- You have an idea to make these docs more useful: open a
  [Docs improvement](https://github.com/Greenstand/greenstand-documentation/issues/new?template=understand-greenstand-docs-improvement.yml) issue.
- You found a bug in Greenstand's code: report it in its source repo, not here.

## Know what is generated

Most files here are generated. The recipe in
[Regenerating a repo's documentation](./docs/regenerating.md#per-repo-recipe) tells which step
writes which file. A regeneration replaces a direct edit of a generated file. To change a
generated file, change its input or the recipe. Text that is not generated is edited text.
Change it directly in its file.

The capture journey is generated from [`capture-journey.json`](./capture-journey.json). Each
chapter has a text copy (`docs/capture-journey.md` for chapter 1, `docs/capture-journey-<id>.md`
for a later chapter) and an illustrated page on the Pages site. To change them, change the data
file, then run `node .github/scripts/build-capture-journey.mjs`. The note of a stage can end with
one link: `seeChapter` (the id of another chapter) or `seeLink` (a public page, for a claim that no
file of a repo holds). `issues` cites an open public issue for a sentence of the story. The prose
of the page uses the curly apostrophe (’); the check refuses a straight one there.

The roadmap page is generated from [`roadmap.json`](./roadmap.json) and the pinned copy of the
roadmap, [`sources/Greenstand-Overview/Roadmap.md`](./sources/Greenstand-Overview/Roadmap.md). It
has a text copy (`docs/roadmap.md`) and a page on the Pages site (`roadmap.html`). The items stay
word for word: do not edit the pinned copy or the text copy. To place a section in another area,
change the data file, then run `node .github/scripts/build-roadmap.mjs`. To follow a newer roadmap,
[move the snapshot](./docs/regenerating.md#move-the-roadmap-snapshot).

## Change the docs

These docs live in the folder `understand-greenstand/` of this repo,
[Greenstand/greenstand-documentation](https://github.com/Greenstand/greenstand-documentation). Run the
commands of this guide from the folder.

1. Follow [Set up your clone](./docs/private-names.md#set-up-your-clone) in
   `docs/private-names.md`.
2. Fork this repo, or ask a maintainer for access.
3. Work on a branch.
4. To regenerate a repo, follow [the recipe](./docs/regenerating.md#per-repo-recipe).
   [When to regenerate](./docs/regenerating.md#when-to-regenerate) tells you when a repo is due.
5. Check the generated files:

   ```
   node .github/scripts/build-index.mjs --check
   node .github/scripts/build-ecosystem-maps.mjs --check
   node .github/scripts/build-shared-resources.mjs --check
   node .github/scripts/build-capture-journey.mjs --check
   node .github/scripts/build-roadmap.mjs --check
   node .github/scripts/build-glossary.mjs --check
   node .github/scripts/build-repo-readmes.mjs --check
   node .github/scripts/build-onboarding.mjs --check
   node .github/scripts/check-former-names.mjs
   node .github/scripts/check-graphs.mjs
   node .github/scripts/check-site-colors.mjs
   node .github/scripts/build-contributors.mjs --check
   ```

   If you change `shared-resources.json`, also run
   `node .github/scripts/build-shared-resources.mjs --evidence`. It reads each cited file on
   GitHub and checks that each name is in its cited lines. The pull request runs it too.

   If you change `capture-journey.json` or an image in `docs/capture-journey/`, also run the
   command below. It reads each cited file, image source, and issue on GitHub. It uses your token:
   without a token, GitHub allows only 60 requests an hour. The pull request runs it too.

   ```
   GITHUB_TOKEN="$(gh auth token)" node .github/scripts/build-capture-journey.mjs --evidence
   ```

   If you change `roadmap.json` or the pinned copy of the roadmap, also run the command below. It
   reads the source file at the snapshot on GitHub and needs `marked@12`
   (`npm install --no-save marked@12`). The pull request runs it too.

   ```
   GITHUB_TOKEN="$(gh auth token)" node .github/scripts/build-roadmap.mjs --evidence
   ```

   Thirteen drawings of the capture journey are in the site look: `bundle-chain.svg` and
   `reward.svg` (chapter 1), `map-pins.svg`, `map-clusters.svg`, and `tree-page.svg` (chapter 2),
   `no-token.svg`, `token-mint.svg`, `token-transfer.svg`, and `token-page.svg` (chapter 3), and
   `org-account.svg`, `org-export.svg`, `org-numbers.svg`, and `org-cards.svg` (chapter 4).
   Each holds a small copy of the Archivo font with only the characters of its words. If you change
   their words, also run `.github/scripts/subset-drawing-font.py`. Its first lines tell you how to
   get the font file and fontTools. `node .github/scripts/build-capture-journey.mjs` gives each
   drawing the site colors.

6. Open a pull request. `main` accepts changes only through a pull request. The required checks
   must pass.

## Change the contributors page

The [contributors page](https://greenstand.github.io/greenstand-documentation/contributors.html)
is on the Pages site only. The deploy builds it from public GitHub data on each run, and once a
day. No data file is in this repo. Two lists in [`recognition.json`](./recognition.json) change
the counts. Change them by a pull request:

- `bots`: an account of type User that is a bot, for example an AI coding agent with its own
  account. Give its account id (`gh api users/<login> -q .id`), its login, and a note.
- `excluded`: an item to leave out, for example spam: the URL of a pull request, of a comment on
  it (`#issuecomment-<id>`), or of a review of it (`#pullrequestreview-<id>`), and a reason.

When a pull request changes `recognition.json`, the required check also reads GitHub: each bot
account and each excluded item must exist. Run the same check before you push:
`GITHUB_TOKEN="$(gh auth token)" node .github/scripts/build-contributors.mjs --evidence`. When an
entry matches nothing in the data at a deploy (for example, GitHub deleted the spam), the deploy
gives a warning. Then remove the entry.

A person asks to be removed with the form
[Remove me from the contributors page](https://github.com/Greenstand/greenstand-documentation/issues/new?template=understand-greenstand-remove-me.yml).
A maintainer of this repo adds the account id of the issue author to the `RECOGNITION_OPT_OUT`
secret (account ids, or `none`), and runs the deploy workflow by hand, within 7 days. To put a
person back, the maintainer removes the id in the same way. The secret keeps the list out of public
view.

## Change the shared-resource page or the capture journey

The page `docs/shared-resources.md` must hold no security detail. The same holds for the capture
journey. A security detail is a fact that helps an attacker or shows a weak point of a shared
resource or a code repo. Thus a pull request that changes `docs/shared-resources.md` or
`shared-resources.json` needs a safety review. So does a pull request that changes
`capture-journey.json`, a text copy `docs/capture-journey*.md`, or a file in
`docs/capture-journey/`. A reviewer who did not write the change checks the changed text against the
local findings list, before the pull request opens. This list is private. If you do not have the
list, ask a maintainer to do the review. When the text has no security detail, the reviewer gives
you this line, and you add it to the pull request text:

`Safety review: the page text was checked against the local findings list on <YYYY-MM-DD>. It
has no security detail.`

Each page has one item. Copy the item of each page that the pull request changes into the pull
request text, unticked. The maintainer who merges ticks it. The `private-names` check fails until
the pull request text has the line and the ticked item of each page that the pull request changes.
Add the line once, also when the pull request changes both pages. The items
(`.github/scripts/check-safety-review.mjs` holds the same words):

- [ ] If this pull request changes `docs/shared-resources.md` or `shared-resources.json`: I confirm
  that the page has no security detail.
- [ ] If this pull request changes `capture-journey.json`, a text copy `docs/capture-journey*.md`,
  or `docs/capture-journey/`: I confirm that the pages have no security detail.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: volunteer developers who are new to Greenstand (confirmed 2026-11-02).
They arrive from the Greenstand community or from GitHub, often on a laptop, sometimes on a
phone. Their job: find the right code repo, open its knowledge-graph viewer and onboarding guide,
and understand how the repos work together before they pick a first task.

Second: Greenstand maintainers, who check the facts and keep the estate. Non-technical readers
(funders, partners) are not a target.

## Product Purpose

`understand-greenstand` is machine-generated documentation for the core-active Greenstand
repository estate, with edited pages on top. Each documented repo has an interactive
knowledge-graph viewer, an onboarding guide, a glossary, and a README. Cross-repo pages explain
the whole system: the ecosystem maps, the shared-resource page, the estate glossary, the
capture journey (one tree photo through the Greenstand system, in chapters: chapter 1 from the
grower's phone to the grower's reward, chapter 2 onto the public web map, chapter 3 to an impact
token in a wallet, chapter 4 into the data for organizations), and the roadmap page (the Greenstand
roadmap at a snapshot, by the areas of the estate).

Success: a new volunteer finds the right repo and understands the big picture without a
maintainer's help.

## Positioning

Every fact on the site links to the file that proves it, at a named snapshot commit, and a
weekly drift report says when a fact or a repo is out of date. The site says when a fact is a
best guess or when code does not work today.

## Operating Context

- A static GitHub Pages site, built by Node scripts in `.github/scripts/` (no framework). Pages:
  the landing page, markdown pages rendered by `render-md.mjs`, the capture journey page
  (`capture-journey-page.mjs`), the roadmap page (`roadmap-page.mjs`), the moved pages, the
  contributors page (`contributors-page.mjs`, built from public GitHub data on each deploy), and
  one viewer per repo.
- Each page but the contributors page also has a markdown text copy on GitHub; GitHub draws that
  copy with its own look.
- Readers use light and dark color schemes; the site follows `prefers-color-scheme`.

## Capabilities and Constraints

- Scope of the visual work (user, 2026-11-02): the built pages (landing, text pages, capture
  journey, moved pages; the contributors page since 2026-11-03; the roadmap page since 2026-11-09). The knowledge-graph viewer is a third-party app (Understand-Anything,
  changed only by a patch) and keeps its own theme.
- No hosted third-party assets at run time: vendored files only, each hash-checked (as Mermaid
  is today).
- Text follows ASD-STE100 (Simplified Technical English) and never uses the em dash.
- Never show a private Greenstand repo name or a security detail on any page.
- One name for one thing, the name that the edited pages use: for example "grower", not
  "planter" (`docs/capture-journey.md` says why), and "capture".

## Brand Commitments

No binding Greenstand brand (user, 2026-11-02): no Greenstand colors or logo are required, and
the site uses no Greenstand logo until Greenstand approves one. The maintainer asked for a muted,
environment-themed look (2026-11-02).

## Evidence on Hand

- Android test screenshots of the Treetracker app and SVG drawings in `docs/capture-journey/`.
- The data files `estate.json`, `ecosystem.json`, `shared-resources.json`,
  `capture-journey.json`.
- No photographs of trees, growers, or planting sites. Do not invent field photos or people.

## Product Principles

1. Every claim points to its proof.
2. Say what is not known: best guesses and broken parts stay visible.
3. One word for one meaning, in simple English, for readers whose first language is not English.
4. The newcomer's path comes first.

## Accessibility & Inclusion

Many readers are not native English speakers. Readers use light and dark schemes, laptops and
phones. Text contrast must meet WCAG 2.2 AA in both schemes.

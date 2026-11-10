# Onboarding Guide: Greenstand-Overview

## Project Overview

**Name:** Greenstand-Overview
**Languages:** markdown, jpg, png, unknown (binary images, extension-less text file)
**Frameworks:** none: this is a documentation repo, not a code service.

Greenstand-Overview is the central onboarding and overview repo for Greenstand's
Treetracker project. It is a **documentation-only repository**: contributor guide,
nonprofit bylaws, token model whitepaper, roadmap, team directory, BDD guide, and
license/code-of-conduct docs. It points readers to the actual code repos
(`treetracker-android`, `treetracker-admin-client`, `treetracker-web-map-client`,
and `treetracker-wallet-api`) that make up the Treetracker platform. There is no
application code, no build system, and no tests in this repo.

## Architecture Layers

The knowledge graph groups the 15 documents into 5 content-based layers (there is
no code architecture to speak of, so layers reflect document purpose):

### 1. Onboarding & Contributor Guide
Entry-point and how-to documents that orient new contributors.
- `README.md`: project entry point; introduces the platform and links to everything else
- `BDD-GUIDE.md`: Behaviour-Driven Development workflow (Gherkin, WebdriverIO/Cucumber, PR checklist)
- `Resrouces/Github Basics`: fork-and-pull Git/GitHub workflow guide (extension-less text file)
- `Issues-lndex.md`: index of GitHub issue trackers across the Treetracker ecosystem repos

### 2. Governance & Legal
Formal organizational and legal documents.
- `Greenstand-Bilaws.md`: nonprofit corporate bylaws (board, officers, amendment procedures)
- `License, Code of Conduct etc/CODE_OF_CONDUCT.md`: Contributor Covenant
- `License, Code of Conduct etc/LICENSE`: AGPL-3.0 full text
- `TEAM.md`: governance and engineering team roles, leads, renewal dates

### 3. Product Strategy & Planning
Forward-looking planning documents.
- `Roadmap.md`: feature development roadmap across the ecosystem
- `Resrouces/Project-Deliverables.md`: three-tier project deliverables strategy

### 4. Token Economy
- `Greenstand-Token.md`: whitepaper defining the Greenstand Token framework (NFT/fungible
  tokens linked to environmental assets, token states, trading mechanics, node-network verification)

### 5. Visual Assets & Diagrams
Supporting images referenced by the other documents.
- `Resrouces/Greenstand-Token-png.png`: token logo/branding image
- `Resrouces/Old Tree Planting Flow Diagram.jpg`: earlier tree-planting workflow diagram
- `Resrouces/Tree Grower Support Model.png`: grower support model diagram
- `wiki-images/spatial-cluster-database-schema.png`: spatial cluster database schema diagram

Note: two directories have spaces in their names (`License, Code of Conduct etc/`
and `Resrouces/` (a repo-original typo, kept as-is)) and one image lives in a
separate top-level `wiki-images/` directory.

## Key Concepts

- **This repo has no code.** Every node in the knowledge graph is a `document` type.
  There are no `imports`, `calls`, or data-flow edges: only `documents` and `related`
  edges between docs that link to each other.
- **README.md is the hub.** It links directly to `BDD-GUIDE.md`, `Roadmap.md`,
  `TEAM.md`, `Issues-lndex.md`, and `Resrouces/Github Basics`.
- **Fork-and-pull is the required contribution model**, documented in
  `Resrouces/Github Basics`: fork the repo, branch, commit, push to your fork, open
  a PR against upstream.
- **BDD is the required development process**, documented in `BDD-GUIDE.md`: write a
  Gherkin feature file first, then implement WebdriverIO/Cucumber step definitions,
  then follow the PR checklist.
- **The Greenstand Token is a whitepaper concept**, not code implemented in this
  repo: it describes tokens linked to environmental assets (e.g. planted trees),
  moving through states from creation to trade, verified by a distributed node
  network.
- **Governance is two-layered**: legal bylaws (`Greenstand-Bilaws.md`) define the
  nonprofit's formal board/officer structure; `TEAM.md` maps that onto day-to-day
  community and engineering roles.

## Guided Tour

The knowledge graph's tour walks a new contributor through the repo in 7 steps:

1. **Project Overview**: `README.md`. The front door: what Treetracker is, and
   where to find the team, roadmap, and open issues.
2. **Contributing to the Project**: `Resrouces/Github Basics`, `BDD-GUIDE.md`. The
   practical how-to: Git fork-and-pull workflow, then the BDD development process
   and PR checklist.
3. **Team and Governance**: `TEAM.md`, `Greenstand-Bilaws.md`. Who runs the
   project day-to-day, and the legal nonprofit structure behind it.
4. **Community Standards and Licensing**: `CODE_OF_CONDUCT.md`, `LICENSE`. The
   behavioral and legal ground rules for anyone touching the codebase.
5. **Product Strategy and Finding Work**: `Roadmap.md`, `Project-Deliverables.md`,
   `Issues-lndex.md`. Where the product is headed, and how to find a ticket to
   pick up.
6. **The Token Economy**: `Greenstand-Token.md`. The most technical, domain-specific
   document: the token whitepaper.
7. **Visual Assets and Diagrams**: the 4 image files. Supporting diagrams that make
   the concepts from earlier steps concrete (not meant to be read standalone).

## File Map

- **`README.md`**\
  Layer: Onboarding\
  What it covers: Platform overview, contribution entry point, team/roadmap links
- **`BDD-GUIDE.md`**\
  Layer: Onboarding\
  What it covers: Gherkin/WebdriverIO/Cucumber BDD workflow, PR checklist
- **`Resrouces/Github Basics`**\
  Layer: Onboarding\
  What it covers: Fork-and-pull Git/GitHub workflow
- **`Issues-lndex.md`**\
  Layer: Onboarding\
  What it covers: Cross-repo GitHub issue tracker index
- **`Greenstand-Bilaws.md`**\
  Layer: Governance & Legal\
  What it covers: Nonprofit bylaws: board, officers, amendments
- **`License, Code of Conduct etc/CODE_OF_CONDUCT.md`**\
  Layer: Governance & Legal\
  What it covers: Contributor Covenant
- **`License, Code of Conduct etc/LICENSE`**\
  Layer: Governance & Legal\
  What it covers: AGPL-3.0 license text
- **`TEAM.md`**\
  Layer: Governance & Legal\
  What it covers: Team roles, leads, renewal dates
- **`Roadmap.md`**\
  Layer: Product Strategy\
  What it covers: Feature development roadmap
- **`Resrouces/Project-Deliverables.md`**\
  Layer: Product Strategy\
  What it covers: Three-tier deliverables strategy
- **`Greenstand-Token.md`**\
  Layer: Token Economy\
  What it covers: Token framework whitepaper
- **`Resrouces/Greenstand-Token-png.png`**\
  Layer: Visual Assets\
  What it covers: Token logo/branding image
- **`Resrouces/Old Tree Planting Flow Diagram.jpg`**\
  Layer: Visual Assets\
  What it covers: Legacy workflow diagram
- **`Resrouces/Tree Grower Support Model.png`**\
  Layer: Visual Assets\
  What it covers: Grower support model diagram
- **`wiki-images/spatial-cluster-database-schema.png`**\
  Layer: Visual Assets\
  What it covers: Spatial cluster DB schema diagram

## Complexity Hotspots

Complexity here reflects document length/density, not code complexity:

- **`Greenstand-Token.md`** (complex, 592 lines): the longest, most conceptually
  dense document: 42 headings covering token lifecycle, RVI (Relative Value Index)
  formulas, and node-network economics. Read the terminology section first.
- **`License, Code of Conduct etc/LICENSE`** (complex, 661 lines): full AGPL-3.0
  legal text; the network-use clause is the detail most relevant to Greenstand's
  server-side platform components.
- **`Roadmap.md`** (complex, 288 lines): spans many workstreams (privacy, mobile,
  web map, token API, DevOps, admin panel, auth, RVI tooling, blockchain network).

Everything else in the repo is short (simple-to-moderate) and quick to read in full.

## Business Domains (from domain-graph.json)

The domain graph models 4 domains as **documentation-described processes**: these
narrate how the org and its docs describe contribution/governance/token workflows;
none of them are code-implemented business logic (there is no code in this repo):

- **Contributor Onboarding & Development Workflow**: project onboarding, BDD
  feature development, GitHub fork-and-pull (3 flows, 13 steps)
- **Governance & Legal**: nonprofit governance structure, code-of-conduct
  enforcement (2 flows, 7 steps)
- **Token Economy (Greenstand Token)**: token creation & verification, token
  trading lifecycle (2 flows, 8 steps)
- **Product Strategy & Planning**: roadmap planning, issue-tracking navigation
  (2 flows, 8 steps)

9 flows total, 36 steps, 48 edges (9 `contains_flow`, 36 `flow_step`, 3 `cross_domain`).

## Regenerating

See [`../../docs/regenerating.md`](../../docs/regenerating.md). In short: clone the
source repo, run `/understand` then `/understand-domain` then `/understand-onboard`,
and replace this directory.

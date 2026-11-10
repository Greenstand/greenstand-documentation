# How to contribute to Greenstand

Welcome. Greenstand is a nonprofit organization. A remote community of volunteers builds its
open-source platform, Treetracker. Greenstand does not compete with tree-planting projects. It
is a technical service provider to them: the projects use Treetracker to verify their work (see
[The Model](https://docs.greenstand.org/overview/introduction/the-model)). Growers use the
Treetracker app to take geotagged photos of the trees that they plant and keep alive. Each
photo, with its place and time, is a capture. Admins verify the captures in the admin panel.
The web map shows the trees. Funders can pay the growers for the verified captures, and verified
captures can become tokens.

You do not need to be an expert. Greenstand needs developers, testers, writers, designers,
translators, and organizers. The community helps newcomers start.

This page is a short path from your first visit to your first contribution. Steps 1 to 4 lead
to a code contribution. [Help without code](#help-without-code) shows the other ways to help.
Where Greenstand's own guides give more detail, this page links to them.

## 1. Join the community

1. Sign up on Greenstand's [volunteer page](https://greenstand.org/contribute/volunteer). Use
   the Engineering form for code work, and the Operations form for other skills.
2. Join Greenstand's Slack from the same page. Slack is the main place where the community
   talks. [Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics) tells
   you which channel to use.
3. Read the [Code of Conduct](https://github.com/Greenstand/Greenstand-Overview/blob/master/License%2C%20Code%20of%20Conduct%20etc/CODE_OF_CONDUCT.md).
   All members of the community agree to follow it.

The full steps are in [Join the team](https://github.com/Greenstand/Greenstand-Overview#join-the-team).

## 2. Learn how the platform fits together

- Read [Greenstand-Overview](https://github.com/Greenstand/Greenstand-Overview): the mission,
  the big picture of the platform, and the roadmap.
- Read [The journey of a capture](./capture-journey.md). It follows one capture, a tree photo with
  its GPS point and its tree data, from the grower's phone to the grower's reward.
- Open the [repository index](../README.md). It groups the main source repos by area: core API,
  wallet, admin, web map, mobile, data ingest, and infrastructure. Each repo has an interactive
  viewer with a guided tour, an onboarding guide, and a glossary.
- Look at the [ecosystem maps](../ARCHITECTURE.md). They show how the repos work together:
  which app calls which API, and which data they share.
- Look at the [shared-resource page](./shared-resources.md). It shows what the code repos share
  to build, deploy, and run, for example the container registry, the clusters, and the shared
  database.
- Use the [estate glossary](../GLOSSARY.md) when a business term is new to you, for example
  capture, token, or wallet.

## 3. Pick a first task

- Find an issue with the `good first issue` label:
  [open good first issues in all Greenstand repos](https://github.com/search?q=org%3AGreenstand+label%3A%22good+first+issue%22+is%3Aissue+is%3Aopen+archived%3Afalse&type=issues&s=updated&o=desc).
  The search shows the most recently updated issues first. Some of these issues are old.
  Choose an issue with recent activity, or ask in the issue if Greenstand still needs the work.
- The [project boards](https://github.com/orgs/Greenstand/projects) show the current
  priorities.
- Before you start, tell the community: add a comment to the issue, or post in the related
  Slack channel. This prevents two volunteers from doing the same work.

## 4. Set up a repo and open a pull request

- Read the onboarding guide of the repo in the [repository index](../README.md). It explains
  the architecture, the main modules, and the business terms of the repo.
- To install and run the repo, follow the README of the source repo, and its
  `CONTRIBUTING.md` if it has one. The source repo is the reference for setup.
- Greenstand uses the fork-and-pull model: fork the source repo, make your change on a branch,
  and open a pull request.
  [Basic GitHub skills](https://github.com/Greenstand/Greenstand-Overview#basic-git-hub-skills-required)
  links to guides for this model.
- Keep each pull request small: one issue, one pull request. A small pull request is easier to
  review.
- After your first pull request, look for your name on the
  [contributors page](https://greenstand.github.io/greenstand-documentation/contributors.html).
  It thanks each person who contributed this quarter, and it welcomes each new contributor.

## Help without code

- **Testing.** Test new features in the admin panel, the web map, and the Treetracker app
  before Greenstand releases them. If you find a broken link or a button that does not work,
  report it as an issue in the source repo. This is a good first contribution.
- **Translation.** Translate the text of the Treetracker app into a language that you know.
  The [open translation issues](https://github.com/Greenstand/treetracker-android/issues?q=is%3Aissue+is%3Aopen+translation)
  of the app show the languages that need help.
- **Triage.** Greenstand needs help to clean up and organize its issues. Choose an old issue,
  try the problem again, and add a comment that tells if the problem still occurs.
- **Documentation.** Improve the docs of a source repo with a pull request. If a page in these
  generated docs is wrong, open a [Wrong docs](https://github.com/Greenstand/greenstand-documentation/issues/new?template=understand-greenstand-wrong-docs.yml)
  issue in this repo.
- **Operations.** Greenstand also needs help with communications, marketing, fundraising,
  graphic design, and nonprofit management. Use the Operations form on the
  [volunteer page](https://greenstand.org/contribute/volunteer).

[Ongoing needs](https://github.com/Greenstand/Greenstand-Overview#ongoing-needs) has
Greenstand's current list.

## Get help

When you are not sure, ask. Questions are welcome.

- In Slack: ask in the related channel.
  [Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics) lists the
  channels.
- In the issue that you work on: add a comment.
- By email: [info@greenstand.org](mailto:info@greenstand.org).

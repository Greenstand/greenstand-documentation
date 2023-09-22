---
description: >-
  The objective of this document is to provide new volunteers with a
  step-by-step guide to start contributing to the Admin Panel tool at
  Greenstand.
---

# Quickstart

## 1. Installing VSCode

You will need to set up your Integrated Development Environment (IDE) to start contributing. At Greenstand, we recommend using Visual Studio Code (VSCode) as your IDE.

[Click here](https://code.visualstudio.com/) to download and install the latest version of VSCode for your OS.

{% hint style="info" %}
If you have any issues installing VSCode, please check their detailed step by step guides for [MacOS](https://code.visualstudio.com/docs/setup/mac), [Linux](https://code.visualstudio.com/docs/setup/linux) and [Windows](https://code.visualstudio.com/docs/setup/windows).
{% endhint %}

{% hint style="warning" %}
Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VSCode. Projects come with a `.prettierrc` config file that enforces code format standards and avoids styling issues among developers.
{% endhint %}

{% embed url="https://www.youtube.com/watch?v=KyU1pGs_dXk&ab_channel=CarlosMartins" %}
Getting familiar with VSCode
{% endembed %}

## 2. Setting up GitHub

1. Create a [GitHub account](https://github.com/).
2. [Install Git](https://docs.github.com/en/github/getting-started-with-github/set-up-git) on your local machine.
3. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the [Greenstand/admin-panel-client](https://github.com/Greenstand/treetracker-admin-client) repo.
4. [Clone the forked repo](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to your local machine.
5. [Add upstream remotes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork) to your local cloned repo.

## 3. Installing nvm, Node and setting up local variables

We are currently using Node version 16 to develop our projects. You can manage node versions installed on your machine by using Node Version Manager (nvm).

*   Download the nvm install script via cURL:

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    ```
* Ensure that nvm was installed correctly with `nvm --version`, which should return the version of nvm installed.
* Run `nvm install` at the root directory of `treetracker-admin-client` to install the current version of Node supported by the project  (this checks [.nvmrc](https://github.com/Greenstand/treetracker-admin-client/blob/master/.nvmrc) for the version).
* Run `npm install` to download project dependencies.

{% hint style="warning" %}
### Dependency errors

You may encounter Node dependency errors:

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
```

If so, run `npm install --legacy-peer-deps`
{% endhint %}

{% hint style="danger" %}
### Issues with different Node versions

Different Node version might cause unexpected problems. Please ensure that you are running the version of Node in [.nvmrc](https://github.com/Greenstand/treetracker-admin-client/blob/master/.nvmrc) in the project root.
{% endhint %}

## 4. Finding issues to work on

1. Browse [Admin Panel issues](https://github.com/Greenstand/treetracker-admin-client/issues) and [Project boards](https://github.com/Greenstand/treetracker-admin-client/projects?query=is%3Aopen) for something to work on.
2. Find an issue you are interested in.

{% hint style="info" %}
Issues are labeled to help you in your selection:

* **Good first issue:** a fairly simple, well-defined issue to ease you into the project.
* **Size:** describes the amount of work for the issue. Values: small, medium, large.
* **Dependencies:** issue depends on other repo work, e.g. api. The corresponding issue will be linked (if it exists) and may be available to work on too.
* **Priority:** high priority issue.
* **Tool:** different routes and tools that the issue belongs to. Values: Stakeholders, Capture Matching, Dashboard, Growers, Species, Captures, User Manager, Verify, Messaging, Earnings, Regions, Contracts.
* **Type:** type of work for the issue: Values: enhancement, bug, refactoring.
{% endhint %}

Once you've found something you are interested in, comment on the issue requesting to be assigned to it:

> I would like to work on this issue!

Once you are assigned the issue, follow the git workflow below to contribute.

## 5. Development workflow with Git

Before you start to code, make sure your local and forked repos are up to date with Greenstand's upstream repo.

* Change to master branch: `git checkout master`
* Sync local repo with upstream: `git pull upstream master --rebase`
* Push upstream commits to fork: `git push origin master`

Start working on your issue by creating a new feature branch:

* Create new feature branch: `git checkout -b 'your-branch-name'`

Commit your changes as you go along to make sure you don't lose them:

* Add changes to staging: `git add .`
* Create commit: `git commit -m 'commit message here'`

{% hint style="warning" %}
We enforce conventional commit message standard that follow the pattern \[scope]: description, for example `feat: add species filter.`

Commits will fail if commit messages do not follow this pattern. Other available scopes are:  `fix:, feat:, build:, chore:, docs:, style:, refactor:, perf:, test:, ci:`
{% endhint %}

Once you're happy with your changes, sync with Greenstand's upstream repo before pushing your commits:

* Change to master branch: `git checkout master`
* Sync local repo with upstream: `git pull upstream master --rebase`
* Push upstream commits to fork: `git push origin master`
* Change to your feature branch: `git checkout 'your-feature-branch'`
* Apply upstream commits: `git rebase master`
* Resolve any possible conflicts with upstream commits
* Push feature branch to fork: `git push origin 'your-feature-branch'`
* [Create a pull request from your fork](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

In your pull request comments, add a link to the issue you worked on:

> Resolves #123

Code reviewers will review your pull request and either merge it to Greenstand's repo or request changes.&#x20;

{% hint style="info" %}
If changes are requested, follow the same workflow in this section using the already created feature branch. After pushing commits to your fork, GitHub will automatically update the pull request to reflect your changes. Ask a reviewer to [re-review your pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/requesting-a-pull-request-review).
{% endhint %}

Congratulations! You just made your first contribution to Greenstand!


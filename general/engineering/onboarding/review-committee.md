---
description: >-
  Volunteers who test our apps and give pull requests their first review, so
  maintainers only do the final check and merge.
---

# Test and Review Committee

Greenstand has many contributors but only a few maintainers who can merge. The Test and Review Committee helps pull requests move faster: we test the apps, give each pull request its first review, and hand it to a maintainer when it is ready.

> **Meetings:** every Wednesday, 11 AM ET (4 PM GMT), as a huddle in the **#engineering** Slack channel. Everyone is welcome.

## How to join

1. Pick **one repo to review** or **one app to test** from the tables below.
2. Add your GitHub username to the table in a small pull request, or reply in the committee thread in **#engineering**.
3. Join the Wednesday meeting.

## Repos to review

Each repo needs **at least 2 reviewers**, so one can cover when another is busy. More are welcome.

| Area | Repo | What it is | Reviewers |
| --- | --- | --- | --- |
| Core API | [treetracker-api](https://github.com/Greenstand/treetracker-api) | Captures and trees (core data) | |
| Core API | [treetracker-query-api](https://github.com/Greenstand/treetracker-query-api) | Read API for the map and apps | |
| Core API | [images-api](https://github.com/Greenstand/images-api) | Resizes images | |
| Admin | [treetracker-admin-api](https://github.com/Greenstand/treetracker-admin-api) | Admin panel backend | |
| Admin | [treetracker-admin-client](https://github.com/Greenstand/treetracker-admin-client) | Admin panel screens | |
| Admin | [treetracker-stakeholder-api](https://github.com/Greenstand/treetracker-stakeholder-api) | Organizations | |
| Wallet | [treetracker-wallet-api](https://github.com/Greenstand/treetracker-wallet-api) | Tokens and transfers | |
| Wallet | [treetracker-wallet-app](https://github.com/Greenstand/treetracker-wallet-app) | Wallet app | |
| Wallet | [treetracker-wallet-admin-client](https://github.com/Greenstand/treetracker-wallet-admin-client) | Wallet admin screens | |
| Web map | [treetracker-web-map-client](https://github.com/Greenstand/treetracker-web-map-client) | The public map | |
| Web map | [treetracker-tile-server](https://github.com/Greenstand/treetracker-tile-server) | Map tiles | |
| Mobile | [treetracker-android](https://github.com/Greenstand/treetracker-android) | Grower app for Android | |
| Mobile | [treetracker-ios](https://github.com/Greenstand/treetracker-ios) | Grower app for iOS | |
| Data ingest | [treetracker-field-data](https://github.com/Greenstand/treetracker-field-data) | Receives captures from phones | |
| Data ingest | [treetracker-airflow-dags](https://github.com/Greenstand/treetracker-airflow-dags) | Scheduled data jobs | |
| Infrastructure | [treetracker-infrastructure](https://github.com/Greenstand/treetracker-infrastructure) | Servers and clusters | |
| Docs | [greenstand-documentation](https://github.com/Greenstand/greenstand-documentation) | This documentation | |

## Apps to test

Each app needs **at least 2 testers**. More are welcome.

| App | Code | Testers |
| --- | --- | --- |
| Admin panel (Keycloak login) | [treetracker-admin-client](https://github.com/Greenstand/treetracker-admin-client) | |
| Wallet admin app | [treetracker-wallet-admin-client](https://github.com/Greenstand/treetracker-wallet-admin-client) | |
| Wallet app ([wallet.treetracker.org](https://wallet.treetracker.org)) | [treetracker-wallet-app](https://github.com/Greenstand/treetracker-wallet-app) | |
| Web map ([map.treetracker.org](https://map.treetracker.org)) | [treetracker-web-map-client](https://github.com/Greenstand/treetracker-web-map-client) | |
| Android grower app | [treetracker-android](https://github.com/Greenstand/treetracker-android) | |
| iOS grower app | [treetracker-ios](https://github.com/Greenstand/treetracker-ios) | |

## How we work

### Reviewing a pull request

* When a new pull request opens, the repo's reviewers add the `needs first review` label and tag themselves.
* Read the linked issue and the changes. For code changes, run the branch locally and its tests.
* Leave clear, specific comments on the pull request.
* When it is ready, add the `ready for maintainer` label and tag a maintainer.
* Reviewers never merge. Maintainers do the final check and merge.

### Testing an app

* Follow a real user flow, for example sign up, log in or send a token.
* Search the existing issues first.
* For a new bug, open an issue with the steps, the expected result and the actual result, plus a screenshot.

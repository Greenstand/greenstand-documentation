# Onboarding Guide: treetracker-admin-client (Treetracker Admin Panel Client)

_Generated from the Understand-Anything knowledge graph. Source commit `ecbfe05`._

## Project Overview

The **Treetracker Admin Panel Client** is the React web frontend Greenstand staff use to
verify, process, and manage tree-planting data (captures, growers, species) collected by the
Treetracker mobile app. It is built with create-react-app and Material UI, and is mid-migration
from a single legacy dedicated API to a set of focused Greenstand microservices (treetracker-api,
earnings-api, field-data, query-api, regions-api, reporting, stakeholder-api).

- **Languages:** JavaScript, CSS, HTML, JSON, YAML, Markdown, shell
- **Frameworks:** React, Redux (via @rematch/core), GitHub Actions
- **Entry point:** `src/index.js` (renders the app and registers the service worker), which
  delegates early setup to `src/init.js` before `src/App.js` takes over as the root component.

The code follows a recurring **Context provider → API client → page/feature component** pattern
repeated per feature area (Captures, Growers, Species, Regions, Stakeholders, Messaging,
Earnings/Payments), all gated behind a global `AppContext` for auth/session/permissions.

## Architecture Layers

- **UI Layer**\
  Files: 124\
  What it holds: React components, views, and the root App shell rendering all admin screens (captures, growers, species, messaging, payments, earnings, stakeholders) using Material UI.
- **Service Layer**\
  Files: 22\
  What it holds: API client modules (`src/api/*.js`) and React Context providers (`src/context/*.js`) that fetch data from Greenstand microservices/legacy API and expose it to the UI, plus app bootstrap and service-worker wiring.
- **Data Layer**\
  Files: 6\
  What it holds: Domain model classes (`Filter`, `FilterGrower`, `FilterRegion`, `FilterStakeholder`, `auth`) encapsulating query/filter state, plus the Rematch model barrel file.
- **Utility Layer**\
  Files: 6\
  What it holds: Shared pure helpers for numbers, locale, icon paths, and general utilities reused across components and services.
- **Test Layer**\
  Files: 52\
  What it holds: Cypress end-to-end and component specs with support pages/fixtures/plugins, plus Jest unit tests, mocks, and setup.
- **Infrastructure & CI/CD**\
  Files: 12\
  What it holds: GitHub Actions workflows (PR checks, build & release, deploy) and their job steps, plus the staging deploy script.
- **Configuration**\
  Files: 21\
  What it holds: Env files, package/lint/release config, Storybook setup, static public assets (PWA manifest, sample earnings dataset).
- **Documentation**\
  Files: 6\
  What it holds: README, CHANGELOG, PR template, and architecture/Rematch guides in `docs/`.

## Key Concepts

- **Context-per-feature pattern.** Beyond the global `AppContext` (auth, session, permissions,
  organization: 44 incoming references, the most depended-upon module in the codebase), each
  feature area gets its own React Context provider (`CapturesContext`, `VerifyContext`,
  `GrowerContext`, `MessagingContext`, `RegionContext`, `StakeholdersContext`) that owns data
  fetching and local state for that slice of the app.
- **API client per microservice domain.** `src/api/*.js` modules (`treeTrackerApi.js`,
  `growers.js`, `messaging.js`, `regions.js`, `stakeholders.js`, `earnings.js`) wrap HTTP calls
  behind small typed functions, sharing request/auth/error helpers from `apiUtils.js`.
- **Filter model convention.** Plain model classes (`Filter.js`, `FilterGrower.js`,
  `FilterRegion.js`, `FilterStakeholder.js`) encapsulate search criteria and expose a
  `getWhereObj()`-style method that turns UI filter state into an API query object. Filter
  sidebar/drawer components (`CaptureFilter.js`, `FilterTopGrower.js`, `Stakeholders/Filter.js`)
  build and pass these to the Context layer.
- **Permission-gated routing.** `Routers.js` declares all top-level routes and wraps
  private routes with `PrivateRoute.js`, checking `AppContext` permission state (backed by
  `models/auth.js`).
- **Testing pyramid.** Jest/React Testing Library unit/integration tests (`*.test.js`), Cypress
  component tests (`cypress/component/*.spec.py.js`, mounted with mocked Redux store), and full
  Cypress end-to-end tests (`cypress/integration/*.spec.py.js`) against a real browser.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Project Overview**: `README.md` and `package.json` establish the purpose (Admin Panel
   frontend), the API migration context, and the Material UI + Redux/Rematch + CRA foundation.
2. **Application Bootstrap**: `src/index.js` renders the app and registers the service worker,
   delegating to `src/init.js` for early setup before `src/App.js` becomes the root component.
3. **Routing and Global Providers**: `Routers.js` wires every route (Verify, Growers,
   Messaging, Species, Payments, Earnings, Stakeholders) behind `AppContext`; `theme.js` supplies
   the shared Material UI theme.
4. **API / Service Layer**: `treeTrackerApi.js` is the central API client; `apiUtils.js`
   provides shared request helpers; `growers.js` shows the per-microservice module pattern.
5. **The Context / State Pattern**: `CapturesContext`, `VerifyContext`, and
   `CaptureDetailContext` show the recurring Context-wraps-API pattern repeated per feature.
6. **Feature Vertical: Capture Verification**: `Verify.js`, `CaptureFilter.js`, and
   `Captures/CaptureTable.js` compose a full workflow screen on top of the Context layer.
7. **The Filter Domain Model**: `models/Filter.js` and `FilterGrower.js` show the
   `getWhereObj()` convention; `models/auth.js` adds permission-checking helpers.
8. **Feature Vertical: Messaging**: `MessagingContext`, `api/messaging.js`, `Messaging.js`,
   and `MessageBody.js` reinforce the pattern with a chat-style UI shape.
9. **CI/CD Pipeline**: `treetracker-frontend-pr.yml` (lint/build on PR),
   `build_and_release.yaml` (build, semantic-release, deploy to dev CDN on push), and
   `deploy.yaml` (manual promotion to staging/production via S3/CloudFront).
10. **Testing Strategy: Jest and Cypress**: `verify.test.js` (Jest/RTL),
    `capturesFilter.spec.py.js` (Cypress E2E), and `Filter.spec.py.js` (Cypress component test)
    show the three testing tiers.

## File Map (by layer)

- **UI Layer** (124 files, grouped by feature): `components/common/**` (19, shared table/filter/
  dialog primitives), `components/reportingCards/**` (15, dashboard stat cards),
  `components/Stakeholders/**` (12), `components/Messaging/**` (9), `components/Growers/**` (4),
  `components/Captures/**` (3), `components/CaptureMatching/**` (2), `components/Home/**` (2),
  plus top-level pages: `Verify.js`, `CaptureFilter.js`, `FilterTop.js`, `SidePanel.js`,
  `Regions.js`, `Users.js`, `Account.js`, `Login.js`, `Routers.js`, and `views/*View.js` route
  wrappers.
- **Service Layer:** `src/api/treeTrackerApi.js`, `apiUtils.js`, `growers.js`, `messaging.js`,
  `regions.js`, `stakeholders.js`, `earnings.js`; `src/context/AppContext.js`,
  `CapturesContext.js`, `VerifyContext.js`, `GrowerContext.js`, `MessagingContext.js`,
  `RegionContext.js`, `StakeholdersContext.js`, `SpeciesContext.js`, `TagsContext.js`,
  `CaptureDetailContext.js`, `MatchingToolContext.js`; `src/index.js`, `init.js`,
  `registerServiceWorker.js`.
- **Data Layer:** `src/models/Filter.js`, `FilterGrower.js`, `FilterRegion.js`,
  `FilterStakeholder.js`, `auth.js`, `index.js` (Rematch model barrel).
- **Utility Layer:** `src/common/numbers.js`, `variables.js`, `utils.js`, `locale.js`,
  `iconPaths.js`; `src/utilities/index.js`.
- **Infrastructure & CI/CD:** `.github/workflows/treetracker-frontend-pr.yml`,
  `build_and_release.yaml`, `deploy.yaml`; `scripts/install-staging.sh`.
- **Configuration:** `.env*`, `package.json`, `.releaserc.json`, `jsconfig.json`,
  `cypress.json`, `.storybook/**`, `public/manifest.json`, `public/earnings.json`.
- **Documentation:** `README.md`, `CHANGELOG.md`, `pull_request_template.md`,
  `docs/rematchTutorial.md`.

## Complexity Hotspots

Approach these areas carefully: they carry the most logic or the largest connectivity
(51 file-level nodes rated complex; the most connected ones are listed here):

- **`src/context/AppContext.js`** (complex, 44 edges): global auth/session/permission state;
  the most depended-upon module in the codebase.
- **`src/components/Verify.js`** (complex, 24 edges): main capture verification page,
  composing filter, side-panel, and detail-dialog components.
- **`src/components/Home/Home.js`** (complex, 24 edges): dashboard home page composing stat
  and reporting cards with a time-range filter.
- **`src/api/growers.js`** (complex, 24 edges): grower CRUD/query REST client.
- **`src/api/treeTrackerApi.js`** (complex, 20 edges): central API client for captures,
  growers, species, tags.
- **`src/components/Captures/CaptureTable.js`**, **`GrowerDetail.js`** (complex, 18 edges each):
  capture/grower tabular and detail views.
- **`src/components/CaptureFilter.js`**, **`reportingCards/ReportingCard.js`**,
  **`src/context/GrowerContext.js`**, **`Messaging/MessageBody.js`** (complex, 16 edges each).
- **`src/components/common/CustomTable/CustomTable.js`**: generic reusable data table with
  sort/pagination/CSV export/row drill-down, used across many feature tables.
- **`src/components/tests/verify.test.js`** (complex): large Jest/RTL suite exercising the
  Verify page end-to-end within the test runner.
- **`CHANGELOG.md`**, **`README.md`** (complex, large docs): big but low-risk; skim for
  context rather than logic.

---

_Regenerate with `/understand` then `/understand-onboard`. See `docs/regenerating.md` in the docs repo._

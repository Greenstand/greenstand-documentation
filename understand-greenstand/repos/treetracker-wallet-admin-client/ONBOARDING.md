# Onboarding Guide: treetracker-wallet-admin-client (Wallet Admin Client)

_Generated from the Understand-Anything knowledge graph. Source commit `62a60f3`._

## Project Overview

The **Treetracker Wallet Admin Client** is the Greenstand admin panel for wallets. Wallet owners
use it to display and transfer tokens and transactions, create sub-wallets, and configure a
wallet's appearance. It is a **React single-page app** (Create React App) that talks to the
Greenstand wallet API over `axios`.

- **Languages:** JavaScript, CSS/Sass, HTML, JSON, YAML, Markdown
- **Frameworks:** React 18, Material UI (MUI), Sass; axios, react-router-dom, react-quill, jwt-decode
- **Entry points:** `src/index.js` (DOM bootstrap) and `src/App.js` (composition root)

The code follows a layered, feature-oriented flow: **route table → page → context provider →
API client module → wallet API**, with a shared MUI theme and reusable UI components across every
feature.

## Architecture Layers

- **API Client Layer**\
  Files: 3\
  What it holds: Axios modules that call the Greenstand wallet backend for wallets, transfers, and trust relationships.
- **State Management Layer**\
  Files: 5\
  What it holds: React context providers plus auth context holding wallet, transfer, trust-relationship, and authentication state.
- **Shared Models & Utilities**\
  Files: 4\
  What it holds: Filter/query models and shared helpers (the axios instance factory, formatting).
- **Feature Pages**\
  Files: 62\
  What it holds: Route-level page views (login, wallets, transfers, trust relationships, send tokens, customize) with their forms, tables, side panels, styles, and tests.
- **Shared UI Components & Layout**\
  Files: 30\
  What it holds: Reusable presentational components, the app shell layout, sidebar menu, MUI theme, and the react-router route table.
- **Application Entry & Bootstrap**\
  Files: 7\
  What it holds: Root App wiring, DOM bootstrap, global styles, HTML mount document, web-vitals, and Jest test setup.
- **Build, CI/CD & Configuration**\
  Files: 23\
  What it holds: GitHub Actions release/deploy pipelines, semantic-release, env files, npm/lint/format tooling config, and the PWA manifest.
- **Documentation**\
  Files: 5\
  What it holds: README, changelog, contributing and code-of-conduct guides, plus the crawler robots file.

## Key Concepts

- **Feature-sliced pages.** Each feature (wallets, transfers, trust relationships, send tokens)
  lives under `src/pages/<Feature>/` with its own page, forms, table, side panel, styled
  components, and tests co-located.
- **Context providers own feature state.** `WalletsContext`, `TransfersContext`, and
  `TrustRelationshipsContext` load, prepare, and paginate their data. Pages consume these hooks
  instead of calling the API directly.
- **Single axios instance.** `src/utils/apiClient.js` is a configured axios instance with auth and
  API-key header helpers plus a `401` interceptor that redirects to the login page. The three
  `src/api/*.js` modules build on it, one per domain.
- **Auth is the route gate.** `auth-context.js` + `AuthProvider.js` manage login/logout, persist
  the JWT in storage, and decode it. `ClientRoutes.js` enforces authentication before rendering
  protected pages.
- **Central MUI theme.** `src/components/UI/theme.js` defines palette, typography, and component
  overrides so every page looks consistent. `Table.js` is the shared sortable, paginated grid
  behind the wallet, transfer, and trust tables.
- **Query/filter models.** `TransferFilter.js` and `TrustRelationShipFilter.js` shape the
  list/query parameters passed to the API modules.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Project Overview**: Read the `README.md` for purpose, use cases, and local development setup.
2. **Application Entry & Bootstrap**: `src/index.js` mounts the root `App`; `src/App.js` wires the MUI theme provider, auth provider, layout shell, and route table.
3. **Routing & App Shell**: `ClientRoutes.js` maps URLs to pages and enforces auth; `Layout.js` provides the sidebar `Menu` shell and mounts the Transfers/TrustRelationships providers.
4. **Authentication**: `auth-context.js` declares the shared context; `AuthProvider.js` manages login/logout, token storage, and JWT decode; `Login.js` collects wallet/password/API key.
5. **The API Client Layer**: `apiClient.js` (axios instance + 401 interceptor) underpins `wallets.js`, `transfers.js`, and `trust_relationships.js`.
6. **State Management Contexts**: `WalletsContext`, `TransfersContext`, and `TrustRelationshipsContext` own feature state, filters, and pagination.
7. **Wallets Feature**: `MyWallets.js` lists wallets with a create action; `Wallet.js` is the detail view; `CreateManagedWallet.js` creates sub-wallets.
8. **Transfers & Sending Tokens**: `MyTransfers.js` renders the transfers table; `SendTokens.js` orchestrates wallet selection and trusted/untrusted transfer tabs; `TransferFilter.js` shapes queries.
9. **Trust Relationships Feature**: `TrustRelationship.js` + `TrustRelationshipTable.js` show and act on relationships; `CreateTrustRelationship.js` requests new ones; `TrustRelationShipFilter.js` backs the queries.
10. **Shared UI Components & Theme**: `theme.js` (MUI palette/typography), `Table.js` (reusable grid), `Message.js`, and `Loader.js` provide consistent presentation and feedback.
11. **Project Manifest & Environment Config**: `package.json` declares the stack and CRA scripts; the `.env.*` files supply per-environment settings such as the wallet API base URL.
12. **Build, Release & Deployment**: `build-release.yaml` builds, semantic-releases, and deploys on push; `deploy.yaml` is the manual per-environment deploy.

## File Map (by layer)

- **API Client Layer:** `src/api/wallets.js`, `src/api/transfers.js`, `src/api/trust_relationships.js`
- **State Management Layer:** `src/store/WalletsContext.js`, `TransfersContext.js`, `TrustRelationshipsContext.js`, `AuthProvider.js`, `auth-context.js`
- **Shared Models & Utilities:** `src/models/TransferFilter.js`, `src/models/TrustRelationShipFilter.js`, `src/utils/apiClient.js`, `src/utils/formatting.js`
- **Feature Pages:** `src/pages/Login/**`, `MyWallets/**`, `Wallet/**`, `MyTransfers/**`, `SendTokens/**`, `TrustRelationship/**`, `CustomizeWallet/**`
- **Shared UI Components & Layout:** `src/components/Routes/ClientRoutes.js`, `src/components/layout/**` (Layout, Menu), `src/components/UI/theme.js`, `src/components/UI/components/**` (Table, Message, Loader)
- **Application Entry & Bootstrap:** `src/index.js`, `src/App.js`, `src/index.css`, `public/index.html`, `src/reportWebVitals.js`, `src/setupTests.js`
- **Build, CI/CD & Configuration:** `.github/workflows/**`, `.env.*`, `package.json`, `.releaserc.json`, lint/format config, `public/manifest.json`
- **Documentation:** `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

## Complexity Hotspots

Approach these areas carefully: they carry the most logic or the largest surface:

- **`src/pages/SendTokens/SendTokens.js`** and its forms (`SendTokensForm.js`, `SendToUntrustedWallets.js`, `SelectWallet.js`) (complex): the richest feature: wallet selection, trusted/untrusted tabs, token-amount validation, and inline wallet creation.
- **`src/store/TransfersContext.js`** and **`src/store/TrustRelationshipsContext.js`** (complex): central state, filters, pagination, and API orchestration.
- **`src/pages/MyTransfers/TransfersTable.js`**, **`TableFilters.js`** (complex): sortable/paginated table with a side panel and popover date-range filters.
- **`src/pages/TrustRelationship/TrustRelationshipTable.js`**, **`TrustRelationshipsFilters.js`**, **`CreateTrustRelationship.js`** (complex): the trust-relationship grid, filters, and create dialog.
- **`src/components/UI/components/Table/Table.js`** (complex): the reusable data grid behind every feature table.
- **`src/components/UI/theme.js`** (complex): the central MUI theme; wide surface of palette/typography/component overrides.
- **`src/pages/CustomizeWallet/CustomizeWallet.js`** (complex): wallet profile editing with rich-text (`react-quill`) and image uploads.
- **`src/pages/Login/Login.js`** (complex): wallet/password/API-key input with client-side validation and sign-in.

---

_Regenerate with `/understand` then `/understand-onboard`. See `docs/regenerating.md` in the docs repo._

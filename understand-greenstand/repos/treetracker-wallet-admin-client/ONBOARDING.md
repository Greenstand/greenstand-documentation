# Onboarding Guide: treetracker-wallet-admin-client

_Generated from the Understand-Anything knowledge graph and domain graph. Source commit `81b71cb`. The writer checked each claim in the source._

> The last guide described commit `62a60f3`. Since then, the repo got 8 commits, up to version 2.1.0-v2.30. The All Wallets tab of Send Tokens now suggests receiver names (see Key Concepts). The Deploy workflow now uses the dev AWS key for the input `env` values `dev` and `test`. Its default input `env` is now `test`.

## Project Overview

Treetracker Wallet Admin Client is the admin panel of the Greenstand wallet API (`README.md:3`). A user of the panel is a wallet owner. The user sees and sends tokens, creates managed wallets, and changes how a wallet looks (`README.md:17` to line 18). The README calls a managed wallet a sub wallet. The repo is a React single-page app. It has no server code. Its npm scripts start, build, test, and lint the browser app (`package.json:27` to line 37).

A file path that starts with `api/`, `components/`, `models/`, `pages/`, `store/`, or `utils/` starts at `src/`.

This guide calls the data that the app decodes from the auth token the wallet identity. The code calls the wallet identity `wallet` and the auth token `token` (`store/AuthProvider.js:8` to line 9).

The wallet API lists the wallets under a wallet by two scopes, `child` and `managed`. My Wallets shows them as Child Wallets and Managed Wallets (`pages/MyWallets/MyWallets.js:114` to line 116). This guide uses "child wallet" and "managed wallet" for these two scopes.

- **Package**\
  Name and version: `treetracker-wallet-admin-client` 2.1.0-v2.30 (`package.json:2` to line 3).\
  Toolchain: Create React App. The scripts `start`, `build`, and `test` run `react-scripts` (lines 28, 29, and 33).\
  Entry point: `src/index.js` renders `App` into `div#root` (`src/index.js:7` to line 8, `public/index.html:42`).
- **Languages and frameworks**\
  Languages of the graph: CSS, HTML, JavaScript, JSON, Markdown, YAML, and config\
  UI: React 18, MUI 5 with Emotion, MUI X date pickers with Day.js, React Router 6, react-quill (`package.json:6` to line 25)\
  Data: axios, jwt-decode, react-secure-storage\
  Tests: Jest and React Testing Library, through `react-scripts test`\
  Release: GitHub Actions, semantic-release, AWS S3, CloudFront\
  Note: `sass` is a dependency (`package.json:24`). The repo has no Sass file and no Sass import.
- **Node version**\
  `package.json` accepts Node `>= 19 < 21` (line 69). `.npmrc` sets `engine-strict=true` (`.npmrc:1`). So `npm install` stops on another Node version.\
  `.nvmrc` pins Node 20 (`.nvmrc:1`). The three workflows use Node 20 (`.github/workflows/treetracker-wallet-admin-pr.yaml:13`, `.github/workflows/build-release.yaml:11`, `.github/workflows/deploy.yaml:110`).
- **Quick start**\
  Node: use Node 20. Do not follow the Node step of the README (see Complexity Hotspots).\
  Install: `npm install` (`README.md:75`). CI runs `npm ci --legacy-peer-deps` (`.github/workflows/treetracker-wallet-admin-pr.yaml:28`).\
  Run: `npm start`, then open http://localhost:3000 (`README.md:81`, line 86). `npm start` calls the wallet API root of `.env.development` (`.env.development:1`).\
  Log in: the login form asks for a wallet name, a password, and an API key (`pages/Login/Login.js:142` to line 203).\
  Lint: `npm run lint` runs ESLint on `src` (`package.json:35`). ESLint skips the test files (`.eslintignore:5`).\
  Tests: `npm test` (`package.json:33`).
- **Graph size**\
  Files: 130. The graph leaves out 11 tracked files: 6 images (1 ICO, 3 PNG, 2 SVG) and 5 other files: `.eslintrc.json`, `.prettierrc`, `.gitignore`, `LICENSE`, and `package-lock.json`.\
  Nodes and edges: 396 and 1142 (264 function nodes, 2 class nodes)\
  Complexity of the file-level nodes: 14 complex, 38 moderate, 78 simple\
  Layers: 9. Tour: 15 steps.\
  Domains: 5 domains, 17 flows, 93 steps

How the parts fit:

- `App` puts the MUI theme, the Day.js date adapter, the router, and `AuthProvider` around `ClientRoutes` (`src/App.js:12` to line 22).
- `ClientRoutes` sends a user without a session to `/login`. It puts each other page in the trust relationship store, the transfer store, and `Layout` (`components/Routes/ClientRoutes.js:17` to line 122).
- A page reads a store or calls a function of `api/`. These functions call the wallet API through the shared axios client `apiClient` (`utils/apiClient.js:5` to line 10). Six action calls use `fetch` instead (see Key Concepts).
- Each call sends the API key in the `TREETRACKER-API-KEY` header. Each call after the login also sends the auth token as a Bearer token (`utils/apiClient.js:8`, line 21).
- `REACT_APP_WALLET_API_ROOT` sets the wallet API root (`utils/apiClient.js:6`, `pages/Login/Login.js:35`). Each `.env.*` file sets one root.
- The workflows put the static bundle into an S3 bucket and clear the CloudFront cache (`.github/workflows/build-release.yaml:153` to line 158, `.github/workflows/deploy.yaml:156` to line 161).

## Architecture Layers

The counts are file-level nodes. The bold names are the layer labels in the graph.

- **Application Shell** (8)\
  This layer holds the HTML page, the React root, the provider stack of `App`, and the route table.\
  Key files: `public/index.html`, `src/index.js`, `src/App.js`, `components/Routes/ClientRoutes.js`
- **Feature Pages** (46)\
  This layer holds the page of each route with its tables, filters, side panels, dialogs, form helpers, and styled files.\
  Key files: `pages/SendTokens/SendTokens.js`, `pages/MyTransfers/TransfersTable.js`, `pages/TrustRelationship/TrustRelationshipTable.js`, `pages/CustomizeWallet/CustomizeWallet.js`, `pages/Login/Login.js`
- **Shared UI and Layout** (21)\
  This layer holds three groups of shared parts.\
  Look: the MUI theme and the local Quill stylesheet\
  Page frame: the layout, the top bar, and the side menu\
  Widgets: the page header, the shared table, the loader, the message banner, and the tab panel\
  Key files: `components/UI/theme.js`, `components/layout/Layout.js`, `components/layout/Menu/MenuItem/MenuItem.js`, `components/UI/components/Table/Table.js`
- **State Management** (5)\
  This layer holds the auth context, `AuthProvider`, and the three list stores.\
  Key files: `store/AuthProvider.js`, `store/TransfersContext.js`, `store/TrustRelationshipsContext.js`, `store/WalletsContext.js`
- **API Client and Query Models** (7)\
  This layer holds `apiClient`, the API modules of wallets, transfers, and trust relationships, the two filter classes, and the format helpers.\
  Key files: `utils/apiClient.js`, `api/wallets.js`, `api/transfers.js`, `api/trust_relationships.js`, `models/TransferFilter.js`
- **Tests** (26)\
  This layer holds 25 Jest test files next to the code, and `src/setupTests.js`.\
  Key files: `src/setupTests.js`, `components/Routes/ClientRoutes.test.js`, `pages/MyTransfers/MyTransfers.test.js`
- **Project Configuration** (9)\
  This layer holds `package.json`, the four `.env` files, `.nvmrc`, `.npmrc`, and two ignore files.\
  Key files: `package.json`, `.env.development`, `.env.test`, `.env.production`, `.nvmrc`
- **CI/CD and Release** (4)\
  This layer holds the three GitHub Actions workflows and `.releaserc.json`.\
  Key files: `.github/workflows/build-release.yaml`, `.github/workflows/deploy.yaml`, `.github/workflows/treetracker-wallet-admin-pr.yaml`, `.releaserc.json`
- **Documentation** (4)\
  This layer holds the README, the contributor guide, the code of conduct, and the changelog.\
  Key files: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`

## Key Concepts

- **The session lives in the browser.**\
  `AuthProvider` decodes the auth token with jwt-decode. The result is the wallet identity: id, name, display name, logo URL, created date, expiration, and about text (`store/AuthProvider.js:38` to line 50).\
  `login` always writes the wallet identity to localStorage. It writes the auth token only when Remember me is on (lines 26 to 32). Remember me is on by default (`pages/Login/Login.js:43`).\
  At page load, the user has a session only when localStorage has both values (`store/AuthProvider.js:11` to line 16). So without Remember me, a reload ends the session.\
  The login page keeps the API key in react-secure-storage (`pages/Login/Login.js:103`). `logout` removes the auth token, the wallet identity, and the API key. Then it opens `/login` (`store/AuthProvider.js:52` to line 59).\
  The wallet identity keeps the expiration of the auth token (line 47). No code reads it.
- **One guard protects all pages except `/login`.**\
  `ProtectedRoute` sends a user without a session to `/login` (`components/Routes/ClientRoutes.js:17` to line 23).\
  The guarded routes are `/`, `/my-transfers`, `/send-tokens`, `/list-wallets`, `/trust-relationship`, `/customize-wallet`, and `*` (lines 30 to 123). Only `login` is outside the guard (line 124).\
  Each guarded route puts its page in the trust relationship store, the transfer store, and `Layout`. `/list-wallets` also gets the wallet store (lines 77 to 79).\
  `Layout` reads the pending counts of both stores for the menu badges (`components/layout/Layout.js:14` to line 15). So each route needs both stores.\
  `App` gives `ClientRoutes` a `Layout` child (`src/App.js:16` to line 18). `ClientRoutes` takes no props, so this child does not render (`components/Routes/ClientRoutes.js:25`).
- **Three React contexts hold the list state.**\
  This guide calls them the transfer store, the trust relationship store, and the wallet store (`store/TransfersContext.js`, `store/TrustRelationshipsContext.js`, `store/WalletsContext.js`).\
  The transfer store and the trust relationship store hold the page, the sort, the filter, the rows, the total, and a pending count. The list loads again when the page, the sort, the filter, or the refetch flag changes. The pending count loads again only when the refetch flag changes (`store/TransfersContext.js:221` to line 227, `store/TrustRelationshipsContext.js:280` to line 286).\
  The wallet store holds the page, the sort, the columns, the row mapper, and a loading flag (`store/WalletsContext.js:9` to line 76). My Wallets loads its own rows (`pages/MyWallets/MyWallets.js:45` to line 74).\
  The home page, Send Tokens, and Customize Wallet call `api/` directly (`pages/Wallet/Wallet.js:51`, `pages/SendTokens/SendTokens.js:111`, `pages/CustomizeWallet/CustomizeWallet.js:180`).\
  Each store hook throws an error outside its provider (`store/TransfersContext.js:260` to line 264).
- **One axios client sends most calls.**\
  `apiClient` takes its base URL from `REACT_APP_WALLET_API_ROOT`. It reads the stored API key when the module loads (`utils/apiClient.js:5` to line 10). The login page sets the new key with `setAPIKeyHeader` (`pages/Login/Login.js:105` to line 106).\
  `setAuthHeader` puts the auth token as a Bearer token on the client defaults (`utils/apiClient.js:19` to line 31). Each axios call in `api/` calls it first.\
  Accept, decline, and cancel of a transfer use `fetch` with their own headers (`api/transfers.js:45` to line 99). Accept, decline, and delete of a trust relationship do the same (`api/trust_relationships.js:66` to line 131).\
  The 401 handler calls the hook `useNavigate` outside a component (`utils/apiClient.js:49` to line 51). React allows a hook call only inside a component, so this call throws. A 401 answer does not open `/login`.\
  `updateWallet` sets the multipart content type on the client defaults (`api/wallets.js:100`, `utils/apiClient.js:33` to line 39). The type stays for all later axios calls until the page reloads.
- **Filters become query strings.**\
  `TransferFilter` and `TrustRelationshipsFilter` keep only the set options. Both lowercase the state and format the dates as YYYY-MM-DD (`models/TransferFilter.js:16` to line 25, `models/TrustRelationShipFilter.js:18` to line 29). `TrustRelationshipsFilter` also lowercases the search, the relationship type, and the request type.\
  `makeQueryString` joins the options and drops null and empty values (`utils/formatting.js:22` to line 29). `getTransfers` and `getTrustRelationships` use it (`api/transfers.js:23`, `api/trust_relationships.js:21`). `getWallets` sends axios params instead (`api/wallets.js:26` to line 34).
- **The build picks the environment.**\
  `.env.development`, `.env.test`, and `.env.production` set `REACT_APP_WALLET_API_ROOT` to the dev-k8s, test-k8s, and prod-k8s wallet API v2 roots (`.env.development:1`, `.env.test:1`, `.env.production:1`).\
  Create React App loads `.env.development` for `npm start`, `.env.test` for `npm test`, and `.env.production` for `npm run build`. This is the behavior of Create React App (`react-scripts` 5, `package.json:22`), not code of the repo.\
  `build:dev` and `build:test` load `.env.development` and `.env.test` through env-cmd (`package.json:30` to line 31). `build:dev` then moves the bundle to `build-dev` (line 30).\
  The app has no runtime switch. Each bundle calls one API root.
- **Send Tokens has three receiver tabs.**\
  The tabs are Managed Wallets, Trusted Wallets, and All Wallets (`pages/SendTokens/SendTokens.js:256` to line 260). A tab change clears the sender wallet (lines 47 to 53).\
  The sender list holds child wallets (scope `child`) and the logged-in wallet (`pages/SendTokens/SendTokensForm/SelectWallet.js:48` to line 98). The search loads 10 wallets at a time (`api/wallets.js:20`).\
  The available tokens are the wallet balance minus the pending outgoing amount (`pages/SendTokens/SendTokens.js:109` to line 115, line 279). The pending outgoing amount comes from `GET /wallets/{id}/pending-transfers` (`api/wallets.js:113` to line 124).\
  Managed Wallets offers child wallets as receivers (`pages/SendTokens/SendTokensForm/SendTokensForm.js:194` to line 202). Trusted Wallets offers the target wallets of trusted `send` relationships where the sender wallet is the actor (`api/trust_relationships.js:160` to line 177). All Wallets takes any receiver name. It suggests the other wallets in the trusted relationships of the logged-in wallet (lines 184 to 244).\
  Managed Wallets and Trusted Wallets post through `handleSendTokenForm` in `pages/SendTokens/SendTokens.js` (lines 171 to 210). All Wallets posts through `handleSendToUntrustedWallets` (`pages/SendTokens/helpers/sendTokenHandlers.js:48` to line 99). Each transfer request sends `claim: false`.\
  `pages/SendTokens/helpers/sendTokenHandlers.js` also has a copy of `handleSendTokenForm` (line 5). No code calls this copy.
- **Pending items get a badge and a highlight.**\
  The transfer store counts the pending transfers to the logged-in wallet or to a child wallet (`store/TransfersContext.js:182` to line 219). The trust relationship store counts the requested trust relationships with such a target (`store/TrustRelationshipsContext.js:238` to line 276).\
  The side menu shows each count as a badge only when the menu is open (`components/layout/Menu/MenuItem/MenuItem.js:30`, line 65).\
  The transfer table gives these transfers an orange border (`pages/MyTransfers/TransfersTable.js:131` to line 141, line 189). The trust relationship table gives these requests a light green background (`pages/TrustRelationship/TrustRelationshipTable.js:330` to line 340).

## Guided Tour

The tour has 15 steps. The bold names are the tour titles in the graph.

1. **Project Overview**\
   Files: `README.md`\
   What to see: the README lists three use cases for Greenstand Impact Tokens (`README.md:20` to line 24). Do not follow its Node step (see Complexity Hotspots).
2. **Toolchain and Node Pins**\
   Files: `package.json`, `.nvmrc`, `.npmrc`\
   What to see: these three files set the Node version (see Project Overview). `package.json` tells Jest to transform axios (`package.json:71` to line 75).
3. **Boot Sequence**\
   Files: `public/index.html`, `src/index.js`, `src/App.js`\
   What to see: the page title is "Treetracker Admin by Greenstand" (`public/index.html:24`). The page loads the Google Analytics tag (lines 25 to 35). `src/index.js` calls `reportWebVitals()` with no callback (line 13). So the helper measures nothing (`src/reportWebVitals.js:2`).
4. **Session and Auth Context**\
   Files: `store/auth-context.js`, `store/AuthProvider.js`\
   What to see: the default value of `AuthContext` shows the session shape: `isLoggedIn`, `token`, `wallet`, `login`, and `logout` (`store/auth-context.js:3` to line 9). `login` does nothing when the new auth token is the current one (`store/AuthProvider.js:19`). 15 app files and 1 test file import `store/auth-context.js`.
5. **Routes Behind a Login Guard**\
   Files: `components/Routes/ClientRoutes.js`\
   What to see: `ProtectedRoute` uses a replace navigation to `/login` (line 19). The `*` route shows the 404 page inside the guard and the layout (lines 111 to 122).
6. **Wallet API Client Layer**\
   Files: `utils/apiClient.js`, `api/wallets.js`, `api/transfers.js`, `api/trust_relationships.js`, `utils/formatting.js`\
   What to see: `mapWallet` turns the API fields into camelCase. `getWallets` reads the wallet name from `name`, but `getWalletById` reads it from `wallet` (`api/wallets.js:3` to line 15, line 38, line 61). `getTransfers` and `getTrustRelationships` log an error and return nothing (`api/transfers.js:29` to line 31, `api/trust_relationships.js:26` to line 28).
7. **API Root per Environment**\
   Files: `.env.development`, `.env.test`, `.env.production`, `.env`\
   What to see: Key Concepts tells how the build picks one of these files. Complexity Hotspots lists the stale points of `.env` and of `build:staging`.
8. **Login Flow**\
   Files: `pages/Login/Login.js`, `pages/Login/loginValidator.js`\
   What to see: the length limits are 150 characters for the wallet name and 50 for the password and the API key (`pages/Login/loginValidator.js:6`, lines 16 and 26). A length error does not stop the login (`pages/Login/Login.js:94` to line 96). The page saves the API key before the post. It removes the key after a failure (lines 103 and 121).
9. **Feature Stores and Filter Models**\
   Files: `store/TransfersContext.js`, `store/TrustRelationshipsContext.js`, `store/WalletsContext.js`, `models/TransferFilter.js`, `models/TrustRelationShipFilter.js`\
   What to see: the trust relationship store holds the option lists of the filters and the request dialog (`store/TrustRelationshipsContext.js:132` to line 204). The lists hold four relationship states, the request types (see Business Domains), and three relationship types. Each store starts with 10 rows per page (`store/TransfersContext.js:14` to line 17, `store/TrustRelationshipsContext.js:17` to line 20, `store/WalletsContext.js:9` to line 12).
10. **Theme, Layout, and Shared Widgets**\
   Files: `components/UI/theme.js`, `components/layout/Layout.js`, `components/layout/Menu/Menu.js`, `components/UI/components/Table/Table.js`, `components/UI/components/Message/Message.js`\
   What to see: the theme uses the Lato font and the primary green `rgba(118, 187, 35, 1)` (`components/UI/theme.js:21`, line 31). After each route change, `Layout` opens the side menu. On a screen of 480 px or less, it closes the menu (`components/layout/Layout.js:21`, lines 31 to 43). For the users of the shared `Table`, see Complexity Hotspots.
11. **Wallet Home and Management**\
   Files: `pages/Wallet/Wallet.js`, `pages/MyWallets/MyWallets.js`, `pages/MyWallets/CreateManagedWallet/CreateManagedWallet.js`, `pages/CustomizeWallet/CustomizeWallet.js`\
   What to see: the home page shows only the logged-in wallet. It reads the wallet id from the wallet identity (`pages/Wallet/Wallet.js:41`). My Wallets starts with the scope `child` (`pages/MyWallets/MyWallets.js:41`).
12. **Sending Tokens**\
   Files: `pages/SendTokens/SendTokens.js`, `pages/SendTokens/SendTokensForm/SendTokensForm.js`, `pages/SendTokens/SendTokensForm/SendToUntrustedWallets.js`, `pages/SendTokens/helpers/sendTokenHandlers.js`\
   What to see: each tab has a help text (`pages/SendTokens/SendTokens.js:25` to line 29). The page loads the trusted wallets only on the Trusted Wallets tab with a sender wallet. It loads the suggestions only on the All Wallets tab (lines 55 to 67). Key Concepts names the post function of each tab.
13. **Transfers and Trust Requests**\
   Files: `pages/MyTransfers/TransfersTable.js`, `pages/MyTransfers/TableFilters.js`, `pages/MyTransfers/TransferSidePanel.js`, `pages/TrustRelationship/TrustRelationshipTable.js`, `pages/TrustRelationship/trustRelationshipSidePanel.js`\
   What to see: only a pending transfer opens the transfer side panel (`pages/MyTransfers/TransfersTable.js:126`). Each trust relationship row opens its side panel (`pages/TrustRelationship/TrustRelationshipTable.js:279` to line 283). Both tables offer 10 or 50 rows per page (`pages/MyTransfers/TransfersTable.js:390`, `pages/TrustRelationship/TrustRelationshipTable.js:514`).
14. **Tests and Test Setup**\
   Files: `src/setupTests.js`, `components/Routes/ClientRoutes.test.js`, `pages/MyTransfers/MyTransfers.test.js`, `pages/TrustRelationship/TrustRelationship.test.js`\
   What to see: `src/setupTests.js` mocks react-secure-storage. Its `getItem('api-key')` returns `mock-api-key` (`src/setupTests.js:3` to line 14). The page tests mock `getTransfers` or `getTrustRelationships` (`pages/MyTransfers/MyTransfers.test.js:10`, `pages/TrustRelationship/TrustRelationship.test.js:10`).\
   Note: 6 tests in 5 files have `it.skip`. `components/layout/Layout.test.js` and `pages/SendTokens/TokenInfoBlock/TokenInfoBlock.test.js` keep their assertions in comments. The Send Tokens forms, `api/`, and Customize Wallet have no test file.
15. **CI, Release, and Deploy**\
   Files: `.github/workflows/treetracker-wallet-admin-pr.yaml`, `.github/workflows/build-release.yaml`, `.github/workflows/deploy.yaml`, `.releaserc.json`, `CHANGELOG.md`\
   What to see: each pull request runs lint, build, and test on Node 20 (`.github/workflows/treetracker-wallet-admin-pr.yaml:6` to line 47). A push starts "Build and Release". Only the branches `main`, `v1`, and `v2` go on to the build (`.github/workflows/build-release.yaml:43` to line 48, `.releaserc.json:2` to line 15). semantic-release then writes `CHANGELOG.md`, bumps `package.json`, and commits both with `[skip ci]` (`.releaserc.json:16` to line 32). The workflow puts the `build:dev` bundle into the bucket of channel `main` or channel `beta` (`.github/workflows/build-release.yaml:33` to line 42, lines 153 to 158).\
   The manual "Deploy" workflow takes a release tag (input `version`) and the input `env`: `dev`, `test`, or `prod`, with the default `test` (`.github/workflows/deploy.yaml:3` to line 17). It builds with `npm run build:dev`, `npm run build:test`, or `npm run build` (lines 114 to 126). A tag of a `v2` release has the channel `beta`. So `prod` with such a tag goes to the bucket of the secret `STAGING_CDN_S3_BUCKET` (line 51, lines 64 to 78).

## File Map (by layer)

**Application Shell**

- `public/index.html`: the HTML page. It loads the Google Analytics tag and holds `div#root`.
- `public/manifest.json`, `public/robots.txt`: the web app manifest and the crawler rules.
- `src/index.js`, `src/index.css`, `src/reportWebVitals.js`: the React root, the global reset, and the web vitals helper.
- `src/App.js`: the provider stack.
- `components/Routes/ClientRoutes.js`: the route table and `ProtectedRoute`.

**Feature Pages**

- `pages/Login/Login.js`, `pages/Login/loginValidator.js`: the login form and its field checks.
- `pages/Wallet/`: the home page with `WalletHeader` and `WalletInfoBlock`.
- `pages/MyWallets/`: My Wallets and the Create Managed Wallet dialog.
- `pages/SendTokens/`: the page, the two forms, `SelectWallet`, `ConfirmDialog`, `TokenInfoBlock`, and the helpers.
- `pages/MyTransfers/`: My Transfers with its table, filters, and side panel.
- `pages/TrustRelationship/`: the page with its table, filters, side panel, and request dialog.
- `pages/CustomizeWallet/`: the Customize Wallet page, which edits the wallet profile.
- `pages/NotFound/`: the 404 page.

**Shared UI and Layout**

- `components/UI/theme.js`: the MUI theme with Lato and the Greenstand green.
- `components/layout/Layout.js`, `components/layout/Menu/`: the layout, the top bar, and the side menu with six links.
- `components/layout/PageHeader/`: the page title of Send Tokens and Customize Wallet.
- `components/UI/components/`: `Table`, `Loader`, `Message`, and `TabPanel`. Only Send Tokens uses `TabPanel`.
- `components/UI/IconLogo.js`, `components/UI/styledComponents/CommonStyled.js`: the logo link and `FlexDiv`.
- `components/UI/quill.snow.css`: a local copy of the Quill 1.3.7 Snow theme for the about text editor.

**State Management**

- `store/auth-context.js`, `store/AuthProvider.js`: the auth context and its provider.
- `store/TransfersContext.js`, `store/TrustRelationshipsContext.js`, `store/WalletsContext.js`: the three list stores.

**API Client and Query Models**

- `utils/apiClient.js`: the shared axios client.
- `api/wallets.js`: list, read, create, and update wallets, and read the pending outgoing amount.
- `api/transfers.js`: list transfers, and accept, decline, or cancel one transfer.
- `api/trust_relationships.js`: list, request, accept, decline, and delete trust relationships, and read the trusted wallets.
- `models/TransferFilter.js`, `models/TrustRelationShipFilter.js`: the two filter classes.
- `utils/formatting.js`: the number, date, and query string helpers.

**Tests**

- `src/**/*.test.js`: 25 test files next to the code.
- `src/setupTests.js`: the jest-dom matchers and the react-secure-storage mock.

**Project Configuration**

- `package.json`: the dependencies, the scripts, the Node range, and the Jest transform setting.
- `.env`, `.env.development`, `.env.test`, `.env.production`: the build variables.
- `.nvmrc`, `.npmrc`: the Node pin and the engine gate.
- `.eslintignore`, `.prettierignore`: the ignore lists.

**CI/CD and Release**

- `.github/workflows/treetracker-wallet-admin-pr.yaml`: the "CI/CD Pipeline" workflow of each pull request.
- `.github/workflows/build-release.yaml`: the "Build and Release" workflow of each push.
- `.github/workflows/deploy.yaml`: the manual "Deploy" workflow.
- `.releaserc.json`: the release branches and the semantic-release plugins.

**Documentation**

- `README.md`: the purpose, the use cases, and the local setup.
- `CONTRIBUTING.md`: the issue and pull request flow and the code style guide.
- `CODE_OF_CONDUCT.md`: the Contributor Covenant 1.4.
- `CHANGELOG.md`: the release notes from 1.0.0 (2023-10-10) to 2.1.0-v2.30 (2026-11-05).

## Complexity Hotspots

The graph rates 14 file-level nodes as complex. None of them is a test. The groups below need care.

- **Send Tokens**\
  Files: `pages/SendTokens/SendTokens.js` (336 lines), `pages/SendTokens/SendTokensForm/SendTokensForm.js` (315), `pages/SendTokens/SendTokensForm/SelectWallet.js` (296)\
  Why: three tabs share one sender wallet state, two forms, and two post paths.\
  Note: after an inline managed wallet creation, the receiver stays empty. `SelectWallet` passes the new name as text, and the receiver handler reads `wallet.name` from it (`pages/SendTokens/SendTokensForm/SelectWallet.js:117` to line 127, `pages/SendTokens/SendTokensForm/SendTokensForm.js:80` to line 87). The local `handleSendTokenForm` reads `error.response.data` without a check. So an error without a server answer shows no message (`pages/SendTokens/SendTokens.js:197` to line 205).
- **List stores**\
  Files: `store/TransfersContext.js` (266), `store/TrustRelationshipsContext.js` (332)\
  Why: each guarded route wraps its page in both stores. So the home page also loads the transfer list, the trust relationship list, and both pending counts. Each count reads up to 1000 child wallets (`store/TransfersContext.js:186` to line 190, `store/TrustRelationshipsContext.js:243` to line 247).\
  Note: the stores keep the child wallets in a field named `managedWallets` (`store/TransfersContext.js:42`, `store/TrustRelationshipsContext.js:49`).
- **Tables and filters**\
  Files: `pages/MyTransfers/TransfersTable.js` (403), `pages/TrustRelationship/TrustRelationshipTable.js` (527), `pages/TrustRelationship/TrustRelationshipsFilters.js` (310), `components/UI/components/Table/Table.js` (289)\
  Why: the transfer table and the trust relationship table have their own table code. Only My Wallets uses the shared `Table` (`pages/MyWallets/MyWallets.js:14`).\
  Note: `pages/TrustRelationship/TrustRelationshipsFilters.js` has a date range filter (line 190). The trust relationship table keeps it in a comment, so that page has no date filter (`pages/TrustRelationship/TrustRelationshipTable.js:86`).
- **API and session code**\
  Files: `api/trust_relationships.js` (245), `utils/apiClient.js` (58), `store/AuthProvider.js` (84)\
  Why: `apiClient` carries the axios calls to the wallet API. `AuthProvider` holds the session. `api/trust_relationships.js` serves the trust relationship store, the trust relationship page, and two Send Tokens tabs.\
  Note: accept, decline, and cancel return the answer without a status check (`api/transfers.js:45` to line 99, `api/trust_relationships.js:66` to line 102). The trust relationship side panel does not wait for accept or decline. It sets the refetch flag at once (`pages/TrustRelationship/trustRelationshipSidePanel.js:35` to line 45).
- **Forms with checks**\
  Files: `pages/Login/Login.js` (248), `pages/TrustRelationship/CreateTrustRelationship/CreateTrustRelationship.js` (281), `pages/CustomizeWallet/CustomizeWallet.js` (468)\
  Why: each form has its own field checks. Three files have a copy of the wallet name check (`pages/TrustRelationship/CreateTrustRelationship/CreateTrustRelationship.js:97` to line 113, `pages/MyWallets/CreateManagedWallet/CreateManagedWallet.js:73` to line 93, `pages/SendTokens/SendTokensForm/SendTokensForm.js:99` to line 116).\
  Note: Customize Wallet keeps the wallet record that it loaded. Each save and each image upload sends the loaded values of the other fields (`pages/CustomizeWallet/CustomizeWallet.js:146`, line 230). So the second save of one visit sends the old value of the first saved field again.
- **Vendored stylesheet**\
  Files: `components/UI/quill.snow.css` (1171)\
  Why: this is the largest file in the graph. It is a copy of the Quill 1.3.7 Snow theme (lines 1 to 6). `pages/CustomizeWallet/CustomizeWallet.js` imports it (line 15).
- **Deploy workflow**\
  Files: `.github/workflows/deploy.yaml` (161)\
  Why: the input `version` and the input `env` pick the channel, the bucket, and the build script.\
  Note: for the input `env` value `dev`, the job runs `npm run build:dev` (lines 123 to 126). That script moves the bundle to `build-dev` (`package.json:30`). The job uploads `build` (`.github/workflows/deploy.yaml:127` to line 130). So a `dev` deploy has no bundle to upload.
- **Stale docs and config**\
  `README.md:42` to line 49 asks for Node 18. The engine gate refuses Node 18 (`package.json:69`, `.npmrc:1`).\
  The README steps go from Step 5 to Step 7 (`README.md:78`, line 84).\
  `CONTRIBUTING.md:61` names `v1` as the target branch. The latest release comes from `v2` (`CHANGELOG.md:1`). The Deploy workflow reads `.releaserc.json` from `v2` (`.github/workflows/deploy.yaml:35` to line 38).\
  `build:staging` reads `.env.staging` (`package.json:32`). The repo has no `.env.staging`.\
  `.prettierignore:1` names `.eslintrc.js`. The repo has `.eslintrc.json`.\
  `.env` sets `REACT_APP_VERSION` (`.env:1`). No code reads it (`git grep -n REACT_APP_VERSION -- src public` gives 0 hits).\
  `formatWithCommas` reads `USER_LOCALE` (`utils/formatting.js:6`). Create React App puts only `REACT_APP_*` variables into the bundle (`react-scripts` 5, `package.json:22`). So the bundle formats numbers in the browser locale, not in the `en-US` of `.env.development:2`.

## Business Domains

`domain-graph.json` has 5 domains, 17 flows, and 93 steps. The bold names are the flow labels in the graph.

**Authentication & Access**: this domain covers the login, the session in the browser, the route guard, and the logout.

- **User Login** (entry: the `/login` form)\
  The LOG IN button needs a wallet name and a password (`pages/Login/Login.js:226`). The page saves the API key. Then it posts the wallet name and the password to `/auth` under `REACT_APP_WALLET_API_ROOT` (lines 100 to 110). For a 200 answer, `login` gets the auth token and the Remember me choice (lines 112 to 114).
- **Restore Session and Guard Routes** (entry: the app start and each guarded route)\
  At page load, `AuthProvider` reads the auth token and the wallet identity from localStorage (`store/AuthProvider.js:11` to line 16). Key Concepts gives the session rule and the route guard.
- **Logout & Session Expiry** (entry: the logout icon, a missing wallet identity, or a 401 answer)\
  The logout icon in the top bar calls `logout` (`components/layout/Menu/TopMenu/TopMenu.js:37` to line 41). The home page and Customize Wallet call `logout` when the wallet identity has no id (`pages/Wallet/Wallet.js:41` to line 46, `pages/CustomizeWallet/CustomizeWallet.js:171` to line 176). For a 401 answer, see Key Concepts.

**Wallet Management**: this domain shows the logged-in wallet, lists the wallets by scope, and creates managed wallets.

- **View Wallet Home** (entry: `/`)\
  The page loads the wallet record and the pending transfers (`pages/Wallet/Wallet.js:48` to line 71). It shows the logo, the display name or the wallet name, the pending transfer count, the about text, and the wallet balance (lines 100 to 124). The count does not filter the pending transfers by direction (lines 58 to 62, line 103).
- **Browse My Wallets** (entry: `/list-wallets`)\
  The Wallet Scope menu offers All Wallets, Child Wallets, and Managed Wallets. A scope change goes back to the first page (`pages/MyWallets/MyWallets.js:109` to line 117). The wallet store sorts by created date, newest first (`store/WalletsContext.js:16` to line 19).
- **Create Managed Wallet** (entry: Create Managed Wallet on `/list-wallets`)\
  The dialog needs a name of at least 3 characters. The name can have only letters, digits, and `- . @` (`pages/MyWallets/CreateManagedWallet/CreateManagedWallet.js:73` to line 93). The dialog sends `POST /wallets` (`api/wallets.js:71` to line 88). Then it reloads the table (`pages/MyWallets/CreateManagedWallet/CreateManagedWallet.js:95` to line 110).
- **Create Managed Wallet from Send Tokens** (entry: + Create Managed Wallet on the Managed Wallets tab)\
  The inline field checks the characters but not a minimum length (`pages/SendTokens/SendTokensForm/SendTokensForm.js:99` to line 116). `handleCreateWallet` sends `POST /wallets` with the name (`pages/SendTokens/helpers/walletHandlers.js:4` to line 33). The receiver stays empty after the creation (see Complexity Hotspots).

**Token Transfers**: this domain sends tokens from a sender wallet to a receiver wallet and handles the pending transfers.

- **Send Tokens to a Managed Wallet** (entry: the Managed Wallets tab of `/send-tokens`)\
  Key Concepts gives the receiver list. The token amount must be more than 0 and not more than the available tokens (`pages/SendTokens/SendTokensForm/SendTokensForm.js:118` to line 144). A dialog asks "Are you sure to make this transfer?" (`pages/SendTokens/SendTokensForm/confirmDialog/ConfirmDialog.js:66`). The page sends `POST /transfers` (`pages/SendTokens/SendTokens.js:171` to line 181).
- **Send Tokens to a Trusted Wallet** (entry: the Trusted Wallets tab of `/send-tokens`)\
  The page reads the trusted relationships of the sender wallet in pages of 500 (`api/trust_relationships.js:133` to line 158). Key Concepts gives the receiver rule. The post is the same as on the Managed Wallets tab (`pages/SendTokens/SendTokens.js:295`).
- **Send Tokens to Any Wallet** (entry: the All Wallets tab of `/send-tokens`)\
  The receiver field is a free text field with suggestions (`pages/SendTokens/SendTokensForm/SendToUntrustedWallets.js:139` to line 158). Key Concepts gives the suggestion rule. The success message calls the receiver an untrusted wallet (`pages/SendTokens/helpers/sendTokenHandlers.js:74` to line 78). An error shows the server message when the answer has one (line 83).
- **Browse Transfers** (entry: `/my-transfers`)\
  The status filter offers All, Pending, Completed, and Cancelled (`pages/MyTransfers/TableFilters.js:65` to line 77, `store/TransfersContext.js:52` to line 78). The date pickers do not accept future dates (`pages/MyTransfers/TableFilters.js:172`, line 187). Created Date, Closed Date, and Status sort the table (`pages/MyTransfers/TransfersTable.js:279` to line 327).
- **Act on a Pending Transfer** (entry: a pending row on `/my-transfers`)\
  The receiver side can accept or decline the transfer. The sender side can cancel it (`pages/MyTransfers/TransferSidePanel.js:63` to line 74). After the call, the panel closes and sets the refetch flag (lines 31 to 59). For the missing status check, see Complexity Hotspots.

**Trust Relationships**: this domain requests trust relationships, lists them, and accepts, declines, or deletes them.

- **Request Trust Relationship** (entry: + Create on `/trust-relationship`)\
  The dialog needs a request type, a requesting wallet, and a target wallet name of at least 3 characters (`pages/TrustRelationship/CreateTrustRelationship/CreateTrustRelationship.js:98` to line 129). The request types are manage, send, deduct, receive, release, and yield (`store/TrustRelationshipsContext.js:155` to line 186). `POST /trust_relationships` sends `trust_request_type`, `requester_wallet`, and `requestee_wallet` (`api/trust_relationships.js:43` to line 64).
- **Browse Trust Relationships** (entry: `/trust-relationship`)\
  The list sorts by relationship state, descending (`store/TrustRelationshipsContext.js:32` to line 35). The search text goes to the API as the lowercase `search` filter (`pages/TrustRelationship/TrustRelationshipTable.js:143` to line 147, `models/TrustRelationShipFilter.js:22`). The Filters menu has State, Request Type, and Type (`pages/TrustRelationship/TrustRelationshipTable.js:68` to line 85).
- **Act on a Trust Relationship** (entry: a row on `/trust-relationship`)\
  A trusted relationship shows Delete. A requested relationship shows Accept and Decline when the target is the logged-in wallet or a child wallet. Otherwise it shows Delete (`pages/TrustRelationship/trustRelationshipSidePanel.js:114` to line 169). Delete waits for the call and shows the server error (lines 47 to 58).

**Wallet Customization**: this domain changes the wallet profile of the logged-in wallet. The wallet profile is the display name, the about text, the logo image, and the hero image (`pages/CustomizeWallet/CustomizeWallet.js:56` to line 72, lines 326 to 367).

- **Update Display Name and About Text** (entry: the Save buttons on `/customize-wallet`)\
  A display name needs at least 2 characters (`pages/CustomizeWallet/CustomizeWallet.js:217` to line 226). The about text needs at least 5 characters without the formatting tags (lines 206 to 215). Each save sends `PATCH /wallets/{id}` as multipart form data (lines 228 to 239, `api/wallets.js:90` to line 111).
- **Upload Logo and Hero Image** (entry: the Upload buttons on `/customize-wallet`)\
  An image must be a PNG or JPG file of 1 MB or less (`pages/CustomizeWallet/CustomizeWallet.js:74` to line 88). A logo must be square. A hero image must be at least two times as wide as it is high (lines 56 to 72). The page uploads the image directly after the checks (lines 131 to 159). The messages close after 3 seconds (lines 241 to 267).

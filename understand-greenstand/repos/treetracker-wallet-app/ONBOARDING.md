# Onboarding Guide: treetracker-wallet-app

_Generated from the Understand-Anything knowledge graph. Source commit `3c14113`._

> The web app is the live client. The native app is mostly a mock. It imports nothing from the wallet package. Its sign-in screen calls no API. Its search, wallets, and notifications use hard-coded data. Read the "Note" fields before you change a screen.

## Project Overview

The Treetracker Wallet App is a Greenstand wallet for tokens that stand for verified tree planting (`README.md`). A user holds wallets. The user sends tokens to other wallets. The user can also give tokens through share links.

- **Workspaces**\
  Root: `package.json` (`treetracker-wallet-app`, Yarn 4.9.4) declares the workspaces `apps/*` and `packages/*`.\
  Apps: the web app (`apps/web`), the native app (`apps/native`), the NestJS user API (`apps/user`), and the BDD suite (`apps/bdd`).\
  Packages: the wallet package (`packages/wallet`, name `@treetracker/wallet`), the core package (`packages/core`, name `core`), the Keycloak package (`packages/keycloak`), the queue package (`packages/queue`), and the config package (`packages/config`).\
  Stub: `packages/common` has no `package.json`. So it is not a workspace.\
  Stub file: the only file is `packages/common/sendEmail.ts`. Its function body is empty.
- **Languages and frameworks**\
  Languages: TypeScript, JavaScript, JSON, YAML, CSS, HTML, Markdown, Dockerfile\
  Clients: Next.js, React, MUI, Jotai, Expo, React Native\
  Server: NestJS\
  Tests and delivery: Jest, Cypress, WebdriverIO with Cucumber, Docker, Kustomize, GitHub Actions
- **External services**\
  Identity: one Keycloak realm serves the web app, the user API, and the BDD seed.\
  Data: the wallet API holds wallets, tokens, and transfers. The wallet API is not in this repo.\
  Trees: the public Treetracker query API gives the tree photo and species of a token.
- **Quick start**\
  Prerequisites: Node.js v20 or higher, Yarn v4 or higher, and Docker (`README.md:29`).\
  Run: `yarn install`. Then run `yarn user:dev` for the user API on port 8080. Then run `yarn web:dev` for the web app on `http://localhost:3000`.\
  Env files: copy each `.env.example`. The README copies `apps/web/.env.example` to `apps/user/.env` (`README.md:50`). Next.js loads env files from the app directory, `apps/web/`. So the web app does not read that copy.
- **Graph size**\
  Files: 430\
  File-level nodes: 432 in 9 layers. The graph gives `apps/user/Dockerfile` one node for the file and one node for each of its two build stages.\
  Complexity of the nodes: 22 complex, 103 moderate, 307 simple\
  All nodes and edges: 751 and 1498\
  Tour: 15 steps\
  Domains: 5 domains, 20 flows, 126 steps

How the parts fit:

- The web app sends the user to the Keycloak hosted sign-in page. `KeycloakProvider` copies the access token into `tokenAtom` of the core package.
- The web pages call the wallet API through the hooks of the wallet package. Each hook reads the token from `tokenAtom`.
- The user API proxies password sign-in, registration, and the `/me` profile to Keycloak. The web app calls only `GET /me` (`apps/web/src/utils/userProfile.ts:61`).
- The user API also listens on a PostgreSQL queue to reward a new wallet. Its reward calls cannot reach the wallet API (see Complexity Hotspots).

## Architecture Layers

The counts are file-level graph nodes. The count of Deployment and CI/CD includes the three `Dockerfile` nodes. The bold names are the layer labels in the graph.

- **Web Wallet App** (91)\
  This layer holds the Next.js App Router pages in `apps/web/src/app`, the MUI components, the Keycloak session code, and the header and snackbar contexts.\
  Key files: `apps/web/src/app/layout.tsx`, `apps/web/src/components/KeycloakProvider.tsx`, `apps/web/src/app/(protected)/layout.tsx`, `apps/web/src/app/(protected)/send/page.tsx`
- **Native Mobile App** (71)\
  This layer holds the Expo Router screens in `apps/native/app`, the themed UI parts, the design tokens, and the mock data.\
  Key files: `apps/native/app/_layout.tsx`, `apps/native/app/index.tsx`, `apps/native/app/(tabs)/home/index.tsx`, `apps/native/theme/index.ts`
- **User API Service** (15)\
  This layer holds the user API in `apps/user`, its DTOs, the Swagger setup, the OpenAPI spec, and the queue listener.\
  Key files: `apps/user/src/main.ts`, `apps/user/src/user/user.service.ts`, `apps/user/src/auth/auth.service.ts`
- **Shared Client Packages** (60)\
  This layer holds the wallet package (API clients, hooks, types) and the core package (auth atoms, search atoms, mock data).\
  Key files: `packages/wallet/src/index.ts`, `packages/wallet/src/utils/config.ts`, `packages/core/src/atoms/auth/tokenAtom.ts`
- **Identity and Messaging Packages** (11)\
  This layer holds the Keycloak package (admin token, account create and delete) and the queue package (publish, subscribe, ack).\
  Key files: `packages/keycloak/src/index.ts`, `packages/queue/subscribe.js`
- **Testing and QA** (82)\
  This layer holds the BDD suite, the Cypress tests of the web app, the Jest suites of the user API and the packages, and committed report files.\
  Key files: `apps/bdd/features/step-definitions/steps.ts`, `apps/bdd/utils/seed.ts`, `apps/web/cypress.config.ts`
- **Deployment and CI/CD** (27)\
  This layer holds the `Dockerfile` of the user API, the Kustomize manifests, the EAS profiles, `.releaserc.js`, and 12 GitHub Actions workflows.\
  Key files: `apps/user/Dockerfile`, `apps/user/deployment/base/kustomization.yaml`, `.github/workflows/ci-cd-pr-bdd-wallet.yml`
- **Workspace and Tooling Configuration** (57)\
  This layer holds the workspace manifests, the env templates, the Husky hooks, and the settings of TypeScript, ESLint, Prettier, Babel, Next.js, and Expo.\
  Key files: `package.json`, `apps/web/next.config.js`, `packages/config/index.js`
- **Documentation** (18)\
  This layer holds the README, `CONTRIBUTING.md`, `CHANGELOG.md`, the workspace READMEs, the BDD iteration notes, and the GitHub templates.\
  Key files: `README.md`, `CONTRIBUTING.md`, `apps/bdd/README.md`

## Key Concepts

- **The web app uses the Keycloak hosted pages.**\
  The `/login` and `/signup` pages only redirect to Keycloak (`apps/web/src/app/(public)/login/page.tsx:15`). Keycloak returns to `/auth/callback`.\
  `apps/web/src/auth/keycloak.ts` runs a public client with PKCE `S256` (line 78). It keeps the tokens in sessionStorage under `kc_tokens` (line 23).\
  `KeycloakProvider` waits at most 8 seconds for init (`apps/web/src/components/KeycloakProvider.tsx:32`). It refreshes the token on expiry (line 78). It also refreshes the token when the tab becomes visible (line 83).
- **One token atom serves two platforms.**\
  `tokenAtom` persists the token under the key `token` (`packages/core/src/atoms/auth/tokenAtom.ts:4`).\
  `getAsyncStorage` picks sessionStorage on web and AsyncStorage on native (`packages/core/src/utils/storage.ts:6`).\
  `apps/web/next.config.js:22` forces one Jotai instance. Without it, the wallet hooks do not see the token that the web app sets.
- **A log out in one tab reaches every tab.**\
  sessionStorage is per tab. So `/logout` broadcasts on the `wallet-auth` BroadcastChannel (`apps/web/src/auth/sessionChannel.ts:3`).\
  The protected layout calls `onLogout` (`apps/web/src/app/(protected)/layout.tsx:49`). Its handler sends the tab to `/login`.
- **Each wallet feature has an API client and a hook.**\
  The API clients are in `packages/wallet/src/api/`. The hooks are in `packages/wallet/src/hooks/`.\
  `packages/wallet/src/utils/config.ts:9` reads `NEXT_PUBLIC_TREETRACKER_WALLET_API` on web. On native, it reads Expo `extra.apiBaseUrl`.\
  `WalletApiError` carries the server `reason` slug (`packages/wallet/src/api/errors.ts`). So a caller can test for `no_wallet`.\
  The profile update sends multipart form data, because the wallet API rejects JSON (`packages/wallet/src/api/updateWallet.ts:5`).
- **The web app is a static export.**\
  `apps/web/next.config.js:6` sets `output: "export"`. The build writes static files. The pages load their data in the browser. CI deploys the `out` folder to S3.\
  A static export does not serve route handlers. So `apps/web/src/app/api/auth/login/route.ts` and `apps/web/src/app/api/auth/signup/route.ts` do not run. Also, no code calls them.
- **Share links give tokens without a recipient wallet.**\
  The send page can create a share link instead of a transfer. The wallet API calls the link an action token (`POST /action-tokens`). The link has the form `/claim?action_token=` and comes with a QR code.\
  A share link is single use. `claimPendingToken` removes the saved link before the redeem request (`apps/web/src/utils/claimPendingToken.ts:30`).\
  A signed-out user or a user without a wallet gets the link saved in localStorage under `pending_action_token` (`apps/web/src/utils/actionToken.ts:4`).
- **Only the web client enforces some rules.**\
  The web app allows 2 wallets per user (`apps/web/src/app/(protected)/wallet/page.tsx:28`). The domain graph notes that the wallet API sets no limit.\
  The send page needs a whole amount of at least 1 and not more than `tokens_available` (`apps/web/src/app/(protected)/send/page.tsx:59`). The recipient must not be the sender wallet (line 76).

## Guided Tour

The tour has 15 steps. The bold names are the tour titles in the graph.

1. **Project Overview**\
   Files: `README.md`, `package.json`, `CONTRIBUTING.md`\
   What to see: the root scripts delegate to the workspaces. Examples are `web:dev`, `user:dev`, and `bdd:e2e`.
2. **Shared Auth State**\
   Files: `packages/core/src/index.ts`, `packages/core/src/atoms/auth/index.ts`, `packages/core/src/atoms/auth/tokenAtom.ts`, `packages/core/src/utils/storage.ts`, `packages/core/src/atoms/auth/loginAtom.ts`\
   What to see: look at `tokenAtom` and its storage choice.\
   Note: no app imports `loginAtom` or `registerAtom`. So their calls to the user API never run.
3. **Wallet Client Foundations**\
   Files: `packages/wallet/src/index.ts`, `packages/wallet/src/types/wallet.ts`, `packages/wallet/src/utils/config.ts`, `packages/wallet/src/api/errors.ts`\
   What to see: look at the barrel export, the shared types, the base URL rule, and the typed error.
4. **Wallet API Clients and Hooks**\
   Files: `packages/wallet/src/api/createWallet.ts`, `packages/wallet/src/hooks/useCreateWallet.ts`, `packages/wallet/src/api/sendTransfer.ts`, `packages/wallet/src/hooks/usePendingTransfers.ts`, `packages/wallet/src/api/redeemActionToken.ts`\
   What to see: `usePendingTransfers` fetches the `requested` and `pending` states and merges them (line 27).
5. **Web App Root and Keycloak**\
   Files: `apps/web/src/app/layout.tsx`, `apps/web/src/components/KeycloakProvider.tsx`, `apps/web/src/auth/keycloak.ts`, `apps/web/src/app/page.tsx`, `apps/web/src/app/auth/callback/page.tsx`\
   What to see: the callback page reads the `authenticated` flag and goes to `/home` or `/login` (`apps/web/src/app/auth/callback/page.tsx:16`).
6. **Protected Routes and Navigation**\
   Files: `apps/web/src/app/(protected)/layout.tsx`, `apps/web/src/auth/sessionChannel.ts`, `apps/web/src/components/header/Header.tsx`, `apps/web/src/context/HeaderContext.tsx`, `apps/web/src/components/navigation/BottomNavigatorBar.tsx`\
   What to see: the layout redirects to `/login` when `tokenAtom` is empty (line 42). The bottom bar badges Notifications with the incoming transfer count (line 100).\
   Note: the default header shows only the logo and the title. It has no search button.
7. **Web Wallet Features**\
   Files: `apps/web/src/app/(protected)/home/page.tsx`, `apps/web/src/app/(protected)/wallet/page.tsx`, `apps/web/src/app/(protected)/send/page.tsx`, `apps/web/src/app/(protected)/transfers/page.tsx`, `apps/web/src/app/claim/page.tsx`\
   What to see: the home page loads the 5 latest transfers (line 57). The transfers page loads the 20 latest (line 218).
8. **Native App Shell**\
   Files: `apps/native/app/_layout.tsx`, `apps/native/app/index.tsx`, `apps/native/context/ModalContext.tsx`, `apps/native/components/ActionSelectionModal.tsx`, `apps/native/app/(tabs)/_layout.tsx`\
   What to see: `apps/native/app/index.tsx:11` reads the AsyncStorage flags `hasLaunched` and `isAuth`. The flags pick onboarding, the home tab, or the sign-in screen.
9. **Native Screens and Design Tokens**\
   Files: `apps/native/app/(tabs)/home/index.tsx`, `packages/core/src/atoms/search/index.ts`, `apps/native/components/HeaderSearch.tsx`, `apps/native/theme/index.ts`, `apps/native/constants/Colors.ts`\
   What to see: look at the design tokens and the search atoms.\
   Note: the home tab shows a fixed 1000 tokens and 2 wallets (`apps/native/app/(tabs)/home/index.tsx:33`). The search atoms filter the hard-coded `mockData` (`packages/core/src/atoms/search/index.ts:62`).
10. **User API Bootstrap**\
   Files: `apps/user/src/main.ts`, `apps/user/src/app.module.ts`, `apps/user/src/user/user.controller.ts`, `apps/user/libs/validation/dtos/register-user.dto.ts`, `apps/user/docs/api/spec/user-api.yaml`\
   What to see: Swagger runs outside production (`apps/user/src/main.ts:11`). The controller has `POST /login`, `POST /register`, `GET /healthz`, and `GET /me`.\
   Note: the OpenAPI spec also lists `/gift-token`. The controller has no such route.
11. **Keycloak Identity Integration**\
   Files: `apps/user/src/user/user.service.ts`, `apps/user/src/auth/auth.service.ts`, `packages/keycloak/src/index.ts`, `packages/keycloak/src/api/createAccountFromKeycloak.ts`, `packages/keycloak/src/api/fetchTokenFromKeycloak.ts`\
   What to see: `AuthService` caches its `client_credentials` token until `expires_in` elapses (`apps/user/src/auth/auth.service.ts:44`).\
   Note: only the BDD seed and the package tests import the Keycloak package. The apps do not import it.
12. **Wallet Creation Queue**\
   Files: `apps/user/src/queue-listener/queue-listener.service.ts`, `apps/user/src/queue-listener/helpers/onQueueNotification.ts`, `packages/queue/index.js`, `packages/queue/subscribe.js`, `packages/queue/publish.js`\
   What to see: the listener subscribes to the `wallets/creation` channel. For each event, it sends a reward bundle.\
   Note: no code outside the queue tests publishes to that channel. The listener also has defects (see Complexity Hotspots).
13. **BDD and Component Testing**\
   Files: `apps/bdd/features/send-token.feature`, `apps/bdd/features/step-definitions/steps.ts`, `apps/bdd/utils/seed.ts`, `apps/bdd/wdio.base.conf.ts`, `apps/web/cypress.config.ts`\
   What to see: the web run takes the `@web and not @skip` scenarios (`apps/bdd/wdio.web.conf.ts:18`).
14. **Containers and Kubernetes**\
   Files: `apps/user/Dockerfile`, `apps/user/deployment/base/kustomization.yaml`, `apps/user/deployment/base/deployment.yaml`, `apps/user/deployment/base/mapping.yaml`, `apps/user/deployment/overlays/development/kustomization.yaml`\
   What to see: the image runs `dist/src/main.js` on port 8080. The Mapping routes `/user-api/` to the Service.\
   Note: no workflow in this repo builds the image or applies the manifests.
15. **CI/CD and Releases**\
   Files: `.github/workflows/pr-ci-cd-all.yml`, `.github/workflows/ci-cd-pr-bdd-wallet.yml`, `.github/workflows/static-website-deploy-dev.yml`, `.github/workflows/build-dev-docker-img-and-relase.yml`, `.releaserc.js`\
   What to see: the BDD workflow builds the export, starts the user API, and serves `apps/web/out` on port 3000 (lines 95 to 100).\
   Note: the release workflow runs only semantic-release on `main`. Its file name says "docker img", but it builds no image.

## File Map (by layer)

**Web Wallet App**

- `apps/web/src/app/layout.tsx`: this layout wraps every page in the MUI theme and `KeycloakProvider`.
- `apps/web/src/app/(protected)/layout.tsx`: this layout gates the protected pages. It mounts `PendingClaimHandler` when a saved share link exists (line 66).
- `apps/web/src/app/(protected)/send/page.tsx`: this page sends a bundle to a named wallet. It can also create a share link with a QR code.
- `apps/web/src/app/(protected)/transfers/page.tsx`, `apps/web/src/app/(protected)/notifications/details/page.tsx`: these pages accept, decline, and cancel transfers. The transfers page also cancels active share links.
- `apps/web/src/app/(protected)/wallet/details/page.tsx`, `apps/web/src/app/(protected)/wallet/customize/page.tsx`, `apps/web/src/components/WalletProfileDrawer.tsx`: these files show and edit the wallet profile. Images must be at most 1MB (`customize/page.tsx:28`).
- `apps/web/src/app/(protected)/token/details/page.tsx`: this page shows one token, its tree photo, a map link, and its transaction history.
- `apps/web/src/app/(protected)/settings/account/page.tsx`, `apps/web/src/utils/userProfile.ts`: these files show the email from `GET /me` of the user API. The Keycloak userinfo endpoint is the fallback (line 92).
- `apps/web/src/app/(protected)/search/page.tsx`, `apps/web/src/components/WalletDetailModal.tsx`: these files are a mock. The page filters three hard-coded wallets (`search/page.tsx:27`). The modal only stores a `pendingTransaction` in sessionStorage (`WalletDetailModal.tsx:236`).
- `apps/web/src/app/api/auth/login/route.ts`, `apps/web/src/app/api/auth/signup/route.ts`, `apps/web/src/app/api/services/tokenService.ts`: these handlers are not used. `tokenService.ts:9` reads Keycloak admin credentials from `NEXT_PUBLIC_*` variables. Next.js puts `NEXT_PUBLIC_*` values into browser code. So do not set these variables.
- `apps/web/src/app/(protected)/welcome/page.tsx`, `apps/web/src/app/(public)/account-created/page.tsx`, `apps/web/src/components/navigation/ChooseAction.tsx`, `apps/web/src/components/QRCodeDisplay.tsx`: these files have no live link or import.

**Native Mobile App**

- `apps/native/app/_layout.tsx`: this layout waits for the Roboto fonts. Then it renders the routes in `ModalProvider` with `ActionSelectionModal`.
- `apps/native/app/(auth)/login.tsx`: this screen is a stub. `handleLogIn` sets a flag and stores `isAuth` in AsyncStorage (line 25). It calls no API.
- `apps/native/app/(tabs)/wallet/index.tsx`, `apps/native/app/(tabs)/wallet/[walletId].tsx`: these screens show two hard-coded wallets and placeholder activity. Wallet creation only logs (`wallet/index.tsx:50`).
- `apps/native/app/transfer/index.tsx`, `apps/native/app/transfer/entry.tsx`: these screens take a recipient and an amount. Then they return to the home tab with a snackbar (`entry.tsx:140`).
- `apps/native/app/scancode.tsx`: this screen reads a recipient from a QR code. The code comes from the camera or from a gallery image.
- `apps/native/theme/index.ts`, `apps/native/constants/Colors.ts`: these files hold the colors, spacing, and typography.
- `apps/native/data/data.ts`, `apps/native/data/walletActivityPlaceholder.ts`: these files hold the mock activity.

**User API Service**

- `apps/user/src/main.ts`: this file sets the ValidationPipe with `whitelist` (line 34), CORS, and port 8080.
- `apps/user/src/app.module.ts`: this module loads `.dev.env` when `NODE_ENV` is `dev`, and `.env` in other cases (line 21). `yarn user:dev` sets `NODE_ENV=dev`.
- `apps/user/src/user/user.controller.ts`: this controller rejects `GET /me` without a bearer token with 401 (line 39).
- `apps/user/src/user/user.service.ts`: this service uses the password grant for sign-in (line 28). It uses the Keycloak admin API for registration (line 85).
- `apps/user/src/queue-listener/queue-listener.service.ts`: this service sends the new-wallet reward. `CONTRIBUTING.md:124` tells how to turn off `QueueModule` when the queue fails.

**Shared Client Packages**

- `packages/wallet/src/api/*.ts`: each file makes one wallet API call. Examples are `POST /transfers` and `POST /action-tokens/redeem`.
- `packages/wallet/src/hooks/*.ts`: each hook binds one call to `tokenAtom`.
- `packages/wallet/src/api/getTokenTree.ts`: this file calls the query API without a token (line 12).
- `packages/core/src/atoms/search/index.ts`, `packages/core/src/data/mockData.ts`: these files hold the search state. The data is five mock users and five mock businesses.
- `packages/core/src/api/wallet.ts`: this file is a mock wallet API that uses faker. The hooks barrel does not export its hook.

**Identity and Messaging Packages**

- `packages/keycloak/src/api/*.ts`: these files get a service-account token, and they create or delete a realm user.
- `packages/queue/publish.js`, `packages/queue/subscribe.js`, `packages/queue/ack.js`: these files insert into `queue.message`, LISTEN on a channel, and record each receipt.
- `packages/queue/pgClient.js`: this file connects two PostgreSQL clients from `DATABASE_URL` when a module imports it.

**Testing and QA**

- `apps/bdd/utils/seed.ts`: this file recreates fixed users, wallets, and tokens. It writes directly into the wallet database from `WALLET_DATABASE_URL` (line 26). So point it only at a test database.
- `apps/bdd/features/*.feature`: the active web features cover sign-in, registration, wallet creation, customization, send, and share. The features of iterations 3 to 5 are `@skip`.
- `apps/web/cypress/component/*.cy.tsx`: these files are the component tests of the web parts.
- `apps/web/cypress/e2e/*.cy.ts`: these files are the E2E specs. Complexity Hotspots lists the stale ones.
- `apps/user/src/**/*.spec*.ts`, `apps/user/tests/api.spec.e2e.ts`: these files are the unit, integration, and E2E suites. Each suite has its own Jest config.

**Deployment and CI/CD**

- `apps/user/Dockerfile`: this file has two `node:18-alpine` stages (lines 1 and 9).
- `apps/user/deployment/base/deployment.yaml`: this manifest runs 2 replicas on container port 8080 (lines 9 and 32).
- `.github/workflows/static-website-deploy-dev.yml`: this workflow syncs the export to S3 (line 92). Then it invalidates CloudFront (line 96).
- `.github/workflows/ci-cd-deploy-web-prod.yml`, `.github/workflows/ci-cd-deploy-web-test.yml`: these workflows deploy the export on a manual run.
- `.github/workflows/ci-cd-pr-*.yml`: each workflow runs the tests of one workspace when its files change.

**Workspace and Tooling Configuration**

- `apps/web/next.config.js`: this file sets the static export and the Jotai alias.
- `apps/web/package.json`: the `dev` and `start` scripts end with `yarn workspace wallet_state loadEnv`. No workspace has that name.
- `packages/config/index.js`, `packages/config/prettier.config.json`: these files hold the shared ESLint and Prettier rules.
- `apps/*/.env.example`, `packages/*/.env.example`: these files are the env templates.

**Documentation**

- `README.md`, `CONTRIBUTING.md`: these guides give the setup, the scripts, the layout, and the Conventional Commits rules.
- `apps/bdd/README.md`, `apps/bdd/bdd-testing.md`, `apps/native/README.md`: these guides tell how to run the BDD suite on web, Android, and iOS.

## Complexity Hotspots

The graph rates 22 file-level nodes as complex. The line counts come from the files.

- **Reward listener**\
  Files: `apps/user/src/queue-listener/queue-listener.service.ts`, `apps/user/src/queue-listener/helpers/onQueueNotification.ts`\
  Why: the graph rates these files simple or moderate. But the host and token defects below stop every reward call.\
  Host: the calls use relative paths such as `/wallet/v2/transfers` (line 7). The HttpModule sets no base URL (`queue-listener.module.ts:7`). So the requests have no host and cannot reach the wallet API.\
  Token: the `Authorization` header uses `this.authService.getToken()` without `await` (line 47). So the header holds the text `Bearer [object Promise]`, not a token.\
  Payload: the helper parses `msg.payload` (`onQueueNotification.ts:29`). `packages/queue/subscribe.js:22` emits the `queue.message` row instead. `packages/queue/publish.js:2` writes the event into the `data` column. The table schema is not in this repo, so the full column list is unknown. When the row has no `payload` field, `JSON.parse` throws and the callback does not run.\
  Body: the body uses `receive_wallet` (line 42). The wallet package sends `receiver_wallet` to `POST /transfers` (`packages/wallet/src/api/sendTransfer.ts:20`).\
  Result: the catch block returns `transferStatus: true` (line 56). So a failed reward looks like a success.\
  Setup: `REGISTER_REWARD_TOKEN_COUNT` and `SENDER_WALLET_ID` are not in `apps/user/.env.example`.
- **BDD steps and tools**\
  Files: `apps/bdd/features/step-definitions/steps.ts` (1287), `apps/bdd/scripts/watch.ts` (727), `apps/bdd/utils/seed.ts` (332), `apps/bdd/wdio.base.conf.ts` (269), `apps/bdd/features/step-definitions/share-token.steps.ts` (236)\
  Why: one large file holds the steps of sign-in, wallets, tokens, transfers, and settings. The seed changes database rows directly.
- **Stale Cypress E2E specs**\
  Files: `apps/web/cypress/e2e/login.cy.ts`, `apps/web/cypress/e2e/signup.cy.ts`, `apps/web/cypress/e2e/search-action.cy.ts`\
  Why: `login.cy.ts:57` types into the `login-username` element (`apps/web/cypress/support/auth-constants.ts:6`). No element in `apps/web/src` has that id. The `/login` page only redirects to Keycloak. `signup.cy.ts` has the same problem with `signup-username`.\
  Search: `search-action.cy.ts:10` expects the `ChooseAction` drawer after the Send tab. The Send tab now opens `/send` (`BottomNavigatorBar.tsx:33`).\
  CI: `.github/workflows/ci-cd-pr-web-wallet.yml:68` runs these specs on each web pull request.
- **Web wallet pages**\
  Files: `apps/web/src/app/(protected)/wallet/customize/page.tsx` (411), `apps/web/src/app/(protected)/transfers/page.tsx` (368), `apps/web/src/app/(protected)/send/page.tsx` (274), `apps/web/src/app/(protected)/wallet/details/page.tsx` (250), `apps/web/src/app/(protected)/notifications/details/page.tsx` (248), `apps/web/src/components/WalletCreateDrawer.tsx` (246)\
  Why: each file holds its own form state, its validation, and several wallet hooks.
- **Web mock and unused parts**\
  Files: `apps/web/src/components/WalletDetailModal.tsx` (373), `apps/web/src/components/RichTextEditor.tsx` (224)\
  Why: the modal belongs to the mock search page. Its UNDO only logs (`apps/web/src/context/SnackbarContext.tsx:41`). The editor uses `document.execCommand`.
- **Native screens**\
  Files: `apps/native/app/scancode.tsx` (499), `apps/native/components/wallet/WalletFilterModal.tsx` (437), `apps/native/app/(tabs)/home/index.tsx` (376), `apps/native/app/onboarding/index.tsx` (231)\
  Why: these screens are large, but they run on mock data. The wallet detail screen passes no `onApply` to `WalletFilterModal` (`apps/native/app/(tabs)/wallet/[walletId].tsx:88`). So APPLY does nothing.
- **CI pipelines**\
  Files: `.github/workflows/ci-cd-pr-bdd-android.yml` (327), `.github/workflows/ci-cd-pr-bdd-wallet.yml` (181)\
  Why: these workflows start several services and an emulator. The web BDD workflow runs on `pull_request_target` (line 7), so it has the secrets of the base repo. It runs only for pull requests from branches of the same repo (line 35).\
  Lint: `.github/workflows/pr-ci-cd-all.yml:32` runs `lint-staged`. CI has no staged files. So that step checks nothing.
- **Other complex files**\
  Files: `apps/user/src/user/user.controller.spec.int.ts` (267), `CONTRIBUTING.md` (456), `README.md` (355)\
  Why: the integration suite checks the HTTP status of each registration case and each sign-in case. The two guides hold the setup steps. Check their env commands against the code.

## Business Domains

`domain-graph.json` has 5 domains, 20 flows, and 126 steps. The bold names are the flow labels in the graph. The domain view of the viewer shows each step.

**Authentication and Identity**: this domain covers sign-in, registration, the session, and the profile.

- **Sign In or Register with Keycloak** (entry: `GET /login` or `GET /signup`, web)\
  The page redirects to the Keycloak hosted page. Then `/auth/callback` processes the code. After registration, the callback goes straight to `/home`, so no user sees `/welcome`.
- **Log Out Across Tabs** (entry: the log out button on `/settings` or `/settings/account`, web)\
  `/logout` clears the tokens and broadcasts the log out. Then Keycloak ends the SSO session and returns to `/login`.
- **View Account Profile** (entry: `GET /settings/account` on web, `GET /me` on the user API)\
  The page shows the email and the member-since date. A link opens the Keycloak account console for password changes.
- **User API Login and Registration** (entry: `POST /login`, `POST /register`, user API)\
  The user API proxies these calls to Keycloak. Only the Cypress `login` command and the tests of the user API call them.
- **Native Onboarding and Login** (entry: app launch, native)\
  The app picks onboarding, the home tab, or the sign-in screen from AsyncStorage flags. The sign-in screen is a stub. Sign up goes to `/(auth)/register`, and that route does not exist (`apps/native/app/onboarding/index.tsx:69`).

**Wallet Management**: this domain covers the dashboard, the wallets, the profiles, and the token provenance.

- **View Wallet Dashboard** (entry: `GET /home`, web)\
  The page shows the token total with the pending count, the wallet count, and the 5 latest transfers. The native home tab shows fixed numbers instead.
- **Create Wallet** (entry: CREATE WALLET on `/wallet`, web)\
  The drawer needs a unique name and a description. After the create, the page redeems a saved share link into the new wallet.
- **Reward New Wallet** (entry: PostgreSQL LISTEN `wallets/creation`, user API)\
  The user API sends a reward bundle to the first wallet of a new user. Nothing publishes the event. The defects in Complexity Hotspots stop the reward calls.
- **Browse Wallet Tokens and Provenance** (entry: `GET /wallet/details?name=` and `GET /token/details?id=`, web)\
  The details page shows the wallet balance and the token list. The token page shows the tree photo, the species, a map link, and the history of one token.
- **Edit Wallet Profile** (entry: Edit or Customize on `/wallet/details`, web)\
  The display name needs 2 to 30 characters. The about text needs 5 to 250 characters. The page saves through a multipart PATCH.
- **Native Wallet Screens (Mock)** (entry: the Wallet tab, native)\
  The tab lists two hard-coded wallets. Create only logs. The detail screen passes no handler to Edit wallet and Delete wallet (`apps/native/app/(tabs)/wallet/[walletId].tsx:86`).

**Token Transfer**: this domain covers bundles between wallets.

- **Send Tokens to Wallet** (entry: the Send tab, `GET /send`, web)\
  The page sends an N-token bundle through `POST /transfers`. After 1.2 seconds, it opens `/transfers`.
- **Review Incoming Transfer** (entry: `GET /notifications` and `GET /notifications/details?id=`, web)\
  The recipient accepts or declines a pending transfer to one of the user's wallets. The native notifications tab shows four hard-coded items instead.
- **Manage Pending Transfers and History** (entry: `GET /transfers` and `GET /transfers/details?id=`, web)\
  The page groups incoming, outgoing, and recent transfers. It offers Cancel only on outgoing pending transfers (`apps/web/src/app/(protected)/transfers/page.tsx:319`).
- **Native Send or Request (Mock)** (entry: the center swap button of the tab bar, native)\
  The user picks a recipient from mock results or a QR code and enters an amount. No wallet API call follows.

**Share Links and Claims**: this domain covers tokens for a person without a known wallet.

- **Create and Manage Share Links** (entry: the Share by QR code option on `/send`, web)\
  The send page creates a share link with a QR code. The recipient email is a fixed placeholder (`apps/web/src/app/(protected)/send/page.tsx:91`).
- **Claim Shared Tokens** (entry: `GET /claim?action_token=`, web)\
  A signed-in user with a wallet redeems the share link at once. Other users get the link saved. Later, the protected layout or the first wallet creation redeems it.

**Search and Discovery**: this domain covers the recipients of the native send and request flow.

- **Native Recipient Search** (entry: the search icon of the header bar, native)\
  The header writes the query to the core search atoms. The atoms filter the hard-coded `mockData`. The search tab is hidden (`apps/native/app/(tabs)/_layout.tsx:22`).
- **Scan Recipient QR Code** (entry: the Scan or show QR code card, native)\
  The screen reads a recipient name from JSON, a URL query, or plain text. Then it opens the transfer entry screen in send mode.
- **Web Wallet Search (Mock)** (entry: `GET /search?action=send|request`, direct URL only)\
  The page filters three hard-coded wallets and calls no API. The home page shows the stored `pendingTransaction` as a snackbar.

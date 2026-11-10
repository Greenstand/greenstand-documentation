# Onboarding Guide: treetracker-web-map-client

_Generated from the Understand-Anything knowledge graph. Source commit `42b3a9a`._

## Project Overview

Treetracker Web Map shows the location and details of the trees that Greenstand tracks (`README.md`). It is a Next.js web app with React and MUI.

- **Package**\
  Name and version: `client` 2.10.3 (`package.json`)\
  Node: `package.json` asks for `>=16`. The README asks for Node v16.
- **Languages**\
  Code and config: JavaScript, JSON, YAML, CSS, HTML, Markdown, Dockerfile, plain text, and other config files\
  Binary files: the graph also lists `sqlite` and `webp`. These are `.vs/slnx.sqlite` and `public/images/bg.webp`.
- **Frameworks**\
  Stack: Next.js 12, React 17, MUI 5, Leaflet\
  Tests and tools: Jest, Cypress, MSW, Docker, GitHub Actions\
  Tree map: built on the map core package, `treetracker-web-map-core` (`package.json`)
- **Entry point**\
  File: `src/pages/_app.js`\
  Role: it wraps every page and picks the layout.
- **Graph size**\
  Files: 387\
  Nodes and edges: 647 and 836\
  Layers and tour steps: 9 and 13
- **Quick start**\
  Run: `npm i`, then `npm run dev`, then open `http://localhost:3000`\
  With mocks: `npm run dev:mock` starts the same server with MSW.

How the parts fit:

- Pages in `src/pages/` load their data on the server through `src/models/api.js`.
- `src/pages/_app.js` puts each page into a layout.
- The desktop layout `src/components/Layout.js` shows the page on the left half and the tree map on the right half.
- The tree map is `src/components/App.js`. It mounts `Map` from the map core package.
- `src/mapContext.js` shares the tree map instance with pages and components.
- The README links the current map API repo, `treetracker-query-api`. The code reads the API base URL from `NEXT_PUBLIC_API`.

## Architecture Layers

The graph puts each file into one of 9 layers.

- **Pages and Routing**\
  Files: 19\
  What it holds: Next.js pages, admin pages, error pages, the app shell, and the `/api/runtime-env` route.\
  Key files: `src/pages/_app.js`, `src/pages/_document.js`, `src/pages/trees/[treeid].js`, `src/pages/api/runtime-env.js`
- **UI Components**\
  Files: 104\
  What it holds: React and MUI components for the map, the layouts, entity cards, sharing, search, the admin dashboard, the theme playground, and the design sandbox.\
  Key files: `src/components/App.js`, `src/components/Layout.js`, `src/components/LayoutMobile.js`, `src/components/LayoutEmbed.js`, `src/components/Navbar.js`
- **State and Hooks**\
  Files: 22\
  What it holds: React contexts for the map, theme, drawer, config, dashboard, and playground, plus custom hooks.\
  Key files: `src/mapContext.js`, `src/context/themeContext.js`, `src/context/configContext.js`, `src/hooks/globalHooks/index.js`
- **Models and API Client**\
  Files: 13\
  What it holds: the API client and URL builders, the URL path resolver, runtime env access, OIDC config, the config reducer, and shared helpers.\
  Key files: `src/models/api.js`, `src/models/apiPaths.js`, `src/models/pathResolver.js`, `src/models/runtimeEnv.js`, `src/models/utils.js`
- **Testing**\
  Files: 96\
  What it holds: Cypress component, integration, and e2e tests, Jest tests, fixtures, MSW mocks, and test setup.\
  Key files: `src/models/test-utils.js`, `src/mocks/handlers.js`, `cypress/plugins/index.js`, `cypress/tests/integration/nockRoutes.js`
- **Infrastructure**\
  Files: 67\
  What it holds: three Dockerfiles and five Kustomize trees: `deployment/`, `deployment-alpha/`, `deployment-beta/`, `deployment-main/`, `deployment-next/`. Each tree has a `base/` and the overlays `development`, `test`, and `prod`.\
  Key files: `Dockerfile`, `deployment/base/deployment.yaml`, `deployment/overlays/prod/deployment.yaml`
- **CI/CD**\
  Files: 6\
  What it holds: GitHub Actions workflows for pull request checks, release builds, and deploys.\
  Key files: `.github/workflows/pull-request-ci.yml`, `.github/workflows/dev-build-release.yaml`, `.github/workflows/deploy.yaml`
- **Documentation**\
  Files: 35\
  What it holds: the README, the changelog, issue and PR templates, two OpenAPI files, example API payloads, and `public/robots.txt`.\
  Key files: `README.md`, `doc/web-map-api.yaml`, `doc/web-map-router.yaml`, `doc/examples/`
- **Configuration**\
  Files: 25\
  What it holds: package, Next.js, Jest, Cypress, lint, format, commit hook, and env config. It also holds the Visual Studio files in `.vs/` and one static image.\
  Key files: `package.json`, `next.config.js`, `.env.development`, `.env.production`, `.env.test`, `.releaserc.json`

## Key Concepts

- **The shell picks one of six layouts.**
  - `src/pages/_app.js` checks the path first. A path with `admin` gets `src/components/LayoutDashboard.js` and `AuthProvider` only. It gets no theme, drawer, or map provider from the shell.
  - Desktop gets `src/components/Layout.js`. Desktop in embed mode gets `src/components/LayoutEmbed.js`.
  - Mobile gets `src/components/LayoutMobileB.js` when the page sets `isBLayout`, and `src/components/LayoutMobileC.js` when the page sets `isCLayout`. Other pages get `src/components/LayoutMobile.js`.
  - The home page sets `isBLayout`, and the search page sets `isCLayout`. `LayoutMobileB.js` and `LayoutMobileC.js` show no map. So on a phone, the home page shows no map.
  - The server reads the device type from the user agent. The browser uses the MUI `sm` breakpoint.
  - Embed mode is on when the URL has `embed=true` or when the local storage flag `embed` is set. The full-screen icon in `Layout.js` toggles that flag. The mobile branch ignores embed mode.

- **The tree map comes from the map core package.**
  - `src/components/App.js` creates `Map` from the map core package (`treetracker-web-map-core`) and mounts it.
  - The layouts load `App.js` with `next/dynamic` and `ssr: false`.
  - `App.js` stores the tree map instance in `src/mapContext.js`. Pages get it with `useMapContext()` and call `setFilters`, `gotoView`, or `gotoBounds`.

- **The URL holds the map state.**
  - On a tree click, `App.js` fetches the tree and asks `getPathWhenClickTree` in `src/models/pathResolver.js` for the next route. Then it calls `router.push`.
  - When the map stops moving, `updatePathWhenMapMoveEnd` builds `?bounds=...` and keeps `timeline`, `embed`, and `tree_id`. `App.js` writes it with `history.replaceState`.
  - `src/components/Home.js` and `src/pages/top.js` read `bounds` back and move the map.
  - `next.config.js` redirects old query links (`?treeid=`, `?userid=`, `?wallet=`) to `/trees/`, `/planters/`, and `/wallets/`.
  - `App.js` also posts each clicked tree to `window.parent` and to a React Native WebView, if one is present.

- **Tile settings can change at runtime.**
  - `src/pages/_document.js` loads `/api/runtime-env` as a blocking script.
  - `src/pages/api/runtime-env.js` returns `window.__RUNTIME_ENV__`. It escapes the output and sets `no-store` and `nosniff`. It answers 405 to methods other than GET and HEAD.
  - The allowlist in `src/models/runtimeEnv.js` has three keys: `NEXT_PUBLIC_TILE_SERVER_URL`, `NEXT_PUBLIC_TILE_SERVER_SUBDOMAINS`, and `NEXT_PUBLIC_TILE_SERVER_WEBMAP_API`.
  - `getEnv` uses the runtime value first and the build-time value second. It throws for any other key.
  - Other code reads `process.env.NEXT_PUBLIC_*` directly. For example, `App.js` passes `NEXT_PUBLIC_API` to the map as `queryApiServerUrl`.

- **Pages load on the server and degrade on failure.**
  - `src/models/api.js` wraps axios GET calls. `src/models/apiPaths.js` builds the URLs from `NEXT_PUBLIC_API`. The stakeholder URL uses `NEXT_PUBLIC_API_V2`.
  - Calls stop after 15 seconds (`API_TIMEOUT_MS` in `src/models/utils.js`).
  - Not every call goes through `api.js`. `src/pages/search.js` and `src/pages/tokens/[tokenid].js` call axios directly. `src/pages/top.js` and `src/pages/wallets/[walletid].js` also use `requestAPI` from `utils.js`.
  - The tree, planter, organization, wallet, capture, and top pages use ISR (Incremental Static Regeneration: Next.js builds the page again in the background after `revalidate` seconds). `revalidate` is `NEXT_CACHE_REVALIDATION_OVERRIDE`, else 300 seconds. The dynamic pages use `fallback: 'blocking'`. `next.config.js` sets `isrMemoryCacheSize: 0`.
  - `wrapper` in `utils.js` catches loader errors. A 404 gives `notFound`. Other errors give a `loadError` prop and a 30 second revalidate. The page then shows `src/components/common/PageLoadError.js`.
  - `getOrgLinks` in `api.js` loads featured trees, associates, and species with `Promise.allSettled`. One failed part gives a `partialErrors` entry, and the page shows `SectionUnavailable` for that part.
  - The token page uses `getServerSideProps` without `wrapper`. Any error gives a 404.

- **The theme comes from local storage, the OS, or a config API.**
  - `src/context/themeContext.js` builds the light and dark MUI themes.
  - The mode comes from local storage, else from the OS color-scheme preference.
  - When `NEXT_PUBLIC_CONFIG_API` is set, it loads the theme of organization 1 from that API. The value is empty in `.env.development` and `.env.test`, and `.env.production` does not set it.
  - The admin theme playground sends `playground:theme-update` events to an iframe of `/top`. `themeContext.js` listens for that event.

- **Navbar config and admin config are separate.**
  - `src/components/Navbar.js` reads its nav items from `ConfigProvider`.
  - `_app.js` fills `ConfigProvider` with `defaultConfig`. When `NEXT_PUBLIC_SERVER_CONFIG_DISABLED` is unset, it fetches a hard-coded dev URL instead (`src/pages/_app.js:255`). All three env files set the flag to `true`.
  - The admin dashboard at `/admin/global` edits the logo, the navbar, and the map location. `src/context/dashboardContext.js` saves the edits to local storage. No public page reads that state.

- **Login code exists, but the UI hides it.**
  - `_app.js` wraps all pages in `AuthProvider` from `react-oidc-context`. `src/models/oidcConfig.js` reads the Keycloak env variables.
  - `Navbar.js` comments out the sign-in controls ("hide login temporarily").
  - The admin pages call `useKeycloak` from `@react-keycloak/ssr`. `LayoutDashboard.js` has its `SSRKeycloakProvider` commented out.

- **Each test level has its own mock.**
  - Dev server: `NEXT_PUBLIC_API_MOCKING=enabled` (or `npm run dev:mock`) makes `_app.js` load `src/mocks/index.js`. It starts MSW on the server side and the MSW worker in the browser. `src/mocks/handlers.js` holds the routes.
  - Jest: `.jest/setupFile.js` starts the MSW server for the test run.
  - Cypress integration: `cypress/plugins/index.js` starts a custom Next.js server on port 3000. It stubs server-side calls with nock when the `nock` env is set. `npm run cy` sets it.
  - API spec: `npm run mock-server` serves `doc/web-map-api.yaml` with Prism.
  - The README names `npm run cy:nock` and `npm run cyu`. `package.json` has neither script.

- **No page reaches 31 files.** No page reaches 31 non-test files in `src/`. Check this before you build on a file.
  - Models: `src/models/MapModel.js`, `src/models/entity.js`, `src/models/mapConfig.js`, `src/models/tools.js`. Only their own tests import `MapModel.js`, `entity.js`, and `tools.js`.
  - Search widget: all six files in `src/components/search/`, including `mockApi.js`.
  - Components: `src/components/PageWrapper.js`, `src/components/ShareDeprecated.js`, `src/components/DrawerDeprecated.js`, `src/components/ShareIcon.js`, `src/components/SearchFilterMobile.js`, `src/components/SearchBoxMobile.js`, `src/components/Loader.js`, `src/components/LoaderB.js`, `src/components/Logo.js`, `src/components/ImageShower.js`, `src/components/BackButton.js`, `src/components/common/BackButton.js`, `src/components/common/CustomImageWrapper.js`, `src/components/common/DataTag.js`, `src/components/common/DrawerTitle.js`.
  - Design sandbox: all six files in `src/DesignSandbox/`. Only its test, `src/DesignSandbox/DesignSandbox.cy.js`, imports it.

## Guided Tour

Follow these 13 steps in order.

1. **Project overview**\
    Files: `README.md`, `package.json`\
    What to see: the README covers setup, TDD, and the test rules. `package.json` shows the stack and the scripts.
2. **App shell**\
    Files: `src/pages/_app.js`, `src/pages/_document.js`\
    What to see: `_app.js` sets up the providers, Google Analytics, error logging, the route progress bar, and the layout choice. `_document.js` loads the runtime env script and the Google fonts.
3. **Routing with pages**\
    Files: `src/pages/index.js`, `src/pages/trees/[treeid].js`, `src/pages/planters/[planterid].js`, `src/pages/organizations/[organizationid].js`\
    What to see: Next.js maps each file to a route. The home page renders `src/components/Home.js`.
4. **Models and API client**\
    Files: `src/models/api.js`, `src/models/apiPaths.js`, `src/models/runtimeEnv.js`, `src/models/MapModel.js`\
    What to see: the loaders call `api.js`, and `apiPaths.js` builds the URLs.\
    Note: no page reaches `MapModel.js`. Only its test imports it. The tree map is `src/components/App.js`.
5. **State, contexts, and hooks**\
    Files: `src/mapContext.js`, `src/context/themeContext.js`, `src/context/DrawerContext.js`, `src/hooks/globalHooks/index.js`\
    What to see: the global hooks are `useEmbed`, `useFullscreen`, `useLocalStorage`, `useMobile`, and `useClipboard`.
6. **Map home and layouts**\
    Files: `src/components/Home.js`, `src/components/Layout.js`, `src/components/LayoutMobile.js`, `src/components/CustomWorldMap.js`\
    What to see: `Home.js` clears the map filters and goes to the URL bounds or the global view.\
    Note: `CustomWorldMap.js` is a `react-world-map` continent chart on the planter, organization, and wallet pages. It is not the tree map.
7. **Navigation and search**\
    Files: `src/components/Navbar.js`, `src/components/Link.js`, `src/components/SearchFilter.js`, `src/components/search/Search.js`\
    What to see: `Link.js` joins the MUI link and the Next.js link. Many components use it.\
    Note: no page reaches `src/components/search/`. `SearchFilter.js` shows only on `/search` and `/filter`.
8. **Detail UI components**\
    Files: `src/components/Timeline.js`, `src/components/common/CustomCard.js`, `src/components/Share.js`, `src/components/common/ErrorBoundary.js`\
    What to see: the layouts wrap each page in `PageErrorBoundary` and the map in its own `ErrorBoundary`.
9. **Theming and design sandbox**\
    Files: `src/pages/admin/theme.js`, `src/models/themePlaygroundOptions.js`, `src/DesignSandbox/DesignSandbox.js`\
    What to see: the playground edits the palette, typography, and fonts, and previews them live.
10. **Testing strategy**\
    Files: `src/models/test-utils.js`, `src/mocks/handlers.js`, `cypress/tests/integration/nockRoutes.js`, `cypress/tests/integration/readme.md`\
    What to see: 46 test files import `test-utils.js`. It mounts components with the app theme and a mock router.
11. **API documentation**\
    Files: `doc/web-map-api.yaml`, `doc/web-map-router.yaml`, `doc/examples/trees/186734.json`\
    What to see: the OpenAPI spec describes the backend that the API client calls. The examples also serve as test fixtures.
12. **Containers and Kubernetes**\
    Files: `Dockerfile`, `deployment/base/deployment.yaml`, `deployment/overlays/prod/kustomization.yaml`\
    What to see: the `Dockerfile` runs `npm run build` inside the image. `Dockerfile-dev` and `Dockerfile-test` first copy `.env.development` or `.env.test` over `.env.production`.
13. **CI/CD workflows**\
    Files: `.github/workflows/pull-request-ci.yml`, `.github/workflows/dev-build-release.yaml`, `.github/workflows/deploy.yaml`\
    What to see: pull requests run Cypress integration tests with nock, Cypress component tests, Jest, and ESLint.

## File Map (by layer)

**Pages and Routing**

- `src/pages/_app.js`: providers, layout choice, analytics. Its `getInitialProps` finds the device type and the config.
- `src/pages/_document.js`: HTML shell, runtime env script, fonts, emotion cache.
- `src/pages/index.js`: home page. It renders `Home` and sets `isBLayout` and `isFloatingDisabled`.
- `src/pages/top.js`: Tree Spotlight with featured trees, planters, organizations, wallets, and the country leaderboard.
- `src/pages/trees/[treeid].js`: tree detail (ISR).
- `src/pages/planters/[planterid].js`, `src/pages/organizations/[organizationid].js`, `src/pages/wallets/[walletid].js`: profile pages (ISR).
- `src/pages/tokens/[tokenid].js`: token detail with a timeline of transfers (`getServerSideProps`).
- `src/pages/v2/captures/[captureid].js`: version 2 capture detail (ISR).
- `src/pages/search.js`, `src/pages/filter.js`: keyword result list and the date filter page.
- `src/pages/admin/global.js`, `src/pages/admin/theme.js`, `src/pages/admin/index.js`: admin dashboard, theme playground, and an experimental Keycloak page.
- `src/pages/api/runtime-env.js`: the runtime env script route.
- `src/pages/404.js`, `src/pages/500.js`, `src/pages/_error.js`: error pages.

**UI Components**

- `src/components/App.js`: the tree map.
- `src/components/Layout.js`: desktop split view with the timeline and zoom buttons.
- `src/components/LayoutEmbed.js`: full-screen map with a collapsible page drawer.
- `src/components/LayoutMobile.js`, `src/components/Drawer.js`: mobile map with a bottom-sheet drawer.
- `src/components/LayoutMobileB.js`, `src/components/LayoutMobileC.js`: mobile layouts without a map.
- `src/components/LayoutDashboard.js`: admin wrapper.
- `src/components/Navbar.js`, `src/components/Link.js`: top bar and the shared link.
- `src/components/Timeline.js`, `src/components/ZoomInOutButton.js`: map date filter and zoom buttons.
- `src/components/Share.js`, `src/components/TreeInfoDialog.js`: share dialog and the full-screen tree dialog.
- `src/components/FeaturedTreesSlider/`, `src/components/FeaturedPlantersSlider/`, `src/components/LeaderBoard.js`: spotlight and profile widgets.
- `src/components/common/`: cards, tags, crumbs, the date filter form, the error boundary, and the page load error.
- `src/components/dashboard/`, `src/components/GlobalMapLayout.js`: admin editors for the logo, navbar, and map location.
- `src/components/playground/`: theme playground inputs.
- `src/DesignSandbox/`: theme reference sheet. No page reaches it. Only its test imports it.

**State and Hooks**

- `src/mapContext.js`: the map instance.
- `src/context/themeContext.js`: MUI theme and mode.
- `src/context/configContext.js`: navbar and map config, and `defaultConfig`.
- `src/context/dashboardContext.js`: admin config with a reducer and local storage.
- `src/context/playgroundContext.js`: playground theme and fonts.
- `src/context/DrawerContext.js`: drawer title data.
- `src/hooks/globalHooks/`: browser hooks. `useLocalStorage` prefixes keys with `greenstand-web-map-client-`.
- `src/hooks/contextHooks/`: thin readers for the theme and playground contexts.
- `src/hooks/usePageLoading.js`, `src/hooks/useDisclosure.js`, `src/hooks/cwmHooks/`: small state hooks.

**Models and API Client**

- `src/models/api.js`, `src/models/apiPaths.js`: API calls and URL builders.
- `src/models/pathResolver.js`: route after a click, URL after a map move, context from the path.
- `src/models/runtimeEnv.js`: allowlisted runtime env access.
- `src/models/utils.js`: `requestAPI`, `wrapper`, dates, names, fonts, base path, and number helpers.
- `src/models/config.reducer.js`: admin config actions.
- `src/models/oidcConfig.js`: OIDC settings from env.
- `src/models/makeStyles.js`: tss-react helpers bound to the theme.
- `src/models/themePlaygroundOptions.js`: playground options and validation rules.
- `src/models/MapModel.js`, `src/models/entity.js`, `src/models/mapConfig.js`, `src/models/tools.js`: no page reaches them.

**Testing**

- `src/**/*.cy.js`: Cypress component tests next to their components.
- `src/**/*.test.js`: Jest tests for models, the runtime env route, and the error boundary.
- `cypress/tests/integration/`: page tests with nock mocks from `nockRoutes.js`.
- `cypress/tests/e2e/`: e2e specs. `case1.cy.js` visits `http://dev.treetracker.org`.
- `cypress/fixtures/`: tile and API fixtures.
- `src/mocks/`, `public/mockServiceWorker.js`: MSW handlers and the generated worker.
- `cypress/plugins/index.js`, `cypress/support/`, `.jest/`: test setup.

**Infrastructure**

- `Dockerfile`, `Dockerfile-dev`, `Dockerfile-test`: `node:16-alpine`, `npm ci`, `npm run build`, `npm run start`.
- `deployment/`: the main-channel tree. Every deploy workflow can apply it. The prod overlay sets the host `map.treetracker.org`.
- `deployment-alpha/`, `deployment-next/`: `deploy.yaml` uses them for the `alpha` and `next` channels.
- `deployment-beta/`, `deployment-main/`: no workflow selects them.

**CI/CD**

- `.github/workflows/pull-request-ci.yml`: runs on pull requests to a base branch whose name has no `/`. Markdown-only changes skip it.
- `.github/workflows/dev-build-release.yaml`: runs on a push to a branch whose name has no `/`. The filter `'*'` does not match `/`. It stops unless `.releaserc.json` lists the branch. Then it runs semantic-release, builds two images, and deploys the dev image.
- `.github/workflows/deploy-main-channel-to-dev.yaml`, `deploy-main-channel-to-test.yaml`, `deploy-main-channel-to-prod.yaml`: manual deploys of `deployment/`. The prod workflow builds no image. It uses a published image.
- `.github/workflows/deploy.yaml`: manual deploy of a version to dev, test, or prod. A plain `X.Y.Z` version goes to `deployment/`. A prerelease version goes to `deployment-<channel>/`, with the channel from `.releaserc.json`.

**Documentation**

- `README.md`: setup, TDD rules, component and page rules, mocks.
- `CHANGELOG.md`: semantic-release output.
- `doc/web-map-api.yaml`, `doc/web-map-router.yaml`: API spec and page route spec.
- `doc/examples/`: example payloads for trees, planters, organizations, wallets, tokens, transactions, species, and countries.
- `cypress/tests/integration/readme.md`: how to write integration tests with nock.
- `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`: issue and PR templates.
- `public/robots.txt`: blocks `/admin/` for crawlers.

**Configuration**

- `package.json`: scripts and dependencies.
- `next.config.js`: images, rewrites, redirects, `basePath` from `NEXT_PUBLIC_BASE`, SVG loaders.
- `jsconfig.json`: `baseUrl` is `src`, so imports like `models/api` work.
- `.env.development`, `.env.production`, `.env.test`: `NEXT_PUBLIC_*` values per environment.
- `.releaserc.json`: release branches and prerelease channels.
- `.eslintignore`, `.prettierrc.json`, `.prettierignore`, `.lintstagedrc.js`, `scripts/codeshift.js`: lint and format. The codemod turns relative imports into alias imports.
- `.husky/`, `commitlint.config.js`: commit hooks and conventional commit rules.
- `cypress.config.js`, `jest.config.js`: test runners.
- `.vs/`: Visual Studio state files. They are not source.

## Complexity Hotspots

The graph rates 33 files as complex. Line counts come from the files.

- **Entity pages**\
  Files: `src/pages/tokens/[tokenid].js` (790 lines), `src/pages/v2/captures/[captureid].js` (782), `src/pages/trees/[treeid].js` (780), `src/pages/planters/[planterid].js` (589), `src/pages/organizations/[organizationid].js` (573), `src/pages/wallets/[walletid].js` (465), `src/pages/top.js` (341)\
  Why: each file holds its data loader, its map logic, and its full UI.
- **Admin pages**\
  Files: `src/pages/admin/theme.js` (528), `src/pages/admin/index.js` (338)\
  Why: both contain an inlined `jwt-decode` bundle. Both load a Keycloak authz script from a dev URL.
- **Theme**\
  File: `src/context/themeContext.js` (472)\
  Why: it builds the light and dark MUI themes, loads a server theme, and handles preview events.
- **Shared helpers**\
  File: `src/models/utils.js` (363)\
  Why: the graph lists 22 functions, the most of any file. `wrapper` and `requestAPI` sit under most page loaders.
- **App shell**\
  File: `src/pages/_app.js` (271)\
  Why: the providers, the layout choice, and the config fetch share one file.
- **Tree map**\
  File: `src/components/App.js` (280)\
  Why: it mounts the tree map, routes clicks, and syncs the URL. The Google Maps script URL and its key are hard-coded (`src/components/App.js:158`).
- **Layout and touch UI**\
  Files: `src/components/TreeInfoDialog.js` (380), `src/components/Drawer.js` (321), `src/components/LayoutEmbed.js` (310), `src/components/Timeline.js` (240)\
  Why: `Drawer.js` handles touch events by hand with a velocity snap. `TreeInfoDialog.js` and `Timeline.js` render different UI for mobile and desktop. `LayoutEmbed.js` has several blocks that `false &&` turns off.
- **Widgets and editors**\
  Files: `src/components/playground/TypographyInput.js` (290), `src/components/LeaderBoard.js` (277), `src/components/Share.js` (251), `src/components/GlobalMapLayout.js` (226), `src/components/FeaturedPlantersSlider/index.js` (224), `src/components/common/Filter.js` (219), `src/components/dashboard/CustomizeNavbar.js` (205)\
  Why: each file mixes UI with local logic. Examples: validation in `Filter.js` and `GlobalMapLayout.js`, drag and drop in `CustomizeNavbar.js`, scroll arrows in the slider, and font loading in `TypographyInput.js`.
- **Complex but unused**\
  Files: `src/models/MapModel.js` (261), `src/components/ShareDeprecated.js` (242)\
  Why: no page reaches them. Read them only if you plan to delete or revive them.
- **CI workflows**\
  Files: `.github/workflows/dev-build-release.yaml`, `.github/workflows/deploy-main-channel-to-dev.yaml`, `.github/workflows/deploy.yaml`\
  Why: release and environment logic lives in shell steps and inline Node scripts.
- **Large reference or generated files**\
  Files: `CHANGELOG.md` (4569), `doc/web-map-api.yaml` (1105), `README.md` (459), `public/mockServiceWorker.js` (338)\
  Why: `CHANGELOG.md` comes from semantic-release. The worker file says "Please do NOT modify this file". Do not edit these two by hand.

## Business Domains

`domain-graph.json` has 5 domains, 13 flows, and 79 steps. The bold names are the flow labels in the graph. The viewer's domain view shows each step. Here each flow has its entry and a short summary. A "Note" adds a code fact that the graph steps do not state.

**Map Exploration**: the tree map. `Layout.js`, `LayoutEmbed.js`, and `LayoutMobile.js` mount it.

- **Load Map** (entry: page load of `/` or any other public route)\
  `src/pages/_app.js` picks the layout. `src/components/App.js` mounts the tree map with the runtime tile settings, and each map move writes `?bounds=` into the URL.
- **Open Tree From Map** (entry: a click on a tree marker)\
  `App.js` posts the tree to the host windows and loads the full tree. `src/models/pathResolver.js` picks the next route, and `App.js` calls `router.push` only when the path or the `tree_id` changes.

**Entity Profiles**: detail pages for trees, planters, organizations, wallets, tokens, and version 2 captures.

- **View Tree Detail** (entry: `GET /trees/[treeid]`)\
  The page loads the tree, its planter, and its organization with ISR. On an error, `wrapper` gives a 404 or a `PageLoadError` panel with Retry. Else the page selects the tree on the tree map and shows the badges, Like, and Share.
- **View Grower or Organization Profile** (entry: `GET /planters/[planterid]`, `/organizations/[organizationid]`, or `/wallets/[walletid]`)\
  Planter and organization pages load their parts with `getOrgLinks` and mark a failed part with `SectionUnavailable`. The wallet page uses `Promise.all`, so one failure fails the whole page. Each page filters the tree map to its entity.
- **View Token or Capture** (entry: `GET /tokens/[tokenid]` and `GET /v2/captures/[captureid]`)\
  The token page uses `getServerSideProps`, so any error gives a 404. It shows the claim and transfer tags. The capture page loads the capture, planter, country, and stakeholder with ISR, and no page links to it.\
  Note: the stakeholder call uses `NEXT_PUBLIC_API_V2`. No env file, Dockerfile, or manifest in the repo sets it.

**Search and Discovery**: keyword search, date filters, and the Tree Spotlight.

- **Search by Keyword** (entry: `GET /search?keyword=<tree id>`, by URL only)\
  No layout shows the search bar. `src/pages/search.js` GETs `/trees/<keyword>` with no error handling and lists one link to the tree page.
- **Filter by Date Range** (entry: a date change in the map timeline on `/` or `/top`)\
  `Timeline.js` rejects a start date after the end date. It sets the timeline filter on the tree map only, not in the URL. The form in `SearchFilter.js` pushes `/filter?timeline=`, but `src/pages/filter.js` only prints the start date twice and a fixed "Found trees: 1,000,000".
- **Browse Tree Spotlight** (entry: `GET /top`)\
  `src/pages/top.js` loads the featured trees, planters, organizations, and wallets, and the country leaderboard, with ISR. A continent chip reloads the leaderboard, and a click on a country flies the tree map to it.\
  Note: `.env.production` sets `NEXT_PUBLIC_COUNTRY_LEADER_BOARD_DISABLED=true`, so the production build shows no leaderboard rows. The five prod overlays set the flag to `'false'`. That does not change the build: `top.js` reads a literal `process.env` value, and `src/models/runtimeEnv.js:9` says that Next inlines such values at build time.

**Sharing and Embedding**: share a page, and run the tree map inside another site or app.

- **Share Page** (entry: a click on the share icon of a tree, token, or capture page)\
  `src/components/Share.js` offers embed code, Facebook, Twitter, email, and a link to copy. The link and the iframe code use the current URL as it is, with no `embed=true`.
- **View Embedded Map** (entry: a public page with `?embed=true`, or a click on the full-screen icon)\
  On desktop, `_app.js` renders `LayoutEmbed.js` with a full-screen tree map and a page drawer. On mobile, the normal layouts stay and only the navbar hides. `App.js` posts each clicked tree to the host window.

**Authentication and Admin**: OIDC sign-in, which the UI hides, and the admin pages.

- **Sign In and Out** (entry: none in the public UI. `/admin` has its own Login button.)\
  `_app.js` wraps every page in `AuthProvider`, but `Navbar.js` comments out `LoginLogoutToggle`. `src/pages/admin/index.js` shows a Keycloak Login or Logout button, but `LayoutDashboard.js` comments out `SSRKeycloakProvider`.
- **Configure Global Map** (entry: `GET /admin/global`)\
  The page edits the navbar, the logo, and the map location for organization 178, which is hard-coded. It saves the edits in local storage. No public page reads them, and the location moves only the tree map inside `/admin/global`.
- **Edit Theme in Playground** (entry: `GET /admin/theme`)\
  An admin edits the palette, typography, and fonts, and previews them in an iframe of `/top`. The preview goes to local storage, so public pages in the same browser use it. A save needs the Keycloak RPT.\
  Note: `.env.development` and `.env.test` leave `NEXT_PUBLIC_CONFIG_API` empty, and `.env.production` does not set it. With these files, `load()` and the server theme load do not run.

Cross-domain links (7): map to profiles (tree clicks), profiles to map (filters and focus), search to map (timeline and country views), search to profiles (links), profiles to sharing (Share and Like), sharing to map (`LayoutEmbed.js` and `embed=true`), and admin to map (the playground preview, in the same browser only).

# Onboarding Guide: treetracker-tile-server

_Generated from the Understand-Anything knowledge graph. Source commit `b619c05`._

> This repo is the Greenstand fork of upstream node-mapnik. The Greenstand part is the tile server in `greenstand/`, plus `deployment/`, the `Dockerfile`, and `.github/`. The `src/` C++ code is upstream binding code. The analysis excluded the upstream test fixtures, `bench/`, `docs/`, the root `deps/`, all `examples/` directories, and the shapefiles.

## Project Overview

The tile server renders Treetracker tree data from PostGIS into 256x256 PNG tiles and UTF grid JSON tiles. It uses the native Mapnik binding to draw each tile.

- **Package**\
  Name and version: `treetracker-map-tile-server` 4.36.7\
  Package main: `./lib/mapnik.js`, the loader of the native Mapnik binding
- **Languages and frameworks**\
  Tile server: JavaScript, XML, YAML, Express, `pg`, `lru-cache`, Jest\
  Upstream part and delivery: C++, Python, shell, Makefile, Docker, kustomize, GitHub Actions
- **Entry point**\
  Command: `npm start` runs `node --max-old-space-size=1024 greenstand/server.js`.\
  Port: `.env` sets 23300. The manifests set 3000.

How the parts fit:

- `greenstand/server.js` loads `.env` and starts the Express service in `greenstand/app.js`.
- For each tile, `app.js` asks `Config.getXMLString` in `greenstand/config.js` for the Mapnik style.
- `config.js` gets the tile SQL from `greenstand/Map.js`. `Map.js` picks one SQL builder in `greenstand/sqls/`.
- `app.js` loads the Mapnik style into a new `mapnik.Map` and renders it with the native Mapnik binding.

## Architecture Layers

The graph has 657 nodes and 1265 edges. It puts each file into one of 10 layers. The counts are graph nodes.

- **Tile Server API** (7)\
  This layer holds the process entry, the Express service, and its routes.
- **Tile Style Service** (7)\
  This layer holds the style builder, the base styles, and the tile geometry helper.
- **Tree Query And Cache** (15)\
  This layer holds the query planner, the SQL builders, and the cached query pool.
- **Tile Server Tests And Fixtures** (20)\
  This layer holds the Jest suites, sample GeoJSON, and sample Mapnik styles.
- **Container And Kubernetes Deployment** (25)\
  This layer holds the `Dockerfile` and the kustomize base in `deployment/` with four overlays.
- **Release And Deploy Pipelines** (7)\
  This layer holds five GitHub Actions workflows, `.releaserc`, and the legacy upstream `.travis.yml`.
- **Project Config And Docs** (12)\
  This layer holds `package.json`, `.env`, the format and commit settings, and mostly upstream docs.
- **Upstream layers**\
  Mapnik JS Loader And CLIs (6): `lib/mapnik.js`, `lib/index.js`, `bin/`\
  Native Mapnik Binding (73): the C++ N-API wrappers in `src/`\
  Native Build And Dev Tooling (35): `Makefile`, `binding.gyp`, `common.gypi`, `scripts/`, `tools/`

## Key Concepts

- **Each request gets a new Mapnik style and a new map.**\
  `buildMapInstance` creates a new 256x256 `mapnik.Map` for each tile (`greenstand/app.js:47`).\
  The native Mapnik binding refuses a Map that another render uses (`src/mapnik_map_render.cpp:564`).
- **The zoom level picks the datasource.**\
  At zoom 1 to 15, `config.js` runs the SQL and puts the rows into the Mapnik style as inline GeoJSON (`greenstand/config.js:122`).\
  At zoom 0 and at zoom 16 and above, `config.js` puts the DB_URL credentials and the SQL into a PostGIS base style (`greenstand/config.js:276`).\
  In that case, Mapnik runs the SQL at render time.\
  A GeoJSON Mapnik style above 5 MB fails with "The data is too big" (`greenstand/config.js:266`).\
  The `icon` parameter picks the base style. `ptk-b` and `ptk-s` give the green icons in `greenstand/xml2.js`. `o` or no value gives the orange icons in `greenstand/xml.js`.
- **The map mode picks the SQL builder.**\
  `Map.init` checks `treeid` first (`greenstand/Map.js:32`). Then it checks `capture_id`, `userid`, `wallet`, `map_name`, and `timeline`, in that order.\
  When no value is set, `Map.init` uses the default map.\
  The `capture_id` branch never runs, because `Map.init` does not copy `capture_id` from its settings (`greenstand/Map.js:39`).\
  `config.js` does not pass `treeid` to `Map.init` (`greenstand/config.js:154`). So the single tree mode does not run from the tile routes.\
  Above zoom 15, every mode returns single tree points.\
  Planter and wallet maps count the trees first. More than 2000 trees give region clusters. 2000 or fewer give on-the-fly clusters.
- **Two zoom thresholds come from the environment.**\
  Above `MAXIMUM_ZOOM_LEVEL_USING_GLOBAL_DATASET`, the default map limits the SQL to the tile bounds (`greenstand/config.js:143`).\
  Up to zoom 15, organization maps always use the tile bounds. Planter and wallet maps never use them.\
  Up to `MAXIMUM_ZOOM_LEVEL_HANDLING_ZOOM_TARGET`, region clusters get a `zoom_to` centroid (`greenstand/sqls/SQLCase1WithZoomTarget.js:10`).\
  `server.js` stops at startup when one of the two is not defined (`greenstand/server.js:7`).\
  The values are 6 and 6 in `.env` and the base, 8 and 6 in test, and 15 and 6 in production and beta.
- **PGPool caches the finished Mapnik style.**\
  On a cache miss, PGPool runs the SQL once for all concurrent callers with the same SQL (`greenstand/PGPool.js:27`).\
  The cache stores the finished Mapnik style, not the rows. The cache key is the SQL text only (`greenstand/PGPool.js:46`).\
  `Config` passes `parseInt(CACHE_SIZE)` and `parseInt(CACHE_EXPIRE)` (`greenstand/config.js:104`). An unset variable gives `NaN`, and then the PGPool defaults do not apply.\
  The manifests set `CACHE_EXPIRE` to 60000. `.env` sets 60. lru-cache 6 reads the value in milliseconds.
- **The tile server depends on upstream files.**\
  `app.js` registers fonts from the upstream test fixtures in `test/data/map-a/` (`greenstand/app.js:26`). Do not delete that directory.\
  `app.js` serves a Leaflet viewer at `/viewer` from `greenstand/examples/viewer/` (`greenstand/app.js:40`). The analysis excluded that directory.
- **The image build installs devDependencies.**\
  `package.json` lists `pg` as a devDependency, but `app.js` requires it at runtime.\
  `make release_base` runs `npm install --ignore-scripts --clang` (`Makefile:17`). The command has no `--production` flag, so it installs the devDependencies too.\
  `--ignore-scripts` skips the `install` script of this package, so npm does not fetch a prebuilt binding. Then `make release_base` compiles the binding with `node-pre-gyp configure build` (`Makefile:28`).

## Guided Tour

Follow these 15 steps in order. Steps 1 to 8 cover the tile server. Steps 9 to 12 cover the native Mapnik binding. Steps 13 to 15 cover the delivery.

1. **Project overview**\
    Files: `README.md`, `package.json`\
    What to see: the README text is upstream node-mapnik documentation. In `package.json`, `main` loads the native Mapnik binding, and `start` runs the tile server.
2. **Server entry point**\
    Files: `greenstand/server.js`, `.env`\
    What to see: `server.js` checks the two zoom thresholds at startup.
3. **Express tile routes**\
    Files: `greenstand/app.js`\
    What to see: the Express service answers PNG and UTF grid routes, and it returns a version banner for other paths.
4. **Per-tile style builder**\
    Files: `greenstand/config.js`, `greenstand/sphericalmercator.js`, `greenstand/layers/postgis.xml`\
    What to see: `getXMLString` has a GeoJSON branch and a PostGIS branch.
5. **Map modes and base queries**\
    Files: `greenstand/Map.js`, `greenstand/sqls/SQLCase1.js` to `greenstand/sqls/SQLCase4.js`\
    What to see: case 1 counts trees per region, case 2 returns tree points, case 3 clusters with `ST_ClusterWithin`, and case 4 reads precomputed clusters.
6. **Specialized query variants**\
    Files: `greenstand/sqls/SQLCase1WithZoomTarget.js`, `greenstand/sqls/SQLZoomTargetCase1.js`, `greenstand/sqls/*Timeline.js`, `greenstand/sqls/SQLCase2Wallet.js`\
    What to see: these SQL builders extend the base SQL builders. The zoom target is the most populated subregion two zoom levels deeper.
7. **Cached query pool**\
    Files: `greenstand/PGPool.js`\
    What to see: PGPool has an LRU cache and merges concurrent identical queries.
8. **Base styles**\
    Files: `greenstand/xml.js`, `greenstand/xml2.js`\
    What to see: `config.js` replaces the `json_data` and `select * from trees` placeholders.
9. **Mapnik JavaScript loader**\
    Files: `lib/mapnik.js`, `lib/index.js`\
    What to see: `lib/mapnik.js` finds the compiled binding through `node-pre-gyp`.
10. **Native binding core**\
    Files: `src/node_mapnik.cpp`, `src/mapnik_map*.cpp`\
    What to see: these files implement `Map.fromString` and `Map.render`, which `app.js` calls.
11. **Images, PNG, UTF grids**\
    Files: `src/mapnik_image*.cpp`, `src/mapnik_grid.cpp`\
    What to see: these classes produce the two tile formats.
12. **Native build toolchain**\
    Files: `Makefile`, `binding.gyp`, `scripts/`\
    What to see: `make release_base` builds the binding against an installed `mapnik-config`.
13. **Container image**\
    Files: `Dockerfile`, `.dockerignore`\
    What to see: the base image `greenstand/tile-server-base:first` must supply Mapnik. The `Dockerfile` adds Node.js 14.21.3 and runs `make release_base`.
14. **Kubernetes deployment**\
    Files: `deployment/base/`\
    What to see: the Ambassador Mapping routes `/tiles/` to the Service. The SealedSecret supplies `DB_URL`.
15. **Release and deploy pipelines**\
    Files: `.github/workflows/build-deploy.yml`, `.releaserc`, `CHANGELOG.md`, `.github/workflows/deploy-test.yml`, `.github/workflows/deploy-prod.yml`\
    What to see: a push releases and deploys to development. Test and production need a manual run.

## File Map (by layer)

**Tile Server API**

- `greenstand/server.js`: loads `.env`, checks the zoom thresholds, and listens on `PORT`.
- `greenstand/app.js`: creates the pg pool (`PG_POOL_SIZE`, default 10), `Config`, fonts, CORS, the viewer, and the tile routes.

**Tile Style Service**

- `greenstand/config.js`: builds the Mapnik style in `Config.getXMLString`. Its `replace`, `config`, and `configFreetown` exports write copies of `postgis.xml` with the DB_URL credentials.
- `greenstand/xml.js`, `greenstand/xml2.js`: hold the orange and green base styles.
- `greenstand/sphericalmercator.js`: converts tiles to envelopes and makes the buffered SQL bounds.
- `greenstand/layers/postgis.xml`: holds a PostGIS base style.

**Tree Query And Cache**

- `greenstand/Map.js`: picks the SQL builder by map mode and zoom.
- `greenstand/PGPool.js`: caches the Mapnik style and merges queries.
- `greenstand/sqls/SQLCase1.js`, `greenstand/sqls/SQLCase1WithZoomTarget.js`: count region clusters from `active_tree_region`.
- `greenstand/sqls/SQLCase2.js`, `greenstand/sqls/SQLCase2Wallet.js`: select tree points.
- `greenstand/sqls/SQLCase3.js`: clusters trees on the fly with a radius by zoom.
- `greenstand/sqls/SQLCase4.js`: reads precomputed clusters at `zoom_level = 14`.
- `greenstand/sqls/*Timeline.js`: add a date range filter.
- `greenstand/sqls/SQLZoomTargetCase1V2.js`: `Map.js` imports it (`greenstand/Map.js:11`), but no code in `Map.js` uses it.
- `greenstand/sqls/SQLCase1V2.js`, `greenstand/sqls/SQLZoomTargetCase1.js`, `greenstand/sqls/SQLTree.js`: `Map.js` does not import them.

**Tile Server Tests And Fixtures**

- `greenstand/*.test.js`, `greenstand/PGPool.spec.js`: run with `npm run jest`. `greenstand/config.pg.test.js` and `greenstand/db.test.js` need a live PostGIS database.
- `npm test` runs the upstream tape suite in `test/`, not the tile server tests.

**Container And Kubernetes Deployment**

- `Dockerfile`: builds one stage on `greenstand/tile-server-base:first`, runs `make release_base`, and starts with `npm start`.
- `deployment/base/`: sets namespace `tile-server`, 1 replica, Service port 80 to 3000, and Mapping `/tiles/` with a 60000 ms timeout.
- `deployment/overlays/development/`: allows CORS from any origin.
- `deployment/overlays/test/`: runs 6 replicas and allows CORS from `https://test-k8s.treetracker.org`.
- `deployment/overlays/production/`: runs 2 replicas with a 768Mi request, a 1536Mi limit, no CPU limit, and no gateway timeout.
- `deployment/overlays/beta/`: uses namespace `tile-server-beta` and prefix `/tiles-next/`.

**Release And Deploy Pipelines**

- `.github/workflows/build-deploy.yml`: runs semantic-release, pushes the image, and deploys to development on a push to `master` or `next`.
- `.github/workflows/deploy-dev.yml`, `deploy-test.yml`, `deploy-prod.yml`, `deploy-dev-next.yml`: deploy a chosen git tag on a manual run.

**Project Config And Docs**

- `package.json`, `.env`: hold the scripts, the dependencies, and the local settings. `.env` is in git.
- `CHANGELOG.md`: lists the Greenstand releases 4.6.0 (line 773) to 4.36.7 above the upstream `# Changelog` heading (line 809).
- `README.md`, `CONTRIBUTING.md`, `LICENSE.txt`, `index.html`: hold upstream node-mapnik text. `.huskyrc` and `commitlint.config.js` check Conventional Commits.
- `map.json`: holds only the text `[object Object]`. No code reads it.

## Complexity Hotspots

The graph rates 26 files as complex. Two of them are tile server source files: `app.js` and `config.js`. The line counts come from the files.

- **Tile routes**\
  File: `greenstand/app.js` (222 lines)\
  Why: the `/new` routes repeat the root handlers and add `newIcons: true` (`greenstand/app.js:162`). `getXMLString` does not read `newIcons`. So the `/new` routes return the same tiles as the root routes.
- **Style builder**\
  File: `greenstand/config.js` (293 lines)\
  Why: one method holds the bounds rule, the base style choice, the GeoJSON build, and the PostGIS branch.\
  Cache: the cache key is the SQL text only. Two requests with the same SQL and a different `icon` get the same cached Mapnik style.\
  Timeline: at zoom 16 and above, `SQLCase2Timeline.js` returns a `{text, values}` object (`greenstand/sqls/SQLCase2Timeline.js:53`). `config.js` passes that object to `replace` (`greenstand/config.js:277`). The SQL in the Mapnik style then becomes `[object Object]`.
- **SQL builders**\
  Files: `greenstand/sqls/SQLCase3.js` (201), `greenstand/sqls/SQLCase2.js` (163), `greenstand/sqls/SQLCase1.js` (149), `greenstand/Map.js` (198)\
  Why: the SQL builders put the filter values into the SQL text directly. They use no bound parameters (for example `greenstand/Map.js:48` and `greenstand/Map.js:81`). Treat each query parameter as untrusted input.
- **Stale tests**\
  Files: `greenstand/sqls/SQLTree.test.js`, `greenstand/app.test.js`, `greenstand/config.test.js`, `greenstand/config.pg.test.js`, `greenstand/Map.test.js`, `greenstand/PGPool.spec.js`\
  SQLTree: `SQLTree.test.js:10` expects `left join token` and `left join entity`. The query has `LEFT JOIN wallet.token` and no entity join (`greenstand/sqls/SQLTree.js:27`). So the test fails.\
  App: `app.test.js` is empty (0 bytes). Jest fails a suite without tests.\
  Config: `config.test.js:4` and `config.pg.test.js:3` import `getXMLString`. `config.js` does not export it (`greenstand/config.js:288`).\
  Map: `Map.test.js:25` expects a `{text, values}` object. `Map.getQuery` returns the value of the SQL builder (`greenstand/Map.js:161`). All SQL builders that `Map.js` uses return a string, except `SQLCase2Timeline.js`.\
  PGPool: `PGPool.spec.js:17` builds PGPool without a `pool`.
- **Deploy workflows**\
  Files: `.github/workflows/deploy-dev.yml`, `.github/workflows/deploy-dev-next.yml`, `deployment/overlays/beta/`\
  Why: `deploy-dev.yml:38` saves the kubeconfig of `TEST_CLUSTER_NAME`, but it applies the development overlay. `build-deploy.yml:104` uses `DEV_CLUSTER_NAME` for the same overlay. `deploy-dev-next.yml:32` uses `deployment-next/`, which is not in the repo. No workflow applies the beta overlay.
- **Manifests**\
  Files: `deployment/base/deployment.yaml`, `deployment/overlays/production/deployment.yaml`\
  Why: the base Deployment declares `containerPort: 80` (`deployment/base/deployment.yaml:41`), but the tile server listens on 3000. The Service targets port 3000 by number, so traffic reaches the tile server. The production patch has a comment about a cap on glibc malloc arenas (line 31), but it sets no variable for that cap.
- **Native Mapnik binding** (upstream)\
  Files: 22 complex files in `src/`, for example `src/mapnik_map_render.cpp` (1335), `src/mapnik_map.cpp` (938), `src/mapnik_image.cpp` (735)\
  Why: this code is upstream C++. The tile server uses only the Map, Image, Grid, Projection, and Logger classes and the font and plugin helpers.
- **Large files**\
  Files: `CHANGELOG.md` (2288), `greenstand/trees.json` (51 MB, 547,448 tree points)\
  Why: semantic-release writes `CHANGELOG.md`, so do not edit it by hand. Only `greenstand/db.test.js` and `greenstand/stylesheet.xml` read `trees.json`.

## Business Domains

`domain-graph.json` has 4 domains, 17 flows, and 90 steps. The bold names are the flow labels in the graph. The domain view of the viewer shows each step.

**Map Tile Serving**: the Express routes that answer tile requests.

- **Start Tile Server** (entry: `npm start`)\
  `server.js` loads `.env` and `app.js`, checks the zoom thresholds, and listens on `PORT`.
- **Render PNG Map Tile** (entry: `GET /:z/:x/:y.png`, also `/new/:z/:x/:y.png`)\
  The route builds the map from the Mapnik style and renders a 256x256 PNG. An error gives HTTP 500 with a JSON message.
- **Render UTF Grid Tile** (entry: `GET /:z/:x/:y.grid.json`, also `/new/:z/:x/:y.grid.json`)\
  The route renders layer `l1` into a UTF grid with `id`, `latlon`, `count`, and `type`. At zoom 9 and below, it adds `zoom_to`.
- **Report Server Version** (entry: any other path, including `GET /`)\
  The catch-all route returns HTTP 200 and the `package.json` version.

**Tile Stylesheet Composition**: `Config.getXMLString` builds the Mapnik style.

- **Compose GeoJSON Cluster Style** (entry: `getXMLString` at zoom 1 to 15)\
  `config.js` runs the SQL through PGPool. It puts the rows as GeoJSON into the base style of the chosen icon set.
- **Compose PostGIS Tree Style** (entry: `getXMLString` at zoom 0 and at zoom 16 and above)\
  `config.js` puts the DB_URL credentials and the SQL into a PostGIS base style. Mapnik queries PostGIS at render time.
- **Cache And Coalesce Tile Queries** (entry: `PGPool.getQuery`)\
  Concurrent requests with the same SQL share one database query. PGPool caches the finished Mapnik style by SQL text.

**Tree Query Selection**: `Map.init` picks an SQL builder.

- **Select Default Map Query** (entry: a tile request without `userid`, `wallet`, `map_name`, or `timeline`)\
  Above zoom 15, the SQL returns tree points. From zoom 12 to 15, it reads precomputed clusters. Below zoom 12, it returns region clusters.
- **Select Planter Map Query** (entry: query parameter `userid`)\
  `Map.init` counts the trees of the planter. Then it picks tree points, region clusters, or on-the-fly clusters.
- **Select Wallet Map Query** (entry: query parameter `wallet`)\
  `Map.init` counts the tokens of the wallet. Then it picks wallet tree points, region clusters, or on-the-fly clusters.
- **Select Organization Map Query** (entry: query parameter `map_name`)\
  The SQL builders limit the trees to the organization hierarchy. From zoom 12 to 15, they cluster on the fly, except for `freetown` and `ffcphase1` (`greenstand/Map.js:113`).
- **Select Timeline Map Query** (entry: query parameter `timeline`)\
  A timeline SQL builder keeps the trees whose `time_created` falls in a `YYYY-MM-DD_YYYY-MM-DD` range.

**Release and Deployment**: the workflows, the image, and the manifests.

- **Release And Deploy To Development** (entry: a push to `master` or `next`)\
  `build-deploy.yml` runs semantic-release and pushes the image with the `package.json` version as the tag. Then it applies the development overlay.
- **Deploy Tag To Test** (entry: a manual run of `deploy-test.yml`)\
  The workflow applies the test overlay for a chosen git tag. It builds no image, so the image must already be in DockerHub.
- **Promote Tag To Production** (entry: a manual run of `deploy-prod.yml`)\
  The workflow applies the production overlay for a chosen git tag on the production cluster.
- **Redeploy Tag To Development** (entry: a manual run of `deploy-dev.yml`)\
  The workflow applies the development overlay again for a chosen git tag. Complexity Hotspots describes its cluster secret.
- **Route Gateway Tile Traffic** (entry: a request to `/tiles/{z}/{x}/{y}.png` or `.grid.json` on the gateway)\
  The Ambassador Mapping sends `/tiles/` to the Service. The Service forwards the request to the tile server on port 3000.

# Onboarding Guide: treetracker-field-data

_Generated from the Understand-Anything knowledge graph and domain graph. Source commit `8ffb53c`. Each claim was checked in the source._

> Pull request #119 (merged 2026-10-27, release 1.15.0) removed the RabbitMQ client, the domain event outbox, and the event replay. The service now uses no message broker. The `domain_event` tables stay in the schema, but no code reads or writes them. The `README.md` of the source repo still names RabbitMQ: that text is out of date.

## Project Overview

The field-data service stores the raw tree tracking data that the Treetracker app uploads (`README.md:3`). The data has five resources: the raw capture, the session, the track, the device configuration, and the wallet registration. Each new raw capture also goes into the legacy `trees` table.

- **Package**\
  Name: `treetracker` (`package.json:2`), version 1.15.0. The GitHub repo name is `treetracker-field-data`.\
  Entry point: `server/server.js` (`package.json:9`).
- **Languages and frameworks**\
  Languages: JavaScript, SQL, YAML, JSON, Markdown, Dockerfile, Shell\
  Server: Express 4, Joi, joi-to-swagger, Knex with `pg`, axios\
  Schema: db-migrate. Seed data: Knex seeds.\
  Tests and delivery: Mocha, Chai, supertest, sinon, Docker, Kustomize, GitHub Actions
- **External services**\
  PostgreSQL with PostGIS: the field-data tables and the legacy tables (`trees`, `tree_attributes`, `planter`).\
  The legacy admin API: the service calls it to reject a legacy tree (`server/services/LegacyAPIService.js:15`).
- **Quick start**\
  Prerequisites: Node.js 16 or higher and npm 7 or higher (`package.json:6`). `.npmrc` sets `engine-strict=true`.\
  Install: `npm install`.\
  Env file: `npm run server` sets `NODE_ENV=development` (`package.json:20`). `server/server.js:1` then loads `.env.development`. The README tells you to create `.env`, but the server does not read that file. The repo has no `.env.development.example`: create `.env.development` by hand. `.env.example` names `DATABASE_URL_MAINDB`, but the code reads `DATABASE_URL_LEGACYDB`.\
  Env names: the code reads `NODE_ENV`, `DATABASE_URL`, `DATABASE_URL_LEGACYDB`, `DATABASE_SCHEMA`, `NODE_PORT`, `NODE_LOG_LEVEL`, and `TREETRACKER_LEGACY_API_URL`. The Knex seeds also read `DATABASE_URL_SEEDER` (`knexfile.js:4`). `server/infra/database/knex.js:10` stops the process when a URL does not start with `postgresql:/`.\
  Schema: `npm run db-migrate-ci` runs `db-migrate up` in `database/` (`package.json:26`).\
  Run: `npm run server`. The API listens on port 3006 (`server/server.js:8`). Swagger UI is at `/docs` (`server/app.js:47`).\
  Tests: `npm test` runs the integration suite and the repository suite (`package.json:15`). Both read `.env.test`.
- **Graph size**\
  Files: 198. The graph leaves out 6 tracked files: `.eslintrc.json`, `.gitignore`, `LICENSE`, `package-lock.json`, and two `.vscode` files.\
  File-level nodes: 213 in 10 layers. The 50 SQL files give 63 table nodes. `Dockerfile` and `api.json` have two nodes each.\
  Complexity of the file-level nodes: 4 complex, 42 moderate, 167 simple\
  All nodes and edges: 360 and 766 (123 function nodes, 24 class nodes)\
  Tour: 15 steps\
  Domains: 6 domains, 21 flows, 91 steps

How the parts fit:

- Each request goes from a router to a handler, then to a service, a model, and a repository. Only repositories build SQL.
- The service has two Knex clients. The field-data client uses `DATABASE_URL`. The legacy client uses `DATABASE_URL_LEGACYDB` (`server/infra/database/knex.js:62`).
- The field-data client sets the search path to `DATABASE_SCHEMA`, which is `field_data` in the cluster (`deployment/base/deployment.yaml:38`).
- A raw capture upload writes a legacy tree through the legacy client. Then it writes the raw capture through the field-data client.
- A raw capture rejection calls the legacy admin API. Then it updates the raw capture.

The API has 16 routes (`server/routes/*.js`). Only `/raw-captures` is plural:

- `POST /raw-captures`, `GET /raw-captures`, `GET /raw-captures/:raw_capture_id`, `PATCH /raw-captures/:raw_capture_id/reject`
- `POST /session`, `GET /session`, `GET /session/:session_id`
- `POST /track`, `GET /track`, `GET /track/:track_id`
- `POST /device-configuration`, `GET /device-configuration`, `GET /device-configuration/:device_configuration_id`
- `POST /wallet-registration`, `GET /wallet-registration`, `GET /wallet-registration/:wallet_registration_id`

In the cluster, the Ambassador Mapping serves the API under the prefix `/field-data/` (`deployment/base/mapping.yaml:6`).

## Architecture Layers

The counts are files. The bold names are the layer labels in the graph.

- **Bootstrap & Configuration** (14)\
  This layer holds the process entry, the Express app, the config module, the npm manifest, the env templates, the Swagger logo, and the lint, commit, and release settings.\
  Key files: `server/server.js`, `server/app.js`, `config/config.js`, `package.json`
- **API Layer** (22)\
  This layer holds the five routers, a handler for each resource, the Joi schemas, and the Swagger docs.\
  Key files: `server/routes/index.js`, `server/handlers/rawCaptureHandler/index.js`, `server/handlers/rawCaptureHandler/schemas.js`, `server/handlers/swaggerDoc.js`
- **Service Layer** (6)\
  This layer holds one service for each resource and the HTTP client of the legacy admin API.\
  Key files: `server/services/RawCaptureService.js`, `server/services/LegacyAPIService.js`
- **Domain Models** (6)\
  This layer holds the models of the five resources and `LegacyTree`.\
  Key files: `server/models/RawCapture.js`, `server/models/SessionModel.js`, `server/models/LegacyTree.js`
- **Data Access** (13)\
  This layer holds the repositories, the two Knex clients, and the unit-of-work classes.\
  Key files: `server/repositories/BaseRepository.js`, `server/repositories/RawCaptureRepository.js`, `server/infra/database/knex.js`, `server/infra/database/Sessions/BaseSession.js`
- **Shared Utilities** (3)\
  This layer holds `HttpError`, the handler wrapper, the global error handler, and the paging helpers.\
  Key files: `server/utils/utils.js`, `server/utils/helper.js`, `server/utils/HttpError.js`
- **Database Schema & Data** (87 files, 100 nodes)\
  This layer holds 23 db-migrate migrations with 46 SQL files, the Knex seeds and their data, `knexfile.js`, `database/db_init.sql`, and the ETL scripts in `database/etl/`.\
  Key files: `database/migrations/sqls/20201225201548-createCaptures-up.sql`, `database/seeds/04_table_raw_capture.js`, `knexfile.js`
- **Tests** (11)\
  This layer holds the Mocha API specs, the test helpers, `server/app.spec.js`, `server/repositories/BaseRepository.spec.js`, and `seed.spec.js`.\
  Key files: `__tests__/raw-capture-api.spec.js`, `__tests__/legacy-table-creation.js`, `__tests__/insert-test-capture.js`
- **Infrastructure & CI/CD** (30)\
  This layer holds the `Dockerfile`, `.dockerignore`, the Kustomize base and the development, test, and production overlays, 5 GitHub Actions workflows, and 2 shell scripts.\
  Key files: `Dockerfile`, `deployment/base/deployment.yaml`, `deployment/base/database-migration-job.yaml`, `.github/workflows/treetracker-api-build-deploy-dev.yml`
- **Documentation & API Specs** (6)\
  This layer holds the README, the CHANGELOG, one ADR, and three OpenAPI files.\
  Key files: `README.md`, `docs/api/spec/treetracker-field-data.yaml`, `docs/adr/0001-organization-by-session-bridge.md`

## Key Concepts

- **A raw capture upload writes to two databases.**\
  `RawCaptureService.createRawCapture` first reads the session. If the session does not exist, it returns 409 (`server/services/RawCaptureService.js:33` to line 41). Then it starts a transaction on the legacy client (line 43). It writes the legacy tree. Then it starts a transaction on the field-data client (line 56) and inserts the raw capture.\
  The service commits the field-data transaction first and the legacy transaction second (lines 63 and 64). These are two separate transactions, not one distributed transaction.\
  The raw capture keeps the legacy tree id in `reference_id` (line 60).
- **The upload order matters.**\
  A session needs an existing device configuration and an existing wallet registration (foreign keys, `database/migrations/sqls/20220125153204-session-up.sql:4` and line 5).\
  A raw capture needs an existing session. If the session is missing, the service returns 409 (`server/services/RawCaptureService.js:36`).\
  A raw capture also needs a legacy planter whose `phone` or `email` equals the wallet of the session. If no planter matches, the upload fails with 422 (`server/models/LegacyTree.js:34`).
- **Create is idempotent on the id.**\
  A raw capture, a session, a device configuration, and a wallet registration each return 201 for a new id. They return 200 and the stored row for a known id (for example `server/models/RawCapture.js:88`).\
  A track is different. `POST /track` always inserts and returns 201 (`server/handlers/tracksHandler/index.js:21`).
- **A unit of work holds the transaction.**\
  `BaseSession` holds one Knex client and at most one open transaction (`server/infra/database/Sessions/BaseSession.js:2` to line 21). `Session` binds it to the field-data client. `LegacySession` binds it to the legacy client.\
  Each service creates its own unit of work. All repositories of that unit of work share the transaction.
- **Handlers validate. The error handler maps errors.**\
  Each handler validates with a Joi schema. A Joi object rejects unknown keys by default.\
  `handlerWrapper` sends a rejected promise to `next` (`server/utils/utils.js:24`). `errorHandler` maps `HttpError` to its code, a Joi `ValidationError` to 422, and an axios error to 500 (lines 35 to 62).
- **Write requests must send exactly `application/json`.**\
  `server/app.js:33` compares the `content-type` header of each POST, PATCH, and PUT with the text `application/json`. Any other value gets 415. A value with a charset suffix also gets 415.
- **Lists have the same shape.**\
  `getFilterAndLimitOptions` sets `limit` 100 and `offset` 0 when the query has none (`server/utils/helper.js:36`). Each list response has the rows, `links` with `prev` and `next`, and `query` with the `count`.\
  The raw capture list is newest first (`server/repositories/RawCaptureRepository.js:51`). It joins the session, the wallet registration, and the device configuration.
- **A rejection goes to the legacy admin API first.**\
  `PATCH /raw-captures/:raw_capture_id/reject` needs `rejection_reason` and an `Authorization` header (`server/handlers/rawCaptureHandler/index.js:73`). The service sends the header to the legacy admin API with `approved: false` and `active: false` (`server/services/LegacyAPIService.js:19`).\
  Then the model sets the raw capture status to `rejected` (`server/models/RawCapture.js:109`). A later failure does not undo the legacy change.
- **Some schema parts have no code.**\
  The `domain_event` tables, the `session_segment` table, `session.processed_at`, and the `raw_capture.root` and `root_check_processed_at` columns exist only in migrations. No file in `server/` uses them.

## Guided Tour

The tour has 15 steps. The bold names are the tour titles in the graph.

1. **Process Entry Point**\
   Files: `server/server.js`, `package.json`, `server/setup.js`\
   What to see: the server loads `.env.<NODE_ENV>` and listens on `NODE_PORT` or 3006. On SIGINT, it destroys both Knex clients (`server/server.js:16`).
2. **Express App Assembly**\
   Files: `server/app.js`, `config/config.js`\
   What to see: CORS is on only in development (line 18). The 415 check comes before the routers. The error handler comes after them (line 58). A catch-all GET handler comes last (line 62).
3. **Routers and Error Plumbing**\
   Files: `server/routes/index.js`, `server/routes/rawCaptureRoutes.js`, `server/utils/utils.js`, `server/utils/HttpError.js`\
   What to see: `server/routes/index.js` exports the five routers as an array. Each route wraps its handler in `handlerWrapper`.
4. **Handlers and Joi Validation**\
   Files: `server/handlers/rawCaptureHandler/index.js`, `server/handlers/rawCaptureHandler/schemas.js`, `server/handlers/sessionHandler/index.js`, `server/utils/helper.js`\
   What to see: `rawCapturePost` deletes `extra_attributes` from the body. It sets each `rotation_matrix` value below 0.001 to 0 (lines 45 to 53). Then it validates.
5. **API Documentation Contract**\
   Files: `server/handlers/swaggerDoc.js`, `server/handlers/rawCaptureHandler/docs.js`, `docs/api/spec/treetracker-field-data.yaml`\
   What to see: each `docs.js` converts its Joi schemas with joi-to-swagger. `swaggerDoc.js` merges them for `/docs`.\
   Note: `rawCaptureHandler/docs.js:77` documents `/raw-capture/{raw_capture_id}` (singular). The router uses `/raw-captures`. The YAML spec uses the correct plural path (line 142).
6. **Service Layer**\
   Files: `server/services/RawCaptureService.js`, `server/services/SessionService.js`, `server/services/WalletRegistrationService.js`, `server/services/LegacyAPIService.js`\
   What to see: each create method begins a transaction, calls the model, and commits. On an error it rolls back and throws again.
7. **Database Sessions and Knex**\
   Files: `server/infra/database/Sessions/BaseSession.js`, `server/infra/database/Sessions/Session.js`, `server/infra/database/Sessions/LegacySession.js`, `server/infra/database/knex.js`\
   What to see: `beginTransaction` throws when a transaction is already open (`BaseSession.js:19`). Only the field-data client gets the `DATABASE_SCHEMA` search path (`knex.js:54`).
8. **Domain Models**\
   Files: `server/models/RawCapture.js`, `server/models/SessionModel.js`, `server/models/WalletRegistration.js`, `server/models/DeviceConfiguration.js`, `server/models/Track.js`\
   What to see: each model returns frozen objects with `Object.freeze`. A new raw capture gets the status `unprocessed` (`RawCapture.js:94`).
9. **The Legacy Database Bridge**\
   Files: `server/models/LegacyTree.js`, `server/repositories/Legacy/TreeRepository.js`, `server/repositories/Legacy/PlanterRepository.js`, `docs/adr/0001-organization-by-session-bridge.md`\
   What to see: the legacy tree uses the lowercased raw capture id as its `uuid` (`LegacyTree.js:41`). If a legacy tree with the same `uuid` exists, the model returns that tree and writes no new one (line 63). `TreeRepository` sets the location with `ST_PointFromText` and SRID 4326 (line 28).\
   Note: the ADR records a manual step. An operator fills `session.organization_id`. Then the operator sets the organization of the matching legacy trees.
10. **Repositories**\
   Files: `server/repositories/BaseRepository.js`, `server/repositories/RawCaptureRepository.js`, `server/repositories/SessionRepository.js`\
   What to see: `BaseRepository.getByFilter` accepts nested `and` and `or` filters (lines 30 to 81). `getById` throws 404 when no row matches (line 19).
11. **Field Data Schema**\
   Files: `database/migrations/sqls/20201225201548-createCaptures-up.sql`, `database/migrations/sqls/20220125153204-session-up.sql`, `database/migrations/sqls/20220124224437-device-configuration-up.sql`, `database/migrations/sqls/20220120081019-wallet-registration-up.sql`, `database/migrations/sqls/20230906143147-create-track-table-up.sql`\
   What to see: a raw capture gets `session_id` from `20220126225534-bulk-pack-capture-updates-up.sql:6`. A track references a session and stores `locations_url`.
12. **Migrations and Local Setup**\
   Files: `README.md`, `database/migrations/20250527074027-add-root-capture-columns.js`, `database/migrations/sqls/20240722001220-add-session-segment-table-up.sql`, `database/database.json.example`, `database/db_init.sql`\
   What to see: each migration JavaScript file reads its `-up.sql` or `-down.sql` file and runs it with `db.runSql`. The newest migration adds `raw_capture.root` and `root_check_processed_at`.
13. **Integration Tests**\
   Files: `__tests__/raw-capture-api.spec.js`, `__tests__/clear-db.js`, `__tests__/insert-test-capture.js`, `__tests__/legacy-table-creation.js`\
   What to see: Mocha loads every file in `__tests__`. So the root `before` hook of `legacy-table-creation.js` creates `trees`, `tree_attributes`, and `planter` before the specs run. The reject test stubs `rejectLegacyTree` with sinon (`raw-capture-api.spec.js:122`).
14. **Container and Kubernetes Deployment**\
   Files: `Dockerfile`, `deployment/base/kustomization.yaml`, `deployment/base/deployment.yaml`, `deployment/base/database-migration-job.yaml`\
   What to see: the image uses `node:16-alpine` and runs `node .`. The Deployment runs 2 replicas on port 3006. The migration Job runs `db-migrate up` as an Argo CD PostSync hook.\
   Note: the overlays set the image tag and the database secrets. The development and test overlays also patch the Mapping with CORS settings. The production overlay does not.
15. **CI/CD Pipelines**\
   Files: `.github/workflows/pull-request-ci.yml`, `.github/workflows/treetracker-api-build-deploy-dev.yml`, `.github/workflows/treetracker-api-deploy-prod.yml`\
   What to see: a pull request to `main` runs lint, the migrations, and `npm test` against a `postgis/postgis` service. A push to `main` also runs semantic-release, pushes the image, and sets the tag in the development overlay. The release job does not run when the commit message has `skip-ci`. The workflow commits the overlay change only when the commit message has no `chore`.\
   Note: three manual workflows set a chosen tag in the development, test, or production overlay.

## File Map (by layer)

**Bootstrap & Configuration**

- `server/server.js`: this file loads the env file, sets the log level through `server/setup.js`, and starts the app.
- `server/app.js`: this file builds the Express app. It calls `Sentry.init` with `config.sentry_dsn` (line 16).
- `config/config.js`: this file maps `DATABASE_URL` and `DATABASE_URL_LEGACYDB` to the two connection strings.
- `.env.example`, `.env.test.example`: these files are the env templates. `.env.example` names the legacy variable `DATABASE_URL_MAINDB` (line 3). The code reads `DATABASE_URL_LEGACYDB`. `.env.test.example` has no legacy variable.
- `.releaserc`, `.huskyrc`, `commitlint.config.js`: semantic-release runs on `main`. The commit hook checks Conventional Commits. The pre-commit hook runs ESLint.

**API Layer**

- `server/routes/*Routes.js`: each file binds the routes of one resource.
- `server/handlers/<resource>Handler/index.js`: each handler validates, calls its service, and builds the response.
- `server/handlers/<resource>Handler/schemas.js`: each file holds the Joi schemas of one resource.
- `server/handlers/walletRegistrationHandler/index.js`: this handler returns 422 when the body has no `phone` and no `email` (line 19).
- `server/handlers/swaggerDoc.js`: this file merges the five `docs.js` files into one OpenAPI 3.0 document.

**Service Layer**

- `server/services/RawCaptureService.js`: this service creates, lists, reads, and rejects raw captures.
- `server/services/LegacyAPIService.js`: this file sends the PATCH to `/api/trees/<id>` of the legacy admin API. With `organization_id`, the path is `/api/organization/<id>/trees/<id>`.
- `server/services/SessionService.js`: this service puts the table name before each filter key. `grower_account_id` and `wallet` go to `wallet_registration` (line 8).
- `server/services/TrackService.js`, `server/services/DeviceConfigurationService.js`, `server/services/WalletRegistrationService.js`: these services wrap each create in a transaction.

**Domain Models**

- `server/models/RawCapture.js`, `server/models/SessionModel.js`, `server/models/DeviceConfiguration.js`, `server/models/WalletRegistration.js`: these models do the idempotent create and shape the rows.
- `server/models/Track.js`: this model creates a track with no check for an existing id.
- `server/models/LegacyTree.js`: this model finds the legacy planter and writes the legacy tree. It also writes `tree_attributes` rows when it gets attributes. The upload handler deletes `extra_attributes`, so API uploads write no attributes.

**Data Access**

- `server/infra/database/knex.js`: this file makes the two Knex clients. Each pool has at most 10 connections.
- `server/infra/database/Sessions/*.js`: these files are the unit-of-work classes.
- `server/repositories/BaseRepository.js`: this class gives `getById`, `getByFilter`, `countByFilter`, `update`, and `create` for one table.
- `server/repositories/RawCaptureRepository.js`, `server/repositories/SessionRepository.js`: these repositories add the joins for the device and wallet fields.
- `server/repositories/Legacy/*.js`: these repositories read `planter` and write `trees` and `tree_attributes`.

**Shared Utilities**

- `server/utils/utils.js`: this file holds `handlerWrapper` and `errorHandler`.
- `server/utils/helper.js`: this file holds the paging defaults and the `prev` and `next` links.
- `server/utils/HttpError.js`: this class carries an HTTP code and a message.

**Database Schema & Data**

- `database/migrations/*.js`, `database/migrations/sqls/*.sql`: these are the 23 migrations and their 46 SQL files.
- `database/seeds/00_job_database_cleaner.js` to `database/seeds/04_table_raw_capture.js`: seed `00` deletes the rows of `raw_capture`, `session`, `wallet_registration`, and `device_configuration`, and the legacy planters and trees of the seeded growers. Seeds `01` to `04` insert 100 device configurations, 100 wallet registrations, 100 sessions, and one raw capture with one legacy tree for each record of `capture_match_raw_captures.js`. That file has 13,537 records.
- `knexfile.js`: this file configures the seeds for `development` and `usertest`. It reads `DATABASE_URL_SEEDER`.
- `database/etl/*`: these files are one-off scripts. `create-legacy-session-ids.js` fills `trees.session_id`. The two `create-wallet-registration-from-legacy*.sql` files fill `field_data.wallet_registration` from legacy data. `make-legacy-session-id.js` only prints one sample session id.
- `database/db_init.sql`: this file creates the `field_db` database for local use.

**Tests**

- `__tests__/*-api.spec.js`: these five specs test each resource over HTTP with supertest.
- `__tests__/clear-db.js`, `__tests__/insert-test-capture.js`, `__tests__/legacy-table-creation.js`: these helpers clear the tables, insert the test chain, and create the legacy tables.
- `server/repositories/BaseRepository.spec.js`: this spec tests `BaseRepository` with `mock-knex`. `npm run test-repository` runs it.
- `server/app.spec.js`: this spec checks the 200 on `GET /` and the 415 on `POST /`. `npm test` does not run it. Only the `test-watch` scripts load it.

**Infrastructure & CI/CD**

- `Dockerfile`: this file installs with `npm ci` and starts the server with `node .`.
- `deployment/base/*.yaml`: these manifests hold the Deployment, the Service, the Mapping, the Namespace, the sealed database secrets, the RBAC, and the migration Job.
- `deployment/overlays/development`, `deployment/overlays/test`, `deployment/overlays/production`: each overlay sets one image tag. At `8ffb53c`, development and production use 1.15.0, and test uses 1.13.3.
- `.github/workflows/*.yml`: these are the pull request check, the push pipeline of `main`, and the three manual deploy workflows.
- `scripts/setup-dev-database-passwords.sh`, `scripts/vars.sh`: these scripts fill the local env files and `database/database.json` from the templates.

**Documentation & API Specs**

- `README.md`: this file gives the quick start and the layer rules. Some parts are stale (see Complexity Hotspots).
- `docs/api/spec/treetracker-field-data.yaml`: this OpenAPI file lists all 16 routes with the correct paths.
- `docs/api/spec/api.json`: this OpenAPI file has no track routes. Some paths use Express syntax, for example `/session/:session_id`.
- `api.json`: this OpenAPI file describes only an old `/captures` path. No route defines `/captures`.
- `CHANGELOG.md`: semantic-release writes this file. Release 1.15.0 added the root check columns.

## Complexity Hotspots

The graph rates 4 file-level nodes as complex. Three more groups need care. Two have complex logic. One holds stale docs and broken scripts.

- **Generated and large documents**\
  Files: `CHANGELOG.md` (806 lines), `docs/api/spec/api.json` (1184), `docs/api/spec/treetracker-field-data.yaml` (1925)\
  Why: the graph rates these files complex. They are long, but they hold no runtime logic. Use the YAML spec as the API reference.
- **Unused seed data**\
  Files: `database/seeds/data/duplicate_raw_captures.js` (12,665 lines)\
  Why: the graph rates this file complex. No file requires it.
- **Raw capture write path**\
  Files: `server/services/RawCaptureService.js` (117), `server/models/RawCapture.js` (121), `server/models/LegacyTree.js` (76), `server/repositories/Legacy/TreeRepository.js` (49)\
  Why: one request spans two clients, two transactions, and a commit order. If the legacy commit fails after the field-data commit, the raw capture stays and its legacy tree does not. Test both databases.
- **Generic repository and paging**\
  Files: `server/repositories/BaseRepository.js` (125), `server/utils/helper.js` (49)\
  Why: the recursive `and` and `or` builder and the `prev` and `next` math serve every list route.
- **Stale docs and broken scripts**\
  `README.md:39` still names RabbitMQ. `README.md:142` runs `npm run test-seedDB`, and `package.json` has no such script.\
  `npm run server-test` starts `server/serverTest.js` (`package.json:19`). That file does not exist.\
  `npm run test-unit` searches `server/models/**/*.spec.js` (`package.json:17`). No file matches.\
  `scripts/setup-dev-database-passwords.sh:18` copies `.env.development.example`. That file does not exist.\
  `seed.spec.js` requires `./seed` and `../server/database/database`. Neither file exists, and no script runs the spec. `database/seed.sql` is empty.\
  `database/seeds/01_table_device_configuration.js` and `02_table_wallet_registration.js` require `chance`. `package.json` does not list it.\
  `database/etl/create-legacy-session-ids.js:20` loops on a constant (`j` is always 0). The script does not stop by itself.

## Business Domains

`domain-graph.json` has 6 domains, 21 flows, and 91 steps. The bold names are the flow labels in the graph.

**Raw Capture Ingestion**: this domain receives, lists, reads, and rejects raw captures.

- **Upload Raw Capture** (entry: `POST /raw-captures`)\
  The handler cleans and validates the body. The service checks the session, writes the legacy tree, and inserts the raw capture with `reference_id`. The response is 201 or 200.
- **Reject Raw Capture** (entry: `PATCH /raw-captures/:raw_capture_id/reject`)\
  The service patches the legacy tree through the legacy admin API. Then it sets the raw capture to `rejected` with the `rejection_reason`.
- **List Raw Captures** (entry: `GET /raw-captures`)\
  The query accepts `status`, `bulk_pack_file_name`, `limit`, and `offset`. The response has the rows, the links, and the count.
- **Get Raw Capture by Id** (entry: `GET /raw-captures/:raw_capture_id`)\
  The handler returns one raw capture or 404.

**Session & Track Tracking**: this domain stores sessions and the track files of a session.

- **Create Session** (entry: `POST /session`)\
  The model inserts a new session or returns the stored one. If the request has `bulk_pack_version`, it must be `v1` or `v2`.
- **List Sessions** (entry: `GET /session`)\
  The repository joins the device configuration and the wallet registration. The count uses the same joins.
- **Get Session by Id** (entry: `GET /session/:session_id`)\
  The handler returns one session or 404.
- **Record Track** (entry: `POST /track`)\
  The body needs `locations_url`, `session_id`, and `bulk_pack_file_name`. The response is always 201.
- **List Tracks** (entry: `GET /track`)\
  The query accepts `session_id`, `bulk_pack_file_name`, `limit`, and `offset`.
- **Get Track by Id** (entry: `GET /track/:track_id`)\
  `BaseRepository.getById` throws 404 for an unknown id. So the 404 check of the handler does not run for that case.

**Device Configuration**: this domain stores the phone and app build of a session.

- **Register Device Configuration** (entry: `POST /device-configuration`)\
  The body needs the device fields, the app fields, and an ISO `logged_at`. The response is 201 or 200.
- **List Device Configurations** (entry: `GET /device-configuration`)\
  The query accepts only `bulk_pack_file_name`, `limit`, and `offset`.
- **Get Device Configuration by Id** (entry: `GET /device-configuration/:device_configuration_id`)\
  The handler returns one device configuration or 404.

**Wallet Registration**: this domain stores the grower wallet registrations.

- **Register Wallet** (entry: `POST /wallet-registration`)\
  The body needs `phone` or `email`. The response is 201 or 200.
- **List Wallet Registrations** (entry: `GET /wallet-registration`)\
  The query accepts only `bulk_pack_file_name`, `limit`, and `offset`.
- **Get Wallet Registration by Id** (entry: `GET /wallet-registration/:wallet_registration_id`)\
  The handler returns one wallet registration or 404.

**Legacy Database Bridging**: this domain keeps the legacy tables in step with the field data.

- **Mirror Capture to Legacy Trees** (entry: `RawCaptureService.createRawCapture` during `POST /raw-captures`)\
  The model finds the legacy planter by wallet, builds the legacy tree, and inserts it with a PostGIS point.
- **Backfill Legacy Session Ids** (entry: `node database/etl/create-legacy-session-ids.js`)\
  The script sets `trees.session_id` to a UUID made from the device identifier and the planter identifier.
- **Backfill Wallet Registrations from Legacy** (entry: `database/etl/create-wallet-registration-from-legacy-2.sql`, run by an operator)\
  The SQL inserts at most one wallet registration for each wallet from `planter_registrations`.

**Schema Migrations & Seed Data**: this domain defines the schema and fills development databases.

- **Apply Schema Migrations** (entry: `npm run db-migrate-ci`, or the migration Job on each Argo CD sync)\
  db-migrate runs the pending migrations. Each migration runs one SQL file.
- **Seed Development Data** (entry: `npm run seed-dev` or `npm run seed-usertest`)\
  Seed `00` deletes the seed data of earlier runs. Seeds `01` to `04` insert the seed data, the legacy planters, and the legacy trees.

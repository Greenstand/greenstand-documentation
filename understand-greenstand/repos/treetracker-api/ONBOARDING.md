# Onboarding Guide: treetracker-api (TreeTracker API)

_Generated from the Understand-Anything knowledge graph. Source commit `85258c8`._

## Project Overview

The **TreeTracker API** is a Greenstand Node.js/Express microservice. It exposes a REST API
over PostgreSQL (via Knex), validates requests with Joi and express-validator, serves Swagger
docs, and exchanges domain events over RabbitMQ (rascal/amqplib). It stores grower and capture
images in AWS S3.

- **Languages:** JavaScript, SQL, JSON, YAML, Dockerfile, shell, Markdown
- **Frameworks:** Express, Knex, Joi, Mocha, Docker, GitHub Actions
- **Entry points:** `server/server.js` (runtime boot) and `server/app.js` (Express factory)

The code follows a layered, MVC-like flow: **router → handler → service → model → repository →
database**, with messaging and object storage as side integrations.

## Architecture Layers

- **API Layer**\
  Files: 22\
  What it holds: Express routers and handlers for captures, trees, tags, grower accounts; Joi request schemas; Swagger/OpenAPI doc generation.
- **Service Layer**\
  Files: 11\
  What it holds: Business logic and orchestration (capture, tree, tag, grower account, S3, queue, legacy API, domain events). Coordinates repositories and external systems.
- **Domain Models & Data Access**\
  Files: 18\
  What it holds: Domain model constructors and Knex repositories (including `BaseRepository`) that read/write PostgreSQL entities.
- **Platform Integration**\
  Files: 5\
  What it holds: Adapters to external systems: Postgres session/Knex, RabbitMQ client + config, AWS S3 client.
- **Application Core & Utilities**\
  Files: 8\
  What it holds: Express app assembly, server bootstrap, setup, `knexfile.js`, shared utilities (`HttpError`, enums, helpers).
- **Database Schema & Data**\
  Files: 168\
  What it holds: Knex/db-migrate SQL and JS migrations, seed data + seed CLI, ETL, and generated table schema nodes.
- **Testing**\
  Files: 22\
  What it holds: Mocha integration specs, mocks, and inline unit specs.
- **Infrastructure & CI/CD**\
  Files: 43\
  What it holds: Dockerfile, Kustomize overlays (base/dev/prod/test) for Kubernetes, GitHub Actions workflows.
- **Project Config & Documentation**\
  Files: 19\
  What it holds: Repo config (package.json, lint/prettier/husky/release, CODEOWNERS), docs (README, CHANGELOG, ADRs, API spec), assets, scripts.

## Key Concepts

- **Single database session per request.** Services run over one `Session` (`server/infra/database/Session.js`)
  that owns the transaction lifecycle (begin/commit/rollback). Handlers stay free of transaction concerns.
- **`HttpError` drives rollback.** The custom error type carries a status code and a `rollback` flag.
  The global error middleware (`server/utils/utils.js`) uses it to unwind the transaction and map errors to HTTP responses.
- **Repository inheritance.** Every repository extends `BaseRepository` (`server/repositories/BaseRepository.js`),
  which supplies `getById`, filtered queries, counting, create, and update primitives over Knex.
- **Event backbone.** Domain events (`capture-created`, `tree-created`, ...) are published and consumed
  through RabbitMQ. `QueueService` owns publish/subscribe; `RabbitMQ.js` wraps the rascal Broker;
  `EventHandlerService` dispatches messages; `DomainEvent.js` persists the records.
- **Geospatial matching.** Captures are matched to trees using PostGIS spatial queries (`st_dwithin`,
  GiST geography indexes). Test helpers convert POINT strings into PostGIS geometry.
- **Docs stay near the routes.** Each handler ships a `docs.js` (Swagger paths) and `schemas.js` (Joi),
  assembled by `swaggerDoc.js` into the single served OpenAPI spec.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Project Overview**: Read the `README` for purpose, architecture, and setup/migration/seeding workflows.
2. **Bootstrap and Express Wiring**: `server/server.js` boots; `server/app.js` wires middleware, Swagger UI, the router, error handler, and event handlers.
3. **Routing and API Surface**: `routes/index.js` aggregates feature routers; `treeRoutes.js` is a representative router; `swaggerDoc.js` assembles the OpenAPI spec.
4. **Request Handlers and Validation**: `treeHandler/index.js` handles tree CRUD/matching/tags; `schemas.js` (Joi) guards inputs; `docs.js` supplies Swagger paths.
5. **The Service Layer**: `TreeService.js` orchestrates over one session; `HttpError.js` carries status + rollback flag.
6. **Domain Models and Repositories**: `models/tree.js` holds domain logic; `TreeRepository.js` extends `BaseRepository.js`.
7. **Database Connection and Transactions**: `knex.js` configures the shared connection; `Session.js` manages the transaction lifecycle.
8. **Database Schema and Seed Data**: SQL migrations create the `tree` table (capture ref, GPS, species, status, geo indexes); seed fixtures make a fresh DB usable.
9. **Asynchronous Messaging**: `QueueService.js`, `RabbitMQ.js`, `EventHandlerService.js`, `DomainEvent.js` implement publish/subscribe over rascal.
10. **Image Upload to S3**: `s3.js` builds the client; `S3Service.js` exposes `uploadImage`; `GrowerAccountImageService.js` uploads + persists in one transaction.
11. **Testing Approach**: `tree.spec.js` exercises endpoints end-to-end; `__tests__/utils.js` seeds/cleans data and builds PostGIS geometry.
12. **Containerization, CI, and Deployment**: `Dockerfile` (node:16-alpine, `node .`); PR CI runs lint + migrations + tests against Postgres/RabbitMQ service containers; Kustomize deploys 2 replicas with sealed secrets.

## File Map (by layer)

- **API Layer:** `server/routes/index.js`, `server/routes/treeRoutes.js` (+ capture/tag/grower routers),
  `server/handlers/*/index.js`, `server/handlers/*/schemas.js`, `server/handlers/*/docs.js`, `server/handlers/swaggerDoc.js`
- **Service Layer:** `server/services/TreeService.js`, `CaptureService.js`, `TagService.js`,
  `GrowerAccountService.js`, `GrowerAccountImageService.js`, `S3Service.js`, `QueueService.js`, `EventHandlerService.js`
- **Domain Models & Data Access:** `server/models/*.js`, `server/repositories/*Repository.js`, `server/repositories/BaseRepository.js`
- **Platform Integration:** `server/infra/database/knex.js`, `Session.js`, `server/infra/messaging/RabbitMQ.js`, `server/infra/s3.js`
- **Application Core & Utilities:** `server/app.js`, `server/server.js`, `server/setup.js`, `knexfile.js`, `server/utils/*.js`, `server/infra/HttpError.js`
- **Database:** `database/migrations/**`, `database/seeds/**`
- **Infrastructure & CI/CD:** `Dockerfile`, `deployment/**` (Kustomize), `.github/workflows/**`

## Complexity Hotspots

Approach these areas carefully: they carry the most logic or the largest surface (56 files rated moderate+):

- **`server/models/Capture.js`** (complex): capture query/create/update logic plus domain-event emission.
- **`server/handlers/treeHandler/docs.js`** and **`captureHandler/docs.js`** (complex): the largest Swagger definition files.
- **`server/services/TreeService.js`**, **`GrowerAccountService.js`** (moderate): transaction + queue orchestration.
- **`server/handlers/*/index.js`** (moderate): the request handlers where HTTP meets the domain.
- **`server/utils/utils.js`** (moderate): async handler wrapper + global error middleware.
- **`__tests__/integration/tree/tree.spec.js`**, **`capture/capture.spec.js`** (complex): full-stack integration suites; read them to see real end-to-end behavior.
- **`docs/api/spec/treetracker.v1.yaml`** (complex): the OpenAPI contract; large but authoritative.
- **`database/seeds/data/*.json`** (complex): large seed fixtures; big but low-risk data files.

---

_Regenerate with `/understand` then `/understand-onboard`. See `docs/regenerating.md` in the docs repo._

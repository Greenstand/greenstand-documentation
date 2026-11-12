# Onboarding Guide: images-api (Greenstand Images API)

_Generated from the Understand-Anything knowledge graph. Source commit `9d761d1`._

## Project Overview

The **images-api** is a Greenstand Node.js/Express microservice. It exposes a RESTful image
resize API: it fetches a remote source image over HTTP, validates resize parameters with Joi,
and applies transforms with the Sharp image library. The service follows a layered, MVC-like
structure (protocol, service, and model layers). It ships a Knex/PostgreSQL persistence scaffold
for future stateful features, but the current image-resize flow is stateless.

- **Languages:** JavaScript, JSON, YAML, Dockerfile, shell, Markdown
- **Frameworks:** Express, Docker, GitHub Actions, Mocha
- **Entry points:** `server/server.js` (runtime boot) and `server/app.js` (Express factory)

The request flow is: **router → handler → service → (Sharp/Joi) → HTTP response**, with a
shared utility layer for async wrapping and centralized error handling.

## Architecture Layers

- **API Layer**\
  Files: 9\
  What it holds: Express app factory, server bootstrap, the image-resize route/handler chain, and the OpenAPI contract for the `GET /img` endpoints.
- **Service Layer**\
  Files: 1\
  What it holds: `ResizeImageService`: fetches the remote image, validates resize params with Joi, applies Sharp transforms.
- **Data Layer**\
  Files: 7\
  What it holds: Knex/Postgres persistence scaffold: `BaseRepository`, `Session`, connection modules, `knexfile.js`, migration/seed assets.
- **Utility Layer**\
  Files: 3\
  What it holds: Shared cross-cutting helpers: async handler wrapper, centralized error handler, `HttpError` type, pagination/query helpers.
- **Test Layer**\
  Files: 5\
  What it holds: Mocha/Chai unit and Supertest integration specs plus the shared HTTP test client.
- **Infrastructure & CI/CD**\
  Files: 18\
  What it holds: Dockerfile, Kustomize base/overlay Kubernetes manifests, GitHub Actions pipelines, Husky git hooks, database setup scripts.
- **Configuration Layer**\
  Files: 9\
  What it holds: Project manifest, environment templates, and tooling config (npm, ESLint, Prettier, commitlint, semantic-release, CODEOWNERS).
- **Documentation Layer**\
  Files: 3\
  What it holds: Project README, changelog, and contributing guide.

## Key Concepts

- **Thin protocol layer.** `server/routes.js` maps the image-resize GET routes to handlers and
  wraps each in an async error-handling wrapper from the utility layer. Handlers only orchestrate
  HTTP concerns; the actual image work is delegated down to the service.
- **`HttpError` carries status + rollback.** The custom error type (`server/utils/HttpError.js`)
  lets inner layers throw and the centralized error handler in `server/utils/utils.js` translate
  `HttpError`, Joi validation errors, and Axios errors into proper HTTP responses. It has the
  highest fan-in in the project.
- **Sharp + Joi in one service.** `ResizeImageService` holds the core business logic: it fetches
  a remote source image, validates height/width/rotation/quality with Joi, and applies Sharp
  transforms. It is the deepest node in the request dependency chain.
- **Persistence scaffold, not yet used.** `BaseRepository` is a generic Knex-backed base class
  (CRUD + filtered queries). `Session` manages the transaction lifecycle. `knex.js` and
  `knexfile.js` configure the shared Postgres connection per environment. This layer is the
  foundation for future repositories that store image or domain data.
- **Contract lives beside the code.** The OpenAPI spec (`docs/api/spec/images-api.yaml`) documents
  two GET endpoints independent of the implementation: one returns an image for a domain, one
  returns a resized image whose params encode height, width, rotation, and quality.
- **Template lineage.** This repo is generated from Greenstand's microservice template, so the
  npm package name is `treetracker` and several workflows are named `treetracker-api-*`.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Application Bootstrap**: `server/server.js` loads environment config, sets the log level via `server/setup.js`, imports the Express app, and listens on the configured port.
2. **The Express App Factory**: `server/app.js` wires CORS, JSON body parsing, a content-type guard, the image-resize router, and a single global error handler. Highest fan-out file.
3. **Routing and Request Dispatch**: `server/routes.js` maps the image-resize GET routes to their handlers, each wrapped in the async error handler.
4. **Image-Resize Handlers**: `server/handlers/resizeImageHandler.js` reads and validates request parameters, then streams the resized image back through the service.
5. **The Service Layer: Sharp and Joi**: `server/services/ResizeImageService.js` fetches the remote image, validates params with Joi, and applies Sharp transforms.
6. **Cross-Cutting Utilities and Error Handling**: `server/utils/utils.js` (async wrapper + global error middleware), `server/utils/HttpError.js` (shared error type), `server/utils/helper.js` (pagination/query parsing).
7. **The Data Layer: Knex and Postgres**: `server/repositories/BaseRepository.js`, `server/database/Session.js`, `server/database/knex.js`, and `knexfile.js` provide the persistence scaffold.
8. **The API Contract**: `docs/api/spec/images-api.yaml` defines the two public GET endpoints; read it alongside the handlers from Step 4.
9. **Testing Strategy**: `server/app.spec.js` (unit: 415 on non-JSON POST, 200 on GET /), `api-tests/image-resize-api.spec.js` (integration, mocking Axios), `api-tests/lib/supertest.js` (shared HTTP client).
10. **Project Manifest and Environment**: `package.json` (entry point, scripts, dependencies), `.env.development.example` (Postgres URLs + upstream API), `README.md` (architecture overview).
11. **Containerization**: `Dockerfile` (single-stage `node:16-alpine`, `npm ci`, `node .`) and `.dockerignore`.
12. **Kubernetes Deployment**: `deployment/base/*` Kustomize manifests: namespace, Deployment (one replica), Service, and an Ambassador Mapping that routes external `/images/` traffic in.
13. **CI/CD Pipelines**: `treetracker-api-pull-request-ci.yml` (lint + integration tests on PR) and `treetracker-api-build-deploy-dev.yml` (semantic-release, build/push image, update dev overlay on push to main).

## File Map (by layer)

- **API Layer:** `server/server.js`, `server/setup.js`, `server/app.js`, `server/routes.js`, `server/handlers/resizeImageHandler.js`, `docs/api/spec/images-api.yaml` (+ `example.yaml`)
- **Service Layer:** `server/services/ResizeImageService.js`
- **Data Layer:** `server/repositories/BaseRepository.js`, `server/database/Session.js`, `server/database/knex.js`, `knexfile.js`, `database/seeds/00_job_database_cleaner.js`, `database/database.json.example`, `database/migrations/.gitkeep`
- **Utility Layer:** `server/utils/utils.js`, `server/utils/HttpError.js`, `server/utils/helper.js`
- **Test Layer:** `server/app.spec.js`, `api-tests/image-resize-api.spec.js`, `api-tests/lib/supertest.js`, `server/repositories/BaseRepository.spec.js`, `server/models/empty.spec.js`
- **Infrastructure & CI/CD:** `Dockerfile`, `.dockerignore`, `deployment/**` (Kustomize base + dev/prod/test overlays), `.github/workflows/**`, `.husky/**`, `scripts/**`
- **Configuration Layer:** `package.json`, `.env.development.example`, `.env.test.example`, `.eslintignore`, `.npmrc`, `.prettierrc.json`, `.releaserc`, `commitlint.config.js`, `CODEOWNERS`
- **Documentation Layer:** `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`

## Complexity Hotspots

Approach these areas carefully: they carry the most logic or the largest surface (all rated moderate):

- **`server/services/ResizeImageService.js`** (moderate): the core: remote fetch + Joi validation + Sharp transforms.
- **`server/handlers/resizeImageHandler.js`** (moderate): where HTTP meets the domain; parameter validation and streaming.
- **`server/utils/utils.js`** (moderate): async handler wrapper + global error middleware.
- **`server/repositories/BaseRepository.js`** (moderate): generic Knex CRUD + filtered-query base class. Note `BaseRepository.spec.js` currently mirrors the implementation rather than testing it.
- **`server/database/Session.js`** (moderate): Knex session + transaction lifecycle.
- **`api-tests/image-resize-api.spec.js`** (moderate): end-to-end integration suite; read it to see real request behavior.
- **`docs/api/spec/images-api.yaml`** and **`example.yaml`** (moderate): the OpenAPI contract; authoritative for the public shape.
- **`.github/workflows/treetracker-api-build-deploy-dev.yml`** (moderate): the full commit-to-deploy pipeline.

---

_Regenerate with `/understand` then `/understand-onboard`. See `docs/regenerating.md` in the docs repo._

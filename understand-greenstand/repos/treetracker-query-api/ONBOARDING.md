# Onboarding Guide: treetracker-query-api

Machine-generated onboarding guide from the Understand-Anything knowledge graph.

- **Source commit:** `42897d6`
- **Snapshot date:** 2026-09-03
- **Graph:** 242 nodes, 344 edges, 8 architecture layers, 13-step guided tour

## Project Overview

`treetracker-query-api` is a RESTful API that exposes Greenstand treetracker data (captures,
planters/growers, organizations, trees, species, tags, countries, tokens and transactions) for
clients such as the web map app. It follows a Domain Driven Design layered architecture:
an Express protocol/router layer, a business model layer, and a knex/pg repository layer over
PostgreSQL.

- **Primary language:** TypeScript
- **Languages:** dockerfile, javascript, json, markdown, shell, typescript, yaml
- **Frameworks:** Express, Jest, Mocha, Docker, GitHub Actions

## Architecture Layers

The system splits into 8 layers. The 3 core code layers form the DDD request path
(router -> model -> repository -> database).

- **Protocol & Router Layer** (`layer:api`, 24 nodes)\
  Role: Express application bootstrap, versioned resource routers with Joi validation, HTTP error handling, request/response wiring.
- **Business Model Layer** (`layer:service`, 21 nodes)\
  Role: Domain business models for trees, captures, planters, organizations, wallets, species and countries. Orchestrate queries, build HATEOAS links, delegate to repositories. Plus GeoJSON parsing helpers.
- **Repository & Data Access Layer** (`layer:data`, 24 nodes)\
  Role: Knex/pg repositories, the `BaseRepository`, database `Session` and connection factory that build and run SQL against the PostgreSQL treetracker database.
- **Domain Interfaces & Types** (`layer:types`, 22 nodes)\
  Role: TypeScript interface definitions for domain records and query filters, plus ambient module declarations shared across model and repository layers.
- **Infrastructure & CI/CD** (`layer:infrastructure`, 29 nodes)\
  Role: Dockerfile, Kubernetes/Kustomize deployment manifests with Ambassador mappings and sealed secrets, GitHub Actions build-and-deploy pipelines, developer setup scripts.
- **Configuration & Tooling** (`layer:config`, 20 nodes)\
  Role: Build, lint, format and release configs (TypeScript, Prettier, ESLint, semantic-release), runtime environment and database connection settings, git hooks.
- **Documentation & API Spec** (`layer:documentation`, 29 nodes)\
  Role: README, changelog and contributing guides, GitHub issue templates, and the OpenAPI spec with example response fixtures.
- **Test Layer** (`layer:test`, 25 nodes)\
  Role: End-to-end endpoint suites, repository and model unit specs, seed and supertest fixtures, Jest setup/config.

## Key Concepts

- **Layered request path.** A request flows: Express router (validates params with Joi and
  routes) -> business model (orchestrates and builds HATEOAS links) -> repository (builds and
  runs knex SQL) -> JSON response.
- **`delegateRepository`.** Helper that wires a model straight to its repository for simple
  cases, so routers and models avoid writing SQL directly.
- **`BaseRepository`.** Generic knex-backed CRUD base (`getById`, filtering, counting, update,
  create). Concrete repositories extend it.
- **`Session`.** Wraps a knex connection and manages transaction begin/commit/rollback.
- **`DbModel` interface.** Shared domain-record contract that the interface types extend.
- **`HttpError`.** Structured error type for consistent HTTP error responses.
- **V1 / V2 split.** Several resources (captures, countries, stakeholders, trees) ship both a
  legacy and a V2 repository/model.

## Business Domains

- **Tree & Capture Data**: trees, processed captures, raw (unprocessed) captures. Core
  observation data.
- **Stakeholder Directory**: planters, grower accounts (v2), organizations, stakeholders.
- **Species Catalog**: filtered species lists and single-species lookups.
- **Geospatial & Mapping**: map bounding boxes from capture coordinates, PostGIS
  nearest-feature, countries and planting leaderboard.
- **Token & Transaction Ledger**: issued tokens (linked to captures and wallets), token
  transactions between wallets, contracts.

## Guided Tour

Recommended reading order for a new developer.

1. **Project Overview**: `README.md`
2. **Application Entry Point**: `server/server.ts`, `server/app.ts`
3. **Runtime Configuration**: `package.json`, `.env.example`
4. **Router Layer and Shared Utilities**: `server/routers/utils.ts`
5. **Concrete Resource Routers**: `server/routers/treesRouter.ts`, `server/routers/growerAccountsRouter.ts`
6. **Business Model Layer**: `server/models/Tree.ts`, `server/models/GrowerAccount.ts`
7. **Domain Model Contract**: `server/interfaces/DbModel.ts`
8. **Repository Foundation**: `server/infra/database/Session.ts`, `server/infra/database/BaseRepository.ts`, `server/infra/database/delegateRepository.ts`
9. **Concrete Repository**: `server/infra/database/TreeRepositoryV2.ts`
10. **Structured Error Handling**: `server/utils/HttpError.ts`
11. **Containerization**: `Dockerfile`, `tsconfig.json`
12. **Kubernetes Deployment**: `deployment/base/deployment.yaml`, `deployment/base/kustomization.yaml`
13. **CI/CD Pipelines**: `.github/workflows/pull-request-ci.yml`, `.github/workflows/deploy-prod-env.yml`

## File Map (key files by layer)

### Protocol & Router Layer
- `server/app.ts`: Express entry point; registers global middleware and mounts all versioned routers.
- `server/routers/treesRouter.ts`: tree endpoints for filtered queries, counts, and featured trees.
- `server/routers/capturesRouter.ts` / `rawCapturesRouter.ts`: capture endpoints with Joi validation.
- `server/routers/gisRouter.ts`: GIS endpoints combining Bounds and Gis models for spatial queries.
- `server/routers/utils.ts`: shared router helpers (async handling, response shaping).

### Business Model Layer
- `server/models/Tree.ts`: orchestrates tree queries and counts across organization, date, tag, wallet.
- `server/models/Bounds.ts`: computes map bounding boxes by filter.
- `server/models/Capture.ts` / `RawCapture.ts`: capture query and count operations.
- `server/models/Country.ts`: `getCountries` plus repository-delegated lookups and leaderboard.

### Repository & Data Access Layer
- `server/infra/database/BaseRepository.ts`: generic knex-backed CRUD base.
- `server/infra/database/Session.ts`: knex connection wrapper with transaction management.
- `server/infra/database/TreeRepository.ts` / `TreeRepositoryV2.ts`: tree queries by many filters.
- `server/infra/database/CaptureRepository.ts` / `RawCaptureRepository.ts`: dynamic filter building, pagination, counting.
- `server/infra/database/delegateRepository.ts`: wires a model to its repository for simple cases.

## Complexity Hotspots

Approach these files carefully; they carry the most logic.

- `server/infra/database/TreeRepository.ts`: tree queries by id, UUID, organization, date range, tag, wallet.
- `server/infra/database/TreeRepositoryV2.ts`: V2 tree queries with the same breadth.
- `server/infra/database/CaptureRepository.ts`: dynamic filter building, pagination, counting.
- `server/infra/database/RawCaptureRepository.ts`: raw-capture querying with dynamic filters.
- `server/infra/database/GrowerAccountRepository.ts`: filtered SQL for counts and lookups.
- `server/infra/database/BaseRepository.spec.ts`: large unit suite; read to learn repository behavior.
- `docs/api/spec/query-api.yaml`: the full OpenAPI spec (all paths and operations).
- `CHANGELOG.md`: auto-generated release history (Conventional Commits).

## Next Steps

- Explore the graphs interactively with the `/understand-anything:understand-dashboard` skill,
  loading `knowledge-graph.json` or `domain-graph.json`.
- Read `server/app.ts` first, then follow one resource end to end
  (router -> model -> repository), for example the tree path.

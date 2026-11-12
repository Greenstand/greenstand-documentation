# Onboarding Guide: treetracker-admin-api

Machine-generated onboarding guide for the Greenstand Treetracker Admin API. It derives from the
Understand-Anything knowledge graph (184 nodes, 230 edges, 9 layers, 14-step tour).

## Project Overview

- **Name:** treetracker-admin-api
- **Description:** Treetracker Admin API Server. The RESTful backend for the Greenstand Treetracker
  Admin Panel, used to verify, process, and manage tree-capture data collected in the field.
- **Primary language:** TypeScript (with supporting JavaScript utilities)
- **Languages:** typescript, javascript, yaml, json, dockerfile, shell, markdown, html
- **Frameworks / platforms:** LoopBack 4 (over Express), PostgreSQL (loopback-connector-postgresql),
  RabbitMQ (rascal / amqplib), Docker, Docker Compose, Kubernetes (Kustomize + SealedSecrets),
  GitHub Actions, Jest.
- **Frontend:** managed separately in `Greenstand/treetracker-admin-client`.

## Architecture Layers

The codebase splits into nine layers. The first four hold the running application; the rest cover
tests, infrastructure, and project tooling.

1. **API Layer** (13 nodes): LoopBack 4 REST controllers for trees, planters (growers),
   organizations, species, and tags, plus cross-org variants, the routing index, and a health-check
   ping controller.
2. **Data Access Layer** (23 nodes): LoopBack entity models, repositories that run raw parameterized
   SQL through a shared query builder, and the PostgreSQL datasource bindings.
3. **Application Core & Messaging** (10 nodes): application bootstrap, server startup, the custom
   request sequence, the migration runner, runtime config, the authorization policy, and the RabbitMQ
   publisher.
4. **Shared Utilities** (4 nodes): cross-cutting JavaScript helpers for JWT auth, audit logging,
   filter-query construction, and generic utilities.
5. **Testing** (8 nodes): integration and unit suites plus database seed fixtures.
6. **Infrastructure & Deployment** (43 nodes): Dockerfiles, docker-compose, Kubernetes Kustomize
   bases and overlays with SealedSecrets, dev scripts, nginx reverse proxy, and the systemd unit.
7. **CI/CD Pipelines** (9 nodes): GitHub Actions workflows for CodeQL analysis, build-and-deploy, and
   environment-specific production and test deployments.
8. **Documentation** (9 nodes): README, changelog, developing and tutorial guides, per-module
   READMEs, and the OpenAPI specification.
9. **Project Configuration** (17 nodes): build, lint, formatting, release, and tooling configs, plus
   static HTML assets and ignore rules.

## Key Concepts

- **LoopBack 4 MVC split.** Requests flow controller → repository → model → datasource. Controllers
  expose REST endpoints, repositories own persistence, models define entities, datasources bind to
  PostgreSQL.
- **Organization-scoped access control.** Repositories such as `planter.repository.ts` and
  `trees.repository.ts` filter data by organization. They reach into LoopBack connector internals to
  run parameterized SQL joins.
- **Shared filter-query builder.** `src/js/buildFilterQuery.js` translates a LoopBack filter object
  into a parameterized SQL query (where clauses, ordering, pagination), reused across repositories.
- **JWT auth + policy authorization.** `src/js/auth.js` issues JWTs and provides the `isAuth`
  middleware. `src/policy.json` declares route permissions. `src/js/Audit.js` records audited actions.
- **Transactional domain events + RabbitMQ outbox.** `TreesController.updateById` runs a DB
  transaction: it detects a verification change, inserts a `domainEvent` row, commits, then publishes
  the event over RabbitMQ (`RabbitMQMessaging.js`) and marks it sent.
- **Custom Express sequence.** `src/server.ts` wraps the LoopBack app in Express to mount CORS, JSON
  parsing, and the audit/auth middleware before the framework handles routes.

## Guided Tour (recommended reading order)

1. **Project Overview**: `README.md`, `DEVELOPING.md`
2. **Application Entry Point**: `src/index.ts`, `src/server.ts`
3. **LoopBack 4 Application Core**: `src/application.ts`, `src/sequence.ts`
4. **Configuration and Datasource**: `src/config.js`, `src/datasources/config.ts`,
   `src/datasources/treetracker.datasource.ts`
5. **Domain Models**: `src/models/index.ts`, `trees.model.ts`, `planter.model.ts`,
   `organization.model.ts`, `species.model.ts`
6. **Repositories and SQL Query Building**: `src/repositories/index.ts`, `trees.repository.ts`,
   `planter.repository.ts`, `src/js/buildFilterQuery.js`
7. **REST Controllers**: `src/controllers/index.ts`, `trees.controller.ts`, `planter.controller.ts`,
   `organization.controller.ts`
8. **Authentication and Authorization**: `src/js/auth.js`, `src/policy.json`, `src/js/Audit.js`
9. **Event-Driven Messaging with RabbitMQ**: `src/messaging/RabbitMQMessaging.js`,
   `src/messaging/config.js`, `domainEvent.model.ts`, `domainEvent.repository.ts`
10. **Database Migration**: `src/migrate.ts`
11. **Integration Testing and Seeding**: `src/__tests__/integration/integration.ts`,
    `src/__tests__/seed/seed.ts`, `src/js/auth.int.test.js`
12. **Containerization and Local Stack**: `Dockerfile`, `dev/compose/docker-compose.yml`
13. **Kubernetes Deployment**: `deployment/base/treetracker-admin-api-deployment.yaml`,
    `kustomization.yaml`, the database and RabbitMQ SealedSecrets
14. **CI/CD Pipelines**: `.github/workflows/treetracker-admin-api-build-deploy.yml`,
    `codeql-analysis.yml`

## File Map (by layer)

**Application Core & Messaging**
- `src/index.ts`: process entry point; boots and starts the server.
- `src/server.ts`: Express wrapper mounting CORS, JSON parsing, audit/auth middleware, static assets,
  and the LoopBack app; exposes boot/start/stop.
- `src/application.ts`: LoopBack 4 application class wiring the custom sequence, REST explorer, and
  boot components.
- `src/sequence.ts`: custom request-handling sequence.
- `src/migrate.ts`: database migration runner.
- `src/messaging/RabbitMQMessaging.js` / `config.js`: RabbitMQ publisher and broker config.

**API Layer**
- `src/controllers/trees.controller.ts`: core trees controller: count, list, find-by-id, geospatial
  near-search, and the transactional update that emits domain events.
- `src/controllers/planter.controller.ts`, `organization.controller.ts`, `species.controller.ts`,
  `tag.controller.ts`, `treeTag.controller.ts`, and cross-org variants.

**Data Access Layer**
- `src/models/trees.model.ts`: the core capture record (geolocation, verification, approval, species,
  embedded tree tags).
- `src/repositories/trees.repository.ts`, `planter.repository.ts`: organization-scoped repositories
  with custom SQL joins.
- `src/datasources/treetracker.datasource.ts`: PostgreSQL datasource binding.

**Shared Utilities**
- `src/js/auth.js`: login, JWT issuance, password hashing, `isAuth` middleware.
- `src/js/buildFilterQuery.js`: LoopBack filter → parameterized SQL.
- `src/js/Audit.js`, `src/js/utils.js`: audit logging and generic helpers.

## Complexity Hotspots

Approach these files carefully; the graph marks them as the most complex (16 of 136 file-level nodes):

- `src/js/auth.js`: auth, JWT, password hashing, and policy enforcement in one module.
- `src/controllers/trees.controller.ts`: transactional update with domain-event emission and
  RabbitMQ publish.
- `src/repositories/trees.repository.ts`, `planter.repository.ts`: org-scoped raw SQL that reaches
  into connector internals.
- `src/controllers/planterOrganization.controller.ts`, `treesOrganization.controller.ts`,
  `species.controller.ts`: cross-org and catalog logic.
- `src/models/trees.model.ts`, `planter.model.ts`: large entity models.
- `src/__tests__/integration/integration.ts`, `src/tests/seed/seed.ts`, `src/js/auth.test.js`:
  heavy test and seed fixtures.
- Docs: `docs/api/spec/treetracker-admin.v1.yaml` (2135-line OpenAPI spec), `CHANGELOG.md`,
  `README.md`, `rematchTutorial.md`.

## Business Domains

The domain graph identifies five domains (14 flows, 58 steps):

- **Capture Verification** (core): browse/search captures, verify-approve-reject with a transactional
  domain-event + RabbitMQ outbox, manage tree tags.
- **Grower Management**: browse and update growers, query planter registrations.
- **Organization Management**: browse organizations and resolve organization scope reused by other
  domains.
- **Identity & Access Control**: admin login (JWT), request authorization (`isAuth` policy), audit
  logging, admin-user management.
- **Species & Tag Catalog**: manage species (CRUD, capture-count, combine) and tags.

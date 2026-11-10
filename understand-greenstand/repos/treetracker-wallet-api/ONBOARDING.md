# Onboarding Guide: treetracker-wallet-api

_Generated from the Understand-Anything knowledge graph. Source commit `e95c15a`._

## Project Overview

**treetracker-wallet-api** is a Greenstand Node.js/Express REST API backed by PostgreSQL (via
Knex). It manages **wallets** that accumulate tree-planting tokens, **trust relationships** that
gate which wallets may move tokens between each other, and the **transfer lifecycle** (pending,
requested, completed, declined, cancelled) for both explicit tokens and unclaimed bundles. Every
protected endpoint sits behind JWT (RS256) and API-key authentication, with per-wallet audit
event logging.

- **Languages:** JavaScript, SQL, PL/pgSQL, JSON, YAML, Dockerfile, shell, Markdown
- **Frameworks:** Express, Knex, Mocha, Docker, Docker Compose, GitHub Actions
- **Entry points:** `server/server.js` (process boot) and `server/app.js` (Express app assembly)

The code follows a layered flow: **router → handler → service → model → repository → database**,
with JWT/API-key authentication and event/audit logging as cross-cutting concerns.

## Architecture Layers

- **API Layer**\
  Files: 31\
  What it holds: Express app bootstrap, route handlers, routers, Joi-style request schemas, and the OpenAPI/Postman API contracts for auth, event, token, transfer, trust, and wallet resources.
- **Service Layer**\
  Files: 10\
  What it holds: Business logic services orchestrating authentication, hashing, JWT issuance, S3 uploads, and token/transfer/trust/wallet operations between handlers and repositories.
- **Data Layer**\
  Files: 94\
  What it holds: Domain models, Knex-based repositories, the database session/connection client, and db-migrate migrations plus raw SQL defining the PostgreSQL wallet schema.
- **Utility Layer**\
  Files: 5\
  What it holds: Shared cross-cutting helpers, enums (transfer/trust states), and the `HttpError` class used across handlers, services, and repositories.
- **Infrastructure**\
  Files: 19\
  What it holds: Docker and docker-compose container definitions, Kubernetes/Kustomize deployment manifests, and the AWS S3 client used to run and deploy the wallet API.
- **CI/CD Pipelines**\
  Files: 20\
  What it holds: GitHub Actions workflows and their build/test/deploy steps, plus the pull request template.
- **Configuration**\
  Files: 12\
  What it holds: Environment files, linting/formatting rules, commit conventions, package manifests, and code ownership settings.
- **Documentation**\
  Files: 2\
  What it holds: Top-level README and CHANGELOG describing the wallet API and its release history.
- **Operational Scripts**\
  Files: 15\
  What it holds: One-off Node.js and shell scripts for creating wallets, seeding demo data, and batch-generating tokens outside the running API.
- **Test Suite**\
  Files: 72\
  What it holds: Legacy, integration, and end-to-end test specs plus mock data and colocated unit tests.

## Key Concepts

- **Session-scoped transactions.** Every service call runs over a `Session`
  (`server/infra/database/Session.js`) wrapping a Knex connection, letting callers begin, commit,
  or roll back a transaction shared across multiple repository calls: the mechanism `TransferService`
  relies on for atomic transfers.
- **Repository inheritance.** Every repository extends `BaseRepository` (`server/repositories/BaseRepository.js`),
  which supplies shared CRUD, a recursive where-clause builder, pagination, and batch-insert logic.
  `WalletRepository` builds on this with a union query across self, child, and managed wallets.
- **Trust gates transfer.** `Wallet.hasControlOver()` (hierarchical parent/sub-wallet control) and
  `Trust`'s request/accept/decline/cancel lifecycle together authorize whether tokens may move
  between two wallets: this coupling threads through Trust, Transfer, Token Query, and Audit
  Logging.
- **Transfer state machine.** `Transfer.js` and `Token.js` orchestrate trust checks, wallet-control
  checks, and state transitions (pending, requested, completed, cancelled) for both explicit token
  and unclaimed bundle transfers, defined by `transfer-enum.js` and `trust-enums.js`.
- **Dual authentication.** `ApiKeyService` validates the `treetracker-api-key` header (existence,
  deprecation, endpoint-specific permissions like batch-create); `JWTService` signs/verifies RS256
  tokens carrying `wallet_id`, used to resolve "the logged-in wallet" for authorization everywhere.
- **Audit trail.** Every domain (auth, wallet, trust, transfer, token) emits events through the
  Event/Audit Logging domain for a queryable per-wallet history.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Project Overview**: Read the `README` for setup (database, environment variables, JWT
   keygen) and the layered service/model/repository architecture.
2. **Bootstrap and App Configuration**: `server/server.js` boots the process; `server/app.js`
   wires CORS, body parsing, all routes, and the global error handler.
3. **Routing Layer**: `server/routes/index.js` aggregates sub-routers (auth, token, transfer,
   trust, wallet, event); each router maps a URL prefix to handler functions.
4. **Handlers and Request Validation**: Handlers validate input via `schemas.js`, then delegate
   to the matching service (`authHandler` → `AuthService`, `transferHandler` → `TransferService`,
   etc.), keeping the service layer free of Express-specific code.
5. **Authentication: JWT and API Keys**: `AuthService` verifies a hashed password and calls
   `JWTService` to sign an RS256 token; `ApiKeyService` validates the API-key header on protected
   endpoints.
6. **Service Layer: Business Logic**: `WalletService` (CRUD, control-over checks),
   `TrustService` (trust lifecycle), and `TransferService` (the largest: initiate, accept,
   decline, cancel, fulfill, each wrapped in a transaction with an audit event).
7. **Domain Models: Wallet, Trust, Transfer**: `Wallet.js` implements hierarchical control
   checks; `Trust.js` manages the trust lifecycle; `Transfer.js` orchestrates trust/control
   checks and state transitions per `trust-enums.js` / `transfer-enum.js`.
8. **Repositories and Database Session**: `BaseRepository` provides shared CRUD and query
   building; `WalletRepository` unions self/child/managed wallets; `Session.js` wraps the Knex
   connection/transaction that `TransferService` depends on for atomicity.
9. **Database Schema and Migrations**: db-migrate migrations create the `wallet`, `entity_trust`,
   and `transfer` tables; `database/README.md` explains the migration command reference.
10. **Testing Strategy: Unit, Integration, E2E**: Unit tests (`TransferService.spec.js`) mock
    dependencies; integration tests (`bundle-transfer-decline.spec.js`) hit a seeded real database;
    E2E tests (`__tests__/e2e/`) run Mocha root hooks against a live deployed environment.
11. **Containerization**: The `Dockerfile` (node:16-alpine, single-stage) packages the app;
    `docker-compose.yml` spins up local Postgres 13 for development.
12. **Kubernetes Deployment**: Kustomize base manifests (`deployment.yaml`, `kustomization.yaml`)
    define production rollout (2 replicas, JWT/DB/S3 secrets), with dev/test/prod overlays.
13. **CI/CD Pipelines**: The pull-request workflow lints, migrates, and tests on every PR; the
    build-deploy-dev workflow builds/pushes a Docker image, deploys to Kubernetes, then runs E2E
    tests against the freshly deployed environment.

## File Map (by layer)

- **API Layer:** `server/app.js`, `server/routes/*.js`, `server/handlers/*/index.js`,
  `server/handlers/*/schemas.js`, `docs/api/spec/*.yaml`, `docs/api/postman/*.json`
- **Service Layer:** `server/services/AuthService.js`, `ApiKeyService.js`, `JWTService.js`,
  `HashService.js`, `S3Service.js`, `EventService.js`, `TokenService.js`, `TransferService.js`,
  `TrustService.js`, `WalletService.js`
- **Data Layer:** `server/models/*.js` (Wallet, Trust, Transfer, Token, Event, ApiKey),
  `server/repositories/*Repository.js`, `server/infra/database/Session.js`, `knex.js`,
  `database/migrations/**`
- **Utility Layer:** `server/utils/HttpError.js`, `utils.js`, `transfer-enum.js`, `trust-enums.js`,
  `event-enum.js`
- **Infrastructure:** `Dockerfile`, `docker-compose.yml`, `deployment/base/**`,
  `deployment/overlays/**`, `server/infra/aws/s3.js`
- **CI/CD Pipelines:** `.github/workflows/*.yml`
- **Configuration:** `package.json`, `.env.example`, `.eslintrc.json`, `.prettierrc.json`,
  `commitlint.config.js`, `CODEOWNERS`
- **Documentation:** `README.md`, `CHANGELOG.md`
- **Operational Scripts:** `scripts/create/*.js`, `scripts/demo/*.js`, `scripts/user/*.sh`
- **Test Suite:** `__tests__/**`, plus colocated `*.spec.js` files under `server/`

## Complexity Hotspots

Approach these areas carefully: they carry the most logic or the largest surface (97 files rated
moderate+, 33 rated complex):

- **`server/services/TransferService.js`** (complex): orchestrates the full transfer lifecycle
  (initiate, accept, decline, cancel, fulfill) across wallets, tokens, and bundles, each step
  wrapped in a transaction with event logging.
- **`server/services/WalletService.js`** (complex): central wallet CRUD, sub-wallet lookups,
  control-over authorization, and CSV-based batch wallet creation/transfer.
- **`server/models/Transfer.js`** and **`server/models/Token.js`** (complex): the transfer/token
  state machine encoding trust checks, wallet-control checks, and state transitions.
- **`server/handlers/transferHandler/index.js`**, **`trustHandler/index.js`**,
  **`walletHandler/index.js`** (complex): the widest handler surface, each covering many
  lifecycle endpoints.
- **`server/repositories/TransferRepository.js`**, **`TrustRepository.js`** (complex): CTE-based
  insert/update queries joined with wallet names, plus specialized filtered/paginated lookups.
- **`docs/api/spec/treetracker-wallet-api.yaml`** and **`treetracker-wallet-api-v1-10.yaml`**
  (complex): the OpenAPI contracts; large but authoritative.
- **`docs/api/postman/treetracker-wallet-api-collection.json`** (complex): large Postman
  collection documenting the full HTTP surface.
- **`server/services/TransferService.spec.js`**, **`server/repositories/BaseRepository.spec.js`**,
  and the handler `*.spec.js` files (complex): large test suites; read them to see real
  end-to-end behavior for each lifecycle.

---

_Regenerate with `/understand` then `/understand-domain` then `/understand-onboard`._

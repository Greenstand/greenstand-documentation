# Onboarding Guide: treetracker-airflow-dags

_Generated from the Understand-Anything knowledge graph. Source commit `a537231`._

## Project Overview

**treetracker-airflow-dags** is Greenstand's Apache Airflow automation pipeline for the
Tree Tracker platform. Python DAGs schedule and trigger recurring data jobs (export,
migration, reporting/analytics, web-map precompute, and species identification) while a
shared `lib/` holds the reusable job logic. A few jobs also run as Node.js scripts driven by
shell/cron wrappers.

- **Languages:** Python (dominant), JavaScript, shell, JSON, Markdown
- **Framework:** Apache Airflow
- **No Python manifest** (`requirements.txt`/`pyproject.toml`) is committed; dependencies are
  inferred from imports (psycopg2, CKAN client, etc.).

**Core pattern:** DAG files stay thin. A `*_dag.py` wires an Airflow `PythonOperator` to a
callable that lives in `lib/`; the real work (SQL, CSV export, uploads) is in the library
module. Learn one DAG and you understand them all.

## Architecture Layers

- **DAG Orchestration**\
  Files: 24\
  What it holds: Top-level `*_dag.py` Airflow entry points (export, migration, reporting, cache-warming, species-id).
- **Job Library (lib)**\
  Files: 15\
  What it holds: Reusable Python job modules (export, migration, leaderboard, reporting, messaging) + the shared `lib/utils.py`.
- **Web-Map Precompute (map)**\
  Files: 6\
  What it holds: Airflow DAGs and Node.js scripts that precompute web-map tiles and tree clusters.
- **Tests**\
  Files: 16\
  What it holds: Pytest modules covering the `lib/` job logic and the tutorial DAG.
- **Tooling & Scripts**\
  Files: 4\
  What it holds: Shell cron wrappers (with PID locking) that run map/notification jobs outside Airflow.
- **Project Config & Docs**\
  Files: 4\
  What it holds: Repo config, env files, npm deps for the Node scripts, README.

## Key Concepts

- **Thin DAG, fat lib.** DAGs orchestrate; `lib/` implements. The callable a DAG wires up is
  usually one function in a `lib/*.py` module.
- **`lib/utils.py` is the hub.** The most-imported file in the repo (fan-in ~28): shared date
  helpers, DB connection helpers, and the Slack `on_failure_callback` used across DAGs.
- **PostGIS-backed analytics.** Reporting and web-map jobs run spatial SQL (e.g. counting
  planted trees per country, assigning captures to nearest clusters).
- **Two runtimes.** Most jobs are Python; some web-map precompute runs as Node.js scripts,
  triggered either by an Airflow DAG that shells out or by a cron/shell wrapper.
- **Data sinks.** Exports write CSV and upload to a CKAN data portal; migrations reshape data
  in Postgres; reporting populates denormalized reporting-schema tables.

## Guided Tour

1. **Project Overview**: Read the README for what the repo automates and how it is deployed.
2. **The DAG Orchestration Pattern**: `earnings_export_dag.py`: a thin DAG wiring a PythonOperator to a lib callable.
3. **Shared Utilities (`lib/utils`)**: the most-depended-upon file: date/DB helpers + failure callback.
4. **An Export Job (`lib/earning_export`)**: the real work behind Step 2: query, build CSV, upload.
5. **A Reporting Job with PostGIS**: `lib/country_leader_board.py`: spatial SQL for per-country counts.
6. **A Migration Job**: `migrate_stakeholders_dag.py`: reshaping/consolidating data.
7. **Web-Map Precompute DAGs**: `pre_request_map_clusters_dag.py`: cache-warming for the map.
8. **Map Node.js Scripts**: `map/tile-pre-cache.py` shelling out to Node precompute scripts.
9. **Cron & Shell Wrappers**: running the Node map scripts as cron jobs with PID locking.
10. **The Test Approach**: pytest covers `lib/` job logic, not the thin DAGs.

## Complexity Hotspots

Approach carefully (45 files rated moderate+):

- **`lib/species_id.py`** + **`species_id_dag.py`** (complex): the species-ID pipeline: pulls capture images, runs inference, writes results. Heaviest flow.
- **`lib/capture_export.py`**, **`lib/grower_export.py`** (complex): monthly CSV exports to CKAN.
- **`lib/country_leader_board.py`**, **`lib/assign_new_trees_to_cluster.py`** (complex): PostGIS spatial analytics.
- **`populate-reports-schema.py`**, **`populate_tree_reports_schema.py`**, **`session_time_chopping_dag.py`** (complex): reporting-schema population via sequenced SQL.
- **`create-tokens.py`** (complex): inserts wallet-token rows into Postgres.
- **`lib/utils.py`**: not the most complex, but the most connected; changes here ripple across every DAG.

---

_Regenerate with `/understand` then `/understand-domain` then `/understand-onboard`. See `docs/regenerating.md` in the docs repo._

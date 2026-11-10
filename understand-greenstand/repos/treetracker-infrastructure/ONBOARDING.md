# Onboarding Guide: treetracker-infrastructure

Machine-generated onboarding guide for [`Greenstand/treetracker-infrastructure`](https://github.com/Greenstand/treetracker-infrastructure),
the infrastructure-as-code that provisions and operates the Greenstand treetracker platform across DigitalOcean and AWS.

Source commit `a740d11` - snapshot 2026-09-03. Start here, then explore the knowledge graph in the dashboard.

## Project Overview

- **Purpose:** Cloud infrastructure for the treetracker project. This is a monorepo of independent infrastructure stacks, not a single application.
- **Primary language:** Terraform / HCL. HCL parsed to 306 resource nodes.
- **Other languages:** YAML, Python, Shell, JavaScript, Dockerfile, Markdown, CSS, HTML, config.
- **Frameworks / tooling:** Terraform, Docker, GitHub Actions. Also Kubernetes, Kustomize, Ansible, Helm.
- **Graph size:** 507 nodes, 400 edges, 10 architecture layers, 13-step guided tour.

Each stack shares a common pattern: a pinned cloud provider plus an S3-compatible remote state backend. DigitalOcean stacks pin the `digitalocean` provider and store state in Spaces buckets; AWS stacks use the `hashicorp/aws` provider with real S3.

## Architecture Layers

The repository is organized into ten platform layers. They are the best map of the codebase.

1. **Terraform Cloud Provisioning** (53 nodes) - Terraform IaC for DigitalOcean and AWS: droplets, domains/DNS, AWS access/IAM, and the bastion host.
2. **Database Provisioning & Grants** (198 nodes) - PostgreSQL schema, role, grant and default-privilege Terraform resources, plus pgpool routing and database backup storage for the microservice databases. The largest layer.
3. **Kubernetes Workloads & Secrets** (50 nodes) - Kubernetes and Kustomize manifests plus SealedSecrets definitions that deploy and configure cluster workloads.
4. **API Gateway & Ingress** (29 nodes) - Ambassador/api_gateway routing, mappings and ingress that expose backend services over HTTP.
5. **Identity & Access (Keycloak)** (29 nodes) - Keycloak identity server: custom Docker image and theme, realm/client config, and deployment manifests.
6. **Messaging & Workflow Orchestration** (29 nodes) - RabbitMQ broker configuration plus Airflow workflow-orchestration deployments and DAGs.
7. **Search & Data Platform** (34 nodes) - Solr search, CKAN open-data portal, OpenProject, and the tag_lister service.
8. **Static Web Apps & Sites** (31 nodes) - Static front-end web apps, other-sites hosting, and the cdn-images-api CDN delivery config.
9. **Observability & Alerting** (37 nodes) - Monitoring stack, distributed tracing, and the Botkube chat-ops alerting integration.
10. **Platform Ops, CI & Docs** (16 nodes) - Operational shell scripts and tooling, GitHub Actions/pre-commit CI, docs, and repo-level config.

## Key Concepts

- **Monorepo of independent stacks.** Read the repository by layer, not by a code call graph. Each subdirectory is a self-contained Terraform stack or deployment.
- **Provider + remote-state backend pattern.** Every Terraform directory pins a cloud provider and an S3-compatible backend. Learn this once and every stack reads the same way.
- **DigitalOcean compute foundation.** DigitalOcean Kubernetes (DOKS) clusters with dedicated, autoscaling node pools (microservices, cloud-services, monitoring), plus a hardened bastion host for controlled SSH access. Almost every workload runs on top of these clusters.
- **One shared managed Postgres, many schemas.** A DigitalOcean managed PostgreSQL cluster (with a read replica) backs nearly every service. The `microservice_schema` module is the most reused module in the repo: each microservice gets a schema plus three roles (service, migration owner, read-only). This is the platform's least-privilege and tenant-isolation model.
- **Sealed Secrets for git-safe credentials.** Bitnami Sealed Secrets lets encrypted secrets live in git; only the in-cluster controller can decrypt them. `create-secret.sh` is the operator entry point.
- **Ambassador single ingress.** Ambassador fronts every backend service. Workloads expose themselves through `Mapping` custom resources; Terraform provisions DNS and load balancer wiring.
- **Kustomize base-plus-overlays.** Keycloak, RabbitMQ, and other workloads share a base manifest with per-environment overlays that layer config and pull production credentials from SealedSecrets.
- **Ansible + Helm for platform apps.** Airflow, the monitoring stack, tracing, and Solr/CKAN are installed via Ansible playbooks driving Helm charts.
- **CI guardrail.** A pre-commit config plus a GitHub Actions workflow keep every Terraform change formatted and linted before merge.

## Guided Tour

Follow these 13 steps in order. They trace the platform from foundations up to day-to-day operations.

1. **Project Overview & CI** - `README.md`, `.pre-commit-config.yaml`, `.github/workflows/pre-commit.yaml`. What the repo is and the CI guardrail.
2. **Terraform Provisioning Foundations** - provider + remote-state backend blocks shared by every stack.
3. **Compute: DOKS Clusters & Bastion** - `kubernetes/terraform/{dev,prod}/cluster.tf`, `bastion/bastion.tf`.
4. **Managed Postgres Database** - `database/terraform/database.tf`. The production data tier and its firewall rules.
5. **Database Schemas & Least-Privilege Grants** - `database-grants/terraform/prod/main.tf` and the reusable `microservice_schema` module.
6. **Kubernetes Secrets: Sealed Secrets** - `sealed-secrets/README.md`, `sealed-secrets/scripts/create-secret.sh`.
7. **API Gateway: Ambassador Ingress** - `api_gateway/ambassador-playbook.yml` and a sample `Mapping`.
8. **Identity: Keycloak** - custom `Dockerfile`, base `deployment.yaml`, production Kustomize overlay.
9. **Messaging: RabbitMQ** - `rabbitmq/deployment/base/definition.yaml` and its PodMonitor.
10. **Workflow & Data Platform** - Airflow, Solr (`solr/solr_chart/main.tf`), and CKAN (`ckan/.../values.yaml`).
11. **Static Web Apps & CDN** - `web-apps/terraform/prod-web-map.tf`, `cdn-images-api/main.tf`. The only major AWS-hosted layer.
12. **Observability: Metrics, Logs & Tracing** - Prometheus/Grafana, Loki, Jaeger, all behind Ambassador mappings.
13. **Operational Tooling & Backups** - `scripts/README.md`, `tag_lister/list_tags_for_deployments.py`, `database-backup-storage/production-backups.tf`.

## File Map (by layer)

- **Terraform Cloud Provisioning** - `kubernetes/terraform/{dev,prod}/cluster.tf` (DOKS clusters), `bastion/bastion.tf` (SSH bastion), `aws_access/terraform/users.tf` (AWS IAM).
- **Database Provisioning & Grants** - `database/terraform/database.tf` (managed Postgres), `database-grants/terraform/prod/main.tf` (schema fan-out), `database-grants/terraform/prod/modules/microservice_schema/main.tf` (reusable schema+roles module), `database-grants/terraform/prod/read-only-user.tf` (reporting role).
- **Kubernetes Workloads & Secrets** - `sealed-secrets/scripts/create-secret.sh` (secret entry point), Kustomize bases and overlays.
- **API Gateway & Ingress** - `api_gateway/ambassador-playbook.yml`, `Mapping` custom resources, `api_gateway/README.md`.
- **Identity & Access (Keycloak)** - `keycloak/lib/docker/Dockerfile`, `keycloak/lib/kubernetes/base/deployment.yaml`, `keycloak/lib/kubernetes/overlays/production/kustomization.yaml`.
- **Messaging & Workflow Orchestration** - `rabbitmq/deployment/base/definition.yaml`, `airflow/roles/airflow/tasks/main.yml` (Ansible install).
- **Search & Data Platform** - `solr/solr_chart/main.tf`, `ckan/roles/ckan/files/values.yaml`, `tag_lister/list_tags_for_deployments.py`.
- **Static Web Apps & Sites** - `web-apps/terraform/prod-web-map.tf`, `cdn-images-api/main.tf` (CloudFront).
- **Observability & Alerting** - `monitoring/roles/prometheus_operator/files/values.yaml`, `tracing/roles/simple_jaeger/files/jaeger-ui-mapping.yaml`.
- **Platform Ops, CI & Docs** - `scripts/README.md`, `.pre-commit-config.yaml`, `.github/workflows/pre-commit.yaml`, `database-backup-storage/production-backups.tf`.

## Complexity Hotspots

Most files are simple (461 simple, 42 moderate, 4 complex). Approach the four complex files carefully:

- **`database-grants/terraform/prod/read-only-user.tf`** - creates the read-only reporting role and grants SELECT/USAGE across every application schema (import, operations, token_management, treetracker, wallet, webmap, airflow, reporting, earnings, messaging, keycloak, denormalized), including default privileges for future objects.
- **`keycloak/lib/kubernetes/base/deployment-raw-client.yaml`** - Kubernetes Deployment for the Keycloak raw-client helper (Node.js), embedding an HTML client page and `RAW_CLIENT_URL` config.
- **`airflow/roles/airflow/tasks/main.yml`** - Ansible task list that adds the Helm repo, creates Kubernetes secrets for the database and admin/user/viewer accounts, installs the Airflow chart, and applies the control-panel UI mapping.
- **`monitoring/roles/prometheus_operator/files/values.yaml`** - Helm values for the kube-prometheus-stack: Prometheus Operator, Prometheus, Grafana, Alertmanager, node exporter, and control-plane monitoring.

The `database-grants/terraform/prod/main.tf` fan-out (fifteen per-microservice schemas via one module) and the shared managed Postgres cluster are the highest fan-in points in the graph. Changes there ripple widely; review them with care.

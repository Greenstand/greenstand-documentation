# The shared resources of the code repos

A shared resource is a thing that several code repos use and that no code repo owns, other than
treetracker-infrastructure. This page says what each shared resource is, how a code repo uses
it, and who looks after it. It shows today's state: each fact links to the file that proves it,
at the snapshot that these docs describe. For how the code repos call each other at run time,
see the [ecosystem maps](../ARCHITECTURE.md).

<!-- BEGIN shared resources at a glance: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Resource | Code repos that use it |
|---|---|
| [Container registry](#container-registry) | 9 (8 push, 9 pull) |
| [Clusters and deploys](#clusters-and-deploys) | 8 (8 deploy) |
| [Secrets in the cluster](#secrets-in-the-cluster) | 6 (6 read) |
| [API gateway and domains](#api-gateway-and-domains) | 7 (7 route) |
| [Web hosting and CDN](#web-hosting-and-cdn) | 3 (3 deploy) |
| [Photo and upload storage](#photo-and-upload-storage) | 2 (2 write) |
| [Shared database](#shared-database) | 6 (2 read, 4 write) |
| [Message broker](#message-broker) | 2 (2 publish, 1 consume) |
| [Sign-in](#sign-in) | 1 (1 sign&nbsp;in) |
| [Monitoring and logs](#monitoring-and-logs) | 0 |

<!-- END shared resources at a glance -->

## Container registry

The container registry stores the Docker images of the code repos that run in the Kubernetes
clusters. The images are in the `greenstand` namespace on Docker Hub.

### How a code repo uses it

When a change merges to a release branch, the build workflow of the code repo builds the image
and pushes it with the new version as its tag. The deploy step writes that tag into the
manifests, and the cluster pulls the image. A pull request does not push an image. You do not
need a Docker Hub login to work on a code repo.

<!-- BEGIN shared resource container-registry uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| images-api | push, pull | [build workflow](https://github.com/Greenstand/images-api/blob/9d761d1/.github/workflows/treetracker-api-build-deploy-dev.yml#L74-L84), [manifest](https://github.com/Greenstand/images-api/blob/9d761d1/deployment/base/deployment.yaml#L28) |
| treetracker-admin-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/.github/workflows/treetracker-admin-api-build-deploy.yml#L75-L84), [manifest](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/treetracker-admin-api-deployment.yaml#L28) |
| treetracker-airflow-dags | pull | [Airflow DAG&nbsp;1](https://github.com/Greenstand/treetracker-airflow-dags/blob/a537231/migrate_captures_dag.py#L63), [Airflow DAG&nbsp;2](https://github.com/Greenstand/treetracker-airflow-dags/blob/a537231/migrate_stakeholders_dag.py#L64) |
| treetracker-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-api/blob/85258c8/.github/workflows/treetracker-api-build-deploy-dev.yml#L104-L114), [manifest](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/deployment.yaml#L28) |
| treetracker-field-data | push, pull | [build workflow](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/.github/workflows/treetracker-api-build-deploy-dev.yml#L102-L112), [manifest](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/deployment/base/deployment.yaml#L28) |
| treetracker-query-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/.github/workflows/treetracker-query-api-build-deploy-dev.yml#L57-L67), [manifest](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/deployment/base/deployment.yaml#L29) |
| treetracker-tile-server | push, pull | [build workflow](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/.github/workflows/build-deploy.yml#L50-L59), [manifest](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/deployment/base/deployment.yaml#L39), [Dockerfile](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/Dockerfile#L1) |
| treetracker-wallet-api | push, pull | [build workflow](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/.github/workflows/treetracker-wallet-api-build-deploy-dev.yml#L53-L63), [manifest](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-deployment.yaml#L28) |
| treetracker-web-map-client | push, pull | [build workflow](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/.github/workflows/dev-build-release.yaml#L70-L90), [manifest](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/deployment/base/deployment.yaml#L29), [test workflow](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/.github/workflows/deploy-main-channel-to-test.yaml#L55) |

<!-- END shared resource container-registry uses -->

The names that you see in the workflows and the manifests:

<!-- BEGIN shared resource container-registry names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `DOCKERHUB_TOKEN` |
| Secret | `DOCKERHUB_USERNAME` |
| Image | `greenstand/domain-migration-scripts` |
| Image | `greenstand/images-api` |
| Image | `greenstand/tile-server-base` |
| Image | `greenstand/treetracker-admin-api` |
| Image | `greenstand/treetracker-api` |
| Image | `greenstand/treetracker-field-data` |
| Image | `greenstand/treetracker-map-tile-server` |
| Image | `greenstand/treetracker-query-api` |
| Image | `greenstand/treetracker-wallet-api` |
| Image | `greenstand/treetracker-web-map-client` |
| Image | `greenstand/treetracker-web-map-client-dev` |
| Image | `greenstand/treetracker-web-map-client-test` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-11-02).

<!-- END shared resource container-registry names -->

Notes:

- The image of treetracker-tile-server is `greenstand/treetracker-map-tile-server`, not the
  name of the repo.
- treetracker-web-map-client also pushes an image for its dev channel, and a manual workflow
  pushes one for its test channel. Docker Hub shows no public test image (checked 2026-10-23).
- The Dockerfile of treetracker-tile-server starts from `greenstand/tile-server-base`. No code
  repo builds that image.
- Two Airflow DAGs of treetracker-airflow-dags run jobs in the cluster from the image
  `greenstand/domain-migration-scripts`. No code repo of these docs builds that image.

### Who looks after it

No code repo and no Terraform file of the estate sets up the registry. The build workflows
read their Docker Hub credentials from the secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
For push access or a new image name, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Clusters and deploys

The code repos that run as services deploy into the Kubernetes clusters: one cluster for each
environment (development, test, and production). For the 4 ways that a code repo starts a
deploy, see the [platform map](../ARCHITECTURE.md#platform).

### How a code repo uses it

Each code repo keeps its Kubernetes manifests in `deployment/base`. It keeps one overlay for each
environment in `deployment/overlays`. A deploy uses the overlay of its environment. The code
repos use 2 of the 4 ways:

- A workflow applies the manifests to the cluster. treetracker-query-api,
  treetracker-tile-server, treetracker-wallet-api, and treetracker-web-map-client use this way.
  The workflow reads the cluster name and an access token from GitHub secrets.
- A workflow commits the new image tag to the overlay. Then a GitOps controller outside the
  estate applies the change. images-api, treetracker-admin-api, treetracker-api, and
  treetracker-field-data use this way.

<!-- BEGIN shared resource clusters-and-deploys uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| images-api | deploy | [deploy workflow](https://github.com/Greenstand/images-api/blob/9d761d1/.github/workflows/treetracker-api-deploy-prod.yml#L23-L24) |
| treetracker-admin-api | deploy | [deploy workflow](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/.github/workflows/treetracker-admin-api-deploy-prod.yml#L25-L26) |
| treetracker-api | deploy | [deploy workflow](https://github.com/Greenstand/treetracker-api/blob/85258c8/.github/workflows/treetracker-api-deploy-prod.yml#L23-L24) |
| treetracker-field-data | deploy | [deploy workflow](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/.github/workflows/treetracker-api-deploy-prod.yml#L23-L24) |
| treetracker-query-api | deploy | [build workflow](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/.github/workflows/treetracker-query-api-build-deploy-dev.yml#L100-L106), [deploy workflow&nbsp;1](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/.github/workflows/deploy-test-env.yml#L35-L39), [deploy workflow&nbsp;2](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/.github/workflows/deploy-prod-env.yml#L35-L39) |
| treetracker-tile-server | deploy | [build workflow](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/.github/workflows/build-deploy.yml#L102-L106), [deploy workflow](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/.github/workflows/deploy-prod.yml#L36-L40) |
| treetracker-wallet-api | deploy | [deploy workflow](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/.github/workflows/treetracker-wallet-api-deploy-prod.yml#L36-L42) |
| treetracker-web-map-client | deploy | [deploy workflow](https://github.com/Greenstand/treetracker-web-map-client/blob/42b3a9a/.github/workflows/deploy-main-channel-to-prod.yaml#L49-L55) |

<!-- END shared resource clusters-and-deploys uses -->

The names that you see in the workflows (each secret is a GitHub secret):

<!-- BEGIN shared resource clusters-and-deploys names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `DEV_CLUSTER_NAME` |
| Secret | `DEV_DIGITALOCEAN_TOKEN` |
| Secret | `DIGITALOCEAN_PRODUCTION_TOKEN` |
| Secret | `DIGITALOCEAN_TOKEN` |
| Secret | `K8S_NAMESPACE` |
| Secret | `PRODUCTION_CLUSTER_NAME` |
| Secret | `TEST_CLUSTER_NAME` |
| Secret | `TEST_DIGITALOCEAN_TOKEN` |
| Overlay | `deployment/overlays/development` |
| Overlay | `deployment/overlays/prod` |
| Overlay | `deployment/overlays/production` |
| Overlay | `deployment/overlays/test` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-11-02).

<!-- END shared resource clusters-and-deploys names -->

Notes:

- treetracker-query-api and treetracker-web-map-client call their production overlay `prod`.
  The other code repos call it `production`.
- treetracker-web-map-client also has the folders `deployment-alpha`, `deployment-beta`,
  `deployment-main`, and `deployment-next`. A manual workflow deploys a prerelease of the
  channel alpha from `deployment-alpha`, and a prerelease of the channel next from
  `deployment-next`. No workflow uses `deployment-beta` or `deployment-main` (checked
  2026-10-24).
- In treetracker-api, treetracker-field-data, and treetracker-wallet-api, the manifests also
  hold a job that runs the database migrations after each deploy.

### Who looks after it

treetracker-infrastructure sets up the clusters with Terraform. The workflows that apply the
manifests need the GitHub secrets in the table above.

- Not known yet: which repo holds the setup of the GitOps controller, and which clusters it
  watches.
- Not known yet: which of these GitHub secrets belong to the whole Greenstand organization, and
  which belong to one code repo.

For access to a cluster, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Secrets in the cluster

A Kubernetes Secret holds a value that a service reads at run time, for example the connection to
the shared database. The code repos keep these values in git only in a sealed (encrypted) form.

### How a code repo uses it

A writer encrypts the value with the public certificate of the SealedSecret controller of a
cluster. The code repo keeps the result as a `SealedSecret` manifest. In the cluster, the
SealedSecret controller makes a Kubernetes Secret from it. The service reads the Kubernetes
Secret. An overlay can replace the `SealedSecret` of the base with its own.

<!-- BEGIN shared resource secrets-in-the-cluster uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| treetracker-admin-api | read | [manifest&nbsp;1](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/database-connection-sealed-secret.yaml#L4), [manifest&nbsp;2](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/rabbitmq-sealedsecret.yaml#L4), [manifest&nbsp;3](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/treetracker-admin-api-jwt-sealed-secret.yaml#L4) |
| treetracker-api | read | [manifest&nbsp;1](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/database-connection-sealed-secret.yaml#L5), [manifest&nbsp;2](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/database-migration-connection-sealed-secret.yaml#L5), [manifest&nbsp;3](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/rabbitmq-connection-sealed-secret.yaml#L5) |
| treetracker-field-data | read | [manifest&nbsp;1](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/deployment/base/database-connection-sealed-secret.yaml#L4), [manifest&nbsp;2](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/deployment/base/database-migration-connection-sealed-secret.yaml#L5) |
| treetracker-query-api | read | [manifest](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/deployment/base/database-connection-sealed-secret.yaml#L5) |
| treetracker-tile-server | read | [manifest](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/deployment/base/database-connection-sealed-secret.yaml#L5) |
| treetracker-wallet-api | read | [manifest](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-deployment.yaml#L35-L55) |

<!-- END shared resource secrets-in-the-cluster uses -->

The names that you see in the manifests (each secret is a Kubernetes Secret):

<!-- BEGIN shared resource secrets-in-the-cluster names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `aws-s3` |
| Secret | `database-connection` |
| Secret | `database-migration-connection` |
| Secret | `query-api-database-connection` |
| Secret | `rabbitmq-connection` |
| Secret | `treetracker-api-database-connection` |
| Secret | `treetracker-api-jwt` |
| Secret | `treetracker-rabbitmq-connection` |
| Secret | `treetracker-wallet-jwt-keys` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-11-02).

<!-- END shared resource secrets-in-the-cluster names -->

Notes:

- A Kubernetes Secret belongs to the namespace of its service. Thus the Kubernetes Secret
  `database-connection` of one code repo is not the Kubernetes Secret `database-connection` of
  another code repo.
- treetracker-api and treetracker-field-data have a second Kubernetes Secret for the database,
  `database-migration-connection`. Their migration job reads it.

### Who looks after it

treetracker-infrastructure installs the SealedSecret controller in each cluster. To seal a new
value, you need the public certificate of the SealedSecret controller of that cluster.
treetracker-wallet-api holds no `SealedSecret` for its 3 Kubernetes Secrets (checked
2026-10-24).

- Not known yet: how these Kubernetes Secrets get into the cluster.

For the certificate, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## API gateway and domains

The API gateway takes each request for an API and sends it to the service in the cluster. Each
environment has its own host name for the gateway. For the place of the gateway, see the
[platform map](../ARCHITECTURE.md#platform).

### How a code repo uses it

A code repo that serves an API adds a route to the gateway: a `Mapping` manifest with a path
prefix. The gateway sends each request whose path starts with the prefix to the service of the
code repo. It removes the prefix first. The web apps, the Android app, and the Airflow DAGs call
the APIs through the gateway.

<!-- BEGIN shared resource api-gateway-and-domains uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| images-api | route | [manifest](https://github.com/Greenstand/images-api/blob/9d761d1/deployment/base/mapping.yaml#L6) |
| treetracker-admin-api | route | [manifest](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/treetracker-admin-api-mapping.yaml#L6) |
| treetracker-api | route | [manifest](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/mapping.yaml#L6) |
| treetracker-field-data | route | [manifest](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/deployment/base/mapping.yaml#L6) |
| treetracker-query-api | route | [manifest](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/deployment/base/mapping.yaml#L7) |
| treetracker-tile-server | route | [manifest](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/deployment/base/mapping.yaml#L6) |
| treetracker-wallet-api | route | [manifest](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-mapping.yaml#L6) |

<!-- END shared resource api-gateway-and-domains uses -->

The names that you see in the manifests:

<!-- BEGIN shared resource api-gateway-and-domains names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Route | `/api/admin/` |
| Route | `/field-data/` |
| Route | `/images/` |
| Route | `/query/` |
| Route | `/tiles/` |
| Route | `/treetracker/` |
| Route | `/wallet/v2/` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-11-02).

<!-- END shared resource api-gateway-and-domains names -->

Notes:

- treetracker-web-map-client has the route `/` on a host name of its own.

### Who looks after it

treetracker-infrastructure runs the gateway. It sets up the DNS records of the host names of the
gateway with Terraform. For a new host name or a change to the gateway, ask in Greenstand's Slack
([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Web hosting and CDN

Static hosting serves the web apps of treetracker-admin-client, treetracker-wallet-admin-client,
and treetracker-wallet-app: the browser gets the files of the app from a CDN. The files are in
AWS S3 buckets, and AWS CloudFront is the CDN.

### How a code repo uses it

The workflow that deploys a web app builds the app. Then it copies the files to the bucket of
the environment (`aws s3 sync`). Then it clears the cache of the CDN
(`aws cloudfront create-invalidation`). The workflow reads the bucket, the CDN distribution, and
the AWS key from GitHub secrets. Each environment and each channel has its own GitHub secrets.

<!-- BEGIN shared resource web-hosting-and-cdn uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| treetracker-admin-client | deploy | [deploy workflow](https://github.com/Greenstand/treetracker-admin-client/blob/ecbfe05/.github/workflows/deploy.yaml#L46-L63) |
| treetracker-wallet-admin-client | deploy | [build workflow](https://github.com/Greenstand/treetracker-wallet-admin-client/blob/62a60f3/.github/workflows/build-release.yaml#L148-L149), [deploy workflow&nbsp;1](https://github.com/Greenstand/treetracker-wallet-admin-client/blob/62a60f3/.github/workflows/deploy.yaml#L46-L59), [deploy workflow&nbsp;2](https://github.com/Greenstand/treetracker-wallet-admin-client/blob/62a60f3/.github/workflows/deploy.yaml#L152-L153) |
| treetracker-wallet-app | deploy | [deploy workflow&nbsp;1](https://github.com/Greenstand/treetracker-wallet-app/blob/3c14113/.github/workflows/static-website-deploy-dev.yml#L86-L96), [deploy workflow&nbsp;2](https://github.com/Greenstand/treetracker-wallet-app/blob/3c14113/.github/workflows/ci-cd-deploy-web-test.yml#L12-L13), [deploy workflow&nbsp;3](https://github.com/Greenstand/treetracker-wallet-app/blob/3c14113/.github/workflows/ci-cd-deploy-web-prod.yml#L12-L13) |

<!-- END shared resource web-hosting-and-cdn uses -->

The names that you see in the workflows (each secret is a GitHub secret):

<!-- BEGIN shared resource web-hosting-and-cdn names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `AWS_ACCESS_KEY_ID` |
| Secret | `AWS_KEY_ID_DEV` |
| Secret | `AWS_KEY_ID_PROD` |
| Secret | `AWS_SECRET_ACCESS_KEY` |
| Secret | `AWS_SECRET_DEV` |
| Secret | `AWS_SECRET_PROD` |
| Secret | `DEV_ALPHA_CDN_DISTRIBUTION_ID` |
| Secret | `DEV_ALPHA_CDN_S3_BUCKET` |
| Secret | `DEV_CDN_DISTRIBUTION_ID` |
| Secret | `DEV_CDN_DISTRIBUTION_ID_FREETOWN` |
| Secret | `DEV_CDN_S3_BUCKET` |
| Secret | `DEV_CDN_S3_BUCKET_FREETOWN` |
| Secret | `DEV_STAGING_CDN_DISTRIBUTION_ID` |
| Secret | `DEV_STAGING_CDN_S3_BUCKET` |
| Secret | `PROD_ALPHA_CDN_DISTRIBUTION_ID` |
| Secret | `PROD_ALPHA_CDN_S3_BUCKET` |
| Secret | `PROD_CDN_DISTRIBUTION_ID` |
| Secret | `PROD_CDN_DISTRIBUTION_ID_FREETOWN` |
| Secret | `PROD_CDN_S3_BUCKET` |
| Secret | `PROD_CDN_S3_BUCKET_FREETOWN` |
| Secret | `STAGING_CDN_DISTRIBUTION_ID` |
| Secret | `STAGING_CDN_S3_BUCKET` |
| Secret | `TEST_CDN_DISTRIBUTION_ID` |
| Secret | `TEST_CDN_S3_BUCKET` |
| Secret | `TEST_STAGING_CDN_DISTRIBUTION_ID` |
| Secret | `TEST_STAGING_CDN_S3_BUCKET` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-03 to 2026-10-17).

<!-- END shared resource web-hosting-and-cdn names -->

Notes:

- treetracker-admin-client and treetracker-wallet-admin-client choose the GitHub secrets by
  channel and environment, in a table in the workflow.
- treetracker-infrastructure also runs a CDN in front of images-api.
- In production, the web map loads its map tiles from tile hosts.

### Who looks after it

treetracker-infrastructure sets up 4 static sites of treetracker-admin-client with Terraform:
development, test, staging, and production. It sets up the development static site of
treetracker-wallet-app with Terraform, and the test and production static sites with
CloudFormation. The workflows that deploy the web apps need the GitHub secrets in the table
above.

- Not known yet: what sets up the static sites of the channels alpha, beta, and freetown of
  treetracker-admin-client.
- Not known yet: what sets up the static sites of treetracker-wallet-admin-client.
- Not known yet: which of these GitHub secrets belong to the whole Greenstand organization, and
  which belong to one code repo.
- Not known yet: what serves the tile hosts of the web map.

For access to a bucket or for a new static site, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Photo and upload storage

The photo and upload storage keeps the photos of the captures, other images of the apps, and
the batch uploads of the Android app. The files are in AWS S3 buckets.

### How a code repo uses it

A code repo that writes to the storage uploads each file with an AWS client library. Some other
code repos keep or show the web address of a photo. These code repos do not write to the
storage (checked 2026-10-24).

<!-- BEGIN shared resource photo-and-upload-storage uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| treetracker-android | write | [build workflow](https://github.com/Greenstand/treetracker-android/blob/949d962/.github/workflows/build.yml#L48-L50) |
| treetracker-wallet-api | write | [manifest](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-deployment.yaml#L52-L70) |

<!-- END shared resource photo-and-upload-storage uses -->

The names that you see in the workflow and the manifest (each secret is a GitHub secret, except
the Kubernetes Secret `aws-s3`):

<!-- BEGIN shared resource photo-and-upload-storage names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `S3_DEV_IDENTITY_POOL_ID` |
| Secret | `S3_PRODUCTION_IDENTITY_POOL_ID` |
| Secret | `S3_TEST_IDENTITY_POOL_ID` |
| Secret | `aws-s3` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-03).

<!-- END shared resource photo-and-upload-storage names -->

Notes:

- The Android app uploads each photo and each batch upload from the phone. The build workflow
  puts the storage settings from the GitHub secrets into the app.
- treetracker-wallet-api uploads the logo and the cover image of a wallet.
- treetracker-api also has code that uploads the image of a grower account. No manifest of
  treetracker-api sets the storage settings for it (checked 2026-10-24).

### Who looks after it

treetracker-infrastructure gives AWS users access to the storage with Terraform. No Terraform
file of the estate sets up the buckets (checked 2026-10-24).

treetracker-infrastructure also gives one AWS user in each environment read access to the batch
uploads.

- Not known yet: what sets up the buckets and the identity pools of the Android app.
- Not known yet: which system reads the batch uploads with these AWS users.

For access to the storage, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Shared database

Several code repos share one PostgreSQL database. For the place of the database, see the
[platform map](../ARCHITECTURE.md#platform). For which code repos read the
data of other code repos, see the [shared database map](../ARCHITECTURE.md#shared-database).

### How a code repo uses it

A service reads the connection to the database from a Kubernetes Secret (see
[Secrets in the cluster](#secrets-in-the-cluster)). treetracker-api, treetracker-field-data, and
treetracker-wallet-api each write to a schema of their own. The migration job of each of the 3
runs the migration tool db-migrate (see [Clusters and deploys](#clusters-and-deploys)).

<!-- BEGIN shared resource shared-database uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| treetracker-admin-api | write | [manifest](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/deployment/base/treetracker-admin-api-deployment.yaml#L37-L41) |
| treetracker-api | write | [manifest&nbsp;1](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/deployment.yaml#L32-L38), [manifest&nbsp;2](https://github.com/Greenstand/treetracker-api/blob/85258c8/deployment/base/database-migration-job.yaml#L25-L29) |
| treetracker-field-data | write | [manifest&nbsp;1](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/deployment/base/deployment.yaml#L32-L38), [manifest&nbsp;2](https://github.com/Greenstand/treetracker-field-data/blob/8ffb53c/deployment/base/database-migration-job.yaml#L25-L29) |
| treetracker-query-api | read | [manifest](https://github.com/Greenstand/treetracker-query-api/blob/42897d6/deployment/base/deployment.yaml#L33-L37) |
| treetracker-tile-server | read | [manifest](https://github.com/Greenstand/treetracker-tile-server/blob/b619c05/deployment/base/deployment.yaml#L57-L61) |
| treetracker-wallet-api | write | [manifest&nbsp;1](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-deployment.yaml#L42-L51), [manifest&nbsp;2](https://github.com/Greenstand/treetracker-wallet-api/blob/e95c15a/deployment/base/treetracker-wallet-api-db-migration-job.yaml#L25-L31) |

<!-- END shared resource shared-database uses -->

The names that you see in the manifests (each secret is a Kubernetes Secret):

<!-- BEGIN shared resource shared-database names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Secret | `database-connection` |
| Secret | `database-migration-connection` |
| Secret | `query-api-database-connection` |
| Secret | `treetracker-api-database-connection` |
| Schema | `field_data` |
| Schema | `treetracker` |
| Schema | `wallet` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-11-02).

<!-- END shared resource shared-database names -->

Notes:

- A code repo with the use "write" also reads the database.
- treetracker-admin-api, treetracker-query-api, and treetracker-tile-server set no schema in
  their manifests (checked 2026-10-24).
- treetracker-wallet-api reads its schema from the Kubernetes Secret. Its migration job adds
  the schema `wallet` to the connection.
- The Airflow DAGs of treetracker-airflow-dags also read and write the database. They get the
  connection from Airflow, not from a Kubernetes Secret.

### Who looks after it

treetracker-infrastructure sets up the database with Terraform. It also sets up the schemas
and the database roles with Terraform. For a new schema or for access to the database, ask in
Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Message broker

The message broker carries events between services. The broker is RabbitMQ. For
the place of the broker, see the [platform map](../ARCHITECTURE.md#platform).

### How a code repo uses it

A code repo names its queues and exchanges in a source file. A service publishes a message to
a queue or an exchange, and another service consumes it. The service reads the connection to
the broker from a Kubernetes Secret (see [Secrets in the cluster](#secrets-in-the-cluster)).

<!-- BEGIN shared resource message-broker uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| treetracker-admin-api | publish | [source file](https://github.com/Greenstand/treetracker-admin-api/blob/1f25d3e/src/messaging/config.js#L11-L17) |
| treetracker-api | publish, consume | [source file&nbsp;1](https://github.com/Greenstand/treetracker-api/blob/85258c8/server/infra/RabbitMQ/config/index.js#L2-L30), [source file&nbsp;2](https://github.com/Greenstand/treetracker-api/blob/85258c8/server/infra/RabbitMQ/config/index.js#L4-L36) |

<!-- END shared resource message-broker uses -->

The names that you see in the source files:

<!-- BEGIN shared resource message-broker names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Queue | `admin-verifications` |
| Queue | `capture-created` |
| Queue | `raw-capture-rejected` |
| Queue | `tree-created` |

Each fact was checked at the snapshot of its code repo (generated 2026-09-02 to 2026-09-03).

<!-- END shared resource message-broker names -->

Notes:

- treetracker-api publishes `capture-created` and consumes `raw-capture-rejected`. No other
  code repo of the estate uses these 2 queues (checked 2026-11-03).
- `admin-verifications` is an exchange, not a queue. The names table shows an exchange with the
  kind "Queue".
- treetracker-admin-api publishes to `admin-verifications` only in the development environment.
  Its base manifest turns the publishing off, and only its development overlay turns it on
  (checked 2026-10-24).
- No code repo of the estate consumes `tree-created` or the messages of `admin-verifications`
  (checked 2026-10-24).

### Who looks after it

treetracker-infrastructure runs RabbitMQ in each cluster, with the RabbitMQ cluster operator.
The broker client of a code repo creates the queues and the exchanges of its source file when it
connects.

- Not known yet: whether a system outside the estate consumes these messages.

For access to the broker, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Sign-in

The sign-in server holds user accounts and signs users in. The server is Keycloak. For the place
of the server, see the [platform map](../ARCHITECTURE.md#platform).

### How a code repo uses it

A web app sends the user to the sign-in server and receives a token. The deploy workflow of the
web app writes the address of the server, the realm, and the client into an `.env` file before
the build.

<!-- BEGIN shared resource sign-in uses: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Code repo | Use | Evidence |
|---|---|---|
| treetracker-wallet-app | sign&nbsp;in | [deploy workflow&nbsp;1](https://github.com/Greenstand/treetracker-wallet-app/blob/3c14113/.github/workflows/static-website-deploy-dev.yml#L48), [deploy workflow&nbsp;2](https://github.com/Greenstand/treetracker-wallet-app/blob/3c14113/.github/workflows/ci-cd-deploy-web-prod.yml#L43) |

<!-- END shared resource sign-in uses -->

The names that you see in the workflows:

<!-- BEGIN shared resource sign-in names: built by .github/scripts/build-shared-resources.mjs from shared-resources.json. Do not edit. -->

| Kind | Name |
|---|---|
| Realm | `treetracker` |

Each fact was checked at the snapshot of its code repo (generated 2026-10-17).

<!-- END shared resource sign-in names -->

Notes:

- The workflow that deploys the test static site of treetracker-wallet-app writes no sign-in
  settings (checked 2026-10-24).

### Who looks after it

treetracker-infrastructure runs Keycloak in each cluster. For a new client or a test account,
ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

## Monitoring and logs

The monitoring and the logs show the state of the services in the clusters. This section is for
maintainers.

### How a code repo uses it

No code repo sets up metrics, traces, or logs of its own (checked 2026-10-24).

### Who looks after it

treetracker-infrastructure holds the Ansible playbooks that install the tools for metrics, logs,
and traces in a cluster. It also sets up a monitoring server with Terraform.

- Not known yet: which of these tools run in each cluster today.

For access to the tools, ask in Greenstand's Slack ([Slack basics](https://github.com/Greenstand/Greenstand-Overview#slack-basics)).

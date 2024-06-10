---
description: The Greenstand tree tracking and impact trading tools are build as Open Source Products. To develop and operate the infrastructure as a service, Greenstand uses the following resources, technology, language and tools.

## Overview 
---
Greenstand's development revolves around technology to collect, verify, and trade claims for environmental and social impact. 

The primary Technology is comprised of:
- Mobile apps (iOS and Android) for field data collection. These Treetracker apps allow planters to verify tree planting and tree survival with geo-tagged, time-stamped images. 
- A data pipeline and and database for field data ingestion
- A data analysis pipeline including: Admin panel for aging Tree capture details and user management, machine learning data analysis, and script based data analysis. Tree images and data points are analyzed using the treetracker-admin-client.
- A web map, the treetracker-web-map-client, at Treetracker.org displays trees and can be embedded on partner websites, allowing the partner’s clients to see their planted and mapped trees. 
- A wallet System and Tools for trading the Greenstand Impact tokens. Using a secure wallet and wallet-api system users create/register wallets and transfer tokens. Each Greenstand Impact Token is based on a verified ecological impact, such as growing trees.
- A Digital Herbarium
- API's for token transfers, data exports etc. 

# Technical Details
 
## Cloud Resources
Greenstand has been built primarily on [Digital Ocean (DO)](https://www.digitalocean.com/) and continues to heavily rely on DO's services. 
The 
| Cloud Resources On Digital Ocean| Description                       |
| ---------- | --------------------------------- |
| Digital Ocean Droplet| 4gb Production Core Service              |
| Digital Ocean Droplet| 1gb Production Bastion  |
| Digital Ocean Snapshot | Snap Shots of all could services |
| Digital Ocean Database Cluster | Five Postgresql for Primary, Secondary, and Read Only Nodes|
| Kubernetes Clusters | Production K8s|
| Spaces| 250GB & 1TB Bandwidth|
| DNS| Digital Ocean Domain Name Services|

| Cloud Resources On AWS| Description                       |
|----------|---------------------|
|S3 Bucket| S3 Cloud Storage |
| EC2 | Elastic Compute Cloud | 
| Sage Maker | Machine Learning| 


## General

| Tool       | Description                       |
| ---------- | --------------------------------- |
| NodeJS     | scripts and server-side framework |
| JavaScript | programming language              |
| TypeScript | programming language              |
| Python     | programming language              |
| C++        | programming language              |
| Swift      | programming language              |
| Kotlin     | programming language              |
| HCL        | configuration language            |

## Frontend

| Tool      | Description                                                |
| --------- | ---------------------------------------------------------- |
| React     | UI framework                                               |
| NextJS    | front-end framework with routing and server side rendering |
| Storybook | develop and document React components in isolation         |
| Cypress   | automated browser testing tool                             |

## Backend

| Tool      | Description                      |
| --------- | -------------------------------- |
| ExpressJS | server-side framework for NodeJS |

## Code quality and Testing

| Tool     | Description                 |
| -------- | --------------------------- |
| Jest     | automated testing tool      |
| ESLint   | code linter                 |
| Prettier | code formatter              |
| husky    | manage pre-commit git hooks |

## Protocols and specifications

| Tool    | Description                         |
| ------- | ----------------------------------- |
| OpenAPI | specification to describe rest apis |


## Database

| Tool       | Description  |
| ---------- | ------------ |
| PostgreSQL | SQL database |


## Infrastructure

|            |                                                                      |
| ---------- | -------------------------------------------------------------------- |
| Docker     | virtual machine containers for continuous integration and deployment |
| Kubernetes | host docker containers in production                                 |
| Airflow    |                                                                      |
| Terraform  |                                                                      |

---
description: >-
  This document holds the design information about the contract module in the
  admin panel
---

# Initial Notes & Reqs

In the context of Freetown there are contracts between the FCC (**F**reetown **C**ity **C**ouncil) or EFA (**E**nvironment **F**or **A**frica which is the main contractor of the project) and the CBOs (**C**ommunity **B**ased **O**rganizations). Other possible contracts are between CBOs and planters or EFA to Nurseries.

### Requirements

#### Statistic View inclusion

As per UX design in [Dashboard Statistic View](https://app.gitbook.com/@greenstand/s/admin-panel/freetown-phase-2-admin-panel/dashboard-statistic-view) document the contract becomes part of the general stats to accumulate planter and tree capture information&#x20;

#### Contract create, list, details and edit

Requirement to create, edit, list and view details of the contract

**List view**: [https://www.figma.com/file/51iWcFythyfxrP4p4jd5rL/Admin-Panel?node-id=4%3A21](https://www.figma.com/file/51iWcFythyfxrP4p4jd5rL/Admin-Panel?node-id=4%3A21)

List view columns: Contract ID, Type, Organization (contract with), Contractor, Amount of trees, Status

**Detail view** [https://www.figma.com/file/51iWcFythyfxrP4p4jd5rL/Admin-Panel?node-id=767%3A633](https://www.figma.com/file/51iWcFythyfxrP4p4jd5rL/Admin-Panel?node-id=767%3A633)

Contract Attributes in detail view

* ID (contract number)
* Organization name&#x20;
* Beneficiary name
* \# trees -> agreed amount of total trees and number of already approved trees
* \# planters ->&#x20;
* Status (planned, active, under review, closed or finalized, suspended)
* Last modified or last activity&#x20;
* Type → there can be several types of contracts, CBO (org), Nursery (company or org) and possibly planter (individual)
* Attach signed PDF contract file (per planter)
* Payment thresholds
  * Weekly Consolidation (m1) vs Weekly Threshold Consolidation (m2)

**Domain Model**  - Planter management requirements: With the contract module we need to be able to include one or more planter in a contract. In the future there will be no longer a direct association between the planter/grower and an organization. This will be done through _contract_

_contract template_ vs _contract (instantiation)_

default contract - change in the mobile application

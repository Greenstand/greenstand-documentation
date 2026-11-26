---
description: Admin Panel workflows, version boundaries and current development references.
---

# Overview

## About the Admin Panel

The Admin Panel helps Greenstand and partner organizations review captures and manage growers, species, organizations and related workflows. Available screens depend on the deployed version and the signed-in user's permissions.

## Current development status — 26 November 2026

There are three distinct layers of work. Do not treat a local dev build or an open PR as a production release.

- Existing panel: retains legacy Captures/export, matching and wallet service contracts where those screens have not been migrated.
- Keycloak work: login and organization binding use Keycloak. Approving the current admin binding request assigns an organization claim and the org role; it does not grant organization-administrator rights or approve a grower's Android enrollment.
- Proposed NDM integration: client PR #1315 and API PR #699 add organization-scoped views over Stakeholder, Herbarium, Field Data, Treetracker and Contracts. Both remain open proposals as of this review.

Sources: https://github.com/Greenstand/treetracker-admin-client/pull/1315 and https://github.com/Greenstand/treetracker-admin-api/pull/699

## Views in the NDM integration

Projects support search, sorting, add/edit, geography, image URLs and separate tree/capture targets. Growers show account details, projects and sessions, with audited organization transfers. Tracking sessions provide counts, duration, map previews, recorded area and audited project corrections.

Verify supports session-based review, approval/rejection, organization-scoped tags and the effective project/organization species selection. Capture approval and matching a capture to a tree are separate operations; matching event publication remains a dependency.

Species allocation follows project, organization and default scopes. A saved empty custom list remains empty. Herbarium stores the eight-letter name separately from the full Latin name, common names and scoped local names.

Organization users have scoped permissions. Subscription screens show Stripe tiers and NDM usage, and open hosted billing. Complete quota/access enforcement is not implemented. Contract creation, signing and payouts are not provided by the new read views.

The legacy Captures/export and org-binding lookup have not yet been fully migrated to the NDM. See the remaining-work inventory: https://github.com/Greenstand/treetracker-admin-client/issues/1316

## Data ownership and offline collection

ADR 0024 proposes separate admin memberships, grower memberships, billing and session ownership. Android project selection should remain usable offline; an intended QR destination is not proof of membership, and unassigned sessions can be retained for later allocation. This remains proposed policy, not a released Android feature.

https://github.com/Greenstand/treetracker-decisions/pull/35

## Access and environments

Use the login method and environment configured by the current repository/deployment. The Keycloak development panel used for the integration is https://dev-beta-admin.treetracker.org. Confirm test, staging and production URLs with the deployment owner; older dev-admin/test-admin URLs may refer to another generation of the panel.

Request an individual account and the required role through the responsible maintainer. Server-side Keycloak directory credentials are separate from a human's admin role. Keep passwords, Stripe keys, database connection strings and service-account secrets out of documentation.

## Collaboration

Use the Admin Panel GitHub repositories and the #admin_panel and #engineering Slack channels for questions, review and progress. Recurring team-meeting schedules have been removed because those meetings are not running. Current maintainers and ownership should be checked in GitHub rather than inferred from an old team roster.

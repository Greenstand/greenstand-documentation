---
description: Admin User Roles and Policies
---

# User Permissions

>
>
> ### Keycloak and NDM permissions — 27 November 2026
>
> This section describes the Keycloak administration flow and the development implementation in [API PR #699](https://github.com/Greenstand/treetracker-admin-api/pull/699) and [client PR #1315](https://github.com/Greenstand/treetracker-admin-client/pull/1315). Both PRs remain open. Their behavior must not be presented as fully deployed production authorization. The database-role instructions below are a legacy reference.
>
> #### Identity, organization access and billing are different
>
> Keycloak authenticates the person. Organization membership limits which organization's data they can access. Roles and scoped capabilities determine what they can do. Stripe supplies subscription state; a subscriber role alone is not an organization-administrator grant. A grower's mobile registration is also separate from an administrator's login.
>
> #### Organization scope and identifiers
>
> The development API maps the numeric Keycloak organization\_id claim through stakeholder.stakeholder.entity\_id to exactly one active organization record. Its stakeholder.stakeholder.id is the canonical UUID for NDM references. The numeric compatibility ID is not interchangeable with the UUID. Organization name is a display label, not an authorization key.
>
> The API checks scope on the server. An organization user cannot change an organization filter to gain access to another organization. Missing, ambiguous or inactive mappings must fail rather than return unscoped data. Platform users still need an explicit organization for operations that require one.
>
> #### Scoped capabilities in the development API
>
> Scoped grants are stored in stakeholder.organization\_user by organization UUID and Keycloak user UUID. The current implementation grants all five capabilities to greenstand-admin and org-admin-saas. Other approved members use their stored grants or the verify\_captures fallback. Member edits require manage\_members, check approved membership, preserve administrator capabilities and reject stale edits. These rules are implementation behavior under review, not a claim that all legacy endpoints enforce the same grants.
>
> #### Binding and account changes
>
> The existing administrator binding workflow uses organization\_binding\_request. Approval sets the approved organization\_id and the org role. It does not automatically assign org-admin-saas, establish a grower's project membership, or purchase a subscription. Administrator appointment must be a separate authorized action.
>
> Changing a Keycloak organization attribute does not by itself move historic captures, transfer a grower or reassign sessions. Use the relevant audited domain operation. Existing login tokens may retain previous claims until refreshed or replaced; confirm the claim in a newly issued token when checking a membership change.
>
> #### Directory access and failure behavior
>
> The Users directory needs server-side KEYCLOAK\_ADMIN\_ID and KEYCLOAK\_ADMIN\_CLIENT\_SECRET with the required user and realm-role membership read permissions. Keep credentials on the server. A directory permission failure should be shown as an error, not an empty user list. Distinguish unauthenticated access (401) from authenticated access without the required role, scope or capability (403); an upstream failure is not evidence that no users exist.
>
> Source: [API PR #699](https://github.com/Greenstand/treetracker-admin-api/pull/699). The implementation references are src/domain/service.ts, src/domain/members.ts and src/services/keycloakAdminService.ts in the PR files. [ADR 0024 / PR #35](https://github.com/Greenstand/treetracker-decisions/pull/35) proposes the longer-term separation of memberships, subscriptions and session ownership; it remains proposed.
>
> ### Legacy database roles — historical reference
>
> The following public.admin\_user / public.admin\_role description applies to the older panel authorization model. Do not create or copy these rows to provision Keycloak users or NDM organization membership. Retained policies and diagrams document legacy behavior only.
>
> ## User Permissions
>
> ### Introduction
>
> User access to tools and resources within the Admin Panel is governed by the admin user permissions system.
>
> ### Concepts
>
> #### User
>
> A person who logs in to the Admin Panel to view or manage captures, growers, stakeholders or other admin users.
>
> Users are created and managed in the User Manager tool in the Admin Panel by users with the \_Admin\_ role (`manage_user` policy).
>
> Database table: `public/admin_user`
>
> #### Role
>
> A logical collection of policies that describes a common use case in the Admin Panel, with and optional `organization` value that restricts the user to only those tools and resources allocated to that organization. Greenstand operator roles that have access to \_all\_ data do not have an `organization` value set.
>
> A user can have one or more roles, but all roles must be for the same organization. Roles are assigned by an Admin in the User Manager tool.
>
> New roles are currently created manually in the database by the operations team. The most common use case is when a new organization is onboarded onto the tool, and is typically done by copying an equivalent existing role for another organization.
>
> Database table: `public.admin_role`
>
> #### Policy
>
> A policy relates to a restricted function in the Admin Panel. A user can only access that function if they have the associated policy in one of the roles assigned to them.
>
> Defined in a JSON object within each role in `public.admin_role`
>
> The table below lists the policies supported by the Admin Panel:
>
> ### Data Structure
>
> #### Database Tables
>
> [Legacy database diagram](https://drive.google.com/file/d/1qmH7xQfoFy3MPcoEbp-Mp_yRTGJp8DT_/view?usp=drive_link)
>
> #### admin\_role policy Schema
>
> ```
> policy: {
>   policies: [{
>     name: string,
>     description: string
>   }],
>   organization: {
>     id: number,
>     name: string
>   }
> }
> ```
>
> Below is a sample organization role:
>
> ```
> id: 1,
> description: Trees-R-Us Manager
> policy: {
>   "policies": [{
>     "name": "list_tree",
>     "description": "Can view trees"
>   }, {
>     "name": "approve_tree",
>     "description": "Can approve/reject trees"
>   }, {
>     "name": "list_planter",
>     "description": "Can view planters"
>   }, {
>     "name": "manage_planter",
>     "description": "Can modify planter information"
>   }],
>   "organization": {
>     "id": 1,
>     "name": "trees-r-us"
>   }
> },
> active: true,
> created_at: 2021-12-24 17:21:05.123
> identifier: 24f2b38e-575c-4e01-9d7c-1d0ab45b7bc7
> ```

| Role or permission                     | Meaning in the development integration                                                                                                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| greenstand-admin                       | Platform administrator. Can select organization scope and access platform administration. This is not required for an ordinary organization user.                                                                          |
| org                                    | Approved organization access. Requires a resolvable organization claim. Without an explicit scoped grant record, the development API defaults to verify\_captures; do not infer project, member or billing administration. |
| org-admin-saas                         | Organization administrator capabilities within the user's resolved organization. Does not grant cross-organization platform administration.                                                                                |
| subscriber\_seed / root / base / crown | Subscription tier indicators. Do not use these alone to assign membership or administrator status. Complete quota and subscription-access enforcement remains separate work.                                               |
| Backend service account                | A server identity with separately assigned Keycloak Admin API permissions. A human's greenstand-admin role does not supply these credentials or permissions.                                                               |

| Capability       | Purpose                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------ |
| verify\_captures | Review and approve/reject captures through the NDM verification routes.                    |
| manage\_projects | Manage project configuration and applicable assignments.                                   |
| manage\_species  | Manage the organization's or project's species allocation.                                 |
| view\_contracts  | Read authorized contract information; this does not implement contract signing or payouts. |
| manage\_members  | Manage scoped grants for existing approved organization members.                           |

| Name                 | Description                        |
| -------------------- | ---------------------------------- |
| super\_permission    | Can do anything                    |
| list\_user           | Can view admin users               |
| manage\_user         | Can create/modify admin user       |
| list\_tree           | Can view trees                     |
| approve\_tree        | Can approve/reject trees           |
| list\_planter        | Can view planters                  |
| manage\_planter      | Can modify planter information     |
| list\_earnings       | Can view earnings                  |
| manage\_earnings     | Can modify/export earnings         |
| list\_payments       | Can view payments                  |
| manage\_payments     | Can import/modify payments         |
| send\_messages       | Can send and view messages         |
| list\_species        | Can view species information       |
| manage\_species      | Can modify species information     |
| list\_stakeholders   | Can view stakeholders              |
| manage\_stakeholders | Can modify stakeholder information |

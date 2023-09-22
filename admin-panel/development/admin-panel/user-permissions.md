---
description: Admin User Roles and Policies
---

# User Permissions

## Introduction

User access to tools and resources within the Admin Panel is governed by the admin user permissions system.

## Concepts

### User

A person who logs in to the Admin Panel to view or manage captures, growers, stakeholders or other admin users.

Users are created and managed in the User Manager tool in the Admin Panel by users with the _Admin_ [role](user-permissions.md#role) (`manage_user` policy).

Database table: `public/admin_user`

### Role

A logical collection of [policies](user-permissions.md#policy) that describes a common use case in the Admin Panel, with and optional `organization` value that restricts the [user](user-permissions.md#user) to only those tools and resources allocated to that organization. Greenstand operator roles that have access to _all_ data do not have an `organization` value set.

A [user](user-permissions.md#user) can have one or more roles, but all roles must be for the same organization. Roles are assigned by an Admin in the User Manager tool.

New roles are currently created manually in the database by the operations team. The most common use case is when a new organization is onboarded onto the tool, and is typically done by copying an equivalent existing role for another organization.

Database table: `public.admin_role`

### Policy

A policy relates to a restricted function in the Admin Panel. A [user](user-permissions.md#user) can only access that function if they have the associated policy in one of the [roles](user-permissions.md#role) assigned to them.

Defined in a JSON object within each role in `public.admin_role`

The table below lists the policies supported by the Admin Panel:

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

## Data Structure

### Database Tables

{% embed url="https://drive.google.com/file/d/1qmH7xQfoFy3MPcoEbp-Mp_yRTGJp8DT_/view?usp=drive_link" %}

### admin\_role policy Schema

```
policy: {
  policies: [{
    name: string,
    description: string
  }],
  organization: {
    id: number,
    name: string
  }
}
```

Below is a sample organization role:

```
id: 1,
description: Trees-R-Us Manager
policy: {
  "policies": [{
    "name": "list_tree",
    "description": "Can view trees"
  }, {
    "name": "approve_tree",
    "description": "Can approve/reject trees"
  }, {
    "name": "list_planter",
    "description": "Can view planters"
  }, {
    "name": "manage_planter",
    "description": "Can modify planter information"
  }],
  "organization": {
    "id": 1,
    "name": "trees-r-us"
  }
},
active: true,
created_at: 2021-12-24 17:21:05.123
identifier: 24f2b38e-575c-4e01-9d7c-1d0ab45b7bc7
```


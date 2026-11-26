# System design docs

This folder is a container for documents that describe the architecture of a Greenstand's platform and any engineering project that spans mutilple repositories. 

## Current architecture and proposals

Use [the system-design repository](https://github.com/Greenstand/system-design-docs) and the owning service's reviewed migrations to distinguish implemented schema from design proposals. Existing domain migration documents are historical plans, not proof of production rollout.

[ADR 0024](https://github.com/Greenstand/treetracker-decisions/pull/35) proposes Stakeholder-based memberships, separate organization billing and simple offline project/session routing. It remains open and proposed. The dev admin integration ([client #1315](https://github.com/Greenstand/treetracker-admin-client/pull/1315), [API #699](https://github.com/Greenstand/treetracker-admin-api/pull/699)) is also open; do not describe its dev migrations as a completed production migration. Numeric organization IDs remain compatibility mappings in some paths.

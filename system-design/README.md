# System design docs

This space describes Greenstand platform architecture across repositories. Read historical domain diagrams alongside the owning services' current schemas, migrations and deployment configuration.

### Architecture status — 27 November 2026

The new domain model (NDM) is the target for the administration work. However, a design document, an applied dev migration and a deployed production service are different evidence. [Admin client PR #1315](https://github.com/Greenstand/treetracker-admin-client/pull/1315) and [Admin API PR #699](https://github.com/Greenstand/treetracker-admin-api/pull/699) remain open. The descriptions below identify their development implementation; they do not certify a completed production migration.

| Responsibility                        | NDM source / development integration                                                | Important boundary                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organizations                         | stakeholder.stakeholder                                                             | Organization records use a UUID id. The numeric entity\_id maps older organization identifiers; it is not the canonical UUID.                     |
| Projects and admin capabilities       | stakeholder.project; stakeholder.organization\_user                                 | Project and scoped user extensions are part of the open integration and require their owning service migrations.                                  |
| Field collection                      | field\_data.session, session\_segment, raw\_capture                                 | Preserve uploaded raw observations and session context. Session/project corrections are audited administration operations.                        |
| Processed captures, trees and growers | treetracker.capture; treetracker.tree; treetracker.grower\_account                  | A capture is an observation of a tree; one tree may have several captures over time. Approval is separate from matching an observation to a tree. |
| Species catalogue and names           | herbarium.species; common\_name; organization\_species; scoped selection extensions | Separate the eight-letter herbarium name from the Latin name. Preserve common/local-name relationships and historical references.                 |
| Contracts                             | contracts.agreement, contract and document tables                                   | Read views do not imply implemented contract creation, signing or payouts.                                                                        |
| Identity and subscriptions            | Keycloak identities/roles; Stripe customer and subscription metadata                | Authentication, organization membership, role capabilities and subscription entitlements are separate concerns.                                   |

### Identifier and ownership rules

For NDM organization references, use stakeholder.stakeholder.id, a UUID. The current dev API resolves a numeric Keycloak organization\_id through stakeholder.stakeholder.entity\_id to exactly one active organization. Keep the numeric mapping where an existing protocol requires it; do not rename a numeric org\_id field to stakeholder\_id while leaving its semantics unchanged. Organization names and emails are not stable ownership or authorization keys.

The current compatibility model gives a non-platform admin user one approved organization claim. The broader multi-organization grower membership model remains a proposal. Do not infer that changing a Keycloak attribute transfers historical data. Grower transfers and session/project corrections use explicit audited operations.

### Collection, verification and matching

Field Data stores raw captures and sessions. The dev verification workflow reviews session-scoped observations; processed records live in the Treetracker domain. Verification answers whether an observation is acceptable. Matching answers which tree it belongs to. Wallet token creation, earnings and payouts are further workflows, not automatic synonyms for verification. Event publication and downstream processing dependencies must be checked before describing a complete end-to-end rollout.

Species choices in the integration follow project selection, organization selection and visible default catalogue settings. An explicit empty custom list stays empty; it does not mean use every species. New projects start with an empty custom list. Tag suggestions are scoped to the owning organization; project filtering follows capture/session project usage. Do not offer another organization's tags.

### Legacy compatibility still present

The administration work retains legacy Captures/export contracts using public.trees and related planter/species/tag tables where those screens have not been migrated. Existing organization-binding lookup also retains a legacy organization path. These compatibility paths are migration gaps, not instructions for extending public.entity or creating new domain fields in public tables.

New domain extensions belong with the responsible service's migrations. The admin API currently performs parameterized domain reads and writes as an administration facade; service write ownership and migration order still need review before deployment. Use [API PR #699](https://github.com/Greenstand/treetracker-admin-api/pull/699) and the linked service migration PRs for the exact schema and remaining dependencies, and [issue #1316](https://github.com/Greenstand/treetracker-admin-client/issues/1316) for the migration inventory.

### Proposed offline stakeholder/project routing

[ADR 0024 / PR #35](https://github.com/Greenstand/treetracker-decisions/pull/35) remains proposed. It separates administrator access, grower membership, organization billing and session ownership. Its Android direction is to cache permitted project choices, retain simple offline capture and record the intended destination with a session. The backend checks membership and confirms allocation after upload; unassigned data is retained for later resolution. A QR destination is not proof of membership.

The current organization invitation protocol uses numeric organization identifiers. [Android App Links issue #1468](https://github.com/Greenstand/treetracker-android/issues/1468) improves link opening; it does not itself implement multi-stakeholder permissions or project-aware uploads. Do not document those proposed capabilities as already released.

### How to use the older pages

The domain-model and domain-migration pages below remain useful historical design references. Their table names and migration steps must be checked against the relevant service repository and environment. Do not run old SQL or infer production schema state from a diagram. [System-design repository](https://github.com/Greenstand/system-design-docs) · [Architecture decisions](https://github.com/Greenstand/treetracker-decisions) · [Admin permissions documentation](https://docs.greenstand.org/admin-panel/user-permissions).

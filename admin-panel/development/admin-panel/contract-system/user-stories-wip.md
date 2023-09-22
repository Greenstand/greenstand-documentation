---
description: Detailed user stories for the Contract management tool
---

# User Stories (WIP)

## As an Organization Admin...

### New Agreement

<table><thead><tr><th width="408">I Want</th><th>So That</th></tr></thead><tbody><tr><td>To draft a new Agreement (in the “planning/drafting” state)</td><td>I can populate and revise Agreement details across one or more session</td></tr><tr><td>To give each draft Agreement a name and optional description</td><td>I can easily identify the Agreement later</td></tr><tr><td>To specify the type of a draft Agreement as either Grower, Nursery, Village Champion or Organization</td><td>I can easily identify and group Agreements later</td></tr><tr><td>To select a Stakeholder as a Funder for a draft Agreement</td><td>I can keep track of who is providing funding for the Agreement</td></tr><tr><td>To select a Stakeholder as a Growing Organization for a draft Agreement</td><td>I can keep track of who is responsible for tracking trees under the Agreement</td></tr><tr><td>To optionally appoint a Coordination/management team for a draft Agreement</td><td>I can record who is responsible for enforcing the Agreement</td></tr><tr><td>To optionally select a Species Agreement for a draft Agreement</td><td>I can specify capture payments dependent on the species of a tree under the Agreement</td></tr><tr><td>To select a <a data-footnote-ref href="#user-content-fn-1">Consolidation Rule</a> for a draft Agreement (or create a new one?)</td><td>I can specify how earnings are accumulated under the Agreement</td></tr><tr><td>To specify the <a data-footnote-ref href="#user-content-fn-2">per-capture payment</a> and currency, and maximum number of total captures including the period (start and end date) for a draft Agreement</td><td>I can split out specific quotas to 1 or many growers and contract</td></tr><tr><td>To be able to revise all attributes of an Agreement in the planning (draft) phase</td><td>I can make corrections or updates until the Agreement is fixed</td></tr><tr><td>Other Organization Admin users to view draft and edit Agreements owned by my organization (need to display agreement owner/creator)</td><td>I can collaborate with my colleagues on the Agreement</td></tr></tbody></table>

### Existing Agreement

| I Want                                                        | So That                                                              |
| ------------------------------------------------------------- | -------------------------------------------------------------------- |
| To progress an Agreement from "planning" to "open"            | The Agreement becomes immutable and I can use it to create contracts |
| To abort unwanted Agreements in the "planning" phase          | It can be archived and not used for contracts                        |
| To close an "open" Agreement                                  | The Agreement can no longer be used to create contracts              |
| Agreements in any stage other than "planning" to be immutable | There is no risk of modifying an Agreement after it has been signed  |

### Coordination Team

<table><thead><tr><th width="519">I Want</th><th>So That</th></tr></thead><tbody><tr><td>To compile a Coordination Team from existing Stakeholders and assign roles ("supervisor", "area manager") to them within the team</td><td>I can assign the team to Agreements</td></tr><tr><td>To give each Coordination Team a name and optional description</td><td>I can easily identify the Consolidation Team later</td></tr><tr><td>To optionally specify that a Coordinator reports to another Coordinator</td><td>I can keep track of the coordination hierarchy</td></tr><tr><td>To modify an existing Coordination Team by adding members, marking existing members as inactive, modifying Coordinator roles and changing the reporting hierarchy</td><td>I can keep the Coordination Team record in line with reality</td></tr></tbody></table>

### Species Agreements

| I Want | So That |
| ------ | ------- |
|        |         |
|        |         |

### Agreement Regions

| I Want | So That |
| ------ | ------- |
|        |         |
|        |         |

### &#x20;Consolidation Rules

| I Want | So That |
| ------ | ------- |
|        |         |
|        |         |

### New Contract

| I Want                                 | So That                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| To create a contract from an Agreement | The contract becomes active and can start to accumulate tree captures for fulfilment |
|                                        |                                                                                      |

### Contract Documents

<table><thead><tr><th width="330">I Want</th><th>So That</th></tr></thead><tbody><tr><td>To attach Contract Documents to Contracts</td><td>I can link Contract records to signed hard copies of contracts</td></tr><tr><td>To replace Contract Documents with newer versions</td><td>I can keep documents associated with Contracts up to date</td></tr><tr><td>To record a history of Contract Documents</td><td>I can keep track of changes and know which version is associated with a Contract record</td></tr></tbody></table>

[^1]: Consolidation rule consists of amount of captures during a certain time frame possibly tiered in brackets \* amount of money per tier/capture



[^2]: in case there is no consolidation based rule&#x20;

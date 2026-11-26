# Handbook

## GitHub **Repository**

[Greenstand/admin-panel-client](https://github.com/Greenstand/treetracker-admin-client)

## **Dependencies**

### Microservices

The Admin Panel relies on several microservice APIs for its data.

{% embed url="https://www.figma.com/file/52ZMxcjaWbTlgXMLOgvIMl/Greenstand-API-map" %}
Admin Panel API dependencies
{% endembed %}

#### Query API

[Greenstand/treetracker-query-api](https://github.com/Greenstand/treetracker-query-api)

A read-only API used for all large data queries, including raw captures (Verify tool), approved captures (Captured tool), and growers (Growers tool).

#### Treetracker API

[Greenstand/treetracker-api](https://github.com/Greenstand/treetracker-api)

#### Field Data API

[Greenstand/treetracker-field-data](https://github.com/Greenstand/treetracker-field-data)

#### Earnings API

[Greenstand/treetracker-earnings-api](https://github.com/Greenstand/treetracker-earnings-api)

#### Stakeholder API

[Greenstand/treetracker-stakeholder-api](https://github.com/Greenstand/treetracker-stakeholder-api)

#### Regions API

[Greenstand/treetracker-regions-api](https://github.com/Greenstand/treetracker-regions-api)

#### Reporting API

[Greenstand/treetracker-reporting](https://github.com/Greenstand/treetracker-reporting)

Provides summary statistics on captures and growers, generated periodically and displayed on Admin Panel Dashboard reporting cards.

#### Legacy Admin API

[Greenstand/treetracker-admin-api](https://github.com/Greenstand/treetracker-admin-api)

Formerly used for all Admin Panel data, now deprecated for new features.

{% hint style="warning" %}
Migration away from the legacy API is still a work in progress. Authentication, user management, and species management all still use this API.
{% endhint %}

### Keycloak Authentication

{% hint style="warning" %}
Migration to Keycloak for user authentication is a work in progress. Currently, the legacy Admin API is still used for authentication and user management.
{% endhint %}

## Team Members

**Leads:** Nick (Slack @Nick - Admin Panel Lead)

* Create issues
* Assign issues
* Review PRs
* Approve PR & merge
* Manage handbook for the team

**Code Owners:** Gwynn (Slack @Gwynn - Admin Panel Guide), Dadior (Slack @Dadiorchen - Engineering Lead)

* Create issues
* Assign issues
* Review PRs
* Expose labels for issues related modular components of the Admin Panel

## **Contributor Recommendations**

* Get to know code:&#x20;
  * Review previous pull requests&#x20;
  * Review PR process
* [Code style guide & VSCode setup w/ tooling (Quickstart guide)](https://app.gitbook.com/@greenstand/s/admin-panel/~/drafts/-Mg7AFJOMUn39ipRHYPB/quickstart/~/settings/insights)
* See the leads for each project/microservice
* How to pick up an issue:
  * comment on the issue with @codeowner and they will assign it to you
* How to ask a question:
  * Feel free to reach out on Slack by posting a message in a channel or sending a direct message to a lead/codeowner
  * Slack: [greenstand.slack.com](https://app.slack.com/client/T6WR1QS8J/C6XMUEDCN)
* Permissions / Tasks
  * Can review & ask questions on PRs but can’t approve them
  * Find & report bugs
  * Raise questions & suggestions<br>

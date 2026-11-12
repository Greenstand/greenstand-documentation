<!-- Built by .github/scripts/build-roadmap.mjs from roadmap.json and sources/Greenstand-Overview/Roadmap.md. Do not edit. -->

# The Greenstand roadmap

This is the text copy of the page for GitHub. The page with the area colors is on the [Pages site](https://greenstand.github.io/greenstand-documentation/roadmap.html).

This page shows the roadmap of Greenstand: the work that Greenstand plans to do. The roadmap comes from `Roadmap.md` in Greenstand-Overview. It has no dates, no owners, and no status. 2 items say "(Complete)". For the priority and the status of the work, see the [project boards](https://github.com/orgs/Greenstand/projects?query=is%3Aopen) or ask on Slack.

**Snapshot:** [`Roadmap.md`](https://github.com/Greenstand/Greenstand-Overview/blob/d7f97da8ce6dd9d828514ecd52e1f5faa6925baf/Roadmap.md) at commit `d7f97da` (2025‑12‑04). The words of the items are as in the source.

From `Roadmap.md` of [Greenstand-Overview](https://github.com/Greenstand/Greenstand-Overview) (AGPL-3.0).

## Where Greenstand is heading

The source names 6 milestones:

1. Completion of all Self Service functions required for Growers and Brokers to sell and transfer tokens from mobile app to marketplace integrations
1. Automating integration for token sales and services for mass purchasing of tokens
1. Automating validation and tagging of tokens.
1. Grower Proof of payment module - a required module to enable the creation and generation of tokens off line
1. Automated workflows for direct payments via Mobile Money in 10 African Countries
1. Release To Production - Deployment of Greenstand Impact Token Blockchain Network

## At a glance

The sections of the source, by the areas of the estate. Open a section to see its items.

| Area or group | Sections of the source | Items |
|---|---|---|
| [Core API](#core-api) | (none) | 0 |
| [Wallet](#wallet) | Android Greenstand Token Trading App (best guess), iOS Greenstand Token Trading App (best guess), Greenstand Token Trading API (best guess), Wallet Admin Client | 33 |
| [Admin](#admin) | Capture Matching Tool (best guess), Admin Panel | 16 |
| [Web map](#web-map) | Web Map | 26 |
| [Mobile](#mobile) | Android Tree Tracker | 0 |
| [Data ingest](#data-ingest) | Database Denormalization Project (best guess), Data Pipeline (best guess) | 2 |
| [Infrastructure](#infrastructure) | Cloud (best guess), Dev OPs (best guess) | 16 |
| [Organization](#organization) | (none) | 0 |
| [Across the estate](#across-the-estate) | Privacy Enhancements, General API Needs, Key Cloak Projet, Domain Migration, Operational, Documentation | 50 |
| [Outside the documented estate](#outside-the-documented-estate) | iOS Tree Tracker, Data Analysis, Track File Tool, RVI Tool, Payment for SAAS, Greenstand Blockchain Network | 30 |

## Core API

Repos: [treetracker-api](../repos/treetracker-api/README.md), [treetracker-query-api](../repos/treetracker-query-api/README.md), [images-api](../repos/images-api/README.md)

The roadmap has no section for this area.

## Wallet

Repos: [treetracker-wallet-api](../repos/treetracker-wallet-api/README.md), [treetracker-wallet-app](../repos/treetracker-wallet-app/README.md), [treetracker-wallet-admin-client](../repos/treetracker-wallet-admin-client/README.md)

<details>
<summary>Android Greenstand Token Trading App · 3 items · best guess</summary>

*Best guess for the area: treetracker-wallet-app holds an Expo mobile wallet with a Keycloak sign-in; the items are wallet features.*

+ Credential creation / Key Cloak Integration
+ Basic send feature to an existing wallet
+ Send/Gift to a non-existing wallet

</details>

<details>
<summary>iOS Greenstand Token Trading App · 4 items · best guess</summary>

*Best guess for the area: the same Expo mobile wallet runs on iOS.*

+ Login via Keycloak
+ Credential creation
+ Basic send feature to an existing wallet
+ Send/Gift to a non-existing wallet

</details>

<details>
<summary>Greenstand Token Trading API · 3 items · best guess</summary>

*Best guess for the area: the items (trades between wallets, wallet creation) are what treetracker-wallet-api does.*

 
+ Implement generic trading between wallets **(Complete)**
+ Streamline the process for wallet creation **(Complete)**
+ Automate credential creation and delivery

</details>

<details>
<summary>Wallet Admin Client · 23 items</summary>

**Individual Signup and Wallet Creation**

* **Send a token via a link:** A wallet can send tokens (one or many) through a link. Unregistered users can claim the tokens by creating a new account or adding them to an existing one.

**Acceptance Criteria:**

* A token or set of tokens can be sent via a web link.
* Users with access to the link can claim the token.
* Release: Version 1.2

**Token Tax System**

* Implement a tax on all minted and traded tokens.

**Buy Token Function**

* Allow users to purchase tokens.

**Sell Token Function**

* Allow users to sell tokens.

**Freeze Function**

(Functionality details not provided)

**MVP 1.2 (Requires Keycloak Integration)**

This MVP introduces the following functionalities:

**1. Create a New Managed Wallet by Unregistered User**

Unregistered users can create a sub-account under a managed wallet by following these steps:

1. Accessing the wallet link.
2. Selecting "create new account."
3. Entering email, password, and wallet handle name.

**Acceptance Criteria:**

* User can create a new account.
* User can create a "non-trust relationship" send request to any other wallet.
* Release: Version 1.2

**2. Send a token via a link**

(Functionality and acceptance criteria are duplicated from "Individual Signup and Wallet Creation")

**Wallet Management**

* **Users' Wallet Management and Profiles:**
    * Internet users can create their own managed wallets.
    * Users can manage their wallet profiles and display them on a map.
+  **New Token Assignment Approach:**
    * Users can:
        * Register via social media platforms (e.g., Facebook).
        * Have Greenstand create a wallet for them.
        * Receive tokens assigned through the Wallet API.
* **Wallet Binding Operation**
+ (Functionality details not provided)

</details>

## Admin

Repos: [treetracker-admin-client](../repos/treetracker-admin-client/README.md), [treetracker-admin-api](../repos/treetracker-admin-api/README.md)

<details>
<summary>Capture Matching Tool · 3 items · best guess</summary>

*Best guess for the area: the Admin Panel section lists the capture matching deployment.*

+ Capture Matching advancement 80% accuracy with machine learning
+ Capture Matching to a "Usable place"
+ Capture Matching Tool being able to generate a new tree for all organizations (MILESTONE)
  

</details>

<details>
<summary>Admin Panel · 13 items</summary>

+ Self sign in sign up
+ Sign in via the app notification for on the ground trackers
+ Payment Verification Function

+ Automate access control
+ Button to Admin Panel to Wallet Tool
+ Planter quality control and management, activity metrics
+ [Capture Matching Full deployment](https://github.com/orgs/Greenstand/projects/35)
+ Duplicate identification
+ Planter image management
+ Additional filters
+ [Advanced species management (merge)](https://github.com/orgs/Greenstand/projects/64)
+ Integrate Wallet tools
+ [Messages pages for administrators](https://github.com/Greenstand/treetracker-admin-client/issues/503)

</details>

## Web map

Repos: [treetracker-web-map-client](../repos/treetracker-web-map-client/README.md), [treetracker-tile-server](../repos/treetracker-tile-server/README.md)

<details>
<summary>Web Map · 26 items</summary>

+ Sharing, Bill of value (TRings), and UI/UX enhancements to web map wallet view
+ Impact panels for planters and organizations
+ Integrate Wallet 
+ Time Line Feature
+ Map loading Speed. To any tree in 2 seconds
+ Map 2.0
+ Add Geo-spatial Data layers such as  https://ctrees.org/
+ Flag /Like Feature
+ Supports Tree Capture
  - View trees on Map
  - View captures on map
  - Trees can jump to all captures
+ Customizable Map
  - Organization can custom map
  - Theme
  - Color
  -  Logo
  - Font
+ Close old webmap services
    - SEO analysis and optimization
    - Search features - (org, name, species, country, city)
    - Web Map performance up - for org map, tree point, wallet map, and timeline
    - Like Button
 
  +  Connect to Webmap wallet UI
  +  Connect to wallet ApI
    + GEO Linking
      

</details>

## Mobile

Repos: [treetracker-android](../repos/treetracker-android/README.md)

<details>
<summary>Android Tree Tracker · 0 items</summary>

The source lists no items here.

See Android Documentation and [Project board](https://github.com/orgs/Greenstand/projects/109)

</details>

## Data ingest

Repos: [treetracker-field-data](../repos/treetracker-field-data/README.md), [treetracker-airflow-dags](../repos/treetracker-airflow-dags/README.md)

<details>
<summary>Database Denormalization Project · 1 item · best guess</summary>

*Best guess for the area: treetracker-airflow-dags builds the denormalized reporting tables.*

+ Implement tagging structure (like the Habarium)

</details>

<details>
<summary>Data Pipeline · 1 item · best guess</summary>

*Best guess for the area: treetracker-airflow-dags is the data pipeline of the estate.*

+ Data pipeline Stabilization and Optimization

</details>

## Infrastructure

Repos: [treetracker-infrastructure](../repos/treetracker-infrastructure/README.md)

<details>
<summary>Cloud · 11 items · best guess</summary>

*Best guess for the area: monitoring, Ansible, blue/green deploys, Solr, and Keycloak are in treetracker-infrastructure.*

+ Monitoring and alerting, log analysis
+ Develop and improve ansible scripting for deployment automation
+ Improve the blue/green deployment process
+ Manage and migration of dev & test infrastructures
+ Cdn optimization in the prod environment
+ Keycloak- integrate into all microservices 
+ Solr Implementation
+ Load Testing on services
+ Performance Reporting, (limitations, consumption and tuning performance)
+ Isolate core Services
+ Migrate requests from partners to dedicated DB + API environment
  

</details>

<details>
<summary>Dev OPs · 5 items · best guess</summary>

*Best guess for the area: release channels and environments are deploy work.*

+ Upgrade Release Channel
+ Upgrade development workflow
+ Dedicated env for different features / Versions of API's for clients and testers
+ Easier way to maintain different /legacy versions
+ Integrate ML Species tagging
    

</details>

## Organization

Repos: [Greenstand-Overview](../repos/Greenstand-Overview/README.md)

The roadmap has no section for this area.

## Across the estate

Sections about many repos.

<details>
<summary>Privacy Enhancements · 8 items</summary>

+ Advance all data privacy issues
+ Deletes option (app)
+ Privacy option (app)
+ Audit all public API access for exposeing PII
+ Review, evaluate, and upgrad polices concerning access to any PII
+ Audit and document all user info exposed via integration API's
+ Implement an ossification option for PUU and Geo Location
+ Review and implement privacy protocol for token minting

</details>

<details>
<summary>General API Needs · 4 items</summary>

+ Complete Domain Migraiton
+ Improve unit & integration test coverage
+ Automated testing during our deployment pipeline
+ Continue MVC factoring of R&D codes

</details>

<details>
<summary>Key Cloak Projet · 5 items</summary>

+ Authentication system
+ Self Server Key Cloak Project
+ Integrate Keycloak into all Microservices
+ Auth System
+ Key cloak Users system and Authentication to all Microservices

</details>

<details>
<summary>Domain Migration · 3 items</summary>

+ Stop All Legacy Domain services/tables
+ Api and Tile Server, Migration to new domain
+ Migrate Admin Panel to new domain

</details>

<details>
<summary>Operational · 6 items</summary>

+ Quality control
+ Identifying optimal phones/hardware
+ Automated creation and verification of planter accounts
+ Project configuration / organization whitelabel
+ Payout management for planters / collectors
+ Rewards System (trading tokens for Swag - Wallet admin dependent)

</details>

<details>
<summary>Documentation · 24 items</summary>

+ Clean up All Readme's
+ Wallet API published Public
+ Review Audit of open links
+ Android Documentation
+ Document Image Size History and Strategies
+ Contributor Porthole - Operational Info for Contributors
+ Link all documentation from Greenstand.org
+ Auto updates to documentation for Yaml files etc..
+ Define Private and Public Docs Task New Normal
+ Web map api (published)
+ Earnings API (Private)
+ Document all main project tools we use
+ Defining public and private docs..
+ Define Gitbook versus Github uses.
+ Considering implementing Stoplight Studio Stoplight.io
+ Refine documentation on the documentation process.
+ Removal of legacy API's don't need specs.
+ Figure out how to turning a YAML into a readable file on the web
+ Keep current links to api documentation, and keep links to old documentation (production version versus test)
+ Wallet Integration API - published with access control
+ Web map API published
+ Access controlled document portal HTML documents
+ Establish sharing protocol and systems for Private Docs (gitbook versus website?)
+ Version control for Documentation_ only the live API's should be on our website, others shall be back side documents- Query only data api (when in doubt lock it up.)

</details>

## Outside the documented estate

Work that these docs do not describe: no documented repo holds its code.

<details>
<summary>iOS Tree Tracker · 4 items</summary>

[Project Board](https://github.com/orgs/Greenstand/projects/33)
+ Add Notes Feature
+ Add token field-transfer-request/send feature
+ Deep Link
+ Integrate Token Trading

</details>

<details>
<summary>Data Analysis · 11 items</summary>

+ Introduce Data Analytics tool dashboard
+  Auto Species ID
+  Auto Capture Matching
+ Adress High Resolution image issue
+ R&D for tree data point matching algorything (Capture matching feature)
+ R&D for improving GPS accuracy using kalman filtering and planter movement scripting
+ Analysis of planter activity patterns
+ Automated duplicate screening
+ Cloud image analysis to sort images based on tags (grown, hole, etc..)
+ Machine learning species verification (80% Accuracy)
+ Modeling the ecological value of planted trees

</details>

<details>
<summary>Track File Tool · 2 items</summary>

+  Track Tool
+  GIS tracking and boundary layer tools
 

</details>

<details>
<summary>RVI Tool · 3 items</summary>

+ RVI tool - individual's ability to apply an RVI to any capture in their wallet by using tags related to the trees or pending transfer
+ Release Basic RVI tool: ability to have a preset formula for tree value = Name of RVI, Tags considered, value or function per tag (example Tring = zero if   Token has no valid tags, if token is valid tags = 1 * (is indigious =5) * is linked to other token
+ Design Fungible Coin

</details>

<details>
<summary>Payment for SAAS · 3 items</summary>

+ Membership account link for autopayments based on number of tokens transferred
+ Autopayments to the use of Tools such as (Capture matching, RVI, Token Minting, messaging, Herbarium access, Data processing fees)
+ Giving our Clients/organizations/ different services based on level of payments

</details>

<details>
<summary>Greenstand Blockchain Network · 7 items</summary>

+ Beta release of modified Etheium Sidechain
+ * 7 Nodes operating
+ **Mint Token on Blockchain**
+ **First Trade from Third-Party App via Blockchain:**
* Define what can be minted as a token.
**Release 3 Primary Blockchain Nodes**
**Release RVI Protocols**
**Bridge to Ethereum Blockchain**
  * Ethereum mainnet bridge established.

</details>

---
description: The big picture of the web map apps, repos, projects
---

# Web map

This introduces our web-map and web-map-related project on Greenstand.

Application instructions are here:

v1: [https://greenstand.org/treetracker/web-map](https://greenstand.org/treetracker/web-map)

v2: [https://greenstand.org/treetracker/web-map-v2](https://greenstand.org/treetracker/web-map-v2)

Online version:

v2:  [https://beta-map.treetracker.org](https://beta-map.treetracker.org)

v1: [https://map.treetracker.org](https://map.treetracker.org)

Currently, we are actively deploying these projects/features:

## Projects

### [Denormalized map data](denormalized-data.md)

Now there is huge pressure on rendering the map, one of the reasons is that it is complicated to join the data crossing tables and get what we need, so we want to optimize the database structure to offer better performance, and also change the application to adapt the new DB.

**keywords and tech stack involved:** javascript, SQL, PostgreSQL, node.js, knex, denormalization.

### [V2 web map](v2-web-map.md)

The v2 web map is a project to let the current web map to adapt our new database domain, in the new domain, we evolved a better business modal for a long-term vision and growth for Greenstand.

**keywords and tech stack involved:** Node.js, Typescript, RESTful API, Knex, SQL, tile-server

### [Like](./#like)

We need to implement the like feature for not just web map clients but also any places we need it, for example, android app.

It is about a click counting and resenting system + API(microservice)&#x20;

On the client, it is a `like` button and the number that how many people liked it.

Also, consider using this small API to try NestJS as our next-generation API framework

**keywords/tech stack:** microservice, Node.js, NestJS

### [Customizable web map](./#customizable-web-map)

The organization on Greenstand can custom their own web map UI, color, theme, font, spacing, logo, menu, and map settings.

**keywords/tech stack:** material-UI, React, CSS, next.js

### Web map core 3.0

The new version of the web map core that can be integrated into native app, android, and IOS

**keywords/tech stack:** React, web viewer, React-Native

### [User profile](user-profile.md)

The user system on web map app, user can register, login, custom their profile on web map.

**keywords/tech stack:** OAuth, React, UI/UX, Keycloak

### [Wallet](wallet-app.md)

The user interface deals with the wallet API, which can check info, and transfer token.

**keywords/tech stack:** React, MaterialUI, UI/UX design, RESTful API

### [SEO](seo.md)

Optimize the SEO for map.treetracker.org, and grow the visits and users.

**keywords/tech stack:** google analytics, SEO, google AD

### [Search](search.md)

The search feature on the map, and possibly on the admin panel and others.

Support full-text search by all possible info, like all kinds of names, intro, and locations.

**keywords/tech stack:** Solr, search engine, React, MaterialUI



## Roadmap

The roadmap as of 2023 Jan:

{% embed url="https://www.figma.com/file/n3pRXTcU7znsCiqZciewZE/Roadmap-2023?node-id=0%3A1&t=gcMKYxYTR3kEt5VY-1" %}

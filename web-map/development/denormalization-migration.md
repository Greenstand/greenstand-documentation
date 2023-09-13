# Denormalization Migration

The Denormalization Migration Project is to migrate the data fetching from the old tables to denormalized new tables/schema.&#x20;

Previously, when we were rendering the map, we are fetching data from the legacy (currently it's still online) version of the tables, the downside of this approach is that it is pretty time-consuming in cases, you can find the SQL is pretty complicated:

```
        INNER JOIN
        (  select trees.id as org_tree_id from trees
          INNER JOIN (
            SELECT id FROM planter
            JOIN (
              SELECT entity_id FROM getEntityRelationshipChildren(
                (SELECT id FROM entity WHERE map_name = '${this.mapName}')
              )
            ) org ON planter.organization_id = org.entity_id
          ) planter_ids
          ON trees.planter_id = planter_ids.id
        ) tree_ids
        ON tree_region.tree_id = tree_ids.org_tree_id`;
```

Please note, the `getEntityRelationshipChildren` is a function with recurse, so, generaly, these kind of SQL are pretty slow and hard to optimize. Now with the denormalized tabels in place, we are going to use the simplied way to speed up the web map performance.&#x20;

## The Github Project

We created a `project` on Github to collect tickets relevant to this task:

{% embed url="https://github.com/orgs/Greenstand/projects/34/views/1" %}
Migrate Web Map to Denormalized Data
{% endembed %}

## The Database

In the PostgreSQL DB, we put denormalized tabes into schema `map_features`

```
treetracker=> \dt map_features.*
                              List of relations
    Schema    |           Name            |       Type        |     Owner
--------------+---------------------------+-------------------+---------------
 map_features | capture_cluster           | table             | mapqueryadmin
 map_features | capture_feature           | table             | mapqueryadmin
 map_features | domain_event              | partitioned table | mapqueryadmin
 map_features | domain_event_handled      | partitioned table | mapqueryadmin
 map_features | domain_event_handled_2021 | table             | mapqueryadmin
 map_features | domain_event_handled_2022 | table             | mapqueryadmin
 map_features | domain_event_handled_2023 | table             | mapqueryadmin
 map_features | domain_event_raised       | table             | mapqueryadmin
 map_features | domain_event_received     | table             | mapqueryadmin
 map_features | domain_event_sent         | partitioned table | mapqueryadmin
 map_features | domain_event_sent_2021    | table             | mapqueryadmin
 map_features | domain_event_sent_2022    | table             | mapqueryadmin
 map_features | domain_event_sent_2023    | table             | mapqueryadmin
 map_features | migrations                | table             | mapqueryadmin
 map_features | raw_capture_cluster       | table             | mapqueryadmin
 map_features | raw_capture_feature       | table             | mapqueryadmin
 map_features | region_assignment         | table             | mapqueryadmin
(17 rows)

```

Currently, the map app displays all the captures, including unapproved ones, so now we just fetch data from `raw_capture_feature` `raow_capture_cluster` (the capture\_feature would be approved ones)

For the `raw_capture_feature`:

```
treetracker=> \d map_features.raw_capture_feature;
                    Table "map_features.raw_capture_feature"
       Column        |           Type           | Collation | Nullable | Default
---------------------+--------------------------+-----------+----------+---------
 id                  | uuid                     |           | not null |
 lat                 | numeric                  |           | not null |
 lon                 | numeric                  |           | not null |
 location            | geometry(Point,4326)     |           | not null |
 field_user_id       | bigint                   |           | not null |
 field_username      | character varying        |           | not null |
 device_identifier   | character varying        |           |          |
 attributes          | jsonb                    |           |          |
 tracking_session_id | uuid                     |           |          |
 map_name            | jsonb                    |           |          |
 created_at          | timestamp with time zone |           | not null |
 updated_at          | timestamp with time zone |           | not null |
 capture_taken_at    | timestamp with time zone |           |          |

```

We can get the coordinates of the capture directly, to filter the data by some conditions, say, planter, organization, we need to parse the data in the JSON object `attributes` field.

## The API spec

Because we are going to keep the original/online version of map app running for a while, so we need to let the API service offers both the old and new spec.

Currently, there are two services related to this task, the tile server and the query API:

```
https://dev-k8s.treetracker.org/tiles/1/0/0.png
https://dev-k8s.treetracker.org/query/countries?lat=8&lon=10

```

The repositories for them are here:&#x20;

```
https://github.com/Greenstand/treetracker-query-api
https://github.com/Greenstand/node-mapnik-1

```

So, to provide these two versions of API spec at the same time, we plan to add prefix for the newer version of spec, like this:

```
https://dev-k8s.treetracker.org/tiles/1/0/0.png
https://dev-k8s.treetracker.org/tiles/v2/1/0/0.png

https://dev-k8s.treetracker.org/query/countries?lat=8&lon=10
https://dev-k8s.treetracker.org/query/v2/countries?lat=8&lon=10
```

So, the API starting with `v2` would be the new denormalized API..


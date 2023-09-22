# First Deployment Plan

## The Case

{% embed url="https://www.figma.com/file/ipbZl4Q41BgH8XfMEAwLCt/earnings-tool?node-id=0%3A1" %}

The table for consolidation period:

```
                   Table "stakeholder.fcc_tiered_configuration"
   Column   |           Type           | Collation | Nullable |      Default
------------+--------------------------+-----------+----------+--------------------
 id         | uuid                     |           |          | uuid_generate_v4()
 start_date | timestamp with time zone |           | not null |
 end_date   | character varying        |           | not null |
 created_at | character varying        |           | not null |
 active     | boolean                  |           | not null | true

```

## Prerequirstes

* The stakeholders API
* The admin panel is blocked in the image API

## Plan

1. Set up S3 and test
2. Create table: fcc\_tiered\_configuration (maybe need to deploy contract api)
3. Deploy Airflow job to prod and test
4. Deploy Earnings API to prod and test
5. Deploy earnings tool page to admin panel prod
6. Set up the consolidation periods

## Preparation

The hardcode information:

```
// Some code
freetown_stakeholder_uuid = "2a34fa81-0683-4d25-94b9-24843ceec3c4"
freetown_base_contract_uuid = "483a1f4e-0c52-4b53-b917-5ff4311ded26"
freetown_base_contract_consolidation_uuid = "a2dc79ec-4556-4cc5-bff1-2dbb5fd35b51"
```

The consolidation periods:

```
2022-xx-xx 00:00 to 2022-xx-xx 00:00
```


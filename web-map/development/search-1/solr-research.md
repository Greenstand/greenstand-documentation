# Solr research

## Dev environment

[https://dev-k8s.treetracker.org/search/solr/#/mycoll/query?q=publisher\_s:\*am\*\&q.op=OR\&indent=true](https://dev-k8s.treetracker.org/search/solr/#/mycoll/query?q=publisher\_s:\*am\*\&q.op=OR\&indent=true)

## Some search cases:

*   Everthing

    [http://localhost:8888/solr/mycoll/select?q=\*:\*](http://localhost:8888/solr/mycoll/select?q=\*:\*)
*   Basic, search by keywords:

    [http://localhost:8888/solr/mycoll/select?q=publisher\_s:Namco](http://localhost:8888/solr/mycoll/select?q=publisher\_s:Namco)
*   Search mutiple words (or)

    http://localhost:8888/solr/mycoll/select?q=publisher\_s:(SETA Namco)
*   Search crossing fields:

    `q=title:(Desert FighterEU) OR publisher_s:Namco`
*   Search with wild

    q=`publisher_s:*am*`

    `q=publisher_s:Nam*`
*   Fuzzy search

    To search words that have a 2 charaters distance with the given keyword:

    `publisher_s:Nam~2`&#x20;
*   Range search:&#x20;

    q=year\_i:\[1993 TO 1994]
*   Change the rank/relevant of result:&#x20;

    search both in title and publisher, but the publisher get higher releevant:&#x20;

    q=title:ActRaiser OR publisher\_s:Namco^4

## Deployment

Currently, we just deployed a single node, 300M, in the future, we will consider deploying the cluster version.

There is a basic deployment under infrastrature, `solr` folder.

To initiate the solr and create a `core`:

```
kubectl -n webmap exec deployment/treetracker-solr -it -- solr create -c mycoll
```

To import data into solr and index:

```
curl "https://dev-k8s.treetracker.org/search/solr/mycoll/update?commit=true" \
  -H "Content-Type: application/json" -T "snes.json" -X POST -v

```

{% file src="../.gitbook/assets/snes.json" %}
The sample data
{% endfile %}




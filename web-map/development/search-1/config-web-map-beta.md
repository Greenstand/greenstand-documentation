# Config web map beta

#### To set up featured tree:

Insert record to `webmap.config`

```
name       | featured-tree
data       | {"trees":[3937, 3952, 3953, 3985, 4031, 4043, 4787, 4789, 5881, 5922, 5925, 6945, 7181, 7186, 7188,
 7273, 7276]}

```

#### To set up featured planter:

```
name       | featured-planter
data       | {"planters":[3937, 3952, 3953, 3985, 4031, 4043, 4787, 4789, 5881, 5922, 5925, 6945, 7181, 7186, 7188,
 7273, 7276]}

```

#### To set up featured organization:

```
name       | featured-organization
data       | {"organizations":[552,775,1332,1331]}

```

#### To set up featured wallet:

```
name       | featured-wallet
data       | {"wallets":["8de4ce55-f17c-41fe-9cc7-c21a47872405","f3d90452-12c6-4c23-8d2f-6cfa2ddc203b","6fb7b6c1-e9
ce-4040-b05e-079c3b12a55f","0cdf4219-869a-41ce-953a-a8421d8353f7","643c67ec-9984-4b66-ab9d-6bbb80890cc6","483dea22-
2d2e-4578-a183-2b1c0567f592","c6131f89-afb1-46ac-b9a7-b77900660f7d","f3d90452-12c6-4c23-8d2f-6cfa2ddc203b", "1f2a08
62-66d1-4b42-8216-5a5cb9c6eca5","f440fe64-dea3-4873-b67b-b0d82480772b","fab48767-ca7c-4890-a281-c6d08f0712ae","fbfc
7e81-b211-4c66-ab2e-572c58801494","b5490e75-5231-4f31-b25d-fae802e9dc44","8eec8266-6fb0-4b71-9c73-c92cc6d31609"]}

```

#### To add information for single organization, planter, wallet:

Add record with name `extra-wallet, extra-organization, extra-planter` respectively

Add the id of this wallet/org/planter into `ref_id` , the `red_uuid` has been deprecated.

Add json to data, with fields below:

`about`: the about section on the web map page.

`cover_url`: the hero picture

`mission`: the mission section on org/planter page.


# Shape File Uploads

Region resource attributes

* id (uuid)
* owner\_id (stakeholder uuid of an organization)
* name (string)
* description (string)
* shape (multipolygon geometry column, geojson format for API)
* show on org map (bool)
* calculate statistics (bool)
* contract zone (bool)
* created\_at
* updated\_at



Additional fields/entities to consider

For each shape:

* Properties for each shape - JSON blob, that could be searchable, these come from the shape
* Group - File that a given shape was uploaded in, or assignable
* Tag - do we want to allow users to tag their data, or use the properties in the shape file as the tags.


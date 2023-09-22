# Data Visualization

Questions

* How the service agreement with Tableau Server works
  * At what scale does cost of extracted data matter?
    * They DO have a nonprofit cost level (tableau.com/foundation)
    * Viewing licenses
  * Call a sales rep at Tableau and discuss our use case
  * Guest account on T.S. to access embedded views
* How do we run Tableau Server?  Or use it?
  * Server vs Online, which do need now or later
* Understand how to embed view into pages with access control, see above link
  * And Federated Authn/Authz model for services access
* Table design of the read only database
* Creating airflow job to copy data to read only database
* Visualizations may need to be released into production using partial staging.

First Experiment

* Choose single dataset and visualization as proof of concept
  * Dataset: Captures x planter x organization&#x20;
  * Verified captures by organization bar chart, on the main Greenstand Admin Panel Dashboard
* Needs
  * Denormalized database table schema -> **Nick**
  * Read only database cluster to hold this database table -> **Cloud Team Member**
  * A job to copy/update data into this table -> **Rushab(?)**
  * A visualization workbook -> **Rushab**
  * Run tableau server / determine applicability of use case -> **Zaven**
  * Embed the view into admin panel -> **Admin Panel Team**

{% embed url="https://drive.google.com/file/d/192lGkK04unn2OJvgmqKqtUT1jhb9XGO_/view?usp=drive_link" %}

#### Denormalized Database Table Schema

{% embed url="https://drive.google.com/file/d/1eMPCf6O5OepMTF1TJV_AmZiL0T7ZqMCJ/view?usp=drive_link" %}

**Links**



{% embed url="https://help.tableau.com/current/pro/desktop/en-us/embed.htm" %}

{% embed url="https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm" %}

{% embed url="https://help.tableau.com/current/server-linux/en-us/ts_aws_welcome.htm" %}

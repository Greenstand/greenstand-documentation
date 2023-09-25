---
description: >-
  [outdated, but possibly useful in the future] Explanations and visualizations
  of our data collection tools. Last updated 16 October 2021.
---

# Data Pipelines

## Taxonomic Metadata Generation

{% embed url="https://drive.google.com/file/d/1iUQF19mDIEtVmPcVYhpMB_NzS5KSQakS/view?usp=drive_link" %}
Highest level pipeline
{% endembed %}

Taxonomic metadata generation the process by which we assign taxonomic information (such as species) to a capture. The current pipeline follows the schematic above.&#x20;

The first part of the pipeline is a "common" naming of species done by a possibly untrained individual- something cursory in the admin panel that is limited in option and often inaccurate or missing altogether. An example of this is "orange tree", which from a botanic perspective is not comprehensive. Currently, this information and the associated captures are stored in Greenstand's treetracker databases hosted on S3 (tti:raw in the diagram).

The images are sampled (for example, as of writing, we are taking images from Haiti) and downloaded onto an EC2 instance (tti:raw\_sampled). Our annotations tool of choice is the Computer Vision Annotation Tool (CVAT) which we envision will allow trained individuals to define regions-of-interest and tag species to captures. Annotators use a reference called the herbarium to choose the species for a given capture. The herbarium (tti:herbarium and tree_\__species.yaml) consists of useful information and reference images for all the species we have encountered, and is curated by expert botanists.&#x20;

The completed annotations are sent to a S3 bucket dedicated to annotations (tti:training). As new species are encountered, the herbarium is updated accordingly.

## CVAT Tool Pipeline

The services used for the CVAT annotation tool looks something like this:

{% embed url="https://drive.google.com/file/d/1jc4ZzVxvxLPECsYIxgC_Mqu57B_BlnbT/view?usp=drive_link" %}

The elements in red are completed inside our AWS infrastructure. After a capture has been uploaded to the admin panel, the Image ETL tool (a set of Python scripts) queries the backend-database (Postgres) to download the images to the ETL local storage. The UI used to perform the annotations are taken directly from the CVAT open source projects. We are in the process of automating task creation and assignment. As of writing, tasks are created automatically and assigned manually.&#x20;

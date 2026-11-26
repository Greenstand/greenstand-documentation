---
description: Resources and context for Greenstand Engineers
---

# Overview

![](https://lh3.googleusercontent.com/t9i8Puyxha_y1G3VibmyP7B3mMYrvIp4uROd8KH9x-9z13mzMR8HI4meNrkp-XL8GdMfONjfwbaMHMp2-11bcq_WcA8HT2JbymGXanOFNd4dru0RH8-IRzSv_xPAE9iYAZRjYIU)

## **Welcome!**

Thanks for volunteering as a Greenstand Engineer! Greenstand Engineers build the treetracker platform, a powerful and integrated set of applications and software services that helps growers demonstrate reforestation impact and enables organizations to compensate them. Greenstand provides the software; grower employment and payment arrangements belong to the participating organizations. This guide explains our motivations, organizational culture, software projects, and tools that we use to collaborate, build, and run our platform. [https://greenstand.org](https://greenstand.org)

We are so glad to have you on board. This is a large project and we have many tasks ahead of us - ensuring a quality software service that can verify the growth and success of billions of trees as we collaborate with tens of third party reforestation organizations to rebuild our global forests. It’s a big dream, but by working together that vision is already becoming reality. There is a place in this effort for every software engineer!

### **What is Treetracker?**

Treetracker is a platform that enables proof of reforestation impact (such as tree plantings, or tree survivorship) to be collected, verified, and exchanged for financial compensation. Growers capture timestamped, geotagged images using mobile applications to demonstrate impacts that are relayed to our cloud via an ingestion pipeline. These data are reviewed using our admin panel, and shown in context via our web map. Ownership of impacts are tradable through our wallet service, which enables diverse funding sources to fund these activities through a transparent chain of custody.

A huge gap exists between the good intentions of global reforestation efforts and verified, new forest growth on the ground. Treetracker enables the radical transparency and collaboration necessary to turn intentions into outcomes.\
\\

### **Treetracker Platform High Level Overview**

{% embed url="https://drive.google.com/file/d/1deTvG92X-jBdgLqkPJWEEcJsv-HK4010/view?usp=sharing" %}

A visual review of our technical capabilities is available here:

{% embed url="https://drive.google.com/file/d/11BXvwxqYev945YtulnFbnNq59kOfx7MQ/view?usp=drive_link" %}

### **Domain Model**

We use standardized language to talk about the logical units involved in our technical and operational systems.

An evolving document is maintained at the following link, and changes are suggested and reviewed via Pull Request: [https://github.com/Greenstand/system-design-docs/blob/master/domain-model/domain\_model.md](https://github.com/Greenstand/system-design-docs/blob/master/domain-model/domain_model.md)

[https://medium.com/spotlight-on-javascript/domain-driven-design-for-javascript-developers-9fc3f681931a](https://medium.com/spotlight-on-javascript/domain-driven-design-for-javascript-developers-9fc3f681931a)\\

**Our Engineering Organization**

Building treetracker requires diverse technical skills and many projects working together to build a functional whole. As such, we have organized the Greenstand Engineers as a microservices enterprise. We operate on the principle of creating many small, focused teams. Teams coordinate through repository issues, pull requests and Slack, with technical support and ownership agreed with the relevant maintainers. New volunteers are encouraged to choose one project to contribute to at first. Over time, as you learn more about our platform, there are many opportunities to learn new technologies or collaborate in cross team working groups.

### **Roles**

We define role levels to facilitate organizing our teams and decision making.

All new volunteers enter as Contributors. Core Contributors in the engineering division are individuals who have contributed 50 hours of engineering work to the project. Lead and Coordinator roles are reserved for individuals that have made outstanding contributions to the platform and desire leadership opportunities and experience.

In certain cases roles may have funding available.

### **Teams**

The engineering division is divided into many small teams. In some cases we also organize cross-team working groups to address special concerns. We add and delete teams as needed and deemed appropriate. Some teams also have squads tasked with specific responsibilities within the team, such as guidance, testing, or challenging engineering problems\*\*.\*\*

#### **Current Teams:**

Admin Panel Application\
Impact Map Web Application\
Wallet Admin Application\
Mobile (composed of Android and iOS teams)\
Machine Learning\
Wallet Microservice\
Application Platform\
GIS\
Dev Ops

### Collaboration

Coordinate work through GitHub issues, pull requests and the relevant Slack channels. Recurring team-meeting schedules and attendance instructions have been removed because those meetings are not currently running. Historical minutes remain historical records.

### **Volunteer Enterprise Perspective**

As a volunteer enterprise, we need to meet the demands of a full scale technical operation with an often heavily part time and large rotating set of collaborators. This means that working on Treetracker will feel different than working for a corporation with many full time, retained, and robustly funded engineers. **Our strength as Greenstand Engineers comes from working together,** each of us focusing on small coordinated pieces of a big project. This often means considerably more ‘hand off’ in terms of tech leadership, troubleshooting, and availability than some engineers might be used to. It’s also a strength though and a lot of fun, because Greenstand’s large community of like minded individuals is a great place to make new connections, networks, and friends.\
\\

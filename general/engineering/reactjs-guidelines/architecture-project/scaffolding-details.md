---
description: >-
  Short explanations for the purpose of different directories in our proposed
  scaffolding
---

# Scaffolding Details

**/github**

This directory should contain all GitHub actions and workflows

**/storybook**

This directory contains all of our storybook components for reusable UI elements

**/docs**

Any relevant documentation

**/cypress**

All cypress testing configs, mocks, tests

**/src/assets**

Any assets used globally and not stored on CDN

**/components**&#x20;

All atomic react components as component directories that contain the component, styles, and tests.

**/MyComponent**

Each component directory should contain the index file with component export, abstracted styles, unit tests, and any specific helper files

Example:

/MyComponent

&#x20;/MyComponent.tsx

&#x20;/MyComponent.styled.tsx

&#x20;/MyComponent.test.tsx

**/views**

Each of these directories should be used for views or parent containers used for component composition. When thinking of views you should be considering routing - if it is something that would exist on its own route then it is most likely a good view candidate.

**/services**

All third party and in house service configurations should exist here i.e. Auth0, cloud/CDN configs, custom api connect configs, etc

**/typings**

All typescript types and interfaces

**/data**

Any exportable data or json files&#x20;

**/store**

Anything related to the global store on the front end will go here whether that be Redux or another solution

**/context**

Custom contexts should be placed here i.e. theming, language, etc

**/utilities**

All globally accessible custom utilities

**/validations**

Any custom validation configs

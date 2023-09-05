# Code Organization Agreements

* We are working with similar code organization in all three projects.  Josh will finalize the scaffolding into a more formal specification.
* We will use Cypress for integration testing.  All integration tests go in a root level tests folder.
* Within the components folder, we will organize components into their own folders.
  * Contains: component code, unit tests, and styles
  * We will break out styles for existing components, as time allows.
  * For anything new being built, break out styles by default.
* We will look for subcomponents that be broken out as we work through the code.
* Create a views folder, and break out top level components into this folder.
* We will use JSDoc to annotate the code.
* Reusable logic can be encapsulated in utilities/



* We may use Cypress or Storybook as a component library as each application team likes.
* Next.js can be used for SSR when the application is more like a web site with fruitful content.
* We will not make use of Redux at this time, we may use Redux or ReactQuery in the future.
* We will look to make reusable layouts part of our workflow in the future.

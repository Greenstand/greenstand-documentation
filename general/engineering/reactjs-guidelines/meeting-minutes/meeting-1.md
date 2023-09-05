# Meeting 1

## Saying hello

* Nick (admin panel)
* Dadior (engineering)
* Adriana (web map)
* Gwynn (admin panel)
* Zaven (engineering)

#### Other core ReactJS devs

* Carlos (admin panel, vscode video)
* Kaushal (defacto wallet web app team lead)
* Patrick (UX Dev - Web Map Application)
* Raff (UX Dev - Wallet, and probably lead of all reactjs web apps at Greenstand)

## Topics

### Rematch/Redux/React

* Should we rip out rematch?
* Should we use Redux?
* Decide this today
  * Currently we have too many different systems
  * Silo model is definitely needs to go
* Redux vs Context
  * What do we need as centralized state?
  * We do something to deal with state, a structure
  * hooks?
* Context
  * Devs know this and want to use this
  * Useful for background stuff that affects across components
  * But also used for centralized state, and then import where you need it
    * A method for exposing certain parts of state across the application
    * Needs a state model
      * User Settings / User Permissions Context
        * Organization state
      * 'global' context for other stuff we don't understand yet
* How do we migrate off redux?
  * It's going to be a large refactor
  * Cut a branch and have a couple people focus on it
  * Do it incrementally by adding a Context and moving over global stuff
  * When do we use a state controller vs using props?
    * Sometimes we could use this simple way to communicate with a component
    * With hooks you can locally use a reducer?
* Who has the bravery to take this on?
  * Gwen is wading into the soup, is happy to keep going as long as there is engineering backup
* Policies / Agreements
  * **We will use the simplest representation of state as possible in all cases**
    * Use props when possible, use context when we want to persist it
  * **Thinking about state is a crucial part of learning for junior ReactJS engineers.**
    * How do we describe what our approach to state is?
    * Let's try to find the words for our patterns?  Are there established terminologies?
      * "Avoid prop-drilling"&#x20;
        * Use smaller state trees
        * Only drill for 2 or 3 levels
      * Hooks
      * [https://blog.logrocket.com/modern-guide-react-state-patterns/](https://blog.logrocket.com/modern-guide-react-state-patterns/)
        * Patterns that are based on tools, which has limited theory

### Consistent Coding Style

* Coding style
* Component structure & architecture
  * Component Patterns

### Storybook vs Cypress - sandbox

* Dadior likes Cypress
  * Cypress unit tests
  * Works in CI, makes sure the component is good
  * Cypress includes most(all?) of what storybook can do
* Kaushal likes storybook (it works on Windows)

### Common design system for all UI

* Common library of ReactJS components
* Raff (UX of web applications) has concepts of that

### How are we running this ReactJS working group

* Nick says keeping up the momentum (2 more weeks?) would be cool
* Gwynn things so too
* Dadior says OK!  A little earlier would be good
  * _Further discussion of meeting time..._
* Adriana is very interested as well
* Next Meeting
  * Zaven make an agenda
  * Zaven invite the 2 UX designer
  * Some suggested times: [https://doodle.com/poll/cbkfkeyezgv796ek?utm\_source=poll\&utm\_medium=link](https://doodle.com/poll/cbkfkeyezgv796ek?utm\_source=poll\&utm\_medium=link)
  * Decided on Sunday June 13th at 2pm PDT (5pm EDT, &#x20;


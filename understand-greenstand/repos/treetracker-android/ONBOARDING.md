# Onboarding Guide: treetracker-android

_Generated from the Understand-Anything knowledge graph and domain graph. Source commit `0303c06`. The writer checked each claim in the source._

> The last guide described commit `949d962`. Since then, the repo got 38 commits. The app now targets API 36 and builds with JDK 25. The debug and dev builds have AppFunctions for agents. The app reads the organization from the Play install referrer. The repo has 43 end-to-end flows, CI workflows that run them, and two Claude Code skills in `.claude/skills/`.

## Project Overview

Treetracker Android is the Android app of Greenstand's Treetracker project (`README.md:17`). A grower captures trees as photos with GPS locations. The app keeps each capture on the device first. A sync sends the data to object storage later.

A file path that starts with a package folder, for example `models/` or `navigation/`, starts at `app/src/main/java/org/greenstand/android/TreeTracker/`.

The code calls a grower account `User` (`models/user/User.kt:18`). The legacy tables call a grower a planter.

- **Package**\
  Application id: `org.greenstand.android.TreeTracker` (`app/build.gradle:24`). Version name 2.2.0, base version code 197 (lines 29 to 31).\
  Gradle project: one module, `:app` (`settings.gradle:10`).\
  Entry point: `TreeTrackerApplication` (`app/src/main/AndroidManifest.xml:31`).
- **Languages and frameworks**\
  Languages: Kotlin, XML, Gradle, TOML, YAML, JSON, properties, ProGuard rules, Python, Shell, batch, text, Markdown\
  UI: Jetpack Compose with Navigation 3, CameraX, MapLibre, Coil\
  Data and wiring: Room, Koin, kotlinx.serialization, Retrofit with OkHttp, WorkManager, Kotlin coroutines\
  Services: Firebase (Analytics, Crashlytics, Installations, Remote Config), the AWS S3 SDK, Play Install Referrer\
  Tests: JUnit 4, MockK, Turbine, Robolectric, Roborazzi, Test Buddy flows\
  Release: GitHub Actions, Fastlane
- **Build levels**\
  compileSdk 37, minSdk 23, targetSdk 36 (`gradle/libs.versions.toml:3`). Android Gradle Plugin 9.1.1, Kotlin 2.3.20 (lines 8 and 9).\
  Gradle 9.5.1 (`gradle/wrapper/gradle-wrapper.properties:3`). CI uses Temurin JDK 25 (`.github/workflows/pull_request.yml:13`).\
  The Kotlin and Java target is 11 (`app/build.gradle:62`, line 240).
- **Quick start**\
  Prerequisite: JDK 25 (`docs/getting-started/prerequisites.md:5`).\
  Setup: do the "Project Setup" step of `README.md` before the first build (`README.md:26`).\
  Variant: select `dev` for development (`README.md:29`). Build it with `./gradlew assembleDev` (`docs/getting-started/common-commands.md:7`).\
  Unit tests: `./gradlew test`. It leaves out the screenshot tests. The Compose UI tests run only in `testDebugUnitTest` (`app/build.gradle:196` to line 203).\
  Screenshot tests: `./gradlew verifyRoborazziDebug` (`app/build.gradle:184`).\
  Lint: `./codeAnalysis.sh` runs `spotlessApply`, `ktlintFormat`, `ktlintCheck`, and `detekt` (`codeAnalysis.sh:6`).\
  End-to-end flows: install the debug app, then run `TB=tb bash e2e/run.sh -s <emulator-serial>` on a disposable emulator (`e2e/README.md:39` to line 47).
- **Graph size**\
  Files: 829. The graph leaves out 110 tracked files: 102 images and fonts, and 8 other files, for example `LICENSE`, `Gemfile.lock`, and the link `AGENTS.md`, which points to `CLAUDE.md`.\
  Nodes and edges: 5490 and 12418 (4035 function nodes, 626 class nodes)\
  Complexity of the file-level nodes: 105 complex, 349 moderate, 375 simple\
  Layers: 10. Tour: 15 steps.\
  Domains: 6 domains, 28 flows, 156 steps

How the parts fit:

- A screen root composable gets its ViewModel from `LocalViewModelFactory` (`dashboard/DashboardScreen.kt:87`). The factory resolves the ViewModel from Koin.
- A ViewModel calls repositories, use cases, and DAOs. These read and write the Room databases and `Preferences`.
- Each capture goes into Room first. A sync starts only when the grower taps the upload button on the dashboard.
- The sync puts photos and JSON bundles into S3 buckets through `ObjectStorageClient`.
- The app has one REST call: `GET messaging/message` for the grower inbox (`models/messages/network/MessagesApiService.kt:25`). All capture data leaves the device as files in object storage (`api/ObjectStorageClient.kt:105`, line 138). The app also sends analytics and crash data to Firebase, and it reads Firebase Remote Config (`app/build.gradle:303` to line 306).
- An organization config sets the steps of capture setup and of capture. Firebase Remote Config holds this config (`models/organization/OrgConfigProvider.kt:35`).

## Architecture Layers

The counts are file-level nodes. The bold names are the layer labels in the graph.

- **App Shell and Navigation** (18)\
  This layer holds the entry points, the root composables, the Koin modules, the Navigation 3 routes, and the controllers of the flows that the organization config sets.\
  Key files: `application/TreeTrackerApplication.kt`, `activities/TreeTrackerActivity.kt`, `di/AppModule.kt`, `root/Host.kt`, `navigation/Navigator.kt`
- **Feature Screens** (69)\
  This layer holds the Compose screens and their ViewModels: sign-up, grower and wallet select, capture and review, dashboard, map, messages, surveys, settings, and developer options.\
  Key files: `capture/TreeCaptureScreen.kt`, `dashboard/DashboardViewModel.kt`, `signup/SignupViewModel.kt`, `map/MapScreen.kt`
- **UI Foundation and Resources** (74)\
  This layer holds the shared components and dialogs, the theme, `BaseViewModel` with its event and snackbar plumbing, and the Android resources.\
  Key files: `viewmodel/BaseViewModel.kt`, `theme/CustomTheme.kt`, `view/TestTags.kt`, `view/TextButton.kt`
- **Domain Logic and Sync** (50)\
  This layer holds the models, the repositories, and the use cases of growers, organizations, sessions, and trees. It also holds GPS convergence, the two flow scopes, the uploaders, and the sync worker.\
  Key files: `models/TreeCapturer.kt`, `models/organization/OrgRepo.kt`, `usecases/SyncDataUseCase.kt`, `models/TreeUploader.kt`, `background/TreeSyncWorker.kt`
- **Data Sources** (62)\
  This layer holds the Room databases with their DAOs, entities, migrations, and schema exports. It also holds `Preferences`, `ObjectStorageClient`, and the request and response models.\
  Key files: `database/AppDatabase.kt`, `database/TreeTrackerDAO.kt`, `api/ObjectStorageClient.kt`, `preferences/Preferences.kt`
- **Shared Utilities and Telemetry** (16)\
  This layer holds the helpers for images, time, GPS, and validation, and the Firebase Analytics and Crashlytics wrappers.\
  Key files: `utilities/ImageUtils.kt`, `analytics/Analytics.kt`
- **Unit and UI Tests** (268)\
  This layer holds the JVM unit tests, the Robolectric Compose UI tests, the Roborazzi screenshot tests, the shared test rules and fakes, and the tests of the AppFunctions code in `app/src/testDebug/`.\
  Key files: `app/src/test/.../MainCoroutineRule.kt`, `app/src/test/.../uitest/ComposeUiTest.kt`, `app/src/test/.../di/KoinGraphTest.kt`
- **E2E and Agent Tooling** (140)\
  This layer holds the Test Buddy flows and their run, seed, and CI scripts, the screen tour, the debug-only E2E activity and AppFunctions, and the Claude Code skills with their evals.\
  Key files: `e2e/run.sh`, `e2e/ci/affected.py`, `app/src/debug/.../e2e/E2eActivity.kt`, `app/src/debug/.../appfunctions/AgentAppFunctions.kt`, `.claude/skills/agent-app-functions/scripts/app_fn.sh`
- **Build, CI and Release** (48)\
  This layer holds the Gradle scripts, the version catalog, the lint and format settings, the Fastlane lanes, the GitHub Actions workflows, and the issue and pull request templates.\
  Key files: `app/build.gradle`, `gradle/libs.versions.toml`, `.github/workflows/pull_request.yml`, `.github/workflows/android-e2e.yml`, `fastlane/Fastfile`
- **Documentation** (84)\
  This layer holds the README, `CLAUDE.md`, the engineering, product, testing, and release docs, and the task records in `docs/tasks/`.\
  Key files: `README.md`, `CLAUDE.md`, `docs/engineering/architecture.md`, `docs/testing/testing.md`

## Key Concepts

- **Koin wires the app.**\
  `TreeTrackerApplication` starts Firebase and `ObjectStorageClient`. Then it starts Koin with `appModule`, `roomModule`, and `networkModule` (`application/TreeTrackerApplication.kt:39` to line 52).\
  `appModule` declares 18 ViewModels (`di/AppModule.kt:110` to line 155), the repositories, the uploaders, the use cases, and two scopes (lines 291 to 300). Use it as an index of the app.\
  `KoinGraphTest` starts the three real modules and checks that each definition resolves (`app/src/test/.../di/KoinGraphTest.kt:124`).
- **Each screen has a stateful root and a stateless UI.**\
  `BaseViewModel<S, A : Action>` holds the state in a `StateFlow`. It sends one-shot events through a `SharedFlow` that replays 5 events (`viewmodel/BaseViewModel.kt:40` to line 51, line 92). A screen sends each UI action to `handleAction` (line 87).\
  The root composable gets the ViewModel, for example `DashboardScreen` (`dashboard/DashboardScreen.kt:86`). The stateless composable draws the state, for example `Dashboard` (line 120). `docs/engineering/architecture.md:65` explains this split.
- **Navigation 3 uses typed routes.**\
  `Host` keeps a saveable back stack (`root/Host.kt:114`) and maps each route type to its screen (lines 133 to 185). `navigation/Routes.kt` holds the route types.\
  `Navigator` has throttled variants that stop a double tap. In the app, `rememberScreenTrackingNavEntryDecorator` binds a navigator to the back stack entry of each screen. A throttled call from that navigator goes through only while its screen is on top (`navigation/Navigator.kt:77` to line 84). A navigator without this binding, for example in a test, waits 300 ms after each change (lines 85 to 87, line 233).\
  `BaseViewModel.navigate` uses the throttled variant (`viewmodel/BaseViewModel.kt:67`).
- **An organization sets the capture steps.**\
  An organization has a setup flow and a capture flow. Each flow is a list of `Destination` steps with a route string.\
  The default organization is Greenstand. Its setup flow is the grower select step (`UserSelectRoute`), then the add organization step (`AddOrgRoute`). Its capture flow is the camera, then image review (`models/organization/OrgRepo.kt:69` to line 94).\
  `RouteRegistry` maps the route strings to typed routes and accepts aliases such as `tree-capture` (`navigation/RouteRegistry.kt:25` to line 41). `OrgRepo` drops unknown routes (`models/organization/OrgRepo.kt:192`).\
  The only organization feature today is `forceNote` (`models/organization/OrgFeature.kt:27`).
- **An organization link selects the organization.**\
  The deep link is `app://mobile.treetracker.org/org?id=...&name=...` (`navigation/OrgDeepLink.kt:25`). The app reads it only at cold start.\
  Without a deep link, the splash reads the Play install referrer once. It looks for `org_id` and `org_name` (`models/organization/InstallReferrerOrg.kt:78`). It waits 3 seconds (line 81). If the referrer is unavailable, it tries again at the next launch (line 67).\
  Then `OrgConfigProvider` reads the key `org_<id>` from Remote Config and waits at most 10 seconds (`models/organization/OrgConfigProvider.kt:34` to line 69). With no config, the app adds a minimal organization (`splash/SplashScreenViewModel.kt:79` to line 87).\
  `OrgRepo` keeps the current organization only in memory. So `Root` reloads it before it shows `Host` (`root/Root.kt:69` to line 104).
- **Two Koin scopes hold one setup run and one capture run.**\
  `CaptureSetupScopeManager` opens a scope with `CaptureSetupData` and `CaptureSetupNavigationController` (`models/setupflow/SetupScope.kt:24`, `di/AppModule.kt:291`). `CaptureSetupData` holds the grower of the setup (`CaptureSetupData.user`), the destination wallet, the session note, and the organization name.\
  At the end of setup, the controller enables the step counter and the orientation sensor. It starts the session and the GPS updates, then opens the camera (`navigation/CaptureSetupNavigationController.kt:60` to line 76).\
  `CaptureFlowScopeManager` opens a scope with `CaptureFlowData`, `CaptureFlowNavigationController`, and `TreeCapturer` (`di/AppModule.kt:296`). After the last capture step, the controller saves the tree and goes back to the camera (`navigation/CaptureFlowNavigationController.kt:48` to line 62).
- **The app waits for GPS convergence.**\
  `LocationDataCapturer` keeps a window of recent fixes. The location converges when the standard deviations of longitude and latitude are below their thresholds (`models/location/LocationDataCapturer.kt:114` to line 120).\
  The defaults are 5 fixes, 0.00001 degrees, and a 20-second timeout (`devoptions/DevPrefKeys.kt:59` to line 85). After the timeout, capture uses the last computed position (`models/location/LocationDataCapturer.kt:184` to line 201).\
  `TreeCaptureViewModel` waits at most 30 seconds for this location before it accepts the photo (`capture/TreeCaptureViewModel.kt:124` to line 148, line 168).
- **The app survives process death.**\
  Navigation 3 restores the back stack, but the two scopes live only in memory.\
  `TreeCapturer` keeps the unsaved tree in `PendingTreeStore` (`models/TreeCapturer.kt:76`). `CaptureFlowScopeManager.restoreAt` reopens the capture scope with that tree (`models/captureflowdata/CaptureFlowScope.kt:49`).\
  `CaptureSetupRestorer` reopens the setup scope and reloads the grower of the setup (`models/setupflow/CaptureSetupRestorer.kt:42` to line 74). `SessionTracker` resumes the session from its saved id (`models/SessionTracker.kt:124`).
- **Room holds two schema generations.**\
  `AppDatabase` is at version 9 with 11 entities (`database/AppDatabase.kt:43` to line 58). Five legacy V1 entities hold grower data (`PlanterInfoEntity`), check-ins, tree captures, tree attributes, and location data. Six V2 entities hold sessions, growers (`UserEntity`), locations, trees, device configs, and organizations.\
  Hand-written migrations go from version 3 to version 7. Room auto migrations go from 7 to 8 and from 8 to 9 (lines 59 to 65, lines 110 to 116). The legacy tables come from the 1.x releases (line 60).\
  The tree save of a capture writes only the V2 `tree` table (`usecases/CreateTreeUseCase.kt:32` to line 50). The GPS points of the capture go to the V2 `location` table (`models/location/LocationDataCapturer.kt:141` to line 146). In the app code, only `CreateFakeTreesUseCase` writes V1 rows (`usecases/CreateFakeTreesUseCase.kt:154`, line 190).\
  Messages use a second database, `treetracker.messages.db` (`models/messages/database/MessageDatabase.kt:59`).\
  `TreeTrackerDAO` has 91 functions. 71 of them are `@Query` functions. 50 files import `TreeTrackerDAO`.
- **A sync runs in a fixed order and stops at the first step that throws.**\
  The order is messages, device config, growers (`SyncStep.USERS`), sessions, legacy trees, trees, and GPS locations (`usecases/SyncDataUseCase.kt:61` to line 91).\
  When a step throws, the later steps do not run. The use case then returns false (lines 96 to 99, lines 140 to 155).\
  The location step catches its own upload errors. So it does not stop the sync (`usecases/UploadLocationDataUseCase.kt:87` to line 100).\
  The tree steps work in windows of 50 trees (`models/TreeUploader.kt:79`, line 227). For each window, the uploader puts the photos, puts one JSON bundle, marks the rows as uploaded, and deletes the local photos (lines 63 to 72, lines 178 to 209).\
  A failed window stays in the queue. Then the step fails with "Some trees failed to upload; retry sync to resume" (`usecases/SyncDataUseCase.kt:128`).
- **Object storage is AWS S3.**\
  The release, prerelease, debug, and beta types set `USE_AWS_S3` to true (`app/build.gradle:77`, lines 93, 107, and 120). The dev type copies the debug type (line 130).\
  So `ObjectStorageClient` uses an S3 client in the region `eu-central-1` (`api/ObjectStorageClient.kt:57` to line 68, `app/build.gradle:36`).\
  The release and prerelease builds use the production buckets. The debug and beta builds use the test buckets. The dev build uses the dev buckets (`app/build.gradle:75`, lines 91, 105, 118, and 134).
- **The build type turns on the debug tools.**\
  `FeatureFlags.DEBUG_ENABLED` is true for the debug and dev builds. `FeatureFlags.BETA` is true for the beta build (`models/FeatureFlags.kt:21` to line 25).\
  Only in the debug and dev builds: the debug overlays (`root/Host.kt:189`), Log out and Delete Account in Settings (`settings/SettingsScreen.kt:167` to line 185), and the agent AppFunctions and the E2E activity (`app/build.gradle:144` to line 151, `app/src/debug/AndroidManifest.xml:12` to line 41).\
  Only in the debug, dev, and beta builds: Map in Settings (`settings/SettingsScreen.kt:148`), the developer options on a long press of the top bar logo (`view/Text.kt:65`), and a button that makes 50 fake trees (`capture/TreeCaptureScreen.kt:228`, `capture/TreeCaptureViewModel.kt:158`).
- **`TestTags` connects the screens, the tests, and the flows.**\
  `TestTags` names the controls (`view/TestTags.kt:40`). `exposeTestTags()` makes the tags resource ids (line 32). `Root` sets it on the whole app (`root/Root.kt:99`).\
  The end-to-end flows tap the controls by these ids (`e2e/README.md:90` to line 105). 30 app files and 21 test files import `TestTags`.

## Guided Tour

The tour has 15 steps. The bold names are the tour titles in the graph.

1. **Project Overview**\
   Files: `README.md`, `docs/getting-started/project-overview.md`, `docs/product/user-stories.md`\
   What to see: `docs/product/user-stories.md` lists the field limits that shape the app: offline work, battery life, GPS, poor connectivity, low literacy, and shared devices (`docs/product/user-stories.md:7` to line 32).
2. **Architecture and Docs Map**\
   Files: `docs/engineering/architecture.md`, `docs/engineering/package-structure.md`, `CLAUDE.md`\
   What to see: `CLAUDE.md` is the table of contents of the docs (`CLAUDE.md:3`). It tells you to make a task folder in `docs/tasks/` for each unit of work (line 7). For a fix or feature PR, it tells you to follow the `pr-validating-flow` skill (line 9).
3. **App Startup and Entry Points**\
   Files: `app/src/main/AndroidManifest.xml`, `application/TreeTrackerApplication.kt`, `activities/TreeTrackerActivity.kt`\
   What to see: the manifest declares the WorkManager foreground service with the type `dataSync` (line 43). `TreeTrackerActivity` reads the start route from the intent (line 52). It shows `Root`, or a dialog on a device with no GPS (lines 56 to 59).
4. **Dependency Wiring with Koin**\
   Files: `di/AppModule.kt`, `di/RoomModule.kt`, `di/NetworkModule.kt`\
   What to see: `RoomModule` registers `AppDatabase`, its DAOs, and `MessageDatabase` (`di/RoomModule.kt:25` to line 45). `NetworkModule` registers Retrofit and `MessagesApiService` (`di/NetworkModule.kt:26`).
5. **Compose Root and Navigation**\
   Files: `root/Root.kt`, `root/Host.kt`, `navigation/Routes.kt`, `navigation/Navigator.kt`, `navigation/RouteRegistry.kt`\
   What to see: `Root` provides `LocalViewModelFactory` and the snackbar controller (`root/Root.kt:95` to line 98). It shows the splash until the organization is ready (line 100).
6. **Screen Building Blocks**\
   Files: `viewmodel/BaseViewModel.kt`, `theme/CustomTheme.kt`, `view/TestTags.kt`, `dashboard/DashboardScreen.kt`, `dashboard/DashboardViewModel.kt`\
   What to see: `CustomTheme` uses the Montserrat font (`theme/CustomTheme.kt:81`). `DashboardViewModel` combines four Room count flows (`dashboard/DashboardViewModel.kt:181`). It shows a sync reminder at 2000 or more trees that wait for upload (line 197).
7. **Growers and Organizations**\
   Files: `models/user/User.kt`, `models/organization/OrgRepo.kt`, `models/organization/OrgConfigProvider.kt`, `splash/SplashScreenViewModel.kt`, `docs/product/org-links.md`\
   What to see: a `User` has an id, a wallet, a tree count, names, a photo path, an admin flag (`isPowerUser`), and an unread-messages flag (`models/user/User.kt:18` to line 27). The splash saves the device config, resolves the organization link, and syncs messages when online (`splash/SplashScreenViewModel.kt:71` to line 94).
8. **Capture Setup Flow**\
   Files: `navigation/CaptureSetupNavigationController.kt`, `models/setupflow/SetupScope.kt`, `models/setupflow/CaptureSetupData.kt`, `models/SessionTracker.kt`, `docs/engineering/navigation-flows.md`\
   What to see: system back does not call `navBackward`. So `navForward` reads the step index again from the back stack (`navigation/CaptureSetupNavigationController.kt:89` to line 105).
9. **GPS Convergence**\
   Files: `models/location/LocationDataCapturer.kt`, `models/location/Convergence.kt`, `models/ConvergenceConfiguration.kt`, `docs/product/add-tree-flow.md`\
   What to see: `Convergence` updates the mean and the variance as the window slides (`models/location/Convergence.kt:46`). `LocationDataCapturer` also stores each fix of the session as a track point (`models/location/LocationDataCapturer.kt:126` to line 147).
10. **Tree Capture Flow**\
   Files: `capture/TreeCaptureScreen.kt`, `capture/TreeCaptureViewModel.kt`, `models/TreeCapturer.kt`, `navigation/CaptureFlowNavigationController.kt`, `models/captureflowdata/CaptureFlowScope.kt`\
   What to see: `TreeCapturer.setImage` adds the step counts and the rotation matrix to the tree (`models/TreeCapturer.kt:67` to line 74). `saveTree` writes the tree through `CreateTreeUseCase` (line 114).
11. **Local Storage with Room**\
   Files: `database/AppDatabase.kt`, `database/TreeTrackerDAO.kt`, `database/entity/TreeEntity.kt`, `app/schemas/.../AppDatabase/9.json`, `preferences/Preferences.kt`\
   What to see: the schema export `9.json` has 11 tables. The last one is `organization` (line 927). `Preferences` has typed getters, `Flow` observers, and `clearSessionData` (`preferences/Preferences.kt:45` to line 92).
12. **Background Sync to the Backend**\
   Files: `background/TreeSyncWorker.kt`, `usecases/SyncDataUseCase.kt`, `models/TreeUploader.kt`, `api/ObjectStorageClient.kt`, `docs/engineering/data-sync-architecture.md`\
   What to see: `TreeSyncWorker` runs as foreground work and updates the notification every 750 ms (`background/TreeSyncWorker.kt:55` to line 71). The dashboard starts it as unique work with the policy `KEEP` (`dashboard/DashboardViewModel.kt:227`). A second tap cancels it (line 171).
13. **Build Variants and Feature Flags**\
   Files: `app/build.gradle`, `docs/getting-started/build-variants.md`, `models/FeatureFlags.kt`, `gradle/libs.versions.toml`\
   What to see: the build types are release, prerelease, debug, beta, and dev (`app/build.gradle:70` to line 141).\
   Note: `FeatureFlags` also reads six more `BuildConfig` switches: tree height, tree note, DBH, automatic sign-out, blur detection, and organization link (`models/FeatureFlags.kt:26` to line 31). No app code reads these six switches. The organization config sets the tree height step and the forced note.
14. **Unit and UI Tests**\
   Files: `docs/testing/testing.md`, `app/src/test/.../MainCoroutineRule.kt`, `app/src/test/.../uitest/ComposeUiTest.kt`, `app/src/test/.../di/KoinGraphTest.kt`\
   What to see: `MainCoroutineRule` sets `Dispatchers.Main` to an `UnconfinedTestDispatcher` (`MainCoroutineRule.kt:29` to line 32). 52 test files import it. `ComposeUiTest` gives each UI test a real `Navigator` over a back stack that the test can read (`docs/testing/testing.md:21`). 75 test files import it.
15. **End-to-End Flows and CI**\
   Files: `e2e/README.md`, `e2e/run.sh`, `e2e/flows/subflows/signup.yaml`, `.github/workflows/pull_request.yml`, `.github/workflows/android-e2e.yml`\
   What to see: `run.sh` turns on airplane mode and turns off Wi-Fi (`e2e/run.sh:33`). It runs the flows, then the organization flows, then the seeded `dev-tools` flows (lines 37 to 42). It skips the `known-bug` flows.

## File Map (by layer)

**App Shell and Navigation**

- `application/TreeTrackerApplication.kt`: this class starts Firebase, `ObjectStorageClient`, Koin, and Timber.
- `activities/TreeTrackerActivity.kt`: this activity is the single launcher. It shows `Root` inside `CustomTheme`.
- `activities/ImageCaptureActivity.kt`: this activity runs the selfie capture. `CaptureImageContract` returns the photo path (line 47).
- `di/AppModule.kt`, `di/RoomModule.kt`, `di/NetworkModule.kt`: these are the three Koin modules.
- `root/Root.kt`, `root/Host.kt`: `Root` reloads the organization and provides the composition locals. `Host` holds the back stack and the screen map.
- `navigation/Navigator.kt`, `navigation/Routes.kt`, `navigation/RouteRegistry.kt`, `navigation/OrgDeepLink.kt`: these files hold the navigation layer, the typed routes, the route strings of the organization config, and the deep link parser.
- `navigation/CaptureSetupNavigationController.kt`, `navigation/CaptureFlowNavigationController.kt`, `navigation/FlowNavigationController.kt`: these classes walk the steps that the organization config sets.

**Feature Screens**

- `capture/`: the camera screen, image review, and their ViewModels.
- `signup/`: the sign-up screens. `CredentialEntryView.kt` is the phone or email step.
- `dashboard/`: the home screen with the counts, the upload button, messages, and Track.
- `userselect/`, `walletselect/`, `orgpicker/`, `sessionnote/`, `treeheight/`: the setup and capture steps.
- `messages/`: the inbox, chat, announcement, and survey screens.
- `map/`: the MapLibre map of trees and session paths.
- `settings/`, `profile/`, `treeedit/`, `languagepicker/`, `devoptions/`, `overlay/`: settings, profiles, tree edit, language, developer options, and the debug overlays.

**UI Foundation and Resources**

- `viewmodel/BaseViewModel.kt`, `viewmodel/Action.kt`: the base ViewModel and the marker interface of the actions.
- `theme/CustomTheme.kt`: the colors and the Montserrat text styles.
- `view/TestTags.kt`: the test tags of all screens.
- `view/TextButton.kt`: `TreeTrackerButton`, the base button of the app.
- `app/src/main/res/`: strings, drawables, and XML resources.

**Domain Logic and Sync**

- `models/organization/`: `OrgRepo`, `OrgConfigProvider`, the install referrer reader, `OrgFeature`, and the debug overrides in `OrgOverrides.kt`.
- `models/setupflow/`, `models/captureflowdata/`: the two scopes and the restore helpers.
- `models/TreeCapturer.kt`, `models/PendingTreeStore.kt`, `models/SessionTracker.kt`: the capture of one tree and the session lifecycle.
- `models/location/`: GPS updates, convergence, and track points.
- `models/user/UserRepo.kt`: the grower accounts.
- `models/messages/MessagesRepo.kt`: the inbox data and the message sync.
- `models/TreeUploader.kt`, `models/PlanterUploader.kt`, `models/SessionUploader.kt`, `models/DeviceConfigUploader.kt`, `models/messages/MessageUploader.kt`: the uploaders of the sync.
- `usecases/`: `SyncDataUseCase`, `CreateTreeUseCase`, `UploadImageUseCase`, `UploadLocationDataUseCase`, and others.
- `background/TreeSyncWorker.kt`, `background/SyncNotificationManager.kt`: the sync worker and its notification.

**Data Sources**

- `database/AppDatabase.kt`, `database/Migrations.kt`: the main database and its hand-written migrations.
- `database/TreeTrackerDAO.kt`, `database/dao/`: the large DAO and seven smaller DAOs.
- `database/entity/`, `database/legacy/`: the V2 entities and the legacy V1 entities.
- `app/schemas/`: the Room schema exports. `AppDatabase` has versions 1, 2, 3, 4, 6, 7, 8, and 9. `MessageDatabase` has version 1.
- `models/messages/database/`, `models/messages/network/`: the message database and the Retrofit service.
- `preferences/`: `Preferences` and the typed preference keys.
- `api/ObjectStorageClient.kt`: the S3 client for photos and bundles.

**Shared Utilities and Telemetry**

- `utilities/ImageUtils.kt`: image files, decode, rotate, resize, and Base64.
- `analytics/`: `Analytics`, `ExceptionLogger` (the Timber tree of the release, prerelease, and beta builds), and `ExceptionDataCollector`.
- `utils/`, `utilities/`: the other helpers.

**Unit and UI Tests**

- `app/src/test/`: the unit tests mirror the main packages.
- `app/src/test/.../uitest/`: the Compose UI tests.
- `app/src/test/.../screenshot/`, `app/src/test/snapshots/`: the screenshot tests and their committed golden images.
- `app/src/testDebug/`: the tests of the AppFunctions helpers.

**E2E and Agent Tooling**

- `e2e/flows/`: 43 flows. The sub-flows are in `e2e/flows/subflows/`.
- `e2e/run.sh`, `e2e/run-org.sh`, `e2e/seed-org.sh`, `e2e/setup-device.sh`: the local and CI runners and the seed scripts.
- `e2e/ci/`: the scripts of the flow runner and of the affected-flows check, with their Python tests.
- `e2e/tour/tour.sh`: the screen tour.
- `app/src/debug/`: `AgentAppFunctions` (`createAccount`, `captureTrees`) and `E2eActivity` for `treetracker-e2e://` links.
- `.claude/skills/agent-app-functions/`, `.claude/skills/pr-validating-flow/`: the two Claude Code skills.

**Build, CI and Release**

- `app/build.gradle`, `build.gradle`, `settings.gradle`, `gradle/libs.versions.toml`: the build and the versions.
- `detekt.yml`, `spotless/`, `codeAnalysis.sh`: the lint and format settings.
- `fastlane/`: the Fastlane lanes.
- `.github/workflows/`: 14 workflows and 4 composite actions.
- `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`: the templates.

**Documentation**

- `README.md`, `CLAUDE.md` (also `AGENTS.md`): the start pages.
- `docs/getting-started/`, `docs/engineering/`, `docs/product/`, `docs/testing/`, `docs/release/`: the guides.
- `docs/tasks/`: 46 task folders.

## Complexity Hotspots

The graph rates 105 file-level nodes as complex. 69 of them are tests. The groups below need care.

- **Sync and upload**\
  Files: `usecases/SyncDataUseCase.kt` (169 lines), `models/TreeUploader.kt` (228), `models/messages/MessagesRepo.kt` (289)\
  Why: a step that throws stops the sync. A failed tree window stays in the queue.\
  Note: the V2 tree bundle sends `stepCount`, `deltaStepCount`, `rotationMatrix`, and `extraAttributes` as null (`models/TreeUploader.kt:192` to line 195). The tree row keeps these values on the device (`usecases/CreateTreeUseCase.kt:44`).
- **Data access**\
  Files: `database/TreeTrackerDAO.kt` (384), `database/Migrations.kt` (277), `app/schemas/.../9.json` (982)\
  Why: many classes share one DAO. A bad migration breaks the upgrade of old installs. The 7 to 8 auto migration must stay (`database/AppDatabase.kt:60` to line 62).
- **Wiring and navigation**\
  Files: `di/AppModule.kt` (300), `navigation/Navigator.kt` (234)\
  Why: a change in `AppModule` reaches most classes. The throttle rules of `Navigator` stop double taps.
- **Organization config and capture state**\
  Files: `models/organization/OrgRepo.kt` (231), `models/organization/OrgOverrides.kt` (238), `models/location/LocationDataCapturer.kt` (220)\
  Why: the organization config decides the steps of each flow. GPS convergence decides when `TreeCaptureViewModel` accepts a photo.\
  Note: the wallet that a grower picks in the wallet select step goes into `CaptureSetupData.destinationWallet` (`walletselect/WalletSelectViewModel.kt:87`). No code reads it for the session. The session destination wallet is always the wallet of the grower (`models/SessionTracker.kt:86`), because `UserEntity.wallet` is a non-null `String` (`database/entity/UserEntity.kt:28`).
- **Large screens and ViewModels**\
  Files: `dashboard/DashboardScreen.kt` (458), `signup/CredentialEntryView.kt` (458), `map/MapScreen.kt` (326), `capture/TreeCaptureScreen.kt` (316), `devoptions/DevOptionsViewModel.kt` (264), `signup/SignupViewModel.kt` (247)\
  Why: these files hold the most UI state.\
  Note: sign-up enables Next for an email when the text has `@` (`signup/SignupViewModel.kt:147`). For a phone, it uses `Validation.isValidPhoneNumber` (line 156).
- **Image code**\
  Files: `utilities/ImageUtils.kt` (605)\
  Why: this is the largest app file. Its blur helpers (`brennersFocusMetric`, `applyGaussianKernel`) have no caller in the app code.
- **CI flow tooling**\
  Files: `e2e/ci/affected.py` (705), `.github/workflows/e2e-affected.yml` (440), `.github/workflows/flow-runner-job.yml` (384), `e2e/ci/run-flows.sh` (333)\
  Why: these files pick and run the flows for each PR.
- **Stale docs and scripts**\
  `CLAUDE.md:63` and line 64 link `docs/process/task-workflow.md` and `docs/tasks/README.md`. Neither file exists.\
  `docs/getting-started/common-commands.md:27` runs `connectedDebugAndroidTest`. The repo has no `app/src/androidTest/` folder.\
  `README.md:29` says that `dev` adds trees without a specific accuracy. No code reads the build type for GPS accuracy. The convergence defaults are the same for all build types.\
  `docs/getting-started/build-variants.md:6` says that the debug build has blur detection. No app code reads `BLUR_DETECTION_ENABLED`.\
  The Fastlane lane `bump_version_code` searches `versionCode` and a number (`fastlane/Fastfile:95`). `app/build.gradle` no longer has this text (lines 29 and 30), so the lane cannot bump the code. `firebase_beta`, `deploy`, and `bump_version_code_and_push` call this lane.

## Business Domains

`domain-graph.json` has 6 domains, 28 flows, and 156 steps. The bold names are the flow labels in the graph.

**Tree Capture**: this domain covers the field work of a grower, from setup to a saved tree.

- **Start Capture Session** (entry: the Track button on the dashboard)\
  The grower select step opens the setup scope and starts the GPS updates (`userselect/UserSelectViewModel.kt:120`). The setup steps of the organization follow. The last step creates the session row with the organization name and the session note (`models/SessionTracker.kt:44` to line 93).
- **Capture Tree Photo with Converged GPS** (entry: the capture button on `TreeCaptureRoute`)\
  The ViewModel pins a location. It accepts the photo only when `pinLocation` finds a coordinate (`models/TreeCapturer.kt:43`, `capture/TreeCaptureViewModel.kt:131` to line 137). `TreeCapturer` builds the tree with the sensor attributes.
- **Review, Annotate and Save Tree** (entry: the capture steps after the photo)\
  Image review forces a note when the organization sets `forceNote` (`capture/TreeImageReviewViewModel.kt:66`). The tree height step stores the color index as an attribute (`treeheight/TreeHeightViewModel.kt:61`). After the last step, the app saves the tree. Leaving capture ends the session.
- **Restore Interrupted Capture** (entry: Navigation 3 restores a setup or capture screen after process death)\
  The app reloads the kept tree and the grower of the setup. If `TreeCapturer` has no tree after the restore, the image review sends the grower to the dashboard (`capture/TreeImageReviewViewModel.kt:73` to line 76).
- **Edit Saved Trees** (entry: Settings, Edit Trees)\
  The grower opens the trees of a wallet. The grower can change the note or delete the tree only before upload (`treeedit/TreeDetailScreen.kt:175`, line 187).

**Grower Onboarding & Identity**: this domain covers how a grower signs up and changes the profile on the device.

- **First Launch Bootstrap** (entry: `SplashRoute`)\
  With no admin, the splash opens the language picker and then sign-up. Otherwise it opens the dashboard (`splash/SplashScreen.kt:87` to line 94).
- **Grower Sign-Up** (entry: `SignupFlowRoute`, or the add button of the grower select step)\
  The grower types a phone or an email as the wallet, then the names, then takes a selfie. `SignupViewModel.createUser` saves no grower without a selfie (`signup/SignupViewModel.kt:225` to line 240). The first grower on the device becomes the admin (line 236).
- **Edit Grower Profile** (entry: Settings, View/Edit Profile)\
  The grower changes the names or the photo. The phone and the email stay as registered. The registration uploads again (`models/user/UserRepo.kt:138` to line 154).
- **Delete Grower Profile** (entry: Settings, Delete Account, only in the debug and dev builds)\
  The app deletes the grower on the device (`UserRepo.deleteUser`). It queues a message to `admin` that asks for the deletion of the data of the grower (`userselect/UserSelectViewModel.kt:150` to line 158).

**Organization & Wallet Selection**: this domain decides the organization of the device and the steps of its capture.

- **Join Organization from Org Link** (entry: the organization deep link, or the Play install referrer at first launch)\
  The app reads the organization id and name, fetches the organization config, and stores and selects the organization. `OrgRepo` drops unknown routes.
- **Apply Org Flow Configuration** (entry: the `Root` gate at app start, and each new setup or capture scope)\
  `OrgRepo.currentOrg()` returns the organization with the debug overrides on top (`models/organization/OrgRepo.kt:113`). The overrides apply only in the debug and dev builds (`models/organization/OrgOverrides.kt:207`).
- **Select Destination Wallet** (entry: the wallet select step, when the setup flow of the organization has it)\
  The grower picks the wallet of a grower on the device or types a new wallet name. The default organization does not have this step (`models/organization/OrgRepo.kt:79`).
- **Enter Session Organization** (entry: the add organization step)\
  The grower types an organization name or uses the previous one (`orgpicker/AddOrgViewModel.kt:87` to line 103). The session row stores it (`models/SessionTracker.kt:89`).

**Data Sync & Upload**: this domain moves the data from the device to object storage.

- **Run Data Sync** (entry: the upload button on the dashboard)\
  In the release, prerelease, and beta builds, the button shows the snackbar "Nothing to Sync" when no tree waits (`dashboard/DashboardViewModel.kt:159` to line 163). The worker runs the steps in order.
- **Upload Trees and Photos** (entry: the `TREES` step)\
  The uploader puts the photos first, then a V2 bundle, then deletes the local photos.
- **Upload Device Config, Growers and Sessions** (entry: the `DEVICE_CONFIG`, `USERS`, and `SESSIONS` steps)\
  The app saves a new device config at startup when the app version, build, OS, or SDK changes (`models/DeviceConfigUpdater.kt:31`). The uploaders put the grower photos. They send the device configs, the wallet registrations, and the sessions as V2 bundles.
- **Record and Upload GPS Tracks** (entry: the `LOCATIONS` step)\
  The app groups the track points by session, uploads them, and then deletes the uploaded points (`usecases/UploadLocationDataUseCase.kt:83`). After an upload error, the points stay for the next sync, and the sync continues.
- **Upload Legacy V1 Captures** (entry: the `USERS` and `LEGACY_TREES` steps)\
  The uploaders put the legacy check-in photos and tree photos. They send the grower registrations of the legacy schema (`PlanterUploader`) and the legacy tree captures as V1 bundles.

**Grower Messaging**: this domain gives each grower an inbox of messages, announcements, and surveys.

- **Sync Messages** (entry: the Messages button, the splash, and the first sync step)\
  The app fetches messages for each wallet on the device in pages of 100. Then it uploads the queued messages (`models/messages/MessagesRepo.kt:139` to line 172).
- **Browse Grower Inbox** (entry: the Messages button on the dashboard)\
  The grower picks a profile. The inbox shows the chats, the surveys, and the announcements.
- **Direct Message Chat** (entry: a chat in the inbox)\
  The chat marks the messages as read and queues the messages that the grower sends (`messages/directmessages/ChatViewModel.kt:66` to line 79).
- **Read Announcement** (entry: an announcement in the inbox)\
  The screen shows one announcement and marks it as read.
- **Answer Survey** (entry: a survey in the inbox)\
  The grower answers one question at a time. The app saves the answers for upload (`messages/survey/SurveyViewModel.kt:95`).

**Dashboard, Map & App Settings**: this domain covers the home screen, the map, the settings, and the language.

- **View Dashboard** (entry: `DashboardRoute`)\
  The dashboard shows the synced and waiting tree counts and the unread message badge.
- **View Tree Map** (entry: Settings, Map, only in the debug, dev, and beta builds)\
  The map shows each tree of the V2 `tree` table and the GPS points of its session that are still on the device (`map/MapViewModel.kt:91` to line 111).
- **Manage App Settings** (entry: the settings icon on the dashboard)\
  Settings opens profiles, tree edit, and the privacy policy. The other entries depend on the build type.
- **Change App Language** (entry: the language button in the top bar)\
  The app has English, Swahili, and Portuguese (`models/LanguageSwitcher.kt:30` to line 32). It sets the locale through `AppCompatDelegate` (line 56).
- **Tune Developer Options** (entry: a long press on the top bar logo, only in the debug, dev, and beta builds)\
  Testers change stored values such as the convergence thresholds. They can also override the steps, the features, and the wallet of the current organization.

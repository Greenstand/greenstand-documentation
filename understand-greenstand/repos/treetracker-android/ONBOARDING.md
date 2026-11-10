# Onboarding Guide: treetracker-android

_Generated from the Understand-Anything knowledge graph. Source commit `949d962`._

## Project Overview

**Treetracker Android** is Greenstand's native Android app for the Treetracker reforestation
platform. Growers register tree captures (photos and GPS), manage grower accounts and wallets,
and sync captured data to the Greenstand backend. The app works offline first: captures live in
a local Room database and upload in the background when a connection is available.

- **Languages:** Kotlin, XML, Gradle, TOML, YAML, JSON, properties, shell, batch, Markdown
- **Frameworks:** Jetpack Compose, Koin, Room, Retrofit, OkHttp, Kotlin Coroutines, Kotlinx
  Serialization, Firebase, AWS S3 SDK, Coil, CameraX, MapLibre
- **Entry point:** `TreeTrackerApplication.kt` (Android `Application` class)

The app follows a layered MVVM flow: **Compose screen → ViewModel → use case → repository/DAO →
Room / API / S3**, with WorkManager driving background sync and Koin wiring everything together.

## Architecture Layers

- **Presentation & UI**\
  Files: 153\
  What it holds: Jetpack Compose feature screens, ViewModels, the navigation host, theming, camera/map UI, and Android resources for capture, signup, dashboard, and messaging flows.
- **Domain (Use Cases)**\
  Files: 9\
  What it holds: Business-logic use cases that orchestrate capture upload, sync, and account workflows between the presentation and data layers.
- **Data & Persistence**\
  Files: 101\
  What it holds: Room database, Retrofit API clients, repositories and data models, preferences, background sync workers, analytics, and Room schema snapshots.
- **Core, DI & Utilities**\
  Files: 16\
  What it holds: Koin dependency-injection modules, the `Application` entry point, and shared utility/helper code used across all layers.
- **Testing**\
  Files: 77\
  What it holds: Unit, Robolectric, screenshot, and instrumented Espresso tests plus test fakes under `src/test` and `src/androidTest`.
- **Build & Tooling**\
  Files: 24\
  What it holds: Gradle build scripts, the version catalog, manifest, ProGuard, Fastlane, Spotless, and shell/config tooling for building and releasing.
- **CI/CD**\
  Files: 21\
  What it holds: GitHub Actions workflows and composite actions for build, test, versioning, and Play Store / Firebase deployment, plus issue/PR templates.
- **Documentation**\
  Files: 44\
  What it holds: Engineering, product, getting-started, and task documentation in Markdown.

## Key Concepts

- **DI-driven wiring.** `TreeTrackerApplication` boots the process (Firebase, Koin, Timber), and
  `di/AppModule.kt` (the single highest fan-out file) declares providers for every repository, use
  case, manager, and ViewModel. Read `AppModule` to see how the whole app fits together.
- **MVVM contract.** Every screen follows the same shape: `BaseViewModel` exposes observable state
  and event flows plus shared helpers; screen action types implement the `Action` marker interface;
  `CustomTheme` is the top UI fan-in for styling. `Host.kt` is the root Compose navigation host that
  binds ViewModels to their screens.
- **Offline-first capture, background sync.** Captures persist locally in Room, then upload later.
  `SyncDataUseCase` orchestrates the full sync (planters, sessions, trees, device config, messages),
  and `TreeSyncWorker` (WorkManager coroutine worker) runs it in the background with an ongoing
  notification.
- **Central data access.** `AppDatabase` declares the Room database, entities, and migrations;
  `TreeTrackerDAO` is the central query surface (the highest fan-in production file) with CRUD and
  upload-status queries; `Migrations.kt` upgrades the schema across versions with raw SQL.
- **Object storage.** `ObjectStorageClient` wraps the AWS S3 SDK to push image files and JSON data
  bundles to DigitalOcean Spaces. `TreeUploader` builds request bundles in windows and cleans up
  local files after upload.
- **Typed preferences.** `Preferences` is a `SharedPreferences` facade with typed getters, reactive
  `Flow` observers, and session-data clearing used across the app.
- **Coroutine-first tests.** `MainCoroutineRule` (the single most depended-upon file across the whole
  codebase) swaps the Main dispatcher for a test dispatcher so coroutine-driven ViewModels test
  deterministically.

## Guided Tour

Follow these steps in order to learn the codebase end to end:

1. **Project Overview**: Read the `README` and `docs/engineering/architecture.md` for what the app does and how it is structured.
2. **Application Entry Point**: `TreeTrackerApplication.kt` boots the process: Firebase, Koin DI, and Timber logging.
3. **Dependency Injection Graph**: `di/AppModule.kt` wires every repository, use case, manager, and ViewModel (highest fan-out file).
4. **Navigation Host**: `Host.kt` wires every screen destination into the Compose `NavDisplay`, where ViewModels meet screens.
5. **MVVM Foundation**: `BaseViewModel.kt`, `Action.kt`, and `CustomTheme.kt` define the presentation contract every screen follows.
6. **Feature Screens and ViewModels**: `DashboardScreen`/`DashboardViewModel`, `TreeCaptureScreen`/`TreeCaptureViewModel`, and `SignupViewModel` apply the MVVM foundation to real features (camera, GPS gating, feature flags).
7. **Domain Use Cases**: `SyncDataUseCase` orchestrates upload; `CreateTreeRequestUseCase`, `UploadImageUseCase`, `UploadLocationDataUseCase` are single-purpose steps.
8. **Data and Persistence**: `AppDatabase`, `TreeTrackerDAO`, `TreeEntity`, `User`, and `Preferences` hold captures on the device.
9. **API and Object Storage**: `ObjectStorageClient` (AWS S3 → DigitalOcean Spaces), `UploadBundle`, and `NewTreeRequest` move data off the device.
10. **Background Sync**: `TreeSyncWorker` (WorkManager) invokes `SyncDataUseCase`; `SyncNotificationManager` and `TreeUploader` support it.
11. **Testing Infrastructure**: `MainCoroutineRule`, `FakeFileGenerator`, and `SessionUploaderTest` show the coroutine-driven test approach.
12. **Build and CI/CD**: `app/build.gradle`, `gradle/libs.versions.toml`, and the `build.yml` / `test.yml` / `deploy-play-store.yml` workflows build and ship the app.

## File Map (by layer)

- **Presentation & UI:** `TreeTracker/**/…Screen.kt` and `…ViewModel.kt` per feature (capture, dashboard, signup, map, messages, profile, settings, treeedit, walletselect, orgpicker, userselect), `navigation/Host.kt`, `view/**`, `theme/CustomTheme.kt`, `camera/**`, `map/LibreMap.kt`.
- **Domain (Use Cases):** `TreeTracker/usecases/*.kt` (`SyncDataUseCase`, `CreateTreeRequestUseCase`, `UploadImageUseCase`, `UploadLocationDataUseCase`, …).
- **Data & Persistence:** `database/` (`AppDatabase.kt`, `TreeTrackerDAO.kt`, `Migrations.kt`), `models/**` (uploaders, repos, location, messages), `api/**` (Retrofit), `preferences/Preferences.kt`, `background/**` (`TreeSyncWorker.kt`), `app/schemas/**`.
- **Core, DI & Utilities:** `application/TreeTrackerApplication.kt`, `di/AppModule.kt`, `utils/**`, `utilities/**`.
- **Testing:** `app/src/test/**`, `app/src/androidTest/**` (unit, Robolectric, screenshot, Espresso, fakes).
- **Build & Tooling:** `app/build.gradle`, `build.gradle`, `gradle/libs.versions.toml`, manifest, ProGuard, `fastlane/**`, `spotless/**`, `detekt.yml`.
- **CI/CD:** `.github/workflows/**` (`build.yml`, `test.yml`, `pull_request.yml`, `deploy-play-store.yml`, `deploy-firebase-beta.yml`), composite actions, issue/PR templates.
- **Documentation:** `docs/engineering/**`, `docs/product/**`, `docs/getting-started/**`, `docs/tasks/**`.

## Complexity Hotspots

Approach these areas carefully: they carry the most logic or the largest surface (53 files rated
complex, 180 moderate):

- **`usecases/SyncDataUseCase.kt`** (complex): the top sync orchestrator; uploads planters, sessions, trees, config, and messages with per-step progress.
- **`models/TreeUploader.kt`** and **`models/PlanterUploader.kt`** (complex): batch upload, bundle windowing, and local-file cleanup.
- **`database/TreeTrackerDAO.kt`** (complex): the central query surface; the highest production fan-in.
- **`database/Migrations.kt`** (complex): raw-SQL schema upgrades across versions; easy to break on a bad migration.
- **`di/AppModule.kt`** (complex): the whole DI graph; a change here ripples everywhere.
- **`preferences/Preferences.kt`** (complex): typed prefs, reactive flows, and session clearing used app-wide.
- **`capture/TreeCaptureScreen.kt`**, **`dashboard/DashboardScreen.kt`**, **`map/MapScreen.kt`** (complex): the largest Compose screens (camera, GPS gating, feature flags, MapLibre).
- **`signup/SignupViewModel.kt`** and **`dashboard/DashboardViewModel.kt`** (complex): the most stateful ViewModels.
- **`utilities/ImageUtils.kt`**, **`models/location/LocationDataCapturer.kt`** (complex): image processing and GPS sampling logic.
- **Test suites:** `SyncDataUseCaseTest.kt`, `TreeUploaderTest.kt`, `SessionTrackerTest.kt`, `TreeTrackerDaoTest.kt` (complex): read these to see real end-to-end capture and sync behavior.

---

_Regenerate with `/understand` then `/understand-domain` then `/understand-onboard`._

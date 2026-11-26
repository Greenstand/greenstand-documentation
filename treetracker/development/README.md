# Mobile App

The Treetracker mobile app records timestamped tree photographs and GPS locations in the field. Local storage and later upload support work with intermittent connectivity. Upload, verification, tree matching and public-map publication are separate stages; uploading a capture does not by itself mean that it is verified or publicly visible.

## Android

Use the [Android repository](https://github.com/Greenstand/treetracker-android), its release notes and the active testing track for current build and installation information. [Issue #1468](https://github.com/Greenstand/treetracker-android/issues/1468) documents build 206 / release 2.2.2 on internal testing. That does not establish which version every Play Store user receives. The old statement that version 2 is still being developed should not be used as current release information.

As of 26 November 2026, the live database contains **over 8 million captures**, confirmed by Sebastian during this documentation review. This is a capture-record count, not a count of distinct trees or verified captures; it has not been independently queried in this review.

- [Play Store listing](https://play.google.com/store/apps/details?id=org.greenstand.android.TreeTracker)
- [Android wiki](https://github.com/Greenstand/treetracker-android/wiki)

### Organization links and offline work

Organization links and Play install-referrer support are described by [PR #1261](https://github.com/Greenstand/treetracker-android/pull/1261) and [PR #1329](https://github.com/Greenstand/treetracker-android/pull/1329). The existing invitation flow carries an organization name and numeric organization identifier. A link is not, by itself, proof of administrator permissions or approved organization membership.

[Issue #1468](https://github.com/Greenstand/treetracker-android/issues/1468) proposes verified Android App Links to improve opening the installed app. This is distinct from project selection and session ownership.

[Decision proposal #35](https://github.com/Greenstand/treetracker-decisions/pull/35) describes cached stakeholder/project choices, offline session creation, and backend allocation after upload. It is a proposal, not documentation that the current Android app already sends stakeholder and project UUIDs. Preserve simple offline capture and existing local data when implementing it.

## iOS

The [iOS repository](https://github.com/Greenstand/treetracker-ios) is the starting point for implementation and release information. The historical overview's “in development” label has not been revalidated here; confirm availability with its maintainers before promising an iOS release.

## Documentation status

Reviewed 26 November 2026 against the Mobile App GitBook overview and Android issue #1468. This source update requires review and publication; the GitBook space was read-only to the reviewing account. No Git Sync connection is assumed.

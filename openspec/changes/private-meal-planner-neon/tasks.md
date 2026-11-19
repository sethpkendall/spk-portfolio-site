# Tasks

## 1. Supported runtime and tooling

- [x] 1.1 Install compatible Neon/Postgres/test dependencies, update Next.js and its async route APIs, and verify installation/typechecking without changing the demo schema.
- [x] 1.2 Verify Neon CLI/plugin setup and document authentication/project-link status, keeping credentials out of Git.

## 2. Private domain and storage

- [x] 2.1 Implement validated private meal/grocery domain commands, calendar dates, prior-meal data, week merge/replace, export and clear; verify focused domain tests.
- [x] 2.2 Add owner-scoped SQL migration and atomic revision-checked repository; verify migration, foreign-key isolation, rollback, stale-write rejection, and deletion tombstones against local Postgres; document migration commands.

## 3. Authentication and API boundary

- [x] 3.1 Implement managed email-OTP login/session/sign-out plus fail-closed owner authorization; verify anonymous, unverified, wrong-owner, and missing-config tests and document provider setup.
- [x] 3.2 Implement no-store private read/mutation/export handlers with origin, validation, and size checks; verify direct API denial and mutation/error behavior with handler tests.

## 4. Private UI

- [x] 4.1 Build the responsive private weekly planner with complete meal fields/prefill, groceries, week copy, refresh, export and confirmed clear; verify browser flows and document the demo/private boundary.
- [x] 4.2 Preserve drafts and block retry on conflict/uncertain saves, clear private memory on sign-out/expiry, and verify offline/two-client/reload behavior in browser tests.

## 5. Integrated verification and checkpoint

- [x] 5.1 Run focused suites, typecheck/build and public-route/demo regression checks; record exact results and any environment-limited checks in the runbook.
- [x] 5.2 Connect the existing Neon project after owner authentication, verify isolated branch migration and real provider sign-in/two-device behavior; leave this task pending if owner interaction is unavailable.
- [x] 5.3 Review the focused diff and staged paths, run diff checks/OpenSpec validation, commit coherent units, and record a resumable checkpoint with deployment gates.

## Workflow follow-up

- On 2026-11-19, Seth reported completing the saved-meal check in another browser and explicitly accepted it as satisfying the two-device acceptance gate. Evidence is two browsers, not two physical devices; see `projects/private-meal-planner/VERIFICATION.md` for the exact verification boundary and remaining release checks.
- All implementation tasks are complete. Review before archiving; push and deployment remain separately authorized steps.

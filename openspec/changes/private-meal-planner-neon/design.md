# Design

## Context

The baseline is `fdc6304`, including OpenSpec setup atop merged meal-tag PR #9 (`276e928`). The demo uses `MealPlannerDB` v5 and numeric IndexedDB keys. Its data helpers directly access Dexie, so using them for a private plan would risk mixing stores. There is no existing auth or server database. See proposal.md for motivation and both capability specs for behavior.

## Goals / Non-Goals

**Goals:** A small conventional owner-scoped Postgres backend, supported managed authentication, and independently testable domain operations. Keep boundaries easy to reuse in later low-usage apps.

**Non-Goals:** No browser sync engine, public Data API, Neon Functions, Realtime, AI Gateway, household roles, or agent application credentials. No production publish or main-branch migration in this work batch.

## Decisions

1. **Next.js route handlers + managed Neon Auth.** Use `@neon/auth`'s same-origin Next proxy and HTTP-only sessions, not custom identity, browser-stored bearer tokens, or a new auth server. Current SDK 0.8.2 requires Next >=16; upgrade Next to 16.4.6 with the required async API adaptations, preserve unrelated features, and test public routes. Use email OTP for owner sign-in so no OAuth app or password recovery implementation is needed. The server requires a configured allowlisted email, `emailVerified === true`, and a provider-issued stable user id on every private request. Missing configuration fails closed. Do not infer owner from the first registration. No owner email is committed to source.

2. **Postgres through `pg`.** Use Vercel-compatible connection pooling with bounded connections and transaction-scoped work. Migrations use a direct connection and versioned SQL. Separate owner-scoped state, meals, foods, recipes, and grocery rows; UUIDs replace browser-specific numeric IDs only in the private domain. Composite owner/id keys and foreign keys prevent cross-owner relationships. The public Dexie schema remains untouched. No browser access to database credentials; server-only modules guard the boundary.

3. **Plan-wide compare-and-swap revision.** All owner data is read in a consistent snapshot. Writes lock the owner's plan-state row, require the caller's expected revision, validate a narrow command, apply one atomic transaction, and increment the revision. Return the resulting snapshot. Plan-wide conflicts are coarser than per-field merging but acceptable for one low-usage owner, much easier to audit, and cover week copies/deletion. Keep a revision tombstone after clearing data so stale devices cannot recreate it. Never auto-retry writes after an uncertain result; refresh first.

4. **Pure domain operations and normalized persistence.** Validate commands with Zod, use calendar dates (not timezone-sensitive instants) for meals/weeks, normalize tags and foods, and implement meal save/delete, week copy, and grocery derivation as pure transformations. Persist normalized tables transactionally; preserve stable record ids on edits. Use explicit limits suitable for a personal plan to bound payloads. Export includes schema version, revision, all four domain collections, and timestamp, never session secrets.

5. **Separate private view.** `/meal-planner` is a responsive client view with weekly meals, prior-meal prefill, full ingredient/tag/instruction editing, week copy, groceries, export, and confirmed clear. Shared UI primitives are reused but Dexie helpers are not. Hold private snapshots/drafts in memory only. Disable refresh/other mutations while a form is active or a request is pending; capture the snapshot revision for the operation. On conflict or an uncertain save, retain editable draft content for copying, block further mutations, and offer deliberate discard-and-refresh. Sign-out unmounts private data immediately; session/auth errors clear it. No service worker or persistent client cache.

6. **Server authorization and request integrity.** All private handlers authenticate independently of page protection, return no-store responses, check same-origin JSON mutations, reject client owner fields/unknown command keys, and avoid logging content or credentials. The auth proxy is limited to the email-OTP/session/sign-out flow needed by the app, with owner checks before sending OTPs; Neon remains the rate limiter and verifier. Public portfolio routes remain public.

## Risks / Trade-offs

- Next major-version change → isolate compatibility edits, typecheck/build, smoke-test public routes and demo persistence; no production deployment until review.
- Neon live login currently pending → local SQL/domain/security tests proceed; no fabricated live sign-in or cross-device proof. Configure the user's existing project only; do not create a replacement account/project.
- Shared Neon email delivery is for development; production requires configured SMTP according to Neon → record as a release gate, do not purchase or configure another paid service silently.
- Whole-plan reads and coarse conflicts → appropriate for one small personal dataset; bounded record counts and explicit refresh avoid realtime spend. Extend pagination/per-entity revision later if usage warrants it.
- Lost responses can mean a committed write → block retry until refresh and clearly explain how to compare the saved state with the retained draft.
- Auth SDK session cache → disable cached session data where supported so protected APIs check current upstream state; verify sign-out/session expiry behavior before release.

## Migration Plan

1. Commit validated artifacts before code. Install required dependencies and compatibility changes.
2. Apply migration locally against an embedded real Postgres engine and verify authorization/domain/transaction behavior.
3. After CLI authorization, select the created Meal-planner project; inspect region and existing configuration; use an isolated development branch for live migration/auth proof. Preserve the default branch and unused services. Store credentials only in ignored owner-readable local files.
4. Verify responsive flows, missing-config/anonymous denial, local-demo separation, and two-client conflict behavior locally. Record real-provider two-device sign-in as pending unless actually observed.
5. Commit verified code and runbook on the named branch. Publishing and production env/schema changes are a later concrete review. Roll back app code without dropping data; recover database data through exports or a separately approved Neon historical branch/restore.

## Open Questions

- Owner allowlist email and the existing project region/id will be filled from Seth's reply and authorized CLI discovery. They do not alter the design. Until then access remains disabled.
- Production SMTP and real-device acceptance remain deployment prerequisites, not reasons to delay local implementation.

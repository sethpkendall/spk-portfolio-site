# Private meal planner

Owner-only, online-saved meal planning at `/meal-planner`. Sign-in uses a managed
Neon email code at `/auth/sign-in`. The anonymous `/showcase/meal-planner` remains
a separate browser-local Dexie demo. Neither plan imports, uploads, modifies, or
clears the other. Private snapshots and drafts stay in memory, never IndexedDB,
localStorage, sessionStorage, or a service worker.

## Sources of truth

- [Requirements and tasks](../../openspec/changes/private-meal-planner-neon/)
- [Verification and live setup status](VERIFICATION.md)
- [Private SQL schema](../../db/migrations/001_private_meal_planner.sql)
- [Environment template](../../.env.example)

## Local setup

Use Node.js 26 (the existing Vercel project requirement), then `npm ci`.
Next.js 16 is required by the installed Neon Auth SDK. React 18 is retained for
existing component compatibility; Next 16 warns about its future removal in 17.

Copy `.env.example` to ignored `.env.local`, make it owner-readable only, and fill
in real development values. Never commit credentials or an owner email. The
Neon management API key is tooling-only: it is **not** an application runtime
variable and is never sent to the browser. Do not reuse Calendar OAuth secrets.
Generate a random cookie signing secret (at least 32 characters) and retain it
across restarts; rotation invalidates SDK session-cache cookies.

Use the **existing** Meal-planner Neon project. Inspect its region/default branch
and existing auth setup first. Create one isolated development branch, inspect
the branch's own connection/auth endpoints, and apply the migration there only.
Do not run migration on the default/production branch during implementation.

```sh
# Explicitly load the ignored environment for the standalone migration command.
node --env-file=.env.local --import tsx scripts/migrate-private-planner.ts --apply
npm run dev
```

Migration uses a direct, unpooled URL, a transaction, an advisory lock and a
checksum ledger. A second identical run is a no-op; changed applied SQL fails.
For further changes, add a new migration instead of editing applied history.
The runtime uses a bounded pool; the migration credential stays server-side.
The private schema grants nothing to PUBLIC. Use a dedicated runtime role with
USAGE on `private_planner` and SELECT/INSERT/UPDATE/DELETE on its tables before
production, and a separate DDL role for migrations. Do not expose the schema
through Neon Data API. Authorization is enforced in server route handlers;
composite foreign keys also prevent cross-owner references.

## Managed authentication setup

Enable Neon Auth (Managed Better Auth) on the development branch, enable the
Email OTP sign-in plugin, and configure its allowed origin for the development
app. Use its branch-specific Auth URL in `NEON_AUTH_BASE_URL`. Production needs
the exact HTTPS origin in both Neon configuration and `APP_ORIGIN`.

Only the configured owner email can request a code through this app. The provider
verifies the code and issues HTTP-only session cookies; this code does not mint
sessions. Every planner operation asks the provider for a current session with
the SDK cookie cache bypassed, then requires a stable provider id, exact
normalized owner email, and `emailVerified === true`. No first-user owner claim.
Unknown auth routes and unknown request keys are denied. Shared provider email
delivery is for development; configure production SMTP before launch, without
assuming approval for a paid service. Provider rate limiting and actual email
delivery must be checked live.

References: [Neon Auth SDK](https://github.com/neondatabase/neon-js/tree/main/packages/auth),
[managed auth API](https://neon.com/docs/auth/guides/manage-auth-api),
[managed plugins](https://neon.com/docs/auth/guides/plugins).

## Save/recovery behavior

- Writes use one transaction and the revision of the snapshot being edited.
  Two stale devices cannot overwrite each other; refresh is explicit.
- On conflict or an uncertain response, the form stays available for copying.
  Further writes are blocked. Copy the draft, choose **Discard draft and refresh**,
  inspect the server result, and deliberately reapply only what is still needed.
  A lost response can mean the write already committed. Never blindly retry.
- Offline editing is not queued. Do not reload or navigate away if you need an
  unsaved draft; memory-only drafts intentionally do not survive navigation.
- Sign-out clears the active view and drafts immediately and tells other same-
  origin tabs to clear too. A failed server sign-out offers a retry. Expiry found
  by a private request clears the view. This is not remote-device session push.
- Meal copies include ingredients/tags/instructions, not grocery state. Merge
  preserves occupied slots; replace requires confirmation. Weeks start Sunday.
- Grocery quantity edits create an override. Checkmarks alone do not freeze
  generated quantities. Removed generated rows remain hidden for that week.

## Export, deletion and rollback

**Export** downloads a versioned JSON containing all meal, food, ingredient and
grocery records. Treat it as private data; the download is outside the app's
memory-only storage boundary. Keep exports in a private backed-up location.
There is intentionally no user-facing import at launch.

**Delete all private planner data** requires typing `DELETE PRIVATE PLAN`. It
clears the owner's domain rows, not their auth account or demo. A revision
tombstone remains to prevent old devices recreating data with stale writes.

Rollback application code without dropping schema or deleting data. For recovery,
inspect a separate Neon historical branch or an owner-provided export first;
restoration is a separately reviewed operation, not an automatic destructive
reset. Never restore a historical database over the active branch blindly.

## Verification and release gates

```sh
npm run test:private
npm run typecheck
npx playwright install chromium
npm run test:browser
npm run build
openspec validate private-meal-planner-neon --strict
git diff --check
```

Browser tests use the real Next app with inert provider configuration and
intercepted API responses. PGlite tests execute the actual PostgreSQL migration
and repository SQL. Neither proves real Neon login, email delivery, managed
pooling, or simultaneous independent Postgres connections. See VERIFICATION.md
for precisely what passed and what is still pending.

Before deployment: verify a live isolated migration and duplicate-free retry;
sign in with the real owner on two devices; save all meal fields on A, refresh B,
test a stale B edit, sign-out/reload/session expiry, export and confirmed clear;
confirm demo continuity; configure production SMTP and server-only Vercel env;
review the framework upgrade and run a CMS-configured build. Push, production
migration, and deployment require their separately authorized steps. Do not
archive the OpenSpec change while live acceptance is pending.

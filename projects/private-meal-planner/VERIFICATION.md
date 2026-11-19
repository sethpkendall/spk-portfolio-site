# Verification checkpoint — 2026-11-19

## Current boundary

Local implementation on `work/private-meal-planner-neon`; nothing pushed or
deployed. The isolated Neon `private-planner-dev` branch is configured and its
migration and live database checks pass. The existing `production` branch was
not changed. Real owner OTP delivery, sign-in, and authorized private-plan reads
now pass. First-use empty-state confirmation, reload/session restoration, and
two-device acceptance remain pending; production SMTP and CMS configuration
remain separate release gates.
Implementation commit: `b12e99a`. OpenSpec remains **10/11 complete** because
task 5.2 includes real owner and device acceptance, not just database setup.

## Tooling and provider status

- Neon CLI `9.6.3` is installed and runnable as `neon`.
- Neon agent plugin `neon-postgres` `3.0.10` is present in the local plugin cache.
- CLI browser OAuth was blocked by Neon's mobile localhost-redirect policy.
- Seth replaced `NEON_API_KEY` in the protected store at 22:48 UTC on November 18,
  restricted to `console.neon.tech`. The replacement successfully authenticated
  a direct project GET (HTTP 200). It is scoped to the existing **Meal-planner**
  project, not the entire account. Its plaintext is neither in this checkout
  nor exposed.
- The earlier protected Gateway request could not use the key because protected
  egress was disabled. Seth approved enablement and a Gateway restart. The
  November 18 unattended continuation verified the saved setting is
  `secrets.egressProxy.enabled=true` and the systemd Gateway service is active
  with PID `139082`, started at **17:38:22 UTC**. The CLI connectivity probe
  passed; a bounded loopback `/healthz` request returned HTTP 200 with
  `{"ok":true,"status":"live"}`. CLI and Gateway report version `2026.9.8`.
  No additional restart or upgrade was performed.
- The earlier credential returned HTTP 401 even after protected delivery was
  proven. That blocker is resolved by the replacement, without another restart.
  An account-wide `/projects` list with the new scoped key returns HTTP 404 and
  explicitly identifies its allowed project; that is a scope denial, not an
  invalid credential. Use the direct project route and pinned CLI context.
- Verified project: AWS Ohio (`aws-us-east-2`), PostgreSQL 18; existing default
  branch `production`, database `neondb`, managed Better Auth already enabled.
  Project, branch and endpoint ids are retained in the ignored `.neon` context
  and `.env.local`, not inferred from names on future runs.
- Created only `private-planner-dev`, a child of `production`, with fixed 0.25
  CU compute. The account rejected an explicit suspend interval before creating
  any branch; a readback confirmed no partial creation. Creation then succeeded
  using the account's default suspend policy (`suspend_timeout_seconds=0`, which
  means the service default, not never-suspend). No plan upgrade was requested.
- Branch-specific Better Auth was automatically available on the new branch.
  Email authentication is enabled, Email OTP is managed by Neon, shared email
  delivery is selected, and localhost is allowed. Added only the exact private
  preview HTTPS origin to the development branch's trusted domains. No SMTP
  credentials, OAuth providers, or production auth settings were changed.
- `.env.local` is ignored and mode `0600`; it preserves the supplied owner
  allowlist and now holds the development branch's direct migration URL,
  pooled runtime URL, auth URL, random SDK cookie secret and preview origin.
  Both database URLs use `sslmode=verify-full`. The management key remains only
  in the protected store. The runtime login `private_planner_app` has schema
  USAGE and table SELECT/INSERT/UPDATE/DELETE; it is not a superuser, member of
  `neon_superuser`, role/database creator, or schema creator. Migration uses the
  separate `neondb_owner` credential.

## Live verification and next owner step

- Applied `001_private_meal_planner` only on the development branch. A second
  invocation reported **already applied; checksum verified**, with no duplicate
  migration. No SQL or application source needed changing.
- **8/8 live database checks passed** through the pooled, restricted runtime
  role: distinct concurrent PostgreSQL sessions; complete meal fields and ordered
  ingredients; owner isolation and cross-owner foreign-key rejection; exactly
  one winner for concurrent stale writes; full rollback after injected mid-write
  failure; grocery quantity/check persistence; week-copy identity persistence;
  and clear/tombstone protection preserving the other test owner. Synthetic
  owners and their data were removed by exact id afterward. These checks do
  not stand in for real managed-auth sessions or two physical devices.
- The initial ad-hoc readback assertion compared incidental collection order;
  the final checks compare records by identity while separately asserting
  ingredient order. No application behavior was changed to satisfy the check.
- The actual private portal returned HTTP 200, rendered the usable sign-in form
  on desktop and Pixel 7 Chromium emulation, and had no page errors. Both
  viewports returned HTTP 200 for the anonymous managed session lookup,
  HTTP 401 plus `private, no-store` for private data, and HTTP 403 for a
  non-owner code request. Screenshots were visually inspected. No owner OTP
  or test email was sent.
- Preview: Control UI portal **Private meal planner — Neon development**
  (`p3111`), local server port `3111`, initial route `/auth/sign-in`. The
  token-bearing portal URL stays outside Git. The preview was successfully
  reopened after Seth reconnected. Keep the healthy preview running. If
  the Gateway has restarted, recover the private portal and update the local
  app origin and development trusted domain together before testing.
- **Initial owner sign-in attempt: Fail; corrected on retry.** Seth reported
  that Send sign-in code reloaded
  the page and no email arrived. The reload was reproduced with no auth POST;
  the dev server blocked the preview hostname's HMR connection, preventing
  client initialization. A bounded `next.config.js` fix now allows only the
  configured preview hostname in development. Four config assertions passed,
  including no production allowance. Real portal browser probes passed both
  top-level and embedded under the Control UI origin: HMR connected, React
  hydrated, and a button click sent exactly one auth POST with no navigation.
  The non-owner test address received the expected HTTP 403; no email was sent.
  The SDK renders this denial as generic HTTP 403 rather than the server's
  descriptive message. This is separate from the resolved reload defect.
- **Owner retry: Pass on November 19.** Seth confirmed the email arrived and
  sign-in appeared to work. Server logs independently show HTTP 200 for the
  managed code request and OTP sign-in, followed by `/meal-planner` and
  authorized `/api/private-meal-planner` reads returning HTTP 200. This satisfies
  the manual acceptance gate for the preview initialization fix; it can now be
  committed with its setup and verification documentation. No one-time code, session
  token, or private record contents were collected from Seth's browser.
- **Next:** confirm the private plan starts empty and remains signed in after
  reload. Then save all meal fields on device A, sign in/refresh device B and
  compare; exercise stale edits, groceries, export, confirmed clear, reload,
  expiry/sign-out and demo continuity. Record Pass/Fail/Unclear; task 5.2 stays
  unchecked until its actual live acceptance criteria pass. Do not archive.
- No push, deployment, production migration, or production configuration change
  occurred. The prior one-shot recovery job is finished, not a retry loop.

## Results

- Domain/API/auth-boundary/Postgres suite: **13/13 passed** on Node `26.13.1`.
- Chromium browser suite: **14/14 passed** (seven scenarios each on desktop and
  Pixel 7 emulation). Includes complete CRUD/prefill/groceries/copy/export/clear,
  two-client conflict, offline and lost-response recovery, expiry, cross-tab
  sign-out with an outstanding save, OTP error handling, real route denial, and
  demo IndexedDB preservation. Screenshots visually inspected at both sizes.
- Next.js `16.4.6` compilation and TypeScript passed on Node `26.13.1`.
- Normal production build reaches page-data collection and then fails at the
  existing `/posts/[slug]` dependency on unavailable local Contentful credentials.
  The same limitation was documented in the earlier meal-planner pilot.
- A complete production build with the explicitly preloaded, test-only
  `tests/fixtures/contentful.cjs` passed, generating all 16 pages. This proves
  framework/route compatibility, **not** real CMS content or production readiness.
- OpenSpec strict validation and `git diff --check` passed.
- Production-server smoke: **5/5 passed**. Missing-configuration planner and
  sign-in pages show unavailable states; private read/export return 503 with
  no-store headers; the public demo still returns 200.
- React 18 deprecation and outdated Browserslist warnings remain. A development
  React pre-mount state warning appeared while loading the unchanged public
  demo; its persistence/regression checks passed. Do not treat these results as
  React 19 compatibility or as a live deployment verification.

To repeat the fixture build (never deploy its synthetic content):

```sh
NODE_OPTIONS="--require=$PWD/tests/fixtures/contentful.cjs" npm run build
```

The public demo schema and implementation are unchanged. Private request
interception exists only in test code; no test-login flag or application auth
bypass was added. Browser artifacts and traces are ignored, not committed.

The test host's system Node is 24.15.0. Node 26.13.1 was run from an npm tool
cache with locally extracted Ubuntu runtime libraries under
`/tmp/private-planner-runtime/deps`; host system libraries were not changed.
Chromium and its missing libraries are likewise local test dependencies.

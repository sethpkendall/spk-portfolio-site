# Verification checkpoint — 2026-11-18

## Current boundary

Local implementation on `work/private-meal-planner-neon`; nothing pushed or
deployed. No Neon project or branch has been modified. Real provider sign-in,
SMTP, isolated live migration and two-device acceptance are pending.
Implementation commit: `b12e99a`. Gateway recovery is now verified; Neon API
authentication is blocked by HTTP 401, as detailed below.

## Tooling and provider status

- Neon CLI `9.6.3` is installed and runnable as `neon`.
- Neon agent plugin `neon-postgres` `3.0.10` is present in the local plugin cache.
- CLI browser OAuth was blocked by Neon's mobile localhost-redirect policy.
- The owner supplied `NEON_API_KEY` through the masked protected store, restricted
  to `console.neon.tech`. Its plaintext is neither in this checkout nor exposed.
- The earlier protected Gateway request could not use the key because protected
  egress was disabled. Seth approved enablement and a Gateway restart. The
  November 18 unattended continuation verified the saved setting is
  `secrets.egressProxy.enabled=true` and the systemd Gateway service is active
  with PID `139082`, started at **17:38:22 UTC**. The CLI connectivity probe
  passed; a bounded loopback `/healthz` request returned HTTP 200 with
  `{"ok":true,"status":"live"}`. CLI and Gateway report version `2026.9.8`.
  No additional restart or upgrade was performed.
- Gateway-hosted exec received the existing protected sentinel and proxy/CA
  environment. The bounded read-only `GET
  https://console.neon.tech/api/v2/projects` returned **HTTP 401**:
  `supplied credentials do not pass authentication` (request id
  `24a5caa9-c6e2-41c7-a63e-59ab225e3911`). The Gateway egress audit recorded
  `kind=forwarded`, `host=console.neon.tech`, `substituted=true`. This proves
  destination-bound credential delivery, **not** usable Neon authentication.
  The provider rejection does not distinguish an invalid, expired, revoked,
  or otherwise unsuitable credential; the actual cause is not yet known.
- Secret metadata still identifies `NEON_API_KEY` as protected with only
  `console.neon.tech` allowed. The management key was not printed, extracted,
  or persisted by this continuation. The existing ignored `.env.local` remains
  mode `0600` with the supplied owner allowlist email only; no database/auth
  runtime credentials were available to add.
- Because project discovery was denied, the existing Meal-planner project's
  id, region, default branch and auth configuration remain **unverified**.
  No project/branch/auth configuration or database migration was modified.
  No OTP or test email was sent; nothing was pushed or deployed.
- **Resume prerequisite:** Seth must verify or replace the existing Neon API
  credential through the protected masked-entry flow when present. Do not
  request a duplicate automatically or retry by extracting it. After any
  replacement, start a fresh run (Gateway exec snapshots the store on its
  first command), repeat bounded read-only project discovery, and inspect the
  existing project before creating/configuring only its isolated development
  branch. No further Gateway restart is indicated by the observed 401.
- OpenSpec task **5.2 remains pending**. Live isolated migration/idempotency,
  managed auth configuration, real owner OTP delivery/sign-in and two-device
  acceptance are not satisfied by the local test results below. Production
  SMTP/CMS/deployment checks remain separate release gates in README.md.
- One-shot continuation `20a58c91-9c62-4898-89bc-468eda2e2f70` completed its
  recovery check and stopped at the authentication blocker; it is not a
  credential retry loop.

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

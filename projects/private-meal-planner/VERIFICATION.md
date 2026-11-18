# Verification checkpoint — 2026-11-18

## Current boundary

Local implementation on `work/private-meal-planner-neon`; nothing pushed or
deployed. No Neon project or branch has been modified. Real provider sign-in,
SMTP, isolated live migration and two-device acceptance are pending.
Implementation commit: `b12e99a`.

## Tooling and provider status

- Neon CLI `9.6.3` is installed and runnable as `neon`.
- Neon agent plugin `neon-postgres` `3.0.10` is present in the local plugin cache.
- CLI browser OAuth was blocked by Neon's mobile localhost-redirect policy.
- The owner supplied `NEON_API_KEY` through the masked protected store, restricted
  to `console.neon.tech`. Its plaintext is neither in this checkout nor exposed.
- The earlier protected Gateway request could not use the key because protected
  egress was disabled. Seth subsequently approved enablement and a Gateway
  restart. On November 18, the supported CLI set
  `secrets.egressProxy.enabled=true` after a successful schema-validated dry run;
  a readback confirmed the saved setting. Restart and live credential proof are
  still pending at this checkpoint. No authenticated Neon request has run.
- A one-shot continuation is scheduled for 17:40:01 UTC on November 18 (job
  `20a58c91-9c62-4898-89bc-468eda2e2f70`) in the originating conversation. It must
  verify Gateway health and protected egress before testing the existing key
  through Gateway-hosted exec. The existing project id/region and auth settings
  remain unverified. Do not extract the key or copy it to a plaintext environment
  file to bypass the protected delivery boundary.

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

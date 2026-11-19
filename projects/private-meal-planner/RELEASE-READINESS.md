# Private meal planner — release readiness

Checked November 19, 2026 (UTC). This is a preparation record, **not deployment
approval**. Recheck mutable provider settings immediately before an approved
release. The accepted implementation and archived OpenSpec change remain closed;
see [VERIFICATION](VERIFICATION.md) for their earlier evidence.

## Candidate and observed state

| Area | Result |
| --- | --- |
| Git | Clean `work/private-meal-planner-neon` at `1f135fd`; fetched `origin/main` is `276e928`; 13 unpublished commits ahead. The full three-dot diff has 66 files, including OpenSpec setup, the Next.js upgrade, planner code/tests, and operational documentation. The feature branch is absent on the remote; PR state is unverified because GitHub API access is unavailable in this session. |
| Public site | `https://sethpkendall.com/` and `/showcase/meal-planner` return 200 from Vercel; `www` redirects to the canonical host. `/meal-planner` and `/auth/sign-in` still return 404. The exact Vercel project, connected repository, production branch, environment settings, and auto-deploy policy are **not verified**: no local Vercel link or Vercel credential is available. |
| Neon | Read-only scoped API confirmed project `red-butterfly-13807271` (`Meal-planner`, AWS Ohio, PostgreSQL 18). Default `production` is `br-gentle-rain-berb08uc`; `private-planner-dev` is child `br-fragrant-base-bev6mh1o`. Production Auth uses `https://ep-calm-queen-bexyouy8.neonauth.c-9.us-east-2.aws.neon.tech/neondb/auth`, has no trusted domains, uses shared email delivery, and has only `neondb_owner` in the role list. The prior development migration and live checks did not touch production; production schema presence was not queried in this check. |
| Automated checks | Fresh Node 26: 13/13 private tests, TypeScript, 14/14 Chromium browser tests, strict validation of both main specs, and `git diff --check` passed. A fixture-backed build generated all 16 pages; this only checks route/framework compatibility. |
| Genuine build | **Blocked.** With `NODE_OPTIONS` unset and no Contentful variables in the local ignored environment, Next 16.4.6 compiled and typechecked, then failed while prerendering `/` because `getAllPosts` returned no posts. The fixture must never be used for deployment. React 18 deprecation and stale Browserslist warnings remain. |

## Unclosed release gates

1. Obtain read access to the existing Vercel project and inspect its project ID/name,
   `sethpkendall.com` domain assignment, Git production branch and push-trigger
   behavior, Node runtime, build settings, and **names/presence** of existing
   Contentful variables. Preserve all unrelated settings. Use the approved
   credential mechanism to run a genuine CMS-configured build; do not copy CMS
   secrets into Git or chat. GitHub publishing also needs an authorized identity.
2. Agree on a production-capable email delivery arrangement and any cost **before**
   configuring it. Production currently uses shared email delivery. Verify an
   actual owner code and effective rate limiting after configuration.
3. With Seth, finish the still-unrun real-session checks in development: stale
   edit/recovery, grocery continuity, export, confirmed clear, sign-out/expiry,
   and public-demo continuity. Preserve existing planner data before a clear;
   use disposable data where possible. Automated tests are not substitutes.
4. Verify the exact production migration target and schema, create a restricted
   pooled runtime role with only private-schema DML, and keep the DDL/unpooled
   credential outside app runtime. Confirm `private_planner` is not exposed via
   Data API. These are pending production changes, **not** preparatory actions.

## Proposed execution sequence — requires separate explicit confirmation

1. Freeze and review the exact PR diff from `1f135fd` against refreshed `main`.
   Confirm the Vercel link and whether a feature-branch push creates a preview;
   pushing is held until authorized because it may deploy. Do not mix sibling
   worktrees or assume the 13 commits are a narrow code-only diff.
2. After approval of the named Neon `production` branch, check its schema and
   migration ledger, apply only `001_private_meal_planner` through a separate
   unpooled migration credential, verify the ledger/checksum, and create/grant
   the least-privilege runtime role. Do not copy development meals, reset a
   branch, or restore a historical database over production.
3. After approval of the named Vercel project and email provider, configure
   production SMTP, exact trusted origin `https://sethpkendall.com`, and
   server-only `DATABASE_URL` (production pooled restricted role),
   `NEON_AUTH_BASE_URL` (production branch), stable
   `NEON_AUTH_COOKIE_SECRET`, `MEAL_PLANNER_OWNER_EMAIL`, and
   `APP_ORIGIN=https://sethpkendall.com`. Preserve existing Contentful variables.
   The management key and unpooled migration URL are **not** app runtime vars.
4. Publish the reviewed branch/PR only after approval. Verify a real-CMS preview
   of the whole site, including posts and draft/revalidation routes, before
   merging to the verified Vercel production branch. A merge or production-branch
   push may deploy automatically; confirm this precise action separately if it
   was not covered by the approval.
5. Verify deployment commit/URL, owner login/save/reload, anonymous and non-owner
   denial, public demo, homepage/posts, and email delivery. Record actual results.

**Rollback boundary:** retain the private schema and data. Reassign the domain to
the last known-good Vercel deployment or revert the application commit, after
verifying the project-specific rollback mechanism. This rolls back code, **not**
database writes, email configuration, or owner data. Any database restoration is
a separate reviewed operation. Do not use the fixture build as a rollback artifact.

No push, production migration, production configuration change, or deployment was
made while writing this record. The next approval request must name the verified
Vercel project and exact Git/deployment actions, production branch, email solution,
test status, remaining issues, and rollback target; this record alone is not that
approval.

# Private meal planner — release readiness

Checked November 19, 2026 (UTC). This is a preparation record, **not deployment
approval**. Recheck mutable provider settings immediately before an approved
release. The accepted implementation and archived OpenSpec change remain closed;
see [VERIFICATION](VERIFICATION.md) for their earlier evidence.

## Preview QA checkpoint — November 19

- Seth approved a preview-only push of `work/private-meal-planner-neon` at
  `aaa8942`. That exact ref was pushed; Vercel reported a successful deployment.
  `main` was not pushed. The preview is behind Vercel Authentication, so the
  agent has not inspected rendered pages directly.
- Seth's mobile check found a meal-name input layout failure on the public
  demo, broken styling on the demo link, and `/auth/sign-in` unavailable. The
  private sign-in unavailability is expected until preview runtime variables
  are configured; it is not a completed login check. Homepage and post QA
  were not reported. A later Chrome-on-Android screenshot shows the keyboard
  open with the Add Meal drawer compressed into a shallow white strip, its
  title clipped, and the meal-name field partly covered. This corroborates the
  reproduced drawer collapse; it is not a retest of the unpublished fix. Seth
  suspects the issue might disappear on deployment to `main`, but that remains
  an untested possibility, not a reason to skip preview or on-device QA.
- Local follow-up `fb97b20` removes Vaul's `fixed` setting from the mobile
  meal sheets, which otherwise cumulatively shrank the drawer during staged
  keyboard viewport changes, and gives demo links a visible violet underline.
  Mobile browser regressions and TypeScript passed locally. The fix has **not**
  been pushed or checked on the protected Vercel preview. A new preview-only
  push needs separate authorization; no production action is implied.

## Candidate and observed state

| Area | Result |
| --- | --- |
| Git | Feature branch was pushed only at `aaa8942` for a Vercel preview; local follow-up `fb97b20` is unpublished. Remote `main` was last rechecked at `276e928`. The full branch includes OpenSpec setup, the Next.js upgrade, planner code/tests, and operational documentation. Recheck the current three-dot diff before publication. PR state remains unverified because GitHub API access is unavailable in this session. |
| Public site | `https://sethpkendall.com/` and `/showcase/meal-planner` return 200 from Vercel; `www` redirects to the canonical host. `/meal-planner` and `/auth/sign-in` still return 404. Seth identified the existing Vercel project as [`seth-kendalls-projects/spk-portfolio-site`](https://vercel.com/seth-kendalls-projects/spk-portfolio-site) and confirmed that pushing the feature branch creates a preview and pushing `main` redeploys production. The private project URL is not independently readable with current credentials, so project ID, connected-repository settings, build/runtime settings, and rollback controls remain uninspected. |
| Vercel variables | Seth's November 19 screenshot shows `CONTENTFUL_CMA_TOKEN`, `CONTENTFUL_ACCESS_TOKEN`, and `CONTENTFUL_SPACE_ID` marked “All Environments,” plus a first variable whose displayed name is truncated to `CONTENTFUL_P…CCESS_TOKEN` (likely the preview access token, but not verified). It exposes no values. The planner runtime names, `CONTENTFUL_PREVIEW_SECRET`, and `CONTENTFUL_REVALIDATE_SECRET` are not shown; the screenshot does not establish whether they are absent elsewhere. The CMA token is for content management, not the runtime delivery token used by the site build. |
| Neon | Read-only scoped API confirmed project `red-butterfly-13807271` (`Meal-planner`, AWS Ohio, PostgreSQL 18). Default `production` is `br-gentle-rain-berb08uc`; `private-planner-dev` is child `br-fragrant-base-bev6mh1o`. Production Auth uses `https://ep-calm-queen-bexyouy8.neonauth.c-9.us-east-2.aws.neon.tech/neondb/auth`, has no trusted domains, uses shared email delivery, and has only `neondb_owner` in the role list. The prior development migration and live checks did not touch production; production schema presence was not queried in this check. |
| Automated checks | Fresh Node 26: 13/13 private tests, TypeScript, 14/14 Chromium browser tests, strict validation of both main specs, and `git diff --check` passed. A fixture-backed build generated all 16 pages; this only checks route/framework compatibility. |
| Genuine build | **Blocked.** With `NODE_OPTIONS` unset and no Contentful variables in the local ignored environment, Next 16.4.6 compiled and typechecked, then failed while prerendering `/` because `getAllPosts` returned no posts. The fixture must never be used for deployment. React 18 deprecation and stale Browserslist warnings remain. |

## Unclosed release gates

1. Inspect the identified Vercel project's still-unseen project ID, domain/Git
   linkage, Node runtime, build settings, complete variable-name list, and
   rollback controls using a logged-in read-only view when available. Seth has
   confirmed preview and production push triggers, but the URL alone does not
   grant settings access. Preserve unrelated settings. A Vercel preview with
   the existing Contentful environment can provide a genuine CMS-configured
   build without copying secrets into Git or chat. GitHub publishing also needs
   an authorized identity.
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

1. Freeze and review the exact PR diff from the candidate commit against
   refreshed `main`. After a new explicit preview-push approval, push only
   `work/private-meal-planner-neon` to the repository origin; this updates the
   Vercel preview, not production. Review Vercel's build and have a logged-in
   tester inspect homepage/posts/demo and the mobile keyboard/link fixes. With
   no planner runtime variables the private route should show its unavailable
   state, not an owner session. Do not mix sibling worktrees or assume the
   branch is a narrow code-only diff.
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
4. Review the preview and PR, including a real-CMS build of the whole site and
   posts. Verify draft/revalidation routes only with their configured secrets;
   do not infer them from a successful build. Merge or push to `main` only after
   a separate explicit production approval; Seth confirmed this redeploys the
   production site.
5. Verify deployment commit/URL, owner login/save/reload, anonymous and non-owner
   denial, public demo, homepage/posts, and email delivery. Record actual results.

**Rollback boundary:** retain the private schema and data. Reassign the domain to
the last known-good Vercel deployment or revert the application commit, after
verifying the project-specific rollback mechanism. This rolls back code, **not**
database writes, email configuration, or owner data. Any database restoration is
a separate reviewed operation. Do not use the fixture build as a rollback artifact.

No additional push, production migration, production configuration change, or
production deployment was made for this checkpoint. A further preview-branch
push can be approved separately from production work. The eventual production
approval request must
name the Vercel project and exact Git/deployment actions, production branch,
email solution, test status, remaining issues, and rollback target; this record
alone is not that approval.

# Private meal planner — deployment handoff

Prepared: November 19, 2026 (UTC). This is a saved checkpoint, not live production status.

## Read this first

**Yes, this is a good stopping point.** Implementation is complete, accepted and
archived; the project tree was clean at `d3fc1c1` before this documentation export.
The next session should begin with **release readiness and a concrete deployment
plan**, not reopening implementation or repeating the accepted browser check.

Seth's instruction: “I want to deploy it. Confirm with me before proceeding
though.” Deployment intent is recorded, but execution is **not approved**.
Prepare the reviewable plan and necessary safe checks first. Before a push that
could trigger a deployment, merge, production configuration change, production
migration or deployment, present the exact target, changes, checks, unresolved
issues and rollback plan, and obtain Seth's explicit confirmation. Existing
development setup approvals are not production approval. Do not infer approval
from this handoff or from “resume.” Do not incur paid-service spend without approval.

## Copy/paste to start the next session

> Resume the private meal-planner deployment handoff at
> `/home/openclaw/src/spk-portfolio-neon/projects/private-meal-planner/DEPLOYMENT-HANDOFF.md`.
> Start with release readiness: inspect the current branch, remaining live checks,
> real Contentful build configuration, and the existing Vercel/Neon production
> setup. Prepare a concrete release plan and complete safe preparatory work.
> I want to deploy, but confirm with me before publishing or changing production.
> Implementation is already accepted and archived; do not restart that work.

## Authoritative locations

| Item | Location / saved state |
| --- | --- |
| Working checkout | `/home/openclaw/src/spk-portfolio-neon` |
| Feature branch | `work/private-meal-planner-neon` |
| Repository | `sethpkendall/spk-portfolio-site` |
| Implementation | `b12e99a` |
| Preview initialization fix | `3444e5a` |
| Owner acceptance | `36d090b` |
| Archived closeout | `d3fc1c1` |
| Product/setup/runbook | [README](README.md) |
| Detailed evidence and remaining checks | [VERIFICATION](VERIFICATION.md) |
| Main specifications | [Meal planning](../../openspec/specs/private-meal-planning/spec.md), [private access](../../openspec/specs/private-planner-access/spec.md) |
| Archived change | [Completed change](../../openspec/changes/archive/2026-11-19-private-meal-planner-neon/) |
| Schema and configuration names | [Migration](../../db/migrations/001_private_meal_planner.sql), [environment template](../../.env.example) |

This file is a handoff snapshot. Read current source and live state before acting.
At export, cached `origin/main` was `276e928`, with 12 local commits beyond it;
no remote refresh was performed for this export. Local `main` is stale. Inspect
fresh remote state and the actual branch diff before choosing the PR/release
scope; do not blindly push all local branches or mix sibling worktrees.

## What is complete

- OpenSpec: **11/11 tasks**, archived on November 19; two main specs synchronized
  and strictly validated. No need to re-archive.
- Development-only Neon branch `private-planner-dev`, in the existing
  **Meal-planner** project; PostgreSQL 18, AWS Ohio. The default `production`
  branch was not changed during this work.
- Development migration applied; identical retry verified as a no-op. Restricted
  pooled runtime role is separate from the migration role. Eight live database
  checks passed, including concurrent stale-write rejection and owner isolation.
- Real owner email-code delivery, sign-in, empty first-use planner, and session
  restoration after refresh passed.
- Seth verified the saved meal in another browser and explicitly accepted that
  as the cross-client gate. Record **two browsers**, not two physical devices.
  The requested comparison covered name, ingredients, tag and instructions.
- Recorded automated results: 13/13 private tests, 14/14 browser tests, TypeScript,
  a fixture-backed build, and 5/5 production-server smoke checks passed.
  These are prior results, not tests rerun for this export.
- Nothing from this private-planner branch has been pushed, merged or deployed.

## Tomorrow's first useful work block

1. Read this file, README and VERIFICATION. Inspect `git status`, branch and HEAD;
   preserve unrelated work. Use the Neon checkout above, not a sibling worktree.
2. Recheck current repository and existing Vercel/Neon configuration read-only.
   Identify the exact Vercel project, canonical production origin, production
   branch/database/auth endpoint, and deployment-trigger behavior. The intended
   host is the existing `sethpkendall.com` portfolio; verify its live linkage.
3. Make a short readiness table: already passed, safe checks to run, checks needing
   Seth, and production changes awaiting confirmation. Resolve discoverable
   configuration facts before asking him for information.
4. Prepare the exact release plan and rollback boundary. Ask for confirmation
   only once the proposed actions are concrete; do not deploy during preparation.

**Useful stopping point for that block:** a reviewed release candidate and an
explicit, bounded approval request—not another vague “ready to deploy” claim.

## Remaining release checks and work

### Real owner-session behavior

Still unrun live: stale-edit conflict/recovery, grocery continuity, export,
confirmed clear, sign-out/session expiry, and public-demo continuity. Existing
automated evidence does not turn these into manual passes. Use the isolated
development environment and disposable data where possible. Before any destructive
clear or session invalidation, agree on the affected test data/session and preserve
anything Seth wants to keep. Do not clear his planner just to finish a checklist.

### Production authentication and database

- Inspect existing settings first and preserve unrelated configuration.
- Configure production-capable SMTP; shared Neon email delivery was used only
  for development. Verify real delivery and provider rate limiting; do not assume
  a paid provider is approved.
- Use branch-matched production database and Auth endpoints, exact HTTPS origin
  in `APP_ORIGIN` and Neon trusted domains, and the existing sole-owner allowlist.
- Runtime variables: `DATABASE_URL`, `NEON_AUTH_BASE_URL`,
  `NEON_AUTH_COOKIE_SECRET`, `MEAL_PLANNER_OWNER_EMAIL`, `APP_ORIGIN`.
  Keep them server-only. Retain a stable cookie secret across restarts.
- Keep the privileged `DATABASE_URL_UNPOOLED` credential in the migration process,
  separate from the least-privilege pooled runtime role. Review and approve the
  production migration target before applying it. Do not expose the private
  schema through Neon Data API or copy development meals into production.
- `NEON_API_KEY` is a project-scoped management credential in the protected Secret
  Store, not an app runtime variable. Use the direct project API and pinned local
  context; account-wide listing previously failed because of key scope.
- `.env.local` and `.neon` contain ignored local context. Do not print, commit or
  attach their contents. Never reuse Trellis Calendar OAuth credentials.

### Production build and whole-site compatibility

The app requires Node **26.x** and currently uses Next **16.4.6** with React 18.
Review the framework upgrade's impact on the whole portfolio, including Contentful
posts, draft/revalidation routes and existing public pages. React 18 deprecation
and Browserslist warnings remain documented.

A normal local build previously failed during Contentful page-data collection
because real CMS credentials were unavailable. Obtain the existing project's
configuration through its approved secret mechanism and run a genuine build.
The test fixture build proves route/framework compatibility only: **never deploy
synthetic Contentful content or the fixture preload**. Check any inherited
`NODE_OPTIONS` before the release build. Preserve existing CMS variables; the
environment template is a starting point, not proof of complete production config.

Relevant checks, from the project directory with the correct Node runtime:

```sh
npm run test:private
npm run typecheck
npm run test:browser
npm run build
openspec validate --specs --strict
git diff --check
```

Install dependencies/browser prerequisites only if needed. Earlier Node/Chromium
helpers lived under temporary local paths; verify availability rather than assuming
they survived. Rerun checks as justified by the release candidate and environment.

## Access and preview recovery

- Private app: `/meal-planner`; signed-out users choose **Sign in**.
- Direct login: `/auth/sign-in`; sign-out returns there.
- Public, browser-local demo: `/showcase/meal-planner`; it is separate from private
  data, with no import/upload from the demo. Private plans start fresh.
- No login link exists in the header or demo. Direct-route access is the current
  design; adding discoverability is a separate decision, not already implemented.
- Last known preview: OpenClaw → Portals → **Private meal planner — Neon
  development**, portal `p3111`, local port `3111`. It was left running at closeout;
  this export did not revalidate server/portal health. It is not a public deployment.
- If preview recovery is needed, use the private-preview skill, inspect existing
  resources, and keep development `APP_ORIGIN`, portal `PUBLIC_URL` and the exact
  Neon development trusted origin aligned. A changed preview hostname previously
  blocked HMR/hydration, causing sign-in submission to reload without an auth POST.
  Do not change production auth to recover development. Keep token URLs out of Git.

## Confirmation, release and rollback

Before execution, present Seth with the exact commit/PR scope, Vercel project and
origin, Neon production branch, migration, SMTP/env changes, test results, any
remaining blockers, and rollback steps. Explicitly cover any Git operation that
can auto-deploy. Wait for his confirmation; then execute only that approved scope.

After an approved release, verify real owner login/save/reload, anonymous and
non-owner denial, public demo and Contentful routes, and record the deployment
URL/commit and actual results. Roll back application code without dropping schema
or deleting data. Database restoration is a separately reviewed operation; never
overwrite production blindly from a historical branch or export.

## Export-session boundary

This retry inspected local source and saved memory, wrote this handoff, and recorded
it in local Git. It did not refresh remotes, rerun application tests, recover the
preview, change provider configuration, mutate planner data, or deploy anything.
Memory search was keyword-only because embedding credentials were unavailable;
exact saved notes and current project files supplied the evidence.

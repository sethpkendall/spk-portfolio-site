# Proposal

## Why

Seth needs one private meal plan that he can use across devices, while keeping the portfolio's anonymous browser-local showcase intact. Neon is the selected low-usage backend; online-only editing is acceptable, and the first private plan must start empty.

## What Changes

- Add an owner-only private planner at `/meal-planner`, with managed Neon authentication and server-enforced access.
- Persist meals, tags, instructions, food/ingredient relationships, week-copy results, and grocery overrides/freeform/check/remove state in Postgres.
- Use explicit refresh and revision-checked atomic writes; show failures without silently losing drafts, replaying writes, or overwriting stale data.
- Provide authenticated JSON export, explicitly confirmed private-data deletion, and an operational migration/recovery guide.
- Keep `/showcase/meal-planner` browser-local. No local import, upload, deletion, or offline private-write queue.
- Install Neon agent tooling, and prepare isolated development configuration without changing production deployment.

## Capabilities

### New Capabilities

- `private-planner-access`: authentication, owner authorization, private response handling, and separation from the anonymous showcase.
- `private-meal-planning`: cloud meal/grocery operations, cross-device consistency, export, deletion, and recoverability.

### Modified Capabilities

None. The OpenSpec capability inventory is empty; the existing showcase behavior is preserved.

## Impact

New Next.js routes and server-side Postgres/auth integration; a separate private UI reusing established visual components without routing private data through Dexie. SQL migrations, focused domain/authorization/concurrency tests, environment documentation, and a release checklist are added. The observed baseline is Next.js 14.2.5 / React 18.3.1. Neon's current SDK requires Next.js 16, so this change includes a bounded framework compatibility update (async route parameters/draft APIs and middleware naming), retaining React 18 where supported and regression-checking public routes.

Household sharing, agent application access, other showcase accounts, offline sync, and paid Neon services are out of scope. The 2026-11-18 request authorizes artifacts and implementation in this session. Push, production deployment, and production-data migration remain separate; live setup requiring owner login must be reported honestly if incomplete.

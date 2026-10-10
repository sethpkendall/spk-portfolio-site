# Meal Tags OpenClaw Pilot Brief

Status: implemented locally; interactive browser review pending

Branch: `work/meal-planner-openclaw-pilot`

Baseline: `bbc9878` (`origin/main` as fetched on 2026-10-10)

## Purpose

Add lightweight labels such as `Vegan` or `Gwen in town` to planned meals.
This is the first bounded implementation pilot for the OpenClaw-mediated coding
workflow: small enough to review independently, but complete enough to exercise
local persistence, responsive UI, verification, and resumable Git checkpoints.

## Observed repository baseline

- The meal planner is a client-side Next.js 14.2.5 showcase at
  `/showcase/meal-planner`.
- Planned meals are stored in browser-local IndexedDB through Dexie 4.0.8.
- `Meal` is the scheduled meal instance; the application does not have a
  separate reusable meal-template entity. Choosing a prior meal copies data from
  the latest matching meal.
- Meal writes are centralized in `saveMealWithIngredients` and
  `updateMealWithIngredients`; week copies explicitly reconstruct each meal.
- The repository has no configured unit-test or lint script. Existing meal
  planner behavior is documented and manually validated in
  `specs/002-meal-planner-enhanced/quickstart.md`.
- `npx tsc --noEmit` passes at the baseline.
- `npm run build` compiles and passes its lint/type phase, then fails while
  collecting `/posts/[slug]` because Contentful data is unavailable locally.
- With the development server running, `/showcase/meal-planner` returns HTTP
  200 and renders the expected title.
- No tracked environment template exists, and no local `.env*` file was present
  during this inventory. Contentful is unrelated to meal-planner persistence.

## Proposed user behavior

1. Add and edit dialogs offer one optional comma-separated tags field.
2. Values are trimmed, empty values are discarded, and duplicates are removed
   case-insensitively while preserving the first entered display spelling.
3. Tags belong to each scheduled `Meal` instance.
4. Selecting a previously used meal prefills the latest meal's tags alongside
   its ingredients and instructions.
5. Meal cards show compact tag badges without displacing the meal title or
   primary actions; the details dialog also exposes the full set when needed.
6. Copy-week merge and replace modes preserve source tags on copied meals.
7. Existing meals without tags continue to load, edit, copy, and display.

## Acceptance criteria

- A meal can be created with `Vegan, Gwen in town` and both tags remain after
  closing and reopening the page in the same browser profile.
- Editing tags replaces the stored set without changing the meal's title,
  date, type, ingredients, instructions, or grocery-list behavior.
- Whitespace-only entries are ignored, and `Vegan, vegan` produces one tag.
- Selecting a prior meal prefills its latest tag set.
- Copying a week preserves tags in the copied meal records; later editing a
  copied meal does not change the source week.
- Existing untagged data needs no destructive migration and remains usable.
- Desktop and mobile layouts keep add, edit, details, and delete controls
  usable with representative zero-, one-, and multi-tag meals.
- `npx tsc --noEmit` passes.
- `npm run build` reaches successful compilation and type checking. The known
  Contentful page-data failure may remain, but no earlier or meal-planner-specific
  build failure is acceptable.
- The local meal-planner route returns HTTP 200 during development verification.

## Implementation boundary

Expected paths:

- `models/interfaces.ts`
- `projects/meal-planner/components/AddMealModal.tsx`
- `projects/meal-planner/components/EditMealModal.tsx`
- `projects/meal-planner/components/MealCard.tsx`
- `projects/meal-planner/components/mealTags.ts`
- `projects/meal-planner/components/mealPlannerData.ts`
- focused reusable tag-input code only if it materially reduces duplication
- this brief and, after implementation, its evidence section

The `Meal` interface can add optional `tags?: string[]`. Because tags are not
queried or indexed, Dexie can persist the additional object field without an
IndexedDB schema-version change. The explicit update and copy-week projections
must nevertheless include `tags`; otherwise those operations would silently
drop them.

## Non-goals

- Filtering, search, saved tag management, colors, icons, or controlled
  vocabularies
- Dietary inference or validation
- Changing grocery generation based on tags
- Server storage, accounts, synchronization, authentication, or an agent API
- New npm packages
- Changes to Contentful, Vercel, production data, or Calendar OAuth credentials
- Push, pull request, or deployment without separate explicit authorization

## Existing-solution preflight

The current React controls, Badge component, TypeScript model, and Dexie object
storage are sufficient. A tag library, cloud service, or new persistence layer
would add dependency and migration cost without solving a need in this pilot.

## Risks and controls

- **Silent tag loss on existing write paths:** cover add, update, prior-meal
  prefill, and both copy-week modes in the manual verification matrix.
- **Crowded meal cards:** limit the card preview and expose the complete list in
  details rather than expanding cards without bound.
- **Inconsistent duplicates:** use one normalization helper shared by add and
  edit flows.
- **Browser-local test contamination:** validate in an isolated browser profile
  and retain a pre-change data fixture for existing-record compatibility.
- **Weak automated coverage:** keep the change small, type-check it, inspect the
  focused diff, and record each manual scenario and result before committing the
  implementation unit.

## Required confirmation

Before implementation, Seth should confirm that this proposed behavior is the
right first pilot. Confirmation authorizes local implementation and verification
on this branch, but not push, deployment, credentials, or production changes.

## Implementation evidence

Completed locally on 2026-10-10.

- Added optional `Meal.tags` storage without changing the indexed Dexie schema.
- Added a shared comma parser that trims values, removes empty entries, and
  deduplicates case-insensitively while preserving first-entered spelling.
- Add and edit flows persist tags; prior-meal selection prefills them; update
  and copy-week projections explicitly preserve them.
- Meal cards show up to two compact tag badges plus an overflow count, and the
  details dialog shows the complete tag set.
- Three direct normalization cases pass, including whitespace, empty entries,
  and case-insensitive duplicates.
- `npx tsc --noEmit`: PASS.
- `npm run build`: expected partial PASS. Compilation and lint/type checking
  complete successfully; page-data collection then stops at the unchanged
  Contentful-dependent `/posts/[slug]` failure.
- Development route `/showcase/meal-planner`: HTTP 200 with the expected title.
- `git diff --check`: PASS.

The host's intentionally disabled browser capability was not expanded for this
pilot. Consequently, IndexedDB reload behavior, prior-meal prefill, week-copy
behavior, and responsive visual layout still require interactive review in an
isolated browser before push or deployment. The corresponding code paths were
included in the source audit, but that is not presented as runtime proof.

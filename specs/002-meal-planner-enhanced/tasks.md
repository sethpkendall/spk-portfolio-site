# Tasks: Meal Planner Enhanced

**Input**: Design documents from `/specs/002-meal-planner-enhanced/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-behavior.md, quickstart.md

**Tests**: No automated test suite is configured in this repo and no TDD flow was requested. Verification tasks use `npm run build` and the manual scenarios in quickstart.md.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated as an independent increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or does not depend on incomplete task output
- **[Story]**: Maps a task to a user story from spec.md
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current state and prepare shared files for the feature.

- [X] T001 Review the current MealPlannerDB v3 schema and existing meal planner usage in `models/db.ts`, `models/interfaces.ts`, and `projects/meal-planner/index.tsx`
- [X] T002 [P] Review the current meal planner component interactions and duplicated add/edit/delete paths in `projects/meal-planner/components/MealGridPanel.tsx` and `projects/meal-planner/components/MealCarousel.tsx`
- [X] T003 [P] Review existing shared UI primitives for Dialog, Drawer, inputs, labels, buttons, carousel, and datepicker in `components/ui/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data contracts and reusable helpers that block all user stories.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [X] T004 Extend meal planner interfaces for `Meal.instructions`, `Food.normalizedTitle`, `Recipe.id`, `Recipe.quantity`, `Recipe.unit`, `Recipe.sortOrder`, and `GroceryListItem` in `models/interfaces.ts`
- [X] T005 Update `MealPlannerDB` to the final version 5 schema with indexed `type`, `normalizedTitle`, `recipes` primary keys, and `groceryListItems` storage in `models/db.ts`
- [X] T006 Add a Dexie v4-to-v5 bridge migration that preserves existing meals/foods and safely recreates the previously unused recipes table in `models/db.ts`
- [X] T007 [P] Create shared meal planner type aliases for meal slots, ingredient draft rows, grocery rows, and week copy modes in `projects/meal-planner/components/types.ts`
- [X] T008 Create reusable meal planner data helpers for normalizing titles/units, resolving week bounds, loading meal ingredients, and upserting foods in `projects/meal-planner/components/mealPlannerData.ts`
- [X] T009 Add transaction helpers for creating/updating meals with recipe rows and deleting meals with recipe cleanup in `projects/meal-planner/components/mealPlannerData.ts`
- [X] T010 Update imports and local types so `projects/meal-planner/index.tsx`, `projects/meal-planner/components/MealPlannerTool.tsx`, `projects/meal-planner/components/MealGrid.tsx`, and `projects/meal-planner/components/MealCarousel.tsx` use the shared types from `projects/meal-planner/components/types.ts`

**Checkpoint**: Database schema, migration, and shared data helpers are ready for user story implementation.

---

## Phase 3: User Story 1 - Ingredient Tracking (Priority: P1) MVP

**Goal**: Users can add/edit/remove meal ingredients with quantity and unit, persist them through Food + Recipe rows, and see ingredients on meal cards.

**Independent Test**: Add a "Tacos" meal with tortillas x8, ground beef 1 lb, and cheese 2 cups; reload the page; edit the meal and confirm all ingredients are displayed and editable.

### Implementation for User Story 1

- [X] T011 [P] [US1] Create the ingredient row editor UI with add, edit, remove, quantity, and unit controls in `projects/meal-planner/components/IngredientEditor.tsx`
- [X] T012 [P] [US1] Create a shared responsive meal dialog shell that uses `Dialog` on desktop and `Drawer` on mobile in `projects/meal-planner/components/ResponsiveMealDialog.tsx`
- [X] T013 [US1] Replace the raw add-meal overlay with the responsive dialog shell and ingredient editor in `projects/meal-planner/components/AddMealModal.tsx`
- [X] T014 [US1] Replace the raw edit-meal overlay with the responsive dialog shell and ingredient editor in `projects/meal-planner/components/EditMealModal.tsx`
- [X] T015 [US1] Update meal save flows to write meals, foods, and recipe quantity/unit rows through transactions in `projects/meal-planner/components/AddMealModal.tsx`
- [X] T016 [US1] Update meal edit flows to load, replace, and persist recipe rows through transactions in `projects/meal-planner/components/EditMealModal.tsx`
- [X] T017 [US1] Update meal selection to prefill ingredients from an existing meal's recipe rows in `projects/meal-planner/components/MealCombobox.tsx`
- [X] T018 [US1] Update the live weekly meal query to hydrate each visible meal with ingredient data in `projects/meal-planner/index.tsx`
- [X] T019 [US1] Create a shared meal card that shows ingredient previews and add/edit/delete actions in `projects/meal-planner/components/MealCard.tsx`
- [X] T020 [US1] Render the shared meal card from the desktop grid path in `projects/meal-planner/components/MealGrid.tsx`
- [X] T021 [US1] Render the shared meal card from the mobile carousel path in `projects/meal-planner/components/MealCarousel.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 5 - Visual/UX Overhaul (Priority: P1-parallel)

**Goal**: The meal planner uses consistent shared components, dynamic responsive behavior, clear loading/empty states, and confirmation before deletion.

**Independent Test**: Resize from desktop to mobile and back without reload, delete a meal and confirm the confirmation/undo behavior, verify add/edit/grocery modals use Dialog/Drawer, and confirm no obvious dead imports or duplicated handler paths remain.

### Implementation for User Story 5

- [X] T022 [P] [US5] Replace mount-only `window.innerWidth` layout detection with the existing media query hook in `projects/meal-planner/index.tsx`
- [X] T023 [P] [US5] Add loading and empty-week states with clear add actions in `projects/meal-planner/components/MealPlannerTool.tsx`
- [X] T024 [US5] Move delete confirmation behavior into the shared meal card before permanent Dexie deletion in `projects/meal-planner/components/MealCard.tsx`
- [X] T025 [US5] Remove duplicated add/edit/delete handler logic from the mobile carousel after shared meal card adoption in `projects/meal-planner/components/MealCarousel.tsx`
- [X] T026 [US5] Remove duplicated add/edit/delete handler logic from the desktop grid panel path or retire `MealGridPanel` in `projects/meal-planner/components/MealGridPanel.tsx`
- [X] T027 [US5] Remove dead imports and unused state from the meal planner root in `projects/meal-planner/index.tsx`
- [X] T028 [US5] Refresh toolbar spacing, responsive constraints, and action button layout in `projects/meal-planner/components/MealPlannerTool.tsx`

**Checkpoint**: User Story 5 behavior is demonstrable independently and supports the remaining stories.

---

## Phase 5: User Story 2 - Grocery List Generation (Priority: P2)

**Goal**: Users can open an editable grocery list for the current week, aggregate ingredients by same name and same unit, and persist list edits without changing source meals.

**Independent Test**: Plan at least three meals with overlapping ingredients; open the grocery list; confirm same-unit aggregation, different-unit separation, checked state, edited quantities, added freeform items, and persistence after close/reopen.

### Implementation for User Story 2

- [X] T029 [US2] Add helper functions to generate weekly grocery rows from meals, foods, and recipes with no cross-unit conversion in `projects/meal-planner/components/mealPlannerData.ts`
- [X] T030 [US2] Add helper functions to apply and persist weekly grocery overrides and freeform rows in `projects/meal-planner/components/mealPlannerData.ts`
- [X] T031 [US2] Create the responsive grocery list dialog with generated rows, checkboxes, quantity edits, remove controls, and freeform item creation in `projects/meal-planner/components/GroceryListDialog.tsx`
- [X] T032 [US2] Wire grocery list open/close state and current week data into the meal planner root in `projects/meal-planner/index.tsx`
- [X] T033 [US2] Add the "Grocery List" toolbar action for the current week in `projects/meal-planner/components/MealPlannerTool.tsx`
- [X] T034 [US2] Ensure the grocery list reacts to live meal, recipe, and grocery override changes while open in `projects/meal-planner/components/GroceryListDialog.tsx`

**Checkpoint**: User Story 2 is fully functional and testable independently after User Story 1 data exists.

---

## Phase 6: User Story 3 - Copy/Repeat Weeks (Priority: P3)

**Goal**: Users can copy all meals and ingredients from one week to another, either merging into empty slots or replacing destination meals.

**Independent Test**: Fill a full week, copy it to a target week, confirm all 21 slots and ingredients copied, then edit a destination meal and confirm the source week is unchanged.

### Implementation for User Story 3

- [X] T035 [US3] Add transactional week copy helpers for merge, replace, self-copy blocking, destination cleanup, and independent recipe row duplication in `projects/meal-planner/components/mealPlannerData.ts`
- [X] T036 [US3] Create the copy week dialog with destination week picker, merge/replace choice, conflict warning, and self-copy message in `projects/meal-planner/components/WeekCopyDialog.tsx`
- [X] T037 [US3] Wire copy week open/close state and completion feedback into `projects/meal-planner/index.tsx`
- [X] T038 [US3] Add the "Copy Week" toolbar action in `projects/meal-planner/components/MealPlannerTool.tsx`
- [X] T039 [US3] Ensure copied meals and recipe rows appear through the existing live weekly query after navigation in `projects/meal-planner/index.tsx`

**Checkpoint**: User Story 3 is fully functional and testable independently.

---

## Phase 7: User Story 4 - Recipe Instructions (Priority: P4)

**Goal**: Users can optionally add meal preparation instructions and view them from meal cards without affecting meals that have none.

**Independent Test**: Add a meal with instructions, confirm the indicator appears on the grid/card, open the details and read the instructions, then confirm a meal without instructions has no indicator.

### Implementation for User Story 4

- [X] T040 [US4] Add optional instructions input to the add-meal dialog in `projects/meal-planner/components/AddMealModal.tsx`
- [X] T041 [US4] Add optional instructions input to the edit-meal dialog in `projects/meal-planner/components/EditMealModal.tsx`
- [X] T042 [US4] Persist instructions on meal create/update flows in `projects/meal-planner/components/mealPlannerData.ts`
- [X] T043 [US4] Add instructions indicator and readable detail display to meal cards in `projects/meal-planner/components/MealCard.tsx`

**Checkpoint**: User Story 4 is fully functional and testable independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Finish metadata, code viewer visibility, documentation, and full validation.

- [ ] T044 [P] Update meal planner metadata, documentation, `updatedAt`, `aiTools`, and feature descriptions in `projects/meal-planner/metadata.json`
- [ ] T045 Update the meal planner `codeFiles` list for new/removed components in `projects/registry.ts`
- [ ] T046 Run the full quickstart validation flow from `specs/002-meal-planner-enhanced/quickstart.md`
- [ ] T047 Time the SC-001, SC-002, and SC-004 scenarios from `specs/002-meal-planner-enhanced/spec.md` and document whether create-meal, grocery-generation, and week-copy thresholds pass in `specs/002-meal-planner-enhanced/quickstart.md`
- [ ] T048 Run `npm run build` using `package.json` and fix any meal planner TypeScript or Next.js build errors in `projects/meal-planner/`, `models/db.ts`, or `models/interfaces.ts`
- [ ] T049 Final cleanup pass for unused imports, deleted component references, duplicate code paths, and responsive text/layout issues across `projects/meal-planner/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **US1 Ingredient Tracking (Phase 3)**: Depends on Foundational; MVP.
- **US5 Visual/UX Overhaul (Phase 4)**: Depends on Foundational; should be completed early because later dialogs/cards build on it.
- **US2 Grocery List (Phase 5)**: Depends on Foundational and benefits from US1 ingredient data.
- **US3 Copy/Repeat Weeks (Phase 6)**: Depends on Foundational and benefits from US1 recipe row helpers.
- **US4 Recipe Instructions (Phase 7)**: Depends on Foundational; can be added after or alongside US1 dialog work.
- **Polish (Phase 8)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Requires Foundation only.
- **US5 (P1-parallel)**: Requires Foundation only; overlaps with shared card/dialog work.
- **US2 (P2)**: Requires ingredient/recipe data from US1 for meaningful generated lists.
- **US3 (P3)**: Requires recipe helper patterns from Foundation/US1 to copy ingredients.
- **US4 (P4)**: Requires Meal instructions typing and shared dialog/card surfaces.

### Parallel Opportunities

- T002 and T003 can run in parallel with T001 review.
- T007 can run in parallel with T004-T006 once model fields are agreed.
- T011 and T012 can run in parallel after Foundation.
- T022 and T023 can run in parallel after Foundation.
- T044 can run in parallel during final validation once user-facing feature scope is stable.

---

## Parallel Example: User Story 1

```bash
Task: "Create the ingredient row editor UI with add, edit, remove, quantity, and unit controls in projects/meal-planner/components/IngredientEditor.tsx"
Task: "Create a shared responsive meal dialog shell that uses Dialog on desktop and Drawer on mobile in projects/meal-planner/components/ResponsiveMealDialog.tsx"
```

## Parallel Example: User Story 5

```bash
Task: "Replace mount-only window.innerWidth layout detection with the existing media query hook in projects/meal-planner/index.tsx"
Task: "Add loading and empty-week states with clear add actions in projects/meal-planner/components/MealPlannerTool.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup review.
2. Complete Phase 2 foundation, especially Dexie v4 migration and data helpers.
3. Complete Phase 3 ingredient tracking.
4. Stop and validate the US1 independent test before adding grocery, copy, or instruction enhancements.

### Incremental Delivery

1. Foundation ready.
2. Add US1 ingredient tracking and validate.
3. Add US5 shared UI/responsive cleanup and validate.
4. Add US2 grocery list and validate.
5. Add US3 copy week and validate.
6. Add US4 instructions and validate.
7. Complete metadata, registry, quickstart, and build validation.

### Notes

- Do not add npm packages unless a task explicitly proves the existing primitives cannot meet the contract.
- Preserve existing user meal data during the Dexie migration.
- Grocery list edits must never mutate source meal ingredient rows.
- Different units must remain separate grocery list lines; do not implement unit conversion.

# Quickstart: Meal Planner Enhanced

## Prerequisites

- Branch: `002-meal-planner-enhanced`
- Node dependencies already installed in the repo

## Run Locally

```bash
npm run dev
```

Open `/showcase/meal-planner`.

## Validation Flow

1. Start with an existing browser profile that has old meal planner data, or create several meals before applying the migration.
2. Load the meal planner and confirm existing meals still appear in their original week/day/type slots.
3. Add a meal with at least five ingredients using repeated and new food names.
4. Edit the same meal and confirm ingredient rows, quantities, units, and optional instructions persist.
5. Add another meal that uses the same ingredient/unit and one same ingredient/different unit.
6. Open the grocery list for the week and confirm same-name/same-unit rows aggregate while different units remain separate.
7. Check off an item, edit a quantity, add a freeform item, close and reopen the list, and confirm those grocery edits persist without changing meal ingredients.
8. Copy the current week to another week using both merge and replace behavior against a week with existing meals.
9. Resize below and above 768px while the app is open and confirm the layout changes between carousel and grid without reload.
10. Delete a meal and confirm the confirmation/undo behavior appears before permanent removal.

## Build Check

```bash
npm run build
```

The repo does not currently define a unit test script, so implementation verification should pair the build with the manual flow above.

## Validation Results

Validated on June 13, 2026 using an isolated Chromium profile and IndexedDB database.

- **Migration preservation**: PASS. A meal created in a simulated MealPlannerDB v3 database remained in its original Sunday dinner slot after upgrading to v5.
- **Create and edit flow**: PASS. A meal with five ingredients and multiline instructions was created, reopened, edited, and persisted with its quantities, units, ingredient names, and instructions intact.
- **Meal details**: PASS. Ingredient-only meals and meals with instructions expose the responsive details dialog; available ingredients appear above optional instructions.
- **Grocery generation**: PASS. Same-name/same-unit olive oil rows aggregated, the different-unit row remained separate, and checked state, quantity overrides, removals, and freeform rows persisted without changing recipe ingredients.
- **Copy week**: PASS. Merge preserved occupied slots, replace cleared destination meals and recipes, and copied meals retained independent recipe rows and instructions.
- **Responsive layout**: PASS. The live view switched between the desktop grid and mobile carousel across the 768px breakpoint. The mobile page, tabs, metadata badges, carousel controls, cards, and dialogs remained within the scrollable viewport.
- **Delete confirmation**: PASS. Delete actions expose confirmation controls before permanent removal.
- **Cleanup**: PASS. The retired project-local drawer, obsolete `Meal.foods` property, unused MealContext hook, stale database reset comments/imports, and deleted component registry references were removed.

## Performance Results

Measured on June 13, 2026 in an isolated headless Chromium profile on the local development server. Timings measure the requested interaction through the resulting UI/database state.

| Criterion | Threshold | Measured | Result |
| --- | ---: | ---: | --- |
| SC-001: Create and save a meal with 5 ingredients | Under 30 seconds | 234 ms automated interaction | PASS |
| SC-002: Generate grocery list from 15+ meals | Under 2 seconds | 113 ms | PASS |
| SC-004: Copy a full 21-meal week with ingredients | Under 3 seconds | 93 ms | PASS |

SC-003, SC-005, SC-006, SC-007, and SC-008 also passed through the functional validation flow above.

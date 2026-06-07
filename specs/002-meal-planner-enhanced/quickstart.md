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

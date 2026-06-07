# UI Behavior Contract: Meal Planner Enhanced

## Meal Add/Edit Dialog

- Opens from an empty meal slot or existing meal action.
- Uses `Dialog` on desktop and `Drawer` on mobile-sized viewports.
- Requires a non-empty meal title before save.
- Provides ingredient rows with food title, quantity, unit, and remove control.
- Selecting a previous meal title pre-populates the ingredients from that meal's recipe rows.
- Saving writes the meal and all ingredient junction rows in one transaction.
- Optional instructions are editable and saved with the meal.

## Meal Card

- Empty slots expose one add action.
- Filled slots show title, ingredient preview/expand affordance when ingredients exist, instructions indicator when instructions exist, edit action, and delete action.
- Delete requires confirmation or an undo step before permanent deletion.
- Grid and carousel views use the same behavior and visual states.

## Grocery List

- Opens for the currently viewed week.
- Generates rows from all meals in that week.
- Aggregates ingredient quantities only by same normalized ingredient title and same unit.
- Does not convert units.
- Supports checked state, quantity edits, removing generated rows, adding freeform rows, and deleting freeform rows.
- Persisted grocery edits are scoped to the week and do not modify meal ingredients.
- Reacts to meal/ingredient changes while open.

## Copy Week

- Opens from the weekly toolbar.
- Blocks copying a week onto itself.
- When destination week has meals, offers merge and replace modes.
- Merge keeps existing destination meals and fills empty day/type slots.
- Replace removes destination week meals and recipe rows before copying source meals.
- Copied meals and recipe rows are independent records; editing destination does not affect source.

## Responsive Behavior

- The app switches between desktop grid and mobile carousel when crossing the 768px breakpoint during an active session.
- Modal choice follows the same breakpoint.
- No horizontal scrolling or overlapping controls at 320px width.

## Loading and Empty States

- While weekly meal data is loading, the planner shows a non-jarring loading state.
- A week with no meals shows an empty state with a clear add action.
- IndexedDB errors keep the UI usable where possible and display a concise visible message.

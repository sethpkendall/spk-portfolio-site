# Feature Specification: Meal Planner Enhanced

**Feature Branch**: `002-meal-planner-enhanced`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "Ingredient tracking for foods rolled up into meals, generate editable grocery list from a week's meal plan, copy/repeat weeks, optional recipe instructions, visual/UX overhaul"

## Current State Summary

The existing meal planner (`projects/meal-planner/`) provides a weekly grid (desktop) / carousel (mobile) where users can add, edit, and delete meals across breakfast/lunch/dinner slots for each day. Data is persisted in IndexedDB via Dexie.js. The DB schema already defines `Food` and `Recipe` (meal↔food junction) tables, but they are **completely unused** — the app currently only stores a meal's `title`, `date`, and `type`. There is no ingredient tracking, grocery list, week copying, or recipe support. The UI uses a mix of raw HTML modals and inconsistent patterns with notable code duplication between desktop and mobile views.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Ingredient Tracking (Priority: P1)

A user adding or editing a meal can attach ingredients (foods) with quantities and units. When viewing the weekly grid, the user can expand a meal to see its ingredient list. Ingredients are stored and reused — when a user selects an existing meal from the combobox, its previously-saved ingredients auto-populate.

**Why this priority**: Ingredients are the foundational data model that grocery list generation (P2) depends on. Without ingredients, there is nothing to aggregate into a list.

**Independent Test**: Add a meal "Tacos" with ingredients (tortillas ×8, ground beef 1 lb, cheese 2 cups). Navigate away and back — the meal and its ingredients persist. Edit the meal and confirm ingredients are displayed and editable.

**Acceptance Scenarios**:

1. **Given** the user opens the add-meal modal, **When** they type a meal name, **Then** an ingredient entry section appears where they can add items with name, quantity, and unit.
2. **Given** the user has added 3 ingredients to a meal, **When** they click save, **Then** the meal and all 3 ingredients are persisted to IndexedDB.
3. **Given** a meal "Tacos" already exists with ingredients, **When** the user selects "Tacos" from the combobox for a new day, **Then** a new meal is created with the same ingredients pre-populated (user can modify before saving).
4. **Given** the user opens the edit-meal modal for an existing meal, **When** the modal opens, **Then** the meal's current ingredients are displayed and editable (add, remove, change quantity/unit).
5. **Given** the user clicks on a meal in the grid/carousel, **When** the meal has ingredients, **Then** the ingredients are visible (inline preview or expandable detail).

---

### User Story 2 — Grocery List Generation (Priority: P2)

A user can generate a consolidated grocery list from all meals in the currently-viewed week. Duplicate ingredients across meals are aggregated (e.g., "cheese" appearing in 3 meals sums quantities). The list is editable — the user can check off items, adjust quantities, add freeform items, and remove items.

**Why this priority**: This is the primary value-add that transforms the app from a simple calendar into a practical meal-planning tool. Depends on P1 (ingredients).

**Independent Test**: Plan 3+ meals with overlapping ingredients for a week. Open the grocery list — confirm items are aggregated correctly. Check off items, add a freeform item, edit a quantity. Close and reopen — confirm state persists for that week.

**Acceptance Scenarios**:

1. **Given** the user has planned meals with ingredients for a week, **When** they click "Grocery List", **Then** a consolidated list appears showing all ingredients aggregated by name.
2. **Given** "cheese 2 cups" appears in Monday's dinner and "cheese 1 cup" in Wednesday's lunch, **When** the grocery list is generated, **Then** it shows "cheese — 3 cups" as a single aggregated line.
3. **Given** two meals use "olive oil" but with different units (1 tbsp, 0.25 cups), **When** the grocery list is generated, **Then** they appear as separate line items grouped by ingredient name and unit, with no cross-unit conversion attempted.
4. **Given** the grocery list is displayed, **When** the user taps the checkbox next to an item, **Then** the item is visually marked as acquired (strikethrough + dimmed).
5. **Given** the grocery list is displayed, **When** the user clicks "Add Item", **Then** they can type a freeform grocery item not tied to any meal.
6. **Given** the grocery list is displayed, **When** the user edits a quantity or removes an item, **Then** the change persists for that week's list but does NOT modify the source meal's ingredients.
7. **Given** the user navigates to a different week, **When** they open the grocery list, **Then** the list reflects that week's meals (not the previous week's).

---

### User Story 3 — Copy/Repeat Weeks (Priority: P3)

A user can copy an entire week's meal plan to another week, avoiding repetitive data entry. The copy creates independent duplicates — editing the destination week does not affect the source.

**Why this priority**: High convenience feature that dramatically reduces setup time for users with recurring meal patterns. Does not depend on P1/P2. 

**Independent Test**: Plan a full week of meals. Use "Copy Week" and select a target week. Navigate to the target week — confirm all 21 slots are populated identically. Edit one meal on the target week — confirm the source week is unchanged.

**Acceptance Scenarios**:

1. **Given** the user is viewing a week with meals planned, **When** they click "Copy Week", **Then** they are prompted to select a destination week.
2. **Given** the user selects a destination week that already has some meals, **When** they confirm the copy, **Then** they are warned about overwriting and can choose to merge (keep existing + fill empty slots) or replace.
3. **Given** the user confirms a week copy, **When** the operation completes, **Then** all meals (including their ingredients) are duplicated as new independent records on the destination week.
4. **Given** a week was copied, **When** the user edits or deletes a meal on the destination week, **Then** the source week's meals are unaffected.

---

### User Story 4 — Recipe Instructions (Priority: P4)

A user can optionally attach preparation instructions to a meal. Instructions are stored with the meal and viewable from the grid/detail view. This is opt-in — meals without instructions work exactly as they do today.

**Why this priority**: Nice-to-have that enriches the app but is not core to the planning/shopping workflow. Lowest implementation cost.

**Independent Test**: Add a meal with instructions. View the meal in the grid — confirm an indicator shows instructions exist. Click to view — confirm instructions are displayed. Create a meal without instructions — confirm it still works normally.

**Acceptance Scenarios**:

1. **Given** the user is adding or editing a meal, **When** they see the instructions field, **Then** it is an optional multi-line text area.
2. **Given** a meal has instructions saved, **When** the user views the meal in the grid, **Then** a visual indicator (icon) signals that instructions are available.
3. **Given** the user clicks the instructions indicator on a meal, **When** the instructions view opens, **Then** the full text is displayed in a readable format.
4. **Given** a meal has no instructions, **When** the user views the meal in the grid, **Then** no instructions indicator is shown, and all other functionality works normally.

---

### User Story 5 — Visual/UX Overhaul (Priority: P1-parallel)

The entire meal planner receives a visual refresh addressing code quality issues and UX gaps. This is worked on in parallel with other stories and applied across all new and existing components.

**Why this priority**: The current implementation has significant code quality issues (duplicated logic, dead code, inconsistent patterns, missing responsive resize handling) that will compound if new features are built on top. Cleaning the foundation first ensures the new features are built correctly.

**Independent Test**: Resize the browser from desktop to mobile and back — confirm the layout switches dynamically. Delete a meal — confirm an undo/confirmation step appears. Verify modals use consistent shadcn Dialog component. Confirm no dead imports, unused variables, or duplicated handler logic remain.

**Acceptance Scenarios**:

1. **Given** the user resizes the browser window below 768px, **When** the resize completes, **Then** the layout switches from grid to carousel without a page reload.
2. **Given** the user resizes the browser window above 768px, **When** the resize completes, **Then** the layout switches from carousel to grid.
3. **Given** the user clicks delete on a meal, **When** the delete action is triggered, **Then** a confirmation dialog or undo toast appears before the meal is permanently removed.
4. **Given** any modal is opened (add, edit, grocery list), **When** the modal renders, **Then** it uses the shadcn Dialog or Drawer component (not raw HTML overlays).
5. **Given** the app loads with no meals planned for the current week, **When** the empty grid is displayed, **Then** a clear empty-state message with a call-to-action is shown.
6. **Given** the app is loading data, **When** the query is in progress, **Then** a loading skeleton or spinner is displayed.

### Edge Cases

- What happens when a meal is copied and references reusable Food catalog entries? → Referenced Food rows are retained while any Recipe rows use them; week copy duplicates the Meal and Recipe rows while reusing the same Food catalog entries.
- What happens when the user copies a week onto itself? → The operation should be blocked with a message ("Source and destination week are the same").
- What happens when the grocery list is open and the user modifies a meal's ingredients? → The grocery list should reactively update (Dexie live queries).
- What happens when two meals use the same ingredient name but different units (e.g., "1 tbsp" vs "0.25 cups" of olive oil, or "1 bunch" vs "3 cups" of cilantro)? → Amounts are aggregated only when ingredient name and unit match; different units remain separate shopping list lines and no unit conversion is attempted.
- What happens when a meal is deleted while the grocery list is open? → The grocery list should update to remove those ingredients.
- What happens when the user has an existing database from the old version? → Migration must preserve all existing meals. New fields (ingredients, instructions) default to empty arrays/null.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add, edit, and remove ingredients (name, quantity, unit) on any meal.
- **FR-002**: System MUST persist ingredients in IndexedDB, associated with their parent meal.
- **FR-003**: When selecting an existing meal from the combobox, the system MUST pre-populate its saved ingredients (editable before saving).
- **FR-004**: System MUST generate a grocery list from all meals in the currently-viewed week, aggregating ingredients by name when units match.
- **FR-005**: The grocery list MUST support: checking off items, editing quantities, adding freeform items, and removing items.
- **FR-006**: Grocery list edits MUST NOT modify the source meal's ingredient data.
- **FR-007**: System MUST allow users to copy all meals from one week to a target week, including ingredients.
- **FR-008**: Week copy MUST create independent meal records (no shared references with the source).
- **FR-009**: When copying to a week with existing meals, the system MUST offer a merge or replace option.
- **FR-010**: System MUST allow optional free-text instructions to be saved with a meal.
- **FR-011**: All modals MUST use shadcn Dialog (desktop) or Drawer (mobile) components — no raw HTML overlays.
- **FR-012**: Layout MUST dynamically switch between grid and carousel on browser resize (not just on mount).
- **FR-013**: Delete actions MUST include confirmation or undo capability.
- **FR-014**: The app MUST handle database migration from the current schema (version 3) without losing existing meal data.
- **FR-015**: System MUST remove all dead code, unused imports, and duplicated handler logic from the current implementation.
- **FR-016**: Empty states and loading states MUST be handled with appropriate visual feedback.

### Key Entities

- **Meal**: A planned meal for a specific date and type (breakfast/lunch/dinner). Has a title, optional instructions, and zero or more ingredients. Multiple meal records can share the same title (representing the same dish on different days).
- **Ingredient**: A food item with a quantity and unit, belonging to a specific meal instance through the existing Food table and Recipe junction table. Foods act as reusable catalog entries; the junction table stores the meal-specific quantity and unit so each meal can use the same food with different amounts.
- **GroceryListItem**: An aggregated or freeform grocery item for a specific week. May be derived from meal ingredients or user-added. Has a checked/unchecked state. Ephemeral per-week — not derived from a separate persistent table unless the user modifies the list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a meal with 5 ingredients and save it in under 30 seconds.
- **SC-002**: A user can generate a grocery list from a week with 15+ meals in under 2 seconds.
- **SC-003**: Grocery list correctly aggregates same-name, same-unit ingredients across all meals in the week.
- **SC-004**: Copying a full week (21 meals) completes in under 3 seconds with all ingredients preserved.
- **SC-005**: The app passes a resize test: switching between mobile and desktop layouts functions correctly at any point during use.
- **SC-006**: Zero dead code, unused imports, or duplicated handler functions remain in the final codebase.
- **SC-007**: All modals and interactive elements use consistent shadcn UI components.
- **SC-008**: Existing users' meal data is fully preserved after the database migration.

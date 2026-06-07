# Research: Meal Planner Enhanced

## Decision: Reuse `foods` plus extend `recipes` as the meal-food junction

**Rationale**: The current `MealPlannerDB` already defines `foods` and `recipes`, and the user confirmed the reusable catalog approach. This keeps ingredient names reusable while allowing each meal instance to store its own quantity and unit on the junction row.

**Alternatives considered**:
- Inline ingredients on each meal: simpler reads, but duplicates food names and contradicts the confirmed storage direction.
- Fully normalized recipe templates separate from planned meals: more powerful, but too large for this feature and the current app model.

## Decision: Aggregate grocery items by normalized food title plus exact unit

**Rationale**: The user clarified that cross-unit conversion should not be attempted. Aggregating only same-name/same-unit entries is deterministic, transparent, and avoids fragile measurement conversion logic.

**Alternatives considered**:
- Convert compatible units such as tablespoons to cups: convenient in some cases, but ambiguous for mass/volume/loose units and outside current scope.
- Never aggregate duplicates: easiest, but fails the primary grocery list value.

## Decision: Persist user grocery edits as weekly overrides, not as meal ingredient changes

**Rationale**: The spec requires grocery list edits to persist for a week without modifying source meal ingredients. Store generated items as derived data and persist only user-specific overrides/freeform rows keyed by week.

**Alternatives considered**:
- Persist every generated list snapshot: risks stale data when meals change and makes reactive updates harder.
- Store grocery edits on meals/recipes: violates the requirement that grocery edits do not mutate source ingredients.

## Decision: Use Dexie transactions for meal + recipe writes and week copy

**Rationale**: Adding/editing a meal now touches `meals`, `foods`, and `recipes`. Week copy duplicates many meal records plus junction rows. Dexie transactions keep these changes consistent and reduce partial-write risk.

**Alternatives considered**:
- Sequential writes without transactions: simpler code but leaves orphaned or missing recipe rows if an operation fails.
- Introduce a service/repository abstraction: not necessary unless helper functions become meaningfully shared across components.

## Decision: Replace raw modal overlays with existing shadcn Dialog and Drawer primitives

**Rationale**: The repo already has `components/ui/dialog.tsx` and `components/ui/drawer.tsx`, and the spec explicitly requires consistent Dialog/Drawer usage. This improves accessibility, focus behavior, and visual consistency without new packages.

**Alternatives considered**:
- Keep current portal/raw HTML overlays and restyle: fails the spec requirement.
- Add a new modal library: violates the constitution unless absolutely necessary.

## Decision: Use a resize-aware media query hook rather than mount-only `window.innerWidth`

**Rationale**: The current app sets mobile/desktop layout only on mount. Using the existing `useMediaQuery` hook or a small local resize listener makes layout switch dynamically as required.

**Alternatives considered**:
- CSS-only render both layouts: simpler responsiveness, but risks duplicated interactive trees and harder carousel/grid state handling.
- Keep mount-only behavior: fails FR-012.

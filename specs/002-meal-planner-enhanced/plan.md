# Implementation Plan: Meal Planner Enhanced

**Branch**: `002-meal-planner-enhanced` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-meal-planner-enhanced/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Enhance the existing `projects/meal-planner` showcase app with ingredient tracking, a generated/editable weekly grocery list, week copy/repeat, optional recipe instructions, and a visual/UX cleanup. The implementation will preserve the current client-only Next.js showcase architecture, use the existing Dexie `MealPlannerDB`, extend the existing `foods` and `recipes` model into a usable food catalog plus meal-food junction, add a small persisted grocery list override layer, and refactor duplicated desktop/mobile meal interactions into shared meal card and dialog flows.

## Technical Context

**Language/Version**: TypeScript 5.1.6, React 18.2, Next.js current repo version  
**Primary Dependencies**: Existing React hooks, Tailwind CSS, Dexie 4.0.8, dexie-react-hooks, Radix/shadcn UI wrappers, vaul Drawer, lucide-react, date-fns/light-date  
**Storage**: IndexedDB through `MealPlannerDB` in `models/db.ts`; versioned Dexie migration from current v3 through a v4 table-reset bridge to the v5 schema  
**Testing**: `npm run build` for TypeScript/Next validation; manual quickstart scenarios for IndexedDB behavior and responsive UX because the repo has no configured unit test script  
**Target Platform**: Client-only showcase project rendered by Next.js at `/showcase/meal-planner`  
**Project Type**: Single frontend showcase app embedded in the portfolio  
**Performance Goals**: Generate a grocery list from 15+ weekly meals in under 2 seconds; copy 21 meals with ingredient junction rows in under 3 seconds; keep resize/layout interactions immediate on mobile and desktop  
**Constraints**: No new npm packages unless unavoidable; no server actions, API routes, or external services; preserve existing meal data during migration; use Dialog/Drawer rather than raw overlay markup  
**Scale/Scope**: One existing showcase app, roughly 7 days x 3 meal slots per week, local single-user IndexedDB data, reusable meal catalog based on prior meal names and food records

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Self-contained project architecture**: PASS. User-facing work stays in `projects/meal-planner/` plus shared project database/types in `models/`, matching the existing portfolio convention.
- **Technology stack constraints**: PASS. Plan uses only existing dependencies already present in `package.json`.
- **Data layer convention**: PASS. Persistence remains client-side Dexie/IndexedDB in `models/db.ts` and `models/interfaces.ts`; no server/API work.
- **Polish & visual quality**: PASS. Visual refresh, responsive resize behavior, loading/empty states, and Dialog/Drawer modal replacement are explicit requirements.
- **Simplicity & pragmatism**: PASS. The implementation reuses the existing DB tables and shared UI primitives rather than introducing new state libraries or services.
- **Registry & metadata**: PASS. Existing project remains registered; `projects/meal-planner/metadata.json` should be updated to mention enhanced grocery/ingredient features and Spec-Kit.

## Project Structure

### Documentation (this feature)

```text
specs/002-meal-planner-enhanced/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-behavior.md
└── tasks.md
```

### Source Code (repository root)

```text
models/
├── db.ts                         # MealPlannerDB v5 schema and migration bridge
└── interfaces.ts                 # Meal, Food, Recipe, GroceryListItem types

projects/meal-planner/
├── index.tsx                     # Feature orchestration, live queries, modal state
├── metadata.json                 # Updated feature/docs metadata
└── components/
    ├── AddMealModal.tsx          # Replace raw overlay with Dialog/Drawer form flow
    ├── EditMealModal.tsx         # Edit meal, ingredients, optional instructions
    ├── GroceryListDialog.tsx     # Generated/editable weekly grocery list
    ├── IngredientEditor.tsx      # Add/edit/remove ingredient rows
    ├── MealCard.tsx              # Shared display/actions for grid and carousel
    ├── MealCarousel.tsx          # Mobile weekly view using shared card behavior
    ├── MealCombobox.tsx          # Meal selection, prefill from previous recipes
    ├── MealGrid.tsx              # Desktop weekly view using shared card behavior
    ├── MealPlannerTool.tsx       # Toolbar, view shell, week actions
    ├── ResponsiveMealDialog.tsx  # Shared Dialog/Drawer shell for meal forms
    ├── WeekCopyDialog.tsx        # Copy week merge/replace flow
    ├── mealPlannerData.ts        # Dexie helpers, ingredient joins, grocery generation, week copy
    └── types.ts                  # Shared meal planner component/data types
```

**Structure Decision**: Keep the existing single showcase project structure. Add focused meal-planner components only where they reduce duplication or isolate high-risk behavior (ingredient editing, grocery list generation, week copy). Shared persistent types remain in `models/` because the current app already imports meal planner DB/types from there.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design & Contracts

See [data-model.md](./data-model.md), [contracts/ui-behavior.md](./contracts/ui-behavior.md), and [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- **Self-contained project architecture**: PASS. New source files are scoped to `projects/meal-planner/components/` except shared Dexie types/schema.
- **Technology stack constraints**: PASS. No new dependency is required by the design artifacts.
- **Data layer convention**: PASS. Versioned IndexedDB migration preserves existing meals and introduces no external storage.
- **Polish & visual quality**: PASS. Contracts include responsive behavior, loading/empty states, and Dialog/Drawer modal requirements.
- **Simplicity & pragmatism**: PASS. Data writes are direct Dexie transactions/helpers rather than a separate repository or global state layer.
- **Registry & metadata**: PASS. Metadata update is part of implementation scope; registry changes are not required unless codeFiles are changed and the viewer needs the new component list.

## Complexity Tracking

No constitution violations require justification.

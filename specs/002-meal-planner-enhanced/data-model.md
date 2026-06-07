# Data Model: Meal Planner Enhanced

## Meal

Represents one planned meal instance in a day/type slot.

**Fields**:
- `id?: number`
- `title: string`
- `date?: Date`
- `type: "breakfast" | "lunch" | "dinner" | string`
- `instructions?: string`

**Relationships**:
- Has many `Recipe` rows by `mealId`.
- Gets ingredients by joining `recipes.foodId` to `foods.id`.

**Validation**:
- `title` is required after trimming.
- `date` and `type` are required for planned meals.
- `instructions` is optional and may be empty.

## Food

Reusable food catalog entry.

**Fields**:
- `id?: number`
- `title: string`
- `normalizedTitle?: string`

**Relationships**:
- Referenced by many `Recipe` rows.

**Validation**:
- `title` is required after trimming.
- `normalizedTitle` should be lowercased/collapsed whitespace for lookup and grocery aggregation.
- Creating an ingredient should reuse an existing food with the same normalized title when possible.

## Recipe

Meal-food junction row that stores meal-specific ingredient details.

**Fields**:
- `id?: number`
- `mealId: number`
- `foodId: number`
- `quantity: number`
- `unit: string`
- `sortOrder?: number`

**Relationships**:
- Belongs to one `Meal`.
- Belongs to one `Food`.

**Validation**:
- `mealId` and `foodId` must reference existing rows before save completes.
- `quantity` must be positive.
- `unit` is required after trimming.
- Rows for one meal should preserve display order with `sortOrder`.

## GroceryListItem

Persisted user override or freeform grocery row for one week. Generated meal-derived rows are computed from `Meal` + `Recipe` + `Food`; this entity stores only user changes.

**Fields**:
- `id?: number`
- `weekStart: string`
- `sourceKey?: string`
- `foodId?: number`
- `title: string`
- `normalizedTitle: string`
- `quantity?: number`
- `unit?: string`
- `checked: boolean`
- `removed?: boolean`
- `isFreeform: boolean`
- `createdAt: Date`
- `updatedAt: Date`

**Relationships**:
- May correspond to a generated grocery row through `sourceKey`.
- Freeform rows have no `foodId` or `sourceKey`.

**Validation**:
- `weekStart` is an ISO date string for the week start.
- `title` is required.
- `sourceKey` format for generated rows: `food:<foodId>|unit:<normalized-unit>`.
- `checked` and `removed` affect grocery list display only and must not mutate recipe rows.

## Derived Grocery Row

Computed display row used by the grocery list.

**Fields**:
- `sourceKey: string`
- `foodId: number`
- `title: string`
- `normalizedTitle: string`
- `quantity: number`
- `unit: string`
- `mealRefs: number[]`
- `checked: boolean`
- `removed: boolean`

**Aggregation Rules**:
- Aggregate only when normalized food title and exact normalized unit match.
- Do not convert between units.
- Apply persisted grocery overrides after generation.
- Hide generated rows marked `removed`; keep freeform rows unless deleted.

## Dexie Schema Direction

Current v3:

```ts
meals: "++id, title, date"
foods: "++id, title"
recipes: "mealId, foodId"
```

Planned final v5 schema:

```ts
meals: "++id, title, date, type"
foods: "++id, title, normalizedTitle"
recipes: "++id, mealId, foodId, [mealId+foodId]"
groceryListItems: "++id, weekStart, sourceKey, [weekStart+sourceKey], isFreeform"
```

Migration rules:
- Preserve all existing `meals`.
- Add optional `instructions` without requiring migration changes for existing rows.
- Keep existing `foods`.
- Drop the previously unused v3 `recipes` table in a v4 bridge migration because IndexedDB cannot change its primary key in place, then recreate it with the final v5 schema.
- Add `groceryListItems` empty for existing users.

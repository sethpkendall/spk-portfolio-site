import { mpDB } from "@/models/db";
import { Food, GroceryListItem, Meal, MealIngredient, Recipe } from "@/models/interfaces";
import { GroceryRow, IngredientDraft, MealType, WeekMealState } from "./types";

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export function normalizeTitle(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeUnit(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getWeekBounds(startDate: Date): { startDate: Date; endDate: Date } {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { startDate: start, endDate: end };
}

export function dateKey(date: Date): string {
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

export function weekKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createEmptyWeekState(weekDateStrings: string[]): WeekMealState {
  return weekDateStrings.reduce((state, currentDateString) => {
    state[currentDateString] = {
      breakfast: null,
      lunch: null,
      dinner: null,
    };
    return state;
  }, {} as WeekMealState);
}

export function ingredientToDraft(ingredient: MealIngredient): IngredientDraft {
  return {
    id: `${ingredient.recipeId ?? ingredient.foodId ?? ingredient.title}-${ingredient.sortOrder ?? 0}`,
    foodId: ingredient.foodId,
    title: ingredient.title,
    quantity: String(ingredient.quantity),
    unit: ingredient.unit,
  };
}

export function draftToIngredient(draft: IngredientDraft, sortOrder: number): MealIngredient | null {
  const title = draft.title.trim();
  const unit = draft.unit.trim();
  const quantity = Number(draft.quantity);

  if (!title || !unit || !Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return {
    foodId: draft.foodId,
    title,
    normalizedTitle: normalizeTitle(title),
    quantity,
    unit,
    sortOrder,
  };
}

export function createBlankIngredientDraft(): IngredientDraft {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: "",
    quantity: "1",
    unit: "",
  };
}

export async function loadMealIngredients(mealId: number): Promise<MealIngredient[]> {
  const recipes = await mpDB.recipes.where("mealId").equals(mealId).sortBy("sortOrder");
  const foods = await Promise.all(
    recipes.map(async recipe => {
      const food = await mpDB.foods.get(recipe.foodId);
      return toMealIngredient(recipe, food);
    })
  );

  return foods.filter((ingredient): ingredient is MealIngredient => Boolean(ingredient));
}

export async function hydrateMeal(meal: Meal): Promise<Meal> {
  if (!meal.id) {
    return { ...meal, ingredients: [] };
  }

  return {
    ...meal,
    ingredients: await loadMealIngredients(meal.id),
  };
}

export async function hydrateMeals(meals: Meal[]): Promise<Meal[]> {
  return Promise.all(meals.map(hydrateMeal));
}

export async function findLatestMealByTitle(title: string): Promise<Meal | undefined> {
  const matches = await mpDB.meals.where("title").equals(title).toArray();
  const sorted = matches.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });

  return sorted[0] ? hydrateMeal(sorted[0]) : undefined;
}

export async function upsertFood(title: string): Promise<number> {
  const normalizedTitle = normalizeTitle(title);
  const existing = await mpDB.foods.where("normalizedTitle").equals(normalizedTitle).first();

  if (existing?.id) {
    if (existing.title !== title) {
      await mpDB.foods.update(existing.id, { title });
    }
    return existing.id;
  }

  return mpDB.foods.add({ title, normalizedTitle });
}

export async function saveMealWithIngredients(
  meal: Omit<Meal, "id" | "ingredients" | "foods">,
  ingredients: MealIngredient[],
): Promise<number> {
  return mpDB.transaction("rw", mpDB.meals, mpDB.foods, mpDB.recipes, async () => {
    const mealId = await mpDB.meals.add(meal);
    await replaceMealIngredients(mealId, ingredients);
    return mealId;
  });
}

export async function updateMealWithIngredients(
  meal: Meal,
  ingredients: MealIngredient[],
): Promise<void> {
  if (!meal.id) return;

  await mpDB.transaction("rw", mpDB.meals, mpDB.foods, mpDB.recipes, async () => {
    await mpDB.meals.put({
      id: meal.id,
      title: meal.title,
      date: meal.date,
      type: meal.type,
      instructions: meal.instructions,
    });
    await replaceMealIngredients(meal.id!, ingredients);
  });
}

export async function deleteMealWithRecipes(mealId: number): Promise<void> {
  await mpDB.transaction("rw", mpDB.meals, mpDB.recipes, async () => {
    await mpDB.recipes.where("mealId").equals(mealId).delete();
    await mpDB.meals.delete(mealId);
  });
}

export async function generateWeeklyGroceryRows(weekStart: Date): Promise<GroceryRow[]> {
  const { startDate, endDate } = getWeekBounds(weekStart);
  const meals = await mpDB.meals.where("date").between(startDate, endDate, true, true).toArray();
  const hydratedMeals = await hydrateMeals(meals);
  const aggregated = new Map<string, GroceryRow>();

  for (const meal of hydratedMeals) {
    for (const ingredient of meal.ingredients ?? []) {
      const normalizedTitle = ingredient.normalizedTitle ?? normalizeTitle(ingredient.title);
      const normalizedUnit = normalizeUnit(ingredient.unit);
      const sourceKey = `food:${normalizedTitle}|unit:${normalizedUnit}`;
      const existing = aggregated.get(sourceKey);

      if (existing) {
        existing.quantity = (existing.quantity ?? 0) + ingredient.quantity;
      } else {
        aggregated.set(sourceKey, {
          sourceKey,
          foodId: ingredient.foodId,
          title: ingredient.title,
          normalizedTitle,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          checked: false,
          removed: false,
          isFreeform: false,
        });
      }
    }
  }

  const overrides = await mpDB.groceryListItems.where("weekStart").equals(weekKey(startDate)).toArray();
  const overridesBySource = new Map(
    overrides.filter(item => item.sourceKey).map(item => [item.sourceKey!, item])
  );

  const generatedRows = Array.from(aggregated.values()).map(row => {
    const override = row.sourceKey ? overridesBySource.get(row.sourceKey) : undefined;
    return override ? applyGroceryOverride(row, override) : row;
  });

  const freeformRows = overrides
    .filter(item => item.isFreeform && !item.removed)
    .map(item => groceryItemToRow(item));

  return [...generatedRows.filter(row => !row.removed), ...freeformRows].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

export async function saveGroceryOverride(weekStart: Date, row: GroceryRow): Promise<void> {
  const startKey = weekKey(getWeekBounds(weekStart).startDate);
  const now = new Date();
  const existing = row.sourceKey
    ? await mpDB.groceryListItems.where("[weekStart+sourceKey]").equals([startKey, row.sourceKey]).first()
    : row.id
      ? await mpDB.groceryListItems.get(row.id)
      : undefined;

  const item: GroceryListItem = {
    id: existing?.id ?? row.id,
    weekStart: startKey,
    sourceKey: row.sourceKey,
    foodId: row.foodId,
    title: row.title.trim(),
    normalizedTitle: normalizeTitle(row.title),
    quantity: row.quantity,
    unit: row.unit?.trim(),
    checked: row.checked,
    removed: row.removed,
    isFreeform: row.isFreeform,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await mpDB.groceryListItems.put(item);
}

export async function addFreeformGroceryItem(weekStart: Date, title: string): Promise<void> {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  const now = new Date();
  await mpDB.groceryListItems.add({
    weekStart: weekKey(getWeekBounds(weekStart).startDate),
    title: trimmedTitle,
    normalizedTitle: normalizeTitle(trimmedTitle),
    checked: false,
    removed: false,
    isFreeform: true,
    createdAt: now,
    updatedAt: now,
  });
}

export async function removeGroceryRow(weekStart: Date, row: GroceryRow): Promise<void> {
  if (row.isFreeform && row.id) {
    await mpDB.groceryListItems.delete(row.id);
    return;
  }

  await saveGroceryOverride(weekStart, { ...row, removed: true });
}

async function replaceMealIngredients(mealId: number, ingredients: MealIngredient[]): Promise<void> {
  await mpDB.recipes.where("mealId").equals(mealId).delete();

  for (let index = 0; index < ingredients.length; index += 1) {
    const ingredient = ingredients[index];
    const foodId = ingredient.foodId ?? await upsertFood(ingredient.title);
    await mpDB.recipes.add({
      mealId,
      foodId,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      sortOrder: ingredient.sortOrder ?? index,
    });
  }
}

function applyGroceryOverride(row: GroceryRow, override: GroceryListItem): GroceryRow {
  return {
    ...row,
    id: override.id,
    title: override.title || row.title,
    normalizedTitle: override.normalizedTitle || row.normalizedTitle,
    quantity: override.quantity ?? row.quantity,
    unit: override.unit ?? row.unit,
    checked: override.checked,
    removed: override.removed ?? false,
  };
}

function groceryItemToRow(item: GroceryListItem): GroceryRow {
  return {
    id: item.id,
    sourceKey: item.sourceKey,
    foodId: item.foodId,
    title: item.title,
    normalizedTitle: item.normalizedTitle,
    quantity: item.quantity,
    unit: item.unit,
    checked: item.checked,
    removed: item.removed ?? false,
    isFreeform: item.isFreeform,
  };
}

function toMealIngredient(recipe: Recipe, food: Food | undefined): MealIngredient | null {
  if (!food) return null;

  return {
    recipeId: recipe.id,
    foodId: food.id,
    title: food.title,
    normalizedTitle: food.normalizedTitle ?? normalizeTitle(food.title),
    quantity: recipe.quantity ?? 1,
    unit: recipe.unit ?? "",
    sortOrder: recipe.sortOrder ?? 0,
  };
}

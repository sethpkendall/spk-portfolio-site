import { z } from "zod";

export class PlannerError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const normalize = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, " ");
export const mealTypes = ["breakfast", "lunch", "dinner"] as const;
export type MealType = (typeof mealTypes)[number];
export type PrivateMeal = {
  id: string;
  date: string;
  type: MealType;
  title: string;
  instructions: string;
  tags: string[];
};
export type PrivateFood = {
  id: string;
  title: string;
  normalizedTitle: string;
};
export type PrivateRecipe = {
  id: string;
  mealId: string;
  foodId: string;
  quantity: number;
  unit: string;
  sortOrder: number;
};
export type PrivateGrocery = {
  id: string;
  weekStart: string;
  sourceKey: string | null;
  title: string;
  quantity: number | null;
  unit: string;
  checked: boolean;
  removed: boolean;
  isFreeform: boolean;
};
export type Plan = {
  revision: number;
  meals: PrivateMeal[];
  foods: PrivateFood[];
  recipes: PrivateRecipe[];
  groceries: PrivateGrocery[];
};
export type Ingredient = { title: string; quantity: number; unit: string };
export const emptyPlan = (): Plan => ({
  revision: 0,
  meals: [],
  foods: [],
  recipes: [],
  groceries: [],
});

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function weekStart(date: string): string {
  return addDays(date, -new Date(`${date}T12:00:00Z`).getUTCDay());
}
export function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const d = new Date(`${s}T12:00:00Z`);
    return (
      Number.isFinite(d.getTime()) &&
      d.toISOString().slice(0, 10) === s &&
      s >= "1900-01-01" &&
      s <= "2200-12-31"
    );
  }, "Use a valid calendar date between 1900 and 2200.");
const week = date.refine(
  (s) => weekStart(s) === s,
  "Week must start on Sunday.",
);
const title = z.string().trim().min(1).max(200);
const quantity = z.number().finite().positive().max(1_000_000);
const ingredient = z
  .object({ title, quantity, unit: z.string().trim().min(1).max(40) })
  .strict();
export const commandSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("saveMeal"),
      id: z.string().uuid().optional(),
      date,
      type: z.enum(mealTypes),
      title,
      instructions: z.string().max(20_000),
      tags: z.array(z.string().trim().min(1).max(60)).max(20),
      ingredients: z.array(ingredient).max(100),
    })
    .strict(),
  z.object({ action: z.literal("deleteMeal"), id: z.string().uuid() }).strict(),
  z
    .object({
      action: z.literal("copyWeek"),
      source: week,
      destination: week,
      mode: z.enum(["merge", "replace"]),
      confirmReplace: z.boolean(),
    })
    .strict(),
  z
    .object({
      action: z.literal("setGrocery"),
      weekStart: week,
      id: z.string().uuid().optional(),
      sourceKey: z.string().min(1).max(1024).optional(),
      quantity: quantity.nullable(),
      checked: z.boolean(),
      removed: z.boolean(),
    })
    .strict(),
  z
    .object({ action: z.literal("addGrocery"), weekStart: week, title })
    .strict(),
  z
    .object({
      action: z.literal("clear"),
      confirmation: z.literal("DELETE PRIVATE PLAN"),
    })
    .strict(),
]);
export type Command = z.infer<typeof commandSchema>;
export const mutationSchema = z
  .object({
    expectedRevision: z
      .number()
      .int()
      .nonnegative()
      .max(Number.MAX_SAFE_INTEGER - 1),
    command: commandSchema,
  })
  .strict();

export function mealIngredients(plan: Plan, mealId: string): Ingredient[] {
  return plan.recipes
    .filter((r) => r.mealId === mealId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r) => ({
      title: plan.foods.find((f) => f.id === r.foodId)!.title,
      quantity: r.quantity,
      unit: r.unit,
    }));
}
export function groceryRows(plan: Plan, start: string): PrivateGrocery[] {
  const meals = new Set(
    plan.meals
      .filter((m) => m.date >= start && m.date < addDays(start, 7))
      .map((m) => m.id),
  );
  const rows = new Map<string, PrivateGrocery>();
  for (const r of plan.recipes.filter((r) => meals.has(r.mealId))) {
    const food = plan.foods.find((f) => f.id === r.foodId)!;
    const key = JSON.stringify([food.normalizedTitle, normalize(r.unit)]);
    const row = rows.get(key);
    if (row) row.quantity = (row.quantity || 0) + r.quantity;
    else
      rows.set(key, {
        id: "",
        weekStart: start,
        sourceKey: key,
        title: food.title,
        quantity: r.quantity,
        unit: r.unit,
        checked: false,
        removed: false,
        isFreeform: false,
      });
  }
  for (const override of plan.groceries.filter((g) => g.weekStart === start)) {
    if (override.isFreeform) rows.set(override.id, override);
    else if (override.sourceKey && rows.has(override.sourceKey)) {
      const row = rows.get(override.sourceKey)!;
      rows.set(override.sourceKey, {
        ...row,
        ...override,
        quantity: override.quantity ?? row.quantity,
      });
    }
  }
  return Array.from(rows.values())
    .filter((r) => !r.removed)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function applyCommand(
  current: Plan,
  command: Command,
  uuid: () => string = () => crypto.randomUUID(),
): { plan: Plan; message: string } {
  const p: Plan = structuredClone(current);
  let message = "Saved.";
  const removeMeals = (ids: Set<string>) => {
    p.meals = p.meals.filter((m) => !ids.has(m.id));
    p.recipes = p.recipes.filter((r) => !ids.has(r.mealId));
  };
  if (command.action === "saveMeal") {
    if (command.id && !p.meals.some((m) => m.id === command.id))
      throw new PlannerError(404, "Meal no longer exists. Refresh the plan.");
    if (
      p.meals.some(
        (m) =>
          m.date === command.date &&
          m.type === command.type &&
          m.id !== command.id,
      )
    )
      throw new PlannerError(
        409,
        "That meal slot is occupied. Refresh the plan.",
      );
    const id = command.id || uuid();
    const tags = command.tags
      .filter(
        (tag, i, all) =>
          all.findIndex((t) => normalize(t) === normalize(tag)) === i,
      )
      .map((t) => t.trim().replace(/\s+/g, " "));
    const meal: PrivateMeal = {
      id,
      date: command.date,
      type: command.type,
      title: command.title,
      instructions: command.instructions,
      tags,
    };
    p.meals = [...p.meals.filter((m) => m.id !== id), meal];
    const oldRecipes = p.recipes.filter((r) => r.mealId === id);
    p.recipes = p.recipes.filter((r) => r.mealId !== id);
    command.ingredients.forEach((i, sortOrder) => {
      let food = p.foods.find((f) => f.normalizedTitle === normalize(i.title));
      if (!food) {
        food = {
          id: uuid(),
          title: i.title,
          normalizedTitle: normalize(i.title),
        };
        p.foods.push(food);
      }
      const prior = oldRecipes.find(
        (r) => r.foodId === food!.id && r.sortOrder === sortOrder,
      );
      p.recipes.push({
        id: prior?.id || uuid(),
        mealId: id,
        foodId: food.id,
        quantity: i.quantity,
        unit: i.unit,
        sortOrder,
      });
    });
  } else if (command.action === "deleteMeal") {
    if (!p.meals.some((m) => m.id === command.id))
      throw new PlannerError(404, "Meal no longer exists.");
    removeMeals(new Set([command.id]));
    message = "Meal deleted.";
  } else if (command.action === "copyWeek") {
    if (command.source === command.destination)
      throw new PlannerError(400, "Choose a different destination week.");
    if (command.mode === "replace" && !command.confirmReplace)
      throw new PlannerError(400, "Confirm replacement of destination meals.");
    const source = p.meals.filter(
      (m) => m.date >= command.source && m.date < addDays(command.source, 7),
    );
    if (!source.length)
      throw new PlannerError(400, "The source week is empty.");
    if (command.mode === "replace")
      removeMeals(
        new Set(
          p.meals
            .filter(
              (m) =>
                m.date >= command.destination &&
                m.date < addDays(command.destination, 7),
            )
            .map((m) => m.id),
        ),
      );
    let copied = 0,
      skipped = 0;
    const offset = Math.round(
      (Date.parse(command.destination) - Date.parse(command.source)) / 86400000,
    );
    for (const meal of source) {
      const dest = addDays(meal.date, offset);
      if (!date.safeParse(dest).success)
        throw new PlannerError(
          400,
          "Copied meals must stay between 1900 and 2200.",
        );
      if (p.meals.some((m) => m.date === dest && m.type === meal.type)) {
        skipped++;
        continue;
      }
      const id = uuid();
      p.meals.push({ ...meal, id, date: dest, tags: [...meal.tags] });
      p.recipes.push(
        ...current.recipes
          .filter((r) => r.mealId === meal.id)
          .map((r) => ({ ...r, id: uuid(), mealId: id })),
      );
      copied++;
    }
    message = `Copied ${copied} meals; kept ${skipped} occupied slots.`;
  } else if (command.action === "addGrocery") {
    p.groceries.push({
      id: uuid(),
      weekStart: command.weekStart,
      sourceKey: null,
      title: command.title,
      quantity: null,
      unit: "",
      checked: false,
      removed: false,
      isFreeform: true,
    });
  } else if (command.action === "setGrocery") {
    const rows = groceryRows(p, command.weekStart);
    const row = command.id
      ? rows.find((r) => r.id === command.id)
      : rows.find((r) => r.sourceKey === command.sourceKey);
    if (!row || (!command.id && !command.sourceKey))
      throw new PlannerError(
        404,
        "Grocery item no longer exists. Refresh the plan.",
      );
    const existing = p.groceries.find(
      (g) =>
        g.weekStart === command.weekStart &&
        (row.isFreeform ? g.id === row.id : g.sourceKey === row.sourceKey),
    );
    p.groceries = p.groceries.filter((g) => g.id !== existing?.id);
    if (!(row.isFreeform && command.removed))
      p.groceries.push({
        ...row,
        id: existing?.id || uuid(),
        quantity: command.quantity,
        checked: command.checked,
        removed: command.removed,
      });
  } else if (command.action === "clear") {
    p.meals = [];
    p.foods = [];
    p.recipes = [];
    p.groceries = [];
    message =
      "Private plan deleted. Your demo and sign-in account are unchanged.";
  }
  const usedFoods = new Set(p.recipes.map((r) => r.foodId));
  p.foods = p.foods.filter((f) => usedFoods.has(f.id));
  if (
    p.meals.length > 5000 ||
    p.recipes.length > 50000 ||
    p.groceries.length > 20000
  )
    throw new PlannerError(
      422,
      "Personal planner capacity reached. Export and remove older data first.",
    );
  p.revision = current.revision + 1;
  return { plan: p, message };
}

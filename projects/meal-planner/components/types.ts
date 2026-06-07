import { Meal, MealIngredient } from "@/models/interfaces";

export type MealType = "breakfast" | "lunch" | "dinner";

export type MealSlot = Omit<Meal, "date"> & {
  date: Date | undefined | null;
  ingredients?: MealIngredient[];
};

export type WeekMealState = Record<string, Record<MealType, Meal | null>>;

export type MealOption = {
  label: string;
  value: Meal;
};

export type IngredientDraft = {
  id: string;
  foodId?: number;
  title: string;
  quantity: string;
  unit: string;
};

export type GroceryRow = {
  id?: number;
  sourceKey?: string;
  foodId?: number;
  title: string;
  normalizedTitle: string;
  quantity?: number;
  unit?: string;
  checked: boolean;
  removed: boolean;
  isFreeform: boolean;
};

export type WeekCopyMode = "merge" | "replace";

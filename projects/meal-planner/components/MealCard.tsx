"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Meal } from "@/models/interfaces";
import { deleteMealWithRecipes } from "./mealPlannerData";

type MealCardProps = {
  dayString: string;
  meal: Meal | null;
  mealType: string;
  onAdd: (dayString: string, mealType: string) => void;
  onEdit: (meal: Meal) => void;
};

export default function MealCard({ dayString, meal, mealType, onAdd, onEdit }: MealCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteClick = async () => {
    if (!meal?.id) return;
    setIsDeleting(true);
    await deleteMealWithRecipes(meal.id);
    setIsDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <Card className="relative mb-4 min-h-28 overflow-hidden border-slate-200 bg-white p-3 shadow-sm md:min-h-[120px]">
      {!meal && (
        <button
          type="button"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
          onClick={() => onAdd(dayString, mealType)}
        >
          <Plus className="h-6 w-6" />
          <span className="text-xs font-medium capitalize">Add {mealType}</span>
        </button>
      )}

      {meal && (
        <div className="flex h-full flex-col justify-between gap-3">
          <div className="space-y-2">
            <Badge className="w-full justify-center whitespace-normal py-1 text-center text-sm">
              {meal.title}
            </Badge>

            {meal.ingredients && meal.ingredients.length > 0 && (
              <ul className="space-y-1 text-xs text-slate-600">
                {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                  <li key={`${meal.id}-${ingredient.foodId ?? ingredient.title}-${index}`} className="truncate">
                    {ingredient.quantity} {ingredient.unit} {ingredient.title}
                  </li>
                ))}
                {meal.ingredients.length > 3 && (
                  <li className="font-medium text-slate-500">+{meal.ingredients.length - 3} more</li>
                )}
              </ul>
            )}
          </div>

          <div
            className={`flex min-h-8 justify-center gap-3 transition-opacity duration-150 ${
              confirmDelete ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-hidden={confirmDelete}
          >
            <button
              type="button"
              className="rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              onClick={() => onEdit(meal)}
              aria-label={`Edit ${meal.title}`}
              tabIndex={confirmDelete ? -1 : 0}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-1 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
              onClick={() => setConfirmDelete(true)}
              aria-label={`Delete ${meal.title}`}
              tabIndex={confirmDelete ? -1 : 0}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div
            className={`absolute inset-1 z-20 flex min-w-0 flex-col justify-center gap-1 rounded-md border border-red-200 bg-red-50 p-1 transition-all duration-200 ease-out ${
              confirmDelete
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-[0.98] opacity-0"
            }`}
            aria-hidden={!confirmDelete}
          >
              <span className="text-center text-[11px] font-medium leading-tight text-red-800">Delete?</span>
              <div className="grid min-w-0 grid-cols-2 gap-1">
                <button
                  type="button"
                  className="grid h-7 min-w-0 place-items-center rounded-md text-slate-600 hover:bg-white"
                  onClick={() => setConfirmDelete(false)}
                  aria-label="Cancel deletion"
                  tabIndex={confirmDelete ? 0 : -1}
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="grid h-7 min-w-0 place-items-center rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                  onClick={deleteClick}
                  disabled={isDeleting}
                  aria-label={isDeleting ? "Deleting meal" : "Confirm deletion"}
                  tabIndex={confirmDelete ? 0 : -1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
          </div>
        </div>
      )}
    </Card>
  );
}

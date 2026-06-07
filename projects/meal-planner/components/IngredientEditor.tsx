"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IngredientDraft } from "./types";
import { createBlankIngredientDraft } from "./mealPlannerData";

type IngredientEditorProps = {
  ingredients: IngredientDraft[];
  setIngredients: (ingredients: IngredientDraft[]) => void;
};

export default function IngredientEditor({ ingredients, setIngredients }: IngredientEditorProps) {
  const updateIngredient = (id: string, field: keyof IngredientDraft, value: string) => {
    setIngredients(
      ingredients.map(ingredient =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, createBlankIngredientDraft()]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-semibold text-slate-800">Ingredients</Label>
        <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="h-8 gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {ingredients.length === 0 && (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            Add ingredients to make grocery planning work later.
          </div>
        )}

        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="grid grid-cols-[1fr_5rem_5rem_2.5rem] items-end gap-2 rounded-md border border-slate-200 bg-white p-2"
          >
            <div className="space-y-1">
              <Label htmlFor={`ingredient-title-${ingredient.id}`} className="text-xs text-slate-500">
                Food
              </Label>
              <Input
                id={`ingredient-title-${ingredient.id}`}
                value={ingredient.title}
                onChange={event => updateIngredient(ingredient.id, "title", event.target.value)}
                placeholder={index === 0 ? "Tortillas" : "Ingredient"}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`ingredient-quantity-${ingredient.id}`} className="text-xs text-slate-500">
                Qty
              </Label>
              <Input
                id={`ingredient-quantity-${ingredient.id}`}
                value={ingredient.quantity}
                onChange={event => updateIngredient(ingredient.id, "quantity", event.target.value)}
                inputMode="decimal"
                placeholder="1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`ingredient-unit-${ingredient.id}`} className="text-xs text-slate-500">
                Unit
              </Label>
              <Input
                id={`ingredient-unit-${ingredient.id}`}
                value={ingredient.unit}
                onChange={event => updateIngredient(ingredient.id, "unit", event.target.value)}
                placeholder="cup"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-slate-500 hover:text-red-600"
              onClick={() => removeIngredient(ingredient.id)}
              aria-label="Remove ingredient"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

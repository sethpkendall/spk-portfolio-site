"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { MealContext } from "@/contexts/MealContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Meal } from "@/models/interfaces";
import { localeFormat } from "light-date";
import { IngredientDraft, MealOption } from "./types";
import IngredientEditor from "./IngredientEditor";
import { MealCombobox } from "./MealCombobox";
import ResponsiveMealDialog from "./ResponsiveMealDialog";
import {
  createBlankIngredientDraft,
  draftToIngredient,
  findLatestMealByTitle,
  ingredientToDraft,
  updateMealWithIngredients,
} from "./mealPlannerData";

type EditMealModalProps = {
  showEditModal: boolean;
  setShowEditModal: (showEditModal: boolean) => void;
  uniqueMealsDatabase: MealOption[];
};

export default function EditMealModal({
  showEditModal,
  setShowEditModal,
  uniqueMealsDatabase,
}: EditMealModalProps) {
  const { mealState } = useContext(MealContext);
  const [commandInputValue, setCommandInputValue] = useState("");
  const [mealTitle, setMealTitle] = useState(mealState.title || "");
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([createBlankIngredientDraft()]);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMealTitle(mealState.title || "");
    setCommandInputValue(mealState.title || "");
    setIngredients(
      mealState.ingredients && mealState.ingredients.length > 0
        ? mealState.ingredients.map(ingredientToDraft)
        : [createBlankIngredientDraft()]
    );
    setSelectedMeal(
      mealState.id ? uniqueMealsDatabase.find((meal) => meal.value.id === mealState.id) || null : null
    );
  }, [mealState, uniqueMealsDatabase]);

  useEffect(() => {
    let cancelled = false;

    async function loadSelectedMeal() {
      if (!selectedMeal || selectedMeal.value.id === mealState.id) return;

      setMealTitle(selectedMeal.label);
      const mealWithIngredients = await findLatestMealByTitle(selectedMeal.label);
      if (cancelled || !mealWithIngredients?.ingredients) return;

      setIngredients(
        mealWithIngredients.ingredients.length > 0
          ? mealWithIngredients.ingredients.map(ingredientToDraft)
          : [createBlankIngredientDraft()]
      );
    }

    loadSelectedMeal();

    return () => {
      cancelled = true;
    };
  }, [mealState.id, selectedMeal]);

  const dialogTitle = useMemo(() => {
    const mealType = mealState.type ? mealState.type.charAt(0).toUpperCase() + mealState.type.slice(1) : "Meal";
    return `Edit Meal for ${localeFormat(new Date(mealState.date || new Date()), "{EEEE}")} ${mealType}`;
  }, [mealState.date, mealState.type]);

  const updateMeal = async () => {
    const parsedIngredients = ingredients
      .map((ingredient, index) => draftToIngredient(ingredient, index))
      .filter((ingredient): ingredient is NonNullable<typeof ingredient> => Boolean(ingredient));

    setIsSaving(true);
    await updateMealWithIngredients(
      {
        id: mealState.id,
        title: mealTitle.trim(),
        date: mealState.date || undefined,
        type: mealState.type,
      } as Meal,
      parsedIngredients
    );
    setIsSaving(false);
    setShowEditModal(false);
  };

  return (
    <ResponsiveMealDialog
      open={showEditModal}
      onOpenChange={setShowEditModal}
      title={dialogTitle}
      description="Update the meal name and its ingredients."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Meal</Label>
          <MealCombobox
            addNewText="Use Typed Meal"
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
            commandInputValue={commandInputValue}
            setCommandInputValue={(value) => {
              setCommandInputValue(value);
              setMealTitle(value);
            }}
            submitMeal={(typedValue) => {
              setSelectedMeal(null);
              setMealTitle(typedValue);
              setCommandInputValue(typedValue);
            }}
            meals={uniqueMealsDatabase}
          />
          <Input
            value={mealTitle}
            onChange={(event) => {
              setSelectedMeal(null);
              setMealTitle(event.target.value);
              setCommandInputValue(event.target.value);
            }}
            placeholder="Meal name"
          />
        </div>

        <IngredientEditor ingredients={ingredients} setIngredients={setIngredients} />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={updateMeal} disabled={isSaving || !mealTitle.trim()}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </ResponsiveMealDialog>
  );
}

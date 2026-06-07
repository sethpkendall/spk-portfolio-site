"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { MealContext } from "@/contexts/MealContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getWeekdayString } from "@/lib/utils";
import { Meal } from "@/models/interfaces";
import { IngredientDraft, MealOption } from "./types";
import IngredientEditor from "./IngredientEditor";
import { MealCombobox } from "./MealCombobox";
import ResponsiveMealDialog from "./ResponsiveMealDialog";
import {
  createBlankIngredientDraft,
  draftToIngredient,
  findLatestMealByTitle,
  ingredientToDraft,
  saveMealWithIngredients,
} from "./mealPlannerData";

type AddMealModalProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  uniqueMealsDatabase: MealOption[];
};

export default function AddMealModal({ showModal, setShowModal, uniqueMealsDatabase }: AddMealModalProps) {
  const { mealState } = useContext(MealContext);
  const [selectedMeal, setSelectedMeal] = useState<MealOption | null>(null);
  const [mealTitle, setMealTitle] = useState("");
  const [commandInputValue, setCommandInputValue] = useState("");
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([createBlankIngredientDraft()]);
  const [feedbackMsgState, setFeedbackMsgState] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const dialogTitle = useMemo(() => {
    const mealType = mealState.type ? mealState.type.charAt(0).toUpperCase() + mealState.type.slice(1) : "Meal";
    return `Add Meal for ${getWeekdayString(mealState.date || undefined)} ${mealType}`;
  }, [mealState.date, mealState.type]);

  useEffect(() => {
    if (!showModal) return;

    setSelectedMeal(null);
    setMealTitle("");
    setCommandInputValue("");
    setIngredients([createBlankIngredientDraft()]);
    setFeedbackMsgState(null);
  }, [mealState.date, mealState.type, showModal]);

  useEffect(() => {
    let cancelled = false;

    async function loadSelectedMeal() {
      if (!selectedMeal) return;

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
  }, [selectedMeal]);

  const submitMeal = async () => {
    const title = (selectedMeal?.label || mealTitle || commandInputValue).trim();
    if (!title) {
      showFeedback("Please select a meal or type a new meal name.");
      return;
    }

    const parsedIngredients = ingredients
      .map((ingredient, index) => draftToIngredient(ingredient, index))
      .filter((ingredient): ingredient is NonNullable<typeof ingredient> => Boolean(ingredient));

    setIsSaving(true);
    await saveMealWithIngredients(
      {
        title,
        date: mealState.date || undefined,
        type: mealState.type,
      },
      parsedIngredients
    );
    setIsSaving(false);
    setShowModal(false);
  };

  const submitNewMeal = async (typedValue: string) => {
    setMealTitle(typedValue);
    setSelectedMeal(null);
    setCommandInputValue(typedValue);
  };

  const showFeedback = (message: string) => {
    setFeedbackMsgState(message);
    setTimeout(() => setFeedbackMsgState(null), 3000);
  };

  return (
    <ResponsiveMealDialog
      open={showModal}
      onOpenChange={setShowModal}
      title={dialogTitle}
      description="Choose a saved meal or create a new one, then add ingredients for grocery planning."
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
              if (!selectedMeal) setMealTitle(value);
            }}
            submitMeal={submitNewMeal}
            meals={uniqueMealsDatabase}
          />
          <Input
            value={mealTitle || commandInputValue}
            onChange={(event) => {
              setSelectedMeal(null);
              setMealTitle(event.target.value);
              setCommandInputValue(event.target.value);
            }}
            placeholder="Meal name"
          />
        </div>

        <IngredientEditor ingredients={ingredients} setIngredients={setIngredients} />

        {feedbackMsgState && <p className="text-sm font-semibold text-red-600">{feedbackMsgState}</p>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={submitMeal} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Meal"}
          </Button>
        </div>
      </div>
    </ResponsiveMealDialog>
  );
}

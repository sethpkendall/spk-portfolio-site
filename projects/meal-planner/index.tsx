"use client";

import { useEffect, useState } from "react";
import { MealContext } from "@/contexts/MealContext";
import { useLiveQuery } from "dexie-react-hooks";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mpDB } from "@/models/db";
import { getWeekDateStrings } from "@/lib/utils";
import { Meal } from "@/models/interfaces";
import MealPlannerTool from "./components/MealPlannerTool";
import AddMealModal from "./components/AddMealModal";
import EditMealModal from "./components/EditMealModal";
import GroceryListDialog from "./components/GroceryListDialog";
import {
  createEmptyWeekState,
  dateKey,
  getWeekBounds,
  hydrateMeal,
  hydrateMeals,
} from "./components/mealPlannerData";
import { MealOption, MealSlot, WeekMealState } from "./components/types";

function getCurrentWeekStart(): Date {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}

export default function MealPlanner() {
  const [shownWeek, setShownWeek] = useState(getCurrentWeekStart());
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [weekMealState, setWeekMealState] = useState<WeekMealState>(
    createEmptyWeekState(getWeekDateStrings(getCurrentWeekStart()))
  );
  const [uniqueMealsDatabase, setUniqueMealsDatabase] = useState<MealOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mealState, setMealState] = useState<MealSlot>({
    id: undefined,
    title: "",
    date: null,
    type: "",
    ingredients: [],
  });

  useLiveQuery(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const allMeals = await mpDB.meals.toArray();
      let uniqueMealsDB: MealOption[] = [];

      for (const meal of allMeals) {
        if (!uniqueMealsDB.some((dbMeal) => dbMeal.label === meal.title)) {
          uniqueMealsDB.push({ label: meal.title, value: meal });
        }
      }

      uniqueMealsDB = uniqueMealsDB.sort((a, b) => a.label.localeCompare(b.label));
      setUniqueMealsDatabase(uniqueMealsDB);

      const { startDate, endDate } = getWeekBounds(shownWeek);
      const currentWeekMealState = createEmptyWeekState(getWeekDateStrings(startDate));
      const meals = await mpDB.meals.where("date").between(startDate, endDate, true, true).toArray();
      const hydratedMeals = await hydrateMeals(meals);

      for (const meal of hydratedMeals) {
        const mealDate = meal.date ? new Date(meal.date) : null;
        const mealType = meal.type.toLowerCase();

        if (!mealDate || !(mealType === "breakfast" || mealType === "lunch" || mealType === "dinner")) {
          continue;
        }

        const mealDateString = dateKey(mealDate);
        if (currentWeekMealState[mealDateString]) {
          currentWeekMealState[mealDateString][mealType] = meal;
        }
      }

      setWeekMealState(currentWeekMealState);
    } catch (error) {
      console.error("Unable to load meal planner data", error);
      setLoadError(error instanceof Error ? error.message : "Unable to load meal planner data.");
    } finally {
      setIsLoading(false);
    }
  }, [shownWeek]);

  useEffect(() => {
    setIsLoading(true);
    setWeekMealState(createEmptyWeekState(getWeekDateStrings(shownWeek)));
  }, [shownWeek]);

  const setActiveMealSlot = (dayString: string, mealType: string) => {
    setMealState({
      id: undefined,
      title: "",
      date: new Date(dayString),
      type: mealType,
      ingredients: [],
    });
  };

  const setActiveMealForEdit = async (meal: Meal) => {
    const hydratedMeal = meal.id ? await hydrateMeal(meal) : meal;
    setMealState({
      ...hydratedMeal,
      id: hydratedMeal.id,
      date: hydratedMeal.date || null,
      type: hydratedMeal.type,
      ingredients: hydratedMeal.ingredients || [],
    });
  };

  return (
    <div className="w-full min-h-[500px]">
      {loadError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Meal planner data could not load: {loadError}
        </div>
      )}
      <MealContext.Provider value={{ mealState, setMealState }}>
        <MealPlannerTool
          meals={weekMealState}
          isDesktop={isDesktop}
          isLoading={isLoading}
          shownWeek={shownWeek}
          setShownWeek={setShownWeek}
          setShowModal={setShowModal}
          setShowEditModal={setShowEditModal}
          setActiveMealSlot={setActiveMealSlot}
          setActiveMealForEdit={setActiveMealForEdit}
          onOpenGroceryList={() => setShowGroceryList(true)}
        />
        <AddMealModal
          uniqueMealsDatabase={uniqueMealsDatabase}
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <EditMealModal
          uniqueMealsDatabase={uniqueMealsDatabase}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
        />
        <GroceryListDialog
          open={showGroceryList}
          onOpenChange={setShowGroceryList}
          shownWeek={shownWeek}
        />
      </MealContext.Provider>
    </div>
  );
}

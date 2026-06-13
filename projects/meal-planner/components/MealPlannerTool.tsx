import { getWeekDateStrings } from "@/lib/utils";
import { Meal } from "@/models/interfaces";
import MealGrid from "./MealGrid";
import MealCarousel from "./MealCarousel";
import WeekPager from "./WeekPager";
import { CalendarPlus, Copy, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEAL_TYPES } from "./mealPlannerData";
import { WeekMealState } from "./types";

interface MealPlannerToolProps {
  isDesktop: boolean;
  isLoading: boolean;
  meals: WeekMealState;
  setShowModal: (value: boolean) => void;
  setShowEditModal: (value: boolean) => void;
  setActiveMealSlot: (dayString: string, mealType: string) => void;
  setActiveMealForEdit: (meal: Meal) => void;
  onOpenGroceryList: () => void;
  onOpenWeekCopy: () => void;
  shownWeek: Date;
  setShownWeek: (value: Date) => void;
}

export default function MealPlannerTool({
  isDesktop,
  isLoading,
  meals,
  setActiveMealForEdit,
  onOpenGroceryList,
  onOpenWeekCopy,
  setActiveMealSlot,
  setShowEditModal,
  setShowModal,
  setShownWeek,
  shownWeek,
}: MealPlannerToolProps): JSX.Element {
  const weekDateStrings = getWeekDateStrings(shownWeek);
  const hasMeals = Object.values(meals).some(day =>
    MEAL_TYPES.some(mealType => Boolean(day?.[mealType]))
  );

  const addFirstMeal = () => {
    setActiveMealSlot(weekDateStrings[0], "dinner");
    setShowModal(true);
  };

  const addMeal = (dayString: string, mealType: string) => {
    setActiveMealSlot(dayString, mealType);
    setShowModal(true);
  };

  const editMeal = (meal: Meal) => {
    setActiveMealForEdit(meal);
    setShowEditModal(true);
  };

  return (
    <div className="mealPlannerToolParent min-h-[34rem]">
      <WeekPager shownWeek={shownWeek} setShownWeek={setShownWeek} />
      <div className="mb-5 flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onOpenWeekCopy} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Week
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onOpenGroceryList} className="gap-2">
          <ShoppingBasket className="h-4 w-4" />
          Grocery List
        </Button>
      </div>
      {isLoading ? (
        <div className="grid min-h-72 place-items-center" aria-live="polite">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            Loading meals...
          </div>
        </div>
      ) : (
        <>
          {!hasMeals && (
            <div className="mb-5 flex flex-col items-center justify-between gap-3 border-y border-slate-200 bg-slate-50 px-4 py-4 text-center sm:flex-row sm:text-left">
              <div>
                <p className="font-semibold text-slate-900">Nothing planned for this week</p>
                <p className="text-sm text-slate-500">Start with dinner on Sunday, or choose any empty slot below.</p>
              </div>
              <Button type="button" onClick={addFirstMeal} className="gap-2">
                <CalendarPlus className="h-4 w-4" />
                Add first meal
              </Button>
            </div>
          )}

          {isDesktop ? (
            <MealGrid meals={meals} onAdd={addMeal} onEdit={editMeal} weekDateStrings={weekDateStrings} />
          ) : (
            <MealCarousel meals={meals} onAdd={addMeal} onEdit={editMeal} weekDateStrings={weekDateStrings} />
          )}
        </>
      )}
    </div>
  );
}

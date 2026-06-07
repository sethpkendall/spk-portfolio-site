import { Meal } from "@/models/interfaces";
import { localeFormat } from "light-date";
import MealCard from "./MealCard";
import { MEAL_TYPES } from "./mealPlannerData";
import { WeekMealState } from "./types";

type MealGridProps = {
  meals: WeekMealState;
  onAdd: (dayString: string, mealType: string) => void;
  onEdit: (meal: Meal) => void;
  weekDateStrings: string[];
};

export default function MealGrid({
  meals,
  onAdd,
  onEdit,
  weekDateStrings,
}: MealGridProps) {
  return (
    <div className="flex min-w-0 flex-row">
      <div className="dayParent mx-1 w-24 shrink-0">
        <div className="mb-1 h-12 md:h-16" />
        {MEAL_TYPES.map((mealType) => (
          <div key={mealType} className="mb-4 flex min-h-28 items-center font-bold capitalize md:min-h-[120px]">
            {mealType}
          </div>
        ))}
      </div>

      {weekDateStrings.map((dayString) => {
        const currDayMealData = meals[dayString];
        if (!currDayMealData) return null;

        return (
          <div className="dayParent mx-1 min-w-0 flex-1" key={dayString}>
            <div className="mb-1 flex h-12 flex-col items-center justify-center text-sm font-bold md:h-16">
              <p className="weekdayText">{localeFormat(new Date(dayString), "{EEE}")}</p>
              <p className="weekdayText">{`${localeFormat(new Date(dayString), "{MMM}")} ${dayString.split("-")[1]}`}</p>
            </div>
            {MEAL_TYPES.map((mealType) => (
              <MealCard
                key={`${dayString}-${mealType}`}
                dayString={dayString}
                meal={currDayMealData[mealType]}
                mealType={mealType}
                onAdd={onAdd}
                onEdit={onEdit}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

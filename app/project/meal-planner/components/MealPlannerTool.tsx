import { getWeekDateStrings } from "@/lib/utils";
import MealGrid from "./MealGrid";
import MealCarousel from "./MealCarousel";

  interface Meal {
    title: string;
    date: Date;
    type: string;
    foods: {
        title: string;
    }[];
}

  interface MealPlannerToolProps {
    dayCount: number;
    mealPlannerHeight: number;
    meals: {
        [key: string]: {
            breakfast: Meal;
            lunch: Meal;
            dinner: Meal;
        }
    };
    setShowModal: (value:boolean) => void;
    shownWeek: Date;
  }

export default function MealPlannerTool(
    {
    dayCount,
    meals,
    mealPlannerHeight,
    setShowModal,
    shownWeek}:MealPlannerToolProps){
    const weekDateStrings = getWeekDateStrings(shownWeek);
    let componentToRender;
    switch (dayCount) {
        case 0:
            componentToRender = <div>loading...</div>;
        case 1:
            componentToRender = <MealCarousel setShowModal={setShowModal} meals={meals} weekDateStrings={weekDateStrings}/>
        case 7:
            componentToRender = <MealGrid setShowModal={setShowModal} meals={meals} weekDateStrings={weekDateStrings}/>;
    }
    
    return(
        <div className={`mealPlannerToolParent h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]`}>
            {componentToRender}
        </div>
    );
}
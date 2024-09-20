import { getWeekDateStrings } from "@/lib/utils";
import MealGrid from "./MealGrid";
import MealCarousel from "./MealCarousel";
import WeekPager from "./WeekPager";

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
    setShowEditModal: (value:boolean) => void;
    shownWeek: Date;
    setShownWeek: (value:Date) => void;
  }

export default function MealPlannerTool(
    {
    dayCount,
    meals,
    mealPlannerHeight,
    setShowEditModal,
    setShowModal,
    setShownWeek,
    shownWeek}:MealPlannerToolProps): JSX.Element{
    const weekDateStrings = getWeekDateStrings(shownWeek);
    let componentToRender;
    switch (dayCount) {
        case 0:
            componentToRender = <div>loading...</div>;
        case 1:
            // componentToRender = <MealCarousel setShowModal={setShowModal} meals={meals} weekDateStrings={weekDateStrings}/>
        case 7:
            componentToRender = <MealGrid setShowModal={setShowModal} setShowEditModal={setShowEditModal} meals={meals} weekDateStrings={weekDateStrings}/>;
    }
    
    return(
        <div className={`mealPlannerToolParent h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]`}>
            <WeekPager
                shownWeek={shownWeek}
                setShownWeek={setShownWeek}
            />
            {componentToRender}
        </div>
    );
}
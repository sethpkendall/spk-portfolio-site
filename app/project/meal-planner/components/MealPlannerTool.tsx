import { getWeekDateStrings } from "@/lib/utils";
import MealGrid from "./MealGrid";
import MealCarousel from "./MealCarousel";
import WeekPager from "./WeekPager";
import { useEffect } from "react";

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
    setShowEditModal,
    setShowModal,
    setShownWeek,
    shownWeek}:MealPlannerToolProps): JSX.Element{
    const weekDateStrings = getWeekDateStrings(shownWeek);
    useEffect(() => {
        console.log(shownWeek);
    }, [shownWeek]);
    let componentToRender;
    switch (dayCount) {
        case 0:
            componentToRender = <div>loading...</div>;
            break;
        case 1:
            componentToRender = <MealCarousel setShowModal={setShowModal} setShowEditModal={setShowEditModal} meals={meals} weekDateStrings={weekDateStrings}/>
            break;
        case 7:
            componentToRender = <MealGrid setShowModal={setShowModal} setShowEditModal={setShowEditModal} meals={meals} weekDateStrings={weekDateStrings}/>;
            break;
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
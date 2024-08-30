import MealGridPanel from './MealGridPanel';
import { Meal } from '@/models/interfaces';

type MealGridProps = {
    meals: {
        [key: string]: {
            breakfast: Meal;
            lunch: Meal;
            dinner: Meal;
        }
    };
    weekDateStrings: string[];
};

export default function MealGrid({meals,weekDateStrings}:MealGridProps){
    // Implement your component logic here
    return (
        <div className="flex flex-row h-full">
        {weekDateStrings.map((dayString) => {
            const currDayMealData = meals[dayString];
            if (!currDayMealData) {
                return (
                    <div>
                        <p>{dayString}</p>
                    </div>
                )
            }
            return (
                <div className="dayParent flex-grow items-stretch">
                    <p className="h-[10%] flex justify-center items-center">{dayString}</p>
                    {Object.keys(currDayMealData).map((mealType) => {
                        const meal = currDayMealData[mealType as keyof typeof currDayMealData];
                        return (
                            <MealGridPanel meal={meal}/>
                        )
                    })}
                </div> 
            )
        })}
        </div>
    );
};

import MealGridPanel from './MealGridPanel';
import { Meal } from '@/models/interfaces';
import { getDayAndDate } from '@/lib/utils';

type MealGridProps = {
    meals: {
        [key: string]: {
            breakfast: Meal;
            lunch: Meal;
            dinner: Meal;
        }
    };
    setShowModal: (value:boolean) => void;
    weekDateStrings: string[];
};

export default function MealGrid({meals,setShowModal, weekDateStrings}:MealGridProps){
    return (
        <div className="flex flex-row h-full">
            <div className="dayParent flex-1 mx-1">
                <div className='spaceDiv h-[5%]'></div>
                <div className='h-[30%] flex justify-start items-start font-bold'>Breakfast</div>
                <div className='h-[30%] flex justify-start items-start font-bold'>Lunch</div>
                <div className='h-[30%] flex justify-start items-start font-bold'>Dinner</div>
            </div>
        {meals && weekDateStrings.map((dayString,dayIndex) => {
            const currDayMealData = meals[dayString];
            if(!currDayMealData) {
                return false;
            }
            return (
                <div className="dayParent flex-1 mx-1">
                    <p className="h-[5%] flex justify-center items-center">{getDayAndDate(dayString)}</p>
                    {Object.keys(currDayMealData).map((mealType, index) => {
                        const meal = currDayMealData[mealType as keyof typeof currDayMealData];
                        return (
                            <>
                                <MealGridPanel dayString={dayString} meal={meal} mealType={mealType} key={index} setShowModal={setShowModal}/>
                            </>
                            
                            
                        )
                    })}
                </div> 
            )
        })}
        </div>
    );
};

import MealGridPanel from './MealGridPanel';
import { Meal } from '@/models/interfaces';
import {localeFormat} from 'light-date';

type MealGridProps = {
    meals: {
        [key: string]: {
            breakfast: Meal;
            lunch: Meal;
            dinner: Meal;
        }
    };
    setShowModal: (value:boolean) => void;
    setShowEditModal: (value:boolean) => void;
    weekDateStrings: string[];
};

export default function MealGrid({meals,setShowEditModal,setShowModal,weekDateStrings}:MealGridProps){
    return (
        <div className="flex flex-row h-full">
            <div className="dayParent mx-1">
                <div className='spaceDiv h-[5%]'></div>
                <div className='h-[26%] mb-4 flex justify-start items-start font-bold'>Breakfast</div>
                <div className='h-[26%] mb-4 flex justify-start items-start font-bold'>Lunch</div>
                <div className='h-[26%] mb-4 flex justify-start items-start font-bold'>Dinner</div>
            </div>
        {meals && weekDateStrings.map((dayString,dayIndex) => {
            const currDayMealData = meals[dayString];
            if(!currDayMealData) {
                return false;
            }
            return (
                <div className="dayParent flex-1 mx-1">
                    <div className="h-[5%] mb-1 flex flex-col justify-center items-center text-sm font-bold">
                        <p className='weekdayText'>{localeFormat(new Date(dayString),"{EEE}")}</p>
                        <p className='weekdayText'>{`${localeFormat(new Date(dayString),"{MMM}")} ${dayString.split('-')[1]}`}</p>
                    </div>
                    {Object.keys(currDayMealData).map((mealType, index) => {
                        const meal = currDayMealData[mealType as keyof typeof currDayMealData];
                        return (
                            <>
                                <MealGridPanel dayString={dayString} meal={meal} mealType={mealType} key={index} setShowEditModal={setShowEditModal} setShowModal={setShowModal}/>
                            </>
                            
                            
                        )
                    })}
                </div> 
            )
        })}
        </div>
    );
};

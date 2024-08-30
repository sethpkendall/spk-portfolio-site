import MealGridPanel from './MealGridPanel';
import { Meal } from '@/models/interfaces';

type MealGridPanelProps = {
    meal:Meal;
};

export default function MealGrid({meal}:MealGridPanelProps){
    // Implement your component logic here
    return (
        <div className='h-[30%] border border-red-500 hover:cursor-pointer relative'>
            <div class="opacity-0 hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl font-semibold">+</div>
            {meal &&
                <>
                    <h1>{meal.title}</h1>
                    <p>{meal.date.getTime()}</p>
                    <p>{meal.type}</p>
                    <div>
                        {meal.foods && meal.foods.map((food) => {
                            return(
                                <div>
                                    <p>{food.title}</p>
                                </div>
                            )
                        })}
                    </div>
                </>
            }
        </div>
    );
};

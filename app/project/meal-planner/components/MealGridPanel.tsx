import {useContext} from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Meal } from '@/models/interfaces';
import { NewMealContext } from '@/contexts/NewMealContext';

type MealGridPanelProps = {
    meal:Meal;
    setShowModal: (value:boolean) => void;
    dayString: string;
    mealType: string;
};

export default function MealGridPanel({dayString, meal, mealType, setShowModal}:MealGridPanelProps){
    const {
        newMealState,
        setNewMealState
      } = useContext(NewMealContext);

    // Implement your component logic here
    const cellClick = (dayString:string, meal:Meal) => {
        setNewMealState({
            title: '',
            date: new Date(dayString),
            type: mealType
        });
        setShowModal(true);
    }
    
    return (
        <Card className='h-[30%] mb-4 p-4 hover:cursor-pointer relative'>
            <div class="opacity-0 hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl font-semibold" onClick={(e)=>cellClick(dayString, meal)}>+</div>
            {meal &&
                <>
                    <Badge>{meal.title}</Badge>
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
        </Card>
    );
};

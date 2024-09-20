import {useContext} from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons'
import { Meal } from '@/models/interfaces';
import { MealContext } from '@/contexts/MealContext';

type MealGridPanelProps = {
    meal:Meal;
    setShowModal: (value:boolean) => void;
    setShowEditModal: (value:boolean) => void;
    dayString: string;
    mealType: string;
};

export default function MealGridPanel({dayString, meal, mealType, setShowEditModal,setShowModal}:MealGridPanelProps){
    const {
        mealState,
        setMealState
      } = useContext(MealContext);

    // Implement your component logic here
    const addClick = (dayString:string, meal:Meal) => {
        setMealState({
            title: '',
            date: new Date(dayString),
            type: mealType,
            id: undefined
        });
        setShowModal(true);
    }

    const editClick = (meal:Meal) => {
        setMealState({...meal, id: meal.id || undefined, date: meal.date || null});
        setShowEditModal(true);
    }
    
    return (
        <Card className='h-[28%] mb-4 p-4 relative'>
            { !meal &&
                <div className="buttonHoverlay opacity-0 hover:cursor-pointer hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl font-semibold" onClick={(e)=>addClick(dayString, meal)}>
                    <PlusIcon />
                </div>
            }
            {meal &&
                <>
                    <div className="buttonHoverlay opacity-0 hover:cursor-pointer hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl font-semibold" onClick={(e)=>editClick(meal)}>
                        <Pencil1Icon />
                    </div>
                    <Badge variant="destructive">{meal.title}</Badge>
                </>
            }
        </Card>
    );
};

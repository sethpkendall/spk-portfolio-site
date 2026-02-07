import {useContext} from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusIcon } from '@radix-ui/react-icons'
import { Meal } from '@/models/interfaces';
import { MealContext } from '@/contexts/MealContext';
import { Pencil, Trash2Icon } from 'lucide-react';
import { mpDB } from '@/models/db';

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

    const deleteClick = async (meal:Meal) => {
        await mpDB.meals.delete(meal.id || 0);
    }
    
    return (
        <Card className='h-20 md:h-[120px] mb-4 p-4 relative'>
            { !meal &&
                <div className="buttonHoverlay opacity-0 hover:cursor-pointer hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-6xl font-semibold" onClick={(e)=>addClick(dayString, meal)}>
                    <PlusIcon />
                </div>
            }
            {meal &&
                <>
                    <Badge className='group w-full h-full flex flex-col justify-between items-center text-center py-3'>
                        <p className='text-sm font-medium'>{meal.title}</p>
                        <div className='buttonParent flex justify-center w-full mt-2 gap-4'>
                            <Pencil size={20} strokeWidth={1} className="cursor-pointer hover:scale-110 transition-transform" onClick={(e)=>editClick(meal)} />
                            <Trash2Icon size={20} strokeWidth={1} className="cursor-pointer hover:scale-110 transition-transform" onClick={()=>deleteClick(meal)}/>
                        </div>
                    </Badge>
                </>
            }
        </Card>
    );
};

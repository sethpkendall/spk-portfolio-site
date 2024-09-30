import {useContext} from 'react';
// Component imports
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon } from '@radix-ui/react-icons'
import { Apple, Pencil, Trash2Icon } from 'lucide-react';
// Logic imports
import { MealContext } from '@/contexts/MealContext';
import { Meal } from '@/models/interfaces';
import {localeFormat} from 'light-date';
import { db } from '@/models/db';

type MealCarouselProps = {
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

const MealCarousel: React.FC<MealCarouselProps> = ({meals,setShowEditModal,setShowModal,weekDateStrings}:MealCarouselProps) => {
    const {
        mealState,
        setMealState
      } = useContext(MealContext);

    const addClick = (dayString:string, mealType:string) => {
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
        await db.meals.delete(meal.id || 0);
    }

    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {meals && weekDateStrings.map((dayString) => {
                        const currDayMealData = meals[dayString];
                        if(!currDayMealData) {
                            return false;
                        }
                        return (
                            <CarouselItem>
                                    <div className="mb-1 flex flex-col justify-center items-center text-sm font-bold">
                                        <p className='weekdayText'>{localeFormat(new Date(dayString),"{EEE}")}</p>
                                        <p className='weekdayText'>{`${localeFormat(new Date(dayString),"{MMM}")} ${dayString.split('-')[1]}`}</p>
                                    </div>
                                    {Object.keys(currDayMealData).map((mealType, index) => {
                                        const meal = currDayMealData[mealType as keyof typeof currDayMealData];
                                        return (
                                            <Card className='h-[26%] mb-4 p-4 relative'>
                                                <CardHeader>
                                                    <CardTitle>{mealType}</CardTitle>
                                                </CardHeader>
                                                { !meal &&
                                                    <div className="mobileAddBtn hover:cursor-pointer absolute bottom-5 right-5 p-2 rounded-full bg-primary text-white  z-10 text-6xl font-semibold" onClick={(e)=>addClick(dayString, mealType)}>
                                                        <PlusIcon />
                                                    </div>
                                                }
                                                {meal &&
                                                    <>
                                                        <Badge className='group flex flex-row text-center justify-between'>
                                                            <p>{meal.title}</p>
                                                            <div className='buttonParent flex space-around justify-end p-1'>
                                                                <Pencil size={20} strokeWidth={1} className="group-hover:cursor-pointer hover:scale-110 mr-3" onClick={(e)=>editClick(meal)} />
                                                                <Trash2Icon size={20} strokeWidth={1} className="group-hover:cursor-pointer hover:scale-110 mr-3" onClick={()=>deleteClick(meal)}/>
                                                            </div>
                                                        </Badge>
                                                    </>
                                                }
                                                <CardContent>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default MealCarousel;


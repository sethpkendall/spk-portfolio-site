import { Meal } from '@/models/interfaces';
import { createContext } from 'react';

type MealContextState = Omit<Meal, "date"> & {
    date: Date | undefined | null;
};

type MealContextType = {
    mealState: MealContextState;
    setMealState: (value: MealContextState) => void;
};

export const MealContext = createContext<MealContextType>({} as MealContextType);

import { Meal } from '@/models/interfaces';
import { createContext, useContext, useState } from 'react';

type MealContextType = {
    mealState: Meal;
    setMealState: (value:Meal) => void;
};

export const MealContext = createContext<MealContextType>({} as MealContextType);

export function useMealContext() {
    return useContext(MealContext);
}
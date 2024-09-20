import { Meal } from '@/models/interfaces';
import { createContext, useContext, useState } from 'react';

type MealContextType = {
    mealState: {
        id: number | undefined;title: string, date: Date | undefined | null, type: string
};
    setMealState: (value:{id: number | undefined; title: string; date: Date | undefined | null; type: string;}) => void;
};

export const MealContext = createContext<MealContextType>({} as MealContextType);

export function useMealContext() {
    return useContext(MealContext);
}
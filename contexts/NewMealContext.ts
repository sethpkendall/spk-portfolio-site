import { Meal } from '@/models/interfaces';
import { createContext, useContext, useState } from 'react';

type NewMealContextType = {
    newMealState: Meal;
    setNewMealState: (value:Meal) => void;
};

export const NewMealContext = createContext<NewMealContextType>({} as NewMealContextType);

export function useNewMealContext() {
    return useContext(NewMealContext);
}
"use client"
import { useEffect, useState } from 'react';
import { NewMealContext } from '@/contexts/NewMealContext';
import { createPortal } from 'react-dom';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/models/db";
// component imports
import MealPlannerTool from "./components/MealPlannerTool";
import AddMealModal from "./components/AddMealModal";
import { start } from 'repl';
import { getWeekDateStrings } from '@/lib/utils';
import { set } from 'date-fns';
import { de } from 'date-fns/locale';

export default function MealPlanner() {
  const [currentShownWeek, setCurrentShownWeek] = useState(new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0,0,0,0)));
  const [showModal, setShowModal] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const [mealState, setMealState] = useState({});
  const [mealDatabase, setMealDatabase] = useState<Meal[]>([]);
  const [mealPlannerHeight, setMealPlannerHeight] = useState(200);
  const [newMealState, setNewMealState] = useState({
    title: '',
    date: null,
    type: ''
  });

  useLiveQuery(async () => {
    // store all meals in state
    const allMeals = await db.meals.toArray();
    const mealDB:{label:string,value:Meal}[] = [];
    allMeals.forEach((meal) => {
      if(!mealDB.some((dbMeal) => dbMeal.label === meal.title)) {
        mealDB.push({label: meal.title, value: meal});
      }
    });
    setMealDatabase(mealDB);
    // get meals for this week
    const startDate = currentShownWeek;
    const endDate = new Date(new Date(new Date().setDate(new Date().getDate() + (6 - new Date().getDay()))).setHours(23,59));
    const currentWeekMealState: { [key: string]: { breakfast: any, lunch: any, dinner: any } } = {};
    // create 7 needed date keys
    const weekDateStrings = getWeekDateStrings(startDate);
    for(const currentDateString of weekDateStrings) {
      currentWeekMealState[currentDateString] = {
        breakfast: null,
        lunch: null,
        dinner: null,
      };
    }
    // iterate meal results
    const meals = await db.meals.where("date").between(startDate, endDate, true, true).toArray();
    for(const meal of meals) {
      const mealDate = new Date(meal.date);
      if(mealDate >= startDate && mealDate < endDate) {
        const mealDateString = `${mealDate.getMonth()+1}-${mealDate.getDate()}-${mealDate.getFullYear()}`;
        currentWeekMealState[mealDateString][meal.type.toLowerCase()] = meal;
      }
    }
    setMealState(currentWeekMealState);
  });
  useEffect(() => {
    const mealPlannerTop = document.getElementsByClassName('mealPlannerToolParent')[0].getBoundingClientRect().top;
    const plannerToolHeight = window.innerHeight - mealPlannerTop - 10;
    setMealPlannerHeight(plannerToolHeight);

    if(window.innerWidth <= 768){
      setDayCount(1);
    } else {
      setDayCount(7);
    }
  }, []);

  return ( 
    <div className="container mx-auto px-5">
      <NewMealContext.Provider value={{newMealState, setNewMealState}}>
        <MealPlannerTool
                meals={mealState}
                dayCount={dayCount}
                mealPlannerHeight={mealPlannerHeight}
                shownWeek={currentShownWeek}
                setShowModal={setShowModal}
              />
        <div>
        {showModal && createPortal(
          <AddMealModal
            mealDatabase={mealDatabase}
            showModal={showModal}
            setShowModal={setShowModal}
          />,
          document.body
        )}
        </div>
      </NewMealContext.Provider>
    </div>
  );
}

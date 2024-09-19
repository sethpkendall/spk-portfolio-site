"use client"
import { useEffect, useState } from 'react';
import { MealContext } from '@/contexts/MealContext';
import { createPortal } from 'react-dom';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/models/db";
import { start } from 'repl';
import { getWeekDateStrings } from '@/lib/utils';
import { set } from 'date-fns';
import { de } from 'date-fns/locale';
import { Meal } from '@/models/interfaces';
// component imports
import MealPlannerTool from "./components/MealPlannerTool";
import AddMealModal from "./components/AddMealModal";
import EditMealModal from "./components/EditMealModal";


export default function MealPlanner() {
  const [shownWeek, setShownWeek] = useState(new Date(new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0,0,0,0)));
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const [weekMealState, setWeekMealState] = useState({});
  const [mealDatabase, setMealDatabase] = useState<{ label: string; value: Meal; }[]>([]);
  const [uniqueMealsDatabase, setUniqueMealsDatabase] = useState<{ label: string; value: Meal; }[]>([]);
  const [mealPlannerHeight, setMealPlannerHeight] = useState(200);
  const [mealState, setMealState] = useState({
    title: '',
    date: null,
    type: ''
  });

  useLiveQuery(async () => {
    // store all meals in state
    const allMeals = await db.meals.toArray();
    const allMealsDB:{label:string,value:Meal}[] = [];
    const uniqueMealsDB:{label:string,value:Meal}[] = [];
    allMeals.forEach((meal) => {
      allMealsDB.push({label: meal.title, value: meal});
      if(!uniqueMealsDB.some((dbMeal) => dbMeal.label === meal.title)) {
        uniqueMealsDB.push({label: meal.title, value: meal});
      }
    });
    setMealDatabase(allMealsDB);
    setUniqueMealsDatabase(uniqueMealsDB);
    // get meals for this week
    const startDate = shownWeek;
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
        if(!currentWeekMealState[mealDateString]) {
          break;
        }
        currentWeekMealState[mealDateString][meal.type.toLowerCase()] = meal;
      }
    }
    setWeekMealState(currentWeekMealState);
  }, [shownWeek]);
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
      <MealContext.Provider value={{mealState, setMealState}}>
        <MealPlannerTool
          meals={weekMealState}
          dayCount={dayCount}
          mealPlannerHeight={mealPlannerHeight}
          shownWeek={shownWeek}
          setShownWeek={setShownWeek}
          setShowModal={setShowModal}
          setShowEditModal={setShowEditModal}
        />
        <div>
        {showModal && createPortal(
          <AddMealModal
            uniqueMealsDatabase={uniqueMealsDatabase}
            showModal={showModal}
            setShowModal={setShowModal}
          />,
          document.body
        )}
        {showEditModal && createPortal(
          <EditMealModal
            mealDatabase={mealDatabase}
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
          />,
          document.body
        )}
        </div>
      </MealContext.Provider>
    </div>
  );
}

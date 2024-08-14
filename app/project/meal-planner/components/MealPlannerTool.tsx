import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../../models/db";
import { AddFoodForm } from "./AddFoodForm";

export default function MealPlannerTool() {
    const foods = useLiveQuery(() => db.foods.toArray());
    console.log(foods);
    return(
        <div className="mealPlannerToolParent">
            <AddFoodForm/>
        </div>
    )
}
import { db } from "./db";

export async function populate() {
  const mealId = await db.meals.add({
    title: "Burger Dinner"
  });
  const foodId1 = await db.foods.add({
    mealId,
    title: "Hamburgers"
  });
  const foodId2 = await db.foods.add({
    mealId,
    title: "French Fries"
  });
  const foodId3 = await db.foods.add({
    mealId,
    title: "Garden Salad"
  });
  await db.recipes.bulkAdd([
    {
        mealId,
        foodId:foodId1
    },
    {
        mealId,
        foodId:foodId2
    },
    {
        mealId,
        foodId:foodId3
    }
  ]);
}

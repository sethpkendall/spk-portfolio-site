import { mpDB, gkDB } from "./db";

export async function gkPopulate() {
    const sessionId = await gkDB.sessions.add({
        title: "Session title",
        startDate: new Date(),
        endDate: new Date(),
        baseReward: "base reward",
        baseRewardValue: 1,
        reachReward: "reach reward",
        reachRewardValue: 2
      });
}

export async function mpPopulate() {
  const mealId = await mpDB.meals.add({
    title: "Burger Dinner",
    date: new Date(),
    type: "Dinner"
  });
  const foodId1 = await mpDB.foods.add({
    mealId,
    title: "Hamburgers"
  });
  const foodId2 = await mpDB.foods.add({
    mealId,
    title: "French Fries"
  });
  const foodId3 = await mpDB.foods.add({
    mealId,
    title: "Garden Salad"
  });
  await mpDB.recipes.bulkAdd([
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

import { mpDB, gkDB } from "./db";

export async function gkPopulate() {
    const logId1 = await gkDB.logs.add({
        value: 1,
        date: new Date("1/3/2025"),
    });

    const logId2 = await gkDB.logs.add({
        value: .5,
        date: new Date("1/3/2025"),
    });

    const goalId = await gkDB.goals.add({
        title: "Learn to ride a bike",
        type: "stepUp",
        baseLabel: "hours",
        baseValue: 5,
        reachLabel: "hours",
        reachValue: 8,
        countFrequency: "week",
        logs: [logId1, logId2]

    });

    const sessionId = await gkDB.sessions.add({
        title: "Session title",
        startDate: new Date("1/1/2025"),
        endDate: new Date("4/1/2025"),
        baseReward: "base reward",
        baseRewardValue: 1,
        reachReward: "reach reward",
        reachRewardValue: 2,
        goals: [goalId]
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

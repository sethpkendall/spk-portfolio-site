import { mpDB, gkDB } from "./db";

export async function gkPopulate() {
    const workoutLogIds: number[] = [];
    const workoutLogTestingData = [
        {
            date: new Date("7/1/2025"),
            value: 1
        },
        {
            date: new Date("7/3/2025"),
            value: 1
        },
        {
            date: new Date("7/4/2025"),
            value: 1
        },
        {
            date: new Date("7/4/2025"),
            value: 1
        },
        {
            date: new Date("7/5/2025"),
            value: 1
        },
        {
            date: new Date("7/6/2025"),
            value: 1
        },
        {
            date: new Date("7/7/2025"),
            value: 1
        },
        {
            date: new Date("7/7/2025"),
            value: 1
        },
        {
            date: new Date("7/8/2025"),
            value: 1
        },
        {
            date: new Date("7/9/2025"),
            value: 1
        }
    ];
    await Promise.all(workoutLogTestingData.map(async (logData) => {
        workoutLogIds.push(await gkDB.logs.add(logData));
    }));

    const workoutGoalId = await gkDB.goals.add({
        title: "4 or 5 weekly workouts",
        type: "stepUp",
        baseLabel: "base goal",
        baseValue: 4,
        basePoints: 8,
        reachLabel: "reach goal",
        reachValue: 5,
        countFrequency: "week",
        logs: workoutLogIds,
        unit: "workouts"
    });

    const codingLogIds: number[] = [];
    const codingLogTestingData = [
        {
            date: new Date("7/1/2025"),
            value: 30
        },
        {
            date: new Date("7/2/2025"),
            value: 30
        },
        {
            date: new Date("7/3/2025"),
            value: 30
        },
        {
            date: new Date("7/4/2025"),
            value: 30
        },
        {
            date: new Date("7/5/2025"),
            value: 30
        },
        {
            date: new Date("7/6/2025"),
            value: 20
        },
        {
            date: new Date("7/7/2025"),
            value: 30
        },
        {
            date: new Date("7/8/2025"),
            value: 30
        },
        {
            date: new Date("7/9/2025"),
            value: 30
        },
        {
            date: new Date("7/10/2025"),
            value: 20
        },
    ];
    await Promise.all(codingLogTestingData.map(async (logData) => {
        codingLogIds.push(await gkDB.logs.add(logData));
    }));

    const codingGoalId = await gkDB.goals.add({
        title: "Daily Coding",
        type: "countUp",
        baseLabel: "20 minutes of coding",
        baseValue: 20,
        basePoints: 7,
        reachLabel: "30 minutes of coding",
        reachValue: 30,
        countFrequency: "day",
        logs: codingLogIds,
        unit: "minutes"
    });

    const sessionId = await gkDB.sessions.add({
        title: "July 2025 Goals",
        startDate: new Date("7/1/2025"),
        endDate: new Date("7/31/2025"),
        baseReward: "Concert ticket",
        baseRewardValue: 1,
        reachReward: "New snowboard",
        reachRewardValue: 2,
        goals: [workoutGoalId, codingGoalId]
    });
    
}

export async function mpPopulate() {
  const mealId = await mpDB.meals.add({
    title: "Burger Dinner",
    date: new Date(),
    type: "Dinner"
  });
  const foodId1 = await mpDB.foods.add({
    title: "Hamburgers"
  });
  const foodId2 = await mpDB.foods.add({
    title: "French Fries"
  });
  const foodId3 = await mpDB.foods.add({
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
